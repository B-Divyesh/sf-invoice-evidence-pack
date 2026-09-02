# Invoice Packet review-3 handoff — 2026-09-02

## Outcome

**FAIL.** This reviewer changed no product code. The review report is in .factory/review-3.md.

One blocking defect remains: from the isolated demo, navigating to Privacy or using Back leaves focus on the document body and does not update the polite route announcement. See F-3-1 for the reproduction and required test.

## Verification completed

- Fresh clone and npm ci at /tmp/invoice-review3-ZTY9Tc.
- Cold live checks at 390 × 844 and 1440 × 900; no console errors or mobile horizontal overflow.
- One-click live demo, reset control, first-screen sample data, demo request log, metadata, 404, and same-origin link crawl.
- Every exact command declared in .factory/claims.json passed (22/22).
- npm test, npm run check, npm run build, npm run test:e2e, npm run test:e2e:repeat, and live deployment verification passed.

## Next step

Repair and test demo-mode route focus/announcement, then rerun the complete review checklist. No other defect was confirmed in this review.
