# Invoice Packet repair handoff — 2026-08-30

## Outcome

Release blockers from independent report `905c9339c614ca5a5631e61827b44c9ab3361f77`
for candidate `66a17f1fc03b27e1ac77ebe7227e981a11fb8387` are repaired. Product commits
`551068b` and `3db44bc` are pushed to `main`. The tested static artifact is
deployed at <https://invoice-evidence-pack.sociobot.in> through the authorized
`sf-invoice-evidence-pack` Static Web App.

## Repairs

- ZIP paths are now collision-safe and case-insensitive. Distinct attachments
  named `proof.pdf` export as `evidence/proof.pdf` and
  `evidence/proof-2.pdf`. The manifest preserves each source filename and adds
  the exact `archiveFilename`. Plain and AES-256 ZIP paths share this logic.
- The empty state exposes **Import backup from another device**. It restores a
  complete JSON backup before the user creates a throwaway packet.
- PDF export embeds local subset fonts and chooses a font per text run. The
  independently extracted title `मुंबई 東京 packet`, client `山田商事`, and
  jurisdiction `भारत / 日本` survive export. Font source, checksums, and SIL OFL
  terms are in `THIRD_PARTY_NOTICES.md`.
- Checkout is fail-soft. Default builds show no purchase URL and explain that
  new purchases are paused; free exports and existing-license restore remain
  usable. A registered environment can opt in with
  `VITE_BILLING_ENABLED=true`. The shared checkout still returns HTTP 404, so
  it is deliberately not advertised or linked.
- `/demo/` is a one-click sample workspace backed only by the separate
  `demo:invoice-packet` IndexedDB database. It includes realistic evidence,
  reset/start-real controls, and paid-tool fixtures without reading or writing
  normal packet or license data.
- Added `.factory/claims.json`, `.factory/demo.md`, the plain-language copy
  audit, route metadata, a 1200×630 social image, and a real styled HTTP 404.

## Regression coverage

- The duplicate-name browser test downloads and opens the ZIP, verifies both
  file entries, and checks source/archive names in `manifest.json`.
- The encrypted-ZIP test repeats the collision case, checks AES extra-field
  strength `3` (256-bit), decrypts with the right password, and rejects a wrong
  password.
- The fresh-device test invokes the visible empty-state import control and
  verifies the restored packet and success message.
- The PDF test downloads the actual PDF, extracts it through PDF.js, and
  compares every Devanagari/Japanese field.
- The billing test verifies that a default build has the pause notice, no buy
  link, and a working existing-license form.
- Thirteen product claims each have exactly one `@claim:<id>` regression.

## Verification evidence

Run from a clean dependency install:

```sh
npm ci
npm audit --omit=dev
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

Results:

- `npm ci`: 140 packages installed; audit reports 0 vulnerabilities.
- Vitest: 2 files, 10 tests passed.
- TypeScript: `tsc -b` passed. The repository has no separate lint tool; the
  strict TypeScript check is its static gate.
- Playwright 1.58.2: 21 passed, 5 intentional project-specific skips across
  desktop Chromium and 390×844 mobile Chromium.
- Build: `dist/index.html` present. Initial JS is 45,999 bytes / 16,030 gzip;
  CSS is 21,281 bytes / 5,500 gzip. ZIP, PDF, and font processing remain lazy.
  Mobile hero WebP is 32,908 bytes.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0, initial transfer 77 KiB.
- Playwright axe scans on empty, editor, demo, light, dark, desktop, and mobile
  states found 0 serious or critical issues. Both 1440px and 390px checks had
  no horizontal overflow, console errors, page errors, or external requests.
- Factory URL verifier: live HTTP 200 in 834 ms, correct title/lang, one `h1`,
  one `main`, complete alt text, named buttons, and no console errors.
- Update simulation: displayed the waiting-worker notice, activated through
  **Update now**, retained IndexedDB data, and reloaded offline under the new
  controller with no errors.
- Live fresh-profile repair check: empty import visible; purchase link count 0;
  duplicate ZIP entries present; all Unicode PDF fields extracted; packet data
  survived offline reload; mobile demo width exactly 390px; axe clean.
- Unknown live paths now return HTTP 404 with the designed recovery page.
- Privacy review found only same-origin packet/demo/export requests. The sole
  optional runtime cross-origin call is existing-license verification to the
  documented Sociobot billing API; packet contents are never sent.

## Deployment identity

Latest deployment ID: `12090ac8-7231-43de-8259-e0399632209d`.

- root/demo/privacy/terms:
  `18f27b5b87c809cbd07920973ab5a1c519a03e986f80bd1bc1a09752184d554b`
- service worker:
  `1913d99628d77bfd820e31e2ca82cd8ab2e103d8fdb12f153a7169416a0bcd52`
- manifest:
  `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

`npm run verify:deployment` passed cache policy, security headers, MIME policy,
and byte identity for the live release.

## Known limits and next step

- New purchases remain paused because the shared checkout endpoint returns the
  verifier's HTTP 404 response. After the controller registers/enables the
  product, verify hosted checkout in its own environment and rebuild with
  `VITE_BILLING_ENABLED=true`. No free or existing-license behavior depends on
  that service.
- Installed-PWA behavior was exercised in Chromium. Safari and Firefox were
  not available in this work order.
