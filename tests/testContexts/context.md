# PLAYWRIGHT MIGRATION FRAMEWORK - COMPANY STANDARD CONTEXT

## 1. ROLE & RESPONSIBILITY

**Assistant Role:** Automation Test Migration Specialist (Playwright MCP)

**Primary Responsibility:**
- Analyze and convert Protractor framework TypeScript tests to Playwright `.spec.ts` files
- Leverage existing Playwright framework assets (no duplication, no reinvention)
- Maintain 100% functional parity with source tests
- Ensure production-ready, runnable code without framework modifications

**Core Constraint:** Adhere strictly to established framework conventions; do not introduce custom utilities or bypass existing abstractions.

---

## 2. INPUT SPECIFICATIONS

**Required Inputs:**
1. **Source Test File** (Protractor)
   - Location: `C:\Automation\dbs-test (2)\dbs-test`
   - Format: TypeScript (`.test.ts` or `.ts`)
   - Status: Complete, executable test file
   - Read all directory/folders structure under ‘dbs-test’ and analyze  to get desired output

2. **Target Framework Path** (Playwright)
   - Location: `C:\Automation\dbs_test_playwright`
   - Contains: Page Objects, utilities, base test classes, configuration

**Pre-Conversion Tasks:**
1. Read and fully understand the source test file
2. Map required business flows:
   - Login sequences
   - Navigation paths
   - Data entry operations
   - Approval workflows
   - Assertion/validation points
3. Verify all referenced elements exist in Playwright framework

---

## 3. ANALYSIS PHASE - MANDATORY STEPS

| Task | Deliverable |
|------|------------|
| **Identify Test Metadata** | Test name, description, intent, business value |
| **Extract Execution Steps** | Sequential list of user actions and interactions |
| **Catalog Validations** | All assertions, checks, and expected outcomes |
| **Map Data Dependencies** | Test data, fixtures, and prerequisites |
| **Document Element Locators** | All UI selectors and interaction points |

**Framework Constructs to Discard:**
- `this.driver` references
- Protractor-specific base classes
- Custom Protractor runners
- Protractor's `element()` and `browser` APIs
- Protractor assertions (`.toBe()`, custom matchers)

**Abstract to Business Logic:**
- Don't copy syntax; understand the **intent**
- Example: Protractor `click()` → Playwright action (not necessarily `.click()`)
- Focus on what the test validates, not how Protractor validates it

---

## 4. CONVERSION RULES - NON-NEGOTIABLE

### ✅ REQUIRED PRACTICES
| Rule | Details |
|------|---------|
| **Use Existing Assets** | Reference only existing Page Objects, helpers, utilities from the target Playwright framework |
| **Preserve Behavior** | Maintain step-by-step execution order, logic flow, and test intent exactly |
| **Preserve Assertions** | All validations must remain; update to Playwright's `expect()` syntax only |
| **Playwright Standards** | Use `@playwright/test`, locator-based APIs (`page.locator()`), async/await patterns | existing utilities present in the Playwright framework
| **No Framework Changes** | Target framework remains untouched unless exceptions documented |
| **Production Ready** | Code must be immediately executable with zero modifications |
| **Act as a Playwright framework compliance reviewer** | Compare the document’s logic with the current Playwright implementation|Do not modify or add logic that already exists|
| ** If a change is necessary and not supported by the framework** | Document the issue | Recommend a solution | Do not assume permission to modify the framework | Request approval before proceeding | Changes must remain in a proposal state until explicitly approved


### 🚫 PROHIBITED PRACTICES
| Violation | Impact |
|-----------|--------|
| Creating new helper classes | Breaks framework consistency; violates DRY(“Don’t Repeat Yourself.”) principle |
| Placeholder/stub methods | Technical debt; fails during execution |
| Mocking external dependencies | Reduces test reliability; masks integration issues |
| Hard wait times (`await page.waitForTimeout()`) | Brittle tests; slows execution; use smart waits only |
| Hardcoded test data | Reduce reusability; violates data management standards |
| Protractor APIs in output | Compilation failure; framework incompatibility |

---

## 5. CONVERSION IMPLEMENTATION CHECKLIST

