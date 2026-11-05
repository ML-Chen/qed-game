// matrices_det.js — DETERMINANT! det [a b; c d] = ad − bc, on a chalkboard in a library.
// Moves (any valid order): drag a onto d (or d onto a) along the main diagonal: "a · d" fills the first slot of the
// working line. Drag b onto c (or c onto b) along the other diagonal: "b · c" fills the second slot. Tap each product
// to compute it. When both are numbers, tap the minus: the line becomes the determinant.
// The X of the two diagonals is chalked across the matrix; each stroke brightens when its product is made.
// Level 0: entries 1..5 with ad > bc. Level 1: entries 1..9. Level 2: some negative entries.
// Medium mode: each product and the subtraction open a tray.
const M = MK, INK = SCN.ink('chalk'), C1 = '#ffd45a', C2 = '#ff9a8a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    let [a, b, c, d] = L === 0 ? [r(2, 5), r(1, 4), r(1, 4), r(2, 5)] : L === 1 ? [r(1, 9), r(1, 9), r(1, 9), r(1, 9)] : [r(1, 6), r(1, 6), r(1, 6), r(1, 6)];
    if (L === 2) { const k = r(0, 3), v = [a, b, c, d]; v[k] = -v[k]; if (g.rand() < 0.35) v[(k + 2) % 4] *= -1; [a, b, c, d] = v; }
    if (L === 0 && a * d <= b * c) continue;
    if (a * d === b * c) continue;
    return { a, b, c, d };
  }
}
MG.add({
  id: 'det', stage: 'matrices', cmd: 'DETERMINANT!', hint: 'drag', time: 9, mood: 'night', winText: 'Determined!', hold: 1.4,
  card: {
    title: 'The determinant', ref: 'Grade 11 and up', kind: 'Precalculus',
    text: 'A matrix is a grid of numbers in square brackets. A 2 × 2 matrix has two rows and two columns. Its determinant is a single number made from the four entries.\n\nTo find it, multiply along the main diagonal, from the top left to the bottom right. Then multiply along the other diagonal, from the top right to the bottom left. Subtract the second product from the first. If the top row is a, b and the bottom row is c, d, the determinant is ad − bc.\n\nFor example, with top row 3, 1 and bottom row 2, 4, the determinant is 3 · 4 − 1 · 2 = 12 − 2 = 10.\n\nWhy it matters: a matrix moves every point of the plane, and it multiplies every area by its determinant. Here a square of area 1 becomes a parallelogram of area 10. A negative determinant means the shape was also flipped over.',
    note: 'For a 2 × 2 matrix, the determinant is ad − bc: the main diagonal product minus the other diagonal product.',
    ask: 'Top row 2, 5 and bottom row 1, 3: what is the determinant? Top row 4, 2 and bottom row 6, 3: what is it, and what happens to areas?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    const e = (v, id) => M.num(v, id, { col: INK });
    S.prob = M.row(M.txt('det', 'det'), M.gap(10), M.mat([[e(p.a, 'a'), e(p.b, 'b')], [e(p.c, 'c'), e(p.d, 'd')]], 'mat'));
    S.work = M.row(M.op('=', 'eq'), M.gap(6), M.slot('s1', { w: 74, col: C1 }), M.op('-', 'minus'), M.slot('s2', { w: 74, col: C2 }));
    const place = () => { M.place(g, 'prob', S.prob, 180, 272, 52, { col: INK }); M.place(g, 'work', S.work, 180, 378, 40, { col: INK }); };
    S.relay = place; place();
    M.inert(g, ['det', 'mat', 'eq', 's1', 's2']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    const prod = (x, y, id, col) => { const r = M.row(x < 0 && id === 'p2' ? M.paren(M.num(x, null, { col })) : M.num(x, null, { col, pop: g.t }), M.op('·'), y < 0 ? M.paren(M.num(y, null, { col })) : M.num(y, null, { col, pop: g.t })); r.id = id; return r; };
    const diag = (k) => {
      const [x, y, id, col] = k === 1 ? [p.a, p.d, 'p1', C1] : [p.b, p.c, 'p2', C2];
      return { busy: 0.1, then(g) { S['d' + k] = g.t; g.sfx('sweep'); S.work.items[k === 1 ? 2 : 4] = prod(x, y, id, col); place(); const b = M.box(g, id); if (b) g.burst(b.x, b.y, [col, '#fff'], 8, 90); } };
    };
    const done = k => { const v = k === 1 ? p.a * p.d : p.b * p.c; S['v' + k] = v; S.work.items[k === 1 ? 2 : 4] = k === 2 ? (v < 0 ? M.paren(M.num(v, 'r2', { pop: g.t })) : M.num(v, 'r2', { pop: g.t })) : M.num(v, 'r1', { pop: g.t }); M.inert(g, ['r' + k]); g.sfx('coin'); place(); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.d1) out.push({ drag: 'a', to: 'd', reach: 80, ...diag(1) }, { drag: 'd', to: 'a', reach: 80, ...diag(1) });
        if (!S.d2) out.push({ drag: 'b', to: 'c', reach: 80, ...diag(2) }, { drag: 'c', to: 'b', reach: 80, ...diag(2) });
        if (S.d1 && S.v1 == null && !S.t1) out.push({ tap: 'p1', busy: 0.1, ask: { v: p.a * p.d, wrong: [p.a + p.d, p.a * p.b, p.a * p.c, -p.a * p.d] }, then() { S.t1 = 1; }, resolve() { done(1); } });
        if (S.d2 && S.v2 == null && !S.t2) out.push({ tap: 'p2', busy: 0.1, ask: { v: p.b * p.c, wrong: [p.b + p.c, p.b * p.d, p.a * p.c, -p.b * p.c] }, then() { S.t2 = 1; }, resolve() { done(2); } });
        if (S.v1 != null && S.v2 != null && !S.fin) out.push({ tap: 'minus', busy: 0.1, ask: { v: S.v1 - S.v2, wrong: [S.v1 + S.v2, S.v2 - S.v1, p.a * p.b - p.c * p.d] },
          then() { S.fin = 1; }, resolve(g) { S.work.items.splice(2); S.work.items.push(M.num(S.v1 - S.v2, 'ans', { pop: g.t })); M.inert(g, ['ans']); S.winT = g.t; g.sfx('chime'); place(); const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, [C1, C2, '#fff'], 16, 140); } });
        return out;
      },
      area(g) { return !S.d1 ? ['a', 'd'] : !S.d2 ? ['b', 'c'] : S.v1 == null ? ['p1'] : S.v2 == null ? ['p2'] : ['minus']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'library', panel: 'chalk', host: 'hedgehog', hostX: 290, hostY: 600, hostS: 1.25, panelY: 300, panelH: 220 });
    // the X of the diagonals, chalked across the matrix: faint until its product is made, then a bright stroke
    for (const [k, i0, i1, col] of [[1, 'a', 'd', C1], [2, 'b', 'c', C2]]) {
      const A = M.box(g, i0), B = M.box(g, i1); if (!A || !B) continue;
      const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, x0 = A.x - ux * 26, y0 = A.y - uy * 26, x1 = B.x + ux * 26, y1 = B.y + uy * 26;
      const at = S['d' + k], kk = at ? M.ease((t - at) / 0.22) : 0;
      c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.globalAlpha = 0.22; c.lineWidth = 9; c.setLineDash([4, 10]);
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.setLineDash([]);
      if (kk > 0) { c.globalAlpha = 0.55; c.lineWidth = 12; c.beginPath(); c.moveTo(x0, y0); c.lineTo(M.lerp(x0, x1, kk), M.lerp(y0, y1, kk)); c.stroke(); }
      c.restore();
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    M.drawUI(g, c);
  },
});
