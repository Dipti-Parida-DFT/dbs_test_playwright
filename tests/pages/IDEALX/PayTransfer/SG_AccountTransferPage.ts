import { Page, Locator, expect } from '@playwright/test';
import { WebComponents } from '../../../lib/components';
import { TestUtils } from '../../../lib/testUtils';
import testData from '../../../data/sgAccountTransferTestData.json';

export class SG_AccountTransferPage {
  private readonly page: Page;
  private readonly wc: WebComponents;
  private readonly utils: TestUtils;
  private readonly testData = testData;

  // Locators - Login/Announcement
  readonly acknowledgeButton: Locator;

  // Locators - Dashboard
  readonly payTransferNav: Locator;
  readonly securityAccessCodeInput: Locator;
  readonly authenticateNowButton: Locator;

  // Locators - Payment Creation
  readonly makePaymentIcon: Locator;
  readonly debitAccountSection: Locator;
  readonly debitAccountSelect: Locator;
  readonly payeeSearchIcon: Locator;
  readonly payeeSearchInput: Locator;
  readonly amountInput: Locator;
  readonly shareCostCheckbox: Locator;
  readonly reviewPaymentButton: Locator;

  // Locators - Remitter Details
  readonly remitterInfoText: Locator;
  readonly remitterInput: Locator;

  // Locators - Confirmation/Submit
  readonly skipForNowButton: Locator;
  readonly submitButton: Locator;
  readonly copyButton: Locator;

  // Locators - History/Filter
  readonly filterByPayeeInput: Locator;
  readonly noInformationText: Locator;

