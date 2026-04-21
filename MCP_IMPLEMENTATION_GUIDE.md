# MCP (Model Context Protocol) Implementation Guide for Playwright

## Overview
MCP is a protocol that enables AI assistants (like GitHub Copilot) to interact with external tools and services. When implemented in Playwright, it provides:
- **Direct test execution** through AI chat
- **Intelligent test analysis** with browser context
- **Automated debugging** with real-time feedback
- **Code generation assistance** with project context awareness

---

## Complete Architecture & File Structure

```
project-root/
├── .vscode/
│   ├── mcp.json                    # MCP servers configuration
│   ├── settings.json               # VS Code editor settings
│   └── (optional) copilot-instructions.md  # AI behavior guidance
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies & scripts
├── tests/
│   ├── e2e/                       # End-to-end tests
│   │   └── IDEALX/PayTransfer/
│   │       └── *.spec.ts
│   └── api/                       # API tests
├── pages/                         # Page Object Models
├── fixtures/                      # Test data
├── config/                        # Configuration files
├── logs/                          # Test execution logs
├── allure-results/                # Test reports (raw)
├── allure-report/                 # Test reports (HTML)
├── playwright-report/             # Playwright HTML report
└── README.md
```

---

## 1. MCP Configuration File: `.vscode/mcp.json`

This file registers MCP servers that can be accessed by AI tools.

### Your Current Configuration:
```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}
```

### Complete Advanced Configuration:
```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "type": "stdio",
      "disabled": false,
      "alwaysAllow": ["run_tests", "list_tests", "generate_test"]
    },
    "browser-tools": {
      "command": "npx",
      "args": ["-y", "browser-tools-mcp"],
      "type": "stdio",
      "disabled": false
    },
    "typescript-tools": {
      "command": "npx",
      "args": ["-y", "typescript-mcp"],
      "type": "stdio",
      "disabled": false
    }
  }
}
```

### What Each Section Means:
| Key | Purpose |
|-----|---------|
| `servers` | Dictionary of available MCP servers |
| `playwright` | Server name (identifier) |
| `command` | Executable to run (npx) |
| `args` | Arguments passed to command |
| `type` | Communication type (`stdio` = standard input/output) |
| `disabled` | Enable/disable server |
| `alwaysAllow` | Capabilities that don't require approval |

---

## 2. VS Code Settings: `.vscode/settings.json`

Controls editor behavior, tool approval, and AI integration.

### Your Current Configuration:
```json
{
  "chat.tools.terminal.autoApprove": {
    "npx playwright": true
  }
}
```

### Complete Best-Practice Configuration:
```json
{
  "// ────── MCP & AI Tool Settings ──────": "AI Integration",
  
  "chat.tools.terminal.autoApprove": {
    "npx playwright": true,
    "npm run": true,
    "npm test": true,
    "node": true
  },
  
  "github.copilot.chat.autoApproveToolTerminalCommands": [
    "npx playwright test",
    "npm run test",
    "npm run test:headed",
    "npm run test:debug",
    "npm run test:report"
  ],
  
  "// ────── Playwright Settings ──────": "Test Framework",
  
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  
  "[json]": {
    "editor.jsonValidation": "enable"
  },
  
  "// ────── File Associations ──────": "File Handling",
  
  "files.exclude": {
    "**/node_modules": true,
    "**/.playwright": true,
    "**/test-results": true
  },
  
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/*.playwright": true
  },
  
  "// ────── Terminal Settings ──────": "Terminal",
  
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell",
      "args": ["-NoExit", "-Command", "cd $([System.IO.Path]::GetDirectoryName($profile))"]
    }
  }
}
```

---

## 3. Package.json: Dependencies & Scripts

### Your Current Configuration:
```json
{
  "name": "dbs-test-playwright-pom",
  "version": "1.0.0",
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "test:report": "npm run allure:generate && npm run allure:open",
    "extract:alltests": "node extract-alltests.js"
  },
  "devDependencies": {
    "@playwright/test": "^1.58.2",
    "@types/node": "^25.0.3",
    "allure-playwright": "^3.4.5",
    "allure-commandline": "^2.36.0"
  }
}
```

