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

### High-Amount ApprovalNow (ICT — Intra Company Transfer)
- When the payment amount exceeds the user's single-approval limit (e.g., 90,000,001), the preview page shows an **"Approve Now" text link** instead of the hidden checkbox (`input[name="approveNow"]`)
- The checkbox locator will timeout — must click the "Approve Now" link via `page.getByText('Approve Now', { exact: false })`
- After clicking the link, the challenge response field appears directly (without M-Challenge) — no "Get Challenge via SMS" click needed
- The final status for high-amount without M-Challenge is **"Partial Approved"** (not Completed), because the amount requires multi-level approval
- For standard-amount (e.g., 1100), the hidden checkbox pattern still applies

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

## Transaction Delete (Cleanup)
- **ALWAYS** use the reusable method `pages.PayrollPage.deleteOpenPayeeOrReferenceNo()` for deleting transactions from the view page
- Do NOT manually click delete button + dialog + dismiss — use the shared helper instead
- **Pattern:**
  ```typescript
  await pages.PayrollPage.deleteOpenPayeeOrReferenceNo({
    transactionDeleted: testData.AccountTransfer.transactionDeleted,
    internalReference: reference,
  }, reference);
  ```
- The method clicks Delete → confirms in the dialog → validates "Transaction deleted" popup text + reference number
- The method does NOT dismiss the popup or navigate away — if further navigation is needed after delete, dismiss the popup manually
- Works across all payment types (ACT, ICT, TT, CrossBorder, Payroll) — same shared delete dialog component
- If the delete button may be disabled (e.g., Completed/Approved status), wrap in an enabled check before calling

## Payment Template Delete (Cleanup)
- Template deletion is a **3-step flow** (not 2):
  1. Select template checkbox → click Delete button on list → navigates to "Confirm templates to delete" page (spinner appears)
  2. Click Delete on confirm page → opens "Confirm delete" popup dialog **instantly** (NO spinner)
  3. Click Delete in the dialog (`confirmDeletebutton` / `id="dialogDelete"`) → backend processes (spinner appears)
  4. Dismiss "Template(s) deleted" popup via OK button
- **Critical:** Do NOT add `waitForUXLoading` between step 2 (confirm page Delete) and step 3 (dialog Delete) — the popup opens instantly with no spinner, and waiting for a non-existent spinner causes timeout/hang
- The `deletebuttonTemplate` locator (`//button[@name="delete"]`) is reused for both the list page and the confirm page — same `name="delete"` attribute
- The `confirmDeletebutton` locator (`//button[@name="delete" and @id="dialogDelete"]`) targets the final dialog button specifically
- After `deleteOpenPayeeOrReferenceNo()` in the same test, if you need to navigate away (e.g., to templates page), you MUST dismiss the "Transaction deleted" popup first — it blocks all navigation with a `cdk-overlay-backdrop`

## To Account Autocomplete (ICT — FCY Accounts)
- The `toAccountWithFCY` value ("878787") does NOT work reliably with `selectAutoComplete` — autocomplete dropdown fails to show/select
- For ICT tests that need template save, use the standard `toAccount` ("WENDY JONES") which is confirmed working
- The FCY account causes the "To account is required" validation error if not properly selected, blocking the Next button

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

## INTL New Payee Form (Cross Border ACH — TC004)
- The INTL New Payee form has **different input names** than the standard (domestic) new payee form:
  - Payee name: `new-payee-payeeName`
  - Payee nickname: `new-payee-nick-name` (NOT `new-payee-nickname` — note the extra hyphen)
  - Address line 1: `new-payee-add1`
  - Bank ID search: `swift-selector` (NOT `bulk-newPayee-bankId`)
  - Routing code: `new-payee-routing-code`
  - Account number: `new-payee-acct-number`
  - Payee category: **no name attribute** — use `getByPlaceholder('Please select')`
