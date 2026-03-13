import { Given } from '@cucumber/cucumber';
import { PaymentsPages } from '../pages/IDEALX/index';
import { LoginPage } from '../pages/IDEALX/LoginPage';
import loginCredentials from '../data/loginCredentials.json';
import fs from 'node:fs';
import path from 'node:path';

// Centralized canonical Given used by multiple feature step-definitions.
Given('the user is authenticated and on the Pay & Transfer menu', async function () {
  // Attach PaymentsPages helper to the world
  this.pages = new PaymentsPages(this.page);

  // If the Transfer menu is not present, try a best-effort login using environment credentials
  try {
    await this.pages.AccountTransferPage.waitForMenu();
    return;
  } catch (err) {
    // Not currently on the menu page. Try to detect a login page and perform a login if possible.
  }

  try {
    const loginPage = new LoginPage(this.page);
    // Attempt to navigate to login and perform login if credentials are provided via env vars.
    await loginPage.goto().catch(() => {});

    const companyId = process.env.TEST_COMPANY_ID;
    const userId = process.env.TEST_USER_ID;
    const password = process.env.TEST_PASSWORD || '123';

    if (companyId && userId) {
      await loginPage.login(companyId, userId, password);
    }
  } catch (e) {
    // ignore - we'll try to continue and let waitForMenu indicate failure
  }

  // Final attempt to wait for the Pay & Transfer menu
  await this.pages.AccountTransferPage.waitForMenu();
});

// Generic authenticated step (feature may use shorter phrasing)
Given('the user is authenticated', async function () {
  // reuse the canonical step behavior
  this.pages = this.pages || new PaymentsPages(this.page);

  try {
    await this.pages.AccountTransferPage.waitForMenu();
    return;
  } catch (e) {
    // attempt login using env or local credentials
  }

  const loginPage = new LoginPage(this.page);
  await loginPage.goto().catch(() => {});

  const companyId = process.env.TEST_COMPANY_ID || loginCredentials.Singapore?.orgId || loginCredentials.NonSingapore?.orgId;
  const userId = process.env.TEST_USER_ID || loginCredentials.Singapore?.userId || loginCredentials.NonSingapore?.userId;
  const password = process.env.TEST_PASSWORD || loginCredentials.Singapore?.pin || loginCredentials.NonSingapore?.pin || '1234';

  if (companyId && userId) {
    await loginPage.login(companyId, userId, password);
  }

  // ensure pages helper is available
  this.pages = this.pages || new PaymentsPages(this.page);
  await this.pages.AccountTransferPage.waitForMenu();
});

// Generic navigation step used by HK feature Background
Given('the user is on the Bulk Collection form', async function () {
  this.pages = this.pages || new PaymentsPages(this.page);
  await this.pages.AccountTransferPage.safeClick(this.pages.AccountTransferPage.paymentMenu);
  await this.pages.AccountTransferPage.handleAuthIfPresent('1111');
  await this.pages.BulkCollectionPage.safeClick(this.pages.BulkCollectionPage.bulkCollection);
  await this.pages.BulkCollectionPage.waitForBulkCollectionFormReady();
});

// HK-specific: Management Payroll background phrasing
Given('tttthe HK user is authenticated and on the Management Payroll page', async function () {
  this.pages = this.pages || new PaymentsPages(this.page);

  // Load HK test data if available
  try {
    const testDataPath = path.resolve(__dirname, '../data/HK_testData.json');
    const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(testData.ManagePayroll.SIT.loginCompanyId, testData.ManagePayroll.SIT.loginUserIdHKMP, '123');
  } catch (e) {
    // fallback to generic authenticated step
    await this.runStep('the user is authenticated');
  }

  // Ensure menu and navigate to Management Payroll
  await this.pages.AccountTransferPage.waitForMenu();
  try {
    await this.pages.AccountTransferPage.safeClick(this.pages.AccountTransferPage.paymentMenu);
    await this.pages.PayrollPage.safeClick(this.pages.PayrollPage.managePayroll);
    await this.pages.PayrollPage.waitForPayrollFormReady();
  } catch (e) {
    // ignore navigation errors here; the test will fail later if not on page
  }
});
