/**
  * Author: Agent Generated
  * Created Date: 09/04/2026
  * Class path "tests/e2e/IDEALX/PayTransfer/SG_AccountTransfer_TC001AgentGenerated.spec.ts"
  * Description: This Specification contains test cases related to Singapore Account Transfer
  * 1) TC01_SG_AccountTransfer - Create an ACT Payment with new Payee
  */

//Required Imports
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { WebComponents } from '../../../lib/webComponents';

//Initialize Web Component class
const webComponents = new WebComponents();

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

const loginCompanyId = testData.ManagePayroll.SIT.loginCompanyId;
const loginUserId = testData.ManagePayroll.SIT.loginUserIdHKMP;
const fromAccount = testData.AccountTransfer.fromAccount;

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

// Actions for beforeEach and afterEach test hooks
test.describe('SG_AccountTransfer (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;

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
    if (testInfo.status !== 'passed') {
      console.warn(`[cleanup] Skipping cleanup because test status is ${testInfo.status}`);
      return;
    }
  });

  //TC01_SG_AccountTransfer
  test('TC01_SG_AccountTransfer - Create an ACT Payment with new Payee', async ({ page }) => {

    // Step 1: Navigate Payment & Transfer Menu.
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Handle Authentication Pop-up.
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE));

    // Step 3: Wait for Transfer Center to load after auth.
    await pages.AccountTransferPage.waitForTransferCenterReady();

    // Step 4: Click "Make a Payment" (Account Transfer).
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.makePayment);
    await pages.AccountTransferPage.waitForAccountFormReady();

    // Step 5: Select "From Account" dropdown.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Enter Amount.
    await webComponents.enterTextarea(pages.AccountTransferPage.amount, testData.AccountTransfer.amountA1);

    // Step 6: Click "New Payee" tab.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.newPayeeTab);

    // Step 7: Click Continue button (cognitive continue).
    await webComponents.javaScriptsClick(pages.AccountTransferPage.continueBtn);

    // Step 8: Select Country.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.Country);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.AccountTransfer.Country);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 9: Enter New Payee Name.
    await webComponents.enterTextarea(pages.AccountTransferPage.newPayeeName, testData.AccountTransfer.newPayeeName);

    // Step 10: Enter New Payee Address Lines (UI has Address line 1, 2, and Postal code — no line 3).
    await webComponents.enterTextarea(pages.AccountTransferPage.newPayeeAdd1, testData.AccountTransfer.newPayeeAdd1);
    await webComponents.enterTextarea(pages.AccountTransferPage.newPayeeAdd2, testData.AccountTransfer.newPayeeAdd2);

    // Step 11: Select Payee Bank — "DBS Bank SINGAPORE" (DBS radio option).
    // LOCATOR MISMATCH: payeeBankRadio uses ShuRu[@name="bankType-DBS"] but UI has hidden radio + visible label.
    // Using working locator: label text click via getByText
    await page.getByText('DBS Bank SINGAPORE', { exact: true }).click();

    // Step 12: Enter Payee Account Number.
    await webComponents.enterTextarea(pages.AccountTransferPage.newPayeeAcctNumber, testData.AccountTransfer.newPayeeAcctNumber);

    // Step 13: Enter Payment Details.
    await webComponents.enterTextarea(pages.AccountTransferPage.paymentDetail, testData.AccountTransfer.paymentDetail);

    // Step 14: Click "Advise payee via email" checkbox (isBeneAdvising).
    await webComponents.javaScriptsClick(pages.AccountTransferPage.isBeneAdvising);

    // Step 15: Enter Email IDs (5 email addresses).
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId0, testData.AccountTransfer.emailIdO);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId1, testData.AccountTransfer.emailId1);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId2, testData.AccountTransfer.emailId2);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId3, testData.AccountTransfer.emailId3);
    await webComponents.enterTextarea(pages.AccountTransferPage.emailId4, testData.AccountTransfer.emailId4);

    // Step 16: Enter Email Message.
    await webComponents.enterTextarea(pages.AccountTransferPage.message, testData.AccountTransfer.message);

    // Step 17: Click "Include message to approver" checkbox (isTransactionNote).
    await webComponents.javaScriptsClick(pages.AccountTransferPage.isTransactionNote);

    // Step 18: Enter Transaction Note.
    await webComponents.enterTextarea(pages.AccountTransferPage.transactionNote, testData.AccountTransfer.transactionNote);

    // Step 19: Click Next button.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.nextButton);
    await pages.AccountTransferPage.waitForPreviewPage();

    // Step 20: Click Submit button.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.submitButton);
    await pages.AccountTransferPage.waitForSubmittedPage();

    // Step 21: Get reference ID from the submitted page info banner.
    const infoBannerLocator = page.locator('xpath=//dbs-top-panel/div/div[starts-with(@class, "alert alert-info")]/ul');
    const bannerText = await webComponents.getTextFromElement(infoBannerLocator);
    const reference = await webComponents.getReferenceID(bannerText);
    console.log('Captured banner text:', bannerText);
    console.log('Captured referenceID:', reference);

    // Step 22: Click Finish button — navigate back to Transfer Center.
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.finishedButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();

    // Step 23: Search Reference No and Open in Transfer Center.
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.AccountTransferPage.waitForViewPage();

    // Step 24: Validate all fields on the View Payment page (checkViewPageAllField).
    // 24a: From Account
    await expect(pages.AccountTransferPage.fromAccountValue).toContainText(fromAccount);

    // 24b: Amount
    await expect(pages.AccountTransferPage.amountValue).toContainText(testData.AccountTransfer.amountA1);

    // 24c: New Payee Name
    await expect(pages.AccountTransferPage.toNewPayeeNameValue).toContainText(testData.AccountTransfer.newPayeeName);

    // 24d: Status = Pending Approval
    await expect(pages.AccountTransferPage.actStatusValue).toContainText(testData.status.PendingApproval);

    // 24e: Hash Value (not empty)
    await expect(pages.AccountTransferPage.hashValue).not.toBeEmpty();

    // 24f: Reference Value
    await expect(pages.AccountTransferPage.referenceValue).toContainText(reference);

    // 24g: Deduct Amount (not empty)
    await expect(pages.AccountTransferPage.deductAmountValue).not.toBeEmpty();

    // 24h: Payment Date (not empty)
    await expect(pages.AccountTransferPage.paymentDateValue).not.toBeEmpty();

    // 24i: Balance (not empty)
    await expect(pages.AccountTransferPage.balanceValue).not.toBeEmpty();

    // 24j: Payee Info — Account Number and Addresses
    await expect(pages.AccountTransferPage.payeeInfo).toContainText(testData.AccountTransfer.newPayeeAcctNumber);
    await expect(pages.AccountTransferPage.payeeInfo).toContainText(testData.AccountTransfer.newPayeeAdd1);
    await expect(pages.AccountTransferPage.payeeInfo).toContainText(testData.AccountTransfer.newPayeeAdd2);

    // 24k: Payment Type
    await expect(pages.AccountTransferPage.paymentType).toContainText(testData.AccountTransfer.paymentType);

    // 24l: Payment Detail
    await expect(pages.AccountTransferPage.paymentDetailValue).toContainText(testData.AccountTransfer.paymentDetail);

    // 24m: Message
    await expect(pages.AccountTransferPage.messageValue).toContainText(testData.AccountTransfer.message);

    // 24n: Email List (all 5 emails)
    await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailIdO);
    await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId1);
    await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId2);
    await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId3);
    await expect(pages.AccountTransferPage.emailList).toContainText(testData.AccountTransfer.emailId4);

    // 24o: Total Deduct Value
    await expect(pages.AccountTransferPage.totalDeductValue).toContainText(testData.AccountTransfer.amountA1);

    // 24p: Message to Approver (Transaction Note)
    await expect(pages.AccountTransferPage.messageToApproverValue).toContainText(testData.AccountTransfer.transactionNote);

    // 24q: Next Approver (not empty)
    await expect(pages.AccountTransferPage.nextApprover).not.toBeEmpty();

    // 24r: Activity Log — should contain "Create"
    await expect(pages.AccountTransferPage.activityLog).toContainText('Create');

  });

});
