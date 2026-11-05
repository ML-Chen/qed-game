#!/usr/bin/env python3
"""Q.E.D.! test suite: builds the page and runs every check in headless Chromium.
Usage: python3 tests/run.py [--only NAME] [--out DIR]

Checks:
  screens       every screen (title, topics, cards, intro, between, play, results, pause) renders with no errors
  microgames    every microgame: the bot wins at every level in easy and medium mode, doing nothing fails,
                a wrong move only wobbles (the bot still wins afterwards), the card has every field, and the command is ALL CAPS ending in "!"
  full_runs     every topic played start to finish by the bots: 12 games, all won, stars counted, cards unlocked
  lose_path     doing nothing loses four acorns, the owl's second chance comes exactly once, then the run ends
  pause         the pause button stops the clock and resumes it
  settings      the settings page: every choice can be tapped, is saved, and survives a reload; text fits; no scrollbars;
                speed-ups off keeps the run at speed 1; old saves merge with new ones
  timer_off     with the timer off no microgame is ever lost by waiting, no acorn is lost, and the fuse is hidden
  checkin       the check-in after each microgame: no tap records nothing and moves on; Got it is saved and makes a
                microgame come up less often; Confused is saved, brings the microgame back later in the run and slows
                its working; Replay slower replays it at half speed without costing an acorn or counting toward 12
  rewind        every microgame: after a couple of moves the rewind scrubber re-plays it exactly (the hidden copy at "now"
                matches the live game), scrubbing to many times draws with no errors, closing leaves the live game
                unchanged and the bot still wins; the button, the marks and the play button work; also in medium mode
  text_fits     card text stays a sensible length
  no_network    the page makes no network requests
"""
import argparse, pathlib, subprocess, sys, tempfile, time, traceback
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HELPERS = (ROOT / 'tests' / 'page_helpers.js').read_text()
TESTS = []
def test(fn): TESTS.append(fn); return fn


def open_page(browser, page_path, test=True, viewport=(360, 640)):
    ctx = browser.new_context(viewport={'width': viewport[0], 'height': viewport[1]}, device_scale_factor=1)
    ctx.add_init_script(HELPERS)
    pg = ctx.new_page(); errs = []; reqs = []
    pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errs.append('console.error: ' + m.text) if m.type == 'error' else None)
    pg.on('request', lambda r: reqs.append(r.url) if not r.url.startswith(('file:', 'data:', 'blob:')) else None)
    pg.goto(page_path.as_uri() + ('?test=1' if test else ''))
    pg.wait_for_function('window.HM && window.HM.ready && document.fonts.status === "loaded"', timeout=20000)
    return pg, errs, reqs


