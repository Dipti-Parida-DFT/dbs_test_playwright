/**
 * Author: Agent-Generated Test Conversion from Protractor
 * Created Date: 02/04/2026
 * Class path: "tests/e2e/IDEALX/PayTransfer/SG_ManagePayrollAgentGenerated.test.ts"
 * Description: This test specification contains TC01 converted from Protractor to Playwright
 * 
 * TC001_SG_ManagePayroll - Create ManagePayrollDBS with new payee
 * 
 * This test verifies the complete workflow of creating a Management Payroll transaction
 * with a new payee, including all data entry, submission, and comprehensive validation
 * of the created transaction details.
 * 
 * Protractor Source: C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer\SG_ManagePayroll.test.ts
 * Function: checkViewPageAllField(isEdit: boolean) - Lines 428-454
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

// Test suite for SG Management Payroll conversion (Agent Generated)
test.describe('SG_ManagePayroll_AgentGenerated (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;

  // Track created payees for cleanup
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  // Login credentials from test data
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
   * This test covers the following Protractor steps:
   * 1. Navigate to Payment & Transfer Menu via paymentMenu.click()
   * 2. Perform jiazhai() on Transfer Centers (ready state check)
   * 3. Click Management Payroll option
   * 4. Perform jiazhai() on Payroll page (ready state check)
   * 5. Select fromAccount via dropdown
   * 6. Click New Payee button
   * 7. Enter payee details: name, bank ID, account number
   * 8. Click "New Payee" button to add the payee
   * 9. Enter amount and reference for payee
   * 10. Click "Show Optional Details" to reveal advanced fields
   * 11. Enter payment details
   * 12. Click "Beneficiary is Advising" checkbox
   * 13. Enter 5 email addresses
   * 14. Enter email message
   * 15. Click Next button
   * 16. Perform jiazhaiForPreviewPage() (preview page ready)
   * 17. Click Submit button
   * 18. Perform jiazhaiForSubmittedPage() (confirmation page ready)
   * 19. Extract reference ID from success banner
   * 20. Navigate to Payment Menu again
   * 21. Search for the created payment via reference in Transfer Center
   * 22. Perform jiazhaiForViewPaymentPage() (view page ready)
   * 23. Execute checkViewPageAllField(true) validation - comprehensive field validation
   *
   * The validation checks all fields on the View Payment page including:
   * - From Account details
   * - Amount and edited amount
   * - Account number
   * - Transaction status (Pending Approval)
   * - Hash value, Balance value
   * - Payment type and date
   * - References (internal, batch ID)
   * - Payee name and nick name
   * - Bank name and SWIFT/BIC code
   * - Amount, Purpose code
   * - Reference for payee
   * - Payment details
   * - Email addresses and message
   * - Next approver and activity log  */
  test('TC001_SG_ManagePayroll - Create ManagePayrollDBS with new payee', async ({ page }) => {

    // STEP 1: Navigate to Payment & Transfer Menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // STEP 2: Handle Authentication Pop-up (CRITICAL - handles dialog that appears after payment menu)
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton
    );

    // STEP 3: Click Management Payroll option
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);

    // STEP 4: Select account from "Account" dropdown
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // STEP 5-7: Add new payee with all details (encapsulates newPayee.click() + payee form entry + newPayeeButton.click())
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

    // STEP 9-14: Enter amount, reference, and optional payment details
    //   Corresponds to: amount.ShuRu(), payeeRef.ShuRu(), showoptionaldetails.click(), 
    //   paymentDetails, isBeneAdvising, email fields, message
    // Note: The method below encapsulates all these steps including reference entry and show details click
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

    // STEP 8: Select Payment date - Click checkbox: Earliest Available Date (CRITICAL STEP)
    // Corresponds to: earliestAvailableDateCheckbox.click()
    // This step is required before proceeding to the next page
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.earliestAvailableDateCheckbox);
    await webComponents.waitForUXLoading([], page);

    // STEP 9: Click Next button to proceed to preview
    // Corresponds to: nextButton.click()
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 16: Preview page ready state check (jiazhaiForPreviewPage equivalent)
    // Corresponds to: jiazhaiForPreviewPage()
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 17: Click Submit button to submit the payment
    // Corresponds to: submitButton.click()
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 18: Submitted page ready state check (jiazhaiForSubmittedPage equivalent)
    // Corresponds to: jiazhaiForSubmittedPage()
    await webComponents.waitElementToBeVisible(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);

    // STEP 19: Extract reference ID from success banner
    // Corresponds to: huoQuIdealxInfoReferenceID().then(text => { reference = text; })
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);

    const reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);
    expect(reference).toBeTruthy();

    // STEP 20: Click Finish button to close submitted dialog
    // Corresponds to: finishButton.click() (extracted from dismissButton logic)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // STEP 21: Search for created payment via reference in Transfer Center
    // Corresponds to: TransferCentersPage.quyemianjiancha(reference)
    // NOTE: After Finish, we're back at the payroll page and can directly search
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);

    // STEP 22: View payment page ready state check (jiazhaiForViewPaymentPage equivalent)
    // Corresponds to: jiazhaiForViewPaymentPage()
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);
    await webComponents.waitForUXLoading([], page);

    // STEP 23: COMPREHENSIVE VALIDATION - Equivalent to checkViewPageAllField(true)
    // This validates ALL fields visible on the view payment page
    // Corresponds to: checkViewPageAllField(true) - Protractor validation function (lines 428-454)

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
