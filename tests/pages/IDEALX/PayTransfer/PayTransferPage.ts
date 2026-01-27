import { Page, Locator, expect } from '@playwright/test';
import { WebComponents } from '../../../lib/components';

export class PayTransferPage {
  private readonly page: Page;
  private readonly wc: WebComponents;

  //Locators
  readonly payTransferNav: Locator;
  readonly payLocalOverseas: Locator;
  readonly bulkTransfer: Locator;
  readonly payLocalPageHeader: Locator;
  readonly bulkTransferPageHeader: Locator;
  readonly securityAcessCodeInput: Locator;
  readonly authenticateNowButton: Locator;
  readonly nextPageContainerOption: Locator;


  constructor(page: Page, webComponents?: WebComponents) {
    this.page = page;
    this.wc = webComponents ?? new WebComponents();

    this.payTransferNav = page.locator('//span[contains(text()," Pay & Transfer ")]');
    this.payLocalOverseas = page.locator('//label[text()="Pay Local / Overseas Payee"]/preceding-sibling::span');
    this.bulkTransfer = page.locator('//label[text()="Bulk Payment"]/preceding-sibling::span');
    this.payLocalPageHeader = page.locator('//h1[contains(text(),"Pay Local / Overseas Payee")]');
    this.bulkTransferPageHeader = page.locator('//h1[contains(text()," Bulk Payment ")]');
    this.securityAcessCodeInput = page.locator('//*[@placeholder="Enter security access code"]');
    this.authenticateNowButton = page.locator('//button[contains(text(),"Authenticate now")]');
    this.nextPageContainerOption = page.locator('//li[@class="page-point ng-star-inserted"]');
  }
  
  /**
   * Navigates to Pay & Transfer and authenticates with the provided access code.
   * Waits until the left navigation / next page container becomes ready.
   */
  async navigateToPayTransfer(accessCode: string) {
    // Click nav safely
    await this.wc.clickElement(this.payTransferNav, { state: 'visible', timeout: 60_000 });

    // Fill security code and authenticate
    await this.wc.enterText(this.securityAcessCodeInput, accessCode);
    await this.authenticateNowButton.click();

    // Wait until the section is ready—avoid arbitrary waits
    await expect(this.nextPageContainerOption.first()).toBeVisible({ timeout: 60_000 });
  }

  /**
   * Opens "Pay Local / Overseas Payee" and verifies header.
   */
  async openPayLocalOverseas() {
    await this.wc.clickElement(this.payLocalOverseas, { state: 'visible', timeout: 45_000 });
    await expect(this.payLocalPageHeader).toBeVisible({ timeout: 60_000 });
  }

  /**
   * Opens "Bulk Payment" (handles pagination) and verifies header.
   */
  async openBulkPayment() {
    // If not visible, page through carousel/dots then click
    if (!(await this.bulkTransfer.isVisible().catch(() => false))) {
      await this.nextPageContainerOption.click({ timeout: 15_000 });
    }
    await this.wc.clickElement(this.bulkTransfer, { state: 'visible', timeout: 45_000 });

    // Wait for the page header (deterministic completion)
    await expect(this.bulkTransferPageHeader).toBeVisible({ timeout: 60_000 });
  }
}
