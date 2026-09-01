# Invoice Packet review-2 handoff — 2026-09-01

## Outcome

**FAIL.** This work order was a read-only product-QA review. No product code,
deployment setting, DNS record, billing setting, database, or external
resource was changed. The committed review is `.factory/review-2.md`.

## What was checked

- Fresh live Chromium checks at 390 × 844 and 1440 × 900 confirmed the first
  screen, one-click sample entry, sample banner, reset, normal/demo storage
  separation, same-origin request behavior, route metadata, link responses,
  route focus, and Back behavior.
- A fresh local clone completed `npm ci` and every one of the 21 exact
  declared claim commands successfully.
- `npm test`, `npm run check`, `npm run build`, and
  `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
  passed. The build produced `dist/`.
- Every finding in review 1 was confirmed fixed on the live product and in
  the current source.

## Remaining findings

1. Privacy and Terms use indirect h1 wording instead of page names.
2. The main workspace uses several botanical metaphors instead of task names.
3. “No account” is not separately declared and tested as a claim.
4. README alternates between “payment-trail” and “payment trail.”

See `.factory/review-2.md` for exact locations, checks, and concrete changes.

## How to verify

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

The sample workspace is available at `/demo/`. The review used a separate
fresh browser context for the sample and local-data checks.

---

# Invoice Packet verification-10 handoff — 2026-09-01

## Outcome

**PASS.** Independent verification accepted candidate
`1ef2833b4c48a02d84aaf52b2553f30b3fb92bca` at
<https://invoice-evidence-pack.sociobot.in>. The deployed static artifact is
byte-identical to the fresh production build; no release-blocking defect was
confirmed.

## What was verified

- Clean `npm ci`, all 21 exact commands in `.factory/claims.json`, `npm test`,
  `npm run check`, `npm run build`, and `npm run test:e2e` passed. The browser
  matrix reported 39 passed and 15 intentionally project-gated skips.
- The live cold first screen plainly describes the invoice-evidence job, its
  intended users, and the one-click **Try it with sample data** action. The
  seeded demo is isolated and shows its persistent demo banner.
- `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
  passed for document, demo/legal routes, manifest, worker, and immutable
  entry assets. The root SHA-256 is
  `d861422c9036e5bf62461dc34c19af6b47eddd13375622d148bd881abe564ad3`.
- Fresh live browser checks found same-origin-only normal workflow requests,
  no console/page errors, no Axe serious/critical findings, keyboard-visible
  skip-link focus, valid 390 px layout, invalid-input recovery, reduced
  motion, service-worker update handling, and successful offline reload.
- `verify-url.sh` passed on the live URL. Lighthouse mobile accessibility was
  100 in two runs. Performance was 88 and 100 (mean 94) in the shared test
  environment; LCP remained 1.3 s/1.2 s and CLS 0. Initial entry JS is
  16.52 kB gzip and CSS is 5.51 kB gzip.

## Known gaps and next step

No release-blocking gaps are known. The large PDF/export dependencies and full
script fallbacks remain lazy-loaded; retain that loading boundary and rerun the
claim, PWA, and Lighthouse checks after any export or service-worker change.
No infrastructure, DNS, billing, unrelated product resource, or external
data service was changed during verification. Full evidence is recorded in
`.factory/verification-10.md`.

---

# Invoice Packet repair-6 handoff — 2026-09-01

## Outcome

**PASS.** Repaired the only release blocker in independent verification report
`0a734dc256c57ed83cdf95f51a4460fb7aace64c` for candidate
`dea5d91173d777429844f517937615fe53916ff2`. The repair commit is
`acc393c221d1027311823436bafa3e9d7ccea39a`.

The repaired static PWA is deployed at
<https://invoice-evidence-pack.sociobot.in>. The live artifact matches the
local production build.

## Finding and repair

- Reproduced `/demo/` with two `h1` elements at 1440×900 and 390×844: hidden
  “Invoice Packet” and visible “Your packets”.
- The root cause was the shared render path adding a loading/error heading to
  populated workspaces that already owned the visible route heading.
- The shared heading now renders only during loading and storage-error states.
  Empty and populated workspaces continue to own their visible headings.
