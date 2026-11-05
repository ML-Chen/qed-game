// geometry_perim.js — PERIMETER! The perimeter is the distance all the way around a shape: add up every side.
// A shape is drawn in ink on a sheet of paper pinned up in the forest, with each side's length written inside it. An ant
// stands on one corner. The player puts a finger on the ant and drags it along the edge, either way round; each time the
// ant finishes a side, that side's length lifts off its label and flies into P = 6 + 4 + ... below, and the gold coin
// riding beside the ant adds it to the running total. When the ant is back at its corner, the terms light up left to
// right and the coin's total flies into the answer: P = 6 + 4 + 6 + 4 = 20, and the whole edge flashes gold.
// Level 0: a 6 by 4 rectangle. Level 1: a rectangle or a right triangle. Level 2: an L-shape with six sides.
// Misses: pressing a side length or the inside of the shape (that would be area) wobbles it.
// Medium mode: when the ant is home, the player picks the total from the tray.
// The kit's moves are for taps and drags between parts, so this file runs the tracing gesture itself (as calc_tangent.js
// does): moves(g) returns one placeholder move until the total is in, then nothing, and the kit wins.
const M = MK, INKP = '#2a3a6a';
function pickShape(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return { v: [[0, 0], [6, 0], [6, 4], [0, 4]] };
  if (L === 1) {
    if (g.rand() < 0.5) { const a = 3 + r(5), b = 2 + r(3); return { v: [[0, 0], [a === b ? a + 1 : a, 0], [a === b ? a + 1 : a, b], [0, b]] }; }
    const k = [[3, 4, 5], [6, 8, 10]][r(2)]; return { v: [[0, 0], [k[0], k[1]], [0, k[1]]], len: [k[2], k[0], k[1]] };
  }
  const Wd = 6 + r(3), Ht = 5 + r(2), w2 = 2 + r(Wd - 4), h1 = 2 + r(Ht - 3);
  return { v: [[0, 0], [w2, 0], [w2, h1], [Wd, h1], [Wd, Ht], [0, Ht]] };
}
function nearest(S, x, y) {
  let best = { d: 1e9, u: 0 };
  S.pts.forEach((p, i) => { const q = S.pts[(i + 1) % S.n], dx = q[0] - p[0], dy = q[1] - p[1], L2 = dx * dx + dy * dy;
    const k = M.clamp(((x - p[0]) * dx + (y - p[1]) * dy) / L2, 0, 1), d = Math.hypot(p[0] + dx * k - x, p[1] + dy * k - y);
    if (d < best.d) best = { d, u: S.cum[i] + k * S.px[i] }; });
  return best;
}
function ptAt(S, u) {
  u = ((u % S.P) + S.P) % S.P; let i = 0; while (i < S.n - 1 && u > S.cum[i + 1]) i++;
  const p = S.pts[i], q = S.pts[(i + 1) % S.n], k = (u - S.cum[i]) / S.px[i];
  return { x: p[0] + (q[0] - p[0]) * k, y: p[1] + (q[1] - p[1]) * k, a: Math.atan2(q[1] - p[1], q[0] - p[0]), i };
}
const curU = S => S.dir === -1 ? S.P - S.dist : S.dist;
const sideOrder = S => S.dir === -1 ? [...Array(S.n).keys()].reverse() : [...Array(S.n).keys()];

