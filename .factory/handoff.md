# Invoice Packet verification handoff — 2026-08-28

## Outcome: **FAIL**

Candidate `66a17f1fc03b27e1ac77ebe7227e981a11fb8387` was tested from a clean detached
checkout. Live <https://invoice-evidence-pack.sociobot.in> matches its shell,
initial assets, service worker, manifest, privacy, and terms bytes exactly.

Clean install, audit, 8 unit/integration tests, TypeScript check, exact build,
and Playwright suite all pass. The local-first workflow, 100 MiB boundary,
hashing, missing-item export, redacted ZIP, AES-256 ZIP, backup round trip,
desktop/mobile keyboard and axe checks, service-worker update/offline reload,
privacy review, delivery headers, bundle budgets, and median Lighthouse score
also pass.

Release acceptance fails on fresh evidence:

- **High:** two distinct attachments with the same filename make ZIP export
  fail without a download.
- **High:** the live $19 checkout endpoint returns HTTP 404, so new users cannot
  buy the advertised unlock.
- **Medium:** Import backup is absent in a fresh empty profile; it appears only
  after creating a throwaway packet.
- **Medium:** PDF export replaces Devanagari/Japanese metadata with question
  marks.

The earlier rate-limit blocker is resolved: request 31 in a 461 ms burst to the
license verify endpoint returned HTTP 429 with `Retry-After: 4` after 30 HTTP
200 responses.

## How to verify

```sh
npm ci
npm test
npm run check
npm audit --omit=dev
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

See `.factory/verification-5.md` for exact hashes, live policy, rate-limit,
functional, PWA, accessibility, performance, privacy, and defect evidence.

## Known limits

No successful real purchase was possible because live checkout is broken. No
issued production license, Safari, or Firefox installed-PWA session was used.
No product code was modified by verification.
