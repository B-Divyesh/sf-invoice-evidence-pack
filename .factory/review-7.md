# Invoice Packet first-read review 7 — FAIL

**Reviewed:** 2 September 2026 UTC

**Live product:** <https://invoice-evidence-pack.sociobot.in>

**Candidate:** `83bd902fc6e7a74eb19332d0e3b23500dae925bf`

## Verdict

**FAIL.** The cold landing screen, isolated sample workspace, all 25 declared
claim commands, routes, accessibility checks, and core workflow passed. Eight
copy or claim-inventory findings remain. None is a demo or declared-claim test
failure, but this review requires zero findings and no untested public claim.

## Cold first screen

I opened the live root in new Chromium contexts at 390 × 844 and 1440 × 900
before scrolling.

| Question | First-read answer |
| --- | --- |
| What does it do? | It builds one packet containing an invoice and its supporting evidence. |
| For whom? | Cross-border freelancers and small firms preparing an accountant, client, or filing review. |
| What should I select first? | **Try it with sample data**; the adjacent text says the sample opens a separate workspace. |

The primary action and all three facts were visible in the 390 px first screen.
There was no horizontal overflow, failed request, or console error. The first
screen passes.

## Findings

### F-7-1 — HIGH — “Back up all data” does not back up all locally stored data

- **Exact locations:** workspace button **“Back up all data”**; Privacy says
  **“Packet details, attachments, file hashes, custom templates, settings, and
  license tokens are stored locally.”** It then says **“Use ‘Back up all data’
  before clearing browser storage or changing devices.”**
- **Observed result:** a live download contained only `format`, `version`,
  `exportedAt`, `templates`, and `packets`. A saved theme, license token, and
  license verdict remained in local storage and were absent from the backup.
  The `json-backup` claim only promises packet attachments and does not test
  the stronger **all data** wording.
- **Why this matters:** a visitor following the recovery instruction can clear
  the browser and discover that preferences and paid-access state were not in
  the file described as a backup of all data.
- **Concrete fix:** rename the action to **Back up packets and templates** and
  rewrite the Privacy instruction to match, or include settings and a safe
  license-restoration representation in the format. Add a tagged claim that
  asserts the exact exported scope and its import result.

### F-7-2 — HIGH — the password-recovery statement is an unlisted security claim

- **Exact location / quote:** demo encrypted-export dialog: **“Use a password
  you can share separately. It cannot be recovered by Invoice Packet.”**
- **Observed coverage:** `aes-zip` proves AES strength, correct-password
  decryption, and wrong-password rejection. Neither its claim text nor its test
  checks that the password is absent from IndexedDB, local storage, exports,
  and requests after the export.
- **Why this matters:** this is a security and recovery promise on which a user
  may decide how to store the password.
- **Concrete fix:** add a `password-not-stored` claim and a clean-context test
  that audits browser storage, the archive, and the request log after export;
  or remove the recovery statement.

### F-7-3 — MEDIUM — checklist editing is claimed but not declared or tested as a claim

- **Exact locations / quotes:** landing, **“Change it to match the request.”**;
  README, **“Choose and edit a checklist for your review.”**; new-packet dialog,
  **“You can change every checklist item.”**
- **Observed coverage:** `configurable-checklists` only declares and tests
  starting a packet from the three built-in lists. Its tagged test does not add,
  remove, rename, or change the required state of an item and confirm persistence.
- **Why this matters:** editing the requested evidence list is a central
  jurisdiction-flexibility promise, not incidental interface copy.
- **Concrete fix:** expand `configurable-checklists` to include editing and make
  its one tagged test edit the checklist, reload, and verify the saved result.

### F-7-4 — MEDIUM — “Files are never copied” is an unlisted template-privacy claim

- **Exact location / quote:** demo workspace, **“Save its labels and
  requirements as a new template. Files are never copied.”**
- **Observed coverage:** `custom-templates` saves a template and checks that its
  name appears in the new-packet list. It does not create from that template or
  assert that file blobs and filename metadata are absent.
- **Why this matters:** a visitor may rely on this sentence before turning a
  packet containing client documents into a reusable template.
- **Concrete fix:** add the file-exclusion statement to `custom-templates` and
  extend its tagged test to create a packet from the saved template and inspect
  both UI state and IndexedDB for absent attachment data.

### F-7-5 — MEDIUM — the Privacy page’s deletion promises are unlisted

- **Exact location / quotes:** Privacy → Your controls: **“Deleting a packet
  removes its local record and files.”** and **“Clearing site data removes
  everything, including the saved license token.”**
- **Observed coverage:** no claim entry or tagged claim test performs either
  deletion and verifies the resulting IndexedDB and local-storage state.
