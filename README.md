# Invoice Packet

Invoice Packet is a private, offline-first evidence pack builder for cross-border freelancers and tiny firms. It gathers the invoice, proof of work, payment records, and reviewer notes around one business event, fingerprints every attached file, flags missing requirements, and exports a review-ready ZIP or PDF manifest.

Live product: <https://invoice-evidence-pack.sociobot.in>

Try the isolated sample workspace: <https://invoice-evidence-pack.sociobot.in/demo/>

## What it does

- Starts from configurable cross-border filing, client review, or payment-trail checklists.
- Stores packets and file blobs in browser IndexedDB; there is no document backend or analytics.
- Computes SHA-256 fingerprints locally and includes them in an explicit evidence manifest.
- Exports plain ZIP packets, PDF manifests, and complete JSON backups for free.
- Keeps distinct ZIP entries when source files share a filename.
- Preserves Devanagari and Japanese packet metadata in PDF text.
- Redacts original filenames when requested.
- Imports complete JSON backups onto another browser.
- Installs as a PWA and reloads with the full workflow offline after the first successful visit.
- Restores existing licenses for AES-256 encrypted ZIPs and reusable custom templates.

New checkout is environment-gated while the shared product registration is unavailable. Set `VITE_BILLING_ENABLED=true` only after the product checkout returns a hosted purchase page. The free workflow never waits for billing.

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

To enable checkout against the staging billing engine after product registration:

```sh
VITE_BILLING_ENABLED=true VITE_BILLING_BASE_URL=https://pilot-api.sociobot.in/api/v1 npm run build
```

Production defaults to `https://api.sociobot.in/api/v1`. Checkout stays hidden unless `VITE_BILLING_ENABLED=true`. The product slug is used by the billing contract; no provider product ID or secret is embedded.

## Deployment

Deploy `dist/` as a static site. The build emits directory fallbacks for `/privacy/` and `/terms/`, a generated content-versioned service-worker precache, and `staticwebapp.config.json` with the required cache, MIME, CSP, permissions, framing, and cross-origin policies. The factory owns DNS and infrastructure.

After deployment, verify both response policy and byte identity against the local build:

```sh
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

## Privacy and data recovery

Files never leave the device unless the user deliberately exports them. Browser/site-data clearing can remove IndexedDB, so the UI offers “Back up all data” as a portable JSON file. License verification sends only the license token to Sociobot. See the in-product privacy and terms pages for the full plain-language policy.

## Design and provenance

The botanical field-guide visual system and generated-art provenance are documented in [`.factory/design.md`](.factory/design.md). The source illustration and prompt sidecar live under `assets/src/`; optimized runtime assets live under `public/assets/`. PDF export font licenses are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

## License

MIT — see [LICENSE](LICENSE).
