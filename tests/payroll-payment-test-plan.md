# DBS IDEAL Payroll Payment Processing Test Plan

## Application Overview

This test plan covers the complete workflow for processing a payroll payment in the DBS IDEAL banking application. The scenario includes user login via SSO, security authentication, navigating to the Payroll payment module, adding a new payee, entering payment details, and verifying the transaction. This test ensures the end-to-end functionality of payroll payment processing including transaction creation, verification, referencing, and deletion of payees.

## Test Scenarios

### 1. Payroll Payment Processing

**Seed:** `tests/seed.spec.ts`

#### 1.1. Complete Payroll Payment Workflow - Login to Transaction Submission

**File:** `tests/payroll-payment/payroll-payment-complete-workflow.spec.ts`

**Steps:**
  1. Navigate to the DBS IDEAL SSO login page at https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin
    - expect: Login page should be displayed with Organisation ID, User ID, and PIN input fields
  2. Enter Organisation ID: SG2BFE1 in the Organisation ID field
    - expect: Organisation ID field should display 'SG2BFE1'
  3. Enter User ID: DBSAUTO0001 in the User ID field
    - expect: User ID field should display 'DBSAUTO0001'
  4. Enter PIN: 123 in the PIN field
    - expect: PIN field should be filled (masked display)
  5. Click the Login button
    - expect: User should be redirected to the Dashboard page
    - expect: Dashboard should show user name 'LEONA ALBRECHT' and location 'Singapore'
  6. Click on 'Pay & Transfer' menu item from the left navigation
    - expect: Security authentication dialog should appear with title 'Enter code manually from device'
    - expect: Dialog should contain instructions for generating security code from IDEAL Mobile App
  7. Enter security code: 123 in the 'Enter security access code' field
    - expect: Security code field should display '123'
  8. Click 'Authenticate now' button to complete security verification
    - expect: User should be redirected to the Payment & Transfer page
    - expect: Payroll option should be visible in the payment types list
  9. Click on 'Payroll' option from the list of payment types
    - expect: Payroll payment form should be displayed
    - expect: Step 1: Payment from (Account selection) section should be visible with account dropdown
  10. Click on the Account dropdown field to view available accounts
    - expect: Dropdown menu should open showing list of available accounts
    - expect: At least one account should be available for selection
  11. Select the first available account (e.g., '021account 021account (SGD)') from the dropdown
    - expect: Selected account should be displayed in the Account field
    - expect: Step 2: Payment to section should become active
    - expect: Tabs for 'Existing payee', 'New PayNow', and 'New payee' should be visible
  12. Click on 'New payee' tab to add a new payer
    - expect: New payee form should be displayed
    - expect: Form should contain fields for: Payee name, Payee nickname, Payee bank ID, Payee bank account number, Payee category
  13. Enter Payee name: TestPayee01 in the Payee name field
    - expect: Payee name field should display 'TestPayee01'
    - expect: Character counter should show remaining characters
  14. Enter Payee nickname: TP01 in the Payee nickname field
    - expect: Payee nickname field should display 'TP01'
  15. Enter Bank ID: 001 in the Payee bank ID search field
    - expect: Bank ID field should display '001'
    - expect: (Optional) Bank search suggestions may appear
  16. Enter Payee bank account number: 1234567890123456 in the account number field
    - expect: Account number field should display '1234567890123456'
    - expect: Field should validate as alphanumeric
  17. Click on Payee category dropdown and select 'Others'
    - expect: Payee category dropdown should show available categories
    - expect: 'Others' should be selectable and selected
  18. Verify the payee details are added to the 'Added payees' section and click to expand if needed
    - expect: Added payees section should display the new payee with name, nickname, bank details, and account number
    - expect: Amount (SGD), Purpose of Payment, and Reference fields should appear below
  19. Enter Amount: 1000 in the Amount (SGD) field for the payee
    - expect: Amount field should display '1000'
    - expect: Payment summary should update with total amount
  20. Select 'SALA - Salary Payment' or appropriate purpose from the Purpose of Payment dropdown
    - expect: Purpose of Payment should be selected and displayed
  21. Enter Transaction code/Reference: REF001 in the Reference for payee field (optional)
    - expect: Reference field should display 'REF001'
  22. Click 'Show optional details' link to see additional fields
    - expect: Optional details section should expand
    - expect: Additional fields for Particulars, Collection details, Message to payee, Emails may appear
  23. Enter Particulars: Test payment for payroll (optional field)
    - expect: Particulars field should accept the text
  24. Enter Message to payee: Payment received (optional field)
    - expect: Message field should accept the text
  25. Enter Email addresses: test@example.com (optional field)
    - expect: Email field should accept valid email format
  26. Verify the Payment date is set - default should be 'Earliest Available Date' (e.g., 09 Apr 2026)
    - expect: Payment date should be displayed as 'Earliest Available Date'
    - expect: Approval deadline should be shown (e.g., 10:00 hrs 09 Apr 2026)
  27. Optionally, select 'Choose date' radio button and pick a future date if needed
    - expect: Calendar or date picker should appear
    - expect: Selected date should be displayed in the Payment date field
  28. Enter Internal reference (optional): PR20260409 in the Step 4: Transaction references section
    - expect: Internal reference field should display the entered text
  29. Enter Batch ID (optional): 12345 in the Batch ID field
    - expect: Batch ID field should accept the 5-digit number
  30. Click the 'Next' button to proceed to verification
    - expect: Page should redirect to Step 2: Verify Details
    - expect: All entered payment details should be displayed for verification
  31. Verify all payment details on the verification screen (account, payee, amount, date, references)
    - expect: All entered information should be displayed correctly
    - expect: Details should match what was entered in Step 1
  32. Click the 'Submit' button to submit the payment for approval
    - expect: Payment should be successfully submitted
    - expect: Success banner/confirmation message should appear
    - expect: Full banner text should be visible indicating payment submission status
  33. Get and record the full banner text displayed after successful submission
    - expect: Banner text should contain information about payment status and reference number
    - expect: Reference number should be captured for later use
  34. Click the 'Finish' button to complete the payment submission process
    - expect: User should be redirected to the Payment history/transactions page or dashboard

