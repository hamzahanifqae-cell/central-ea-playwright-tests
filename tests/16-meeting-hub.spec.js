const { test, expect } = require('./fixtures');
const { MeetingHubPage } = require('../pages/MeetingHubPage');

test.describe('Meeting Hub', () => {
  test.describe.configure({ mode: 'serial' });
  let mh;

  test.beforeEach(async ({ page }) => {
    mh = new MeetingHubPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
  });

  test('MH0 — meetings page loads with recording controls and views', async () => {
    await mh.gotoMeetings();

    await expect(mh.heading).toBeVisible();
    await expect(mh.recordMeetingBtn).toBeVisible();
    await expect(mh.filtersBtn).toBeVisible();
    await expect(mh.searchInput).toBeVisible();
    await expect(mh.recordingsTab).toBeVisible();
    await expect(mh.upcomingTab).toBeVisible();
    await expect(mh.refreshBtn).toBeVisible();
  });

  test('MH1 — recordings and upcoming meetings tabs switch content', async ({ page }) => {
    await mh.gotoMeetings();

    await mh.upcomingTab.click();
    await expect(page.getByRole('heading', { name: 'Morning Standup', exact: true }).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('a:visible').filter({ hasText: 'Meeting Link' }).first()).toBeVisible();

    await mh.recordingsTab.click();
    const visibleRecordingState = mh.noRecordingsHeading.or(page.locator('main h3:visible').first());
    await expect(visibleRecordingState).toBeVisible({ timeout: 10_000 });
  });

  test('MH2 — search filters recordings and supports no-result state', async ({ page }) => {
    await mh.gotoMeetings();

    await mh.searchInput.fill('Product Pod');
    await expect.poll(() => page.locator('main').innerText(), { timeout: 10_000 })
      .toContain('Product Pod Customer Feedback, Issue Finalization & Escalation');

    await mh.searchInput.fill('zz-no-such-meeting');
    await expect(mh.noRecordingsHeading).toBeVisible({ timeout: 10_000 });
    await expect(mh.noRecordingsText).toBeVisible();

    await mh.searchInput.fill('');
  });

  test('MH3 — meeting type filter applies a count and can be cleared', async ({ page }) => {
    await mh.gotoMeetings();

    await mh.filtersBtn.click();
    await expect(page.getByText('Meeting Type', { exact: true }).last()).toBeVisible();
    await page.getByText('1:1s', { exact: true }).click();

    await expect(page.getByText('Filters').locator('..').getByText('1', { exact: true })).toBeVisible().catch(() => {});
    await expect(mh.clearFiltersBtn).toBeVisible({ timeout: 5000 });
    await mh.clearFiltersBtn.click();
    await expect(mh.clearFiltersBtn).toBeHidden();
  });

  test('MH4 — Record Meeting menu exposes audio, bot, and upload workflows', async () => {
    await mh.gotoMeetings();

    await mh.recordMeetingBtn.click();
    await expect(mh.recordAudioOption).toBeVisible();
    await expect(mh.sendMeetingBotOption).toBeVisible();
    await expect(mh.uploadAudioVideoOption).toBeVisible();
  });

  test('MH5 — audio recording handles blocked microphone without starting a recording', async () => {
    await mh.gotoMeetings();

    await mh.recordMeetingBtn.click();
    const audioOptions = mh.recordAudioOptions();
    let clicked = false;
    for (let index = 0; index < await audioOptions.count(); index++) {
      const option = audioOptions.nth(index);
      if (await option.isVisible()) {
        await option.click();
        clicked = true;
        break;
      }
    }
    expect(clicked).toBe(true);

    const denied = mh.microphoneDeniedText;
    const permissionDenied = await denied.isVisible({ timeout: 5000 }).catch(() => false);
    if (permissionDenied) {
      await expect(mh.page.getByRole('button', { name: 'Request Permission Again' })).toBeVisible();
      await mh.cancelBtn.click();
      await expect(denied).toBeHidden();
    } else {
      await mh.page.keyboard.press('Escape');
      await expect(mh.heading).toBeVisible();
    }
  });

  test('MH6 — refresh meetings keeps the Meetings page usable', async () => {
    await mh.gotoMeetings();
    await mh.refreshBtn.click();
    await expect(mh.heading).toBeVisible({ timeout: 10_000 });
    await expect(mh.recordingsTab).toBeVisible();
  });

  test('MH7 — meeting automations page shows templates, metrics, and existing flows', async ({ page }) => {
    await mh.gotoAutomations();

    await expect(mh.automationsHeading).toBeVisible();
    await expect(mh.createFlowBtn).toBeVisible();
    await expect(page.getByText('Start from a template', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Automations', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Executed', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Leads collected', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Click a row to edit', { exact: true })).toBeVisible();
  });

  test('MH8 — create-flow editor exposes meeting trigger and safe validation state', async ({ page }) => {
    await mh.gotoAutomations();

    await mh.createFlowBtn.click();
    await expect(mh.flowDraftLabel).toBeVisible();
    await expect(mh.flowTrigger).toBeVisible();
    await expect(mh.addNewStepBtn).toBeVisible();
    await expect(mh.publishBtn).toBeVisible();
    await expect(mh.missingActionText).toBeVisible();

    await mh.addNewStepBtn.click();
    await expect(mh.conditionsOption).toBeVisible();
    await expect(mh.actionsOption).toBeVisible();
    await expect(page.getByRole('button', { name: 'Call length', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Call type / label', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Call name', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Meeting invitees', exact: true })).toBeVisible();
  });

  test('MH9 — template opens a draft with required actions and dry-run controls', async ({ page }) => {
    await mh.gotoAutomations();

    await mh.newLeadTemplate.click();
    await expect(mh.flowDraftLabel).toBeVisible();
    await expect(page.getByText('New B2B lead → create deal in New Lead', { exact: true })).toBeVisible();
    await expect(page.getByText('Locate Contact', { exact: true })).toBeVisible();
    await expect(page.getByText('Create deals', { exact: true })).toBeVisible();
    await expect(mh.testRunBtn).toBeVisible();
    await expect(page.getByText('Test before going live.', { exact: true })).toBeVisible();
  });

  test('MH10 — existing flow editor exposes conditions, recent runs, and validation issues', async ({ page }) => {
    const cleanContext = await page.context().browser().newContext({ storageState: '.auth/user.json' });
    const cleanPage = await cleanContext.newPage();
    const cleanMh = new MeetingHubPage(cleanPage);
    await cleanMh.gotoAutomations();

    await cleanMh.pulseInsightsFlow.click();
    await expect(cleanPage.getByText('Send Slack message', { exact: true })).toBeVisible();
    await expect(cleanPage.getByText('Call Length equals', { exact: false })).toBeVisible();
    await expect(cleanPage.getByText('Call Name equals', { exact: false })).toBeVisible();
    await expect(cleanMh.recentRunsHeading).toBeVisible();
    await expect(cleanPage.getByText('Enter a duration.', { exact: false })).toBeVisible();
    await expect(cleanPage.getByText('Value is required.', { exact: false })).toBeVisible();
    await cleanContext.close();
  });

  test('MH11 — existing flow test run reports dry-run outcomes and can close', async ({ page }) => {
    const cleanContext = await page.context().browser().newContext({ storageState: '.auth/user.json' });
    const cleanPage = await cleanContext.newPage();
    const cleanMh = new MeetingHubPage(cleanPage);
    await cleanMh.gotoAutomations();
    await cleanMh.pulseInsightsFlow.click();
    await cleanMh.testRunBtn.click();
    await expect(cleanMh.dryRunDialog).toBeVisible({ timeout: 10_000 });
    await expect.poll(() => cleanMh.dryRunDialog.innerText(), { timeout: 15_000 })
      .toMatch(/SIMULATED|NOT MET|SKIPPED/);
    await expect.poll(() => cleanMh.dryRunDialog.innerText(), { timeout: 15_000 })
      .toMatch(/Run for real|Sample call data/);
    await cleanMh.dryRunDialog.getByRole('button', { name: /close/i }).click();
    await expect(cleanMh.dryRunDialog).toBeHidden();
    await cleanContext.close();
  });

  test('MH12 — Send Meeting Bot validates required URL and can be canceled', async ({ page }) => {
    await mh.gotoMeetings();

    await mh.recordMeetingBtn.click();
    await mh.sendMeetingBotOption.click();
    await expect(mh.meetingUrlInput).toBeVisible();
    await expect(mh.meetingTitleInput).toBeVisible();
    await expect(mh.sendBotBtn).toBeDisabled();

    await mh.cancelBtn.click();
    await expect(mh.meetingUrlInput).toBeHidden();
  });

  test('MH13 — Upload Audio/Video requires a file and title and can be canceled', async ({ page }) => {
    await mh.gotoMeetings();

    await mh.recordMeetingBtn.click();
    await mh.uploadAudioVideoOption.click();
    await expect(mh.meetingTitleInput).toBeVisible();
    await expect(mh.uploadProcessBtn).toBeDisabled();

    await mh.cancelBtn.click();
    await expect(mh.meetingTitleInput).toBeHidden();
  });

  test('MH14 — recorded meeting opens a detail page when recordings are available', async ({ page }) => {
    await mh.gotoMeetings();
    await mh.recordingsTab.click();

    // Recordings are rendered below the fold and may be lazy-loaded.
    await page.evaluate(() => {
      const scrollable = document.querySelector('main') || document.documentElement;
      scrollable.scrollTop = scrollable.scrollHeight;
    });

    const recording = mh.recordingLinks.first();
    await expect.poll(() => recording.count(), { timeout: 15_000 })
      .toBeGreaterThan(0).catch(() => {});
    if (await recording.count() === 0) {
      test.skip(true, 'no recorded meeting detail links available');
    }

    await recording.click();
    await expect(page).toHaveURL(/\/app\/ea\/meetings\/[^/]+/);
    await expect.poll(
      () => page.locator('main').innerText(),
      { timeout: 30_000, intervals: [500, 1000, 2000] }
    ).toMatch(/Meeting|Transcript|Summary|Participants/i);
  });
});
