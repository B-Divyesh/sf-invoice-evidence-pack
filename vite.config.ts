import { defineConfig, type Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
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
      const routeMetadata = {
        demo: {
          title: 'Demo — Invoice Packet',
          description: 'Try Invoice Packet with sample data in a separate workspace.',
          canonical: 'https://invoice-evidence-pack.sociobot.in/demo/',
        },
        privacy: {
          title: 'Privacy — Invoice Packet',
          description: 'See how Invoice Packet stores and handles packet data.',
          canonical: 'https://invoice-evidence-pack.sociobot.in/privacy/',
        },
        terms: {
          title: 'Terms — Invoice Packet',
          description: 'Read the Invoice Packet terms and license conditions.',
          canonical: 'https://invoice-evidence-pack.sociobot.in/terms/',
        },
      } as const;
      const root = await readFile(resolve('dist', 'index.html'), 'utf8');
      for (const [route, metadata] of Object.entries(routeMetadata)) {
        await mkdir(resolve('dist', route), { recursive: true });
        const document = root
          .replace(/<title>[^<]*<\/title>/, `<title>${metadata.title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${metadata.description}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1${metadata.canonical}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${metadata.title}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${metadata.description}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, `$1${metadata.canonical}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${metadata.title}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${metadata.description}$2`);
        await writeFile(resolve('dist', route, 'index.html'), document);
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

interface OfflineAssets {
  shell: string[];
  exportDependencies: string[];
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

async function offlineAssets(): Promise<OfflineAssets> {
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

  // Every emitted JavaScript module other than the entry's static graph is a
  // dependency of one of the two local export formats. Keep those modules in
  // the installation cache so the first ZIP or PDF export still works after a
  // successful visit goes offline. They stay lazy in index.html, so they do
  // not add to the app's first-execution JavaScript budget.
  const exportDependencies = new Set<string>();
  for (const item of Object.values(manifest)) {
    const path = `/${item.file}`;
    if (item.file.endsWith('.js') && !assets.has(path)) exportDependencies.add(path);
  }
  await unlink(manifestPath);
  return { shell: [...assets], exportDependencies: [...exportDependencies] };
}

function offlineServiceWorker(): Plugin {
  return {
    name: 'offline-service-worker',
    async closeBundle() {
      const assets = await offlineAssets();
      // The full script-font fallbacks are intentionally not installed. The compact
      // local subsets cover the app and demo; unusual scripts are fetched only when
      // an online export needs them, avoiding a multi-megabyte first visit.
      const files = [...new Set([
        '/', '/demo/', '/privacy/', '/terms/', '/offline.html', '/manifest.webmanifest',
        '/icons/mark.svg', '/icons/icon-192.png', '/icons/icon-512.png',
        '/assets/hero-field-guide-768.webp', '/assets/hero-field-guide-1536.webp', '/assets/hero-field-guide-768.jpg',
        '/assets/noto-sans-devanagari.ttf', '/assets/noto-sans-jp.ttf',
        ...assets.shell, ...assets.exportDependencies,
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
