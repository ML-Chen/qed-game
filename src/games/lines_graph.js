// lines_graph.js — GRAPH LINE! Graph y = mx + b by dragging two glowing points on a grid in the night sky.
// A straight line hangs between two fireflies. Each firefly can be dragged; it snaps to the grid's whole-number
// points as it moves, and the line follows. Every landing acts out its working (show your work):
//   1. A firefly dropped on the graph is checked: a dashed line drops to the x-axis and reads off x, the equation's x
//      swells, the substitution writes itself beside the firefly ("2 · 3 − 2 = 4"), a dashed line runs across to the
//      y-axis at that height, and the firefly turns green with a sparkle.
//   2. When both fireflies are on the graph, the line locks and turns gold. The b of the equation is circled and flies
//      to the y-axis, where (0, b) lands; then the slope climbs out of it as a staircase: q across, then p up.
// This file handles the continuous drag itself (like calc_tangent.js). It still runs on MK.play: moves(g) returns one
// drag move (the next firefly to its next point, which the kit's guidance glows and demonstrates) until the line
// locks, then an empty list, so the kit's own update() awards the stars and wins.
// Level 0: slope 1 or 2. Level 1: negative slopes too. Level 2: fraction slopes such as ½ or −2/3.
// Medium mode: when the b is circled, the player picks where the line crosses the y-axis from a tray.
// Wrong moves: tapping the equation (it cannot be moved) wobbles it and counts. A firefly dropped off the line just
// stays where it was dropped.
const M = MK, CX = 180, CY = 372, U = 28, N = 5, GOLD = '#ffd45a', LINE = '#ff9ad0', RUN = '#8af0b0', RISE = '#ff9a8a', NOTE = '#fff4dc';
const gx = x => CX + x * U, gy = y => CY - y * U;
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), R = a => a[Math.floor(g.rand() * a.length)];
  const [p, q] = L === 0 ? R([[1, 1], [2, 1]]) : L === 1 ? R([[-1, 1], [-2, 1], [2, 1], [3, 1], [-3, 1]]) : R([[1, 2], [-1, 2], [2, 3], [-2, 3], [3, 2], [-3, 2]]);
  let b; do { b = L === 1 ? r(-3, 3) : r(-2, 2); } while (Math.abs(b + p) > 4); // the slope staircase from (0, b) stays on the grid
  const on = [];
  for (let x = -N; x <= N; x++) { if (((p * x) % q) !== 0) continue; const y = b + p * x / q; if (Math.abs(y) <= N) on.push({ x, y }); }
  on.sort((u, v) => Math.abs(u.x) - Math.abs(v.x) || u.x - v.x);
  const off = (x, y) => Math.abs(y - (b + p * x / q)) >= 1.5;
  let h0, h1; do { h0 = { x: r(-4, -1), y: r(-4, 4) }; h1 = { x: r(1, 4), y: r(-4, 4) }; } while (!off(h0.x, h0.y) || !off(h1.x, h1.y));
  return { p, q, b, on, h: [h0, h1] };
}
const onLine = (S, h) => h.y * S.q === S.b * S.q + S.p * h.x;
// the equation; the slope part is 'sl' (or the x itself when the slope is 1), the constant is 'bn'
function eqNode(S) {
  const { p, q, b } = S, neg = p < 0, a = Math.abs(p);
  const coef = q === 1 ? (a === 1 ? null : M.num(a)) : M.frac(M.num(a), M.num(q));
  const sl = neg || coef ? M.row(neg ? M.op('-') : null, coef) : null; if (sl) sl.id = 'sl';
  const r = M.row(M.vr('y'), M.op('='), sl, M.vr('x', 'xv'), b ? M.op(b < 0 ? '-' : '+') : null, b ? M.num(Math.abs(b), 'bn') : null); r.id = 'eq'; return r;
}
// the check for a point: the equation with the point's x put in ("2 · 3 − 2 = 4")
function subNode(S, x, y) {
  const { p, q, b } = S, a = Math.abs(p), xv = x < 0 ? M.paren(M.num(x)) : M.num(x), it = [];
  if (q === 1 && a === 1) { if (p < 0) it.push(x > 0 ? M.num(-x) : x === 0 ? M.num(0) : M.row(M.txt('−'), xv)); else it.push(xv); }
  else { it.push(q === 1 ? M.num(p) : p < 0 ? M.row(M.txt('−'), M.frac(M.num(a), M.num(q))) : M.frac(M.num(a), M.num(q)), M.op('·'), xv); }
  if (b) it.push(M.op(b < 0 ? '-' : '+'), M.num(Math.abs(b)));
  it.push(M.op('='), M.num(y, null, { col: '#c8ff8a' })); return M.row(...it);
}
const yint = b => M.paren(M.row(M.num(0), M.op(','), M.gap(4), M.num(b)));
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
// a firefly landed on the graph: check it by putting its x into the equation
function check(g, i, lockNext) {
  const S = g.s, T = S.T, h = S.h[i], X = gx(h.x), Y = gy(h.y);
  M.show(g, (lockNext ? 1.05 : 1.2) * T); S.point = true; hop(g, 'think');
  const nd = subNode(S, h.x, h.y); nd.id = 'chkn'; const w = M.lay(nd, 20).w, nx = M.clamp(X, gx(-N) + w / 2 + 10, gx(N) - w / 2 - 10), ny = Y > gy(N) + 70 ? Y - 46 : Y + 50;
  S.chk = { i, x: h.x, y: h.y, t0: g.t, T, nd, w }; M.place(g, 'chk', nd, nx, ny + 7, 20, { col: NOTE }); nd.alpha = 0;
  M.indicate(g, 'xv', { delay: 0.2 * T, dur: 0.35 * T, col: '#c8ff8a', sc: 1.35 });
  M.at(g, [[0.22 * T, g => { nd.alpha = 1; M.writeIn(g, nd, { dur: 0.42 * T }); g.sfx('swoosh'); }],
    [0.78 * T, g => { S.ok[i] = g.t; g.sfx('ding'); hop(g); g.burst(X, Y, ['#c8ff8a', '#fff', GOLD], 10, 110); }],
    [0.95 * T, g => { M.tween(g, nd, { alpha: 0 }, 0.22 * T); }],
    [(lockNext ? 1.05 : 1.2) * T, g => { if (S.chk && S.chk.nd === nd) { S.chk = null; delete g.s.mk.ex.chk; } if (!lockNext) S.point = false; }]]);
}
// both fireflies are on the graph: the line locks; b goes to the y-axis and the slope climbs out of it
function lock(g) {
  const S = g.s, T = S.T; S.lockAt = g.t; g.sfx('snap'); g.sfx('magic'); M.show(g, 0.4 * T); S.point = true;
  const bt = S.b ? 'bn' : 'eq'; M.circle(g, bt, { col: GOLD, dur: 0.45 * T }); M.light(g, bt, { col: GOLD });
  const rest = 1.35 * T, mv = { ask: { v: yint(S.b), wrong: [M.paren(M.row(M.num(S.b), M.op(','), M.gap(4), M.num(0))), S.b ? yint(-S.b) : null, yint(S.b + S.p), yint(S.b + 1)] }, after: rest,
    resolve(g) { S.answered = true; M.show(g, rest); const from = { ...M.box(g, bt) };
      M.fly(g, { node: S.b ? M.num(S.b) : M.num(0), from: [S.b ? from.x : gx(0) + 14, from.y], to: [gx(0), gy(S.b)], dur: 0.4 * T, arc: -30, s0: 34, s1: 18, col: GOLD,
        then(g) { S.bAt = g.t; M.unlight(g, bt); g.sfx('coin'); hop(g); g.burst(gx(0), gy(S.b), [GOLD, '#fff', LINE], 14, 130); } });
      M.at(g, [[0.6 * T, g => { S.stAt = g.t; M.indicate(g, S.p === 1 && S.q === 1 ? 'xv' : 'sl', { dur: 0.4 * T, col: GOLD, sc: 1.25 }); g.sfx('tap'); }],
        [0.9 * T, g => { g.sfx('tap'); }],
        [1.15 * T, g => { g.sfx('chime'); hop(g, 'laugh'); g.burst(gx(S.q), gy(S.b + S.p), [GOLD, '#fff', RISE], 10, 110); S.point = false; }]]); } };
  if (g.mode === 'medium') M.later(g, 0.4 * T, g => M.openAsk(g, mv), true); else M.at(g, [[0.4 * T, mv.resolve]]);
}
function release(g) {
  const S = g.s, K = S.mk, i = S.drag.i; S.drag = null; K.moveT = g.t; K.lastMove = g.t; g.sfx('click');
  if (onLine(S, S.h[i]) && !S.lockAt) { const both = S.h.every(h => onLine(S, h)); check(g, i, both); if (both) M.at(g, [[1.05 * S.T, lock]]); }
}

