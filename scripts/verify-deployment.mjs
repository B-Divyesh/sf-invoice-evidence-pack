import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = process.argv[2]?.replace(/\/$/, '');
if (!origin) throw new Error('Usage: npm run verify:deployment -- https://host.example');

const expectedCsp = "default-src 'self'; base-uri 'none'; connect-src 'self' https://api.sociobot.in https://pilot-api.sociobot.in; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self'; manifest-src 'self'; object-src 'none'; script-src 'self'; style-src 'self'; worker-src 'self' blob:";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function response(path) {
  const result = await fetch(`${origin}${path}`, { cache: 'no-store', redirect: 'error' });
  assert(result.ok, `${path} returned HTTP ${result.status}`);
  return result;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function assertIdentity(path, localPath) {
  const [remote, local] = await Promise.all([
    response(path).then((result) => result.arrayBuffer()).then((bytes) => Buffer.from(bytes)),
    readFile(resolve('dist', localPath)),
  ]);
  const actual = sha256(remote);
  const expected = sha256(local);
  assert(actual === expected, `${path} does not match dist/${localPath}: ${actual} != ${expected}`);
  return actual;
}

const root = await response('/');
const rootHeaders = root.headers;
assert(rootHeaders.get('cache-control')?.includes('no-cache'), 'HTML must be revalidated');
assert(rootHeaders.get('content-security-policy') === expectedCsp, 'CSP is absent or differs from the release policy');
assert(rootHeaders.get('permissions-policy')?.includes('camera=()'), 'Permissions-Policy must deny camera access');
assert(rootHeaders.get('permissions-policy')?.includes('payment=()'), 'Permissions-Policy must deny payment access');
assert(rootHeaders.get('x-frame-options') === 'DENY', 'X-Frame-Options must be DENY');
assert(rootHeaders.get('cross-origin-opener-policy') === 'same-origin', 'COOP must be same-origin');
assert(rootHeaders.get('cross-origin-resource-policy') === 'same-origin', 'CORP must be same-origin');
assert(rootHeaders.get('strict-transport-security') === 'max-age=63072000; includeSubDomains; preload', 'HSTS must meet preload duration');
const html = await root.text();
const appAssets = [...html.matchAll(/["'](\/_app\/[^"']+)["']/g)].map((match) => match[1]);
assert(appAssets.length >= 2, 'Could not identify hashed JavaScript and CSS assets');

for (const path of appAssets) {
  const asset = await response(path);
  assert(asset.headers.get('cache-control') === 'public, max-age=31536000, immutable', `${path} is not immutable`);
  await assertIdentity(path, path.slice(1));
}

const manifest = await response('/manifest.webmanifest');
assert(manifest.headers.get('content-type')?.startsWith('application/manifest+json'), 'Manifest MIME type is incorrect');
assert(manifest.headers.get('cache-control')?.includes('no-cache'), 'Manifest must be revalidated');
const serviceWorker = await response('/sw.js');
assert(serviceWorker.headers.get('cache-control')?.includes('no-cache'), 'Service worker must be revalidated');

const hashes = {
  root: await assertIdentity('/', 'index.html'),
  serviceWorker: await assertIdentity('/sw.js', 'sw.js'),
  manifest: await assertIdentity('/manifest.webmanifest', 'manifest.webmanifest'),
  privacy: await assertIdentity('/privacy/', 'privacy/index.html'),
  terms: await assertIdentity('/terms/', 'terms/index.html'),
};

console.log(JSON.stringify({ origin, policy: 'passed', identity: hashes, immutableAssets: appAssets }, null, 2));
