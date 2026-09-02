# Invoice Packet first-read review 5 — FAIL

**Reviewed:** 2026-09-02 UTC  
**Live product:** <https://invoice-evidence-pack.sociobot.in>  
**Method:** fresh Chromium contexts at 390 × 844 and 1440 × 900; fresh-clone
claim replay; live request, demo, route, metadata, link, keyboard, source, and
history checks.

## Verdict

**FAIL.** The primary, visible demo action changes pages without moving
keyboard focus or announcing the new page. Three Terms statements are also
visitor-facing claims with no declared claim test. A pass requires zero
findings and no untested claim.

## Cold first screen

Before scrolling, both fresh viewports answered the required questions.

| Check | What the first screen communicated |
| --- | --- |
| What it does | “Build a complete invoice evidence packet.” |
| Who it is for | “For cross-border freelancers and small firms preparing files for an accountant, client, or filing review.” |
| What to select first | **Try it with sample data**. The adjacent note says, “The sample opens a separate workspace.” |

At 390 px, the primary action was visible, 350 × 46 px, and there was no
horizontal overflow or console error. The archive-paper palette, botanical
folio art, serif headings, clipped-paper controls, and field labels match the
documented field-guide design and do not resemble a generic SaaS template.

## Findings

### F-5-1 — BLOCKING — the landing’s primary demo action loses route focus and announcement (reopens F-1-2)

- **Location / exact action:** from `/`, activate the visible hero link
  **“Try it with sample data”** (`/?demo=1`).
- **Exact result:** the destination had title **“Demo — Invoice Packet”** and
  h1 **“Your packets”**, but `document.activeElement` was `<body>` and
  `#route-announcement` was empty. Browser Back correctly focused and
  announced the landing h1; the defect is the forward primary transition.
- **Why this matters:** the first action is the advertised way to try the
  product. A keyboard or screen-reader visitor receives no confirmation that
  the populated demo workspace opened.
- **Code confirmation:** `emptyState()` emits a plain `href="/?demo=1"`.
  The full-document route-focus marker used by header **Demo** is not set, and
  initial demo rendering calls `render(false)`.
- **Concrete fix:** make the hero demo link participate in the same
  full-document focus-marker contract as header Demo (or use one route
  implementation). On arrival, focus `#route-heading` and announce
  **“Opened Your packets”**. Add a regression test for `/` → **Try it with
  sample data** that asserts both conditions.

### F-5-2 — HIGH — refund and charge-reversal license revocation is an unlisted claim

- **Location / exact text:** `/terms/`, **License features**: “A refund or
  charge reversal revokes the license.”
- **Why this matters:** this describes a consequential paid-feature outcome,
  but `.factory/claims.json` has no matching claim or observable test.
- **Concrete fix:** add a `license-revocation` claim and a fixture-backed test
  that applies a reversal verdict and proves encrypted export and custom
  templates lock again; otherwise remove this statement until it is proven.

### F-5-3 — HIGH — offline license-verdict behavior is an unlisted claim

- **Location / exact text:** `/terms/`, **Software and availability**:
  “License verification may be temporarily unavailable offline; a recent valid
  verdict continues optimistically.”
- **Why this matters:** a license holder can rely on this when deciding whether
  encrypted export will work away from a network. No claim declares the grace
  behavior, its duration, or a sandbox test for it.
- **Concrete fix:** specify the observable policy and add a dedicated
  fixture-backed `offline-license-verdict` claim that verifies it in an
  isolated offline context; otherwise replace the statement with the verified
  behavior.

### F-5-4 — MEDIUM — merchant and refund-handling statement is an unlisted claim

- **Location / exact text:** `/terms/`, **License features**:
  “Sociobot/Dodo is the merchant of record and handles payment and refunds.”
- **Why this matters:** this names who receives payment and who resolves
  refunds. It is a visitor-facing billing promise, while the default build
  intentionally has no checkout and `claims.json` has no matching contract.
- **Concrete fix:** add a declared, fixture-backed billing-policy claim that
  checks the registered checkout configuration and disclosed merchant/refund
  policy, or remove this sentence until checkout is available and tested.

## Copy audit

