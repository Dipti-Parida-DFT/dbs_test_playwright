import { Page, Locator } from '@playwright/test';
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