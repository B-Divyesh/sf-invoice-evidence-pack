# Independent verification 5 — FAIL

**Candidate:** `66a17f1fc03b27e1ac77ebe7227e981a11fb8387` (`docs: record repair deployment evidence`)  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Work order:** `invoice-evidence-pack-verify-5`

## Verdict

**FAIL for release acceptance.** The live PWA is byte-for-byte the requested
candidate. Its clean gates, primary local-first workflow, accessibility,
privacy, offline/update behavior, response policy, budgets, and the newly
observed API rate limit pass. Release is blocked by two high-severity failures:
ordinary duplicate source filenames prevent ZIP export, and the advertised $19
purchase URL returns HTTP 404. Fresh-device import is also absent from the empty
state, and PDF export destroys non-Latin text used by the target cross-border
audience.

This is fresh evidence. In particular, verification 4's API rate-limit failure
is no longer present: the 31st rapid verification request returned `429` with a
`Retry-After` header.

## Clean checkout and repository gates

The product was tested in a new detached worktree at exactly the candidate SHA.
It remained clean after QA. The documentation branch was at `9759a42`, whose
only changes after the candidate were prior verification documents.

```sh
git worktree add --detach /tmp/invoice-evidence-pack-candidate \
  66a17f1fc03b27e1ac77ebe7227e981a11fb8387
cd /tmp/invoice-evidence-pack-candidate
npm ci
npm test
npm run check
npm audit --omit=dev
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

- `npm ci`: 134 packages installed; 0 vulnerabilities.
- `npm test`: 2 files / 8 tests passed.
- `npm run check`: passed (`tsc -b`). No lint script or lint configuration is
  present.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Exact production command `npm run build`: passed and produced `dist/`.
- Playwright 1.58.2: 13 passed, 1 intentional desktop-only duplicate skipped.
- Initial JS: 41,789 B / 14,390 B gzip; CSS: 20,313 B / 5,300 B
  gzip. Lazy ZIP and PDF chunks are 146,596 B and 434,897 B. Mobile hero WebP
  is 32,908 B; no fonts ship. The 192 and 512 icons have the declared pixel
  dimensions.

## Candidate/deployment identity and delivery policy

`npm run verify:deployment` passed policy and byte identity for the root,
initial hashed JS/CSS, service worker, manifest, privacy, and terms routes.

- root/privacy/terms SHA-256:
  `2fe76db6dcd9cbf5cf3a4998da24f54ec4ac5d2ca7b979f10249e5a16e775fff`
- service worker:
  `861c0a2b9b7856d033a7a15af57cdf9ac72c2b4a618acbd9a4a9d5a6225f3017`
- manifest:
  `c75d077c3848d30735c7ea868fb123eca5acd219d6f17d020677ae70ef784ead`

The live shell, manifest, service worker, privacy, and terms responses are
`no-cache`. Initial hashed JS/CSS are
`public, max-age=31536000, immutable`; a root ETag request returned `304`.
Responses include the shipped strict self CSP with only Sociobot billing
connects, denied ambient permissions, `DENY` framing, COOP/CORP, `nosniff`,
strict-origin referrer policy, and two-year preload HSTS. Manifest MIME is
`application/manifest+json`.

`/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 1,115 ms network-idle load,
descriptive title, `lang=en`, one `h1`, a `main`, no missing image alt, no
unnamed button, and no console error.

## End-to-end product evidence

Fresh local production and live Chromium profiles exercised the normal,
boundary, invalid, and recovery paths:

- Created a payment-trail packet for an India GST/FEMA review with invoice
  `INV-042`, client, date, notes, special characters, and lowercase `usd`;
  currency normalized to `USD`.
- Whitespace-only packet and checklist names stayed in their dialogs with a
  specific live error, `aria-invalid`, and returned focus. Recovery succeeded.
- The keyboard path reached the transparent native file input; its visible Add
  evidence/Replace label had a 3 px ochre outline. Dialogs, packet selection,
  deletion confirmation/cancellation, and export actions were keyboard
  operable.
- Accepted an exact 100 MiB file and displayed its independently matching
  SHA-256; rejected 100 MiB + 1 byte with actionable text and preserved the
  prior attachment.
- Collected all four required records. Files, hashes, packet details, history,
  and notes survived reload in IndexedDB; completion reached 4/4. An incomplete
  export first allowed cancellation, then an accepted working export recorded
  1/4 and three `missing-required` states.
- A redacted ZIP contained `manifest.json`, `README.txt`, and four distinct
  `evidence/NN-evidence.txt` files. Manifest metadata, notes, hashes, byte
  counts, optional/missing states, filename-redaction flags, and non-advice
  notice were correct. Archived `invoice evidence` SHA-256 was
  `d5b7e030709f98cb97ad24269347558feb88bea79762d67fa25d750f4121a4aa`.
- A normal PDF was valid `%PDF-1.7` (2,159 B). A full JSON backup contained
  attachment base64. Unsupported JSON was rejected without damaging current
  data; import succeeded after the fresh-device workaround described below.
- With a fresh cached-valid QA entitlement, reusable-template save passed, a
  password shorter than 10 characters was invalid, mismatch copy appeared,
  and an AES-strength-3 encrypted ZIP decrypted with the correct password and
  rejected a wrong password. No issued production license was fabricated.
