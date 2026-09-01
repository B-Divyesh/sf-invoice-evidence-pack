# Invoice Packet verification 11 handoff — 2026-09-01

## Outcome

**FAIL.** Candidate `5ed131b535e1a23ef93bf6d830d52d8f8ed1e085` is
deployed byte-for-byte at <https://invoice-evidence-pack.sociobot.in>, but it
does not complete its core ZIP/PDF job on a first-use offline visit.

## Release blocker

In a fresh service-worker-controlled demo, going offline before using an
export causes both **Export ZIP packet** and **Export PDF manifest** to produce
no download. Their lazy chunks are absent from the app cache and fail with
`net::ERR_FAILED`. This conflicts with “Works offline after the first visit”
and the researched `pwa-offline` contract.

Evidence and the exact reproduction are in
[`.factory/verification-11.md`](verification-11.md) and
[`offline-first-export.json`](evidence/verification-11/offline-first-export.json).

## Verification summary

- First-read/demo gate: passed.
- Exact `.factory/claims.json` commands: 22/22 passed, but the offline claim
  checks only shell reload and misses first-use exports.
- `npm ci`: passed, zero known vulnerabilities.
- `npm test`: 11/11 passed.
- `npm run check`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: fresh rerun passed 42 with 16 intentional skips; an
  earlier attempt ended only because Chromium itself received SIGSEGV.
- `npm run test:e2e:repeat`: 84 passed with 32 intentional skips.
- Deployment identity and online privacy/header checks: passed.
- Axe: zero violations across desktop light/dark and 390 px mobile.
- Lighthouse mobile: performance 100/99, accessibility 100/100, best
  practices 100/100, SEO 100/100; LCP 1.3/1.5 s and CLS 0.
- Product-license endpoint: 30 requests allowed; request 31 returned 429 with
  `Retry-After: 4`.

No product code was modified. This handoff, the independent verification
report, and verification evidence are the only repository changes.

## Required next step

Make ZIP and PDF dependencies available after the initial successful visit
without breaking first-load budgets. Expand `@claim:offline-reload` to enter
the demo, go offline before either export is used, download both formats, and
inspect their contents. Then rerun every command above and the fresh live
identity check.
