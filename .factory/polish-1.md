# Invoice Packet polish 1

Repair target: `057597d9c102a8901b4d86ff068b45d189814009`  
Review source: `8278ef41245498a9e0b378588c550ff3b3700b89`

All checks below ran against a clean `npm ci` installation. Local visual
evidence is in `.factory/evidence/local/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Removed the unproven hosted-checkout availability promise. Checkout is now disabled unless the operator sets `VITE_CHECKOUT_ENABLED=true`; the released build says purchases are unavailable and provides a working existing-license restore path. | `@claim:checkout-operator-gate`, `@claim:license-restore` (both passed); `.factory/evidence/local/screenshot-desktop.png` |
| F-1-2 | Internal normal-workspace links now use History API navigation. Every route render focuses its `h1` and updates the persistent polite announcement; Back uses the same path. | `moves focus and announces the destination for route navigation and browser back` (passed) |
| F-1-3 | Added description, canonical, Open Graph, Twitter, Apple touch icon, and social-card metadata to the static 404. Static legal/demo documents now also receive route-specific metadata at build time. | `ships complete metadata for static routes and the designed 404 page` (passed) |
| F-1-4 | Changed the 404 heading to `Page not found` and retained the recovery link. | Static metadata/404 browser test (passed) |
| F-1-5 | Replaced the hero caption with `One packet groups an invoice with its supporting evidence.` | `.factory/evidence/local/screenshot-mobile.png` |
| F-1-6 | Changed the assurance heading to `Storage and export privacy`. | `.factory/evidence/local/screenshot-mobile.png` |
| F-1-7 | Changed the assurance label to `File fingerprints in each manifest`. | `.factory/evidence/local/screenshot-mobile.png` |
| F-1-8 | Changed the assurance label to `Download ZIP, PDF, or JSON backup`. | `.factory/evidence/local/screenshot-mobile.png` |
| F-1-9 | Replaced the paid-tools action with `View encrypted-export options` when operator-enabled; the released build uses `Restore an existing license`. Price is no longer used as action text. | `@claim:checkout-operator-gate` (passed) |
| F-1-10 | Rewrote the README opening as two packet-consistent, plain sentences. | `.factory/copy-audit.md` |
| F-1-11 | Rewrote README storage language in terms of this browser and uploads. | `.factory/copy-audit.md`; `@claim:no-document-backend` (passed) |
| F-1-12 | Replaced the PWA acronym with install-and-reopen-offline language. | `.factory/copy-audit.md`; `@claim:pwa-installable` and `@claim:offline-reload` (passed) |
| F-1-13 | Named the free exports directly. | `.factory/copy-audit.md`; `@claim:free-exports` (passed) |
| F-1-14 | Replaced the abstract configuration wording with choose-and-edit checklist wording and the clear advice limit. | `.factory/copy-audit.md`; `@claim:configurable-checklists` (passed) |
| F-1-15 | Split README test documentation into short sentences. | `.factory/copy-audit.md` |
| F-1-16 | Split README deployment documentation into short sentences. | `.factory/copy-audit.md`; `npm run verify:deployment -- http://127.0.0.1:4174` (passed) |
| F-1-17 | Added `core-no-setup` to claims and a browser test that creates, attaches, exports, and records no external request. | `@claim:core-no-setup` (passed) |
| F-1-18 | Added `license-verification-minimum-data` and an intercepted request test that proves the sole query parameter is `license` and the request body is empty. | `@claim:license-verification-minimum-data` (passed) |
| F-1-19 | Removed the unlinked artwork-generation claim from the public footer. The documented provenance remains in `.factory/design.md`. | Footer screenshot; `.factory/copy-audit.md` |

Earlier verification findings were rechecked by the full repeat browser suite:
immutable response policy, manifest MIME, keyboard focus, trimmed required
fields, 44px controls, duplicate ZIP names, backup import, Unicode PDFs,
offline cache scope, malformed backup recovery, and MiB labels all remain
covered by passing tests.

## Verification summary

- `npm ci`, `npm test`, `npm run check`, and `npm run build` passed.
- `npm run test:e2e` passed; `npm run test:e2e:repeat` passed.
- Every command declared by `.factory/claims.json` passed from the clean
  install, including all 21 browser/unit claim IDs.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174 .factory/evidence/local`
  passed: 638 ms load, no console errors, title/lang/main/one h1/alt/button
  checks passed.
- Playwright Axe checks passed in the full suite for empty/editor, desktop,
  mobile, and both color themes. The external Axe CLI could not start its own
  Selenium Chrome binary in this container; the pinned Playwright Axe run is
  the authoritative accessibility result.
- `npm run verify:deployment -- http://127.0.0.1:4174` passed.
