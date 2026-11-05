// linalg_cross.js — CROSS PRODUCT! a × b for two 3D column vectors, by the cover-up method, on glass in deep space.
// Each component of a × b ignores its own row and cross-multiplies the other two rows. The player drags an entry of
// a onto an entry of b in a different row (or b onto a): the pair picks out the component whose row is left over,
// and that answer row is written at once as "a·b − c·d" in the right order, with an X of coloured lines across the
// two rows used. Tapping a written row computes it. Components may be done in any order.
// Wrong moves (they only wobble): dragging an entry onto the entry in its own row (that is the dot product),
// dragging within one vector, tapping × or =.
// Level 0: small vectors with zeros. Level 1: entries 1..6. Level 2: some negative entries.
// Medium mode: each tap on a written row opens a tray (wrong tiles: a sum instead of a difference, the sign flipped).
const M = MK, INK = SCN.ink('glass'), COLS = ['#e0457a', '#2a8ad0', '#2fa060'];
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    let a, b;
    if (L === 0) { a = [r(1, 3), r(1, 3), r(1, 3)]; b = [r(1, 3), r(1, 3), r(1, 3)]; const za = r(0, 2); a[za] = 0; b[(za + r(1, 2)) % 3] = 0; }
    else if (L === 1) { a = [r(1, 6), r(1, 6), r(1, 6)]; b = [r(1, 6), r(1, 6), r(1, 6)]; }
    else { a = [r(-3, 5), r(-3, 5), r(1, 4)]; b = [r(1, 5), r(-4, 4), r(-3, 5)]; }
    const c = cross(a, b); if (c.every(v => v === 0)) continue; if (L > 0 && c.some(v => v === 0) && g.rand() < 0.7) continue;
    return { a, b, c };
  }
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
// component i is a[j]·b[k] − a[k]·b[j] with (i, j, k) in cyclic order
const jk = i => [(i + 1) % 3, (i + 2) % 3];
const fac = (v, o) => v < 0 ? M.paren(M.num(v, null, o)) : M.num(v, null, o);
let RX0 = 212, RX1 = 340, RC = 276; // the answer column (set in init, just right of the = sign)

