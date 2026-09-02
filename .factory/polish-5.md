# Invoice Packet polish 5

Repair target: `e12e7a0f28c079d65997b1f78129af023278df68`  
Review source: `e1586d79c344a3aecc79b4af5d1f8cb2ec2ef7a7`  
Repair code: `cdf83ed`  
Production deployment: `264aead9-56ff-427b-9cab-33c6d3d48a70`

## Round 5 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Added the full-document route-focus marker to **Try it with sample data**. Arrival at `/?demo=1` focuses **Your packets** and writes **Opened Your packets** to the polite route announcer. | `moves focus and announces after the hero sample-data action`; `@claim:demo-sandbox`; live `demo.heroFocus` and `demo.heroAnnouncement` in [live-check.json](evidence/polish-5/live/live-check.json); [live mobile demo](evidence/polish-5/live/demo-mobile.png). |
| F-5-2 | Replaced the unprovable refund/charge relationship with the observable rule: a `revoked` verification verdict disables paid tools while free exports remain. Added a fixture-backed claim and browser test. | `@claim:license-revocation`; live `license.revocation` in [live-check.json](evidence/polish-5/live/live-check.json); <https://invoice-evidence-pack.sociobot.in/terms/>. |
| F-5-3 | Defined the offline rule precisely: a saved valid license remains active offline and is checked after reconnection. Reconnection now triggers verification. | `@claim:offline-license-verdict`; live `license.offlineVerdict` and `license.reconnectCheck`; `@claim:offline-reload`. |
| F-5-4 | Removed the merchant-of-record and refund-handling statement from Terms and the license dialog because checkout is disabled and that external policy is not sandbox-provable. | Live verifier asserts the phrases are absent from `/terms/`; `@claim:checkout-operator-gate`; <https://invoice-evidence-pack.sociobot.in/terms/>. |

## Earlier finding regression map

| Finding | Preserved change | Evidence |
| --- | --- | --- |
| F-1-1 | New checkout remains unavailable by default; existing-license restore remains usable. | `@claim:checkout-operator-gate`; `@claim:license-restore`; live license audit. |
| F-1-2 | In-app routes, full-document demo routes, Back, and the hero demo CTA focus and announce their h1. | Three route-focus browser tests; live `routes` and `demo` results. |
| F-1-3 | The static 404 keeps description, canonical, Open Graph, Twitter, and Apple-touch metadata. | `ships complete metadata for static routes and the designed 404 page`; live 404 metadata audit. |
| F-1-4 | The designed 404 keeps the literal **Page not found** h1 and recovery action. | Static 404 test; live unknown route returned HTTP 404. |
| F-1-5 | The hero caption directly explains invoice-and-evidence grouping. | [live mobile landing](evidence/polish-5/live/verify-url/screenshot-mobile.png); copy audit. |
| F-1-6 | The assurance heading remains **Storage and export privacy**. | Live landing screenshot; copy audit. |
| F-1-7 | Fingerprint assurance names exported manifest contents. | `@claim:manifest-fingerprints`; live landing screenshot. |
| F-1-8 | Portability assurance names ZIP, PDF, and JSON backup. | `@claim:free-exports`; `@claim:json-backup`; live landing screenshot. |
| F-1-9 | The release action remains **Restore an existing license**. | `@claim:checkout-operator-gate`; live landing screenshot. |
| F-1-10 | README opens with two short, packet-consistent sentences. | [copy audit](copy-audit.md). |
| F-1-11 | README describes browser storage and uploads without implementation jargon. | `@claim:local-only`; `@claim:no-document-backend`; copy audit. |
| F-1-12 | README uses install-and-reopen-offline wording. | `@claim:pwa-installable`; `@claim:offline-reload`. |
| F-1-13 | README names each free export. | `@claim:free-exports`; copy audit. |
| F-1-14 | README tells users to choose and edit a checklist and states the advice limit. | `@claim:configurable-checklists`; copy audit. |
| F-1-15 | README test documentation remains split into short sentences. | Copy-audit word-count check. |
| F-1-16 | README deployment documentation remains split into short sentences. | Copy-audit word-count check; live deployment verifier. |
| F-1-17 | Core create, attach, and export still needs no key or external service. | `@claim:core-no-setup`. |
| F-1-18 | License verification still sends only the license token. | `@claim:license-verification-minimum-data`. |
| F-1-19 | Public footer contains no unverified image-generation assertion. | Live footer screenshot; provenance remains in `.factory/design.md`. |
| F-2-1 | Legal h1 values remain literal **Privacy** and **Terms**. | Legal-route browser test; live route audit. |
| F-2-2 | Workspace labels remain direct task names. | `uses task names throughout the sample workspace`; [live demo](evidence/polish-5/live/demo-mobile.png). |
| F-2-3 | Account-free create and export remains declared and tested. | `@claim:no-account-required`; live `noAccount` result. |
| F-2-4 | README consistently uses **payment trail**. | Copy audit; `@claim:configurable-checklists`. |
| F-3-1 | Query-demo Privacy and Back retain h1 focus and announcements. | `keeps route focus and announcements in the isolated query demo`; live demo route audit. |
| F-4-1 | Header Demo and Back retain full-document h1 focus and announcements. | `moves focus and announces after header Demo navigation and browser back`; live route audit. |
| F-4-2 | ZIP manifests retain complete SHA-256 fingerprints for every attachment. | `@claim:manifest-fingerprints`. |
| F-4-3 | Every application footer labels GitHub and its new-tab behavior. | `uses an explicit external-source label in every footer`; live footer audit. |
| F-4-4 | The designed 404 retains the same Privacy, Terms, and disclosed Source links. | Static 404 test; live `routes.notFoundFooter`. |

## Verification

- Fresh clone: `/tmp/invoice-polish5-clean-3TSRiv`; `npm ci`; all 25 exact
  commands in `.factory/claims.json` passed.
- Fresh-clone gates: 11/11 unit tests, typecheck, production build, 52/72
  browser cases, and 104/144 repeat cases passed. Remaining cases are intended
  project skips. One earlier repeat process ended in a Chromium SwiftShader
  `SIGSEGV`; a new browser process completed the full repeat with no test
  failure.
- Playwright Axe covered desktop, 390px mobile, and both themes with zero
  serious or critical findings. The live mobile Axe check also returned none.
- Offline checks covered service-worker reload, first-use ZIP/PDF exports, and
  the isolated saved-license reconnection flow.
- Privacy checks recorded no third-party packet/demo requests. The explicit
  mocked license tests allow only the expected Sociobot verification origin.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices
  100, SEO 100; LCP 1.1 s, TBT 0 ms, CLS 0. Evidence: [JSON](evidence/polish-5/live/lighthouse-mobile.json).
- The fleet URL verifier reported an 851 ms cold load, no console errors, one
  h1, one main, complete alt text, and labelled buttons. Evidence: [result](evidence/polish-5/live/verify-url/verify.json).
- Deployment identity and policy passed for root, demo, Privacy, Terms,
  manifest, service worker, and immutable entry assets.

No review finding remains open.
