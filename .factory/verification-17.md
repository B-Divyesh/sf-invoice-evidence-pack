# Verification 17 — PASS

Candidate: `a1b1c30a909ad09c846f969c6978fdeaf1aa5abe`  
Live URL: <https://invoice-evidence-pack.sociobot.in>  
Verified: 2026-09-02

## Verdict

**PASS.** The live deployment is byte-identical to the candidate build and the tested offline evidence-packet workflow meets the researched brief. No release-blocking, high, medium, or low severity defects were found.

## Cold first read

In a new browser context, the first screen plainly says it builds a complete invoice evidence packet, names cross-border freelancers and small firms as the audience, and makes **Try it with sample data** the first action. The adjacent sentence explains that the sample opens a separate workspace. The one-click demo opened the realistic Kite Studio client-review packet with its persistent “Demo — sample data, nothing is saved to your packets” banner, reset action, and start-for-real action. This passes the plain-words and demo-sandbox gates.

## Claims and local quality gates

Started from the clean candidate checkout with `npm ci` (0 vulnerabilities). Every declared claim test passed via the demo entry point:

- Browser claim suite: 19 tests / 23 claim IDs passed in 59.5 seconds.
- Unit claim suite: 4 tests / 5 claim IDs passed.
- All 28 IDs in `.factory/claims.json` were exercised: `demo-sandbox`, `local-only`, `sha256-hash`, `manifest-fingerprints`, `file-size-limit`, `missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`, `json-backup`, `backup-packets-templates`, `backup-import`, `offline-reload`, `aes-zip`, `password-not-stored`, `custom-templates`, `license-restore`, `license-revocation`, `offline-license-verdict`, `checkout-operator-gate`, `configurable-checklists`, `no-document-backend`, `data-deletion`, `no-account-required`, `pwa-installable`, `free-exports`, `core-no-setup`, and `license-verification-minimum-data`.
- `npm test`: 11/11 passed.
- `npm run check`: passed (`tsc -b`); no separate lint script exists.
- `npm run build`: passed and generated `dist/`. Initial app JS is 16.99 KB gzip and CSS is 5.49 KB gzip, both inside the static-product budgets.
- `npm run test:e2e`: 38 passed, 1 intentional project skip, in 1.7 minutes. It covers normal packet creation, persistence, hashes, missing evidence, malformed-backup recovery, duplicate filenames, Unicode PDF output, free and encrypted exports, deletion, 390px layout, controls/focus, route focus, service-worker offline reload, and PWA metadata.

## Live deployment, privacy, and PWA

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in` passed. It verified matching SHA-256 bytes for `/`, the hashed JS/CSS assets, `/sw.js`, `/manifest.webmanifest`, `/demo/`, `/privacy/`, and `/terms/`. The root hash is `f593f6d40063696c4d673e7ff15b32193699211f9063feffe116c66e82a883a5`.

`npm run verify:live -- https://invoice-evidence-pack.sociobot.in .factory/evidence/verification-17` passed. It recorded no console errors, page errors, failed requests, or third-party requests during the normal flow. It also passed no-account export, demo isolation, 404, route announcements and focus restoration, 390px no-overflow, mobile axe, service-worker-controlled offline reload, and offline ZIP/PDF export.

The live root sent CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, COOP, CORP, and restrictive Permissions-Policy headers. HTML, manifest, and service worker revalidate; hashed application assets are `public, max-age=31536000, immutable`.

`/opt/fleet/lib/verify-url.sh` passed with one title, `lang=en`, a main landmark, no image-alt omissions, no unlabeled buttons, and no console errors. Live request logging from a cold page and the full normal workflow observed only same-origin resources (plus local download blobs); no analytics, document upload, CDN fonts, or third-party scripts were requested. The only optional cross-origin operation is license verification after a user pastes a token. It sends the token only; claim coverage verifies that packet files and filenames are not sent.

The optional license verifier was refreshed with an invalid fixture token from one client: requests 1–30 returned 200; request 31 returned **429** with `Retry-After: 4` and `X-RateLimit-After: 4`. Observed allowance: 30 requests per window. The default build keeps new checkout operator-gated.

## Accessibility, keyboard, visual, and performance checks

- Independent AxeBuilder checks on live `?demo=1`: desktop and 390px each had zero serious or critical violations.
- Keyboard smoke test found the skip link first in tab order with a visible `rgb(155, 94, 18) solid 3px` focus outline. The repository’s E2E suite additionally passed dialog/control focus, touch-target, route-focus, and back-navigation checks. Reduced-motion emulation produced no running animations.
- Visual inspection of desktop and mobile showed the documented field-guide visual system without clipping or horizontal overflow. The hero, actions, and sample workflow remain legible and product-specific.
- Mobile Lighthouse audit produced Performance 90, Accessibility 100, Best Practices 100, and SEO 100; LCP 1467 ms and CLS 0. The Chromium tab crashed while Lighthouse took its final screenshot after audits completed, so its command exited nonzero despite writing those results. This was not reproducible in Playwright and did not produce a page error; all product checks above passed.

## Defects by severity

None.

## Evidence

Machine-readable live verification evidence is in `.factory/evidence/verification-17/` (`live-check.json`, `demo-mobile.png`).
