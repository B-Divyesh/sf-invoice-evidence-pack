# Invoice Packet polish 4

Repair target: `649fe98e1d34360213e328cdf754a02b24fd4180`  
Review source: `d2c48c04223496b3b9aeecaf43789e842c1dec1e`  
Repair code: `24aada5411a163efd945e0f8c8f45efc0e5ab1cd`  
Production deployment: `a8e566c9-2dff-4d5c-ae76-1265c1aa40ac`

## Evidence

- A fresh clone at `/tmp/invoice-evidence-pack-clean-OQOP0q` ran `npm ci`, all
  23 exact commands in `.factory/claims.json`, `npm test`, `npm run check`,
  and `npm run build` successfully.
- The local browser suite passed 66 tests and its repeat run passed 132 tests.
  Axe serious/critical checks are part of that suite in both themes and at the
  390px mobile viewport.
- Production passed `npm run verify:deployment --
  https://invoice-evidence-pack.sociobot.in`, `npm run verify:live --
  https://invoice-evidence-pack.sociobot.in .factory/evidence/polish-4/live`,
  and `/opt/fleet/lib/verify-url.sh`. See
  [live check](evidence/polish-4/live/live-check.json),
  [desktop screenshot](evidence/polish-4/live/verify-url/screenshot-desktop.png),
  and [mobile screenshot](evidence/polish-4/live/verify-url/screenshot-mobile.png).
- Live mobile Lighthouse scored 100 for performance, accessibility, best
  practices, and SEO; LCP was 1.1s and CLS 0. See
  [Lighthouse JSON](evidence/polish-4/live/lighthouse-mobile.json).

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept new checkout unavailable by default and retained only the tested existing-license restore path. | `@claim:checkout-operator-gate`, `@claim:license-restore`; live license dialog check. |
| F-1-2 | Preserved h1 focus and polite route announcements for in-app links and history; the formerly missed header Demo path is covered in F-4-1. | `moves focus and announces the destination for route navigation and browser back`; live route checks. |
| F-1-3 | Kept complete metadata on the static 404 document. | `ships complete metadata for static routes and the designed 404 page`; live 404 metadata check. |
| F-1-4 | Kept the literal **Page not found** h1 and recovery link. | Static 404 test; live `/not-a-real-route` check. |
| F-1-5 | Kept the explanatory hero caption about grouping an invoice with supporting evidence. | Live desktop and mobile screenshots. |
| F-1-6 | Kept **Storage and export privacy** as the assurance heading. | Copy audit; live screenshots. |
| F-1-7 | Kept **File fingerprints in each manifest** as the specific assurance label. | `@claim:manifest-fingerprints`; live screenshots. |
| F-1-8 | Kept **Download ZIP, PDF, or JSON backup** as the specific export label. | `@claim:free-exports`, `@claim:json-backup`; live screenshots. |
| F-1-9 | Kept the result-naming **Restore an existing license** action. | `@claim:checkout-operator-gate`; live dialog check. |
| F-1-10 | Kept the short, packet-consistent README opening. | `.factory/copy-audit.md`; clean-clone replay. |
| F-1-11 | Kept plain browser-storage and no-upload README wording. | `@claim:no-document-backend`; copy audit. |
| F-1-12 | Kept install-and-reopen-offline wording without unexplained jargon. | `@claim:offline-reload`, `@claim:pwa-installable`. |
| F-1-13 | Kept explicit free ZIP, PDF, and JSON backup wording. | `@claim:free-exports`; copy audit. |
| F-1-14 | Kept the direct choose-and-edit checklist wording and product limits. | `@claim:configurable-checklists`; copy audit. |
| F-1-15 | Kept short README test documentation. | `.factory/copy-audit.md`. |
| F-1-16 | Kept short README deployment documentation. | Deployment verifier; copy audit. |
| F-1-17 | Kept the declared no-setup create/attach/export workflow. | `@claim:core-no-setup`. |
| F-1-18 | Kept the test proving license verification transmits only its token. | `@claim:license-verification-minimum-data`. |
| F-1-19 | Kept unverified image-generation provenance out of public footer copy. | Live footer screenshot; `.factory/design.md` remains the provenance record. |
| F-2-1 | Kept literal **Privacy** and **Terms** headings and route announcements. | `privacy and terms routes have semantic page titles`; live route check. |
| F-2-2 | Kept direct workspace task labels rather than botanical metaphors. | `uses task names throughout the sample workspace`; live demo check. |
| F-2-3 | Kept the declared no-account workflow. | `@claim:no-account-required`; live no-account ZIP export. |
| F-2-4 | Kept **payment trail** as the consistent checklist term. | `.factory/copy-audit.md`; `@claim:configurable-checklists`. |
| F-3-1 | Kept isolated demo-to-legal route focus, announcement, and Back behavior. | `keeps route focus and announcements in the isolated query demo`; live demo check. |
| F-4-1 | Header **Demo** now writes a route-focus marker before its intentional full-document transition. Initial load consumes it; `pageshow` and back/forward navigation focus the h1 and announce the destination. | `moves focus and announces after header Demo navigation and browser back`; live `routes.headerDemoFocus`, `headerDemoBackFocus`, and `headerDemoAnnouncement`. |
| F-4-2 | Added the `manifest-fingerprints` claim and unique browser test. It replaces a demo file with known bytes, exports a ZIP, reads `manifest.json`, and compares the complete SHA-256 to an independent Node digest. | `@claim:manifest-fingerprints`; `.factory/claims.json`; live ZIP workflow. |
| F-4-3 | Replaced the ambiguous footer label with visible **Source on GitHub ↗** and the accessible name **Source on GitHub (opens in a new tab)**. | `uses an explicit external-source label in every footer`; live `footer.sourceLabel` and `footer.newTab`. |
| F-4-4 | Made the designed 404 render the same Privacy, Terms, and disclosed GitHub Source footer links as application routes. | Static 404 test; live `routes.notFoundFooter`. |

The catalog description is now verb-first and 89 characters:
“Build local invoice packets, flag missing evidence, and export ZIP, PDF, or
JSON backups.”

## Live re-check

Opened <https://invoice-evidence-pack.sociobot.in> cold after deployment. The
first screen still gives the job, audience, and one-click `?demo=1` action.
The isolated demo banner, Reset demo, Start for real, route focus, manifest
fingerprints, 404 footer, legal pages, mobile layout, offline reload, and
same-origin request boundary all passed in the live check above.
