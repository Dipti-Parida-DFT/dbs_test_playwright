// tests/ID_Payroll.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';


// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/ID_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;

const loginCompanyId = testData.Payroll.SIT.loginCompanyId;
const loginUserId    = testData.Payroll.SIT.loginUserId;
const fromAccount    = testData.Payroll.SIT.fromAccount;
const payeeBankID    = testData.Payroll.SIT.payeeBankID;

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('VN_Payroll (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { nickName?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
   

  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
    
  });

  test.afterEach(async ({ page }, testInfo) => {
  // Only cleanup if the test passed
  if (testInfo.status !== 'passed') {
    console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
    return;
    }
    
  // Best-effort cleanup; never fail the test because cleanup failed
  for (const p of createdPayees) {
    try {
      const key = p.nickName ?? p.accountNumber ?? '';
      await pages.PayrollPage.deletePayeeByFilter(key, /* confirm */ true);
      console.log(`[cleanup] Deleted payee with key: ${key}`);
    } catch (err) {
      console.warn('[cleanup] Failed to delete a payee:', err);
    }
  }
  });

  test('TC001_IDPayroll - Cannot create Payroll with item amount > 1000000000 IDR', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    // Step 3: Click on VN Payroll icon
    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Reusable helper for add new payee
    const { nickName, accountNumber }  = await pages.PayrollPage.addNewPayee({
      name: testData.Payroll.newPayeeName,
      nickName: testData.Payroll.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.Payroll.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // Step 5: Enter Amount > max + details
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.moreThanMaxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 6: Validate Inline error
    await expect(pages.PayrollPage.amountInlineError).toContainText(testData.Payroll.amountErrorTip);

    // Step 7: Next → Validate banner error
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
        
    const globalError = page.locator([
      '.alert.alert-error',
      '.error', '.error-message', '.form-error',
      '.toast', '.toast-error',          // generic toasts
      '.alert', '.alert-danger',         // Bootstrap-like
      '.ant-message', '.ant-message-error', '.ant-notification-notice', // Ant Design
      '.MuiAlert-root',                  // Material UI
      '.invalid-feedback'                // Common form feedback
    ].join(', '));

    await expect(globalError).toBeVisible({ timeout: 30000 });
    await expect(globalError).toContainText(testData.Payroll.errorMessage);
    
  });

  test('TC002_IDPayroll - Create Payroll with item amount equal to 1000000000 IDR', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    // Step 3: Click on VN Payroll icon
    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Reusable helper for add new payee
        const { nickName, accountNumber }  = await pages.PayrollPage.addNewPayee({
          name: testData.Payroll.newPayeeName,
          nickName: testData.Payroll.newPayeeNickName,
          bankId: payeeBankID,
          accountNumber: testData.Payroll.newPayeeAcctNumber,
        });

      // Register for cleanup
      createdPayees.push({ nickName, accountNumber });

    // Step 5: Enter Amount = max + details
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 6: Next → Preview → Submit
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Step 7: Capture reference
    const referenceText = await pages.PayrollPage.getReferenceText();
    const reference = await pages.PayrollPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.PayrollPage.waitForViewPaymentPageReady();

    // Step 9: Verify from account in view payment page
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.PayrollPage.amountViewLabel).toContainText(testData.Payroll.maxAmount);
  });

  test('TC003_IDPayroll - Create payroll with Total amount > 1000000000 IDR', async ({ page }) => {
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    // Step 3: Click on VN Payroll icon
    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Reusable helper for add new payee
      const { nickName, accountNumber }  = await pages.PayrollPage.addNewPayee({
        name: testData.Payroll.newPayeeName,
        nickName: testData.Payroll.newPayeeNickName,
        bankId: payeeBankID,
        accountNumber: testData.Payroll.newPayeeAcctNumber,
      });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // Step 5: Enter Amount = max for first item + details
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 6: Add an existing payee to exceed total
    await pages.PayrollPage.safeClick(pages.PayrollPage.existingPayeeTabHeader);
    await pages.PayrollPage.safeFill(pages.PayrollPage.existingPayeeFilter, testData.Payroll.bulkExistingPayee);
    await pages.PayrollPage.safeClick(pages.PayrollPage.addExistingPayeeButton);

     // Step 7: Enter Amount = max for second item + details
    await pages.PayrollPage.amount.first().fill(testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.paymentDetailsTextarea.first().fill(testData.Payroll.paymentDetails);

    // Step 8: Next → Preview → Submit
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    //Step 9: Capture reference
    const referenceText = await pages.PayrollPage.getReferenceText();
    const reference = await pages.PayrollPage.getReferenceID();

    // Step 10: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.PayrollPage.waitForViewPaymentPageReady();
    
    // Step 11: Verify from account in view payment page
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
  });
});