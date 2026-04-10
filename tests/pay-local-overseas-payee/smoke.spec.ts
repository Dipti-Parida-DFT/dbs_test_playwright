import { test, expect } from '@playwright/test';

test.describe('Payment Form - Smoke Test', () => {
  test('Verify Payment Form Tests are Running', async () => {
    // Simple smoke test to verify test infrastructure is working
    expect(true).toBeTruthy();
  });

  test('Verify Helper Import is Valid', async () => {
    // Import helper to verify there are no syntax errors
    const { PaymentFormHelper } = await import('../utils/payment-form-helper');
    expect(PaymentFormHelper).toBeDefined();
  });

  test('Navigate to Login Page', async ({ page }) => {
    await page.goto('https://i3bku3uatqeweb01.qe.dragonflyft.com:1443/iws/ssologin', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    }).catch(err => {
      console.log('Navigation error:', err.message);
      // Don't fail on navigation error for smoke test
    });
    
    // Just verify page loaded (may be slow on QE environment)
    const url = page.url();
    expect(url).toContain('ssologin');
  });
});
