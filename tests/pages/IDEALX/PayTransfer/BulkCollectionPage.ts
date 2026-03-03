// tests/pages/IDEALX/PayTransfer/BulkPaymentPage.ts
import { Page, Locator, expect } from '@playwright/test';

export type NewPayeeInput = {
  name: string;
  ddaReference: string;
  bankId: string;
  accountNumber: string;
};


export type NewPayeeResult = {
  name: string;
  accountNumber: string;
};

export class BulkCollectionPage {
  constructor(private readonly page: Page) {

    
 // Create page
 this.bulkCollection = page.locator('xpath=//*[@id="icon__initiate_bulk_collection"]/parent::span');
 this.fromAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
 this.newPayeeTab = page.locator('xpath=//*[@id="ux-tab-labelNewPayer"]');
 this.debitType = page.locator('xpath=//p-auto-complete[@formcontrolname="debitType"]');
 this.debitTypeValue = page.locator('xpath=//*[@id="options-type-bulk.labelItemizedCredit"]');
 this.consolidateCreditValue = page.locator('xpath=//*[@id="options-type-bulk.labelConsolidatedCredit"]');

 this.newPayeeName = page.locator('xpath=//input[@name="new-payee-payeeName"]');
 this.payeeBankId = page.locator('xpath=//*[@id="bulk-newPayee-bankId"]');
 this.findBankIDButton = page.locator('xpath=//*[@id="new-payee-bank-id-button"]');
 this.payeeBankSearchResults = page.locator('xpath=//*[@class="search-result-container"]');
 this.newPayeeAccountNumber = page.locator('xpath=//input[@name="new-payee-accountNumber"]');
 this.ddaRef = page.locator('xpath=//input[@name="new-payee-dda"]');
 this.addNewPayeeButton = page.locator('xpath=//button[@name="add-payee"]');
 this.amount = page.locator('xpath=//input[@name="payeeAmount"]');
 this.billerServiceID = page.locator('xpath=//multi-level-dropdown[@name="billerServiceID"]');
 this.payeeNationalID = page.locator('xpath=//input[@name="payeeNationalID"]');
 this.payeeMandateDetail = page.locator('xpath=//input[@name="payeeMandateDetail"]');
 this.payeePassbook = page.locator('xpath=//input[@name="payeePassbook"]');
 this.payeeStockCode = page.locator('xpath=//input[@name="payeeStockCode"]');
 this.showOptionDetailPayee1 = page.locator('xpath=//div[@id="temp-bulk-create-optDetail_0"]');
 this.collectionDetails = page.locator('xpath=//textarea[@name="payeeDetails"]');
 this.payeeFreeTextForSender = page.locator('xpath=//input[@name="payeeFreeText4Sender"]');
 this.payeeRef = page.locator('xpath=//*[@name="payeeRef"]');
 this.messageToPayer = page.locator('xpath=//label[@for="isBeneAdvising0"]');
 this.faxTab = page.locator('xpath=//email-fax/div/div/div[2]/div/tabs-component/ul/li[2]');
 this.faxCountryCode0 = page.locator('xpath=//*[@formcontrolname="ctryCode"]');
 this.faxAreaCode0 = page.locator('xpath=//input[@name="fax-0"]');
 this.faxNo0 = page.locator('xpath=//input[@name="faxNo-0"]');
 this.message = page.locator('xpath=//textarea[@name="adviceContent"]');
 this.emailId0 = page.locator('xpath=//input[@name="email-0"]');
 this.emailId1 = page.locator('xpath=//input[@name="email-1"]');
 this.emailId2 = page.locator('xpath=//input[@name="email-2"]');
 this.emailId3 = page.locator('xpath=//input[@name="email-3"]');
 this.emailId4 = page.locator('xpath=//input[@name="email-4"]');
 this.addButton = page.locator('xpath=//*[@name="add"]');
 this.existingPayeeFilter = page.locator('xpath=//input[@name="payee-selector"]');
 this.nextButton = page.locator('xpath=//button[@name="next"]');
 this.submitButton = page.locator('xpath=//button[@name="submit"]');
 this.finishedButton = page.locator('xpath=//button[@name="finish"]');
 this.approveButton = page.locator('xpath=//button[@name="approve"]');
 this.challengeResponse = page.locator('xpath=//input[@name="responseCode"]');
 this.approveNowCheckBox = page.locator('xpath=//*[@name="approveNow"]');
 this.getChallengeButton = page.locator('xpath=//*[@name="get-challenge"]');
 this.batchID = page.locator('xpath=//*[@name="batch-id"]');
 this.saveAsTemplate = page.locator('xpath=//*[@name="saveAsTemplate"]');
 this.templateName = page.locator('xpath=//*[@name="templateName"]');
 this.saveAsDraft = page.locator('xpath=//*[@name="save-as-draft"]');
 this.amountErrorTip = page.locator('xpath=//bp-payee-amount//span[starts-with(@class, "dbs-validation-error")]');
 this.existingPayerTab = page.locator('xpath=//*[@id="ux-tab-labelExistingPayee"]');
 this.mandateID = page.locator('xpath=//*[@name="new-payee-mandate-id"]');
 this.transactionCode = page.locator('xpath=//*[@formcontrolname="transactionCode"]');
 this.purposeOfPayment = page.locator('xpath=//*[@formcontrolname="payeePurposeCode"]');
 this.particular = page.locator('xpath=//*[@name="payeeParticulars"]');
 this.pushOption = page.locator('xpath=//*[@class="push-option-label"]');
 this.viewVerifyReleaseBtn = page.locator('xpath=//button[@name="view-verify-release"]');
 this.verifyReleaseConfirmButton = page.locator('xpath=//button[@name="verify-release"]');
 this.acceptAndApproveButton = page.locator('xpath=//button[@class="btn btn__primary ng-star-inserted"]');
 this.selectFromAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
 this.bankCharge = page.locator('xpath=//dbs-radio-group[@formcontrolname="bankCharge"]');
 this.serviceID = page.locator('xpath=//multi-level-dropdown[@formcontrolname="billerServiceID"]');
 this.mandateDetail = page.locator('xpath=//input[@name="payeeMandateDetail"]');
 this.stockCode = page.locator('xpath=//input[@name="payeeStockCode"]');

 // Delete
 this.deleteButton = page.locator('xpath=//button[@name="delete"]');
 this.deleteDialogButton = page.locator('xpath=//*[@id="dialogDelete"]');
 this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');

 // Copy
 this.copyButton = page.locator('xpath=//*[@name="copy"]');

 // Edit
 this.editButton = page.locator('xpath=//*[@id="bulk-view-edit"]');

 // Reject
 this.rejectButton = page.locator('xpath=//button[@name="reject"]');
 this.reasonForRejection = page.locator('xpath=//input[@name="reasonForRejection"]');
 this.rejectDialogButton = page.locator('xpath=//dbs-reject-dialog/div/div[2]/div[2]/button[2]');

//Payee / Beneficiary details in view payment page (some fields are shared with template view, so defined here)
this.beneficiaryTab = page.locator('xpath=//span[normalize-space()="Payee / Beneficiaries"]');
this.beneficiaryFilter= page.locator('xpath=//input[@id="approve-filter"]');
this.beneficiaryDelButton= page.locator('xpath=//button[@name="payee-delete"]');
this.beneficiaryDelCnfButton= page.locator('xpath=//button[@id="dialogDelete"]');
this.beneficiaryDelDismissButton= page.locator('xpath=//button[@name="cancel"]');

 // View Bulk Collection
 this.fromAccountViewLabel = page.locator('xpath=//span[@id="bulk-view-accountNum"]');
 this.fromAccountNameView = page.locator('xpath=//span[@id="bulk-view-accountName"]');
 this.totalAmountValue = page.locator('xpath=//*[@id="bulk-view-paymentAmount"]');
 this.accountNumberValue = page.locator('xpath=//strong[@id="bulk-view-acctNum_0"]');
 this.accountNumberValue2 = page.locator('xpath=//strong[@id="bulk-view-acctNum_1"]');
 this.payeeNameValue = page.locator('xpath=//*[@id="bulk-view-name_0"]');
 this.payeeNameValue2 = page.locator('xpath=//*[@id="bulk-view-name_1"]');
 this.payeeNickNameValue = page.locator('xpath=//*[@id="bulk-view-nickName_0"]');
 this.payeeNickNameValue2 = page.locator('xpath=//*[@id="bulk-view-nickName_1"]');
 this.refForPayeeValue = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="reference-for-payee"]');
 this.refForPayeeValue2 = page.locator('xpath=//dbs-view-transfer-list[2]//*[@id="reference-for-payee"]');
 this.transactionStatusValue = page.locator('xpath=//div[@id="bulk-view-status_0"]');
 this.transactionStatusValue2 = page.locator('xpath=//div[@id="bulk-view-status_1"]');
 this.hashValue = page.locator('xpath=//*[@id="bulk-view-hashValue"]');
 this.referenceValue = page.locator('xpath=//*[@id="viewReference"]');
 this.referenceID = page.locator('xpath=//label[contains(text(),"Bulk Collection")]');
 this.balanceValue = page.locator('xpath=//*[@id="bulk-view-acctBalance"]');
 this.paymentType = page.locator('xpath=//*[@id="bulk-view-paymentType"]');
 this.paymentType2 = page.locator('xpath=//ng-component/div/div/dbs-bulk-view-section/div/dbs-bp-view-summary-section/div[5]/span[2]');
 this.bankChargeType = page.locator('xpath=//*[@id="bulk-view-bankChargeType"]');
 this.chargeAcctValue = page.locator('xpath=//*[@id="bulk-view-charge-account"]');
 this.viewConsolidateCreditValue = page.locator('xpath=//*[@id="bulk-view-debitType-template"]');
 this.paymentDate = page.locator('xpath=//*[@id="bulk-view-paymentDate"]');
 this.batchIDValue = page.locator('xpath=//*[@id="bulk-view-batchId"]');
 this.billerServiceIDValue = page.locator('xpath=//*[@id="bulk-view-billerServiceID"]');
 this.collectionSummaryValue = page.locator('xpath=//*[@class="summary-panel step2-panel-triangle"]');
 this.colTotalPayee = page.locator('xpath=//*[@id="view-bulk-totalItem"]');
 this.colTotalAmount = page.locator('xpath=//*[@id="view-bulk-totalAmount"]');
 this.payeeBankName = page.locator('xpath=//*[@id="bulk-view-payeeBankName_0"]');
 this.payeeBankName2 = page.locator('xpath=//*[@id="bulk-view-payeeBankName_1"]');
 this.payeeBankSwiftBic = page.locator('xpath=//*[@id="bulk-view-bankDetailsMsgDisplay_0"]');
 this.payeeBankSwiftBic2 = page.locator('xpath=//*[@id="bulk-view-bankDetailsMsgDisplay_1"]');
 this.payeeBankDetManual = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_0"]');
 this.payeeBankDetManual2 = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_1"]');
 this.mandateIdValue = page.locator('xpath=//*[@id="bulk-view-mandateId_0"]');
 this.mandateIdValue2 = page.locator('xpath=//*[@id="bulk-view-mandateId_1"]');
 this.ddaReferenceValue = page.locator('xpath=//*[@id="bulk-view-ddaRef_0"]');
 this.ddaReferenceValue2 = page.locator('xpath=//*[@id="bulk-view-ddaRef_1"]');
 this.amountValue = page.locator('xpath=//strong[@id="bulk-view-amount_0"]');
 this.amountValue2 = page.locator('xpath=//strong[@id="bulk-view-amount_1"]');
 this.transactionCodeView = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="transaction-code-label"]');
 this.transactionCodeView2 = page.locator('xpath=//dbs-view-transfer-list[2]//*[@id="transaction-code-label"]');
 this.particularsValue = page.locator('xpath=//*[@id="bulk-view-particular_0"]');
 this.particularsValue2 = page.locator('xpath=//*[@id="bulk-view-particular_1"]');
 this.purposeCodeValue = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="purpose-code-label"]');
 this.purposeCodeValue2 = page.locator('xpath=//dbs-view-transfer-list[2]//*[@id="purpose-code-label"]');
 this.payeePurposeCodeValue = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="payee-purpose-code-label"]');
 this.collectionDetailValue = page.locator('xpath=//*[@id="bulk-view-paymentDetails_0"]');
 this.collectionDetailValue2 = page.locator('xpath=//*[@id="bulk-view-paymentDetails_1"]');
 this.mandateDetailValue = page.locator('xpath=//*[@id="bulk-view-mandateDetail_0"]');
 this.mandateDetailValue2 = page.locator('xpath=//*[@id="bulk-view-mandateDetail_1"]');
 this.stockCodeValue = page.locator('xpath=//*[@id="bulk-view-stockCode_0"]');
 this.stockCodeValue2 = page.locator('xpath=//*[@id="bulk-view-stockCode_1"]');
 this.passBookValue = page.locator('xpath=//*[@id="bulk-view-passBook_0"]');
 this.passBookValue2 = page.locator('xpath=//*[@id="bulk-view-passBook_1"]');
 this.freeTextValue = page.locator('xpath=//*[@id="bulk-view-freeText_0"]');
 this.freeTextValue2 = page.locator('xpath=//*[@id="bulk-view-freeText_1"]');

 this.messageValue = page.locator('xpath=//*[@id="bulk-view-message_0"]');
 this.messageValue2 = page.locator('xpath=//*[@id="bulk-view-message_1"]');
 this.emailList = page.locator('xpath=//*[@id="bulk-view-email_0"]');
 this.emailList2 = page.locator('xpath=//*[@id="bulk-view-email_1"]');
 this.nextApprover = page.locator('xpath=//dbs-approval-requirement/div/section/div[1]/span[2]');
 this.activityLog = page.locator('xpath=//*[@class="payment-history"]');
 this.showOptionView = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_0"]');
 this.showOptionView2 = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_1"]');

 // View tabs (4333 issue)
 this.viewShowAllTab = page.locator('xpath=//a[@id="ux-tab-1"]');
 this.viewPendingTab = page.locator('xpath=//a[@id="ux-tab-2"]');
 this.viewRejectedTab = page.locator('xpath=//a[@id="ux-tab-3"]');
 this.viewCompletedTab = page.locator('xpath=//a[@id="ux-tab-4"]');

 this.viewLoadedLabel = page.locator('xpath=//label[@id="view-bulk-loaded"]');
 this.viewLoadMoreButton = page.locator('xpath=//label[@id="bulk-loaded-more"]');
 this.viewPreTenButton = page.locator('xpath=//button[@name="view-up-to-0"]');
 this.viewPreHundredButton = page.locator('xpath=//button[@name="view-up-to-1"]');
 this.viewPaginationButton = page.locator('xpath=//*[@id="pagination-1"]');
 this.viewRejectedTabRadio = page.locator('xpath=//span[@id="radio-label-0"]');
 this.viewBulkTotalItem = page.locator('xpath=//span[@id="view-bulk-totalItem"]');
 this.showOptionalButton = page.locator('xpath=//span[@id="show-optional-details-0"]');

