# Invoice Packet polish-1 handoff — 2026-09-01

## Outcome

Repaired every finding in review 1 for release candidate
`057597d9c102a8901b4d86ff068b45d189814009`. The product remains a static,
local-first PWA that builds to `dist/`.

Repair commit: `7f58b9b0e8328bdf3e2cefb5e213b9c0d08a8e2e`.

## Delivered

- Replaced the unproven new-customer checkout promise with an honest,
  operator-gated build flag. The released default has no checkout link and
  gives existing license holders a tested restore path.
- Added route-specific metadata, real internal History API navigation, heading
  focus, and polite announcements for route changes and browser Back.
- Completed the styled 404 document metadata, changed its heading to `Page not
  found`, and added consistent navigation and legal footer links.
- Rewrote all review-flagged landing and README copy. The updated copy audit is
  in `.factory/copy-audit.md`; the catalog description is verb-first and 88
  characters.
- Replaced the checkout claim with `license-restore` and
  `checkout-operator-gate`; added claims/tests for clean core setup and the
  minimal license-verification payload. There are 21 declared claims.
- Recorded each review finding, change, and evidence in
  `.factory/polish-1.md`.

## Verification

From a clean dependency install:

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
```

All commands passed.

- Unit suite: 11/11 passed.
- Full browser suite: 48/48 passed; repeat suite: 96/96 passed.
- Every exact command in `.factory/claims.json` passed, covering all 21 claim
  IDs from clean state.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174
  .factory/evidence/local` passed: 638 ms local cold load, zero console errors,
  title/lang/main/one-h1/alt/button checks passed. Screenshots and JSON output
  are committed under `.factory/evidence/local/`.
- Playwright Axe checks in the suite found zero serious or critical issues on
  desktop/mobile, empty/editor, and both themes. The standalone Axe CLI could
  not locate a Selenium Chrome binary in this container; the pinned Playwright
  Axe integration completed successfully.
- `npm run verify:deployment -- http://127.0.0.1:4174` passed response-policy
  and byte-identity checks. The root hash was
  `b9fd2e610b102cca04867ae525e1e628dbbb5fb49b2f9da0cab58eb958b3090e`.
- Initial entry JavaScript is 48.30 kB raw / 16.53 kB gzip; CSS is 21.30 kB raw
  / 5.51 kB gzip. Export code remains lazy-loaded.

## Deployment

The repository is ready to publish as the existing static `dist/` artifact.
The product contract reserves deployment infrastructure for the factory; no
infrastructure, DNS, billing resource, database, or unrelated Sociobot service
was read, changed, or contacted during this repair. Push the committed `main`
branch through the factory static deployment controller, then run:

```sh
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

## Known gaps

None in the repository release scope. New-license checkout intentionally stays
hidden until the product operator confirms the registered hosted checkout and
enables `VITE_CHECKOUT_ENABLED=true` for a release.
