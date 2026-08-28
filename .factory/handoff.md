# Invoice Packet v1 handoff

## What shipped

- A complete offline-first packet workflow: create a packet, choose and customize a checklist, attach local files, compute SHA-256 fingerprints, identify missing required evidence, add accountant/reviewer notes, and retain a visible edit history.
- IndexedDB persistence for packet records and file blobs, plus full JSON backup/import so users own and can move their data.
- Plain ZIP export containing the evidence files, `manifest.json`, and verification instructions; filename redaction; and a real downloadable PDF manifest.
- A $19 one-time paid unlock using the Sociobot license contract for standard AES-256 encrypted ZIPs and reusable custom templates. The core workflow, accessibility, hashing, backup, plain ZIP, and PDF stay free. No product ID or secret is embedded.
- Installable PWA manifest, hand-authored icon, generated precache service worker, offline navigation, update prompt, light/dark themes, and reduced-motion handling.
- Dedicated `/privacy/` and `/terms/` routes, MIT license, complete README, and original botanical field-guide visual system.
- Original generated hero art, reviewed for text/brand artifacts and optimized to 36 KB mobile WebP / 124 KB large WebP. Prompt and provenance are recorded in `.factory/design.md` and `assets/src/`.

## How it was verified

- `npm test`: 5 unit tests passed (completion logic, safe filenames, manifest flags/redaction, SHA-256, full backup round-trip).
- `npm run build`: passed; writes `dist/index.html` and static `/privacy/` and `/terms/` fallbacks.
- `npm run test:e2e`: 9 passed, 1 intentionally skipped duplicate (desktop + 390px mobile). Covers packet creation, file hashing, persistence after reload, ZIP download, axe serious/critical rules in light and dark treatments, mobile overflow, legal routes, and explicit offline reload with `context.setOffline(true)`.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, no page/console errors, title and `lang` present, exactly one `h1`, main landmark present, no missing image alt text, and no unlabeled buttons.
- Lighthouse 12.8.2, mobile profile against the production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100. FCP 0.9 s, LCP 1.5 s, TBT 0 ms, CLS 0.
- Initial app JS: 40.8 KB uncompressed / 14.2 KB gzip. CSS: 19.9 KB / 5.2 KB gzip. PDF and ZIP libraries are lazy-loaded only when exporting.
- Manual visual review completed at 1440px and 390px; keyboard-native controls, focus rings, dialog semantics, alt text, one `h1`, and responsive stacking are present.

## Run / deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Deploy `dist/` as the static root. For a staging billing build, set `VITE_BILLING_BASE_URL=https://pilot-api.sociobot.in/api/v1`; production uses the Sociobot production API by default.

## Known limits and next steps

- Browser storage quotas vary by device; the UI caps each attachment at 100 MB and tells users to keep exported backups.
- PDF uses the PDF standard Latin font set; characters outside that set are conservatively replaced in the PDF only. ZIP/JSON manifests retain the original Unicode text. A future build can self-host and subset a wider Unicode PDF font.
- The factory must register the checkout product and confirm the final $19 catalog price/return URL before launch. The application intentionally contains no provider product identifier.
- Automated verification targets Chromium. Safari and Firefox should receive a short manual installed-PWA and encrypted-ZIP compatibility pass before a broad launch.

## Independent verification 2 — FAIL (2026-08-28 UTC)

Candidate `8b9f079e22166b36b637ce56d2c5873ef4023e03` was independently rebuilt
from a clean detached checkout and compared against
`https://invoice-evidence-pack.sociobot.in`. The deployed root, service
worker, manifest, legal pages, initial/lazy bundles, and hero asset all
byte-match that candidate. Core functionality, offline reload, simulated
service-worker update, 390px mobile, keyboard/focus, reduced motion, axe,
exports, privacy/outbound-request checks, unit/type/build/e2e gates, and a
95/100 Lighthouse mobile run passed.

**Release verdict: FAIL.** The live host returns only
`cache-control: public, must-revalidate, max-age=30` for content-hashed
assets, rather than long-lived immutable caching required for this static PWA.
It also omits CSP, Permissions-Policy, framing protection, COOP/CORP, and
serves the web manifest as `application/octet-stream`. See
`.factory/verification-2.md` for reproducible commands, exact results, and
severity-ranked remediation. No product code was modified by verification.
