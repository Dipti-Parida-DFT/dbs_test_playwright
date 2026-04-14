# Migration Prompt v03 — Ready-to-Use Examples

> Copy-paste-ready prompts using the v03 unified two-stage template.
> Update the variable values below, then copy the example.

---

## Example Variables — Update These Before Use

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
   to diagnose the root cause (broken locator, missing element, wrong data, timing issue).
   Cross-check the failure against known patterns in learnings.md before investigating further.
2. **Self-Fix** — Apply the fix to the **spec file only** (in-memory locators, waits,
   data overrides, interaction patterns). Spec-file changes do NOT require user approval
   during the retry loop.
3. **Re-Execute** — Run the test again immediately without asking the user
4. **Repeat** — If the test fails again, go back to step 1

**Proactive Audit — Locator & Test Data Verification:**

Do NOT wait for multiple runtime failures to discover broken locators or bad test data.
Apply these proactive checks before and after every execution to avoid wasting retries:

**Before the first run (mandatory pre-flight check):**
- Scan ALL locators used by this TC in the page class file(s)
- Cross-reference each locator against known-broken patterns in learnings.md
  (e.g., `ShuRu[@name=...]` locators are documented as broken → replace proactively)
- If any locator matches a known-broken pattern, fix it BEFORE executing
- Verify that all test data values used by autocomplete/dropdown fields exist in the
  target environment (check learnings.md for confirmed working values)
- Review all interaction patterns: container vs inner element, instant fill vs
  char-by-char typing, popup vs inline expandable sections

**After EVERY failure (mandatory DOM-based audit):**
- Read the error-context.md (ARIA snapshot) from the failed run
- Use the ARIA snapshot to verify ALL remaining locators and test data for upcoming
  steps — not just the element that failed
- Cross-reference ARIA element names, roles, states, and text against:
  - The page class locators for this TC
  - The test data values (especially autocomplete, dropdown, radio, checkbox fields)
  - The interaction patterns (is it a dialog or inline? is the button visible or
    collapsed behind an expandable section?)
- Identify and fix ALL predictable failures visible in the DOM before re-executing
- If the ARIA snapshot shows elements from upcoming steps, validate their locators
  proactively rather than waiting for the test to reach them and fail

**What to audit each time:**
- All locators in the page class used by this TC (broken patterns, ShuRu, positional XPath)
- All test data values used for autocomplete, dropdown, and radio/checkbox fields
- All interaction patterns (container vs inner element, instant fill vs char-by-char typing)
- All wait strategies (popup vs inline, dialog vs expandable section)
- UI structure visible in the ARIA snapshot (collapsed sections, disabled buttons,
  missing elements, changed labels)

**Retry limits and safety:**
- Maximum **15 consecutive failures** before halting the loop
- If 15 failures are reached, STOP and present the full failure history to the user
- If a failure indicates an **unsafe or destructive condition**, STOP immediately
- Each retry must attempt a **different fix** than the previous one
- If all standard locator strategies are exhausted (CSS → text → role → XPath),
  use `page.evaluate()` to inspect the live DOM and construct a custom locator

**CRITICAL RULE — Framework File Protection:**
Do NOT modify ANY existing framework file without explicit user approval:
- Page class files, JSON test data files, utility/helper files, configuration files,
  context.md, or learnings.md

### 2.5 — Capture (Record All Mismatches)

Capture every mismatch discovered during execution into a structured log.
This log is maintained across all runs in the retry loop.

### 2.6 — Summarize (Post-Loop Consolidated Report)

After the test **passes** OR the **15-failure retry limit** is reached,
generate ONE consolidated summary covering **all runs**.

### 2.7 — User Approve (Post-Loop Approval Gate)

Present all spec-file changes and proposed framework changes for user approval.

### 2.8 — Update (Apply Approved Changes Only)

Only after user approval, apply approved framework changes.

### 2.9 — Report

Generate: `{{TEST_CASE_ID}}_Migration_ChatLog.html`
with Sections A (Journey), B (Mismatches), C (Metrics), D (Timeline), E (Auto-Retry Stats), F (Final Output).

**MANDATORY — Section D: Overall Migration Timeline (Prompt to Pass)**

This section MUST be included in every report. It tracks the complete wall-clock time
from when the migration prompt was first received until the final stable passing run.

1. **Headline number:** Single prominent banner showing total migration time
   (e.g., "Overall Migration Time: ~2.5 hours")
