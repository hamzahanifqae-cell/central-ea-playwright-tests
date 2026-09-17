/**
 * Central EA login. Session is stored in .auth/user.json.
 * Run:  node auth.js            (headless)
 *       node auth.js --headed   (to watch the browser)
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
require('dotenv').config({ quiet: true });

const AUTH_FILE = '.auth/user.json';
const LOGIN_URL = 'https://app.trycentral.com/auth/login';
const headed = process.argv.includes('--headed');

(async () => {
  const { TRY_CENTRAL_EMAIL, TRY_CENTRAL_PASSWORD } = process.env;
  if (!TRY_CENTRAL_EMAIL || !TRY_CENTRAL_PASSWORD) {
    console.error('TRY_CENTRAL_EMAIL / TRY_CENTRAL_PASSWORD not found in .env');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    console.log('Login page loaded');

    const email = page.getByPlaceholder('you@company.com');
    const password = page.locator('input[type="password"]');
    const submit = page.getByRole('button', { name: /sign in/i });

    await email.waitFor({ state: 'visible', timeout: 30_000 });
    await submit.waitFor({ state: 'visible', timeout: 15_000 });

    // Wait for React hydration — filling before this causes the value to get wiped.
    await page.waitForFunction(() => {
      const b = [...document.querySelectorAll('button')]
        .find(el => /sign in/i.test(el.textContent || ''));
      return b && !b.disabled;
    }, { timeout: 15_000 }).catch(() => console.log('Hydration wait timed out, continuing'));

    // pressSequentially triggers React's onChange. fill() does not.
    let filled = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      await email.click();
      await email.fill('');
      await email.pressSequentially(TRY_CENTRAL_EMAIL, { delay: 25 });

      await password.click();
      await password.fill('');
      await password.pressSequentially(TRY_CENTRAL_PASSWORD, { delay: 25 });

      if (await email.inputValue() === TRY_CENTRAL_EMAIL &&
          (await password.inputValue()).length === TRY_CENTRAL_PASSWORD.length) {
        filled = true;
        console.log(`Fields filled (attempt ${attempt})`);
        break;
      }
      console.log(`Attempt ${attempt}: values got wiped, retrying`);
      await page.waitForTimeout(1000);
    }
    if (!filled) throw new Error('React did not accept the input values');

    await submit.click();
    console.log('Submitted, waiting for redirect');
    await page.waitForURL('**/app/ea/**', { timeout: 30_000, waitUntil: 'domcontentloaded' });

    fs.mkdirSync('.auth', { recursive: true });
    await context.storageState({ path: AUTH_FILE });
    console.log(`Session saved: ${AUTH_FILE}`);
    console.log(`Landed on: ${page.url()}`);
  } catch (err) {
    await page.screenshot({ path: 'login-failure.png', fullPage: true }).catch(() => {});
    console.error('Login failed. Check login-failure.png for details');
    console.error(`URL: ${page.url()}`);
    console.error(err.message);
    const t = await page.locator('[role="alert"], [class*="error"]').first()
      .innerText().catch(() => null);
    if (t) console.error(`Page error: ${t.trim()}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
