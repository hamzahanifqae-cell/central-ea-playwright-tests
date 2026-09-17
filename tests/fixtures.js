const base = require('@playwright/test');

const test = base.test.extend({
  workerContext: [async ({ browser }, use) => {
    const ctx = await browser.newContext({
      storageState: '.auth/user.json',
      viewport: null,
    });
    await use(ctx);
    await ctx.close();
  }, { scope: 'worker' }],

  workerPage: [async ({ workerContext }, use) => {
    const page = await workerContext.newPage();
    await use(page);
  }, { scope: 'worker' }],

  page: async ({ workerPage }, use) => {
    if (workerPage.url().includes('/auth/login')) {
      throw new Error(
        'Session expired — run `npm run auth` to refresh .auth/user.json'
      );
    }
    await use(workerPage);
  },
});

module.exports = { test, expect: base.expect };
