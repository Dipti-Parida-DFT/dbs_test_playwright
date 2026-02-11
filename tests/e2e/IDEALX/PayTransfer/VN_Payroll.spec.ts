// tests/VN_Payroll.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
//import { PaymentsPages } from '../../../pages/IDEALX/index';

// (Optional) test-history + screenshot hook (Playwright utils we converted)
//import { recordTestResult, PROJECT_TYPE } from '../utils/playwrightUtils';

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/VN_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;

// --- Environment flags ---
const SIT = (process.env.ENV?.toUpperCase() === 'SIT');

const loginCompanyId = SIT ? testData.Payroll.SIT.loginCompanyId : testData.Payroll.UAT.loginCompanyId;
const loginUserId    = SIT ? testData.Payroll.SIT.loginUserId    : testData.Payroll.UAT.loginUserId;
const fromAccount    = SIT ? testData.Payroll.SIT.fromAccount    : testData.Payroll.UAT.fromAccount;
const payeeBankID    = SIT ? testData.Payroll.SIT.payeeBankID    : testData.Payroll.UAT.payeeBankID;

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

  //We should write Add New Payee, capture reference as helper methods to avoid code duplication
  test('Cannot create Payroll with item amount > 500000000 VND', async ({ page }) => {
    
    // Payments → Transfer Center → Payroll
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    //await pages.TransferCentersPage.waitForTransferCenterReady();

    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // From account (type + Enter, works for most typeahead controls)
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

    // Amount > max + details
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.moreThanMaxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Inline error
    await expect(pages.PayrollPage.amountInlineError).toContainText(testData.Payroll.amountErrorTip);

    // Try Next → expect top-level/banner error
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

  test('Create Payroll with item amount equal to 500000000 VND', async ({ page }) => {
    // Payments → Transfer Center → Payroll
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    //await pages.TransferCentersPage.waitForTransferCenterReady();

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // From account
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

    // Amount = max; add details and submit
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // If you just want the full banner text:
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    const reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Find it again in Transfer Center by reference
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    //await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.PayrollPage.waitForViewPaymentPageReady();

    // Assertions
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.PayrollPage.amountViewLabel).toContainText(testData.Payroll.maxAmount);
  });

  test('Create payroll with Total amount > 500000000 IDR', async ({ page }) => {
    // Payments → Transfer Center → Payroll
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    //await pages.TransferCentersPage.waitForTransferCenterReady();

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
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

    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Add an existing payee to exceed total
    await pages.PayrollPage.safeClick(pages.PayrollPage.existingPayeeTabHeader);
    await pages.PayrollPage.safeFill(pages.PayrollPage.existingPayeeFilter, testData.Payroll.bulkExistingPayee);
    await pages.PayrollPage.safeClick(pages.PayrollPage.addExistingPayeeButton);

    //await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.amount.first().fill(testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    //await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);
    await pages.PayrollPage.paymentDetailsTextarea.first().fill(testData.Payroll.paymentDetails);

    // Next → Preview → Submit
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Capture reference and verify
      // If you just want the full banner text:
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    const reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.PayrollPage.waitForViewPaymentPageReady();

    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
     
  });
});