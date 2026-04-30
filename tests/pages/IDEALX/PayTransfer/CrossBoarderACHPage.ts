// tests/pages/IDEALX/PayTransfer/CrossBoarderACHPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { WebComponents } from '../../../lib/webComponents';
import { TIMEOUT } from '../../../lib/timeouts';

export class CrossBoarderACHPage {
  private readonly page: Page;
  private readonly wc: WebComponents;

  // Menu / Navigation
  readonly crossBorderMenu: Locator;
  readonly secondPageDot: Locator;

  // Create Form
  readonly fromAccount: Locator;
  readonly paymentCountry: Locator;
  readonly debitType: Locator;
  readonly payeeAmount: Locator;
  readonly paymentDetail: Locator;
  readonly showOptionDetail: Locator;
  readonly intermediaryBankInformation: Locator;
  readonly selectedIntermediaryCountry: Locator;
  readonly intermediaryBankIDInput: Locator;
  readonly messageToPayee: Locator;
  readonly messageToPayeeLabel: Locator;
  readonly bankSearchResult: Locator;
  readonly email1: Locator;
  readonly email2: Locator;
  readonly email3: Locator;
  readonly email4: Locator;
  readonly email5: Locator;
  readonly message: Locator;

  // Existing Payee
  readonly existingPayeeTab: Locator;
  readonly existingPayeeFilter: Locator;
  readonly addPayee: Locator;

  // Buttons
  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly dismissButton: Locator;
  readonly editButton: Locator;
  readonly approveButton: Locator;
  readonly pushOption: Locator;

  // Info / Reference
  readonly idealXInfoMsg: Locator;

  // Preview / View - From Account
  readonly fromAccountPreview: Locator;
  readonly fromAccountView: Locator;
  readonly amountView: Locator;
  readonly paymentDateView: Locator;
  readonly ExistingPayee: Locator;
  readonly crsBrdTransactionStatusValue: Locator;

  // View Page - Header
  readonly hashValue: Locator;
  readonly fromAccountValue: Locator;
  readonly balanceValue: Locator;
  readonly payeeArea: Locator;
  readonly deductedAmt: Locator;
  readonly debitTypeValue: Locator;
  readonly paymentDateValue: Locator;
  readonly internalRef: Locator;
  readonly batchIDValue: Locator;
  readonly statusValue: Locator;
  readonly activityLog: Locator;
  readonly nextApprover: Locator;

  // View Page - FX Section
  readonly contractRef: Locator;
  readonly indicativeExchangeRate: Locator;
  readonly amountToTransfer: Locator;
  readonly amountToDeduct: Locator;

  // View Page - Payment Summary
  readonly paymentSummaryTotalPayees: Locator;
  readonly paymentSummaryTotalAmount: Locator;

  // View Page - Payee 1
  readonly payeeName1: Locator;
  readonly payeeNickname1: Locator;
  readonly payeeBankCode1: Locator;
  readonly payeeBankName1: Locator;
  readonly payeeAcctNum1: Locator;
  readonly payeeAmt1: Locator;
  readonly payeeStatus1: Locator;
  readonly showOptBtn1: Locator;
  readonly paymentDetails1: Locator;
  readonly intermediaryCountryView1: Locator;
  readonly intermediaryBankIDView1: Locator;
  readonly message1: Locator;
  readonly emailList1: Locator;

  // View Page - Approval & Activity
  readonly approverGroups: Locator;
  readonly activityLogUser: Locator;
  readonly activityLogDateTime: Locator;

  // View Page - Currency
  readonly paymentCurrency: Locator;

  // INTL New Payee Form
  readonly newPayeeTab: Locator;
  readonly newPayeeName: Locator;
  readonly newPayeeNickname: Locator;
  readonly newPayeeAddress1: Locator;
  readonly swiftBICSelect: Locator;
  readonly payeeBankResult: Locator;
  readonly payeeBankRouting: Locator;
  readonly newPayeeAcctNo: Locator;
  readonly payeeCategoryInput: Locator;

  // INTL Create Form - Purpose / Additional / Detail
  readonly purposePaymentLine: Locator;
  readonly additionalInfoLine: Locator;
  readonly paymentDetailLine: Locator;

