import { Page, Locator, expect } from '@playwright/test';
import { WebComponents } from '../../../lib/webComponents';

export type NewPayeeInput = {
  name: string;
  bankId: string;
  accountNumber: string;
  DDAReferenceNo: string;
  MandateID: string,
};

export type NewPayeeResult = {
  accountNumber: string;
  name: string;
};

export type deleteOpenPayeeOrReferenceNo = {
  transactionDeleted: string;
  internalReference: string;
};

export type NewPayee1Data = {
  amountPayer2Tc002: string;
  amount: string;
  transactionCode: string;
  purposeOfPayment: string;
  particularsPayer1: string;
  particulars: string;
  collectionDetailsPayer1: string;
  collectionDetails: string;
  email1: string;
  email2: string;
  email3: string;
  email4: string;
  email5: string;
  emailMessage: string;
};

export type NewPayee1ValidationData = {
  fromAccountValue1: string;
  fromAccountValue2: string;
  paymentTypeValue: string;
  amountDeductedValue: string;
  amountDeductedEditedValue: string;
  creditType: string;

  referenceValueUserProvided: string;
  batchIdValueUserProvided: string;

  collectionSummaryLabel: string;
  totalPayeesLabel: string;
  totalPayeesValue: string;
  totalAmountLabel: string;
  totalAmountValue: string;
  totalAmountValueEdited: string;

  payeeNameLabelValue: string;
  payeeNicknameLabelValue: string;
  bankNameLabelValue: string;
  bankSwiftBicLabelValue: string;
  accountNumberLabelValue: string;
  DDAReference: string;
  statusLabelValue: string;
  amountLabelValue: string;
  amountEditedLabelValue: string,
  transactionLabelValue: string;
  purposeCodeLabelValue: string;
  particularsLabelValue: string;
  collectionDetailsLabelValue: string;
  emailMessageLabelValue: string
  email1LabelValue: string;
  email2LabelValue: string;
  email3LabelValue: string;
  email4LabelValue: string;
  email5LabelValue: string;
};

export type ExistingPayer1Input = {
  amount: string;
  transactionCode: string;
  particulars: string;
};

export type NewAndExistingPayerValidationData = {
  toAccountNumberLabel: string;
  toAccountNameLabel: string;
  paymentTypeValue: string;
  totalAmountConsolidated: string;
  creditTypeConsolidated: string;
  referenceValueUserProvided: string;
  batchIdValueUserProvided: string;
  collectionSummaryLabel: string;
  totalPayeesLabel: string;
  totalPayersConsolidatedLabelValue: string;
  totalAmountLabel: string;
  totalAmountConsolidatedLabelValue: string;
  totalAmountValueEdited: string;
  payeeNameLabelValue: string;
  payeeNicknameLabelValue: string;
  bankNameLabelValue: string;
  bankSwiftBicLabelValue: string;
  accountNumberLabelValue: string;
  DDAReference: string;
  mandateID: string;
  statusLabelValue: string;
  amountLabelValue: string;
  amountEditedLabelValue: string,
  transactionLabelValue: string;
  purposeCodeLabelValue: string;
  particularsLabelValue: string;
  collectionDetailsLabelValue: String;

  emailMessageLabelValue: string
  email1LabelValue: string;
  email2LabelValue: string;
  email3LabelValue: string;
  email4LabelValue: string;
  email5LabelValue: string;
  //Payer 2
  newPayeeName: string;
  newPayeeNickName: string;
  bankNameValue: string;
  bankCodePayer2Value: string;
  newPayeeAcctNumber: string;
  DDAReferencePayer2: string;
  mandateIDPayer2: string;
  bankCode: string;
  statusPayer2: string;
  amountPayer2: string;
  transactionCodePayer2: string;
  particularsPayer2: string;
};




export class BulkCollectionPage {

  private readonly page: Page;
  private readonly wc: WebComponents;

