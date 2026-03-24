/*
  * Author: LC5741501
  * Created Date: 10/03/26
  * Class path "tests/PayTransfer/ID_BulkPayment.spec.ts"
  * Description: This Specification contains the test cases related Indonesia Bulk Payment
  * 1) TC001_ID_BulkPayment - Verify payee is not able to create Bulk Payment with item amount greater than 1000000000 IDR
  * 2) TC002_ID_BulkPayment - Verify payee is able to create Bulk Payment with item amount equal to 1000000000 IDR
  * 3) TC003_ID_BulkPayment - Verify payee(existing and new Payee) is able to create Bulk Payment with item amount equal to 1000000000 IDR
  */

//Required Imports
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { chromium, Browser } from 'playwright';
import { WebComponents } from '../../../lib/webComponents';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';

//Variable declaration for Browser
let customBrowser: Browser;

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/ID_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
const loginCompanyId = testData.BulkPayment.SIT.loginCompanyId;
const loginUserId = testData.BulkPayment.SIT.loginUserId;
const fromAccount = testData.BulkPayment.SIT.fromAccount;
const payeeBankID = testData.BulkPayment.SIT.payeeBankID;

//Initialize Web Component class
const webComponents = new WebComponents();

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

// Actions for beforEach and afterEach test hooks
test.describe('ID_Bulk Payment (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { nickName?: string; accountNumber?: string };
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
        const key = p.nickName ?? p.accountNumber ?? '';
        await pages.PayrollPage.deletePayeeByFilter(key, /* confirm */ true);
        console.log(`[cleanup] Deleted payee with key: ${key}`);
      } catch (err) {
        console.warn('[cleanup] Failed to delete a payee:', err);
      }
    }
  });


  // TC001_ID_BulkPayment: 1000,000,001 > 1000,000,000(100 crore)
  test('TC001_ID_BulkPayment - Verify payee is not able to create Bulk Payment with item amount greater than 1000000000 IDR', async ({ page }) => {

    // Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // Step 3: Click Bulk Payment option.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
    await webComponents.waitForUXLoading([], page);

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Add "New payee".
    const { nickName, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetailsCheckPopupClickContinueBtn({
      name: testData.BulkPayment.newPayeeName,
      nickName: testData.BulkPayment.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.BulkPayment.newPayeeAcctNumber,
    });

    // Register for cleanup (Push: to add one or more elements to the end of the array)
    createdPayees.push({ nickName, accountNumber });

    // Step 6: Enter Amount
    await webComponents.enterTextarea(pages.BulkPaymentPage.amount, testData.BulkPayment.moreThanMaxAmountLimit);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);

    // Step 7: Enter Payment and other optional details 
    await webComponents.enterTextarea(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Step 8: Validate Error: "Amount is invalid." (1000000001)
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountInlineError, testData.BulkPayment.amountErrorTip);

    // Step 9: Click Next button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);

    // Step 10: Validate Error: "One or more of the fields below have not been properly filled up. Please amend and submit again."
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.errorOneOrMorefieldsNotFilled);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.errorOneOrMorefieldsNotFilled, testData.BulkPayment.errorMessage);

  });

  // TC002_ID_BulkPayment: 1000,000,000(100 crore) with 1 Payee
  test('TC002_ID_BulkPayment - Verify payee is able to create Bulk Payment with item amount equal to 1000000000 IDR', async ({ page }) => {

    // Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // Step 3: Click Bulk Payment option.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
    await webComponents.waitForUXLoading([], page);

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Add "New payee".
    const { nickName, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetailsCheckPopupClickContinueBtn({
      name: testData.BulkPayment.newPayeeName,
      nickName: testData.BulkPayment.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.BulkPayment.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // Step 6: Enter Amount
    await webComponents.enterTextarea(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmount);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);

    // Step 7: Enter Payment details
    await webComponents.enterTextarea(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Step 8: Select: Resident Status (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentStatus);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentOptionNonResident);

    // Step 9: Select: Payee Category (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategory);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategoryOptionEnterprise);

    // Step 10: Click Payment date : Earliest Available (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.earliestAvailableDateCheckbox);

    // Step 11: Click Next button.
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);

    // Step 12: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 13: Search Reference No and Open.
    const referenceText = await pages.BulkPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.BulkPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Step 14: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.finishedButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 15: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 16: Validate Amount.
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountView, testData.BulkPayment.maxAmountValidation);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountViewLabel, testData.BulkPayment.fromAccountViewLabel);

    // Step 17: Validate fromAccountName and deductAmount. (Additional Validation)
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountNameViewLabel, testData.BulkPayment.fromAccountNameViewLabel);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.deductAmountView, testData.BulkPayment.deductedAmount);

    // Step 18: This method deletes the existing opened PayeeOrReferenceNo.
    await pages.BulkPaymentPage.deleteOpenPayerOrReferenceNo({
      transactionDeleted: testData.BulkPayment.transactionDeleted,
      internalReference: testData.BulkPayment.internalReferenceUserProvided
    }, reference);

  });

  // TC003_ID_BulkPayment: 1000,000,000(100 crore) with 2 Payee
  test('TC003_ID_BulkPayment - Verify payee(existing and new Payee) is able to create Bulk Payment with item amount equal to 1000000000 IDR', async ({ page }) => {

    //Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    //Step 2: Handle Authentication Pop-up.
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // Step 3: Click Bulk Payment option.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
    await webComponents.waitForUXLoading([], page);

    // Step 4: Select account from "Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Add "New payee".
    const { nickName, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetailsCheckPopupClickContinueBtn({
      name: testData.BulkPayment.newPayeeName,
      nickName: testData.BulkPayment.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.BulkPayment.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // Step 6: Enter Amount
    await webComponents.enterTextarea(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountPayee1);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);

    // Step 7: Enter Payment details
    await webComponents.enterTextarea(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Step 8: Select: Resident Status (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentStatus);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentOptionNonResident);

    // Step 9: Select: Payee Category (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategory);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategoryOptionEnterprise);

    // Step 10: Click Payment date : Earliest Available (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.earliestAvailableDateCheckbox);

    // Step 11: Add Existing Payee
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.existingPayeeTabIx);
    await webComponents.enterTextarea(pages.BulkPaymentPage.existingPayeeFilter, testData.BulkPayment.existingPayee);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.addButton);

    // Step 12: Add Existing Payer: Amount
    await webComponents.enterTextarea(pages.BulkPaymentPage.amountPayee1, testData.BulkPayment.maxAmountPayee2);

    // Step 13: Click Next button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);

    // Step 14: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 15: Search Reference No and Open.
    const referenceText = await pages.BulkPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.BulkPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Step 16: Click Finish button.
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.finishedButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);

    // Step 17: Search Reference No and Open.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.hashValueLabel);

    // Step 18: Validate Refrence No details.
    // Validate Bulk Payment From Account, From AccountName, Your Account Will be deducted and Amount.
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountView, testData.BulkPayment.maxAmountValidationPayee2);

    // Step 19: (Additional Validation)
    // Validate Bulk Payment From Account, From AccountName, Your Account Will be deducted and Amount.
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountViewPayee2, testData.BulkPayment.maxAmountValidationPayee1);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountViewLabel, testData.BulkPayment.fromAccountViewLabel);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountNameViewLabel, testData.BulkPayment.fromAccountNameViewLabel);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.deductAmountView, testData.BulkPayment.deductedAmount);

    // Step 18: This method deletes the existing opened PayeeOrReferenceNo.
    await pages.BulkPaymentPage.deleteOpenPayerOrReferenceNo({
      transactionDeleted: testData.BulkPayment.transactionDeleted,
      internalReference: testData.BulkPayment.internalReferenceUserProvided
    }, reference);

  });

});