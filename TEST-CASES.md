# Central EA — Regression Test Suite

**Last run:** 318 passed, 40 failed, 403 skipped — 87.8 minutes  
**Date:** 2026-09-17 20:18  
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
| 9 | voice mode button is clickable and responds | SAFE | FAIL |
| 10 | prompts panel opens and shows content | SAFE | SKIP |
| 11 | create saved prompt with auto-run OFF and category selected | WRITE | SKIP |
| 12 | created prompt appears in prompts panel | WRITE | SKIP |
| 13 | search filters prompts in panel | SAFE | SKIP |
| 14 | clicking prompt with auto-run OFF fills composer without sending | SAFE | SKIP |
| 15 | send text message and receive AI response | LLM | SKIP |
| 16 | attach file with description and receive AI response | LLM | SKIP |
| 17 | create prompt with auto-run ON and verify it auto-sends on click | LLM | SKIP |
| 18 | three-dot menu — edit, share, delete prompt sequentially | WRITE | SKIP |
| 19 | all composer controls are visible | SAFE | PASS |
| 20 | typing in composer works with pressSequentially | SAFE | PASS |
| 21 | send button disabled when composer is empty | SAFE | PASS |
| 22 | quota pill displays used and limit | SAFE | PASS |
| 23 | filter tabs switch between all categories | SAFE | PASS |
| 24 | automation cards render and are countable | SAFE | PASS |
| 25 | suggestion prompt fills the composer | SAFE | PASS |
| 26 | dictate button is clickable and responds | SAFE | PASS |
| 27 | voice mode button is clickable and responds | SAFE | PASS |
| 28 | prompts panel opens and shows content | SAFE | PASS |
| 29 | create saved prompt with auto-run OFF and category selected | WRITE | FAIL |
| 30 | created prompt appears in prompts panel | WRITE | SKIP |
| 31 | search filters prompts in panel | SAFE | SKIP |
| 32 | clicking prompt with auto-run OFF fills composer without sending | SAFE | SKIP |
| 33 | send text message and receive AI response | LLM | SKIP |
| 34 | attach file with description and receive AI response | LLM | SKIP |
| 35 | create prompt with auto-run ON and verify it auto-sends on click | LLM | SKIP |
| 36 | three-dot menu — edit, share, delete prompt sequentially | WRITE | SKIP |
| 37 | all composer controls are visible | SAFE | PASS |
| 38 | typing in composer works with pressSequentially | SAFE | PASS |
| 39 | send button disabled when composer is empty | SAFE | PASS |
| 40 | quota pill displays used and limit | SAFE | PASS |
| 41 | filter tabs switch between all categories | SAFE | PASS |
| 42 | automation cards render and are countable | SAFE | PASS |
| 43 | suggestion prompt fills the composer | SAFE | PASS |
| 44 | dictate button is clickable and responds | SAFE | PASS |
| 45 | voice mode button is clickable and responds | SAFE | PASS |
| 46 | prompts panel opens and shows content | SAFE | PASS |
| 47 | create saved prompt with auto-run OFF and category selected | WRITE | FAIL |
| 48 | created prompt appears in prompts panel | WRITE | SKIP |
| 49 | search filters prompts in panel | SAFE | SKIP |
| 50 | clicking prompt with auto-run OFF fills composer without sending | SAFE | SKIP |
| 51 | send text message and receive AI response | LLM | SKIP |
| 52 | attach file with description and receive AI response | LLM | SKIP |
| 53 | create prompt with auto-run ON and verify it auto-sends on click | LLM | SKIP |
| 54 | three-dot menu — edit, share, delete prompt sequentially | WRITE | SKIP |

## 02 — Saved Prompts (`tests/02-saved-prompts.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | create first saved prompt | WRITE | FAIL |
| 2 | first prompt visible in panel | SAFE | SKIP |
| 3 | search filters saved prompts | SAFE | SKIP |
| 4 | create second saved prompt | WRITE | SKIP |
| 5 | navigate to Customize page | SAFE | SKIP |
| 6 | create first saved prompt | WRITE | PASS |
| 7 | first prompt visible in panel | SAFE | PASS |
| 8 | search filters saved prompts | SAFE | PASS |
| 9 | create second saved prompt | WRITE | PASS |
| 10 | navigate to Customize page | SAFE | PASS |

