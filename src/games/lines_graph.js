// lines_graph.js — GRAPH LINE! Graph y = mx + b by dragging two glowing points on a grid in the night sky.
// A straight line hangs between two fireflies. Each firefly can be dragged; it snaps to the grid's whole-number
// points as it moves, and the line follows. When both fireflies sit on the graph of the equation, the slope and the
// intercept match: the line locks, turns gold, and the rise and run from the y-intercept are drawn on it.
// This file handles the continuous drag itself (like calc_tangent.js). It still runs on MK.play: moves(g) returns one
// drag move (the next firefly to its next point, which the kit's guidance glows and demonstrates) until the line
// locks, then an empty list, so the kit's own update() awards the stars and wins.
// Level 0: slope 1 or 2. Level 1: negative slopes too. Level 2: fraction slopes such as ½ or −2/3.
// Medium mode: when the line locks, the player picks where it crosses the y-axis from a tray.
// Wrong moves: tapping the equation (it cannot be moved) wobbles it and counts. A firefly dropped off the line just
// stays where it was dropped.
const M = MK, CX = 180, CY = 372, U = 28, N = 5, GOLD = '#ffd45a', LINE = '#ff9ad0';
const gx = x => CX + x * U, gy = y => CY - y * U;
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), R = a => a[Math.floor(g.rand() * a.length)];
  const [p, q] = L === 0 ? R([[1, 1], [2, 1]]) : L === 1 ? R([[-1, 1], [-2, 1], [2, 1], [3, 1], [-3, 1]]) : R([[1, 2], [-1, 2], [2, 3], [-2, 3], [3, 2], [-3, 2]]);
  const b = L === 1 ? r(-3, 3) : r(-2, 2), on = [];
  for (let x = -N; x <= N; x++) { if (((p * x) % q) !== 0) continue; const y = b + p * x / q; if (Math.abs(y) <= N) on.push({ x, y }); }
  on.sort((u, v) => Math.abs(u.x) - Math.abs(v.x) || u.x - v.x);
  const off = (x, y) => Math.abs(y - (b + p * x / q)) >= 1.5;
  let h0, h1; do { h0 = { x: r(-4, -1), y: r(-4, 4) }; h1 = { x: r(1, 4), y: r(-4, 4) }; } while (!off(h0.x, h0.y) || !off(h1.x, h1.y));
  return { p, q, b, on, h: [h0, h1] };
}
const onLine = (S, h) => h.y * S.q === S.b * S.q + S.p * h.x;
function eqNode(S) {
  const { p, q, b } = S, neg = p < 0, a = Math.abs(p);
  const slope = q === 1 ? (a === 1 ? [] : [M.num(a)]) : [M.frac(M.num(a), M.num(q))];
  const r = M.row(M.vr('y'), M.op('='), neg ? M.op('-') : null, ...slope, M.vr('x'), b ? M.op(b < 0 ? '-' : '+') : null, b ? M.num(Math.abs(b)) : null); r.id = 'eq'; return r;
}
const yint = b => M.paren(M.row(M.num(0), M.op(','), M.gap(4), M.num(b)));
function release(g) {
  const S = g.s, K = S.mk; S.drag = null; K.moveT = g.t; K.lastMove = g.t; g.sfx('click');
  if (S.h.every(h => onLine(S, h)) && !S.lockAt) {
    S.lockAt = g.t; g.sfx('snap'); g.sfx('magic'); g.burst(gx(0), gy(S.b), [GOLD, '#fff', LINE], 16, 140);
    if (g.mode === 'medium') M.openAsk(g, { ask: { v: yint(S.b), wrong: [M.paren(M.row(M.num(S.b), M.op(','), M.gap(4), M.num(0))), S.q === 1 && S.p !== S.b ? yint(S.p) : null, S.b ? yint(-S.b) : yint(1)] }, after: 0, resolve(g) { S.answered = true; } });
    else S.answered = true;
  }
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
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.drag = null;
    M.place(g, 'eq', eqNode(S), 180, 214, 36, { col: '#fff4dc' });
    const zones = () => { S.h.forEach((h, i) => M.zone(g, 'h' + i, { x: gx(h.x), y: gy(h.y), w: 30, h: 30 }));
      S.h.forEach((h, i) => { const o = S.h[1 - i], t = S.on.find(pt => !(pt.x === o.x && pt.y === o.y)) || S.on[0]; M.zone(g, 't' + i, { x: gx(t.x), y: gy(t.y), w: 16, h: 16 }); S['t' + i] = t; }); };
    S.zones = zones; zones();
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        if (S.answered) return [];
        if (S.lockAt) return [{ drag: [], to: [] }]; // waiting on the tray
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
    if (S.lockAt) return;
    let bi = -1, bd = 26; S.h.forEach((h, i) => { const d = Math.hypot(x - gx(h.x), y - gy(h.y)); if (d < bd) { bd = d; bi = i; } });
    if (bi >= 0) { S.drag = { i: bi }; g.sfx('buzz'); return; }
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
    if (g.t < (S.botNext ?? 0.4) || S.lockAt) return;
    const i = S.h.findIndex(h => !onLine(S, h)); if (i < 0) return; const h = S.h[i], t = S['t' + i];
    synth('down', gx(h.x), gy(h.y)); S.bot = { t0: g.t, a: { x: gx(h.x), y: gy(h.y) }, b: { x: gx(t.x), y: gy(t.y) } };
  },
  draw(g, c) {
    const S = g.s, t = g.t, lk = S.lockAt ? M.ease((t - S.lockAt) / 0.3) : 0;
    SCN.std(g, c, { scene: 'night', panel: 'none', host: 'fox', hostX: 300, hostY: 604, hostS: 1.15 });
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
    // once locked: the run and the rise from the y-intercept
    if (lk) { c.lineWidth = 3; c.lineCap = 'round'; c.strokeStyle = '#8af0b0'; c.beginPath(); c.moveTo(gx(0), gy(S.b)); c.lineTo(gx(S.q * lk), gy(S.b)); c.stroke();
      c.strokeStyle = '#ff9a8a'; c.beginPath(); c.moveTo(gx(S.q), gy(S.b)); c.lineTo(gx(S.q), gy(S.b + S.p * lk)); c.stroke();
      if (S.answered) { c.fillStyle = GOLD; c.beginPath(); c.arc(gx(0), gy(S.b), 6 + Math.sin(t * 6), 0, 7); c.fill(); c.font = '700 14px Fredoka, Nunito, sans-serif'; c.textAlign = 'left';
        c.fillStyle = '#fff4dc'; c.fillText(`(0, ${S.b})`.replace('-', '−'), gx(0) + 9, gy(S.b) + (S.p > 0 ? -12 : 12)); } }
    c.restore();
    // the fireflies: a soft glow, a bright body, little wings; a firefly on the line glows green
    S.h.forEach((h, i) => { const X = gx(h.x), Y = gy(h.y), ok = onLine(S, h), held = S.drag && S.drag.i === i, fl = Math.sin(t * 9 + i * 2) * 3;
      const gr = c.createRadialGradient(X, Y, 0, X, Y, 26); gr.addColorStop(0, ok ? 'rgba(170,255,140,0.75)' : 'rgba(255,230,120,0.7)'); gr.addColorStop(1, 'rgba(255,230,120,0)');
      c.fillStyle = gr; c.beginPath(); c.arc(X, Y, 26, 0, 7); c.fill();
      c.fillStyle = 'rgba(220,235,255,0.7)'; c.beginPath(); c.ellipse(X - 6, Y - 7, 6, 3 + fl * 0.3, -0.6, 0, 7); c.ellipse(X + 6, Y - 7, 6, 3 - fl * 0.3, 0.6, 0, 7); c.fill();
      c.fillStyle = ok ? '#c8ff8a' : '#fff3a0'; c.beginPath(); c.arc(X, Y, held ? 8 : 6.5, 0, 7); c.fill(); c.strokeStyle = '#3a2a10'; c.lineWidth = 1.5; c.stroke(); });
    M.drawEx(g, c, 'eq');
    if (!S.drag && !S.lockAt) M.drawGuide(g, c);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
function S_locked(g) { return !!g.s.lockAt; }
