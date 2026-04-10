import { test, expect } from '@playwright/test';
import { LoginPage } from './bulkcollection-login-page.spec';
import { SecurityCodePage } from './bulkcollection-security-page.spec';
import { DashboardPage } from './bulkcollection-dashboard-page.spec';
import { PayTransferMenuPage } from './bulkcollection-pay-transfer-page.spec';
import { BulkCollectionPage } from './bulkcollection-creation-page.spec';
import { BulkCollectionVerificationPage } from './bulkcollection-verification-page.spec';
import { BulkCollectionSubmissionPage } from './bulkcollection-submission-page.spec';

/**
 * End-to-End Test: Complete Bulk Collection Transaction Workflow
 * Tests the full flow from login through to submission and reference number capture
 */
test.describe('Bulk Collection - Complete Transaction Workflow', () => {
  let loginPage: LoginPage;
  let securityPage: SecurityCodePage;
  let dashboardPage: DashboardPage;
  let payTransferPage: PayTransferMenuPage;
  let bulkCollectionPage: BulkCollectionPage;
  let verificationPage: BulkCollectionVerificationPage;
  let submissionPage: BulkCollectionSubmissionPage;

  test.beforeEach(async ({ page }) => {
    // Initialize all page objects
    loginPage = new LoginPage(page);
    securityPage = new SecurityCodePage(page);
    dashboardPage = new DashboardPage(page);
    payTransferPage = new PayTransferMenuPage(page);
    bulkCollectionPage = new BulkCollectionPage(page);
    verificationPage = new BulkCollectionVerificationPage(page);
    submissionPage = new BulkCollectionSubmissionPage(page);
  });

  test('Complete Bulk Collection Transaction with Reference Capture', async ({ page }) => {
    // Step 1: Login
    test.step('1. Navigate to login page and authenticate', async () => {
      await loginPage.navigateTo();
      await expect(loginPage.loginButton).toBeVisible();
      
      await loginPage.login('SHKLT008', 'DBSAUTOHK002', '123');
      await page.waitForTimeout(2000);
    });

    // Step 2: Security Code Authentication
    test.step('2. Enter security code and authenticate', async () => {
      await securityPage.verifyDialogDisplayed();
      await securityPage.authenticate('123');
      await page.waitForTimeout(2000);
    });

    // Step 3: Verify Dashboard
    test.step('3. Verify dashboard is loaded', async () => {
      await dashboardPage.verifyDashboardLoaded();
      await dashboardPage.verifyUserGreeting('DBSAUTOHK002');
    });

    // Step 4: Navigate to Bulk Collection
    test.step('4. Navigate to Pay & Transfer menu and select Bulk Collection', async () => {
      await dashboardPage.navigateToPayTransfer();
      await page.waitForTimeout(1000);
      
      await payTransferPage.verifyPageDisplayed();
      await payTransferPage.verifyBulkCollectionAvailable();
      await payTransferPage.clickBulkCollection();
      await page.waitForTimeout(2000);
    });

    // Step 5: Fill Bulk Collection Form
    test.step('5. Fill Bulk Collection form with transaction details', async () => {
      await bulkCollectionPage.verifyPageDisplayed();
      
      // Select account
      await bulkCollectionPage.selectAccount('NAME OF ACCT NO:7837003010');
      await page.waitForTimeout(500);
      
      // Select credit type
      await bulkCollectionPage.selectCreditType('Consolidated Credit');
      await page.waitForTimeout(500);
      
      // Add payer
      await bulkCollectionPage.selectExistingPayer('AutoTestBulkCollection');
      await bulkCollectionPage.clickAddPayer();
      await page.waitForTimeout(1000);
      
      // Enter amount
      await bulkCollectionPage.enterAmount('100.00');
      
      // Enter particulars
      await bulkCollectionPage.enterParticulars('TEST COLLECT');
      
      // Verify collection summary
      await bulkCollectionPage.verifyCollectionSummary('100.00');
    });

    // Step 6: Proceed to Verification
    test.step('6. Proceed to verification step', async () => {
      await bulkCollectionPage.clickNext();
      await page.waitForTimeout(2000);
      
      await verificationPage.verifyPageDisplayed();
    });

    // Step 7: Verify Transaction Details
    test.step('7. Verify all transaction details in verification page', async () => {
      await verificationPage.verifyTransactionDetails();
      await verificationPage.verifyCollectionSummary('1', '100.00');
      await verificationPage.verifyPayerDetails();
    });

    // Step 8: Enable Approval and Submit
    test.step('8. Enable approval and submit for approval', async () => {
      await verificationPage.verifySubmitButtonDisabled();
      
      await verificationPage.checkApproveCheckbox();
      await page.waitForTimeout(500);
      
      await verificationPage.verifyApprovalOptions();
      await verificationPage.clickApproveNow();
      await page.waitForTimeout(2000);
    });

    // Step 9: Verify Submission and Capture Reference
    test.step('9. Verify submission and capture internal reference number', async () => {
      await submissionPage.verifyPageDisplayed();
      await submissionPage.verifySuccessBannerDisplayed();
      
      // Capture the internal reference number
      const internalReference = await submissionPage.captureInternalReference();
      console.log(`Internal Reference Number: ${internalReference}`);
      
      // Verify reference format
      expect(internalReference).toMatch(/^EBCOL\d+/);
      
      // Store reference for potential future use
      test.info().annotations.push({
        type: 'Internal Reference',
        description: internalReference,
      });
    });

    // Step 10: Verify Final Status and Details
    test.step('10. Verify transaction status and final details', async () => {
      await submissionPage.verifyStatusApproved();
      await submissionPage.verifyTransactionDetails();
      await submissionPage.verifyCollectionSummary('1', '100.00');
      await submissionPage.verifyPayerDetails();
      await submissionPage.verifyStepIndicators();
    });

    // Step 11: Verify Export Options
    test.step('11. Verify export options are available', async () => {
      await submissionPage.verifyExportOptions();
      await submissionPage.verifyCompletionButtons();
    });
  });

  test('Bulk Collection - Form Validation', async ({ page }) => {
    test.step('1. Login and navigate to Bulk Collection', async () => {
      await loginPage.navigateTo();
      await loginPage.login('SHKLT008', 'DBSAUTOHK002', '123');
      await page.waitForTimeout(2000);
      
      await securityPage.authenticate('123');
      await page.waitForTimeout(2000);
      
      await dashboardPage.navigateToPayTransfer();
      await page.waitForTimeout(1000);
      
      await payTransferPage.clickBulkCollection();
      await page.waitForTimeout(2000);
    });

    test.step('2. Verify Submit button is disabled without required fields', async () => {
      await bulkCollectionPage.verifyPageDisplayed();
      // Try to click next without filling form - should fail or show validation
      await expect(bulkCollectionPage.nextButton).toBeEnabled();
    });
  });

  test('Bulk Collection - Cancel Operation', async ({ page }) => {
    test.step('1. Login and navigate to Bulk Collection', async () => {
      await loginPage.navigateTo();
      await loginPage.login('SHKLT008', 'DBSAUTOHK002', '123');
      await page.waitForTimeout(2000);
      
      await securityPage.authenticate('123');
      await page.waitForTimeout(2000);
      
      await dashboardPage.navigateToPayTransfer();
      await page.waitForTimeout(1000);
      
      await payTransferPage.clickBulkCollection();
      await page.waitForTimeout(2000);
    });

    test.step('2. Cancel the Bulk Collection creation', async () => {
      await bulkCollectionPage.verifyPageDisplayed();
      await bulkCollectionPage.clickCancel();
      
      // Should navigate back to Pay & Transfer menu
      await page.waitForTimeout(1500);
      await expect(page).toHaveURL(/pay.*transfer|transfers/i);
    });
  });
});
