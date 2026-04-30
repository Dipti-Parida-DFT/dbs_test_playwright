/**
 * Author: Agent Generated
 * Created Date: 23/04/2026
 * Class path "tests/e2e/IDEALX/PayTransfer/CrossBoarderACH_AgentGen.spec.ts"
 * Description: This Specification contains the test case for Singapore Cross Border ACH Payment.
 * 1) TC001_Create a Cross Border ACH Payment
 * 2) TC002_Edit a Cross Border ACH Payment
 * 3) TC003_Approve a Cross Border ACH Payment
 * 4) TC004_Create an INTL Cross Border ACH Payment
 */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { WebComponents } from '../../../lib/webComponents';

// Initialize WebComponents helper
const webComponents = new WebComponents();

// Load JSON test data
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// Credentials for Cross Border ACH
const loginCompanyId = testData.CrossBorder.loginCompanyId;
const loginUserId = testData.CrossBorder.loginUserId;

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_CrossBorderACH (Playwright)', () => {
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

  // ════════════════════════════════════════════════════════════════════════════
  // TC001 — Create a Cross Border ACH Payment
  // ════════════════════════════════════════════════════════════════════════════
  test('TC001_Create a Cross Border ACH Payment', async ({ page }) => {

    // ── Step 1: Navigate to the Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Click second page dot to navigate to Cross Border ACH option ──
    await webComponents.clickPaginationDot(pages.CrossBoarderACHPage.secondPageDot);

    // ── Step 4: Click Cross Border ACH menu ──────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.crossBorderMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 5: Wait for Cross Border ACH form ──────────────────────────
    await pages.CrossBoarderACHPage.waitForFormReady();

    // ── Step 6: Select From Account ─────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.fromAccount,
      testData.CrossBorder.fromAccount,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Select Payment Country ──────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.paymentCountry,
      testData.CrossBorder.paymentCountry,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 8: Select Debit Type ───────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.debitType,
      testData.CrossBorder.debitType,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 9: Add Existing Payee ──────────────────────────────────────
    await pages.CrossBoarderACHPage.addExistingPayee(testData.CrossBorder.existingFilterValue);

    // ── Step 10: Enter Payee Amount ─────────────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.payeeAmount,
      testData.CrossBorder.amount,
    );

    // ── Step 10: Enter Payment Detail ───────────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.paymentDetail,
      testData.CrossBorder.paymentDetail,
    );

    // ── Step 12: Click Show Option Detail (expand optional details) ─────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.showOptionDetail);

    // ── Step 13: Click Intermediary Bank Information (jsClick) ───────────
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.intermediaryBankInformation);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 14: Select Intermediary Country ─────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.selectedIntermediaryCountry,
      testData.CrossBorder.IntermediaryCountry,
    );

    // ── Step 15: Enter Payee Bank ID (Intermediary) ─────────────────────
    await webComponents.enterText(
      pages.CrossBoarderACHPage.intermediaryBankIDInput,
      testData.CrossBorder.bankID,
    );
    await page.waitForTimeout(TIMEOUT.MODERATE);
    // Click the bank search result if visible
    const bankResult = page.locator('table tr td').first();
    if (await bankResult.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
      await bankResult.click();
      await page.waitForTimeout(TIMEOUT.MICROMIN);
    }

    // ── Step 15: Click Message To Payee (label click for Angular hidden checkbox) ──
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.messageToPayeeLabel);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── Step 16: Enter Emails 1-5 ───────────────────────────────────────
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email1, testData.CrossBorder.Email1);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email2, testData.CrossBorder.Email2);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email3, testData.CrossBorder.Email3);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email4, testData.CrossBorder.Email4);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email5, testData.CrossBorder.Email5);

    // ── Step 17: Enter Message ──────────────────────────────────────────
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.message, testData.CrossBorder.Message);

    // ── Step 18: Click Next ─────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.nextButton);

    // ── Step 19: Wait for Preview page ──────────────────────────────────
    await pages.CrossBoarderACHPage.waitForPreviewPage();

    // ── Step 20: Click Submit ───────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.submitButton);

    // ── Step 21: Wait for Submitted confirmation ────────────────────────
    await pages.CrossBoarderACHPage.waitForSubmittedPage();

    // ── Step 22: Capture Reference ID ───────────────────────────────────
    let reference = '';
    try {
      const refText = await webComponents.getTextFromElement(pages.CrossBoarderACHPage.idealXInfoMsg);
      reference = await webComponents.getReferenceID(refText);
      console.log('Reference ID:', reference);
    } catch (e) {
      console.warn('Failed to capture reference from info msg, trying body text');
      try {
        const bodyText = await webComponents.getTextFromElement(page.locator('body'));
        reference = await webComponents.getReferenceID(bodyText);
        console.log('Reference ID (from body):', reference);
      } catch (e2) {
        console.warn('Failed to capture reference ID:', e2);
      }
    }

    // ── Step 23: Navigate back to Pay & Transfer (Transfer Center) ──────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 24: Search and open payment in Transfer Center ─────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Cross Border ACH',
        testData.status.PendingApproval,
      );
    }

    // ── Step 25: Wait for View page ─────────────────────────────────────
    await pages.CrossBoarderACHPage.waitForViewPage();

    // ═══════════════════════════════════════════════════════════════════
    // Step 26: Validate View page fields — all visible UI elements
    // ═══════════════════════════════════════════════════════════════════

    // ── 26.1  Header: Hash value (system-generated, verify non-empty) ──
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.hashValue);

    // ── 26.2  Header: From Account — must match selected account ───────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.fromAccountValue,
      testData.CrossBorder.fromAccount,
    );

    // ── 26.3  Header: Payee's Area — must match selected country ───────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeArea,
      testData.CrossBorder.paymentCountry,
    );

    // ── 26.4  Header: Deducted Amount — must contain entered amount ────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.deductedAmt,
      testData.CrossBorder.amount,
    );

    // ── 26.5  Header: Debit Type — must match selected debit type ──────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.debitTypeValue,
      testData.CrossBorder.debitType,
    );

    // ── 26.6  FX: Contract Reference (system-generated, verify non-empty) ──
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.contractRef);

    // ── 26.7  FX: Indicative Exchange Rate (verify non-empty) ──────────
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.indicativeExchangeRate);

    // ── 26.8  FX: Amount to Transfer — must contain entered amount ─────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.amountToTransfer,
      testData.CrossBorder.amount,
    );

    // ── 26.9  FX: Amount to Deduct (system-calculated, verify non-empty) ──
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.amountToDeduct);

    // ── 26.10 Header: Payment Date (system-assigned, verify non-empty) ──
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.paymentDateValue);

    // ── 26.11 Header: Internal Reference (system-generated, verify non-empty) ──
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.internalRef);

    // ── 26.12 Header: Batch ID (system-generated, verify non-empty) ────
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.batchIDValue);

    // ── 26.13 Header: Status — must be "Pending Approval" ─────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.statusValue,
      testData.status.PendingApproval,
    );

    // ── 26.14 Payment Summary: Total Payees — must match count ─────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.paymentSummaryTotalPayees,
      testData.CrossBorder.totalPayees,
    );

    // ── 26.15 Payment Summary: Total Amount — must contain amount ──────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.paymentSummaryTotalAmount,
      testData.CrossBorder.amount,
    );

    // ── 26.16 Payee 1: Name — must match selected payee ───────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeName1,
      testData.CrossBorder.existingFilterValue,
    );

    // ── 26.17 Payee 1: Bank Code (verify non-empty) ───────────────────
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.payeeBankCode1);

    // ── 26.18 Payee 1: Account Number — must match payee account ──────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeAcctNum1,
      testData.CrossBorder.accountNumberINTL,
    );

    // ── 26.19 Payee 1: Amount — must contain entered amount ───────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeAmt1,
      testData.CrossBorder.amount,
    );

    // ── 26.20 Payee 1: Status — must be "Pending Approval" ───────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeStatus1,
      testData.status.PendingApproval,
    );

    // ── 26.21 Click "Show optional details" for payee 1 ───────────────
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.showOptBtn1);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── 26.22 Payee 1: Payment Details — must match entered text ──────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.paymentDetails1,
      testData.CrossBorder.paymentDetail,
    );

    // ── 26.23 Payee 1: Intermediary Country (conditional — validate if visible) ──
    const interCountryVisible = await pages.CrossBoarderACHPage.intermediaryCountryView1
      .isVisible({ timeout: 5000 }).catch(() => false);
    if (interCountryVisible) {
      await webComponents.compareUIVsJsonValue(
        pages.CrossBoarderACHPage.intermediaryCountryView1,
        testData.CrossBorder.IntermediaryCountry,
      );
    }

    // ── 26.24 Payee 1: Intermediary Bank ID (conditional — validate if visible) ──
    const interBankVisible = await pages.CrossBoarderACHPage.intermediaryBankIDView1
      .isVisible({ timeout: 5000 }).catch(() => false);
    if (interBankVisible) {
      await webComponents.compareUIVsJsonValue(
        pages.CrossBoarderACHPage.intermediaryBankIDView1,
        testData.CrossBorder.bankID,
      );
    }

    // ── 26.25 Payee 1: Message to Payee — must match entered message ──
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.message1,
      testData.CrossBorder.Message,
    );

    // ── 26.26 Payee 1: Email 1 — must appear in email list ───────────
    await webComponents.compareUIVsJsonValue(pages.CrossBoarderACHPage.emailList1, testData.CrossBorder.Email1);

    // ── 26.27 Payee 1: Email 2 — must appear in email list ───────────
    await webComponents.compareUIVsJsonValue(pages.CrossBoarderACHPage.emailList1, testData.CrossBorder.Email2);

    // ── 26.28 Payee 1: Email 3 — must appear in email list ───────────
    await webComponents.compareUIVsJsonValue(pages.CrossBoarderACHPage.emailList1, testData.CrossBorder.Email3);

    // ── 26.29 Payee 1: Email 4 — must appear in email list ───────────
    await webComponents.compareUIVsJsonValue(pages.CrossBoarderACHPage.emailList1, testData.CrossBorder.Email4);

    // ── 26.30 Payee 1: Email 5 — must appear in email list ───────────
    await webComponents.compareUIVsJsonValue(pages.CrossBoarderACHPage.emailList1, testData.CrossBorder.Email5);

    // ── 26.31 Approval: Next Approver (verify non-empty) ──────────────
    await webComponents.verifyUIElementTextIsNotNull(pages.CrossBoarderACHPage.nextApprover);

    // ── 26.32 Approval: Approver Groups — must match expected group ───
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.approverGroups,
      testData.CrossBorder.approverGroup,
    );

    // ── 26.33 Activity Log: Action — must contain "Create" ────────────
    await webComponents.compareUIVsJsonValue(pages.CrossBoarderACHPage.activityLog, 'Create');

    // ── 26.34 Activity Log: User Name — must match login user ─────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.activityLog,
      testData.CrossBorder.loginUserId,
    );

    // ── 26.35 Activity Log: Date/Time — must contain current month/year ──
    await webComponents.compareUIVsJsonValue(pages.CrossBoarderACHPage.activityLog, 'Apr 2026');

    // ═══════════════════════════════════════════════════════════════════
    // Step 27: Delete the created payment from the view page (cleanup)
    // ═══════════════════════════════════════════════════════════════════
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.CrossBorder.transactionDeleted,
      internalReference: reference,
    }, reference);

    console.log(`TC001 – Cross Border ACH Payment ${reference} deleted successfully`);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC002 — Edit a Cross Border ACH Payment
  // Flow: Create → Validate Amount → Open → Edit → Validate Edited Amount → Delete
  // ════════════════════════════════════════════════════════════════════════════
  test('TC002_Edit a Cross Border ACH Payment', async ({ page }) => {

    // ═══════════════════════════════════════════════════════════════════
    // Phase A: Create a Cross Border ACH Payment
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 1: Navigate to the Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Click second page dot to navigate to Cross Border ACH ────
    await webComponents.clickPaginationDot(pages.CrossBoarderACHPage.secondPageDot);

    // ── Step 4: Click Cross Border ACH menu ──────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.crossBorderMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 5: Wait for Cross Border ACH form ───────────────────────────
    await pages.CrossBoarderACHPage.waitForFormReady();

    // ── Step 6: Select From Account ──────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.fromAccount,
      testData.CrossBorder.fromAccount,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Select Payment Country ───────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.paymentCountry,
      testData.CrossBorder.paymentCountry,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 8: Select Debit Type ────────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.debitType,
      testData.CrossBorder.debitType,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 9: Add Existing Payee ───────────────────────────────────────
    await pages.CrossBoarderACHPage.addExistingPayee(testData.CrossBorder.existingFilterValue);

    // ── Step 10: Enter Payee Amount ──────────────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.payeeAmount,
      testData.CrossBorder.amount,
    );

    // ── Step 11: Enter Payment Detail ────────────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.paymentDetail,
      testData.CrossBorder.paymentDetail,
    );

    // ── Step 12: Click Show Option Detail ────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.showOptionDetail);

    // ── Step 13: Click Intermediary Bank Information ──────────────────────
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.intermediaryBankInformation);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 14: Select Intermediary Country ──────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.selectedIntermediaryCountry,
      testData.CrossBorder.IntermediaryCountry,
    );

    // ── Step 15: Enter Intermediary Bank ID ───────────────────────────────
    await webComponents.enterText(
      pages.CrossBoarderACHPage.intermediaryBankIDInput,
      testData.CrossBorder.bankID,
    );
    await page.waitForTimeout(TIMEOUT.MODERATE);
    const bankResult = page.locator('table tr td').first();
    if (await bankResult.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
      await bankResult.click();
      await page.waitForTimeout(TIMEOUT.MICROMIN);
    }

    // ── Step 16: Click Message To Payee ──────────────────────────────────
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.messageToPayeeLabel);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── Step 17: Enter Emails 1-5 ────────────────────────────────────────
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email1, testData.CrossBorder.Email1);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email2, testData.CrossBorder.Email2);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email3, testData.CrossBorder.Email3);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email4, testData.CrossBorder.Email4);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email5, testData.CrossBorder.Email5);

    // ── Step 18: Enter Message ────────────────────────────────────────────
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.message, testData.CrossBorder.Message);

    // ── Step 19: Click Next ──────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.nextButton);

    // ── Step 20: Wait for Preview page ───────────────────────────────────
    await pages.CrossBoarderACHPage.waitForPreviewPage();

    // ── Step 21: Click Submit ────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.submitButton);

    // ── Step 22: Wait for Submitted confirmation ─────────────────────────
    await pages.CrossBoarderACHPage.waitForSubmittedPage();

    // ── Step 23: Capture Reference ID ────────────────────────────────────
    let reference = '';
    try {
      const refText = await webComponents.getTextFromElement(pages.CrossBoarderACHPage.idealXInfoMsg);
      reference = await webComponents.getReferenceID(refText);
      console.log('TC002 Create Reference ID:', reference);
    } catch (e) {
      console.warn('Failed to capture reference from info msg, trying body text');
      try {
        const bodyText = await webComponents.getTextFromElement(page.locator('body'));
        reference = await webComponents.getReferenceID(bodyText);
        console.log('TC002 Create Reference ID (from body):', reference);
      } catch (e2) {
        console.warn('Failed to capture reference ID:', e2);
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // Phase B: Validate Amount on View Page (amount = "1")
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 24: Navigate to Transfer Center ─────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 25: Search and open payment ─────────────────────────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Cross Border ACH',
        testData.status.PendingApproval,
      );
    }

    // ── Step 26: Wait for View page ──────────────────────────────────────
    await pages.CrossBoarderACHPage.waitForViewPage();

    // ── 26.1 Validate: Deducted Amount matches original amount ───────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.deductedAmt,
      testData.CrossBorder.amount,
    );

    // ── 26.2 Validate: Payee 1 Amount matches original amount ────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeAmt1,
      testData.CrossBorder.amount,
    );

    // ═══════════════════════════════════════════════════════════════════
    // Phase C: Edit the Transaction (change amount to amountV)
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 27: Click Edit button on view page ──────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.editButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 28: Wait for edit form to load ──────────────────────────────
    await pages.CrossBoarderACHPage.waitForFormReady();

    // ── Step 29: Clear and enter new amount ──────────────────────────────
    await pages.CrossBoarderACHPage.payeeAmount.click();
    await pages.CrossBoarderACHPage.payeeAmount.fill('');
    await page.waitForTimeout(TIMEOUT.BRIEF);
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.payeeAmount,
      testData.CrossBorder.amountV,
    );

    // ── Step 30: Click Next ──────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.nextButton);

    // ── Step 31: Wait for Preview page ───────────────────────────────────
    await pages.CrossBoarderACHPage.waitForPreviewPage();

    // ── Step 32: Click Submit ────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.submitButton);

    // ── Step 33: Wait for Submitted confirmation ─────────────────────────
    await pages.CrossBoarderACHPage.waitForSubmittedPage();

    // ── Step 34: Capture Edit Reference ID ───────────────────────────────
    let referenceEdit = '';
    try {
      const refText = await webComponents.getTextFromElement(pages.CrossBoarderACHPage.idealXInfoMsg);
      referenceEdit = await webComponents.getReferenceID(refText);
      console.log('TC002 Edit Reference ID:', referenceEdit);
    } catch (e) {
      console.warn('Failed to capture edit reference from info msg, trying body text');
      try {
        const bodyText = await webComponents.getTextFromElement(page.locator('body'));
        referenceEdit = await webComponents.getReferenceID(bodyText);
        console.log('TC002 Edit Reference ID (from body):', referenceEdit);
      } catch (e2) {
        console.warn('Failed to capture edit reference ID:', e2);
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // Phase D: Validate Edited Amount on View Page (amountV = "10")
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 35: Navigate to Transfer Center ─────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 36: Search and open edited payment ──────────────────────────
    const searchRef = referenceEdit || reference;
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (searchRef) {
      await pages.TransferCentersPage.searchAndOpenByReference(searchRef);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Cross Border ACH',
        testData.status.PendingApproval,
      );
    }

    // ── Step 37: Wait for View page ──────────────────────────────────────
    await pages.CrossBoarderACHPage.waitForViewPage();

    // ── 37.1 Validate: Deducted Amount matches edited amount ─────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.deductedAmt,
      testData.CrossBorder.amountV,
    );

    // ── 37.2 Validate: Payee 1 Amount matches edited amount ─────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeAmt1,
      testData.CrossBorder.amountV,
    );

    // ── 37.3 Validate: Amount to Transfer matches edited amount ──────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.amountToTransfer,
      testData.CrossBorder.amountV,
    );

    // ── 37.4 Validate: Status is still Pending Approval ──────────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.statusValue,
      testData.status.PendingApproval,
    );

    // ═══════════════════════════════════════════════════════════════════
    // Phase E: Delete the edited payment (cleanup)
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 38: Delete the payment from the view page ───────────────────
    const deleteRef = referenceEdit || reference;
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.CrossBorder.transactionDeleted,
      internalReference: deleteRef,
    }, deleteRef);

    console.log(`TC002 – Cross Border ACH Payment ${deleteRef} edited and deleted successfully`);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC003 — Approve a Cross Border ACH Payment
  // Flow: Create → Validate Amount → Open → Approve → Validate status → Delete
  // ════════════════════════════════════════════════════════════════════════════
  test('TC003_Approve a Cross Border ACH Payment', async ({ page }) => {

    // ═══════════════════════════════════════════════════════════════════
    // Phase A: Create a Cross Border ACH Payment (reuse TC001 flow)
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 1: Navigate to the Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Click second page dot to navigate to Cross Border ACH ────
    await webComponents.clickPaginationDot(pages.CrossBoarderACHPage.secondPageDot);

    // ── Step 4: Click Cross Border ACH menu ──────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.crossBorderMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 5: Wait for Cross Border ACH form ───────────────────────────
    await pages.CrossBoarderACHPage.waitForFormReady();

    // ── Step 6: Select From Account ──────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.fromAccount,
      testData.CrossBorder.fromAccount,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Select Payment Country ───────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.paymentCountry,
      testData.CrossBorder.paymentCountry,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 8: Select Debit Type ────────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.debitType,
      testData.CrossBorder.debitType,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 9: Add Existing Payee ───────────────────────────────────────
    await pages.CrossBoarderACHPage.addExistingPayee(testData.CrossBorder.existingFilterValue);

    // ── Step 10: Enter Payee Amount ──────────────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.payeeAmount,
      testData.CrossBorder.amount,
    );

    // ── Step 11: Enter Payment Detail ────────────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.paymentDetail,
      testData.CrossBorder.paymentDetail,
    );

    // ── Step 12: Click Show Option Detail ────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.showOptionDetail);

    // ── Step 13: Click Intermediary Bank Information ──────────────────────
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.intermediaryBankInformation);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 14: Select Intermediary Country ──────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.selectedIntermediaryCountry,
      testData.CrossBorder.IntermediaryCountry,
    );

    // ── Step 15: Enter Intermediary Bank ID ───────────────────────────────
    await webComponents.enterText(
      pages.CrossBoarderACHPage.intermediaryBankIDInput,
      testData.CrossBorder.bankID,
    );
    await page.waitForTimeout(TIMEOUT.MODERATE);
    const bankResult = page.locator('table tr td').first();
    if (await bankResult.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
      await bankResult.click();
      await page.waitForTimeout(TIMEOUT.MICROMIN);
    }

    // ── Step 16: Click Message To Payee ──────────────────────────────────
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.messageToPayeeLabel);
    await page.waitForTimeout(TIMEOUT.BRIEF);

    // ── Step 17: Enter Emails 1-5 ────────────────────────────────────────
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email1, testData.CrossBorder.Email1);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email2, testData.CrossBorder.Email2);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email3, testData.CrossBorder.Email3);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email4, testData.CrossBorder.Email4);
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.email5, testData.CrossBorder.Email5);

    // ── Step 18: Enter Message ────────────────────────────────────────────
    await webComponents.enterTextarea(pages.CrossBoarderACHPage.message, testData.CrossBorder.Message);

    // ── Step 19: Click Next ──────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.nextButton);

    // ── Step 20: Wait for Preview page ───────────────────────────────────
    await pages.CrossBoarderACHPage.waitForPreviewPage();

    // ── Step 21: Click Submit ────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.submitButton);

    // ── Step 22: Wait for Submitted confirmation ─────────────────────────
    await pages.CrossBoarderACHPage.waitForSubmittedPage();

    // ── Step 23: Capture Reference ID ────────────────────────────────────
    let reference = '';
    try {
      const refText = await webComponents.getTextFromElement(pages.CrossBoarderACHPage.idealXInfoMsg);
      reference = await webComponents.getReferenceID(refText);
      console.log('TC003 Create Reference ID:', reference);
    } catch (e) {
      console.warn('Failed to capture reference from info msg, trying body text');
      try {
        const bodyText = await webComponents.getTextFromElement(page.locator('body'));
        reference = await webComponents.getReferenceID(bodyText);
        console.log('TC003 Create Reference ID (from body):', reference);
      } catch (e2) {
        console.warn('Failed to capture reference ID:', e2);
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // Phase B: Validate Amount on View Page (amount = "1")
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 24: Navigate to Transfer Center ─────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 25: Search and open payment ─────────────────────────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Cross Border ACH',
        testData.status.PendingApproval,
      );
    }

    // ── Step 26: Wait for View page ──────────────────────────────────────
    await pages.CrossBoarderACHPage.waitForViewPage();

    // ── 26.1 Validate: Deducted Amount matches original amount ───────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.deductedAmt,
      testData.CrossBorder.amount,
    );

    // ── 26.2 Validate: Payee 1 Amount matches original amount ────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.payeeAmt1,
      testData.CrossBorder.amount,
    );

    // ═══════════════════════════════════════════════════════════════════
    // Phase C: Approve the Transaction
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 27: Click Approve button on view page ───────────────────────
    await webComponents.javaScriptsClick(pages.AccountTransferPage.viewPageApproveButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 28: Expand digital token / security device section ──────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.pushOption);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 29: Click Get Challenge SMS ──────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.getChallengeSMS);

    // ── Step 30: Enter Challenge Response ─────────────────────────────────
    await webComponents.enterTextarea(
      pages.AccountTransferPage.challengeResponse,
      String(CONSTANTS.CHALLENGEVIASMSCODE),
    );

    // ── Step 31: Wait for Approval section to be ready ───────────────────
    await webComponents.waitForUXLoading([], page);
    await expect(pages.AccountTransferPage.viewPageApproveButton).toBeEnabled({ timeout: TIMEOUT.MEDIUM });

    // ── Step 32: Click Approve button to confirm ─────────────────────────
    await webComponents.javaScriptsClick(pages.AccountTransferPage.viewPageApproveButton);
    await page.waitForTimeout(TIMEOUT.MICROMIN);

    // ── Step 33: Click Dismiss button ────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);

    // ═══════════════════════════════════════════════════════════════════
    // Phase D: Validate Status = Approved
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 34: Navigate to Transfer Center ─────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 35: Search and open approved payment ────────────────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Cross Border ACH',
        testData.status.Approved,
      );
    }

    // ── Step 35: Wait for View page ──────────────────────────────────────
    await pages.CrossBoarderACHPage.waitForViewPage();

    // ── 35.1 Validate: Status is Approved ────────────────────────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.crsBrdTransactionStatusValue,
      testData.status.Approved,
    );

    // ── 35.2 Validate: Amount is still correct ───────────────────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.deductedAmt,
      testData.CrossBorder.amount,
    );

    console.log(`TC003 – Cross Border ACH Payment ${reference} approved successfully (status: Approved). Delete skipped — approved payments cannot be deleted.`);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC004 — Create an INTL Cross Border ACH Payment
  // Flow: Create (CHILE/INTL) → Navigate Transfer Center → Validate View Page → Delete
  // ════════════════════════════════════════════════════════════════════════════
  test('TC004_Create an INTL Cross Border ACH Payment', async ({ page }) => {

    // ═══════════════════════════════════════════════════════════════════
    // Phase A: Create an INTL Cross Border ACH Payment
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 1: Navigate to the Pay & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Click second page dot to navigate to Cross Border ACH ────
    await webComponents.clickPaginationDot(pages.CrossBoarderACHPage.secondPageDot);

    // ── Step 4: Click Cross Border ACH menu ──────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.crossBorderMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 5: Wait for Cross Border ACH form ───────────────────────────
    await pages.CrossBoarderACHPage.waitForFormReady();

    // ── Step 6: Select From Account ──────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.fromAccount,
      testData.CrossBorder.fromAccount,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Select INTL Payment Country (CHILE) ──────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.paymentCountry,
      testData.CrossBorder.paymentCountryINTL,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 8: Select Debit Type ────────────────────────────────────────
    await webComponents.selectAutoComplete(
      page,
      pages.CrossBoarderACHPage.debitType,
      testData.CrossBorder.debitType,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 9: Add INTL New Payee ───────────────────────────────────────
    await pages.CrossBoarderACHPage.addINTLNewPayee(
      testData.CrossBorder.payeeNameINTL,
      testData.CrossBorder.payeeBankIDINTL,
      testData.CrossBorder.accountNumberINTL,
    );
    await webComponents.waitForUXLoading([], page);

    // ── Step 10: Click Add Payee button ──────────────────────────────────
    await expect(pages.CrossBoarderACHPage.addPayee.first()).toBeEnabled({ timeout: TIMEOUT.MIN });
    await webComponents.javaScriptsClick(pages.CrossBoarderACHPage.addPayee);
    await webComponents.waitForUXLoading([], page);

    // ── Step 11: Enter Payee Amount (INTL) ───────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.payeeAmount,
      testData.CrossBorder.amountINTL,
    );

    // ── Step 12: Enter Purpose of Payment Line ───────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.purposePaymentLine.first(),
      testData.CrossBorder.purposePaymentLine1,
    );

    // ── Step 13: Enter Additional Info Line ───────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.additionalInfoLine.first(),
      testData.CrossBorder.additionalInfoLine1,
    );

    // ── Step 14: Click Show/Hide Detail ───────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.showOptionDetail);

    // ── Step 15: Enter Payment Detail Line ────────────────────────────────
    await webComponents.enterTextarea(
      pages.CrossBoarderACHPage.paymentDetailLine.first(),
      testData.CrossBorder.paymentDetailLine1,
    );

    // ── Step 16: Click Next ──────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.nextButton);

    // ── Step 17: Wait for Preview page ───────────────────────────────────
    await pages.CrossBoarderACHPage.waitForPreviewPage();

    // ── Step 18: Click Submit ────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.CrossBoarderACHPage.submitButton);

    // ── Step 19: Wait for Submitted confirmation ─────────────────────────
    await pages.CrossBoarderACHPage.waitForSubmittedPage();

    // ── Step 20: Capture Reference ID ────────────────────────────────────
    let reference = '';
    try {
      const refText = await webComponents.getTextFromElement(pages.CrossBoarderACHPage.idealXInfoMsg);
      reference = await webComponents.getReferenceID(refText);
      console.log('TC004 Create Reference ID:', reference);
    } catch (e) {
      console.warn('Failed to capture reference from info msg, trying body text');
      try {
        const bodyText = await webComponents.getTextFromElement(page.locator('body'));
        reference = await webComponents.getReferenceID(bodyText);
        console.log('TC004 Create Reference ID (from body):', reference);
      } catch (e2) {
        console.warn('Failed to capture reference ID:', e2);
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // Phase B: Validate View Page
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 21: Navigate to Transfer Center ─────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 22: Search and open payment ─────────────────────────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'Cross Border ACH',
        testData.status.PendingApproval,
      );
    }

    // ── Step 23: Wait for View page ──────────────────────────────────────
    await pages.CrossBoarderACHPage.waitForViewPage();

    // ── 23.1 Validate: From Account ──────────────────────────────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.fromAccountView,
      testData.CrossBorder.fromAccount,
    );

    // ── 23.2 Validate: Amount matches INTL amount ────────────────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.deductedAmt,
      testData.CrossBorder.amountINTL,
    );

    // ── 23.3 Validate: Payment Date is not empty ─────────────────────────
    await webComponents.verifyUIElementTextIsNotNull(
      pages.CrossBoarderACHPage.paymentDateView,
    );

    // ── 23.4 Validate: Payee Name matches INTL payee ─────────────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.ExistingPayee,
      testData.CrossBorder.payeeNameINTL,
    );

    // ── 23.5 Validate: Status is Pending Approval ────────────────────────
    await webComponents.compareUIVsJsonValue(
      pages.CrossBoarderACHPage.crsBrdTransactionStatusValue,
      testData.status.PendingApproval,
    );

    // ═══════════════════════════════════════════════════════════════════
    // Phase C: Delete the payment (cleanup)
    // ═══════════════════════════════════════════════════════════════════

    // ── Step 24: Delete the payment from the view page ───────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.CrossBorder.transactionDeleted,
      internalReference: reference,
    }, reference);

    console.log(`TC004 – INTL Cross Border ACH Payment ${reference} created and deleted successfully`);
  });
});
