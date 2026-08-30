# Independent verification 7 — FAIL

**Candidate:** `008780398239d0a4f31d1a57cdc1115213401ab7`

**Live URL:** <https://invoice-evidence-pack.sociobot.in>

**Verified:** 2026-08-30 UTC

**Work order:** `invoice-evidence-pack-verify-7`

## Verdict

**FAIL for release acceptance.** The live deployment is byte-for-byte the
candidate, the first-read/demo gate passes, all 18 declared claims pass, and
the complete clean test/build matrix is green. Core packet creation,
persistence, hashing, missing-item flags, ZIP/PDF/JSON exports, encryption,
demo isolation, privacy, accessibility, responsive layout, offline reload,
and service-worker replacement work.

Release acceptance is blocked by one user-facing error-path defect. Importing
syntactically broken JSON exposes Chromium's parser diagnostic instead of a
plain explanation and recovery instruction. This violates the supplied
plain-words rule and the definition of done for invalid input and errors. A
separate low-severity copy defect labels a binary 100 MiB limit as “100 MB.”

## First-read and demo gate

A fresh 1440×900 Chromium context opened the live root before source review.

- **What it does:** “Build a complete invoice evidence packet.”
- **For whom:** cross-border freelancers and small firms preparing files for
  an accountant, client, or filing review.
- **What to do first:** **Try it with sample data** is the primary action in
  the first viewport and opens `/demo/` in one click.
- The demo immediately shows “Kite Studio · August client review,” four
  collected required items, and the persistent sample-data banner with
  **Reset demo** and **Start for real**.
- A direct `/demo/` visit created only `demo:invoice-packet`. Going through the
  landing page first also left the normal database present but empty; demo
  actions wrote zero normal packet records. **Start for real** emptied the demo
  packet store before returning to `/`.

The mandatory first-read/demo gate passes. Screenshots were captured during
the run at `/tmp/invoice-first-read.png`, `/tmp/invoice-live-desktop.png`, and
`/tmp/invoice-live-mobile.png`.

## Declared claims

`.factory/claims.json` exists with 18 entries. Every declared command was run
exactly as written after `npm ci`; all passed. Each claim tag occurs exactly
once in the test sources.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | One click opened the seeded, bannered demo. |
| `local-only` | PASS | Demo traffic contained no third-party request. |
| `sha256-hash` | PASS | Known bytes matched the fixed SHA-256 digest. |
| `file-size-limit` | PASS | 100 MiB passed; the next byte failed. |
| `missing-flags` | PASS | Present, missing-required, and optional states matched. |
| `filename-redaction` | PASS | Export used a neutral indexed filename and redaction flag. |
| `duplicate-zip` | PASS | Distinct same-named files survived as separate ZIP entries. |
| `unicode-pdf` | PASS | Devanagari and Japanese metadata survived PDF extraction. |
| `json-backup` | PASS | Attachment bytes and metadata survived backup round-trip. |
| `backup-import` | PASS | A fresh workspace restored the supplied packet. |
| `offline-reload` | PASS | A controlled context reloaded the app offline. |
| `aes-zip` | PASS | AES strength 3 decrypted correctly and rejected a wrong password. |
| `custom-templates` | PASS | A saved checklist appeared for a new packet. |
| `one-time-checkout` | PASS | Exact hosted checkout link and restore control were visible. |
| `configurable-checklists` | PASS | Filing, client, and payment-trail choices were usable. |
| `no-document-backend` | PASS | Normal create/attach traffic remained same-origin. |
| `pwa-installable` | PASS | Controlling worker, versioned start URL, standalone display, and icons passed. |
| `free-exports` | PASS | ZIP, PDF, and JSON downloads worked without a license. |

The landing, legal copy, and README were cross-checked against the claim
inventory. No additional material product claim lacked a tagged test.

## Clean checkout gates

The checkout began clean at the exact candidate SHA.

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 140 packages installed from lockfile |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `npm test` | PASS — 2 files, 10 tests |
| `npm run check` | PASS — TypeScript project build |
| Lint | N/A — no lint script or configuration exists |
| `npm run build` | PASS — exact production build; `dist/index.html` emitted |
| `npm run test:e2e` | PASS — 26 passed, 12 intentional project skips |
| `npm run test:e2e:repeat` | PASS — 52 passed, 24 intentional project skips |

The repeated 76-execution browser matrix remained stable and did not reproduce
the earlier Chromium lifecycle failure.

## Deployment identity and delivery policy

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed twice after fresh builds.

- Root/demo/privacy/terms SHA-256:
  `85bc1018ac4b507e12482dcb1c852c5b56a35a5769ec18c140635ccf62068d15`
- Service worker SHA-256:
  `dc42ffd8709dce33f979669a171d167a3254c133b3242ddbb0e0cae119c09cc7`
