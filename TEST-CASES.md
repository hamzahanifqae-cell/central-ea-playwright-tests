# Central EA — Regression Test Suite

**Last run:** 71 passed, 2 failed, 15 skipped — 13.7 minutes  
**Date:** 2026-09-18 15:43  
**Runner:** Playwright + Chromium, single browser session, serial execution  
**Target:** https://app.trycentral.com

---

## 14 — 14-inbox-assistant (`tests/14-inbox-assistant.spec.js`)

| # | Test | Risk | Status |
|---|------|------|--------|
| 1 | IA0 — categorization page loads with heading, tabs, and custom categories | SAFE | PASS |
| 2 | IA1 — all 6 default category toggles are visible and switchable | WRITE | PASS |
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
| 44 | IA43 — multi-step flow: navigate pages, toggle settings, verify persistence | WRITE | FAIL |
| 45 | IA0 — categorization page loads with heading, tabs, and custom categories | SAFE | PASS |
| 46 | IA1 — all 6 default category toggles are visible and switchable | WRITE | PASS |
| 47 | IA2 — each category has an Edit link and description text | SAFE | PASS |
| 48 | IA3 — Add New Category button is visible | SAFE | PASS |
| 49 | IA4 — Import from Gmail section with Scan & Suggest Labels | SAFE | PASS |
| 50 | IA5 — label color mode options are visible (Vibrant, Pastel, No color) | SAFE | PASS |
| 51 | IA6 — Classification Rules textarea visible with placeholder | SAFE | PASS |
| 52 | IA7 — Maximum Categories per Email section visible with select | SAFE | PASS |
| 53 | IA8 — Auto Archive tab loads with heading and description | SAFE | PASS |
| 54 | IA9 — Auto Archive tab shows all 6 category switches | SAFE | PASS |
| 55 | IA10 — switch between Categories and Auto Archive tabs | SAFE | PASS |
| 56 | IA11 — AI Drafts page loads with heading and all section headings | SAFE | PASS |
| 57 | IA12 — Writing Style Analysis section with Re-analyze and Delete buttons | WRITE | PASS |
| 58 | IA13 — Automatically Generate Replies switch is visible and checked | SAFE | PASS |
| 59 | IA14 — AI Response Instructions textarea visible with placeholder | LLM | PASS |
| 60 | IA15 — Signature section shows current signature with Edit button | SAFE | PASS |
| 61 | IA16 — Draft Frequency combobox shows current value | SAFE | PASS |
| 62 | IA17 — Draft Rules textarea visible with placeholder | SAFE | PASS |
| 63 | IA18 — Sender Blocklist input and Add button visible | SAFE | PASS |
| 64 | IA19 — Context Sources switches all visible (Knowledge Base, CRM, Calendar, Meeting History) | SAFE | PASS |
| 65 | IA20 — Draft Behavior switches visible (CC and BCC) | SAFE | PASS |
| 66 | IA21 — AI-assisted meeting scheduling section with switch and scheduler links | SAFE | PASS |
| 67 | IA22 — Automations settings page loads with heading | SAFE | PASS |
| 68 | IA23 — auto-create tasks switch visible and enabled | WRITE | PASS |
| 69 | IA24 — add tasks to calendar switch visible | SAFE | PASS |
| 70 | IA25 — Task Creation Frequency radio buttons all visible | SAFE | PASS |
| 71 | IA26 — AI-assisted meeting scheduling switch in Automations | SAFE | PASS |
| 72 | IA27 — Task Creation Instructions input visible with character counter | SAFE | PASS |
| 73 | IA28 — settings sidebar navigates between Categorization, AI Drafts, and Automations | SAFE | FAIL |
| 74 | IA43 — multi-step flow: navigate pages, toggle settings, verify persistence | WRITE | SKIP |
| 75 | IA29 — settings search input filters sidebar options | SAFE | SKIP |
| 76 | IA30 — toggle category switch on and verify state change | WRITE | SKIP |
| 77 | IA31 — type in Classification Rules textarea and verify input persists | SAFE | SKIP |
| 78 | IA32 — change Max Categories select and verify option change | SAFE | SKIP |
| 79 | IA33 — toggle Auto Archive switch on and verify persistence | WRITE | SKIP |
| 80 | IA34 — toggle Auto Replies switch and verify change | WRITE | SKIP |
| 81 | IA35 — type in Instructions textarea and clear | SAFE | SKIP |
| 82 | IA36 — add email to Sender Blocklist and remove | SAFE | SKIP |
| 83 | IA37 — toggle Knowledge Base Context Source switch | WRITE | SKIP |
| 84 | IA38 — toggle Draft CC switch and verify | WRITE | SKIP |
| 85 | IA39 — toggle auto-create tasks switch and restore | WRITE | SKIP |
| 86 | IA40 — select different Task Creation Frequency radio button | SAFE | SKIP |
| 87 | IA41 — type in Task Instructions input and restore | SAFE | SKIP |
| 88 | IA42 — toggle Add to Calendar switch and verify | WRITE | SKIP |

---

## Summary

| Spec file | Tests | SAFE | LLM | WRITE |
|-----------|-------|------|-----|-------|
| 14-inbox-assistant | 88 | 64 | 2 | 22 |
| **Total** | **88** | **64** | **2** | **22** |

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