- **Why this matters:** these are user-data removal guarantees, not general
  explanatory text.
- **Concrete fix:** add a `data-deletion` claim. Test packet deletion across a
  reload and test browser site-data clearing against packets, templates,
  settings, and license keys.

### F-7-6 — MINOR — the landing changes “checklist” to “list”

- **Exact location / quote:** How it works: **“Start with a filing, client
  review, or payment trail list.”** The action and README call the same object
  a **checklist**.
- **Why this matters:** the copy contract requires one term for one concept.
- **Concrete fix:** use **“Start with a filing, client review, or payment trail
  checklist.”**

### F-7-7 — MINOR — the landing changes “PDF manifest” to “PDF index”

- **Exact location / quote:** How it works: **“Download the evidence and
  manifest as ZIP, or make a PDF index.”** The export button and README call
  the PDF a **manifest**.
- **Why this matters:** “index” appears to be a second output type even though
  the product exposes one PDF manifest.
- **Concrete fix:** use **“Download the evidence as a ZIP, or export a PDF
  manifest.”**

### F-7-8 — MINOR — the README uses a vague implementation term

- **Exact location / quote:** README → Checkout configuration: **“The product
  uses the billing product slug.”**
- **Why this matters:** “slug” is implementation jargon, and the sentence does
  not identify the value a maintainer should verify.
- **Concrete fix:** use **“Checkout identifies this product as
  `invoice-evidence-pack`.”**

## Copy audit

Counts use whitespace-delimited words; hyphenated forms count as one word. No
sentence exceeds 22 words and no banned marketing adjective appears.

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
| Start with a filing, client review, or payment trail list. | 10 | F-7-6 |
| Change it to match the request. | 6 | F-7-3 |
| Each file stays in this browser and receives a SHA-256 fingerprint. | 11 | `local-only`, `sha256-hash` |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | F-7-7 |
| No document cloud and no account. | 6 | `no-document-backend`, `no-account-required` |
| SHA-256 fingerprints travel with the manifest. | 6 | `manifest-fingerprints` |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | `free-exports`, `json-backup` |
| Build a checked evidence packet without uploading your files. | 9 | `local-only`, `missing-flags` |
| Built by Param Factory · v1.1.0 | 5 | Pass |

Landing headings and visible actions checked: **Private invoice evidence
packets**, **How it works**, **Choose a checklist**, **Add the evidence**,
**Export the packet**, **Storage and export privacy**, **Try it with sample
data**, **Start your first packet**, **Import backup from another device**, and
**Restore an existing license**. Each heading names its section, and each action
uses a result-naming verb. No metaphor or mood heading remains.

### README: every sentence

| Sentence | Words | Result |
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
| Choose and edit a checklist for your review. | 8 | F-7-3 |
| Invoice Packet does not give tax or legal advice, or submit filings. | 12 | Product limit |
| Requirements: Node.js 20+ and npm. | 5 | Setup instruction |
| Vite prints the local URL. | 5 | Setup instruction |
| Create and export a packet without an API key or external service. | 12 | `core-no-setup` |
| The production build command is `npm run build`. | 8 | Build instruction |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Build instruction |
| End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. | 10 | Test documentation |
| They check persistence, downloads, accessibility, legal routes, and offline reload. | 10 | Test documentation |
| New-license checkout is disabled by default. | 6 | `checkout-operator-gate` |
| An operator enables it only after testing the registered hosted checkout. | 11 | Operator instruction |
| The product uses the billing product slug. | 7 | F-7-8 |
| It does not contain a payment-provider key or product ID. | 10 | Deployment statement |
| Deploy `dist/` as a static site. | 6 | Deployment instruction |
| The build includes Privacy and Terms routes and a versioned offline cache. | 12 | Build statement |
| `staticwebapp.config.json` supplies the static hosting headers. | 6 | Deployment statement |
| The factory owns DNS and infrastructure. | 6 | Deployment boundary |
| After deployment, verify response policy and byte identity against the local build. | 12 | Deployment instruction |
| Files stay on the device unless the user exports them. | 10 | `local-only` |
| Browser data clearing can remove local storage, so use “Back up all data” before clearing it. | 16 | F-7-1 |
| License verification sends the license token, not packet files or filenames. | 11 | `license-verification-minimum-data` |
| See the in-product Privacy and Terms pages for details. | 9 | Navigation instruction |
| The botanical field-guide visual system and artwork provenance are documented in [`.factory/design.md`](.factory/design.md). | 12 | Repository documentation |
| The source illustration and prompt sidecar live under `assets/src/`. | 9 | Repository documentation |
| Optimized runtime assets live under `public/assets/`. | 6 | Repository documentation |
| PDF export font licenses are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). | 8 | Repository documentation |
| MIT — see [LICENSE](LICENSE). | 4 | License reference |

