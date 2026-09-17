# Skipped Tests Documentation

## Summary
- **Total Tests:** 291
- **Intentionally Skipped:** 58
- **Active Tests:** 233

---

## Skipped Tests Breakdown

### 1. **11-scheduling.spec.js** (Entire Suite - 1 test)
**Reason:** Temporarily skipped due to page/backend issue
**Status:** ⏳ Awaiting backend fix
**Action:** Re-enable when backend is fixed

```javascript
test.describe.skip('Scheduling (Email) — temporarily skipped due to page/backend issue', () => {
```

---

### 2. **01-new-chat.spec.js** (1 skip)
- **Test:** "suggestion button not visible on current view"
- **Reason:** UI element visibility issue
- **Action:** Investigate selector or timing

---

### 3. **03-history.spec.js** (2 skips)
- **Test 1:** "menu dropdown did not open after 3 attempts"
- **Test 2:** "no test conversation found to delete"
- **Reason:** Test data/UI state dependency
- **Action:** Improve test data seeding

---

### 4. **06-customize.spec.js** (2 skips)
- **Test 1:** "no install button found"
- **Test 2:** "no test rule was created"
- **Reason:** Feature not available in test env
- **Action:** Configure test environment properly

---

### 5. **08-calendar.spec.js** (3 skips)
- **Test 1:** "no calendar events found to click"
- **Test 2:** "no event popup to close"
- **Test 3:** "no exit button found"
- **Reason:** Data setup issues
- **Action:** Add calendar event seeding

---

### 6. **16-meeting-hub.spec.js** (1 skip)
- **Test:** "no recorded meeting detail links available"
- **Reason:** Feature not available in test env
- **Action:** Configure meeting recordings

---

### 7. **17-scheduling.spec.js** (2 skips)
- **Tests:** Generic skips without messages
- **Reason:** Unclear - needs investigation
- **Action:** Add skip reasons and fix

---

## Action Items

| File | Count | Priority | Action |
|------|-------|----------|--------|
| 11-scheduling.spec.js | 1 | 🔴 High | Fix backend issue |
| 17-scheduling.spec.js | 2 | 🟡 Medium | Add skip reasons + fix |
| 08-calendar.spec.js | 3 | 🟡 Medium | Setup test data |
| 06-customize.spec.js | 2 | 🟡 Medium | Configure env |
| 03-history.spec.js | 2 | 🟢 Low | Improve data seeding |
| 01-new-chat.spec.js | 1 | 🟢 Low | Fix selector |
| 16-meeting-hub.spec.js | 1 | 🟢 Low | Configure meetings |

---

## How to Re-enable Tests

1. **Find the skip:**
   ```bash
   grep -n "test.skip" tests/FILE.spec.js
   ```

2. **Remove skip or add reason:**
   ```javascript
   // Before
   test.skip()
   
   // After
   test('should work when fixed', async () => {
     // test code
   })
   ```

3. **Re-run tests:**
   ```bash
   npm test
   ```

---

## Notes
- Skipped tests are **not counted as failures**
- They help track known issues
- Always add a reason for skips (for future reference)
- Review and fix skips regularly
