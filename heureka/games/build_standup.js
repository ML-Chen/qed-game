// STAND IT UP! (build EE ME-16) — a stream crossed by planks resting on rocks; the beaver is coming with a heavy log.
// Drag each plank up to turn it onto its edge. On its edge a plank is far stiffer and barely sags; left lying flat it
// bends down into the water and the beaver gets wet feet.
// The sag is worked out like a real beam: vertical stiffness goes with width x thickness³, so standing a 10-unit-thick,
// 44-unit-wide plank on its edge makes it about 19 times stiffer. Level 2: four planks and a heavier load.
const SU_TOP = 392, SU_WATER = 434, SU_W = 58, SU_H = 13, SU_X0 = 46, SU_X1 = 316;
const SU_LV = [{ n: 3, load: 1 }, { n: 3, load: 1.15 }, { n: 4, load: 1.5 }];
const SU_FLAT = 104; // centre sag (px) of a flat plank under the beaver at level 0
function suSag(q, a, load) { // sag at the plank's middle with the beaver at fraction a along it, for plank angle q.r
  const c2 = Math.cos(q.r) ** 2, s2 = 1 - c2, ratio = (SU_W * SU_W) / (SU_H * SU_H); // I_strong / I_weak
  return SU_FLAT * load * (c2 + s2 / ratio) * Math.sin(Math.PI * SK.clamp(a, 0, 1));
}
function suPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#8ccfe4', '#cdeaf0', '#f4f2d8']); P.cloud(o, 90, 190, 0.7); P.cloud(o, 280, 240, 0.5);
  o.fillStyle = '#9cc490'; o.beginPath(); o.moveTo(0, 330); for (let x = 0; x <= 360; x += 8) o.lineTo(x, 280 - 22 * Math.sin(x / 60) - 10 * Math.sin(x / 19)); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  for (let i = 0; i < 7; i++) P.tree(o, 10 + i * 56, 350 - (i % 2) * 8, 0.6 + (i % 3) * 0.08, ['#4f8a44', '#5f9a4a', '#467a3e'][i % 3], 30 + i);
  // the stream
  B5.vgrad(o, 0, SU_WATER - 6, 360, 160, ['#7ad0e0', '#3aa0c0', '#2a7aa0', '#1e5a80']);
  o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 2; for (let i = 0; i < 14; i++) { const x = (i * 61) % 340 + 10, y = SU_WATER + 14 + (i * 37) % 120; o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + 10, y - 4, x + 22, y); o.stroke(); }
  // the banks, grassy earth
  const bank = (x0, x1, lean) => { o.beginPath(); o.moveTo(x0, SU_TOP + 6); o.lineTo(x1, SU_TOP + 6); o.lineTo(x1 + lean, 640); o.lineTo(x0, 640); o.closePath(); const gr = o.createLinearGradient(0, SU_TOP, 0, 640); gr.addColorStop(0, '#8a6a44'); gr.addColorStop(1, '#5a4030'); o.fillStyle = gr; o.fill(); o.fillStyle = '#7ab450'; o.fillRect(Math.min(x0, x1), SU_TOP - 2, Math.abs(x1 - x0), 10); };
  bank(-10, SU_X0 + 6, -24); bank(370, SU_X1 - 6, 24);
  P.grassTufts(o, 60, SU_TOP - 4, SU_TOP + 4, 6, '#6aa848', 4); o.save(); o.translate(300, 0); P.grassTufts(o, 60, SU_TOP - 4, SU_TOP + 4, 6, '#6aa848', 6); o.restore();
  P.grain(o, 360, 640, 0.035);
}
// a plank in a gentle three-quarter view (depth goes up and to the left), turned by q.r about its long axis,
// bent down by sag(x) along its length
function suPlank(c, x0, x1, r, sagAt, hi) {
  const cr = Math.cos(r), sr = Math.sin(r), pts = [[-SU_W / 2, -SU_H / 2], [SU_W / 2, -SU_H / 2], [SU_W / 2, SU_H / 2], [-SU_W / 2, SU_H / 2]]
    .map(([z, u]) => { const z2 = z * cr - u * sr, u2 = z * sr + u * cr; return [z2, u2]; }); // [depth, up]
  const P2 = (x, [z, u]) => [x - z * 0.42, SU_TOP + 5 + sagAt(x) - u - z * 0.32];
  const faces = [0, 1, 2, 3].map(i => { const a = pts[i], b = pts[(i + 1) % 4]; return { a, b, z: (a[0] + b[0]) / 2 - ((a[1] + b[1]) / 2) * 0.6, i }; }).sort((p, q) => q.z - p.z);
  const N = 14;
  for (const f of faces) {
    const nz = (f.a[1] + f.b[1]) / 2, lit = SK.clamp(0.5 + nz / SU_W, 0, 1), wide = Math.hypot(f.a[0] - f.b[0], f.a[1] - f.b[1]) > SU_H * 2;
    c.fillStyle = P.mix('#8a5a30', wide ? '#e8b878' : '#d0965a', lit); c.strokeStyle = '#4a2a18'; c.lineWidth = 1.5;
    c.beginPath(); for (let k = 0; k <= N; k++) { const x = SK.lerp(x0, x1, k / N), p = P2(x, f.a); k ? c.lineTo(...p) : c.moveTo(...p); } for (let k = N; k >= 0; k--) c.lineTo(...P2(SK.lerp(x0, x1, k / N), f.b)); c.closePath(); c.fill(); c.stroke();
    if (wide) { c.strokeStyle = 'rgba(110,64,30,0.35)'; c.lineWidth = 1; for (const m of [0.33, 0.66]) { c.beginPath(); for (let k = 0; k <= N; k++) { const x = SK.lerp(x0, x1, k / N), A = P2(x, f.a), B = P2(x, f.b); const p = [SK.lerp(A[0], B[0], m), SK.lerp(A[1], B[1], m)]; k ? c.lineTo(...p) : c.moveTo(...p); } c.stroke(); } }
  }
  // the near end, showing the cut end grain (growth rings) so the turn is easy to see
  c.fillStyle = '#f0cc90'; c.strokeStyle = '#4a2a18'; c.lineWidth = 2; c.beginPath(); pts.forEach((p, i) => { const q = P2(x0, p); i ? c.lineTo(...q) : c.moveTo(...q); }); c.closePath(); c.fill(); c.stroke();
  const ctr = P2(x0, [0, 0]); c.save(); c.clip(); c.strokeStyle = 'rgba(150,90,40,0.55)'; c.lineWidth = 1.3; for (let k = 1; k < 5; k++) { c.beginPath(); c.arc(ctr[0] + 30 * cr, ctr[1] + 30 * sr, k * 9, 0, 7); c.stroke(); } c.restore();
  if (hi) { c.save(); c.strokeStyle = 'rgba(255,240,170,0.9)'; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); pts.forEach((p, i) => { const q = P2(x0, p); i ? c.lineTo(...q) : c.moveTo(...q); }); c.closePath(); c.stroke(); c.restore(); }
}
MG.add({
  id: 'standup', stage: 'build', cmd: 'STAND IT UP!', time: 6, mood: 'desert', winText: 'Beam depth!', failText: 'Wet feet!',
  card: { title: 'Stand the plank on its edge', kind: 'Engineering', ref: 'Beam stiffness (second moment of area)',
    text: 'A plank lying flat bends easily under a weight. Turn the same plank onto its edge and it hardly bends at all.\n\nHow much a beam resists bending depends on its depth, its height in the direction it is pushed. Stiffness grows with the depth multiplied by itself three times. So a plank four times deeper than it is thick is about sixteen times stiffer on its edge.\n\nThat is why floor joists and roof beams stand tall and thin, and why steel beams are shaped like a tall letter I.',
    note: 'A beam is much stiffer when it is deep in the direction of the load, so planks and joists go on their edge.' },
  init(g) {
    const s = g.s, L = SU_LV[Math.min(2, g.level)], n = L.n, span = (SU_X1 - SU_X0) / n; s.L = L; s.span = span;
    const starts = [0, 0.22, 0.08, 0.3]; s.pl = []; for (let k = 0; k < n; k++) s.pl.push({ x0: SU_X0 + k * span, x1: SU_X0 + (k + 1) * span, r: starts[k], up: 0 });
    s.bx = 24; s.walkT = 0; s.wet = 0; s.grab = null;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const q = s.pl.find(q => x > q.x0 - 14 && x < q.x1 + 6 && y > SU_TOP - 100 && y < SU_TOP + 80); if (q) { s.grab = { q, y0: y, r0: q.r }; g.sfx('rustle'); } },
  move(g, x, y) { const s = g.s, G = s.grab; if (!G || g.done) return; const r = SK.clamp(G.r0 + (G.y0 - y) / 95 * Math.PI / 2, 0, Math.PI / 2); if (r >= Math.PI / 2 - 0.02 && G.q.r < Math.PI / 2 - 0.02) { g.sfx('thud'); G.q.up = g.t; } G.q.r = r; },
  up(g) { g.s.grab = null; },
  update(g, dt) {
    const s = g.s, L = s.L;
    // the beaver sets off on its own, or as soon as every plank stands on its edge
    if (!s.walkT) { const all = s.pl.every(q => q.r > 1.3) && !s.grab; if (all || (!B5.patient() && g.t > SK.clamp(g.dur * 0.32, 2.2, 4.2))) { s.walkT = g.t; g.sfx('stretch'); } return; }
    if (s.wet || g.done) return;
    s.bx += 92 * dt;
    const q = s.pl.find(q => s.bx >= q.x0 && s.bx < q.x1);
    if (q) { const sag = suSag(q, (s.bx - q.x0) / s.span, L.load); if (sag > SU_WATER - SU_TOP + 2) { s.wet = g.t; g.sfx('splash'); g.sfx('laugh'); g.burst(s.bx, SU_WATER, ['#bfe8ff', '#ffffff', '#7ad0e0'], 22, 200); g.fail(); } }
    if (s.bx > SU_X1 + 14) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, L = s.L;
    c.drawImage(g.bake('standup_bg', suPaint), 0, 0, 360, 640);
    // rocks holding up the plank ends in the stream
    for (let k = 1; k < s.pl.length; k++) P.rock(c, s.pl[k].x0 - 6, SU_WATER + 4, 1.1, '#9a8e84');
    // the planks: the one under the beaver sags by the beam formula
    const SY = new Map();
    for (const q of s.pl) {
      const on = s.walkT && s.bx >= q.x0 && s.bx < q.x1, a = on ? (s.bx - q.x0) / s.span : -1, mid = on ? suSag(q, a, L.load) : 0;
      const sagAt = x => { if (!on) return 0; const u = (x - q.x0) / s.span; return mid * Math.sin(Math.PI * u) * (u < a ? u / Math.max(a, 0.05) * 0.4 + 0.6 : (1 - u) / Math.max(1 - a, 0.05) * 0.4 + 0.6); };
      suPlank(c, q.x0, q.x1, q.r, sagAt, !s.walkT && q.r < 1.3 && !g.done);
      SY.set(q, on ? mid : 0);
    }
    // the beaver carrying its heavy log
    const won = g.result === 'win', lost = g.result === 'fail', qn = s.pl.find(q => s.bx >= q.x0 && s.bx < q.x1);
    const by = SU_TOP - (qn ? 5 - SY.get(qn) - Math.max(0, Math.sin(qn.r) * (SU_W - SU_H) / 2) : 4) + (s.wet ? Math.min(14, (t - s.wet) * 40) : 0);
    SK.animal(c, 'beaver', s.bx, by, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : s.walkT ? 'carry' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy',
      hold: won ? null : o => { o.fillStyle = '#a06a3a'; o.strokeStyle = '#4a2a18'; o.lineWidth = 2; o.beginPath(); o.roundRect(-34, -9, 68, 18, 8); o.fill(); o.stroke(); o.fillStyle = '#e8c08a'; o.beginPath(); o.ellipse(34, 0, 5, 9, 0, 0, 7); o.fill(); o.stroke(); } });
    if (s.wet) { c.fillStyle = 'rgba(122,208,224,0.85)'; c.fillRect(s.bx - 30, SU_WATER - 2, 60, 6); }
    const q0 = s.pl.find(q => q.r < 1.3); if (q0) SK.demo(g, c, 'drag', [q0.x0 + 24, SU_TOP + 12], [q0.x0 + 24, SU_TOP - 80]);
  },
  auto(g, dt, synth) { const s = g.s; s.pl.forEach((q, k) => SK.bot.drag(g, synth, 'p' + k, 0.9 + k * 0.32, [q.x0 + 24, SU_TOP + 10], [q.x0 + 24, SU_TOP + 10 - 140], 0.2)); },
});
