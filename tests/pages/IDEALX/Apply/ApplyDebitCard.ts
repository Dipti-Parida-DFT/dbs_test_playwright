import { Page, Locator, expect } from '@playwright/test';

export class ApplyPage {
  readonly page: Page;

  readonly dashboardIcon: Locator;
  readonly logoutButton: Locator;

  readonly applyNav: Locator;
  readonly businessEssentialsTitle: Locator;

  readonly debitCardSection: Locator;
  readonly debitCardDesc: Locator;
  readonly debitCardApplyBtn: Locator;
  readonly debitCardLearnMore: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboardIcon = page.locator('#nav-item-navBBTopDashLinkText');
    this.logoutButton = page.locator('#logout');

    this.applyNav = page.locator('#nav-item-navBBTopApplyLinkText');
    this.businessEssentialsTitle = page.getByText('Business Essentials', { exact: false });

    this.debitCardSection = page.getByText('Debit card', { exact: true });
    this.debitCardDesc = page.getByText('Get the DBS Business Advance', { exact: false });

    this.debitCardApplyBtn = page.locator('//span[contains(text(),"Get the DBS Business Advance")]/following::button').nth(1);
    this.debitCardLearnMore = page.locator('//span[contains(text(),"Get the DBS Business Advance")]/following::button').nth(2);
  }

  async assertPostLogin() {
    await expect(
      this.dashboardIcon.or(this.logoutButton)
    ).toBeVisible({ timeout: 45_000 });
  }

  async openApplyPanel() {
    await this.applyNav.click();
    await expect(this.businessEssentialsTitle).toBeVisible({ timeout: 60_000 });
  }

  async assertDebitCardVisible() {
    await expect(this.debitCardSection).toBeVisible({ timeout: 45_000 });
    await expect(this.debitCardDesc).toBeVisible();
    await expect(this.debitCardApplyBtn).toBeEnabled();
    await expect(this.debitCardLearnMore).toBeEnabled();
  }

  async assertDebitCardNotVisible() {
    await expect(this.debitCardSection).toBeHidden();
  }
}
