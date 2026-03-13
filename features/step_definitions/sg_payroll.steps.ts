import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PaymentsPages } from '../pages/IDEALX/index';
import { LoginPage } from '../pages/IDEALX/LoginPage';
import { WebComponents } from '../lib/components';

const webComponents = new WebComponents();
const testDataPath = path.resolve(__dirname, '../data/SG_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

Given('the SG user is authenticated and on the Pay & Transfer menu', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(testData.Payroll.SIT.loginCompanyId, testData.Payroll.SIT.loginUserId, '123');
  this.pages = new PaymentsPages(this.page);
  await this.pages.AccountTransferPage.waitForMenu();
});

When('the user creates a payroll alternate with a new payee and submits', async function () {
  const pages: PaymentsPages = this.pages;
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.AccountTransferPage.paymentMenu,15000);
  await pages.AccountTransferPage.handleAuthIfPresent('1111');
  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.PayrollPage.payroll,15000);
  await pages.PayrollPage.waitForPayrollFormReady();

  await webComponents.clickWhenVisibleAndEnabledCustomWait(pages.PayrollPage.fromAccount,15000);
  await this.page.keyboard.type(testData.Payroll.SIT.fromAccount);
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  const { nickName, accountNumber } = await pages.PayrollPage.addNewPayeeWithAllDetails({
    name: testData.Payroll.newPayeeName,
    nickName: testData.Payroll.newPayeeNickName,
    bankId: testData.Payroll.SIT.payeeBankID,
    accountNumber: testData.Payroll.newPayeeAcctNumber,
  });
  this.createdPayees = this.createdPayees || [];
  this.createdPayees.push({ nickName, accountNumber });

  await pages.PayrollPage.enterNewPayeeAmountAndOptionalDetails(testData);
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.earliestAvailableDateCheckbox);
  await pages.PayrollPage.enterTransactionReferences(testData, true);
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
  await pages.PayrollPage.waitForPreviewPageReady();
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
  await pages.PayrollPage.waitForSubmittedPageReady();
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.finishButton);
  await pages.PayrollPage.waitForPayAndTransferPageReady();
});

Then('the payroll should be available in Transfer Center and its details should match expected values', async function () {
  const pages: PaymentsPages = this.pages;
  await pages.TransferCentersPage.searchAndOpenByReference(testData.Payroll.internalReference);
  await pages.PayrollPage.waitForViewPaymentPageReady();
  await pages.PayrollPage.validatePayeeOrRefrenceNoDetailsOfPayroll(testData,false,testData.Payroll.internalReference,false,false);
});

Given('an existing payroll has been created', async function () {
  // reuse previous step by creating one now
  await this.runStep('the SG user is authenticated and on the Pay & Transfer menu');
  await this.runStep('the user creates a payroll alternate with a new payee and submits');
});

When('the user edits the payroll via Transfer Center and resubmits', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.PayrollPage.getReferenceID();
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.finishButton);
  await pages.PayrollPage.waitForPayAndTransferPageReady();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.PayrollPage.waitForViewPaymentPageReady();
  await pages.PayrollPage.editAmountSGD(testData);
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.nextButton);
  await pages.PayrollPage.waitForPreviewPageReady();
  await webComponents.clickWhenVisibleAndEnabled(pages.PayrollPage.submitButton);
  await pages.PayrollPage.waitForSubmittedPageReady();
});

Then('the edited payroll should show updated values in Transfer Center', async function () {
  const pages: PaymentsPages = this.pages;
  const reference = await pages.PayrollPage.getReferenceID();
  await pages.TransferCentersPage.searchAndOpenByReference(reference);
  await pages.PayrollPage.waitForViewPaymentPageReady();
  await pages.PayrollPage.validatePayeeOrRefrenceNoDetailsOfPayroll(testData,true,reference,true,true);
});
