/**
  * Author: LC5764725
  * Created Date: 30/03/26
  * Class path "tests/PayTransfer/CN_TelegraphicTransfer.specs"
  * Description: This Specification contains the test cases related China Telegraphic Transfer
  * 1) TC001_CN_TelegraphicTransfer - Create a CN TT Payment with new Payee (type2) 
  * 2) TC002_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Trade Related: Advance Payment)
  * 3) TC003_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Capital)
  * 4) TC004_CN_TelegraphicTransfer - Create a CN TT Payment with BOP code1 - Capital and BOP code2 - Capital
  * 5) TC005_CN_TelegraphicTransfer - Create A CN TT Payment With Save As Template(Type 1)
  * 6) TC006_CN_TelegraphicTransfer - Create A CN TT Payment From Template
  * 7) TC007_CN_TelegraphicTransfer - Create A CN TT Payment With Save As Draft(Trade Related - Not Advance Payment - Declared Customs With No Goods)
  * 8) TC008_CN_TelegraphicTransfer - Copy A CN TT Payment Via Transfer Center
  * 9) TC009_CN_TelegraphicTransfer - Edit A CN TT Payment Via Transfer Center
  * 10)TC010_CN_TelegraphicTransfer - Reject A CN TT Payment Via Transfer Center
  */

//Required Imports
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';
import { chromium, Browser } from 'playwright';
import { WebComponents } from '../../../lib/webComponents';
import { TextInput } from '../../../pages/components';


// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/CN_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

//Initialize Web Component class
const webComponents = new WebComponents();

//Variable declaration for Browser
let customBrowser: Browser;

const loginCompanyId = testData.TelegraphicTransfer.loginCompanyId;
const loginUserId = testData.TelegraphicTransfer.loginUserId;
const loginUserIdAlt = testData.TelegraphicTransfer.loginUserIdAlt;
const fromAccount = testData.TelegraphicTransfer.fromAccount;
const payeeBankID = testData.TelegraphicTransfer.payeeBankID;

// ─── Shared references passed between tests (backend data dependency) ───────
let templateNewer: string | undefined;   // created in TC005
let referenceNew: string | undefined;  // created in TC001
let referenceExisting: string | undefined; // created in TC002
let copyreference: string | undefined; // created in TC008
let editreference: string | undefined; // created in TC009

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

/**
 * Determine which user ID to use based on test case number.
 * TC001 (odd) -> loginUserId, TC002 (even) -> loginUserIdAlt
 * TC003 (odd) -> loginUserId, TC004 (even) -> loginUserIdAlt
 */
function getLoginUserIdForTest(testTitle: string): string {
  const match = testTitle.match(/TC(\d+)/);
  if (!match) return loginUserId; // default
  const tcNumber = parseInt(match[1], 10);
  return tcNumber % 2 === 1 ? loginUserId : loginUserIdAlt;
}