MG.add({
  id: 'lines_graph', stage: 'lines', cmd: 'GRAPH LINE!', hint: 'drag', time: 10, winText: 'Graphed!', hold: 1.4,
  card: {
    title: 'Graphing y = mx + b', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'The equation y = mx + b describes a straight line. The number b is the y-intercept: the line crosses the y-axis at the point (0, b). The number m is the slope: for each step of 1 to the right, the line goes up by m, or down if m is negative.\n\nTo graph the line, plot the point (0, b). From there, go 1 to the right and m up, and plot a second point. Then draw the line through both points.\n\nFor example, for y = 2x + 1, plot (0, 1). One step right and 2 up gives (1, 3). The line through (0, 1) and (1, 3) is the graph.\n\nTwo points are enough, because exactly one straight line passes through any two points.',
    note: 'Start at (0, b) on the y-axis, then move 1 to the right and m up. For a fraction slope such as 2/3, move 3 to the right and 2 up.',
    ask: 'Which two points would you plot for y = 3x − 2? Which for y = ½x + 1?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.drag = null; S.ok = [0, 0]; S.T = M.pace(g);
    M.place(g, 'eq', eqNode(S), 180, 214, 36, { col: '#fff4dc' });
    const zones = () => { S.h.forEach((h, i) => M.zone(g, 'h' + i, { x: gx(h.x), y: gy(h.y), w: 30, h: 30 }));
      S.h.forEach((h, i) => { const o = S.h[1 - i], t = S.on.find(pt => !(pt.x === o.x && pt.y === o.y)) || S.on[0]; M.zone(g, 't' + i, { x: gx(t.x), y: gy(t.y), w: 16, h: 16 }); S['t' + i] = t; }); };
    S.zones = zones; zones();
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        if (S.answered) return [];
        if (S.lockAt || S.h.every(h => onLine(S, h))) return [{ drag: [], to: [] }]; // the lock's working (and the tray) still to come
        const i = S.h.findIndex(h => !onLine(S, h));
        return [{ drag: 'h' + i, to: 't' + i }];
      },
      area(g) { const i = S.h.findIndex(h => !onLine(S, h)); return i < 0 ? null : 'h' + i; },
    });
  },
  update(g, dt) { M.update(g, dt); if (!S_locked(g)) g.s.zones(); },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (S.lockAt || M.showing(g)) return;
    let bi = -1, bd = 26; S.h.forEach((h, i) => { const d = Math.hypot(x - gx(h.x), y - gy(h.y)); if (d < bd) { bd = d; bi = i; } });
    if (bi >= 0) { S.drag = { i: bi }; S.ok[bi] = 0; g.sfx('buzz'); return; }
    const e = M.box(g, 'eq'); if (e && Math.abs(x - e.x) < e.w / 2 + 8 && Math.abs(y - e.y) < e.h / 2 + 10) M.miss(g, { tap: 'eq' });
  },
  move(g, x, y) {
    const S = g.s, D = S.drag; if (!D || g.done) return; const h = S.h[D.i], o = S.h[1 - D.i];
    const nx = M.clamp(Math.round((x - CX) / U), -N, N), ny = M.clamp(Math.round((CY - y) / U), -N, N);
    if ((nx !== h.x || ny !== h.y) && !(nx === o.x && ny === o.y)) { h.x = nx; h.y = ny; g.sfx('tap'); }
  },
  up(g, x, y) { const S = g.s; if (g.done) return; if (S.drag) { this.move(g, x, y); release(g); } },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.bot) { const b = S.bot, k = M.clamp((g.t - b.t0) / 0.35, 0, 1), x = M.lerp(b.a.x, b.b.x, M.easeIO(k)), y = M.lerp(b.a.y, b.b.y, M.easeIO(k));
      synth('move', x, y); if (k >= 1) { synth('up', x, y); S.bot = null; S.botNext = g.t + 0.3; } return; }
    if (g.t < (S.botNext ?? 0.4) || S.lockAt || M.showing(g)) return;
    const i = S.h.findIndex(h => !onLine(S, h)); if (i < 0) return; const h = S.h[i], t = S['t' + i];
    synth('down', gx(h.x), gy(h.y)); S.bot = { t0: g.t, a: { x: gx(h.x), y: gy(h.y) }, b: { x: gx(t.x), y: gy(t.y) } };
  },
  draw(g, c) {
    const S = g.s, t = g.t, lk = S.lockAt ? M.ease((t - S.lockAt) / 0.3) : 0;
    SCN.std(g, c, { scene: 'night', panel: 'none' }); host(g, c, 'fox', 300, 604, 1.15, -1);
    // the grid: a dark glass pane with faint lines, brighter axes and a number every other step
    const x0 = gx(-N) - 10, y0 = gy(N) - 10, w = 2 * N * U + 20;
    c.save(); c.fillStyle = 'rgba(8,10,40,0.6)'; c.beginPath(); c.roundRect(x0, y0, w, w, 14); c.fill(); c.strokeStyle = 'rgba(160,180,255,0.35)'; c.lineWidth = 1.5; c.stroke();
    c.lineWidth = 1; for (let k = -N; k <= N; k++) { c.strokeStyle = k ? 'rgba(150,170,255,0.18)' : 'rgba(220,230,255,0.75)'; c.lineWidth = k ? 1 : 2;
      c.beginPath(); c.moveTo(gx(k), gy(N)); c.lineTo(gx(k), gy(-N)); c.stroke(); c.beginPath(); c.moveTo(gx(-N), gy(k)); c.lineTo(gx(N), gy(k)); c.stroke(); }
    c.font = '600 11px Fredoka, Nunito, sans-serif'; c.fillStyle = 'rgba(220,230,255,0.6)'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let k = -4; k <= 4; k += 2) if (k) { c.fillText(String(k).replace('-', '−'), gx(k), gy(0) + 11); c.fillText(String(k).replace('-', '−'), gx(0) - 11, gy(k)); }
    c.font = 'italic 700 15px Georgia, serif'; c.fillStyle = 'rgba(230,236,255,0.85)'; c.fillText('x', gx(N) - 2, gy(0) - 10); c.fillText('y', gx(0) + 11, gy(N) + 4);
    // the line through the two fireflies, extended across the grid
    const [A, B] = S.h, dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, ex = dx / L * 30, ey = dy / L * 30;
    c.beginPath(); c.rect(x0, y0, w, w); c.clip();
    c.strokeStyle = lk ? GOLD : LINE; c.lineWidth = 3 + lk * 2; c.shadowColor = lk ? GOLD : LINE; c.shadowBlur = 10 + lk * 10;
    c.beginPath(); c.moveTo(gx(A.x - ex), gy(A.y - ey)); c.lineTo(gx(B.x + ex), gy(B.y + ey)); c.stroke(); c.shadowBlur = 0;
    // the check: dashed lines from the firefly to both axes, reading off x and then y
    const ck = S.chk; if (ck) { const T = ck.T, X = gx(ck.x), Y = gy(ck.y), e = ck.t0, out = 1 - M.clamp((t - e - 0.95 * T) / (0.22 * T), 0, 1);
      const kv = M.ease((t - e) / (0.22 * T)), kh = M.ease((t - e - 0.62 * T) / (0.22 * T));
      c.save(); c.globalAlpha = out; c.setLineDash([5, 5]); c.lineWidth = 2; c.strokeStyle = 'rgba(200,255,140,0.85)';
      if (kv > 0) { c.beginPath(); c.moveTo(X, Y); c.lineTo(X, M.lerp(Y, gy(0), kv)); c.stroke(); }
      if (kh > 0) { c.beginPath(); c.moveTo(X, Y); c.lineTo(M.lerp(X, gx(0), kh), Y); c.stroke(); }
      c.setLineDash([]); c.font = '700 14px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const tag = (v, x, y, k, col) => { if (k <= 0) return; c.globalAlpha = out * M.clamp(k, 0, 1); c.fillStyle = 'rgba(8,10,40,0.85)'; c.beginPath(); c.roundRect(x - 13, y - 10, 26, 20, 8); c.fill(); c.fillStyle = col; c.fillText(String(v).replace('-', '−'), x, y + 1); };
      if (ck.x !== 0) tag(ck.x, X, gy(0) + (ck.y >= 0 ? 13 : -13), kv * 3 - 2, NOTE);
      if (ck.y !== 0) tag(ck.y, gx(0) + (ck.x >= 0 ? -15 : 15), Y, kh * 3 - 2, '#c8ff8a');
      // a dark backing for the written check, so it reads over the grid and the line
      const bb = M.box(g, 'chkn'), nd = ck.nd; if (bb && nd.alpha > 0 && g.s.mk.ex.chk) { const wk = M.easeIO(M.clamp((t - e - 0.22 * T) / (0.42 * T), 0, 1));
        c.globalAlpha = out * 0.85 * (nd.alpha ?? 1); c.fillStyle = 'rgba(8,10,40,0.9)'; c.beginPath(); c.roundRect(bb.x - bb.w / 2 - 8, bb.y - bb.h / 2 - 6, (bb.w + 16) * Math.max(0.05, wk), bb.h + 12, 10); c.fill(); }
      c.restore(); }
    // once locked: (0, b) lands on the y-axis, then the staircase from it: q across and p up
    if (lk) {
      const T = S.T;
      if (S.stAt) { const ka = M.ease((t - S.stAt) / (0.3 * T)), kb = M.ease((t - S.stAt - 0.3 * T) / (0.3 * T));
        c.lineWidth = 3.5; c.lineCap = 'round'; c.strokeStyle = RUN; c.beginPath(); c.moveTo(gx(0), gy(S.b)); c.lineTo(gx(S.q * ka), gy(S.b)); c.stroke();
        if (kb > 0) { c.strokeStyle = RISE; c.beginPath(); c.moveTo(gx(S.q), gy(S.b)); c.lineTo(gx(S.q), gy(S.b + S.p * kb)); c.stroke(); }
        c.font = '700 14px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        const lab = (v, x, y, k, col) => { if (k <= 0) return; c.globalAlpha = M.clamp(k, 0, 1); c.fillStyle = 'rgba(8,10,40,0.85)'; c.beginPath(); c.roundRect(x - 14, y - 10, 28, 20, 8); c.fill(); c.fillStyle = col; c.fillText(v, x, y + 1); c.globalAlpha = 1; };
        lab('+' + S.q, gx(S.q / 2), gy(S.b) + (S.p > 0 ? 14 : -14), ka * 2 - 1, RUN);
        lab((S.p > 0 ? '+' : '−') + Math.abs(S.p), gx(S.q) + 20, gy(S.b + S.p / 2), kb * 2 - 1, RISE); }
      if (S.bAt) { const kk = M.ease((t - S.bAt) / 0.3); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 12; c.beginPath(); c.arc(gx(0), gy(S.b), (6 + Math.sin(t * 6)) * kk, 0, 7); c.fill(); c.shadowBlur = 0;
        const lx = gx(0) - 10, ly = gy(S.b) + (S.p > 0 ? -14 : 14), txt = `(0, ${S.b})`.replace('-', '−'); c.font = '700 15px Fredoka, Nunito, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
        const tw = c.measureText(txt).width; c.save(); c.beginPath(); c.rect(lx - tw - 6, ly - 12, (tw + 8) * M.clamp((t - S.bAt) / 0.3, 0, 1), 24); c.clip();
        c.fillStyle = 'rgba(8,10,40,0.85)'; c.beginPath(); c.roundRect(lx - tw - 5, ly - 10, tw + 10, 20, 8); c.fill(); c.fillStyle = GOLD; c.fillText(txt, lx, ly + 1); c.restore(); } }
    c.restore();
    // the fireflies: a soft glow, a bright body, little wings; a checked firefly glows green
    S.h.forEach((h, i) => { const X = gx(h.x), Y = gy(h.y), ok = !!S.ok[i] && onLine(S, h), held = S.drag && S.drag.i === i, fl = Math.sin(t * 9 + i * 2) * 3;
      const gr = c.createRadialGradient(X, Y, 0, X, Y, 26); gr.addColorStop(0, ok ? 'rgba(170,255,140,0.75)' : 'rgba(255,230,120,0.7)'); gr.addColorStop(1, 'rgba(255,230,120,0)');
      c.fillStyle = gr; c.beginPath(); c.arc(X, Y, 26, 0, 7); c.fill();
      c.fillStyle = 'rgba(220,235,255,0.7)'; c.beginPath(); c.ellipse(X - 6, Y - 7, 6, 3 + fl * 0.3, -0.6, 0, 7); c.ellipse(X + 6, Y - 7, 6, 3 - fl * 0.3, 0.6, 0, 7); c.fill();
      const pk = ok ? M.clamp((t - S.ok[i]) / 0.35, 0, 1) : 1, sw = ok ? 1 + Math.sin(pk * Math.PI) * 0.6 : 1;
      c.fillStyle = ok ? '#c8ff8a' : '#fff3a0'; c.beginPath(); c.arc(X, Y, (held ? 8 : 6.5) * sw, 0, 7); c.fill(); c.strokeStyle = '#3a2a10'; c.lineWidth = 1.5; c.stroke(); });
    M.drawEx(g, c, 'eq'); M.drawEx(g, c, 'chk'); M.drawAnims(g, c);
    if (!S.drag && !S.lockAt) M.drawGuide(g, c);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
function S_locked(g) { return !!g.s.lockAt; }
