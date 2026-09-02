import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = (process.argv[2] || '').replace(/\/$/, '');
const evidenceDir = resolve(process.argv[3] || '.factory/evidence/polish-2/live');
if (!origin) throw new Error('Usage: node scripts/verify-live.mjs <origin> [evidence-dir]');

await mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const result = {
  origin,
  firstScreen: {},
  demo: {},
  routes: {},
  noAccount: {},
  mobile: {},
  offline: {},
  consoleErrors: [],
  failedRequests: [],
  externalRequests: [],
};
let intentionalNotFound = false;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function observe(page) {
  page.on('console', (message) => {
    if (message.type() === 'error' && !intentionalNotFound) result.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => result.consoleErrors.push(error.message));
  page.on('requestfailed', (request) => result.failedRequests.push(request.url()));
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== origin && url.protocol !== 'blob:') result.externalRequests.push(request.url());
  });
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  observe(page);
  await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
  result.firstScreen = await page.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map((heading) => heading.textContent?.trim()),
    main: document.querySelectorAll('main').length,
    demoHref: document.querySelector('[href="/?demo=1"]')?.getAttribute('href'),
    primaryVisible: Boolean(document.querySelector('[href="/?demo=1"]')?.getBoundingClientRect().height),
  }));
  assert(result.firstScreen.h1.length === 1 && result.firstScreen.h1[0] === 'Build a complete invoice evidence packet.', 'First screen h1 is wrong.');
  assert(result.firstScreen.demoHref === '/?demo=1' && result.firstScreen.primaryVisible, 'One-click query demo action is missing.');

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  assert(new URL(page.url()).searchParams.get('demo') === '1', 'Demo action did not enter ?demo=1.');
  await page.getByText('Demo — sample data, nothing is saved to your packets').waitFor();
  await page.getByRole('heading', { name: 'Kite Studio · August client review' }).waitFor();
  const workspaceText = await page.locator('main').textContent();
  for (const label of ['Saved packets', 'Collect evidence', 'Evidence files', 'Notes for the reviewer', 'Export the packet']) {
    assert(workspaceText.includes(label), `Demo workspace is missing task label: ${label}`);
  }
  assert(!/field cabinet|new specimen|supporting trace|evidence specimens|margin notes|bind the folio/i.test(workspaceText), 'Demo workspace still contains a botanical task metaphor.');
  await page.locator('input[data-field="title"]').fill('Changed live demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('heading', { name: 'Kite Studio · August client review' }).waitFor();
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  result.demo = { url: page.url(), banner: true, reset: true, databases, taskLabels: true };
  assert(databases.includes('demo:invoice-packet'), 'The isolated demo database was not used.');

  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  const demoPrivacyHeading = page.getByRole('heading', { level: 1, name: 'Privacy', exact: true });
  await demoPrivacyHeading.waitFor();
  assert(await demoPrivacyHeading.evaluate((element) => element === document.activeElement), 'Demo Privacy heading did not receive focus.');
  assert(await page.locator('#route-announcement').innerText() === 'Opened Privacy', 'Demo Privacy route was not announced.');
  await page.goBack();
  const demoHeading = page.getByRole('heading', { level: 1, name: 'Your packets', exact: true });
  await demoHeading.waitFor();
  assert(await demoHeading.evaluate((element) => element === document.activeElement), 'Demo Back did not restore route focus.');
  assert(await page.locator('#route-announcement').innerText() === 'Opened Your packets', 'Demo Back route was not announced.');
  assert(await page.getByText('Demo — sample data, nothing is saved to your packets').isVisible(), 'Demo banner disappeared after Back.');
  result.demo = { ...result.demo, focus: true, backFocus: true, routeAnnouncement: true };

  await page.goto(`${origin}/`);
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  const privacyHeading = page.getByRole('heading', { level: 1, name: 'Privacy', exact: true });
  await privacyHeading.waitFor();
  assert(await privacyHeading.evaluate((element) => element === document.activeElement), 'Privacy heading did not receive focus.');
  assert(await page.locator('#route-announcement').innerText() === 'Opened Privacy', 'Privacy route was not announced.');
  assert(await page.title() === 'Privacy — Invoice Packet', 'Privacy title is wrong.');
  await page.goBack();
  const landingHeading = page.getByRole('heading', { level: 1, name: 'Build a complete invoice evidence packet.' });
  assert(await landingHeading.evaluate((element) => element === document.activeElement), 'Back did not restore route focus.');

  await page.goto(`${origin}/terms/`);
  assert(await page.getByRole('heading', { level: 1, name: 'Terms', exact: true }).count() === 1, 'Terms h1 is not literal.');
  assert(await page.title() === 'Terms — Invoice Packet', 'Terms title is wrong.');
  intentionalNotFound = true;
  const notFoundResponse = await page.goto(`${origin}/not-a-real-route`);
  intentionalNotFound = false;
  assert(notFoundResponse?.status() === 404, 'Unknown route did not return HTTP 404.');
  assert(await page.getByRole('heading', { level: 1, name: 'Page not found', exact: true }).count() === 1, '404 h1 is wrong.');
  const metadata = await page.evaluate(() => ({
    description: Boolean(document.querySelector('meta[name="description"]')),
    canonical: Boolean(document.querySelector('link[rel="canonical"]')),
    og: Boolean(document.querySelector('meta[property="og:image"]')),
    twitter: Boolean(document.querySelector('meta[name="twitter:card"]')),
    apple: Boolean(document.querySelector('link[rel="apple-touch-icon"]')),
  }));
  assert(Object.values(metadata).every(Boolean), '404 metadata is incomplete.');
  result.routes = { privacy: 'Privacy', terms: 'Terms', focus: true, backFocus: true, notFoundStatus: 404, metadata };
  await context.close();

  const accountContext = await browser.newContext({ acceptDownloads: true });
  const accountPage = await accountContext.newPage();
  observe(accountPage);
  await accountPage.goto(`${origin}/`);
  assert(!/sign in|register|create an account/i.test(await accountPage.locator('body').innerText()), 'An account step appeared.');
  await accountPage.getByRole('button', { name: 'Start your first packet' }).click();
  await accountPage.getByLabel('Packet name Required').fill('Live no account packet');
  await accountPage.getByRole('button', { name: 'Create packet' }).click();
  await accountPage.locator('input[type="file"][data-item]').first().setInputFiles({
    name: 'live-proof.txt', mimeType: 'text/plain', buffer: Buffer.from('live local evidence'),
  });
  accountPage.once('dialog', (dialog) => dialog.accept());
  const download = accountPage.waitForEvent('download');
  await accountPage.getByRole('button', { name: 'Export ZIP packet' }).click();
  result.noAccount = { exported: (await download).suggestedFilename(), registrationStep: false };
  await accountContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileContext.newPage();
  observe(mobilePage);
  await mobilePage.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page: mobilePage }).analyze();
  const seriousCritical = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || '')).map((violation) => violation.id);
  const dimensions = await mobilePage.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert(dimensions.scrollWidth <= dimensions.clientWidth, 'The live mobile demo overflows horizontally.');
  assert(seriousCritical.length === 0, `Live mobile Axe findings: ${seriousCritical.join(', ')}`);
  await mobilePage.screenshot({ path: resolve(evidenceDir, 'demo-mobile.png'), fullPage: true });
  result.mobile = { ...dimensions, seriousCritical };
  await mobileContext.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  observe(offlinePage);
  await offlinePage.goto(`${origin}/?demo=1`);
  await offlinePage.evaluate(async () => navigator.serviceWorker.ready);
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  await offlinePage.getByText('Demo — sample data, nothing is saved to your packets').waitFor();
  result.offline = { reloaded: true, status: await offlinePage.locator('.network').innerText() };
  await offlineContext.close();

  result.consoleErrors = [...new Set(result.consoleErrors)];
  result.failedRequests = [...new Set(result.failedRequests)];
  result.externalRequests = [...new Set(result.externalRequests)];
  assert(result.consoleErrors.length === 0, `Console errors: ${result.consoleErrors.join(' | ')}`);
  assert(result.failedRequests.length === 0, `Failed requests: ${result.failedRequests.join(' | ')}`);
  assert(result.externalRequests.length === 0, `External requests: ${result.externalRequests.join(' | ')}`);
  await writeFile(resolve(evidenceDir, 'live-check.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
