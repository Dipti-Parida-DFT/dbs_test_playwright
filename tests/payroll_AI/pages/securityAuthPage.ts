import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class SecurityAuthPage extends BasePage {
  // Locators
  private securityCodeInput: Locator;
  private authenticateNowButton: Locator;
  private dialogTitle: Locator;
  private instructionText: Locator;

  constructor(page: Page) {
    super(page);
    this.securityCodeInput = page.getByRole('textbox', { name: /Enter security access code/i });
    this.authenticateNowButton = page.getByRole('button', { name: /Authenticate now/i });
    this.dialogTitle = page.getByRole('heading', { level: 2, name: /Enter code manually from device/i });
    this.instructionText = page.locator('text=Launch IDEAL Mobile App').first();
  }

  /**
   * Check if security auth dialog is displayed
   */
  async isAuthDialogDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.dialogTitle);
  }

  /**
   * Enter security code
   */
  async enterSecurityCode(code: string): Promise<void> {
    await this.fillText(this.securityCodeInput, code);
  }

  /**
   * Click authenticate now button
   */
  async clickAuthenticateNow(): Promise<void> {
    await this.clickElement(this.authenticateNowButton);
    await this.wait(3000);
  }

  /**
   * Authenticate with security code
   */
  async authenticate(securityCode: string): Promise<void> {
    await this.enterSecurityCode(securityCode);
    await this.clickAuthenticateNow();
  }

  /**
   * Get dialog title
   */
  async getDialogTitle(): Promise<string> {
    return await this.getText(this.dialogTitle);
  }
}