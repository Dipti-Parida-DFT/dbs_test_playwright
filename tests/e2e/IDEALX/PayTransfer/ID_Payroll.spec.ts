// tests/ID_Payroll.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages, ApprovalsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { OperationsPages } from '../../../pages/SAM';
import moment from "moment";


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
let _ApprovalsPages: ApprovalsPages;
let _OperationsPages: OperationsPages;
let reference = "";
let reference1 = "";
let approvalReference = '';

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('ID_Payroll (Create Payments)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
   

  test.beforeEach(async ({ page }, testInfo) => {
    _ApprovalsPages = new ApprovalsPages(page);
    _OperationsPages = new OperationsPages(page);
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(TIMEOUT.MAX);
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
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    // Step 3: Click on VN Payroll icon
    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
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
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.moreThanMaxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 6: Validate Inline error
    await expect(pages.PayrollPage.amountInlineError).toContainText(testData.Payroll.amountErrorTip);

    // Step 7: Next → Validate banner error
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
        
    const globalError = page.locator([
      '.alert.alert-error',
      '.error', '.error-message', '.form-error',
      '.toast', '.toast-error',          // generic toasts
      '.alert', '.alert-danger',         // Bootstrap-like
      '.ant-message', '.ant-message-error', '.ant-notification-notice', // Ant Design
      '.MuiAlert-root',                  // Material UI
      '.invalid-feedback'                // Common form feedback
    ].join(', ')
    , {
      hasText: testData.Payroll.errorMessage
    }
    );

    await expect(globalError).toBeVisible({ timeout: TIMEOUT.LONG });
    await expect(globalError).toContainText(testData.Payroll.errorMessage);
    
  });

  test('TC002_IDPayroll - Create Payroll with item amount equal to 1000000000 IDR', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    // Step 3: Click on VN Payroll icon
    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

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
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 6: Next → Preview → Submit
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // Step 7: Capture reference
    const referenceText = await pages.PayrollPage.getReferenceText();
    const reference = await pages.PayrollPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.PayrollPage.waitForViewPaymentPageReady();

    // Step 9: Verify from account in view payment page
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.PayrollPage.amountViewLabel).toContainText(testData.Payroll.maxAmount);
  });

  test('TC003_IDPayroll - Create payroll with Total amount > 1000000000 IDR', async ({ page }) => {
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    // Step 3: Click on VN Payroll icon
    await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await pages.PayrollPage.waitForPayrollFormReady();

    // Step 4: Select From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

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
    await pages.PayrollPage.safeFill(pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.safeFill(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Step 6: Add an existing payee to exceed total
    await pages.PayrollPage.safeClick(pages.PayrollPage.existingPayeeTabHeader);
    await pages.PayrollPage.safeFill(pages.PayrollPage.existingPayeeFilter, testData.Payroll.payrollExistingPayee);
    await pages.PayrollPage.safeClick(pages.PayrollPage.addExistingPayeeButton);

     // Step 7: Enter Amount = max for second item + details
    await pages.PayrollPage.amount.first().fill(testData.Payroll.maxAmountIx);
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);
    await pages.PayrollPage.paymentDetailsTextarea.first().fill(testData.Payroll.paymentDetails);

    // Step 8: Next → Preview → Submit
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    //Step 9: Capture reference
    //const referenceText = await pages.PayrollPage.getReferenceText();
    reference = await pages.PayrollPage.getReferenceID();

    // Step 10: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.PayrollPage.waitForViewPaymentPageReady();
    
    // Step 11: Verify from account in view payment page
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(fromAccount);
  });

});

