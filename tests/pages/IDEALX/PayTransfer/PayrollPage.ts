// pages/PayrollPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { WebComponents } from '../../../lib/components';


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


export class PayrollPage {
  constructor(private readonly page: Page) {
    // --- Create Page / Entry points ---
    //this.payroll = page.locator('xpath=//*[@id="icon__payroll_payment"]');
    this.payroll = page.locator('xpath=//*[@id="icon__payroll_payment"]/parent::span');
    this.managePayroll = page.locator('xpath=//*[@id="icon__mgmt_payroll"]');
    this.managePayrollAlternate = page.locator('xpath=//*[@id="icon__mgmt_payroll_alternate"]');
    this.payrollAlternate = page.locator('xpath=//*[@id="icon__payroll_payment_alternate"]');
    this.vnPayrollIcon = page.locator('xpath=//*[@class="menu-item__icon icon icon__payroll_payment"]');

    // Core fields
    this.fromAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
    this.paymentPriorityRadioGroup = page.locator('xpath=//dbs-radio-group[@formcontrolname="transfer_priority_radio"]');
    this.billerServiceDropdown = page.locator('xpath=//multi-level-dropdown[@name="billerServiceID"]');
    this.amount = page.locator('xpath=//input[@name="payeeAmount"]');
    this.payeeParticulars = page.locator('xpath=//ShuRu[@name="payeeParticulars"]');
    this.payeeRef = page.locator('xpath=//input[@name="payeeRef"]');
    this.payeeNationalId = page.locator('xpath=//ShuRu[@name="payeeNationalID"]');
    this.payeeMandateDetail = page.locator('xpath=//ShuRu[@name="payeeMandateDetail"]');
    this.payeeStockCode = page.locator('xpath=//ShuRu[@name="payeeStockCode"]');
    this.showOptionalDetails = page.locator('xpath=//*[@id="temp-bulk-create-optDetail_0"]');
    this.payeePassbook = page.locator('xpath=//ShuRu[@name="payeePassbook"]');
    this.payeeSenderFreeText = page.locator('xpath=//ShuRu[@name="payeeFreeText4Sender"]');
    this.paymentDetailsTextarea = page.locator('xpath=//textarea[@name="payeeDetails"]');
    this.messageToThePayeeCheckBox = page.locator('xpath=//span[text()="5 notifications "]');
    this.internalReference = page.locator('xpath=//input[@name="batchReference"]');
    this.batchID = page.locator('xpath=//input[@name="batch-id"]');
    this.savePayeeCheckBox = page.locator('xpath=//input[@name="savePayee"]/following-sibling::label/div/span');
    this.beneficiaryAdvisingToggle = page.locator('xpath=//input[@name="isBeneAdvising0"]');
    this.emailId0 = page.locator('xpath=//input[@name="email-0"]');
    this.emailId1 = page.locator('xpath=//input[@name="email-1"]');
    this.emailId2 = page.locator('xpath=//input[@name="email-2"]');
    this.emailId3 = page.locator('xpath=//input[@name="email-3"]');
    this.emailId4 = page.locator('xpath=//input[@name="email-4"]');
    this.emailMessageTextarea = page.locator('xpath=//*[@name="adviceContent"]');
    this.earliestAvailableDateCheckbox = page.locator('xpath=//span[text()="Earliest Available Date "]');
    

    this.nextButton = page.locator('xpath=//button[@name="next"]');
    this.submitButton = page.locator('xpath=//button[@name="submit"]');
    this.approveButton = page.locator('xpath=//*[@name="approve"]');
    this.acceptAndApproveButton = page.locator('xpath=//button[@class="btn btn__primary ng-star-inserted"]');
    this.approveSubmitButton = page.locator('xpath=//*[@name="approve"]'); // same as approveButton
    this.toolbarApproveButton = page.locator('xpath=//ng-component/div/div/div/div/div[1]/button[4]');
    this.finishButton = page.locator('xpath=//button[@name="finish"]');
    this.copyButton = page.locator('xpath=//button[@name="copy"]');

    this.approveNowCheckbox = page.locator('xpath=//*[@id="approveNow"]');
    this.pushApprovalOption = page.locator('xpath=//*[@class="push-option-label"]');
    this.getChallengeTextButton = page.locator('xpath=//button[@name="get-challenge"]');
    this.getChallengeSMSButton = page.locator('xpath=//button[@name="get-challenge"]');
    this.challengeResponse = page.locator('xpath=//ShuRu[@name="responseCode"]');
    this.saveAsTemplateCheckbox = page.locator('xpath=//ShuRu[@name="saveAsTemplate"]');
    this.templateName = page.locator('xpath=//*[@name="templateName"]');
    this.saveAsDraftButton = page.locator('xpath=//button[@name="save-as-draft"]');

    this.amountInlineError = page.locator('xpath=//bp-payee-amount//span[starts-with(@class, "dbs-validation-error")]');
    this.deletePayeeButton = page.locator('xpath=//*[@id="delete_"]');
    this.newFPSPayeeOption = page.locator('xpath=//*[@id="labelNewPayee-panel"]/dbs-radio-group/div/dbs-radio[2]/div/label/div');
    this.hkFpsIdRadio = page.locator('xpath=//*[@id="labelNewPayee-panel"]/div/bulk-new-fps-payee/div/section/div/div[1]/span[2]/dbs-radio-group/div/dbs-radio[3]/div/label');
    this.hkFpsIdValue = page.locator('xpath=//*[@name="proxyTypeFasterIDShuRu"]');

    // New Payee
    this.newPayeeTab = page.locator('xpath=//*[@id="ux-tab-labelNewPayee"]');
    this.existingPayeeTabHeader = page.locator('xpath=//*[@id="ux-tab-labelExistingPayee"]');
    this.payNowTab = page.locator('xpath=//*[@id="ux-tab-labelPayNow"]');
    this.newPayeeName = page.locator('xpath=//*[@name="new-payee-payeeName"]');
    this.newPayeeNickName = page.locator('xpath=//input[@name="new-payee-nick-name"]');
    this.newPayeeAccountNumber = page.locator('xpath=//*[@name="new-payee-accountNumber"]');
    this.addNewPayeeButton = page.locator('xpath=//*[@name="add-payee"]');
    this.payeeBankId = page.locator('xpath=//*[@id="bulk-newPayee-bankId"]');
    this.findBankIDButton=page.locator('xpath=//*[@id="new-payee-bank-id-button"]');
    //this.payeeBankSearchResults = page.locator('xpath=//*[@class="search-result-container"]');
    this.payeeBankSearchResults = page.locator('xpath=//table[@class="swift-results ng-star-inserted"]');
    //this.payeeBankSearchResults = page.locator('xpath=//table[@class="swift-results ng-star-inserted"]/tr/td/label');
    this.enterBankDetailsManuallyButton = page.locator('xpath=//div[starts-with(@class, "manual clearfix")]');
    this.bsbCode = page.locator('xpath=//ShuRu[@name="bp-swift-select-bsbCode"]');

    // Existing payee
    this.existingPayeeTab = page.locator('xpath=//*[@id="labelExistingPayee_0"]');
    this.existingPayeeFilter = page.locator('xpath=//input[@id="payee-selector"]');
    this.addExistingPayeeButton = page.locator('xpath=//button[@name="add"]');

    // Reject Page
    this.rejectButton = page.locator('xpath=//button[@name="reject"]');
    this.rejectionReason = page.locator('xpath=//input[@name="reasonForRejection"]');
    this.rejectConfirmButton = page.locator('xpath=//dbs-reject-dialog/div/div[2]/div[2]/button[2]');
    this.rejectStatusLabel = page.locator('xpath=//*[@id="bulk-view-rejectStatus_0"]');

    // Edit
    this.editButton = page.locator('xpath=//*[@id="bulk-view-edit"]');
    this.batchId = page.locator('xpath=//input[@name="batch-id"]');

    // Delete
    this.deleteButton = page.locator('xpath=//button[@name="delete"]');
    this.deleteDialogConfirmButton = page.locator('xpath=//*[@id="dialogDelete"]');
    this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');

    // View payroll Template Page
    this.viewTemplateName = page.locator('xpath=//*[@id="bulk-viewTemp-name"]');
    this.viewTemplateStatus = page.locator('xpath=//*[@id="bulk-viewTemp-status"]');
    this.viewTemplateFromAccount = page.locator('xpath=//*[@id="bulk-viewTemp-accountNum"]');
    this.viewTemplateAmount = page.locator('xpath=//*[@id="bulk-view-amount_0"]');
    this.viewTemplatePayeeName = page.locator('xpath=//*[@id="bulk-view-name_0"]');

    //Payee / Beneficiary details in view payment page (some fields are shared with template view, so defined here)
    this.beneficiaryTab = page.locator('xpath=//span[normalize-space()="Payee / Beneficiaries"]');
    this.beneficiaryFilter= page.locator('xpath=//input[@id="approve-filter"]');
    this.beneficiaryDelButton= page.locator('xpath=//button[@name="payee-delete"]');
    this.beneficiaryDelCnfButton= page.locator('xpath=//button[@id="dialogDelete"]');
    this.beneficiaryDelDismissButton= page.locator('xpath=//button[@name="cancel"]');


    // View payroll Payment Page
    this.hashValueLabel = page.locator('xpath=//*[@id="bulk-view-hashValue"]');
    this.fromAccountViewLabel = page.locator('xpath=//*[@id="bulk-view-accountNum"]');
    this.fromAccountViewLabel2 = page.locator('xpath=//*[@id="bulk-view-accountName"]');
    this.balanceLabel = page.locator('xpath=//*[@id="bulk-view-acctBalance"]');
    this.paymentTypeLabel = page.locator('xpath=//*[@id="bulk-view-paymentType"]');
    this.paymentType = page.locator('xpath=//*[@id="bulk-view-paymentType"]');
    this.paymentDate = page.locator('xpath=//*[@id="bulk-view-paymentDate"]');
    
    this.paymentTypeDetailLabel = page.locator('xpath=//dbs-bp-view-summary-section/div[5]/span[2]/span[2]');
    this.amountViewLabel = page.locator('xpath=//*[@id="bulk-view-paymentAmount"]');
    this.bankChargeLabel = page.locator('xpath=//*[@id="bulk-view-bankChargeType"]');
    this.chargeAccountLabel = page.locator('xpath=//*[@id="bulk-view-charge-account"]');
    this.paymentDateLabel = page.locator('xpath=//*[@id="bulk-view-paymentDate"]');
    this.referenceLabel = page.locator('xpath=//*[@id="viewReference"]');
    this.referenceID = page.locator('xpath=//label[contains(text(),"Payroll Payment")]');
    this.batchIdLabel = page.locator('xpath=//*[@id="bulk-view-batchId"]');
    this.billerServiceIdLabel = page.locator('xpath=//*[@id="bulk-view-billerServiceID"]');
    this.paymentSummaryPanel = page.locator('xpath=//*[@class="summary-panel step2-panel-triangle"]');

    this.paymentSummaryLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[1]');
    this.totalPayeesLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[2]');
    this.totalPayeesValue = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[3]');
    this.totalAmountLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[4]');
    this.totalAmountValue = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[5]');

    this.transactionStatusLabel1 = page.locator('xpath=//div[@id="bulk-view-status_0"]');
    this.transactionStatusLabel2 = page.locator('xpath=//div[@id="bulk-view-status_1"]');
    this.payeeNameLabel1Value = page.locator('xpath=//*[@id="bulk-view-name_0"]');
    this.payeeNameLabel2 = page.locator('xpath=//*[@id="bulk-view-name_1"]');

    this.payeeNicknameLabelValue = page.locator('xpath=//*[@id="bulk-view-nickName_0"]');

    this.bankNameLabel1Value = page.locator('xpath=//*[@id="bulk-view-payeeBankName_0"]');
    this.bankNameLabel2Value = page.locator('xpath=//*[@id="bulk-view-payeeBankName_1"]');
    this.branchNameLabel = page.locator('xpath=//*[@id="bulk-view-payeeBranchName_0"]');

    this.bankSwiftBicLabel1 = page.locator('xpath=//*[@id="bulk-view-bankDetailsMsgDisplay_0"]');
    this.bankSwiftBicLabel2 = page.locator('xpath=//*[@id="bulk-view-bankDetailsMsgDisplay_1"]');
    this.nationalIdLabel = page.locator('xpath=//dbs-view-transfer-list/div/div[1]/div[1]/div[3]/div[2]/strong[2]');
    this.mandateDetailsLabel = page.locator('xpath=//*[@id="bulk-view-mandateDetail_0"]');
    this.stockCodeLabel = page.locator('xpath=//*[@id="bulk-view-stockCode_0"]');
    this.payeeBankManualLabel1 = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_0"]');
    this.payeeBankManualLabel2 = page.locator('xpath=//*[@id="bulk-view-payeeBankDetManual_1"]');

    this.accountNumberLabel1 = page.locator('xpath=//*[@id="bulk-view-acctNum_0"]');
    this.accountNumberLabel2 = page.locator('xpath=//*[@id="bulk-view-acctNum_1"]');

    this.status = page.locator('xpath=//*[@id="bulk-view-pendingStatus_0"]');
    
    this.viewPayrollFilter = page.locator('xpath=//*[@id="bulk-view-filter"]');
    this.amountFirstLabel = page.locator('xpath=//*[@id="bulk-view-amount_0"]');
    this.amountSecondLabel = page.locator('xpath=//*[@id="bulk-view-amount_1"]');
    this.transactionCodeLabel1 = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="transaction-code-label"]');
    this.transactionCodeLabel2 = page.locator('xpath=//dbs-view-transfer-list[2]//*[@id="transaction-code-label"]');
    this.purposeCodeLabel1 = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="purpose-code-label"]');
    this.purposeCodeLabel2 = page.locator('xpath=//dbs-view-transfer-list[2]//*[@id="purpose-code-label"]');
    this.referenceForPayeeLabel1 = page.locator('xpath=//dbs-view-transfer-list[1]//*[@id="reference-for-payee"]');
    this.referenceForPayeeLabel2 = page.locator('xpath=//dbs-view-transfer-list[2]//*[@id="reference-for-payee"]');
    this.particularsLabel1 = page.locator('xpath=//dbs-view-transfer-list[1]/div/div[1]/div[2]/div[4]/div[2]/strong');
    this.particularsLabel2 = page.locator('xpath=//dbs-view-transfer-list[2]/div/div[1]/div[2]/div[4]/div[2]/strong');
    this.showOptionalViewButton1 = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_0"]');
    this.showOptionalViewButton2 = page.locator('xpath=//*[@id="bulk-viewTemp-optDetail_1"]');
    this.paymentDetailLabel1 = page.locator('xpath=//*[@id="bulk-view-paymentDetails_0"]');
    this.paymentDetailLabel2 = page.locator('xpath=//*[@id="bulk-view-paymentDetails_1"]');
    this.messageLabel1 = page.locator('xpath=//*[@id="bulk-view-message_0"]');
    this.messageLabel2 = page.locator('xpath=//*[@id="bulk-view-message_1"]');
    this.emailListLabel1 = page.locator('xpath=//*[@id="bulk-view-email_0"]');
    this.emailListLabel2 = page.locator('xpath=//*[@id="bulk-view-email_1"]');

    this.emailListLabel1Value = page.locator('xpath=(//*[@id="bulk-view-email_0"]//span)[1]');
    this.emailListLabel2Value = page.locator('xpath=(//*[@id="bulk-view-email_0"]//span)[2]');
    this.emailListLabel3Value = page.locator('xpath=(//*[@id="bulk-view-email_0"]//span)[3]');
    this.emailListLabel4Value = page.locator('xpath=(//*[@id="bulk-view-email_0"]//span)[4]');
    this.emailListLabel5Value = page.locator('xpath=(//*[@id="bulk-view-email_0"]//span)[5]');

    this.passbookLabel = page.locator('xpath=//*[@id="bulk-view-passBook_0"]');
    this.freeTextLabel = page.locator('xpath=//*[@id="bulk-view-freeText_0"]');

    this.nextApproverLabel = page.locator('xpath=//dbs-approval-requirement/div/section/div[1]/span[2]');
    this.activityLogSection = page.locator('xpath=//*[@class="payment-history"]');

    this.deleteButonPayroll = page.locator('xpath=//button[@name="delete"]');
    this.deleteButonConfirmDeletePopup = page.locator('xpath=//button[@id="dialogDelete"]');
    this.transactionDeletedPopupLabel = page.locator('xpath=//h2[text()="Transaction deleted"]');
    this.transactionDeletedPopupLabelMsg = page.locator('xpath=//p[@id="dialogMessage"]/span');
    

    this.viewVerifyReleaseButton = page.locator('xpath=//button[@name="view-verify-release"]');
    this.verifyReleaseConfirmButton = page.locator('xpath=//button[@name="verify-release"]');
    this.toNewPayeeNameLabel = page.locator('xpath=//span[@id="bulk-view-name_0"]');

    this.viewEmailLabel = page.locator('xpath=//*[@id="paynow-proxy-nf-0"]/span[3]');
    this.viewHKFPSIdLabel = page.locator('xpath=//*[@id="paynow-proxy-nf-0"]/span[3]');
    this.viewMobileLabel = page.locator('xpath=//*[@id="paynow-proxy-mobNum-0"]/span[3]');

    // Create from template
    this.templatePurposeCodeDropdown = page.locator('xpath=//multi-level-dropdown[@formcontrolname="payeePurposeCode"]');
    this.templateTransactionCodeDropdown = page.locator('xpath=//multi-level-dropdown[@formcontrolname="transactionCode"]');

    // Tabs / pagination in view page
    this.viewAllTab = page.locator('xpath=//a[@id="ux-tab-1"]');
    this.viewPendingTab = page.locator('xpath=//a[@id="ux-tab-2"]');
    this.viewRejectedTab = page.locator('xpath=//a[@id="ux-tab-3"]');
    this.viewCompletedTab = page.locator('xpath=//a[@id="ux-tab-4"]');

    this.viewLoadedLabel = page.locator('xpath=//label[@id="view-bulk-loaded"]');
    this.viewLoadMoreLabel = page.locator('xpath=//label[@id="bulk-loaded-more"]');
    this.viewFirstTenButton = page.locator('xpath=//button[@name="view-up-to-0"] ');
    this.viewFirstHundredButton = page.locator('xpath=//button[@name="view-up-to-1"] ');
    this.viewPaginationButton = page.locator('xpath=//*[@id="pagination-1"]');
    this.viewRejectedCountLabel = page.locator('xpath=//span[@id="radio-label-0"]');
    this.viewBulkTotalItemLabel = page.locator('xpath=//span[@id="view-bulk-totalItem"]');
    //this.showOptionalDetails = page.locator('xpath=//span[@id="show-optional-details-0"]');

    // Links / schedules / search
    this.idPayrollScheduleLink = page.locator('xpath=//a[contains(@href,"/csr/common/schedule/bom") and text()="Indonesia Payroll"]');
    this.searchButton = page.locator('xpath=//*[@name="search"]');
    this.pendingModifyApprovalLink = page.locator('xpath=//a[contains(@href,"/csr/common/schedule/bom/procSchdApprove") and text()="Pending Modify Approval"]');

    this.exportCsvButton = page.locator('xpath=//*[@class="load-more-button"]');

    this.bewareDialog = page.locator('xpath=//*[@id="beware"]');
    this.confirmButton = page.locator('xpath=//*[@name="confirm"]');
  }

  // ---------- Locators (readonly) ----------
  readonly payroll: Locator;
  readonly managePayroll: Locator;
  readonly managePayrollAlternate: Locator;
  readonly payrollAlternate: Locator;
  readonly vnPayrollIcon: Locator;

  readonly fromAccount: Locator;
  readonly paymentPriorityRadioGroup: Locator;
  readonly billerServiceDropdown: Locator;
  readonly amount: Locator;
  readonly payeeParticulars: Locator;
  readonly payeeRef: Locator;
  readonly payeeNationalId: Locator;
  readonly payeeMandateDetail: Locator;
  readonly payeeStockCode: Locator;
  readonly showOptionalDetails: Locator;
  readonly payeePassbook: Locator;
  readonly payeeSenderFreeText: Locator;
  readonly paymentDetailsTextarea: Locator;
  readonly messageToThePayeeCheckBox: Locator;
  readonly internalReference: Locator;
  readonly batchID: Locator;
  readonly beneficiaryAdvisingToggle: Locator;
  readonly savePayeeCheckBox: Locator;
  readonly emailId0: Locator;
  readonly emailId1: Locator;
  readonly emailId2: Locator;
  readonly emailId3: Locator;
  readonly emailId4: Locator;
  readonly emailMessageTextarea: Locator;
  readonly earliestAvailableDateCheckbox: Locator;


  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly approveButton: Locator;
  readonly acceptAndApproveButton: Locator;
  readonly approveSubmitButton: Locator;
  readonly toolbarApproveButton: Locator;
  readonly finishButton: Locator;
  readonly copyButton: Locator;
  readonly approveNowCheckbox: Locator;
  readonly pushApprovalOption: Locator;
  readonly getChallengeTextButton: Locator;
  readonly getChallengeSMSButton: Locator;
  readonly challengeResponse: Locator;
  readonly saveAsTemplateCheckbox: Locator;
  readonly templateName: Locator;
  readonly saveAsDraftButton: Locator;
  readonly amountInlineError: Locator;
  readonly deletePayeeButton: Locator;
  readonly newFPSPayeeOption: Locator;
  readonly hkFpsIdRadio: Locator;
  readonly hkFpsIdValue: Locator;

  // New payee
  readonly newPayeeTab: Locator;
  readonly existingPayeeTabHeader: Locator;
  readonly payNowTab: Locator;
  readonly newPayeeName: Locator;
  readonly newPayeeNickName: Locator;
  readonly newPayeeAccountNumber: Locator;
  readonly addNewPayeeButton: Locator;
  readonly payeeBankId: Locator;
  readonly findBankIDButton: Locator;
  readonly payeeBankSearchResults: Locator;
  readonly enterBankDetailsManuallyButton: Locator;
  readonly bsbCode: Locator;

  // Existing payee
  readonly existingPayeeTab: Locator;
  readonly existingPayeeFilter: Locator;
  readonly addExistingPayeeButton: Locator;

  //Delete Payee
  readonly beneficiaryTab: Locator;
  readonly beneficiaryFilter: Locator;
  readonly beneficiaryDelButton: Locator;
  readonly beneficiaryDelCnfButton: Locator;
  readonly beneficiaryDelDismissButton: Locator;

  // Reject/edit/delete
  readonly rejectButton: Locator;
  readonly rejectionReason: Locator;
  readonly rejectConfirmButton: Locator;
  readonly rejectStatusLabel: Locator;
  readonly editButton: Locator;
  readonly batchId: Locator;
  readonly deleteButton: Locator;
  readonly deleteDialogConfirmButton: Locator;
  readonly dismissButton: Locator;

  // View template/payment
  readonly viewTemplateName: Locator;
  readonly viewTemplateStatus: Locator;
  readonly viewTemplateFromAccount: Locator;
  readonly viewTemplateAmount: Locator;
  readonly viewTemplatePayeeName: Locator;

  readonly hashValueLabel: Locator;
  readonly fromAccountViewLabel: Locator;
  readonly fromAccountViewLabel2: Locator;
  readonly balanceLabel: Locator;
  readonly paymentTypeLabel: Locator;
  readonly paymentType: Locator;
  readonly paymentDate: Locator;
  

  readonly paymentTypeDetailLabel: Locator;
  readonly amountViewLabel: Locator;
  readonly bankChargeLabel: Locator;
  readonly chargeAccountLabel: Locator;
  readonly paymentDateLabel: Locator;
  readonly referenceLabel: Locator;
  readonly referenceID: Locator;
  readonly batchIdLabel: Locator;
  readonly billerServiceIdLabel: Locator;
  readonly paymentSummaryPanel: Locator;
  
  readonly paymentSummaryLabel: Locator;
  readonly totalPayeesLabel: Locator;
  readonly totalPayeesValue: Locator;
  readonly totalAmountLabel: Locator;
  readonly totalAmountValue: Locator;

  readonly transactionStatusLabel1: Locator;
  readonly transactionStatusLabel2: Locator;
  readonly payeeNameLabel1Value: Locator;
  readonly payeeNameLabel2: Locator;
  readonly payeeNicknameLabelValue: Locator;
  readonly bankNameLabel1Value: Locator;
  readonly bankNameLabel2Value: Locator;
  readonly branchNameLabel: Locator;
  readonly bankSwiftBicLabel1: Locator;
  readonly bankSwiftBicLabel2: Locator;
  readonly nationalIdLabel: Locator;
  readonly mandateDetailsLabel: Locator;
  readonly stockCodeLabel: Locator;
  readonly payeeBankManualLabel1: Locator;
  readonly payeeBankManualLabel2: Locator;

  readonly accountNumberLabel1: Locator;
  readonly accountNumberLabel2: Locator;
  readonly viewPayrollFilter: Locator;
  readonly status: Locator;

  readonly amountFirstLabel: Locator;
  readonly amountSecondLabel: Locator;
  readonly transactionCodeLabel1: Locator;
  readonly transactionCodeLabel2: Locator;
  readonly purposeCodeLabel1: Locator;
  readonly purposeCodeLabel2: Locator;
  readonly referenceForPayeeLabel1: Locator;
  readonly referenceForPayeeLabel2: Locator;
  readonly particularsLabel1: Locator;
  readonly particularsLabel2: Locator;
  readonly showOptionalViewButton1: Locator;
  readonly showOptionalViewButton2: Locator;
  readonly paymentDetailLabel1: Locator;
  readonly paymentDetailLabel2: Locator;
  readonly messageLabel1: Locator;
  readonly messageLabel2: Locator;
  readonly emailListLabel1: Locator;
  readonly emailListLabel2: Locator;

  readonly emailListLabel1Value: Locator;
  readonly emailListLabel2Value: Locator;
  readonly emailListLabel3Value: Locator;
  readonly emailListLabel4Value: Locator;
  readonly emailListLabel5Value: Locator;
  
  readonly passbookLabel: Locator;
  readonly freeTextLabel: Locator;

  readonly nextApproverLabel: Locator;
  readonly activityLogSection: Locator;

  readonly deleteButonPayroll: Locator;
  readonly deleteButonConfirmDeletePopup: Locator;
  readonly transactionDeletedPopupLabel: Locator;
  readonly transactionDeletedPopupLabelMsg: Locator;
  
  readonly viewVerifyReleaseButton: Locator;
  readonly verifyReleaseConfirmButton: Locator;
  readonly toNewPayeeNameLabel: Locator;

  readonly viewEmailLabel: Locator;
  readonly viewHKFPSIdLabel: Locator;
  readonly viewMobileLabel: Locator;

  // From template selectors
  readonly templatePurposeCodeDropdown: Locator;
  readonly templateTransactionCodeDropdown: Locator;

  // Tabs/pagination
  readonly viewAllTab: Locator;
  readonly viewPendingTab: Locator;
  readonly viewRejectedTab: Locator;
  readonly viewCompletedTab: Locator;

  readonly viewLoadedLabel: Locator;
  readonly viewLoadMoreLabel: Locator;
  readonly viewFirstTenButton: Locator;
  readonly viewFirstHundredButton: Locator;
  readonly viewPaginationButton: Locator;
  readonly viewRejectedCountLabel: Locator;
  readonly viewBulkTotalItemLabel: Locator;
  

  // Links / search / export
  readonly idPayrollScheduleLink: Locator;
  readonly searchButton: Locator;
  readonly pendingModifyApprovalLink: Locator;
  readonly exportCsvButton: Locator;

  readonly bewareDialog: Locator;
  readonly confirmButton: Locator;

  // ---------- Helper waits (English names) ----------

   // create lib => components.ts object
   webComponents = new WebComponents();
  
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
    await this.safeClick(this.newPayeeNickName);
    await this.safeFill(this.newPayeeNickName, nickName);
    await this.page.keyboard.press('Tab');
    await this.newPayeeNickName.blur();
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


  /**
   * Author : LC5741501
   * Created Date: 17/02/2026
   * This Method "addNewPayeeWithDetails" : Add's a new payee with all details (reusable in all tests).
   */
