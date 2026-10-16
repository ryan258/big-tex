"""Targeted export checks and per-shot decoded contact sheets."""
import argparse
import hashlib
import io
import json
import math
import pathlib
import subprocess
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).resolve().parent
V3 = HERE.parent
ROOT = V3.parent.parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def audio_sha(p):
    data = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(p), '-map', '0:a:0',
        '-c:a', 'copy', '-f', 'adts', 'pipe:1'])
    return hashlib.sha256(data).hexdigest()


def frame(p, t):
    data = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-ss', str(t), '-i', str(p),
        '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-q:v', '2', 'pipe:1'])
    return Image.open(io.BytesIO(data)).convert('RGB')


def contact(images, labels, prefix, portrait, folder):
    cw, ch = (270, 480) if portrait else (480, 270)
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 16)
    paths = []
    for page, start in enumerate(range(0, len(images), 12), 1):
        count = min(12, len(images) - start)
        sheet = Image.new('RGB', (cw * 4, math.ceil(count / 4) * (ch + 32) + 58), '#F5E9CD')
        draw = ImageDraw.Draw(sheet)
        draw.text((12, 15), f'BIG TEX: REWIRED / DECODED MP4 / {prefix.upper()} / {page}', font=font, fill='#103B46')
        for j, i in enumerate(range(start, start + count)):
            x, y = j % 4 * cw, 58 + j // 4 * (ch + 32)
            sheet.paste(images[i].resize((cw, ch), Image.Resampling.LANCZOS), (x, y))
            draw.text((x + 8, y + ch + 7), labels[i], font=font, fill='#103B46')
        p = folder / f'decoded-{prefix}-{page}.jpg'
        sheet.save(p, quality=94)
        paths.append(p.name)
    return paths


def check_export(video, parent, duration, size, plan, name, folder):
    probe = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries',
        'format=duration,size:stream=codec_name,width,height,r_frame_rate,start_time,duration,nb_frames,channels,sample_rate',
        '-of', 'json', str(video)]))
    v, a = probe['streams']
    assert (v['width'], v['height']) == size
    assert v['codec_name'] == 'h264' and v['r_frame_rate'] == '24/1'
    assert int(v['nb_frames']) == duration * 24
    assert float(v['duration']) == duration and float(a['duration']) == duration
    assert float(probe['format']['duration']) == duration
    assert v['start_time'] == a['start_time'] == '0.000000'
    assert a['codec_name'] == 'aac' and a['channels'] == 2
    original_audio, new_audio = audio_sha(parent), audio_sha(video)
    assert original_audio == new_audio, 'Audio differs from original edit'
    times = [round((s['start'] + min(.125, s['duration'] / 3)) * 24) / 24 for s in plan['shots']]
    images = [frame(video, t) for t in times]
    labels = [f'{t:.3f}s / {s["kind"]}' for t, s in zip(times, plan['shots'])]
    sheets = contact(images, labels, name, size[1] > size[0], folder)
    for kind in ['hook', 'traffic-punch', 'coupons', 'corny-dog', 'end-title']:
        i = next(i for i, s in enumerate(plan['shots']) if s['kind'] == kind)
        images[i].save(folder / f'decoded-{kind}-{name}.jpg', quality=94)
    roll = next(s for s in plan['shots'] if s['kind'] == 'wheel-roll')
    wheel_times = [roll['start'] + roll['duration'] * u for u in [.2, .4, .6, .8]]
    contact([frame(video, t) for t in wheel_times], [f'{t:.3f}s / rolling right' for t in wheel_times], f'wheel-motion-{name}', size[1] > size[0], folder)
    return {'file': video.name, 'probe': probe, 'sha256': sha(video),
            'parent_export_sha256': sha(parent), 'audio_stream_identical_to_parent': True,
            'aac_adts_sha256': new_audio, 'decoded_sample_times': times,
            'decoded_contact_sheets': sheets, 'wheel_motion_sample_times': wheel_times}


def main():
    args = argparse.ArgumentParser()
    args.add_argument('--teaser-only', action='store_true')
    short = args.parse_args().teaser_only
    folder = V3 / 'teaser-30s/bystanders' if short else HERE
    plan_path = V3 / 'teaser-30s/timeline.json' if short else V3 / 'timeline.json'
    plan = json.loads(plan_path.read_text())
    cues = json.loads((folder / 'reaction-cues.json').read_text())
    expected = json.loads((V3 / 'verification.json').read_text())
    if short:
        parent = V3 / 'teaser-30s/big-tex-rewired-v03-30s-vertical-teaser.mp4'
        assert sha(parent) == '0f054ea29a9ad93bf4e242885080cb341ab08385d2f26fcef91a1eb34bdced31'
        outputs = [check_export(folder / 'big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4', parent, 30, (1080, 1920), plan, 'teaser', folder)]
    else:
        outputs = []
        for item, name, size in zip(expected['outputs'], ['wide', 'vertical'], [(1920, 1080), (1080, 1920)]):
            parent = V3 / item['file']
            assert sha(parent) == item['sha256'], 'Original v3 changed'
            filename = 'big-tex-rewired-90s-v03-bystanders' + ('-vertical' if name == 'vertical' else '') + '.mp4'
            outputs.append(check_export(HERE / filename, parent, 90, size, plan, name, folder))
    assert len(cues['characters']) == 12 and len(set(cues['characters'])) == 12
    lut = V3 / 'teaser-30s/sun-faded-texas.cube'
    assert sha(lut) == '2f4af38e6456b1429514dfdc11fc929beae659b2f63f189c1f0d6dc6509d31af'
    source_paths = [V3 / 'art.cjs', V3 / 'scenes.cjs', V3 / 'bystander-scale.cjs',
                    V3 / 'teaser-30s/bystanders/cast.cjs', folder / 'render.cjs', folder / 'reactions.cjs']
    for p in source_paths: subprocess.run(['node', '--check', str(p)], check=True, capture_output=True)
    result = {'outputs': outputs, 'shot_count': len(plan['shots']), 'character_count': 12,
              'characters': cues['characters'], 'reaction_cue_count': len(cues['cues']),
              'scale': cues['scale'], 'parent_timeline_sha256': sha(plan_path), 'lut_sha256': sha(lut),
              'source_hashes': {str(p.relative_to(ROOT)): sha(p) for p in source_paths},
              'asset_hashes': {str(p.relative_to(ROOT)): sha(p) for p in sorted([
                  *(ROOT / 'assets/bystanders/classic/icons').glob('*.svg'),
                  *(ROOT / 'assets/title-sequence/icons').glob('*.svg')])},
              'cast_manifest_sha256': sha(ROOT / 'assets/bystanders/classic/animation-parts.json'),
              'cue_manifest_sha256': sha(folder / 'reaction-cues.json'),
              'motion_checks': json.loads((HERE / 'motion-checks.json').read_text()),
              'syntax_checks_passed': True, 'decoded_frame_visual_review': False,
              'human_full_playback_review': False}
    if not short: result['protected_title_intervals'] = cues['protected_shots']
    else: result['title_clear_from'] = cues['title_clear_from']
    (folder / 'verification.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({'duration': plan['duration'], 'files': [o['file'] for o in outputs],
                      'sampled_frames_per_export': len(plan['shots']), 'audio_identical': True}, indent=2))


if __name__ == '__main__':
    main()
