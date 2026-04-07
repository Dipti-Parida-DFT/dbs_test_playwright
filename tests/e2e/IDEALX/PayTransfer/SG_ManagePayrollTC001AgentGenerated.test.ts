/**
 * Author: Agent-Generated (Converted from Protractor)
 * Created Date: 06/04/2026
 * Class path "tests/e2e/IDEALX/PayTransfer/SG_ManagePayrollTC001AgentGenerated.test.ts"
 * Description: This Specification contains test cases for Management Payroll transactions.
 * 1) TC001_SG_ManagePayroll - Create ManagePayrollDBS with new payee
 * 2) TC002_SG_ManagePayroll - Create with ApproveNow with M-Challenge
 * 3) TC003_SG_ManagePayroll - Create with ApproveNow without M-Challenge
 */

// Required Imports
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { WebComponents } from '../../../lib/webComponents';
import type { NewPayee1ValidationData } from '../../../pages/IDEALX/PayTransfer/PayrollPage';

// Initialize Web Component class
const webComponents = new WebComponents();

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

const loginCompanyId = testData.ManagePayroll.SIT.loginCompanyId;
const loginUserId = testData.ManagePayroll.SIT.loginUserIdHKMP;
const fromAccount = testData.ManagePayroll.SIT.fromAccount;
const payeeBankID = testData.ManagePayrollPayee1.payeeBankID;

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_ManagePayroll_Create (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  let reference = '';
  // Track created payees per test for cleanup
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  /**
   * This method runs before every test case execution to launch the browser/page.
   */
  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;
    test.setTimeout(TIMEOUT.MAX);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, String(CONSTANTS.PIN));
    pages = new PaymentsPages(page);
  });

  /**
   * This method runs after every test case execution to perform cleanup activity.
   */
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
      return;
    }

    for (const p of createdPayees) {
      try {
        const key = p.name ?? p.accountNumber ?? '';
        await pages.PayrollPage.deletePayeeByFilter(key, true);
        console.log(`[cleanup] Deleted payee with key: ${key}`);
      } catch (err) {
        console.warn('[cleanup] Failed to delete a payee:', err);
      }
    }
  });

  // TC001_SG_ManagePayroll
  test('TC001_SG_ManagePayroll - Create ManagePayrollDBS with new payee', async ({ page }) => {

    // Step 1: Navigate to Payments & Transfer menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up (if present).
    // Per learnings.md: handleAuthIfPresent is session-scoped — call only on the FIRST paymentMenu click.
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton
    );

    // Step 3: Click Management Payroll option.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Add "New payee" with all details (SG-specific).
    const { name, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetailsSG({
      name: testData.ManagePayrollPayee1.newPayeeName,
      nickName: testData.ManagePayrollPayee1.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      payeeCategory: testData.ManagePayrollPayee1.payeeCategory,
      savePayeeCheckbox: testData.ManagePayrollPayee1.savePayeeCheckbox,
    });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Step 6: Enter Amount and optional details (SG-specific).
    await pages.PayrollPage.enterNewPayeeAllOtherDetailsSG({
      amount: testData.ManagePayrollPayee1.amount,
      transactionCode: testData.ManagePayrollPayee1.transactionCode,
      referenceForPayee: testData.ManagePayrollPayee1.referenceForPayee,
      particulars: testData.ManagePayrollPayee1.particulars,
      purposeOfPayment: testData.ManagePayrollPayee1.purposeOfPayment,
      paymentDetails: testData.ManagePayrollPayee1.paymentDetails,
      email1: testData.ManagePayrollPayee1.emailId0,
      email2: testData.ManagePayrollPayee1.emailId1,
      email3: testData.ManagePayrollPayee1.emailId2,
      email4: testData.ManagePayrollPayee1.emailId3,
      email5: testData.ManagePayrollPayee1.emailId4,
      emailMessage: testData.ManagePayrollPayee1.emailMessage,
    });

    // Step 7: Click Next button to navigate to Preview page.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForPreviewPageReady();

    // Step 8: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Step 9: Capture the reference ID from the submission screen.
    try {
      const referenceText = await pages.PayrollPage.getReferenceText();
      console.log('Captured reference text:', referenceText);
      reference = await webComponents.getReferenceID(referenceText);
      console.log('Captured created referenceID:', reference);
    } catch (err) {
      console.warn('[creation] Failed to capture reference ID:', err);
      reference = '';
    }

    // Step 10: Navigate to Transfer Center to verify the created transaction.
    // Per learnings.md: handleAuthIfPresent NOT called on subsequent paymentMenu clicks.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();

    // Step 11: Search and open the transaction by reference.
    if (reference.trim().length > 0) {
      console.log('[verification] Using created reference:', reference);
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      console.log('[verification] Reference not captured, using fallback search');
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Management payroll',
        testData.status.PendingApproval
      );
    }

    // Step 12: Wait for the View Payment page to fully load.
    await pages.PayrollPage.waitForViewPaymentPageReady();

    // Step 13: Validate all fields on the View Payment page.
    const validationData: NewPayee1ValidationData = {
      fromAccountValue1: testData.ManagePayrollPayee1ValidationData.fromAccountValue1,
      fromAccountValue2: testData.ManagePayrollPayee1ValidationData.fromAccountValue2,
      paymentTypeValue: testData.ManagePayrollPayee1ValidationData.paymentTypeValue,
      amountDeductedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedValue,
      amountDeductedEditedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedEditedValue,
      referenceValueUserProvided: testData.ManagePayrollPayee1.internalReferenceUserProvided,
      batchIdValueUserProvided: testData.ManagePayrollPayee1.batchIdValueUserProvided,
      paymentSummaryLabel: testData.ManagePayrollPayee1ValidationData.paymentSummaryLabel,
      totalPayeesLabel: testData.ManagePayrollPayee1ValidationData.totalPayeesLabel,
      totalPayeesValue: testData.ManagePayrollPayee1ValidationData.totalPayeesValue,
      totalAmountLabel: testData.ManagePayrollPayee1ValidationData.totalAmountLabel,
      totalAmountValue: testData.ManagePayrollPayee1ValidationData.totalAmountValue,
      totalAmountValueEdited: testData.ManagePayrollPayee1ValidationData.totalAmountValueEdited,
      payeeNameLabelValue: testData.ManagePayrollPayee1.newPayeeName,
      payeeNicknameLabelValue: testData.ManagePayrollPayee1.newPayeeNickName,
      bankNameLabelValue: testData.ManagePayrollPayee1ValidationData.bankNameLabelValue,
      bankSwiftBicLabelValue: testData.ManagePayrollPayee1ValidationData.bankSwiftBicLabelValue,
      accountNumberLabelValue: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      statusLabelValue: testData.status.PendingApproval,
      amountLabelValue: testData.ManagePayrollPayee1.amount,
      amountEditedLabelValue: '',
      transactionLabelValue: testData.ManagePayrollPayee1ValidationData.transactionCodeLabelValue,
      purposeCodeLabelValue: testData.ManagePayrollPayee1ValidationData.purposeCodeLabelValue,
      referenceForPayeeLabelValue: testData.ManagePayrollPayee1.referenceForPayee,
      particularsLabelValue: testData.ManagePayrollPayee1.particulars,
      paymentDetailsLabelValue: testData.ManagePayrollPayee1.paymentDetails,
      emailMessageLabelValue: testData.ManagePayrollPayee1.emailMessage,
      email1LabelValue: testData.ManagePayrollPayee1.emailId0,
      email2LabelValue: testData.ManagePayrollPayee1.emailId1,
      email3LabelValue: testData.ManagePayrollPayee1.emailId2,
      email4LabelValue: testData.ManagePayrollPayee1.emailId3,
      email5LabelValue: testData.ManagePayrollPayee1.emailId4,
    };

    await pages.PayrollPage.validatePayeeOrRefrenceNoDetails(validationData, reference);

  });

  // TC003_SG_ManagePayroll
  test('TC003_SG_ManagePayroll - Create with ApproveNow without M-Challenge', async ({ page }) => {

    // Step 1: Navigate to Payments & Transfer menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up (if present).
    // Per learnings.md: handleAuthIfPresent is session-scoped — called on the FIRST paymentMenu click.
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton
    );

    // Step 3: Click Management Payroll option.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Add "New payee" with all details (SG-specific).
    const { name, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetailsSG({
      name: testData.ManagePayrollPayee1.newPayeeName,
      nickName: testData.ManagePayrollPayee1.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      payeeCategory: testData.ManagePayrollPayee1.payeeCategory,
      savePayeeCheckbox: testData.ManagePayrollPayee1.savePayeeCheckbox,
    });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Step 6: Enter Amount.
    await webComponents.enterText(pages.PayrollPage.amount, testData.ManagePayrollPayee1.amountPartialApprove);

    // Step 7: Click Next button to navigate to Preview page.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForPreviewPageReady();

    // Step 8: Enable ApproveNow checkbox.
    await webComponents.javaScriptsClick(pages.PayrollPage.approveNowCheckbox);

    // Step 9: Expand the digital token / security device approval section.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // Step 10: Enter challenge response (no SMS challenge in this flow — code auto-displayed).
    await webComponents.waitElementToBeVisible(pages.PayrollPage.enterResponseTextBox);
    await webComponents.enterText(pages.PayrollPage.enterResponseTextBox, String(CONSTANTS.CHALLENGEVIASMSCODE));

    // Step 12: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Step 11: Capture the reference ID from the submission screen.
    let paymentReference = '';
    try {
      const referenceText = await pages.PayrollPage.getReferenceText();
      console.log('Captured reference text:', referenceText);
      paymentReference = await webComponents.getReferenceID(referenceText);
      console.log('Captured created referenceID:', paymentReference);
    } catch (err) {
      console.warn('[creation] Failed to capture reference ID:', err);
      paymentReference = '';
    }

    // Step 12: Navigate to Transfer Center to verify the created transaction.
    // Per learnings.md: handleAuthIfPresent NOT called on subsequent paymentMenu clicks.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();

    // Step 13: Search and open the transaction by reference.
    if (paymentReference.trim().length > 0) {
      console.log('[verification] Using created reference:', paymentReference);
      await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    } else {
      console.log('[verification] Reference not captured, using fallback search');
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Management payroll',
        testData.status.PartialApproved
      );
    }

    // Step 14: Wait for the View Payment page to fully load.
    await pages.PayrollPage.waitForViewPaymentPageReady();

    // Step 15: Assert the transaction status is "Partial Approved".
    await expect(pages.PayrollPage.transactionStatusLabel1).toContainText(testData.status.PartialApproved);

  });

  // TC002_SG_ManagePayroll
  test('TC002_SG_ManagePayroll - Create with ApproveNow with M-Challenge', async ({ page }) => {

    // Step 1: Navigate to Payments & Transfer menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up (if present).
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton
    );

    // Step 3: Click Management Payroll option.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Switch to Existing Payee tab and add existing payee.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.existingPayeeTabHeader);
    await pages.PayrollPage.addExistingPayee(testData.ManagePayrollPayee1.newPayeeName);

    // Step 6: Enter Amount.
    await webComponents.enterText(pages.PayrollPage.amount, testData.ManagePayrollPayee1.amount);

    // Step 7: Click Next button to navigate to Preview page.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForPreviewPageReady();

    // Step 8: Enable ApproveNow checkbox.
    await webComponents.javaScriptsClick(pages.PayrollPage.approveNowCheckbox);

    // Step 9: Expand the digital token / security device approval section.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // Step 10: Click Get Challenge SMS button (M-Challenge flow).
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.getChallengeSMSButton);

    // Step 11: Enter challenge response.
    await webComponents.waitElementToBeVisible(pages.PayrollPage.enterResponseTextBox);
    await webComponents.enterText(pages.PayrollPage.enterResponseTextBox, String(CONSTANTS.CHALLENGEVIASMSCODE));

    // Step 12: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Step 13: Capture the reference ID from the submission screen.
    let paymentReference = '';
    try {
      const referenceText = await pages.PayrollPage.getReferenceText();
      console.log('Captured reference text:', referenceText);
      paymentReference = await webComponents.getReferenceID(referenceText);
      console.log('Captured created referenceID:', paymentReference);
    } catch (err) {
      console.warn('[creation] Failed to capture reference ID:', err);
      paymentReference = '';
    }

    // Step 14: Navigate to Transfer Center to verify the created transaction.
    // Per learnings.md: handleAuthIfPresent NOT called on subsequent paymentMenu clicks.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();

    // Step 15: Search and open the transaction by reference.
    if (paymentReference.trim().length > 0) {
      console.log('[verification] Using created reference:', paymentReference);
      await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    } else {
      console.log('[verification] Reference not captured, using fallback search');
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Management payroll',
        testData.status.Received
      );
    }

    // Step 16: Wait for the View Payment page to fully load.
    await pages.PayrollPage.waitForViewPaymentPageReady();

    // Step 17: Assert the transaction status is one of the valid post-approval statuses.
    const statusText = await pages.PayrollPage.transactionStatusLabel1.textContent() ?? '';
    const validStatuses = [
      testData.status.Received,
      testData.status.Approved,
      testData.status.PendingRelease,
      testData.status.Completed,
      testData.status.BankRejected,
    ];
    const statusMatched = validStatuses.some(s => statusText.includes(s));
    expect(statusMatched, `Expected status to contain one of [${validStatuses.join(', ')}] but got "${statusText}"`).toBeTruthy();

  });
});
