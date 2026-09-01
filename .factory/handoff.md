# Invoice Packet repair handoff — 2026-09-01

## Outcome

Repaired the release-blocking first-use offline export failure recorded in
[`verification-11.md`](verification-11.md). After a successful visit, the
service worker now installs the lazy ZIP/PDF JavaScript graph and the two small
PDF font subsets. The app's entry module stays lazy-load sized; the multi-
megabyte script-font fallbacks remain on-demand for unusual metadata.

The sample title's U+00B7 separator was absent from the compact Devanagari
subset, which would otherwise force a full fallback font for the sample PDF.
The regenerated 14,276-byte subset includes that glyph. Provenance and the
new SHA-256 are recorded in `THIRD_PARTY_NOTICES.md` and `design.md`.

## Regression coverage

`@claim:offline-reload` now starts from a fresh Chromium context at `?demo=1`,
waits for service-worker control, proves the generated lazy export modules and
core PDF fonts are in Cache Storage, then goes offline before either export is
used. It reloads the demo, downloads both formats, and independently checks:

- ZIP entries include the manifest, README, and sample evidence; its manifest
  names `Kite Studio · August client review` and has four present items.
- PDF text contains the sample packet title and `Aozora 株式会社`.
- No full fallback font is requested; `-full.ttf` assets are deliberately not
  in the installation cache.

The focused regression failed before the font-subset adjustment because the
PDF tried to fetch a full fallback font; it passes after the repair.

## Verification

- `npm ci`: passed, 140 packages installed; npm reported 0 vulnerabilities.
- `npm test`: 11/11 passed.
- `npm run check`: passed.
- `npm run build`: passed and produced `dist/`.
- Every one of the 22 commands declared in `.factory/claims.json` was run
  separately and passed.
- `npm run test:e2e`: 41 passed, 17 intentional mobile-only skips.
- `npm run test:e2e:repeat`: 82 passed, 34 intentional skips.
- `node .qa-axe-mobile.mjs`: no serious or critical Axe findings in desktop
  light/dark or 390px mobile; no console errors or horizontal overflow.
- `node .qa-independent.mjs`: keyboard validation, focus, reduced motion,
  local storage, local-only requests, and offline reload passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174/ .factory/evidence/repair-7`:
  passed title, `lang`, one `h1`, `main`, image alt, labelled buttons, and no
  console errors. Evidence is in `.factory/evidence/repair-7/`.
- Lighthouse mobile against the production build: performance 100,
  accessibility 100, best practices 100, SEO 100; LCP 1.5 s, TBT 0 ms,
  CLS 0, total transfer 78 KiB.
- Initial executable entry JavaScript remains 48,189 bytes raw / 16,454 bytes
  gzip (under the 200 KB budget). The precache has 22 files, including seven
  lazy export modules and the two compact fonts, with no full fallback font.

## Deployment

Deployed `dist/` to the product's existing Static Web App (`sf-invoice-evidence-pack`)
on 2026-09-01. Azure deployment ID: `e5acbb4b-a9a7-4726-b11c-c01175bfb612`.

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed the restrictive response policy and byte identity for root, service
worker, manifest, demo, privacy, and terms. The live service-worker SHA-256 is
`3d5e14729c6bd29785bfd2673e9a7f072b3f7184f5075977b1ad9fe95164a2f0`.

`node scripts/verify-live.mjs https://invoice-evidence-pack.sociobot.in
.factory/evidence/repair-7/live` also passed desktop first-read/demo, normal
ZIP export without an account, routes/focus/404, 390px mobile Axe, privacy,
offline reload, and request/console checks (no external workflow requests or
errors).

A fresh live `?demo=1` context then confirmed seven cached export modules and
the two compact fonts before going offline. Its first ZIP contained the sample
manifest and four present evidence items; its first PDF exposed the sample
title and client text. No full fallback font was cached or requested.

## Known boundary

The complete Noto fallback fonts are intentionally not preinstalled because
the Japanese source alone is about 4.8 MiB. They are used only for uncommon
characters outside the local core subsets when the export is made online. The
shipped offline demo and its complete ZIP/PDF workflow are fully cached and
verified.
