/**
  * Author: LC5764724 / Chetan Chavan
  * Created Date: 13/04/26
  * Class path "tests/PayTransfer/ID_Payroll.spec.ts"
  * Description: This Specification contains the test cases related Indonesia Payroll Payment.
  * 1) TC001_IDPayroll - Cannot create Payroll with item amount > 1000000000 IDR
  * 2) TC002_IDPayroll - Create Payroll with item amount equal to 1000000000 IDR
  * 3) TC003_IDPayroll - Create payroll with Total amount > 1000000000 IDR
  * 4) TC004_IDPayroll - Approve payroll after cutoff time via My Approval
  * 5) TC005_IDPayroll - Release payroll payment via My Release
  */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { PaymentsPages, ApprovalsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { SAMLoginPage } from '../../../pages/Navigate/SAMLoginPage';
import { WebComponents } from '../../../lib/webComponents';
import { OperationsPages } from '../../../pages/SAM';
import moment from "moment";
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/ID_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;

const loginCompanyId = testData.Payroll.SIT.loginCompanyId;
const loginUserId    = testData.Payroll.SIT.loginUserId;
const loginUserId2    = testData.Payroll.SIT.loginUserId2;
const fromAccount    = testData.Payroll.SIT.fromAccount;
const payeeBankID    = testData.Payroll.SIT.payeeBankID;

//SAM Login Data
const testDataSAMPath = path.resolve(__dirname, '../../../data/SAM_testData.json');
const testDataSAM = JSON.parse(fs.readFileSync(testDataSAMPath, 'utf-8'));
let day = new Date().getDay();
let currentDate = moment(new Date()).format("DD MMM YYYY");
let approvalsPages: ApprovalsPages;
let operationsPages: OperationsPages;
const webComponents = new WebComponents();
let reference = "";
let reference1 = "";
let approvalReference = '';

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe.serial('ID_Payroll (Create Payments)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
   

  test.beforeEach(async ({ page }, testInfo) => {
    approvalsPages = new ApprovalsPages(page);
    operationsPages = new OperationsPages(page);
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(TIMEOUT.EXTREME);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, (String(CONSTANTS.PIN)));
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
  });

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

  test('TC001_IDPayroll - Cannot create Payroll with item amount > 1000000000 IDR', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    //Step 3: Click on VN Payroll icon
    try {
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.payroll);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);
      } catch {
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.secondDot);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.payroll);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);
      }

    // Step 4: Select From account
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
    
    // Reusable helper for add new payee
    const { name, accountNumber }  = await pages.PayrollPage.addNewPayee({
      name: testData.Payroll.newPayeeName,
      nickName: testData.Payroll.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.Payroll.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Step 5: Enter Amount > max + details
    await webComponents.enterTextarea(pages.PayrollPage.amount, testData.Payroll.moreThanMaxAmountIx);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.showOptionalDetails);
 
    // Step 6: Enter Payment and other optional details 
    await webComponents.enterTextarea(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 7: Validate Inline error
    await webComponents.compareUIVsJsonValue(pages.PayrollPage.amountInlineError, testData.Payroll.amountErrorTip);

    // Step 7: Next → Validate banner error
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.errorOneOrMorefieldsNotFilled);
    await webComponents.compareUIVsJsonValue(pages.PayrollPage.errorOneOrMorefieldsNotFilled, testData.Payroll.errorMessage);
  });

  test('TC002_IDPayroll - Create Payroll with item amount equal to 1000000000 IDR', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    //Step 3: Click on VN Payroll icon
    try {
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.payroll);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);
      } catch {
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.secondDot);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.payroll);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);
      }

    // Step 4: Select From account
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Reusable helper for add new payee
        const { name, accountNumber }  = await pages.PayrollPage.addNewPayee({
          name: testData.Payroll.newPayeeName,
          nickName: testData.Payroll.newPayeeNickName,
          bankId: payeeBankID,
          accountNumber: testData.Payroll.newPayeeAcctNumber,
        });

      // Register for cleanup
      createdPayees.push({ name, accountNumber });

    // Step 5: Enter Amount = max + details
     await webComponents.enterTextarea(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
     await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.showOptionalDetails);
  
     // Step 6: Enter Payment and other optional details 
     await webComponents.enterTextarea(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 7: Next → Preview → Submit
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);

    // Step 7: Capture reference
    reference = await pages.PayrollPage.getReferenceID();
    await webComponents.waitElementToBeVisible(pages.PayrollPage.finishedButton);

    // Step 8: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);

    // Step 9: Verify from account in view payment page
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.PayrollPage.amountViewLabel).toContainText(testData.Payroll.maxAmount);
  });

  test('TC003_IDPayroll - Create payroll with Total amount > 1000000000 IDR', async ({ page }) => {
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    //Step 3: Click on VN Payroll icon
    try {
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.payroll);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);
      } catch {
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.secondDot);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.payroll);
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.payroll);
      await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccount);
      }

    // Step 4: Select From account
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Reusable helper for add new payee
      const { name, accountNumber }  = await pages.PayrollPage.addNewPayee({
        name: testData.Payroll.newPayeeName,
        nickName: testData.Payroll.newPayeeNickName,
        bankId: payeeBankID,
        accountNumber: testData.Payroll.newPayeeAcctNumber,
      });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Step 5: Enter Amount = max for first item + details
    await webComponents.enterTextarea(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.showOptionalDetails);
  
    // Step 6: Enter Payment and other optional details 
    await webComponents.enterTextarea(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 7: Add an existing payee to exceed total
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.existingPayeeTabHeader);
    await webComponents.enterTextarea(pages.PayrollPage.existingPayeeFilter, testData.Payroll.payrollExistingPayee);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.addExistingPayeeButton);

     // Step 8: Enter Amount = max for second item + details
     await webComponents.enterTextarea(pages.PayrollPage.amount.first(), testData.Payroll.maxAmountIx);
     await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.showOptionalDetails);
     await webComponents.enterTextarea(pages.PayrollPage.paymentDetailsTextarea.first(), testData.Payroll.paymentDetails);

    // Step 9: Next → Preview → Submit
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.submitButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);

    //Step 10: Capture reference
    reference = await pages.PayrollPage.getReferenceID();

    // Step 11: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitElementToBeVisible(pages.PayrollPage.fromAccountViewLabel);
    
    // Step 12: Verify from account in view payment page
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
  });

});