### Terminology check

| Concept | Established term | Exception |
| --- | --- | --- |
| One business event and its records | packet | None |
| Supporting material | evidence | None |
| Requested-item set | checklist | Landing says “list” (F-7-6) |
| Exported evidence summary | manifest | Landing says “PDF index” (F-7-7) |
| Portable JSON copy | backup | “Back up all data” overstates scope (F-7-1) |
| Optional paid access | license | None |
| Settlement evidence | payment trail | None |

## Demo and sandbox behavior

- The one-click first-screen action opened `/?demo=1` with **Kite Studio ·
  August client review**, invoice `INV-2026-042`, 100% completion, four
  realistic attached files, two optional empty items, notes, and export tools.
- The persistent banner said **“Demo — sample data, nothing is saved to your
  packets”** and included **Reset demo** and **Start for real**.
- Eight timed reset repetitions restored the original packet in the form and
  in `demo:invoice-packet`.
- An independent live flow created **Review 7 real sentinel** in normal mode,
  entered and changed the demo, reset it, and selected **Start for real**. The
  real packet remained; the normal database contained one packet and the demo
  database contained zero.
- The live workflow request log contained only
  `https://invoice-evidence-pack.sociobot.in`. `verify:live` also reloaded the
  controlled demo offline with no failed or external requests.

The demo gate passes.

## Declared claims

I cloned the candidate into `/tmp/invoice-review7-clean-46VVra`, ran `npm ci`,
and ran every `test` string from `.factory/claims.json` separately and exactly
as listed.

| Claim | Declared command | Result |
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
| `backup-import` | `npm run test:e2e -- --project=chromium --grep @claim:backup-import` | Pass |
| `offline-reload` | `npm run test:e2e -- --project=chromium --grep @claim:offline-reload` | Pass |
| `aes-zip` | `npm run test:e2e -- --project=chromium --grep @claim:aes-zip` | Pass |
| `custom-templates` | `npm run test:e2e -- --project=chromium --grep @claim:custom-templates` | Pass |
| `license-restore` | `npm run test:e2e -- --project=chromium --grep @claim:license-restore` | Pass |
| `license-revocation` | `npm run test:e2e -- --project=chromium --grep @claim:license-revocation` | Pass |
| `offline-license-verdict` | `npm run test:e2e -- --project=chromium --grep @claim:offline-license-verdict` | Pass |
| `checkout-operator-gate` | `npm run test:e2e -- --project=chromium --grep @claim:checkout-operator-gate` | Pass |
| `configurable-checklists` | `npm run test:e2e -- --project=chromium --grep @claim:configurable-checklists` | Pass |
| `no-document-backend` | `npm run test:e2e -- --project=chromium --grep @claim:no-document-backend` | Pass |
| `no-account-required` | `npm run test:e2e -- --project=chromium --grep @claim:no-account-required` | Pass |
| `pwa-installable` | `npm run test:e2e -- --project=chromium --grep @claim:pwa-installable` | Pass |
| `free-exports` | `npm run test:e2e -- --project=chromium --grep @claim:free-exports` | Pass |
| `core-no-setup` | `npm run test:e2e -- --project=chromium --grep @claim:core-no-setup` | Pass |
| `license-verification-minimum-data` | `npm run test:e2e -- --project=chromium --grep @claim:license-verification-minimum-data` | Pass |

No listed claim test failed. F-7-1 through F-7-5 identify public behavior
statements whose stronger outcomes are not represented by a matching claim and
tagged test.

## Earlier-finding regression check

I read all six earlier reviews, all six polish reports, and the incoming
handoff. Each earlier finding was checked against both the live product and
current source.

