import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface StaticWebAppConfig {
  routes: Array<{ route: string; headers: Record<string, string> }>;
  globalHeaders: Record<string, string>;
  mimeTypes: Record<string, string>;
}

const config = JSON.parse(
  readFileSync(resolve('public', 'staticwebapp.config.json'), 'utf8'),
) as StaticWebAppConfig;

describe('static deployment policy', () => {
  it('revalidates documents and service-worker metadata but makes hashed build assets immutable', () => {
    expect(config.globalHeaders['Cache-Control']).toBe('no-cache');
    expect(config.routes).toContainEqual({
      route: '/_app/*',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  });

  it('ships the manifest with an interoperable MIME type', () => {
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  });

  it('denies framing, ambient capabilities, and unexpected content sources', () => {
    const headers = config.globalHeaders;
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(headers['Content-Security-Policy']).toContain("object-src 'none'");
    expect(headers['Content-Security-Policy']).toContain("worker-src 'self' blob:");
    expect(headers['Content-Security-Policy']).not.toContain("'unsafe-inline'");
    expect(headers['Content-Security-Policy']).not.toContain("'unsafe-eval'");
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['Permissions-Policy']).toContain('microphone=()');
    expect(headers['Permissions-Policy']).toContain('payment=()');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
    expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin');
    expect(headers['Strict-Transport-Security']).toBe('max-age=63072000; includeSubDomains; preload');
  });
});
