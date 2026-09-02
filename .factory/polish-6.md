# Invoice Packet polish 6

Repair target: `e12e7a0f28c079d65997b1f78129af023278df68`  
Review source: `78fa896bfb877f56b7ab863fb80fe6dcd14a2509`  
Repair code: `1bcbb84`  
Production deployment: `013d9ff5-aac4-46fb-94e0-b2a60cfd5485`

## Round 6 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-6-1 | Changed **Storage and export privacy** from a paragraph to an `h2`, gave it `id="assurance-title"`, and labelled the section with `aria-labelledby`. | `uses a semantic landing outline and plain informational labels` checks the exact h1 → h2 → h3s → h2 outline and named region. Live `firstScreen.headingOutline` and `firstScreen.assuranceName` pass in [live-check.json](evidence/polish-6/live/live-check.json). See the [live desktop screenshot](evidence/polish-6/live/verify-url/screenshot-desktop.png) and <https://invoice-evidence-pack.sociobot.in/>. |
| F-6-2 | Replaced the connected header label **Local first** with the literal state **Online**. The disconnected state remains **Offline**. | `uses a semantic landing outline and plain informational labels`; `@claim:offline-reload`. Live `firstScreen.networkStatus` is `Online` and `offline.status` is `Offline` in [live-check.json](evidence/polish-6/live/live-check.json); <https://invoice-evidence-pack.sociobot.in/>. |
| F-6-3 | Removed the decorative **Plate 01** prefix and retained the explanatory caption about grouping an invoice with evidence. | `uses a semantic landing outline and plain informational labels`; live `firstScreen.heroCaption` in [live-check.json](evidence/polish-6/live/live-check.json); [live mobile screenshot](evidence/polish-6/live/verify-url/screenshot-mobile.png); <https://invoice-evidence-pack.sociobot.in/>. |

## Earlier finding regression map

| Finding | Preserved change | Evidence |
| --- | --- | --- |
| F-1-1 | New checkout remains unavailable by default; existing-license restore remains usable. | `@claim:checkout-operator-gate`; `@claim:license-restore`; live license audit. |
| F-1-2 | In-app routes, full-document demo routes, Back, and demo entry focus and announce the destination h1. | `moves focus and announces the destination for route navigation and browser back`; two demo focus tests; live route audit. |
| F-1-3 | The static 404 retains description, canonical, Open Graph, Twitter, and Apple-touch metadata. | `ships complete metadata for static routes and the designed 404 page`; live unknown-route audit. |
| F-1-4 | The designed 404 retains the literal **Page not found** h1 and recovery link. | Static 404 browser test; live unknown route returns HTTP 404. |
| F-1-5 | The hero caption directly explains invoice-and-evidence grouping. | Round-6 caption regression; local and live landing screenshots. |
| F-1-6 | **Storage and export privacy** remains the direct assurance heading and is now also semantic. | Round-6 outline regression; local and live `firstScreen.assuranceName`. |
| F-1-7 | Fingerprint assurance names the exported manifest contents. | `@claim:manifest-fingerprints`; landing screenshot. |
| F-1-8 | Portability assurance names ZIP, PDF, and JSON backup. | `@claim:free-exports`; `@claim:json-backup`; landing screenshot. |
| F-1-9 | The release action remains **Restore an existing license**. | `@claim:checkout-operator-gate`; `@claim:license-restore`. |
| F-1-10 | README opens with two short, packet-consistent sentences. | [Copy audit](copy-audit.md). |
| F-1-11 | README describes browser storage and no uploads without implementation jargon. | `@claim:local-only`; `@claim:no-document-backend`; copy audit. |
| F-1-12 | README says install and reopen offline without using the PWA acronym as user copy. | `@claim:pwa-installable`; `@claim:offline-reload`. |
| F-1-13 | README names each free export. | `@claim:free-exports`; copy audit. |
| F-1-14 | README tells users to choose and edit a checklist and states the advice limit. | `@claim:configurable-checklists`; copy audit. |
| F-1-15 | README test documentation remains split into short sentences. | Copy-audit word counts. |
| F-1-16 | README deployment documentation remains split into short sentences. | Copy-audit word counts; deployment verifier. |
| F-1-17 | Core create, attach, and export still needs no key or external service. | `@claim:core-no-setup`. |
| F-1-18 | License verification still sends only the token query parameter and no body. | `@claim:license-verification-minimum-data`. |
| F-1-19 | The public footer contains no unverified image-generation assertion. | Landing screenshots; provenance remains in `.factory/design.md`. |
| F-2-1 | Legal h1 values remain literal **Privacy** and **Terms**. | `privacy and terms routes have semantic page titles`; live route audit. |
| F-2-2 | Workspace labels remain direct task names. | `uses task names throughout the sample workspace`; live demo audit. |
| F-2-3 | Account-free create and export remains declared and tested. | `@claim:no-account-required`; live `noAccount` result. |
| F-2-4 | README consistently uses **payment trail**. | Copy audit; `@claim:configurable-checklists`. |
| F-3-1 | Query-demo Privacy and Back retain h1 focus and announcements without leaving demo storage. | `keeps route focus and announcements in the isolated query demo`; live demo route audit. |
| F-4-1 | Header Demo and Back retain full-document h1 focus and announcements. | `moves focus and announces after header Demo navigation and browser back`; live route audit. |
| F-4-2 | ZIP manifests retain complete SHA-256 fingerprints for every attachment. | `@claim:manifest-fingerprints`. |
| F-4-3 | Every application footer labels GitHub and its new-tab behavior. | `uses an explicit external-source label in every footer`; live footer audit. |
| F-4-4 | The designed 404 retains the same Privacy, Terms, and disclosed Source links. | Static 404 test; live `routes.notFoundFooter`. |
| F-5-1 | The first-screen sample action focuses **Your packets** and announces the route after its document transition. | `moves focus and announces after the hero sample-data action`; `@claim:demo-sandbox`; live `demo.heroFocus`. |
| F-5-2 | A revoked fixture verdict locks paid tools while free exports remain. | `@claim:license-revocation`; live `license.revocation`. |
| F-5-3 | A saved valid license remains active offline and is checked after reconnection. | `@claim:offline-license-verdict`; live `license.offlineVerdict` and `license.reconnectCheck`. |
| F-5-4 | Terms and the license dialog contain no unproved merchant or refund-handling statement. | Live verifier text audit; `@claim:checkout-operator-gate`. |

