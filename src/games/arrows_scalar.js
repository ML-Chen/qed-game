// arrows_scalar.js — SCALAR MULT! k · (x, y) = (kx, ky), on a wooden sign at the beach with a small grid under the vector.
// Moves (any valid order): drag k onto x and onto y: each becomes "k · x" in place, and on the grid that leg of the
// arrow stretches to k times its length at once. When both are done, the k and its dot leave. Tap each product to compute it.
// Level 0: k = 2 or 3, positive components. Level 1: one negative component. Level 2: k may be negative (the arrow turns around).
// Medium mode: each product opens a tray.
const M = MK, INK = SCN.ink('sign'), GOLD = '#ffd45a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), nz = (m) => { let v = 0; while (!v) v = r(-m, m); return v; };
  for (;;) {
    const k = L < 2 ? r(2, 3) : [-3, -2, 2, 3][r(0, 3)];
    let x = L === 0 ? r(1, 3) : nz(3), y = L === 0 ? r(1, 3) : nz(3);
    if (L === 1 && (x < 0) === (y < 0)) { if (g.rand() < 0.5) x = -Math.abs(x), y = Math.abs(y); else x = Math.abs(x), y = -Math.abs(y); }
    if (Math.abs(k * x) > 6 || Math.abs(k * y) > 6) continue;
    return { k, x, y };
  }
}
MG.add({
  id: 'scalar', stage: 'arrows', cmd: 'SCALAR MULT!', hint: 'drag', time: 8, mood: 'sea', winText: 'Stretched!', hold: 1.4,
  card: {
    title: 'Multiplying a vector by a number', ref: 'Grade 11 and up', kind: 'Precalculus',
    text: 'A vector is an arrow with a length and a direction. We write it as a pair of numbers called components. (2, −1) means 2 steps right and 1 step down.\n\nMultiplying a vector by a number, called a scalar, multiplies each component by that number. For example, 3 · (2, −1) = (3 · 2, 3 · (−1)) = (6, −3).\n\nThe new arrow points the same way but is 3 times as long, because every step right and every step down is now 3 times as big. Multiplying by a negative number also turns the arrow around, so it points the opposite way.',
    note: 'To multiply a vector by a number, multiply each component by it: k · (x, y) = (kx, ky). The arrow gets k times as long.',
    ask: 'What is 4 · (1, −2)? What is −2 · (3, 5), and which way does it point?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    const comp = (v, ax) => {
      const did = S['d' + ax], got = S['c' + ax];
      if (!did) return M.num(v, ax);
      if (got == null) { const r = M.row(M.num(p.k, null, { col: GOLD, pop: S['d' + ax] }), M.op('·'), v < 0 ? M.paren(M.num(v)) : M.num(v)); r.id = 'p' + ax; return r; }
      return M.num(got, 'r' + ax, { pop: S['t' + ax], col: GOLD });
    };
    S.build = () => {
      const vec = M.paren(M.row(comp(p.x, 'x'), M.op(',', 'cm'), M.gap(4), comp(p.y, 'y')), 'vec');
      const ex = S.dx && S.dy ? vec : M.row(M.num(p.k, 'k', { col: GOLD }), M.op('·', 'dot'), vec);
      M.place(g, 'ex', ex, 180, 240, 48, { col: INK });
    };
    S.build(); M.inert(g, ['cm', 'vec', 'dot', 'rx', 'ry']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    // the grid: fit the origin, the vector and the stretched vector into the board under the expression
    const xs = [0, p.x, p.k * p.x], ys = [0, p.y, p.k * p.y], B = { x0: 40, x1: 320, y0: 282, y1: 422 };
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    S.u = Math.min(34, (B.x1 - B.x0) / (x1 - x0 + 1), (B.y1 - B.y0) / (y1 - y0 + 1));
    S.ox = (B.x0 + B.x1) / 2 - (x0 + x1) / 2 * S.u; S.oy = (B.y0 + B.y1) / 2 + (y0 + y1) / 2 * S.u; S.ext = [x0, x1, y0, y1];
    const stretch = ax => ({ drag: 'k', to: ax, busy: 0.1, then(g) { S['d' + ax] = g.t; g.sfx('whoosh'); S.build(); } });
    const calc = (ax, v) => ({ tap: 'p' + ax, busy: 0.1, ask: { v: p.k * v, wrong: [p.k + v, -p.k * v, p.k * v + v, v] },
      then() { S['q' + ax] = 1; }, resolve(g) { S['c' + ax] = p.k * v; S['t' + ax] = g.t; g.sfx('coin'); S.build(); const b = M.box(g, 'r' + ax); if (b) g.burst(b.x, b.y, [GOLD, '#fff'], 10, 110); } });
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.dx) out.push(stretch('x'));
        if (!S.dy) out.push(stretch('y'));
        if (S.dx && !S.qx) out.push(calc('x', p.x));
        if (S.dy && !S.qy) out.push(calc('y', p.y));
        return out;
      },
      area(g) { return !S.dx || !S.dy ? ['k'] : !S.qx ? ['px'] : ['py']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, u = S.u, ox = S.ox, oy = S.oy, [x0, x1, y0, y1] = S.ext;
    SCN.std(g, c, { scene: 'beach', panel: 'sign', host: 'octopus', hostX: 74, hostY: 596, hostS: 1.2, panelY: 300, panelH: 260 });
    // grid lines, with the axes a little brighter
    c.save(); c.lineWidth = 1;
    for (let i = Math.floor(x0 - 0.5); i <= Math.ceil(x1 + 0.5); i++) { c.strokeStyle = i ? 'rgba(255,244,220,0.3)' : 'rgba(255,244,220,0.7)'; c.lineWidth = i ? 1 : 2; c.beginPath(); c.moveTo(ox + i * u, oy - (y1 + 0.5) * u); c.lineTo(ox + i * u, oy - (y0 - 0.5) * u); c.stroke(); }
    for (let j = Math.floor(y0 - 0.5); j <= Math.ceil(y1 + 0.5); j++) { c.strokeStyle = j ? 'rgba(255,244,220,0.3)' : 'rgba(255,244,220,0.7)'; c.lineWidth = j ? 1 : 2; c.beginPath(); c.moveTo(ox + (x0 - 0.5) * u, oy - j * u); c.lineTo(ox + (x1 + 0.5) * u, oy - j * u); c.stroke(); }
    c.restore();
    const arrow = (vx, vy, col, w, dash) => {
      const ex = ox + vx * u, ey = oy - vy * u, L = Math.hypot(ex - ox, ey - oy); if (L < 2) return; const ux = (ex - ox) / L, uy = (ey - oy) / L;
      c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w; c.lineCap = 'round'; if (dash) c.setLineDash([5, 6]);
      c.beginPath(); c.moveTo(ox, oy); c.lineTo(ex - ux * w * 1.6, ey - uy * w * 1.6); c.stroke(); c.setLineDash([]);
      c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - ux * w * 3.2 - uy * w * 1.8, ey - uy * w * 3.2 + ux * w * 1.8); c.lineTo(ex - ux * w * 3.2 + uy * w * 1.8, ey - uy * w * 3.2 - ux * w * 1.8); c.closePath(); c.fill(); c.restore();
    };
    // the original arrow stays as a pale ghost; the live arrow stretches one component at a time
    const sx = S.dx ? M.lerp(1, p.k, M.ease((t - S.dx) / 0.25)) : 1, sy = S.dy ? M.lerp(1, p.k, M.ease((t - S.dy) / 0.25)) : 1;
    arrow(p.x, p.y, 'rgba(138,224,255,0.75)', 4, S.dx || S.dy);
    if (S.dx || S.dy) arrow(p.x * sx, p.y * sy, GOLD, 5);
    c.fillStyle = INK; c.beginPath(); c.arc(ox, oy, 3.5, 0, 7); c.fill();
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