## 03 — History (`tests/03-history.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | conversation list renders | SAFE | PASS |
| 2 | search filters conversations | SAFE | PASS |
| 3 | open conversation navigates away | SAFE | PASS |
| 4 | "Open menu" shows Rename and Delete | WRITE | PASS |
| 5 | rename a conversation | WRITE | FAIL |
| 6 | delete a conversation | WRITE | SKIP |
| 7 | New Chat button navigates | SAFE | SKIP |
| 8 | conversation list renders | SAFE | PASS |
| 9 | search filters conversations | SAFE | PASS |
| 10 | open conversation navigates away | SAFE | PASS |
| 11 | "Open menu" shows Rename and Delete | WRITE | PASS |
| 12 | rename a conversation | WRITE | PASS |
| 13 | delete a conversation | WRITE | SKIP |
| 14 | New Chat button navigates | SAFE | PASS |

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
| 1 | create new test rule | WRITE | FAIL |
| 2 | rules list renders | SAFE | SKIP |
| 3 | rule toggles are visible | WRITE | SKIP |
| 4 | toggle rule on and off | WRITE | SKIP |
| 5 | search filters rules | SAFE | SKIP |
| 6 | edit rule panel opens and closes | SAFE | SKIP |
| 7 | Saved Prompts tab loads | SAFE | SKIP |
| 8 | saved prompts list renders | SAFE | SKIP |
| 9 | search saved prompts on customize | SAFE | SKIP |
| 10 | Community tab loads | SAFE | SKIP |
| 11 | community skills are visible | SAFE | SKIP |
| 12 | install community skill for test | WRITE | SKIP |
| 13 | all tab buttons visible | SAFE | SKIP |
| 14 | delete test rule | WRITE | SKIP |
| 15 | create new test rule | WRITE | FAIL |
| 16 | rules list renders | SAFE | SKIP |
| 17 | rule toggles are visible | WRITE | SKIP |
| 18 | toggle rule on and off | WRITE | SKIP |
| 19 | search filters rules | SAFE | SKIP |
| 20 | edit rule panel opens and closes | SAFE | SKIP |
| 21 | Saved Prompts tab loads | SAFE | SKIP |
| 22 | saved prompts list renders | SAFE | SKIP |
| 23 | search saved prompts on customize | SAFE | SKIP |
| 24 | Community tab loads | SAFE | SKIP |
| 25 | community skills are visible | SAFE | SKIP |
| 26 | install community skill for test | WRITE | SKIP |
| 27 | all tab buttons visible | SAFE | SKIP |
| 28 | delete test rule | WRITE | SKIP |
| 29 | create new test rule | WRITE | FAIL |
| 30 | rules list renders | SAFE | SKIP |
| 31 | rule toggles are visible | WRITE | SKIP |
| 32 | toggle rule on and off | WRITE | SKIP |
| 33 | search filters rules | SAFE | SKIP |
| 34 | edit rule panel opens and closes | SAFE | SKIP |
| 35 | Saved Prompts tab loads | SAFE | SKIP |
| 36 | saved prompts list renders | SAFE | SKIP |
| 37 | search saved prompts on customize | SAFE | SKIP |
| 38 | Community tab loads | SAFE | SKIP |
| 39 | community skills are visible | SAFE | SKIP |
| 40 | install community skill for test | WRITE | SKIP |
| 41 | all tab buttons visible | SAFE | SKIP |
| 42 | delete test rule | WRITE | SKIP |

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
| 16 | send message in Ask Central modal and receive AI response | LLM | FAIL |
| 17 | Ask Central modal — history, options, prompts, attach, expand, minimize | SAFE | SKIP |
| 18 | summary scroll down, refresh, and briefing settings button | SAFE | SKIP |
| 19 | To-Dos refresh, Done For You tab, and view task | SAFE | SKIP |
| 20 | expand calendar and click Next Up meeting link | SAFE | SKIP |
| 21 | calendar expand, day navigation, and scroll | SAFE | SKIP |
| 22 | page loads with greeting and status pills | SAFE | PASS |
| 23 | sync status bar shows connected apps | SAFE | PASS |
| 24 | composer bar visible with Voice, Dictate, Send buttons | SAFE | PASS |
| 25 | evening summary section renders with work updates | SAFE | PASS |
| 26 | summary action buttons are visible and clickable | SAFE | PASS |
| 27 | View Context expands and collapses on work update | SAFE | PASS |
| 28 | summary section collapses and expands | SAFE | PASS |
| 29 | Your To-Dos section visible with Ready for You and Done For You tabs | SAFE | PASS |
| 30 | To-Do tabs switch between Ready for You and Done For You | SAFE | PASS |
| 31 | Done For You tab shows content when clicked | SAFE | PASS |
| 32 | calendar sidebar visible with date and navigation | SAFE | PASS |
| 33 | calendar navigation switches between days | SAFE | PASS |
| 34 | connect apps banner visible with Connect button | SAFE | PASS |
| 35 | settings button opens daily briefing settings and returns | SAFE | PASS |
| 36 | send button opens Ask Central modal with greeting and suggestions | SAFE | PASS |
| 37 | send message in Ask Central modal and receive AI response | LLM | FAIL |
| 38 | Ask Central modal — history, options, prompts, attach, expand, minimize | SAFE | SKIP |
| 39 | summary scroll down, refresh, and briefing settings button | SAFE | SKIP |
| 40 | To-Dos refresh, Done For You tab, and view task | SAFE | SKIP |
| 41 | expand calendar and click Next Up meeting link | SAFE | SKIP |
| 42 | calendar expand, day navigation, and scroll | SAFE | SKIP |
| 43 | page loads with greeting and status pills | SAFE | PASS |
| 44 | sync status bar shows connected apps | SAFE | PASS |
| 45 | composer bar visible with Voice, Dictate, Send buttons | SAFE | PASS |
| 46 | evening summary section renders with work updates | SAFE | PASS |
| 47 | summary action buttons are visible and clickable | SAFE | PASS |
| 48 | View Context expands and collapses on work update | SAFE | PASS |
| 49 | summary section collapses and expands | SAFE | PASS |
| 50 | Your To-Dos section visible with Ready for You and Done For You tabs | SAFE | PASS |
| 51 | To-Do tabs switch between Ready for You and Done For You | SAFE | PASS |
| 52 | Done For You tab shows content when clicked | SAFE | PASS |
| 53 | calendar sidebar visible with date and navigation | SAFE | PASS |
| 54 | calendar navigation switches between days | SAFE | PASS |
| 55 | connect apps banner visible with Connect button | SAFE | PASS |
| 56 | settings button opens daily briefing settings and returns | SAFE | PASS |
| 57 | send button opens Ask Central modal with greeting and suggestions | SAFE | PASS |
| 58 | send message in Ask Central modal and receive AI response | LLM | FAIL |
| 59 | Ask Central modal — history, options, prompts, attach, expand, minimize | SAFE | SKIP |
| 60 | summary scroll down, refresh, and briefing settings button | SAFE | SKIP |
| 61 | To-Dos refresh, Done For You tab, and view task | SAFE | SKIP |
| 62 | expand calendar and click Next Up meeting link | SAFE | SKIP |
| 63 | calendar expand, day navigation, and scroll | SAFE | SKIP |

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
| 13 | exit full calendar navigates away | SAFE | FAIL |
| 14 | calendar page loads with date and view controls | SAFE | PASS |
| 15 | day view shows timeline and Next Up sidebar | SAFE | PASS |
| 16 | click event opens detail popup with meeting info | SAFE | PASS |
| 17 | close event detail popup | SAFE | PASS |
| 18 | navigate next day and back | SAFE | PASS |
| 19 | Today button returns to current date | SAFE | PASS |
| 20 | switch to Week view and verify | SAFE | PASS |
| 21 | week view prev and next navigation | SAFE | PASS |
| 22 | switch to Month view and verify | SAFE | PASS |
| 23 | month view prev and next navigation | SAFE | PASS |
| 24 | return to Day view from Month | SAFE | PASS |
| 25 | scroll day timeline up and down | SAFE | PASS |
| 26 | exit full calendar navigates away | SAFE | FAIL |
| 27 | calendar page loads with date and view controls | SAFE | PASS |
| 28 | day view shows timeline and Next Up sidebar | SAFE | PASS |
| 29 | click event opens detail popup with meeting info | SAFE | PASS |
| 30 | close event detail popup | SAFE | PASS |
| 31 | navigate next day and back | SAFE | PASS |
| 32 | Today button returns to current date | SAFE | PASS |
| 33 | switch to Week view and verify | SAFE | PASS |
| 34 | week view prev and next navigation | SAFE | PASS |
| 35 | switch to Month view and verify | SAFE | PASS |
| 36 | month view prev and next navigation | SAFE | PASS |
| 37 | return to Day view from Month | SAFE | PASS |
| 38 | scroll day timeline up and down | SAFE | PASS |
| 39 | exit full calendar navigates away | SAFE | PASS |

