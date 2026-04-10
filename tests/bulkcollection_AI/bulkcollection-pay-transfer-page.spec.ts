import { Page, Locator } from '@playwright/test';

/**
 * Pay & Transfer Menu Page Object Model
 * Represents the Pay & Transfer menu showing transaction options
 */
export class PayTransferMenuPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly payLocalOverseasPayee: Locator;
  readonly transferWithinOwnAccounts: Locator;
  readonly payroll: Locator;
  readonly payrollAlternate: Locator;
  readonly managementPayroll: Locator;
  readonly managementPayrollAlternate: Locator;
  readonly bulkPayment: Locator;
  readonly bulkCollection: Locator;
  readonly chequePayments: Locator;
  readonly paymentHistory: Locator;
  readonly paymentTemplates: Locator;
  readonly payeeBeneficiaries: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.locator('heading:has-text("Pay & Transfer")');
    this.payLocalOverseasPayee = page.getByText('Pay Local / Overseas Payee');
    this.transferWithinOwnAccounts = page.getByText('Transfer within Own Accounts');
    this.payroll = page.getByText('Payroll');
    this.payrollAlternate = page.getByText('Payroll (Alternate)');
    this.managementPayroll = page.getByText('Management Payroll');
    this.managementPayrollAlternate = page.getByText('Management Payroll (Alternate)');
    this.bulkPayment = page.getByText('Bulk Payment');
    this.bulkCollection = page.getByText('Bulk Collection');
    this.chequePayments = page.getByText('Cheque Payments');
    this.paymentHistory = page.getByRole('link', { name: 'Payment History' });
    this.paymentTemplates = page.getByRole('link', { name: 'Payment Templates' });
    this.payeeBeneficiaries = page.getByRole('link', { name: 'Payee / Beneficiaries' });
  }

  /**
   * Verify Pay & Transfer menu page is displayed
   */
  async verifyPageDisplayed(): Promise<void> {
    await this.pageHeading.isVisible();
  }

  /**
   * Verify all transaction types are visible
   */
  async verifyTransactionTypes(): Promise<void> {
    await this.payLocalOverseasPayee.isVisible();
    await this.transferWithinOwnAccounts.isVisible();
    await this.payroll.isVisible();
    await this.bulkPayment.isVisible();
    await this.bulkCollection.isVisible();
    await this.chequePayments.isVisible();
  }

  /**
   * Click on Bulk Collection option
   */
  async clickBulkCollection(): Promise<void> {
    await this.bulkCollection.click();
  }

  /**
   * Click on Pay Local / Overseas Payee
   */
  async clickPayLocalOverseasPayee(): Promise<void> {
    await this.payLocalOverseasPayee.click();
  }

  /**
   * Click on Bulk Payment
   */
  async clickBulkPayment(): Promise<void> {
    await this.bulkPayment.click();
  }

  /**
   * Click on Payment History
   */
  async clickPaymentHistory(): Promise<void> {
    await this.paymentHistory.click();
  }

  /**
   * Click on Payment Templates
   */
  async clickPaymentTemplates(): Promise<void> {
    await this.paymentTemplates.click();
  }

  /**
   * Click on Payee / Beneficiaries
   */
  async clickPayeeBeneficiaries(): Promise<void> {
    await this.payeeBeneficiaries.click();
  }

  /**
   * Verify Bulk Collection option is available
   */
  async verifyBulkCollectionAvailable(): Promise<void> {
    await this.bulkCollection.isVisible();
  }
}
