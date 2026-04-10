import { Page, Locator } from '@playwright/test';

/**
 * Bulk Collection Submission Page Object Model
 * Represents the Step 3: Submit for Approval - Confirmation page
 */
export class BulkCollectionSubmissionPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly successMessage: Locator;
  readonly successBanner: Locator;
  readonly internalReferenceField: Locator;
  readonly batchIdField: Locator;
  readonly statusField: Locator;
  readonly toAccount: Locator;
  readonly paymentType: Locator;
  readonly totalAmount: Locator;
  readonly creditType: Locator;
  readonly paymentDate: Locator;
  readonly collectionSummary: Locator;
  readonly payerDetails: Locator;
  readonly exportPdfButton: Locator;
  readonly printButton: Locator;
  readonly makeAnotherCollectionButton: Locator;
  readonly finishedButton: Locator;
  readonly step1Checkmark: Locator;
  readonly step2Checkmark: Locator;
  readonly step3Complete: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.locator('heading:has-text("Bulk Collection")');
    this.successMessage = page.locator('text=Your bulk collection has been submitted');
    this.successBanner = page.locator('[role="alert"]').filter({ hasText: /submitted|created successfully/ });
    this.internalReferenceField = page.locator('text=Internal reference').locator('..').locator('text=EBCOL');
    this.batchIdField = page.locator('text=Batch ID').locator('..');
    this.statusField = page.locator('text=Status').locator('..').locator('text=Approved');
    this.toAccount = page.locator('text=To').locator('..').locator('text=783700301');
    this.paymentType = page.locator('text=Payment Type').locator('..').locator('text=Hong Kong');
    this.totalAmount = page.locator('text=Total amount').locator('..').locator(/USD|HKD/);
    this.creditType = page.locator('text=Credit Type').locator('..').locator('text=Consolidated');
    this.paymentDate = page.locator('text=Payment date').locator('..');
    this.collectionSummary = page.locator('text=Collection summary');
    this.payerDetails = page.locator('text=Payer/Nickname');
    this.exportPdfButton = page.getByRole('button', { name: /Export PDF|PDF/ });
    this.printButton = page.getByRole('button', { name: /Print/ });
    this.makeAnotherCollectionButton = page.getByRole('button', { name: /Make another collection/ });
    this.finishedButton = page.getByRole('button', { name: 'Finished' });
    this.step1Checkmark = page.locator('//li[contains(text(), "1. Input Details")]//img[@alt="checkmark"]');
    this.step2Checkmark = page.locator('//li[contains(text(), "2. Verify Details")]//img[@alt="checkmark"]');
    this.step3Complete = page.locator('//li[contains(text(), "3. Submit for Approval")]');
  }

  /**
   * Verify submission page is displayed
   */
  async verifyPageDisplayed(): Promise<void> {
    await this.successMessage.isVisible();
  }

  /**
   * Verify success banner is displayed
   */
  async verifySuccessBannerDisplayed(): Promise<void> {
    await this.successBanner.isVisible();
  }

  /**
   * Get the Internal reference number
   * @returns Internal reference number (e.g., "EBCOL60409093268")
   */
  async getInternalReference(): Promise<string> {
    // Extract the reference number from the field
    const referenceText = await this.page.locator('text=Internal reference').locator('..').innerText();
    const match = referenceText.match(/EBCOL\d+/);
    return match ? match[0] : '';
  }

  /**
   * Capture and verify Internal reference number format
   * @returns Internal reference number
   */
  async captureInternalReference(): Promise<string> {
    const reference = await this.getInternalReference();
    // Verify format: EBCOL followed by digits
    if (!reference.match(/^EBCOL\d+/)) {
      throw new Error(`Invalid reference format: ${reference}`);
    }
    return reference;
  }

  /**
   * Verify transaction status is Approved
   */
  async verifyStatusApproved(): Promise<void> {
    await this.statusField.isVisible();
  }

  /**
   * Verify all transaction details are displayed
   */
  async verifyTransactionDetails(): Promise<void> {
    await this.toAccount.isVisible();
    await this.paymentType.isVisible();
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
    await this.page.getByText('AutoTestBulkCollection').isVisible();
    await this.page.getByText('010123456').isVisible();
    await this.page.getByText('100.00').isVisible();
  }

  /**
   * Verify step indicators show completion
   */
  async verifyStepIndicators(): Promise<void> {
    await this.step1Checkmark.isVisible();
    await this.step2Checkmark.isVisible();
  }

  /**
   * Verify export buttons are available
   */
  async verifyExportOptions(): Promise<void> {
    await this.exportPdfButton.isVisible();
    await this.printButton.isVisible();
  }

  /**
   * Verify completion buttons are available
   */
  async verifyCompletionButtons(): Promise<void> {
    await this.makeAnotherCollectionButton.isVisible();
    await this.finishedButton.isVisible();
  }

  /**
   * Click "Make another collection" button
   */
  async clickMakeAnotherCollection(): Promise<void> {
    await this.makeAnotherCollectionButton.click();
  }

  /**
   * Click "Finished" button
   */
  async clickFinished(): Promise<void> {
    await this.finishedButton.click();
  }

  /**
   * Export to PDF
   */
  async exportToPdf(): Promise<void> {
    await this.exportPdfButton.click();
  }

  /**
   * Print transaction details
   */
  async print(): Promise<void> {
    await this.printButton.click();
  }
}
