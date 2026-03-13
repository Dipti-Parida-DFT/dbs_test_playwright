// pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

type LoginUrls = {
  baseUrl?: string;      // for CB/SAM default entry
  idealxUrl?: string;    // for IDEALX login
  newSamUrl?: string;    // for new SAM flow
  ssmUrl?: string;       // for SSM flow
};

const isSIT = (process.env.ENV?.toUpperCase() === 'SIT');

export class LoginPage {
  constructor(private readonly page: Page) {
    // --- Common login fields ---
    this.organisationIdInput = page.locator('xpath=//*[@id="OID"]');
    this.userIdInput = page.locator('xpath=//*[@id="UID"]');
    this.passwordInput = page.locator('xpath=//*[@id="password"]');
    this.securityAccessCodeInput = page.locator('xpath=//*[@id="sac"]');
    this.languageSelect = page.locator('xpath=//*[@id="lang"]');
    this.vietnameseOption = page.locator('xpath=//*[@value="vi_vn"]');

    // SSM
    this.ssmOrganisationIdInput = page.locator('xpath=//*[@id="corpId"]');
    this.ssmUserIdInput = page.locator('xpath=//*[@id="username"]');

    // IDEALX (SIT / UAT shared)
    this.idealxOrgIdInput = page.locator('xpath=//*[@id="corpId"] | //*[@id="OID"]'); // support both ids
    this.idealxUserIdInput = page.locator('xpath=//*[@id="username"] | //*[@id="UID"]');
    this.idealxPinInput = page.locator('xpath=//*[@name="psw"] | //*[@id="PIN"]');

    // Top menus / post-login
    this.paymentMenu = page.locator('xpath=//*[@id="nav-item-navBBTopPaymentsLinkText"]');
    this.companyMenu = page.locator('xpath=//*[@class="header-company__name"]');

    // Digi popup (post-login MFA)
    this.digiTokenButton = page.locator('xpath=//*[@id="mat-dialog-0"]/dbs-mars-auth-dialog/div/div[2]/div[2]/button');
    this.digiEnterCodeInput = page.locator('xpath=//*[@id="mat-dialog-0"]/dbs-mars-auth-dialog/div/div[2]/ShuRu');
    this.authNowBar = page.locator('xpath=//div[@class="mat-dialog-actions"]'); // container if needed

    // IE SSL (not needed in Playwright, kept in case you still show similar elements)
    this.moreInfoLink = page.locator('xpath=//*[@id="moreInfoContainer"]/a');
    this.overrideLink = page.locator('xpath=//*[@id="overridelink"]');

    // Submit buttons
    this.cbSubmitButton = page.locator('xpath=//*[@name="submit_sbuserLogin"]');
    this.samSubmitButton = page.locator('xpath=//*[@name="submit_csrLogin"]');
    this.ssmSubmitButton = page.locator('xpath=//*[@id="id01"]/div/button');
    this.idealxSubmitButton = page.locator('xpath=//*[@type="submit"]');

    // CN acknowledgement flow
    this.cnCheckbox0 = page.locator('xpath=//*[@id="checkbox_0"]');
    this.cnCheckbox1 = page.locator('xpath=//*[@id="checkbox_1"]');
    this.cnAcknowledgeButton = page.locator('xpath=//*[@class="btn btn__primary"]');

    // UAT special flow
    this.loginWithOrgIdButton = page.locator('xpath=//login-pin/div/div[4]/div/login-form/div[1]/div[2]/button[1]');
    this.uatOrgIdInput = page.locator('xpath=//*[@id="OID"] | //*[@id="corpId"]');
    this.uatUserIdInput = page.locator('xpath=//*[@id="UID"] | //*[@id="username"]');
    this.uatPinInput = page.locator('xpath=//*[@id="PIN"] | //*[@name="psw"]');
    this.uatSacInput = page.locator('xpath=//*[@id="SAC"] | //*[@id="sac"]');
    this.enterCodeLink = page.locator('xpath=//*[@class="link-primary link-underline-opacity-0"]');
    this.enterCodeConfirmButton = page.locator('xpath=//swipe-prompt-modal/div[2]/div/button[1]');
    this.authenticateNowButton = page.locator('xpath=//*[@class="btn btn-lg btn-primary modal-button"]');
  }

  // ---------- Locators ----------
  readonly organisationIdInput: Locator;
  readonly userIdInput: Locator;
  readonly passwordInput: Locator;
  readonly securityAccessCodeInput: Locator;
  readonly languageSelect: Locator;
  readonly vietnameseOption: Locator;

  readonly ssmOrganisationIdInput: Locator;
  readonly ssmUserIdInput: Locator;

  readonly idealxOrgIdInput: Locator;
  readonly idealxUserIdInput: Locator;
  readonly idealxPinInput: Locator;

  readonly paymentMenu: Locator;
  readonly companyMenu: Locator;

  readonly digiTokenButton: Locator;
  readonly digiEnterCodeInput: Locator;
  readonly authNowBar: Locator;

  readonly moreInfoLink: Locator;
  readonly overrideLink: Locator;

