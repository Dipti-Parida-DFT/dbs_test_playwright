/**
   * Author: LC5764725
   * Created Date: 03/09/26
   * This Class "tests/PayTransfer/SG_TelegraphicTransfer.spec.ts"
   * Description: This class has seventeen test cases.
   * 1) TC001_SG_TelegraphicTransfer - Create A TT Payment With New Payee
   * 2) TC002_SG_TelegraphicTransfer - Create A TT Payment With ApprovalNow Pmchallenge
   * 3) TC003_SG_TelegraphicTransfer - Create A TT Payment With ApprovalNow Mchallenge
   * 4) TC004_SG_TelegraphicTransfer - Create A TT Payment With Save As Template
   * 5) TC005_SG_TelegraphicTransfer - Create A TT Payment From Template
   * 6) TC006_SG_TelegraphicTransfer - Create A TT With Save As Draft
   * 7) TC007_SG_TelegraphicTransfer - Copy A TT Payment Via Transfer Center
   * 8) TC008_SG_TelegraphicTransfer - Edit A TT Payment Via Transfer Center 
   * 9) TC009_SG_TelegraphicTransfer - Reject A TT Payment Via Transfer Center
   *10) TC010_SG_TelegraphicTransfer - Delete A TT Payment Via Transfer Center
   *11) TC011_SG_TelegraphicTransfer - Create A TT Payment With Currency As SGD And Payee Bank Supports PARTIOR
   *12) TC012_SG_TelegraphicTransfer - Approve A TT Payment For PARTIOR
   *13) TC013_SG_TelegraphicTransfer - Edit a TT Payment with max amount 999999999.99 CNH
   *14) TC014_SG_TelegraphicTransfer - Verify A TT Payment Via My Verify
   *15) TC015_SG_TelegraphicTransfer - Approve A TT Payment Via Transfer Center
   *16) TC016_SG_TelegraphicTransfer - Release A TT Payment Via My Release
   *17) TC017_SG_TelegraphicTransfer - DOL User Create A TT Payment With Showing FX Savings Message Old UI
   */

// tests/SG_TelegraphicTransfer.spec.ts
import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';

const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// ─── Credentials (single environment) ───────────────────────────────────────
const loginCompanyId = testData.TelegraphicTransfer.loginCompanyId;
const loginUserId    = testData.TelegraphicTransfer.loginUserId;       // TC001–TC014
const loginUserIdAlt = testData.TelegraphicTransfer.loginUserIdAlt;    // TC015–TC017
const fromAccountNP  = testData.TelegraphicTransfer.fromAccountNP;
const fromAccountEP  = testData.TelegraphicTransfer.fromAccountEP;
const payeeBankID    = testData.TelegraphicTransfer.payeeBankID;

// ─── Shared references passed between tests (backend data dependency) ───────
let templateNew: string | undefined;   // created in TC004, used in TC005 and TC014-TC016
let reference2: string | undefined;    // created in TC001, used in TC007-TC010
let reference3: string | undefined;    // created in TC011, used in TC012
let copyreference: string | undefined; // created in TC007, used in TC014-TC016

// ─── Helper: determine which credential group a test belongs to ─────────────
// New rule: TC001–TC014 => primary; TC015–TC017 => alt
function isAltUser(title: string): boolean {
  const m = /^TC(\d+)/i.exec(title);
  return !!m && Number(m[1]) >= 15;
}

// ─── Shared login helper ────────────────────────────────────────────────────
async function doLogin(page: Page, userId: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginCompanyId, userId, '123');
}

// ─── Global test configuration ──────────────────────────────────────────────
// We run serial because tests depend on IDs created by earlier tests.
test.use({ storageState: undefined });     // ensure fresh context (session) per test
test.setTimeout(8_000_000);

// Provide a per-test `pages` object, created after login.
let pages: PaymentsPages;

// Each test gets a fresh context + page (Playwright default), we then login.
test.beforeEach(async ({ page }, testInfo) => {
  const alt = isAltUser(testInfo.title);
  await doLogin(page, alt ? loginUserIdAlt : loginUserId);
  pages = new PaymentsPages(page);
});

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS (each runs in its own fresh browser context + login)
// ═══════════════════════════════════════════════════════════════════════════════

