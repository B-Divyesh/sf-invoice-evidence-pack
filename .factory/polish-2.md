# Invoice Packet polish 2

Repair target: `1ef2833b4c48a02d84aaf52b2553f30b3fb92bca`  
Review source: `fcca08f4a8895d8c8f618173f9061f03be4051cf`  
Repair code commit: `7c91384a616cc5abff44349403643796bad9000e`

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Replaced the indirect legal h1 text with literal **Privacy** and **Terms** headings. Route announcements now repeat those page names. | `privacy and terms routes have semantic page titles`; `moves focus and announces the destination for route navigation and browser back`; live `routes` result in `.factory/evidence/polish-2/live/live-check.json` |
| F-2-2 | Replaced every task-facing botanical metaphor with Saved packets, New packet, Packet details, Evidence files, Collect evidence, Notes for the reviewer, and Export the packet. The botanical palette, paper layout, artwork, and shape language remain. | `uses task names throughout the sample workspace`; [desktop evidence](evidence/polish-2/live/demo-desktop.png); [mobile evidence](evidence/polish-2/live/demo-mobile.png); live `taskLabels: true` |
| F-2-3 | Added `no-account-required` to `.factory/claims.json` and a unique browser test that creates a packet, attaches evidence, and downloads its ZIP without registration or sign-in. | `@claim:no-account-required`; live `noAccount` result in `.factory/evidence/polish-2/live/live-check.json` |
| F-2-4 | Changed the README and claim wording to the single user-facing term **payment trail**. The hyphenated string remains only as the internal template ID. | `@claim:configurable-checklists`; `rg` terminology audit; `.factory/copy-audit.md` |

## Controller additions

| Requirement | Change made | Evidence |
| --- | --- | --- |
| One-click `?demo=1` sample | The first-screen action now links to `/?demo=1`. It opens the seeded workspace with a persistent banner, Reset demo, and Start for real. Reset restores the original sample. | `@claim:demo-sandbox`; `renders exactly one h1 on every route and stable workspace state`; live `demo` result and screenshots |
| Real demo isolation | Query and path demo entries use `demo:invoice-packet`; normal data uses `invoice-packet`. The claim test verifies the normal database remains empty during the one-click sample flow. | `@claim:demo-sandbox`; `@claim:local-only`; `.factory/demo.md` |
| Complete claims inventory | Added the missing no-account claim. All 22 IDs have exactly one matching `@claim:<id>` tag, and every declared command passed from the clean clone. | Clean-clone 22/22 claim run; `.factory/claims.json` |
| Catalog copy | Updated the catalog description to a 102-character verb-first sentence. | `.factory/catalog-description.txt`; character-count check |

## Review 1 regression map

| Finding | Preserved fix | Evidence |
| --- | --- | --- |
| F-1-1 | Default release still hides unproven checkout and supports existing-license restore only. | `@claim:checkout-operator-gate`; `@claim:license-restore` |
| F-1-2 | History navigation and Back focus the h1 and update the polite route announcement. | `moves focus and announces the destination for route navigation and browser back`; live `focus` and `backFocus` |
| F-1-3 | The 404 retains description, canonical, Open Graph, Twitter, and Apple-touch metadata. | `ships complete metadata for static routes and the designed 404 page`; live 404 metadata result |
| F-1-4 | The 404 h1 remains **Page not found**. | Static metadata/404 test; live `notFoundStatus: 404` |
| F-1-5 | The hero caption explains that one packet groups an invoice and evidence. | Landing screenshot in `.factory/evidence/polish-2/screenshot-mobile.png` |
| F-1-6 | Assurance heading remains **Storage and export privacy**. | Landing screenshot; copy audit |
| F-1-7 | Fingerprint assurance names the manifest. | Landing screenshot; `@claim:sha256-hash` |
| F-1-8 | Portability assurance names ZIP, PDF, and JSON backup. | Landing screenshot; `@claim:free-exports`; `@claim:json-backup` |
| F-1-9 | The released action remains **Restore an existing license**. | `@claim:checkout-operator-gate`; `@claim:license-restore` |
| F-1-10 | README opens with two short, packet-consistent sentences. | `.factory/copy-audit.md` |
| F-1-11 | README describes browser storage and no uploads without implementation jargon. | `.factory/copy-audit.md`; `@claim:no-document-backend` |
| F-1-12 | README says install and reopen offline, without the PWA acronym. | `@claim:pwa-installable`; `@claim:offline-reload` |
| F-1-13 | README names the free ZIP, PDF, and JSON exports. | `@claim:free-exports` |
| F-1-14 | README tells readers to choose and edit a checklist. | `@claim:configurable-checklists` |
| F-1-15 | README test documentation remains split into short sentences. | `.factory/copy-audit.md` |
| F-1-16 | README deployment documentation remains split into short sentences. | `.factory/copy-audit.md`; deployment verifier |
| F-1-17 | Core create/attach/export works without an API key or external service. | `@claim:core-no-setup` |
| F-1-18 | License verification sends only the license query parameter and an empty body. | `@claim:license-verification-minimum-data` |
| F-1-19 | No unlinked artwork-generation claim appears in the public footer. | Footer screenshot; source text audit |

## Full verification evidence

- Fresh clone: `/tmp/invoice-polish2-j2MxlI`, 22/22 exact claim commands.
- Unit/type/build: 11/11 tests, `npm run check`, and `npm run build` passed.
- Browser: 42 passed / 16 gated skips; repeat 84 passed / 32 gated skips.
- Accessibility: zero serious/critical Axe findings in both themes and at
  desktop/mobile widths. `verify-url.sh` found one h1, one main, complete alt
  text, labelled buttons, and no console errors.
- Privacy/offline: live audit found no external or failed requests and reloaded
  the service-worker-controlled demo offline.
- Performance: mobile Lighthouse 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.5 s, TBT 10 ms, CLS 0.
- Live identity: root, worker, manifest, demo, Privacy, and Terms match `dist/`.
  Live URL: <https://invoice-evidence-pack.sociobot.in>.