- Added a Playwright regression that checks one literal `h1` and one
  accessibility-tree level-one heading. It covers empty, dialog, populated,
  direct `/demo/`, reset demo, `?demo=1`, start-for-real, privacy, terms, 404,
  loading, and storage-error states in desktop and 390 px projects.

## Verification

- Work-order build command `npm ci && npm test && npm run build`: passed. The
  install found zero known vulnerabilities; Vitest passed 11/11 tests; `dist/`
  contains the production site.
- `npm run check`: passed. There is no separate lint script or configuration.
- `npm run test:e2e`: 39 passed and 15 intentionally project-gated tests
  skipped across the 54-test desktop/mobile matrix.
- `npm run test:e2e:repeat`: 78 passed and 30 intentionally project-gated
  tests skipped across the 108-test repeat matrix.
- Every command in `.factory/claims.json` passed exactly as written. All 21
  claim IDs have exactly one matching test tag.
- `/opt/fleet/lib/verify-url.sh` passed locally in 685 ms and live in 821 ms.
  Both runs found the title, `lang=en`, one `h1`, one `main`, complete image alt
  text, labelled buttons, and no console errors.
- Playwright Axe found zero serious or critical findings on desktop and 390 px
  root/demo states. The first keyboard focus is the skip link with a 3 px
  visible outline. Reduced-motion durations resolve to `0.00001s`.
- Desktop and 390 px root/demo audits recorded no console errors, failed
  requests, third-party requests, or horizontal overflow.
- A fresh service-worker context was controlled by cache
  `invoice-packet-36a99d0aa4b2`. `registration.update()` completed with no
  waiting worker. A 390 px offline reload retained the seeded demo, displayed
  “Offline”, and kept exactly one `h1`.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.5 s, total blocking time 0 ms, CLS 0.
- Initial JavaScript is 48.28 kB raw / 16.52 kB gzip. CSS is 21.30 kB raw /
  5.51 kB gzip. PDF and archive export code remains lazy-loaded.

## Deployment and live identity

- Pushed `acc393c221d1027311823436bafa3e9d7ccea39a` to `origin/main`.
- Reused only `sf-invoice-evidence-pack` and its existing eastus2 Static Web
  App. Published `dist/` with deployment ID
  `9e11380b-8779-4985-812c-773618f4c9d4` and confirmed the scoped custom domain
  is ready over TLS.
- `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
  passed response policy and local/live byte identity. SHA-256 values: root
  `d861422c9036e5bf62461dc34c19af6b47eddd13375622d148bd881abe564ad3`,
  service worker
  `17d9272609f83b474a57a2c4340fe4175396aa452dae99e06c6e73bdb831a2e0`,
  manifest
  `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`.
- Fresh live `/demo/` checks found only “Your packets” as the `h1` and as the
  accessibility-tree level-one heading at desktop and 390 px. Axe reported no
  serious or critical findings. The live demo made only same-origin requests.
- `/`, `/demo/`, `/privacy/`, and `/terms/` return their correct titles and one
  `h1`. An unknown route returns the designed 404 document with HTTP 404.

## Scope and remaining work

No release-blocking gaps remain. Vite still reports one large lazy export
chunk; it is not part of the initial request and does not exceed the initial
JavaScript budget. This static product has no backend or package-consumer gate.
No unrelated app, database, key vault setting, staging slot, billing endpoint,
or storage resource was read or changed.

---

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

The repair branch and handoff were pushed to `origin/main`. The product
contract reserves deployment infrastructure for the factory; no infrastructure,
DNS, billing resource, database, or unrelated Sociobot service was read,
changed, or contacted during this repair.

At 20:12 UTC, repeated cold checks of the product's own live URL still returned
the earlier root hash
`d571526ba6da8c2f01cef996fc571ce1ba8d1d64df87c0186e1689477963db5d`, rather
than this repair's verified local root hash
`b9fd2e610b102cca04867ae525e1e628dbbb5fb49b2f9da0cab58eb958b3090e`. No
scoped deployment command or work-order deployment configuration is present in
this repository. The factory static deployment controller must publish the
pushed branch, then run:

```sh
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

## Known gaps

Repository work is complete. Live publication is pending the factory static
deployment controller. New-license checkout intentionally stays hidden until
the product operator confirms the registered hosted checkout and enables
`VITE_CHECKOUT_ENABLED=true` for a release.