- **Payee nickname is mandatory** — the form won't enable "Add payee" without it
- **Payee category is mandatory for INTL payees** — dropdown has no `name` attr; use click → ArrowDown → Enter to select first option
- **Bank ID search** uses `keyboard.type()` (NOT `fill()`) to trigger auto-search. After typing, wait 5s, then click `.search-result-container` first result
- **"Add payee" button stays disabled** until ALL mandatory fields are filled: payee name, nickname, address, bank ID (resolved), routing code, account number, payee category
- The Protractor source did NOT fill nickname or payee category — these were added to the UI after the Protractor test was written
- Use `page.evaluate` to dump all `<input>` elements' `name`, `placeholder`, `value` attributes to discover actual field names when ARIA snapshot doesn't show them
- **Strict mode violations**: INTL form fields like `purposePaymentLine`, `additionalInfoLine`, `paymentDetailLine` may resolve to **2 elements** when multiple payees exist on the form — always use `.first()` on these locators in the spec

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

## Template Approval Flow (Multi-User — TC005 ICT)
- Newly created templates have **"Pending Approval"** status — the "Make a Payment" link is NOT available until approved
- Template approval requires a **different user** (approver) to log in and approve
- The Protractor source relied on serial test execution (template approved in prior test run) — Playwright tests are independent so must self-approve

### Logout/Login Pattern for Multi-User Flows
- **Do NOT use `javaScriptsClick(logoutButton)`** from the submitted page — it hangs because:
  - The submitted page may have overlays blocking the logout button
  - `javaScriptsClick` does `evaluate(el.click())` which silently fails if the element isn't in the visible DOM hierarchy
- **Working pattern:** Use `loginPage.goto()` to navigate directly to the login URL — this effectively logs out the current session and shows the login form:
  ```typescript
  const loginPageApprover = new LoginPage(page);
  await loginPageApprover.goto();  // navigates to SIT login URL, implicitly logs out
  await loginPageApprover.login(companyId, approverUserId, pin);
  pages = new PaymentsPages(page);
  ```
- After `login()`, always call `pages.AccountTransferPage.waitForMenu()` before clicking `paymentMenu` — ensures the dashboard is fully loaded

### Template Approve Button Locators
- Two buttons are involved in template approval (note case difference):
  - `approveButton`: `//button[@name="approve"]` — opens the approve section on the template view page
  - `confirmApproveButton`: `//button[@name="Approve"]` — confirms the approval action
- Both were added to `PaymentTemplatesPage.ts`
- After confirmation, a dismiss popup appears — click `dismissButton` (`//button[@name="dismiss"]`)

### Amount Input for Template Payments
- The amount field in "Create from Template" page is pre-populated from the template
- To change the amount: `click()` → `fill('')` → `enterTextarea(field, value)`
- **Do NOT use comma-separated values** (e.g., "5,100") — the input field does not accept commas
- Use plain numeric strings: `"5100"` (stored as `templateAmount` in test data)
- The displayed/validated amount on the view page WILL show commas: "SGD 5,100.00"

### ICT Approver User
- For ICT templates in SIT: use `'DBSAUTOSGICT02'` as the approver user
- Same `loginCompanyId` (`"SG2BFE1"`) and PIN (`123`) as the primary user
- The `verifyUserId` from test data (`"SPI307R02"`) did NOT work — use `DBSAUTOSGICT02` instead

## Save as Draft Flow (TC006 ICT)
- Save as Draft skips the Preview page entirely — **no `nextButton` or `submitButton`**
- After clicking `saveAsDraft`, a **dialog popup** appears with the reference ID
- Dialog reference locator: `dialogMessageLabel` = `//p[@id="dialogMessage"]/span` — same XPath as ACT's `transactionDeletedPopupLabelMsg`
- To capture reference: `getTextFromElement(dialogMessageLabel)` → `getReferenceID(text)`
- After capture, click `dismissButton` to close the dialog
- The saved draft appears in Transfer Center with status `"Saved"` (from `testData.status.Saved`)
- Test data field used: `testData.IntraCompanyTransfer.transactionNote` (NOT `additionNote`)
- Cleanup: use `deleteOpenPayeeOrReferenceNo()` from the View Payment page after validation
- Transaction status validation: use `compareUIVsJsonValue()` (not `expect().toContainText()`) — consistent with all other field validations in the suite

- The **old locators** (`newPayeeAdd3`, `payeeBankRadio`, `newPayeeAcctNumber`, `isBeneAdvising`, `isTransactionNote`, `emailList`) still exist in the page class for backward compatibility but should NOT be used in new tests

