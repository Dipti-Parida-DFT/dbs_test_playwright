# Protractor → Playwright Migration & Execution Prompt (v04 — Unified Self-Contained)

> **Version:** 04 — Single file with complete, copy-paste-ready prompts for both Create and Append modes.
> **Lineage:** Consolidates v03 main prompt + v03 examples into one self-contained file.
> Each example includes ALL rules, all detail — no external references needed.
>
> **Usage:** Pick the example that matches your scenario (Create or Append),
> update the variable values in the table, then copy-paste the prompt block.

---

## Variables — Update Before Use

### Example 1 — Create Mode

| Variable | Value |
|----------|-------|
| `{{TEST_CASE_ID}}` | `TC02_Create an ACT Payment with existing Payee` |
| `{{SOURCE_FILE}}` | `SG_AccountTransfer.test.ts` |
| `{{SOURCE_PATH}}` | `C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer` |
| `{{TARGET_SPEC_FILE}}` | `SG_AccountTransferTC002AgentGenerated.spec.ts` |

### Example 2 — Append Mode

| Variable | Value |
|----------|-------|
| `{{TEST_CASE_ID}}` | `TC02_Create an ACT Payment with existing Payee` |
| `{{SOURCE_FILE}}` | `SG_AccountTransfer.test.ts` |
| `{{SOURCE_PATH}}` | `C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer` |
| `{{TARGET_SPEC_FILE}}` | `SG_AccountTransferTC001AgentGenerated.spec.ts` |
| `{{EXISTING_TC_SHORT}}` | `TC01` |
| `{{NEW_TC_SHORT}}` | `TC02` |

---

## Quick Decision Guide

