import { Page, Locator } from '@playwright/test';
import { WebComponents } from '../../lib/webComponents';
import loginCredentials from '../../data/loginCredentials.json';
import { TIMEOUT } from '../../lib/timeouts';
import { CONSTANTS } from '../../lib/constants';
const DEFAULT_REGION = 'Singapore';

export class LoginPage {
  readonly page: Page;
  readonly orgIdInput: Locator;
  readonly userIdInput: Locator;
  readonly pinInput: Locator;
  readonly loginButton: Locator;
  readonly postLoginIndicator: Locator;
  readonly dashboard: Locator;
  readonly authenticate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orgIdInput = page.locator('input[name="orgId"], input[placeholder*="Organisation" i]');
    this.userIdInput = page.locator('input[name="userId"], input[placeholder*="User" i]');
    this.pinInput = page.locator('input[type="password"], input[placeholder*="PIN" i]');
    this.loginButton = page.locator('button:has-text("Login"), button[type="submit"]');
    this.dashboard = page.locator('xpath=//span[normalize-space(text())="Dashboard"]');

    // Use a unique selector for the Pay & Transfer nav item
    this.postLoginIndicator = page.locator('#nav-item-navBBTopPaymentsLinkText');
    this.authenticate = page.locator('//button[@type="button" and @class="btn btn__primary"]');
  }

  async goto() {
    // 1) Normalize env to uppercase safely
    const env = (CONSTANTS.ENV ?? '').toUpperCase();

    // 2) Pick the right URL based on env
    let url: string;
    switch (env) {
      case 'SIT':
        url = CONSTANTS.SITURL;
        break;

      case 'UAT':
        url = CONSTANTS.UATURL;
        break;

      case 'PROD':
        url = CONSTANTS.PRODURL;
        break;

      default:
        throw new Error(`Unsupported ENV value: "${env}". Expected SIT | UAT | PROD.`);
    }

    // 3) Navigate with sensible waits/timeouts
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT.LONG });
  }

  async login(orgId?: string, userId?: string, pin?: string) {
    const webComponents = new WebComponents();
    const defaultCreds = loginCredentials[DEFAULT_REGION];
    const creds = {
      orgId: orgId ?? defaultCreds.orgId,
      userId: userId ?? defaultCreds.userId,
      pin: pin ?? defaultCreds.pin
    };

    await webComponents.enterText(this.orgIdInput, creds.orgId);
    await webComponents.enterText(this.userIdInput, creds.userId);
    await webComponents.enterText(this.pinInput, creds.pin);
    await this.loginButton.click();
    await webComponents.waitDashboardToBeVisible(this.dashboard); // Wait for Pay & Transfer is visible till (20_0000)
    //await this.page.waitForTimeout(TIMEOUT.MAX); // Wait for potential redirects
  }

  async loginWithDefaultCredentials() {
    await this.login();
  }

  async handleAnnouncementIfPresent() {
    const acknowledgeBtn = this.authenticate;
    if (await acknowledgeBtn.isVisible({ timeout: 20_000 }).catch(() => false)) {
        await acknowledgeBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}
 
}