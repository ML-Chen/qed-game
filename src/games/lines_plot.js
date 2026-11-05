// lines_plot.js — PLOT! Plot the point (3, −2) on a treasure map spread on the sand at sunset. An ant starts at the
// origin (0, 0) and walks to the point. The x-coordinate is orange like the x-axis, the y-coordinate blue like the y-axis.
// Three moves, each acted out by itself (show your work):
//   1. drag the 3 (the x-coordinate) onto the x-axis: the 3 lights up orange and the ant walks 3 steps right along the
//      x-axis, leaving footprints and a numbered pebble at every step (1, 2, 3), while "3 right" writes beside it.
//   2. drag the −2 onto the y-axis: the −2 lights up blue and the ant walks 2 steps down ("2 down").
//   3. tap the ant: a red X drops onto the spot with a bounce and a flag, and "(3, −2)" writes itself beside it.
// The y-coordinate may go first (the ant walks up or down first, then across). The classic mistake, the 3 dropped on
// the y-axis (which would plot (−2, 3)), only wobbles.
// Coordinates run from −4 to 4 on a map from −5 to 5. Level 0: both coordinates positive. Level 1: one coordinate negative. Level 2: any signs.
// Medium mode: step 3 asks which pair names the spot ((3, −2) or the swapped (−2, 3), ...).
const M = MK, CX = 180, CY = 388, U = 28, N = 5, EY = 214, XC = '#e8701a', YC = '#2a6ad0', INK = '#4a2a14';
const gx = v => CX + v * U, gy = v => CY - v * U;
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), sg = () => g.rand() < 0.5 ? -1 : 1;
  for (let i = 0; i < 50; i++) {
    let x = ri(1, 4), y = ri(1, 4); // the map runs to 5; 4 keeps the ant and its label clear of the edges
    if (L === 1) { if (g.rand() < 0.5) x = -x; else y = -y; }
    if (L === 2) { x *= sg(); y *= sg(); }
    if (Math.abs(x) === Math.abs(y) && i < 40) continue; // a swapped pair should look different
    return { x, y };
  }
  return { x: 3, y: -2 };
}
const pair = (x, y, o = {}) => M.paren(M.row(M.num(x, o.xi, { col: o.xc }), M.op(',', o.ci), M.gap(6), M.num(y, o.yi, { col: o.yc })), o.id);
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the beach at sunset with the map (baked) ----------------
function beach(c, W, H) {
  const sand = c.createLinearGradient(0, 0, 0, H); sand.addColorStop(0, '#f0c890'); sand.addColorStop(1, '#d8a868'); c.fillStyle = sand; c.fillRect(0, 0, W, H);
  // sea along the top, lit by the low sun
  const sea = c.createLinearGradient(0, 0, 0, 170); sea.addColorStop(0, '#2a6a9a'); sea.addColorStop(1, '#5aa8c0'); c.fillStyle = sea; c.beginPath(); c.moveTo(0, 0); c.lineTo(W, 0); c.lineTo(W, 150); for (let x = W; x >= 0; x -= 20) c.lineTo(x, 150 + Math.sin(x * 0.04) * 10); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,210,150,0.35)'; for (let i = 0; i < 10; i++) c.fillRect(40 + i * 30 + (i % 3) * 7, 20 + i * 12, 40 - i * 2, 3);
  c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 4; c.beginPath(); for (let x = 0; x <= W; x += 20) c.lineTo(x, 152 + Math.sin(x * 0.04) * 10); c.stroke();
  const R = P.rng(21); c.fillStyle = 'rgba(160,110,60,0.25)'; for (let i = 0; i < 140; i++) { c.beginPath(); c.arc(R() * W, 170 + R() * 470, 0.8 + R() * 1.6, 0, 7); c.fill(); }
  // shells and a starfish
  c.fillStyle = '#ffe8e0'; for (const [x, y] of [[26, 560], [330, 200], [320, 600]]) { c.beginPath(); c.arc(x, y, 7, Math.PI, 0); c.fill(); }
  c.fillStyle = '#f07a5a'; c.save(); c.translate(36, 196); c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 5 : 13, a = i * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.fill(); c.restore();
  // the map: parchment with torn edges and a soft shadow
  const x0 = gx(-N) - 20, x1 = gx(N) + 20, y0 = gy(N) - 20, y1 = gy(-N) + 20, edge = (a, b, n, f) => { for (let i = 0; i <= n; i++) f(a + (b - a) * i / n, (R() - 0.5) * 6); };
  const path = () => { c.beginPath(); edge(x0, x1, 16, (x, j) => c.lineTo(x, y0 + j)); edge(y0, y1, 16, (y, j) => c.lineTo(x1 + j, y)); edge(x1, x0, 16, (x, j) => c.lineTo(x, y1 + j)); edge(y1, y0, 16, (y, j) => c.lineTo(x0 + j, y)); c.closePath(); };
  c.save(); c.translate(5, 8); c.fillStyle = 'rgba(90,50,20,0.3)'; path(); c.fill(); c.restore();
  const pg = c.createRadialGradient(CX, CY, 40, CX, CY, 230); pg.addColorStop(0, '#fbf0d4'); pg.addColorStop(1, '#e8cc98'); c.fillStyle = pg; path(); c.fill(); c.strokeStyle = 'rgba(120,80,40,0.5)'; c.lineWidth = 2; c.stroke();
  // grid lines, the axes in their colours with arrowheads, and the numbers along them
  c.lineWidth = 1; c.strokeStyle = 'rgba(120,80,40,0.25)'; for (let k = -N; k <= N; k++) { c.beginPath(); c.moveTo(gx(k), gy(N)); c.lineTo(gx(k), gy(-N)); c.stroke(); c.beginPath(); c.moveTo(gx(-N), gy(k)); c.lineTo(gx(N), gy(k)); c.stroke(); }
  const axis = (col, ax, ay, bx, by) => { c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); const an = Math.atan2(by - ay, bx - ax); for (const [px, py, a] of [[bx, by, an], [ax, ay, an + Math.PI]]) { c.beginPath(); c.moveTo(px + Math.cos(a) * 6, py + Math.sin(a) * 6); c.lineTo(px + Math.cos(a + 2.5) * 9, py + Math.sin(a + 2.5) * 9); c.lineTo(px + Math.cos(a - 2.5) * 9, py + Math.sin(a - 2.5) * 9); c.fill(); } };
  axis(XC, gx(-N) - 10, CY, gx(N) + 10, CY); axis(YC, CX, gy(-N) - 10, CX, gy(N) + 10);
  c.font = MK.NUMF(14, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let k = -N; k <= N; k++) { if (!k) continue; c.fillStyle = XC; c.fillText(String(k).replace('-', '−'), gx(k), CY + 14); c.fillStyle = YC; c.fillText(String(k).replace('-', '−'), CX - 13, gy(k)); }
  c.font = MK.VARF(17); c.fillStyle = XC; c.fillText('x', gx(N) + 4, CY - 14); c.fillStyle = YC; c.fillText('y', CX + 14, gy(N) - 4);
  // a compass rose in the corner of the map
  c.save(); c.translate(gx(N) - 22, gy(-N) + 22); c.globalAlpha = 0.55; c.fillStyle = '#8a5a2a'; for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(0, -14); c.lineTo(4, 0); c.lineTo(-4, 0); c.fill(); } c.restore();
}

