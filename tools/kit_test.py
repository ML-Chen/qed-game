
KIT_JS = r"""() => {
    const out = { fails: [], shots: {} }, F = m => out.fails.push(m);
    const def = MG.list[0], mk = () => { const g = makeG(def, 0, 1, true, 'easy', 1); MK.setup(g); return g; };
    const cv = document.createElement('canvas'); cv.width = 720; cv.height = 1280; const c = cv.getContext('2d');
    const clear = (col = '#20304a') => { c.setTransform(2, 0, 0, 2, 0, 0); c.fillStyle = col; c.fillRect(0, 0, 360, 640); };
    const shot = k => { out.shots[k] = cv.toDataURL('image/png'); };
    const ink = (x0, y0, x1, y1, bg = [32, 48, 74]) => { const d = c.getImageData(x0 * 2, y0 * 2, (x1 - x0) * 2, (y1 - y0) * 2).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 60) n++; return n; };
    // 1. the new typesetter nodes: integral with limits, radical (and cube root), pi, under
    { const g = mk(), M = MK;
      M.place(g, 'a', M.row(M.int(0, 2, 'I'), M.sup(M.vr('x'), 2), M.txt(' dx')), 180, 120, 44, { col: '#fff6e0' });
      M.place(g, 'b', M.row(M.sqrt(49, 'R'), M.op('='), M.num(7), M.gap(20), M.sqrt(M.num(8), 'R3', { idx: M.num(3) })), 180, 230, 44, { col: '#fff6e0' });
      M.place(g, 'c', M.row(M.num(2), M.pi('P'), M.vr('r'), M.op('='), M.num(6), M.pi()), 180, 320, 44, { col: '#fff6e0' });
      M.place(g, 'd', M.row(M.under(M.txt('lim'), M.row(M.vr('x'), M.txt('→'), M.num(0)), 'L'), M.frac(M.row('sin ', M.vr('x')), M.vr('x'))), 180, 430, 40, { col: '#fff6e0' });
      g.t = 1; clear(); for (const k of 'abcd') M.drawEx(g, c, k);
      M.note(g, { node: M.row(M.pi(), M.op('≈'), M.num('3.14')), at: [180, 540], s: 30, pill: {} }); g.t = 3; MK.drawAnims(g, c);
      shot('nodes');
      for (const id of ['I', 'R', 'R3', 'P', 'L']) { const b = M.box(g, id); if (!b || !(b.w > 10 && b.h > 10)) F('node ' + id + ' has no proper box: ' + JSON.stringify(b)); else if (ink(b.x - b.w / 2, b.y - b.h / 2, b.x + b.w / 2, b.y + b.h / 2) < 40) F('node ' + id + ' drew nothing'); }
      const I = M.box(g, 'I'), P1 = M.box(g, 'P'); if (I && I.h < 44 * 1.2) F('the integral sign is not taller than the text: ' + I.h); if (P1 && P1.w > 44) F('pi is too wide: ' + P1.w);
      // a fly can carry the new nodes too
      M.fly(g, { node: M.sqrt(M.pi()), from: [60, 600], to: [300, 600], dur: 1, s0: 30, s1: 30 }); g.t = 3.5; MK.update(g, 0.5); clear(); MK.drawFlies(g, c); if (ink(150, 560, 210, 630) < 30) F('MK.fly did not draw a radical over pi'); }
    // 2. note pill: {} reveals with the writing (no empty pill first) and stays inside the screen; pill: true is unchanged
    { const LB = '#c8d8e8', LBC = [200, 216, 232]; const g = mk(); const nt = (pill, x) => { const h = MK.note(g, { node: MK.row(MK.num(6), MK.op('÷'), MK.num(3), MK.op('='), MK.num(2)), at: [x, 300], s: 30, write: 1, pill }); };
      nt({}, 180); g.t = 0.25; clear(LB); MK.drawAnims(g, c); const early = ink(200, 280, 290, 320, LBC); g.t = 0.9; clear(LB); MK.drawAnims(g, c); const late = ink(200, 280, 290, 320, LBC);
      if (early > 20) F('pill: {} showed its right half before the writing reached it (' + early + ' px)'); if (late < 200) F('pill: {} did not show once written (' + late + ' px)');
      const g2 = mk(); MK.note(g2, { node: MK.row(MK.num(6), MK.op('÷'), MK.num(3), MK.op('='), MK.num(2)), at: [180, 300], s: 30, write: 1, pill: true }); g2.t = 0.25; clear(LB); MK.drawAnims(g2, c); if (ink(200, 280, 290, 320, LBC) < 200) F('pill: true changed (it used to show at once)');
      const g3 = mk(); MK.note(g3, { node: MK.row(MK.num(123), MK.op('×'), MK.num(45)), at: [350, 625], s: 30, write: 0.2, pill: {} }); g3.t = 0.5; clear(LB); MK.drawAnims(g3, c); shot('pill_edge');
      if (ink(350, 0, 360, 640, LBC) > 0 || ink(0, 630, 360, 640, LBC) > 0) F('a note with pill: {} ran into the 10 px screen margin'); }
    // 3. glideWrap: a new fraction around old symbols glides with them; without it the bar sits still
    for (const gw of [true, false]) { const g = mk(), a = MK.num(3), b = MK.num(4); MK.place(g, 'e', MK.row(a, MK.op('+'), b), 180, 200, 40, { glideWrap: gw }); g.t = 1; clear(); MK.drawEx(g, c, 'e');
      const fr = MK.frac(a, b, 'F'); MK.place(g, 'e', MK.row(MK.gap(140), fr), 180, 400, 40, { glideWrap: gw }); g.t = 1.05; clear(); MK.drawEx(g, c, 'e');
      if (gw && !(Math.abs(fr._ay || 0) > 50)) F('glideWrap: the new fraction did not glide (offset ' + fr._ay + ')'); if (!gw && (fr._ay || 0) !== 0) F('without glideWrap the wrapper moved (backward compatibility)');
      if (gw) { g.t = 1.12; clear(); MK.drawEx(g, c, 'e'); shot('glidewrap_mid'); const o = MK.offset(g, a); if (!(Math.abs(o.y) > 20)) F('MK.offset did not report the glide: ' + JSON.stringify(o)); g.t = 2; MK.drawEx(g, c, 'e'); if (fr._ay) F('the fraction glide did not end'); } }
    // 4. a fraction bar draws itself in even with the measuring passes (relayout, MK.track) in between
    { const g = mk(), f = MK.frac(1, 2, 'B', { bar: { t0: 0, dur: 0.6 } }); MK.place(g, 'f', f, 180, 300, 60); const bx = MK.box(g, 'B');
      const at = t => { g.t = t; MK.relayout(g, 'f'); MK.track(g); clear(); MK.drawEx(g, c, 'f'); return ink(bx.x - bx.w / 2, bx.y - 4, bx.x + bx.w / 2, bx.y + 4); };
      at(0); const w1 = at(0.15), w2 = at(0.4), w3 = at(1); if (!(w1 < w2 && w2 < w3)) F('the fraction bar did not draw itself in: ' + [w1, w2, w3]); }
    // 5. cancelTweens / set: a value set by hand survives a yoyo tween ending
    { const g = mk(), n = MK.num(5, 'm'); MK.place(g, 'h', n, 180, 300, 40); MK.tween(g, n, { alpha: 0.2 }, 0.5, { yoyo: true }); g.t = 0.25; MK.update(g, 0.25); MK.set(g, n, { alpha: 0 }); g.t = 1; MK.update(g, 0.75);
      if (n.alpha !== 0) F('MK.set did not win over an ending tween (alpha ' + n.alpha + ')'); const n2 = MK.num(6); MK.tween(g, n2, { alpha: 0.2, sc: 2 }, 0.5); MK.cancelTweens(g, n2, ['alpha']); g.t = 2; MK.update(g, 1); if (n2.alpha != null || n2.sc !== 2) F('cancelTweens(keys) stopped the wrong keys: ' + JSON.stringify([n2.alpha, n2.sc])); }
    // 6. leafFirst: a tap on a one-item row reaches its symbol
    for (const lf of [true, false]) { const g = mk(); let got = null; const r = MK.row(MK.num(8, 'leaf')); r.id = 'wrap'; MK.place(g, 'k', r, 180, 300, 40);
      MK.play(g, { leafFirst: lf, moves: () => [{ tap: 'leaf', then() { got = 'leaf'; } }] }); const b = MK.box(g, 'leaf'); MK.down(g, b.x, b.y); MK.up(g, b.x, b.y);
      if (lf && got !== 'leaf') F('leafFirst: the tap did not reach the symbol'); if (!lf && got === 'leaf') F('without leafFirst the hit test changed (backward compatibility)'); }
    // 7. gone: a subtree fades together and leaves no ghost; bornAll shows a subtree at once
    { const g = mk(), inner = MK.row(MK.num(1), MK.op('+'), MK.num(2)), keep = MK.num(9); MK.place(g, 'q', MK.row(inner, keep), 180, 300, 40); g.t = 1; clear(); MK.drawEx(g, c, 'q');
      let done = false; MK.gone(g, inner, { dur: 0.3, then() { done = true; } }); for (let i = 1; i <= 24; i++) { g.t = 1 + i / 60; MK.update(g, 1 / 60); clear(); MK.drawEx(g, c, 'q'); }
      if (!done || inner.alpha > 0.01) F('MK.gone did not fade the subtree (alpha ' + inner.alpha + ')');
      MK.place(g, 'q', MK.row(keep), 180, 300, 40); g.t += 1 / 60; clear(); MK.drawEx(g, c, 'q'); if ((g.s.mk.ghosts || []).length) F('MK.gone left ghosts: ' + g.s.mk.ghosts.length);
      const nb = MK.bornAll(MK.row(MK.num(4), MK.frac(1, 3))); const q = []; (function w(n) { if (!n) return; q.push(n); for (const ch of MK.kids(n)) w(ch); })(nb); if (!q.every(n => n._born === -1)) F('MK.bornAll missed a node'); }
    // 8. host: points while the work shows, hops on a beat, cheers on a win
    { const g = mk(); MK.play(g, { moves: () => [{ tap: 'x' }] }); clear('#7ab8e0'); let r = MK.host(g, c, 'frog', 180, 420, 1.4); if (r.pose !== 'idle') F('host pose at rest: ' + r.pose);
      MK.show(g, 1); r = MK.host(g, c, 'frog', 180, 420, 1.4); if (r.pose !== 'point') F('host does not point while the work shows: ' + r.pose);
      MK.at(g, [[0.2, () => { }]]); g.t = 0.3; MK.update(g, 0.3); g.t = 0.4; r = MK.host(g, c, 'frog', 180, 420, 1.4); if (!(r.hop > 0) || r.pose !== 'hop') F('host did not hop on a beat: ' + JSON.stringify(r)); shot('host');
      g.done = true; g.result = 'win'; r = MK.host(g, c, 'frog', 180, 420, 1.4, { facing: -1 }); if (r.pose !== 'cheer') F('host does not cheer on a win'); }
    return out; }"""


def kit(b, page, out):
    pg, errs, _ = open_page(b, page); fails = []
    r = pg.evaluate(KIT_JS)
    fails += r['fails']
    if out:
        import base64
        for k, v in r['shots'].items(): (out / f'kit_{k}.png').write_bytes(base64.b64decode(v.split(',')[1]))
    fails += errs; pg.close(); return fails
