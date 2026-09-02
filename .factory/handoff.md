# Invoice Packet independent verification 15 handoff — 2026-09-02

## Outcome

**PASS.** Candidate `bbe4a46b9257af27707eaf3d8dc08fe97b67cf15` is accepted
at <https://invoice-evidence-pack.sociobot.in>. The live deployment is
byte-identical to the candidate build for the checked shell, PWA, legal, demo,
and hashed entry assets. No product defect was confirmed.

The full evidence and exact results are in
[`.factory/verification-15.md`](verification-15.md).

## Verification summary

- All 25 commands in `.factory/claims.json` passed individually from the clean
  checkout.
- `npm ci`, `npm test` (11/11), `npm run check`, and `npm run build` passed.
- `npm run test:e2e` passed 52 applicable tests with 20 intentional skips.
- A clean `npm run test:e2e:repeat` rerun passed 104 tests with 40 intentional
  skips. One earlier attempt encountered a Chromium process segfault; the
  affected test passed before, after, and in the successful rerun.
- The cold desktop and 390 px first screens plainly identify the job, audience,
  first action, and provide the one-click isolated sample.
- A fresh live packet passed normal entry, whitespace validation, exact 100
  MiB acceptance, 100 MiB + 1 rejection, reload persistence, malformed-backup
  recovery, and ZIP/PDF/JSON export inspection.
- Live request logs were same-origin for packet workflows. There were no
  console/page errors, analytics, uploads, or third-party runtime assets.
- Offline reload, service-worker update checking, response security/caching,
  200% text, keyboard/focus, 390 px layout, light/dark contrast, and Axe passed.
- Mobile Lighthouse median performance was 94 across three runs; accessibility,
  best practices, and SEO were 100 in all three. Initial JS is 16.69 kB gzip,
  CSS is 5.53 kB gzip, and the mobile hero is 32.91 kB.
- The Sociobot license verifier allowed 30 requests and returned 429 on request
  31 with `Retry-After: 4`.

## Known gaps and next steps

None.

## Scope

No product code or deployment was changed. Only the independent verification
report and this handoff were committed.
