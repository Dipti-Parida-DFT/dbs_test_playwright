// pages/AccountTransferPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class AccountTransferPage {
  constructor(private readonly page: Page) {
    // --- Header / Menus ---
    this.paymentMenu = page.locator('xpath=//*[@id="nav-item-navBBTopPaymentsLinkText"]');
    this.pagePoint = page.locator("xpath=//li[@class='page-point ng-star-inserted']");

    // Digi-token / auth
    this.digiToken = page.locator('xpath=//*[@id="mat-dialog-0"]/dbs-mars-auth-dialog/div/div[3]/button');
    this.enterCode = page.locator('xpath=//*[@id="mat-dialog-0"]/dbs-mars-auth-dialog/div/div[2]/ShuRu');
    this.authNow = page.locator('xpath=//*[@id="mat-dialog-0"]/dbs-mars-auth-dialog/div/div[3]/button');

    this.makePayment = page.locator('xpath=//*[@id="icon__make_payment"]');
    this.authDialog = page.locator('xpath=//div[contains(@class,"idealx-dialog__container") and contains(@class,"mars-sac-dialog")]');
    this.securityAccessCode = page.locator("xpath=//input[@placeholder='Enter security access code']");
    this.authenticateButton = page.locator("xpath=//*[contains(text(),'Authenticate')]");

    // Core fields (auto-complete / inputs / buttons)
    this.fromAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
    this.amount = page.locator('xpath=//input[@name="send-amount"]');
    this.existingPayee = page.locator('xpath=//p-auto-complete[@formcontrolname="payee"]');

    this.newPayeeTab = page.locator('xpath=//a[@id="ux-tab-NEW"]');
    this.newPayeeName = page.locator('xpath=//textarea[@name="new-payee-name"]');
    this.newPayeeAdd1 = page.locator('xpath=//input[@name="new-payee-add1"]');
    this.newPayeeAdd2 = page.locator('xpath=//input[@name="new-payee-add2"]');
    this.newPayeeAdd3 = page.locator('xpath=//ShuRu[@name="new-payee-add3"]');
    this.payeeBankRadio = page.locator('xpath=//ShuRu[@name="bankType-DBS"]');
    this.newPayeeAcctNumber = page.locator('xpath=//ShuRu[@name="new-payee-acct-number"]');
    this.newPayeeCountry = page.locator('xpath=//p-auto-complete[@formcontrolname="selectedCountry"]');
    this.paymentDetail = page.locator('xpath=//textarea[@name="paymentDetail"]');

    this.isBeneAdvising = page.locator('xpath=//ShuRu[@formcontrolname="isBeneAdvising"]');
    this.emailId0 = page.locator('xpath=//ShuRu[@name="email-id-0"]');
    this.emailId1 = page.locator('xpath=//ShuRu[@name="email-id-1"]');
    this.emailId2 = page.locator('xpath=//ShuRu[@name="email-id-2"]');
    this.emailId3 = page.locator('xpath=//ShuRu[@name="email-id-3"]');
    this.emailId4 = page.locator('xpath=//ShuRu[@name="email-id-4"]');

    this.faxTab = page.locator('xpath=//ng-component/dbs-act-step-4/div/dbs-payee-advising/div/div/div[2]/div[2]/tabs-component/ul/li[2]');
    this.faxAreaCode0 = page.locator('xpath=//ShuRu[@name="fax-area-code-0"]');
    this.faxCountryCode0 = page.locator('xpath=//p-auto-complete[@formcontrolname="ctryCode"]');
    this.faxNo0 = page.locator('xpath=//ShuRu[@name="fax-no-0"]');

    this.message = page.locator('xpath=//textarea[@name="adviceContent"]');
    this.isTransactionNote = page.locator('xpath=//ShuRu[@formcontrolname="isTransactionNote"]');
    this.transactionNote = page.locator('xpath=//textarea[@name="transactionNote"]');

    this.saveAsDraft = page.locator('xpath=//button[@name="save-as-draft"]');
    this.nextButton = page.locator('xpath=//button[@name="next"]');
    this.approvalNowCheckBox = page.locator('xpath=//ShuRu[@name="approveNow"]');
    this.getChallengeSMS = page.locator('xpath=//button[@name="get-challenge"]');
    this.challengeResponse = page.locator('xpath=//ShuRu[@name="responseCode"]');
    this.savaAsTemplateCheckBox = page.locator('xpath=//ShuRu[@name="saveAsTemplate"]');
    this.templateName = page.locator('xpath=//ShuRu[@name="templateName"]');
    this.submitButton = page.locator('xpath=//button[@name="submit"]');
    this.finishedButton = page.locator('xpath=//button[@name="finish"]');
    this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');
    this.payeeCode = page.locator('xpath=//p-auto-complete[@formcontrolname="payeeCode"]');

    this.useFxCheckBox = page.locator('xpath=//ShuRu[@id="useFX" and @type="checkbox"]');
    this.FXcontract0 = page.locator('xpath=//ShuRu[@id="fx-contract-0" and @type="checkbox"]');
    this.FXcontract0Amt = page.locator('xpath=//ShuRu[@name="fx-amount-0"]');
    this.FXcontract1 = page.locator('xpath=//ShuRu[@id="fx-contract-1" and @type="checkbox"]');

    this.paymentDate = page.locator('xpath=//dbs-calendar[@formcontrolname="paymentDate"]');
    this.outwardRemit = page.locator('xpath=//p-auto-complete[@formcontrolname="outwardRemit"]');
    this.purposeCode = page.locator('xpath=//multi-level-dropdown[@formcontrolname="purposeCode"]');
    this.subPurposeCode = page.locator('xpath=//multi-level-dropdown[@formcontrolname="subPurposeCode"]');
    this.Country = page.locator("xpath=//p-auto-complete[@formcontrolname='selectedCountry']");
    this.approveButton = page.locator('xpath=//button[@name="approve"]');

    this.pushBtnButton = page.locator('xpath=//button[@id="push-btn"]');
    this.pushOption = page.locator('xpath=//*[@class="push-option-label"]');

    this.SellCurrencyAmount = page.locator('xpath=//*[@id="foreignExchangeStep"]/div/div[1]/div[2]/fx-dol-list/div/ngx-datatable/div/datatable-header/div/div[2]/datatable-header-cell[5]/div/div');
    this.BuyCurrencyAmount = page.locator('xpath=//*[@id="foreignExchangeStep"]/div/div[1]/div[2]/fx-dol-list/div/ngx-datatable/div/datatable-header/div/div[2]/datatable-header-cell[6]/div/div');

    this.fxContract4 = page.locator('xpath=//dbs-foreign-exchange/div/div/div/div[2]/fx-dol-list/div/ngx-datatable/div/div/datatable-body/datatable-selection/datatable-scroller/datatable-row-wrapper[4]/datatable-body-row/div[2]/datatable-body-cell[1]/div/div/ShuRu');
    this.tipMessage = page.locator('xpath=//*[@id="foreignExchangeStep"]/div/div[1]/div[2]/fx-dol-list/div/div[2]');
    this.ViewFXrate = page.locator('xpath=//*[@id="foreignExchangeStep"]/div/div[2]/div[2]/dbs-fx-dol-book/div/div[5]/div[2]');
    this.Booknow = page.locator('xpath=//*[@id="foreignExchangeStep"]/div/div[2]/div[2]/dbs-fx-dol-book/div/div[4]/div/span[1]');
    this.Confirm = page.locator('xpath=//*[@id="mat-dialog-2"]/dbs-fx-dol-book-dialog/div/div[2]/div/button[2]');
    this.selectOption = page.locator('xpath=//p-auto-complete[@id="approverOption"]');

    this.complianceCodeErrorMsg = page.locator("xpath=//dbs-regulatory-advising-act/div/div/div[2]/div[1]/span[2]/span");
    this.underlyingCodeErrorMsg = page.locator("xpath=//dbs-regulatory-advising-act/div/div/div[2]/div[2]/span[2]/span");
    this.continueBtn = page.locator("xpath=//*[@id='cognitive-continue']");

    this.retreiveNameBtn = page.locator("xpath=//retrieved-account-name-hk/div/div[2]/button");
    this.createPageRetriveName = page.locator("xpath=//dbs-single-existing-payee/div/retrieved-account-name-hk/div/div[2]/p");
    this.createPageRetriveNameNewPayee = page.locator("xpath=//dbs-single-new-payee/div/div/retrieved-account-name-hk/div/div[2]/p");
    this.createPageRetrieveNameFailMsg = page.locator("xpath=//dbs-single-new-payee/div/div/retrieved-account-name-hk/div/div[2]/div/p");

    // Summary
    this.deductAmt = page.locator('xpath=//dbs-summary-section/div/p-sticky-panel/div[2]/div/div/div[3]/div');
    this.AmtToDeduct = page.locator('xpath=//dbs-summary-section/div/p-sticky-panel/div[2]/div/div/div[4]/div/div[3]');
    this.TotalAmtDeduct = page.locator('xpath=//dbs-summary-section/div/p-sticky-panel/div[2]/div/div/div[8]/div');

    // Transfer center
    this.tranferCenterFiler = page.locator('xpath=//*[@id="transferCenter-filter"]');
    this.refLink = page.locator('xpath=//*[@id="transaction-list-reference_0"]');

    // View ACT Payment Page
    this.headerRef = page.locator('xpath=//*[@id="act-view-customerReference"]');
    this.actStatusValue = page.locator('xpath=//*[@id="act-view-status"]');
    this.hashValue = page.locator('xpath=//*[@id="act-view-hashValue"]');
    this.deductAmountValue = page.locator('xpath=//*[@id="act-view-deductAmount"]');
    this.fromAccountValue = page.locator('xpath=//span[@id="act-view-accountNum"]');
    this.balanceValue = page.locator('xpath=//*[@id="view-act-acctBalance"]');
    this.toExistingPayeeAcctValue = page.locator('xpath=//*[@id="act-view-existingPayee-acctNum"]');
    this.toExistingPayeeNameValue = page.locator('xpath=//strong[@id="act-view-existingPayee-acctName"]');
    this.toNewPayeeAcctValue = page.locator('xpath=//*[@id="act-view-newPayee-acctNum"]');
    this.toNewPayeeNameValue = page.locator('xpath=//strong[@id="act-view-newPayee-acctName"]');
    this.payeeAdd1 = page.locator('xpath=//*[@id="act-view-payee-add1"]');
    this.payeeAdd2 = page.locator('xpath=//*[@id="act-view-payee-add2"]');
    this.payeeAdd3 = page.locator('xpath=//*[@id="act-view-payee-add3"]');
    this.paymentDateValue = page.locator('xpath=//span[@id="act-view-paymentDate"]');
    this.paymentType = page.locator('xpath=//*[@id="act-view-paymentType"]');
    this.amountValue = page.locator('xpath=//label[@id="act-view-sendAmount"]');
    this.contractRefValue = page.locator('xpath=//*[@id="fxDolViewSection"]/table/tbody/tr/td[1]');
    this.AmtToDeductValue = page.locator('xpath=//dbs-view-section-act/div/section[2]/div[2]/span[2]/dbs-fx-dol-view/div/table/tbody/tr[1]/td[4]/span');
    this.AmtToDeductValue1 = page.locator('xpath=//dbs-view-section-act/div/section[2]/div[2]/span[2]/dbs-fx-dol-view/div/table/tbody/tr[2]/td[4]/span');
    this.payeeBankName = page.locator('xpath=//*[@id="act-view-payee-bankName"]');
    this.payeeBrchName = page.locator('xpath=//*[@id="act-view-payee-brchName"]');
    this.payeeBankAdd1 = page.locator('xpath=//*[@id="act-view-payee-bankAdd1"]');
    this.payeeBankAdd2 = page.locator('xpath=//*[@id="act-view-payee-bankAdd2"]');
    this.payeeBankAdd3 = page.locator('xpath=//*[@id="act-view-payee-bankAdd3"]');
    this.payeeBankCity = page.locator('xpath=//*[@id="act-view-payee-bankCity"]');
    this.payeeBankCountry = page.locator('xpath=//*[@id="act-view-payee-bankCountry"]');
    this.payeeSwiftBic = page.locator('xpath=//*[@id="act-view-payee-swiftBic"]');
    this.payeeBankCode = page.locator('xpath=//*[@id="act-view-payee-bankCode"]');
    this.paymentDetailValue = page.locator('xpath=//*[@id="act-view-paymentDetail"]');
    this.messageValue = page.locator('xpath=//*[@id="act-view-adviceContent"]');
    this.emailList = page.locator('xpath=//*[@id="act-view-emailList"]');
    this.totalDeductValue = page.locator('xpath=//*[@id="act-view-deductTotalAmount"]');
    this.referenceValue = page.locator('xpath=//*[@id="act-view-custRef"]');
    this.messageToApproverValue = page.locator('xpath=//*[@id="act-view-transactionNote"]');
    this.purposeCodeView = page.locator('xpath=//*[@id="act-view-purposeCode"]');
    this.subPurposeCodeValueView = page.locator('xpath=//*[@id="act-view-subPurposeCode"]');
    this.complianceCodeValue = page.locator('xpath=//*[@id="act-view-regulatoryComplianceCode"]');
    this.underlyingCodeValue = page.locator('xpath=//*[@id="act-view-underlyingCode"]');
    this.payeeInfo = page.locator('xpath=//dbs-view-section-act/div/section[1]/div[5]/span[2]');
    this.baseOnExchangeRate = page.locator('xpath=//*[@id="fxDolViewSection"]');
    this.nextApprover = page.locator('xpath=//dbs-approval-requirement/div/section/div[1]/span[2]');
    this.activityLog = page.locator('xpath=//*[@class="payment-history"]');
    this.HighRisk = page.locator('xpath=//*[@class="alert-tag ng-star-inserted"]');
    this.alertMeaasge = page.locator('xpath=//div[@class="alert-msg"]');
    this.viewPageRetireveName = page.locator('xpath=//dbs-view-section-act/div/section[1]/div[5]/span[2]/strong');

    // Reject
    this.rejectButton = page.locator('xpath=//button[@name="reject"]');
    this.reasonForRejection = page.locator('xpath=//ShuRu[@name="reasonForRejection"]');
    this.rejectDialogButton = page.locator('xpath=//dbs-reject-dialog/div/div[2]/div[2]/button[2]');

    // Edit / Copy / Template
    this.editButton = page.locator('xpath=//*[@id="act-view-edit"]');
    this.copyButton = page.locator('xpath=//*[@name="copy"]');
    this.templateNameValue = page.locator('xpath=//*[@id="act-viewTemp-templateName"]');
    this.editTemplate = page.locator('xpath=//*[@id="act-viewTemp-edit"]');
    this.actTmpStatusValue = page.locator('xpath=//*[@id="act-viewTemp-status"]');

    // Delete
    this.deleteButton = page.locator('xpath=//button[@name="delete"]');
    this.deleteDialogButton = page.locator('xpath=//*[@id="dialogDelete"]');

    // Schedule link
    this.twACTScheduleLink = page.locator('xpath=//a[contains(@href,"/csr/common/schedule/bom") and text()="Taiwan Account Transfer"]');

    // Alert overlay
    this.proceedButton = page.locator('xpath=//button[@class="btn btn__tertiary"]');
    this.cancelButton = page.locator('xpath=//button[@class="btn btn__primary"]');

    // Push approve popup
    this.pushApprovePopUp = page.locator('xpath=//*[@class="mat-mdc-dialog-title mdc-dialog__title"]');
  }

  // ---------- Locators ----------
  readonly paymentMenu: Locator;
  readonly pagePoint: Locator;
  readonly digiToken: Locator;
  readonly enterCode: Locator;
  readonly authNow: Locator;
  readonly makePayment: Locator;
  readonly securityAccessCode: Locator;
  readonly authenticateButton: Locator;
  readonly authDialog: Locator;

  readonly fromAccount: Locator;
  readonly amount: Locator;
  readonly existingPayee: Locator;

  readonly newPayeeTab: Locator;
  readonly newPayeeName: Locator;
  readonly newPayeeAdd1: Locator;
  readonly newPayeeAdd2: Locator;
  readonly newPayeeAdd3: Locator;
  readonly payeeBankRadio: Locator;
  readonly newPayeeAcctNumber: Locator;
  readonly newPayeeCountry: Locator;
  readonly paymentDetail: Locator;

  readonly isBeneAdvising: Locator;
  readonly emailId0: Locator;
  readonly emailId1: Locator;
  readonly emailId2: Locator;
  readonly emailId3: Locator;
  readonly emailId4: Locator;

  readonly faxTab: Locator;
  readonly faxAreaCode0: Locator;
  readonly faxCountryCode0: Locator;
  readonly faxNo0: Locator;

  readonly message: Locator;
  readonly isTransactionNote: Locator;
  readonly transactionNote: Locator;

  readonly saveAsDraft: Locator;
  readonly nextButton: Locator;
  readonly approvalNowCheckBox: Locator;
  readonly getChallengeSMS: Locator;
  readonly challengeResponse: Locator;
  readonly savaAsTemplateCheckBox: Locator;
  readonly templateName: Locator;
  readonly submitButton: Locator;
  readonly finishedButton: Locator;
  readonly dismissButton: Locator;
  readonly payeeCode: Locator;

  readonly useFxCheckBox: Locator;
  readonly FXcontract0: Locator;
  readonly FXcontract0Amt: Locator;
  readonly FXcontract1: Locator;

  readonly paymentDate: Locator;
  readonly outwardRemit: Locator;
  readonly purposeCode: Locator;
  readonly subPurposeCode: Locator;
  readonly Country: Locator;
  readonly approveButton: Locator;

  readonly pushBtnButton: Locator;
  readonly pushOption: Locator;

  readonly SellCurrencyAmount: Locator;
  readonly BuyCurrencyAmount: Locator;
  readonly fxContract4: Locator;
  readonly tipMessage: Locator;
  readonly ViewFXrate: Locator;
  readonly Booknow: Locator;
  readonly Confirm: Locator;
  readonly selectOption: Locator;

  readonly complianceCodeErrorMsg: Locator;
  readonly underlyingCodeErrorMsg: Locator;
  readonly continueBtn: Locator;

  readonly retreiveNameBtn: Locator;
  readonly createPageRetriveName: Locator;
  readonly createPageRetriveNameNewPayee: Locator;
  readonly createPageRetrieveNameFailMsg: Locator;

  readonly deductAmt: Locator;
  readonly AmtToDeduct: Locator;
  readonly TotalAmtDeduct: Locator;

  readonly tranferCenterFiler: Locator;
  readonly refLink: Locator;

  // View ACT Payment Page locators
  readonly headerRef: Locator;
  readonly actStatusValue: Locator;
  readonly hashValue: Locator;
  readonly deductAmountValue: Locator;
  readonly fromAccountValue: Locator;
  readonly balanceValue: Locator;
  readonly toExistingPayeeAcctValue: Locator;
  readonly toExistingPayeeNameValue: Locator;
  readonly toNewPayeeAcctValue: Locator;
  readonly toNewPayeeNameValue: Locator;
  readonly payeeAdd1: Locator;
  readonly payeeAdd2: Locator;
  readonly payeeAdd3: Locator;
  readonly paymentDateValue: Locator;
  readonly paymentType: Locator;
  readonly amountValue: Locator;
  readonly contractRefValue: Locator;
  readonly AmtToDeductValue: Locator;
  readonly AmtToDeductValue1: Locator;
  readonly payeeBankName: Locator;
  readonly payeeBrchName: Locator;
  readonly payeeBankAdd1: Locator;
  readonly payeeBankAdd2: Locator;
  readonly payeeBankAdd3: Locator;
  readonly payeeBankCity: Locator;
  readonly payeeBankCountry: Locator;
  readonly payeeSwiftBic: Locator;
  readonly payeeBankCode: Locator;
  readonly paymentDetailValue: Locator;
  readonly messageValue: Locator;
  readonly emailList: Locator;
  readonly totalDeductValue: Locator;
  readonly referenceValue: Locator;
  readonly messageToApproverValue: Locator;
  readonly purposeCodeView: Locator;
  readonly subPurposeCodeValueView: Locator;
  readonly complianceCodeValue: Locator;
  readonly underlyingCodeValue: Locator;
  readonly payeeInfo: Locator;
  readonly baseOnExchangeRate: Locator;
  readonly nextApprover: Locator;
  readonly activityLog: Locator;
  readonly HighRisk: Locator;
  readonly alertMeaasge: Locator;
  readonly viewPageRetireveName: Locator;

  // Reject / Edit / Copy / Template / Delete / Schedule / Alert
  readonly rejectButton: Locator;
  readonly reasonForRejection: Locator;
  readonly rejectDialogButton: Locator;

  readonly editButton: Locator;
  readonly copyButton: Locator;
  readonly templateNameValue: Locator;
  readonly editTemplate: Locator;
  readonly actTmpStatusValue: Locator;

  readonly deleteButton: Locator;
  readonly deleteDialogButton: Locator;

  readonly twACTScheduleLink: Locator;

  readonly proceedButton: Locator;
  readonly cancelButton: Locator;

  readonly pushApprovePopUp: Locator;

  // ---------- Helper waits (Protractor -> Playwright equivalents) ----------



  //** wait for Authenticate dialogue if present */
  async handleAuthIfPresent(code = '1111') {
    
    const appears = await this.authDialog.waitFor({
      state: 'visible',
      timeout: 60000
    }).then(() => true).catch(() => false);
    //console.log('Authentication dialog appears:', appears);
    if (appears) {
      await this.securityAccessCode.fill(code);
      await this.authenticateButton.click();
      //console.log('Handled authentication dialog with code:', code);
      await this.authDialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }

  /** Wait until From Account widget is ready/clickable */
  async waitForAccountFormReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
    await expect(this.fromAccount).toBeEnabled({ timeout });
  }

  /** Transfer center ready */
  async waitForTransferCenterReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.tranferCenterFiler).toBeVisible({ timeout });
    await expect(this.tranferCenterFiler).toBeEnabled({ timeout });
  }

  /** Alert overlay visible */
  async waitForAlertOverlay(timeout = 15_000) {
    await expect(this.proceedButton).toBeVisible({ timeout });
  }

  /** Preview page ready */
  async waitForPreviewPage(timeout = 20_000) {
    await this.page.waitForLoadState('networkidle');
    await expect(this.submitButton).toBeVisible({ timeout });
    await expect(this.submitButton).toBeEnabled({ timeout });
  }

  /** Submitted page ready */
  async waitForSubmittedPage(timeout = 20_000) {
    await this.page.waitForLoadState('networkidle');
    await expect(this.finishedButton.or(this.dismissButton)).toBeVisible({ timeout });
  }

  /** View page ready */
  async waitForViewPage(timeout = 30_000) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.fromAccountValue).toBeVisible({ timeout });
    await expect(this.actStatusValue).toBeVisible({ timeout });
  }

  /** View MoPayment page (slower) */
  async waitForViewMoPaymentPage(timeout = 10_000) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.fromAccountValue).toBeVisible({ timeout });
  }

  /** Payments menu ready */
  async waitForMenu(timeout = 60000) {
    await this.waitForUXLoading();
    await expect(this.paymentMenu).toBeVisible({ timeout });
    await expect(this.paymentMenu).toBeEnabled({ timeout });
  }

  /** Create payment template page ready */
  async waitForCreatePaymentTemplate(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.existingPayee).toBeVisible({ timeout });
  }

  /** View payment template page ready */
  async waitForViewPaymentTemplate(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.actTmpStatusValue).toBeVisible({ timeout });
  }

  /** Approve-now popup ready */
  async waitForApproveNowPopUp(timeout = 20_000) {
    await expect(this.pushApprovePopUp).toBeVisible({ timeout });
  }

  /** Save-as-draft overlay ready */
  async waitForSaveAsDraft(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.dismissButton).toBeVisible({ timeout });
  }

  // ---------- Utilities ----------

  /**
   * Waits for common spinners/overlays to disappear, then network idle.
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
    await Promise.all(
      spinnerSelectors.map(async (sel) => {
        const loc = this.page.locator(sel);
        try {
          if (await loc.first().isVisible({ timeout: 500 }).catch(() => false)) {
            await loc.first().waitFor({ state: 'hidden', timeout: 15_000 });
          }
        } catch { /* ignore */ }
      }),
    );
    await this.page.waitForLoadState('networkidle');
  }

  /** Convenience: click after visible+enabled */
  async safeClick(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  /** Convenience: fill after visible */
  async safeFill(locator: Locator, value: string, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }
}