# Invoice Packet first-read review 3 — FAIL

**Reviewed:** 2026-09-02 UTC  
**Live product:** https://invoice-evidence-pack.sociobot.in  
**Method:** fresh Chromium contexts (390 × 844 and 1440 × 900), fresh local clone/install, live, route, link, request, and source checks.

## Verdict

**FAIL.** One blocking route-accessibility defect remains. Landing, demo, isolation, claims, visual identity, metadata, links, and local quality gates otherwise passed. A PASS requires zero findings.

## Cold first screen

Before scrolling, both viewports answered the required questions: it builds a complete invoice evidence packet; it is for cross-border freelancers and small firms preparing an accountant, client, or filing review; select **Try it with sample data** first. Adjacent text says “The sample opens a separate workspace.”

The primary action was visible and 46px high at 390px. There was no horizontal overflow or console error. The field-guide paper palette, botanical folio art, serif headings, and specimen labels are distinct from a generic SaaS template and match .factory/design.md.

## Findings

### F-3-1 — BLOCKING — demo route changes lose keyboard focus and route announcement

- **Location / exact result:** From live /?demo=1, selecting header **Privacy** opened /privacy/ with the correct title and h1, but document.activeElement was body and #route-announcement was empty. Browser Back to the demo likewise left focus on body and the announcement empty.
- **Why this matters:** A keyboard or screen-reader visitor trying the sample gets no cue that a different page has opened.
- **Code confirmation:** src/main.ts returns before intercepting data-route links whenever demoMode is true. The full navigation initializes with render(false), so focusRouteHeading() is not called. The Demo header link also lacks data-route.
- **Concrete fix:** Preserve a route-change marker through full navigations and on initialization focus #route-heading and announce “Opened {page name}”; or use one in-app navigation implementation that retains demo isolation. Add a test for ?demo=1 → Privacy → Back that asserts heading focus and the polite announcement.

## Copy audit

Counts use whitespace-delimited words; hyphenated terms count as one word. All are ≤22 words. No banned marketing adjective, inconsistent task term, metaphor heading, non-result button, or unlisted landing/README product claim was confirmed.

### Landing page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Build a complete invoice evidence packet. | 6 | Pass |
| For cross-border freelancers and small firms preparing files for an accountant, client, or filing review. | 15 | Pass |
| The sample opens a separate workspace. | 6 | Pass — demo-sandbox |
| Your own packet starts with a checklist. | 7 | Pass — configurable-checklists |
| One packet groups an invoice with its supporting evidence. | 9 | Pass |
| Prepare one packet in three steps. | 6 | Pass |
| Start with a filing, client review, or payment trail list. | 10 | Pass — configurable-checklists |
| Change it to match the request. | 6 | Pass |
| Each file stays in this browser and receives a SHA-256 fingerprint. | 11 | Pass — local-only, sha256-hash |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | Pass — free-exports |
| No document cloud and no account. | 6 | Pass — no-document-backend, no-account-required |
| SHA-256 fingerprints travel with the manifest. | 6 | Pass — sha256-hash |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | Pass — free-exports, json-backup |
| Build a checked evidence packet without uploading your files. | 9 | Pass — local-only |

Task/result headings and actions checked: **Private invoice evidence packets**, **Try it with sample data**, **Start your first packet**, **Import backup from another device**, **How it works**, **Choose a checklist**, **Add the evidence**, **Export the packet**, **Storage and export privacy**, **File fingerprints in each manifest**, **Download ZIP, PDF, or JSON backup**, and **Restore an existing license**. All name their task or result. “Plate 01” is decorative art labelling.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Create one invoice packet for a client review or filing. | 10 | Pass |
| Add evidence files, check what is missing, and export a ZIP or PDF manifest. | 14 | Pass — missing-flags, free-exports |
| Start from a cross-border filing, client review, or payment trail checklist. | 11 | Pass — configurable-checklists |
| Store packets and files in this browser. | 7 | Pass — local-only |
| It does not upload packet files or use analytics. | 9 | Pass — no-document-backend |
| Create a SHA-256 fingerprint for each evidence file and include it in the manifest. | 14 | Pass — sha256-hash |
| Export plain ZIP packets, PDF manifests, and full JSON backups for free. | 12 | Pass — free-exports, json-backup |
| Keep distinct ZIP entries when evidence files share a filename. | 10 | Pass — duplicate-zip |
| Preserve Devanagari and Japanese packet metadata in PDF text. | 9 | Pass — unicode-pdf |
| Redact original filenames in exports when requested. | 7 | Pass — filename-redaction |
| Import a complete JSON backup on another browser. | 8 | Pass — backup-import |
| Install the app and reopen it offline after your first visit. | 11 | Pass — offline-reload, pwa-installable |
| Restore an existing license for encrypted ZIPs and reusable checklist templates. | 11 | Pass — license-restore, aes-zip, custom-templates |
| ZIP, PDF, and JSON backup exports work without a license. | 10 | Pass — free-exports |
| “Complete” means every required item has an attachment. | 8 | Pass — missing-flags |
| Choose and edit a checklist for your review. | 8 | Pass — configurable-checklists |
| Invoice Packet does not give tax or legal advice, or submit filings. | 12 | Pass — product limit |
| Requirements: Node.js 20+ and npm. | 5 | Pass — setup instruction |
| Vite prints the local URL. | 5 | Pass — setup instruction |
| Create and export a packet without an API key or external service. | 12 | Pass — core-no-setup |
| The production build command is npm run build. | 8 | Pass — build instruction |
| Output lands in dist/, with dist/index.html at its root. | 9 | Pass — build instruction |
| End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. | 10 | Pass — test instruction |
| They check persistence, downloads, accessibility, legal routes, and offline reload. | 10 | Pass — test instruction |
| New-license checkout is disabled by default. | 6 | Pass — checkout-operator-gate |
| An operator enables it only after testing the registered hosted checkout. | 11 | Pass — operator instruction |
| The product uses the billing product slug. | 7 | Pass — deployment instruction |
| It does not contain a payment-provider key or product ID. | 10 | Pass — deployment instruction |
| Deploy dist/ as a static site. | 6 | Pass — deployment instruction |
| The build includes Privacy and Terms routes and a versioned offline cache. | 12 | Pass — build instruction |
| staticwebapp.config.json supplies the static hosting headers. | 6 | Pass — deployment instruction |
| The factory owns DNS and infrastructure. | 6 | Pass — deployment instruction |
| After deployment, verify response policy and byte identity against the local build. | 12 | Pass — deployment instruction |
| Files stay on the device unless the user exports them. | 10 | Pass — local-only |
| Browser data clearing can remove local storage, so use “Back up all data” before clearing it. | 16 | Pass — recovery instruction |
| License verification sends the license token, not packet files or filenames. | 11 | Pass — license-verification-minimum-data |
| See the in-product Privacy and Terms pages for details. | 9 | Pass — navigation instruction |
| The botanical field-guide visual system and artwork provenance are documented in .factory/design.md. | 12 | Pass — repository documentation |
| The source illustration and prompt sidecar live under assets/src/. | 9 | Pass — repository documentation |
| Optimized runtime assets live under public/assets/. | 6 | Pass — repository documentation |
| PDF export font licenses are recorded in THIRD_PARTY_NOTICES.md. | 8 | Pass — repository documentation |
| MIT — see LICENSE. | 4 | Pass — license reference |

