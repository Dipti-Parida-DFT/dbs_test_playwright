# Protractor → Playwright Migration & Execution Prompt (v03 — Unified Two-Stage)

> **Version:** 03 — Unified prompt combining Stage 1 (Convert) and Stage 2 (Execute + Auto-Fix).
> **Lineage:** Stage 1 is derived from `migration-prompt.md`. Stage 2 is derived from
> `migration-execution-prompt-02.md` (autonomous retry loop, 15-failure max).
>
> **Usage:** Replace all `{{VARIABLES}}` with actual values before use.
> All rules from `context.md` and `learnings.md` are enforced automatically.
>
> **Modes:**
> - **Create mode** (default): Generate a new spec file from the Protractor source
> - **Append mode**: Add a test case to an existing spec file (set `{{MODE}}` = `append`)

---

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{TEST_CASE_ID}}` | Test case identifier | `TC01_Create an ACT Payment with new Payee` |
| `{{SOURCE_FILE}}` | Protractor source file name | `SG_AccountTransfer.test.ts` |
| `{{SOURCE_PATH}}` | Full path to the Protractor source folder | `C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer` |
| `{{TARGET_SPEC_FILE}}` | Playwright spec file name to create or append to | `SG_AccountTransferTC001AgentGenerated.spec.ts` |
| `{{MODE}}` | `create` (new file) or `append` (add TC to existing file) | `create` |
| `{{EXECUTION_MODE}}` | `parallel` (default, independent TCs) or `serial` (later TC depends on earlier TC data) | `parallel` |
| `{{RUN_SCOPE}}` | `new` (execute only the new TC) or `all` (execute all TCs in the file) | `new` |

---

## Prompt Template

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md` (framework standards)
- `tests/testContexts/learnings.md` (runtime learnings from prior executions)

Migrate `{{TEST_CASE_ID}}` from Protractor source `{{SOURCE_FILE}}`
(located at `{{SOURCE_PATH}}`)
into Playwright spec file `{{TARGET_SPEC_FILE}}`.

Mode: `{{MODE}}` (create = new file | append = add to existing file)

Follow Stage 1 and Stage 2 below in strict order.
Record the wall-clock timestamp when this prompt is first received.

---

## ═══════════════════════════════════════════════════════════════════
## STAGE 1 — CONVERT (Protractor → Playwright Spec Generation)
## ═══════════════════════════════════════════════════════════════════

### 1.1 — Primary Objective

Apply all rules, constraints, and standards defined in the authoritative context.md file.
Also refer to the application behavior observations in tests/testContexts/learnings.md
for runtime learnings discovered during prior test executions.

Convert Test Case `{{TEST_CASE_ID}}` from the Protractor source file into an equivalent
Playwright test specification, preserving functional behavior, execution flow, and all
existing validations.

Extract ONLY the test case matching `{{TEST_CASE_ID}}` from the source file.
Do not convert other test cases in the same source file.

### 1.2 — Pre-Conversion Analysis

Before and during conversion:
- Analyze the existing Playwright framework structure, including folder layout, base test
  setup, fixtures, and configuration files
- Review existing Playwright .spec.ts files to understand the standard test skeleton,
  structure, naming conventions, and setup/teardown patterns
- Examine available utilities, helpers, page objects, and shared .ts files to identify
  reusable logic, prerequisites, and dependencies required for the new test
- Ensure all required logic is derived from existing framework assets only, without
  duplication or framework modification

### 1.3 — Source & Target

**Source Test File:**
- Location: `{{SOURCE_PATH}}`
- File: `{{SOURCE_FILE}}`

**Target Playwright Framework:**
- Location: `dbs_test_playwright`

**Reference Files:**
1. Rules: `tests/testContexts/context.md` — Framework governance and coding standards
2. Learnings: `tests/testContexts/learnings.md` — Application behavior observations from prior executions

### 1.4 — Conversion Requirements

- Reuse existing Playwright framework assets (page objects, utilities, helpers, base tests)
- Ensure all test steps and assertions from the Protractor test are fully reflected
- Preserve functional behavior, execution order, and validation intent
- Do not modify existing test data, configurations, constants, or framework components
- Follow established Playwright test structure and coding patterns as observed in existing .spec.ts files
- Apply runtime behavior learnings from learnings.md (auth handling, UX loading, timeouts, etc.)

### 1.5 — Deliverable

**If mode = `create`:**
- Create a ready-to-execute Playwright test specification file named: `{{TARGET_SPEC_FILE}}`