## 09 — 09-inbox (`tests/09-inbox.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | inbox page loads with filters and email list | SAFE | PASS |
| 2 | click all filter tabs | SAFE | PASS |
| 3 | manage categories opens with category list | SAFE | PASS |
| 4 | edit category — change and undo all changes | SAFE | PASS |
| 5 | delete category — click Stay on Page | WRITE | PASS |
| 6 | filter emails dropdown and options | SAFE | PASS |
| 7 | open search and type query | SAFE | FAIL |
| 8 | switch to detailed view and back | SAFE | SKIP |
| 9 | refresh emails and wait | SAFE | SKIP |
| 10 | compose — open, maximize, fill, clear, close | SAFE | SKIP |
| 11 | accounts — connected accounts panel | SAFE | SKIP |
| 12 | inbox page loads with filters and email list | SAFE | PASS |
| 13 | click all filter tabs | SAFE | PASS |
| 14 | manage categories opens with category list | SAFE | PASS |
| 15 | edit category — change and undo all changes | SAFE | PASS |
| 16 | delete category — click Stay on Page | WRITE | PASS |
| 17 | filter emails dropdown and options | SAFE | PASS |
| 18 | open search and type query | SAFE | FAIL |
| 19 | switch to detailed view and back | SAFE | SKIP |
| 20 | refresh emails and wait | SAFE | SKIP |
| 21 | compose — open, maximize, fill, clear, close | SAFE | SKIP |
| 22 | accounts — connected accounts panel | SAFE | SKIP |
| 23 | inbox page loads with filters and email list | SAFE | PASS |
| 24 | click all filter tabs | SAFE | PASS |
| 25 | manage categories opens with category list | SAFE | PASS |
| 26 | edit category — change and undo all changes | SAFE | PASS |
| 27 | delete category — click Stay on Page | WRITE | PASS |
| 28 | filter emails dropdown and options | SAFE | PASS |
| 29 | open search and type query | SAFE | PASS |
| 30 | switch to detailed view and back | SAFE | PASS |
| 31 | refresh emails and wait | SAFE | PASS |
| 32 | compose — open, maximize, fill, clear, close | SAFE | PASS |
| 33 | accounts — connected accounts panel | SAFE | PASS |

## 10 — 10-mail-actions (`tests/10-mail-actions.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | switch to Google account | SAFE | FAIL |
| 2 | select email shows bottom action toolbar | SAFE | SKIP |
| 3 | select all and deselect all via toolbar | SAFE | SKIP |
| 4 | star an email via star button | SAFE | SKIP |
| 5 | starred folder shows the starred email | SAFE | SKIP |
| 6 | unstar email and verify in inbox | SAFE | SKIP |
| 7 | hover actions — mark as done and mark as unread | SAFE | SKIP |
| 8 | create a task from email | WRITE | SKIP |
| 9 | compose and send email to self, verify in Sent | SAFE | SKIP |
| 10 | open sent email detail view and verify body | SAFE | SKIP |
| 11 | delete sent ZZTEST email | WRITE | SKIP |
| 12 | trash folder loads with deleted email | WRITE | SKIP |
| 13 | switch to Google account | SAFE | FAIL |
| 14 | select email shows bottom action toolbar | SAFE | SKIP |
| 15 | select all and deselect all via toolbar | SAFE | SKIP |
| 16 | star an email via star button | SAFE | SKIP |
| 17 | starred folder shows the starred email | SAFE | SKIP |
| 18 | unstar email and verify in inbox | SAFE | SKIP |
| 19 | hover actions — mark as done and mark as unread | SAFE | SKIP |
| 20 | create a task from email | WRITE | SKIP |
| 21 | compose and send email to self, verify in Sent | SAFE | SKIP |
| 22 | open sent email detail view and verify body | SAFE | SKIP |
| 23 | delete sent ZZTEST email | WRITE | SKIP |
| 24 | trash folder loads with deleted email | WRITE | SKIP |
| 25 | switch to Google account | SAFE | PASS |
| 26 | select email shows bottom action toolbar | SAFE | PASS |
| 27 | select all and deselect all via toolbar | SAFE | PASS |
| 28 | star an email via star button | SAFE | PASS |
| 29 | starred folder shows the starred email | SAFE | FAIL |
| 30 | unstar email and verify in inbox | SAFE | SKIP |
| 31 | hover actions — mark as done and mark as unread | SAFE | SKIP |
| 32 | create a task from email | WRITE | SKIP |
| 33 | compose and send email to self, verify in Sent | SAFE | SKIP |
| 34 | open sent email detail view and verify body | SAFE | SKIP |
| 35 | delete sent ZZTEST email | WRITE | SKIP |
| 36 | trash folder loads with deleted email | WRITE | SKIP |

## 11 — 11-scheduling (`tests/11-scheduling.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | schedule email via send dropdown, verify in Scheduled, then cancel | SAFE | SKIP |

## 12 — 12-tasks (`tests/12-tasks.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | tasks page loads with task counter | SAFE | PASS |
| 2 | all tasks dropdown shows options | SAFE | PASS |
| 3 | filter tasks by user avatar | SAFE | FAIL |
| 4 | search tasks via search icon | SAFE | SKIP |
| 5 | toggle between list and board view | WRITE | SKIP |
| 6 | filter icon opens filter panel | SAFE | SKIP |
| 7 | filter by Priority Urgent and clear | SAFE | SKIP |
| 8 | add task via button | SAFE | SKIP |
| 9 | click task opens detail panel | SAFE | SKIP |
| 10 | more actions menu shows options | SAFE | SKIP |
| 11 | task status circle changes status and undo on zztest task | SAFE | SKIP |
| 12 | do it for me button triggers action | SAFE | SKIP |
| 13 | view all link loads full task list | SAFE | SKIP |
| 14 | calendar panel date navigation | SAFE | SKIP |
| 15 | day dropdown shows view options | SAFE | SKIP |
| 16 | delete zztest tasks created in add task test | WRITE | SKIP |
| 17 | tasks page loads with task counter | SAFE | PASS |
| 18 | all tasks dropdown shows options | SAFE | PASS |
| 19 | filter tasks by user avatar | SAFE | PASS |
| 20 | search tasks via search icon | SAFE | PASS |
| 21 | toggle between list and board view | WRITE | PASS |
| 22 | filter icon opens filter panel | SAFE | PASS |
| 23 | filter by Priority Urgent and clear | SAFE | FAIL |
| 24 | add task via button | SAFE | SKIP |
| 25 | click task opens detail panel | SAFE | SKIP |
| 26 | more actions menu shows options | SAFE | SKIP |
| 27 | task status circle changes status and undo on zztest task | SAFE | SKIP |
| 28 | do it for me button triggers action | SAFE | SKIP |
| 29 | view all link loads full task list | SAFE | SKIP |
| 30 | calendar panel date navigation | SAFE | SKIP |
| 31 | day dropdown shows view options | SAFE | SKIP |
| 32 | delete zztest tasks created in add task test | WRITE | SKIP |
| 33 | tasks page loads with task counter | SAFE | PASS |
| 34 | all tasks dropdown shows options | SAFE | PASS |
| 35 | filter tasks by user avatar | SAFE | FAIL |
| 36 | filter by Priority Urgent and clear | SAFE | SKIP |
| 37 | search tasks via search icon | SAFE | SKIP |
| 38 | toggle between list and board view | WRITE | SKIP |
| 39 | filter icon opens filter panel | SAFE | SKIP |
| 40 | add task via button | SAFE | SKIP |
| 41 | click task opens detail panel | SAFE | SKIP |
| 42 | more actions menu shows options | SAFE | SKIP |
| 43 | task status circle changes status and undo on zztest task | SAFE | SKIP |
| 44 | do it for me button triggers action | SAFE | SKIP |
| 45 | view all link loads full task list | SAFE | SKIP |
| 46 | calendar panel date navigation | SAFE | SKIP |
| 47 | day dropdown shows view options | SAFE | SKIP |
| 48 | delete zztest tasks created in add task test | WRITE | SKIP |

