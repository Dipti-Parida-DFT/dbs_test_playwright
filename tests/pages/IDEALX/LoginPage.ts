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

  //SAM Locators
  readonly samUserIDInput: Locator;
  readonly samPwdInput: Locator;
  readonly samSecurityAccessCodeInput: Locator;
  readonly samLoginButton: Locator;
  readonly IdealxLogoutButton: Locator;
  readonly SAMLogoutButton: Locator;
  readonly IdealxDashboardLink: Locator;
  readonly SAMPostLoginIndicator: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.orgIdInput = page.locator('input[name="orgId"], input[placeholder*="Organisation" i]');
    this.userIdInput = page.locator('input[name="userId"], input[placeholder*="User" i]');
    this.pinInput = page.locator('input[type="password"], input[placeholder*="PIN" i]');
    this.loginButton = page.locator('button:has-text("Login"), button[type="submit"]');
    this.postLoginIndicator = page.locator('#nav-item-navBBTopPaymentsLinkText');
    this.IdealxDashboardLink = page.locator('//span[contains(@class,"nav-item__main-title") and normalize-space()="Dashboard"]');
    this.IdealxLogoutButton = page.locator('//div[@id="logout"]');
    //SAM Locators
    this.samUserIDInput = page.locator('xpath=//*[@id="UID"]');
    this.samPwdInput = page.locator('xpath=//*[@id="password"]');
    this.samSecurityAccessCodeInput = page.locator('xpath=//*[@id="sac"]');
    this.samLoginButton = page.locator('xpath=//*[@name="submit_csrLogin"]');
    this.SAMLogoutButton = page.locator('xpath=//a[@title="Logout and Exit this system"]');
    this.SAMPostLoginIndicator = page.locator('xpath=//a[text()="HOME" and @href="/samweb/csr/home"]');
    this.SAMPostLoginIndicator = page.locator('xpath=//td[@class="headline" and normalize-space()="Application Manager"]');
  }

  async goto() {
    //await this.page.goto('https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin');
    
  await this.page.goto(
    'https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin',
    {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    }
  );

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
  }


  async gotoSAM() {
    await this.page.goto('https://10.8.59.68:8443/samweb/csr/loginSSO');
  }
  
  async loginSAM(samUserID?: string) {
    const webComponents = new WebComponents();
    const defaultCreds = loginCredentials["SAM"];
    const creds = {
      samUserID: samUserID ?? defaultCreds.samUserID,
      samPWD: defaultCreds.samPWD,
      samSAC: defaultCreds.samSAC
    };
  
    await webComponents.enterText(this.samUserIDInput, creds.samUserID);
    await webComponents.enterText(this.samPwdInput, creds.samPWD);
    await webComponents.enterText(this.samSecurityAccessCodeInput, creds.samSAC);
    await this.samLoginButton.click();
    await this.SAMPostLoginIndicator.waitFor({ state: 'visible', timeout: 50000 });  
  }

  async loginWithDefaultCredentials() {
    await this.login();
  }
}