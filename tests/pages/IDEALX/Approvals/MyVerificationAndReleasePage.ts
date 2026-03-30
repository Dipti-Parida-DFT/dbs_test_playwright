import { Page, Locator, expect } from '@playwright/test';

export class MyVerificationAndReleasePage {
  constructor(private readonly page: Page) {
    /* =======================
     * Navigation
     * ======================= */
    this.verifyMenu = page.locator('//a[contains(@href,"/approvals/verify")]');
    this.releaseMenu = page.locator('//a[contains(@href,"/approvals/release")]');

    /* =======================
     * By Transaction
     * ======================= */
    this.byTransactionTab = page.locator('//a[@id="ux-tab-byTransaction"]');
    this.transactionFilter = page.locator('//input[@name="approve-filter"]');
    this.transactionReferenceLink = page.locator('//button[@id="transaction-reference_0"]');
    this.transactionListResult = page.locator('//*[@id="transactionListResult"]');
    this.transactionMoreResults = page.locator('//*[@id="labelMoreResults"]');

    this.verifyTxnButton = page.locator('//*[@id="transactionVerify"]');
    this.releaseTxnButton = page.locator('//*[@id="transactionRelease"]');
    this.previewVerifyReleaseButton = page.locator('//button[@name="txn-preview-verify-release"]');

    /* =======================
     * By File
     * ======================= */
    this.byFileTab = page.locator('//a[@id="ux-tab-byFile"]');
    this.fileNameLink = page.locator('//button[@id="fileNameButton-0"]');
    this.fileFilterInput = page.locator('//input[@id="file-view-filter"]');

    this.verifyFileButton = page.locator('//button[@id="fileVerify"]');
    this.releaseFileButton = page.locator('//button[@id="fileRelease"]');
    this.previewFileButton = page.locator('//button[@name="preview-verify-release"]');

    this.fileListResult = page.locator('//*[@id="fileListResult"]');
    this.finishButton = page.locator('//button[@name="finish"]');
    this.dismissButton = page.locator('//button[@name="dismiss"]');

    /* =======================
     * By Group
     * ======================= */
    this.byGroupTab = page.locator('//a[contains(@href,"by-group")]');
    this.groupNameLink = page.locator('//button[@id="groupNameButton-0"]');
    this.verifyGroupButton = page.locator('//button[@id="groupVerify"]');
    this.releaseGroupButton = page.locator('//button[@id="groupRelease"]');
    this.previewGroupButton = page.locator('//button[@name="preview-verify-release"]');
  }

  /* =======================
   * Locators
   * ======================= */
  readonly verifyMenu: Locator;
  readonly releaseMenu: Locator;

  readonly byTransactionTab: Locator;
  readonly transactionFilter: Locator;
  readonly transactionReferenceLink: Locator;
  readonly transactionListResult: Locator;
  readonly transactionMoreResults: Locator;
  readonly verifyTxnButton: Locator;
  readonly releaseTxnButton: Locator;
  readonly previewVerifyReleaseButton: Locator;

  readonly byFileTab: Locator;
  readonly fileNameLink: Locator;
  readonly fileFilterInput: Locator;
  readonly verifyFileButton: Locator;
  readonly releaseFileButton: Locator;
  readonly previewFileButton: Locator;
  readonly fileListResult: Locator;

  readonly byGroupTab: Locator;
  readonly groupNameLink: Locator;
  readonly verifyGroupButton: Locator;
  readonly releaseGroupButton: Locator;
  readonly previewGroupButton: Locator;

  readonly finishButton: Locator;
  readonly dismissButton: Locator;

  /* =======================
   * Page readiness (Former jiazhai*)
   * ======================= */

  async waitForTransactionListReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.transactionReferenceLink).toBeVisible({ timeout });
  }

  async waitForVerifyByTransactionReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.verifyTxnButton).toBeVisible({ timeout });
    await expect(this.transactionReferenceLink).toBeVisible({ timeout });
  }

  async waitForReleaseByTransactionReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.releaseTxnButton).toBeVisible({ timeout });
    await expect(this.transactionReferenceLink).toBeVisible({ timeout });
  }

  async waitForVerifyByFileReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.verifyFileButton).toBeVisible({ timeout });
  }

  async waitForReleaseByFileReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.releaseFileButton).toBeVisible({ timeout });
  }

  async waitForByGroupReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.groupNameLink).toBeVisible({ timeout });
  }

  async waitForPreviewGroupReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.previewGroupButton).toBeVisible({ timeout });
  }

  async waitForDismissReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.dismissButton).toBeVisible({ timeout });
  }

  async waitForCompletedPageReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.finishButton).toBeVisible({ timeout });
  }

  /* =======================
   * Business flows
   * ======================= */

  async verifySingleTransaction(
    reference: string,
    paymentType: string
  ): Promise<string> {
    let verifyReference = '';

    await this.safeClick(this.verifyMenu);
    await this.waitForVerifyByTransactionReady();

    if (reference.trim()) {
      await this.safeFill(this.transactionFilter, reference);
    } else {
      await this.openByPaymentType(paymentType);
    }

    verifyReference =
      (await this.transactionReferenceLink.textContent())?.trim() ?? '';

    await this.safeClick(this.verifyTxnButton);
    await this.safeClick(this.previewVerifyReleaseButton);

    if (await this.hasSuccessMessage()) {
      await this.safeClick(this.finishButton);
      return verifyReference;
    }
    return '';
  }

  async releaseSingleTransaction(
    verifyReference: string,
    approvalReference: string,
    paymentType: string
  ): Promise<string> {
    let releaseReference = '';

    await this.safeClick(this.releaseMenu);
    await this.waitForReleaseByTransactionReady();

    if (verifyReference && approvalReference) {
      await this.safeFill(this.transactionFilter, approvalReference);
    } else {
      await this.openByPaymentType(paymentType);
    }

    releaseReference =
      (await this.transactionReferenceLink.textContent())?.trim() ?? '';

    await this.safeClick(this.releaseTxnButton);
    await this.safeClick(this.previewVerifyReleaseButton);

    if (await this.hasSuccessMessage()) {
      await this.safeClick(this.finishButton);
      return releaseReference;
    }
    return '';
  }

  /* =======================
   * Utilities
   * ======================= */

  private async openByPaymentType(paymentType: string) {
    await this.page.locator('//*[@id="transactionAdditionalFilter"]').click();
    await this.page
      .locator("//p-auto-complete[@formcontrolname='paymentTypeRec']")
      .fill(paymentType);
    await this.page.keyboard.press('Enter');
    await this.waitForTransactionListReady();
  }

  private async hasSuccessMessage(): Promise<boolean> {
    const success = this.page.locator(
      '.alert-success, .ant-message-success, .toast-success'
    );
    return success.isVisible({ timeout: 10_000 }).catch(() => false);
  }

  /* =======================
   * Common helpers (same as ApprovalPage)
   * ======================= */

  async safeClick(locator: Locator, timeout = 60_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  async safeFill(locator: Locator, value: string, timeout = 30_000) {
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
}