/**
  * Author: LC5741501
  * Created Date: 25/03/2026
  * Class path "tests/PayTransfer/SG_ManagePayroll.spec.ts"
  * Description: This Specification contains the test cases related HongKong Management Payroll
  * 1) TC001_SG_ManagePayroll - Verify creation of a Management Payroll with new Payee.
  */

//Required Imports
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
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
test.describe('SG_ManagePayroll (Playwright using PaymentsPages)', () => {
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
    const { name, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetails({
      name: testData.ManagePayrollPayee1.newPayeeName,
      nickName: testData.ManagePayrollPayee1.newPayeeNickName,
      bankId: testData.ManagePayrollPayee1.payeeBankID,
      accountNumber: testData.ManagePayrollPayee1.newPayeeAcctNumber
    });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Step 6: Enter Amount (SGD), Transaction code, Purpose of Payment and other optional details for 
    // Particulars, Collection details to the payer bank, Message to the payee, Emails, Emails Message
    await pages.PayrollPage.enterNewPayeeAllOtherDetails({
      amount: testData.ManagePayrollPayee1.amount,
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
    await pages.BulkCollectionPage.deleteOpenPayerOrReferenceNo({
      transactionDeleted: testData.ManagePayrollPayee1.transactionDeleted,
      internalReference: testData.ManagePayrollPayee1.internalReferenceUserProvided
    }, reference);

  });


});