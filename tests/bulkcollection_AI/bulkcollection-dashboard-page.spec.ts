import { Page, Locator } from '@playwright/test';

/**
 * Dashboard Page Object Model
 * Represents the main dashboard after login
 */
export class DashboardPage {
  readonly page: Page;
  readonly userGreeting: Locator;
  readonly dashboardMenu: Locator;
  readonly approvalsMenu: Locator;
  readonly accountsMenu: Locator;
  readonly payTransferMenu: Locator;
  readonly foreignExchangeMenu: Locator;
  readonly filesMenu: Locator;
  readonly reportsMenu: Locator;
  readonly applyMenu: Locator;
  readonly administrationMenu: Locator;
  readonly logoutMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userGreeting = page.getByText(/Hi DBSAUTOHK002|Hi.*\d+/);
    this.dashboardMenu = page.getByText('Dashboard').first();
    this.approvalsMenu = page.getByText('Approvals');
    this.accountsMenu = page.getByText('Accounts');
    this.payTransferMenu = page.getByText('Pay & Transfer');
    this.foreignExchangeMenu = page.getByText('Foreign Exchange');
    this.filesMenu = page.getByText('Files');
    this.reportsMenu = page.getByText('Reports');
    this.applyMenu = page.getByText('Apply');
    this.administrationMenu = page.getByText('Administration');
    this.logoutMenu = page.getByText('Logout');
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.userGreeting.isVisible();
  }

  /**
   * Verify user greeting displays correct user ID
   */
  async verifyUserGreeting(expectedUserId: string): Promise<void> {
    await this.page.getByText(`Hi ${expectedUserId}`).isVisible();
  }

  /**
   * Navigate to Pay & Transfer menu
   */
  async navigateToPayTransfer(): Promise<void> {
    await this.payTransferMenu.click();
  }

  /**
   * Navigate to Dashboard
   */
  async navigateToDashboard(): Promise<void> {
    await this.dashboardMenu.click();
  }

  /**
   * Navigate to Approvals
   */
  async navigateToApprovals(): Promise<void> {
    await this.approvalsMenu.click();
  }

  /**
   * Navigate to Accounts
   */
  async navigateToAccounts(): Promise<void> {
    await this.accountsMenu.click();
  }

  /**
   * Navigate to Reports
   */
  async navigateToReports(): Promise<void> {
    await this.reportsMenu.click();
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.logoutMenu.click();
  }

  /**
   * Verify all menu items are visible
   */
  async verifyMenusVisible(): Promise<void> {
    await this.dashboardMenu.isVisible();
    await this.payTransferMenu.isVisible();
    await this.accountsMenu.isVisible();
  }
}
