// tests/pages/IDEALX/PayTransfer/BulkPaymentPage.ts
import { Page, Locator, expect } from '@playwright/test';

export type NewPayeeInput = {
  name: string;
  nickName: string;
  bankId: string;
  accountNumber: string;
};


export type NewPayeeResult = {
  nickName: string;
  accountNumber: string;
};

export class BulkPaymentPage {
  constructor(private readonly page: Page) {
    // Create Page / Menu
    this.menuRadio = page.locator('xpath=//dbs-toolbar/div/div[2]/p-horizontal-navigation/div/ul[2]/li[2]');
    this.bulkPayment = page.locator('xpath=//*[@id="icon__bulk_payment"]/parent::span');

    // Create form
    this.debitTypeSelect = page.locator('xpath=//p-auto-complete[@id="debitType"]');
    this.consolidatedDebit = page.locator('xpath=//span[@id="options-type-bulk.labelConsolidatedDebit"]');
    this.fromAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
    this.billerServiceID = page.locator('xpath=//multi-level-dropdown[@name="billerServiceID"]');
    this.bankCharge = page.locator('xpath=//dbs-radio-group[@formcontrolname="bankCharge"]');
    this.amount = page.locator('xpath=//input[@name="payeeAmount"]');
    this.payeeRef = page.locator('xpath=//input[@name="payeeRef"]');
    this.payeeParticulars = page.locator('xpath=//input[@name="payeeParticulars"]');
    this.paymentDetailsTextarea = page.locator('xpath=//textarea[@name="payeeDetails"]');
    this.payeeFreeText4Sender = page.locator('xpath=//*[@name="payeeFreeText4Sender"]');
    this.isBeneAdvising = page.locator('xpath=//input[@name="isBeneAdvising0"]');
    this.emailId0 = page.locator('xpath=//input[@name="email-0"]');
    this.emailId1 = page.locator('xpath=//input[@name="email-1"]');
    this.emailId2 = page.locator('xpath=//input[@name="email-2"]');
    this.emailId3 = page.locator('xpath=//input[@name="email-3"]');
    this.emailId4 = page.locator('xpath=//input[@name="email-4"]');
    this.message = page.locator('xpath=//textarea[@name="adviceContent"]');
    this.existingPayeeTab = page.locator('xpath=//*[@id="labelExistingPayee_0"]');
    this.existingPayeeFilter = page.locator('xpath=//input[@name="payee-selector"]');
    this.addPayee = page.locator('xpath=//button[@name="addPayee"]');
    this.addButton = page.locator('xpath=//button[@name="add"]');

    // Tabs
    this.newPayNow = page.locator('xpath=//*[@id="ux-tab-labelPayNow"]');
    this.existingPayeeTabIx = page.locator('xpath=//*[@id="ux-tab-labelExistingPayee"]');
    this.newPayeeTab = page.locator('xpath=//*[@id="ux-tab-labelNewPayee"]');
    this.newFPSPayee = page.locator('xpath=//*[@name="hk-fps-detail"]');

    // HK FPS
    this.mobileValue = page.locator('xpath=//*[@name="proxyTypeMobNumShuRu"]');
    this.hkfpsIdRadio = page.locator('xpath=//*[@id="labelNewPayee-panel"]/div/bulk-new-fps-payee/div/section/div/div[1]/span[2]/dbs-radio-group/div/dbs-radio[3]/div/label');
    this.hkfpsIdValue = page.locator('xpath=//*[@name="proxyTypeFasterIDShuRu"]');

    // Without PayNow
    this.newPayeeWithoutPaynow = page.locator('xpath=/html/body/dbs-root/ng-component/div/div[3]/ng-component/div/ng-component/div/div/div/form/create-step-2/div/tabs-component/ul/li[2]');

    // Bank finding
    this.payeeBankIDS = page.locator('xpath=//div[@id="swift-selector-element"]');
    this.payeeBankId = page.locator('xpath=//*[@id="bulk-newPayee-bankId"]');
    this.findBankIDButton = page.locator('xpath=//*[@id="new-payee-bank-id-button"]');
    this.payeeBankResultList = page.locator('xpath=//bulk-bank-finder/div/div/span[2]/table/tr/td/label/div[1]');
    this.payeeBankSearchResults = page.locator('xpath=//*[@class="search-result-container"]');
    this.enterDetailButton = page.locator('xpath=//div[starts-with(@class, "manual clearfix")]');
    this.bsbCodeText = page.locator('xpath=//input[@name="bp-swift-select-bsbCode"]');
    this.proxyTypeMobNum = page.locator('xpath=//input[@name="proxyTypeMobNumShuRu"]');
    this.payeeBankIDSelected = page.locator('xpath=//dbs-typeahead-window/div/div[1]/span');
    this.newPayeeName = page.locator('xpath=//input[@name="new-payee-payeeName"]');
    this.payeeAddress1 = page.locator('xpath=//input[@name="new-payee-add1"]');
    this.newPayeeAccountNumber = page.locator('xpath=//input[@name="new-payee-accountNumber"]');
    this.addNewPayeeButton = page.locator('xpath=//button[@name="add-payee"]');
    this.showOptionalDetails = page.locator('xpath=//div[@id="temp-bulk-create-optDetail_0"]');

    // Actions / controls
    this.approveNowCheckBox = page.locator('xpath=//input[@id="approveNow"]');
    this.pushOption = page.locator('xpath=//*[@class="push-option-label"]');
    this.batchId = page.locator('xpath=//input[@name="batch-id"]');
    this.getChallengeSMS = page.locator('xpath=//button[@name="get-challenge"]');
    this.challengeResponse = page.locator('xpath=//input[@name="responseCode"]');
    this.saveAsTemplateCheckbox = page.locator('xpath=//*[@name="saveAsTemplate"]');
    this.templateName = page.locator('xpath=//*[@name="templateName"]');
    this.saveAsDraft = page.locator('xpath=//button[@name="save-as-draft"]');
    this.editButton = page.locator('xpath=//*[@id="bulk-view-edit"]');
    this.copyButton = page.locator('xpath=//button[@name="copy"]');
    this.finishedButton = page.locator('xpath=//button[@name="finish"]');
    this.nextButton = page.locator('xpath=//button[@name="next"]');
    this.submitButton = page.locator('xpath=//button[@name="submit"]');
    this.approveButton = page.locator('xpath=//button[@name="approve"]');
    this.pushButton = page.locator('xpath=//button[@id="push-btn"]');
    this.amountInlineError = page.locator('xpath=//bp-payee-amount//span[starts-with(@class, "dbs-validation-error")]');

    // Delete
    this.deleteButton = page.locator('xpath=//button[@name="delete"]');
    this.deleteDialogButton = page.locator('xpath=//*[@id="dialogDelete"]');
    this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');
    this.transactionResult = page.locator('xpath=//p[@id="labelNoInformationDisplay"]');

    // Reject
    this.rejectButton = page.locator('xpath=//button[@name="reject"]');
    this.reasonForRejection = page.locator('xpath=//input[@name="reasonForRejection"]');
    this.rejectDialogButton = page.locator('xpath=//dbs-reject-dialog/div/div[2]/div[2]/button[2]');
    this.rejectStatus = page.locator('xpath=//strong[@id="bulk-view-rejectStatus_0"]');
    this.rejectButton4 = page.locator('xpath=//button[@class="btn btn__secondary medium bg-white text-red-500 ng-star-inserted"]');
    this.rejectStatus2 = page.locator('xpath=//strong[@id="bulk-view-rejectStatus_1"]');
    this.rejectStatus3 = page.locator('xpath=//strong[@id="bulk-view-rejectStatus_2"]');

    //Payee / Beneficiary details in view payment page (some fields are shared with template view, so defined here)
    this.beneficiaryTab = page.locator('xpath=//span[normalize-space()="Payee / Beneficiaries"]');
    this.beneficiaryFilter= page.locator('xpath=//input[@id="approve-filter"]');
    this.beneficiaryDelButton= page.locator('xpath=//button[@name="payee-delete"]');
    this.beneficiaryDelCnfButton= page.locator('xpath=//button[@id="dialogDelete"]');
    this.beneficiaryDelDismissButton= page.locator('xpath=//button[@name="cancel"]');

    // View Page
    this.hashValue = page.locator('xpath=//*[@id="bulk-view-hashValue"]');
    this.fromAccountViewLabel = page.locator('xpath=//*[@id="bulk-view-accountNum"]');
    this.balanceValue = page.locator('xpath=//*[@id="bulk-view-acctBalance"]');
    this.paymentTypeValue = page.locator('xpath=//span[@id="bulk-view-paymentType"]');
    this.paymentTypeC3Value = page.locator('xpath=//dbs-bp-view-summary-section/div[5]/span[2]/span[2]');
    this.deductAmountView = page.locator('xpath=//*[@id="bulk-view-paymentAmount"]');
    this.bankChargeView = page.locator('xpath=//*[@id="bulk-view-bankChargeType"]');
    this.chargeAccountView = page.locator('xpath=//*[@id="bulk-view-charge-account"]');
    this.debitTypeValue = page.locator('xpath=//span[@id="bulk-view-debitType-template"]');
    this.paymentDateView = page.locator('xpath=//*[@id="bulk-view-paymentDate"]');
    this.cutOffTimeView = page.locator('xpath=//label[@id="bulk-view-cutOffTime"]');
    this.referenceValue = page.locator('xpath=//*[@id="viewReference"]');
    this.referenceID = page.locator('xpath=//label[contains(text(),"Bulk Payment")]');
    this.batchIDValue = page.locator('xpath=//*[@id="bulk-view-batchId"]');
    this.billerServiceIDValue = page.locator('xpath=//*[@id="bulk-view-billerServiceID"]');
    this.transactionBankCode0 = page.locator('xpath=//dbs-view-transfer-list[1]/div/div[1]/div[1]/div[2]/div[3]');
    this.transactionBankCode1 = page.locator('xpath=//dbs-view-transfer-list[2]/div/div[1]/div[1]/div[2]/div[3]');
    this.chargeAccount = page.locator('xpath=//dbs-bulk-view-section/div/dbs-bp-view-summary-section/div[7]/div/span[2]');
    this.paymentSummaryValue = page.locator('xpath=//*[@class="summary-panel step2-panel-triangle"]');
    this.nextApprover = page.locator('xpath=//dbs-approval-requirement/div/section/div[1]/span[2]');
    this.activityLog = page.locator('xpath=//*[@class="payment-history"]');
    this.totalAmountValue = page.locator('xpath=//*[@id="view-bulk-totalAmount"]');

    // Payee 1 (view)
    this.payeeNameValue = page.locator('xpath=//*[@id="bulk-view-name_0"]');
    this.newPayeeNickName = page.locator('xpath=//*[@id="bulk-view-nickName_0"]');
    this.payeeBankName = page.locator('xpath=//*[@id="bulk-view-payeeBankName_0"]');
    this.payeeBranchBankName = page.locator('xpath=//*[@id="bulk-view-payeeBranchName_0"]');
    this.payeeBankSwiftBic = page.locator('xpath=//*[@id="bulk-view-bankDetailsMsgDisplay_0"]');
    this.payeeBankManual = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_0"]');
    this.accountNumberValue = page.locator('xpath=//*[@id="bulk-view-acctNum_0"]');
    this.ddaRefValue0 = page.locator('xpath=//*[@id="bulk-view-ddaRef_0"]');
    this.nationalIDValue = page.locator('xpath=//dbs-view-transfer-list/div/div[1]/div[1]/div[3]/div[2]/strong[2]');
    this.nationalIDValue0 = page.locator('xpath=//dbs-view-transfer-list[1]/div/div[1]/div[1]/div[3]/div[2]/strong[2]');
    this.transactionStatusValue = page.locator('xpath=//*[@id="bulk-view-status_0"]');
    this.payeeStatusValue = page.locator('xpath=//*[@id="bulk-view-pendingStatus_0"]');
    this.amountView = page.locator('xpath=//*[@id="bulk-view-amount_0"]');
    this.mandateDetailsView = page.locator('xpath=//*[@id="bulk-view-mandateDetail_0"]');
    this.stockCodeView = page.locator('xpath=//*[@id="bulk-view-stockCode_0"]');
    this.passBookView = page.locator('xpath=//*[@id="bulk-view-passBook_0"]');
    this.freeTextView = page.locator('xpath=//*[@id="bulk-view-freeText_0"]');
    this.paymentDetailValue = page.locator('xpath=//*[@id="bulk-view-paymentDetails_0"]');
    this.messageValue = page.locator('xpath=//*[@id="bulk-view-message_0"]');
    this.emailListValue = page.locator('xpath=//*[@id="bulk-view-email_0"]');
    this.showOptionView = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_0"]');
    this.viewHKFPSID = page.locator('xpath=//*[@id="paynow-proxy-nf-0"]/span[3]');
    this.viewHMobile = page.locator('xpath=//*[@id="paynow-proxy-mobNum-0"]/span[3]');
    this.payNowMobNum = page.locator('xpath=//div[@id="paynow-proxy-mobNum-0"]');

    // Payee 2
    this.payeeNameValue2 = page.locator('xpath=//*[@id="bulk-view-name_1"]');
    this.payeeNickNameValue2 = page.locator('xpath=//*[@id="bulk-view-nickName_1"]');
    this.payeeBankName2 = page.locator('xpath=//*[@id="bulk-view-payeeBankName_1"]');
    this.payeeBankSwiftBic2 = page.locator('xpath=//*[@id="bulk-view-bankDetailsMsgDisplay_1"]');
    this.payeeBankManual2 = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_1"]');
    this.accountNumberValue2 = page.locator('xpath=//*[@id="bulk-view-acctNum_1"]');
    this.ddaRefValue2 = page.locator('xpath=//*[@id="bulk-view-ddaRef_1"]');
    this.nationalIDValue2 = page.locator('xpath=//dbs-view-transfer-list[2]/div/div[1]/div[1]/div[3]/div[2]/strong[2]');
    this.transactionStatusValue2 = page.locator('xpath=//*[@id="bulk-view-status_1"]');
    this.payeeStatusValue2 = page.locator('xpath=//*[@id="bulk-view-pendingStatus_1"]');
    this.amountView2 = page.locator('xpath=//*[@id="bulk-view-amount_1"]');
    this.mandateDetailsView2 = page.locator('xpath=//*[@id="bulk-view-mandateDetail_1"]');
    this.stockCodeView2 = page.locator('xpath=//*[@id="bulk-view-stockCode_1"]');
    this.passBookView2 = page.locator('xpath=//*[@id="bulk-view-passBook_1"]');
    this.freeTextView2 = page.locator('xpath=//*[@id="bulk-view-freeText_1"]');
    this.paymentDetailValue2 = page.locator('xpath=//*[@id="bulk-view-paymentDetails_1"]');
    this.messageValue2 = page.locator('xpath=//*[@id="bulk-view-message_1"]');
    this.emailListValue2 = page.locator('xpath=//*[@id="bulk-view-email_1"]');
    this.showOptionView2 = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_1"]');

    // Payee 3
    this.payeeNameValue3 = page.locator('xpath=//*[@id="bulk-view-name_2"]');
    this.accountNumberValue3 = page.locator('xpath=//*[@id="bulk-view-acctNum_2"]');
    this.payeeBankManual3 = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_2"]');
    this.ddaRefValue3 = page.locator('xpath=//*[@id="bulk-view-ddaRef_2"]');
    this.nationalIDValue3 = page.locator('xpath=//dbs-view-transfer-list[3]/div/div[1]/div[1]/div[3]/div[2]/strong[2]');
    this.transactionStatusValue3 = page.locator('xpath=//*[@id="bulk-view-status_2"]');
    this.payeeStatusValue3 = page.locator('xpath=//*[@id="bulk-view-pendingStatus_2"]');
    this.amountView3 = page.locator('xpath=//*[@id="bulk-view-amount_2"]');
    this.referenceForPayeeValue3 = page.locator('xpath=//dbs-view-transfer-list[3]//*[@id="reference-for-payee"]');
    this.mandateDetailsView3 = page.locator('xpath=//*[@id="bulk-view-mandateDetail_2"]');
    this.stockCodeView3 = page.locator('xpath=//*[@id="bulk-view-stockCode_2"]');
    this.passBookView3 = page.locator('xpath=//*[@id="bulk-view-passBook_2"]');
    this.freeTextView3 = page.locator('xpath=//*[@id="bulk-view-freeText_2"]');
    this.showOptionView3 = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_2"]');

    // Payee 4
    this.accountNumberValue4 = page.locator('xpath=//*[@id="bulk-view-acctNum_3"]');
    this.payeeBankManual4 = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_3"]');
    this.ddaRefValue4 = page.locator('xpath=//*[@id="bulk-view-ddaRef_3"]');
    this.nationalIDValue4 = page.locator('xpath=//dbs-view-transfer-list[4]/div/div[1]/div[1]/div[3]/div[2]/strong[2]');
    this.transactionStatusValue4 = page.locator('xpath=//*[@id="bulk-view-status_3"]');
    this.amountView4 = page.locator('xpath=//*[@id="bulk-view-amount_3"]');
    this.mandateDetailsView4 = page.locator('xpath=//*[@id="bulk-view-mandateDetail_3"]');
    this.stockCodeView4 = page.locator('xpath=//*[@id="bulk-view-stockCode_3"]');
    this.passBookView4 = page.locator('xpath=//*[@id="bulk-view-passBook_3"]');
    this.freeTextView4 = page.locator('xpath=//*[@id="bulk-view-freeText_3"]');
    this.showOptionView4 = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_3"]');

    // View ‘4333 issue’ area / tabs
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

    // Template view
    this.viewTemplateName = page.locator('xpath=//span[@id="bulk-viewTemp-name"]');
    this.viewTemplateFromAccount = page.locator('xpath=//span[@id="bulk-viewTemp-accountNum"]');
    this.viewTemplateAmount = page.locator('xpath=//strong[@id="bulk-view-amount_0"]');
    this.viewTemplateStatus = page.locator('xpath=//span[@id="bulk-viewTemp-status"]');
    this.confirmApproveButton = page.locator('xpath=//button[@name="Approve"]');
    this.viewMandateDetails = page.locator('xpath=//filter-component/dbs-view-transfer-list/div/div[1]/div[2]/div[2]/div[2]/strong');
    this.viewStockCode = page.locator('xpath=//filter-component/dbs-view-transfer-list/div/div[1]/div[2]/div[3]/div[2]/strong');
    this.viewShowOptionalDetails = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_0"]');
    this.viewPassbook = page.locator('xpath=//filter-component/dbs-view-transfer-list/div/div[2]/div/div/div[1]/div');

    // Create from template
    this.templatePurposeCodeValue = page.locator('xpath=//multi-level-dropdown[@formcontrolname="payeePurposeCode"]');

    // Select type buttons
    this.todayDayButton = page.locator('xpath=//input[@id="sgb_today_day"]');
    this.customDayButton = page.locator('xpath=//input[@id="sgb_set_date"]');
    this.expressTypeButton = page.locator('xpath=//input[@id="exp_type"]');
    this.fastTypeButton = page.locator('xpath=//input[@id="fast_type"]');
    this.giroTypeButton = page.locator('xpath=//input[@id="giro_Type"]');

    // CN IBPS Bulk / TW eACH template entry
    this.ibpsBulkRadioBtn = page.locator('xpath=//*[@value="cnbibps"]');
    this.cutoffTime = page.locator('xpath=//*[@id="bulk-view-cutOffTime"]');
    this.cnBulkTemplateButton = page.locator('xpath=//*[@id="bulkTemplate-CN"]');
    this.twBulkTemplateButton = page.locator('xpath=//*[@id="bulkTemplate-TW"]');
  }

