const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5176';
const outDir = path.resolve('features/002-ui-design-refactor/evidence');
const executablePath = process.env.SMOKE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  { path: '/categories', name: 'categories', expect: 'categoryTree' },
  { path: '/categories/1', name: 'category-detail', expect: 'article' },
  { path: '/tags/Vue.js', name: 'tag-detail', expect: 'article' }
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
    page.on('response', res => { const url = res.url(); if (url.includes('/api/')) network.push({ route: currentRoute, viewport: viewport.name, url, status: res.status() }); if (url.includes('/api/') && res.status() >= 500) issues.push({ type: 'api-5xx', route: currentRoute, url, status: res.status() }); });
    for (const route of routes) {
      currentRoute = route.path;
      await page.goto(baseUrl + route.path, { waitUntil: 'networkidle', timeout: 15000 });
      const screenshot = path.join(outDir, `task-ui-006-${route.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      const checks = {
        app: await page.locator('#app').count(),
        main: await page.locator('#main-content').count(),
        categoryTree: await page.locator('[data-ui="category-tree"]').count(),
        articleCount: await page.locator('article').count(),
        emptyState: await page.locator('[data-ui-state="empty"]').count(),
        errorState: await page.locator('[data-ui-state="error"]').count(),
        retryButton: await page.locator('[data-ui-state="error"] button').count()
      };
      const mainText = ((await page.locator('#main-content').textContent()) || '');
      if (!checks.app || !checks.main) issues.push({ type: 'missing-app-or-main', route: route.path, viewport: viewport.name, checks });
      if (route.expect === 'categoryTree' && !checks.categoryTree && !checks.emptyState) issues.push({ type: 'missing-category-tree-or-empty', route: route.path, viewport: viewport.name, checks });
      if (route.expect === 'article' && !checks.articleCount && !checks.emptyState) issues.push({ type: 'missing-articles-or-empty', route: route.path, viewport: viewport.name, checks });
      if (mainText.includes('\\n')) issues.push({ type: 'literal-escaped-newline', route: route.path, viewport: viewport.name });
      results.push({ route: route.path, viewport: viewport.name, checks, screenshot });
    }
    await page.close();
  }
  await browser.close();
  const report = { task: 'TASK-UI-006', baseUrl, results, network, issues };
  fs.writeFileSync(path.join(outDir, 'task-ui-006-browser-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
