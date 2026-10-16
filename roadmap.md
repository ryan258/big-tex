# Project Roadmap & Delivery Status: Big Tex: Rewired

This document is the central delivery and planning document for **Big Tex: Rewired** (*State Fair: Maximum Voltage*). It tracks completed engineering and artistic phases, active verification gates, and future production milestones.

---

## Delivery Matrix Overview

| Phase | Focus | Core Deliverables | Status | Next Milestone |
|---|---|---|---|---|
| **Phase 1** | **Concept & Screenplay** | 90s screenplay (`trailer--v0.1.md`), Suno music prompt & lyrics (`trailer--suno.md`), 139.92s source score | **Complete** | Full audio bed accepted |
| **Phase 2** | **Cut-Paper Vector System** | 12 title sequence icons (`assets/title-sequence/`), SVG sprite, contact sheet, geometry builder | **Complete** | Expanded icon variants |
| **Phase 3** | **Waveform-Synced Editorial** | v01 full score cut (139.92s), v02 90s hit cut (50 shots), v03 30s teaser (26 shots), spectral-flux onset detection | **Complete** | Integrated into v3 pipeline |
| **Phase 4** | **Character Rigging & v3 Demo** | Jointed Big Tex puppet (`art.cjs`), 47-shot widescreen and portrait edits (`scenes.cjs`), synthesized SFX mix (`mix.py`) | **Complete** | Multi-angle puppet poses |
| **Phase 5** | **Sun-Faded Texas Color Grade** | 33-point 3D LUT (`sun-faded-texas.cube`), turquoise/coral/cream/petrol palette (`palette.json`), 30s vertical teaser | **Complete** | Additional lighting LUTs |
| **Phase 6** | **Articulated Bystander Cast** | 12 bystander SVGs with pivots (`assets/bystanders/`), 55ft/6ft scale rule (`bystander-scale.cjs`), clockwise wheel physics, attack recoil mapping | **Complete** | Automated verification closed |
| **Phase 7** | **Sound Design & Foley Bed** | Spatialized crowd ambiances, physical midway calliope foley, Fair Park environmental reverb | **Planned** | Track lay & mix down |
| **Phase 8** | **Interactive Web Storyboard** | Lightweight HTML5/Canvas frame inspector, 1:1 vector previewer, shot scrubber | **Planned** | Responsive UI prototype |
| **Phase 9** | **Master Packaging & Distribution**| ProRes 422 HQ archive renders, social media cuts (TikTok/Reels/Shorts/X), metadata packages | **Planned** | Production handoff |

---

## Completed Phases in Detail

### Phase 1: Concept, Script & Outlaw Score
- **Treatment & Beat Sheet:** Authored 90-second screen treatment establishing the gritty sci-fi comedy tone (*Pacific Rim* meets *Terminator 2* with Dallas State Fair tropes).
- **Music Direction:** Crafted Suno v6-wild master prompt for authentic Texas red dirt outlaw country colliding with orchestral trailer brass and heavy industrial synthesizers.
- **Master Audio:** Sourced and cataloged `Hoooowdy, folks... Trailer Score (Epic Outlaw).wav` (139.92s, 44.1 kHz stereo master).

### Phase 2: Vector Art System & Title Sequence Icons
- **Cut-Paper Direction:** Created 12 original Saul Bass style cut-paper SVG silhouettes in `assets/title-sequence/icons/` with strict coordinate geometry (256×256 viewBox, zero raster embedding, accessible titles).
- **Automation:** Created `build_icons.py` using Python standard library to deterministically generate standalone SVGs and `sprite.svg`.

### Phase 3: Waveform-Synced Motion & Editorial Hit-Cuts
- **Onset Detection:** Implemented `analyze_score.py` and `analyze_90s.py` using NumPy/SciPy broadband and bass spectral-flux analysis to align cuts to musical attacks without manual grid snapping.
- **Editorial Iterations:**
  - `v01`: Full 139.92-second 18-scene title sequence (`render_sequence.cjs`).
  - `v02`: 90-second hit cut with 50 shots / 49 cuts, aligning the **REWIRED** title hit at 73.50s (`render_90s.cjs`).
  - `v03`: 30-second teaser with 26 shots, driving a 3-hit stinger into the title at 26.167s (`render_teaser.cjs`).