### Enhanced Configuration with MCP Tools:
```json
{
  "name": "dbs-test-playwright-pom",
  "version": "1.0.0",
  "description": "DBS Account Transfer Playwright E2E Test Suite with MCP Integration",
  
  "scripts": {
    "// ────── Core Test Commands ──────": "Basic test execution",
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    
    "// ────── Project-Specific Tests ──────": "Run specific project/suite",
    "test:e2e": "npx playwright test --project=e2e",
    "test:api": "npx playwright test --project=api",
    "test:act": "npx playwright test tests/e2e/IDEALX/PayTransfer/",
    "test:tc11": "npx playwright test -g 'TC11'",
    
    "// ────── Reporting Commands ──────": "Report generation",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "test:report": "npm run allure:generate && npm run allure:open",
    "report:html": "npx playwright show-report",
    
    "// ────── Utility Commands ──────": "Development utilities",
    "extract:alltests": "node extract-alltests.js",
    "test:parallel": "npx playwright test --workers=4",
    "test:serial": "npx playwright test --workers=1",
    
    "// ────── CI/CD Commands ──────": "Pipeline execution",
    "ci:test": "CI=true npx playwright test --workers=2 --reporter=json,html,allure-playwright",
    "ci:report": "npm run allure:generate"
  },
  
  "devDependencies": {
    "@playwright/test": "^1.58.2",
    "@playwright/mcp": "*",
    "@types/log4js": "^0.0.33",
    "@types/moment": "^2.11.29",
    "@types/node": "^25.0.3",
    "allure-commandline": "^2.36.0",
    "allure-playwright": "^3.4.5",
    "typescript": "^5.9.3"
  },
  
  "dependencies": {
    "log4js": "^6.9.1",
    "moment": "^2.30.1"
  }
}
```

**Key Additions Explained:**
- `@playwright/mcp`: Enables MCP integration
- Multiple test commands for different execution scenarios
- Grouped scripts with comment sections for clarity
- CI/CD scripts for pipeline execution

---

## 4. Playwright Configuration: `playwright.config.ts`

### Your Current Configuration:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 8_000_000,
  globalTimeout: 8_000_000,
  expect: { timeout: 10_000 },
  
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  
  reporter: [["html"], ["allure-playwright"]],
  
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 60_000,
    navigationTimeout: 120_000,
  },
  
  projects: [
    { name: 'e2e', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'] } },
    { name: 'api', testDir: './tests/api' }
  ]
});
```

### Enhanced Configuration with MCP Features:
```typescript
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from .env file
 * Create .env file with: BASE_URL, API_URL, TIMEOUT, etc.
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  /* ────── Test Execution Settings ────── */
  
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: '**/node_modules/**',
  
  timeout: 8_000_000,        // 133 minutes per test
  globalTimeout: 8_000_000,  // 133 minutes total
  
  /* ────── Parallelization ────── */
  
  fullyParallel: false,       // Tests in file run sequentially
  workers: process.env.CI ? 2 : 1,  // 2 workers in CI, 1 locally
  
  /* ────── Retry & Failure Handling ────── */
  
  forbidOnly: !!process.env.CI,  // Fail if test.only() left in code
  retries: process.env.CI ? 2 : 0,  // Retry failed tests in CI only
  
  /* ────── Reporter Configuration ────── */
  
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'on-failure' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright'],
    ['list'],  // Console output
  ],
  
  /* ────── Output Directories ────── */
  
  outputDir: 'test-results',
  
  /* ────── Global Settings ────── */
  
  use: {
    baseURL: process.env.BASE_URL || 'https://localhost:7443',
    
    /* ────── Browser Behavior ────── */
    headless: process.env.CI ? true : (process.env.HEADLESS !== 'false'),
    ignoreHTTPSErrors: true,  // Critical for self-signed certificates
    acceptDownloads: true,
    
    /* ────── Viewport & Device ────── */
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    
    /* ────── Timeouts (in milliseconds) ────── */
    navigationTimeout: 120_000,  // Page load
    actionTimeout: 60_000,       // Element interactions
    
    /* ────── Artifacts ────── */
    screenshot: 'only-on-failure',  // Capture failed screenshots
    video: 'retain-on-failure',     // Record video for failures
    trace: 'on-first-retry',        // Debug trace
    
    /* ────── Authentication & Cookies ────── */
    storageState: 'auth.json',  // Reuse login session
  },
  
  /* ────── Project Configuration ────── */
  
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
      timeout: 15 * 60 * 1000,  // 15 minutes for E2E
    },
    {
      name: 'api',
      testDir: './tests/api',
      timeout: 5 * 60 * 1000,   // 5 minutes for API
    },
    {
      name: 'mobile',
      testDir: './tests/e2e',
      use: { ...devices['Pixel 5'] },
    },
  ],
  
  /* ────── Web Server Configuration (optional) ────── */
  
  // Uncomment if you need to start a local server
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120_000,
  // },
  
  /* ────── Expect Configuration ────── */
  expect: {
    timeout: 10_000,  // Assertion timeout
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
});
```

**Key MCP-Relevant Additions:**
- Environment variables support for CI/CD
- Multiple reporters for different consumption methods
- Output directories properly configured
- Detailed timeout and artifact settings
- Project-specific configurations

---

## 5. Optional: Copilot Instructions File (`.vscode/copilot-instructions.md`)

This file guides AI behavior for your project:

```markdown
# Copilot Instructions for DBS Playwright Project