| Earlier finding | Current confirmation | Status |
| --- | --- | --- |
| F-1-1 | Default build shows no checkout link; restore and operator-gate claims pass. | Fixed |
| F-1-2 | Privacy navigation and Back focus `#route-heading` and announce the route. | Fixed |
| F-1-3 | The live 404 has description, canonical, OG/Twitter data, favicon, and Apple icon. | Fixed |
| F-1-4 | The live 404 h1 is **Page not found**. | Fixed |
| F-1-5 | The hero caption explains invoice-and-evidence grouping. | Fixed |
| F-1-6 | The assurance heading says **Storage and export privacy**. | Fixed |
| F-1-7 | The fingerprint label names its manifest result. | Fixed |
| F-1-8 | The export label names ZIP, PDF, and JSON backup. | Fixed |
| F-1-9 | The released action is **Restore an existing license**. | Fixed |
| F-1-10 | README opens with short, packet-consistent sentences. | Fixed |
| F-1-11 | README avoids blob and IndexedDB jargon in user-facing storage copy. | Fixed |
| F-1-12 | README describes install-and-reopen-offline without the PWA acronym. | Fixed |
| F-1-13 | README names the free exports. | Fixed |
| F-1-14 | The former “jurisdiction-configurable” phrase is gone; F-7-3 is a new claims-coverage issue. | Fixed |
| F-1-15 | README test documentation remains split below 22 words. | Fixed |
| F-1-16 | README deployment documentation remains split below 22 words. | Fixed |
| F-1-17 | `core-no-setup` is declared and passed. | Fixed |
| F-1-18 | `license-verification-minimum-data` is declared and passed. | Fixed |
| F-1-19 | The public footer has no unlinked generation-provenance claim. | Fixed |
| F-2-1 | Legal h1 values are literal **Privacy** and **Terms**. | Fixed |
| F-2-2 | Workspace labels use Saved packets, Evidence files, Notes for the reviewer, and Export the packet. | Fixed |
| F-2-3 | `no-account-required` is declared and passed. | Fixed |
| F-2-4 | **payment trail** is consistently unhyphenated. | Fixed |
| F-3-1 | Query-demo → Privacy → Back focuses and announces each destination. | Fixed |
| F-4-1 | Header Demo → Back focuses and announces both destinations. | Fixed |
| F-4-2 | `manifest-fingerprints` declares and verifies the exported digest. | Fixed |
| F-4-3 | Every footer labels GitHub and its new-tab behavior. | Fixed |
| F-4-4 | The designed 404 uses the application footer link set. | Fixed |
| F-5-1 | Hero demo entry focuses **Your packets** and announces it. | Fixed |
| F-5-2 | `license-revocation` verifies paid tools lock and free exports remain. | Fixed |
| F-5-3 | `offline-license-verdict` verifies offline access and reconnection checking. | Fixed |
| F-5-4 | Merchant/refund-handler wording is absent from live Terms and source. | Fixed |
| F-6-1 | Assurance text is an h2 and labels its section. | Fixed |
| F-6-2 | The live status says **Online** or **Offline**, not “Local first.” | Fixed |
| F-6-3 | **Plate 01** is absent; the useful caption remains. | Fixed |

No earlier finding regressed.

## Structure, accessibility, and quality

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. An unknown route
  returned the designed 404 with HTTP 404 and a recovery link.
- Each checked route had one h1, one main, route-specific title, description,
  canonical, Open Graph/Twitter metadata, favicon, and Apple-touch icon.
- The title set is **Invoice Packet — build invoice evidence packets**,
  **Demo — Invoice Packet**, **Privacy — Invoice Packet**, **Terms — Invoice
  Packet**, and **Page not found — Invoice Packet**.
- Every link exposed on the checked pages was crawled. Public product routes and
  the disclosed GitHub destination returned 200; the intentional unknown route
  returned 404.
- Header and footer sets are consistent. Deep links, forward navigation, Back,
  route focus, and polite announcements passed locally and live.
- The botanical folio illustration, paper palette, serif/sans pairing, clipped
  labels, and specimen-sheet rhythm match `.factory/design.md` and are visibly
  distinct from a generic SaaS template.
- `/opt/fleet/lib/verify-url.sh` passed in 682 ms with no console error, one h1,
  one main, complete alt text, and labelled buttons. Playwright Axe reported no
  serious or critical issue at desktop/mobile sizes and in both themes.
- `npm test` passed 11/11; `npm run check` passed; `npm run build` produced
  `dist/`. The entry script is 16.68 kB gzip. Lazy export chunks are not loaded
  by the initial HTML.
- The first full Playwright run encountered a Chromium SwiftShader process
  crash before one test could create a context; 53 tests passed. A fresh browser
  process then completed with 54 passed and 20 intentional project skips.
- `npm run verify:deployment` passed response policy and local/live byte
  identity. `npm run verify:live` passed demo, offline, routes, licenses,
  no-account export, mobile Axe, request logging, and console checks.

## Missed leverage

No missing high-value feature is implied by the brief. Configurable evidence
collection, fingerprints, missing-item flags, import/export, redaction,
encryption, and offline use cover the job. A remote AI step would introduce
sensitive-document transfer without a necessary result, and sync would conflict
with the current local-only contract unless separately designed and disclosed.

## What would make this perfect

Make backup scope truthful, declare and test the password, editing, template
file-exclusion, and deletion promises, and standardize **checklist** and
**manifest**. Replace the vague README slug sentence. Then rerun all 25 claim
commands plus the cold, demo-isolation, copy, route, and live-request checks and
confirm zero findings.