test('TC001_SG_TelegraphicTransfer - Create A TT Payment With New Payee', async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Payment from => Select account from "Account" dropdown and enter amount
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountNP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
  // Step 2: Payment from => Click "New payee" tab and enters details
  await pages.TelegraphicTransferPage.addNewTTPayee({
    name:                     testData.TelegraphicTransfer.name,
    nickName:                 testData.TelegraphicTransfer.nickName,
    add1:                     testData.TelegraphicTransfer.add1,
    add2:                     testData.TelegraphicTransfer.add2,
    city:                     testData.TelegraphicTransfer.city,
    bankId:                   payeeBankID,
    routingCode:              testData.TelegraphicTransfer.routingCode,
    accountNumber:            testData.TelegraphicTransfer.accountNumber,
    intermediaryBankLocation: testData.TelegraphicTransfer.intermediaryBankLocation,
    intermediaryBankId:       testData.TelegraphicTransfer.intermediaryBankId,
    bankChargeType:           testData.TelegraphicTransfer.bankChargeTypeOUR,
    purposeCode:              testData.TelegraphicTransfer.purposeCode,
    payeeBankMsg:             testData.TelegraphicTransfer.bankMessage,
    email1:                   testData.TelegraphicTransfer.emailId0,
    email2:                   testData.TelegraphicTransfer.emailId1,
    email3:                   testData.TelegraphicTransfer.emailId2,
    email4:                   testData.TelegraphicTransfer.emailId3,
    email5:                   testData.TelegraphicTransfer.emailId4,
    payeeMsg:                 testData.TelegraphicTransfer.message,
    additionalNote:           testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:         testData.TelegraphicTransfer.remitterIdentity,
  });

  // Step 3: Click on Next button in New Payee form, verify details in preview page and submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC001 – referenceID:', reference);
  reference2 = reference; // store for use in TC007–TC010
  // Step 5: Click on Finish button and verify details in Transfer Center
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
  await expect(pages.TelegraphicTransferPage.newTTSelectApprovalButton).toBeVisible();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.myrPaymentCcy);
  await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
});

test('TC002_SG_TelegraphicTransfer - Create A TT Payment With ApprovalNow Pmchallenge', async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Payment from => Select account from "Account" dropdown and enter amount
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForSGDCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);

  // Step 2: Payment from => Enter details in existing payee form
  await pages.TelegraphicTransferPage.addExistingTTPayee({
    existingAccountNumber: testData.TelegraphicTransfer.existingAccountNumber,
    bankChargeType:        testData.TelegraphicTransfer.bankChargeTypeSHARED,
    payeeBankMsg:          testData.TelegraphicTransfer.bankMessage,
    email1:                testData.TelegraphicTransfer.emailId0,
    email2:                testData.TelegraphicTransfer.emailId1,
    email3:                testData.TelegraphicTransfer.emailId2,
    email4:                testData.TelegraphicTransfer.emailId3,
    email5:                testData.TelegraphicTransfer.emailId4,
    payeeMsg:              testData.TelegraphicTransfer.message,
    additionalNote:        testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:      testData.TelegraphicTransfer.remitterIdentity,
  });
  // Step 3: Click on Next button in Existing Payee form, verify details in preview page and click Approve Now checkbox, get SMS challenge, submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC002 – referenceID:', reference);
  // Step 5: Click on Finish button and verify details in Transfer Center
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTSelectApprovalButton).toBeVisible();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Partial Approved');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrency);
  await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Approve');
});

test('TC003_SG_TelegraphicTransfer - Create A TT Payment With ApprovalNow Mchallenge', async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Payment from => Select account from "Account" dropdown and enter amount
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForSGDCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  // Step 2: Payment from => Click "New payee" tab and enters details
  await pages.TelegraphicTransferPage.addNewSGTTPayee({
    name:                     testData.TelegraphicTransfer.name,
    nickName:                 testData.TelegraphicTransfer.nickName,
    add1:                     testData.TelegraphicTransfer.add1,
    add2:                     testData.TelegraphicTransfer.add2,
    city:                     testData.TelegraphicTransfer.city,
    bankId:                   testData.TelegraphicTransfer.payeeBankIDSGD,
    accountNumber:            testData.TelegraphicTransfer.accountNumber,
    purposeCode:              testData.TelegraphicTransfer.purposeCodeSGD,
  });
  // Step 3: Click on Next button in New Payee form, verify details in preview page and click Approve Now checkbox, get Mobile challenge, submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewSGDTTReferenceID();
  console.log('TC003 – referenceID:', reference);
  // Step 5: Click on Finish button and verify details in Transfer Center
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTSGDWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTSGDFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTSGDWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTSelectApprovalButton).toBeVisible();
  await expect(pages.TelegraphicTransferPage.newTTSGDRefStatusLabel).toContainText('Partial Approved');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrency);
  await expect(pages.TelegraphicTransferPage.newTTSGDReferenceValue).toContainText(reference);
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Approve');
});

