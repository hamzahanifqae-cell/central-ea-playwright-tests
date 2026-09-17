const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class InboxAssistantPage {
  constructor(page) { this.page = page; }

  async gotoCategorization() {
    await this.page.goto(ROUTES['Categorization'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await expect(this.categorizationHeading).toBeVisible({ timeout: 15_000 });
    await expect(this.toggleToReply).toBeVisible({ timeout: 15_000 });
  }

  async gotoAiDrafts() {
    await this.page.goto(ROUTES['AI Drafts'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await expect(this.aiDraftsHeading).toBeVisible({ timeout: 15_000 });
    await expect(this.writingStyleHeading).toBeVisible({ timeout: 15_000 });
  }

  async gotoAutomations() {
    await this.page.goto(ROUTES['Inbox Automations'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await expect(this.automationsHeading).toBeVisible({ timeout: 15_000 });
    await expect(this.autoCreateTasksSwitch).toBeVisible({ timeout: 15_000 });
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

  // ---------- sidebar navigation ----------
  get inboxAssistantBtn() { return this.page.getByRole('button', { name: 'Inbox Assistant' }); }
  get categorizationSidebarBtn(){ return this.page.getByRole('button', { name: 'Categorization', exact: true }); }
  get aiDraftsSidebarBtn()      { return this.page.getByRole('button', { name: 'AI Drafts', exact: true }); }
  get automationsSidebarBtn()   { return this.page.getByRole('button', { name: 'Automations', exact: true }); }
  get searchInput()             { return this.page.getByPlaceholder('Search settings...'); }

  // ══════════════════════════════════════════════
  //  CATEGORIZATION
  // ══════════════════════════════════════════════
  get categorizationHeading() { return this.page.getByRole('heading', { name: 'Categorization', level: 1 }); }

  // Tabs
  get categoriesTab() { return this.page.getByRole('tab', { name: 'Categories' }); }
  get autoArchiveTab(){ return this.page.getByRole('tab', { name: 'Auto Archive' }); }

  // Custom Categories section
  get customCategoriesHeading() { return this.page.getByRole('heading', { name: 'Custom Categories' }); }
  get addNewCategoryBtn()       { return this.page.getByRole('button', { name: 'Add New Category' }); }

  // Category toggles
  get toggleToReply()       { return this.page.getByRole('switch', { name: 'Toggle To reply' }); }
  get toggleNewsletter()    { return this.page.getByRole('switch', { name: 'Toggle Newsletter' }); }
  get toggleCalendar()      { return this.page.getByRole('switch', { name: 'Toggle Calendar' }); }
  get toggleMarketing()     { return this.page.getByRole('switch', { name: 'Toggle Marketing' }); }
  get toggleReceipt()       { return this.page.getByRole('switch', { name: 'Toggle Receipt' }); }
  get toggleNotifications() { return this.page.getByRole('switch', { name: 'Toggle Notifications' }); }
  get allCategoryToggles()  { return this.page.locator('[role="switch"][aria-label^="Toggle "]'); }

  // Category Edit links
  get editLinks() { return this.page.getByText('Edit', { exact: true }); }

  // Import from Gmail
  get importFromGmailHeading() { return this.page.getByRole('heading', { name: 'Import from Gmail' }); }
  get scanSuggestLabelsBtn()   { return this.page.getByRole('button', { name: 'Scan & Suggest Labels' }); }

  // Label color mode
  get labelColorModeHeading() { return this.page.getByRole('heading', { name: 'Label color mode' }); }
  get vibrantColorBtn()       { return this.page.getByRole('button', { name: /Vibrant/i }); }
  get pastelColorBtn()        { return this.page.getByRole('button', { name: /Pastel/i }); }
  get noColorBtn()            { return this.page.getByRole('button', { name: /No color/i }); }

  // Classification Rules
  get classificationRulesHeading()  { return this.page.getByRole('heading', { name: 'Classification Rules' }); }
  get classificationRulesTextarea() { return this.page.getByPlaceholder(/Emails from @notion.so/); }

  // Maximum Categories per Email
  get maxCategoriesHeading() { return this.page.getByRole('heading', { name: 'Maximum Categories per Email' }); }
  get maxCategoriesSelect()  { return this.page.locator('select').last(); }

  // Auto Archive tab
  get autoArchiveHeading()           { return this.page.getByRole('heading', { name: 'Auto Archive', exact: true }); }
  get autoArchiveToReply()           { return this.page.getByRole('switch', { name: 'Auto archive To reply' }); }
  get autoArchiveNewsletter()        { return this.page.getByRole('switch', { name: 'Auto archive Newsletter' }); }
  get autoArchiveCalendar()          { return this.page.getByRole('switch', { name: 'Auto archive Calendar' }); }
  get autoArchiveMarketing()         { return this.page.getByRole('switch', { name: 'Auto archive Marketing' }); }
  get autoArchiveReceipt()           { return this.page.getByRole('switch', { name: 'Auto archive Receipt' }); }
  get autoArchiveNotifications()     { return this.page.getByRole('switch', { name: 'Auto archive Notifications' }); }
  get allAutoArchiveToggles()        { return this.page.locator('[role="switch"][aria-label^="Auto archive "]'); }

  // ══════════════════════════════════════════════
  //  AI DRAFTS
  // ══════════════════════════════════════════════
  get aiDraftsHeading()           { return this.page.getByRole('heading', { name: 'AI Drafts', level: 1 }); }
  get writingStyleHeading()       { return this.page.getByRole('heading', { name: 'Writing Style Analysis' }); }
  get autoRepliesHeading()        { return this.page.getByRole('heading', { name: 'Automatically Generate Replies' }); }
  get instructionsHeading()       { return this.page.getByRole('heading', { name: 'AI Response Instructions' }); }
  get signatureHeading()          { return this.page.getByRole('heading', { name: 'Signature' }); }
  get draftFrequencyHeading()     { return this.page.getByRole('heading', { name: 'Draft Frequency' }); }
  get draftRulesHeading()         { return this.page.getByRole('heading', { name: 'Draft Rules' }); }
  get senderBlocklistHeading()    { return this.page.getByRole('heading', { name: 'Sender Blocklist' }); }
  get contextSourcesHeading()     { return this.page.getByRole('heading', { name: 'Context Sources' }); }
  get draftBehaviorHeading()      { return this.page.getByRole('heading', { name: 'Draft Behavior' }); }
  get meetingSchedulingHeading()  { return this.page.getByRole('heading', { name: 'AI-assisted meeting scheduling' }); }

  // AI Drafts switches
  get autoRepliesSwitch()       { return this.page.getByRole('switch', { name: /Automatically generate replies/i }); }
  get knowledgeBaseSwitch()     { return this.page.getByRole('switch', { name: /Knowledge Base/i }); }
  get crmSwitch()               { return this.page.getByRole('switch', { name: /CRM/i }); }
  get calendarSwitch()          { return this.page.getByRole('switch', { name: /Calendar Availability/i }); }
  get meetingHistorySwitch()    { return this.page.getByRole('switch', { name: /Meeting History/i }); }
  get draftCcSwitch()           { return this.page.getByRole('switch', { name: /Draft for CC'd emails/i }); }
  get draftBccSwitch()          { return this.page.getByRole('switch', { name: /Draft for BCC'd emails/i }); }
  get meetingScheduleSwitch()   { return this.page.getByRole('switch', { name: /AI-assisted meeting scheduling/i }); }

  // AI Drafts inputs
  get instructionsTextarea() { return this.page.getByPlaceholder(/always respond in a professional/i); }
  get draftRulesTextarea()   { return this.page.getByPlaceholder(/Always draft for investor/i); }
  get bloclistInput()        { return this.page.getByPlaceholder(/email@example.com/); }

  // AI Drafts actions
  get reAnalyzeBtn()        { return this.page.getByRole('button', { name: 'Re-analyze' }); }
  get deleteStyleBtn()      { return this.page.getByRole('button', { name: 'Delete', exact: true }); }
  get editSignatureBtn()    { return this.page.getByRole('button', { name: 'Edit Signature' }); }
  get addBlocklistBtn()     { return this.page.getByRole('button', { name: 'Add', exact: true }); }
  get draftFrequencyCombo() { return this.page.getByRole('combobox', { name: 'Draft frequency' }); }
  get manageSchedulerBtn()  { return this.page.getByRole('button', { name: 'Manage Scheduler' }); }

  // ══════════════════════════════════════════════
  //  AUTOMATIONS (SETTINGS)
  // ══════════════════════════════════════════════
  get automationsHeading()      { return this.page.getByRole('heading', { name: 'Automations', level: 1 }); }
  get autoCreateTasksSwitch()   { return this.page.getByRole('switch', { name: /Allow AI to automatically create tasks/i }); }
  get addTasksToCalendarSwitch(){ return this.page.getByRole('switch', { name: /Add tasks to your calendar/i }); }
  get automationsMeetingSwitch(){ return this.page.getByRole('switch', { name: /AI-assisted meeting scheduling/i }); }

  // Task Creation Frequency radio buttons
  get frequencyRarely()     { return this.page.getByRole('radio', { name: /Rarely/i }); }
  get frequencySometimes()  { return this.page.getByRole('radio', { name: /Sometimes/i }); }
  get frequencyFrequently() { return this.page.getByRole('radio', { name: /Frequently/i }); }
  get frequencyAlways()     { return this.page.getByRole('radio', { name: /Always/i }); }
  get allFrequencyRadios()  { return this.page.getByRole('radio'); }

  // Task Creation Instructions (input, not textarea)
  get taskInstructionsInput() { return this.page.getByPlaceholder(/Never create tasks for OTP emails/i); }
}

module.exports = { InboxAssistantPage };
