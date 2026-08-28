# Invoice Packet verification handoff

## Outcome

**FAIL** — candidate `d553f454d61a56e1a2f9a2be4bc4c2b4609f175f`
at <https://invoice-evidence-pack.sociobot.in>, independently verified on
2026-08-28 UTC.

The live deployment now byte-matches the candidate and its earlier deployment
policy failures are repaired. Build, tests, the end-to-end local-first job,
exports/import, encrypted ZIP, service-worker offline/update behavior, privacy,
headers, mobile layout, axe, and performance all pass. Release acceptance still
fails because evidence attachment controls have no visible keyboard focus.

Full evidence and exact reproductions are in
[`.factory/verification-3.md`](verification-3.md).

## Quality-gate evidence

- Clean `npm ci`: 134 packages, 0 vulnerabilities.
- `npm test`: 8/8 passed.
- `npm run check`: passed. No separate lint command exists.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: 11 passed, 1 intentional project skip.
- Live Playwright: desktop and 390×844 mobile, 0 console/page errors, 0
  serious/critical axe findings in tested light/dark states.
- Live Lighthouse mobile: 98 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.3 s, TBT 140 ms, CLS 0.
- Initial JS 40,723 bytes; CSS 20,092 bytes. Export libraries are lazy chunks.
- Live identity/policy check passed. Root SHA-256:
  `40a2ef4560d91f0c762789fc5228b544bca7a8767c3a78d387c648af3e0d12b3`.
- Offline reload and a waiting-worker update/activation both passed.

## Defects to resolve

1. **High:** file inputs are keyboard-reachable but fully transparent, with a
   0 px focus outline and no focus treatment on the visible label. Add a clear
   `:focus-within` state to “Add evidence” and “Replace.”
2. **Medium:** whitespace-only packet and checklist names are trimmed and saved
   as blank values. Validate trimmed input and announce the field error.
3. **Low:** Replace/Remove targets are 38 px high, and the mobile delete
   control shrinks to 36×44 px; meet the 44×44 minimum.

## Re-run

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

Then manually Tab from “Add checklist item” into each evidence upload control
in both missing and collected states, verify a visible focus indicator, and
retry whitespace-only packet/item submissions before changing the verdict.

## Known coverage limits

No real purchase or issued production license was created. The encrypted path
was exercised with a cached-valid test entitlement, including correct/wrong
password handling. Safari and Firefox installed-PWA behavior remains advisable
before broad release.
