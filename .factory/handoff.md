# Invoice Packet review 8 handoff — PASS

Candidate `a1b1c30a909ad09c846f969c6978fdeaf1aa5abe` remains accepted at <https://invoice-evidence-pack.sociobot.in>. Documentation review commit: `25db64c14ce819f6f4338f849f4a83120e3dd643`.

Invoice Packet is an offline-first PWA for cross-border freelancers and tiny firms assembling one invoice with its work proof, payment proof, notes, and a configurable checklist. It stores packet files locally, flags missing required evidence, hashes files, and exports ZIP, PDF, and JSON backups. The demo is available at `/?demo=1` and uses the separate `demo:invoice-packet` IndexedDB namespace.

## Review 8 completed

- All 28 declared claims passed when each documented command ran separately from a clean checkout.
- `npm test` passed (11/11), `npm run check` passed, `npm run build` produced `dist/`, and the complete Playwright run passed (78 project entries; 21 intentional mobile skips for Chromium-only export tests).
- Production bytes match the candidate for the app shell, hashed assets, PWA files, demo, Privacy, and Terms pages. Response policy and cache headers passed.
- Fresh desktop and phone views state the job, audience, and sample action before scrolling. The sample has a persistent label, resets, and remains isolated from real data.
- Live normal-flow request logging found no third-party request, analytics, document backend, page error, console error, or failed request. Free packet export works without an account.
- Fresh desktop and 390px AxeBuilder checks found zero violations. Keyboard route focus, reduced motion, offline reload, 404 structure, manifest, and mobile layout passed.

Full review evidence and command results: [review-8.md](review-8.md). Previous independent verification: [verification-17.md](verification-17.md).

## Run and verify

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
npm run verify:live -- https://invoice-evidence-pack.sociobot.in .factory/evidence/review-8/live
```

## Known gaps

None in the product. New-license checkout is intentionally operator-gated; restoring a valid existing license and all free core exports remain available.
