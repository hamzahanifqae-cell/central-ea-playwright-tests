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
    await page.waitForTimeout(3000);

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
    await page.waitForTimeout(3000);
    await page.getByLabel('Compose new email').waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Find an email that is NOT already assigned — try multiple emails
    const emailRows = await page.evaluate(() => {
      const rows = [];
      const main = document.querySelector('main') || document.body;
      const links = main.querySelectorAll('a, div[role="row"], div[class*="email"], tr');
      for (const row of links) {
        const rect = row.getBoundingClientRect();
        if (rect.y > 150 && rect.y < 700 && rect.width > 300 && rect.height > 30) {
          const text = row.innerText?.trim() || '';
          if (text.length > 5 && !text.includes('Assigned')) {
            rows.push({ y: Math.round(rect.y), x: Math.round(rect.x + rect.width / 2), text: text.substring(0, 60) });
          }
        }
      }
      return rows;
    });

    // Click on the first unassigned email row
    if (emailRows.length > 0) {
      await page.mouse.click(emailRows[0].x, emailRows[0].y);
    } else {
      // Fallback — click second email (first might be assigned)
      const emails = page.getByText('Hamza Hanif');
      const count = await emails.count();
      const idx = count > 1 ? 1 : 0;
      await emails.nth(idx).click();
    }
    await page.waitForTimeout(3000);

    // Verify email detail view opens (Reply button always present)
    await expect(page.getByRole('button', { name: 'Reply' }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('S2 — assign email to self', async ({ page }) => {
    test.setTimeout(60_000);

    // Click the assign icon button in toolbar
    const assignBtn = page.getByLabel('Assign').first();
    await expect(assignBtn).toBeVisible({ timeout: 5000 });
    await assignBtn.click();
    await page.waitForTimeout(2000);

    // Select "Hamza Hanif (You)" from dropdown
    const selfOption = page.getByText('Hamza Hanif (You)');
    await expect(selfOption).toBeVisible({ timeout: 5000 });
    await selfOption.click();
    await page.waitForTimeout(3000);
  });

  // ╔═══════════════════════════════════════════════════╗
  //  VERIFY IN SHARED PAGE
  // ╚═══════════════════════════════════════════════════╝

  test('S3 — shared page shows the assigned email', async ({ page }) => {
    test.setTimeout(60_000);

    await ac.goto('Shared');
    await page.waitForTimeout(3000);

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
    await page.waitForTimeout(3000);

    // Click each filter tab using evaluate to avoid sidebar "Shared" link collision
    // Tabs are in content area (x > 250) near the top of the page
    const tabNames = ['Assigned', 'Shared', 'Mentioned', 'All'];

    for (const name of tabNames) {
      const clicked = await page.evaluate((tabName) => {
        const elements = document.querySelectorAll('button, a, [role="tab"], span');
        for (const el of elements) {
          const text = el.textContent?.trim();
          const rect = el.getBoundingClientRect();
          if (text === tabName && rect.x > 250 && rect.y < 350 && rect.width > 15 && rect.height > 10) {
            el.click();
            return true;
          }
        }
        return false;
      }, name);

      expect(clicked).toBe(true);
      await page.waitForTimeout(2000);
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
      await page.waitForTimeout(3000);
    }

    const commentBtn = page.getByRole('button', { name: 'Add team comments' });
    await expect(commentBtn).toBeVisible({ timeout: 5000 });
    await commentBtn.click();
    await page.waitForTimeout(2000);

    const commentInput = page.getByRole('textbox', { name: /Add a comment/i });
    await expect(commentInput).toBeVisible({ timeout: 5000 });
    await commentInput.click();
    await commentInput.pressSequentially('@hamzahanifsqae', { delay: 50 });
    await page.waitForTimeout(2000);

    const mentionOption = page.getByText('hamzahanifsqae').last();
    await expect(mentionOption).toBeVisible({ timeout: 5000 });
    await mentionOption.click();
    await page.waitForTimeout(1000);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

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
    await page.waitForTimeout(3000);

    // Reload shared page
    await ac.goto('Shared');
    await page.waitForTimeout(3000);

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
      await page.waitForTimeout(3000);

      // Verify detail panel shows "Remove" button
      await expect(page.getByText('Remove').first()).toBeVisible({ timeout: 10_000 });
    } else {
      // No threads left — page is empty, verify empty state
      await expect(page.getByText('No threads here yet')).toBeVisible({ timeout: 5000 });
    }
  });
});