  constructor(page: Page, webComponents?: WebComponents) {
    this.page = page;
    this.wc = webComponents ?? new WebComponents();

    // Menu
    this.crossBorderMenu = page.locator('xpath=//*[@id="icon__ACH_payment"]/parent::span');
    this.secondPageDot = page.locator('xpath=(//li[contains(@class, "page-point")])[2]');

    // Create Form
    this.fromAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
    this.paymentCountry = page.locator('xpath=//p-auto-complete[@formcontrolname="countrySelected"]');
    this.debitType = page.locator('xpath=//p-auto-complete[@formcontrolname="debitTypeObjectSelected"]');
    this.payeeAmount = page.locator('xpath=//input[@name="payeeAmount"]');
    this.paymentDetail = page.locator('xpath=//*[@name="payeeDetails"]');
    this.showOptionDetail = page.locator('xpath=//*[@id="temp-bulk-create-optDetail_0"]');
    this.intermediaryBankInformation = page.locator('xpath=//*[@id="useIntermediary0"]');
    this.selectedIntermediaryCountry = page.locator('xpath=//p-auto-complete[@formcontrolname="selectedIntermediaryCountry"]');
    this.intermediaryBankIDInput = page.locator('input#ux-bank-search-0');
    this.messageToPayee = page.locator('xpath=//*[@id="isBeneAdvising0"]');
    this.messageToPayeeLabel = page.locator('label[for="isBeneAdvising0"]');
    this.bankSearchResult = page.locator('xpath=//*[@class="search-result-container"]').or(
      page.locator('table tr td').first()
    );
    this.email1 = page.locator('xpath=//input[@name="email-0"]');
    this.email2 = page.locator('xpath=//input[@name="email-1"]');
    this.email3 = page.locator('xpath=//input[@name="email-2"]');
    this.email4 = page.locator('xpath=//input[@name="email-3"]');
    this.email5 = page.locator('xpath=//input[@name="email-4"]');
    this.message = page.locator('xpath=//textarea[@name="adviceContent"]');

    // Existing Payee
    this.existingPayeeTab = page.locator('xpath=//*[@id="ux-tab-labelExistingPayee"]');
    this.existingPayeeFilter = page.locator('xpath=//input[@name="payee-selector"]').or(page.locator('textbox[name="Filter by name, nickname, account number or reference"]')).or(page.getByPlaceholder('Filter by name, nickname, account number or reference'));
    this.addPayee = page.locator('xpath=//button[@name="addPayee"]').or(page.locator('button[name="add"]'));

    // Buttons
    this.nextButton = page.locator('xpath=//button[@name="next"]');
    this.submitButton = page.locator('xpath=//button[@name="submit"]');
    this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');
    this.editButton = page.locator('xpath=//*[@id="crsbrd-view-edit"]');
    this.approveButton = page.locator('xpath=//button[@name="approve"]');
    this.pushOption = page.locator('xpath=//*[@class="push-option-label"]');

    // Info / Reference
    this.idealXInfoMsg = page.locator('xpath=//dbs-top-panel/div/div[starts-with(@class, "alert alert-info")]/ul');

    // Preview / View (preview and submitted pages use IDs; view page uses text-based)
    this.fromAccountPreview = page.locator('xpath=//span[@id="crsbrd-view-fromAccount"]');
    this.fromAccountView = page.locator('xpath=//span[@id="crsbrd-view-fromAccount"]');
    this.amountView = page.locator('xpath=//span[@id="crsbrd-view-payAmt"]');
    this.paymentDateView = page.locator('xpath=//span[@id="crsbrd-view-paymentDate"]');
    this.ExistingPayee = page.locator('xpath=//strong[@id="crsbrd-view-name_0"]');
    this.crsBrdTransactionStatusValue = page.locator('xpath=//strong[@id="crsbrd-view-pendingStatus_0"]');

    // View Page - Header
    this.hashValue = page.locator('xpath=//*[@id="crsbrd-view-hashValue"]');
    this.fromAccountValue = page.locator('xpath=//*[@id="crsbrd-view-fromAccount"]');
    this.balanceValue = page.locator('xpath=//*[@id="crsbrd-view-acctBalance"]');
    this.payeeArea = page.locator('xpath=//*[@id="crsbrd-view-paymentCountry"]');
    this.deductedAmt = page.locator('xpath=//*[@id="crsbrd-view-payAmt"]');
    this.debitTypeValue = page.locator('xpath=//*[@id="crsbrd-view-debitType"]');
    this.paymentDateValue = page.locator('xpath=//*[@id="crsbrd-view-paymentDate"]');
    this.internalRef = page.locator('xpath=//*[@id="crsbrd-view-custRef"]');
    this.batchIDValue = page.locator('xpath=//*[@id="crsbrd-view-batchID"]');
    this.statusValue = page.locator('xpath=//*[@id="bulk-viewTemp-status"]');
    this.activityLog = page.locator("xpath=//*[@class='payment-history']");
    this.nextApprover = page.locator("xpath=//dbs-approval-requirement/div/section/div[1]/span[2]");

    // View Page - FX Section
    this.contractRef = page.locator('xpath=//*[@id="fxDolViewSection"]/table/tbody/tr/td[1]/span/span');
    this.indicativeExchangeRate = page.locator('xpath=//*[@id="fxDolViewSection"]/table/tbody/tr/td[2]/span');
    this.amountToTransfer = page.locator('xpath=//*[@id="fxDolViewSection"]/table/tbody/tr/td[3]/span');
    this.amountToDeduct = page.locator('xpath=//*[@id="fxDolViewSection"]/table/tbody/tr/td[4]/span');

    // View Page - Payment Summary
    this.paymentSummaryTotalPayees = page.getByText(/Total payees:\s*\d/);
    this.paymentSummaryTotalAmount = page.getByText(/Total amount.*:\s*\d/);

    // View Page - Payee 1
    this.payeeName1 = page.locator('xpath=//*[@id="crsbrd-view-name_0"]');
    this.payeeNickname1 = page.locator('xpath=//*[@id="crsbrd-view-nickname_0"]');
    this.payeeBankCode1 = page.locator('xpath=//*[@id="crsbrd-view-payee-bankCode_0"]');
    this.payeeBankName1 = page.locator('xpath=//*[@id="crsbrd-view-payee-bankName_0"]');
    this.payeeAcctNum1 = page.locator('xpath=//*[@id="crsbrd-view-acctNum_0"]');
    this.payeeAmt1 = page.locator('xpath=//*[@id="crsbrd-view-amount_0"]');
    this.payeeStatus1 = page.locator('xpath=//strong[@id="crsbrd-view-pendingStatus_0"]');
    this.showOptBtn1 = page.locator('xpath=//*[@id="crsbrd-show-optBtn_0"]');
    this.paymentDetails1 = page.locator('xpath=//*[@id="crsbrd-view-paymentDetails_0"]');
    this.intermediaryCountryView1 = page.locator('xpath=//*[@id="crsbrd-view-intermediaryCountry_0"]');
    this.intermediaryBankIDView1 = page.locator('xpath=//*[@id="crsbrd-view-intermediaryBankId_0"]');
    this.message1 = page.locator('xpath=//*[@id="crsbrd-view-adviceContent_0"]');
    this.emailList1 = page.locator('xpath=//*[@id="crsbrd-view-email_0"]');

    // View Page - Approval & Activity
    this.approverGroups = page.locator('xpath=//dbs-approval-requirement//section//div[2]/span[2]');
    this.activityLogUser = page.locator('xpath=//*[@class="payment-history"]//div[last()]/div[2]');
    this.activityLogDateTime = page.locator('xpath=//*[@class="payment-history"]//div[last()]/div[3]');

    // View Page - Currency
    this.paymentCurrency = page.locator('xpath=//*[@id="crsbrd-view-paymentCurrency"]');

    // INTL New Payee Form
    this.newPayeeTab = page.locator('xpath=//*[@id="ux-tab-labelNewPayee"]');
    this.newPayeeName = page.locator('xpath=//input[@name="new-payee-payeeName"]');
    this.newPayeeNickname = page.locator('xpath=//input[@name="new-payee-nick-name"]');
    this.newPayeeAddress1 = page.locator('xpath=//input[@name="new-payee-add1"]');
    this.swiftBICSelect = page.locator('xpath=//input[@name="swift-selector"]');
    this.payeeBankResult = page.locator('xpath=//*[@class="search-result-container"]');
    this.payeeBankRouting = page.locator('xpath=//input[@name="new-payee-routing-code"]');
    this.newPayeeAcctNo = page.locator('xpath=//input[@name="new-payee-acct-number"]');
    this.payeeCategoryInput = page.getByPlaceholder('Please select');

    // INTL Create Form - Purpose / Additional / Detail
    this.purposePaymentLine = page.locator('xpath=//input[@name="crsbrdint1-bp-payee-payeePurpose1"]');
    this.additionalInfoLine = page.locator('xpath=//input[@name="crsbrdint1-bp-payee-payeeAdditional1"]');
    this.paymentDetailLine = page.locator('xpath=//input[@name="crsbrdint1-bp-payee-payeeDetail1"]');
  }