**If mode = `append`:**
- Append Test Case `{{TEST_CASE_ID}}` into the existing Playwright test specification file:
  `{{TARGET_SPEC_FILE}}`, reusing the existing structure and framework assets.

### 1.5a — Append Mode Rules (only when `{{MODE}}` = `append`)

When appending a new test case to an existing spec file, follow these structural rules:

**1. Read the target file first:**
- Analyze the existing `test.describe` block, `test.beforeEach`, `test.afterEach`,
  imports, shared variables, and all existing `test()` blocks
- Understand what credentials, page objects, and shared state are already set up

**2. Place the new `test()` block inside the existing `test.describe` block:**
- Add the new `test('{{TEST_CASE_ID}}', async ({ page }) => { ... })` block
  AFTER the last existing `test()` block but BEFORE the closing `});` of `test.describe`
- Do NOT create a second `test.describe` block
- Do NOT duplicate imports, `beforeEach`, or `afterEach` blocks

**3. Reuse shared setup:**
- Reuse the existing `test.beforeEach` (login, page object initialization)
- Reuse the existing `pages` variable and any other shared state
- If the new TC needs additional page objects not currently imported, add the import
  at the top of the file alongside existing imports

**4. Execution mode — `{{EXECUTION_MODE}}`:**

| Mode | When to Use | What It Does |
|------|-------------|--------------|
| `parallel` (default) | New TC is independent of existing TCs | Tests run in any order; no shared state between tests |
| `serial` | New TC depends on data created by an earlier TC (e.g., reference ID, payment status) | Add `test.describe.configure({ mode: 'serial' })` at the top of the describe block. Declare shared variables (e.g., `let referenceId: string`) in the outer scope of the describe block so earlier tests can write and later tests can read |

**5. Shared state patterns (for serial mode):**
```typescript
test.describe('Feature_Name (Playwright)', () => {
  let pages: PaymentsPages;
  // ─── Shared state between serial TCs ───
  let referenceFromTC01: string | undefined;  // Written by TC01, read by TC02

  test.beforeEach(async ({ page }, testInfo) => { /* ... existing ... */ });

  test('TC01_Create Payment', async ({ page }) => {
    // ... creates payment, captures reference
    referenceFromTC01 = capturedRef;
  });

  test('TC02_Edit Payment via Transfer Center', async ({ page }) => {
    // Uses referenceFromTC01 from previous test
    await pages.TransferCentersPage.searchAndOpenByReference(referenceFromTC01!);
  });
});
```

**6. Cleanup / afterEach considerations:**
- If the existing `afterEach` uses a shared array (e.g., `createdPayees[]`), push
  cleanup items from the new TC into the same array
- If the existing `afterEach` does not apply to the new TC, do NOT modify it —
  handle cleanup inside the new `test()` block instead
- Do NOT break existing cleanup logic

**7. Do NOT modify existing test blocks:**
- Do NOT rename, reorder, or alter any existing `test()` block
- Do NOT change existing assertions, locators, or test data references
- The only allowed modifications to the existing file are:
  - Adding imports (at the top)
  - Adding shared variables in the describe scope (for serial mode)
  - Adding `test.describe.configure({ mode: 'serial' })` if switching to serial
  - Adding the new `test()` block at the end

### 1.6 — Conversion Output Constraint

- Output only the executable Playwright .spec.ts file
- Ensure full compliance with context.md rules and learnings.md observations
- Ensure compliance with existing framework standards

### 1.7 — Stage 1 Gate

Stage 1 is complete when the spec file has been created (or appended to) and is
syntactically valid. Proceed automatically to Stage 2 without user confirmation.

---

## ═══════════════════════════════════════════════════════════════════
## STAGE 2 — EXECUTE, AUTO-FIX, AND REPORT
## ═══════════════════════════════════════════════════════════════════

### 2.0 — Pre-Execution Context Loading

Before executing any test, load and apply the following reference files:

- **Rules:** context.md — Framework governance, coding standards, and constraints
- **Learnings:** learnings.md — Application behavior observations from prior executions
  (auth handling, UX loading, timeouts, etc.)
- Cross-reference all test steps against both files to identify potential issues before
  execution begins

### 2.1 — Execution & Validation Objective

Execute the newly generated Playwright test specification and validate its end-to-end
runtime behavior.

**Execution command:**

**If `{{RUN_SCOPE}}` = `new` (default — execute only the newly appended TC):**
```
npx playwright test {{TARGET_SPEC_FILE}} -g "{{TEST_CASE_ID}}" --headed --reporter=list
```

