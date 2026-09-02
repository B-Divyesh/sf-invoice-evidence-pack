# Invoice Packet

Create one invoice packet for a client review or filing. Add evidence files, check what is missing, and export a ZIP or PDF manifest.

Live product: <https://invoice-evidence-pack.sociobot.in>

Try the isolated sample workspace: <https://invoice-evidence-pack.sociobot.in/?demo=1>

## What it does

- Start from a cross-border filing, client review, or payment trail checklist.
- Store packets and files in this browser. It does not upload packet files or use analytics.
- Create a SHA-256 fingerprint for each evidence file and include it in the manifest.
- Export plain ZIP packets, PDF manifests, and JSON backups of packets and templates for free.
- Keep distinct ZIP entries when evidence files share a filename.
- Preserve Devanagari and Japanese packet metadata in PDF text.
- Redact original filenames in exports when requested.
- Import a JSON backup on another browser.
- Install the app and reopen it offline after your first visit.
- Restore an existing license for encrypted ZIPs and reusable checklist templates.

ZIP, PDF, and JSON backup exports work without a license.

“Complete” means every required item has an attachment. Choose and edit a checklist for your review. Invoice Packet does not give tax or legal advice, or submit filings.

## Run locally

Requirements: Node.js 20+ and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Create and export a packet without an API key or external service.

## Test and build

```sh
npm test
npm run build
npm run test:e2e
```

The production build command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at its root. End-to-end tests use Playwright 1.58.2 on desktop and 390px Chromium. They check persistence, downloads, accessibility, legal routes, and offline reload.

## Checkout configuration

New-license checkout is disabled by default. An operator enables it only after testing the registered hosted checkout.

```sh
VITE_CHECKOUT_ENABLED=true npm run build
```

Checkout identifies this product as `invoice-evidence-pack`. It does not contain a payment-provider key or product ID.

## Deployment

Deploy `dist/` as a static site. The build includes Privacy and Terms routes and a versioned offline cache. `staticwebapp.config.json` supplies the static hosting headers. The factory owns DNS and infrastructure.

After deployment, verify response policy and byte identity against the local build:

```sh
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

## Privacy and data recovery

Files stay on the device unless the user exports them. Back up packets and templates before clearing browser storage. Backups do not include your theme or license token. License verification sends the license token, not packet files or filenames. See the in-product Privacy and Terms pages for details.

## Design and provenance

The botanical field-guide visual system and artwork provenance are documented in [`.factory/design.md`](.factory/design.md). The source illustration and prompt sidecar live under `assets/src/`. Optimized runtime assets live under `public/assets/`. PDF export font licenses are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

## License

MIT — see [LICENSE](LICENSE).
