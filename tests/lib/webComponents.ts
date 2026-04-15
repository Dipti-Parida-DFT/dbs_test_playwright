import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUT } from './timeouts';
import { CONSTANTS } from './constants';

export class WebComponents {

  constructor(private readonly defaultTimeout = TIMEOUT.MEDIUM) { }

  async clickElement(selector: any, p0: { state: string; timeout: number; }) {
    await selector.isVisible();
    await selector.click();
  }

  async getElementText(page: { textContent: (arg0: any) => any; }, selector: any) {
    await selector.isVisible();
    return await page.textContent(selector);
  }


  async enterText(target: Locator, value: string, timeout = TIMEOUT.MEDIUM) {
    await target.waitFor({ state: 'visible', timeout });
    await target.fill(value, { timeout });
  }


  /** 
   * Author: LC5741501
   * wait for Authenticate dialogue if present 
   * Created Date: 16/02/26
   */
  async handleAuthIfPresent(authDialog: Locator, securityAccessCode: Locator, authenticateButton: Locator) {

    const appears = await authDialog.waitFor({
      state: 'visible',
      timeout: TIMEOUT.LONG
    }).then(() => true).catch(() => false);
    //console.log('Authentication dialog appears:', appears);
    if (appears) {
      await securityAccessCode.fill(String(CONSTANTS.SECURITYACCESSCODE));
      await authenticateButton.click();
      //console.log('Handled authentication dialog with code:', code);
      await authDialog.waitFor({ state: 'hidden', timeout: TIMEOUT.MIN }).catch(() => { });
    }
  }



  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * This method take custom time to wait for the element before click
   * @param locator 
   * @param timeout 
   */
  //async clickWhenVisibleAndEnabledCustomWait(locator: Locator, timeout?: number) {
  //await expect(locator).toBeVisible({ timeout });
  //await expect(locator).toBeEnabled({ timeout });
  //await locator.click();
  //}

  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * This method take custom time to wait for the element before click
   * @param locator 
   * @param timeout 
   */
  async clickWhenVisibleAndEnabled(locator: Locator, timeout = TIMEOUT.LONG) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * This method is for Java script click
   * @param locator 
   * @param timeout 
   */
  async javaScriptsClick(locator: Locator) {
    await locator.evaluate((el: HTMLElement) => { el.click() });
  }

  
/**
 *  Author: LC5741501
 * Created Date: 16/02/26
 * Performs a hard (forced) click on the given locator.
 * Useful when normal click fails due to overlays or UI issues.
 */
async hardClick(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible' });
  await locator.click({ force: true });
}


  /**
* Author: LC5741501
* Created Date: 16/02/26
* This method validates element is visible in UI or not
* @param locator 
* @param timeout 
*/
  async waitElementToBeVisible(locator: Locator, timeout = TIMEOUT.LONG) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

      /**
* Author: LC5764724 / Chetan Chavan
* Created Date: 14/04/26
* This method validates element is visible in UI or not
* @param locator 
* @param timeout 
*/
async waitSAMHomePageToBeVisible(locator: Locator, timeout = TIMEOUT.EXTREME) {
  await expect(locator).toBeVisible({ timeout });
}

  /**
* Author: LC5741501
* Created Date: 16/03/26
* This method validates element is visible in UI or not
* @param locator 
* @param timeout 
*/
  async waitDashboardToBeVisible(locator: Locator, timeout = TIMEOUT.EXTREME) {
    await expect(locator).toBeVisible({ timeout });
    //await expect(locator).toBeEnabled({ timeout });
  }

  /**
    * Author: LC5741501
    * Created Date: 09/03/26
    * This method validates element is visible in UI or not
    * @param locator 
    * @param timeout 
  */
  //async waitElementToBeVisibleCustomWait(locator: any, timeout?: number) {
  //await expect(locator).toBeVisible({ timeout });
  //await expect(locator).toBeEnabled({ timeout });
  //}

  /**
   * Author: LC5741501
   * Created Date: 09/03/26
   * This method types the value provided through KeyBoard action
   * @param page : Current page
   * @param text : text to enter
 */
  async typeTextThroughKeyBoardAction(page: Page, text: string) {
    await page.keyboard.type(text);
  }