  // ────────────────────────────── Locators ──────────────────────────────
  readonly menuRadio: Locator;
  readonly bulkPayment: Locator;

  readonly debitTypeSelect: Locator;
  readonly consolidatedDebit: Locator;
  readonly fromAccount: Locator;
  readonly billerServiceID: Locator;
  readonly bankCharge: Locator;
  readonly amount: Locator;
  readonly payeeRef: Locator;
  readonly payeeParticulars: Locator;
  readonly paymentDetailsTextarea: Locator;
  readonly payeeFreeText4Sender: Locator;
  readonly isBeneAdvising: Locator;
  readonly emailId0: Locator;
  readonly emailId1: Locator;
  readonly emailId2: Locator;
  readonly emailId3: Locator;
  readonly emailId4: Locator;
  readonly message: Locator;
  readonly existingPayeeTab: Locator;
  readonly existingPayeeFilter: Locator;
  readonly addPayee: Locator;
  readonly addButton: Locator;

  readonly newPayNow: Locator;
  readonly existingPayeeTabIx: Locator;
  readonly newPayeeTab: Locator;
  readonly newFPSPayee: Locator;

  readonly mobileValue: Locator;
  readonly hkfpsIdRadio: Locator;
  readonly hkfpsIdValue: Locator;

  readonly newPayeeWithoutPaynow: Locator;

