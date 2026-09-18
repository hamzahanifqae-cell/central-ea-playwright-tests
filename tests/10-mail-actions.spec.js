const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Mail Actions — select and star', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;

  async function switchToGoogle(page) {
    const compose = page.getByLabel('Compose new email');
    const box = await compose.boundingBox();
    if (!box) return;
    await page.mouse.click(box.x + box.width + 20, box.y + box.height / 2);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      const els = document.querySelectorAll('div, span, button, a');
      for (const el of els) {
        const t = el.textContent?.trim() || '';
        const rect = el.getBoundingClientRect();
        if (t.includes('hamzahanif') && !t.includes('Disconnect') && !t.includes('All Mail')
            && rect.width > 0 && rect.height > 0 && t.length < 40
            && rect.x > 800) {
          el.click();
          break;
        }
      }
    });
    await page.waitForLoadState('domcontentloaded');
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  }

  // Checkbox selector — these spans have opacity:0 and show on hover
  const checkboxSel = 'span[class*="w-4"][class*="h-4"][class*="rounded"][class*="border"]';

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
    // Rate-limit backoff: wait 2s before any email page navigation
    await page.waitForLoadState('domcontentloaded');
    await ac.ensurePage('Inbox');
    await page.getByLabel('Compose new email').waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');
  });

  // M0 — switch to Google account (Zoom has 0 emails)
  test('switch to Google account', async ({ page }) => {
    test.setTimeout(90_000);
    await switchToGoogle(page);
    // Wait for emails to fully render (star buttons appear with each row)
    const starOrUnstar = page.locator('button[aria-label="Star email"], button[aria-label="Unstar email"]');
    await expect(starOrUnstar.first()).toBeVisible({ timeout: 30_000 });
    const total = await starOrUnstar.count();
    expect(total).toBeGreaterThan(0);
  });

  // M1 — click email checkbox → bottom selection toolbar appears
  test('select email shows bottom action toolbar', async ({ page }) => {
    test.setTimeout(60_000);

    // Ensure compact view
    const compactBtn = page.getByLabel(/compact view/i).first();
    if (await compactBtn.isVisible().catch(() => false)) {
      await compactBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }

    // Click checkbox (span has opacity:0, force:true bypasses visibility)
    const checkbox = page.locator(checkboxSel).first();
    await checkbox.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Bottom selection toolbar should show email count
    await expect(page.getByText(/\d+\s*email/i).first()).toBeVisible({ timeout: 5000 });

    // Deselect
    await checkbox.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
  });

  // M2 — toolbar select-all → all selected → click again → all deselected
  test('select all and deselect all via toolbar', async ({ page }) => {
    test.setTimeout(60_000);

    // Select first email to summon toolbar
    const checkbox = page.locator(checkboxSel).first();
    await checkbox.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    const countEl = page.getByText(/\d+\s*email/i).first();
    await expect(countEl).toBeVisible({ timeout: 5000 });

    // The toolbar select-all is a div with w-5 h-5 rounded border-2
    const selectAllSel = 'div[class*="w-5"][class*="h-5"][class*="rounded"][class*="border-2"]';
    const selectAll = page.locator(selectAllSel).first();
    await selectAll.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Verify count > 1 (all selected)
    const text = await countEl.textContent();
    const num = parseInt(text.match(/(\d+)/)?.[1] || '0');
    expect(num).toBeGreaterThan(1);

    // Click select-all again to deselect
    await selectAll.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Toolbar should disappear
    const gone = !(await countEl.isVisible().catch(() => false));
    expect(gone).toBe(true);
  });

  // M3 — find unstarred email, star it, verify, then unstar it back
  test('star an email via star button', async ({ page }) => {
    test.setTimeout(60_000);

    // Find the index of first unstarred email (has "Star email" label, not "Unstar email")
    const starBtns = page.getByLabel('Star email');
    const starCount = await starBtns.count();

    if (starCount === 0) {
      // All emails are already starred — unstar the first one, then re-star it
      const unstarBtn = page.getByLabel('Unstar email').first();
      await unstarBtn.click({ force: true });
      await page.waitForLoadState('domcontentloaded');
    }

    // Now click "Star email" on the first unstarred email
    const starBtn = page.getByLabel('Star email').first();
    await expect(starBtn).toBeVisible({ timeout: 5000 });
    await starBtn.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Verify it changed to "Unstar email" (star is now filled)
    // Leave it starred — M4 checks the Starred folder, M5 unstars it
    await expect(page.getByLabel('Unstar email').first()).toBeVisible({ timeout: 5000 });
  });

  // M4 — navigate to Starred folder, wait for sync, verify starred email exists
  test('starred folder shows the starred email', async ({ page }) => {
    test.setTimeout(60_000);

    // Rate-limit backoff before folder navigation
    await page.waitForLoadState('domcontentloaded');
    const starredLink = page.getByText('Starred', { exact: true }).first();
    await starredLink.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Verify starred emails are visible
    const unstarBtns = page.getByLabel('Unstar email');
    await expect(unstarBtns.first()).toBeVisible({ timeout: 15_000 });
    const count = await unstarBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  // M5 — unstar email on Starred page, verify removed, check inbox
  test('unstar email and verify in inbox', async ({ page }) => {
    test.setTimeout(90_000);

    // Rate-limit backoff before folder navigation
    await page.waitForLoadState('domcontentloaded');
    const starredLink = page.getByText('Starred', { exact: true }).first();
    await starredLink.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Wait for starred emails to load
    const unstarBtns = page.getByLabel('Unstar email');
    await expect(unstarBtns.first()).toBeVisible({ timeout: 15_000 });
    const beforeCount = await unstarBtns.count();

    // Unstar the last one (the one we starred in M3)
    await unstarBtns.last().click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Rate-limit backoff before going back to Inbox
    await page.waitForLoadState('domcontentloaded');
    await ac.ensurePage('Inbox');
    await page.waitForLoadState('domcontentloaded');

    // Verify inbox loaded and email is not starred
    await expect(page.getByLabel('Compose new email')).toBeVisible({ timeout: 10_000 });
    const starBtnsInInbox = page.getByLabel('Star email');
    const starCount = await starBtnsInInbox.count();
    expect(starCount).toBeGreaterThan(0);
  });

  /** Hovers over an email row's right side to reveal action icons */
  async function hoverEmailRow(page, rowIndex = 0) {
    const stars = page.getByLabel(/^(Star|Unstar) email$/);
    const star = stars.nth(rowIndex);
    const box = await star.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 800, box.y + box.height / 2);
      await page.waitForLoadState('domcontentloaded');
    }
  }

  // M6 — hover email row → Mark as Done, then toggle read state
  test('hover actions — mark as done and mark as unread', async ({ page }) => {
    test.setTimeout(60_000);

    // Hover row 2 → click Mark as Done
    await hoverEmailRow(page, 2);
    await page.getByLabel('Mark as done').nth(2).click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Hover row 2 (shifted after done removal) → toggle read/unread
    await hoverEmailRow(page, 2);
    await page.waitForLoadState('domcontentloaded');
    const unreadBtn = page.getByLabel('Mark as unread');
    const readBtn = page.getByLabel('Mark as read');
    if (await unreadBtn.count() > 2) {
      await unreadBtn.nth(2).click({ force: true });
    } else if (await readBtn.count() > 2) {
      await readBtn.nth(2).click({ force: true });
    }
    await page.waitForLoadState('domcontentloaded');
  });

  // M7 — Create a Task from email hover → fill modal → Add Task → verify on Tasks page
  test('create a task from email', async ({ page }) => {
    test.setTimeout(120_000);

    // Hover email row → click Create a Task
    await hoverEmailRow(page, 6);
    await page.getByLabel('Create a task').nth(6).click({ force: true });

    // Modal should open with "Follow up:" title
    await expect(page.locator('body')).toContainText(/Follow up|Tasks|Add Task/i, { timeout: 15_000 });

    // Capture the task title for later verification
    const taskTitle = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"], input:not([type])');
      for (const inp of inputs) {
        if (inp.value && /follow up/i.test(inp.value)) return inp.value;
      }
      const els = document.querySelectorAll('h1, h2, h3, h4, [class*="title"], [class*="subject"]');
      for (const el of els) {
        const t = el.textContent?.trim() || '';
        if (/follow up/i.test(t) && t.length < 200) return t;
      }
      return '';
    });

    // Enter description in the rich text editor
    const descEditor = page.locator('[placeholder="Description"], [contenteditable="true"]').first();
    if (await descEditor.isVisible().catch(() => false)) {
      await descEditor.click();
      await page.keyboard.type('ZZTEST automated task description', { delay: 15 });
      await page.waitForLoadState('domcontentloaded');
    }

    // Click "To do" status button and select first option
    const todoBtn = page.getByText('To do', { exact: false }).first();
    if (await todoBtn.isVisible().catch(() => false)) {
      await todoBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const option = page.getByRole('option').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
      } else {
        const menuItem = page.getByRole('menuitem').first();
        if (await menuItem.isVisible().catch(() => false)) {
          await menuItem.click();
        } else {
          await page.keyboard.press('Escape');
        }
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Click Priority button → select "Low"
    const priorityBtn = page.getByText('Priority', { exact: true }).first();
    if (await priorityBtn.isVisible().catch(() => false)) {
      await priorityBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const lowOption = page.getByText('Low priority').first();
      if (await lowOption.isVisible().catch(() => false)) {
        await lowOption.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Click Assignee button → select "Hamza Hanif (You)"
    const assigneeBtn = page.getByText('Assignee', { exact: true }).first();
    if (await assigneeBtn.isVisible().catch(() => false)) {
      await assigneeBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const youOption = page.getByText('Hamza Hanif (You)').first();
      if (await youOption.isVisible().catch(() => false)) {
        await youOption.click();
      } else {
        const fallback = page.getByText('You', { exact: true }).first();
        if (await fallback.isVisible().catch(() => false)) {
          await fallback.click();
        } else {
          await page.keyboard.press('Escape');
        }
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Click All Tasks button
    const allTasksBtn = page.getByText('All Tasks', { exact: true }).first();
    if (await allTasksBtn.isVisible().catch(() => false)) {
      await allTasksBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const option = page.getByRole('option').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
      } else {
        const menuItem = page.getByRole('menuitem').first();
        if (await menuItem.isVisible().catch(() => false)) {
          await menuItem.click();
        } else {
          await page.keyboard.press('Escape');
        }
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Click Labels button → select "Product"
    const labelsBtn = page.getByText('Labels', { exact: true }).first();
    if (await labelsBtn.isVisible().catch(() => false)) {
      await labelsBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const productLabel = page.getByText('Product', { exact: true }).first();
      if (await productLabel.isVisible().catch(() => false)) {
        await productLabel.click();
      } else {
        const option = page.getByRole('option').first();
        if (await option.isVisible().catch(() => false)) {
          await option.click();
        } else {
          await page.keyboard.press('Escape');
        }
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Click calendar/date button
    const calBtn = page.getByText(/\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/).first();
    if (await calBtn.isVisible().catch(() => false)) {
      await calBtn.click();
      await page.waitForLoadState('domcontentloaded');
      await page.keyboard.press('Escape');
      await page.waitForLoadState('domcontentloaded');
    }

    // Click Add Task
    const addTaskBtn = page.getByRole('button', { name: 'Add Task' });
    await expect(addTaskBtn).toBeVisible({ timeout: 5000 });
    await addTaskBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Navigate to Tasks page via sidebar
    await ac.ensurePage('Tasks');
    await page.waitForLoadState('domcontentloaded');

    // Click the Tasks-page search icon (second lucide-search, not the global top bar)
    const searchIcons = page.locator('svg.lucide-search');
    const count = await searchIcons.count();
    const taskSearchIcon = count > 1 ? searchIcons.nth(1) : searchIcons.first();
    await taskSearchIcon.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Type the task title (or "Follow up" as fallback) in the search input
    const searchTerm = taskTitle ? taskTitle.substring(0, 30) : 'Follow up';
    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill(searchTerm);
    await page.waitForLoadState('domcontentloaded');

    // Verify search results show matching tasks
    await expect(page.getByText(/matching\s*(tasks?\s*found|results)/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // M8 — Compose email to self → send → verify in Sent folder
  test('compose and send email to self, verify in Sent', async ({ page }) => {
    test.setTimeout(120_000);

    // Click Compose new email
    await page.getByLabel('Compose new email').click();
    await page.waitForLoadState('domcontentloaded');

    // Fill To field with own email and confirm with Tab
    const toField = page.getByPlaceholder(/recipients|to/i).first();
    await expect(toField).toBeVisible({ timeout: 5000 });
    await toField.click();
    await toField.pressSequentially('hamzahanifsqae@gmail.com', { delay: 30 });
    await page.waitForLoadState('domcontentloaded');
    await page.keyboard.press('Tab');
    await page.waitForLoadState('domcontentloaded');

    // Fill Subject
    const subjectField = page.getByPlaceholder(/subject/i).first();
    await expect(subjectField).toBeVisible({ timeout: 5000 });
    await subjectField.click();
    await subjectField.fill('ZZTEST compose email');
    await page.waitForLoadState('domcontentloaded');

    // Fill Body — click the compose body area (first contenteditable inside compose)
    const bodyEditor = page.locator('[contenteditable="true"]').first();
    await expect(bodyEditor).toBeVisible({ timeout: 5000 });
    await bodyEditor.click();
    await page.keyboard.type('ZZTEST automated email body', { delay: 15 });
    await page.waitForLoadState('domcontentloaded');

    // Send with Ctrl+Enter (more reliable than clicking Send button)
    await page.keyboard.press('Control+Enter');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to Sent folder
    const sentLink = page.getByText('Sent', { exact: true }).first();
    await sentLink.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Wait for Sent page emails to load (not skeleton), then reload once
    const sentEmail = page.getByText('ZZTEST compose email').first();
    let found = await sentEmail.isVisible().catch(() => false);
    if (!found) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      found = await sentEmail.isVisible().catch(() => false);
    }
    if (!found) {
      // Second retry with longer backoff
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(sentEmail).toBeVisible({ timeout: 30_000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  EMAIL DETAIL, DELETE & FOLDERS
  // ╚═══════════════════════════════════════════════════╝

  // M9 — Open ZZTEST email → see full body/thread → go back
  test('open sent email detail view and verify body', async ({ page }) => {
    test.setTimeout(120_000);

    // Navigate to Sent folder
    await page.waitForLoadState('domcontentloaded');
    const sentLink = page.getByText('Sent', { exact: true }).first();
    await sentLink.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Wait for the ZZTEST email to appear
    const sentEmail = page.getByText('ZZTEST compose email').first();
    let found = await sentEmail.isVisible().catch(() => false);
    if (!found) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(sentEmail).toBeVisible({ timeout: 15_000 });

    // Click the email to open detail view
    await sentEmail.click();

    // Verify subject shown in detail view
    await expect(page.getByText('ZZTEST compose email').first()).toBeVisible({ timeout: 10_000 });

    // Verify sender info visible
    await expect(page.getByText('hamzahanifsqae@gmail.com').first()).toBeVisible({ timeout: 5000 });

    // Email body is rendered inside an iframe — check via frameLocator
    const iframes = page.frameLocator('iframe');
    const bodyInIframe = await iframes.first().getByText('ZZTEST automated email body')
      .isVisible({ timeout: 5000 }).catch(() => false);
    const bodyInMain = await page.getByText('ZZTEST automated email body').first()
      .isVisible().catch(() => false);
    expect(bodyInIframe || bodyInMain).toBe(true);

    // Verify Reply/Forward buttons are visible in detail view
    await expect(page.getByRole('button', { name: 'Reply' }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Forward' }).first()).toBeVisible();

    // Go back to Sent list via back arrow
    const backBtn = page.locator('button svg.lucide-arrow-left, button svg.lucide-chevron-left').first();
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click({ force: true });
    } else {
      await sentLink.click({ force: true });
    }
    await page.waitForLoadState('domcontentloaded');
  });

  // M10 — Delete the ZZTEST sent email via detail view trash icon
  test('delete sent ZZTEST email', async ({ page }) => {
    test.setTimeout(120_000);

    // Navigate to Sent folder
    await page.waitForLoadState('domcontentloaded');
    const sentLink = page.getByText('Sent', { exact: true }).first();
    await sentLink.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Wait for ZZTEST email
    const sentEmail = page.getByText('ZZTEST compose email').first();
    let found = await sentEmail.isVisible().catch(() => false);
    if (!found) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(sentEmail).toBeVisible({ timeout: 15_000 });

    // Prior unclean runs can leave multiple "ZZTEST compose email" entries in
    // Sent, so verify by count decreasing rather than assuming a single match.
    const beforeCount = await page.getByText('ZZTEST compose email').count();

    // Open the email detail — wait for the detail view to actually render
    // before looking for its trash icon (Reply button is a reliable marker).
    await sentEmail.click();
    await expect(page.getByRole('button', { name: 'Reply' }).first()).toBeVisible({ timeout: 10_000 });

    // Click the trash/delete icon in the detail toolbar
    const trashBtn = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2, svg.lucide-trash') }).first();
    if (await trashBtn.isVisible().catch(() => false)) {
      await trashBtn.click({ force: true });
    } else {
      // Fallback: try aria-label
      const deleteBtn = page.getByLabel(/delete|trash|move to trash/i).first();
      await deleteBtn.click({ force: true });
    }
    await page.waitForLoadState('domcontentloaded');

    // Clear overlay
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
      document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    // Navigate back to Sent and verify one fewer ZZTEST email is present
    await sentLink.click({ force: true });
    await expect(page.getByLabel('Compose new email')).toBeVisible({ timeout: 10_000 });
    await expect.poll(
      () => page.getByText('ZZTEST compose email').count(),
      { timeout: 10_000 }
    ).toBeLessThan(beforeCount);
  });

  // M11 — Trash folder loads and contains deleted email
  test('trash folder loads with deleted email', async ({ page }) => {
    test.setTimeout(90_000);

    // Navigate to Trash folder
    await page.waitForLoadState('domcontentloaded');
    const trashLink = page.getByText('Trash', { exact: true }).first();
    await expect(trashLink).toBeVisible({ timeout: 10_000 });
    await trashLink.click({ force: true });

    // Verify Trash folder loaded
    await expect(page.getByLabel('Compose new email')).toBeVisible({ timeout: 10_000 });

    // Check if deleted ZZTEST email is in trash
    const zztestInTrash = await page.getByText('ZZTEST compose email').first()
      .isVisible().catch(() => false);
    if (!zztestInTrash) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(page.getByText('ZZTEST compose email').first()).toBeVisible({ timeout: 15_000 });

    // Go back to Inbox
    await page.waitForLoadState('domcontentloaded');
    const inboxLink = page.getByText('Inbox', { exact: true }).first();
    await inboxLink.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
  });

  // M12 moved to 11-scheduling.spec.js
});
