import { test as base } from '@playwright/test';
import { Application } from '../app';

export const baseFixture = base.extend<{ app: Application }>({
  app: async ({ page }, use) => {
    const app = new Application(page);
    await use(app);
  },
});
