const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test('explore calendar page — dump all elements', async ({ page }) => {
  const ac = new AskCentralPage(page);
  // Navigate to Your Day first, then click the Calendar sidebar link
  await ac.ensurePage('Your Day');
  await page.waitForLoadState('networkidle');
  await page.locator('a[href="/app/ea/calendar"]').click();
  await page.waitForLoadState('networkidle');

  // Screenshot full page
  await page.screenshot({ path: 'debug-cal-full.png', fullPage: false });

  // Dump all buttons
  const buttons = await page.evaluate(() => {
    const btns = document.querySelectorAll('button, [role="button"]');
    return Array.from(btns).map(b => ({
      name: b.getAttribute('aria-label') || b.textContent?.trim().slice(0, 80) || '',
      tag: b.tagName,
      visible: b.offsetParent !== null,
    })).filter(b => b.visible && b.name);
  });
  console.log('BUTTONS:', JSON.stringify(buttons, null, 2));

  // Dump all links
  const links = await page.evaluate(() => {
    const anchors = document.querySelectorAll('a[href]');
    return Array.from(anchors).map(a => ({
      text: a.textContent?.trim().slice(0, 80) || '',
      href: a.href,
      visible: a.offsetParent !== null,
    })).filter(a => a.visible && a.text);
  });
  console.log('LINKS:', JSON.stringify(links, null, 2));

  // Dump all headings
  const headings = await page.evaluate(() => {
    const hs = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(hs).map(h => ({
      level: h.tagName,
      text: h.textContent?.trim().slice(0, 80),
      visible: h.offsetParent !== null,
    })).filter(h => h.visible);
  });
  console.log('HEADINGS:', JSON.stringify(headings, null, 2));

  // Now click "Week" view and screenshot
  const weekBtn = page.getByRole('button', { name: 'Week', exact: true });
  if (await weekBtn.isVisible().catch(() => false)) {
    await weekBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'debug-cal-week.png', fullPage: false });
  }

  // Click "Month" view and screenshot
  const monthBtn = page.getByRole('button', { name: 'Month', exact: true });
  if (await monthBtn.isVisible().catch(() => false)) {
    await monthBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'debug-cal-month.png', fullPage: false });
  }

  // Go back to Day view
  const dayBtn = page.getByRole('button', { name: 'Day', exact: true });
  if (await dayBtn.isVisible().catch(() => false)) {
    await dayBtn.click();
    await page.waitForLoadState('domcontentloaded');
  }
  
  // Try clicking on a calendar event
  const events = await page.evaluate(() => {
    const allEls = document.querySelectorAll('*');
    const results = [];
    for (const el of allEls) {
      const text = el.textContent?.trim() || '';
      if ((text.includes('Standup') || text.includes('Product Pod') || text.includes('Testing'))
          && el.offsetParent && el.children.length < 5 && text.length < 200) {
        results.push({
          tag: el.tagName,
          text: text.slice(0, 100),
          role: el.getAttribute('role') || '',
          clickable: el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button' || el.style.cursor === 'pointer',
          classes: el.className?.toString().slice(0, 100) || '',
        });
      }
    }
    return results;
  });
  console.log('EVENT ELEMENTS:', JSON.stringify(events, null, 2));

  // Click on first event text
  const eventEl = page.getByText('Daily Standup Update').first();
  if (await eventEl.isVisible().catch(() => false)) {
    await eventEl.click();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'debug-cal-event-click.png', fullPage: false });

    // Dump what appeared (modal/panel)
    const modalButtons = await page.evaluate(() => {
      const dialogs = document.querySelectorAll('[role="dialog"], [data-state="open"], [class*="modal"], [class*="popover"], [class*="popup"]');
      const results = [];
      for (const d of dialogs) {
        if (d.offsetParent) {
          results.push({
            tag: d.tagName,
            role: d.getAttribute('role'),
            text: d.textContent?.trim().slice(0, 300),
          });
        }
      }
      return results;
    });
    console.log('MODAL/DIALOG AFTER EVENT CLICK:', JSON.stringify(modalButtons, null, 2));
  }

  // Navigate to previous day and screenshot
  const prevBtn = page.getByRole('button', { name: 'Previous', exact: true });
  if (await prevBtn.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
    await prevBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'debug-cal-prevday.png', fullPage: false });
  }
});