  /**
  * Author: LC5741501
  * Created Date: 09/03/26
  * This method types the value provided through KeyBoard action
  * @param page : Current page
  * @param text : text to enter
*/
  async pressGivenButtonThroughKeyBoardAction(page: Page, text: string) {
    await page.keyboard.press(text);
  }

  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * This method compaires the UI vs Json value
   * @param locator : Ui object
   * @param givenData : Json Value
   */
  async compareUIVsJsonValue(locator: any, givenData: any, timeout = TIMEOUT.MIN) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    expect(locator).toContainText(givenData);
  }

  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * This method enters value in input and textarea fields 
   * @param locator 
   * @param value 
   * @param timeout 
   */
  async enterTextarea(locator: Locator, value: string, timeout = TIMEOUT.MIN) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
    await expect(locator).toBeEditable();        // visible + enabled + not readonly
    await locator.fill(value);

  }

  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * @param s String value
   * @returns : It returns type
   */
  async stringIsNotNullOrBlank(s: string | null | undefined): Promise<boolean> {
    return typeof s === 'string' && s.trim().length > 0;
  }


  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * Gets text from a given locator and validates it is not null/empty.
   */
  async verifyUIElementTextIsNotNull(locator: Locator) {

    // Wait for element to be visible
    await locator.waitFor({ state: "visible" });

    // Get text from UI
    const text = await locator.textContent();

    // Validate text
    if (!text || text.trim().length === 0) {
      throw new Error(`Text is null or empty for locator: ${text}`);
    }

    console.log(`Text found: ${text.trim()}`);
  }


  /** 
   * Author: LC5741501
   * Created Date: 09/03/26
   * Generic UX loading guard: wait for common spinners/overlays then network idle. 
   */
  async waitForUXLoading(extraSpinnerSelectors: string[] = [], page: Page) {
    const spinnerSelectors = [
      '//ng-busy/div',
      '.ux-loading',
      '.loading',
      '.spinner',
      '.mat-progress-spinner',
      '.cdk-overlay-backdrop',
      ...extraSpinnerSelectors,
    ];
    for (const sel of spinnerSelectors) {
      const loc = sel.startsWith('/') ? page.locator(`xpath=${sel}`) : page.locator(sel);
      try {
        const first = loc.first();
        if (await first.isVisible({ timeout: TIMEOUT.MAX }).catch(() => false)) {
          await first.waitFor({ state: 'hidden', timeout: TIMEOUT.EXTREME });
        }
      } catch { /* ignore */ }
    }
    await page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Author: LC5741501
   * Created Date: 09/03/26
   * Returns true if the element is visible in the UI; otherwise false.
   * - If `timeout` is provided, the helper will WAIT up to that time for the
   *   element to become visible.
   * - If no `timeout` is provided, it performs an immediate check.
   *
   * @param page    Playwright Page (used when a string selector is passed)
   * @param target  A Locator or a selector string
   * @param options Optional timeout (ms) to wait for visibility
   */
  async isElementVisible(
    page: Page,
    target: Locator | string,
    options?: { timeout?: number }
  ): Promise<boolean> {
    const locator: Locator = typeof target === 'string' ? page.locator(target) : target;

    // If the caller wants to wait for visibility up to a timeout, use waitFor.
    if (options?.timeout && options.timeout > 0) {
      try {
        await locator.waitFor({ state: 'visible', timeout: options.timeout });
        return true;
      } catch {
        return false;
      }
    }

    // Immediate check (no waiting). Note that isVisible() does not accept a timeout.
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }


  /** 
     * Author: LC5741501
     * Created Date: 26/03/26
     * @param locator : Locator
     * This method scroll to the element
     */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }


  /**
    * Author: LC5741501
    * Created Date: 26/03/26
   * Returns the visible text content of the given UI element.
   * Uses Playwright's locator API to ensure auto-waiting.
   */
  async getTextFromElement(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() || '';
  }


   /**
    * Author: LC5741501
    * Created Date: 26/03/26
   * Returns the Reference ID.
   */
  async getReferenceID(raw: string): Promise<string> {
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }


  /**
   * Author: LC5741501
   * Created Date: 26/03/26
   * Concatenates two string values and returns the combined result.
   */
  async concatenateStrings(value1?: string, value2?: string): Promise<string> {
    return `${value1 ?? ''}${value2 ?? ''}`;
  }

  /** 
     * Author: LC5741501
     * Created Date: 27/03/26
     * @param locator : Locator
     * This stops execution at that step for the given time.
     * Use only when it really required when DOM is taking time to load
     * Note: Not recommended for normal automation (can cause flaky tests).
     */
  async hardWait(page: Page): Promise<void> {
    await page.waitForTimeout(TIMEOUT.VERYMIN); // waits for 5 seconds
  }

  async robustClickElement(target: Locator, opts?: { timeout?: number; state?: 'visible' | 'attached'; retries?: number }) {
    const timeout = opts?.timeout ?? this.defaultTimeout;
    const state = opts?.state ?? 'visible';
    const retries = opts?.retries ?? 0;

    let attempt = 0;
    while (attempt <= retries) {
      try {
        await target.waitFor({ state, timeout });
        await target.scrollIntoViewIfNeeded({ timeout });
        await target.click({ timeout });
        return;
      } catch (err) {
        if (attempt === retries) throw err;
        attempt++;
        // Optional small backoff
        await target.page().waitForTimeout(TIMEOUT.MIN);
      }
    }
  }


}