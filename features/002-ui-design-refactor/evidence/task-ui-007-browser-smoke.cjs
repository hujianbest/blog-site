const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5176';
const outDir = path.resolve('features/002-ui-design-refactor/evidence');
const executablePath = process.env.SMOKE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  { path: '/login', name: 'login' },
  { path: '/register', name: 'register' }
];
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const issues = [];
const results = [];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    page.on('console', msg => { if (msg.type() === 'error') issues.push({ type: 'console-error', text: msg.text() }); });
    page.on('pageerror', err => issues.push({ type: 'page-error', text: err.message }));
    for (const route of routes) {
      await page.goto(baseUrl + route.path, { waitUntil: 'networkidle', timeout: 15000 });
      const screenshot = path.join(outDir, `task-ui-007-${route.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      const pageClass = (await page.locator('[data-ui="auth-page"]').getAttribute('class')) || '';
      const cardClass = (await page.locator('[data-ui="auth-card"]').getAttribute('class')) || '';
      const submitClass = (await page.locator('[data-ui="auth-submit"]').getAttribute('class')) || '';
      const checks = {
        app: await page.locator('#app').count(),
        authPage: pageClass.includes('bg-[var(--color-bg-page)]'),
        authCard: cardClass.includes('ui-surface'),
        submitPrimary: submitClass.includes('ui-button-primary'),
        fields: await page.locator('input').count(),
        focusable: await page.locator('a, button, input').count()
      };
      for (const [name, ok] of Object.entries(checks)) {
        if (!ok) issues.push({ type: 'auth-contract-failed', route: route.path, viewport: viewport.name, name, value: ok });
      }
      results.push({ route: route.path, viewport: viewport.name, checks, screenshot });
    }
    await page.close();
  }
  await browser.close();
  const report = { task: 'TASK-UI-007', baseUrl, results, issues };
  fs.writeFileSync(path.join(outDir, 'task-ui-007-browser-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
