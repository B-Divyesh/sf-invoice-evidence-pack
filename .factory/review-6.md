# Invoice Packet first-read review 6 — FAIL

**Reviewed:** 2026-09-02 UTC  
**Live product:** <https://invoice-evidence-pack.sociobot.in>  
**Method:** fresh Chromium contexts at 390 × 844 and 1440 × 900; clean-clone
claim replay; live demo, storage, request, route, link, metadata, keyboard,
accessibility, source, and history checks.

## Verdict

**FAIL.** The product is clear, tryable, honest about storage, and functionally
complete. No blocking defect or untested product claim was confirmed. Three
presentation findings remain, however, and this review requires zero findings
for a pass: the storage/privacy section has no semantic heading, the header
uses unexplained “Local first” jargon, and the hero retains a purely decorative
“Plate 01” label.

## Cold first screen

Before scrolling or reading repository history, both fresh viewports answered
the required questions.

| Check | What the first screen communicated |
| --- | --- |
| What it does | “Build a complete invoice evidence packet.” |
| Who it is for | “For cross-border freelancers and small firms preparing files for an accountant, client, or filing review.” |
| What to select first | **Try it with sample data**. The adjacent text says, “The sample opens a separate workspace.” |

At 390 px, the primary action and all three plain facts were visible within the
844 px viewport. The desktop view also showed the original botanical folio.
Neither cold load had horizontal overflow, failed requests, or console errors.
The archive-paper palette, serif headings, botanical art, clipped-paper
controls, and specimen layout match `.factory/design.md` and are distinct from
a generic SaaS template.

## Findings

### F-6-1 — MEDIUM — the storage and privacy section has no semantic heading

- **Exact location:** landing-page section after **How it works**. The visible
  label is **“Storage and export privacy”**, but the live DOM renders it as
  `<p class="eyebrow">` inside an otherwise unlabelled `<section>`.
- **Why this matters:** a screen-reader visitor navigating by headings skips
  the section that explains local storage, fingerprints, free exports, and
  license access. The visible outline and semantic outline do not match.
- **Concrete fix:** render **Storage and export privacy** as an `h2` and connect
  the section with `aria-labelledby`. Preserve the existing eyebrow styling.
  Add a browser assertion that the landing heading outline is h1 → h2 → h3s →
  h2 and that the assurance section has an accessible name.

### F-6-2 — MINOR — “Local first” is unexplained header jargon

- **Exact location / quote:** desktop header network indicator, **“Local
  first”**. The same status changes to **“Offline”** when the connection drops.
- **Why this matters:** “Local first” is an implementation phrase, not a plain
  connection state. A first-time visitor cannot tell whether it means local
  storage, a nearby service, or that the browser is online.
- **Concrete fix:** show **Online** while connected and **Offline** while
  disconnected. Keep the precise privacy fact **“Stored only in this browser”**
  in the first-screen fact list.

### F-6-3 — MINOR — “Plate 01” is a decorative label with no user information

- **Exact location / quote:** hero figure caption prefix, **“Plate 01”**.
- **Why this matters:** the label does not explain the product or image and
  would work unchanged on an unrelated field-guide design. The useful caption
  already follows it.
- **Concrete fix:** remove **Plate 01** and retain **“One packet groups an
  invoice with its supporting evidence.”** as the complete caption.

## Copy audit

Counts use whitespace-delimited words; hyphenated terms count as one word. No
sentence exceeds 22 words and no banned marketing adjective appears. F-6-2 and
F-6-3 are label-level findings; F-6-1 concerns heading semantics.

### Landing page: every sentence or complete fact

| Copy | Words | Result |
| --- | ---: | --- |
| Build a complete invoice evidence packet. | 6 | Pass |
| For cross-border freelancers and small firms preparing files for an accountant, client, or filing review. | 15 | Pass |
| The sample opens a separate workspace. | 6 | `demo-sandbox` |
| Your own packet starts with a checklist. | 7 | `configurable-checklists` |
| Stored only in this browser | 5 | `local-only` |
| Works offline after the first visit | 6 | `offline-reload` |
| Free ZIP, PDF, and JSON exports | 6 | `free-exports`, `json-backup` |
| One packet groups an invoice with its supporting evidence. | 9 | Pass |
| Prepare one packet in three steps. | 6 | Pass |
| Start with a filing, client review, or payment trail list. | 10 | `configurable-checklists` |
| Change it to match the request. | 6 | Pass |
| Each file stays in this browser and receives a SHA-256 fingerprint. | 11 | `local-only`, `sha256-hash` |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | `free-exports` |
| No document cloud and no account. | 6 | `no-document-backend`, `no-account-required` |
| SHA-256 fingerprints travel with the manifest. | 6 | `manifest-fingerprints` |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | `free-exports`, `json-backup` |
| Build a checked evidence packet without uploading your files. | 9 | `local-only` |
| Built by Param Factory · v1.1.0 | 5 | Pass |

