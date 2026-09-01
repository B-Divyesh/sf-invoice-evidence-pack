import { expect, test, type Browser, type BrowserContext, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';

const ORIGIN = 'http://127.0.0.1:4173';

// Archive, password, and offline checks all create a fresh, owned context.
// Closing that context releases downloads, service workers, and PDF workers
// without ever closing Playwright's shared Chromium browser.
async function withIsolatedPage(
  browser: Browser,
  workflow: (page: Page, context: BrowserContext) => Promise<void>,
): Promise<void> {
  const context = await browser.newContext({ acceptDownloads: true, baseURL: ORIGIN });
  const page = await context.newPage();
  try {
    await workflow(page, context);
  } finally {
    await context.close();
  }
}

async function expectOnePageHeading(page: Page, name: string): Promise<void> {
  await expect(page.locator('h1')).toHaveCount(1);
  const accessibleHeading = page.getByRole('heading', { level: 1 });
  await expect(accessibleHeading).toHaveCount(1);
  await expect(accessibleHeading).toHaveText(name);
}

test('serves the production cache, browser, and manifest policies', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  const navigation = await page.goto('/');
  expect(navigation?.headers()['cache-control']).toContain('no-cache');

  const headers = navigation?.headers() || {};
  expect(headers['content-security-policy']).toBe(
    "default-src 'self'; base-uri 'none'; connect-src 'self' https://api.sociobot.in https://pilot-api.sociobot.in; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self'; manifest-src 'self'; object-src 'none'; script-src 'self'; style-src 'self'; worker-src 'self' blob:",
  );
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['permissions-policy']).toContain('payment=()');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['cross-origin-opener-policy']).toBe('same-origin');
  expect(headers['cross-origin-resource-policy']).toBe('same-origin');
  expect(headers['strict-transport-security']).toBe('max-age=63072000; includeSubDomains; preload');

  const scriptPath = await page.locator('script[type="module"]').getAttribute('src');
  expect(scriptPath).toMatch(/^\/_app\/[a-z0-9_.-]+-[a-zA-Z0-9_-]+\.js$/);
  const asset = await request.get(scriptPath as string);
  expect(asset.headers()['cache-control']).toBe('public, max-age=31536000, immutable');

  const serviceWorker = await request.get('/sw.js');
  expect(serviceWorker.headers()['cache-control']).toContain('no-cache');
  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.headers()['cache-control']).toContain('no-cache');
  expect(manifest.headers()['content-type']).toContain('application/manifest+json');
  expect(errors).toEqual([]);
});

test('builds and persists a packet with hashed evidence', async ({ browser }) => {
  await withIsolatedPage(browser, async (page) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Invoice Packet/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'Build a complete invoice evidence packet.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toHaveAttribute('href', '/?demo=1');

  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name Required').fill('Acme August evidence');
  await page.getByLabel('Invoice number').fill('INV-042');
  await page.getByLabel('Client or counterparty').fill('Acme & Co');
  await page.getByLabel('Jurisdiction or review context').fill('India · GST review');
  await page.getByLabel('Currency').fill('usd');
  await page.getByRole('button', { name: 'Create packet' }).click();

  await expect(page.getByRole('heading', { name: 'Acme August evidence' })).toBeVisible();
  await expect(page.getByText('0 of 4 required items collected')).toBeVisible();
  const firstFile = page.locator('input[type="file"][data-item]').first();
  await firstFile.setInputFiles({ name: 'invoice-042.txt', mimeType: 'text/plain', buffer: Buffer.from('invoice evidence') });
  await expect(page.getByText('Evidence stored locally and fingerprinted.')).toBeVisible();
  await expect(page.getByText('invoice-042.txt')).toBeVisible();
  await expect(page.getByText('1 of 4 required items collected')).toBeVisible();

  await page.reload();
  await expect(page.getByText('invoice-042.txt')).toBeVisible();
  await expect(page.getByText(/SHA-256/).first()).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export ZIP packet' }).click();
  await expect((await download).suggestedFilename()).toBe('Acme-August-evidence.zip');
  expect(errors).toEqual([]);
  });
});

