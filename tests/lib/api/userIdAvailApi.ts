import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetUserIDAvailReqEnvelope } from './models';

export class UserIdAvailApi {
  private readonly baseURL = 'https://10.8.59.68:7443';

  constructor(private readonly request: APIRequestContext) {}

  async getUserIdAvail(
    payload: GetUserIDAvailReqEnvelope,
    sessionId?: string
  ): Promise<APIResponse> {

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (sessionId) {
      headers['Cookie'] = `JSESSIONID=${sessionId}`;
    }

    return this.request.post(
      `${this.baseURL}/idealsso-banking/user/getAvailUserId`,
      {
        data: payload,
        headers,
      }
    );
  }
}