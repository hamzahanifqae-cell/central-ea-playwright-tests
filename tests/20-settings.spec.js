const { test, expect } = require('./fixtures');
const { SettingsPage } = require('../pages/SettingsPage');

test.describe('Settings Page', () => {
  test.describe.configure({ mode: 'serial' });
  let sp;

  test.beforeEach(async ({ page }) => {
    sp = new SettingsPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
  });

  // Tests will be added here
});
