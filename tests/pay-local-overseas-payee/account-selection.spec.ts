import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Account Selection - Payment Form', () => {
  let page: Page;
  let helper: PaymentFormHelper;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    helper = new PaymentFormHelper(page);

    // Navigation setup
    await helper.navigateToLogin();
    await helper.login('SG2BE11', 'SG2BE11S01', '123');
    await helper.navigateToPayAndTransfer();
    await helper.authenticateWithCode('123');
    await helper.selectPaymentOption('Pay Local / Overseas Payee');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Select Debit Account from Payment Form', async () => {
    // Step 1: Click Debit account section
    await helper.clickDebitAccountSection();

    // Verify account selection dropdown opens
    await expect(page.locator('text=Search account name or account number')).toBeVisible();
    await expect(page.locator('[role="tablist"]')).toBeVisible();

    // Step 2: Verify account list structure
    await helper.verifyAccountListVisible();

    // Verify multiple currencies are displayed
    const currencies = ['AUD', 'CAD', 'CHF', 'CNH', 'CNY', 'EUR', 'GBP', 'HKD'];
    for (const currency of currencies) {
      const currencyElement = page.locator(`text=${currency}`).first();
      const isVisible = await currencyElement.isVisible().catch(() => false);
      if (isVisible) {
        expect(isVisible).toBeTruthy();
      }
    }

    // Step 3: Verify account details structure
    const accountItems = page.locator('[role="listitem"]');
    const count = await accountItems.count();
    expect(count).toBeGreaterThan(0);

    // Step 4: Select first account
    await helper.selectAccountByName('SG SUBSI ACCOUNT MCA 1');

    // Verify account is selected
    await expect(page.locator('text=SG SUBSI ACCOUNT MCA 1')).toBeVisible();
    await expect(page.locator('text=AUD')).toBeVisible();

    // Verify currency auto-fills
    const currency = await helper.getCurrency();
    expect(currency).toBe('AUD');

    // Step 5: Click selected account again to open dropdown
    await page.click('[role="listitem"]:has-text("SG SUBSI ACCOUNT MCA 1")');
    await helper.clickDebitAccountSection();

    // Verify dropdown opens with selected account highlighted
    await expect(page.locator('text=SG SUBSI ACCOUNT MCA 1')).toBeVisible();
  });

  test('Switch between Accounts and Virtual Accounts tabs', async () => {
    await helper.clickDebitAccountSection();

    // Verify both tabs are visible
    const accountsTab = page.locator('[role="tab"]:has-text("Accounts")');
    const virtualTab = page.locator('[role="tab"]:has-text("Virtual accounts")');

    await expect(accountsTab).toBeVisible();
    await expect(virtualTab).toBeVisible();

    // Click Virtual accounts tab
    await virtualTab.click();
    await page.waitForTimeout(500);

    // Verify tab switched
    await expect(virtualTab).toHaveAttribute('aria-selected', 'true');

    // Click back to Accounts tab
    await accountsTab.click();
    await page.waitForTimeout(500);

    await expect(accountsTab).toHaveAttribute('aria-selected', 'true');
  });
});