**If `{{RUN_SCOPE}}` = `all` (execute all TCs in the file — required for serial mode):**
```
npx playwright test {{TARGET_SPEC_FILE}} --headed --reporter=list
```

> **Note:** When `{{EXECUTION_MODE}}` = `serial`, always use `{{RUN_SCOPE}}` = `all`
> because later TCs depend on data created by earlier TCs.

**During execution:**
- Observe and verify all executed test steps, control flow, and sequencing
- Validate runtime logic, assertions, and expected outcomes
- Confirm correct usage of test data, fixtures, and existing framework utilities
- Ensure compliance with existing Playwright framework behavior and conventions
- Verify adherence to application behavior learnings documented in learnings.md
- Maintain the complete execution context (runtime observations, failures, and outcomes)
  to ensure consistency and continuity within the same workflow and any subsequent file
  generation

### 2.2 — Inspect (Per-Page DOM Analysis)

Before interacting with each page or form section:
1. Inspect the current page DOM to identify all required UI elements
2. Capture a screenshot only if needed for locator verification or UI validation
3. Identify all required field values and locators for the active page
4. Check the existing Playwright framework (page classes, helpers, utilities)
   to determine whether each required locator already exists

Do NOT proceed to data entry without completing this inspection.

### 2.3 — Validate (Locator + Data Verification)

For each required UI element:
1. Validate the existing framework locator against the current live DOM
2. Confirm whether the locator correctly identifies the intended element
3. Validate displayed UI field values against the JSON test data source
4. Determine match/mismatch for both locators and field values

For each locator:
- If working → use as-is from the framework
- If broken → note the mismatch but do NOT modify the page class yet
- If missing → note it but do NOT add to the page class yet

### 2.4 — Execute, Auto-Fix, and Retry (Autonomous Loop)

If any mismatch is detected during execution:
- Do NOT interrupt execution
- Do NOT request user approval mid-run
- Do NOT update any JSON, locator, page class, or framework file during execution
- Continue the flow using the actual working UI value or correct locator
- If a required locator is missing in the page class, create it in-memory only
  for the current run and continue

**Automatic Retry Loop (on failure):**

When a test execution fails, enter an autonomous analyze → fix → re-execute loop:

1. **Analyze** — Read the error output, error-context.md (ARIA snapshot), and screenshot
   to diagnose the root cause (broken locator, missing element, wrong data, timing issue)
   Cross-check the failure against known patterns in learnings.md before investigating further.
   Correlate failures with test logic, framework usage, timing, data dependencies, or
   environment setup.
2. **Self-Fix** — Apply the fix to the **spec file only** (in-memory locators, waits,
   data overrides, interaction patterns). Spec-file changes do NOT require user approval
   during the retry loop. Propose corrective actions strictly within the boundaries of
   the existing Playwright framework. Do not introduce new helpers, utilities,
   abstractions, or framework changes.
3. **Re-Execute** — Run the test again immediately without asking the user
4. **Repeat** — If the test fails again, go back to step 1

**Retry limits and safety:**
- Maximum **15 consecutive failures** before halting the loop
- If 15 failures are reached, STOP and present the full failure history to the user
- If a failure indicates an **unsafe or destructive condition** (e.g., data corruption,
  environment instability, repeated identical error with no new fix possible), STOP
  immediately and request user intervention — do NOT exhaust all 15 retries
- Each retry must attempt a **different fix** than the previous one; do NOT retry
  the same approach that already failed
- If all standard locator strategies are exhausted for a single element (CSS → text →
  role → XPath), use `page.evaluate()` to inspect the live DOM and construct a custom
  locator, or skip the element with a documented note

**What is allowed without user approval during the retry loop:**
- Editing the spec file (locators, waits, data references, interaction patterns)
- Creating in-memory locators for broken/missing page class elements
- Switching to alternative locator strategies (CSS → text → role → XPath)
- Adjusting timeouts or wait strategies in the spec file

**CRITICAL RULE — Framework File Protection:**
Do NOT modify ANY existing framework file without explicit user approval:
- Page class files (e.g., AccountTransferPage.ts, TelegraphicTransferPage.ts)
- JSON test data files (e.g., SG_testData.json)
- Utility/helper files (e.g., webComponents.ts)
- Configuration files (e.g., playwright.config.ts)
- Context files (context.md, learnings.md)

