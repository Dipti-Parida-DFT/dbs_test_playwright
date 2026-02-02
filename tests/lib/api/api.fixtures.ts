import { test as base } from '@playwright/test';
import { UserApi } from './userApi';
import { EntitlementApi } from './entitlementApi';
import { UserIdAvailApi } from './userIdAvailApi';

type ApiFixtures = {
  userApi: UserApi;
  entitlementApi: EntitlementApi;
  userIdAvailApi: UserIdAvailApi;
};

export const test = base.extend<ApiFixtures>({
  userApi: async ({ request }, use) => {
    await use(new UserApi(request));
  },

  entitlementApi: async ({ request }, use) => {
    await use(new EntitlementApi(request));
  },

  userIdAvailApi: async ({ request }, use) => {
    await use(new UserIdAvailApi(request));
  },
});

export { expect } from '@playwright/test';