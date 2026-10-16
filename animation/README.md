# Big Tex: Rewired — title sequence v01

An original cut-paper animation of the twelve SVG icons, set to the supplied
`Hoooowdy, folks... Trailer Score (Epic Outlaw).wav`.

- **Video:** `big-tex-rewired-title-sequence-v01.mp4`
- **Format:** 1920 × 1080, H.264, 24 fps; artwork moves in 12 fps steps.
- **Audio:** the full 139.92-second stereo score, encoded as 320 kbps AAC.
  A 0.65-second fade at the end avoids an abrupt audio cutoff. The source WAV is unchanged.
- **Edit:** 18 scenes; local waveform attacks guide cut points and impact accents.
  Timing is calculated from the waveform rather than manually marked musical bars or lyrics.
- **Artwork:** existing SVG icons, with cream variants for dark/red backgrounds.
  The original SVG files remain unchanged.
- **Type:** local Arial Black, arranged as individually staggered, rotated letters.
- **Texture:** deterministic fine print grain and stepped paper movement.

`storyboard.jpg` shows one resolved composition from each scene.
`poster.jpg` is the Rewired title card. `edit-map.json` records scene names and
time ranges. `timing.json` contains waveform-derived edit points and attacks.

## Edit and rebuild

`render_sequence.cjs` contains all compositions, transforms, typography, and
render settings. `analyze_score.py` is needed only to regenerate timing data.
The renderer reads the SVGs from `../assets/title-sequence/icons/` and the WAV
from the project root. No network requests or paid services are used.

This machine already has the required Node canvas module in the bundled
Codex runtime, plus FFmpeg and the title font. From the project root:

```sh
# Rebuild still previews and the scene map.
node animation/render_sequence.cjs

# Rebuild the complete MP4. This overwrites the v01 MP4.
node animation/render_sequence.cjs --render
```

On another machine, install `@napi-rs/canvas` for Node and FFmpeg, then set
`BIG_TEX_FONT` to a suitable local heavy font file. `BIG_TEX_NODE_MODULES` can
point to a directory of Node modules if they are not installed in the usual
module-resolution path. The optional timing analyzer requires Python with NumPy.

The original trailer uses fictional action imagery; this sequence adds no
real cast credits, distributor claims, or release date.
