# Invoice Packet first-read review 2 — FAIL

**Reviewed:** 2026-09-01 UTC
**Live product:** <https://invoice-evidence-pack.sociobot.in>
**Method:** fresh Chromium contexts at 390 × 844 and 1440 × 900; live request
log, route and link checks; read-only source review; and clean-clone claim
commands.

## Verdict

**FAIL.** The core job, first screen, live sample workspace, local-storage
boundary, declared claims, routes, and release checks are confirmed. Four
copy and claim-inventory findings remain. A PASS requires zero findings.

## Cold first screen

Before scrolling, both viewport checks answered the three required questions.

| Check | What the page communicated |
| --- | --- |
| What it does | “Build a complete invoice evidence packet.” |
| Who it is for | “For cross-border freelancers and small firms preparing files for an accountant, client, or filing review.” |
| What to select first | **Try it with sample data**; the adjacent note says that it opens a separate workspace. |

The primary action was visible at 390 px. The field-guide palette, paper
surfaces, serif display type, original folio illustration, and restrained
motion are distinct from a generic software template and match
`.factory/design.md`.

## Findings

### F-2-1 — HIGH — legal-page headings do not name their pages plainly

- **Location / exact text:** `/privacy/` h1, “Private by construction.”;
  `/terms/` h1, “A careful tool, not an adviser.”
- **Check:** both routes have correct titles, metadata, one h1, working
  focus, and announcements. The h1 text itself is a mood statement rather
  than the page subject. A screen reader hears these phrases after navigation
  instead of “Privacy” or “Terms.”
- **Why this matters:** a visitor arriving by a direct link has to infer what
  page opened. The current route announcement repeats the same indirect text.
- **Concrete fix:** use **Privacy and local storage** for the Privacy h1 and
  **Terms and product limits** for the Terms h1. Keep the explanatory ledes
  below them, and update the route-focus regression test to expect the new
  headings and announcements.

### F-2-2 — MEDIUM — the main workspace uses product metaphors instead of task names

- **Location / exact text:** `/demo/` shows “Field cabinet,” “New specimen,”
  “Collect the supporting trace,” “Evidence specimens,” “Margin notes,” and
  “Bind the folio.”
- **Check:** the sample data makes the workflow usable, but these labels name
  the visual theme rather than the user task. They also introduce terms that
  differ from the landing page’s consistent “packet” and “evidence” terms.
- **Why this matters:** a first-time visitor has to translate “cabinet,”
  “specimen,” “trace,” and “folio” before finding saved packets, evidence,
  notes, and exports.
- **Concrete fix:** retain the botanical styling as decoration, but rename the
  labels to **Saved packets**, **New packet**, **Collect evidence**,
  **Evidence files**, **Notes for the reviewer**, and **Export the packet**.
  Add a browser text check for these headings in the sample workspace.

### F-2-3 — MINOR — the “no account” assurance has no declared claim

- **Location / exact text:** landing assurance strip, “No document cloud and
  no account.”
- **Check:** `no-document-backend` confirms the no-document-backend and
  no-analytics part through the request log. No entry in
  `.factory/claims.json` states or tests the separate “no account” promise.
- **Why this matters:** a visitor can reasonably rely on being able to use the
  product without registration.
- **Concrete fix:** either change the sentence to **Files stay in this
  browser.** or add a `no-account-required` claim that starts from a fresh
  browser context, creates and exports a packet, and confirms no registration
  or sign-in step appears.

### F-2-4 — MINOR — README uses two forms of the same checklist term

- **Location / exact text:** README, “Start from a cross-border filing, client
  review, or **payment-trail** checklist.” The landing page and terminology
  table use “payment trail.”
- **Check:** this is the only current terminology mismatch in the landing and
  README copy audit.
- **Why this matters:** the product asks people to choose a checklist, so the
  same checklist should have one searchable name everywhere.
- **Concrete fix:** change the README wording to **payment trail checklist**.

## Copy audit

Counts use space-delimited words. Hyphenated forms count as one word. No
landing or README sentence exceeds 22 words. The wording findings above are
called out in the result column.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Build a complete invoice evidence packet. | 6 | Pass |
| For cross-border freelancers and small firms preparing files for an accountant, client, or filing review. | 15 | Pass |
| The sample opens a separate workspace. | 6 | Pass — `demo-sandbox` |
| Your own packet starts with a checklist. | 7 | Pass — `configurable-checklists` |
| One packet groups an invoice with its supporting evidence. | 9 | Pass |
| Prepare one packet in three steps. | 6 | Pass |
| Start with a filing, client review, or payment trail list. | 10 | Pass — `configurable-checklists` |
| Change it to match the request. | 6 | Pass |
| Each file stays in this browser and receives a SHA-256 fingerprint. | 10 | Pass — `local-only`, `sha256-hash` |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | Pass — `free-exports` |
| No document cloud and no account. | 6 | F-2-3 |
| SHA-256 fingerprints travel with the manifest. | 6 | Pass — `sha256-hash` |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | Pass — `free-exports`, `json-backup` |
| Build a checked evidence packet without uploading your files. | 9 | Pass — `local-only` |