Counts use space-delimited words; hyphenated forms count as one word. No
landing or README sentence exceeds 22 words. No banned marketing adjective,
inconsistent core term, mood heading, or non-result-naming action was found.
The three unlisted Terms claims are recorded above, rather than being treated
as landing or README copy findings.

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
| Each file stays in this browser and receives a SHA-256 fingerprint. | 10 | `local-only`, `sha256-hash` |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | `free-exports` |
| No document cloud and no account. | 6 | `no-document-backend`, `no-account-required` |
| SHA-256 fingerprints travel with the manifest. | 6 | `manifest-fingerprints` |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | `free-exports`, `json-backup` |
| Build a checked evidence packet without uploading your files. | 9 | `local-only` |
| Built by Param Factory · v1.1.0 | 5 | Pass — product identification |

Checked headings and controls are **Private invoice evidence packets**,
**Try it with sample data**, **Start your first packet**, **Import backup from
another device**, **How it works**, **Choose a checklist**, **Add the
evidence**, **Export the packet**, **Storage and export privacy**, **File
fingerprints in each manifest**, **Download ZIP, PDF, or JSON backup**, and
**Restore an existing license**. Each names a task, outcome, or section.
“Plate 01” is an artwork label, not information-bearing product copy.

### README: every sentence

| Copy | Words | Result |
| --- | ---: | --- |
| Create one invoice packet for a client review or filing. | 11 | Pass |
| Add evidence files, check what is missing, and export a ZIP or PDF manifest. | 14 | `missing-flags`, `free-exports` |
| Start from a cross-border filing, client review, or payment trail checklist. | 11 | `configurable-checklists` |
| Store packets and files in this browser. | 8 | `local-only` |
| It does not upload packet files or use analytics. | 10 | `no-document-backend` |
| Create a SHA-256 fingerprint for each evidence file and include it in the manifest. | 14 | `manifest-fingerprints` |
| Export plain ZIP packets, PDF manifests, and full JSON backups for free. | 12 | `free-exports`, `json-backup` |
| Keep distinct ZIP entries when evidence files share a filename. | 10 | `duplicate-zip` |
| Preserve Devanagari and Japanese packet metadata in PDF text. | 9 | `unicode-pdf` |
| Redact original filenames in exports when requested. | 7 | `filename-redaction` |
| Import a complete JSON backup on another browser. | 8 | `backup-import` |
| Install the app and reopen it offline after your first visit. | 11 | `offline-reload`, `pwa-installable` |
| Restore an existing license for encrypted ZIPs and reusable checklist templates. | 10 | `license-restore`, `aes-zip`, `custom-templates` |
| ZIP, PDF, and JSON backup exports work without a license. | 10 | `free-exports` |
| “Complete” means every required item has an attachment. | 8 | `missing-flags` |
| Choose and edit a checklist for your review. | 9 | `configurable-checklists` |
| Invoice Packet does not give tax or legal advice, or submit filings. | 13 | Product limit |
| Requirements: Node.js 20+ and npm. | 5 | Setup instruction |
| Vite prints the local URL. | 5 | Setup instruction |
| Create and export a packet without an API key or external service. | 12 | `core-no-setup` |
| The production build command is npm run build. | 8 | Build instruction |
| Output lands in dist/, with dist/index.html at its root. | 9 | Build instruction |
| End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. | 10 | Test instruction |
| They check persistence, downloads, accessibility, legal routes, and offline reload. | 9 | Test instruction |
| New-license checkout is disabled by default. | 6 | `checkout-operator-gate` |
| An operator enables it only after testing the registered hosted checkout. | 11 | Operator instruction |
| The product uses the billing product slug. | 7 | Deployment instruction |
| It does not contain a payment-provider key or product ID. | 10 | Deployment instruction |
| Deploy dist/ as a static site. | 6 | Deployment instruction |
| The build includes Privacy and Terms routes and a versioned offline cache. | 12 | Build instruction |
| staticwebapp.config.json supplies the static hosting headers. | 5 | Deployment instruction |
| The factory owns DNS and infrastructure. | 6 | Deployment instruction |
| After deployment, verify response policy and byte identity against the local build. | 12 | Deployment instruction |
| Files stay on the device unless the user exports them. | 10 | `local-only` |
| Browser data clearing can remove local storage, so use “Back up all data” before clearing it. | 16 | Recovery instruction |
| License verification sends the license token, not packet files or filenames. | 11 | `license-verification-minimum-data` |
| See the in-product Privacy and Terms pages for details. | 9 | Navigation instruction |
| The botanical field-guide visual system and artwork provenance are documented in .factory/design.md. | 12 | Repository documentation |
| The source illustration and prompt sidecar live under assets/src/. | 9 | Repository documentation |
| Optimized runtime assets live under public/assets/. | 6 | Repository documentation |
| PDF export font licenses are recorded in THIRD_PARTY_NOTICES.md. | 8 | Repository documentation |
| MIT — see LICENSE. | 4 | License reference |