test('TC004_SG_TelegraphicTransfer - Create A TT Payment With Save As Template', async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Payment from => Select account from "Account" dropdown and enter amount
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForSGDCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  // Step 2: Payment from => Enter details in existing payee form
  await pages.TelegraphicTransferPage.addExistingTTPayee({
    existingAccountNumber: testData.TelegraphicTransfer.existingAccountNumber,
    bankChargeType:        testData.TelegraphicTransfer.bankChargeTypeOUR,
    payeeBankMsg:          testData.TelegraphicTransfer.bankMessage,
    email1:                testData.TelegraphicTransfer.emailId0,
    email2:                testData.TelegraphicTransfer.emailId1,
    email3:                testData.TelegraphicTransfer.emailId2,
    email4:                testData.TelegraphicTransfer.emailId3,
    email5:                testData.TelegraphicTransfer.emailId4,
    payeeMsg:              testData.TelegraphicTransfer.message,
    additionalNote:        testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:      testData.TelegraphicTransfer.remitterIdentity,
  });
  // Step 3: Click on Next button in Existing Payee form, verify details in preview page and click Save As Template button, capture template name, submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  templateNew = await pages.TelegraphicTransferPage.ttSaveAsTemplate();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC004 – referenceID:', reference);
  // Step 5: Click on Finish button and verify payment and template details in Transfer Center
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTSelectApprovalButton).toBeVisible();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrency);
  await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateNew);
  await expect(pages.TelegraphicTransferPage.templateName).toContainText(templateNew);
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.templateStatus).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.paymentCurrency);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.logoutButton);
  // Login with new user to verify template is visible and then approve it
  const loginPage = new LoginPage(page);
  await loginPage.login(loginCompanyId, loginUserIdAlt, '123');
  pages = new PaymentsPages(page);
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateNew);
  await expect(pages.TelegraphicTransferPage.templateName).toContainText(templateNew);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttApproveButton);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.templateApproveButton);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton);
  
});

test('TC005_SG_TelegraphicTransfer - Create A TT Payment From Template', async ({ page }) => {
  //checkpoint for templateNew which is created in TC004, if it's empty then throw error to skip this test as it has dependency on TC004
  test.skip(!templateNew?.trim(), 'templateNew is empty – TC004 must pass first');
  // Payments → Transfer Center → Templates
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateNew!);
  await expect(pages.TelegraphicTransferPage.templateName).toContainText(templateNew);
  // Step 1: Click on Make a Payment button, update amount, click Next button, verify details in preview page and submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.templateMakeAPaymentButton);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 2: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC005 – referenceID:', reference);
  // Step 3: Click on Finish button and verify details in Transfer Center
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrency);
});

test('TC006_SG_TelegraphicTransfer - Create A TT With Save As Draft', async ({ page }) => {
  // Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  // Step 1: Payment from => Select account from "Account" dropdown and enter amount
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForSGDCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  // Step 2: Payment from => Enter details in existing payee form
  await pages.TelegraphicTransferPage.addExistingTTPayee({
    existingAccountNumber: testData.TelegraphicTransfer.existingAccountNumber,
    bankChargeType:        testData.TelegraphicTransfer.bankChargeTypeOUR,
    payeeBankMsg:          testData.TelegraphicTransfer.bankMessage,
    email1:                testData.TelegraphicTransfer.emailId0,
    email2:                testData.TelegraphicTransfer.emailId1,
    email3:                testData.TelegraphicTransfer.emailId2,
    email4:                testData.TelegraphicTransfer.emailId3,
    email5:                testData.TelegraphicTransfer.emailId4,
    payeeMsg:              testData.TelegraphicTransfer.message,
    additionalNote:        testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:      testData.TelegraphicTransfer.remitterIdentity,
  });
  // Step 3: Click on Save As Draft button
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttSaveAsDraftButton);
  await pages.TelegraphicTransferPage.waitForSaveAsDraft();
  // Step 4: Capture draft reference ID
  const reference = await pages.TelegraphicTransferPage.getDraftReferenceID();
  console.log('TC006 – draftReferenceID:', reference);
  // Step 5: Click on Dismiss button in Save As Draft confirmation popup, navigate to Transfer Center, search and open the draft payment using reference ID, verify details and then cancel the draft payment
  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrency);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Saved');
});