// Actions for beforEach and afterEach test hooks
test.describe('CN_TelegraphicTransfer (Playwright using PaymentsPages)', () => {
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
    test.setTimeout(TIMEOUT.EXTREME);
    const selectedUserId = getLoginUserIdForTest(testInfo.title);
    console.log(`[login] TC: ${testInfo.title} using userId: ${selectedUserId}`);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, selectedUserId, (String(CONSTANTS.PIN)));

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
    } else {
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
    }

    // Logout after every test (regardless of pass/fail)
    try {
      await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.logoutButton);
      await webComponents.waitForUXLoading([], page);
      console.log('[cleanup] Logged out successfully');
    } catch (err) {
      console.warn('[cleanup] Failed to logout:', err);
    }
  });

  //TC001_CN_TelegraphicTransfer
  test('TC001_CN_TelegraphicTransfer - Create a CN TT Payment with new Payee (type2)', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.makePayment);

    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    
    await webComponents.waitElementToBeVisible(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.hardClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.paymentCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA1);
    
    await pages.TelegraphicTransferPage.addNewCNTTPayee({
    country:                  testData.TelegraphicTransfer.Country,
    bankId:                   payeeBankID,
    routingCode:              testData.TelegraphicTransfer.newPayeeRoutingCode,
    accountNumber:            testData.TelegraphicTransfer.newPayeeAcctNumber,
    name:                     testData.TelegraphicTransfer.newPayeeName,
    nickName:                 testData.TelegraphicTransfer.newPayeeNickName,
    payeeLocation:            testData.TelegraphicTransfer.payeeBankLocation,    
    city:                     testData.TelegraphicTransfer.newPayeeAdd1,
    add1:                     testData.TelegraphicTransfer.newPayeeAdd2,
    add2:                     testData.TelegraphicTransfer.newPayeeAdd3,
    intermediaryLocation:     testData.TelegraphicTransfer.intermediaryLocation,
    intermediaryBankId:       testData.TelegraphicTransfer.intermediaryBankID,
    fxAppRefNum:              testData.TelegraphicTransfer.fxAppRefNum,
    contractNumber:           testData.TelegraphicTransfer.contractNum,
    invoiceNumber:            testData.TelegraphicTransfer.invoiceNum,
    transactionRemark1:       testData.TelegraphicTransfer.transRemark1,
    amountA1:                 testData.TelegraphicTransfer.amountA1,
    bankChargeType:           testData.TelegraphicTransfer.bankChargeTypeOUR,
    payeeBankMsg:             testData.TelegraphicTransfer.paymentDetail,
    email1:                   testData.TelegraphicTransfer.emailId0,
    email2:                   testData.TelegraphicTransfer.emailId1,
    email3:                   testData.TelegraphicTransfer.emailId2,
    email4:                   testData.TelegraphicTransfer.emailId3,
    email5:                   testData.TelegraphicTransfer.emailId4,
    payeeMsg:                 testData.TelegraphicTransfer.message,
    additionalNote:           testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:         testData.TelegraphicTransfer.messageToOrderingBank,
  });

  // Step 3: Click on Next button in New Payee form, verify details in preview page and submit payment
  await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC001 – referenceID:', reference);
  referenceNew = reference;
  // Step 5: Click on Finish button and verify details in Transfer Center
  await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
  await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
  await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
  await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
  await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
  await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.logoutButton);
  await webComponents.waitForUXLoading([], page);
  });

  test('TC002_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Trade Related: Advance Payment)', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.makePayment);

    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    
    await webComponents.waitElementToBeVisible(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.hardClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.paymentCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA2);

    await pages.TelegraphicTransferPage.addExistingCNTTPayee({
    existingAccountNumber:   testData.TelegraphicTransfer.existingPayeeAcct,
    fxAppRefNum:            testData.TelegraphicTransfer.fxAppRefNum,
    contractNumber:         testData.TelegraphicTransfer.contractNum,
    invoiceNumber:          testData.TelegraphicTransfer.invoiceNum,
    transactionRemark1:     testData.TelegraphicTransfer.transRemark1,
    amountA2:               testData.TelegraphicTransfer.amountA2,
    bankChargeType:         testData.TelegraphicTransfer.bankChargeTypeSHARED,
    payeeBankMsg:           testData.TelegraphicTransfer.paymentDetail,
    email1:                 testData.TelegraphicTransfer.emailId0,
    email2:                 testData.TelegraphicTransfer.emailId1,
    email3:                 testData.TelegraphicTransfer.emailId2,
    email4:                 testData.TelegraphicTransfer.emailId3,
    email5:                 testData.TelegraphicTransfer.emailId4,
    payeeMsg:               testData.TelegraphicTransfer.message,
    additionalNote:         testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:       testData.TelegraphicTransfer.messageToOrderingBank,
  });

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const referenceX = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC002 – referenceID:', referenceX);
    referenceExisting = referenceX;
    // Step 5: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(referenceX);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(referenceX);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(referenceX);
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Documents Modified');
  });

  //TC003_CN_TelegraphicTransfer
  test('TC003_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Capital)', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.makePayment);

    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    
    await webComponents.waitElementToBeVisible(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.hardClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.paymentCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA2);

    await pages.TelegraphicTransferPage.addExistingCNTTPayeeWithNewCategory({
    existingAccountNumber:   testData.TelegraphicTransfer.existingPayeeAcct,
    fxAppRefNum:            testData.TelegraphicTransfer.fxAppRefNum,
    contractNumber:         testData.TelegraphicTransfer.contractNum,
    invoiceNumber:          testData.TelegraphicTransfer.invoiceNum,
    transactionRemark1:     testData.TelegraphicTransfer.transRemark1,
    amountA2:               testData.TelegraphicTransfer.amountA2,
    bankChargeType:         testData.TelegraphicTransfer.bankChargeTypeSHARED,
    payeeBankMsg:           testData.TelegraphicTransfer.paymentDetail,
    email1:                 testData.TelegraphicTransfer.emailId0,
    email2:                 testData.TelegraphicTransfer.emailId1,
    email3:                 testData.TelegraphicTransfer.emailId2,
    email4:                 testData.TelegraphicTransfer.emailId3,
    email5:                 testData.TelegraphicTransfer.emailId4,
    payeeMsg:               testData.TelegraphicTransfer.message,
    additionalNote:         testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:       testData.TelegraphicTransfer.messageToOrderingBank,
  });

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC003 – referenceID:', reference);
    // Step 5: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Documents Modified');
  });

  //TC004_CN_TelegraphicTransfer
  test('TC004_CN_TelegraphicTransfer - Create a CN TT Payment with BOP code1 - Capital and BOP code2 - Capital', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.makePayment);

    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    
    await webComponents.waitElementToBeVisible(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.hardClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.paymentCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA1);

    await pages.TelegraphicTransferPage.addExistingCNTTPayeeWithNewCategoryAndSeries({
    existingAccountNumber:   testData.TelegraphicTransfer.existingPayeeAcct,
    fxAppRefNum:            testData.TelegraphicTransfer.fxAppRefNum,
    BOP1Amount:             testData.TelegraphicTransfer.BOP1Amount,
    BOP2Amount:             testData.TelegraphicTransfer.BOP2Amount,
    contractNumber:         testData.TelegraphicTransfer.contractNum,
    invoiceNumber:          testData.TelegraphicTransfer.invoiceNum,
    transactionRemark1:     testData.TelegraphicTransfer.transRemark1,
    amountA2:               testData.TelegraphicTransfer.amountA1,
    bankChargeType:         testData.TelegraphicTransfer.bankChargeTypeOUR,
    payeeBankMsg:           testData.TelegraphicTransfer.paymentDetail,
    email1:                 testData.TelegraphicTransfer.emailId0,
    email2:                 testData.TelegraphicTransfer.emailId1,
    email3:                 testData.TelegraphicTransfer.emailId2,
    email4:                 testData.TelegraphicTransfer.emailId3,
    email5:                 testData.TelegraphicTransfer.emailId4,
    payeeMsg:               testData.TelegraphicTransfer.message,
    additionalNote:         testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:       testData.TelegraphicTransfer.messageToOrderingBank,
  });

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC004 – referenceID:', reference);
    // Step 5: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Documents Modified');
  });

  test('TC005_CN_TelegraphicTransfer - Create A CN TT Payment With Save As Template(Type 1)', async ({ page }) => {
    // Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Payments → Transfer Center → Make a Payment
    // paymentMenu => Pay & Transfer (Left option)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.makePayment);
    // Step 1: Payment from => Select account from "Account" dropdown
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    // Step 2: Change the currency to SGD and enter amount
    await webComponents.waitElementToBeVisible(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.hardClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.paymentCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA2);
    // Step 3: Payment from => Click "Existing payee" tab and selects the payee with type2 category and enters details
    await pages.TelegraphicTransferPage.addExistingCNTTPayeeWithNewCategory({
    existingAccountNumber:   testData.TelegraphicTransfer.existingPayeeAcct,
    fxAppRefNum:            testData.TelegraphicTransfer.fxAppRefNum,
    contractNumber:         testData.TelegraphicTransfer.contractNum,
    invoiceNumber:          testData.TelegraphicTransfer.invoiceNum,
    transactionRemark1:     testData.TelegraphicTransfer.transRemark1,
    amountA2:               testData.TelegraphicTransfer.amountA2,
    bankChargeType:         testData.TelegraphicTransfer.bankChargeTypeSHARED,
    payeeBankMsg:           testData.TelegraphicTransfer.paymentDetail,
    email1:                 testData.TelegraphicTransfer.emailId0,
    email2:                 testData.TelegraphicTransfer.emailId1,
    email3:                 testData.TelegraphicTransfer.emailId2,
    email4:                 testData.TelegraphicTransfer.emailId3,
    email5:                 testData.TelegraphicTransfer.emailId4,
    payeeMsg:               testData.TelegraphicTransfer.message,
    additionalNote:         testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:       testData.TelegraphicTransfer.messageToOrderingBank,
  });
    // Step 4: Click on Next button in New Payee form, click approve and submit payment
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    templateNewer = await pages.TelegraphicTransferPage.ttSaveAsTemplate();   // Storing the reference ID in a variable to use in next test case which has dependency on this test case
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC005 – referenceID:', reference);
    // Step 5: Click on Finish button and verify payment and template details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
  
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateNewer);
    await expect(pages.TelegraphicTransferPage.templateName).toContainText(templateNewer);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await expect(pages.TelegraphicTransferPage.templateStatus).toContainText('Pending Approval');
    await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.paymentCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.logoutButton);
    await webComponents.waitForUXLoading([], page);
    // Login with new user to verify template is visible and then approve it
    const loginPage = new LoginPage(page);
    await loginPage.login(loginCompanyId, loginUserIdAlt, '123');
    pages = new PaymentsPages(page);
    await webComponents.waitForUXLoading([], page);
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Payments → Transfer Center → Make a Payment
    // paymentMenu => Pay & Transfer (Left option)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateNewer);
    await expect(pages.TelegraphicTransferPage.templateName).toContainText(templateNewer);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttApproveButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.templateApproveButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton);
  });

  test('TC006_CN_TelegraphicTransfer - Create A CN TT Payment From Template', async ({ page }) => {
    //checkpoint for templateNewer which is created in TC004, if it's empty then throw error to skip this test as it has dependency on TC004
    test.skip(!templateNewer?.trim(), 'templateNewer is empty – TC005 must pass first');
    // Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Payments → Transfer Center → Make a Payment
    // paymentMenu => Pay & Transfer (Left option)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateNewer!);
    await expect(pages.TelegraphicTransferPage.templateName).toContainText(templateNewer);
    // Step 1: Click on Make a Payment button, update amount, click Next button, verify details in preview page and submit payment
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.templateMakeAPaymentButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA2);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC006 – referenceID:', reference);
    // Step 3: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.waitForUXLoading([], page);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
});

  test('TC007_CN_TelegraphicTransfer - Create A CN TT Payment With Save As Draft(Trade Related - Not Advance Payment - Declared Customs With No Goods)', async ({ page }) => {
    // Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Payments → Transfer Center → Make a Payment
    // paymentMenu => Pay & Transfer (Left option)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.makePayment);
    // Step 1: Payment from => Select account from "Account" dropdown
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    // Step 2: Change the currency to SGD and enter amount
    await webComponents.waitElementToBeVisible(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.hardClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.paymentCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA2);
    // Step 2: Payment from => Enter details in existing payee form
    await pages.TelegraphicTransferPage.addExistingCNTTPayee({
    existingAccountNumber:   testData.TelegraphicTransfer.existingPayeeAcct,
    fxAppRefNum:            testData.TelegraphicTransfer.fxAppRefNum,
    contractNumber:         testData.TelegraphicTransfer.contractNum,
    invoiceNumber:          testData.TelegraphicTransfer.invoiceNum,
    transactionRemark1:     testData.TelegraphicTransfer.transRemark1,
    amountA2:               testData.TelegraphicTransfer.amountA2,
    bankChargeType:         testData.TelegraphicTransfer.bankChargeTypeSHARED,
    payeeBankMsg:           testData.TelegraphicTransfer.paymentDetail,
    email1:                 testData.TelegraphicTransfer.emailId0,
    email2:                 testData.TelegraphicTransfer.emailId1,
    email3:                 testData.TelegraphicTransfer.emailId2,
    email4:                 testData.TelegraphicTransfer.emailId3,
    email5:                 testData.TelegraphicTransfer.emailId4,
    payeeMsg:               testData.TelegraphicTransfer.message,
    additionalNote:         testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:       testData.TelegraphicTransfer.messageToOrderingBank,
  });

    // Step 3: Click on Save As Draft button
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttSaveAsDraftButton);
    await pages.TelegraphicTransferPage.waitForSaveAsDraft();
    // Step 4: Capture draft reference ID
    const reference = await pages.TelegraphicTransferPage.getDraftReferenceID();
    console.log('TC007 – draftReferenceID:', reference);
    // Step 5: Click on Dismiss button in Save As Draft confirmation popup, navigate to Transfer Center, search and open the draft payment using reference ID, verify details and then cancel the draft payment
    await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Saved');
  });
  test('TC008_CN_TelegraphicTransfer - Copy A CN TT Payment Via Transfer Center', async ({ page }) => {
    //checkpoint for referenceExisting which is created in TC002, if it's empty then throw error to skip this test as it has dependency on TC002
    if (!referenceExisting?.trim()) throw new Error('referenceExisting is empty – TC002 must pass first');
    // Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Payments → Transfer Center → Make a Payment
    // paymentMenu => Pay & Transfer (Left option)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();
    // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC002 and open it
    await pages.TransferCentersPage.searchAndOpenByReference(referenceExisting);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    // Step 2: Click on Copy button, update account and amount, click Next button, verify details in preview page and submit payment
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttCopyPaymentButton);
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    const amountInputField = new TextInput(page, pages.TelegraphicTransferPage.amountInput, '');
    await amountInputField.clear();
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.editAmount);

    await webComponents.waitForUXLoading([], page);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.specificPaymentPurpose);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.specificPaymentPurposeDropdown);

    await pages.TelegraphicTransferPage.isTaxFreeGoods.evaluate(el => (el as HTMLElement).click());

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fxAppRefNum);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.fxAppRefNum, testData.TelegraphicTransfer.fxAppRefNum);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.fxAppRefNum.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCategory1);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCategory1Dropdown);
    await pages.TelegraphicTransferPage.pmtBOPCategory1.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCodeSeries1);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCodeSeries1Dropdown);
    await pages.TelegraphicTransferPage.pmtBOPCodeSeries1.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.contractNumber);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.contractNumber, testData.TelegraphicTransfer.contractNum);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.contractNumber.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.invoiceNumber);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.invoiceNumber, testData.TelegraphicTransfer.invoiceNum);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.invoiceNumber.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.transactionRemark1);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.transactionRemark1, testData.TelegraphicTransfer.transRemark1);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.transactionRemark1.blur();

    await pages.TelegraphicTransferPage.uploadSupportingDocument('DIGI_DOC.pdf');
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.documentType);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.documentTypeDropdown);
    await pages.TelegraphicTransferPage.documentType.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.utilizedAmount);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.utilizedAmount, testData.TelegraphicTransfer.utilizedAmount);
    await pages.TelegraphicTransferPage.utilizedAmount.blur();  

    await pages.TelegraphicTransferPage.clickNextUntilPreview();
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 3: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC008 – referenceID:', reference);
    copyreference = reference;
    // Step 4: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Verification');

});

  test('TC009_CN_TelegraphicTransfer - Edit A CN TT Payment Via Transfer Center', async ({ page }) => {
    //checkpoint for referenceExisting which is created in TC002, if it's empty then throw error to skip this test as it has dependency on TC001
    if (!referenceExisting?.trim()) throw new Error('referenceExisting is empty – TC001 must pass first');
    // Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Payments → Transfer Center → Make a Payment
    // paymentMenu => Pay & Transfer (Left option)
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();
    // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC002 and open it
    await pages.TransferCentersPage.searchAndOpenByReference(referenceExisting);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    // Step 2: Click on Edit button, update amount and purpose code, click Next button, verify details in preview page and submit payment
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttEditPaymentButton);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    const amountInputField = new TextInput(page, pages.TelegraphicTransferPage.amountInput, '');
    await amountInputField.clear();
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.editAmount);

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.specificPaymentPurpose);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.specificPaymentPurposeDropdown);
    await pages.TelegraphicTransferPage.specificPaymentPurpose.blur();

    await pages.TelegraphicTransferPage.isTaxFreeGoods.evaluate(el => (el as HTMLElement).click());

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fxAppRefNum);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.fxAppRefNum, testData.TelegraphicTransfer.fxAppRefNum);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.fxAppRefNum.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCategory1);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCategory1Dropdown);
    await pages.TelegraphicTransferPage.pmtBOPCategory1.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCodeSeries1);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.pmtBOPCodeSeries1Dropdown);
    await pages.TelegraphicTransferPage.pmtBOPCodeSeries1.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.contractNumber);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.contractNumber, testData.TelegraphicTransfer.contractNum);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.contractNumber.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.invoiceNumber);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.invoiceNumber, testData.TelegraphicTransfer.invoiceNum);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.invoiceNumber.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.transactionRemark1);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.transactionRemark1, testData.TelegraphicTransfer.transRemark1);
    await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Tab');
    await pages.TelegraphicTransferPage.transactionRemark1.blur();

    await pages.TelegraphicTransferPage.uploadSupportingDocument('DIGI_DOC.pdf');
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.documentType);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.documentTypeDropdown);
    await pages.TelegraphicTransferPage.documentType.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.utilizedAmount);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.utilizedAmount, testData.TelegraphicTransfer.utilizedAmount);
    await pages.TelegraphicTransferPage.utilizedAmount.blur();  

    await pages.TelegraphicTransferPage.clickNextUntilPreview();
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 3: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC009 – referenceID:', reference);
    editreference = reference;
    // Step 4: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);

    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');

});

