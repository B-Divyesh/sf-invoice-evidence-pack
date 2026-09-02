# Invoice Packet polish 3

Repair target: `4e69125c0e4674f4dd8427b718d75957b37a9e51`  
Review source: `6ee147f8e51d2de824c971e594ecad688f201ec5`  
Repair code: `ac7c9b5 fix: preserve demo route focus announcements`

## Evidence used throughout

- Clean clone: `/tmp/invoice-evidence-pack-clean-CnHhCy`, `npm ci`, then all
  22 exact commands declared in `.factory/claims.json` passed.
- Full local suite: `npm test`, `npm run check`, `npm run build`,
  `npm run test:e2e`, and `npm run test:e2e:repeat` passed.
- Production-shaped local check:
  `node scripts/verify-live.mjs http://127.0.0.1:4174 .factory/evidence/polish-3/local/live`
  passed. It includes mobile Axe, offline reload, request logging, 404, and
  the new demo-route regression.
- Live check: <https://invoice-evidence-pack.sociobot.in> passed
  `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`,
  `/opt/fleet/lib/verify-url.sh`, and `scripts/verify-live.mjs`.
  The live result is in [live-check.json](evidence/polish-3/live/live-check.json).
- Visual evidence: [local desktop](evidence/polish-3/local/screenshot-desktop.png),
  [local mobile](evidence/polish-3/local/screenshot-mobile.png),
  [live desktop](evidence/polish-3/live/screenshot-desktop.png), and
  [live mobile](evidence/polish-3/live/screenshot-mobile.png).

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept new checkout hidden unless an operator enables it after validating the registered billing route; the public path restores an existing license only. | `@claim:checkout-operator-gate`; live license dialog check in `live-check.json`. |
| F-1-2 | History navigation focuses `#route-heading` and writes `Opened {heading}` to the polite status region. This repair also extends the behavior to the demo namespace. | `moves focus and announces the destination for route navigation and browser back`; `keeps route focus and announcements in the isolated query demo`; live `routes.focus` and `demo.focus`. |
| F-1-3 | Kept complete metadata on the static 404 response. | `ships complete metadata for static routes and the designed 404 page`; live `routes.notFoundStatus` and `routes.metadata`. |
| F-1-4 | Kept the literal 404 heading **Page not found**. | Static 404 test; live `/not-a-real-route` check in `live-check.json`. |
| F-1-5 | Kept the explanatory hero caption: “One packet groups an invoice with its supporting evidence.” | Local and live screenshots; cold live first-screen check. |
| F-1-6 | Kept **Storage and export privacy** as the assurance heading. | Local and live screenshots; copy audit. |
| F-1-7 | Kept **File fingerprints in each manifest** as the fingerprint assurance label. | `@claim:sha256-hash`; screenshots. |
| F-1-8 | Kept **Download ZIP, PDF, or JSON backup** as the portability assurance label. | `@claim:free-exports`, `@claim:json-backup`; screenshots. |
| F-1-9 | Kept the result-naming release action **Restore an existing license**. | `@claim:checkout-operator-gate`, `@claim:license-restore`; live dialog check. |
| F-1-10 | Kept the short, packet-consistent README opening. | `.factory/copy-audit.md`; clean-clone claim run. |
| F-1-11 | Kept plain browser-storage and no-upload wording in README. | `.factory/copy-audit.md`; `@claim:no-document-backend`. |
| F-1-12 | Kept install-and-reopen-offline wording without unexplained jargon. | `.factory/copy-audit.md`; `@claim:offline-reload`, `@claim:pwa-installable`. |
| F-1-13 | Kept explicit free ZIP, PDF, and JSON export wording. | `.factory/copy-audit.md`; `@claim:free-exports`. |
| F-1-14 | Kept the direct choose-and-edit checklist wording and product limits. | `.factory/copy-audit.md`; `@claim:configurable-checklists`. |
| F-1-15 | Kept short README test documentation. | `.factory/copy-audit.md`. |
| F-1-16 | Kept short README deployment documentation. | `.factory/copy-audit.md`; live deployment verifier. |
| F-1-17 | Kept the declared no-setup claim and its observable create/attach/export test. | `@claim:core-no-setup`. |
| F-1-18 | Kept the declared license minimum-data request test. | `@claim:license-verification-minimum-data`. |
| F-1-19 | Kept unverified artwork provenance out of the public footer; provenance remains in repository documentation. | Footer in live screenshots; `.factory/design.md`. |
| F-2-1 | Kept literal **Privacy** and **Terms** route headings and announcements. | `privacy and terms routes have semantic page titles`; live `routes.privacy` and `routes.terms`. |
| F-2-2 | Kept task names in the workspace: Saved packets, Collect evidence, Evidence files, Notes for the reviewer, and Export the packet. | `uses task names throughout the sample workspace`; live `demo.taskLabels`. |
| F-2-3 | Kept the declared no-account claim and registration-free ZIP workflow. | `@claim:no-account-required`; live `noAccount`. |
| F-2-4 | Kept **payment trail** as the single README and product term. | `.factory/copy-audit.md`; `@claim:configurable-checklists`. |
| F-3-1 | Demo legal links now use in-app history navigation; demo mode also listens for `popstate`. Privacy and Back focus the new h1 and announce it without leaving the isolated demo database. | `keeps route focus and announcements in the isolated query demo`; live `demo.focus`, `demo.backFocus`, and `demo.routeAnnouncement` are all `true` in `live-check.json`. |

## Release result

The static deployment completed as Azure Static Web Apps deployment
`ab00d4df-6263-4d22-85bd-544ef4b3f220`. Cold production checks confirmed the
demo banner and isolation, reset, exact route-focus regression, Privacy and
Terms metadata, designed 404, no-account export, mobile layout, offline
reload, request privacy, and zero console errors.
