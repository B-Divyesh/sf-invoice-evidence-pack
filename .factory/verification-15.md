# Independent verification 15 — PASS

**Candidate:** `bbe4a46b9257af27707eaf3d8dc08fe97b67cf15`

**Live URL:** <https://invoice-evidence-pack.sociobot.in>

**Verified:** 2026-09-02 UTC

**Work order:** `invoice-evidence-pack-verify-15`

## Verdict

**PASS.** The deployed PWA matches the candidate build and completes the
researched job end to end. All 25 declared claim commands passed. The normal
and demo workflows, local data boundary, exports, offline behavior,
accessibility baseline, response policy, and license rate limit passed. No
product defect was confirmed.

## Mandatory first-read and demo gate

A cold 1440×900 and 390×844 visit showed **Build a complete invoice evidence
packet.** It names cross-border freelancers and small firms preparing files
for an accountant, client, or filing review. The primary action is **Try it
with sample data**, followed by a plain explanation that it opens a separate
workspace. This answers what the product does, who it serves, and what to do
first.

One keyboard-activated click opened the populated Kite Studio sample. After
initialization, focus moved to **Your packets** and the polite live region said
**Opened Your packets**. The persistent banner says **Demo — sample data,
nothing is saved to your packets** and provides **Reset demo** and **Start for
real**.

## Claims gate and clean-checkout checks

The checkout began at the exact candidate SHA. `npm ci` installed the locked
dependencies with zero reported vulnerabilities. `.factory/claims.json`
contains 25 entries. Every listed command was run separately and exactly as
declared, and all passed:

- `demo-sandbox`, `local-only`, `sha256-hash`, `manifest-fingerprints`
- `file-size-limit`, `missing-flags`, `filename-redaction`, `duplicate-zip`
- `unicode-pdf`, `json-backup`, `backup-import`, `offline-reload`
- `aes-zip`, `custom-templates`, `license-restore`, `license-revocation`
- `offline-license-verdict`, `checkout-operator-gate`
- `configurable-checklists`, `no-document-backend`, `no-account-required`
- `pwa-installable`, `free-exports`, `core-no-setup`
- `license-verification-minimum-data`

The test sources contain exactly one `@claim:<id>` occurrence for every
declared claim and no undeclared claim tags. The landing page, legal copy, and
README were cross-checked against the inventory and copy audit; no unsupported
positive product promise was found.

Other gates:

- `npm test`: **11/11 passed**.
- `npm run check`: **passed**. There is no separate lint script.
- `npm run build`: **passed** and produced `dist/`.
- `npm run test:e2e`: **52 passed, 20 intentional project skips**.
- `npm run test:e2e:repeat`: clean rerun **104 passed, 40 intentional skips**.
- `/opt/fleet/lib/verify-url.sh`: **passed** in 965 ms with title, `lang="en"`,
  one h1, main landmark, image alt text, labelled buttons, and no console error.

The first repeat-suite attempt ended after 103 passes when Chromium itself
segfaulted while opening a new context. The affected configurable-checklists
test passed in the mandatory claim run, the full suite, an immediate isolated
rerun, and the clean repeat-suite rerun. This was runner instability, not a
product assertion failure.

## End-to-end product evidence

A fresh live normal workspace rejected a whitespace-only packet name, showed
the specific recovery message, set `aria-invalid="true"`, and returned focus
to the name field.

A Payment trail packet used invoice `INV-EDGE-100`, client `山田商事`, India /
Japan context, JPY currency, reviewer notes, and a known evidence file. It
survived reload. The ZIP contained `manifest.json`, `README.txt`, and the
evidence file. The manifest reported one of four required items present, three
`missing-required` items, and one optional item not provided. Its full digest
`f02736859768a6b9a8cd45bffe89b2f5712bbb58180fe8b23a5ac24ac8bf1a0a`
matched an independent SHA-256 calculation and the JSON backup. The PDF
preserved the Japanese metadata, all evidence states, digest, and notes.

