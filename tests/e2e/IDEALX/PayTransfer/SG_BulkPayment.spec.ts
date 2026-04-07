
// tests/SG_BulkPayment.spec.ts
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

let customBrowser: Browser;

const loginCompanyId = testData.BulkPayment.SIT.loginCompanyId;
const loginUserId    = testData.BulkPayment.SIT.loginUserId;
const fromAccount    = testData.BulkPayment.SIT.fromAccount;
const payeeBankID    = testData.BulkPayment.payeeBankID;

let _ApprovalsPages: ApprovalsPages;
const webComponents = new WebComponents();

let [copyReference, editReference, rejectReference] = ['', '', ''];
let approvalReference = '';
let templateName = '';

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_BulkPayment (Create Payments)', () => {
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
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Click on Bulk Payment icon
    try {
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        } catch {
        // Fallback: move to the next page/slide, then click
        await pages.BulkPaymentPage.secondDot.click();
        await pages.BulkPaymentPage.bulkPayment.waitFor({ state: 'visible', timeout: 5000 });
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        }
      
    // Step 4: Select From account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

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
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Step 6: Next → Preview → Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Step 7: Capture reference
    copyReference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(copyReference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
  });

  test('TC002_BulkPayment - Create Bulk Payment for existing payee with Approve now M-Challenge', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Click on Bulk Payment icon
    try {
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        } catch {
        // Fallback: move to the next page/slide, then click
        await pages.BulkPaymentPage.secondDot.click();
        await pages.BulkPaymentPage.bulkPayment.waitFor({ state: 'visible', timeout: 5000 });
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        }
      
    // Step 4: Select From account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Step 5: Select Existing Payee
    await pages.BulkPaymentPage.addExistingPayee(testData.BulkPayment.existingPayee);

      // Step 5: Enter Amount
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
    
    // Step 6: Next → Preview → Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();

    //Step 7: Handle Approve now M-Challenge if it appears
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.approveNowCheckBox);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.pushOption);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.challengeResponse, '12312312');
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Step 7: Capture reference
    approvalReference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(approvalReference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText('Approved');
  });

  test('TC003_BulkPayment - Create Bulk Payment with save as template', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Click on Bulk Payment icon
    try {
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        } catch {
        // Fallback: move to the next page/slide, then click
        await pages.BulkPaymentPage.secondDot.click();
        await pages.BulkPaymentPage.bulkPayment.waitFor({ state: 'visible', timeout: 5000 });
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        }
      
    // Step 4: Select From account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Step 5: Select Existing Payee
    await pages.BulkPaymentPage.addExistingPayee(testData.BulkPayment.existingPayee);

    // Step 5: Enter Amount
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
    
    // Step 6: Next → Preview 
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();

    // Step 7: Save as template
    templateName = `PayrollTemplate${Date.now()}`;
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.saveAsTemplateCheckbox);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.templateName, templateName);
    
    //Step 8: Submit Payment
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Step 9: Capture reference
    editReference = await pages.BulkPaymentPage.getReferenceID();
    await pages.BulkPaymentPage.finishedButton.click();

    // Step 10: Search and open reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(editReference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 11: Verify account and amount details in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
    await pages.BulkPaymentPage.cancelButton.click();

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
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))
    
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
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Step 6: Capture reference
    rejectReference = await pages.BulkPaymentPage.getReferenceID();
    await pages.BulkPaymentPage.finishedButton.click();

    // Step 7: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(rejectReference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 8: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA2);
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText('Pending');
  });

  test('TC005_BulkPayment - Create Bulk Payment with save as draft', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Click on Bulk Payment icon
    try {
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        } catch {
        // Fallback: move to the next page/slide, then click
        await pages.BulkPaymentPage.secondDot.click();
        await pages.BulkPaymentPage.bulkPayment.waitFor({ state: 'visible', timeout: 5000 });
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        }
      
    // Step 4: Select From account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Step 5: Select Existing Payee
    await pages.BulkPaymentPage.addExistingPayee(testData.BulkPayment.existingPayee);

      // Step 5: Enter Amount
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
    
    // Step 6: Save as draft and capture draft reference
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.saveAsDraft);
    let paymentReference = await pages.PaymentTemplatesPage.getTemplateReferenceId()
    await pages.PaymentTemplatesPage.dimissButton.click();

    // Step 7: Search and open reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(paymentReference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 11: Verify account and amount details in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
    await expect(pages.BulkPaymentPage.payeeNameValue).toContainText(testData.BulkPayment.existingPayee);
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText(testData.status.Saved);
  });

  test('TC006_BulkPayment - Create Bulk Payment from copy reference', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Search for any existing Bulk Payment reference
    if (copyReference && copyReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(copyReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch('SG - Bulk payment',
        testData.status.PendingApproval);
    }

    //Step 4: Click Copy  
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();
    await pages.BulkPaymentPage.copyButton.click();
      
    // Step 5: Enter new amount
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA2);

    // Step 6: Next → Preview → Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Step 7: Capture reference
    const reference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA2);
  });

  test('TC007_BulkPayment - Edit Bulk Payment from existing reference', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Search for any existing Bulk Payment reference
    if (editReference && editReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(editReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch('SG - Bulk payment',
        testData.status.PendingApproval);
    }

    //Step 4: Click Copy  
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();
    await pages.BulkPaymentPage.editButton.click();
      
    // Step 5: Enter new amount
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA2);

    // Step 6: Next → Preview → Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Step 7: Capture reference
    const reference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA2);
  });

  test('TC008_BulkPayment - Reject Bulk Payment from transfer center', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Search for any existing Bulk Payment reference
    if (rejectReference && rejectReference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(rejectReference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch('SG - Bulk payment',
        testData.status.PendingApproval);
    }

    //Step 4: Click Reject  
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();
    await pages.BulkPaymentPage.rejectButton.click();
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.reasonForRejection, testData.BulkPayment.rejectReason);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.rejectDialogButton);

    // Step 5: Copy Reject reference
    const reference = await pages.BulkPaymentPage.getRejectReferenceId();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.dismissButton);

    // Step 6: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 7: Verify payment status should be rejected
    await expect(pages.BulkPaymentPage.transactionStatusValue).toContainText(testData.status.Rejected);
  });

});