Headings and actions checked: **Private invoice evidence packets**, **Build a
complete invoice evidence packet**, **Try it with sample data**, **Start your
first packet**, **Import backup from another device**, **How it works**,
**Prepare one packet in three steps**, **Choose a checklist**, **Add the
evidence**, **Export the packet**, **Storage and export privacy**, **File
fingerprints in each manifest**, **Download ZIP, PDF, or JSON backup**, and
**Restore an existing license**. They name a task, outcome, or section. The
visible storage/privacy label has the semantic defect in F-6-1. The remaining
labels **Local first** and **Plate 01** are F-6-2 and F-6-3.

### README: every sentence

| Copy | Words | Result |
| --- | ---: | --- |
| Create one invoice packet for a client review or filing. | 10 | Pass |
| Add evidence files, check what is missing, and export a ZIP or PDF manifest. | 14 | `missing-flags`, `free-exports` |
| Start from a cross-border filing, client review, or payment trail checklist. | 11 | `configurable-checklists` |
| Store packets and files in this browser. | 7 | `local-only` |
| It does not upload packet files or use analytics. | 9 | `no-document-backend` |
| Create a SHA-256 fingerprint for each evidence file and include it in the manifest. | 14 | `manifest-fingerprints` |
| Export plain ZIP packets, PDF manifests, and full JSON backups for free. | 12 | `free-exports`, `json-backup` |
| Keep distinct ZIP entries when evidence files share a filename. | 10 | `duplicate-zip` |
| Preserve Devanagari and Japanese packet metadata in PDF text. | 9 | `unicode-pdf` |
| Redact original filenames in exports when requested. | 7 | `filename-redaction` |
| Import a complete JSON backup on another browser. | 8 | `backup-import` |
| Install the app and reopen it offline after your first visit. | 11 | `offline-reload`, `pwa-installable` |
| Restore an existing license for encrypted ZIPs and reusable checklist templates. | 11 | `license-restore`, `aes-zip`, `custom-templates` |
| ZIP, PDF, and JSON backup exports work without a license. | 10 | `free-exports` |
| “Complete” means every required item has an attachment. | 8 | `missing-flags` |
| Choose and edit a checklist for your review. | 8 | `configurable-checklists` |
| Invoice Packet does not give tax or legal advice, or submit filings. | 12 | Product limit |
| Requirements: Node.js 20+ and npm. | 5 | Setup instruction |
| Vite prints the local URL. | 5 | Setup instruction |
| Create and export a packet without an API key or external service. | 12 | `core-no-setup` |
| The production build command is `npm run build`. | 8 | Build instruction |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Build instruction |
| End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. | 10 | Test instruction |
| They check persistence, downloads, accessibility, legal routes, and offline reload. | 10 | Test instruction |
| New-license checkout is disabled by default. | 6 | `checkout-operator-gate` |
| An operator enables it only after testing the registered hosted checkout. | 11 | Operator instruction |
| The product uses the billing product slug. | 7 | Deployment instruction |
| It does not contain a payment-provider key or product ID. | 10 | Deployment instruction |
| Deploy `dist/` as a static site. | 6 | Deployment instruction |
| The build includes Privacy and Terms routes and a versioned offline cache. | 12 | Build instruction |
| `staticwebapp.config.json` supplies the static hosting headers. | 6 | Deployment instruction |
| The factory owns DNS and infrastructure. | 6 | Deployment instruction |
| After deployment, verify response policy and byte identity against the local build. | 12 | Deployment instruction |
| Files stay on the device unless the user exports them. | 10 | `local-only` |
| Browser data clearing can remove local storage, so use “Back up all data” before clearing it. | 16 | Recovery instruction |
| License verification sends the license token, not packet files or filenames. | 11 | `license-verification-minimum-data` |
| See the in-product Privacy and Terms pages for details. | 9 | Navigation instruction |
| The botanical field-guide visual system and artwork provenance are documented in `.factory/design.md`. | 12 | Repository documentation |
| The source illustration and prompt sidecar live under `assets/src/`. | 9 | Repository documentation |
| Optimized runtime assets live under `public/assets/`. | 6 | Repository documentation |
| PDF export font licenses are recorded in `THIRD_PARTY_NOTICES.md`. | 8 | Repository documentation |
| MIT — see `LICENSE`. | 4 | License reference |

