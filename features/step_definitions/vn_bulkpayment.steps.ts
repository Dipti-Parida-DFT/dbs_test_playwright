import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../pages/IDEALX/index';
import { LoginPage } from '../pages/IDEALX/LoginPage';

const testDataPath = path.resolve(__dirname, '../data/VN_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// NOTE: The canonical Given 'the user is authenticated and on the Pay & Transfer menu' has been
// moved to tests/step-definitions/common.steps.ts to avoid duplicate step definitions across files.

When('the user opens Bulk Payment form and adds a new payee with amount above limit', async function () {
  const pages: PaymentsPages = this.pages;
  await pages.AccountTransferPage.paymentMenu.click();
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
  await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
  await this.page.keyboard.type(testData.BulkPayment.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  const { nickName, accountNumber } = await pages.PayrollPage.addNewPayee({
    name: testData.Payroll.newPayeeName,
    nickName: testData.Payroll.newPayeeNickName,
    bankId: testData.BulkPayment.SIT.payeeBankID,
    accountNumber: testData.Payroll.newPayeeAcctNumber,
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ nickName, accountNumber });

  await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.moreThanMaxAmountIx);
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
  await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);
});

Then('inline and banner error messages should be displayed', async function () {
  const pages: PaymentsPages = this.pages;
  await expect(pages.BulkPaymentPage.amountInlineError).toContainText(testData.BulkPayment.BulkamountErrorTip);
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
  const globalError = this.page.locator([
    '.alert.alert-error', '.error', '.error-message', '.form-error',
    '.toast', '.toast-error', '.alert', '.alert-danger',
    '.ant-message', '.ant-message-error', '.ant-notification-notice',
    '.MuiAlert-root', '.invalid-feedback'
  ].join(', '));
  await expect(globalError).toBeVisible({ timeout: 30000 });
  await expect(globalError).toContainText(testData.BulkPayment.errorMessage);
});

When('the user opens Bulk Payment form and adds a new payee with amount equal to max and submits', async function () {
  const pages: PaymentsPages = this.pages;
  await pages.AccountTransferPage.paymentMenu.click();
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
  await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
  await this.page.keyboard.type(testData.BulkPayment.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  const { nickName, accountNumber } = await pages.PayrollPage.addNewPayee({
    name: testData.Payroll.newPayeeName,
    nickName: testData.Payroll.newPayeeNickName,
    bankId: testData.BulkPayment.SIT.payeeBankID,
    accountNumber: testData.Payroll.newPayeeAcctNumber,
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ nickName, accountNumber });

  await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountIx);
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
  await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
  await pages.BulkPaymentPage.waitForPreviewPageReady();
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
  await pages.BulkPaymentPage.waitForSubmittedPageReady();

  this.reference = await pages.BulkPaymentPage.getReferenceID();
});

Then('the submitted payment can be searched by reference and validated', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = this.reference ?? (await pages.BulkPaymentPage.getReferenceID());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.BulkPaymentPage.waitForViewPaymentPageReady();
  await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(testData.BulkPayment.SIT.fromAccount);
});

When('the user adds multiple payees so total exceeds the limit and submits', async function () {
  const pages: PaymentsPages = this.pages;
  await pages.AccountTransferPage.paymentMenu.click({ force: true });
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
  await pages.BulkPaymentPage.waitForBulkPaymentFormReady();

  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
  await this.page.keyboard.type(testData.BulkPayment.SIT.fromAccount);
  await this.page.keyboard.press('Enter');

  const { nickName, accountNumber } = await pages.PayrollPage.addNewPayee({
    name: testData.Payroll.newPayeeName,
    nickName: testData.Payroll.newPayeeNickName,
    bankId: testData.BulkPayment.SIT.payeeBankID,
    accountNumber: testData.Payroll.newPayeeAcctNumber,
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ nickName, accountNumber });

  await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.maxAmountIx);
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
  await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

  // Add existing payee
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.existingPayeeTabIx);
  await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.existingPayeeFilter, testData.BulkPayment.bulkExistingPayee);
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.addButton);

  // Fill second item's amount
  await pages.BulkPaymentPage.amount.first().fill(testData.BulkPayment.maxAmountIx);
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
  await pages.BulkPaymentPage.paymentDetailsTextarea.first().fill(testData.BulkPayment.paymentDetails);

  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
  await pages.BulkPaymentPage.waitForPreviewPageReady();
  await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
  await pages.BulkPaymentPage.waitForSubmittedPageReady();

  this.reference = await pages.BulkPaymentPage.getReferenceID();
});

Then('the submitted payment should be retrievable and validated', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = this.reference ?? (await pages.BulkPaymentPage.getReferenceID());
  await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
  await pages.TransferCentersPage.waitForTransferCenterReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.BulkPaymentPage.waitForViewPaymentPageReady();
  await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(testData.BulkPayment.SIT.fromAccount);
});
