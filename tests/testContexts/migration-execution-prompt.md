# Protractor → Playwright Migration Execution Prompt

> **Usage:** Copy this prompt and replace `{{TEST_CASE_ID}}` and `{{SOURCE_FILE}}` with actual values.
> All rules from `context.md` and runtime learnings from `learnings.md` are enforced automatically.

---

## Prompt Template

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md` (framework standards)
- `tests/testContexts/learnings.md` (runtime learnings from prior executions)

Execute `{{TEST_CASE_ID}}` from source: `{{SOURCE_FILE}}`

Follow the execution steps below in strict order.

---

### Step 1 — Inspect (Per-Page DOM Analysis)

Before interacting with each page or form section:
1. Inspect the current page DOM to identify all required UI elements
2. Capture a screenshot only if needed for locator verification or UI validation
3. Identify all required field values and locators for the active page
4. Check the existing Playwright framework (page classes, helpers, utilities)
   to determine whether each required locator already exists

Do NOT proceed to data entry without completing this inspection.

---

### Step 2 — Validate (Locator + Data Verification)

For each required UI element:
1. Validate the existing framework locator against the current live DOM
2. Confirm whether the locator correctly identifies the intended element
3. Validate displayed UI field values against the JSON test data source
4. Determine match/mismatch for both locators and field values

For each locator:
- If working → use as-is from the framework
- If broken → note the mismatch but do NOT modify the page class yet
- If missing → note it but do NOT add to the page class yet

---

### Step 3 — Continue (Execute Without Interruption)

If any mismatch is detected during execution:
- Do NOT interrupt execution
- Do NOT request user approval mid-run
- Do NOT update any JSON, locator, page class, or framework file during execution
- Continue the flow using the actual working UI value or correct locator
- If a required locator is missing in the page class, create it in-memory only
  for the current run and continue

**CRITICAL RULE — Framework File Protection:**
Do NOT modify ANY existing framework file without explicit user approval:
- Page class files (e.g., AccountTransferPage.ts, TelegraphicTransferPage.ts)
- JSON test data files (e.g., SG_testData.json)
- Utility/helper files (e.g., webComponents.ts)
- Configuration files (e.g., playwright.config.ts)
- Context files (context.md, learnings.md)

All fixes during execution must be spec-file-only or in-memory.

---

### Step 4 — Capture (Record All Mismatches)

Capture every mismatch discovered during execution into a structured log.

**For each field value mismatch, record:**
| Item | Value |
|------|-------|
| Field name | |
| Expected value (from JSON) | |
| Actual value (from UI) | |
| Page / module name | |
| Execution step / context | |

**For each locator mismatch, record:**
| Item | Value |
|------|-------|
| Page / module name | |
| Element name | |
| Existing locator (from page class) | |
| Actual working locator (from live DOM) | |
| Execution step / context | |
| Exists in framework? (yes/no) | |
| Created in-memory? (yes/no) | |

**For each new UI element not in Protractor source, record:**
| Item | Value |
|------|-------|
| Element name | |
| Working locator | |
| Why it was needed | |

Do NOT modify any source file during this step.

---

### Step 5 — Summarize (Post-Execution Consolidated Report)

After the full execution completes (pass or fail), generate ONE consolidated summary:

**Section A — Field Value Mismatches**
- All JSON vs UI value differences

**Section B — Locator Mismatches**
- All broken locators with before/after
- All missing locators with proposed additions

**Section C — Proposed Changes**
- JSON updates (field, old value, new value)
- Locator updates (page class, element, old locator, new locator)
- New locator entries (page class, element, proposed locator)

**Section D — Execution Summary**
- Total steps executed
- Steps passed / failed
- Fixes applied in-memory during execution
- Fixes required for permanent update
- Items requiring user approval

---

### Step 6 — User Approve (Explicit Approval Gate)

Present the complete mismatch and fix summary to the user ONLY after the full flow finishes.
Request EXPLICIT user approval before making ANY source change.

**Do NOT — under any circumstance — without explicit approval:**
- Update JSON test data values
- Update locator definitions in page classes
- Add new locator entries to page classes
- Modify any utility, helper, or configuration file
- Modify context.md or learnings.md

**Wait for the user to approve/deny each proposed change individually or in bulk.**

---

### Step 7 — Update (Apply Approved Changes Only)

Only after user approval:
1. Update the approved JSON entries
2. Update the approved locator values in page classes
3. Add the approved new locator entries to page classes
4. Update learnings.md with any new runtime observations (if approved)

**Constraints on updates:**
- Preserve the execution flow — no regressions
- Do not break existing functionality or downstream validations
- Do not modify unrelated data, locators, or framework code
- Remain compliant with context.md and learnings.md standards
- Each file modification must be confirmed individually

---

### Step 7b — Update Learnings (Record Migration Findings)

After applying approved changes, propose additions to `tests/testContexts/learnings.md`
for any new runtime observations discovered during this migration.

**Capture learnings for:**
- New locator patterns that worked (e.g., label click for Angular checkboxes)
- Locator types that are broken across the app (e.g., ShuRu-based locators)
- UI elements that changed from Protractor era (removed fields, new mandatory fields)
- Interaction patterns that require special handling (retries, scrolling, waits)
- View page locator reliability issues (positional XPath fragility)
- Credential or environment-specific discoveries
- Any behavior not already documented in learnings.md

**Format each learning as:**
- A concise bullet point under the appropriate existing section, OR
- A new section heading if no existing section fits

**Rules:**
- Do NOT duplicate information already in learnings.md
- Do NOT add learnings without explicit user approval
- Present all proposed learnings to the user for review before writing
- Only add observations that are generalizable to future migrations
  (not one-off errors or transient environment issues)

---

### Step 8 — Report (Generate Migration Chat Log)

After successful conversion (test passes):
1. Generate an HTML migration report file named:
   `{{TEST_CASE_ID}}_Migration_ChatLog.html`
   in the workspace root directory

2. The report must include:

   **A. Full Migration Journey**
   - Chronological log of all phases from initial conversion to final pass
   - Each execution run with pass/fail status and error details
   - All fix attempts with approaches tried and outcomes

   **B. Consolidated Mismatch Summary**
   - All locator mismatches (broken, removed, added) with before/after
   - All data mismatches with before/after
   - All missing elements discovered

   **C. Migration Metrics & Change Summary**
   - Execution statistics (total runs, passed, failed)
   - Locator changes count by type (broken→fixed, removed, added)
   - Test data changes count with details
   - Credential/environment changes
   - Critical issues faced (severity, runs blocked, resolution)
   - Files created/modified
   - Page object changes pending (awaiting approval)
   - Overall migration difficulty rating by category

3. Format: Styled HTML that opens cleanly in both browser and Microsoft Word
4. Confirm the report file location to the user

---

### Step 9 — Data Security, Retention, and Cleanup

**During capture and analysis:**
- Do not store or expose sensitive data (credentials, PII, account numbers) unnecessarily
- Sanitize or mask sensitive information in logs, screenshots, and reports
- Capture only the minimum data required for validation

**After user approves or denies changes:**
- Remove all temporary execution data (in-memory records, DOM extracts, metadata)
- Clear any temporary artifacts no longer required
- Do not retain captured runtime data beyond the approval workflow
  unless explicitly authorized by the user

**If data requires retention for audit or follow-up:**
- Ask the user whether remaining captured data should be deleted
- Do not retain without explicit confirmation

**Final confirmation must include:**
- What fixes were applied
- What fixes were proposed but not applied
- Whether all temporary captured data was deleted
- Whether any retained data remains pending user confirmation
```

---

## Quick Reference — Variable Substitution

| Variable | Description | Example |
|----------|-------------|---------|
| `{{TEST_CASE_ID}}` | Test case identifier | `TC01_SG_AccountTransfer` |
| `{{SOURCE_FILE}}` | Protractor source file path | `SG_AccountTransfer.test.ts` |

## Example Usage

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md`
- `tests/testContexts/learnings.md`

Execute `TC01_SG_AccountTransfer` from source: `SG_AccountTransfer.test.ts`

Follow the execution steps below in strict order.
[... Steps 1–9 as above ...]
```
