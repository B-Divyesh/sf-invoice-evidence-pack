import { defineConfig, type Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
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
      for (const route of ['demo', 'privacy', 'terms']) {
        await mkdir(resolve('dist', route), { recursive: true });
        await copyFile(resolve('dist/index.html'), resolve('dist', route, 'index.html'));
      }
    },
  };
}

interface BuildManifestEntry {
  file: string;
  css?: string[];
  imports?: string[];
  isEntry?: boolean;
}

function emittedFileForCachePath(path: string): string {
  const routeFiles: Record<string, string> = {
    '/': 'index.html',
    '/demo/': 'demo/index.html',
    '/privacy/': 'privacy/index.html',
    '/terms/': 'terms/index.html',
  };
  return routeFiles[path] || path.slice(1);
}

async function appShellAssets(): Promise<string[]> {
  const manifestPath = resolve('dist', 'asset-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Record<string, BuildManifestEntry>;
  const entry = Object.entries(manifest).find(([, value]) => value.isEntry)?.[0];
  if (!entry) throw new Error('The Vite entry was not found while building the offline shell.');

  const assets = new Set<string>();
  const visit = (key: string): void => {
    const item = manifest[key];
    if (!item) throw new Error(`Missing ${key} from the Vite build manifest.`);
    assets.add(`/${item.file}`);
    item.css?.forEach((file) => assets.add(`/${file}`));
    item.imports?.forEach(visit);
  };
  visit(entry);
  await unlink(manifestPath);
  return [...assets];
}

function offlineServiceWorker(): Plugin {
  return {
    name: 'offline-service-worker',
    async closeBundle() {
      // Keep installation small and deterministic. Export libraries and PDF fonts are
      // fetched only when an export needs them, then cached by the fetch handler for
      // subsequent offline use. Precaching all emitted chunks made a first visit 6.9 MB.
      const files = [...new Set([
        '/', '/demo/', '/privacy/', '/terms/', '/offline.html', '/manifest.webmanifest',
        '/icons/mark.svg', '/icons/icon-192.png', '/icons/icon-512.png',
        '/assets/hero-field-guide-768.webp', '/assets/hero-field-guide-1536.webp', '/assets/hero-field-guide-768.jpg',
        ...await appShellAssets(),
      ])].sort();
      const version = createHash('sha256');
      for (const path of files) {
        version.update(path);
        version.update(await readFile(resolve('dist', emittedFileForCachePath(path))));
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
      if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, response.clone())));
      return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }
  event.respondWith(caches.match(url.pathname, { ignoreSearch: true }).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, response.clone())));
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
    manifest: 'asset-manifest.json',
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
