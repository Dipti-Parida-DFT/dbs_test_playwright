# Complete Bulk Collection Transaction Submission Test Plan

## Application Overview

This comprehensive test plan covers the complete end-to-end process of logging into the DBS IDEAL application and creating, verifying, and submitting a Bulk Collection transaction with full approval. The application is an enterprise payment and transfer management system where authorized users can initiate collection payments from multiple payers. The test scenario includes authentication with SSO credentials, security code authentication, full form completion with transaction details, verification of all inputs, and complete submission with approval through the IDEAL Mobile App authentication flow.

## Test Scenarios

### 1. Complete Bulk Collection Transaction Submission

**Seed:** `tests/bulk-collection-complete.spec.ts`

#### 1.1. Login and SSO Authentication

**File:** `tests/bulk-collection/01-login-authentication.spec.ts`

**Steps:**
  1. Navigate to the SSO login page at https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin
    - expect: The login page should display with IDEAL SHIFT R8.8 heading
    - expect: Three input fields should be visible: Organisation ID, User ID, and PIN
    - expect: Language selector dropdown should be visible with English as default
    - expect: A Login button should be present
  2. Enter Organisation ID 'SHKLT008' in the Organisation ID field
    - expect: The Organisation ID field should accept text input
    - expect: Text 'SHKLT008' should be entered successfully
  3. Enter User ID 'DBSAUTOHK002' in the User ID field
    - expect: The User ID field should accept text input
    - expect: Text 'DBSAUTOHK002' should be entered successfully
  4. Enter PIN '123' in the PIN field
    - expect: The PIN field should mask the input (show asterisks/dots)
    - expect: The value should be accepted without displaying the actual digits
  5. Verify all credentials are entered correctly
    - expect: All three fields should show entered values (PIN masked)
    - expect: The Login button should be clickable and enabled
  6. Click the Login button to authenticate
    - expect: The page should navigate to the dashboard
    - expect: URL should change to include /idealx/
    - expect: User greeting 'Hi DBSAUTOHK002' should be displayed
    - expect: The Dashboard page should load with the left navigation menu

#### 1.2. Security Code Authentication

**File:** `tests/bulk-collection/02-security-authentication.spec.ts`

**Steps:**
  1. After successful login, the application should automatically prompt for security code
    - expect: A security code dialog should appear immediately
    - expect: Dialog title should be 'Enter code manually from device'
    - expect: Instructions should show how to use the IDEAL Mobile App
    - expect: A textbox for 'Enter security access code' should be visible
    - expect: An 'Authenticate now' button should be present
  2. Enter security code '123' in the security access code textbox
    - expect: The security code field should accept the entered text
    - expect: The value '123' should be entered without visibility issues
  3. Click the 'Authenticate now' button
    - expect: The security dialog should close
    - expect: The application should authenticate and navigate forward
    - expect: Navigation should not show a blank or error page
  4. Verify successful authentication by waiting for page load
    - expect: The dashboard or default page should load
    - expect: No error messages should be displayed

#### 1.3. Navigate to Bulk Collection Creation

**File:** `tests/bulk-collection/03-navigate-bulk-collection.spec.ts`

**Steps:**
  1. Verify Pay & Transfer menu is visible in the navigation
    - expect: The Pay & Transfer menu item should be visible in the left navigation
    - expect: The menu item should be clickable
  2. Click on the 'Pay & Transfer' menu item
    - expect: No security dialog should appear this time
    - expect: The Pay & Transfer page should load showing transaction options
  3. Verify all transaction options are available
    - expect: A list of transaction types should be displayed including:
    - expect: - Pay Local / Overseas Payee
    - expect: - Transfer within Own Accounts
    - expect: - Payroll
    - expect: - Bulk Payment
    - expect: - Bulk Collection
    - expect: - Cheque Payments
    - expect: Bulk Collection should be clearly visible and clickable
  4. Click on 'Bulk Collection' to start creating a transaction
    - expect: The Bulk Collection creation form should load
    - expect: The page heading should be 'Bulk Collection'
    - expect: The description should state 'Collect payment from payers who have authorised you'
    - expect: Three steps should be visible: '1. Input Details', '2. Verify Details', '3. Submit for Approval'

