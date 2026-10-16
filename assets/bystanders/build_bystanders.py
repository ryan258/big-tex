"""Hand-authored, editable vector cast for the Big Tex cut-paper world."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parent
PALETTES = {
    'sun-faded': dict(ink='#103B46', red='#E64F39', accent='#4CB7AD', paper='#F5E9CD'),
    'classic': dict(ink='#191815', red='#C83E2D', accent='#D5A326', paper='#F3E6CC'),
}
I, R, A = '@ink@', '@red@', '@accent@'


def path(d, color=I, holes=False):
    rule = ' fill-rule="evenodd"' if holes else ''
    return f'<path d="{d}" fill="{color}"{rule}/>'


def part(name, pivot, *shapes):
    return dict(name=name, pivot=pivot, shapes=''.join(shapes))


CAST = [
 ('snack-protector', 'Snack protector', 'A fairgoer looks up while sheltering a corny dog with both arms.', [
  part('leg-left', [108,169], path('M99 162 118 169 110 205 86 232 64 232 70 219 88 210Z')),
  part('leg-right', [132,169], path('M119 165 141 160 153 194 171 215 193 222 189 234 157 233 133 209Z')),
  part('torso', [118,113], path('M99 98 135 99 150 126 145 174 93 176 86 138Z', A)),
  part('head', [116,95], path('M100 56 126 52 141 70 137 91 120 104 101 94 94 75ZM107 73 114 70 115 77 107 80ZM124 69 132 68 130 76 124 77ZM118 86 126 83 126 92 119 94Z', I, True)),
  part('arm-left', [96,114], path('M88 108 101 115 86 140 113 151 109 165 67 146 69 133Z')),
  part('arm-right', [139,115], path('M134 106 148 111 165 141 141 165 129 155 145 137Z')),
  part('corny-dog', [121,153], path('M114 125 122 126 124 173 116 176Z'), path('M108 98 118 91 130 96 134 110 131 139 121 147 109 142 105 128Z', R), path('M114 104 124 101 119 114 126 116 117 133 112 129 118 118 111 116Z', A)),
  part('hands', [122,153], path('M104 148 119 144 125 153 116 164 105 163ZM131 149 143 144 150 153 141 166 132 163Z')),
 ]),
 ('phone-filmer', 'Phone filmer', 'A fairgoer plants their feet and holds a phone high to film the towering cowboy.', [
  part('leg-left', [108,168], path('M98 164 119 170 104 213 96 233 68 234 65 223 83 215Z')),
  part('leg-right', [133,169], path('M123 166 144 164 155 216 176 223 173 235 142 234 135 211Z')),
  part('torso', [120,108], path('M101 99 136 96 148 127 142 177 92 176 89 128Z', A), path('M109 121 131 118 136 133 112 137Z', R)),
  part('arm-far', [100,110], path('M92 104 105 113 91 146 105 159 94 171 74 148 77 130Z')),
  part('head', [120,96], path('M103 53 128 48 143 62 141 85 124 103 103 93 96 73ZM110 66 117 64 117 72 110 74ZM126 62 134 60 134 69 127 70ZM119 82 129 79 129 88 120 91Z', I, True)),
  part('arm-raised', [139,111], path('M135 101 149 104 169 84 172 56 187 58 185 91 153 128 143 123Z')),
  part('phone', [181,62], path('M166 26 194 23 199 66 171 69ZM174 34 188 32 192 56 177 59Z', I, True), path('M178 27 185 26 186 30 179 31Z', R)),
  part('hand', [179,64], path('M169 58 182 54 191 61 185 75 174 77Z')),
 ]),
 ('balloon-kid', 'Balloon kid', 'A child leans back, holds a star-cutout balloon, and points up at the commotion.', [
  part('balloon', [181,88], path('M160 20 187 16 210 29 220 52 215 77 193 94 168 91 150 72 147 44ZM181 34 187 48 203 48 191 59 195 76 181 67 167 76 170 60 158 50 175 47Z', R, True), path('M186 90 192 102 177 101Z', R)),
  part('string', [154,143], path('M184 98 188 99 179 117 185 131 163 145 155 161 151 159 160 142 180 129 175 116Z')),
  part('leg-left', [99,189], path('M89 182 107 188 97 220 80 235 60 235 60 226 77 217Z')),
  part('leg-right', [115,190], path('M105 186 124 184 132 221 148 227 146 236 124 236 116 219Z')),
  part('torso', [104,151], path('M90 142 118 141 130 164 123 194 85 193 79 167Z', A)),
  part('arm-left', [84,158], path('M79 151 90 157 72 175 55 172 53 160 64 160Z')),
  part('arm-right', [123,155], path('M119 148 128 150 144 131 154 132 157 142 135 166 123 168Z')),
  part('head', [105,143], path('M91 107 111 102 126 115 123 134 108 148 91 138 85 121ZM98 117 105 114 105 121 99 123ZM113 114 119 113 119 120 114 122ZM106 130 114 127 113 137 107 139Z', I, True)),
  part('cap', [105,111], path('M87 109 93 98 111 96 123 105 136 105 139 113 90 117Z', R)),
 ]),
 ('stroller-parent', 'Stroller parent', 'A parent moves briskly while pushing a stroller with a raised canopy.', [
  part('leg-left', [84,171], path('M74 164 93 171 79 211 66 231 42 232 42 222 59 216Z')),
  part('leg-right', [104,170], path('M95 165 114 163 126 205 145 221 144 232 125 234 108 217Z')),
  part('torso', [93,109], path('M76 100 107 97 121 127 111 175 66 174 64 134Z', R)),
  part('head', [95,98], path('M78 55 102 50 118 64 115 87 98 104 78 94 72 74ZM85 70 92 67 93 75 85 77ZM101 66 108 64 109 73 101 75ZM93 86 104 83 103 91 94 94Z', I, True)),
  part('arm-back', [74,113], path('M67 105 80 112 65 142 72 157 61 164 48 143 54 123Z')),
  part('arm-push', [112,116], path('M106 108 119 111 131 132 159 139 156 152 122 147 104 126Z')),
  part('stroller-frame', [185,191], path('M153 139 166 139 184 199 220 202 219 213 175 210 158 152 146 151Z'), path('M172 194 211 167 218 176 182 204Z')),
  part('canopy', [197,160], path('M165 164 177 133 202 130 225 146 230 174 207 179 184 175Z', A), path('M182 140 200 137 219 151 222 162 204 151Z', R)),
  part('blanket', [192,182], path('M163 165 183 177 228 170 221 192 179 198 166 185Z', R)),
  part('wheel-rear', [178,220], path('M168 209 181 205 191 213 191 224 182 233 171 230 164 221ZM173 216 178 213 184 218 182 224 176 224Z', I, True)),
  part('wheel-front', [221,218], path('M214 209 225 208 234 216 230 228 218 232 210 223ZM218 216 224 215 227 220 222 225 217 222Z', I, True)),
 ]),
 ('family-on-the-move', 'Family on the move', 'An adult and child hurry together, holding hands and looking back.', [
  part('adult-leg-left', [88,154], path('M76 148 96 155 84 195 63 224 43 227 39 216 56 209 68 182Z')),
  part('adult-leg-right', [104,155], path('M96 150 116 146 130 180 117 213 130 220 128 231 105 231 98 214 109 181Z')),
  part('adult-torso', [96,102], path('M78 91 108 88 125 114 115 160 69 159 65 124Z', R)),
  part('adult-arm-back', [73,108], path('M64 98 78 105 56 128 43 119 33 93 45 86 52 106Z')),
  part('adult-head', [95,92], path('M76 47 101 44 118 60 113 83 95 97 75 86 68 65ZM78 62 86 59 86 67 79 69ZM95 58 103 56 103 64 97 67ZM89 78 100 74 99 84 91 88Z', I, True)),
  part('child-leg-left', [164,184], path('M155 180 172 183 160 208 145 230 129 232 128 223 143 215Z')),
  part('child-leg-right', [179,185], path('M171 180 188 180 201 209 215 218 212 230 192 224 182 208Z')),
  part('child-torso', [170,148], path('M156 139 179 135 193 154 190 186 148 190 144 161Z', A)),
  part('child-arm-free', [187,154], path('M179 145 191 145 208 166 221 166 225 177 204 184 184 169Z')),
  part('joined-hands', [133,146], path('M111 101 126 103 139 130 155 145 150 155 128 145 116 126Z'), path('M150 143 161 149 146 165 133 157 127 146 135 138Z')),
  part('child-head', [167,140], path('M151 105 173 102 187 116 184 135 169 146 153 138 145 122ZM153 116 160 113 162 120 156 123ZM171 112 178 112 179 120 173 122Z', I, True)),
 ]),
 ('corny-dog-vendor', 'Corny dog vendor', 'A vendor in a paper hat holds up a corny dog from behind a small wheeled cart.', [
  part('head', [130,89], path('M114 48 138 45 152 60 149 81 133 94 113 84 106 65ZM116 61 123 59 124 66 117 68ZM134 58 141 57 142 64 136 67ZM127 76 139 74 137 81 129 84Z', I, True)),
  part('paper-hat', [130,53], path('M106 43 119 33 133 39 150 31 156 51 108 58Z', A)),
  part('torso', [131,105], path('M112 91 146 89 161 119 151 159 107 161 96 126Z')),
  part('apron', [132,112], path('M116 98 124 97 124 114 142 111 141 94 149 96 153 154 112 155Z', R)),
  part('arm-serve', [109,110], path('M103 100 116 107 95 132 66 120 70 107 90 114Z')),
  part('arm-right', [151,108], path('M146 99 159 105 178 132 171 153 158 149 162 135Z')),
  part('corny-dog', [65,114], path('M61 94 67 94 70 128 63 128Z'), path('M51 68 60 61 71 65 77 78 75 103 67 111 54 105 49 90Z', R), path('M57 75 65 70 62 83 68 84 61 99 57 95 62 85 55 85Z', A)),
  part('cart', [144,170], path('M65 144 215 138 221 193 71 204Z', A), path('M58 139 220 133 225 145 60 151Z'), path('M90 159 195 153 196 162 91 169Z', R)),
  part('cart-handle', [215,152], path('M211 143 230 143 238 160 230 165 224 153 214 154Z')),
  part('wheel-left', [94,218], path('M80 209 91 202 105 208 111 221 102 232 88 234 77 222ZM88 215 95 212 102 219 97 225 90 224Z', I, True)),
  part('wheel-right', [194,213], path('M181 203 195 200 208 209 208 221 198 230 185 228 177 217ZM188 210 195 209 201 215 196 222 189 220Z', I, True)),
 ]),
 ('coupon-collector', 'Coupon collector', 'A fairgoer keeps a fistful of coupons safe while looking up in alarm.', [
  part('leg-left', [110,169], path('M99 163 119 170 102 211 88 233 62 234 60 224 80 216Z')),
  part('leg-right', [135,169], path('M123 166 145 163 155 212 174 223 171 235 144 233 133 211Z')),
  part('torso', [122,109], path('M100 98 136 94 150 123 145 177 92 178 86 135Z', A)),
  part('head', [119,98], path('M104 54 128 49 143 64 139 86 122 104 101 94 96 72ZM107 68 115 64 116 73 108 76ZM125 63 133 62 132 71 125 74ZM119 84 128 80 129 91 121 94Z', I, True)),
  part('arm-left', [96,115], path('M89 108 103 116 89 145 108 154 103 168 70 151 75 132Z')),
  part('arm-right', [141,114], path('M134 105 149 110 163 132 184 119 193 131 162 153 150 148Z')),
  part('tickets', [184,125], path('M177 115 163 70 180 64 193 108 197 62 215 65 210 113 231 84 242 95 212 136 193 144Z', R), path('M171 77 181 75 183 82 174 85ZM199 73 209 74 208 82 198 82ZM225 94 231 99 226 106 219 101Z', I), path('M180 111 189 109 194 137 186 141Z', A)),
  part('hand', [187,136], path('M177 126 193 121 202 131 197 145 183 150 175 140Z')),
 ]),
 ('unbothered-local', 'Unbothered local', 'A calm fairgoer with glasses, a handbag, and folded arms watches the trouble.', [
  part('leg-left', [112,185], path('M103 176 119 178 116 219 104 231 83 232 83 222 98 218Z')),
  part('leg-right', [135,185], path('M126 178 143 177 148 219 167 225 165 234 141 233 133 219Z')),
  part('body', [123,114], path('M101 99 142 98 153 125 164 192 86 193 93 136Z', A)),
  part('hair', [125,69], path('M98 49 105 36 120 34 127 27 141 33 153 48 151 67 138 72 105 70 93 61Z', R)),
  part('head', [124,100], path('M105 54 140 51 149 70 143 94 125 107 105 95 98 76ZM104 70 118 68 119 78 107 80ZM127 67 142 66 139 77 128 78ZM116 91 135 89 134 94 118 96Z', I, True)),
  part('glasses-bridge', [124,75], path('M117 70 130 68 131 74 118 76Z')),
  part('arm-left', [101,119], path('M94 112 106 119 111 142 143 135 148 149 105 160 92 143Z')),
  part('arm-right', [144,118], path('M139 108 152 116 159 141 121 154 116 141 142 132Z')),
  part('handbag', [80,176], path('M67 165 97 163 101 201 65 205 60 180ZM70 168 70 153 79 147 88 151 93 166 86 168 83 156 76 156 76 168Z', R, True)),
 ]),
 ('lost-tourist', 'Lost tourist', 'A visitor in a broad hat unfolds a large map while looking the wrong way.', [
  part('leg-left', [111,178], path('M99 170 119 177 107 215 90 234 65 234 63 223 82 216Z')),
  part('leg-right', [136,178], path('M124 174 144 172 158 215 177 223 174 235 147 233 136 216Z')),
  part('torso', [122,111], path('M100 102 137 100 151 137 143 183 91 181 86 135Z', R)),
  part('head', [123,105], path('M108 60 132 57 146 73 140 98 123 112 105 101 99 81ZM106 78 114 74 115 82 107 86ZM125 73 134 72 134 81 127 84Z', I, True)),
  part('hat', [124,66], path('M102 62 106 40 127 44 142 38 149 61 169 60 173 73 87 79 78 68Z', A)),
  part('arm-left', [97,119], path('M90 110 104 118 90 145 68 149 64 135 79 131Z')),
  part('arm-right', [145,117], path('M138 109 151 114 168 135 183 134 187 149 162 153 145 139Z')),
  part('map', [127,150], path('M62 124 100 114 137 123 180 112 190 172 149 185 109 176 72 187Z', A), path('M99 116 106 116 114 177 108 178ZM135 124 141 122 153 183 147 184Z'), path('M77 142 94 135 96 142 83 149 91 159 104 151 108 158 91 169 73 153ZM153 138 165 130 177 137 168 145 179 157 171 164 158 150Z', R)),
 ]),
 ('runner', 'The runner', 'A startled fairgoer sprints with a flying cap and a backward glance.', [
  part('leg-back', [135,145], path('M130 139 149 147 135 178 105 188 96 218 81 218 84 180 117 165Z')),
  part('leg-front', [151,145], path('M143 136 162 141 175 176 205 195 221 199 218 212 196 211 158 188Z')),
  part('torso', [144,103], path('M121 89 151 83 169 102 166 144 135 161 111 127Z', R)),
  part('arm-back', [122,104], path('M114 96 128 107 98 128 77 113 68 93 79 88 91 105 99 110Z')),
  part('arm-front', [161,102], path('M151 91 167 97 181 121 202 109 211 120 179 142 164 133Z')),
  part('head', [142,91], path('M124 49 149 45 164 61 160 81 142 98 123 87 117 66ZM123 64 132 61 132 69 125 73ZM142 59 151 58 150 67 144 70ZM136 78 146 74 146 85 138 88Z', I, True)),
  part('flying-cap', [73,49], path('M44 44 58 30 80 33 92 43 102 41 108 49 79 58 49 55Z', A)),
  part('motion', [53,160], path('M25 145 74 150 71 160 19 155ZM19 175 65 174 66 183 16 186ZM49 204 73 198 77 206 50 215Z', R)),
 ]),
 ('rolling-out', 'Rolling out', 'A wheelchair user actively pushes the rear wheel to roll away from the commotion.', [
  part('wheel-rear', [108,187], path('M95 139 120 140 143 155 155 180 152 208 133 229 107 238 80 229 62 208 59 182 71 155ZM99 154 80 165 72 185 76 205 89 220 108 225 127 218 139 201 141 182 132 165 116 155Z', I, True), path('M102 152 112 153 113 227 103 229ZM72 170 144 201 139 210 69 179ZM80 217 135 161 143 169 88 224Z', A)),
  part('chair-frame', [119,171], path('M82 105 95 104 108 170 158 174 168 193 201 207 198 219 157 205 150 187 98 183Z'), path('M88 115 77 116 86 171 100 175Z', A)),
  part('torso', [117,106], path('M100 91 129 90 143 118 136 154 107 162 92 129Z', R)),
  part('head', [117,94], path('M100 49 125 45 140 62 136 83 119 99 100 87 94 67ZM106 62 113 59 114 68 106 71ZM124 58 132 57 132 66 125 68ZM116 79 128 75 127 85 118 89Z', I, True)),
  part('cap', [117,58], path('M96 52 104 37 126 37 137 49 150 49 151 57 99 63Z', A)),
  part('legs', [126,156], path('M112 146 139 143 162 163 176 185 208 188 218 201 212 211 167 203 148 178 125 176Z')),
  part('arm-push', [129,110], path('M124 100 138 106 155 132 145 162 132 159 138 136 124 123Z')),
  part('hand', [135,161], path('M127 151 139 151 145 162 137 176 125 173 121 162Z')),
  part('caster', [203,226], path('M196 216 207 215 216 222 215 232 205 239 194 234 190 224ZM199 224 205 222 210 227 205 232 199 229Z', I, True)),
 ]),
 ('i30-driver', 'Stuck on I-30', 'A driver peers out of a stalled car and raises a hand at the enormous traffic problem.', [
  part('car-body', [127,186], path('M33 172 62 161 83 121 148 117 180 158 223 169 234 202 217 215 40 218 23 201ZM89 131 72 161 164 158 142 129Z', I, True), path('M33 179 222 174 226 186 31 190Z', R)),
  part('driver-torso', [115,147], path('M96 129 124 124 140 144 144 162 88 166 89 145Z', A)),
  part('driver-head', [113,133], path('M99 92 121 87 136 102 133 120 116 137 99 127 92 108ZM103 103 111 100 111 108 104 112ZM120 98 127 97 128 105 121 109ZM111 119 123 115 121 125 114 129Z', I, True)),
  part('raised-arm', [133,143], path('M126 132 140 134 160 111 166 85 179 85 177 117 149 154 134 156Z')),
  part('raised-hand', [173,86], path('M164 88 159 72 166 68 169 51 177 50 180 67 186 54 193 58 185 79 181 94Z')),
  part('wheel-left', [65,218], path('M52 206 66 201 81 209 85 225 74 238 58 239 46 228 45 215ZM57 214 66 211 74 217 73 226 65 230 57 224Z', I, True)),
  part('wheel-right', [193,215], path('M180 202 195 199 210 208 213 222 202 235 187 235 175 225 174 212ZM185 211 194 209 203 216 201 224 192 227 184 221Z', I, True)),
  part('headlights', [128,192], path('M35 193 56 192 57 201 34 202ZM205 188 223 189 226 198 205 199Z', A)),
 ]),
]


def colorize(markup, palette):
    for key, value in palette.items():
        markup = markup.replace(f'@{key}@', value)
    return markup


def build():
    previews = []
    for mode, palette in PALETTES.items():
        destination = ROOT if mode == 'sun-faded' else ROOT/'classic'
        icons = destination/'icons'
        icons.mkdir(parents=True, exist_ok=True)
        symbols, manifest = [], []
        for index, (slug, name, description, parts) in enumerate(CAST):
            prefix = f'bystander-{slug}' + ('-classic' if mode == 'classic' else '')
            groups, rig = [], []
            for layer, item in enumerate(parts):
                x, y = item['pivot']
                identifier = f'{prefix}-{item["name"]}'
                groups.append(f'<g id="{identifier}" data-part="{item["name"]}" data-pivot="{x} {y}">{colorize(item["shapes"],palette)}</g>')
                rig.append(dict(id=identifier, name=item['name'], pivot=[x,y], layer=layer))
            art = '\n  '.join(groups)
            title_id, desc_id = f'{prefix}-title', f'{prefix}-desc'
            svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="{title_id} {desc_id}">
  <title id="{title_id}">{escape(name)}</title>
  <desc id="{desc_id}">{escape(description)}</desc>
  {art}
</svg>
'''
            (icons/f'{slug}.svg').write_text(svg)
            symbols.append(f'<symbol id="{prefix}" viewBox="0 0 256 256"><title>{escape(name)}</title>{art}</symbol>')
            manifest.append(dict(name=name, file=f'icons/{slug}.svg', symbol=prefix, parts=rig))
            if mode == 'sun-faded':
                previews.append((name, art, index))
        (destination/'sprite.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg">\n'+'\n'.join(symbols)+'\n</svg>\n')
        (destination/'animation-parts.json').write_text(json.dumps(dict(viewBox=[0,0,256,256], palette=palette,
            convention='Pivot positions use original SVG viewBox coordinates; left/right refer to the viewer. Parts are independent flat layers. No animation or kinematic parenting is applied.',
            characters=manifest),indent=2)+'\n')
    p = PALETTES['sun-faded']
    cards = []
    for name, art, index in previews:
        x, y = 52+(index%4)*340, 252+(index//4)*364
        cards.append(f'''<g transform="translate({x} {y})">
  <path d="M0 0H312V336H0Z" fill="none" stroke="{p['ink']}" stroke-opacity=".18"/>
  <svg x="28" y="12" width="256" height="256" viewBox="0 0 256 256">{art}</svg>
  <text x="17" y="313" fill="{p['red']}" font-size="12">{index+1:02}</text>
  <text x="44" y="313" font-size="14">{escape(name.upper())}</text>
</g>''')
    sheet = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1420" width="1440" height="1420" role="img" aria-labelledby="cast-title cast-desc">
<title id="cast-title">Big Tex: Rewired — innocent bystanders</title>
<desc id="cast-desc">Twelve original cut-paper characters: fairgoers, a family, a stroller parent, a vendor, and people reacting to the giant cowboy.</desc>
<path d="M0 0H1440V1420H0Z" fill="{p['paper']}"/>
<g font-family="Arial, sans-serif" fill="{p['ink']}">
 <path d="M51 42 66 35 70 174 53 182Z" fill="{p['red']}"/>
 <text x="91" y="102" font-size="68" font-weight="900">INNOCENT BYSTANDERS</text>
 <text x="93" y="153" font-size="22" letter-spacing="3">THEY JUST CAME FOR THE FAIR.</text>
 <text x="53" y="217" font-size="14" letter-spacing="1.4">BIG TEX: REWIRED / THE CUT-PAPER CAST / 01–12</text>
 <path d="M1115 195H1185V215H1115Z"/><path d="M1197 195H1267V215H1197Z" fill="{p['red']}"/><path d="M1279 195H1349V215H1279Z" fill="{p['accent']}"/>
 {''.join(cards)}
 <path d="M52 1360H1384" fill="none" stroke="{p['ink']}" stroke-width="2"/>
 <text x="52" y="1391" font-size="12" letter-spacing="1.2">TRANSPARENT SVG / NAMED PARTS / TWO PALETTES</text>
 <text x="1384" y="1391" text-anchor="end" font-size="12">256 × 256 / v01</text>
</g>
</svg>
'''
    (ROOT/'contact-sheet.svg').write_text(sheet)
    (ROOT/'palette.json').write_text(json.dumps(PALETTES,indent=2)+'\n')
    print(f'Built {len(CAST)} characters in two palettes, sprites, and animation-part manifests.')


if __name__ == '__main__':
    build()
