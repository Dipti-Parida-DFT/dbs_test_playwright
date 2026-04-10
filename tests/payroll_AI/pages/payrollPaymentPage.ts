import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class PayrollPaymentPage extends BasePage {
  // Step 1: Payment from section
  //private accountDropdown: Locator;
  private accountDropdownInput: Locator;
  private accountSelectedText: Locator;

  // Step 2: Payment to section - New Payee tab
  private newPayeeTab: Locator;
  private existingPayeeTab: Locator;
  private payeeNameInput: Locator;
  private payeeNicknameInput: Locator;
  private bankIdInput: Locator;
  private accountNumberInput: Locator;
  private payeeCategoryDropdown: Locator;
  private addPayeeButton: Locator;
  private savePayeeCheckbox: Locator;

  // Added Payees section
  private addedPayeesSection: Locator;
  private payeeAmountInput: Locator;
  private purposeDropdown: Locator;
  private referenceInput: Locator;
  private showOptionalDetailsLink: Locator;

  // Step 3: Payment date
  private earliestAvailableDateRadio: Locator;
  private chooseDateRadio: Locator;
  private dateInput: Locator;

  // Step 4: Transaction references
  private internalReferenceInput: Locator;
  private batchIdInput: Locator;

  // Buttons
  private nextButton: Locator;
  private submitButton: Locator;
  private draftButton: Locator;
  private cancelButton: Locator;
  private payrollHeading: Locator;

  constructor(page: Page) {
    super(page);
    // Step 1 locators
    this.accountDropdownInput = page.getByRole('textbox', { name: /Select/i }).first();
    this.accountSelectedText = page.locator('css=.ui-autocomplete-token-label');

    // Step 2 - Tab locators
    this.newPayeeTab = page.getByRole('tab', { name: /New payee/i });
    this.existingPayeeTab = page.getByRole('tab', { name: /Existing payee/i });

    // Payee form fields
    this.payeeNameInput = page.locator('[id*="input-3"]');
    this.payeeNicknameInput = page.locator('[id*="input-5"]');
    this.bankIdInput = page.getByRole('textbox', { name: /Type bank ID or bank name/ });
    this.accountNumberInput = page.locator('[id*="input-4"]');
    this.payeeCategoryDropdown = page.locator('[id="payeeCategory"]');
    this.addPayeeButton = page.getByRole('button', { name: /Add payee/i });
    this.savePayeeCheckbox = page.locator('input[type="checkbox"]').first();

    // Added payees and payment details
    this.addedPayeesSection = page.locator('text=Added payees').first();
    this.payeeAmountInput = page.locator('[id*="amount"]').first();
    this.purposeDropdown = page.getByRole('textbox', { name: /Purpose of Payment/i });
    this.referenceInput = page.locator('[id*="reference"]').first();
    this.showOptionalDetailsLink = page.locator('text=Show optional details').first();

    // Payment date section
    this.earliestAvailableDateRadio = page.locator('input[type="radio"]').first();
    this.chooseDateRadio = page.locator('input[type="radio"]').nth(1);
    this.dateInput = page.getByRole('textbox', { name: /DD MMM YYYY/ });

    // Transaction references
    this.internalReferenceInput = page.locator('[id*="reference"]').first();
    this.batchIdInput = page.locator('[id*="batchId"]').first();

    // Bottom buttons
    this.nextButton = page.getByRole('button', { name: /Next/i });
    this.submitButton = page.getByRole('button', { name: /Submit/i });
    this.draftButton = page.getByRole('button', { name: /Save as draft/i });
    this.cancelButton = page.getByRole('button', { name: /Cancel/i });

    this.payrollHeading = page.getByRole('heading', { level: 1, name: /Payroll/i });
  }

  /**
   * Check if payroll payment page is displayed
   */
  async isPayrollPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.payrollHeading);
  }

  /**
   * Select account from dropdown
   */
  async selectAccount(accountName: string): Promise<void> {
    await this.clickElement(this.accountDropdownInput);
    await this.wait(500);
    const accountOption = this.page.locator(`text=${accountName}`).first();
    await this.clickElement(accountOption);
    await this.wait(1000);
  }

  /**
   * Click on New Payee tab
   */
  async clickNewPayeeTab(): Promise<void> {
    await this.clickElement(this.newPayeeTab);
    await this.wait(500);
  }

  /**
   * Enter payee name
   */
  async enterPayeeName(name: string): Promise<void> {
    await this.fillText(this.payeeNameInput, name);
  }

  /**
   * Enter payee nickname
   */
  async enterPayeeNickname(nickname: string): Promise<void> {
    await this.fillText(this.payeeNicknameInput, nickname);
  }

  /**
   * Enter bank ID
   */
  async enterBankId(bankId: string): Promise<void> {
    await this.fillText(this.bankIdInput, bankId);
    await this.wait(500);
  }

  /**
   * Enter account number
   */
  async enterAccountNumber(accountNumber: string): Promise<void> {
    await this.fillText(this.accountNumberInput, accountNumber);
  }

  /**
   * Select payee category
   */
  async selectPayeeCategory(category: string): Promise<void> {
    const dropdown = this.page.locator('[id="payeeCategory"]');
    await this.clickElement(dropdown);
    await this.wait(500);
    const categoryOption = this.page.locator(`text=${category}`).first();
    await this.clickElement(categoryOption);
    await this.wait(500);
  }

  /**
   * Click add payee button
   */
  async clickAddPayee(): Promise<void> {
    await this.wait(1000);
    const isEnabled = await this.isElementEnabled(this.addPayeeButton);
    if (isEnabled) {
      await this.clickElement(this.addPayeeButton);
      await this.wait(2000);
    } else {
      throw new Error('Add payee button is disabled');
    }
  }

  /**
   * Add new payee with all details
   */
  async addNewPayee(
    payeeName: string,
    payeeNickname: string,
    bankId: string,
    accountNumber: string,
    category: string = 'Others'
  ): Promise<void> {
    await this.clickNewPayeeTab();
    await this.enterPayeeName(payeeName);
    await this.enterPayeeNickname(payeeNickname);
    await this.enterBankId(bankId);
    await this.enterAccountNumber(accountNumber);
    await this.selectPayeeCategory(category);
    await this.clickAddPayee();
  }

  /**
   * Enter payment amount for payee
   */
  async enterPaymentAmount(amount: string): Promise<void> {
    const amountInputs = this.page.locator('[id*="amount"]');
    const firstAmountInput = amountInputs.first();
    await this.fillText(firstAmountInput, amount);
  }

  /**
   * Select purpose of payment
   */
  async selectPurpose(purpose: string): Promise<void> {
    const purposeField = this.page.locator('[id*="purpose"], [name*="purpose"]').first();
    await this.clickElement(purposeField);
    await this.wait(500);
    const purposeOption = this.page.locator(`text=${purpose}`).first();
    await this.clickElement(purposeOption);
    await this.wait(500);
  }

  /**
   * Enter reference for payee
   */
  async enterPayeeReference(reference: string): Promise<void> {
    const refInputs = this.page.locator('input[id*="reference"]');
    const firstRefInput = refInputs.first();
    await this.fillText(firstRefInput, reference);
  }

  /**
   * Click show optional details
   */
  async clickShowOptionalDetails(): Promise<void> {
    const link = this.page.locator('text=Show optional details').first();
    if (await this.isElementVisible(link)) {
      await this.clickElement(link);
      await this.wait(500);
    }
  }

  /**
   * Enter optional payment details
   */
  async enterOptionalDetails(particulars: string, messageToPayee: string, emails: string): Promise<void> {
    await this.clickShowOptionalDetails();
    
    const particularsInput = this.page.locator('[id*="particulars"]').first();
    if (await this.isElementVisible(particularsInput)) {
      await this.fillText(particularsInput, particulars);
    }

    const messageInput = this.page.locator('[id*="message"]').first();
    if (await this.isElementVisible(messageInput)) {
      await this.fillText(messageInput, messageToPayee);
    }

    const emailInput = this.page.locator('[id*="email"]').first();
    if (await this.isElementVisible(emailInput)) {
      await this.fillText(emailInput, emails);
    }
  }

  /**
   * Select payment date - earliest available
   */
  async selectEarliestAvailableDate(): Promise<void> {
    const radioOptions = this.page.locator('input[type="radio"]');
    const firstOption = radioOptions.first();
    await this.clickElement(firstOption);
  }

  /**
   * Select specific payment date
   */
  async selectSpecificDate(date: string): Promise<void> {
    await this.clickElement(this.chooseDateRadio);
    await this.wait(500);
    await this.fillText(this.dateInput, date);
  }

  /**
   * Enter internal reference
   */
  async enterInternalReference(reference: string): Promise<void> {
    const refInput = this.page.locator('input').filter({ has: this.page.getByText('Internal reference', { exact: true }) }).first();
    if (await this.isElementVisible(refInput)) {
      await this.fillText(refInput, reference);
    }
  }

  /**
   * Enter batch ID
   */
  async enterBatchId(batchId: string): Promise<void> {
    const batchInputs = this.page.locator('input').filter({ hasText: /batch|Batch/i });
    if ((await batchInputs.count()) > 0) {
      await this.fillText(batchInputs.first(), batchId);
    }
  }

  /**
   * Click Next button
   */
  async clickNext(): Promise<void> {
    await this.clickElement(this.nextButton);
    await this.wait(2000);
  }

  /**
   * Click Submit button
   */
  async clickSubmit(): Promise<void> {
    await this.clickElement(this.submitButton);
    await this.wait(2000);
  }

  /**
   * Click Cancel button
   */
  async clickCancel(): Promise<void> {
    await this.clickElement(this.cancelButton);
    await this.wait(1000);
  }

  /**
   * Get success message or banner text
   */
  async getSuccessMessage(): Promise<string> {
    await this.wait(1000);
    const bannerLocator = this.page.locator('[role="alert"], .success-banner, .mat-snack-bar-container').first();
    return await this.getText(bannerLocator);
  }

  /**
   * Get reference number from confirmation
   */
  async getReferenceNumber(): Promise<string> {
    const refPattern = /Reference[:\s]+([A-Z0-9]+)/i;
    const message = await this.getSuccessMessage();
    const match = message.match(refPattern);
    return match ? match[1] : '';
  }
}