## Copy Payment Flow (TC007 ICT)

### Angular p-autocomplete After Copy — DO NOT Re-Select
- After clicking the Copy button, Angular p-autocomplete fields (From Account, To Account) display chips with correct values — they are **already bound internally**
- **NEVER** call `selectAutoCompleteWithFilter` or `selectAutoComplete` on pre-filled autocomplete fields after Copy
- Re-selecting breaks Angular's internal form binding → form becomes invalid → Next button fails to navigate to Preview
- **Only modify fields that need NEW values** (e.g., amount). Leave pre-filled autocomplete fields untouched
- This rule applies to ALL Copy and Edit operations across payment types (ICT, ACT, TT, CrossBorder)
- Original Protractor TC07 sequence after Copy: `copyButton.jsClick() → jiazhai() → amount.qingChu() → amount.ShuRu(amountV) → jiazhai() → nextButton.click()`
- Equivalent Playwright: `javaScriptsClick(copyButton) → waitForCopyReady() → amount.click() → amount.fill('') → enterTextarea(amount, value) → clickWhenVisibleAndEnabled(nextButton)`

### Checkbox State Inheritance After Copy
- When a payment is copied, checkbox states (e.g., "Transaction Note" toggle) are **inherited from the source**
- If the source had transaction note enabled, the copied form will also have it enabled
- **Always check `isChecked()` before toggling** — calling `toggleAngularCheckbox` on an already-checked box will UNCHECK it:
  ```typescript
  const isChecked = await pages.IntraCompanyTransferPage.isTransactionNoteCheckbox.isChecked().catch(() => false);
  if (!isChecked) {
    await webComponents.toggleAngularCheckbox(page, label, checkbox);
  }
  ```
- After confirming the checkbox is checked, clear and re-fill the textarea to overwrite inherited content:
  ```typescript
  await transactionNoteField.click();
  await transactionNoteField.fill('');
  await webComponents.enterTextarea(transactionNoteField, newValue);
  ```

### Variable Scoping in Multi-Phase Tests
- When the same UI element (e.g., "Earliest available date" radio) is used in multiple phases of a single test, use **distinct variable names** per phase
- Example: `earliestDateRadioSrc` (Phase 1) vs `earliestDateRadioCopy` (Phase 3) — avoids `const` redeclaration errors
- Applies to any `const` declaration that appears in multiple phases within the same `test()` block

### Message to Approver = Transaction Note
- "Message to your Approver" is the **same field** as the `transactionNote` textarea (`//textarea[@name="transactionNote"]`)
- Input data: `testData.IntraCompanyTransfer.additionNote` = "messageToOrderingBank"
- View page display: `messageToApproverValue` locator (`#ict-view-transactionNote`)
- Toggle checkbox: `isTransactionNote` / `isTransactionNoteLabel`

### Copy Payment — Earliest Available Date
- After Copy, the payment date may be stale (inherited from source)
- Add a conditional click on "Earliest available date" radio if visible:
  ```typescript
  const earliestDateRadio = page.getByText('Earliest available date', { exact: false });
  if (await earliestDateRadio.isVisible({ timeout: TIMEOUT.VERYMIN }).catch(() => false)) {
    await webComponents.javaScriptsClick(earliestDateRadio);
  }
  ```
- This ensures the copied payment uses a valid future date

## Existing Payee Display Name on View/Template Pages
- The `toExistingPayeeNameValue` (`#act-view-existingPayee-acctName`) shows the **full system payee name** (e.g., `"ACT payee name 20230105 ACT payee n"`), NOT the short autocomplete filter text (`"ACT PAYEE"`)
- Use `verifyUIElementTextIsNotNull()` instead of `compareUIVsJsonValue()` for this field in view page and template view assertions
- This applies to all existing payee flows (TC02, TC03, TC04 and future TCs using existing payee)

## Autocomplete with Multiple Currency Matches (ICT)
- When an account exists under multiple currencies (e.g., SGD, CAD, USD), generic `selectAutoComplete()` picks the **first** dropdown suggestion which may be the wrong currency
- **Working pattern:** Use `selectAutoCompleteWithFilter(page, container, searchText, filterText, listItemLocator)` — types the search text, then clicks only the suggestion matching `filterText`
- The `filterText` must be **specific enough** to uniquely identify one dropdown item:
  - BAD: `"(SGD)"` — too broad, matches other SGD accounts like "021account (SGD)"
  - GOOD: `"03030303 (SGD)"` — includes account number + currency, uniquely identifies one item
