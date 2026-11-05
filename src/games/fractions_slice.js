// fractions_slice.js — PARTITION! Cut a pie into equal parts to make a fraction.
// A picnic seen from straight above: a pie (or a pizza, or a cake) on a plate on a gingham blanket, and the target
// fraction written big on a paper doily above it. The player swipes straight cuts through the centre. Every cut snaps
// to the nearest angle that makes equal parts (a generous tolerance); for thirds and sixths the cuts are radial, so a
// swipe from the centre outward makes one radial cut (a swipe right across makes two). A cut that is too far off, or
// that misses the centre, is uneven: it wobbles the pie like jelly and heals, and the player tries again.
// When the pie is in n equal parts, the slices separate and k of them lift out toward the rabbit, each one labelled
// 1/n, while the target k/n glows. On the win the lifted slices hop onto the rabbit's plate.
// Level 0: halves and fourths, a wide tolerance, notches on the plate rim at the open cut angles, a ghost hand.
// Level 1: thirds, fourths, sixths. Level 2: sixths and eighths, a tighter tolerance, no help until a 2 s pause.
// Medium mode: once the pie is cut, the slice labels show "?" and the player picks the fraction one slice is.
// The kit's moves(g) is for taps and drags, so this file runs its own swipe. moves(g) returns one placeholder move
// until the fraction is shown (and answered in medium mode), then nothing, so the kit's finish() awards the stars.
const M = MK;
const CX = 180, CY = 402, R = 102, TY = 220; // TY: the doily with the target fraction
const TAU = Math.PI * 2, clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const TOL = [0.5, 0.36, 0.27];         // radians a cut may be off and still snap, by level (never more than half a slot)
const CR = [54, 44, 36];               // how close (px) to the centre a cut must pass, by level
const POOL = [[[1, 2], [1, 4], [3, 4], [1, 4]], [[1, 3], [2, 3], [3, 4], [1, 6], [5, 6]], [[1, 8], [3, 8], [5, 8], [5, 6], [1, 6], [2, 3]]];
const RAB = { x: 306, y: 616, s: 1.32 };
const LIFT_DIR = Math.atan2(RAB.y - 40 - CY, RAB.x - 40 - CX);
const wrapA = a => ((a % TAU) + TAU) % TAU;
const angDiff = (a, b) => { const d = wrapA(a - b); return d > Math.PI ? TAU - d : d; };
const swipesOf = n => n === 3 ? 3 : n / 2;
function segDist(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1, k = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1); return Math.hypot(px - ax - dx * k, py - ay - dy * k); }

