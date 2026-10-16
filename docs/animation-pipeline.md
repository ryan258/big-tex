# Animation Pipeline & Rendering Mechanics

## 1. Overview

The animation pipeline in **Big Tex: Rewired** combines algorithmic audio onset detection with cut-paper vector rendering. Artwork moves with the tactile, stepped cadence of traditional paper stop-motion (12 fps steps) within a broadcast 24 fps container, synchronizing cuts and kinetic accents to detected peaks in the outlaw country soundtrack.

---

## 2. Audio Analysis & Edit Planning

Rather than relying on arbitrary BPM grids or manual keyframe estimation, all cut points and visual impacts are driven by waveform analysis:

### Spectral-Flux Onset Detection (`analyze_score.py`, `analyze_90s.py`)
1. **Short-Time Fourier Transform (STFT):** Converts the 44.1 kHz 16-bit uncompressed audio into time-frequency spectrograms.
2. **Frequency Band Separation:**
   - **Bass Flux:** Low-frequency band (20 Hz – 250 Hz) isolates heavy drum kicks, boot stomps, and sub-bass drops.
   - **Broadband Flux:** Full-spectrum flux tracks snare slaps, guitar slides, brass stabs, and vocal attacks.
3. **Peak Detection:** Local spectral-flux peaks are ranked by prominence. Detected hits are mapped to the nearest video frame boundary at 24.0 fps.
4. **Frame Error Minimization:** The difference between exact audio attack time and video frame presentation time is recorded in `timeline.json` or `timing-*.json`. The maximum synchronization error is bounded to $\le \frac{1}{48}\text{ s} \approx 20.83\text{ ms}$.

---

## 3. Sound Design & Mixing (`mix.py`)

The score is supplemented by locally synthesized, deterministic sound effects that punctuate the action without obscuring the outlaw vocal delivery:

### 90-Second Mix (`animation/v3/mix.py`)
- **Score Excerpt:** Windowed between **49.920s and 139.920s** of the master WAV.
- **Audio Attenuation:** Score volume dips dynamically during dialogue and comedy joke cards (e.g. coupon button at 79.92s) and returns for the finale.
- **Procedural Foley Elements:**
  - *Sub-Bass Drops:* Decaying 35–45 Hz sine sweeps layered under boot stomps and lightning strikes.
  - *Metallic Clanks:* High-frequency ring-modulated impulse bursts simulating shearing anchor bolts.
  - *Electric Arcs:* Bandpass-filtered white noise bursts synchronized to lightning and pylon snaps.
  - *Kinetic Swishes:* Shaped pink noise sweeps matching hat throws and rolling wheels.
- **Mastering & Headroom:** Output is normalized with a 0.65-second smooth outro fade; audio is exported to 16-bit 44.1 kHz stereo `soundtrack-v03.wav`.

---

## 4. Vector Geometry & Rigging (`art.cjs`, `cast.cjs`)

Character art and scene assets are parsed from SVG vector paths and transformed dynamically in Node.js canvas:

```
                [ Hat ]
                   │
                [ Head ]
                   │
           ┌───[ Torso ]───┐
           │       │       │
    [ Left Arm ]   │   [ Right Arm ]
    (Shoulder)     │   (Shoulder)
         │         │       │
      (Elbow)      │    (Elbow)
         │         │       │
      (Hand)       │    (Hand)
                   │
             ┌─────┴─────┐
             │           │
       [ Left Leg ] [ Right Leg ]
         (Thigh)       (Thigh)
            │             │
         (Shin)        (Shin)
            │             │
         (Boot)        (Boot)
```

- **Independent Articulation:** Big Tex's puppet possesses independent rotation and translation for shoulders, elbows, wrists, hips, knees, jaw, and hat.
- **Stepped Movement (12 fps inside 24 fps):** Transformations update on even frames ($\text{frame} \pmod 2 == 0$), preserving the hand-animated cut-paper feel while maintaining smooth 24 fps camera cuts and fades.
- **Surface Texture:** A deterministic pseudo-random noise filter applies subtle paper fiber grain to all rendered ink regions, simulating vintage letterpress and lithograph prints.

---

## 5. Color Treatment & 3D LUT (`sun-faded-texas.cube`)

To evoke a sun-bleached Dallas carnival atmosphere, the primary vector inks are mapped through a 33-point 3D Look-Up Table (LUT):

```
Primary Inks:                     Sun-Faded Texas Output:
Mustard (#D5A326)     ───────►    Warm Cream (#F5E9CD)
Red (#C83E2D)         ───────►    Hot Coral (#E85A4F)
Black (#191815)       ───────►    Deep Petrol Blue (#103B46)
Background (#F3E6CC)  ───────►    Faded Turquoise (#5BB5A6)
```

The LUT is generated via `palette.py` and exported as `sun-faded-texas.cube`. During video rendering, colors are sampled either via pre-transformed vector paths or hardware-accelerated pixel shaders, ensuring identical color reproduction across still storyboards and MP4 deliverables.

---

## 6. FFmpeg Encoding Specification

Frames rendered in Node.js are piped directly to FFmpeg via standard input to eliminate disk write bottlenecks:

```sh
ffmpeg -y -v error \
  -f image2pipe -r 24 -vcodec mjpeg -i pipe:0 \
  -i <AUDIO_TRACK> \
  -c:v libx264 -pix_fmt yuv420p -preset slow -crf 18 \
  -c:a aac -b:a 320k -ar 44100 \
  -shortest <OUTPUT_FILE>.mp4
```

- **Video Parameters:** 1920×1080 (widescreen) or 1080×1920 (vertical); 24.0 fps; H.264 High profile; YUV 4:2:0 chroma subsampling; CRF 18 visually lossless.
- **Audio Parameters:** Stereo AAC; 320 kbps bit rate; 44.1 kHz sample rate; exact time alignment with zero start-offset drift.
