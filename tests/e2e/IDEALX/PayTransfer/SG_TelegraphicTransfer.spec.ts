// tests/SG_TelegraphicTransfer.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;


let reference2: string | undefined;
let reference3: string | undefined;

const SIT = (process.env.ENV?.toUpperCase() === 'SIT');

const loginCompanyId = SIT ? testData.TelegraphicTransfer.SIT.loginCompanyId : testData.TelegraphicTransfer.UAT.loginCompanyId;
const loginUserId    = SIT ? testData.TelegraphicTransfer.SIT.loginUserId    : testData.TelegraphicTransfer.UAT.loginUserId;
const fromAccountNP    = SIT ? testData.TelegraphicTransfer.SIT.fromAccountNP    : testData.TelegraphicTransfer.UAT.fromAccountNP;
const payeeBankID    = SIT ? testData.TelegraphicTransfer.SIT.payeeBankID    : testData.TelegraphicTransfer.UAT.payeeBankID;
const fromAccountEP    = SIT ? testData.TelegraphicTransfer.SIT.fromAccountEP    : testData.TelegraphicTransfer.UAT.fromAccountEP;


test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_TelegraphicTransfer (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
  type CreatedPayee = { nickName?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
   

  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(8000_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');
    pages = new PaymentsPages(page);
    
  });

  test.afterEach(async ({ page }, testInfo) => {
    
  if (testInfo.status !== 'passed') {
    console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
    return;
    }

    
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

  test('TC001_SG_TelegraphicTransfer - Create A TT Payment With New Payee', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await page.keyboard.type(fromAccountNP);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await pages.TelegraphicTransferPage.waitForCurrency();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);

    const ttResult = await pages.TelegraphicTransferPage.addNewTTPayee({
     name:               testData.TelegraphicTransfer.name,           
     nickName:           testData.TelegraphicTransfer.nickName,      
     add1:               testData.TelegraphicTransfer.add1,       
     add2:               testData.TelegraphicTransfer.add2,      
     city:               testData.TelegraphicTransfer.city,        
     bankId:             payeeBankID,                                         
     routingCode:        testData.TelegraphicTransfer.routingCode,            
     accountNumber:      testData.TelegraphicTransfer.accountNumber,
     intermediaryBankLocation: testData.TelegraphicTransfer.intermediaryBankLocation, 
     intermediaryBankId: testData.TelegraphicTransfer.intermediaryBankId,
     bankChargeType:     testData.TelegraphicTransfer.bankChargeTypeOUR,    
     purposeCode:        testData.TelegraphicTransfer.purposeCode,            
     payeeBankMsg:       testData.TelegraphicTransfer.bankMessage,          
     email1:             testData.TelegraphicTransfer.emailId0,            
     email2:             testData.TelegraphicTransfer.emailId1,
     email3:             testData.TelegraphicTransfer.emailId2,
     email4:             testData.TelegraphicTransfer.emailId3,
     email5:             testData.TelegraphicTransfer.emailId4,
     payeeMsg:           testData.TelegraphicTransfer.message,           
     additionalNote:     testData.TelegraphicTransfer.transactionNote,         
     remitterIdentity:   testData.TelegraphicTransfer.remitterIdentity}
    );

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);

    reference2 = reference; 

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
  });
  
  test('TC002_SG_TelegraphicTransfer - Create A TT Payment With ApprovalNow Pmchllenge', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountEP);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.waitForSGDCurrency();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
    
    const existingttResult = await pages.TelegraphicTransferPage.addExistingTTPayee({           
     existingAccountNumber:      testData.TelegraphicTransfer.existingAccountNumber,
     bankChargeType:     testData.TelegraphicTransfer.bankChargeTypeSHARED,          
     payeeBankMsg:       testData.TelegraphicTransfer.bankMessage,          
     email1:             testData.TelegraphicTransfer.emailId0,            
     email2:             testData.TelegraphicTransfer.emailId1,
     email3:             testData.TelegraphicTransfer.emailId2,
     email4:             testData.TelegraphicTransfer.emailId3,
     email5:             testData.TelegraphicTransfer.emailId4,
     payeeMsg:           testData.TelegraphicTransfer.message,           
     additionalNote:     testData.TelegraphicTransfer.transactionNote,         
     remitterIdentity:   testData.TelegraphicTransfer.remitterIdentity}
    );

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText("Partial Approved");

  });

  test('TC003_SG_TelegraphicTransfer - Create A TT Payment With ApprovalNow Mchllenge', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountNP);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await pages.TelegraphicTransferPage.waitForCurrency();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);

    const ttResult = await pages.TelegraphicTransferPage.addNewTTPayee({
     name:               testData.TelegraphicTransfer.name,           
     nickName:           testData.TelegraphicTransfer.nickName,      
     add1:               testData.TelegraphicTransfer.add1,       
     add2:               testData.TelegraphicTransfer.add2,      
     city:               testData.TelegraphicTransfer.city,        
     bankId:             payeeBankID,                                         
     routingCode:        testData.TelegraphicTransfer.routingCode,            
     accountNumber:      testData.TelegraphicTransfer.accountNumber,
     intermediaryBankLocation: testData.TelegraphicTransfer.intermediaryBankLocation, 
     intermediaryBankId: testData.TelegraphicTransfer.intermediaryBankId,
     bankChargeType:     testData.TelegraphicTransfer.bankChargeTypeTHEY,    
     purposeCode:        testData.TelegraphicTransfer.purposeCode,            
     payeeBankMsg:       testData.TelegraphicTransfer.bankMessage,          
     email1:             testData.TelegraphicTransfer.emailId0,            
     email2:             testData.TelegraphicTransfer.emailId1,
     email3:             testData.TelegraphicTransfer.emailId2,
     email4:             testData.TelegraphicTransfer.emailId3,
     email5:             testData.TelegraphicTransfer.emailId4,
     payeeMsg:           testData.TelegraphicTransfer.message,           
     additionalNote:     testData.TelegraphicTransfer.transactionNote,         
     remitterIdentity:   testData.TelegraphicTransfer.remitterIdentity}
    );

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.ttApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);
    
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText("Completed");

  });

  test('TC004_SG_TelegraphicTransfer - Create A TT Payment With Save As Template', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountEP);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.waitForSGDCurrency();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
    
    const existingttResult = await pages.TelegraphicTransferPage.addExistingTTPayee({           
     existingAccountNumber:      testData.TelegraphicTransfer.existingAccountNumber,
     bankChargeType:     testData.TelegraphicTransfer.bankChargeTypeOUR,          
     payeeBankMsg:       testData.TelegraphicTransfer.bankMessage,          
     email1:             testData.TelegraphicTransfer.emailId0,            
     email2:             testData.TelegraphicTransfer.emailId1,
     email3:             testData.TelegraphicTransfer.emailId2,
     email4:             testData.TelegraphicTransfer.emailId3,
     email5:             testData.TelegraphicTransfer.emailId4,
     payeeMsg:           testData.TelegraphicTransfer.message,           
     additionalNote:     testData.TelegraphicTransfer.transactionNote,         
     remitterIdentity:   testData.TelegraphicTransfer.remitterIdentity}
    );

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    const templateName = await pages.TelegraphicTransferPage.ttSaveAsTemplate();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText("Pending Approval");
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(templateName);
    await expect(pages.TelegraphicTransferPage.templateLink).toContainText(templateName);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText("Pending Approval");
    await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.amountA2);

  });

  test('TC005_SG_TelegraphicTransfer - Create A TT Payment From Template', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.searchAndOpenByTemplateReference(testData.TelegraphicTransfer.templateName);
    await expect(pages.TelegraphicTransferPage.templateLink).toContainText(testData.TelegraphicTransfer.templateName);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.templateMakeAPaymentButton);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA1);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText("Pending Approval");
    await expect(pages.TelegraphicTransferPage.templateAmount).toContainText(testData.TelegraphicTransfer.amountA1);
});

  test('TC006_SG_TelegraphicTransfer - Create A TT With Save As Draft', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountEP);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.existingPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.waitForSGDCurrency();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
    
    const existingttResult = await pages.TelegraphicTransferPage.addExistingTTPayee({           
     existingAccountNumber:      testData.TelegraphicTransfer.existingAccountNumber,
     bankChargeType:     testData.TelegraphicTransfer.bankChargeTypeOUR,          
     payeeBankMsg:       testData.TelegraphicTransfer.bankMessage,          
     email1:             testData.TelegraphicTransfer.emailId0,            
     email2:             testData.TelegraphicTransfer.emailId1,
     email3:             testData.TelegraphicTransfer.emailId2,
     email4:             testData.TelegraphicTransfer.emailId3,
     email5:             testData.TelegraphicTransfer.emailId4,
     payeeMsg:           testData.TelegraphicTransfer.message,           
     additionalNote:     testData.TelegraphicTransfer.transactionNote,         
     remitterIdentity:   testData.TelegraphicTransfer.remitterIdentity}
    );

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttSaveAsDraftButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.waitForSaveAsDraft();

    const reference = await pages.TelegraphicTransferPage.getDraftReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.amountA2);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText("Saved");
  });

  test('TC007_SG_TelegraphicTransfer - Copy A TT Payment Via Transfer Center', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    if (reference2 && reference2.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference2);
    } else {
        throw new Error(
          'reference2 is empty');
      }
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttCopyPaymentButton);
    await pages.TelegraphicTransferPage.handleCognitiveContinueIfPresent();
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);

    reference2 = reference; 

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.amountA1);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText("Pending Approval");

});

  test('TC008_SG_TelegraphicTransfer - Edit A TT Paymment Via Transfer Center', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    if (reference2 && reference2.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference2);
    } else {
        throw new Error(
          'reference2 is empty');
      }
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttEditPaymentButton);
    await pages.TelegraphicTransferPage.handleCognitiveContinueIfPresent();
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.handleMYRContinueIfPresent();
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);

    reference2 = reference; 

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountNP);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.amountA1);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText("Pending Approval");

});

  test('TC009_SG_TelegraphicTransfer - Reject A TT Payment Via Transfer Center', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    if (reference2 && reference2.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference2);
    } else {
        throw new Error(
          'reference2 is empty');
      }
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttRejectPaymentButton);
    await pages.TelegraphicTransferPage.waitForRejectPaymentSuccess();

    await pages.TelegraphicTransferPage.waitForRejectTransactionID();

    const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText("Rejected");

});
  test('TC010_SG_TelegraphicTransfer - Delete A TT Payment Via Transfer Center', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    if (reference2 && reference2.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference2);
    } else {
        throw new Error(
          'reference2 is empty');
      }
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttDeletePaymentButton);
    await pages.TelegraphicTransferPage.waitForDeletePaymentSuccess();

    await pages.TelegraphicTransferPage.waitForRejectTransactionID();

    const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await expect(pages.TelegraphicTransferPage.ttDeletePaymentSuccessMessage).toContainText("No information to display");

});
  test('TC011_SG_TelegraphicTransfer - Create A TT Payment With Currency As SGD And Payee Bank Supports PARTIOR', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    await pages.TelegraphicTransferPage.saferClick(pages.TelegraphicTransferPage.makePayment);
    await pages.TelegraphicTransferPage.waitForTTFormReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.fromAccount);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.fromAccount, testData.TelegraphicTransfer.fromAccountEP);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.partiourPayeeBankAccountDropdown);
    await pages.TelegraphicTransferPage.waitForSGDCurrency();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.amountInput);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.amountInput, testData.TelegraphicTransfer.amountA2);
    
    const existingttResult = await pages.TelegraphicTransferPage.addExistingTTPayee({           
     existingAccountNumber:      testData.TelegraphicTransfer.SupportPartiorPayee,
     bankChargeType:     testData.TelegraphicTransfer.bankChargeTypeOUR,          
     payeeBankMsg:       testData.TelegraphicTransfer.bankMessage,          
     email1:             testData.TelegraphicTransfer.emailId0,            
     email2:             testData.TelegraphicTransfer.emailId1,
     email3:             testData.TelegraphicTransfer.emailId2,
     email4:             testData.TelegraphicTransfer.emailId3,
     email5:             testData.TelegraphicTransfer.emailId4,
     payeeMsg:           testData.TelegraphicTransfer.message,           
     additionalNote:     testData.TelegraphicTransfer.transactionNote,         
     remitterIdentity:   testData.TelegraphicTransfer.remitterIdentity}
    );

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTPayeeNextButton);
    await pages.TelegraphicTransferPage.waitForNewTTPreviewPageReady();
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.waitFornewTTSubmittedPageReady();

    const reference = await pages.TelegraphicTransferPage.getNewTTReferenceID();
    console.log('Captured referenceID:', reference);

    reference3 = reference;

    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTfinishButton);

    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.SupportPartiorPayee);
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.amountA2);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText("Pending Verification");

  });

  test('TC012_SG_TelegraphicTransfer - Approve A TT Payment For PARTIOR', async ({ page }) => {
    await pages.TelegraphicTransferPage.handleAnnouncementIfPresent();   
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    await pages.AccountTransferPage.waitForTransferCenterReady();
    if (reference3 && reference3.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference3);
    } else {
        throw new Error(
          'reference3 is empty');
      }
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.ttAlternativeApproveNowCheckBox.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.ttGetChallengeSMSButton);
    await pages.TelegraphicTransferPage.safeFill(pages.TelegraphicTransferPage.ttGetChallengeInput, testData.TelegraphicTransfer.challengeResponse);
    await pages.TelegraphicTransferPage.safeClick(pages.TelegraphicTransferPage.newTTsubmitButton);
    await pages.TelegraphicTransferPage.ttApproveButton.evaluate(el => (el as HTMLElement).click());
    await pages.TelegraphicTransferPage.waitForDeletePaymentSuccess();
    await pages.TelegraphicTransferPage.waitForRejectTransactionID();
    const reference = await pages.TelegraphicTransferPage.getRejectReferenceID();
    console.log('Captured referenceID:', reference);

    await pages.TelegraphicTransferPage.ttSaveAsDraftDismissButton.evaluate(el => (el as HTMLElement).click());
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.TelegraphicTransferPage.newTTWaitForViewPaymentPageReady();
    await expect(pages.TelegraphicTransferPage.newTTFromAccountViewLabel).toContainText(testData.TelegraphicTransfer.fromAccountEP);
    await expect(pages.TelegraphicTransferPage.newTTRefStatusLabel).toContainText("Completed");

});

  


































});