// ---------------- cutting ----------------
const slotsOf = (st, th0 = st.th0) => [...Array(st.n)].map((_, i) => wrapA(th0 + i * TAU / st.n));
const hasRay = (st, a) => st.rays.some(r => angDiff(r, a) < 0.01);
// judge each ray of a cut against the equal-parts angles, applying the good ones to st (S itself, or a copy for the preview)
function judgeAll(st, rays, tol) {
  return rays.map(a => {
    if (st.th0 == null) { const s = wrapA(Math.round(a / (Math.PI / 12)) * (Math.PI / 12)); st.th0 = s; st.rays.push(s); return { st: 'ok', a: s, from: a }; }
    let best = 0, bd = 9; for (const s of slotsOf(st)) { const d = angDiff(a, s); if (d < bd) { bd = d; best = s; } }
    if (bd > tol) return { st: 'bad', a, from: a };
    if (hasRay(st, best)) return { st: 'dup', a: best, from: a };
    st.rays.push(best); return { st: 'ok', a: best, from: a };
  });
}
// what a swipe from (x0, y0) to (x1, y1) does: rays out of the centre, or an off-centre chord (uneven), or nothing
function classify(g, x0, y0, x1, y1) {
  const S = g.s, len = Math.hypot(x1 - x0, y1 - y0); if (len < 34) return null;
  const cr = CR[g.level], d0 = Math.hypot(x0 - CX, y0 - CY), d1 = Math.hypot(x1 - CX, y1 - CY), dl = segDist(CX, CY, x0, y0, x1, y1);
  let rays;
  if (d0 < cr && d1 > cr + 8) rays = [Math.atan2(y1 - CY, x1 - CX)];
  else if (d1 < cr && d0 > cr + 8) rays = [Math.atan2(y0 - CY, x0 - CX)];
  else if (dl < cr) { const a = Math.atan2(y1 - y0, x1 - x0); rays = [a, a + Math.PI]; }
  else if (dl < R - 4) return { kind: 'chord', x0, y0, x1, y1 };
  else return null;
  if (rays.length === 1 && S.n !== 3 && S.n !== 6) rays.push(rays[0] + Math.PI); // halves, fourths, eighths: every cut is a straight line across
  return { kind: 'rays', rays: rays.map(wrapA) };
}
const tolOf = g => Math.min(TOL[g.level], Math.PI / g.s.n * 0.92);
function cut(g, cl) {
  const S = g.s, K = S.mk, t = g.t;
  let ok = 0, bad = 0;
  if (cl.kind === 'chord') { bad = 1; S.bads.push({ chord: chordOf(cl), at: t }); }
  else for (const j of judgeAll(S, cl.rays, tolOf(g))) {
    if (j.st === 'ok') { ok++; S.anims.push({ a: j.a, from: j.from, at: t }); }
    else if (j.st === 'bad') { bad++; S.bads.push({ a: j.a, at: t }); }
  }
  if (bad) { S.wobAt = t; S.ohAt = t; K.wrong = (K.wrong || 0) + 1; K.missAt = t; g.sfx('boing'); }
  if (ok) {
    S.hopAt = t; S.lastMoveT = t; K.lastMove = t; g.sfx('crunch'); const T = S.T;
    // the knife runs out from the centre along the snapped line; crumbs fly where it leaves the crust
    for (const an of S.anims.filter(q => q.at === t)) { an.dur = 0.26 * T; M.later(g, an.dur, g => { g.sfx('snap'); g.burst(CX + Math.cos(an.a) * R * 0.95, CY + Math.sin(an.a) * R * 0.95, S.crumbs, 7, 90); }, true); }
    M.show(g, 0.34 * T);
  }
  if (!ok && !bad) g.sfx('tap');
  if (S.rays.length >= S.n) M.later(g, 0.3 * S.T, partition, true);
}
function chordOf(cl) { // the swipe's line, clipped to the pie
  const dx = cl.x1 - cl.x0, dy = cl.y1 - cl.y0, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const px = cl.x0 - CX, py = cl.y0 - CY, b = px * ux + py * uy, c0 = px * px + py * py - R * R, disc = Math.max(0, b * b - c0), s = Math.sqrt(disc);
  return [cl.x0 + ux * (-b - s), cl.y0 + uy * (-b - s), cl.x0 + ux * (-b + s), cl.y0 + uy * (-b + s)];
}
function wedges(S) {
  const sorted = S.rays.slice().sort((p, q) => wrapA(p - S.th0) - wrapA(q - S.th0));
  return sorted.map((a0, i) => { const a1 = a0 + (wrapA((sorted[(i + 1) % sorted.length]) - a0) || TAU); return { a0, a1, mid: (a0 + a1) / 2 }; });
}
// The working once the pie is in n equal parts (show your work):
//   1. the slices part a little, and are counted one by one: a badge 1, 2, ..., n pops on each slice; the count n
//      flies up into the fraction's bottom number (n equal parts make the whole);
//   2. the first of the k slices lifts out toward the rabbit with its badge turned into 1/n (medium mode: "?", and the
//      tray asks what one slice is);
//   3. the other slices lift out one at a time, each a 1/n, and the count k flies up into the top number.
function partition(g) {
  const S = g.s, K = S.mk, T = S.T; S.parted = g.t; S.wedges = wedges(S); S.liftT = {}; S.badge = {};
  // the k slices that lift out: the run of k neighbours that faces the rabbit best
  let bj = 0, bd = 9; for (let j = 0; j < S.n; j++) { const mid = S.wedges[j].a0 + S.k * TAU / S.n / 2, d = angDiff(mid, LIFT_DIR); if (d < bd) { bd = d; bj = j; } }
  S.liftOrder = [...Array(S.k)].map((_, i) => (bj + i) % S.n); S.lifted = new Set(S.liftOrder); S.liftMid = S.wedges[bj].a0 + S.k * TAU / S.n / 2;
  g.sfx('magic'); S.hopAt = g.t; K.lastMove = g.t;
  // 1. count the slices, starting at the first one that will lift
  const d = Math.min(0.21, 0.9 / S.n) * T, t0 = 0.12 * T, order = [...Array(S.n)].map((_, i) => (bj + i) % S.n);
  order.forEach((w, i) => M.later(g, t0 + i * d, g => { S.badge[w] = { v: i + 1, t0: g.t }; g.sfx(i === S.n - 1 ? 'ding' : 'tap'); }, true));
  const tCount = t0 + (S.n - 1) * d + 0.14 * T, fl = 0.34 * T;
  M.later(g, tCount, g => { const last = order[S.n - 1], p = badgeXY(S, last); S.countFly = g.t; M.indicate(g, 'td', { delay: fl, dur: 0.35 * T, sc: 1.4 });
    M.fly(g, { node: M.num(S.n, null, { col: '#c8401a' }), from: [p.x, p.y], to: 'td', dur: fl, arc: -40, s0: 22, s1: 44, then(g) { M.sparkle(g, 'td', { n: 10 }); g.sfx('pop'); S.hopAt = g.t; } }); }, true);
  // 2. the first slice lifts out with its label: one slice is 1/n
  const tLift = tCount + fl + 0.12 * T, askAt = tLift + 0.32 * T;
  M.later(g, tLift, g => { S.countDone = g.t; S.liftT[order[0]] = g.t; g.sfx('swoosh'); }, true);
  M.show(g, askAt);
  const n = S.n, F = (a, b) => M.frac(M.num(a), M.num(b));
  const mv = { ask: { v: F(1, n), wrong: [F(n, 1), F(1, swipesOf(n)), S.k > 1 ? F(S.k, n) : null, F(1, n + 1), n > 2 ? F(1, n - 1) : null].filter(Boolean) }, after: 0.05,
    resolve(g) { S.oneShown = g.t; g.sfx('sparkle'); S.hopAt = g.t; K.lastMove = g.t;
      // 3. the rest of the k slices lift one at a time, then the count k flies into the top number
      const e = Math.min(0.26, 0.8 / S.k) * T;
      S.liftOrder.slice(1).forEach((w, i) => M.later(g, 0.22 * T + i * e, g => { S.liftT[w] = g.t; g.sfx('pop'); }, true));
      const tK = 0.22 * T + (S.k - 1) * e + 0.3 * T;
      M.later(g, tK, g => { const p = badgeXY(S, S.liftOrder[S.k - 1], true); M.indicate(g, 'tn', { delay: fl, dur: 0.35 * T, sc: 1.4 });
        M.fly(g, { node: M.num(S.k, null, { col: '#c8401a' }), from: [p.x, p.y], to: 'tn', dur: fl, arc: -40, s0: 22, s1: 44, then(g) { M.sparkle(g, 'tn', { n: 10 }); g.sfx('coin'); S.hopAt = g.t; } }); }, true);
      const len = tK + fl + 0.22 * T; M.show(g, len); M.later(g, len, g => { S.answered = g.t; }, true);
      mv.after = len; } };
  M.later(g, askAt, g => { if (g.mode === 'medium') { K.busyT = 1e9; M.openAsk(g, mv); } else mv.resolve(g); }, true);
}
// where a slice's badge sits (lifted slices carry theirs)
function badgeXY(S, i, lifted) { const w = S.wedges[i], rr = S.n === 2 ? R * 0.5 : R * 0.62, o = lifted ? liftOf(S, i, 1) : [0, 0]; return { x: CX + Math.cos(w.mid) * rr + o[0], y: CY + Math.sin(w.mid) * rr + o[1] }; }
// how far a lifted slice has moved out toward the rabbit (k = 0..1)
function liftOf(S, i, k) { const d = 26 * k; return [Math.cos(S.liftMid) * d, Math.sin(S.liftMid) * d - 6 * k]; }
const liftK = (g, S, i) => S.liftT && S.liftT[i] != null ? ease((g.t - S.liftT[i]) / (0.3 * S.T)) : 0;

