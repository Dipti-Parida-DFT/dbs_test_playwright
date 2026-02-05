// pages/TransferCentersPage.ts
import { Page, Locator, expect } from '@playwright/test';

const isSIT = (process.env.ENV?.toUpperCase() === 'SIT');

export class TransferCentersPage {
  constructor(private readonly page: Page) {
    // --- Core filters / list / actions ---
    this.transferCenterFilter = page.locator('xpath=//*[@id="transferCenter-filter"]');
    //this.referenceLink = page.locator("xpath=//button[@id='transaction-list-reference_0']");
    this.referenceLink = page.locator('xpath=//*[contains(@id, "transactionList")]'); // more flexible to handle pagination
    this.showAdditionalFilterButton = page.locator('xpath=//*[@id="transactionAdditionalFilter"]/label');
    this.paymentTypeAutoComplete = page.locator("xpath=//p-auto-complete[@formcontrolname='paymentType']");
    this.organisationListResult = page.locator("xpath=//advance-search-transaction/div/form/div/div[2]/div[2]/p-auto-complete/div/div[2]/ul/li[1]/div/span");
    this.organisationAutoComplete = page.locator("xpath=//p-auto-complete[@formcontrolname='organisation']");
    this.transactionStatusAutoComplete = page.locator("xpath=//p-auto-complete[@formcontrolname='status']");
    this.fileNameFilter = page.locator('xpath=//*[@name="transferCenter-fileName"]');
    this.paymentDateFrom = page.locator('xpath=//date-picker[@formcontrolname="paymentDateStart"]');
    this.paymentDateTo = page.locator('xpath=//date-picker[@formcontrolname="paymentDateEnd"]');
    this.payeeSortButton = page.locator('xpath=//div[@id="transfer-payee-title"]');
    this.searchButton = page.locator('xpath=//*[@name="search"]');
    this.groupApproveButton = page.locator('xpath=//*[@id="groupApprove"]');
    this.actionEditButton = page.locator('xpath=//*[@id="transferCenter-edit-0"]');
    this.actionMenuButton = page.locator('xpath=//*[@id="transferCenter-options-0"]');
    this.transactionResultLabel = page.locator('xpath=//p[@id="labelNoInformationDisplay"]');
    this.transactionStatusValue = page.locator('xpath=//*[@id="transaction-list-status_0"]');
    this.selectPaymentButton = page.locator('xpath=//*[@name="transferCenter-select-0"]');
    this.transactionDeleteButton = page.locator('xpath=//*[@id="transactionDelete"]');
    this.dialogDeleteConfirmButton = page.locator('xpath=//*[@id="dialogDelete"]');
    this.dismissButton = page.locator('xpath=//button[@name="dismiss"]');
    this.challengeResponseInput = page.locator("xpath=//ShuRu[@name='responseCode']");
    this.transactionStatusOption = page.locator('xpath=//dbs-advance-search-transaction/div/form/div/div[5]/div[2]/p-auto-complete/div/div[2]/ul/li/div/span');
    this.transactionList = page.locator('xpath=//*[@id="transactionList"]');
    this.firstPaymentSelectButton = page.locator('xpath=//*[@name="transferCenter-select-0"]');
    this.transactionCodeLabel = page.locator('xpath=//*[@id="transaction-code-label"]');
    this.debitTypeLabel = page.locator('xpath=//*[@id="bulk-view-debitType-template"]');
    this.pagePoint = page.locator("xpath=//li[@class='page-point ng-star-inserted']");
    this.highRiskFlag = page.locator('xpath=//div[@class="high-risk-payee-tip"]');

    // --- Groups / offline approval ---
    this.groupFilterInput = page.locator('xpath=//*[@id="byGroup-filter"]');
    this.groupReferenceLink = page.locator('xpath=//button[@id="group-list-reference_0"]');
    this.groupNameLink = page.locator('xpath=//button[@id="groupNameButton-0"]');
    this.createGroupButton = page.locator('xpath=//*[@id="createGroup"]');
    this.groupCreateConfirmButton = page.locator('xpath=//*[@id="groupCreate"]');
    this.cancelCreatePDFButton = page.locator('xpath=//*[@name="create-PDF-close"]');

    // --- View Group / Offline Approval ---
    this.groupStatusLabel = page.locator('xpath=//*[@id="group-view-status"]');
    this.groupApproveAllButton = page.locator('xpath=//*[@name="view-group-approveAll"]');
    this.groupRejectAllButton = page.locator('xpath=//*[@name="viewApprovalGroupRejectALL"]');
    this.groupRejectButton = page.locator('xpath=//*[@name="viewApprovalGroupReject"]');
    this.groupRemoveButton = page.locator('xpath=//*[@name="view-group-remove"]');
    this.removeDialogConfirmButton = page.locator('xpath=//*[@name="remove-txn-group-remove"]');
    this.viewGroupReferenceLink = page.locator('xpath=//*[@id="view-group-list-reference_0"]');
    this.viewGroupFilterInput = page.locator('xpath=//*[@id="byGroup-view-filter"]');
    this.viewGroupListStatus = page.locator('xpath=//*[@id="view-group-list-status_0"]');
    this.noInformationLabel = page.locator('xpath=//div[@id="No information to display"]');
    this.groupCancelButton = page.locator('xpath=//*[@name="view-group-cancel"]');
  }

