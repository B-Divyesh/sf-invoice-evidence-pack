import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
  await expect(page.getByText('Gather the whole story.')).toBeVisible();

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

test('serves the app from its service worker while offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await expect(page.getByText('Gather the whole story.')).toBeVisible();
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Gather the whole story.')).toBeVisible();
  await expect(page.locator('.network')).toHaveClass(/offline/);
});

test('privacy and terms routes have semantic page titles', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Private by construction.' })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'A careful tool, not an adviser.' })).toBeVisible();
});
