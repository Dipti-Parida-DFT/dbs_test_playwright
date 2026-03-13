import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../pages/IDEALX/index';
import { LoginPage } from '../pages/IDEALX/LoginPage';
import { WebComponents } from '../lib/components';

const webComponents = new WebComponents();
const testDataPath = path.resolve(__dirname, '../data/HK_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));


Given('the HK user is authenticated and on the Bulk Collection form', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(testData.BulkCollection.SIT.loginCompanyId, testData.BulkCollection.SIT.loginUserId, '123');
  this.pages = new PaymentsPages(this.page);
  await this.pages.AccountTransferPage.waitForMenu();
});

When('the user creates a new payer with full details and submits', async function () {
  const pages: PaymentsPages = this.pages;
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.AccountTransferPage.paymentMenu,15000);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.bulkCollection,15000);
  await pages.BulkCollectionPage.waitForBulkCollectionFormReady();

  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.fromAccount,15000);
  await this.page.keyboard.type(testData.BulkCollection.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.creditType);
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.creditTypeValueItemizedCredit);

  const { accountNumber } = await pages.BulkCollectionPage.addNewPayerWithAllDetails({
    name: testData.payer1.newPayeeName,
    bankId: testData.payer1.payeeBankID,
    accountNumber: testData.payer1.newPayeeAcctNumber,
    DDAReferenceNo: testData.payer1.DDAReference,
    MandateID: testData.payer1.mandateID
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ accountNumber });

  await pages.BulkCollectionPage.enterNewPayerAmountAndOptionalDetails(testData);
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.earliestAvailableDateCheckbox);
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.nextButton);
  await pages.BulkCollectionPage.waitForPreviewPageReady();
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.submitButton);
  await pages.BulkCollectionPage.waitForSubmittedPageReady();
});

Then('the created collection should be visible in Transfer Center and pass validation', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.BulkCollectionPage.getReferenceID();
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
  await pages.BulkCollectionPage.waitForPayAndTransferPageReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.BulkCollectionPage.waitForViewPaymentPageReady();
  await pages.BulkCollectionPage.validatePayerOrRefrenceNoDetailsOfBulkCollection(testData, reference);
});

When('the user composes a batch mixing existing and new payers with transaction codes 38 and 98 and submits', async function () {
  const pages: PaymentsPages = this.pages;
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.AccountTransferPage.paymentMenu,15000);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.bulkCollection,15000);
  await pages.BulkCollectionPage.waitForBulkCollectionFormReady();
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.fromAccount,15000);
  await this.page.keyboard.type(testData.BulkCollection.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.creditType);
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.creditTypeValueConsolidatedCredit);

  await webComponents.enterTextarea(pages.BulkCollectionPage.filterExistingPayee, testData.payer2.newPayeeName);
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.BulkCollectionPage.addButton);
  await pages.BulkCollectionPage.enterExtistingPayerAmountTransactionCodeAndParticulars(testData);

  const { accountNumber } = await pages.BulkCollectionPage.addNewPayerWithAllDetails({
    name: testData.payer1.newPayeeName,
    bankId: testData.payer1.payeeBankID,
    accountNumber: testData.payer1.newPayeeAcctNumber,
    DDAReferenceNo: testData.payer1.DDAReference,
    MandateID: testData.payer1.mandateID
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ accountNumber });

  await pages.BulkCollectionPage.enterNewPayerAmountOptionalDetailsWhenExistingPayerAdded(testData);
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.earliestAvailableDateCheckbox);
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.nextButton);
  await pages.BulkCollectionPage.waitForPreviewPageReady();
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.submitButton);
  await pages.BulkCollectionPage.waitForSubmittedPageReady();
});

Then('the batch should be validated in the view page and removed as part of cleanup', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.BulkCollectionPage.getReferenceID();
  await webComponents.clickWhenVisibleAndEnabled(pages.BulkCollectionPage.finishButton);
  await pages.BulkCollectionPage.waitForPayAndTransferPageReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.BulkCollectionPage.waitForViewPaymentPageReady();
  await pages.BulkCollectionPage.validatePayer2ConsolidateValueInBulkCollection(testData, reference);
  await pages.BulkCollectionPage.deleteOpenPayerOrReferenceNo(testData, reference);
});