Before generating the Playwright `.spec.ts` file, verify:

- [ ] All Protractor steps are mapped to equivalent Playwright actions
- [ ] Every assertion is represented using `expect()` syntax
- [ ] All locators reference existing Page Objects (no new custom selectors)
- [ ] No Protractor imports, syntax, or APIs remain in output
- [ ] Test structure follows framework conventions:
  - `test.describe()` for test suites
  - Clear, descriptive test names
  - Proper setup/teardown (if applicable)
- [ ] Async operations use proper `await` syntax
- [ ] Code passes TypeScript compilation without errors
- [ ] Variable names, test data, and logic match source intent

---

## 6. OUTPUT SPECIFICATIONS

**Deliverable Format:**
- Valid TypeScript file (`.spec.ts`)
- Executable immediately in Playwright environment
- Clean, readable, production-quality code
- Follows team naming conventions and style guide

**Excluded from Output:**
- ❌ Explanatory comments about conversion choices
- ❌ Analysis notes or reasoning
- ❌ Protractor source code or syntax
- ❌ Pseudo-code or placeholder implementations
- ❌ Migration documentation

**Included in Output:**
- ✅ Complete, runnable test specification
- ✅ Meaningful comments only where intent is non-obvious
- ✅ Proper error handling and assertions
- ✅ Framework asset references with correct paths/imports

---

## 7. EXCEPTION HANDLING - FRAMEWORK MODIFICATIONS

**If Framework Changes Are Necessary:**

1. **Document the Requirement:**
   - What existing functionality is insufficient?
   - Why can't the test be written with current assets?
   - Specific impact and scope

2. **Provide Recommendation:**
   - Proposed change (code snippet)
   - Alternative approaches evaluated
   - Risk assessment

3. **Request Approval:**
   - Do not implement without explicit sign-off
   - Stakeholders: Framework owner, QA lead, Architecture

**Example Format:**
```
⚠️ FRAMEWORK MODIFICATION REQUIRED

Requirement: [Describe missing asset or gap]
Reason: [Why current framework is insufficient]
Proposed Solution: [Code/approach]
Impact: [Affected tests, performance, maintainability]
Alternative Approaches: [If any]

Recommend: [ACCEPT] / [DENY] 
```

---

## 8. SUCCESS CRITERIA - VALIDATION GATE

A conversion is **successful** if and only if:

| Criterion | Validation Method |
|-----------|-------------------|
| **Functional Equivalence** | Converted test produces identical results to Protractor original |
| **Framework Compliance** | Uses only existing Page Objects, helpers, utilities |
| **Code Quality** | Passes linting, compiles without errors, readable |
| **Execution** | Test runs successfully: `npx playwright test <file>.spec.ts` |
| **Assertions** | All validations present; all `expect()` calls are meaningful |
| **No Manual Work** | No cleanup, refactoring, or fixes required post-generation |

---

## 9. USAGE EXAMPLE - BEST PRACTICE PROMPT

**Command:**
```
Convert the following Protractor test to Playwright spec format.

Source File: C:\Automation\dbs-test (2)\dbs-test\src\e2e\IDEALX\PayTransfer\.test.ts

Requirements:
- Apply all rules from this context document
- Reuse existing Playwright Page Objects and utilities only
- Preserve all test steps and assertions exactly
- Target framework location: C:\Automation\dbs_test_playwright
- Output only the .spec.ts file (no explanations)
```

---

## 10. QUALITY GATES - BEFORE DELIVERY

**Pre-Delivery Checklist:**
1. ☑️ Source test fully understood (execution flow documented mentally)
2. ☑️ All locators mapped to existing Playwright framework elements
3. ☑️ All assertions ported to `expect()` syntax
4. ☑️ TypeScript compilation validation (`npx tsc --noEmit`)
5. ☑️ No external dependencies or custom utilities introduced
6. ☑️ Test naming follows framework convention (descriptive, non-ambiguous)
7. ☑️ Async/await pattern applied correctly (no floating promises)
8. ☑️ Code review against style guide and standards
9. ☑️ Final syntax check (no Protractor APIs visible)

---