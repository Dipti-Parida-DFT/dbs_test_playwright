// pages/ApprovalPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class ApprovalPage {
  constructor(private readonly page: Page) {
    this.approvalMenu = page.locator('//div[@id="nav-item-navBBTopMyApprovalsLinkText"]');
    this.approvalVerifyTab = page.locator('//a[@href="#/approvals/verify"]');
    this.approvalVerifySearch = page.locator('//input[@id="byTXN-filter"]');
    this.approveVerifyCheckbox = page.locator('//input[contains(@id,"txn-select")]');
    this.approveVerifyCheckBalance = page.locator('//button[@id="checkAffectedBal"]');
    this.approveVerifyButton = page.locator('//button[@id="transactionVerify"]');
    this.approveVerifySubmitButton = page.locator('//button[@name="txn-preview-verify-release"]');
    this.approveVerifyFinishButton = page.locator('//button[@name="finish"]');
    this.approveReleaseTab = page.locator('//a[@href="#/approvals/release"]');

    this.approveReleaseButton = page.locator('//button[@id="transactionRelease"]');
    this.approveReleaseSubmitButton = page.locator('//button[@name="txn-preview-verify-release"]');

  }
    readonly approvalMenu: Locator;
    readonly approvalVerifyTab: Locator;
    readonly approvalVerifySearch: Locator;
    readonly approveVerifyCheckbox: Locator;
    readonly approveVerifyCheckBalance: Locator;
    readonly approveVerifyButton: Locator;
    readonly approveVerifySubmitButton: Locator;
    readonly approveVerifyFinishButton: Locator;
    readonly approveReleaseTab: Locator;
    readonly approveReleaseButton: Locator;
    readonly approveReleaseSubmitButton: Locator;


  async saferClick(locator: Locator, timeout = 20_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click({ trial: true });
    await locator.click();
  }

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
      const spinner = this.page.locator(sel).first();
      try {
        if (await spinner.isVisible({ timeout: 400 }).catch(() => false)) {
          await spinner.waitFor({ state: 'hidden', timeout: 15_000 });
        }
      } catch { /* ignore individual spinner errors */ }
    }
    await this.page.waitForLoadState('networkidle');
  }

  async waitForVerifyCenterReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.approvalVerifySearch).toBeVisible({ timeout });
    await expect(this.approvalVerifySearch).toBeEnabled({ timeout });
  }

  async safeFill(locator: Locator, value: string, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }

  async searchVerifyAndOpenByReference(reference: string) {
    await this.waitForVerifyCenterReady();
    await this.safeFill(this.approvalVerifySearch, reference);
    await this.waitForVerifyCenterReady();
    await this.approveVerifyCheckbox.evaluate(el => (el as HTMLElement).click());
    await expect(this.approveVerifyCheckBalance).toBeVisible({ timeout: 20_000 });
    await this.saferClick(this.approveVerifyButton);
    await this.saferClick(this.approveVerifySubmitButton);
    await this.saferClick(this.approveVerifyFinishButton);
  }

   async searchReleaseAndOpenByReference(reference: string) {
    await this.waitForVerifyCenterReady();
    await this.safeFill(this.approvalVerifySearch, reference);
    await this.waitForVerifyCenterReady();
    await this.approveVerifyCheckbox.evaluate(el => (el as HTMLElement).click());
    await expect(this.approveVerifyCheckBalance).toBeVisible({ timeout: 20_000 });
    await this.saferClick(this.approveReleaseButton);
    await this.saferClick(this.approveReleaseSubmitButton);
    await this.saferClick(this.approveVerifyFinishButton);
    }

}