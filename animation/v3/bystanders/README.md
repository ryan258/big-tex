# Big Tex: Rewired — 90-second v3 with bystander reactions

Two new exports extend the twelve-character cast from the vertical teaser across the full 47-shot v3 trailer:

- `big-tex-rewired-90s-v03-bystanders.mp4`: 1920 × 1080 widescreen.
- `big-tex-rewired-90s-v03-bystanders-vertical.mp4`: 1080 × 1920 portrait, with separate foreground placements.
- Both are 90 seconds, 24 fps, 2,160 frames, H.264 video and stereo AAC audio.

The Texas joke cards, shot boundaries, and 90-second soundtrack are preserved. Each audio stream is copied from its corresponding original v3 MP4. The same turquoise/coral/cream/petrol LUT used by the teaser is applied once to the original palette during rendering.

## Reactions and scale

Fairgoers film and watch at the opening. The family, runner, stroller parent, and wheelchair user move away as Tex escapes. The filmer flinches at the hat impact; the I-30 driver throws up a hand; the balloon swings as the child looks up; the tourist shakes the map. The coupon collector protects the tickets, the snack protector guards the corny dog, and the local stays mostly unimpressed.

Full-body Tex shots use a common scale rule: [Big Tex is 55 feet tall](https://bigtex.com/about-us/big-tex/), or about 9.17 six-foot adults. The renderer measures each SVG person's body bounds, excluding raised phones, balloons, flying hats, and stroller props, then scales the person against the puppet's hat-to-sole height. Child and seated poses use smaller reference heights. Close reaction shots without a full-body Tex use larger foreground figures. Travel scales with body size.

Independent SVG joints and attached props supply the gestures. Travel and gait step at 12 fps inside the 24 fps video. Recoil starts on saved score attacks rounded to the nearest video frame, with stronger attacks producing larger gestures. The original main-title interval (73.500–76.875 seconds) and final title (84.667–90.000 seconds) contain no bystanders.

## Wheel correction

The Texas Star rotates clockwise when traveling right. Rotation uses distance divided by a 96-unit nominal rim radius, with the wheel turning around its SVG hub. Both the rolling-wheel and wheel-chase scenes use this rule. Stroller, cart, and wheelchair wheels also derive rotation from signed travel distance. The revised 30-second bystander teaser is `../teaser-30s/bystanders/big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4`.

## Files and rebuild

- `reactions.cjs`: layouts, score cues, foreground contrast, and scene behaviors.
- `render.cjs`: both video exports, treated stills, and storyboards.
- `reaction-cues.json`: all characters, placements, cue evidence, scale data, and protected title intervals.
- `verification.json`: export metadata, source hashes, audio equality, decoded-frame checks, and motion checks.
- `storyboard-wide.jpg` and `storyboard-vertical.jpg`: representative story moments.
- `../bystander-scale.cjs`: the shared person-to-Tex scale rule.
- `../teaser-30s/bystanders/cast.cjs`: shared SVG articulation and wheeled-character motion.
- `../scenes.cjs`: original v3 scenes with corrected Texas Star rolling motion.

From the project root with the existing local Canvas/font/FFmpeg setup:

```sh
node animation/v3/bystanders/render.cjs --render
```

Omit `--render` for stills only. Add `--video-only` to reuse existing stills. `--wide-only` or `--vertical-only` limits rendering to one format. Earlier v3 exports are retained.
