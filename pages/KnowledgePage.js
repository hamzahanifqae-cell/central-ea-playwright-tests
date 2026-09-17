const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class KnowledgePage {
  constructor(page) { this.page = page; }

  async goto() {
    await this.page.goto(ROUTES['Knowledge'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await this.page.waitForTimeout(2500);
  }

  // ---------- headings ----------
  get heading()        { return this.page.getByRole('heading', { name: 'Knowledge Base', level: 1 }); }
  get articlesHeading(){ return this.page.getByRole('heading', { name: 'Knowledge Base Articles' }); }

  // ---------- source type tabs ----------
  get urlTab()         { return this.page.getByRole('button', { name: 'URL', exact: true }).first(); }
  get textTab()        { return this.page.getByRole('button', { name: 'Text', exact: true }).first(); }
  get faqTab()         { return this.page.getByRole('button', { name: 'FAQ', exact: true }).first(); }
  get fileTab()        { return this.page.getByRole('button', { name: 'File', exact: true }).first(); }
  get centralDocsTab() { return this.page.getByRole('button', { name: 'Central Docs', exact: true }).first(); }
  get videoTab()       { return this.page.getByRole('button', { name: 'Video', exact: true }).first(); }
  get memoriesTab()    { return this.page.getByRole('button', { name: 'Memories', exact: true }).first(); }
  get ticketsTab()     { return this.page.getByRole('button', { name: 'Tickets', exact: true }).first(); }
  get notionTab()      { return this.page.getByRole('button', { name: 'Notion', exact: true }).first(); }

  // ---------- URL tab ----------
  get urlInput()         { return this.page.getByPlaceholder('https://docs.example.com'); }
  get scanAllCheckbox()  { return this.page.locator('input[type="checkbox"]'); }
  get importBtn()        { return this.page.getByRole('button', { name: 'Import', exact: true }); }

  // ---------- Text tab ----------
  get textArea()         { return this.page.getByPlaceholder('Paste any text or markdown...'); }
  get addTextBtn()       { return this.page.getByRole('button', { name: 'Add Text' }); }

  // ---------- FAQ tab ----------
  get faqQuestionInput() { return this.page.getByPlaceholder('Enter your question'); }
  get faqAnswerInput()   { return this.page.getByPlaceholder('Enter your answer'); }
  get addEntryBtn()      { return this.page.getByRole('button', { name: 'Add Entry' }); }

  // ---------- File tab ----------
  get fileDropzone()     { return this.page.getByText('Click to upload'); }
  get fileFormats()      { return this.page.getByText(/Supported formats/); }

  // ---------- Central Docs tab ----------
  get syncAllBtn()       { return this.page.getByRole('button', { name: 'Sync All' }); }
  get autoActivateToggle() { return this.page.getByText('Auto-activate public docs'); }
  reSyncBtns()           { return this.page.getByLabel('Re-sync document'); }

  // ---------- Video tab ----------
  get videoUrlInput()    { return this.page.getByPlaceholder('https://www.youtube.com/watch?v=...'); }
  get addVideoBtn()      { return this.page.getByRole('button', { name: 'Add YouTube video' }); }
  get videoDropzone()    { return this.page.getByText('Click to upload').first(); }
  get videoFormats()     { return this.page.getByText(/MP4, WebM, MOV/); }

  // ---------- Memories tab ----------
  get memoriesImportTab() { return this.page.getByRole('tab', { name: 'Import' }); }
  get memoriesCreateTab() { return this.page.getByRole('tab', { name: 'Create' }); }
  get copyPromptBtn()     { return this.page.getByRole('button', { name: 'Copy prompt' }); }
  get memoriesPasteArea() { return this.page.getByPlaceholder(/Paste the entire response/); }
  get memoriesImportBtn() { return this.page.getByRole('button', { name: 'Import', exact: true }); }
  get memoriesCancelBtn() { return this.page.getByRole('button', { name: 'Cancel', exact: true }); }
  get memoriesTextarea()  { return this.page.getByPlaceholder('e.g. I love playing football.'); }
  get addMemoryBtn()      { return this.page.getByRole('button', { name: 'Add memory' }); }

  // ---------- Tickets tab ----------
  get goToTicketsBtn()  { return this.page.getByRole('button', { name: 'Go to Tickets' }); }
  get ticketsSwitch()   { return this.page.getByLabel(/Deactivate all ticket sources/); }
  get expandTicketsBtn(){ return this.page.getByLabel('Expand tickets section'); }

  // ---------- Notion tab ----------
  get importAgainBtn()  { return this.page.getByRole('button', { name: 'Import again' }); }
  get disconnectBtn()   { return this.page.getByRole('button', { name: 'Disconnect' }); }

  // ---------- article sections (collapsible) ----------
  articleSection(name)  { return this.page.getByRole('button', { name: new RegExp(name) }).first(); }
  get urlImportsSection()    { return this.page.getByRole('button', { name: /URL Imports/ }); }
  get textImportsSection()   { return this.page.getByRole('button', { name: /Text Imports/ }); }
  get faqsSection()          { return this.page.getByRole('button', { name: /FAQs \(/ }); }
  get fileImportsSection()   { return this.page.getByRole('button', { name: /File Imports/ }); }
  get centralDocsSection()   { return this.page.getByRole('button', { name: /Central Docs \(/ }); }
  get videoImportsSection()  { return this.page.getByRole('button', { name: /Video Imports/ }); }
  get notionDocsSection()    { return this.page.getByRole('button', { name: /Notion Docs/ }); }
  get ticketsSection()       { return this.page.getByRole('button', { name: /Tickets \(/ }); }
  get memoriesSection()      { return this.page.getByRole('button', { name: /Memories \(/ }); }

  // ---------- per-entry actions ----------
  get searchInput()      { return this.page.getByPlaceholder('Search knowledge base...'); }
  get suggestionsBtn()   { return this.page.getByRole('button', { name: /Suggestions/ }); }
  viewContentBtns()      { return this.page.getByLabel('View content'); }
  deleteSourceBtns()     { return this.page.getByLabel('Delete source'); }
  toggleSwitch(name)     { return this.page.getByLabel(new RegExp(`Toggle ${name}`, 'i')); }
  get allToggles()       { return this.page.getByRole('switch'); }
  get discardBtns()      { return this.page.getByRole('button', { name: 'Discard' }); }
}

module.exports = { KnowledgePage };
