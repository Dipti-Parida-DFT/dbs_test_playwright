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
test.describe.configure({ mode: 'serial' });
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
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await page.keyboard.type(fromAccountNP);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await pages.TelegraphicTransferPage.waitForCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);

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

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC001 – referenceID:', reference);
  reference2 = reference;

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
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
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

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC002 – referenceID:', reference);

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
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
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
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);

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

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewSGDTTReferenceID();
  console.log('TC003 – referenceID:', reference);

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
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
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
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);

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

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  templateNew = await pages.TelegraphicTransferPage.ttSaveAsTemplate();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC004 – referenceID:', reference);

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

  const loginPage = new LoginPage(page);
  await loginPage.login(loginCompanyId, loginUserIdAlt, '123');
  pages = new PaymentsPages(page);
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
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
  if (!templateNew?.trim()) {
  throw new Error('templateNew is empty – TC004 must pass first');
}
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateNew);
  await expect(pages.TelegraphicTransferPage.templateName).toContainText(templateNew);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.templateMakeAPaymentButton);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC005 – referenceID:', reference);

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.amountA2);
});

test('TC006_SG_TelegraphicTransfer - Create A TT With Save As Draft', async ({ page }) => {
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
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

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttSaveAsDraftButton);
  await pages.TelegraphicTransferPage.waitForSaveAsDraft();

  const reference = await pages.TelegraphicTransferPage.getDraftReferenceID();
  console.log('TC006 – draftReferenceID:', reference);

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
  if (!reference2?.trim()) throw new Error('reference2 is empty – TC001 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttCopyPaymentButton);
  await pages.TelegraphicTransferPage.handleCognitiveContinueIfPresent();
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCode);  
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.inputNewTTPurposeCode);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.inputNewTTPurposeCode, testData.TelegraphicTransfer.purposeCode);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPurposeCodeSelect);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC007 – referenceID:', reference);
  copyreference = reference;

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.myrPaymentCcy);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Verification');
});

test('TC008_SG_TelegraphicTransfer - Edit A TT Payment Via Transfer Center', async ({ page }) => {
  if (!reference2?.trim()) throw new Error('reference2 is empty – TC001 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttEditPaymentButton);
  await pages.TelegraphicTransferPage.handleCognitiveContinueIfPresent();
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC008 – referenceID:', reference);
  reference2 = reference;

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.amountA2);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
});

test('TC009_SG_TelegraphicTransfer - Reject A TT Payment Via Transfer Center', async ({ page }) => {
  if (!reference2?.trim()) throw new Error('reference2 is empty – TC001/TC008 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttRejectPaymentButton);
  await pages.TelegraphicTransferPage.waitForRejectPaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();

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
  if (!reference2?.trim()) throw new Error('reference2 is empty – TC001/TC008 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference2);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttDeletePaymentButton);
  await pages.TelegraphicTransferPage.waitForDeletePaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();

  const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
  console.log('TC010 – deletedReferenceID:', reference);

  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await expect(pages.TelegraphicTransferPage.ttDeletePaymentSuccessMessage).toContainText('No information to display');
});

test('TC011_SG_TelegraphicTransfer - Create A TT Payment With Currency As SGD And Payee Bank Supports PARTIOR', async ({ page }) => {
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccountEP);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.partiourPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.waitForSGDCurrency();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);

  await pages.TelegraphicTransferPage.addExistingTTPayee({
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

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC011 – referenceID:', reference);
  reference3 = reference;

  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.SupportPartiorPayee);
  await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.amountA2);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Verification');
});

test('TC012_SG_TelegraphicTransfer - Approve A TT Payment For PARTIOR', async ({ page }) => {
  if (!reference3?.trim()) throw new Error('reference3 is empty – TC011 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference3);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.waitForDeletePaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();

  const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
  console.log('TC012 – referenceID:', reference);

  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Completed');
});

test('TC013_SG_TelegraphicTransfer - Edit a TT Payment with max amount 999999999.99 CNH', async ({ page }) => {
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
  await pages.TelegraphicTransferPage.waitForTTFormReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountCNH);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPayeeBankAccountDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.selectCurrencyDropdown, 'CNH');
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.CNHPayeeCurrencyDropdown);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.maxCNHAmount);

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
  if (!copyreference?.trim()) throw new Error('copyreference is empty – TC007 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.ApprovalPage.saferClick(pages.ApprovalPage.approvalMenu);
  await pages.ApprovalPage.saferClick(pages.ApprovalPage.approvalVerifyTab);
  await pages.ApprovalPage.waitForVerifyCenterReady();
  await pages.ApprovalPage.searchVerifyAndOpenByReference(copyreference);

  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
});

test('TC015_SG_TelegraphicTransfer - Approve A TT Payment Via Transfer Center', async ({ page }) => {
  if (!copyreference?.trim()) throw new Error('copyreference is empty – TC007 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
  await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
  await pages.TelegraphicTransferPage.waitForDeletePaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();

  const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
  console.log('TC015 – referenceID:', reference);

  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Release');
});

test('TC016_SG_TelegraphicTransfer - Release A TT Payment Via My Release', async ({ page }) => {
  if (!copyreference?.trim()) throw new Error('copyreference is empty – TC007 must pass first');

  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.ApprovalPage.saferClick(pages.ApprovalPage.approvalMenu);
  await pages.ApprovalPage.saferClick(pages.ApprovalPage.approveReleaseTab);
  await pages.ApprovalPage.waitForVerifyCenterReady();
  await pages.ApprovalPage.searchReleaseAndOpenByReference(copyreference);

  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Completed');
});

test('TC017_SG_TelegraphicTransfer - DOL User Create A TT Payment With Showing FX Savings Message Old UI', async ({ page }) => {
  await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();
  await pages.AccountTransferPage.waitForMenu();
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
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