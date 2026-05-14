const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:5178/#/articles/1', { waitUntil: 'networkidle' });
  console.log('url', p.url());
  console.log('h1', await p.locator('h1').evaluateAll(els => els.map(e => e.textContent.trim())));
  console.log('articleDetail', await p.locator('[data-ui="article-detail"]').count());
  console.log('articleContent', await p.locator('#article-content').count());
  console.log('text', ((await p.locator('#app').textContent()) || '').slice(0, 300));
  await b.close();
})();
