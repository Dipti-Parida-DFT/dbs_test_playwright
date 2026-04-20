# Application Behavior Learnings (DBS IDEALX)

> Runtime observations discovered during Playwright test execution.
> Apply these when writing or converting tests to avoid repeat failures.

## Migration Rules — MANDATORY for All Conversions

### 1. No Hardcoded Playwright APIs in Spec Files
- **NEVER** use raw Playwright APIs (`.fill()`, `expect().toContainText()`, `expect().toBeVisible()`) in spec files
- **ALWAYS** use the corresponding `webComponents` framework utility from the start:
  - Text input: `webComponents.enterTextarea()` / `webComponents.enterText()` — NOT `.fill()`
  - Assertions: `webComponents.compareUIVsJsonValue()` — NOT `expect().toContainText()`
  - Non-empty checks: `webComponents.verifyUIElementTextIsNotNull()` — NOT manual truthiness
  - Visibility: `webComponents.isElementVisible()` — NOT `expect().toBeVisible()`
  - Clicks: `webComponents.clickWhenVisibleAndEnabled()` / `webComponents.javaScriptsClick()` — NOT `.click()` directly
- This ensures consistent logging, built-in retries, and framework compliance

### 2. All Locators Must Live in the Page Class
- **NEVER** create in-memory locators in the spec file (e.g., `const myLocator = page.locator(...)`)
- If a locator is **broken** → fix it directly in the page class file (e.g., `AccountTransferPage.ts`)
- If a locator is **missing** → add it directly in the page class file
- If a locator needs a **fallback** → use `.or()` pattern in the page class, not in the spec
- Spec files should ONLY reference locators via `pages.PageName.locatorName`
- During the auto-retry loop (Stage 2.4), locator fixes go into the page class immediately — no in-memory workarounds

## Authentication
- `handleAuthIfPresent()` is **session-scoped** — call only on the **first** `paymentMenu` click per test
- Subsequent `paymentMenu` navigations in the same test do NOT re-trigger the auth dialog
- Never duplicate auth handling in multi-phase tests (e.g., create → reject)

## UX Loading Behavior
- Only use `waitForUXLoading([], page)` where the app **actually** shows a loading spinner
- **Triggers after:** Submit, Next, Finish, rejectConfirmButton, dismissButton clicks (backend processing)
- **Does NOT trigger after:** rejectButton click (opens modal instantly, no spinner)
- When unsure, use `waitElementToBeVisible(targetElement)` for the next expected UI element instead
- Adding false `waitForUXLoading` calls causes test failures if no spinner appears

## Timeout Configuration
- Single-phase tests: use `TIMEOUT.MAX`
- Multi-phase tests (create + reject/approve): use `900000` (15 min) — `TIMEOUT.MAX` (5 min) is insufficient
- Always set timeout in `test.beforeEach` via `test.setTimeout()`

## Transaction Reference Handling
- Capture reference ID after creation via `getReferenceText()` + `getReferenceID()`
- Wrap capture in try/catch — if it fails, set `reference = ''`
- Use conditional logic: if reference exists → `searchAndOpenByReference(ref)`, else → `openViewPaymentViaSearch(type, status)`

## Test Structure
- Always include `test.afterEach` with cleanup guard (skip if test failed)
- Use `test.describe.configure({ retries })` with `CASE_RETRY_TIMES` env var
- Do not add `handleAnnouncementIfPresent()` in beforeEach — not used in SG specs

## Approval Flow (ApproveNow)
- "Without M-Challenge" means: challenge code is auto-displayed via digital token — do NOT click `getChallengeSMSButton`
- Flow: `approveNowCheckbox` → `pushApprovalOption` (expand section) → `enterResponseTextBox` (enter response) → Submit
- "With M-Challenge" (SMS) flow: `approveNowCheckbox` → `pushApprovalOption` → `getChallengeSMSButton` → `enterResponseTextBox` → Submit
- Use `javaScriptsClick` for `approveNowCheckbox` (checkbox requires JS click)
- Use `CONSTANTS.CHALLENGEVIASMSCODE` (`'12345678'`) as the challenge response value

## Existing Payee Flow
- Must click `existingPayeeTabHeader` before calling `addExistingPayee(filterText)` — default tab is "New Payee"
- `addExistingPayee` only fills filter + clicks add button; it does NOT switch the tab
- For existing payee, only `fromAccount`, payee selection, and `amount` are needed — no additional details (reference, emails, etc.)

