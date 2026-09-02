# Independent verification 14 — PASS

**Candidate:** `e979800f875151c3e437fd8bcd5e6b378cca4b52`  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-09-02 UTC  
**Work order:** `invoice-evidence-pack-verify-14`

## Verdict

**PASS.** The live PWA is byte-identical to the candidate build at the root,
service worker, manifest, demo, privacy, terms, and immutable entry assets. The
smallest useful packet workflow, isolated sample, privacy boundary, offline
exports, accessibility baseline, and all declared claims passed. No defect was
confirmed.

## Mandatory first-read and demo gate

A cold 1440×900 visit showed the headline **Build a complete invoice evidence
packet.** It named cross-border freelancers and small firms preparing an
accountant, client, or filing review. The visible primary action was **Try it
with sample data**, followed by a plain explanation that it opens a separate
workspace.

At 390×844, the headline, audience sentence, sample action, action explanation,
and all three privacy/offline/price facts were visible in the first viewport.
One click opened the populated Kite Studio sample. The demo kept its persistent
**Demo — sample data, nothing is saved to your packets** banner, **Reset demo**,
and **Start for real** controls. Starting for real returned to an empty normal
workspace with zero normal packets; reopening demo reseeded the sample.

## Claims gate and clean-checkout checks

The checkout began clean at the exact candidate SHA. `npm ci` installed the
locked dependencies with zero reported vulnerabilities. `.factory/claims.json`
contains 23 entries. Every listed command was run separately and exactly as
declared, and all passed:

- `demo-sandbox`, `local-only`, `sha256-hash`, `manifest-fingerprints`
- `file-size-limit`, `missing-flags`, `filename-redaction`, `duplicate-zip`
- `unicode-pdf`, `json-backup`, `backup-import`, `offline-reload`
- `aes-zip`, `custom-templates`, `license-restore`, `checkout-operator-gate`
- `configurable-checklists`, `no-document-backend`, `no-account-required`
- `pwa-installable`, `free-exports`, `core-no-setup`
- `license-verification-minimum-data`

The inventory has exactly one `@claim:<id>` occurrence per declared claim, no
missing tags, and no undeclared tags. The landing page and README claim audit
found no positive product promise outside this inventory.

Other clean-checkout gates:

- `npm test`: **11/11 passed**.
- `npm run check`: **passed**. There is no separate lint script.
- `npm run build`: **passed** and produced `dist/`.
- `npm run test:e2e`: **48 passed, 18 expected project skips**, exit 0.
- `/opt/fleet/lib/verify-url.sh`: **passed** after its required evidence
  directory was created: 800 ms load, title, `lang="en"`, one h1, main
  landmark, complete image alt attributes, labelled buttons, no console error.

## End-to-end product evidence

A fresh live normal workspace rejected a whitespace-only packet name with the
plain error “Enter a packet name that contains at least one non-space
character,” set `aria-invalid="true"`, kept the dialog open, and returned focus
to the field.

A representative Payment trail packet used invoice `INV-EDGE-0001`, Japanese
client metadata, India review context, JPY currency, reviewer notes, and a
32-byte evidence file. It persisted across reload. Its ZIP contained
`manifest.json`, `README.txt`, and the evidence file. The manifest reported one
of four required items present, three `missing-required` entries, and one
`not-provided-optional` entry. Its complete file digest
`4c201003074f1856186a2a637b7ddd9b7a7827275d260eb502755c00774b0dd2`
matched an independent SHA-256 calculation. The PDF contained the packet
metadata, missing flags, and reviewer notes. The JSON backup retained the file
as base64 and reproduced the same digest.

Boundary and recovery coverage passed for exactly 100 MiB versus 100 MiB plus
one byte, duplicate source filenames, filename redaction, malformed-backup
recovery without data loss, Unicode PDF text, incomplete-packet confirmation,
invalid license handling, and correct versus wrong encrypted-ZIP passwords.

## Live deployment, privacy, and response policy

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed the response policy and byte comparison. Live SHA-256 identities:

| Resource | SHA-256 |
| --- | --- |
| `/` | `82bb77aa0735629e016b312d1c79dbf08444d06e9d2d3a6e50a8239060e44d48` |
| `/sw.js` | `5df064839355576b7161776d9ffd638e832348d8ee1eb1c7899433211372fdc2` |
| `/manifest.webmanifest` | `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83` |
| `/demo/` | `baa5b9608fcc891b59f08cd9af13b0cf0810dbbdf3933673f8052c8cfda23e2f` |
| `/privacy/` | `95f212ce5a9d6c07f790fa1893e7c91283f667637672a86015a21acc07c3b892` |
| `/terms/` | `70f233325a60359aac2e8b6e9c9ae29ce34198dff0f41b47af4ac62f57ec3c4c` |

The cold landing, demo, create/attach/export workflow, and legal-route request
logs contained only the product origin. There were no analytics, uploads,
third-party scripts/fonts, failed requests, console errors, or page errors.
The live HTML returns `Cache-Control: no-cache`; hashed JS/CSS return
`public, max-age=31536000, immutable`; manifest and service worker revalidate.
CSP, HSTS, `nosniff`, strict-origin referrer policy, Permissions-Policy,
DENY framing, COOP, and CORP are present.

The static product has no document backend or sign-in. New checkout is
truthfully operator-gated. The optional license verifier was tested with
synthetic invalid tokens: requests 1–30 returned 200/invalid; request 31
returned **429** with `Retry-After: 4` and `X-RateLimit-After: 4`. Entra and
backend persistence/concurrency checks do not apply.

## PWA, accessibility, routes, and performance

The standalone manifest has versioned start URL plus 192px and 512px maskable
icons. `registration.update()` left the current worker active with no stale
waiting or installing worker. A fresh demo then went offline, reloaded from
cache, showed Offline state, and produced valid first-use ZIP and PDF exports.

- Axe: zero violations, including zero serious/critical findings, on the live
  landing page and demo in desktop light, desktop dark, and 390px mobile.
- Keyboard: skip link, demo action, first-packet action, dialog fields, and
  submit/recovery paths were operable. Sampled focus used a visible 3px ochre
  outline; the modal opened with focus inside it and kept outside controls
  inert.
- Responsive: no horizontal overflow at 390×844 or after 200% text sizing.
  Visible mobile actions were at least 44px; native checkbox/file inputs had
  larger labelled hit areas.
- Reduced motion matched the media query and reduced animation and transition
  durations to 0.01 ms with no continuing animation.
- Routes `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` returned 200
  with one h1 and route-specific titles. An unknown route returned a designed
  HTML 404. Every discovered internal and external link resolved.
- Mobile Lighthouse: **Performance 99, Accessibility 100, Best Practices 100,
  SEO 100**; FCP/LCP 1.297 s, TBT 127 ms, CLS 0, total transfer 71,867 bytes.
- Initial app JS: 48,929 bytes raw / 16.66 kB gzip. CSS: 21,297 bytes raw /
  5.51 kB gzip. Mobile hero WebP: 32,908 bytes. No font loaded on first paint.
  Larger export modules are lazy and precached so first-use exports work
  offline; Vite reports its expected warning for the 716,756-byte lazy fontkit
  chunk.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Scope notes

No product source, deployment, infrastructure, DNS, billing configuration, or
user data was modified. This verification added only this report and refreshed
the repository handoff.
