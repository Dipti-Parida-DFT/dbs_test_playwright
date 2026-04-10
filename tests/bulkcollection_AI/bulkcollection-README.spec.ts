/**
 * BULK COLLECTION TEST SUITE - README
 * 
 * This test suite provides comprehensive end-to-end testing for the DBS IDEAL
 * Bulk Collection transaction workflow using Playwright and the Page Object Model (POM) pattern.
 * 
 * ============================================================================
 * PROJECT STRUCTURE
 * ============================================================================
 * 
 * tests/
 * ├── bulkcollection_AI/
 * │   ├── bulkcollection-login-page.spec.ts           # Login Page Object
 * │   ├── bulkcollection-security-page.spec.ts        # Security Page Object
 * │   ├── bulkcollection-dashboard-page.spec.ts       # Dashboard Page Object
 * │   ├── bulkcollection-pay-transfer-page.spec.ts    # Pay & Transfer Menu Page Object
 * │   ├── bulkcollection-creation-page.spec.ts        # Bulk Collection Form Page Object
 * │   ├── bulkcollection-verification-page.spec.ts    # Verification Page Object
 * │   ├── bulkcollection-submission-page.spec.ts      # Submission/Confirmation Page Object
 * │   ├── bulkcollection-test-utils.spec.ts           # Test Utilities & Constants
 * │   ├── bulkcollection-test-fixture.spec.ts         # Custom Test Fixtures
 * │   ├── bulkcollection-reference-capture.spec.ts    # Reference Number Capture Helper
 * │   ├── bulkcollection-e2e-test.spec.ts             # Main E2E Test Suite
 * │   ├── bulkcollection-playwright.config.ts         # Playwright Configuration
 * │   └── bulkcollection-README.ts                    # This file
 * 
 * ============================================================================
 * PAGE OBJECT MODELS
 * ============================================================================
 * 
 * 1. LoginPage
 *    - Handles: Login page interactions (Organisation ID, User ID, PIN)
 *    - Methods: navigateTo(), login(), enterOrganisationId(), etc.
 * 
 * 2. SecurityCodePage
 *    - Handles: Security code dialog and authentication
 *    - Methods: authenticate(), enterSecurityCode(), verifyDialogDisplayed()
 * 
 * 3. DashboardPage
 *    - Handles: Main dashboard navigation
 *    - Methods: navigateToPayTransfer(), navigateToDashboard(), logout()
 * 
 * 4. PayTransferMenuPage
 *    - Handles: Payment & Transfer menu options
 *    - Methods: clickBulkCollection(), verifyTransactionTypes()
 * 
 * 5. BulkCollectionPage
 *    - Handles: Step 1 - Bulk Collection form (Input Details)
 *    - Methods: selectAccount(), selectCreditType(), enterAmount(), clickNext()
 * 
 * 6. BulkCollectionVerificationPage
 *    - Handles: Step 2 - Verification and approval
 *    - Methods: verifyTransactionDetails(), checkApproveCheckbox(), clickApproveNow()
 * 
 * 7. BulkCollectionSubmissionPage
 *    - Handles: Step 3 - Submission confirmation and reference capture
 *    - Methods: captureInternalReference(), verifyStatusApproved()
 * 
 * ============================================================================
 * TEST DATA
 * ============================================================================
 * 
 * TEST_DATA constant contains:
 * - ORGANISATION_ID: 'SHKLT008'
 * - USER_ID: 'DBSAUTOHK002'
 * - PIN: '123'
 * - SECURITY_CODE: '123'
 * - ACCOUNT: 'NAME OF ACCT NO:7837003010'
 * - ACCOUNT_NUMBER: '783700301'
 * - CREDIT_TYPE: 'Consolidated Credit'
 * - PAYER_NAME: 'AutoTestBulkCollection'
 * - AMOUNT: '100.00'
 * - PARTICULARS: 'TEST COLLECT'
 * 
 * ============================================================================
 * RUNNING THE TESTS
 * ============================================================================
 * 
 * 1. Run all Bulk Collection tests:
 *    npx playwright test tests/e2e/bulkcollection-*.spec.ts
 * 
 * 2. Run only the E2E test:
 *    npx playwright test tests/e2e/bulkcollection-e2e-test.spec.ts
 * 
 * 3. Run specific test:
 *    npx playwright test tests/e2e/bulkcollection-e2e-test.spec.ts -g "Complete Bulk Collection"
 * 
 * 4. Run in headed mode (see browser):
 *    npx playwright test --headed tests/e2e/bulkcollection-*.spec.ts
 * 
 * 5. Run with specific browser:
 *    npx playwright test --project=chromium tests/e2e/bulkcollection-*.spec.ts
 * 
 * 6. Debug mode:
 *    npx playwright test --debug tests/e2e/bulkcollection-*.spec.ts
 * 
 * ============================================================================
 * REFERENCE NUMBER CAPTURE
 * ============================================================================
 * 
 * The ReferenceCapture helper class is specifically designed for capturing
 * and validating transaction reference numbers:
 * 
 * Features:
 * - Capture reference from Internal reference field
 * - Capture reference from success banner
 * - Validate reference format (EBCOL + digits)
 * - Parse reference details (prefix, sequence number)
 * - Create reference records with metadata
 * - Log reference details for reporting
 * 
 * Example Usage:
 * 
 *   const refCapture = new ReferenceCapture(page);
 *   const reference = await refCapture.extractAndVerifyReference();
 *   console.log(`Captured Reference: ${reference}`);
 *   
 *   // Get detailed record
 *   const record = refCapture.createReferenceRecord(reference);
 *   console.log(JSON.stringify(record, null, 2));
 * 
 * ============================================================================
 * TEST SCENARIOS
 * ============================================================================
 * 
 * 1. Complete Bulk Collection Transaction
 *    - Login → Security Code → Dashboard → Pay & Transfer → Bulk Collection
 *    - Fill form → Verification → Approval → Submission
 *    - Capture Internal Reference → Verify Status
 * 
 * 2. Form Validation
 *    - Verify required fields
 *    - Test form submission with empty fields
 * 
 * 3. Cancel Operation
 *    - Test canceling at different steps
 * 
 * ============================================================================
 * EXPECTED TEST RESULTS
 * ============================================================================
 * 
 * Success Criteria:
 * ✓ User successfully authenticates
 * ✓ Dashboard loads after security code entry
 * ✓ Bulk Collection form displays correctly
 * ✓ All transaction details are entered correctly
 * ✓ Verification page shows accurate summary
 * ✓ Approval checkbox enables submission
 * ✓ Mobile app approval dialog appears
 * ✓ Success message displays after submission
 * ✓ Internal reference number is captured: EBCOL[digits]
 * ✓ Transaction status shows "Approved"
 * ✓ Export and print options are available
 * 
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 * 
 * Issue: Login fails with invalid credentials
 *   - Verify credentials in TEST_DATA
 *   - Check server is accessible
 * 
 * Issue: Security code dialog doesn't appear
 *   - Ensure login was successful
 *   - Check if security code is required for this user
 * 
 * Issue: Bulk Collection form doesn't load
 *   - Verify authentication completed
 *   - Check network connectivity
 * 
 * Issue: Reference number capture fails
 *   - Verify reference field selector is correct
 *   - Check page loaded successfully
 *   - Validate reference format is EBCOL + digits
 * 
 * ============================================================================
 * KEY FEATURES
 * ============================================================================
 * 
 * • Page Object Model (POM) - Maintainable and scalable test structure
 * • Custom fixtures - Pre-authenticated user state
 * • Utilities - Helper functions for common operations
 * • Reference capture - Specialized helper for transaction IDs
 * • Multi-browser support - Chrome, Firefox, Safari
 * • Detailed reporting - HTML, JSON, JUnit reports
 * • Screenshots & videos - On failure for debugging
 * • Test data constants - Easy configuration
 * • Custom assertions - Transaction-specific validations
 * 
 * ============================================================================
 * MAINTENANCE & UPDATES
 * ============================================================================
 * 
 * When updating selectors or page structure:
 * 1. Update the corresponding Page Object class
 * 2. Update selector locators
 * 3. Update method implementations
 * 4. Run tests to verify changes
 * 5. Update documentation if needed
 * 
 * When adding new tests:
 * 1. Create test in bulkcollection-e2e-test.spec.ts
 * 2. Use existing Page Objects or create new ones
 * 3. Follow naming conventions
 * 4. Use TEST_DATA constants
 * 5. Add test.step() for better reporting
 * 
 * ============================================================================
 * REPORTING
 * ============================================================================
 * 
 * Test reports are generated in:
 * - playwright-report/index.html (HTML Report)
 * - test-results/results.json (JSON Report)
 * - test-results/junit.xml (JUnit Report)
 * 
 * View HTML report:
 *   npx playwright show-report
 * 
 * ============================================================================
 */
