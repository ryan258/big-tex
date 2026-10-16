# Vector Asset Specification & Geometry Catalog

## 1. Asset Philosophy & Standards

All visual assets in **Big Tex: Rewired** are authored with strict geometric constraints inspired by Saul Bass's iconic mid-century film title sequences:
- **Pure Vector Paths:** 100% SVG path and polygon geometry with zero embedded raster images, bitmaps, or foreign objects.
- **Uniform ViewBox:** All standalone icons and character puppets are authored in a standardized `viewBox="0 0 256 256"`.
- **Negative Space:** Cutouts are created using true geometric subtraction or even-odd fill rules (`fill-rule="evenodd"`) rather than white overlay masks, guaranteeing clean alpha transparency.
- **Zero External Dependencies:** No external stylesheets, font files, or JavaScript scripts are embedded within the SVG files. Accessible `<title>` and `<desc>` tags are included on all root elements.

---

## 2. Title Sequence Icon Set (`assets/title-sequence/`)

Authored via `assets/title-sequence/build_icons.py`, this 12-icon suite forms the core narrative symbology:

| ID | Title | Key Groups | Story Significance |
|---|---|---|---|
| `big-tex` | Big Tex | `#figure`, `#charge` | The 55-foot animatronic cowboy icon. |
| `cowboy-hat` | 95-Gallon Hat | `#hat`, `#hatband`, `#motion` | Dislodged hat used as a massive kinetic projectile. |
| `lightning` | The Ignition | `#bolt`, `#shock` | The anomalous plasma bolt that strikes Fair Park. |
| `ferris-wheel` | Texas Star | `#supports`, `#wheel`, `#gondolas`, `#hub`| Ferris wheel unseated and rolled down the Midway. |
| `corny-dog` | Last Corny Dog | `#stick`, `#batter`, `#mustard`, `#crumbs` | Iconic Fletcher's corny dog, motive for survival. |
| `power-tower` | Off the Cables | `#pylon`, `#snapped-lines` | Transmission pylon uprooted and wielded as cattle prod. |
| `cowboy-boot` | First Footfall | `#boot`, `#inlay` | Size-96 Lucchese boot shattering city pavement. |
| `steel-skull` | The Endoskeleton | `#skull`, `#eyes`, `#teeth` | Steel servos exposed beneath blistering fiberglass paint. |
| `electric-hand` | 400 Megawatts | `#hand`, `#cuff`, `#arcs` | High-voltage mechanical hand grasping the skyline. |
| `helicopter` | Apache Down | `#fuselage`, `#rotors`, `#tail`, `#strike`| Military aircraft swat out of the sky over Cotton Bowl. |
| `tank` | Sabot Deflection | `#hull`, `#treads`, `#turret`, `#spark` | National Guard armor firing ineffective rounds. |
| `dallas-skyline` | See Y'all Next Fall | `#skyline`, `#smoke`, `#spire` | Burning Dallas skyline silhouette at dawn. |

---

## 3. Bystander Character Set (`assets/bystanders/`)

The bystander cast populates the midway, streets, and foreground reactions. Authored via `assets/bystanders/build_bystanders.py`, each character provides articulated layer groups tagged with `data-part` and `data-pivot="x y"`:

### Character Roster
1. **Snack Protector (`snack-protector`):**
   - *Pose:* Crouched defensively over Fletcher's corny dog.
   - *Parts:* `#body`, `#head` (pivot `128 92`), `#arm-front` (pivot `114 116`), `#corny-dog`.
2. **Phone Filmer (`phone-filmer`):**
   - *Pose:* Standing tall, arm raised with phone recording disaster.
   - *Parts:* `#legs`, `#torso`, `#head` (pivot `122 74`), `#arm-phone` (pivot `108 102`, phone attached).
3. **Balloon Kid (`balloon-kid`):**
   - *Pose:* Toddler looking skyward with trailing fair balloon.
   - *Parts:* `#body`, `#head` (pivot `130 110`), `#arm-string` (pivot `118 126`), `#balloon` (pivot `92 48`).
