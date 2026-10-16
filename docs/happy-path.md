# Happy path: from the idea to a reviewable trailer set

The shortest useful route is **premise → story beats → staged frames → short motion proof → full edit → format-specific cuts → targeted verification → editorial review**.

This guide describes how to reach the current Big Tex trailer baseline with less rework. It also gives the commands for reproducing the existing bystander versions. The fresh creative pass is currently at **critique**, before a new direction has been chosen.

## 1. Define the promise and the outputs

Start with a few sentences that answer:

- What ordinary situation changes? Here: **He was only supposed to wave.**
- What does Tex do, and what do the people want?
- What should someone remember after the trailer ends?
- Which moments establish danger, deliver the Texas humor, and finish the piece?

Choose whether a shot is a symbolic graphic or an event in a physical scene. Giant poster-like objects can work in a title sequence. People, props, eyelines, and ground planes need consistent staging when the same artwork tells a literal action story.

Set the deliverables once: a 90-second widescreen trailer, a separately composed 90-second vertical version, and a 30-second vertical teaser. The current exports use 24 fps, with selected character movement stepped at 12 fps. Keep the original score file intact.

An aim such as “viral in Texas” describes the intended response. Audience response remains unproven until people have seen the work.

## 2. Plan the story before selecting every cut

Write a compact beat sheet. Each beat should introduce something, cause an event, reveal a consequence, escalate the situation, or pay off a setup. Repeated eyes, boots, lightning, and marching need a new purpose each time they return.

Give recurring bystanders clear priorities. Filming, saving a snack, protecting coupons, and staying unimpressed are useful starting points. The full cast can populate the fair without every character needing equal screen time.

Place the jokes deliberately. Establish the setup, let the action read, and leave room for the reaction. A caption that announces the punchline before the action may weaken the gag. Decide where the ending lands before adding a closing montage or another title hold.

## 3. Prove staging, scale, and motion in a short sequence

Reuse the existing SVGs for a few rough frames. Check composition at actual phone size as well as on a desktop. Show where the action starts, what causes it, where it goes, and what changes afterward.