  constructor(page: Page, webComponents?: WebComponents) {
    this.page = page;
    this.wc = webComponents ?? new WebComponents();

    this.payTransferNav = page.locator('//span[contains(text()," Pay & Transfer ")]');
    this.bulkCollection = page.locator('//*[@id="icon__initiate_bulk_collection"]');
    this.fromAccount = page.locator('//p-auto-complete[@formcontrolname="fromAccount"]');
    this.creditType = page.locator('//p-auto-complete[@formcontrolname="debitType"]');
    this.creditTypeValueItemizedCredit = page.locator('//*[@id="options-type-bulk.labelItemizedCredit"]');
    this.creditTypeValueConsolidatedCredit = page.locator('//*[@id="options-type-bulk.labelConsolidatedCredit"]');
    this.filterExistingPayee = page.locator('//*[@name="payee-selector"]');
    this.addButton = page.locator('//*[@name="add"]');

    //New Payear Tab
    this.newPayerTab = page.locator('//*[@id="ux-tab-labelNewPayer"]');
    this.newPayeeName = page.locator('//*[@name="new-payee-payeeName"]');
    this.payerBankID = page.locator('//*[@id="bulk-newPayee-bankId"]');
    this.findBankIDButton = page.locator('xpath=//*[@id="new-payee-bank-id-button"]');
    this.payeeBankSearchResults = page.locator('xpath=//table[@class="swift-results ng-star-inserted"]');
    this.payerBankResult = page.locator('//*[@class="search-result-container"]');
    this.newPayerAccountNumber = page.locator('//*[@name="new-payee-accountNumber"]');
    this.DDARef = page.locator('//*[@name="new-payee-dda"]');
    this.mandateID = page.locator('//*[@name="new-payee-mandate-id"]');
    this.addPayer = page.locator('//button[@name="add-payee"]');

    this.amount = page.locator('//*[@name="payeeAmount"]');
    this.amount1stPosition = page.locator('(//*[@name="payeeAmount"])[1]');
    this.transactionCode = page.locator('//*[@formcontrolname="transactionCode"]');
    this.transactionCode1stPosition = page.locator('(//*[@formcontrolname="transactionCode"])[1]');

    this.transactionCode92Direct = page.locator('//div[@id="select-item-92 - Direct Debit(Merchant Payment)"]');
    this.transactionCode30Direct = page.locator('//div[@id="select-item-30 - Direct Debit"]');
    this.transactionCode98DirectDebit = page.locator('//div[@id="select-item-98 - Direct Debit(Merchant Payment - Consolidated posting)"]');
    this.transactionCode38DirecDebit = page.locator('//div[@id="select-item-38 - Direct Debit(Consolidated posting)"]');
    this.purposeOfPayment = page.locator('//*[@formcontrolname="payeePurposeCode"]');
    this.purposeOfPaymentMerchantInitiatedBills = page.locator('//span[text()="Merchant Initiated Bills Payment"]');
    this.purposeOfPaymentOtherMerchantPayment = page.locator('//span[text()="Other Merchant Payment"]');

    this.particular = page.locator('//*[@name="payeeParticulars"]');
    this.particular1stPosition = page.locator('(//*[@name="payeeParticulars"])[1]');
    this.showOptionDetailPayee1 = page.locator('//div[@id="temp-bulk-create-optDetail_0"]');
    this.collectionDetailsPayer1 = page.locator('(//textarea[@name="payeeDetails"])[1]');
    this.collectionDetails = page.locator('//textarea[@name="payeeDetails"]');
    this.messageToPayer = page.locator('//span[text()="5 notifications "]');
    this.msgToPayer = page.locator('//span[text()="5 notifications "]');
    this.msgToPayer1 = page.locator('(//span[text()="5 notifications "])[1]');
    this.emailId0 = page.locator('//*[@name="email-0"]');
    this.emailId1 = page.locator('//*[@name="email-1"]');
    this.emailId2 = page.locator('//*[@name="email-2"]');
    this.emailId3 = page.locator('//*[@name="email-3"]');
    this.emailId4 = page.locator('//*[@name="email-4"]');
    this.emailMessage = page.locator('//textarea[@name="adviceContent"]');
    this.earliestAvailableDateCheckbox = page.locator('xpath=//span[text()="Earliest Available Date "]');

    this.nextButton = page.locator('//button[@name="next"]');
    this.submitButton = page.locator('//button[@name="submit"]');
    this.finishButton = page.locator('//button[@name="finish"]');
    this.referenceID = page.locator('//label[contains(text(),"Bulk Collection")]');


    this.hashValue = page.locator('//*[@id="bulk-view-hashValue"]');
    this.toAccountNumberLabel = page.locator('//span[@id="bulk-view-accountNum"]');
    this.toAccountNameLabel = page.locator('//span[@id="bulk-view-accountName"]');
    this.paymentTypeValue = page.locator('//*[@id="bulk-view-paymentType"]');
    this.totalAmountValue = page.locator('//*[@id="bulk-view-paymentAmount"]');
    this.viewCreditValue = page.locator('//*[@id="bulk-view-debitType-template"]');
    this.paymentDate = page.locator('//*[@id="bulk-view-paymentDate"]');

    this.referenceValue = page.locator('//*[@id="viewReference"]');
    this.batchIDValue = page.locator('//*[@id="bulk-view-batchId"]');
    this.viewPayrollFilter = page.locator('xpath=//*[@id="bulk-view-filter"]');

    this.collectionSummaryLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[1]');
    this.totalPayeesLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[2]');
    this.totalPayeesValue = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[3]');
    this.totalAmountLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[4]');
    this.totalAmountUSDValue = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[5]');


    this.payerNameValue = page.locator('//*[@id="bulk-view-name_0"]');
    this.payer2NameValue = page.locator('//*[@id="bulk-view-name_1"]');

    this.payerNickNameValue = page.locator('//*[@id="bulk-view-nickName_0"]');
    this.payer2NickNameValue = page.locator('//*[@id="bulk-view-nickName_1"]');

    this.bankNameValue = page.locator('//*[@id="bulk-view-payeeBankName_0"]');

    this.payerBankName = page.locator('//*[@id="bulk-view-payeeBankName_0"]');
    this.bankNameValue = page.locator('//*[@id="bulk-view-payeeBankName_0"]');
    this.bankNamePayer2Value = page.locator('//*[@id="bulk-view-payeeBankName_1"]');

    this.bankCodeValue = page.locator('//*[@id="bulk-view-bankDetailsMsgDisplay_0"]');
    this.bankCodePayer2Value = page.locator('//*[@id="bulk-view-bankDetailsMsgDisplay_1"]');

    this.accountNumberValue = page.locator('//strong[@id="bulk-view-acctNum_0"]');
    this.accountNumberPayer2Value = page.locator('//strong[@id="bulk-view-acctNum_1"]');

    this.DDAReferenceValue = page.locator('//*[@id="bulk-view-ddaRef_0"]');
    this.DDAReferencePayer2Value = page.locator('//*[@id="bulk-view-ddaRef_1"]');

    this.mandateIdValue = page.locator('//*[@id="bulk-view-mandateId_0"]');
    this.mandateIdPayer2Value = page.locator('//*[@id="bulk-view-mandateId_1"]');

    this.status = page.locator('xpath=//*[@id="bulk-view-pendingStatus_0"]');
    this.statusPayer2 = page.locator('xpath=//*[@id="bulk-view-pendingStatus_1"]');

    this.transactionStatusValue = page.locator('//strong[@id="bulk-view-pendingStatus_0"]');

    this.amountValue = page.locator('//strong[@id="bulk-view-amount_0"]');
    this.amountPayer2Value = page.locator('//strong[@id="bulk-view-amount_1"]');

    this.transactionCodeView = page.locator('//dbs-view-transfer-list[1]//*[@id="transaction-code-label"]');
    this.transactionCodePayer2View = page.locator('//dbs-view-transfer-list[2]//*[@id="transaction-code-label"]');

    this.purposeOfPaymentValue = page.locator('//dbs-view-transfer-list[1]//*[@id="payee-purpose-code-label"]');

    this.particularsValue = page.locator('//*[@id="bulk-view-particular_0"]');
    this.particularsPayer2Value = page.locator('//*[@id="bulk-view-particular_1"]');

    this.showOptionDetails = page.locator('(//span[text()="Show optional details"])[2]');
    this.collectionDetailValue = page.locator('//*[@id="bulk-view-paymentDetails_0"]');
    this.emailList = page.locator('//div[@id="bulk-view-email_0"]');

    this.emailmessageValue = page.locator('//*[@id="bulk-view-message_0"]');
    this.emailId0Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[1]');
    this.emailId1Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[2]');
    this.emailId2Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[3]');
    this.emailId3Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[4]');
    this.emailId4Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[5]');

    this.activityLogSection = page.locator('xpath=//*[@class="payment-history"]');
    this.approvalDetails = page.locator('xpath=//*[@class="approval-details"]');

    this.deleteButonPayroll = page.locator('xpath=//button[@name="delete"]');
    this.deleteButonConfirmDeletePopup = page.locator('xpath=//button[@id="dialogDelete"]');
    this.transactionDeletedPopupLabel = page.locator('xpath=//h2[text()="Transaction deleted"]');
    this.transactionDeletedPopupLabelMsg = page.locator('xpath=//p[@id="dialogMessage"]/span');

    //Payee / Beneficiary details in view payment page (some fields are shared with template view, so defined here)
    this.beneficiaryTab = page.locator('xpath=//span[normalize-space()="Payee / Beneficiaries"]');
    this.beneficiaryFilter = page.locator('xpath=//input[@id="approve-filter"]');
    this.beneficiaryDelButton = page.locator('xpath=//button[@name="payee-delete"]');
    this.beneficiaryDelCnfButton = page.locator('xpath=//button[@id="dialogDelete"]');
    this.beneficiaryDelDismissButton = page.locator('xpath=//button[@name="cancel"]');

    // IN Bulk Collection
    this.ucicCode = page.locator('xpath=//input[@name="ucicCode"]');
    this.ucicCodeValue = page.locator('xpath=//*[@id="bulk-view-ucicCode"]');
    this.payeeRef = page.locator('xpath=//*[@name="payeeRef"]');
    this.message = page.locator('xpath=//textarea[@name="adviceContent"]');
    this.editButton = page.locator('xpath=//*[@id="bulk-view-edit"]');
    this.showOptionView = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_0"]');
    this.balanceValue = page.locator('xpath=//*[@id="bulk-view-acctBalance"]');
    this.colTotalPayee = page.locator('xpath=//*[@id="view-bulk-totalItem"]');
    this.colTotalAmount = page.locator('xpath=//*[@id="view-bulk-totalAmount"]');
    this.refForPayeeValue = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="reference-for-payee"]');


  }

  //Locators
  readonly payTransferNav: Locator;
  readonly bulkCollection: Locator;
  readonly fromAccount: Locator;
  readonly creditType: Locator;
  readonly creditTypeValueItemizedCredit: Locator;
  readonly creditTypeValueConsolidatedCredit: Locator;
  readonly filterExistingPayee: Locator;
  readonly addButton: Locator;

  readonly newPayerTab: Locator;
  readonly newPayeeName: Locator;
  readonly payerBankID: Locator;
  readonly findBankIDButton: Locator;
  readonly payeeBankSearchResults: Locator;
  readonly payerBankResult: Locator;
  readonly newPayerAccountNumber: Locator;
  readonly DDARef: Locator;
  readonly mandateID: Locator;
  readonly addPayer: Locator;

  readonly amount: Locator;
  readonly amount1stPosition: Locator;
  readonly transactionCode: Locator;
  readonly transactionCode1stPosition: Locator;
  readonly transactionCode92Direct: Locator;
  readonly transactionCode30Direct: Locator;
  readonly transactionCode98DirectDebit: Locator;
  readonly transactionCode38DirecDebit: Locator;
  readonly purposeOfPayment: Locator;
  readonly purposeOfPaymentMerchantInitiatedBills: Locator;
  readonly purposeOfPaymentOtherMerchantPayment: Locator;
  readonly particular: Locator;
  readonly particular1stPosition: Locator;
  readonly showOptionDetailPayee1: Locator;
  readonly collectionDetails: Locator;
  readonly collectionDetailsPayer1: Locator;
  readonly messageToPayer: Locator;
  readonly msgToPayer: Locator;
  readonly msgToPayer1: Locator;
  readonly emailId0: Locator;
  readonly emailId1: Locator;
  readonly emailId2: Locator;
  readonly emailId3: Locator;
  readonly emailId4: Locator;
  readonly emailMessage: Locator;
  readonly earliestAvailableDateCheckbox: Locator;

  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly finishButton: Locator;
  readonly referenceID: Locator;

  //Bulk Collection - validation locators
  readonly hashValue: Locator;
  readonly toAccountNumberLabel: Locator;
  readonly toAccountNameLabel: Locator;
  readonly paymentTypeValue: Locator;
  readonly totalAmountValue: Locator;
  readonly viewCreditValue: Locator;
  readonly paymentDate: Locator;

  readonly referenceValue: Locator;
  readonly batchIDValue: Locator;
  readonly viewPayrollFilter: Locator;

  readonly collectionSummaryLabel: Locator;
  readonly totalPayeesLabel: Locator;
  readonly totalPayeesValue: Locator;
  readonly totalAmountLabel: Locator;
  readonly totalAmountUSDValue: Locator;

  readonly payerNameValue: Locator;
  readonly payer2NameValue: Locator;

  readonly payerNickNameValue: Locator;
  readonly payer2NickNameValue: Locator;

  readonly payerBankName: Locator;
  readonly bankNameValue: Locator;
  readonly bankNamePayer2Value: Locator;

  readonly bankCodeValue: Locator;
  readonly bankCodePayer2Value: Locator;

  readonly accountNumberValue: Locator;
  readonly accountNumberPayer2Value: Locator;

  readonly DDAReferenceValue: Locator;
  readonly DDAReferencePayer2Value: Locator;

  readonly status: Locator;
  readonly statusPayer2: Locator;

  readonly mandateIdValue: Locator;
  readonly mandateIdPayer2Value: Locator;

  readonly transactionStatusValue: Locator;

  readonly amountValue: Locator;
  readonly amountPayer2Value: Locator;

  readonly transactionCodeView: Locator;
  readonly transactionCodePayer2View: Locator;

  readonly purposeOfPaymentValue: Locator;

  readonly particularsValue: Locator;
  readonly particularsPayer2Value: Locator;

  readonly showOptionDetails: Locator;
  readonly collectionDetailValue: Locator;
  readonly emailList: Locator;

  readonly emailmessageValue: Locator;
  readonly emailId0Value: Locator;
  readonly emailId1Value: Locator;
  readonly emailId2Value: Locator;
  readonly emailId3Value: Locator;
  readonly emailId4Value: Locator;
  readonly activityLogSection: Locator;
  readonly approvalDetails: Locator;

  readonly deleteButonPayroll: Locator;
  readonly deleteButonConfirmDeletePopup: Locator;
  readonly transactionDeletedPopupLabel: Locator;
  readonly transactionDeletedPopupLabelMsg: Locator;

  //Payee / Beneficiary details in view payment page (some fields are shared with template view, so defined here)
  readonly beneficiaryTab: Locator;
  readonly beneficiaryFilter: Locator;
  readonly beneficiaryDelButton: Locator;
  readonly beneficiaryDelCnfButton: Locator;
  readonly beneficiaryDelDismissButton: Locator;

  // IN Bulk Collection
  readonly ucicCode: Locator;
  readonly ucicCodeValue: Locator;
  readonly payeeRef: Locator;
  readonly message: Locator;
  readonly editButton: Locator;
  readonly showOptionView: Locator;
  readonly balanceValue: Locator;
  readonly colTotalPayee: Locator;
  readonly colTotalAmount: Locator;
  readonly refForPayeeValue: Locator;

  // create lib => components.ts object
  webComponents = new WebComponents();

  /**
     * Author: LC5764724 / Chetan Chavan
     * Created Date: 23/02/26
     * Description: Add new payee flow (reusable utility for VN).
     */
  async addNewPayee(input: NewPayeeInput): Promise<NewPayeeResult> {
    const { name, DDAReferenceNo, bankId, accountNumber } = input;

    await this.newPayerTab.click();
    await this.safeClick(this.newPayeeName);
    await this.safeFill(this.newPayeeName, name);
    await this.page.keyboard.press('Tab');
    await this.newPayeeName.blur();
    await this.payerBankID.click();
    await this.payerBankID.fill(bankId);
    await this.page.keyboard.press('Enter');
    await this.payerBankID.blur();
    await this.safeClick(this.findBankIDButton);
    await expect(this.payeeBankSearchResults.first()).toBeVisible({ timeout: 15000 });
    await this.payeeBankSearchResults.first().click();
    await this.safeClick(this.newPayerAccountNumber);

    // Preserve your clipboard -> paste behavior
    await this.page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, accountNumber);

    await this.page.keyboard.press('Control+V');
    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Tab');
    await this.newPayerAccountNumber.blur();
    await this.DDARef.click();
    await this.DDARef.fill(DDAReferenceNo);
    await this.page.keyboard.press('Enter');
    await this.DDARef.blur();
    await this.safeClick(this.addPayer);
    return { name, accountNumber };
  }

  /** Delete Payee fnction */
  async openBeneficiariesTabIfPresent(): Promise<boolean> {
    const count = await this.beneficiaryTab.count();
    if (count === 0) return false;
    await this.safeClick(this.beneficiaryTab);
    return true;
  }

  async filterBeneficiaries(query: string) {
    await this.safeFill(this.beneficiaryFilter, '');
    await this.safeFill(this.beneficiaryFilter, query);
    await this.beneficiaryFilter.press('Enter'); // try enter
    await this.beneficiaryFilter.blur();         // and blur, in case enter isn't enough
    // Small debounce for filter to apply
    await this.page.waitForTimeout(500);
  }

  async deletePayeeGlobal(confirm = true) {

    await this.safeClick(this.beneficiaryDelButton);
    if (confirm) {
      await expect(this.beneficiaryDelCnfButton).toBeVisible({ timeout: 10000 });
      await this.beneficiaryDelCnfButton.click();
    } else {
      await expect(this.beneficiaryDelDismissButton).toBeVisible({ timeout: 10000 });
      await this.beneficiaryDelDismissButton.click();
    }
    await this.page.waitForTimeout(800);
  }

  beneficiaryRowsByText(text: string): Locator {
    // Scope to the datatable body rows to avoid picking elements from the right pane
    return this.page
      .locator('.payee-transaction-list ngx-datatable datatable-body datatable-row-wrapper datatable-body-row')
      .filter({ hasText: text });
  }

  async deletePayeeInRow(textKey: string, confirm = true) {
    const row = this.beneficiaryRowsByText(textKey).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    const rowDeleteButton = row.locator('xpath=.//button[@name="payee-delete"]');
    await this.safeClick(rowDeleteButton);

    if (confirm) {
      await expect(this.beneficiaryDelCnfButton).toBeVisible({ timeout: 10000 });
      await this.beneficiaryDelCnfButton.click();
      // Wait until the row disappears to confirm deletion
      await expect(row).toHaveCount(0, { timeout: 15000 });
    } else {
      await expect(this.beneficiaryDelDismissButton).toBeVisible({ timeout: 10000 });
      await this.beneficiaryDelDismissButton.click();
      await expect(row).toBeVisible(); // still there
    }
  }

  async deletePayeeByFilter(textKey?: string, confirm = true) {
    const opened = await this.openBeneficiariesTabIfPresent();
    if (!opened) {
      console.warn('[cleanup] Beneficiaries tab not present on this page; skipping delete.');
      return;
    }

    if (textKey && textKey.trim()) {
      await this.filterBeneficiaries(textKey);
      await this.deletePayeeInRow(textKey, confirm);
    } else {
      // When you can’t filter by a unique string, we use the global delete button.
      await this.deletePayeeGlobal(confirm);
    }
  }
  // create lib => components.ts object
  //webComponents = new WebComponents();



  /**
 * Author : LC5741501
 * Created Date: 17/02/2026
 * This Method "addNewPayeeWithDetails" : Add's a new payee with all details (reusable in all tests).
 */
  async addNewPayerWithAllDetails(input: NewPayeeInput): Promise<NewPayeeResult> {
    const { name, bankId, accountNumber, DDAReferenceNo, MandateID } = input;

    // Click : New Payee Tab
    await this.newPayerTab.click();

    // Enter : Payee Name
    await this.webComponents.enterTextarea(this.newPayeeName, name);
    await this.page.keyboard.press('Tab');
    await this.newPayeeName.blur();

    // Enter : Payee bank ID
    await this.webComponents.enterTextarea(this.payerBankID, bankId);
    await this.page.keyboard.press('Enter');
    await this.payerBankID.blur();

    await this.webComponents.clickWhenVisibleAndEnabled(this.findBankIDButton);
    await expect(this.payeeBankSearchResults.first()).toBeVisible({ timeout: 15000 });
    await this.payeeBankSearchResults.first().click();

    // Click : Payee bank account number
    await this.webComponents.waitElementToBeVisible(this.newPayerAccountNumber);
    await this.webComponents.enterTextarea(this.newPayerAccountNumber, accountNumber);

    // Enter : DDA reference number
    await this.webComponents.enterTextarea(this.DDARef, DDAReferenceNo);

    // Enter : DDA reference number
    await this.webComponents.enterTextarea(this.mandateID, MandateID);

    //Click : Add Payee button
    await this.webComponents.clickWhenVisibleAndEnabled(this.addPayer);
    return { name, accountNumber };
  }

  /**
   * Author : LC5741501
   * Created Date: 20/02/2026
   * @param testData : is a Json object
   * This method Enters Step 2: Payment to Amount and other opetional fields 
   */
  async enterNewPayeeAllOtherDetails(input: NewPayee1Data) {
    const { amountPayer2Tc002, amount, transactionCode, purposeOfPayment, particularsPayer1, particulars, collectionDetailsPayer1, collectionDetails, email1, email2, email3,
      email4, email5, emailMessage } = input;

    // Step 2: Enter Amount (SGD) = add Amount
    if (await this.webComponents.stringIsNotNullOrBlank(amountPayer2Tc002)) {
      await this.webComponents.enterTextarea(this.amount1stPosition, amount);
    } else {
      await this.webComponents.enterTextarea(this.amount, amount);
    }

    // Step 2: Transaction code(If not Null/Blank)
    const trueCheck: boolean = await this.webComponents.stringIsNotNullOrBlank(transactionCode);
    console.log("TransactionCode Is : " + trueCheck);
    // If true
    if (trueCheck) {

      switch (transactionCode) {
        case '30DirectDebit':
          // Click Transaction Code Dropdown and select "22SalaryCredit"
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode);
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode30Direct);
          break;

        case '92DirectDebitMerchantPayment':
          // Click Transaction Code Dropdown and select "22SalaryCredit"
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode);
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode92Direct);
          break;

        case '98 - Direct Debit(Merchant Payment - Consolidated posting)':
          // Click Transaction Code Dropdown and select "22SalaryCredit"
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode1stPosition);
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode98DirectDebit);
          break;

        default:
      }

    }

    // Step 2: If true(value present): Enter Purpose of Payment
    if (await this.webComponents.stringIsNotNullOrBlank(purposeOfPayment)) {
      // Step 2: Select: Purpose of Payment

      switch (purposeOfPayment) {
        case 'Merchant Initiated Bills Payment':
          // Click Purpose of Payment Dropdown and select "Merchant Initiated Bills Payment"
          await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPayment);
          await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPaymentMerchantInitiatedBills);
          break;

        case 'Other Merchant Payment':
          // Click Payment Dropdown Dropdown and select "Other Merchant Payment"
          await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPayment);
          await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPaymentOtherMerchantPayment);
          break;

        default:
      }
    }

    // Step 2: If true(value present): Enter Particulars
    if (await this.webComponents.stringIsNotNullOrBlank(particularsPayer1)) {
      await this.webComponents.enterTextarea(this.particular1stPosition, particulars);
    } else {
      await this.webComponents.enterTextarea(this.particular, particulars);
    }

    // Click Show optional details arrow
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetailPayee1);

    // Enter Collection details to the payer bank
    if (await this.webComponents.stringIsNotNullOrBlank(collectionDetailsPayer1)) {
      await this.webComponents.enterTextarea(this.collectionDetailsPayer1, collectionDetails);
    } else {
      await this.webComponents.enterTextarea(this.collectionDetails, collectionDetails);
    }

    // Click : "Message to the payee" checkbox
    if (await this.webComponents.stringIsNotNullOrBlank(collectionDetailsPayer1)) {
      await this.webComponents.clickWhenVisibleAndEnabled(this.msgToPayer1);
    } else {
      await this.webComponents.clickWhenVisibleAndEnabled(this.msgToPayer);
    }

    // Enter : Emails 1
    await this.webComponents.enterTextarea(this.emailId0, email1);
    // Enter : Emails 2
    await this.webComponents.enterTextarea(this.emailId1, email2);
    // Enter : Emails 3
    await this.webComponents.enterTextarea(this.emailId2, email3);
    // Enter : Emails 4
    await this.webComponents.enterTextarea(this.emailId3, email4);
    // Enter : Emails 5
    await this.webComponents.enterTextarea(this.emailId4, email5);

    // Enter : Emails Mesage (Textarea)
    await this.webComponents.enterTextarea(this.emailMessage, emailMessage);

  }


  /**
  * Author : LC5741501
  * Created Date: 20/02/2026
  * @param testData : is a Json object
  * This method Enters Step 2: Amount and other opetional fields 
  */
  async enterNewPayerAmountOptionalDetailsWhenExistingPayerAdded(testData) {

    // Step 2: Enter Amount (SGD) = add Amount
    await this.webComponents.enterTextarea(this.amount1stPosition, testData.payer1.amount);

    // Step 2: Select: Transaction code
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode1stPosition);
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode98DirectDebit);

    // Step 2: Select: Purpose of Payment
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPayment);
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPaymentMerchantInitiatedBills);

    // Enter: Particulars(Optional)
    await this.webComponents.enterTextarea(this.particular1stPosition, testData.payer1.particulars);

    // Click Show optional details arrow
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetailPayee1);

    // Enter: Collection details to the payer bank(Optional)
    await this.webComponents.enterTextarea(this.collectionDetailsPayer1, testData.payer1.collectionDetails);

    // Click : "Message to the payer" checkbox
    await this.webComponents.clickWhenVisibleAndEnabled(this.msgToPayer1);

    // Enter : Emails 1
    await this.webComponents.enterTextarea(this.emailId0, testData.payer1.emailId0);
    // Enter : Emails 2
    await this.webComponents.enterTextarea(this.emailId1, testData.payer1.emailId1);
    // Enter : Emails 3
    await this.webComponents.enterTextarea(this.emailId2, testData.payer1.emailId2);
    // Enter : Emails 4
    await this.webComponents.enterTextarea(this.emailId3, testData.payer1.emailId3);
    // Enter : Emails 5
    await this.webComponents.enterTextarea(this.emailId4, testData.payer1.emailId4);

    // Enter : Emails Mesage (Textarea)
    await this.webComponents.enterTextarea(this.emailMessage, testData.payer1.emailMessage);

  }


  /**
   * Author : LC5741501
   * Created Date: 20/02/2026
   * @param testData : is a Json object
   * This method Enters Step 2: Amount and other opetional fields 
   */
  async enterExtistingPayerAmountTransactionCodeAndParticulars(input: ExistingPayer1Input) {
    const { amount, transactionCode, particulars } = input;

    // Step 2: Enter Amount (SGD) = add Amount
    await this.webComponents.enterTextarea(this.amount, amount);

    // Step 2: Transaction code(If not Null/Blank)
    const trueCheck: boolean = await this.webComponents.stringIsNotNullOrBlank(transactionCode);
    console.log("TransactionCode Is : " + trueCheck);
    // If true
    if (trueCheck) {
      switch (transactionCode) {
        case '38 - Direct Debit(Consolidated posting)':
          // Click Transaction Code Dropdown and select "22SalaryCredit"
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode);
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode98DirectDebit);

          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode);
          await this.webComponents.waitElementToBeVisible(this.transactionCode38DirecDebit);
          await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode38DirecDebit);
          break;

        default:
      }
    }

    // Enter: Particulars(Optional)
    await this.webComponents.enterTextarea(this.particular, particulars);

  }

  /**
   * Author : LC5741501
   * This method validates the details of Expected
   * values(JSON) Vs Actual Selected Payee Or Reference No (from UI) 
   */
  async validatePayeeOrRefrenceNoDetails(input: NewPayee1ValidationData, reference) {
    const { fromAccountValue1, fromAccountValue2, paymentTypeValue, amountDeductedValue, amountDeductedEditedValue,
      creditType, referenceValueUserProvided, batchIdValueUserProvided, collectionSummaryLabel, totalPayeesLabel,
      totalPayeesValue, totalAmountLabel, totalAmountValue, totalAmountValueEdited, payeeNameLabelValue,
      payeeNicknameLabelValue, bankNameLabelValue, bankSwiftBicLabelValue, accountNumberLabelValue, DDAReference,
      statusLabelValue, amountLabelValue, amountEditedLabelValue, transactionLabelValue, purposeCodeLabelValue,
      particularsLabelValue, collectionDetailsLabelValue, emailMessageLabelValue, email1LabelValue, email2LabelValue,
      email3LabelValue, email4LabelValue, email5LabelValue } = input;
    // Assertions
    // 1) Hash value : Auto generated hence checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.hashValue);

    // 2) From : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.toAccountNumberLabel, fromAccountValue1);
    await this.webComponents.compareUIVsJsonValue(this.toAccountNameLabel, fromAccountValue2);

    // 3) Payment Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.paymentTypeValue, paymentTypeValue);

    // 4) Account deducted : If amountDeductedEditedValue is Not Null/Blank, it means Amount is editd, and validate edited value
    //Else not edited, then validate actual amount
    if (await this.webComponents.stringIsNotNullOrBlank(amountDeductedEditedValue)) {
      await this.webComponents.compareUIVsJsonValue(this.totalAmountValue, amountDeductedEditedValue);
    } else {
      await this.webComponents.compareUIVsJsonValue(this.totalAmountValue, amountDeductedValue);
    }

    // 5) Credit Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.viewCreditValue, creditType);

    // 6) Payment Date: checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.paymentDate);

    // 7) Internal reference : If referenceValueUserProvided is Not Null/Blank, it means value present, validate User provided value
    //Else value not present, then autogenerated reference No
    if (await this.webComponents.stringIsNotNullOrBlank(referenceValueUserProvided)) {
      await this.webComponents.compareUIVsJsonValue(this.referenceValue, referenceValueUserProvided);
    } else {
      await this.webComponents.compareUIVsJsonValue(this.referenceValue, reference);
    }

    // 8) Batch ID : If batchIdValueUserProvided is Not Null/Blank, it means user provided the value and validate it
    // Else validete auto generated Batch Id value is not null
    if (await this.webComponents.stringIsNotNullOrBlank(batchIdValueUserProvided)) {
      await this.webComponents.compareUIVsJsonValue(this.batchIDValue, batchIdValueUserProvided);
    } else {
      await this.webComponents.verifyUIElementTextIsNotNull(this.batchIDValue);
    }

    // 9) Filter is Visible 
    await this.webComponents.waitElementToBeVisible(this.viewPayrollFilter);

    // 10) Payment summary : Validate UI Vs Json (Collection summary Label) Additional Validation
    await this.webComponents.compareUIVsJsonValue(this.collectionSummaryLabel, collectionSummaryLabel);

    // 11) Total Payees Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesLabel, totalPayeesLabel);

    // 12) Total Payees Value : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesValue, totalPayeesValue);

    // 13) Total Amount Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountLabel, totalAmountLabel);

    // 14) Total Amount Value : If totalAmountValueEdited is Not Null/Blank, it means its edited and validate it
    // Else validete the without edited value
    if (await this.webComponents.stringIsNotNullOrBlank(totalAmountValueEdited)) {
      await this.webComponents.compareUIVsJsonValue(this.totalAmountUSDValue, totalAmountValueEdited);
    } else {
      await this.webComponents.compareUIVsJsonValue(this.totalAmountUSDValue, totalAmountValue);
    }
    // 15) Payee/Nickname : Validate (Payee Name) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNameValue, payeeNameLabelValue);

    // 16) Payee/Nickname : Validate (Nickname) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNickNameValue, payeeNicknameLabelValue);

    // 17) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankNameValue, bankNameLabelValue);

    // 18) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankCodeValue, bankSwiftBicLabelValue);

    // 19) Account number: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.accountNumberValue, accountNumberLabelValue);

    // 20) Account number DDA reference: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.DDAReferenceValue, DDAReference);

    // 21) Status (PendingApproval) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.status, statusLabelValue);

    // 22) Amount (SGD): Validate UI Vs Json
    // If amountEditedLabelValue : is edited validate the edited value
    // else validate the no edited value of amount
    if (await this.webComponents.stringIsNotNullOrBlank(amountEditedLabelValue)) {
      await this.webComponents.compareUIVsJsonValue(this.amountValue, amountEditedLabelValue);
    } else {
      await this.webComponents.compareUIVsJsonValue(this.amountValue, amountLabelValue);
    }

    // 23) If Purpose Code: Value is not null/Blank validate the value provided UI Vs Json
    if (await this.webComponents.stringIsNotNullOrBlank(purposeCodeLabelValue)) {
      await this.webComponents.compareUIVsJsonValue(this.purposeOfPaymentValue, purposeCodeLabelValue);
    }

    // 24) If Transaction Code: Value is not null/Blank validate the value provided UI Vs Json
    if (await this.webComponents.stringIsNotNullOrBlank(transactionLabelValue)) {
      await this.webComponents.compareUIVsJsonValue(this.transactionCodeView, transactionLabelValue);
    }

    //25) If particulars: Value is not null/Blank validate the value provided UI Vs Json
    if (await this.webComponents.stringIsNotNullOrBlank(particularsLabelValue)) {
      await this.webComponents.compareUIVsJsonValue(this.particularsValue, particularsLabelValue);
    }

    // Click : showOptionalViewButton1
    await this.webComponents.javaScriptsClick(this.showOptionDetails);

    //26) If Payment details: Value is not null/Blank validate the value provided UI Vs Json
    if (await this.webComponents.stringIsNotNullOrBlank(collectionDetailsLabelValue)) {
      await this.webComponents.compareUIVsJsonValue(this.collectionDetailValue, collectionDetailsLabelValue);
    }

    // 27) Message to payee (optional): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.emailmessageValue, emailMessageLabelValue);

    // 28)Emails 1 to 5 : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.emailId0Value, email1LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId1Value, email2LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId2Value, email3LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId3Value, email4LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId4Value, email5LabelValue);

    // 29) Next approver : Visible
    await this.webComponents.waitElementToBeVisible(this.approvalDetails);

    // 30) Next approver : value is not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.activityLogSection);

  }


  /**
     * Author : LC5741501
     * This method validates the 2nd Payer details: Expected
     * values(JSON) Vs Actual Selected Payers Or Reference No (from UI) 
     */
  async validatePayer2ConsolidateValueInBulkCollection(input: NewAndExistingPayerValidationData, reference) {
    const { toAccountNumberLabel, toAccountNameLabel, paymentTypeValue, totalAmountConsolidated, creditTypeConsolidated,
      referenceValueUserProvided, batchIdValueUserProvided, collectionSummaryLabel, totalPayeesLabel,
      totalPayersConsolidatedLabelValue, totalAmountLabel, totalAmountConsolidatedLabelValue, totalAmountValueEdited,
      payeeNameLabelValue, payeeNicknameLabelValue, bankNameLabelValue, bankSwiftBicLabelValue, accountNumberLabelValue,
      DDAReference, mandateID, statusLabelValue, amountLabelValue, amountEditedLabelValue, transactionLabelValue,
      purposeCodeLabelValue, particularsLabelValue, collectionDetailsLabelValue, emailMessageLabelValue,
      email1LabelValue, email2LabelValue, email3LabelValue, email4LabelValue, email5LabelValue, newPayeeName,
      newPayeeNickName, bankNameValue, bankCodePayer2Value, newPayeeAcctNumber, DDAReferencePayer2, mandateIDPayer2,
      bankCode, statusPayer2, amountPayer2, transactionCodePayer2, particularsPayer2 } = input;

    // Assertions
    // 1) Hash value : Auto generated hence checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.hashValue);

    // 2) To : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.toAccountNumberLabel, toAccountNumberLabel);
    await this.webComponents.compareUIVsJsonValue(this.toAccountNameLabel, toAccountNameLabel);

    // 3) Payment Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.paymentTypeValue, paymentTypeValue);

    // 4) Total amount : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountValue, totalAmountConsolidated);

    // 5) Credit Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.viewCreditValue, creditTypeConsolidated);

    //6) Payment Date: checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.paymentDate);

    // 7) Internal reference : If referenceValueUserProvided is Not Null/Blank, it means value present, validate User provided value
    //Else value not present, then autogenerated reference No
    if (await this.webComponents.stringIsNotNullOrBlank(referenceValueUserProvided)) {
      await this.webComponents.compareUIVsJsonValue(this.referenceValue, referenceValueUserProvided);
    } else {
      await this.webComponents.compareUIVsJsonValue(this.referenceValue, reference);
    }

    // 8) Batch ID : If batchIdValueUserProvided is Not Null/Blank, it means user provided the value and validate it
    // Else validete auto generated Batch Id value is not null
    if (await this.webComponents.stringIsNotNullOrBlank(batchIdValueUserProvided)) {
      await this.webComponents.compareUIVsJsonValue(this.batchIDValue, batchIdValueUserProvided);
    } else {
      await this.webComponents.verifyUIElementTextIsNotNull(this.batchIDValue);
    }

    // 9) Filter is Visible 
    await this.webComponents.waitElementToBeVisible(this.viewPayrollFilter);

    // Below validation from 10 to 14 is a additional validation
    // 10) Collection summary : Validate UI Vs Json (Payment summary Label)
    await this.webComponents.compareUIVsJsonValue(this.collectionSummaryLabel, collectionSummaryLabel);

    // 11) Total Payees Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesLabel, totalPayeesLabel);

    // 12) Total Payees Value : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesValue, totalPayersConsolidatedLabelValue);

    // 13) Total Amount Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountLabel, totalAmountLabel);

    // 14) Total Amount Value : Validate UI Vs Json
    //await this.webComponents.compareUIVsJsonValue(this.totalAmountUSDValue, testData.BulkCollectionValidationData.totalAmountConsolidatedLabelValue);

    // 14) Total Amount Value : If totalAmountValueEdited is Not Null/Blank, it means its edited and validate it
    // Else validete the without edited value
    if (await this.webComponents.stringIsNotNullOrBlank(totalAmountValueEdited)) {
      await this.webComponents.compareUIVsJsonValue(this.totalAmountUSDValue, totalAmountValueEdited);
    } else {
      await this.webComponents.compareUIVsJsonValue(this.totalAmountUSDValue, totalAmountConsolidatedLabelValue);
    }

    // Payer1 Validation

    // 15) Payee/Nickname : Validate (Payee Name) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNameValue, payeeNameLabelValue);

    // 16) Payee/Nickname : Validate (Nickname) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNickNameValue, payeeNicknameLabelValue);

    // 17) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankNameValue, bankNameLabelValue);

    // 18) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankCodeValue, bankSwiftBicLabelValue);

    // 19) Account number: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.accountNumberValue, accountNumberLabelValue);

    // 20) Account number DDA reference: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.DDAReferenceValue, DDAReference);

    // 21) Mandate ID: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.mandateIdValue, mandateID);

    // 22) Status (PendingApproval) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.status, statusLabelValue);

    // 23) Amount (SGD): Validate UI Vs Json
    //await this.webComponents.compareUIVsJsonValue(this.amountValue, amountLabelValue);

    // 23) Amount (SGD): Validate UI Vs Json
    // If amountEditedLabelValue : is edited validate the edited value
    // else validate the no edited value of amount
    if (await this.webComponents.stringIsNotNullOrBlank(amountEditedLabelValue)) {
      await this.webComponents.compareUIVsJsonValue(this.amountValue, amountEditedLabelValue);
    } else {
      await this.webComponents.compareUIVsJsonValue(this.amountValue, amountLabelValue);
    }

    // 24) Transaction Code (92 - Direct Debit(Merchant Payment)) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.transactionCodeView, transactionLabelValue);



    // 25) Purpose of Payment (Merchant Initiated Bills Payment): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.purposeOfPaymentValue, purposeCodeLabelValue);

    // 26) Particulars: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.particularsValue, particularsLabelValue);

    // Click : showOptionalViewButton1
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetails);

    // 27) CollectionDetailValue: Validate UI Vs Json (Additional Validation)
    await this.webComponents.compareUIVsJsonValue(this.collectionDetailValue, collectionDetailsLabelValue);

    // 28) Message to payee (optional): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.emailmessageValue, emailMessageLabelValue);

    // 29)Emails 1 to 5 : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.emailId0Value, email1LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId1Value, email2LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId2Value, email3LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId3Value, email4LabelValue);
    await this.webComponents.compareUIVsJsonValue(this.emailId4Value, email5LabelValue);

    // Note: Below all Validation are (Additional Validation) for Payer2

    // 30) Payee/Nickname : Validate (Payee Name) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payer2NameValue, newPayeeName);

    // 31) Payee/Nickname : Validate (Nickname) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payer2NickNameValue, newPayeeNickName);

    // 32) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankNamePayer2Value, bankNameValue);

    // 33) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankCodePayer2Value, bankCodePayer2Value);

    // 34) Account number: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.accountNumberPayer2Value, newPayeeAcctNumber);

    // 35) Account number DDA reference: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.DDAReferencePayer2Value, DDAReferencePayer2);

    // 36) Mandate ID: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.mandateIdPayer2Value, mandateIDPayer2);

    // 37) Status (PendingApproval) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.statusPayer2, statusPayer2);

    // 38) Amount (SGD): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.amountPayer2Value, amountPayer2);

    // 39) Transaction Code (92 - Direct Debit(Merchant Payment)) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.transactionCodePayer2View, transactionCodePayer2);

    // 40) Particulars: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.particularsPayer2Value, particularsPayer2);

    // 41) Next approver Section : Visible
    await this.webComponents.waitElementToBeVisible(this.activityLogSection);

    // 42) Approval Details Section : Visible
    await this.webComponents.waitElementToBeVisible(this.approvalDetails);

  }

  /**
   * Author : LC5741501
   * This method delete's the PayeeOrReference No
   */
  async deleteOpenPayerOrReferenceNo(input: deleteOpenPayeeOrReferenceNo, reference) {
    const { transactionDeleted, internalReference } = input;
    // Click : Delete button
    await this.webComponents.clickWhenVisibleAndEnabled(this.deleteButonPayroll);

    // Click : Delete button (Confirm delete Popup)
    await this.webComponents.clickWhenVisibleAndEnabled(this.deleteButonConfirmDeletePopup);

    //Validate : Transaction Deleted Popup Label
    await this.webComponents.waitElementToBeVisible(this.transactionDeletedPopupLabel);
    await this.webComponents.compareUIVsJsonValue(this.transactionDeletedPopupLabel, transactionDeleted);

    // Validate : Refrence No is present in the deleted message
    if (await this.webComponents.stringIsNotNullOrBlank(internalReference)) {
      await this.webComponents.waitElementToBeVisible(this.transactionDeletedPopupLabelMsg);
      await this.webComponents.compareUIVsJsonValue(this.transactionDeletedPopupLabelMsg, internalReference);
    } else {
      await this.webComponents.waitElementToBeVisible(this.transactionDeletedPopupLabelMsg);
      await this.webComponents.compareUIVsJsonValue(this.transactionDeletedPopupLabelMsg, reference);
    }

  }

  /**
    *  Author: LC5741501
    * Created Date: 26/02/26
    * Returns the raw banner text (trimmed). If you only need EBLV…,
    */
  async getReferenceText(): Promise<string> {
    const raw = await this.referenceID.textContent();
    return (raw ?? '').trim();
  }


  /**
    * Author: LC5741501
    * Created Date: 26/02/26
    * It Extracts the reference ID and returns it
    */
  async getReferenceID(): Promise<string> {
    const raw = await this.getReferenceText();
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }

  /** 
    * Author: LC5741501
    * Created Date: 26/02/26
    * Wait until the Bulk Collection form Load 
    * (e.g., wait for the locator "fromAccount" toBeVisibale) are ready */
  async waitForBulkCollectionFormReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
    await expect(this.fromAccount).toBeEnabled({ timeout });
  }

  /** 
   * Author: LC5741501
   * Created Date: 26/02/26
   * Wait until preview page is ready (submit button visible/enabled) */
  async waitForPreviewPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.submitButton).toBeVisible({ timeout });
    await expect(this.submitButton).toBeEnabled({ timeout });
  }

  /** 
   * Author: LC5741501
   * Created Date: 26/02/26
   * Wait until submitted page is ready (finish button visible) */
  async waitForSubmittedPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.finishButton).toBeVisible({ timeout });
  }

  /** 
   * Author: LC5741501
   * Created Date: 26/02/26
   * Wait until PayAndTransfer page is ready (Bulk Collection button visible) */
  async waitForPayAndTransferPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.bulkCollection).toBeVisible({ timeout });
  }

  /** Wait until view payment page has loaded key labels */
  async waitForViewPaymentPageReady(timeout = 55_000) {
    await this.waitForUXLoading();
    await expect(this.hashValue).toBeVisible({ timeout });
    await expect(this.toAccountNumberLabel).toBeVisible({ timeout });
    await expect(this.paymentTypeValue).toBeVisible({ timeout });
  }

  /**
   * Author: LC5741501
   * Created Date: 26/02/26
   * Approximation of the old global waitForUXLoading():
   * waits for common spinners/overlays to hide, then network idle.
   * Add app-specific spinners to the list as needed.
   */
  async waitForUXLoading(extraSpinnerSelectors: string[] = []) {
    const spinnerSelectors = [
      '.ux-loading',
      '.loading',
      '.spinner',
      '.mat-progress-spinner',
      '.cdk-overlay-backdrop',
      ...extraSpinnerSelectors,
    ];
    for (const sel of spinnerSelectors) {
      const spinner = this.page.locator(sel).first();
      try {
        if (await spinner.isVisible({ timeout: 500 }).catch(() => false)) {
          await spinner.waitFor({ state: 'hidden', timeout: 15_000 });
        }
      } catch {
        /* ignore */
      }
    }
    await this.page.waitForLoadState('networkidle');
  }
  /** Safe click: visible + enabled + click */
  async safeClick(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  /** Safe fill: visible then fill */
  async safeFill(locator: Locator, value: string, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value ?? '');
  }

  /** Quick visible probe */
  async isVisible(locator: Locator, timeout = 1000) {
    return locator.isVisible({ timeout }).catch(() => false);
  }



}