## Local verification

- Fresh clone `/tmp/invoice-polish6-clean-Mn5qrj`: `npm ci` reported zero
  vulnerabilities. Every one of the 25 commands in `.factory/claims.json`
  passed individually. The inventory has exactly one matching test tag per
  claim and no undeclared tags.
- Fresh-clone gates passed: 11/11 unit tests, typecheck, production build, and
  54/74 browser cases. The other 20 are intentional cross-project skips.
- The working-tree repeat run passed 108/148 browser cases; the other 40 are
  intentional skips.
- Playwright Axe found no serious or critical issue. Browser tests cover
  desktop, 390 px mobile, both themes, keyboard focus, dialogs, privacy request
  boundaries, offline reload, and first-use offline ZIP/PDF exports.
- The Static Web Apps emulator passed response policy and byte identity checks.
  The local live verifier found no console errors, failed requests, external
  requests, or mobile overflow. Evidence: [live-check.json](evidence/polish-6/local/live-check.json).
- The fleet URL verifier passed title, language, one h1, main, alt text, button
  names, and console checks in 783 ms. Evidence: [verify.json](evidence/polish-6/local/verify-url/verify.json).
- Local mobile Lighthouse: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 1.91 s, TBT 0 ms, CLS 0. Evidence:
  [lighthouse-mobile.json](evidence/polish-6/local/lighthouse-mobile.json).

## Live verification

- Deployed through `/opt/fleet/lib/deploy-static.sh invoice-evidence-pack dist`
  as deployment `013d9ff5-aac4-46fb-94e0-b2a60cfd5485`.
- `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
  passed response policy and byte identity for the root, service worker,
  manifest, Demo, Privacy, and Terms documents.
- `npm run verify:live -- https://invoice-evidence-pack.sociobot.in
  .factory/evidence/polish-6/live` passed the full workflow. Its request log
  contains no console errors, failed requests, or unexpected external
  requests. Evidence: [live-check.json](evidence/polish-6/live/live-check.json).
- The fleet URL verifier passed in 830 ms. Evidence:
  [verify.json](evidence/polish-6/live/verify-url/verify.json).
- Live mobile Lighthouse scored 100 in performance, accessibility, best
  practices, and SEO. LCP was 1.13 s, TBT 0 ms, and CLS 0. Evidence:
  [lighthouse-mobile.json](evidence/polish-6/live/lighthouse-mobile.json).

No review finding remains open.
