# Central EA — Regression Test Suite

**Last run:** 287 passed, 3 skipped — 53.6 minutes  
**Date:** 2026-09-17 12:14  
**Runner:** Playwright + Chromium, single browser session, serial execution  
**Target:** https://app.trycentral.com

---

## 01 — New Chat (`tests/01-new-chat.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | all composer controls are visible | SAFE | PASS |
| 2 | typing in composer works with pressSequentially | SAFE | PASS |
| 3 | send button disabled when composer is empty | SAFE | PASS |
| 4 | quota pill displays used and limit | SAFE | PASS |
| 5 | filter tabs switch between all categories | SAFE | PASS |
| 6 | automation cards render and are countable | SAFE | PASS |
| 7 | suggestion prompt fills the composer | SAFE | PASS |
| 8 | dictate button is clickable and responds | SAFE | PASS |
| 9 | voice mode button is clickable and responds | SAFE | PASS |
| 10 | prompts panel opens and shows content | SAFE | PASS |
| 11 | create saved prompt with auto-run OFF and category selected | WRITE | PASS |
| 12 | created prompt appears in prompts panel | WRITE | PASS |
| 13 | search filters prompts in panel | SAFE | PASS |
| 14 | clicking prompt with auto-run OFF fills composer without sending | SAFE | PASS |
| 15 | send text message and receive AI response | LLM | PASS |
| 16 | attach file with description and receive AI response | LLM | PASS |
| 17 | create prompt with auto-run ON and verify it auto-sends on click | LLM | PASS |
| 18 | three-dot menu — edit, share, delete prompt sequentially | WRITE | PASS |

## 02 — Saved Prompts (`tests/02-saved-prompts.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | create first saved prompt | WRITE | PASS |
| 2 | first prompt visible in panel | SAFE | PASS |
| 3 | search filters saved prompts | SAFE | PASS |
| 4 | create second saved prompt | WRITE | PASS |
| 5 | navigate to Customize page | SAFE | PASS |

## 03 — History (`tests/03-history.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | conversation list renders | SAFE | PASS |
| 2 | search filters conversations | SAFE | PASS |
| 3 | open conversation navigates away | SAFE | PASS |
| 4 | "Open menu" shows Rename and Delete | WRITE | PASS |
| 5 | rename a conversation | WRITE | PASS |
| 6 | delete a conversation | WRITE | PASS |
| 7 | New Chat button navigates | SAFE | PASS |

## 04 — Connect (`tests/04-connect.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | all channel tiles render | SAFE | PASS |
| 2 | expand and collapse each channel | SAFE | PASS |
| 3 | email account visible | SAFE | PASS |
| 4 | each app status is readable | SAFE | PASS |
| 5 | Connect tools bar is visible | SAFE | PASS |
| 6 | Mobile App option visible | SAFE | PASS |

## 05 — Automations (`tests/05-automations.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | automation list renders | SAFE | PASS |
| 2 | search filters automations | SAFE | PASS |
| 3 | row controls exist (edit, pause) | WRITE | PASS |
| 4 | My Automations and Browse Templates tabs | SAFE | PASS |
| 5 | edit panel opens and closes | SAFE | PASS |
| 6 | pause and resume automation | WRITE | PASS |
| 7 | Browse Templates has content | SAFE | PASS |

## 06 — Customize (`tests/06-customize.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | create new test rule | WRITE | PASS |
| 2 | rules list renders | SAFE | PASS |
| 3 | rule toggles are visible | WRITE | PASS |
| 4 | toggle rule on and off | WRITE | PASS |
| 5 | search filters rules | SAFE | PASS |
| 6 | edit rule panel opens and closes | SAFE | PASS |
| 7 | Saved Prompts tab loads | SAFE | PASS |
| 8 | saved prompts list renders | SAFE | PASS |
| 9 | search saved prompts on customize | SAFE | PASS |
| 10 | Community tab loads | SAFE | PASS |
| 11 | community skills are visible | SAFE | PASS |
| 12 | install community skill for test | WRITE | PASS |
| 13 | all tab buttons visible | SAFE | PASS |
| 14 | delete test rule | WRITE | PASS |