- The `searchText` should trigger the dropdown but doesn't need to be the full display value:
  - e.g., `"03030303"` types fewer chars but still shows the target account in suggestions
- The `listItemLocator` (e.g., `page.locator('.ui-autocomplete-list-item')`) must be defined in the **page class**, not hardcoded in `webComponents.ts`
- View page displays the **account number** (e.g., `"03030303"`), NOT the autocomplete search/display text — use a separate `fromAccountViewValue` in test data for assertions

## No Hardcoded Locators in webComponents.ts
- `webComponents.ts` is a **shared utility** used by all spec files — it must NOT contain any page-specific or app-specific locators
- If a method needs a DOM selector (e.g., `.ui-autocomplete-list-item` for dropdown items), accept it as a **Locator parameter** from the caller
- The caller's page class defines the locator; the spec passes it to `webComponents`
- This keeps `webComponents` generic and reusable across different applications/pages

## No Hardcoded Values in Spec Files
- **ALL** assertion values, search texts, filter texts, and credentials must come from `SG_testData.json`
- If the view page shows a different format than the search input (e.g., account number vs search text), create a **separate test data field** for the view assertion:
  - `fromAccount`: text typed into autocomplete input
  - `fromAccountFilter`: text to filter the dropdown suggestion
  - `fromAccountViewValue`: text expected on the view page
- Never hardcode strings like `'03030303'` or `'Pending Approval'` in spec — reference `testData.X.Y.Z`

## Delete Cleanup Step
- Always add a delete step at the end of "Create" test cases to clean up test data
- Delete is only possible for payments in "Pending Approval" status — ApprovalNow payments cannot be deleted
- Pattern: Navigate to Transfer Center → Search by reference → Open view page → Click Delete → Confirm in dialog
- Make delete conditional if status might vary: check `deleteButton.isEnabled()` before attempting

## toggleAngularCheckbox — Reusable Method
- Use `webComponents.toggleAngularCheckbox(page, labelLocator, checkboxLocator, checked)` for ALL Angular hidden checkboxes
- Both `labelLocator` and `checkboxLocator` must be defined in the page class (e.g., `isTransactionNoteLabel`, `isTransactionNoteCheckbox`)
- Never inline checkbox toggle logic in spec files — always use the shared method

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

## ACT Edit with FX Contracts — Non-DOL User Deduction Validation (TC11)
- TC11 creates a payment with `amountA1` (small amount → Pending Approval), then edits with cross-currency (USD) and FX contracts
- Protractor validates **deduction amounts at three checkpoints** — all three must be preserved in migration:
  1. **Form page** (after FX contract selection, before Next): `deductAmt` and `TotalAmtDeduct` against `testData.AccountTransfer.deductAmt` ("SGD 16.32")
  2. **Preview page** (after Next): `deductAmountValue` and `totalDeductValue` against `deductAmt`; `AmtToDeductValue` and `AmtToDeductValue1` against `deductAmt1` ("8.16")
  3. **View page** (after submit + re-navigate): `amountValue` against `editAmount`; `deductAmountValue` and `totalDeductValue` against `deductAmt`; `AmtToDeductValue` and `AmtToDeductValue1` against `deductAmt1`
- FX deduction amounts are **static in test data** (`deductAmt`/`deductAmt1`) — they are NOT dynamic FX rates. Validate against test data, not captured UI values
- All deduction locators exist in `AccountTransferPage.ts`: `deductAmt`, `TotalAmtDeduct`, `deductAmountValue`, `AmtToDeductValue`, `AmtToDeductValue1`, `totalDeductValue`
- Use `webComponents.compareUIVsJsonValue()` for all deduction assertions — no `console.log` or raw `expect()`
- The "Original remitter identity" field does NOT need explicit filling for TC11 — it auto-populates when using the correct existing payee and from-account combination

