# Invoice Packet first-read review 4 — FAIL

**Reviewed:** 2026-09-02 UTC  
**Live product:** <https://invoice-evidence-pack.sociobot.in>  
**Method:** fresh Chromium at 390 × 844 and 1440 × 900; clean-clone claim replay; live request, route, link, metadata, keyboard, source, and history checks.

## Verdict

**FAIL.** The cold first screen, populated isolated demo, privacy request boundary, declared claim tests, core workflow, metadata, 404, and visual identity were verified. Four findings remain. F-4-1 is blocking because it reopens the route-focus requirement from F-1-2; F-4-2 is an unlisted product claim.

## Cold first screen

| Check | What a first-time visitor can determine |
| --- | --- |
| What it does | “Build a complete invoice evidence packet.” |
| Who it is for | “For cross-border freelancers and small firms preparing files for an accountant, client, or filing review.” |
| First click | **Try it with sample data**; adjacent text says “The sample opens a separate workspace.” |

At 390px the primary control was visible at 350 × 46px. There was no horizontal overflow or console error. The botanical field-guide artwork, archive-paper palette, serif display type, specimen labels, and clipped paper controls match .factory/design.md and are distinct from a generic SaaS template.

## Findings

### F-4-1 — BLOCKING — header Demo navigation and Back still lose route focus and announcement (reopens F-1-2)

- **Location / exact result:** From /, selecting header **“Demo”** (live link href="/demo/") opens /demo/. The destination h1 is “Your packets,” but document.activeElement is body and #route-announcement is empty. Browser Back to / again leaves focus on body and the announcement empty.
- **Why this matters:** a keyboard or screen-reader visitor gets no confirmation that the sample workspace, then the landing page, opened. This is a header route and browser-history path, not a cold direct entry.
- **Concrete fix:** make the header Demo transition participate in the same route-change focus contract, including Back. Preserve a route-change marker across the full demo navigation (or use an in-app implementation that preserves demo isolation), then focus #route-heading and announce “Opened {heading}” after data renders. Add a regression test for / → header Demo → Back that asserts heading focus and the polite announcement at both destinations.

### F-4-2 — HIGH — the manifest-fingerprint promise is not a declared, tested claim

- **Location / exact text:** landing assurance strip, “File fingerprints in each manifest” and “SHA-256 fingerprints travel with the manifest”; README, “Create a SHA-256 fingerprint for each evidence file and include it in the manifest.”
- **Why this matters:** this promises an export property, not merely local hash calculation. The related sha256-hash entry says only “Each evidence file receives a SHA-256 fingerprint,” and its unit test compares a Blob digest; it neither declares this landing wording nor asserts that an exported manifest contains the value.
- **Concrete fix:** add a manifest-fingerprints entry to .factory/claims.json with these landing and README locations. Tag one clean-sandbox test that attaches known bytes, exports a ZIP, reads manifest.json, and compares its complete SHA-256 value to an independent fixture digest. Alternatively remove the “in each/travel with the manifest” wording everywhere.

### F-4-3 — MINOR — the external Source link does not say that it opens an external new tab

- **Location / exact text:** application footer **“Source”**. It has target="_blank" and points to GitHub, but its visible and accessible name gives neither fact.
- **Why this matters:** a visitor, especially one using a screen reader, is not told that selecting it changes site and opens a new tab.
- **Concrete fix:** use an accessible name such as **“Source on GitHub (opens in a new tab)”** and retain a visible external-link affordance.

### F-4-4 — MINOR — the designed 404 footer is not the same footer used by application routes

- **Location / exact result:** the application footer contains **“Source”**, while /not-a-route renders only Privacy and Terms in its footer.
- **Why this matters:** the site skeleton changes on the error route even though the page otherwise presents itself as part of the product.
- **Concrete fix:** render the same footer link set and external-link disclosure on public/404.html as on /, /demo/, /privacy/, and /terms/.

## Copy audit

Counts use whitespace-delimited words; hyphenated forms count as one word. No landing or README sentence exceeds 22 words. No banned marketing adjective, inconsistent task term, mood heading, or non-result action was found. F-4-2 is the claim-inventory exception.

### Landing page: every sentence

