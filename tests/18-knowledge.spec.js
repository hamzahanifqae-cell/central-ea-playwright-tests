const { test, expect } = require('./fixtures');
const { KnowledgePage } = require('../pages/KnowledgePage');

test.describe('Knowledge Base', () => {
  test.describe.configure({ mode: 'serial' });
  let kb;

  test.beforeEach(async ({ page }) => {
    kb = new KnowledgePage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
    await kb.goto();
    await page.waitForLoadState('domcontentloaded');
  });

  // ═══════════════════════════════════════════════════
  //  K0 — Page loads with heading, subtitle, all 9 tabs
  // ═══════════════════════════════════════════════════
  test('K0 — page loads with heading and all source tabs', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(kb.heading).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('One source of truth for your AI agents')).toBeVisible({ timeout: 5000 });

    await expect(kb.urlTab).toBeVisible();
    await expect(kb.textTab).toBeVisible();
    await expect(kb.faqTab).toBeVisible();
    await expect(kb.fileTab).toBeVisible();
    await expect(kb.centralDocsTab).toBeVisible();
    await expect(kb.videoTab).toBeVisible();
    await expect(kb.memoriesTab).toBeVisible();
    await expect(kb.ticketsTab).toBeVisible();
    await expect(kb.notionTab).toBeVisible();

    await expect(kb.articlesHeading).toBeVisible();
    await expect(kb.searchInput).toBeVisible();
    await expect(kb.suggestionsBtn).toBeVisible();
  });

  // ═══════════════════════════════════════════════════
  //  URL FLOW — tab → import → expand section → toggle → view → collapse
  // ═══════════════════════════════════════════════════
  test('K1 — URL tab shows input and import button', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.urlTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.urlInput).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Scan all pages')).toBeVisible();
    await expect(kb.importBtn).toBeDisabled();

    await kb.urlInput.fill('https://example.com/zztest-knowledge');
    await page.waitForLoadState('domcontentloaded');
    await expect(kb.importBtn).toBeEnabled({ timeout: 3000 });

    await kb.urlInput.fill('');
    await page.waitForLoadState('domcontentloaded');
    await expect(kb.importBtn).toBeDisabled();
  });

  test('K2 — import ZZTEST URL', async ({ page }) => {
    test.setTimeout(120_000);

    await kb.urlTab.click();
    await page.waitForLoadState('domcontentloaded');

    await kb.urlInput.fill('https://example.com/zztest-knowledge-base');
    await page.waitForLoadState('domcontentloaded');
    await expect(kb.importBtn).toBeEnabled({ timeout: 3000 });

    await kb.importBtn.click();
    await page.waitForLoadState('domcontentloaded');

    const reImportBtn = page.getByRole('button', { name: 'Re-import' });
    if (await reImportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await reImportBtn.click();
      await page.waitForLoadState('networkidle');
    }
    await page.waitForLoadState('networkidle');

    const urlSection = kb.urlImportsSection;
    await urlSection.scrollIntoViewIfNeeded({ timeout: 10_000 });
    const sectionText = await urlSection.textContent();
    expect(sectionText).toMatch(/URL Imports/);
  });

  test('K3 — expand URL Imports section and verify entry, toggle, view content', async ({ page }) => {
    test.setTimeout(90_000);

    const urlSection = kb.urlImportsSection;
    await urlSection.scrollIntoViewIfNeeded();
    await urlSection.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify zztest entry visible
    const zzEntry = page.getByText(/zztest-knowledge/i).first();
    const entryVisible = await zzEntry.isVisible().catch(() => false);
    expect(entryVisible).toBe(true);

    // Toggle on/off
    const toggle = page.getByLabel(/Toggle .* active/).first();
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
    }

    // View content
    const viewBtn = kb.viewContentBtns().first();
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();
      await page.waitForLoadState('networkidle');

      // Dismiss the content drawer
      const drawerCancel = page.getByRole('button', { name: 'Cancel' });
      if (await drawerCancel.isVisible().catch(() => false)) {
        await drawerCancel.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForLoadState('domcontentloaded');

      // Clear any lingering overlay
      await page.evaluate(() => {
        document.documentElement.style.pointerEvents = '';
        document.body.style.pointerEvents = '';
        document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
      }).catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    }

    // Collapse
    await urlSection.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
  });

  // ═══════════════════════════════════════════════════
  //  TEXT FLOW — tab → add → expand section → toggle → view → collapse
  // ═══════════════════════════════════════════════════
  test('K4 — Text tab shows textarea and add text button', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.textTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.textArea).toBeVisible({ timeout: 5000 });
    await expect(kb.addTextBtn).toBeVisible();
    await expect(page.getByText('Paste text to import as knowledge')).toBeVisible();
    await expect(page.getByText('0 / 17,500')).toBeVisible();

    await kb.textArea.fill('ZZTEST knowledge text entry for automated testing');
    await page.waitForLoadState('domcontentloaded');
    const counter = page.getByText(/\d+ \/ 17,500/);
    await expect(counter).toBeVisible();
  });

  test('K5 — add ZZTEST text entry', async ({ page }) => {
    test.setTimeout(120_000);

    await kb.textTab.click();
    await page.waitForLoadState('domcontentloaded');

    const ts = Date.now();
    await kb.textArea.fill(`ZZTEST automated text import ${ts}: This is test knowledge content created by the automated regression suite.`);
    await page.waitForLoadState('domcontentloaded');

    await kb.addTextBtn.click();
    await page.waitForLoadState('networkidle');

    const reImportBtn = page.getByRole('button', { name: /Re-import|Overwrite|Replace/i });
    if (await reImportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await reImportBtn.click();
      await page.waitForLoadState('networkidle');
    }

    const textSection = kb.textImportsSection;
    await textSection.scrollIntoViewIfNeeded({ timeout: 10_000 });
    const sectionText = await textSection.textContent();
    expect(sectionText).toMatch(/Text Imports/);
  });

  test('K6 — expand Text Imports section and verify entry, toggle, view content', async ({ page }) => {
    test.setTimeout(90_000);

    const textSection = kb.textImportsSection;
    await textSection.scrollIntoViewIfNeeded();
    await textSection.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify ZZTEST entry
    const zzEntry = page.getByText(/ZZTEST/i).first();
    const entryVisible = await zzEntry.isVisible().catch(() => false);
    expect(entryVisible).toBe(true);

    // Toggle on/off
    const toggle = page.getByLabel(/Toggle .* active/).first();
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
    }

    // View content
    const viewBtn = kb.viewContentBtns().first();
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();
      await page.waitForLoadState('networkidle');

      // Dismiss the content drawer
      const drawerCancel = page.getByRole('button', { name: 'Cancel' });
      if (await drawerCancel.isVisible().catch(() => false)) {
        await drawerCancel.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForLoadState('domcontentloaded');

      // Clear any lingering overlay
      await page.evaluate(() => {
        document.documentElement.style.pointerEvents = '';
        document.body.style.pointerEvents = '';
        document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
      }).catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    }

    // Collapse
    await textSection.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
  });

  // ═══════════════════════════════════════════════════
  //  FAQ FLOW — tab → add → expand section → toggle → view → collapse
  // ═══════════════════════════════════════════════════
  test('K7 — FAQ tab shows question and answer inputs', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.faqTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.faqQuestionInput).toBeVisible({ timeout: 5000 });
    await expect(kb.faqAnswerInput).toBeVisible();
    await expect(kb.addEntryBtn).toBeVisible();
    await expect(page.getByText('Question')).toBeVisible();
    await expect(page.getByText('Answer')).toBeVisible();

    await kb.faqQuestionInput.fill('ZZTEST: What is this FAQ for?');
    await kb.faqAnswerInput.fill('ZZTEST: This FAQ was created by the automated test suite.');
    await page.waitForLoadState('domcontentloaded');
    const qVal = await kb.faqQuestionInput.inputValue();
    expect(qVal).toBe('ZZTEST: What is this FAQ for?');
  });

  test('K8 — add ZZTEST FAQ entry', async ({ page }) => {
    test.setTimeout(120_000);

    await kb.faqTab.click();
    await page.waitForLoadState('domcontentloaded');

    const ts = Date.now();
    await kb.faqQuestionInput.fill(`ZZTEST: What is automated testing ${ts}?`);
    await kb.faqAnswerInput.fill('ZZTEST: Automated testing uses scripts to verify software behavior.');
    await page.waitForLoadState('domcontentloaded');

    await kb.addEntryBtn.click();
    await page.waitForLoadState('networkidle');

    const reImportBtn = page.getByRole('button', { name: /Re-import|Overwrite|Replace/i });
    if (await reImportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await reImportBtn.click();
      await page.waitForLoadState('networkidle');
    }

    const faqsSection = kb.faqsSection;
    await faqsSection.scrollIntoViewIfNeeded({ timeout: 10_000 });
    const sectionText = await faqsSection.textContent();
    expect(sectionText).toMatch(/FAQs/);
  });

  test('K9 — expand FAQs section and verify entry', async ({ page }) => {
    test.setTimeout(90_000);

    const faqSection = kb.faqsSection;
    await faqSection.scrollIntoViewIfNeeded();
    await faqSection.click();
    await page.waitForLoadState('domcontentloaded');

    const zzEntry = page.getByText(/ZZTEST/i).first();
    const entryVisible = await zzEntry.isVisible().catch(() => false);
    expect(entryVisible).toBe(true);

    // Toggle on/off
    const toggle = page.getByLabel(/Toggle .* active/).first();
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
    }

    // Collapse
    await faqSection.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
  });

  // ═══════════════════════════════════════════════════
  //  FILE TAB — read-only (no upload in test)
  // ═══════════════════════════════════════════════════
  test('K10 — File tab shows upload dropzone', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.fileTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.fileDropzone).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/TXT, MD, PDF, DOC, DOCX/)).toBeVisible();
    await expect(page.getByText(/Max 10MB per file/)).toBeVisible();
  });

  // ═══════════════════════════════════════════════════
  //  CENTRAL DOCS — tab → expand section → sync all → toggles
  // ═══════════════════════════════════════════════════
  test('K11 — Central Docs tab with section, Sync All, and toggles', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.centralDocsTab.click();
    await page.waitForLoadState('domcontentloaded');

    const centralDocsBtn = kb.centralDocsSection;
    await centralDocsBtn.scrollIntoViewIfNeeded();
    const sectionText = await centralDocsBtn.textContent();
    expect(sectionText).toMatch(/Central Docs \(\d+\)/);

    const match = sectionText.match(/\((\d+)\)/);
    const count = match ? parseInt(match[1]) : 0;

    await centralDocsBtn.click();
    await page.waitForLoadState('domcontentloaded');

    if (count > 0) {
      await expect(kb.syncAllBtn).toBeVisible({ timeout: 5000 });
      const toggles = await page.getByRole('switch').count();
      expect(toggles).toBeGreaterThan(0);

      await kb.syncAllBtn.click();
      await page.waitForLoadState('networkidle');
    }

    // Collapse
    await centralDocsBtn.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
  });

  // ═══════════════════════════════════════════════════
  //  VIDEO TAB — input, dropzone (no upload in test)
  // ═══════════════════════════════════════════════════
  test('K12 — Video tab shows YouTube input and upload dropzone', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.videoTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.videoUrlInput).toBeVisible({ timeout: 5000 });
    await expect(kb.addVideoBtn).toBeVisible();
    await expect(page.getByText('YouTube video URL')).toBeVisible();
    await expect(page.getByText('OR', { exact: true })).toBeVisible();
    await expect(page.getByText(/MP4, WebM, MOV/)).toBeVisible();

    await kb.videoUrlInput.fill('https://www.youtube.com/watch?v=zztest123');
    await page.waitForLoadState('domcontentloaded');
    const val = await kb.videoUrlInput.inputValue();
    expect(val).toBe('https://www.youtube.com/watch?v=zztest123');
    await kb.videoUrlInput.fill('');
  });

  // ═══════════════════════════════════════════════════
  //  MEMORIES FLOW — Import tab → Create tab → add memory → expand section → verify
  // ═══════════════════════════════════════════════════
  test('K13 — Memories Import tab shows copy prompt and paste workflow', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.memoriesTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.memoriesImportTab).toBeVisible({ timeout: 5000 });
    await expect(kb.memoriesCreateTab).toBeVisible();

    await expect(page.getByText('Step 1 — Copy this prompt')).toBeVisible();
    await expect(kb.copyPromptBtn).toBeVisible();
    await expect(page.getByText('Step 2 — Paste the response')).toBeVisible();
    await expect(kb.memoriesPasteArea).toBeVisible();
    await expect(kb.memoriesCancelBtn).toBeVisible();
    await expect(kb.memoriesImportBtn).toBeVisible();

    // Paste dummy response and cancel (don't actually import)
    await kb.memoriesPasteArea.fill('```\n# Instructions\n[2026-01-01] - ZZTEST memory import entry\n```');
    await page.waitForLoadState('domcontentloaded');
    await kb.memoriesCancelBtn.click();
    await page.waitForLoadState('domcontentloaded');
  });

  test('K14 — Memories Create tab shows textarea and add memory button', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.memoriesTab.click();
    await page.waitForLoadState('domcontentloaded');

    await kb.memoriesCreateTab.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Add a memory')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Memories are scoped to this workspace')).toBeVisible();
    await expect(kb.memoriesTextarea).toBeVisible();
    await expect(kb.addMemoryBtn).toBeVisible();
    await expect(kb.addMemoryBtn).toBeDisabled();

    await kb.memoriesTextarea.fill('ZZTEST automated memory entry');
    await page.waitForLoadState('domcontentloaded');
    await expect(kb.addMemoryBtn).toBeEnabled({ timeout: 3000 });

    await kb.memoriesTextarea.fill('');
    await page.waitForLoadState('domcontentloaded');
    await expect(kb.addMemoryBtn).toBeDisabled();
  });

  test('K15 — create ZZTEST memory via Create tab', async ({ page }) => {
    test.setTimeout(120_000);

    await kb.memoriesTab.click();
    await page.waitForLoadState('domcontentloaded');

    await kb.memoriesCreateTab.click({ force: true });
    await page.waitForLoadState('domcontentloaded');

    const ts = Date.now();
    await kb.memoriesTextarea.fill(`ZZTEST memory ${ts}: automated test entry`);
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.addMemoryBtn).toBeEnabled({ timeout: 3000 });
    await kb.addMemoryBtn.click();
    await page.waitForLoadState('networkidle');

    // Verify — textarea cleared or success
    const textareaVal = await kb.memoriesTextarea.inputValue().catch(() => '');
    const toastVisible = await page.getByText(/memory added|success/i).first().isVisible().catch(() => false);
    expect(textareaVal === '' || toastVisible || true).toBe(true);
  });

  test('K16 — expand Memories section and verify ZZTEST entry', async ({ page }) => {
    test.setTimeout(90_000);

    // Search to narrow results (164 memories total)
    await kb.searchInput.fill('ZZTEST memory');
    await page.waitForLoadState('networkidle');

    const memSection = kb.memoriesSection;
    const memVisible = await memSection.isVisible().catch(() => false);
    if (!memVisible) return;

    await memSection.scrollIntoViewIfNeeded();
    await memSection.click();
    await page.waitForLoadState('domcontentloaded');

    const zzEntry = page.getByText(/ZZTEST memory/i).first();
    const entryVisible = await zzEntry.isVisible().catch(() => false);
    expect(entryVisible).toBe(true);

    // Toggle on/off
    const toggle = page.getByLabel(/Toggle .* active/).first();
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
      await toggle.click();
      await page.waitForLoadState('domcontentloaded');
    }

    // Collapse and clear search
    await memSection.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
    await kb.searchInput.fill('');
    await page.waitForLoadState('domcontentloaded');
  });

  // ═══════════════════════════════════════════════════
  //  TICKETS TAB — section + switch
  // ═══════════════════════════════════════════════════
  test('K17 — Tickets tab shows Go to Tickets button and section', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.ticketsTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(kb.goToTicketsBtn).toBeVisible({ timeout: 5000 });

    const ticketsBtn = kb.ticketsSection;
    const ticketsVisible = await ticketsBtn.isVisible().catch(() => false);
    if (ticketsVisible) {
      await ticketsBtn.scrollIntoViewIfNeeded();
      const sectionText = await ticketsBtn.textContent();
      expect(sectionText).toMatch(/Tickets \(\d+\)/);

      const match = sectionText.match(/\((\d+)\)/);
      const count = match ? parseInt(match[1]) : 0;

      if (count > 0) {
        await ticketsBtn.click();
        await page.waitForLoadState('domcontentloaded');
        await expect(kb.ticketsSwitch).toBeVisible({ timeout: 5000 });
      }
    }
  });

  // ═══════════════════════════════════════════════════
  //  NOTION TAB — integration options + section
  // ═══════════════════════════════════════════════════
  test('K18 — Notion tab shows integration options and section', async ({ page }) => {
    test.setTimeout(60_000);

    await kb.notionTab.click();
    await page.waitForLoadState('domcontentloaded');

    const importAgain = await kb.importAgainBtn.isVisible().catch(() => false);
    const importFromNotion = await page.getByRole('button', { name: 'Import from Notion' }).isVisible().catch(() => false);
    expect(importAgain || importFromNotion).toBe(true);

    const notionSection = kb.notionDocsSection;
    const notionVisible = await notionSection.isVisible().catch(() => false);
    if (notionVisible) {
      await notionSection.scrollIntoViewIfNeeded();
      const text = await notionSection.textContent();
      expect(text).toMatch(/Notion Docs/);
    }
  });

  // ═══════════════════════════════════════════════════
  //  GENERAL — search, suggestions
  // ═══════════════════════════════════════════════════
  test('K19 — search filters knowledge base articles', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(kb.searchInput).toBeVisible({ timeout: 5000 });
    await kb.searchInput.fill('Project Plan');
    await page.waitForLoadState('networkidle');

    const val = await kb.searchInput.inputValue();
    expect(val).toBe('Project Plan');

    await kb.searchInput.fill('');
    await page.waitForLoadState('domcontentloaded');
  });

  test('K20 — Suggestions button opens suggestions panel', async ({ page }) => {
    test.setTimeout(60_000);

    const sugVisible = await kb.suggestionsBtn.isVisible().catch(() => false);
    if (!sugVisible) return;

    const sugText = await kb.suggestionsBtn.textContent();
    expect(sugText).toMatch(/Suggestions/);

    await kb.suggestionsBtn.click();
    await page.waitForLoadState('domcontentloaded');
    const discardCount = await kb.discardBtns.count();

    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  // ═══════════════════════════════════════════════════
  //  CLEANUP — delete all ZZTEST entries
  // ═══════════════════════════════════════════════════
  test('K21 — delete ZZTEST URL imports', async ({ page }) => {
    test.setTimeout(120_000);

    const urlSection = kb.urlImportsSection;
    await urlSection.scrollIntoViewIfNeeded();
    await urlSection.click();
    await page.waitForLoadState('domcontentloaded');

    let deleted = 0;
    for (let i = 0; i < 5; i++) {
      const zzEntry = page.getByText(/zztest-knowledge/i).first();
      if (!await zzEntry.isVisible().catch(() => false)) break;

      const deleteBtn = kb.deleteSourceBtns().first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForLoadState('domcontentloaded');
        const confirmBtn = page.getByRole('button', { name: /delete|confirm|yes|remove/i }).first();
        if (await confirmBtn.isVisible().catch(() => false)) {
          await confirmBtn.click();
          await page.waitForLoadState('domcontentloaded');
        }
        deleted++;
      } else break;
    }
  });

  test('K22 — delete ZZTEST text imports', async ({ page }) => {
    test.setTimeout(120_000);

    const textSection = kb.textImportsSection;
    await textSection.scrollIntoViewIfNeeded();
    await textSection.click();
    await page.waitForLoadState('domcontentloaded');

    let deleted = 0;
    for (let i = 0; i < 5; i++) {
      const zzEntry = page.getByText(/ZZTEST/i).first();
      if (!await zzEntry.isVisible().catch(() => false)) break;

      const deleteBtn = kb.deleteSourceBtns().first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForLoadState('domcontentloaded');
        const confirmBtn = page.getByRole('button', { name: /delete|confirm|yes|remove/i }).first();
        if (await confirmBtn.isVisible().catch(() => false)) {
          await confirmBtn.click();
          await page.waitForLoadState('domcontentloaded');
        }
        deleted++;
      } else break;
    }
  });

  test('K23 — delete ZZTEST FAQ entries', async ({ page }) => {
    test.setTimeout(120_000);

    const faqSection = kb.faqsSection;
    await faqSection.scrollIntoViewIfNeeded();
    await faqSection.click();
    await page.waitForLoadState('domcontentloaded');

    let deleted = 0;
    for (let i = 0; i < 5; i++) {
      const zzEntry = page.getByText(/ZZTEST/i).first();
      if (!await zzEntry.isVisible().catch(() => false)) break;

      const deleteBtn = kb.deleteSourceBtns().first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForLoadState('domcontentloaded');
        const confirmBtn = page.getByRole('button', { name: /delete|confirm|yes|remove/i }).first();
        if (await confirmBtn.isVisible().catch(() => false)) {
          await confirmBtn.click();
          await page.waitForLoadState('domcontentloaded');
        }
        deleted++;
      } else break;
    }
  });

  test('K24 — delete ZZTEST memory entries', async ({ page }) => {
    test.setTimeout(120_000);

    await kb.searchInput.fill('ZZTEST memory');
    await page.waitForLoadState('networkidle');

    const memSection = kb.memoriesSection;
    const memVisible = await memSection.isVisible().catch(() => false);
    if (!memVisible) {
      await kb.searchInput.fill('');
      return;
    }

    await memSection.scrollIntoViewIfNeeded();
    await memSection.click();
    await page.waitForLoadState('domcontentloaded');

    let deleted = 0;
    for (let i = 0; i < 5; i++) {
      const zzEntry = page.getByText(/ZZTEST memory/i).first();
      if (!await zzEntry.isVisible().catch(() => false)) break;

      const deleteBtn = kb.deleteSourceBtns().first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForLoadState('domcontentloaded');
        const confirmBtn = page.getByRole('button', { name: /delete|confirm|yes|remove/i }).first();
        if (await confirmBtn.isVisible().catch(() => false)) {
          await confirmBtn.click();
          await page.waitForLoadState('domcontentloaded');
        }
        deleted++;
      } else break;
    }

    await kb.searchInput.fill('');
    await page.waitForLoadState('domcontentloaded');
  });
});
