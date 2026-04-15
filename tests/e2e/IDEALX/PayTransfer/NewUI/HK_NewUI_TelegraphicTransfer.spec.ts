import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { PaymentsPages } from '../../../../pages/IDEALX/index';
import { LoginPage } from '../../../../pages/IDEALX/LoginPage';
import { WebComponents } from '../../../../lib/webComponents';
import { TIMEOUT } from '../../../../lib/timeouts';
import { CONSTANTS } from '../../../../lib/constants';

const testDataPath = path.resolve(__dirname, '../../../../data/HK_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

//Initialize Web Component class
const webComponents = new WebComponents();

// ─── Credentials (single environment) ───────────────────────────────────────
const loginCompanyId = testData.TelegraphicTransfer.newUI.loginCompanyId;
const loginUserId    = testData.TelegraphicTransfer.newUI.loginUserId;
const fromAccountNP  = testData.TelegraphicTransfer.fromAccountNP;

// ─── Shared references passed between tests (backend data dependency) ───────
let reference2: string | undefined;    // created in TC002, used in TC003

// ─── Global test configuration ──────────────────────────────────────────────
// We run serial because tests depend on IDs created by earlier tests.
test.describe.configure({ mode: 'serial' });
test.use({ storageState: undefined });     // ensure fresh context (session) per test
test.setTimeout(8_000_000);

// Provide a per-test `pages` object, created after login.
let pages: PaymentsPages;

// Each test gets a fresh context + page (Playwright default), we then login.
test.beforeEach(async ({ page }) => {
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
      //console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
      return;
    }
  });

//TC001_HK_NewUI_TelegraphicTransfer
test('TC001_HK_NewUI_TelegraphicTransfer - Create A TT Payment Without Purpose Code', async ({ page }) => {
  //await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.acknowledgeBtn);
  
  //Step 1: Navigate Payment & Transfer Menu.
  await webComponents.waitForUXLoading([], page);
  await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
  await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

  //Step 2: Handle Authentication Pop-up.
  await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
  await webComponents.waitForUXLoading([], page);

  //Step 3: Click Pay Local/Overseas Payment.
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.makePayment);
  await webComponents.waitForUXLoading([], page);

  //Step 4: Select account from Debit account section.
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIDebitAccountFilter);
  //await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIFromAccount);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIDebitAccount);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newUIDebitAccount, fromAccountNP);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUINewPayeeBankAccountDropdown);
  
  //Step 5:Select Payee from Select or add payee section
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.selectOrAddPayeeFilter);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIExistingPayeeBankAccount);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newUIExistingPayeeBankAccount, testData.TelegraphicTransfer.newUI.existingPayee);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIExistingPayeeBankAccountSelect);
  
  //Step 6: Enter amount to transfer
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.amountInput);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  
  //Step 7: Toggle on the reference on bank statements
  await pages.NewUITelegraphicTransferPage.bankChargesOurRadioButton.evaluate(el => (el as HTMLElement).click());
  //await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.orderingBankMsg);
  //await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.orderingBankMsg, testData.TelegraphicTransfer.transactionNote);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.referceBankPayment);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.referceBankPayment, testData.TelegraphicTransfer.transactionNote);
  

  //Step 8: Attempt to proceed to the next step without selecting a purpose code
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newTTPayeeNextButton);
  
  //Step 9: Verify that the appropriate error message is displayed regarding the missing purpose code
  await expect(pages.NewUITelegraphicTransferPage.newUIErrorMessage).toContainText(testData.TelegraphicTransfer.errorMessage);

});

