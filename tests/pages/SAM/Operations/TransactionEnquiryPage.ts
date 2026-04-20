import { Page, Locator, expect } from '@playwright/test';

export class TransactionEnquiryPage {
  constructor(private readonly page: Page) {
    // Home / Navigation
    this.searchHomeButton = page.locator('//input[@name="search"]');
    this.selectAffiliate = page.locator('//select[@name="selectAffiliate"]');
    this.submitAffiliate = page.locator('//input[@name="submit_affiliate"]');
    this.topOperationsLink = page.locator(
      '/html/body/table[1]/tbody/tr[2]/td[1]/table/tbody/tr/td[8]/a'
    );

    // Transaction enquiry
    this.transactionEnquiryLink = page.locator(
      '//a[contains(@href,"/csr/common/transactionenquiry/bom/loadtransactionenquiry")]'
    );
    this.searchButton = page.locator('//input[@name="submit_search"]');
    this.firstReferenceLink = page.locator(
      '/html/body/table[3]/tbody/tr[3]/td[3]/a'
    );

    // Filters / values
    this.startDateInput = page.locator('//input[@name="startDate"]');
    this.productTypeSelect = page.locator('//select[@name="typeList"]');

    // Result values
    this.fromAccountValue = page.locator(
      '//*[@id="item_0"]/table/tbody/tr[5]/td[4]'
    );
    this.amountValue = page.locator(
      '//*[@id="item_0"]/table/tbody/tr[10]/td[4]'
    );
  }

  // ---------- Locators ----------
  readonly searchHomeButton: Locator;
  readonly selectAffiliate: Locator;
  readonly submitAffiliate: Locator;
  readonly topOperationsLink: Locator;

  readonly transactionEnquiryLink: Locator;
  readonly searchButton: Locator;
  readonly firstReferenceLink: Locator;

  readonly startDateInput: Locator;
  readonly productTypeSelect: Locator;

  readonly fromAccountValue: Locator;
  readonly amountValue: Locator;

  // ---------- Wait / Page Load ----------

  /**
   * Former: jiazhai()
   * Wait until Transaction Enquiry page is ready
   */
  async waitForTransactionEnquiryReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.searchHomeButton).toBeVisible({ timeout });
    await expect(this.searchHomeButton).toBeEnabled({ timeout });
  }

  // ---------- Business Methods ----------

  async openTransactionEnquiry(
    affiliate: string
  ) {
    await this.waitForTransactionEnquiryReady();

    await this.safeClick(this.topOperationsLink);
    await this.safeClick(this.transactionEnquiryLink);

    await this.selectAffiliate.selectOption(affiliate);
    await this.safeClick(this.submitAffiliate);
  }

  async searchTransaction(
    startDate: string,
    productType: string
  ) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);

    if (productType) {
      await this.productTypeSelect.selectOption(productType);
    }

    await this.safeClick(this.searchButton);
    await this.safeClick(this.firstReferenceLink);
  }

  async getFromAccountValue(): Promise<string> {
    return (await this.fromAccountValue.textContent())?.trim() ?? '';
  }

  async getAmountValue(): Promise<string> {
    return (await this.amountValue.textContent())?.trim() ?? '';
  }

  // ---------- Common Helpers (Same Pattern as SchedulesPage) ----------

  async safeClick(locator: Locator, timeout = 60_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  async waitForUXLoading(extraSelectors: string[] = []) {
    const spinners = [
      '.ux-loading',
      '.loading',
      '.spinner',
      '.cdk-overlay-backdrop',
      ...extraSelectors,
    ];

    for (const selector of spinners) {
      const spinner = this.page.locator(selector).first();
      if (await spinner.isVisible({ timeout: 1000 }).catch(() => false)) {
        await spinner.waitFor({ state: 'hidden', timeout: 180_000 });
      }
    }

    await this.page.waitForLoadState('networkidle');
  }
}