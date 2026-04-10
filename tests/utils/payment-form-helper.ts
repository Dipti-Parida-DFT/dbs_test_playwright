import { Page, expect } from '@playwright/test';

export class PaymentFormHelper {
  constructor(private page: Page) {}

  // Navigation
  async navigateToLogin() {
    await this.page.goto('https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin');
    //await expect(this.page).toHaveTitle('IDEAL SHIFT');
  }

  async login(organizationId: string, userId: string, pin: string) {
    await this.page.fill('input[name="corpId"]', organizationId);
    await this.page.fill('input[name="username"]', userId);
    await this.page.fill('input[name="psw"]', pin);
    await this.page.click('button:has-text("Login")');
    await this.page.waitForURL('**/dashboard');
  }

  async navigateToPayAndTransfer() {
    await this.page.click('text= Pay & Transfer ');
    await this.page.waitForSelector('text=Enter code manually from device');
  }

  async authenticateWithCode(code: string) {
    await this.page.fill('input[placeholder="Enter security access code"]', code);
    await this.page.click('button:has-text("Authenticate now")');
    await this.page.waitForURL('**/transfer-center/transactions');
  }

  async selectPaymentOption(optionName: string) {
    await this.page.click(`text=${optionName}`);
    await this.page.waitForURL('**/single-new/create');
  }

  // Account Selection
  async clickDebitAccountSection() {
    await this.page.click('text=Debit account');
    await this.page.waitForSelector('text=Search account name or account number');
  }

  async verifyAccountListVisible() {
    const accountsList = this.page.locator('[role="listitem"]');
    const count = await accountsList.count();
    expect(count).toBeGreaterThan(0);
  }

  async selectAccountByName(accountName: string) {
    await this.page.click(`text=${accountName}`);
    await this.page.waitForSelector(`text=${accountName}`);
  }

  async getSelectedAccountDetails() {
    const accountLabelText = await this.page.locator('text=Debit account').evaluate((el) =>
      el.nextElementSibling?.textContent
    );
    return accountLabelText;
  }

  // Payee Selection
  async clickPayeeSection() {
    await this.page.click('text=Select or add payee');
    await this.page.waitForSelector('text=payees found');
  }

  async searchPayee(searchTerm: string) {
    await this.page.fill('input[placeholder="Search by name, nickname, or account number"]', searchTerm);
    await this.page.waitForTimeout(500);
  }

  async selectPayeeByIndex(index: number) {
    const payeeItems = this.page.locator('[role="listitem"]').filter({ hasText: /^(?!.*Accounts)/ });
    await payeeItems.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async verifyPayeeSelected(payeeIdentifier: string) {
    await expect(this.page.locator(`text=${payeeIdentifier}`)).toBeVisible();
  }

  // Amount and Currency
  async enterAmount(amount: string) {
    await this.page.fill('input[placeholder="0.00"]', amount);
  }

  async getCurrency() {
    const currencyField = await this.page.locator('input[placeholder="CCY"]').inputValue();
    return currencyField;
  }

  async clickCurrencyField() {
    await this.page.click('input[placeholder="CCY"]');
  }

  // Payment Date
  async clickPaymentDate() {
    await this.page.click('button:has-text("Today"), button:has-text("Apr")');
  }

  async selectPaymentDate(date: string) {
    // Implementation depends on date picker UI
    await this.page.click(`text="${date}"`);
  }

  // Payment Type and Fees
  async selectPaymentType(paymentType: string) {
    const radioButton = this.page.locator(`label:has-text("${paymentType}") input[type="radio"]`);
    await radioButton.check();
  }

  async selectFeeArrangement(arrangement: string) {
    const radioButton = this.page.locator(`label:has-text("${arrangement}") input[type="radio"]`);
    await radioButton.check();
  }

  // Optional Information
  async enterRemitterIdentity(identity: string) {
    await this.page.fill('input[placeholder="Enter original remitter identity here"]', identity);
  }

  async getRemitterIdentityCharCount() {
    const charCountText = await this.page.locator('text=/\\d+\\/105/').textContent();
    return charCountText;
  }

  async enterBankStatementReference(reference: string) {
    await this.page.fill('input[placeholder="e.g. INV000123"]', reference);
  }

  async toggleCheckbox(label: string) {
    const checkbox = this.page.locator(`label:has-text("${label}") input[type="checkbox"]`);
    await checkbox.check();
  }

  async verifyCheckboxChecked(label: string) {
    const checkbox = this.page.locator(`label:has-text("${label}") input[type="checkbox"]`);
    await expect(checkbox).toBeChecked();
  }

  // Form Submission
  async clickSaveAsDraft() {
    await this.page.click('button:has-text("Save as draft")');
  }

  async clickReviewPayment() {
    await this.page.click('button:has-text("Review your payment")');
  }

  async getReviewButtonState() {
    const button = this.page.locator('button:has-text("Review your payment")');
    const isDisabled = await button.isDisabled();
    return { isDisabled };
  }

  // Error Handling
  async getErrorMessage(fieldLabel: string) {
    const errorMessage = this.page.locator(`text=${fieldLabel}`).locator('.. [role="alert"]');
    return await errorMessage.textContent();
  }

  async verifyErrorMessageVisible(message: string) {
    await expect(this.page.locator(`text="${message}"`)).toBeVisible();
  }
}