MG.add({
  id: 'geometry_perim', stage: 'geometry', cmd: 'PERIMETER!', hint: 'drag', time: 9, mood: 'bright', winText: 'All the way round!', hold: 1.4,
  card: {
    title: 'Perimeter', ref: 'Grade 3', kind: 'Geometry',
    text: 'The perimeter of a shape is the distance all the way around its edge. Imagine an ant walking along every side until it is back where it started. The distance it walks is the perimeter.\n\nTo find the perimeter, add up the lengths of all the sides. For example, a rectangle 6 units long and 4 units wide has sides of 6, 4, 6 and 4. Its perimeter is 6 + 4 + 6 + 4 = 20 units.\n\nPerimeter is a length, so it is measured in units, not square units. Area is different: it counts the squares inside the shape.',
    note: 'Perimeter = the sum of all the side lengths. For a rectangle, that is length + width + length + width.',
    ask: 'What is the perimeter of a square with sides of 5? Of a triangle with sides 3, 4 and 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); const sh = pickShape(g), V = sh.v, n = V.length;
    const len = sh.len || V.map((p, i) => { const q = V[(i + 1) % n]; return Math.round(Math.hypot(q[0] - p[0], q[1] - p[1])); });
    const xs = V.map(p => p[0]), ys = V.map(p => p[1]), wU = Math.max(...xs), hU = Math.max(...ys), u = Math.min(40, 240 / wU, 180 / hU);
    const ox = 180 - wU * u / 2, oy = 306 - hU * u / 2;
    Object.assign(S, { n, len, u, pts: V.map(p => [ox + p[0] * u, oy + p[1] * u]), dir: 0, dist: 0, doneSides: 0, sum: 0, tracing: false, bot: null, sideAt: [] });
    S.px = S.pts.map((p, i) => { const q = S.pts[(i + 1) % n]; return Math.hypot(q[0] - p[0], q[1] - p[1]); });
    S.cum = [0]; S.px.forEach(l => S.cum.push(S.cum[S.cum.length - 1] + l)); S.P = S.cum[n];
    // each side's length is written just outside the shape, next to the middle of its side (outside, so the short sides of
    // the L-shape's notch don't crowd each other)
    S.pts.forEach((p, i) => { const q = S.pts[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
      M.place(g, 's' + i, M.row(M.num(len[i], 's' + i)), (p[0] + q[0]) / 2 + nx * 20, (p[1] + q[1]) / 2 + ny * 20 + 9, 24, { col: INKP }); });
    // the inside of the shape (pressing it is the area mix-up): the middle of the rectangle, the triangle's centroid, the L's long leg
    const P_ = S.pts, mid = n === 3 ? [(P_[0][0] + P_[1][0] + P_[2][0]) / 3, (P_[0][1] + P_[1][1] + P_[2][1]) / 3] : n === 6 ? [(P_[0][0] + P_[1][0]) / 2, (P_[2][1] + P_[4][1]) / 2] : [180, 306];
    M.zone(g, 'inside', { x: mid[0], y: mid[1], w: 30, h: 30 });
    S.terms = []; S.total = null; S.rowY = 462; S.coinV = 0; S.coinAt = -9; S.T = M.pace(g);
    S.Pv = M.vr('P', 'Pv'); S.eq = M.op('=', 'eq'); S.slot0 = M.slot(null, { col: '#8a9ab8' }); setRow(g);
    g.dur *= (2.6 + 1.05 * n) / 8;
    M.play(g, { moves(g) { return S.total == null ? [{ drag: 'ant', to: 'ant' }] : []; }, area() { return 'ant'; } });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    const p = ptAt(S, curU(S)); M.zone(g, 'ant', { x: p.x, y: p.y, w: 44, h: 44 });
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (K.busyT > 0 || S.doneSides >= S.n) return;
    const p = ptAt(S, curU(S)); if (Math.hypot(x - p.x, y - p.y) < 40) { S.tracing = true; g.sfx('tap'); return; }
    for (let i = 0; i < S.n; i++) { const b = M.box(g, 's' + i); if (b && Math.abs(x - b.x) < b.w / 2 + 12 && Math.abs(y - b.y) < b.h / 2 + 12) { S.pressBad = 's' + i; return; } }
    const z = M.box(g, 'inside'); if (z && Math.abs(x - z.x) < 40 && Math.abs(y - z.y) < 40) S.pressBad = 'inside';
  },
  move(g, x, y) {
    const S = g.s; if (!S.tracing || g.done) return;
    const q = nearest(S, x, y); if (q.d > 56) return;
    if (!S.dir) { const f = q.u, b = S.P - q.u; if (Math.min(f, b) < 10) return; S.dir = f <= b ? 1 : -1; }
    const step = S.dir === 1 ? ((q.u - curU(S)) % S.P + S.P) % S.P : ((curU(S) - q.u) % S.P + S.P) % S.P;
    if (step > 90) return;
    S.dist = Math.min(S.P, S.dist + step);
    const ord = sideOrder(S); let c = 0; for (let k = 0; k < S.n; k++) { c += S.px[ord[k]]; if (k === S.doneSides && S.dist >= c - 3) passSide(g, ord[k]); }
  },
  up(g, x, y) {
    const S = g.s; S.tracing = false; if (g.done) return;
    if (S.pressBad) { M.miss(g, { tap: S.pressBad }); S.badAt = g.t; S.pressBad = null; }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.doneSides >= S.n) return;
    if (!S.tracing) { if (g.t < 0.4) return; const p = ptAt(S, curU(S)); synth('down', p.x, p.y); if (!S.dir) S.dir = 1; return; }
    const p = ptAt(S, curU(S) + S.dir * 7); synth('move', p.x, p.y); if (S.doneSides >= S.n) synth('up', p.x, p.y);
  },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, won = g.done && g.result === 'win';
    SCN.bg(g, c, 'forest'); SCN.panel(c, 'paper', 180, 334, 320, 316, t);
    // the shape: soft wash inside, inked edge; finished sides glow green
    c.save(); c.beginPath(); S.pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
    const wob = S.badAt && t - S.badAt < 0.4 ? Math.sin((t - S.badAt) * 50) * 0.04 : 0;
    c.fillStyle = `rgba(120,170,230,${0.16 + wob})`; c.fill(); c.lineJoin = 'round'; c.lineCap = 'round';
    c.strokeStyle = INKP; c.lineWidth = 4; c.stroke();
    const ord = sideOrder(S); let cu = 0;
    for (let k = 0; k < S.n; k++) { const i = ord[k], p = S.pts[i], q = S.pts[(i + 1) % S.n], f = M.clamp((S.dist - cu) / S.px[i], 0, 1); cu += S.px[i]; if (f <= 0) continue;
      const [a, b] = S.dir === -1 ? [q, p] : [p, q]; c.strokeStyle = '#3ab06a'; c.lineWidth = 7; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); c.stroke(); }
    c.restore();
    for (let i = 0; i < S.n; i++) { const b = M.box(g, 's' + i), on = S.sideAt[i] != null; if (on && b) { c.fillStyle = 'rgba(160,230,170,0.6)'; c.beginPath(); c.arc(b.x, b.y, Math.max(b.w, b.h) / 2 + 7, 0, 7); c.fill(); } M.drawEx(g, c, 's' + i); }
    // guidance: the ant glows, and a dashed arrow (and at level 0 a ghost hand) runs along the next side
    const guide = !won && !K.ask && S.doneSides < S.n && !S.tracing && (g.level === 0 || t - K.moveT > 2 || g.done);
    const ap = ptAt(S, curU(S));
    if (!won && !K.ask && S.doneSides < S.n) {
      M.glowBox(c, { x: ap.x, y: ap.y, w: 34, h: 34 }, t, 1, true);
      const d = S.dir || 1, i = sideOrder({ ...S, dir: d })[S.doneSides], p = S.pts[i], q = S.pts[(i + 1) % S.n], [a, b] = d === -1 ? [q, p] : [p, q];
      c.save(); c.setLineDash([7, 8]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(255,190,40,0.95)'; c.lineWidth = 4; c.beginPath(); c.moveTo(ap.x, ap.y); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
      if (guide) { const k = (t * 0.7) % 1, hx = ap.x + (b[0] - ap.x) * M.easeIO(k), hy = ap.y + (b[1] - ap.y) * M.easeIO(k); M.hand(c, hx + 4, hy + 6, 1, k < 0.1 ? 1 : 0); }
    }
    // the ant on the edge, walking the way it is going, with the running total above it
    c.save(); c.translate(ap.x, ap.y); c.rotate(ap.a);
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'ant', 0, 0, 0.85, { t, facing: S.dir === -1 ? -1 : 1, pose: won ? 'cheer' : S.tracing ? 'walk' : 'idle', expr: won ? 'laugh' : 'happy', noShadow: true }); } catch (e) { }
    c.restore();
    // the running total rides on a gold coin just inside the edge, beside the ant
    if (S.coinV > 0 && !S.coinGone) { const pk = M.clamp((t - S.coinAt) / 0.3, 0, 1), sc = (1 + Math.sin(pk * Math.PI) * 0.35) * (S.coinSc || 1), cp = coinPos(S);
      c.save(); c.translate(cp.x, cp.y); c.scale(sc, sc); if (S.coinHl) { c.shadowColor = '#ffd45a'; c.shadowBlur = 16; } c.fillStyle = '#ffd45a'; c.strokeStyle = '#8a5a14'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 19, 0, 7); c.fill(); c.stroke(); c.shadowBlur = 0;
      c.fillStyle = '#3a2214'; c.font = M.NUMF(20); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(S.coinV, 0, 1); c.restore(); }
    // once home, the whole edge flashes gold as the total lands
    if (S.flashAt != null && t - S.flashAt < 0.6) { const k = (t - S.flashAt) / 0.6; c.save(); c.globalAlpha = Math.sin(k * Math.PI); c.strokeStyle = '#ffe27a'; c.shadowColor = '#ffd45a'; c.shadowBlur = 18; c.lineWidth = 9; c.lineJoin = 'round';
      c.beginPath(); S.pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'row');
    SCN.host(g, c, 'hedgehog', 300, 604, 1.2);
    M.drawAnims(g, c); M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
