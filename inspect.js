/**
 * Har Ask Central page ka DOM dump. Naye selectors chahiye to ye chalao.
 * Run: node inspect.js   -> dom-dump/ folder
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const OUT = 'dom-dump';
const ROUTES = {
  'New Chat':    '/app/ea/askcentral/new',
  'History':     '/app/ea/askcentral/history',
  'Connect':     '/app/ea/askcentral/connect',
  'Automations': '/app/ea/askcentral/workflows',
  'Customize':   '/app/ea/askcentral/customize',
};

async function harvest(page) {
  return page.evaluate(() => {
    const q = 'button, a, input, textarea, select, [role="button"], [role="tab"], [contenteditable="true"]';
    return [...document.querySelectorAll(q)]
      .filter(el => el.getBoundingClientRect().width > 0)
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        testId: el.getAttribute('data-testid'),
        slot: el.getAttribute('data-slot'),
        name: el.getAttribute('name'),
        placeholder: el.getAttribute('placeholder'),
        href: el.getAttribute('href'),
        text: (el.innerText || '').trim().slice(0, 60),
        html: el.outerHTML.slice(0, 300),
      }));
  });
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: '.auth/user.json',
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  fs.mkdirSync(OUT, { recursive: true });

  for (const [tab, route] of Object.entries(ROUTES)) {
    const slug = tab.toLowerCase().replace(/\s+/g, '-');
    console.log(`\n=== ${tab} ===`);
    try {
      await page.goto(`https://app.trycentral.com${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(4000);

      const els = await harvest(page);
      console.log(`  ${page.url()}`);
      console.log(`  ${els.length} elements`);
      els.filter(e => e.ariaLabel || e.placeholder || e.testId)
         .slice(0, 20)
         .forEach(e => {
           const id = e.testId ? `testid=${e.testId}`
                    : e.ariaLabel ? `aria="${e.ariaLabel}"`
                    : `placeholder="${e.placeholder}"`;
           console.log(`    <${e.tag}> ${id}${e.text ? ` | "${e.text.replace(/\n/g, ' ')}"` : ''}`);
         });

      fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify({ url: page.url(), elements: els }, null, 2));
      await page.screenshot({ path: path.join(OUT, `${slug}.png`), fullPage: true });
    } catch (err) {
      console.log(`  error: ${err.message}`);
    }
  }

  console.log(`\nSab ${OUT}/ mein save`);
  await browser.close();
})();