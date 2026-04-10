# Bulk Collection Transaction Submission with Internal Reference Capture

## Application Overview

This comprehensive test plan covers the complete end-to-end process of creating and submitting a Bulk Collection transaction in the DBS IDEAL application, with a specific focus on capturing and verifying the Internal reference number. The test validates the full workflow from SSO login through transaction approval, with detailed verification of transaction confirmation details and automatic reference number generation. The reference number is a critical transaction identifier used for tracking and reporting purposes.

## Test Scenarios

### 1. Bulk Collection Submission with Reference Number Capture

**Seed:** `tests/bulk-collection-reference-capture.spec.ts`

#### 1.1. SSO Login with Credentials

**File:** `tests/bulk-collection/authentication/login.spec.ts`

**Steps:**
  1. Navigate to https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin
    - expect: Login page should be displayed with IDEAL SHIFT R8.8 heading
    - expect: Three input fields visible: Organisation ID, User ID, PIN
    - expect: Language selector dropdown showing English as default
    - expect: Login button should be present and enabled
  2. Enter Organisation ID: SHKLT008
    - expect: Organisation ID field should accept and display 'SHKLT008'
  3. Enter User ID: DBSAUTOHK002
    - expect: User ID field should accept and display 'DBSAUTOHK002'
  4. Enter PIN: 123
    - expect: PIN field should display masked input (asterisks/dots)
    - expect: Actual PIN '123' should not be visible
  5. Click Login button
    - expect: Dashboard page should load after successful authentication
    - expect: URL should change to include '/idealx/'
    - expect: User greeting 'Hi DBSAUTOHK002' should be displayed
    - expect: Left navigation menu should be visible

#### 1.2. Security Code Authentication

**File:** `tests/bulk-collection/authentication/security-code.spec.ts`

**Steps:**
  1. After login, the system should prompt for security code
    - expect: Security code dialog should appear automatically
    - expect: Dialog title: 'Enter code manually from device'
    - expect: Instructions for IDEAL Mobile App transfer should be displayed
    - expect: Textbox for security access code should be visible
    - expect: 'Authenticate now' button should be present
  2. Enter security code: 123
    - expect: Security code field should accept the entered value '123'
  3. Click 'Authenticate now' button
    - expect: Security dialog should close
    - expect: IDEAL dashboard should load without errors
    - expect: User should remain logged in

#### 1.3. Navigate to Pay & Transfer Menu

**File:** `tests/bulk-collection/navigation/pay-transfer.spec.ts`

**Steps:**
  1. Locate and verify Pay & Transfer menu is present
    - expect: Pay & Transfer menu item should be visible in left navigation
    - expect: Menu should be clickable and responsive
  2. Click on Pay & Transfer menu item
    - expect: Page should navigate to Pay & Transfer section
    - expect: Transaction type options should be displayed
    - expect: Bulk Collection option should be visible in the list

#### 1.4. Select Bulk Collection Transaction Type

**File:** `tests/bulk-collection/creation/select-bulk-collection.spec.ts`

**Steps:**
  1. Verify Bulk Collection option is available
    - expect: Multiple transaction type options should be displayed
    - expect: Bulk Collection should be clearly visible and clickable
    - expect: Description should state: 'Collect payment from payers who have authorised you'
  2. Click on Bulk Collection option
    - expect: Bulk Collection creation form should load
    - expect: Step indicator should show: 1. Input Details | 2. Verify Details | 3. Submit for Approval
    - expect: Form should be ready for data entry

#### 1.5. Select Collection Account

**File:** `tests/bulk-collection/creation/select-account.spec.ts`

**Steps:**
  1. Locate the Account dropdown field
    - expect: Account dropdown should be visible and clickable
    - expect: Placeholder should show 'Select'
  2. Click on Account dropdown
    - expect: Dropdown should open displaying available accounts
    - expect: At least one account should be listed with format: 'NAME OF ACCT NO:[number] [number] ([CURRENCY])'
  3. Select first available account
    - expect: First account should be selectable
    - expect: Format: 'NAME OF ACCT NO:7837003010 783700301 (USD)'

#### 1.6. Select Credit Type

**File:** `tests/bulk-collection/creation/select-credit-type.spec.ts`

**Steps:**
  1. Click on Credit Type dropdown
    - expect: Credit Type dropdown should be visible
    - expect: Two options should be available: Consolidated Credit, Itemized Credit
  2. Select 'Consolidated Credit' option
    - expect: 'Consolidated Credit' option should be selectable
    - expect: Selection should update the field display

#### 1.7. Add Existing Payer to Collection

**File:** `tests/bulk-collection/creation/add-payer.spec.ts`

