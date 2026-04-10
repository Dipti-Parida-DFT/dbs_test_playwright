import { Page, Locator } from '@playwright/test';

/**
 * Bulk Collection Page Object Model
 * Represents the Bulk Collection transaction creation form
 */
export class BulkCollectionPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly accountDropdown: Locator;
  readonly creditTypeDropdown: Locator;
  readonly existingPayerTab: Locator;
  readonly newPayerTab: Locator;
  readonly payerList: Locator;
  readonly addPayerButton: Locator;
  readonly amountField: Locator;
  readonly transactionCodeDropdown: Locator;
  readonly particularsField: Locator;
  readonly paymentDateRadio: Locator;
  readonly nextButton: Locator;
  readonly cancelButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly collectionSummary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.locator('heading:has-text("Bulk Collection")');
    this.accountDropdown = page.getByRole('textbox', { name: 'Select', exact: true });
    this.creditTypeDropdown = page.getByRole('textbox', { name: 'Select a credit type' });
    this.existingPayerTab = page.getByRole('tab', { name: 'Existing payer' });
    this.newPayerTab = page.getByRole('tab', { name: 'New payer' });
    this.payerList = page.locator('[role="listitem"]');
    this.addPayerButton = page.getByRole('button', { name: 'Add' });
    this.amountField = page.locator('input[type="number"], input[placeholder*="Amount"]').first();
    this.transactionCodeDropdown = page.locator('input:has-text("38 - Direct Debit")');
    this.particularsField = page.locator('textarea, input[placeholder*="Particulars"]');
    this.paymentDateRadio = page.getByRole('radio', { name: /earliest|available/i });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.saveAsDraftButton = page.getByRole('button', { name: 'Save as draft' });
    this.collectionSummary = page.locator('text=Collection summary');
  }

  /**
   * Verify Bulk Collection page is displayed
   */
  async verifyPageDisplayed(): Promise<void> {
    await this.pageHeading.isVisible();
  }

  /**
   * Select account from dropdown
   * @param accountText - Account text to select (e.g., "NAME OF ACCT NO:7837003010")
   */
  async selectAccount(accountText: string): Promise<void> {
    await this.accountDropdown.click();
    await this.page.getByRole('listitem').filter({ hasText: accountText }).click();
  }

  /**
   * Select credit type from dropdown
   * @param creditType - Credit type to select (e.g., "Consolidated Credit")
   */
  async selectCreditType(creditType: string): Promise<void> {
    await this.creditTypeDropdown.click();
    await this.page.getByRole('listitem').filter({ hasText: creditType }).click();
  }

  /**
   * Verify existing payer tab is active
   */
  async verifyExistingPayerTabActive(): Promise<void> {
    await this.existingPayerTab.isVisible();
  }

  /**
   * Click on existing payer to select
   * @param payerName - Name of the payer (e.g., "AutoTestBulkCollection")
   */
  async selectExistingPayer(payerName: string): Promise<void> {
    await this.page.locator(`text=${payerName}`).first().click();
  }

  /**
   * Click Add button to add payer
   */
  async clickAddPayer(): Promise<void> {
    await this.addPayerButton.click();
  }

  /**
   * Enter amount
   * @param amount - Amount to enter (e.g., "100.00")
   */
  async enterAmount(amount: string): Promise<void> {
    await this.amountField.fill(amount);
  }

  /**
   * Enter particulars
   * @param particulars - Particulars text (e.g., "TEST COLLECT")
   */
  async enterParticulars(particulars: string): Promise<void> {
    await this.particularsField.fill(particulars);
  }

  /**
   * Verify collection summary shows correct total
   * @param expectedAmount - Expected total amount
   */
  async verifyCollectionSummary(expectedAmount: string): Promise<void> {
    await this.page.getByText(`Total amount (USD): ${expectedAmount}`).isVisible();
  }

  /**
   * Click Next button to proceed to verification
   */
  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  /**
   * Click Cancel button
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Click Save as Draft button
   */
  async clickSaveAsDraft(): Promise<void> {
    await this.saveAsDraftButton.click();
  }

  /**
   * Fill complete bulk collection form
   * @param account - Account to select
   * @param creditType - Credit type to select
   * @param payerName - Payer name
   * @param amount - Amount
   * @param particulars - Particulars
   */
  async fillBulkCollectionForm(
    account: string,
    creditType: string,
    payerName: string,
    amount: string,
    particulars: string
  ): Promise<void> {
    await this.selectAccount(account);
    await this.selectCreditType(creditType);
    await this.selectExistingPayer(payerName);
    await this.clickAddPayer();
    await this.enterAmount(amount);
    await this.enterParticulars(particulars);
  }

  /**
   * Get amount field value
   */
  async getAmountValue(): Promise<string | null> {
    return await this.amountField.inputValue();
  }

  /**
   * Get particulars field value
   */
  async getParticularsValue(): Promise<string | null> {
    return await this.particularsField.inputValue();
  }
}
