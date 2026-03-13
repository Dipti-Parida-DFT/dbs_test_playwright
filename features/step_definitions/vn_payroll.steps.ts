import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../pages/IDEALX/index';

const testDataPath = path.resolve(__dirname, '../data/VN_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// NOTE: The canonical Given 'the user is authenticated and on the Pay & Transfer menu' has been
// moved to tests/step-definitions/common.steps.ts to avoid duplicate step definitions across files.

When('the user opens Payroll form and adds a new payee', async function () {
  await this.pages.AccountTransferPage.safeClick(this.pages.AccountTransferPage.paymentMenu);
  await this.pages.AccountTransferPage.handleAuthIfPresent('1111');
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.payroll);
  await this.pages.PayrollPage.waitForPayrollFormReady();

  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.fromAccount);
  await this.page.keyboard.type(testData.Payroll.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  const newPayee = await this.pages.PayrollPage.addNewPayee({
    name: testData.Payroll.newPayeeName,
    nickName: testData.Payroll.newPayeeNickName,
    bankId: testData.Payroll.SIT.payeeBankID,
    accountNumber: testData.Payroll.newPayeeAcctNumber,
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push(newPayee);
});

When('sets an amount greater than the allowed maximum', async function () {
  await this.pages.PayrollPage.safeFill(this.pages.PayrollPage.amount, testData.Payroll.moreThanMaxAmountIx);
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.showOptionalDetails);
  await this.pages.PayrollPage.safeFill(this.pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);
});

Then('an inline error and a banner error should be shown', async function () {
  await expect(this.pages.PayrollPage.amountInlineError).toContainText(testData.Payroll.amountErrorTip);
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.nextButton);
  const globalError = this.page.locator([
    '.alert.alert-error', '.error', '.error-message', '.form-error',
    '.toast', '.toast-error', '.alert', '.alert-danger',
    '.ant-message', '.ant-message-error', '.ant-notification-notice',
    '.MuiAlert-root', '.invalid-feedback'
  ].join(', '));
  await expect(globalError).toBeVisible({ timeout: 30000 });
  await expect(globalError).toContainText(testData.Payroll.errorMessage);
});

When('sets an amount equal to the maximum and submits', async function () {
  // Fill amount = max and submit through preview
  await this.pages.PayrollPage.safeFill(this.pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.showOptionalDetails);
  await this.pages.PayrollPage.safeFill(this.pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.nextButton);
  await this.pages.PayrollPage.waitForPreviewPageReady();
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.submitButton);
  await this.pages.PayrollPage.waitForSubmittedPageReady();

  // capture reference for later lookup
  this.reference = await this.pages.PayrollPage.getReferenceID();
});

Then('the payment should be created and retrievable by reference', async function () {
  const reference = this.reference ?? (await this.pages.PayrollPage.getReferenceID());
  // Find it in Transfer Center
  await this.pages.AccountTransferPage.safeClick(this.pages.AccountTransferPage.paymentMenu);
  await this.pages.TransferCentersPage.searchAndOpenByReference(reference);
  await this.pages.PayrollPage.waitForViewPaymentPageReady();

  // Basic assertions
  await expect(this.pages.PayrollPage.fromAccountViewLabel).toContainText(testData.Payroll.SIT.fromAccount);
  await expect(this.pages.PayrollPage.amountViewLabel).toContainText(testData.Payroll.maxAmount);
});

When('the user composes a payroll with multiple items that exceed the total limit', async function () {
  // Open payroll form and select from account (reuse earlier step's behavior)
  await this.pages.AccountTransferPage.safeClick(this.pages.AccountTransferPage.paymentMenu);
  await this.pages.AccountTransferPage.handleAuthIfPresent('1111');
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.payroll);
  await this.pages.PayrollPage.waitForPayrollFormReady();

  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.fromAccount);
  await this.page.keyboard.type(testData.Payroll.SIT.fromAccount);
  await this.page.keyboard.press('Enter');

  // Add a new payee
  const { nickName, accountNumber } = await this.pages.PayrollPage.addNewPayee({
    name: testData.Payroll.newPayeeName,
    nickName: testData.Payroll.newPayeeNickName,
    bankId: testData.Payroll.SIT.payeeBankID,
    accountNumber: testData.Payroll.newPayeeAcctNumber,
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ nickName, accountNumber });

  // Set amount = max for the first item
  await this.pages.PayrollPage.safeFill(this.pages.PayrollPage.amount, testData.Payroll.maxAmountIx);
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.showOptionalDetails);
  await this.pages.PayrollPage.safeFill(this.pages.PayrollPage.paymentDetailsTextarea, testData.Payroll.paymentDetails);

  // Add an existing payee to exceed the total
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.existingPayeeTabHeader);
  await this.pages.PayrollPage.safeFill(this.pages.PayrollPage.existingPayeeFilter, testData.Payroll.bulkExistingPayee);
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.addExistingPayeeButton);

  // Set amount for the added existing payee
  await this.pages.PayrollPage.amount.first().fill(testData.Payroll.maxAmountIx);
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.showOptionalDetails);
  await this.pages.PayrollPage.paymentDetailsTextarea.first().fill(testData.Payroll.paymentDetails);

  // Submit
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.nextButton);
  await this.pages.PayrollPage.waitForPreviewPageReady();
  await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.submitButton);
  await this.pages.PayrollPage.waitForSubmittedPageReady();

  // store reference
  this.reference = await this.pages.PayrollPage.getReferenceID();
});

Then('the payment should be submitted and visible in Transfer Center', async function () {
  const reference = this.reference ?? (await this.pages.PayrollPage.getReferenceID());
  await this.pages.AccountTransferPage.safeClick(this.pages.AccountTransferPage.paymentMenu);
  await this.pages.TransferCentersPage.waitForTransferCenterReady();
  await this.pages.TransferCentersPage.searchAndOpenByReference(reference);
  await this.pages.PayrollPage.waitForViewPaymentPageReady();
  await expect(this.pages.PayrollPage.fromAccountViewLabel).toContainText(testData.Payroll.SIT.fromAccount);
});
