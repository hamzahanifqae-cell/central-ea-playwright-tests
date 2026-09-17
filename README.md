# Central EA - Playwright Test Automation Suite

Professional end-to-end test automation for Central EA application using Playwright.

---

## 📊 Test Suite Overview

- **Total Test Suites:** 20
- **Total Test Cases:** 291
- **Active Tests:** 233 (58 skipped)
- **Test Coverage:** ~95% of UI features
- **Execution Time:** ~59 minutes (full suite)
- **Pass Rate:** ~95%

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/hamzahanifqae-cell/central-ea-playwright-tests.git
cd central-ea-playwright-tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Setup Authentication

```bash
# Create .env file (already exists)
# Update with your credentials:
TRY_CENTRAL_EMAIL=your_email@example.com
TRY_CENTRAL_PASSWORD=your_password

# Authenticate and save session
npm run auth
```

This creates `.auth/user.json` which stores your session for all tests.

---

## 🧪 Running Tests

### Local Execution

```bash
# Run all tests
npm test

# Run with UI (watch mode)
npx playwright test --ui

# Run specific test file
npx playwright test tests/01-new-chat.spec.js

# Run tests matching pattern
npx playwright test -g "should send message"

# Run safe tests only
npm run test:safe

# Headless mode (CI/CD style)
npm run test:headless
```

### View Test Reports

```bash
# Open HTML report (after tests complete)
npm run report
```

---

## 📁 Project Structure

```
.
├── tests/                      # Test files
│   ├── 01-new-chat.spec.js
│   ├── 02-saved-prompts.spec.js
│   ├── ...
│   └── 20-settings.spec.js
├── pages/                      # Page Object Model
│   ├── AskCentralPage.js       # Main page object
│   ├── DailyBriefingPage.js
│   ├── InboxAssistantPage.js
│   └── ...
├── reporters/                  # Custom reporters
│   ├── test-summary.js         # Unique test count reporter
│   └── update-test-cases.js
├── .auth/                      # Authentication storage
│   └── user.json              # Session file (gitignored)
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI/CD workflow
├── auth.js                     # Authentication script
├── playwright.config.js        # Playwright configuration
├── .env                        # Environment variables
├── package.json
└── README.md
```

---

## 🏗️ Architecture

### Page Object Model (POM)

All UI interactions are encapsulated in page objects for maintainability:

```javascript
// pages/AskCentralPage.js
class AskCentralPage {
  constructor(page) { this.page = page; }
  
  get composer() { return this.page.locator('textarea[data-slot="textarea"]'); }
  
  async send(text) {
    await this.type(text);
    await this.sendButton.click();
  }
}
```

**Benefits:**
- ✅ Centralized selectors
- ✅ Reusable methods
- ✅ Easy to maintain
- ✅ Self-documenting code

---

## ⚡ Key Testing Practices

### 1. Proper Waits (NOT Hardcoded Waits)

#### ❌ BAD - Hardcoded Wait
```javascript
await this.page.waitForTimeout(2500); // Slow and unreliable!
```

**Problems:**
- Adds unnecessary delay to every test
- Slows down entire suite execution
- Doesn't actually verify anything
- Tests are fragile

**Impact:** With 291 tests × 2.5 sec = ~12+ minutes wasted!

---

#### ✅ GOOD - Smart Waits

**Option 1: Wait for Page Load**
```javascript
// Wait for navigation to complete
await this.page.waitForLoadState('domcontentloaded');
await this.page.waitForLoadState('networkidle');
```

**Option 2: Wait for Element**
```javascript
// Wait for specific element visibility
await this.composer.waitFor({ state: 'visible', timeout: 10_000 });
```

**Option 3: Wait for Function**
```javascript
// Wait for custom condition
await this.page.waitForFunction(() => {
  const btn = document.querySelector('[data-action="send"]');
  return btn && !btn.disabled;
}, { timeout: 15_000 });
```

**Option 4: Wait for Navigation**
```javascript
// Wait for URL change
await this.page.waitForURL('**/app/ea/**', { timeout: 20_000 });
```

---

### Benefits of Proper Waits

| Metric | Hardcoded Wait | Smart Wait |
|--------|---|---|
| **Speed** | 2.5 sec always | Variable (fast) |
| **Reliability** | Low | High |
| **Suite Time** | ~59 min | ~35-40 min |
| **Maintainability** | Poor | Excellent |
| **Error Context** | None | Clear |

**Real Impact:** Removing hardcoded waits = **20-30% faster tests!** 🚀

---

## 📝 Error Messages - Better Context

### ❌ BAD - No Context
```javascript
await expect(element).toBeVisible();
// Failure message: "Element not found" (Generic, unhelpful)
```

### ✅ GOOD - With Context
```javascript
await expect(
  element, 
  `Email compose button should be visible on Inbox page. 
   Selector: textarea[data-slot="textarea"]. 
   Last known URL: ${this.page.url()}`
).toBeVisible();
```

**Better yet:**
```javascript
const composer = this.page.locator('textarea[data-slot="textarea"]');
await expect(
  composer,
  'Composer should be visible after navigation to Inbox'
).toBeVisible({ timeout: 10_000 });
```

---

### Benefits of Better Error Messages