test.describe('ID_Payroll (Approve and Release Payment)', () => {
  let pages: PaymentsPages;

  test.beforeEach(async ({ context, page }, testInfo) => {
    _ApprovalsPages = new ApprovalsPages(page);
    _OperationsPages = new OperationsPages(page);
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    pages = new PaymentsPages(page);

    await context.clearCookies();
    await context.clearPermissions();
    await customBrowser.newContext({
      serviceWorkers: 'block' as any, // TS workaround
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    
  });

  test('TC004_IDPayroll - Approve payroll after cutoff time via My Approval', async ({page}) => {
    test.setTimeout(TIMEOUT.MAX);
    const loginPage = new LoginPage(page); 
    
    //Step 1: Login as SAM Admin 1 and set today as a holiday (empty cutoff)
    await loginPage.gotoSAM();
    await loginPage.loginSAM(testDataSAM.loginSAMID.ASADM2);

    // Set today as holiday by setting empty cutoff time for DBSID schedule
    await _OperationsPages.schedulesPage.editCutOffTime(
      testDataSAM.selectAffiliateByValue.DBSID,
      pages.PayrollPage.IDPayrollScheduleLink,
      day,
      '' // holiday = no cutoff time
    );
    
    await loginPage.SAMLogoutButton.click();
    
    // Step 2: Login as SAM Admin 2 and approve the schedule
    await loginPage.gotoSAM();
    await loginPage.loginSAM(testDataSAM.loginSAMID.ASADM1);
    
    await _OperationsPages.schedulesPage.approveCutOffTime(
      testDataSAM.selectAffiliateByValue.DBSID,
      pages.PayrollPage.pendingModifyApprovalLink
    );

    await loginPage.SAMLogoutButton.click(); 
    
    // Step 3: Login to IDEALX (Maker already created payroll earlier)
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, (String(CONSTANTS.PIN)));
  
    // Step 2: Open Approval Page
    await _ApprovalsPages.ApprovalPage.safeClick(_ApprovalsPages.ApprovalPage.approvalMenu);
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE));
    await _ApprovalsPages.ApprovalPage.waitForApprovalPageReady();
  
    // Step 3: Filter by reference (if available)
    if (reference.trim().length > 0) {
      await _ApprovalsPages.ApprovalPage.safeFill(_ApprovalsPages.ApprovalPage.byTransactionFilter, reference);
    } else {
      await _ApprovalsPages.ApprovalPage.safeClick(_ApprovalsPages.ApprovalPage.showAdditionalFilter);
      await _ApprovalsPages.ApprovalPage.safeFill(_ApprovalsPages.ApprovalPage.paymentTypeListInput, 'ID - Payroll');
      await _ApprovalsPages.ApprovalPage.safeClick(_ApprovalsPages.ApprovalPage.IDPayrollOption);     
      await _ApprovalsPages.ApprovalPage.safeClick(_ApprovalsPages.ApprovalPage.searchButton);
      await _ApprovalsPages.ApprovalPage.transactionReferenceLink.isVisible({ timeout: 30000 });
    }
  
    // Step 4: Capture reference from approval list and open the transaction
    reference1 = (await _ApprovalsPages.ApprovalPage.transactionReferenceLink.textContent())?.trim() ?? '';
    await _ApprovalsPages.ApprovalPage.safeFill(_ApprovalsPages.ApprovalPage.byTransactionFilter, reference1);
  
    // Step 5: Approve transaction
    await _ApprovalsPages.ApprovalPage.safeClick(_ApprovalsPages.ApprovalPage.transactionReferenceLink);
    await _ApprovalsPages.ApprovalPage.safeClick(_ApprovalsPages.ApprovalPage.approveButton);
    
    // Step 6: Handle challenge (OTP)
    await pages.PayrollPage.safeClick(pages.PayrollPage.pushApprovalOption);
    await pages.PayrollPage.safeClick(pages.PayrollPage.getChallengeSMSButton);
    await pages.PayrollPage.safeFill(pages.PayrollPage.challengeResponse, '12312312');
    await pages.PayrollPage.safeClick(pages.PayrollPage.approveButton.nth(1));
    await _ApprovalsPages.ApprovalPage.safeClick(_ApprovalsPages.ApprovalPage.approveDismissButton);
  
    // Step 7: Verify transaction in Transfer Center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference1);
  
    // Step 8: Verify transaction status is Approved/Received/Completed/Bank Rejected
    await expect(
      pages.PayrollPage.paymentDate).not.toContainText(currentDate);
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
    await _ApprovalsPages.ApprovalPage.safeClick(
      _ApprovalsPages.ApprovalPage.approvalMenu
    );
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE));
    await _ApprovalsPages.ApprovalPage.waitForApprovalPageReady();
  
    /**
     * Step 3: Release payroll transaction and capture reference
     */
    approvalReference =
      await _ApprovalsPages.MyVerificationAndReleasePage.releaseSingleTransaction(
        reference,
        reference1,
        'ID - Payroll'
      );
  
    /**
     * Step 4: Verify transaction in Transfer Center
     */
    await pages.AccountTransferPage.safeClick(
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
  
  });

});