All framework file changes must be tracked as **proposed changes** and presented
to the user for approval only after the retry loop completes (pass or 15-failure limit).

All fixes during execution must be spec-file-only or in-memory.

### 2.5 — Capture (Record All Mismatches)

Capture every mismatch discovered during execution into a structured log.
This log is maintained across all runs in the retry loop.

**For each field value mismatch, record:**
| Item | Value |
|------|-------|
| Field name | |
| Expected value (from JSON) | |
| Actual value (from UI) | |
| Page / module name | |
| Execution step / context | |
| Run number (in retry loop) | |

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
| Run number (in retry loop) | |

**For each new UI element not in Protractor source, record:**
| Item | Value |
|------|-------|
| Element name | |
| Working locator | |
| Why it was needed | |
| Run number (in retry loop) | |

Do NOT modify any framework source file during this step.

### 2.6 — Summarize (Post-Loop Consolidated Report)

After the test **passes** OR the **15-failure retry limit** is reached,
generate ONE consolidated summary covering **all runs** in the retry loop:

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
- Total runs in the retry loop
- Total steps executed / passed / failed
- Fixes self-applied per run (categorized: locator, data, wait, interaction)
- Fixes required for permanent framework update
- Items requiring user approval

### 2.7 — User Approve (Post-Loop Approval Gate)

This step triggers ONCE — only after the retry loop completes (test passes or
15-failure limit reached). Do NOT request approval during the retry loop.
Spec-file self-fixes are autonomous.

Present the complete mismatch and fix summary to the user, including:
- All spec-file changes made during the retry loop (for review / retention decision)
- All proposed framework file changes (for explicit approval before applying)

**Spec-file changes (retention decision):**
- Present all spec-file modifications accumulated during the retry loop
- Ask user: **Keep or Revert?** (bulk or individual)
- If the test passed, recommend keeping; if 15-failure limit was hit, let user decide

**Framework file changes (explicit approval required):**
Do NOT — under any circumstance — without explicit approval:
- Update JSON test data values
- Update locator definitions in page classes
- Add new locator entries to page classes
- Modify any utility, helper, or configuration file
- Modify context.md or learnings.md

**Wait for the user to approve/deny each proposed change individually or in bulk.**

### 2.8 — Update (Apply Approved Changes Only)

Only after user approval:

**2.8a. Spec-file retention:**
- If user approved keeping spec-file changes → no action needed (already applied)
- If user chose to revert → restore the spec file to its pre-retry-loop state

**2.8b. Framework file updates:**
1. Update the approved JSON entries
2. Update the approved locator values in page classes
3. Add the approved new locator entries to page classes
4. Update learnings.md with any new runtime observations (if approved)

**Constraints on updates:**
- Preserve the execution flow — no regressions
- Do not break existing functionality or downstream validations
- Do not modify unrelated data, locators, or framework code
- Remain compliant with context.md and learnings.md standards
- Each framework file modification must be confirmed individually

### 2.8c — Update Learnings (Record Migration Findings)

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

**Learning & Retention (from migration-prompt.md):**
- Record all failure reasons, observations, and corrective learnings internally
- If a new runtime behavior is discovered (not already in learnings.md), append it to
  learnings.md under the appropriate section (after user approval)
- Retain these learnings for future reference to improve accuracy and stability in
  subsequent conversions and new test authoring
- Do not include internal learning logs or reasoning in the final output unless
  explicitly requested

### 2.9 — Report (Generate Migration Chat Log)

After the retry loop completes (test passes or 15-failure limit):
1. Generate an HTML migration report file named:
   `{{TEST_CASE_ID}}_Migration_ChatLog.html`
   in the workspace root directory

