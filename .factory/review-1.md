# Invoice Packet first-read review 1 — FAIL

**Reviewed:** 2026-09-01 UTC  
**Live product:** <https://invoice-evidence-pack.sociobot.in>  
**Method:** fresh Chromium contexts at 390×844 and 1440×900; read-only source
and live-route checks; local production build and declared claim commands.

## Verdict

**FAIL.** The core packet workflow, sample workspace, local storage boundary,
and most release checks are working. The paid-checkout availability statement
is not proven by its required claim test, navigation leaves keyboard focus on
the document body, the 404 omits required route metadata, and the copy audit
has the findings below. A PASS requires zero findings.

## Cold first screen

Before scrolling, both viewports communicated all three required answers.

| Check | What the page communicated |
| --- | --- |
| What it does | “Build a complete invoice evidence packet.” |
| Who it is for | “For cross-border freelancers and small firms preparing files for an accountant, client, or filing review.” |
| First action | **Try it with sample data**; its adjacent note says the sample uses a separate workspace. |

The primary action was visible and usable at 390px. This first-read check
passes. The landing visual system is distinct: its archival-paper palette,
serif display type, specimen labels, and original botanical folio art follow
the documented field-guide direction rather than a generic software template.

## Findings

### F-1-1 — BLOCKING — the hosted-checkout availability claim is not proven

- **Location / exact text:** `.factory/claims.json`, `one-time-checkout`:
  “A $19 one-time hosted checkout is available for encrypted ZIPs and reusable
  custom templates.” The license dialog says “Buy the one-time license.”
- **Check:** the listed test passed, but it only confirms that the button has
  the literal `https://api.sociobot.in/api/v1/products/invoice-evidence-pack/checkout`
  URL. It does not confirm that this URL supplies a checkout. Earlier review
  5 recorded this exact route returning 404, so an attribute-only check does
  not establish that the earlier finding is fixed.
- **Why this matters to a first-time visitor:** a person selecting the paid
  option can reasonably expect to obtain it. The current evidence only proves
  the displayed destination, not the stated result.
- **Concrete fix:** add an observable checkout-availability contract owned by
  the billing integration (for example, a sandbox response that confirms a
  hosted checkout session) and tag it `@claim:one-time-checkout`; or narrow
  the product statement to a fact that the sandbox can prove. Re-check the
  actual registered route through the permitted product-integration test
  environment before restoring the availability wording.

### F-1-2 — HIGH — route changes do not put focus on the new page heading

- **Location / exact result:** from `/`, selecting header **Privacy** loaded
  `/privacy/` with title `Privacy — Invoice Packet` and h1 “Private by
  construction.” `document.activeElement` was `<body>`; the polite live region
  was empty. Browser Back likewise left focus on `<body>`.
- **Why this matters to a first-time visitor:** a keyboard or screen-reader
  visitor receives no clear indication that a different page opened.
- **Concrete fix:** on every route render, give the new h1 `tabindex="-1"`,
  focus it, and update a polite route-announcement region. Add a browser test
  for header navigation and Back that asserts heading focus and announcement.

### F-1-3 — MEDIUM — the designed 404 route lacks route metadata

- **Location / exact result:** `/not-a-route` correctly returns the designed
  404 page and title `Page not found — Invoice Packet`, but
  `public/404.html` has no meta description, canonical URL, Open Graph title,
  Open Graph description, Open Graph image, Twitter card metadata, or
  `apple-touch-icon`.
- **Why this matters to a first-time visitor:** a shared or indexed invalid
  URL has incomplete page identification and preview information.
- **Concrete fix:** add the standard product metadata to `404.html`, using the
  route title pattern and the local social card; add a static-route metadata
  check for the 404 response.

### F-1-4 — MINOR — the 404 headline is a metaphor rather than the page name

- **Location / exact text:** 404 h1: “This page is not in the packet.”
- **Why this matters to a first-time visitor:** it does not name the page
  state as directly as “Page not found.”
- **Concrete fix:** change the h1 to **Page not found** and retain “Return to
  your packets” as the recovery action.

### F-1-5 — MINOR — the landing caption is a slogan, not an explanation

- **Location / exact text:** hero figcaption: “One invoice, every supporting
  trace.”
- **Why this matters to a first-time visitor:** “trace” is undefined and the
  caption does not say what the product groups or produces.