Terminology is consistent: **packet**, **evidence**, **checklist**,
**manifest**, **backup**, **license**, and **payment trail**.

## Demo, sandbox, privacy, and claims

- The one-click link opened `/?demo=1` to **Kite Studio · August client
  review**. Its first visible screen already contained four collected files,
  SHA-256 values, optional records, notes, and export controls.
- The persistent banner said **“Demo — sample data, nothing is saved to your
  packets”**, explained the separate workspace, and offered **Reset demo** and
  **Start for real**. After changing the packet title, Reset restored **Kite
  Studio · August client review**.
- In a fresh live context, the full landing-to-demo flow produced only
  same-origin requests and no console or page errors. The normal database was
  created by the initial real workspace; the demo used the separate
  `demo:invoice-packet` database. The declared sandbox test independently
  verifies that real records are untouched.
- All 23 exact `claims.json` commands passed from a clean clone at
  `e12e7a0f28c079d65997b1f78129af023278df68`, including all request-log,
  offline, ZIP/PDF, backup, and paid-tool fixture cases. The three Terms
  statements in F-5-2 through F-5-4 have no corresponding entries.
- The brief does not imply an AI action. Adding a remote model would expose
  invoice evidence without improving the stated collection, checking, backup,
  or export job.

## Structure and quality checks

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. An unknown route
  returned the designed 404 with HTTP 404 and title **Page not found — Invoice
  Packet**.
- The application routes each had one h1, main, route-specific plain title,
  description, canonical URL, Open Graph/Twitter image metadata, favicon, and
  Apple touch icon. `robots.txt`, `sitemap.xml`, the manifest, and the static
  404 were present. The 404 has equivalent metadata and a recovery action.
- Every non-fragment route and the disclosed GitHub source link returned 200.
  The 404 skip link is an in-page fragment on the current intentional 404
  response, not a dead destination.
- Header/footer, skip link, external-link disclosure, no horizontal overflow,
  original artwork, and consistent Privacy/Terms navigation were confirmed.
- Header **Demo** → Back and query-demo → Privacy → Back focus and announce
  their heading correctly. F-5-1 is the one missed route transition.
- Clean clone quality gates passed: `npm test` (11 tests), `npm run check`,
  `npm run build`, `npm run test:e2e` (66 tests), `npm run test:e2e:repeat`
  (132 tests), and `npm run verify:deployment --
  https://invoice-evidence-pack.sociobot.in`.

## Earlier findings re-check

Every earlier review, polish record, and handoff was read and checked against
the live site and source.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Default build hides new checkout; `checkout-operator-gate` passed. |
| F-1-2 | Normal, header Demo, and query-demo legal routes focus/announce; the hero demo CTA regression is F-5-1. |
| F-1-3 / F-1-4 | 404 has complete metadata and literal **Page not found** h1. |
| F-1-5 through F-1-9 | Caption, privacy labels, export label, and existing-license action remain direct and specific. |
| F-1-10 through F-1-16 | README is short, plain, packet-consistent, and uses **payment trail**. |
| F-1-17 / F-1-18 | `core-no-setup` and `license-verification-minimum-data` are declared and passed. |
| F-1-19 | No public artwork-generation assertion appears in the footer. |
| F-2-1 / F-2-2 | Legal h1 values are **Privacy** and **Terms**; workspace labels are task names. |
| F-2-3 / F-2-4 | No-account workflow is declared and passed; README uses **payment trail**. |
| F-3-1 | Query-demo → Privacy → Back focuses and announces each destination. |
| F-4-1 | Header Demo → Back focuses and announces each destination. F-5-1 is a distinct, untested hero-CTA route path. |
| F-4-2 | `manifest-fingerprints` is declared and passes with an exported ZIP fixture. |
| F-4-3 / F-4-4 | Every footer labels the external GitHub source and includes the same link set. |

## What would make this perfect

Make the primary sample-demo action honor the same focus and announcement
contract as every other route transition. Then either prove or remove the
three paid-license statements in Terms. Repeat the full cold, demo, claim,
privacy, history, routing, and copy review from a fresh browser context.