## Existing Payee Autocomplete (ACT — Account Transfer)
- The `existingPayee` locator targets the `p-auto-complete[@formcontrolname="payee"]` container — NOT the input
- Must target the **inner input** for interaction: `pages.AccountTransferPage.existingPayee.locator('input')`
- Using `.fill()` is too fast — autocomplete dropdown does not filter properly
- **Working pattern:** Click inner input → clear → `typeTextThroughKeyBoardAction` (types char-by-char) → `waitForTimeout(2000)` → ArrowDown → Enter
- Test data must match an **exact existing payee name** in the SIT environment autocomplete dropdown
- `"ACT PAYEE"` confirmed working — maps to `ACT PAYEE - DBSSSGSGXXX - 32323233232` (DBS Bank)
- `"SPI307-ACT-ExistingPayee"` does NOT exist in SIT — causes wrong payee selection (TT payee instead of ACT)
- Wrong payee selection leads to payment type mismatch → form validation error ("Original remitter identity is required")

## ApprovalNow M-Challenge Section (Expandable)
- After clicking `approvalNowCheckBox`, the M-Challenge section may be **collapsed** behind the "Alternatively, use your digital token or security device for approval" link
- The "Get Challenge via SMS" button (`getChallengeSMS`) is NOT always immediately visible
- **Do NOT** use `waitForApproveNowPopUp()` — the ApproveNow section expands **inline** on the preview page, NOT as a dialog/popup
- **Working pattern:** Check if `getChallengeSMS` is visible → if not, click the "Alternatively, use your digital token" text to expand → then wait for SMS button
- The `pushApprovePopUp` locator (`mat-mdc-dialog-title`) targets a dialog that does NOT appear in the M-Challenge flow

## ApprovalNow Payments — Delete Button Disabled
- Payments submitted with ApprovalNow (M-Challenge) are auto-approved and reach Completed status immediately
- The Delete button is **disabled** for Approved/Completed payments on the view page
- Do NOT add a delete step for ApprovalNow test cases — or make it conditional:
  ```typescript
  const isDeleteEnabled = await deleteButton.isEnabled({ timeout: 5_000 }).catch(() => false);
  if (isDeleteEnabled) { /* delete */ } else { /* skip */ }
  ```

## Common Mistakes
- Adding `waitForUXLoading` after every click — only where spinner actually appears
- Duplicating `handleAuthIfPresent` on repeated `paymentMenu` navigation within same test
- Using `TIMEOUT.MAX` for long multi-phase workflows — will timeout at 5 min
- Adding `handleAnnouncementIfPresent()` in beforeEach without verifying framework pattern
- Setting `payeeNicknameLabelValue` to `newPayeeName` — must use `newPayeeNickName` (Protractor source used same value for both; Playwright test data has distinct name vs nickname)

## Checkbox Toggle (Angular Hidden Inputs)
- Angular wraps native `<input type="checkbox">` inside custom components (e.g., `ShuRu`) — the input is hidden and not directly clickable
- **Working pattern:** Click the visible `<label for="checkboxId">` element, then verify the checked state and retry up to 3 times
- `.click()`, `.check()`, `.check({ force: true })`, and `evaluate(el.click())` are all **unreliable** for these hidden checkboxes
- First-attempt success rate is ~50% — always implement a verify-and-retry loop:
  ```typescript
  const checkbox = page.locator('input#checkboxId');
  const label = page.locator('label[for="checkboxId"]');
  for (let attempt = 0; attempt < 3; attempt++) {
    await label.click();
    await page.waitForTimeout(500);
    const isChecked = await checkbox.evaluate(el => (el as HTMLInputElement).checked);
    if (isChecked) break;
  }
  ```
- Applies to: `isBeneAdvising`, `isTransactionNote`, and any other Angular-wrapped checkbox

## View Page Status Loading Delay
- For high-amount ApprovalNow payments (e.g., 90M+), the `#act-view-status` element renders with placeholder text `" status "` for >10 seconds before the actual status value loads
- `compareUIVsJsonValue` has a 10s internal timeout on `toContainText` — insufficient for slow-loading status fields
- **Working pattern:** Use `await expect(actStatusValue).toContainText(expectedStatus, { timeout: 30_000 })` directly instead of `compareUIVsJsonValue` for status assertions on high-amount payments
- This applies specifically to the view page after ApprovalNow submissions; standard-amount payments load faster