  readonly cbSubmitButton: Locator;
  readonly samSubmitButton: Locator;
  readonly ssmSubmitButton: Locator;
  readonly idealxSubmitButton: Locator;

  readonly cnCheckbox0: Locator;
  readonly cnCheckbox1: Locator;
  readonly cnAcknowledgeButton: Locator;

  readonly loginWithOrgIdButton: Locator;
  readonly uatOrgIdInput: Locator;
  readonly uatUserIdInput: Locator;
  readonly uatPinInput: Locator;
  readonly uatSacInput: Locator;
  readonly enterCodeLink: Locator;
  readonly enterCodeConfirmButton: Locator;
  readonly authenticateNowButton: Locator;

  // ---------- Shared waits / helpers ----------
  async waitForUXLoading(extraSpinnerSelectors: string[] = []) {
    const spinnerSelectors = [
      '.ux-loading',
      '.loading',
      '.spinner',
      '.mat-progress-spinner',
      '.cdk-overlay-backdrop',
      ...extraSpinnerSelectors,
    ];
    for (const sel of spinnerSelectors) {
      const sp = this.page.locator(sel).first();
      try {
        if (await sp.isVisible({ timeout: 500 }).catch(() => false)) {
          await sp.waitFor({ state: 'hidden', timeout: 15_000 });
        }
      } catch { /* ignore */ }
    }
    await this.page.waitForLoadState('networkidle');
  }

