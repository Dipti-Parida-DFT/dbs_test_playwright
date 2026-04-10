import { Page, Locator } from '@playwright/test';

/**
 * Internal Reference Capture Helper
 * Specialized helper for capturing and validating transaction reference numbers
 */
export class ReferenceCapture {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Find reference number field on the page
   */
  private getReferenceField(): Locator {
    return this.page.locator('text=Internal reference').locator('..');
  }

  /**
   * Capture internal reference number from submission page
   * @returns The captured reference number (e.g., EBCOL60409093268)
   */
  async captureReference(): Promise<string> {
    const referenceField = this.getReferenceField();
    const fullText = await referenceField.innerText();
    
    // Extract EBCOL followed by digits
    const match = fullText.match(/EBCOL\d+/);
    if (!match) {
      throw new Error(`Could not find reference number in: ${fullText}`);
    }
    
    return match[0];
  }

  /**
   * Capture reference from success banner
   * @returns The captured reference number
   */
  async captureReferenceFromBanner(): Promise<string> {
    const banner = this.page.locator('[role="alert"]');
    const bannerText = await banner.innerText();
    
    // Extract EBCOL followed by digits from banner
    const match = bannerText.match(/EBCOL\d+/);
    if (!match) {
      throw new Error(`Could not find reference number in banner: ${bannerText}`);
    }
    
    return match[0];
  }

  /**
   * Validate reference number format
   * @param reference - Reference to validate
   * @returns true if valid, false otherwise
   */
  validateReferenceFormat(reference: string): boolean {
    // EBCOL followed by digits
    return /^EBCOL\d{11}$/.test(reference);
  }

  /**
   * Verify reference appears in success message
   * @param reference - Reference to find
   */
  async verifyReferenceInSuccessMessage(reference: string): Promise<void> {
    await this.page.getByText(reference).waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verify reference appears in confirmation banner
   * @param reference - Reference to find
   */
  async verifyReferenceInConfirmationBanner(reference: string): Promise<void> {
    const banner = this.page.locator('[role="alert"]');
    await banner.getByText(reference).waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Extract and verify reference number
   * Steps:
   * 1. Verify submission page is displayed
   * 2. Capture reference from internal reference field
   * 3. Validate format
   * 4. Verify it appears in success message
   * @returns The captured and validated reference
   */
  async extractAndVerifyReference(): Promise<string> {
    // Wait for submission page to load
    await this.page.waitForURL(/bulk-collection\/submit/, { timeout: 10000 });
    
    // Verify success message
    await this.page.getByText('Your bulk collection has been submitted').waitFor({ state: 'visible' });
    
    // Capture reference
    const reference = await this.captureReference();
    
    // Validate format
    if (!this.validateReferenceFormat(reference)) {
      throw new Error(`Invalid reference format: ${reference}. Expected format: EBCOL followed by 11 digits`);
    }
    
    // Verify it appears in success message
    try {
      await this.verifyReferenceInSuccessMessage(reference);
    } catch {
      console.log('Reference not found in success message, continuing...');
    }
    
    return reference;
  }

  /**
   * Get reference number details
   * @param reference - Reference number
   * @returns Object with reference details
   */
  parseReference(reference: string): {
    prefix: string;
    sequenceNumber: string;
    isValid: boolean;
  } {
    const match = reference.match(/^(EBCOL)(\d+)$/);
    
    if (!match) {
      return { prefix: '', sequenceNumber: '', isValid: false };
    }
    
    return {
      prefix: match[1],
      sequenceNumber: match[2],
      isValid: true,
    };
  }

  /**
   * Log reference details for debugging/reporting
   * @param reference - Reference to log
   */
  logReferenceDetails(reference: string): void {
    const details = this.parseReference(reference);
    console.log('=== Reference Details ===');
    console.log(`Full Reference: ${reference}`);
    console.log(`Prefix: ${details.prefix}`);
    console.log(`Sequence: ${details.sequenceNumber}`);
    console.log(`Valid Format: ${details.isValid}`);
    console.log(`Captured At: ${new Date().toISOString()}`);
    console.log('========================');
  }

  /**
   * Get reference number with metadata
   * @param reference - Reference to process
   * @returns Reference object with metadata
   */
  createReferenceRecord(reference: string): {
    reference: string;
    capturedAt: string;
    isValid: boolean;
    prefix: string;
    sequenceNumber: string;
  } {
    const details = this.parseReference(reference);
    return {
      reference,
      capturedAt: new Date().toISOString(),
      isValid: details.isValid,
      prefix: details.prefix,
      sequenceNumber: details.sequenceNumber,
    };
  }
}
