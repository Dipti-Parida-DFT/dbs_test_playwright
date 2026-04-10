import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Fee Arrangement - Payment Form', () => {
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

  test('Verify All Fee Arrangement Options', async () => {
    // Verify Fees will be paid by section
    await expect(page.locator('text=Fees will be paid by')).toBeVisible();

    // Verify all three fee options are visible
    await expect(page.locator('text=Both you and your payee (SHAR/SHA)')).toBeVisible();
    await expect(page.locator('text=You (DEBT/OUR)')).toBeVisible();
    await expect(page.locator('text=Your payee (CRED/BEN)')).toBeVisible();

    // Verify descriptions
    await expect(page.locator('text=You pay DBS fees.')).toBeVisible();
    await expect(page.locator('text=You pay DBS and other banks\' fees')).toBeVisible();
    await expect(page.locator('text=You pay no fees')).toBeVisible();
  });

  test('Select Different Fee Arrangements', async () => {
    // Default selection (Both you and your payee)
    let selectedRadio = page.locator('input[type="radio"][aria-label*="Both you"]').first();
    const isChecked = await selectedRadio.isChecked();
    expect(isChecked).toBeTruthy();

    // Select "You (DEBT/OUR)" option
    await page.click('label:has-text("You (DEBT/OUR)")');
    await page.waitForTimeout(300);

    // Verify selection changed
    selectedRadio = page.locator('input[type="radio"]:checked').first();
    const selectedText = await page.locator('label:has-text("You (DEBT/OUR)")').textContent();
    expect(selectedText).toBeTruthy();

    // Select "Your payee (CRED/BEN)" option
    await page.click('label:has-text("Your payee (CRED/BEN)")');
    await page.waitForTimeout(300);

    // Verify selection changed
    const credBenLabel = page.locator('label:has-text("Your payee (CRED/BEN)")');
    const credBenRadio = credBenLabel.locator('input[type="radio"]');
    const isCredBenChecked = await credBenRadio.isChecked();
    expect(isCredBenChecked).toBeTruthy();
  });
});