- Manifest SHA-256:
  `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

HTML, the manifest, and the worker use `no-cache`; a conditional root request
returned 304. Initial hashed JS/CSS use
`public, max-age=31536000, immutable`. The manifest has the correct MIME type.
The response sends the configured restrictive CSP, denied ambient permissions,
`DENY` framing, COOP/CORP, `nosniff`, strict-origin referrer policy, and
two-year preload HSTS. An unknown path returns the styled HTTP 404 with a link
home. The factory URL verifier passed in 1,013 ms with one `h1`, `lang=en`, a
`main`, complete alt text, named buttons, and no root console/page error.

## Independent product workflows

- Created a payment-trail packet with representative invoice, client,
  jurisdiction, and lowercase currency values. Currency normalized to `USD`.
- Attached known bytes, saw SHA-256
  `9f68e6977ff7ed7b5a1f54ebe74e3e40db4ce2dd524902f256b596afa99b4f99`,
  reloaded, and retained the attachment and packet.
- Exported a live ZIP and inspected it independently. Its manifest was
  `invoice-evidence-manifest/v1`; filename redaction produced
  `evidence/01-evidence.txt`; states were one `present`, three
  `missing-required`, and two `not-provided-optional`.
- A real 104,857,600-byte file was accepted as `100.0 MB`. Its displayed
  digest matched independent SHA-256
  `20492a4d0d84f8beb1767f6616229f85d44c2827b64bdbfb260ee12fa1109e0e`.
  A 104,857,601-byte file was rejected, stored no file, and instructed the user
  to choose a smaller one.
- Whitespace-only packet names remained in the dialog, set `aria-invalid`,
  returned focus to the field, and recovered after correction. Cancelling a
  named checklist-item removal preserved the item.
- A structurally wrong JSON backup (`{}`) showed “This is not a supported
  Invoice Packet backup.” and preserved the current packet. Syntactically
  broken JSON exposed a raw parser error; this is the release blocker below.
- A five-character encryption password stayed invalid with a native length
  instruction. Mismatched valid-length passwords showed a specific correction;
  matching values then produced the encrypted ZIP.
- The checkout dialog showed `$19, one time`, the exact Sociobot hosted
  checkout URL, and the license restore form. The external link was not
  followed.

## Accessibility, responsive behavior, and privacy

- Playwright Axe found zero serious or critical issues in light editor and
  dark 390 px demo states. Lighthouse accessibility scored 100 in all five
  live runs.
- Keyboard-only navigation reached the skip link first with a 3 px solid focus
  outline. Native dialog focus moved inside and returned to its opener on
  Escape. No keyboard trap was found.
- At 390 px, document and viewport widths were both 390 px. Every sampled
  visible button, button-link, and checkbox label was at least 44×44 CSS px.
  A 320 px reflow check also had no horizontal overflow.
- Reduced-motion styles computed to 0.01 ms animation/transition duration and
  automatic scrolling. No looping or flashing motion exists.
- Desktop and mobile runs produced no page error, console error, or failed
  request. Twenty-four requests across the full normal/demo workflow were all
  same-origin. Static inspection found no analytics, tracking, remote font,
  document upload, auth, or document-backend path.
- `/privacy/` and `/terms/` returned 200 with route-specific titles, canonical
  URLs, one `h1`, and the expected plain-language data/payment terms.

## PWA and performance

- A fresh live installation created one versioned cache with 14 entries and
  322,763 bytes. No PDF font or `fontkit` export chunk was precached.
- Live `/demo/` reloaded offline, retained the sample, and displayed the
  offline state.
- A controlled byte change to the exact built worker installed a waiting
  worker and displayed **Update now**. Activating it preserved an existing
  packet and the new worker then reloaded that packet offline with no errors.
  The generated `dist/` was rebuilt immediately afterward to restore the exact
  candidate artifact.
- Initial application JS is 46,740 bytes (16,200 gzip), CSS is 21,297 bytes
  (5,510 gzip), and the mobile hero WebP is 32,908 bytes. No font loads on the
  initial page. Export libraries and full PDF fonts remain lazy.
- Five cold mobile Lighthouse runs scored Performance 87, 87, 98, 96, and 95;
  the median is **95**. Accessibility, Best Practices, and SEO were 100 in
  every run. LCP ranged 1.11–1.33 s, CLS was 0, and transfer was 59–71 KB.
  TBT varied from 150.5–505.5 ms; two exact local-build runs scored 98/99 with
  113–135 ms TBT. A separate 4× CPU-throttled first interaction measured
  128 ms through the Event Timing API.

This static PWA has no product-owned backend, account system, health endpoint,
server persistence, library package, or CLI. Concurrency, health, consumer
installation, and Entra checks are not applicable. The shared Sociobot billing
checkout/verification service was not contacted because the work order forbids
connecting to resources outside the product scope; therefore no shared billing
allowance or 429/`Retry-After` value was observed.

## Defects

### Medium, release-blocking — malformed backup error is a raw parser message

Reproduction:

1. Create any packet and choose **Import backup**.
2. Select a `.json` file containing `{not valid` and accept the replacement
   confirmation.
3. Observe the status message.

Actual: `Expected property name or '}' in JSON at position 1 (line 1 column 2)`.
The existing packet is preserved, but the message neither says that the backup
is damaged nor tells the user to choose a valid Invoice Packet backup. It is
browser-specific implementation language. Catch JSON parse failures and use a
plain message such as “This backup file is damaged or not valid JSON. Choose an
Invoice Packet JSON backup and try again.” Add a browser regression for the
syntax-error case.

### Low — the binary file limit is labelled with the decimal unit

The production predicate and declared claim accept 100 MiB (104,857,600
bytes), but the evidence control and rejection message say “100 MB.” State
“100 MiB” in both places, or change the predicate and claim to decimal MB.

## Coverage limits

Safari and Firefox installed-PWA behavior were unavailable. A real hosted
purchase and shared billing rate-limit probe were intentionally excluded by
the resource-isolation instruction. These limits did not hide the release-
blocking local input-error defect.
