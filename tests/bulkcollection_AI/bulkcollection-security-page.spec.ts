import { Page, Locator } from '@playwright/test';

/**
 * Security Code Page Object Model
 * Represents the security code dialog that appears during authentication
 */
export class SecurityCodePage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly securityCodeField: Locator;
  readonly authenticateNowButton: Locator;
  readonly dialogTitle: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('dialog:has-text("Enter code manually from device")');
    this.securityCodeField = page.getByRole('textbox', { name: 'Enter security access code' });
    this.authenticateNowButton = page.getByRole('button', { name: 'Authenticate now' });
    this.dialogTitle = page.locator('heading:has-text("Enter code manually from device")');
    this.closeButton = page.locator('button[aria-label*="close"], .mat-icon-button close');
  }

  /**
   * Verify security code dialog is displayed
   */
  async verifyDialogDisplayed(): Promise<void> {
    await this.dialog.isVisible();
  }

  /**
   * Enter security code
   * @param code - Security code to enter
   */
  async enterSecurityCode(code: string): Promise<void> {
    await this.securityCodeField.fill(code);
  }

  /**
   * Click Authenticate now button
   */
  async clickAuthenticateNow(): Promise<void> {
    await this.authenticateNowButton.click();
  }

  /**
   * Perform complete security authentication flow
   * @param code - Security code
   */
  async authenticate(code: string): Promise<void> {
    await this.enterSecurityCode(code);
    await this.clickAuthenticateNow();
  }

  /**
   * Get security code field value
   */
  async getSecurityCodeValue(): Promise<string | null> {
    return await this.securityCodeField.inputValue();
  }

  /**
   * Verify authenticate button is enabled
   */
  async verifyAuthenticateButtonEnabled(): Promise<void> {
    await this.authenticateNowButton.isEnabled();
  }

  /**
   * Close the security dialog
   */
  async closeDialog(): Promise<void> {
    await this.closeButton.click();
  }
}
