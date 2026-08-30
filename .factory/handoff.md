# Invoice Packet repair handoff — 2026-08-30

## Outcome

Repaired every release blocker from independent verification 6
(`.factory/verification-6.md`) for work order
`invoice-evidence-pack-repair-4`. The repaired artifact remains a static,
local-first PWA built to `dist/`.

## Repairs

1. **Stable full browser gate.** Archive, password, PDF, and offline scenarios
   now make a new test-owned browser context and close only that context. The
   Playwright shared Chromium browser is never closed. The test web server no
   longer reuses a stale server, runs one worker with no retries, and
   `test:e2e:repeat` repeats the complete suite.
2. **One-time checkout restored.** The production license dialog now exposes
   the registered hosted checkout URL for the $19 encrypted-export/template
   unlock. It keeps existing-token restore and strips a returned `license`
   token into local storage without blocking the free workflow.
3. **Small offline installation.** The generated service worker now precaches
   only the app shell, route documents, icon set, and responsive hero. ZIP/PDF
   code and fonts cache on first export instead. Small local script-font cores
   cover the shipped Devanagari/Japanese sample; complete local fallbacks load
   only when uncommon characters need them.
4. **44 px target floor.** Required-item checkbox labels and the update action
   are at least 44 px high. Regression checks cover visible checkbox labels,
   file controls, destructive controls, and the update action at desktop and
   390 px mobile.
5. **Claims inventory completed.** Added tagged, observable coverage for the
   one-time checkout, configurable filing/client/payment-trail checklists, no
   document backend/analytics requests, standalone PWA metadata, and free
   ZIP/PDF/JSON exports. `.factory/claims.json` now has 18 claims, each with
   exactly one regression tag.

## Verification

Clean install and quality gates:

```sh
npm ci
npm audit --omit=dev
npm test
npm run check
npm run build
npm run test:e2e:repeat
```

- `npm audit --omit=dev`: 0 vulnerabilities.
- Unit suite: 10/10 tests passed.
- Type check and production build passed; `dist/index.html` exists.
- `npm run test:e2e:repeat`: passed 76 sequential desktop/mobile executions
  in one worker, including well beyond the old 20-pass crash point.
- Every one of the 18 commands declared in `.factory/claims.json` passed.
- Desktop and 390 px browser coverage includes normal create/hash/persist,
  invalid names, keyboard focus, touch targets, plain/encrypted archives,
  PDF text, backup recovery, demo isolation, privacy request logs, offline
  reload, service-worker update behavior, and legal routes.
- Playwright Axe scans found 0 serious or critical issues in empty/editor,
  light/dark, desktop/mobile states. `verify-url.sh` against the production
  preview reported one `h1`, `lang=en`, a `main`, complete image alt text,
  named buttons, and no console/page errors (629 ms load).
- The standalone Axe CLI was attempted. Its pinned ChromeDriver 152 cannot
  launch the supplied Chromium 145, so the repository's Playwright Axe
  integration is the recorded accessible-browser evidence.
- Lighthouse 13.4.1 mobile preview: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.
- Local static response-policy/identity verification passed. Hashes:
  root/demo/privacy/terms
  `85bc1018ac4b507e12482dcb1c852c5b56a35a5769ec18c140635ccf62068d15`,
  worker `dc42ffd8709dce33f979669a171d167a3254c133b3242ddbb0e0cae119c09cc7`,
  manifest `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`.
- First service-worker installation is now 14 files / 322,763 bytes and
  precaches zero PDF fonts or export runtime chunks. The initial application
  JS is 46,740 bytes (16,200 gzip); CSS is 21,297 bytes (5,510 gzip).

## Deployment and scope

Deploy `dist/` as the existing static artifact. The configured response policy
was verified locally with `npm run verify:deployment -- http://127.0.0.1:4173`.
The release is pushed to the product repository's `main` branch for the
factory-managed static deployment.

At this handoff the live origin still returns the prior root hash
`18f27b5b87c809d…52184d554b`, rather than the locally verified repair hash
above. The source release is pushed and buildable; live propagation remains a
factory deployment-controller action outside this repository.

No Sociobot API, billing endpoint, unrelated service, secrets, or deployment
settings were read or contacted. The exact checkout URL and return-token
capture are covered without following the external link. A real hosted
purchase remains intentionally outside this work order's resource scope.

## Reproduce

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
npm run verify:deployment -- http://127.0.0.1:4173
```
