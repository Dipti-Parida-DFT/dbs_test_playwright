
## 1. Primary Objective
Apply all rules, constraints, and standards defined in the authoritative context.md file.
Also refer to the application behavior observations in tests/testContexts/learnings.md for runtime learnings discovered during prior test executions.

Convert Test Case TC01 "TC01_Create ManagePayrollDBS with new payee" from the Protractor source file into an equivalent Playwright test specification, 
preserving functional behavior, execution flow, and all existing validations.

##Before and during conversion:

Analyze the existing Playwright framework structure, including folder layout, base test setup, fixtures, and configuration files
Review existing Playwright .spec.ts files to understand the standard test skeleton, structure, naming conventions, and setup/teardown patterns
Examine available utilities, helpers, page objects, and shared .ts files to identify reusable logic, prerequisites, and dependencies required for the new test
Ensure all required logic is derived from existing framework assets only, without duplication or framework modification

## 2. Source Test File
Location:
C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer
File: SG_ManagePayroll.test.ts

## 3. Target Playwright Framework
Location: dbs_test_playwright

## 3.1. Reference Files
## 1. Rules: context.md — Framework governance and coding standards
## 2. Learnings: tests/testContexts/learnings.md — Application behavior observations from prior executions

## 5. Requirements
-Reuse existing Playwright framework assets (page objects, utilities, helpers, base tests)
-Ensure all test steps and assertions from the Protractor test are fully reflected
-Preserve functional behavior, execution order, and validation intent
-Do not modify existing test data, configurations, constants, or framework components
-Follow established Playwright test structure and coding patterns as observed in existing .spec.ts files
-Apply runtime behavior learnings from learnings.md (auth handling, UX loading, timeouts, etc.)

## 6. Deliverable
-Create a ready-to-execute Playwright test specification file named: "SG_ManagePayrollTC001AgentGenerated.spec.ts".

## 7. Output Constraint
-Output only the executable Playwright .spec.ts file
-Ensure full compliance with context.md rules and learnings.md observations
-Ensure compliance with existing framework standards