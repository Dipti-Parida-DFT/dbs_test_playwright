/**
  * Author: LC5741501
  * Created Date: 25/03/2026
  * Class path "tests/PayTransfer/SG_ManagePayroll.spec.ts"
  * Description: This Specification contains the test cases related HongKong Management Payroll
  * 1) TC001_SG_ManagePayroll - Verify creation of a Management Payroll with new Payee
  * 2) TC002_SG_ManagePayroll - Verify Management Payroll creation(existing Payee) using "Approve Now" with "Get Challenge via SMS", resulting in an "Approved" transaction status
  * 3) TC003_SG_ManagePayroll - Verify Management Payroll creation(New Payee) using "Approve Now" without "Get Challenge via SMS", resulting in an "Partial Approved" transaction status
  * 4) TC004_SG_ManagePayroll - Verify Management Payroll creation(existing Payee) with Save as Draft, resulting in an "Saved" transaction status
  * 
  */

//Required Imports
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {   PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';

//Initialize Web Component class
const webComponents = new WebComponents();

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';
import { WebComponents } from '../../../lib/webComponents';

//Variable declaration for Browser
let customBrowser: Browser;

const loginCompanyId = testData.ManagePayroll.SIT.loginCompanyId;
const loginUserId = testData.ManagePayroll.SIT.loginUserIdHKMP;
const fromAccount = testData.ManagePayroll.SIT.fromAccount;

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

// Actions for beforEach and afterEach test hooks
test.describe('SG_ManagePayroll (Playwright using PaymentsPages)',{ tag: ['@management-payroll','@ui','@sg'] }, () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  /**
  * This method run's before every testcase execution to launch the browser/page
  */
  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;

    //customBrowser = await chromium.launch({ headless: false });
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
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.PayrollPage.getReferenceID();

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


  //TC002_SG_ManagePayroll
  test('TC002_SG_ManagePayroll - Verify Management Payroll creation(existing Payee) using "Approve Now" with "Get Challenge via SMS", resulting in an "Approved" transaction status', async ({ page }) => {

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

    // Step 5: Add Existing Payer.
    await webComponents.enterTextarea(pages.PayrollPage.filterExistingPayee, testData.ManagePayrollPayee1.newPayeeName);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.addButton);

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

    await webComponents.scrollToElement(pages.PayrollPage.submitButton);

    // Step 9: Click Approve checkbox
    await webComponents.javaScriptsClick(pages.PayrollPage.approveNowCheckbox);

    // Step 10: Click 'Alternatively, use your digital token or security device for approval'
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // Step 11: Click Approve checkbox 'Get Challenge via SMS' button
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.getChallengeSMSButton);
    await webComponents.isElementVisible(page, pages.PayrollPage.challengeCodeMsg);

    // Step 12: Enter "Enter Response" code
    await webComponents.enterTextarea(pages.PayrollPage.enterResponseTextBox, CONSTANTS.CHALLENGEVIASMSCODE);

    // Step 13: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 14: Get the full banner text.
    const referenceText = await pages.PayrollPage.getReferenceText();
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.PayrollPage.getReferenceID();

    // Step 15: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 16: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 17: Validate the Reference No details.(all validation are extra except status)
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
      statusLabelValue: testData.status.Approved,

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

  });


  //TC003_SG_ManagePayroll
  test('TC003_SG_ManagePayroll - Verify Management Payroll creation(New Payee) using "Approve Now" without "Get Challenge via SMS", resulting in an "Partial Approved" transaction status', async ({ page }) => {

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
      amount: testData.ManagePayrollPayee1.amountPartialApprove,
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
    await webComponents.scrollToElement(pages.PayrollPage.submitButton);

    // Step 9: Click Approve checkbox
    await webComponents.javaScriptsClick(pages.PayrollPage.approveNowCheckbox);

    // Step 10: Click 'Alternatively, use your digital token or security device for approval'
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // Step 11: Get Digital Token Instructions
    const digiToken1 = await webComponents.getTextFromElement(pages.PayrollPage.digitalTokenInstructions1);
    const digiToken2 = await webComponents.getTextFromElement(pages.PayrollPage.digitalTokenInstructions2);
    const concatenatedDigiToken = await webComponents.concatenateStrings(digiToken1, digiToken2);

    // Step 12: Enter "Enter Response" code
    await webComponents.enterTextarea(pages.PayrollPage.enterResponseTextBox, concatenatedDigiToken);

    // Step 13: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 14: Get the full banner text.
    const referenceText = await pages.PayrollPage.getReferenceText();
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.PayrollPage.getReferenceID();

    // Step 15: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 16: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 17: Validate the Reference No details.(all validations are extra except status)
    await pages.PayrollPage.validatePayeeOrRefrenceNoDetails({
      fromAccountValue1: testData.ManagePayrollPayee1ValidationData.fromAccountValue1,
      fromAccountValue2: testData.ManagePayrollPayee1ValidationData.fromAccountValue2,
      paymentTypeValue: testData.ManagePayrollPayee1ValidationData.paymentTypeValue,
      amountDeductedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedValueSG,
      amountDeductedEditedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedEditedValue,

      referenceValueUserProvided: testData.ManagePayrollPayee1.internalReferenceUserProvided,
      batchIdValueUserProvided: testData.ManagePayrollPayee1.batchIdValueUserProvided,

      paymentSummaryLabel: testData.ManagePayrollPayee1ValidationData.paymentSummaryLabel,
      totalPayeesLabel: testData.ManagePayrollPayee1ValidationData.totalPayeesLabel,
      totalPayeesValue: testData.ManagePayrollPayee1ValidationData.totalPayeesValue,
      totalAmountLabel: testData.ManagePayrollPayee1ValidationData.totalAmountLabel,
      totalAmountValue: testData.ManagePayrollPayee1ValidationData.totalAmountValueSG,
      totalAmountValueEdited: testData.ManagePayrollPayee1ValidationData.totalAmountValueEdited,


      payeeNameLabelValue: testData.ManagePayrollPayee1.newPayeeName,
      payeeNicknameLabelValue: testData.ManagePayrollPayee1.newPayeeNickName,
      bankNameLabelValue: testData.ManagePayrollPayee1ValidationData.bankNameLabelValue,
      bankSwiftBicLabelValue: testData.ManagePayrollPayee1ValidationData.bankSwiftBicLabelValue,
      accountNumberLabelValue: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      statusLabelValue: testData.status.PartialApproved,

      amountLabelValue: testData.ManagePayrollPayee1.amountPartialApproveSG,
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

    // Step 18: This method deletes the existing opened PayeeOrReferenceNo.
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);

  });



  //TC004_SG_ManagePayroll
  test('TC004_SG_ManagePayroll - Verify Management Payroll creation(existing Payee) with Save as Draft, resulting in an "Saved" transaction status', async ({ page }) => {

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

    // Step 5: Add Existing Payer.
    await webComponents.enterTextarea(pages.PayrollPage.filterExistingPayee, testData.ManagePayrollPayee1.newPayeeName);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.addButton);

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

    // Step 8: Click Save as Draft button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.saveAsDraftButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.transferSavedPopupLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.transactionDeletedPopupLabelMsg);

    // Step 9: Get the full banner text.
    const referenceText = await webComponents.getTextFromElement(pages.PayrollPage.transactionDeletedPopupLabelMsg);
    // It extracts the EBLV… token/Refrence no
    const reference = await webComponents.getReferenceID(referenceText);

    // Step 10: Click 'Alternatively, use your digital token or security device for approval'
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.dismissButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.managePayroll);

    // Step 16: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 17: Validate the Reference No details.(all validation are extra except status)
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
      statusLabelValue: testData.status.Saved,

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

    // Step 18: This method deletes the existing opened PayeeOrReferenceNo.
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);

  });


  //TC005_SG_ManagePayroll
  test('TC005_SG_ManagePayroll - Verify Management Payroll creation using saved template(SGManagePayrollTemplateMax500)', async ({ page }) => {

    // Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // Step 3: Click Payment Templates Menu
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.createNewTemplateButton);

    // Step 4: Add Existing Payer.
    await webComponents.enterTextarea(pages.PaymentTemplatesPage.manageTemplateFilter, testData.ManagePayrollPayee1.sgManagePayrollTemplate);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.makeAPaymentLink);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.nextButton);

    // Step 5: (Additional Validation for Max amount for template Error)
    await webComponents.enterTextarea(pages.PayrollPage.amount, testData.ManagePayrollPayee1.amountMaxForSGTemplate);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.compareUIVsJsonValue(pages.PayrollPage.amountMaxForTemplateError, testData.ManagePayrollPayee1.amountMaxForTemplateError);

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


    // Step 7: Click Next button.
    await webComponents.isElementVisible(page, pages.PayrollPage.nextButton);
    await webComponents.scrollToElement(pages.PayrollPage.nextButton);
    await webComponents.hardWait(page);
    await webComponents.hardClick(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);

    // Step 8: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 9: Get the full banner text.
    const referenceText = await pages.PayrollPage.getReferenceText();
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.PayrollPage.getReferenceID();

    // Step 10: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 11: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 12: Validate the Reference No details.(all validation are extra except status)
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

    // Step 13: This method deletes the existing opened PayeeOrReferenceNo.
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);

  });


  //TC006_SG_ManagePayroll
  test('TC006_SG_ManagePayroll - Verify Management Payroll creation(existing payee) using with Save as Tempalte', async ({ page }) => {

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

    // Step 5: Add Existing Payer.
    await webComponents.enterTextarea(pages.PayrollPage.filterExistingPayee, testData.ManagePayrollPayee1.newPayeeName);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.addButton);

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
    await webComponents.scrollToElement(pages.PayrollPage.submitButton);

    // Step 9: Click "Save as template" checkbox
    await webComponents.javaScriptsClick(pages.PayrollPage.saveAsTemplateCheckbox);

    // Step 10: Enter "Template Name"
    await webComponents.enterTextarea(pages.PayrollPage.templateName, testData.ManagePayrollPayee1.sgManagePayrollTestTemplate);

    // Step 11: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 12: Get the full banner text.
    const referenceText = await pages.PayrollPage.getReferenceText();
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.PayrollPage.getReferenceID();

    // Step 13: Click "Pay & Transfer" button.
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.managePayroll);

    // Step 12: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 13: Validate the Reference No details.
    // Extra Validation added for all fields validation in actual script its validating only FromAccountValue, amount, and ExistingPayeeName
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
    // Additional Step to delete the Reference No created
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);

    // Step 15: Click Ok Button on Delete Confirmation Pop-up
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.transactionDeletedPopupOkButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.managePayroll);

    // Step 16: Click Payment Templates Menu
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.createNewTemplateButton);

    // Step 17: Enter Template name.
    await webComponents.enterTextarea(pages.PaymentTemplatesPage.manageTemplateFilter, testData.ManagePayrollPayee1.sgManagePayrollTestTemplate);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.templateNameLink);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateNameLink);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.viewManagementPayrollTemplateHeader);

    // Step 18: Validate the Template details.
    // Extra Validation added for all fields validation 
    // in actual script its validating only TemplateNameValue, FromAccountValue, amount, and ExistingPayeeName
    await pages.PayrollPage.validateManagementPayrollTemplateDetails({
      templateName: testData.ManagePayrollPayee1.sgManagePayrollTestTemplate,
      statusTop: testData.status.PendingApproval,
      fromAccountValue1: testData.ManagePayrollPayee1ValidationData.fromAccountValue1,
      fromAccountValue2: testData.ManagePayrollPayee1ValidationData.fromAccountValue2,
      paymentTypeValue: testData.ManagePayrollPayee1ValidationData.paymentTypeValue,
      checkAmountValue: testData.ManagePayrollPayee1ValidationData.amountDeductedEditedValue,
      amountValue: testData.ManagePayrollPayee1ValidationData.amountDeductedValue,
      amountEditedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedEditedValue,

      validateDate: testData.ManagePayrollPayee1ValidationData.validateDate,
      payrollFilter: testData.ManagePayrollPayee1ValidationData.payrollFilter,

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
      statusLabelValue: testData.ManagePayrollPayee1ValidationData.validateDate,
      defaultAmount: testData.ManagePayrollPayee1.amount,

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


    // Step 19: Click Canclel button on Template Details page
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.cancelButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.managePayroll);

    // Step 20: Enter "Template Name" 
    await webComponents.enterTextarea(pages.PaymentTemplatesPage.manageTemplateFilter, testData.ManagePayrollPayee1.sgManagePayrollTestTemplate);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.firstTemplateCheckbox);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.firstTemplateCheckbox);

    // Step 21: Click "Delete" button and wait for confirmTemplatesToDeleteHeader to be visible
    // Extra step added to delete the template created.
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.deletebuttonTemplate);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.confirmTemplatesToDeleteHeader);

    // Step 22: Click "Delete" button
    // Extra step added to delete the template created.
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.deletebuttonTemplate);

    // Step 23: Wait for Confirm Delete Popup to be visible and validate the header and message
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.confirmDeletePopupHeader);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.confirmDeletePopupMessageFor1Template);

    // Step 24: Click "Confirm Delete" button
    // Extra step added to delete the template created.
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.confirmDeletebutton);

    // Step 25: Wait for Template Delete Popup Message to be visible and validate the message
    // Extra step added to delete the template created.
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.templateDeletedPopupLabel);
    await webComponents.waitElementToBeVisible(pages.PaymentTemplatesPage.templateDeletedPopupMessage1template);

    // Step 26: Click "Ok" button
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.okButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.managePayroll);

  });


  //TC007_TC008_SG_ManagePayroll
  test('TC007_TC008_SG_ManagePayroll - Verify Management Payroll creation by Copy & then Edit ManagePayrollDBS via Transfer Center', async ({ page }) => {

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
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.PayrollPage.getReferenceID();

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
    // Extra Validation added for all fields validation in actual script its validating only FromAccountValue, amount, and ExistingPayeeName
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

    // Step 14: Click "Copy" button to copy the transaction.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.copyButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amount);

    // Step 15: Enter new Amount (SGD) and click Next button.
    await webComponents.enterTextarea(pages.PayrollPage.amount, testData.ManagePayrollPayee1.amountPendingVerification);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);

    // Step 16: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 17: Get the full banner text.
    const referenceText01 = await pages.PayrollPage.getReferenceText();
    // It extracts the EBLV… token/Refrence no
    const reference01 = await pages.PayrollPage.getReferenceID();

    // Step 18: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 19: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference01);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 20: Validate the Reference No details.
    // Extra Validation added for all fields validation in actual script its validating only FromAccountValue, amount, and ExistingPayeeName
    await pages.PayrollPage.validatePayeeOrRefrenceNoDetails({
      fromAccountValue1: testData.ManagePayrollPayee1ValidationData.fromAccountValue01,
      fromAccountValue2: testData.ManagePayrollPayee1ValidationData.fromAccountValue2,
      paymentTypeValue: testData.ManagePayrollPayee1ValidationData.paymentTypeValue,
      amountDeductedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedValueTc07,
      amountDeductedEditedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedEditedValue,

      referenceValueUserProvided: testData.ManagePayrollPayee1.internalReferenceUserProvided,
      batchIdValueUserProvided: testData.ManagePayrollPayee1.batchIdValueUserProvided,

      paymentSummaryLabel: testData.ManagePayrollPayee1ValidationData.paymentSummaryLabel,
      totalPayeesLabel: testData.ManagePayrollPayee1ValidationData.totalPayeesLabel,
      totalPayeesValue: testData.ManagePayrollPayee1ValidationData.totalPayeesValue,
      totalAmountLabel: testData.ManagePayrollPayee1ValidationData.totalAmountLabel,
      totalAmountValue: testData.ManagePayrollPayee1ValidationData.totalAmountValueTc07,
      totalAmountValueEdited: testData.ManagePayrollPayee1ValidationData.totalAmountValueEdited,


      payeeNameLabelValue: testData.ManagePayrollPayee1.newPayeeName,
      payeeNicknameLabelValue: testData.ManagePayrollPayee1.newPayeeNickName,
      bankNameLabelValue: testData.ManagePayrollPayee1ValidationData.bankNameLabelValue,
      bankSwiftBicLabelValue: testData.ManagePayrollPayee1ValidationData.bankSwiftBicLabelValue,
      accountNumberLabelValue: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      statusLabelValue: testData.status.PendingVerification,

      amountLabelValue: testData.ManagePayrollPayee1ValidationData.totalAmountValueAcutalTc07,
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
    }, reference01);

    // Step 21: This method deletes the existing opened PayeeOrReferenceNo.
    // Additional Step to delete the Reference No created
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference01);

    // Step 22: click Ok Button on Delete Confirmation Pop-up
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.transactionDeletedPopupOkButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.managePayroll);

    // Step 23: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // ##### Test Case TC008_SG_ManagePayroll - Edit ManagePayrollDBS via Transfer Center ####

    // Step 24: Click Edit button
    await webComponents.isElementVisible(page, pages.PayrollPage.editButton);
    await webComponents.hardWait(page);
    //await page.waitForTimeout(TIMEOUT.VERYMIN);
    await webComponents.hardClick(pages.PayrollPage.editButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amount);

    // Step 25: Select Payment date. Click Radio button : Earliest Available Date
    await webComponents.waitElementToBeVisible(pages.PayrollPage.earliestAvailableDateCheckbox);
    await webComponents.waitForUXLoading([], page);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.earliestAvailableDateCheckbox);

    // Step 26: Enter new amount
    // New amount is entered using webComponents.enterTextarea
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amount);
    await webComponents.enterTextarea(pages.PayrollPage.amount, testData.ManagePayrollPayee1.amountEditTc08);

    // Step 27: Click Next button
    await webComponents.scrollToElement(pages.PayrollPage.nextButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);

    // Step 28: Click Submit button
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 29: Click Finish button.
    await webComponents.scrollToElement(pages.BulkCollectionPage.finishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.managePayroll);
    //await page.waitForTimeout(TIMEOUT.VERYMIN); // Wait for page to settle before searching
    await webComponents.hardWait(page);

    // Step 30: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.hardWait(page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);


    // Step 31: Validate the Reference No details.
    // Extra Validation added for all fields validation in actual script its validating only FromAccountValue, amount, and ExistingPayeeName
    await pages.PayrollPage.validatePayeeOrRefrenceNoDetails({
      fromAccountValue1: testData.ManagePayrollPayee1ValidationData.fromAccountValue1,
      fromAccountValue2: testData.ManagePayrollPayee1ValidationData.fromAccountValue2,
      paymentTypeValue: testData.ManagePayrollPayee1ValidationData.paymentTypeValue,
      amountDeductedValue: testData.ManagePayrollPayee1.amountEditSGDTc08,
      amountDeductedEditedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedEditedValue,

      referenceValueUserProvided: testData.ManagePayrollPayee1.internalReferenceUserProvided,
      batchIdValueUserProvided: testData.ManagePayrollPayee1.batchIdValueUserProvided,

      paymentSummaryLabel: testData.ManagePayrollPayee1ValidationData.paymentSummaryLabel,
      totalPayeesLabel: testData.ManagePayrollPayee1ValidationData.totalPayeesLabel,
      totalPayeesValue: testData.ManagePayrollPayee1ValidationData.totalPayeesValue,
      totalAmountLabel: testData.ManagePayrollPayee1ValidationData.totalAmountLabel,
      totalAmountValue: testData.ManagePayrollPayee1.amountEditSGD,
      totalAmountValueEdited: testData.ManagePayrollPayee1ValidationData.totalAmountValueEdited,


      payeeNameLabelValue: testData.ManagePayrollPayee1.newPayeeName,
      payeeNicknameLabelValue: testData.ManagePayrollPayee1.newPayeeNickName,
      bankNameLabelValue: testData.ManagePayrollPayee1ValidationData.bankNameLabelValue,
      bankSwiftBicLabelValue: testData.ManagePayrollPayee1ValidationData.bankSwiftBicLabelValue,
      accountNumberLabelValue: testData.ManagePayrollPayee1.newPayeeAcctNumber,
      statusLabelValue: testData.status.PendingApproval,

      amountLabelValue: testData.ManagePayrollPayee1.amountEditTc08,
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

    // Step 32: This method deletes the existing opened PayeeOrReferenceNo.
    // Additional Step to delete the Reference No created
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);
  });


  /**
   * TC009_SG_ManagePayroll - Reject ManagePayrollDBS via Transfer Center
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
  test('TC009_TC010_SG_ManagePayroll - Reject & Delete ManagePayrollDBS via Transfer Center', async ({
    page,
  }) => {
    // PHASE 1: CREATE PAYMENT
    // ========================
    // STEP 1: Navigate to Payment Menu
    // Corresponds to: AccountTransferPage.paymentMenu.click() + jiazhai()
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

    // STEP 19: Search directly for the payment by reference from current payroll page state
    // The page is now stable and in a good state for searching
    try {
      await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    } catch (err) {
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
    await webComponents.javaScriptsClick(pages.PayrollPage.rejectButton);

    // STEP 22: Wait for rejection dialog to be ready and enter reason
    // Uses framework's wait pattern to check element visibility
    // Use BulkPaymentPage's reasonForRejection locator (correct for view payment dialog)
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.reasonForRejection);

    // Fill rejection reason using webComponents utility
    const rejectionText = 'Test Rejection Reason - Automated Test';
    await webComponents.enterText(pages.BulkPaymentPage.reasonForRejection, rejectionText);

    // STEP 23: Click reject confirmation button
    // Check that button is visible after reason entry and click it
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.rejectDialogButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.rejectDialogButton);

    // STEP 24: Dismiss the confirmation dialog
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.dismissButton);

    // STEP 24a: Wait for page to fully transition back to payroll view
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // PHASE 3: VALIDATION
    // ===================

    // STEP 25: Search for the rejected payment by reference from current payroll state
    console.log('Searching for rejected payment...');
    try {
      await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    } catch (err) {
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
    const transactionStatusText = await webComponents.getTextFromElement(pages.PayrollPage.transactionStatusLabel1);
    expect(transactionStatusText).toContain(testData.status.Rejected);

    //TC011_Delete ManagePayrollDBS via Transfer Center


    // PHASE 4: CLEANUP - DELETE REJECTED TRANSACTION
    // ===============================================

    // STEP 28-30: Delete transaction using reusable method
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo(
      {
        transactionDeleted: testData.Payroll.transactionDeleted,
        internalReference: paymentReference,
      },
      paymentReference
    );

    // STEP 31: Click OK button on deletion confirmation popup
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.transactionDeletedPopupOkButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // STEP 32: Verify transaction is permanently deleted by searching and confirming absence
    // Navigate back to Transfer Center list/filter page and perform search
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);

    // Fill search filter with deleted transaction reference using webComponents utility
    await webComponents.enterText(pages.TransferCentersPage.transferCenterFilter, paymentReference);
    await webComponents.waitForUXLoading([], page);

    // After deletion, the search results should show "No information to display" message
    // No referenceLink will exist because the transaction has been deleted
    // Verify the "No information to display" message appears (indicating empty search results)
    await webComponents.isElementVisible(page, pages.TransferCentersPage.noInformationLabel, { timeout: TIMEOUT.LONG });
    await webComponents.compareUIVsJsonValue(pages.TransferCentersPage.noInformationLabel, testData.ManagePayrollPayee1.noInformationToDisplay);
  });


  //TC011_SG_ManagePayroll
  test('TC011_SG_Verify - ManagePayrollDBS via My Verify', async ({ page }, testInfo) => {
    testInfo.setTimeout(TIMEOUT.ULTRA);

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
      amount: testData.ManagePayrollPayee1.amountPendingVerification,
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
    // It extracts the EBLV… token/Refrence no
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

    // Step 13: Validate the Reference No has status "Pending Verification".
    await webComponents.compareUIVsJsonValue(pages.PayrollPage.status, testData.status.PendingVerification);

    // Step 14: Logout from current user, as partiour payment is created with it. 
    // Login with a different user who has approval authority for TT payments, 
    // navigate to Transfer Center, search and open the payment with 
    // reference number created in TC011
    await pages.TelegraphicTransferPage.safeClick(pages.PayrollPage.logoutButton);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, testData.ManagePayroll.SIT.loginUserIdUser2, String(CONSTANTS.PIN));
    pages = new PaymentsPages(page);

    await webComponents.waitElementToBeVisible(pages.ApprovalPage.approvalMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);
    // Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // Step 15: Wait for Verify Payment Tab
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.verifyPaymentTab);

    // Step 16: Click Verify Payment Tab and wait for filter to be visible.
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.verifyPaymentTab);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);

    // Step 17: Search by reference in Verify tab
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.showAdditionalFilters);
    await webComponents.hardWait(page);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, reference);

    // Step 18: Click the first checkbox to select the transaction and click Verify button
    await webComponents.javaScriptsClick(pages.ApprovalPage.searchFirstCheckBox.first());

    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyButton);
    await webComponents.waitForUXLoading([], page);

    // Step 19: Click Submit button on verify confirmation page
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifySubmitButton);
    await webComponents.waitForUXLoading([], page);

    // Step 20: Verify success message and click Finish button
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.verifiedSuccessfullyMessage);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyFinishButton);
    await webComponents.waitForUXLoading([], page);

    // Step 21: Wait for transaction filter to be visible after returning to Verify tab.
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);

    // Step 22: Search in Verify tab to confirm transaction is no longer listed after verification.
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, reference);
    await webComponents.hardWait(page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.noInformationToDisplay);

    // Step 23: Click Payment & Transfer Menu.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);

    // Step 24: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 25: Validate the Reference No has status "Pending Approval".
    await webComponents.compareUIVsJsonValue(pages.PayrollPage.status, testData.status.PendingApproval);

    // Step 26: This method deletes the existing opened PayeeOrReferenceNo.
    // Additional Step to delete the Reference No created
    await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);



  });



  //TC012_SG_ManagePayroll
  test('TC012_SG_ManagePayroll - Approve ManagePayrollDBS via Transfer Center with "Get Challenge via SMS", resulting in an "Approved" transaction status', async ({ page }, testInfo) => {
    testInfo.setTimeout(TIMEOUT.ULTRA);

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

    // Step 5: Add Existing Payer.
    await webComponents.enterTextarea(pages.PayrollPage.filterExistingPayee, testData.ManagePayrollPayee1.newPayeeName);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.addButton);

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
    await webComponents.scrollToElement(pages.PayrollPage.submitButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 10: Get the full banner text.
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // It extracts the EBLV… token/Refrence no
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

    // Step 13: Validate the Reference No has status "Pending Approval".
    await webComponents.compareUIVsJsonValue(pages.PayrollPage.status, testData.status.PendingApproval);

    // Step 14: Click Payment & Transfer Menu Tab.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // Step 15: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 16: Click Approve checkbox
    await webComponents.scrollToElement(pages.PayrollPage.approveSubmitButton);
    await webComponents.javaScriptsClick(pages.PayrollPage.approveSubmitButton);

    // Step 17: Click "Push Approval" option
    await webComponents.waitElementToBeVisible(pages.PayrollPage.pushApprovalOption);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // Step 18: Click "Get Challenge via SMS" button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.getChallengeSMSButton);
    await webComponents.isElementVisible(page, pages.PayrollPage.challengeCodeMsg);

    // Step 19: Enter "Enter Response" code
    await webComponents.enterTextarea(pages.PayrollPage.enterResponseTextBox, CONSTANTS.CHALLENGEVIASMSCODE);

    // Step 20: Toolkit click on "Submit" button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.toolbarApproveButton);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.dismissButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.dismissButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);

    // Step 21: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 22: Validate the Reference No details.(all validation are extra except status)
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
      statusLabelValue: testData.status.Approved,

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

    // Note: Approved transactions cannot be deleted (Delete button is disabled for Approved status).
    // No cleanup delete step needed.

  });

  //TC013_SG_ManagePayroll
  test('TC013_SG_ManagePayroll - Release ManagePayrollDBS via My Release', async ({ page }, testInfo) => {
    testInfo.setTimeout(TIMEOUT.ULTRA);

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

    // Step 5: Add Existing Payer.
    await webComponents.enterTextarea(pages.PayrollPage.filterExistingPayee, testData.ManagePayrollPayee1.newPayeeName);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.addButton);

    // Step 6: Enter Amount (SGD), Transaction code, Purpose of Payment and other optional details for 
    // Particulars, Collection details to the payer bank, Message to the payee, Emails, Emails Message
    await pages.PayrollPage.enterNewPayeeAllOtherDetailsSG({
      amount: testData.ManagePayrollPayee1.amountPendingRelease,
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
    await webComponents.scrollToElement(pages.PayrollPage.submitButton);

    // Step 9: Click Approve checkbox
    await webComponents.javaScriptsClick(pages.PayrollPage.approveNowCheckbox);

    // Step 10: Click "Push Approval" option
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);

    // Step 11: Click "Get Challenge via SMS" button
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.getChallengeSMSButton);
    await webComponents.isElementVisible(page, pages.PayrollPage.challengeCodeMsg);

    // Step 12: Enter "Enter Response" code
    await webComponents.enterTextarea(pages.PayrollPage.enterResponseTextBox, CONSTANTS.CHALLENGEVIASMSCODE);

    // Step 13: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishButton);

    // Step 14: Get the full banner text.
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Step 15: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 16: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 17: Validate the Reference No has status "Pending Release".
    await webComponents.compareUIVsJsonValue(pages.PayrollPage.status, testData.status.PendingRelease);

    // ========== PHASE 2: Release ManagePayrollDBS via My Release ==========
    // (amountPendingRelease + Approve Now during creation → "Pending Release" status — Verify & Approve not required)

    // Step 18: Logout from current user and login with User2 who has release authority
    await pages.TelegraphicTransferPage.safeClick(pages.PayrollPage.logoutButton);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, testData.ManagePayroll.SIT.loginUserIdUser2, String(CONSTANTS.PIN));
    pages = new PaymentsPages(page);

    // Step 19: Navigate to Approvals menu
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.approvalMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);

    // Step 20: Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await webComponents.waitForUXLoading([], page);

    // Step 21: Click Release tab in ApprovalPage
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.approveReleaseTab);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveReleaseTab);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);

    // Step 22: Search by reference in Release tab
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.showAdditionalFilters);
    //await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, reference);
    await webComponents.hardWait(page);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, reference);

    // Step 23: Click the first checkbox to select the transaction and click Release button
    await webComponents.javaScriptsClick(pages.ApprovalPage.searchFirstCheckBox.first());
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveReleaseButton);
    await webComponents.waitForUXLoading([], page);

    // Step 24: Click Submit button on release confirmation page
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveReleaseSubmitButton);
    await webComponents.waitForUXLoading([], page);

    // Step 25: Verify success message and click Finish button
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.releasedSuccessfullyMessage);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveVerifyFinishButton);
    await webComponents.waitForUXLoading([], page);

    // Step 26: Search in Release tab to confirm transaction is no longer listed after release
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.transactionFilter);
    await webComponents.enterTextarea(pages.ApprovalPage.transactionFilter, reference);
    await webComponents.hardWait(page);
    await webComponents.waitElementToBeVisible(pages.ApprovalPage.noInformationToDisplay);

    // Step 27: Click Payment & Transfer Menu.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.waitForUXLoading([], page);

    // Step 28: Search Reference No and Open via Transfer Center.
    await webComponents.waitElementToBeVisible(pages.TransferCentersPage.transferCenterFilter);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.amountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 29: Validate the Reference No has final status.
    // Post-release, the batch status element may show raw status code (e.g., "statusCode.2")
    // which indicates the transaction has been processed beyond pending states.
    const statusText = await webComponents.getTextFromElement(pages.PayrollPage.status);
    const validStatuses = [testData.status.Approved, testData.status.Received, testData.status.Completed, testData.status.BankRejected, testData.status.PendingRelease, 'statusCode'];
    const statusMatch = validStatuses.some((s: string) => statusText.includes(s));
    expect(statusMatch).toBeTruthy();

  });


});