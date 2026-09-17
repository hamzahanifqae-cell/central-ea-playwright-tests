const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class DailyBriefingPage {
  constructor(page) { this.page = page; }

  async goto() {
    await this.page.goto(ROUTES['Daily Briefing'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await this.page.waitForTimeout(2500);
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
  //  MAIN CONTENT
  // ══════════════════════════════════════════════
  get heading()               { return this.page.getByRole('heading', { name: /Customize|Briefing|Daily/i }).first(); }
  get briefingContainer()     { return this.page.locator('[class*="briefing"], [class*="content"], main').first(); }
  get settingItems()          { return this.page.locator('[class*="setting"], [class*="item"], [role="option"]').filter({ hasText: /.+/ }); }
  get settingToggle()         { return this.page.getByRole('switch').first(); }
  get settingCheckbox()       { return this.page.locator('input[type="checkbox"]').first(); }

  // ══════════════════════════════════════════════
  //  SEARCH & FILTERS
  // ══════════════════════════════════════════════
  get searchInput()           { return this.page.getByPlaceholder(/Search|Filter/i); }
  get clearSearchBtn()        { return this.page.getByRole('button', { name: /Clear|Reset|×/i }).first(); }
  get filterBtn()             { return this.page.getByRole('button', { name: /Filter|Options/i }).first(); }
  get sortBtn()               { return this.page.getByRole('button', { name: /Sort|Order/i }).first(); }

  // ══════════════════════════════════════════════
  //  BRIEFING SECTIONS
  // ══════════════════════════════════════════════
  get prioritySection()       { return this.page.locator('[class*="priority"], [class*="important"], [class*="featured"]').first(); }
  get categoriesSection()     { return this.page.locator('[class*="categor"], [class*="topic"], [class*="section"]').first(); }
  get sourcesList()           { return this.page.locator('[class*="source"], [class*="provider"]').first(); }
  get topicsCheckbox()        { return this.page.getByText(/Topic|Category|Subject/i).locator('input[type="checkbox"]').first(); }

  // ══════════════════════════════════════════════
  //  ACTIONS & CONTROLS
  // ══════════════════════════════════════════════
  get saveBtn()               { return this.page.getByRole('button', { name: /Save|Submit|Confirm/i }).first(); }
  get cancelBtn()             { return this.page.getByRole('button', { name: /Cancel|Close|Dismiss/i }).first(); }
  get deleteBtn()             { return this.page.getByRole('button', { name: /Delete|Remove|Trash/i }).first(); }
  get resetBtn()              { return this.page.getByRole('button', { name: /Reset|Restore|Default/i }).first(); }
  get previewBtn()            { return this.page.getByRole('button', { name: /Preview|View|Show/i }).first(); }
  get refreshBtn()            { return this.page.getByRole('button', { name: /Refresh|Reload|Update/i }).first(); }
  get settingsBtn()           { return this.page.getByRole('button', { name: /Settings|Preferences|Options/i }).first(); }

  // ══════════════════════════════════════════════
  //  MODALS & DIALOGS
  // ══════════════════════════════════════════════
  get modal()                 { return this.page.locator('[role="dialog"], [class*="modal"], [class*="drawer"]').first(); }
  get modalClose()            { return this.page.getByRole('button', { name: /Close|×|Dismiss/i }).last(); }
  get confirmDialog()         { return this.page.locator('[role="alertdialog"], [class*="confirm"]').first(); }
  get successMsg()            { return this.page.locator('[class*="success"], [class*="toast"], [role="alert"]').first(); }
  get errorMsg()              { return this.page.locator('[class*="error"], [class*="danger"], [role="alert"]').first(); }

  // ══════════════════════════════════════════════
  //  TABS & SECTIONS
  // ══════════════════════════════════════════════
  get overviewTab()           { return this.page.getByRole('tab', { name: /Overview|Summary/i }).first(); }
  get settingsTab()           { return this.page.getByRole('tab', { name: /Settings|Preferences/i }).first(); }
  get topicsTab()             { return this.page.getByRole('tab', { name: /Topic|Category/i }).first(); }
  get sourcesTab()            { return this.page.getByRole('tab', { name: /Source|Provider/i }).first(); }

  // ══════════════════════════════════════════════
  //  FORMS
  // ══════════════════════════════════════════════
  get frequencySelect()       { return this.page.locator('[role="combobox"]').first(); }
  get timeInput()             { return this.page.locator('input[type="time"]').first(); }
  get dateInput()             { return this.page.locator('input[type="date"]').first(); }
}

module.exports = { DailyBriefingPage };
