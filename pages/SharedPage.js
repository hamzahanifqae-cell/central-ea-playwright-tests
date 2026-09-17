const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class SharedPage {
  constructor(page) { this.page = page; }

  async goto() {
    await this.page.goto(ROUTES['Shared'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await this.page.waitForTimeout(2500);
  }

  // ---------- empty state ----------
  get emptyHeading()  { return this.page.getByRole('heading', { name: 'No threads here yet' }); }
  get emptySubtitle() { return this.page.getByText('Once something is assigned, shared, or mentioned'); }

  // ---------- actions ----------
  get inviteTeamBtn() { return this.page.getByRole('button', { name: 'Invite your team' }); }
}

module.exports = { SharedPage };
