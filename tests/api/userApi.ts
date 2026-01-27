// src/api/userApi.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetUsersReqEnvelope } from '../lib/api/models';

export class UserApi {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * POST /idealsso-banking/user/getUserDetailWithAuthSignatory
   */
  async getUserDetailWithAuthSignatory(
    payload: GetUsersReqEnvelope
  ): Promise<APIResponse> {
    return this.request.post(
      '/idealsso-banking/user/getUserDetailWithAuthSignatory',
      { data: payload }
    );
  }
}
