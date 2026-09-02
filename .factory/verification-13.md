# Independent verification 13 — PASS

**Candidate:** `649fe98e1d34360213e328cdf754a02b24fd4180`  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-09-02 UTC  
**Work order:** `invoice-evidence-pack-verify-13`

## Verdict

**PASS.** The production PWA is byte-identical to this candidate at its root,
app routes, manifest, service worker, and immutable entry assets. No
release-blocking defect was confirmed.

## First-read and demo gate

A cold 1440×900 visit plainly said it builds a complete invoice evidence
packet, is for cross-border freelancers and small firms preparing an
accountant/client/filing review, and led with **Try it with sample data**.
That one click opened `/?demo=1`, the realistic Kite Studio workspace, with
the persistent separate-workspace banner plus **Reset demo** and
**Start for real**.

## Claims and clean-checkout gates

`.factory/claims.json` exists with 22 entries. After `npm ci`, every listed
command was executed separately and exactly as declared; all passed. A source
scan found exactly one `@claim:<id>` occurrence for each claim.

Passed: `demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`,
`missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`,
`json-backup`, `backup-import`, `offline-reload`, `aes-zip`,
`custom-templates`, `license-restore`, `checkout-operator-gate`,
`configurable-checklists`, `no-document-backend`, `no-account-required`,
`pwa-installable`, `free-exports`, `core-no-setup`, and
`license-verification-minimum-data`.

- `npm test`: 11/11 passed.
- `npm run check`: passed; no lint script exists.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: 43 passed, 17 expected project skips, exit 0.
- Initial executable JS: 48,183 bytes raw / 16,396 bytes gzip; CSS: 21,297 /
  5,511 bytes gzip; mobile hero: 32,908 bytes. All are within budget.

## Live product QA

A fresh normal workspace rejected a whitespace-only name in plain words,
marked it `aria-invalid`, and returned focus. A Payment trail packet accepted
metadata, notes, and a proof file, then exported `QA-payment-trail.zip` and a
dated JSON backup without external requests.

The cold landing-to-demo request log contained only
`invoice-evidence-pack.sociobot.in` resources: no analytics, upload,
third-party font/script, console error, or page error. Expected CSP, HSTS,
`nosniff`, referrer policy, Permissions-Policy, DENY framing, COOP/CORP, and
immutable hashed-asset cache headers were present.

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
passed policy and byte identity. Root SHA-256:
`2132a12627c1cb71328f83b02299c2e522938e9c083b6e8108768c701d179bb7`.

Live PWA QA found a standalone manifest and active controller.
`registration.update()` ended active with no waiting/installing worker.
Offline reload retained the demo and Offline state; first-use ZIP and PDF
exports both downloaded with no errors.

The optional existing-license verifier accepted 30 synthetic invalid-token
requests; request 31 returned 429 with `Retry-After: 3` and
`X-RateLimit-After: 3`. Checkout is operator-gated. No document backend,
account sign-in, CLI, or library API exists.

## Accessibility and responsive QA

- `verify-url.sh` passed live in 786 ms: title, lang, one h1, main, image alt,
  labelled buttons, and no errors.
- Playwright Axe found zero serious/critical live-demo violations.
- Keyboard begins at the skip link; sampled controls showed a visible 3px
  focus outline. Validation and dialog actions were keyboard-operable.
- At 390×844, both landing and demo were 390px wide with no visible control
  below 44×44px. At 200% text / 1280px there was no horizontal overflow.
- Reduced motion matched and reduced animation/transition duration to
  0.00001s.

`/demo/`, `/privacy/`, `/terms/`, and `/404.html` returned 200; an unknown
route returned 404.

## Defects by severity

None confirmed.
