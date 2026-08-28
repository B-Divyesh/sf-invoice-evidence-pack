import { defineConfig, type Plugin } from 'vite';
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function staticRoutes(): Plugin {
  return {
    name: 'static-route-fallbacks',
    async closeBundle() {
      for (const route of ['privacy', 'terms']) {
        await mkdir(resolve('dist', route), { recursive: true });
        await copyFile(resolve('dist/index.html'), resolve('dist', route, 'index.html'));
      }
    },
  };
}

async function listFiles(directory: string, base = directory): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return listFiles(path, base);
    return [`/${path.slice(base.length + 1).replaceAll('\\', '/')}`];
  }));
  return files.flat();
}

function offlineServiceWorker(): Plugin {
  return {
    name: 'offline-service-worker',
    async closeBundle() {
      const files = (await listFiles(resolve('dist')))
        .filter((path) => !path.endsWith('.map') && path !== '/sw.js');
      const source = `const CACHE = 'invoice-packet-v1';
const PRECACHE = ${JSON.stringify(files)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE))));
self.addEventListener('activate', event => event.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))),
  self.clients.claim()
])));
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      const clone = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, clone)); return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const clone = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, clone)); }
    return response;
  })));
});`;
      await writeFile(resolve('dist/sw.js'), source);
    },
  };
}

export default defineConfig({
  plugins: [staticRoutes(), offlineServiceWorker()],
  build: { target: 'es2022', cssCodeSplit: true, sourcemap: true },
});
