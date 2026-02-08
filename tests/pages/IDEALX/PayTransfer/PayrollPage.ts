// pages/PayrollPage.ts
import { Page, Locator, expect } from '@playwright/test';

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
    this.payeeRef = page.locator('xpath=//ShuRu[@name="payeeRef"]');
    this.payeeNationalId = page.locator('xpath=//ShuRu[@name="payeeNationalID"]');
    this.payeeMandateDetail = page.locator('xpath=//ShuRu[@name="payeeMandateDetail"]');
    this.payeeStockCode = page.locator('xpath=//ShuRu[@name="payeeStockCode"]');
    this.showOptionalDetails = page.locator('xpath=//*[@id="temp-bulk-create-optDetail_0"]');
    this.payeePassbook = page.locator('xpath=//ShuRu[@name="payeePassbook"]');
    this.payeeSenderFreeText = page.locator('xpath=//ShuRu[@name="payeeFreeText4Sender"]');
    this.paymentDetailsTextarea = page.locator('xpath=//textarea[@name="payeeDetails"]');
    this.beneficiaryAdvisingToggle = page.locator('xpath=//ShuRu[@name="isBeneAdvising0"]');
    this.emailId0 = page.locator('xpath=//ShuRu[@name="email-0"]');
    this.emailId1 = page.locator('xpath=//ShuRu[@name="email-1"]');
    this.emailId2 = page.locator('xpath=//ShuRu[@name="email-2"]');
    this.emailId3 = page.locator('xpath=//ShuRu[@name="email-3"]');
    this.emailId4 = page.locator('xpath=//ShuRu[@name="email-4"]');
    this.messageTextarea = page.locator('xpath=//*[@name="adviceContent"]');

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
    this.enterBankDetailsManuallyButton = page.locator('xpath=//div[starts-with(@class, "manual clearfix")]');
    this.bsbCode = page.locator('xpath=//ShuRu[@name="bp-swift-select-bsbCode"]');

    // Existing payee
    this.existingPayeeTab = page.locator('xpath=//*[@id="labelExistingPayee_0"]');
    this.existingPayeeFilter = page.locator('xpath=//ShuRu[@id="payee-selector"]');
    this.addExistingPayeeButton = page.locator('xpath=//button[@name="add"]');

    // Reject Page
    this.rejectButton = page.locator('xpath=//button[@name="reject"]');
    this.rejectionReason = page.locator('xpath=//ShuRu[@name="reasonForRejection"]');
    this.rejectConfirmButton = page.locator('xpath=//dbs-reject-dialog/div/div[2]/div[2]/button[2]');
    this.rejectStatusLabel = page.locator('xpath=//*[@id="bulk-view-rejectStatus_0"]');

    // Edit
    this.editButton = page.locator('xpath=//*[@id="bulk-view-edit"]');
    this.batchId = page.locator('xpath=//ShuRu[@name="batch-id"]');

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

    // View payroll Payment Page
    this.hashValueLabel = page.locator('xpath=//*[@id="bulk-view-hashValue"]');
    this.fromAccountViewLabel = page.locator('xpath=//*[@id="bulk-view-accountNum"]');
    this.balanceLabel = page.locator('xpath=//*[@id="bulk-view-acctBalance"]');
    this.paymentTypeLabel = page.locator('xpath=//*[@id="bulk-view-paymentType"]');

    this.paymentTypeDetailLabel = page.locator('xpath=//dbs-bp-view-summary-section/div[5]/span[2]/span[2]');
    this.amountViewLabel = page.locator('xpath=//*[@id="bulk-view-paymentAmount"]');
    this.bankChargeLabel = page.locator('xpath=//*[@id="bulk-view-bankChargeType"]');
    this.chargeAccountLabel = page.locator('xpath=//*[@id="bulk-view-charge-account"]');
    this.paymentDateLabel = page.locator('xpath=//*[@id="bulk-view-paymentDate"]');
    this.referenceLabel = page.locator('xpath=//*[@id="viewReference"]');
    this.batchIdLabel = page.locator('xpath=//*[@id="bulk-view-batchId"]');
    this.billerServiceIdLabel = page.locator('xpath=//*[@id="bulk-view-billerServiceID"]');
    this.paymentSummaryPanel = page.locator('xpath=//*[@class="summary-panel step2-panel-triangle"]');

    this.transactionStatusLabel1 = page.locator('xpath=//div[@id="bulk-view-status_0"]');
    this.transactionStatusLabel2 = page.locator('xpath=//div[@id="bulk-view-status_1"]');
    this.payeeNameLabel1 = page.locator('xpath=//*[@id="bulk-view-name_0"]');
    this.payeeNameLabel2 = page.locator('xpath=//*[@id="bulk-view-name_1"]');
    this.payeeNicknameLabel = page.locator('xpath=//*[@id="bulk-view-nickName_0"]');
    this.bankNameLabel1 = page.locator('xpath=//*[@id="bulk-view-payeeBankName_0"]');
    this.bankNameLabel2 = page.locator('xpath=//*[@id="bulk-view-payeeBankName_1"]');
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
    this.passbookLabel = page.locator('xpath=//*[@id="bulk-view-passBook_0"]');
    this.freeTextLabel = page.locator('xpath=//*[@id="bulk-view-freeText_0"]');

    this.nextApproverLabel = page.locator('xpath=//dbs-approval-requirement/div/section/div[1]/span[2]');
    this.activityLogSection = page.locator('xpath=//*[@class="payment-history"]');

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
  readonly beneficiaryAdvisingToggle: Locator;
  readonly emailId0: Locator;
  readonly emailId1: Locator;
  readonly emailId2: Locator;
  readonly emailId3: Locator;
  readonly emailId4: Locator;
  readonly messageTextarea: Locator;

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
  readonly balanceLabel: Locator;
  readonly paymentTypeLabel: Locator;

  readonly paymentTypeDetailLabel: Locator;
  readonly amountViewLabel: Locator;
  readonly bankChargeLabel: Locator;
  readonly chargeAccountLabel: Locator;
  readonly paymentDateLabel: Locator;
  readonly referenceLabel: Locator;
  readonly batchIdLabel: Locator;
  readonly billerServiceIdLabel: Locator;
  readonly paymentSummaryPanel: Locator;

  readonly transactionStatusLabel1: Locator;
  readonly transactionStatusLabel2: Locator;
  readonly payeeNameLabel1: Locator;
  readonly payeeNameLabel2: Locator;
  readonly payeeNicknameLabel: Locator;
  readonly bankNameLabel1: Locator;
  readonly bankNameLabel2: Locator;
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
  readonly passbookLabel: Locator;
  readonly freeTextLabel: Locator;

  readonly nextApproverLabel: Locator;
  readonly activityLogSection: Locator;

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
  }

  async safeFill(locator: Locator, value: string, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }
}