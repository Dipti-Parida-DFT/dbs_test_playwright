import { Page, Locator } from '@playwright/test';

/**
 * Login Page Object Model
 * Represents the IDEAL SHIFT R8.8 SSO login page
 */
export class LoginPage {
  readonly page: Page;
  readonly organisationIdField: Locator;
  readonly userIdField: Locator;
  readonly pinField: Locator;
  readonly languageDropdown: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.organisationIdField = page.getByRole('textbox', { name: 'Organisation ID' });
    this.userIdField = page.getByRole('textbox', { name: 'User ID' });
    this.pinField = page.getByRole('textbox', { name: 'PIN' });
    this.languageDropdown = page.getByRole('combobox', { name: 'Language' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin');
  }

  async enterOrganisationId(orgId: string): Promise<void> {
    await this.organisationIdField.fill(orgId);
  }

  async enterUserId(userId: string): Promise<void> {
    await this.userIdField.fill(userId);
  }

  async enterPin(pin: string): Promise<void> {
    await this.pinField.fill(pin);
  }

  async fillCredentials(orgId: string, userId: string, pin: string): Promise<void> {
    await this.enterOrganisationId(orgId);
    await this.enterUserId(userId);
    await this.enterPin(pin);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(orgId: string, userId: string, pin: string): Promise<void> {
    await this.fillCredentials(orgId, userId, pin);
    await this.clickLogin();
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await this.loginButton.isVisible();
  }

  async getOrganisationIdValue(): Promise<string | null> {
    return await this.organisationIdField.inputValue();
  }

  async getUserIdValue(): Promise<string | null> {
    return await this.userIdField.inputValue();
  }
}
