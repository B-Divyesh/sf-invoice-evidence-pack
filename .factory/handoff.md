# Invoice Packet repair handoff

## Outcome

**REPAIRED locally; ready for static deployment.** This repair addresses every
release-blocking finding in independent verification 3 for base candidate
`d553f454d61a56e1a2f9a2be4bc4c2b4609f175f`:

1. The visible **Add evidence** and **Replace** controls now receive a
   high-contrast 3px ochre focus outline and supporting halo through
   `:focus-within` while retaining the keyboard-operable native file input.
2. Packet and checklist names reject whitespace-only values before persistence.
   Each field receives a specific `aria-describedby` live error, `aria-invalid`
   state, native validity message, and returned focus.
3. Replace and Remove controls now have a non-shrinking 44×44px minimum, and
   icon buttons cannot flex-shrink below 44px on mobile.

The researched brief, visual thesis, PWA/offline behavior, local-first data
model, export paths, and deployment class remain unchanged.

## Regression coverage added

`tests/e2e/app.spec.ts` now exercises the verifier's exact keyboard path:
from **Add checklist item**, Tab reaches the transparent native file control,
and the visible **Add evidence** control has a 3px outline. It repeats the
check in the collected **Replace** state, measures the Replace, Remove, and
packet-delete targets at at least 44×44px, and verifies that whitespace-only
packet and item names remain in their dialogs with a focused, announced error.
The regression runs in desktop Chromium and the 390×844 mobile project.

## Verification evidence — 2026-08-28 UTC

- Clean install: `npm ci` installed 134 packages; `npm audit --omit=dev`
  reported 0 vulnerabilities.
- Types: `npm run check` passed (`tsc -b`). No separate lint script is defined
  by this intentionally small Vite/TypeScript project.
- Unit/integration: `npm test` passed, 2 files / 8 tests.
- Production build: `npm run build` passed and produced `dist/index.html`.
  Initial app JS is 41,789 bytes (14,390 gzip), CSS is 20,313 bytes (5,300
  gzip); lazy ZIP and PDF chunks remain 146,596 and 434,897 bytes respectively.
- Browser: `npm run test:e2e` passed **13 tests** with **1 intentional
  desktop-only skip** in 27.3 seconds. It covered desktop Chromium and the
  390×844 mobile project, packet creation/persistence/hashing, keyboard focus,
  touch target sizes, no mobile horizontal overflow, legal routes, policy
  headers, serious/critical axe scans in light and dark editor states, and a
  service-worker-controlled offline reload.
- Local mobile Lighthouse 13.0.1: **100 Performance, 100 Accessibility, 100
  Best Practices, 100 SEO**; FCP 1.1s, LCP 1.6s, TBT 40ms, CLS 0.
- Privacy/network review found no analytics, document backend, remote fonts, or
  third-party scripts. The only runtime cross-origin request remains deliberate
  license verification to the documented Sociobot endpoint; packet files stay
  in IndexedDB unless exported.
- Production response policy is exercised by the Playwright suite against the
  Vite production-policy preview: CSP, permissions policy, HSTS, frame/COOP/
  CORP protections, MIME types, no-cache shell, and immutable hashed assets.

## Deployment follow-up

The static deployment is triggered from the committed `main` branch. After
publish, run:

```sh
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

This confirms both the shipped response policy and byte identity of root,
hashed JS/CSS, service worker, manifest, privacy, and terms pages. Before this
repair was published, the live site was correctly serving the prior verified
candidate; its identity check is necessarily expected to differ from this new
local build.

## Known coverage limits

No real purchase or issued production license was created. Safari and Firefox
installed-PWA behavior remain advisable before a broad release. The independent
candidate verification already exercised the encrypted export, import/export,
missing-item, 100 MiB boundary, service-worker update, and full reviewer packet
flow; this targeted repair does not alter those paths.
