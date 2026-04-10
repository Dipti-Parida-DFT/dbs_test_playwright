# Bulk Collection Transaction Creation Test Plan

## Application Overview

This test plan covers the end-to-end process of logging into DBS IDEAL application and creating a Bulk Collection transaction. The application is a payment and transfer management system where authorized users can initiate collection payments from multiple payers. The test scenario includes authentication with SSO credentials, navigating to the Payment & Transfer menu, providing security code authentication, and initiating a Bulk Collection transaction through a multi-step form.

## Test Scenarios

### 1. Bulk Collection Transaction Creation

**Seed:** `tests/bulk-collection.spec.ts`

#### 1.1. Login and Navigate to Bulk Collection Creation

**File:** `tests/bulk-collection/login-and-navigate.spec.ts`

**Steps:**
  1. Navigate to the SSO login page at https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin
    - expect: The login page should display with three input fields: Organisation ID, User ID, and PIN
    - expect: A Language dropdown should be visible showing English as default option
    - expect: The IDEAL SHIFT R8.8 logo should be visible at the top
  2. Enter Organisation ID 'SHKLT008' in the Organisation ID field
    - expect: The text 'SHKLT008' should be entered into the Organisation ID textbox
  3. Enter User ID 'DBSAUTOHK002' in the User ID field
    - expect: The text 'DBSAUTOHK002' should be entered into the User ID textbox
  4. Enter PIN '123' in the PIN field
    - expect: The PIN should be masked in the textbox (showing dots or asterisks)
  5. Click the Login button
    - expect: The application should navigate to the dashboard page
    - expect: The page URL should change to include /idealx/
    - expect: The Dashboard menu item should be highlighted in the left navigation
    - expect: User greeting 'Hi DBSAUTOHK002' should be visible
  6. Click on 'Pay & Transfer' menu item in the left navigation
    - expect: A security code dialog should appear with the title 'Enter code manually from device'
    - expect: The dialog should display instructions for transferring code from IDEAL Mobile App
    - expect: A textbox labeled 'Enter security access code' should be present
    - expect: An 'Authenticate now' button should be visible

#### 1.2. Enter Security Code and Access Pay & Transfer

**File:** `tests/bulk-collection/security-code.spec.ts`

**Steps:**
  1. Enter security code '123' in the security access code textbox
    - expect: The security code '123' should be entered in the textbox
    - expect: The Authenticate now button should remain clickable
  2. Click the 'Authenticate now' button
    - expect: The security dialog should close
    - expect: The application should navigate to the Pay & Transfer page
    - expect: The page URL should contain '/transfers/transfer-center/transactions'
    - expect: The page heading 'Pay & Transfer' should be displayed
    - expect: A list of transaction options should be visible
  3. Verify that Bulk Collection option is visible in the payment options list
    - expect: The 'Bulk Collection' option should be visible in the transaction type list
    - expect: The option should be clickable
    - expect: Other options like 'Pay Local / Overseas Payee', 'Payroll', 'Management Payroll', 'Bulk Payment' should also be visible

#### 1.3. Create Bulk Collection Transaction - Input Details

**File:** `tests/bulk-collection/create-transaction.spec.ts`

**Steps:**
  1. Click on the 'Bulk Collection' option from the transaction menu
    - expect: The Bulk Collection creation form should load
    - expect: The page heading should be 'Bulk Collection'
    - expect: The description 'Collect payment from payers who have authorised you' should be visible
    - expect: Three steps should be displayed: '1. Input Details', '2. Verify Details', '3. Submit for Approval'
    - expect: Step 1 should be highlighted as the current step
  2. Verify the Account dropdown is available and clickable
    - expect: An 'Account' field should be visible with a dropdown
    - expect: The dropdown should display 'Select' as placeholder text
    - expect: The field should be marked as required or indicate that an account must be selected
  3. Verify the Credit Type dropdown is available
    - expect: A 'Credit Type' field should be visible (labeled as 'Debit Type' on screen)
    - expect: The dropdown should contain options for credit type selection
    - expect: Helper text should explain: 'Select credit type to display one consolidated credit record or itemized credit records in your bank statement'
  4. Verify Step 2: Collect from section with Existing payee tab
    - expect: Step 2 heading 'Step 2: Payment to' should be visible
    - expect: An 'Existing payee' tab should be present and selected
    - expect: Message should display: 'The payees will be displayed after you select an account.'
  5. Verify Step 3: Payment date section
    - expect: Step 3 heading 'Step 3: Payment date' should be visible
    - expect: A radio button for 'Available Date' should be checked by default
    - expect: The default date should show 'Available Date:12 Apr 2026' or next available working date
    - expect: Information about approver deadline should be displayed
    - expect: A 'Choose date' radio button option should be available for custom date selection
  6. Verify Step 4 | 5: References section
    - expect: Step 4 | 5 heading 'Step 4 | 5: References' should be visible
    - expect: A 'Reference' textbox should be present with label '(optional)'
    - expect: A 'Batch ID' textbox should be present with label '(optional)'
    - expect: Helper text should indicate: 'Your own reference for this bulk payment' for Reference field
    - expect: Helper text should indicate: 'We will assign a reference if this field is left blank' and 'We will assign a batch ID if this field is left blank'
  7. Verify action buttons at the bottom of the form
    - expect: A 'Cancel' button should be present
    - expect: A 'Save as draft' button should be present
    - expect: A 'Next' button should be present to proceed to the next step

