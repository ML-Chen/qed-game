#!/usr/bin/env python3
"""Film one microgame played by its bot: frames every STEP seconds into a grid sheet, plus an animated GIF.
Usage: python3 tools/film.py OUTDIR id [level] [mode] [step]   (HM_NOBUILD=1 skips the build; HM_PAGE picks the page)"""
import base64, io, os, pathlib, subprocess, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
gid = sys.argv[2]; level = int(sys.argv[3]) if len(sys.argv) > 3 else 0; mode = sys.argv[4] if len(sys.argv) > 4 else 'easy'; step = float(sys.argv[5]) if len(sys.argv) > 5 else 0.1
page = pathlib.Path(os.environ.get('HM_PAGE', str(root / 'dist' / 'qed.html')))
if not os.environ.get('HM_NOBUILD'): subprocess.run([sys.executable, str(root / 'src' / 'build.py'), str(page)], check=True)
img = lambda d: Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGB')
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 360, 'height': 640}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(page.as_uri() + '?test=1'); pg.wait_for_function('window.HM && document.fonts.status==="loaded"', timeout=20000); pg.wait_for_timeout(300)
    r = pg.evaluate('([id,l,m])=>HM.test(id,{auto:true,level:l,mode:m,frames:[]})', [gid, level, mode])
    end = r['doneAt'] + 2.0; ts = [round(i * step, 3) for i in range(int(end / step) + 1)]
    r2 = pg.evaluate('([id,l,m,f])=>HM.test(id,{auto:true,level:l,mode:m,frames:f})', [gid, level, mode, ts])
    b.close()
print(gid, 'level', level, mode, r2['result'], 'at', r2['doneAt'], 'fuse', r2['dur'], 'errors', r2['errors'][:5], errs[:5])
fr = [img(s) for s in r2['shots']]
fr[0].save(out / f'{gid}_L{level}_{mode}.gif', save_all=True, append_images=fr[1:], duration=int(step * 1000), loop=0)
fw, fh, cols = 180, 320, 10; rows = (len(fr) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (fw + 4), rows * (fh + 18)), (30, 20, 36)); d = ImageDraw.Draw(sheet)
for i, f in enumerate(fr):
    x, y = (i % cols) * (fw + 4), (i // cols) * (fh + 18); sheet.paste(f.resize((fw, fh), Image.LANCZOS), (x, y + 16)); d.text((x + 4, y + 2), f'{ts[i]:.1f}s', fill=(255, 240, 220))
sheet.save(out / f'{gid}_L{level}_{mode}.jpg', quality=82)
