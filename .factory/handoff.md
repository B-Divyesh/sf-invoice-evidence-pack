# Invoice Packet review 7 handoff — FAIL

## Outcome

Adversarial review 7 is recorded in [review-7.md](review-7.md). The verdict is
**FAIL** with eight findings: one misleading backup-scope label, four unlisted
behavior/security claims, two inconsistent landing terms, and one vague README
sentence. No product code was changed.

## Verification completed

- Cold live checks at 390 × 844 and 1440 × 900.
- One-click demo, reset, normal/demo IndexedDB isolation, Start for real, and
  same-origin request logging.
- Every one of the 25 `.factory/claims.json` commands from fresh clone
  `/tmp/invoice-review7-clean-46VVra`; all passed.
- `npm test` (11/11), `npm run check`, `npm run build`, and a complete
  `npm run test:e2e` rerun (54 passed, 20 intentional skips).
- `npm run verify:deployment`, `npm run verify:live`, and
  `/opt/fleet/lib/verify-url.sh` against production.
- Live metadata, 404, link crawl, route focus/Back behavior, responsive layout,
  Axe coverage, prior findings, copy, claims, and missed leverage.

The first full browser-suite attempt hit a Chromium SwiftShader process crash;
a new browser process completed the suite without a test failure.

## Work remaining

Resolve F-7-1 through F-7-8 in the review. In particular, either narrow **Back
up all data** to its actual packet/template scope or expand the format, and add
tagged claim coverage for password handling, checklist edits, template file
exclusion, and deletion behavior. Rerun the full review from a clean clone.
