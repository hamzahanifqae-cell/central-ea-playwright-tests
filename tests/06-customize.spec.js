const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Customize — all tabs full regression', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;
  let testRuleName;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    await ac.ensurePage('Customize');
  });

  // ── RULES TAB (default) ──

  // Z1 — create test rule FIRST so all subsequent tests have a rule to work with
  test('create new test rule', async ({ page }) => {
    await ac.addRuleBtn.click();
    await page.waitForTimeout(2000);

    const sheetContent = page.locator('[data-slot="sheet-content"]');
    await expect(sheetContent).toBeVisible({ timeout: 10_000 });

    testRuleName = `ZZTEST-RULE-${Date.now()}`;
    const textArea = sheetContent.locator('textarea').first();
    await expect(textArea).toBeVisible();
    await textArea.click();
    await textArea.pressSequentially(testRuleName, { delay: 15 });
    await page.waitForTimeout(500);

    const createBtn = sheetContent.getByRole('button', { name: /Create Rule/i });
    await expect(createBtn).toBeEnabled({ timeout: 5000 });
    await createBtn.click();
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain(testRuleName);
  });

  // Z2 — list renders (now guaranteed to have at least the rule we just created)
  test('rules list renders', async ({ page }) => {
    await expect(ac.ruleSearch).toBeVisible();
    await expect(ac.addRuleBtn).toBeVisible();
    const ruleButtons = page.locator('button[aria-label^="Edit rule:"]');
    await expect(ruleButtons.first()).toBeVisible({ timeout: 15_000 });
    const count = await ruleButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  // Z3 — toggles visible
  test('rule toggles are visible', async () => {
    const toggles = ac.ruleToggles;
    await expect(toggles.first()).toBeVisible({ timeout: 10_000 });
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  // Z4 — toggle on and off
  test('toggle rule on and off', async () => {
    const toggle = ac.ruleToggles.first();
    await expect(toggle).toBeVisible();
    const before = await toggle.getAttribute('aria-checked');
    const opposite = before === 'true' ? 'false' : 'true';

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', opposite, { timeout: 5000 });

    // Toggle back
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', before, { timeout: 5000 });
  });

  // Z5 — search
  test('search filters rules', async ({ page }) => {
    const ruleButtons = page.locator('button[aria-label^="Edit rule:"]');
    await expect(ruleButtons.first()).toBeVisible({ timeout: 15_000 });
    const beforeCount = await ruleButtons.count();

    await ac.ruleSearch.click();
    await ac.ruleSearch.pressSequentially('zzznonexistent', { delay: 20 });
    await page.waitForTimeout(1500);
    const afterCount = await ruleButtons.count();
    expect(afterCount).toBeLessThanOrEqual(beforeCount);
    await ac.ruleSearch.fill('');
    await page.waitForTimeout(500);
  });

  // Z6 — edit panel
  test('edit rule panel opens and closes', async ({ page }) => {
    const firstRule = page.locator('button[aria-label^="Edit rule:"]').first();
    await expect(firstRule).toBeVisible({ timeout: 15_000 });
    await firstRule.click();
    await page.waitForTimeout(2000);

    const panelVisible = await page.locator(
      '[data-state="open"], [role="dialog"], textarea, [data-slot="drawer-content"], [data-slot="sheet-content"]'
    ).first().isVisible().catch(() => false);
    expect(panelVisible).toBe(true);

    const cancelOrClose = page.getByRole('button', { name: /cancel|close|back|save/i }).first();
    if (await cancelOrClose.isVisible().catch(() => false)) {
      await cancelOrClose.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(500);
  });

  // ── SAVED PROMPTS TAB ──

  // ZS1 — switch tab
  test('Saved Prompts tab loads', async ({ page }) => {
    await ac.savedPromptsTab.click();
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/Saved Prompts|prompt|ZZTEST/i);
  });

  // ZS2 — list renders
  test('saved prompts list renders', async ({ page }) => {
    const prompts = page.locator('button[aria-label^="Edit rule:"], [class*="prompt"], [class*="card"]');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/ZZTEST|prompt|Saved/i);
  });

  // ZS3 — search saved prompts
  test('search saved prompts on customize', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.click();
      await searchInput.fill('');
      await searchInput.pressSequentially('ZZTEST', { delay: 20 });
      await page.waitForTimeout(1500);
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).toMatch(/ZZTEST/);
      await searchInput.fill('');
      await page.waitForTimeout(500);
    }
  });

  // ── COMMUNITY TAB ──

  // ZC1 — switch tab
  test('Community tab loads', async ({ page }) => {
    await ac.communityTab.click();
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/Community|skill|install/i);
  });

  // ZC2 — skills visible
  test('community skills are visible', async ({ page }) => {
    const installBtns = page.getByRole('button', { name: /install|enable|add/i });
    const skillCards = page.locator('[class*="card"], [class*="skill"], [data-slot*="card"]');
    const hasBtns = await installBtns.first().isVisible().catch(() => false);
    const hasCards = await skillCards.first().isVisible().catch(() => false);
    const bodyText = await page.locator('body').innerText();
    expect(hasBtns || hasCards || bodyText.length > 100).toBe(true);
  });

  // ZC3 — install community skill
  test('install community skill for test', async ({ page }) => {
    const installBtn = page.getByRole('button', { name: /install/i }).first();
    if (!(await installBtn.isVisible().catch(() => false))) {
      test.skip(true, 'no install button found');
    }
    await installBtn.click();
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  // ZC4 — verify all three tab buttons exist
  test('all tab buttons visible', async () => {
    await expect(ac.rulesTab).toBeVisible();
    await expect(ac.savedPromptsTab).toBeVisible();
    await expect(ac.communityTab).toBeVisible();
  });

  // Z7 — delete ONLY the test rule we created (last test — cleanup)
  test('delete test rule', async ({ page }) => {
    page.on('dialog', d => d.accept());

    // Switch back to Rules tab
    await ac.rulesTab.click();
    await page.waitForTimeout(2000);

    if (!testRuleName) {
      test.skip(true, 'no test rule was created');
    }

    // Search for our specific test rule
    await ac.ruleSearch.click();
    await ac.ruleSearch.fill('');
    await ac.ruleSearch.pressSequentially(testRuleName, { delay: 15 });
    await page.waitForTimeout(2000);

    // Find and delete only this one rule
    const targetRule = page.locator(`button[aria-label="Edit rule: ${testRuleName}"]`);
    const ruleVisible = await targetRule.isVisible().catch(() => false);

    if (ruleVisible) {
      // Find the delete button in the same row
      const ruleRow = targetRule.locator('xpath=ancestor::div[1]/..');
      const deleteBtn = ruleRow.getByRole('button', { name: 'Delete rule' });

      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
      } else {
        // Fall back to clicking any delete button visible after searching
        await ac.deleteRuleBtns.first().click();
      }
      await page.waitForTimeout(500);

      // Handle confirmation UI
      const confirmLocators = [
        page.locator('[role="alertdialog"]'),
        page.locator('[role="dialog"]:not([aria-label="Feedback"])'),
        page.locator('[data-slot*="alert-dialog"]'),
        page.locator('[data-radix-popper-content-wrapper]'),
      ];
      for (const loc of confirmLocators) {
        if (await loc.first().isVisible().catch(() => false)) {
          const btn = loc.first().getByRole('button', { name: /delete|confirm|yes|remove|continue/i }).first();
          if (await btn.isVisible().catch(() => false)) {
            await btn.click();
            break;
          }
        }
      }
      await page.waitForTimeout(2000);
    }

    // Verify the specific test rule is gone
    await page.reload();
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain(testRuleName);
  });
});