| Scenario | MODE | EXECUTION_MODE | RUN_SCOPE | TARGET_SPEC_FILE |
|----------|------|----------------|-----------|------------------|
| New file, one TC | `create` | `parallel` | `new` | New file name (e.g., `...TC002AgentGenerated.spec.ts`) |
| Add independent TC to existing file | `append` | `parallel` | `new` | Existing file name (e.g., `...TC001AgentGenerated.spec.ts`) |
| Add dependent TC (needs earlier TC's data) | `append` | `serial` | `all` | Existing file name |

---

## Example 1 — Create a New Spec File with a Specific Test Case

**Use when:** You want to migrate a test case into a **brand new** Playwright spec file.

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md` (framework standards)
- `tests/testContexts/learnings.md` (runtime learnings from prior executions)

Migrate `{{TEST_CASE_ID}}` from Protractor source `{{SOURCE_FILE}}`
(located at `{{SOURCE_PATH}}`)
into Playwright spec file `{{TARGET_SPEC_FILE}}`.

Mode: `create`

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

Convert Test Case `{{TEST_CASE_ID}}` from the Protractor
source file into an equivalent Playwright test specification, preserving functional
behavior, execution flow, and all existing validations.

Extract ONLY the test case matching `{{TEST_CASE_ID}}`
from the source file. Do not convert other test cases in the same source file.

**Source TC Guard:** If the source file does not contain a test case matching
`{{TEST_CASE_ID}}`, STOP immediately and report the mismatch to the user.
Do NOT generate an empty or incorrect spec file.

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

Create a ready-to-execute Playwright test specification file named:
`{{TARGET_SPEC_FILE}}`

### 1.6 — Conversion Output Constraint

- Output only the executable Playwright .spec.ts file
- Ensure full compliance with context.md rules and learnings.md observations
- Ensure compliance with existing framework standards

### 1.7 — Stage 1 Gate

Stage 1 is complete when the spec file has been created and is syntactically valid.
Proceed automatically to Stage 2 without user confirmation.

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
```
npx playwright test {{TARGET_SPEC_FILE}} --headed --reporter=list
```

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

> **When:** Sections 2.2 and 2.3 describe what happens **during** test execution
> (at runtime, as each page loads). They are NOT pre-run steps.
> The actual execution order is: **STEP A** (pre-flight code audit) → **STEP B**
> (run test — 2.2/2.3 apply during this run) → **STEP C** (on failure).

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
- If broken → fix provisionally in the page class file and record in the
  provisional change log (see STEP A/B in section 2.4)
- If missing → add provisionally to the page class file and record in the
  provisional change log (see STEP A/B in section 2.4)

### 2.4 — Execute, Auto-Fix, and Retry (Autonomous Loop)

> **MANDATORY RULE — Write Provisionally + Deferred Approval:**
> During the retry loop (STEP A through STEP C), you MAY write fixes directly
> to framework files (page class locators, JSON test data) so that the test
> can execute using real page objects and real test data. However, ALL such
> changes are **provisional** — they are NOT committed or finalized.
> Every framework file change must be **tracked** in a change log.
> After the loop ends (pass or 15-failure limit), ALL provisional changes
> are presented to the user in section 2.7. The user must **explicitly approve**
> each change to keep it, or **revert** it. No change is permanent until
> the user says so. This is non-negotiable.

**STEP A — Pre-Flight Audit (BEFORE the first run, mandatory):**

Do NOT execute the test until this audit is complete.

1. Scan ALL locators used by this TC in the page class file(s)
2. Cross-reference each locator against known-broken patterns in learnings.md
   (e.g., `ShuRu[@name=...]` locators are documented as broken → replace proactively)
3. If any locator matches a known-broken pattern, **fix it directly in the page class
   file** (update or add the locator) so the test runs with real page objects.
   Record the change (file, old value, new value) in the provisional change log
4. Verify that test data values used by autocomplete/dropdown fields match confirmed
   working values in learnings.md (e.g., `"ACT PAYEE"` for existing payee in SIT).
   If a mismatch is found, **update the value in the JSON test data file** directly.
   Record the change (file, field, old value, new value) in the provisional change log
5. Review all interaction patterns against learnings.md:
   - Container vs inner element (e.g., `p-auto-complete` needs inner `input` targeting)
   - Instant `.fill()` vs char-by-char `typeTextThroughKeyBoardAction` for autocomplete
   - Popup/dialog vs inline expandable sections (e.g., ApprovalNow is inline, not a popup)
   - Angular hidden checkboxes needing label click + verify-retry pattern
6. Only proceed to execution after all known issues are resolved

**STEP B — Execute:**

Run the test. During execution (sections 2.2/2.3 apply here — inspect/validate as
each page loads):
- Do NOT interrupt execution or request user approval mid-run
- If a required locator is missing in the page class, **add it to the page class file**
  and record it in the provisional change log
- If test data is wrong, **update the JSON file** and record the change
- Continue the flow using actual working UI values and correct locators

**STEP C — On Failure: DOM-Based Audit + Fix (after EVERY failure):**

When a test execution fails, perform this full cycle before re-executing:

1. **Read the failure** — Error output, error-context.md (ARIA snapshot), and screenshot
2. **Diagnose root cause** — Broken locator, missing element, wrong data, timing issue.
   Cross-check against known patterns in learnings.md. Correlate with test logic,
   framework usage, timing, data dependencies, or environment setup.
3. **Audit ALL remaining steps using the ARIA snapshot** — Do NOT only fix the failed
   element. Use the DOM snapshot to verify:
   - All locators for upcoming steps (are they visible? correct name/role/state?)
   - All test data values (does the selected payee match? are dropdown values correct?)
   - All interaction patterns (is the next section a dialog or inline? is the button
     visible or collapsed behind an expandable link?)
   - All wait strategies (does the page show a spinner or instant UI change?)
4. **Fix ALL predictable issues** — Apply fixes to the appropriate files:
   - **Broken/missing locators** → fix or add in the **page class file** directly
   - **Wrong test data** → update in the **JSON test data file** directly
   - **Spec-level fixes** (waits, interaction patterns, flow logic) → update in the
     **spec file** directly
   - Record EVERY change (file, location, old value, new value) in the provisional
     change log for user review in section 2.7
   - Propose corrective actions strictly within the boundaries of the existing Playwright
     framework. Do not introduce new helpers, utilities, abstractions, or framework changes.
5. **Re-Execute** — Run the test again immediately without asking the user
6. **Repeat** — If the test fails again, go back to step 1

**Retry limits and safety:**
- Maximum **15 consecutive failures** before halting the loop
- If 15 failures are reached, STOP and present the full failure history to the user
- If a failure indicates an **unsafe or destructive condition** (e.g., data corruption,
  environment instability, repeated identical error with no new fix possible), STOP
  immediately and request user intervention — do NOT exhaust all 15 retries
- Each retry must attempt a **different fix** than the previous one; do NOT retry
  the same approach that already failed
- If a test **passes on retry with no code change**, log the flakiness as a learning
  observation but do NOT count it as a fix. Record the flaky step for §2.8d learnings
- If all standard locator strategies are exhausted for a single element (CSS → text →
  role → XPath), use `page.evaluate()` to inspect the live DOM and construct a custom
  locator, or skip the element with a documented note

**What is allowed during the retry loop (provisional — tracked for user review):**
- Editing the spec file (locators, waits, data references, interaction patterns)
- Fixing or adding locators in page class files (e.g., AccountTransferPage.ts)
- Updating values in JSON test data files (e.g., SG_testData.json)
- Switching to alternative locator strategies (CSS → text → role → XPath)
- Adjusting timeouts or wait strategies
- All changes above are **provisional** and recorded in the change log

**What is NEVER allowed during the retry loop:**
- Modifying utility/helper files (e.g., webComponents.ts) — these are shared infrastructure
- Modifying configuration files (e.g., playwright.config.ts)
- Modifying context files (context.md, learnings.md)
- **Committing or finalizing** any provisional change — all changes remain uncommitted
  until the user explicitly approves them in section 2.7

**Provisional Change Log (maintained throughout the loop):**
For every file modified during the retry loop, record:
| Run # | File Modified | Element/Field | Old Value | New Value | Reason |
|-------|--------------|---------------|-----------|-----------|--------|

This log is presented in full to the user in section 2.7.

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
| Written to page class? (yes/no) | |
| Run number (in retry loop) | |

**For each new UI element not in Protractor source, record:**
| Item | Value |
|------|-------|
| Element name | |
| Working locator | |
| Why it was needed | |
| Run number (in retry loop) | |

All mismatches feed into the Provisional Change Log (section 2.4) and the
Summarize report (section 2.6).

### 2.6 — Summarize (Post-Loop Consolidated Report)

After the test **passes** OR the **15-failure retry limit** is reached,
generate ONE consolidated summary covering **all runs** in the retry loop:

**Section A — Field Value Mismatches**
- All JSON vs UI value differences

**Section B — Locator Mismatches**
- All broken locators with before/after
- All missing locators with proposed additions

**Section C — Provisional Changes Applied**
- Spec file changes (waits, interaction patterns, flow logic)
- Page class changes (locator fixes, new locators added)
- JSON test data changes (field, old value, new value)

**Section D — Execution Summary**
- Total runs in the retry loop
- Total steps executed / passed / failed
- Fixes self-applied per run (categorized: locator, data, wait, interaction)
- Files modified (with change count per file)
- Items pending user approval (keep/revert decision)

### 2.7 — User Approve (Post-Loop Approval Gate)

This step triggers ONCE — only after the retry loop completes (test passes or
15-failure limit reached). Do NOT request approval during the retry loop.

All changes made during the retry loop are **provisional**. Present the complete
Provisional Change Log to the user, organized by file:

**For each modified file, present:**
1. File path
2. Table of all changes (element/field, old value, new value, run # where changed, reason)
3. Ask user: **Keep or Revert?** (per-change or bulk per-file)

**Change categories:**

| Category | Files | Already Written? | User Action |
|----------|-------|-------------------|-------------|
| Spec file changes | `{{TARGET_SPEC_FILE}}` | Yes — in file | **Keep** or **Revert** |
| Page class locator changes | e.g., `AccountTransferPage.ts` | Yes — in file | **Keep** or **Revert** |
| JSON test data changes | e.g., `SG_testData.json` | Yes — in file | **Keep** or **Revert** |
| Learnings updates | `learnings.md` | No — not yet written | **Approve to write** or **Reject** |
| Context updates | `context.md` | No — not yet written | **Approve to write** or **Reject** |

**Rules:**
- Changes are already written to files (provisional) — user decides to **keep** or **revert**
- If user says **revert** → restore the original value in that file immediately
- If user says **keep** → the change becomes permanent (no further action needed)
- Learnings and context updates are the ONLY changes that are NOT pre-written —
  they require explicit **approve to write** before being added
- **Wait for the user to respond** before proceeding. Do NOT auto-approve.
  This is mandatory.

### 2.8 — Update (Apply User Decisions)

After receiving user approval/rejection for each change:

**2.8a. Kept changes (no action needed):**
- Changes the user approved to keep are already in the files — nothing to do

**2.8b. Reverted changes:**
- For each change the user rejected, **restore the original value** in the file
- Verify the file is syntactically valid after revert
- If reverting a locator breaks the test, warn the user

**2.8c. Context updates (write only if approved):**
- These are NOT pre-written — apply only after explicit user approval
- Update context.md with approved framework discoveries

**Constraints on all updates:**
- Preserve the execution flow — no regressions
- Do not break existing functionality or downstream validations
- Do not modify unrelated data, locators, or framework code
- Remain compliant with context.md and learnings.md standards

### 2.8d — Update Learnings (Record Migration Findings)

After applying user decisions, propose additions to `tests/testContexts/learnings.md`
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

**Learning & Retention:**
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

   **F. Final Output**
   - Final spec file content (or diff from initial conversion)
   - Framework changes applied (after approval)
   - Framework changes proposed but not applied
   - Learnings added to learnings.md

3. Format: Styled HTML that opens cleanly in both browser and Microsoft Word
4. Confirm the report file location to the user

### 2.10 — Data Security, Retention, and Cleanup

**During the retry loop — minimize exposure:**
- Do not store or expose sensitive data (credentials, PII, account numbers) in logs,
  screenshots, or conversation output
- Sanitize or mask sensitive information before including in the HTML report
- Keep DOM snapshots, ARIA snapshots, locator analysis, and test data values
  **in working memory only** — they are needed for diagnosis during the loop
- Do NOT write raw DOM/ARIA snapshots to any file outside of error-context.md
  (which the framework manages)

**Cleanup trigger — after ALL of the following are complete:**
1. User has approved/reverted all provisional changes (§2.7 → §2.8)
2. Approved learnings have been written to learnings.md (§2.8d)
3. Approved context updates have been written to context.md (§2.8c)
4. HTML migration report has been generated (§2.9)

**What to purge from working memory after the trigger:**

| Artifact | Retained during loop? | Purge after trigger? |
|----------|----------------------|---------------------|
| DOM / ARIA snapshots | Yes — for diagnosis | **Yes — purge** |
| Screenshots (in-memory) | Yes — for locator verification | **Yes — purge** |
| Mismatch logs (field, locator, element) | Yes — for §2.5/2.6 | **Yes — purge** |
| Provisional Change Log | Yes — for §2.7 | **Yes — purge** |
| Raw test data values from JSON | Yes — for validation | **Yes — purge** |
| Locator analysis (old vs new) | Yes — for fix tracking | **Yes — purge** |
| Error output / stack traces | Yes — for diagnosis | **Yes — purge** |
| Failure history (per-run) | Yes — for §2.9 report | **Yes — purge** |
| Approved learnings | Written to learnings.md | **Yes — purge from memory** |
| Approved context updates | Written to context.md | **Yes — purge from memory** |
| HTML report content | Written to file | **Yes — purge from memory** |

**What is NOT purged (persists in files):**
- The spec file (kept/reverted changes are final)
- Page class files (kept/reverted changes are final)
- JSON test data files (kept/reverted changes are final)
- learnings.md (approved additions are permanent)
- context.md (approved additions are permanent)
- HTML migration report file (on disk)

**Final confirmation must include:**
- What fixes were applied (spec-file and framework)
- What fixes were proposed but not applied
- What spec-file changes were kept vs reverted
- Confirmation that all in-memory runtime data has been purged
- Whether any on-disk artifacts remain (HTML report, error-context.md)

### 2.11 — Output Constraint

- If fixes are applied, regenerate only the corrected, executable Playwright .spec.ts file
- Ensure the final output remains fully compliant with context.md rules and learnings.md
  observations
- Ensure compliance with existing framework standards
- Do not output execution logs, analysis notes, or explanatory commentary unless
  explicitly requested
```

---
---

## Example 2 — Append a Test Case into an Existing Migrated Spec File

**Use when:** You already have a migrated spec file (e.g., with {{EXISTING_TC_SHORT}}) and want to
**add another test case below it** in the same file.

```
Apply all rules, constraints, and standards defined in:
- `tests/testContexts/context.md` (framework standards)
- `tests/testContexts/learnings.md` (runtime learnings from prior executions)

Migrate `{{TEST_CASE_ID}}` from Protractor source `{{SOURCE_FILE}}`
(located at `{{SOURCE_PATH}}`)
into Playwright spec file `{{TARGET_SPEC_FILE}}`.

Mode: `append`
Execution Mode: `parallel`
Run Scope: `new`

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

Convert Test Case `{{TEST_CASE_ID}}` from the Protractor
source file into an equivalent Playwright test specification, preserving functional
behavior, execution flow, and all existing validations.

Extract ONLY the test case matching `{{TEST_CASE_ID}}`
from the source file. Do not convert other test cases in the same source file.

**Source TC Guard:** If the source file does not contain a test case matching
`{{TEST_CASE_ID}}`, STOP immediately and report the mismatch to the user.
Do NOT generate an empty or incorrect spec file.

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
- **Target Spec File (existing):** `{{TARGET_SPEC_FILE}}`

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

Append Test Case `{{TEST_CASE_ID}}` into the existing
Playwright test specification file: `{{TARGET_SPEC_FILE}}`,
reusing the existing structure and framework assets.

### 1.5a — Append Mode Rules

1. **Read the target file first:**
   - Analyze the existing `test.describe` block, `test.beforeEach`, `test.afterEach`,
     imports, shared variables, and all existing `test()` blocks
   - Understand what credentials, page objects, and shared state are already set up

2. **Place the new `test()` block inside the existing `test.describe` block:**
   - Add the new `test('{{TEST_CASE_ID}}', async ({ page }) => { ... })`
     block AFTER the last existing `test()` block ({{EXISTING_TC_SHORT}}) but BEFORE the closing `});`
     of `test.describe`
   - Do NOT create a second `test.describe` block
   - Do NOT duplicate imports, `beforeEach`, or `afterEach` blocks

3. **Reuse shared setup:**
   - Reuse the existing `test.beforeEach` (login, page object initialization)
   - Reuse the existing `pages` variable and any other shared state
   - If the new TC needs additional page objects not currently imported, add the import
     at the top of the file alongside existing imports

4. **Execution mode — `{{EXECUTION_MODE}}`:**

   | Mode | When to Use | What It Does |
   |------|-------------|---------------|
   | `parallel` (default) | New TC is independent of existing TCs | Tests run in any order; no shared state between tests |
   | `serial` | New TC depends on data created by an earlier TC (e.g., reference ID, payment status) | Add `test.describe.configure({ mode: 'serial' })` at the top of the describe block. Declare shared variables (e.g., `let referenceId: string`) in the outer scope of the describe block so earlier tests can write and later tests can read |

5. **Shared state patterns (for serial mode):**
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

6. **Cleanup / afterEach considerations:**
   - If the existing `afterEach` uses a shared array (e.g., `createdPayees[]`), push
     cleanup items from the new TC into the same array
   - If the existing `afterEach` does not apply to the new TC, do NOT modify it —
     handle cleanup inside the new `test()` block instead
   - Do NOT break existing cleanup logic

7. **Do NOT modify existing test blocks:**
   - Do NOT rename, reorder, or alter the existing {{EXISTING_TC_SHORT}} `test()` block
   - Do NOT change existing assertions, locators, or test data references
   - The only allowed modifications to the existing file are:
     - Adding imports (at the top)
     - Adding shared variables in the describe scope (for serial mode)
     - Adding `test.describe.configure({ mode: 'serial' })` if switching to serial
     - Adding the new `test()` block at the end

### 1.6 — Conversion Output Constraint

- Output only the updated Playwright .spec.ts file with {{NEW_TC_SHORT}} appended
- Ensure full compliance with context.md rules and learnings.md observations
- Ensure compliance with existing framework standards

### 1.7 — Stage 1 Gate

Stage 1 is complete when {{NEW_TC_SHORT}} has been appended to the spec file and the file is
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

Execute the newly appended test case and validate its end-to-end runtime behavior.

**Execution command (depends on Run Scope):**

| Run Scope | Command | What runs |
|-----------|---------|----------|
| `new` (parallel mode) | `npx playwright test {{TARGET_SPEC_FILE}} -g "{{TEST_CASE_ID}}" --headed --reporter=list` | Only {{NEW_TC_SHORT}} |
| `all` (serial mode) | `npx playwright test {{TARGET_SPEC_FILE}} --headed --reporter=list` | All TCs in order ({{EXISTING_TC_SHORT}} → {{NEW_TC_SHORT}}) |

> **Note:** For `Run Scope = new`, {{EXISTING_TC_SHORT}} is NOT re-executed.
> For `Run Scope = all`, all TCs run sequentially because {{NEW_TC_SHORT}} depends on
> data produced by {{EXISTING_TC_SHORT}}.

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

> **When:** Sections 2.2 and 2.3 describe what happens **during** test execution
> (at runtime, as each page loads). They are NOT pre-run steps.
> The actual execution order is: **STEP A** (pre-flight code audit) → **STEP B**
> (run test — 2.2/2.3 apply during this run) → **STEP C** (on failure).

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
- If broken → fix provisionally in the page class file and record in the
  provisional change log (see STEP A/B in section 2.4)
- If missing → add provisionally to the page class file and record in the
  provisional change log (see STEP A/B in section 2.4)

### 2.4 — Execute, Auto-Fix, and Retry (Autonomous Loop)

> **MANDATORY RULE — Write Provisionally + Deferred Approval:**
> During the retry loop (STEP A through STEP C), you MAY write fixes directly
> to framework files (page class locators, JSON test data) so that the test
> can execute using real page objects and real test data. However, ALL such
> changes are **provisional** — they are NOT committed or finalized.
> Every framework file change must be **tracked** in a change log.
> After the loop ends (pass or 15-failure limit), ALL provisional changes
> are presented to the user in section 2.7. The user must **explicitly approve**
> each change to keep it, or **revert** it. No change is permanent until
> the user says so. This is non-negotiable.

**STEP A — Pre-Flight Audit (BEFORE the first run, mandatory):**

Do NOT execute the test until this audit is complete.

1. Scan ALL locators used by this TC in the page class file(s)
2. Cross-reference each locator against known-broken patterns in learnings.md
   (e.g., `ShuRu[@name=...]` locators are documented as broken → replace proactively)
3. If any locator matches a known-broken pattern, **fix it directly in the page class
   file** (update or add the locator) so the test runs with real page objects.
   Record the change (file, old value, new value) in the provisional change log
4. Verify that test data values used by autocomplete/dropdown fields match confirmed
   working values in learnings.md (e.g., `"ACT PAYEE"` for existing payee in SIT).
   If a mismatch is found, **update the value in the JSON test data file** directly.
   Record the change (file, field, old value, new value) in the provisional change log
5. Review all interaction patterns against learnings.md:
   - Container vs inner element (e.g., `p-auto-complete` needs inner `input` targeting)
   - Instant `.fill()` vs char-by-char `typeTextThroughKeyBoardAction` for autocomplete
   - Popup/dialog vs inline expandable sections (e.g., ApprovalNow is inline, not a popup)
   - Angular hidden checkboxes needing label click + verify-retry pattern
6. Only proceed to execution after all known issues are resolved

**STEP B — Execute:**

Run the test. During execution (sections 2.2/2.3 apply here — inspect/validate as
each page loads):
- Do NOT interrupt execution or request user approval mid-run
- If a required locator is missing in the page class, **add it to the page class file**
  and record it in the provisional change log
- If test data is wrong, **update the JSON file** and record the change
- Continue the flow using actual working UI values and correct locators

**STEP C — On Failure: DOM-Based Audit + Fix (after EVERY failure):**

When a test execution fails, perform this full cycle before re-executing:

1. **Read the failure** — Error output, error-context.md (ARIA snapshot), and screenshot
2. **Diagnose root cause** — Broken locator, missing element, wrong data, timing issue.
   Cross-check against known patterns in learnings.md. Correlate with test logic,
   framework usage, timing, data dependencies, or environment setup.
3. **Audit ALL remaining steps using the ARIA snapshot** — Do NOT only fix the failed
   element. Use the DOM snapshot to verify:
   - All locators for upcoming steps (are they visible? correct name/role/state?)
   - All test data values (does the selected payee match? are dropdown values correct?)
   - All interaction patterns (is the next section a dialog or inline? is the button
     visible or collapsed behind an expandable link?)
   - All wait strategies (does the page show a spinner or instant UI change?)
4. **Fix ALL predictable issues** — Apply fixes to the appropriate files:
   - **Broken/missing locators** → fix or add in the **page class file** directly
   - **Wrong test data** → update in the **JSON test data file** directly
   - **Spec-level fixes** (waits, interaction patterns, flow logic) → update in the
     **spec file** directly
   - Record EVERY change (file, location, old value, new value) in the provisional
     change log for user review in section 2.7
   - Propose corrective actions strictly within the boundaries of the existing Playwright
     framework. Do not introduce new helpers, utilities, abstractions, or framework changes.
5. **Re-Execute** — Run the test again immediately without asking the user
6. **Repeat** — If the test fails again, go back to step 1

**Retry limits and safety:**
- Maximum **15 consecutive failures** before halting the loop
- If 15 failures are reached, STOP and present the full failure history to the user
- If a failure indicates an **unsafe or destructive condition** (e.g., data corruption,
  environment instability, repeated identical error with no new fix possible), STOP
  immediately and request user intervention — do NOT exhaust all 15 retries
- Each retry must attempt a **different fix** than the previous one; do NOT retry
  the same approach that already failed
- If a test **passes on retry with no code change**, log the flakiness as a learning
  observation but do NOT count it as a fix. Record the flaky step for §2.8d learnings
- If all standard locator strategies are exhausted for a single element (CSS → text →
  role → XPath), use `page.evaluate()` to inspect the live DOM and construct a custom
  locator, or skip the element with a documented note

**What is allowed during the retry loop (provisional — tracked for user review):**
- Editing the spec file (locators, waits, data references, interaction patterns)
- Fixing or adding locators in page class files (e.g., AccountTransferPage.ts)
- Updating values in JSON test data files (e.g., SG_testData.json)
- Switching to alternative locator strategies (CSS → text → role → XPath)
- Adjusting timeouts or wait strategies
- All changes above are **provisional** and recorded in the change log

**What is NEVER allowed during the retry loop:**
- Modifying utility/helper files (e.g., webComponents.ts) — these are shared infrastructure
- Modifying configuration files (e.g., playwright.config.ts)
- Modifying context files (context.md, learnings.md)
- **Committing or finalizing** any provisional change — all changes remain uncommitted
  until the user explicitly approves them in section 2.7

**Provisional Change Log (maintained throughout the loop):**
For every file modified during the retry loop, record:
| Run # | File Modified | Element/Field | Old Value | New Value | Reason |
|-------|--------------|---------------|-----------|-----------|--------|

This log is presented in full to the user in section 2.7.

**CRITICAL RULE — Existing Test Protection (Append Mode):**
During the retry loop, fixes must ONLY affect the newly appended {{NEW_TC_SHORT}} test block.
Do NOT modify the existing {{EXISTING_TC_SHORT}} test block under any circumstance.

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
| Written to page class? (yes/no) | |
| Run number (in retry loop) | |

**For each new UI element not in Protractor source, record:**
| Item | Value |
|------|-------|
| Element name | |
| Working locator | |
| Why it was needed | |
| Run number (in retry loop) | |

All mismatches feed into the Provisional Change Log (section 2.4) and the
Summarize report (section 2.6).

### 2.6 — Summarize (Post-Loop Consolidated Report)

After the test **passes** OR the **15-failure retry limit** is reached,
generate ONE consolidated summary covering **all runs** in the retry loop:

**Section A — Field Value Mismatches**
- All JSON vs UI value differences

**Section B — Locator Mismatches**
- All broken locators with before/after
- All missing locators with proposed additions

**Section C — Provisional Changes Applied**
- Spec file changes (waits, interaction patterns, flow logic)
- Page class changes (locator fixes, new locators added)
- JSON test data changes (field, old value, new value)

**Section D — Execution Summary**
- Total runs in the retry loop
- Total steps executed / passed / failed
- Fixes self-applied per run (categorized: locator, data, wait, interaction)
- Files modified (with change count per file)
- Items pending user approval (keep/revert decision)

### 2.7 — User Approve (Post-Loop Approval Gate)

This step triggers ONCE — only after the retry loop completes (test passes or
15-failure limit reached). Do NOT request approval during the retry loop.

All changes made during the retry loop are **provisional**. Present the complete
Provisional Change Log to the user, organized by file:

**For each modified file, present:**
1. File path
2. Table of all changes (element/field, old value, new value, run # where changed, reason)
3. Ask user: **Keep or Revert?** (per-change or bulk per-file)

**Change categories:**

| Category | Files | Already Written? | User Action |
|----------|-------|-------------------|-------------|
| Spec file changes | `{{TARGET_SPEC_FILE}}` | Yes — in file | **Keep** or **Revert** |
| Page class locator changes | e.g., `AccountTransferPage.ts` | Yes — in file | **Keep** or **Revert** |
| JSON test data changes | e.g., `SG_testData.json` | Yes — in file | **Keep** or **Revert** |
| Learnings updates | `learnings.md` | No — not yet written | **Approve to write** or **Reject** |
| Context updates | `context.md` | No — not yet written | **Approve to write** or **Reject** |

**Rules:**
- Changes are already written to files (provisional) — user decides to **keep** or **revert**
- If user says **revert** → restore the original value in that file immediately
- If user says **keep** → the change becomes permanent (no further action needed)
- Learnings and context updates are the ONLY changes that are NOT pre-written —
  they require explicit **approve to write** before being added
- **Wait for the user to respond** before proceeding. Do NOT auto-approve.
  This is mandatory.

### 2.8 — Update (Apply User Decisions)

After receiving user approval/rejection for each change:

**2.8a. Kept changes (no action needed):**
- Changes the user approved to keep are already in the files — nothing to do

**2.8b. Reverted changes:**
- For each change the user rejected, **restore the original value** in the file
- Verify the file is syntactically valid after revert
- If reverting a locator breaks the test, warn the user

**2.8c. Context updates (write only if approved):**
- These are NOT pre-written — apply only after explicit user approval
- Update context.md with approved framework discoveries

**Constraints on all updates:**
- Preserve the execution flow — no regressions
- Do not break existing functionality or downstream validations
- Do not modify unrelated data, locators, or framework code
- Remain compliant with context.md and learnings.md standards

### 2.8d — Update Learnings (Record Migration Findings)

After applying user decisions, propose additions to `tests/testContexts/learnings.md`
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

**Learning & Retention:**
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
     - Stage 1 conversion (prompt received → spec file created/appended)
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

   **F. Final Output**
   - Final spec file content (or diff from initial conversion)
   - Framework changes applied (after approval)
   - Framework changes proposed but not applied
   - Learnings added to learnings.md

3. Format: Styled HTML that opens cleanly in both browser and Microsoft Word
4. Confirm the report file location to the user

### 2.10 — Data Security, Retention, and Cleanup

**During the retry loop — minimize exposure:**
- Do not store or expose sensitive data (credentials, PII, account numbers) in logs,
  screenshots, or conversation output
- Sanitize or mask sensitive information before including in the HTML report
- Keep DOM snapshots, ARIA snapshots, locator analysis, and test data values
  **in working memory only** — they are needed for diagnosis during the loop
- Do NOT write raw DOM/ARIA snapshots to any file outside of error-context.md
  (which the framework manages)

**Cleanup trigger — after ALL of the following are complete:**
1. User has approved/reverted all provisional changes (§2.7 → §2.8)
2. Approved learnings have been written to learnings.md (§2.8d)
3. Approved context updates have been written to context.md (§2.8c)
4. HTML migration report has been generated (§2.9)

**What to purge from working memory after the trigger:**

| Artifact | Retained during loop? | Purge after trigger? |
|----------|----------------------|---------------------|
| DOM / ARIA snapshots | Yes — for diagnosis | **Yes — purge** |
| Screenshots (in-memory) | Yes — for locator verification | **Yes — purge** |
| Mismatch logs (field, locator, element) | Yes — for §2.5/2.6 | **Yes — purge** |
| Provisional Change Log | Yes — for §2.7 | **Yes — purge** |
| Raw test data values from JSON | Yes — for validation | **Yes — purge** |
| Locator analysis (old vs new) | Yes — for fix tracking | **Yes — purge** |
| Error output / stack traces | Yes — for diagnosis | **Yes — purge** |
| Failure history (per-run) | Yes — for §2.9 report | **Yes — purge** |
| Approved learnings | Written to learnings.md | **Yes — purge from memory** |
| Approved context updates | Written to context.md | **Yes — purge from memory** |
| HTML report content | Written to file | **Yes — purge from memory** |

**What is NOT purged (persists in files):**
- The spec file (kept/reverted changes are final)
- Page class files (kept/reverted changes are final)
- JSON test data files (kept/reverted changes are final)
- learnings.md (approved additions are permanent)
- context.md (approved additions are permanent)
- HTML migration report file (on disk)

**Final confirmation must include:**
- What fixes were applied (spec-file and framework)
- What fixes were proposed but not applied
- What spec-file changes were kept vs reverted
- Confirmation that all in-memory runtime data has been purged
- Whether any on-disk artifacts remain (HTML report, error-context.md)

### 2.11 — Output Constraint

- If fixes are applied, regenerate only the corrected, executable Playwright .spec.ts file
- Ensure the final output remains fully compliant with context.md rules and learnings.md
  observations
- Ensure compliance with existing framework standards
- Do not output execution logs, analysis notes, or explanatory commentary unless
  explicitly requested
```