## 07 — Your Day (`tests/07-your-day.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | page loads with greeting and status pills | SAFE | PASS |
| 2 | sync status bar shows connected apps | SAFE | PASS |
| 3 | composer bar visible with Voice, Dictate, Send buttons | SAFE | PASS |
| 4 | evening summary section renders with work updates | SAFE | PASS |
| 5 | summary action buttons are visible and clickable | SAFE | PASS |
| 6 | View Context expands and collapses on work update | SAFE | PASS |
| 7 | summary section collapses and expands | SAFE | PASS |
| 8 | Your To-Dos section visible with Ready for You and Done For You tabs | SAFE | PASS |
| 9 | To-Do tabs switch between Ready for You and Done For You | SAFE | PASS |
| 10 | Done For You tab shows content when clicked | SAFE | PASS |
| 11 | calendar sidebar visible with date and navigation | SAFE | PASS |
| 12 | calendar navigation switches between days | SAFE | PASS |
| 13 | connect apps banner visible with Connect button | SAFE | PASS |
| 14 | settings button opens daily briefing settings and returns | SAFE | PASS |
| 15 | send button opens Ask Central modal with greeting and suggestions | SAFE | PASS |
| 16 | send message in Ask Central modal and receive AI response | LLM | PASS |
| 17 | Ask Central modal — history, options, prompts, attach, expand, minimize | SAFE | PASS |
| 18 | summary scroll down, refresh, and briefing settings button | SAFE | PASS |
| 19 | To-Dos refresh, Done For You tab, and view task | SAFE | PASS |
| 20 | expand calendar and click Next Up meeting link | SAFE | PASS |
| 21 | calendar expand, day navigation, and scroll | SAFE | PASS |

## 08 — 08-calendar (`tests/08-calendar.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | calendar page loads with date and view controls | SAFE | PASS |
| 2 | day view shows timeline and Next Up sidebar | SAFE | PASS |
| 3 | click event opens detail popup with meeting info | SAFE | PASS |
| 4 | close event detail popup | SAFE | PASS |
| 5 | navigate next day and back | SAFE | PASS |
| 6 | Today button returns to current date | SAFE | PASS |
| 7 | switch to Week view and verify | SAFE | PASS |
| 8 | week view prev and next navigation | SAFE | PASS |
| 9 | switch to Month view and verify | SAFE | PASS |
| 10 | month view prev and next navigation | SAFE | PASS |
| 11 | return to Day view from Month | SAFE | PASS |
| 12 | scroll day timeline up and down | SAFE | PASS |
| 13 | exit full calendar navigates away | SAFE | PASS |

## 09 — 09-inbox (`tests/09-inbox.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | inbox page loads with filters and email list | SAFE | PASS |
| 2 | click all filter tabs | SAFE | PASS |
| 3 | manage categories opens with category list | SAFE | PASS |
| 4 | edit category — change and undo all changes | SAFE | PASS |
| 5 | delete category — click Stay on Page | WRITE | PASS |
| 6 | filter emails dropdown and options | SAFE | PASS |
| 7 | open search and type query | SAFE | PASS |
| 8 | switch to detailed view and back | SAFE | PASS |
| 9 | refresh emails and wait | SAFE | PASS |
| 10 | compose — open, maximize, fill, clear, close | SAFE | PASS |
| 11 | accounts — connected accounts panel | SAFE | PASS |

## 10 — 10-mail-actions (`tests/10-mail-actions.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | switch to Google account | SAFE | PASS |
| 2 | select email shows bottom action toolbar | SAFE | PASS |
| 3 | select all and deselect all via toolbar | SAFE | PASS |
| 4 | star an email via star button | SAFE | PASS |
| 5 | starred folder shows the starred email | SAFE | PASS |
| 6 | unstar email and verify in inbox | SAFE | PASS |
| 7 | hover actions — mark as done and mark as unread | SAFE | PASS |
| 8 | create a task from email | WRITE | PASS |
| 9 | compose and send email to self, verify in Sent | SAFE | PASS |
| 10 | open sent email detail view and verify body | SAFE | PASS |
| 11 | delete sent ZZTEST email | WRITE | PASS |
| 12 | trash folder loads with deleted email | WRITE | PASS |

## 11 — 11-scheduling (`tests/11-scheduling.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | schedule email via send dropdown, verify in Scheduled, then cancel | SAFE | SKIP |

