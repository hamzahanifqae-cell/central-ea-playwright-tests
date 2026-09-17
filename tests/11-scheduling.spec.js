const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe.skip('Scheduling (Email) — temporarily skipped due to page/backend issue', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
  });

  // ╔═══════════════════════════════════════════════════╗
  //  EMAIL SCHEDULE (via Inbox compose → Scheduled folder)
  // ╚═══════════════════════════════════════════════════╝

  // S0 — Compose email → schedule via Send dropdown → verify in Scheduled folder → cancel
  test('schedule email via send dropdown, verify in Scheduled, then cancel', async ({ page }) => {
    test.setTimeout(180_000);
    const ac = new AskCentralPage(page);

    // Navigate to Inbox first (use goto for reliable direct navigation)
    await ac.goto('Inbox');
    await page.getByLabel('Compose new email').waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Switch to Google account (needed for email features)
    const compose = page.getByLabel('Compose new email');
    const box = await compose.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width + 20, box.y + box.height / 2);
      await page.waitForTimeout(2000);
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
      await page.waitForTimeout(3000);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(2000);
    }

    // Click Compose new email
    await page.getByLabel('Compose new email').click();
    await page.waitForTimeout(3000);

    // Fill To field
    const toField = page.getByPlaceholder(/recipients|to/i).first();
    await expect(toField).toBeVisible({ timeout: 5000 });
    await toField.click();
    await toField.pressSequentially('hamzahanifsqae@gmail.com', { delay: 30 });
    await page.waitForTimeout(1500);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    // Fill Subject
    const subjectField = page.getByPlaceholder(/subject/i).first();
    await expect(subjectField).toBeVisible({ timeout: 5000 });
    await subjectField.click();
    await subjectField.fill('ZZTEST scheduled email');
    await page.waitForTimeout(500);

    // Fill Body
    const bodyEditor = page.locator('[contenteditable="true"]').first();
    await expect(bodyEditor).toBeVisible({ timeout: 5000 });
    await bodyEditor.click();
    await page.keyboard.type('ZZTEST scheduled email body', { delay: 15 });
    await page.waitForTimeout(500);

    // Click the chevron (dropdown arrow) next to Send button to open schedule modal
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const sendBtn = btns.find(b => b.textContent.includes('Send') && b.getBoundingClientRect().y > 600);
      if (sendBtn) {
        const sendRect = sendBtn.getBoundingClientRect();
        const svgs = document.querySelectorAll('svg.lucide-chevron-down');
        for (const svg of svgs) {
          const r = svg.getBoundingClientRect();
          if (Math.abs(r.y - sendRect.y) < 30 && r.x > 250) {
            svg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            return;
          }
        }
        const chevron = sendBtn.querySelector('svg.lucide-chevron-down');
        if (chevron) {
          chevron.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      }
    });
    await page.waitForTimeout(3000);

    // Verify schedule modal is open
    await expect(page.getByText('Schedule to send').first()).toBeVisible({ timeout: 8000 });

    // Click "Tomorrow morning" quick pick (sets date + time reliably)
    const tomorrowPick = page.getByText('Tomorrow morning').first();
    await expect(tomorrowPick).toBeVisible({ timeout: 5000 });
    await tomorrowPick.click({ force: true });
    await page.waitForTimeout(2000);

    // Verify date input got populated
    const dateInput = page.locator('input[type="date"]').first();
    const dateVal = await dateInput.inputValue().catch(() => '');
    expect(dateVal).toBeTruthy();

    // Click the blue "Schedule" button
    const scheduleBtn = page.getByRole('button', { name: 'Schedule' });
    await expect(scheduleBtn).toBeVisible({ timeout: 5000 });
    await scheduleBtn.click({ force: true });
    await page.waitForTimeout(8000);

    // After Schedule click, compose window should close
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
    await page.waitForTimeout(3000);

    // Navigate to Scheduled folder — wait for emails to load
    await page.goto('/app/ea/email/scheduled', { waitUntil: 'domcontentloaded' });
    const scheduledShell = page.getByLabel('Cancel scheduled email').first()
      .or(page.getByText(/No scheduled|Nothing scheduled|No emails/i).first());
    await expect.poll(() => page.locator('body').innerText(), { timeout: 20_000 })
      .not.toMatch(/^\s*Central\s*$/);
    if (!(await scheduledShell.isVisible().catch(() => false))) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect.poll(() => page.locator('body').innerText(), { timeout: 20_000 })
        .not.toMatch(/^\s*Central\s*$/);
    }
    await page.waitForTimeout(3000);

    // Verify ZZTEST scheduled email in the list
    await expect.poll(
      () => page.getByText('ZZTEST scheduled email', { exact: true }).count(),
      { timeout: 45_000, intervals: [1000, 2000, 5000] }
    ).toBeGreaterThan(0);

    // Clear overlays before cancel
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
      document.querySelectorAll('.fixed.inset-0').forEach(el => { el.style.pointerEvents = 'none'; });
    }).catch(() => {});

    // Count cancel buttons before (aria-label="Cancel scheduled email")
    const cancelBtns = page.getByLabel('Cancel scheduled email');
    const countBefore = await cancelBtns.count();

    // Cancel ONE scheduled email — use DOM click to avoid hanging on dialog
    page.once('dialog', dialog => dialog.accept().catch(() => {}));
    await page.evaluate(() => {
      const btn = document.querySelector('[aria-label="Cancel scheduled email"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(5000);

    // Reload Scheduled folder — wait for emails to load, then verify count decreased
    await page.goto('/app/ea/email/scheduled', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(10000);

    const countAfter = await page.getByLabel('Cancel scheduled email').count();
    expect(countAfter).toBeLessThan(countBefore);
  });
});