  async safeClick(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  async safeFill(locator: Locator, value: string, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }

  async isVisible(locator: Locator, timeout = 1000) {
    return await locator.isVisible({ timeout }).catch(() => false);
  }

  // ---------- Replacements for old Chinese-named helpers ----------
  /** Former: jiazhai() — generic login form ready (for CB). */
  async waitForLoginFormReady(timeout = 15_000) {
    await expect(this.cbSubmitButton).toBeVisible({ timeout });
  }

  /** Former: loadIdealxCondition() — wait for IDEALX submit visible. */
  async waitForIdealxFormReady(timeout = 15_000) {
    await expect(this.idealxSubmitButton).toBeVisible({ timeout });
  }

  /** Former: loadSSMCondition() — wait for SSM submit visible. */
  async waitForSSMReady(timeout = 15_000) {
    await expect(this.ssmSubmitButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForMenu() — wait for post-login top menu. */
  async waitForTopMenuReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.companyMenu).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForDigiPopUp() — wait for digi popup button. */
  async waitForDigiPopupReady(timeout = 15_000) {
    await expect(this.digiTokenButton).toBeVisible({ timeout });
  }

  // ---------- Flows (Playwright versions) ----------

  /**
   * Corporate Banking login (CB)
   */
  async loginCB(orgId: string, userId: string, urls: LoginUrls = {}) {
    const baseUrl = urls.baseUrl ?? process.env.BASE_URL ?? process.env.IDEALX_URL ?? '/';
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.waitForLoginFormReady();

    await this.safeFill(this.organisationIdInput, orgId);
    await this.safeFill(this.userIdInput, userId);
    await this.safeClick(this.cbSubmitButton);
  }

  /**
   * SAM login (user + password + SAC).
   * Defaults to '123123' for password/SAC to mirror old code; override via params.
   */
  async loginSAM(
    userId: string,
    { password = '123123', sac = '123123', urls = {} }: { password?: string; sac?: string; urls?: LoginUrls } = {}
  ) {
    const baseUrl = urls.baseUrl ?? process.env.BASE_URL ?? process.env.IDEALX_URL ?? '/';
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    await this.waitForIdealxFormReady(); // original loaded same structure
    await this.safeFill(this.userIdInput, userId);
    await this.safeFill(this.passwordInput, password);
    await this.safeFill(this.securityAccessCodeInput, sac);
    await this.safeClick(this.samSubmitButton);
  }

  /**
   * New SAM login (same as SAM but potentially different entry URL).
   */
  async loginNewSAM(
    userId: string,
    { password = '123123', sac = '123123', urls = {} }: { password?: string; sac?: string; urls?: LoginUrls } = {}
  ) {
    const url = urls.newSamUrl ?? process.env.NEW_SAM_URL ?? process.env.BASE_URL ?? '/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });

    await this.waitForIdealxFormReady();
    await this.safeFill(this.userIdInput, userId);
    await this.safeFill(this.passwordInput, password);
    await this.safeFill(this.securityAccessCodeInput, sac);
    await this.safeClick(this.samSubmitButton);
  }

  /**
   * SSM login
   */
  async loginSSM(userId: string, orgId?: string, urls: LoginUrls = {}) {
    const url = urls.ssmUrl ?? process.env.SSM_URL ?? '/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });

    await this.waitForSSMReady();
    await this.safeFill(this.ssmUserIdInput, userId);
    if (orgId) {
      await this.safeFill(this.ssmOrganisationIdInput, orgId);
    }
    await this.safeClick(this.ssmSubmitButton);
  }

  /**
   * IDEALX login (SIT vs UAT flows retained).
   * - SIT: fill org/user/pin → submit → optional CN acknowledge → wait for menu.
   * - UAT: click "login with org id" → fill org/user/pin → submit → (optional) enter code → SAC → authenticate.
   */
  async loginIdealx(orgId: string, userId: string, pin: string, urls: LoginUrls = {}) {
    const url = urls.idealxUrl ?? process.env.IDEALX_URL ?? '/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.waitForIdealxFormReady();

    if (isSIT) {
      // SIT flow
      await this.safeFill(this.idealxOrgIdInput, orgId);
      await this.safeFill(this.idealxUserIdInput, userId);
      await this.safeFill(this.idealxPinInput, pin);
      await this.safeClick(this.idealxSubmitButton);

      // CN acknowledge flow
      if (orgId.includes('CN')) {
        if (await this.isVisible(this.cnCheckbox0)) await this.cnCheckbox0.click({ trial: false });
        if (await this.isVisible(this.cnCheckbox1)) await this.cnCheckbox1.click({ trial: false });
        if (await this.isVisible(this.cnAcknowledgeButton)) await this.cnAcknowledgeButton.click();
      }

      await this.waitForTopMenuReady();
    } else {
      // UAT flow
      if (await this.isVisible(this.loginWithOrgIdButton, 3000)) {
        await this.loginWithOrgIdButton.click();
      }

      await this.safeFill(this.uatOrgIdInput, orgId);
      await this.safeFill(this.uatUserIdInput, userId);
      await this.safeFill(this.uatPinInput, pin);
      await this.safeClick(this.idealxSubmitButton);

      // Optional "Enter Code" interstitial
      if (await this.isVisible(this.enterCodeLink, 8000)) {
        await this.enterCodeLink.click();
        if (await this.isVisible(this.enterCodeConfirmButton, 5000)) {
          await this.enterCodeConfirmButton.click();
        }
      }

      // SAC + Authenticate
      await this.safeFill(this.uatSacInput, '123123');
      await this.safeClick(this.authenticateNowButton);
    }
  }

  /**
   * IDEALX SAM-only quick path
   */
  async loginIdealXSAM(userId: string, urls: LoginUrls = {}) {
    const url = urls.newSamUrl ?? process.env.NEW_SAM_URL ?? process.env.IDEALX_URL ?? '/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.waitForLoginFormReady();

    await this.safeFill(this.userIdInput, userId);
    await this.safeClick(this.samSubmitButton);
  }

  /**
   * IDEALX login with language selection.
   * - Tries to select from a <select> if present; else fallback to clicking the option.
   * - Mirrors the CN acknowledge and optional digi popup behavior.
   */
  async loginIdealxForLang(
    orgId: string,
    userId: string,
    pin: string,
    lang: string,
    urls: LoginUrls = {}
  ) {
    const url = urls.idealxUrl ?? process.env.IDEALX_URL ?? '/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.waitForIdealxFormReady();

    // Language selection
    const selectHandled = await this.trySelectLanguage(lang);
    if (!selectHandled && lang.toLowerCase().includes('vi')) {
      // fallback to clicking the Vietnamese option if it's not a real <select>
      if (await this.isVisible(this.languageSelect)) await this.languageSelect.click();
      if (await this.isVisible(this.vietnameseOption)) await this.vietnameseOption.click();
    }

    // Credentials
    await this.safeFill(this.idealxOrgIdInput, orgId);
    await this.safeFill(this.idealxUserIdInput, userId);
    await this.safeFill(this.idealxPinInput, pin);
    await this.safeClick(this.idealxSubmitButton);

    if (orgId.includes('CN')) {
      if (await this.isVisible(this.cnCheckbox0)) await this.cnCheckbox0.click();
      if (await this.isVisible(this.cnCheckbox1)) await this.cnCheckbox1.click();
      if (await this.isVisible(this.cnAcknowledgeButton)) await this.cnAcknowledgeButton.click();
    }

    await this.waitForTopMenuReady();

    // Old UAT flow had a digi popup after navigating to Payments; keep optional handling
    if (!isSIT) {
      // Navigate to payments and handle digi popup if shown
      if (await this.isVisible(this.paymentMenu, 5000)) {
        await this.paymentMenu.click();
        if (await this.isVisible(this.digiTokenButton, 8000)) {
          await this.digiTokenButton.click();
          await this.digiEnterCodeInput.click();
          await this.digiEnterCodeInput.fill('123123');
          await this.digiTokenButton.click();
        }
      }
    }
  }

  // ---------- Internal helper ----------
  private async trySelectLanguage(langValue: string): Promise<boolean> {
    // Try using selectOption on #lang if it's an actual <select>
    const isSelect = await this.languageSelect.evaluate((el) => el.tagName?.toLowerCase() === 'select').catch(() => false);
    if (isSelect) {
      try {
        await this.languageSelect.selectOption({ value: langValue });
        return true;
      } catch {
        // try label fallback
        try {
          await this.languageSelect.selectOption({ label: langValue });
          return true;
        } catch {
          return false;
        }
      }
    }
    return false;
  }
}