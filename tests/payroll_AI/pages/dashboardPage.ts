import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class DashboardPage extends BasePage {
  // Locators
  private userNameText: Locator;
  private locationText: Locator;
  private payAndTransferMenu: Locator;
  private approvalsMenu: Locator;
  private accountsMenu: Locator;
  private dashboardMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameText = page.getByText(/LEONA ALBRECHT/);
    this.locationText = page.getByText('Singapore');
    this.payAndTransferMenu = page.locator('text=Pay & Transfer').first();
    this.approvalsMenu = page.locator('text=Approvals').first();
    this.accountsMenu = page.locator('text=Accounts').first();
    this.dashboardMenu = page.locator('text=Dashboard').first();
  }

  /**
   * Check if dashboard is displayed
   */
  async isDashboardDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.userNameText);
  }

  /**
   * Get user name from dashboard
   */
  async getUserName(): Promise<string> {
    return await this.getText(this.userNameText);
  }

  /**
   * Check if specific menu item is visible
   */
  async isMenuItemVisible(menuName: string): Promise<boolean> {
    const menuLocator = this.page.locator(`text=${menuName}`).first();
    return await this.isElementVisible(menuLocator);
  }

  /**
   * Click on Pay & Transfer menu
   */
  async clickPayAndTransfer(): Promise<void> {
    const menu = this.page.getByRole('generic').filter({ has: this.page.getByText('Pay & Transfer', { exact: true }) }).first();
    await this.clickElement(menu);
    await this.wait(2000);
  }

  /**
   * Click on Approvals menu
   */
  async clickApprovals(): Promise<void> {
    await this.clickElement(this.approvalsMenu);
    await this.wait(2000);
  }

  /**
   * Click on Accounts menu
   */
  async clickAccounts(): Promise<void> {
    await this.clickElement(this.accountsMenu);
    await this.wait(2000);
  }

  /**
   * Navigate to Pay & Transfer page
   */
  async navigateToPayAndTransfer(): Promise<void> {
    await this.clickPayAndTransfer();
  }
}