# Invoice Packet polish-3 handoff — 2026-09-02

## Outcome

**PASS.** The one remaining adversarial-review defect is repaired and no
earlier finding regressed. Repair code is commit
`ac7c9b5 fix: preserve demo route focus announcements`.

From `/?demo=1`, selecting **Privacy** now stays within the isolated demo
session, focuses the Privacy h1, and announces **Opened Privacy**. Browser
Back returns to the demo, focuses **Your packets**, and announces
**Opened Your packets**. The demo banner and `demo:invoice-packet` storage
namespace remain active throughout.

## What changed

- Removed the demo-only bypass from in-app `data-route` navigation.
- Registered `popstate` handling in demo mode as well as the normal workspace.
- Added the exact Playwright regression:
  `keeps route focus and announcements in the isolated query demo`.
- Extended `scripts/verify-live.mjs` to assert Demo → Privacy → Back focus,
  polite announcements, and retention of the demo banner.
- Updated the catalog description with a verb-first, 87-character sentence.

## Verification

- Fresh clone `/tmp/invoice-evidence-pack-clean-CnHhCy`: `npm ci` and every
  one of the 22 exact `.factory/claims.json` commands passed. This includes
  demo isolation, local-only request privacy, hashes, limits, missing flags,
  redaction, duplicate ZIPs, Unicode PDFs, backup/import, first-use offline
  exports, paid-tool fixtures, account-free use, PWA installability, free
  exports, no setup, and license minimum-data handling.
- Local: `npm test` passed 11 tests; `npm run check` and `npm run build`
  passed. `npm run test:e2e` and `npm run test:e2e:repeat` passed. The full
  browser suite includes serious/critical Axe checks, mobile, keyboard,
  privacy, and offline coverage.
- Local static-web-app emulator:
  `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174 .factory/evidence/polish-3/local`
  passed (646ms load, no console errors, title/lang/main/alt/button checks).
  `node scripts/verify-live.mjs http://127.0.0.1:4174 .factory/evidence/polish-3/local/live`
  passed, including the new demo-route regression.
- Mobile Lighthouse against the local production build:
  99 performance, 100 accessibility, 100 best practices, and 100 SEO;
  LCP 1.91s and CLS 0. The report is
  [lighthouse-mobile.json](evidence/polish-3/local/lighthouse-mobile.json).
- Deployed with `/opt/fleet/lib/deploy-static.sh invoice-evidence-pack dist`.
  Azure Static Web Apps deployment ID:
  `ab00d4df-6263-4d22-85bd-544ef4b3f220`.
- Live: `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
  passed policy and byte identity. The URL verifier passed with an 842ms cold
  load and no console errors. The live browser verification passed with no
  failed/external requests, no mobile overflow, no serious/critical Axe
  findings, successful offline reload, and the demo focus/Back/announcement
  regression all true. See
  [live-check.json](evidence/polish-3/live/live-check.json).

## Run and deploy

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

Deploy the generated `dist/` as the assigned static product only.

## Known gaps and next steps

None. The product intentionally keeps unverified new-license checkout hidden
until an operator validates the registered billing route; restoring an
existing license remains available and tested.
