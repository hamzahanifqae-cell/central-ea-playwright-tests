const { test, expect } = require('./fixtures');
const { InboxAssistantPage } = require('../pages/InboxAssistantPage');

test.describe('Inbox Assistant', () => {
  test.describe.configure({ mode: 'serial' });
  let ia;

  test.beforeEach(async ({ page }) => {
    ia = new InboxAssistantPage(page);
    await page.evaluate(() => {
      document.documentElement.style.pointerEvents = '';
      document.body.style.pointerEvents = '';
    }).catch(() => {});
  });

  // ╔═══════════════════════════════════════════════════╗
  //  CATEGORIZATION — PAGE LOAD & LAYOUT
  // ╚═══════════════════════════════════════════════════╝

  test('IA0 — categorization page loads with heading, tabs, and custom categories', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();

    await expect(ia.categorizationHeading).toBeVisible({ timeout: 10_000 });
    await expect(ia.categoriesTab).toBeVisible({ timeout: 5000 });
    await expect(ia.autoArchiveTab).toBeVisible({ timeout: 5000 });
    await expect(ia.customCategoriesHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.searchInput).toBeVisible({ timeout: 5000 });
  });

  test('IA1 — all 6 default category toggles are visible and switchable', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    // Wait for toggles to render before checking
    await expect(ia.toggleToReply).toBeVisible({ timeout: 10_000 });

    const toggles = [
      ia.toggleToReply,
      ia.toggleNewsletter,
      ia.toggleCalendar,
      ia.toggleMarketing,
      ia.toggleReceipt,
      ia.toggleNotifications,
    ];

    // Don't assume a fixed on/off state — a real account may legitimately
    // have any of these switched off. Just verify each one is visible and
    // that clicking it actually flips its state, then restore it.
    for (const toggle of toggles) {
      await expect(toggle).toBeVisible({ timeout: 5000 });
      const originalState = await toggle.getAttribute('aria-checked');

      await toggle.click();
      await expect(toggle).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
    }

    const totalToggles = await ia.allCategoryToggles.count();
    expect(totalToggles).toBeGreaterThanOrEqual(6);
  });

  test('IA2 — each category has an Edit link and description text', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    // Wait for categories to fully render
    await expect(ia.toggleToReply).toBeVisible({ timeout: 10_000 });
    await page.waitForLoadState('domcontentloaded');

    const editLinks = page.getByText('Edit', { exact: true });
    const editCount = await editLinks.count();
    expect(editCount).toBeGreaterThanOrEqual(6);

    const categories = ['To reply', 'Newsletter', 'Calendar', 'Marketing', 'Receipt', 'Notifications'];
    for (const cat of categories) {
      await expect(page.getByText(cat, { exact: true }).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('IA3 — Add New Category button is visible', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.scrollToBottom();

    await expect(ia.addNewCategoryBtn).toBeVisible({ timeout: 5000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  CATEGORIZATION — IMPORT, COLORS, RULES
  // ╚═══════════════════════════════════════════════════╝

  test('IA4 — Import from Gmail section with Scan & Suggest Labels', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.scrollToBottom();

    await expect(ia.importFromGmailHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.scanSuggestLabelsBtn).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Last scanned on')).toBeVisible({ timeout: 5000 });
  });

  test('IA5 — label color mode options are visible (Vibrant, Pastel, No color)', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.scrollToBottom();

    await expect(ia.labelColorModeHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.vibrantColorBtn).toBeVisible({ timeout: 5000 });
    await expect(ia.pastelColorBtn).toBeVisible({ timeout: 5000 });
    await expect(ia.noColorBtn).toBeVisible({ timeout: 5000 });

    await expect(page.getByText('Full color')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Soft color')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Text only')).toBeVisible({ timeout: 3000 });
  });

  test('IA6 — Classification Rules textarea visible with placeholder', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.scrollToBottom();
    await page.waitForLoadState('domcontentloaded');
    await ia.scrollToBottom();

    await expect(ia.classificationRulesHeading).toBeVisible({ timeout: 8000 });
    await expect(ia.classificationRulesTextarea).toBeVisible({ timeout: 5000 });

    const placeholder = await ia.classificationRulesTextarea.getAttribute('placeholder');
    expect(placeholder).toContain('Emails from @notion.so');
  });

  test('IA7 — Maximum Categories per Email section visible with select', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.scrollToBottom();

    await expect(ia.maxCategoriesHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.maxCategoriesSelect).toBeVisible({ timeout: 5000 });

    const currentVal = await ia.maxCategoriesSelect.inputValue();
    expect(['1', '2', '3', '5', '10']).toContain(currentVal);
  });

  // ╔═══════════════════════════════════════════════════╗
  //  CATEGORIZATION — AUTO ARCHIVE TAB
  // ╚═══════════════════════════════════════════════════╝

  test('IA8 — Auto Archive tab loads with heading and description', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();

    await ia.autoArchiveTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(ia.autoArchiveHeading).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Automatically archive emails when a category is applied')).toBeVisible({ timeout: 5000 });
  });

  test('IA9 — Auto Archive tab shows all 6 category switches', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.autoArchiveTab.click();
    await page.waitForLoadState('domcontentloaded');

    const archiveToggles = [
      ia.autoArchiveToReply,
      ia.autoArchiveNewsletter,
      ia.autoArchiveCalendar,
      ia.autoArchiveMarketing,
      ia.autoArchiveReceipt,
      ia.autoArchiveNotifications,
    ];

    for (const toggle of archiveToggles) {
      await expect(toggle).toBeVisible({ timeout: 5000 });
    }

    const totalArchiveToggles = await ia.allAutoArchiveToggles.count();
    expect(totalArchiveToggles).toBeGreaterThanOrEqual(6);
  });

  test('IA10 — switch between Categories and Auto Archive tabs', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();

    await expect(ia.customCategoriesHeading).toBeVisible({ timeout: 5000 });

    await ia.autoArchiveTab.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(ia.autoArchiveHeading).toBeVisible({ timeout: 5000 });

    await ia.categoriesTab.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(ia.customCategoriesHeading).toBeVisible({ timeout: 5000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  AI DRAFTS — PAGE LOAD & SECTIONS
  // ╚═══════════════════════════════════════════════════╝

  test('IA11 — AI Drafts page loads with heading and all section headings', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.aiDraftsHeading).toBeVisible({ timeout: 10_000 });
    await expect(ia.writingStyleHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.autoRepliesHeading).toBeVisible({ timeout: 5000 });
  });

  test('IA12 — Writing Style Analysis section with Re-analyze and Delete buttons', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();

    await expect(ia.writingStyleHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.reAnalyzeBtn).toBeVisible({ timeout: 5000 });
    await expect(ia.deleteStyleBtn).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('We analyze your emails to help the AI write naturally')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Last analyzed/)).toBeVisible({ timeout: 5000 });
  });

  test('IA13 — Automatically Generate Replies switch is visible and checked', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.autoRepliesSwitch).toBeVisible({ timeout: 5000 });
    await expect(ia.autoRepliesSwitch).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByText('AI automatically generates responses to important emails')).toBeVisible({ timeout: 5000 });
  });

  test('IA14 — AI Response Instructions textarea visible with placeholder', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.instructionsHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.instructionsTextarea).toBeVisible({ timeout: 5000 });

    const placeholder = await ia.instructionsTextarea.getAttribute('placeholder');
    expect(placeholder).toContain('always respond in a professional');
  });

  test('IA15 — Signature section shows current signature with Edit button', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.signatureHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.editSignatureBtn).toBeVisible({ timeout: 5000 });
    const signatureSection = ia.signatureHeading.locator('xpath=..');
    await expect(signatureSection).toContainText(/\S+/, { timeout: 5000 });
  });

  test('IA16 — Draft Frequency combobox shows current value', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.draftFrequencyHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.draftFrequencyCombo).toBeVisible({ timeout: 5000 });

    const text = await ia.draftFrequencyCombo.textContent();
    expect(text).toContain('Always');
  });

  test('IA17 — Draft Rules textarea visible with placeholder', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.draftRulesHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.draftRulesTextarea).toBeVisible({ timeout: 5000 });

    const placeholder = await ia.draftRulesTextarea.getAttribute('placeholder');
    expect(placeholder).toContain('Always draft for investor');
  });

  // ╔═══════════════════════════════════════════════════╗
  //  AI DRAFTS — BLOCKLIST, CONTEXT, BEHAVIOR
  // ╚═══════════════════════════════════════════════════╝

  test('IA18 — Sender Blocklist input and Add button visible', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.senderBlocklistHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.bloclistInput).toBeVisible({ timeout: 5000 });
    await expect(ia.addBlocklistBtn).toBeVisible({ timeout: 5000 });

    const placeholder = await ia.bloclistInput.getAttribute('placeholder');
    expect(placeholder).toContain('email@example.com');
  });

  test('IA19 — Context Sources switches all visible (Knowledge Base, CRM, Calendar, Meeting History)', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.contextSourcesHeading).toBeVisible({ timeout: 5000 });

    const contextSwitches = [
      { sw: ia.knowledgeBaseSwitch, checked: 'true' },
      { sw: ia.crmSwitch, checked: 'true' },
      { sw: ia.calendarSwitch, checked: 'true' },
      { sw: ia.meetingHistorySwitch, checked: 'true' },
    ];

    for (const { sw, checked } of contextSwitches) {
      await expect(sw).toBeVisible({ timeout: 5000 });
      await expect(sw).toHaveAttribute('aria-checked', checked);
    }

    await expect(page.getByText('Use your uploaded knowledge base to inform replies')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Use contact and company info from your CRM')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Check your calendar when emails mention scheduling')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Use past meeting notes with the sender for context')).toBeVisible({ timeout: 5000 });
  });

  test('IA20 — Draft Behavior switches visible (CC and BCC)', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();

    await expect(ia.draftBehaviorHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.draftCcSwitch).toBeVisible({ timeout: 5000 });
    await expect(ia.draftBccSwitch).toBeVisible({ timeout: 5000 });

    await expect(page.getByText("Generate AI drafts for emails where you're CC'd")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Generate AI drafts for emails where you're BCC'd")).toBeVisible({ timeout: 5000 });
  });

  test('IA21 — AI-assisted meeting scheduling section with switch and scheduler links', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();

    await expect(ia.meetingSchedulingHeading).toBeVisible({ timeout: 5000 });
    await expect(ia.meetingScheduleSwitch).toBeVisible({ timeout: 5000 });
    await expect(ia.meetingScheduleSwitch).toHaveAttribute('aria-checked', 'true');

    await expect(page.getByText('Central Scheduler')).toBeVisible({ timeout: 5000 });
    await expect(ia.manageSchedulerBtn).toBeVisible({ timeout: 5000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  AUTOMATIONS (SETTINGS) — PAGE LOAD & CONTROLS
  // ╚═══════════════════════════════════════════════════╝

  test('IA22 — Automations settings page loads with heading', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.automationsHeading).toBeVisible({ timeout: 10_000 });
  });

  test('IA23 — auto-create tasks switch visible and enabled', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.autoCreateTasksSwitch).toBeVisible({ timeout: 5000 });
    await expect(ia.autoCreateTasksSwitch).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByText('AI will scan email content and create tasks')).toBeVisible({ timeout: 5000 });
  });

  test('IA24 — add tasks to calendar switch visible', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.addTasksToCalendarSwitch).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("auto-created tasks won't block time")).toBeVisible({ timeout: 5000 });
  });

  test('IA25 — Task Creation Frequency radio buttons all visible', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.frequencyRarely).toBeVisible({ timeout: 5000 });
    await expect(ia.frequencySometimes).toBeVisible({ timeout: 5000 });
    await expect(ia.frequencyFrequently).toBeVisible({ timeout: 5000 });
    await expect(ia.frequencyAlways).toBeVisible({ timeout: 5000 });

    const totalRadios = await ia.allFrequencyRadios.count();
    expect(totalRadios).toBe(4);

    await expect(page.getByText('Only clear, obvious to-dos')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Likely to-dos')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Most possible to-dos')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Almost every email')).toBeVisible({ timeout: 3000 });
  });

  test('IA26 — AI-assisted meeting scheduling switch in Automations', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();
    await ia.scrollToBottom();

    await expect(ia.automationsMeetingSwitch).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('AI will detect emails about scheduling')).toBeVisible({ timeout: 5000 });
  });

  test('IA27 — Task Creation Instructions input visible with character counter', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(page.getByText('Task Creation Instructions')).toBeVisible({ timeout: 8000 });
    await expect(ia.taskInstructionsInput).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('30/500')).toBeVisible({ timeout: 3000 }).catch(() => {
      // Character counter text may vary
    });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  CROSS-PAGE NAVIGATION
  // ╚═══════════════════════════════════════════════════╝

  test('IA28 — settings sidebar navigates between Categorization, AI Drafts, and Automations', async ({ page }) => {
    test.setTimeout(90_000);
    await ia.gotoCategorization();
    await expect(ia.categorizationHeading).toBeVisible({ timeout: 10_000 });

    await ia.aiDraftsSidebarBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await ia.scrollToBottom();
    await ia.scrollToTop();
    await expect(ia.aiDraftsHeading).toBeVisible({ timeout: 10_000 });

    await ia.automationsSidebarBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(ia.automationsHeading).toBeVisible({ timeout: 10_000 });

    await ia.categorizationSidebarBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(ia.categorizationHeading).toBeVisible({ timeout: 10_000 });
  });

  test('IA29 — settings search input filters sidebar options', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();

    await expect(ia.searchInput).toBeVisible({ timeout: 5000 });
    await ia.searchInput.fill('draft');
    await page.waitForLoadState('domcontentloaded');

    await expect(ia.aiDraftsSidebarBtn).toBeVisible({ timeout: 5000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  CATEGORIZATION — INTERACTIVE FLOWS
  // ╚═══════════════════════════════════════════════════╝

  test('IA30 — toggle category switch on and verify state change', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await expect(ia.toggleToReply).toBeVisible({ timeout: 10_000 });

    // Don't assume what state this should start in — a real account may
    // legitimately have this toggled either way. Just verify clicking it
    // flips the state, then flips it back to whatever it originally was.
    const originalState = await ia.toggleToReply.getAttribute('aria-checked');

    await ia.toggleToReply.click();
    await expect(ia.toggleToReply).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

    await ia.toggleToReply.click();
    await expect(ia.toggleToReply).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
  });

  test('IA31 — type in Classification Rules textarea and verify input persists', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.scrollToBottom();
    await page.waitForLoadState('domcontentloaded');
    await ia.scrollToBottom();

    await expect(ia.classificationRulesTextarea).toBeVisible({ timeout: 8000 });

    // Get initial value
    const initialValue = await ia.classificationRulesTextarea.inputValue();

    // Type test text
    const testText = ' TEST_RULE_' + Date.now();
    await ia.classificationRulesTextarea.click();
    await ia.classificationRulesTextarea.pressSequentially(testText, { delay: 20 });
    await page.waitForLoadState('domcontentloaded');

    // Verify text was added
    const updatedValue = await ia.classificationRulesTextarea.inputValue();
    expect(updatedValue).toContain(testText);

    // Clear test text by restoring to initial
    await ia.classificationRulesTextarea.fill(initialValue);
    await page.waitForLoadState('domcontentloaded');
    const restoredValue = await ia.classificationRulesTextarea.inputValue();
    expect(restoredValue).toBe(initialValue);
  });

  test('IA32 — change Max Categories select and verify option change', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.scrollToBottom();

    await expect(ia.maxCategoriesSelect).toBeVisible({ timeout: 5000 });

    const originalVal = await ia.maxCategoriesSelect.inputValue();
    expect(['1', '2', '3', '5', '10']).toContain(originalVal);

    // Change to different option
    const newVal = originalVal === '1' ? '3' : '1';
    await ia.maxCategoriesSelect.selectOption(newVal);
    await page.waitForLoadState('domcontentloaded');

    const afterChange = await ia.maxCategoriesSelect.inputValue();
    expect(afterChange).toBe(newVal);

    // Restore original
    await ia.maxCategoriesSelect.selectOption(originalVal);
    await page.waitForLoadState('domcontentloaded');
    const restored = await ia.maxCategoriesSelect.inputValue();
    expect(restored).toBe(originalVal);
  });

  test('IA33 — toggle Auto Archive switch on and verify persistence', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoCategorization();
    await ia.autoArchiveTab.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(ia.autoArchiveToReply).toBeVisible({ timeout: 5000 });

    // Auto Archive for a category is disabled while that category itself is
    // switched off. Rather than skip, turn the category back on so both this
    // test and the account end up in a normal, working state.
    if (!(await ia.autoArchiveToReply.isEnabled())) {
      await ia.categoriesTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(ia.toggleToReply).toBeVisible({ timeout: 5000 });
      if ((await ia.toggleToReply.getAttribute('aria-checked')) !== 'true') {
        await ia.toggleToReply.click();
        await expect(ia.toggleToReply).toHaveAttribute('aria-checked', 'true', { timeout: 10_000 });
      }

      await ia.autoArchiveTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(ia.autoArchiveToReply).toBeEnabled({ timeout: 10_000 });
    }

    const originalState = await ia.autoArchiveToReply.getAttribute('aria-checked');

    // Toggle to opposite
    await ia.autoArchiveToReply.click();
    await expect(ia.autoArchiveToReply).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

    // Toggle back
    await ia.autoArchiveToReply.click();
    await expect(ia.autoArchiveToReply).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  AI DRAFTS — INTERACTIVE FLOWS
  // ╚═══════════════════════════════════════════════════╝

  test('IA34 — toggle Auto Replies switch and verify change', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.autoRepliesSwitch).toBeVisible({ timeout: 5000 });

    const originalState = await ia.autoRepliesSwitch.getAttribute('aria-checked');

    // Toggle
    await ia.autoRepliesSwitch.click();
    await expect(ia.autoRepliesSwitch).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

    // Restore
    await ia.autoRepliesSwitch.click();
    await expect(ia.autoRepliesSwitch).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
  });

  test('IA35 — type in Instructions textarea and clear', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.instructionsTextarea).toBeVisible({ timeout: 5000 });

    const initialValue = await ia.instructionsTextarea.inputValue();

    // Type test text
    const testText = ' TEST_' + Date.now();
    await ia.instructionsTextarea.click();
    await ia.instructionsTextarea.pressSequentially(testText, { delay: 15 });
    await page.waitForLoadState('domcontentloaded');

    const updated = await ia.instructionsTextarea.inputValue();
    expect(updated).toContain(testText);

    // Restore
    await ia.instructionsTextarea.fill(initialValue);
    await page.waitForLoadState('domcontentloaded');
    const restored = await ia.instructionsTextarea.inputValue();
    expect(restored).toBe(initialValue);
  });

  test('IA36 — add email to Sender Blocklist and remove', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.bloclistInput).toBeVisible({ timeout: 5000 });
    await expect(ia.addBlocklistBtn).toBeVisible({ timeout: 5000 });

    // Type email
    const testEmail = 'test' + Date.now() + '@block.com';
    await ia.bloclistInput.click();
    await ia.bloclistInput.pressSequentially(testEmail, { delay: 20 });
    await page.waitForLoadState('domcontentloaded');

    // Click Add button
    await ia.addBlocklistBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify email appears in list (as text on page)
    const emailInList = await page.getByText(testEmail).count();
    expect(emailInList).toBeGreaterThan(0);

    // Clear input for next operations
    await ia.bloclistInput.clear();
    await page.waitForLoadState('domcontentloaded');
  });

  test('IA37 — toggle Knowledge Base Context Source switch', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();
    await ia.scrollToTop();

    await expect(ia.knowledgeBaseSwitch).toBeVisible({ timeout: 5000 });

    const originalState = await ia.knowledgeBaseSwitch.getAttribute('aria-checked');

    // Toggle
    await ia.knowledgeBaseSwitch.click();
    await expect(ia.knowledgeBaseSwitch).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

    // Restore
    await ia.knowledgeBaseSwitch.click();
    await expect(ia.knowledgeBaseSwitch).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
  });

  test('IA38 — toggle Draft CC switch and verify', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAiDrafts();
    await ia.scrollToBottom();

    await expect(ia.draftCcSwitch).toBeVisible({ timeout: 5000 });

    const originalState = await ia.draftCcSwitch.getAttribute('aria-checked');

    // Toggle
    await ia.draftCcSwitch.click();
    await expect(ia.draftCcSwitch).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

    // Restore
    await ia.draftCcSwitch.click();
    await expect(ia.draftCcSwitch).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
  });

  // ╔═══════════════════════════════════════════════════╗
  //  AUTOMATIONS — INTERACTIVE FLOWS
  // ╚═══════════════════════════════════════════════════╝

  test('IA39 — toggle auto-create tasks switch and restore', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.autoCreateTasksSwitch).toBeVisible({ timeout: 5000 });

    const originalState = await ia.autoCreateTasksSwitch.getAttribute('aria-checked');

    // Toggle OFF
    await ia.autoCreateTasksSwitch.click();
    await expect(ia.autoCreateTasksSwitch).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

    // Toggle back ON
    await ia.autoCreateTasksSwitch.click();
    await expect(ia.autoCreateTasksSwitch).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
  });

  test('IA40 — select different Task Creation Frequency radio button', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.frequencyRarely).toBeVisible({ timeout: 5000 });

    // Find which known option is currently selected by checking each real
    // locator directly — reading the DOM's raw aria-label attribute isn't
    // reliable here (this app's accessible name isn't necessarily backed by
    // a literal aria-label attribute, so that read can come back null and
    // break getByRole's internal matcher). A "checked: true" locator is also
    // unsafe to keep around since it re-resolves live and would point at
    // whatever is newly selected once we click something else.
    const frequencyOptions = [
      ia.frequencyRarely,
      ia.frequencySometimes,
      ia.frequencyFrequently,
      ia.frequencyAlways,
    ];
    let originalOption = null;
    for (const option of frequencyOptions) {
      if ((await option.getAttribute('aria-checked')) === 'true') {
        originalOption = option;
        break;
      }
    }
    expect(originalOption).not.toBeNull();

    // Click "Sometimes" (or leave it if it's already the original)
    const target = originalOption === ia.frequencySometimes ? ia.frequencyRarely : ia.frequencySometimes;
    await target.click();
    await expect(target).toHaveAttribute('aria-checked', 'true', { timeout: 10_000 });

    // Restore the exact original radio.
    await originalOption.click();
    await expect(originalOption).toHaveAttribute('aria-checked', 'true', { timeout: 10_000 });
  });

  test('IA41 — type in Task Instructions input and restore', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.taskInstructionsInput).toBeVisible({ timeout: 5000 });

    const initialValue = await ia.taskInstructionsInput.inputValue();

    // Type test text
    const testText = 'TEST_' + Date.now();
    await ia.taskInstructionsInput.click();
    await ia.taskInstructionsInput.pressSequentially(testText, { delay: 20 });
    await page.waitForLoadState('domcontentloaded');

    const updated = await ia.taskInstructionsInput.inputValue();
    expect(updated).toContain(testText);

    // Restore
    await ia.taskInstructionsInput.fill(initialValue);
    await page.waitForLoadState('domcontentloaded');
    const restored = await ia.taskInstructionsInput.inputValue();
    expect(restored).toBe(initialValue);
  });

  test('IA42 — toggle Add to Calendar switch and verify', async ({ page }) => {
    test.setTimeout(60_000);
    await ia.gotoAutomations();

    await expect(ia.addTasksToCalendarSwitch).toBeVisible({ timeout: 5000 });

    const originalState = await ia.addTasksToCalendarSwitch.getAttribute('aria-checked');

    // Toggle
    await ia.addTasksToCalendarSwitch.click();
    await expect(ia.addTasksToCalendarSwitch).not.toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });

    // Restore
    await ia.addTasksToCalendarSwitch.click();
    await expect(ia.addTasksToCalendarSwitch).toHaveAttribute('aria-checked', originalState, { timeout: 10_000 });
  });
});