test('TC007_SG_TelegraphicTransfer - Copy A TT Payment Via Transfer Center', async ({ page }) => {
  //checkpoint for reference2 which is created in TC001, if it's empty then throw error to skip this test as it has dependency on TC001
  test.skip(!reference2?.trim(), 'Skipped because TC001 did not produce reference');
  // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC001 and open it
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 2: Click on Copy button, update account and amount, click Next button, verify details in preview page and submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttCopyPaymentButton);
  await pages.TelegraphicTransferPage.handleCognitiveContinueIfPresent();
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForSGDCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA3);
  await pages.TelegraphicTransferPage.clickNextUntilPreview();
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 3: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC007 – referenceID:', reference);
  copyreference = reference;
  // Step 4: Click on Finish button and verify details in Transfer Center
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrency);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Verification');
});

test('TC008_SG_TelegraphicTransfer - Edit A TT Payment Via Transfer Center', async ({ page }) => {
  //checkpoint for reference2 which is created in TC001, if it's empty then throw error to skip this test as it has dependency on TC001
  test.skip(!reference2?.trim(), 'Skipped because TC001 did not produce reference');
  // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC001 and open it
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 2: Click on Edit button, update amount and purpose code, click Next button, verify details in preview page and submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttEditPaymentButton);
  await pages.TelegraphicTransferPage.handleCognitiveContinueIfPresent();
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCode);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.inputNewTTPurposeCode, testData.TelegraphicTransfer.purposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCodeSelect);
  await pages.TelegraphicTransferPage.newTTPurposeCode.blur();
  await pages.TelegraphicTransferPage.clickNextUntilPreview();
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 3: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC008 – referenceID:', reference);
  reference2 = reference;

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.myrPaymentCcy);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
});

test('TC009_SG_TelegraphicTransfer - Reject A TT Payment Via Transfer Center', async ({ page }) => {
  //checkpoint for reference2 which is created in TC001, if it's empty then throw error to skip this test as it has dependency on TC001
  test.skip(!reference2?.trim(), 'Skipped because TC001 did not produce reference');
  // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC001 and open it
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 2: Click on Reject button, enter rejection reason, click Next button, verify details in preview page and submit rejection
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttRejectPaymentButton);
  await pages.TelegraphicTransferPage.waitForRejectPaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();
  // Step 3: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
  console.log('TC009 – rejectedReferenceID:', reference);

  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Rejected');
});

test('TC010_SG_TelegraphicTransfer - Delete A TT Payment Via Transfer Center', async ({ page }) => {
  //checkpoint for reference2 which is created in TC001, if it's empty then skip this test as it has dependency on TC001
  test.skip(!reference2?.trim(), 'Skipped because TC001/TC008 did not produce reference');
  // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC001 and open it
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 2: Click on Delete button, enter deletion reason, click Next button, verify details in preview page and submit deletion
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttDeletePaymentButton);
  await pages.TelegraphicTransferPage.waitForDeletePaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();
  // Step 3: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
  console.log('TC010 – deletedReferenceID:', reference);

  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.safeFill(pages.TransferCentersPage.transferCenterFilter, reference);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await expect(pages.TelegraphicTransferPage.ttDeletePaymentSuccessMessage).toContainText('No information to display');
});

test('TC011_SG_TelegraphicTransfer - Create A TT Payment With Currency As SGD And Payee Bank Supports PARTIOR', async ({ page }) => {
  // Step 1: Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForSGDCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  // Step 2: Payment from => Enter details in existing payee form with a payee whose bank supports PARTIOR
  await pages.TelegraphicTransferPage.addPartiourTTPayee({
    existingAccountNumber: testData.TelegraphicTransfer.SupportPartiorPayee,
    bankChargeType:        testData.TelegraphicTransfer.bankChargeTypeOUR,
    payeeBankMsg:          testData.TelegraphicTransfer.bankMessage,
    email1:                testData.TelegraphicTransfer.emailId0,
    email2:                testData.TelegraphicTransfer.emailId1,
    email3:                testData.TelegraphicTransfer.emailId2,
    email4:                testData.TelegraphicTransfer.emailId3,
    email5:                testData.TelegraphicTransfer.emailId4,
    payeeMsg:              testData.TelegraphicTransfer.message,
    additionalNote:        testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:      testData.TelegraphicTransfer.remitterIdentity,
  });
  // Step 3: Click on Next button in Existing Payee form, verify details in preview page and submit payment
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC011 – referenceID:', reference);
  reference3 = reference;

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrency);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
});

