// tests/VN_TaxPayment.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';


// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/VN_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;

const loginCompanyId = testData.TaxPayment.SIT.loginCompanyId;
const loginUserId    = testData.TaxPayment.SIT.loginUserId;
const fromAccount    = testData.TaxPayment.SIT.fromAccount;
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
    
    // Payments → Transfer Center → TaxPayment
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    //await pages.TransferCentersPage.waitForTransferCenterReady();

    // If icon not visible on the first page → click the second dot
    if (!(await pages.VNTaxPaymentPage.VNTaxPayment.isVisible())) {
    await pages.VNTaxPaymentPage.secondDot.click();
    // Now wait for the VN Tax icon to appear
    await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
    }

    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
    await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();

    // From account (type + Enter, works for most typeahead controls)
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    //For non -sequential select first two taxes
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });

    // Click the first two in DOM order
    await selectButton.nth(1).click();
    await selectButton.nth(2).click();

    //Get Outstandting value from record 1
    const rawValue1=(await pages.VNTaxPaymentPage.outstandingAmount.nth(0).innerText()).trim();
    const numericValue1 = rawValue1.replace(/[^0-9.-]+/g, '');
    console.log({ rawValue1, numericValue1 });

    // Amount to pay VND for record 1
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).fill(numericValue1);

    //Get Outstandting value from record 2
    const rawValue2=(await pages.VNTaxPaymentPage.outstandingAmount.nth(1).innerText()).trim();
    const numericValue2 = rawValue2.replace(/[^0-9.-]+/g, '');
    console.log({ rawValue2, numericValue2 });

    // Amount to pay VND for record 2
    await pages.VNTaxPaymentPage.amountToPayVND.nth(1).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(1).fill(numericValue2);
    
    //Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Next -> Preview -> Submit
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.nextButton);
    await pages.VNTaxPaymentPage.waitForPreviewPageReady();
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.submitButton);
    await pages.VNTaxPaymentPage.waitForSubmittedPageReady();

    // Capture reference and verify
    const referenceText = await pages.VNTaxPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    const reference = await pages.VNTaxPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    //Click on finish button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.finishButton);

    //Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.VNTaxPaymentPage.waitForViewPaymentPageReady();

    await expect(pages.VNTaxPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
        
  });

  test('TC002_VNTax - Make payment for sequential taxes', async ({ page }) => {
    
    // Payments → Transfer Center → TaxPayment
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    //await pages.TransferCentersPage.waitForTransferCenterReady();

    // If icon not visible on the first page → click the second dot
    if (!(await pages.VNTaxPaymentPage.VNTaxPayment.isVisible())) {
    await pages.VNTaxPaymentPage.secondDot.click();
    // Now wait for the VN Tax icon to appear
    await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
    }

    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
    await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();

    // From account (type + Enter, works for most typeahead controls)
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    //Selcet sequential tax radio button 
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.sequential);
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });

    // Click the first record in DOM order
    await selectButton.nth(2).click();
    
    //Get Outstandting value from record 1
    const rawValue1=(await pages.VNTaxPaymentPage.outstandingAmount.nth(0).innerText()).trim();
    const numericValue1 = rawValue1.replace(/[^0-9.-]+/g, '');
    console.log({ rawValue1, numericValue1 });

    // Amount to pay VND for record 1
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).fill(numericValue1);

    //Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Next -> Preview -> Submit
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.nextButton);
    await pages.VNTaxPaymentPage.waitForPreviewPageReady();
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.submitButton);
    await pages.VNTaxPaymentPage.waitForSubmittedPageReady();

    // Capture reference and verify
    const referenceText = await pages.VNTaxPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    const reference = await pages.VNTaxPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    //Click on finish button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.finishButton);

    //Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.VNTaxPaymentPage.waitForViewPaymentPageReady();

    await expect(pages.VNTaxPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
        
  });

  test('TC003_VNTax - Verify selecting more than 5 taxes from Non-sequential taxes', async ({ page }) => {
    
    // Payments → Transfer Center → TaxPayment
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    //await pages.TransferCentersPage.waitForTransferCenterReady();

    // If icon not visible on the first page → click the second dot
    if (!(await pages.VNTaxPaymentPage.VNTaxPayment.isVisible())) {
    await pages.VNTaxPaymentPage.secondDot.click();
    // Now wait for the VN Tax icon to appear
    await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
    }

    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
    await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();

    // From account (type + Enter, works for most typeahead controls)
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    //For non -sequential select first two taxes
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
          
    // Click the first five enabled buttons (defensive, in case some are disabled)
    let clicked = 0;
    for (let i = 0; i < await selectButton.count(); i++) {
      if (clicked >= 5) break;
      const selectBtn = selectButton.nth(i);
      await selectBtn.click();
      clicked++;
    }

    //Verify for next selection "+ Select" button is disabled
    await expect(selectButton.nth(5)).toHaveClass(/btn-disabled/);

    
    // 1) Click the first "− Remove" in the table/grid
    const rowCell = page.locator('datatable-body-cell').nth(0); // adjust index if needed
    const removeBtn = rowCell.getByRole('button', { name: /-\s*Remove/i });

    await expect(removeBtn).toBeVisible();
    await removeBtn.click();

    // 2) Now in the SAME row, verify "+ Select" becomes enabled
    const selectBtn = rowCell.getByRole('button', { name: /\+\s*Select/i });

    // Wait for disabled class to be removed (your app uses `btn-disabled`)
    await expect(selectBtn).not.toHaveClass(/btn-disabled/);

    
    // Optional: confirm it is clickable (non-destructive)
    await expect(async () => {
      await selectBtn.click({ trial: true });
    }).resolves.not.toThrow();

    //Click cancel do nothing
    await pages.VNTaxPaymentPage.cancelButton.click();
       
  });

  test('TC004_VNTax - Verify selecting more than 1 taxes from Sequential taxes', async ({ page }) => {
    
    // Payments → Transfer Center → TaxPayment
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    //await pages.TransferCentersPage.waitForTransferCenterReady();

    // If icon not visible on the first page → click the second dot
    if (!(await pages.VNTaxPaymentPage.VNTaxPayment.isVisible())) {
    await pages.VNTaxPaymentPage.secondDot.click();
    // Now wait for the VN Tax icon to appear
    await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
    }

    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
    await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();

    // From account (type + Enter, works for most typeahead controls)
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    //For Sequential select first taxes
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.sequential);
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });
    
    //Click first record
    await selectButton.nth(0).click();

    //Verify for next selection "+ Select" button is disabled
    await expect(selectButton.nth(1)).toHaveClass(/btn-disabled/);

    
    // 1) Click the first "− Remove" in the table/grid
    const rowCell = page.locator('datatable-body-cell').nth(0); // adjust index if needed
    const removeBtn = rowCell.getByRole('button', { name: /-\s*Remove/i });

    await expect(removeBtn).toBeVisible();
    await removeBtn.click();

    // 2) Now in the SAME row, verify "+ Select" becomes enabled
    const selectBtn = rowCell.getByRole('button', { name: /\+\s*Select/i });

    // Wait for disabled class to be removed (your app uses `btn-disabled`)
    await expect(selectBtn).not.toHaveClass(/btn-disabled/);

    // Optional: confirm it is clickable (non-destructive)
    await expect(async () => {
      await selectBtn.click({ trial: true });
    }).resolves.not.toThrow();

    //Click cancel do nothing
    await pages.VNTaxPaymentPage.cancelButton.click();
       
  });

  test('TC005_VNTax - Verify different tax office alert dialog', async ({ page }) => {
    
    // Payments → Transfer Center → TaxPayment
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")
    
    // If icon not visible on the first page → click the second dot
    if (!(await pages.VNTaxPaymentPage.VNTaxPayment.isVisible())) {
    await pages.VNTaxPaymentPage.secondDot.click();
    // Now wait for the VN Tax icon to appear
    await pages.VNTaxPaymentPage.VNTaxPayment.waitFor({ state: 'visible', timeout: 5000 });
    }

    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.VNTaxPayment);
    await pages.VNTaxPaymentPage.waitForVNTaxPaymentPageReady();

    // From account (type + Enter, works for most typeahead controls)
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    //Click Apply to load taxes
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.applyTaxes);
    //For non -sequential select first
    const selectButton = page.getByRole('button', { name: /\+\s*Select/i });

    // Click the second record in DOM order
    await selectButton.nth(1).click();
    
    //For the second record, select the one with different tax office (can be identified by the tax code or tax name)
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.corporateTaxFilterInput);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.fill(testData.TaxPayment.diffrentTaxOfficeName);
    await page.keyboard.press('Enter');

    await selectButton.nth(0).click();

    //Wait for dilog to appear and assert text
    await pages.VNTaxPaymentPage.expectDifferentOfficeDialog();
    
    //close the alert dialog
    await pages.VNTaxPaymentPage.dismissDifferentOfficeDialog();

    //Select correct second record for same tax office and continue
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.corporateTaxFilterInput);
    await pages.VNTaxPaymentPage.corporateTaxFilterInput.fill(testData.TaxPayment.taxOfficeName);

    // Click the second record in DOM order
    await selectButton.nth(2).click();

    //Get Outstandting value from record 1
    const rawValue1=(await pages.VNTaxPaymentPage.outstandingAmount.nth(0).innerText()).trim();
    const numericValue1 = rawValue1.replace(/[^0-9.-]+/g, '');
    console.log({ rawValue1, numericValue1 });

    // Amount to pay VND for record 1
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(0).fill(numericValue1);

    //Get Outstandting value from record 2
    const rawValue2=(await pages.VNTaxPaymentPage.outstandingAmount.nth(1).innerText()).trim();
    const numericValue2 = rawValue2.replace(/[^0-9.-]+/g, '');
    console.log({ rawValue2, numericValue2 });

    // Amount to pay VND for record 2
    await pages.VNTaxPaymentPage.amountToPayVND.nth(1).scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.amountToPayVND.nth(1).fill(numericValue2);
    
    //Select charge account
    await pages.VNTaxPaymentPage.chargeAccount.scrollIntoViewIfNeeded();
    await pages.VNTaxPaymentPage.chargeAccount.click();
    await page.keyboard.type(testData.TaxPayment.chargeAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Next -> Preview -> Submit
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.nextButton);
    await pages.VNTaxPaymentPage.waitForPreviewPageReady();
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.submitButton);
    await pages.VNTaxPaymentPage.waitForSubmittedPageReady();

    // Capture reference and verify
    const referenceText = await pages.VNTaxPaymentPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    const reference = await pages.VNTaxPaymentPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    //Click on finish button
    await pages.VNTaxPaymentPage.safeClick(pages.VNTaxPaymentPage.finishButton);

    //Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.waitForTransferCenterReady();
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.VNTaxPaymentPage.waitForViewPaymentPageReady();

    await expect(pages.VNTaxPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
        
  });

});