import { defineConfig, type Plugin } from 'vite';
import { copyFile, mkdir } from 'node:fs/promises';
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

export default defineConfig({
  plugins: [staticRoutes()],
  build: { target: 'es2022', cssCodeSplit: true, sourcemap: true },
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts'] },
});