## Project Information
- **Name**: DBS Account Transfer Test Suite
- **Framework**: Playwright with TypeScript
- **Pattern**: Page Object Model (POM)
- **CI/CD**: GitHub Actions

## Code Generation Guidelines

### Page Object Models
Always generate page objects in `pages/` directory:
- One class per page/feature
- Methods for common actions
- Locators as class properties
- Use explicit waits, not hardcoded timeouts

### Test Specs
Test specs should be in `tests/e2e/` or `tests/api/`:
- Use `test.describe()` for test grouping
- Use `test()` or `test.only()` for individual tests
- Follow AAA pattern: Arrange, Act, Assert
- Include proper error handling

### Best Practices
1. **Locators**:
   - Prefer data attributes: `[data-testid="..."]`
   - Use role selectors: `getByRole('button', { name: '...' })`
   - Avoid nth-child selectors
   - Store in page object classes

2. **Waits**:
   - Use `.waitFor()` instead of `page.waitForTimeout()`
   - Use `.isVisible()` for visibility checks
   - Use `.isEnabled()` for enabled state checks

3. **Test Data**:
   - Store in `config/test-data.json`
   - Load via fixtures
   - Don't hardcode values in tests

4. **Assertions**:
   - Use `expect()` API consistently
   - Create custom matchers for domain logic
   - Verify both happy and sad paths

5. **Logging**:
   - Use structured logging (log4js)
   - Include test context in logs
   - Never commit console.log() statements

## Report Generation
- Always run: `npm run test:report` after test suite
- Use Allure for detailed analytics
- Archive reports in CI/CD

## MCP Integration
The project includes MCP Playwright server for AI integration:
- Run tests directly from chat
- Analyze test results
- Generate fixes for failures
- Validate test coverage

## Naming Conventions
- Files: `kebab-case` (my-test.spec.ts)
- Classes: `PascalCase` (AccountTransferPage)
- Methods: `camelCase` (selectCurrency())
- Constants: `UPPER_SNAKE_CASE` (DEFAULT_TIMEOUT)
- Tests: Descriptive with TC numbers (TC01_Create_Account_Transfer)
```

---

## 6. Environment Configuration: `.env` File

Create `.env` file for environment-specific settings:

```env
# ────── Application URLs ──────
BASE_URL=https://localhost:7443
API_URL=https://api.localhost:7443
LOGIN_URL=https://localhost:7443/login

# ────── Credentials (Use GitHub Secrets in CI/CD)
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=your_secure_password
TEST_ORG_ID=ORG123

# ────── Test Configuration ──────
TIMEOUT=900000
HEADLESS=true
DEBUG=false

# ────── Browser Settings ──────
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# ────── CI/CD ──────
CI=false
WORKERS=1
```

**.gitignore entries for .env:**
```
.env
.env.local
.env.*.local
```

---

## 7. Test Data Configuration

Create structured test data file: `config/test-data.json`

```json
{
  "users": {
    "admin": {
      "email": "admin@dbs.com",
      "password": "secure_password",
      "orgId": "ORG001"
    },
    "teller": {
      "email": "teller@dbs.com",
      "password": "secure_password",
      "orgId": "ORG001"
    }
  },
  "accountTransfer": {
    "amountA1": "100",
    "amountEditAmount": "200",
    "fromAccount": "1234567890",
    "toAccount": "9876543210",
    "currency": "SGD",
    "editCurrency": "USD"
  },
  "api": {
    "endpoints": {
      "login": "/api/auth/login",
      "transfer": "/api/transfers",
      "accounts": "/api/accounts"
    },
    "timeouts": {
      "short": 5000,
      "medium": 15000,
      "long": 60000
    }
  }
}
```

---

## 8. Report Generation & Analysis

### Allure Report Configuration

The `allure-results/` directory contains raw test data (JSON files).
The `allure-report/` is the generated HTML report.

**Key Report Files:**
```
allure-report/
├── index.html          # Main dashboard
├── app.js              # JavaScript engine
├── styles.css          # Styling
├── data/
│   ├── testcases.json  # Test case data
│   ├── groups.json     # Test groups
│   └── statistic.json  # Statistics
├── export/
│   └── influxDbData.txt # For integration
├── history/            # Historical data for trends
└── widgets/            # Dashboard widgets
```

**Generate Report:**
```bash
# Install Allure CLI
npm install allure-commandline --save-dev