- **Concrete fix:** replace it with **One packet groups an invoice with its
  supporting evidence.**

### F-1-6 — MINOR — the assurance section heading does not name its content

- **Location / exact text:** “Your papers stay yours”.
- **Why this matters to a first-time visitor:** it is a mood statement rather
  than a heading for storage and export information.
- **Concrete fix:** change it to **Storage and export privacy**.

### F-1-7 — MINOR — the assurance label “Verifiable” is not specific

- **Location / exact text:** assurance label: “Verifiable”.
- **Why this matters to a first-time visitor:** the label alone does not say
  what can be checked.
- **Concrete fix:** change it to **File fingerprints in each manifest**.

### F-1-8 — MINOR — the assurance label “Portable” is not specific

- **Location / exact text:** assurance label: “Portable”.
- **Why this matters to a first-time visitor:** the label does not identify
  the available transfer format or action.
- **Concrete fix:** change it to **Download ZIP, PDF, or JSON backup**.

### F-1-9 — MINOR — the paid-tools button is not a result-naming verb

- **Location / exact text:** “Encrypted exports · $19 once”.
- **Why this matters to a first-time visitor:** it combines a feature and
  price but does not say that selecting it opens the license options.
- **Concrete fix:** change it to **View encrypted-export options** and place
  “$19, one time” in adjacent static text.

### F-1-10 — MINOR — the README opening is too long and changes the product term

- **Location / exact text:** “It gathers the invoice, proof of work, payment
  records, and reviewer notes around one business event, fingerprints every
  attached file, flags missing requirements, and exports a review-ready ZIP
  or PDF manifest.” (30 words)
- **Why this matters to a first-time visitor:** it combines five actions in
  one sentence, uses the unhelpful adjective “review-ready,” and the preceding
  sentence calls the product an “evidence pack builder” while the product UI
  consistently calls the result a packet.
- **Concrete fix:** use two sentences: **Create one invoice packet for a
  client review or filing. Add evidence files, check what is missing, and
  export a ZIP or PDF manifest.**

### F-1-11 — MINOR — README storage language uses implementation jargon

- **Location / exact text:** “Stores packets and file blobs in browser
  IndexedDB; there is no document backend or analytics.”
- **Why this matters to a first-time visitor:** “blobs,” “IndexedDB,” and
  “backend” describe implementation rather than the storage outcome.
- **Concrete fix:** replace it with **Stores packets and files in this
  browser. It does not upload packet files or use analytics.**

### F-1-12 — MINOR — README uses unexplained product acronyms

- **Location / exact text:** “Installs as a standalone PWA and reloads after
  the first successful visit without a network connection.”
- **Why this matters to a first-time visitor:** “PWA” is not needed to decide
  whether the app can be installed and used offline.
- **Concrete fix:** replace it with **Install the app and reopen it offline
  after your first visit.**

### F-1-13 — MINOR — README billing language is vague

- **Location / exact text:** “The free workflow never waits for billing.”
- **Why this matters to a first-time visitor:** it does not name what remains
  free or what “waits” means.
- **Concrete fix:** replace it with **ZIP, PDF, and JSON backup exports work
  without a license.**

### F-1-14 — MINOR — README uses an abstract configuration label

- **Location / exact text:** “The product is jurisdiction-configurable and
  does not provide tax or legal advice or submit filings.”
- **Why this matters to a first-time visitor:** “jurisdiction-configurable”
  does not identify the action they can take.
- **Concrete fix:** replace it with **Choose and edit a checklist for your
  review. Invoice Packet does not give tax or legal advice, or submit filings.**

### F-1-15 — MINOR — README test documentation exceeds the sentence limit

- **Location / exact text:** “End-to-end tests use Playwright 1.58.2 and
  cover desktop Chromium, a 390px mobile Chromium viewport, local
  persistence, ZIP download, serious/critical axe checks in both themes,
  legal routes, and a service-worker-backed offline reload.” (31 words)
- **Why this matters to a first-time visitor:** maintainers cannot quickly
  identify the test command’s essential scope.
- **Concrete fix:** use two sentences: **End-to-end tests use Playwright
  1.58.2 on desktop and 390px Chromium. They check persistence, downloads,
  accessibility, legal routes, and offline reload.**

### F-1-16 — MINOR — README deployment documentation exceeds the sentence limit