## 13 — 13-shared (`tests/13-shared.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | S0 — shared page loads (empty state or existing assignments) | SAFE | PASS |
| 2 | S1 — find unassigned email in Inbox and open it | SAFE | FAIL |
| 3 | S2 — assign email to self | SAFE | SKIP |
| 4 | S3 — shared page shows the assigned email | SAFE | SKIP |
| 5 | S4 — Assigned, Shared, Mentioned tabs are clickable and working | SAFE | SKIP |
| 6 | S5 — add team comment with @mention and verify | SAFE | SKIP |
| 7 | S6 — remove assignment and verify thread count decreased | SAFE | SKIP |
| 8 | S7 — open assigned email from shared page and verify detail | SAFE | SKIP |
| 9 | S0 — shared page loads (empty state or existing assignments) | SAFE | PASS |
| 10 | S1 — find unassigned email in Inbox and open it | SAFE | FAIL |
| 11 | S2 — assign email to self | SAFE | SKIP |
| 12 | S3 — shared page shows the assigned email | SAFE | SKIP |
| 13 | S4 — Assigned, Shared, Mentioned tabs are clickable and working | SAFE | SKIP |
| 14 | S5 — add team comment with @mention and verify | SAFE | SKIP |
| 15 | S6 — remove assignment and verify thread count decreased | SAFE | SKIP |
| 16 | S7 — open assigned email from shared page and verify detail | SAFE | SKIP |
| 17 | S0 — shared page loads (empty state or existing assignments) | SAFE | FAIL |
| 18 | S1 — find unassigned email in Inbox and open it | SAFE | SKIP |
| 19 | S2 — assign email to self | SAFE | SKIP |
| 20 | S3 — shared page shows the assigned email | SAFE | SKIP |
| 21 | S4 — Assigned, Shared, Mentioned tabs are clickable and working | SAFE | SKIP |
| 22 | S5 — add team comment with @mention and verify | SAFE | SKIP |
| 23 | S6 — remove assignment and verify thread count decreased | SAFE | SKIP |
| 24 | S7 — open assigned email from shared page and verify detail | SAFE | SKIP |

