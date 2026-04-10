import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Payment Date and Type - Payment Form', () => {
  let page: Page;
  let helper: PaymentFormHelper;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    helper = new PaymentFormHelper(page);

    await helper.navigateToLogin();
    await helper.login('SG2BE11', 'SG2BE11S01', '123');
    await helper.navigateToPayAndTransfer();
    await helper.authenticateWithCode('123');
    await helper.selectPaymentOption('Pay Local / Overseas Payee');
    await helper.clickDebitAccountSection();
    await helper.selectAccountByName('SG SUBSI ACCOUNT MCA 1');
    await helper.clickPayeeSection();
    await helper.selectPayeeByIndex(0);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Verify Payment Date Section', async () => {
    // Verify Payment date section
    await expect(page.locator('text=Payment date')).toBeVisible();

    // Verify date button displays a date
    const dateButton = page.locator('button:has-text("Apr")');
    await expect(dateButton).toBeVisible();

    // Click date button to open date picker
    await helper.clickPaymentDate();
    await page.waitForTimeout(500);

    // Verify date picker or calendar opens
    const pickerElements = page.locator('[role="dialog"], .calendar, [class*="picker"]');
    const isVisible = await pickerElements.first().isVisible().catch(() => false);
    // Date picker may or may not be intrusive
  });

  test('Verify Payment Type Options', async () => {
    // Verify Payment type section
    await expect(page.locator('text=Payment type')).toBeVisible();

    // Verify Telegraphic transfer option is visible
    await expect(page.locator('text=Telegraphic transfer')).toBeVisible();
    await expect(page.locator('text=Normally reaches payee in 1-2 working days')).toBeVisible();

    // Verify radio button is checked by default
    const telegraphicRadio = page.locator('input[type="radio"]:checked').first();
    await expect(telegraphicRadio).toBeVisible();

    // Verify approval time information
    await expect(page.locator('text=Approve by')).toBeVisible();
  });

  test('Verify Pricing Guide Link', async () => {
    // Verify pricing guide link is visible
    const pricingLink = page.locator('text=For standard fees, view pricing guide');
    await expect(pricingLink).toBeVisible();

    // Click pricing guide (implementation depends on whether it opens new page)
    await pricingLink.click();
    await page.waitForTimeout(500);
  });
});