test('TC010_CN_TelegraphicTransfer - Reject A CN TT Payment Via Transfer Center', async ({ page }) => {
  //checkpoint for referenceExisting which is created in TC002, if it's empty then throw error to skip this test as it has dependency on TC001
  if (!referenceExisting?.trim()) throw new Error('referenceExisting is empty – TC002/TC008 must pass first');
  // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC001 and open it
  await pages.TelegraphicTransferPage.waitForProtectionMessage();
  await webComponents.waitForUXLoading([], page);

  await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);
  await webComponents.waitForUXLoading([], page);

  await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
  
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(referenceExisting);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 2: Click on Reject button, enter rejection reason, click Next button, verify details in preview page and submit rejection
  await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttRejectPaymentButton);

  await pages.TelegraphicTransferPage.waitForRejectPaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();
  // Step 3: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
  console.log('TC010 – rejectedReferenceID:', reference);

  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Rejected');
});

test('TC011_CN_TelegraphicTransfer - Copy A CN TT Payment With IDR Currency', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.makePayment);

    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.fromAccount);
    await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    
    await webComponents.waitElementToBeVisible(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.hardClick(pages.TelegraphicTransferPage.selectCurrencyDropdown);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.newPayeeCurrency);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.IDRPayeeCurrencyDropdown);
    
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    await webComponents.typeTextThroughKeyBoardAction(page, testData.TelegraphicTransfer.amountA1);

    await pages.TelegraphicTransferPage.addExistingCNTTPayeeWithNewCategoryAndSeries({
    existingAccountNumber:   testData.TelegraphicTransfer.existingPayeeAcct,
    fxAppRefNum:            testData.TelegraphicTransfer.fxAppRefNum,
    BOP1Amount:             testData.TelegraphicTransfer.BOP1Amount,
    BOP2Amount:             testData.TelegraphicTransfer.BOP2Amount,
    contractNumber:         testData.TelegraphicTransfer.contractNum,
    invoiceNumber:          testData.TelegraphicTransfer.invoiceNum,
    transactionRemark1:     testData.TelegraphicTransfer.transRemark1,
    amountA2:               testData.TelegraphicTransfer.amountA1,
    bankChargeType:         testData.TelegraphicTransfer.bankChargeTypeOUR,
    payeeBankMsg:           testData.TelegraphicTransfer.paymentDetail,
    email1:                 testData.TelegraphicTransfer.emailId0,
    email2:                 testData.TelegraphicTransfer.emailId1,
    email3:                 testData.TelegraphicTransfer.emailId2,
    email4:                 testData.TelegraphicTransfer.emailId3,
    email5:                 testData.TelegraphicTransfer.emailId4,
    payeeMsg:               testData.TelegraphicTransfer.message,
    additionalNote:         testData.TelegraphicTransfer.transactionNote,
    remitterIdentity:       testData.TelegraphicTransfer.messageToOrderingBank,
  });

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC011Reference – referenceID:', reference);
    // Step 5: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTReferenceValue).toContainText(reference);
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Create');
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Documents Modified');
    
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttCopyPaymentButton);
    await webComponents.waitForUXLoading([], page);

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.amountInput);
    const amountInputField = new TextInput(page, pages.TelegraphicTransferPage.amountInput, '');
    await amountInputField.clear();
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);

    await pages.TelegraphicTransferPage.uploadSupportingDocument('DIGI_DOC.pdf');
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.documentType);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.documentTypeDropdown);
    await pages.TelegraphicTransferPage.documentType.blur();

    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.utilizedAmount);
    await webComponents.enterTextarea(pages.TelegraphicTransferPage.utilizedAmount, testData.TelegraphicTransfer.amountA1);
    await pages.TelegraphicTransferPage.utilizedAmount.blur();  

    await pages.TelegraphicTransferPage.clickNextUntilPreview();
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 3: Capture reference ID and verify details in Transfer Center
    const referenceTC011 = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC011 – referenceID:', referenceTC011);
    // Step 4: Click on Finish button and verify details in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTfinishButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(referenceTC011);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await expect(pages.TelegraphicTransferPage.newTTAmountValue).toContainText(testData.TelegraphicTransfer.payeeCurrency);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');    

});

