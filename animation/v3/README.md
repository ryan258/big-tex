# Big Tex: Rewired — 90-second v3 demo

**Premise: He was only supposed to wave.**

A fictional Texas monster-comedy trailer in the original cut-paper style.
The goal is a recognizable hook, specific local humor, and readable phone
composition. Audience response and virality have not been tested.

## Watch

- `big-tex-rewired-90s-v03.mp4`: 1920 × 1080 widescreen.
- `big-tex-rewired-90s-v03-vertical.mp4`: 1080 × 1920 portrait, separately composed.
- Both are exactly 90 seconds at 24 fps, with stereo AAC audio.
- `hook-*.jpg` and `poster-*.jpg`: opening and closing stills.
- `storyboard-*.jpg`: twelve key story moments in each format.
- `share-caption.txt`: a ready-to-use caption; no publishing is performed.

## What changed

The first frame establishes the joke while a jointed Tex figure waves. A storm
turns the greeting into a problem. The Guard/hat exchange supplies the first
comic payoff; I-30 traffic and the Texas Star carry the local escalation.
The final coupon/corny-dog button gives the destruction a mundane motive.

The figure now has separate shoulders, elbows, hands, legs, head, and hat.
The hat, helicopter, wheel supports, rim, vehicles, and pylon move independently.
The portrait version relocates action below the text and reflows the title.
Its story copy is part of the artwork and remains readable without the audio;
it is not a transcription of the song's vocals.

47 shots follow prominent attacks in the supplied score. The main title lands
at **73.500 seconds**, the coupon button starts at about **79.92 seconds**, and
the final title begins at about **84.67 seconds** and stays through the last frame.
The final line is **KEEP YOUR CORNY DOG CLOSE.**

## Sound

The score excerpt is the original WAV's **49.92–139.92 second** passage, at
its original tempo. The source file is unchanged. `soundtrack-v03.wav` is a
new mix with eleven restrained, locally synthesized impact/swish effects,
reduced score level during the joke, and a 0.65-second audio endpoint fade.
There is no video fade to black. No voice model or external paid service is used.
`audio-mix.json` records the processing and effect cues.

## Local reference details

The fictional coupon and corny-dog jokes use details from the State Fair's
[coupon FAQ](https://bigtex.com/faqs/coupons/) and
[food page](https://bigtex.com/plan-your-visit/food/).
No current prices, actual emergency claims, cast credits, endorsement, or
release dates are invented.

## Edit and rebuild

- `art.cjs`: SVG loading, flat-ink drawing, jointed character, text, and props.
- `scenes.cjs`: both layouts and the action/comedy compositions.
- `timeline.json`: shot boundaries and detected attack evidence.
- `plan.cjs`: reproducible edit planner, using the saved 90-second hit analysis.
- `mix.py`: score mix and deterministic effects.
- `render.cjs`: stills and both video exports.

From the project root on this machine:

```sh
# Stills only.
node animation/v3/render.cjs

# Both full videos; overwrites only these v3 exports.
node animation/v3/render.cjs --render
```

The score mix already exists. To regenerate it after timing changes, run
`mix.py` with Python plus NumPy, then rerender. Canvas/font/FFmpeg runtime
settings follow the earlier animation README. Source SVGs and all earlier
video versions are preserved.