#### 1.4. Input Account and Credit Type Details

**File:** `tests/bulk-collection/04-input-account-details.spec.ts`

**Steps:**
  1. Verify the Account selection field is displayed
    - expect: An 'Account' dropdown field should be visible
    - expect: The field should display 'Select' as placeholder text
    - expect: A dropdown icon should be present
  2. Click on the Account dropdown to view available accounts
    - expect: The dropdown should open and display available accounts
    - expect: At least one account should be listed
    - expect: Account format should show: 'NAME OF ACCT NO:[account-number] [account-number] ([currency])'
  3. Select the first available account from the dropdown
    - expect: The first account should be selectable
    - expect: Format example: 'NAME OF ACCT NO:7837003010 783700301 (USD)'
  4. Verify account is selected correctly
    - expect: The Account field should display the selected account
    - expect: The Credit Type field should become available
  5. Verify the Credit Type dropdown is available
    - expect: A 'Credit Type' dropdown should be visible
    - expect: Two options should be available when clicked: 'Consolidated Credit' and 'Itemized Credit'
  6. Select 'Consolidated Credit' from the Credit Type dropdown
    - expect: The 'Consolidated Credit' option should be selectable
    - expect: Helper text should explain: 'Select credit type to display one consolidated credit record or itemized credit records in your bank statement.'

#### 1.5. Select Existing Payer and Add to Collection

**File:** `tests/bulk-collection/05-select-payer.spec.ts`

**Steps:**
  1. Verify Step 2 section with Existing payer tab
    - expect: 'Step 2: Collect from' heading should be visible
    - expect: An 'Existing payer' tab should be selected by default
    - expect: A 'New payer' tab should also be available
    - expect: A filter search box should be displayed
  2. Verify existing payers are displayed
    - expect: At least one existing payer should be listed
    - expect: Payer details should include: name, account number, bank details
  3. Click the 'Add' button to add the payer to this collection
    - expect: An 'Add' button should be visible next to the payer
    - expect: Clicking Add should add the payer to the collection transaction
  4. Verify the payer has been added successfully
    - expect: An 'Added payers' section should appear
    - expect: The counter should show '1' indicating one payer has been added
    - expect: Payer details should be displayed including: Payer/Nickname, Bank/Bank Code, Account number, Mandate ID
  5. Verify the amount input fields are available for the added payer
    - expect: Fields for Amount (USD), Transaction code, and Particulars should be visible
    - expect: Amount field should be empty and ready for input

#### 1.6. Enter Collection Amount and Details

**File:** `tests/bulk-collection/06-enter-collection-amount.spec.ts`

**Steps:**
  1. Click on the Amount (USD) field
    - expect: The Amount (USD) field should be ready for input
    - expect: The field should accept numeric values
  2. Enter '100.00' in the Amount (USD) field
    - expect: The amount '100.00' should be entered successfully
    - expect: The field should accept decimal values
  3. Verify the Transaction code field is pre-filled
    - expect: The Transaction code should be pre-filled
    - expect: Default value should be '38 - Direct Debit(Consolidated posting)'
  4. Verify the Particulars field is available
    - expect: The Particulars (optional) field should be available
    - expect: The field should accept text input up to 12 characters
  5. Enter 'TEST COLLECT' in the Particulars field
    - expect: The text 'TEST COLLECT' should be entered successfully
    - expect: A character counter should display remaining characters
  6. Verify the collection summary is updated with the correct amount
    - expect: A 'Collection summary' should appear
    - expect: It should display: 'Total payers: 1'
    - expect: It should display: 'Total amount (USD): 100.00'

#### 1.7. Payment Date Selection

**File:** `tests/bulk-collection/07-payment-date-selection.spec.ts`