## 14 — 14-inbox-assistant (`tests/14-inbox-assistant.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | IA0 — categorization page loads with heading, tabs, and custom categories | SAFE | FAIL |
| 2 | IA1 — all 6 default category toggles are visible and enabled | WRITE | SKIP |
| 3 | IA2 — each category has an Edit link and description text | SAFE | SKIP |
| 4 | IA3 — Add New Category button is visible | SAFE | SKIP |
| 5 | IA4 — Import from Gmail section with Scan & Suggest Labels | SAFE | SKIP |
| 6 | IA5 — label color mode options are visible (Vibrant, Pastel, No color) | SAFE | SKIP |
| 7 | IA6 — Classification Rules textarea visible with placeholder | SAFE | SKIP |
| 8 | IA7 — Maximum Categories per Email section visible with select | SAFE | SKIP |
| 9 | IA8 — Auto Archive tab loads with heading and description | SAFE | SKIP |
| 10 | IA9 — Auto Archive tab shows all 6 category switches | SAFE | SKIP |
| 11 | IA10 — switch between Categories and Auto Archive tabs | SAFE | SKIP |
| 12 | IA11 — AI Drafts page loads with heading and all section headings | SAFE | SKIP |
| 13 | IA12 — Writing Style Analysis section with Re-analyze and Delete buttons | WRITE | SKIP |
| 14 | IA13 — Automatically Generate Replies switch is visible and checked | SAFE | SKIP |
| 15 | IA14 — AI Response Instructions textarea visible with placeholder | LLM | SKIP |
| 16 | IA15 — Signature section shows current signature with Edit button | SAFE | SKIP |
| 17 | IA16 — Draft Frequency combobox shows current value | SAFE | SKIP |
| 18 | IA17 — Draft Rules textarea visible with placeholder | SAFE | SKIP |
| 19 | IA18 — Sender Blocklist input and Add button visible | SAFE | SKIP |
| 20 | IA19 — Context Sources switches all visible (Knowledge Base, CRM, Calendar, Meeting History) | SAFE | SKIP |
| 21 | IA20 — Draft Behavior switches visible (CC and BCC) | SAFE | SKIP |
| 22 | IA21 — AI-assisted meeting scheduling section with switch and scheduler links | SAFE | SKIP |
| 23 | IA22 — Automations settings page loads with heading | SAFE | SKIP |
| 24 | IA23 — auto-create tasks switch visible and enabled | WRITE | SKIP |
| 25 | IA24 — add tasks to calendar switch visible | SAFE | SKIP |
| 26 | IA25 — Task Creation Frequency radio buttons all visible | SAFE | SKIP |
| 27 | IA26 — AI-assisted meeting scheduling switch in Automations | SAFE | SKIP |
| 28 | IA27 — Task Creation Instructions input visible with character counter | SAFE | SKIP |
| 29 | IA28 — settings sidebar navigates between Categorization, AI Drafts, and Automations | SAFE | SKIP |
| 30 | IA29 — settings search input filters sidebar options | SAFE | SKIP |
| 31 | IA30 — toggle category switch on and verify state change | WRITE | SKIP |
| 32 | IA31 — type in Classification Rules textarea and verify input persists | SAFE | SKIP |
| 33 | IA32 — change Max Categories select and verify option change | SAFE | SKIP |
| 34 | IA33 — toggle Auto Archive switch on and verify persistence | WRITE | SKIP |
| 35 | IA34 — toggle Auto Replies switch and verify change | WRITE | SKIP |
| 36 | IA35 — type in Instructions textarea and clear | SAFE | SKIP |
| 37 | IA36 — add email to Sender Blocklist and remove | SAFE | SKIP |
| 38 | IA37 — toggle Knowledge Base Context Source switch | WRITE | SKIP |
| 39 | IA38 — toggle Draft CC switch and verify | WRITE | SKIP |
| 40 | IA39 — toggle auto-create tasks switch and restore | WRITE | SKIP |
| 41 | IA40 — select different Task Creation Frequency radio button | SAFE | SKIP |
| 42 | IA41 — type in Task Instructions input and restore | SAFE | SKIP |
| 43 | IA42 — toggle Add to Calendar switch and verify | WRITE | SKIP |
| 44 | IA43 — multi-step flow: navigate pages, toggle settings, verify persistence | WRITE | SKIP |
| 45 | IA0 — categorization page loads with heading, tabs, and custom categories | SAFE | FAIL |
| 46 | IA1 — all 6 default category toggles are visible and enabled | WRITE | SKIP |
| 47 | IA2 — each category has an Edit link and description text | SAFE | SKIP |
| 48 | IA3 — Add New Category button is visible | SAFE | SKIP |
| 49 | IA4 — Import from Gmail section with Scan & Suggest Labels | SAFE | SKIP |
| 50 | IA5 — label color mode options are visible (Vibrant, Pastel, No color) | SAFE | SKIP |
| 51 | IA6 — Classification Rules textarea visible with placeholder | SAFE | SKIP |
| 52 | IA7 — Maximum Categories per Email section visible with select | SAFE | SKIP |
| 53 | IA8 — Auto Archive tab loads with heading and description | SAFE | SKIP |
| 54 | IA9 — Auto Archive tab shows all 6 category switches | SAFE | SKIP |
| 55 | IA10 — switch between Categories and Auto Archive tabs | SAFE | SKIP |
| 56 | IA11 — AI Drafts page loads with heading and all section headings | SAFE | SKIP |
| 57 | IA12 — Writing Style Analysis section with Re-analyze and Delete buttons | WRITE | SKIP |
| 58 | IA13 — Automatically Generate Replies switch is visible and checked | SAFE | SKIP |
| 59 | IA14 — AI Response Instructions textarea visible with placeholder | LLM | SKIP |
| 60 | IA15 — Signature section shows current signature with Edit button | SAFE | SKIP |
| 61 | IA16 — Draft Frequency combobox shows current value | SAFE | SKIP |
| 62 | IA17 — Draft Rules textarea visible with placeholder | SAFE | SKIP |
| 63 | IA18 — Sender Blocklist input and Add button visible | SAFE | SKIP |
| 64 | IA19 — Context Sources switches all visible (Knowledge Base, CRM, Calendar, Meeting History) | SAFE | SKIP |
| 65 | IA20 — Draft Behavior switches visible (CC and BCC) | SAFE | SKIP |
| 66 | IA21 — AI-assisted meeting scheduling section with switch and scheduler links | SAFE | SKIP |
| 67 | IA22 — Automations settings page loads with heading | SAFE | SKIP |
| 68 | IA23 — auto-create tasks switch visible and enabled | WRITE | SKIP |
| 69 | IA24 — add tasks to calendar switch visible | SAFE | SKIP |
| 70 | IA25 — Task Creation Frequency radio buttons all visible | SAFE | SKIP |
| 71 | IA26 — AI-assisted meeting scheduling switch in Automations | SAFE | SKIP |
| 72 | IA27 — Task Creation Instructions input visible with character counter | SAFE | SKIP |
| 73 | IA28 — settings sidebar navigates between Categorization, AI Drafts, and Automations | SAFE | SKIP |
| 74 | IA29 — settings search input filters sidebar options | SAFE | SKIP |
| 75 | IA30 — toggle category switch on and verify state change | WRITE | SKIP |
| 76 | IA31 — type in Classification Rules textarea and verify input persists | SAFE | SKIP |
| 77 | IA32 — change Max Categories select and verify option change | SAFE | SKIP |
| 78 | IA33 — toggle Auto Archive switch on and verify persistence | WRITE | SKIP |
| 79 | IA34 — toggle Auto Replies switch and verify change | WRITE | SKIP |
| 80 | IA35 — type in Instructions textarea and clear | SAFE | SKIP |
| 81 | IA36 — add email to Sender Blocklist and remove | SAFE | SKIP |
| 82 | IA37 — toggle Knowledge Base Context Source switch | WRITE | SKIP |
| 83 | IA38 — toggle Draft CC switch and verify | WRITE | SKIP |
| 84 | IA39 — toggle auto-create tasks switch and restore | WRITE | SKIP |
| 85 | IA40 — select different Task Creation Frequency radio button | SAFE | SKIP |
| 86 | IA41 — type in Task Instructions input and restore | SAFE | SKIP |
| 87 | IA42 — toggle Add to Calendar switch and verify | WRITE | SKIP |
| 88 | IA43 — multi-step flow: navigate pages, toggle settings, verify persistence | WRITE | SKIP |
| 89 | IA0 — categorization page loads with heading, tabs, and custom categories | SAFE | FAIL |
| 90 | IA1 — all 6 default category toggles are visible and enabled | WRITE | SKIP |
| 91 | IA2 — each category has an Edit link and description text | SAFE | SKIP |
| 92 | IA3 — Add New Category button is visible | SAFE | SKIP |
| 93 | IA4 — Import from Gmail section with Scan & Suggest Labels | SAFE | SKIP |
| 94 | IA5 — label color mode options are visible (Vibrant, Pastel, No color) | SAFE | SKIP |
| 95 | IA6 — Classification Rules textarea visible with placeholder | SAFE | SKIP |
| 96 | IA7 — Maximum Categories per Email section visible with select | SAFE | SKIP |
| 97 | IA8 — Auto Archive tab loads with heading and description | SAFE | SKIP |
| 98 | IA9 — Auto Archive tab shows all 6 category switches | SAFE | SKIP |
| 99 | IA10 — switch between Categories and Auto Archive tabs | SAFE | SKIP |
| 100 | IA11 — AI Drafts page loads with heading and all section headings | SAFE | SKIP |
| 101 | IA12 — Writing Style Analysis section with Re-analyze and Delete buttons | WRITE | SKIP |
| 102 | IA13 — Automatically Generate Replies switch is visible and checked | SAFE | SKIP |
| 103 | IA14 — AI Response Instructions textarea visible with placeholder | LLM | SKIP |
| 104 | IA15 — Signature section shows current signature with Edit button | SAFE | SKIP |
| 105 | IA16 — Draft Frequency combobox shows current value | SAFE | SKIP |
| 106 | IA17 — Draft Rules textarea visible with placeholder | SAFE | SKIP |
| 107 | IA18 — Sender Blocklist input and Add button visible | SAFE | SKIP |
| 108 | IA19 — Context Sources switches all visible (Knowledge Base, CRM, Calendar, Meeting History) | SAFE | SKIP |
| 109 | IA20 — Draft Behavior switches visible (CC and BCC) | SAFE | SKIP |
| 110 | IA21 — AI-assisted meeting scheduling section with switch and scheduler links | SAFE | SKIP |
| 111 | IA22 — Automations settings page loads with heading | SAFE | SKIP |
| 112 | IA23 — auto-create tasks switch visible and enabled | WRITE | SKIP |
| 113 | IA24 — add tasks to calendar switch visible | SAFE | SKIP |
| 114 | IA25 — Task Creation Frequency radio buttons all visible | SAFE | SKIP |
| 115 | IA26 — AI-assisted meeting scheduling switch in Automations | SAFE | SKIP |
| 116 | IA27 — Task Creation Instructions input visible with character counter | SAFE | SKIP |
| 117 | IA28 — settings sidebar navigates between Categorization, AI Drafts, and Automations | SAFE | SKIP |
| 118 | IA29 — settings search input filters sidebar options | SAFE | SKIP |
| 119 | IA30 — toggle category switch on and verify state change | WRITE | SKIP |
| 120 | IA31 — type in Classification Rules textarea and verify input persists | SAFE | SKIP |
| 121 | IA32 — change Max Categories select and verify option change | SAFE | SKIP |
| 122 | IA33 — toggle Auto Archive switch on and verify persistence | WRITE | SKIP |
| 123 | IA34 — toggle Auto Replies switch and verify change | WRITE | SKIP |
| 124 | IA35 — type in Instructions textarea and clear | SAFE | SKIP |
| 125 | IA36 — add email to Sender Blocklist and remove | SAFE | SKIP |
| 126 | IA37 — toggle Knowledge Base Context Source switch | WRITE | SKIP |
| 127 | IA38 — toggle Draft CC switch and verify | WRITE | SKIP |
| 128 | IA39 — toggle auto-create tasks switch and restore | WRITE | SKIP |
| 129 | IA40 — select different Task Creation Frequency radio button | SAFE | SKIP |
| 130 | IA41 — type in Task Instructions input and restore | SAFE | SKIP |
| 131 | IA42 — toggle Add to Calendar switch and verify | WRITE | SKIP |
| 132 | IA43 — multi-step flow: navigate pages, toggle settings, verify persistence | WRITE | SKIP |

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
| 10 | MH9 — template opens a draft with required actions and dry-run controls | SAFE | FAIL |
| 11 | MH10 — existing flow editor exposes conditions, recent runs, and validation issues | SAFE | SKIP |
| 12 | MH11 — existing flow test run reports dry-run outcomes and can close | SAFE | SKIP |
| 13 | MH12 — Send Meeting Bot validates required URL and can be canceled | SAFE | SKIP |
| 14 | MH13 — Upload Audio/Video requires a file and title and can be canceled | SAFE | SKIP |
| 15 | MH14 — recorded meeting opens a detail page when recordings are available | SAFE | SKIP |
| 16 | MH0 — meetings page loads with recording controls and views | SAFE | PASS |
| 17 | MH1 — recordings and upcoming meetings tabs switch content | SAFE | PASS |
| 18 | MH2 — search filters recordings and supports no-result state | SAFE | PASS |
| 19 | MH3 — meeting type filter applies a count and can be cleared | SAFE | PASS |
| 20 | MH4 — Record Meeting menu exposes audio, bot, and upload workflows | SAFE | PASS |
| 21 | MH5 — audio recording handles blocked microphone without starting a recording | SAFE | PASS |
| 22 | MH6 — refresh meetings keeps the Meetings page usable | SAFE | PASS |
| 23 | MH7 — meeting automations page shows templates, metrics, and existing flows | SAFE | PASS |
| 24 | MH8 — create-flow editor exposes meeting trigger and safe validation state | WRITE | PASS |
| 25 | MH9 — template opens a draft with required actions and dry-run controls | SAFE | PASS |
| 26 | MH10 — existing flow editor exposes conditions, recent runs, and validation issues | SAFE | PASS |
| 27 | MH11 — existing flow test run reports dry-run outcomes and can close | SAFE | PASS |
| 28 | MH12 — Send Meeting Bot validates required URL and can be canceled | SAFE | PASS |
| 29 | MH13 — Upload Audio/Video requires a file and title and can be canceled | SAFE | PASS |
| 30 | MH14 — recorded meeting opens a detail page when recordings are available | SAFE | PASS |

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
| 10 | SC9 — toggle availability switch on dashboard | WRITE | PASS |
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
| 27 | SC26 — create new event/booking from dashboard | WRITE | FAIL |
| 28 | SC27 — navigate availability settings tab | SAFE | SKIP |
| 29 | SC28 — copy meeting link to clipboard | SAFE | SKIP |
| 30 | SC29 — view and interact with attendees list | SAFE | SKIP |
| 31 | SC30 — sort bookings by column header | SAFE | SKIP |
| 32 | SC0 — scheduler dashboard page loads with heading and controls | SAFE | PASS |
| 33 | SC1 — calendar view and time slots visible on dashboard | SAFE | PASS |
| 34 | SC2 — upcoming bookings section visible on dashboard | SAFE | PASS |
| 35 | SC3 — availability toggle switch visible | WRITE | PASS |
| 36 | SC4 — booking items clickable and expandable | SAFE | PASS |
| 37 | SC5 — bookings page loads with heading and filters | SAFE | PASS |
| 38 | SC6 — bookings list or no-bookings message displays | SAFE | PASS |
| 39 | SC7 — export and pagination controls visible | SAFE | PASS |
| 40 | SC8 — booking row detail modal opens on click | SAFE | PASS |
| 41 | SC9 — toggle availability switch on dashboard | WRITE | PASS |
| 42 | SC10 — search bookings by keyword on bookings page | SAFE | PASS |
| 43 | SC11 — filter bookings by type | SAFE | PASS |
| 44 | SC12 — navigate between dashboard and bookings pages | SAFE | PASS |
| 45 | SC13 — expand booking details and view information | SAFE | PASS |
| 46 | SC14 — scroll through dashboard calendar | SAFE | PASS |
| 47 | SC15 — multi-step flow: dashboard to bookings to search | SAFE | PASS |
| 48 | SC16 — reschedule booking from details modal | SAFE | PASS |
| 49 | SC17 — delete/cancel booking from details | WRITE | PASS |
| 50 | SC18 — apply date range filter on bookings | SAFE | PASS |
| 51 | SC19 — apply status filter on bookings page | SAFE | PASS |
| 52 | SC20 — clear all filters on bookings page | SAFE | PASS |
| 53 | SC21 — navigate pagination on bookings page | SAFE | PASS |
| 54 | SC22 — export bookings data | SAFE | PASS |
| 55 | SC23 — open meeting link from booking details | SAFE | PASS |
| 56 | SC24 — send reminder from booking details | SAFE | PASS |
| 57 | SC25 — navigate event types tab on dashboard | SAFE | PASS |
| 58 | SC26 — create new event/booking from dashboard | WRITE | FAIL |
| 59 | SC27 — navigate availability settings tab | SAFE | SKIP |
| 60 | SC28 — copy meeting link to clipboard | SAFE | SKIP |
| 61 | SC29 — view and interact with attendees list | SAFE | SKIP |
| 62 | SC30 — sort bookings by column header | SAFE | SKIP |
| 63 | SC0 — scheduler dashboard page loads with heading and controls | SAFE | PASS |
| 64 | SC1 — calendar view and time slots visible on dashboard | SAFE | PASS |
| 65 | SC2 — upcoming bookings section visible on dashboard | SAFE | PASS |
| 66 | SC3 — availability toggle switch visible | WRITE | PASS |
| 67 | SC4 — booking items clickable and expandable | SAFE | PASS |
| 68 | SC5 — bookings page loads with heading and filters | SAFE | PASS |
| 69 | SC6 — bookings list or no-bookings message displays | SAFE | PASS |
| 70 | SC7 — export and pagination controls visible | SAFE | PASS |
| 71 | SC8 — booking row detail modal opens on click | SAFE | PASS |
| 72 | SC9 — toggle availability switch on dashboard | WRITE | PASS |
| 73 | SC10 — search bookings by keyword on bookings page | SAFE | PASS |
| 74 | SC11 — filter bookings by type | SAFE | PASS |
| 75 | SC12 — navigate between dashboard and bookings pages | SAFE | PASS |
| 76 | SC13 — expand booking details and view information | SAFE | PASS |
| 77 | SC14 — scroll through dashboard calendar | SAFE | PASS |
| 78 | SC15 — multi-step flow: dashboard to bookings to search | SAFE | PASS |
| 79 | SC16 — reschedule booking from details modal | SAFE | PASS |
| 80 | SC17 — delete/cancel booking from details | WRITE | PASS |
| 81 | SC18 — apply date range filter on bookings | SAFE | PASS |
| 82 | SC19 — apply status filter on bookings page | SAFE | PASS |
| 83 | SC20 — clear all filters on bookings page | SAFE | PASS |
| 84 | SC21 — navigate pagination on bookings page | SAFE | PASS |
| 85 | SC22 — export bookings data | SAFE | PASS |
| 86 | SC23 — open meeting link from booking details | SAFE | PASS |
| 87 | SC24 — send reminder from booking details | SAFE | PASS |
| 88 | SC25 — navigate event types tab on dashboard | SAFE | PASS |
| 89 | SC26 — create new event/booking from dashboard | WRITE | FAIL |
| 90 | SC27 — navigate availability settings tab | SAFE | SKIP |
| 91 | SC28 — copy meeting link to clipboard | SAFE | SKIP |
| 92 | SC29 — view and interact with attendees list | SAFE | SKIP |
| 93 | SC30 — sort bookings by column header | SAFE | SKIP |