| Sentence | Words | Result |
| --- | ---: | --- |
| Build a complete invoice evidence packet. | 6 | Pass |
| For cross-border freelancers and small firms preparing files for an accountant, client, or filing review. | 15 | Pass |
| The sample opens a separate workspace. | 6 | demo-sandbox |
| Your own packet starts with a checklist. | 7 | configurable-checklists |
| One packet groups an invoice with its supporting evidence. | 9 | Pass |
| Prepare one packet in three steps. | 6 | Pass |
| Start with a filing, client review, or payment trail list. | 10 | configurable-checklists |
| Change it to match the request. | 6 | Pass |
| Each file stays in this browser and receives a SHA-256 fingerprint. | 10 | local-only; sha256-hash |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | free-exports |
| No document cloud and no account. | 6 | no-document-backend; no-account-required |
| SHA-256 fingerprints travel with the manifest. | 6 | F-4-2 |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | free-exports; json-backup |
| Build a checked evidence packet without uploading your files. | 9 | local-only |

Checked headings/actions: **Private invoice evidence packets**, **Try it with sample data**, **Start your first packet**, **Import backup from another device**, **How it works**, **Choose a checklist**, **Add the evidence**, **Export the packet**, **Storage and export privacy**, **File fingerprints in each manifest**, **Download ZIP, PDF, or JSON backup**, and **Restore an existing license**. They name a job, section, or result. “Plate 01” is a decorative figure label, not a heading or slogan.

### README: every sentence

| Sentence | Words | Result |
| --- | ---: | --- |
| Create one invoice packet for a client review or filing. | 10 | Pass |
| Add evidence files, check what is missing, and export a ZIP or PDF manifest. | 14 | missing-flags; free-exports |
| Start from a cross-border filing, client review, or payment trail checklist. | 11 | configurable-checklists |
| Store packets and files in this browser. | 7 | local-only |
| It does not upload packet files or use analytics. | 9 | no-document-backend |
| Create a SHA-256 fingerprint for each evidence file and include it in the manifest. | 14 | F-4-2 |
| Export plain ZIP packets, PDF manifests, and full JSON backups for free. | 12 | free-exports; json-backup |
| Keep distinct ZIP entries when evidence files share a filename. | 10 | duplicate-zip |
| Preserve Devanagari and Japanese packet metadata in PDF text. | 9 | unicode-pdf |
| Redact original filenames in exports when requested. | 7 | filename-redaction |
| Import a complete JSON backup on another browser. | 8 | backup-import |
| Install the app and reopen it offline after your first visit. | 11 | offline-reload; pwa-installable |
| Restore an existing license for encrypted ZIPs and reusable checklist templates. | 11 | license-restore; aes-zip; custom-templates |
| ZIP, PDF, and JSON backup exports work without a license. | 10 | free-exports |
| “Complete” means every required item has an attachment. | 8 | missing-flags |
| Choose and edit a checklist for your review. | 8 | configurable-checklists |
| Invoice Packet does not give tax or legal advice, or submit filings. | 12 | Product limit |
| Requirements: Node.js 20+ and npm. | 5 | Setup instruction |
| Vite prints the local URL. | 5 | Setup instruction |
| Create and export a packet without an API key or external service. | 12 | core-no-setup |
| The production build command is npm run build. | 8 | Build instruction |
| Output lands in dist/, with dist/index.html at its root. | 9 | Build instruction |
| End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. | 10 | Test instruction |
| They check persistence, downloads, accessibility, legal routes, and offline reload. | 10 | Test instruction |
| New-license checkout is disabled by default. | 6 | checkout-operator-gate |
| An operator enables it only after testing the registered hosted checkout. | 11 | Operator instruction |
| The product uses the billing product slug. | 7 | Deployment instruction |
| It does not contain a payment-provider key or product ID. | 10 | Deployment instruction |
| Deploy dist/ as a static site. | 6 | Deployment instruction |
| The build includes Privacy and Terms routes and a versioned offline cache. | 12 | Build instruction |
| staticwebapp.config.json supplies the static hosting headers. | 6 | Deployment instruction |
| The factory owns DNS and infrastructure. | 6 | Deployment instruction |
| After deployment, verify response policy and byte identity against the local build. | 12 | Deployment instruction |
| Files stay on the device unless the user exports them. | 10 | local-only |
| Browser data clearing can remove local storage, so use “Back up all data” before clearing it. | 16 | Recovery instruction |
| License verification sends the license token, not packet files or filenames. | 11 | license-verification-minimum-data |
| See the in-product Privacy and Terms pages for details. | 9 | Navigation instruction |
| The botanical field-guide visual system and artwork provenance are documented in .factory/design.md. | 12 | Repository documentation |
| The source illustration and prompt sidecar live under assets/src/. | 9 | Repository documentation |
| Optimized runtime assets live under public/assets/. | 6 | Repository documentation |
| PDF export font licenses are recorded in THIRD_PARTY_NOTICES.md. | 8 | Repository documentation |
| MIT — see LICENSE. | 4 | License reference |

