// HOLD ON! (business PF-35) — the market is a roller coaster (illustrative): the track climbs, dives steeply, then climbs
// back above where it started. The turtle's money rides in the cart. Press the cart's safety bar and keep your finger on
// it as it rides: through the scary dive and out the other side, to the flag above the starting line. Let go (or lose
// the cart) in the dive and the turtle hops off at the bottom, selling low, and watches the coaster climb away.
// Level 1: faster. Level 2: a second, smaller dip right after the first.
const TRACKS = [
  [[18, 360], [70, 320], [118, 282], [150, 330], [184, 486], [214, 512], [246, 440], [282, 330], [316, 262], [348, 226]],
  [[18, 366], [64, 330], [110, 286], [146, 340], [178, 500], [208, 522], [240, 446], [276, 330], [312, 256], [348, 214]],
  [[18, 368], [52, 320], [88, 300], [116, 470], [142, 508], [170, 420], [196, 352], [224, 450], [252, 430], [290, 300], [348, 212]],
];
const SPEED = [70, 86, 96], GRIP = 74;
function cr(P0, P1, P2, P3, k) { const k2 = k * k, k3 = k2 * k; return 0.5 * (2 * P1 + (-P0 + P2) * k + (2 * P0 - 5 * P1 + 4 * P2 - P3) * k2 + (-P0 + 3 * P1 - 3 * P2 + P3) * k3); }
function trackY(T, x) { // a smooth curve through the points (Catmull-Rom), as y at x
  let i = 0; while (i < T.length - 2 && T[i + 1][0] < x) i++;
  const p0 = T[Math.max(0, i - 1)], p1 = T[i], p2 = T[i + 1], p3 = T[Math.min(T.length - 1, i + 2)], k = SK.clamp((x - p1[0]) / (p2[0] - p1[0]), 0, 1);
  return cr(p0[1], p1[1], p2[1], p3[1], k);
}
function paintPark(o) {
  const sky = o.createLinearGradient(0, 0, 0, 600); sky.addColorStop(0, '#7ac0e8'); sky.addColorStop(0.6, '#c8e6f0'); sky.addColorStop(1, '#fff2d8'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  P.cloud(o, 70, 170, 0.8); P.cloud(o, 270, 140, 0.6);
  P.hills(o, 360, 560, 40, '#a8d070', '#78a848', { seed: 2 });
  o.fillStyle = '#78a848'; o.fillRect(0, 580, 360, 60);
  // a big wheel far away
  o.strokeStyle = 'rgba(120,90,140,0.35)'; o.lineWidth = 3; o.beginPath(); o.arc(300, 480, 56, 0, 7); o.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; o.beginPath(); o.moveTo(300, 480); o.lineTo(300 + Math.cos(a) * 56, 480 + Math.sin(a) * 56); o.stroke(); }
}
function cart(c, x, y, ang, t, rider, holding) {
  c.save(); c.translate(x, y); c.rotate(ang);
  if (rider) SK.animal(c, 'turtle', 0, -14, 0.62, { t, pose: holding ? 'balance' : 'idle', expr: holding && ang > 0.5 ? 'wow' : 'happy', noShadow: true });
  c.fillStyle = '#e8403a'; c.strokeStyle = '#7a1a14'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-26, -22, 52, 24, 8); c.fill(); c.stroke();
  c.fillStyle = '#f5c23a'; c.fillRect(-20, -16, 40, 5);
  c.strokeStyle = '#f5c23a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-18, -32); c.lineTo(18, -32); c.stroke(); // the safety bar
  for (const wx of [-16, 16]) { c.fillStyle = '#2a2430'; c.beginPath(); c.arc(wx, 4, 6, 0, 7); c.fill(); }
  c.restore();
}
MG.add({
  id: 'holdon', stage: 'money', cmd: 'HOLD ON THROUGH THE CRASH!', time: 6, mood: 'bright', winText: 'Stay invested!', failText: 'Sold low!', hold: 1.7,
  card: { title: 'Don\'t jump off in a crash', kind: 'Money', ref: 'Staying invested',
    text: 'Prices in the stock market go up and down. Sometimes they fall fast. That is called a crash, and it is scary to watch.\n\nIf you sell at the bottom, you lock in the loss: you get out at the lowest price and miss the climb back. Over long stretches, broad stock markets have recovered from past crashes, though it has sometimes taken many years, even decades in a few countries, and nothing guarantees it.\n\nPeople who stay invested through the dip are still on board when prices rise again. This is general information, not financial advice.',
    note: 'Selling in a crash turns a dip on paper into a real loss.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.T = TRACKS[L].map(([x, y], i) => [x, y + (i > 0 && i < TRACKS[L].length - 1 ? (g.rand() - 0.5) * 16 : 0)]);
    s.v = SPEED[L]; s.x = 30; s.go = false; s.off = 0; s.offX = 0; s.ptr = null; s.startY = trackY(s.T, 30);
  },
  pos(g, x) { const y = trackY(g.s.T, x), y2 = trackY(g.s.T, x + 2); return { x, y, ang: Math.atan2(y2 - y, 2) }; },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.off) return; const p = this.pos(g, s.x); if (SK.dist(x, y, p.x, p.y - 30) < GRIP) { s.go = true; s.ptr = { x, y }; g.sfx('click'); } },
  move(g, x, y) { const s = g.s; if (s.ptr) s.ptr = { x, y }; },
  up(g) { const s = g.s; if (s.go && !s.off && !g.done) this.jump(g); s.ptr = null; },
  jump(g) { const s = g.s; s.off = g.t; s.offX = s.x; s.go = false; g.sfx('boing'); if (trackY(s.T, s.x) > s.startY) { g.sfx('fail'); } }, // hopped off
  update(g, dt) {
    const s = g.s; if (g.done && g.result === 'win') return;
    if (s.go || s.off) { const p = this.pos(g, s.x), slope = Math.sin(p.ang); s.x = Math.min(342, s.x + s.v * (1 + 0.35 * slope) * dt); } // a bit faster downhill
    if (s.go && s.ptr) { const p = this.pos(g, s.x); if (SK.dist(s.ptr.x, s.ptr.y, p.x, p.y - 30) > GRIP * 1.25) this.jump(g); } // your finger slipped off the bar
    if (s.x >= 342 && !g.done) { if (s.go) { g.win(); g.sfx('cheer'); g.burst(342, trackY(s.T, 342) - 30, ['#ffe27a', '#7ad070', '#fff6ea'], 24, 220); } else if (s.off) { g.fail(); g.sfx('laugh'); } }
    if (s.off && !g.done && trackY(s.T, s.offX) <= s.startY + 2 && g.t - s.off > 0.2 && s.x >= 342) g.fail();
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', T = s.T;
    c.drawImage(g.bake('b8hold_p', paintPark), 0, 0, 360, 640);
    // the start line: where the price started
    c.save(); c.strokeStyle = 'rgba(58,22,64,0.55)'; c.lineWidth = 3; c.setLineDash([9, 7]); c.beginPath(); c.moveTo(0, s.startY); c.lineTo(360, s.startY); c.stroke(); c.restore();
    // supports, then the track: red below the start line (a loss on paper), green above it
    c.strokeStyle = '#a89aa8'; c.lineWidth = 3; for (let x = 24; x < 350; x += 22) { const y = trackY(T, x); c.beginPath(); c.moveTo(x, y + 6); c.lineTo(x, 600); c.stroke(); }
    c.lineCap = 'round'; for (let x = 18; x < 348; x += 3) { const y0 = trackY(T, x), y1 = trackY(T, x + 3); c.strokeStyle = y0 > s.startY ? '#e8566a' : '#5ab870'; c.lineWidth = 7; c.beginPath(); c.moveTo(x, y0); c.lineTo(x + 3, y1); c.stroke(); }
    c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; c.beginPath(); for (let x = 18; x <= 348; x += 4) { const y = trackY(T, x) - 2; x === 18 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    // the finish flag
    const fy = trackY(T, 342); c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(346, fy); c.lineTo(346, fy - 54); c.stroke(); c.fillStyle = '#f5c23a'; c.beginPath(); c.moveTo(346, fy - 54); c.lineTo(320 + Math.sin(t * 6) * 3, fy - 46); c.lineTo(346, fy - 38); c.closePath(); c.fill();
    // the cart; once the turtle has hopped off it stands at that spot, sad, and the empty cart climbs away
    const p = this.pos(g, s.x);
    cart(c, p.x, p.y - 6, p.ang, t, !s.off, s.go);
    if (s.off) { const ox = s.offX, oy = trackY(T, ox); c.fillStyle = '#c8b8a0'; c.fillRect(ox - 24, oy + 4, 48, 8); SK.animal(c, 'turtle', ox, oy + 4, 0.8, { t, pose: 'sad', expr: 'sad' }); B8.cashBag(c, ox + 30, oy - 8, 0.45); }
    if (won) SK.animal(c, 'turtle', 300, 590, 0.9, { t, pose: 'cheer', expr: 'laugh' });
    // your hand on the bar
    if (s.go && s.ptr) { c.save(); c.globalAlpha = 0.35; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y - 30, GRIP * 0.5, 0, 7); c.stroke(); c.restore(); }
    if (!s.go && !s.off && !g.done) SK.glow(c, g, p.x, p.y - 30, 30);
    SK.demo(g, c, 'hold', [p.x + 6, p.y - 26], null, { delay: 0.8 });
  },
  auto(g, dt, synth) { // press the bar and follow the cart all the way
    const s = g.s; if (g.done) return; const p = this.pos(g, s.x);
    if (!s._b8 && g.t > 0.9) { s._b8 = 1; synth('down', p.x, p.y - 30); } else if (s._b8 === 1) synth('move', p.x, p.y - 30);
  },
});
