# Copy audit

Audited 2 September 2026 after polish round 5. Counts use space-delimited words; hyphenated terms
count as one word. Every sentence below is 22 words or fewer and contains none
of the banned plain-language terms.

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Build a complete invoice evidence packet. | 6 | Pass |
| For cross-border freelancers and small firms preparing files for an accountant, client, or filing review. | 15 | Pass |
| The sample opens a separate workspace. | 6 | Pass |
| Your own packet starts with a checklist. | 7 | Pass |
| One packet groups an invoice with its supporting evidence. | 9 | Pass |
| Prepare one packet in three steps. | 6 | Pass |
| Start with a filing, client review, or payment trail list. | 10 | Pass |
| Change it to match the request. | 6 | Pass |
| Each file stays in this browser and receives a SHA-256 fingerprint. | 10 | Pass |
| Download the evidence and manifest as ZIP, or make a PDF index. | 12 | Pass |
| No document cloud and no account. | 6 | Pass — `no-document-backend`, `no-account-required` |
| SHA-256 fingerprints travel with the manifest. | 6 | Pass — `manifest-fingerprints` |
| Plain ZIP, PDF, and full JSON backup are free. | 9 | Pass |
| Build a checked evidence packet without uploading your files. | 9 | Pass |

Headings, labels, and actions: **Private invoice evidence packets**, **Try it
with sample data**, **Start your first packet**, **Storage and export privacy**,
**File fingerprints in each manifest** (`manifest-fingerprints`), **Download ZIP, PDF, or JSON backup**,
and **Restore an existing license**. Each names the task or result directly.

Workspace headings and labels: **Saved packets**, **New packet**, **Packet
details**, **Collect evidence**, **Evidence files**, **Notes for the reviewer**,
and **Export the packet**. Each uses the same packet, checklist, evidence,
notes, and export terms as the landing page.

## README

| Sentence | Words | Result |
| --- | ---: | --- |
| Create one invoice packet for a client review or filing. | 11 | Pass |
| Add evidence files, check what is missing, and export a ZIP or PDF manifest. | 14 | Pass |
| Store packets and files in this browser. | 8 | Pass |
| It does not upload packet files or use analytics. | 10 | Pass |
| Create a SHA-256 fingerprint for each evidence file and include it in the manifest. | 14 | Pass — `manifest-fingerprints` |
| Install the app and reopen it offline after your first visit. | 11 | Pass |
| Restore an existing license for encrypted ZIPs and reusable checklist templates. | 10 | Pass |
| ZIP, PDF, and JSON backup exports work without a license. | 10 | Pass |
| Choose and edit a checklist for your review. | 9 | Pass |
| Invoice Packet does not give tax or legal advice, or submit filings. | 13 | Pass |
| Create and export a packet without an API key or external service. | 12 | Pass |
| End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. | 10 | Pass |
| They check persistence, downloads, accessibility, legal routes, and offline reload. | 9 | Pass |
| New-license checkout is disabled by default. | 6 | Pass |
| An operator enables it only after testing the registered hosted checkout. | 11 | Pass |
| The build includes Privacy and Terms routes and a versioned offline cache. | 12 | Pass |
| `staticwebapp.config.json` supplies the static hosting headers. | 5 | Pass |
| License verification sends the license token, not packet files or filenames. | 11 | Pass |

## Terminology

| Concept | One term used |
| --- | --- |
| One business event and its records | packet |
| A supporting file | evidence |
| The requested-item list | checklist |
| The exported evidence index | manifest |
| The complete portable JSON file | backup |
| Optional paid access | license |
| Settlement evidence | payment trail |

## Legal pages

The route h1 headings are the literal page names **Privacy** and **Terms**.
Their explanatory text follows below each heading.

### Terms sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Invoice Packet helps organize evidence. | 5 | Pass |
| It does not provide legal, tax, accounting, foreign-exchange, or filing advice, and it does not submit anything to an authority. | 20 | Pass — product limit |
| You decide which checklist applies, verify packet contents, keep backups, use suitable passwords, and obtain professional advice for your jurisdiction. | 20 | Pass |
| A “complete” label means only that every item you marked required has a file. | 14 | Pass — `missing-flags` |
| An existing license enables reusable custom templates and encrypted ZIP exports. | 11 | Pass — `custom-templates`, `aes-zip` |
| Core packet building, hashing, JSON backup, plain ZIP, and PDF manifests remain free. | 13 | Pass — `core-no-setup`, `sha256-hash`, `json-backup`, `free-exports` |
| If license verification returns “revoked,” paid tools become unavailable. | 9 | Pass — `license-revocation` |
| Free exports remain available. | 4 | Pass — `license-revocation`, `free-exports` |
| The software is provided “as is,” without warranties. | 8 | Pass |
| Browser storage can be cleared by device policy or user action, so keep independent backups. | 15 | Pass |
| A saved valid license keeps paid tools available while offline. | 10 | Pass — `offline-license-verdict` |
| Invoice Packet checks it when your connection returns. | 8 | Pass — `offline-license-verdict` |
| Do not use the service or billing endpoint unlawfully, attempt to defeat license checks, or package malicious files for others. | 20 | Pass |

The earlier merchant, payment-handler, refund, and charge-reversal statements
were removed because the default build has no checkout and cannot prove those
external policies. The license dialog now states only the tested revoked-license
behavior.
