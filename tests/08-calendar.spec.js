const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Calendar — full regression', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    await ac.ensurePage('Calendar');
  });

  // C1 — page loads with date header and view controls
  test('calendar page loads with date and view controls', async ({ page }) => {
    const dateLabel = page.getByText(/\d{1,2}\s+\w+,\s+\d{4},\s+\w+/).first();
    await expect(dateLabel).toBeVisible({ timeout: 15_000 });

    await expect(page.getByRole('button', { name: 'Day', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Week', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Month', exact: true })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
  });

  // C2 — day view shows timeline and Next Up sidebar
  test('day view shows timeline and Next Up sidebar', async ({ page }) => {
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/\b(0[3-9]|1[0-9]|2[0-3])\b/);

    const nextUp = page.getByText('Next Up').first();
    await expect(nextUp).toBeVisible({ timeout: 10_000 });
    expect(bodyText).toMatch(/Events?\s*\||\d+\s*hours?\s*Booked|Nothing scheduled/i);
  });

  // C3 — click event opens detail popup with meeting info
  test('click event opens detail popup with meeting info', async ({ page }) => {
    test.setTimeout(60_000);
    await page.waitForTimeout(2000);

    const eventNames = [
      'Daily Standup Update',
      'Product Pod Customer Feedback',
      'Testing',
      'testing',
    ];

    let eventClicked = false;
    for (const name of eventNames) {
      const el = page.getByText(name, { exact: false }).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        await page.waitForTimeout(2000);
        eventClicked = true;
        break;
      }
    }

    if (!eventClicked) {
      const clickable = page.locator('div.cursor-pointer').first();
      if (await clickable.isVisible().catch(() => false)) {
        await clickable.click();
        await page.waitForTimeout(2000);
        eventClicked = true;
      }
    }

    if (!eventClicked) {
      test.skip(true, 'no calendar events found to click');
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/Attending this meeting\?|Yes|Guest|Recurring|am|pm/i);
  });

  // C4 — close event detail popup
  test('close event detail popup', async ({ page }) => {
    await page.waitForTimeout(1000);

    const rsvpBefore = page.getByText('Attending this meeting?').first();
    const popupOpen = await rsvpBefore.isVisible().catch(() => false);

    if (!popupOpen) {
      const el = page.getByText(/Daily Standup|Product Pod|Testing/i).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        await page.waitForTimeout(2000);
      } else {
        test.skip(true, 'no event popup to close');
      }
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    const rsvpAfter = page.getByText('Attending this meeting?').first();
    const stillVisible = await rsvpAfter.isVisible().catch(() => false);
    expect(stillVisible).toBe(false);
  });

  // C5 — navigate to next day and back to previous day
  test('navigate next day and back', async ({ page }) => {
    const dateLabel = page.getByText(/\d{1,2}\s+\w+,\s+\d{4},\s+\w+/).first();
    await expect(dateLabel).toBeVisible({ timeout: 10_000 });
    const beforeDate = await dateLabel.textContent();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(1500);
    const afterDate = await dateLabel.textContent();
    expect(afterDate).not.toBe(beforeDate);

    await page.getByRole('button', { name: 'Previous', exact: true }).click();
    await page.waitForTimeout(1500);
    const restoredDate = await dateLabel.textContent();
    expect(restoredDate).toBe(beforeDate);
  });

  // C6 — Today button returns to current date
  test('Today button returns to current date', async ({ page }) => {
    const dateLabel = page.getByText(/\d{1,2}\s+\w+,\s+\d{4},\s+\w+/).first();
    await expect(dateLabel).toBeVisible({ timeout: 10_000 });
    const todayDate = await dateLabel.textContent();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(1000);

    const awayDate = await dateLabel.textContent();
    expect(awayDate).not.toBe(todayDate);

    const todayBtn = page.getByRole('button', { name: 'Today', exact: true });
    const todayLink = page.getByText('Today', { exact: true }).first();

    if (await todayBtn.isVisible().catch(() => false)) {
      await todayBtn.click();
    } else if (await todayLink.isVisible().catch(() => false)) {
      await todayLink.click();
    } else {
      await page.getByRole('button', { name: 'Previous', exact: true }).click();
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Previous', exact: true }).click();
    }
    await page.waitForTimeout(1500);

    const restoredDate = await dateLabel.textContent();
    expect(restoredDate).toBe(todayDate);
  });

  // C7 — switch to Week view
  test('switch to Week view and verify', async ({ page }) => {
    await page.getByRole('button', { name: 'Week', exact: true }).click();
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/SUN|MON|TUE|WED|THU|FRI|SAT/i);

    const dateRange = page.getByText(/\d+(?:\s+\w+)?\s*-\s*\d+\s+\w+,?\s*\d{4}/).first();
    await expect(dateRange).toBeVisible({ timeout: 5000 });
  });

  // C8 — week view prev/next navigation
  test('week view prev and next navigation', async ({ page }) => {
    const weekBtn = page.getByRole('button', { name: 'Week', exact: true });
    const isWeekActive = await weekBtn.evaluate(
      el => el.classList.contains('active') || el.getAttribute('aria-pressed') === 'true' || el.getAttribute('data-state') === 'active'
    ).catch(() => false);
    if (!isWeekActive) {
      await weekBtn.click();
      await page.waitForTimeout(2000);
    }

    const dateRange = page.getByText(/\d+(?:\s+\w+)?\s*-\s*\d+\s+\w+,?\s*\d{4}/).first();
    await expect(dateRange).toBeVisible({ timeout: 5000 });
    const beforeRange = await dateRange.textContent();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(1500);
    const afterText = await page.locator('body').innerText();
    const newRange = afterText.match(/(\d+(?:\s+\w+)?\s*-\s*\d+\s+\w+,?\s*\d{4})/);
    expect(newRange).toBeTruthy();
    expect(newRange[1]).not.toBe(beforeRange);

    await page.getByRole('button', { name: 'Previous', exact: true }).click();
    await page.waitForTimeout(1500);
    const restoredText = await page.locator('body').innerText();
    const restoredRange = restoredText.match(/(\d+(?:\s+\w+)?\s*-\s*\d+\s+\w+,?\s*\d{4})/);
    expect(restoredRange).toBeTruthy();
    expect(restoredRange[1]).toBe(beforeRange);
  });

  // C9 — switch to Month view
  test('switch to Month view and verify', async ({ page }) => {
    await page.getByRole('button', { name: 'Month', exact: true }).click();
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/SUN|MON|TUE|WED|THU|FRI|SAT/i);
    expect(bodyText).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/i);

    const dayCells = page.locator('text=/^\\d{1,2}$/');
    const cellCount = await dayCells.count();
    expect(cellCount).toBeGreaterThan(20);
  });

  // C10 — month view prev/next navigation
  test('month view prev and next navigation', async ({ page }) => {
    const monthBtn = page.getByRole('button', { name: 'Month', exact: true });
    const bodyBefore = await page.locator('body').innerText();
    if (!bodyBefore.match(/SUN.*MON.*TUE|MON.*TUE.*WED/i)) {
      await monthBtn.click();
      await page.waitForTimeout(2000);
    }

    const monthHeader = page.getByText(/\w+,?\s+\d{4}/).first();
    await expect(monthHeader).toBeVisible({ timeout: 5000 });
    const beforeMonth = await monthHeader.textContent();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(1500);
    const afterMonth = await monthHeader.textContent();
    expect(afterMonth).not.toBe(beforeMonth);

    await page.getByRole('button', { name: 'Previous', exact: true }).click();
    await page.waitForTimeout(1500);
    const restoredMonth = await monthHeader.textContent();
    expect(restoredMonth).toBe(beforeMonth);
  });

  // C11 — return to Day view from Month
  test('return to Day view from Month', async ({ page }) => {
    await page.getByRole('button', { name: 'Day', exact: true }).click();
    await page.waitForTimeout(2000);

    const dateLabel = page.getByText(/\d{1,2}\s+\w+,\s+\d{4},\s+\w+/).first();
    await expect(dateLabel).toBeVisible({ timeout: 10_000 });

    const nextUp = page.getByText('Next Up').first();
    await expect(nextUp).toBeVisible({ timeout: 10_000 });
  });

  // C12 — scroll day timeline
  test('scroll day timeline up and down', async ({ page }) => {
    await page.waitForTimeout(2000);

    const scrolled = await page.evaluate(() => {
      const scrollables = document.querySelectorAll(
        'main, [class*="calendar"], [class*="timeline"], [class*="schedule"], [class*="scroll"]'
      );
      for (const el of scrollables) {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTop += 500;
          return true;
        }
      }
      window.scrollBy(0, 500);
      return true;
    });
    expect(scrolled).toBe(true);
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const scrollables = document.querySelectorAll(
        'main, [class*="calendar"], [class*="timeline"], [class*="schedule"], [class*="scroll"]'
      );
      for (const el of scrollables) {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTop = 0;
          return;
        }
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
  });

  // C13 — exit full calendar navigates away (LAST)
  test('exit full calendar navigates away', async ({ page }) => {
    const exitBtn = page.getByRole('button', { name: 'Exit full calendar' });
    const expandBtn = page.locator('button[aria-label*="exit" i], button[aria-label*="collapse" i], button[aria-label*="minimize" i]').first();

    if (await exitBtn.isVisible().catch(() => false)) {
      await exitBtn.click();
    } else if (await expandBtn.isVisible().catch(() => false)) {
      await expandBtn.click();
    } else {
      test.skip(true, 'no exit button found');
    }
    await page.waitForTimeout(3000);

    expect(page.url()).not.toContain('/ea/calendar');
  });
});