## Demo, privacy, claims, and sandbox

- The one-click link opened /?demo=1 to a populated **Kite Studio · August client review** workspace. Its first screen already showed four collected realistic evidence records, hashes, optional items, reviewer notes, and ZIP/PDF export controls.
- The persistent banner says **“Demo — sample data, nothing is saved to your packets”**, explains the separate workspace, and exposes **Reset demo** and **Start for real**. Reset returned the sample view.
- Source confirms demo database demo:invoice-packet; normal uses invoice-packet. The declared demo-sandbox test verifies normal data remains untouched.
- A fresh live demo flow recorded requests only to https://invoice-evidence-pack.sociobot.in, with no console or page errors. No unlisted claim was found.
- All 22 exact commands in .factory/claims.json passed from the fresh clone: demo-sandbox, local-only, sha256-hash, file-size-limit, missing-flags, filename-redaction, duplicate-zip, unicode-pdf, json-backup, backup-import, offline-reload, aes-zip, custom-templates, license-restore, checkout-operator-gate, configurable-checklists, no-document-backend, no-account-required, pwa-installable, free-exports, core-no-setup, and license-verification-minimum-data.
- The brief does not imply an AI step. A remote model would add document data handling without a necessary collection, checklist, backup, or export outcome.

## Structure and quality checks

- /, /demo/, /privacy/, and /terms/ returned 200. /not-a-route returned the designed 404 with HTTP 404 and title **Page not found — Invoice Packet**.
- Each application route had one h1, main, title, description, canonical URL, Open Graph image, Twitter card, favicon, and Apple touch icon. Header/footer and skip link were consistent. Crawled same-origin links returned 200; no dead link was found.
- npm test, npm run check, npm run build, npm run test:e2e, npm run test:e2e:repeat, and npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in passed from the fresh clone. dist/ was emitted.
- The full Playwright suite has passing serious/critical Axe, mobile, offline, and request-log privacy checks. It only tests route focus in normal mode, which missed F-3-1.

## Earlier findings check

Every earlier review, polish report, and handoff was read. Each earlier finding is confirmed fixed live and in source, except that F-1-2 has the distinct demo-mode gap recorded as F-3-1.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Default build hides new checkout; checkout-operator-gate passed. |
| F-1-2 | Normal Privacy navigation and Back focus/announce; F-3-1 records the demo gap. |
| F-1-3 | 404 has description, canonical, OG, Twitter, and Apple-touch metadata. |
| F-1-4 | 404 h1 is “Page not found.” |
| F-1-5 | Hero caption explains invoice plus evidence. |
| F-1-6 | Assurance heading names storage and export privacy. |
| F-1-7 | Fingerprint assurance names the manifest content. |
| F-1-8 | Backup assurance names ZIP, PDF, and JSON backup. |
| F-1-9 | Released action is “Restore an existing license.” |
| F-1-10 | README opens with short packet-consistent copy. |
| F-1-11 | README explains browser storage and uploads plainly. |
| F-1-12 | README uses install-and-reopen-offline wording. |
| F-1-13 | README names free ZIP, PDF, and JSON exports. |
| F-1-14 | README says users choose and edit a checklist. |
| F-1-15 | README test documentation is split into short sentences. |
| F-1-16 | README deployment documentation is split into short sentences. |
| F-1-17 | core-no-setup is declared and passed. |
| F-1-18 | license-verification-minimum-data is declared and passed. |
| F-1-19 | Public footer artwork-generation claim is absent. |
| F-2-1 | Legal h1 values are literal Privacy and Terms. |
| F-2-2 | Workspace labels use Saved packets, Evidence files, Notes for the reviewer, and Export the packet. |
| F-2-3 | no-account-required is declared and passed. |
| F-2-4 | README consistently uses “payment trail.” |

## What would make this perfect

Make demo-mode navigation provide the same focused h1 and polite route announcement as normal mode, then add a regression test for Demo → Privacy → Back. Rerun this full review after that fix.

