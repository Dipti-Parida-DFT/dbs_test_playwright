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
  async clickWhenVisibleAndEnabled(locator: Locator, timeout = 15_000) {
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
   * Created Date: 16/02/26
   * This method compaires the UI vs Json value
   * @param locator : Ui object
   * @param referenceForPayee : Json Value
   */
  async compareUIVsJsonValue(locator: Locator, referenceForPayee: any,) {
    expect(locator).toContainText(referenceForPayee);
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