@test
def screens(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    def shot(name):
        pg.evaluate('HM.step(2)')
        if out: pg.screenshot(path=str(out / f'{name}.png'))
    for scene in ('title', 'stages', 'cards'):
        pg.evaluate(f"HM.goto('{scene}')"); shot(scene)
    pg.evaluate("HM.goto('title'); openSettings(); HM.step(30)"); shot('settings'); pg.evaluate('SET.open = false')
    stage = pg.evaluate('STAGES.find(s => MG.forStage(s.id).length).id')
    pg.evaluate(f"HM.goto('run', '{stage}')"); pg.evaluate('HM.step(40)'); shot('intro')
    pg.evaluate("__hm.drive({until: 'between'})"); pg.evaluate('HM.step(20)'); shot('between')
    pg.evaluate("__hm.drive({until: 'play'})"); pg.evaluate('HM.step(30)'); shot('play')
    pg.evaluate('HM.pause()'); shot('pause'); pg.evaluate('openSettings(); HM.step(20)'); shot('pause_settings'); pg.evaluate('SET.open = false; HM.resume()')
    pg.evaluate("window.HM_AUTO = true; __hm.drive({until: 'between'}); window.HM_AUTO = false"); pg.evaluate('HM.step(40)'); shot('checkin')
    pg.evaluate("window.HM_AUTO = true; __hm.drive({until: 'over'}); window.HM_AUTO = false"); pg.evaluate('HM.step(80)'); shot('results')
    fails += errs; pg.close(); return fails


@test
def microgames(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    for g in pg.evaluate('HM.list()'):
        gid = g['id']
        for lv, sp in ((0, 1), (1, 1.5), (2, 2)):
            for seed in (1, 2, 3):
                r = pg.evaluate('([id, lv, sp, seed]) => { __hm.seed(seed); return HM.test(id, { auto: true, level: lv, speed: sp }); }', [gid, lv, sp, seed])
                if r['result'] != 'win': fails.append(f'{gid}: bot did not win at level {lv} speed {sp} seed {seed} ({r["result"]}, errors {r["errors"][:2]})')
                for e in r['errors']: fails.append(f'{gid}: {e[:200]}')
        idle = pg.evaluate('id => HM.test(id, { auto: false })', gid)
        if idle['result'] != ('win' if g['winOnTimeout'] else 'fail'): fails.append(f'{gid}: doing nothing gave {idle["result"]}')
        # a tap on a wrong part of the problem must fail the microgame at level 1
        wrong = pg.evaluate('''id => { const def = MG.byId[id]; scene = 'run'; run = { stage: STAGE[def.stage] || STAGES[0], list: [def], i: 0, loaves: 4, phase: 'play', pt: 0, speed: 1, bpm: 108, newCards: [], stars: 0 };
            const g = makeG(def, 1, 1, false, 'easy'); run.g = g; def.init(g); let tapped = null;
            for (let i = 0; i < 2700 && !g.done; i++) { g.t += 1 / 60; def.update && def.update(g, 1 / 60); const M = g.s.mk;
              if (M && M.busyT <= 0 && !M.ask && g.t > 0.3) { const ok = new Set(MK.current(g).flatMap(m => [].concat(m.tap || [], m.drag || [])));
                const bad = Object.keys(M.box).find(k => !ok.has(k) && !(M.inert && M.inert.has(k)) && (MK.node(g, k) || (M.zones && M.zones[k])) && !(MK.node(g, k) || {}).hide);
                if (bad && !tapped) { const b = M.box[bad]; tapped = bad; def.down(g, b.x, b.y); def.up && def.up(g, b.x, b.y); continue; } }
              if (def.auto && (tapped || g.t > 0.3)) def.auto(g, 1 / 60, synth); }
            scene = 'title'; run = null; return { result: g.result, tapped }; }''', gid)
        if not wrong['tapped']: fails.append(f'{gid}: found no wrong part to tap (give every meaningful part an id)')
        elif wrong['result'] == 'fail': fails.append(f'{gid}: tapping a wrong part ({wrong["tapped"]}) ended the microgame; a wrong move must only wobble')
        for lv in (0, 2):
            r = pg.evaluate('([id, lv]) => { __hm.seed(5); return HM.test(id, { auto: true, level: lv, speed: 1.5, mode: "medium" }); }', [gid, lv])
            if r['result'] != 'win': fails.append(f'{gid}: bot did not win in medium mode at level {lv} ({r["result"]}, errors {r["errors"][:2]})')
        card = pg.evaluate('id => MG.byId[id].card || {}', gid)
        for k in ('title', 'ref', 'kind', 'text', 'note', 'ask'):
            if not card.get(k): fails.append(f'{gid}: card is missing "{k}"')
        if not (g['cmd'].isupper() or g['cmd'].replace('x', 'X').isupper()) or not g['cmd'].endswith('!'): fails.append(f'{gid}: command "{g["cmd"]}" should be ALL CAPS ending in "!"')
    fails += errs; pg.close(); return fails


@test
def full_runs(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    for st in pg.evaluate('STAGES.filter(s => MG.forStage(s.id).length).map(s => s.id)') + ['remix']:
        r = pg.evaluate('''s => { localStorage.clear(); SAVE.d = SAVE.merge(null, null); CV.list = null; __hm.seed(7); window.HM_AUTO = true; HM.goto('run', s);
            const ev = __hm.drive({ until: s === 'remix' ? 'none' : 'over', maxFrames: s === 'remix' ? 60 * 120 : 60 * 600 }); window.HM_AUTO = false;
            const out = { phase: run.phase, i: run.i, won: run.won, cleared: run.cleared, stars: run.stars, cards: Object.keys(SAVE.d.cards).length, err: (ev.find(e => e.phase === 'error') || {}).error };
            CV.list = null; HM.goto('title'); run = null; return out; }''', st)
        if r['err']: fails.append(f'[{st}] threw: {r["err"][:300]}'); continue
        if st == 'remix':
            if r['cleared'] < 5: fails.append(f'[remix] bots won only {r["cleared"]} games in two minutes')
            continue
        if r['phase'] != 'over' or r['i'] != 12 or not r['won'] or r['cleared'] != 12: fails.append(f'[{st}] run did not finish 12/12: {r}')
        if not 12 <= r['stars'] <= 36: fails.append(f'[{st}] stars {r["stars"]} outside 12..36')
        if r['cards'] < 1: fails.append(f'[{st}] no card unlocked')
    fails += errs; pg.close(); return fails


@test
def lose_path(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    st = pg.evaluate('STAGES.find(s => MG.forStage(s.id).length).id')
    ev = pg.evaluate("s => { localStorage.clear(); SAVE.d = SAVE.merge(null, null); __hm.seed(3); window.HM_AUTO = false; HM.goto('run', s); return __hm.drive({ until: 'over' }); }", st)
    graces = [e for e in ev if e['phase'] == 'grace']
    if len(graces) != 1: fails.append(f'second chance happened {len(graces)} times, expected once')
    last = ev[-1] if ev else {}
    if last.get('phase') != 'over': fails.append(f'run never ended: {last}')
    if pg.evaluate('run && run.won'): fails.append('run counted as won after losing every acorn')
    fails += errs; pg.close(); return fails


@test
def pause(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    st = pg.evaluate('STAGES.find(s => MG.forStage(s.id).length).id')
    pg.evaluate(f"HM.goto('run', '{st}'); __hm.drive({{until: 'play'}}); HM.step(10)")
    pg.mouse.click(336, 24); pg.evaluate('HM.step(1)')
    if not pg.evaluate('HM.state().paused'): fails.append('tapping the pause button did not pause')
    t = pg.evaluate('run.g.t'); pg.evaluate('HM.step(300)')
    if pg.evaluate('run.g.t') != t: fails.append('the clock ran while paused')
    # the paused game stays visible: a tap on the game does not resume, and nothing dims the whole screen
    pg.mouse.click(180, 330); pg.wait_for_timeout(200); pg.evaluate('HM.step(5)')
    if not pg.evaluate('HM.state().paused'): fails.append('a tap on the paused game resumed it')
    big = pg.evaluate('''() => { const rects = []; const f = CanvasRenderingContext2D.prototype.fillRect; CanvasRenderingContext2D.prototype.fillRect = function (x, y, w, h) { if (this.canvas.id === 'game' && w >= W && h >= H * 0.5 && /rgba/.test(String(this.fillStyle))) rects.push(String(this.fillStyle)); return f.apply(this, arguments); };
        try { render(); } finally { CanvasRenderingContext2D.prototype.fillRect = f; } return rects; }''')
    if big: fails.append(f'the pause screen covers the game with {big}')
    fails += ['pause bar: ' + m for m in pg.evaluate(TEXT_CHECK, [18, 'drawPause'])]
    rb = pg.evaluate("pauseItems().find(b => b.id === 'resume')")
    pg.mouse.click(rb['x'], rb['y']); pg.wait_for_timeout(300); pg.evaluate('HM.step(5)')
    if pg.evaluate('HM.state().paused'): fails.append('"Resume" did not resume')
    fails += errs; pg.close(); return fails


# texts drawn by one render of the current screen (or only by one drawing function, such as drawSettings) that run
# off the screen or are smaller than `minpx`
TEXT_CHECK = """([minpx, only]) => { const rec = __hm.capture(() => { if (!only) return render(); ctx.save(); ctx.setTransform(scale * DPR, 0, 0, scale * DPR, offX * DPR, offY * DPR); window[only](ctx, T); ctx.restore(); }); const bad = [];
    for (const r of rec) { if (!r.main || !r.text.trim() || r.alpha < 0.5) continue; const px = parseFloat((r.font.match(/([\\d.]+)px/) || [])[1] || 0);
      if (r.gx0 < 10 || r.gx1 > 350 || r.gy0 < 0 || r.gy1 > 640) bad.push(`"${r.text}" runs off the screen (${Math.round(r.gx0)}..${Math.round(r.gx1)}, ${Math.round(r.gy0)}..${Math.round(r.gy1)})`);
      if (px && px < minpx) bad.push(`"${r.text}" is ${px} px, smaller than ${minpx} px`); }
    if (document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight) bad.push('the page has scrollbars');
    return bad; }"""


@test
def settings(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    pg.evaluate("localStorage.clear(); SAVE.d = SAVE.merge(null, null); HM.goto('title'); HM.step(2)")
    pg.mouse.click(30, 30); pg.evaluate('HM.step(30)')
    if not pg.evaluate('SET.open'): fails.append('the gear on the title screen did not open the settings'); pg.close(); return fails + errs
    fails += ['settings page: ' + m for m in pg.evaluate(TEXT_CHECK, [18, 'drawSettings'])]
    # each choice's label sits inside its own segment
    for row in pg.evaluate("SET_ROWS.map((r, i) => r.opts.map(([v, l], j) => ({ l, b: setOptBox(i, j) })))"):
        for o in row:
            w = pg.evaluate("t => { const c = document.createElement('canvas').getContext('2d'); c.font = '900 19px Nunito'; return c.measureText(t).width; }", o['l'])
            if w > o['b']['w'] - 12: fails.append(f'settings choice "{o["l"]}" is wider than its button')
    want = {'timer': 'off', 'anim': 'slow', 'speedups': 'off', 'mode': 'medium', 'sound': 'off'}
    for rid, v in want.items():
        bx = pg.evaluate("([rid, v]) => { const i = SET_ROWS.findIndex(r => r.id === rid), j = SET_ROWS[i].opts.findIndex(o => o[0] === v); return setOptBox(i, j); }", [rid, v])
        pg.mouse.click(bx['x'], bx['y']); pg.evaluate('HM.step(2)')
    got = pg.evaluate("SET_ROWS.map(r => [r.id, r.get()])")
    if dict(got) != want: fails.append(f'tapping the choices gave {dict(got)}, expected {want}')
    pg.mouse.click(180, 594); pg.wait_for_timeout(300); pg.evaluate('HM.step(2)')
    if pg.evaluate('SET.open'): fails.append('Back did not close the settings')
    pg.reload(); pg.wait_for_function('window.HM && window.HM.ready && document.fonts.status === "loaded"', timeout=20000)
    after = pg.evaluate("({ s: SAVE.d.settings, mode: SAVE.d.mode, muted: SAVE.d.muted, pace: paceMulFor(MG.list[0]), timer: timerOn() })")
    if after['s'] != {'timer': False, 'anim': 'slow', 'speedups': False} or after['mode'] != 'medium' or not after['muted'] or after['pace'] != 1.5 or after['timer']:
        fails.append(f'settings did not survive a reload: {after}')
    # the gear on the topic list and the Settings button in the pause menu open the same page
    pg.evaluate("HM.goto('stages'); HM.step(2)"); pg.mouse.click(330, 30); pg.evaluate('HM.step(2)')
    if not pg.evaluate('SET.open'): fails.append('the gear on the topic list did not open the settings')
    pg.evaluate('SET.open = false')
    st = pg.evaluate('STAGES.find(s => MG.forStage(s.id).length).id')
    pg.evaluate(f"HM.goto('run', '{st}'); __hm.drive({{until: 'play'}}); HM.pause(); HM.step(2)"); sb = pg.evaluate("pauseItems().find(b => b.id === 'settings')"); pg.mouse.click(sb['x'], sb['y']); pg.wait_for_timeout(200); pg.evaluate('HM.step(2)')
    if not pg.evaluate('SET.open'): fails.append('Settings in the pause menu did not open the settings')
    fails += ['settings over the pause menu: ' + m for m in pg.evaluate(TEXT_CHECK, [18, 'drawSettings'])]
    pg.evaluate('SET.open = false; HM.resume()')
    # speed-ups off: a whole topic at speed 1, with no "Faster!" screen
    r = pg.evaluate("""s => { SAVE.d.settings = { ...SETTINGS_DEFAULT, speedups: false }; SAVE.d.mode = 'easy'; __hm.seed(5); window.HM_AUTO = true; HM.goto('run', s);
        const ev = __hm.drive({ until: 'over' }); window.HM_AUTO = false; const out = { speedups: ev.filter(e => e.phase === 'speedup').length, speed: run.speed, i: run.i, phase: run.phase }; CV.list = null; HM.goto('title'); run = null; return out; }""", st)
    if r['speedups'] or r['speed'] != 1 or r['i'] != 12 or r['phase'] != 'over': fails.append(f'speed-ups off: {r}')
    # merging two saves keeps the newer settings and, per microgame, the newer check-in
    m = pg.evaluate("""() => { const a = { savedAt: 1, settings: { timer: false, anim: 'fast' }, learn: { x: { s: 'got', at: 5 }, y: { s: 'got', at: 1 } } },
        b = { savedAt: 2, settings: { anim: 'slow' }, learn: { x: { s: 'confused', at: 3 }, y: { s: 'confused', at: 4 }, z: { s: 'bogus', at: 9 } } }; return SAVE.merge(a, b); }""")
    if m['settings'] != {'timer': False, 'anim': 'slow', 'speedups': True}: fails.append(f'merged settings {m["settings"]}')
    if m['learn'] != {'x': {'s': 'got', 'at': 5}, 'y': {'s': 'confused', 'at': 4}}: fails.append(f'merged check-ins {m["learn"]}')
    if pg.evaluate('JSON.stringify(SAVE.merge(null, null).settings)') != '{"timer":true,"anim":"normal","speedups":true}': fails.append('a fresh save does not start with the default settings')
    pg.evaluate('HM.resetSave()')
    fails += errs; pg.close(); return fails


@test
def timer_off(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    for g in pg.evaluate('HM.list()'):
        r = pg.evaluate("id => { __hm.seed(2); const r = HM.test(id, { auto: false, timer: false, maxT: 20 }); return { result: r.result, errors: r.errors.slice(0, 2) }; }", g['id'])
        if r['result'] == 'fail': fails.append(f'{g["id"]}: left idle with the timer off, it was lost')
        for e in r['errors']: fails.append(f'{g["id"]}: {e[:200]}')
    st = pg.evaluate('STAGES.find(s => MG.forStage(s.id).length).id')
    r = pg.evaluate("""s => { localStorage.clear(); SAVE.d = SAVE.merge(null, null); __hm.seed(3); window.HM_AUTO = false; HM.goto('run', s); __hm.drive({ until: 'play' }); HM.step(10);
        const px = () => Array.from(document.getElementById('game').getContext('2d').getImageData(24, 622, 1, 1).data.slice(0, 3)); const on = px();
        SAVE.d.settings.timer = false; render(); const off = px();
        const ev = __hm.drive({ until: 'result', maxFrames: 60 * 90 }); const out = { on, off, events: ev.map(e => e.phase), phase: run.phase, loaves: run.loaves, done: run.g.done };
        run.g.fail(); __hm.drive({ until: 'between' }); out.loavesAfterFail = run.loaves; out.i = run.i; HM.goto('title'); run = null; HM.resetSave(); return out; }""", st)
    if r['events'] or r['phase'] != 'play' or r['done'] or r['loaves'] != 4: fails.append(f'with the timer off, a microgame left alone for 90 s ended: {r}')
    if r['loavesAfterFail'] != 4 or r['i'] != 1: fails.append(f'with the timer off, a lost microgame cost an acorn: {r}')
    fuse = (255, 224, 138)
    if max(abs(a - b) for a, b in zip(r['on'], fuse)) > 40: fails.append(f'the fuse was not where the test expects it with the timer on (pixel {r["on"]})')
    elif max(abs(a - b) for a, b in zip(r['off'], fuse)) <= 40: fails.append(f'the fuse is still drawn with the timer off (pixel {r["off"]})')
    fails += errs; pg.close(); return fails


@test
def checkin(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    st = pg.evaluate('STAGES.filter(s => MG.forStage(s.id).length > 1)[0].id')
    pg.evaluate(f"localStorage.clear(); SAVE.d = SAVE.merge(null, null); __hm.seed(11); window.HM_AUTO = true; HM.goto('run', '{st}'); __hm.drive({{until: 'play'}})")
    S = lambda: pg.evaluate('HM.state()')
    if S()['checkin']: fails.append('the check-in showed before the first microgame')
    # 1. no tap: nothing is saved and the next microgame starts after about 2.5 s
    pg.evaluate("__hm.drive({until: 'between'})"); s0 = S()
    if not s0['checkin'] or s0['i'] != 1: fails.append(f'no check-in after the first microgame: {s0}')
    pg.evaluate('HM.step(40)'); fails += ['check-in screen: ' + m for m in pg.evaluate(TEXT_CHECK, [18, None])]
    for bt in pg.evaluate('CHECKIN.map(b => ({ label: b.label, y: b.y }))'):
        rec = pg.evaluate("t => __hm.capture(() => render()).filter(r => r.main && r.text === t).map(r => [r.gx0, r.gx1])", bt['label'])
        if not rec: fails.append(f'check-in button "{bt["label"]}" was not drawn')
        elif rec[0][1] > pg.evaluate('CHECKIN_BOX.x + CHECKIN_BOX.w / 2 - 10'): fails.append(f'check-in label "{bt["label"]}" runs past its button')
    ev = pg.evaluate("__hm.drive({until: 'play'})")
    frames = ev[-1]['f'] + 40 if ev else 0
    if pg.evaluate('Object.keys(SAVE.d.learn).length'): fails.append('the check-in saved something without a tap')
    if not 140 <= frames <= 200: fails.append(f'the check-in screen lasted {frames} frames, expected about 150 (2.5 s)')
    # 2. Got it
    pg.evaluate("__hm.drive({until: 'between'}); HM.step(30)"); gid = pg.evaluate('run.checkin.def.id'); i0 = S()['i']
    pg.mouse.click(248, 466); pg.evaluate("__hm.drive({until: 'play'})")
    if pg.evaluate(f"(SAVE.d.learn['{gid}'] || {{}}).s") != 'got' or f'"{gid}":{{"s":"got"' not in pg.evaluate('localStorage.getItem(SAVE.key)'): fails.append('"Got it" was not saved')
    if S()['i'] != i0: fails.append('"Got it" changed the game count')
    # 3. Confused: saved, comes back later in this run, and plays slower
    pg.evaluate("__hm.drive({until: 'between'}); HM.step(30)"); cid = pg.evaluate('run.checkin.def.id'); i1 = S()['i']
    pg.mouse.click(248, 526); pg.evaluate('HM.step(2)')
    if pg.evaluate(f"(SAVE.d.learn['{cid}'] || {{}}).s") != 'confused': fails.append('"Confused" was not saved')
    nxt = S()['next']
    if cid not in nxt[:3]: fails.append(f'"Confused" did not bring {cid} back within the next 3 games (next: {nxt})')
    seen = None
    for _ in range(4):
        pg.evaluate("__hm.drive({until: 'play'})"); s = S()
        if s['gameId'] == cid and s['i'] > i1 - 1: seen = s; break
        pg.evaluate("__hm.drive({until: 'between'})")
    if not seen: fails.append(f'{cid} did not come back after "Confused"')
    elif abs(seen['paceMul'] - 1.6) > 1e-9: fails.append(f'{cid} came back at pace x{seen["paceMul"]}, expected x1.6')
    # 4. Replay slower: same microgame, same level, half speed, no acorn, no count, no speed-up
    pg.evaluate("__hm.drive({until: 'between'}); HM.step(30)"); s = S(); rid = pg.evaluate('run.checkin.def.id'); lvl = pg.evaluate('run.last.level')
    pg.mouse.click(248, 586); pg.evaluate("__hm.drive({until: 'play'})"); r = S()
    if not r['replay'] or r['gameId'] != rid or pg.evaluate('run.g.level') != lvl or abs(r['paceMul'] - 2) > 1e-9: fails.append(f'"Replay slower" did not replay {rid} at level {lvl} at half speed: {r}')
    pg.evaluate("window.HM_AUTO = false"); ev = pg.evaluate("__hm.drive({until: 'between', maxFrames: 60 * 120})"); r2 = S(); pg.evaluate("window.HM_AUTO = true")
    if [e['phase'] for e in ev] != ['result', 'between']: fails.append(f'after a replay the run went {[e["phase"] for e in ev]}, expected result then the check-in')
    if r2['loaves'] != s['loaves'] or r2['i'] != s['i'] or r2['speed'] != s['speed'] or r2['cleared'] != s['cleared']: fails.append(f'a lost replay changed the run: before {s}, after {r2}')
    if not r2['checkin']: fails.append('no check-in after a replay')
    # the run still ends after 12 games, all counted, with a check-in after the last one
    ev = pg.evaluate("__hm.drive({until: 'over'})"); r3 = pg.evaluate('({ i: run.i, cleared: run.cleared, won: run.won })')
    if r3 != {'i': 12, 'cleared': 12, 'won': True}: fails.append(f'the run did not finish 12/12 after the check-ins: {r3}')
    if len(ev) < 2 or ev[-2]['phase'] != 'between': fails.append('no check-in after the last microgame')
    # 5. mastered microgames come up less often
    q = pg.evaluate("""() => { const ids = MG.list.map(d => d.id), got = new Set(ids.filter((_, i) => i % 2)); SAVE.d.learn = {}; for (const id of got) SAVE.d.learn[id] = { s: 'got', at: 1 };
        __hm.seed(4); const L = playlist('remix'); const n = L.filter(d => got.has(d.id)).length; HM.resetSave(); return { mastered: n / got.size, other: (L.length - n) / (ids.length - got.size) }; }""")
    if q['mastered'] > 0.65 * q['other']: fails.append(f'mastered microgames are not picked less often: {q}')
    pg.evaluate("window.HM_AUTO = false; CV.list = null; HM.goto('title'); run = null; HM.resetSave()")
    fails += errs; pg.close(); return fails


REWIND_ONE = """([id, mode]) => { localStorage.clear(); SAVE.d = SAVE.merge(null, null); SAVE.d.mode = mode; CV.list = null; const def = MG.byId[id]; __hm.seed(6);
    window.HM_AUTO = true; startRun(def.stage, id); __hm.drive({ until: 'play' }); const g = run.g;
    for (let i = 0; i < 60 * 20 && run.phase === 'play' && !g.done; i++) { T += 1 / 60; step(1 / 60); const L = g.s.mk && g.s.mk.log || []; if (L.length >= 2 && g.t - L[1] > 0.5) break; }
    window.HM_AUTO = false; if (run.phase !== 'play') return { error: 'the bot finished before the rewind could be opened (phase ' + run.phase + ')' };
    const view = q => ({ done: q.done, result: q.result, wrong: q.s.mk.wrong || 0, log: (q.s.mk.log || []).map(v => +v.toFixed(3)), cur: MK.current(q).map(m => [m.tap, m.drag, m.to].map(String).join('/')) });
    const sig = () => JSON.stringify({ ...view(g), t: g.t, held: g.held, timers: g.s.mk.timers.length, busy: g.s.mk.busyT, rec: g.rec.dts.length + ':' + g.rec.ev.length + ':' + g.rec.rand.length });
    const before = sig(); if (!HM.rewind.open()) return { error: 'the rewind did not open' };
    const R = run.rewind, t0 = performance.now(); R.sim = null; const S = simAt(R, R.tEnd); const cost = performance.now() - t0;
    const live = JSON.stringify(view(g)), copy = JSON.stringify(view(S.g));
    const times = [0, R.tEnd * 0.25, ...R.marks.map(m => m - 0.05), ...R.marks.map(m => m + 0.3), R.tEnd * 0.6, R.tEnd, 0.05, R.tEnd];
    for (const t of times) HM.rewind.seek(t);
    HM.rewind.close(); const after = sig();
    window.HM_AUTO = true; const ev = __hm.drive({ until: 'result', maxFrames: 60 * 40 }); window.HM_AUTO = false;
    const out = { same: live === copy, live, copy, unchanged: before === after, before, after, result: run.g.result, cost: +cost.toFixed(1), tEnd: +R.tEnd.toFixed(2) };
    HM.goto('title'); run = null; return out; }"""


@test
def rewind(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []; costs = []
    ids = [g['id'] for g in pg.evaluate('HM.list()')]
    for gid in ids:
        for mode in (('easy', 'medium') if ids.index(gid) % 4 == 0 else ('easy',)):
            r = pg.evaluate(REWIND_ONE, [gid, mode])
            if r.get('error'): fails.append(f'{gid} ({mode}): {r["error"]}'); continue
            if not r['same']: fails.append(f'{gid} ({mode}): the rewind copy does not match the live game at "now": live {r["live"][:160]} copy {r["copy"][:160]}')
            if not r['unchanged']: fails.append(f'{gid} ({mode}): scrubbing changed the live game: {r["before"][:200]} -> {r["after"][:200]}')
            if r['result'] != 'win': fails.append(f'{gid} ({mode}): after the rewind closed the bot did not win ({r["result"]})')
            costs.append((r['cost'], gid, r['tEnd']))
    costs.sort(reverse=True); print('      rewind: slowest full re-plays (ms, game, seconds of play): ' + ', '.join(f'{c:.0f} {g} {t}' for c, g, t in costs[:5]))
    # the buttons: rewind beside pause during play, on the check-in screen and in the pause bar; a mark jumps to just before its move
    st = pg.evaluate('STAGES.find(s => MG.forStage(s.id).length).id')
    pg.evaluate(f"localStorage.clear(); SAVE.d = SAVE.merge(null, null); __hm.seed(8); window.HM_AUTO = true; HM.goto('run', '{st}'); __hm.drive({{until: 'play'}}); for (let i = 0; i < 600 && !(run.g.s.mk.log || []).length; i++) HM.step(1); HM.step(40); window.HM_AUTO = false")
    pg.mouse.click(288, 24); pg.evaluate('HM.step(2)')
    info = pg.evaluate('HM.rewind.info()')
    if not info: fails.append('the rewind button beside pause did not open the scrubber')
    else:
        fails += ['scrubber: ' + m for m in pg.evaluate(TEXT_CHECK, [18, None])]
        mx = pg.evaluate('rwX(run.rewind.marks[0])'); pg.mouse.click(mx, 600); pg.evaluate('HM.step(1)')
        t = pg.evaluate('run.rewind.t')
        if abs(t - (info['marks'][0] - 0.05)) > 1e-6: fails.append(f'tapping a move mark went to {t}, not just before the move ({info["marks"][0]})')
        pg.mouse.click(40, 600); pg.evaluate('HM.step(30)'); i2 = pg.evaluate('HM.rewind.info()')
        if not i2['playing'] or not (t + 0.4 < i2['t'] < t + 0.6): fails.append(f'the play button did not play the replay at normal speed: {i2}')
        pg.mouse.click(336, 24); pg.wait_for_timeout(200); pg.evaluate('HM.step(1)')
        if pg.evaluate('!!run.rewind'): fails.append('the close button did not close the scrubber')
    pg.evaluate("HM.pause(); HM.step(1)"); rb = pg.evaluate("(pauseItems().find(b => b.id === 'rewind') || null)")
    if not rb: fails.append('no rewind button in the pause bar')
    else:
        pg.mouse.click(rb['x'], rb['y']); pg.evaluate('HM.step(1)')
        if not pg.evaluate('!!run.rewind'): fails.append('the rewind button in the pause bar did not open the scrubber')
        pg.evaluate('HM.rewind.close(); HM.resume()')
    pg.evaluate("window.HM_AUTO = true; __hm.drive({until: 'between'}); HM.step(30); window.HM_AUTO = false")
    pg.mouse.click(288, 24); pg.evaluate('HM.step(3)')
    i3 = pg.evaluate('HM.rewind.info()'); pt = pg.evaluate('run.pt'); pg.evaluate('HM.step(400)')
    if not i3: fails.append('the rewind button on the check-in screen did not open the scrubber')
    elif pg.evaluate('run.phase') != 'between' or pg.evaluate('run.pt') != pt: fails.append('the check-in screen moved on while the scrubber was open')
    if out: pg.screenshot(path=str(out / 'rewind_checkin.png'))
    pg.evaluate("HM.rewind.close(); HM.goto('title'); run = null; HM.resetSave()")
    fails += errs; pg.close(); return fails


@test
def text_fits(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    for gid in pg.evaluate('MG.list.map(d => d.id)'):
        bad = pg.evaluate('''id => { const def = MG.byId[id]; openCards([def], 0, 'browse'); const b = cardBody(def); CV.list = null;
            const m = document.createElement('canvas').getContext('2d'); m.font = '700 17px Nunito'; return b.h > 1400 ? 'card text is very long (' + Math.round(b.h) + ' px)' : null; }''', gid)
        if bad: fails.append(f'{gid}: {bad}')
    fails += errs; pg.close(); return fails


@test
def no_network(b, page, out):
    pg, errs, reqs = open_page(b, page, test=False); pg.wait_for_timeout(1500)
    pg.mouse.click(180, 300); pg.wait_for_timeout(800)
    fails = [f'network request: {u}' for u in reqs] + errs; pg.close(); return fails


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--only'); ap.add_argument('--out'); ap.add_argument('--page')
    a = ap.parse_args()
    out = pathlib.Path(a.out) if a.out else None
    if out: out.mkdir(parents=True, exist_ok=True)
    tmp = pathlib.Path(tempfile.mkdtemp(prefix='qed-tests-'))
    page = pathlib.Path(a.page) if a.page else tmp / 'qed.html'
    if not a.page: subprocess.run([sys.executable, str(ROOT / 'src' / 'build.py'), str(page)], check=True, stdout=subprocess.DEVNULL)
    failed = []; t0 = time.time()
    with sync_playwright() as p:
        b = p.chromium.launch()
        for fn in TESTS:
            if a.only and a.only not in fn.__name__: continue
            t = time.time()
            try: fails = fn(b, page, out)
            except Exception: fails = ['crashed: ' + traceback.format_exc()[-800:]]
            print(f"{'PASS' if not fails else 'FAIL'}  {fn.__name__} ({time.time() - t:.1f}s)")
            for f in fails[:25]: print('      - ' + f)
            if fails: failed.append(fn.__name__)
        b.close()
    n = len([f for f in TESTS if not a.only or a.only in f.__name__])
    print(f"\n{n - len(failed)}/{n} passed in {time.time() - t0:.0f}s" + (f"; FAILED: {', '.join(failed)}" if failed else ''))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
