// lines_subst.js — SUBSTITUTION! Solve the system y = ax, bx ± y = c, on a chalkboard in a library.
// Every move acts out its working (show your work):
//   1. Drag the ax from the first equation onto the y in the second: the y is circled, a copy of ax flies down along a
//      chalk arc, the y fades out of its way and the ax lands in its slot (chalked in yellow): bx ± ax = c.
//   2. Tap the like terms: "bx ± ax = kx" writes itself under them, the two terms merge, and kx flies up into place.
//   3. Tap the equation to divide: "÷ k" writes itself under both sides, k fades and c rolls over to x.
// Level 0: x + y = c. Level 1: bx + y = c. Level 2: bx − y = c (the substituted term is subtracted).
// Medium mode: combining the like terms and the division open a tray when the working reaches them.
const M = MK, INK = SCN.ink('chalk'), SUB = '#ffe07a', KEY = '#9adcff', Y1 = 246, Y2 = 334, NY = 392;
// fresh(node): the copy of an expression that is actually placed. The kit glides every node whose box moved, wrappers
// too, and a wrapper's glide adds to its symbols' own glides, so when a row's centre shifts its symbols would lurch twice
// as far. So every placement gets new row/fraction/power wrappers (views) around the same symbols: only symbols glide.
// A view passes every property through to its original (alpha, highlight, scale, ids...), so tweens and code that
// change either one change both. Brackets and slots draw their own marks, so they keep their identity (and glide), and
// what is inside them is shown as fresh views that ride along with the bracket.
const STRUCT = ['items', 'base', 'exp', 'inner', 'n', 'd', 'fill', 'rows'], OWN = new Set([...STRUCT, 'k', '_pid', '_glide', '_gx', '_gy', '_m', '_born']);
const DELEG = ['id', 'v', 'col', 'hl', 'hlc', 'sc', 'alpha', 'pop', 'strike', 'write', 'bar', 'roll', 'mark', 'dx', 'dy', 'hide', 'small', 'br', 'w'];
const hid = (o, k, v) => Object.defineProperty(o, k, { value: v, writable: true, configurable: true, enumerable: false });
function view(n, deep, born) {
  if (!n || typeof n !== 'object') return n; const c = { k: n.k };
  for (const k of new Set([...Object.keys(n), ...DELEG])) if (!OWN.has(k)) Object.defineProperty(c, k, { get: () => n[k], set: v => { n[k] = v; }, enumerable: true, configurable: true });
  const sub = x => deep ? view(x, true, born) : fresh(x);
  if (n.items) c.items = n.items.map(sub); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) if (n[k]) c[k] = sub(n[k]); if (n.rows) c.rows = n.rows.map(r => r.map(sub));
  if (deep && born) c._born = -1; return c;
}
function walkAll(n, f) { if (!n || typeof n !== 'object') return; f(n); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) walkAll(n[k], f); (n.items || []).forEach(q => walkAll(q, f)); }
function fresh(n) {
  if (!n || typeof n !== 'object' || /^(num|var|txt|op|gap|mat)$/.test(n.k)) return n;
  if (n.k === 'paren' || n.k === 'slot') { const key = n.k === 'paren' ? 'inner' : 'fill';
    if (!n._vw || n[key] !== n._vw) hid(n, '_mdl', n[key]); // first time, or the code put new contents in
    if (n._vw) walkAll(n._vw, q => Object.defineProperty(q, 'alpha', { value: 0, writable: true, configurable: true })); // the old views leave no ghost
    const v = view(n._mdl, true, !!n._seen); hid(n, '_vw', v); hid(n, '_seen', true); n[key] = v; return n; }
  return view(n, false);
}
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const a = r(2, 4), b = L === 0 ? 1 : L === 1 ? r(2, 3) : r(4, 6), x = L === 0 ? r(1, 4) : r(2, 5), s = L === 2 ? -1 : 1, k = b + s * a;
    if (k < 2) continue;
    return { a, b, x, s, k, c: k * x };
  }
}
const ax = (a, col, id) => { const r = M.row(M.num(a, null, { col }), M.vr('x', null, { col })); r.id = id; return r; };
const bx = (b, id) => { const r = M.row(b === 1 ? null : M.num(b), M.vr('x')); r.id = id; return r; };

