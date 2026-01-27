import { test } from '@playwright/test';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { SG_AccountTransferPage } from '../../../pages/IDEALX/PayTransfer/SG_AccountTransferPage';
import loginCredentials from '../../../data/loginCredentials.json';

test('SG Account Transfer - Complete Payment Flow', async ({ page }) => {
  test.setTimeout(200_000);
  const loginPage = new LoginPage(page);
  const sgAccountTransferPage = new SG_AccountTransferPage(page);

  // Login to the application
  await loginPage.goto();
  await loginPage.login(loginCredentials.orgId, loginCredentials.userId, loginCredentials.pin);
  console.log(page.viewportSize());

  //await page.waitForTimeout(400000); // Wait for post-login processes to complete
  // Complete the SG Account Transfer flow
  await sgAccountTransferPage.completeSGAccountTransfer();

});