# Application Behavior Learnings (DBS IDEALX)

> Runtime observations discovered during Playwright test execution.
> Apply these when writing or converting tests to avoid repeat failures.

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

## ShuRu Locators (Account Transfer)
- All `ShuRu[@name=...]` and `ShuRu[@formcontrolname=...]` locators in `AccountTransferPage.ts` are **broken** against the current UI
- The `ShuRu` custom element has been replaced with standard HTML elements in the current app version
- Replace with CSS selectors or role-based locators targeting the native HTML elements:
  - `ShuRu[@name="X"]` → `input[name="X"]` or `page.getByRole('textbox', ...)`
  - `ShuRu[@formcontrolname="X"]` → `label[for="X"]` (for checkboxes) or `input#X`
- Always validate locators against live DOM before trusting page class definitions

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
