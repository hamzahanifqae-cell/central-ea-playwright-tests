const { test, expect } = require('./fixtures');
const { AskCentralPage } = require('../pages/AskCentralPage');

test.describe('Your Day — full regression', () => {
  test.describe.configure({ mode: 'serial' });
  let ac;

  test.beforeEach(async ({ page }) => {
    ac = new AskCentralPage(page);
    await ac.ensurePage('Your Day');
  });

  // YD1 — page loads with greeting and status pills
  test('page loads with greeting and status pills', async ({ page }) => {
    const greeting = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
    await expect(greeting).toBeVisible({ timeout: 15_000 });

    const needApproval = page.getByText('Need Approval').first();
    const urgent = page.getByText('Urgent').first();
    const handled = page.getByText('Handled').first();
    await expect(needApproval).toBeVisible();
    await expect(urgent).toBeVisible();
    await expect(handled).toBeVisible();
  });

  // YD2 — sync status bar is visible
  test('sync status bar shows connected apps', async ({ page }) => {
    const syncText = page.getByText(/Synced.*across/i).first();
    await expect(syncText).toBeVisible({ timeout: 10_000 });

    const settingsBtn = page.getByRole('button', { name: 'Daily briefing settings', exact: true });
    await expect(settingsBtn).toBeVisible();
  });

  // YD3 — composer input bar with Voice, Dictate, Send
  test('composer bar visible with Voice, Dictate, Send buttons', async ({ page }) => {
    const input = page.getByPlaceholder(/Ask me anything/i).first();
    await expect(input).toBeVisible();

    const voiceBtn = page.getByRole('button', { name: 'Voice mode' });
    const dictateBtn = page.getByRole('button', { name: 'Dictate' });
    const sendBtn = page.getByRole('button', { name: 'Send' });
    await expect(voiceBtn).toBeVisible();
    await expect(dictateBtn).toBeVisible();
    await expect(sendBtn).toBeVisible();
  });

  // YD4 — Evening Summary section renders with work updates
  test('evening summary section renders with work updates', async ({ page }) => {
    test.setTimeout(120_000);
    const summaryTitle = page.getByText(/Evening Summary|Morning Summary|Afternoon Summary/i).first();
    await expect(summaryTitle).toBeVisible({ timeout: 10_000 });

    // Summary might be generating — wait for it to finish (up to 90s)
    const workUpdates = page.getByText('WORK UPDATES').first();
    await expect(workUpdates).toBeVisible({ timeout: 90_000 });

    const viewContextBtns = page.getByText('View Context');
    const count = await viewContextBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  // YD5 — summary action buttons (Refresh, Edit settings, Collapse)
  test('summary action buttons are visible and clickable', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /Refresh (morning|afternoon|evening) summary/i });
    const editBtn = page.getByRole('button', { name: 'Edit daily briefing settings' });
    const collapseBtn = page.getByRole('button', { name: 'Collapse', exact: true });

    await expect(refreshBtn).toBeVisible({ timeout: 10_000 });
    await expect(editBtn).toBeVisible();
    await expect(collapseBtn).toBeVisible();
  });

  // YD6 — View Context expands and collapses a work update
  test('View Context expands and collapses on work update', async ({ page }) => {
    const firstViewCtx = page.getByText('View Context').first();
    await expect(firstViewCtx).toBeVisible({ timeout: 10_000 });

    // Get body text before expand
    const beforeText = await page.locator('body').innerText();

    // Click to expand
    await firstViewCtx.click();
    await page.waitForTimeout(1000);

    // After expand, there should be more text visible (context content)
    const afterText = await page.locator('body').innerText();
    expect(afterText.length).toBeGreaterThan(beforeText.length);

    // Click again to collapse
    await firstViewCtx.click();
    await page.waitForTimeout(500);
  });

  // YD7 — summary section collapses and expands
  test('summary section collapses and expands', async ({ page }) => {
    const collapseBtn = page.getByRole('button', { name: 'Collapse', exact: true });
    await expect(collapseBtn).toBeVisible({ timeout: 10_000 });

    const workUpdates = page.getByText('WORK UPDATES').first();
    await expect(workUpdates).toBeVisible();

    // Collapse
    await collapseBtn.click();
    await page.waitForTimeout(1000);

    // Work updates should be hidden
    const updatesVisible = await workUpdates.isVisible().catch(() => false);
    expect(updatesVisible).toBe(false);

    // Expand again (button label changes to "Expand" or stays same area)
    const expandBtn = page.getByRole('button', { name: 'Expand', exact: true });
    const collapseAgain = page.getByRole('button', { name: 'Collapse', exact: true });
    if (await expandBtn.isVisible().catch(() => false)) {
      await expandBtn.click();
    } else if (await collapseAgain.isVisible().catch(() => false)) {
      await collapseAgain.click();
    }
    await page.waitForTimeout(1000);

    // Work updates should be visible again
    await expect(workUpdates).toBeVisible({ timeout: 5000 });
  });

  // YD8 — Your To-Dos section visible with tabs
  test('Your To-Dos section visible with Ready for You and Done For You tabs', async ({ page }) => {
    const todosTitle = page.getByText('Your To-Dos').first();
    await expect(todosTitle).toBeVisible();

    const readyTab = page.getByText('Ready for You').first();
    const doneTab = page.getByText('Done For You').first();
    await expect(readyTab).toBeVisible();
    await expect(doneTab).toBeVisible();
  });

  // YD9 — switch between To-Do tabs
  test('To-Do tabs switch between Ready for You and Done For You', async ({ page }) => {
    const readyTab = page.getByText('Ready for You').first();
    const doneTab = page.getByText('Done For You').first();
    await expect(readyTab).toBeVisible();

    // Click Done For You tab
    await doneTab.click();
    await page.waitForTimeout(1500);

    // Should show done items or content
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/Done For You|Drafted|View Drafts|completed/i);

    // Click Ready for You tab
    await readyTab.click();
    await page.waitForTimeout(1000);

    const readyText = await page.locator('body').innerText();
    expect(readyText).toMatch(/Ready for You|All clear|caught up/i);
  });

  // YD10 — Done For You tab shows content (items or empty state)
  test('Done For You tab shows content when clicked', async ({ page }) => {
    const doneTab = page.getByText('Done For You').first();
    await expect(doneTab).toBeVisible();
    await doneTab.click();
    await page.waitForTimeout(1500);

    // May have done items (View Drafts, Done label) or empty state (All clear)
    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText.includes('View Drafts') ||
      bodyText.includes('Done') ||
      bodyText.includes('All clear') ||
      bodyText.includes('caught up') ||
      bodyText.includes('Drafted');
    expect(hasContent).toBe(true);

    // Switch back
    await page.getByText('Ready for You').first().click();
    await page.waitForTimeout(500);
  });

  // YD11 — calendar sidebar visible with date and events info
  test('calendar sidebar visible with date and navigation', async ({ page }) => {
    const calTitle = page.getByText('Your Day').first();
    await expect(calTitle).toBeVisible({ timeout: 10_000 });

    const nextUp = page.getByText(/Next Up/i).first();
    await expect(nextUp).toBeVisible();

    const eventsInfo = page.getByText(/Events.*hours? Booked/i).first();
    await expect(eventsInfo).toBeVisible();

    const prevDay = page.getByRole('button', { name: 'Previous day' });
    const nextDay = page.getByRole('button', { name: 'Next day' });
    await expect(prevDay).toBeVisible();
    await expect(nextDay).toBeVisible();
  });

  // YD12 — calendar day navigation changes date
  test('calendar navigation switches between days', async ({ page }) => {
    const calendar = page.getByText(/Next Up/i).first()
      .locator('xpath=ancestor::*[.//button[@aria-label="Next day"]][1]');
    await expect(calendar).toBeVisible({ timeout: 10_000 });
    const beforeCalendar = await calendar.innerText();

    // Click next day
    const nextDay = page.getByRole('button', { name: 'Next day' });
    await nextDay.click();
    await page.waitForTimeout(1000);

    const afterCalendar = await calendar.innerText();
    expect(afterCalendar).not.toBe(beforeCalendar);

    // Click previous day to go back
    const prevDay = page.getByRole('button', { name: 'Previous day' });
    await prevDay.click();
    await page.waitForTimeout(1000);

    const restoredCalendar = await calendar.innerText();
    expect(restoredCalendar).toBe(beforeCalendar);
  });

  // YD13 — connect apps banner visible
  test('connect apps banner visible with Connect button', async ({ page }) => {
    const banner = page.getByText(/Connect more apps/i).first();
    const connectBtn = page.getByRole('button', { name: 'Connect' }).first();
    const dismissBtn = page.getByRole('button', { name: 'Dismiss' }).first();

    // Banner might have been dismissed previously
    const bannerVisible = await banner.isVisible().catch(() => false);
    if (bannerVisible) {
      await expect(connectBtn).toBeVisible();
      await expect(dismissBtn).toBeVisible();
    } else {
      // Banner was already dismissed — verify page still works
      const greeting = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
      await expect(greeting).toBeVisible();
    }
  });

  // YD14 — settings gear button opens settings and returns
  test('settings button opens daily briefing settings and returns', async ({ page }) => {
    // Wait for page content to load (may be first test running)
    const greeting = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
    await expect(greeting).toBeVisible({ timeout: 30_000 });

    const settingsBtn = page.getByRole('button', { name: 'Daily briefing settings', exact: true });
    await expect(settingsBtn).toBeVisible({ timeout: 10_000 });
    await settingsBtn.click();
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(
      page.url().includes('settings') || /daily briefing|briefing settings|configure/i.test(bodyText)
    ).toBe(true);

    await ac.ensurePage('Your Day');
    const greetingBack = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
    await expect(greetingBack).toBeVisible({ timeout: 10_000 });
  });

  // YD15 — Send opens Ask Central panel with greeting and suggestions
  test('send button opens Ask Central modal with greeting and suggestions', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Voice mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dictate' })).toBeVisible();

    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);

    // Panel is a <dialog> without [open] — Playwright treats contents as hidden
    // Use toBeAttached() and force:true for interactions
    await expect(page.getByRole('button', { name: 'Show History' })).toBeAttached({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'More options' })).toBeAttached();
    await expect(page.getByRole('button', { name: 'Expand', exact: true })).toBeAttached();
    await expect(page.getByRole('button', { name: 'Minimize' })).toBeAttached();

    // Greeting heading
    await expect(page.getByRole('heading', { name: /how can I help you today/i })).toBeAttached();

    // Three suggestion buttons
    await expect(page.getByRole('button', { name: /Find and give an overview of my upcoming meetings/i })).toBeAttached();
    await expect(page.getByRole('button', { name: /Review my recent emails/i })).toBeAttached();
    await expect(page.getByRole('button', { name: /Check my upcoming events and recent emails/i })).toBeAttached();

    // Input area controls present
    await expect(page.getByRole('button', { name: 'Prompts' })).toBeAttached();
    await expect(page.getByRole('button', { name: 'Attach files' })).toBeAttached();
    await expect(page.getByRole('button', { name: 'Ask', exact: true })).toBeAttached();

    // Close panel
    await page.getByRole('button', { name: 'Minimize' }).click({ force: true });
    await page.waitForTimeout(500);
  });

  // YD16 — send message in modal and receive AI response
  test('send message in Ask Central modal and receive AI response', async ({ page }) => {
    test.setTimeout(120_000);

    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('button', { name: 'Show History' })).toBeAttached({ timeout: 10_000 });

    // Type message in modal's textbox (last one — first is the main page's hidden one)
    const modalInput = page.getByPlaceholder('Ask me anything...').last();
    await modalInput.click({ force: true });
    await modalInput.pressSequentially('is there any meeting today', { delay: 30 });
    await page.waitForTimeout(500);

    // Ask button should now be enabled — click it
    await page.getByRole('button', { name: 'Ask', exact: true }).click({ force: true });

    // Wait for AI response (can take a long time)
    await page.waitForTimeout(30_000);

    // Verify the dialog now has more content (AI response text)
    const dialogText = await page.evaluate(() => {
      const dialogs = document.querySelectorAll('dialog, [role="dialog"]');
      for (const d of dialogs) {
        if (d.textContent.includes('Ask Central')) return d.textContent;
      }
      return '';
    });
    expect(dialogText.length).toBeGreaterThan(200);
  });

  // YD17 — modal header buttons, input controls, expand and minimize
  test('Ask Central modal — history, options, prompts, attach, expand, minimize', async ({ page }) => {
    // Helper: reopen the Ask Central panel if it was closed
    async function ensurePanel() {
      const count = await page.getByRole('button', { name: 'Show History' }).count();
      if (count === 0) {
        await page.getByRole('button', { name: 'Send' }).click();
        await page.waitForTimeout(2000);
        await expect(page.getByRole('button', { name: 'Show History' })).toBeAttached({ timeout: 10_000 });
      }
    }

    await ensurePanel();

    // --- HEADER BUTTONS ---

    // Show History
    await page.getByRole('button', { name: 'Show History' }).click({ force: true });
    await page.waitForTimeout(1500);
    // Go back — click New Chat in history view, or reopen panel
    const newChatBtn = page.getByRole('button', { name: /new chat/i });
    if (await newChatBtn.count().then(c => c > 0).catch(() => false)) {
      await newChatBtn.click({ force: true });
      await page.waitForTimeout(1000);
    }

    // More options — click to open, then dismiss by clicking panel title
    await ensurePanel();
    await page.getByRole('button', { name: 'More options' }).click({ force: true });
    await page.waitForTimeout(1000);
    // Dismiss dropdown by clicking on the panel heading instead of the button
    const askCentralTitle = page.getByText('Ask Central').first();
    await askCentralTitle.click({ force: true });
    await page.waitForTimeout(500);

    // --- INPUT CONTROLS ---

    await ensurePanel();

    // Prompts
    await page.getByRole('button', { name: 'Prompts' }).click({ force: true });
    await page.waitForTimeout(1000);
    // Close prompts by clicking the button again
    await page.getByRole('button', { name: 'Prompts' }).click({ force: true }).catch(() => {});
    await page.waitForTimeout(500);

    // Attach files
    await ensurePanel();
    await page.getByRole('button', { name: 'Attach files' }).click({ force: true });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Attach files' }).click({ force: true }).catch(() => {});
    await page.waitForTimeout(500);

    // --- EXPAND / MINIMIZE ---

    await ensurePanel();

    // Expand to full screen
    await page.getByRole('button', { name: 'Expand', exact: true }).click({ force: true });
    await page.waitForTimeout(1000);

    // Minimize back
    await page.getByRole('button', { name: 'Minimize' }).click({ force: true });
    await page.waitForTimeout(1000);

    // Verify Your Day page is still functional
    const greeting = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
    await expect(greeting).toBeVisible({ timeout: 10_000 });
  });

  // YD18 — Summary: scroll down, press refresh, press briefing settings
  test('summary scroll down, refresh, and briefing settings button', async ({ page }) => {
    test.setTimeout(120_000);

    const summaryTitle = page.getByText(/Evening Summary|Morning Summary|Afternoon Summary/i).first();
    await expect(summaryTitle).toBeVisible({ timeout: 10_000 });
    const workUpdates = page.getByText('WORK UPDATES').first();
    await expect(workUpdates).toBeVisible({ timeout: 90_000 });

    // Scroll down through summary to see all work updates
    const lastViewCtx = page.getByText('View Context').last();
    await lastViewCtx.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Scroll back to top of summary
    await summaryTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Press refresh summary button
    const refreshBtn = page.getByRole('button', { name: /Refresh (morning|afternoon|evening) summary/i });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
    await page.waitForTimeout(5000);

    // Press briefing settings button (pencil icon next to refresh)
    const editBtn = page.getByRole('button', { name: 'Edit daily briefing settings' });
    await expect(editBtn).toBeVisible({ timeout: 15_000 });
    await editBtn.click();
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(
      page.url().includes('settings') || /daily briefing|briefing settings|configure/i.test(bodyText)
    ).toBe(true);

    // Return to Your Day
    await ac.ensurePage('Your Day');
    const greetingYD18 = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
    await expect(greetingYD18).toBeVisible({ timeout: 15_000 });
  });

  // YD19 — To-Dos: refresh, Done For You, view task, go back
  test('To-Dos refresh, Done For You tab, and view task', async ({ page }) => {
    // Press refresh on To-Dos section
    const refreshTodos = page.getByRole('button', { name: 'Check for new to-dos' });
    await expect(refreshTodos).toBeVisible({ timeout: 10_000 });
    await refreshTodos.click();
    await page.waitForTimeout(2000);

    // Press Done For You tab
    const doneTab = page.getByText('Done For You').first();
    await expect(doneTab).toBeVisible();
    await doneTab.click();
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/View Drafts|View Task|Drafted|Done|All clear|caught up/i);

    // Try to click View Drafts / View Task if available
    const viewBtn = page.getByText(/View Drafts|View Task/i).first();
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();
      await page.waitForTimeout(3000);
      await ac.ensurePage('Your Day');
      await page.waitForTimeout(2000);
    } else {
      // Scroll the Done For You section
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }

    // Switch back to Ready for You
    const readyTab = page.getByText('Ready for You').first();
    if (await readyTab.isVisible().catch(() => false)) {
      await readyTab.click();
      await page.waitForTimeout(1000);
    }
  });

  // YD20 — Calendar: expand, click Next Up meeting link, close modal
  test('expand calendar and click Next Up meeting link', async ({ page }) => {
    // Click expand/open calendar button in the sidebar
    const openCalBtn = page.getByRole('button', { name: 'Open calendar' }).last();
    await expect(openCalBtn).toBeVisible({ timeout: 10_000 });
    await openCalBtn.click();
    await page.waitForTimeout(3000);

    // We're now on the full Calendar page
    await expect(page.getByRole('button', { name: 'Exit full calendar' })).toBeVisible({ timeout: 10_000 });

    // Check Next Up sidebar for a meeting link
    const nextUpHeading = page.getByText(/Next Up/i).first();
    await expect(nextUpHeading).toBeVisible();

    const nothingScheduled = page.getByText(/Nothing scheduled/i).first();
    const hasNoMeeting = await nothingScheduled.isVisible().catch(() => false);

    if (!hasNoMeeting) {
      // Meeting exists in Next Up — click the meeting link (not Join button)
      const nextUpParent = nextUpHeading.locator('xpath=ancestor::div[1]/..');
      const meetingLink = nextUpParent.locator('a').first();
      if (await meetingLink.isVisible().catch(() => false)) {
        await meetingLink.click();
        await page.waitForTimeout(2000);
        const closeBtn = page.getByRole('button', { name: /close|back|cancel/i }).first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(1000);
      }
    } else {
      // No meeting in Next Up — click a calendar event on the timeline as fallback
      const calEvent = page.getByText(/Daily Standup|Product Pod|Feedback|Escalation/i).first();
      if (await calEvent.isVisible().catch(() => false)) {
        await calEvent.click();
        await page.waitForTimeout(2000);
        const closeBtn = page.getByRole('button', { name: /close|back|cancel/i }).first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(1000);
      }
    }

    // Return to Your Day
    await ac.ensurePage('Your Day');
    const greetingYD20 = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
    await expect(greetingYD20).toBeVisible({ timeout: 15_000 });
  });

  // YD21 — Calendar: expand, day navigation forward/backward, scroll
  test('calendar expand, day navigation, and scroll', async ({ page }) => {
    // Expand calendar
    const openCalBtn = page.getByRole('button', { name: 'Open calendar' }).last();
    await expect(openCalBtn).toBeVisible({ timeout: 10_000 });
    await openCalBtn.click();
    await page.waitForTimeout(3000);

    // Verify we're on the full Calendar page
    await expect(page.getByRole('button', { name: 'Exit full calendar' })).toBeVisible({ timeout: 10_000 });

    // Get current date text (format: "1 September, 2026, Tuesday")
    const dateLabel = page.getByText(/\d{1,2}\s+\w+,\s+\d{4},\s+\w+/).first();
    await expect(dateLabel).toBeVisible({ timeout: 10_000 });
    const beforeDate = await dateLabel.textContent();

    // Navigate forward (next)
    const nextBtn = page.getByRole('button', { name: 'Next', exact: true });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForTimeout(1500);

    const afterDate = await dateLabel.textContent();
    expect(afterDate).not.toBe(beforeDate);

    // Navigate backward (previous)
    const prevBtn = page.getByRole('button', { name: 'Previous', exact: true });
    await prevBtn.click();
    await page.waitForTimeout(1500);

    const restoredDate = await dateLabel.textContent();
    expect(restoredDate).toBe(beforeDate);

    // Scroll down the calendar timeline
    await page.evaluate(() => {
      const scrollables = document.querySelectorAll('main, [class*="calendar"], [class*="timeline"], [class*="schedule"]');
      for (const el of scrollables) {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTop += 500;
          return;
        }
      }
      window.scrollBy(0, 500);
    });
    await page.waitForTimeout(1000);

    // Return to Your Day
    await ac.ensurePage('Your Day');
    const greetingYD21 = page.locator('body').getByText(/Good (Morning|Afternoon|Evening)/i).first();
    await expect(greetingYD21).toBeVisible({ timeout: 15_000 });
  });
});
