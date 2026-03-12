import { Page, Locator, expect } from '@playwright/test';
export class WebComponents {

  constructor(private readonly defaultTimeout = 30_000) { }

  async clickElement(selector: any, p0: { state: string; timeout: number; }) {
    await selector.isVisible();
    await selector.click();
  }

  async getElementText(page: { textContent: (arg0: any) => any; }, selector: any) {
    await selector.isVisible();
    return await page.textContent(selector);
  }


  async enterText(target: Locator, value: string, timeout = this.defaultTimeout) {
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
      timeout: 60000
    }).then(() => true).catch(() => false);
    //console.log('Authentication dialog appears:', appears);
    if (appears) {
      await securityAccessCode.fill('1111');
      await authenticateButton.click();
      //console.log('Handled authentication dialog with code:', code);
      await authDialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }



  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * This method take custom time to wait for the element before click
   * @param locator 
   * @param timeout 
   */
  async clickWhenVisibleAndEnabledCustomWait(locator: Locator, timeout?: number) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  /**
   * Author: LC5741501
   * Created Date: 16/02/26
   * This method take custom time to wait for the element before click
   * @param locator 
   * @param timeout 
   */
  async clickWhenVisibleAndEnabled(locator: Locator, timeout = 55_000) {
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
* Author: LC5741501
* Created Date: 16/02/26
* This method validates element is visible in UI or not
* @param locator 
* @param timeout 
*/
  async waitElementToBeVisible(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
    * Author: LC5741501
    * Created Date: 09/03/26
    * This method validates element is visible in UI or not
    * @param locator 
    * @param timeout 
  */
  async waitElementToBeVisibleCustomWait(locator: any, timeout?: number) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

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
  async compareUIVsJsonValue(locator: any, givenData: any,) {
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
  async enterTextarea(locator: Locator, value: string, timeout = 15_000) {
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
   * Generic UX loading guard: wait for common spinners/overlays then network idle. */
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
        if (await first.isVisible({ timeout: 500 }).catch(() => false)) {
          await first.waitFor({ state: 'hidden', timeout: 45_000 });
        }
      } catch { /* ignore */ }
    }
    await page.waitForLoadState('networkidle').catch(() => {});
  }



  
/**
 * Returns true if the element is visible in the UI; otherwise false.
 *
 * - If `timeout` is provided, the helper will WAIT up to that time for the
 *   element to become visible.
 * - If no `timeout` is provided, it performs an immediate check.
 *
 * @param page    Playwright Page (used when a string selector is passed)
 * @param target  A Locator or a selector string
 * @param options Optional timeout (ms) to wait for visibility
 */
  async  isElementVisible(
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
        await target.page().waitForTimeout(300);
      }
    }
  }


}