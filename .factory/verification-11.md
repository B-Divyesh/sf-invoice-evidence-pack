# Independent verification 11 — FAIL

**Candidate:** `5ed131b535e1a23ef93bf6d830d52d8f8ed1e085`

**Live URL:** <https://invoice-evidence-pack.sociobot.in>

**Verified:** 2026-09-01 UTC

**Work order:** `invoice-evidence-pack-verify-11`

## Verdict

**FAIL.** The live deployment matches the candidate and the declared claim
commands all pass, but the smallest useful product does not work end to end
offline. After a fresh successful visit, a service-worker-controlled demo
reloads offline, but its first ZIP and PDF exports both fail because the
export chunks are not in the app-shell cache. This contradicts the first-screen
claim “Works offline after the first visit” and the researched contract for an
offline packet builder with ZIP/PDF export.

## Release-blocking defect

### High — first-use ZIP and PDF exports fail offline

Reproduction against the live candidate in a fresh Chromium context:

1. Open `https://invoice-evidence-pack.sociobot.in/?demo=1` online.
2. Wait for `navigator.serviceWorker.controller` and confirm cache
   `invoice-packet-1431eb942f2d` exists.
3. Do not use any export online. Set the browser context offline.
4. Choose **Export ZIP packet**. No download starts; the app says, “The ZIP
   could not be prepared. Try again or export a backup.”
5. Choose **Export PDF manifest**. No download starts; the app says, “The PDF
   could not be prepared. Try the ZIP manifest instead.”

The browser recorded failed first-use requests for
`/_app/index-CxjpqVDI.js`, `/_app/runtime-DdLkqw21.js`, and
`/_app/_commonjsHelpers-CqkleIqs.js`, each with `net::ERR_FAILED`. The service
worker source intentionally precaches only the entry shell and leaves export
libraries for later network fetches. The complete evidence is
[`offline-first-export.json`](evidence/verification-11/offline-first-export.json).

The declared `@claim:offline-reload` check only reloads the shell and checks
the heading/offline state. It does not exercise the sample packet's core ZIP
or PDF job. Therefore it does not prove the broader landing-page sentence
“Works offline after the first visit.” The claim gate passes while the user
outcome fails.

Required repair: make first-use core exports available after the initial
successful visit, then extend the offline claim test to enter the isolated
demo, go offline before any export has loaded, download ZIP and PDF, and
inspect both outputs. Keep the first-load performance budget in view when
changing the cache strategy.

## First-read and demo gate

The first-read gate itself passes. A cold live root page plainly says:

- What it does: “Build a complete invoice evidence packet.”
- Who it is for: cross-border freelancers and small firms preparing files for
  an accountant, client, or filing review.
- What to do first: **Try it with sample data**.

That action is on the first screen and opens the separate sample workspace in
one click. The demo shows the persistent “Demo — sample data, nothing is saved
to your packets” banner, **Reset demo**, **Start for real**, a realistic Kite
Studio packet, and `4 of 4 required items collected`. Screenshot:
[`first-read-desktop.png`](evidence/verification-11/first-read-desktop.png).

## Declared claims

`.factory/claims.json` is present with 22 entries. From this checkout after
`npm ci`, every listed `test` command was run separately and exactly as
written. Result: **22/22 passed**, with exactly one source tag for each claim
ID.

Passed IDs: `demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`,
`missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`,
`json-backup`, `backup-import`, `offline-reload`, `aes-zip`,
`custom-templates`, `license-restore`, `checkout-operator-gate`,
`configurable-checklists`, `no-document-backend`, `no-account-required`,
`pwa-installable`, `free-exports`, `core-no-setup`, and
`license-verification-minimum-data`.

The offline defect above is not a failed declared command; it is a mismatch
between what that narrow command proves and what the live first-screen claim
and researched offline-product contract promise.

## Clean checkout quality gates

- `npm ci`: passed; 140 packages installed from the lockfile and npm reported
  zero known vulnerabilities.
- `npm test`: passed, 11/11 tests in two files.
- `npm run check`: passed the TypeScript project check.
- `npm run build`: passed and produced `dist/`. There is no lint script or lint
  configuration.
- `npm run test:e2e`: the first attempt ended with Chromium's own SIGSEGV after
  41 passes; no product assertion caused the crash. A fresh exact rerun passed
  42 tests with 16 intentional project skips.
