// src/api/userApi.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetUsersReqEnvelope } from './models';

export class UserApi {
  private readonly baseURL = 'https://10.8.59.68:7443';
  constructor(private readonly request: APIRequestContext) {}

  /**
   * POST /idealsso-banking/user/getUserDetailWithAuthSignatory
   */
  async getUserDetailWithAuthSignatory(
    payload: GetUsersReqEnvelope
  ): Promise<APIResponse> {
    return this.request.post(
      `${this.baseURL}/idealsso-banking/user/getUserDetailWithAuthSignatory`,
      { data: payload }
    );
  }
}
