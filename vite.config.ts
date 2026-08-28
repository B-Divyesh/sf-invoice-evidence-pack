import { defineConfig, type Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface StaticWebAppConfig {
  routes?: Array<{ route: string; headers?: Record<string, string> }>;
  globalHeaders?: Record<string, string>;
  mimeTypes?: Record<string, string>;
}

const staticWebAppConfig = JSON.parse(
  readFileSync(resolve('public', 'staticwebapp.config.json'), 'utf8'),
) as StaticWebAppConfig;

function routeMatches(pattern: string, pathname: string): boolean {
  return pattern.endsWith('*') ? pathname.startsWith(pattern.slice(0, -1)) : pathname === pattern;
}

function productionPolicyPreview(): Plugin {
  return {
    name: 'production-policy-preview',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url || '/', 'http://preview.local').pathname;
        const routeHeaders = staticWebAppConfig.routes
          ?.find((route) => routeMatches(route.route, pathname))?.headers;
        for (const [name, value] of Object.entries({ ...staticWebAppConfig.globalHeaders, ...routeHeaders })) {
          response.setHeader(name, value);
        }
        const extension = Object.keys(staticWebAppConfig.mimeTypes || {}).find((suffix) => pathname.endsWith(suffix));
        if (extension) response.setHeader('Content-Type', staticWebAppConfig.mimeTypes?.[extension] || '');
        next();
      });
    },
  };
}

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
      const builtFiles = (await listFiles(resolve('dist')))
        .filter((path) => !path.endsWith('.map') && path !== '/sw.js' && path !== '/staticwebapp.config.json');
      const files = ['/', '/privacy/', '/terms/', ...builtFiles];
      const version = createHash('sha256');
      for (const path of builtFiles.sort()) {
        version.update(path);
        version.update(await readFile(resolve('dist', path.slice(1))));
      }
      const source = `const CACHE = 'invoice-packet-${version.digest('hex').slice(0, 12)}';
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
  event.respondWith(caches.match(url.pathname, { ignoreSearch: true }).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const clone = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, clone)); }
    return response;
  })));
});`;
      await writeFile(resolve('dist/sw.js'), source);
    },
  };
}

export default defineConfig({
  plugins: [productionPolicyPreview(), staticRoutes(), offlineServiceWorker()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: '_app/[name]-[hash].js',
        chunkFileNames: '_app/[name]-[hash].js',
        assetFileNames: '_app/[name]-[hash][extname]',
      },
    },
  },
});
