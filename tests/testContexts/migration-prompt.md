
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

###########################

For Append Point 6:

-Append Test Case TC03 in to the existing Playwright test specification file: 
SG_ManagePayrollTC001AgentGenerated.spec.ts, reusing the existing structure and framework assets.

########################################################################

Step 2: 

Production-Grade Validation & Execution Prompt
1. Pre-Execution Context Loading
-Before executing any test, load and apply the following reference files:

#Rules: context.md — Framework governance, coding standards, and constraints
#Learnings: learnings.md — Application behavior observations from prior executions (auth handling, UX loading, timeouts, etc.)
#Cross-reference all test steps against both files to identify potential issues before execution begins.

2. Execution & Validation Objective
-Execute the newly generated Playwright test specification and validate its end-to-end runtime behavior.

#During execution:
-Observe and verify all executed test steps, control flow, and sequencing
-Validate runtime logic, assertions, and expected outcomes
-Confirm correct usage of test data, fixtures, and existing framework utilities
-Ensure compliance with existing Playwright framework behavior and conventions
-Verify adherence to application behavior learnings documented in learnings.md
-Maintain the complete execution context (runtime observations, failures, and outcomes) to ensure consistency and continuity within the same MCP workflow and any subsequent file generation.

3. Failure Handling & Analysis
#If any failures occur during execution:
-Perform a detailed analysis of the failure, including root cause identification
-Cross-check the failure against known patterns in learnings.md before investigating further
-Correlate failures with test logic, framework usage, timing, data dependencies, or environment setup
-Propose corrective actions strictly within the boundaries of the existing Playwright framework
-Do not introduce new helpers, utilities, abstractions, or framework changes

4. Learning & Retention
-Record all failure reasons, observations, and corrective learnings internally
-If a new runtime behavior is discovered (not already in learnings.md), append it to learnings.md under the appropriate section
-Retain these learnings for future reference to improve accuracy and stability in subsequent conversions and new test authoring
-Do not include internal learning logs or reasoning in the final output unless explicitly requested

5. Output Constraint
-If fixes are applied, regenerate only the corrected, executable Playwright .spec.ts file
-Ensure the final output remains fully compliant with context.md rules and learnings.md observations
-Ensure compliance with existing framework standards
-Do not output execution logs, analysis notes, or explanatory commentary unless explicitly requested
