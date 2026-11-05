#!/usr/bin/env python3
"""Build one of the repo's games into one self-contained HTML page.
Usage: python3 src/build.py [OUT.html] [--app qed|heureka]   (default app: qed, or the HM_APP environment variable)

Both apps share the engine and libraries in src/ (paint, animals, audio, math kit, engine).
- qed:     src/title.js, src/games/*.js                                   -> dist/qed.html
- heureka: heureka/app.js (APP: topics, save key), heureka/kit.js (SK, the scene kit), heureka/title.js,
           heureka/games/*.js                                              -> dist/heureka.html"""
import base64, fnmatch, glob, os, re, sys
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
args = sys.argv[1:]
app = os.environ.get('HM_APP', 'qed')
if '--app' in args:
    i = args.index('--app'); app = args[i + 1]; del args[i:i + 2]
if app not in ('qed', 'heureka'): sys.exit('unknown app ' + app)
appdir = here if app == 'qed' else os.path.join(root, 'heureka')
def rd(f, d=here):
    p = os.path.join(d, f)
    return open(p, encoding='utf-8').read() if os.path.exists(p) else ''
b64 = lambda f: base64.b64encode(open(os.path.join(here, f), 'rb').read()).decode()
def game_src(f):  # each microgame file gets its own scope; files starting with '_' are shared helpers and stay global
    src = open(f, encoding='utf-8').read(); name = os.path.basename(f)
    return f'<script>\n// ---- {name} ----\n' + (src if name.startswith('_') else '(() => {\n' + src + '\n})();') + '\n</script>'
# HM_ONLY=prefix1,prefix2 builds only the microgame files whose names start with one of the prefixes (shared '_' files are always kept)
only = [p for p in os.environ.get('HM_ONLY', '').split(',') if p]
# games/PENDING lists microgames still being written or reviewed (file names or glob patterns, one per line); they are
# left out of every build until their line is removed, so unfinished work never ships to players.
gdir = os.path.join(appdir, 'games')
pend_path = os.path.join(gdir, 'PENDING')
pending = [l.split('#')[0].strip() for l in open(pend_path)] if os.path.exists(pend_path) else []
pending = [p for p in pending if p]
files = [f for f in sorted(glob.glob(os.path.join(gdir, '*.js')))
         # a file named by HM_ONLY is built even when it is still in PENDING, so its author can test it
         if (not any(fnmatch.fnmatch(os.path.basename(f), p) for p in pending) or (only and any(os.path.basename(f).startswith(p) for p in only)))
         and (not only or os.path.basename(f).startswith('_') or any(os.path.basename(f).startswith(p) for p in only))]
games = '\n'.join(game_src(f) for f in files)
t = rd('game.html')
appjs = '' if app == 'qed' else rd('app.js', appdir) + '\n' + rd('kit.js', appdir)
title = {'qed': 'Q.E.D.!', 'heureka': 'Heurēka!'}[app]
for k, v in {'/*@@FREDOKA@@*/': b64('fredoka.woff'), '/*@@NUNITO@@*/': b64('nunito.woff'), '//@@PAINT@@': rd('paint.js'), '//@@ANIMALS@@': rd('animals.js'),
             '//@@TITLE@@': rd('title.js', appdir), '//@@MATHKIT@@': rd('mathkit.js'), '//@@MUSIC@@': rd('music_tracks.js'), '//@@AUDIO@@': rd('audio.js'),
             '//@@APP@@': appjs, '//@@ENGINE@@': rd('engine.js'), '@@PAGE_TITLE@@': title, '<!--@@GAMES@@-->': games}.items():
    t = t.replace(k, v)
if os.environ.get('HM_ARTIFACT'):  # the Artifact host adds its own doctype/html/head/body skeleton
    t = re.sub(r'(?is)<!doctype html>\s*<html[^>]*>\s*<head>', '', t, count=1)
    t = re.sub(r'(?is)<meta charset="utf-8">\s*<meta name="viewport"[^>]*>', '', t, count=1)
    t = t.replace('</head><body>', '', 1).replace('</body></html>', '')
    t = t.replace('canvas{display:block;touch-action:none}', 'canvas{display:block;touch-action:none;position:fixed;inset:0}:root{color-scheme:dark}')
out = args[0] if args else os.path.join(root, 'dist', app + '.html')
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)  # a fresh checkout (the Pages workflow) has no dist/ folder
open(out, 'w', encoding='utf-8').write(t)
print('wrote', out, len(t) // 1024, 'KB')
