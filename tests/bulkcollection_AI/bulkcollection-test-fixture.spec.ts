import { test as base, expect } from '@playwright/test';
import { LoginPage } from './bulkcollection-login-page.spec';
import { SecurityCodePage } from './bulkcollection-security-page.spec';
import { DashboardPage } from './bulkcollection-dashboard-page.spec';
import { TEST_DATA } from './bulkcollection-test-utils.spec';

/**
 * Custom Test Fixture
 * Provides pre-authenticated user state
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login and authenticate
    const loginPage = new LoginPage(page);
    const securityPage = new SecurityCodePage(page);

    await loginPage.navigateTo();
    await loginPage.login(TEST_DATA.ORGANISATION_ID, TEST_DATA.USER_ID, TEST_DATA.PIN);
    await page.waitForTimeout(2000);

    await securityPage.authenticate(TEST_DATA.SECURITY_CODE);
    await page.waitForTimeout(2000);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyDashboardLoaded();

    // Use the authenticated page
    await use(page);

    // Teardown: Logout (optional)
    await dashboardPage.logout().catch(() => {
      // Logout might fail if test fails earlier, so we catch it
    });
  },
});

export { expect };
