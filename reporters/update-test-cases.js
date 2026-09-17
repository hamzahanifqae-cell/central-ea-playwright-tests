const fs = require('fs');
const path = require('path');

const RISK_KEYWORDS = {
  LLM: ['AI response', 'auto-sends', 'LLM', 'receive AI'],
  WRITE: ['create', 'delete', 'rename', 'toggle', 'install', 'pause', 'resume', 'three-dot menu'],
};

function classifyRisk(testTitle) {
  const lower = testTitle.toLowerCase();
  for (const keyword of RISK_KEYWORDS.LLM) {
    if (lower.includes(keyword.toLowerCase())) return 'LLM';
  }
  for (const keyword of RISK_KEYWORDS.WRITE) {
    if (lower.includes(keyword.toLowerCase())) return 'WRITE';
  }
  return 'SAFE';
}

const SPEC_NAMES = {
  '01-new-chat': 'New Chat',
  '02-saved-prompts': 'Saved Prompts',
  '03-history': 'History',
  '04-connect': 'Connect',
  '05-automations': 'Automations',
  '06-customize': 'Customize',
  '07-your-day': 'Your Day',
};

class TestCasesReporter {
  constructor() {
    this.suites = {};
    this.startTime = null;
  }

  onBegin(config, suite) {
    this.startTime = Date.now();
  }

  onTestEnd(test, result) {
    const file = path.basename(test.location.file, '.spec.js');
    if (!this.suites[file]) this.suites[file] = [];
    this.suites[file].push({
      title: test.title,
      status: result.status === 'passed' ? 'PASS' : result.status === 'skipped' ? 'SKIP' : 'FAIL',
      duration: result.duration,
      risk: classifyRisk(test.title),
    });
  }

  onEnd(result) {
    const elapsed = ((Date.now() - this.startTime) / 60000).toFixed(1);
    const allTests = Object.values(this.suites).flat();
    const passed = allTests.filter(t => t.status === 'PASS').length;
    const failed = allTests.filter(t => t.status === 'FAIL').length;
    const skipped = allTests.filter(t => t.status === 'SKIP').length;
    const total = allTests.length;

    let statusLine = `${passed} passed`;
    if (failed > 0) statusLine += `, ${failed} failed`;
    if (skipped > 0) statusLine += `, ${skipped} skipped`;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    let md = `# Central EA — Regression Test Suite\n\n`;
    md += `**Last run:** ${statusLine} — ${elapsed} minutes  \n`;
    md += `**Date:** ${dateStr} ${timeStr}  \n`;
    md += `**Runner:** Playwright + Chromium, single browser session, serial execution  \n`;
    md += `**Target:** https://app.trycentral.com\n\n---\n`;

    const specOrder = Object.keys(SPEC_NAMES);
    const sortedFiles = Object.keys(this.suites).sort((a, b) => {
      const ai = specOrder.indexOf(a);
      const bi = specOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    const summaryRows = [];

    for (const file of sortedFiles) {
      const tests = this.suites[file];
      const pageName = SPEC_NAMES[file] || file;
      const num = file.split('-')[0];

      md += `\n## ${num} — ${pageName} (\`tests/${file}.spec.js\`)\n\n`;
      md += `| # | Test | Risk | Status |\n`;
      md += `|---|------|------|--------|\n`;

      let safe = 0, llm = 0, write = 0;
      tests.forEach((t, i) => {
        md += `| ${i + 1} | ${t.title} | ${t.risk} | ${t.status} |\n`;
        if (t.risk === 'SAFE') safe++;
        else if (t.risk === 'LLM') llm++;
        else write++;
      });

      summaryRows.push({ file, pageName, total: tests.length, safe, llm, write });
    }

    md += `\n---\n\n## Summary\n\n`;
    md += `| Spec file | Tests | SAFE | LLM | WRITE |\n`;
    md += `|-----------|-------|------|-----|-------|\n`;

    let tTotal = 0, tSafe = 0, tLlm = 0, tWrite = 0;
    for (const row of summaryRows) {
      md += `| ${row.file} | ${row.total} | ${row.safe} | ${row.llm} | ${row.write} |\n`;
      tTotal += row.total;
      tSafe += row.safe;
      tLlm += row.llm;
      tWrite += row.write;
    }
    md += `| **Total** | **${tTotal}** | **${tSafe}** | **${tLlm}** | **${tWrite}** |\n`;

    md += `\n## Legend\n\n`;
    md += `- **SAFE** — read-only, no mutations, no cost\n`;
    md += `- **LLM** — sends a prompt to the AI (costs quota)\n`;
    md += `- **WRITE** — mutates account data (creates/deletes/toggles)\n`;

    md += `\n## Architecture\n\n`;
    md += `- **Single browser session** — worker-scoped fixture, no page reloads between tests\n`;
    md += `- **SPA navigation** — \`ensurePage()\` clicks sidebar links instead of full page loads\n`;
    md += `- **Serial execution** — \`workers: 1\`, tests run in file order (01→07)\n`;
    md += `- **Page Object Model** — \`pages/AskCentralPage.js\` centralises all selectors\n`;
    md += `- **Session via storageState** — \`.auth/user.json\`, no login flow in tests\n`;

    md += `\n## Hard constraints\n\n`;
    md += `- \`pressSequentially()\` for React-controlled inputs (not \`fill()\`)\n`;
    md += `- Never use \`waitForLoadState('networkidle')\` — open sockets cause timeout\n`;
    md += `- "Publish to community skills" toggle must stay OFF\n`;
    md += `- Auto-run toggle turned OFF before saving any test prompt\n`;
    md += `- NEVER click: \`aria-label='Delete automation'\`, \`aria-label='Execute automation now'\`\n`;
    md += `- \`.env\` and \`.auth/user.json\` contents never printed or committed\n`;

    const outPath = path.join(__dirname, '..', 'TEST-CASES.md');

    // Only overwrite if this run included more than 1 spec file (full/near-full run).
    // Partial runs (single file or grep filter) skip the overwrite to preserve the
    // last full-suite snapshot.
    const specFileCount = Object.keys(this.suites).length;
    if (specFileCount <= 1 && total < 20) {
      console.log(`\n✔ TEST-CASES.md NOT updated (partial run: ${total} tests from ${specFileCount} file). Run full suite to update.\n`);
      return;
    }

    fs.writeFileSync(outPath, md, 'utf-8');
    console.log(`\n✔ TEST-CASES.md updated (${total} tests, ${statusLine})\n`);
  }
}

module.exports = TestCasesReporter;
