#!/usr/bin/env python3
"""Film one microgame played by its bot: frames every STEP seconds into a grid sheet, plus an animated GIF.
Usage: python3 tools/film.py OUTDIR id [level] [mode] [step]   (HM_NOBUILD=1 skips the build; HM_PAGE picks the page)
PM=2 plays the working at that pace multiplier (HM.test paceMul). STEPS=1 films step mode (the bot taps through each
beat; frames are then taken at wall-clock times so the waits show, and the files are named ..._steps)."""
import base64, io, os, pathlib, subprocess, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
gid = sys.argv[2]; level = int(sys.argv[3]) if len(sys.argv) > 3 else 0; mode = sys.argv[4] if len(sys.argv) > 4 else 'easy'; step = float(sys.argv[5]) if len(sys.argv) > 5 else 0.1
pm = float(os.environ.get('PM', '1')); steps = os.environ.get('STEPS', '') not in ('', '0')
opts = {'paceMul': pm, 'steps': steps, 'wall': steps}
name = f"{gid}_L{level}_{mode}" + (f'_pm{pm:g}' if pm != 1 else '') + ('_steps' if steps else '')
page = pathlib.Path(os.environ.get('HM_PAGE', str(root / 'dist' / 'qed.html')))
if not os.environ.get('HM_NOBUILD'): subprocess.run([sys.executable, str(root / 'src' / 'build.py'), str(page)], check=True)
img = lambda d: Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGB')
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 360, 'height': 640}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(page.as_uri() + '?test=1'); pg.wait_for_function('window.HM && document.fonts.status==="loaded"', timeout=20000); pg.wait_for_timeout(300)
    r = pg.evaluate('([id,l,m,o])=>HM.test(id,{auto:true,level:l,mode:m,frames:[],...o})', [gid, level, mode, opts])
    end = (r['wallDoneAt'] if steps and r['wallDoneAt'] is not None else r['doneAt']) + 2.0; ts = [round(i * step, 3) for i in range(int(end / step) + 1)]
    r2 = pg.evaluate('([id,l,m,f,o])=>HM.test(id,{auto:true,level:l,mode:m,frames:f,...o})', [gid, level, mode, ts, opts])
    b.close()
print(gid, 'level', level, mode, 'pace', pm, 'steps' if steps else '', r2['result'], 'at', r2['doneAt'], 'stops', r2.get('stops'), 'fuse', r2['dur'], 'errors', r2['errors'][:5], errs[:5])
# shrink each frame as soon as it is decoded (full-size frames for a long film took over a gigabyte)
shots = r2.pop('shots'); fr = []; small = []
for s in shots:
    f = img(s); fr.append(f.resize((360, 640), Image.LANCZOS)); small.append(f.resize((180, 320), Image.LANCZOS)); del f
del shots
fr[0].save(out / f'{name}.gif', save_all=True, append_images=fr[1:], duration=int(step * 1000), loop=0); del fr
fw, fh, cols = 180, 320, 10; rows = (len(small) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (fw + 4), rows * (fh + 18)), (30, 20, 36)); d = ImageDraw.Draw(sheet)
for i, f in enumerate(small):
    x, y = (i % cols) * (fw + 4), (i // cols) * (fh + 18); sheet.paste(f, (x, y + 16)); d.text((x + 4, y + 2), f'{ts[i]:.1f}s', fill=(255, 240, 220))
sheet.save(out / f'{name}.jpg', quality=82)