test('renders exactly one h1 on every route and stable workspace state', async ({ page }) => {
  await page.goto('/');
  await expectOnePageHeading(page, 'Build a complete invoice evidence packet.');

  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await expectOnePageHeading(page, 'Build a complete invoice evidence packet.');
  await page.getByLabel('Packet name Required').fill('Heading regression packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Heading regression packet' })).toBeVisible();
  await expectOnePageHeading(page, 'Your packets');

  await page.goto('/demo/');
  await expect(page.getByRole('heading', { level: 2, name: 'Kite Studio · August client review' })).toBeVisible();
  await expectOnePageHeading(page, 'Your packets');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expectOnePageHeading(page, 'Your packets');

  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 2, name: 'Kite Studio · August client review' })).toBeVisible();
  await expectOnePageHeading(page, 'Your packets');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expectOnePageHeading(page, 'Your packets');

  await page.goto('/privacy/');
  await expectOnePageHeading(page, 'Privacy');
  await page.goto('/terms/');
  await expectOnePageHeading(page, 'Terms');
  await page.goto('/404.html');
  await expectOnePageHeading(page, 'Page not found');
});

test('renders exactly one h1 while local storage is loading', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', {
      configurable: true,
      value: { open: () => ({}) },
    });
  });
  await page.goto('/');
  await expect(page.getByText('Opening your saved packets…')).toBeVisible();
  await expectOnePageHeading(page, 'Invoice Packet');
});

test('renders exactly one h1 when local storage cannot open', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', {
      configurable: true,
      value: { open: () => { throw new Error('Test storage failure.'); } },
    });
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2, name: 'Your saved packets could not open.' })).toBeVisible();
  await expectOnePageHeading(page, 'Invoice Packet');
});

test('has no serious accessibility violations in empty and editor states', async ({ page }) => {
  await page.goto('/');
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  await page.getByRole('button', { name: 'Switch color theme' }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  await page.getByRole('button', { name: 'Switch color theme' }).click();

  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name Required').fill('Accessibility packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('@claim:duplicate-zip exports distinct files that share a source filename', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name Required').fill('Duplicate filename packet');
  await page.getByRole('button', { name: 'Create packet' }).click();

  const inputs = page.locator('input[type="file"][data-item]');
  await inputs.nth(0).setInputFiles({ name: 'proof.pdf', mimeType: 'application/pdf', buffer: Buffer.from('first distinct bytes') });
  await inputs.nth(1).setInputFiles({ name: 'proof.pdf', mimeType: 'application/pdf', buffer: Buffer.from('second distinct bytes') });
  page.once('dialog', (dialog) => dialog.accept());
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export ZIP packet' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();

  const reader = new ZipReader(new BlobReader(new Blob([new Uint8Array(await readFile(path as string))])));
  const entries = await reader.getEntries();
  expect(entries.map((entry) => entry.filename)).toEqual(expect.arrayContaining([
    'evidence/proof.pdf',
    'evidence/proof-2.pdf',
  ]));
  const manifestEntry = entries.find((entry) => entry.filename === 'manifest.json');
  const manifest = JSON.parse(await manifestEntry?.getData?.(new TextWriter()) || '{}') as { evidence?: Array<{ filename: string; archiveFilename: string }> };
  expect(manifest.evidence?.slice(0, 2).map((item) => item.filename)).toEqual(['proof.pdf', 'proof.pdf']);
  expect(manifest.evidence?.slice(0, 2).map((item) => item.archiveFilename)).toEqual(['proof.pdf', 'proof-2.pdf']);
  await reader.close();
  });
});

test('@claim:backup-import imports a backup from the fresh-device empty state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  const importButton = page.getByRole('button', { name: 'Import backup from another device' });
  await expect(importButton).toBeVisible();
  const backup = {
    format: 'invoice-packet-backup',
    version: 1,
    exportedAt: '2026-08-30T00:00:00.000Z',
    templates: [],
    packets: [{
      id: 'restored-packet', title: 'Restored client review', invoiceNumber: 'INV-RESTORED', client: 'Example Client',
      invoiceDate: '2026-08-29', jurisdiction: 'Cross-border review', currency: 'USD', templateId: 'client-review', notes: 'Restored notes.',
      items: [{ id: 'restored-item', label: 'Issued invoice', description: 'Final copy', required: true }],
      createdAt: '2026-08-29T00:00:00.000Z', updatedAt: '2026-08-30T00:00:00.000Z', history: [],
    }],
  };
  const chooserPromise = page.waitForEvent('filechooser');
  await importButton.click();
  const chooser = await chooserPromise;
  page.once('dialog', (dialog) => dialog.accept());
  await chooser.setFiles({ name: 'invoice-packet-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.getByRole('heading', { name: 'Restored client review' })).toBeVisible();
  await expect(page.getByText('Backup restored on this device.')).toBeVisible();
});

test('keeps existing data and gives a recovery step for malformed backup JSON', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name Required').fill('Packet kept after failed import');
  await page.getByRole('button', { name: 'Create packet' }).click();

  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Import backup' }).click();
  const chooser = await chooserPromise;
  page.once('dialog', (dialog) => dialog.accept());
  await chooser.setFiles({
    name: 'damaged-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{not valid'),
  });

  await expect(page.locator('.toast')).toHaveText(
    'This backup file is damaged or not valid JSON. Choose an Invoice Packet JSON backup and try again.',
  );
  await expect(page.getByText(/Expected property name or/)).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Packet kept after failed import' })).toBeVisible();
});

