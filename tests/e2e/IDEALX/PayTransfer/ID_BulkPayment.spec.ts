      /*
       * Author: LC5741501
       * Created Date: 10/03/26
       * This Class "tests/PayTransfer/ID_BulkPayment.spec.ts"
       * Description: This class has three test cases.
       * 1) TC001_HK_BulkCollection - Create a Bulk collection with new Payer
       * 2) TC002_HK_BulkCollection - Create a Bulk collection with Trasanction code add 38 and 98
       */


// tests/e2e/IDEALX/PayTransfer/VN_BulkPayment.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { chromium, Browser } from 'playwright';
import { WebComponents } from '../../../lib/components';

let customBrowser: Browser;

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/ID_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
const loginCompanyId = testData.BulkPayment.SIT.loginCompanyId;
const loginUserId    = testData.BulkPayment.SIT.loginUserId;
const fromAccount    = testData.BulkPayment.SIT.fromAccount;
const payeeBankID    = testData.BulkPayment.SIT.payeeBankID;

const webComponents = new WebComponents();


test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('ID_Bulk Payment (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { nickName?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;

    //customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');

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

  
  // TC001_ID_BulkPayment Objective : 
  test('TC001_ID_BulkPayment - Verify payee is not able to create Bulk Payment with item amount greater than 1000000000 IDR', async ({ page }) => {
    
    // Payments → Transfer Center → BulkPayment
    await webComponents.waitElementToBeVisibleCustomWait(pages.AccountTransferPage.paymentMenu, 60000);

    //(Changed)
    await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.AccountTransferPage.paymentMenu,15_000);

    //Authentication Pop-up (Changed)
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // await pages.TransferCentersPage.waitForTransferCenterReady();
    //await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);

    // (Changed)
    await webComponents.waitForUXLoading([],page);

    // (Changed)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page,fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page,'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page,'Enter');

    // Reusable helper for add new payee
    const { nickName, accountNumber }  = await pages.PayrollPage.addNewPayeeWithAllDetails({
      name: testData.BulkPayment.newPayeeName,
      nickName: testData.BulkPayment.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.BulkPayment.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // (Changed)
    await webComponents.enterTextarea(pages.BulkPaymentPage.amount, testData.BulkPayment.moreThanMaxAmountLimit);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);
    await webComponents.enterTextarea(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // (Changed)
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountInlineError, testData.BulkPayment.amountErrorTip);

    // Try Next → expect top-level/banner error
    
    // (Changed)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);

    await webComponents.waitElementToBeVisibleCustomWait(pages.BulkPaymentPage.errorOneOrMorefieldsNotBeenProperlyFilled, 30000);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.errorOneOrMorefieldsNotBeenProperlyFilled, testData.BulkPayment.errorMessage);
    

  });


  // TC002_ID_BulkPayment Objective : 
  test('TC002_ID_BulkPayment - Verify payee is able to create Bulk Payment with item amount equal to 1000000000 IDR', async ({ page }) => {
    
    // Payments → Transfer Center → BulkPayment
    await webComponents.waitElementToBeVisibleCustomWait(pages.AccountTransferPage.paymentMenu, 60000);

    //(Changed)
    await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.AccountTransferPage.paymentMenu,15_000);

    //Authentication Pop-up (Changed)
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // await pages.TransferCentersPage.waitForTransferCenterReady();
    //await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);

    // (Changed)
    await webComponents.waitForUXLoading([],page);

    // (Changed)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page,fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page,'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page,'Enter');

    // Reusable helper for add new payee
    const { nickName, accountNumber }  = await pages.PayrollPage.addNewPayeeWithAllDetails({
      name: testData.BulkPayment.newPayeeName,
      nickName: testData.BulkPayment.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.BulkPayment.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // (Changed)
    await webComponents.enterTextarea(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmount);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);
    await webComponents.enterTextarea(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
   
    // Select: Payee Resident Status (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentStatus);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentOptionNonResident);

    // Select: Payee category (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategory);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategoryOptionEnterprise);

    // Step 3: Click Payment date : Earliest Available (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.earliestAvailableDateCheckbox);
    
    // Click on Next button
    await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
    //await pages.PayrollPage.waitForPreviewPageReady();

     // (Changed)
     await webComponents.waitForUXLoading([],page);
     await webComponents.waitElementToBeVisibleCustomWait(pages.BulkPaymentPage.submitButton, 75000);

    // Click on Submit button
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    //await pages.PayrollPage.waitForSubmittedPageReady();
    // (Changed)
    await webComponents.waitForUXLoading([],page);
    await webComponents.waitElementToBeVisibleCustomWait(pages.BulkPaymentPage.finishedButton, 75000);
  
    // It returns the full banner text
    const referenceText = await pages.BulkPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.BulkPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Click on Finish button
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.finishedButton);
    await pages.PayrollPage.waitForPayAndTransferPageReady();
    
    // (Changed)
    await webComponents.waitForUXLoading([],page);
    await webComponents.waitElementToBeVisibleCustomWait(pages.PayrollPage.payroll, 75000);

    // Search Reference No
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    await webComponents.waitForUXLoading([],page);
    await webComponents.waitElementToBeVisibleCustomWait(pages.PayrollPage.fromAccountViewLabel, 120000);
    await webComponents.waitElementToBeVisibleCustomWait(pages.PayrollPage.hashValueLabel, 120000);

    // Validate Bulk Payment From Account, From AccountName, Your Account Will be deducted and Amount.

    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountView, testData.BulkPayment.maxAmountValidation);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountViewLabel, testData.BulkPayment.fromAccountViewLabel);
    
    // (Additional Validation)
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountNameViewLabel, testData.BulkPayment.fromAccountNameViewLabel);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.deductAmountView, testData.BulkPayment.deductedAmount);

  });


  // TC003_ID_BulkPayment Objective : 
  test('TC003_ID_BulkPayment - Verify payee(existing and new Payee) is able to create Bulk Payment with item amount equal to 1000000000 IDR', async ({ page }) => {
    
    // Payments → Transfer Center → BulkPayment
    await webComponents.waitElementToBeVisibleCustomWait(pages.AccountTransferPage.paymentMenu, 60000);

    //(Changed)
    await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.AccountTransferPage.paymentMenu,15_000);

    //Authentication Pop-up (Changed)
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);

    // await pages.TransferCentersPage.waitForTransferCenterReady();
    //await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.bulkPayment);

    // (Changed)
    await webComponents.waitForUXLoading([],page);

    // (Changed)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page,fromAccount);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page,'ArrowDown');
    await webComponents.pressGivenButtonThroughKeyBoardAction(page,'Enter');

    // Reusable helper for add new payee
    const { nickName, accountNumber }  = await pages.PayrollPage.addNewPayeeWithAllDetails({
      name: testData.BulkPayment.newPayeeName,
      nickName: testData.BulkPayment.newPayeeNickName,
      bankId: payeeBankID,
      accountNumber: testData.BulkPayment.newPayeeAcctNumber,
    });

    // Register for cleanup
    createdPayees.push({ nickName, accountNumber });

    // (Changed)
    await webComponents.enterTextarea(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountPayee1);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.showOptionalDetails);
    await webComponents.enterTextarea(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
   
    // Select: Payee Resident Status (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentStatus);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeResidentOptionNonResident);

    // Select: Payee category (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategory);
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.payeeCategoryOptionEnterprise);

    // Step 3: Click Payment date : Earliest Available (Additional Steps)
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.earliestAvailableDateCheckbox);
    
    // Add Existing Payee
    await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkPaymentPage.existingPayeeTabIx);
    await webComponents.enterTextarea(pages.BulkPaymentPage.existingPayeeFilter, testData.BulkPayment.existingPayee);
    await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkPaymentPage.addButton);

    // Add Existing Payer: Amount
    await webComponents.enterTextarea(pages.BulkPaymentPage.amountPayee1, testData.BulkPayment.maxAmountPayee2);
     
    // Click on Next button
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.nextButton);
    //await pages.PayrollPage.waitForPreviewPageReady();

     // (Changed)
     await webComponents.waitForUXLoading([],page);
     await webComponents.waitElementToBeVisibleCustomWait(pages.BulkPaymentPage.submitButton, 75000);

    // Click on Submit button
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.submitButton);
    //await pages.PayrollPage.waitForSubmittedPageReady();
    // (Changed)
    await webComponents.waitForUXLoading([],page);
    await webComponents.waitElementToBeVisibleCustomWait(pages.BulkPaymentPage.finishedButton, 75000);
  
    // It returns the full banner text
    const referenceText = await pages.BulkPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // It extracts the EBLV… token/Refrence no
    const reference = await pages.BulkPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    // Click on Finish button
    await webComponents.clickWhenVisibleAndEnabled(pages.BulkPaymentPage.finishedButton);
    await pages.PayrollPage.waitForPayAndTransferPageReady();
    
    // (Changed)
    await webComponents.waitForUXLoading([],page);
    await webComponents.waitElementToBeVisibleCustomWait(pages.PayrollPage.payroll, 75000);

    // Search Reference No
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    await webComponents.waitForUXLoading([],page);
    await webComponents.waitElementToBeVisibleCustomWait(pages.PayrollPage.fromAccountViewLabel, 120000);
    await webComponents.waitElementToBeVisibleCustomWait(pages.PayrollPage.hashValueLabel, 120000);

    // Validate Bulk Payment From Account, From AccountName, Your Account Will be deducted and Amount.

    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountView, testData.BulkPayment.maxAmountValidationPayee2);
    
    // (Additional Validation)
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.amountViewPayee2, testData.BulkPayment.maxAmountValidationPayee1);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountViewLabel, testData.BulkPayment.fromAccountViewLabel);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.fromAccountNameViewLabel, testData.BulkPayment.fromAccountNameViewLabel);
    await webComponents.compareUIVsJsonValue(pages.BulkPaymentPage.deductAmountView, testData.BulkPayment.deductedAmount);

  });

});