# Big Tex: Rewired — 30-second teaser v03

`big-tex-rewired-30s-teaser-v03.mp4` opens on a full-frame lightning strike
and finishes on **BIG TEX: REWIRED**, visible through the last encoded frame.

- Exactly 30 seconds; 1920 × 1080; H.264 at 24 fps; stereo 320 kbps AAC.
- 26 shots / 25 cuts; median shot length about 0.96 seconds.
- Continuous score excerpt: **97.235–127.235 seconds**, at its original tempo.
- The opening coincides with a detected attack. The final three-hit run
  drives hand → lightning → title at **25.417 / 25.792 / 26.167 seconds**.
- The title attack at 26.165 seconds is the strongest detected attack in
  the selected passage. The title holds for the remaining 3.833 seconds.
- Most captions are removed; only **OFF THE CABLES** interrupts the icon action.
- No fade to black. A 3 ms audio fade-in prevents a start click, and a
  0.35-second audio fade-out ends the excerpt cleanly. The original WAV is unchanged.

Timing is derived from the broadband/bass spectral-flux evidence saved for the
90-second edit. The excerpt selection ranks strong opening and closing attacks
plus action attacks between; this is waveform-based timing, not manual beat annotation.

## Editable files

- `plan_teaser.cjs`: selects the score passage and shot boundaries.
- `timing-30s-teaser-v03.json`: selected score range, attack strengths, shots,
  frame times, and sync errors.
- `render_teaser.cjs`: teaser compositions, animation, title hold, and encoding.
- `render_sequence.cjs`: shared icon loader and drawing functions.
- `storyboard-30s-teaser-v03.jpg`: overview of all 26 shots.
- `poster-30s-teaser-v03.jpg`: final title card.

Rebuild from the project root using the existing local canvas/font/FFmpeg setup:

```sh
node animation/render_teaser.cjs --render
```

To recalculate the edit plan first:

```sh
node animation/plan_teaser.cjs
```

The earlier 90-second and full-length video files are preserved. Dependency
and font-path settings are described in the original animation README.
