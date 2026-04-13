/**
 * Author: Agent Generated
 * Created Date: 13/04/2026
 * Class path "tests/e2e/IDEALX/PayTransfer/SG_AccountTransferTC001AgentGenerated.spec.ts"
 * Description: This Specification contains the test case for Singapore Account Transfer.
 * 1) TC01_Create an ACT Payment with new Payee
 */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { WebComponents } from '../../../lib/webComponents';

// Initialize WebComponents helper
const webComponents = new WebComponents();

// Load JSON test data
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// Credentials — use ManagePayroll SIT credentials (AccountTransfer creds are invalid)
const loginCompanyId = testData.ManagePayroll.SIT.loginCompanyId;
const loginUserId    = testData.ManagePayroll.SIT.loginUserIdHKMP;
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

    // ── In-memory locators for elements broken or missing in AccountTransferPage.ts ──
    const newPayeeNickNameInput    = page.locator('input[placeholder="To identify this payee easily"]');
    // Postal code — UI renamed from "Address line 3"; use text navigation from label
    const postalCodeInput          = page.getByText('Postal code').locator('..').locator('..').getByRole('textbox');
    // Account number — try CSS name first, fall back to text-based locator
    const newPayeeAcctNumberInput  = page.locator('input[name="new-payee-acct-number"]')
      .or(page.locator('xpath=//div[contains(text(),"wallet account number")]/parent::div//input'));
    // DBS Bank — now a radio button, not a ShuRu input
    const dbsBankRadio             = page.getByText('DBS Bank SINGAPORE', { exact: true }).first();

    // Angular-wrapped checkboxes — interact via visible <label> with retry loop
    // (learnings.md: .click()/.check()/.evaluate(el.click()) are unreliable for hidden inputs)
    const isBeneAdvisingLabel      = page.locator('label[for="isBeneAdvising"]');
    const isBeneAdvisingCheckbox   = page.locator('input#isBeneAdvising');
    const isTransactionNoteLabel   = page.locator('label[for="isTransactionNote"]');
    const isTransactionNoteCheckbox = page.locator('input#isTransactionNote');

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
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.amount);
    await pages.AccountTransferPage.amount.fill(testData.AccountTransfer.amountA1);

    // ── Step 6: Click the New Payee tab ──────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeTab);

    // ── Step 7: Handle cognitive-continue popup if it appears ─────────────────
    try {
      await pages.AccountTransferPage.continueBtn.waitFor({ state: 'visible', timeout: 5_000 });
      await pages.AccountTransferPage.continueBtn.evaluate((el: HTMLElement) => el.click());
      await webComponents.waitForUXLoading([], page);
    } catch { /* popup not present — proceed */ }

    // ── Step 8: Select Country (SINGAPORE) via autocomplete ──────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.Country);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.Country);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // ── Step 9: Enter new payee name ─────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeName);
    await pages.AccountTransferPage.newPayeeName.fill(testData.AccountTransfer.newPayeeName);

    // ── Step 10: Enter payee nickname ────────────────────────────────────────
    // (learnings.md: mandatory field not in Protractor source; no locator in AccountTransferPage.ts
    // — used in-memory; form will fail if omitted with "Payee Nickname is required")
    await expect(newPayeeNickNameInput).toBeVisible({ timeout: TIMEOUT.LONG });
    await newPayeeNickNameInput.click();
    await newPayeeNickNameInput.fill(testData.AccountTransfer.newPayeeName);

    // ── Step 11: Enter address line 1 ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeAdd1);
    await pages.AccountTransferPage.newPayeeAdd1.fill(testData.AccountTransfer.newPayeeAdd1);

    // ── Step 12: Enter address line 2 ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeAdd2);
    await pages.AccountTransferPage.newPayeeAdd2.fill(testData.AccountTransfer.newPayeeAdd2);

    // ── Step 13: Enter postal code (was "Address line 3" in Protractor) ──────
    // UI renamed field to "Postal code / ZIP code"; original name attribute gone
    await expect(postalCodeInput).toBeVisible({ timeout: TIMEOUT.LONG });
    await postalCodeInput.click();
    await postalCodeInput.fill(testData.AccountTransfer.newPayeeAdd3);

    // ── Step 14: Select DBS Bank provider (radio button in current UI) ───────
    // Was a dropdown select in Protractor; now radio "DBS Bank SINGAPORE"
    await expect(dbsBankRadio).toBeVisible({ timeout: TIMEOUT.LONG });
    await dbsBankRadio.click();
    await webComponents.waitForUXLoading([], page);

    // ── Step 15: Enter new payee account number ──────────────────────────────
    // ShuRu locator broken — using CSS name fallback + text-based locator
    await expect(newPayeeAcctNumberInput).toBeVisible({ timeout: TIMEOUT.LONG });
    await newPayeeAcctNumberInput.click();
    await newPayeeAcctNumberInput.fill(testData.AccountTransfer.newPayeeAcctNumber);
    await page.keyboard.press('Tab');

    // ── Step 16: Enter payment detail ────────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentDetail);
    await pages.AccountTransferPage.paymentDetail.fill(testData.AccountTransfer.paymentDetail);

    // ── Step 17: Toggle Bene Advising checkbox ───────────────────────────────
    // (learnings.md: Angular hidden checkbox — click visible label; verify + retry up to 3×)
    for (let attempt = 0; attempt < 3; attempt++) {
      await isBeneAdvisingLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await isBeneAdvisingCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 18: Fill email addresses ────────────────────────────────────────
    // (learnings.md: after toggle, email fields have no name attribute;
    //  use page.getByRole('textbox', { name: 'Email' }).nth(N) with safeClick → fill → blur)
    const emailFields = page.getByRole('textbox', { name: 'Email' });
    await pages.AccountTransferPage.safeClick(emailFields.nth(0));
    await emailFields.nth(0).fill(testData.AccountTransfer.emailIdO);
    await emailFields.nth(0).blur();
    await pages.AccountTransferPage.safeClick(emailFields.nth(1));
    await emailFields.nth(1).fill(testData.AccountTransfer.emailId1);
    await emailFields.nth(1).blur();
    await pages.AccountTransferPage.safeClick(emailFields.nth(2));
    await emailFields.nth(2).fill(testData.AccountTransfer.emailId2);
    await emailFields.nth(2).blur();
    await pages.AccountTransferPage.safeClick(emailFields.nth(3));
    await emailFields.nth(3).fill(testData.AccountTransfer.emailId3);
    await emailFields.nth(3).blur();
    await pages.AccountTransferPage.safeClick(emailFields.nth(4));
    await emailFields.nth(4).fill(testData.AccountTransfer.emailId4);
    await emailFields.nth(4).blur();

    // ── Step 19: Enter message to beneficiary ────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.message);
    await pages.AccountTransferPage.message.fill(testData.AccountTransfer.message);

    // ── Step 20: Toggle Transaction Note checkbox ────────────────────────────
    // (learnings.md: same Angular hidden checkbox — label-click retry pattern)
    for (let attempt = 0; attempt < 3; attempt++) {
      await isTransactionNoteLabel.click();
      await page.waitForTimeout(500);
      const isChecked = await isTransactionNoteCheckbox
        .evaluate(el => (el as HTMLInputElement).checked)
        .catch(() => false);
      if (isChecked) break;
    }

    // ── Step 21: Enter transaction note ──────────────────────────────────────
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.transactionNote);
    await pages.AccountTransferPage.transactionNote.fill(testData.AccountTransfer.transactionNote);

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
      console.warn('TC01 – Could not capture reference ID from submitted page:', (err as Error).message);
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
    await expect(pages.AccountTransferPage.fromAccountValue)
      .toContainText(fromAccount);

    await expect(pages.AccountTransferPage.amountValue)
      .toContainText(testData.AccountTransfer.amountA1);

    // New payee name on the view page
    await expect(pages.AccountTransferPage.toNewPayeeNameValue)
      .toContainText(testData.AccountTransfer.newPayeeName);

    await expect(pages.AccountTransferPage.actStatusValue)
      .toContainText(testData.status.PendingApproval);

    // Hash value — must be non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.hashValue);

    // Reference value — only assert when reference was successfully captured
    if (reference.trim().length > 0) {
      await expect(pages.AccountTransferPage.referenceValue).toContainText(reference);
    }

    // Deduct amount and payment date — must be non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.deductAmountValue);
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.paymentDateValue);

    // Note: balanceValue (#view-act-acctBalance) no longer exists on the ACT view page
    // (learnings.md: element removed from current UI — assertion omitted)

    // Payee info — use stable id-based locators instead of positional XPath
    // (learnings.md: payeeInfo positional XPath is fragile; prefer #act-view-* ids)
    await expect(pages.AccountTransferPage.toNewPayeeAcctValue)
      .toContainText(testData.AccountTransfer.newPayeeAcctNumber);
    await expect(pages.AccountTransferPage.payeeAdd1)
      .toContainText(testData.AccountTransfer.newPayeeAdd1);
    await expect(pages.AccountTransferPage.payeeAdd2)
      .toContainText(testData.AccountTransfer.newPayeeAdd2);
    // payeeAdd3 (#act-view-payee-add3) — postal code is NOT displayed on the view page
    // (confirmed via ARIA snapshot: "To" section only renders address lines 1 & 2)

    await expect(pages.AccountTransferPage.paymentType)
      .toContainText(testData.AccountTransfer.paymentType);

    await expect(pages.AccountTransferPage.paymentDetailValue)
      .toContainText(testData.AccountTransfer.paymentDetail);

    await expect(pages.AccountTransferPage.messageValue)
      .toContainText(testData.AccountTransfer.message);

    // Email list — single element aggregating all email addresses
    await expect(pages.AccountTransferPage.emailList)
      .toContainText(testData.AccountTransfer.emailIdO);
    await expect(pages.AccountTransferPage.emailList)
      .toContainText(testData.AccountTransfer.emailId1);
    await expect(pages.AccountTransferPage.emailList)
      .toContainText(testData.AccountTransfer.emailId2);
    await expect(pages.AccountTransferPage.emailList)
      .toContainText(testData.AccountTransfer.emailId3);
    await expect(pages.AccountTransferPage.emailList)
      .toContainText(testData.AccountTransfer.emailId4);

    // Total deduct value reflects the created amount
    await expect(pages.AccountTransferPage.totalDeductValue)
      .toContainText(testData.AccountTransfer.amountA1);

    await expect(pages.AccountTransferPage.messageToApproverValue)
      .toContainText(testData.AccountTransfer.transactionNote);

    // Next approver — must be non-empty
    await webComponents.verifyUIElementTextIsNotNull(pages.AccountTransferPage.nextApprover);

    // Activity log must contain 'Create' for a newly submitted payment
    await expect(pages.AccountTransferPage.activityLog).toContainText('Create');
  });
});
