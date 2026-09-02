# Independent verification 16 — PASS

**Candidate:** `2f3e52f519d87a724a8f9db58faa4e6cc6fe7d63`

**Live URL:** <https://invoice-evidence-pack.sociobot.in>

**Verified:** 2026-09-02 UTC

**Work order:** `invoice-evidence-pack-verify-16`

## Verdict

**PASS.** The live PWA matches the candidate build and completes the researched
invoice-evidence job end to end. All declared claims, clean-checkout gates,
normal and demo workflows, local-data boundaries, exports, accessibility,
offline behavior, response policy, and the license-verifier rate limit passed.
No product defect was confirmed.

## Mandatory first-read and demo gate

A cold 1440×900 load presented **Build a complete invoice evidence packet.**
It identifies cross-border freelancers and small firms preparing files for an
accountant, client, or filing review. The primary action is **Try it with sample
data**, followed by a plain explanation that the sample opens a separate
workspace. The same content and action were visible at 390 px.

One click opened the populated Kite Studio sample. The persistent banner says
**Demo — sample data, nothing is saved to your packets** and includes **Reset
demo** and **Start for real**. An independent namespace check created a normal
packet, entered and changed the demo, reset it, and returned to the untouched
normal packet. IndexedDB contained separate `invoice-packet` and
`demo:invoice-packet` databases.

## Claims and clean-checkout gates

`.factory/claims.json` exists with 25 entries. After `npm ci`, every listed
command was run separately and exactly as declared; all **25/25 passed**:

`demo-sandbox`, `local-only`, `sha256-hash`, `manifest-fingerprints`,
`file-size-limit`, `missing-flags`, `filename-redaction`, `duplicate-zip`,
`unicode-pdf`, `json-backup`, `backup-import`, `offline-reload`, `aes-zip`,
`custom-templates`, `license-restore`, `license-revocation`,
`offline-license-verdict`, `checkout-operator-gate`,
`configurable-checklists`, `no-document-backend`, `no-account-required`,
`pwa-installable`, `free-exports`, `core-no-setup`, and
`license-verification-minimum-data`.

A source scan found exactly one `@claim:<id>` occurrence for each declared
claim and no undeclared tag. Landing, legal, and README promises were checked
against the manifest and copy audit; no unsupported positive product promise
was found.

- `npm ci`: passed; 140 packages installed, 0 vulnerabilities.
- `npm test`: passed, 11/11.
- `npm run check`: passed. There is no separate lint script.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: passed, 54 applicable cases; 20 intentional
  cross-project skips.
- `/opt/fleet/lib/verify-url.sh`: passed in 763 ms with title, `lang="en"`,
  one h1, one main, complete alt text, labelled buttons, and no console error.

## End-to-end product evidence

An independent live normal-workspace run rejected a whitespace-only packet
name, displayed the specific recovery instruction, set `aria-invalid="true"`,
and returned focus to the field.

A Payment trail packet used invoice `INV-EDGE-100`, client `山田商事`, an
India/Japan review context, JPY currency, reviewer notes, and known evidence
bytes. It survived reload. The displayed and exported SHA-256 digest was
`86d1a45d2db706cf3361ad994f3101ff86bba0feaf76b74247aa8ee67276f1aa`,
matching an independent calculation. The ZIP contained `manifest.json`,
`README.txt`, and the evidence file; its manifest reported one present and
three missing-required items. PDF text retained the packet, invoice, Japanese
client, currency, notes, and full digest. The JSON backup retained the
attachment and metadata. Importing malformed JSON gave the documented
recovery message and left the packet and attachment intact after reload.

The real file chooser rejected 104,857,601 bytes, cleared its value, and kept
no attachment. A 104,857,600-byte file displayed as 100.0 MiB, received digest
`20492a4d0d84f8beb1767f6616229f85d44c2827b64bdbfb260ee12fa1109e0e`,
and persisted after reload.

In the live demo, encrypted ZIP output reported AES strength 3 (AES-256), not
ZipCrypto. The correct password decrypted the manifest and a wrong password
failed. Saving **Verifier reusable checklist** made it available to the new
packet dialog. Free ZIP/PDF/backup export and paid-feature fixture behavior
were also covered by the claim suite.

## Privacy, deployment, and endpoint behavior

