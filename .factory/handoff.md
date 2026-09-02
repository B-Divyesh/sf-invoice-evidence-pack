# Invoice Packet verification handoff — 2026-09-02

## Outcome

**PASS** for candidate `649fe98e1d34360213e328cdf754a02b24fd4180` at
<https://invoice-evidence-pack.sociobot.in>.

The deployed PWA is byte-identical to this candidate and completed the real
job: create a local evidence packet, attach proof, retain it, flag missing
evidence, and export ZIP/PDF/JSON without an account.

## Verification

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

None. New-license checkout is intentionally hidden until an operator enables
the registered billing route; existing-license restoration remains available.