- Invalid license restore called only the documented Sociobot verify endpoint
  and showed a recoverable `invalid` error. Packet deletion required a named
  confirmation.

## PWA, accessibility, responsive behavior, and privacy

- Local and live desktop plus 390×844 mobile had no horizontal overflow,
  console errors, page errors, or unexpected request failures. Visual
  inspection showed intentional stacking and no obscured content.
- Repeated axe scans of empty/editor, light/dark, desktop/mobile states found
  **0 reproducible serious or critical findings**. Semantics include one `h1`,
  one `main`, correct heading/landmark structure, a skip link, bound labels,
  alt text, and named controls. Visible compact controls were at least 44×44;
  native 20 px checkboxes and transparent file inputs have larger labelled hit
  areas. Reduced-motion durations computed to `1e-05s`; nothing loops or
  flashes.
- The manifest is standalone with a versioned start URL, matching colors, real
  192/512 PNG icons, and maskable purpose. Service-worker-controlled offline
  reload passed locally and live with persisted packet data and visible
  `Offline` state.
- A controlled exact-dist update test changed only the served worker bytes.
  The installed app displayed “A fresh field kit is ready,” activated the
  waiting worker through “Update now,” reloaded under a controller, retained
  IndexedDB data, and reloaded offline without errors.
- Normal create/hash/export activity made only same-origin requests. Static
  review found no analytics, tracking, remote fonts/scripts, document backend,
  or other upload path. The only runtime cross-origin fetch is deliberate
  Sociobot license verification; packet data remained local. Privacy/terms,
  README, MIT license, visual thesis, and generated-art provenance are present.
- No sign-in exists, so the Entra authority requirement is not applicable.
  This is a static PWA, not a library/CLI/backend; consumer-pack, health,
  concurrency, and server persistence checks are not applicable.

Three Lighthouse 13.4.1 mobile runs produced Performance **84/97/97**
(median **97**), Accessibility **100**, Best Practices **100**, and SEO
**100**. The two repeat runs had FCP 1.24–1.29 s, LCP 1.26–1.29 s, TBT
177–190 ms, and CLS 0. The first run's 629 ms TBT was dominated by
unattributable host work and did not reproduce; bundle and transfer budgets
pass.

## Server endpoint and rate-limit evidence

An invalid-token verification returned HTTP 200,
`{"expires_at":null,"reason":"invalid","valid":false}`, `Cache-Control:
no-store`, and the correct live-origin CORS header.

A sequential rapid burst to:

```text
GET https://api.sociobot.in/api/v1/products/invoice-evidence-pack/verify?license=qa-rate-limit-66a17f1
```

completed in 461 ms: requests 1–30 returned `200`; request **31** returned
**`429` with `Retry-After: 4`**. The currently observed threshold is therefore
30 requests per window. This passes the work-order rate-limit requirement and
supersedes verification 4's older no-limit observation.

## Defects

### High — duplicate evidence filenames make ZIP export fail

1. Create a packet.
2. Attach different bytes to two checklist items, naming both files
   `proof.pdf` (a normal outcome when documents come from different folders).
3. Choose **Export ZIP packet** and accept the incomplete-packet warning.

No download occurs. The only result is the generic toast “The ZIP could not be
prepared. Try again or export a backup.” Browser errors remain empty because
the exception is caught. The exporter writes both records to the same
`evidence/proof.pdf` archive path, which Zip.js rejects. Filename redaction is
an undisclosed workaround because it prefixes indexes; users otherwise must
rename and reattach files. The same naming path is shared by encrypted ZIP.
This breaks the brief's central handover output for valid, representative input.

### High — the advertised paid unlock cannot be purchased

The live UI's exact **Buy the one-time unlock** link is:

```text
https://api.sociobot.in/api/v1/products/invoice-evidence-pack/checkout
```

A fresh GET returns HTTP **404** with
`{"error":"enabled factory product","status":404}`. The UI advertises “$19,
one time” and gates encrypted ZIP/custom templates, but a new buyer cannot
reach hosted checkout. This is a Sociobot product-registration/deployment
defect rather than static candidate drift, but it blocks the shipped product.

### Medium — a fresh browser offers no backup import action

In a clean browser profile, the empty state contains zero controls named
**Import backup** even though backup import is the required device-migration
path. The control is rendered only inside the packet sidebar. Creating a
throwaway packet makes Import backup appear; accepting the destructive warning
then restores the original packet, attachments, and notes successfully. The
workaround is undiscoverable and contradicts the UI's portability promise.

### Medium — PDF export replaces non-Latin evidence metadata with `?`

A packet named `मुंबई 東京 packet`, client `山田商事`, and jurisdiction `भारत /
日本` exported successfully, but independent PDF text extraction returned
`????? ?? packet`, client `????`, and jurisdiction `???? / ??`. The exporter
explicitly maps every character outside Latin-1 to `?` before drawing standard
Helvetica. ZIP/JSON keep the original Unicode, but the advertised PDF manifest
is unreliable for the product's cross-border audience.

## Coverage limits

No successful real purchase was possible because checkout returns 404, and no
issued production entitlement was available. Safari/Firefox installed-PWA
behavior was not exercised. These limits are not the reasons for the FAIL.