- **Location / exact text:** “The build emits directory fallbacks for
  `/privacy/` and `/terms/`, a generated content-versioned service-worker
  precache, and `staticwebapp.config.json` with the required cache, MIME,
  CSP, permissions, framing, and cross-origin policies.” (25 words)
- **Why this matters to a first-time visitor:** it lists several deployment
  concepts without a clear next step.
- **Concrete fix:** use two sentences: **The build includes routes for
  Privacy and Terms and a versioned offline cache. `staticwebapp.config.json`
  supplies the static hosting headers.**

### F-1-17 — MINOR — a README local-run claim has no declared claim test

- **Location / exact text:** “No API key or external service is needed for
  the core product.”
- **Why this matters to a first-time visitor:** this is a setup promise, but
  no entry in `.factory/claims.json` proves it from a fresh local run.
- **Concrete fix:** add a tagged clean-start test that creates, saves, and
  exports a packet with no configured key and no non-product request; or
  remove the sentence.

### F-1-18 — MINOR — a README privacy statement has no declared claim test

- **Location / exact text:** “License verification sends only the license
  token to Sociobot.”
- **Why this matters to a first-time visitor:** this is a specific data-flow
  statement, while the current privacy tests cover packet-workflow traffic and
  do not inspect this request’s contents.
- **Concrete fix:** add a recorded-request test with a test token that asserts
  the request contains no packet content or filename; or remove the sentence.

### F-1-19 — MINOR — artwork provenance is stated as an unverified public claim

- **Location / exact text:** footer: “Botanical artwork generated for this
  product with the factory image model.”
- **Why this matters to a first-time visitor:** this is a provenance statement
  that has no claim entry or observable verification artifact linked from the
  page.
- **Concrete fix:** link to the documented provenance in the source repository
  or remove the footer statement. If it remains a public product claim, add a
  verifiable provenance record to the release checks.

## Copy audit

Word counts use space-delimited words; hyphenated terms count as one word.
The table includes every prose sentence on the empty landing page and README.
Buttons, headings, labels, and fact fragments are listed separately because
they are also subject to the plain-language review.

### Landing prose sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Build a complete invoice evidence packet. | 6 | Pass |
| For cross-border freelancers and small firms preparing files for an accountant, client, or filing review. | 15 | Pass |
| The sample opens a separate workspace. | 6 | Pass |
| Your own packet starts with a checklist. | 7 | Pass |
| One invoice, every supporting trace. | 5 | F-1-5 |
| Prepare one packet in three steps. | 6 | Pass |
| Start with a filing, client review, or payment trail list. | 10 | Pass |
| Change it to match the request. | 6 | Pass |
| Each file stays in this browser and receives a SHA-256 fingerprint. | 10 | Pass |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | Pass |
| No document cloud and no account. | 6 | Pass — covered by `no-document-backend` |
| SHA-256 fingerprints travel with the manifest. | 6 | Pass — covered by `sha256-hash` |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | Pass — covered by `free-exports` and `json-backup` |
| Build a checked evidence packet without uploading your files. | 9 | Pass — covered by `local-only` |
| Built by Param Factory · v1.1.0 · Botanical artwork generated for this product with the factory image model. | 15 | F-1-19 |

### Landing headings, facts, and actions

