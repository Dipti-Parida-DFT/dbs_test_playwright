import { Page, Locator } from '@playwright/test';

export class AuthenticationDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly securityAccessCode: Locator;
  readonly authenticateButton: Locator;
  readonly authenticate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('dbs-mars-auth-dialog');
    this.securityAccessCode = page.locator(
      'input[placeholder="Enter security access code"]'
    );
    this.authenticateButton = page.locator(
      'button:has-text("Authenticate")'
    );
    this.authenticate = page.locator("button[class*='btn__primary']");
  }

  async handleIfPresent(code = '1111') {
    const appears = await this.dialog
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => true)
      .catch(() => false);

    if (!appears) return;

    await this.securityAccessCode.fill(code);
    await this.authenticateButton.click();

    await this.dialog.waitFor({ state: 'hidden', timeout: 10_000 });
  }
}