test('TC012_SG_TelegraphicTransfer - Approve A TT Payment For PARTIOR', async ({ page }) => {
  //checkpoint for reference3 which is created in TC011, if it's empty then throw error to skip this test as it has dependency on TC011
  test.skip(!reference3?.trim(), 'Skipped because TC011 did not produce reference');
  // Step 1: Logout from current user, as partiour payment is created with it. Login with a different user who has approval authority for TT payments, navigate to Transfer Center, search and open the payment with reference number created in TC011
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.logoutButton);
  const loginPage = new LoginPage(page);
  await loginPage.login(loginCompanyId, loginUserIdAlt, '123');
  pages = new PaymentsPages(page);
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference3!);
  // Step 2: Click on Approve button, click on Approve Now checkbox, get Mobile challenge, submit approval
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttNewApproveButton.first());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton);
  // Step 3: Verify payment status is updated to Partial Approved in Transfer Center
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference3!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Partial Approved');
});

test('TC013_SG_TelegraphicTransfer - Edit a TT Payment with max amount 999999999.99 CNH', async ({ page }) => {
  // Step 1: Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  // Step 2: Fill the TT form with CNH Payee and max amount 999999999.99 CNH
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountCNH);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.selectCurrencyDropdown, 'CNH');
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPayeeCurrencyDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.maxCNHAmount);
  // Step 3: Enter details in existing payee form, click on Next button in Existing Payee form, verify details in preview page and submit payment
  await pages.TelegraphicTransferPage.addExistingTTPayee({
    existingAccountNumber: testData.TelegraphicTransfer.existingAccountNumber,
    bankChargeType:        testData.TelegraphicTransfer.bankChargeTypeSHARED,
    payeeBankMsg:          testData.TelegraphicTransfer.bankMessage,
    email1:                testData.TelegraphicTransfer.emailId0,
    email2:                testData.TelegraphicTransfer.emailId1,
    email3:                testData.TelegraphicTransfer.emailId2,
    email4:                testData.TelegraphicTransfer.emailId3,
    email5:                testData.TelegraphicTransfer.emailId4,
    payeeMsg:              testData.TelegraphicTransfer.message,
    additionalNote:        testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:      testData.TelegraphicTransfer.remitterIdentity,
  });

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.inputNewTTPurposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPurposeCodeDropdown);
  await pages.TelegraphicTransferPage.newTTPurposeCode.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC013 – referenceID:', reference);

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountCNH);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
});

test('TC014_SG_TelegraphicTransfer - Verify A TT Payment Via My Verify', async ({ page }) => {
  //checkpoint for copyreference which is created in TC007, if it's empty then throw error to skip this test as it has dependency on TC007
  test.skip(!copyreference?.trim(), 'Skipped because TC007 did not produce reference');
  // Step 1: Logout from current user, as payment is created with it. Login with a different user who has authority to verify TT payments, navigate to My Verify and search for the payment with reference number created in TC007
  await pages.AccountTransferPage.waitForMenu();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.logoutButton);
  const loginPage = new LoginPage(page);
  await loginPage.login(loginCompanyId, loginUserIdAlt, '123');
  pages = new PaymentsPages(page);
  await pages.AccountTransferPage.waitForMenu();
  // Step 2: Click on Verify tab, search and open the payment using reference number, verify details and then click on Approve button
  await pages.ApprovalPage.safeClick(pages.ApprovalPage.approvalMenu);
  await page.waitForTimeout(2000); // Wait for 1 second to ensure the approval menu is fully loaded before handling auth
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.ApprovalPage.safeClick(pages.ApprovalPage.approvalVerifyTab);
  await pages.ApprovalPage.waitForVerifyCenterReady();
  await pages.ApprovalPage.searchVerifyAndOpenByReference(copyreference!);
  // Step 3: Verify telegraphic payment has correct details and status is Pending Approval 
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
});

