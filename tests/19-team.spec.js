const { test, expect } = require('./fixtures');
const { TeamPage } = require('../pages/TeamPage');

test.describe('Team Page', () => {
  test.describe.configure({ mode: 'serial' });
  let tp;

  test.beforeEach(async ({ page }) => {
    tp = new TeamPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
    await tp.goto();
    await page.waitForLoadState('domcontentloaded');
  });

  // ╔═══════════════════════════════════════════════════╗
  //  PAGE LOAD & LAYOUT
  // ╚═══════════════════════════════════════════════════╝

  test('T0 — page loads with heading, search, invite button, and member list', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(tp.heading).toBeVisible({ timeout: 15_000 });
    await expect(tp.searchInput).toBeVisible();
    await expect(tp.inviteMembersBtn).toBeVisible();

    // Table headers
    await expect(tp.nameHeader).toBeVisible();
    await expect(tp.emailHeader).toBeVisible();
    await expect(tp.dateAddedHeader).toBeVisible();
    await expect(tp.roleHeader).toBeVisible();

    // Active section
    await expect(tp.activeSection).toBeVisible();

    // Owner row (YOU) — page has desktop+mobile duplicates, use visible locator
    await expect(page.locator('text=Hamza Hanif >> visible=true').first()).toBeVisible();
    await expect(page.locator('text=YOU >> visible=true').first()).toBeVisible();
    await expect(page.locator('text=hamzahanifsqae@gmail.com >> visible=true').first()).toBeVisible();
  });

  // ╔═══════════════════════════════════════════════════╗
  //  SEARCH
  // ╚═══════════════════════════════════════════════════╝

  test('T1 — search existing member dynamically, then gibberish returns zero', async ({ page }) => {
    test.setTimeout(90_000);

    await expect(tp.searchInput).toBeVisible({ timeout: 5000 });
    await expect(tp.roleDropdowns.first()).toBeVisible({ timeout: 10_000 });

    const initialDropdowns = await tp.roleDropdowns.count();
    expect(initialDropdowns).toBeGreaterThan(0);

    // Part A — dynamically pick an existing member email and search for it
    const memberEmails = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const emails = new Set();
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent.trim();
        const m = text.match(/^[\w.-]+@[\w.-]+\.\w{2,}$/);
        if (m && m[0] !== 'hamzahanifsqae@gmail.com') {
          const el = walker.currentNode.parentElement;
          if (el && el.offsetWidth > 0 && el.offsetHeight > 0) emails.add(m[0]);
        }
      }
      return [...emails];
    });
    expect(memberEmails.length).toBeGreaterThan(0);

    const searchTerm = memberEmails[0];
    await tp.searchInput.fill(searchTerm);
    await page.waitForLoadState('domcontentloaded');

    const matchedDropdowns = await tp.roleDropdowns.count();
    expect(matchedDropdowns).toBeGreaterThanOrEqual(1);
    expect(matchedDropdowns).toBeLessThanOrEqual(initialDropdowns);
    await expect(page.locator(`text=${searchTerm} >> visible=true`).first()).toBeVisible();

    await tp.searchInput.fill('');
    await page.waitForLoadState('domcontentloaded');

    // Part B — gibberish search returns no results
    await tp.searchInput.fill('zzzznoexist999');
    await page.waitForLoadState('domcontentloaded');

    const filteredDropdowns = await tp.roleDropdowns.count();
    expect(filteredDropdowns).toBe(0);

    // Clear — all dropdowns restore
    await tp.searchInput.fill('');
    await page.waitForLoadState('domcontentloaded');

    const restoredDropdowns = await tp.roleDropdowns.count();
    expect(restoredDropdowns).toBe(initialDropdowns);
  });

  // ╔═══════════════════════════════════════════════════╗
  //  ROLE MANAGEMENT  (T2 toggles, T3 undoes — sequential)
  // ╚═══════════════════════════════════════════════════╝

  test('T2 — change role of first non-YOU member (toggle)', async ({ page }) => {
    test.setTimeout(90_000);

    const firstDropdown = tp.roleDropdowns.first();
    await expect(firstDropdown).toBeVisible({ timeout: 5000 });

    const currentRole = await firstDropdown.textContent();
    const isAdmin = currentRole.trim() === 'Admin';
    const targetRole = isAdmin ? 'Team Member' : 'Admin';

    await firstDropdown.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(tp.changeRoleMenuItem).toBeVisible({ timeout: 3000 });
    await tp.changeRoleMenuItem.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('New Role')).toBeVisible({ timeout: 5000 });

    const roleCombobox = page.getByRole('combobox').filter({ hasText: /Admin|Team Member|Member/ });
    await roleCombobox.click();
    await page.waitForLoadState('domcontentloaded');

    const targetOption = page.getByRole('option', { name: targetRole });
    if (await targetOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await targetOption.click();
    } else {
      await page.locator('[data-slot="select-item"]').filter({ hasText: targetRole }).click();
    }
    await page.waitForLoadState('domcontentloaded');

    await tp.changeRoleSaveBtn.click();
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
      document.querySelectorAll('.fixed.inset-0').forEach(el => { el.style.pointerEvents = 'none'; });
    }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    const updatedRole = await tp.roleDropdowns.first().textContent();
    expect(updatedRole.trim()).not.toBe(currentRole.trim());
  });

  test('T3 — undo role change back to original', async ({ page }) => {
    test.setTimeout(90_000);

    const firstDropdown = tp.roleDropdowns.first();
    await expect(firstDropdown).toBeVisible({ timeout: 5000 });

    const currentRole = await firstDropdown.textContent();
    const isAdmin = currentRole.trim() === 'Admin';
    const targetRole = isAdmin ? 'Team Member' : 'Admin';

    await firstDropdown.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(tp.changeRoleMenuItem).toBeVisible({ timeout: 3000 });
    await tp.changeRoleMenuItem.click();
    await page.waitForLoadState('domcontentloaded');

    const roleCombobox = page.getByRole('combobox').filter({ hasText: /Admin|Team Member|Member/ });
    await roleCombobox.click();
    await page.waitForLoadState('domcontentloaded');

    const targetOption = page.getByRole('option', { name: targetRole });
    if (await targetOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await targetOption.click();
    } else {
      await page.locator('[data-slot="select-item"]').filter({ hasText: targetRole }).click();
    }
    await page.waitForLoadState('domcontentloaded');

    await tp.changeRoleSaveBtn.click();
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
      document.querySelectorAll('.fixed.inset-0').forEach(el => { el.style.pointerEvents = 'none'; });
    }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    const restoredRole = await tp.roleDropdowns.first().textContent();
    expect(restoredRole.trim()).not.toBe(currentRole.trim());
  });

  // ╔═══════════════════════════════════════════════════╗
  //  INVITE & REVOKE  (T4→T7 sequential: modal → send → pending → revoke)
  // ╚═══════════════════════════════════════════════════╝

  test('T4 — invite modal shows email, role, and send button', async ({ page }) => {
    test.setTimeout(60_000);

    await tp.inviteMembersBtn.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Invite EA Team Members')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Send an invitation to join your workspace')).toBeVisible();

    await expect(tp.inviteEmailInput).toBeVisible();
    await expect(page.getByText('Email Addresses')).toBeVisible();

    await expect(page.getByText('Role', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Select a role')).toBeVisible();

    await expect(tp.sendInvitesBtn).toBeVisible();
    await expect(tp.sendInvitesBtn).toBeDisabled();

    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });

  test('T5 — send invite for zztest user', async ({ page }) => {
    test.setTimeout(120_000);

    await tp.inviteMembersBtn.click();
    await page.waitForLoadState('domcontentloaded');

    await tp.inviteEmailInput.fill('zztest-invite@example.com');
    await page.waitForLoadState('domcontentloaded');

    const roleSelect = page.locator('select:visible').last();
    await roleSelect.selectOption({ index: 1 });
    await page.waitForLoadState('domcontentloaded');

    await expect(tp.sendInvitesBtn).toBeEnabled({ timeout: 3000 });
    await tp.sendInvitesBtn.click();
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
      document.querySelectorAll('.fixed.inset-0').forEach(el => { el.style.pointerEvents = 'none'; });
    }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');
  });

  test('T6 — pending section shows zztest invited user', async ({ page }) => {
    test.setTimeout(60_000);

    await expect(tp.pendingSection).toBeVisible({ timeout: 10_000 });

    const zztestEmail = page.locator('text=zztest-invite@example.com >> visible=true').first();
    await expect(zztestEmail).toBeVisible({ timeout: 10_000 });
  });

  test('T7 — revoke zztest invitation via role dropdown', async ({ page }) => {
    test.setTimeout(120_000);

    const pendingDropdown = tp.roleDropdowns.last();
    await expect(pendingDropdown).toBeVisible({ timeout: 5000 });
    await pendingDropdown.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(tp.revokeInvitationMenuItem).toBeVisible({ timeout: 3000 });
    await tp.revokeInvitationMenuItem.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(tp.revokeConfirmBtn).toBeVisible({ timeout: 5000 });
    await tp.revokeConfirmBtn.click();
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
      document.querySelectorAll('.fixed.inset-0').forEach(el => { el.style.pointerEvents = 'none'; });
    }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    const zztestGone = await page.getByText('zztest-invite@example.com').isVisible().catch(() => false);
    expect(zztestGone).toBe(false);
  });
});
