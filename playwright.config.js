const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 15_000 },

  retries: 2,

  // Trial quota bachane ke liye 1 hi worker.
  workers: 1,
  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./reporters/update-test-cases.js'],
    ['./reporters/test-summary.js'],
  ],

  use: {
    baseURL: 'https://app.trycentral.com',
    storageState: '.auth/user.json',

    // Browser DEFAULT pe nazar aata hai. Chhupana ho: $env:HEADLESS=1
    headless: !!process.env.HEADLESS,
    launchOptions: {
      slowMo: process.env.HEADLESS ? 0 : 300,
      args: process.env.HEADLESS ? ['--window-size=1920,1080'] : ['--start-maximized'],
    },

    viewport: null,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
  },

  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});