// ---------------- the art ----------------
function picnic(c, w, h) {
  // grass from above
  const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#8ccf62'); gr.addColorStop(1, '#5aa646'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
  let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  c.lineCap = 'round';
  for (let i = 0; i < 520; i++) { const x = rnd() * w, y = rnd() * h, a = rnd() * TAU, l = 4 + rnd() * 6; c.strokeStyle = rnd() < 0.5 ? 'rgba(40,110,40,0.35)' : 'rgba(200,240,150,0.35)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  for (let i = 0; i < 26; i++) { const x = rnd() * w, y = rnd() * h; if (x > 20 && x < 340 && y > 170 && y < 590) continue; const col = ['#fffaf0', '#ffe46a', '#ffb6d0'][i % 3]; c.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; c.beginPath(); c.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.4, 0, TAU); c.fill(); } c.fillStyle = '#f2a83a'; c.beginPath(); c.arc(x, y, 1.8, 0, TAU); c.fill(); }
  // the gingham blanket, a little crooked
  c.save(); c.translate(180, 384); c.rotate(-0.05);
  const bw = 334, bh = 420; c.fillStyle = 'rgba(30,70,20,0.3)'; c.fillRect(-bw / 2 + 5, -bh / 2 + 8, bw, bh);
  c.fillStyle = '#fff6ee'; c.fillRect(-bw / 2, -bh / 2, bw, bh);
  c.fillStyle = 'rgba(214,58,74,0.42)'; for (let x = -bw / 2; x < bw / 2; x += 30) c.fillRect(x, -bh / 2, 15, bh); for (let y = -bh / 2; y < bh / 2; y += 30) c.fillRect(-bw / 2, y, bw, 15);
  c.strokeStyle = 'rgba(160,40,50,0.35)'; c.lineWidth = 2; c.strokeRect(-bw / 2 + 6, -bh / 2 + 6, bw - 12, bh - 12);
  c.fillStyle = '#fff6ee'; for (let x = -bw / 2; x <= bw / 2; x += 8) { c.fillRect(x, bh / 2, 3, 7); c.fillRect(x, -bh / 2 - 7, 3, 7); } // fringe
  c.restore();
  // a glass of lemonade and a bowl of strawberries on the blanket
  c.fillStyle = 'rgba(60,30,30,0.22)'; c.beginPath(); c.arc(324, 252, 22, 0, TAU); c.fill();
  c.fillStyle = '#eaf6ff'; c.beginPath(); c.arc(320, 247, 21, 0, TAU); c.fill(); c.fillStyle = '#ffe680'; c.beginPath(); c.arc(320, 247, 17, 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(310, 238, 8, 8); c.fillRect(322, 249, 7, 7); c.fillStyle = '#fff8c0'; c.beginPath(); c.arc(314, 252, 4, 0, TAU); c.fill();
  c.strokeStyle = '#ff6a8a'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(324, 244); c.lineTo(340, 226); c.stroke();
  c.fillStyle = 'rgba(60,30,30,0.22)'; c.beginPath(); c.arc(46, 246, 26, 0, TAU); c.fill();
  c.fillStyle = '#7ac0e8'; c.beginPath(); c.arc(42, 241, 25, 0, TAU); c.fill(); c.fillStyle = '#d8f0ff'; c.beginPath(); c.arc(42, 241, 20, 0, TAU); c.fill();
  for (const [x, y, a] of [[34, 234, 0.4], [48, 236, -0.5], [40, 249, 1.6], [52, 248, 2.5], [31, 247, -1.2]]) { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = '#e8303a'; c.beginPath(); c.moveTo(0, -7); c.quadraticCurveTo(7, -4, 0, 7); c.quadraticCurveTo(-7, -4, 0, -7); c.fill(); c.fillStyle = '#5ab040'; c.beginPath(); c.ellipse(0, -7, 4, 2, 0, 0, TAU); c.fill(); c.fillStyle = '#ffe0a0'; c.fillRect(-2, -1, 1.2, 1.2); c.fillRect(1, 2, 1.2, 1.2); c.restore(); }
  // the plate
  c.fillStyle = 'rgba(70,30,30,0.25)'; c.beginPath(); c.arc(CX + 5, CY + 8, R + 22, 0, TAU); c.fill();
  const pg = c.createRadialGradient(CX - 30, CY - 40, 10, CX, CY, R + 22); pg.addColorStop(0, '#ffffff'); pg.addColorStop(1, '#e4e8f0'); c.fillStyle = pg; c.beginPath(); c.arc(CX, CY, R + 20, 0, TAU); c.fill();
  c.strokeStyle = '#7ab0d8'; c.lineWidth = 2.5; c.beginPath(); c.arc(CX, CY, R + 15, 0, TAU); c.stroke();
  c.strokeStyle = 'rgba(120,130,160,0.3)'; c.lineWidth = 1.5; c.beginPath(); c.arc(CX, CY, R + 6, 0, TAU); c.stroke();
  // the paper doily for the target fraction
  const DX = 180, DY = TY, DR = 50;
  c.fillStyle = 'rgba(70,30,30,0.22)'; c.beginPath(); c.arc(DX + 3, DY + 5, DR + 6, 0, TAU); c.fill();
  c.fillStyle = '#fffdf8'; c.beginPath(); for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, r = DR + 5 + Math.cos(a * 18) * 3.5; i ? c.lineTo(DX + Math.cos(a) * r, DY + Math.sin(a) * r) : c.moveTo(DX + r, DY); } c.closePath(); c.fill();
  c.fillStyle = 'rgba(220,200,190,0.5)'; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; c.beginPath(); c.arc(DX + Math.cos(a) * (DR - 2), DY + Math.sin(a) * (DR - 2), 2.2, 0, TAU); c.fill(); }
  c.strokeStyle = 'rgba(200,170,160,0.6)'; c.lineWidth = 1.2; c.beginPath(); c.arc(DX, DY, DR - 8, 0, TAU); c.stroke();
}
// the food, baked once per kind, centred on (CX, CY); nothing goes past R + 3
function food(kind) {
  return (c) => {
    if (kind === 'pizza') {
      const cg = c.createRadialGradient(CX, CY, R * 0.8, CX, CY, R + 3); cg.addColorStop(0, '#e8b868'); cg.addColorStop(0.7, '#d89a48'); cg.addColorStop(1, '#a8682a'); c.fillStyle = cg; c.beginPath(); c.arc(CX, CY, R + 2, 0, TAU); c.fill();
      c.fillStyle = 'rgba(140,80,30,0.35)'; for (let i = 0; i < 24; i++) { const a = i * 0.83, r = R * 0.93; c.beginPath(); c.ellipse(CX + Math.cos(a) * r, CY + Math.sin(a) * r, 4, 2, a, 0, TAU); c.fill(); }
      c.fillStyle = '#d0402a'; c.beginPath(); c.arc(CX, CY, R * 0.86, 0, TAU); c.fill();
      c.fillStyle = '#f8d468'; c.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * TAU, r = R * (0.8 + 0.035 * Math.sin(a * 7) + 0.02 * Math.sin(a * 13)); i ? c.lineTo(CX + Math.cos(a) * r, CY + Math.sin(a) * r) : c.moveTo(CX + r, CY); } c.fill();
      c.fillStyle = 'rgba(255,240,180,0.6)'; for (let i = 0; i < 18; i++) { const a = i * 2.4, r = R * 0.12 + (i * 37 % 60); c.beginPath(); c.ellipse(CX + Math.cos(a) * r, CY + Math.sin(a) * r, 9, 5, a, 0, TAU); c.fill(); }
      for (let i = 0; i < 9; i++) { const a = i * 2.2 + 0.4, r = i === 0 ? 0 : R * (i % 2 ? 0.58 : 0.33); const x = CX + Math.cos(a) * r, y = CY + Math.sin(a) * r;
        c.fillStyle = '#9a2420'; c.beginPath(); c.arc(x + 1, y + 1.5, 11, 0, TAU); c.fill(); c.fillStyle = '#c8382c'; c.beginPath(); c.arc(x, y, 11, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,220,200,0.35)'; c.beginPath(); c.arc(x - 3, y - 3, 3, 0, TAU); c.fill(); c.fillStyle = '#8a1e1a'; for (const [ox, oy] of [[3, 2], [-4, 3], [2, -5]]) { c.beginPath(); c.arc(x + ox, y + oy, 1.3, 0, TAU); c.fill(); } }
      c.fillStyle = '#3a8a3a'; for (let i = 0; i < 5; i++) { const a = i * 1.3 + 1, r = R * 0.46; c.save(); c.translate(CX + Math.cos(a) * r, CY + Math.sin(a) * r); c.rotate(a); c.beginPath(); c.ellipse(0, 0, 6, 3.2, 0, 0, TAU); c.fill(); c.restore(); }
    } else if (kind === 'cake') {
      const fg = c.createRadialGradient(CX - 30, CY - 30, 10, CX, CY, R + 3); fg.addColorStop(0, '#ffd6e2'); fg.addColorStop(1, '#f49ab4'); c.fillStyle = fg; c.beginPath(); c.arc(CX, CY, R + 2, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(200,90,120,0.4)'; c.lineWidth = 2; c.beginPath(); c.arc(CX, CY, R + 1, 0, TAU); c.stroke();
      for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, x = CX + Math.cos(a) * (R - 8), y = CY + Math.sin(a) * (R - 8); c.fillStyle = '#fffaf6'; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill(); c.fillStyle = 'rgba(230,180,190,0.6)'; c.beginPath(); c.arc(x + 1.5, y + 1.5, 2.4, 0, TAU); c.fill(); }
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + 0.2, x = CX + Math.cos(a) * R * 0.62, y = CY + Math.sin(a) * R * 0.62; c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2);
        c.fillStyle = '#e02a3a'; c.beginPath(); c.moveTo(0, -11); c.quadraticCurveTo(11, -8, 0, 11); c.quadraticCurveTo(-11, -8, 0, -11); c.fill(); c.fillStyle = '#ff9aa0'; c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(5, -4, 0, 6); c.quadraticCurveTo(-5, -4, 0, -6); c.fill(); c.restore(); }
      for (let i = 0; i < 46; i++) { const a = i * 2.39, r = Math.sqrt((i + 0.5) / 46) * R * 0.48; c.save(); c.translate(CX + Math.cos(a) * r, CY + Math.sin(a) * r); c.rotate(i * 1.7); c.fillStyle = ['#7ad0ff', '#ffe46a', '#9ae07a', '#ffffff', '#b98ae0'][i % 5]; c.fillRect(-3, -1, 6, 2.2); c.restore(); }
    } else {
      // a cherry pie with a lattice top
      c.fillStyle = '#b8742e'; c.beginPath(); for (let i = 0; i <= 96; i++) { const a = i / 96 * TAU, r = R + 1 + Math.cos(a * 32) * 2; i ? c.lineTo(CX + Math.cos(a) * r, CY + Math.sin(a) * r) : c.moveTo(CX + r, CY); } c.fill();
      const cg = c.createRadialGradient(CX - 20, CY - 30, R * 0.5, CX, CY, R); cg.addColorStop(0, '#f0b868'); cg.addColorStop(1, '#d08a3a'); c.fillStyle = cg; c.beginPath(); c.arc(CX, CY, R - 2, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(150,80,30,0.5)'; c.lineWidth = 1.5; for (let i = 0; i < 32; i++) { const a = i / 32 * TAU; c.beginPath(); c.moveTo(CX + Math.cos(a) * (R - 12), CY + Math.sin(a) * (R - 12)); c.lineTo(CX + Math.cos(a) * (R - 2), CY + Math.sin(a) * (R - 2)); c.stroke(); }
      c.save(); c.beginPath(); c.arc(CX, CY, R * 0.82, 0, TAU); c.clip();
      c.fillStyle = '#9a1830'; c.fillRect(CX - R, CY - R, R * 2, R * 2);
      for (let i = 0; i < 30; i++) { const a = i * 2.39, r = Math.sqrt((i + 0.5) / 30) * R * 0.8, x = CX + Math.cos(a) * r, y = CY + Math.sin(a) * r; c.fillStyle = '#c42840'; c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,200,210,0.55)'; c.beginPath(); c.arc(x - 2.5, y - 2.5, 2, 0, TAU); c.fill(); }
      for (const dir of [0, 1]) for (let k = -2; k <= 2; k++) { const off = k * 34; c.save(); c.translate(CX, CY); c.rotate(dir ? Math.PI / 4 : -Math.PI / 4);
        c.fillStyle = 'rgba(80,20,10,0.35)'; c.fillRect(-R, off - 7 + 3, R * 2, 14); const lg = c.createLinearGradient(0, off - 7, 0, off + 7); lg.addColorStop(0, '#f4c47a'); lg.addColorStop(1, '#d08a3a'); c.fillStyle = lg; c.fillRect(-R, off - 7, R * 2, 14); c.restore(); }
      c.restore();
      c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 30; i++) { const a = i * 1.77, r = (i * 29 % 90); c.fillRect(CX + Math.cos(a) * r, CY + Math.sin(a) * r, 1.6, 1.6); }
    }
  };
}
const CRUMBS = { pie: ['#e8a858', '#b8742e', '#c42840'], pizza: ['#e8b868', '#f8d468', '#c8382c'], cake: ['#ffd6e2', '#fffaf6', '#e02a3a'] };
// a butterfly seen from above
function butterfly(c, x, y, a, t, col) {
  const f = 0.25 + 0.75 * Math.abs(Math.sin(t * 13)); c.save(); c.translate(x, y); c.rotate(a);
  for (const sd of [-1, 1]) { c.save(); c.scale(1, sd * f); c.fillStyle = col; c.beginPath(); c.ellipse(-2, 7, 6, 8, -0.3, 0, TAU); c.fill(); c.beginPath(); c.ellipse(5, 6, 4, 6, 0.4, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(-2, 8, 2, 0, TAU); c.fill(); c.restore(); }
  c.fillStyle = '#3a1640'; c.beginPath(); c.ellipse(0, 0, 7, 2, 0, 0, TAU); c.fill(); c.restore();
}
function ant(c, x, y, a, t) {
  c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = '#2a1820';
  for (const [ox, r] of [[-5, 2.6], [0, 2], [4.5, 2.4]]) { c.beginPath(); c.arc(ox, 0, r, 0, TAU); c.fill(); }
  c.strokeStyle = '#2a1820'; c.lineWidth = 0.9; const w = Math.sin(t * 20) * 1.5;
  for (const sd of [-1, 1]) for (const ox of [-1.5, 0, 1.5]) { c.beginPath(); c.moveTo(ox, 0); c.lineTo(ox + (ox === 0 ? w : -w) * sd, sd * 4.5); c.stroke(); }
  c.beginPath(); c.moveTo(6, -1); c.lineTo(9, -3); c.moveTo(6, 1); c.lineTo(9, 3); c.stroke(); c.restore();
}

MG.add({
  id: 'slice', stage: 'fractions', cmd: 'PARTITION!', hint: 'swipe', time: 9, mood: 'bright', winText: 'Equal parts!', hold: 1.4, cardY: 390,
  card: {
    title: 'Equal parts', ref: 'Grade 3', kind: 'Fractions',
    text: 'A fraction names part of a whole that has been cut into equal parts. Equal means every part is exactly the same size.\n\nThe bottom number says how many equal parts the whole is cut into. The top number says how many of those parts you take. For example, cut a pie into 4 equal slices and take 3 of them. You have 3/4 of the pie. One slice on its own is 1/4 of the pie.\n\nThe parts must be equal. If you cut a pie into 2 pieces and one piece is much bigger, neither piece is one half. That is why every cut here goes through the centre at an even spacing, so all the slices come out the same.',
    note: 'The bottom number is how many equal parts make the whole. The top number is how many of those parts you take.',
    ask: 'A pizza is cut into 8 equal slices and you eat 3. What fraction did you eat? How many straight cuts through the centre make 4 equal slices?',
  },
  init(g) {
    const S = g.s, K = M.setup(g), pool = POOL[g.level], [k, n] = pool[Math.floor(g.rand() * pool.length)];
    Object.assign(S, { k, n, th0: null, rays: [], anims: [], bads: [], parted: null, answered: null, lastMoveT: 0, sw: null, trail: [] });
    S.kind = ['pie', 'pizza', 'cake'][Math.floor(g.rand() * 3)]; S.crumbs = CRUMBS[S.kind];
    g.dur *= 0.55 + 0.15 * swipesOf(n);
    M.zone(g, 'pie', { x: CX, y: CY, w: R * 2, h: R * 2 });
    M.place(g, 'target', M.frac(M.num(k, 'tn'), M.num(n, 'td'), 'tgt'), 180, TY + 0.3 * 54, 54, { col: '#5a1e2a' }); S.T = M.pace(g);
    M.zone(g, 'rabbit', { x: RAB.x, y: RAB.y - 40, w: 60, h: 80 });
    M.play(g, {
      moves(g) { return S.answered ? [] : [{ drag: 'pie', to: 'pie' }]; },
      area(g) { return 'pie'; },
      onWin(g) { S.winAt = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    S.trail = S.trail.filter(p => g.t - p.t < 0.16);
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (S.parted || M.showing(g)) return;
    S.sw = { x0: x, y0: y, x, y }; S.trail = [{ x, y, t: g.t }];
  },
  move(g, x, y) { const S = g.s; if (!S.sw || g.done) return; S.sw.x = x; S.sw.y = y; S.trail.push({ x, y, t: g.t }); if (!S.sw.whoosh && Math.hypot(x - S.sw.x0, y - S.sw.y0) > 40) { S.sw.whoosh = true; g.sfx('swoosh'); } },
  up(g, x, y) {
    const S = g.s, sw = S.sw; S.sw = null; if (!sw || g.done || S.parted) return;
    const cl = classify(g, sw.x0, sw.y0, x, y);
    if (cl) { cut(g, cl); return; }
    if (Math.hypot(x - sw.x0, y - sw.y0) < 34) { // a tap: the doily and the rabbit wiggle, nothing else happens
      if (Math.hypot(x - 180, y - TY) < 60) { S.tgtWig = g.t; g.sfx('tap'); }
      else if (Math.abs(x - RAB.x) < 40 && Math.abs(y - RAB.y + 40) < 50) { S.waveAt = g.t; g.sfx('tap'); }
    }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.parted || (M.showing(g) && !S.bot)) return;
    if (S.bot) { const b = S.bot, k = clamp((g.t - b.t0) / b.dur, 0, 1), x = lerp(b.A[0], b.B[0], easeIO(k)), y = lerp(b.A[1], b.B[1], easeIO(k)); synth('move', x, y); if (k >= 1) { synth('up', x, y); S.bot = null; S.botNext = g.t + 0.25; } return; }
    if (g.t < (S.botNext ?? 0.5)) return;
    const nc = nextCut(S); if (!nc) return; const [A, B] = cutPath(nc);
    synth('down', A[0], A[1]); S.bot = { A, B, t0: g.t, dur: 0.2 };
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('fr_slice_picnic', picnic), 0, 0, W, H);
    ambient(g, c, t);
    drawTarget(g, c, S);
    drawPie(g, c, S);
    drawGuide(g, c, S);
    drawSwipe(g, c, S);
    drawRabbit(g, c, S);
    if (S.winAt != null && t - S.winAt > 0.5) drawLifted(g, c, S, true);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

// the next cut the guidance shows and the bot makes: { a, through }
function nextCut(S) {
  if (S.th0 == null) return S.n === 3 ? { a: -Math.PI / 2, through: false } : { a: Math.PI / 2, through: true };
  const open = slotsOf(S).filter(s => !hasRay(S, s)); if (!open.length) return null;
  // the open angle nearest to straight down-right reads best; for thirds the cuts are radial
  const a = open[0];
  if (S.n === 3) return { a, through: false };
  return { a, through: !hasRay(S, wrapA(a + Math.PI)) };
}
function cutPath(nc) {
  const ux = Math.cos(nc.a), uy = Math.sin(nc.a), L = R * 1.18;
  return nc.through ? [[CX - ux * L, CY - uy * L], [CX + ux * L, CY + uy * L]] : [[CX + ux * 6, CY + uy * 6], [CX + ux * L, CY + uy * L]];
}

// ---------------- drawing ----------------
function ambient(g, c, t) {
  for (const [i, col] of [[0, '#ffd45a'], [1, '#9ad8ff']]) {
    const x = 180 + Math.sin(t * 0.37 + i * 2.6) * 150, y = i ? 590 + Math.sin(t * 0.9) * 24 : 160 + Math.sin(t * 0.6 + 1) * 26, a = Math.cos(t * 0.37 + i * 2.6) * (i ? -1 : 1) * 0.6 + (i ? Math.PI : 0);
    butterfly(c, x, y, a, t + i, col);
  }
  // a line of ants marching across the corner of the blanket toward the pie
  for (let i = 0; i < 6; i++) { const u = ((t * 0.05 + i * 0.045) % 1), x = -10 + u * 120, y = 560 - u * 40 + Math.sin(u * 30) * 3; ant(c, x, y, -0.32 + Math.cos(u * 30) * 0.2, t + i); }
}
function drawTarget(g, c, S) {
  const t = g.t, wig = S.tgtWig != null && t - S.tgtWig < 0.4 ? Math.sin((t - S.tgtWig) * 40) * 0.06 * (1 - (t - S.tgtWig) / 0.4) : 0;
  c.save(); c.translate(180, TY); c.rotate(wig); c.translate(-180, -TY);
  if (S.answered) M.glowBox(c, { x: 180, y: TY, w: 86, h: 86 }, t, 0.9, true);
  M.drawEx(g, c, 'target');
  c.restore();
}
function wedgeClip(c, a0, a1, r = R + 4) { c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, r, a0, a1); c.closePath(); }
function drawPie(g, c, S) {
  const t = g.t, img = g.bake('fr_slice_' + S.kind, food(S.kind));
  // jelly wobble after an uneven cut
  const wk = S.wobAt != null ? (t - S.wobAt) / 0.5 : 1, wob = wk < 1 ? Math.sin(wk * 26) * 0.05 * (1 - wk) : 0;
  c.save(); c.translate(CX, CY); c.scale(1 + wob, 1 - wob); c.translate(-CX, -CY);
  if (!S.parted) {
    c.drawImage(img, 0, 0, W, H);
    // the cuts so far: a dark gap with a light edge; a new cut flashes and slides to its snapped angle
    for (const an of S.anims) {
      const k = clamp((t - an.at) / 0.1, 0, 1), a = lerp(an.from + nearestTurn(an.from, an.a), an.a, ease(k)), ux = Math.cos(a), uy = Math.sin(a), L = (R + 2) * easeIO((t - an.at) / (an.dur || 0.01));
      c.lineCap = 'round'; c.strokeStyle = 'rgba(60,18,16,0.7)'; c.lineWidth = 5; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + ux * L, CY + uy * L); c.stroke();
      c.strokeStyle = 'rgba(255,244,226,0.8)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(CX - uy * 3, CY + ux * 3); c.lineTo(CX + ux * L - uy * 3, CY + uy * L + ux * 3); c.stroke();
      const fl = t - an.at; if (fl < (an.dur || 0) + 0.3) { c.save(); c.globalAlpha = Math.min(1, 1 - (fl - (an.dur || 0)) / 0.3); c.shadowColor = '#fff6c0'; c.shadowBlur = 14; c.strokeStyle = '#fffbe8'; c.lineWidth = 4; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + ux * (L + 4), CY + uy * (L + 4)); c.stroke();
        if (L < R) { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(CX + ux * L, CY + uy * L, 5, 0, TAU); c.fill(); } c.restore(); }
    }
  } else {
    S.wedges.forEach((w, i) => { if (S.lifted.has(i)) return; const gp = 2.5 * ease((t - S.parted) / 0.15);
      c.save(); c.translate(Math.cos(w.mid) * gp, Math.sin(w.mid) * gp); wedgeClip(c, w.a0, w.a1); c.clip(); c.drawImage(img, 0, 0, W, H); c.restore(); });
    if (!(S.winAt != null && t - S.winAt > 0.5)) drawLifted(g, c, S, false);
    drawBadges(g, c, S);
  }
  // uneven cuts: a ragged line that wobbles and then heals with sparkles
  for (const b of S.bads) {
    const k = (t - b.at) / 0.6; if (k > 1) continue; const [x0, y0, x1, y1] = b.chord || [CX, CY, CX + Math.cos(b.a) * R, CY + Math.sin(b.a) * R];
    c.save(); c.globalAlpha = k < 0.45 ? 1 : 1 - (k - 0.45) / 0.55; c.strokeStyle = '#7a1424'; c.lineWidth = 4.5; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
    for (let i = 0; i <= 14; i++) { const u = i / 14, j = (i % 2 ? 1 : -1) * 2.6, nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1; const px = lerp(x0, x1, u) + nx / L * j, py = lerp(y0, y1, u) + ny / L * j; i ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.stroke();
    if (k > 0.4) { c.fillStyle = '#fff6c0'; for (let i = 0; i < 4; i++) { const u = (i + 0.5) / 4, px = lerp(x0, x1, u), py = lerp(y0, y1, u) - (k - 0.4) * 30; star(c, px, py, 3); } }
    c.restore();
  }
  c.restore();
  // level 0: notches on the plate rim at every angle still to cut (the snapping guide)
  if (g.level === 0 && S.th0 != null && !S.parted) for (const s of slotsOf(S)) { if (hasRay(S, s)) continue; const p = 0.6 + 0.4 * Math.sin(t * 6); c.save(); c.translate(CX + Math.cos(s) * (R + 13), CY + Math.sin(s) * (R + 13)); c.rotate(s); c.fillStyle = `rgba(240,170,40,${p})`; c.beginPath(); c.moveTo(-5, 0); c.lineTo(5, -5); c.lineTo(5, 5); c.closePath(); c.fill(); c.restore(); }
}
const nearestTurn = (from, to) => Math.round((to - from) / TAU) * TAU;
function star(c, x, y, r) { c.beginPath(); c.moveTo(x, y - r * 2); c.quadraticCurveTo(x, y, x + r * 2, y); c.quadraticCurveTo(x, y, x, y + r * 2); c.quadraticCurveTo(x, y, x - r * 2, y); c.quadraticCurveTo(x, y, x, y - r * 2); c.fill(); }
// the lifted slices: each raised with a shadow as it lifts, labelled 1/n; on the win they hop onto the rabbit's plate
function drawLifted(g, c, S, toPlate) {
  const t = g.t, img = g.bake('fr_slice_' + S.kind, food(S.kind)), gp = 2.5 * ease((t - S.parted) / 0.15);
  let k = 0; if (toPlate) k = easeIO((t - S.winAt - 0.5) / 0.35);
  const [lx, ly] = liftOf(S, 0, 1), mx = CX + Math.cos(S.liftMid) * R * 0.5 + lx, my = CY + Math.sin(S.liftMid) * R * 0.5 + ly, px = S.plate ? S.plate.x : RAB.x - 30, py = S.plate ? S.plate.y - 6 : RAB.y - 40;
  const sc = lerp(1, 0.34 / Math.max(1, S.k * 0.6), k), hop = Math.sin(k * Math.PI) * 60;
  c.save(); c.translate(lerp(0, px - mx, k), lerp(0, py - my, k) - hop); c.translate(mx, my); c.scale(sc, sc); c.translate(-mx, -my);
  const off = i => { const q = toPlate ? 1 : liftK(g, S, i), o = liftOf(S, i, q), w = S.wedges[i]; return [o[0] + Math.cos(w.mid) * gp * (1 - q), o[1] + Math.sin(w.mid) * gp * (1 - q), q]; };
  for (const i of S.lifted) { const [ox, oy, q] = off(i), w = S.wedges[i]; if (q <= 0) continue; c.save(); c.globalAlpha = q; c.translate(ox + 5, oy + 9); c.fillStyle = 'rgba(70,30,30,0.28)'; wedgeClip(c, w.a0, w.a1, R + 2); c.fill(); c.restore(); }
  for (const i of S.lifted) { const [ox, oy] = off(i), w = S.wedges[i]; c.save(); c.translate(ox, oy); wedgeClip(c, w.a0, w.a1); c.clip(); c.drawImage(img, 0, 0, W, H); c.restore(); }
  // the label on each lifted slice: 1/n ("?" until it is answered in medium mode)
  if (k < 0.5) for (const i of S.lifted) { if (!S.liftT[i] && !toPlate) continue;
    const [ox, oy] = off(i), b = badgeXY(S, i), x = b.x + ox, y = b.y + oy, t0 = S.liftT[i] ?? S.parted, pk = clamp((t - t0 - 0.1) / 0.25, 0, 1); if (pk <= 0) continue;
    const q = g.mode === 'medium' && !S.oneShown, node = q ? M.txt('?') : M.frac(M.num(1), M.num(S.n)), s = q ? 26 : 22, m = M.lay(node, s), rp = S.oneShown && i === S.liftOrder[0] ? clamp((t - S.oneShown) / 0.3, 0, 1) : 1, pop = 1 + Math.sin(pk * Math.PI) * 0.3 + Math.sin(rp * Math.PI) * 0.3;
    c.save(); c.globalAlpha = 1 - k * 2; c.translate(x, y); c.scale(pop, pop);
    c.shadowColor = '#ffe27a'; c.shadowBlur = 16; c.fillStyle = 'rgba(255,252,240,0.94)'; c.beginPath(); c.arc(0, 0, 21, 0, TAU); c.fill(); c.shadowBlur = 0; c.strokeStyle = '#d89a3a'; c.lineWidth = 2.5; c.stroke();
    M.draw(c, node, -m.w / 2, (m.a - m.d) / 2, s, { t, col: '#5a1e2a' }); c.restore();
  }
  c.restore();
}
// the counting badges (1, 2, ..., n), one per slice; they fade once the count has flown into the fraction
function drawBadges(g, c, S) {
  if (!S.badge) return; const t = g.t, rad = S.n >= 6 ? 15 : 18, fs = S.n >= 6 ? 18 : 21, out = S.countDone != null ? clamp((t - S.countDone) / 0.25, 0, 1) : 0; if (out >= 1) return;
  for (const [i, bd] of Object.entries(S.badge)) { const w = +i, q = liftK(g, S, w), o = liftOf(S, w, q), b = badgeXY(S, w), k = clamp((t - bd.t0) / 0.2, 0, 1), pop = 0.4 + 0.6 * ease(k) + Math.sin(k * Math.PI) * 0.35, last = bd.v === S.n;
    c.save(); c.globalAlpha = 1 - out; c.translate(b.x + o[0], b.y + o[1]); c.scale(pop, pop);
    c.fillStyle = last ? '#c8401a' : 'rgba(255,252,240,0.95)'; c.shadowColor = 'rgba(60,20,20,0.35)'; c.shadowBlur = 6; c.beginPath(); c.arc(0, 0, rad, 0, TAU); c.fill(); c.shadowBlur = 0;
    c.font = M.NUMF(fs, 700); c.fillStyle = last ? '#ffffff' : '#5a1e2a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(bd.v), 0, 1); c.restore(); }
}
function drawSwipe(g, c, S) {
  const t = g.t;
  // the knife's trail
  if (S.trail.length > 1) { c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; for (let i = 1; i < S.trail.length; i++) { const a = S.trail[i - 1], b = S.trail[i], k = 1 - (t - b.t) / 0.16; c.strokeStyle = `rgba(255,255,255,${0.85 * k})`; c.lineWidth = 2 + 6 * k; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); } c.restore(); }
  // a live preview of where the cut will snap: gold when it makes equal parts, red when it would be uneven
  const sw = S.sw; if (!sw || S.parted) return;
  const cl = classify(g, sw.x0, sw.y0, sw.x, sw.y); if (!cl) return;
  c.save(); c.lineCap = 'round';
  if (cl.kind === 'chord') { const [x0, y0, x1, y1] = chordOf(cl); c.setLineDash([7, 6]); c.strokeStyle = 'rgba(220,40,60,0.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); return; }
  const tmp = { n: S.n, th0: S.th0, rays: S.rays.slice() };
  for (const j of judgeAll(tmp, cl.rays, tolOf(g))) {
    const ux = Math.cos(j.a), uy = Math.sin(j.a);
    if (j.st === 'bad') { c.setLineDash([7, 6]); c.strokeStyle = 'rgba(220,40,60,0.85)'; c.lineWidth = 3; } else { c.setLineDash([]); c.shadowColor = '#ffd84a'; c.shadowBlur = 12; c.strokeStyle = j.st === 'ok' ? 'rgba(255,214,70,0.95)' : 'rgba(255,255,255,0.5)'; c.lineWidth = 4; }
    c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + ux * (R + 4), CY + uy * (R + 4)); c.stroke(); c.shadowBlur = 0;
  }
  c.restore();
}
function drawGuide(g, c, S) {
  const t = g.t, K = S.mk, failed = g.done && g.result === 'fail';
  if (S.parted || (g.done && !failed) || (K.ask && !K.ask.closing)) return;
  if (failed) { // the right cuts, in gold
    if (t - g.doneAt < 0.3) return; const th0 = S.th0 ?? (S.n === 3 ? -Math.PI / 2 : Math.PI / 2), a = clamp((t - g.doneAt - 0.3) / 0.25, 0, 1);
    c.save(); c.globalAlpha = a; c.setLineDash([8, 6]); c.lineDashOffset = -t * 20; c.strokeStyle = '#ffd84a'; c.shadowColor = '#ffd84a'; c.shadowBlur = 10; c.lineWidth = 3.5; c.lineCap = 'round';
    for (const s of slotsOf(S, th0)) { if (hasRay(S, s)) continue; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + Math.cos(s) * (R + 4), CY + Math.sin(s) * (R + 4)); c.stroke(); }
    c.restore(); return;
  }
  if (S.sw) return;
  M.glowBox(c, { x: CX, y: CY, w: 24, h: 24 }, t, 0.85, true); // the centre always glows: every cut goes through it
  if ((g.level !== 0 && t - S.lastMoveT < 2) || t < 0.4) return; // the ghost hand: level 0, or after a 2 s pause
  const nc = nextCut(S); if (!nc) return; const [A, B] = cutPath(nc);
  const per = 1.5, k = ((t - 0.4) % per) / per, e = easeIO(clamp((k - 0.14) / 0.5, 0, 1)), fade = k > 0.86 ? (1 - k) / 0.14 : 1;
  const hx = lerp(A[0], B[0], e), hy = lerp(A[1], B[1], e);
  c.save(); c.globalAlpha = 0.85 * fade; c.setLineDash([6, 8]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke();
  c.setLineDash([]); c.shadowColor = '#ffd84a'; c.shadowBlur = 14; c.strokeStyle = 'rgba(255,220,90,0.9)'; c.lineWidth = 4.5; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(hx, hy); c.stroke(); c.restore();
  c.save(); c.globalAlpha = fade; M.hand(c, hx + 2, hy + 4, 1, k < 0.14 || k > 0.64 ? 1 : 0); c.restore();
}
function drawRabbit(g, c, S) {
  const t = g.t, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const hop = S.hopAt != null && t - S.hopAt < 0.4 ? Math.sin((t - S.hopAt) / 0.4 * Math.PI) : 0, oh = S.ohAt != null && t - S.ohAt < 0.8;
  const landed = won && t - S.winAt > 0.85, bounce = landed ? Math.abs(Math.sin((t - S.winAt) * 9)) * 8 : 0;
  const pose = S.waveAt != null && t - S.waveAt < 0.8 ? 'wave' : hop > 0 ? 'hop' : 'idle';
  const expr = landed ? 'laugh' : won ? 'wow' : lost ? 'sad' : oh ? (t - S.ohAt < 0.3 ? 'wow' : 'laugh') : S.parted ? 'wow' : 'happy';
  const plate = cc => { cc.fillStyle = 'rgba(60,30,30,0.25)'; cc.beginPath(); cc.ellipse(1, 3, 22, 8, 0, 0, TAU); cc.fill(); cc.fillStyle = '#ffffff'; cc.beginPath(); cc.ellipse(0, 0, 22, 8, 0, 0, TAU); cc.fill(); cc.strokeStyle = '#7ab0d8'; cc.lineWidth = 1.6; cc.beginPath(); cc.ellipse(0, 0, 17, 5.5, 0, 0, TAU); cc.stroke(); };
  try {
    if (typeof ANI !== 'undefined') { const r = ANI.draw(c, 'rabbit', RAB.x, RAB.y - hop * 16 - bounce, RAB.s, { t, pose, expr, facing: -1, hold: plate }); if (r && r.hold) S.plate = r.hold; return; }
  } catch (e) { }
  P.sheep(c, RAB.x, RAB.y, 1, { t });
}
