# Invoice Packet review-4 handoff — 2026-09-02

## Outcome

**FAIL.** This was a read-only adversarial review. Product source was not
changed. The detailed report is in [review-4.md](review-4.md).

## Prior release verification

- Fresh install: `npm ci` passed with 0 reported vulnerabilities.
- Every one of the 22 exact `.factory/claims.json` commands passed; each
  declared claim has one tagged test.
- `npm test` passed 11/11; `npm run check` and `npm run build` passed;
  `npm run test:e2e` passed 43 tests with 17 expected project skips.
- Production identity and response policy passed:
  `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`.
- Live first-read/demo, create/export, invalid-input recovery, desktop/mobile,
  keyboard, reduced motion, Axe, privacy logs, headers/caching, PWA update,
  and offline first-use ZIP/PDF exports passed.
- Existing-license verification allowed 30 synthetic invalid-token requests;
  request 31 returned 429 with `Retry-After: 3`.

See [verification-13.md](verification-13.md) for exact evidence and hashes.

## Review-4 verification

- Fresh live checks at 390px and desktop confirmed the job, audience, and sample-data action on the first screen.
- The one-click demo opened populated sample data in `demo:invoice-packet`, kept its banner after Reset, and made same-origin requests only.
- All 22 exact claim commands passed from a clean clone. `npm test` (11/11), `npm run check`, `npm run build`, the full 60-test browser suite, `verify-url.sh`, and the live deployment verifier passed.
- Live routes, 404, metadata, request behavior, link status, and prior-finding repairs were checked.

## Run / verify

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

Deploy only `dist/` to the assigned static product.

## Known gaps / next steps

1. Header Demo navigation and browser Back leave focus on `body` and do not update the route announcement; this is blocking.
2. The public promise that fingerprints appear in manifests needs its own declared, observable export test.
3. Disclose the external/new-tab Source link and render the same footer links on the designed 404.
