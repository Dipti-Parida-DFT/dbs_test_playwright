import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Optional Information - Payment Form', () => {
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

  test('Fill Original Remitter Identity Field', async () => {
    // Scroll to ensure visibility
    await page.locator('text=Original remitter identity').scrollIntoViewIfNeeded();

    // Verify field is visible
    await expect(page.locator('text=Original remitter identity')).toBeVisible();
    await expect(page.locator('text=If you are transferring money on behalf of someone else')).toBeVisible();

    // Verify instructions are displayed
    await expect(page.locator('text=For Individual, please input')).toBeVisible();
    await expect(page.locator('text=For business, please input')).toBeVisible();

    // Enter individual remitter identity
    await helper.enterRemitterIdentity('John Doe 01JAN1980');

    // Verify character count
    const charCount = await helper.getRemitterIdentityCharCount();
    expect(charCount).toContain('16/105');

    // Test character limit at 105
    const longText = 'A'.repeat(105);
    await helper.enterRemitterIdentity(longText);
    const finalCount = await helper.getRemitterIdentityCharCount();
    expect(finalCount).toContain('105/105');
  });

  test('Fill Bank Statement Reference Field', async () => {
    // Scroll to optional information section
    await page.locator('text=Optional information').scrollIntoViewIfNeeded();

    // Verify Reference on bank statements checkbox is visible and checked by default
    const referenceCheckbox = page.locator('label:has-text("Reference on bank statements") input[type="checkbox"]');
    const isChecked = await referenceCheckbox.isChecked();
    expect(isChecked).toBeTruthy();

    // Enter reference
    await helper.enterBankStatementReference('INV000123');

    // Verify character count for reference
    const refField = page.locator('input[placeholder="e.g. INV000123"]');
    const refValue = await refField.inputValue();
    expect(refValue).toBe('INV000123');

    // Test character limit at 16
    const longReference = 'A'.repeat(16);
    await helper.enterBankStatementReference(longReference);
    const finalRefValue = await refField.inputValue();
    expect(finalRefValue.length).toBeLessThanOrEqual(16);
  });

  test('Toggle Optional Information Checkboxes', async () => {
    await page.locator('text=Optional information').scrollIntoViewIfNeeded();

    // Test Use an intermediary bank checkbox
    await helper.toggleCheckbox('Use an intermediary bank');
    await helper.verifyCheckboxChecked('Use an intermediary bank');

    // Test Details to payee checkbox
    await helper.toggleCheckbox('Details to payee');
    await helper.verifyCheckboxChecked('Details to payee');

    // Test Notify payees or other parties checkbox
    await helper.toggleCheckbox('Notify payees or other parties');
    await helper.verifyCheckboxChecked('Notify payees or other parties');
  });
});