import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';

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

test('builds and persists a packet with hashed evidence', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Invoice Packet/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'Build a complete invoice evidence packet.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toHaveAttribute('href', '/demo/');

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

test('@claim:duplicate-zip exports distinct files that share a source filename', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
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

test('@claim:unicode-pdf keeps Devanagari and Japanese metadata extractable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
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
});

test('keeps checkout fail-soft until billing is enabled', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Restore an existing license' }).click();
  await expect(page.getByText('New purchases are temporarily unavailable.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Buy the one-time/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Verify and restore' })).toBeVisible();
});

test('@claim:demo-sandbox @claim:local-only opens a useful isolated demo without third-party requests', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173' && url.protocol !== 'blob:') externalRequests.push(request.url());
  });
  await page.goto('/demo/');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your packets')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kite Studio · August client review' })).toBeVisible();
  await expect(page.getByText('4 of 4 required items collected')).toBeVisible();
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name))).toContain('demo:invoice-packet');
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name))).not.toContain('invoice-packet');
  expect(externalRequests).toEqual([]);
});

test('@claim:aes-zip @claim:custom-templates exercises paid tools inside the demo sandbox', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
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
});

test('@claim:offline-reload serves the app from its service worker while offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await expect(page.getByText('Build a complete invoice evidence packet.')).toBeVisible();
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Build a complete invoice evidence packet.')).toBeVisible();
  await expect(page.locator('.network')).toHaveClass(/offline/);
});

test('privacy and terms routes have semantic page titles', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Private by construction.' })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'A careful tool, not an adviser.' })).toBeVisible();
});
