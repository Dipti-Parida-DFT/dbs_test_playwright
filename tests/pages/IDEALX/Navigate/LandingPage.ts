// pages/LandingPage.ts
import { Page, Locator, expect } from '@playwright/test';

export type LoginParams = {
  qs?: string;
  subOrgId?: string;
  isSingleView?: string;
};

export class LandingPage {
  // Store last parsed login params if you want to reuse them later
  public lastLoginParams: LoginParams | null = null;

  constructor(private readonly page: Page) {
    // --- Top actions / navigation ---
    this.logoutButton = page.locator('xpath=//*[@id="page-container"]/my-app/main-page/mast-head/div/div[2]/header/div[2]');
    this.homeMenu = page.locator('xpath=//*[@id="navBBTopDashLinkText"]');
    this.payNowContinueButton = page.locator('xpath=//*[@id="Close"]');

    // Iframe (we only read its src here)
    this.topIframe = page.locator('xpath=//*[@id="iframe_top"]');
  }

  // ---------- Locators ----------
  readonly logoutButton: Locator;
  readonly homeMenu: Locator;
  readonly payNowContinueButton: Locator;
  readonly topIframe: Locator;

  // ---------- Actions & Waits (Chinese names → English) ----------

  /** Former: handlerPayNow() — Clicks the “Continue” (PayNow) button after it is visible. */
  async handlePayNow(): Promise<void> {
    await this.waitForPayNowOverlayReady();
    await this.payNowContinueButton.click();
  }

  /** Former: jiazhai() — Wait until the PayNow overlay (Continue button) is visible. */
  async waitForPayNowOverlayReady(timeout = 15_000): Promise<void> {
    await expect(this.payNowContinueButton).toBeVisible({ timeout });
  }

  /** Former: logoutCB() — Waits and clicks logout. */
  async logout(): Promise<void> {
    // If your app needs the PayNow overlay to resolve first, keep the wait below.
    // Otherwise, you can directly wait on logoutButton.
    try {
      // In some flows PayNow overlay appears immediately after login.
      await this.waitForPayNowOverlayReady(3000);
    } catch {
      // Ignore if not shown—proceed to logout
    }
    await expect(this.logoutButton).toBeVisible({ timeout: 15_000 });
    await this.logoutButton.click();
  }

  /**
   * Former: saveLoginParams()
   * Reads the top iframe's `src` and extracts `qs`, `subOrgId`, `isSingleView` from its query string.
   * Returns the parsed params and also stores them in `this.lastLoginParams`.
   */
  async saveLoginParams(): Promise<LoginParams> {
    const src = (await this.topIframe.getAttribute('src')) ?? '';

    // Safely parse possible relative/absolute URLs; fallback to manual query parsing
    let search = '';
    try {
      // Try to build a URL; if `src` is relative, use the current page URL as base
      const currentUrl = this.page.url();
      const parsed = new URL(src, currentUrl);
      search = parsed.search; // includes leading "?"
    } catch {
      // Fallback: extract the query part manually
      const qIndex = src.indexOf('?');
      search = qIndex >= 0 ? src.slice(qIndex) : '';
    }

    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

    const result: LoginParams = {
      qs: params.get('qs') ?? undefined,
      subOrgId: params.get('subOrgId') ?? undefined,
      isSingleView: params.get('isSingleView') ?? undefined,
    };

    this.lastLoginParams = result;
    return result;
  }
}