  // ---------- Locators ----------
  readonly transferCenterFilter: Locator;
  readonly referenceLink: Locator;
  readonly showAdditionalFilterButton: Locator;
  readonly paymentTypeAutoComplete: Locator;
  readonly organisationListResult: Locator;
  readonly organisationAutoComplete: Locator;
  readonly transactionStatusAutoComplete: Locator;
  readonly fileNameFilter: Locator;
  readonly paymentDateFrom: Locator;
  readonly paymentDateTo: Locator;
  readonly payeeSortButton: Locator;
  readonly searchButton: Locator;
  readonly groupApproveButton: Locator;
  readonly actionEditButton: Locator;
  readonly actionMenuButton: Locator;
  readonly transactionResultLabel: Locator;
  readonly transactionStatusValue: Locator;
  readonly selectPaymentButton: Locator;
  readonly transactionDeleteButton: Locator;
  readonly dialogDeleteConfirmButton: Locator;
  readonly dismissButton: Locator;
  readonly challengeResponseInput: Locator;
  readonly transactionStatusOption: Locator;
  readonly transactionList: Locator;
  readonly firstPaymentSelectButton: Locator;
  readonly transactionCodeLabel: Locator;
  readonly debitTypeLabel: Locator;
  readonly pagePoint: Locator;
  readonly highRiskFlag: Locator;

  readonly groupFilterInput: Locator;
  readonly groupReferenceLink: Locator;
  readonly groupNameLink: Locator;
  readonly createGroupButton: Locator;
  readonly groupCreateConfirmButton: Locator;
  readonly cancelCreatePDFButton: Locator;

  readonly groupStatusLabel: Locator;
  readonly groupApproveAllButton: Locator;
  readonly groupRejectAllButton: Locator;
  readonly groupRejectButton: Locator;
  readonly groupRemoveButton: Locator;
  readonly removeDialogConfirmButton: Locator;
  readonly viewGroupReferenceLink: Locator;
  readonly viewGroupFilterInput: Locator;
  readonly viewGroupListStatus: Locator;
  readonly noInformationLabel: Locator;
  readonly groupCancelButton: Locator;

  // ---------- Waits / Helpers (Chinese → English) ----------

