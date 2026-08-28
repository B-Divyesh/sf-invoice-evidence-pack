# Invoice Packet

Invoice Packet is a private, offline-first evidence pack builder for cross-border freelancers and tiny firms. It gathers the invoice, proof of work, payment records, and reviewer notes around one business event, fingerprints every attached file, flags missing requirements, and exports a review-ready ZIP or PDF manifest.

Live product: <https://invoice-evidence-pack.sociobot.in>

## What it does

- Starts from configurable cross-border filing, client review, or payment-trail checklists.
- Stores packets and file blobs in browser IndexedDB; there is no document backend or analytics.
- Computes SHA-256 fingerprints locally and includes them in an explicit evidence manifest.
- Exports plain ZIP packets, PDF manifests, and complete JSON backups for free.
- Redacts original filenames when requested.
- Imports complete JSON backups onto another browser.
- Installs as a PWA and reloads with the full workflow offline after the first successful visit.
- Offers a $19 one-time license for AES-256 encrypted ZIPs and reusable custom templates through the Sociobot billing API.

“Complete” means only that all items marked required have an attachment. The product is jurisdiction-configurable and does not provide tax or legal advice or submit filings.

## Run locally

Requirements: Node.js 20+ and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. No API key or external service is needed for the core product.

## Test and build

```sh
npm test
npm run build
npm run test:e2e
```

The exact production build command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at its root. End-to-end tests use Playwright 1.58.2 and cover desktop Chromium, a 390px mobile Chromium viewport, local persistence, ZIP download, serious/critical axe checks in both themes, legal routes, and a service-worker-backed offline reload.

To run against the staging billing engine during factory testing:

```sh
VITE_BILLING_BASE_URL=https://pilot-api.sociobot.in/api/v1 npm run build
```

Production defaults to `https://api.sociobot.in/api/v1`. The product slug is used by the billing contract; no provider product ID or secret is embedded.

## Deployment

Deploy `dist/` as a static site. The build emits directory fallbacks for `/privacy/` and `/terms/`, plus a generated, versioned service worker precache. The factory owns DNS and infrastructure.

## Privacy and data recovery

Files never leave the device unless the user deliberately exports them. Browser/site-data clearing can remove IndexedDB, so the UI offers “Back up all data” as a portable JSON file. License verification sends only the license token to Sociobot. See the in-product privacy and terms pages for the full plain-language policy.

## Design and provenance

The botanical field-guide visual system and generated-art provenance are documented in [`.factory/design.md`](.factory/design.md). The source illustration and prompt sidecar live under `assets/src/`; optimized runtime assets live under `public/assets/`.

## License

MIT — see [LICENSE](LICENSE).
