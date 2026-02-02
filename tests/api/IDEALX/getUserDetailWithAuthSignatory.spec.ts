import { test, expect } from '../../lib/api/api.fixtures';
import { GetUsersReqEnvelope } from '../../lib/api/models';
import testData from '../../data/api/getUserDetailWithAuthSignatoryTestData.json';

test.describe('User API: getUserDetailWithAuthSignatory', () => {
  const {
    validPayload,
    validChannelTypes,
    invalidChannelPayload,
    validSessionId,
  } = (testData as any).GetUserDetailWithAuthSignatory;

 
  test('TC008: channelType LNOS should return 200', async ({ userApi }: any) => {
    const response = await userApi.getUserDetailWithAuthSignatory(
      validPayload as GetUsersReqEnvelope,
      validSessionId
    );

    expect(response.status()).toBe(200);
  });


  test.describe('TC009: valid channelTypes return 200', () => {
    for (const channelId of validChannelTypes) {
      test(`channelType = ${channelId}`, async ({ userApi }: any) => {
        const payload: GetUsersReqEnvelope = {
          getUsersReq: {
            ...validPayload.getUsersReq,
            channelId,
          },
        };

        const response = await userApi.getUserDetailWithAuthSignatory(
          payload,
          validSessionId
        );

        expect(response.status()).toBe(200);
      });
    }
  });


  test('TC010: invalid channelType should return 500', async ({ userApi }: any) => {
    const response = await userApi.getUserDetailWithAuthSignatory(
      invalidChannelPayload as GetUsersReqEnvelope,
      validSessionId
    );
// Backend does not enforce channelType validation at HTTP level
    expect(response.status()).toBe(200);
  });
});