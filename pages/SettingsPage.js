const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class SettingsPage {
  constructor(page) { this.page = page; }

  async goto(section) {
    const route = section ? ROUTES[section] || `/app/ea/settings?section=${section}` : ROUTES['Settings'];
    await this.page.goto(route, { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await this.page.waitForTimeout(2500);
  }

  // ---------- settings sidebar navigation ----------
  sidebarSection(name) { return this.page.getByRole('button', { name, exact: true }); }

  get accountsSection()      { return this.sidebarSection('Accounts'); }
  get notificationsSection() { return this.sidebarSection('Notifications'); }
  get dailyBriefingSection() { return this.sidebarSection('Daily Briefing'); }
  get teamSection()          { return this.sidebarSection('Team'); }
  get integrationsSection()  { return this.sidebarSection('Integrations'); }
  get preferencesSection()   { return this.sidebarSection('Preferences'); }
  get automationsSection()   { return this.sidebarSection('Automations'); }
  get taskLabelsSection()    { return this.sidebarSection('Task Labels'); }
  get categorizationSection(){ return this.sidebarSection('Categorization'); }
  get aiDraftsSection()      { return this.sidebarSection('AI Drafts'); }
  get snippetsSection()      { return this.sidebarSection('Snippets'); }
  get callLabelsSection()    { return this.sidebarSection('Call Labels'); }
  get emailTemplatesSection(){ return this.sidebarSection('Email Templates'); }
  get meetingTemplatesSection() { return this.sidebarSection('Meeting Templates'); }
  get scorecardsSection()    { return this.sidebarSection('Scorecards'); }
  get crmAutofillSection()   { return this.sidebarSection('CRM Autofill'); }

  // ---------- search ----------
  get searchInput() { return this.page.getByPlaceholder('Search settings...'); }

  // ---------- Accounts page ----------
  get accountsHeading()   { return this.page.getByRole('heading', { name: 'Accounts', level: 1 }); }
  get signInHeading()     { return this.page.getByRole('heading', { name: 'Sign-in' }); }
  get connectedMailbox()  { return this.page.getByRole('heading', { name: 'Connected Mailbox' }); }
  get connectedCalendars(){ return this.page.getByRole('heading', { name: 'Connected Calendars' }); }
  get editPrimaryEmail()  { return this.page.getByRole('button', { name: /Edit primary contact email/ }); }
  get addNewAccountBtn()  { return this.page.getByRole('button', { name: 'Add New Account' }); }
  disconnectBtn(email)    { return this.page.getByRole('button', { name: new RegExp(`Disconnect ${email}`, 'i') }); }
  get connectCalendarBtn(){ return this.page.getByRole('button', { name: 'Connect' }); }
  get backBtn()           { return this.page.getByRole('button', { name: 'Back' }); }
}

module.exports = { SettingsPage };