test.describe.serial('ID_Payroll (Approve and Release Payment)', () => {
  let pages: PaymentsPages;

  test.beforeEach(async ({ context, page }, testInfo) => {
    approvalsPages = new ApprovalsPages(page);
    operationsPages = new OperationsPages(page);
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    pages = new PaymentsPages(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    
  });

  test('TC004_IDPayroll - Approve payroll after cutoff time via My Approval', async ({page}) => {
    test.setTimeout(TIMEOUT.EXTREME);
    /**
     * Step 1: Login as SAM Admin 1 and set today as a holiday (empty cutoff)
     */
    const SAMloginPage = new SAMLoginPage(page); 
    await SAMloginPage.gotoSAM();
    await SAMloginPage.loginSAM(testDataSAM.loginSAMID.ASADM1);

    // Set today as holiday by setting empty cutoff time for DBSID schedule
    await operationsPages.schedulesPage.editCutOffTime(
      testDataSAM.selectAffiliateByValue.DBSID,
      pages.PayrollPage.IDPayrollScheduleLink,
      day,
      '' // holiday = no cutoff time
    );
    
    await SAMloginPage.SAMLogoutButton.click();
    /**
     * Step 2: Login as SAM Admin 2 and approve the schedule
     */
    await SAMloginPage.gotoSAM();
    await SAMloginPage.loginSAM(testDataSAM.loginSAMID.ASADM2);
    
    await operationsPages.schedulesPage.approveCutOffTime(
      testDataSAM.selectAffiliateByValue.DBSID,
      pages.PayrollPage.pendingModifyApprovalLink
    );

    await SAMloginPage.SAMLogoutButton.click();
    
    /**
     * Step 3: Login to IDEALX (Maker already created payroll earlier)
     */
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, (String(CONSTANTS.PIN)));
  
    /**
     * Step 4: Open My Approval
     */
    await webComponents.clickWhenVisibleAndEnabled(approvalsPages.ApprovalPage.approvalMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await approvalsPages.ApprovalPage.waitForApprovalPageReady();
  
    /**
     * Step 5: Filter by reference (if available)
     */
    console.log(`TC004 - Captured reference from TC002: ${reference}`);
    if (reference.trim().length > 0) {
      await webComponents.enterTextarea(approvalsPages.ApprovalPage.byTransactionFilter, reference);
    } else {
      await webComponents.clickWhenVisibleAndEnabled(approvalsPages.ApprovalPage.showAdditionalFilter);
      await approvalsPages.ApprovalPage.selectPaymentType('ID - Payroll');
      await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.searchButton);
    }
  
    /**
     * Step 6: Capture reference from approval list
     */
    reference1 = (await approvalsPages.ApprovalPage.transactionReferenceLink.textContent())?.trim() ?? '';
  
    /**
     * Step 7: Approve transaction
     */
    await approvalsPages.ApprovalPage.transactionList.first().click();
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.approveButton);
  
    /**
     * Step 8: Handle challenge (OTP)
     */
   // await pages.PayrollPage.waitForApprovalChallengeReady();
   await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.pushApprovalOption);
   await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.getChallengeSMSButton);
   await webComponents.enterTextarea(pages.PayrollPage.enterResponseTextBox, '12312312');
   await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.approveButton.nth(1));
  
    /**
     * Step 9: Verify transaction in Transfer Center
     */
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference1);
    await expect(pages.PayrollPage.paymentDate).not.toContainText(currentDate);
  });

  test('TC005_IDPayroll - Release payroll payment via My Release', async ({ page }) => {
    test.setTimeout(TIMEOUT.MAX);
    /**
     * Step 1: Login to IDEALX
     */
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, (String(CONSTANTS.PIN))); 
  
    /**
     * Step 2: Open My Approval Page
     */
    await webComponents.clickWhenVisibleAndEnabled(
      approvalsPages.ApprovalPage.approvalMenu
    );
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await approvalsPages.ApprovalPage.waitForApprovalPageReady();
  
    /**
     * Step 3: Release payroll transaction and capture reference
     */
    approvalReference =
      await approvalsPages.MyVerificationAndReleasePage.releaseSingleTransaction(
        reference,
        reference1,
        'ID - Payroll'
      );
  
    /**
     * Step 4: Verify transaction in Transfer Center
     */
    await webComponents.clickWhenVisibleAndEnabled(
      pages.AccountTransferPage.paymentMenu
    );
  
    await pages.TransferCentersPage.searchAndOpenByReference(
      approvalReference
    );
  
    /**
     * Step 5: Assert that status should not be Approved/Received/Completed/Bank Rejected since today is holiday and schedule is not approved yet
    */
    await expect(
      pages.PayrollPage.transactionStatusLabel1
    ).not.toContainText(
      new RegExp(
        `${testData.status.Received}|${testData.status.Completed}|${testData.status.BankRejected}`
      )
    );
  
    await expect(pages.PayrollPage.paymentDate).not.toContainText(currentDate);
    
    /**
     * Step 5: Login as SAM Admin 1 and set today as working day
     */
    
    const SAMloginPage = new SAMLoginPage(page);
    await SAMloginPage.gotoSAM();
    await SAMloginPage.loginSAM(testDataSAM.loginSAMID.ASADM1);
  
    await operationsPages.schedulesPage.editCutOffTime(
      testDataSAM.selectAffiliateByValue.DBSID,
      pages.PayrollPage.IDPayrollScheduleLink,
      day,
      testDataSAM.schedule.CutoffTime01
    );

    /**
     * Step 6: Login as SAM Admin 2 and approve the schedule
     */
    await SAMloginPage.gotoSAM();
    await SAMloginPage.loginSAM(testDataSAM.loginSAMID.ASADM2);
  
    await operationsPages.schedulesPage.approveCutOffTime(
      testDataSAM.selectAffiliateByValue.DBSID,
      pages.PayrollPage.pendingModifyApprovalLink
    );
  });
  
});