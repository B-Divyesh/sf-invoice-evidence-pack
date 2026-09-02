# Invoice Packet review-5 handoff — 2026-09-02

## Outcome

**FAIL.** No product code or deployment was changed. The review report is in
[`.factory/review-5.md`](review-5.md).

## Findings

- **F-5-1 (BLOCKING):** the landing’s primary **Try it with sample data**
  action enters demo with focus left on `<body>` and no route announcement.
- **F-5-2 through F-5-4:** three Terms billing/license statements have no
  declared claim or test.

## Verification completed

- Fresh clone at `e12e7a0f28c079d65997b1f78129af023278df68`; `npm ci` passed.
- Replayed all 23 exact commands declared in `.factory/claims.json`; all
  passed.
- Passed: `npm test` (11 tests), `npm run check`, `npm run build`,
  `npm run test:e2e` (66 tests), `npm run test:e2e:repeat` (132 tests), and
  `npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in`.
- Live fresh-browser checks covered desktop and 390px mobile first screen,
  demo sample/reset/banner, same-origin requests, metadata, 404, link crawl,
  route focus, and prior-review regressions.

## Next steps

1. Repair and test the hero demo CTA focus/announcement behavior.
2. Add fixture-backed claim entries/tests for the three Terms statements, or
   remove them.
3. Run the entire review checklist again; do not treat this handoff as a
   release pass.