async addNewPayeeWithAllDetails(input: NewPayeeInput): Promise<NewPayeeResult> {
  const { name, nickName, bankId, accountNumber } = input;

    // Click : New Payee Tab
    await this.newPayeeTab.click();

    // Enter : Payee Name
    await this.webComponents.enterTextarea(this.newPayeeName, name);
    await this.page.keyboard.press('Tab');
    await this.newPayeeName.blur();

    // Enter : Payee nickname
    await this.webComponents.enterTextarea(this.newPayeeNickName, nickName);
    await this.page.keyboard.press('Tab');
    await this.newPayeeNickName.blur();

    // Enter : Payee bank ID
    await this.webComponents.enterTextarea(this.payeeBankId, bankId);
    await this.page.keyboard.press('Enter');
    await this.payeeBankId.blur();
    await this.webComponents.clickWhenVisibleAndEnabled(this.findBankIDButton);
    await expect(this.payeeBankSearchResults.first()).toBeVisible({ timeout: 15000 });
    await this.payeeBankSearchResults.first().click();
    await this.webComponents.clickWhenVisibleAndEnabled(this.newPayeeAccountNumber);

    // Enter : Payee bank account number
    // Preserve your clipboard -> paste behavior
    await this.page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, accountNumber);

    await this.page.keyboard.press('Control+V');
    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Tab');
    await this.newPayeeAccountNumber.blur();

    //Click : Add Payee button
    await this.webComponents.clickWhenVisibleAndEnabled(this.addNewPayeeButton);
    return { nickName, accountNumber };
  }

  /**
   * Author : LC5741501
   * Created Date: 20/02/2026
   * @param testData : is a Json object
   * This method Enters Step 2: Payment to Amount and other opetional fields 
   */
  async enterNewPayeeAmountAndOptionalDetails(testData){

    // Step 2: Enter Amount (SGD) = add Amount
    await this.webComponents.enterTextarea(this.amount, testData.Payroll.amount);
    
    // Step 2: Payment from => Below steps for the (Step 2) optionals fields.

    // Enter Reference for payee
    await this.webComponents.enterTextarea(this.payeeRef, testData.Payroll.referenceForPayee);

    // Click Show optional details arrow
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionalDetails);
    

    // Enter Payment details to the payee bank
    await this.webComponents.enterTextarea(this.paymentDetailsTextarea, testData.Payroll.paymentDetails);

    // Click : "Message to the payee" checkbox
    await this.webComponents.clickWhenVisibleAndEnabled(this.messageToThePayeeCheckBox);
    
    // Enter : Emails 1
    await this.webComponents.enterTextarea(this.emailId0, testData.Payroll.emailId0);
    // Enter : Emails 2
    await this.webComponents.enterTextarea(this.emailId1, testData.Payroll.emailId1);
    // Enter : Emails 3
    await this.webComponents.enterTextarea(this.emailId2, testData.Payroll.emailId2);
    // Enter : Emails 4
    await this.webComponents.enterTextarea(this.emailId3, testData.Payroll.emailId3);
    // Enter : Emails 5
    await this.webComponents.enterTextarea(this.emailId4, testData.Payroll.emailId4);

    // Enter : Emails Mesage (Textarea)
    await this.webComponents.enterTextarea(this.emailMessageTextarea, testData.Payroll.emailMessage);

  }

  /**
   * Author : LC5741501
   * Created Date: 20/02/2026
   * @param testData : Contains Json value
   * This method enters the Step 4: Transaction references in Payroll page
   * for the fields Internal reference and Batch ID
   */
  async enterTransactionReferences(testData){

    //Step 4: Payment date : Enter Internal reference, Batch ID
    // Internal reference : add details
    await this.webComponents.enterTextarea(this.internalReference, testData.Payroll.internalReference);
    
    // Batch ID : add details
    await this.webComponents.enterText(this.batchID, testData.Payroll.batchID);

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

  /** Wait until the Payroll form controls (e.g., fromAccount) are ready */
  async waitForPayrollFormReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
    await expect(this.fromAccount).toBeEnabled({ timeout });
  }

  /** Wait until preview page is ready (submit visible/enabled) */
  async waitForPreviewPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.submitButton).toBeVisible({ timeout });
    await expect(this.submitButton).toBeEnabled({ timeout });
  }

  /** Wait until submitted page is ready (finish/done visible) */
  async waitForSubmittedPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.finishButton).toBeVisible({ timeout });
  }

  /** Wait until view payment page has loaded key labels */
  async waitForViewPaymentPageReady(timeout = 25_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccountViewLabel).toBeVisible({ timeout });
    await expect(this.amountViewLabel).toBeVisible({ timeout });
    await expect(this.hashValueLabel).toBeVisible({ timeout });
  }

  /** Wait until view template page is ready */
  async waitForViewTemplatePageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.viewTemplateStatus).toBeVisible({ timeout });
  }

  /** Wait until approve payment page shows approve button */
  async waitForApprovePaymentPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.approveButton).toBeVisible({ timeout });
  }

  /** Wait until a dismiss dialog shows its button */
  async waitForDismissDialogReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.dismissButton).toBeVisible({ timeout });
  }

  /** Wait until "Create from template" structure is ready */
  async waitForCreatePaymentTemplateReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.templatePurposeCodeDropdown).toBeVisible({ timeout });
    await this.waitForUXLoading();
  }

  /** Wait until TW-specific template controls are ready */
  async waitForCreateTWPaymentTemplateReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.templateTransactionCodeDropdown).toBeVisible({ timeout });
    await this.waitForUXLoading();
  }

  /** Wait until pagination controls in View page are ready */
  async waitForViewPaginationReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.showOptionalDetails).toBeVisible({ timeout });
  }

  // ---------- Behavior helpers ----------
  /** Add an existing payee by filter/search string */
  async addExistingPayee(filterText: string) {
    await this.safeFill(this.existingPayeeFilter, filterText);
    await this.safeClick(this.addExistingPayeeButton);
  }

  /** Switch bulk-view tab and assert "loaded" label text */
  async switchBulkViewTab(tabButton: Locator, expectedLoadedText: string) {
    await this.waitForViewPaginationReady();
    await this.safeClick(tabButton);
    await expect(this.viewLoadedLabel).toBeVisible();
    await expect(this.viewLoadedLabel).toContainText(expectedLoadedText);
    await expect(this.viewLoadMoreLabel).toBeVisible();
  }

  /** Validate pagination controls for "Show All" tab */
  async checkPaginationForShowAllTab() {
    await this.safeClick(this.viewAllTab);
    await expect(this.viewLoadedLabel).toBeHidden();
    await expect(this.viewFirstTenButton).toBeVisible();
    await expect(this.viewFirstHundredButton).toBeVisible();
    await expect(this.viewPaginationButton).toBeVisible();

    await this.safeClick(this.viewPaginationButton);
    await this.safeClick(this.viewFirstHundredButton);
  }

  /** Validate pagination visibility based on Rejected count */
  async checkPaginationForRejectTab() {
    await this.safeClick(this.viewRejectedTab);

    const text = (await this.viewRejectedCountLabel.textContent()) ?? '';
    const count = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;

    if (count > 10) {
      await expect(this.viewFirstTenButton).toBeVisible();
      await expect(this.viewFirstHundredButton).toBeVisible();
      await expect(this.viewPaginationButton).toBeVisible();
    } else {
      await expect(this.viewFirstTenButton).toBeHidden();
      // The original had the others commented out; keep parity
      // await expect(this.viewFirstHundredButton).toBeHidden();
      // await expect(this.viewPaginationButton).toBeHidden();
    }
  }

  // ---------- Utilities ----------
  /**
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

  async safeClick(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();

    /**
     * Author: LC5741501
     * This method waits for 15 seconds for the element
     * to be visible
     */
  }  
  
  async waitElementToBeVisible(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }



  async safeFill(locator: Locator, value: string, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }

  async enterTextareanew(locator: Locator, value: string, timeout = 15_000) {
    //await expect(locator).toBeVisible({ timeout });
    //await locator.fill(value);
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
    await expect(locator).toBeEditable();        // visible + enabled + not readonly
    await locator.fill(value);

  }

  /**
     * Author : LC5741501
     * This method validates the details of Expected
     * values(JSON) Vs Actual Selected Payee Or Reference No (from UI) 
     */
    async validatePayeeOrRefrenceNoDetailsOfPayroll(testData) {
      
      // Assertions
      // 1) Hash value : Auto generated hence checking only value lable is visible or not
      await expect(this.hashValueLabel).toBeVisible;
      
      // 2) From : Validate UI Vs Json
      await expect(this.fromAccountViewLabel).toContainText(testData.Payroll.fromAccount1);
      await expect(this.fromAccountViewLabel2).toContainText(testData.Payroll.fromAccount2);
      
      // 3) Payment Type : Validate UI Vs Json
      await expect(this.paymentType).toContainText(testData.Payroll.paymentType);
  
       // 4) Your account will be deducted : 
       await expect(this.paymentDate).toBeVisible;
  
      // 5) Internal reference : Validate UI Vs Json
      await expect(this.referenceLabel).toContainText(testData.Payroll.internalReference);
      
      // 6) Batch ID : Validate UI Vs Json
       await expect(this.batchIdLabel).toContainText(testData.Payroll.batchID);
  
      // 7) Your account will be deducted : 
      await expect(this.viewPayrollFilter).toBeVisible;
      
      // 8) Payment summary : Validate UI Vs Json (Payment summary Label)
      await expect(this.paymentSummaryLabel).toContainText(testData.Payroll.paymentSummaryLabel);
  
      // 9) Total Payees Label : Validate UI Vs Json
      await expect(this.totalPayeesLabel).toContainText(testData.Payroll.totalPayeesLabel);
      
      // 10) Total Payees Value : Validate UI Vs Json
      await expect(this.totalPayeesValue).toContainText(testData.Payroll.totalPayeesLabelValue);
      
      // 11) Total Amount Label : Validate UI Vs Json
      await expect(this.totalAmountLabel).toContainText(testData.Payroll.totalAmountLabel);
  
      // 12) Total Amount Value : Validate UI Vs Json
      await expect(this.totalAmountValue).toContainText(testData.Payroll.totalAmountLabelValue);
  
      // 13) Payee/Nickname : Validate (Payee Name) UI Vs Json
      await expect(this.payeeNameLabel1Value).toContainText(testData.Payroll.newPayeeName);
  
      // 14) Payee/Nickname : Validate (Nickname) UI Vs Json
      await expect(this.payeeNicknameLabelValue).toContainText(testData.Payroll.newPayeeNickName);
  
      // 15) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
      await expect(this.bankNameLabel1Value).toContainText(testData.Payroll.bankNameValue);
  
      // 16) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
      await expect(this.bankSwiftBicLabel1).toContainText(testData.Payroll.bankSwiftBicValue);
  
      // 17) Account number: Validate UI Vs Json
      await expect(this.accountNumberLabel1).toContainText(testData.Payroll.newPayeeAcctNumber);
  
      // 18) Status (PendingApproval) : Validate UI Vs Json
      await expect(this.status).toContainText(testData.status.PendingApproval);
      
      // 19) Amount (SGD): Validate UI Vs Json
      await expect(this.amountFirstLabel).toContainText(testData.Payroll.amount);
  
      // 20) Purpose Code (SALA - Salary Payment) : Validate UI Vs Json
      await expect(this.purposeCodeLabel1).toContainText(testData.Payroll.purposeCode);
  
      // 21) Reference for payee (optional): Validate UI Vs Json
      await expect(this.referenceForPayeeLabel1).toContainText(testData.Payroll.referenceForPayee);
  
      // 22) Reference for payee (optional): Validate UI Vs Json
      await expect(this.referenceForPayeeLabel1).toContainText(testData.Payroll.referenceForPayee);
      
      // Click : showOptionalViewButton1
      await this.safeClick(this.showOptionalViewButton1);
  
      // 23) Message to payee (optional): Validate UI Vs Json
      await expect(this.messageLabel1).toContainText(testData.Payroll.emailMessage);
      
      // 24)Emails 1 to 5 : Validate UI Vs Json
      await expect(this.emailListLabel1Value).toContainText(testData.Payroll.emailId0);
      await expect(this.emailListLabel2Value).toContainText(testData.Payroll.emailId1);
      await expect(this.emailListLabel3Value).toContainText(testData.Payroll.emailId2);
      await expect(this.emailListLabel4Value).toContainText(testData.Payroll.emailId3);
      await expect(this.emailListLabel5Value).toContainText(testData.Payroll.emailId4);
      
      // 25) Next approver : Visible
      await expect(this.nextApproverLabel).toBeVisible;
  
      // 25) Next approver : Visible
      await expect(this.activityLogSection).toBeVisible;
    
    }

    /**
       * Author : LC5741501
       * This method delete's the PayeeOrReference No
       */
      async deleteOpenPayeeOrReferenceNo(testData: { Payroll: { transactionDeleted: string | RegExp | readonly (string | RegExp)[]; internalReference: string | RegExp | readonly (string | RegExp)[]; }; }){
    
        // Click : Delete button
        await this.safeClick(this.deleteButonPayroll);
    
        // Click : Delete button (Confirm delete Popup)
        await this.safeClick(this.deleteButonConfirmDeletePopup);
    
        //Validate : Transaction Deleted Popup Label
        await this.waitElementToBeVisible(this.transactionDeletedPopupLabel);
        await expect(this.transactionDeletedPopupLabel).toContainText(testData.Payroll.transactionDeleted);
        
        // Validate : Refrence No is present in the deleted message
        await this.waitElementToBeVisible(this.transactionDeletedPopupLabelMsg);
        await expect(this.transactionDeletedPopupLabelMsg).toContainText(testData.Payroll.internalReference);
      }

}