| Copy | Type | Result |
| --- | --- | --- |
| Private invoice evidence packets | eyebrow | Pass |
| Try it with sample data | primary action | Pass |
| Start your first packet | action | Pass |
| Stored only in this browser | fact | Pass — `local-only` |
| Works offline after the first visit | fact | Pass — `offline-reload` |
| Free ZIP, PDF, and JSON exports | fact | Pass — `free-exports` |
| Import backup from another device | action | Pass |
| How it works | section heading | Pass |
| Choose a checklist | step heading | Pass |
| Add the evidence | step heading | Pass |
| Export the packet | step heading | Pass |
| Your papers stay yours | section heading | F-1-6 |
| Stored locally | assurance label | Pass |
| Verifiable | assurance label | F-1-7 |
| Portable | assurance label | F-1-8 |
| Encrypted exports · $19 once | action | F-1-9 |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Invoice Packet is a private, offline-first evidence pack builder for cross-border freelancers and tiny firms. | 15 | F-1-10: terminology differs from “packet”; “offline-first” is jargon |
| It gathers the invoice, proof of work, payment records, and reviewer notes around one business event, fingerprints every attached file, flags missing requirements, and exports a review-ready ZIP or PDF manifest. | 30 | F-1-10 |
| Starts from configurable cross-border filing, client review, or payment-trail checklists. | 10 | Pass — `configurable-checklists` |
| Stores packets and file blobs in browser IndexedDB; there is no document backend or analytics. | 15 | F-1-11 |
| Computes SHA-256 fingerprints locally and includes them in an explicit evidence manifest. | 11 | Pass — `sha256-hash` |
| Exports plain ZIP packets, PDF manifests, and complete JSON backups for free. | 10 | Pass — `free-exports`, `json-backup` |
| Keeps distinct ZIP entries when source files share a filename. | 9 | Pass — `duplicate-zip` |
| Preserves Devanagari and Japanese packet metadata in PDF text. | 9 | Pass — `unicode-pdf` |
| Redacts original filenames when requested. | 5 | Pass — `filename-redaction` |
| Imports complete JSON backups onto another browser. | 7 | Pass — `backup-import` |
| Installs as a standalone PWA and reloads after the first successful visit without a network connection. | 15 | F-1-12 |
| Restores existing licenses for AES-256 encrypted ZIPs and reusable custom templates. | 11 | Pass — `aes-zip`, `custom-templates` |
| The $19 one-time checkout unlocks AES-256 encrypted ZIPs and reusable custom templates. | 12 | F-1-1 |
| The free workflow never waits for billing. | 7 | F-1-13 |
| “Complete” means only that all items marked required have an attachment. | 11 | Pass |
| The product is jurisdiction-configurable and does not provide tax or legal advice or submit filings. | 15 | F-1-14 |
| Requirements: Node.js 20+ and npm. | 5 | Pass |
| Vite prints the local URL. | 5 | Pass |
| No API key or external service is needed for the core product. | 11 | F-1-17 |
| The exact production build command is `npm run build`. | 9 | Pass |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Pass |
| End-to-end tests use Playwright 1.58.2 and cover desktop Chromium, a 390px mobile Chromium viewport, local persistence, ZIP download, serious/critical axe checks in both themes, legal routes, and a service-worker-backed offline reload. | 31 | F-1-15 |
| To point a staging build at the staging billing engine: | 10 | Pass |
| Production defaults to `https://api.sociobot.in/api/v1`. | 4 | Pass — deployment reference |
| The product slug is used by the billing contract; no provider product ID or secret is embedded. | 15 | Pass — deployment reference |
| Deploy `dist/` as a static site. | 6 | Pass |
| The build emits directory fallbacks for `/privacy/` and `/terms/`, a generated content-versioned service-worker precache, and `staticwebapp.config.json` with the required cache, MIME, CSP, permissions, framing, and cross-origin policies. | 27 | F-1-16 |
| The factory owns DNS and infrastructure. | 6 | Pass |
| After deployment, verify both response policy and byte identity against the local build. | 12 | Pass |
| Files never leave the device unless the user deliberately exports them. | 10 | Pass — `local-only` |
| Browser/site-data clearing can remove IndexedDB, so the UI offers “Back up all data” as a portable JSON file. | 17 | Pass |
| License verification sends only the license token to Sociobot. | 9 | F-1-18 |
| See the in-product privacy and terms pages for the full plain-language policy. | 11 | Pass |
| The botanical field-guide visual system and generated-art provenance are documented in `.factory/design.md`. | 12 | Pass — repository documentation |
| The source illustration and prompt sidecar live under `assets/src/`; optimized runtime assets live under `public/assets/`. | 15 | Pass — repository documentation |
| PDF export font licenses are recorded in `THIRD_PARTY_NOTICES.md`. | 8 | Pass — repository documentation |
| MIT — see `LICENSE`. | 3 | Pass |

Terminology to standardize: use **packet** rather than “evidence pack”; use
**small firms** rather than alternating with “tiny firms”; use **payment trail**
rather than alternating hyphenation. Keep **evidence**, **checklist**,
**manifest**, and **backup** as the current consistent terms.

## Demo, privacy, claims, and product behavior

- The one-click action opened `/demo/` directly to the populated **Kite Studio
  · August client review** packet. The visible persistent banner said
  “Demo — sample data, nothing is saved to your packets,” with **Reset demo**
  and **Start for real**.
