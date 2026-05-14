const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5176';
const outDir = path.resolve('features/002-ui-design-refactor/evidence/final-smoke');
fs.mkdirSync(outDir, { recursive: true });
const executablePath = process.env.SMOKE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  { path: '/', name: 'home', required: ['app','main','hero','article'] },
  { path: '/articles', name: 'articles', required: ['app','main','article'] },
  { path: '/categories', name: 'categories', required: ['app','main','categoryTree'] },
  { path: '/categories/1', name: 'category-detail', required: ['app','main','article'] },
  { path: '/tags/Vue.js', name: 'tag-detail', required: ['app','main','article'] },
  { path: '/articles/1', name: 'article-detail', required: ['app','main','articleDetail','articleContent'] },
  { path: '/about', name: 'about', required: ['app','main'] },
  { path: '/login', name: 'login', required: ['app','authPage','authCard','authSubmit'] },
  { path: '/register', name: 'register', required: ['app','authPage','authCard','authSubmit'] }
];
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const forbiddenClassFragments = ['from-blue-', 'to-purple-', 'hover:text-blue-', 'text-blue-600', 'bg-gray-900', 'text-white mt-auto'];
const issues = [];
const results = [];
const network = [];
const consoleMessages = [];
const routeUrl = (routePath) => `${baseUrl}/#${routePath}`;
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    let currentRoute = 'unknown';
    page.on('console', msg => {
      consoleMessages.push({ route: currentRoute, viewport: viewport.name, type: msg.type(), text: msg.text() });
      if (msg.type() === 'error') issues.push({ type: 'console-error', route: currentRoute, viewport: viewport.name, text: msg.text() });
    });
    page.on('pageerror', err => issues.push({ type: 'page-error', route: currentRoute, viewport: viewport.name, text: err.message }));
    page.on('response', res => {
      const url = res.url();
      if (url.includes('/api/')) {
        network.push({ route: currentRoute, viewport: viewport.name, url, status: res.status() });
        if (res.status() >= 500) issues.push({ type: 'api-5xx', route: currentRoute, viewport: viewport.name, url, status: res.status() });
      }
    });
    for (const route of routes) {
      currentRoute = route.path;
      await page.goto(routeUrl(route.path), { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(250);
      const screenshot = path.join(outDir, `${route.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      const classText = await page.locator('body').evaluate(el => Array.from(el.querySelectorAll('*')).map(node => node.getAttribute('class') || '').join(' '));
      const checks = {
        app: await page.locator('#app').count() > 0,
        main: await page.locator('#main-content').count() > 0,
        hero: await page.locator('[data-ui="home-hero"]').count() > 0,
        article: await page.locator('article').count() > 0,
        categoryTree: await page.locator('[data-ui="category-tree"]').count() > 0,
        articleDetail: await page.locator('[data-ui="article-detail"]').count() > 0,
        articleContent: await page.locator('#article-content').count() > 0,
        authPage: await page.locator('[data-ui="auth-page"]').count() > 0,
        authCard: await page.locator('[data-ui="auth-card"]').count() > 0,
        authSubmit: await page.locator('[data-ui="auth-submit"]').count() > 0,
        noLiteralEscapedNewline: !((await page.locator('#main-content, [data-ui="auth-page"]').textContent().catch(() => '')) || '').includes('\\n'),
        noForbiddenClass: !forbiddenClassFragments.some(fragment => classText.includes(fragment))
      };
      for (const name of route.required) {
        if (!checks[name]) issues.push({ type: 'missing-required-anchor', route: route.path, viewport: viewport.name, name });
      }
      if (!checks.noLiteralEscapedNewline) issues.push({ type: 'literal-escaped-newline', route: route.path, viewport: viewport.name });
      if (!checks.noForbiddenClass) issues.push({ type: 'forbidden-visual-class', route: route.path, viewport: viewport.name });
      results.push({ route: route.path, viewport: viewport.name, checks, screenshot });
    }
    await page.close();
  }
  await browser.close();
  const report = { task: 'TASK-UI-008', baseUrl, routes: routes.map(r => r.path), viewports, results, network, consoleMessages, issues };
  fs.writeFileSync(path.resolve('features/002-ui-design-refactor/evidence/ui-conformance-smoke-output.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
