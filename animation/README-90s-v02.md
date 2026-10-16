# Big Tex: Rewired — 90-second hit cut, v02

`big-tex-rewired-90s-v02.mp4` is a separate edit of the cut-paper sequence.

- Exactly **90 seconds**, 1920 × 1080, H.264 at 24 fps, stereo AAC at 320 kbps.
- **50 shots / 49 cuts**, with a median shot length of **1.5 seconds**.
- Uses the continuous **49.92–139.92 second** passage of the supplied WAV at
  its original tempo. The audio is not sped up or internally spliced.
- Shot changes align to detected local audio attacks, rounded to the nearest
  video frame. The maximum cut-to-detected-attack difference is 20 milliseconds.
- The main **REWIRED** card lands at **73.50 seconds**, on the strongest
  detected attack in the final section of this excerpt (73.48 seconds).
- The action section adds short inserts, impact movement, and direct cuts.
  Main title cards remain on screen longer for reading.
- Artwork keeps its stepped paper movement; edit boundaries use the full
  24 fps clock. Intro/outro fades are 0.015/0.65 seconds for audio and
  0.16/0.65 seconds for video.

Hit selection is calculated from weighted broadband and bass spectral-flux
prominence. This records waveform evidence rather than manually annotated
musical beats, lyrics, or an independently auditioned music edit.

## Editable sources

- `render_90s.cjs`: fast motion, impact treatment, title holds, and video export.
- `timing-90s-v02.json`: source offset, every shot, detected hits, and sync errors.
- `analyze_90s.py`: deterministic hit detection and shot-plan builder.
- `render_sequence.cjs`: shared vector composition library and original renderer.
- `storyboard-90s-v02.jpg`: one sampled composition per shot.
- `poster-90s-v02.jpg`: main title still.

The earlier 139.92-second MP4 and original SVGs are preserved.

From the project root on this machine:

```sh
# Rebuild the 90-second video, storyboard, and poster.
node animation/render_90s.cjs --render
```

Omit `--render` to rebuild only the stills. The canvas/font/FFmpeg dependencies
and portability settings are described in the original animation README.
