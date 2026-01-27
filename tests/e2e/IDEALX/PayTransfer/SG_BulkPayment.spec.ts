import { test, expect } from '@playwright/test';
import { PayTransferPage } from '../../../pages/IDEALX/PayTransfer/PayTransferPage';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';

import { chromium, Browser } from 'playwright';

let customBrowser: Browser;


test.describe('Bulk Payment', () => {
    test.beforeAll(async () => {
        customBrowser = await chromium.launch({ headless: false });
    });

    test.afterAll(async () => {
        await customBrowser?.close(); // <-- closes when this suite is done
    });

    test('Bulk Payment', async ({ page }) => {
        test.setTimeout(200_000);  // overrides for this test only
        const loginPage = new LoginPage(page);
        const payTransferPage = new PayTransferPage(page);

        await loginPage.goto();
        await loginPage.login('SG2BE11', 'SG2BE11S01', '1234');
        await payTransferPage.navigateToPayTransfer('123456');
        await payTransferPage.openBulkPayment();
        await expect(payTransferPage.bulkTransferPageHeader).toBeVisible();

    });

});
