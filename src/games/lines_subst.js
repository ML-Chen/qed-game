// lines_subst.js — SUBSTITUTION! Solve the system y = ax, bx ± y = c, on a chalkboard in a library.
// Drag the ax from the first equation onto the y in the second: it becomes bx ± ax = c (the substituted part is
// chalked in yellow). Tap the like terms to combine them, then tap the equation to divide: x is found.
// Level 0: x + y = c. Level 1: bx + y = c. Level 2: bx − y = c (the substituted term is subtracted).
// Medium mode: combining the like terms and the division open a tray.
const M = MK, INK = SCN.ink('chalk'), SUB = '#ffe07a', KEY = '#9adcff';
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
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    S.e1 = M.row(M.vr('y', 'ya'), M.op('=', 'q1'), ax(p.a, null, 'rhs'));
    S.e2 = M.row(bx(p.b, 'xb'), M.op(p.s < 0 ? '-' : '+', 'pl'), M.vr('y', 'yb'), M.op('=', 'q2'), M.num(p.c, 'c'));
    const place = S.place = () => { M.place(g, 'e1', S.e1, 180, 248, 44, { col: INK }); M.place(g, 'e2', S.e2, 180, 340, 44, { col: INK }); };
    place(); M.inert(g, ['q1', 'q2', 'pl']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const fx = (g, id, cols) => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, cols, 12, 120); };
    M.play(g, {
      moves(g) {
        if (!S.subAt) return [{ drag: 'rhs', to: 'yb', reach: 70, busy: 0.1, then(g) {
          S.subAt = g.t; g.sfx('swoosh');
          const lt = M.row(bx(p.b), M.op(p.s < 0 ? '-' : '+'), ax(p.a, SUB)); lt.id = 'lt';
          S.e2 = M.row(lt, M.op('=', 'q2'), M.num(p.c, 'c')); place(); fx(g, 'lt', [SUB, '#fff']); } }];
        if (!S.tl) return [{ tap: 'lt', busy: 0.1, ask: { v: M.row(M.num(p.k), M.vr('x')), wrong: [M.row(M.num(p.b * p.a), M.vr('x')), M.row(M.num(p.b - p.s * p.a), M.vr('x')), M.row(M.num(p.k), M.sup(M.vr('x'), M.num(2)))] },
          then() { S.tl = 1; }, resolve(g) { const k = ax(p.k, KEY, 'k'); k.pop = g.t; S.e2 = M.row(k, M.op('=', 'q2'), M.num(p.c, 'c')); S.combAt = g.t; place(); g.sfx('coin'); fx(g, 'k', [KEY, '#fff']); } }];
        if (!S.td) return [{ tap: ['k', 'c'], busy: 0.1, ask: { v: p.x, wrong: [p.c - p.k, p.c * p.k, p.c] },
          then() { S.td = 1; }, resolve(g) { S.e2 = M.row(M.vr('x'), M.op('=', 'q2'), M.num(p.x, 'ans', { pop: g.t, col: SUB })); M.inert(g, ['ans']); S.winAt = g.t; place(); g.sfx('chime'); fx(g, 'ans', [SUB, KEY, '#fff']); } }];
        return [];
      },
      area(g) { return !S.subAt ? ['rhs', 'yb'] : !S.tl ? ['lt'] : ['k']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'library', panel: 'chalk', host: 'owl', hostX: 296, hostY: 596, hostS: 1.3, panelY: 294, panelH: 196 });
    // a chalk brace groups the two equations into one system
    const b1 = M.box(g, 'q1'), b2 = M.box(g, 'q2'), xs = Math.min(...['ya', 'xb', 'lt', 'k'].map(id => { const b = M.box(g, id), n = M.node(g, id); return b && n && !n.hide ? b.x - b.w / 2 : 1e9; }), 60);
    if (b1 && b2) { const x = Math.max(28, xs - 22), y0 = 214, y1 = 352, ym = (y0 + y1) / 2;
      c.save(); c.strokeStyle = 'rgba(251,248,238,0.8)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
      c.moveTo(x + 8, y0); c.quadraticCurveTo(x, y0, x, y0 + 14); c.lineTo(x, ym - 10); c.quadraticCurveTo(x, ym, x - 8, ym); c.quadraticCurveTo(x, ym, x, ym + 10); c.lineTo(x, y1 - 14); c.quadraticCurveTo(x, y1, x + 8, y1); c.stroke(); c.restore(); }
    // a chalk arrow from the expression for y to the y it replaces, as the substitution happens
    if (S.subAt && t - S.subAt < 0.6) { const a = M.box(g, 'rhs'), k = M.ease((t - S.subAt) / 0.25), al = 1 - M.clamp((t - S.subAt - 0.3) / 0.3, 0, 1), bb = M.box(g, 'lt');
      if (a && bb) { const tx = bb.x + bb.w / 2 - 20, ty = bb.y - bb.h / 2 - 4; c.save(); c.globalAlpha = al; c.strokeStyle = SUB; c.lineWidth = 3; c.setLineDash([5, 6]); c.beginPath(); c.moveTo(a.x, a.y + a.h / 2 + 2); c.lineTo(M.lerp(a.x, tx, k), M.lerp(a.y + a.h / 2 + 2, ty, k)); c.stroke(); c.restore(); } }
    M.drawEx(g, c, 'e1'); M.drawEx(g, c, 'e2');
    M.drawUI(g, c);
  },
});