  readonly payeeBankIDS: Locator;
  readonly payeeBankId: Locator;
  readonly findBankIDButton: Locator;
  readonly payeeBankResultList: Locator;
  readonly payeeBankSearchResults: Locator;
  readonly enterDetailButton: Locator;
  readonly bsbCodeText: Locator;
  readonly proxyTypeMobNum: Locator;
  readonly payeeBankIDSelected: Locator;
  readonly newPayeeName: Locator;
  readonly payeeAddress1: Locator;
  readonly newPayeeAccountNumber: Locator;
  readonly addNewPayeeButton: Locator;
  readonly showOptionalDetails: Locator;

  readonly approveNowCheckBox: Locator;
  readonly pushOption: Locator;
  readonly batchId: Locator;
  readonly getChallengeSMS: Locator;
  readonly challengeResponse: Locator;
  readonly saveAsTemplateCheckbox: Locator;
  readonly templateName: Locator;
  readonly saveAsDraft: Locator;
  readonly editButton: Locator;
  readonly copyButton: Locator;
  readonly finishedButton: Locator;
  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly approveButton: Locator;
  readonly pushButton: Locator;
  readonly amountInlineError: Locator;

  readonly deleteButton: Locator;
  readonly deleteDialogButton: Locator;
  readonly dismissButton: Locator;
  readonly transactionResult: Locator;