Terminology is consistent: **packet**, **evidence**, **checklist**, **manifest**,
**backup**, **license**, and **payment trail**.

## Demo and sandbox behavior

- The first-screen link opened `/?demo=1` in one click. The first mobile
  viewport already showed the persistent banner, **Kite Studio · August client
  review**, invoice `INV-2026-042`, and 100% completion.
- The complete sample includes four realistic attached files, two optional
  empty items, hashes, reviewer notes, and ZIP/PDF controls.
- The banner says **“Demo — sample data, nothing is saved to your packets”**
  and provides **Reset demo** and **Start for real**.
- After changing the sample packet name, **Reset demo** restored **Kite Studio
  · August client review**. Starting for real cleared the demo records.
- A normal-workspace sentinel survived the demo mutation and reset. No sample
  or changed demo value appeared in the normal workspace. Live IndexedDB used
  `invoice-packet` for normal data and `demo:invoice-packet` for sample data.
- The complete live demo flow made same-origin requests only. The clean claim
  tests independently confirmed the same storage and request boundaries.

## Claims

Every command was run exactly as listed from clean clone
`/tmp/invoice-review6-clean-9waIAk`. All 25 passed. Each claim tag occurs once
in the test sources.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | Pass |
| `local-only` | Pass |
| `sha256-hash` | Pass |
| `manifest-fingerprints` | Pass |
| `file-size-limit` | Pass |
| `missing-flags` | Pass |
| `filename-redaction` | Pass |
| `duplicate-zip` | Pass |
| `unicode-pdf` | Pass |
| `json-backup` | Pass |
| `backup-import` | Pass |
| `offline-reload` | Pass |
| `aes-zip` | Pass |
| `custom-templates` | Pass |
| `license-restore` | Pass |
| `license-revocation` | Pass |
| `offline-license-verdict` | Pass |
| `checkout-operator-gate` | Pass |
| `configurable-checklists` | Pass |
| `no-document-backend` | Pass |
| `no-account-required` | Pass |
| `pwa-installable` | Pass |
| `free-exports` | Pass |
| `core-no-setup` | Pass |
| `license-verification-minimum-data` | Pass |

The landing page, sample workspace, Privacy, Terms, license dialog, and README
were cross-checked against this inventory. No unlisted claim-like sentence
remains. In particular, exported fingerprints, no-account use, license
revocation, offline license behavior, and minimum-data verification each have
their own fixture-backed entry.

## Earlier findings re-check

Every earlier `review-*.md`, `polish-*.md`, and the incoming handoff was read.
Each earlier finding was checked on the live site and in current source.