test('@claim:unicode-pdf keeps Devanagari and Japanese metadata extractable', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/assets/noto-sans-')) fontRequests.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name Required').fill('मुंबई 東京 packet');
  await page.getByLabel('Client or counterparty').fill('山田商事');
  await page.getByLabel('Jurisdiction or review context').fill('भारत / 日本');
  await page.getByRole('button', { name: 'Create packet' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PDF manifest' }).click();
  const path = await (await downloadPromise).path();
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const document = await getDocument({ data: new Uint8Array(await readFile(path as string)) }).promise;
  const lines: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const text = await (await document.getPage(pageNumber)).getTextContent();
    lines.push(text.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  const extracted = lines.join('\n').replace(/[\u0000-\u001F]/g, '').replace(/\s+/g, ' ');
  expect(extracted).toContain('मुंबई 東京 packet');
  expect(extracted).toContain('山田商事');
  expect(extracted).toContain('भारत / 日本');
  await document.destroy();
  expect(fontRequests).toEqual(expect.arrayContaining([
    expect.stringContaining('/assets/noto-sans-devanagari.ttf'),
    expect.stringContaining('/assets/noto-sans-jp.ttf'),
  ]));
  expect(fontRequests.some((url) => url.includes('-full.ttf'))).toBe(false);
  });
});

test('loads full local script fonts only for uncommon PDF metadata', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
    const fontRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/assets/noto-sans-')) fontRequests.push(request.url());
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Start your first packet' }).click();
    await page.getByLabel('Packet name Required').fill('大阪 client review');
    await page.getByRole('button', { name: 'Create packet' }).click();
    page.once('dialog', (dialog) => dialog.accept());
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export PDF manifest' }).click();
    const path = await (await download).path();
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const document = await getDocument({ data: new Uint8Array(await readFile(path as string)) }).promise;
    const text = await (await document.getPage(1)).getTextContent();
    expect(text.items.map((item) => ('str' in item ? item.str : '')).join(' ').replace(/\s+/g, ' ')).toContain('大阪 client review');
    await document.destroy();
    expect(fontRequests).toEqual(expect.arrayContaining([
      expect.stringContaining('/assets/noto-sans-devanagari-full.ttf'),
      expect.stringContaining('/assets/noto-sans-jp-full.ttf'),
    ]));
  });
});

test('@claim:license-restore @claim:checkout-operator-gate keeps checkout operator-gated and restores an existing license', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  await page.getByRole('button', { name: 'Restore an existing license' }).click();
  await expect(page.getByText('New license purchases are not available in this build.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open hosted checkout' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Verify and restore' })).toBeVisible();
  await page.route('**/products/invoice-evidence-pack/verify?license=existing-license', (route) => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }),
  }));
  await page.getByLabel('License token').fill('existing-license');
  await page.getByRole('button', { name: 'Verify and restore' }).click();
  await expect(page.getByRole('button', { name: 'Paid tools active' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:invoice-evidence-pack'))).toBe('existing-license');
});

test('@claim:core-no-setup creates and exports a packet without external requests', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.origin !== ORIGIN && url.protocol !== 'blob:') externalRequests.push(request.url());
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Start your first packet' }).click();
    await page.getByLabel('Packet name Required').fill('No setup packet');
    await page.getByRole('button', { name: 'Create packet' }).click();
    await page.locator('input[type="file"][data-item]').first().setInputFiles({
      name: 'local-proof.txt', mimeType: 'text/plain', buffer: Buffer.from('fixture evidence'),
    });
    page.once('dialog', (dialog) => dialog.accept());
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export ZIP packet' }).click();
    await expect((await download).suggestedFilename()).toBe('No-setup-packet.zip');
    expect(externalRequests).toEqual([]);
  });
});

