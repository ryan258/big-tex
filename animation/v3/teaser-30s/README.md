# Big Tex: Rewired — v3 Texas jokes / 30-second vertical teaser

`big-tex-rewired-v03-30s-vertical-teaser.mp4` is a new short cut of the v3
monster-comedy story, using the existing jointed character and phone compositions.

- Exactly 30 seconds, 1080 × 1920, 24 fps, H.264, stereo 320 kbps AAC.
- 23 shots; story cards are visible from the beginning of each shot.
- Opens with **HE WAS ONLY SUPPOSED TO WAVE.**
- **THEY SENT THE GUARD → HE SENT HIS HAT** leads to the helicopter impact.
- **TRAFFIC ON I-30 → SOMEHOW, WORSE** leads into the fast action section.
- **GOT ANY COUPONS? → FOR ONE CORNY DOG** provides the comedy button.
- The full title lands at **26.167 seconds**, on the strongest detected attack
  in this score excerpt, and stays through the last frame.
- Final line: **KEEP YOUR CORNY DOG CLOSE.**

## Color treatment

Sun-faded turquoise, hot coral, warm cream, and deep petrol blue replace the
earlier mustard/red/black palette. The treatment preserves flat ink regions,
transparent cutouts, antialiasing, and the fine paper texture.

`palette.json` records the original and treated inks. `sun-faded-texas.cube`
is a reusable 33-point 3D LUT. The still previews and final video use the same LUT.
The original SVGs and 90-second v3 video exports are unchanged.

## Audio and timing

The continuous score excerpt is **97.235–127.235 seconds** of the supplied WAV,
at its original tempo. Five restrained local effects are retimed to the new
cut. The score dips during the coupon/corny-dog button and returns for the
closing action and title. A 0.35-second audio fade ends the excerpt; the picture
does not fade to black. The original WAV is unchanged.

Cut points use saved broadband/bass spectral-flux evidence and round to the
nearest 24 fps frame. `timeline.json` records each attack and its frame error.
This is waveform-derived timing, not manual musical-bar annotation.

## Files and rebuild

- `render.cjs`: re-edits v3 scenes, applies the color treatment, exports video/stills.
- `plan.cjs`: shot selection and hit alignment.
- `mix.py`: new 30-second score mix and effect cues.
- `palette.py`: LUT generation.
- `storyboard.jpg`: all 23 shots.
- `hook.jpg`, `traffic.jpg`, `coupons.jpg`, `poster.jpg`: treated key frames.
- `work/`: source stills used to build the color-treated previews.

From the project root with the existing local canvas/font/FFmpeg setup:

```sh
node animation/v3/teaser-30s/render.cjs --render
```

Omit `--render` to rebuild only stills. The parent v3 renderer now also accepts
an optional shot/pulse override, allowing this new edit to use its own timing
while preserving the original 90-second composition behavior.
