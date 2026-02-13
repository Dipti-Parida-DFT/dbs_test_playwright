import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetUsersReqEnvelope } from './models';

export class UserApi {
  private readonly baseURL = 'https://10.8.59.68:7443';

  constructor(private readonly request: APIRequestContext) {}

  /**
   * POST /idealsso-banking/user/getUserDetailWithAuthSignatory
   */
  async getUserDetailWithAuthSignatory(
    payload: GetUsersReqEnvelope,
    sessionId?: string
  ): Promise<APIResponse> {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (sessionId) {
      headers['Cookie'] = `JSESSIONID=${sessionId}`;
    }

    return this.request.post(
      `${this.baseURL}/idealsso-banking/user/getUserDetailWithAuthSignatory`,
      {
        data: payload,
        headers,
      }
    );
  }
}