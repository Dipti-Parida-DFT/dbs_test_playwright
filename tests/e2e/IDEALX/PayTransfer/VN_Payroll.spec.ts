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
   

  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');
    // 1) Login
    // await new NavigatePages(page).loginIdealx(
    //   loginCompanyId,
    //   loginUserId,
    //   '123123', // PIN/password
      
    //   {
    //     // loginUrl: process.env.IDEALX_URL, // set if you want to enforce a URL
    //     expectLanding: 'Payments',
    //     freshSession: true,
    //   }
    //);

    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Optional: write history CSV + attach screenshot on failure
    
  });

  //We should write Add New Payee, capture reference as helper methods to avoid code duplication
  test.only('Cannot create Payroll with item amount > 500000000 VND', async ({ page }) => {
    
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
    

    // New Payee
    await pages.PayrollPage.safeClick(pages.PayrollPage.newPayeeTab);
    await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeName, testData.Payroll.newPayeeName);
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeName.blur();
    await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeNickName, testData.Payroll.newPayeeNickName);
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeNickName.blur();

    //await pages.PayrollPage.safeFill(pages.PayrollPage.payeeBankId, payeeBankID);
    await pages.PayrollPage.payeeBankId.click();
    await pages.PayrollPage.payeeBankId.fill(payeeBankID);
    await pages.PayrollPage.payeeBankId.blur();

    await pages.PayrollPage.safeClick(pages.PayrollPage.findBankIDButton);
    await pages.PayrollPage.payeeBankSearchResults.first().click();
        
    //await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeAccountNumber, testData.Payroll.newPayeeAcctNumber);
    await pages.PayrollPage.safeClick(pages.PayrollPage.newPayeeAccountNumber);
        
    // Put value into browser clipboard
    await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, testData.Payroll.newPayeeAcctNumber);

    // Paste (Ctrl+V)
    await page.keyboard.press('Control+V');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeAccountNumber.blur();

    await pages.PayrollPage.safeClick(pages.PayrollPage.addNewPayeeButton);

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

    // New Payee
    await pages.PayrollPage.safeClick(pages.PayrollPage.newPayeeTab);
    await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeName, testData.Payroll.newPayeeName);
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeName.blur();
    await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeNickName, testData.Payroll.newPayeeNickName);
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeNickName.blur();

    //await pages.PayrollPage.safeFill(pages.PayrollPage.payeeBankId, payeeBankID);
    await pages.PayrollPage.payeeBankId.click();
    await pages.PayrollPage.payeeBankId.fill(payeeBankID);
    await pages.PayrollPage.payeeBankId.blur();

    await pages.PayrollPage.safeClick(pages.PayrollPage.findBankIDButton);
    await pages.PayrollPage.payeeBankSearchResults.first().click();
    //await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeAccountNumber, testData.Payroll.newPayeeAcctNumber);
    await pages.PayrollPage.safeClick(pages.PayrollPage.newPayeeAccountNumber);
        
    // Put value into browser clipboard
    await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, testData.Payroll.newPayeeAcctNumber);

    // Paste (Ctrl+V)
    await page.keyboard.press('Control+V');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeAccountNumber.blur();

    await pages.PayrollPage.safeClick(pages.PayrollPage.addNewPayeeButton);

    // Amount = max; add details and submit
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Capture reference (adjust if reference appears elsewhere)
    const reference = (await pages.PayrollPage.referenceLabel.textContent())?.trim() ?? '';

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

    // First payee
    await pages.PayrollPage.safeClick(pages.PayrollPage.newPayeeTab);
    await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeName, testData.Payroll.newPayeeName);
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeName.blur();
    await pages.PayrollPage.safeFill(pages.PayrollPage.newPayeeNickName, testData.Payroll.newPayeeNickName);
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeNickName.blur();

    //await pages.PayrollPage.safeFill(pages.PayrollPage.payeeBankId, payeeBankID);
    await pages.PayrollPage.payeeBankId.click();
    await pages.PayrollPage.payeeBankId.fill(payeeBankID);
    await pages.PayrollPage.payeeBankId.blur();

    await pages.PayrollPage.safeClick(pages.PayrollPage.findBankIDButton);
    await pages.PayrollPage.payeeBankSearchResults.first().click();

    await pages.PayrollPage.safeClick(pages.PayrollPage.newPayeeAccountNumber);
        
    // Put value into browser clipboard
    await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, testData.Payroll.newPayeeAcctNumber);

    // Paste (Ctrl+V)
    await page.keyboard.press('Control+V');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await pages.PayrollPage.newPayeeAccountNumber.blur();

    await pages.PayrollPage.safeClick(pages.PayrollPage.addNewPayeeButton);

    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Add an existing payee to exceed total
    await pages.PayrollPage.safeClick(pages.PayrollPage.existingPayeeTabHeader);
    await pages.PayrollPage.safeFill(pages.PayrollPage.existingPayeeFilter, testData.Payroll.bulkExistingPayee);
    await pages.PayrollPage.safeClick(pages.PayrollPage.addExistingPayeeButton);

    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Next → Preview → Submit
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Capture reference and verify
    const reference = (await pages.PayrollPage.referenceLabel.textContent())?.trim() ?? '';

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.PayrollPage.waitForViewPaymentPageReady();

    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
    // Optionally assert status here if you have a stable selector, e.g.:
    // await expect(pages.PayrollPage.transactionStatusLabel1).toContainText('EXPECTED_STATUS');
  });
});