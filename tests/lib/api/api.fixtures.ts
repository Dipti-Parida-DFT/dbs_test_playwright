// fixtures/api.fixtures.ts
import { test as base } from '@playwright/test';
import { UserApi } from './userApi';
import { EntitlementApi } from './entitlementApi';

type ApiFixtures = {
  userApi: UserApi;
  entitlementApi: EntitlementApi;
};

export const test = base.extend<ApiFixtures>({
  userApi: async ({ request }, use) => {
    const api = new UserApi(request);
    await use(api);
  },
  entitlementApi: async ({ request }, use) => {
    const api = new EntitlementApi(request);
    await use(api);
  },
});

export { expect } from '@playwright/test';
