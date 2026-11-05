// matrices_det.js — DETERMINANT! det [a b; c d] = ad − bc, on a chalkboard in a library.
// Moves (any valid order): drag a onto d (or d onto a) along the main diagonal: a glowing stroke draws itself along the
// diagonal, a and d swell as it passes, and copies of them fly down into the first slot of the working line as "a · d".
// Drag b onto c (or c onto b) for the other diagonal: "b · c" fills the second slot. Tap each product: it is circled
// and its diagonal flashes, then the first factor slides into the second, which rolls over to the product. When both
// are numbers, tap the minus: the second product slides into the first, which rolls over to the determinant.
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
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g);
    const e = (v, id) => M.num(v, id, { col: INK });
    S.prob = M.row(M.txt('det', 'det'), M.gap(10), M.mat([[e(p.a, 'a'), e(p.b, 'b')], [e(p.c, 'c'), e(p.d, 'd')]], 'mat'));
    S.minus = M.op('-', 'minus');
    S.work = M.row(M.op('=', 'eq'), M.gap(6), M.slot('s1', { w: 74, col: C1 }), S.minus, M.slot('s2', { w: 74, col: C2 }));
    const place = () => { M.place(g, 'prob', S.prob, 180, 272, 52, { col: INK }); M.place(g, 'work', S.work, 180, 378, 40, { col: INK }); };
    S.relay = place; place();
    M.inert(g, ['det', 'mat', 'eq', 's1', 's2']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false; S.flash = {};
    const hop = (g, ex) => { S.hopT = g.t; S.face = ex || 'wow'; S.faceT = g.t; };
    const slotIdx = k => k === 1 ? 2 : 4;
    // a diagonal: its stroke draws itself from one corner to the other, each entry swells as the stroke reaches it,
    // and copies of the two entries fly down into the slot, where they land as "x · y"
    const diag = (k) => {
      const [x, y, ix, iy, id, col] = k === 1 ? [p.a, p.d, 'a', 'd', 'p1', C1] : [p.b, p.c, 'b', 'c', 'p2', C2];
      return { busy: 0.1, then(g) {
        S['d' + k] = { t0: g.t, dur: 0.5 * T }; g.sfx('sweep'); M.show(g, 1.05 * T); S.point = true; hop(g, 'think');
        M.indicate(g, ix, { col, dur: 0.35 * T, sc: 1.35 }); M.indicate(g, iy, { col, delay: 0.32 * T, dur: 0.35 * T, sc: 1.35 });
        const sb = M.box(g, 's' + k);
        M.fly(g, { node: M.num(x, null, { col }), from: ix, to: [sb.x - 24, sb.y], delay: 0.2 * T, dur: 0.45 * T, arc: -30, s0: 52, s1: 40 });
        M.fly(g, { node: M.num(y, null, { col }), from: iy, to: [sb.x + 24, sb.y], delay: 0.45 * T, dur: 0.42 * T, arc: -30, s0: 52, s1: 40 });
        M.at(g, [[0.88 * T, g => {
          const fx = M.num(x, null, { col, _born: -1 }), fy = M.num(y, null, { col, _born: -1 }), dot = M.op('·', null, { col });
          const r = M.row(k === 2 && x < 0 ? M.paren(fx) : fx, dot, y < 0 ? M.paren(fy) : fy); r.id = id; S['f' + k] = { fx, fy, dot, row: r };
          S.work.items[slotIdx(k)] = r; place(); M.sparkle(g, id, { n: 8, cols: [col, '#fff'] }); g.sfx('pop'); hop(g);
          if (S.d1 && S.d2) S.point = false; }]]);
      } };
    };
    // a product: it is circled with its diagonal lit; then the first factor and the dot slide into the second,
    // which rolls over to the product like an odometer
    const prodMove = k => { const [x, y, col] = k === 1 ? [p.a, p.d, C1] : [p.b, p.c, C2], v = x * y, pid = 'p' + k;
      return { tap: pid, busy: 0.1, askAt: 0.45 * T, after: 0.85 * T,
        ask: { v, wrong: k === 1 ? [p.a + p.d, p.a * p.b, p.a * p.c, -v] : [p.b + p.c, p.b * p.d, p.a * p.c, -v] },
        then(g) { S['t' + k] = 1; M.show(g, 0.45 * T); S.flash[k] = g.t; M.circle(g, pid, { col, dur: 0.5 * T }); hop(g, 'think'); },
        resolve(g) { M.show(g, 0.85 * T); const F = S['f' + k], yb = M.box(g, pid);
          for (const n of [F.fx, F.dot]) { M.tween(g, n, { dx: 30, alpha: 0, sc: 0.6 }, 0.26 * T); }
          M.at(g, [[0.26 * T, g => { F.fy.id = 'r' + k; F.fy.dx = 0; S['v' + k] = v; M.inert(g, ['r' + k]);
            S.work.items[slotIdx(k)] = k === 2 && v < 0 ? M.paren(F.fy) : F.fy; place();
            M.roll(g, F.fy, v, { dur: 0.36 * T }); g.sfx('coin'); }],
            [0.62 * T, g => { M.sparkle(g, 'r' + k, { cols: [col, '#fff', '#ffe9a0'] }); M.indicate(g, 'r' + k, { col, dur: 0.3 * T }); hop(g, 'laugh'); }]]);
        } }; };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.d1) out.push({ drag: 'a', to: 'd', reach: 80, ...diag(1) }, { drag: 'd', to: 'a', reach: 80, ...diag(1) });
        if (!S.d2) out.push({ drag: 'b', to: 'c', reach: 80, ...diag(2) }, { drag: 'c', to: 'b', reach: 80, ...diag(2) });
        if (S.f1 && !S.t1) out.push(prodMove(1));
        if (S.f2 && !S.t2) out.push(prodMove(2));
        // the subtraction: the second product slides into the first, and the first rolls over to the determinant
        if (S.v1 != null && S.v2 != null && !S.fin) out.push({ tap: 'minus', busy: 0.1, askAt: 0.5 * T, after: 1.0 * T, ask: { v: S.v1 - S.v2, wrong: [S.v1 + S.v2, S.v2 - S.v1, p.a * p.b - p.c * p.d] },
          then(g) { S.fin = 1; M.show(g, 0.5 * T); S.point = true; hop(g, 'think'); M.circle(g, ['r1', 'minus', 'r2'], { dur: 0.55 * T }); M.indicate(g, 'minus', { delay: 0.15 * T, dur: 0.35 * T, sc: 1.5 }); },
          resolve(g) { M.show(g, 1.0 * T); const r1 = S.f1.fy, rest = S.work.items.slice(3), b1 = M.box(g, 'r1');
            for (const n of rest) { const nid = n.id || (n.inner && n.inner.id), b = nid ? M.box(g, nid) : null; M.tween(g, n, { dx: -(b && b1 ? b.x - b1.x : 70), alpha: 0, sc: 0.6 }, 0.3 * T); }
            M.at(g, [[0.3 * T, g => { r1.id = 'ans'; M.inert(g, ['ans']); S.work.items.splice(2); S.work.items.push(r1); place(); M.roll(g, r1, S.v1 - S.v2, { dur: 0.4 * T }); M.tween(g, r1, { hl: 1 }, 0.2 * T); r1.hlc = '#fff6c0'; g.sfx('chime'); }],
              [0.72 * T, g => { r1.col = INK; S.winT = g.t; M.sparkle(g, 'ans', { n: 16, v: 150, cols: [C1, C2, '#fff'] }); M.tween(g, r1, { sc: 1.25 }, 0.25 * T, { yoyo: true }); hop(g, 'laugh'); S.point = false; }]]);
          } });
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
    SCN.std(g, c, { scene: 'library', panel: 'chalk', panelY: 300, panelH: 220 });
    // the X of the diagonals, chalked across the matrix: faint until its product is made, then a bright stroke draws itself
    for (const [k, i0, i1, col] of [[1, 'a', 'd', C1], [2, 'b', 'c', C2]]) {
      const A = M.box(g, i0), B = M.box(g, i1); if (!A || !B) continue;
      const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, x0 = A.x - ux * 26, y0 = A.y - uy * 26, x1 = B.x + ux * 26, y1 = B.y + uy * 26;
      const D = S['d' + k], kk = D ? M.easeIO((t - D.t0) / D.dur) : 0, fl = S.flash[k] != null ? Math.max(0, Math.sin(M.clamp((t - S.flash[k]) / 0.6, 0, 1) * Math.PI)) : 0;
      c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.globalAlpha = 0.22; c.lineWidth = 9; c.setLineDash([4, 10]);
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.setLineDash([]);
      if (kk > 0) { const glow = kk < 1 ? 1 : fl; c.globalAlpha = 0.5 + 0.35 * glow; c.shadowColor = col; c.shadowBlur = 6 + 16 * glow; c.lineWidth = 12; c.beginPath(); c.moveTo(x0, y0); c.lineTo(M.lerp(x0, x1, kk), M.lerp(y0, y1, kk)); c.stroke();
        if (kk < 1) { c.globalAlpha = 1; c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(M.lerp(x0, x1, kk), M.lerp(y0, y1, kk), 6, 0, 7); c.fill(); } }
      c.restore();
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    // the hedgehog points at the board while the work is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', 290, 600 - hk * 24, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'hedgehog', 290, 600, 1.25);
    M.drawUI(g, c);
  },
});
