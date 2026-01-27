// tests/api/IDEALX/entitlementApi.spec.ts
import { test, expect } from '../../lib/api/api.fixtures';
import { GetEntitlementReqEnvelope } from '../../lib/api/models';
import testData from '../../data/api/3716Testdata.json';

test.describe('Entitlement API: getEntitlement', () => {
  const validPayload: GetEntitlementReqEnvelope = testData.GetEntitlement.getEntitlementValidPayload;
  const sessionId = testData.GetEntitlement.getEntitlementValidPayload.sessionId;

  test('should return 200 OK with a valid request', async ({ entitlementApi }) => {
    const response = await entitlementApi.getEntitlement(validPayload, sessionId);

    // Status checks
    expect(response.ok(), `Status: ${response.status()} ${response.statusText()}`).toBeTruthy();
    expect(response.status()).toBe(200);

    // Body checks
    const json = await response.json();
    expect(json).toBeTruthy();
    // Add more specific assertions once you know the response schema
  });

  test.skip('should handle invalid rqUID with error', async ({ entitlementApi }) => {
    const badPayload: GetEntitlementReqEnvelope = {
      getEntitlement: {
        ...validPayload.getEntitlement,
        rqUID: '', // invalid/missing
      },
    };

    const response = await entitlementApi.getEntitlement(badPayload, sessionId);

    // Expect an error response
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test.skip('should handle missing session ID', async ({ entitlementApi }) => {
    const response = await entitlementApi.getEntitlement(validPayload);

    // The API may reject or require authentication
    // Adjust assertions based on actual API behavior
    expect([200, 401, 403]).toContain(response.status());
  });
});
