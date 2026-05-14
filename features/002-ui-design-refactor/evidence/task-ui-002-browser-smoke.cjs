const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5176';
const outDir = path.resolve('features/002-ui-design-refactor/evidence');
const executablePath = process.env.SMOKE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  { path: '/', name: 'home', shell: true },
  { path: '/articles', name: 'articles', shell: true },
  { path: '/categories', name: 'categories', shell: true },
  { path: '/about', name: 'about', shell: true },
  { path: '/login', name: 'login', shell: false }
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
    page.on('response', res => {
      const url = res.url();
      if (url.includes('/api/')) network.push({ route: currentRoute, viewport: viewport.name, url, status: res.status() });
      if (url.includes('/api/') && res.status() >= 500) issues.push({ type: 'api-5xx', route: currentRoute, url, status: res.status() });
    });

    for (const route of routes) {
      currentRoute = route.path;
      await page.goto(baseUrl + route.path, { waitUntil: 'networkidle', timeout: 15000 });
      const appText = ((await page.locator('#app').textContent({ timeout: 5000 })) || '').trim();
      const screenshot = path.join(outDir, `task-ui-002-${route.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      const header = page.locator('header').first();
      const footer = page.locator('footer').first();
      const headerClasses = await header.count() ? (await header.getAttribute('class')) || '' : '';
      const footerClasses = await footer.count() ? (await footer.getAttribute('class')) || '' : '';
      const checks = {
        app: await page.locator('#app').count(),
        mainTarget: await page.locator('#main-content').count(),
        header: await page.locator('header').count(),
        footer: await page.locator('footer').count(),
        categoriesNav: await page.locator('header a[href="/categories"], footer a[href="/categories"]').count(),
        focusable: await page.locator('a, button, input').count(),
        headerSurface: hasClass(headerClasses, 'bg-[var(--color-bg-surface)]') && hasClass(headerClasses, 'border-[var(--color-border-default)]'),
        headerNoShadow: !headerClasses.includes('shadow'),
        footerSurface: hasClass(footerClasses, 'bg-[var(--color-bg-surface)]') && hasClass(footerClasses, 'text-[var(--color-fg-muted)]'),
        footerNoDark: !footerClasses.includes('bg-gray-900') && !footerClasses.includes('text-white')
      };
      if (!appText) issues.push({ type: 'empty-app', route: route.path, viewport: viewport.name });
      if (route.shell) {
        if (!checks.header) issues.push({ type: 'missing-header', route: route.path, viewport: viewport.name });
        if (!checks.footer) issues.push({ type: 'missing-footer', route: route.path, viewport: viewport.name });
        if (!checks.mainTarget) issues.push({ type: 'missing-main-content-target', route: route.path, viewport: viewport.name });
        if (checks.categoriesNav < 2) issues.push({ type: 'missing-categories-nav', route: route.path, viewport: viewport.name, count: checks.categoriesNav });
        if (!checks.headerSurface) issues.push({ type: 'header-token-mismatch', route: route.path, viewport: viewport.name, headerClasses });
        if (!checks.headerNoShadow) issues.push({ type: 'header-shadow-drift', route: route.path, viewport: viewport.name, headerClasses });
        if (!checks.footerSurface) issues.push({ type: 'footer-token-mismatch', route: route.path, viewport: viewport.name, footerClasses });
        if (!checks.footerNoDark) issues.push({ type: 'footer-dark-drift', route: route.path, viewport: viewport.name, footerClasses });
      }

      let mobileMenu = null;
      if (viewport.name === 'mobile' && route.path === '/') {
        const toggle = page.locator('button[aria-controls="public-navigation-mobile"]').first();
        const before = await toggle.count() ? await toggle.getAttribute('aria-expanded') : null;
        if (await toggle.count()) await toggle.click();
        const after = await toggle.count() ? await toggle.getAttribute('aria-expanded') : null;
        const menuCount = await page.locator('#public-navigation-mobile').count();
        const openScreenshot = path.join(outDir, 'task-ui-002-mobile-nav-open.png');
        await page.screenshot({ path: openScreenshot, fullPage: true });
        mobileMenu = { before, after, menuCount, screenshot: openScreenshot };
        if (before !== 'false' || after !== 'true' || !menuCount) issues.push({ type: 'mobile-menu-aria-open-failed', before, after, menuCount });
      }

      results.push({ route: route.path, viewport: viewport.name, appTextLength: appText.length, checks, screenshot, mobileMenu });
    }
    await page.close();
  }
  await browser.close();
  const report = { task: 'TASK-UI-002', baseUrl, results, network, issues };
  fs.writeFileSync(path.join(outDir, 'task-ui-002-browser-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(err => { console.error(err); process.exit(1); });
