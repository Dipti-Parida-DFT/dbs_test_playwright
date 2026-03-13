
// import { test, expect } from '@playwright/test';
// import { PayTransferPage } from '../src/pages/PayTransferPage';

// test.describe('Pay & Transfer flows', () => {
//   test('Pay Local / Overseas Payee', async ({ page, baseURL }) => {
//     await page.goto(new URL('/iws/ssologin', baseURL!).toString(), { waitUntil: 'load' });

//     const pay = new PayTransferPage(page);
//     await pay.navigateToPayTransfer('123456');
//     await pay.openPayLocalOverseas();

//     await expect(pay.payLocalPageHeader).toBeVisible();
//   });

//   test('Bulk Payment', async ({ page, baseURL }) => {
//     await page.goto(new URL('/iws/ssologin', baseURL!).toString(), { waitUntil: 'load' });

//     const pay = new PayTransferPage(page);
//     await pay.navigateToPayTransfer('123456');
//     await pay.openBulkPayment();

//     await expect(pay.bulkTransferPageHeader).toBeVisible();
//   });
// });
