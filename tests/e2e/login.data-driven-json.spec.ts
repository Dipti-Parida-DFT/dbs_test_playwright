import { test, expect } from "@playwright/test";
import { loadCsv } from "../utils/loadCsv";
import { WebComponents } from "../lib/webComponents";
import { LoginPage } from "../pages/IDEALX/LoginPage";
import { TIMEOUT } from "../lib/timeouts";
import { loadJson } from "../utils/loadJSON";

const BASE =
  process.env.BASE_URL ?? "https://i3bku3uatqeweb01.qe.dragonflyft.com:1443";

const cases = loadJson("login-credentials.json") as Array<any>;

async function assertLoginSuccess(page) {
  await expect(page).toHaveURL(/\/idealx\//i);
}

async function assertLoginInvalid(page) {
  // Invalid credentials either redirect to the subscriber login page
  // or stay on the SSO login page (e.g. when fields are empty)
  const url = page.url();
  const redirectedToSubscriber = /\/loginSubscriberv?2?\/login\//i.test(url);
  const stayedOnSsoLogin = /\/iws\/ssologin/i.test(url);
  expect(redirectedToSubscriber || stayedOnSsoLogin).toBe(true);
}
test.describe('Test valid and invalid login scenarios', () => {
  for (const caseData of cases) {
    test(`Login (${caseData.caseName})`, async ({ page }) => {
      test.setTimeout(TIMEOUT.MAX);
      const loginPage = new LoginPage(page);
      const webComponents = new WebComponents();
      await loginPage.goto();
      await webComponents.enterText(loginPage.orgIdInput, caseData.orgId);
      await webComponents.enterText(loginPage.userIdInput, caseData.userId);
      await webComponents.enterText(loginPage.pinInput, caseData.pin);
      await loginPage.loginButton.click();
      
      if (caseData.expected === "success") {
        await assertLoginSuccess(page);
      } else {
        await assertLoginInvalid(page);
      }
    });
  }
});
