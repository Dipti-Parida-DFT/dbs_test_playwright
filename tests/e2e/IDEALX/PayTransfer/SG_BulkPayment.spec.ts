
// tests/SG_BulkPayment.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { PaymentsPages, ApprovalsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { WebComponents } from '../../../lib/webComponents';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/SG_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;

const loginCompanyId = testData.BulkPayment.SIT.loginCompanyId;
const loginUserId    = testData.BulkPayment.SIT.loginUserId;
const fromAccount    = testData.BulkPayment.SIT.fromAccount;
const payeeBankID    = testData.BulkPayment.payeeBankID;

let _ApprovalsPages: ApprovalsPages;
//Initialize Web Component class
const webComponents = new WebComponents();
let reference = "";
let reference1 = "";
let approvalReference = '';

// Configure retries like the old Protractor suite
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

test.describe('SG_BulkPayment (Create Payments)', () => {
  let pages: PaymentsPages;
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
   

  test.beforeEach(async ({ page }, testInfo) => {
    _ApprovalsPages = new ApprovalsPages(page);
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(TIMEOUT.MAX);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, (String(CONSTANTS.PIN)));
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
  // Only cleanup if the test passed
  if (testInfo.status !== 'passed') {
    console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
    return;
    }
    
  // Best-effort cleanup; never fail the test because cleanup failed
  for (const p of createdPayees) {
    try {
      const key = p.name ?? p.accountNumber ?? '';
      await pages.BulkPaymentPage.deletePayeeByFilter(key, /* confirm */ true);
      console.log(`[cleanup] Deleted payee with key: ${key}`);
    } catch (err) {
      console.warn('[cleanup] Failed to delete a payee:', err);
    }
  }
  });

  test('TC001_BulkPayment - Create Bulk Payment with new payee', async ({ page }) => {
    
    // Step 1: Click on Pay & Transfer menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    // Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent(String(CONSTANTS.SECURITYACCESSCODE))

    //Step 3: Click on VN Tax Payment icon
    try {
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        } catch {
        // Fallback: move to the next page/slide, then click
        await pages.BulkPaymentPage.secondDot.click();
        await pages.BulkPaymentPage.bulkPayment.waitFor({ state: 'visible', timeout: 5000 });
        await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.bulkPayment);
        await pages.BulkPaymentPage.waitForBulkPaymentFormReady();
        }
      
    // Step 4: Select From account
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Reusable helper for add new payee
        const { name, accountNumber }  = await pages.BulkPaymentPage.addNewPayeeSGBulkPayment({
          name: testData.BulkPayment.newPayeeName,
          nickName: testData.BulkPayment.newPayeeNickName,
          bankId: payeeBankID,
          accountNumber: testData.BulkPayment.newPayeeAcctNumber,
        });

      // Register for cleanup
      createdPayees.push({ name, accountNumber });

    //Enter NickName for SG specific test case
    //await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.payeeNickNameSGBulk, testData.BulkPayment.newPayeeNickName);

      // Step 5: Enter Amount
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.amount, testData.BulkPayment.amountA1);
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.showOptionalDetails);
    await pages.BulkPaymentPage.safeFill(pages.BulkPaymentPage.paymentDetailsTextarea, testData.BulkPayment.paymentDetails);

    // Step 6: Next → Preview → Submit
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.nextButton);
    await pages.BulkPaymentPage.waitForPreviewPageReady();
    await pages.BulkPaymentPage.safeClick(pages.BulkPaymentPage.submitButton);
    await pages.BulkPaymentPage.waitForSubmittedPageReady();

    // Step 7: Capture reference
    const referenceText = await pages.BulkPaymentPage.getReferenceText();
    const reference = await pages.BulkPaymentPage.getReferenceID();

    // Step 8: Verify reference in transfer center
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkPaymentPage.waitForViewPaymentPageReady();

    // Step 9: Verify from account in view payment page
    await expect(pages.BulkPaymentPage.fromAccountViewLabel).toContainText(fromAccount);
    await expect(pages.BulkPaymentPage.amountView).toContainText(testData.BulkPayment.amountA1);
  });

});