test('TC002_HK_NewUI_TelegraphicTransfer - Create A TT Payment With Purpose Code And Payment Details', async ({ page }) => {
  //Step 1: Navigate Payment & Transfer Menu.
  await webComponents.waitForUXLoading([], page);
  await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
  await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

  //Step 2: Handle Authentication Pop-up.
  await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
  //await webComponents.waitForUXLoading([], page);

  //Step 3: Click Pay Local/Overseas Payment.
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await webComponents.waitElementToBeVisible(pages.NewUITelegraphicTransferPage.makePayment);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.makePayment);
  await webComponents.waitForUXLoading([], page);

  //Step 4: Select account from Debit account section.
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIDebitAccountFilter);
  //await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIFromAccount);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIDebitAccount);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newUIDebitAccount, fromAccountNP);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUINewPayeeBankAccountDropdown);
  
  //Step 5:Select Payee from Select or add payee section
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.selectOrAddPayeeFilter);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIExistingPayeeBankAccount);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newUIExistingPayeeBankAccount, testData.TelegraphicTransfer.newUI.existingPayee);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIExistingPayeeBankAccountSelect);
  
  //Step 6: Enter amount to transfer
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.amountInput);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
  
  
  // await pages.NewUITelegraphicTransferPage.intermediaryBankCheckbox.evaluate(el => (el as HTMLElement).click());
  // //await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.intermediaryBankCheckbox);
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.intermediaryBankLocation);
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.intermediaryBankLocation, testData.TelegraphicTransfer.intermediaryBankCountry);
  // //await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.intermediaryCNYLocation);
  // //await pages.NewUITelegraphicTransferPage.intermediaryBankLocation.blur();
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newUIIntermediaryBankId);
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newUISearchIntermediaryBankId, testData.TelegraphicTransfer.intermediaryBankID);
  // await page.keyboard.press('Enter');
  // await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.newUIBankIDOption); 

  //Purpose code 
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.purposeCodeDropdown);  
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.searchPurposeCodeTextBox, testData.TelegraphicTransfer.purposeCode);
  await webComponents.clickWhenVisibleAndEnabled(pages.NewUITelegraphicTransferPage.selectPurposeCodeOption);
  
  //await page.keyboard.press('Enter');
  //await pages.NewUITelegraphicTransferPage.intermediaryBankId.blur();
  //await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newUIFindIntermediaryBankIDButton);
  //await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.intermediaryCNYbankID);
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPurposeCode.first());
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.inputNewTTPurposeCode.first());
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.inputNewTTPurposeCode.first(), testData.TelegraphicTransfer.purposeCode);
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newHKPurposeCodeDropdown);
  // await pages.NewUITelegraphicTransferPage.newTTPurposeCode.first().blur();
  await pages.NewUITelegraphicTransferPage.bankChargesOurRadioButton.evaluate(el => (el as HTMLElement).click());
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPaymentRemark);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newTTPaymentRemark, testData.TelegraphicTransfer.messageToOrderingBank);
  await pages.NewUITelegraphicTransferPage.newTTPaymentRemark.blur();
  await pages.NewUITelegraphicTransferPage.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.addEmailTextBox, testData.TelegraphicTransfer.emailIdO);
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPayeeEmail1); 
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newTTPayeeEmail1, testData.TelegraphicTransfer.emailIdO);
  // await page.keyboard.press('Enter');
  // await pages.NewUITelegraphicTransferPage.newTTPayeeEmail1.blur();
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPayeeEmail2); 
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newTTPayeeEmail2, testData.TelegraphicTransfer.emailId1);
  // await page.keyboard.press('Enter');
  // await pages.NewUITelegraphicTransferPage.newTTPayeeEmail2.blur();
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPayeeEmail3); 
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newTTPayeeEmail3, testData.TelegraphicTransfer.emailId2);
  // await page.keyboard.press('Enter');
  // await pages.NewUITelegraphicTransferPage.newTTPayeeEmail3.blur();
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPayeeEmail4); 
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newTTPayeeEmail4, testData.TelegraphicTransfer.emailId3);
  // await page.keyboard.press('Enter');
  // await pages.NewUITelegraphicTransferPage.newTTPayeeEmail4.blur();
  // await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPayeeEmail5); 
  // await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newTTPayeeEmail5, testData.TelegraphicTransfer.emailId4);
  // await page.keyboard.press('Enter');
  // await pages.NewUITelegraphicTransferPage.newTTPayeeEmail5.blur();
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPayeeRemark);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.newTTPayeeRemark, testData.TelegraphicTransfer.message);
  await pages.NewUITelegraphicTransferPage.newTTPayeeRemark.blur();
  await pages.NewUITelegraphicTransferPage.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.additionalNoteRemark);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.additionalNoteRemark, testData.TelegraphicTransfer.transactionNote);
  await pages.NewUITelegraphicTransferPage.newTTPayeeRemark.blur();
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.orderingBankMsg);
  await pages.NewUITelegraphicTransferPage.safeFill(pages.NewUITelegraphicTransferPage.orderingBankMsg, testData.TelegraphicTransfer.messageToOrderingBank);
  await pages.NewUITelegraphicTransferPage.orderingBankMsg.blur();
  // Step 2: Proceed to the next step and verify the preview page before submitting
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTPayeeNextButton);
  await pages.NewUITelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTsubmitButton);
  await pages.NewUITelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 3: Capture the reference ID of the newly created payment and verify the details in the Transfer Center
  const reference = await pages.NewUITelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC002 – referenceID:', reference);
  reference2 = reference; // save for later tests
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTfinishButton);
  await pages.NewUITelegraphicTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.NewUITelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.NewUITelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  await pages.NewUITelegraphicTransferPage.safeClick(pages.NewUITelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.NewUITelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.NewUITelegraphicTransferPage.ttApproveButton).toBeVisible();
  await expect(pages.NewUITelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.NewUITelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.paymentCurrencyCNY);
  await expect(pages.NewUITelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
  await expect(pages.NewUITelegraphicTransferPage.newTTActivityLog).toContainText('Create');

});