#### 1.4. Bulk Collection Transaction - Form Validation

**File:** `tests/bulk-collection/form-validation.spec.ts`

**Steps:**
  1. Attempt to click 'Next' button without selecting an Account
    - expect: The form should not proceed to the next step
    - expect: An error message should be displayed indicating that Account is a required field
    - expect: Focus should remain on the Account dropdown field
  2. Attempt to click 'Next' button without selecting a Credit Type
    - expect: The form should validate and show an error for the Credit Type field
    - expect: Error message should indicate Credit Type is required
  3. Cancel the form by clicking the 'Cancel' button
    - expect: The form should close or navigate back
    - expect: The user should return to the Pay & Transfer menu or transaction history page
  4. Save the transaction as draft by clicking 'Save as draft' without filling required fields
    - expect: A validation error should be displayed for missing required fields
    - expect: The form should not be saved if required fields are empty

#### 1.5. Bulk Collection Transaction - Optional Fields

**File:** `tests/bulk-collection/optional-fields.spec.ts`

**Steps:**
  1. Enter text in the Reference field (optional)
    - expect: Text should be entered successfully in the Reference textbox
    - expect: A character counter should display remaining characters (e.g., '16 characters left')
    - expect: The field should accept alphanumeric characters
  2. Enter a Batch ID in the Batch ID field (optional)
    - expect: A 5-digit numeric value can be entered in the Batch ID field
    - expect: Character counter should display '0/5' when a 5-digit number is entered
  3. Verify that the form allows submission without Reference and Batch ID
    - expect: The form validation should not require these fields to be filled
    - expect: System message should indicate: 'We will assign a reference if this field is left blank' and 'We will assign a batch ID if this field is left blank'

#### 1.6. Bulk Collection Transaction - Payment Date Selection

**File:** `tests/bulk-collection/payment-date.spec.ts`

**Steps:**
  1. Verify the default Available Date option is pre-selected
    - expect: The radio button for 'Available Date:12 Apr 2026' should be checked
    - expect: The date should be the next available working day
    - expect: Approver deadline information should show: 'This transfer must be approved by 22:59 hrs 10 Apr 2026 by your Approver'
  2. Select the 'Choose date' radio button option
    - expect: The 'Choose date' radio button should become selected
    - expect: A date input field 'DD MMM YYYY' should become enabled
    - expect: The field should allow date selection
  3. Enter a custom date in the date field
    - expect: The date picker should accept the input
    - expect: Only valid working dates should be allowed (not weekends or public holidays)
    - expect: Error message should display: 'The earliest payment date is the next working day' if a past or invalid date is entered

### 2. Error Handling and Edge Cases

**Seed:** `tests/bulk-collection-errors.spec.ts`

#### 2.1. Login Error Handling

**File:** `tests/bulk-collection/login-errors.spec.ts`

**Steps:**
  1. Enter incorrect Organisation ID and attempt login
    - expect: An error message should be displayed indicating invalid Organisation ID
    - expect: The user should remain on the login page
  2. Enter incorrect PIN and attempt login
    - expect: An error message should be displayed indicating invalid credentials
    - expect: The user should remain on the login page
    - expect: The login attempt should be recorded for security purposes
  3. Leave one or more required fields empty and click Login
    - expect: Form validation should prevent submission
    - expect: Error messages should indicate which fields are required

#### 2.2. Security Code Error Handling

**File:** `tests/bulk-collection/security-code-errors.spec.ts`

**Steps:**
  1. Enter an incorrect security code and click Authenticate
    - expect: An error message should be displayed indicating the security code is invalid
    - expect: The user should be prompted to enter the correct code again
    - expect: The security dialog should remain open
  2. Leave the security code field empty and click Authenticate
    - expect: Validation error should indicate the field is required
    - expect: The Authenticate button should not process the request
  3. Click 'Lost your Security Device?' link
    - expect: The link should navigate to the DBS help form page
    - expect: A new tab or page should open with the form-list.page for device recovery

#### 2.3. Session Timeout and Navigation

**File:** `tests/bulk-collection/session-timeout.spec.ts`

**Steps:**
  1. Wait for session timeout duration without any user activity
    - expect: User should be automatically logged out
    - expect: A timeout message should be displayed
    - expect: User should be redirected to the login page
  2. Navigate back from Bulk Collection form to Pay & Transfer menu
    - expect: The Pay & Transfer transaction list should be displayed
    - expect: All transaction types should be visible again
    - expect: User should not lose their session
