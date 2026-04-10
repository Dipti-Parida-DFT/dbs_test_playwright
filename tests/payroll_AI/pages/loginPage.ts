import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  // Locators
  private organisationIdInput: Locator;
  private userIdInput: Locator;
  private pinInput: Locator;
  private loginButton: Locator;
  private languageDropdown: Locator;
  private pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.organisationIdInput = page.getByRole('textbox', { name: 'Organisation ID' });
    this.userIdInput = page.getByRole('textbox', { name: 'User ID' });
    this.pinInput = page.getByRole('textbox', { name: 'PIN' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.languageDropdown = page.getByRole('combobox', { name: 'Language' });
    this.pageHeading = page.getByRole('heading', { level: 2, name: /IDEAL SHIFT/ });
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigate('https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin');
    await this.wait(2000);
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.pageHeading);
  }

  /**
   * Enter organisation ID
   */
  async enterOrganisationId(orgId: string): Promise<void> {
    await this.fillText(this.organisationIdInput, orgId);
  }

  /**
   * Enter user ID
   */
  async enterUserId(userId: string): Promise<void> {
    await this.fillText(this.userIdInput, userId);
  }

  /**
   * Enter PIN
   */
  async enterPin(pin: string): Promise<void> {
    await this.fillText(this.pinInput, pin);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton);
    await this.wait(3000);
  }

  /**
   * Login with credentials
   */
  async login(orgId: string, userId: string, pin: string): Promise<void> {
    await this.enterOrganisationId(orgId);
    await this.enterUserId(userId);
    await this.enterPin(pin);
    await this.clickLogin();
  }

  /**
   * Get error message if login fails
   */
  async getErrorMessage(): Promise<string> {
    const errorElement = this.page.locator('[role="alert"], .error-message');
    return await this.getText(errorElement);
  }
}