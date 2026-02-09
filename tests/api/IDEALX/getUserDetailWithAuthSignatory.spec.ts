import { test, expect } from '../../lib/api/api.fixtures';
import { GetUsersReqEnvelope } from '../../lib/api/models';
import testData from '../../data/api/getUserDetailWithAuthSignatoryTestData.json';

test.describe('User API: getUserDetailWithAuthSignatory', () => {
  const {
    successPayload,
    failurePayload,
    validSessionId,
  } = (testData as any).GetUserDetailWithAuthSignatory;

  test('TC008: should return UX0000 and Successful', async ({ userApi }: any) => {
    const response = await userApi.getUserDetailWithAuthSignatory(
      successPayload as GetUsersReqEnvelope,
      validSessionId
    );

    const responseBody = await response.json();

    expect(responseBody.getUsersRes.returnCode).toBe('UX0000');
    expect(responseBody.getUsersRes.returnStatus).toBe('Successful');
  });

  test('TC009: should return UX9999 and Failed', async ({ userApi }: any) => {
    const response = await userApi.getUserDetailWithAuthSignatory(
      failurePayload as GetUsersReqEnvelope,
      validSessionId
    );

    const responseBody = await response.json();

    expect(responseBody.getUsersRes.returnCode).toBe('UX9999');
    expect(responseBody.getUsersRes.returnStatus).toBe('Failed');
  });
});