Terminology is otherwise consistent: **packet**, **evidence**, **checklist**, **manifest**, **backup**, **license**, and **payment trail**.

## Demo, sandbox, privacy, and claims

- The one-click ?demo=1 entry immediately showed **Kite Studio · August client review** with four collected files, SHA-256 values, optional rows, notes, and export controls.
- The persistent banner read **“Demo — sample data, nothing is saved to your packets”** and supplied **Reset demo** and **Start for real**. Reset retained the banner and restored the original sample.
- The fresh demo context held only demo:invoice-packet. The complete checked flow made same-origin requests only and had no console or page errors. The declared demo test also checks the normal-workspace boundary.
- All 22 exact commands in .factory/claims.json passed from a clean clone: demo-sandbox, local-only, sha256-hash, file-size-limit, missing-flags, filename-redaction, duplicate-zip, unicode-pdf, json-backup, backup-import, offline-reload, aes-zip, custom-templates, license-restore, checkout-operator-gate, configurable-checklists, no-document-backend, no-account-required, pwa-installable, free-exports, core-no-setup, and license-verification-minimum-data.
- No declared claim test failed. F-4-2 is separate: the current sha256-hash test does not exercise exported manifest inclusion.
- The brief does not imply a useful AI action. A remote model would add sensitive document handling without improving collection, checking, backup, or export.

## Structure and quality checks

- /, /demo/, /privacy/, and /terms/ returned 200. An unknown path returned the designed 404 with HTTP 404 and title **Page not found — Invoice Packet**.
- The checked routes had one h1, main, route-specific titles, descriptions, canonical URLs, Open Graph/Twitter metadata, favicon, and Apple touch icon. The 404 carries equivalent static metadata.
- All landing links were crawled: same-origin routes returned 200 and the GitHub Source destination returned 200. F-4-3 and F-4-4 record the remaining external-link/footer issues.
- verify-url.sh reported 793ms live load, no console errors, lang="en", one h1, one main, no missing image alt text, and no unlabeled buttons.
- npm run verify:deployment against live passed policy and byte-identity checks. The clean clone passed npm test (11/11), npm run check, npm run build, and the full 60-test browser suite. dist/ was produced.

## Earlier findings re-check

Every earlier review, polish report, and handoff was read.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Default build hides new checkout; checkout-operator-gate passed. |
| F-1-2 | Normal Privacy and demo-to-Privacy navigation focus and announce; header Demo and Back remain incomplete as F-4-1. |
| F-1-3 / F-1-4 | The 404 has complete metadata and literal **Page not found** h1. |
| F-1-5 through F-1-9 | Caption, assurance labels, and existing-license action remain plain and task-naming. |
| F-1-10 through F-1-16 | README copy is short, plain, packet-consistent, and uses **payment trail**. |
| F-1-17 / F-1-18 | core-no-setup and license-verification-minimum-data are declared and passed. |
| F-1-19 | No public artwork-generation claim appears in the footer. |
| F-2-1 / F-2-2 | Legal h1 values are **Privacy** and **Terms**; demo workspace labels are direct. |
| F-2-3 / F-2-4 | no-account-required is declared and passed; README uses **payment trail**. |
| F-3-1 | ?demo=1 → Privacy → Back focuses #route-heading and announces both changes. |

## What would make this perfect

Make every header/history route transition announce and focus the destination heading, prove manifest fingerprint inclusion with one declared sandbox claim, and make footer link treatment consistent and explicit about GitHub/new-tab navigation. Then repeat this full review from a fresh browser context.

