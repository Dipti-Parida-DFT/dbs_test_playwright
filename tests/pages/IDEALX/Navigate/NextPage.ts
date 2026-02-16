// pages/NextPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class NextPage {
  constructor(private readonly page: Page) {
    // Use either of the historical selectors: name="submit_sbuserLogin" or id="previewButton_Link"
    this.nextButton = page.locator('xpath=(//*[@name="submit_sbuserLogin"] | //*[@id="previewButton_Link"])');
  }

  // ---------- Locators ----------
  readonly nextButton: Locator;

  // ---------- Waits / Actions (Chinese → English) ----------

  /** Former: jiazhai() — wait until the Next button is visible and enabled */
  async waitForNextReady(timeout = 15_000): Promise<void> {
    await expect(this.nextButton).toBeVisible({ timeout });
    await expect(this.nextButton).toBeEnabled({ timeout });
  }

  /** Former: next() — click the Next button after it is ready */
  async clickNext(): Promise<void> {
    await this.waitForNextReady();
    await this.nextButton.click();
  }
}