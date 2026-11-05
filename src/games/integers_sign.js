// integers_sign.js — SIGN RULE! Multiply signed numbers by dealing with the signs first: two signs combine into one
// (same signs make +, different signs make −). (−4) × (−3) → 4 × 3 = 12.   (−4) × (+3) → −(4 × 3) = −12.
// A chalkboard under the night sky with an owl teacher. Every move acts its working out (show your work):
//   1. Drag one factor's sign onto another's: both signs are circled, the sign flies over, the rule writes itself
//      beside them ("− × − = +"), and the target sign turns into the product sign (a bar rises to make +, or the +
//      loses its upright bar and becomes −). The emptied bracket falls away and its number glides into place.
//      When one sign is left it slides to the front (a +, being positive, just fades): −(4 × 3).
//   2. Tap the product: the sizes are circled and "4 × 3 = 12" writes itself under the board; the 12 flies up after
//      an = sign, and if a − waits at the front it hops over onto the 12: −(4 × 3) = −12.
// Level 0: two negative factors. Level 1: mixed signs, written with an explicit + sign. Level 2: three factors.
// Wrong moves: dragging a sign onto a number, tapping the product before the signs are combined.
// Medium mode: the final tap opens a tray once "4 × 3 =" is written; wrong tiles are the opposite sign, the sum of the
// sizes, and ±1 off.
const M = MK, INK = SCN.ink('chalk');
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return [{ v: 2 + r(5), s: -1 }, { v: 2 + r(5), s: -1 }];
  if (L === 1) { const f = [{ v: 2 + r(6), s: -1 }, { v: 2 + r(6), s: 1 }]; return g.rand() < 0.5 ? f.reverse() : f; }
  const f = [1, 2, 3].map(() => ({ v: 1 + r(4), s: g.rand() < 0.6 ? -1 : 1 })); if (f.every(q => q.s > 0)) f[r(3)].s = -1; return f;
}
MG.add({
  id: 'integers_sign', stage: 'integers', cmd: 'SIGN RULE!', hint: 'drag', time: 8, mood: 'night', winText: 'Signed!', hold: 1.4,
  card: {
    title: 'Multiplying signed numbers', ref: 'Grades 6–7', kind: 'Negative numbers',
    text: 'A signed number has a sign in front: + for positive and − for negative. To multiply signed numbers, work out the sign and the size separately.\n\nThe sign rule: two numbers with the same sign multiply to a positive number. Two numbers with different signs multiply to a negative number. Then multiply the sizes as usual.\n\nFor example, (−4) × (−3) = +12, and (−4) × 3 = −12. With more factors, combine the signs two at a time: (−1) × (−2) × (−3) = −6.\n\nHere is why. 3 × (−4) is three debts of 4, which is −12. Multiplying by −1 flips a number to its opposite, so (−3) × (−4) flips −12 to 12.',
    note: 'Same signs give +, different signs give −. An even number of negative factors gives a positive product; an odd number gives a negative product.',
    ask: 'What is (−5) × (−2)? What is (−1) × 4 × (−3)?',
  },
  init(g) {
    const S = g.s; M.setup(g); S.f = pick(g); S.sign = S.f.reduce((p, q) => p * q.s, 1); S.size = S.f.reduce((p, q) => p * q.v, 1); S.v = S.sign * S.size; const T = M.pace(g);
    g.dur *= (2.6 + 1.05 * S.f.length) / 8;
    M.inert(g, ['front', 'pp', 'eq2', 'res', 'q', ...S.f.map((q, i) => 'p' + i)]);
    const sym = s => s < 0 ? '-' : '+', scol = s => s < 0 ? '#ffb0b8' : '#b8ffc8';
    // persistent nodes, so every symbol glides when the line is rewritten
    S.f.forEach((q, i) => { q.g = M.op(sym(q.s), 'g' + i, { col: scol(q.s) }); q.n = M.num(q.v, 'n' + i); q.p = M.paren(M.row(q.g, q.n), 'p' + i); q.x = i ? M.op('*', 'x' + i) : null; });
    const signed = () => S.f.map((q, i) => i).filter(i => S.f[i].s);
    S.size0 = S.f.length > 2 ? 38 : 48;
    const build = () => {
      const fin = S.fin, factors = S.f.flatMap(q => [q.x, !fin && q.s ? q.p : q.n]);
      let ex = M.row(...factors); if (fin && S.front) { S.pp = S.pp || M.paren(M.row(), 'pp'); S.pp.inner = ex; ex = M.row(S.front, S.pp); }
      if (S.res) ex = M.row(ex, M.gap(8), S.eq2, M.gap(6), S.res);
      const w = M.lay(ex, S.size0).w; M.place(g, 'ex', ex, 180, 304, Math.min(S.size0, S.size0 * 310 / w), { col: INK });
    };
    build(); S.build = build;
    // a factor's brackets come off: they tip outward and drop away, leaving the number
    const dropParen = (g, q) => { const pb = M.box(g, q.p.id); if (!pb) return; const B = { ...pb }; q.p.col = 'rgba(0,0,0,0)';
      M.anim(g, { dur: 0.4 * T, draw(c, g, k) { c.globalAlpha = 1 - k; c.fillStyle = INK; c.font = M.NUMF(B.s, 500); c.textAlign = 'center';
        for (const [x, d] of [[B.x - B.w / 2 + B.s * 0.15, -1], [B.x + B.w / 2 - B.s * 0.15, 1]]) { c.save(); c.translate(x + d * k * 12, B.y + B.s * 0.33 + k * k * 60); c.rotate(d * k * 1.1); c.fillText(d < 0 ? '(' : ')', 0, 0); c.restore(); } } }); };
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const merge = (g, from, to) => {
      const i = +from.slice(1), j = +to.slice(1), a = S.f[i], b = S.f[j], ns = a.s * b.s, A = { ...M.box(g, from) }, B = { ...M.box(g, to) };
      const last = signed().length === 2; M.show(g, (last ? 1.25 : 1.0) * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
      M.circle(g, [from, to], { dur: 0.45 * T, col: '#ffe9a0' });
      // the sign flies over to the other sign
      a.g.alpha = 0; M.fly(g, { node: M.op(sym(a.s)), from: [A.x, A.y], to: [B.x, B.y], delay: 0.08 * T, dur: 0.34 * T, arc: -46, s0: A.s, s1: B.s, col: scol(a.s) });
      // the sign rule writes itself just above the target sign
      M.note(g, { node: M.row(M.op(sym(a.s)), M.op('*'), M.op(sym(b.s)), M.op('='), M.op(sym(ns))), at: [M.clamp(B.x, 90, 270), B.y - B.h / 2 - 24], s: 27, col: '#ffe9a0', delay: 0.2 * T, write: 0.3 * T, hold: 0.45 * T, fade: 0.2 * T });
      M.at(g, [[0.42 * T, g => { g.sfx('snap'); b.g.alpha = 0; dropParen(g, a); const bb = { ...M.box(g, to) };
          // the target sign morphs: − gains an upright bar (+), or + loses it (−)
          M.anim(g, { dur: 0.3 * T, draw(c, g, k) { const e = M.easeIO(k), r = bb.s * 0.2, u0 = b.s > 0 ? 1 : 0, up = M.lerp(u0, ns > 0 ? 1 : 0, e); c.strokeStyle = scol(ns); c.lineWidth = bb.s * 0.08; c.lineCap = 'round'; c.shadowColor = '#ffe9a0'; c.shadowBlur = 12;
            const cx = bb.x, cy = bb.y; c.beginPath(); c.moveTo(cx - r, cy); c.lineTo(cx + r, cy); c.stroke(); if (up > 0.01) { c.beginPath(); c.moveTo(cx, cy - r * up); c.lineTo(cx, cy + r * up); c.stroke(); } } }); }],
        [0.72 * T, g => { b.s = ns; a.s = 0; b.g.v = ns < 0 ? '−' : '+'; b.g.col = scol(ns); b.g.alpha = 1; b.g.pop = g.t; build(); M.sparkle(g, b.g, { n: 8, cols: ['#fff', '#ffe9a0', scol(ns)] }); g.sfx('ding'); hop(g); }],
        ...(last ? [[0.9 * T, g => { // one sign left: a − slides to the front of the product, a + just fades (positive needs no sign)
          if (b.s > 0) dropParen(g, b);
          if (b.s < 0) { S.front = b.g; b.g.id = 'front'; b.s = 0; S.fin = true; build(); g.sfx('whoosh'); }
          else { M.tween(g, b.g, { alpha: 0 }, 0.18 * T); M.at(g, [[0.2 * T, g => { b.s = 0; S.fin = true; build(); g.sfx('whoosh'); }]]); } }]] : [])]);
    };
    M.play(g, {
      moves(g) {
        const left = signed();
        if (left.length > 1) return left.map(i => ({ drag: 'g' + i, to: left.filter(j => j !== i).map(j => 'g' + j), busy: 0.1, then: merge }));
        if (S.done || !S.fin) return [];
        const parts = S.f.flatMap((q, i) => [i ? 'x' + i : null, 'n' + i]).filter(Boolean);
        return [{ tap: parts, busy: 0.1, askAt: 0.65 * T, after: (S.sign < 0 ? 1.35 : 0.95) * T, ask: { v: S.v, wrong: [-S.v, S.sign * S.f.reduce((p, q) => p + q.v, 0), S.v + 1, S.v - 1] },
          then(g) { S.done = true; M.show(g, 0.65 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
            M.circle(g, S.f.map((q, i) => 'n' + i), { dur: 0.5 * T, col: '#ffe9a0' });
            // the sizes multiply in a working note under the line
            S.q = M.num(S.size, 'q', { alpha: 0 }); S.note = M.row(...S.f.flatMap((q, i) => [i ? M.op('*') : null, M.num(q.v)]), M.op('='), S.q);
            M.place(g, 'note', S.note, 180, 372, 30, { col: '#ffe9a0' }); M.writeIn(g, S.note, { delay: 0.12 * T, dur: 0.45 * T }); },
          resolve(g) { M.show(g, (S.sign < 0 ? 1.35 : 0.95) * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding');
            M.at(g, [[0.45 * T, g => { const from = { ...M.box(g, 'q') };
                S.eq2 = M.op('=', 'eq2'); S.res = M.num(S.size, 'res', { alpha: 0, col: '#ffe9a0' }); build(); M.tween(g, S.note, { alpha: 0 }, 0.3 * T);
                M.fly(g, { node: M.num(S.size, null, { col: '#ffe9a0' }), from: [from.x, from.y], to: 'res', dur: 0.36 * T, arc: 24, s0: 30,
                  then(g) { S.res.alpha = 1; S.res.pop = g.t; g.sfx('coin'); hop(g, S.sign < 0 ? 'think' : 'laugh'); M.sparkle(g, 'res');
                    // the waiting − hops over onto the answer
                    if (S.sign < 0) { const fb = { ...M.box(g, 'front') }; M.indicate(g, S.front, { dur: 0.3 * T, col: '#ffb0b8' });
                      M.fly(g, { node: M.op('-'), from: [fb.x, fb.y], to: 'res', delay: 0.15 * T, dur: 0.3 * T, arc: -50, col: '#ffb0b8',
                        then(g) { M.roll(g, S.res, S.v, { dur: 0.25 * T }); S.res.col = '#ffb0b8'; g.sfx('pop'); hop(g, 'laugh'); M.sparkle(g, 'res', { cols: ['#ffb0b8', '#fff'] }); } }); } } }); }],
              [(S.sign < 0 ? 1.3 : 0.9) * T, g => { delete g.s.mk.ex.note; S.point = false; }]]); } }];
      },
      area(g) { const left = signed(); return left.length > 1 ? left.map(i => 'g' + i) : 'n0'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'night', panel: 'chalk', panelY: 300, panelH: 170 });
    // the owl teacher points at the board while the work is shown, and hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 296, 556 - hopK * 24, 1.4, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', 296, 556, 1.4); } catch (e) { }
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'note');
    // a firefly or two drifting near the board
    for (let i = 0; i < 3; i++) { const x = 60 + i * 110 + Math.sin(t * 0.9 + i * 2) * 30, y = 450 + Math.cos(t * 1.2 + i) * 16, a = 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i)); c.fillStyle = `rgba(230,255,150,${a})`; c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); }
    M.drawUI(g, c);
  },
});
