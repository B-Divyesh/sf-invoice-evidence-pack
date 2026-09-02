# Independent verification 12 — PASS

**Candidate:** `4e69125c0e4674f4dd8427b718d75957b37a9e51`  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-09-02 UTC  
**Work order:** `invoice-evidence-pack-verify-12`

## Verdict

**PASS.** The live PWA matches the candidate build byte-for-byte at the root,
demo, legal routes, manifest, service worker, and immutable entry assets. All
22 declared claim commands pass. The previous first-use offline-export defect
is fixed: a fresh live demo produced an inspected ZIP and multilingual PDF
after going offline before either export had been used.

No release-blocking or lower-severity product defect was confirmed.

## First-read and demo gate

A cold 1440×900 live visit answers all three required questions in the first
viewport:

- What it does: “Build a complete invoice evidence packet.”
- Who it is for: cross-border freelancers and small firms preparing files for
  an accountant, client, or filing review.
- What to do first: **Try it with sample data**.

The action opens the realistic Kite Studio sample in one click. The page says
the sample is a separate workspace. The persistent demo banner says nothing is
saved to real packets and provides **Reset demo** and **Start for real**.

## Declared claims

`.factory/claims.json` is present with 22 entries. After `npm ci`, every listed
command was run separately and exactly as written: **22/22 passed**. A source
count found exactly one `@claim:<id>` occurrence for every entry.

Passed IDs: `demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`,
`missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`,
`json-backup`, `backup-import`, `offline-reload`, `aes-zip`,
`custom-templates`, `license-restore`, `checkout-operator-gate`,
`configurable-checklists`, `no-document-backend`, `no-account-required`,
`pwa-installable`, `free-exports`, `core-no-setup`, and
`license-verification-minimum-data`.

The live landing page and README were cross-checked against the manifest. No
unlisted user-facing product claim was found.

## Clean-checkout quality gates

- `npm ci`: passed; 140 packages installed and npm reported 0 vulnerabilities.
- `npm test`: passed, 11/11 tests in two files.
- `npm run check`: passed the TypeScript project check.
- Lint: no lint script or lint configuration is present.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: passed, 41 tests with 17 intentional project skips.
- `npm run test:e2e:repeat`: passed, 82 tests with 34 intentional skips.

The test matrix covers exact 100 MiB acceptance and 100 MiB + 1 byte
rejection, duplicate filenames, Unicode PDF text, AES-256 ZIP decryption and
wrong-password rejection, backup attachment round-trip, template selection,
license restore, persistence, missing-item flags, and all free exports.

## Independent product workflow

In a fresh live normal workspace, keyboard navigation reached and opened the
new-packet dialog. A whitespace-only name was rejected, marked
`aria-invalid=true`, explained in plain words, and kept focus. A Payment Trail
packet then stored invoice metadata, EUR currency, reviewer notes, and a known
file across reload. Its displayed SHA-256 matched the independently calculated
digest `2707e358aabcf410671f5bd70de987fea32db26cb5694674685531534d4dcce6`.

A filename-redacted ZIP contained `01-evidence.txt`; its manifest retained the
exact digest, marked three required items missing, and marked the optional item
not provided. A full JSON backup contained the packet. Importing malformed JSON
showed the documented recovery message and did not replace the saved packet.

The isolated demo separately exercised the complete case: four of four
required items, four evidence files, ZIP/PDF export, reset, and a separate
`demo:invoice-packet` IndexedDB namespace.

## PWA and previous regression

In a fresh live context, the standalone manifest, versioned start URL, 192/512
icons, and controlling service worker were present. `registration.update()`
completed with the current worker active and no waiting or installing worker.

Before either export was used, cache `invoice-packet-dc38210ab242` contained 22
resources: all seven emitted JavaScript modules and the two compact PDF fonts,
with no full fallback font. After the browser went offline and reloaded:

- the demo remained usable and displayed **Offline**;
- ZIP export contained the manifest, README, and four sample evidence files;
- the manifest named `Kite Studio · August client review` and reported four
  present items;
