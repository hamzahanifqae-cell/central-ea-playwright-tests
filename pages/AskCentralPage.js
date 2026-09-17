const { expect } = require('@playwright/test');

const ROUTES = {
  'New Chat':    '/app/ea/askcentral/new',
  'History':     '/app/ea/askcentral/history',
  'Connect':     '/app/ea/askcentral/connect',
  'Automations': '/app/ea/askcentral/workflows',
  'Customize':   '/app/ea/askcentral/customize',
  'Your Day':    '/app/ea/your-day',
  'Calendar':    '/app/ea/calendar',
  'Inbox':       '/app/ea/email/INBOX',
  'Tasks':       '/app/ea/tasks',
  'Shared':      '/app/ea/shared',
  'Meetings':    '/app/ea/meetings',
  'Meeting Automations': '/app/ea/automate',
  'Scheduler Dashboard': '/app/ea/scheduler/dashboard',
  'Bookings':    '/app/ea/scheduler/bookings',
  'Knowledge':   '/app/ea/knowledge',
  'Team':        '/app/ea/teams',
  'Settings':    '/app/ea/settings',
  'Categorization':  '/app/ea/settings?section=categorization',
  'AI Drafts':       '/app/ea/settings?section=ai-drafts',
  'Inbox Automations': '/app/ea/settings?section=automations',
  'Daily Briefing':  '/app/ea/settings?section=daily-briefing',
  'Scheduled':       '/app/ea/email/scheduled',
};
const TABS = Object.keys(ROUTES);

class AskCentralPage {
  constructor(page) { this.page = page; }

  // ---------- navigation ----------
  navItem(name) { return this.page.locator(`a[href="${ROUTES[name]}"]`); }