Use the shared scale model early. [Big Tex's 55-foot height](https://bigtex.com/about-us/big-tex/) is about 9.17 times a **six-foot reference adult**. That reference is a design choice, not a claim about average adult height. A shared ground plane, clear depth, and useful camera positions make the ratio understandable. Close reactions can use a foreground view; shrinking every person in a distant view can erase the performance.

Check prop attachment and continuity: a hat needs a readable release and flight; a wheel needs a visible cause for leaving its supports; its exit position should connect to the following shot. Wheeled objects should rotate in the direction of travel, with rotation derived from distance and radius.

Build one 15–20-second motion proof before a full export. It should demonstrate an action, its consequence, one readable human reaction, and the intended relationship to the score. The current full renderer has no short-range export flag; a bounded motion proof requires a small dedicated render path. Do not present that capability as an existing command.

## 4. Align events to the score

Use the saved attack evidence to find promising musical accents. Then mark the **visible event** that belongs on each accent: release, contact, footfall, breakage, or title arrival. Place anticipation before it and follow-through after it. A person's reaction can have a small delay appropriate to what they see.

The existing timeline JSON records shots and detected attacks. It does not contain a complete set of semantic contact or footfall markers. An attack-aligned shot start alone cannot prove that an impact is aligned.

For example, the current 30-second hat shot starts at about **8.333 seconds**, while its first debris appears around **9.042 seconds**. The animation uses progress through the shot to determine the fall and debris. Changing shot duration changes those event times. The cut's small error against its selected attack says nothing by itself about the later debris event.

Retime the action when making a shorter cut. Revisit the anticipation, contact, reaction, and recovery instead of relying on normalized shot progress to preserve their relationship to the music. Reuse the score analysis while the source audio remains unchanged.

## 5. Finish the master, then compose the other cuts

Review the 90-second structure for repetition and progression before generating all formats. A strong middle needs changing situations; extra cuts cannot supply a missing story beat.

Compose the portrait version for its frame. Keep text readable, faces and props distinct, and the main action visible. Check silhouette contrast against the actual moving background, including moments when a person overlaps Tex, a wheel spoke, or a building.

Give the 30-second teaser a clear promise of its own. Choose the moments it needs and leave out explanations that belong in the full trailer. If a brief specifies a lightning-first opening, check that the final cut still starts there. Check that action after a joke payoff serves the ending.

Use the same intended palette consistently. In the current bystander pipeline, classic SVG inks are rendered first and the shared color LUT is applied once. Rebuilding already treated SVG colors through that LUT would apply the treatment twice.

## 6. Reproduce the current exports

Run commands from the project root on this machine:

```sh
cd /Users/ryanjohnson/Projects/nonsense/big-tex
```

The local setup needs Node.js, `@napi-rs/canvas`, FFmpeg/FFprobe, the configured title font, and Python with Pillow for export verification. NumPy is needed for score analysis and mix regeneration. The source loaders already contain a fallback to the bundled Node library path on this machine; this is not a portable clean-checkout setup.

### Inputs already available at this baseline

| Input | Owning source |
|---|---|
| Original score | Project-root `Hoooowdy, folks... Trailer Score (Epic Outlaw).wav` |
| Base artwork and puppet | [art.cjs](../animation/v3/art.cjs), [scenes.cjs](../animation/v3/scenes.cjs), [title SVGs](../assets/title-sequence/icons/) |
| Bystander artwork and pivots | [classic SVGs](../assets/bystanders/classic/icons/), [part manifest](../assets/bystanders/classic/animation-parts.json) |
| Scale rule | [bystander-scale.cjs](../animation/v3/bystander-scale.cjs) |
| Edit timing | [90-second timeline](../animation/v3/timeline.json), [30-second timeline](../animation/v3/teaser-30s/timeline.json) |
| Palette treatment | [palette.json](../animation/v3/teaser-30s/palette.json), [sun-faded-texas.cube](../animation/v3/teaser-30s/sun-faded-texas.cube) |
| Audio parents | `animation/v3/big-tex-rewired-90s-v03.mp4`, its `-vertical.mp4` counterpart, and `animation/v3/teaser-30s/big-tex-rewired-v03-30s-vertical-teaser.mp4` |

**Preview first.** These commands rebuild stills and cue manifests, without encoding full videos:

```sh
node animation/v3/bystanders/render.cjs
node animation/v3/teaser-30s/bystanders/render.cjs
```

The 90-second renderer accepts `--wide-only` or `--vertical-only` for focused work. Inspect local files; a browser launch is unnecessary for these previews.

**Render once the edit and staging read clearly.** These commands overwrite the current bystander exports and their generated previews:

```sh
node animation/v3/bystanders/render.cjs --render
node animation/v3/teaser-30s/bystanders/render.cjs --render
```

The 90-second command writes both formats. Add `--video-only` to that command only when its stills and cue manifest already match the current source. These are full renders and may take several minutes. There is no need to run them for documentation edits.

The bystander renderers copy AAC audio from the older parent MP4s. Keep those parents available and unchanged when reproducing this baseline. A fresh checkout with missing parent media is not a one-command rebuild: recover the matching parents, or deliberately rebuild and review a new baseline. Regenerating parents can invalidate the verifier's pinned hashes. Investigate that mismatch rather than replacing hashes merely to obtain a pass.

A future simpler pipeline could use an explicit shared audio asset directly. That dependency change is not implemented by this guide.

## 7. Verify only what changed, then review the result

After new video exports, run the focused verifier with a Python environment that has Pillow:

```sh
python3 animation/v3/bystanders/verify.py
python3 animation/v3/bystanders/verify.py --teaser-only
```

If the system Python lacks Pillow, the existing bundled runtime on this machine can be used instead:

```sh
/Users/ryanjohnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 animation/v3/bystanders/verify.py
/Users/ryanjohnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 animation/v3/bystanders/verify.py --teaser-only
```

The current [verifier](../animation/v3/bystanders/verify.py) asserts duration, dimensions, frame count, codecs, start times, stereo audio, parent/audio equality, the pinned LUT, and selected source syntax. It records source and asset hashes and produces one decoded sample per shot plus wheel-motion strips.

Its limits matter:

- `motion-checks.json` is loaded as saved evidence; this command does **not** recompute its scale and wheel assertions. Changed motion models need fresh focused checks.
- Generated contact sheets need inspection. Their existence does not prove title clearance, contrast, continuity, or a readable gag at every frame.
- Recorded hashes identify files. Recording a hash is different from comparing it against an expected baseline.
- Cue timing and container checks do not establish impact timing, comic rhythm, audio intelligibility, or audience response.

For a rig change, check the affected joints and attached props. For motion, check the relevant wheel, contact, and ground relationship. For an edit, inspect the changed sequence and its neighboring cuts. For a documentation-only change, check its links and commands against the owning source. Broaden checks only when a failure or an unresolved concern warrants it.

Finish with local playback: once with sound for action, pacing, joke timing, and the score relationship; once without sound at phone size for story and readability. Record what was actually reviewed. Avoid full test suites, renewed score analysis, or repeated full renders when the relevant inputs have not changed.

## 8. Hand off a small, clear set

The current review set is:

| Cut | File |
|---|---|
| 90-second widescreen with bystanders | [big-tex-rewired-90s-v03-bystanders.mp4](../animation/v3/bystanders/big-tex-rewired-90s-v03-bystanders.mp4) |
| 90-second portrait with bystanders | [big-tex-rewired-90s-v03-bystanders-vertical.mp4](../animation/v3/bystanders/big-tex-rewired-90s-v03-bystanders-vertical.mp4) |
| Corrected 30-second portrait teaser | [big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4](../animation/v3/teaser-30s/bystanders/big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4) |

Return direct links, a short account of what changed, and the scope of the checks performed. Preserve earlier versions as references without requiring the viewer to search through them. Keep reusable commands in the repository so Ryan can ask for a preview, a current cut, or a focused correction with minimal input.

Reaching this baseline establishes a reproducible review set. The next creative direction follows from the critique and Ryan's choice.
