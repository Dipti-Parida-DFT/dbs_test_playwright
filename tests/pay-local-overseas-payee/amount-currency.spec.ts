import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Amount and Currency - Payment Form', () => {
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

  test('Enter Payment Amount and Verify Currency', async () => {
    // Verify You're sending section
    await expect(page.locator('text=You\'re sending')).toBeVisible();

    // Get current currency
    const currency = await helper.getCurrency();
    expect(currency).toBe('AUD');

    // Enter amount
    await helper.enterAmount('1000.50');

    // Verify amount is entered
    const amountValue = await page.locator('input[placeholder="0.00"]').inputValue();
    expect(amountValue).toBe('1000.50');

    // Verify Review button becomes enabled
    const reviewButton = page.locator('button:has-text("Review your payment")');
    const isDisabled = await reviewButton.isDisabled();
    expect(isDisabled).toBeFalsy();
  });

  test('Verify Currency Auto-fills from Selected Account', async () => {
    const currency = await helper.getCurrency();
    expect(currency).toBe('AUD');

    // Test with different account
    await page.click(`text=SG SUBSI ACCOUNT MCA 1`);
    await helper.clickDebitAccountSection();
    
    // Select account with different currency
    const differentCurrencyAccount = page.locator('[role="listitem"]').locator('text=EUR').first();
    if (await differentCurrencyAccount.isVisible()) {
      await differentCurrencyAccount.click();
      await page.waitForTimeout(300);

      const newCurrency = await helper.getCurrency();
      expect(newCurrency).toBe('EUR');
    }
  });

  test('Test Invalid Amount Inputs', async () => {
    // Test with letters
    await helper.enterAmount('abc');
    let amountValue = await page.locator('input[placeholder="0.00"]').inputValue();
    // Amount field should reject or handle invalid input
    expect(amountValue).not.toContain('abc');

    // Test with negative value
    await helper.enterAmount('-100');
    await page.waitForTimeout(300);
    amountValue = await page.locator('input[placeholder="0.00"]').inputValue();
    // System should handle negative values

    // Test with zero
    await helper.enterAmount('0');
    const reviewButton = page.locator('button:has-text("Review your payment")');
    const isDisabled = await reviewButton.isDisabled();
    // Zero amount should likely disable the review button
  });
});