| Aspect | Without Context | With Context |
|--------|---|---|
| **Debug Time** | 30 min to find issue | 2 min |
| **Root Cause** | Guessing | Clear |
| **Maintainability** | Hard | Easy |
| **CI/CD Debugging** | Very hard | Straightforward |

---

## 🔧 Improvement Roadmap

### 🔴 Priority 1 (This Week)
- [ ] Replace all `waitForTimeout()` with smart waits
- [ ] Add descriptive error messages to assertions
- [ ] Complete empty page objects

### 🟡 Priority 2 (Next Week)
- [ ] Add test tags (@smoke, @regression)
- [ ] Implement test data fixtures
- [ ] Add global setup/teardown

### 🟢 Priority 3 (Future)
- [ ] Add API testing layer
- [ ] Multi-browser support
- [ ] Performance monitoring

---

## 🔄 CI/CD Pipeline

### Automated Testing on GitHub Actions

Tests automatically run on:
- ✅ Every push to `main`
- ✅ Every pull request
- ✅ Manual trigger via `workflow_dispatch`

### View Results

```
GitHub → Actions → Playwright Regression
  ├── Logs (detailed execution)
  ├── playwright-report (HTML report)
  └── playwright-test-results (failure screenshots)
```

---

## 📊 Test Coverage

### By Feature

| Feature | Tests | Coverage |
|---------|-------|----------|
| Chat & Composer | 18 | ✅ Complete |
| Email (Inbox) | 11 | ✅ Complete |
| Calendar | 13 | ✅ Complete |
| Tasks | 16 | ✅ Complete |
| Inbox Assistant | 44 | ✅ Complete |
| Daily Briefing | 27 | ✅ Complete |
| Team Features | 8 | ✅ Complete |
| Knowledge Base | 25 | ✅ Complete |
| Advanced Scheduling | 31 | ✅ Complete |
| **Total** | **291** | **✅ 95%** |

---

## 🐛 Debugging Tests

### Enable Headed Mode
```bash
node auth.js --headed        # See browser while authenticating
npx playwright test --headed # Run tests with visible browser
```

### Debug Single Test
```bash
npx playwright test tests/01-new-chat.spec.js --debug
```

### View Test Trace
```bash
# After test failure, check trace.zip in test-results/
npx playwright show-trace test-results/trace.zip
```

---

## 📚 Documentation

- **[QA Automation Audit](./QA-AUTOMATION-AUDIT.md)** - Comprehensive review
- **[Skipped Tests](./SKIPPED-TESTS.md)** - List of skipped tests and reasons
- **[Playwright Docs](https://playwright.dev/)** - Official documentation

---

## 🤝 Contributing

### Before Committing

1. **Run tests locally**
   ```bash
   npm test
   ```

2. **Check auth is fresh**
   ```bash
   npm run auth
   ```

3. **Verify no hardcoded waits**
   ```bash
   grep -r "waitForTimeout" tests/
   ```

4. **Add descriptive error messages**
   ```javascript
   await expect(element, 'Clear description of what failed').toBeVisible();
   ```

---

## 📋 Skipped Tests

58 tests are intentionally skipped. See [SKIPPED-TESTS.md](./SKIPPED-TESTS.md) for:
- Reasons for each skip
- How to re-enable them
- Known issues and blockers

---

## ⚙️ Configuration

### Timeout Settings (playwright.config.js)

```javascript
timeout: 90_000,              // 90 sec per test
expect: { timeout: 15_000 },  // 15 sec for assertions
actionTimeout: 20_000         // 20 sec for actions
```

### Retry Strategy

```javascript
retries: 2  // Flaky tests retry up to 2 times
```

---

## 🆘 Troubleshooting

### Issue: "Session expired"
```
Solution: npm run auth
```

### Issue: Tests timing out
```
Solution: Check waitForTimeout() usage - replace with smart waits
```

### Issue: Flaky tests
```
Solution: Add proper waits, improve error messages, check selectors
```

### Issue: "Element not found"
```
Solution: Check selector in DevTools, verify page load is complete
```

---

## 📊 Performance Tips

1. **Remove hardcoded waits** → 20-30% faster
2. **Use smart waits** → Reliable and fast
3. **Parallel execution** → Run multiple browsers (coming soon)
4. **Test tagging** → Run only needed tests (coming soon)

---

## 📞 Support

For issues, questions, or suggestions:
1. Check [SKIPPED-TESTS.md](./SKIPPED-TESTS.md)
2. Check [QA-AUTOMATION-AUDIT.md](./QA-AUTOMATION-AUDIT.md)
3. Review [Playwright docs](https://playwright.dev/)

---

## 📈 Metrics

- **Current:** 6.9/10 overall score
- **Target:** 9+/10 (enterprise grade)
- **Time to Target:** 2-3 weeks
- **Key Focus:** Remove hardcoded waits, improve error messages

---

## ✨ Next Steps

1. **Remove hardcoded waits** - Will make tests 20-30% faster
2. **Add error context** - Makes debugging 10x easier  
3. **Complete page objects** - Improve maintainability
4. **Add test tags** - Better test organization

---

**Last Updated:** 2026-09-17  
**Status:** ✅ Production Ready (with improvements planned)