MG.add({
  id: 'lines_subst', stage: 'lines', cmd: 'SUBSTITUTION!', hint: 'drag', time: 9, winText: 'Solved!', hold: 1.4,
  card: {
    title: 'Solving by substitution', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'A system of equations is two equations that must both be true at the same time. Solving it means finding the values of x and y that make both true.\n\nWhen one equation already says what y equals, you can substitute: write that expression in place of y in the other equation. Then only x is left, and you can solve for it.\n\nFor example, take y = 2x and x + y = 9. Put 2x in place of y: x + 2x = 9. Combine the like terms: 3x = 9. Divide by 3: x = 3. Then y = 2 · 3 = 6.\n\nThis works because y and 2x are equal, and swapping a thing for something equal never changes whether an equation is true.',
    note: 'Replace y in one equation with what the other equation says y equals. Then solve the one-variable equation that is left.',
    ask: 'Solve y = 3x and x + y = 12. Solve y = 2x and 5x − y = 9.',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = S.T = M.pace(g), sg = p.s < 0 ? '-' : '+';
    S.e1 = M.row(M.vr('y', 'ya'), M.op('=', 'q1'), ax(p.a, null, 'rhs'));
    S.c = M.num(p.c, 'c'); S.q2 = M.op('=', 'q2'); S.bx = bx(p.b, 'xb'); S.pl = M.op(sg, 'pl');
    S.e2 = M.row(S.bx, S.pl, M.vr('y', 'yb'), S.q2, S.c);
    const place = S.place = () => { M.place(g, 'e1', fresh(S.e1), 180, Y1, 44, { col: INK }); M.place(g, 'e2', fresh(S.e2), 180, Y2, 44, { col: INK }); };
    place(); M.inert(g, ['q1', 'q2', 'pl', 'w1']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const note = (g, nodes, res, at) => { res.alpha = 0; const b = M.box(g, at), n = M.row(...nodes, M.op('='), res); M.place(g, 'note', n, b ? b.x : 180, NY, 30, { col: SUB }); M.writeIn(g, n, { dur: 0.4 * T, delay: 0.1 * T }); };
    const noteGone = (g, d) => M.at(g, [[d, g => { const e = g.s.mk.ex.note; if (e) M.tween(g, e.node, { alpha: 0 }, 0.25 * T); }], [d + 0.27 * T, g => { delete g.s.mk.ex.note; }]]);
    M.play(g, {
      moves(g) {
        // 1. substitute: ax flies down into the place of y
        if (!S.subAt) return [{ drag: 'rhs', to: 'yb', reach: 70, busy: 0.1, then(g) {
          S.subAt = g.t; M.show(g, 1.0 * T); S.point = true; g.sfx('swoosh'); hop(g, 'think');
          M.circle(g, 'yb', { col: SUB, dur: 0.5 * T }); M.light(g, 'yb', { col: SUB }); M.indicate(g, 'rhs', { col: SUB, dur: 0.4 * T });
          const from = { ...M.box(g, 'rhs') };
          M.fly(g, { node: ax(p.a, SUB), from: [from.x, from.y], to: 'yb', delay: 0.25 * T, dur: 0.42 * T, arc: 40, s0: 44, s1: 44, col: SUB });
          M.tween(g, 'yb', { alpha: 0, sc: 0.6 }, 0.2 * T, { delay: 0.47 * T });
          M.at(g, [[0.68 * T, g => { S.at = ax(p.a, SUB); walkAll(S.at, q => { q._born = -1; }); S.lt = M.row(S.bx, S.pl, S.at); S.lt.id = 'lt'; S.e2.items = [S.lt, S.q2, S.c]; place();
            S.at.pop = g.t; M.sparkle(g, 'lt', { n: 10, cols: [SUB, '#fff'] }); g.sfx('pop'); hop(g); }]]); } }];
        // 2. combine the like terms
        if (!S.tl) return [{ tap: 'lt', busy: 0.1, askAt: 0.6 * T, after: 0.95 * T,
          ask: { v: M.row(M.num(p.k), M.vr('x')), wrong: [M.row(M.num(p.b * p.a), M.vr('x')), M.row(M.num(p.b - p.s * p.a), M.vr('x')), M.row(M.num(p.k), M.sup(M.vr('x'), M.num(2)))] },
          then(g) { S.tl = 1; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); M.circle(g, 'lt', { col: SUB, dur: 0.5 * T }); M.light(g, 'lt', { col: SUB });
            S.w = ax(p.k, KEY, 'w1'); note(g, [bx(p.b), M.op(sg), ax(p.a, SUB)], S.w, 'lt'); },
          resolve(g) { M.show(g, 0.95 * T); S.w.alpha = 1; M.writeIn(g, S.w, { dur: 0.22 * T }); M.indicate(g, S.w, { delay: 0.18 * T, dur: 0.3 * T, col: KEY }); g.sfx('ding');
            M.at(g, [[0.45 * T, g => { const from = { ...M.box(g, 'w1') }; S.kn = M.num(p.k, null, { col: KEY }); S.k = M.row(S.kn, M.vr('x', null, { col: KEY })); S.k.id = 'k'; S.k.alpha = 0;
              S.e2.items = [S.k, S.q2, S.c]; place(); g.sfx('coin');
              M.fly(g, { node: ax(p.k, KEY), from: [from.x, from.y], to: 'k', dur: 0.34 * T, arc: 30, s0: 30, s1: 44, then(g) { S.k.alpha = 1; S.k.pop = g.t; M.sparkle(g, 'k', { n: 10, cols: [KEY, '#fff'] }); hop(g); } }); }]]);
            noteGone(g, 0.62 * T); } }];
        // 3. divide both sides by k
        if (!S.td) return [{ tap: ['k', 'c'], busy: 0.1, askAt: 0.6 * T, after: 0.8 * T, ask: { v: p.x, wrong: [p.c - p.k, p.c * p.k, p.c] },
          then(g) { S.td = 1; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); M.circle(g, 'k', { dur: 0.45 * T, col: KEY }); g.sfx('tap');
            const dv = () => M.row(M.op('÷'), M.num(p.k));
            M.note(g, { node: dv(), at: 'k', off: [0, 42], s: 28, col: SUB, delay: 0.1 * T, write: 0.25 * T, hold: 0.55 * T, fade: 0.2 * T });
            M.note(g, { node: dv(), at: 'c', off: [0, 42], s: 28, col: SUB, delay: 0.2 * T, write: 0.25 * T, hold: 0.45 * T, fade: 0.2 * T }); },
          resolve(g) { M.show(g, 0.8 * T); M.tween(g, S.kn, { alpha: 0, sc: 0.4 }, 0.25 * T); M.roll(g, 'c', p.x, { dur: 0.35 * T }); S.c.col = SUB; g.sfx('ding');
            M.at(g, [[0.28 * T, g => { S.e2.items = [M.vr('x', 'xr'), S.q2, S.c]; place(); M.inert(g, ['xr']); }],
              [0.4 * T, g => { M.inert(g, ['c']); S.winAt = g.t; M.sparkle(g, 'c', { n: 14, cols: [SUB, KEY, '#fff'] }); g.sfx('chime'); hop(g, 'laugh'); S.point = false; }]]); } }];
        return [];
      },
      area(g) { return !S.subAt ? ['rhs', 'yb'] : !S.tl ? ['lt'] : ['k']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'library', panel: 'chalk', panelY: 300, panelH: 214 });
    host(g, c, 'owl', 296, 596, 1.3, -1);
    // a chalk brace groups the two equations into one system
    const b1 = M.box(g, 'q1'), b2 = M.box(g, 'q2'), xs = Math.min(...['ya', 'xb', 'lt', 'k', 'xr'].map(id => { const b = M.box(g, id), n = M.node(g, id); return b && n && !n.hide ? b.x - b.w / 2 : 1e9; }), 60);
    if (b1 && b2) { const x = Math.max(28, xs - 22), y0 = Y1 - 34, y1 = Y2 + 14, ym = (y0 + y1) / 2;
      c.save(); c.strokeStyle = 'rgba(251,248,238,0.8)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
      c.moveTo(x + 8, y0); c.quadraticCurveTo(x, y0, x, y0 + 14); c.lineTo(x, ym - 10); c.quadraticCurveTo(x, ym, x - 8, ym); c.quadraticCurveTo(x, ym, x, ym + 10); c.lineTo(x, y1 - 14); c.quadraticCurveTo(x, y1, x + 8, y1); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'e1'); M.drawEx(g, c, 'e2'); M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
