import { Page, Locator, expect } from '@playwright/test';
export class WebComponents {
    
    constructor(private readonly defaultTimeout = 30_000) {}

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
        await expect(locator).toBeVisible({timeout});
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
        await expect(locator).toBeVisible({timeout});
        await expect(locator).toBeEnabled({ timeout });
        await locator.click();
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
    


  async robustClickElement(target: Locator, opts?: { timeout?: number; state?: 'visible'|'attached'; retries?: number }) {
    const timeout = opts?.timeout ?? this.defaultTimeout;
    const state   = opts?.state   ?? 'visible';
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