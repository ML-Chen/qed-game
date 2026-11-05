#!/usr/bin/env python3
"""Generates background music options for the promo video with ElevenLabs Music.
Usage: ELEVENLABS_API_KEY=... python3 promo/make_music.py OUT_DIR [seconds]
Runs in GitHub Actions (.github/workflows/promo-music.yml), where the key is the repository secret ELEVENLABS_API_KEY.
Writes OUT_DIR/<name>.mp3 for each prompt below. The video cuts on 1.6 s bars, so every prompt asks for 150 BPM
(four beats at 150 BPM last exactly 1.6 s)."""
import json, os, sys, time, urllib.request, urllib.error
out = sys.argv[1]; secs = float(sys.argv[2]) if len(sys.argv) > 2 else 62
key = os.environ.get('ELEVENLABS_API_KEY', '').strip()
if not key: sys.exit('ELEVENLABS_API_KEY is not set')
os.makedirs(out, exist_ok=True)
COMMON = ('Instrumental music for a 60-second trailer of a cheerful video game about math, from grade 3 arithmetic '
          'to college calculus, played as fast WarioWare-style microgames with cute animals. Exactly 150 BPM, steady '
          'tempo, major key, curious, clever, joyful and bouncy. No vocals. A short sparkling 3-second intro, an '
          'energetic groove, a brief quieter build around 20 to 30 seconds, a big happy chorus starting at 32 seconds, '
          'and a clean ending with one bright final hit at 60 seconds.')
PROMPTS = {
    'playful_marimba': COMMON + ' Bouncy marimba, pizzicato strings, glockenspiel, ukulele, handclaps and light drums.',
    'chiptune_orchestra': COMMON + ' A playful blend of 16-bit video game chiptune leads with a small orchestra: '
                          'brass stabs, strings, timpani, glockenspiel, and a fun bass line.',
    'future_bass_bright': COMMON + ' Bright, friendly future bass: plucky synth chords, sparkly arpeggios, a warm sub '
                          'bass, crisp claps and a big but gentle drop at 32 seconds.',
}
ok = 0
for name, prompt in PROMPTS.items():
    body = json.dumps({'prompt': prompt, 'music_length_ms': int(secs * 1000), 'model_id': 'music_v1'}).encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192', data=body, method='POST',
                                 headers={'xi-api-key': key, 'content-type': 'application/json', 'accept': 'audio/mpeg'})
    data = None
    for attempt in range(4):   # ElevenLabs allows only 2 requests at a time per account; wait and retry on 429
        try:
            with urllib.request.urlopen(req, timeout=600) as r: data = r.read()
            break
        except urllib.error.HTTPError as e:
            print(f'{name}: ElevenLabs returned {e.code}: {e.read()[:300]!r}')
            if e.code != 429: break
            time.sleep(20 * (attempt + 1))
        except Exception as e:
            print(f'{name}: request failed: {str(e)[:300]}'); break
    if data is None: continue
    if len(data) < 100000: print(f'{name}: too little audio ({len(data)} bytes)'); continue
    open(os.path.join(out, name + '.mp3'), 'wb').write(data); ok += 1
    print(f'{name}: {len(data)} bytes')
open(os.path.join(out, 'prompts.json'), 'w').write(json.dumps(PROMPTS, indent=1))
sys.exit(0 if ok else 1)