## 12 — 12-tasks (`tests/12-tasks.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | tasks page loads with task counter | SAFE | PASS |
| 2 | all tasks dropdown shows options | SAFE | PASS |
| 3 | filter tasks by user avatar | SAFE | PASS |
| 4 | search tasks via search icon | SAFE | PASS |
| 5 | toggle between list and board view | WRITE | PASS |
| 6 | filter icon opens filter panel | SAFE | PASS |
| 7 | filter by Priority Urgent and clear | SAFE | PASS |
| 8 | add task via button | SAFE | PASS |
| 9 | click task opens detail panel | SAFE | PASS |
| 10 | more actions menu shows options | SAFE | PASS |
| 11 | task status circle changes status and undo on zztest task | SAFE | PASS |
| 12 | do it for me button triggers action | SAFE | PASS |
| 13 | view all link loads full task list | SAFE | PASS |
| 14 | calendar panel date navigation | SAFE | PASS |
| 15 | day dropdown shows view options | SAFE | PASS |
| 16 | delete zztest tasks created in add task test | WRITE | PASS |

## 13 — 13-shared (`tests/13-shared.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | S0 — shared page loads (empty state or existing assignments) | SAFE | PASS |
| 2 | S1 — find unassigned email in Inbox and open it | SAFE | PASS |
| 3 | S2 — assign email to self | SAFE | PASS |
| 4 | S3 — shared page shows the assigned email | SAFE | PASS |
| 5 | S4 — Assigned, Shared, Mentioned tabs are clickable and working | SAFE | PASS |
| 6 | S5 — add team comment with @mention and verify | SAFE | PASS |
| 7 | S6 — remove assignment and verify thread count decreased | SAFE | PASS |
| 8 | S7 — open assigned email from shared page and verify detail | SAFE | PASS |

## 14 — 14-inbox-assistant (`tests/14-inbox-assistant.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | IA0 — categorization page loads with heading, tabs, and custom categories | SAFE | PASS |
| 2 | IA1 — all 6 default category toggles are visible and enabled | WRITE | PASS |
| 3 | IA2 — each category has an Edit link and description text | SAFE | PASS |
| 4 | IA3 — Add New Category button is visible | SAFE | PASS |
| 5 | IA4 — Import from Gmail section with Scan & Suggest Labels | SAFE | PASS |
| 6 | IA5 — label color mode options are visible (Vibrant, Pastel, No color) | SAFE | PASS |
| 7 | IA6 — Classification Rules textarea visible with placeholder | SAFE | PASS |
| 8 | IA7 — Maximum Categories per Email section visible with select | SAFE | PASS |
| 9 | IA8 — Auto Archive tab loads with heading and description | SAFE | PASS |
| 10 | IA9 — Auto Archive tab shows all 6 category switches | SAFE | PASS |
| 11 | IA10 — switch between Categories and Auto Archive tabs | SAFE | PASS |
| 12 | IA11 — AI Drafts page loads with heading and all section headings | SAFE | PASS |
| 13 | IA12 — Writing Style Analysis section with Re-analyze and Delete buttons | WRITE | PASS |
| 14 | IA13 — Automatically Generate Replies switch is visible and checked | SAFE | PASS |
| 15 | IA14 — AI Response Instructions textarea visible with placeholder | LLM | PASS |
| 16 | IA15 — Signature section shows current signature with Edit button | SAFE | PASS |
| 17 | IA16 — Draft Frequency combobox shows current value | SAFE | PASS |
| 18 | IA17 — Draft Rules textarea visible with placeholder | SAFE | PASS |
| 19 | IA18 — Sender Blocklist input and Add button visible | SAFE | PASS |
| 20 | IA19 — Context Sources switches all visible (Knowledge Base, CRM, Calendar, Meeting History) | SAFE | PASS |
| 21 | IA20 — Draft Behavior switches visible (CC and BCC) | SAFE | PASS |
| 22 | IA21 — AI-assisted meeting scheduling section with switch and scheduler links | SAFE | PASS |
| 23 | IA22 — Automations settings page loads with heading | SAFE | PASS |
| 24 | IA23 — auto-create tasks switch visible and enabled | WRITE | PASS |
| 25 | IA24 — add tasks to calendar switch visible | SAFE | PASS |
| 26 | IA25 — Task Creation Frequency radio buttons all visible | SAFE | PASS |
| 27 | IA26 — AI-assisted meeting scheduling switch in Automations | SAFE | PASS |
| 28 | IA27 — Task Creation Instructions input visible with character counter | SAFE | PASS |
| 29 | IA28 — settings sidebar navigates between Categorization, AI Drafts, and Automations | SAFE | PASS |
| 30 | IA29 — settings search input filters sidebar options | SAFE | PASS |
| 31 | IA30 — toggle category switch on and verify state change | WRITE | PASS |
| 32 | IA31 — type in Classification Rules textarea and verify input persists | SAFE | PASS |
| 33 | IA32 — change Max Categories select and verify option change | SAFE | PASS |
| 34 | IA33 — toggle Auto Archive switch on and verify persistence | WRITE | PASS |
| 35 | IA34 — toggle Auto Replies switch and verify change | WRITE | PASS |
| 36 | IA35 — type in Instructions textarea and clear | SAFE | PASS |
| 37 | IA36 — add email to Sender Blocklist and remove | SAFE | PASS |
| 38 | IA37 — toggle Knowledge Base Context Source switch | WRITE | PASS |
| 39 | IA38 — toggle Draft CC switch and verify | WRITE | PASS |
| 40 | IA39 — toggle auto-create tasks switch and restore | WRITE | PASS |
| 41 | IA40 — select different Task Creation Frequency radio button | SAFE | PASS |
| 42 | IA41 — type in Task Instructions input and restore | SAFE | PASS |
| 43 | IA42 — toggle Add to Calendar switch and verify | WRITE | PASS |
| 44 | IA43 — multi-step flow: navigate pages, toggle settings, verify persistence | WRITE | PASS |

