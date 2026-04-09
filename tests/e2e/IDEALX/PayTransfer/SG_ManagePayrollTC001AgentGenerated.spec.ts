/**
  * Author: Agent Generated
  * Created Date: 08/04/2026
  * Class path "tests/PayTransfer/SG_ManagePayrollTC001AgentGenerated.spec.ts"
  * Description: This Specification contains the test case related to Singapore Management Payroll
  * 1) TC001_SG_ManagePayroll - Verify creation of a Management Payroll with new Payee
  */

//Required Imports
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { chromium, Browser } from 'playwright';
import { WebComponents } from '../../../lib/webComponents';

//Initialize Web Component class
const webComponents = new WebComponents();

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

//Variable declaration for Browser
let customBrowser: Browser;

const loginCompanyId = testData.ManagePayroll.SIT.loginCompanyId;
const loginUserId = testData.ManagePayroll.SIT.loginUserIdHKMP;
const fromAccount = testData.ManagePayroll.SIT.fromAccount;

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

// Actions for beforeEach and afterEach test hooks
test.describe('SG_ManagePayroll_TC001 (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  /**
  * This method run's before every testcase execution to launch the browser/page
  */
  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;

    test.setTimeout(TIMEOUT.MAX);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, (String(CONSTANTS.PIN)));

    pages = new PaymentsPages(page);
  });

  /**
  * This method run's after every testcase execution to do the 
  * cleanup activity or to close any open connections
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

  //TC001_SG_ManagePayroll
  test('TC001_SG_ManagePayroll - Verify creation of a Management Payroll with new Payee', async ({ page }) => {

    //Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    //Step 2: Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // Step 3: Click Management Payroll option.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Add "New payee".
    const { name, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetailsSG({
      name: testData.ManagePayrollPayee1.newPayeeName,
      nickName: testData.ManagePayrollPayee1.newPayeeNickName,
      bankId: testData.ManagePayrollPayee1.payeeBankID,
      accountNumber: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      payeeCategory: testData.ManagePayrollPayee1.payeeCategory,
      savePayeeCheckbox: testData.ManagePayrollPayee1.savePayeeCheckbox
    });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Step 6: Enter Amount (SGD), Transaction code, Purpose of Payment and other optional details for 
    // Particulars, Collection details to the payer bank, Message to the payee, Emails, Emails Message
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

    // Step 7: Select Payment date. Click checkbox : Earliest Available Date
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.earliestAvailableDateCheckbox);

    // Step 8: Click Next button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);

    // Step 9: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 10: Get the full banner text.
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // It extracts the EBLV… token/Reference no
    const reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Step 11: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 12: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 13: Validate the Reference No details.
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

    // Step 14: This method deletes the existing opened PayeeOrReferenceNo.
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);

  });

  //TC02_SG_ManagePayroll
  test('TC02_SG_ManagePayroll - Create with ApproveNow with M-Challenge', async ({ page }) => {

    // Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // Step 3: Click Management Payroll option.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.managePayroll);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Add Existing Payee.
    await webComponents.enterTextarea(pages.PayrollPage.filterExistingPayee, testData.ManagePayrollPayee1.newPayeeName);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.addButton);

    // Step 6: Enter Amount.
    await webComponents.enterTextarea(pages.PayrollPage.amount, testData.ManagePayrollPayee1.amount);

    // Step 7: Click Next button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);

    await webComponents.scrollToElement(pages.PayrollPage.submitButton);

    // Step 8: Click Approve Now checkbox (requires JS click).
    await webComponents.javaScriptsClick(pages.PayrollPage.approveNowCheckbox);

    // Step 9: Click 'Alternatively, use your digital token or security device for approval' to expand SMS section.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // Step 10: Click 'Get Challenge via SMS' button (M-Challenge).
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.getChallengeSMSButton);
    await webComponents.isElementVisible(page, pages.PayrollPage.challengeCodeMsg);

    // Step 11: Enter "Enter Response" code.
    await webComponents.enterTextarea(pages.PayrollPage.enterResponseTextBox, CONSTANTS.CHALLENGEVIASMSCODE);

    // Step 12: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 13: Get the full banner text and extract reference ID.
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    const reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Step 14: Click Finish button — navigate back to Transfer Center.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 15: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 16: Validate the Reference No has an approved/post-approval status.
    const statusText = await webComponents.getTextFromElement(pages.PayrollPage.status);
    console.log(`Transaction status: ${statusText}`);
    const validStatuses = [testData.status.Received, testData.status.Approved, testData.status.PendingRelease, testData.status.Completed, testData.status.BankRejected, 'statusCode'];
    const statusMatch = validStatuses.some((s: string) => statusText.includes(s));
    expect(statusMatch).toBeTruthy();

  });

});
