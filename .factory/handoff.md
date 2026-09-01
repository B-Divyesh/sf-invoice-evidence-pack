# Invoice Packet polish-2 handoff — 2026-09-01

## Outcome

**PASS.** Every finding in `.factory/review-1.md` and
`.factory/review-2.md` is fixed. The static, local-first PWA is deployed at
<https://invoice-evidence-pack.sociobot.in>.

Repair code commit: `7c91384a616cc5abff44349403643796bad9000e`.
Deployment ID: `ec44741e-1c06-4161-a5fd-ee97f25cd958`.

## Delivered

- Privacy and Terms now use literal page-name h1 headings. Route focus,
  announcements, Back behavior, titles, metadata, and the designed 404 remain
  covered.
- The workspace keeps its field-guide visual system but names each task
  plainly: Saved packets, New packet, Packet details, Evidence files, Collect
  evidence, Notes for the reviewer, and Export the packet.
- The first-screen sample action opens `?demo=1` in one click. The persistent
  banner, reset, start-for-real action, realistic sample, and separate
  `demo:invoice-packet` database are tested.
- `.factory/claims.json` contains 22 claims with exactly one matching test tag
  each. The new `no-account-required` test creates, attaches, and exports from
  a fresh browser without registration or sign-in.
- “Payment trail” is the one user-facing form in the app, claims, README, and
  copy audit. The catalog sentence is verb-first and 102 characters.
- `.factory/polish-2.md` maps all current and earlier finding IDs to changes
  and evidence.

## Clean-clone verification

A fresh clone at `/tmp/invoice-polish2-j2MxlI` checked commit `7c91384`.

- `npm ci`: passed with zero known vulnerabilities.
- Every exact command in `.factory/claims.json`: 22/22 passed.
- `npm test`: 11/11 unit tests passed.
- `npm run check`: passed.
- `npm run build`: passed and produced `dist/index.html`.
- `npm run test:e2e`: 42 passed and 16 project-gated skips.
- `npm run test:e2e:repeat`: 84 passed and 32 project-gated skips. An earlier
  attempt ended after Chromium itself received `SIGSEGV`; the clean rerun had
  no test failure.
- Playwright Axe found zero serious or critical findings on desktop and 390 px
  mobile in light and dark themes. Mobile width was 390/390 before and after
  packet creation.
- The offline claim reloaded a service-worker-controlled fresh context and
  retained the app shell. The live cold check also reloaded the demo offline.
- Local `verify-url.sh` passed in 622 ms with no console errors, one h1, one
  main, complete alt text, and labelled buttons.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.5 s, TBT 10 ms, CLS 0.
- Initial entry JavaScript is 48.19 kB raw / 16.45 kB gzip. CSS is 21.30 kB
  raw / 5.51 kB gzip. Export libraries and full script fonts remain lazy.

## Deployment and live evidence

The scoped deploy reused only `sf-invoice-evidence-pack` in eastus2 and the
`invoice-evidence-pack.sociobot.in` custom domain. No staging slot or unrelated
resource was read or changed.

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed response policy and local/live byte identity:

- root: `61aac3a519a2396ea5fe62185793b4d6fba5ff22b63486030cfac13b8b1fb557`
- service worker: `55aec51864548ba7efd45bd615a201fb35c5bfe86300d2949a5a938f2f2fb1ba`
- manifest: `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

The fresh live browser audit confirmed the plain first screen, `?demo=1`
banner/reset/isolation, task labels, literal legal headings, route and Back
focus, HTTP 404 metadata, no-account ZIP export, 390 px layout, offline reload,
zero serious/critical Axe findings, and no console, failed-request, or external
request errors. Evidence is in `.factory/evidence/polish-2/`, including
`live/live-check.json`, desktop/mobile demo screenshots, and verifier output.

## How to verify

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
npm run verify:live -- https://invoice-evidence-pack.sociobot.in
```

## Known gaps

None. The product remains a static PWA; no backend, account system, analytics,
or new-license checkout was added.
