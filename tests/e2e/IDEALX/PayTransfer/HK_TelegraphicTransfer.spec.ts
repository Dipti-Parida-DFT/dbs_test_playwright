/**
   * Author: LC5764725
   * Created Date: 03/14/26
   * This Class "tests/PayTransfer/HK_TelegraphicTransfer.spec.ts"
   * Description: This class has four test cases.
   * 1) TC001_HK_TelegraphicTransfer - Create A TT Payment Without Purpose Code
   * 2) TC002_HK_TelegraphicTransfer - Create A TT Payment With Purpose Code And Payment Details
   * 3) TC003_HK_TelegraphicTransfer - Edit A HK TT Payment Via Transfer Center
   * 4) TC004_HK_TelegraphicTransfer - Copy A TT Payment With Purpose Code For INR CCY
   */

// tests/HK_TelegraphicTransfer.spec.ts
import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';

const testDataPath = path.resolve(__dirname, '../../../data/HK_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// ─── Credentials (single environment) ───────────────────────────────────────
const loginCompanyId = testData.TelegraphicTransfer.loginCompanyId;
const loginUserId    = testData.TelegraphicTransfer.loginUserId;
const fromAccountNP  = testData.TelegraphicTransfer.fromAccountNP;

// ─── Shared references passed between tests (backend data dependency) ───────
let reference2: string | undefined;    // created in TC002, used in TC003

// ─── Shared login helper ────────────────────────────────────────────────────
async function doLogin(page: Page, userId: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginCompanyId, userId, '123');
}

// ─── Global test configuration ──────────────────────────────────────────────
// We run serial because tests depend on IDs created by earlier tests.
test.describe.configure({ mode: 'serial' });
test.use({ storageState: undefined });     // ensure fresh context (session) per test
test.setTimeout(8_000_000);

// Provide a per-test `pages` object, created after login.
let pages: PaymentsPages;

// Each test gets a fresh context + page (Playwright default), we then login.
test.beforeEach(async ({ page }) => {
  await doLogin(page, loginUserId);
  pages = new PaymentsPages(page);
});

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS (each runs in its own fresh browser context + login)
// ═══════════════════════════════════════════════════════════════════════════════

test('TC001_HK_TelegraphicTransfer - Create A TT Payment Without Purpose Code', { tag: ['@TelegraphicTransfer', '@HK'] }, async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Fill in the form with valid from account data but do not select a purpose code
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newHKPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForCNYCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeTab);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.existingPayeeBankAccount, testData.TelegraphicTransfer.existingPayee);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingHKPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.bankChargesOurRadioButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.orderingBankMsg);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.orderingBankMsg, testData.TelegraphicTransfer.transactionNote);
  // Step 2: Attempt to proceed to the next step without selecting a purpose code
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  // Step 3: Verify that the appropriate error message is displayed regarding the missing purpose code
  await expect(pages.TelegraphicTransferPage.unixErrorMessage).toContainText(testData.TelegraphicTransfer.errorMessage);

});

test('TC002_HK_TelegraphicTransfer - Create A TT Payment With Purpose Code And Payment Details', async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Fill in the form with valid data, including selecting a purpose code and entering payment details
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newHKPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForCNYCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeTab);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.existingPayeeBankAccount, testData.TelegraphicTransfer.existingPayee);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingHKPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.intermediaryBankCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryBankLocation);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.intermediaryBankLocation, testData.TelegraphicTransfer.intermediaryBankCountry);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryCNYLocation);
  await pages.TelegraphicTransferPage.intermediaryBankLocation.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryBankId); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.intermediaryBankId, testData.TelegraphicTransfer.intermediaryBankID);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.intermediaryBankId.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.findIntermediaryBankIDButton);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryCNYbankID);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCode.first());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.inputNewTTPurposeCode.first());
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.inputNewTTPurposeCode.first(), testData.TelegraphicTransfer.purposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newHKPurposeCodeDropdown);
  await pages.TelegraphicTransferPage.newTTPurposeCode.first().blur();
  await pages.TelegraphicTransferPage.bankChargesOurRadioButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPaymentRemark);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPaymentRemark, testData.TelegraphicTransfer.messageToOrderingBank);
  await pages.TelegraphicTransferPage.newTTPaymentRemark.blur();
  await pages.TelegraphicTransferPage.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail1); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail1, testData.TelegraphicTransfer.emailIdO);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail1.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail2); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail2, testData.TelegraphicTransfer.emailId1);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail2.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail3); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail3, testData.TelegraphicTransfer.emailId2);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail3.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail4); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail4, testData.TelegraphicTransfer.emailId3);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail4.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail5); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail5, testData.TelegraphicTransfer.emailId4);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail5.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeRemark);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeRemark, testData.TelegraphicTransfer.message);
  await pages.TelegraphicTransferPage.newTTPayeeRemark.blur();
  await pages.TelegraphicTransferPage.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.additionalNoteRemark);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.additionalNoteRemark, testData.TelegraphicTransfer.transactionNote);
  await pages.TelegraphicTransferPage.newTTPayeeRemark.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.orderingBankMsg);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.orderingBankMsg, testData.TelegraphicTransfer.messageToOrderingBank);
  await pages.TelegraphicTransferPage.orderingBankMsg.blur();
  // Step 2: Proceed to the next step and verify the preview page before submitting
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 3: Capture the reference ID of the newly created payment and verify the details in the Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC002 – referenceID:', reference);
  reference2 = reference; // save for later tests
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.ttApproveButton).toBeVisible();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrencyCNY);
  await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');

});

