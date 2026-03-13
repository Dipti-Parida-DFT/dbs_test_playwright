import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/IDEALX/LoginPage';
import { ApplyPage } from '../pages/IDEALX/Apply/ApplyDebitCard';
import { AuthenticationDialog } from '../pages/IDEALX/AuthenticationPage';
import loginCredentials from '../data/loginCredentials.json';

Given('the application is reachable', async function () {
  // Optional ping step - navigate to root to ensure app loads
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

Given('an SG affiliate is logged in', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(
    loginCredentials.Singapore.orgId,
    loginCredentials.Singapore.userId,
    loginCredentials.Singapore.pin
  );
});

Given('a non-SG affiliate is logged in', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(
    loginCredentials.NonSingapore.orgId,
    loginCredentials.NonSingapore.userId,
    loginCredentials.NonSingapore.pin
  );
});

When('they navigate to the Apply page', async function () {
  const applyPage = new ApplyPage(this.page);
  const authenticationDialog = new AuthenticationDialog(this.page);
  await applyPage.applyNav.click();
  await authenticationDialog.handleIfPresent();
});

When('they authenticate and navigate to the Apply page', async function () {
  const applyPage = new ApplyPage(this.page);
  const authenticationDialog = new AuthenticationDialog(this.page);
  // some tests click an authenticate button first
  try { await authenticationDialog.authenticate.click(); } catch (e) { /* ignore */ }
  await applyPage.applyNav.click();
  await authenticationDialog.handleIfPresent();
});

Then('the Debit Card section should be visible', async function () {
  const applyPage = new ApplyPage(this.page);
  await applyPage.assertDebitCardVisible();
});

Then('the Debit Card section should not be visible', async function () {
  const applyPage = new ApplyPage(this.page);
  await applyPage.assertDebitCardNotVisible();
});
