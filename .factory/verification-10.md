# Independent verification 10 — PASS

**Candidate:** `1ef2833b4c48a02d84aaf52b2553f30b3fb92bca`  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-09-01 UTC  
**Work order:** `invoice-evidence-pack-verify-10`

## Verdict

**PASS.** The live static PWA matches the tested candidate byte-for-byte at
the document, legal/demo routes, manifest, service worker, and immutable
entry assets. All declared claim commands, local quality gates, browser
workflows, privacy checks, and accessibility checks completed successfully.
No release-blocking defect was confirmed.

## First-read and demo gate

A cold, fresh desktop browser opening the live root made the product purpose
plain on its first screen:

- It does: “Build a complete invoice evidence packet.”
- It is for: cross-border freelancers and small firms preparing files for an
  accountant, client, or filing review.
- The first action is the visible **Try it with sample data** link. It opens
  `/demo/` in one click and says that the sample is a separate workspace.

The demo showed the persistent “Demo — sample data, nothing is saved to your
packets” banner, Reset demo and Start for real actions, the Kite Studio sample
packet, and `4 of 4 required items collected`.

## Declared claims

`.factory/claims.json` is present with 21 entries. From the clean dependency
install, I ran every listed command exactly as written and sequentially. Each
passed. A source count also found exactly one matching `@claim:<id>` tag for
each entry.

Passed IDs: `demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`,
`missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`,
`json-backup`, `backup-import`, `offline-reload`, `aes-zip`,
`custom-templates`, `license-restore`, `checkout-operator-gate`,
`configurable-checklists`, `no-document-backend`, `pwa-installable`,
`free-exports`, `core-no-setup`, and `license-verification-minimum-data`.

## Clean build and product checks

- `npm ci`: PASS — 140 packages installed from the lockfile; npm audit
  reported zero known vulnerabilities.
- `npm test`: PASS — 11 tests in 2 files.
- `npm run check`: PASS — TypeScript project check.
- `npm run build`: PASS — production `dist/` emitted. There is no lint script
  or lint configuration in this repository.
- `npm run test:e2e`: PASS — 39 passed, 15 intentionally project-gated checks
  skipped in the 54-test desktop/mobile matrix.
- Normal and recovery coverage exercised packet creation, local persistence,
  SHA-256 file fingerprints, ZIP/PDF/JSON downloads, duplicate filenames,
  Devanagari/Japanese PDF metadata, encrypted ZIP, backup import, malformed
  backup recovery, whitespace-only names, exact 100 MiB file-size boundary,
  missing-evidence state, checklist selection, and demo reset.

## Live deployment, privacy, and headers

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed. Local/live SHA-256 identity included:

- root: `d861422c9036e5bf62461dc34c19af6b47eddd13375622d148bd881abe564ad3`
- service worker: `17d9272609f83b474a57a2c4340fe4175396aa452dae99e06c6e73bdb831a2e0`
- manifest: `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

A fresh live request log for the landing screen and demo contained only
`https://invoice-evidence-pack.sociobot.in`; there were no console errors or
page errors. The `verify-url.sh` live check also passed (971 ms), with title,
`lang=en`, one `h1`, one `main`, complete image alt attributes, and labelled
buttons.

Responses set HTTPS/HSTS, restrictive CSP, `X-Content-Type-Options: nosniff`,
strict-origin referrer policy, denied ambient permissions, `X-Frame-Options:
DENY`, and same-origin COOP/CORP. Documents, manifest, and worker are
revalidated; the hashed entry script has `public, max-age=31536000,
immutable` caching.

This is a static local-first PWA. It has no deployed product API, account
sign-in, data service, library package, or CLI, so no API allowance or
consumer-package check applies. The default build keeps new checkout hidden;
the optional existing-license verification is covered by its fixture-based
claim without sending packet data.

## Accessibility, responsive behaviour, PWA, and performance

- Fresh Axe scans of live root and live demo found zero serious or critical
  findings.
- At 390×844, page width was 390 px with no horizontal overflow. Tab reached
  the skip link first with a visible 3 px outline. A whitespace-only packet
  name showed the recovery message, retained focus, and set
  `aria-invalid="true"`.
- With reduced motion, button transition duration resolved to `0.00001s` and
  scrolling resolved to `auto`. No console or page errors occurred on desktop
  or mobile.
- A fresh controlled service worker used cache
  `invoice-packet-36a99d0aa4b2`. `registration.update()` completed with no
  waiting or installing worker. The generated worker has a versioned cache,
  `clients.claim`, and `skipWaiting`; the app has an update action for a
  waiting worker. A fresh post-visit offline reload succeeded and showed
  `Offline` with no errors.
- Build output: initial entry JS 48.28 kB raw / 16.52 kB gzip; CSS 21.30 kB
  raw / 5.51 kB gzip. Export/PDF code is lazy-loaded. Live Lighthouse mobile
  runs recorded accessibility 100 twice and performance 88 then 100 (mean
  94); LCP was 1.3 s / 1.2 s, CLS 0 both times, and total blocking time varied
  490 ms / 30 ms in the shared test environment. First-load transfer was
  59.6 kB / 71.8 kB with no font or third-party transfer.

## Evidence and next step

Evidence from the live URL checker is in `/tmp/invoice-verify-10-url/`; the
two Lighthouse JSON reports are `/tmp/invoice-lighthouse.json` and
`/tmp/invoice-lighthouse-2.json`. No corrective product work is required for
this candidate. Maintain the existing claim and offline/browser checks when
making future export or service-worker changes.
