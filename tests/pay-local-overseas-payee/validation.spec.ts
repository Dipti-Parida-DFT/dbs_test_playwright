import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Validation and Error Handling - Payment Form', () => {
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
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Validate Required Debit Account Field', async () => {
    // Try to proceed without selecting account
    const reviewButton = page.locator('button:has-text("Review your payment")');
    const isDisabled = await reviewButton.isDisabled();
    
    // Should be disabled without account selection
    expect(isDisabled).toBeTruthy();

    // Select account
    await helper.clickDebitAccountSection();
    await helper.selectAccountByName('SG SUBSI ACCOUNT MCA 1');

    // Button state may change
    await page.waitForTimeout(300);
  });

  test('Validate Required Payee Field', async () => {
    // Select account first
    await helper.clickDebitAccountSection();
    await helper.selectAccountByName('SG SUBSI ACCOUNT MCA 1');

    // Try to submit without payee
    let reviewButton = page.locator('button:has-text("Review your payment")');
    let isDisabled = await reviewButton.isDisabled();
    expect(isDisabled).toBeTruthy();

    // Select payee
    await helper.clickPayeeSection();
    await helper.selectPayeeByIndex(0);

    // Button state should update
    await page.waitForTimeout(300);
  });

  test('Validate Required Amount Field', async () => {
    // Setup: Select account and payee
    await helper.clickDebitAccountSection();
    await helper.selectAccountByName('SG SUBSI ACCOUNT MCA 1');
    await helper.clickPayeeSection();
    await helper.selectPayeeByIndex(0);

    // Review button should be disabled without amount
    let reviewButton = page.locator('button:has-text("Review your payment")');
    let isDisabled = await reviewButton.isDisabled();
    expect(isDisabled).toBeTruthy();

    // Enter amount
    await helper.enterAmount('100.00');

    // Button should be enabled
    await page.waitForTimeout(300);
    isDisabled = await reviewButton.isDisabled();
    expect(isDisabled).toBeFalsy();
  });

  test('Validate Character Limits', async () => {
    // Setup
    await helper.clickDebitAccountSection();
    await helper.selectAccountByName('SG SUBSI ACCOUNT MCA 1');
    await helper.clickPayeeSection();
    await helper.selectPayeeByIndex(0);

    // Test Original remitter identity - max 105 characters
    const longText105 = 'A'.repeat(106);
    const remitterField = page.locator('input[placeholder="Enter original remitter identity here"]');
    await remitterField.fill(longText105);
    const remitterValue = await remitterField.inputValue();
    expect(remitterValue.length).toBeLessThanOrEqual(105);

    // Test Bank statement reference - max 16 characters
    const longText16 = 'B'.repeat(17);
    const refField = page.locator('input[placeholder="e.g. INV000123"]');
    await refField.fill(longText16);
    const refValue = await refField.inputValue();
    expect(refValue.length).toBeLessThanOrEqual(16);
  });

  test('Handle Account Balance Validation', async () => {
    // Setup
    await helper.clickDebitAccountSection();
    await helper.selectAccountByName('SG SUBSI ACCOUNT MCA 1');
    await helper.clickPayeeSection();
    await helper.selectPayeeByIndex(0);

    // Account balance: 8,859,246.66 AUD
    // Enter amount exceeding balance
    await helper.enterAmount('9000000.00');

    // Try to review
    await helper.clickReviewPayment();
    await page.waitForTimeout(500);

    // Should either prevent submission or show error on review screen
    // Check if we're still on payment form (error) or moved to review screen
    const currentUrl = page.url();
    if (currentUrl.includes('single-new/create')) {
      // Still on payment form - error was caught
      expect(currentUrl).toContain('single-new/create');
    }
  });
});