test('TC003_HK_TelegraphicTransfer - Edit A HK TT Payment Via Transfer Center', async ({ page }) => {
  // This test depends on the payment created in TC002, so we check that the reference2 variable is set before proceeding
  if (!reference2?.trim()) throw new Error('reference2 is empty – TC002 must pass first');
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  // Step 1: Search for the payment created in TC002 using its reference ID and open it
  await pages.TransferCentersPage.searchAndOpenByReference(reference2);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 2: Click the Edit button, update the amount and purpose code, and save the changes
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttEditPaymentButton);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCode.first());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.inputNewTTPurposeCode.first());
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.inputNewTTPurposeCode.first(), testData.TelegraphicTransfer.purposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newHKPurposeCodeDropdown);
  await pages.TelegraphicTransferPage.newTTPurposeCode.first().blur();
  await pages.TelegraphicTransferPage.clickNextUntilPreview();
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 3: Capture the reference ID of the edited payment (should be the same as original) and verify that the changes are reflected in the Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC003 – referenceID:', reference);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.ttApproveButton).toBeVisible();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrencyCNY);
  await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
});

test('TC004_HK_TelegraphicTransfer - Copy A TT Payment With Purpose Code For INR CCY', async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Fill in the form with valid data, selecting INR currency and INR existing payee including selecting a purpose code and entering payment details
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newHKPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccountCurrencyDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccountINRCurrencyDropdown);

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeTab);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.existingPayeeBankAccount, testData.TelegraphicTransfer.existingpayeeINR);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingINRPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.intermediaryBankCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryBankLocation);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.intermediaryBankLocation, testData.TelegraphicTransfer.intermediaryBankINRCountry);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryINRLocation);
  await pages.TelegraphicTransferPage.intermediaryBankLocation.blur();

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryBankId); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.intermediaryBankId, testData.TelegraphicTransfer.intermediaryBankINRID);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.intermediaryBankId.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.findIntermediaryBankIDButton);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.intermediaryINRbankID);
  await pages.TelegraphicTransferPage.bankChargesOurRadioButton.evaluate(el => (el as HTMLElement).click());

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCode.first());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.inputNewTTPurposeCode.first());
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.inputNewTTPurposeCode.first(), testData.TelegraphicTransfer.purposeCodeForINR);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newINRPurposeCodeDropdown);
  await pages.TelegraphicTransferPage.newTTPurposeCode.first().blur();

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPaymentRemark);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPaymentRemark, testData.TelegraphicTransfer.messageToOrderingBank);
  await pages.TelegraphicTransferPage.newTTPaymentRemark.blur();
  await pages.TelegraphicTransferPage.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail1); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail1, testData.TelegraphicTransfer.emailIdO);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail1.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail2); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail2, testData.TelegraphicTransfer.emailId1);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail2.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail3); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail3, testData.TelegraphicTransfer.emailId2);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail3.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail4); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail4, testData.TelegraphicTransfer.emailId3);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail4.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeEmail5); 
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeEmail5, testData.TelegraphicTransfer.emailId4);
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.newTTPayeeEmail5.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeRemark);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPayeeRemark, testData.TelegraphicTransfer.message);
  await pages.TelegraphicTransferPage.newTTPayeeRemark.blur();
  await pages.TelegraphicTransferPage.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.additionalNoteRemark);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.additionalNoteRemark, testData.TelegraphicTransfer.transactionNote);
  await pages.TelegraphicTransferPage.newTTPayeeRemark.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.orderingBankMsg);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.orderingBankMsg, testData.TelegraphicTransfer.messageToOrderingBank);
  await pages.TelegraphicTransferPage.orderingBankMsg.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 2: Capture the reference ID of the newly created payment
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC004 – referenceID:', reference);

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 3: Click the Copy button to create a new payment based on the existing one and update the amount and payment details
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttCopyPaymentButton);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPaymentRemark);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.newTTPaymentRemark, testData.TelegraphicTransfer.EditpaymentDetail);
  await pages.TelegraphicTransferPage.newTTPaymentRemark.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  const reference_new = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC004 – new_referenceID:', reference_new);

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference_new);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference_new);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 4: Verify that the updated amount, purpose code, and payment details are correctly reflected in the new payment
  await expect(pages.TelegraphicTransferPage.payeeMessageDetail).toContainText(testData.TelegraphicTransfer.EditpaymentDetail);
  await expect(pages.TelegraphicTransferPage.purposeCodeText).toContainText(testData.TelegraphicTransfer.purposeCodeForINR);
});