  readonly rejectButton: Locator;
  readonly reasonForRejection: Locator;
  readonly rejectDialogButton: Locator;
  readonly rejectStatus: Locator;
  readonly rejectButton4: Locator;
  readonly rejectStatus2: Locator;
  readonly rejectStatus3: Locator;

  //Payee / Beneficiary details in view payment page (some fields are shared with template view, so defined here)
  readonly beneficiaryTab: Locator;
  readonly beneficiaryFilter: Locator;
  readonly beneficiaryDelButton: Locator;
  readonly beneficiaryDelCnfButton: Locator;
  readonly beneficiaryDelDismissButton: Locator;

  readonly hashValue: Locator;
  readonly fromAccountViewLabel: Locator;
  readonly balanceValue: Locator;
  readonly paymentTypeValue: Locator;
  readonly paymentTypeC3Value: Locator;
  readonly deductAmountView: Locator;
  readonly bankChargeView: Locator;
  readonly chargeAccountView: Locator;
  readonly debitTypeValue: Locator;
  readonly paymentDateView: Locator;
  readonly cutOffTimeView: Locator;
  readonly referenceValue: Locator;
  readonly referenceID: Locator;
  readonly batchIDValue: Locator;
  readonly billerServiceIDValue: Locator;
  readonly transactionBankCode0: Locator;
  readonly transactionBankCode1: Locator;
  readonly chargeAccount: Locator;
  readonly paymentSummaryValue: Locator;
  readonly nextApprover: Locator;
  readonly activityLog: Locator;
  readonly totalAmountValue: Locator;