---

## Key Differences Between the Examples

| Aspect | Example 1 (Create) | Example 2 (Append — Parallel) |
|--------|--------------------|--------------------|
| File operation | Creates a brand new `.spec.ts` file | Edits an existing `.spec.ts` file |
| `test.describe` block | New block is created | Reuses existing block |
| `beforeEach` / `afterEach` | New blocks are created | Reuses existing blocks |
| Imports | Full imports generated | Only adds missing imports |
| Stage 1 sections | 1.1–1.7 (no 1.5a) | 1.1–1.7 including 1.5a (Append Mode Rules with serial patterns) |
| Execution command | Runs the full file | Runs with `-g` flag to target only the new TC |
| Existing TCs | Not applicable | Protected — never modified |
| Resulting file | Contains only the new TC | Contains {{EXISTING_TC_SHORT}} + {{NEW_TC_SHORT}} |
| Extra safety rule | — | "Existing Test Protection" rule in 2.4 |
| Shared state | N/A | Parallel = none; Serial = shared variables in describe scope |

> **Serial mode:** To use Example 2 for a dependent TC (serial mode), change
> `Execution Mode: parallel` → `serial` and `Run Scope: new` → `all` in the
> prompt header. The 1.5a section already includes serial patterns (#4 and #5).

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v01 | 13 Apr 2026 | Initial execution prompt — manual approval after each failure |
| v02 | 13 Apr 2026 | Autonomous retry loop (15 max), single post-loop approval gate |
| v03 | 13 Apr 2026 | Unified two-stage prompt: Stage 1 (Convert) + Stage 2 (Execute + Auto-Fix + Report). Combines migration-prompt.md and migration-execution-prompt-02.md into a single end-to-end workflow. Added append mode, execution command, locator exhaustion guidance, timeline with Stage 1 breakdown. |
| v04 | 14 Apr 2026 | Single self-contained file. Both examples include ALL rules inline with full detail. Added: (1) MANDATORY Write Provisionally + Deferred Approval rule in 2.4, (2) Source TC Guard in 1.1, (3) Full serial mode patterns in 1.5a, (4) Execution order clarification for 2.2/2.3 vs STEP A, (5) Explicit "What is NEVER allowed" list in 2.4, (6) STEP A items 3-4 write directly to page class / JSON files, (7) §2.3 aligned with provisional write model, (8) §2.1 Run Scope conditional execution command, (9) Flaky test handling, (10) §2.10 rewritten with explicit cleanup trigger, artifact purge table, and sequencing (purge after learnings applied). |
