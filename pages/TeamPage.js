const { expect } = require('@playwright/test');
const { ROUTES } = require('./AskCentralPage');

class TeamPage {
  constructor(page) { this.page = page; }

  async goto() {
    await this.page.goto(ROUTES['Team'], { waitUntil: 'domcontentloaded' });
    if (this.page.url().includes('/auth/login')) {
      throw new Error('Session expired — run `npm run auth` to refresh .auth/user.json');
    }
    await this.page.waitForTimeout(2500);
  }

  // ---------- headings ----------
  get heading() { return this.page.getByRole('heading', { name: 'EA Team Members', level: 1 }); }

  // ---------- table headers ----------
  get nameHeader()      { return this.page.getByText('Name', { exact: true }).first(); }
  get emailHeader()     { return this.page.getByText('Email', { exact: true }).first(); }
  get dateAddedHeader() { return this.page.getByText('Date Added', { exact: true }).first(); }
  get roleHeader()      { return this.page.getByText('Role', { exact: true }).first(); }

  // ---------- actions ----------
  get inviteMembersBtn() { return this.page.getByRole('button', { name: 'Invite Members' }); }
  get searchInput()      { return this.page.locator('input[placeholder="Search members..."]').first(); }

  // ---------- member role dropdowns (only non-YOU members have these) ----------
  get roleDropdowns() { return this.page.locator('button[data-slot="dropdown-menu-trigger"] >> visible=true').filter({ hasText: /Admin|Member/ }); }

  // ---------- role dropdown menu items ----------
  get changeRoleMenuItem()      { return this.page.getByRole('menuitem', { name: 'Change Role' }); }
  get removeMemberMenuItem()    { return this.page.getByRole('menuitem', { name: 'Remove Member' }); }
  get revokeInvitationMenuItem(){ return this.page.getByRole('menuitem', { name: /Revoke/i }); }

  // ---------- Change Role dialog ----------
  get changeRoleDialog()    { return this.page.getByText('Change Role').first(); }
  get newRoleSelect()       { return this.page.locator('[role="dialog"] select, [role="alertdialog"] select').first(); }
  get changeRoleSaveBtn()   { return this.page.getByRole('button', { name: 'Save' }); }
  get changeRoleCancelBtn() { return this.page.getByRole('button', { name: 'Cancel' }); }

  // ---------- Invite modal ----------
  get inviteEmailInput()  { return this.page.getByPlaceholder('colleague@company.com'); }
  get inviteRoleSelect()  { return this.page.locator('select').last(); }
  get sendInvitesBtn()    { return this.page.getByRole('button', { name: 'Send Invites' }); }

  // ---------- Revoke dialog ----------
  get revokeConfirmBtn() { return this.page.getByRole('button', { name: /Revoke Invitation/i }); }

  // ---------- sections ----------
  get activeSection()  { return this.page.getByText('Active').first(); }
  get pendingSection() { return this.page.getByText('Pending Invitations').first(); }
}

module.exports = { TeamPage };
