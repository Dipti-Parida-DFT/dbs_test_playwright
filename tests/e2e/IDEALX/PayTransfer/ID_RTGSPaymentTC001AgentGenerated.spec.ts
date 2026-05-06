/**
 * Author: AI Migration Agent
 * Created Date: 2026-04-16
 * Test File: tests/e2e/IDEALX/PayTransfer/ID_RTGSPaymentTC001AgentGenerated.spec.ts
 * 
 * Description: RTGS Payment Test Cases - Indonesia
 * TC01: Can not create RTGS with amount less than 100000001 IDR
 * 
 * This test verifies that the RTGS payment system prevents creation of payments
 * with amounts below the minimum threshold of IDR 100,000,001.
 */

import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { WebComponents } from '../../../lib/webComponents';
import { CONSTANTS } from '../../../lib/constants';
import { TIMEOUT } from '../../../lib/timeouts';

// ─── Web Components utility instance ───────────────────────────────────
const webComponents = new WebComponents();

// ─── Test Data ────────────────────────────────────────────────────────────
const testDataPath = path.resolve(__dirname, '../../../data/ID_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

const loginCompanyId = testData.RTGSPayment.SIT.loginCompanyId;
const loginUserId = testData.RTGSPayment.SIT.loginUserId;
const fromAccount = testData.RTGSPayment.SIT.fromAccount;
const payeeBankID = testData.RTGSPayment.SIT.payeeBankID;

// ─── Test Configuration ────────────────────────────────────────────────────
test.use({ storageState: undefined });     // Ensure fresh context per test

// ─── Shared login helper ──────────────────────────────────────────────────
async function doLogin(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginCompanyId, loginUserId, String(CONSTANTS.PIN));
}

// ─── Pages object (created after login) ─────────────────────────────────
let pages: PaymentsPages;

