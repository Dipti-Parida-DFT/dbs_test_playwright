import { test, expect } from '@playwright/test';
import { PayTransferPage } from '../../../pages/IDEALX/PayTransfer/PayTransferPage';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';

import { chromium, Browser, Page } from 'playwright';

let customBrowser: Browser;


test.describe('Telegraphic Transfer', () => {
    test.beforeAll(async () => {
        customBrowser = await chromium.launch({ headless: false });
    });

    test.afterAll(async () => {
        await customBrowser?.close(); // <-- closes when this suite is done
    });

    test('Pay Local / Overseas Payee navigation', async ({ page }) => {
        test.setTimeout(200_000);  // overrides for this test only
        const loginPage = new LoginPage(page);
        const payTransferPage = new PayTransferPage(page);

        await loginPage.goto();
        await loginPage.login('SG2BE11', 'SG2BE11S01', '1234');
        await payTransferPage.navigateToPayTransfer('123456');
        await payTransferPage.openPayLocalOverseas();
        await expect(payTransferPage.payLocalPageHeader).toBeVisible();

    });

});
