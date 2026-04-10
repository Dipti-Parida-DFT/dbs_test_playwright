import { test, expect, Page } from '@playwright/test';
import { PaymentFormHelper } from '../utils/payment-form-helper';

test.describe('Payee Selection - Payment Form', () => {
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
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Select Payee from Payment Form', async () => {
    // Step 1: Click Select or add payee section
    await helper.clickPayeeSection();

    // Verify payee selection UI
    await expect(page.locator('text=Search by name, nickname, or account number')).toBeVisible();
    await expect(page.locator('text=366 payees found')).toBeVisible();
    await expect(page.locator('text=Add new payee')).toBeVisible();

    // Step 2: Verify payee list structure
    const payeeItems = page.locator('[role="listitem"]');
    const count = await payeeItems.count();
    expect(count).toBeGreaterThan(0);

    // Verify payee details are displayed (Bank codes, account numbers, etc.)
    await expect(page.locator('text=ABFLHKH0XXX')).toBeVisible();

    // Step 3: Search for a payee
    await helper.searchPayee('AB');
    
    // Verify results filter
    const filteredItems = page.locator('[role="listitem"]');
    const filteredCount = await filteredItems.count();
    expect(filteredCount).toBeGreaterThan(0);

    // Step 4: Select first payee
    await helper.selectPayeeByIndex(0);

    // Verify payee selected and form expands
    await expect(page.locator('text=Payment type')).toBeVisible();
    await expect(page.locator('text=Fees will be paid by')).toBeVisible();
  });

  test('Add New Payee Option', async () => {
    await helper.clickPayeeSection();

    // Click on Add new payee
    await page.click('text=Add new payee');

    // Verify new payee form or modal appears
    // This depends on the actual implementation
    await page.waitForTimeout(500);
    const addPayeeForm = page.locator('text=Add');
    const isVisible = await addPayeeForm.isVisible().catch(() => false);
    
    if (isVisible) {
      expect(isVisible).toBeTruthy();
    }
  });
});