## 15 — 15-daily-briefing (`tests/15-daily-briefing.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | DB0 — daily briefing page loads with main heading | SAFE | PASS |
| 2 | DB1 — search and filter controls visible | SAFE | PASS |
| 3 | DB2 — briefing sections and content visible | SAFE | PASS |
| 4 | DB3 — settings and configuration controls visible | SAFE | PASS |
| 5 | DB4 — toggle switches visible for briefing preferences | WRITE | PASS |
| 6 | DB5 — action buttons visible (save, reset, preview) | SAFE | PASS |
| 7 | DB6 — tabs for different sections visible | SAFE | PASS |
| 8 | DB7 — topic/category preferences visible | SAFE | PASS |
| 9 | DB8 — scroll functionality works on briefing page | SAFE | PASS |
| 10 | DB9 — search briefing settings by keyword | SAFE | PASS |
| 11 | DB10 — toggle briefing preference switch and restore | WRITE | PASS |
| 12 | DB11 — select/deselect topic checkboxes | SAFE | PASS |
| 13 | DB12 — change briefing frequency/schedule | SAFE | PASS |
| 14 | DB13 — set preferred briefing time | SAFE | PASS |
| 15 | DB14 — save briefing preferences | SAFE | PASS |
| 16 | DB15 — reset briefing to default settings | SAFE | PASS |
| 17 | DB16 — preview briefing changes | SAFE | PASS |
| 18 | DB17 — navigate between briefing tabs | SAFE | PASS |
| 19 | DB18 — enable/disable specific categories | SAFE | PASS |
| 20 | DB19 — filter briefing content by keyword | SAFE | PASS |
| 21 | DB20 — clear all briefing filters | SAFE | PASS |
| 22 | DB21 — refresh briefing content | SAFE | PASS |
| 23 | DB22 — open briefing settings modal | SAFE | PASS |
| 24 | DB23 — sort briefing items | SAFE | PASS |
| 25 | DB24 — delete custom briefing preference | WRITE | PASS |
| 26 | DB25 — select briefing sources/providers | SAFE | PASS |
| 27 | DB26 — multi-step flow: customize and save briefing | SAFE | PASS |

## 16 — 16-meeting-hub (`tests/16-meeting-hub.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | MH0 — meetings page loads with recording controls and views | SAFE | PASS |
| 2 | MH1 — recordings and upcoming meetings tabs switch content | SAFE | PASS |
| 3 | MH2 — search filters recordings and supports no-result state | SAFE | PASS |
| 4 | MH3 — meeting type filter applies a count and can be cleared | SAFE | PASS |
| 5 | MH4 — Record Meeting menu exposes audio, bot, and upload workflows | SAFE | PASS |
| 6 | MH5 — audio recording handles blocked microphone without starting a recording | SAFE | PASS |
| 7 | MH6 — refresh meetings keeps the Meetings page usable | SAFE | PASS |
| 8 | MH7 — meeting automations page shows templates, metrics, and existing flows | SAFE | PASS |
| 9 | MH8 — create-flow editor exposes meeting trigger and safe validation state | WRITE | PASS |
| 10 | MH9 — template opens a draft with required actions and dry-run controls | SAFE | PASS |
| 11 | MH10 — existing flow editor exposes conditions, recent runs, and validation issues | SAFE | PASS |
| 12 | MH11 — existing flow test run reports dry-run outcomes and can close | SAFE | PASS |
| 13 | MH12 — Send Meeting Bot validates required URL and can be canceled | SAFE | PASS |
| 14 | MH13 — Upload Audio/Video requires a file and title and can be canceled | SAFE | PASS |
| 15 | MH14 — recorded meeting opens a detail page when recordings are available | SAFE | SKIP |