test('@claim:license-verification-minimum-data sends only the fixture license token', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  let requestUrl = '';
  let requestBody: string | null = null;
  await page.route('**/products/invoice-evidence-pack/verify?license=privacy-fixture', (route) => {
    requestUrl = route.request().url();
    requestBody = route.request().postData();
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) });
  });
  await page.goto('/?license=privacy-fixture');
  await expect.poll(() => requestUrl).toContain('license=privacy-fixture');
  const url = new URL(requestUrl);
  expect([...url.searchParams.keys()]).toEqual(['license']);
  expect(requestBody).toBeNull();
  expect(requestUrl).not.toContain('packet');
  expect(requestUrl).not.toContain('filename');
});

test('@claim:configurable-checklists starts packets from filing, client, and payment trail lists', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  const checklist = page.getByLabel('Starting checklist');
  await expect(checklist.getByRole('option', { name: 'Cross-border filing review' })).toHaveCount(1);
  await expect(checklist.getByRole('option', { name: 'Client payment review' })).toHaveCount(1);
  await checklist.selectOption('payment-trail');
  await page.getByLabel('Packet name Required').fill('Payment trail packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByRole('heading', { name: 'Payment trail packet' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bank credit record' })).toBeVisible();
});

test('@claim:no-document-backend sends no packet, analytics, or tracking request during a normal workflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== ORIGIN && url.protocol !== 'blob:') externalRequests.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await page.getByLabel('Packet name Required').fill('Local request audit');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await page.locator('input[type="file"][data-item]').first().setInputFiles({
    name: 'local-only.txt', mimeType: 'text/plain', buffer: Buffer.from('local packet bytes'),
  });
  await expect(page.getByText('Evidence stored locally and fingerprinted.')).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test('@claim:no-account-required creates and exports without registration or sign-in', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
    await page.goto('/');
    await expect(page.getByText(/sign in|register|create an account/i)).toHaveCount(0);
    await page.getByRole('button', { name: 'Start your first packet' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel(/email|username/i)).toHaveCount(0);
    await page.getByLabel('Packet name Required').fill('No account packet');
    await page.getByRole('button', { name: 'Create packet' }).click();
    await page.locator('input[type="file"][data-item]').first().setInputFiles({
      name: 'account-free-proof.txt', mimeType: 'text/plain', buffer: Buffer.from('account-free evidence'),
    });
    page.once('dialog', (dialog) => dialog.accept());
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export ZIP packet' }).click();
    await expect((await download).suggestedFilename()).toBe('No-account-packet.zip');
    await expect(page.getByText(/sign in|register|create an account/i)).toHaveCount(0);
  });
});

test('@claim:pwa-installable ships an installable standalone manifest and controlled service worker', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  const manifest = await page.evaluate(async () => (await fetch('/manifest.webmanifest')).json());
  expect(manifest).toMatchObject({ display: 'standalone', start_url: expect.stringContaining('?v=') });
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/icons/icon-192.png', sizes: '192x192' }),
    expect.objectContaining({ src: '/icons/icon-512.png', sizes: '512x512', purpose: 'any maskable' }),
  ]));
});

test('@claim:free-exports downloads free ZIP, PDF, and JSON backup files', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start your first packet' }).click();
    await page.getByLabel('Packet name Required').fill('Free export packet');
    await page.getByRole('button', { name: 'Create packet' }).click();
    await page.locator('input[type="file"][data-item]').first().setInputFiles({
      name: 'export-proof.txt', mimeType: 'text/plain', buffer: Buffer.from('free export bytes'),
    });

    page.once('dialog', (dialog) => dialog.accept());
    const zip = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export ZIP packet' }).click();
    await expect((await zip).suggestedFilename()).toBe('Free-export-packet.zip');

    page.once('dialog', (dialog) => dialog.accept());
    const pdf = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export PDF manifest' }).click();
    await expect((await pdf).suggestedFilename()).toBe('Free-export-packet-manifest.pdf');

    const backup = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Back up all data' }).click();
    await expect((await backup).suggestedFilename()).toMatch(/^invoice-packet-backup-\d{4}-\d{2}-\d{2}\.json$/);
  });
});