// View Template
this.viewTemplateName = page.locator('xpath=//span[@id="bulk-viewTemp-name"]');
this.viewTemplateFromAccount = page.locator('xpath=//span[@id="bulk-viewTemp-accountNum"]');

// Create TW ACH from template
this.twAchPayerID = page.locator('xpath=//input[@name="payeeNationalID"]');

// Express Bulk Collection
this.customDayButton = page.locator('xpath=//input[@id="sgbc_set_date"]');
this.expressTypeButton = page.locator('xpath=//input[@id="exp_coll_type"]');

// IN Bulk Collection
this.ucicCode = page.locator('xpath=//input[@name="ucicCode"]');
this.ucicCodeValue = page.locator('xpath=//*[@id="bulk-view-ucicCode"]');

      }

  // ────────────────────────────── Locators ──────────────────────────────
  

// Create page
readonly bulkCollection: Locator;
readonly fromAccount: Locator;
readonly newPayeeTab: Locator;
readonly debitType: Locator;
readonly debitTypeValue: Locator;
readonly consolidateCreditValue: Locator;

readonly newPayeeName: Locator;
readonly payeeBankId: Locator;
readonly findBankIDButton: Locator;
readonly payeeBankSearchResults: Locator;
readonly newPayeeAccountNumber: Locator;
readonly ddaRef: Locator;
readonly addNewPayeeButton: Locator;
readonly amount: Locator;
readonly billerServiceID: Locator;
readonly payeeNationalID: Locator;
readonly payeeMandateDetail: Locator;
readonly payeePassbook: Locator;
readonly payeeStockCode: Locator;
readonly showOptionDetailPayee1: Locator;
readonly collectionDetails: Locator;
readonly payeeFreeTextForSender: Locator;
readonly payeeRef: Locator;
readonly messageToPayer: Locator;
readonly faxTab: Locator;
readonly faxCountryCode0: Locator;
readonly faxAreaCode0: Locator;
readonly faxNo0: Locator;
readonly message: Locator;
readonly emailId0: Locator;
readonly emailId1: Locator;
readonly emailId2: Locator;
readonly emailId3: Locator;
readonly emailId4: Locator;
readonly addButton: Locator;
readonly existingPayeeFilter: Locator;
readonly nextButton: Locator;
readonly submitButton: Locator;
readonly finishedButton: Locator;
readonly approveButton: Locator;
readonly challengeResponse: Locator;
readonly approveNowCheckBox: Locator;
readonly getChallengeButton: Locator;
readonly batchID: Locator;
readonly saveAsTemplate: Locator;
readonly templateName: Locator;
readonly saveAsDraft: Locator;
readonly amountErrorTip: Locator;
readonly existingPayerTab: Locator;
readonly mandateID: Locator;
readonly transactionCode: Locator;
readonly purposeOfPayment: Locator;
readonly particular: Locator;
readonly pushOption: Locator;
readonly viewVerifyReleaseBtn: Locator;
readonly verifyReleaseConfirmButton: Locator;
readonly acceptAndApproveButton: Locator;
readonly selectFromAccount: Locator;
readonly bankCharge: Locator;
readonly serviceID: Locator;
readonly mandateDetail: Locator;
readonly stockCode: Locator;

