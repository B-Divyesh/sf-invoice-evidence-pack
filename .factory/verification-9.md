# Independent verification 9 — FAIL

Candidate: `dea5d91173d777429844f517937615fe53916ff2`  
Live URL: <https://invoice-evidence-pack.sociobot.in>  
Verified: 2026-09-01 UTC  
Work order: `invoice-evidence-pack-verify-9`

## Verdict

**FAIL — release-blocking accessibility defect.** The deployed static assets match the tested candidate exactly, and the functional checks below pass. However, entering the one-click demo renders two `h1` elements, which fails the product contract's one-`h1`-per-page requirement.

## First-read and demo gate

A fresh, cold 1440×900 live context returned HTTP 200 with no console, page, or failing-subresource errors.

- What it does: “Build a complete invoice evidence packet.”
- For whom: cross-border freelancers and small firms preparing material for an accountant, client, or filing review.
- What to click first: the visible **Try it with sample data** link opens `/demo/` in one click.

The first screen also says the sample uses a separate workspace and plainly lists browser-only storage, offline use after the first visit, and free ZIP/PDF/JSON exports. The demo has the required persistent banner, reset action, start-for-real action, and realistic Kite Studio sample. This gate passes.

## Release-blocking finding

### High — demo has two page-level headings

At `https://invoice-evidence-pack.sociobot.in/demo/`, fresh Playwright checks found these two elements:

1. visually hidden `h1`: `Invoice Packet`
2. visible `h1`: `Your packets`

The same result occurred at 390px. The issue is deterministic in the candidate source: `render()` adds the hidden `#route-heading` whenever packets exist, while `workspace()` renders its own `h1` for “Your packets” ([src/main.ts](/work/repo/src/main.ts:137), [src/main.ts](/work/repo/src/main.ts:225)). The landing page has one `h1`; the demo and populated workspace do not.

This does not appear as an axe serious/critical result, but it independently fails the explicit semantic structure acceptance requirement. Keep only one page-level heading in the populated and demo views, and add an automated check for that state before re-verification.

## Declared claims

`.factory/claims.json` is present with 21 entries. From the clean installation, I ran every listed command exactly as written, sequentially. All completed successfully. A source check found exactly one `@claim:<id>` test occurrence for each ID.

PASS: `demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`, `missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`, `json-backup`, `backup-import`, `offline-reload`, `aes-zip`, `custom-templates`, `license-restore`, `checkout-operator-gate`, `configurable-checklists`, `no-document-backend`, `pwa-installable`, `free-exports`, `core-no-setup`, and `license-verification-minimum-data`.

## Clean-checkout checks

- `npm ci`: PASS — 140 packages installed from `package-lock.json`; audit reported no known vulnerabilities.
- `npm test`: PASS — 2 files, 11 tests.
- `npm run check`: PASS — TypeScript project check.
- Lint: no lint script or lint configuration is provided.
- `npm run build`: PASS — emitted `dist/`.
- `npm run test:e2e`: PASS — Playwright last-run status `passed` after its 48-test matrix.
- `npm run test:e2e:repeat`: PASS — Playwright last-run status `passed` after its 96-test repeat matrix.

Vite reports a lazy export chunk above 500 kB. It is not part of the initial page request. The delivered initial JavaScript is 48,299 bytes raw / 16,529 bytes gzip and CSS is 21,297 bytes raw / 5,505 bytes gzip, within the stated initial static-product budgets.

## Live deployment, privacy, and delivery

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in` passed. The live root, demo, privacy, terms, manifest, worker, and initial immutable assets match the freshly-built candidate byte-for-byte.

- Root SHA-256: `b9fd2e610b102cca04867ae525e1e628dbbb5fb49b2f9da0cab58eb958b3090e`
- Service worker SHA-256: `3242178c9de20933dce0fe3d0b74d0d73ed72f05b71c3588154458f717060f5e`
- Manifest SHA-256: `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

The live responses have `no-cache` document/worker/manifest delivery, immutable hashed entry assets, the expected restrictive CSP, denied ambient permissions, `DENY` framing, COOP/CORP, HSTS, and strict-origin referrer policy. An unknown route returned the styled 404 with title `Page not found — Invoice Packet`.

Fresh live request logging during the cold first screen recorded only the product origin for the document, app assets, local images, and icon. There were no console/page errors or unsuccessful subresources. The exact local claim checks also cover the normal create/attach/export flow without third-party requests.

This is a static PWA with no product backend, account sign-in, database, library package, or CLI. New checkout is hidden in the default build. No product-server request allowance applies. The optional billing verification path was not contacted because it is outside this work order's permitted resource scope.

## Accessibility, mobile, and PWA

- `/opt/fleet/lib/verify-url.sh` PASS on the live root: 829 ms cold load; title, `lang=en`, one root `h1`, `main`, image alt text, and labelled buttons present; no console errors.
- Fresh Playwright axe checks: zero serious or critical findings on desktop root and 390px demo.
- Keyboard check: Tab reached the skip link first and it had a visible 3px outline.
- 390px demo check: `scrollWidth` and `clientWidth` were both 390; no console errors.
- Reduced-motion rule and normal/invalid/recovery behavior are covered by the passing browser suite. In particular, the suite covers whitespace packet names, malformed backup recovery, boundary file sizes, missing evidence confirmation, persistence, hashes, ZIP/PDF/JSON export, and demo reset behavior.
- PWA check: a fresh live demo context received a controlling worker and versioned cache `invoice-packet-94df6d7fba1d`; `registration.update()` completed with no waiting worker; after the first visit an offline reload retained the Kite Studio demo and showed `Offline` with no console errors.

## Evidence

- Worker baseline output and screenshots: `/tmp/invoice-verify-9-url/`
- Cold live desktop screenshot: `/tmp/invoice-verify-9-cold-desktop.png`
- Demo desktop/mobile screenshots: `/tmp/invoice-verify-9-demo-desktop.png`, `/tmp/invoice-verify-9-demo-mobile.png`

## Required next step

Remove the duplicate demo/populated-view `h1`, add a browser test that asserts exactly one `h1` for `/demo/` and a populated normal workspace, then rerun independent verification.
