# Big Tex: Rewired — 30-second vertical teaser with bystander reactions

`big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4` adds the complete twelve-character bystander set to the existing v3 vertical teaser. This revision corrects the Texas Star's rolling direction and links wheel rotation to travel distance; the earlier v01 export is retained. Full-body Tex shots now use the shared 55-foot Tex / six-foot adult scale rule (about 9.17 adults tall), while close reaction shots retain larger foreground figures.

The 23-shot edit, Texas joke cards, 30-second soundtrack, and turquoise/coral/cream/petrol color treatment come from the parent teaser. The audio stream is copied directly from that MP4. The final **BIG TEX: REWIRED** title remains clear from 26.167 seconds through the ending.

## Reactions

- The phone filmer recoils while keeping the phone in hand during the hat impact.
- The snack protector pulls the corny dog close; the vendor keeps serving.
- The I-30 driver throws up a hand as traffic gets "SOMEHOW, WORSE."
- The coupon collector tucks the ticket fan toward their chest.
- The balloon kid looks up as the balloon swings; the tourist shakes the map.
- The family, runner, stroller parent, and wheelchair user move across the foreground.
- The unbothered local responds with a small head tilt.

Heads, limbs, props, stroller wheels, and wheelchair wheels use the original SVG group pivots. Attached props follow their parent joints. Travel and gait use stepped motion at 12 fps, within a 24 fps video. Recoil gestures begin on the saved score attacks rounded to the nearest video frame; prominent internal attacks can trigger another reaction while a joke card holds.

Dark foreground scenes use cream silhouettes with dark edges to keep the cast legible. The classic source SVG colors are rendered first, then passed through the same parent LUT once, preserving the teaser's palette.

## Sources and rebuild

- `cast.cjs`: SVG part loading, pivot chains, and character gestures.
- `reactions.cjs`: foreground placements, travel, and attack cues.
- `render.cjs`: video, treated stills, storyboard, and isolated joint-motion preview.
- `reaction-cues.json`: all twelve characters, placements, cue times, and title boundary.
- `verification.json`: export metadata, source hashes, audio equality, and decoded-frame checks.
- `storyboard.jpg`: representative shots with the cast in place.
- `joint-motion.jpg`: phone/arm reaction and recovery at four times.
- `../timeline.json`: unchanged parent edit and detected score attacks.
- `../sun-faded-texas.cube`: unchanged parent color treatment.
- `../../../../assets/bystanders/classic/`: layered SVG cast and pivot manifest.

From the project root with the existing local Canvas/font/FFmpeg setup:

```sh
node animation/v3/teaser-30s/bystanders/render.cjs --render
```

Omit `--render` to rebuild only still previews. The export is 1080 × 1920, 24 fps, 720 frames, with H.264 video and the parent AAC stereo stream.
