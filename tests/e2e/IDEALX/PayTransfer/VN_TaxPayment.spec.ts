// tests/VN_TaxPayment.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';

const testDataPath = path.resolve(__dirname, '../../../data/VN_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;

const loginCompanyId = testData.TaxPayment.SIT.loginCompanyId;
const loginUserId    = testData.TaxPayment.SIT.loginUserId;
const fromAccount    = testData.TaxPayment.SIT.fromAccount;
const loginCompanyId1 = testData.TaxPayment.SIT.loginCompanyId1;
const loginUserId1    = testData.TaxPayment.SIT.loginUserId1;
const loginUserId2 = testData.TaxPayment.SIT.loginUserId2;
const fromAccount1    = testData.TaxPayment.SIT.fromAccount1;
const payeeBankID    = testData.TaxPayment.SIT.payeeBankID;

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('VN_TaxPayment (Playwright using PaymentsPages)', () => {
  let pages: PaymentsPages;
 
  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');
    await loginPage.handleAnnouncementIfPresent();
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
    
  });

  test.afterEach(async ({ page }, testInfo) => {
  // Only cleanup if the test passed
  if (testInfo.status !== 'passed') {
    console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
    return;
    }
    
  });

    test('TC001_VNTax - Make payment for Non-sequential taxes', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
   
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Ensure that Apply and taxes button is not visible beore selecting from account
    await expect(pages.VNTaxPaymentPage.applyTaxes).not.toBeVisible({ timeout: 5000 });

    //Step 5: Select From account 
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 6: Click Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    
    //Step 7: For non -sequential select first two taxes
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
    // Click the first two in DOM order
    //await selectButton.nth(1).click();
    await selectButton.nth(2).click();

    //Step 8: Get Outstandting value from record 1
    const rawValue1=(await pages.VNTaxPaymentPage.outstandingAmount.nth(0).innerText()).trim();
    const numericValue1 = rawValue1.replace(/[^0-9.-]+/g, '');
    
    //Step 9: Enter Amount to pay VND for record 1
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).fill(numericValue1);

    //Step 10: Get Outstandting value from record 2
    //const rawValue2=(await pages.VNTaxPaymentPage.outstandingAmount.nth(1).innerText()).trim();
    //const numericValue2 = rawValue2.replace(/[^0-9.-]+/g, '');
   
    //Step 11: Enter Amount to pay VND for record 2
    //await pages.VNTaxPaymentPage.amountToPayVND.nth(1).scrollIntoViewIfNeeded();
    //await pages.VNTaxPaymentPage.amountToPayVND.nth(1).fill(numericValue2);
    
    //Step 12: Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    //Step 13: Next -> Preview -> Submit
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.nextButton);
    await pages.VNTaxPaymentPage.waitForPreviewPageReady();
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.submitButton);
    await pages.VNTaxPaymentPage.waitForSubmittedPageReady();

    //Step 14: Capture reference
    const referenceText = await pages.VNTaxPaymentPage.getReferenceText();
    const reference = await pages.VNTaxPaymentPage.getReferenceID();

    //Step 15: Click on finish button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.finishButton);

    //Step 16: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.VNTaxPaymentPage.waitForViewPaymentPageReady();

    //Step 17: Verify from account in view payment page
    await expect(pages.VNTaxPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    
    //Add code to approve payment
  });

  test('TC002_VNTax - Make payment for sequential taxes', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
   
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account 
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Select PaymentId, enter valid details and then goto nxt step
    await pages.VNTaxPaymentPage.selectTaxes.click();
    await pages.VNTaxPaymentPage.paymentID.waitFor({ state: 'visible', timeout: 5000 });
    await pages.VNTaxPaymentPage.paymentID.click();
    await pages.VNTaxPaymentPage.optionIDInput.fill(testData.TaxPayment.PaymentID);

    //Step 5: Click Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.waitFor({ state: 'visible', timeout: 5000 });
    
    //Step 6: Ensure Non-sequential radio button is selected by default
    const nonSequential = page.getByLabel('Non-sequential', { exact: true })
    await expect(nonSequential).toBeChecked();
    
    //Step 7: Select one from non-sequential then remove non-sequential record and ensure sequential radio button gets enabled
    const selectNonSequential = page.getByRole('button', { name: /\+\s*Select/i });
    await selectNonSequential.nth(0).click();

    //Step 8: Verify Sequential radio button is disabled
    await expect(page.getByLabel('Sequential', { exact: true })).toBeDisabled();

    //Step 9: Click the first "− Remove" in the table/grid
    const nonSequentialRow = page.locator('datatable-body'); // adjust index if needed
    const removeButton = nonSequentialRow.getByRole('button', { name: /-\s*Remove/i });
    await expect(removeButton.first()).toBeVisible();
    await removeButton.first().click();

    //Step 10: Ensure that Sequential radio button gets enabled now
    await expect(page.getByLabel('Sequential', { exact: true })).not.toBeDisabled();

    //Step 11: Click on Sequential radio button
    const sequential = page.getByLabel('Sequential', { exact: true });
    await sequential.waitFor({ state: 'attached', timeout: 5000 });
    await sequential.scrollIntoViewIfNeeded();
    await sequential.evaluate((el: HTMLInputElement) => el.click())

    //Step 12: Selcet first from sequential tax list 
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
    await selectButton.nth(2).click();
    
    //Step 13: Get Outstandting value from record 1
    const rawValue1=(await pages.VNTaxPaymentPage.outstandingAmount.nth(0).innerText()).trim();
    const numericValue1 = rawValue1.replace(/[^0-9.-]+/g, '');
    
    //Step 14: Enter Amount to pay VND for record 1
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).fill(numericValue1);

    //Step 15: Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    //Step 16: Next -> Preview -> Submit
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.nextButton);
    await pages.VNTaxPaymentPage.waitForPreviewPageReady();
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.submitButton);
    await pages.VNTaxPaymentPage.waitForSubmittedPageReady();

    //Step 17: Capture reference
    const referenceText = await pages.VNTaxPaymentPage.getReferenceText();
    const reference = await pages.VNTaxPaymentPage.getReferenceID();
    
    //Step 18: Click on finish button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.finishButton);

    //Step 19: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.VNTaxPaymentPage.waitForViewPaymentPageReady();

    //Step 20: Verify from account in view payment page
    await expect(pages.VNTaxPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
        
  });

  test('TC003_VNTax - Verify selecting more than 5 taxes from Non-sequential taxes', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Click Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.waitFor({ state: 'visible', timeout: 5000 });

    //Step 6: For non -sequential select first five taxes
    const selectPlus = page.getByRole('button', { name: /\+\s*Select/i });
    await expect(selectPlus.first()).toBeVisible({ timeout: 5000 });
        
    // Click the first five available "+ Select" buttons
    let clicked = 0;
    const total = await selectPlus.count();
    for (let i = 0; i < total && clicked < 5; i++) {
      await selectPlus.nth(i).click();
      clicked++;
    }
   
    //Step 7: Verify for next selection "+ Select" button is disabled
    await page.waitForTimeout(100); // wait for UI to update after clicking
    const enabledSelectPlus = page.locator('button:not(.btn-disabled):has-text("+ Select")')
    await expect(enabledSelectPlus).toHaveCount(0, { timeout: 10000 });

    //Step 8: Click the first "− Remove" in the table/grid
    const rowCell = page.locator('datatable-body'); // adjust index if needed
    const removeBtn = rowCell.getByRole('button', { name: /-\s*Remove/i });
    await expect(removeBtn.first()).toBeVisible({ timeout: 10000 });
    await removeBtn.first().click();

    //Step 9: Now in the SAME row, verify "+ Select" becomes enabled
    const rowSelectBtn = rowCell.getByRole('button', { name: /\+\s*Select/i });
    
    //Step 10: Ensure record is clikable now
    await expect(rowSelectBtn.first()).not.toHaveClass(/btn-disabled/);
    await expect(async () => {
      await rowSelectBtn.first().click({ trial: true });
    }).resolves.not.toThrow();

    //Step 11: Click on cancel button
    await pages.VNTaxPaymentPage.cancelButton.click();
  });

  test('TC004_VNTax - Verify selecting more than 1 taxes from Sequential taxes', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Click Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.waitFor({ state: 'visible', timeout: 5000 });
    
    //Step 6: Click on Sequential radio button
    const sequential = page.getByLabel('Sequential', { exact: true });
    await sequential.waitFor({ state: 'attached', timeout: 5000 });
    await sequential.scrollIntoViewIfNeeded();
    await sequential.evaluate((el: HTMLInputElement) => el.click())

    //Step 7: For Sequential select first tax
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
    await selectButton.nth(0).click();

    //Step 8: Verify for next selection "+ Select" button is disabled
    await expect(selectButton.nth(1)).toHaveClass(/btn-disabled/);

    //Step 9: Click the first "− Remove" in the table/grid
    const rowCell = page.locator('datatable-body'); // adjust index if needed
    const removeBtn = rowCell.getByRole('button', { name: /-\s*Remove/i });
    await expect(removeBtn.first()).toBeVisible({ timeout: 10000 });
    await removeBtn.first().click();

    //Step 10: Now in the SAME row, verify "+ Select" becomes enabled
    const selectBtn = rowCell.getByRole('button', { name: /\+\s*Select/i });

    //Step 10: Ensure record is clikable now
    await expect(selectBtn.first()).not.toHaveClass(/btn-disabled/);
    await expect(async () => {
      await selectBtn.first().click({ trial: true });
    }).resolves.not.toThrow();

    //Step 11: Click on cancel button
    await pages.VNTaxPaymentPage.cancelButton.click();
       
  });

  test('TC005_VNTax - Verify different tax office alert dialog', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Click Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.waitFor({ state: 'visible', timeout: 5000 });

    //Step 6: For non -sequential select first record
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
    await selectButton.nth(1).click();
    
    //Step 7: For the second record, select the one with different tax office (can be identified by the tax code or tax name)
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.corporateTaxFilterInput);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.fill(testData.TaxPayment.diffrentTaxOfficeName);
    await page.keyboard.press('Enter');
    await selectButton.nth(0).click();

    //Step 8: Wait for dilog to appear and assert text
    await pages.VNTaxPaymentPage.expectDifferentOfficeDialog();
    
    //Step 9: Close the alert dialog
    await pages.VNTaxPaymentPage.dismissDifferentOfficeDialog();

    //Step 10: Select correct second record for same tax office and continue
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.corporateTaxFilterInput);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.fill(testData.TaxPayment.taxOfficeName);
    await selectButton.nth(2).click();

    //Step 11: Get Outstandting value from record 1
    const rawValue1=(await pages.VNTaxPaymentPage.outstandingAmount.nth(0).innerText()).trim();
    const numericValue1 = rawValue1.replace(/[^0-9.-]+/g, '');
    console.log({ rawValue1, numericValue1 });

    //Step 12: Enter Amount to pay VND for record 1
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).fill(numericValue1);

    //Step 13: Get Outstandting value from record 2
    const rawValue2=(await pages.VNTaxPaymentPage.outstandingAmount.nth(1).innerText()).trim();
    const numericValue2 = rawValue2.replace(/[^0-9.-]+/g, '');
    
    //Step 14: Enter Amount to pay VND for record 2
    await pages.VNTaxPaymentPage.amountToPayVND.nth(1).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(1).fill(numericValue2);
    
    //Step 15: Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    //Step 16: Next -> Preview -> Submit
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.nextButton);
    await pages.VNTaxPaymentPage.waitForPreviewPageReady();
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.submitButton);
    await pages.VNTaxPaymentPage.waitForSubmittedPageReady();

    //Step 17: Capture reference
    const referenceText = await pages.VNTaxPaymentPage.getReferenceText();
    const reference = await pages.VNTaxPaymentPage.getReferenceID();
    
    //Step 18: Click on finish button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.finishButton);

    //Step 19: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.VNTaxPaymentPage.waitForViewPaymentPageReady();

    //Step 20: Verify from account in view payment page
    await expect(pages.VNTaxPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
        
  });

  
  test('TC007_VNTax - Verify error message when no tax data present(No mock data required)', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Click Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
  
    //Step 6: Verify empty message when no tax data is present for the account
    const emptyMessage = page
    .locator('datatable-selection')
    .locator('.empty-row');
    await expect(emptyMessage).toBeVisible({ timeout: 30000 });
    await expect(emptyMessage).toContainText(testData.TaxPayment.NoDataMessage)

    //Step 7: Click on cancel button
    await pages.VNTaxPaymentPage.cancelButton.click();
  });

  test('TC008_VNTax - Verify options under Select Taxes dropdown(No mock data required)', async ({ page }) => {
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
   
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account 
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Click on Select Taxes drop down
    await pages.VNTaxPaymentPage.selectTaxes.click();

    //Step 6: Verify options under drop down
    const actual = await pages.VNTaxPaymentPage.getSelectTaxesOptions();
    expect(actual).toEqual(testData.TaxPayment.selectTaxesOptions);

    //Step 7: Ensure user should be able to select Payment ID and enter data
    //await pages.VNTaxPaymentPage.selectTaxes.click();
    await pages.VNTaxPaymentPage.paymentID.waitFor({ state: 'visible', timeout: 5000 });
    await pages.VNTaxPaymentPage.paymentID.click();
    await pages.VNTaxPaymentPage.optionIDInput.fill(testData.TaxPayment.PaymentID);

    //Step 8: Ensure user should be able to select Decision Number and enter data
    await pages.VNTaxPaymentPage.selectTaxes.click();
    await pages.VNTaxPaymentPage.decisionNumber.waitFor({ state: 'visible', timeout: 5000 });
    await pages.VNTaxPaymentPage.decisionNumber.click();
    await pages.VNTaxPaymentPage.optionIDInput.fill(testData.TaxPayment.DecisionNumber);

    //Step 9: Ensure user should be able to select Document Number and enter data
    await pages.VNTaxPaymentPage.selectTaxes.click();
    await pages.VNTaxPaymentPage.documentNumber.waitFor({ state: 'visible', timeout: 5000 });
    await pages.VNTaxPaymentPage.documentNumber.click();
    await pages.VNTaxPaymentPage.optionIDInput.fill(testData.TaxPayment.DocumentNumber);

    //Step 10: Click Cancel
    await pages.VNTaxPaymentPage.cancelButton.click();
  });

  test('TC009_VNTax - Verify Non-sequential and Sequential radio buttons displayed and by default non-sequential selected(No mock data required)', async ({ page }) => {
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
   
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account 
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Click on Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.waitFor({ state: 'visible', timeout: 5000 });
    
    //Step 6: Ensure Non-sequential is selected by default
    const nonSequential = page.getByLabel('Non-sequential', { exact: true })
    await expect(nonSequential).toBeChecked();
    
    //Step 7: Click on Sequential radio button 
    const sequential = page.getByLabel('Sequential', { exact: true });
    await sequential.waitFor({ state: 'attached', timeout: 5000 });
    await sequential.scrollIntoViewIfNeeded();
    await sequential.evaluate((el: HTMLInputElement) => el.click())

    //Step 8: Verify Sequential radio button is selected
    await expect(sequential).toBeChecked();

    //Step 9: Click Cancel
    await pages.VNTaxPaymentPage.cancelButton.click();
  });

  test('TC010_VNTax - Verify newly added fields under Additional Information section for non-sequential tax', async ({ page }) => {
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
   
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account 
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Ensure OrgTaxCode is not null or empty
    const orgTaxCodeValue = await pages.VNTaxPaymentPage.orgTaxCode.inputValue();
    if (!orgTaxCodeValue) {
      throw new Error('OrgTaxCode is empty or not set. Cannot proceed with applying taxes.');
    }

    //Step 6: Click on Apply Taxes button
    await pages.VNTaxPaymentPage.applyTaxes.click();

    //Step 7: Select first record from non-sequential tax list
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
    await selectButton.nth(0).click();

    //Step 8: Verify for selected record additional information section gets displayed with new fields - Tax period, Tax type, Tax office
    const additionalInfo = pages.VNTaxPaymentPage.additionalInfoSection;
    await expect(additionalInfo).toBeVisible({ timeout: 10000 });

    await expect(additionalInfo.getByText('Vehicle identification number', { exact: true })).toBeVisible();
    await expect(additionalInfo.getByText('Vehicle number', { exact: true })).toBeVisible();
    await expect(additionalInfo.getByText('Vehicle description', { exact: true })).toBeVisible();
    await expect(additionalInfo.getByText('Property record number', { exact: true })).toBeVisible();
    await expect(additionalInfo.getByText('Payment due date', { exact: true })).toBeVisible();

    //Step 9: Click Cancel
    await pages.VNTaxPaymentPage.cancelButton.click();
  });
});