**Steps:**
  1. Verify existing payer is displayed in the list
    - expect: 'Existing payer' tab should be active by default
    - expect: Available payee 'AutoTestBulkCollection' should be displayed
    - expect: Add button should be present next to payer
  2. Click 'Add' button to add the payer
    - expect: Payer should be added to collection
    - expect: Counter should show 1 payer added
    - expect: Payer details form should appear

#### 1.8. Enter Collection Amount

**File:** `tests/bulk-collection/creation/enter-amount.spec.ts`

**Steps:**
  1. Locate Amount (USD) field
    - expect: Amount (USD) input field should be visible for the added payer
    - expect: Field should be ready for numeric input
  2. Enter Amount: 100.00
    - expect: Amount '100.00' should be entered successfully
    - expect: Field should display the entered value
  3. Verify amount entry and collection summary update
    - expect: Collection summary should update
    - expect: Total amount should reflect: 'Total amount (USD): 100.00'

#### 1.9. Enter Transaction Particulars

**File:** `tests/bulk-collection/creation/enter-particulars.spec.ts`

**Steps:**
  1. Locate Particulars field
    - expect: Particulars (optional) field should be visible
    - expect: Field should accept text input up to 12 characters
  2. Enter Particulars: TEST COLLECT
    - expect: Text 'TEST COLLECT' should be entered successfully
    - expect: Character counter should display remaining characters

#### 1.10. Verify Payment Date Selection

**File:** `tests/bulk-collection/creation/verify-payment-date.spec.ts`

**Steps:**
  1. Verify payment date selection
    - expect: Payment date section should show 'Step 3: Payment date'
    - expect: 'Earliest Available Date' option should be selected by default
    - expect: Date should show next working day (e.g., '12 Apr 2026' or '11 Apr 2026')
  2. Verify approver deadline information
    - expect: Approver deadline should be displayed
    - expect: Example: 'This transfer must be approved by 22:59 hrs 10 Apr 2026 by Approver.'

#### 1.11. Proceed to Verification

**File:** `tests/bulk-collection/creation/proceed-verification.spec.ts`

**Steps:**
  1. Verify all form fields are completed
    - expect: All required fields should be filled: Account: Selected, Credit Type: Consolidated Credit selected, Payer: Added with amount 100.00 USD, Payment date: Selected
  2. Locate and verify Next button
    - expect: Next button should be enabled at the bottom of the form
  3. Click Next button to proceed to verification
    - expect: Form should validate successfully
    - expect: No error messages should appear
  4. System should complete Step 1 and move to verification
    - expect: Page should navigate to Step 2: Verify Details
    - expect: URL should change to '/bulk-collection/preview'
    - expect: Preview of all transaction details should be displayed

#### 1.12. Review Transaction Details in Verification

**File:** `tests/bulk-collection/verification/review-details.spec.ts`

**Steps:**
  1. Verify step indicator status
    - expect: Step 1 (Input Details) should show checkmark
    - expect: Step 2 (Verify Details) should be highlighted as current
    - expect: Step 3 (Submit for Approval) should be grayed out
  2. Verify all transaction details are displayed correctly
    - expect: Preview section should display all entered transaction details: To: 783700301 (USD) - NAME OF ACCT NO:7837003010, Payment Type: Hong Kong Bulk Collection, Total amount: USD 100.00, Credit Type: Consolidated Credit, Payment date: 11 Apr 2026 (or next available date)
  3. Verify collection summary information
    - expect: Collection summary should show: Total payers: 1, Total amount (USD): 100.00
  4. Verify complete payer information
    - expect: Payer details should be displayed: Payer/Nickname: AutoTestBulkCollection, Bank/Bank Code: BANCO DE ORO UNIBANK INC HK BRANC, Account number: 010123456, Transaction code: 38 - Direct Debit(Consolidated posting), Particulars: TEST COLLECT

#### 1.13. Enable Approval and Submission

**File:** `tests/bulk-collection/submission/approve-checkbox.spec.ts`

**Steps:**
  1. Locate the approval checkbox
    - expect: 'Approve now and submit immediately' checkbox should be visible
    - expect: Checkbox should be unchecked by default
  2. Check 'Approve now and submit immediately' checkbox
    - expect: Checkbox should become checked after clicking
    - expect: Submit button should become enabled
  3. Verify approval options are displayed
    - expect: Approval method options should appear
    - expect: Options should include: Use the IDEAL Mobile app to approve transaction with Approve now button, Alternatively use your digital token or security device for approval

#### 1.14. Approve Transaction via Mobile App

**File:** `tests/bulk-collection/submission/approve-transaction.spec.ts`

