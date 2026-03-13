// pages/base/Page.ts
import { Page as PWPage, Locator, expect, Frame } from '@playwright/test';

/**
 * Base Page class for Playwright.
 * - Provides common message locators + helpers (success/error/info/warning).
 * - Provides reference ID extraction from alert panels.
 * - Provides scroll helpers and an iframe utility.
 *
 * NOTE: We renamed Chinese-styled names to clear English:
 *   - jiazhai()                      -> waitForPageReady()
 *   - huoQuIdealxInfoReferenceID()   -> getIdealxInfoReferenceId()
 */
export abstract class Page {
  protected readonly page: PWPage;

  // ----- Message panels / banners -----
  protected readonly uxSuccessMsg: Locator;
  protected readonly uxErrorMsg: Locator;
  protected readonly uxIxErrorMsg: Locator;     // IdealX error (current)
  protected readonly uxIxErrorMsgLegacy: Locator; // legacy variant
  protected readonly uxInfoMsg: Locator;
  protected readonly idealXInfoMsg: Locator;
  protected readonly recurringInfoMsg: Locator;
  protected readonly auditConfirmationInfoMsg: Locator;
  protected readonly uxWarningMsg: Locator;

  // I3-related (kept as-is because it's a product name in your codebase)
  protected readonly i3InfoMsg: Locator;

  // Dialog info (reject/save)
  protected readonly uxRejectDialogInfoMsg: Locator;

  // Trade info
  protected readonly tradeInfoMsg: Locator;

  // SAM messages
  protected readonly samInfoMsg: Locator;
  protected readonly samSuccessMsg: Locator;

  // Files exchange dialog
  protected readonly filesExchangeSuccessMsg: Locator;

  constructor(page: PWPage) {
    this.page = page;

    // Match your original XPaths (unchanged selectors)
    this.uxSuccessMsg = page.locator('xpath=//top-panel/div/div[starts-with(@class, "alert alert-success")]/ul');
    this.uxErrorMsg   = page.locator('xpath=//top-panel/div/div[starts-with(@class, "alert alert-error")]/ul');
    this.uxIxErrorMsgLegacy = page.locator('xpath=//dbs-top-panel/div/div[starts-with(@class, "alert alert-error")]');
    this.uxIxErrorMsg = page.locator('xpath=//div[@class="alert__container--error ng-star-inserted"]');
    this.uxInfoMsg    = page.locator('xpath=//top-panel/div/div[starts-with(@class, "alert alert-info")]/ul');
    this.idealXInfoMsg = page.locator('xpath=//dbs-top-panel/div/div[starts-with(@class, "alert alert-info")]/ul');
    this.recurringInfoMsg = page.locator('xpath=//dbs-top-panel/div/div[starts-with(@class, "alert alert-info")]/ul');
    this.auditConfirmationInfoMsg = page.locator('xpath=//div[@id="referNoDiv"]/label[2]');
    this.uxWarningMsg = page.locator('xpath=//top-panel/div/div[starts-with(@class, "alert alert-warning")]/ul');

    this.i3InfoMsg = page.locator('xpath=//*[@id="my_list"]/li');

    this.uxRejectDialogInfoMsg = page.locator('xpath=//p[@id="dialogMessage"]');

    this.tradeInfoMsg = page.locator('xpath=//*[@id="divMessages"]/div[1]/div/div[2]/li');

    this.samInfoMsg = page.locator('xpath=//*[@id="msgBlockError-errorText"]/b');
    this.samSuccessMsg = page.locator('xpath=//*[@id="msgBlockSuccess-successText"]/b');

    this.filesExchangeSuccessMsg = page.locator('xpath=//div[@id="filesExchangeInfoDiv"]');
  }

  // ---------------------------------------------------------------------------
  // Waits / Navigation helpers
  // ---------------------------------------------------------------------------