Landing headings and actions name their sections or results directly. “Plate
01” is decorative artwork labelling; it is not needed to understand the page.
The live workspace labels are separately recorded in F-2-2.

### README

| Sentence | Words | Result |
| --- | ---: | --- |
| Create one invoice packet for a client review or filing. | 10 | Pass |
| Add evidence files, check what is missing, and export a ZIP or PDF manifest. | 14 | Pass — `missing-flags`, `free-exports` |
| Start from a cross-border filing, client review, or payment-trail checklist. | 10 | F-2-4 |
| Store packets and files in this browser. | 7 | Pass — `local-only` |
| It does not upload packet files or use analytics. | 9 | Pass — `no-document-backend` |
| Create a SHA-256 fingerprint for each evidence file and include it in the manifest. | 14 | Pass — `sha256-hash` |
| Export plain ZIP packets, PDF manifests, and full JSON backups for free. | 12 | Pass — `free-exports`, `json-backup` |
| Keep distinct ZIP entries when evidence files share a filename. | 10 | Pass — `duplicate-zip` |
| Preserve Devanagari and Japanese packet metadata in PDF text. | 9 | Pass — `unicode-pdf` |
| Redact original filenames in exports when requested. | 7 | Pass — `filename-redaction` |
| Import a complete JSON backup on another browser. | 8 | Pass — `backup-import` |
| Install the app and reopen it offline after your first visit. | 11 | Pass — `offline-reload`, `pwa-installable` |
| Restore an existing license for encrypted ZIPs and reusable checklist templates. | 11 | Pass — `license-restore`, `aes-zip`, `custom-templates` |
| ZIP, PDF, and JSON backup exports work without a license. | 10 | Pass — `free-exports` |
| “Complete” means every required item has an attachment. | 8 | Pass — `missing-flags` |
| Choose and edit a checklist for your review. | 8 | Pass — `configurable-checklists` |
| Invoice Packet does not give tax or legal advice, or submit filings. | 12 | Pass — product limit |
| Requirements: Node.js 20+ and npm. | 5 | Pass — setup instruction |
| Vite prints the local URL. | 5 | Pass — setup instruction |
| Create and export a packet without an API key or external service. | 12 | Pass — `core-no-setup` |
| The production build command is `npm run build`. | 8 | Pass — build instruction |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Pass — build instruction |
| End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. | 10 | Pass — test instruction |
| They check persistence, downloads, accessibility, legal routes, and offline reload. | 10 | Pass — test instruction |
| New-license checkout is disabled by default. | 6 | Pass — `checkout-operator-gate` |
| An operator enables it only after testing the registered hosted checkout. | 11 | Pass — operator instruction |
| The product uses the billing product slug. | 7 | Pass — deployment instruction |
| It does not contain a payment-provider key or product ID. | 10 | Pass — deployment instruction |
| Deploy `dist/` as a static site. | 6 | Pass — deployment instruction |
| The build includes Privacy and Terms routes and a versioned offline cache. | 12 | Pass — build instruction |
| `staticwebapp.config.json` supplies the static hosting headers. | 6 | Pass — deployment instruction |
| The factory owns DNS and infrastructure. | 6 | Pass — deployment instruction |
| After deployment, verify response policy and byte identity against the local build. | 12 | Pass — deployment instruction |
| Files stay on the device unless the user exports them. | 10 | Pass — `local-only` |
| Browser data clearing can remove local storage, so use “Back up all data” before clearing it. | 16 | Pass — recovery instruction |
| License verification sends the license token, not packet files or filenames. | 11 | Pass — `license-verification-minimum-data` |
| See the in-product Privacy and Terms pages for details. | 9 | Pass — navigation instruction |
| The botanical field-guide visual system and artwork provenance are documented in `.factory/design.md`. | 12 | Pass — repository documentation |
| The source illustration and prompt sidecar live under `assets/src/`. | 9 | Pass — repository documentation |
| Optimized runtime assets live under `public/assets/`. | 6 | Pass — repository documentation |
| PDF export font licenses are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). | 8 | Pass — repository documentation |
| MIT — see [LICENSE](LICENSE). | 4 | Pass — license reference |

