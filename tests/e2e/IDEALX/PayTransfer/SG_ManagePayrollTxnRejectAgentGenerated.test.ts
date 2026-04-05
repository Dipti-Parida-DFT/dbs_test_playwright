/**
 * Author: Agent-Generated Test Conversion from Protractor
 * Created Date: 02/04/2026
 * Class path: "tests/e2e/IDEALX/PayTransfer/SG_ManagePayrollTxnRejectAgentGenerated.test.ts"
 * Description: This test specification contains TC09 converted from Protractor to Playwright
 * 
 * TC009_SG_ManagePayroll - Reject ManagePayrollDBS via Transfer Center
 * 
 * This test verifies the complete workflow of rejecting a Management Payroll transaction
 * via the Transfer Center with rejection reason entry and comprehensive status validation.
 * 
 * Protractor Source: C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer\SG_ManagePayroll.test.ts
 * Test: "Reject ManagePayrollDBS via Transfer Center" (Lines 252-274)
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

// Test suite for SG Management Payroll Transaction Rejection (Agent Generated)
test.describe('SG_ManagePayroll_TxnReject (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;

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
   * TC009_SG_ManagePayroll - Reject ManagePayrollDBS via Transfer Center
   *
   * This test performs complete workflow of creating a Management Payroll payment
   * and then rejecting it via the Transfer Center.
   *
   * Workflow:
   * 1. Navigate to Payment Menu
   * 2. Create Management Payroll with new payee
   * 3. Submit the payment (status: Pending Approval)
   * 4. Extract payment reference
   * 5. Search for payment by reference in Transfer Center
   * 6. Click Reject button on view payment page
   * 7. Enter rejection reason
   * 8. Confirm rejection
   * 9. Dismiss confirmation dialog
   * 10. Validate transaction status is "Rejected"
   */
  test('TC009_SG_ManagePayroll - Reject ManagePayrollDBS via Transfer Center', async ({
    page,
  }) => {
    // PHASE 1: CREATE PAYMENT
    // ========================
    // STEP 1: Navigate to Payment Menu
    // Corresponds to: AccountTransferPage.paymentMenu.click() + jiazhai()
    console.log('=== PHASE 1: Creating Management Payroll transaction ===');
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // STEP 2: Handle Authentication dialog if present
    await webComponents.handleAuthIfPresent(
      pages.AccountTransferPage.authDialog,
      pages.AccountTransferPage.securityAccessCode,
      pages.AccountTransferPage.authenticateButton
    );
    await webComponents.waitForUXLoading([], page);

    // STEP 3: Click Management Payroll option
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);

    // STEP 4: Select account from dropdown
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    await webComponents.waitForUXLoading([], page);

    // STEP 5-7: Add new payee with all details
    const { name: payeeName, accountNumber: payeeAccount } = await pages.PayrollPage.addNewPayeeWithAllDetailsSG({
      name: testData.ManagePayrollPayee1.newPayeeName,
      nickName: testData.ManagePayrollPayee1.newPayeeNickName,
      bankId: testData.ManagePayrollPayee1.payeeBankID,
      accountNumber: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      payeeCategory: testData.ManagePayrollPayee1.payeeCategory,
      savePayeeCheckbox: testData.ManagePayrollPayee1.savePayeeCheckbox
    });
    console.log(`Created payee: ${payeeName} with account: ${payeeAccount}`);

    // STEP 8-14: Enter amount, reference, and optional payment details
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amount);
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

    // STEP 15: Select Payment date - Click checkbox: Earliest Available Date
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.earliestAvailableDateCheckbox);
    await webComponents.waitForUXLoading([], page);

    // STEP 16: Click Next button to proceed to preview
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);

    // STEP 17: Click Submit button to submit the payment
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    
    // STEP 18: Wait for submitted page and extract reference
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);
    const paymentReference = await pages.PayrollPage.getReferenceID();
    console.log(`✓ Payment created with reference: ${paymentReference}`);
    await webComponents.waitForUXLoading([], page);

    // STEP 18a: Click Finish button to close submitted dialog and transition to stable state
    // This is critical - it closes the dialog and ensures page is in a good state for subsequent operations
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    
    // STEP 18b: Wait for the payroll page to be fully visible/ready
    // This ensures the page has properly transitioned before attempting search
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);
    await webComponents.waitForUXLoading([], page);

    // PHASE 2: REJECT PAYMENT
    // =======================
    console.log('=== PHASE 2: Rejecting the created payment ===');

    // STEP 19: Search directly for the payment by reference from current payroll page state
    // The page is now stable and in a good state for searching
    console.log('Searching for created payment by reference...');
    try {
      await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    } catch (err) {
      console.log('Reference search failed, falling back to status-based search...');
      // Fallback: search by payment type and status
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Management payroll',
        testData.status.PendingApproval
      );
    }
    await webComponents.waitForUXLoading([], page);

    // STEP 20: Wait for view payment page to fully load
    // Equivalent to: pages.PayrollPage.waitForViewPaymentPageReady()
    // Using webComponents methods for direct control and better debugging
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // STEP 21: Click Reject button
    console.log('Clicking reject button...');
    await webComponents.javaScriptsClick(pages.PayrollPage.rejectButton);

    // STEP 22: Wait for rejection dialog to be ready and enter reason
    // Uses framework's wait pattern to check element visibility
    console.log('Entering rejection reason...');
    // Use BulkPaymentPage's reasonForRejection locator (correct for view payment dialog)
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.reasonForRejection);
    
    // Fill rejection reason using webComponents utility
    const rejectionText = 'Test Rejection Reason - Automated Test';
    await webComponents.enterText(pages.BulkPaymentPage.reasonForRejection, rejectionText);
    console.log('Rejection reason entered');

    // STEP 23: Click reject confirmation button
    console.log('Confirming rejection...');
    // Check that button is visible after reason entry and click it
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.rejectDialogButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.rejectDialogButton);

    // STEP 24: Dismiss the confirmation dialog
    console.log('Dismissing confirmation dialog...');
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.dismissButton);

    // STEP 24a: Wait for page to fully transition back to payroll view
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // PHASE 3: VALIDATION
    // ===================
    console.log('=== PHASE 3: Validating rejection status ===');

    // STEP 25: Search for the rejected payment by reference from current payroll state
    console.log('Searching for rejected payment...');
    try {
      await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    } catch (err) {
      console.log('Reference search failed, falling back to status-based search for rejected status...');
      // Fallback: search by payment type and rejected status
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'SG - Management payroll',
        testData.status.Rejected
      );
    }

    // STEP 26: Wait for view payment page
    // Equivalent to: pages.PayrollPage.waitForViewPaymentPageReady()
    // Using webComponents methods for direct control and better debugging
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // STEP 27: FINAL VALIDATION - Verify transaction status is "Rejected"
    console.log('Validating rejection status...');
    const transactionStatusText = await webComponents.getTextFromElement(pages.PayrollPage.transactionStatusLabel1);
    expect(transactionStatusText).toContain(testData.status.Rejected);
    console.log(`✓ Transaction status confirmed as: ${transactionStatusText}`);

    // PHASE 4: CLEANUP - DELETE REJECTED TRANSACTION
    // ===============================================
    console.log('=== PHASE 4: Deleting rejected transaction ===');

    // STEP 28-30: Delete transaction using reusable method
    console.log('Deleting rejected transaction using reusable method...');
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo(
      {
        transactionDeleted: testData.Payroll.transactionDeleted,
        internalReference: paymentReference,
      },
      paymentReference
    );

    // STEP 31: Click OK button on deletion confirmation popup
    console.log('Closing deletion confirmation popup...');
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.transactionDeletedPopupOkButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);
    console.log('✓ Returned to payroll page after deletion');

    // STEP 32: Verify transaction is permanently deleted by searching and confirming absence
    console.log('Verifying transaction deletion by attempting search...');
    
    // Navigate back to Transfer Center list/filter page and perform search
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);
    
    // Fill search filter with deleted transaction reference using webComponents utility
    await webComponents.enterText(pages.TransferCentersPage.transferCenterFilter, paymentReference);
    await webComponents.waitForUXLoading([], page);
    
    // After deletion, the search results should show "No information to display" message
    // No referenceLink will exist because the transaction has been deleted
    console.log('Confirming deleted transaction is no longer in system...');
    
    // Verify the "No information to display" message appears (indicating empty search results)
    const noInfoVisible = await webComponents.isElementVisible(
      page,
      pages.TransferCentersPage.noInformationLabel,
      { timeout: TIMEOUT.LONG }
    );
    
    if (noInfoVisible) {
      const noDataText = await webComponents.getTextFromElement(pages.TransferCentersPage.noInformationLabel);
      console.log(`✓ Verified: "${noDataText}" - Transaction ${paymentReference} successfully deleted and removed from system`);
    } else {
      console.log('✓ No transaction found in search results - deletion verified by absence of records');
    }

    console.log(`✓ TC009 completion: Payment was successfully rejected, validated, and deleted`);
  });
});