2. The report must include:

   **A. Full Migration Journey**
   - Chronological log of all phases from initial conversion to final pass (or halt)
   - Each execution run with pass/fail status and error details
   - All fix attempts with approaches tried and outcomes
   - Self-fix applied per run (what changed between consecutive runs)

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

   **D. Overall Migration Timeline — Prompt to Pass**
   - **Record timestamps:** Capture the wall-clock time when the migration prompt is first
     received, when each execution run starts and ends, and when the test finally passes
     (or the 15-failure limit is reached)
   - Total wall-clock time from initial migration prompt to final stable pass
   - Phase-by-phase breakdown with time per phase:
     - Stage 1 conversion (prompt received → spec file created)
     - First execution start
     - Each execution/fix cycle (run start → failure → analysis → fix applied → next run start)
     - Final pass run (run start → pass)
     - Post-pass activities (reporting, summary, approval)
   - Cumulative test execution time table (each run with status, duration, cumulative total, blocker)
   - Time efficiency analysis (percentage split: conversion vs execution vs analysis/diagnosis vs reporting)
   - Summary cards: total migration time, cumulative execution time, analysis/fix time
   - **Overall time: prompt received → test pass** (single headline number)

   **E. Auto-Retry Loop Statistics**
   - Total auto-retries executed (out of 15 max)
   - Self-fixes applied per run (locator, data, wait, interaction pattern)
   - Failure categories breakdown (locator not found, timeout, assertion mismatch, etc.)
   - Fix success rate (fixes that resolved the issue vs fixes that did not)
   - Whether the loop ended by pass or by hitting the 15-failure limit
   - Spec-file changes accumulated during the loop (count and summary)
   - Framework changes proposed but deferred to user approval

3. Format: Styled HTML that opens cleanly in both browser and Microsoft Word
4. Confirm the report file location to the user

### 2.10 — Data Security, Retention, and Cleanup

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
- What fixes were applied (spec-file and framework)
- What fixes were proposed but not applied
- What spec-file changes were kept vs reverted
- Whether all temporary captured data was deleted
- Whether any retained data remains pending user confirmation

### 2.11 — Output Constraint

- If fixes are applied, regenerate only the corrected, executable Playwright .spec.ts file
- Ensure the final output remains fully compliant with context.md rules and learnings.md
  observations
- Ensure compliance with existing framework standards
- Do not output execution logs, analysis notes, or explanatory commentary unless
  explicitly requested
```

---

## Quick Reference — Variable Substitution

| Variable | Description | Example |
|----------|-------------|---------|
| `{{TEST_CASE_ID}}` | Test case identifier | `TC01_Create an ACT Payment with new Payee` |
| `{{SOURCE_FILE}}` | Protractor source file name | `SG_AccountTransfer.test.ts` |
| `{{SOURCE_PATH}}` | Full path to Protractor source folder | `C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer` |
| `{{TARGET_SPEC_FILE}}` | Playwright spec file to create/append | `SG_AccountTransferTC001AgentGenerated.spec.ts` |
| `{{MODE}}` | `create` or `append` | `create` |
| `{{EXECUTION_MODE}}` | `parallel` or `serial` | `parallel` |
| `{{RUN_SCOPE}}` | `new` (only new TC) or `all` (all TCs in file) | `new` |

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v01 | 13 Apr 2026 | Initial execution prompt — manual approval after each failure |
| v02 | 13 Apr 2026 | Autonomous retry loop (15 max), single post-loop approval gate |
| v03 | 13 Apr 2026 | Unified two-stage prompt: Stage 1 (Convert) + Stage 2 (Execute + Auto-Fix + Report). Combines migration-prompt.md and migration-execution-prompt-02.md into a single end-to-end workflow. Added append mode, execution command, locator exhaustion guidance, timeline with Stage 1 breakdown. |

## Example Usage — Create Mode

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md`
- `tests/testContexts/learnings.md`

Migrate `TC01_Create an ACT Payment with new Payee` from Protractor source `SG_AccountTransfer.test.ts`
(located at `C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer`)
into Playwright spec file `SG_AccountTransferTC001AgentGenerated.spec.ts`.

Mode: `create`

Follow Stage 1 and Stage 2 below in strict order.
[... Stages 1–2 as above ...]
```

## Example Usage — Append Mode (Independent TC)

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md`
- `tests/testContexts/learnings.md`

Migrate `TC02_Create an ACT Payment with existing Payee` from Protractor source `SG_AccountTransfer.test.ts`
(located at `C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer`)
into Playwright spec file `SG_AccountTransferTC001AgentGenerated.spec.ts`.

Mode: `append`
Execution Mode: `parallel`
Run Scope: `new`

Follow Stage 1 and Stage 2 below in strict order.
[... Stages 1–2 as above ...]
```

## Example Usage — Append Mode (Serial / Dependent TC)

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md`
- `tests/testContexts/learnings.md`

Migrate `TC03_Edit ACT Payment via Transfer Center` from Protractor source `SG_AccountTransfer.test.ts`
(located at `C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer`)
into Playwright spec file `SG_AccountTransferTC001AgentGenerated.spec.ts`.

Mode: `append`
Execution Mode: `serial`
Run Scope: `all`

Follow Stage 1 and Stage 2 below in strict order.
[... Stages 1–2 as above ...]
```