#### 1.2. Search and Validate Transaction Details by Reference Number

**File:** `tests/payroll-payment/search-validate-transaction.spec.ts`

**Steps:**
  1. Navigate to Payment History or Transactions page from the Pay & Transfer menu
    - expect: Transactions list should be displayed
    - expect: Search field should be available to filter transactions
  2. In the Transaction search field, enter the Reference number obtained from the submission confirmation
    - expect: Search field should accept the reference number
    - expect: Transactions list should filter to show matching results
  3. Click on the transaction matching the entered Reference number to open detailed view
    - expect: Transaction detail page should open
    - expect: All transaction details should be displayed including: Reference number, Payee details, Amount, Payment date, Status
  4. Validate that the Reference number displayed matches the one from submission
    - expect: Reference number should be visible and match the originally submitted reference
  5. Verify payee details (Name: TestPayee01, Account: 1234567890123456) are displayed correctly
    - expect: Payee name should display as 'TestPayee01'
    - expect: Bank account number should display as '1234567890123456'
  6. Verify the payment amount (SGD 1000) is displayed correctly
    - expect: Amount should show 'SGD 1000.00' or similar format
  7. Verify the payment date is displayed as submitted
    - expect: Payment date should match the date selected during payment creation
  8. Verify the payment status (e.g., Pending Approval, Approved, Released)
    - expect: Status should be displayed and indicate the current state of the payment
  9. Review all optional details if previously entered (Purpose, Particulars, Message to payee)
    - expect: Optional details should be displayed if they were entered during payment creation

#### 1.3. Delete Payee from Transaction

**File:** `tests/payroll-payment/delete-payee.spec.ts`

**Steps:**
  1. From the opened transaction detail view, locate the payee section showing 'TestPayee01' with account '1234567890123456'
    - expect: Payee information should be displayed in the transaction detail page
  2. Look for a delete, remove, or edit button/icon associated with the payee entry (typically represented by trash can or X icon)
    - expect: Delete/Remove action option should be visible next to the payee details
  3. Click the delete/remove button for the payee entry
    - expect: A confirmation dialog should appear asking to confirm deletion
    - expect: Dialog should warn about the consequences of deletion
  4. Click 'Confirm' or 'Yes' button to confirm the deletion of the payee
    - expect: Payee should be removed from the transaction
    - expect: Page should update showing the payee is no longer in the list
  5. Verify that the payment summary updates after payee deletion (e.g., Total amount should change to 0)
    - expect: Payment summary should reflect the removal of the payee
    - expect: Total payees should decrease by 1
  6. Check if the transaction still exists or if a new submission is required
    - expect: Transaction status may change or user may be prompted to re-submit
    - expect: Application should handle the deletion gracefully without errors

#### 1.4. Error Handling and Validation Tests

**File:** `tests/payroll-payment/error-handling.spec.ts`

**Steps:**
  1. Attempt to submit a payment without selecting an account in Step 1
    - expect: Error message should appear indicating account selection is required
    - expect: Next button should remain disabled
  2. Attempt to add a payee without entering the required Payee name
    - expect: Validation error should appear indicating Payee name is required
    - expect: 'Add payee' button should remain disabled
  3. Attempt to add a payee with invalid bank account number format (e.g., special characters)
    - expect: Validation error should appear for invalid account number format
    - expect: Only alphanumeric characters should be accepted
  4. Attempt to enter an invalid amount (non-numeric or negative value)
    - expect: Validation error should appear indicating invalid amount
    - expect: Amount field should only accept positive numeric values
  5. Attempt to set a payment date in the past
    - expect: Validation error should appear or past date should be disabled
    - expect: Only valid future dates should be selectable
  6. Attempt to enter excessive characters in optional fields (Particulars, Message)
    - expect: Character limit should be enforced
    - expect: Excess characters should not be allowed to be entered