## ACT Verify via My Verify — Re-Login User (TC012)
- TC012 creates a high-amount ACT payment (amountV = "3,100" → PendingVerification), then logs out and re-logs in with a verify user to verify it via Approval → Verify Payment tab
- The verify user must be `DBSAUTO0001` (same as `testData.ManagePayroll.SIT.loginUserIdUser2`) — NOT `testData.AccountTransfer.verifyUserId` ("SPI307A17")
- `SPI307A17` triggers a Dashboard-not-found error after login — likely lacks proper entitlements for the SIT environment
- **Working login path:** `testData.ManagePayroll.SIT.loginUserIdUser2` → "DBSAUTO0001" — successfully lands on Dashboard and can navigate to Approval menu
- After verify: transaction moves from "Pending Verification" → "Pending Approval" in Transfer Center
- Post-verify delete uses `PayrollPage.deleteOpenPayeeOrReferenceNo()` + `transactionDeletedPopupOkButton` dismiss (same as TC09/TC10 pattern)
- The Verify tab search requires `hardWait(page)` before entering reference in `transactionFilter` — otherwise filter may not register input
- After verification, search the same reference in Verify tab to confirm `noInformationToDisplay` appears (transaction no longer pending verification)

## ACT Approve via Transfer Center — SMS Challenge Flow (TC013)
- TC013 creates a small-amount ACT payment (amountA1 → PendingApproval), then approves it via the view page SMS challenge flow
- The approve flow on the ACT view page follows the **same pattern as ManagePayroll TC012**:
  1. Scroll to `PayrollPage.approveSubmitButton` + `javaScriptsClick` (expand approve section)
  2. Click `PayrollPage.pushApprovalOption` (expand SMS sub-section)
  3. Click `AccountTransferPage.getChallengeSMS` (request SMS code)

## Cross Border ACH — Pagination Dot Navigation
- The Cross Border ACH menu item is on the **second page** of the Pay & Transfer carousel
- The page dot locator `(//li[contains(@class, "page-point")])[2]` works — exact class match fails because Angular adds extra classes (`ng-star-inserted`)
- Use `webComponents.clickPaginationDot(locator)` utility — locator defined in the page class, not hardcoded in spec or utility

## Cross Border ACH — PrimeNG Autocomplete Pattern
- `fromAccount`, `paymentCountry`, `debitType`, `selectedIntermediaryCountry` all use `p-auto-complete` Angular components
- **Working pattern:** Click inner `input` → clear → type text char-by-char → wait 3s for suggestions → try clicking `ul li` first suggestion → fallback to ArrowDown + Enter
- Use `webComponents.selectAutoComplete(page, container, text)` utility — reusable across all `p-auto-complete` fields
- `debitType` only appears **after** `paymentCountry` is selected — add `waitForUXLoading` between selections
- The page class method `CrossBoarderACHPage.selectAutoComplete()` delegates to the WebComponents utility

## Cross Border ACH — Existing Payee Tab
- The existing payee tab ID is `#ux-tab-labelExistingPayee` (not `#labelExistingPayee_0`)
- After filtering, if no matching payee is found (no "Add" button visible), clear the filter and select the first available payee
- SIT-confirmed payee: `"AAAAAA-HK-TESTING"` → resolves to `AAAAAA-HK-TESTING-CBA-0091` with account `34567890`

## Cross Border ACH — Intermediary Bank Search
- Bank ID search field: `input#ux-bank-search-0` (NOT `//bp-payee-intermediary//input` which matches 4 elements → strict mode violation)
- After entering bank ID, the search result appears in a `table tr td` element — click it to select
- Use `enterText()` (not `enterTextarea()`) for the bank search input

## Cross Border ACH — Angular Hidden Checkbox (Message to Payee)
- `#isBeneAdvising0` is a hidden Angular checkbox — `clickWhenVisibleAndEnabled` fails because element is `hidden`
- **Working pattern:** Click `label[for="isBeneAdvising0"]` using `javaScriptsClick()`
- Do NOT use `.or()` with `getByText('Send up to 5 notifications')` — resolves to 2 elements (label + span), causing strict mode violation
- Use exact `label[for="..."]` selector only

