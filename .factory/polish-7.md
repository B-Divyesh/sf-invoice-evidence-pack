# Polish round 7

Polished 2 September 2026 from adversarial review 7. All review findings are
closed in the shipped build. The full browser suite also reruns prior review
coverage so earlier fixed findings remain covered.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-7-1 | Replaced **Back up all data** with **Back up packets and templates** everywhere. The Privacy page now says that a backup excludes the theme and license token. | `@claim:backup-packets-templates` exports, imports, and checks the exact JSON scope; [live check](evidence/polish-7/local/live-check.json); [desktop capture](evidence/polish-7/local/verify-url/screenshot-desktop.png). |
| F-7-2 | Added direct encrypted-export wording: the password is not stored and cannot be recovered. The export flow resets its fields after use. | `@claim:password-not-stored` checks the archive, browser storage, IndexedDB, request log, and reset fields; [live check](evidence/polish-7/local/live-check.json). |
| F-7-3 | Added an **Edit item** dialog for a checklist item's label, explanation, and required state. Edits persist after reload. | `@claim:configurable-checklists`; [demo mobile capture](evidence/polish-7/local/demo-mobile.png); [live demo](https://invoice-evidence-pack.sociobot.in/?demo=1). |
| F-7-4 | Kept the template's precise file-exclusion wording and made it a registered, tested promise. Templates retain checklist fields only. | `@claim:custom-templates` checks saved template and new packet data contain no attachment fields; [live check](evidence/polish-7/local/live-check.json). |
| F-7-5 | Privacy copy now explains packet deletion and clearing site data. The behavior is tested through the actual delete action and browser storage clear. | `@claim:data-deletion`; [Privacy route check](https://invoice-evidence-pack.sociobot.in/privacy); [live check](evidence/polish-7/local/live-check.json). |
| F-7-6 | Replaced the inconsistent landing word **list** with **checklist**. | `@claim:configurable-checklists`; [live landing](https://invoice-evidence-pack.sociobot.in/). |
| F-7-7 | Replaced **PDF index** with **PDF manifest** on the landing page. | `@claim:free-exports`; [live landing](https://invoice-evidence-pack.sociobot.in/). |
| F-7-8 | Replaced the vague README billing sentence with the exact product identity used by checkout, and stated what it does not contain. | README copy audit in [copy-audit.md](copy-audit.md); `@claim:checkout-operator-gate`; [live Terms route](https://invoice-evidence-pack.sociobot.in/terms). |

## Regression and release evidence

- `.factory/claims.json` contains 28 claims. A source audit confirms every
  claim identifier occurs in exactly one tagged test.
- The clean-clone command runner executes every listed claim command. It is
  followed by unit, type, build, browser, offline, privacy, mobile, and Axe
  coverage.
- Local static-host checks are in
  [evidence/polish-7/local](evidence/polish-7/local), including 390 px,
  offline, route, policy, and console checks.
- Production evidence and a cold URL check are recorded after deployment in
  [evidence/polish-7/live](evidence/polish-7/live).