| Earlier finding | Current confirmation | Status |
| --- | --- | --- |
| F-1-1 | Default live build has no checkout link; `checkout-operator-gate` and `license-restore` passed. | Fixed |
| F-1-2 | Normal routes, demo routes, hero/header demo entry, and Back focus the h1 and announce the route. | Fixed |
| F-1-3 | Live 404 has description, canonical, OG/Twitter data, and Apple touch icon. | Fixed |
| F-1-4 | Live 404 h1 is **Page not found**. | Fixed |
| F-1-5 | Caption explains that a packet groups an invoice and evidence. | Fixed |
| F-1-6 | Visible label is **Storage and export privacy**. F-6-1 is a new semantic-heading issue, not a wording regression. | Fixed |
| F-1-7 | Assurance label is **File fingerprints in each manifest**. | Fixed |
| F-1-8 | Assurance label names ZIP, PDF, and JSON backup. | Fixed |
| F-1-9 | Released action is **Restore an existing license**. | Fixed |
| F-1-10 | README opens with two short, packet-consistent sentences. | Fixed |
| F-1-11 | README uses browser-storage and upload wording without blob/IndexedDB jargon. | Fixed |
| F-1-12 | README says install and reopen offline, without using PWA as user copy. | Fixed |
| F-1-13 | README names the free ZIP, PDF, and JSON exports. | Fixed |
| F-1-14 | README tells readers to choose and edit a checklist. | Fixed |
| F-1-15 | README test documentation remains split into short sentences. | Fixed |
| F-1-16 | README deployment documentation remains split into short sentences. | Fixed |
| F-1-17 | `core-no-setup` is declared and passed. | Fixed |
| F-1-18 | `license-verification-minimum-data` is declared and passed. | Fixed |
| F-1-19 | No public artwork-generation assertion appears in the footer. | Fixed |
| F-2-1 | Legal h1 values are literal **Privacy** and **Terms**. | Fixed |
| F-2-2 | Workspace uses Saved packets, Evidence files, Notes for the reviewer, and Export the packet. | Fixed |
| F-2-3 | `no-account-required` is declared and passed. | Fixed |
| F-2-4 | README consistently uses **payment trail**. | Fixed |
| F-3-1 | Query-demo → Privacy → Back focuses and announces each destination while retaining demo isolation. | Fixed |
| F-4-1 | Header Demo → Back focuses and announces both destination headings. | Fixed |
| F-4-2 | `manifest-fingerprints` exports known bytes and verifies the complete digest in `manifest.json`. | Fixed |
| F-4-3 | Every footer visibly says **Source on GitHub ↗** and exposes its new-tab behavior accessibly. | Fixed |
| F-4-4 | The designed 404 has the same Privacy, Terms, and GitHub footer links. | Fixed |
| F-5-1 | Hero **Try it with sample data** focuses **Your packets** and announces **Opened Your packets**. | Fixed |
| F-5-2 | `license-revocation` proves revoked paid tools lock while free exports remain. | Fixed |
| F-5-3 | `offline-license-verdict` proves saved access offline and a recheck after reconnection. | Fixed |
| F-5-4 | Merchant/refund-handler wording is absent from the live Terms page and source. | Fixed |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and quality checks

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. An unknown route
  returned the designed 404 with HTTP 404 and a recovery link.
- Each checked route has `lang="en"`, one h1, one main, a route-specific title,
  description, canonical, Open Graph/Twitter metadata, favicon, and Apple
  touch icon. Titles are **Invoice Packet — build invoice evidence packets**,
  **Demo — Invoice Packet**, **Privacy — Invoice Packet**, **Terms — Invoice
  Packet**, and **Page not found — Invoice Packet**.
- Header and footer link sets are consistent. Every same-origin route and the
  disclosed GitHub source link returned 200. `robots.txt` and `sitemap.xml`
  list the public routes.
- Live hero entry, header Demo, legal navigation, and browser Back restore h1
  focus and the polite route announcement. F-6-1 records the remaining
  landing-outline issue.
- `/opt/fleet/lib/verify-url.sh` found no console errors, one h1, one main,
  complete alt text, and no unlabelled buttons. The full Playwright suite's
  Axe checks found no serious or critical issues at desktop/mobile widths or
  in either theme.
- From the clean clone, `npm test` passed 11/11, `npm run check` passed,
  `npm run build` produced `dist/`, and `npm run test:e2e` passed 52 applicable
  cases with 20 intentional project skips. Initial JavaScript is 16.69 kB
  gzip and CSS is 5.51 kB gzip.
- `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`
  passed response policy and byte identity. `npm run verify:live` passed the
  live demo, offline, route, footer, license, no-account, mobile Axe, request,
  and console checks.

## Missed leverage

No missing high-value feature is implied by the brief. The product already
has configurable checklists, file import, complete backup import/export,
ZIP/PDF export, redaction, encryption, and offline use. A remote AI step would
add sensitive data handling without improving the core evidence-collection
job, so no AI feature is recommended.

## What would make this perfect

Make **Storage and export privacy** a real h2, replace **Local first** with the
literal connection state **Online**, and remove **Plate 01**. Then repeat the
heading-outline and copy audit and confirm zero findings.
