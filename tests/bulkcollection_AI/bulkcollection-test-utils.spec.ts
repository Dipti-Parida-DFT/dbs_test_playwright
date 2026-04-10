import { Page } from '@playwright/test';

/**
 * Test Data Constants
 */
export const TEST_DATA = {
  ORGANISATION_ID: 'SHKLT008',
  USER_ID: 'DBSAUTOHK002',
  PIN: '123',
  SECURITY_CODE: '123',
  ACCOUNT: 'NAME OF ACCT NO:7837003010',
  ACCOUNT_NUMBER: '783700301',
  CREDIT_TYPE: 'Consolidated Credit',
  PAYER_NAME: 'AutoTestBulkCollection',
  AMOUNT: '100.00',
  PARTICULARS: 'TEST COLLECT',
  TRANSACTION_CODE: '38 - Direct Debit(Consolidated posting)',
  LOGIN_URL: 'https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin',
  BULK_COLLECTION_URL: 'https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/idealx/#/bulk/bulk-collection/create',
};

/**
 * Test Utilities
 */
export class TestUtils {
  /**
   * Wait for element to be visible
   */
  static async waitForElement(page: Page, selector: string, timeout = 5000): Promise<void> {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for specific text to appear
   */
  static async waitForText(page: Page, text: string, timeout = 5000): Promise<void> {
    await page.getByText(text).waitFor({ state: 'visible', timeout });
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `screenshots/${name}-${timestamp}.png`;
    await page.screenshot({ path: fileName });
    return fileName;
  }

  /**
   * Get page title
   */
  static async getPageTitle(page: Page): Promise<string> {
    return await page.title();
  }

  /**
   * Check if element exists
   */
  static async elementExists(page: Page, selector: string): Promise<boolean> {
    const count = await page.locator(selector).count();
    return count > 0;
  }

  /**
   * Extract text from element
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    return await page.locator(selector).innerText();
  }

  /**
   * Fill form field
   */
  static async fillField(page: Page, selector: string, value: string): Promise<void> {
    await page.locator(selector).fill(value);
  }

  /**
   * Click element
   */
  static async clickElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).click();
  }

  /**
   * Check checkbox
   */
  static async checkCheckbox(page: Page, selector: string): Promise<void> {
    await page.locator(selector).check();
  }

  /**
   * Uncheck checkbox
   */
  static async uncheckCheckbox(page: Page, selector: string): Promise<void> {
    await page.locator(selector).uncheck();
  }

  /**
   * Select dropdown option
   */
  static async selectDropdownOption(page: Page, dropdownSelector: string, optionText: string): Promise<void> {
    await page.locator(dropdownSelector).click();
    await page.getByRole('option', { name: optionText }).click();
  }
}

/**
 * Custom Assertions
 */
export class CustomAssertions {
  /**
   * Verify reference number format
   */
  static verifyReferenceFormat(reference: string): boolean {
    return /^EBCOL\d+$/.test(reference);
  }

  /**
   * Verify amount format
   */
  static verifyAmountFormat(amount: string): boolean {
    return /^\d+\.\d{2}$/.test(amount);
  }

  /**
   * Verify transaction status
   */
  static verifyStatus(status: string): boolean {
    const validStatuses = ['Approved', 'Pending', 'Rejected', 'Submitted'];
    return validStatuses.includes(status);
  }

  /**
   * Verify account format
   */
  static verifyAccountFormat(account: string): boolean {
    return account.includes('NAME OF ACCT NO') && account.includes('(USD') || account.includes('(HKD');
  }
}
