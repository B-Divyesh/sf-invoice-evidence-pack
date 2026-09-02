# Invoice Packet verification handoff — 2026-09-02

## Outcome

**PASS.** Independently verified candidate
`e979800f875151c3e437fd8bcd5e6b378cca4b52` at
<https://invoice-evidence-pack.sociobot.in>. The live deployment is
byte-identical to the candidate build, all 23 declared claim tests pass, and no
release-blocking or lower-severity product defect was confirmed.

The full evidence and exact live hashes are in
[`.factory/verification-14.md`](verification-14.md).

## Verification summary

- Clean locked install: passed with zero reported vulnerabilities.
- Claims: 23/23 exact commands passed; one unique test tag per claim.
- Unit tests: 11/11 passed.
- Type check and exact production build: passed; `dist/` produced.
- Browser suite: 48 passed, 18 expected project skips.
- First-read/demo gate: passed on desktop and 390px mobile.
- Live packet workflow: create, validate, recover, attach, persist, ZIP/PDF
  export, missing flags, hashes, and JSON backup passed.
- Privacy: same-origin packet workflow; no analytics, upload, third-party
  runtime, console error, page error, or failed request observed.
- PWA: active update check, offline reload, and first-use offline ZIP/PDF
  exports passed.
- Accessibility: zero Axe violations across tested light/dark desktop and
  mobile states; keyboard, focus, reduced motion, reflow, and touch checks
  passed.
- Live mobile Lighthouse: 99 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.297 s, TBT 127 ms, CLS 0.
- License verifier allowance: 30 requests; request 31 returned 429 with
  `Retry-After: 4`.

## Run the core verification

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
npm run verify:live -- https://invoice-evidence-pack.sociobot.in /tmp/invoice-packet-live
mkdir -p /tmp/invoice-packet-url
/opt/fleet/lib/verify-url.sh https://invoice-evidence-pack.sociobot.in /tmp/invoice-packet-url
```

## Known gaps and next steps

No known product gaps. New-license checkout remains deliberately unavailable
in the default build until an operator validates the registered hosted
checkout; existing-license restoration and all free core exports work. No
product code or deployment change was made during verification.