MG.add({
  id: 'lines_plot', stage: 'lines', cmd: 'PLOT!', hint: 'drag', time: 9, mood: 'bright', winText: 'Plotted!', hold: 1.6,
  card: {
    title: 'Plotting points', ref: 'Grade 5', kind: 'Coordinate plane',
    text: 'A point on a grid is named by two numbers in brackets, like (3, −2). They are its coordinates.\n\nAlways start at the middle, the origin (0, 0). The first number, x, says how far to go across: right if it is positive, left if it is negative. The second number, y, says how far to go up or down: up if it is positive, down if it is negative.\n\nSo for (3, −2), walk 3 steps right, then 2 steps down, and mark the spot.\n\nThe order matters. (−2, 3) is a different point: 2 steps left and 3 steps up.',
    note: 'In (x, y), go x across first (right if positive, left if negative), then y up or down (up if positive, down if negative).',
    ask: 'Which point is 4 steps left and 1 step up? Plot (2, −5).',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { x, y } = S;
    S.flipX = g.rand() < 0.5; S.ant = { x: 0, y: 0 }; S.walk = null; S.prints = []; S.pebbles = []; S.face = 1; S.point = false;
    S.ex = pair(x, y, { xi: 'px', yi: 'py', ci: 'pc', id: 'pp' }); M.place(g, 'ex', S.ex, CX, EY, 44, { col: INK }); M.inert(g, ['pc', 'pp']);
    M.zone(g, 'xa', { x: CX, y: CY, w: 2 * N * U + 20, h: 26 }); M.zone(g, 'ya', { x: CX, y: CY, w: 26, h: 2 * N * U + 20 });
    M.zone(g, 'xt', { x: gx(x), y: CY, w: 28, h: 28 }); M.zone(g, 'yt', { x: CX, y: gy(y), w: 28, h: 28 }); // the ticks the coordinates belong on (where the ghost hand drags to)
    S.antZone = () => M.zone(g, 'ant', { x: gx(S.ant.x), y: gy(S.ant.y) - 6, w: 34, h: 34 }); S.antZone();
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = (e) => { g.s.mk.lastMove = g.t; S.mood = e || 'wow'; S.moodT = g.t; };
    // walk along one axis, one grid step at a time; each step leaves a numbered pebble
    const walk = (g, axis) => {
      const T = M.pace(g), v = axis === 'x' ? x : y, n = Math.abs(v), sd = Math.min(0.3 * T, 1.0 * T / n), col = axis === 'x' ? XC : YC, id = axis === 'x' ? 'px' : 'py';
      M.show(g, 0.35 * T + n * sd + 0.3 * T); S.point = true; hop('think');
      M.light(g, id, { col }); M.indicate(g, id, { sc: 1.35, dur: 0.4 * T, col });
      const from = { ...S.ant }, to = axis === 'x' ? { x: from.x + v, y: from.y } : { x: from.x, y: from.y + v };
      const words = axis === 'x' ? (v > 0 ? ' right' : ' left') : (v > 0 ? ' up' : ' down');
      // the coordinate flies from the bracket down to the axis, landing on its tick
      const b = { ...M.box(g, id) }, tick = axis === 'x' ? [gx(v), CY + 14] : [CX - 13, gy(v)];
      M.fly(g, { node: M.num(v, null, { col }), from: [b.x, b.y], to: tick, dur: 0.32 * T, arc: -30, s0: 44, s1: 16, then(g) { S.tickGlow = { axis, v, t0: g.t }; g.sfx('tap'); } });
      M.at(g, [[0.35 * T, g => { S.walk = { from, to, t0: g.t, dur: n * sd, axis, col, n, done: 0 }; if (axis === 'x') S.face = v > 0 ? 1 : -1;
          const mid = axis === 'x' ? [gx(from.x + v / 2), gy(from.y) + (from.y > 0 || (from.y === 0 && y > 0) ? 30 : -30)] : [(d => gx(from.x) + (gx(from.x) + d * 46 > 300 || gx(from.x) + d * 46 < 60 ? -d : d) * 46)(from.x > 0 || (from.x === 0 && x > 0) ? 1 : -1), gy(from.y + v / 2)];
          M.note(g, { node: M.row(M.num(n, null, { col }), M.txt(words, null, { col })), at: mid, s: 25, col, write: 0.3 * T, hold: n * sd, fade: 0.25 * T }); }],
        [0.35 * T + n * sd + 0.02, g => { S.ant = to; S.walk = null; S.antZone(); hop('happy'); g.sfx('ding', { pitch: axis === 'x' ? 1 : 1.2 }); S.point = false; M.unlight(g, id, { dur: 0.4 * T }); }]]);
    };
    M.play(g, {
      moves(g) {
        const out = [], T = M.pace(g);
        if (!S.xd) out.push({ drag: 'px', to: ['xt', 'xa'], busy: 0.1, then: g => { S.xd = true; walk(g, 'x'); } });
        if (!S.yd) out.push({ drag: 'py', to: ['yt', 'ya'], busy: 0.1, then: g => { S.yd = true; walk(g, 'y'); } });
        if (S.xd && S.yd && !S.dropped) out.push({ tap: 'ant', busy: 0.1, askAt: 0.55 * T, after: 0.8 * T,
          ask: { v: pair(x, y), wrong: [pair(y, x), S.flipX ? pair(-x, y) : pair(x, -y)] },
          then(g) { S.dropped = true; M.show(g, 0.55 * T); S.point = true; hop('laugh');
            S.pin = { t0: g.t, dur: 0.4 * T }; S.step = { t0: g.t, dx: S.x > 0 ? -0.75 : 0.75 }; /* the ant steps aside so the X lands on the spot */ M.at(g, [[0.4 * T, g => { g.sfx('thud'); g.burst(gx(x), gy(y), ['#e84a3a', '#fff', '#f0c890'], 12, 110); M.indicate(g, 'pp', { sc: 1.15, dur: 0.4 * T }); }]]); },
          resolve(g) { M.show(g, 0.8 * T); // the point's name writes itself beside the X
            const lab = pair(x, y, { xc: XC, yc: YC, id: 'lab' }), lx = M.clamp(gx(x) + (x > 0 ? 50 : -50), 64, 296), ly = gy(y) + (y > 0 ? -22 : 30);
            M.place(g, 'lab', lab, lx, ly, 26, { col: INK }); M.inert(g, ['lab']); S.labT = g.t; M.writeIn(g, lab, { dur: 0.4 * T }); g.sfx('coin');
            M.at(g, [[0.5 * T, g => { M.sparkle(g, 'lab', { n: 12, cols: ['#e84a3a', '#ffd040', '#fff'] }); S.point = false; }]]); } });
        return out;
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.tap || mv.drag) : null; },
    });
  },
  update(g, dt) {
    const S = g.s, W = S.walk;
    if (W) { const k = M.clamp((g.t - W.t0) / W.dur, 0, 1), steps = Math.floor(k * W.n + 1e-6);
      while (W.done < steps) { W.done++; const p = W.axis === 'x' ? { x: W.from.x + Math.sign(W.to.x - W.from.x) * W.done, y: W.from.y } : { x: W.from.x, y: W.from.y + Math.sign(W.to.y - W.from.y) * W.done };
        S.pebbles.push({ ...p, i: W.done, col: W.col, t0: g.t }); g.sfx('tap', { vol: 0.4, pitch: 0.9 + W.done * 0.1 }); }
      const e = k, cx = W.from.x + (W.to.x - W.from.x) * e, cy = W.from.y + (W.to.y - W.from.y) * e;
      if (!S.lastPrint || Math.hypot(cx - S.lastPrint.x, cy - S.lastPrint.y) > 0.32) { S.lastPrint = { x: cx, y: cy, side: !(S.lastPrint && S.lastPrint.side), axis: W.axis }; S.prints.push(S.lastPrint); }
      S.antPos = { x: cx, y: cy }; } else S.antPos = null;
    M.update(g, dt);
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    c.drawImage(g.bake('lines_plot_map', beach), 0, 0, 360, 640);
    // the sunset glow over the sea and a slow wave line
    c.save(); c.globalCompositeOperation = 'lighter'; const sg = c.createRadialGradient(300, 20, 10, 300, 20, 220); sg.addColorStop(0, 'rgba(255,170,90,0.35)'); sg.addColorStop(1, 'rgba(255,170,90,0)'); c.fillStyle = sg; c.fillRect(0, 0, 360, 260); c.restore();
    c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= 360; x += 12) c.lineTo(x, 160 + Math.sin(x * 0.04 + t * 1.5) * 4 + Math.sin(t * 0.8) * 3); c.stroke();
    // the coordinate pair on a parchment ribbon, with small x and y labels under its numbers
    c.fillStyle = 'rgba(90,50,20,0.3)'; rr(c, 92, EY - 34, 180, 62, 14); c.fill(); c.fillStyle = '#fbf0d4'; rr(c, 90, EY - 38, 180, 62, 14); c.fill(); c.strokeStyle = 'rgba(120,80,40,0.5)'; c.lineWidth = 2; c.stroke();
    M.drawEx(g, c, 'ex');
    c.font = M.VARF(18); c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const [id, l, col] of [['px', 'x', XC], ['py', 'y', YC]]) { const b = M.box(g, id); if (b) { c.fillStyle = col; c.fillText(l, b.x, EY + 17); } }
    // a tick lights up where its coordinate landed
    if (S.tickGlow) { const q = S.tickGlow, k = (t - q.t0) / 0.8; if (k < 1) { const [px, py] = q.axis === 'x' ? [gx(q.v), CY + 14] : [CX - 13, gy(q.v)]; c.save(); c.globalAlpha = 1 - k; c.fillStyle = q.axis === 'x' ? XC : YC; c.shadowColor = c.fillStyle; c.shadowBlur = 12; c.beginPath(); c.arc(px, py, 11 + k * 6, 0, 7); c.fill(); c.restore(); } }
    // footprints and the numbered pebbles of each step
    for (const p of S.prints) { c.fillStyle = 'rgba(90,50,20,0.35)'; const ox = p.axis === 'x' ? 0 : (p.side ? 3 : -3), oy = p.axis === 'x' ? (p.side ? 3 : -3) : 0; c.beginPath(); c.ellipse(gx(p.x) + ox, gy(p.y) + oy, 2.2, 1.6, 0, 0, 7); c.fill(); }
    for (const p of S.pebbles) { const k = M.clamp((t - p.t0) / 0.25, 0, 1), r = 9 * (0.5 + 0.5 * M.ease(k)) * (1 + Math.sin(k * Math.PI) * 0.3); c.fillStyle = p.col; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(gx(p.x), gy(p.y), r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#fff'; c.font = M.NUMF(11, 700); c.fillText(String(p.i), gx(p.x), gy(p.y) + 1); }
    // the X and its flag drop onto the spot
    if (S.pin) { const k = M.clamp((t - S.pin.t0) / S.pin.dur, 0, 1), bounce = k < 1 ? (1 - M.easeIO(k)) * -120 : 0, sq = k >= 1 ? Math.max(0, 1 - (t - S.pin.t0 - S.pin.dur) / 0.25) : 0, px = gx(S.x), py = gy(S.y);
      c.save(); c.translate(px, py + bounce); c.scale(1 + sq * 0.3, 1 - sq * 0.25); c.strokeStyle = '#d83a2a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-9, -9); c.lineTo(9, 9); c.moveTo(9, -9); c.lineTo(-9, 9); c.stroke();
      c.strokeStyle = '#5a3a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -34); c.stroke(); const wv = Math.sin(t * 6) * 3; c.fillStyle = '#e84a3a'; c.beginPath(); c.moveTo(0, -34); c.quadraticCurveTo(10, -32 + wv, 18, -28); c.lineTo(0, -22); c.fill(); c.restore(); }
    if (K.ex.lab) { const b = M.box(g, 'lab'); if (b) { c.save(); c.globalAlpha *= M.clamp((t - S.labT) / 0.2, 0, 1); c.fillStyle = 'rgba(251,240,212,0.92)'; rr(c, b.x - b.w / 2 - 6, b.y - b.h / 2 - 4, b.w + 12, b.h + 8, 8); c.fill(); c.restore(); } M.drawEx(g, c, 'lab'); }
    // the ant: walking along the grid, or standing on its spot (and pointing while the work is shown)
    const pos = S.antPos || S.ant, hopK = !S.walk && K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const miss = K.missAt >= 0 && t - K.missAt < 0.5;
    const expr = won ? 'laugh' : lost || miss ? 'sad' : S.moodT != null && t - S.moodT < 0.6 ? S.mood : 'happy', pose = won ? 'cheer' : S.walk ? 'walk' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    const side = S.step ? S.step.dx * M.easeIO((t - S.step.t0) / 0.25) : 0, ax = gx(pos.x + side) + (miss ? Math.sin((t - K.missAt) * 40) * 3 : 0), ay = gy(pos.y) + 6 - hopK * 12;
    if (typeof ANI !== 'undefined') ANI.draw(c, 'ant', ax, ay, 0.75, { t, pose, expr, facing: S.face }); else SCN.host(g, c, 'ant', ax, ay, 0.75);
    M.drawUI(g, c);
  },
});