## 17 — 17-scheduling (`tests/17-scheduling.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | SC0 — scheduler dashboard page loads with heading and controls | SAFE | PASS |
| 2 | SC1 — calendar view and time slots visible on dashboard | SAFE | PASS |
| 3 | SC2 — upcoming bookings section visible on dashboard | SAFE | PASS |
| 4 | SC3 — availability toggle switch visible | WRITE | PASS |
| 5 | SC4 — booking items clickable and expandable | SAFE | PASS |
| 6 | SC5 — bookings page loads with heading and filters | SAFE | PASS |
| 7 | SC6 — bookings list or no-bookings message displays | SAFE | PASS |
| 8 | SC7 — export and pagination controls visible | SAFE | PASS |
| 9 | SC8 — booking row detail modal opens on click | SAFE | PASS |
| 10 | SC9 — toggle availability switch on dashboard | WRITE | SKIP |
| 11 | SC10 — search bookings by keyword on bookings page | SAFE | PASS |
| 12 | SC11 — filter bookings by type | SAFE | PASS |
| 13 | SC12 — navigate between dashboard and bookings pages | SAFE | PASS |
| 14 | SC13 — expand booking details and view information | SAFE | PASS |
| 15 | SC14 — scroll through dashboard calendar | SAFE | PASS |
| 16 | SC15 — multi-step flow: dashboard to bookings to search | SAFE | PASS |
| 17 | SC16 — reschedule booking from details modal | SAFE | PASS |
| 18 | SC17 — delete/cancel booking from details | WRITE | PASS |
| 19 | SC18 — apply date range filter on bookings | SAFE | PASS |
| 20 | SC19 — apply status filter on bookings page | SAFE | PASS |
| 21 | SC20 — clear all filters on bookings page | SAFE | PASS |
| 22 | SC21 — navigate pagination on bookings page | SAFE | PASS |
| 23 | SC22 — export bookings data | SAFE | PASS |
| 24 | SC23 — open meeting link from booking details | SAFE | PASS |
| 25 | SC24 — send reminder from booking details | SAFE | PASS |
| 26 | SC25 — navigate event types tab on dashboard | SAFE | PASS |
| 27 | SC26 — create new event/booking from dashboard | WRITE | PASS |
| 28 | SC27 — navigate availability settings tab | SAFE | PASS |
| 29 | SC28 — copy meeting link to clipboard | SAFE | PASS |
| 30 | SC29 — view and interact with attendees list | SAFE | PASS |
| 31 | SC30 — sort bookings by column header | SAFE | PASS |

## 18 — 18-knowledge (`tests/18-knowledge.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | K0 — page loads with heading and all source tabs | SAFE | PASS |
| 2 | K1 — URL tab shows input and import button | SAFE | PASS |
| 3 | K2 — import ZZTEST URL | SAFE | PASS |
| 4 | K3 — expand URL Imports section and verify entry, toggle, view content | WRITE | PASS |
| 5 | K4 — Text tab shows textarea and add text button | SAFE | PASS |
| 6 | K5 — add ZZTEST text entry | SAFE | PASS |
| 7 | K6 — expand Text Imports section and verify entry, toggle, view content | WRITE | PASS |
| 8 | K7 — FAQ tab shows question and answer inputs | SAFE | PASS |
| 9 | K8 — add ZZTEST FAQ entry | SAFE | PASS |
| 10 | K9 — expand FAQs section and verify entry | SAFE | PASS |
| 11 | K10 — File tab shows upload dropzone | SAFE | PASS |
| 12 | K11 — Central Docs tab with section, Sync All, and toggles | WRITE | PASS |
| 13 | K12 — Video tab shows YouTube input and upload dropzone | SAFE | PASS |
| 14 | K13 — Memories Import tab shows copy prompt and paste workflow | SAFE | PASS |
| 15 | K14 — Memories Create tab shows textarea and add memory button | WRITE | PASS |
| 16 | K15 — create ZZTEST memory via Create tab | WRITE | PASS |
| 17 | K16 — expand Memories section and verify ZZTEST entry | SAFE | PASS |
| 18 | K17 — Tickets tab shows Go to Tickets button and section | SAFE | PASS |
| 19 | K18 — Notion tab shows integration options and section | SAFE | PASS |
| 20 | K19 — search filters knowledge base articles | SAFE | PASS |
| 21 | K20 — Suggestions button opens suggestions panel | SAFE | PASS |
| 22 | K21 — delete ZZTEST URL imports | WRITE | PASS |
| 23 | K22 — delete ZZTEST text imports | WRITE | PASS |
| 24 | K23 — delete ZZTEST FAQ entries | WRITE | PASS |
| 25 | K24 — delete ZZTEST memory entries | WRITE | PASS |

