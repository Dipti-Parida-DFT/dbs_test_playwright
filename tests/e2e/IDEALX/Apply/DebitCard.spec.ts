import { test } from '@playwright/test';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { ApplyPage } from '../../../pages/IDEALX/Apply/ApplyDebitCard';
import loginCredentials from '../../../data/loginCredentials.json';

test.describe('Apply → Debit Card affiliate gating', () => {

  test('TC001: SG affiliate can view Debit Card section', async ({ page }) => {
    test.setTimeout(180000);
    const loginPage = new LoginPage(page);
    const applyPage = new ApplyPage(page);
    await loginPage.goto();
    await loginPage.login(
      loginCredentials.Singapore.orgId,
      loginCredentials.Singapore.userId,
      loginCredentials.Singapore.pin
    );
    await applyPage.assertPostLogin();
    await applyPage.openApplyPanel();
    await applyPage.assertDebitCardVisible();
  });

  test('TC002: Non-SG affiliate cannot view Debit Card section', async ({ page }) => {
    test.setTimeout(180000); 
    const loginPage = new LoginPage(page);
    const applyPage = new ApplyPage(page);
    await loginPage.goto();
    await loginPage.login(
      loginCredentials.NonSingapore.orgId,
      loginCredentials.NonSingapore.userId,
      loginCredentials.NonSingapore.pin
    );
    await applyPage.assertPostLogin();
    await applyPage.openApplyPanel();
    await applyPage.assertDebitCardNotVisible();
  });

});
