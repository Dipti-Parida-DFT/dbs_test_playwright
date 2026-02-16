// tests/e2e/IDEALX/PayTransfer/VN_BulkPayment.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/VN_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

const loginCompanyId = testData.BulkPayment.SIT.loginCompanyId;
const loginUserId    = testData.BulkPayment.SIT.loginUserId;
const fromAccount    = testData.BulkPayment.SIT.fromAccount;
const payeeBankID    = testData.BulkPayment.SIT.payeeBankID;

test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('VN_Bulk Payment (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { nickName?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;

    //customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');

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
  // ─────────────────────────────────────────────────────────────────────────────
  test('Cannot create Bulk Payment with item amount > 500000000 VND', async ({ page }) => {
    // Payments → Transfer Center → BulkPayment
    await pages.AccountTransferPage.waitForMenu();
    //await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.paymentMenu.click();

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent('1111');

     // await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

    // From Account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
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

    // Amount > max (validates inline error + banner error after Next)
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.moreThanMaxAmountIx);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Inline error
    await expect(pages.BulkPaymentPage.amountInlineError).toContainText(testData.BulkPayment.BulkamountErrorTip);

    // Try Next → expect top-level/banner error
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);

    // Generic banner error container
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
    await expect(globalError).toContainText(testData.BulkPayment.errorMessage);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  test('Create Bulk Payment with item amount equal to 500000000 VND', async ({ page }) => {

    // Payments → Transfer Center → BulkPayment
    await pages.AccountTransferPage.waitForMenu();
    //await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.paymentMenu.click();

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent('1111');

     // await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

    // From Account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
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

    // Amount > max (validates inline error + banner error after Next)
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountIx);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Next → Preview → Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Capture reference and verify
      // If you just want the full banner text:
    const referenceText = await pages.BulkPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    const reference = await pages.BulkPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    //await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.maxAmountIx);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  test('Create Bulk Payment with Total amount > 500000000 IDR', async ({ page }) => {
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.paymentMenu.click({ force: true });
    await pages.AccountTransferPage.handleAuthIfPresent('1111');

    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

   // From Account
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
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

   //Amount = max
   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountIx);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);


    // Add existing payee to exceed total
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.existingPayeeTabIx);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.existingPayeeFilter, testData.BulkPayment.bulkExistingPayee);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.addButton);

    // Increase total again
    await pages.BulkPaymentPage.amount.first().fill(testData.BulkPayment.maxAmountIx);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.paymentDetailsTextarea.first().fill(testData.BulkPayment.paymentDetails);

    // Next → Preview → Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Capture reference and verify
      // If you just want the full banner text:
      const referenceText = await pages.BulkPaymentPage.getReferenceText();
      console.log('Captured reference text:', referenceText);
      // If you want only the EBLV… token:
      const reference = await pages.BulkPaymentPage.getReferenceID();
      console.log('Captured referenceID:', reference);
  
      await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
      await pages.TransferCentersPage.waitForTransferCenterReady();
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
      await pages.BulkPaymentPage.waitForViewPaymentPageReady();
  
      await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    // Add a status assertion if you have a stable selector exposed on view page.
    // await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText('EXPECTED_STATUS');
  });
});