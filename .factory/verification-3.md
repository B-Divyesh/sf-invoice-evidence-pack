# Independent verification 3 — FAIL

**Candidate:** `d553f454d61a56e1a2f9a2be4bc4c2b4609f175f` (`fix: make precache generation deterministic`)  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Scope:** clean candidate checkout, exact production build, local production preview, and fresh live Chromium verification on desktop and 390×844 mobile.

## Verdict

**FAIL for release acceptance.** The deployment-only findings from the earlier
report are fixed and the live origin is now the exact candidate. The core
local-first workflow, exports, offline behavior, response policy, and budgets
all pass. However, the central evidence-file control has no visible keyboard
focus, directly failing the explicit keyboard/focus acceptance contract. Two
additional input-validation defects allow blank packet and checklist names.

## Clean build and repository gates

The repository was clean and `HEAD`, `origin/main`, and the requested candidate
all resolved to `d553f454d61a56e1a2f9a2be4bc4c2b4609f175f` before verification.

```sh
npm ci
npm test
npm run check
npm audit --omit=dev
npm run build
npm run test:e2e
```

- `npm ci`: 134 packages installed; 0 vulnerabilities.
- `npm test`: 2 files / 8 tests passed.
- `npm run check`: passed (`tsc -b`). No lint script or separate lint
  configuration exists.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Exact production command `npm run build`: passed and produced `dist/`.
- Playwright 1.58.2 suite: 11 passed, 1 intentional desktop duplicate skipped.
- Build hashes: `dist/index.html`
  `40a2ef4560d91f0c762789fc5228b544bca7a8767c3a78d387c648af3e0d12b3`;
  `dist/sw.js`
  `62b302ff7f87e7864ba783b903847971cbfe4b339f6c6a68ff7ca54171483f47`;
  manifest
  `c75d077c3848d30735c7ea868fb123eca5acd219d6f17d020677ae70ef784ead`.

## Product evidence

Fresh browser profiles exercised the local build and the live URL. Coverage
included:

- Created a cross-border packet with invoice number, client, date,
  jurisdiction, lowercase currency, and reviewer notes; currency normalized to
  `USD` and special characters rendered as text.
- Attached all four required records. SHA-256 for `invoice evidence` was
  `d5b7e030709f98cb97ad24269347558feb88bea79762d67fa25d750f4121a4aa`,
  matching an independent digest. IndexedDB files, metadata, history, and notes
  survived reload.
- On the local candidate, accepted the exact 100 MiB boundary file (digest
  `20492a4d0d84f8beb1767f6616229f85d44c2827b64bdbfb260ee12fa1109e0e`),
  rejected 100 MiB + 1 with an actionable message, and preserved the previous
  attachment after rejection.
- Warned before exporting with one missing required item. A redacted ZIP
  contained `manifest.json`, `README.txt`, and four renamed evidence files.
  Its manifest retained metadata, notes, missing/optional states, byte counts,
  hashes, and the not-tax-advice notice. The archived evidence digest matched
  the source. PDF export was a valid `%PDF-1.7` file (2,267 bytes).
- Exported a full JSON backup and restored it in a fresh browser profile,
  including the attachment blobs and notes. An unsupported backup was rejected
  without damaging the current packet.
- With a fresh cached-valid test entitlement, saved and reused a custom
  template, rejected a password shorter than 10 characters, explained a
  password mismatch, and produced an AES encrypted ZIP. Zip.js decrypted it
  with the correct password and rejected a wrong password.
- Invalid license restoration showed the expected recoverable error. The buy
  link is exactly
  `https://api.sociobot.in/api/v1/products/invoice-evidence-pack/checkout`.
  No real checkout, payment, or issued production license was used.
- Packet deletion was confirmed, incomplete status was expressed in words and
  counts, and the initial empty state had a clear next action.

## Accessibility and responsive evidence

- Desktop and 390×844 mobile had no horizontal overflow and no console,
  page, or request-failure errors.
