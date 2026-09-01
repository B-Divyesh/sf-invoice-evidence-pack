# Independent verification 8 — PASS

Candidate: `057597d9c102a8901b4d86ff068b45d189814009`  
Live URL: <https://invoice-evidence-pack.sociobot.in>  
Verified: 2026-09-01 UTC  
Work order: `invoice-evidence-pack-verify-8`

## Verdict

**PASS for release acceptance.** The exact candidate is deployed. The live site matches the fresh local production build byte-for-byte at its document, manifest, worker, and immutable entry-asset boundaries. All declared claims, local quality gates, independent browser workflows, privacy checks, accessibility checks, responsive checks, and offline PWA reload checks pass. No confirmed defects remain.

## First-read and demo gate

A cold 1440×900 Chromium context opened the live root before product testing.

- What it does: “Build a complete invoice evidence packet.”
- For whom: cross-border freelancers and small firms preparing files for an accountant, client, or filing review.
- First action: **Try it with sample data** is visible in the first screen and opens `/demo/` in one click.

The first screen says that the sample uses a separate workspace, and plainly lists local browser storage, offline reload after the first visit, and free ZIP/PDF/JSON exports. `/demo/` showed the seeded “Kite Studio · August client review” packet and persistent “Demo — sample data, nothing is saved to your packets” banner. This passes the plain-words and demo-sandbox gate.

## Declared claims

`.factory/claims.json` is present with 18 non-empty entries. After `npm ci`, every listed `test` command was run exactly as written, against the shipped demo entry point where applicable. All passed. A source cross-check found one test source occurrence for every `@claim:<id>` tag.

`demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`, `missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`, `json-backup`, `backup-import`, `offline-reload`, `aes-zip`, `custom-templates`, `one-time-checkout`, `configurable-checklists`, `no-document-backend`, `pwa-installable`, and `free-exports` all PASS.

The landing page, legal pages, and README were checked against this inventory. No material user-facing claim was found without coverage.

## Clean-checkout quality gates

- `npm ci`: PASS — 140 packages installed from lockfile.
- `npm test`: PASS — 2 files, 11 tests.
- `npm run check`: PASS — TypeScript project check.
- Lint: N/A — no lint script or lint configuration exists.
- `npm run build`: PASS — exact production build emitted `dist/`.
- `npm run test:e2e`: PASS — 27 passed, 13 intentional project skips.
- `npm run test:e2e:repeat`: PASS — 54 passed, 26 intentional project skips.

One initial full E2E attempt, made after the mandatory per-claim commands, timed out while Playwright tried to close a trace whose generated ignored artifact no longer existed (`ENOENT` under `test-results/.playwright-artifacts-*`). After isolating that generated output and rerunning the untouched candidate, the complete matrix and repeat matrix passed. This was not reproducible and is not a product defect.

Vite warns that a lazy export chunk exceeds 500 kB. Initial entry assets remain within the static-product budgets: JS 46,986 bytes / 16,282 gzip, CSS 21,297 bytes / 5,505 gzip, and mobile hero WebP 32,908 bytes. PDF/font export code is not part of the initial application request.

## Deployment identity, delivery, and routes

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in` passed from the fresh build.

- Root/demo/privacy/terms SHA-256: `d571526ba6da8c2f01cef996fc571ce1ba8d1d64df87c0186e1689477963db5d`
- Worker SHA-256: `7c17d899cca1e658ffd6b9b974e4acbc88409a59006670af6b3376f108fbffb8`
- Manifest SHA-256: `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

The root, demo, privacy, terms, manifest, and worker return 200. The unknown route returns a styled 404 with title “Page not found — Invoice Packet”. HTML, manifest, and worker revalidate with `no-cache`; live entry assets are immutable. Responses have the expected restrictive CSP, denied ambient permissions, `DENY` framing, COOP/CORP, `nosniff`, strict-origin referrer policy, and preload HSTS.

The provided `verify-url.sh` found a title, `lang=en`, one `h1`, a `main`, complete image alt text, and named buttons. Its first execution logged two unlabelled transient 503 console messages; three direct cold retries and a further ten cold contexts recorded zero console/page errors, failed requests, or 4xx/5xx subresources. No reproducible deployment fault was found.

## Independent product checks

On the live application, a normal packet was created with representative invoice evidence. A known file was attached and the full SHA-256 value `d5b7e030709f98cb97ad24269347558feb88bea79762d67fa25d750f4121a4aa` was shown. Reload retained the file. A JSON backup downloaded as `invoice-packet-backup-2026-09-01.json`.

Whitespace-only packet names were rejected, marked `aria-invalid`, retained focus, and displayed a corrective plain-language message. Importing `{not valid}` showed “This backup file is damaged or not valid JSON. Choose an Invoice Packet JSON backup and try again.” The original packet persisted after reload. These checks cover normal use, invalid input, recovery, and the previous malformed-backup release blocker.

## Privacy, accessibility, mobile, and PWA

- A full normal live workflow made 17 requests, all to `https://invoice-evidence-pack.sociobot.in`; it had no console/page errors or bad HTTP responses. No document, analytics, or tracking request left the product origin.
- Axe found zero serious or critical findings on the desktop root and 390px demo. Keyboard Tab focused the skip link first. The invalid-name path kept focus on the invalid field.
- At 390px, document scroll width and client width were both 390px. The mobile demo had no console errors. Reduced motion computed to `1e-05s` transition and animation durations.
- The live PWA had an active controlling service worker, standalone manifest, versioned start URL `/?v=2&source=pwa`, 192px and maskable 512px icons, and one versioned cache. Calling `registration.update()` completed without a waiting worker, as expected for the current deployed worker. The update path implements `updatefound`, `SKIP_WAITING`, and `controllerchange`; a different live worker cannot be synthesized without changing the product artifact. After first load, a fresh `/demo/` context reloaded offline, retained the sample packet, and visibly reported “Offline”.

This static PWA has no product backend, sign-in, database, library package, or CLI. The checkout link was not followed and no Sociobot billing API request was made because it is outside the permitted `sf-invoice-evidence-pack` resource scope. Consequently no product-server allowance or 429/`Retry-After` behavior applies to this candidate.

## Defects

None confirmed.

## Evidence locations

- URL smoke evidence: `/tmp/invoice-evidence-pack-verify-8-url/`
- Cold live screenshot: `/tmp/invoice-live-cold-desktop.png`
- 390px live demo screenshot: `/tmp/invoice-verify-8-mobile.png`
