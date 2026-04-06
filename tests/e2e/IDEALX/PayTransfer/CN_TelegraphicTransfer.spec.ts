/**
  * Author: LC5764725
  * Created Date: 30/03/26
  * Class path "tests/PayTransfer/CN_TelegraphicTransfer.specs"
  * Description: This Specification contains the test cases related China Telegraphic Transfer
  * 1) TC001_CN_TelegraphicTransfer - Create a CN TT Payment with new Payee (type2) 
  * 2) TC002_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Trade Related: Advance Payment)
  * 3) TC003_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Capital)
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


// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/CN_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

//Initialize Web Component class
const webComponents = new WebComponents();

//Variable declaration for Browser
let customBrowser: Browser;

const loginCompanyId = testData.TelegraphicTransfer.loginCompanyId;
const loginUserId = testData.TelegraphicTransfer.loginUserId;
const fromAccount = testData.TelegraphicTransfer.fromAccount;
const payeeBankID = testData.TelegraphicTransfer.payeeBankID;

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

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
        const key = p.name ?? p.accountNumber ?? '';
        await pages.PayrollPage.deletePayeeByFilter(key, /* confirm */ true);
        console.log(`[cleanup] Deleted payee with key: ${key}`);
      } catch (err) {
        console.warn('[cleanup] Failed to delete a payee:', err);
      }
    }
  });

  //TC001_CN_TelegraphicTransfer
  test('TC001_CN_TelegraphicTransfer - Create a CN TT Payment with new Payee (type2)', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    //Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent('1111');
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    // Step 1: Payment from => Select account from "Account" dropdown and enter amount
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccount);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.selectCurrencyDropdown, testData.TelegraphicTransfer.paymentCurrency);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
    
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
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
  await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
  await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
  // Step 4: Capture reference ID and verify details in Transfer Center
  const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
  console.log('TC001 – referenceID:', reference);
  // Step 5: Click on Finish button and verify details in Transfer Center
  await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
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

  });

  //TC002_CN_TelegraphicTransfer
  test('TC002_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Trade Related: Advance Payment)', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    //Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent('1111');
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    // Step 1: Payment from => Select account from "Account" dropdown and enter amount
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccount);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.selectCurrencyDropdown, testData.TelegraphicTransfer.paymentCurrency);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);

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

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC002 – referenceID:', reference);
    // Step 5: Click on Finish button and verify details in Transfer Center
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
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
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Documents Modified');
  });

  //TC003_CN_TelegraphicTransfer
  test('TC003_CN_TelegraphicTransfer - Create a CN TT Payment with ApprovalNow pMchllenge (type3 - Capital)', async ({ page }) => {
    await pages.TelegraphicTransferPage.waitForProtectionMessage();
    //Step 1: Navigate Payment & Transfer Menu.
    await webComponents.waitForUXLoading([], page);
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent('1111');
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    // Step 1: Payment from => Select account from "Account" dropdown and enter amount
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, fromAccount);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newCNPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.fromAccount.blur();
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.selectCurrencyDropdown, testData.TelegraphicTransfer.paymentCurrency);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.SGDPayeeCurrencyDropdown);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);

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

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();
    // Step 4: Capture reference ID and verify details in Transfer Center
    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('TC003 – referenceID:', reference);
    // Step 5: Click on Finish button and verify details in Transfer Center
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
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
    await expect(pages.TelegraphicTransferPage.newTTActivityLog).toContainText('Documents Modified');
  });

  });