## ShuRu Locators (Account Transfer)
- All `ShuRu[@name=...]` and `ShuRu[@formcontrolname=...]` locators in `AccountTransferPage.ts` are **broken** against the current UI
- The `ShuRu` custom element has been replaced with standard HTML elements in the current app version
- Replace with CSS selectors or role-based locators targeting the native HTML elements:
  - `ShuRu[@name="X"]` → `input[name="X"]` or `page.getByRole('textbox', ...)`
  - `ShuRu[@formcontrolname="X"]` → `label[for="X"]` (for checkboxes) or `input#X`
- Always validate locators against live DOM before trusting page class definitions
- The following in-memory locators from TC01 migration have been **permanently added** to `AccountTransferPage.ts` under the `// ---------- New Locators Account Transfer ----------` section:

| Locator Name | Old (Broken) | New (Working) | Reason |
|---|---|---|---|
| `newPayeeNickNameInput` | _(did not exist)_ | `input[placeholder="To identify this payee easily"]` | Mandatory field not in Protractor source |
| `postalCodeInput` | `ShuRu[@name="new-payee-add3"]` | `getByText('Postal code')..getByRole('textbox')` | UI renamed "Address line 3" → "Postal code" |
| `newPayeeAcctNumberInput` | `ShuRu[@name="new-payee-acct-number"]` | `input[name="new-payee-acct-number"]` with `.or()` fallback | ShuRu element replaced with native input |
| `dbsBankRadio` | `ShuRu[@name="bankType-DBS"]` | `getByText('DBS Bank SINGAPORE', { exact: true }).first()` | Now a radio button, not ShuRu |
| `isBeneAdvisingLabel` | _(did not exist)_ | `label[for="isBeneAdvising"]` | Angular hidden checkbox — click label instead |
| `isBeneAdvisingCheckbox` | `ShuRu[@formcontrolname="isBeneAdvising"]` | `input#isBeneAdvising` | For verify-and-retry checked state |
| `isTransactionNoteLabel` | _(did not exist)_ | `label[for="isTransactionNote"]` | Angular hidden checkbox — click label instead |
| `isTransactionNoteCheckbox` | `ShuRu[@formcontrolname="isTransactionNote"]` | `input#isTransactionNote` | For verify-and-retry checked state |
| `validateEmail1`–`validateEmail5` | `emailList` (single aggregate) | `(//*[@id="act-view-emailList"]//span[1]/span/span/span)[N]` | Individual email locators for precise view page validation |
| `approvalNowCheckBox` | `ShuRu[@name="approveNow"]` | `input[name="approveNow"]` | ShuRu replaced with native input (TC02 fix) |
| `challengeResponse` | `ShuRu[@name="responseCode"]` | `input[name="responseCode"]` | ShuRu replaced with native input (TC02 fix) |
| `savaAsTemplateCheckBox` | `ShuRu[@name="saveAsTemplate"]` | `input[name="saveAsTemplate"]` | ShuRu replaced with native input (TC04 fix) |
| `templateName` | `ShuRu[@name="templateName"]` | `input[name="templateName"]` | ShuRu replaced with native input (TC04 fix) |
| `templateNameValue` | `#act-viewTemp-templateName` | `getByText('Template name:').locator('xpath=following-sibling::*[1]')` | ID not in ACT template view DOM (TC04 fix) |

- The **old locators** (`newPayeeAdd3`, `payeeBankRadio`, `newPayeeAcctNumber`, `isBeneAdvising`, `isTransactionNote`, `emailList`) still exist in the page class for backward compatibility but should NOT be used in new tests

## Existing Payee Display Name on View/Template Pages
- The `toExistingPayeeNameValue` (`#act-view-existingPayee-acctName`) shows the **full system payee name** (e.g., `"ACT payee name 20230105 ACT payee n"`), NOT the short autocomplete filter text (`"ACT PAYEE"`)
- Use `verifyUIElementTextIsNotNull()` instead of `compareUIVsJsonValue()` for this field in view page and template view assertions
- This applies to all existing payee flows (TC02, TC03, TC04 and future TCs using existing payee)