  /** Former: jiazhai() — wait until a key list item (reference link) is visible/clickable */
  async waitForTransferCenterReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.transferCenterFilter).toBeVisible({ timeout });
    //await expect(this.transferCenterFilter).toBeEnabled({ timeout });
  }

  /** Former: jiazhai2() — slower readiness (network + visibility) */
  async waitForTransferCenterReadySlow(timeout = 30_000) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.transferCenterFilter).toBeVisible({ timeout });
    //await expect(this.transferCenterFilter).toBeEnabled({ timeout });
  }

  /** Former: quyemianjiancha(reference) — filter by reference and open the first match */
  async searchAndOpenByReference(reference: string) {
    await this.waitForTransferCenterReady();
    await this.safeFill(this.transferCenterFilter, reference);
    await this.waitForTransferCenterReady();
    await this.safeClick(this.referenceLink);
  }

  /** Former: goToViewPaymentPageViaSearch(paymentType, transactionStatus) */
  async openViewPaymentViaSearch(paymentType: string, transactionStatus: string) {
    await this.waitForTransferCenterReady();
    await this.safeClick(this.showAdditionalFilterButton);

    if (paymentType && paymentType.trim()) {
      await this.selectFromAutoComplete(this.paymentTypeAutoComplete, paymentType);
    }
    if (transactionStatus && transactionStatus.trim()) {
      await this.scrollBy(0, 500);
      await this.selectFromAutoComplete(this.transactionStatusAutoComplete, transactionStatus);
    }

    await this.safeClick(this.searchButton);
    await this.waitForTransferCenterReady();
    await this.safeClick(this.referenceLink);
  }

  /** Former: jiazhaiforApprovalSection() */
  async waitForApprovalSectionReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.challengeResponseInput).toBeVisible({ timeout });
    // original had a fixed 5s delay for push response; keep a short wait if required by backend flow
    await this.page.waitForTimeout(5000);
  }

  /** Former: goToViewPaymentPageforPagination(reference, paymentType) */
  async openViewPaymentForPagination(reference: string, paymentType: string) {
    await this.waitForTransferCenterReady();
    await this.safeFill(this.transferCenterFilter, reference);

    if (await this.isVisible(this.referenceLink, 3000)) {
      await this.safeClick(this.referenceLink);
      return;
    }

    await this.safeClick(this.showAdditionalFilterButton);
    if (paymentType && paymentType.trim()) {
      await this.selectFromAutoComplete(this.paymentTypeAutoComplete, paymentType);
    }

    await this.page.waitForTimeout(500); // allow suggestions to settle
    await this.safeClick(this.searchButton);

    await this.waitForTransferCenterReady();
    await this.safeClick(this.payeeSortButton);
    await this.safeClick(this.referenceLink);
  }

  /** Former: getFirstCheckBox(items) → return first visible checkbox index, else -1 */
  async getFirstVisibleCheckboxIndex(items: number): Promise<number> {
    for (let index = 0; index < items; index++) {
      const locator = this.page.locator(`xpath=//ShuRu[@id="tc-checkbox-${index}"]`);
      if (await locator.isVisible({ timeout: 250 }).catch(() => false)) {
        return index;
      }
    }
    return -1;
  }

  /** Former: loadCreateGroupCondition() */
  async waitForCreateGroupReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.createGroupButton).toBeVisible({ timeout });
  }

  /** Former: loadViewGroupCondition() */
  async waitForViewGroupReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.groupCancelButton).toBeVisible({ timeout });
    await expect(this.groupStatusLabel).toBeVisible({ timeout });
  }

  /** Former: loadViewGroupCondition2() (slower) */
  async waitForViewGroupReadySlow(timeout = 30_000) {
    await this.waitForUXLoading();
    await this.page.waitForLoadState('networkidle');
    await expect(this.groupCancelButton).toBeVisible({ timeout });
    await expect(this.groupStatusLabel).toBeVisible({ timeout });
  }

  /** Former: jiazhaiGroupList() */
  async waitForGroupListReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.groupNameLink).toBeVisible({ timeout });
  }

  /** Former: loadOfflineGroup() */
  async waitForOfflineGroupReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.groupApproveButton).toBeVisible({ timeout });
    await this.waitForUXLoading();
  }

  /** Former: jiazhaiForDismiss() */
  async waitForDismissReady(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.dismissButton).toBeVisible({ timeout });
    await expect(this.dismissButton).toBeEnabled({ timeout });
  }

  /** Former: jiazhaiForUATSelectAccount() */
  async waitForUATSelectAccount() {
    if (!isSIT) {
      // keep a small grace period like original code
      await this.page.waitForTimeout(5000);
    }
  }

  // ---------- Utilities ----------

  /** Generic UX loading guard: wait for spinners/overlays to hide, then network idle */
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
        if (await spinner.isVisible({ timeout: 400 }).catch(() => false)) {
          await spinner.waitFor({ state: 'hidden', timeout: 15_000 });
        }
      } catch { /* ignore individual spinner errors */ }
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

  async isVisible(locator: Locator, timeout = 1000) {
    return await locator.isVisible({ timeout }).catch(() => false);
  }

  async scrollBy(dx: number, dy: number) {
    await this.page.evaluate(([x, y]) => window.scrollBy(x, y), [dx, dy]);
  }

  async scrollTo(x: number, y: number) {
    await this.page.evaluate(([tx, ty]) => window.scrollTo(tx, ty), [x, y]);
  }

  /**
   * Select a value in a custom <p-auto-complete>:
   *  - Click the root
   *  - Type the text
   *  - Press Enter OR click first suggestion if provided
   */
  private async selectFromAutoComplete(root: Locator, text: string) {
    await this.safeClick(root);
    await this.page.keyboard.type(text);
    // Try hitting Enter first; if that fails, click the first matching suggestion if present.
    await this.page.keyboard.press('Enter');
    // If still not applied, attempt to click a suggestion node used elsewhere
    const suggestion = this.organisationListResult.first();
    if (await suggestion.isVisible({ timeout: 500 }).catch(() => false)) {
      await suggestion.click();
    }
  }
}