  async goto(tab = 'New Chat') {
    await this.page.goto(ROUTES[tab], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await this.page.waitForTimeout(2500);
  }

  async openTab(name) {
    await this.navItem(name).click();
    await this.page.waitForURL(`**${ROUTES[name]}`, { timeout: 20_000, waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(1500);
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
  }

  async ensurePage(tab) {
    const route = ROUTES[tab];
    if (this.page.url().includes(route)) return;
    const link = this.navItem(tab);
    if (await link.isVisible().catch(() => false)) {
      await link.click();
      await this.page.waitForURL(`**${route}`, { timeout: 20_000, waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(1500);
    } else {
      await this.goto(tab);
    }
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
  }

  // ---------- New Chat composer ----------
  get composer()      { return this.page.locator('textarea[data-slot="textarea"]'); }
  get sendButton()    { return this.page.getByRole('button', { name: 'Send message' }); }
  get attachButton()  { return this.page.getByRole('button', { name: 'Attach files' }); }
  get promptsButton() { return this.page.locator('button[data-prompts-trigger="true"]'); }
  get dictateButton() { return this.page.getByRole('button', { name: 'Dictate' }); }
  get voiceButton()   { return this.page.getByRole('button', { name: 'Voice mode' }); }
  get roleSelector()  { return this.page.getByRole('combobox', { name: 'Show automations for role' }); }
  get showMore()      { return this.page.getByRole('button', { name: /Show \d+ more/ }); }

  filterTab(name) { return this.page.getByRole('tab', { name, exact: true }); }

  enableButton(name) { return this.page.getByRole('button', { name: `Enable ${name}` }); }
  get allEnableButtons() { return this.page.getByRole('button', { name: /^Enable / }); }

  async type(text) {
    await this.composer.click();
    await this.composer.fill('');
    await this.composer.pressSequentially(text, { delay: 15 });
    await expect(this.composer).toHaveValue(text);
  }

  async send(text) {
    await this.type(text);
    await this.sendButton.click();
    await this.waitForReply();
  }

  async waitForReply() {
    const stop = this.page.getByRole('button', { name: /stop|cancel/i });
    await stop.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await stop.waitFor({ state: 'hidden', timeout: 120_000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async waitForAutomations() {
    await this.allEnableButtons.first().waitFor({ state: 'visible', timeout: 15_000 });
    const last = this.allEnableButtons.last();
    await last.evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await this.page.waitForTimeout(300);
    if (await this.showMore.isVisible().catch(() => false)) {
      await this.showMore.scrollIntoViewIfNeeded();
      await this.showMore.click();
      await this.page.waitForTimeout(800);
    }
  }

  async attachFile(filePath) {
    const [chooser] = await Promise.all([
      this.page.waitForEvent('filechooser', { timeout: 15_000 }),
      this.attachButton.click(),
    ]);
    await chooser.setFiles(filePath);
  }

  async executions() {
    const result = await this.page.evaluate(() => {
      const text = document.body.innerText.replace(/\s+/g, ' ');
      const m = text.match(/(\d+)\s*\/\s*(\d+)\s*executions?\s*used/i);
      if (m) return { used: +m[1], limit: +m[2] };
      const allText = [...document.querySelectorAll('*')].map(el => {
        const t = (el.innerText || '').trim();
        if (/\d+\/\d+/.test(t) && /execution/i.test(t) && t.length < 80) return t;
        return null;
      }).filter(Boolean);
      if (allText.length) {
        const m2 = allText[0].replace(/\s+/g, ' ').match(/(\d+)\s*\/\s*(\d+)/);
        if (m2) return { used: +m2[1], limit: +m2[2] };
      }
      return null;
    });
    return result;
  }

  async lastResponseText() {
    const candidates = [
      '[data-message-role="assistant"]',
      '[data-role="assistant"]',
      '[class*="assistant"]',
    ];
    for (const sel of candidates) {
      const el = this.page.locator(sel).last();
      if (await el.isVisible().catch(() => false)) {
        return { selector: sel, text: (await el.innerText()).trim() };
      }
    }
    return { selector: 'body', text: await this.page.locator('body').innerText() };
  }

  // ---------- History ----------
  get historySearch() { return this.page.getByPlaceholder('Search conversations'); }
  get historyMenus()  { return this.page.getByRole('button', { name: 'Open menu' }); }
  get historyNewChat(){ return this.page.getByRole('button', { name: 'New Chat' }); }

  // ---------- Automations (/workflows) ----------
  get automationSearch() { return this.page.getByPlaceholder('Search automations'); }
  get automationRows()   { return this.page.locator('div[role="button"][class*="grid"]'); }
  get pauseButtons()     { return this.page.getByRole('button', { name: 'Pause automation' }); }
  get editButtons()      { return this.page.getByRole('button', { name: 'Edit automation' }); }
  get myAutomationsTab() { return this.page.getByRole('tab', { name: 'My Automations' }); }
  get browseTemplatesTab() { return this.page.getByRole('tab', { name: 'Browse Templates' }); }

  // ---------- Customize ----------
  get ruleSearch()     { return this.page.getByLabel('Search rules'); }
  get deleteRuleBtns() { return this.page.getByRole('button', { name: 'Delete rule' }); }
  get rulesTab()       { return this.page.getByRole('button', { name: 'Rules', exact: true }); }
  get savedPromptsTab(){ return this.page.getByRole('button', { name: 'Saved Prompts', exact: true }); }
  get communityTab()   { return this.page.getByRole('button', { name: 'Community', exact: true }); }
  get addRuleBtn()     { return this.page.getByRole('button', { name: 'Add Rule' }); }
  editRule(text)       { return this.page.getByRole('button', { name: new RegExp(`Edit rule:.*${text}`, 'i') }); }
  get ruleToggles()    { return this.page.getByRole('switch'); }

  // ---------- Connect ----------
  get connectBar()     { return this.page.getByRole('button', { name: 'Connect apps to Ask Central' }); }
  accordionTrigger(name) { return this.page.locator(`button[data-slot="accordion-trigger"]`).filter({ hasText: new RegExp(name, 'i') }); }
}

module.exports = { AskCentralPage, TABS, ROUTES };
