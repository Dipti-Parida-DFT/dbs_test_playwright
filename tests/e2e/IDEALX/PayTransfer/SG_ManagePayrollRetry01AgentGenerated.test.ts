/**
 * Author: Agent-Generated Test Conversion from Protractor
 * Created Date: 02/04/2026
 * Class path: "tests/e2e/IDEALX/PayTransfer/SG_ManagePayrollRetry01AgentGenerated.test.ts"
 * Description: Retry variant of TC01 converted from Protractor to Playwright
 * 
 * TC001_SG_ManagePayroll - Create ManagePayrollDBS with new payee (Retry Edition)
 * 
 * This test verifies the complete workflow of creating a Management Payroll transaction
 * with a new payee, including all data entry, submission, and comprehensive validation
 * of the created transaction details. This is a retry-safe variant with improved
 * state management and error handling.
 * 
 * Protractor Source: C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer\SG_ManagePayroll.test.ts
 * Original Test: Lines 31-57 (Create ManagePayrollDBS with new payee)
 * Validation Function: checkViewPageAllField(isEdit: boolean) - Lines 428-454
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

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// Initialize Web Component class
const webComponents = new WebComponents();

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

// Test suite for SG Management Payroll conversion (Retry Variant - Agent Generated)
test.describe('SG_ManagePayroll_Retry (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;

  // Track created payees for cleanup
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  // Login credentials from test data (mapping ManagePayrollDBS to ManagePayrollPayee1)
  const loginCompanyId = testData.ManagePayroll.SIT.loginCompanyId;
  const loginUserId = testData.ManagePayroll.SIT.loginUserIdHKMP;
  const fromAccount = testData.ManagePayroll.SIT.fromAccount;

  /**
   * This method runs before every test case to launch the browser/page
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
   * This method runs after every test case to do cleanup activities
   */
  test.afterEach(async ({ page }, testInfo) => {
    // Only cleanup if the test passed
    if (testInfo.status !== 'passed') {
      console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
      return;
    }

    // Best-effort cleanup; never fail the test because cleanup failed
    for (const p of createdPayees) {
      try {
        const key = p.name ?? p.accountNumber ?? '';
        await pages.PayrollPage.deletePayeeByFilter(key, /* confirm */ true);
        console.log(`[cleanup] Deleted payee with key: ${key}`);
      } catch (err) {
        console.warn('[cleanup] Failed to delete a payee:', err);
      }
    }
  });

  /**
   * TC001_SG_ManagePayroll - Create ManagePayrollDBS with new payee
   *
   * This test covers the complete Protractor test workflow:
   * 
   * Protractor Steps (mapped to Playwright):
   * 1. paymentMenu.click() → Click Payment menu
   * 2. jiazhai() → Wait for page load
   * 3. managePayroll.click() → Click Management Payroll
   * 4. jiazhai() → Wait for page load
   * 5. fromAccount.select() → Select account from dropdown
   * 6. newPayee.click() → Click New Payee button
   * 7-10. Enter payee details (name, bank ID, account number)
   * 11. newPayeeButton.click() → Add payee
   * 12-16. Enter payment details (amount, reference, optional fields)
   * 17. nextButton.click() → Proceed to preview
   * 18. jiazhaiForPreviewPage() → Verify preview page
   * 19. submitButton.click() → Submit payment
   * 20. jiazhaiForSubmittedPage() → Verify submission
   * 21. huoQuIdealxInfoReferenceID() → Extract reference
   * 22. paymentMenu.click() → Navigate to search
   * 23. quyemianjiancha(reference) → Search for payment
   * 24. jiazhaiForViewPaymentPage() → Verify view page
   * 25. checkViewPageAllField(true) → Comprehensive validation
   */
  test('TC001_SG_ManagePayroll - Create ManagePayrollDBS with new payee', async ({ page }) => {
    let reference = '';

    // STEP 1-2: Navigate to Payment Menu and verify load
    // Corresponds to: paymentMenu.click() + jiazhai()
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton
    );
    await webComponents.waitForUXLoading([], page);

    // STEP 3-4: Click Management Payroll and verify page ready
    // Corresponds to: managePayroll.click() + jiazhai()
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);

    // STEP 5: Select account from dropdown
    // Corresponds to: fromAccount.select(testData.ManagePayrollDBS.SIT.fromAccount)
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // STEP 6-11: Create new payee with all details
    // Corresponds to: newPayee.click() → enter details → newPayeeButton.click()
    const { name, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetailsSG({
      name: testData.ManagePayrollPayee1.newPayeeName,
      nickName: testData.ManagePayrollPayee1.newPayeeNickName,
      bankId: testData.ManagePayrollPayee1.payeeBankID,
      accountNumber: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      payeeCategory: testData.ManagePayrollPayee1.payeeCategory,
      savePayeeCheckbox: testData.ManagePayrollPayee1.savePayeeCheckbox
    });

    // Register payee for cleanup
    createdPayees.push({ name, accountNumber });
    console.log(`Created payee: ${name} with account: ${accountNumber}`);

    // STEP 12-16: Enter amount, reference, and optional payment details
    // Corresponds to: amount.ShuRu(), payeeRef.ShuRu(), etc.
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amount);
    
    // Use the comprehensive helper method that handles amount, reference, optional details, and emails
    await pages.PayrollPage.enterNewPayeeAllOtherDetailsSG({
      amount: testData.ManagePayrollPayee1.amount,
      purposeOfPayment: testData.ManagePayrollPayee1.purposeOfPayment,
      transactionCode: testData.ManagePayrollPayee1.transactionCode,
      referenceForPayee: testData.ManagePayrollPayee1.referenceForPayee,
      particulars: testData.ManagePayrollPayee1.particulars,
      paymentDetails: testData.ManagePayrollPayee1.paymentDetails,
      email1: testData.ManagePayrollPayee1.emailId0,
      email2: testData.ManagePayrollPayee1.emailId1,
      email3: testData.ManagePayrollPayee1.emailId2,
      email4: testData.ManagePayrollPayee1.emailId3,
      email5: testData.ManagePayrollPayee1.emailId4,
      emailMessage: testData.ManagePayrollPayee1.emailMessage
    });

    // STEP 17: Select Payment date - Click checkbox: Earliest Available Date (CRITICAL STEP)
    // Corresponds to: earliestAvailableDateCheckbox.click()
    // This step is required before proceeding to the next page
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.earliestAvailableDateCheckbox);
    await webComponents.waitForUXLoading([], page);

    // STEP 18: Click Next button to proceed to preview
    // Corresponds to: nextButton.click()
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 19: Preview page ready state check (jiazhaiForPreviewPage equivalent)
    // Corresponds to: jiazhaiForPreviewPage()
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 20: Click Submit button to submit the payment
    // Corresponds to: submitButton.click()
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 21: Submitted page ready state check (jiazhaiForSubmittedPage equivalent)
    // Corresponds to: jiazhaiForSubmittedPage()
    await webComponents.waitElementToBeVisible(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 22: Extract reference ID from success banner
    // Corresponds to: huoQuIdealxInfoReferenceID().then(text => { reference = text; })
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);

    reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);
    expect(reference).toBeTruthy();

    // STEP 23: Click Finish button to close submitted dialog
    // Corresponds to: finishButton.click() (extracted from dismissButton logic)
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // STEP 24: Search for created payment via reference in Transfer Center
    // Corresponds to: TransferCentersPage.quyemianjiancha(reference)
    // NOTE: After Finish, we're back at the payroll page and can directly search
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);

    // STEP 25: View payment page ready state check (jiazhaiForViewPaymentPage equivalent)
    // Corresponds to: jiazhaiForViewPaymentPage()
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);
    await webComponents.waitForUXLoading([], page);

    // STEP 26: COMPREHENSIVE VALIDATION - Equivalent to checkViewPageAllField(true)
    // This validation encompasses all field checks from the Protractor test's checkViewPageAllField(true)
    // Reference: SG_ManagePayroll.test.ts lines 428-454
    // Validates: Amount, Account details, Payee info, Status, Payment method, Emails, Hash value, Batch ID
    console.log('Starting comprehensive payment validation...');

    // Validate all fields using the comprehensive method
    await pages.PayrollPage.validatePayeeOrRefrenceNoDetails({
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
      amountEditedLabelValue: testData.ManagePayrollPayee1.amountEdited,
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
      email5LabelValue: testData.ManagePayrollPayee1.emailId4
    }, reference);

    console.log('✓ All payment validation checks passed');
    console.log(`✓ Payment successfully created with reference: ${reference}`);

  });

});
