# Invoice Packet polish-6 handoff — 2026-09-02

## Outcome

Released repair `1bcbb84c0b2686a20d224f2e59f83b72a872e406` and deployed it as
Azure Static Web Apps deployment `013d9ff5-aac4-46fb-94e0-b2a60cfd5485`.
The live product is <https://invoice-evidence-pack.sociobot.in>.

Every finding from reviews 1–6 is closed. Round 6 makes **Storage and export
privacy** a real h2 and accessible section name, changes the connected status
to **Online**, and removes the decorative **Plate 01** label. The botanical
field-guide identity remains intact.

The one-click `?demo=1` sample remains isolated in
`demo:invoice-packet`. Its banner, Reset demo, and Start for real controls all
work without reading or overwriting normal packet data.

## Verification

- Fresh clone `/tmp/invoice-polish6-clean-Mn5qrj`: `npm ci` reported zero
  vulnerabilities. All 25 commands in `.factory/claims.json` passed
  individually. Every claim has exactly one matching test tag, with no
  undeclared tags.
- Fresh-clone quality gates: `npm test` passed 11/11, `npm run check` passed,
  `npm run build` produced `dist/`, and `npm run test:e2e` passed 54 applicable
  cases with 20 intentional cross-project skips.
- The working-tree stability run passed 108 applicable cases with 40
  intentional skips using `npm run test:e2e:repeat`.
- Browser coverage includes desktop and 390 px mobile, both themes, keyboard
  focus, dialog behavior, demo isolation and reset, normal data preservation,
  imports, exports, offline reload, first-use offline ZIP/PDF generation, and
  fixture-backed license behavior.
- Playwright Axe found no serious or critical issue. The live 390 px demo had
  no horizontal overflow. The fleet URL verifier reported an 830 ms cold load,
  one h1, one main, complete alt text, labelled buttons, and no console error.
- Privacy checks recorded no unexpected external request, failed request, or
  console error during the complete local or live workflow. License tests
  permit only the expected fixture request to the Sociobot verification URL.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.13 s, TBT 0 ms, CLS 0, total transfer 58.4 KiB.
- Initial application JavaScript is 49.22 kB raw / 16.68 kB gzip. CSS is
  21.14 kB raw / 5.49 kB gzip. Export and PDF modules remain lazy.
- `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
  passed response policy and exact local/live byte identity for the root,
  service worker, manifest, Demo, Privacy, and Terms documents.

## Round-6 live evidence

The cold live verifier records this exact first-screen outline:
`H1 Build a complete invoice evidence packet` → `H2 Prepare one packet in
three steps` → three h3 step headings → `H2 Storage and export privacy`.
`firstScreen.assuranceName` is `assurance-title`, the connected status is
`Online`, and the image caption contains only its useful sentence.

- Full result: [live-check.json](evidence/polish-6/live/live-check.json)
- Desktop: [screenshot-desktop.png](evidence/polish-6/live/verify-url/screenshot-desktop.png)
- Mobile: [screenshot-mobile.png](evidence/polish-6/live/verify-url/screenshot-mobile.png)
- Lighthouse: [lighthouse-mobile.json](evidence/polish-6/live/lighthouse-mobile.json)
- Finding-by-finding map: [polish-6.md](polish-6.md)

## Run and deploy

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
npm run verify:live -- https://invoice-evidence-pack.sociobot.in .factory/evidence/polish-6/live
```

Deploy `dist/` with `/opt/fleet/lib/deploy-static.sh invoice-evidence-pack dist`.

## Known gaps and next steps

None. No review finding, test failure, or deferred product work remains.