## 19 — 19-team (`tests/19-team.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | T0 — page loads with heading, search, invite button, and member list | SAFE | PASS |
| 2 | T1 — search existing member dynamically, then gibberish returns zero | SAFE | PASS |
| 3 | T2 — change role of first non-YOU member (toggle) | WRITE | PASS |
| 4 | T3 — undo role change back to original | SAFE | PASS |
| 5 | T4 — invite modal shows email, role, and send button | SAFE | PASS |
| 6 | T5 — send invite for zztest user | SAFE | PASS |
| 7 | T6 — pending section shows zztest invited user | SAFE | PASS |
| 8 | T7 — revoke zztest invitation via role dropdown | SAFE | PASS |

## debug — debug-cal-explore (`tests/debug-cal-explore.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | explore calendar page — dump all elements | SAFE | PASS |

---

## Summary

| Spec file | Tests | SAFE | LLM | WRITE |
|-----------|-------|------|-----|-------|
| 01-new-chat | 18 | 12 | 3 | 3 |
| 02-saved-prompts | 5 | 3 | 0 | 2 |
| 03-history | 7 | 4 | 0 | 3 |
| 04-connect | 6 | 6 | 0 | 0 |
| 05-automations | 7 | 5 | 0 | 2 |
| 06-customize | 14 | 9 | 0 | 5 |
| 07-your-day | 21 | 20 | 1 | 0 |
| 08-calendar | 13 | 13 | 0 | 0 |
| 09-inbox | 11 | 10 | 0 | 1 |
| 10-mail-actions | 12 | 9 | 0 | 3 |
| 11-scheduling | 1 | 1 | 0 | 0 |
| 12-tasks | 16 | 14 | 0 | 2 |
| 13-shared | 8 | 8 | 0 | 0 |
| 14-inbox-assistant | 44 | 32 | 1 | 11 |
| 15-daily-briefing | 27 | 24 | 0 | 3 |
| 16-meeting-hub | 15 | 14 | 0 | 1 |
| 17-scheduling | 31 | 27 | 0 | 4 |
| 18-knowledge | 25 | 16 | 0 | 9 |
| 19-team | 8 | 7 | 0 | 1 |
| debug-cal-explore | 1 | 1 | 0 | 0 |
| **Total** | **290** | **235** | **5** | **50** |

## Legend

- **SAFE** — read-only, no mutations, no cost
- **LLM** — sends a prompt to the AI (costs quota)
- **WRITE** — mutates account data (creates/deletes/toggles)

## Architecture

- **Single browser session** — worker-scoped fixture, no page reloads between tests
- **SPA navigation** — `ensurePage()` clicks sidebar links instead of full page loads
- **Serial execution** — `workers: 1`, tests run in file order (01→07)
- **Page Object Model** — `pages/AskCentralPage.js` centralises all selectors
- **Session via storageState** — `.auth/user.json`, no login flow in tests

## Hard constraints

- `pressSequentially()` for React-controlled inputs (not `fill()`)
- Never use `waitForLoadState('networkidle')` — open sockets cause timeout
- "Publish to community skills" toggle must stay OFF
- Auto-run toggle turned OFF before saving any test prompt
- NEVER click: `aria-label='Delete automation'`, `aria-label='Execute automation now'`
- `.env` and `.auth/user.json` contents never printed or committed
