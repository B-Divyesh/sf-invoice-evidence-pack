# Invoice Packet verification handoff — 2026-09-02

## Outcome

**PASS** for candidate `4e69125c0e4674f4dd8427b718d75957b37a9e51` at
<https://invoice-evidence-pack.sociobot.in>.

Independent verification found no defect. The deployed files match the fresh
production build. The verification-11 blocker is closed: first-use ZIP and PDF
exports now work after a fresh visit, offline transition, and offline reload.
Both downloads were independently inspected.

No product source was changed during verification.

## Verification summary

- All 22 `.factory/claims.json` commands passed exactly as listed.
- `npm ci`, `npm test` (11/11), `npm run check`, and `npm run build` passed.
- `npm run test:e2e`: 41 passed, 17 intentional skips.
- `npm run test:e2e:repeat`: 82 passed, 34 intentional skips.
- Live candidate byte identity and response-policy verification passed.
- Cold first-read, isolated demo, normal create/attach/reload/export/backup,
  invalid-input recovery, 390px layout, keyboard focus, reduced motion,
  200% text, links, privacy requests, and PWA offline behavior passed.
- Axe found no violations in light, dark, desktop demo, or mobile demo.
- Lighthouse mobile median: performance 96; accessibility, best practices,
  and SEO 100. LCP was 1.11–1.36 s and CLS was 0.
- The license verifier allowed 30 requests and returned 429 on request 31 with
  `Retry-After: 4`.

## Defects

None confirmed.

## Evidence and commands

The full report is [`.factory/verification-12.md`](verification-12.md).
Evidence is in [`.factory/evidence/verification-12/`](evidence/verification-12/).

Re-run the core gates with:

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
node scripts/verify-live.mjs https://invoice-evidence-pack.sociobot.in .factory/evidence/verification-12/live
```

## Known boundary

Large fallback Japanese and Devanagari fonts remain online-only and on-demand.
The compact fonts required by the shipped demo are precached and verified
offline. A real service-worker replacement transition requires deployment of a
new worker; the current update check and implemented update path both pass.
