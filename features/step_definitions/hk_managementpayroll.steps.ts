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

Given('the HK user is authenticated and on the Management Payroll page', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(testData.ManagePayroll.SIT.loginCompanyId, testData.ManagePayroll.SIT.loginUserIdHKMP, '123');
  this.pages = new PaymentsPages(this.page);
  await this.pages.AccountTransferPage.waitForMenu();
});

When('the user creates a management payroll with a new payee and relevant particulars and submits', async function () {
  const pages: PaymentsPages = this.pages;
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.AccountTransferPage.paymentMenu,15000);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.PayrollPage.managePayroll,15000);
  await pages.PayrollPage.waitForPayrollFormReady();

  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.PayrollPage.fromAccount,15000);
  await this.page.keyboard.type(testData.ManagePayroll.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  const { accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetails({
    name: testData.ManagePayrollPayer1.newPayeeName,
    nickName: testData.ManagePayrollPayer1.newPayeeNickName,
    bankId: testData.ManagePayrollPayer1.payeeBankID,
    accountNumber: testData.ManagePayrollPayer1.newPayeeAcctNumber
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ accountNumber });

  await webComponents.enterTextarea(pages.PayrollPage.payeeParticulars, testData.ManagePayrollPayer1.particulars);

  await pages.PayrollPage.enterNewPayeeAllOtherDetails({
    amount: testData.ManagePayrollPayer1.amount,
    transactionCode: testData.ManagePayrollPayer1.transactionCode,
    referenceForPayee: testData.ManagePayrollPayer1.referenceForPayee,
    particulars: testData.ManagePayrollPayer1.particulars,
    paymentDetails: testData.ManagePayrollPayer1.paymentDetails,
    email1: testData.ManagePayrollPayer1.emailId0,
    email2: testData.ManagePayrollPayer1.emailId1,
    email3: testData.ManagePayrollPayer1.emailId2,
    email4: testData.ManagePayrollPayer1.emailId3,
    email5: testData.ManagePayrollPayer1.emailId4,
    emailMessage: testData.ManagePayrollPayer1.emailMessage
  });

  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.earliestAvailableDateCheckbox);
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
  await pages.PayrollPage.waitForPreviewPageReady();
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
  await pages.PayrollPage.waitForSubmittedPageReady();
});

Then('the created payroll should be searchable in Transfer Center and its details should match expected values', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.PayrollPage.getReferenceID();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.PayrollPage.waitForViewPaymentPageReady();

  await pages.PayrollPage.validatePayeeOrRefrenceNoDetails({
    fromAccountValue1: testData.ManagePayrollPayee1ValidationData.fromAccountValue1,
    fromAccountValue2: testData.ManagePayrollPayee1ValidationData.fromAccountValue2,
    paymentTypeValue: testData.ManagePayrollPayee1ValidationData.paymentTypeValue,
    amountDeductedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedValue,
    amountDeductedEditedValue: testData.ManagePayrollPayee1ValidationData.amountDeductedEditedValue,

    referenceValueUserProvided: testData.ManagePayrollPayer1.internalReferenceUserProvided,
    batchIdValueUserProvided: testData.ManagePayrollPayer1.batchIdValueUserProvided,

    paymentSummaryLabel: testData.ManagePayrollPayee1ValidationData.paymentSummaryLabel,
    totalPayeesLabel: testData.ManagePayrollPayee1ValidationData.totalPayeesLabel,
    totalPayeesValue: testData.ManagePayrollPayee1ValidationData.totalPayeesValue,
    totalAmountLabel: testData.ManagePayrollPayee1ValidationData.totalAmountLabel,
    totalAmountValue: testData.ManagePayrollPayee1ValidationData.totalAmountValue,
    totalAmountValueEdited: testData.ManagePayrollPayee1ValidationData.totalAmountValueEdited,

    payeeNameLabelValue: testData.ManagePayrollPayer1.newPayeeName,
    payeeNicknameLabelValue: testData.ManagePayrollPayer1.newPayeeNickName,
    bankNameLabelValue: testData.ManagePayrollPayee1ValidationData.bankNameLabelValue,
    bankSwiftBicLabelValue: testData.ManagePayrollPayee1ValidationData.bankSwiftBicLabelValue,
    accountNumberLabelValue: testData.ManagePayrollPayer1.newPayeeAcctNumber,
    statusLabelValue: testData.status.PendingApproval,

    amountLabelValue: testData.ManagePayrollPayer1.amount,
    amountEditedLabelValue: testData.ManagePayrollPayer1.amountEdited,
    transactionLabelValue: testData.ManagePayrollPayee1ValidationData.transactionCodeLabelValue,
    purposeCodeLabelValue: testData.ManagePayrollPayee1ValidationData.purposeCodeLabelValue,

    referenceForPayeeLabelValue: testData.ManagePayrollPayer1.referenceForPayee,
    particularsLabelValue: testData.ManagePayrollPayer1.particulars,

    paymentDetailsLabelValue: testData.ManagePayrollPayer1.paymentDetails,
    emailMessageLabelValue: testData.ManagePayrollPayer1.emailMessage,
    email1LabelValue: testData.ManagePayrollPayer1.emailId0,
    email2LabelValue: testData.ManagePayrollPayer1.emailId1,
    email3LabelValue: testData.ManagePayrollPayer1.emailId2,
    email4LabelValue: testData.ManagePayrollPayer1.emailId3,
    email5LabelValue: testData.ManagePayrollPayer1.emailId4
  }, reference);
});