2. **Phase-by-phase breakdown table:** Each phase with activity description and duration:
   - Stage 1 — Conversion (prompt received → spec file created/appended)
   - Each execution run (run start → failure → analysis → fix → next run)
   - Final pass run
   - Post-pass activities (learnings update, reporting, user interactions)
3. **Cumulative test execution time table:** Each run with status, duration, and running total
4. **Time efficiency analysis:** Percentage split across:
   - Stage 1 Conversion
   - Test Execution (cumulative)
   - Analysis, Diagnosis & Fix Application
   - Post-Pass & Reporting
5. **Summary metric cards:** Visual cards for conversion time, execution time,
   analysis time, and total migration time

**Timestamp tracking (enforced from prompt start):**
- The "Record the wall-clock timestamp when this prompt is first received" instruction
  at the top of Stage 1 provides the start time
- Each run's start/end is captured from test execution output
- Final pass time is the end marker
- Post-pass activities (learnings, report, cleanup) are tracked until completion

### 2.10 — Cleanup

Sanitize sensitive data, remove temporary artifacts, provide final confirmation.
```

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

4. **Execution mode — `parallel`:**
   - {{NEW_TC_SHORT}} is independent of {{EXISTING_TC_SHORT}}, so no serial configuration is needed
   - Tests can run in any order; no shared state between tests

5. **Do NOT modify existing test blocks:**
   - Do NOT rename, reorder, or alter the existing {{EXISTING_TC_SHORT}} `test()` block
   - Do NOT change existing assertions, locators, or test data references

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

**Execution command (Run Scope = `new` — only the appended TC):**
```
npx playwright test {{TARGET_SPEC_FILE}} -g "{{TEST_CASE_ID}}" --headed --reporter=list
```

> **Note:** Only {{NEW_TC_SHORT}} is executed. {{EXISTING_TC_SHORT}} is NOT re-executed since this is parallel mode
> with Run Scope = `new`.

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
   to diagnose the root cause (broken locator, missing element, wrong data, timing issue).
   Cross-check the failure against known patterns in learnings.md before investigating further.
2. **Self-Fix** — Apply the fix to the **spec file only** (in-memory locators, waits,
   data overrides, interaction patterns). Spec-file changes do NOT require user approval
   during the retry loop.
3. **Re-Execute** — Run the test again immediately without asking the user
4. **Repeat** — If the test fails again, go back to step 1

**Proactive Audit — Locator & Test Data Verification:**

Do NOT wait for multiple runtime failures to discover broken locators or bad test data.
Apply these proactive checks before and after every execution to avoid wasting retries:

**Before the first run (mandatory pre-flight check):**
- Scan ALL locators used by this TC in the page class file(s)
- Cross-reference each locator against known-broken patterns in learnings.md
  (e.g., `ShuRu[@name=...]` locators are documented as broken → replace proactively)
- If any locator matches a known-broken pattern, fix it BEFORE executing
- Verify that all test data values used by autocomplete/dropdown fields exist in the
  target environment (check learnings.md for confirmed working values)
- Review all interaction patterns: container vs inner element, instant fill vs
  char-by-char typing, popup vs inline expandable sections

**After EVERY failure (mandatory DOM-based audit):**
- Read the error-context.md (ARIA snapshot) from the failed run
- Use the ARIA snapshot to verify ALL remaining locators and test data for upcoming
  steps — not just the element that failed
- Cross-reference ARIA element names, roles, states, and text against:
  - The page class locators for this TC
  - The test data values (especially autocomplete, dropdown, radio, checkbox fields)
  - The interaction patterns (is it a dialog or inline? is the button visible or
    collapsed behind an expandable section?)
- Identify and fix ALL predictable failures visible in the DOM before re-executing
- If the ARIA snapshot shows elements from upcoming steps, validate their locators
  proactively rather than waiting for the test to reach them and fail

**What to audit each time:**
- All locators in the page class used by this TC (broken patterns, ShuRu, positional XPath)
- All test data values used for autocomplete, dropdown, and radio/checkbox fields
- All interaction patterns (container vs inner element, instant fill vs char-by-char typing)
- All wait strategies (popup vs inline, dialog vs expandable section)
- UI structure visible in the ARIA snapshot (collapsed sections, disabled buttons,
  missing elements, changed labels)

**Retry limits and safety:**
- Maximum **15 consecutive failures** before halting the loop
- If 15 failures are reached, STOP and present the full failure history to the user
- If a failure indicates an **unsafe or destructive condition**, STOP immediately
- Each retry must attempt a **different fix** than the previous one
- If all standard locator strategies are exhausted (CSS → text → role → XPath),
  use `page.evaluate()` to inspect the live DOM and construct a custom locator

**CRITICAL RULE — Framework File Protection:**
Do NOT modify ANY existing framework file without explicit user approval:
- Page class files, JSON test data files, utility/helper files, configuration files,
  context.md, or learnings.md

**CRITICAL RULE — Existing Test Protection (Append Mode):**
During the retry loop, fixes must ONLY affect the newly appended {{NEW_TC_SHORT}} test block.
Do NOT modify the existing {{EXISTING_TC_SHORT}} test block under any circumstance.

### 2.5 — Capture (Record All Mismatches)

Capture every mismatch discovered during execution into a structured log.
This log is maintained across all runs in the retry loop.

### 2.6 — Summarize (Post-Loop Consolidated Report)

After the test **passes** OR the **15-failure retry limit** is reached,
generate ONE consolidated summary covering **all runs**.

### 2.7 — User Approve (Post-Loop Approval Gate)

Present all spec-file changes and proposed framework changes for user approval.

### 2.8 — Update (Apply Approved Changes Only)

Only after user approval, apply approved framework changes.

### 2.9 — Report

Generate: `{{TEST_CASE_ID}}_Migration_ChatLog.html`
with Sections A (Journey), B (Mismatches), C (Metrics), D (Timeline), E (Auto-Retry Stats), F (Final Output).

**MANDATORY — Section D: Overall Migration Timeline (Prompt to Pass)**

This section MUST be included in every report. It tracks the complete wall-clock time
from when the migration prompt was first received until the final stable passing run.

1. **Headline number:** Single prominent banner showing total migration time
   (e.g., "Overall Migration Time: ~2.5 hours")
2. **Phase-by-phase breakdown table:** Each phase with activity description and duration:
   - Stage 1 — Conversion (prompt received → spec file created/appended)
   - Each execution run (run start → failure → analysis → fix → next run)
   - Final pass run
   - Post-pass activities (learnings update, reporting, user interactions)
3. **Cumulative test execution time table:** Each run with status, duration, and running total
4. **Time efficiency analysis:** Percentage split across:
   - Stage 1 Conversion
   - Test Execution (cumulative)
   - Analysis, Diagnosis & Fix Application
   - Post-Pass & Reporting
5. **Summary metric cards:** Visual cards for conversion time, execution time,
   analysis time, and total migration time

**Timestamp tracking (enforced from prompt start):**
- The "Record the wall-clock timestamp when this prompt is first received" instruction
  at the top of Stage 1 provides the start time
- Each run's start/end is captured from test execution output
- Final pass time is the end marker
- Post-pass activities (learnings, report, cleanup) are tracked until completion

### 2.10 — Cleanup

Sanitize sensitive data, remove temporary artifacts, provide final confirmation.
```