### Phase 4: Articulated Puppet Rigs & v3 Demo
- **Skeletal Big Tex:** Engineered multi-part vector puppet with independent shoulders, elbows, hands, legs, jaw, hat, and boots (`art.cjs`).
- **Independent Props:** Articulated helicopter rotors, transmission pylon power lines, Texas Star Ferris wheel rim/hub, and vehicle hulls.
- **Dual Formats:** Generated matched 90-second widescreen (1920×1080) and vertical (1080×1920) exports with custom typography positioning.
- **Audio Synthesis:** Layered 11 deterministic procedural sound effects (sub-bass rumbles, clanks, zaps, swishes) in `mix.py`.

### Phase 5: Sun-Faded Texas Color Grade
- **Color Science:** Replaced harsh mustard/black/red palette with a sun-bleached Texas aesthetic: faded turquoise (`#5BB5A6`), hot coral (`#E85A4F`), warm cream (`#F5E9CD`), and deep petrol blue (`#103B46`).
- **3D LUT:** Generated reusable 33-point `.cube` 3D LUT (`sun-faded-texas.cube`) via `palette.py`, applied consistently across still storyboards and video exports.

### Phase 6: Articulated Bystander Cast & Physical Staging
- **12-Character Cast:** Authored 12 distinct fairgoer figures with annotated pivot joints (`assets/bystanders/` and `animation-parts.json`).
- **Scale Anchor:** Established mathematical 55-foot Tex / 6-foot adult ratio ($9.17\times$ height multiplier) for full-figure shots, while allowing foreground depth scaling for reactions.
- **Wheel Rotation Physics:** Fixed counter-intuitive rolling motion; rotation is now strictly linked to signed translation distance ($\Delta \theta = \Delta x / r$).
- **Attack-Triggered Reactions:** Crowd gestures (flinching, crouching, pointing, running, clutching snacks) trigger dynamically on detected musical attacks.
- **Automated Verification:** Deployed `verify.py` asserting bit-identical audio preservation, container stream validity, motion metric consistency, and decoded contact sheets.

---

## Active Verification Evidence

The current repository state is validated by deterministic gates:
1. **Teaser Verification (`verify.py --teaser-only`):**
   - 30-second vertical bystander export (`big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4`): 23 sampled shots, bit-for-bit identical audio to parent cut.
2. **Full Trailer Verification (`verify.py`):**
   - 90-second widescreen & vertical bystander exports (`big-tex-rewired-90s-v03-bystanders*.mp4`): 47 sampled shots, bit-for-bit identical audio streams, protected title boundaries confirmed.
3. **Static Syntax Audits:**
   - 100% pass rate across Node.js (`node --check`) for all `.cjs` renderers.
   - 100% pass rate across Python (`python3 -m py_compile`) for all build and verification scripts.

---

## Planned Production Milestones

### Phase 7: Sound Design & Foley Bed
- [ ] Add spatialized crowd screams, midway laughter, and calliope carnival music under the calm opening section (0:00–0:15).
- [ ] Implement Fletcher's corny dog fryer sizzle and fair coupon rustling foley.
- [ ] Add concrete pavement cracking foley for the Size-96 Lucchese boot stomps.
- [ ] Master audio stems into separate dialogue/V.O., music, and SFX tracks.

### Phase 8: Interactive Web Storyboard
- [ ] Build lightweight responsive web viewer (`index.html`) using HTML5 Canvas.
- [ ] Interactive timeline scrubber allowing inspection of all 47 scene compositions.
- [ ] Toggleable overlays: character scale guides, pivot visualization, and attack markers.
- [ ] Dual-view player comparing widescreen and vertical phone compositions side-by-side.

### Phase 9: Master Packaging & Social Distribution
- [ ] Render ProRes 422 HQ master archives for theatrical/festival presentation.
- [ ] Prepare aspect-ratio-specific cut packages for YouTube (16:9), TikTok/Reels/Shorts (9:16), and X/Instagram feed (1:1).
- [ ] Generate promotional still packs with localized teaser copy and high-res contact sheets.