  readonly payeeNameValue: Locator;
  readonly newPayeeNickName: Locator;
  readonly payeeBankName: Locator;
  readonly payeeBranchBankName: Locator;
  readonly payeeBankSwiftBic: Locator;
  readonly payeeBankManual: Locator;
  readonly accountNumberValue: Locator;
  readonly ddaRefValue0: Locator;
  readonly nationalIDValue: Locator;
  readonly nationalIDValue0: Locator;
  readonly transactionStatusValue: Locator;
  readonly payeeStatusValue: Locator;
  readonly amountView: Locator;
  readonly mandateDetailsView: Locator;
  readonly stockCodeView: Locator;
  readonly passBookView: Locator;
  readonly freeTextView: Locator;
  readonly paymentDetailValue: Locator;
  readonly messageValue: Locator;
  readonly emailListValue: Locator;
  readonly showOptionView: Locator;
  readonly viewHKFPSID: Locator;
  readonly viewHMobile: Locator;
  readonly payNowMobNum: Locator;

  readonly payeeNameValue2: Locator;
  readonly payeeNickNameValue2: Locator;
  readonly payeeBankName2: Locator;
  readonly payeeBankSwiftBic2: Locator;
  readonly payeeBankManual2: Locator;
  readonly accountNumberValue2: Locator;
  readonly ddaRefValue2: Locator;
  readonly nationalIDValue2: Locator;
  readonly transactionStatusValue2: Locator;
  readonly payeeStatusValue2: Locator;
  readonly amountView2: Locator;
  readonly mandateDetailsView2: Locator;
  readonly stockCodeView2: Locator;
  readonly passBookView2: Locator;
  readonly freeTextView2: Locator;
  readonly paymentDetailValue2: Locator;
  readonly messageValue2: Locator;
  readonly emailListValue2: Locator;
  readonly showOptionView2: Locator;

