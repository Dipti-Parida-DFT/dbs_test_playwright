import { expect, test } from '@playwright/test';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';
import loginCredentials from '../../../data/loginCredentials.json';
import fs from 'node:fs';
import path from 'node:path';

// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/IN_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

test.describe('Announcement Banner', () => {

  test('TC001: IN affiliate cannot view the Do Not Show Again checkbox', async ({ page }) => {
    test.setTimeout(180000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.Announcement.IN.orgId,
      testData.Announcement.IN.userId,
      testData.Announcement.IN.pin
    );
    //assert Do Not Show Again checkbox is not displayed for IN affiliate
    await expect(page.getByRole('checkbox', { name: 'Do Not Show Again' })).not.toBeVisible();
    //assert the banner content is displayed for IN affiliate
    await expect(page.getByText(testData.Announcement.IN.bannerContent)).toBeVisible();
    //assert the links on banner content open in a new browser tab

        //const [newPage] = await Promise.all([   ])
    await page.getByRole('button', { name: 'I acknowledge' }).click();
    //assert dashboard page is displayed after clicking I acknowledge button
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('TC002: Non-IN affiliate can view the Do Not Show Again checkbox', async ({ page }) => {
    test.setTimeout(180000); 
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.Announcement.HK.orgId,
      testData.Announcement.HK.userId,
      testData.Announcement.HK.pin
    );
    //assert Do Not Show Again checkbox is not displayed for IN affiliate
    await expect(page.getByRole('checkbox', { name: 'Do Not Show Again' })).not.toBeVisible();
    await page.getByRole('button', { name: 'I acknowledge' }).click();
    //assert dashboard page is displayed after clicking I acknowledge button
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('TC003: IN affiliate (earlier checked Do Not Show Again checbox) can view I acknowledge button ', async ({ page }) => {
    test.setTimeout(180000); 
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.Announcement["IN-2"].orgId,
      testData.Announcement["IN-2"].userId,
      testData.Announcement["IN-2"].pin
    );
    //assert Do Not Show Again checkbox is not displayed for IN affiliate
    await expect(page.getByRole('checkbox', { name: 'Do Not Show Again' })).not.toBeVisible();
    await page.getByRole('button', { name: 'I acknowledge' }).click();
    //assert dashboard page is displayed after clicking I acknowledge button
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('TC004: Non-IN affiliate (earlier checked Do Not Show Again checbox) can view I acknowledge button ', async ({ page }) => {
    test.setTimeout(180000); 
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.Announcement["HK-2"].orgId,
      testData.Announcement["HK-2"].userId,
      testData.Announcement["HK-2"].pin
    );
    //assert Do Not Show Again checkbox is not displayed for IN affiliate
    await expect(page.getByRole('checkbox', { name: 'Do Not Show Again' })).not.toBeVisible();
    await page.getByRole('button', { name: 'I acknowledge' }).click();
    //assert dashboard page is displayed after clicking I acknowledge button
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    
  });

});
