/**
 * Author: Agent Generated
 * Created Date: 30/04/2026
 * Description: Singapore Intra Company Transfer — TC001_Create an ICT Payment
 * Migrated from Protractor: SG_IntraCompanyTransfer.test.ts
 */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { WebComponents } from '../../../lib/webComponents';
import { generatedID } from '../../../lib/utils';

const webComponents = new WebComponents();

// Load JSON test data
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// Credentials
const loginCompanyId = testData.IntraCompanyTransfer.SIT.loginCompanyId;
const loginUserId = testData.IntraCompanyTransfer.SIT.loginUserId;
const fromAccountText = testData.IntraCompanyTransfer.SIT.fromAccount;
const toAccountText = testData.IntraCompanyTransfer.SIT.toAccount;

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_IntraCompanyTransfer (Playwright)', () => {
  let pages: PaymentsPages;

  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;
    test.setTimeout(TIMEOUT.ULTRA);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, String(CONSTANTS.PIN));

    pages = new PaymentsPages(page);
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed') {
      console.warn(`[afterEach] Skipping cleanup — test status: ${testInfo.status}`);
    }
  });

  test('TC001_Create an ICT Payment', async ({ page }) => {
    // ── Step 1: Navigate to Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center ready and click ICT menu ────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.ictMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ICT form ready ──────────────────────────────
    await pages.IntraCompanyTransferPage.waitForFormReady();

    // ── Step 5: Select From Account via autocomplete ─────────────────
    await webComponents.selectAutoCompleteWithFilter(
      page,
      pages.IntraCompanyTransferPage.fromAccount,
      fromAccountText,
      testData.IntraCompanyTransfer.SIT.fromAccountFilter,
      pages.IntraCompanyTransferPage.autoCompleteListItem,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Select To Account via autocomplete ───────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.IntraCompanyTransferPage.toAccount,
      toAccountText,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount ─────────────────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.amount,
      testData.IntraCompanyTransfer.amountA1,
    );

    // ── Step 8: Click "Earliest available date" radio if visible ─────
    const earliestDateRadio = page.getByText('Earliest available date', { exact: false });
    if (await earliestDateRadio.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
      await webComponents.javaScriptsClick(earliestDateRadio);
    }

    // ── Step 9: Click Transaction Note toggle ────────────────────────
    await webComponents.toggleAngularCheckbox(
      page,
      pages.IntraCompanyTransferPage.isTransactionNoteLabel,
      pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
    );

    // ── Step 10: Enter Transaction Note ──────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.transactionNote,
      testData.IntraCompanyTransfer.additionNote,
    );

    // ── Step 11: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 12: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 13: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 14: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();

    // ── Step 15: Capture Reference ID ────────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC001_ICT – referenceID:', reference);
    } catch (err) {
      console.warn('TC001_ICT – Could not capture reference ID');
    }

    // ── Step 16: Navigate back to Transfer Center ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 17: Search and open payment in Transfer Center ──────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.PendingApproval,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 18: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 19: Validate all view page fields ───────────────────────
    // From Account
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.fromAccountValue,
      testData.IntraCompanyTransfer.SIT.fromAccountViewValue,
    );

    // To Account
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.toAccountValue,
      testData.IntraCompanyTransfer.SIT.toAccountViewValue,
    );

    // Amount
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.amountValue,
      testData.IntraCompanyTransfer.amountA1,
    );

    // Transaction Status — use direct expect with extended timeout for slow-loading status
    await expect(pages.IntraCompanyTransferPage.transactionStatusValue).toContainText(
      testData.status.PendingApproval,
      { timeout: TIMEOUT.MEDIUM },
    );

    // Hash Value — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.hashValue);

    // Reference Value
    if (reference) {
      await webComponents.compareUIVsJsonValue(
        pages.IntraCompanyTransferPage.referenceValue,
        reference,
      );
    }

    // Deduct Amount — cross-currency transfers show converted value, not input amount
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.deductAmountValue);

    // Payment Date — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.paymentDateValue);

    // Balance — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.balanceValue);

    // Payment Type
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.paymentType,
      testData.IntraCompanyTransfer.paymentType,
    );

    // Total Deduct (Non-DOL) — cross-currency shows converted value
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.totalDeductValueNonDol);

    // Message to Approver (Transaction Note / Addition Note)
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.messageToApproverValue,
      testData.IntraCompanyTransfer.additionNote,
    );

    // Next Approver — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.nextApprover);

    // Activity Log — should contain "Create"
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.activityLog,
      'Create',
    );

    // ── Step 20: Delete transaction (cleanup) ────────────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: reference,
    }, reference);
  });

  test('TC002_Create ICT with Approva Now with M-Chanllenge', async ({ page }) => {
    // ── Step 1: Navigate to Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center ready and click ICT menu ────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.ictMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ICT form ready ──────────────────────────────
    await pages.IntraCompanyTransferPage.waitForFormReady();

    // ── Step 5: Select From Account via autocomplete ─────────────────
    await webComponents.selectAutoCompleteWithFilter(
      page,
      pages.IntraCompanyTransferPage.fromAccount,
      fromAccountText,
      testData.IntraCompanyTransfer.SIT.fromAccountFilter,
      pages.IntraCompanyTransferPage.autoCompleteListItem,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Select To Account via autocomplete ───────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.IntraCompanyTransferPage.toAccount,
      toAccountText,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount ─────────────────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.amount,
      testData.IntraCompanyTransfer.amountA1,
    );

    // ── Step 8: Click Transaction Note toggle ────────────────────────
    await webComponents.toggleAngularCheckbox(
      page,
      pages.IntraCompanyTransferPage.isTransactionNoteLabel,
      pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
    );

    // ── Step 9: Enter Transaction Note ───────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.transactionNote,
      testData.IntraCompanyTransfer.additionNote,
    );

    // ── Step 10: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 11: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 12: Click ApprovalNow checkbox (JS click — Angular hidden input)
    await webComponents.javaScriptsClick(pages.IntraCompanyTransferPage.approvalNowCheckBox);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 13: Expand M-Challenge section if collapsed ─────────────
    const getChallengeBtn = pages.IntraCompanyTransferPage.getChallenge;
    const isChallengeVisible = await getChallengeBtn.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false);
    if (!isChallengeVisible) {
      // Click the "Alternatively, use your digital token..." text to expand
      const expandLink = page.getByText('Alternatively', { exact: false });
      if (await expandLink.isVisible({ timeout: TIMEOUT.MODERATE }).catch(() => false)) {
        await expandLink.click();
        await page.waitForTimeout(TIMEOUT.BRIEF);
      }
    }

    // ── Step 14: Click Get Challenge via SMS ──────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(getChallengeBtn);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 15: Enter Challenge Response code ───────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.challengeResponse,
      String(CONSTANTS.CHALLENGEVIASMSCODE),
    );

    // ── Step 16: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 17: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();

    // ── Step 18: Capture Reference ID ────────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC002_ICT – referenceID:', reference);
    } catch (err) {
      console.warn('TC002_ICT – Could not capture reference ID');
    }

    // ── Step 19: Navigate back to Transfer Center ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 20: Search and open payment in Transfer Center ──────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.Completed,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 21: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 22: Validate Transaction Status ─────────────────────────
    // ApprovalNow payments may be: Received, Approved, Pending Release, Completed, or Bank Rejected
    const statusLocator = pages.IntraCompanyTransferPage.transactionStatusValue;
    await statusLocator.waitFor({ state: 'visible', timeout: TIMEOUT.MEDIUM });
    const statusText = await statusLocator.textContent({ timeout: TIMEOUT.MEDIUM });
    const validStatuses = [
      //testData.status.Received,
      //testData.status.Approved,
      //testData.status.PendingRelease,
      testData.status.Completed,
      //testData.status.BankRejected,
    ];
    const statusMatch = validStatuses.some(s => statusText?.includes(s));
    expect(statusMatch).toBeTruthy();
    console.log('TC002_ICT – Status:', statusText?.trim());
  });

  test('TC003_Create ICT with Approva Now without M-Chanllenge', async ({ page }) => {
    // ── Step 1: Navigate to Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center ready and click ICT menu ────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.ictMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ICT form ready ──────────────────────────────
    await pages.IntraCompanyTransferPage.waitForFormReady();

    // ── Step 5: Select From Account via autocomplete ─────────────────
    await webComponents.selectAutoCompleteWithFilter(
      page,
      pages.IntraCompanyTransferPage.fromAccount,
      fromAccountText,
      testData.IntraCompanyTransfer.SIT.fromAccountFilter,
      pages.IntraCompanyTransferPage.autoCompleteListItem,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Select To Account via autocomplete ───────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.IntraCompanyTransferPage.toAccount,
      toAccountText,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount (amountA3 — high amount for without M-Challenge)
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.amount,
      testData.IntraCompanyTransfer.amountA3,
    );

    // ── Step 8: Click Transaction Note toggle ────────────────────────
    await webComponents.toggleAngularCheckbox(
      page,
      pages.IntraCompanyTransferPage.isTransactionNoteLabel,
      pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
    );

    // ── Step 9: Enter Transaction Note ───────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.transactionNote,
      testData.IntraCompanyTransfer.additionNote,
    );

    // ── Step 10: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 11: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 12: Click "Approve Now" link (high-amount shows link instead of checkbox)
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.approveNowLink);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 13: Enter Challenge Response (without M-Challenge — code auto-displayed)
    // For high-amount without M-Challenge, response field is directly visible after checkbox
    const responseField = pages.IntraCompanyTransferPage.challengeResponse;
    const isResponseVisible = await responseField.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false);
    if (!isResponseVisible) {
      // Expand digital token section if response not yet visible
      const expandLink = page.getByText('Alternatively', { exact: false });
      if (await expandLink.isVisible({ timeout: TIMEOUT.MODERATE }).catch(() => false)) {
        await expandLink.click();
        await page.waitForTimeout(TIMEOUT.MICROMIN);
      }
    }
    await webComponents.enterTextarea(
      responseField,
      String(CONSTANTS.CHALLENGEVIASMSCODE),
    );

    // ── Step 14: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 15: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();

    // ── Step 16: Capture Reference ID ────────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC003_ICT – referenceID:', reference);
    } catch (err) {
      console.warn('TC003_ICT – Could not capture reference ID');
    }

    // ── Step 17: Navigate back to Transfer Center ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 18: Search and open payment in Transfer Center ──────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.PartialApproved,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 19: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 20: Validate Transaction Status ──────────────────────────
    // ApprovalNow payments may complete immediately or show Partial Approved
    const statusLocatorTC03 = pages.IntraCompanyTransferPage.transactionStatusValue;
    await statusLocatorTC03.waitFor({ state: 'visible', timeout: TIMEOUT.MEDIUM });
    const statusTextTC03 = await statusLocatorTC03.textContent({ timeout: TIMEOUT.MEDIUM });
    const validStatusesTC03 = [
      testData.status.PartialApproved,
      //testData.status.Completed,
      //testData.status.Approved,
      //testData.status.PendingRelease,
    ];
    const statusMatchTC03 = validStatusesTC03.some(s => statusTextTC03?.includes(s));
    expect(statusMatchTC03).toBeTruthy();
    console.log('TC003_ICT – Status:', statusTextTC03?.trim());

    // ── Step 21: Delete transaction (cleanup) ────────────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: reference,
    }, reference);
  });

  test('TC004_Create ICT with Save as Template', async ({ page }) => {
    // ── Step 1: Navigate to Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center ready and click ICT menu ────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.ictMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ICT form ready ──────────────────────────────
    await pages.IntraCompanyTransferPage.waitForFormReady();

    // ── Step 5: Select From Account via autocomplete ─────────────────
    await webComponents.selectAutoCompleteWithFilter(
      page,
      pages.IntraCompanyTransferPage.fromAccount,
      fromAccountText,
      testData.IntraCompanyTransfer.SIT.fromAccountFilter,
      pages.IntraCompanyTransferPage.autoCompleteListItem,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Select To Account via autocomplete ───────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.IntraCompanyTransferPage.toAccount,
      toAccountText,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount ─────────────────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.amount,
      testData.IntraCompanyTransfer.amountA1,
    );

    // ── Step 8: Click Transaction Note toggle ────────────────────────
    await webComponents.toggleAngularCheckbox(
      page,
      pages.IntraCompanyTransferPage.isTransactionNoteLabel,
      pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
    );

    // ── Step 9: Enter Transaction Note ───────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.transactionNote,
      testData.IntraCompanyTransfer.additionNote,
    );

    // ── Step 10: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 11: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 12: Click Save As Template checkbox (JS click — Angular hidden input)
    await webComponents.javaScriptsClick(pages.IntraCompanyTransferPage.saveAsTemplateCheckbox);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── Step 13: Enter Template Name ─────────────────────────────────
    const templateName = 'ICTtemplate' + generatedID();
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.templateName,
      templateName,
    );

    // ── Step 14: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 15: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();

    // ── Step 16: Capture Reference ID ────────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC004_ICT – referenceID:', reference);
    } catch (err) {
      console.warn('TC004_ICT – Could not capture reference ID');
    }

    // ── Step 17: Navigate back to Transfer Center ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 18: Search and open payment in Transfer Center ──────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.PendingApproval,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 19: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 20: Validate view page fields ───────────────────────────
    // From Account
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.fromAccountValue,
      testData.IntraCompanyTransfer.SIT.fromAccountViewValue,
    );

    // Amount
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.amountValue,
      testData.IntraCompanyTransfer.amountA1,
    );

    // Transaction Status — PendingApproval
    await expect(pages.IntraCompanyTransferPage.transactionStatusValue).toContainText(
      testData.status.PendingApproval,
      { timeout: TIMEOUT.MEDIUM },
    );

    // ── Step 21: Delete transaction (cleanup) ────────────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: reference,
    }, reference);
    // Dismiss the "Transaction deleted" popup so navigation is unblocked
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 22: Navigate to Pay & Transfer → Templates ──────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 23: Search for template by name ─────────────────────────
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.manageTemplateFilter);
    await webComponents.enterTextarea(
      pages.PaymentTemplatesPage.manageTemplateFilter,
      templateName,
    );
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 24: Click template name link ────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateNameLink);
    await webComponents.waitForUXLoading([], page);

    // ── Step 25: Wait for View ICT Template page ready ───────────────
    await pages.IntraCompanyTransferPage.waitForViewTemplatePage();

    // ── Step 26: Validate template view page fields ──────────────────
    // Template Name
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.viewTemplateName,
      templateName,
    );

    // From Account
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.fromAccountValue,
      testData.IntraCompanyTransfer.SIT.fromAccountViewValue,
    );

    // Amount
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.viewTemplateAmount,
      testData.IntraCompanyTransfer.amountA1,
    );
    console.log('TC004_ICT – Template validated:', templateName);

    // ── Step 27: Navigate back to Templates list ─────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 28: Search and select template for deletion ─────────────
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.manageTemplateFilter);
    await webComponents.enterTextarea(
      pages.PaymentTemplatesPage.manageTemplateFilter,
      templateName,
    );
    await page.waitForTimeout(TIMEOUT.MICROMIN);
    await webComponents.javaScriptsClick(pages.PaymentTemplatesPage.firstTemplateCheckbox);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── Step 29: Click Delete and confirm ────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.deletebuttonTemplate);
    await webComponents.waitForUXLoading([], page);
    // "Confirm templates to delete" page appears — click Delete again
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.confirmTemplatesToDeleteHeader);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.deletebuttonTemplate);
    // "Confirm delete" popup dialog appears instantly (no spinner)
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.confirmDeletebutton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 30: Dismiss template deleted popup ──────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.okButton);
    await webComponents.waitForUXLoading([], page);
    console.log('TC004_ICT – Template deleted:', templateName);
  });

  test('TC005_Create an ICT Payment from template', async ({ page }) => {
    // ═══════════════════════════════════════════════════════════════════
    // PHASE 1: Create ICT Payment with Save as Template
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 1: Navigate to Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center ready and click ICT menu ────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.ictMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ICT form ready ──────────────────────────────
    await pages.IntraCompanyTransferPage.waitForFormReady();

    // ── Step 5: Select From Account via autocomplete ─────────────────
    await webComponents.selectAutoCompleteWithFilter(
      page,
      pages.IntraCompanyTransferPage.fromAccount,
      fromAccountText,
      testData.IntraCompanyTransfer.SIT.fromAccountFilter,
      pages.IntraCompanyTransferPage.autoCompleteListItem,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Select To Account via autocomplete ───────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.IntraCompanyTransferPage.toAccount,
      toAccountText,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount ─────────────────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.amount,
      testData.IntraCompanyTransfer.amountA1,
    );

    // ── Step 8: Click Transaction Note toggle ────────────────────────
    await webComponents.toggleAngularCheckbox(
      page,
      pages.IntraCompanyTransferPage.isTransactionNoteLabel,
      pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
    );

    // ── Step 9: Enter Transaction Note ───────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.transactionNote,
      testData.IntraCompanyTransfer.additionNote,
    );

    // ── Step 10: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 11: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 12: Click Save As Template checkbox (JS click — Angular hidden input)
    await webComponents.javaScriptsClick(pages.IntraCompanyTransferPage.saveAsTemplateCheckbox);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── Step 13: Enter Template Name ─────────────────────────────────
    const templateName = 'ICTtemplate' + generatedID();
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.templateName,
      templateName,
    );

    // ── Step 14: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 15: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();
    console.log('TC005_ICT – Template created:', templateName);

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 2: Logout → Login as verify user → Approve Template
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 16: Navigate to login page (logout) ───────────────────────
    const loginPageApprover = new LoginPage(page);
    await loginPageApprover.goto();

    // ── Step 17: Login as verify user (approver) ─────────────────────
    await loginPageApprover.login(
      loginCompanyId,
      'DBSAUTOSGICT02',
      String(CONSTANTS.PIN),
    );
    pages = new PaymentsPages(page);

    // ── Step 18: Navigate to Pay & Transfer → Templates ──────────────
    await pages.AccountTransferPage.waitForMenu();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 19: Search for template and open it ─────────────────────
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.manageTemplateFilter);
    await webComponents.enterTextarea(
      pages.PaymentTemplatesPage.manageTemplateFilter,
      templateName,
    );
    await page.waitForTimeout(TIMEOUT.MICROMIN);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateNameLink);
    await webComponents.waitForUXLoading([], page);

    // ── Step 20: Approve the template ────────────────────────────────
    await pages.IntraCompanyTransferPage.waitForViewTemplatePage();
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.approveButton);
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.confirmApproveButton);
    await webComponents.waitForUXLoading([], page);
    // Dismiss approval confirmation popup
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);
    console.log('TC005_ICT – Template approved:', templateName);

    // ── Step 21: Logout approver (navigate to login page) ─────────────
    const loginPageOriginal = new LoginPage(page);
    await loginPageOriginal.goto();

    // ── Step 22: Login back as original user ─────────────────────────
    await loginPageOriginal.login(loginCompanyId, loginUserId, String(CONSTANTS.PIN));
    pages = new PaymentsPages(page);

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 3: Navigate to Templates → Open approved template → Make Payment
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 23: Navigate to Pay & Transfer → Templates ──────────────
    await pages.AccountTransferPage.waitForMenu();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 24: Search for approved template ────────────────────────
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.manageTemplateFilter);
    await webComponents.enterTextarea(
      pages.PaymentTemplatesPage.manageTemplateFilter,
      templateName,
    );
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 4: Make a Payment from Template
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 25: Click "Make a Payment" link ─────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.makeAPaymentLink);
    await webComponents.waitForUXLoading([], page);

    // ── Step 26: Wait for Create ICT from Template page ready ────────
    await pages.IntraCompanyTransferPage.waitForCreateFromTemplatePage();

    // ── Step 27: Clear amount and enter new amount ───────────────────
    const amountField = pages.IntraCompanyTransferPage.amount;
    await amountField.click();
    await amountField.fill('');
    await webComponents.enterTextarea(
      amountField,
      testData.IntraCompanyTransfer.SIT.templateAmount,
    );

    // ── Step 28: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 29: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 30: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 31: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();

    // ── Step 32: Capture Reference ID ────────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC005_ICT – referenceID:', reference);
    } catch (err) {
      console.warn('TC005_ICT – Could not capture reference ID');
    }

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 5: Open Transaction → Validate Amount & Status
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 33: Navigate back to Transfer Center ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 34: Search and open payment in Transfer Center ──────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.PendingApproval,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 35: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 36: Validate view page fields ───────────────────────────
    // From Account — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.fromAccountValue);

    // Amount — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.amountValue);

    // Transaction Status — PendingApproval
    await expect(pages.IntraCompanyTransferPage.transactionStatusValue).toContainText(
      testData.status.PendingApproval,
      { timeout: TIMEOUT.MEDIUM },
    );
    console.log('TC005_ICT – Transaction validated');

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 6: Delete Transaction
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 37: Delete transaction (cleanup) ────────────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: reference,
    }, reference);
    // Dismiss the "Transaction deleted" popup so navigation is unblocked
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 7: Delete Created Template
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 38: Navigate to Pay & Transfer → Templates ──────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 39: Search and select template for deletion ─────────────
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.manageTemplateFilter);
    await webComponents.enterTextarea(
      pages.PaymentTemplatesPage.manageTemplateFilter,
      templateName,
    );
    await page.waitForTimeout(TIMEOUT.MICROMIN);
    await webComponents.javaScriptsClick(pages.PaymentTemplatesPage.firstTemplateCheckbox);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── Step 40: Click Delete and confirm ────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.deletebuttonTemplate);
    await webComponents.waitForUXLoading([], page);
    // "Confirm templates to delete" page appears — click Delete again
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.confirmTemplatesToDeleteHeader);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.deletebuttonTemplate);
    // "Confirm delete" popup dialog appears instantly (no spinner)
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.confirmDeletebutton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 41: Dismiss template deleted popup ──────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.okButton);
    await webComponents.waitForUXLoading([], page);
    console.log('TC005_ICT – Template deleted:', templateName);
  });

  test('TC006_Create an ICT with Save as Draft', async ({ page }) => {
    // ── Step 1: Navigate to Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center ready and click ICT menu ────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.ictMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ICT form ready ──────────────────────────────
    await pages.IntraCompanyTransferPage.waitForFormReady();

    // ── Step 5: Select From Account via autocomplete ─────────────────
    await webComponents.selectAutoCompleteWithFilter(
      page,
      pages.IntraCompanyTransferPage.fromAccount,
      fromAccountText,
      testData.IntraCompanyTransfer.SIT.fromAccountFilter,
      pages.IntraCompanyTransferPage.autoCompleteListItem,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Select To Account via autocomplete ───────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.IntraCompanyTransferPage.toAccount,
      toAccountText,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount ─────────────────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.amount,
      testData.IntraCompanyTransfer.amountA1,
    );

    // ── Step 8: Click Transaction Note toggle ────────────────────────
    await webComponents.toggleAngularCheckbox(
      page,
      pages.IntraCompanyTransferPage.isTransactionNoteLabel,
      pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
    );

    // ── Step 9: Enter Transaction Note ───────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.transactionNote,
      testData.IntraCompanyTransfer.transactionNote,
    );

    // ── Step 10: Click Save as Draft ─────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.saveAsDraft);
    await webComponents.waitForUXLoading([], page);

    // ── Step 11: Capture reference ID from dialog ────────────────────
    await webComponents.waitElementToBeVisible(pages.IntraCompanyTransferPage.dialogMessageLabel);
    const referenceText = await webComponents.getTextFromElement(pages.IntraCompanyTransferPage.dialogMessageLabel);
    const reference = await webComponents.getReferenceID(referenceText);
    console.log('TC006_ICT – referenceID:', reference);

    // ── Step 12: Dismiss the dialog ──────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 13: Navigate back to Transfer Center via Payment menu ───
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 14: Search for the saved draft and open view page ───────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.Saved,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 15: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 16: Validate view page fields ───────────────────────────
    // From Account
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.fromAccountValue,
      testData.IntraCompanyTransfer.SIT.fromAccount,
    );

    // Amount
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.amountValue,
      testData.IntraCompanyTransfer.amountA1,
    );

    // Transaction Status — "Saved"
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.transactionStatusValue,
      testData.status.Saved,
    );

    console.log(`TC006_ICT – Draft payment saved: ${reference}`);

    // ── Step 17: Delete transaction (cleanup) ────────────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: reference,
    }, reference);
    console.log('TC006_ICT – Transaction deleted:', reference);
  });

  test('TC007_Copy an ICT Payment', async ({ page }) => {
    // ═══════════════════════════════════════════════════════════════════
    // PHASE 1: Create a source ICT payment to copy from
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 1: Navigate to Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center ready and click ICT menu ────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.ictMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ICT form ready ──────────────────────────────
    await pages.IntraCompanyTransferPage.waitForFormReady();

    // ── Step 5: Select From Account via autocomplete ─────────────────
    await webComponents.selectAutoCompleteWithFilter(
      page,
      pages.IntraCompanyTransferPage.fromAccount,
      fromAccountText,
      testData.IntraCompanyTransfer.SIT.fromAccountFilter,
      pages.IntraCompanyTransferPage.autoCompleteListItem,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Select To Account via autocomplete ───────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.IntraCompanyTransferPage.toAccount,
      toAccountText,
    );
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount ─────────────────────────────────────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.amount,
      testData.IntraCompanyTransfer.amountA1,
    );

    // ── Step 8: Click "Earliest available date" radio if visible ─────
    const earliestDateRadioSrc = page.getByText('Earliest available date', { exact: false });
    if (await earliestDateRadioSrc.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
      await webComponents.javaScriptsClick(earliestDateRadioSrc);
    }

    // ── Step 9: Click Transaction Note toggle ────────────────────────
    await webComponents.toggleAngularCheckbox(
      page,
      pages.IntraCompanyTransferPage.isTransactionNoteLabel,
      pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
    );

    // ── Step 10: Enter Transaction Note (message to approver) ────────
    await webComponents.enterTextarea(
      pages.IntraCompanyTransferPage.transactionNote,
      testData.IntraCompanyTransfer.additionNote,
    );

    // ── Step 11: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 12: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 13: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 14: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();

    // ── Step 15: Capture Reference ID of source payment ──────────────
    let sourceReference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      sourceReference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC007_ICT – Source referenceID:', sourceReference);
    } catch (err) {
      console.warn('TC007_ICT – Could not capture source reference ID');
    }

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 2: Navigate to Transfer Center → Open source payment → Copy
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 16: Navigate back to Transfer Center ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 17: Search and open source payment ──────────────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (sourceReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(sourceReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.PendingApproval,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 18: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 19: Click Copy button ───────────────────────────────────
    await webComponents.javaScriptsClick(pages.IntraCompanyTransferPage.copyButton);
    await webComponents.waitForUXLoading([], page);

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 3: Fill copied payment form → Submit
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 20: Wait for ICT form (pre-filled from copy) ────────────
    await pages.IntraCompanyTransferPage.waitForCopyReady();
    await page.waitForTimeout(TIMEOUT.MODERATE);

    // ── Step 21: Clear amount and enter new amount ───────────────────
    // (Accounts are already bound from Copy — do NOT re-select them)
    const copyAmount = testData.IntraCompanyTransfer.SIT.amountV.replace(/,/g, '');
    const amountField = pages.IntraCompanyTransferPage.amount;
    await amountField.click();
    await amountField.fill('');
    await webComponents.enterTextarea(amountField, copyAmount);
    await page.waitForTimeout(TIMEOUT.MICROMIN);
    await webComponents.waitForUXLoading([], page);

    // ── Step 22: Click "Earliest available date" radio if visible ────
    const earliestDateRadioCopy = page.getByText('Earliest available date', { exact: false });
    if (await earliestDateRadioCopy.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
      await webComponents.javaScriptsClick(earliestDateRadioCopy);
    }

    // ── Step 23: Enable Transaction Note if not already checked ────────
    const isNoteChecked = await pages.IntraCompanyTransferPage.isTransactionNoteCheckbox.isChecked().catch(() => false);
    if (!isNoteChecked) {
      await webComponents.toggleAngularCheckbox(
        page,
        pages.IntraCompanyTransferPage.isTransactionNoteLabel,
        pages.IntraCompanyTransferPage.isTransactionNoteCheckbox,
      );
    }

    // ── Step 24: Enter Transaction Note (message to approver) ────────
    const transactionNoteField = pages.IntraCompanyTransferPage.transactionNote;
    await transactionNoteField.click();
    await transactionNoteField.fill('');
    await webComponents.enterTextarea(
      transactionNoteField,
      testData.IntraCompanyTransfer.additionNote,
    );

    // ── Step 25: Click Next ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 26: Wait for Preview page ready ─────────────────────────
    await pages.IntraCompanyTransferPage.waitForPreviewPage();

    // ── Step 27: Click Submit ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 28: Wait for Submitted page ready ───────────────────────
    await pages.IntraCompanyTransferPage.waitForSubmittedPage();

    // ── Step 29: Capture Reference ID of copied payment ──────────────
    let copiedReference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      copiedReference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC007_ICT – Copied referenceID:', copiedReference);
    } catch (err) {
      console.warn('TC007_ICT – Could not capture copied reference ID');
    }

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 4: Validate the copied payment
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 30: Navigate back to Transfer Center ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 31: Search and open copied payment ──────────────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (copiedReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(copiedReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.PendingApproval,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 32: Wait for View ICT Payment page ready ────────────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();

    // ── Step 33: Validate view page fields ───────────────────────────
    // From Account — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.fromAccountValue);

    // Amount — non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.IntraCompanyTransferPage.amountValue);

    // Transaction Status
    await webComponents.compareUIVsJsonValue(
      pages.IntraCompanyTransferPage.transactionStatusValue,
      testData.status.PendingApproval,
    );

    console.log('TC007_ICT – Copied payment validated:', copiedReference);

    // ═══════════════════════════════════════════════════════════════════
    // PHASE 5: Cleanup — Delete both transactions
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 34: Delete copied payment ───────────────────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: copiedReference,
    }, copiedReference);
    console.log('TC007_ICT – Copied transaction deleted:', copiedReference);

    // ── Step 35: Dismiss popup and navigate to Transfer Center ───────
    await webComponents.clickWhenVisibleAndEnabled(pages.IntraCompanyTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 36: Search and open source payment for deletion ─────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (sourceReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(sourceReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Intra Company Transfer',
        testData.status.PendingApproval,
      );
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 37: Wait for View page and delete source payment ────────
    await pages.IntraCompanyTransferPage.waitForViewPaymentPage();
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: sourceReference,
    }, sourceReference);
    console.log('TC007_ICT – Source transaction deleted:', sourceReference);
  });
});
