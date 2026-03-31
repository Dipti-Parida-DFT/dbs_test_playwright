import { Page, Locator, expect } from '@playwright/test';

export class ApprovalPage {
  constructor(private readonly page: Page) {
    // --- Navigation ---
    this.approvalMenu = page.locator('//*[@id="nav-item-navBBTopMyApprovalsLinkText"]');

    // --- Transaction list / filters ---
    this.referenceFilter = page.locator('//*[@id="file-filter"]');
    this.transactionReferenceLink = page.locator('//*[@id="transaction-reference_0"]');
    this.showAdditionalFilter = page.locator('//*[@id="transactionAdditionalFilter"]');
    this.paymentTypeList = page.locator(
      "//p-auto-complete[@formcontrolname='paymentTypeRec']"
    );
    this.paymentTypeListInput = this.paymentTypeList.locator('input');
    this.byTransactionFilter = page.locator('//input[@id="byTXN-filter"]');
    this.transactionList = page.locator('//datatable-scroller');
    this.transactionChkBox = page.locator('input[type="checkbox"][id^="txn-select-"]');
    this.IDPayrollOption = page.locator('//span[contains(@class,"ui-autocomplete-list-item-label") and normalize-space()="ID - Payroll"]');

    // --- Approval actions ---
    this.approveButton = page.locator('//*[@name="approve"]');
    this.reviewApproveButton = page.locator('//*[@id="transactionApprove"]');
    this.pushApproveButton = page.locator('//button[@id="push-btn"]');
    this.searchButton = page.locator('xpath=//*[@name="search"]');
    this.approveDismissButton = page.locator('xpath=//button[@name="dismiss"]');

    // --- Challenge / OTP ---
    this.getChallengeButton = page.locator('//button[@name="get-challenge"]');
    this.challengeResponseInput = page.locator("//input[@name='responseCode']");
    this.confirmApproveButton = page.locator('//button[@class="btn btn__primary"]');

    // --- Completion ---
    this.finishButton = page.locator('//button[@name="finish"]');
    this.doneButton = page.locator('//button[@name="finish"]');

    // --- Lists ---
    this.transactionListResult = page.locator('//*[@id="transactionListResult"]');
    this.moreResultsLabel = page.locator('//*[@id="labelMoreResults"]');
    this.noInformationLabel = page.locator('//*[@id="No information to display"]');

    // --- File approval ---
    this.byFileButton = page.locator('//a[contains(@href,"by-file")]');
    this.byFileFileNameLink = page.locator('//button[@id="fileNameButton-0"]');
    this.viewFileApproveAllButton = page.locator('//button[@name="view-file-approveAll"]');

    // --- Group approval ---
    this.byGroupButton = page.locator('//a[contains(@href,"by-group")]');
    this.groupApproveButton = page.locator('//button[@id="groupApprove"]');
    this.groupNameLink = page.locator('//button[@id="groupNameButton-0"]');
  }

  // ---------- Locators ----------
  readonly approvalMenu: Locator;

  readonly referenceFilter: Locator;
  readonly transactionReferenceLink: Locator;
  readonly showAdditionalFilter: Locator;
  readonly paymentTypeList: Locator;
  readonly paymentTypeListInput: Locator;
  readonly byTransactionFilter: Locator;
  readonly transactionList: Locator;
  readonly transactionChkBox: Locator;
  readonly IDPayrollOption: Locator;


  readonly approveButton: Locator;
  readonly reviewApproveButton: Locator;
  readonly pushApproveButton: Locator;
  readonly searchButton: Locator;
  readonly approveDismissButton: Locator;

  readonly getChallengeButton: Locator;
  readonly challengeResponseInput: Locator;
  readonly confirmApproveButton: Locator;

  readonly finishButton: Locator;
  readonly doneButton: Locator;

  readonly transactionListResult: Locator;
  readonly moreResultsLabel: Locator;
  readonly noInformationLabel: Locator;

  readonly byFileButton: Locator;
  readonly byFileFileNameLink: Locator;
  readonly viewFileApproveAllButton: Locator;

  readonly byGroupButton: Locator;
  readonly groupApproveButton: Locator;
  readonly groupNameLink: Locator;

  // ---------- Waits / Page Ready ----------

  /** Former: jiazhai() */
  async waitForApprovalPageReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.showAdditionalFilter).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForReview() */
  async waitForReviewPageReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.reviewApproveButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForByFile() */
  async waitForByFileListReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.byFileFileNameLink).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForByGroup() */
  async waitForGroupApprovalReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.groupApproveButton).toBeVisible({ timeout });
    await expect(this.groupNameLink).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForCompletedPage() */
  async waitForCompletedPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.finishButton).toBeVisible({ timeout });
  }

  /** Former: jiazhaiForSuccessPage() */
  async waitForSuccessPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.doneButton).toBeVisible({ timeout });
  }

  // ---------- Business Methods ----------

  async openApprovalByReference(reference: string) {
    await this.waitForApprovalPageReady();
    await this.safeFill(this.referenceFilter, reference);
    await this.waitForApprovalPageReady();
    await this.safeClick(this.transactionReferenceLink);
  }

  async openApprovalBySearch(paymentType?: string) {
    await this.waitForApprovalPageReady();
    await this.safeClick(this.showAdditionalFilter);

    if (paymentType) {
      await this.selectFromAutoComplete(
        this.paymentTypeList,
        paymentType
      );
    }

    await this.waitForApprovalPageReady();
    await this.safeClick(this.transactionReferenceLink);
  }

  async approveWithOTP(otp: string) {
    await this.safeClick(this.pushApproveButton);
    await this.safeClick(this.getChallengeButton);
    await this.safeFill(this.challengeResponseInput, otp);
    await this.safeClick(this.confirmApproveButton);
  }

  async getApprovedTransactionReferences(items: number): Promise<string[]> {
    const refs: string[] = [];
    for (let i = 0; i < items; i++) {
      const ref = await this.page
        .locator(`//p[@id="complete-transaction-reference-${i}"]`)
        .textContent();
      if (ref) {
        refs.push(ref.trim());
      }
    }
    return refs;
  }

  // ---------- Common Helpers (Aligned with Other Pages) ----------

  async safeClick(locator: Locator, timeout = 60_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  async safeFill(locator: Locator, value: string, timeout = 35_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }

  async waitForUXLoading(extraSelectors: string[] = []) {
    const spinners = [
      '.ux-loading',
      '.loading',
      '.spinner',
      '.cdk-overlay-backdrop',
      ...extraSelectors,
    ];

    for (const selector of spinners) {
      const spinner = this.page.locator(selector).first();
      if (await spinner.isVisible({ timeout: 1000 }).catch(() => false)) {
        await spinner.waitFor({ state: 'hidden', timeout: 180_000 });
      }
    }

    await this.page.waitForLoadState('networkidle');
  }

  private async selectFromAutoComplete(root: Locator, text: string) {
    await this.safeClick(root);
    await this.page.keyboard.type(text);
    await this.page.keyboard.press('Enter');
  }
}
``