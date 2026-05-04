/**
 * IntraCompanyTransferPage — Playwright page object for ICT (Intra Company Transfer)
 * Migrated from Protractor IntraCompanyTransferPage.ts
 */
import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUT } from '../../../lib/timeouts';

export class IntraCompanyTransferPage {

  // --- Create page locators ---
  readonly ictMenu: Locator;
  readonly fromAccount: Locator;
  readonly toAccount: Locator;
  readonly amount: Locator;
  readonly paymentDate: Locator;
  readonly transactionNoteButton: Locator;
  readonly isTransactionNoteLabel: Locator;
  readonly isTransactionNoteCheckbox: Locator;
  readonly transactionNote: Locator;
  readonly nextButton: Locator;
  readonly processButton: Locator;
  readonly submitButton: Locator;
  readonly finishButton: Locator;
  readonly saveAsDraft: Locator;
  readonly approvalNowCheckBox: Locator;
  readonly approveNowLink: Locator;
  readonly pushOption: Locator;
  readonly approveButton: Locator;
  readonly getChallenge: Locator;
  readonly challengeResponse: Locator;
  readonly saveAsTemplateCheckbox: Locator;
  readonly templateName: Locator;
  readonly dismissButton: Locator;

  // --- Copy / Edit / Reject / Delete ---
  readonly copyButton: Locator;
  readonly editButton: Locator;
  readonly modifyNextButton: Locator;
  readonly rejectButton: Locator;
  readonly reasonForRejection: Locator;
  readonly rejectDialogButton: Locator;
  readonly deleteButton: Locator;
  readonly deleteDialogButton: Locator;

  // --- Autocomplete dropdown ---
  readonly autoCompleteListItem: Locator;

  // --- View ICT Payment / Template Page ---
  readonly fromAccountValue: Locator;
  readonly toAccountValue: Locator;
  readonly amountValue: Locator;
  readonly transactionStatusValue: Locator;
  readonly paymentDateValue: Locator;
  readonly deductAmountValue: Locator;
  readonly totalDeductValueNonDol: Locator;
  readonly hashValue: Locator;
  readonly referenceValue: Locator;
  readonly balanceValue: Locator;
  readonly paymentType: Locator;
  readonly messageToApproverValue: Locator;
  readonly nextApprover: Locator;
  readonly activityLog: Locator;

  // --- View ICT Template ---
  readonly viewTemplateName: Locator;
  readonly viewTemplateAmount: Locator;

  // --- Info message for reference capture ---
  readonly idealXInfoMsg: Locator;
  readonly dialogMessageLabel: Locator;

