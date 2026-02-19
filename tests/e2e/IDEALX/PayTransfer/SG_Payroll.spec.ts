/**
       * Author: LC5741501
       * Created Date: 16/02/26
       * This Class "tests/PayTransfer/SG_Payroll.spec.ts"
       * Description: This class has two test cases.
       * 1) TC001_SGPayroll - Create SG Payroll Alternate with new payee
       * 2) TC002_SGPayroll - Edit Payroll Alternate via Transfer Center
       */

// tests/PayTransfer/SG_Payroll.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';

// create lib => components.ts object
const webComponents = new WebComponents();

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';
import { WebComponents } from '../../../lib/components';

let customBrowser: Browser;

const loginCompanyId = testData.Payroll.SIT.loginCompanyId;
const loginUserId    = testData.Payroll.SIT.loginUserId;
const fromAccount    = testData.Payroll.SIT.fromAccount;
const payeeBankID    = testData.Payroll.SIT.payeeBankID;

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_Payroll (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { nickName?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
   

  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');
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
      const key = p.nickName ?? p.accountNumber ?? '';
      await pages.PayrollPage.deletePayeeByFilter(key, /* confirm */ true);
      console.log(`[cleanup] Deleted payee with key: ${key}`);
    } catch (err) {
      console.warn('[cleanup] Failed to delete a payee:', err);
    }
  }
  });

  test('TC001_SGPayroll - Create Payroll Alternate with new payee', async ({ page }) => {
    // Payments → Transfer Center → Payroll
    // paymentMenu => Pay & Transfer (Left option)
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Authentication Pop-up 
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    //await pages.PayrollPage.safeClick(pages.PayrollPage.payroll);
    await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.PayrollPage.payroll,15_000);
    await pages.PayrollPage.waitForPayrollFormReady();

    // From account
    await pages.PayrollPage.safeClick(pages.PayrollPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('Enter');

    //webComponents.safeClick(pages.PayrollPage.fromAccount);
    //webComponents.keyboardAction(pages.PayrollPage.fromAccount, fromAccount);

    // Reusable helper for add new payee
      const { nickName, accountNumber }  = await pages.PayrollPage.addNewPayeeWithAllDetails({
        name: testData.Payroll.newPayeeName,
        nickName: testData.Payroll.newPayeeNickName,
        bankId: payeeBankID,
        accountNumber: testData.Payroll.newPayeeAcctNumber,
      });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // Amount (SGD) = add Amount
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.amount, testData.Payroll.amount);

    // Reference for payee : add details
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.payeeRef, testData.Payroll.referenceForPayee);

    // Click Show optional details arrow V
    await pages.PayrollPage.safeClick(pages.PayrollPage.showOptionalDetails);

    // Payment details to the payee bank : add details
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);
    
    // Click : "Message to the payee" checkbox
    await pages.PayrollPage.safeClick(pages.PayrollPage.messageToThePayeeCheckBox);
    
    // Enter : Emails 1
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.emailId0, testData.Payroll.emailId0);
    // Enter : Emails 2
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.emailId1, testData.Payroll.emailId1);
    // Enter : Emails 3
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.emailId2, testData.Payroll.emailId2);
    // Enter : Emails 4
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.emailId3, testData.Payroll.emailId3);
    // Enter : Emails 5
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.emailId4, testData.Payroll.emailId4);

    // Enter : Emails Mesage (Textarea)
    await pages.PayrollPage.enterTextarea(pages.PayrollPage.emailMessageTextarea, testData.Payroll.emailMessage);

    // Internal reference : add details
    await pages.PayrollPage.safeFill(pages.PayrollPage.internalReference, testData.Payroll.internalReference);
      
    // Batch ID : add details
    await pages.PayrollPage.safeFill(pages.PayrollPage.batchID, testData.Payroll.batchID);
     
    // Click on Next button
    await pages.PayrollPage.safeClick(pages.PayrollPage.nextButton);
    await pages.PayrollPage.waitForPreviewPageReady();

    // Click on Submit button
    await pages.PayrollPage.safeClick(pages.PayrollPage.submitButton);
    await pages.PayrollPage.waitForSubmittedPageReady();

    // If you just want the full banner text:
    const referenceText = await pages.PayrollPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    const reference = await pages.PayrollPage.getReferenceID();
    console.log('Captured referenceID:', reference);
    
    // Find it again in Transfer Center by reference
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(testData.Payroll.internalReference);
    await pages.PayrollPage.waitForViewPaymentPageReady();

    // Assertions
    // 1) Hash value : Auto generated hence checking only value lable is visible or not
    await expect(pages.PayrollPage.hashValueLabel).toBeVisible;
    
    // 2) From : Validate UI Vs Json
    await expect(pages.PayrollPage.fromAccountViewLabel).toContainText(testData.Payroll.fromAccount1);
    await expect(pages.PayrollPage.fromAccountViewLabel2).toContainText(testData.Payroll.fromAccount2);
    
    // 3) Payment Type : Validate UI Vs Json
    await expect(pages.PayrollPage.paymentType).toContainText(testData.Payroll.paymentType);

     // 4) Your account will be deducted : 
     await expect(pages.PayrollPage.paymentDate).toBeVisible;

    // 5) Internal reference : Validate UI Vs Json
    await expect(pages.PayrollPage.referenceLabel).toContainText(testData.Payroll.internalReference);
    
    // 6) Batch ID : Validate UI Vs Json
     await expect(pages.PayrollPage.batchIdLabel).toContainText(testData.Payroll.batchID);

    // 7) Your account will be deducted : 
    await expect(pages.PayrollPage.viewPayrollFilter).toBeVisible;
    
    // 8) Payment summary : Validate UI Vs Json (Payment summary Label)
    await expect(pages.PayrollPage.paymentSummaryLabel).toContainText(testData.Payroll.paymentSummaryLabel);

    // 9) Total Payees Label : Validate UI Vs Json
    await expect(pages.PayrollPage.totalPayeesLabel).toContainText(testData.Payroll.totalPayeesLabel);
    
    // 10) Total Payees Value : Validate UI Vs Json
    await expect(pages.PayrollPage.totalPayeesValue).toContainText(testData.Payroll.totalPayeesLabelValue);
    
    // 11) Total Amount Label : Validate UI Vs Json
    await expect(pages.PayrollPage.totalAmountLabel).toContainText(testData.Payroll.totalAmountLabel);

    // 12) Total Amount Value : Validate UI Vs Json
    await expect(pages.PayrollPage.totalAmountValue).toContainText(testData.Payroll.totalAmountLabelValue);

    // 13) Payee/Nickname : Validate (Payee Name) UI Vs Json
    await expect(pages.PayrollPage.payeeNameLabel1Value).toContainText(testData.Payroll.newPayeeName);

    // 14) Payee/Nickname : Validate (Nickname) UI Vs Json
    await expect(pages.PayrollPage.payeeNicknameLabelValue).toContainText(testData.Payroll.newPayeeNickName);

    // 15) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
    await expect(pages.PayrollPage.bankNameLabel1Value).toContainText(testData.Payroll.bankNameValue);

    // 16) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
    await expect(pages.PayrollPage.bankSwiftBicLabel1).toContainText(testData.Payroll.bankSwiftBicValue);

    // 17) Account number: Validate UI Vs Json
    await expect(pages.PayrollPage.accountNumberLabel1).toContainText(testData.Payroll.newPayeeAcctNumber);

    // 18) Status (PendingApproval) : Validate UI Vs Json
    await expect(pages.PayrollPage.status).toContainText(testData.status.PendingApproval);
    
    // 19) Amount (SGD): Validate UI Vs Json
    await expect(pages.PayrollPage.amountFirstLabel).toContainText(testData.Payroll.amount);

    // 20) Purpose Code (SALA - Salary Payment) : Validate UI Vs Json
    await expect(pages.PayrollPage.purposeCodeLabel1).toContainText(testData.Payroll.purposeCode);

    // 21) Reference for payee (optional): Validate UI Vs Json
    await expect(pages.PayrollPage.referenceForPayeeLabel1).toContainText(testData.Payroll.referenceForPayee);

    // 22) Reference for payee (optional): Validate UI Vs Json
    await expect(pages.PayrollPage.referenceForPayeeLabel1).toContainText(testData.Payroll.referenceForPayee);
    
    // Click : showOptionalViewButton1
    await pages.AccountTransferPage.safeClick(pages.PayrollPage.showOptionalViewButton1);

    // 23) Message to payee (optional): Validate UI Vs Json
    await expect(pages.PayrollPage.messageLabel1).toContainText(testData.Payroll.emailMessage);
    
    // 24)Emails 1 to 5 : Validate UI Vs Json
    await expect(pages.PayrollPage.emailListLabel1Value).toContainText(testData.Payroll.emailId0);
    await expect(pages.PayrollPage.emailListLabel2Value).toContainText(testData.Payroll.emailId1);
    await expect(pages.PayrollPage.emailListLabel3Value).toContainText(testData.Payroll.emailId2);
    await expect(pages.PayrollPage.emailListLabel4Value).toContainText(testData.Payroll.emailId3);
    await expect(pages.PayrollPage.emailListLabel5Value).toContainText(testData.Payroll.emailId4);
    
    // 25) Next approver : Visible
    await expect(pages.PayrollPage.nextApproverLabel).toBeVisible;

    // 25) Next approver : Visible
    await expect(pages.PayrollPage.activityLogSection).toBeVisible;
    
    // Click : Delete button
    await pages.PayrollPage.safeClick(pages.PayrollPage.deleteButonPayroll);

    // Click : Delete button (Confirm delete Popup)
    await pages.PayrollPage.safeClick(pages.PayrollPage.deleteButonConfirmDeletePopup);

    //Validate : Transaction Deleted Popup Label
    await pages.PayrollPage.waitElementToBeVisible(pages.PayrollPage.transactionDeletedPopupLabel);
    await expect(pages.PayrollPage.transactionDeletedPopupLabel).toContainText(testData.Payroll.transactionDeleted);
    
    // Validate : Refrence No is present in the deleted message
    await pages.PayrollPage.waitElementToBeVisible(pages.PayrollPage.transactionDeletedPopupLabelMsg);
    await expect(pages.PayrollPage.transactionDeletedPopupLabelMsg).toContainText(testData.Payroll.internalReference);
    
  });
});