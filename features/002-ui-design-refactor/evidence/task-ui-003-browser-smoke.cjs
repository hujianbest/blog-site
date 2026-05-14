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
    await page.goto(baseUrl + '/', { waitUntil: 'networkidle', timeout: 15000 });
    const screenshot = path.join(outDir, `task-ui-003-home-${viewport.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const hero = page.locator('[data-ui="home-hero"]');
    const heroClass = await hero.getAttribute('class');
    const h1Text = (await page.locator('main h1').textContent())?.trim();
    const cta = page.locator('main a[href="/articles"]').first();
    const ctaText = (await cta.textContent())?.trim();
    const aboutCta = page.locator('main a[href="/about"]').first();
    const aboutCtaText = (await aboutCta.textContent())?.trim();
    const articleCount = await page.locator('main article').count();
    const checks = {
      app: await page.locator('#app').count(),
      main: await page.locator('#main-content').count(),
      hero: await hero.count(),
      heroTokenSurface: heroClass?.includes('bg-[var(--color-bg-accent-subtle)]') || false,
      heroNoBluePurpleGradient: !(heroClass || '').includes('from-blue-600') && !(heroClass || '').includes('to-purple-600'),
      h1Text: h1Text === '写作、工程与长期思考',
      ctaText: ctaText === '开始阅读',
      aboutCtaText: aboutCtaText === '关于作者',
      ctaPrimary: ((await cta.getAttribute('class')) || '').includes('ui-button-primary')
    };
    for (const [name, ok] of Object.entries(checks)) {
      if (!ok) issues.push({ type: 'home-contract-failed', name, viewport: viewport.name, value: ok });
    }
    results.push({ viewport: viewport.name, checks, articleCount, screenshot });
    await page.close();
  }
  await browser.close();
  const report = { task: 'TASK-UI-003', route: '/', results, network, issues };
  fs.writeFileSync(path.join(outDir, 'task-ui-003-browser-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
