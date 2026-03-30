import { Page, Locator, expect } from '@playwright/test';

export class SchedulesPage {
  constructor(private readonly page: Page) {
    // Home / navigation
    this.searchHomeButton = page.locator('//input[@name="search"]');
    this.selectAffiliate = page.locator('//select[@name="selectAffiliate"]');
    this.submitAffiliate = page.locator('//input[@name="submit_affiliate"]');
    this.topOperationsLink = page.locator('//a[@title="Setup System Operations and Events"]');
    //this.topOperationsLink = page.locator('//a[text()="OPERATIONS" and @href="/samweb/csr/common/auditactivity/csr/reports"]');
    // Schedule navigation
    this.scheduleLink = page.locator('//a[contains(@href,"csr/common/schedule/bom/procSchdAdmin")]');
    //this.scheduleLink = page.locator('//a[text()="SCHEDULES" and @href="/samweb/csr/common/schedule/bom/procSchdAdmin"]');
    this.previewScheduleButton = page.locator('//input[@name="submit_prepreview"]');
    this.submitScheduleButton = page.locator('//input[@name="submit_submit"]');
    this.approveScheduleButton = page.locator('//*[@name="approve"]');

    // Weekly cutoff fields
    this.mondayTime = page.locator('//input[@name="subProcessValueObjects[0].monday_time"]');
    this.tuesdayTime = page.locator('//input[@name="subProcessValueObjects[0].tuesday_time"]');
    this.wednesdayTime = page.locator('//input[@name="subProcessValueObjects[0].wednesday_time"]');
    this.thursdayTime = page.locator('//input[@name="subProcessValueObjects[0].thursday_time"]');
    this.fridayTime = page.locator('//input[@name="subProcessValueObjects[0].friday_time"]');
    this.saturdayTime = page.locator('//input[@name="subProcessValueObjects[0].saturday_time"]');
    this.sundayTime = page.locator('//input[@name="subProcessValueObjects[0].sunday_time"]');
  }

  // ---------- Locators ----------
  readonly searchHomeButton: Locator;
  readonly selectAffiliate: Locator;
  readonly submitAffiliate: Locator;
  readonly topOperationsLink: Locator;
  readonly scheduleLink: Locator;
  readonly previewScheduleButton: Locator;
  readonly submitScheduleButton: Locator;
  readonly approveScheduleButton: Locator;

  readonly mondayTime: Locator;
  readonly tuesdayTime: Locator;
  readonly wednesdayTime: Locator;
  readonly thursdayTime: Locator;
  readonly fridayTime: Locator;
  readonly saturdayTime: Locator;
  readonly sundayTime: Locator;

  // ---------- Waits / Page Load ----------

  /**
   * Former: jiazhai()
   * Wait until the schedules home page is ready
   */
  async waitForSchedulesPageReady(timeout = 30_000) {
    await this.waitForUXLoading();
    await expect(this.searchHomeButton).toBeVisible({ timeout });
    await expect(this.searchHomeButton).toBeEnabled({ timeout });
  }

  // ---------- Business Methods ----------

  /**
   * Edit cutoff time for a given day
   *
   * @param affiliate Affiliate value
   * @param paymentTypeLink Payroll schedule link button
   * @param day 1–7 (Mon–Sun), 0 = Sunday (legacy behavior)
   * @param cutoffTime Cutoff time value (empty string = holiday)
   */
  async editCutOffTime(affiliate: string, paymentTypeLink: Locator, day: number, cutoffTime: string) {
    const weekFields = [
      this.mondayTime,
      this.tuesdayTime,
      this.wednesdayTime,
      this.thursdayTime,
      this.fridayTime,
      this.saturdayTime,
      this.sundayTime,
    ];

    
    await Promise.all([
      this.page.waitForURL('**/samweb/csr/home', { timeout: 30000 }),
      this.topOperationsLink.first().click(),
    ]);

    // 🔑 wait for Schedule to be attached AFTER navigation
    //await this.scheduleLink.waitFor({ state: 'attached', timeout: 30000 });

    const csrFrame = this.page.frameLocator('iframe[src*="samweb/csr"]');
    
    await expect(csrFrame).toBeTruthy();

    // Debug: verify correct page is loaded
    await expect(csrFrame!.locator('body')).toContainText('reports');

    
    await expect(
      csrFrame!.locator('a[href*="procSchdAdmin"]')
    ).toHaveCount(1);

    const scheduleLink = csrFrame!.getByRole('link', { name: /Schedule/i });
    await expect(scheduleLink).toBeVisible();
    await scheduleLink.click();

    console.log(
      await csrFrame!.locator('body').innerText()
    );

    /*const scheduleLink1 = csrFrame.locator(
      'a[href*="csr/common/schedule/bom/procSchdAdmin"]'
    );
    */

    await this.selectAffiliate.selectOption(affiliate);
    await this.safeClick(this.submitAffiliate);
    await this.safeClick(paymentTypeLink);

    const index = day === 0 ? 6 : day - 1;
    const field = weekFields[index];
    await field.fill('');
    if (cutoffTime) {
      await field.fill(cutoffTime);
    }
    await this.safeClick(this.previewScheduleButton);
    await this.safeClick(this.submitScheduleButton);
    await this.assertSAMSuccess();
  }

  /**
   * Approve cutoff schedule
   */
  async approveCutOffTime(affiliate: string, approveLink: Locator) {
    await this.waitForSchedulesPageReady();
    await (this.topOperationsLink).first().click();
    await this.scheduleLink.click();
    await this.selectAffiliate.selectOption(affiliate);
    await this.safeClick(this.submitAffiliate);
    await this.safeClick(approveLink);
    await this.safeClick(this.approveScheduleButton);
    await this.assertSAMSuccess();
  }

  // ---------- Common Helpers (Aligned with TransferCentersPage) ----------

  async safeClick(locator: Locator, timeout = 60_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
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

  /**
   * SAM success assertion placeholder
   * Replace selector if your success banner differs
   */
  async assertSAMSuccess(timeout = 20_000) {
    const successMessage = this.page.locator(
      '.alert-success, .success, .ant-message-success'
    );
    await expect(successMessage).toBeVisible({ timeout });
  }
}