## 18 — 18-knowledge (`tests/18-knowledge.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | K0 — page loads with heading and all source tabs | SAFE | PASS |
| 2 | K1 — URL tab shows input and import button | SAFE | PASS |
| 3 | K2 — import ZZTEST URL | SAFE | FAIL |
| 4 | K3 — expand URL Imports section and verify entry, toggle, view content | WRITE | SKIP |
| 5 | K4 — Text tab shows textarea and add text button | SAFE | SKIP |
| 6 | K5 — add ZZTEST text entry | SAFE | SKIP |
| 7 | K6 — expand Text Imports section and verify entry, toggle, view content | WRITE | SKIP |
| 8 | K7 — FAQ tab shows question and answer inputs | SAFE | SKIP |
| 9 | K8 — add ZZTEST FAQ entry | SAFE | SKIP |
| 10 | K9 — expand FAQs section and verify entry | SAFE | SKIP |
| 11 | K10 — File tab shows upload dropzone | SAFE | SKIP |
| 12 | K11 — Central Docs tab with section, Sync All, and toggles | WRITE | SKIP |
| 13 | K12 — Video tab shows YouTube input and upload dropzone | SAFE | SKIP |
| 14 | K13 — Memories Import tab shows copy prompt and paste workflow | SAFE | SKIP |
| 15 | K14 — Memories Create tab shows textarea and add memory button | WRITE | SKIP |
| 16 | K15 — create ZZTEST memory via Create tab | WRITE | SKIP |
| 17 | K16 — expand Memories section and verify ZZTEST entry | SAFE | SKIP |
| 18 | K17 — Tickets tab shows Go to Tickets button and section | SAFE | SKIP |
| 19 | K18 — Notion tab shows integration options and section | SAFE | SKIP |
| 20 | K19 — search filters knowledge base articles | SAFE | SKIP |
| 21 | K20 — Suggestions button opens suggestions panel | SAFE | SKIP |
| 22 | K21 — delete ZZTEST URL imports | WRITE | SKIP |
| 23 | K22 — delete ZZTEST text imports | WRITE | SKIP |
| 24 | K23 — delete ZZTEST FAQ entries | WRITE | SKIP |
| 25 | K24 — delete ZZTEST memory entries | WRITE | SKIP |
| 26 | K0 — page loads with heading and all source tabs | SAFE | PASS |
| 27 | K1 — URL tab shows input and import button | SAFE | PASS |
| 28 | K2 — import ZZTEST URL | SAFE | FAIL |
| 29 | K3 — expand URL Imports section and verify entry, toggle, view content | WRITE | SKIP |
| 30 | K4 — Text tab shows textarea and add text button | SAFE | SKIP |
| 31 | K5 — add ZZTEST text entry | SAFE | SKIP |
| 32 | K6 — expand Text Imports section and verify entry, toggle, view content | WRITE | SKIP |
| 33 | K7 — FAQ tab shows question and answer inputs | SAFE | SKIP |
| 34 | K8 — add ZZTEST FAQ entry | SAFE | SKIP |
| 35 | K9 — expand FAQs section and verify entry | SAFE | SKIP |
| 36 | K10 — File tab shows upload dropzone | SAFE | SKIP |
| 37 | K11 — Central Docs tab with section, Sync All, and toggles | WRITE | SKIP |
| 38 | K12 — Video tab shows YouTube input and upload dropzone | SAFE | SKIP |
| 39 | K13 — Memories Import tab shows copy prompt and paste workflow | SAFE | SKIP |
| 40 | K14 — Memories Create tab shows textarea and add memory button | WRITE | SKIP |
| 41 | K15 — create ZZTEST memory via Create tab | WRITE | SKIP |
| 42 | K16 — expand Memories section and verify ZZTEST entry | SAFE | SKIP |
| 43 | K17 — Tickets tab shows Go to Tickets button and section | SAFE | SKIP |
| 44 | K18 — Notion tab shows integration options and section | SAFE | SKIP |
| 45 | K19 — search filters knowledge base articles | SAFE | SKIP |
| 46 | K20 — Suggestions button opens suggestions panel | SAFE | SKIP |
| 47 | K21 — delete ZZTEST URL imports | WRITE | SKIP |
| 48 | K22 — delete ZZTEST text imports | WRITE | SKIP |
| 49 | K23 — delete ZZTEST FAQ entries | WRITE | SKIP |
| 50 | K24 — delete ZZTEST memory entries | WRITE | SKIP |
| 51 | K0 — page loads with heading and all source tabs | SAFE | PASS |
| 52 | K1 — URL tab shows input and import button | SAFE | PASS |
| 53 | K2 — import ZZTEST URL | SAFE | FAIL |
| 54 | K3 — expand URL Imports section and verify entry, toggle, view content | WRITE | SKIP |
| 55 | K4 — Text tab shows textarea and add text button | SAFE | SKIP |
| 56 | K5 — add ZZTEST text entry | SAFE | SKIP |
| 57 | K6 — expand Text Imports section and verify entry, toggle, view content | WRITE | SKIP |
| 58 | K7 — FAQ tab shows question and answer inputs | SAFE | SKIP |
| 59 | K8 — add ZZTEST FAQ entry | SAFE | SKIP |
| 60 | K9 — expand FAQs section and verify entry | SAFE | SKIP |
| 61 | K10 — File tab shows upload dropzone | SAFE | SKIP |
| 62 | K11 — Central Docs tab with section, Sync All, and toggles | WRITE | SKIP |
| 63 | K12 — Video tab shows YouTube input and upload dropzone | SAFE | SKIP |
| 64 | K13 — Memories Import tab shows copy prompt and paste workflow | SAFE | SKIP |
| 65 | K14 — Memories Create tab shows textarea and add memory button | WRITE | SKIP |
| 66 | K15 — create ZZTEST memory via Create tab | WRITE | SKIP |
| 67 | K16 — expand Memories section and verify ZZTEST entry | SAFE | SKIP |
| 68 | K17 — Tickets tab shows Go to Tickets button and section | SAFE | SKIP |
| 69 | K18 — Notion tab shows integration options and section | SAFE | SKIP |
| 70 | K19 — search filters knowledge base articles | SAFE | SKIP |
| 71 | K20 — Suggestions button opens suggestions panel | SAFE | SKIP |
| 72 | K21 — delete ZZTEST URL imports | WRITE | SKIP |
| 73 | K22 — delete ZZTEST text imports | WRITE | SKIP |
| 74 | K23 — delete ZZTEST FAQ entries | WRITE | SKIP |
| 75 | K24 — delete ZZTEST memory entries | WRITE | SKIP |

