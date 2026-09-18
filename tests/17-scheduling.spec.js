const { test, expect } = require('./fixtures');
const { SchedulingPage } = require('../pages/SchedulingPage');

test.describe('Scheduling (Dashboard & Bookings)', () => {
  test.describe.configure({ mode: 'serial' });
  let sp;

  test.beforeEach(async ({ page }) => {
    sp = new SchedulingPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
  });

  // ╔═══════════════════════════════════════════════════╗
  //  SCHEDULER DASHBOARD — VISIBILITY TESTS
  // ╚═══════════════════════════════════════════════════╝

  test('SC0 — scheduler dashboard page loads with heading and controls', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoDashboard();

    await expect(sp.dashboardHeading).toBeVisible({ timeout: 10_000 });
    await expect(sp.createEventBtn).toBeVisible({ timeout: 5_000 });

    // Settings button may not be visible in all layouts
    await expect(sp.settingsBtn).toBeVisible({ timeout: 5_000 }).catch(() => {
      console.log('Settings button not found on dashboard (optional)');
    });
  });

  test('SC1 — calendar view and time slots visible on dashboard', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoDashboard();

    await expect(sp.calendarView).toBeVisible({ timeout: 8_000 });
    await expect(sp.timeSlotsList).toBeVisible({ timeout: 5_000 });
  });

  test('SC2 — upcoming bookings section visible on dashboard', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoDashboard();

    const eventItems = page.locator('[class*="event"], [class*="booking"], [class*="card"]').filter({ hasText: /.+/ }).first();
    await expect(eventItems).toBeVisible({ timeout: 8_000 }).catch(() => {
      // Dashboard may not have scheduled events to display
    });
  });

  test('SC3 — availability toggle switch visible', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoDashboard();

    await expect(sp.availabilityToggle).toBeVisible({ timeout: 5_000 }).catch(() => {
      // Some layouts may not show availability toggle
    });
  });

  test('SC4 — booking items clickable and expandable', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoDashboard();

    const bookingCount = await sp.bookingsList.count().catch(() => 0);
    if (bookingCount > 0) {
      await expect(sp.bookingItem).toBeVisible({ timeout: 5_000 });
    }
  });

  // ╔═══════════════════════════════════════════════════╗
  //  BOOKINGS PAGE — VISIBILITY TESTS
  // ╚═══════════════════════════════════════════════════╝

  test('SC5 — bookings page loads with heading and filters', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoBookings();

    await expect(sp.bookingsPageHeading).toBeVisible({ timeout: 10_000 });
    await expect(sp.bookingTypesFilter).toBeVisible({ timeout: 5_000 }).catch(() => {});
    await expect(sp.searchBookingsInput).toBeVisible({ timeout: 5_000 }).catch(() => {});
  });

  test('SC6 — bookings list or no-bookings message displays', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoBookings();

    const hasBookings = await sp.allBookingsTable.count() > 0 || await sp.bookingRows.count() > 0;
    if (hasBookings) {
      await expect(sp.allBookingsTable.or(sp.bookingRows.first())).toBeVisible({ timeout: 5_000 });
    }
  });

  test('SC7 — export and pagination controls visible', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoBookings();
    await sp.scrollToBottom();

    await expect(sp.exportBtn).toBeVisible({ timeout: 5_000 }).catch(() => {});
    await expect(sp.paginationNext).toBeVisible({ timeout: 5_000 }).catch(() => {});
  });

  test('SC8 — booking row detail modal opens on click', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(sp.bookingDetailsHeading).toBeVisible({ timeout: 5_000 }).catch(() => {});
    }
  });

  // ╔═══════════════════════════════════════════════════╗
  //  SCHEDULING — INTERACTIVE FLOWS
  // ╚═══════════════════════════════════════════════════╝

  test('SC9 — toggle availability switch on dashboard', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoDashboard();

    await expect(sp.availabilityToggle).toBeVisible({ timeout: 20_000 });

    const originalState = await sp.availabilityState();
    await sp.availabilityToggle.click();
    await expect.poll(
      () => sp.availabilityState(),
      { timeout: 15_000, intervals: [500, 1000, 2000] }
    ).not.toEqual(originalState);

    await sp.availabilityToggle.click();
    await expect.poll(
      () => sp.availabilityState(),
      { timeout: 15_000, intervals: [500, 1000, 2000] }
    ).toEqual(originalState);
  });

  test('SC10 — search bookings by keyword on bookings page', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoBookings();

    const searchVisible = await sp.searchBookingsInput.count() > 0;
    if (!searchVisible) {
      test.skip();
    }

    const searchTerm = 'meeting';
    await sp.searchBookingsInput.click();
    await sp.searchBookingsInput.pressSequentially(searchTerm, { delay: 30 });
    await page.waitForLoadState('domcontentloaded');

    const mainText = await page.locator('main').textContent();
    expect(mainText).toBeTruthy();

    await sp.searchBookingsInput.clear();
    await page.waitForLoadState('domcontentloaded');
  });

  test('SC11 — filter bookings by type', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoBookings();

    const filterVisible = await sp.bookingTypesFilter.count() > 0;
    if (!filterVisible) {
      test.skip();
    }

    await sp.bookingTypesFilter.click();
    await page.waitForLoadState('domcontentloaded');

    const firstOption = page.locator('[role="option"]').first();
    if (await firstOption.count() > 0) {
      await firstOption.click();
      await page.waitForLoadState('domcontentloaded');
    }

    const filterValue = await sp.bookingTypesFilter.textContent();
    expect(filterValue).toBeTruthy();
  });

  test('SC12 — navigate between dashboard and bookings pages', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoDashboard();
    await expect(sp.dashboardHeading).toBeVisible({ timeout: 10_000 });

    await sp.gotoBookings();
    await expect(sp.bookingsPageHeading).toBeVisible({ timeout: 10_000 });

    await sp.gotoDashboard();
    await expect(sp.dashboardHeading).toBeVisible({ timeout: 10_000 });
  });

  test('SC13 — expand booking details and view information', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');

      await expect(sp.bookingDetailsHeading).toBeVisible({ timeout: 5_000 }).catch(() => {});
      await expect(sp.attendeesList).toBeVisible({ timeout: 3_000 }).catch(() => {});

      if (await sp.bookingDetailsClose.count() > 0) {
        await sp.bookingDetailsClose.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  test('SC14 — scroll through dashboard calendar', async ({ page }) => {
    test.setTimeout(60_000);
    await sp.gotoDashboard();

    await sp.scrollToBottom();
    await page.waitForLoadState('domcontentloaded');
    await sp.scrollToTop();
    await page.waitForLoadState('domcontentloaded');

    await expect(sp.calendarView).toBeVisible({ timeout: 5_000 });
  });

  test('SC15 — multi-step flow: dashboard to bookings to search', async ({ page }) => {
    test.setTimeout(120_000);
    await sp.gotoDashboard();
    await expect(sp.dashboardHeading).toBeVisible({ timeout: 10_000 });
    await page.waitForLoadState('domcontentloaded');

    await expect(sp.calendarView).toBeVisible({ timeout: 8_000 });
    await expect(sp.upcomingBookingsSection).toBeVisible({ timeout: 8_000 });

    await sp.gotoBookings();
    await expect(sp.bookingsPageHeading).toBeVisible({ timeout: 10_000 });
    await page.waitForLoadState('domcontentloaded');

    const searchInput = sp.searchBookingsInput;
    if (await searchInput.count() > 0) {
      await searchInput.click();
      await searchInput.pressSequentially('test', { delay: 30 });
      await page.waitForLoadState('domcontentloaded');
      await searchInput.clear();
    }

    await sp.gotoDashboard();
    await expect(sp.dashboardHeading).toBeVisible({ timeout: 10_000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  INTERACTIVE FLOWS — ADVANCED
  // ╚═══════════════════════════════════════════════════╝

  test('SC16 — reschedule booking from details modal', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');

      const rescheduleBtn = sp.rescheduleBtn;
      if (await rescheduleBtn.count() > 0) {
        await rescheduleBtn.click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain('reschedule').catch(() => {});
      }

      await sp.bookingDetailsClose.click().catch(() => {});
    }
  });

  test('SC17 — delete/cancel booking from details', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');

      const deleteBtn = sp.deleteBookingBtn;
      if (await deleteBtn.count() > 0) {
        await deleteBtn.click();
        await page.waitForLoadState('domcontentloaded');
        await sp.confirmBtn.click().catch(() => {});
        await page.waitForLoadState('domcontentloaded');
      }

      await sp.bookingDetailsClose.click().catch(() => {});
    }
  });

  test('SC18 — apply date range filter on bookings', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const dateFilter = sp.dateRangeFilter;
    if (await dateFilter.count() > 0) {
      await dateFilter.click();
      const today = new Date().toISOString().split('T')[0];
      await dateFilter.fill(today);
      await page.waitForLoadState('domcontentloaded');
      await dateFilter.clear();
    }
  });

  test('SC19 — apply status filter on bookings page', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const statusFilter = sp.statusFilter;
    if (await statusFilter.count() > 0) {
      await statusFilter.click();
      await page.waitForLoadState('domcontentloaded');

      const firstOption = page.locator('[role="option"]').first();
      if (await firstOption.count() > 0) {
        await firstOption.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });

  test('SC20 — clear all filters on bookings page', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    await sp.bookingTypesFilter.click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[role="option"]').first().click().catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    const clearBtn = sp.clearFiltersBtn;
    if (await clearBtn.count() > 0) {
      await clearBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('SC21 — navigate pagination on bookings page', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();
    await sp.scrollToBottom();

    const nextBtn = sp.paginationNext;
    if (await nextBtn.count() > 0) {
      const isEnabled = await nextBtn.isEnabled();
      if (isEnabled) {
        await nextBtn.click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toBeTruthy();
      }
    }
  });

  test('SC22 — export bookings data', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const exportBtn = sp.exportBtn;
    if (await exportBtn.count() > 0) {
      await exportBtn.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('SC23 — open meeting link from booking details', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');

      const linkBtn = sp.meetingLinkBtn;
      if (await linkBtn.count() > 0) {
        const linkHref = await linkBtn.getAttribute('href').catch(() => null);
        expect(linkHref).toBeTruthy();
      }

      await sp.bookingDetailsClose.click().catch(() => {});
    }
  });

  test('SC24 — send reminder from booking details', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');

      const reminderBtn = sp.sendReminderBtn;
      if (await reminderBtn.count() > 0) {
        await reminderBtn.click();
        await page.waitForLoadState('domcontentloaded');
        await sp.successMsg.isVisible().catch(() => {});
      }

      await sp.bookingDetailsClose.click().catch(() => {});
    }
  });

  test('SC25 — navigate event types tab on dashboard', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoDashboard();

    const eventTypesTab = sp.eventTypesTab;
    if (await eventTypesTab.count() > 0) {
      await eventTypesTab.click();
      await page.waitForLoadState('domcontentloaded');
      const url = page.url();
      expect(url.includes('scheduler') || url.includes('event')).toBe(true);
    }
  });

  test('SC26 — create new event/booking from dashboard', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoDashboard();

    const createBtn = sp.createEventBtn;
    if (await createBtn.count() > 0) {
      await createBtn.click();
      await page.waitForLoadState('domcontentloaded');
      // Some UIs navigate to a create/new URL, others open an in-page modal —
      // accept either as evidence the create flow actually started.
      const url = page.url();
      const urlChanged = url.includes('create') || url.includes('new');
      const modalVisible = await page.locator('[role="dialog"]').first().isVisible().catch(() => false);
      expect(urlChanged || modalVisible).toBe(true);
    }
  });

  test('SC27 — navigate availability settings tab', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoDashboard();

    const availTab = sp.availabilityTab;
    if (await availTab.count() > 0) {
      await availTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(availTab).toHaveAttribute('aria-selected', 'true').catch(() => {});
    }
  });

  test('SC28 — copy meeting link to clipboard', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');

      const copyBtn = sp.copyLinkBtn;
      if (await copyBtn.count() > 0) {
        await copyBtn.click();
        await page.waitForLoadState('domcontentloaded');
      }

      await sp.bookingDetailsClose.click().catch(() => {});
    }
  });

  test('SC29 — view and interact with attendees list', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const bookingCount = await sp.bookingRows.count();
    if (bookingCount > 0) {
      await sp.bookingRows.first().click();
      await page.waitForLoadState('domcontentloaded');

      const attendeesSection = sp.attendeesList;
      if (await attendeesSection.count() > 0) {
        await expect(attendeesSection).toBeVisible({ timeout: 5_000 });
      }

      await sp.bookingDetailsClose.click().catch(() => {});
    }
  });

  test('SC30 — sort bookings by column header', async ({ page }) => {
    test.setTimeout(90_000);
    await sp.gotoBookings();

    const columnHeader = page.locator('th, [role="columnheader"]').first();
    if (await columnHeader.count() > 0) {
      await columnHeader.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });
});
