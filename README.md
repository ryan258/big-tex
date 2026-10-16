# Big Tex: Rewired (State Fair: Maximum Voltage)

> **Premise:** *He was only supposed to wave.*

**Big Tex: Rewired** is a multimedia Texas monster-comedy trailer and animated cut-paper title sequence project. Conceived as *Pacific Rim* meets *Terminator 2* through the lens of Dallas folklore, the story follows the catastrophic awakening of Fair Park's iconic 55-foot animatronic cowboy after a freak lightning strike fuses his servos with the Texas power grid.

The repository houses the screen treatments, audio prompts, original vector artwork libraries, procedural cut-paper renderers, timing analysis engines, color look-up tables (LUTs), and an articulated bystander animation system.

---

## Quick Navigation

- [Project Architecture](#project-architecture)
- [Video Versions & Deliverables](#video-versions--deliverables)
- [Asset Catalog](#asset-catalog)
- [Animation & Rendering Pipeline](#animation--rendering-pipeline)
- [Verification & Quality Gates](#verification--quality-gates)
- [Roadmap & Milestone Status](roadmap.md)
- [Detailed Technical Documentation](docs/overview.md)

---

## Project Architecture

```
big-tex/
├── trailer--v0.1.md                  # 90-second screenplay & treatment
├── trailer--suno.md                  # Suno v6-wild master prompt, style & lyrics
├── assets/
│   ├── title-sequence/               # 12 Saul Bass cut-paper SVGs & sprite
│   │   ├── icons/                    # Standalone 256x256 vector icons
│   │   ├── build_icons.py            # Deterministic standard-library icon builder
│   │   ├── contact-sheet.svg         # Overview sheet of icons
│   │   ├── sprite.svg                # Master symbol sprite
│   │   └── README.md
│   └── bystanders/                   # 12 original bystander character SVGs
│       ├── icons/                    # Sun-faded palette SVGs (turquoise/coral/petrol)
│       ├── classic/                  # Classic palette SVGs (black/red/gold)
│       ├── animation-parts.json      # Part names, draw orders, and pivot coordinates
│       ├── build_bystanders.py       # Geometry builder for bystander cast
│       ├── palette.json              # Shared ink color definitions
│       └── README.md
├── animation/
│   ├── render_sequence.cjs           # v01 full 139.92s title sequence renderer
│   ├── render_90s.cjs                # v02 90s hit-cut renderer
│   ├── render_teaser.cjs             # v03 30s teaser renderer
│   ├── analyze_score.py              # Waveform attack & timing analysis
│   ├── analyze_90s.py                # 90s spectral-flux cut planner
│   ├── plan_teaser.cjs               # 30s teaser hit alignment planner
│   └── v3/                           # Jointed puppet, audio mix, and bystander pipeline
│       ├── art.cjs                   # Jointed Big Tex puppet & vector drawing
│       ├── scenes.cjs                # 47-shot staging, comedy cards & rolling physics
│       ├── plan.cjs                  # Edit planner using waveform hit evidence
│       ├── mix.py                    # 90s audio mix & synthesized sound effects
│       ├── bystander-scale.cjs       # 55-foot Tex / 6-foot adult scale calculator
│       ├── teaser-30s/               # 30-second vertical teaser cut
│       │   ├── sun-faded-texas.cube  # 33-point 3D color LUT
│       │   ├── palette.json          # Color grading swatch definitions
│       │   ├── mix.py                # 30s retimed audio mix
│       │   ├── render.cjs            # 30s vertical teaser renderer
│       │   └── bystanders/           # Articulated bystanders for 30s teaser
│       │       ├── cast.cjs          # Puppet joint loading & gesture triggers
│       │       ├── reactions.cjs     # Placement & attack cue timing
│       │       ├── render.cjs        # 30s bystander teaser renderer
│       │       └── verification.json # Export hashes & probe assertions
│       └── bystanders/               # Full 90s trailer bystander integration
│           ├── reactions.cjs         # 47-shot bystander staging & cue engine
│           ├── render.cjs            # 90s wide & vertical bystander video renderer
│           ├── verify.py             # Automated verification & contact sheet generator
│           ├── motion-checks.json    # Wheel rotation & articulation metrics
│           └── verification.json     # Decoded frame checks & stream parity
├── docs/                             # In-depth architectural & operational guides
│   ├── overview.md                   # System overview & technical stack
│   ├── animation-pipeline.md         # Rendering, timing extraction, and audio mix
│   ├── asset-spec.md                 # Vector artwork specifications and part rigs
│   ├── bystander-scale-and-physics.md# Scale rules, wheel physics, and cue systems
│   └── verification-guide.md         # Automated regression and verification suite
└── roadmap.md                        # Phased delivery status and future milestones
```

---

## Video Versions & Deliverables

All videos are rendered using local headless canvas drawing, composited with FFmpeg at 24 fps with stepped 12 fps animation, and bound to the score soundtrack:

| Deliverable | Duration | Resolution | Aspect | Audio | Key Features |
|---|---|---|---|---|---|
| **v01 Title Sequence** | 139.92s | 1920×1080 | 16:9 | 320 kbps AAC | Full 18-scene sequence covering entire score; Saul Bass typography; print grain. |
| **v02 Hit Cut** | 90.00s | 1920×1080 | 16:9 | 320 kbps AAC | 50 shots / 49 cuts; waveform-prominence edit; 49.92–139.92s score excerpt. |
| **v03 Teaser** | 30.00s | 1920×1080 | 16:9 | 320 kbps AAC | 26 shots; high-voltage opening; **OFF THE CABLES** card; 97.235–127.235s score. |
| **v03 Demo (Wide)** | 90.00s | 1920×1080 | 16:9 | Mixed AAC | 47 shots; jointed Big Tex puppet; local sound effects; Texas comedy cards. |
| **v03 Demo (Vertical)** | 90.00s | 1080×1920 | 9:16 | Mixed AAC | Recomposed portrait layout; phone-optimized typography; independent staging. |
| **v03 Teaser Vertical** | 30.00s | 1080×1920 | 9:16 | Mixed AAC | Sun-faded Texas 3D LUT; joke card sequencing; 23 shots; corny dog stinger. |
| **v03 Teaser + Bystanders** | 30.00s | 1080×1920 | 9:16 | Parent AAC | 12 articulated bystanders; reaction cues; corrected clockwise wheel rotation. |
| **v03 90s + Bystanders (Wide)** | 90.00s | 1920×1080 | 16:9 | Parent AAC | Full 47-shot crowd integration; 55ft/6ft scale rule; attack-triggered gestures. |
| **v03 90s + Bystanders (Vert)**| 90.00s | 1080×1920 | 9:16 | Parent AAC | Recomposed foreground crowds; protected title intervals; verified audio parity. |

---

## Asset Catalog

### 1. Title Sequence Icons (`assets/title-sequence/`)
Twelve 256×256 viewBox cut-paper SVG silhouettes authored with transparent cutouts and zero embedded bitmaps:
1. `big-tex`: Looming angular cowboy figure with split red face.
2. `cowboy-hat`: 95-gallon hat with buckled crown and tilted brim.
3. `lightning`: Broken-edge ignition lightning bolt.
4. `ferris-wheel`: Texas Star wheel with splayed supports and gondolas.
5. `corny-dog`: Fletcher's corny dog with zigzag mustard stripe.
6. `power-tower`: High-voltage electrical transmission pylon.
7. `cowboy-boot`: Size-96 Lucchese boot shattering pavement.
8. `steel-skull`: Exposed fused endoskeleton beneath fiberglass.
9. `electric-hand`: Arcing high-voltage mechanical hand.
10. `helicopter`: Apache military helicopter circling Cotton Bowl.
11. `tank`: National Guard armored tank with sabot turret.
12. `dallas-skyline`: Downtown Dallas skyline in flames.

### 2. Innocent Bystanders (`assets/bystanders/`)
Twelve articulated character SVGs built with isolated body parts and annotated pivot points (`data-part`, `data-pivot`):
1. `snack-protector`: Shelters a Fletcher's corny dog from shockwaves.
2. `phone-filmer`: Records the destruction on smartphone; recoils on impact.
3. `balloon-kid`: Holds State Fair balloon; looks upward in shock.
4. `stroller-parent`: Pushes baby stroller with rolling wheels away from danger.
5. `family-on-the-move`: Parent and child running hand-in-hand.
6. `corny-dog-vendor`: Unfazed vendor serving from a wheeled cart.
7. `coupon-collector`: Clutches a fan of food coupons to chest.
8. `unbothered-local`: Classic Dallas local watching with dry amusement.
9. `lost-tourist`: Disoriented visitor shaking a giant paper map.
10. `runner`: Fairgoer sprinting as baseball cap flies off.
11. `rolling-out`: Wheelchair athlete rolling across foreground with dynamic wheel turns.
12. `i30-driver`: Commuter throwing up hands in gridlocked freeway traffic.

---

## Animation & Rendering Pipeline

The rendering stack runs entirely locally with zero external network or paid API dependencies:

1. **Geometry Engine**: Authored SVG parts parsed via `@napi-rs/canvas`.
2. **Audio & Timing Analysis**: NumPy spectral-flux onset detection (`scipy`/`numpy`) extracts attack timestamps from `Hoooowdy, folks... Trailer Score (Epic Outlaw).wav`.
3. **Sound Design**: Deterministic synthesis of sub-bass rumbles, mechanical clanks, electric zaps, and swishes via `mix.py`.
4. **Color Treatment**: Custom 33-point `.cube` 3D LUT transforming flat vector inks into sun-bleached Texas carnival tones (faded turquoise, hot coral, warm cream, deep petrol blue).
5. **Compositing**: FFmpeg compiles 24 fps H.264 video with AAC stereo audio.

### Common Build Commands

```sh
# Verify exports, probe streams, and generate decoded contact sheets:
python3 animation/v3/bystanders/verify.py

# Run verification for the 30-second teaser cut:
python3 animation/v3/bystanders/verify.py --teaser-only

# Rebuild SVG bystander assets and contact sheets:
python3 assets/bystanders/build_bystanders.py

# Rebuild title sequence SVG icons:
python3 assets/title-sequence/build_icons.py

# Re-render 90-second bystander trailer videos:
node animation/v3/bystanders/render.cjs --render

# Re-render 30-second vertical teaser with bystanders:
node animation/v3/teaser-30s/bystanders/render.cjs --render
```

---

## Verification & Quality Gates

The project enforces automated deterministic verification across all video exports:
- **Stream Integrity**: Validates container duration, 24.0 fps frame rate, exact frame counts, zero start-time offsets, and H.264/AAC codecs.
- **Audio Invariance**: Bit-for-bit SHA-256 validation of demuxed ADTS audio streams ensures bystander passes never alter sound mixes.
- **Scale Correctness**: Big Tex is anchored at 55 feet tall; adult bystanders scale to $\approx 10.9\%$ ($1 / 9.17$) of Big Tex's hat-to-sole height in full-figure shots.
- **Wheel Physics**: The Texas Star wheel and mobile vehicle wheels rotate strictly in accordance with signed translation distance ($\theta = d / r$).
- **Protected Intervals**: Verified silence of crowd foreground elements during main title cards (e.g. 73.500–76.875s and 84.667–90.000s in the 90s cut).
