// pages/NavigatePages.ts
import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { NextPage } from './NextPage';
import { LandingPage } from './LandingPage';

/**
 * ENV handling:
 * Set ENV=SIT or ENV=UAT in your environment to mimic the old `SIT` flag.
 * Example (Windows PowerShell):  $env:ENV = "SIT"
 */
const SIT = (process.env.ENV?.toUpperCase() === 'SIT');

export { LoginPage, NextPage, LandingPage };

/**
 * NavigatePages (Playwright version)
 * - Holds references to child page objects and coordinates multi-step flows.
 * - Accepts Playwright's `Page` in constructor.
 */
export class NavigatePages {
  public readonly loginPage: LoginPage;
  public readonly nextPage: NextPage;
  public readonly landingPage: LandingPage;

  constructor(private readonly page: Page) {
    // These LoginPage/NextPage/LandingPage should be Playwright-based POMs.
    this.loginPage = new LoginPage(page);
    this.nextPage = new NextPage(page);
    this.landingPage = new LandingPage(page);
  }

  /**
   * Legacy flow: Corporate Banking login that required:
   *  1) loginCB(orgId, userId) step
   *  2) click Next
   *  3) optional landing handling when in SIT
   */
  public async loginCB(orgId: string, userId: string): Promise<void> {
    await this.loginPage.loginCB(orgId, userId);
    await this.nextPage.clickNext();

    if (SIT) {
      // If you previously had a PayNow handler in SIT, call it here.
      // await this.landingPage.handlePayNow();
    }

    // If you previously switched UX mode or saved login params, restore here as needed:
    // await this.landingPage.switchToNewUX();
    // await this.landingPage.saveLoginParams();
  }

  /**
   * SAM login variants (map to your Playwright LoginPage)
   */
  public async loginSAM(userId: string): Promise<void> {
    await this.loginPage.loginSAM(userId);
  }

  public async loginNewSAM(userId: string): Promise<void> {
    await this.loginPage.loginNewSAM(userId);
  }

  public async loginSSM(userId: string, orgId?: string): Promise<void> {
    await this.loginPage.loginSSM(userId, orgId);
  }

  /**
   * IDEALX login (org, user, PIN).
   * If you have a fixed login URL, pass it in via env or bake it into LoginPage.
   */
  public async loginIdealx(orgId: string, userId: string, pin: string): Promise<void> {
    await this.loginPage.loginIdealx(orgId, userId, pin);
  }

  /**
   * IDEALX SAM-only path
   */
  public async loginIdealXSAM(userId: string): Promise<void> {
    await this.loginPage.loginIdealXSAM(userId);
  }

  /**
   * IDEALX login with language selection.
   */
  public async loginIdealxForLang(orgId: string, userId: string, pin: string, lang: string): Promise<void> {
    await this.loginPage.loginIdealxForLang(orgId, userId, pin, lang);
  }
}