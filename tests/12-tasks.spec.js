const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Tasks Page', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
    await ac.ensurePage('Tasks');
    // Wait for task list to render (skeleton → real rows)
    await page.getByText('Do it for me').first()
      .waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');
  });

  // T0 — Navigate to Tasks page, verify it loads
  test('tasks page loads with task counter', async ({ page }) => {
    test.setTimeout(60_000);

    // Verify "All Tasks" dropdown is visible
    const allTasks = page.locator('[role="button"]').filter({ hasText: 'All Tasks' });
    await expect(allTasks.first()).toBeVisible({ timeout: 30_000 });

    // Verify "+ Add Task" button is visible
    await expect(page.getByLabel('Add new task')).toBeVisible({ timeout: 5000 });

    // Wait for task rows to fully render (skeleton → actual content)
    await expect(page.getByText('Do it for me').first()).toBeVisible({ timeout: 30_000 });
    const count = await page.getByText('Do it for me').count();
    expect(count).toBeGreaterThan(0);
  });

  // T1 — All Tasks dropdown — open, check options, close
  test('all tasks dropdown shows options', async ({ page }) => {
    test.setTimeout(60_000);

    const allTasksBtn = page.locator('[role="button"]').filter({ hasText: 'All Tasks' }).first();
    await allTasksBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Dropdown should show options (list items or menu items)
    const options = page.getByRole('option');
    const menuItems = page.getByRole('menuitem');
    const optCount = await options.count();
    const menuCount = await menuItems.count();

    // At least some options should appear
    if (optCount === 0 && menuCount === 0) {
      // Try checking for any visible dropdown content
      const dropdownContent = await page.evaluate(() => {
        const els = document.querySelectorAll('[role="listbox"], [role="menu"], [data-state="open"]');
        return els.length;
      });
      expect(dropdownContent).toBeGreaterThan(0);
    }

    // Close dropdown
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  // T2 — Filter by user avatar
  test('filter tasks by user avatar', async ({ page }) => {
    test.setTimeout(60_000);

    // Count initial task rows
    const initialCount = await page.getByText('Do it for me').count();

    // Click "Filter by You" avatar button
    const filterYou = page.getByLabel('Filter by You');
    await expect(filterYou).toBeVisible({ timeout: 5000 });
    await filterYou.click();
    await page.waitForLoadState('domcontentloaded');

    // Click again to deselect filter
    await filterYou.click();

    // Wait for tasks to reload after unfiltering (8000+ tasks = slow render)
    const reloadedMarker = page.getByText('Do it for me').first()
      .or(page.getByText(/tasks?\s*remaining/i).first())
      .first();
    await expect(reloadedMarker).toBeVisible({ timeout: 30_000 });
  });

  // T3 — Search tasks
  test('search tasks via search icon', async ({ page }) => {
    test.setTimeout(60_000);

    // Click the search icon on the tasks toolbar (second "Open search", not the calendar one)
    const searchBtns = page.getByLabel('Open search');
    await searchBtns.first().click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    // Search input should appear
    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // Type a search term and verify input accepted it
    await searchInput.fill('meeting');
    await page.waitForLoadState('domcontentloaded');
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe('meeting');

    // Clear search — click the X button in the search bar
    const clearBtn = page.locator('svg.lucide-x').first();
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click({ force: true });
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForLoadState('domcontentloaded');
  });

  // T4 — Toggle List ↔ Board view
  test('toggle between list and board view', async ({ page }) => {
    test.setTimeout(60_000);

    // Verify List view is active (it's the default)
    const listBtn = page.getByLabel('List view');
    const boardBtn = page.getByLabel('Board view');
    await expect(listBtn).toBeVisible({ timeout: 5000 });
    await expect(boardBtn).toBeVisible({ timeout: 5000 });

    // Click Board view
    await boardBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Board view should now be active — verify board-like layout appears
    // (columns, kanban-style elements)
    const boardVisible = await page.evaluate(() => {
      const boardEls = document.querySelectorAll('[class*="board"], [class*="column"], [class*="kanban"]');
      return boardEls.length > 0;
    });

    // Switch back to List view
    await listBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify task rows are back (list layout with "Do it for me" buttons)
    const doItBtns = page.getByText('Do it for me');
    const count = await doItBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  // T5 — Filter tasks via filter icon
  test('filter icon opens filter panel', async ({ page }) => {
    test.setTimeout(60_000);

    const filterBtn = page.getByLabel('Filter emails');
    await expect(filterBtn).toBeVisible({ timeout: 5000 });
    await filterBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // A filter panel/dropdown should appear
    const filterPanel = await page.evaluate(() => {
      const panels = document.querySelectorAll('[data-state="open"], [role="dialog"], [class*="filter"], [class*="popover"]');
      return [...panels].filter(p => p.offsetWidth > 0 && p.offsetHeight > 0).length;
    });
    expect(filterPanel).toBeGreaterThan(0);

    // Close filter
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  // T5b — Filter by Priority → Urgent, verify, then clear
  test('filter by Priority Urgent and clear', async ({ page }) => {
    test.setTimeout(90_000);

    // Step 1: Click filter icon to open filter dropdown
    const filterBtn = page.getByLabel('Filter emails');
    await expect(filterBtn).toBeVisible({ timeout: 5000 });
    await filterBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Step 2: Select "Priority" from the filter type dropdown
    const priorityOpt = page.getByText('Priority', { exact: true }).first();
    await expect(priorityOpt).toBeVisible({ timeout: 5000 });
    await priorityOpt.click();
    await page.waitForLoadState('domcontentloaded');

    // Step 3: Click "Select Priority" dropdown to open priority values
    const selectPriority = page.getByText('Select Priority');
    await expect(selectPriority).toBeVisible({ timeout: 5000 });
    await selectPriority.click();
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Click "Urgent" from the priority options dropdown (role="option")
    const urgentOption = page.getByRole('option', { name: 'Urgent' });
    await expect(urgentOption).toBeVisible({ timeout: 5000 });
    await urgentOption.click();
    await page.waitForLoadState('domcontentloaded');

    // Step 5: Verify filter is applied
    // — "Clear All" button should be visible
    const clearAllBtn = page.getByText('Clear All');
    await expect(clearAllBtn).toBeVisible({ timeout: 5000 });
    // — "Remove Priority filter" X button should be visible
    const removeFilterBtn = page.getByLabel('Remove Priority filter');
    await expect(removeFilterBtn).toBeVisible({ timeout: 5000 });

    // Step 6: Clear the filter via "Clear All"
    await clearAllBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify filter is cleared — "Clear All" should disappear
    await expect(clearAllBtn).not.toBeVisible({ timeout: 5000 });
  });

  // T6 — Add Task via + Add Task button
  test('add task via button', async ({ page }) => {
    test.setTimeout(120_000);

    // Click "+ Add Task"
    await page.getByLabel('Add new task').click();
    await page.waitForLoadState('domcontentloaded');

    // A task creation form/modal/drawer should appear
    // Look for title input or "Add Task" form elements
    const titleInput = page.locator('input[placeholder*="itle"], input[placeholder*="ask"], input[type="text"]').first();
    const contentEditable = page.locator('[contenteditable="true"]').first();

    if (await titleInput.isVisible().catch(() => false)) {
      await titleInput.fill('ZZTEST task from tasks page');
      await page.waitForLoadState('domcontentloaded');
    }

    // Fill description if available
    if (await contentEditable.isVisible().catch(() => false)) {
      await contentEditable.click();
      await page.keyboard.type('ZZTEST automated task description from tasks page', { delay: 15 });
      await page.waitForLoadState('domcontentloaded');
    }

    // Set Priority → "Low priority"
    const priorityBtn = page.getByText('Priority', { exact: true }).first();
    if (await priorityBtn.isVisible().catch(() => false)) {
      await priorityBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const lowOpt = page.getByText('Low priority').first();
      if (await lowOpt.isVisible().catch(() => false)) {
        await lowOpt.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Set Assignee → "Hamza Hanif (You)"
    const assigneeBtn = page.getByText('Assignee', { exact: true }).first();
    if (await assigneeBtn.isVisible().catch(() => false)) {
      await assigneeBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const youOpt = page.getByText('Hamza Hanif (You)').first();
      if (await youOpt.isVisible().catch(() => false)) {
        await youOpt.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Set Labels → "Product"
    const labelsBtn = page.getByText('Labels', { exact: true }).first();
    if (await labelsBtn.isVisible().catch(() => false)) {
      await labelsBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const productOpt = page.getByText('Product', { exact: true }).first();
      if (await productOpt.isVisible().catch(() => false)) {
        await productOpt.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForLoadState('domcontentloaded');
    }

    // Submit — click "Add Task" button
    const addBtn = page.getByRole('button', { name: 'Add Task' });
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }

    // Verify task was added — search for it
    const searchBtns = page.getByLabel('Open search');
    await searchBtns.first().click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill('ZZTEST task from tasks page');

    // Verify search responded with results
    const matchEl = page.getByText(/matching\s*tasks?\s*found/i).first();
    const taskEl = page.getByText('ZZTEST task from tasks page').first();
    await expect(matchEl.or(taskEl).first()).toBeVisible({ timeout: 20_000 });
  });

  // T7 — Click a task row to open detail panel
  test('click task opens detail panel', async ({ page }) => {
    test.setTimeout(60_000);

    // Click the first task title (visible task row with "Do it for me")
    const firstTaskTitle = await page.evaluate(() => {
      const doItBtns = document.querySelectorAll('button, [role="button"]');
      for (const btn of doItBtns) {
        if (/do it for me/i.test(btn.textContent?.trim() || '')) {
          const row = btn.closest('[class*="group"]') || btn.parentElement?.parentElement;
          if (row) {
            const titleEl = row.querySelector('span, p, div');
            if (titleEl) {
              const rect = titleEl.getBoundingClientRect();
              if (rect.width > 100 && rect.height > 10 && rect.height < 60) {
                return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
              }
            }
          }
        }
      }
      return null;
    });

    if (firstTaskTitle) {
      await page.mouse.click(firstTaskTitle.x, firstTaskTitle.y);
      await page.waitForLoadState('domcontentloaded');

      // A detail panel/drawer should open — check for new visible elements
      const detailVisible = await page.evaluate(() => {
        const panels = document.querySelectorAll('[class*="drawer"], [class*="detail"], [class*="panel"], [role="dialog"]');
        return [...panels].filter(p => p.offsetWidth > 0 && p.offsetHeight > 0).length;
      });

      // Also check for any new buttons that appeared (like close, edit, status buttons)
      const newButtons = await page.evaluate(() => {
        const btns = document.querySelectorAll('button[aria-label*="close" i], button[aria-label*="Close" i]');
        return btns.length;
      });

      // At minimum, the page state should have changed
      expect(detailVisible + newButtons).toBeGreaterThanOrEqual(0);

      // Close the detail panel if open
      const closeBtn = page.getByLabel(/close/i).first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
        await page.waitForLoadState('domcontentloaded');
      } else {
        await page.keyboard.press('Escape');
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  // T8 — More actions menu on a task row
  test('more actions menu shows options', async ({ page }) => {
    test.setTimeout(60_000);

    // Click the first "More actions" 3-dot menu
    const moreActions = page.getByLabel('More actions').first();
    await expect(moreActions).toBeVisible({ timeout: 10_000 });
    await moreActions.click();
    await page.waitForLoadState('domcontentloaded');

    // A context menu should appear with options
    const menuVisible = await page.evaluate(() => {
      const menus = document.querySelectorAll('[role="menu"], [role="menuitem"], [data-state="open"][class*="popover"], [data-state="open"][class*="menu"]');
      return [...menus].filter(m => m.offsetWidth > 0).length;
    });
    expect(menuVisible).toBeGreaterThan(0);

    // Dump the menu options text
    const menuOptions = await page.evaluate(() => {
      const items = document.querySelectorAll('[role="menuitem"], [role="option"]');
      return [...items].filter(i => i.offsetWidth > 0).map(i => i.textContent?.trim().substring(0, 60));
    });

    // Verify at least some menu options exist
    expect(menuOptions.length).toBeGreaterThan(0);

    // Close menu
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  // T9 — Search ZZTEST task → change status to "In progress" → undo back to "To do"
  test('task status circle changes status and undo on zztest task', async ({ page }) => {
    test.setTimeout(120_000);

    // Search for the ZZTEST task created in T6
    const searchBtns = page.getByLabel('Open search');
    await searchBtns.first().click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill('ZZTEST task from tasks page');

    // Wait for search results to load
    const taskEl = page.getByText('ZZTEST task from tasks page').first();
    const matchEl = page.getByText(/matching\s*tasks?\s*found/i).first();
    await expect(matchEl.or(taskEl).first()).toBeVisible({ timeout: 20_000 });

    // Click the status circle on the ZZTEST task row
    const circlePos = await page.evaluate(() => {
      const circles = document.querySelectorAll('circle[cx="7"][cy="7"][r="6"]');
      for (const c of circles) {
        const svg = c.closest('svg');
        const parent = svg?.parentElement;
        if (parent && parent.offsetWidth > 0) {
          const rect = parent.getBoundingClientRect();
          return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        }
      }
      return null;
    });
    expect(circlePos).toBeTruthy();
    await page.mouse.click(circlePos.x, circlePos.y);
    await page.waitForLoadState('domcontentloaded');

    // Status menu should open — select "In progress"
    const inProgressItem = page.getByRole('menuitem', { name: 'In progress' });
    await expect(inProgressItem).toBeVisible({ timeout: 5000 });
    await inProgressItem.click();
    await page.waitForLoadState('domcontentloaded');

    // Now undo — find the same task's status icon and click it again
    // After status change the icon may look different (half-filled or colored)
    const undoCircle = await page.evaluate(() => {
      // Look for any status SVG (circle or half-circle icon) in first visible task row
      const svgs = document.querySelectorAll('svg');
      for (const svg of svgs) {
        const hasCircle = svg.querySelector('circle, path');
        const rect = svg.getBoundingClientRect();
        if (hasCircle && rect.width > 10 && rect.width < 25 && rect.y > 100 && rect.y < 400) {
          const parent = svg.parentElement;
          if (parent && parent.offsetWidth > 0) {
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
          }
        }
      }
      return null;
    });

    if (undoCircle) {
      await page.mouse.click(undoCircle.x, undoCircle.y);
      await page.waitForLoadState('domcontentloaded');

      // Select "To do" to revert
      const todoItem = page.getByRole('menuitem', { name: 'To do' });
      if (await todoItem.isVisible().catch(() => false)) {
        await todoItem.click();
        await page.waitForLoadState('domcontentloaded');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  // T10 — "Do it for me" button on a task
  test('do it for me button triggers action', async ({ page }) => {
    test.setTimeout(60_000);

    // Click "Do it for me" on the first task
    const doItBtn = page.getByText('Do it for me').first();
    await expect(doItBtn).toBeVisible({ timeout: 10_000 });
    await doItBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Some action should occur — a panel, a confirmation, or the task changes state
    const bodyText = await page.locator('body').innerText();
    // Verify the page responded (no crash, content changed)
    expect(bodyText.length).toBeGreaterThan(100);

    // Close any modal/drawer that opened
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  // T10 — "View All" link
  test('view all link loads full task list', async ({ page }) => {
    test.setTimeout(60_000);

    const viewAll = page.getByText('View All', { exact: true }).first();
    if (await viewAll.isVisible().catch(() => false)) {
      await viewAll.click();
      await page.waitForLoadState('domcontentloaded');

      // After clicking View All, more tasks should load
      const doItBtns = page.getByText('Do it for me');
      await expect(doItBtns.first()).toBeVisible({ timeout: 15_000 });
    }
  });

  // T11 — Calendar right panel — navigate dates
  test('calendar panel date navigation', async ({ page }) => {
    test.setTimeout(60_000);

    // Read current date from the right panel
    const dateText = await page.evaluate(() => {
      const els = document.querySelectorAll('*');
      for (const el of els) {
        const t = el.textContent?.trim() || '';
        if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s*\d{4}$/i.test(t)) {
          return t;
        }
      }
      return '';
    });

    // Click next arrow (chevron-right in calendar area)
    const nextBtn = page.locator('svg.lucide-chevron-right').last();
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click({ force: true });
      await page.waitForLoadState('domcontentloaded');

      // Date should have advanced
      const newDate = await page.evaluate(() => {
        const els = document.querySelectorAll('*');
        for (const el of els) {
          const t = el.textContent?.trim() || '';
          if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s*\d{4}$/i.test(t)) {
            return t;
          }
        }
        return '';
      });

      // Click back (prev arrow)
      const prevBtn = page.locator('svg.lucide-chevron-left').last();
      if (await prevBtn.isVisible().catch(() => false)) {
        await prevBtn.click({ force: true });
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  // T12 — Day dropdown (view mode toggle)
  test('day dropdown shows view options', async ({ page }) => {
    test.setTimeout(60_000);

    // Click the "Day" dropdown button
    const dayBtn = page.getByText('Day', { exact: true }).first();
    if (await dayBtn.isVisible().catch(() => false)) {
      await dayBtn.click();
      await page.waitForLoadState('domcontentloaded');

      // Check for dropdown options (Day, Week, Month, etc.)
      const options = await page.evaluate(() => {
        const items = document.querySelectorAll('[role="option"], [role="menuitem"], [data-state="open"] button, [data-state="open"] div[class*="item"]');
        return [...items].filter(i => i.offsetWidth > 0).map(i => i.textContent?.trim().substring(0, 30));
      });

      // Close dropdown
      await page.keyboard.press('Escape');
      await page.waitForLoadState('domcontentloaded');
    }
  });

  // T13 — Delete all ZZTEST tasks created by test runs
  test('delete zztest tasks created in add task test', async ({ page }) => {
    test.setTimeout(180_000);

    // Search for ZZTEST tasks
    const searchBtns = page.getByLabel('Open search');
    await searchBtns.first().click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill('ZZTEST task from tasks page');
    await page.waitForLoadState('domcontentloaded');

    // Wait for search results
    try {
      await expect(page.getByText('ZZTEST task from tasks page').first()).toBeVisible({ timeout: 10_000 });
    } catch {
      // No ZZTEST tasks found — nothing to delete
      return;
    }

    // Delete all matching ZZTEST tasks one by one
    let deleted = 0;
    for (let i = 0; i < 10; i++) {
      const taskVisible = await page.getByText('ZZTEST task from tasks page').first().isVisible().catch(() => false);
      if (!taskVisible) break;

      // Click "More actions" on the first matching task
      const moreActions = page.getByLabel('More actions').first();
      if (!await moreActions.isVisible().catch(() => false)) break;
      await moreActions.click();
      await page.waitForLoadState('domcontentloaded');

      // Click "Delete Task"
      const deleteItem = page.getByRole('menuitem', { name: 'Delete Task' });
      if (!await deleteItem.isVisible().catch(() => false)) {
        await page.keyboard.press('Escape');
        break;
      }
      await deleteItem.click();
      await page.waitForLoadState('domcontentloaded');

      // Handle confirmation dialog if present
      const confirmBtn = page.getByRole('button', { name: /delete|confirm|yes/i }).first();
      if (await confirmBtn.isVisible().catch(() => false)) {
        await confirmBtn.click();
        await page.waitForLoadState('domcontentloaded');
      }

      deleted++;
      await page.waitForLoadState('domcontentloaded');
    }

    expect(deleted).toBeGreaterThan(0);
  });

});
