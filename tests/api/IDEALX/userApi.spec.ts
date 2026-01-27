
// tests/api/userApi.spec.ts
import { test, expect } from '../../lib/api/api.fixtures';
import { GetUsersReqEnvelope } from '../../lib/api/models';
import testData from '../../data/api/3716Testdata.json';

test.describe('User API: getUserDetailWithAuthSignatory', () => {
    const validPayload: GetUsersReqEnvelope = testData.GetUserDetailWithAuthSignatory;

  test('should return 200 OK with a valid response body', async ({ userApi }) => {
    const response = await userApi.getUserDetailWithAuthSignatory(validPayload);

    // Status checks
    expect(response.ok(), `Status: ${response.status()} ${response.statusText()}`).toBeTruthy();
    expect(response.status()).toBe(200);

    // Body checks (update when you know the exact schema)
    const json = await response.json();
    expect(json).toBeTruthy();
    // Example patterns — adjust to your schema:
    // expect(json).toHaveProperty('getUsersRes');
    // expect(json.getUsersRes).toHaveProperty('users');
  });

  test.skip('should handle invalid input (e.g., empty rqUID) with 4xx', async ({ userApi }) => {
    const badPayload: GetUsersReqEnvelope = {
      getUsersReq: {
        ...validPayload.getUsersReq,
        rqUID: '', // invalid/missing
      },
    };

    const response = await userApi.getUserDetailWithAuthSignatory(badPayload);

    // Expect a client/server error; adjust to your API's behavior (400/422/etc.)
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const json = await response.json().catch(() => ({}));
    // Optionally assert error structure if your API returns one
    // expect(json).toHaveProperty('error');
  });
});
