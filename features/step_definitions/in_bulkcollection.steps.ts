import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../pages/IDEALX/index';

const testDataPath = path.resolve(__dirname, '../data/IN_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// NOTE: The canonical Given 'the user is authenticated and on the Pay & Transfer menu' has been
// moved to tests/step-definitions/common.steps.ts to avoid duplicate step definitions across files.

When('the user opens Bulk Collection form, adds a new payee and provides optional details and submits', async function () {
  const pages: PaymentsPages = this.pages;
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.BulkCollectionPage.safeClick(pages.BulkCollectionPage.bulkCollection);
  await pages.BulkCollectionPage.waitForBulkCollectionFormReady();

  await pages.BulkCollectionPage.safeClick(pages.BulkCollectionPage.fromAccount);
  await this.page.keyboard.type(testData.BulkCollection.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  await pages.BulkCollectionPage.ucicCode.fill(testData.BulkCollection.UCICCode);

  const { name, accountNumber } = await pages.BulkCollectionPage.addNewPayee({
    name: testData.BulkCollection.newPayeeName,
    DDAReferenceNo: testData.BulkCollection.DDAreference,
    bankId: testData.BulkCollection.payeeBankID,
    accountNumber: testData.BulkCollection.payeeBankAccountNumber,
    MandateID: testData.BulkCollection.MandateID,
  });

  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ name, accountNumber });

  await pages.BulkCollectionPage.amount.fill(testData.BulkCollection.amount);
  await pages.BulkCollectionPage.payeeRef.fill(testData.BulkCollection.referenceForPayee);
  await pages.BulkCollectionPage.showOptionDetailPayee1.click();
  await pages.BulkCollectionPage.messageToPayer.click();
  await pages.BulkCollectionPage.emailId0.fill(testData.BulkCollection.emailIdO);
  await pages.BulkCollectionPage.emailId1.fill(testData.BulkCollection.emailId1);
  await pages.BulkCollectionPage.emailId2.fill(testData.BulkCollection.emailId2);
  await pages.BulkCollectionPage.emailId3.fill(testData.BulkCollection.emailId3);
  await pages.BulkCollectionPage.emailId4.fill(testData.BulkCollection.emailId4);
  await pages.BulkCollectionPage.message.fill(testData.BulkCollection.message);

  await pages.BulkCollectionPage.nextButton.click();
  await pages.BulkCollectionPage.waitForPreviewPageReady();
  await pages.BulkCollectionPage.submitButton.click();
  await pages.BulkCollectionPage.waitForSubmittedPageReady();
});

Then('the created Bulk collection should be locatable by reference and its view page fields should match expected values', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.BulkCollectionPage.getReferenceID();
  await pages.BulkCollectionPage.finishButton.click();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.BulkCollectionPage.waitForViewPaymentPageReady();

  // Basic assertions similar to checkViewPageAllField
  await expect(pages.BulkCollectionPage.amountValue).toContainText(testData.BulkCollection.amount);
  await expect(pages.BulkCollectionPage.transactionStatusValue).toContainText(testData.status.PendingApproval);
  await expect(pages.BulkCollectionPage.ucicCodeValue).toContainText(testData.BulkCollection.UCICCode);
  await expect(pages.BulkCollectionPage.payerNameValue).toContainText(testData.BulkCollection.newPayeeName);
});

Given('an existing Bulk collection is available', async function () {
  // create one now
  await this.runStep('the user is authenticated and on the Pay & Transfer menu');
  await this.runStep('the user opens Bulk Collection form, adds a new payee and provides optional details and submits');
});

When('the user edits the collection via Transfer Center and resubmits', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.BulkCollectionPage.getReferenceID();
  await pages.BulkCollectionPage.editButton.click();
  await pages.BulkCollectionPage.waitForBulkCollectionFormReady();
  await pages.BulkCollectionPage.amount.fill(testData.BulkCollection.editAmount);
  await pages.BulkCollectionPage.showOptionDetailPayee1.click();
  await pages.BulkCollectionPage.message.fill(testData.BulkCollection.messageEdit);
  await pages.BulkCollectionPage.nextButton.click();
  await pages.BulkCollectionPage.waitForPreviewPageReady();
  await pages.BulkCollectionPage.submitButton.click();
  await pages.BulkCollectionPage.waitForSubmittedPageReady();
});

Then('the edited collection should reflect the updated values in the view page', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.BulkCollectionPage.getReferenceID();
  await pages.BulkCollectionPage.finishButton.click();
  await pages.AccountTransferPage.paymentMenu.click();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.BulkCollectionPage.waitForViewPaymentPageReady();
  await expect(pages.BulkCollectionPage.amountValue).toContainText(testData.BulkCollection.editAmount);
});
