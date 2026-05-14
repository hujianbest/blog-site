const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5176';
const outDir = path.resolve('features/002-ui-design-refactor/evidence');
const executablePath = process.env.SMOKE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  { path: '/', name: 'home' },
  { path: '/articles', name: 'articles' },
  { path: '/categories', name: 'categories' },
  { path: '/categories/1', name: 'category-detail' },
  { path: '/tags/Vue.js', name: 'tag-detail' }
];
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const issues = [];
const results = [];
const network = [];
const hasClass = (classes, value) => classes.includes(value);
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
      const screenshot = path.join(outDir, `task-ui-004-${route.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      const firstArticle = page.locator('article').first();
      const articleClass = await firstArticle.count() ? (await firstArticle.getAttribute('class')) || '' : '';
      const checks = {
        app: await page.locator('#app').count(),
        main: await page.locator('#main-content').count(),
        articleCount: await page.locator('article').count(),
        articleSurface: !articleClass || (hasClass(articleClass, 'bg-[var(--color-bg-surface)]') && hasClass(articleClass, 'border-[var(--color-border-default)]')),
        articleNoWhiteShadow: !articleClass.includes('bg-white') && !articleClass.split(/\s+/).includes('shadow'),
        categoryTree: await page.locator('[data-ui="category-tree"]').count(),
        tagCloud: await page.locator('[data-ui="tag-cloud"]').count(),
        emptyState: await page.locator('[data-ui-state="empty"]').count(),
        loadingState: await page.locator('[data-ui-state="loading"]').count()
      };
      if (!checks.app) issues.push({ type: 'missing-app', route: route.path, viewport: viewport.name });
      if (!checks.main) issues.push({ type: 'missing-main', route: route.path, viewport: viewport.name });
      if (!checks.articleSurface) issues.push({ type: 'article-surface-mismatch', route: route.path, viewport: viewport.name, articleClass });
      if (!checks.articleNoWhiteShadow) issues.push({ type: 'article-white-shadow-drift', route: route.path, viewport: viewport.name, articleClass });
      if (route.name === 'categories' && !checks.categoryTree && !checks.emptyState) issues.push({ type: 'missing-category-tree-or-empty', route: route.path, viewport: viewport.name });
      results.push({ route: route.path, viewport: viewport.name, checks, screenshot });
    }
    await page.close();
  }
  await browser.close();
  const report = { task: 'TASK-UI-004', baseUrl, results, network, issues };
  fs.writeFileSync(path.join(outDir, 'task-ui-004-browser-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
