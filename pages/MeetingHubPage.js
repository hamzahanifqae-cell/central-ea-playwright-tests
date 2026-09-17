const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class MeetingHubPage {
  constructor(page) { this.page = page; }

  async gotoMeetings() {
    await this.page.goto(ROUTES['Meetings'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    const loaded = await this.heading.isVisible().catch(() => false);
    if (!loaded) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(this.heading).toBeVisible({ timeout: 20_000 });
    await expect(this.recordingsTab).toBeVisible({ timeout: 15_000 });
  }

  async gotoAutomations() {
    await this.page.goto(ROUTES['Meeting Automations'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    const retainedEditor = this.page.getByRole('button', { name: 'Test run', exact: true });
    const dashboardOrEditor = this.automationsHeading.or(retainedEditor);
    await expect(dashboardOrEditor).toBeVisible({ timeout: 20_000 }).catch(async () => {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await expect(dashboardOrEditor).toBeVisible({ timeout: 20_000 });
    });
    if (await retainedEditor.isVisible().catch(() => false)) {
      const meetingsNav = this.page.locator(`a[href="${ROUTES['Meetings']}"]`);
      await meetingsNav.click();
      await expect(this.heading).toBeVisible({ timeout: 20_000 });
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await expect(this.heading).toBeVisible({ timeout: 20_000 });
      await this.page.goto(ROUTES['Meeting Automations'], { waitUntil: 'domcontentloaded' });
    }
    await expect(this.automationsHeading).toBeVisible({ timeout: 15_000 });
  }

  // ---------- Meetings page ----------
  get heading()          { return this.page.getByRole('heading', { name: 'Meetings', level: 1 }); }
  get recordMeetingBtn() { return this.page.getByRole('button', { name: 'Record Meeting' }); }
  get filtersBtn()       { return this.page.getByRole('button', { name: 'Filters' }); }
  get searchInput()      { return this.page.getByPlaceholder('Search for keywords, participants and more'); }
  get recordingsTab()    { return this.page.getByRole('button', { name: 'Recordings' }); }
  get upcomingTab()      { return this.page.getByRole('button', { name: 'Upcoming Meetings' }); }
  get participantCombo() { return this.page.getByRole('combobox'); }
  get refreshBtn()      { return this.page.getByRole('button', { name: 'Refresh meetings' }); }
  get noRecordingsHeading() { return this.page.getByText('No recordings yet', { exact: true }); }
  get noRecordingsText() { return this.page.getByText('Your meeting recordings will appear here once they\'re processed and available.'); }
  get clearFiltersBtn() { return this.page.getByText('Clear filters', { exact: true }); }
  get meetingTypeDialog() { return this.page.getByText('Meeting Type', { exact: true }).last(); }
  get recordAudioOption() { return this.page.getByText('Record Audio', { exact: true }).last(); }
  get sendMeetingBotOption() { return this.page.getByText('Send Meeting Bot', { exact: true }); }
  get uploadAudioVideoOption() { return this.page.getByText('Upload Audio/Video', { exact: true }); }
  recordAudioOptions() { return this.page.getByText('Record Audio', { exact: true }); }
  get microphoneDeniedText() { return this.page.getByText('Microphone Access Denied', { exact: true }); }
  get cancelBtn() { return this.page.getByRole('button', { name: 'Cancel', exact: true }); }
  get sendBotBtn() { return this.page.getByRole('button', { name: 'Send Bot to Meeting', exact: true }); }
  get uploadProcessBtn() { return this.page.getByRole('button', { name: 'Upload & Process', exact: true }); }
  get meetingUrlInput() { return this.page.getByPlaceholder(/teams\.microsoft\.com/); }
  get meetingTitleInput() { return this.page.getByPlaceholder(/Weekly Team Sync|Sales Call with Acme Corp/); }
  get recordingLinks() { return this.page.locator('a[href*="/app/ea/meetings/"]:visible'); }
  get meetingDetailHeading() { return this.page.locator('main h1:visible, main h2:visible').first(); }

  // ---------- Meeting automations ----------
  get automationsHeading() { return this.page.getByRole('heading', { name: 'Automations', level: 1 }); }
  get createFlowBtn() { return this.page.getByRole('button', { name: 'Create New Flow' }); }
  get templateUseButtons() { return this.page.getByText('Use template', { exact: false }); }
  get automationRows() { return this.page.getByText('Click a row to edit', { exact: true }); }
  get pulseInsightsFlow() { return this.page.getByText('Pulse insights → Slack', { exact: true }).last(); }
  get newLeadTemplate() { return this.page.getByRole('button', { name: /New B2B lead.*Use template/ }); }
  get flowDraftLabel() { return this.page.getByText('Draft', { exact: true }); }
  get flowTrigger() { return this.page.getByText('Meeting ended', { exact: true }); }
  get addNewStepBtn() { return this.page.getByRole('button', { name: /Add new step/ }); }
  get publishBtn() { return this.page.getByRole('button', { name: 'Publish', exact: true }); }
  get missingActionText() { return this.page.getByText('Add at least one action below your trigger.', { exact: true }); }
  get conditionsOption() { return this.page.getByRole('button', { name: 'Conditions', exact: true }); }
  get actionsOption() { return this.page.getByRole('button', { name: 'Actions', exact: true }); }
  get testRunBtn() { return this.page.getByRole('button', { name: 'Test run', exact: true }); }
  get refreshRunsBtn() { return this.page.getByRole('button', { name: 'Refresh runs', exact: true }); }
  get recentRunsHeading() { return this.page.getByText('Recent runs', { exact: true }); }
  get dryRunDialog() { return this.page.getByRole('dialog', { name: 'Test run' }); }

  // ---------- sidebar nav ----------
  get meetingsLink()     { return this.page.locator(`a[href="${ROUTES['Meetings']}"]`); }
  get automationsLink()  { return this.page.locator(`a[href="${ROUTES['Meeting Automations']}"]`); }
  get meetingHubBtn()    { return this.page.getByRole('button', { name: 'Meeting Hub' }); }
}

module.exports = { MeetingHubPage };
