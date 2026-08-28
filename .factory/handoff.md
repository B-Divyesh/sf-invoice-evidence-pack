# Invoice Packet repair handoff

## Repair outcome

Repaired every release-blocking finding in `.factory/verification-2.md` for
candidate `8b9f079e22166b36b637ce56d2c5873ef4023e03` without changing the researched
scope, local-first data model, paid-unlock contract, or botanical field-guide
identity.

- **Immutable caching:** Vite now emits every compiled JS/CSS entry and lazy
  chunk beneath content-hashed `/_app/` URLs. Azure Static Web Apps serves that
  namespace with `Cache-Control: public, max-age=31536000, immutable`; HTML,
  `sw.js`, and the manifest use `no-cache` so updates are discovered promptly.
- **Response hardening:** the shipped `staticwebapp.config.json` supplies a
  self-only CSP (with only the billing verify origins and the local `blob:` ZIP
  worker allowed), denies ambient browser permissions and framing, and sets
  COOP, CORP, `nosniff`, referrer policy, and two-year preload-ready HSTS.
- **Manifest MIME:** `.webmanifest` is explicitly served as
  `application/manifest+json`.
- **Offline/update correctness:** the service-worker cache name is derived from
  built artifact contents, and deployment configuration is excluded from its
  precache. The only inline style was replaced by a semantic `<progress>` so
  the CSP needs neither `unsafe-inline` nor `unsafe-eval`; the product-specific
  progress animation and reduced-motion override remain.
- **Regression tooling:** unit tests lock the static policy, Playwright verifies
  actual preview response headers on desktop and mobile, and
  `npm run verify:deployment -- <origin>` checks live policy plus byte identity
  against `dist/`.

## Verification evidence

Run on 2026-08-28 UTC from a clean `npm ci` (134 packages, 0 vulnerabilities):

- `npm test`: 2 files, 8 tests passed, including 3 exact deployment-policy
  regressions.
- `npm run check`: passed (`tsc -b`). No separate lint tool is configured;
  TypeScript strict compilation is the repository's static check.
- `npm run build`: passed; `dist/index.html` is at the static root.
- `npm run test:e2e`: 11 passed, 1 intentional desktop duplicate skipped, using
  Playwright 1.58.2 with one worker. It covers desktop and 390×844 mobile,
  policy headers, manifest MIME, immutable assets, packet creation, local file
  hashing/persistence, ZIP export under CSP, light/dark axe checks, mobile
  overflow, legal pages, and an explicit offline reload.
- Independent browser scripts: required-field recovery, 100 MiB + 1 rejection,
  invalid-import recovery, keyboard focus retention with a 3px focus outline,
  reduced motion (`0.00001s`), IndexedDB persistence, and offline reload passed.
  No console/page errors or outbound requests occurred. Repeated desktop and
  mobile axe runs in both themes had 0 serious/critical findings.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; no browser errors; title and `lang`
  present; exactly one `h1`; one `main`; no missing image alt or unlabeled
  buttons.
- Service-worker update simulation: the “A fresh field kit is ready” notice
  appeared after a changed worker, and “Update now” activated it and reloaded.
- Azure Static Web Apps CLI 2.0.10 loaded the shipped configuration and served
  the exact expected cache, CSP, permissions, framing, COOP/CORP, HSTS, and MIME
  headers. `npm run verify:deployment -- http://127.0.0.1:4280` passed policy
  and byte-identity checks.
- Lighthouse 13.4.1 mobile: Performance **98**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1.6 s, LCP 1.9 s, TBT 110 ms, CLS 0.
- Initial app JS: 40,723 bytes / 14,076 gzip. CSS: 20,090 bytes / 5,279 gzip.
  PDF and ZIP chunks remain lazy-loaded.
- Final build SHA-256: `dist/index.html`
  `40a2ef4560d91f0c762789fc5228b544bca7a8767c3a78d387c648af3e0d12b3`;
  `dist/sw.js`
  `62b302ff7f87e7864ba783b903847971cbfe4b339f6c6a68ff7ca54171483f47`;
  manifest
  `c75d077c3848d30735c7ea868fb123eca5acd219d6f17d020677ae70ef784ead`.

Before rollout, the live origin still byte-matched the rejected candidate root
(`b55d236095809d4aec487877548c40b37b022a75d087d0eeb402038e60b626dc`)
and reproduced all three findings. The work-order runner deploys `dist/` after
the repair commit; after edge propagation, run:

```sh
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

## Run and deploy

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
```

Deploy `dist/` as the static root using the work order. Production billing
defaults to `https://api.sociobot.in/api/v1`; staging can set
`VITE_BILLING_BASE_URL=https://pilot-api.sociobot.in/api/v1`.

## Known limits

- The paid encrypted-export path still requires a real issued license for a
  production billing smoke test; free ZIP/PDF/backup exports are covered.
- Browser storage quotas vary. Each attachment remains capped at 100 MB and
  users are directed to keep exported backups.
- PDF uses the standard Latin font set; ZIP/JSON preserve full Unicode.
- Automated compatibility targets Chromium. Safari and Firefox installed-PWA
  and encrypted-ZIP checks remain advisable before a broad launch.