## ACT Template View Page
- The ACT template view page does NOT use `#act-viewTemp-templateName` for the template name (unlike Payroll's `#bulk-viewTemp-name`)
- Working locator: `page.getByText('Template name:').locator('xpath=following-sibling::*[1]')` — uses text-based sibling navigation
- The `fromAccountValue`, `amountValue`, and `toExistingPayeeNameValue` locators work on the template view page (shared with payment view page)

## Email Fields (Account Transfer)
- After toggling `isBeneAdvising` checkbox, 5 email fields appear as `textbox "Email"` **without** `name` attributes
- Old locators `ShuRu[@name="email-id-N"]` and `input[name="email-id-N"]` both fail
- **Working pattern:** `page.getByRole('textbox', { name: 'Email' }).nth(N)` (0-indexed)
- Use `safeClick → safeFill → blur()` for each email field

## Payee Nickname (Account Transfer)
- Mandatory field in ACT "New Payee" form — **not present in Protractor source**
- If not filled, form submission fails with validation error: "Payee Nickname is required"
- Locator: `input[placeholder="To identify this payee easily"]`
- No locator exists in `AccountTransferPage.ts` — must be added or used in-memory

## View Page Locators
- Positional XPath locators like `div[N]/span[2]` are fragile and break when UI layout changes
- Prefer id-based locators (`#act-view-*`) which are stable across layout changes
- `#view-act-acctBalance` — element no longer exists on the ACT view page
- `payeeInfo` positional XPath → use individual locators: `toNewPayeeAcctValue`, `payeeAdd1`, `payeeAdd2`
- View page `fromAccountValue` shows the underlying DBS account number, not the display name used during input

## WebComponents Utilities — Preferred Over Hardcoded Playwright APIs

During TC01 ACT migration, initial code used raw Playwright APIs (`.fill()`, `expect().toContainText()`, `expect().toBeVisible()`). These were later replaced with framework `webComponents` utilities for consistency, built-in retries, and standardized logging. Always prefer the framework utility over the raw Playwright equivalent.

### Text Input — Use `enterTextarea()` / `enterText()` instead of `.fill()`
- **Hardcoded:** `await pages.AccountTransferPage.amount.fill(value)`
- **Framework:** `await webComponents.enterTextarea(pages.AccountTransferPage.amount, value)`
- `enterTextarea()` — for `<textarea>` and ShuRu-based text areas (amount, paymentDetail, message, email fields, payeeName)
- `enterText()` — for standard `<input>` fields (nickname, address lines, postal code, account number)
- Both include internal click-clear-type-blur handling; `.fill()` can silently fail on custom Angular components

### Visibility Check — Use `isElementVisible()` instead of `expect().toBeVisible()`
- **Hardcoded:** `await expect(locator).toBeVisible({ timeout: TIMEOUT.LONG })`
- **Framework:** `await webComponents.isElementVisible(page, locator, { timeout: TIMEOUT.LONG })`
- Used before interacting with elements that may render late (postal code, radio buttons, account number input)
- `isElementVisible` returns a boolean and does not throw — safer for conditional flows

### Assertion — Use `compareUIVsJsonValue()` instead of `expect().toContainText()`
- **Hardcoded:** `await expect(locator).toContainText(expectedValue)`
- **Framework:** `await webComponents.compareUIVsJsonValue(locator, expectedValue)`
- Provides standardized pass/fail logging with field name, expected vs actual values
- Used for ALL view page field validations: fromAccount, amount, payeeName, status, paymentType, paymentDetail, message, emails, addresses, totalDeduct, transactionNote

### Non-Empty Assertion — Use `verifyUIElementTextIsNotNull()`
- **Hardcoded:** `expect(await locator.textContent()).toBeTruthy()`
- **Framework:** `await webComponents.verifyUIElementTextIsNotNull(locator)`
- Used for dynamic fields where exact value is unknown: hashValue, deductAmountValue, paymentDateValue, nextApprover

### Email Fields — Use page class locators + `enterTextarea()` instead of `getByRole().nth(N)`
- **Hardcoded:** `page.getByRole('textbox', { name: 'Email' }).nth(0).fill(value)` with safeClick + blur
- **Framework:** `await webComponents.enterTextarea(pages.AccountTransferPage.emailId0, value)`
- Page class defines individual locators (`emailId0` through `emailId4`) — no need for positional nth() selection
- For view page validation, use `validateEmail1` through `validateEmail5` locators with `compareUIVsJsonValue()`

### Email Validation — Use individual locators instead of single `emailList` element
- **Hardcoded:** `await expect(pages.AccountTransferPage.emailList).toContainText(email)` (repeated 5×)
- **Framework:** `await webComponents.compareUIVsJsonValue(pages.AccountTransferPage.validateEmail1, email)` (one per email)
- Each email has its own view page locator (`validateEmail1`–`validateEmail5`) — more precise than checking substring in a single aggregate element

### Summary of Replacements Applied in TC01

| Step | Element | Old (Hardcoded) | New (Framework) |
|------|---------|-----------------|-----------------|
| 5 | amount | `.fill()` | `enterTextarea()` |
| 9 | newPayeeName | `.fill()` | `enterTextarea()` |
| 11 | newPayeeAdd1 | `.fill()` | `enterText()` |
| 13 | postalCodeInput | `expect().toBeVisible()` | `isElementVisible()` |
| 14 | dbsBankRadio | `expect().toBeVisible()` | `isElementVisible()` |
| 15 | newPayeeAcctNumberInput | `expect().toBeVisible()` | `isElementVisible()` |
| 16 | paymentDetail | `.fill()` | `enterTextarea()` |
| 18 | email fields (×5) | `getByRole().nth(N).fill()` | `enterTextarea(emailIdN)` |
| 19 | message | `.fill()` | `enterTextarea()` |
| 29 | all view assertions (×16) | `expect().toContainText()` | `compareUIVsJsonValue()` |
| 29 | hash, deduct, date, approver | manual truthiness check | `verifyUIElementTextIsNotNull()` |
| 29 | email validation (×5) | `emailList.toContainText()` | `compareUIVsJsonValue(validateEmailN)` |

## Template "Make a Payment" Requires Approved Status
- Templates in "Pending Approval" status do NOT show the "Make a Payment" action link
- Only approved/active templates display the `makeAPaymentLink` (`template-list-makeAPayment_0`)
- Templates created without ApprovalNow are submitted as "Pending Approval" — they cannot be used for "payment from template" flows until approved
- The `existingTemplate` test data value must reference a **pre-existing approved** template in SIT
- SIT-confirmed approved ACT template: `"scACTtemplate01"` (not `"ACTAutoTemplateName001"` which does not exist)

## ACT Save-as-Draft — Dialog Reference Pattern
- Save-as-draft shows a **dialog popup** (not a submitted confirmation page like Next → Submit flow)
- Capture the reference via `transactionDeletedPopupLabelMsg` (`//p[@id="dialogMessage"]/span`) + `webComponents.getReferenceID()` — NOT body text extraction
- Click `dismissButton` after capturing the reference, followed by `waitForUXLoading`
- This matches the SG_ManagePayroll save-as-draft pattern (`transferSavedPopupLabel` → `transactionDeletedPopupLabelMsg` → `getReferenceID`)
- `AccountTransferPage` does not extend the base `Page` class, so `getDialogReferenceId()` is NOT available — use the `getTextFromElement` + `getReferenceID` pattern instead

## ACT Save-as-Draft — Status Assertion
- Draft payments show status `"Saved"` on the view page (`testData.status.Saved`)
- The `#act-view-status` element has the **same loading delay** as ApprovalNow payments — it renders `" status "` placeholder for >10s before the actual value loads
- `compareUIVsJsonValue` has a 10s internal timeout which is **insufficient** — use `await expect(actStatusValue).toContainText(expectedStatus, { timeout: 30_000 })` directly
- This loading delay applies to **all** ACT view page status assertions, not just ApprovalNow high-amount payments
- The `saveAsDraft` button locator (`button[@name="save-as-draft"]`) is standard HTML — no ShuRu issues

## ACT Amount Input — Comma-Formatted Values Rejected
- `amountV` test data is `"3,100"` (displayed format with comma separator)
- `enterTextarea()` sends the value literally — the amount field rejects comma input with validation error "Amount is invalid"
- **Working pattern:** Strip commas before entering: `amountV.replace(/,/g, '')`
- The field auto-formats the raw number to display format after input
- Applies to any test entering comma-formatted amounts from test data (not just copy flow)
- View page `amountValue` displays the formatted value (`"3,100"`) — use the original `amountV` for view page assertions

## ACT Copy Flow — Standard Submit Reference Pattern
- Copy + Submit follows the same Next → Submit → body text reference capture as TC01/TC04
- No dialog-based reference (unlike save-as-draft TC06)
- `copyButton` (`xpath=//*[@name="copy"]`) uses `javaScriptsClick` (matching Protractor `jsClick`)
- After copy-submit, the payment status is `"Pending Verification"` (`testData.status.PendingVerification`)

## ACT Edit Flow — Transfer Center Navigation Pattern
- Editing a payment requires navigating to Transfer Center FIRST, then clicking Edit on the view page
- After clicking `paymentMenu`, the page lands on Transfer Center — **must call `waitForTransferCenterReady()` before clicking `makePayment`**
- Skipping `waitForTransferCenterReady()` causes `waitForAccountFormReady()` to fail because `makePayment` click fires before the Transfer Center DOM is ready
- `editButton` (`#act-view-edit`) uses `javaScriptsClick` (matching Protractor `jsClick`)
- `continueBtn` (`#cognitive-continue`) may appear after clicking Edit — wrap in try/catch with 5s timeout
- After editing amount and submitting, the reference ID is the SAME as the original (not a new reference)
- Edit flow validates `editAmount` ("20") on the view page via `compareUIVsJsonValue(amountValue, editAmount)`
- Status after edit remains `"Pending Approval"` (`testData.status.PendingApproval`)

## ACT Edit Flow — Self-Contained Test Pattern
- Protractor TC08 depends on `reference` variable from TC01 (shared state) — this breaks parallel execution
- Playwright migration creates the ACT payment FIRST within TC08, then edits it (self-contained)
- Pattern: Create payment (reuse TC01 flow) → capture reference → navigate to Transfer Center → search → edit → validate
- Reference pattern: SG_ManagePayroll.spec.ts TC007_TC008 `createAndEdit` approach

## ACT Reject+Delete Flow — Payment Status / ApprovalNow Constraints
- Protractor TC09/TC10 depend on a payment in "Pending Approval" status (set by prior serial TCs)
- With `amountV` (3,100) + existing payee → payment status is **"Pending Verification"** → Reject button is **disabled** (maker-checker: same user who creates cannot reject in PendingVerification)
- ApprovalNow checkbox is also **disabled** for this payment type/user with message: "This payment cannot be approved now since it needs to be verified by the verifier first"
- With `amountA1` (10) + existing payee → payment goes to **"Pending Approval"** → Reject button is **enabled**
- Small-amount payments with existing payee bypass the verification step and land directly in "Pending Approval"
- **Working pattern for self-contained Reject/Delete:** Create with `amountA1` (existing payee) → Submit → search in Transfer Center → Reject → validate Rejected → Delete → validate "No information to display"

## ACT Reject Flow — BulkPaymentPage Locators
- `AccountTransferPage.reasonForRejection` uses **broken** `ShuRu[@name="reasonForRejection"]` locator — do NOT use
- `BulkPaymentPage.reasonForRejection` uses **working** `input[@name="reasonForRejection"]` — use this for reject dialog
- `BulkPaymentPage.rejectDialogButton` has the same XPath as AccountTransferPage version and works correctly
- Reject button on view page: use `javaScriptsClick(pages.AccountTransferPage.rejectButton)` after scrolling to bottom
- Scroll pattern: `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` + `waitForTimeout(2000)` before clicking Reject

## ACT Reject Flow — Dialog Reference Capture
- After reject confirmation, a success dialog appears with the reference in `transactionDeletedPopupLabelMsg`
- Capture via `getTextFromElement(transactionDeletedPopupLabelMsg)` → `getReferenceID(text)`
- Dismiss via `clickWhenVisibleAndEnabled(pages.AccountTransferPage.dismissButton)` + `waitForUXLoading`

## ACT Delete Flow — Popup Dismiss Required
- `PayrollPage.deleteOpenPayeeOrReferenceNo()` validates the "Transaction deleted" popup but does **NOT** click OK to dismiss it
- The popup leaves a CDK overlay backdrop (`cdk-overlay-backdrop cdk-overlay-dark-backdrop`) blocking all UI interactions
- **Must click** `pages.PayrollPage.transactionDeletedPopupOkButton` (`button[@name="dismiss"]`) after `deleteOpenPayeeOrReferenceNo()` if the test continues navigating
- TC01 doesn't need this because the test ends after delete; TC09/TC10 continues to verify deletion in Transfer Center

## ACT Delete Validation — Transfer Center Filter
- After deleting a payment, search for the reference in Transfer Center filter (`transferCenterFilter`)
- Validate `noInformationLabel` (`//p[text()="No information to display"]`) is visible
- Use `isElementVisible` + `expect().toContainText()` for the "No information to display" assertion