  constructor(private readonly page: Page) {
    // Create page
    this.ictMenu = page.locator('xpath=//*[@id="icon__internal_transfer"]');
    this.fromAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
    this.toAccount = page.locator('xpath=//p-auto-complete[@formcontrolname="toAccount"]');
    this.amount = page.locator('xpath=//*[@name="send-amount"]');
    this.paymentDate = page.locator('xpath=//dbs-calendar[@formcontrolname="paymentDate"]');
    this.transactionNoteButton = page.locator('input#isTransactionNote').or(page.locator('label[for="isTransactionNote"]'));
    this.isTransactionNoteLabel = page.locator('label[for="isTransactionNote"]');
    this.isTransactionNoteCheckbox = page.locator('input#isTransactionNote');
    this.transactionNote = page.locator('xpath=//textarea[@name="transactionNote"]');
    this.nextButton = page.locator('xpath=//button[@name="ict-next"]');
    this.processButton = page.locator('xpath=//button[@name="proceed"]');
    this.submitButton = page.locator('xpath=//button[@name="ict-preview-Submit"]');
    this.finishButton = page.locator('xpath=//button[@name="finish"]');
    this.saveAsDraft = page.locator('xpath=//button[@name="save-as-draft"]');
    this.approvalNowCheckBox = page.locator('input[name="approveNow"]');
    this.approveNowLink = page.getByText('Approve Now', { exact: false });
    this.pushOption = page.locator('xpath=//*[@class="push-option-label"]');
    this.approveButton = page.locator('xpath=//button[@name="approve"]');
    this.getChallenge = page.locator('xpath=//button[@name="get-challenge"]');
    this.challengeResponse = page.locator('input[name="responseCode"]');
    this.saveAsTemplateCheckbox = page.locator('input[name="saveAsTemplate"]');
    this.templateName = page.locator('input[name="templateName"]');
    this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');

    // Copy / Edit / Reject / Delete
    this.copyButton = page.locator('xpath=//button[@name="copy"]');
    this.editButton = page.locator('#ict-view-edit');
    this.modifyNextButton = page.locator('xpath=//button[@name="ict-modify-Next"]');
    this.rejectButton = page.locator('xpath=//button[@name="reject"]');
    this.reasonForRejection = page.locator('xpath=//input[@name="reasonForRejection"]');
    this.rejectDialogButton = page.locator('xpath=//dbs-reject-dialog/div/div[2]/div[2]/button[2]');
    this.deleteButton = page.locator('xpath=//button[@name="delete"]');
    this.deleteDialogButton = page.locator('#dialogDelete');
    this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');

    // Autocomplete dropdown
    this.autoCompleteListItem = page.locator('.ui-autocomplete-list-item');

    // View ICT Payment Page
    this.fromAccountValue = page.locator('#ict-view-accountNum');
    this.toAccountValue = page.locator('#ict-view-payeeNum');
    this.amountValue = page.locator('#ict-view-sendAmount');
    this.transactionStatusValue = page.locator('#ict-view-status');
    this.paymentDateValue = page.locator('#ict-view-paymentDate');
    this.deductAmountValue = page.locator('#ict-view-deductAmount');
    this.totalDeductValueNonDol = page.locator('#ict-view-deductAmount1');
    this.hashValue = page.locator('#ict-view-hashValue');
    this.referenceValue = page.locator('#ict-view-customerReference');
    this.balanceValue = page.locator('#view-ict-acctBalance');
    this.paymentType = page.locator('xpath=//*[contains(@class,"page-header")]');
    this.messageToApproverValue = page.locator('#ict-view-transactionNote');
    this.nextApprover = page.locator('xpath=//dbs-approval-requirement/div/section/div[1]/span[2]');
    this.activityLog = page.locator('xpath=//*[@class="payment-history"]');

    // View ICT Template
    this.viewTemplateName = page.locator('#ict-viewTemp-templateName');
    this.viewTemplateAmount = page.locator('#ict-view-temp-sendAmount');

    // Info message for reference capture
    this.idealXInfoMsg = page.locator('xpath=//dbs-top-panel/div/div[starts-with(@class, "alert alert-info")]/ul');
    this.dialogMessageLabel = page.locator('xpath=//p[@id="dialogMessage"]/span');
  }

  // ---------- Helper wait methods (Protractor → Playwright equivalents) ----------

  /** Wait until From Account widget is ready/clickable (jiazhai) */
  async waitForFormReady(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
  }

  /** Wait for copy readiness (jiazhaiForCopy) */
  async waitForCopyReady(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await expect(this.paymentDate).toBeVisible({ timeout });
    await expect(this.nextButton).toBeEnabled({ timeout });
  }

  /** Wait for edit readiness (jiazhaiForEdit) */
  async waitForEditReady(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await expect(this.paymentDate).toBeVisible({ timeout });
    await expect(this.modifyNextButton).toBeEnabled({ timeout });
  }

  /** Wait for preview/submit page ready (jiazhaiForPreviewPage) */
  async waitForPreviewPage(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await expect(this.submitButton).toBeVisible({ timeout });
    await expect(this.submitButton).toBeEnabled({ timeout });
  }

  /** Wait for submitted/finish page ready (jiazhaiForSubmittedPage) */
  async waitForSubmittedPage(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await expect(this.finishButton).toBeVisible({ timeout });
  }

  /** Wait for view ICT payment page (jiazhaiForViewICTPaymentPage) */
  async waitForViewPaymentPage(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.fromAccountValue).toBeVisible({ timeout });
    await expect(this.toAccountValue).toBeVisible({ timeout });
  }

  /** Wait for view ICT template page (jiazhaiForViewICTTemplatePage) */
  async waitForViewTemplatePage(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await expect(this.viewTemplateName).toBeVisible({ timeout });
  }

  /** Wait for create ICT from template page (jiazhaiForCreateICTFromTemplatePage) */
  async waitForCreateFromTemplatePage(timeout = TIMEOUT.MEDIUM) {
    await this.waitForUXLoading();
    await expect(this.amount).toBeVisible({ timeout });
    await expect(this.nextButton).toBeEnabled({ timeout });
  }

  // ---------- Utilities ----------

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
}
