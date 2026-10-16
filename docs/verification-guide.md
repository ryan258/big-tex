# Automated Verification & Quality Assurance Guide

## 1. Quality Assurance Architecture

To guarantee broadcast and web video standards, **Big Tex: Rewired** employs an automated, headless verification runner located at `animation/v3/bystanders/verify.py`. The suite inspects rendered MP4 deliverables directly using `ffprobe`, `ffmpeg`, and Pillow.

---

## 2. Deterministic Verification Gates

The verification harness enforces six mandatory quality gates:

```
┌────────────────────────────────────────────────────────┐
│               verify.py Verification Flow              │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
   [ Stream Integrity ]         [ Audio Invariance ]
   • Codec: H.264 / AAC         • Demux ADTS stream
   • 24.0 fps (exact)           • Compute SHA-256
   • 0.0s start_time            • Match parent export
   • Duration == frames/24                 │
             │                             │
             └─────────────┬───────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
   [ Parent Hash Match ]       [ Decoded Frame Checks ]
   • Verify upstream v3        • Sample per-shot frames
   • Verify LUT & timeline     • Generate contact sheets
   • Check cast manifests      • Verify key moments
             │                             │
             └─────────────┬───────────────┘
                           │
                           ▼
               [ Syntax & Motion Checks ]
               • Node --check on .cjs
               • Motion metrics pass
               • Write verification.json
```

### 1. Container & Stream Integrity
- Validates container width and height ($1920\times 1080$ for widescreen, $1080\times 1920$ for portrait).
- Video stream must be encoded with `h264` codec at a constant frame rate of `24/1` fps.
- Audio stream must be 2-channel `aac`.
- Exact frame count: $90\text{ s} \times 24\text{ fps} = 2,160\text{ frames}$ (or $30\text{ s} \times 24\text{ fps} = 720\text{ frames}$).
- Stream start time must be exactly `0.000000` (zero A/V sync offset).

### 2. Audio Invariance Assertion
When bystanders or foreground graphics are composited over an existing render, the audio track must remain completely untouched. The verifier demuxes the raw audio stream:

```sh
ffmpeg -v error -i <VIDEO.mp4> -map 0:a:0 -c:a copy -f adts pipe:1 | sha256sum
```

The SHA-256 digest of the new ADTS stream is verified against the parent export. Any discrepancy aborts verification immediately.

### 3. Parent Dependency Hashes
The verifier binds the rendered output to specific upstream source commits by hashing:
- Parent video exports.
- `timeline.json` shot manifest.
- `sun-faded-texas.cube` color LUT.
- `animation-parts.json` bystander rigging schema.
- All standalone SVG icons in `assets/title-sequence/` and `assets/bystanders/`.

### 4. Decoded Frame Sampling & Contact Sheets
The runner samples a decoded video frame from every shot in the trailer and compiles high-resolution contact sheets (`decoded-wide-*.jpg`, `decoded-vertical-*.jpg`). Specific key moments are checked and saved:
- `decoded-hook-*`: Establishing frame showing Big Tex and crowd.
- `decoded-traffic-punch-*`: Freeway gridlock escalation.
- `decoded-coupons-*`: State Fair ticket preservation.
- `decoded-corny-dog-*`: Climax snack button.
- `decoded-end-title-*`: Verified clear title screen.

### 5. Kinematic Wheel Motion Checks
Four discrete time samples across rolling scenes (`wheel-motion-*.jpg`) capture consecutive wheel positions to verify clockwise rotation and distance proportionality.

---

## 3. Running Verification Gates

### Run Full 90-Second Trailer Verification
```sh
python3 animation/v3/bystanders/verify.py
```

*Expected Terminal Output:*
```json
{
  "duration": 90,
  "files": [
    "big-tex-rewired-90s-v03-bystanders.mp4",
    "big-tex-rewired-90s-v03-bystanders-vertical.mp4"
  ],
  "sampled_frames_per_export": 47,
  "audio_identical": true
}
```

### Run 30-Second Teaser Verification
```sh
python3 animation/v3/bystanders/verify.py --teaser-only
```

*Expected Terminal Output:*
```json
{
  "duration": 30,
  "files": [
    "big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4"
  ],
  "sampled_frames_per_export": 23,
  "audio_identical": true
}
```

### Run Static Syntax Checks
```sh
# Check all JavaScript/Node modules:
for f in $(find animation assets -name "*.cjs"); do node --check "$f" || exit 1; done

# Check all Python modules:
for f in $(find animation assets -name "*.py"); do python3 -m py_compile "$f" || exit 1; done
```