**Steps:**
  1. Click 'Approve now' button
    - expect: 'Approve transaction' dialog should appear
    - expect: Dialog should show instructions for IDEAL Mobile App
    - expect: Step 1: Open DBS IDEAL app
    - expect: Step 2: Verify details before swiping to confirm
  2. Complete approval through mobile app or enter code manually
    - expect: Approval should be processed
    - expect: Dialog should close
    - expect: Page should navigate to submission confirmation

#### 1.15. Capture Internal Reference Number

**File:** `tests/bulk-collection/submission/capture-reference.spec.ts`

**Steps:**
  1. System completes approval and displays submission confirmation
    - expect: Page URL should change to '/bulk-collection/submit'
    - expect: Success message should display: 'Your bulk collection has been submitted'
    - expect: Step 3 (Submit for Approval) should now be marked complete
  2. Verify success notification banner is displayed
    - expect: A success notification banner should be displayed
    - expect: Banner should be green/success colored
    - expect: Banner should contain: 'Bulk Collection [REFERENCE-NUMBER] on [DATE] with [N] items for [AMOUNT] has been created successfully with status Approved.'
  3. Locate the Internal reference field in the confirmation page
    - expect: The Internal reference number should be visible and displayed
    - expect: Format should be: EBCOL followed by a sequence (e.g., EBCOL60409093268)
    - expect: Reference number should be alphanumeric
  4. Read and capture the Internal reference number
    - expect: Internal reference field should show a system-generated reference number
    - expect: The reference should be unique for this transaction
    - expect: The reference should NOT be empty or contain placeholder text
  5. Verify transaction status is Approved
    - expect: Status field should display: Approved
    - expect: This confirms the transaction was successfully approved and submitted

#### 1.16. Verify Final Transaction Details with Reference

**File:** `tests/bulk-collection/submission/verify-final-details.spec.ts`

**Steps:**
  1. Verify all transaction details are preserved
    - expect: All original transaction details should be displayed in final summary: To Account: 783700301 (USD), Payment Type: Hong Kong Bulk Collection, Total amount: USD 100.00, Credit Type: Consolidated Credit, Payment date: 11 Apr 2026
  2. Verify Internal reference number is displayed
    - expect: Internal reference field should display the generated reference number
    - expect: Example reference: EBCOL60409093268
  3. Verify Batch ID information
    - expect: Batch ID field should show: A batch ID will be generated after payment submission.
  4. Verify final collection summary
    - expect: Collection summary should show: Total payers: 1, Total amount (USD): 100.00
  5. Verify complete payer information in final summary
    - expect: Complete payer details should be visible: Amount (USD): 100.00, Transaction code: 38 - Direct Debit(Consolidated posting), Particulars: TEST COLLECT
  6. Verify export options are available
    - expect: Export PDF and Print buttons should be available

#### 1.17. Validate Internal Reference Number Format and Details

**File:** `tests/bulk-collection/reference/reference-validation.spec.ts`

**Steps:**
  1. Validate Internal reference number format
    - expect: Reference number should start with EBCOL
    - expect: Reference should be followed by numeric digits
    - expect: Total length should be appropriate for a transaction ID (e.g., 11 characters for EBCOL60409093268)
  2. Verify reference field location and clarity
    - expect: Reference number should be displayed in a dedicated Internal reference field
    - expect: Field label should clearly state: Internal reference
    - expect: Reference should be easily readable and copyable
  3. Verify reference number uniqueness and persistence
    - expect: The reference number should be unique to this specific transaction
    - expect: The reference should not change on page refresh (if done)
    - expect: The reference should be permanent for audit trail purposes
  4. Verify reference appears in confirmation message
    - expect: The reference number should be included in the success message banner
  5. Verify reference is available in export formats
    - expect: Reference should be available for export in PDF
    - expect: Reference should be included when printing the transaction

#### 1.18. Complete Transaction Summary and Final Verification

**File:** `tests/bulk-collection/completion/transaction-summary.spec.ts`

**Steps:**
  1. Review complete transaction summary
    - expect: Transaction should have status: Approved
    - expect: All transaction details should match input values
    - expect: Internal reference should be displayed
    - expect: Payment date should be 11 Apr 2026 (or next business day)
  2. Verify completion action options
    - expect: Make another collection button should be available
    - expect: Finished button should be available
  3. Verify notification suggestion
    - expect: A notification suggestion should display: Want to be notified by SMS or Email when this transaction is approved? Set it up in Alerts and Reminders.
  4. Document the Internal reference number for record-keeping
    - expect: Reference number should be captured and documented
    - expect: Transaction is complete and successfully submitted