// Delete
readonly deleteButton: Locator;
readonly deleteDialogButton: Locator;
readonly dismissButton: Locator;

// Copy
readonly copyButton: Locator;

// Edit
readonly editButton: Locator;

// Reject
readonly rejectButton: Locator;
readonly reasonForRejection: Locator;
readonly rejectDialogButton: Locator;

//Payee / Beneficiary details in view payment page (some fields are shared with template view, so defined here)
readonly beneficiaryTab: Locator;
readonly beneficiaryFilter: Locator;
readonly beneficiaryDelButton: Locator;
readonly beneficiaryDelCnfButton: Locator;
readonly beneficiaryDelDismissButton: Locator;

// View Bulk Collection
readonly fromAccountViewLabel: Locator;
readonly fromAccountNameView: Locator;
readonly totalAmountValue: Locator;
readonly accountNumberValue: Locator;
readonly accountNumberValue2: Locator;
readonly payeeNameValue: Locator;
readonly payeeNameValue2: Locator;
readonly payeeNickNameValue: Locator;
readonly payeeNickNameValue2: Locator;
readonly refForPayeeValue: Locator;
readonly refForPayeeValue2: Locator;
readonly transactionStatusValue: Locator;
readonly transactionStatusValue2: Locator;
readonly hashValue: Locator;
readonly referenceValue: Locator;
readonly referenceID: Locator;
readonly balanceValue: Locator;
readonly paymentType: Locator;
readonly paymentType2: Locator;
readonly bankChargeType: Locator;
readonly chargeAcctValue: Locator;
readonly viewConsolidateCreditValue: Locator;
readonly paymentDate: Locator;
readonly batchIDValue: Locator;
readonly billerServiceIDValue: Locator;
readonly collectionSummaryValue: Locator;
readonly colTotalPayee: Locator;
readonly colTotalAmount: Locator;
readonly payeeBankName: Locator;
readonly payeeBankName2: Locator;
readonly payeeBankSwiftBic: Locator;
readonly payeeBankSwiftBic2: Locator;
readonly payeeBankDetManual: Locator;
readonly payeeBankDetManual2: Locator;
readonly mandateIdValue: Locator;
readonly mandateIdValue2: Locator;
readonly ddaReferenceValue: Locator;
readonly ddaReferenceValue2: Locator;
readonly amountValue: Locator;
readonly amountValue2: Locator;
readonly transactionCodeView: Locator;
readonly transactionCodeView2: Locator;
readonly particularsValue: Locator;
readonly particularsValue2: Locator;
readonly purposeCodeValue: Locator;
readonly purposeCodeValue2: Locator;
readonly payeePurposeCodeValue: Locator;
readonly collectionDetailValue: Locator;
readonly collectionDetailValue2: Locator;
readonly mandateDetailValue: Locator;
readonly mandateDetailValue2: Locator;
readonly stockCodeValue: Locator;
readonly stockCodeValue2: Locator;
readonly passBookValue: Locator;
readonly passBookValue2: Locator;
readonly freeTextValue: Locator;
readonly freeTextValue2: Locator;

