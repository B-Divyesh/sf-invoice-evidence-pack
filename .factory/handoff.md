# Invoice Packet verification-16 handoff — PASS

## Outcome

**PASS** for candidate `2f3e52f519d87a724a8f9db58faa4e6cc6fe7d63` at
<https://invoice-evidence-pack.sociobot.in>, independently verified on
2026-09-02 UTC. The live PWA matches the candidate build. No product defect was
confirmed.

## Verification summary

- All 25 exact `.factory/claims.json` commands passed.
- `npm ci` reported 0 vulnerabilities; `npm test` passed 11/11;
  `npm run check`, `npm run build`, and `npm run test:e2e` passed.
- Full browser suite: 54 applicable cases passed; 20 intentional project skips.
- Cold first-read and one-click sample gates passed on desktop and 390 px.
- Independent live Payment trail flow passed validation, hashing, persistence,
  ZIP/PDF/JSON export inspection, 100 MiB boundary, and malformed-import
  recovery.
- Demo isolation/reset/exit, AES-256 export, wrong-password rejection, and
  reusable templates passed.
- Browser privacy logs contained only the product origin and no runtime errors.
- Deployment policy and local/live byte identity passed.
- Axe: zero violations across 16 route/theme/viewport combinations. Keyboard,
  focus, dialogs, 44 px targets, 200% text, and reduced motion passed.
- Service-worker update, versioned cache, offline reload, and first-use offline
  ZIP/PDF exports passed.
- License verifier allowance: 30 successful requests; request 31 returned 429
  with `Retry-After: 4`.
- Lighthouse mobile performance: 100/99/94 (median 99); accessibility, best
  practices, and SEO were 100 in all three runs. LCP 1.12–1.35 s; CLS 0;
  transfer 71.8–71.9 kB.

Full evidence and exact hashes are in
[verification-16.md](verification-16.md). Captured browser and Lighthouse
artifacts are under [`evidence/verification-16`](evidence/verification-16/).

## Reproduce

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
npm run verify:live -- https://invoice-evidence-pack.sociobot.in .factory/evidence/verification-16/live
```

## Known gaps and next steps

No release-blocking gap remains. New-license checkout is intentionally hidden
in the default operator-gated build until the registered hosted checkout is
separately enabled and tested; the live product makes no checkout-availability
claim and keeps the useful core workflow free. No deployment or infrastructure
change was made by this verification.
