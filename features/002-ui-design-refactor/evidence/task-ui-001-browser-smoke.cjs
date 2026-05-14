const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5176';
const outDir = path.resolve('features/002-ui-design-refactor/evidence');
const executablePath = process.env.SMOKE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  { path: '/', name: 'home' },
  { path: '/login', name: 'login' }
];
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const issues = [];
const results = [];
const network = [];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    let currentRoute = 'unknown';
    page.on('console', msg => { if (msg.type() === 'error') issues.push({ type: 'console-error', text: msg.text() }); });
    page.on('pageerror', err => issues.push({ type: 'page-error', text: err.message }));
    page.on('response', res => {
      const url = res.url();
      if (url.includes('/api/')) {
        network.push({ route: currentRoute, viewport: viewport.name, url, status: res.status() });
      }
      if (url.includes('/api/') && res.status() >= 500) issues.push({ type: 'api-5xx', url, status: res.status() });
      if (url.includes('/api/') && !url.startsWith(baseUrl) && !url.startsWith('http://127.0.0.1:8080') && !url.startsWith('http://localhost:8080')) {
        issues.push({ type: 'unexpected-api-host', url });
      }
    });
    for (const route of routes) {
      currentRoute = route.path;
      await page.goto(baseUrl + route.path, { waitUntil: 'networkidle', timeout: 15000 });
      const appText = ((await page.locator('#app').textContent({ timeout: 5000 })) || '').trim();
      const screenshot = path.join(outDir, `task-ui-001-${route.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      const tokenState = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        const bodyStyles = getComputedStyle(document.body);
        return {
          bgPage: styles.getPropertyValue('--color-bg-page').trim(),
          fgDefault: styles.getPropertyValue('--color-fg-default').trim(),
          primaryBg: styles.getPropertyValue('--color-primary-bg').trim(),
          onPrimary: styles.getPropertyValue('--color-on-primary').trim(),
          primaryText: styles.getPropertyValue('--color-primary-text').trim(),
          space16: styles.getPropertyValue('--space-16').trim(),
          bodyBackground: bodyStyles.backgroundColor,
          bodyColor: bodyStyles.color
        };
      });
      const anchors = {
        app: await page.locator('#app').count(),
        body: await page.locator('body').count(),
        focusable: await page.locator('a, button, input').count()
      };
      results.push({ route: route.path, viewport: viewport.name, appTextLength: appText.length, anchors, tokenState, screenshot });
      if (!appText) issues.push({ type: 'empty-app', route: route.path, viewport: viewport.name });
      for (const [token, value] of Object.entries(tokenState)) {
        if (!value) issues.push({ type: 'missing-token-or-style', token, route: route.path, viewport: viewport.name });
      }
      if (!anchors.focusable) issues.push({ type: 'missing-focusable', route: route.path, viewport: viewport.name });
    }
    await page.close();
  }
  await browser.close();
  const report = {
    task: 'TASK-UI-001',
    claimBoundary: 'Token foundation runtime availability only; route-level visual drift is deferred to TASK-UI-002 through TASK-UI-007.',
    baseUrl,
    results,
    network,
    issues
  };
  fs.writeFileSync(path.join(outDir, 'task-ui-001-browser-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