MG.add({
  id: 'linalg_cross', stage: 'linalg', cmd: 'CROSS PRODUCT!', hint: 'drag', time: 8, mood: 'night', winText: 'Crossed!', hold: 1.4,
  card: {
    title: 'The cross product', ref: 'College', kind: 'Linear algebra',
    text: 'The cross product a × b takes two arrows in 3D and makes a third arrow. The new arrow points straight out of the flat surface that a and b lie on, so it is perpendicular to both of them.\n\nEach part of the answer leaves out its own row. For the first part, cover the first row and multiply across the other two rows: a₂b₃ − a₃b₂. The second part is a₃b₁ − a₁b₃, and the third part is a₁b₂ − a₂b₁.\n\nFor example, (1, 2, 3) × (4, 5, 6) = (2·6 − 3·5, 3·4 − 1·6, 1·5 − 2·4) = (−3, 6, −3).\n\nYou can check the answer: its dot product with a is −3 + 12 − 9 = 0, so it really is perpendicular to a. Its length equals the area of the parallelogram that a and b make.',
    note: 'To find part i of a × b, cover row i and cross-multiply the other two rows. The three parts are a₂b₃ − a₃b₂, then a₃b₁ − a₁b₃, then a₁b₂ − a₂b₁. Watch the order in the middle part.',
    ask: 'What is (1, 0, 0) × (0, 1, 0)? What is (2, 1, 0) × (0, 3, 1)?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    const col = (v, p) => M.mat(v.map((x, i) => [M.num(x, p + i)]), p);
    S.prob = M.row(col(S.a, 'a'), M.op('×', 'times'), col(S.b, 'b'), M.op('=', 'eq'));
    M.place(g, 'prob', S.prob, 28, 312, 38, { col: INK, left: true });
    const eq = M.box(g, 'eq'); RX0 = eq.x + eq.w / 2 + 12; RC = (RX0 + RX1) / 2;
    M.inert(g, ['a', 'b']);
    S.comp = [0, 1, 2].map(i => ({ i, started: false, done: false }));
    const placeRes = i => { const q = S.comp[i], b = M.box(g, 'a' + i); const sz = q.done ? 32 : Math.min(21, 21 * (RX1 - RX0 - 10) / M.lay(q.node, 21).w); M.place(g, 'r' + i, q.node, RC, b.y + sz * 0.32, sz, { col: INK }); };
    S.comp.forEach((q, i) => { q.node = M.slot('w' + i, { w: 70, col: COLS[i] }); placeRes(i); });
    g.dur *= (2.6 + 1.05 * 6) / 8;
    const start = i => ({ busy: 0.1, reach: 40, then(g) {
      const q = S.comp[i], [j, k] = jk(i); q.started = g.t; g.sfx('sweep'); S.mk.lastMove = g.t;
      const o = { col: COLS[i], pop: g.t }; q.node = M.row(fac(S.a[j], o), M.op('·'), fac(S.b[k], o), M.op('-'), fac(S.a[k], o), M.op('·'), fac(S.b[j], o)); q.node.id = 'p' + i; placeRes(i);
    } });
    M.play(g, {
      moves(g) {
        const out = [];
        for (const q of S.comp) {
          const i = q.i, [j, k] = jk(i);
          if (!q.started) for (const [x, y] of [[j, k], [k, j]]) out.push({ drag: 'a' + x, to: 'b' + y, ...start(i) }, { drag: 'b' + y, to: 'a' + x, ...start(i) });
          else if (!q.tapped) out.push({ tap: 'p' + i, busy: 0.1, then() { q.tapped = true; },
            ask: { v: S.c[i], wrong: [S.a[j] * S.b[k] + S.a[k] * S.b[j], -S.c[i], S.a[j] * S.b[j] - S.a[k] * S.b[k], S.c[i] + 1] },
            resolve(g) { q.done = true; q.node = M.num(S.c[i], 'v' + i, { pop: g.t, col: COLS[i] }); M.inert(g, ['v' + i]); placeRes(i); g.sfx('coin'); const b = M.box(g, 'v' + i); if (b) g.burst(b.x, b.y, [COLS[i], '#fff'], 10, 110); } });
        }
        // the first move shown is the first component's down diagonal
        return out;
      },
      area(g) { const q = S.comp.find(q => !q.done); if (!q) return null; const [j, k] = jk(q.i); return q.started ? ['p' + q.i] : ['a' + j, 'b' + k]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'space', panel: 'glass', host: 'owl', hostX: 292, hostY: 598, hostS: 1.2, panelY: 300, panelH: 196 });
    // the answer column's brackets
    const top = M.box(g, 'a0'), bot = M.box(g, 'a2');
    if (top && bot) { c.save(); c.strokeStyle = INK; c.lineWidth = 2.6; c.lineCap = 'round'; const y0 = top.y - 27, y1 = bot.y + 27;
      for (const [x, d] of [[RX0 - 4, -1], [RX1 + 4, 1]]) { c.beginPath(); c.moveTo(x - d * 5, y0); c.lineTo(x, y0); c.lineTo(x, y1); c.lineTo(x - d * 5, y1); c.stroke(); } c.restore(); }
    // cover-up: the row a component leaves out gets a soft band; its X of products is drawn across the other rows
    const guide = S.comp.find(q => !q.started);
    for (const q of S.comp) {
      const [j, k] = jk(q.i), show = q.started && !q.done ? 1 : q === guide && !g.done ? 0.5 + 0.2 * Math.sin(t * 4) : 0; if (!show) continue;
      const A = M.box(g, 'a' + q.i), B = M.box(g, 'b' + q.i); if (!A || !B) continue;
      c.save(); c.globalAlpha = 0.5 * show; c.fillStyle = 'rgba(40,24,70,0.55)'; c.beginPath(); c.roundRect(A.x - 24, A.y - 20, B.x - A.x + 48, 40, 12); c.fill(); c.restore();
      if (!q.started) continue;
      c.save(); c.strokeStyle = COLS[q.i]; c.globalAlpha = 0.55; c.lineWidth = 3; c.lineCap = 'round';
      for (const [x, y] of [[j, k], [k, j]]) { const P = M.box(g, 'a' + x), Q = M.box(g, 'b' + y); c.beginPath(); c.moveTo(P.x + 10, P.y); c.lineTo(Q.x - 10, Q.y); c.stroke(); }
      c.restore();
    }
    M.drawEx(g, c, 'prob'); for (let i = 0; i < 3; i++) M.drawEx(g, c, 'r' + i);
    M.drawUI(g, c);
  },
});