# Generate report from results
npm run allure:generate

# Open in browser
npm run allure:open
```

### Report Artifacts Captured:
- ✅ Screenshots (on-failure)
- ✅ Video recordings (on-failure)
- ✅ Trace files (for debugging)
- ✅ Test logs
- ✅ Error stack traces
- ✅ Execution duration
- ✅ Pass/fail status

---

## 9. MCP Server Integration Steps

### Step 1: Install @playwright/mcp
```bash
npm install --save-dev @playwright/mcp
```

### Step 2: Create .vscode/mcp.json
```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}
```

### Step 3: Configure .vscode/settings.json
```json
{
  "chat.tools.terminal.autoApprove": {
    "npx playwright": true
  }
}
```

### Step 4: Restart VS Code
**Command**: `Developer: Reload Window`

### Step 5: Test MCP is Active
- Open GitHub Copilot Chat
- Type: `@playwright what tests are available?`
- Should return list of test files

### Step 6: Use MCP in Chat
**Examples:**
```
@playwright run the TC11 test
@playwright analyze the test failures
@playwright generate a new test for the login flow
@playwright show me the test coverage
```

---

## 10. Complete File Checklist

| File | Purpose | Location | Status |
|------|---------|----------|--------|
| `mcp.json` | MCP server config | `.vscode/mcp.json` | ✅ Configured |
| `settings.json` | VS Code settings | `.vscode/settings.json` | ✅ Configured |
| `playwright.config.ts` | Test config | Root | ✅ Configured |
| `package.json` | Dependencies | Root | ✅ Configured |
| `.env` | Environment vars | Root | ⚠️ Optional |
| `copilot-instructions.md` | AI guidance | `.vscode/copilot-instructions.md` | ⚠️ Optional |
| `test-data.json` | Test data | `config/test-data.json` | ⚠️ Optional |
| `.gitignore` | Git exclusions | Root | ✅ Should exist |

---

## 11. MCP Server Capabilities

Once MCP is properly configured, you get these capabilities in Copilot Chat:

### Test Execution
```
@playwright run tests/e2e/IDEALX/PayTransfer/TC11.spec.ts
```

### Test Analysis
```
@playwright analyze the failures from the last test run
```

### Test Generation
```
@playwright generate a test for creating an account transfer
```

### Coverage Analysis
```
@playwright show test coverage for the AccountTransfer feature
```

### Debug Assistance
```
@playwright help me debug why the currency selector is timing out
```

---

## 12. CI/CD Integration

### GitHub Actions Workflow Example

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npm run ci:test
        env:
          CI: true
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
      
      - name: Generate Allure Report
        if: always()
        run: npm run allure:generate
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            test-results/
            allure-report/
```

---

## 13. Quick Setup Checklist

- [ ] Install Playwright: `npm install @playwright/test`
- [ ] Install MCP: `npm install @playwright/mcp`
- [ ] Create `.vscode/mcp.json`
- [ ] Configure `.vscode/settings.json`
- [ ] Update `playwright.config.ts`
- [ ] Add test scripts to `package.json`
- [ ] Create `.env` file (with .env.* in .gitignore)
- [ ] Create `config/test-data.json`
- [ ] Create `.vscode/copilot-instructions.md`
- [ ] Restart VS Code
- [ ] Test with `npx playwright test`
- [ ] Test MCP with Copilot Chat: `@playwright what tests exist?`

---

## 14. Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP not showing in chat | Restart VS Code; check mcp.json syntax |
| Tests timeout in headless | Increase timeout in playwright.config.ts |
| Reports not generated | Run `npm run allure:generate` explicitly |
| Elements not found | Add explicit waits; check selectors in Inspector |
| Authentication fails | Verify credentials; check storageState setup |
| CI/CD failures | Check environment secrets; verify BASE_URL |

---

## References

- **Playwright Docs**: https://playwright.dev
- **MCP Protocol**: https://modelcontextprotocol.io
- **Allure Reports**: https://docs.qameta.io/allure
- **GitHub Copilot**: https://github.com/features/copilot
