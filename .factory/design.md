# Invoice Packet visual thesis

## Direction: botanical field guide

Invoice Packet treats each business event like a field specimen: collected once, labelled precisely, checked for completeness, and stored with an intelligible trail. The interface borrows the calm hierarchy of a naturalist's folio—paper, ruled annotations, accession numbers, specimen tags, and small botanical silhouettes—without making compliance feel antique or ornamental. Decoration explains the model: an invoice is the specimen; its evidence items are the labelled parts.

## Palette

- `paper` `#F4F0E6`: warm archive-paper background that makes long review sessions gentler.
- `sheet` `#FFFCF5`: foreground writing surface.
- `ink` `#183129`: primary near-black with a green cast.
- `moss` `#285B45`: primary action and focus color; white text passes AA.
- `fern` `#39765A`: secondary botanical accent, used only at large size or decoratively.
- `lichen` `#DDE6D4`: selected and progress surfaces.
- `ochre` `#9B5E12` / `#FFF1D5`: missing-item warning pair.
- `berry` `#9E3F42` / `#F9E3E1`: destructive and error pair.
- `slate` `#50615A`: muted text (AA on paper and lichen surfaces).
- Dark treatment: `#10211C` night-paper, `#182D26` sheet, `#ECF1E8` ink, `#8EC3A2` fern, `#263D31` lichen. A manual theme switch persists locally, with system preference as the initial setting.

## Typography

- Headings and packet names: Georgia, Cambria, `Times New Roman`, serif. The organic bracketed serifs evoke printed field manuals without downloading a font.
- UI, notes, labels, and tables: Inter-compatible system stack (`ui-sans-serif`, `system-ui`, sans-serif). Tabular numerals are enabled for dates, file sizes, and hashes.
- PDF export embeds local, subset copies of Noto Sans Devanagari and Noto Sans JP so cross-border metadata remains readable and extractable. The small core subsets cover the shipped sample; complete local fallback fonts load only when an export includes other script characters. These functional export fonts are SIL OFL 1.1; details are in `THIRD_PARTY_NOTICES.md`.
- Scale: 14px specimen labels; 16px body; 20px section title; responsive 30–48px display. Reading measure is capped at 68 characters.

## Spacing and shape

- An 8px base rhythm with 4px for tight metadata. Major sections use 24–48px separation.
- Corners are clipped subtly (2–12px), like paper labels rather than pill-shaped software. Rules are hairline botanical ink at low opacity. Cards are reserved for independent packets and evidence records.
- Interactive targets are at least 44×44px, with 12px gaps on mobile.

## Interaction grammar

- Product controls name the work directly: “New packet,” “Collect evidence,” “Notes for the reviewer,” and “Export the packet.” Botanical language stays in the visual treatment and artwork, never in task labels.
- Completion is shown as both a count and explicit words, never color alone. Missing evidence is surfaced in context and summarized before export.
- The builder is a three-section worksheet rather than a wizard, so accountants and freelancers can move freely between metadata, checklist, and notes. Destructive actions require an explicit, named confirmation.
- Status messages appear as small margin annotations in a polite live region. Offline status is persistent but quiet.

## Motion

- 180–240ms opacity and small translate transitions model a sheet being set down or a margin note appearing. The progress line grows from its origin. Nothing loops.
- Under `prefers-reduced-motion: reduce`, transitions and smooth scrolling become instant while state changes retain outlines, text, and contrast.

## Asset plan and provenance

- Hero illustration: an original painterly-gouache botanical field-guide still life—an open archival folio, blank invoice sheet, evidence tags, fern fronds, seed pods, and brass paper clip. It establishes the collecting metaphor and contains no interface claims or text.
- App icons: hand-authored SVG mark (folio + leaf), rasterized locally to 192px and 512px PNG, including maskable safe area.
- Utility icons are inline, hand-authored SVG strokes with `currentColor` and accessible text labels; no third-party icon set.

### Hero prompt sheet

Use case: stylized-concept. Asset type: PWA landing-page hero. Primary request: an editorial botanical field-guide still life that visualizes assembling evidence around one invoice. Scene: top-down open cream archival folio on a warm paper desk, one blank invoice-like sheet held by a brass paper clip, small unprinted evidence tags and translucent file sleeves arranged with a pressed fern, eucalyptus sprig, seed pods, and a magnifying glass. Style: refined gouache and colored-pencil natural-history illustration with crisp cut-paper edges and subtle paper grain, contemporary rather than vintage. Composition: landscape, main folio on the right, breathing room and a few loose leaves on the left for responsive cropping. Light: diffuse northern-window daylight, calm and trustworthy. Palette: warm paper, deep archival green, moss, lichen, restrained ochre and berry. Avoid: readable text, letters, numbers, logos, watermarks, currency symbols, people, hands, screens, photorealism, gradients, clutter, distorted objects, ominous tax imagery.

Generated using the factory image deployment on 2026-08-28 via `/opt/fleet/lib/gen-image.sh`. The image is original to Invoice Packet and used under the project's MIT license. The selected source and exact prompt sidecar live in `assets/src/`; optimized WebP derivatives live in `public/assets/`.

The 1200×630 social card is a centered local crop of the same original hero,
created with ImageMagick on 2026-08-30. It introduces no new source material.

On 2026-08-30, the PDF core script subsets were generated locally with
FontTools 4.63.0 from the already-noted Noto sources. The complete source
fonts remain locally hosted as on-demand fallbacks so uncommon Devanagari or
Japanese metadata still exports correctly without putting multi-megabyte fonts
in the offline installation shell.
