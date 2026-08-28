# Invoice Packet verification handoff — 2026-08-28

## Outcome: **FAIL**

Candidate `66a17f1fc03b27e1ac77ebe7227e981a11fb8387` was independently tested from a clean detached clone and matched live <https://invoice-evidence-pack.sociobot.in> byte-for-byte for the shell, initial assets, service worker, manifest, and legal pages.

The browser product passes its core local-first workflow, PWA offline reload, privacy review, accessibility checks, mobile/keyboard checks, production response policy, and performance budgets. `npm ci`, audit, unit tests, type check, exact production build, and Playwright E2E suite all passed.

Release acceptance fails because the required Sociobot license-verification endpoint does not rate limit. A 40-request burst (concurrency 10) and a 100-request burst (concurrency 25) both returned only HTTP 200 responses—no HTTP 429 and no `Retry-After` header. This is an external billing API defect, but it is an explicit acceptance requirement for this product's server-side endpoint.

## How to verify

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

For complete evidence, artifact hashes, functional cases, and the exact rate-limit reproduction, see `.factory/verification-4.md`.

## Known limits

No real payment, production license, sign-in account, Safari, or Firefox installed-PWA session was created. These are not the cause of the FAIL.
