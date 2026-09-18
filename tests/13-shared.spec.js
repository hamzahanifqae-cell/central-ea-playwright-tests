const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Shared Page', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
  });

  // ╔═══════════════════════════════════════════════════╗
  //  PAGE LOAD
  // ╚═══════════════════════════════════════════════════╝

  let sharedIsEmpty = false;

  test('S0 — shared page loads (empty state or existing assignments)', async ({ page }) => {
    test.setTimeout(60_000);

    await ac.goto('Shared');
    await page.waitForLoadState('domcontentloaded');

    const emptyMsg = page.getByText('No threads here yet');
    sharedIsEmpty = await emptyMsg.isVisible().catch(() => false);

    if (sharedIsEmpty) {
      await expect(emptyMsg).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Once something is assigned, shared, or mentioned')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Invite your team')).toBeVisible({ timeout: 5000 });
    } else {
      const hasText = await page.locator('main').innerText().catch(() => '');
      expect(hasText.length).toBeGreaterThan(10);
    }
  });

  // ╔═══════════════════════════════════════════════════╗
  //  FIND UNASSIGNED EMAIL AND ASSIGN
  // ╚═══════════════════════════════════════════════════╝

  test('S1 — find unassigned email in Inbox and open it', async ({ page }) => {
    test.setTimeout(90_000);

    await ac.goto('Inbox');
    await page.waitForLoadState('domcontentloaded');
    await page.getByLabel('Compose new email').waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    // Click an email row via its checkbox's ancestor row container — more
    // reliable than computing pixel coordinates, which can miss the row
    // entirely or land on a child control (checkbox/star) instead.
    const checkboxes = page.getByRole('checkbox', { name: 'Select email' });
    await expect(checkboxes.first()).toBeVisible({ timeout: 15_000 });
    const checkboxCount = await checkboxes.count();
    const idx = checkboxCount > 1 ? 1 : 0; // skip first in case it's already assigned
    const targetCheckbox = checkboxes.nth(idx);
    const row = targetCheckbox.locator('xpath=ancestor::div[contains(@class,"cursor-pointer") or @role="button" or @tabindex][1]');
    if (await row.isVisible().catch(() => false)) {
      await row.click();
    } else {
      await targetCheckbox.locator('xpath=../..').click();
    }
    await page.waitForLoadState('domcontentloaded');

    // Verify email detail view opens (Reply button always present)
    await expect(page.getByRole('button', { name: 'Reply' }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('S2 — assign email to self', async ({ page }) => {
    test.setTimeout(60_000);

    // Click the assign icon button in toolbar
    const assignBtn = page.getByLabel('Assign').first();
    await expect(assignBtn).toBeVisible({ timeout: 5000 });
    await assignBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Select "Hamza Hanif (You)" from dropdown
    const selfOption = page.getByText('Hamza Hanif (You)');
    await expect(selfOption).toBeVisible({ timeout: 5000 });
    await selfOption.click();
    await page.waitForLoadState('domcontentloaded');
  });

  // ╔═══════════════════════════════════════════════════╗
  //  VERIFY IN SHARED PAGE
  // ╚═══════════════════════════════════════════════════╝

  test('S3 — shared page shows the assigned email', async ({ page }) => {
    test.setTimeout(60_000);

    await ac.goto('Shared');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('No threads here yet')).not.toBeVisible({ timeout: 5000 });

    // Verify at least one thread is visible in shared
    const mainText = await page.locator('main').innerText().catch(() => '');
    expect(mainText.length).toBeGreaterThan(10);
  });

  // ╔═══════════════════════════════════════════════════╗
  //  FILTER TABS — Assigned, Shared, Mentioned
  // ╚═══════════════════════════════════════════════════╝

  test('S4 — Assigned, Shared, Mentioned tabs are clickable and working', async ({ page }) => {
    test.setTimeout(60_000);

    // Navigate to Shared page first (in case prior test failed)
    await ac.goto('Shared');
    await page.waitForLoadState('domcontentloaded');

    // Scope to <main> so the sidebar's "Shared" nav link isn't matched —
    // the tabs are ordinary buttons inside the page content.
    const tabNames = ['Assigned', 'Shared', 'Mentioned', 'All'];

    for (const name of tabNames) {
      const tabBtn = page.locator('main').getByRole('button', { name, exact: true }).first();
      await expect(tabBtn).toBeVisible({ timeout: 5000 });
      await tabBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  // ╔═══════════════════════════════════════════════════╗
  //  TEAM COMMENT WITH @MENTION
  // ╚═══════════════════════════════════════════════════╝

  test('S5 — add team comment with @mention and verify', async ({ page }) => {
    test.setTimeout(90_000);

    // Open the assigned thread
    const threads = page.getByText('Assigned to you');
    const count = await threads.count();
    if (count > 0) {
      await threads.nth(count - 1).click();
      await page.waitForLoadState('domcontentloaded');
    }

    const commentBtn = page.getByRole('button', { name: 'Add team comments' });
    await expect(commentBtn).toBeVisible({ timeout: 5000 });
    await commentBtn.click();
    await page.waitForLoadState('domcontentloaded');

    const commentInput = page.getByRole('textbox', { name: /Add a comment/i });
    await expect(commentInput).toBeVisible({ timeout: 5000 });
    await commentInput.click();
    await commentInput.pressSequentially('@hamzahanifsqae', { delay: 50 });
    await page.waitForLoadState('domcontentloaded');

    const mentionOption = page.getByText('hamzahanifsqae').last();
    await expect(mentionOption).toBeVisible({ timeout: 5000 });
    await mentionOption.click();
    await page.waitForLoadState('domcontentloaded');

    await page.keyboard.press('Enter');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('hamzahanifsqae').first()).toBeVisible({ timeout: 5000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  CLEANUP — REMOVE ASSIGNMENT
  // ╚═══════════════════════════════════════════════════╝

  test('S6 — remove assignment and verify thread count decreased', async ({ page }) => {
    test.setTimeout(60_000);

    // Count threads before remove
    const beforeCount = await page.getByText('Assigned to you').count();

    const removeBtn = page.getByText('Remove', { exact: true }).first();
    await expect(removeBtn).toBeVisible({ timeout: 5000 });
    await removeBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Reload shared page
    await ac.goto('Shared');
    await page.waitForLoadState('domcontentloaded');

    // Verify thread count decreased or page is empty
    const emptyMsg = page.getByText('No threads here yet');
    const isEmpty = await emptyMsg.isVisible().catch(() => false);

    if (isEmpty) {
      await expect(emptyMsg).toBeVisible({ timeout: 5000 });
    } else {
      const afterCount = await page.getByText('Assigned to you').count();
      expect(afterCount).toBeLessThan(beforeCount);
    }
  });

  // ╔═══════════════════════════════════════════════════╗
  //  OPEN ASSIGNED EMAIL DETAIL FROM SHARED
  // ╚═══════════════════════════════════════════════════╝

  test('S7 — open assigned email from shared page and verify detail', async ({ page }) => {
    test.setTimeout(60_000);

    // Check if there are still assigned threads to open
    const threads = page.getByText('Assigned to you');
    const count = await threads.count();

    if (count > 0) {
      await threads.first().click();
      await page.waitForLoadState('domcontentloaded');

      // Verify detail panel shows "Remove" button
      await expect(page.getByText('Remove').first()).toBeVisible({ timeout: 10_000 });
    } else {
      // No threads left — page is empty, verify empty state
      await expect(page.getByText('No threads here yet')).toBeVisible({ timeout: 5000 });
    }
  });
});