## Demo, privacy, and sandbox checks

- The one-click action opened `/demo/` directly to the populated **Kite Studio
  · August client review** packet at both viewport widths. The first screen
  showed four collected required items, realistic file names, hashes, export
  controls, and reviewer notes.
- The persistent banner read **“Demo — sample data, nothing is saved to your
  packets”**, with **Reset demo** and **Start for real**.
- A fresh-context live check created a normal packet, opened and reset demo,
  then returned to normal mode. The normal packet remained. The demo showed
  `demo:invoice-packet`; normal data used `invoice-packet`.
- Whole-flow request logging recorded only
  `https://invoice-evidence-pack.sociobot.in` requests. No console or page
  errors occurred. The declared `local-only`, `no-document-backend`, and
  `offline-reload` tests also passed from the clean clone.
- No additional AI step is expected by the brief. Collection, checklist,
  privacy, backup, and export are the stated useful workflow; a remote model
  step would add data handling without a clear job benefit.

## Claims and local quality checks

`npm ci` completed in a fresh clone at
`/tmp/invoice-evidence-pack-review-uCCmzY`. Every exact command in
`.factory/claims.json` then passed:

| Claim IDs with passing declared commands |
| --- |
| `demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`, `missing-flags`, `filename-redaction`, `duplicate-zip` |
| `unicode-pdf`, `json-backup`, `backup-import`, `offline-reload`, `aes-zip`, `custom-templates`, `license-restore` |
| `checkout-operator-gate`, `configurable-checklists`, `no-document-backend`, `pwa-installable`, `free-exports`, `core-no-setup`, `license-verification-minimum-data` |

`npm test`, `npm run check`, and `npm run build` also passed locally. The
build produced `dist/`; initial entry JavaScript is 16.52 kB gzip and CSS is
5.51 kB gzip. The large export-related chunks are not referenced by the
initial HTML. `npm run verify:deployment --
https://invoice-evidence-pack.sociobot.in` passed response policy and live
byte identity.

## History check

Every earlier review, polish report, verification report, and handoff was
read. The following live and source checks confirm that each review-1 finding
is actually fixed; the new findings above are separate.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Default live build shows purchase unavailability and no checkout link; `checkout-operator-gate` passed. |
| F-1-2 | Privacy navigation and Back focused the new h1 and updated the polite announcement. |
| F-1-3 | The live 404 has description, canonical, OG, Twitter, and Apple-touch metadata. |
| F-1-4 | The live 404 h1 is “Page not found.” |
| F-1-5 | Hero caption now says one packet groups an invoice with evidence. |
| F-1-6 | Landing assurance heading is “Storage and export privacy.” |
| F-1-7 | The fingerprint assurance label names the manifest content. |
| F-1-8 | The backup assurance label names ZIP, PDF, and JSON. |
| F-1-9 | The released action is “Restore an existing license.” |
| F-1-10 | README opens with two short packet-consistent sentences. |
| F-1-11 | README storage text describes browser storage and uploads plainly. |
| F-1-12 | README uses install-and-reopen-offline wording. |
| F-1-13 | README names free ZIP, PDF, and JSON exports. |
| F-1-14 | README tells readers to choose and edit a checklist. |
| F-1-15 | README test documentation is split into short sentences. |
| F-1-16 | README deployment documentation is split into short sentences. |
| F-1-17 | `core-no-setup` is declared and passed. |
| F-1-18 | `license-verification-minimum-data` is declared and passed. |
| F-1-19 | The unlinked public artwork-generation statement is absent from the footer. |

## Structure check

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. An unknown path
  returned the designed 404 with HTTP 404.
- Each checked route had one h1, a main landmark, a route-specific title,
  description, canonical URL, Open Graph image, Twitter card, favicon, and
  Apple touch icon. F-2-1 records the remaining h1 wording issue.
- The header and footer were consistent. Same-origin landing links to the
  skip target, packets, demo, Privacy, and Terms returned 200. Sitemap and
  robots list the expected public routes.
- At 390 px there was no horizontal page overflow. Both live cold loads had
  no console errors. The full local browser suite contains serious and
  critical accessibility checks for empty and editor states.

## What would make this perfect

Use plain, task-naming headings on Privacy, Terms, and the workspace; declare
or remove the no-account promise; and use “payment trail” consistently in the
README. Then rerun this complete review from a fresh browser context and
confirm that no findings remain.