  // --- Wait Methods ---

  async waitForFormReady(timeout = TIMEOUT.LONG) {
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
    await expect(this.fromAccount).toBeEnabled({ timeout });
  }

  async waitForPreviewPage(timeout = TIMEOUT.LONG) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.submitButton).toBeVisible({ timeout });
  }

  async waitForSubmittedPage(timeout = TIMEOUT.LONG) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByText('Pending Approval').first()).toBeVisible({ timeout });
  }

  async waitForViewPage(timeout = TIMEOUT.LONG) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.crsBrdTransactionStatusValue).toBeVisible({ timeout });
  }

  // --- Helper Methods ---

  async selectAutoComplete(container: Locator, text: string) {
    await this.wc.selectAutoComplete(this.page, container, text);
  }

  async addINTLNewPayee(payeeName: string, payeeBankID: string, accountNumber: string) {
    await this.newPayeeTab.click();
    await this.page.waitForTimeout(TIMEOUT.MICROMIN);

    // Fill payee name
    await this.wc.enterTextarea(this.newPayeeName, payeeName);

    // Fill payee nickname (mandatory)
    await this.wc.enterTextarea(this.newPayeeNickname, payeeName);

    // Fill address line 1
    await this.wc.enterTextarea(this.newPayeeAddress1, payeeName);

    // Type bank ID via keyboard to trigger auto-search
    await this.swiftBICSelect.click();
    await this.swiftBICSelect.fill('');
    await this.page.keyboard.type(payeeBankID);
    await this.page.waitForTimeout(TIMEOUT.VERYMIN);

    // Click bank search result
    const bankResult = this.payeeBankResult.first();
    if (await bankResult.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
      await bankResult.click();
      await this.page.waitForTimeout(TIMEOUT.MICROMIN);
    }

    // Fill routing code and account number
    await this.wc.enterTextarea(this.payeeBankRouting, accountNumber);
    await this.wc.enterTextarea(this.newPayeeAcctNo, accountNumber);

    // Select payee category (mandatory for INTL payees)
    await this.payeeCategoryInput.click();
    await this.page.waitForTimeout(TIMEOUT.MICROMIN);
    // Type a space to trigger dropdown, then select first option
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(TIMEOUT.BRIEF);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(TIMEOUT.BRIEF);
  }

  async addExistingPayee(filterText: string) {

    // Existing Payee tab may already be active; click only if visible and not active
    const isTabVisible = await this.existingPayeeTab.isVisible({ timeout: 5000 }).catch(() => false);
    if (isTabVisible) {
      await this.existingPayeeTab.click();
      await this.page.waitForTimeout(TIMEOUT.MICROMIN);
    }
    // Type in filter
    const filterInput = this.page.getByPlaceholder('Filter by name, nickname, account number or reference');
    await filterInput.click();
    await filterInput.fill(filterText);
    await this.page.waitForTimeout(TIMEOUT.MODERATE);

    // Check if any Add button is visible after filtering
    const addBtnByName = this.page.locator('button:has-text("Add")');
    let hasResult = await addBtnByName.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (!hasResult) {
      // Filter returned no results — clear filter and select first available payee
      await filterInput.fill('');
      await this.page.waitForTimeout(TIMEOUT.MODERATE);
      hasResult = await addBtnByName.first().isVisible({ timeout: 5000 }).catch(() => false);
    }

    if (hasResult) {
      await addBtnByName.first().click();
      await this.waitForUXLoading();
    }
  }

  private async waitForUXLoading() {
    const spinnerSelectors = [
      '.ux-loading', '.loading', '.spinner',
      '.mat-progress-spinner', '.cdk-overlay-backdrop',
    ];
    for (const sel of spinnerSelectors) {
      const spinner = this.page.locator(sel).first();
      try {
        if (await spinner.isVisible({ timeout: 3000 }).catch(() => false)) {
          await spinner.waitFor({ state: 'hidden', timeout: TIMEOUT.EXTREME });
        }
      } catch { /* ignore */ }
    }
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
