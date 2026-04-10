
/**
  * Author: LC5764724 / Chetan Chavan
  * Created Date: 31/03/26
  * Class path "tests/PayTransfer/SG_BulkPayment.spec.ts"
  * Description: This Specification contains the test cases related Singapore Payroll Payment.
  * 1) TC001_SGBulkPayment - Create a Bulk Payment with new payee
  * 2) TC002_SGBulkPayment - Create Bulk Payment with Apprve now M Challenge flow
  * 3) TC003_SGBulkPayment - Create Bulk Payment with save as template
  * 4) TC004_SGBulkPayment - Create Bulk Payment from existing template
  * 5) TC005_SGBulkPayment - Create Bulk Payment with save as draft and verify in transfer center
  * 6) TC006_SGBulkPayment - Verify creation of a Bulk Payment from copy reference in transfer center
  * 7) TC007_SGBulkPayment - Verify creation of a Bulk Payment from edit reference
  * 8) TC008_SGBulkPayment - Verify rejection of a Bulk Payment from transfer center
  * 
  *   */
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { PaymentsPages, ApprovalsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { WebComponents } from '../../../lib/webComponents';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';
import { ref } from 'node:process';

let customBrowser: Browser;

const loginCompanyId = testData.BulkPayment.SIT.loginCompanyId;
const loginUserId    = testData.BulkPayment.SIT.loginUserId;
const fromAccount    = testData.BulkPayment.SIT.fromAccount;
const payeeBankID    = testData.BulkPayment.payeeBankID;

let _ApprovalsPages: ApprovalsPages;
const webComponents = new WebComponents();

//let [copyReference, editReference, rejectReference] = ['', '', ''];

const refs = {
  copyReference: '',
  editReference: '',
  rejectReference: '',
  approvalReference: '',
}

let templateName = '';

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe.serial('SG_BulkPayment (Create Payments)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
   

  test.beforeEach(async ({ page }, testInfo) => {
    _ApprovalsPages = new ApprovalsPages(page);
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
      await pages.BulkPaymentPage.deletePayeeByFilter(key, /* confirm */ true);
      console.log(`[cleanup] Deleted payee with key: ${key}`);
    } catch (err) {
      console.warn('[cleanup] Failed to delete a payee:', err);
    }
  }
  });

  test('TC001_BulkPayment - Create Bulk Payment with new payee', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    //Step 3: Click on Bulk Payment icon
    try {
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
        } catch {
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.secondDot);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.bulkPayment);
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
        }
      
    // Step 4: Select From account
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Reusable helper for add new payee
    const { name, accountNumber }  = await pages.BulkPaymentPage.addNewPayeeSGBulkPayment({
      name: testData.BulkPayment.newPayeeName,
      nickName: testData.BulkPayment.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.BulkPayment.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Step 5: Enter Amount
    await webComponents.enterText(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);
    await webComponents.enterText(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Step 6: Next → Preview → Submit
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 7: Capture reference
    refs.copyReference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(refs.copyReference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);
    
    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
  });

  test('TC002_BulkPayment - Create Bulk Payment for existing payee with Approve now M-Challenge', async ({ page }) => {
    
   // Step 1: Click on Pay & Transfer menu
   await webComponents.waitForUXLoading([], page);
   await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
   await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

   // Step 2: Authentication Pop-up
   await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

   //Step 3: Click on Bulk Payment icon
   try {
       await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
       await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
       } catch {
       await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.secondDot);
       await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.bulkPayment);
       await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
       await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
       }
     
   // Step 4: Select From account
   await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
   await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
   await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
   await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Select Existing Payee
    await pages.BulkPaymentPage.addExistingPayee(testData.BulkPayment.existingPayee);

    // Step 6: Enter Amount
    await webComponents.enterText(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);
    await webComponents.enterText(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Step 7: Next → Preview 
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);

    //Step 8: Handle Approve now M-Challenge if it appears
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.approveNowCheckBox);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.pushOption);
    await webComponents.enterText(pages.BulkPaymentPage.challengeResponse, '12312312');
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 9: Capture reference
    refs.approvalReference = await pages.BulkPaymentPage.getReferenceID();

    // Step 10: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(refs.approvalReference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);

    // Step 11: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText('Approved');
  });

  test('TC003_BulkPayment - Create Bulk Payment with save as template', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    //Step 3: Click on Bulk Payment icon
    try {
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
        } catch {
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.secondDot);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.bulkPayment);
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
        }
      
    // Step 4: Select From account
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Select Existing Payee
    await pages.BulkPaymentPage.addExistingPayee(testData.BulkPayment.existingPayee);

    // Step 5: Enter Amount
    await webComponents.enterText(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);
    await webComponents.enterText(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
    
    // Step 6: Next → Preview 
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);

    // Step 7: Save as template
    templateName = `PayrollTemplate${Date.now()}`;
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.saveAsTemplateCheckbox);
    await webComponents.enterText(pages.BulkPaymentPage.templateName, templateName);
    
    //Step 8: Submit Payment
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 9: Capture reference
    refs.editReference = await pages.BulkPaymentPage.getReferenceID();
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.finishedButton);
    
    // Step 10: Search and open reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(refs.editReference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);

    // Step 11: Verify account and amount details in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.cancelButton);

    // Step 12: Navigate to template menu and verify newly created template
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.enterTextarea(pages.PaymentTemplatesPage.manageTemplateFilter, templateName);
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateNameLink);
    await webComponents.waitForUXLoading([], page);

    // Step 13: Verify Templte details  
    await expect(pages.BulkPaymentPage.viewTemplateName).toContainText(templateName);
    await expect(pages.BulkPaymentPage.viewTemplateFromAccount).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.viewTemplateAmount).toContainText(testData.BulkPayment.amountA1);
    await expect(pages.BulkPaymentPage.payeeNameValue).toContainText(testData.BulkPayment.existingPayee);

  });

  test('TC004_BulkPayment - Create Bulk Payment from existing template', async ({ page }) => {
    
     // Step 1: Click on Pay & Transfer menu
     await webComponents.waitForUXLoading([], page);
     await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
     await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
 
     // Step 2: Authentication Pop-up
     await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
   
     // Step 3: Navigate to template menu and verify newly created template
     await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.templateMenu);
     await webComponents.waitForUXLoading([], page);
     await webComponents.enterTextarea(pages.PaymentTemplatesPage.manageTemplateFilter, testData.BulkPayment.existingTemplate);

    // Step 4: Click on Make a Payment
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.makeAPaymentLink);
    await webComponents.waitForUXLoading([], page);

    // Step 5: Update the amount
    await webComponents.enterTextarea(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA2);

    // Step 6: Next → Preview → Submit
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 6: Capture reference
    refs.rejectReference = await pages.BulkPaymentPage.getReferenceID();
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.finishedButton);

    // Step 7: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(refs.rejectReference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);

    // Step 8: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA2);
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText('Pending');
  });

  test('TC005_BulkPayment - Create Bulk Payment with save as draft', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    //Step 3: Click on Bulk Payment icon
    try {
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
        } catch {
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.secondDot);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.bulkPayment);
        await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);
        await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccount);
        }
      
    // Step 4: Select From account
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');

    // Step 5: Select Existing Payee
    await pages.BulkPaymentPage.addExistingPayee(testData.BulkPayment.existingPayee);

      // Step 5: Enter Amount
    await webComponents.enterText(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);
    await webComponents.enterText(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
    
    // Step 6: Save as draft and capture draft reference
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.saveAsDraft);
    let paymentReference = await pages.PaymentTemplatesPage.getTemplateReferenceId()
    await webComponents.clickWhenVisibleAndEnabled(pages.PaymentTemplatesPage.dimissButton);

    // Step 7: Search and open reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);

    // Step 11: Verify account and amount details in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
    await expect(pages.BulkPaymentPage.payeeNameValue).toContainText(testData.BulkPayment.existingPayee);
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText(testData.status.Saved);
  });

  test('TC006_BulkPayment - Create Bulk Payment from copy reference', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    //Step 3: Search for any existing Bulk Payment reference
    if (refs.copyReference && refs.copyReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(refs.copyReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch('SG - Bulk payment',
        testData.status.PendingApproval);
    }

    //Step 4: Click Copy  
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.copyButton);
      
    // Step 5: Enter new amount
    await webComponents.enterText(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA2);

    // Step 6: Next → Preview → Submit
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 7: Capture reference
    const reference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);

    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA2);
  });

  test('TC007_BulkPayment - Edit Bulk Payment from existing reference', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    //Step 3: Search for any existing Bulk Payment reference
    if (refs.editReference && refs.editReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(refs.editReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch('SG - Bulk payment',
        testData.status.PendingApproval);
    }

    //Step 4: Click Edit  
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.editButton);
      
    // Step 5: Enter new amount
    await webComponents.enterText(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA2);
    await webComponents.enterText(pages.BulkPaymentPage.batchId, '');

    // Step 6: Next → Preview → Submit
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.submitButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.finishedButton);

    // Step 7: Capture reference
    const reference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);

    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA2);
  });

  test('TC008_BulkPayment - Reject Bulk Payment from transfer center', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await webComponents.waitForUXLoading([], page);
    await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    //Step 3: Search for any existing Bulk Payment reference
    if (refs.rejectReference && refs.rejectReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(refs.rejectReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch('SG - Bulk payment',
        testData.status.PendingApproval);
    }

    //Step 4: Click Reject  
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.rejectButton);
    await webComponents.enterText(pages.BulkPaymentPage.reasonForRejection, testData.BulkPayment.rejectReason);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.rejectDialogButton);

    // Step 5: Copy Reject reference
    const reference = await pages.BulkPaymentPage.getRejectReferenceId();
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.dismissButton);

    // Step 6: Verify reference in transfer center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await webComponents.waitElementToBeVisible(pages.BulkPaymentPage.fromAccountViewLabel);

    // Step 7: Verify payment status should be rejected
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText(testData.status.Rejected);
  });

});