## Cross Border ACH — View Page (Transfer Center)
- View page uses `crsbrd-view-*` IDs: `hashValue`, `fromAccount`, `paymentCountry`, `payAmt`, `debitType`, `paymentDate`, `custRef`, `batchID`, `name_0`, `payee-bankCode_0`, `acctNum_0`, `amount_0`, `pendingStatus_0`, `paymentDetails_0`, `adviceContent_0`, `email_0`
- `#crsbrd-view-acctBalance` does NOT exist on the view page — skip balance validation
- `#crsbrd-view-payee-bankName_0` exists but is **hidden** (empty `<strong>` tag) — skip bank name validation
- FX section uses `#fxDolViewSection` table with `tbody/tr/td[N]/span` locators for contract ref, exchange rate, amount to transfer/deduct
- Status locator: `#bulk-viewTemp-status`
- Payment summary ("Total payees:1", "Total amount (HKD): 1.00") — use `page.getByText(/Total payees:\s*\d/)` regex pattern (not ID-based)
- "Show optional details" button on view page: `#crsbrd-show-optBtn_0`
- Activity log container class: `payment-history` — validate all log entries (Action, User, Date) against this single parent element using `compareUIVsJsonValue`

## Cross Border ACH — Preview & Submitted Page Wait
- Preview page: wait for `submitButton` visibility (not `fromAccountPreview` which may not exist)
- Submitted page: wait for `page.getByText('Pending Approval').first()` visibility
- Do NOT use `.or()` for wait locators — if both branches resolve, Playwright strict mode fails

## Cross Border ACH — Timeout Constants
- Use `TIMEOUT.ULTRA` (900s / 15min) for `test.setTimeout()` — `TIMEOUT.MAX` (100s) is too short for ~1.5min Cross Border ACH flow
- Use named TIMEOUT constants (`BRIEF`, `MICROMIN`, `MODERATE`, `VERYMIN`) instead of hardcoded ms values in `waitForTimeout` calls
- New constants added: `BRIEF` (1s), `MODERATE` (3s) — existing: `MICROMIN` (2s), `VERYMIN` (5s)

## Cross Border ACH — Edit Payment (TC002)
- The **edit form reuses the same `payeeAmount` locator** (`//input[@name="payeeAmount"]`) as the create form — no separate locator needed
- The **edit button** on the view page is `#crsbrd-view-edit` — works reliably
- **Reference ID does NOT change after edit** — the same reference is returned on the submitted page
- **Clear + fill pattern**: Use `.click()` → `.fill('')` → `enterTextarea()` to replace existing amount value in edit form
- The **edit flow** follows the same Next → Preview → Submit → Submitted sequence as create
- **`waitForFormReady()`** works correctly for both create and edit forms — pre-filled fields don't cause issues
- **Typical duration**: Create → Validate → Edit → Validate → Delete completes in ~2.1 minutes

## Cross Border ACH — Approve Payment (TC003)
- **Digital token section is collapsed by default**: After clicking the Approve button, the M-Challenge/SMS section is hidden behind "Alternatively, use your digital token or security device for approval". Must click `pushOption` (`push-option-label`) to expand before `getChallengeSMS` becomes visible.
- **Approved payments cannot be deleted**: The Delete button is **disabled** on approved payment view pages. Do NOT include a delete cleanup phase for approve test cases.
- **Approve locators live on AccountTransferPage**: Use `viewPageApproveButton`, `getChallengeSMS`, `challengeResponse`, `dismissButton`, `pushOption` — all from `AccountTransferPage`, NOT `CrossBoarderACHPage`.
- **Approve flow sequence**: `viewPageApproveButton` → `pushOption` (expand) → `getChallengeSMS` → `challengeResponse` (enter `CONSTANTS.CHALLENGEVIASMSCODE` = `'12345678'`) → wait for approve button enabled → `viewPageApproveButton` → `dismissButton`
- **Status locator for CrossBorder**: Use `crsBrdTransactionStatusValue` (`#crsbrd-view-pendingStatus_0`) — works for both "Pending Approval" and "Approved" status values.
- **Typical duration**: Create → Validate → Approve → Validate Status completes in ~2.0 minutes

  4. Enter challenge response via `AccountTransferPage.challengeResponse` with `CONSTANTS.CHALLENGEVIASMSCODE`
  5. Wait for `viewPageApproveButton` to be enabled (30s timeout)
  6. Click `viewPageApproveButton` → dismiss dialog → validate status
