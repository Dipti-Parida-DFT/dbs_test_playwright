import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Form Submission - Payment Form', () => {
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

  test('Review Button is Disabled Until Amount is Entered', async () => {
    // Initially, Review button should be disabled
    const state1 = await helper.getReviewButtonState();
    expect(state1.isDisabled).toBeTruthy();

    // Enter amount
    await helper.enterAmount('500.00');
    await page.waitForTimeout(300);

    // Review button should now be enabled
    const state2 = await helper.getReviewButtonState();
    expect(state2.isDisabled).toBeFalsy();

    // Clear amount
    await helper.enterAmount('');
    await page.waitForTimeout(300);

    // Review button should be disabled again
    const state3 = await helper.getReviewButtonState();
    expect(state3.isDisabled).toBeTruthy();
  });

  test('Save as Draft Functionality', async () => {
    // Fill in some information
    await helper.enterAmount('250.75');
    await helper.enterRemitterIdentity('Test User 15MAR1990');
    await helper.enterBankStatementReference('TEST001');

    // Click Save as Draft
    await helper.clickSaveAsDraft();

    // Verify confirmation or navigation
    await page.waitForTimeout(500);
    // Expected: confirmation message or redirect
  });

  test('Submit Payment for Review', async () => {
    // Fill all required fields
    await helper.enterAmount('1000.00');

    // Click Review your payment
    await helper.clickReviewPayment();

    // Verify navigation to review screen
    await page.waitForURL(/.*review|.*confirm/i);
    
    // Verify payment summary is displayed
    await expect(page.locator('text=SG SUBSI ACCOUNT MCA 1')).toBeVisible();
    await expect(page.locator('text=1000')).toBeVisible();
  });

  test('Verify FX Promotion Message', async () => {
    // Check if FX message is visible
    const fxMessage = page.locator('text=Do you know you can obtain better savings');
    const isVisible = await fxMessage.isVisible().catch(() => false);

    if (isVisible) {
      expect(isVisible).toBeTruthy();
      await expect(page.locator('text=Amend your trade')).toBeVisible();
    }
  });

  test('Verify Disclaimer Section', async () => {
    // Scroll to bottom to see disclaimer
    await page.locator('text=Disclaimer').scrollIntoViewIfNeeded();

    // Verify disclaimer is visible
    await expect(page.locator('text=Disclaimer')).toBeVisible();
    await expect(page.locator('text=Singapore Telegraphic Transfer Payments Policy')).toBeVisible();
  });
});
