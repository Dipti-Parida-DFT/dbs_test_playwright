import { test as base } from '@playwright/test';
import { UserApi } from './userApi';
import { EntitlementApi } from './entitlementApi';
import { UserIdAvailApi } from './userIdAvailApi';

type ApiFixtures = {
  userApi: UserApi;
  entitlementApi: EntitlementApi;
  userIdAvailApi: UserIdAvailApi;
};

import { APIRequestContext } from '@playwright/test';

export const test = base.extend<ApiFixtures>({
  userApi: async (
    { request }: { request: APIRequestContext },
    use: (value: UserApi) => Promise<void>
  ) => {
    await use(new UserApi(request));
  },

  entitlementApi: async (
    { request }: { request: APIRequestContext },
    use: (value: EntitlementApi) => Promise<void>
  ) => {
    await use(new EntitlementApi(request));
  },

  userIdAvailApi: async (
    { request }: { request: APIRequestContext },
    use: (value: UserIdAvailApi) => Promise<void>
  ) => {
    await use(new UserIdAvailApi(request));
  },
});

export { expect } from '@playwright/test';