test.describe('VN_TaxPayment (Verify Error message when no Org Tax Code Present)', () => {
  let pages: PaymentsPages;
 
  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId1, loginUserId1, '123');
    await loginPage.handleAnnouncementIfPresent();
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
    
  });

  test.afterEach(async ({ page }, testInfo) => {
  // Only cleanup if the test passed
  if (testInfo.status !== 'passed') {
    console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
    return;
    }
    
  });

  test('TC006_VNTax - Verify error message when no org tax code present', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Select From account
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount1);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 5: Make sure Org Tax code field is disabled 
    await expect(pages.VNTaxPaymentPage.orgTaxCodeInput).toBeDisabled();

    //Step 6: Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount1);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    //Step 7: Click next and verify error message for no org tax code
    await pages.VNTaxPaymentPage.nextButton.click();

    //Step 8: Generic banner error container
    const globalError = page.locator('.alert.alert-error');
    await expect(globalError).toBeVisible({ timeout: 30000 });
    await expect(globalError).toContainText(testData.TaxPayment.errorMessage);

    //Click on cancel
    await pages.VNTaxPaymentPage.cancelButton.click();
  });


});

test.describe('VN_TaxPayment (Approval flow)', () => {
  let pages: PaymentsPages;
 
  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId2, '123');
    await loginPage.handleAnnouncementIfPresent();
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
    
  });

  test.afterEach(async ({ page }, testInfo) => {
  // Only cleanup if the test passed
  if (testInfo.status !== 'passed') {
    console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
    return;
    }
    
  });

  test('TC011_VNTax - Make payment for Non-sequential taxes and Approve it', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
   
    //Step 3: Click on VN Tax Payment icon
    try {
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    } catch {
      // Fallback: move to the next page/slide, then click
      await pages.VNTaxPaymentPage.secondDot.click();
      await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
      await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
      await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();
    }

    //Step 4: Ensure that Apply and taxes button is not visible beore selecting from account
    await expect(pages.VNTaxPaymentPage.applyTaxes).not.toBeVisible({ timeout: 5000 });

    //Step 5: Select From account 
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Step 6: Click Apply to load taxes and select multiple taxes for payment
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    
    //Step 7: For non -sequential select first two taxes
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
    // Click the third record in DOM order
    await selectButton.nth(2).click();

    //Step 8: Get Outstandting value from record 1
    const rawValue1=(await pages.VNTaxPaymentPage.outstandingAmount.nth(0).innerText()).trim();
    const numericValue1 = rawValue1.replace(/[^0-9.-]+/g, '');
    
    //Step 9: Enter Amount to pay VND for record 1
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).fill(numericValue1);

    //Step 12: Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    //Step 13: Next -> Preview -> Submit
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.nextButton);
    await pages.VNTaxPaymentPage.waitForPreviewPageReady();

    //Step 14: Click on Approve now checkbox
    await pages.VNTaxPaymentPage.approveNowCheckbox.click();
    await pages.VNTaxPaymentPage.getChallengeSMSButton.click();
    await pages.VNTaxPaymentPage.challengeResponse.fill("12345678");

    //Step 15: Click on Submit button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.submitButton);
    await pages.VNTaxPaymentPage.waitForSubmittedPageReady();

    //Step 16: Capture reference
    const referenceText = await pages.VNTaxPaymentPage.getReferenceText();
    const reference = await pages.VNTaxPaymentPage.getReferenceID();

    //Step 17: Click on finish button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.finishButton);

    //Step 18: Verify reference in transfer center
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.VNTaxPaymentPage.waitForViewPaymentPageReady();

    //Step 19: Verify status is Approved/Received
    const status = page.locator('#statusDesc');
    await expect(status).toBeVisible();
    await expect(status).toHaveText(/^(Approved|Received)$/i, { timeout: 30_000 });
  });

});