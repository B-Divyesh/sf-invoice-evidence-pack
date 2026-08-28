import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const browser = await chromium.launch({ headless: true });
const results = [];
for (const [name, options] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  await page.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });
  const light = await new AxeBuilder({ page }).analyze();
  await page.getByRole('button', { name: 'Switch color theme' }).click();
  const dark = await new AxeBuilder({ page }).analyze();
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, title: document.title, lang: document.documentElement.lang, main: document.querySelectorAll('main').length, h1: document.querySelectorAll('h1').length }));
  if (name === 'mobile') {
    await page.screenshot({ path: '/tmp/invoice-mobile.png', fullPage: true });
    await page.getByRole('button', { name: 'Start your first packet' }).click();
    await page.getByLabel('Packet name Required').fill('Phone packet');
    await page.getByRole('button', { name: 'Create packet' }).click();
    const after = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    dimensions.after = after;
  }
  results.push({ name, dimensions, seriousCritical: { light: light.violations.filter(v => ['serious', 'critical'].includes(v.impact || '')).map(v => v.id), dark: dark.violations.filter(v => ['serious', 'critical'].includes(v.impact || '')).map(v => v.id) }, consoleErrors });
  await context.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
