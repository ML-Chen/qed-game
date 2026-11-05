// lines_elim.js — ELIMINATION! Solve a₁x + by = c₁, a₂x − by = c₂ by adding the equations, on a sign at the beach.
// Drag one equation onto the other (either way): they are added like a column sum. A plus sign and a rule appear,
// the +by and −by are struck out because they cancel, and the sum (a₁ + a₂)x = c₁ + c₂ is written under the rule.
// Tap the sum to divide: x is found.
// Level 0: x + y = s, x − y = d. Level 1: different x-coefficients. Level 2: ±2y, and a constant may be negative.
// Medium mode: adding the constants and the division open a tray.
const M = MK, INK = SCN.ink('sign'), HI = '#ffe08a', OUT = '#ff8a7a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const a1 = L === 0 ? 1 : r(1, 3), a2 = L === 0 ? 1 : r(1, 3), b = L === 2 ? 2 : 1, x = r(2, 7), y = L === 2 ? r(1, 6) : r(1, x - 1);
    if (L === 1 && a1 === 1 && a2 === 1) continue;
    const c1 = a1 * x + b * y, c2 = a2 * x - b * y;
    if (L < 2 && c2 <= 0) continue;
    return { a1, a2, b, x, y, c1, c2, k: a1 + a2, s: c1 + c2 };
  }
}
const xt = (a, id, o) => { const r = M.row(a === 1 ? null : M.num(a, null, o), M.vr('x', null, o)); r.id = id; return r; };
const yt = (sg, b, id) => { const r = M.row(M.op(sg), b === 1 ? null : M.num(b), M.vr('y')); r.id = id; return r; };
const nm = v => v < 0 ? M.paren(M.num(v)) : M.num(v);

MG.add({
  id: 'lines_elim', stage: 'lines', cmd: 'ELIMINATION!', hint: 'drag', time: 8, winText: 'Eliminated!', hold: 1.4,
  card: {
    title: 'Solving by elimination', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'A system of equations is two equations that must both be true at the same time. Elimination solves it by adding the two equations so that one variable disappears.\n\nYou add equations by adding the left sides together and the right sides together. If one equation has +y and the other has −y, the y terms cancel, and only x is left.\n\nFor example, add x + y = 10 and x − y = 2. The left sides give x + x + y − y = 2x. The right sides give 10 + 2 = 12. So 2x = 12, and x = 6. Then y = 10 − 6 = 4.\n\nThis works because adding equal amounts to both sides of an equation keeps it true, and the second equation says its two sides are equal amounts.',
    note: 'Add the equations, left side to left side and right side to right side. When a variable has opposite signs, it cancels.',
    ask: 'Solve x + y = 8 and x − y = 2. Solve 2x + y = 11 and x − y = 1.',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    S.e1 = M.row(xt(p.a1, 'x1'), yt('+', p.b, 'y1'), M.op('=', 'q1'), M.num(p.c1, 'c1')); S.e1.id = 'e1';
    S.e2 = M.row(xt(p.a2, 'x2'), yt('-', p.b, 'y2'), M.op('=', 'q2'), M.num(p.c2, 'c2')); S.e2.id = 'e2';
    // every line is placed so that its = sign sits under the one above, as in a column sum
    const at = (key, node, y, s) => { M.place(g, key, node, 180, y, s, { col: INK }); const q = M.box(g, 'q1'), m = M.box(g, key === 'e1' ? 'q1' : key === 'e2' ? 'q2' : 'q3'); if (q && m && key !== 'e1') M.place(g, key, node, 180 + q.x - m.x, y, s, { col: INK }); };
    const place = S.place = () => { at('e1', S.e1, 248, 40); at('e2', S.e2, 304, 40); if (S.e3) at('e3', S.e3, 376, 40); };
    place(); M.inert(g, ['q1', 'q2', 'q3']);
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const add = { busy: 0.1, ask: { v: p.s, wrong: [p.c1 - p.c2, p.c2 - p.c1, 2 * p.c1] }, then(g) {
      S.addAt = g.t; g.sfx('wave'); M.inert(g, ['x1', 'x2', 'y1', 'y2', 'c1', 'c2']);
      const cs = M.row(M.num(p.c1), M.op('+'), nm(p.c2)); cs.id = 'cs';
      S.e3 = M.row(xt(p.k, 'k', { col: HI }), M.op('=', 'q3'), cs); place(); const b = M.box(g, 'k'); if (b) g.burst(b.x, b.y, [HI, '#fff'], 10, 110); },
      resolve(g) { S.e3.items[2] = M.num(p.s, 'c3', { pop: g.t, col: HI }); place(); g.sfx('coin'); } };
    M.play(g, {
      moves(g) {
        if (!S.addAt) return [{ drag: ['e1', 'x1', 'y1', 'c1'], to: ['e2', 'x2', 'y2', 'c2'], reach: 70, ...add }, { drag: ['e2', 'x2', 'y2', 'c2'], to: ['e1', 'x1', 'y1', 'c1'], reach: 70, ...add }];
        if (!S.td) return [{ tap: ['k', 'c3'], busy: 0.1, ask: { v: p.x, wrong: [p.s - p.k, p.s * p.k, p.s] }, then() { S.td = 1; },
          resolve(g) { S.e3 = M.row(M.vr('x', null, { col: HI }), M.op('=', 'q3'), M.num(p.x, 'ans', { pop: g.t, col: HI })); M.inert(g, ['ans']); place(); g.sfx('chime'); const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, [HI, '#fff', '#7ad0ff'], 16, 140); } }];
        return [];
      },
      area(g) { return !S.addAt ? ['e1', 'e2'] : ['k']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'beach', panel: 'sign', host: 'turtle', hostX: 80, hostY: 600, hostS: 1.3, panelY: 300, panelH: 214 });
    M.drawEx(g, c, 'e1'); M.drawEx(g, c, 'e2');
    if (S.addAt) {
      const k = M.ease((t - S.addAt) / 0.25), e1 = M.box(g, 'e1'), e2 = M.box(g, 'e2');
      c.save(); c.strokeStyle = INK; c.lineCap = 'round';
      // the plus sign and the rule of a column sum
      if (e1 && e2) { const x0 = Math.min(e1.x - e1.w / 2, e2.x - e2.w / 2) - 30, x1 = Math.max(e1.x + e1.w / 2, e2.x + e2.w / 2) + 8, y = 326;
        c.lineWidth = 3.5; c.beginPath(); c.moveTo(x0, y); c.lineTo(M.lerp(x0, x1, k), y); c.stroke();
        c.lineWidth = 3; c.globalAlpha = k; c.beginPath(); c.moveTo(x0 + 2, 292); c.lineTo(x0 + 16, 292); c.moveTo(x0 + 9, 285); c.lineTo(x0 + 9, 299); c.stroke(); c.globalAlpha = 1; }
      // +by and −by cancel: a red stroke through each
      c.strokeStyle = OUT; c.lineWidth = 4;
      for (const id of ['y1', 'y2']) { const b = M.box(g, id); if (!b) continue; const kk = M.ease((t - S.addAt - 0.05) / 0.2); c.beginPath(); c.moveTo(b.x - b.w / 2, b.y + b.h / 2 - 2); c.lineTo(b.x - b.w / 2 + b.w * kk, b.y + b.h / 2 - 2 - (b.h - 4) * kk); c.stroke(); }
      c.restore();
      M.drawEx(g, c, 'e3');
    }
    M.drawUI(g, c);
  },
});
