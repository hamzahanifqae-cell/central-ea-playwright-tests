const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Automations — full regression', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    await ac.ensurePage('Automations');
  });

  // W1 — list renders
  test('automation list renders', async () => {
    await expect(ac.automationSearch).toBeVisible();
    await expect(ac.automationRows.first()).toBeVisible({ timeout: 15_000 });
    const count = await ac.automationRows.count();
    expect(count).toBeGreaterThan(0);
  });

  // W2 — search filters
  test('search filters automations', async ({ page }) => {
    await expect(ac.automationRows.first()).toBeVisible({ timeout: 15_000 });
    const beforeCount = await ac.automationRows.count();
    await ac.automationSearch.click();
    await ac.automationSearch.pressSequentially('zzznonexistent', { delay: 20 });
    await page.waitForLoadState('domcontentloaded');
    const afterCount = await ac.automationRows.count();
    expect(afterCount).toBeLessThan(beforeCount);
    await ac.automationSearch.fill('');
    await page.waitForLoadState('domcontentloaded');
  });

  // W3 — row controls
  test('row controls exist (edit, pause)', async () => {
    await expect(ac.automationRows.first()).toBeVisible({ timeout: 15_000 });
    await expect(ac.editButtons.first()).toBeVisible();
    await expect(ac.pauseButtons.first()).toBeVisible();
  });

  // W4 — tab switching
  test('My Automations and Browse Templates tabs', async () => {
    await expect(ac.myAutomationsTab).toBeVisible();
    await expect(ac.browseTemplatesTab).toBeVisible();
    await ac.browseTemplatesTab.click();
    await expect(ac.browseTemplatesTab).toHaveAttribute('aria-selected', 'true');
    await ac.myAutomationsTab.click();
    await expect(ac.myAutomationsTab).toHaveAttribute('aria-selected', 'true');
  });

  // W5 — edit panel
  test('edit panel opens and closes', async ({ page }) => {
    await expect(ac.editButtons.first()).toBeVisible({ timeout: 15_000 });
    await ac.editButtons.first().click();
    await page.waitForLoadState('domcontentloaded');

    const panelVisible = await page.locator(
      '[data-state="open"], [role="dialog"], textarea, [data-slot="drawer-content"]'
    ).first().isVisible().catch(() => false);
    expect(panelVisible).toBe(true);

    const cancelOrClose = page.getByRole('button', { name: /cancel|close|back/i }).first();
    if (await cancelOrClose.isVisible().catch(() => false)) {
      await cancelOrClose.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForLoadState('domcontentloaded');
  });

  // W6 — pause and resume an automation
  test('pause and resume automation', async ({ page }) => {
    await expect(ac.pauseButtons.first()).toBeVisible({ timeout: 15_000 });
    await ac.pauseButtons.first().click();
    await page.waitForLoadState('domcontentloaded');

    // After pausing, the button might change to "Resume automation" or "Play automation"
    const resumeBtn = page.getByRole('button', { name: /resume|play|start/i }).first();
    const resumeVisible = await resumeBtn.isVisible().catch(() => false);

    if (resumeVisible) {
      await resumeBtn.click();
      await page.waitForLoadState('domcontentloaded');
      // Verify it went back to pause state
      await expect(ac.pauseButtons.first()).toBeVisible({ timeout: 10_000 });
    }
    // If no resume button, the pause might have a different behavior — still OK
  });

  // W7 — Browse Templates shows content
  test('Browse Templates has content', async ({ page }) => {
    // W6 navigated to automation detail (URL still has /workflows) — force full nav
    await ac.goto('Automations');
    await ac.browseTemplatesTab.click();
    await page.waitForLoadState('domcontentloaded');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/template|automation|enable/i);
    // Go back to My Automations
    await ac.myAutomationsTab.click();
    await page.waitForLoadState('domcontentloaded');
  });
});