## 19 — 19-team (`tests/19-team.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | T0 — page loads with heading, search, invite button, and member list | SAFE | PASS |
| 2 | T1 — search existing member dynamically, then gibberish returns zero | SAFE | PASS |
| 3 | T2 — change role of first non-YOU member (toggle) | WRITE | FAIL |
| 4 | T3 — undo role change back to original | SAFE | SKIP |
| 5 | T4 — invite modal shows email, role, and send button | SAFE | SKIP |
| 6 | T5 — send invite for zztest user | SAFE | SKIP |
| 7 | T6 — pending section shows zztest invited user | SAFE | SKIP |
| 8 | T7 — revoke zztest invitation via role dropdown | SAFE | SKIP |
| 9 | T0 — page loads with heading, search, invite button, and member list | SAFE | PASS |
| 10 | T1 — search existing member dynamically, then gibberish returns zero | SAFE | PASS |
| 11 | T2 — change role of first non-YOU member (toggle) | WRITE | FAIL |
| 12 | T3 — undo role change back to original | SAFE | SKIP |
| 13 | T4 — invite modal shows email, role, and send button | SAFE | SKIP |
| 14 | T5 — send invite for zztest user | SAFE | SKIP |
| 15 | T6 — pending section shows zztest invited user | SAFE | SKIP |
| 16 | T7 — revoke zztest invitation via role dropdown | SAFE | SKIP |
| 17 | T0 — page loads with heading, search, invite button, and member list | SAFE | PASS |
| 18 | T1 — search existing member dynamically, then gibberish returns zero | SAFE | PASS |
| 19 | T2 — change role of first non-YOU member (toggle) | WRITE | FAIL |
| 20 | T3 — undo role change back to original | SAFE | SKIP |
| 21 | T4 — invite modal shows email, role, and send button | SAFE | SKIP |
| 22 | T5 — send invite for zztest user | SAFE | SKIP |
| 23 | T6 — pending section shows zztest invited user | SAFE | SKIP |
| 24 | T7 — revoke zztest invitation via role dropdown | SAFE | SKIP |

