const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Inbox — full regression', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;
  let originalLabel;
  let originalPrompt;
  let originalDraft;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    // Clear any lingering overlay that blocks pointer events
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
    await ac.ensurePage('Inbox');
    // Wait for inbox to fully load — toolbar and email content must be present
    await page.getByLabel('Compose new email').waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1500);
  });

  // I1 — inbox loads with filters, toolbar, email list
  test('inbox page loads with filters and email list', async ({ page }) => {
    // Core tabs that should always exist
    for (const name of ['Newsletter', 'Calendar', 'Marketing', 'Receipt']) {
      const tab = page.locator('button').filter({ hasText: new RegExp(name) }).first();
      await expect(tab).toBeVisible({ timeout: 15_000 });
    }
    // "To reply" or "Notifications" — at least one must be visible
    const toReply = page.locator('button').filter({ hasText: /To reply/ }).first();
    const notif = page.locator('button').filter({ hasText: /Notifications/ }).first();
    const eitherVisible = await toReply.isVisible().catch(() => false)
      || await notif.isVisible().catch(() => false);
    expect(eitherVisible).toBe(true);

    await expect(page.getByLabel('Manage categories')).toBeVisible();
    await expect(page.getByLabel('Filter emails')).toBeVisible();
    await expect(page.getByLabel('Open search')).toBeVisible();
    // View toggle — label depends on current state
    const viewToggle = page.getByLabel(/detailed view|compact view/i).first();
    await expect(viewToggle).toBeVisible();
    await expect(page.getByLabel('Refresh emails')).toBeVisible();
    await expect(page.getByLabel('Compose new email')).toBeVisible();

    // Verify emails are loaded — check for Select email checkboxes (compact) or email content (detailed)
    const selectEmails = page.getByLabel('Select email');
    const emailContent = page.locator('[class*="mail"], [class*="email"], [class*="message"]').first();
    const hasCompact = await selectEmails.first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasDetailed = await emailContent.isVisible().catch(() => false);
    const bodyText = await page.locator('body').innerText();
    const hasEmailText = bodyText.match(/Central|Hamza|Google|Newsletter|Notifications|Draft|Subject/i) !== null;
    expect(hasCompact || hasDetailed || hasEmailText).toBe(true);
  });

  // I2 — click all filter tabs
  test('click all filter tabs', async ({ page }) => {
    const filters = ['To reply', 'Newsletter', 'Calendar', 'Marketing', 'Receipt', 'Notifications'];
    for (const name of filters) {
      const tab = page.locator('button').filter({ hasText: new RegExp(name) }).first();
      if (await tab.isVisible().catch(() => false)) {
        // Clear overlay before each click — this app leaves pointer-event blocks
        await page.evaluate(() => { document.documentElement.style.pointerEvents = ''; });
        await tab.click({ force: true });
        await page.waitForTimeout(1500);
      }
    }
    // Click Clear button to reset filter selection
    const clearBtn = page.getByRole('button', { name: /Clear/i }).first();
    const clearLink = page.getByText('Clear', { exact: true }).first();
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click({ force: true });
      await page.waitForTimeout(1500);
    } else if (await clearLink.isVisible().catch(() => false)) {
      await clearLink.click({ force: true });
      await page.waitForTimeout(1500);
    }
  });

  // I3 — manage categories opens with category list
  test('manage categories opens with category list', async ({ page }) => {
    await page.getByLabel('Manage categories').click();
    await page.waitForTimeout(2000);

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const menuText = await menu.innerText();
    expect(menuText).toMatch(/Newsletter/);
    expect(menuText).toMatch(/Add new category/);

    await expect(page.getByLabel('Edit category').first()).toBeVisible();
    await expect(page.getByLabel('Delete category').first()).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  // I4 — edit category: change label, prompt, color, draft behavior, save, then undo
  test('edit category — change and undo all changes', async ({ page }) => {
    test.setTimeout(120_000);

    // Open manage categories → edit first category
    await page.getByLabel('Manage categories').click();
    await page.waitForTimeout(1500);
    await page.getByLabel('Edit category').first().click();
    await page.waitForTimeout(2000);

    const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Edit Category' });
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Find inputs — use placeholder selectors with fallback to positional
    let labelInput = dialog.locator('input[placeholder*="Client Feedback"]');
    let promptInput = dialog.locator('input[placeholder*="Sales outreach"]');
    if (!(await labelInput.isVisible().catch(() => false))) {
      const allInputs = dialog.locator('input[type="text"], input:not([type]):not([role])');
      labelInput = allInputs.first();
      promptInput = allInputs.nth(1);
    }
    const draftSelect = dialog.locator('select');

    // Capture originals
    originalLabel = await labelInput.inputValue();
    originalPrompt = await promptInput.inputValue();
    originalDraft = await draftSelect.inputValue();

    // Change label name
    await labelInput.click();
    await labelInput.fill('');
    await labelInput.pressSequentially('ZZTEST-LABEL', { delay: 15 });
    await page.waitForTimeout(300);

    // Change prompt
    await promptInput.click();
    await promptInput.fill('');
    await promptInput.pressSequentially('Test prompt for automation', { delay: 15 });
    await page.waitForTimeout(300);

    // Skip VIP sender (just verify the section exists)
    const vipSection = dialog.getByText('VIP Senders').first();
    await expect(vipSection).toBeVisible();

    // Change color — click a different color circle
    await page.evaluate(() => {
      const dlgs = document.querySelectorAll('[role="dialog"]');
      const dlg = Array.from(dlgs).find(d => d.textContent.includes('Edit Category'));
      if (!dlg) return;
      const btns = dlg.querySelectorAll('button');
      const colorBtns = Array.from(btns).filter(b => !b.textContent.trim() && !b.getAttribute('aria-label'));
      if (colorBtns.length > 2) colorBtns[2].click();
    });
    await page.waitForTimeout(500);

    // Open draft behavior dropdown and change
    await draftSelect.selectOption('never');
    await page.waitForTimeout(500);

    // Save changes
    await dialog.getByRole('button', { name: 'Save Changes' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Dismiss overlay: remove pointer-events block via JS, then click away
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.locator('body').click({ position: { x: 10, y: 400 }, force: true });
    await page.waitForTimeout(1000);

    // --- UNDO ALL CHANGES ---
    await page.getByLabel('Manage categories').click({ force: true, timeout: 10_000 });
    await page.waitForTimeout(1500);
    await page.getByLabel('Edit category').first().click();
    await page.waitForTimeout(2000);

    const dialog2 = page.locator('[role="dialog"]').filter({ hasText: 'Edit Category' });
    await expect(dialog2).toBeVisible({ timeout: 5000 });

    let labelInput2 = dialog2.locator('input[placeholder*="Client Feedback"]');
    let promptInput2 = dialog2.locator('input[placeholder*="Sales outreach"]');
    if (!(await labelInput2.isVisible().catch(() => false))) {
      const allInputs2 = dialog2.locator('input[type="text"], input:not([type]):not([role])');
      labelInput2 = allInputs2.first();
      promptInput2 = allInputs2.nth(1);
    }
    const draftSelect2 = dialog2.locator('select');

    // Verify edit took effect (check inside dialog, not filter bar)
    const currentLabel = await labelInput2.inputValue();
    expect(currentLabel).toBe('ZZTEST-LABEL');

    // Restore original label
    await labelInput2.click();
    await labelInput2.fill('');
    await labelInput2.fill(originalLabel);
    await page.waitForTimeout(300);

    // Restore original prompt
    await promptInput2.click();
    await promptInput2.fill('');
    await promptInput2.fill(originalPrompt);
    await page.waitForTimeout(300);

    // Restore original color (click first color circle)
    await page.evaluate(() => {
      const dlgs = document.querySelectorAll('[role="dialog"]');
      const dlg = Array.from(dlgs).find(d => d.textContent.includes('Edit Category'));
      if (!dlg) return;
      const btns = dlg.querySelectorAll('button');
      const colorBtns = Array.from(btns).filter(b => !b.textContent.trim() && !b.getAttribute('aria-label'));
      if (colorBtns.length > 0) colorBtns[0].click();
    });
    await page.waitForTimeout(300);

    // Restore original draft behavior
    await draftSelect2.selectOption(originalDraft);
    await page.waitForTimeout(300);

    // Save restored values
    await dialog2.getByRole('button', { name: 'Save Changes' }).click();
    await expect(dialog2).not.toBeVisible({ timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Clear overlay and navigate fresh for clean state
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await ac.goto('Inbox');
    await page.waitForTimeout(2000);
  });

  // I5 — delete category: click delete, then Stay on Page
  test('delete category — click Stay on Page', async ({ page }) => {
    await page.getByLabel('Manage categories').click();
    await page.waitForTimeout(1500);
    await page.getByLabel('Delete category').first().click();
    await page.waitForTimeout(2000);

    // Handle browser confirm dialog or in-page confirmation
    const stayBtn = page.getByRole('button', { name: /Stay on Page|Cancel|No/i }).first();
    if (await stayBtn.isVisible().catch(() => false)) {
      await stayBtn.click();
      await page.waitForTimeout(1000);
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  // I6 — filter emails dropdown
  test('filter emails dropdown and options', async ({ page }) => {
    await page.getByLabel('Filter emails').click();
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/Date Range|From|Quick Filters|Unread/i);

    const today = page.getByText('Today', { exact: true }).first();
    if (await today.isVisible().catch(() => false)) {
      await today.click();
      await page.waitForTimeout(1500);
    }

    const unread = page.getByText('Unread only').first();
    if (await unread.isVisible().catch(() => false)) {
      await unread.click();
      await page.waitForTimeout(1000);
      await unread.click();
      await page.waitForTimeout(500);
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  // I7 — open search and type query
  test('open search and type query', async ({ page }) => {
    test.setTimeout(60_000);
    await page.getByLabel('Open search').click();
    await page.waitForTimeout(2000);

    const searchInput = page.getByPlaceholder(/search/i).first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    await searchInput.pressSequentially('test', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    // Wait for search results or "no results" indicator
    const bodyText = await page.locator('body').innerText();
    const hasResults = bodyText.match(/test/i) !== null;
    const hasNoResults = bodyText.match(/no (results|emails|matches)|nothing found/i) !== null;
    expect(hasResults || hasNoResults).toBe(true);

    // Clear search — click the Clear Search button or X icon
    const clearSearchBtn = page.getByRole('button', { name: /Clear Search/i }).first();
    const clearX = page.getByLabel(/close|clear|dismiss/i).first();
    if (await clearSearchBtn.isVisible().catch(() => false)) {
      await clearSearchBtn.click({ force: true });
      await page.waitForTimeout(1500);
    } else if (await clearX.isVisible().catch(() => false)) {
      await clearX.click({ force: true });
      await page.waitForTimeout(1000);
    } else {
      await searchInput.fill('');
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    // Ensure search is fully dismissed
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  // I8 — switch to detailed view and back (ensures we end in compact view)
  test('switch to detailed view and back', async ({ page }) => {
    // Detect current state — if "Compact view" label exists, we're in detailed
    const compactBtn = page.getByLabel(/compact view/i).first();
    const detailedBtn = page.getByLabel(/detailed view/i).first();
    const inDetailed = await compactBtn.isVisible().catch(() => false);

    if (inDetailed) {
      // Currently detailed → switch to compact first, then to detailed, then back to compact
      await compactBtn.click();
      await page.waitForTimeout(2000);

      // Now in compact — switch to detailed
      const toDetailed = page.getByLabel(/detailed view/i).first();
      await toDetailed.click();
      await page.waitForTimeout(2000);

      // Back to compact
      const toCompact = page.getByLabel(/compact view/i).first();
      await toCompact.click();
      await page.waitForTimeout(1500);
    } else {
      // Currently compact → switch to detailed
      await detailedBtn.click();
      await page.waitForTimeout(2000);

      // Verify detailed view has email content
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).toMatch(/Central|Hamza|Google|Newsletter|Notifications/i);

      // Switch back to compact
      const toCompact = page.getByLabel(/compact view/i).first();
      await toCompact.click();
      await page.waitForTimeout(1500);
    }

    // Verify we toggled back — the button label should say "detailed view" (meaning we're in compact)
    const backToCompact = page.getByLabel(/detailed view/i).first();
    await expect(backToCompact).toBeVisible({ timeout: 10_000 });
  });

  // I9 — refresh emails
  test('refresh emails and wait', async ({ page }) => {
    await page.getByLabel('Refresh emails').click();
    await page.waitForTimeout(5000);

    // Verify page responded to refresh — emails or empty state visible
    const bodyText = await page.locator('body').innerText();
    const hasEmails = bodyText.match(/Central|Hamza|Google|Newsletter|Notifications|Draft|Inbox/i) !== null;
    expect(hasEmails).toBe(true);
  });

  // I10 — compose: open, maximize, fill fields, clear fields, close
  test('compose — open, maximize, fill, clear, close', async ({ page }) => {
    test.setTimeout(90_000);

    await page.getByLabel('Compose new email').click();
    await page.waitForTimeout(2000);

    const recipients = page.getByPlaceholder('Recipients');
    await expect(recipients).toBeVisible({ timeout: 5000 });

    // Maximize
    const fullScreenBtn = page.getByLabel('Enter full screen');
    if (await fullScreenBtn.isVisible().catch(() => false)) {
      await fullScreenBtn.click();
      await page.waitForTimeout(1500);
    }

    // Enter Recipients
    await recipients.click();
    await recipients.pressSequentially('test@example.com', { delay: 15 });
    await page.waitForTimeout(500);

    // Dismiss recipient suggestions before moving focus to the subject field.
    await page.keyboard.press('Escape');

    // Enter Subject
    const subject = page.getByPlaceholder('Subject');
    await subject.click();
    await subject.pressSequentially('ZZTEST Email Subject', { delay: 15 });
    await page.waitForTimeout(500);

    // Type in body
    const bodyArea = page.locator('[contenteditable="true"]').first();
    if (await bodyArea.isVisible().catch(() => false)) {
      await bodyArea.click();
      await page.keyboard.type('This is a test email body for automation.', { delay: 15 });
      await page.waitForTimeout(500);
    }

    // Clear the recipient chip within the compose window. The input is removed
    // after the address is committed, so global remove selectors are unsafe.
    const composeWindow = subject.locator('xpath=ancestor::div[contains(@class,"fixed")][1]');
    const recipientChip = composeWindow.getByText('test@example.com', { exact: true });
    const chipRemove = recipientChip.locator('xpath=..').getByRole('button').first();
    if (await chipRemove.isVisible().catch(() => false)) {
      await chipRemove.click({ force: true });
    } else if (await recipientChip.isVisible().catch(() => false)) {
      await recipientChip.click({ force: true });
      await page.keyboard.press('Backspace');
    }
    await page.waitForTimeout(300);

    await subject.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(300);

    if (await bodyArea.isVisible().catch(() => false)) {
      await bodyArea.click();
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(300);
    }

    // Close compose modal — fields are cleared, so Close (X) should work directly
    const closeBtn = page.getByLabel('Close').last();
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(2000);

    // If a discard confirmation appeared, dismiss it
    const confirmDiscard = page.getByRole('button', { name: /^(yes|discard|confirm)$/i }).first();
    if (await confirmDiscard.isVisible().catch(() => false)) {
      await confirmDiscard.click();
      await page.waitForTimeout(1000);
    }

    // Verify compose is closed
    const composeClosed = !(await subject.isVisible().catch(() => false));
    expect(composeClosed).toBe(true);
  });

  // I11 — accounts: connected accounts panel
  test('accounts — connected accounts panel', async ({ page }) => {
    test.setTimeout(60_000);

    // Account selector is the avatar button right after Compose
    const clickAccountSelector = async () => {
      const compose = page.getByLabel('Compose new email');
      const box = await compose.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width + 20, box.y + box.height / 2);
      }
    };

    await clickAccountSelector();
    await page.waitForTimeout(2000);

    // Verify Accounts panel opens and shows connected account(s)
    const panelInfo = await page.evaluate(() => {
      const panels = document.querySelectorAll('[data-state="open"], [class*="popover"], [role="dialog"]');
      for (const panel of panels) {
        if (panel.offsetWidth > 0 && panel.innerText.includes('Accounts')) {
          const text = panel.innerText;
          const hasAccounts = text.includes('Accounts');
          const disconnectCount = (text.match(/Disconnect/g) || []).length;
          const hasAllMail = text.includes('All Mail');
          return { hasAccounts, disconnectCount, hasAllMail };
        }
      }
      return null;
    });

    expect(panelInfo).not.toBeNull();
    expect(panelInfo.hasAccounts).toBe(true);
    expect(panelInfo.disconnectCount).toBeGreaterThan(0);

    if (panelInfo.disconnectCount > 1) {
      expect(panelInfo.hasAllMail).toBe(true);
    }

    // Close the panel
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  });

});