- `npm run test:e2e:repeat`: passed 84 tests with 32 intentional project skips.

The production build warns about a chunk over 500 kB, but the large export and
font chunks are lazy. Initial entry JS is 48.19 kB raw / 16.45 kB gzip and CSS
is 21.30 kB raw / 5.51 kB gzip, within the static budgets.

## Independent end-to-end checks

A fresh live normal workspace recovered from a whitespace-only packet name,
created a Payment trail packet, collected four evidence files, saved reviewer
notes, and reached `4 of 4 required items collected`. A filename-redacted ZIP
contained `01-evidence.txt` through `04-evidence.txt`, retained the exact bytes,
recorded four 64-character SHA-256 hashes, marked the optional item explicitly,
and reported 100% completion. A damaged JSON import produced a plain recovery
message and did not replace the existing packet. No external request or browser
error occurred. See
[`live-e2e-audit.json`](evidence/verification-11/live-e2e-audit.json).

The repository tests also covered the exact 100 MiB accepted boundary and the
next byte rejected, duplicate source filenames, Devanagari/Japanese PDF text,
AES-256 ZIP decryption and wrong-password rejection, backup attachment
round-trip, custom templates, and existing-license restore.

## Deployment identity, privacy, and server allowance

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed response policy and local/live byte identity:

- root: `61aac3a519a2396ea5fe62185793b4d6fba5ff22b63486030cfac13b8b1fb557`
- service worker: `55aec51864548ba7efd45bd615a201fb35c5bfe86300d2949a5a938f2f2fb1ba`
- manifest: `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83`
- demo: `fff9b7c17e1b0247b30b769804c7c513a8c231f82077ed6690006a11475f6bf5`
- privacy: `ea3390587bd6ef54dce591e841afd7f4070ab6d9da229dddf9d93bf730eee05e`
- terms: `02cae08221876bc95474cef6bf756ffd193bd7faf006d20dd3fc8726767adf19`

Fresh root/demo workflow logs contained only the product origin. There were no
analytics, document uploads, third-party scripts/fonts, console errors, page
errors, or failed requests while online. License verification was separately
confirmed to send only its token. The public product-license verifier allowed
30 requests from one client; request 31 returned **429** with
`Retry-After: 4`.

Live responses set HSTS, a restrictive CSP, `nosniff`, strict-origin referrer
policy, denied ambient permissions, `DENY` framing, and same-origin COOP/CORP.
Documents, manifest, and worker use `no-cache`; hashed JS/CSS use
`public, max-age=31536000, immutable`. The designed unknown route returns HTTP
404. Every discovered internal and external link returned 200.

This is a static PWA with no document backend or sign-in, so backend
concurrency, SQLite boundaries, Entra authority, and package-consumer checks do
not apply.

## Accessibility, mobile, PWA, and performance

- The fleet `verify-url.sh` passed in 916 ms: title, `lang=en`, one `h1`, one
  `main`, complete image alt attributes, labelled buttons, and no console
  errors.
- Fresh Axe runs on root and demo in desktop light, desktop dark, and 390 px
  mobile found no violations at any impact level.
- At 390×844, document width was 390 px with no horizontal overflow. The first
  Tab reached the skip link with a visible 3 px outline. Keyboard-only tabbing
  opened the new-packet dialog; a whitespace-only name retained focus and set
  `aria-invalid=true` with an error description.
- Reduced-motion media matched; transition and animation duration resolved to
  `0.00001s`, and scrolling resolved to `auto`.
- The manifest is standalone with versioned start URL and 192/512 maskable
  icons. `registration.update()` completed with the current worker active, no
  waiting worker, and the controlled app shell reloaded offline. Core exports
  then failed as detailed above.
- Two Lighthouse mobile runs scored performance 100/99, accessibility 100/100,
  best practices 100/100, and SEO 100/100. LCP was 1.3/1.5 s, TBT 50/130 ms,
  CLS 0/0, and transfer 58/70 KiB. INP had no field/sample interaction value.

Browser audit and screenshots are under
[`evidence/verification-11/`](evidence/verification-11/).

## Retest gate

Do not release this candidate as an offline PWA. Retest from a new browser
profile after the repair: visit the demo once, verify neither export has been
used, go offline, reload, and inspect newly downloaded ZIP and PDF outputs.
All 22 declared claims and the full desktop/mobile suite must continue to pass.
