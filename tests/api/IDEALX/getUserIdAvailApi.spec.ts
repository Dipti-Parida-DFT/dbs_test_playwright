import { test, expect } from '../../lib/api/api.fixtures';
import { GetUserIDAvailReqEnvelope } from '../../lib/api/models';
import testData from '../../data/api/getUserIdAvailTestData.json';

test.describe('User API → getUserIDAvail', () => {

  const {
    validSessionId,
    validUser,
    invalidUser,
    duplicateUser
  } = testData.GetUserIDAvail;

  test('TC001: User ID available (valid SG user)', async ({ userIdAvailApi }: { userIdAvailApi: any }) => {

    const response = await userIdAvailApi.getUserIdAvail(
      validUser.payload as GetUserIDAvailReqEnvelope,
      validSessionId
    );

    expect(response.status()).toBe(200);

    const res = await response.json();;
    expect(res).not.toBeNull();
    expect(res.isAvailable).toBe(true);
    expect(res.message).toBe(validUser.expected.message);
    expect(res.returnCode).toBe('UX0000');
    expect(res.errorCode).toBeNull();;
  });

  test('TC002: User ID invalid format', async ({ userIdAvailApi }: { userIdAvailApi: any }) => {

    const response = await userIdAvailApi.getUserIdAvail(
      invalidUser.payload as GetUserIDAvailReqEnvelope,
      validSessionId
    );

    expect(response.status()).toBe(200);

    const res = await response.json();;

    expect(res.isAvailable).toBe(false);
    expect(res.message).toBe(invalidUser.expected.message);
    expect(res.errorCode).toBe(invalidUser.expected.errorCode);
  });

  test('TC003: User ID duplicate', async ({ userIdAvailApi }: { userIdAvailApi: any }) => {

    const response = await userIdAvailApi.getUserIdAvail(
      duplicateUser.payload as GetUserIDAvailReqEnvelope,
      validSessionId
    );

    expect(response.status()).toBe(200);

    const json = await response.json();
    const res = json;

    expect(res.isAvailable).toBe(false);
    expect(res.message).toBe(duplicateUser.expected.message);
    expect(res.errorCode).toBe(duplicateUser.expected.errorCode);
  });
});