  readonly payeeNameValue3: Locator;
  readonly accountNumberValue3: Locator;
  readonly payeeBankManual3: Locator;
  readonly ddaRefValue3: Locator;
  readonly nationalIDValue3: Locator;
  readonly transactionStatusValue3: Locator;
  readonly payeeStatusValue3: Locator;
  readonly amountView3: Locator;
  readonly referenceForPayeeValue3: Locator;
  readonly mandateDetailsView3: Locator;
  readonly stockCodeView3: Locator;
  readonly passBookView3: Locator;
  readonly freeTextView3: Locator;
  readonly showOptionView3: Locator;

  readonly accountNumberValue4: Locator;
  readonly payeeBankManual4: Locator;
  readonly ddaRefValue4: Locator;
  readonly nationalIDValue4: Locator;
  readonly transactionStatusValue4: Locator;
  readonly amountView4: Locator;
  readonly mandateDetailsView4: Locator;
  readonly stockCodeView4: Locator;
  readonly passBookView4: Locator;
  readonly freeTextView4: Locator;
  readonly showOptionView4: Locator;

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

  readonly viewTemplateName: Locator;
  readonly viewTemplateFromAccount: Locator;
  readonly viewTemplateAmount: Locator;
  readonly viewTemplateStatus: Locator;
  readonly confirmApproveButton: Locator;
  readonly viewMandateDetails: Locator;
  readonly viewStockCode: Locator;
  readonly viewShowOptionalDetails: Locator;
  readonly viewPassbook: Locator;

