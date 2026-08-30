# Independent verification 6 — FAIL

**Candidate:** `1e860a550f1b14d716574777c2e724015d91eddf`

**Live URL:** <https://invoice-evidence-pack.sociobot.in>

**Verified:** 2026-08-30 UTC

**Work order:** `invoice-evidence-pack-verify-6`

## Verdict

**FAIL for release acceptance.** The live deployment is byte-for-byte the
requested candidate, the cold first-read gate passes, and every declared claim
test passes after a clean install. The normal local-first workflow, invalid
input recovery, exports, privacy, offline reload/update, responsive layout,
axe scans, Lighthouse, and response policy also pass.

Release remains blocked by five independent contract failures:

1. `npm run test:e2e` fails reproducibly because the pinned Chromium process
   segfaults between the first and second tests.
2. New users cannot buy the one-time license needed for encrypted ZIPs and
   reusable templates; the production UI explicitly says purchases are
   unavailable and renders no checkout link.
3. The first service-worker install precaches 6,900,341 bytes, including
   5,151,992 bytes of PDF fonts, far above the 120 KB font budget.
4. Visible checklist checkbox targets are 40 px high, and the update action is
   styled to 36 px, below the required 44 px touch target.
5. Prominent landing/README claims are absent from `.factory/claims.json`,
   despite the rule that every user-facing claim must have a manifest entry
   and one tagged test.

## First-read and demo gate

A fresh 1440×900 Chromium context opened the live root before source review.

- **What it does:** “Build a complete invoice evidence packet.”
- **For whom:** “cross-border freelancers and small firms” preparing files for
  an accountant, client, or filing review.
- **What to do first:** **Try it with sample data** is visible in the first
  viewport and opens `/demo/` in one click.
- The demo immediately shows the realistic “Kite Studio · August client
  review” packet at 4/4 required items, plus the persistent sample-data banner,
  **Reset demo**, and **Start for real**.
- A fresh demo context contained only IndexedDB `demo:invoice-packet`.
  **Start for real** cleared the banner and returned to `/`; normal data used
  only `invoice-packet`.

The mandatory first-read/demo gate therefore passes.

## Declared claim tests

`.factory/claims.json` exists. It declares 13 claims, and each claim tag occurs
exactly once in the test sources. After `npm ci`, every listed command was run
exactly as written and passed:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | One click opened the seeded, bannered demo. |
| `local-only` | PASS | Demo request log contained no third-party request. |
| `sha256-hash` | PASS | Known bytes matched the fixed SHA-256 digest. |
| `file-size-limit` | PASS | 100 MiB accepted; the next byte rejected. |
| `missing-flags` | PASS | Manifest states matched present/required/optional evidence. |
| `filename-redaction` | PASS | Neutral indexed name and redaction flag verified. |
| `duplicate-zip` | PASS | Two distinct `proof.pdf` files survived in separate ZIP entries. |
| `unicode-pdf` | PASS | Devanagari and Japanese metadata survived independent extraction. |
| `json-backup` | PASS | Blob bytes and metadata survived backup round-trip. |
| `backup-import` | PASS | Fresh empty state restored a complete packet. |
| `offline-reload` | PASS | A controlled browser context reloaded the app offline. |
| `aes-zip` | PASS | AES strength 3 decrypted correctly and rejected a wrong password. |
| `custom-templates` | PASS | Demo-saved checklist appeared for a new packet. |

The claim tests passed individually. The broader claim inventory is incomplete;
that separate defect is recorded below.

## Clean checkout and repository gates

The checkout began at exactly the candidate SHA. `npm ci` installed 140
packages from the lockfile and reported no vulnerabilities.

| Gate | Result |
| --- | --- |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `npm test` | PASS — 2 files, 10 tests |
| `npm run check` | PASS — `tsc -b` |
| Lint | N/A — no lint script/configuration exists |
| `npm run build` | PASS — exact production command; `dist/index.html` exists |
| `npm run test:e2e` | **FAIL twice** — 20 passed, 5 skipped, 1 failed |
| Isolated failed scenario | PASS — packet create/hash/persist/export test passed alone |