test('TC012_CN_TelegraphicTransfer - Delete A CN TT Payment Via Transfer Center', async ({ page }) => {
  //checkpoint for referenceExisting which is created in TC002, if it's empty then throw error to skip this test as it has dependency on TC001
  if (!referenceExisting?.trim()) throw new Error('referenceExisting is empty – TC002/TC008 must pass first');
  // Step 1:Payments → Transfer Center → Search for a payment using reference number created in TC001 and open it
  await pages.TelegraphicTransferPage.waitForProtectionMessage();
  await webComponents.waitForUXLoading([], page);

  await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
  await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    
  await pages.AccountTransferPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(referenceExisting);
  await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
  // Step 2: Click on Delete button, enter deletion reason, click Next button, verify details in preview page and submit deletion
  await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.ttDeletePaymentButton);
  await pages.TelegraphicTransferPage.waitForDeletePaymentSuccess();
  await pages.TelegraphicTransferPage.waitForRejectTransactionID();
  // Step 3: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
  console.log('TC012 – deletedReferenceID:', reference);
  
  await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
  await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();

  await webComponents.clickWhenVisibleAndEnabled(pages.TransferCentersPage.transferCenterFilter);
  await webComponents.typeTextThroughKeyBoardAction(page, reference);
  await pages.TransferCentersPage.transferCenterFilter.blur();
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await expect(pages.TelegraphicTransferPage.ttDeletePaymentSuccessMessage).toContainText('No information to display');
  });


