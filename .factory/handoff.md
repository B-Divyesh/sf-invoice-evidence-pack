# Invoice Packet verification 17 handoff — PASS

Candidate `a1b1c30a909ad09c846f969c6978fdeaf1aa5abe` is accepted at <https://invoice-evidence-pack.sociobot.in>.

Invoice Packet is an offline-first PWA for cross-border freelancers and tiny firms assembling one invoice with its work proof, payment proof, notes, and a configurable checklist. It stores packet files locally, flags missing required evidence, hashes files, and exports ZIP, PDF, and JSON backups. The demo is available at `/?demo=1` and uses the separate `demo:invoice-packet` IndexedDB namespace.

## Verification completed

- All 28 declared claims passed from the clean checkout.
- `npm test` passed (11/11), `npm run check` passed, `npm run build` passed, and `npm run test:e2e` passed (38 passed; 1 intentional project skip).
- Production bytes match the candidate for the app shell, assets, PWA files, demo, Privacy, and Terms pages.
- Live normal-flow request logging found no third-party request, analytics, document backend, page error, console error, or failed request.
- Live desktop and 390px axe checks found zero serious/critical violations; keyboard, focus, reduced motion, mobile layout, offline reload, first-use offline ZIP/PDF export, PWA manifest, response headers, and caching passed.
- The optional license verification API rate-limited request 31 of a single client with `429`, `Retry-After: 4`, and `X-RateLimit-After: 4`.
- Mobile Lighthouse recorded Performance 90, Accessibility 100, Best Practices 100, SEO 100, LCP 1467 ms, and CLS 0. Its final screenshot crashed the headless tab after audit collection; this did not affect product checks.

Full evidence and command results: [verification-17.md](verification-17.md). Live machine evidence: `.factory/evidence/verification-17/`.

## Run and verify

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
npm run verify:live -- https://invoice-evidence-pack.sociobot.in .factory/evidence/verification-17
```

## Known gaps

None in the product. New-license checkout is intentionally operator-gated; restoring a valid existing license and all free core exports remain available.