  /** Former: jiazhai() — generic "page ready" hook (no recursion) */
  async waitForPageReady(_timeout = 10_000): Promise<void> {
    // If you have a global spinner/test-id overlay, you can add it here.
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Former: pageSwitchToI3() — Placeholder (no-op). Add implementation if needed. */
  async pageSwitchToI3(): Promise<void> {
    // If your app has a toggle to switch shells, implement it here.
  }

  /** Former: pageSwitchToUX() — Placeholder (no-op). Add implementation if needed. */
  async pageSwitchToUX(): Promise<void> {
    // If your app has a toggle to switch shells, implement it here.
  }

  /**
   * Former: pageSwitchIframe(iframe: string)
   * Execute a function within a specific iframe located by a selector/XPath.
   */
  async withinIframe<T>(iframeSelector: string, fn: (frame: Frame) => Promise<T>): Promise<T> {
    const handle = await this.page.locator(iframeSelector.startsWith('xpath=') ? iframeSelector : `xpath=${iframeSelector}`).elementHandle();
    if (!handle) throw new Error(`Iframe not found for selector: ${iframeSelector}`);
    const frame = await handle.contentFrame();
    if (!frame) throw new Error(`No content frame for selector: ${iframeSelector}`);
    return fn(frame);
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as ScrollBehavior }));
  }

  async scrollTo(x: number, y: number): Promise<void> {
    await this.page.evaluate(([tx, ty]) => window.scrollTo(tx, ty), [x, y]);
  }

  // ---------------------------------------------------------------------------
  // Message helpers (contains / get text / reference extraction)
  // ---------------------------------------------------------------------------

  /** Get combined text (lowercased) of a message container */
  protected async getText(locator: Locator, timeout = 8_000): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout }).catch(() => {});
    const txt = await locator.textContent().catch(() => null);
    return (txt ?? '').trim();
  }

  /** Case-insensitive "contains" check for a message locator */
  protected async containsText(locator: Locator, msg: string, timeout = 8_000): Promise<boolean> {
    const containerText = (await this.getText(locator, timeout)).toLowerCase();
    return containerText.includes((msg ?? '').toLowerCase());
  }

  // ---- English-renamed public helpers ----

  async hasUxSuccessMessage(msg: string): Promise<boolean> {
    return this.containsText(this.uxSuccessMsg, msg);
  }

  async hasUxErrorMessage(msg: string): Promise<boolean> {
    // Check both current and legacy containers for safety
    return (await this.containsText(this.uxErrorMsg, msg)) || (await this.containsText(this.uxIxErrorMsg, msg)) || (await this.containsText(this.uxIxErrorMsgLegacy, msg));
  }

  /** Legacy methods kept with clearer names (old code had hasUXIxErrorMsg / hasUXIxErrorMsg1) */
  async hasIdealxErrorMessage(msg: string): Promise<boolean> {
    return this.containsText(this.uxIxErrorMsg, msg);
  }
  async hasIdealxErrorMessageLegacy(msg: string): Promise<boolean> {
    return this.containsText(this.uxIxErrorMsgLegacy, msg);
  }

  async hasUxInfoMessage(msg: string): Promise<boolean> {
    return this.containsText(this.uxInfoMsg, msg);
  }

  async hasIdealxInfoMessage(msg: string): Promise<boolean> {
    return this.containsText(this.idealXInfoMsg, msg);
  }

  async getUxInfoMessage(): Promise<string> {
    return this.getText(this.uxInfoMsg);
  }

  async hasUxWarningMessage(msg: string): Promise<boolean> {
    return this.containsText(this.uxWarningMsg, msg);
  }

  async hasI3InfoMessage(msg: string): Promise<boolean> {
    return this.containsText(this.i3InfoMsg, msg);
  }

  async hasRejectDialogInfoMessage(msg: string): Promise<boolean> {
    return this.containsText(this.uxRejectDialogInfoMsg, msg);
  }

  async hasTradeInfoMessage(msg: string): Promise<boolean> {
    return this.containsText(this.tradeInfoMsg, msg);
  }

  async hasSamInfoMessage(msg: string): Promise<boolean> {
    return this.containsText(this.samInfoMsg, msg);
  }

  async hasSamSuccessMessage(msg: string): Promise<boolean> {
    return this.containsText(this.samSuccessMsg, msg);
  }

  async hasFilesExchangeDialogInfoMessage(msg: string): Promise<boolean> {
    return this.containsText(this.filesExchangeSuccessMsg, msg);
  }

  // ---------------------------------------------------------------------------
  // Reference ID helpers (English names)
  // ---------------------------------------------------------------------------

  async getInfoReferenceId(): Promise<string> {
    return this.extractReferenceFrom(this.uxInfoMsg);
  }

  /** Former: huoQuIdealxInfoReferenceID() */
  async getIdealxInfoReferenceId(): Promise<string> {
    return this.extractReferenceFrom(this.idealXInfoMsg);
  }

  async getRecurringReferenceId(): Promise<string> {
    return this.extractReferenceFromDialog(this.recurringInfoMsg);
  }

  async getAuditConfirmationReferenceId(): Promise<string> {
    return this.extractReferenceFromDialog(this.auditConfirmationInfoMsg);
  }

  async getDialogReferenceId(): Promise<string> {
    return this.extractReferenceFromDialog(this.uxRejectDialogInfoMsg);
  }

  async getI3ReferenceId(): Promise<string> {
    return this.extractReferenceFromDialog(this.i3InfoMsg);
  }

  // ---------------------------------------------------------------------------
  // Internals: extract reference patterns like "EBxxxx..." from message text
  // ---------------------------------------------------------------------------

  /**
   * Extract first "EB..." token from a list/info panel (anywhere in its text).
   * Original Protractor used a regex like /(\EB(\w+))\ / which looked malformed.
   * We replace with a robust /(EB\w+)/.
   */
  protected async extractReferenceFrom(locator: Locator, timeout = 12_000): Promise<string> {
    const text = await this.getText(locator, timeout);
    const m = text.match(/(EB\w+)/);
    return m?.[1] ?? '';
  }

  /** Extract "EB..." token from a dialog-like single node */
  protected async extractReferenceFromDialog(locator: Locator, timeout = 12_000): Promise<string> {
    const text = await this.getText(locator, timeout);
    const m = text.match(/(EB\w+)/);
    return m?.[1] ?? '';
  }
}