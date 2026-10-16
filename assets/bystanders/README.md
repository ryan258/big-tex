# Big Tex: Rewired — innocent bystanders, v01

Twelve original SVG characters in the established angular cut-paper style.
Each has a distinct pose and prop so the crowd can carry small story beats.

1. Snack protector — shelters a corny dog and looks up.
2. Phone filmer — stands and records the chaos.
3. Balloon kid — holds a balloon and reacts.
4. Stroller parent — pushes a stroller while moving away.
5. Family on the move — adult and child hold hands.
6. Corny dog vendor — serves from a wheeled cart.
7. Coupon collector — keeps a fistful of coupons safe.
8. Unbothered local — folds their arms and watches.
9. Lost tourist — studies a large folded map.
10. The runner — sprints while their cap flies off.
11. Rolling out — a wheelchair user pushes the rear wheel to move.
12. Stuck on I-30 — a driver reacts from a stalled car.

## Contents

- `icons/`: twelve standalone SVGs in the latest turquoise/coral/cream/petrol palette.
- `classic/icons/`: the same geometry in the earlier black/red/mustard palette.
- `sprite.svg` and `classic/sprite.svg`: reusable symbol collections.
- `animation-parts.json` and `classic/animation-parts.json`: layer names, IDs,
  draw order, and pivot suggestions for each character.
- `palette.json`: both palettes.
- `contact-sheet.svg` / `contact-sheet.png`: labelled overview of the latest colors.
- `build_bystanders.py`: editable source geometry; standard-library Python only.

Every icon uses `viewBox="0 0 256 256"` with transparent backgrounds and actual
negative-space cutouts. Standalone icons contain no text, fonts, raster images,
external references, filters, or scripts. Accessible titles and descriptions
are included. The contact sheet alone uses live Arial text.

## Moving the characters later

Heads, bodies, limbs, wheels, and important props have separate named groups.
Each group carries `data-part` and `data-pivot="x y"`. Pivots are in original
viewBox coordinates; left/right refer to the viewer. Groups remain flat layers,
so these are editable animation parts, not a parented skeletal rig or an
already animated asset.

For a simple rotation around a suggested pivot, apply
`translate(x y) rotate(angle) translate(-x -y)` to the chosen group. Parent
dependent parts when building an articulated rig. Add instance-specific ID
prefixes when inserting the same standalone SVG markup more than once.

The latest palette is baked directly into the default SVG paths. When placing
these into the original render pipeline and then applying the teaser's color
LUT, use the `classic/` variant so the treatment is applied once.

These are film illustration assets. Very small interface use would benefit
from a separate simplification pass.

## Rebuild

From the project root:

```sh
python3 assets/bystanders/build_bystanders.py
magick -font '/System/Library/Fonts/Supplemental/Arial Bold.ttf' -background none assets/bystanders/contact-sheet.svg assets/bystanders/contact-sheet.png
```

The SVG builder does not require ImageMagick; it is used only for the PNG overview.