- Repeated Playwright axe scans on empty/editor states, light/dark themes, and
  mobile found **0 serious or critical findings**.
- Semantic smoke checks passed: descriptive title, `lang=en`, exactly one
  `h1`, one `main`, image alt text, named buttons, legal-page headings, and a
  keyboard-operable skip link.
- Reduced motion computed to `0.00001s`; there is no looping or flashing
  animation.
- Manual keyboard inspection found the release blocker below, which automated
  axe does not detect.

## PWA, privacy, network, and delivery evidence

- Manifest is standalone with a versioned start URL, theme/background colors,
  and real 192×192 / 512×512 PNG icons; the 512 icon is maskable.
- Service-worker-controlled offline reload passed locally and live, retained
  the full shell, and visibly changed status to “Offline.” A changed-worker
  simulation showed “A fresh field kit is ready”; “Update now” activated the
  waiting worker and reloaded under the new controller without errors.
- Source and runtime request review found no analytics, CDN fonts/scripts, or
  document backend. The normal workflow through export made only same-origin
  requests. The deliberate invalid-license check sent only the test token to
  the documented Sociobot verify endpoint.
- `/privacy/` and `/terms/` exist and accurately describe IndexedDB storage,
  exports, licensing, merchant of record, and non-advice boundaries.
- Live headers pass the shipped policy: strict self CSP with only billing
  connects, denied ambient permissions, `DENY` framing, COOP/CORP,
  `nosniff`, referrer policy, and two-year HSTS. HTML, manifest, and service
  worker use `no-cache`; the manifest MIME is
  `application/manifest+json`; hashed assets use
  `public, max-age=31536000, immutable`. An ETag request returned 304.

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed policy and byte identity for the root, initial JS/CSS, service worker,
manifest, privacy, and terms routes. This is the tested candidate, not a stale
deployment.

## Performance

- Initial app JS: 40,723 bytes / 14,076 gzip; CSS: 20,092 bytes / 5,279 gzip.
  PDF (434,897 bytes) and ZIP (146,596 bytes) code is lazy-loaded.
- Mobile hero WebP: 32,908 bytes. No web fonts are shipped.
- Lighthouse 13.0.1 against the live origin, mobile profile: Performance
  **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP
  1.3 s, LCP 1.3 s, TBT 140 ms, interactive 1.6 s, CLS 0.

## Defects

### High — evidence file controls have no visible keyboard focus

Reproduction:

1. Create a packet.
2. Focus “Add checklist item” and press Tab.
3. The active element is the first `input[type=file]`, but nothing visible
   indicates focus.

Measured on the candidate and live deployment: the focused input is transparent
(`opacity: 0`), its computed outline width is `0px`, and its visible “Add
evidence”/“Replace” label has `outline: none`. The control is keyboard-reachable,
but a keyboard user cannot locate focus while collecting evidence—the product's
primary task. This violates the work order's visible-focus requirement and WCAG
2.4.7. Add a designed `:focus-within` treatment to the visible label (and retain
an operable native input).

### Medium — whitespace-only required names are accepted

Entering three spaces into either required “Packet name” or “Item name” passes
native validity. Application code then trims the value and saves an empty name.
The first case creates a packet with a blank heading; the second creates a blank
required checklist row. The exported manifest reproduced an evidence entry with
`"label": ""`, status `missing-required`, and completion reduced to 80% with no
way for a reviewer to know what is missing. Reject trimmed-empty input in both
forms, announce the error, and keep focus on the field.

### Low — several visible pointer targets are below 44×44 CSS px

Desktop “Replace” and “Remove” controls measured 38 px high. At 390 px, the
delete icon button shrank to 36×44 px. This misses the explicit 44×44 target
budget. Prevent flex shrink and raise the mini-control minimum size or provide
equivalent target padding.

## Coverage limit

The production billing endpoint was checked only with a deliberately invalid
token and an intercepted response; no real payment or issued license was
created. Safari and Firefox installed-PWA behavior was not exercised. These are
not the reason for the FAIL verdict.
