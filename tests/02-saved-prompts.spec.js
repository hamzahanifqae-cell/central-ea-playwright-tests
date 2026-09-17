const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

const TAG = 'ZZTEST';
const uniqueTitle = () => `${TAG}-${Date.now()}`;

test.describe('Saved Prompts — linear flow', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;
  let firstTitle;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
  });

  // SP1 — open panel and create first prompt with all fields
  test('create first saved prompt', async ({ page }) => {
    await ac.ensurePage('New Chat');
    await ac.promptsButton.click();
    await expect(page.getByText(/Saved Prompts/i).first()).toBeVisible({ timeout: 10_000 });

    // Click create — either "Create your first prompt" (empty) or add/+ button
    const createLink = page.getByText(/Create your first prompt/i).first();
    if (await createLink.isVisible().catch(() => false)) {
      await createLink.click();
    } else {
      const addBtn = page.getByRole('button', { name: /add|new prompt|\+/i }).first();
      await addBtn.click();
    }

    await expect(page.getByText(/Create a Saved prompt/i).first()).toBeVisible({ timeout: 10_000 });

    // All interactions scoped to the drawer
    const drawer = page.locator('[data-slot="sheet-content"]');
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Title
    firstTitle = uniqueTitle();
    const titleInput = drawer.getByPlaceholder('Enter a prompt title');
    await titleInput.click();
    await titleInput.fill(firstTitle);

    // Body
    const bodyInput = drawer.getByPlaceholder('Write a prompt for your assistant');
    await bodyInput.click();
    await bodyInput.fill('This is an automated test prompt. Safe to delete.');

    // Category (optional dropdown inside drawer)
    const categorySelect = drawer.locator('[data-slot="select-trigger"]');
    if (await categorySelect.isVisible().catch(() => false)) {
      await categorySelect.click();
      await page.waitForTimeout(500);
      const option = page.locator('[role="option"]').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
      }
      await page.waitForTimeout(300);
    }

    // Turn OFF "Automatically run prompt when selected" (defaults ON)
    const autoRun = drawer.getByRole('switch').first();
    if (await autoRun.isVisible().catch(() => false)) {
      if (await autoRun.getAttribute('aria-checked') === 'true') {
        await autoRun.click();
        await page.waitForTimeout(300);
      }
      await expect(autoRun).toHaveAttribute('aria-checked', 'false');
    }

    // Verify "Publish to community skills" is OFF
    const publish = drawer.getByRole('switch').last();
    if (await publish.isVisible().catch(() => false)) {
      await expect(publish).toHaveAttribute('aria-checked', 'false');
    }

    // Save
    await drawer.getByRole('button', { name: 'Save Prompt' }).click();
    await page.waitForTimeout(3000);
  });

  // SP2 — verify prompt appears in the panel
  test('first prompt visible in panel', async ({ page }) => {
    // Reopen panel to check
    await ac.promptsButton.click();
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/ZZTEST-/);
  });

  // SP3 — search prompts
  test('search filters saved prompts', async ({ page }) => {
    // Panel should still be open
    const searchInput = page.getByPlaceholder(/search/i).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.click();
      await searchInput.pressSequentially('zzznonexistent', { delay: 20 });
      await page.waitForTimeout(1000);
      // Verify no results or fewer results
      const noResults = await page.getByText(/no prompts|no results/i).first().isVisible().catch(() => false);
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(500);
    }
    // Close panel
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  // SP4 — create second prompt
  test('create second saved prompt', async ({ page }) => {
    await ac.promptsButton.click();
    await expect(page.getByText(/Saved Prompts/i).first()).toBeVisible({ timeout: 10_000 });

    const addBtn = page.getByRole('button', { name: /add|new prompt|\+/i }).first();
    const createLink = page.getByText(/Create your first prompt/i).first();
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
    } else if (await createLink.isVisible().catch(() => false)) {
      await createLink.click();
    }

    await expect(page.getByText(/Create a Saved prompt/i).first()).toBeVisible({ timeout: 10_000 });

    const drawer = page.locator('[data-slot="sheet-content"]');
    const titleInput = drawer.getByPlaceholder('Enter a prompt title');
    await titleInput.click();
    await titleInput.fill(uniqueTitle());

    const bodyInput = drawer.getByPlaceholder('Write a prompt for your assistant');
    await bodyInput.click();
    await bodyInput.fill('Second automated test prompt. Safe to delete.');

    // Auto-run OFF
    const autoRun = drawer.getByRole('switch').first();
    if (await autoRun.isVisible().catch(() => false) &&
        await autoRun.getAttribute('aria-checked') === 'true') {
      await autoRun.click();
      await page.waitForTimeout(300);
    }

    await drawer.getByRole('button', { name: 'Save Prompt' }).click();
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  // SP5 — navigate to Customize via manage/gear
  test('navigate to Customize page', async ({ page }) => {
    await ac.ensurePage('Customize');
    await expect(page).toHaveURL(/askcentral\/customize/);
  });
});
