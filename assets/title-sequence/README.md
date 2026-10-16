# Big Tex: Rewired — title sequence icons, v01

Twelve original, hand-authored SVG illustrations based on the local trailer.
The visual direction draws on Saul Bass title sequences: cut-paper silhouettes,
crooked geometry, large negative-space cutouts, and a restricted flat-ink palette.
These are newly drawn assets, not reproductions of existing film artwork.

## Files

- `icons/`: twelve standalone, transparent SVGs; each uses a 256 × 256 viewBox.
- `sprite.svg`: all twelve icons as symbols, using the filenames as symbol IDs.
- `contact-sheet.svg`: editable labelled overview on warm paper.
- `contact-sheet.png`: rendered overview for quick review.
- `build_icons.py`: editable geometry and deterministic standard-library builder.

Individual icons contain only paths and groups, plus accessible titles and
descriptions. They have no embedded raster images, fonts, external dependencies,
filters, or background rectangles. Negative-space cutouts are transparent.
The contact sheet uses live Helvetica/Arial text.

## Palette

| Ink | Hex |
| --- | --- |
| Black | `#191815` |
| Red | `#C83E2D` |
| Mustard | `#D5A326` |
| Contact sheet paper | `#F3E6CC` |

All path fills are explicit and editable. Each icon has named, prefixed groups
for separate motion of the silhouette and accents. No animation is included.
The set is designed as title-sequence illustration; very small interface use
would need a separate simplification pass.

Rebuild SVGs from this folder:

```sh
python3 build_icons.py
```

Render the contact sheet with ImageMagick on macOS:

```sh
magick -font /System/Library/Fonts/Supplemental/Arial.ttf -background none contact-sheet.svg contact-sheet.png
```

For inline sprite use, copy the symbols into the destination SVG and reference
an ID with `<use href="#big-tex"/>`. Add an accessible name to the containing
SVG in its actual context. If combining standalone SVG markup, give repeated
instances unique IDs to preserve their accessible-name references.
