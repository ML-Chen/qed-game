// arrows_scalar.js — SCALAR MULT! k · (x, y) = (kx, ky), on a wooden sign at the beach with a small grid under the vector.
// Moves (any valid order): drag k onto x and onto y: a gold copy of k flies over and lands in front of that component,
// which reads "k · x", and that leg of the arrow on the grid lights up. When both are done, the k and its dot fade and the
// vector glides to the middle. Tap each product: it is circled, the k flies into the component, the component rolls over
// to k·x like an odometer, and on the grid that leg of the arrow stretches to k times its length while a "× k" note
// writes itself beside it and a dot pops at every step.
// Level 0: k = 2 or 3, positive components. Level 1: one negative component. Level 2: k may be negative (the arrow turns around).
// Medium mode: each product opens a tray once it is circled.
const M = MK, INK = SCN.ink('sign'), GOLD = '#ffd45a', XC = '#ff9a76', YC = '#8ef0b4', HX = 74, HY = 596;
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
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g);
    // persistent nodes, so symbols glide when the expression is rewritten
    S.kN = M.num(p.k, 'k', { col: GOLD }); S.dotN = M.op('·', 'dot');
    S.cp = {};
    for (const ax of ['x', 'y']) { const v = p[ax]; S.cp[ax] = { v, n: M.num(v, ax), kc: null, dot: null, par: null, stage: 0, st: null }; }
    S.cm = M.op(',', 'cm');
    const comp = ax => { const q = S.cp[ax];
      if (q.stage === 1) { if (!q.row) { q.row = M.row(q.kc, q.dot, q.v < 0 ? (q.par = M.paren(q.n)) : q.n); q.row.id = 'p' + ax; } return q.row; }
      return q.n; };
    S.vecN = M.paren(M.row(comp('x'), S.cm, M.gap(4), comp('y')), 'vec');
    S.build = () => {
      S.vecN.inner = M.row(comp('x'), S.cm, M.gap(4), comp('y'));
      const ex = S.kGone ? S.vecN : M.row(S.kN, S.dotN, S.vecN);
      M.place(g, 'ex', ex, 180, 240, 48, { col: INK });
    };
    S.relay = S.build; S.build(); M.inert(g, ['cm', 'vec', 'dot', 'rx', 'ry', 'kx', 'ky']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    // the grid: fit the origin, the vector and the stretched vector into the board under the expression
    const xs = [0, p.x, p.k * p.x], ys = [0, p.y, p.k * p.y], B = { x0: 40, x1: 320, y0: 282, y1: 422 };
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    S.u = Math.min(34, (B.x1 - B.x0) / (x1 - x0 + 1), (B.y1 - B.y0) / (y1 - y0 + 1));
    S.ox = (B.x0 + B.x1) / 2 - (x0 + x1) / 2 * S.u; S.oy = (B.y0 + B.y1) / 2 + (y0 + y1) / 2 * S.u; S.ext = [x0, x1, y0, y1];
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, e) => { S.hopT = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const kTxt = () => p.k < 0 ? M.paren(M.num(p.k)) : M.num(p.k);
    // the leg's current end in grid units (x leg along the axis, y leg up from its end)
    S.scale = ax => { const q = S.cp[ax]; if (!q.st) return 1; return M.lerp(1, p.k, M.easeIO((g.t - q.st.t0) / q.st.dur)); };
    const stretch = ax => ({ drag: 'k', to: ax, busy: 0.1,
      then(g) { const q = S.cp[ax], from = { ...M.box(g, 'k') }; M.show(g, 0.8 * T); S.point = true; hop(g, 'think');
        q.kc = M.num(p.k, 'k' + ax, { col: GOLD, alpha: 0 }); q.dot = M.op('·', 'd' + ax, { col: GOLD, _born: -1, alpha: 0 }); q.stage = 1; M.inert(g, [ax, 'd' + ax]); S.build();
        M.tween(g, q.dot, { alpha: 1 }, 0.3 * T, { delay: 0.25 * T }); g.sfx('whoosh');
        M.fly(g, { node: M.num(p.k, null, { col: GOLD }), from: [from.x, from.y], to: 'k' + ax, dur: 0.42 * T, arc: -50, s0: 48, s1: 48,
          then(g) { q.kc.alpha = 1; q.kc.pop = g.t; M.sparkle(g, 'k' + ax, { n: 8 }); g.sfx('pop'); hop(g); } });
        S.legGlow = { ax, t0: g.t + 0.35 * T }; M.light(g, q.n, { col: ax === 'x' ? XC : YC, delay: 0.4 * T });
        M.at(g, [[0.75 * T, g => { M.unlight(g, q.n); }]]);
        // once k has gone into both components, it and its dot fade and the vector glides to the middle
        if (S.cp.x.stage && S.cp.y.stage) { M.show(g, 1.15 * T);
          M.at(g, [[0.6 * T, g => { M.tween(g, S.kN, { alpha: 0, sc: 0.6 }, 0.3 * T); M.tween(g, S.dotN, { alpha: 0 }, 0.25 * T); }],
            [0.95 * T, g => { S.kGone = true; S.build(); g.sfx('swoosh'); }]]); }
      } });
    const calc = ax => { const q = S.cp[ax], v = q.v, kv = p.k * v; return { tap: 'p' + ax, busy: 0.1, askAt: 0.45 * T, after: 1.15 * T,
      ask: { v: kv, wrong: [p.k + v, -kv, kv + v, v] },
      then(g) { q.done = 1; M.show(g, 0.45 * T); S.point = true; hop(g, 'think');
        M.circle(g, 'p' + ax, { dur: 0.5 * T, col: ax === 'x' ? XC : YC }); M.indicate(g, q.kc, { delay: 0.1 * T, dur: 0.3 * T }); M.indicate(g, q.n, { delay: 0.22 * T, dur: 0.3 * T }); },
      resolve(g) { M.show(g, 1.15 * T);
        // k and the dot slide into the component and melt into it while it rolls over to k·v
        const tb = M.box(g, ax); for (const s of [q.kc, q.dot]) { const sb = M.box(g, s.id); M.tween(g, s, { dx: tb && sb ? tb.x - sb.x : 30, alpha: 0, sc: 0.5 }, 0.28 * T); }
        M.roll(g, q.n, kv, { delay: 0.12 * T, dur: 0.38 * T }); q.n.col = GOLD; M.light(g, q.n, { col: ax === 'x' ? XC : YC });
        // on the grid, the leg stretches to k times as long, and "× k" writes itself beside it
        q.st = { t0: g.t + 0.1 * T, dur: 0.8 * T };
        // the note sits just past the end of the stretched leg: beside the x leg on the axis, beside the middle of the y leg
        const ex = p.x * S.scale('x'), fx = ax === 'x' ? S.ox + p.k * p.x * S.u + (p.k * p.x > 0 ? 30 : -30) : S.ox + ex * S.u + (ex >= 0 ? 32 : -32);
        const fy = ax === 'x' ? S.oy + (p.k * p.y > 0 ? 6 : -6) : S.oy - p.k * p.y * S.u / 2;
        M.note(g, { node: M.row(M.op('×'), kTxt()), at: [fx, fy], s: 26, col: ax === 'x' ? XC : YC, write: 0.28 * T, hold: 0.55 * T, fade: 0.25 * T, delay: 0.1 * T });
        g.sfx('sweep');
        M.at(g, [
          [0.45 * T, g => { q.n.id = 'r' + ax; q.stage = 2; q.row = null; S.build(); }],
          [0.95 * T, g => { M.unlight(g, q.n); const e = [S.ox + p.x * S.scale('x') * S.u, S.oy - p.y * S.scale('y') * S.u]; g.burst(e[0], e[1], [GOLD, '#fff', ax === 'x' ? XC : YC], 12, 120); g.sfx('ding'); hop(g, 'laugh');
            if (S.cp.x.done && S.cp.y.done) S.point = false; }],
        ]); } }; };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.cp.x.stage) out.push(stretch('x'));
        if (!S.cp.y.stage) out.push(stretch('y'));
        if (S.cp.x.stage === 1 && !S.cp.x.done) out.push(calc('x'));
        if (S.cp.y.stage === 1 && !S.cp.y.done) out.push(calc('y'));
        return out;
      },
      area(g) { return !S.cp.x.stage || !S.cp.y.stage ? ['k'] : !S.cp.x.done ? ['px'] : ['py']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, u = S.u, ox = S.ox, oy = S.oy, [x0, x1, y0, y1] = S.ext;
    SCN.std(g, c, { scene: 'beach', panel: 'sign', panelY: 300, panelH: 260 });
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
    // the components as two legs: across along the x axis, then up; each lights when k is put on it and stretches when computed
    const sx = S.scale('x'), sy = S.scale('y'), vx = p.x * sx, vy = p.y * sy, changed = sx !== 1 || sy !== 1;
    const lg = S.legGlow, glowK = ax => { const q = S.cp[ax]; if (q.st && t - q.st.t0 < q.st.dur + 0.3) return 1; if (lg && lg.ax === ax && t > lg.t0) { const k = (t - lg.t0) / 0.6; return k < 1 ? Math.sin(k * Math.PI) : 0; } return 0; };
    const leg = (xa, ya, xb, yb, col, gk) => { c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.globalAlpha = 0.45 + 0.55 * gk; c.lineWidth = 3 + gk * 3; if (gk > 0) { c.shadowColor = col; c.shadowBlur = 12 * gk; }
      c.setLineDash([6, 5]); c.beginPath(); c.moveTo(ox + xa * u, oy - ya * u); c.lineTo(ox + xb * u, oy - yb * u); c.stroke(); c.restore(); };
    leg(0, 0, vx, 0, XC, glowK('x')); leg(vx, 0, vx, vy, YC, glowK('y'));
    // a dot pops at every whole step as a leg stretches, so the steps can be counted
    for (const ax of ['x', 'y']) { const q = S.cp[ax]; if (!q.st || t < q.st.t0) continue; const cur = ax === 'x' ? vx : vy, n = Math.floor(Math.abs(cur) + 1e-6), sg = Math.sign(cur);
      for (let i = 1; i <= n; i++) { const at = q.st.t0 + q.st.dur * (i / Math.max(1, Math.abs(p.k * q.v))), pk = M.clamp((t - at) / 0.2, 0, 1), r = 3.2 * (1 + Math.sin(pk * Math.PI) * 0.8);
        const px = ax === 'x' ? ox + sg * i * u : ox + vx * u, py = ax === 'x' ? oy : oy - sg * i * u; c.fillStyle = ax === 'x' ? XC : YC; c.beginPath(); c.arc(px, py, r, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(px, py, r * 0.45, 0, 7); c.fill(); } }
    // the original arrow stays as a pale ghost; the live arrow stretches one component at a time
    arrow(p.x, p.y, 'rgba(138,224,255,0.75)', 4, changed);
    if (changed) arrow(vx, vy, GOLD, 5);
    c.fillStyle = INK; c.beginPath(); c.arc(ox, oy, 3.5, 0, 7); c.fill();
    M.drawEx(g, c, 'ex');
    // the octopus points at the sign while the work is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', HX, HY - hk * 24, 1.2, { t, pose, expr }); else SCN.host(g, c, 'octopus', HX, HY, 1.2);
    M.drawUI(g, c);
  },
});