---

## Quick Decision Guide

| Scenario | MODE | EXECUTION_MODE | RUN_SCOPE | TARGET_SPEC_FILE |
|----------|------|----------------|-----------|------------------|
| New file, one TC | `create` | `parallel` | `new` | New file name (e.g., `...TC002AgentGenerated.spec.ts`) |
| Add independent TC to existing file | `append` | `parallel` | `new` | Existing file name (e.g., `...TC001AgentGenerated.spec.ts`) |
| Add dependent TC (needs earlier TC's data) | `append` | `serial` | `all` | Existing file name |

## Key Differences Between the Two Examples

| Aspect | Example 1 (Create) | Example 2 (Append) |
|--------|--------------------|--------------------|
| File operation | Creates a brand new `.spec.ts` file | Edits an existing `.spec.ts` file |
| `test.describe` block | New block is created | Reuses existing block |
| `beforeEach` / `afterEach` | New blocks are created | Reuses existing blocks |
| Imports | Full imports generated | Only adds missing imports |
| Execution command | Runs the new file | Runs with `-g` flag to target only the new TC |
| Existing TCs | Not applicable | Protected — never modified |
| Resulting file | Contains only {{NEW_TC_SHORT}} | Contains {{EXISTING_TC_SHORT}} + {{NEW_TC_SHORT}} |