Boundary and recovery behavior passed in the live UI: a 100 MiB file attached
and persisted after reload; 100 MiB plus one byte was rejected and left the
input empty. A malformed JSON backup produced the documented recovery message
without deleting the packet or attachment. Declared tests also covered
duplicate filenames, filename redaction, encrypted ZIP correct/wrong
passwords, Unicode PDF text, incomplete-packet confirmation, backup restore,
license revocation, and offline license reconciliation.

## Live identity, privacy, and server behavior

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed response policy and candidate byte comparison. Live SHA-256 identities:

| Resource | SHA-256 |
| --- | --- |
| `/` | `4c3a8c421ccdf14799f4f71da0154e9c57d10a2206ffc442a95bcc44b1fc5176` |
| `/sw.js` | `249715286efd920bd03d0539c3e4b613bd2e8bc7fec2b7dc68889a927eb172dc` |
| `/manifest.webmanifest` | `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83` |
| `/demo/` | `bf60674ce0bd3450898be4e4d3c1679f2c947bb49362fe2910d4aa030994a915` |
| `/privacy/` | `4579bc0874fbc94855013e6564b6dc4356f5d4b3026fb58ede42553706242698` |
| `/terms/` | `a52c16f07bc97cbf2cb7380dc956cfe2caf7f40c4bc76064e8b7069b441c18a1` |

Fresh browser request logs for the landing page, demo, normal create/attach/
export workflow, and legal routes contained only the product origin. There
were no analytics, document uploads, third-party scripts or fonts, failed
requests, console errors, or page errors. License-verification fixture coverage
confirms that only the token query parameter is sent.

HTML, the service worker, and the manifest use `Cache-Control: no-cache`.
Hashed JS/CSS use `public, max-age=31536000, immutable`. CSP, HSTS, `nosniff`,
strict-origin referrer policy, Permissions-Policy, DENY framing, COOP, and CORP
are present.

The static PWA has no document backend and requires no sign-in, so backend
concurrency, server persistence, and Entra checks do not apply. The optional
Sociobot license verifier allowed 30 requests from one client window; request
31 returned **429** with `Retry-After: 4` and `X-RateLimit-After: 4`.

## PWA, accessibility, routes, and performance

The standalone manifest has a versioned start URL and valid 192px/512px icons.
`registration.update()` completed with the current worker activated and no
waiting or stale installing worker. A fresh demo then reloaded offline from
the versioned cache and retained its sample data and Offline status. The
claim test additionally produced valid first-use ZIP and PDF exports offline.

- Axe: zero violations, including zero serious/critical findings, on live
  landing, demo, Privacy, and Terms in desktop/mobile and light/dark samples.
- Keyboard: skip link, navigation, primary demo action, packet action, and
  dialogs were operable. Focus used a visible 3px ochre outline. Modal focus
  stayed inside and Escape restored focus to its trigger.
- Responsive: no horizontal overflow at 390×844, including at 200% text size;
  sampled visible controls were at least 44×44 CSS px.
- Reduced motion: the media query matched, no animation existed on load, and
  state-change transitions were reduced to 0.01 ms.
- Routes `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with one h1,
  one main landmark, and route-specific titles. An unknown route returned the
  designed HTML 404. Every discovered internal route and GitHub source link
  resolved successfully.
- Three fresh mobile Lighthouse runs scored **86, 99, and 94 performance**
  (median **94**) and **100 accessibility / 100 best practices / 100 SEO** in
  every run. LCP was 1.3–1.4 s, CLS was 0, and transfer was 70 KiB. TBT varied
  from 140–570 ms under simulated CPU throttling; Lighthouse did not report
  field INP.
- Initial app JS is 49.21 kB raw / 16.69 kB gzip; CSS is 21.30 kB raw /
  5.53 kB gzip; the mobile hero WebP is 32.91 kB. No font loads on first paint.
  Large export/font modules are lazy and precached for first-use offline
  export; Vite reports its expected warning for the 716.76 kB lazy fontkit
  chunk.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Scope notes

No product source, deployment, infrastructure, DNS, billing configuration, or
user data was modified. Verification changed only this report and the handoff.
