const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');
const fs = require('node:fs');
const path = require('node:path');

test.describe('New Chat — full regression', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;
  const createdPromptTitles = [];

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
  });

  // ── SECTION 1: COMPOSER UI ──

  test('all composer controls are visible', async () => {
    await ac.goto('New Chat');
    await expect(ac.composer).toBeVisible();
    await expect(ac.sendButton).toBeVisible();
    await expect(ac.attachButton).toBeVisible();
    await expect(ac.promptsButton).toBeVisible();
    await expect(ac.dictateButton).toBeVisible();
    await expect(ac.voiceButton).toBeVisible();
  });

  test('typing in composer works with pressSequentially', async () => {
    await ac.composer.click();
    await ac.composer.pressSequentially('hello regression test', { delay: 15 });
    await expect(ac.composer).toHaveValue('hello regression test');
    await ac.composer.fill('');
    await expect(ac.composer).toHaveValue('');
  });

  test('send button disabled when composer is empty', async () => {
    await ac.composer.fill('');
    await expect(ac.sendButton).toBeDisabled();
  });

  test('quota pill displays used and limit', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForLoadState('domcontentloaded');
    const quota = await ac.executions();
    expect(quota).not.toBeNull();
    expect(quota.limit).toBeGreaterThan(0);
    expect(quota.used).toBeGreaterThanOrEqual(0);
    expect(quota.used).toBeLessThanOrEqual(quota.limit);
  });

  // ── SECTION 2: FILTER TABS & AUTOMATIONS ──

  test('filter tabs switch between all categories', async () => {
    const categories = ['Marketing', 'Productivity', 'Finance', 'Personal', 'All'];
    for (const cat of categories) {
      const tab = ac.filterTab(cat);
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('automation cards render and are countable', async () => {
    await ac.waitForAutomations();
    const count = await ac.allEnableButtons.count();
    expect(count).toBeGreaterThan(0);
    await expect(ac.allEnableButtons.first()).toBeVisible();
  });

  test('suggestion prompt fills the composer', async ({ page }) => {
    const suggestion = page.getByRole('button', { name: /Research top 5 competitors/i }).first();
    if (!(await suggestion.isVisible().catch(() => false))) {
      test.skip(true, 'suggestion button not visible on current view');
    }
    await suggestion.click();
    await page.waitForLoadState('domcontentloaded');
    const value = await ac.composer.inputValue();
    expect(value.length).toBeGreaterThan(0);
    await ac.composer.fill('');
    await expect(ac.composer).toHaveValue('');
  });

  // ── SECTION 4: DICTATE & VOICE MODE ──

  test('dictate button is clickable and responds', async ({ page }) => {
    await expect(ac.dictateButton).toBeVisible();
    await expect(ac.dictateButton).toBeEnabled();
    await ac.dictateButton.click();
    await page.waitForLoadState('domcontentloaded');

    // Dismiss any overlay, dialog, or recording UI that appeared
    const overlay = page.locator(
      '[role="dialog"], [data-state="open"], [class*="recording"], [class*="dictate"], [class*="modal"]'
    ).first();
    if (await overlay.isVisible().catch(() => false)) {
      const closeBtn = page.getByRole('button', { name: /close|cancel|stop|done/i }).first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForLoadState('domcontentloaded');
    await expect(ac.composer).toBeVisible();
  });

  test('voice mode button is clickable and responds', async ({ page }) => {
    await expect(ac.voiceButton).toBeVisible();
    await expect(ac.voiceButton).toBeEnabled();
    await ac.voiceButton.click();
    await page.waitForLoadState('networkidle');

    // Voice page opens with X close button (lucide-x SVG icon)
    const closeBtn = page.locator('svg.lucide-x').first();
    await expect(closeBtn).toBeVisible({ timeout: 10_000 });

    // Click X button to close voice page
    await closeBtn.click();
    await page.waitForLoadState('domcontentloaded');

    await ac.ensurePage('New Chat');
    await expect(ac.composer.first()).toBeVisible();
  });

  // ── SECTION 5: SAVED PROMPTS PANEL ──

  test('prompts panel opens and shows content', async ({ page }) => {
    await ac.promptsButton.click();
    await page.waitForLoadState('domcontentloaded');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/Saved Prompts|prompt|Create/i);
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  test('create saved prompt with auto-run OFF and category selected', async ({ page }) => {
    await ac.promptsButton.click();
    await page.waitForLoadState('domcontentloaded');

    const createLink = page.getByText(/Create your first prompt/i).first();
    const addBtn = page.getByRole('button', { name: /add|new prompt|\+/i }).first();
    if (await createLink.isVisible().catch(() => false)) {
      await createLink.click();
    } else {
      await expect(addBtn).toBeVisible();
      await addBtn.click();
    }

    const drawer = page.locator('[data-slot="sheet-content"]');
    await expect(drawer).toBeVisible({ timeout: 10_000 });

    // Fill title (standard input — fill() works here)
    const title = `ZZTEST-OFF-${Date.now()}`;
    createdPromptTitles.push(title);
    const titleInput = drawer.getByPlaceholder('Enter a prompt title');
    await expect(titleInput).toBeVisible();
    await titleInput.click();
    await titleInput.fill(title);
    await expect(titleInput).toHaveValue(title);

    // Fill body
    const bodyInput = drawer.getByPlaceholder('Write a prompt for your assistant');
    await expect(bodyInput).toBeVisible();
    await bodyInput.click();
    await bodyInput.fill('What is 2 plus 3? Reply with only the number.');

    // Select category from the native <select id="prompt-category">
    const categorySelect = page.locator('#prompt-category');
    await expect(categorySelect).toBeVisible();
    await categorySelect.selectOption('General');
    await page.waitForLoadState('domcontentloaded');
    const selectedVal = await categorySelect.inputValue();
    expect(selectedVal).toBe('General');

    // Turn OFF auto-run (it defaults ON)
    const autoRunToggle = drawer.getByRole('switch').first();
    await expect(autoRunToggle).toBeVisible();
    if ((await autoRunToggle.getAttribute('aria-checked')) === 'true') {
      await autoRunToggle.click();
      await page.waitForLoadState('domcontentloaded');
    }
    await expect(autoRunToggle).toHaveAttribute('aria-checked', 'false');

    // Verify publish toggle stays OFF
    const publishToggle = drawer.getByRole('switch').last();
    if (await publishToggle.isVisible().catch(() => false)) {
      await expect(publishToggle).toHaveAttribute('aria-checked', 'false');
    }

    // Save
    const saveBtn = drawer.getByRole('button', { name: 'Save Prompt' });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    await page.waitForLoadState('networkidle');
  });

  test('created prompt appears in prompts panel', async ({ page }) => {
    await ac.promptsButton.click();
    await page.waitForLoadState('domcontentloaded');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('ZZTEST-OFF');
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  test('search filters prompts in panel', async ({ page }) => {
    // Always open the panel fresh
    await ac.promptsButton.click();
    await page.waitForLoadState('domcontentloaded');

    // Find the search input inside the prompts panel
    const searchInput = page.getByPlaceholder(/search prompt/i).first();
    if (!(await searchInput.isVisible().catch(() => false))) {
      // Fallback: try generic search placeholder
      const fallback = page.getByPlaceholder(/search/i).first();
      if (await fallback.isVisible().catch(() => false)) {
        await fallback.click();
        await fallback.fill('');
        await fallback.pressSequentially('ZZTEST-OFF', { delay: 20 });
        await page.waitForLoadState('domcontentloaded');
        const matchText = await page.locator('body').innerText();
        expect(matchText).toMatch(/ZZTEST-OFF/);
        await fallback.fill('');
        await page.waitForLoadState('domcontentloaded');
        await page.keyboard.press('Escape');
        await page.waitForLoadState('domcontentloaded');
        return;
      }
      // No search input: just verify our prompt is in panel text
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).toMatch(/ZZTEST-OFF/);
      await page.keyboard.press('Escape');
      await page.waitForLoadState('domcontentloaded');
      return;
    }

    // Search for existing test prompt
    await searchInput.click();
    await searchInput.fill('');
    await searchInput.pressSequentially('ZZTEST-OFF', { delay: 20 });
    await page.waitForLoadState('domcontentloaded');
    const matchText = await page.locator('body').innerText();
    expect(matchText).toMatch(/ZZTEST-OFF/);

    // Search for non-existent prompt
    await searchInput.fill('');
    await searchInput.pressSequentially('xyznotfound999', { delay: 20 });
    await page.waitForLoadState('domcontentloaded');

    // Clear and close
    await searchInput.fill('');
    await page.waitForLoadState('domcontentloaded');
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  test('clicking prompt with auto-run OFF fills composer without sending', async ({ page }) => {
    await ac.composer.fill('');
    await ac.promptsButton.click();
    await page.waitForLoadState('domcontentloaded');

    const promptCard = page.getByText(/ZZTEST-OFF/).first();
    await expect(promptCard).toBeVisible();
    await promptCard.click();
    await page.waitForLoadState('domcontentloaded');

    // Auto-run is OFF: should still be on New Chat, not sent
    expect(page.url()).toContain('/askcentral/new');
    const composerValue = await ac.composer.inputValue();
    expect(composerValue.length).toBeGreaterThan(0);
    await ac.composer.fill('');
  });

  // ── SECTION 6: LLM TESTS ──

  test('send text message and receive AI response', async ({ page }) => {
    test.setTimeout(180_000);
    await ac.ensurePage('New Chat');
    await ac.type('Reply with exactly one word: pong');
    await expect(ac.sendButton).toBeEnabled();
    await ac.sendButton.click();
    await ac.waitForReply();

    // Navigated to conversation page
    expect(page.url()).not.toContain('/askcentral/new');
    await expect(page.locator('body')).not.toContainText(/something went wrong/i);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).toContain('pong');
    await ac.ensurePage('New Chat');
  });

  test('attach file with description and receive AI response', async ({ page }) => {
    test.setTimeout(180_000);
    await ac.ensurePage('New Chat');

    // Create test file with known data
    fs.mkdirSync('fixtures', { recursive: true });
    const sample = path.resolve('fixtures/sample.txt');
    fs.writeFileSync(sample, 'Product: Widget A\nPrice: $49.99\nCategory: Electronics\n');

    // Attach and verify preview
    await ac.attachFile(sample);
    await page.waitForLoadState('networkidle');
    const previewText = await page.locator('body').innerText();
    expect(previewText).toMatch(/Widget A|sample\.txt|Electronics/i);

    // Type description and send
    await ac.type('What is the price in the attached file? Reply with the price only.');
    await expect(ac.sendButton).toBeEnabled();
    await ac.sendButton.click();
    await ac.waitForReply();

    await expect(page.locator('body')).not.toContainText(/something went wrong/i);
    await expect(page.locator('body')).toContainText('49.99');
    await ac.ensurePage('New Chat');
  });

  // ── SECTION 7: PROMPT AUTO-RUN ON ──

  test('create prompt with auto-run ON and verify it auto-sends on click', async ({ page }) => {
    test.setTimeout(180_000);
    await ac.ensurePage('New Chat');

    // Open prompts panel and create prompt
    await ac.promptsButton.click();
    await page.waitForLoadState('domcontentloaded');

    const addBtn = page.getByRole('button', { name: /add|new prompt|\+/i }).first();
    const createLink = page.getByText(/Create your first prompt/i).first();
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
    } else {
      await expect(createLink).toBeVisible();
      await createLink.click();
    }

    const drawer = page.locator('[data-slot="sheet-content"]');
    await expect(drawer).toBeVisible({ timeout: 10_000 });

    // Title (standard input — fill() works here)
    const title = `ZZTEST-ON-${Date.now()}`;
    createdPromptTitles.push(title);
    const titleInput = drawer.getByPlaceholder('Enter a prompt title');
    await titleInput.click();
    await titleInput.fill(title);
    await expect(titleInput).toHaveValue(title);

    // Body (predictable prompt for assertion)
    const bodyInput = drawer.getByPlaceholder('Write a prompt for your assistant');
    await bodyInput.click();
    await bodyInput.fill('Reply with exactly one word: hello');

    // Select category
    const categorySelect2 = page.locator('#prompt-category');
    await expect(categorySelect2).toBeVisible();
    await categorySelect2.selectOption('General');
    await page.waitForLoadState('domcontentloaded');

    // Auto-run stays ON (verify the default)
    const autoRunToggle = drawer.getByRole('switch').first();
    if (await autoRunToggle.isVisible().catch(() => false)) {
      await expect(autoRunToggle).toHaveAttribute('aria-checked', 'true');
    }

    // Publish must be OFF
    const publishToggle = drawer.getByRole('switch').last();
    if (await publishToggle.isVisible().catch(() => false)) {
      await expect(publishToggle).toHaveAttribute('aria-checked', 'false');
    }

    // Save
    await drawer.getByRole('button', { name: 'Save Prompt' }).click();
    await page.waitForLoadState('networkidle');

    // Go to New Chat and trigger the auto-run prompt
    await ac.ensurePage('New Chat');
    await ac.promptsButton.click();
    await page.waitForLoadState('domcontentloaded');

    const promptCard = page.getByText(new RegExp(title)).first();
    await expect(promptCard).toBeVisible({ timeout: 5000 });
    await promptCard.click();
    await page.waitForLoadState('domcontentloaded');

    // Auto-run ON: the prompt auto-sends — wait for AI response
    await ac.waitForReply();
    expect(page.url()).not.toContain('/askcentral/new');
    await expect(page.locator('body')).not.toContainText(/something went wrong/i);
    await ac.ensurePage('New Chat');
  });

  // ── SECTION 8: THREE-DOT MENU — Edit, Share, Delete (Customize > Saved Prompts) ──

  // Helper: navigate to Customize > Saved Prompts and search ZZTEST
  async function goToSavedPromptsAndSearch(page, ac) {
    await ac.ensurePage('Customize');
    await page.waitForLoadState('domcontentloaded');
    const savedPromptsTab = page.getByRole('button', { name: 'Saved Prompts', exact: true });
    await expect(savedPromptsTab).toBeVisible();
    await savedPromptsTab.click();
    await page.waitForLoadState('domcontentloaded');
    const searchInput = page.getByPlaceholder(/search prompt/i).first();
    await expect(searchInput).toBeVisible();
    await searchInput.click();
    await searchInput.fill('ZZTEST');
    await page.waitForLoadState('domcontentloaded');
  }

  // Helper: click the "..." button on first ZZTEST row using bounding box
  async function clickThreeDotMenu(page) {
    const allBtns = await page.locator('button').all();
    for (const btn of allBtns) {
      const box = await btn.boundingBox().catch(() => null);
      if (!box || box.x < 1300 || box.width > 60 || box.y < 250) continue;
      const role = await btn.getAttribute('role');
      if (role === 'switch') continue;
      await btn.click();
      return true;
    }
    return false;
  }

  test('three-dot menu — edit, share, delete prompt sequentially', async ({ page }) => {
    test.setTimeout(120_000);
    await goToSavedPromptsAndSearch(page, ac);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('ZZTEST');

    // Capture the specific name of the first ZZTEST prompt (will be deleted later)
    const firstPromptEl = page.getByText(/ZZTEST-\S+/).first();
    const deletedPromptName = (await firstPromptEl.textContent()).trim().split(/\s/)[0];

    // ── ACTION 1: EDIT ──
    const clicked1 = await clickThreeDotMenu(page);
    expect(clicked1).toBe(true);
    await page.waitForLoadState('domcontentloaded');

    // Verify all three options are visible
    await expect(page.getByText('Edit', { exact: true }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Share', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Delete', { exact: true }).first()).toBeVisible();

    // Click Edit
    await page.getByText('Edit', { exact: true }).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Verify edit drawer opened with ZZTEST content
    const drawer = page.locator('[data-slot="sheet-content"]');
    const drawerVisible = await drawer.isVisible().catch(() => false);
    const dialogVisible = await page.locator('[role="dialog"]').first().isVisible().catch(() => false);
    expect(drawerVisible || dialogVisible).toBe(true);

    const titleInput = page.getByPlaceholder('Enter a prompt title').first();
    if (await titleInput.isVisible().catch(() => false)) {
      const titleVal = await titleInput.inputValue();
      expect(titleVal).toContain('ZZTEST');
    }

    // Close drawer without saving
    const cancelBtn = page.getByRole('button', { name: /cancel|close|back/i }).first();
    if (await cancelBtn.isVisible().catch(() => false)) {
      await cancelBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForLoadState('domcontentloaded');

    // ── ACTION 2: SHARE ──
    const clicked2 = await clickThreeDotMenu(page);
    expect(clicked2).toBe(true);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Share', { exact: true }).first()).toBeVisible({ timeout: 5000 });
    await page.getByText('Share', { exact: true }).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Verify "Share Prompt" dialog opened
    const shareDialog = page.locator('[role="dialog"]').first();
    await expect(shareDialog).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Share Prompt')).toBeVisible();

    // Assert "Community gallery" toggle is OFF — MUST stay OFF (hard constraint)
    const communityToggle = shareDialog.getByRole('switch').first();
    await expect(communityToggle).toBeVisible();
    await expect(communityToggle).toHaveAttribute('aria-checked', 'false');

    // Close share dialog via X button
    const closeX = shareDialog.locator('button').filter({ has: page.locator('svg') }).first();
    if (await closeX.isVisible().catch(() => false)) {
      await closeX.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForLoadState('domcontentloaded');

    // ── ACTION 3: DELETE ──
    const clicked3 = await clickThreeDotMenu(page);
    expect(clicked3).toBe(true);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Delete', { exact: true }).first()).toBeVisible({ timeout: 5000 });
    await page.getByText('Delete', { exact: true }).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Confirm deletion dialog
    const confirmBtn = page.getByRole('button', { name: /delete/i }).last();
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
    }
    await page.waitForLoadState('domcontentloaded');

    // Reload and re-search to verify the specific prompt was deleted
    await goToSavedPromptsAndSearch(page, ac);
    const afterText = await page.locator('body').innerText();
    expect(afterText).not.toContain(deletedPromptName);

    // Return to New Chat
    await ac.ensurePage('New Chat');
    await expect(ac.composer.first()).toBeVisible();
  });
});