test('TC013_CN_TelegraphicTransfer - Verify A CN TT Payment Via My Verify', async ({ page }) => {
    //checkpoint for copyreference which is created in TC008, if it's empty then throw error to skip this test as it has dependency on TC008
    if (!copyreference?.trim()) throw new Error('copyreference is empty – TC008 must pass first');
    // Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Step 1: Click on Verify tab, search and open the payment using reference number, verify details and then click on Approve button
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalVerifyTab);
    await pages.ApprovalPage.waitForVerifyCenterReady();
    await pages.ApprovalPage.searchVerifyAndOpenByReference(copyreference);
    // Step 3: Verify telegraphic payment has correct details and status is Pending Approval 
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Approval');
  });
  
  test('TC014_CN_TelegraphicTransfer - Approve A CN TT Payment Via Transfer Center', async ({ page }) => {
    //checkpoint for copyreference which is created in TC008, if it's empty then throw error to skip this test as it has dependency on TC008
    if (!copyreference?.trim()) throw new Error('copyreference is empty – TC008 must pass first');
    //Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Step 1: Click on Verify tab, search and open the payment using reference number, verify details and then click on Approve button
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
    // Step 2: Click on Approve button, click on Approve Now checkbox, get Mobile challenge, submit approval
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.templateApproveButton);
    await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttNewApproveButton.first());
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton);
    // Step 3: Verify payment status is updated to Pending Release in Transfer Center
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Pending Release');
  });
  
  test('TC015_CN_TelegraphicTransfer - Release A CN TT Payment Via My Release', async ({ page }) => {
    //checkpoint for copyreference which is created in TC008, if it's empty then throw error to skip this test as it has dependency on TC008
    if (!copyreference?.trim()) throw new Error('copyreference is empty – TC008 must pass first');
    // Step 0: Login and handle to Protection Message
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    await webComponents.waitForUXLoading([], page);
    // Step 1: Click on Approval tab, search and open the payment using reference number, verify details and then click on Approve button
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approvalMenu);
    await webComponents.waitForUXLoading([], page);
    await webComponents.handleAuthIfPresent(pages.AccountTransferPage.authDialog, pages.AccountTransferPage.securityAccessCode, pages.AccountTransferPage.authenticateButton);
    await webComponents.clickWhenVisibleAndEnabled(pages.ApprovalPage.approveReleaseTab);
    await pages.ApprovalPage.waitForVerifyCenterReady();
    // Step 2: Click on Release button, click on Release Now checkbox, get Mobile challenge, submit release
    await pages.ApprovalPage.searchReleaseAndOpenByReference(copyreference);
    // Step 3: Verify telegraphic payment has correct details and status is Approved
    await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccount);
    await webComponents.clickWhenVisibleAndEnabled(pages.TelegraphicTransferPage.newTTCancelButton);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(copyreference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText('Completed');
  });



});