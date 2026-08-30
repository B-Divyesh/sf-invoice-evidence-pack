# Invoice Packet independent verification handoff — 2026-08-30

## Outcome

**FAIL.** Candidate `1e860a550f1b14d716574777c2e724015d91eddf` was
verified against <https://invoice-evidence-pack.sociobot.in> for work order
`invoice-evidence-pack-verify-6`. The live deployment matches the candidate,
but it does not meet the complete release contract.

The full report is `.factory/verification-6.md`.

## Release blockers

1. `npm run test:e2e` failed twice with a pinned Chromium process segfault:
   20 passed, 5 skipped, 1 failed. The affected packet workflow passes alone,
   but the required full command remains non-zero.
2. Production exposes no checkout link. New purchases are explicitly paused,
   so a new user cannot obtain encrypted ZIP or custom-template access.
3. First service-worker installation precaches 6,900,341 bytes. The two PDF
   fonts total 5,151,992 bytes, exceeding the 120 KB font budget.
4. Visible per-item checkbox hit areas are 40 px high; the update action is
   styled to 36 px. Both are below the required 44 px minimum.
5. Landing/README claims for free exports, PWA installation, no analytics, and
   configurable checklists are not listed in `.factory/claims.json` with one
   tagged test each.

## What passed

- Cold first-read: what/for whom/first action are plain, and the demo is one
  click from the first viewport.
- All 13 declared claim commands passed after `npm ci`.
- `npm audit --omit=dev`, `npm test` (10/10), `npm run check`, and exact
  `npm run build` passed; `dist/` exists.
- Live/local byte identity, cache policy, security headers, MIME policy, legal
  routes, and real 404 passed.
- Normal packet create/hash/persist/ZIP, exact 100 MiB acceptance, 100 MiB+1
  rejection, malformed backup recovery, cancellation, password errors,
  duplicate names, Unicode PDF, JSON backup/import, AES ZIP, and templates
  passed.
- No third-party requests occurred during normal/demo workflows. Files stayed
  in IndexedDB. No analytics or document upload path was found.
- Offline reload and a controlled waiting-worker update passed while retaining
  packet data.
- Axe found 0 serious/critical issues in the tested light/dark,
  desktop/mobile/reduced-motion states. Keyboard focus, dialog focus return,
  390 px/320 px reflow, and console/page-error checks passed apart from the
  touch-target sizes above.
- Lighthouse mobile: 98 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; FCP/LCP 1.233 s, TBT 158.5 ms, CLS 0, visible transfer 71,142 B.

## Deployment identity

- root/demo/privacy/terms:
  `18f27b5b87c809cbd07920973ab5a1c519a03e986f80bd1bc1a09752184d554b`
- service worker:
  `1913d99628d77bfd820e31e2ca82cd8ab2e103d8fdb12f153a7169416a0bcd52`
- manifest:
  `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

## Reproduce

```sh
npm ci
npm audit --omit=dev
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

There is no lint script. This is a static PWA with no sign-in or product-owned
server endpoint. The shared billing API was not probed because the work order
forbids connecting to resources outside `sf-invoice-evidence-pack`; once
checkout is enabled, rate-limit behavior needs authorized fresh verification.

## Next steps

Stabilize the complete Playwright command, enable only the registered Sociobot
checkout, lazy-cache/subset PDF assets, raise every target to 44 px, and bring
all public claims into the manifest. Then rerun independent verification on a
new candidate. No product code was changed during this verification.