  constructor(page: Page, webComponents?: WebComponents) {
    this.page = page;
    this.wc = webComponents ?? new WebComponents();
    this.utils = new TestUtils(page);

    // Login/Announcement
    //this.acknowledgeButton = page.getByRole('button', { name: 'I acknowledge' });
    this.acknowledgeButton = page.locator('//button[contains(text(),"I acknowledge")]');

    // Dashboard
    this.payTransferNav = page.locator('//span[text()=" Pay & Transfer "]//parent::div');
    this.securityAccessCodeInput = page.getByRole('textbox', { name: 'Enter security access code' });
    this.authenticateNowButton = page.getByRole('button', { name: 'Authenticate now' });

    // Payment Creation
    this.makePaymentIcon = page.locator('#icon__make_payment > svg > use');
    this.debitAccountSection = page.locator('//label[text()="Pay Local / Overseas Payee"]//parent::div');
    this.debitAccountSelect = page.locator('#acct-id-0').getByText('SG SUBSI ACCOUNT MCA');
    this.payeeSearchIcon = page.locator('.size-3 > .mat-icon > svg');
    this.payeeSearchInput = page.getByRole('textbox', { name: 'Search by name, nickname, or' });
    this.amountInput = page.getByRole('textbox', { name: '0.00' });
    this.shareCostCheckbox = page.locator('label').filter({ hasText: 'Both you and your payee (SHAR' });
    this.reviewPaymentButton = page.getByRole('button', { name: 'Review your payment' });

    // Remitter Details
    this.remitterInfoText = page.getByText('For Individual, please input');
    this.remitterInput = page.getByRole('textbox', { name: 'Enter original remitter' });

    // Confirmation/Submit
    this.skipForNowButton = page.getByRole('button', { name: 'Skip for now' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.copyButton = page.locator('view-from-to-date').getByText('Copy');

    // History/Filter
    this.filterByPayeeInput = page.getByRole('textbox', { name: 'Filter by payee or reference' });
    this.noInformationText = page.getByText('No information to display');
  }

  /**
   * Dismiss chrome error warning and proceed to application
   */
  async handleChromeWarning() {
    await this.utils.navigateTo('chrome-error://chromewebdata/');
    await this.page.getByRole('button', { name: 'Advanced' }).click();
    await this.page.getByRole('link', { name: 'Proceed to 10.8.58.138 (' }).click();
  }

  /**
   * Acknowledge the announcement banner on login
   */
  async acknowledgeAnnouncement() {
    await this.utils.navigateTo('https://10.8.58.138:8443/idealx/#/announcement');
    await this.acknowledgeButton.click();
  }

  /**
   * Navigate to Pay & Transfer section
   */
  async navigateToPayTransfer() {
    await this.payTransferNav.click();
    //await this.utils.navigateTo('https://10.8.58.138:8443/idealx/#/dashboard');
  }

  /**
   * Authenticate with security access code
   */
  async authenticateWithAccessCode(accessCode: string) {
    await this.utils.waitForElementVisible(this.securityAccessCodeInput);
    await this.securityAccessCodeInput.fill(accessCode);
    await this.authenticateNowButton.click();
  }

  /**
   * Initiate new payment by clicking make payment icon
   */
  async initiateNewPayment() {
    await this.makePaymentIcon.click();
    //await this.utils.navigateTo('https://10.8.58.138:8443/idealx/#/single-new/create?pmtTypeCode=sgact%7Csgtt%7Csgg3pmt%7Csgmeps%7Csggiro%7Csggst');
  }

  /**
   * Select debit account
   */
  async selectDebitAccount() {
    await this.debitAccountSection.click();
    await this.debitAccountSelect.click();
  }

  /**
   * Search and select payee
   */
  async searchAndSelectPayee(payeeSearchTerm: string, payeeName: string) {
    await this.payeeSearchIcon.click();
    await this.payeeSearchInput.click();
    await this.payeeSearchInput.fill(payeeSearchTerm);
    await this.page.getByText(payeeName).first().click();
  }

  /**
   * Enter payment amount
   */
  async enterPaymentAmount(amount: string) {
    await this.utils.waitForElementVisible(this.amountInput);
    await this.amountInput.click();
    await this.amountInput.fill(amount);
  }

  /**
   * Select cost sharing option
   */
  async selectCostSharingOption() {
    await this.utils.waitForElementVisible(this.shareCostCheckbox);
    await this.shareCostCheckbox.click();
  }

  /**
   * Click review payment button
   */
  async reviewPayment() {
    await this.utils.waitForElementVisible(this.reviewPaymentButton);
    await this.reviewPaymentButton.click();
  }

  /**
   * Enter remitter details for individual
   */
  async enterRemitterDetails(remitterName: string) {
    await this.utils.waitForElementVisible(this.remitterInfoText);
    await this.remitterInfoText.click();
    await this.remitterInfoText.click();
    await this.utils.waitForElementVisible(this.remitterInput);
    await this.remitterInput.click();
    await this.remitterInput.fill(remitterName);
  }

  /**
   * Submit payment after entering remitter details
   */
  async submitPaymentWithRemitter() {
    await this.utils.waitForElementVisible(this.reviewPaymentButton);
    await this.reviewPaymentButton.click();
    await this.utils.waitForElementVisible(this.skipForNowButton);
    await this.skipForNowButton.click();
    await this.utils.waitForElementVisible(this.submitButton);
    await this.submitButton.click();
  }

  /**
   * Copy transaction reference
   */
  async copyTransactionReference() {
    await this.utils.waitForElementVisible(this.copyButton);
    await this.copyButton.click();
  }

  /**
   * Go back to payment history and filter
   */
  async goBackAndFilter(referenceNumber: string) {
    await this.utils.goBack();
    await this.utils.waitForElementVisible(this.filterByPayeeInput);
    await this.filterByPayeeInput.click();
    await this.filterByPayeeInput.fill(referenceNumber);
    await this.noInformationText.click();
  }

  /**
   * Complete full SG Account Transfer flow using test data
   */
  async completeSGAccountTransfer() {
    // Handle initial setup
    //await this.handleChromeWarning();
    
    // Acknowledge announcement
    await this.acknowledgeAnnouncement();

    // Navigate to Pay & Transfer
    await this.navigateToPayTransfer();

    // Authenticate
    await this.authenticateWithAccessCode(this.testData.authentication.securityAccessCode);

    // Initiate payment
    await this.initiateNewPayment();

    // Select debit account
    await this.selectDebitAccount();

    // Search and select payee
    await this.searchAndSelectPayee(
      this.testData.payeeDetails.searchTerm,
      this.testData.payeeDetails.payeeName
    );

    // Enter amount
    await this.enterPaymentAmount(this.testData.paymentDetails.amount);

    // Select cost sharing
    await this.selectCostSharingOption();

    // Review payment
    await this.reviewPayment();

    // Enter remitter details
    await this.enterRemitterDetails(this.testData.remitterDetails.remitterName);

    // Submit payment
    await this.submitPaymentWithRemitter();

    // Copy and filter
    await this.copyTransactionReference();
    await this.goBackAndFilter(this.testData.transactionDetails.referenceNumber);
  }
}