test('TC015_SG_TelegraphicTransfer - Approve A TT Payment Via Transfer Center', async ({ page }) => {
  //checkpoint for copyreference which is created in TC007, if it's empty then throw error to skip this test as it has dependency on TC007
  test.skip(!copyreference?.trim(), 'Skipped because TC007 did not produce reference');
  // Step 1: Logout from current user, as payment is created with it. Login with a different user who has approval authority for TT payments, navigate to Transfer Center, search and open the payment with reference number created in TC007
  await pages.AccountTransferPage.waitForMenu();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.logoutButton);
  const loginPage = new LoginPage(page);
  await loginPage.login(loginCompanyId, loginUserId, '123');
  pages = new PaymentsPages(page);
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference!);
  // Step 2: Click on Approve button, click on Approve Now checkbox, get Mobile challenge, submit approval
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttNewApproveButton.first());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton);
  // Step 3: Verify payment status is updated to Pending Release in Transfer Center
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Release');
});

test('TC016_SG_TelegraphicTransfer - Release A TT Payment Via My Release', async ({ page }) => {
  //checkpoint for copyreference which is created in TC007, if it's empty then throw error to skip this test as it has dependency on TC007
  test.skip(!copyreference?.trim(), 'Skipped because TC007 did not produce reference');
  // Step 1: Logout from current user, as payment is created with it. Login with a different user who has authority to release TT payments, navigate to My Release and search for the payment with reference number created in TC007
  await pages.AccountTransferPage.waitForMenu();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.logoutButton);
  const loginPage = new LoginPage(page);
  await loginPage.login(loginCompanyId, loginUserIdAlt, '123');
  pages = new PaymentsPages(page);
  await pages.AccountTransferPage.waitForMenu();
  await pages.ApprovalPage.safeClick(pages.ApprovalPage.approvalMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.ApprovalPage.safeClick(pages.ApprovalPage.approveReleaseTab);
  await pages.ApprovalPage.waitForVerifyCenterReady();
  // Step 2: Click on Release button, click on Release Now checkbox, get Mobile challenge, submit release
  await pages.ApprovalPage.searchReleaseAndOpenByReference(copyreference!);
  // Step 3: Verify telegraphic payment has correct details and status is Approved
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference!);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Completed');
});

test('TC017_SG_TelegraphicTransfer - DOL User Create A TT Payment With Showing FX Savings Message Old UI', async ({ page }) => {
  // Step 1: Payments → Transfer Center → Make a Payment
  // paymentMenu => Pay & Transfer (Left option)
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  // Step 2: Fill the TT form with CNH Payee and amount between 50,000 to 999,999,999.99 CNH to verify FX savings message is shown in old UI
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountCNH);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.selectCurrencyDropdown, 'CNH');
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPayeeCurrencyDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await expect(pages.TelegraphicTransferPage.ttFXSavingsMessage).toContainText(testData.TelegraphicTransfer.savingsMsg);
  // Step 3: Enter details in existing payee form, click on Next button in Existing Payee form, verify details in preview page and submit payment
  await pages.TelegraphicTransferPage.addExistingTTPayee({
    existingAccountNumber: testData.TelegraphicTransfer.existingAccountNumber,
    bankChargeType:        testData.TelegraphicTransfer.bankChargeTypeOUR,
    payeeBankMsg:          testData.TelegraphicTransfer.bankMessage,
    email1:                testData.TelegraphicTransfer.emailId0,
    email2:                testData.TelegraphicTransfer.emailId1,
    email3:                testData.TelegraphicTransfer.emailId2,
    email4:                testData.TelegraphicTransfer.emailId3,
    email5:                testData.TelegraphicTransfer.emailId4,
    payeeMsg:              testData.TelegraphicTransfer.message,
    additionalNote:        testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:      testData.TelegraphicTransfer.remitterIdentity,
  });

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.inputNewTTPurposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPurposeCodeDropdown);
  await pages.TelegraphicTransferPage.newTTPurposeCode.blur();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await expect(pages.TelegraphicTransferPage.baseFXExchangeRate).toContainText(testData.TelegraphicTransfer.exchangeRate);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC017 – referenceID:', reference);

  await expect(pages.TelegraphicTransferPage.baseFXExchangeRate).toContainText(testData.TelegraphicTransfer.exchangeRate);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.baseFXExchangeRate).toContainText(testData.TelegraphicTransfer.exchangeRate);
});
