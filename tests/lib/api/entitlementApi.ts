// src/api/entitlementApi.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetEntitlementReqEnvelope } from './models';

export class EntitlementApi {
  private readonly baseURL = 'https://10.8.59.68:7443';

  constructor(private readonly request: APIRequestContext) {}

  /**
   * POST /mbg-banking/customer/getEntitlement
   */
  async getEntitlement(
    payload: GetEntitlementReqEnvelope,
    sessionId?: string
  ): Promise<APIResponse> {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (sessionId) {
      headers['Cookie'] = `JSESSIONID=${sessionId}`;
    }

    return this.request.post(
      `${this.baseURL}/mbg-banking/customer/getEntitlement?format=json`,
      {
        data: payload,
        headers: headers,
      }
    );
  }
}
