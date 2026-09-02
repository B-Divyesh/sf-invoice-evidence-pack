# Invoice Packet polish 7 handoff — PASS

## Outcome

All eight findings in [review-7.md](review-7.md) are fixed and release-checked.
The repair code is commit `de3ffef` (`fix: close review seven findings`), pushed
to `main` and deployed to
https://invoice-evidence-pack.sociobot.in. The full finding-to-evidence map is
in [polish-7.md](polish-7.md).

The product remains a static, offline-first Vite PWA. `?demo=1` enters the
separate `demo:invoice-packet` IndexedDB workspace, shows its persistent demo
banner, and never writes normal packet data.

## What changed

- Narrowed backups to packets and templates and tested their exact JSON scope.
- Added checklist item editing with reload persistence.
- Made password non-storage, template file exclusion, and deletion behavior
  explicit registered claims with browser tests.
- Used **checklist** and **PDF manifest** consistently on the landing page.
- Rewrote the README checkout sentence with the exact product identity and
  clear scope.
- Updated the catalog description to the verb-first, 108-character sentence:
  “Build invoice packets, flag missing evidence, and export ZIP, PDF, or JSON
  backups of packets and templates.”

## Verification

Fresh clone: `/tmp/invoice-polish7-clean.1qxubk` at `de3ffef`.

- `npm ci` — passed, 0 vulnerabilities.
- Every one of the 28 exact commands in `.factory/claims.json` — passed.
- Claim-tag audit — each of the 28 identifiers occurs in exactly one test.
- `npm test` — 11/11 passed.
- `npm run check` — passed.
- `npm run build` — passed; `dist/index.html` is present. Initial JS is
  15.09 KB gzip and CSS is 5.49 KB gzip.
- `npm run test:e2e` — 78-case run, Playwright `status: passed`, no failed
  tests (desktop and 390 px projects, with intentional project skips).
- Local Static Web Apps host: `npm run verify:deployment`, `npm run
  verify:live`, and `/opt/fleet/lib/verify-url.sh` — passed. Evidence is in
  [evidence/polish-7/local](evidence/polish-7/local).
- Production: the same deployment, live, and URL checks — passed. The live
  check reports no console errors, failed requests, or external requests;
  404 is HTTP 404; offline demo reload, route focus, mobile Axe, and demo
  isolation pass. Evidence is in [evidence/polish-7/live](evidence/polish-7/live).
- Cold production finding check — all F-7-1 through F-7-8 passed in
  [review-7-cold-check.json](evidence/polish-7/live/review-7-cold-check.json).
- Mobile Lighthouse on production — Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1,140.509 ms, CLS 0, TBT 0. Report:
  [lighthouse-mobile-full.json](evidence/polish-7/live/lighthouse-mobile-full.json).

## Run and deploy

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
npm run verify:live -- https://invoice-evidence-pack.sociobot.in .factory/evidence/polish-7/live
```

Deploy the built `dist/` directory through the factory static deployment work
order. Do not add analytics, document storage, or third-party font/script
dependencies.

## Known gaps

None. New-license checkout remains deliberately operator-gated; restoring an
existing license, free exports, and all core offline work remain available.
