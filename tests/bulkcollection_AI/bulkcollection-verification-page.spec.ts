import { Page, Locator } from '@playwright/test';

/**
 * Bulk Collection Verification Page Object Model
 * Represents the Step 2: Verify Details page
 */
export class BulkCollectionVerificationPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly previewSection: Locator;
  readonly editButton: Locator;
  readonly toAccount: Locator;
  readonly paymentType: Locator;
  readonly totalAmount: Locator;
  readonly creditType: Locator;
  readonly paymentDate: Locator;
  readonly internalReference: Locator;
  readonly collectionSummary: Locator;
  readonly payerDetails: Locator;
  readonly saveAsTemplateCheckbox: Locator;
  readonly approveCheckbox: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.locator('heading:has-text("Bulk Collection")');
    this.previewSection = page.locator('text=Preview bulk collection');
    this.editButton = page.getByRole('button', { name: /Edit|edit/ });
    this.toAccount = page.locator('text=To').locator('..').locator('text=783700301');
    this.paymentType = page.locator('text=Payment Type').locator('..').locator('text=Hong Kong');
    this.totalAmount = page.locator('text=Total amount').locator('..').locator(/USD|HKD/);
    this.creditType = page.locator('text=Credit Type').locator('..').locator('text=Consolidated');
    this.paymentDate = page.locator('text=Payment date').locator('..').locator(/Apr|May/);
    this.internalReference = page.locator('text=Internal reference');
    this.collectionSummary = page.locator('text=Collection summary');
    this.payerDetails = page.locator('text=Payer/Nickname');
    this.saveAsTemplateCheckbox = page.getByRole('checkbox', { name: /Save this collection/ });
    this.approveCheckbox = page.getByRole('checkbox', { name: /Approve now and submit/ });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  /**
   * Verify verification page is displayed
   */
  async verifyPageDisplayed(): Promise<void> {
    await this.previewSection.isVisible();
  }

  /**
   * Verify transaction details are displayed
   */
  async verifyTransactionDetails(): Promise<void> {
    await this.toAccount.isVisible();
    await this.totalAmount.isVisible();
    await this.creditType.isVisible();
    await this.paymentDate.isVisible();
  }

  /**
   * Verify collection summary
   * @param totalPayers - Expected total payers
   * @param totalAmount - Expected total amount
   */
  async verifyCollectionSummary(totalPayers: string, totalAmount: string): Promise<void> {
    await this.page.getByText(`Total payers: ${totalPayers}`).isVisible();
    await this.page.getByText(`Total amount (USD): ${totalAmount}`).isVisible();
  }

  /**
   * Verify payer details are displayed
   */
  async verifyPayerDetails(): Promise<void> {
    await this.payerDetails.isVisible();
  }

  /**
   * Click Edit button to go back
   */
  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  /**
   * Check "Approve now and submit immediately" checkbox
   */
  async checkApproveCheckbox(): Promise<void> {
    await this.approveCheckbox.check();
  }

  /**
   * Verify approval options are displayed
   */
  async verifyApprovalOptions(): Promise<void> {
    await this.page.getByText('Use the IDEAL Mobile app to approve').isVisible();
    await this.page.getByRole('button', { name: 'Approve now' }).isVisible();
  }

  /**
   * Click Approve Now button
   */
  async clickApproveNow(): Promise<void> {
    await this.page.getByRole('button', { name: 'Approve now' }).click();
  }

  /**
   * Click Submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Click Cancel button
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Verify Submit button is disabled (before approval)
   */
  async verifySubmitButtonDisabled(): Promise<void> {
    await this.submitButton.isDisabled();
  }

  /**
   * Verify Submit button is enabled (after approval)
   */
  async verifySubmitButtonEnabled(): Promise<void> {
    await this.submitButton.isEnabled();
  }
}
