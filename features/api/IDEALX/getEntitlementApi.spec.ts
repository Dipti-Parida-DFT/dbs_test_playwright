import { test, expect } from '../../lib/api/api.fixtures';
import { GetEntitlementReqEnvelope } from '../../lib/api/models';
import testData from '../../data/api/getEntitlementTestData.json';

test.describe('Entitlement API: getEntitlement', () => {
  const {
    validPayload,
    validChannelTypes,
    invalidChannelPayload,
    invalidQsPayload,
    validSessionId,
  } = testData.GetEntitlement;

  test('TC004: should return 200 and UX0000 for valid channelType LNOS', async ({ entitlementApi }: any) => {
    const response = await entitlementApi.getEntitlement(
      validPayload as GetEntitlementReqEnvelope,
      validSessionId
    );

    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json.getEntitlementRes.returnCode).toBe('UX0000');
    expect(json.getEntitlementRes.returnDesc).toBe('Successful');
  });

  test.describe('TC005: valid channelTypes return success', () => {
    for (const channelType of validChannelTypes) {
      test(`channelType = ${channelType}`, async ({ entitlementApi }: any) => {
        const payload: GetEntitlementReqEnvelope = {
          getEntitlement: {
            ...validPayload.getEntitlement,
            channelType,
          },
        };

        const response = await entitlementApi.getEntitlement(payload, validSessionId);

        expect(response.status()).toBe(200);

        const json = await response.json();
        expect(json.getEntitlementRes.returnCode).toBe('UX0000');
      });
    }
  });

  test('TC006: invalid channelType returns 500 error', async ({ entitlementApi }: any) => {
    const response = await entitlementApi.getEntitlement(
      invalidChannelPayload as GetEntitlementReqEnvelope,
      validSessionId
    );

    expect(response.status()).toBe(500);

    const bodyText = await response.text();
    expect(bodyText).toContain('MBG4099E : Invalid input data');
  });

  test('TC007: invalid qs returns UX7777', async ({ entitlementApi }: any) => {
    const response = await entitlementApi.getEntitlement(
      invalidQsPayload as GetEntitlementReqEnvelope,
      validSessionId
    );

    expect(response.status()).toBeLessThan(500);

    const json = await response.json();
    expect(json.getEntitlementRes.returnCode).toBe('UX7777');
    expect(json.getEntitlementRes.returnDesc).toBe('Successful');
  });
});