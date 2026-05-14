const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5176';
const outDir = path.resolve('features/002-ui-design-refactor/evidence');
const executablePath = process.env.SMOKE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const issues = [];
const results = [];
const network = [];
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    page.on('console', msg => { if (msg.type() === 'error') issues.push({ type: 'console-error', text: msg.text() }); });
    page.on('pageerror', err => issues.push({ type: 'page-error', text: err.message }));
    page.on('response', res => { const url = res.url(); if (url.includes('/api/')) network.push({ url, status: res.status(), viewport: viewport.name }); if (url.includes('/api/') && res.status() >= 500) issues.push({ type: 'api-5xx', url, status: res.status() }); });
    await page.goto(baseUrl + '/articles/1', { waitUntil: 'networkidle', timeout: 15000 });
    const screenshot = path.join(outDir, `task-ui-005-article-detail-${viewport.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const article = page.locator('[data-ui="article-detail"]');
    const articleClass = await article.count() ? (await article.getAttribute('class')) || '' : '';
    const content = page.locator('#article-content');
    const contentClass = await content.count() ? (await content.getAttribute('class')) || '' : '';
    const contentText = await content.count() ? ((await content.textContent()) || '') : '';
    const checks = {
      app: await page.locator('#app').count(),
      main: await page.locator('#main-content').count(),
      article: await article.count(),
      articleSurface: articleClass.includes('bg-[var(--color-bg-surface)]') && articleClass.includes('border-[var(--color-border-default)]'),
      content: await content.count(),
      readingWidth: contentClass.includes('ui-reading'),
      readingRhythm: contentClass.includes('text-[18px]') && contentClass.includes('leading-[1.8]'),
      noLiteralEscapedNewlines: !contentText.includes('\\n'),
      h1: await page.locator('main h1').count()
    };
    for (const [name, ok] of Object.entries(checks)) {
      if (!ok) issues.push({ type: 'article-detail-contract-failed', name, viewport: viewport.name, value: ok });
    }
    results.push({ viewport: viewport.name, checks, screenshot });
    await page.close();
  }
  await browser.close();
  const report = { task: 'TASK-UI-005', route: '/articles/1', results, network, issues };
  fs.writeFileSync(path.join(outDir, 'task-ui-005-browser-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