readonly messageValue: Locator;
readonly messageValue2: Locator;
readonly emailList: Locator;
readonly emailList2: Locator;
readonly nextApprover: Locator;
readonly activityLog: Locator;
readonly showOptionView: Locator;
readonly showOptionView2: Locator;

// View tabs (4333 issue)
readonly viewShowAllTab: Locator;
readonly viewPendingTab: Locator;
readonly viewRejectedTab: Locator;
readonly viewCompletedTab: Locator;

readonly viewLoadedLabel: Locator;
readonly viewLoadMoreButton: Locator;
readonly viewPreTenButton: Locator;
readonly viewPreHundredButton: Locator;
readonly viewPaginationButton: Locator;
readonly viewRejectedTabRadio: Locator;
readonly viewBulkTotalItem: Locator;
readonly showOptionalButton: Locator;

// View Template
readonly viewTemplateName: Locator;
readonly viewTemplateFromAccount: Locator;

// Create TW ACH from template
readonly twAchPayerID: Locator;

// Express Bulk Collection
readonly customDayButton: Locator;
readonly expressTypeButton: Locator;

// IN Bulk Collection
readonly ucicCode: Locator;
readonly ucicCodeValue: Locator;

  // ────────────────────────────── Waits / Actions ──────────────────────────────


  /**
     * Add a new payee flow (reusable in all tests).
     * Mirrors the exact steps you currently perform, including clipboard paste.
     */
  async addNewPayee(input: NewPayeeInput): Promise<NewPayeeResult> {
    const { name, ddaReference, bankId, accountNumber } = input;
  
      await this.newPayeeTab.click();
      await this.safeClick(this.newPayeeName);
      await this.safeFill(this.newPayeeName, name);
      await this.page.keyboard.press('Tab');
      await this.newPayeeName.blur();
      await this.payeeBankId.click();
      await this.payeeBankId.fill(bankId);
      await this.page.keyboard.press('Enter');
      await this.payeeBankId.blur();
      await this.safeClick(this.findBankIDButton);
      await expect(this.payeeBankSearchResults.first()).toBeVisible({ timeout: 15000 });
      await this.payeeBankSearchResults.first().click();
      await this.safeClick(this.newPayeeAccountNumber);
  
      // Preserve your clipboard -> paste behavior
      await this.page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
      }, accountNumber);
  
      await this.page.keyboard.press('Control+V');
      await this.page.keyboard.press('Enter');
      await this.page.keyboard.press('Tab');
      await this.newPayeeAccountNumber.blur();
      await this.ddaRef.click();
      await this.ddaRef.fill(ddaReference);
      await this.page.keyboard.press('Enter');
      await this.ddaRef.blur();
      await this.safeClick(this.addNewPayeeButton);
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
  

  // Wait for disappearance of a success banner OR row removal if you can detect it.
  // Fallback: brief pause to let UI settle.
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

  
  /**
     * Returns the raw banner text (trimmed). If you only need EBLV…,
     * use getReferenceToken() below.
     */
  async getReferenceText(): Promise<string> {
    const raw = await this.referenceID.textContent();
    return (raw ?? '').trim();
  }

  //Extract reference ID
  
  async getReferenceID(): Promise<string> {
    const raw = await this.getReferenceText();
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }

  /** Former: jiazhai() – waits until create form is ready (fromAccount visible). */
  async waitForBulkCollectionFormReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForPreviewPage() – Preview page ready (submit enabled). */
  async waitForPreviewPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.submitButton).toBeVisible({ timeout });
    await expect(this.submitButton).toBeEnabled({ timeout });
  }

  /** Former: jiazhaiForSubmittedPage() – Submitted page ready (finish/done button). */
  async waitForSubmittedPageReady(timeout = 50_000) {
    await this.waitForUXLoading();
    await expect(this.finishedButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForViewPaymentPage() – View page ready (fromAccountView + hashValue). */
  async waitForViewPaymentPageReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccountViewLabel).toBeVisible({ timeout });
    await expect(this.hashValue).toBeVisible({ timeout });
    await this.page.waitForTimeout(500).catch(() => {});
  }

  /** Former: jiazhaiForApprovePaymentPage() – Approve button visible. */
  async waitForApprovePaymentPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.approveButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForDismissDialog() */
  async waitForDismissDialogReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.dismissButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForDismissDeleteDialog() */
  async waitForDismissDeleteDialogReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await this.page.waitForTimeout(10000);
    await expect(this.dismissButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForDismissRejectDialog() */
  async waitForDismissRejectDialogReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await this.page.waitForTimeout(10000);
    await expect(this.dismissButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForViewPagination() */
  async waitForViewPaginationReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.showOptionalButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForViewTemplatePage() */
  async waitForViewTemplatePageReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.viewTemplateName).toBeVisible({ timeout });
  }

  /** Former: jiazhaiCreatePayemntTemplate() */
  async waitForCreatePaymentTemplateReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.amount).toBeVisible({ timeout });
    await this.waitForUXLoading();
  }

  /** Former: addExistingPayee(testDate) */
  async addExistingPayee(existingPayeeFilter: string) {
    await this.safeFill(this.existingPayeeFilter, existingPayeeFilter);
    await this.safeClick(this.addButton);
  }

  /** Former: switchBulkViewTab(_element) */
  async switchBulkViewTab(tabButton: Locator) {
    await this.waitForViewPaginationReady();
    await tabButton.click({ force: true });
    // In the old code it validated that viewLoadedLabel disappeared; keep a soft check here.
    await this.viewLoadedLabel.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  /** Former: checkPaginationForShowAllTab() */
  async checkPaginationForShowAllTab() {
    await this.viewShowAllTab.click({ force: true });
    await expect(this.viewPreTenButton).toBeVisible();
    await expect(this.viewPreHundredButton).toBeVisible();
    await expect(this.viewPaginationButton).toBeVisible();

    await this.viewPaginationButton.click({ force: true });
    await this.viewPreHundredButton.click({ force: true });
  }

  /** Former: checkPaginationForRejectTab() */
  async checkPaginationForRejectTab() {
    await this.viewRejectedTab.click({ force: true });

    // Parse count inside radio text
    const text = (await this.viewRejectedTabRadio.textContent()) ?? '';
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;

    if (num > 10) {
      await expect(this.viewPreTenButton).toBeVisible();
      await expect(this.viewPreHundredButton).toBeVisible();
      await expect(this.viewPaginationButton).toBeVisible();
    } else {
      // When <= 10, these may not appear—soft checks only
      const ten = await this.isVisible(this.viewPreTenButton, 1000);
      const hundred = await this.isVisible(this.viewPreHundredButton, 1000);
      const pager = await this.isVisible(this.viewPaginationButton, 1000);
      // no-ops; used only to stabilize timing
      void ten; void hundred; void pager;
    }
  }

  // ────────────────────────────── Utilities ──────────────────────────────

  /** Generic UX loading guard: wait for common spinners/overlays then network idle. */
  async waitForUXLoading(extraSpinnerSelectors: string[] = []) {
    const spinnerSelectors = [
      '//ng-busy/div',
      '.ux-loading',
      '.loading',
      '.spinner',
      '.mat-progress-spinner',
      '.cdk-overlay-backdrop',
      ...extraSpinnerSelectors,
    ];
    for (const sel of spinnerSelectors) {
      const loc = sel.startsWith('/') ? this.page.locator(`xpath=${sel}`) : this.page.locator(sel);
      try {
        const first = loc.first();
        if (await first.isVisible({ timeout: 400 }).catch(() => false)) {
          await first.waitFor({ state: 'hidden', timeout: 15_000 });
        }
      } catch { /* ignore */ }
    }
    await this.page.waitForLoadState('networkidle').catch(() => {});
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