- PDF text contained the packet title and `Aozora 株式会社`;
- there were no failed requests, console errors, or external requests.

This closes the high-severity defect from verification 11.

## Privacy, deployment identity, and response policy

The normal create/attach/reload/export/backup/recovery flow made only
same-origin requests. Cold root, demo, mobile, and offline logs likewise had no
analytics, document uploads, third-party scripts/fonts, console errors, page
errors, or failed online subresources.

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed policy and byte identity:

- root: `61aac3a519a2396ea5fe62185793b4d6fba5ff22b63486030cfac13b8b1fb557`
- service worker: `3d5e14729c6bd29785bfd2673e9a7f072b3f7184f5075977b1ad9fe95164a2f0`
- manifest: `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`
- demo: `fff9b7c17e1b0247b30b769804c7c513a8c231f82077ed6690006a11475f6bf5`
- privacy: `ea3390587bd6ef54dce591e841afd7f4070ab6d9da229dddf9d93bf730eee05e`
- terms: `02cae08221876bc95474cef6bf756ffd193bd7faf006d20dd3fc8726767adf19`

Documents, manifest, and worker use `no-cache`; hashed entry JS/CSS use
`public, max-age=31536000, immutable`. Responses include the declared CSP,
HSTS, `nosniff`, strict-origin referrer policy, denied ambient permissions,
`DENY` framing, and same-origin COOP/CORP. Every discovered link returned 200;
an unknown route returned HTTP 404.

The optional public license-verification endpoint was tested with an invalid
fixture token. It allowed 30 requests from one client; request 31 returned 429
with `Retry-After: 4`. The response allowed the product origin. Checkout is
operator-gated and absent from the default build.

This product has no document backend, account sign-in, database server,
library package, or CLI. Backend concurrency, persistent server state, Entra
authority, and clean-consumer package checks do not apply.

## Accessibility, mobile, and performance

- The fleet URL verifier passed in 783 ms with a title, `lang=en`, one `h1`, a
  `main`, complete image alt text, labelled buttons, and no console errors.
- Axe found zero violations at any impact level on the light landing page,
  dark landing page, desktop demo, and 390px demo.
- The first Tab focused the skip link with a visible 3 px outline. The complete
  new-packet path was keyboard reachable. Dialog validation returned focus to
  the invalid field.
- At 390×844, client and scroll width were both 390 px. Visible composite file
  and checkbox targets measured at least 44 px high.
- At 200% root text size, the 1280px audit retained visible main content with
  no horizontal overflow.
- Reduced-motion matched and reduced maximum animation/transition duration to
  `0.00001s`; scroll behavior was `auto`.
- Three Lighthouse mobile runs scored performance **89/96/100**,
  accessibility **100/100/100**, best practices **100/100/100**, and SEO
  **100/100/100**. Median performance is 96. LCP was 1.11–1.36 s and CLS 0.
- Lighthouse transferred 71.6–71.7 KiB. Initial executable JS is 48,189 bytes
  raw / 16,407 bytes gzip; CSS is 21,297 / 5,527 bytes; the mobile hero is
  32,908 bytes. No font loads on first paint. All are within stated budgets.

The build warning concerns a 716,756-byte lazy PDF font-processing chunk. It
is not part of initial execution and is cached for first-use offline export.

## Defects and known boundaries

No defects were confirmed.

The complete Japanese and Devanagari fallback fonts remain on-demand and are
not preinstalled because they total about 5.1 MiB. The bundled demo and compact
script subsets work fully offline. A service-worker replacement transition
cannot be forced without publishing a different worker; the current update
check completed, and source/tests cover `updatefound`, `SKIP_WAITING`, and
`controllerchange`.

## Evidence

Evidence is under [`.factory/evidence/verification-12/`](evidence/verification-12/):
live workflow and offline-export JSON, response headers, rate-limit results,
link crawl, accessibility results, screenshots, URL smoke output, and three
Lighthouse reports.