Both complete E2E runs failed at
`tests/e2e/app.spec.ts:37`, before the packet test could obtain a new browser
context. The pinned Playwright 1.58.2 Chromium headless shell received
`SIGSEGV / SEGV_MAPERR 0x1b0`; Playwright then reported
`browser.newContext: Target page, context or browser has been closed`.
Available memory was 2.8 GiB, the standard `--disable-dev-shm-usage` flag was
present, and the same scenario passed in isolation. This looks like a
browser-process/harness interaction rather than a failed app assertion, but
the required repository command is reproducibly non-zero and the release gate
is not green.

## Candidate/deployment identity and delivery policy

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed the shipped policy and local/live byte identity:

- root/demo/privacy/terms:
  `18f27b5b87c809cbd07920973ab5a1c519a03e986f80bd1bc1a09752184d554b`
- service worker:
  `1913d99628d77bfd820e31e2ca82cd8ab2e103d8fdb12f153a7169416a0bcd52`
- manifest:
  `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`

The root, manifest, and worker use `no-cache`; a conditional root request
returned 304. Initial hashed JS/CSS use
`public, max-age=31536000, immutable`. Headers include the exact restrictive
CSP, denied ambient permissions, `DENY` framing, COOP/CORP, `nosniff`,
strict-origin referrer policy, and two-year preload HSTS. Manifest MIME is
correct. Unknown paths return the styled HTTP 404.

The factory URL verifier passed in 1,243 ms with a descriptive title,
`lang=en`, one `h1`, one `main`, complete image alt attributes, named buttons,
and no root console error.

## End-to-end product evidence

Independent live Playwright checks, separate from the repository suite,
covered normal, boundary, invalid, and recovery paths:

- Created and persisted a packet with client, invoice, jurisdiction, and
  lowercase currency; attached evidence, observed the success notice, reloaded,
  and exported a correctly named ZIP.
- A real sparse file of exactly 104,857,600 bytes was accepted. Its displayed
  digest `20492a4d0d84…a1109e0e` matched independent SHA-256. A
  104,857,601-byte file was rejected with “Choose a smaller file.”
- Whitespace-only packet and checklist names stayed in the dialog, showed
  specific errors, set `aria-invalid`, and returned focus. Recovery succeeded.
- A malformed backup showed “This is not a supported Invoice Packet backup”
  and preserved the existing packet. Cancelling a named item-removal dialog
  preserved all six items.
- Passwords shorter than ten characters remained invalid; mismatched passwords
  showed a specific error and kept the encryption dialog open.
- Duplicate ZIP names, Unicode PDF extraction, complete JSON backup/import,
  AES-256 ZIP behavior, filename redaction, and template reuse also passed the
  declared browser/unit claims.
- The production purchase dialog displayed “New purchases are temporarily
  unavailable,” contained zero buy links, and retained existing-license
  restore.

## Accessibility, responsive behavior, privacy, and PWA

- Independent axe scans of empty light, empty dark, demo desktop, and
  390×844 reduced-motion states found **0 serious or critical violations**.
- Tab order starts at **Skip to main content**. Fourteen sampled interactive
  elements all had a visible 3 px solid ochre focus ring. Native dialogs moved
  focus inside and returned it to the opener on Escape.
- Reduced-motion computed styles removed meaningful animation/transition.
  There was no horizontal overflow at 390 px or 320 px. Desktop and mobile
  checks had no console or page errors.
- Normal create/attach/export and demo activity made only same-origin requests.
  Static review found no analytics, remote script/font, document backend, or
  upload path. The only cross-origin code path is explicit Sociobot license
  verification; it was not invoked.
- Live offline reload preserved the demo and showed **Offline**. A controlled
  exact-dist worker update displayed **Update now**, activated the waiting
  worker, retained IndexedDB data, and reloaded offline with no errors.
