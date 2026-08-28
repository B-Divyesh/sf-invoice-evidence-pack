# Independent verification 2 — FAIL

**Candidate:** `8b9f079e22166b36b637ce56d2c5873ef4023e03` (`docs: record final smoke verification`)  
**Live URL:** <https://invoice-evidence-pack.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Scope:** clean detached checkout, exact production build, local and deployed Chromium checks.

## Verdict

**FAIL for release acceptance.** The application itself works for the brief's
smallest useful job, but the live deployment fails the required static/PWA
caching policy and lacks basic browser response-policy hardening. The live
artifact does otherwise match the candidate exactly.

## Reproduction and build gates

Clean checkout was created with:

```sh
git worktree add --detach /tmp/invoice-evidence-pack-qa 8b9f079e22166b36b637ce56d2c5873ef4023e03
cd /tmp/invoice-evidence-pack-qa
npm ci
npm test
npm run check
npm run build
npx playwright test --workers=1
npm audit --omit=dev
```

- `npm ci`: installed 134 packages; audit reported 0 vulnerabilities.
- `npm test`: 1 file / 5 tests passed.
- `npm run check`: passed. There is no lint script in `package.json`.
- `npm run build`: passed and produced `dist/`.
- Full Playwright suite: 9 passed, 1 expected desktop-project skip (the 390px
  test is intentionally mobile-only); final `test-results/.last-run.json` was
  `passed` with no failed tests.
- `npm audit --omit=dev`: 0 vulnerabilities.

## Product and browser evidence

On both the local production preview and the live URL, a fresh Chromium
profile completed the representative workflow:

- created a packet with invoice, client, jurisdiction, currency, and notes;
  attached an evidence file; confirmed local SHA-256 fingerprinting and
  IndexedDB persistence after reload;
- rejected an empty packet name and empty checklist-item label with native
  invalid states, recovered successfully, rejected a 100 MiB + 1 byte file,
  and retained the working packet after an invalid backup import;
- confirmed missing required evidence prompts before export;
- exported a redacted ZIP. It contained `evidence/01-evidence.txt`, with
  manifest `originalFilenameRedacted: true` and the SHA-256. The PDF export
  downloaded successfully and began `%PDF-` (1,791 bytes);
- verified desktop and 390px mobile with no horizontal overflow before or
  after packet creation; keyboard focus remained on the control after the
  notes autosave and exposed a `3px solid` focus outline; reduced motion made
  transitions `0.00001s`;
- ran axe in both light and dark themes on desktop and mobile: no serious or
  critical findings. The document had one `h1`, one `main`, `lang=en`, and no
  console/page errors;
- recorded no outbound browser requests during the core flow. Source review
  found no analytics or document backend; the only programmatic third-party
  request is the deliberate license-token verification endpoint. IndexedDB
  was the sole packet-data store.

PWA checks passed: manifest has 192/512 maskable icons and standalone display;
service-worker-controlled offline reload passed locally and live. A simulated
changed `sw.js` in the local production artifact produced the “A fresh field
kit is ready” update notice, and “Update now” activated it through
`SKIP_WAITING`. The test changed only a temporary built artifact and restored
it; no product source was changed.

Lighthouse 13.4.1, mobile simulated profile against the local production
preview (repeat run with Playwright Chromium): Performance **95**,
Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.9 s, LCP
1.5 s, TBT 260 ms, CLS 0. First-load app JS is 40,796 bytes / 14,129 gzip and
CSS is 19,877 bytes / 5,219 gzip. PDF/ZIP chunks are lazy-loaded; all initial
assets are within the stated 200 KB JS / 50 KB CSS budgets.

## Candidate/deployment identity

`dist/index.html` SHA-256 was
`b55d236095809d4aec487877548c40b37b022a75d087d0eeb402038e60b626dc`, exactly
the live root response. SHA-256 also matched for `sw.js`, the manifest,
offline and legal pages, initial CSS/JS, lazy export chunks, and the hero
asset. This is a deployment of the tested candidate, not an older build.

## Defects

### High — deployed immutable assets are not immutably cached

The live root, hashed JS/CSS, service worker, manifest, and legal routes all
return:

```text
cache-control: public, must-revalidate, max-age=30
```

Hashed static assets need a long-lived immutable policy. This conflicts with
the PWA performance/caching acceptance contract and causes unnecessary
revalidation for a privacy-sensitive offline utility. Set immutable,
long-lived caching for content-hashed assets, while keeping HTML and `sw.js`
short-lived/revalidated.

### Medium — production omits defensive browser response policies

Live responses include HSTS, `nosniff`, and a referrer policy, but no
`Content-Security-Policy`, `Permissions-Policy`, `X-Frame-Options`/`frame-
ancestors`, COOP, or CORP. For an application that handles invoice evidence,
ship a restrictive CSP (the app has no required third-party runtime scripts),
explicitly deny unneeded permissions, and prevent framing. HSTS is also only
10,886,400 seconds despite carrying a `preload` token, below the usual
preload duration.

### Low — manifest is served as `application/octet-stream`

`/manifest.webmanifest` is 200 but has `content-type: application/octet-
stream`; serve `application/manifest+json` (or JSON) for interoperable PWA
tooling.

## Non-blocking coverage limit

The paid encrypted-export path was not exercised with a real issued license;
the free, brief-critical workflow and all free exports were exercised. No
payment or billing state was created.