test('@claim:demo-sandbox @claim:local-only opens a useful isolated demo without third-party requests', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173' && url.protocol !== 'blob:') externalRequests.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your packets')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kite Studio · August client review' })).toBeVisible();
  await expect(page.getByText('4 of 4 required items collected')).toBeVisible();
  await page.locator('input[data-field="title"]').fill('Changed demo title');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Kite Studio · August client review' })).toBeVisible();
  await expect(page.getByText('Demo reset to the original sample packet.')).toBeVisible();
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).toContain('demo:invoice-packet');
  expect(databases).toContain('invoice-packet');
  const normalPacketCount = await page.evaluate(() => new Promise<number>((resolve, reject) => {
    const open = indexedDB.open('invoice-packet');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const count = open.result.transaction('packets', 'readonly').objectStore('packets').count();
      count.onerror = () => reject(count.error);
      count.onsuccess = () => resolve(count.result);
    };
  }));
  expect(normalPacketCount).toBe(0);
  expect(externalRequests).toEqual([]);
});

test('uses task names throughout the sample workspace', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Saved packets', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Collect evidence', exact: true })).toBeVisible();
  await expect(page.getByText(/Evidence files$/, { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Notes for the reviewer', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Export the packet', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByText('New packet', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(page.locator('main')).not.toContainText(/field cabinet|new specimen|supporting trace|evidence specimens|margin notes|bind the folio/i);
});

test('@claim:aes-zip @claim:custom-templates exercises paid tools inside the demo sandbox', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
  await page.goto('/demo/');
  const inputs = page.locator('input[type="file"][data-item]');
  await inputs.nth(0).setInputFiles({ name: 'proof.pdf', mimeType: 'application/pdf', buffer: Buffer.from('encrypted first bytes') });
  await inputs.nth(1).setInputFiles({ name: 'proof.pdf', mimeType: 'application/pdf', buffer: Buffer.from('encrypted second bytes') });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Encrypted ZIP' }).click();
  await page.getByLabel('Password At least 10 characters').fill('correct horse battery');
  await page.getByLabel('Confirm password').fill('correct horse battery');
  await page.getByRole('button', { name: 'Export encrypted ZIP' }).click();
  const path = await (await downloadPromise).path();
  const archive = new Blob([new Uint8Array(await readFile(path as string))]);
  const reader = new ZipReader(new BlobReader(archive));
  const entries = await reader.getEntries();
  expect(entries.map((entry) => entry.filename)).toEqual(expect.arrayContaining(['evidence/proof.pdf', 'evidence/proof-2.pdf']));
  const manifest = entries.find((entry) => entry.filename === 'manifest.json');
  expect(manifest?.encrypted).toBe(true);
  expect(manifest?.zipCrypto).toBe(false);
  expect(manifest?.extraField?.get(0x9901)?.data[4]).toBe(3);
  expect(await manifest?.getData?.(new TextWriter(), { password: 'correct horse battery' })).toContain('invoice-evidence-manifest/v1');
  await reader.close();

  const wrongReader = new ZipReader(new BlobReader(archive));
  const wrongManifest = (await wrongReader.getEntries()).find((entry) => entry.filename === 'manifest.json');
  await expect(wrongManifest?.getData?.(new TextWriter(), { password: 'wrong password' })).rejects.toThrow();
  await wrongReader.close();

  page.once('dialog', (dialog) => dialog.accept('Monthly client review'));
  await page.getByRole('button', { name: 'Save as template' }).click();
  await expect(page.getByText('Custom template saved on this device.')).toBeVisible();
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByLabel('Starting checklist').getByRole('option', { name: 'Monthly client review · My template' })).toHaveCount(1);
  });
});