- The manifest is standalone with a versioned start URL and real 192/512 icons;
  the social image is 1200×630.

This static product has no sign-in, product-owned backend, health endpoint,
server persistence, library package, or CLI. Entra, concurrency, health, and
consumer-install checks are not applicable. The optional shared Sociobot
billing API was not probed because the work order expressly forbids connecting
to resources outside `sf-invoice-evidence-pack`; the live build also exposes no
new-purchase call. No product-owned request allowance exists to measure. Once
billing is enabled, its 429/`Retry-After` behavior still needs fresh authorized
verification.

## Performance and bundle evidence

Lighthouse 13.4.1 mobile, rerun after an initial Chromium tab crash with the
standard `--disable-dev-shm-usage` flag, scored:

- Performance **98**
- Accessibility **100**
- Best Practices **100**
- SEO **100**
- FCP **1.233 s**, LCP **1.233 s**, TBT **158.5 ms**, CLS **0**
- Visible initial transfer **71,142 bytes**

Initial UI budgets pass: main JS is 45,999 bytes / 15,979 gzip, CSS is 21,281
bytes / 5,523 gzip, and the mobile hero WebP is 32,908 bytes. Export libraries
are lazy chunks. The offline-install transfer does not pass: CacheStorage
contained 29 entries totalling 6,900,341 bytes immediately after worker
installation. The Japanese PDF font alone is 4,968,584 bytes; the Devanagari
font is 183,408 bytes.

## Defects

### High — the required full E2E gate reproducibly exits non-zero

Run `npm run test:e2e` after `npm ci`. In two consecutive runs, pinned Chromium
segfaulted between the first and second tests. Playwright reported 20 passed,
5 skipped, and 1 failed. The affected functional test passes alone, but the
contract requires the complete command to pass locally. Stabilize the browser
test lifecycle or pinned browser, then prove the exact full command green.

### High — a new user cannot obtain the required one-time license

Open **Restore an existing license** in production. The dialog says new
purchases are temporarily unavailable and renders no checkout action. The
brief requires one-time monetization and encrypted export; the paid-unlock
contract requires a Sociobot checkout link. Demo fixtures and an existing-token
form do not let a new real user obtain encrypted ZIPs or custom templates.
Enable only the registered Sociobot product after its hosted checkout works,
then verify return-token capture, restore, and rate limiting within scope.

### High — first offline installation downloads a 6.9 MB precache

The generated worker precaches every build asset, including lazy export code
and both PDF fonts. A fresh CacheStorage measurement totalled 6,900,341 bytes;
the two fonts total 5,151,992 bytes versus the 120 KB font budget. Lighthouse's
71 KB visible load hides this background install transfer. Subset the export
fonts further and runtime-cache export-only code/fonts after first use instead
of precaching them.

### Medium — some touch targets are below 44 px

At 390 px, each visible per-item **Required** checkbox label measured about
103.5×40 px. CSS also sets the update notice button to a 36 px minimum height.
The repository test checks only file-slip and delete controls, so it misses
these targets. Raise all effective labelled hit areas to at least 44×44 px and
extend the regression to every visible interactive control/state.

### High — user-facing claims are missing from the claims manifest

All 13 listed claims pass, but the cross-check found prominent additional
claims with no corresponding `.factory/claims.json` entry, including:

- “Free ZIP, PDF, and JSON exports” on the landing page.
- “Installs as a PWA” in the README.
- “there is no document backend or analytics” in the README/privacy copy.
- configurable filing/client/payment-trail checklists in the README.

Some behavior is incidentally exercised elsewhere, but the claims contract
requires each relied-on statement to be listed and backed by exactly one
tagged observable test. Add entries/tests or narrow the copy.

## Coverage limits

Safari and Firefox installed-PWA behavior were unavailable. A real purchase
could not be exercised because the production UI disables checkout. The shared
billing endpoint was not contacted due the explicit resource-isolation order.
These limits do not change the FAIL verdict.
