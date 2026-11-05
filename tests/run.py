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
    stage = pg.evaluate('STAGES.find(s => MG.forStage(s.id).length).id')
    pg.evaluate(f"HM.goto('run', '{stage}')"); pg.evaluate('HM.step(40)'); shot('intro')
    pg.evaluate("__hm.drive({until: 'between'})"); pg.evaluate('HM.step(20)'); shot('between')
    pg.evaluate("__hm.drive({until: 'play'})"); pg.evaluate('HM.step(30)'); shot('play')
    pg.evaluate('HM.pause()'); shot('pause'); pg.evaluate('HM.resume()')
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
    pg.mouse.click(180, 330); pg.wait_for_timeout(300); pg.evaluate('HM.step(5)')
    if pg.evaluate('HM.state().paused'): fails.append('"Keep playing" did not resume')
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