- **Two `button[name="approve"]` on view page:** `#push-btn` ("Approve now", mobile push, disabled) + toolbar "Approve" button
- Use `viewPageApproveButton` (`button[name="approve"]:not(#push-btn)`) to target the toolbar Approve button specifically — avoids Playwright strict mode violation
- The `viewPageApproveButton` locator was added to `AccountTransferPage.ts` (declaration + initialization)
- After approval, validate status against valid set: Approved / PartialApproved / Received / PendingRelease / Completed / BankRejected
- Approved transactions **cannot be deleted** — Delete button is disabled. No cleanup step needed
- DO NOT skip `getChallengeSMS` click — unlike initial assumption, the SMS challenge is NOT auto-sent on the ACT approve view page; it must be explicitly requested

## ACT Release via My Release — Two-Phase ApproveNow + Release Flow (TC014)
- TC014 creates an ACT payment with amount `99900001.00` + ApproveNow → status becomes **"Pending Release"**, then logs out and re-logs in with User2 to release it
- **From Account selection (SGD):** The autocomplete dropdown shows multiple accounts with overlapping names. Filtering by `(SGD)` alone picks the WRONG account (e.g., "021account (SGD)"). Must chain two filters: `.filter({ hasText: '03030303' }).filter({ hasText: '(SGD)' })` to uniquely target the correct "03030303Name 03030303 (SGD)" account
- `testData.ManagePayroll.SIT.fromAccount` = `"03030303Na"` — used as the search/type text for the autocomplete input
- **ApproveNow on preview page (TC014 pattern):** Scroll to submit button → `javaScriptsClick(approvalNowCheckBox)` → wait 2s → click `pushOption` (expand SMS section) → click `getChallengeSMS` → enter challenge response → Submit
- After ApproveNow with amount 99900001.00, status = `"Pending Release"` — confirmed in Transfer Center view page
- **Release flow (ManagePayroll TC013 pattern):** Logout → Login User2 (`testData.ManagePayroll.SIT.loginUserIdUser2` = "DBSAUTO0001") → Approval menu → `approveReleaseTab` → search reference → select checkbox + click `approveReleaseButton` → click `approveReleaseSubmitButton` → verify `releasedSuccessfullyMessage` → click finish
- **Post-release status validation:** Use `toContainText(regex, { timeout: 30_000 })` instead of immediate `getTextFromElement` — the status field shows placeholder text for >10s before resolving to real value (Approved / Received / Completed / BankRejected / PendingRelease)
- Released/Approved transactions **cannot be deleted** — no cleanup step needed


## Common Mistakes
- Adding `waitForUXLoading` after every click — only where spinner actually appears
- Duplicating `handleAuthIfPresent` on repeated `paymentMenu` navigation within same test
- Using `TIMEOUT.MAX` for long multi-phase workflows — will timeout at 5 min
- Adding `handleAnnouncementIfPresent()` in beforeEach without verifying framework pattern
- Setting `payeeNicknameLabelValue` to `newPayeeName` — must use `newPayeeNickName` (Protractor source used same value for both; Playwright test data has distinct name vs nickname)

## Release Flow
- After release, `PayrollPage.status` (`#bulk-view-pendingStatus_0`) may show raw status code like `"statusCode.2"` instead of a human-readable label (e.g., "Approved")
- When validating final status post-release, include `'statusCode'` in the valid statuses array to handle unresolved i18n keys
- `amountPendingRelease` + ApproveNow during creation → status goes directly to "Pending Release" (skips Verify & Approve phases)
- User2 (DBSAUTO0001) then releases via Approvals → Release Approved Payment tab

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

## Email Fields (Account Transfer)
- After toggling `isBeneAdvising` checkbox, 5 email fields appear as `textbox "Email"` **without** `name` attributes
- Old locators `ShuRu[@name="email-id-N"]` and `input[name="email-id-N"]` both fail
- **Working pattern:** `page.getByRole('textbox', { name: 'Email' }).nth(N)` (0-indexed)
- Use `safeClick → safeFill → blur()` for each email field
