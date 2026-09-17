const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class SchedulingPage {
  constructor(page) { this.page = page; }

  async gotoDashboard() {
    await this.page.goto(ROUTES['Scheduler Dashboard'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await expect(this.dashboardHeading).toBeVisible({ timeout: 20_000 });
  }

  async gotoBookings() {
    await this.page.goto(ROUTES['Bookings'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await expect(this.bookingsPageHeading).toBeVisible({ timeout: 20_000 });
  }

  async scrollToBottom() {
    await this.page.evaluate(() => {
      const scrollable = document.querySelector('main') || document.documentElement;
      for (let i = 0; i < 20; i++) scrollable.scrollTop += 400;
    });
    await this.page.waitForTimeout(1000);
  }

  async scrollToTop() {
    await this.page.evaluate(() => {
      const scrollable = document.querySelector('main') || document.documentElement;
      scrollable.scrollTop = 0;
    });
    await this.page.waitForTimeout(500);
  }

  // ══════════════════════════════════════════════
  //  SCHEDULER DASHBOARD
  // ══════════════════════════════════════════════
  get dashboardHeading()       { return this.page.getByRole('heading', { name: /Scheduler|Dashboard|Schedule/i }).first(); }
  get upcomingBookingsSection() { return this.page.locator('[class*="event"], [class*="booking"], [class*="card"]').filter({ hasText: /.+/ }).first(); }
  get createEventBtn()         { return this.page.getByRole('button', { name: /Create|New|Add|Schedule/i }).first(); }
  get settingsBtn()            { return this.page.getByRole('button', { name: /Settings|Preferences/i }).first(); }
  get calendarView()           { return this.page.locator('[role="grid"], [class*="calendar"], [class*="event"]').first(); }
  get timeSlotsList()          { return this.page.locator('[role="list"], [class*="slot"]').first(); }
  // Event-type availability controls are unlabeled buttons, not ARIA switches.
  get availabilityToggle()     { return this.page.locator('button[class*="inline-flex"][class*="h-6"][class*="w-11"]').first(); }

  async availabilityState() {
    return this.availabilityToggle.evaluate(button => ({
      enabled: button.classList.contains('bg-primary-500'),
      thumb: button.querySelector('span')?.className || '',
    }));
  }

  // Booking management
  get bookingsList()           { return this.page.locator('[role="list"]').filter({ has: this.page.getByText(/booking|appointment/i) }).first(); }
  get bookingItem()            { return this.page.locator('[class*="booking"], [class*="appointment"]').first(); }
  get editBookingBtn()         { return this.page.getByRole('button', { name: /Edit|Update/i }).first(); }
  get cancelBookingBtn()       { return this.page.getByRole('button', { name: /Cancel|Delete|Remove/i }).first(); }
  get confirmCancelBtn()       { return this.page.getByRole('button', { name: /Confirm|Yes/i }).first(); }

  // ══════════════════════════════════════════════
  //  BOOKINGS PAGE
  // ══════════════════════════════════════════════
  get bookingsPageHeading()    { return this.page.getByRole('heading', { name: /Bookings/i }).first(); }
  get bookingTypesFilter()     { return this.page.locator('[role="combobox"]').first(); }
  get statusFilter()           { return this.page.locator('[role="combobox"]').nth(1); }
  get dateRangeFilter()        { return this.page.locator('input[type="date"]').first(); }
  get searchBookingsInput()    { return this.page.getByPlaceholder(/Search|Find.*booking/i); }
  get allBookingsTable()       { return this.page.locator('table, [role="table"]').first(); }
  get bookingRows()            { return this.page.locator('[role="row"]').filter({ hasText: /.+/ }); }
  get noBookingsMsg()          { return this.page.getByText(/No bookings|No results|Nothing/i).first(); }
  get exportBtn()              { return this.page.getByRole('button', { name: /Export|Download/i }).first(); }
  get paginationNext()         { return this.page.getByRole('button', { name: /Next|→/i }).first(); }
  get paginationPrev()         { return this.page.getByRole('button', { name: /Previous|←/i }).first(); }

  // Booking details (modal/drawer)
  get bookingDetailsHeading()  { return this.page.getByRole('heading', { name: /Booking|Appointment|Meeting/i }).nth(1); }
  get bookingDetailsClose()    { return this.page.getByRole('button', { name: /Close|Dismiss|×/i }).last(); }
  get attendeesList()          { return this.page.getByText(/Attendee|Guest/i).first(); }
  get meetingLinkBtn()         { return this.page.getByRole('button', { name: /Meeting Link|Join/i }).first(); }
  get sendReminderBtn()        { return this.page.getByRole('button', { name: /Reminder|Send/i }).first(); }
  get rescheduleBtn()          { return this.page.getByRole('button', { name: /Reschedule|Reschedule/i }).first(); }
  get deleteBookingBtn()       { return this.page.getByRole('button', { name: /Delete|Cancel|Remove/i }).first(); }
  get copyLinkBtn()            { return this.page.getByRole('button', { name: /Copy|Link/i }).first(); }

  // ══════════════════════════════════════════════
  //  FILTERS & CONTROLS
  // ══════════════════════════════════════════════
  get clearFiltersBtn()        { return this.page.getByRole('button', { name: /Clear|Reset/i }).first(); }
  get sortButton()             { return this.page.getByRole('button', { name: /Sort|Order/i }).first(); }

  // ══════════════════════════════════════════════
  //  TABS & NAVIGATION
  // ══════════════════════════════════════════════
  get eventTypesTab()          { return this.page.getByRole('tab', { name: /Event Type|Type/i }).first(); }
  get availabilityTab()        { return this.page.getByRole('tab', { name: /Availability|Available/i }).first(); }
  get calendarsTab()           { return this.page.getByRole('tab', { name: /Calendar/i }).first(); }
  get analyticsTab()           { return this.page.getByRole('tab', { name: /Analytics|Analytics/i }).first(); }

  // ══════════════════════════════════════════════
  //  FORMS & DIALOGS
  // ══════════════════════════════════════════════
  get dateInput()              { return this.page.locator('input[type="date"]').first(); }
  get timeInput()              { return this.page.locator('input[type="time"]').first(); }
  get confirmBtn()             { return this.page.getByRole('button', { name: /Confirm|Save|Submit|Create/i }).first(); }
  get cancelBtn()              { return this.page.getByRole('button', { name: /Cancel|Close/i }).first(); }
  get successMsg()             { return this.page.locator('[class*="success"], [class*="toast"], [role="alert"]').first(); }
}

module.exports = { SchedulingPage };
