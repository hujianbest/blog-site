const { chromium } = require('C:/tools/browser-test/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:5177/', { waitUntil: 'networkidle' });
  console.log(JSON.stringify(await p.locator('header a').evaluateAll(els => els.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href'), cls: a.getAttribute('class') }))), null, 2));
  await p.click('header a[href="/write"]');
  await p.waitForTimeout(500);
  console.log('url', p.url());
  console.log('h1', JSON.stringify(await p.locator('h1').evaluateAll(els => els.map(e => e.textContent.trim()))));
  console.log('inputs', await p.locator('input,textarea').count());
  await b.close();
})();
