import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class TransactionDetailsPage extends BasePage {
  // Locators
  private transactionDetailsHeading: Locator;
  private referenceNumberText: Locator;
  private payeeNameText: Locator;
  private accountNumberText: Locator;
  private amountText: Locator;
  private paymentDateText: Locator;
  private statusText: Locator;
  private deletePayeeButton: Locator;
  private deleteConfirmButton: Locator;
  private payeeSectionHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.transactionDetailsHeading = page.getByRole('heading', { level: 1, name: /Transaction|Details/i });
    this.referenceNumberText = page.locator('text=/Reference[\\s:]+/i').first();
    this.payeeNameText = page.locator('[class*="payee"]').filter({ hasText: /TestPayee|payee/i }).first();
    this.accountNumberText = page.locator('text=/Account|Account Number/i').first();
    this.amountText = page.locator('text=/Amount|SGD/i').first();
    this.paymentDateText = page.locator('text=/Date|Payment Date/i').first();
    this.statusText = page.locator('text=/Status|Pending|Approved/i').first();
    this.deletePayeeButton = page.locator('button:has-text("Delete"), button:has-text("Remove"), [class*="delete"]').first();
    this.deleteConfirmButton = page.getByRole('button', { name: /Confirm|Yes|Delete/i });
    this.payeeSectionHeading = page.locator('text=Payee|Beneficiary').first();
  }

  /**
   * Check if transaction details page is displayed
   */
  async isTransactionDetailsDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.transactionDetailsHeading);
  }

  /**
   * Get reference number from details
   */
  async getReferenceNumber(): Promise<string> {
    return await this.getText(this.referenceNumberText);
  }

  /**
   * Get payee name
   */
  async getPayeeName(): Promise<string> {
    return await this.getText(this.payeeNameText);
  }

  /**
   * Get account number
   */
  async getAccountNumber(): Promise<string> {
    return await this.getText(this.accountNumberText);
  }

  /**
   * Get transaction amount
   */
  async getAmount(): Promise<string> {
    return await this.getText(this.amountText);
  }

  /**
   * Get payment date
   */
  async getPaymentDate(): Promise<string> {
    return await this.getText(this.paymentDateText);
  }

  /**
   * Get transaction status
   */
  async getStatus(): Promise<string> {
    return await this.getText(this.statusText);
  }

  /**
   * Verify all transaction details
   */
  async verifyTransactionDetails(
    expectedRef: string,
    expectedPayee: string,
    expectedAmount: string,
    expectedStatus: string
  ): Promise<boolean> {
    const ref = await this.getReferenceNumber();
    const payee = await this.getPayeeName();
    const amount = await this.getAmount();
    const status = await this.getStatus();

    return (
      ref.includes(expectedRef) &&
      payee.includes(expectedPayee) &&
      amount.includes(expectedAmount) &&
      status.includes(expectedStatus)
    );
  }

  /**
   * Check if delete payee button is visible
   */
  async isDeletePayeeButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.deletePayeeButton);
  }

  /**
   * Click delete payee button
   */
  async clickDeletePayee(): Promise<void> {
    await this.clickElement(this.deletePayeeButton);
    await this.wait(1000);
  }

  /**
   * Confirm deletion
   */
  async confirmDeletion(): Promise<void> {
    await this.clickElement(this.deleteConfirmButton);
    await this.wait(2000);
  }

  /**
   * Delete payee from transaction
   */
  async deletePayeeFromTransaction(): Promise<void> {
    if (await this.isDeletePayeeButtonVisible()) {
      await this.clickDeletePayee();
      await this.confirmDeletion();
    }
  }

  /**
   * Get all transaction information
   */
  async getAllTransactionInfo(): Promise<{
    reference: string;
    payee: string;
    account: string;
    amount: string;
    date: string;
    status: string;
  }> {
    return {
      reference: await this.getReferenceNumber(),
      payee: await this.getPayeeName(),
      account: await this.getAccountNumber(),
      amount: await this.getAmount(),
      date: await this.getPaymentDate(),
      status: await this.getStatus()
    };
  }
}