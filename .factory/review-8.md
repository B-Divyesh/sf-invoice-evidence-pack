# Build invoice evidence packets — review 8 PASS

**Verdict: PASS.** Zero findings. Zero untested claims.

- **Reviewed implementation:** `a1b1c30a909ad09c846f969c6978fdeaf1aa5abe`
- **Reviewed documentation baseline:** `25db64c14ce819f6f4338f849f4a83120e3dd643`
- **Live URL:** <https://invoice-evidence-pack.sociobot.in>
- **Date:** 2026-09-05 UTC
- **Method:** clean checkout and install; every declared claim command run separately; fresh live desktop and 390px phone contexts; live deployment, accessibility, route, privacy, offline, and PWA checks.

## First screen before scrolling

Fresh 1440×900 desktop and 390×844 phone contexts both showed the job before any scroll: **“Build a complete invoice evidence packet.”** It names the audience: cross-border freelancers and small firms preparing files for an accountant, client, or filing review. The first primary action is **“Try it with sample data”**, with adjacent plain text that it opens a separate workspace. Both contexts had the correct title, one h1, no console errors, and no horizontal overflow.

## Demo and main job

The one-click sample opened the populated Kite Studio August client-review packet. It showed four collected required records, two optional empty items, hashes, notes, and export tools. The persistent banner reads **“Demo — sample data, nothing is saved to your packets”** and includes **Reset demo** and **Start for real**. Editing then resetting restored the original sample. The demo used `demo:invoice-packet`; the normal packet store remained separate. Normal-flow request logging saw only same-origin resources and local download blobs.

The normal, invalid, boundary, and recovery paths passed through the clean browser suite: creating and persisting a packet, whitespace validation, exact 100 MiB acceptance and 100 MiB-plus-one rejection, missing-evidence confirmation, malformed-backup recovery, duplicate filenames, Unicode PDF text, JSON restore, deletion, license revocation, and reconnect after offline license use.

## Claims

From clean checkout `/tmp/invoice-review8-clean-9AxRVe`, `npm ci` installed the documented prerequisites and reported zero vulnerabilities. Every `test` string in `.factory/claims.json` was invoked separately and passed. No claim was missing, false, incomplete, or untested.

| Claim ID | Declared command form | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --project=chromium --grep @claim:demo-sandbox` | Pass |
| `local-only` | `npm run test:e2e -- --project=chromium --grep @claim:local-only` | Pass |
| `sha256-hash` | `npm test -- --testNamePattern @claim:sha256-hash` | Pass |
| `manifest-fingerprints` | `npm run test:e2e -- --project=chromium --grep @claim:manifest-fingerprints` | Pass |
| `file-size-limit` | `npm test -- --testNamePattern @claim:file-size-limit` | Pass |
| `missing-flags` | `npm test -- --testNamePattern @claim:missing-flags` | Pass |
| `filename-redaction` | `npm test -- --testNamePattern @claim:filename-redaction` | Pass |
| `duplicate-zip` | `npm run test:e2e -- --project=chromium --grep @claim:duplicate-zip` | Pass |
| `unicode-pdf` | `npm run test:e2e -- --project=chromium --grep @claim:unicode-pdf` | Pass |
| `json-backup` | `npm test -- --testNamePattern @claim:json-backup` | Pass |
| `backup-packets-templates` | `npm run test:e2e -- --project=chromium --grep @claim:backup-packets-templates` | Pass |
| `backup-import` | `npm run test:e2e -- --project=chromium --grep @claim:backup-import` | Pass |
| `offline-reload` | `npm run test:e2e -- --project=chromium --grep @claim:offline-reload` | Pass |
| `aes-zip` | `npm run test:e2e -- --project=chromium --grep @claim:aes-zip` | Pass |
| `password-not-stored` | `npm run test:e2e -- --project=chromium --grep @claim:password-not-stored` | Pass |
| `custom-templates` | `npm run test:e2e -- --project=chromium --grep @claim:custom-templates` | Pass |
| `license-restore` | `npm run test:e2e -- --project=chromium --grep @claim:license-restore` | Pass |
| `license-revocation` | `npm run test:e2e -- --project=chromium --grep @claim:license-revocation` | Pass |
| `offline-license-verdict` | `npm run test:e2e -- --project=chromium --grep @claim:offline-license-verdict` | Pass |
| `checkout-operator-gate` | `npm run test:e2e -- --project=chromium --grep @claim:checkout-operator-gate` | Pass |
| `configurable-checklists` | `npm run test:e2e -- --project=chromium --grep @claim:configurable-checklists` | Pass |
| `no-document-backend` | `npm run test:e2e -- --project=chromium --grep @claim:no-document-backend` | Pass |
| `data-deletion` | `npm run test:e2e -- --project=chromium --grep @claim:data-deletion` | Pass |
| `no-account-required` | `npm run test:e2e -- --project=chromium --grep @claim:no-account-required` | Pass |
| `pwa-installable` | `npm run test:e2e -- --project=chromium --grep @claim:pwa-installable` | Pass |
| `free-exports` | `npm run test:e2e -- --project=chromium --grep @claim:free-exports` | Pass |
| `core-no-setup` | `npm run test:e2e -- --project=chromium --grep @claim:core-no-setup` | Pass |
| `license-verification-minimum-data` | `npm run test:e2e -- --project=chromium --grep @claim:license-verification-minimum-data` | Pass |

## Quality, accessibility, and live checks

- `npm test`: pass, 11/11.
- `npm run check`: pass.
- `npm run build`: pass; `dist/index.html` was produced. Initial application JS is 16.99 KB gzip and CSS is 5.49 KB gzip. The large PDF/font chunks are lazy export dependencies, not initial application code.
- `npm run test:e2e`: pass (`test-results/.last-run.json` reports `passed`; 78 project entries, with 21 intentional mobile skips for Chromium-only export cases).
- `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`: pass. Root, hashed entry assets, service worker, manifest, demo, Privacy, and Terms bytes match the candidate build. Root SHA-256: `f593f6d40063696c4d673e7ff15b32193699211f9063feffe116c66e82a883a5`.
- `npm run verify:live -- https://invoice-evidence-pack.sociobot.in .factory/evidence/review-8/live`: pass. No console errors, page errors, failed requests, or third-party requests. It passed no-account ZIP export, demo reset/isolation, route announcements and focus, 404 response and metadata, revocation, offline license reconnection, mobile no-overflow, and service-worker offline reload.
- `/opt/fleet/lib/verify-url.sh https://invoice-evidence-pack.sociobot.in .factory/evidence/review-8/verify-url`: pass. HTTP 200; title, `lang=en`, one h1, main landmark, complete image alt text, labelled buttons, and no console errors.
- Fresh AxeBuilder checks found no violations on desktop root or phone demo. Keyboard checks passed, including visible skip-link focus and route-heading focus after navigation and Back. Reduced-motion behavior is covered by the passing browser suite.
- `/privacy`, `/terms`, `/demo/`, and `/` have route titles and required structure. An unknown URL intentionally returns the designed HTTP 404 with a return link, matching metadata, and the standard footer.

