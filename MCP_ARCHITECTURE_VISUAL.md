# MCP Architecture Diagram & Visual Summary

## 1. MCP Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB COPILOT (Chat)                        │
│                                                                   │
│  User: "@playwright run TC11 test"                              │
│  User: "@playwright analyze failures"                           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Protocol: stdio (standard input/output)
                     │ Communication: Structured Messages
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                   MCP SERVER LAYER                               │
│          (@playwright/mcp server via npx)                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Capabilities:                                            │   │
│  │ • run_tests - Execute test suites                       │   │
│  │ • list_tests - List available tests                     │   │
│  │ • analyze_failures - Analyze test failures              │   │
│  │ • generate_test - Generate tests from descriptions      │   │
│  │ • get_test_results - Retrieve test results              │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Orchestration
                     │
┌────────────────────▼────────────────────────────────────────────┐
│              PLAYWRIGHT TEST RUNNER                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Config: playwright.config.ts                             │ │
│  │ • Project settings (e2e, api, mobile)                    │ │
│  │ • Timeout configuration                                  │ │
│  │ • Reporter setup (HTML, JSON, Allure)                    │ │
│  │ • Device/browser configuration                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Test Specs: tests/e2e/**/*.spec.ts                       │ │
│  │ • TC01 - TC11 test cases                                 │ │
│  │ • API tests                                              │ │
│  │ • Page Object Models (pages/*)                           │ │
│  │ • Test data (config/test-data.json)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Web Components Helper (shared utilities)                 │ │
│  │ • Element interactions                                   │ │
│  │ • Wait strategies                                        │ │
│  │ • Assertion helpers                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Browser Automation
                     │
┌────────────────────▼────────────────────────────────────────────┐
│              PLAYWRIGHT BROWSER                                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Browsers:                                                │ │
│  │ • Chrome (Chromium)                                      │ │
│  │ • Firefox                                                │ │
│  │ • Safari (WebKit)                                        │ │
│  │ • Mobile (Pixel 5, iPhone 12, etc.)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Capabilities:                                            │ │
│  │ • Screenshots (on-failure)                               │ │
│  │ • Video recording (on-failure)                           │ │
│  │ • Trace files (debugging)                                │ │
│  │ • Network interception                                   │ │
│  │ • Cookie/LocalStorage management                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     │
┌────────────────────▼────────────────────────────────────────────┐
│           APPLICATION UNDER TEST (DBS)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ DBS Banking Application (Angular 17+)                    │ │
│  │ • Account Transfer Module                                │ │
│  │ • Transfer Center                                        │ │
│  │ • Payroll Management                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Configuration File Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      STARTUP SEQUENCE                            │
└──────────────────────────────────────────────────────────────────┘

.vscode/mcp.json
    ↓
    ├─► "servers": {
    │     "playwright": {
    │        "command": "npx",
    │        "args": ["-y", "@playwright/mcp@latest"],
    │        "type": "stdio"
    │     }
    │   }
    │
    └─► Registers Playwright MCP Server
        │
        ├─► .vscode/settings.json
        │   └─► "chat.tools.terminal.autoApprove": {
        │       "npx playwright": true
        │     }
        │
        └─► VS Code Initializes MCP
            │
            ├─► Copilot Chat gains @playwright access
            │
            └─► playwright.config.ts LOADS
                │
                ├─► Projects configuration (e2e, api, mobile)
                ├─► Timeouts & parallelization
                ├─► Reporters (HTML, Allure, JSON)
                ├─► Browser settings (headless, viewport)
                │
                └─► Tests READY TO RUN
                    │
                    ├─► package.json scripts available
                    ├─► test-data.json loaded
                    ├─► .env variables loaded
                    │
                    └─► npx playwright test [options]
                        │
                        ├─► test-results/ folder created
                        ├─► allure-results/ populated
                        ├─► playwright-report/ generated
                        │
                        └─► Reports READY

```

---

## 3. Data Flow: Single Test Execution

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: User Input                                              │
│ "Run TC11 test with cross-currency transfer"                   │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: MCP Server Receives Request                             │
│ • Parse command                                                 │
│ • Validate test name/pattern                                    │
│ • Check test file existence                                     │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Playwright Executes Test                                │
│                                                                  │
│ SG_AccountTransferTC001AgentGenerated.spec.ts:                 │
│ ├─ read: test-data.json                                        │
│ ├─ load: pages/AccountTransferPage.ts                          │
│ ├─ load: pages/TransferCentersPage.ts                          │
│ ├─ load: web-components.ts (helpers)                           │
│ │                                                               │
│ └─ execute: TC011 test                                         │
│    ├─ PHASE 1: CREATE (Navigate → Select Account → Amount)     │
│    ├─ PHASE 2: SEARCH (Go to Transfer Center → Search Ref)     │
│    ├─ PHASE 3: EDIT (Change Currency → Set Amounts)            │
│    ├─ PHASE 4: VALIDATE (Read Form Values)                     │
│    └─ PHASE 5: DELETE (Click Delete → Verify)                  │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Artifacts Collected                                     │
│ • Screenshots: test-results/screenshots/                        │
│ • Videos: test-results/videos/                                 │
│ • Traces: test-results/traces/                                 │
│ • JSON results: allure-results/*.json                           │
│ • Logs: logs/                                                   │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Reporter Processes Results                              │
│                                                                  │
│ ├─► HTML Report (playwright-report/)                            │
│ │   └─ Interactive result viewer                               │
│ │                                                               │
│ ├─► Allure Report (allure-report/)                              │
│ │   ├─ Timeline view                                            │
│ │   ├─ Behavior clustering                                      │
│ │   ├─ Defect analysis                                          │
│ │   └─ Historical trends                                        │
│ │                                                               │
│ └─► JSON Report (test-results/results.json)                     │
│     └─ Parsed by CI/CD tools                                    │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: MCP Server Returns Results                              │
│ • Test status: PASSED / FAILED                                  │
│ • Duration: 1.9m                                                │
│ • Artifacts: URLs to reports                                    │
│ • Error details (if failed)                                     │
└────────────────┬────────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 7: Copilot Chat Displays Results                           │
│ • Summary in chat                                               │
│ • Links to reports                                              │
│ • Error analysis (if failed)                                    │
│ • Suggested fixes                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. File Dependency Graph

```
playwright.config.ts
    │
    ├─→ devices (from @playwright/test)
    ├─→ defineConfig (from @playwright/test)
    │
    └─► Source tests from:
        │
        └─► tests/e2e/IDEALX/PayTransfer/
            │
            ├─► SG_AccountTransferTC001AgentGenerated.spec.ts
            │   │
            │   ├─► import { test, expect } from '@playwright/test'
            │   │
            │   ├─► load: pages/AccountTransferPage.ts
            │   │   ├─► page.locator() selectors
            │   │   ├─► wait methods
            │   │   └─► helper methods
            │   │
            │   ├─► load: pages/TransferCentersPage.ts
            │   ├─► load: pages/TelegraphicTransferPage.ts
            │   ├─► load: pages/PayrollPage.ts
            │   │
            │   ├─► load: fixtures/web-components.ts
            │   │   ├─► clickWhenVisibleAndEnabled()
            │   │   ├─► typeTextThroughKeyBoardAction()
            │   │   ├─► compareUIVsJsonValue()
            │   │   └─► other helpers
            │   │
            │   └─► load: fixtures/SG_testData.json
            │       ├─► user credentials
            │       ├─► account numbers
            │       ├─► transfer amounts
            │       └─► expected values


package.json
    │
    ├─► devDependencies:
    │   ├─► @playwright/test (^1.58.2)
    │   ├─► @playwright/mcp (for MCP integration)
    │   ├─► allure-playwright (for Allure reports)
    │   ├─► allure-commandline (generate reports)
    │   └─► typescript (TypeScript compiler)
    │
    └─► scripts:
        ├─► npm test → npx playwright test
        ├─► npm run test:headed → npx playwright test --headed
        ├─► npm run test:debug → npx playwright test --debug
        ├─► npm run test:report → Generate & open Allure report
        └─► npm run ci:test → CI-optimized test execution


.vscode/mcp.json
    │
    ├─► Registers: playwright MCP server
    │   │
    │   └─► Command: npx @playwright/mcp@latest
    │       │
    │       ├─► Hooks into: playwright.config.ts
    │       ├─► Discovery: All tests in testDir
    │       ├─► Execution: Via @playwright/test
    │       └─► Reporting: Processes reporter output
    │
    └─► Makes available to: VS Code Copilot Chat
        └─► Enables commands: @playwright [action]


.vscode/settings.json
    │
    ├─► chat.tools.terminal.autoApprove
    │   └─► Whitelist: ["npx playwright"]
    │       (Auto-approves test execution commands)
    │
    └─► Enables: Seamless Copilot → Terminal integration


.env (optional)
    │
    ├─► Database URLs
    ├─► API endpoints
    ├─► Credentials (loaded at runtime)
    └─► Playwright settings (headless, workers)
        │
        └─► Loaded by: playwright.config.ts
            └─► Used by: test specs
```

---

## 5. MCP Request/Response Cycle

```
COPILOT CHAT WINDOW:
┌─────────────────────────────────────────────────────────────────┐
│ User types: "@playwright run -g TC11"                           │
│                                                                  │
│ Copilot parses: @playwright (tool) run -g TC11 (arguments)     │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
MCP STDIO STREAM:
┌─────────────────────────────────────────────────────────────────┐
│ REQUEST (JSON-RPC):                                              │
│ {                                                                │
│   "jsonrpc": "2.0",                                             │
│   "id": 1,                                                       │
│   "method": "tools/call",                                        │
│   "params": {                                                    │
│     "name": "run_tests",                                         │
│     "arguments": {                                               │
│       "pattern": "TC11",                                         │
│       "headless": true,                                          │
│       "reporter": ["html", "allure"]                            │
│     }                                                            │
│   }                                                              │
│ }                                                                │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
PLAYWRIGHT SERVER:
┌─────────────────────────────────────────────────────────────────┐
│ Process request:                                                 │
│ 1. Find test file matching pattern                               │
│ 2. Load playwright.config.ts                                     │
│ 3. Execute: npx playwright test -g TC11                         │
│ 4. Collect results from test-results/                           │
│ 5. Wait for completion                                          │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
MCP STDIO STREAM:
┌─────────────────────────────────────────────────────────────────┐
│ RESPONSE (JSON-RPC):                                             │
│ {                                                                │
│   "jsonrpc": "2.0",                                             │
│   "id": 1,                                                       │
│   "result": {                                                    │
│     "status": "PASSED",                                          │
│     "duration": "1.9m",                                          │
│     "testName": "TC11_Edit an ACT Payment with...",             │
│     "artifacts": {                                               │
│       "html": "file:///path/to/playwright-report/index.html",   │
│       "allure": "file:///path/to/allure-report/index.html",     │
│       "json": "file:///path/to/test-results/results.json"       │
│     },                                                           │
│     "summary": "All 5 phases passed (Create, Search, Edit, ...)"│
│   }                                                              │
│ }                                                                │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
COPILOT CHAT WINDOW:
┌─────────────────────────────────────────────────────────────────┐
│ Copilot displays:                                                │
│                                                                  │
│ ✓ Test PASSED (1.9 minutes)                                     │
│                                                                  │
│ **Summary:**                                                     │
│ - Phase 1: CREATE ✓                                             │
│ - Phase 2: SEARCH ✓                                             │
│ - Phase 3: EDIT ✓                                               │
│ - Phase 4: VALIDATE ✓                                           │
│ - Phase 5: DELETE ✓                                             │
│                                                                  │
│ **View Reports:**                                                │
│ - 📊 [Allure Report](allure-report/index.html)                 │
│ - 📄 [HTML Report](playwright-report/index.html)               │
│ - 📋 [JSON Results](test-results/results.json)                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Configuration Hierarchy

```
                   ┌─────────────────────┐
                   │  Environment (.env)  │
                   │  BASE_URL            │
                   │  TEST_USERNAME       │
                   │  HEADLESS=true       │
                   └──────────┬────────┘
                              │
                   ┌──────────▼──────────┐
                   │ playwright.config.ts │
                   │  • Browser type     │
                   │  • Viewport size    │
                   │  • Timeout values   │
                   │  • Reporters        │
                   │  • Screenshot modes │
                   └──────────┬──────────┘
                              │
                   ┌──────────▼──────────┐
                   │ package.json         │
                   │  • Dependencies      │
                   │  • Test scripts      │
                   │  • Project metadata  │
                   └──────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────────┐    ┌────────────┐      ┌──────────────┐
   │ .vscode/    │    │ test-data  │      │ Page Objects │
   │ mcp.json    │    │ .json      │      │ & Helpers    │
   │ settings.   │    │            │      │              │
   │ json        │    │ Test data  │      │ locators()   │
   │             │    │ fixtures   │      │ methods()    │
   └─────────────┘    └────────────┘      └──────────────┘
        │                    │                    │
        └────────────────────┼──────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │  Test Execution     │
                   │  (npx playwright    │
                   │   test)             │
                   └──────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌───────────┐      ┌──────────────┐     ┌──────────┐
   │ Screenshot │     │ Video        │     │ Traces   │
   │ (on-fail)  │     │ (on-fail)    │     │ & Logs   │
   └───────────┘      └──────────────┘     └──────────┘
        │                    │                    │
        └────────────────────┼──────────────────┘
                              │
                   ┌──────────▼──────────────┐
                   │ allure-results/         │
                   │ (Raw test data)         │
                   └──────────┬───────────┘
                              │
                   ┌──────────▼──────────────┐
                   │ Report Generation       │
                   │ (allure:generate)       │
                   └──────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌───────────┐      ┌──────────────┐     ┌──────────┐
   │ allure-   │     │  playwright- │     │ JSON     │
   │ report/   │     │  report/     │     │ Summary  │
   │ index.    │     │  index.html  │     │ (CI/CD)  │
   │ html      │     │              │     │          │
   └───────────┘      └──────────────┘     └──────────┘
        │                    │                    │
        └────────────────────┼──────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │ MCP Server Returns  │
                   │ Results to Copilot  │
                   └────────────────────┘
```

---

## 7. Key Directories & Their Roles

| Directory | Contents | Role |
|-----------|----------|------|
| `tests/e2e/` | Test spec files | Executable test code |
| `pages/` | Page Object classes | Reusable locators & methods |
| `fixtures/` | Test data & helpers | Shared utilities |
| `config/` | Configuration JSON | Test data, constants |
| `.vscode/` | VS Code settings | IDE & MCP config |
| `logs/` | Execution logs | Debugging & auditing |
| `allure-results/` | Raw test data | Report source data |
| `test-results/` | Artifacts (screenshots, videos) | Failure evidence |
| `allure-report/` | Generated HTML reports | Human-readable results |
| `playwright-report/` | Playwright HTML report | Interactive test viewer |

---

## 8. Quick Reference: Common MCP Commands in Copilot Chat

```
@playwright run TC11
→ Executes TC11 test, displays results in chat

@playwright run --headed
→ Runs tests with visible browser window

@playwright run tests/e2e
→ Runs all E2E tests

@playwright list tests
→ Shows all available test cases

@playwright get results
→ Displays last test run results

@playwright analyze failures
→ Analyzes failed tests and suggests fixes

@playwright generate test "create transfer"
→ AI generates new test based on description

@playwright coverage
→ Shows test coverage statistics
```

---

This diagram shows all the connections and flows in your MCP-enabled Playwright setup!
