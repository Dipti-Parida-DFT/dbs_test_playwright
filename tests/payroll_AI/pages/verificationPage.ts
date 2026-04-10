import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class VerificationPage extends BasePage {
  // Locators
  private verificationHeading: Locator;
  private paymentDetailsSection: Locator;
  private submitButton: Locator;
  private backButton: Locator;
  private confirmationMessage: Locator;
  private finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.verificationHeading = page.getByRole('heading', { 
      level: 1, 
      name: /Verify|Verification|Confirm/i 
    });
    this.paymentDetailsSection = page.locator('[class*="details"], [class*="summary"]').first();
    this.submitButton = page.getByRole('button', { name: /Submit/i });
    this.backButton = page.getByRole('button', { name: /Back|Previous/i });
    this.confirmationMessage = page.locator('[role="alert"], .success-message, .confirmation').first();
    this.finishButton = page.getByRole('button', { name: /Finish|Done|Complete/i });
  }

  /**
   * Check if verification page is displayed
   */
  async isVerificationPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.verificationHeading);
  }

  /**
   * Get verification/summary heading
   */
  async getVerificationHeading(): Promise<string> {
    return await this.getText(this.verificationHeading);
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.clickElement(this.submitButton);
    await this.wait(3000);
  }

  /**
   * Click back button
   */
  async clickBack(): Promise<void> {
    await this.clickElement(this.backButton);
    await this.wait(2000);
  }

  /**
   * Check if confirmation message is displayed
   */
  async isConfirmationMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.confirmationMessage);
  }

  /**
   * Get confirmation message text
   */
  async getConfirmationMessage(): Promise<string> {
    return await this.getText(this.confirmationMessage);
  }

  /**
   * Click finish button
   */
  async clickFinish(): Promise<void> {
    if (await this.isElementVisible(this.finishButton)) {
      await this.clickElement(this.finishButton);
      await this.wait(2000);
    }
  }

  /**
   * Verify payment details are displayed
   */
  async arePaymentDetailsVisible(): Promise<boolean> {
    return await this.isElementVisible(this.paymentDetailsSection);
  }

  /**
   * Get confirmation number/reference from message
   */
  async getConfirmationReference(): Promise<string> {
    const message = await this.getConfirmationMessage();
    const refPattern = /Reference[:\s]+([A-Z0-9]+)|Ref[:\s]+([A-Z0-9]+)|[A-Z0-9]{10,}/i;
    const match = message.match(refPattern);
    return match ? (match[1] || match[2] || match[0]) : '';
  }
}