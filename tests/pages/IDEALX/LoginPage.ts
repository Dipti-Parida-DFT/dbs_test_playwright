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
  readonly acknowledgeButton: Locator;
  readonly doNotShowChkBox: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orgIdInput = page.locator('input[name="orgId"], input[placeholder*="Organisation" i]');
    this.userIdInput = page.locator('input[name="userId"], input[placeholder*="User" i]');
    this.pinInput = page.locator('input[type="password"], input[placeholder*="PIN" i]');
    this.loginButton = page.locator('button:has-text("Login"), button[type="submit"]');
    //Handle Acknowledgement pop-up if it appears
    this.acknowledgeButton = page.locator('//button[normalize-space()="I acknowledge"]');
    this.doNotShowChkBox = page.locator('//label[@for="checkbox"]');
    this.closeButton = page.locator('button:has(svg)');
    // Use a unique selector for the Pay & Transfer nav item
    this.postLoginIndicator = page.locator('#nav-item-navBBTopPaymentsLinkText');
  }

  async handleAnnouncementIfPresent() {
  // Assumes you're already on the page where the dialog may appear
  const footer = this.page.locator('.announcement-footer');

  // Try to detect quickly; return if not present (optional)
  const appeared = await footer.waitFor({ state: 'visible', timeout: 1200 })
    .then(() => true, () => false);

if (appeared) {
  // Locators inside the footer
  const doNotShowLabel = footer.locator('label[for="checkbox"]');
  const doNotShowInput = footer.locator('#checkbox');
  const acknowledgeBtn = footer.getByRole('button', { name: 'I acknowledge' });

  // Ensure all are visible/actionable
  await Promise.all([
    doNotShowLabel.waitFor({ state: 'visible', timeout: 3000 }),
    acknowledgeBtn.waitFor({ state: 'visible', timeout: 3000 }),
  ]);

  // Click the visible label to toggle the (possibly hidden) input
  await doNotShowLabel.check({ force: true });
  await acknowledgeBtn.click({ force: true });
}else {
  console.log('Announcement dialog not present, proceeding with login.');
}


  }

  async goto() {
    await this.page.goto('https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin');
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