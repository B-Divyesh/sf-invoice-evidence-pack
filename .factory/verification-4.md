# Independent verification 4 — FAIL

**Candidate:** `66a17f1fc03b27e1ac77ebe7227e981a11fb8387` (`docs: record repair deployment evidence`)  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Scope:** fresh detached clone, exact production build, local production test suite, and fresh live Chromium checks at desktop and 390×844.

## Verdict

**FAIL for release acceptance.** The deployed application is the exact tested candidate and the local-first evidence-packet workflow passes the exercised acceptance paths. However, the only server-side endpoint used by the product, the Sociobot license verification endpoint, has no observed rate limit. The work order explicitly requires a burst to begin returning `429` and include a `Retry-After` header. It did not.

## Reproducible repository gates

A clean clone was checked out detached at the candidate SHA before installation.

```sh
git clone --no-local --branch main https://github.com/B-Divyesh/sf-invoice-evidence-pack.git /tmp/invoice-evidence-verify
git -C /tmp/invoice-evidence-verify checkout --detach 66a17f1fc03b27e1ac77ebe7227e981a11fb8387
cd /tmp/invoice-evidence-verify
npm ci
npm audit --omit=dev
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

- `npm ci`: 134 packages installed. `npm audit --omit=dev`: 0 vulnerabilities.
- `npm test`: 2 files / 8 tests passed.
- `npm run check`: passed (`tsc -b`). There is no lint script or lint configuration in the repository.
- Exact production command `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: passed; 13 tests passed and one intentional desktop-only duplicate was skipped (`test-results/.last-run.json` reported `passed`).
- Initial app JS is 41,789 bytes (14,390 gzip), CSS 20,313 bytes (5,300 gzip): both are within the 200 KB / 50 KB static budgets. ZIP (146,596 B) and PDF (434,897 B) remain lazy chunks. The mobile hero WebP is 32,908 B; no web fonts ship.

## Live identity, policies, and performance

`npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in` passed against the fresh `dist/` output. It byte-matched the live root, initial hashed JS/CSS, service worker, manifest, privacy page, and terms page.

- root/privacy/terms SHA-256: `2fe76db6dcd9cbf5cf3a4998da24f54ec4ac5d2ca7b979f10249e5a16e775fff`
- service worker: `861c0a2b9b7856d033a7a15af57cdf9ac72c2b4a618acbd9a4a9d5a6225f3017`
- manifest: `c75d077c3848d30735c7ea868fb123eca5acd219d6f17d020677ae70ef784ead`

The live shell, manifest, and service worker use `no-cache`; initial hashed assets use `public, max-age=31536000, immutable`; an ETag conditional request returned `304`. Live responses supplied the strict self CSP, denied ambient permissions, `DENY` framing, HSTS (`max-age=63072000; includeSubDomains; preload`), COOP/CORP, `nosniff`, and strict-origin referrer policy.

Fresh mobile Lighthouse (13.4.1, headless Chromium) reported **100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**: FCP 1.1 s, LCP 1.1 s, TBT 0 ms, CLS 0, interactive 1.1 s.

## Product, PWA, accessibility, and privacy evidence

Fresh live Chromium profiles on desktop and 390×844 completed the brief's core job:

- Created a cross-border packet with invoice `INV-042`, client, India review context, reviewer note, and lowercase `usd` currency; the exported manifest normalized it to `USD`.
- Rejected whitespace-only packet and checklist names with a focused, `aria-invalid` field and explanatory text; recovery succeeded.
- Collected four required evidence files; completion reached 100%; files and reviewer note survived reload in IndexedDB. The transparent native file control gave its visible label a 3px focus outline. Measured compact controls were at least 44×44 px. No mobile horizontal overflow occurred.
- Accepted the exact 100 MiB per-file boundary, rejected 100 MiB + 1 byte with actionable copy, and retained the accepted attachment.
- A redacted ZIP contained `manifest.json`, `README.txt`, and `evidence/01-evidence.txt` through `04-evidence.txt`; its manifest preserved hashes, missing optional states, metadata, notes, the not-tax-advice notice, and `originalFilenameRedacted: true`. Its PDF manifest began `%PDF-1.7` (2,199 B desktop, 2,201 B mobile).
- Invalid JSON backup import surfaced an error and left the packet intact.
- Serious/critical axe scans were empty in empty, populated light, and repeated populated dark states. The document has `lang=en`, one `h1`, one `main`, semantic legal-route headings, and a keyboard-operable skip link. Browser console/page errors were empty. Reduced motion computed to `0.00001s`.
- Service-worker-controlled offline reload retained the populated packet and exposed the Offline status on both form factors. In a temporary local production-artifact update simulation, a changed `sw.js` produced the waiting-worker state and the visible “A fresh field kit is ready. Update now” notice with no browser errors. The manifest has standalone display, versioned start URL, and real 192/512 PNG icons including maskable purpose.
- During the normal workflow, browser requests stayed same-origin (apart from local `blob:` download URLs). Source/runtime review found no analytics, remote fonts/scripts, or document backend. The only deliberate cross-origin request is the documented Sociobot license-verification call after a user supplies a license; packet data stays local unless exported. `/privacy/` and `/terms/` are present and describe this model. No sign-in flow exists.

## Defect

### High — required license-verification API rate limit is absent

Endpoint tested:

```text
GET https://api.sociobot.in/api/v1/products/invoice-evidence-pack/verify?license=qa-burst-token-<n>
```

A single invalid token correctly returned `200` with `{"valid":false,"reason":"invalid","expires_at":null}` and `Cache-Control: no-store`. Two fresh rapid bursts then produced:

| Burst | Concurrency | Result |
| --- | ---: | --- |
| 40 requests | 10 | 40 × `200`; 0 × `429` |
| 100 requests | 25 | 100 × `200`; 0 × `429` |

No `Retry-After` header was observed. Therefore no threshold was observed at 100 requests, contrary to the explicit acceptance contract. This is a factory/Sociobot API defect rather than a repository code change, but it blocks acceptance of this product while it uses that server-side endpoint.

## Coverage limits

No real payment, issued production license, or sign-in account was created. The encrypted paid export was not accepted as production evidence without an issued entitlement. Safari/Firefox installed-PWA behavior was not exercised.