- Reset kept the banner and restored the sample. A same-context isolation
  check created a normal packet, opened demo, reset it, then returned to normal;
  the normal packet remained after a direct repeat check. The code selects the
  separate `demo:invoice-packet` IndexedDB database for `/demo/`; normal mode
  selects `invoice-packet`.
- Request logging for the normal-to-demo flow recorded only
  `https://invoice-evidence-pack.sociobot.in`. No packet or demo request went
  to another origin. The offline claim’s clean-context test passed.
- All 18 commands listed in `.factory/claims.json` passed exactly as written:
  `demo-sandbox`, `local-only`, `sha256-hash`, `file-size-limit`,
  `missing-flags`, `filename-redaction`, `duplicate-zip`, `unicode-pdf`,
  `json-backup`, `backup-import`, `offline-reload`, `aes-zip`,
  `custom-templates`, `one-time-checkout`, `configurable-checklists`,
  `no-document-backend`, `pwa-installable`, and `free-exports`.
- F-1-1 remains because the passing `one-time-checkout` command checks the
  advertised route string, not the stated checkout availability.

## History re-check

Every earlier verification and handoff file was read. The following current
checks confirm the earlier findings shown as resolved; F-1-1 records the
remaining checkout-evidence gap.

| Earlier finding | Current check | Status |
| --- | --- | --- |
| Verification 2 cache policy | live hashed CSS/JS returned `public, max-age=31536000, immutable`; HTML returned `no-cache` | Confirmed fixed |
| Verification 2 response policy and manifest MIME | live root returned the configured CSP, framing policy, and `application/manifest+json` | Confirmed fixed |
| Verification 3 visible file-control focus | browser regression passed and source checks the visible label outline | Confirmed fixed |
| Verification 3 blank names and target sizes | full E2E matrix passed its whitespace and touch-size checks | Confirmed fixed |
| Verification 4 license route rate limit | not directly rechecked: the affected billing resource is outside this review’s permitted connection scope | No current conclusion; F-1-1 requires an in-scope availability contract |
| Verification 5 duplicate names, backup import, and Unicode PDF | their tagged claim tests passed | Confirmed fixed |
| Verification 5 checkout route | listed test checks only the URL; see F-1-1 | Not sufficiently confirmed |
| Verification 6 full E2E stability, offline cache size, and touch controls | `npm run test:e2e` passed; PWA and touch tests passed | Confirmed fixed |
| Verification 6 missing claim entries | the current 18-entry manifest covers the earlier listed product claims | Confirmed fixed; newly found wording gaps are F-1-17 and F-1-18 |
| Verification 7 malformed backup message and MiB label | source catches parser errors with the specified recovery text; UI says `100 MiB`; relevant E2E/unit tests passed | Confirmed fixed |

## Structure and quality checks

- Root, `/demo/`, `/privacy/`, `/terms/`, manifest, sitemap, and robots each
  returned 200. An unknown route returned the designed 404 with HTTP 404.
- The root has `lang="en"`, one h1, a main landmark, title
  `Invoice Packet — build invoice evidence packets`, description, canonical,
  social card, favicon, and Apple touch icon. Legal route titles update to the
  required pattern. F-1-2 through F-1-4 cover the remaining route defects.
- Same-origin header/footer links were checked and returned 200. The footer’s
  external source link was inspected in source only; it was not requested
  because the review connection scope excludes external resources.
- `npm test` passed (11 tests), `npm run check` passed, `npm run build` passed
  and produced `dist/`, and `npm run test:e2e` passed (40 project executions,
  including intentional project skips). The initial app JavaScript is under
  the static-product budget (about 47 kB, 16 kB gzip).
- The full E2E suite’s Axe integration passed; the live cold contexts at 390px
  and desktop had no console errors. The 390px screenshot showed no horizontal
  overflow and retained visible actions above the fold.

## Missed leverage

No additional AI feature is expected for this brief. The core value is local
collection, checking, and export; the existing import, backup, and export
paths cover the obvious portable-workflow needs. An AI step would add data
handling without improving the stated job enough to justify it.

## What would make this perfect

Prove the paid checkout’s stated availability in an approved integration
environment, move focus and announce every route change, complete 404
metadata, and apply the listed plain-language rewrites. Then rerun this whole
review from a clean browser context and confirm zero remaining findings.