// Configure retries
test.describe.configure({
  retries: Number(process.env.CASE_RETRY_TIMES ?? 0),
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE: ID_RTGS_Payment (Indonesia RTGS Payment Workflow)
// ═════════════════════════════════════════════════════════════════════════════
test.describe('ID_RTGS Payment (Playwright using PaymentsPages)', { tag: ['@rtgs', '@ui', '@id'] }, () => {

  /**
   * This method runs before every test case execution to launch the browser/page
   */
  test.beforeEach(async ({ page }, testInfo) => {
    process.env.currentTestTitle = testInfo.title;
    test.setTimeout(TIMEOUT.MAX);
    
    await doLogin(page);
    pages = new PaymentsPages(page);
  });

  /**
   * This method runs after every test case execution to do cleanup activity
   */
  test.afterEach(async ({ page }, testInfo) => {
    // Only cleanup if the test failed to capture diagnostics
    if (testInfo.status !== 'passed') {
      console.warn(`[cleanup] Test status is ${testInfo.status} - skipping cleanup`);
      return;
    }

    // Best-effort cleanup
    try {
      await page.close();
      console.log('[cleanup] Page closed successfully');
    } catch (err) {
      console.warn('[cleanup] Failed to close page:', err);
    }
  });

  /**
   * TC01: Can not create RTGS with amount less than 100000001 IDR
   * 
   * Test Objective:
   *   Verify that RTGS payment creation is blocked when the payment amount
   *   is below the minimum threshold of IDR 100,000,001.
   * 
   * Expected Result:
   *   The RTGS Payment checkbox (immediate payment flag) should be DISABLED,
   *   indicating the system has validated and rejected the low amount.
   */
  test('TC01_Can not create RTGS with amount less than 100000001 IDR', async ({ page }) => {
    try {
      // ─── Step 1: Wait for UX to stabilize ───────────────────────────────────
      console.log('[Step 1] Waiting for UX to load...');
      await webComponents.waitForUXLoading([], page);
      await webComponents.waitElementToBeVisible(pages.AccountTransferPage.paymentMenu);
      
      // ─── Step 2: Navigate to Payment Menu ───────────────────────────────────
      console.log('[Step 2] Navigating to Payment Menu...');
      await webComponents.clickWhenVisibleAndEnabled(pages.AccountTransferPage.paymentMenu);
      
      // ─── Step 3: Handle Authentication Dialog (if present) ──────────────────
      console.log('[Step 3] Handling authentication if present...');
      await webComponents.handleAuthIfPresent(
        pages.AccountTransferPage.authDialog, 
        pages.AccountTransferPage.securityAccessCode, 
        pages.AccountTransferPage.authenticateButton
      );
      
      // ─── Step 4: Wait for Transfer Centers page to stabilize ────────────────
      console.log('[Step 4] Waiting for Transfer Centers page...');
      await webComponents.waitForUXLoading([], page);
      await page.waitForTimeout(1000);
      
      // ─── Step 5: Click Make Payment button (using JavaScript click) ──────────
      console.log('[Step 5] Clicking Make Payment...');
      // Use JavaScript click to bypass overlay issues
      await webComponents.javaScriptsClick(pages.AccountTransferPage.makePayment);
      await webComponents.waitForUXLoading([], page);
      await page.waitForTimeout(2000);
      
      // ─── Step 6: Wait for RTGS Payment Page to load ────────────────────────
      console.log('[Step 6] Waiting for RTGS Payment creation page...');
      const fromAccountVisible = await webComponents.isElementVisible(
        page,
        pages.RTGSPaymentPage.fromAccount,
        { timeout: 30000 }
      );
      expect(fromAccountVisible).toBe(true);
      await page.waitForTimeout(1000);
      
      // ─── Step 7: Select From Account ───────────────────────────────────────
      console.log('[Step 7] Selecting From Account...');
      await webComponents.clickWhenVisibleAndEnabled(pages.RTGSPaymentPage.fromAccount);
      await page.waitForTimeout(500);
      await webComponents.typeTextThroughKeyBoardAction(page, fromAccount);
      await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
      await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
      await page.waitForTimeout(500);
      
      // ─── Step 8: Enter Amount (BELOW minimum) ───────────────────────────────
      console.log(`[Step 8] Entering amount below minimum: ${testData.RTGSPayment.lessMinamount}...`);
      const amountInput = pages.RTGSPaymentPage.amount;
      await webComponents.enterTextarea(amountInput, testData.RTGSPayment.lessMinamount);
      await page.waitForTimeout(500);
      
      // ─── Step 9: Switch to New Payee Tab ────────────────────────────────────
      console.log('[Step 9] Switching to New Payee tab...');
      const newPayeeTabVisible = await webComponents.isElementVisible(
        page,
        pages.RTGSPaymentPage.newPayeeTab,
        { timeout: 5000 }
      );
      if (newPayeeTabVisible) {
        await webComponents.clickWhenVisibleAndEnabled(pages.RTGSPaymentPage.newPayeeTab);
        await page.waitForTimeout(500);
      }
      
      // ─── Step 10: Click Continue Button ──────────────────────────────────────
      console.log('[Step 10] Clicking Continue button...');
      const continueBtn = pages.RTGSPaymentPage.continueBtn;
      const continueBtnVisible = await webComponents.isElementVisible(
        page,
        continueBtn,
        { timeout: 5000 }
      );
      
      if (continueBtnVisible) {
        await webComponents.clickWhenVisibleAndEnabled(continueBtn);
        await page.waitForTimeout(500);
      }
      
      // ─── Step 11: Enter New Payee Name ──────────────────────────────────────
      console.log('[Step 11] Entering New Payee Name...');
      const newPayeeNameInput = pages.RTGSPaymentPage.newPayeeName;
      const newPayeeNameVisible = await webComponents.isElementVisible(
        page,
        newPayeeNameInput,
        { timeout: 10000 }
      );
      expect(newPayeeNameVisible).toBe(true);
      await webComponents.enterTextarea(newPayeeNameInput, testData.RTGSPayment.newPayeeName);
      await page.waitForTimeout(300);
      
      // ─── Step 12: Select Payee Bank ID ────────────────────────────────────
      console.log('[Step 12] Selecting Payee Bank ID...');
      const payeeBankIDLocator = pages.RTGSPaymentPage.payeeBankID;
      const payeeBankIDVisible = await webComponents.isElementVisible(
        page,
        payeeBankIDLocator,
        { timeout: 5000 }
      );
      if (payeeBankIDVisible) {
        await webComponents.clickWhenVisibleAndEnabled(payeeBankIDLocator);
        await page.waitForTimeout(500);
        await webComponents.typeTextThroughKeyBoardAction(page, payeeBankID);
        await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'ArrowDown');
        await webComponents.pressGivenButtonThroughKeyBoardAction(page, 'Enter');
        await page.waitForTimeout(300);
      }
      
      // ─── Step 13: Enter New Payee Account Number ───────────────────────────
      console.log('[Step 13] Entering New Payee Account Number...');
      const newPayeeAcctInput = pages.RTGSPaymentPage.newPayeeAcctNumber;
      const newPayeeAcctVisible = await webComponents.isElementVisible(
        page,
        newPayeeAcctInput,
        { timeout: 5000 }
      );
      if (newPayeeAcctVisible) {
        await webComponents.enterTextarea(newPayeeAcctInput, testData.RTGSPayment.newPayeeAcctNumber);
        await page.waitForTimeout(300);
      }
      
      // ─── Step 14: Verify RTGS Payment Checkbox is Disabled ──────────────────
      console.log('[Step 14] Verifying RTGS Payment Checkbox is DISABLED...');
      const rtgsCheckbox = pages.RTGSPaymentPage.RTGSPaymentCheckBox;
      
      // The checkbox may be hidden (CSS) even though present in DOM
      // Evaluate its state directly without waiting for visibility
      const checkboxElement = await rtgsCheckbox.evaluate((el: Element) => {
        const element = el as HTMLElement & { disabled?: boolean };
        const radio = el as HTMLInputElement;
        return {
          classList: element.className,
          hasDisabledClass: element.classList.contains('disabled'),
          ariaDisabled: element.getAttribute('aria-disabled'),
          disabled: radio.disabled,
          displayStyle: window.getComputedStyle(element).display,
          visibilityStyle: window.getComputedStyle(element).visibility,
        };
      });
      
      console.log(`[Verification] Checkbox state: ${JSON.stringify(checkboxElement)}`);
      
      // Check if the checkbox has the "disabled" attribute or class
      const isDisabled = 
        checkboxElement.hasDisabledClass || 
        checkboxElement.ariaDisabled === 'true' || 
        checkboxElement.disabled === true;
      
      console.log(`[Verification] Is Disabled: ${isDisabled}`);
      console.log(`[Verification] Display: ${checkboxElement.displayStyle}, Visibility: ${checkboxElement.visibilityStyle}`);
      
      expect(isDisabled).toBe(true);
      
      console.log('[PASS] RTGS Payment Checkbox is correctly disabled for below-minimum amount');
      
    } catch (error) {
      console.error('[ERROR] Test failed with exception:', error);
      throw error;
    }
  });


}); // End of describe block
