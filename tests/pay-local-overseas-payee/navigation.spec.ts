import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Pay Local Overseas Payee - Navigation', () => {
  let page: Page;
  let helper: PaymentFormHelper;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    helper = new PaymentFormHelper(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Navigate to Pay Local Overseas Payee from Dashboard', async () => {
    // Step 1: Login
    await helper.navigateToLogin();
    await helper.login('SG2BE11', 'SG2BE11S01', '123');

    // Verify dashboard loaded
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Hi SG2BE11S01')).toBeVisible();

    // Step 2: Navigate to Pay & Transfer
    await helper.navigateToPayAndTransfer();

    // Verify authentication dialog appears
    await expect(page.locator('text=Enter code manually from device')).toBeVisible();

    // Step 3: Enter authentication code
    await helper.authenticateWithCode('123');

    // Step 4: Verify navigation to Pay & Transfer page
    await expect(page).toHaveURL(/.*transfer-center\/transactions/);
    await expect(page.locator('text=Pay & Transfer')).toBeVisible();

    // Step 5: Verify payment options are displayed
    const paymentOptions = [
      'Pay Local / Overseas Payee',
      'Transfer within Own Accounts',
      'Payment via Partner Bank',
      'MT101 Payment',
      'Payroll',
      'Payroll (Alternate)',
      'Management Payroll',
      'Management Payroll (Alternate)',
      'Bill Payment'
    ];

    for (const option of paymentOptions) {
      await expect(page.locator(`text=${option}`)).toBeVisible();
    }

    // Step 6: Click on Pay Local / Overseas Payee
    await helper.selectPaymentOption('Pay Local / Overseas Payee');

    // Verify payment form loaded
    await expect(page).toHaveURL(/.*single-new\/create/);
    await expect(page.locator('heading:has-text("Local / overseas payment")')).toBeVisible();
  });
});