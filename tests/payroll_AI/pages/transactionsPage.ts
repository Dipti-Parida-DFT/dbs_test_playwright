import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class TransactionsPage extends BasePage {
  // Locators
  private searchInput: Locator;
  private transactionsTable: Locator;
  private transactionRows: Locator;
  private transactionsHeading: Locator;
  private noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('textbox').filter({ hasText: /search|filter/i }).first();
    this.transactionsTable = page.locator('table').first();
    this.transactionRows = page.locator('tbody tr');
    this.transactionsHeading = page.getByRole('heading', { level: 1, name: /Payment|Transaction|History/i });
    this.noResultsMessage = page.locator('text=/No Information to display|No results/i').first();
  }

  /**
   * Check if transactions page is displayed
   */
  async isTransactionsPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.transactionsHeading);
  }

  /**
   * Search for transaction by reference number
   */
  async searchTransaction(referenceNumber: string): Promise<void> {
    await this.fillText(this.searchInput, referenceNumber);
    await this.wait(2000);
  }

  /**
   * Get number of transaction results
   */
  async getTransactionCount(): Promise<number> {
    return await this.transactionRows.count();
  }

  /**
   * Click on first transaction in results
   */
  async clickFirstTransaction(): Promise<void> {
    const firstRow = this.transactionRows.first();
    await this.clickElement(firstRow);
    await this.wait(2000);
  }

  /**
   * Click on transaction by reference number
   */
  async clickTransactionByReference(referenceNumber: string): Promise<void> {
    const transactionRow = this.page.locator(`tr:has-text("${referenceNumber}")`);
    if (await this.isElementVisible(transactionRow)) {
      await this.clickElement(transactionRow);
      await this.wait(2000);
    }
  }

  /**
   * Check if search returned results
   */
  async hasSearchResults(): Promise<boolean> {
    const count = await this.getTransactionCount();
    return count > 0 && !(await this.isElementVisible(this.noResultsMessage));
  }

  /**
   * Get transaction details from table
   */
  async getTransactionDetails(referenceNumber: string): Promise<{
    reference: string;
    amount: string;
    status: string;
    date: string;
  }> {
    const row = this.page.locator(`tr:has-text("${referenceNumber}")`);
    const cells = row.locator('td');
    
    return {
      reference: await this.getText(cells.nth(0)),
      amount: await this.getText(cells.nth(1)),
      status: await this.getText(cells.nth(2)),
      date: await this.getText(cells.nth(3))
    };
  }
}