test('works at 390px without horizontal page overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.client);
  await page.getByRole('button', { name: 'Start your first packet' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Packet name Required').fill('Phone packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('keeps evidence controls focused, touch-sized, and rejects whitespace-only names', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Start your first packet' }).click();
  const packetName = page.getByLabel('Packet name Required');
  await packetName.fill('   ');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByText('Enter a packet name that contains at least one non-space character.')).toBeVisible();
  await expect(packetName).toBeFocused();
  await expect(packetName).toHaveAttribute('aria-invalid', 'true');

  await packetName.fill('Focus regression packet');
  await page.getByRole('button', { name: 'Create packet' }).click();
  await expect(page.getByRole('heading', { name: 'Focus regression packet' })).toBeVisible();
  await expect(page.locator('.collect-slot > span').first()).toHaveText('Any file · 100 MiB maximum');

  const addItem = page.getByRole('button', { name: 'Add checklist item' });
  await addItem.click();
  const itemName = page.getByLabel('Item name Required');
  await itemName.fill('   ');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.getByText('Enter an item name that contains at least one non-space character.')).toBeVisible();
  await expect(itemName).toBeFocused();
  await expect(itemName).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Close dialog' }).click();

  await addItem.focus();
  await page.keyboard.press('Tab');
  const firstFile = page.locator('input[type="file"][data-item]').first();
  await expect(firstFile).toBeFocused();
  const addEvidence = firstFile.locator('xpath=..');
  await expect(addEvidence).toHaveCSS('outline-width', '3px');

  await firstFile.setInputFiles({ name: 'focus-proof.txt', mimeType: 'text/plain', buffer: Buffer.from('focus proof') });
  const replaceInput = page.locator('input[type="file"][data-item]').first();
  await replaceInput.focus();
  await expect(replaceInput.locator('xpath=..')).toHaveCSS('outline-width', '3px');

  for (const control of await page.locator('.file-slip .mini-button, .packet-top .icon-button.danger').all()) {
    const size = await control.evaluate((element) => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  }
  for (const control of await page.locator('.check-label:visible').all()) {
    const size = await control.evaluate((element) => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  }
  const updateSize = await page.evaluate(() => {
    const note = document.createElement('div');
    note.className = 'update-note';
    note.innerHTML = '<button>Update now</button>';
    document.body.append(note);
    const rect = note.querySelector('button')?.getBoundingClientRect();
    note.remove();
    return { width: rect?.width || 0, height: rect?.height || 0 };
  });
  expect(updateSize.width).toBeGreaterThanOrEqual(44);
  expect(updateSize.height).toBeGreaterThanOrEqual(44);
});

test('keeps the shared Chromium browser alive after test-owned contexts close', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await withIsolatedPage(browser, async (page) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
  expect(browser.isConnected()).toBe(true);
  await withIsolatedPage(browser, async (page) => {
    await page.goto('/demo/');
    await expect(page.getByText('Demo — sample data, nothing is saved to your packets')).toBeVisible();
  });
  expect(browser.isConnected()).toBe(true);
});

test('@claim:offline-reload serves the app from its service worker while offline', async ({ browser }) => {
  await withIsolatedPage(browser, async (page, context) => {
    await page.goto('/');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await expect(page.getByText('Build a complete invoice evidence packet.')).toBeVisible();
    const cached = await page.evaluate(async () => {
      const keys = await caches.keys();
      const requests = await Promise.all(keys.map(async (key) => (await caches.open(key)).keys()));
      return requests.flatMap((requests) => requests.map((request) => request.url));
    });
    expect(cached.some((url) => /noto-sans|fontkit\.es/.test(url))).toBe(false);
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Build a complete invoice evidence packet.')).toBeVisible();
    await expect(page.locator('.network')).toHaveClass(/offline/);
  });
});

test('privacy and terms routes have semantic page titles', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy', exact: true })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms', exact: true })).toBeVisible();
});

test('moves focus and announces the destination for route navigation and browser back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  const privacyHeading = page.getByRole('heading', { level: 1, name: 'Privacy', exact: true });
  await expect(privacyHeading).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Opened Privacy');
  await page.goBack();
  const landingHeading = page.getByRole('heading', { level: 1, name: 'Build a complete invoice evidence packet.' });
  await expect(landingHeading).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Opened Build a complete invoice evidence packet.');
});

test('ships complete metadata for static routes and the designed 404 page', async ({ request }) => {
  for (const [path, title, canonical] of [
    ['/demo/', 'Demo — Invoice Packet', 'https://invoice-evidence-pack.sociobot.in/demo/'],
    ['/privacy/', 'Privacy — Invoice Packet', 'https://invoice-evidence-pack.sociobot.in/privacy/'],
    ['/terms/', 'Terms — Invoice Packet', 'https://invoice-evidence-pack.sociobot.in/terms/'],
  ]) {
    const html = await (await request.get(path)).text();
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toContain(`<link rel="canonical" href="${canonical}" />`);
    expect(html).toContain('meta property="og:image"');
    expect(html).toContain('name="twitter:card"');
  }
  const notFound = await readFile(resolve('public', '404.html'), 'utf8');
  expect(notFound).toContain('<title>Page not found — Invoice Packet</title>');
  expect(notFound).toContain('meta name="description"');
  expect(notFound).toContain('link rel="canonical"');
  expect(notFound).toContain('meta property="og:image"');
  expect(notFound).toContain('name="twitter:card"');
  expect(notFound).toContain('link rel="apple-touch-icon"');
  expect(notFound).toContain('<h1>Page not found</h1>');
});
