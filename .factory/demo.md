# Invoice Packet demo

- One-click URL: <https://invoice-evidence-pack.sociobot.in/?demo=1>
- Canonical demo URL: <https://invoice-evidence-pack.sociobot.in/demo/>
- Local URL: <http://127.0.0.1:4173/?demo=1>
- Entry point: choose **Try it with sample data** on the empty landing page.

The demo opens a seeded cross-border client-review packet for Kite Studio and
Aozora 株式会社. It includes an invoice, signed scope, client acceptance, payment
advice, file sizes, and SHA-256 fingerprints. Two optional checklist items are
left empty so reviewers can exercise both present and optional states.

Demo records use the separate IndexedDB database `demo:invoice-packet`. The
normal `invoice-packet` database is never read or written while `/demo/` is
open. **Reset demo** restores the original sample. **Start for real** clears the
demo database and returns to the normal workspace.