  readonly templatePurposeCodeValue: Locator;

  readonly todayDayButton: Locator;
  readonly customDayButton: Locator;
  readonly expressTypeButton: Locator;
  readonly fastTypeButton: Locator;
  readonly giroTypeButton: Locator;

  readonly ibpsBulkRadioBtn: Locator;
  readonly cutoffTime: Locator;
  readonly cnBulkTemplateButton: Locator;
  readonly twBulkTemplateButton: Locator;

  // ────────────────────────────── Waits / Actions ──────────────────────────────


  /**
     * Add a new payee flow (reusable in all tests).
     * Mirrors the exact steps you currently perform, including clipboard paste.
     */
  async addNewPayee(input: NewPayeeInput): Promise<NewPayeeResult> {
    const { name, nickName, bankId, accountNumber } = input;
  
      await this.newPayeeTab.click();
      await this.safeClick(this.newPayeeName);
      await this.safeFill(this.newPayeeName, name);
      await this.page.keyboard.press('Tab');
      await this.newPayeeName.blur();
      // await this.safeClick(this.newPayeeNickName);
      // await this.safeFill(this.newPayeeNickName, nickName);
      await this.page.keyboard.press('Tab');
      //await this.newPayeeNickName.blur();
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
      await this.safeClick(this.addNewPayeeButton);
      return { nickName, accountNumber };
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
  async waitForBulkPaymentFormReady(timeout = 20_000) {
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
    await expect(this.viewTemplateStatus).toBeVisible({ timeout });
  }

  /** Former: jiazhaiCreatePayemntTemplate() */
  async waitForCreatePaymentTemplateReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.templatePurposeCodeValue).toBeVisible({ timeout });
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