## debug — debug-cal-explore (`tests/debug-cal-explore.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | explore calendar page — dump all elements | SAFE | FAIL |
| 2 | explore calendar page — dump all elements | SAFE | FAIL |
| 3 | explore calendar page — dump all elements | SAFE | FAIL |

---

## Summary

| Spec file | Tests | SAFE | LLM | WRITE |
|-----------|-------|------|-----|-------|
| 01-new-chat | 54 | 36 | 9 | 9 |
| 02-saved-prompts | 10 | 6 | 0 | 4 |
| 03-history | 14 | 8 | 0 | 6 |
| 04-connect | 6 | 6 | 0 | 0 |
| 05-automations | 7 | 5 | 0 | 2 |
| 06-customize | 42 | 27 | 0 | 15 |
| 07-your-day | 63 | 60 | 3 | 0 |
| 08-calendar | 39 | 39 | 0 | 0 |
| 09-inbox | 33 | 30 | 0 | 3 |
| 10-mail-actions | 36 | 27 | 0 | 9 |
| 11-scheduling | 1 | 1 | 0 | 0 |
| 12-tasks | 48 | 42 | 0 | 6 |
| 13-shared | 24 | 24 | 0 | 0 |
| 14-inbox-assistant | 132 | 96 | 3 | 33 |
| 15-daily-briefing | 27 | 24 | 0 | 3 |
| 16-meeting-hub | 30 | 28 | 0 | 2 |
| 17-scheduling | 93 | 81 | 0 | 12 |
| 18-knowledge | 75 | 48 | 0 | 27 |
| 19-team | 24 | 21 | 0 | 3 |
| debug-cal-explore | 3 | 3 | 0 | 0 |
| **Total** | **761** | **612** | **15** | **134** |

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
