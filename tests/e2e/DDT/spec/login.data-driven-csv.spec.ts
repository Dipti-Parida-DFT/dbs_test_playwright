import { test, expect } from "@playwright/test";
import { loadCsv } from "../../../utils/loadCsv";
import { WebComponents } from "../../../lib/webComponents";
import { LoginPage } from "../../../pages/IDEALX/LoginPage";
import { TIMEOUT } from "../../../lib/timeouts";

const csvRows = loadCsv("tests/e2e/DDT/test-data/login-credentials.csv");

async function assertLoginSuccess(page) {
  await expect(page).toHaveURL(/\/idealx\//i);
}

async function assertLoginInvalid(page) {
  // Invalid credentials redirect to the Mars login page or stay on the SSO login page (e.g. when fields are empty)
  const url = page.url();
  const redirectedToSubscriber = /\/loginSubscriberv?2?\/login\//i.test(url);
  const stayedOnSsoLogin = /\/iws\/ssologin/i.test(url);
  expect(redirectedToSubscriber || stayedOnSsoLogin).toBe(true);
}
test.describe('Test valid and invalid login scenarios', () => {
  for (const row of csvRows) {
    test(`Login (${row.caseName})`, async ({ page }) => {
      test.setTimeout(TIMEOUT.MAX);
      const loginPage = new LoginPage(page);
      const webComponents = new WebComponents();
      await loginPage.goto();
      await webComponents.enterText(loginPage.orgIdInput, row.orgId);
      await webComponents.enterText(loginPage.userIdInput, row.userId);
      await webComponents.enterText(loginPage.pinInput, row.pin);
      await loginPage.loginButton.click();

      const assert = row.expectedResult === "success" ? assertLoginSuccess : assertLoginInvalid;
      await assert(page);
    });
  }
});
