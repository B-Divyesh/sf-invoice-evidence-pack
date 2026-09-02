# Invoice Packet polish-4 handoff — 2026-09-02

## Outcome

Released repair `24aada5411a163efd945e0f8c8f45efc0e5ab1cd` and deployed it as
Azure Static Web Apps deployment `a8e566c9-2dff-4d5c-ae76-1265c1aa40ac`.
The live product is <https://invoice-evidence-pack.sociobot.in>.

This repair closes every finding from review 1 through review 4. It adds the
missing header Demo/history focus contract, a real ZIP-manifest fingerprint
claim test, an explicit disclosed GitHub source link, and matching 404 footer
links. The one-click `?demo=1` workspace remains isolated in
`demo:invoice-packet`, with a persistent banner, Reset demo, and Start for
real controls.

## Verification

- Fresh clone `/tmp/invoice-evidence-pack-clean-OQOP0q`: `npm ci`, all 23
  exact commands in `.factory/claims.json`, `npm test`, `npm run check`, and
  `npm run build` passed.
- Working tree: `npm test` passed 11/11; `npm run check` and `npm run build`
  passed; `npm run test:e2e` passed 66 tests; `npm run test:e2e:repeat`
  passed 132 tests.
- Claim inventory check confirmed 23 claim IDs, exactly one `@claim:<id>` test
  per ID, and no undeclared tags.
- Local production-shaped checks passed:
  `npm run verify:deployment -- http://127.0.0.1:4174`, the Static Web Apps
  emulator live check, and `verify-url.sh`. The local verifier exercised
  404s, header Demo → Back focus, one-click demo isolation, request privacy,
  mobile Axe, and offline reload.
- Live checks passed:
  `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`,
  `npm run verify:live -- https://invoice-evidence-pack.sociobot.in
  .factory/evidence/polish-4/live`, and
  `/opt/fleet/lib/verify-url.sh https://invoice-evidence-pack.sociobot.in
  .factory/evidence/polish-4/live/verify-url`.
- Live URL audit: 1.76s load, no console errors, `lang="en"`, one h1, main
  landmark, no missing image alt text, and no unlabeled buttons.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.1s and CLS 0. Evidence is in
  `.factory/evidence/polish-4/live/lighthouse-mobile.json`.
- Initial JavaScript remains 16.66 kB gzip and CSS 5.51 kB gzip. Lazy export
  dependencies are cached after the first visit for offline ZIP/PDF use.

## Run and deploy

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

Deploy `dist/` with `/opt/fleet/lib/deploy-static.sh invoice-evidence-pack dist`.

## Evidence and next steps

See [.factory/polish-4.md](polish-4.md) for the complete finding map and
evidence paths. There are no known gaps or deferred findings.