**Steps:**
  1. Verify the Payment date section is displayed
    - expect: 'Step 3: Payment date' section should be visible
    - expect: Description should state: 'This is the actual date your payers' accounts will be deducted.'
  2. Verify the default Earliest Available Date is pre-selected
    - expect: 'Earliest Available Date' radio button should be checked by default
    - expect: The date should be the next available working day (e.g., '12 Apr 2026')
    - expect: Approver deadline information should state: 'This transfer must be approved by 22:59 hrs 10 Apr 2026 by Approver.'
  3. Verify working days information is displayed
    - expect: Information should state: 'Likely to receive in [X] working days'
  4. Verify the custom date option is available
    - expect: A 'Choose date' radio button option should be available
    - expect: A date input field with format 'DD MMM YYYY' should be present

#### 1.8. Transaction References Input

**File:** `tests/bulk-collection/08-references-section.spec.ts`

**Steps:**
  1. Verify the Transaction references section
    - expect: 'Step 4: Transaction references' section should be visible
    - expect: An 'Internal reference' field should be present (optional)
    - expect: A 'Batch ID' field should be present (optional)
  2. Verify the Internal reference field functionality
    - expect: The Internal reference field should show '16 characters left'
    - expect: The field should accept alphanumeric input
  3. Verify the Batch ID field functionality
    - expect: The Batch ID field should show '0/5'
    - expect: The field should accept 5-digit numbers
  4. Verify optional field messages
    - expect: Helper text should state: 'We will assign a reference if this field is left blank'
    - expect: Helper text should state: 'We will assign a batch ID if this field is left blank'

#### 1.9. Proceed to Verification Step

**File:** `tests/bulk-collection/09-proceed-to-verification.spec.ts`

**Steps:**
  1. Verify the Next button is ready to proceed
    - expect: A 'Next' button should be visible at the bottom
    - expect: The button should be enabled when all required fields are filled
  2. Verify all form data is correctly entered
    - expect: All entered data should be preserved
    - expect: No validation errors should appear
  3. Click the 'Next' button to proceed to verification
    - expect: The page should navigate to Step 2: Verify Details
    - expect: URL should change to include '/bulk-collection/preview'
    - expect: The verification page should load with all entered details

#### 1.10. Verify All Transaction Details

**File:** `tests/bulk-collection/10-verify-transaction-details.spec.ts`

**Steps:**
  1. Verify the current step indicator
    - expect: Step 1 (Input Details) should show a checkmark
    - expect: Step 2 (Verify Details) should be highlighted as the current step
    - expect: Step 3 (Submit for Approval) should be grayed out
  2. Verify preview section is displayed
    - expect: A 'Preview bulk collection' section should display
    - expect: An 'Edit' button should be available to go back and modify details
  3. Verify all transaction details are correctly displayed
    - expect: The following details should be displayed and match the entered values:
    - expect: - To: 783700301 (USD) - NAME OF ACCT NO:7837003010
    - expect: - Payment Type: Hong Kong Bulk Collection
    - expect: - Total amount: USD 100.00
    - expect: - Credit Type: Consolidated Credit
    - expect: - Payment date: 11 Apr 2026 (or next available date)
    - expect: - Status: (should show after submission)
  4. Verify collection summary information
    - expect: Collection summary should show:
    - expect: - Total payers: 1
    - expect: - Total amount (USD): 100.00
  5. Verify all payer details are correct
    - expect: Payer details should display:
    - expect: - Payer/Nickname: AutoTestBulkCollection
    - expect: - Bank/Bank Code: BANCO DE ORO UNIBANK, INC, HK BRANC
    - expect: - Account number: 010123456
    - expect: - Mandate ID: Mandate ID002
    - expect: - Amount (USD): 100.00
    - expect: - Transaction code: 38 - Direct Debit(Consolidated posting)
    - expect: - Particulars: TEST COLLECT

#### 1.11. Submit for Approval Process

**File:** `tests/bulk-collection/11-submit-for-approval.spec.ts`

**Steps:**
  1. Verify submission options are available
    - expect: Two options should be available:
    - expect: 1. 'Save as template' checkbox
    - expect: 2. 'Approve now and submit immediately' checkbox
  2. Verify template save option
    - expect: The 'Save as template' checkbox should be unchecked by default
    - expect: Checking this should save the collection configuration for future use
  3. Verify the approval option
    - expect: The 'Approve now and submit immediately' checkbox should be available
    - expect: Checking this should trigger the approval flow
  4. Verify action buttons
    - expect: Both Cancel and Submit buttons should be visible
    - expect: Submit button should be disabled until approval is checked
  5. Check the 'Approve now and submit immediately' checkbox
    - expect: The checkbox should become checked
    - expect: Submit button might remain disabled until approval is completed
  6. Verify approval method options are displayed
    - expect: Approval options should appear:
    - expect: - 'Use the IDEAL Mobile app to approve transaction' with 'Approve now' button
    - expect: - 'Alternatively, use your digital token or security device for approval'

