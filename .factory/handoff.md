# Invoice Packet repair handoff — 2026-09-01

## Outcome

Repaired every release blocker in independent verification 7 for work order
`invoice-evidence-pack-repair-5`. The product remains the same static,
local-first PWA and builds to `dist/`.

## Repairs

1. **Damaged JSON backups now give a plain recovery step.** `parseBackup()`
   catches JSON syntax failures at the import boundary and returns: “This
   backup file is damaged or not valid JSON. Choose an Invoice Packet JSON
   backup and try again.” Existing packets and templates are not replaced
   unless parsing succeeds. Valid-but-unsupported backups still use the
   existing “not a supported Invoice Packet backup” explanation.
2. **Binary sizes use binary units.** Evidence controls and over-limit errors
   say `100 MiB`; displayed binary file sizes now use `KiB` and `MiB`, so the
   accepted `104,857,600` byte boundary displays as `100.0 MiB`.
3. **Regression coverage is exact and browser-based.** The new Playwright
   scenario imports the verifier's `{not valid` bytes after confirming
   replacement, checks the recovery text, checks that Chromium's parser text
   is absent, reloads, and confirms the original packet persists. Unit tests
   cover the normalized parser error and the 100 MiB display boundary. The
   independent browser smoke owns and removes its own sparse 100 MiB + 1 byte
   fixture.

## Verification

Clean install and full local matrix completed on 2026-09-01:

```sh
npm ci
npm audit --omit=dev
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
```

- `npm ci`: 140 packages installed; `npm audit --omit=dev`: 0 vulnerabilities.
- `npm test`: 2 files, 11 tests passed.
- `npm run check` and production build passed; `dist/index.html` exists.
- `npm run test:e2e` and `npm run test:e2e:repeat` passed. The repeat runner
  recorded `status: passed`; it covers desktop and 390 px mobile Chromium,
  keyboard/focus, invalid states, persistence, ZIP/PDF/JSON exports,
  encryption, demo isolation, privacy requests, offline reload, and update
  behavior.
- `node .qa-independent.mjs`: normal workflow, actual 100 MiB + 1 byte
  rejection, keyboard focus, reduced motion, persistence, offline reload,
  and no console errors or third-party requests passed.
- `node .qa-axe-mobile.mjs`: desktop and 390 px mobile light/dark scans had
  zero serious/critical Axe violations, no console errors, exactly one `h1`,
  and no horizontal overflow.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174`: returned 200 with a
  title, `lang=en`, one `h1`, a `main`, complete image alt text, named
  buttons, and zero console/page errors (636 ms load).
- `npm run verify:deployment -- http://127.0.0.1:4174` passed the configured
  static response policy, immutable hashed assets, and byte identity. Local
  SHA-256: root/demo/privacy/terms
  `d571526ba6da8c2f01cef996fc571ce1ba8d1d64df87c0186e1689477963db5d`;
  worker `7c17d899cca1e658ffd6b9b974e4acbc88409a59006670af6b3376f108fbffb8`;
  manifest `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`.
- Local mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1,103 ms, LCP 1,507 ms, TBT 0 ms, CLS 0.
  Initial entry JS is 46.99 kB (16.28 kB gzip); CSS is 21.30 kB (5.51 kB
  gzip).

## Delivery and scope

Product repair commit: `b9aca8b618bf5aa2c56d29bb2a5213e1933765e3`.
The next commit records this handoff; push `main` to trigger the existing
factory-managed static deployment, then run the repository's deployment
identity verifier against the product origin once propagation completes.

No Sociobot API, billing endpoint, secret, app setting, database, or unrelated
service was read or contacted. The only browser network checks were against
the locally served product. There is no backend, package consumer, CLI, or
database migration applicable to this static PWA.

## Reproduce

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
npm run verify:deployment -- http://127.0.0.1:4174
```
