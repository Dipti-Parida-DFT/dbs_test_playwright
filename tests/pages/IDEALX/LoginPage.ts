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
  readonly acknowledgeChkBox: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orgIdInput = page.locator('input[name="orgId"], input[placeholder*="Organisation" i]');
    this.userIdInput = page.locator('input[name="userId"], input[placeholder*="User" i]');
    this.pinInput = page.locator('input[type="password"], input[placeholder*="PIN" i]');
    this.loginButton = page.locator('button:has-text("Login"), button[type="submit"]');
    //Handle Acknowledgement pop-up if it appears
    this.authenticate = page.locator('//button[normalize-space()="I acknowledge"]');
    this.acknowledgeChkBox = page.locator('//label[@for="checkbox"]');
    this.closeButton = page.locator('button:has(svg)');
    // Use a unique selector for the Pay & Transfer nav item
    this.postLoginIndicator = page.locator('#nav-item-navBBTopPaymentsLinkText');
  }

  async handleAnnouncementIfPresent() {
    const acknowledgeBtn = this.authenticate;
 
    if (await acknowledgeBtn.isVisible({ timeout: 20_000 }).catch(() => false)) {
        await this.acknowledgeChkBox.check();
        await acknowledgeBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.closeButton.click();
    }
  }

  async goto() {
    await this.page.goto('https://10.8.58.138:8443/iws/ssologin');
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
  await this.page.waitForTimeout(120000); // Wait for potential redirects
  }

  async loginWithDefaultCredentials() {
    await this.login();
  }
}