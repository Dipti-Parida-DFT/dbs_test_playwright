// import { test, expect } from '@playwright/test';
// import * as path from 'path';
// import * as fs from 'fs'; 
// import { PayrollPage } from '../../../pages/IDEALX/PayTransfer/PayrollPage';
// import { PayTransferPage } from '../../../pages/IDEALX/PayTransfer/PayTransferPage';
// import { LoginPage } from '../../../pages/IDEALX/LoginPage';

// import { chromium, Browser } from 'playwright';

// let customBrowser: Browser;
// const testDataPath = path.resolve(__dirname, '../data/VN_testData.json');
// const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// //Env flags
// const SIT = (process.env.ENV?.toUpperCase() === 'SIT');
// //const SIT = 'SIT';

// const loginCompanyId = SIT ? testData.Payroll.SIT.loginCompanyId : testData.Payroll.UAT.loginCompanyId;
// const loginUserId    = SIT ? testData.Payroll.SIT.loginUserId    : testData.Payroll.UAT.loginUserId;
// const fromAccount    = SIT ? testData.Payroll.SIT.fromAccount    : testData.Payroll.UAT.fromAccount;
// const payeeBankID    = SIT ? testData.Payroll.SIT.payeeBankID    : testData.Payroll.UAT.payeeBankID;

// // Configure suite retries similar to `this.retries(browser.params.caseRetryTimes)`
// test.describe.configure({
//     retries: Number(process.env.CASE_RETRY_TIMES ?? 0)
//   });
  
// test.describe('VN_Payroll', () => {
//     test.beforeAll(async () => {
//         customBrowser = await chromium.launch({ headless: true });
//     });

//     test.afterAll(async () => {
//         await customBrowser?.close(); // <-- closes when this suite is done
//     });

//   let payrollPage: PayrollPage;

//   test.beforeEach(async ({ page }) => {
//     test.setTimeout(200_000);  // overrides for this test only
//     const loginPage = new LoginPage(page);
//     const payTransferPage = new PayTransferPage(page);

//     // Initialize the PayrollPage object
//     payrollPage = new PayrollPage(page);

//     // Login to the application
//     const loginCompanyId = process.env.SIT ? 'SIT_CompanyId' : 'UAT_CompanyId';
//     const loginUserId = process.env.SIT ? 'SIT_UserId' : 'UAT_UserId';
//     const password = '123123';


//     await loginPage.goto();
//     await loginPage.login(loginCompanyId, loginUserId, password);
//     await payTransferPage.navigateToPayTransfer('123456');
  
//   });

//   test('Cannot create Payroll with item amount greater than 500000000 VND', async ({ page }) => {
//     // Navigate to Payroll Page
//     await payrollPage.payroll.click();

//     // Select From Account
//     const fromAccount = process.env.SIT ? 'SIT_FromAccount' : 'UAT_FromAccount';
//     await payrollPage.fromAccount.selectOption(fromAccount);

//     // Enter Payroll Amount
//     await payrollPage.amount.fill('600000000'); // Replace with the actual selector for the payroll amount input

//     // Enter Payment Details
//     await payrollPage.payeeParticulars.fill('Test Payment Details');
//     await payrollPage.payeeRef.fill('Test Reference');

//     // Submit Payroll
//     await payrollPage.showOptionalDetails.click(); // Example of interacting with another element
//     await page.click('#submitPayroll'); // Replace with the actual selector for the submit payroll button

//     // Assert that the error message is displayed
//     const errorMessage = await page.locator('#errorMessage').textContent(); // Replace with the actual selector for the error message
//     expect(errorMessage).toContain('Amount exceeds the limit of 500000000 VND');
//   });

//   test('Create Payroll with item amount equal to 500000000 VND', async ({ page }) => {
//     // Navigate to Payroll Page
//     await payrollPage.payroll.click();

//     // Select From Account
//     const fromAccount = process.env.SIT ? 'SIT_FromAccount' : 'UAT_FromAccount';
//     await payrollPage.fromAccount.selectOption(fromAccount);

//     // Enter Payroll Amount
//     await payrollPage.amount.fill('500000000');

//     // Enter Payment Details
//     await payrollPage.payeeParticulars.fill('Test Payment Details');
//     await payrollPage.payeeRef.fill('Test Reference');

//     // Submit Payroll
//     await payrollPage.showOptionalDetails.click();
//     await page.click('#submitPayroll');

//     // Assert that the payroll is successfully created
//     const successMessage = await page.locator('#successMessage').textContent(); // Replace with the actual selector for the success message
//     expect(successMessage).toContain('Payroll created successfully');
//   });

//   test('Create payroll with Total amount greater than 500000000 IDR', async ({ page }) => {
//     // Navigate to Payroll Page
//     await payrollPage.payroll.click();

//     // Select From Account
//     const fromAccount = process.env.SIT ? 'SIT_FromAccount' : 'UAT_FromAccount';
//     await payrollPage.fromAccount.selectOption(fromAccount);

//     // Add Multiple Payees
//     await payrollPage.payeeParticulars.fill('Payee 1');
//     await payrollPage.amount.fill('300000000');
//     await page.click('#addPayee'); // Add the first payee

//     await payrollPage.payeeParticulars.fill('Payee 2');
//     await payrollPage.amount.fill('300000000');
//     await page.click('#addPayee'); // Add the second payee

//     // Submit Payroll
//     await payrollPage.showOptionalDetails.click();
//     await page.click('#submitPayroll');

//     // Assert that the error message is displayed
//     const errorMessage = await page.locator('#errorMessage').textContent();
//     expect(errorMessage).toContain('Total amount exceeds the limit of 500000000 IDR');
//   });
// });