function coinPos(S) { const p = ptAt(S, curU(S)), nx = -Math.sin(p.a), ny = Math.cos(p.a); return { x: M.clamp(p.x + nx * 40, 26, 334), y: M.clamp(p.y + ny * 40, 190, 425) }; }
function setRow(g) { // the same node objects are reused, so the terms glide over as the row grows
  const S = g.s, it = [S.Pv, S.eq];
  if (!S.terms.length) it.push(S.slot0);
  S.terms.forEach((q, k) => { if (k) it.push(q.plus); it.push(q.n); });
  if (S.eq2) it.push(S.eq2, S.ans);
  const row = M.row(...it), w = M.lay(row, 32).w; M.place(g, 'row', row, 180, S.rowY, Math.min(32, 32 * 290 / w), { col: INKP }); M.inert(g, ['Pv', 'eq']);
}
function passSide(g, i) {
  const S = g.s, T = S.T; S.doneSides++; S.sideAt[i] = g.t; S.mk.moveT = g.t; S.sum += S.len[i]; S.mk.lastMove = g.t;
  // the side's length lifts off its label and flies into the sum; the ant's coin adds it on landing
  const q = { n: M.num(S.len[i], null, { alpha: 0 }), plus: M.op('+', null, { alpha: 0 }) }; S.terms.push(q); setRow(g); const k = S.terms.length - 1;
  const nd = M.node(g, 's' + i); if (nd) nd.pop = g.t; g.sfx('tap');
  const b = M.box(g, 's' + i), dst = M.box(g, 'row'), sum = S.sum;
  M.tween(g, q.plus, { alpha: 1 }, 0.2 * T, { delay: 0.1 * T });
  M.fly(g, { node: M.num(S.len[i], null, { col: '#2f9a5a' }), from: [b.x, b.y], to: [0, 0], dur: 0.38 * T, arc: -36, s0: 24, s1: 30, col: '#2f9a5a',
    then(g) { q.n.alpha = 1; q.n.pop = g.t; S.coinV = sum; S.coinAt = g.t; g.sfx('coin'); } });
  // the fly's target is read from the term's box now, after setRow placed it
  const f = S.mk.flies[S.mk.flies.length - 1]; f.term = q.n; M.relayout(g, 'row'); const tb = termBox(g, q.n); if (tb) f.b = tb;
  if (b) g.burst(b.x, b.y, ['#9ae07a', '#ffd45a', '#fff'], 8, 100);
  if (S.doneSides < S.n) return;
  // home: the ant cheers, the terms light up left to right, and the coin's total flies into the answer
  S.tracing = false; S.dist = S.P; const tot = S.sum, last = S.len[i];
  S.eq2 = M.op('=', null, { alpha: 0 }); S.ans = M.slot('ans', { col: '#8a9ab8', alpha: 0 }); M.inert(g, ['ans']);
  const lit = 0.45 * T + S.n * 0.09 * T; M.show(g, lit);
  M.at(g, [[0.4 * T, g => { setRow(g); M.tween(g, S.eq2, { alpha: 1 }, 0.2 * T); M.tween(g, S.ans, { alpha: 1 }, 0.2 * T); S.coinHl = true; g.sfx('ding'); }]]);
  S.terms.forEach((q, k) => M.indicate(g, q.n, { delay: 0.4 * T + k * 0.09 * T, dur: 0.28 * T, sc: 1.35, col: '#ffb21f' }));
  const done = g => { M.show(g, 0.8 * T); const cp = coinPos(S), v = M.num(tot, null, { alpha: 0, col: '#2f9a5a' });
    M.fly(g, { node: M.num(tot, null, { col: '#2f9a5a' }), from: [cp.x, cp.y], to: 'ans', dur: 0.42 * T, arc: -60, s0: 20, s1: 32, then(g) {
      S.total = tot; S.ans.fill = v; v.alpha = 1; v.pop = g.t; setRow(g); S.flashAt = g.t; S.mk.lastMove = g.t; g.sfx('sparkle'); M.sparkle(g, 'ans', { n: 12, cols: ['#9ae07a', '#ffd45a', '#fff'] }); } });
    S.coinGone = true; };
  const ask = { ask: { v: tot, wrong: [tot - last, tot + 2, S.n === 4 ? S.len[0] * S.len[1] : tot - 2, S.len[0] + S.len[1]] }, after: 0.8 * T, resolve: done };
  M.at(g, [[lit, g => { if (g.mode === 'medium') { M.openAsk(g, ask); S.mk.busyT = 1e9; } else done(g); }]]);
}
function termBox(g, n) { const e = g.s.mk.ex.row; if (!e) return null; const box = {}; const id = n.id; n.id = '_t'; M.draw(document.createElement('canvas').getContext('2d'), e.node, e.x, e.y, e.s, { box }); n.id = id; const b = box._t; return b ? { x: b.x, y: b.y, s: e.s } : null; }
