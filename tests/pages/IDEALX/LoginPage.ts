import { Page, Locator } from '@playwright/test';
import { WebComponents } from '../../lib/components';
import loginCredentials from '../../data/loginCredentials.json';
const DEFAULT_REGION = 'Singapore';

export class LoginPage {
  readonly page: Page;
  readonly orgIdInput: Locator;
  readonly userIdInput: Locator;
  readonly pinInput: Locator;
  readonly loginButton: Locator;
  readonly postLoginIndicator: Locator;
  readonly authenticate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orgIdInput = page.locator('input[name="orgId"], input[placeholder*="Organisation" i]');
    this.userIdInput = page.locator('input[name="userId"], input[placeholder*="User" i]');
    this.pinInput = page.locator('input[type="password"], input[placeholder*="PIN" i]');
    this.loginButton = page.locator('button:has-text("Login"), button[type="submit"]');
    // Use a unique selector for the Pay & Transfer nav item
    this.postLoginIndicator = page.locator('#nav-item-navBBTopPaymentsLinkText');
    this.authenticate = page.locator('//button[@type="button" and @class="btn btn__primary"]');
  }

  async goto() {
    await this.page.goto('https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin');
    //await this.page.setViewportSize({ width: 1920, height: 1080 })
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
  await this.page.waitForTimeout(70000); // Wait for potential redirects
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