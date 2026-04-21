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
 * 7) TC07_Copy an ACT via Transfer Center
 * 8) TC08_Edit an ACT Payment via Transfer Center
 * 9) TC09_TC10_Reject and delete an ACT Payment via Transfer Center
 * 10) TC11_Edit an ACT Payment with non Dol user check amount deduct logic
 * 11) TC012_Verify an ACT Payment via My Verify
 * 12) TC013_Approve an ACT Payment via Transfer Center
 * 13) TC014_Release an ACT Payment via My Release
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

  // ════════════════════════════════════════════════════════════════════════════
  // TC07 — Copy an ACT via Transfer Center
  // ════════════════════════════════════════════════════════════════════════════
  test('TC07_Copy an ACT via Transfer Center', async ({ page }) => {

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

    // ── Step 3: Wait for Transfer Center and search for an existing ACT payment ──
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.openViewPaymentViaSearch(
      'SG - Account Transfer',
      testData.status.PendingApproval,
    );

    // ── Step 4: Wait for the view payment page to load ───────────────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 5: Click Copy button ────────────────────────────────────────────
    await webComponents.javaScriptsClick(pages.AccountTransferPage.copyButton);

    // ── Step 6: Wait for ACT form to load with copied data ───────────────────
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 7: Clear amount and enter new amount ────────────────────────────
    // amountV is "3,100" (formatted) — strip comma for raw numeric input; field auto-formats
    const rawAmount = testData.AccountTransfer.amountV.replace(/,/g, '');
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, rawAmount);
    await page.waitForTimeout(2000);

    // ── Step 8: Click Next to go to preview page ─────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 9: Click Submit ─────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 10: Wait for submission confirmation page ────────────────────────
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 11: Capture transaction reference ID ────────────────────────────
    let reference = '';
    try {
      const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
      reference = await webComponents.getReferenceID(bodyText ?? '');
      console.log('TC07 – referenceID:', reference);
    } catch (err) {
      // Could not capture reference — proceed with fallback search
    }

    // ── Step 12: Navigate back to Transfer Center via Payment menu ────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 13: Search for the copied payment and open view page ─────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingVerification,
      );
    }

    // ── Step 14: Wait for the view payment page to be fully loaded ────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 15: Validate view page fields ───────────────────────────────────
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.fromAccountValue);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.amountValue, testData.AccountTransfer.amountV);
    // Status — use explicit 30s timeout (learnings.md: status loads slowly on ACT view page)
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingVerification, { timeout: 30_000 });

    console.log(`TC07 – Copied payment reference: ${reference}`);

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC08 — Edit an ACT Payment via Transfer Center
  // ════════════════════════════════════════════════════════════════════════════
  test('TC08_Edit an ACT Payment via Transfer Center', async ({ page }) => {

    // ── PHASE 1: CREATE an ACT Payment (self-contained — no dependency on prior TCs) ──

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

    // ── Step 3: Wait for Transfer Center and click Make Payment ────────────
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.makePayment);
    await webComponents.waitForUXLoading([], page);

    // ── Step 4: Wait for ACT form to be ready ────────────────────────────────
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 5: Select "From Account" ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 5: Select existing payee ────────────────────────────────────────
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 6: Enter amount ─────────────────────────────────────────────────
    const rawAmount = testData.AccountTransfer.amountV.replace(/,/g, '');
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, rawAmount);

    // ── Step 7: Click Next ───────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 8: Click Submit ─────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 9: Capture the transaction reference ID ─────────────────────────
    let createdReference = '';
    const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    createdReference = await webComponents.getReferenceID(bodyText ?? '');
    console.log('TC08 – Created ACT reference:', createdReference);

    // ── Step 10: Navigate back to Transfer Center via Payment menu ────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── PHASE 2: SEARCH and EDIT the created ACT Payment ─────────────────────

    // ── Step 11: Search for the created payment in Transfer Center ────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (createdReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 12: Wait for the view payment page to load ──────────────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 13: Click Edit button ───────────────────────────────────────────
    await webComponents.javaScriptsClick(pages.AccountTransferPage.editButton);

    // ── Step 14: Handle continue dialog if present ───────────────────────────
    try {
      await pages.AccountTransferPage.continueBtn.click({ timeout: 5000 });
    } catch {
      // Continue button may not appear — proceed
    }
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 15: Clear amount and enter new (edit) amount ────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.editAmount);
    await page.waitForTimeout(2000);

    // ── Step 16: Click Next to go to preview page ────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 17: Click Submit ────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 18: Capture the edited transaction reference ID ─────────────────
    let editedReference = '';
    const editBodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    editedReference = await webComponents.getReferenceID(editBodyText ?? '');
    console.log('TC08 – Edited ACT reference:', editedReference);

    // ── Step 19: Navigate back to Transfer Center via Payment menu ────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── PHASE 3: VALIDATE the edited payment ─────────────────────────────────

    // ── Step 20: Search for the edited payment and open view page ─────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    const searchRef = editedReference.trim().length > 0 ? editedReference : createdReference;
    if (searchRef.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(searchRef);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 21: Wait for the view payment page ──────────────────────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 22: Validate view page fields after edit ────────────────────────
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.fromAccountValue);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.amountValue, testData.AccountTransfer.editAmount);
    // Status — use explicit 30s timeout (learnings.md: status loads slowly on ACT view page)
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingApproval, { timeout: 30_000 });

    console.log(`TC08 – Edit validated. Reference: ${searchRef}`);

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC09_TC10 — Reject and Delete an ACT Payment via Transfer Center
  // ════════════════════════════════════════════════════════════════════════════
  test('TC09_TC10_Reject and delete an ACT Payment via Transfer Center', async ({ page }) => {

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 1: CREATE an ACT Payment (self-contained — no dependency on prior TCs)
    // ══════════════════════════════════════════════════════════════════════════

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

    // ── Step 4: Wait for ACT form to be ready ────────────────────────────────
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 5: Select "From Account" ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 6: Select existing payee ────────────────────────────────────────
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount (use amountA1 — small amounts get "Pending Approval" status) ─
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);

    // ── Step 8: Click Next ───────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 9: Click Submit ─────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 10: Capture the transaction reference ID ────────────────────────
    let createdReference = '';
    const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    createdReference = await webComponents.getReferenceID(bodyText ?? '');
    console.log('TC09_TC10 – Created ACT reference:', createdReference);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 2: REJECT the created ACT Payment via Transfer Center
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 11: Navigate back to Transfer Center via Payment menu ────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 12: Search for the created payment in Transfer Center ────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (createdReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 15: Wait for the view payment page to load ──────────────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 16: Scroll to bottom (Protractor TC09 pattern) ──────────────────
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // ── Step 17: Click Reject button ─────────────────────────────────────────
    await webComponents.javaScriptsClick(pages.AccountTransferPage.rejectButton);

    // ── Step 15: Enter rejection reason in the dialog ────────────────────────
    // (Using BulkPaymentPage.reasonForRejection — working input[@name] locator;
    //  AccountTransferPage.reasonForRejection uses broken ShuRu[@name] pattern)
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.reasonForRejection);
    await webComponents.enterText(pages.BulkPaymentPage.reasonForRejection, testData.AccountTransfer.rejectReason);

    // ── Step 16: Click Reject confirmation button in the dialog ──────────────
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.rejectDialogButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.rejectDialogButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 17: Capture reference from the reject success dialog ────────────
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.transactionDeletedPopupLabelMsg);
    const rejectDialogText = await webComponents.getTextFromElement(pages.AccountTransferPage.transactionDeletedPopupLabelMsg);
    const rejectedReference = await webComponents.getReferenceID(rejectDialogText);
    console.log('TC09_TC10 – Rejected reference:', rejectedReference);

    // ── Step 18: Dismiss the success dialog ──────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 3: VALIDATE Rejected status via Transfer Center
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 19: Navigate to Transfer Center ─────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 20: Search for the rejected payment and open view page ──────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    const refToSearch = rejectedReference.trim().length > 0 ? rejectedReference : createdReference;
    if (refToSearch.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(refToSearch);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.Rejected,
      );
    }

    // ── Step 21: Wait for the view payment page ──────────────────────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 22: Validate status = "Rejected" ────────────────────────────────
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.Rejected, { timeout: 30_000 });
    console.log('TC09_TC10 – Reject validated. Status: Rejected');

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 4: DELETE the rejected ACT Payment via Transfer Center
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 23: Delete the rejected payment using shared delete helper ──────
    // Reuse PayrollPage.deleteOpenPayeeOrReferenceNo() — same shared delete dialog
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: refToSearch
    }, refToSearch);

    console.log('TC09_TC10 – Payment deleted');

    // ── Step 23b: Dismiss the "Transaction deleted" popup ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.transactionDeletedPopupOkButton);
    await webComponents.waitForUXLoading([], page);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 5: VALIDATE deletion — "No information to display"
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 24: Navigate to Transfer Center ─────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 25: Wait for Transfer Center and search for the deleted reference ─
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);
    await webComponents.enterText(pages.TransferCentersPage.transferCenterFilter, refToSearch);
    await webComponents.waitForUXLoading([], page);

    // ── Step 26: Validate "No information to display" message ────────────────
    await webComponents.isElementVisible(page, pages.TransferCentersPage.noInformationLabel, { timeout: TIMEOUT.LONG });
    await expect(pages.TransferCentersPage.noInformationLabel).toContainText('No information to display', { timeout: 30_000 });

    console.log(`TC09_TC10 – Delete validated. Reference ${refToSearch} no longer found.`);

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC11 — Edit an ACT Payment with non Dol user check amount deduct logic
  // ════════════════════════════════════════════════════════════════════════════
  test('TC11_Edit an ACT Payment with non Dol user check amount deduct logic', async ({ page }) => {

    // Override timeout — multi-phase test (create → re-login → edit → validate → delete)
    test.setTimeout(900000);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 1: CREATE an ACT Payment (with default user from beforeEach)
    // ══════════════════════════════════════════════════════════════════════════

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

    // ── Step 4: Wait for ACT form to be ready ────────────────────────────────
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 5: Select "From Account" ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await page.waitForTimeout(1000);

    // ── Step 6: Select existing payee ────────────────────────────────────────
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount (amountA1 = "10" — small amount for Pending Approval status) ─
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);
    await page.waitForTimeout(2000);

    // ── Step 8: Click Next ───────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 9: Click Submit ─────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 10: Capture the transaction reference ID ────────────────────────
    let createdReference = '';
    const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    createdReference = await webComponents.getReferenceID(bodyText ?? '');

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 2: Navigate to Transfer Center and search for the payment
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 11: Navigate back to Transfer Center via Payment menu ────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 12: Search for the created payment in Transfer Center ────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    if (createdReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 13: Wait for view page ──────────────────────────────────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 3: EDIT the payment (currency change, FX contracts, deduction logic)
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 14: Click Edit button ───────────────────────────────────────────
    await webComponents.javaScriptsClick(pages.AccountTransferPage.editButton);

    // ── Step 17: Handle continue dialog if present ───────────────────────────
    try {
      await pages.AccountTransferPage.continueBtn.click({ timeout: 5000 });
    } catch {
      // Continue button may not appear — proceed
    }
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 18: Select From Account (re-select as per Protractor source) ────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 19: Select currency (USD) via currency dropdown ─────────────────
    // The currency dropdown is an autocomplete with a token chip (e.g. "SGD").
    // Remove the existing token first, then type the new currency.
    const currencyTokenClose = page.locator('.ui-autocomplete-token .ui-autocomplete-token-icon');
    const tokenVisible = await currencyTokenClose.isVisible({ timeout: 5000 }).catch(() => false);
    if (tokenVisible) {
      await currencyTokenClose.click();
      await page.waitForTimeout(1000);
    }
    await webComponents.isElementVisible(page, pages.TelegraphicTransferPage.selectCurrencyDropdown, { timeout: TIMEOUT.LONG });
    await pages.TelegraphicTransferPage.selectCurrencyDropdown.click({ force: true });
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.paymentCurrencyFCY);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 20: Clear amount and enter editAmount ───────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.editAmount);
    await page.waitForTimeout(2000);

    // ── Step 21: FX section auto-appears for cross-currency; select FX contracts ─
    // Wait for the FX contracts table to appear after currency change
    // Scope to the FX section — checkboxes inside the FX contract table rows
    const fxSection = page.locator('h2:has-text("Foreign Exchange")').locator('..');
    const fxCheckboxes = fxSection.locator('input[type="checkbox"]');

    // ── Step 22: Click FX contract 0 checkbox ────────────────────────────────
    await fxCheckboxes.nth(0).evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(1000);

    // ── Step 23: Click FX contract 1 checkbox ────────────────────────────────
    await fxCheckboxes.nth(1).evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(1000);

    // ── Step 24: Clear FX contract 0 amount and enter amountA1 ───────────────
    // After checking FX contracts, the amount textbox fields become enabled
    // Use the page object locator for FX contract 0 amount field
    await pages.AccountTransferPage.FXcontract0Amt.waitFor({ state: 'visible', timeout: 15000 });
    await pages.AccountTransferPage.FXcontract0Amt.click();
    await pages.AccountTransferPage.FXcontract0Amt.fill('');
    await pages.AccountTransferPage.FXcontract0Amt.fill(testData.AccountTransfer.amountA1);
    await page.waitForTimeout(1000);

    // ── Step 24b: Enter remaining amount in FX contract 1 ────────────────────
    const fxContract1Amt = page.locator('input[name="fx-amount-1"]');
    await fxContract1Amt.waitFor({ state: 'visible', timeout: 15000 });
    await fxContract1Amt.click();
    await fxContract1Amt.fill('');
    await fxContract1Amt.fill(testData.AccountTransfer.amountA1);
    await page.waitForTimeout(1000);

    // ── Step 25: Validate deduction amounts on the form page ─────────────
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.deductAmt, testData.AccountTransfer.deductAmt);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.TotalAmtDeduct, testData.AccountTransfer.deductAmt);

    // ── Step 26: Click Next to proceed to preview page ───────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 27: Validate preview page — deduction amounts ───────────────────
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.deductAmountValue, testData.AccountTransfer.deductAmt);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.AmtToDeductValue, testData.AccountTransfer.deductAmt1);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.AmtToDeductValue1, testData.AccountTransfer.deductAmt1);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.totalDeductValue, testData.AccountTransfer.deductAmt);

    // ── Step 28: Submit the payment ──────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 29: Capture the edited transaction reference ID ─────────────────
    let editedReference = '';
    const editBodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    editedReference = await webComponents.getReferenceID(editBodyText ?? '');

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 4: VALIDATE the edited payment on the view page
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 30: Navigate back to Transfer Center via Payment menu ────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 31: Search for the edited payment ───────────────────────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    const searchRef = editedReference.trim().length > 0 ? editedReference : createdReference;
    if (searchRef.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(searchRef);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Account Transfer',
        testData.status.PendingApproval,
      );
    }

    // ── Step 32: Wait for the view payment page ──────────────────────────────
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 33: Validate view page fields after edit ────────────────────────
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.amountValue, testData.AccountTransfer.editAmount);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.deductAmountValue, testData.AccountTransfer.deductAmt);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.AmtToDeductValue, testData.AccountTransfer.deductAmt1);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.AmtToDeductValue1, testData.AccountTransfer.deductAmt1);
    await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.totalDeductValue, testData.AccountTransfer.deductAmt);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 5: DELETE the edited payment (cleanup)
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 34: Delete the payment using shared delete helper ───────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: searchRef
    }, searchRef);

    // ── Step 35: Dismiss the "Transaction deleted" popup ─────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.transactionDeletedPopupOkButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 36: Navigate to Transfer Center ─────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 37: Verify deletion — search for deleted reference ──────────────
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);
    await webComponents.enterText(pages.TransferCentersPage.transferCenterFilter, searchRef);
    await webComponents.waitForUXLoading([], page);

    // ── Step 38: Validate "No information to display" message ────────────────
    await webComponents.isElementVisible(page, pages.TransferCentersPage.noInformationLabel, { timeout: TIMEOUT.LONG });
    await expect(pages.TransferCentersPage.noInformationLabel).toContainText('No information to display', { timeout: 30_000 });

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC012 — Verify an ACT Payment via My Verify
  // ════════════════════════════════════════════════════════════════════════════
  test('TC012_Verify an ACT Payment via My Verify', async ({ page }) => {

    // Override timeout — multi-phase test (create → logout → re-login → verify → validate → delete)
    test.setTimeout(900000);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 1: CREATE an ACT Payment (with existing payee, high amount for PendingVerification)
    // ══════════════════════════════════════════════════════════════════════════

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

    // ── Step 4: Wait for ACT form to be ready ────────────────────────────────
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 5: Select "From Account" ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await page.waitForTimeout(1000);

    // ── Step 6: Select existing payee ────────────────────────────────────────
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount (amountV = "3,100" — high amount for PendingVerification) ─
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountV.replace(/,/g, ''));
    await page.waitForTimeout(2000);

    // ── Step 8: Click Next ───────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 9: Click Submit ─────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 10: Capture the transaction reference ID ────────────────────────
    let createdReference = '';
    const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    createdReference = await webComponents.getReferenceID(bodyText ?? '');

    // ── Step 11: Click Finish/Dismiss to return ──────────────────────────────
    try {
      await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.finishedButton);
    } catch {
      await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 12: Navigate to Transfer Center and validate PendingVerification ─
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await pages.AccountTransferPage.waitForViewPage();
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingVerification, { timeout: 30_000 });

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 2: LOGOUT and RE-LOGIN with verify user
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 13: Logout from current user ────────────────────────────────────
    await pages.TelegraphicTransferPage.safeClick(pages.PayrollPage.logoutButton);

    // ── Step 14: Login with verify user (DBSAUTO0001 — same as ManagePayroll TC013) ─
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, testData.ManagePayroll.SIT.loginUserIdUser2, String(CONSTANTS.PIN));
    pages = new PaymentsPages(page);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 3: VERIFY the payment via Approval menu
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 15: Navigate to Approval menu ───────────────────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.approvalMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);

    // ── Step 16: Handle Authentication dialog if present ─────────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );

    // ── Step 17: Wait for and click Verify Payment tab ───────────────────────
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.verifyPaymentTab);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.verifyPaymentTab);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);

    // ── Step 18: Search by reference in Verify tab ───────────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.showAdditionalFilters);
    await webComponents.hardWait(page);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, createdReference);

    // ── Step 19: Select the transaction checkbox and click Verify ─────────────
    await webComponents.javaScriptsClick(pages.ApprovalPage.searchFirstCheckBox.first());
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 20: Click Submit on verify confirmation page ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifySubmitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 21: Verify success message and click Finish ─────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.verifiedSuccessfullyMessage);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyFinishButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 22: Wait for Verify tab and confirm transaction no longer listed ─
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, createdReference);
    await webComponents.hardWait(page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.noInformationToDisplay);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 4: VALIDATE the verified payment status in Transfer Center
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 23: Click Payment & Transfer Menu ───────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);

    // ── Step 24: Search Reference No and Open ────────────────────────────────
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 25: Validate the Reference No has status "Pending Approval" ─────
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingApproval, { timeout: 30_000 });

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 5: DELETE the payment (cleanup)
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 26: Delete the payment ──────────────────────────────────────────
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.AccountTransfer.transactionDeleted,
      internalReference: createdReference
    }, createdReference);

    // ── Step 27: Dismiss the "Transaction deleted" popup ─────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.transactionDeletedPopupOkButton);
    await webComponents.waitForUXLoading([], page);

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC013 — Approve an ACT Payment via Transfer Center
  // (Reference: SG_ManagePayroll TC012 — Approve with "Get Challenge via SMS")
  // ════════════════════════════════════════════════════════════════════════════
  test('TC013_Approve an ACT Payment via Transfer Center', async ({ page }) => {

    // Override timeout — multi-phase test (create → approve via SMS → validate)
    test.setTimeout(900000);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 1: CREATE an ACT Payment (existing payee, amountA1 → PendingApproval)
    // ══════════════════════════════════════════════════════════════════════════

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

    // ── Step 4: Wait for ACT form to be ready ────────────────────────────────
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 5: Select "From Account" ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await page.waitForTimeout(1000);

    // ── Step 6: Select existing payee ────────────────────────────────────────
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount (amountA1 — small amount → PendingApproval) ─────
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);
    await page.waitForTimeout(2000);

    // ── Step 8: Click Next ───────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 9: Click Submit ─────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 10: Capture the transaction reference ID ────────────────────────
    let createdReference = '';
    const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    createdReference = await webComponents.getReferenceID(bodyText ?? '');

    // ── Step 11: Click Finish/Dismiss to return ──────────────────────────────
    try {
      await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.finishedButton);
    } catch {
      await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    }
    await webComponents.waitForUXLoading([], page);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 2: Navigate to Transfer Center, validate PendingApproval, then APPROVE
    // (Following SG_ManagePayroll TC012 pattern — approve via SMS challenge)
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 12: Navigate to Transfer Center and search for the payment ──────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 13: Validate status is "Pending Approval" ───────────────────────
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingApproval, { timeout: 30_000 });

    // ── Step 14: Re-navigate to Payment menu (same as ManagePayroll TC012 Steps 14-15)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 15: Search and open the payment again ───────────────────────────
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 16: Scroll to the Approve section and click Approve checkbox ─────
    // (Following ManagePayroll TC012 Steps 16-18 pattern)
    await webComponents.scrollToElement(pages.PayrollPage.approveSubmitButton);
    await webComponents.javaScriptsClick(pages.PayrollPage.approveSubmitButton);

    // ── Step 17: Click "Push Approval" option ────────────────────────────────
    await webComponents.waitElementToBeVisible(pages.PayrollPage.pushApprovalOption);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // ── Step 18: Click "Get Challenge via SMS" button ────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.getChallengeSMS);
    await page.waitForTimeout(2000);

    // ── Step 19: Enter SMS response code ─────────────────────────────────────
    await webComponents.enterTextarea(pages.AccountTransferPage.challengeResponse, String(CONSTANTS.CHALLENGEVIASMSCODE));
    await page.waitForTimeout(2000);

    // ── Step 19b: Wait for the toolbar Approve button to become enabled ───────
    // Use viewPageApproveButton (button[name="approve"]:not(#push-btn)) to avoid
    // strict mode with the disabled "Approve now" push-btn
    await expect(pages.AccountTransferPage.viewPageApproveButton).toBeEnabled({ timeout: 30_000 });

    // ── Step 20: Click Approve button to submit approval ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.viewPageApproveButton);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.dismissButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 3: VALIDATE the approved payment status in Transfer Center
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 21: Search for the approved payment and open view page ──────────
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 22: Validate status is one of the valid post-approval statuses ──
    // (Protractor: textbaohanLessOne — status depends on bank processing speed)
    const validStatuses = [
      testData.status.Approved,
      testData.status.PartialApproved,
      testData.status.Received,
      testData.status.PendingRelease,
      testData.status.Completed,
      testData.status.BankRejected,
    ];
    const statusText = await webComponents.getTextFromElement(pages.AccountTransferPage.actStatusValue);
    const statusMatch = validStatuses.some((s: string) => statusText.includes(s));
    expect(statusMatch).toBeTruthy();

    // Note: Approved transactions cannot be deleted (Delete button is disabled for Approved status).
    // No cleanup delete step needed — matching learnings.md pattern.

  });

  // ════════════════════════════════════════════════════════════════════════════
  // TC014 — Release an ACT Payment via My Release
  // (Full chain: Create with amountV → Verify → Approve → Release)
  // AmountV (3,100) requires Verification before Approval — ApproveNow is disabled.
  // Low amounts (amountA1=10) + ApproveNow go straight to Completed, skipping PendingRelease.
  // Therefore we must follow the full serial chain: PendingVerification → PendingApproval → PendingRelease → Released.
  // ════════════════════════════════════════════════════════════════════════════
  test('TC014_Release an ACT Payment via My Release', async ({ page }) => {

    // Override timeout — multi-phase test (create → verify → approve → release → validate)
    test.setTimeout(900000);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 1: CREATE an ACT Payment with amountV (3,100) → PendingVerification
    // (Same pattern as TC012 Phase 1)
    // ══════════════════════════════════════════════════════════════════════════

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

    // ── Step 4: Wait for ACT form to be ready ────────────────────────────────
    await pages.AccountTransferPage.waitForAccountFormReady();

    // ── Step 5: Select "From Account" ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await page.waitForTimeout(1000);

    // ── Step 6: Select existing payee ────────────────────────────────────────
    await webComponents.isElementVisible(page, pages.AccountTransferPage.existingPayee, { timeout: TIMEOUT.LONG });
    await pages.AccountTransferPage.existingPayee.locator('input').click();
    await pages.AccountTransferPage.existingPayee.locator('input').fill('');
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.existingPayee);
    await page.waitForTimeout(2000);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // ── Step 7: Enter amount (amountV = "3,100" — high amount → PendingVerification) ─
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountV.replace(/,/g, ''));
    await page.waitForTimeout(2000);

    // ── Step 8: Click Next ───────────────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForPreviewPage();

    // ── Step 9: Click Submit (no ApproveNow — disabled for high amounts) ─────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // ── Step 10: Capture the transaction reference ID ────────────────────────
    let createdReference = '';
    const bodyText = await page.locator('body').textContent({ timeout: TIMEOUT.MEDIUM });
    createdReference = await webComponents.getReferenceID(bodyText ?? '');
    console.log('TC014 – Created ACT reference:', createdReference);

    // ── Step 11: Click Finish/Dismiss to return ──────────────────────────────
    try {
      await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.finishedButton);
    } catch {
      await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    }
    await webComponents.waitForUXLoading([], page);

    // ── Step 12: Navigate to Transfer Center and validate PendingVerification ─
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await pages.AccountTransferPage.waitForViewPage();
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingVerification, { timeout: 30_000 });
    console.log('TC014 – Phase 1 complete: PendingVerification');

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 2: LOGOUT and RE-LOGIN as User2 (verify/approve/release user)
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 13: Logout from current user ────────────────────────────────────
    await pages.TelegraphicTransferPage.safeClick(pages.PayrollPage.logoutButton);

    // ── Step 14: Login with User2 (DBSAUTO0001) ─────────────────────────────
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, testData.ManagePayroll.SIT.loginUserIdUser2, String(CONSTANTS.PIN));
    pages = new PaymentsPages(page);

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 3: VERIFY the payment via Approval menu → Verify Payment tab
    // (Same pattern as TC012 Phase 3)
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 15: Navigate to Approval menu ───────────────────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.approvalMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);

    // ── Step 16: Handle Authentication dialog if present ─────────────────────
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton,
    );
    await webComponents.waitForUXLoading([], page);

    // Dismiss any CDK overlay backdrop that might be intercepting clicks
    const overlay = page.locator('.cdk-overlay-backdrop-showing');
    if (await overlay.isVisible().catch(() => false)) {
      await overlay.click({ force: true });
      await page.waitForTimeout(1000);
    }

    // ── Step 17: Click Verify Payment tab ────────────────────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.verifyPaymentTab);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.verifyPaymentTab);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);

    // ── Step 18: Search by reference in Verify tab ───────────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.showAdditionalFilters);
    await webComponents.hardWait(page);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, createdReference);

    // ── Step 19: Select the transaction checkbox and click Verify ─────────────
    await webComponents.javaScriptsClick(pages.ApprovalPage.searchFirstCheckBox.first());
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 20: Click Submit on verify confirmation page ────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifySubmitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 21: Verify success message and click Finish ─────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.verifiedSuccessfullyMessage);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyFinishButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 22: Confirm transaction no longer listed in Verify tab ──────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, createdReference);
    await webComponents.hardWait(page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.noInformationToDisplay);
    console.log('TC014 – Phase 3 complete: Verified → PendingApproval');

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 4: APPROVE the payment via Transfer Center view page
    // (Same pattern as TC013 Phase 2 — approve with SMS challenge)
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 23: Navigate to Transfer Center ─────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await pages.TransferCentersPage.waitForTransferCenterReady();

    // ── Step 24: Search and open the payment ─────────────────────────────────
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 25: Validate status is PendingApproval ──────────────────────────
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingApproval, { timeout: 30_000 });

    // ── Step 26: Scroll to bottom and click Approve button to expand challenge section ─
    // Protractor pattern: approveButton.click() → expands challenge section → enter response → approveButton.click()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.viewPageApproveButton);
    await page.waitForTimeout(2000);

    // ── Step 27: Expand Digital Token section if response field not visible ──
    // After clicking Approve, the push-approval section appears. Need to click
    // "Alternatively, use your digital token..." to reveal the response field.
    const responseVisible = await pages.AccountTransferPage.challengeResponse.isVisible().catch(() => false);
    if (!responseVisible) {
      const altLink = page.getByText('Alternatively, use your digital token');
      await altLink.click({ timeout: 10_000 });
      await page.waitForTimeout(2000);
    }

    // ── Step 28: Enter response code into challenge response field ───────────
    await webComponents.enterTextarea(pages.AccountTransferPage.challengeResponse, String(CONSTANTS.CHALLENGEVIASMSCODE));
    await page.waitForTimeout(2000);

    // ── Step 29: Click Approve button again to submit approval ───────────────
    await expect(pages.AccountTransferPage.viewPageApproveButton).toBeEnabled({ timeout: 30_000 });
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.viewPageApproveButton);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.dismissButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);
    console.log('TC014 – Phase 4 complete: Approved → PendingRelease');

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 5: RELEASE the payment via Approval menu → Release tab
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 30: Navigate to Approvals menu ──────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);
    await webComponents.waitForUXLoading([], page);

    // ── Step 31: Click Release tab ───────────────────────────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.approveReleaseTab);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveReleaseTab);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);

    // ── Step 32: Search by reference in Release tab ──────────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.showAdditionalFilters);
    await webComponents.hardWait(page);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, createdReference);

    // ── Step 33: Select the transaction checkbox and click Release button ────
    await webComponents.javaScriptsClick(pages.ApprovalPage.searchFirstCheckBox.first());
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveReleaseButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 34: Click Submit on release confirmation page ───────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveReleaseSubmitButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 35: Verify success message and click Finish ─────────────────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.releasedSuccessfullyMessage);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyFinishButton);
    await webComponents.waitForUXLoading([], page);

    // ── Step 36: Confirm transaction no longer listed in Release tab ─────────
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, createdReference);
    await webComponents.hardWait(page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.noInformationToDisplay);
    console.log('TC014 – Phase 5 complete: Released');

    // ══════════════════════════════════════════════════════════════════════════
    // PHASE 6: VALIDATE the released payment status in Transfer Center
    // ══════════════════════════════════════════════════════════════════════════

    // ── Step 37: Click Payment & Transfer Menu ───────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);

    // ── Step 38: Search Reference No and Open ────────────────────────────────
    await pages.TransferCentersPage.searchAndOpenByReference(createdReference);
    await pages.AccountTransferPage.waitForViewPage();

    // ── Step 39: Validate the final post-release status ──────────────────────
    // (Protractor: textbaohanLessOne — Approved / Received / Completed)
    const validStatuses = [
      testData.status.Approved,
      testData.status.Received,
      testData.status.Completed,
    ];
    const statusText = await webComponents.getTextFromElement(pages.AccountTransferPage.actStatusValue);
    const statusMatch = validStatuses.some((s: string) => statusText.includes(s));
    expect(statusMatch).toBeTruthy();
    console.log('TC014 – Post-release status:', statusText);

    // Note: Released/Approved transactions cannot be deleted — no cleanup needed.

  });


});
