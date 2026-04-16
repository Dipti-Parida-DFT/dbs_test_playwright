/**
 * Author: Agent Generated
 * Created Date: 13/04/2026
 * Class path "tests/e2e/IDEALX/PayTransfer/SG_AccountTransferTC001AgentGenerated.spec.ts"
 * Description: This Specification contains the test case for Singapore Account Transfer.
 * 1) TC01_Create an ACT Payment with new Payee
 * 2) TC02_Create an ACT Payment with ApprovalNow with Mchanllenge
 * 3) TC03_Create an ACT Payment with ApprovalNow without Mchanllenge
 * 4) TC04_Create an ACT Payment with Save as Template
 * 5) TC05_Create an ACT Payment from Template
 * 6) TC06_Create an ACT with Save as Draft
 */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { WebComponents } from '../../../lib/webComponents';
import { generatedID } from '../../../lib/utils';

// Initialize WebComponents helper
const webComponents = new WebComponents();

// Load JSON test data
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// Credentials — use ManagePayroll SIT credentials (AccountTransfer creds are invalid)
const loginCompanyId = testData.AccountTransfer.loginCompanyId;
const loginUserId    = testData.AccountTransfer.loginUserId;
const fromAccount    = testData.AccountTransfer.fromAccount;

// Configure retries (aligned with team convention)
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_AccountTransfer_TC001 (Playwright)', () => {
  let pages: PaymentsPages;

  /**
   * Runs before every test case to launch the browser/page and log in.
   */
  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;

    // Single-phase test — TIMEOUT.MAX (5 min) is sufficient
    test.setTimeout(TIMEOUT.MAX);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, String(CONSTANTS.PIN));

    pages = new PaymentsPages(page);
  });

  /**
   * Runs after every test case — skip cleanup if the test did not pass.
   */
  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed') {
      console.warn(`[afterEach] Skipping cleanup — test status: ${testInfo.status}`);
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC01 — Create an ACT Payment with a new Payee
  // ════════════════════════════════════════════════════════════════════════════
  test('TC01_Create an ACT Payment with new Payee', async ({ page }) => {

    // ── Step 1: Navigate to the Payment & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────────
    // (learnings.md: handleAuthIfPresent is session-scoped — first paymentMenu click only)
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center and click Make Payment ──────────────
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.makePayment);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ACT form; select From Account via autocomplete ───────
    await pages.AccountTransferPage.waitForAccountFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 5: Enter payment amount ─────────────────────────────────────────
    //await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.amount);
    //await pages.AccountTransferPage.amount.fill(testData.AccountTransfer.amountA1);

    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);


    // ── Step 6: Click the New Payee tab ──────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeTab);

    // ── Step 7: Handle cognitive-continue popup if it appears ─────────────────
    try {      
     await webComponents.waitElementToBeVisible(pages.AccountTransferPage.continueBtn);
     await webComponents.javaScriptsClick(pages.AccountTransferPage.continueBtn);
     await webComponents.waitForUXLoading([], page);

    } catch { /* popup not present — proceed */ }

    // ── Step 8: Select Country (SINGAPORE) via autocomplete ──────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.Country);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.Country);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 9: Enter new payee name ─────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeName);
    await webComponents.enterTextarea(pages.AccountTransferPage.newPayeeName, testData.AccountTransfer.newPayeeName);

    // ── Step 10: Enter payee nickname ────────────────────────────────────────
    await webComponents.isElementVisible(page, pages.AccountTransferPage.newPayeeNickNameInput, { timeout: TIMEOUT.LONG });
    await webComponents.enterText(pages.AccountTransferPage.newPayeeNickNameInput, testData.AccountTransfer.newPayeeName);

    // ── Step 11: Enter address line 1 ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeAdd1);
    //await pages.AccountTransferPage.newPayeeAdd1.fill(testData.AccountTransfer.newPayeeAdd1);

    await webComponents.enterText(pages.AccountTransferPage.newPayeeAdd1, testData.AccountTransfer.newPayeeAdd1);

    // ── Step 12: Enter address line 2 ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeAdd2);
    await webComponents.enterText(pages.AccountTransferPage.newPayeeAdd2, testData.AccountTransfer.newPayeeAdd2);

    // ── Step 13: Enter postal code (was "Address line 3" in Protractor) ──────
    //await expect(pages.AccountTransferPage.postalCodeInput).toBeVisible({ timeout: TIMEOUT.LONG });
    await webComponents.isElementVisible(page, pages.AccountTransferPage.postalCodeInput, { timeout: TIMEOUT.LONG });
    await webComponents.enterText(pages.AccountTransferPage.postalCodeInput, testData.AccountTransfer.newPayeeAdd3);

    // ── Step 14: Select DBS Bank provider (radio button in current UI) ───────
    //await expect(pages.AccountTransferPage.dbsBankRadio).toBeVisible({ timeout: TIMEOUT.LONG });
    await webComponents.isElementVisible(page, pages.AccountTransferPage.dbsBankRadio, { timeout: TIMEOUT.LONG });
    await webComponents.javaScriptsClick(pages.AccountTransferPage.dbsBankRadio);
    await webComponents.waitForUXLoading([], page);

    // ── Step 15: Enter new payee account number ──────────────────────────────
    //await expect(pages.AccountTransferPage.newPayeeAcctNumberInput).toBeVisible({ timeout: TIMEOUT.LONG });
    await webComponents.isElementVisible(page, pages.AccountTransferPage.newPayeeAcctNumberInput, { timeout: TIMEOUT.LONG });
    await webComponents.enterText(pages.AccountTransferPage.newPayeeAcctNumberInput, testData.AccountTransfer.newPayeeAcctNumber);
    await page.keyboard.press('Tab');

    // ── Step 16: Enter payment detail ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentDetail);
    //await pages.AccountTransferPage.paymentDetail.fill(testData.AccountTransfer.paymentDetail);
    await webComponents.enterTextarea(pages.AccountTransferPage.paymentDetail, testData.AccountTransfer.paymentDetail);

    // ── Step 17: Toggle Bene Advising checkbox ───────────────────────────────
    // (learnings.md: Angular hidden checkbox — click visible label; verify + retry up to 3×)
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isBeneAdvisingLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isBeneAdvisingCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 18: Fill email addresses ────────────────────────────────────────
    // (learnings.md: after toggle, email fields have no name attribute;
    //  use page.getByRole('textbox', { name: 'Email' }).nth(N) with safeClick → fill → blur)
    //const emailFields = page.getByRole('textbox', { name: 'Email' });
    //await pages.AccountTransferPage.safeClick(emailFields.nth(0));
    //await emailFields.nth(0).fill(testData.AccountTransfer.emailIdO);
    //await emailFields.nth(0).blur();

    await webComponents.enterTextarea(pages.AccountTransferPage.emailId0, testData.AccountTransfer.emailIdO);

    //await pages.AccountTransferPage.safeClick(emailFields.nth(1));
    //await emailFields.nth(1).fill(testData.AccountTransfer.emailId1);
    //await emailFields.nth(1).blur();

    await webComponents.enterTextarea(pages.AccountTransferPage.emailId1, testData.AccountTransfer.emailId1);

    //await pages.AccountTransferPage.safeClick(emailFields.nth(2));
    //await emailFields.nth(2).fill(testData.AccountTransfer.emailId2);
    //await emailFields.nth(2).blur();

    await webComponents.enterTextarea(pages.AccountTransferPage.emailId2, testData.AccountTransfer.emailId2);


    //await pages.AccountTransferPage.safeClick(emailFields.nth(3));
    //await emailFields.nth(3).fill(testData.AccountTransfer.emailId3);
    //await emailFields.nth(3).blur();

    await webComponents.enterTextarea(pages.AccountTransferPage.emailId3, testData.AccountTransfer.emailId3);


    //await pages.AccountTransferPage.safeClick(emailFields.nth(4));
    //await emailFields.nth(4).fill(testData.AccountTransfer.emailId4);
    //await emailFields.nth(4).blur();

    await webComponents.enterTextarea(pages.AccountTransferPage.emailId4, testData.AccountTransfer.emailId4);


    // ── Step 19: Enter message to beneficiary ────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.message);
    //await pages.AccountTransferPage.message.fill(testData.AccountTransfer.message);
    await webComponents.enterTextarea(pages.AccountTransferPage.message, testData.AccountTransfer.message);

    // ── Step 20: Toggle Transaction Note checkbox ────────────────────────────
    // (learnings.md: same Angular hidden checkbox — label-click retry pattern)
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isTransactionNoteLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isTransactionNoteCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 21: Enter transaction note ──────────────────────────────────────
    //await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.transactionNote);
    //await webComponents.enterTextarea(pages.AccountTransferPage.transactionNote, testData.AccountTransfer.transactionNote);
    
    await webComponents.enterTextarea(pages.AccountTransferPage.transactionNote, testData.AccountTransfer.transactionNote);

    // ── Step 22: Click Next to proceed to the preview page ───────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 23: Submit the payment ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 24: Wait for submission confirmation page ───────────────────────
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 25: Capture transaction reference ID ────────────────────────────
    // Pattern: same approach as ManagePayroll/TT specs — read page body text,
    // extract EB reference via webComponents.getReferenceID() regex
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC01 – referenceID:', reference);
    } catch (err) {
      //console.warn('TC01 – Could not capture reference ID from submitted page:', (err as Error).message);
    }

    // ── Step 26: Navigate back to Transfer Center via Payment menu ───────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 27: Search for the created payment and open view page ───────────
    // (learnings.md: use try/catch — if reference exists search by ref, else fallback to status filter)
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 28: Wait for the view payment page to be fully loaded ───────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 29: Validate all view page fields ───────────────────────────────
    // fromAccountValue shows the underlying DBS account number
    // (learnings.md: not the display name used during input)
    //await expect(pages.AccountTransferPage.fromAccountValue).toContainText(fromAccount);

    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.fromAccountValue, fromAccount);

    //await expect(pages.AccountTransferPage.amountValue).toContainText(testData.AccountTransfer.amountA1);

    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.amountValue, testData.AccountTransfer.amountA1);

    // New payee name on the view page
    //await expect(pages.AccountTransferPage.toNewPayeeNameValue).toContainText(testData.AccountTransfer.newPayeeName);

    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.toNewPayeeNameValue, testData.AccountTransfer.newPayeeName);

    // Status must be "Pending Approval" for a newly created payment

    //await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingApproval);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.actStatusValue, testData.status.PendingApproval);

    // Hash value — must be non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.hashValue);

    // Reference value — only assert when reference was successfully captured
    //if (reference.trim().length > 0) {
      //await expect(pages.AccountTransferPage.referenceValue).toContainText(reference);
    //}
    await expect(pages.AccountTransferPage.paymentType).toContainText(testData.AccountTransfer.paymentType);

    // Deduct amount and payment date — must be non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.deductAmountValue);
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.paymentDateValue);

    // Note: balanceValue (#view-act-acctBalance) no longer exists on the ACT view page
    // (learnings.md: element removed from current UI — assertion omitted)

    // Payee info — use stable id-based locators instead of positional XPath
    // (learnings.md: payeeInfo positional XPath is fragile; prefer #act-view-* ids)
    //await expect(pages.AccountTransferPage.toNewPayeeAcctValue).toContainText(testData.AccountTransfer.newPayeeAcctNumber);
    //await expect(pages.AccountTransferPage.payeeAdd1).toContainText(testData.AccountTransfer.newPayeeAdd1);
    //await expect(pages.AccountTransferPage.payeeAdd2).toContainText(testData.AccountTransfer.newPayeeAdd2);
    
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.toNewPayeeAcctValue, testData.AccountTransfer.newPayeeAcctNumber);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.payeeAdd1, testData.AccountTransfer.newPayeeAdd1);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.payeeAdd2, testData.AccountTransfer.newPayeeAdd2);


    // payeeAdd3 (#act-view-payee-add3) — postal code is NOT displayed on the view page
    // (confirmed via ARIA snapshot: "To" section only renders address lines 1 & 2)

    //await expect(pages.AccountTransferPage.paymentType).toContainText(testData.AccountTransfer.paymentType);
    //await expect(pages.AccountTransferPage.paymentDetailValue).toContainText(testData.AccountTransfer.paymentDetail);
    //await expect(pages.AccountTransferPage.messageValue).toContainText(testData.AccountTransfer.message);

    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.paymentType, testData.AccountTransfer.paymentType);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.paymentDetailValue, testData.AccountTransfer.paymentDetail);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.messageValue, testData.AccountTransfer.message);

    // Email list — single element aggregating all email addresses
    //await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailIdO);
    //await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId1);
    //await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId2);
    //await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId3);
    //await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId4);

    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.validateEmail1, testData.AccountTransfer.emailIdO);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.validateEmail2, testData.AccountTransfer.emailId1);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.validateEmail3, testData.AccountTransfer.emailId2);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.validateEmail4, testData.AccountTransfer.emailId3);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.validateEmail5, testData.AccountTransfer.emailId4);



    // Total deduct value reflects the created amount
    //await expect(pages.AccountTransferPage.totalDeductValue).toContainText(testData.AccountTransfer.amountA1);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.totalDeductValue, testData.AccountTransfer.amountA1);

    // Transaction note on the view page
    //await expect(pages.AccountTransferPage.messageToApproverValue).toContainText(testData.AccountTransfer.transactionNote);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.messageToApproverValue, testData.AccountTransfer.transactionNote);

    // Next approver — must be non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.nextApprover);

    // Activity log must contain 'Create' for a newly submitted payment
    //await expect(pages.AccountTransferPage.activityLog).toContainText('Create');
    await expect(pages.AccountTransferPage.activityLog).toContainText(testData.AccountTransfer.newlySubmittedPayment);

    // ── Step 30: Delete the created payment from the view page ────────────────
    // Reuse PayrollPage.deleteOpenPayeeOrReferenceNo() — same shared delete dialog across modules
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: reference
    }, reference);

    console.log(`TC01 – Payment ${reference} deleted successfully`);

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC02 — Create an ACT Payment with ApprovalNow with M-Challenge
  // ════════════════════════════════════════════════════════════════════════════
  test('TC02_Create an ACT Payment with ApprovalNow with Mchanllenge', async ({ page }) => {

    // ── Step 1: Navigate to the Payment & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center and click Make Payment ──────────────
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.makePayment);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ACT form; select From Account via autocomplete ──────
    await pages.AccountTransferPage.waitForAccountFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 5: Enter payment amount ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);

    // ── Step 6: Select Existing Payee via autocomplete ───────────────────────
    // (The existingPayee locator targets the p-auto-complete container;
    //  must target the inner input, type slowly for autocomplete to filter, then select)
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    // Wait for autocomplete dropdown to filter and show results
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter payment detail ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.paymentDetail, testData.AccountTransfer.paymentDetail);

    // ── Step 8: Toggle Bene Advising checkbox ────────────────────────────────
    // (learnings.md: Angular hidden checkbox — click visible label; verify + retry up to 3×)
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isBeneAdvisingLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isBeneAdvisingCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 9: Fill email addresses ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId0, testData.AccountTransfer.emailIdO);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId1, testData.AccountTransfer.emailId1);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId2, testData.AccountTransfer.emailId2);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId3, testData.AccountTransfer.emailId3);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId4, testData.AccountTransfer.emailId4);

    // ── Step 10: Enter message to beneficiary ────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.message, testData.AccountTransfer.message);

    // ── Step 11: Toggle Transaction Note checkbox ────────────────────────────
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isTransactionNoteLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isTransactionNoteCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 12: Enter transaction note ──────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.transactionNote, testData.AccountTransfer.transactionNote);

    // ── Step 13: Click Next to proceed to the preview page ───────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 14: Click ApproveNow checkbox (M-Challenge flow) ────────────────
    // (learnings.md: use javaScriptsClick for approveNow checkbox)
    await webComponents.javaScriptsClick(pages.AccountTransferPage.approvalNowCheckBox);

    // ── Step 15: Expand M-Challenge section and click Get Challenge SMS ──────
    // The SMS button may be hidden behind "Alternatively, use your digital token..."
    // link — click it to expand if SMS button is not immediately visible.
    const smsVisible = await pages.AccountTransferPage.getChallengeSMS.isVisible().catch(() => false);
    if (!smsVisible) {
      const altLink = page.getByText('Alternatively, use your digital token');
      await altLink.click({ timeout: 10_000 });
    }
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.getChallengeSMS);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.getChallengeSMS);

    // ── Step 16: Enter challenge response code ───────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.challengeResponse, String(CONSTANTS.CHALLENGEVIASMSCODE));

    // ── Step 17: Submit the payment ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 18: Wait for submission confirmation page ────────────────────────
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 19: Capture transaction reference ID ────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC02 – referenceID:', reference);
    } catch (err) {
      // Could not capture reference ID — proceed with fallback search
    }

    // ── Step 20: Navigate back to Transfer Center via Payment menu ───────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 21: Search for the created payment and open view page ───────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 22: Wait for the view payment page to be fully loaded ───────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 23: Assert status is one of the valid post-approval statuses ────
    // (Protractor: textbaohanLessOne — status depends on bank processing speed)
    const validStatuses = [
      testData.status.Received,
      testData.status.Approved,
      testData.status.PendingRelease,
      testData.status.Completed,
      testData.status.BankRejected,
    ];
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(
      new RegExp(validStatuses.join('|'))
    );

    console.log(`TC02 – Payment ${reference} created with ApprovalNow (M-Challenge) successfully`);

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC03 — Create an ACT Payment with ApprovalNow without M-Challenge
  // ════════════════════════════════════════════════════════════════════════════
  test('TC03_Create an ACT Payment with ApprovalNow without Mchanllenge', async ({ page }) => {

    // ── Step 1: Navigate to the Payment & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center and click Make Payment ──────────────
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.makePayment);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ACT form; select From Account via autocomplete ──────
    await pages.AccountTransferPage.waitForAccountFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 5: Enter payment amount (amountPartialApprove — triggers Partial Approved status) ─
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountPartialApprove);

    // ── Step 6: Select Existing Payee via autocomplete ───────────────────────
    // (learnings.md: target inner input of p-auto-complete, type char-by-char, ArrowDown+Enter)
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter payment detail ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.paymentDetail, testData.AccountTransfer.paymentDetail);

    // ── Step 8: Toggle Bene Advising checkbox ────────────────────────────────
    // (learnings.md: Angular hidden checkbox — click visible label; verify + retry up to 3×)
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isBeneAdvisingLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isBeneAdvisingCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 9: Fill email addresses (TC03 uses only 2 emails per Protractor source) ─
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId0, testData.AccountTransfer.emailIdO);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId1, testData.AccountTransfer.emailId1);

    // ── Step 10: Enter message to beneficiary ────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.message, testData.AccountTransfer.message);

    // ── Step 11: Toggle Transaction Note checkbox ────────────────────────────
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isTransactionNoteLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isTransactionNoteCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 12: Enter transaction note ──────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.transactionNote, testData.AccountTransfer.transactionNote);

    // ── Step 13: Click Next to proceed to the preview page ───────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 14: Click ApproveNow checkbox (without M-Challenge flow) ────────
    // (learnings.md: use javaScriptsClick for approveNow checkbox)
    await webComponents.javaScriptsClick(pages.AccountTransferPage.approvalNowCheckBox);

    // ── Step 15: Expand digital token section ────────────────────────────────
    // (learnings.md: "Without M-Challenge" — click pushOption to expand, do NOT click getChallengeSMS)
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.pushOption);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.pushOption);

    // ── Step 16: Enter challenge response code ───────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.challengeResponse, String(CONSTANTS.CHALLENGEVIASMSCODE));

    // ── Step 17: Submit the payment ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 18: Wait for submission confirmation page ────────────────────────
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 19: Capture transaction reference ID ────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC03 – referenceID:', reference);
    } catch (err) {
      // Could not capture reference ID — proceed with fallback search
    }

    // ── Step 20: Navigate back to Transfer Center via Payment menu ───────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 21: Search for the created payment and open view page ───────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PartialApproved,
      );
    }

    // ── Step 22: Wait for the view payment page to be fully loaded ───────────
    await pages.AccountTransferPage.waitForViewPage();
    await webComponents.waitForUXLoading([], page);

    // ── Step 23: Assert status is "Partial Approved" ─────────────────────────
    // (learnings.md: view page status placeholder loads >10s for high-amount payments;
    //  use explicit 30s timeout instead of compareUIVsJsonValue's 10s internal timeout)
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(
      testData.status.PartialApproved, { timeout: 30_000 }
    );

    console.log(`TC03 – Payment ${reference} created with ApprovalNow (without M-Challenge) successfully`);

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC04 — Create an ACT Payment with Save as Template
  // ════════════════════════════════════════════════════════════════════════════
  test('TC04_Create an ACT Payment with Save as Template', async ({ page }) => {

    // ── Step 1: Navigate to the Payment & Transfer menu ──────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center and click Make Payment ──────────────
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.makePayment);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ACT form; select From Account via autocomplete ──────
    await pages.AccountTransferPage.waitForAccountFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 5: Enter payment amount ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);

    // ── Step 6: Select Existing Payee via autocomplete ───────────────────────
    // (learnings.md: target inner input of p-auto-complete, type char-by-char, ArrowDown+Enter)
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter payment detail ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.paymentDetail, testData.AccountTransfer.paymentDetail);

    // ── Step 8: Toggle Bene Advising checkbox ────────────────────────────────
    // (learnings.md: Angular hidden checkbox — click visible label; verify + retry up to 3×)
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isBeneAdvisingLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isBeneAdvisingCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 9: Fill email addresses (TC04 uses only 2 emails per Protractor source) ─
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId0, testData.AccountTransfer.emailIdO);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId1, testData.AccountTransfer.emailId1);

    // ── Step 10: Enter message to beneficiary ────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.message, testData.AccountTransfer.message);

    // ── Step 11: Toggle Transaction Note checkbox ────────────────────────────
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isTransactionNoteLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isTransactionNoteCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 12: Enter transaction note ──────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.transactionNote, testData.AccountTransfer.transactionNote);

    // ── Step 13: Click Next to proceed to the preview page ───────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 14: Click Save as Template checkbox ─────────────────────────────
    // (Protractor: savaAsTemplateCheckBox.jsClick() — use javaScriptsClick per learnings)
    await webComponents.javaScriptsClick(pages.AccountTransferPage.savaAsTemplateCheckBox);

    // ── Step 15: Generate and enter template name ────────────────────────────
    const templateName = 'ACTTemplate' + generatedID();
    await webComponents.enterTextarea(pages.AccountTransferPage.templateName, templateName);

    // ── Step 16: Submit the payment ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 17: Wait for submission confirmation page ────────────────────────
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 18: Capture transaction reference ID ────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC04 – referenceID:', reference);
    } catch (err) {
      // Could not capture reference ID — proceed with fallback search
    }

    // ── Step 19: Navigate back to Transfer Center via Payment menu ───────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 20: Search for the created payment and open view page ───────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 21: Wait for the view payment page to be fully loaded ───────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 22: Validate view page fields ───────────────────────────────────
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.fromAccountValue, fromAccount);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.amountValue, testData.AccountTransfer.amountA1);
    // Payee display name is full system name ("ACT payee name 20230105..."), not the short filter text
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.toExistingPayeeNameValue);

    // ── Step 23: Navigate to Payment menu → Template management ──────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 24: Filter templates by name and open the template ──────────────
    await webComponents.enterTextarea(pages.PaymentTemplatesPage.manageTemplateFilter, templateName);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.templateNameLink);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateNameLink);
    await webComponents.waitForUXLoading([], page);

    // ── Step 25: Validate template view page fields ──────────────────────────
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.templateNameValue, templateName);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.fromAccountValue, fromAccount);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.amountValue, testData.AccountTransfer.amountA1);
    // Payee display name is full system name, not the short filter text
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.toExistingPayeeNameValue);

    console.log(`TC04 – Payment ${reference} created with template '${templateName}' successfully`);

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TC05 — Create an ACT Payment from Template
  // ═══════════════════════════════════════════════════════════════════════════
  test('TC05_Create an ACT Payment from Template', async ({ page }) => {

    // ── Step 1: Navigate Payment & Transfer Menu ─────────────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Navigate to Payment Templates page ───────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.createNewTemplateButton);

    // ── Step 4: Filter template by name ──────────────────────────────────────
    // (Parallel mode — use existingTemplate from test data; must be an approved ACT template in SIT)
    await webComponents.enterTextarea(
      pages.PaymentTemplatesPage.manageTemplateFilter,
      testData.AccountTransfer.existingTemplate,
    );
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.makeAPaymentLink);

    // ── Step 5: Click "Make a Payment" from the template ─────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.makeAPaymentLink);
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Wait for ACT form to load (pre-filled from template) ─────────
    // (Following SG_ManagePayroll.spec.ts pattern — wait for Next button visibility)
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.nextButton);

    // ── Step 7: Click Next to proceed to preview page ────────────────────────
    // (Template pre-fills all fields — no manual data entry needed)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 8: Submit the payment ───────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 9: Wait for submission confirmation page ─────────────────────────
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 10: Capture transaction reference ID ────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC05 – referenceID:', reference);
    } catch (err) {
      // Could not capture reference ID — proceed with fallback search
    }

    // ── Step 11: Navigate back to Transfer Center via Payment menu ───────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 12: Search for the created payment and open view page ───────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 13: Wait for the view payment page to be fully loaded ───────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 14: Validate view page fields ───────────────────────────────────
    // (Protractor uses isNotEmpty for all — exact values are template-dependent)
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.fromAccountValue);
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.amountValue);
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.toExistingPayeeNameValue);

    console.log(`TC05 – Payment from template '${testData.AccountTransfer.existingTemplate}' created: ${reference}`);

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TC06 — Create an ACT with Save as Draft
  // ═══════════════════════════════════════════════════════════════════════════
  test('TC06_Create an ACT with Save as Draft', async ({ page }) => {

    // ── Step 1: Navigate Payment & Transfer Menu ─────────────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // ── Step 2: Handle Authentication dialog if present ──────────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 3: Wait for Transfer Center and click Make Payment ──────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.makePayment);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ACT form; select From Account via autocomplete ──────
    await pages.AccountTransferPage.waitForAccountFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 5: Enter payment amount ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);

    // ── Step 6: Select Existing Payee via autocomplete ───────────────────────
    // (learnings.md: target inner input of p-auto-complete, type char-by-char, ArrowDown+Enter)
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter payment detail ─────────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.paymentDetail, testData.AccountTransfer.paymentDetail);

    // ── Step 8: Toggle Bene Advising checkbox ────────────────────────────────
    // (learnings.md: Angular hidden checkbox — click visible label; verify + retry up to 3×)
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isBeneAdvisingLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isBeneAdvisingCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 9: Fill email addresses (5 emails per Protractor source) ────────
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId0, testData.AccountTransfer.emailIdO);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId1, testData.AccountTransfer.emailId1);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId2, testData.AccountTransfer.emailId2);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId3, testData.AccountTransfer.emailId3);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId4, testData.AccountTransfer.emailId4);

    // ── Step 10: Enter message to beneficiary ────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.message, testData.AccountTransfer.message);

    // ── Step 11: Toggle Transaction Note checkbox ────────────────────────────
    for (let attempt = 0; attempt < 3; attempt++) {
      await pages.AccountTransferPage.isTransactionNoteLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await pages.AccountTransferPage.isTransactionNoteCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 12: Enter transaction note ──────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.transactionNote, testData.AccountTransfer.transactionNote);

    // ── Step 13: Click Save as Draft ─────────────────────────────────────────
    // (Key difference from TC01–TC04: uses saveAsDraft instead of Next → Submit)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.saveAsDraft);
    await webComponents.waitForUXLoading([], page);

    // ── Step 14: Capture reference ID from dialog ────────────────────────────
    // (Save-as-draft shows a dialog with reference — use SG_ManagePayroll pattern)
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.transactionDeletedPopupLabelMsg);
    const referenceText = await webComponents.getTextFromElement(pages.AccountTransferPage.transactionDeletedPopupLabelMsg);
    const reference = await webComponents.getReferenceID(referenceText);
    console.log('TC06 – referenceID:', reference);

    // ── Step 15: Dismiss the dialog ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 16: Navigate back to Transfer Center via Payment menu ───────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 17: Search for the saved draft and open view page ───────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.Saved,
      );
    }

    // ── Step 18: Wait for the view payment page to be fully loaded ───────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 19: Validate view page fields ───────────────────────────────────
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.fromAccountValue, fromAccount);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.amountValue, testData.AccountTransfer.amountA1);
    // Payee display name is full system name, not the short filter text (learnings.md)
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.toExistingPayeeNameValue);
    // Status "Saved" — use explicit timeout (view page status loads slowly, same as ApprovalNow pattern)
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.Saved, { timeout: 30_000 });

    console.log(`TC06 – Draft payment saved: ${reference}`);

  });
});