4. **Stroller Parent (`stroller-parent`):**
   - *Pose:* Sprinting forward pushing two-wheeled stroller.
   - *Parts:* `#parent-legs`, `#parent-body`, `#stroller-frame`, `#wheel-front` (pivot `198 220`), `#wheel-rear` (pivot `156 222`).
5. **Family on the Move (`family-on-the-move`):**
   - *Pose:* Adult and young child fleeing in tandem.
   - *Parts:* `#adult-body`, `#adult-head` (pivot `96 68`), `#child-body`, `#child-head` (pivot `164 132`), `#joined-hands`.
6. **Corny Dog Vendor (`corny-dog-vendor`):**
   - *Pose:* Paper hat vendor behind stainless serving cart.
   - *Parts:* `#vendor`, `#cart-body`, `#cart-wheel` (pivot `132 216`), `#mustard-bottles`.
7. **Coupon Collector (`coupon-collector`):**
   - *Pose:* Fidgety fairgoer shielding thick coupon booklet.
   - *Parts:* `#body`, `#head` (pivot `126 80`), `#arm-coupons` (pivot `134 114`), `#coupons-fan`.
8. **Unbothered Local (`unbothered-local`):**
   - *Pose:* Arms folded, leaning against rail with mild skepticism.
   - *Parts:* `#legs`, `#torso`, `#folded-arms`, `#head` (pivot `124 76`, tilting gesture).
9. **Lost Tourist (`lost-tourist`):**
   - *Pose:* Panicked visitor shaking outsized folded paper map.
   - *Parts:* `#body`, `#head` (pivot `132 84`), `#map-left` (pivot `102 120`), `#map-right` (pivot `154 122`).
10. **The Runner (`runner`):**
    - *Pose:* Full sprint posture; baseball cap flying off head.
    - *Parts:* `#leg-front`, `#leg-back`, `#torso`, `#head` (pivot `138 88`), `#flying-cap` (pivot `142 66`).
11. **Rolling Out (`rolling-out`):**
    - *Pose:* Wheelchair athlete in aerodynamic propulsion tuck.
    - *Parts:* `#athlete-torso`, `#athlete-head` (pivot `144 104`), `#chair-frame`, `#drive-wheel` (pivot `112 188`, radius 42).
12. **Stuck on I-30 (`i30-driver`):**
    - *Pose:* Commuter behind steering wheel throwing arms up in exasperation.
    - *Parts:* `#car-body`, `#windshield`, `#driver-head` (pivot `130 96`), `#arm-gesture` (pivot `142 128`).

---

## 4. Color Palette Specifications

The asset system supports two calibrated color schemes:

### Classic Inks (`assets/bystanders/classic/` & `assets/title-sequence/`)
| Swatch | Hex Code | Purpose |
|---|---|---|
| **Black Ink** | `#191815` | Core silhouette bodies, structural outlines, mechanical boots. |
| **Outlaw Red** | `#C83E2D` | Electrical lightning charges, bandanas, hatbands, emergency alarms. |
| **Fair Mustard** | `#D5A326` | Fletcher's mustard, wheel hubs, vehicle headlights, electric sparks. |
| **Stock Paper** | `#F3E6CC` | Warm background stock, negative space cutouts. |

### Sun-Faded Texas (`assets/bystanders/icons/` & v3 Pipeline)
| Swatch | Hex Code | Purpose |
|---|---|---|
| **Petrol Blue** | `#103B46` | Deep shadowed silhouettes, text cards, urban horizons. |
| **Hot Coral** | `#E85A4F` | Explosions, glowing endoskeleton eyes, flashing hazard lights. |
| **Warm Cream** | `#F5E9CD` | High-contrast fairgoer cutouts on dark backgrounds. |
| **Faded Turquoise** | `#5BB5A6` | Faded sky wash, oxidized metal, retro fair midway tones. |

---

## 5. Rebuilding Vector Bundles

All vector files are compiled deterministically from Python source:

```sh
# Rebuild the 12 title sequence icons and sprite.svg:
python3 assets/title-sequence/build_icons.py

# Rebuild all 12 bystander characters across both color palettes:
python3 assets/bystanders/build_bystanders.py

# Verify manifest consistency:
cat assets/bystanders/animation-parts.json | jq '.characters | keys | length'
# Output should return 12
```