Normal create/attach/export/import, demo, landing, and legal-route browser
logs contained only the product origin. There were no analytics, document
uploads, third-party scripts or fonts, failed requests, console errors, or page
errors. Fixture coverage confirmed license verification sends only the license
query parameter and no packet content or filename.

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed security/cache policy and exact local/live byte identity:

| Resource | SHA-256 |
| --- | --- |
| `/` | `ddd310100ad1bcd80acb4026f074181885dbdb679e1c93e74307a9b47371a9d7` |
| `/sw.js` | `21d6396c8611c19c81f43634715ef7d82310213de679b6986ff93ea864cb4fdf` |
| `/manifest.webmanifest` | `4e66e893cd05bf6edc41541d0f4005eeab866856add85518dc02cd6365dfab83` |
| `/demo/` | `09237d19936751b431ba4fbdddc30ccd36a59921e7b4774e0e5272b2e621f3d4` |
| `/privacy/` | `f42eb9af1fd24adf1f539456541ad8339aeeeff1b26dd63efbddd0f6f650da99` |
| `/terms/` | `84d9043b6d158606bba504c3589c981b5e4338c814317dfb6b4b773d0592ae4d` |

HTML, service worker, manifest, images, and icons revalidate with `no-cache`;
hashed JS/CSS use `public, max-age=31536000, immutable`. CSP, HSTS, `nosniff`,
strict-origin referrer policy, Permissions-Policy, DENY framing, COOP, and CORP
were present. The designed unknown route returned HTTP 404. Every discovered
internal link and the disclosed GitHub source link returned 200; `robots.txt`
and `sitemap.xml` were valid and reachable.

The optional Sociobot license verifier allowed 30 requests from one client.
Request 31 returned **429** with `Retry-After: 4`. The default build accurately
states that new checkout is operator-gated and exposes no unverified checkout
link; existing-license restore remains functional.

This is a static PWA with no document backend, server-side product state,
account sign-in, library package, or CLI. Backend concurrency, server
persistence, Entra authority, and clean-consumer package checks do not apply.
The brief does not imply a useful AI step; OCR is explicitly a non-goal and a
remote model would weaken the local document boundary.

## Accessibility, PWA, and performance

- Axe found zero violations, including zero serious/critical findings, across
  `/`, `/?demo=1`, `/privacy/`, and `/terms/` at desktop and 390 px, in light
  and dark themes: 16 combinations.
- Keyboard testing reached and activated the sample action. The first Tab
  exposed **Skip to main content** with a 3 px focus outline. Native dialogs
  kept background controls inert, Escape closed them, and focus returned to
  the trigger.
- The 390 px demo had no horizontal overflow. All 53 measured standalone
  actions and control labels were at least 44×44 CSS px. A 200% base-text test
  retained the complete UI without horizontal overflow.
- Reduced-motion emulation matched the media query, produced no active
  animation, and capped animation/transition duration at 0.01 ms.
- The manifest is standalone with versioned start URL `/?v=2&source=pwa` and
  192/512 icons. `registration.update()` left one current activated worker,
  with no waiting or installing worker. Its versioned cache had 22 entries.
  A fresh sample reloaded offline with HTTP 200 and **Offline** status, then
  produced first-use ZIP and PDF exports containing all four sample files and
  Japanese metadata.
- Initial app JS is 49.22 kB raw / 16.68 kB gzip; CSS is 21.14 kB raw / 5.49
  kB gzip; the mobile hero WebP is 32.91 kB. Export/PDF code remains lazy and
  no font loads on first paint.
- Three fresh mobile Lighthouse runs scored **100, 99, 94 performance**
  (median **99**) and **100 accessibility / 100 best practices / 100 SEO** in
  every run. LCP was 1.12–1.35 s, CLS 0, TBT 30.5–272.5 ms, and transfer
  71.8–71.9 kB. Lighthouse had no field INP; five click-to-result samples for
  Reset demo were 76.8–126 ms.

Evidence: [live-check.json](evidence/verification-16/live/live-check.json),
[desktop screenshot](evidence/verification-16/verify-url/screenshot-desktop.png),
[mobile landing](evidence/verification-16/verify-url/screenshot-mobile.png),
[mobile demo](evidence/verification-16/live/demo-mobile.png), and
[Lighthouse runs](evidence/verification-16/lighthouse/).

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Scope and handoff

No product source, deployment, infrastructure, DNS, billing configuration, or
user data was modified. Verification changed only this report, the handoff,
and captured evidence.
