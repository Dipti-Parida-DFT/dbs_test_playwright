import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';

// Increase Cucumber step/scenario default timeout
setDefaultTimeout(600000);

// Launch a new browser/page for each scenario and attach to the World (this)
Before(async function () {
  this.browser = await chromium.launch({ headless: true });
  // Ignore invalid/self-signed TLS certificates when creating the context
  this.context = await this.browser.newContext({ ignoreHTTPSErrors: true });
  this.page = await this.context.newPage();
  // Increase default timeout for slow operations
  this.page.setDefaultTimeout(120000);
});

After(async function (scenario) {
  // On failure, capture screenshot and page source and attach them to the Cucumber report (Allure adapter will pick these up)
  try {
    if (scenario.result && scenario.result.status === Status.FAILED) {
      if (this.page) {
        try {
          const screenshot = await this.page.screenshot({ type: 'png' });
          // attach screenshot (buffer) with mime type
          await this.attach(screenshot, 'image/png');
        } catch (err) {
          // ignore screenshot errors
        }
        try {
          const html = await this.page.content();
          await this.attach(html, 'text/html');
        } catch (err) {
          // ignore
        }
      }
    }
  } catch (err) {
    // ignore
  }

  try { if (this.page) await this.page.close(); } catch (e) { /* ignore */ }
  try { if (this.context) await this.context.close(); } catch (e) { /* ignore */ }
  try { if (this.browser) await this.browser.close(); } catch (e) { /* ignore */ }
});
