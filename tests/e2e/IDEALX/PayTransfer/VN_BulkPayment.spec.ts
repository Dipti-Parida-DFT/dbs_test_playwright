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

// --- Environment flags ---
const SIT = (process.env.ENV?.toUpperCase() === 'SIT');

const loginCompanyId = SIT ? testData.BulkPayment.SIT.loginCompanyId : testData.BulkPayment.UAT.loginCompanyId;
const loginUserId    = SIT ? testData.BulkPayment.SIT.loginUserId    : testData.BulkPayment.UAT.loginUserId;
const fromAccount    = SIT ? testData.BulkPayment.SIT.fromAccount    : testData.BulkPayment.UAT.fromAccount;
const payeeBankID    = SIT ? testData.BulkPayment.SIT.payeeBankID    : testData.BulkPayment.UAT.payeeBankID;

test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('VN_Bulk Payment (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;

  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;

    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');

    pages = new PaymentsPages(page);
  });


  //We should write Add New Payee, capture reference as helper methods to avoid code duplication
  // ─────────────────────────────────────────────────────────────────────────────
  test('Cannot create Bulk Payment with item amount > 500000000 VND', async ({ page }) => {
    // Payments menu → (auth if appears) → open Bulk Payment
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.paymentMenu.click({ force: true });
    await pages.AccountTransferPage.handleAuthIfPresent('1111');

     // await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

    // From Account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('Enter');

    //Add New Payee
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.newPayeeTab);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.newPayeeName, testData.BulkPayment.newPayeeName);

    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.payeeBankId, payeeBankID);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.findBankIDButton);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.payeeBankSearchResults.first());

    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.newPayeeAccountNumber, testData.BulkPayment.newPayeeAcctNumber);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.addNewPayeeButton);

    // Amount > max (validates inline error + banner error after Next)
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.moreThanMaxAmountIx);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    await expect(pages.BulkPaymentPage.amountInlineError)
      .toContainText(testData.BulkPayment.amountErrorTip);

    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);

    // Generic banner error container
    const globalError = page.locator('[role="alert"], .error, .error-message, .form-error, .toast-error');
    await expect(globalError).toContainText(testData.BulkPayment.errorMessage);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  test('Create Bulk Payment with item amount equal to 500000000 VND', async ({ page }) => {
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.paymentMenu.click({ force: true });
    await pages.AccountTransferPage.handleAuthIfPresent('1111');

    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

   // From Account
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
   await page.keyboard.type(fromAccount);
   await page.keyboard.press('Enter');

   //Add New Payee
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.newPayeeTab);
   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.newPayeeName, testData.BulkPayment.newPayeeName);

   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.payeeBankId, payeeBankID);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.findBankIDButton);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.payeeBankSearchResults.first());

   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.newPayeeAccountNumber, testData.BulkPayment.newPayeeAcctNumber);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.addNewPayeeButton);

   //Amount = max
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountIx);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);


    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();

    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Capture reference (soft)
    const reference = (await pages.BulkPaymentPage.referenceValue.textContent())?.trim() ?? '';

    // Optional cross-check via Transfer Center (only if reference captured)
    if (reference) {
      await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
      await pages.TransferCentersPage.waitForTransferCenterReady();
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    }

    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    await expect(pages.BulkPaymentPage.fromAccountView).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.maxAmount);
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

   //Add New Payee
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.newPayeeTab);
   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.newPayeeName, testData.BulkPayment.newPayeeName);

   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.payeeBankId, payeeBankID);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.findBankIDButton);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.payeeBankSearchResults.first());

   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.newPayeeAccountNumber, testData.BulkPayment.newPayeeAcctNumber);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.addNewPayeeButton);

   //Amount = max
   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountIx);
   await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
   await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);


    // Add existing payee to exceed total
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.existingPayeeTabIx);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.filterExistingPayee, testData.BulkPayment.bulkExistingPayee);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.addButton);

    // Increase total again
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountIx);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Capture reference (soft) and verify
    const reference = (await pages.BulkPaymentPage.referenceValue.textContent())?.trim() ?? '';

    if (reference) {
      await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
      await pages.TransferCentersPage.waitForTransferCenterReady();
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    }

    await pages.BulkPaymentPage.waitForViewPaymentPageReady();
    await expect(pages.BulkPaymentPage.fromAccountView).toContainText(fromAccount);
    // Add a status assertion if you have a stable selector exposed on view page.
    // await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText('EXPECTED_STATUS');
  });
});