This is a static PWA, not a backend product. It has no product tenant, health, restart-persistence, or server-side document endpoint to test. Default checkout is operator-gated; the only optional external operation is license verification after an explicit token paste, which the declared minimum-data and revocation tests cover.

## Earlier finding disposition

All earlier review, verification, and polish reports were read. Each earlier finding is fixed and was rechecked in the current live run or current declared test suite.

| Earlier finding set | Current evidence | Status |
| --- | --- | --- |
| Review 1: F-1-1 | Default build has no checkout offer; `checkout-operator-gate` and restore tests pass. | Fixed |
| Review 1: F-1-2 | Header, hero demo, query-demo, and Back move focus to the destination h1 and announce it. | Fixed |
| Review 1: F-1-3–F-1-9 | 404 metadata and literal h1, explanatory caption, named storage/export section and labels, and plain license action all pass live. | Fixed |
| Review 1: F-1-10–F-1-16 | README has short, packet-consistent, plain-language setup, storage, offline, export, checklist, test, and deploy wording. | Fixed |
| Review 1: F-1-17–F-1-19 | Core-no-setup and license-minimum-data are declared/passing; no unsupported artwork claim remains. | Fixed |
| Review 2: F-2-1–F-2-4 | Privacy and Terms h1 values are literal; workspace task names are plain; no-account is tested; terminology uses payment trail consistently. | Fixed |
| Review 3: F-3-1 | Query-demo to Privacy and Back retain demo isolation, heading focus, and route announcements. | Fixed |
| Review 4: F-4-1–F-4-4 | Header Demo/Back focus works; manifest fingerprint is an exported-digest claim; external link disclosure and 404 footer match. | Fixed |
| Review 5: F-5-1–F-5-4 | Primary sample entry focuses/announces; revocation and offline-license behavior are declared; untestable merchant/refund copy is absent. | Fixed |
| Review 6: F-6-1–F-6-3 | Storage section is an h2; status says Online/Offline; decorative Plate label is gone. | Fixed |
| Review 7: F-7-1–F-7-8 | Backup scope is named accurately; password storage, template file exclusion, checklist editing, deletion, and backup scope are tested; terminology and checkout documentation are plain. | Fixed |
| Verification 2 | Immutable caching, defensive headers, and manifest MIME pass deployment verification. | Fixed |
| Verification 3 | Evidence file keyboard focus, whitespace validation, and touch target coverage pass. | Fixed |
| Verification 4 | Earlier license API throttling was independently observed in verification 17; this static product owns no backend endpoint. | Fixed / not a current product defect |
| Verification 5 | Duplicate ZIP names, operator-gated paid availability, fresh backup import, and Unicode PDF text are covered by passing claims. | Fixed |
| Verification 6 | E2E is green; checkout is correctly hidden by default; lazy export dependencies avoid an oversized initial shell; touch targets and claim inventory pass. | Fixed |
| Verification 7 | Malformed backup recovery gives an actionable product path; 100 MiB labeling and claimed behavior pass. | Fixed |
| Verification 9 | Demo has exactly one h1 in the current browser suite and live checks. | Fixed |
| Verification 11 | First-use offline ZIP and PDF exports pass `offline-reload`. | Fixed |

## Findings

None.
