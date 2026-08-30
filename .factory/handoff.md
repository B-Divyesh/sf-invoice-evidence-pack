# Invoice Packet verification handoff — 2026-08-30

## Outcome

**FAIL** for work order `invoice-evidence-pack-verify-7`.

Candidate `008780398239d0a4f31d1a57cdc1115213401ab7` is deployed byte-for-byte
at <https://invoice-evidence-pack.sociobot.in>. Deployment propagation is no
longer a blocker. The release is blocked by a malformed-backup error that
shows a raw JSON parser diagnostic instead of a plain explanation and next
step. See `.factory/verification-7.md` for complete evidence and reproduction.

## What passed

- All 18 commands in `.factory/claims.json` passed from a clean install.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `npm test`: 10/10 tests passed.
- `npm run check` and `npm run build` passed; `dist/index.html` exists.
- `npm run test:e2e`: 26 passed, 12 intentional project skips.
- `npm run test:e2e:repeat`: 52 passed, 24 intentional project skips.
- Exact live/local identity and response policy passed. Root hash:
  `85bc1018ac4b507e12482dcb1c852c5b56a35a5769ec18c140635ccf62068d15`.
- Cold first-read and one-click sample demo passed.
- Normal create/hash/persist/export, 100 MiB boundary, oversize rejection,
  missing flags, redaction, backup recovery, encryption recovery, and demo
  isolation passed.
- Live request logging found no third-party workflow request. Axe found zero
  serious/critical issues. Desktop, 390 px, 320 px, keyboard, focus, touch
  targets, dark mode, and reduced motion passed.
- Live offline reload and a controlled service-worker replacement/update both
  passed while preserving IndexedDB data.
- Five live mobile Lighthouse runs had median Performance 95; Accessibility,
  Best Practices, and SEO were 100. Median LCP was 1.23 s and CLS was 0.
- Initial JS is 46,740 bytes, CSS 21,297 bytes, mobile hero 32,908 bytes. The
  first offline cache is 14 entries / 322,763 bytes with no export fonts or
  `fontkit` chunk.

## Defects

1. **Medium, release-blocking:** importing syntactically broken JSON displays
   Chromium's `Expected property name or '}'...` parser text. Existing data is
   preserved, but the error violates the required plain-language recovery
   contract. Normalize JSON parse errors and add an E2E regression.
2. **Low:** the exact 100 MiB binary limit is labelled “100 MB” in the UI and
   error copy. Make the unit and tested claim agree.

## Reproduce

```sh
npm ci
npm audit --omit=dev
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e:repeat
npm run verify:deployment -- https://invoice-evidence-pack.sociobot.in
```

No product code was modified. Only this verification report and handoff were
changed. No Sociobot service, secret, application setting, billing endpoint,
or unrelated resource was read or contacted. The checkout URL was inspected
without following it; shared billing 429 behavior remains unobserved because
of the resource-isolation instruction.
