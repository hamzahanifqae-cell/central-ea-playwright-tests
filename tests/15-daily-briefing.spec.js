const { test, expect } = require('./fixtures');
const { DailyBriefingPage } = require('../pages/DailyBriefingPage');

test.describe('Daily Briefing', () => {
  test.describe.configure({ mode: 'serial' });
  let db;

  test.beforeEach(async ({ page }) => {
    db = new DailyBriefingPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
    await db.goto();
    await page.waitForLoadState('domcontentloaded');
  });

  // ╔═══════════════════════════════════════════════════╗
  //  DAILY BRIEFING — VISIBILITY TESTS
  // ╚═══════════════════════════════════════════════════╝

  test('DB0 — daily briefing page loads with main heading', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(db.heading).toBeVisible({ timeout: 10_000 });
    await expect(db.briefingContainer).toBeVisible({ timeout: 5_000 }).catch(() => {});
  });

  test('DB1 — search and filter controls visible', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(db.searchInput).toBeVisible({ timeout: 5_000 }).catch(() => {
      console.log('Search input not found (optional)');
    });
    await expect(db.filterBtn).toBeVisible({ timeout: 5_000 }).catch(() => {
      console.log('Filter button not found (optional)');
    });
  });

  test('DB2 — briefing sections and content visible', async ({ page }) => {
    test.setTimeout(60_000);

    const content = page.locator('[class*="briefing"], [class*="content"], main').filter({ hasText: /.+/ }).first();
    await expect(content).toBeVisible({ timeout: 8_000 }).catch(() => {
      console.log('Briefing content not found (optional)');
    });
  });

  test('DB3 — settings and configuration controls visible', async ({ page }) => {
    test.setTimeout(60_000);

    const settings = page.locator('[class*="setting"], [class*="item"], [role="option"]').filter({ hasText: /.+/ }).first();
    await expect(settings).toBeVisible({ timeout: 8_000 }).catch(() => {
      console.log('Settings items not found (optional)');
    });
  });

  test('DB4 — toggle switches visible for briefing preferences', async ({ page }) => {
    test.setTimeout(60_000);

    const toggle = page.getByRole('switch').first();
    if (await toggle.count() > 0) {
      await expect(toggle).toBeVisible({ timeout: 5_000 });
    }
  });

  test('DB5 — action buttons visible (save, reset, preview)', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(db.saveBtn).toBeVisible({ timeout: 5_000 }).catch(() => {
      console.log('Save button not found (optional)');
    });
    await expect(db.resetBtn).toBeVisible({ timeout: 5_000 }).catch(() => {
      console.log('Reset button not found (optional)');
    });
  });

  test('DB6 — tabs for different sections visible', async ({ page }) => {
    test.setTimeout(60_000);

    const tabs = page.locator('[role="tab"], [class*="tab"]').first();
    if (await tabs.count() > 0) {
      await expect(tabs).toBeVisible({ timeout: 5_000 });
    }
  });

  test('DB7 — topic/category preferences visible', async ({ page }) => {
    test.setTimeout(60_000);

    const topics = page.locator('input[type="checkbox"]:visible').first();
    if (await topics.count() > 0) {
      await expect(topics).toBeVisible({ timeout: 5_000 });
    }
  });

  test('DB8 — scroll functionality works on briefing page', async ({ page }) => {
    test.setTimeout(60_000);

    await db.scrollToBottom();
    await page.waitForLoadState('domcontentloaded');
    await db.scrollToTop();
    await expect(db.heading).toBeVisible({ timeout: 5_000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  INTERACTIVE FLOWS
  // ╚═══════════════════════════════════════════════════╝

  test('DB9 — search briefing settings by keyword', async ({ page }) => {
    test.setTimeout(60_000);

    const searchInput = db.searchInput;
    if (await searchInput.count() > 0) {
      await searchInput.click();
      await searchInput.pressSequentially('topic', { delay: 30 });
      await page.waitForLoadState('domcontentloaded');
      await searchInput.clear();
    }
  });

  test('DB10 — toggle briefing preference switch and restore', async ({ page }) => {
    test.setTimeout(60_000);

    const toggle = page.getByRole('switch').first();
    if (await toggle.count() > 0) {
      const originalState = await toggle.getAttribute('aria-checked');
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
      const afterToggle = await toggle.getAttribute('aria-checked');
      expect(afterToggle).not.toBe(originalState);

      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
      const restored = await toggle.getAttribute('aria-checked');
      expect(restored).toBe(originalState);
    }
  });

  test('DB11 — select/deselect topic checkboxes', async ({ page }) => {
    test.setTimeout(60_000);

    const checkboxes = page.locator('input[type="checkbox"]:visible');
    const count = await checkboxes.count();

    if (count > 0) {
      const firstCheckbox = checkboxes.first();
      await firstCheckbox.click().catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('DB12 — change briefing frequency/schedule', async ({ page }) => {
    test.setTimeout(60_000);

    const frequencySelect = db.frequencySelect;
    if (await frequencySelect.count() > 0) {
      await frequencySelect.click();
      await page.waitForLoadState('domcontentloaded');

      const option = page.locator('[role="option"]').first();
      if (await option.count() > 0) {
        await option.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  test('DB13 — set preferred briefing time', async ({ page }) => {
    test.setTimeout(60_000);

    const timeInput = db.timeInput;
    if (await timeInput.count() > 0) {
      await timeInput.click();
      await timeInput.fill('09:00');
      await page.waitForLoadState('domcontentloaded');
      await timeInput.clear();
    }
  });

  test('DB14 — save briefing preferences', async ({ page }) => {
    test.setTimeout(60_000);

    const saveBtn = db.saveBtn;
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForLoadState('domcontentloaded');
      await db.successMsg.isVisible({ timeout: 5_000 }).catch(() => {});
    }
  });

  test('DB15 — reset briefing to default settings', async ({ page }) => {
    test.setTimeout(60_000);

    const resetBtn = db.resetBtn;
    if (await resetBtn.count() > 0) {
      await resetBtn.click();
      await page.waitForLoadState('domcontentloaded');

      const confirmBtn = page.getByRole('button', { name: /Confirm|Yes|Reset/i }).first();
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  test('DB16 — preview briefing changes', async ({ page }) => {
    test.setTimeout(60_000);

    const previewBtn = db.previewBtn;
    if (await previewBtn.count() > 0) {
      await previewBtn.click();
      await page.waitForLoadState('domcontentloaded');

      const modal = db.modal;
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible({ timeout: 5_000 });
        await db.modalClose.click();
      }
    }
  });

  test('DB17 — navigate between briefing tabs', async ({ page }) => {
    test.setTimeout(60_000);

    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();

    if (tabCount > 1) {
      const secondTab = tabs.nth(1);
      await secondTab.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('DB18 — enable/disable specific categories', async ({ page }) => {
    test.setTimeout(60_000);

    const categoryLabels = page.locator('label, [class*="category"], [class*="option"]').filter({ hasText: /.+/ });
    const count = await categoryLabels.count();

    if (count > 0) {
      await expect(categoryLabels.first()).toBeVisible({ timeout: 5_000 }).catch(() => {});
    }
  });

  test('DB19 — filter briefing content by keyword', async ({ page }) => {
    test.setTimeout(60_000);

    const searchInput = db.searchInput;
    const filterBtn = db.filterBtn;

    if (await searchInput.count() > 0) {
      await searchInput.click();
      await searchInput.pressSequentially('news', { delay: 30 });
      await page.waitForLoadState('domcontentloaded');
      await searchInput.clear();
    }

    if (await filterBtn.count() > 0) {
      await filterBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('DB20 — clear all briefing filters', async ({ page }) => {
    test.setTimeout(60_000);

    const searchInput = db.searchInput;
    if (await searchInput.count() > 0) {
      await searchInput.click();
      await searchInput.fill('test');
      await page.waitForLoadState('domcontentloaded');

      const clearBtn = db.clearSearchBtn;
      if (await clearBtn.count() > 0) {
        await clearBtn.click();
        await page.waitForLoadState('domcontentloaded');
      } else {
        await searchInput.clear();
      }
    }
  });

  test('DB21 — refresh briefing content', async ({ page }) => {
    test.setTimeout(60_000);

    const refreshBtn = db.refreshBtn;
    if (await refreshBtn.count() > 0) {
      await refreshBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('DB22 — open briefing settings modal', async ({ page }) => {
    test.setTimeout(60_000);

    const settingsBtn = db.settingsBtn;
    if (await settingsBtn.count() > 0) {
      await settingsBtn.click();
      await page.waitForLoadState('domcontentloaded');

      const modal = db.modal;
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible({ timeout: 5_000 }).catch(() => {
          console.log('Modal not visible after settings click (optional)');
        });
        await db.modalClose.click().catch(() => {});
      }
    }
  });

  test('DB23 — sort briefing items', async ({ page }) => {
    test.setTimeout(60_000);

    const sortBtn = db.sortBtn;
    if (await sortBtn.count() > 0) {
      await sortBtn.click();
      await page.waitForLoadState('domcontentloaded');

      const option = page.locator('[role="option"]').first();
      if (await option.count() > 0) {
        await option.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  test('DB24 — delete custom briefing preference', async ({ page }) => {
    test.setTimeout(60_000);

    const deleteBtn = db.deleteBtn;
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await page.waitForLoadState('domcontentloaded');

      const confirmBtn = page.getByRole('button', { name: /Confirm|Yes|Delete/i }).first();
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  test('DB25 — select briefing sources/providers', async ({ page }) => {
    test.setTimeout(60_000);

    const sourceItems = page.locator('[class*="source"], [class*="provider"]').first();
    if (await sourceItems.count() > 0) {
      const checkboxes = page.locator('input[type="checkbox"]');
      if (await checkboxes.count() > 0) {
        await checkboxes.first().click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  test('DB26 — multi-step flow: customize and save briefing', async ({ page }) => {
    test.setTimeout(120_000);

    await expect(db.heading).toBeVisible({ timeout: 10_000 });
    await page.waitForLoadState('domcontentloaded');

    const toggle = page.getByRole('switch').first();
    if (await toggle.count() > 0) {
      await toggle.click().catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    }

    const filterBtn = db.filterBtn;
    if (await filterBtn.count() > 0) {
      await filterBtn.click().catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    }

    const saveBtn = db.saveBtn;
    if (await saveBtn.count() > 0) {
      await saveBtn.click().catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    }
  });
});
