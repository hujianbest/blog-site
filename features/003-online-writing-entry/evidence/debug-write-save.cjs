const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage();
  p.on('response', async (r) => {
    if (r.url().includes('/api/v1/articles') && r.request().method() === 'POST') {
      console.log('post status', r.status(), await r.text().catch(() => ''));
    }
  });
  p.on('console', (m) => console.log('console', m.type(), m.text()));
  await p.goto('http://127.0.0.1:5177/write', { waitUntil: 'networkidle' });
  console.log('url', p.url(), 'h1', await p.locator('h1').textContent());
  console.log('inputs', await p.locator('input,textarea').count());
  await p.fill('input[aria-label="文章标题"]', 'Direct draft');
  await p.fill('textarea', 'Direct body');
  await p.click('[data-action="save-draft"]');
  await p.waitForTimeout(1500);
  console.log('statusText', await p.locator('[data-ui-state]').textContent().catch(() => 'none'));
  await b.close();
})();
