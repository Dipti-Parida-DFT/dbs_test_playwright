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

## Release Flow
- After release, `PayrollPage.status` (`#bulk-view-pendingStatus_0`) may show raw status code like `"statusCode.2"` instead of a human-readable label (e.g., "Approved")
- When validating final status post-release, include `'statusCode'` in the valid statuses array to handle unresolved i18n keys
- `amountPendingRelease` + ApproveNow during creation → status goes directly to "Pending Release" (skips Verify & Approve phases)
- User2 (DBSAUTO0001) then releases via Approvals → Release Approved Payment tab
