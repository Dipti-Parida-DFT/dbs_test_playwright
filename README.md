# DBS Test Automation Framework

A comprehensive test automation framework built with **Playwright** for testing DBS banking applications. This framework supports both **API testing** and **End-to-End (E2E) UI testing** with a clean Page Object Model (POM) architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Testing](#api-testing)
- [UI Testing](#ui-testing)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [Configuration](#configuration)

## 🎯 Overview

This framework provides:
- **API Test Automation**: Direct API endpoint testing with custom request/response handling
- **UI Test Automation**: End-to-end browser automation using the Page Object Model pattern
- **Custom Fixtures**: Reusable API client fixtures for streamlined test setup
- **Allure Reporting**: Detailed test reports with Allure integration
- **Screenshot & Video Capture**: Automatic capture on test failures
- **Trace Recording**: Debugging support with Playwright trace viewer

## 📁 Project Structure

```
dbs-test-playwright/
├── tests/
│   ├── api/                          # API test files
│   │   ├── entitlementApi.ts         # Entitlement API client
│   │   ├── userApi.ts                # User API client
│   │   └── IDEALX/                   # API tests for IDEALX module
│   │
│   ├── e2e/                          # End-to-end UI test files
│   │   └── IDEALX/
│   │       ├── PayTransfer/          # Payment & Transfer test scenarios
│   │       │   ├── SG_AccountTransfer.spec.ts
│   │       │   ├── SG_BulkPayment.spec.ts
│   │       │   └── SG_TelegraphicTransfer.spec.ts
│   │       └── Approvals/            # Approval workflow tests
│   │
│   ├── lib/
│   │   ├── api/                      # API utilities and models
│   │   │   ├── api.fixtures.ts       # Custom test fixtures for API
│   │   │   ├── entitlementApi.ts     # API client class
│   │   │   ├── userApi.ts            # API client class
│   │   │   └── models.ts             # TypeScript models/interfaces
│   │   ├── components.ts             # Reusable UI components
│   │   ├── testUtils.ts              # Test utilities and helpers
│   │   └── web-components1.ts        # Web component utilities
│   │
│   ├── pages/                        # Page Object Models
│   │   └── IDEALX/
│   │       ├── LoginPage.ts          # Login page object
│   │       └── PayTransfer/          # Payment feature page objects
│   │
│   └── data/                         # Test data files
│       └── loginCredentials.json     # Login credentials
│
├── playwright.config.ts              # Playwright configuration
├── package.json                      # Dependencies and scripts
├── allure-results/                   # Test results (generated)
├── allure-report/                    # Allure HTML reports (generated)
└── test-results/                     # Playwright test results (generated)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)

### Installation

1. Navigate to the project directory:
   ```bash
   cd dbs-test-playwright
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🔌 API Testing

### Architecture

API tests use Playwright's built-in `APIRequestContext` to make HTTP requests. Custom API client classes encapsulate endpoint-specific logic.

### API Client Classes

#### UserApi
Located in `tests/lib/api/userApi.ts`

```typescript
export class UserApi {
  async getUserDetailWithAuthSignatory(
    payload: GetUsersReqEnvelope
  ): Promise<APIResponse>
}
```

**Endpoint**: `POST /idealsso-banking/user/getUserDetailWithAuthSignatory`

#### EntitlementApi
Located in `tests/lib/api/entitlementApi.ts`

```typescript
export class EntitlementApi {
  async getEntitlement(
    payload: GetEntitlementReqEnvelope,
    sessionId?: string
  ): Promise<APIResponse>
}
```

**Endpoint**: `POST /mbg-banking/customer/getEntitlement?format=json`

### Custom API Fixtures

API tests use custom Playwright fixtures defined in `tests/lib/api/api.fixtures.ts`:

```typescript
type ApiFixtures = {
  userApi: UserApi;
  entitlementApi: EntitlementApi;
};
```

### API Test Example

```typescript
import { test } from '../../lib/api/api.fixtures';

test('Get User Details', async ({ userApi }) => {
  const payload = { /* request payload */ };
  const response = await userApi.getUserDetailWithAuthSignatory(payload);
  
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toBeDefined();
});
```

## 🖥️ UI Testing

### Page Object Model (POM)

All UI tests follow the Page Object Model pattern for maintainability and reusability. Page objects encapsulate element locators and actions.

### Page Objects

#### LoginPage
Located in `tests/pages/IDEALX/LoginPage.ts`

Handles user authentication with methods:
- `goto()` - Navigate to login page
- `login(orgId, userId, pin)` - Perform login with credentials

```typescript
export class LoginPage {
  async goto() {
    await this.page.goto('https://10.8.58.138:8443/iws/ssologin');
  }

  async login(orgId?: string, userId?: string, pin?: string) {
    // Login implementation
  }
}
```

#### Feature-Specific Page Objects
Located in `tests/pages/IDEALX/PayTransfer/`

- `SG_AccountTransferPage` - Account transfer operations
- `SG_BulkPaymentPage` - Bulk payment processing
- `SG_TelegraphicTransferPage` - Telegraphic transfer flows

### UI Test Example

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import { SG_AccountTransferPage } from '../../../pages/IDEALX/PayTransfer/SG_AccountTransferPage';

test('SG Account Transfer - Complete Payment Flow', async ({ page }) => {
  test.setTimeout(200_000);
  
  const loginPage = new LoginPage(page);
  const transferPage = new SG_AccountTransferPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login();

  // Perform transfer
  await transferPage.completeSGAccountTransfer();
});
```

### Test Data

Login credentials are stored in `tests/data/loginCredentials.json`:

```json
{
  "orgId": "YOUR_ORG_ID",
  "userId": "YOUR_USER_ID",
  "pin": "YOUR_PIN"
}
```

## ▶️ Running Tests

### Run All Tests
```bash
npm test
```

### Run API Tests Only
```bash
npx playwright test tests/api
```

### Run E2E Tests Only
```bash
npx playwright test tests/e2e
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/IDEALX/PayTransfer/SG_AccountTransfer.spec.ts
```

### Run Tests in Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Run Tests in Debug Mode (with Inspector)
```bash
npm run test:debug
```

### Run Tests with Specific Tags
```bash
npx playwright test --grep @smoke
```

## 📊 Test Reports

### Allure Reports

Generate and view comprehensive Allure reports:

```bash
npm run test:report
```

This command:
1. Generates Allure reports from test results
2. Opens the Allure report in your default browser

#### Manual Report Generation
```bash
# Generate report
npm run allure:generate

# Open existing report
npm run allure:open
```

### HTML Reports

Playwright HTML reports are generated automatically in the `playwright-report/` directory after each test run.

View the HTML report:
```bash
npx playwright show-report
```

## ⚙️ Configuration

### Playwright Configuration
File: `playwright.config.ts`

Key settings:

| Setting | Value | Description |
|---------|-------|-------------|
| `testDir` | `./tests/api` | Directory containing test files |
| `timeout` | `60000ms` | Individual test timeout |
| `expect.timeout` | `10000ms` | Assertion timeout |
| `fullyParallel` | `true` | Run tests in parallel |
| `retries` | `2` (CI only) | Number of retry attempts on CI |
| `workers` | `undefined` | Number of parallel workers (auto on local, 1 on CI) |
| `viewport` | `1920x1080` | Browser viewport size |
| `ignoreHTTPSErrors` | `true` | Allow self-signed certificates |

### Reporters

- **HTML Reporter**: Standard Playwright HTML report
- **Allure Reporter**: Detailed test results with history tracking

### Artifacts Captured on Failure

- Screenshots (on-failure)
- Videos (retain-on-failure)
- Traces (on-first-retry) - View with: `npx playwright show-trace <trace-file>`

## 📝 Best Practices

### API Testing
1. ✅ Use custom API client classes for endpoint encapsulation
2. ✅ Leverage fixtures for API client instantiation
3. ✅ Define TypeScript models/interfaces for request/response payloads
4. ✅ Handle authentication tokens and session cookies properly

### UI Testing
1. ✅ Follow Page Object Model pattern strictly
2. ✅ Keep page objects focused on single page/feature
3. ✅ Use data-driven testing with test data files
4. ✅ Implement explicit waits for dynamic content
5. ✅ Use meaningful test names and descriptions

### General
1. ✅ Organize tests by feature/module (IDEALX, etc.)
2. ✅ Use TypeScript for type safety
3. ✅ Keep tests independent and idempotent
4. ✅ Tag tests for easy filtering (@smoke, @regression, etc.)
5. ✅ Document complex test scenarios with comments

## 🔗 Useful Resources

- [Playwright Documentation](https://playwright.dev/)
- [Allure Reporting](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [API Testing Guide](https://playwright.dev/docs/test-api-testing)

## 📝 Notes

- Ensure test data credentials are properly configured before running tests
- HTTPS errors are ignored in configuration (self-signed certificates allowed)
- Tests use a base URL of `https://10.8.59.68:7443` for API requests
- UI tests target `https://10.8.58.138:8443/iws/ssologin`
- Adjust timeout values in `playwright.config.ts` based on your environment needs

## 📧 Support

For questions or issues, please refer to the project documentation or contact the QA team.

---

**Framework Version**: 1.0.0  
**Last Updated**: January 2026