#### 1.12. Approve Transaction via Mobile App

**File:** `tests/bulk-collection/12-mobile-app-approval.spec.ts`

**Steps:**
  1. Click the 'Approve now' button
    - expect: An 'Approve transaction' dialog should appear
    - expect: Dialog title should be 'Approve transaction'
  2. Verify Step 1 instructions
    - expect: Step 1 instructions should display:
    - expect: - 'Go to your registered mobile device and open DBS IDEAL app'
    - expect: - 'or Tap the notification on your device'
  3. Verify Step 2 instructions
    - expect: Step 2 instructions should display:
    - expect: - 'Verify details before swiping to confirm'
  4. Verify approval dialog has all elements
    - expect: A countdown timer should display
    - expect: An 'Enter code manually' button should be available
    - expect: Clicking it should allow manual code entry as an alternative

#### 1.13. Transaction Submission Confirmation

**File:** `tests/bulk-collection/13-transaction-submitted.spec.ts`

**Steps:**
  1. After approval completion, verify the submission was successful
    - expect: The page should navigate to Step 3: Submit for Approval
    - expect: URL should change to include '/bulk-collection/submit'
    - expect: A success message should appear: 'Your bulk collection has been submitted'
    - expect: A green success icon should be displayed
  2. Verify all steps are marked as complete
    - expect: A green checkmark should appear on Steps 1 and 2
    - expect: Step 3 should show completion
  3. Verify the success confirmation message
    - expect: The confirmation message should display:
    - expect: 'Bulk Collection [REFERENCE-NUMBER] on [DATE] with [N] items for [AMOUNT] has been created successfully with status Approved.'
  4. Verify the internal reference is generated
    - expect: An internal reference should be displayed
    - expect: Example: 'EBCOL60409093268'
  5. Verify the transaction status is Approved
    - expect: The Status field should show: 'Approved'

#### 1.14. Final Transaction Details Review

**File:** `tests/bulk-collection/14-final-details-review.spec.ts`

**Steps:**
  1. Verify final transaction details display
    - expect: All entered transaction details should be displayed:
    - expect: - To: 783700301 (USD)
    - expect: - Payment Type: Hong Kong Bulk Collection
    - expect: - Total amount: USD 100.00
    - expect: - Credit Type: Consolidated Credit
    - expect: - Payment date: 11 Apr 2026
    - expect: - Internal reference: Auto-generated reference number
  2. Verify export and print buttons are available
    - expect: Export PDF button should be available
    - expect: Print button should be available
  3. Verify final collection summary
    - expect: A collection summary should show:
    - expect: - Total payers: 1
    - expect: - Total amount (USD): 100.00
  4. Verify complete payer details in final summary
    - expect: Complete payer information should be visible:
    - expect: - All details entered during creation
  5. Verify notification suggestion
    - expect: A notification message should suggest:
    - expect: 'Want to be notified by SMS or Email when this transaction is approved? Set it up in Alerts and Reminders.'
  6. Verify completion action buttons
    - expect: Two action buttons should be present:
    - expect: - 'Make another collection' button
    - expect: - 'Finished' button

#### 1.15. Transaction Completion and Navigation

**File:** `tests/bulk-collection/15-transaction-completion.spec.ts`

**Steps:**
  1. Verify 'Make another collection' button functionality
    - expect: Clicking 'Make another collection' should:
    - expect: - Reset the form
    - expect: - Navigate back to Step 1: Input Details
    - expect: - Allow creating a new bulk collection transaction
  2. Verify 'Finished' button completes the transaction flow
    - expect: Clicking 'Finished' should:
    - expect: - Navigate to the transaction history or dashboard
    - expect: - End the bulk collection creation flow
