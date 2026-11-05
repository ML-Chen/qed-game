// OVERFLOW! (earth EE ES-02) — a brimming tank of sea: ice sits on a rocky island (land ice) and floats in the water
// (icebergs). Drag the heat lamp over the ice to melt it, and make the sea spill over the rim into the duck's pool.
// Melting land ice pours new water into the sea and the level rises; melting floating ice changes nothing, because a
// floating cube already pushes aside exactly its own weight of water (the duck keeps waiting for its splash).
// Level 2: four blocks of land ice on two islands, and bigger icebergs in the way.
const OV_L = 40, OV_R = 320, OV_RIM = 300, OV_BOT = 566, OV_W0 = 354;
const OV_LV = [
  { land: [[86, 292], [124, 292], [162, 292]], ice: [[234, 0], [286, 0]], big: 1.25, rocks: [[52, 192, 292]] },
  { land: [[86, 292], [124, 292], [162, 292]], ice: [[230, 0], [286, 0]], big: 1.3, rocks: [[52, 192, 292]] },
  { land: [[80, 292], [118, 292], [240, 292], [278, 292]], ice: [[180, 0]], big: 1.35, rocks: [[50, 150, 292], [208, 310, 292]] },
];
const OV_S = 38; // a land ice block's side
function ovPaint(o, L) {
  B5.vgrad(o, 0, 0, 360, 640, ['#a8d8f0', '#d8eef8', '#fff4e4']);
  P.cloud(o, 90, 190, 0.6); P.cloud(o, 270, 160, 0.45);
  // the table and the duck's pool by the tank
  B5.vgrad(o, 0, OV_BOT, 360, 80, ['#d8b890', '#c09a70', '#a88058']);
  o.fillStyle = '#5ab0d8'; o.strokeStyle = '#2a6a98'; o.lineWidth = 2.5; o.beginPath(); o.ellipse(342, 600, 40, 14, 0, 0, 7); o.fill(); o.stroke();
  // the tank's back wall
  o.fillStyle = 'rgba(210,240,255,0.35)'; o.fillRect(OV_L, OV_RIM, OV_R - OV_L, OV_BOT - OV_RIM);
  // the rocky islands
  for (const [x0, x1, top] of L.rocks) { o.beginPath(); o.moveTo(x0, OV_BOT); o.lineTo(x0 + 6, top + 22); o.quadraticCurveTo(x0 + 10, top, x0 + 30, top); o.lineTo(x1 - 26, top); o.quadraticCurveTo(x1 - 8, top + 2, x1 - 4, top + 26); o.lineTo(x1, OV_BOT); o.closePath();
    const gr = o.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, '#a89888'); gr.addColorStop(1, '#6a5a50'); o.fillStyle = gr; o.fill(); o.strokeStyle = '#3a2a2a'; o.lineWidth = 2; o.stroke();
    o.fillStyle = '#7ab450'; o.beginPath(); o.ellipse((x0 + x1) / 2, top + 2, (x1 - x0) / 2 - 10, 4, 0, 0, 7); o.fill(); }
}
function ovCube(c, x, y, s, a = 1) { // an ice cube, centre (x, y), side s
  c.save(); c.globalAlpha *= a; const gr = c.createLinearGradient(x - s / 2, y - s / 2, x + s / 2, y + s / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#a8dcf4');
  c.fillStyle = gr; c.strokeStyle = '#5aa0c8'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s, s * 0.18); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.roundRect(x - s * 0.32, y - s * 0.34, s * 0.3, s * 0.12, 2); c.fill(); c.restore();
}
MG.add({
  id: 'overflow', stage: 'earth', cmd: 'OVERFLOW!', time: 6, mood: 'sea', winText: 'Land ice!', failText: 'Still waiting!',
  card: { title: 'Which melting ice raises the sea', kind: 'Earth science', ref: 'Sea-level rise and floating ice',
    text: 'Ice that sits on land, like the great ice sheets of Greenland and Antarctica, is not in the sea yet. When it melts, its water runs into the sea and the sea level rises.\n\nIce that already floats is different. A floating iceberg pushes aside its own weight of water. When it melts, its water fills exactly the space it was pushing aside, so the level stays almost the same.\n\nThat is why scientists watch the land ice most closely.',
    note: 'Melting land ice raises the sea. Melting ice that already floats barely changes it.' },
  init(g) {
    const s = g.s, L = OV_LV[Math.min(2, g.level)]; s.L = L; s.level = 0; s.heat = null; s.spillT = 0;
    s.cubes = [...L.land.map(([x, y]) => ({ x, y, v: 1, land: true })), ...L.ice.map(([x]) => ({ x, y: 0, v: 1, land: false }))];
    s.per = 1.04 / L.land.length; // each land cube's water raises the sea this fraction of the way to the rim
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.heat = [x, y]; g.sfx('fire'); },
  move(g, x, y) { const s = g.s; if (s.heat) s.heat = [x, y]; },
  up(g) { g.s.heat = null; },
  update(g, dt) {
    const s = g.s, L = s.L, wy = OV_W0 - s.level * (OV_W0 - OV_RIM);
    for (const q of s.cubes) if (!q.land) q.y = wy; // icebergs ride on the water
    if (g.done) return;
    if (s.heat) for (const q of s.cubes) { if (q.v <= 0) continue; const side = OV_S * (q.land ? 1 : L.big) * Math.cbrt(q.v), cy = q.land ? q.y - side / 2 : q.y - side * 0.05;
      if (SK.dist(s.heat[0], s.heat[1], q.x, cy) < 32) { const dv = Math.min(q.v, dt / 0.8); q.v -= dv; if (q.land) s.level += dv * s.per; if (q.v <= 0) { g.sfx(q.land ? 'splash' : 'drip'); if (!q.land) g.sfx('wrong'); } else if (g.rand() < 0.1) g.sfx('drip'); } }
    if (s.level >= 1 && !s.spillT) { s.spillT = g.t; g.win(); g.sfx('splash'); g.sfx('quack'); g.sfx('cheer'); g.burst(OV_R + 8, OV_RIM, ['#bfe8ff', '#ffffff', '#5ab0d8'], 18, 160); }
  },
  draw(g, c) {
    const s = g.s, L = s.L, t = g.t, lv = Math.min(1, s.level), wy = OV_W0 - lv * (OV_W0 - OV_RIM) + (s.spillT ? 0 : Math.sin(t * 3) * 0.8);
    c.drawImage(g.bake('overflow_bg' + Math.min(2, g.level), o => ovPaint(o, L)), 0, 0, 360, 640);
    // the starting level, marked on the glass so you can see whether it moves
    c.strokeStyle = '#e8403a'; c.lineWidth = 3; c.beginPath(); c.moveTo(OV_R - 2, OV_W0); c.lineTo(OV_R + 12, OV_W0); c.moveTo(OV_L + 2, OV_W0); c.lineTo(OV_L - 12, OV_W0); c.stroke();
    // land ice, with meltwater trickling off the island while it melts
    for (const q of s.cubes) if (q.land && q.v > 0) { const sd = OV_S * Math.cbrt(q.v); ovCube(c, q.x, q.y - sd / 2, sd); }
    if (s.heat) for (const q of s.cubes) if (q.land && q.v > 0 && SK.dist(s.heat[0], s.heat[1], q.x, q.y - OV_S / 2) < 32) {
      const rk = L.rocks.find(r => q.x > r[0] && q.x < r[1]), ex = q.x < (rk[0] + rk[1]) / 2 ? rk[0] + 4 : rk[1] - 4;
      c.strokeStyle = 'rgba(120,200,240,0.85)'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(q.x, q.y); c.quadraticCurveTo(ex, q.y + 2, ex, wy); c.stroke();
      for (let i = 0; i < 3; i++) { const k = (t * 3 + i / 3) % 1; c.fillStyle = '#8ad0f4'; c.beginPath(); c.arc(SK.lerp(q.x, ex, Math.min(1, k * 2)), q.y + k * (wy - q.y), 3.5, 0, 7); c.fill(); } }
    // fish in the sea
    for (let i = 0; i < 3; i++) { const fx = OV_L + 20 + ((t * (18 + i * 6) + i * 90) % (OV_R - OV_L - 40)), fy = 440 + i * 36; c.fillStyle = ['#ff8a5a', '#ffd45a', '#ff6a8a'][i]; c.beginPath(); c.ellipse(fx, fy, 10, 6, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(fx - 8, fy); c.lineTo(fx - 16, fy - 6); c.lineTo(fx - 16, fy + 6); c.fill(); }
    // icebergs: about nine tenths of each sits under the water
    for (const q of s.cubes) if (!q.land && q.v > 0) { const sd = OV_S * L.big * Math.cbrt(q.v), cy = q.y + sd * 0.4; ovCube(c, q.x, cy, sd); }
    // the water
    c.save(); c.beginPath(); c.rect(OV_L, wy, OV_R - OV_L, OV_BOT - wy); c.clip();
    B5.vgrad(c, OV_L, wy, OV_R - OV_L, OV_BOT - wy, ['rgba(90,180,230,0.72)', 'rgba(40,110,180,0.82)']);
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(OV_L, wy); c.lineTo(OV_R, wy); c.stroke();
    // the glass walls
    c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(OV_L, OV_RIM - 4); c.lineTo(OV_L, OV_BOT); c.lineTo(OV_R, OV_BOT); c.lineTo(OV_R, OV_RIM - 4); c.stroke();
    c.strokeStyle = 'rgba(90,150,190,0.5)'; c.lineWidth = 1.5; c.stroke();
    // the spill into the duck's pool
    if (s.spillT) { const k = Math.min(1, (t - s.spillT) * 2); c.strokeStyle = 'rgba(90,180,230,0.85)'; c.lineWidth = 8; c.beginPath(); c.moveTo(OV_R, OV_RIM); c.quadraticCurveTo(OV_R + 18, OV_RIM + 10, OV_R + 20, OV_RIM + (596 - OV_RIM) * k); c.stroke(); }
    const won = g.result === 'win', lost = g.result === 'fail', floatGone = s.cubes.some(q => !q.land && q.v <= 0);
    SK.animal(c, 'duck', 342, 606, 0.6, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : floatGone ? 'think' : 'happy' });
    // the heat lamp: follows the finger and glows; parked at the top when not in use
    const [hx, hy] = s.heat || [300, 220];
    if (s.heat) { c.save(); c.globalCompositeOperation = 'lighter'; const hg = c.createRadialGradient(hx, hy, 4, hx, hy, 50); hg.addColorStop(0, 'rgba(255,170,80,0.55)'); hg.addColorStop(1, 'rgba(255,120,60,0)'); c.fillStyle = hg; c.beginPath(); c.arc(hx, hy, 50, 0, 7); c.fill(); c.restore(); }
    c.save(); c.translate(hx, hy - 50); c.scale(1.4, 1.4); c.fillStyle = '#e8563a'; c.strokeStyle = '#5a1a20'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-18, 8); c.lineTo(18, 8); c.lineTo(10, -12); c.lineTo(-10, -12); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = s.heat ? '#ffe27a' : '#f4e0b0'; c.beginPath(); c.ellipse(0, 9, 14, 5, 0, 0, 7); c.fill(); c.fillStyle = '#6a5a5a'; c.fillRect(-3, -26, 6, 14); c.restore();
    if (!s.heat && !g.done) { const q = s.cubes.find(q => q.land && q.v > 0); if (q) SK.glow(c, g, q.x, q.y - OV_S / 2, 26, '#ffe27a', { level: 2 }); }
    const q0 = s.cubes.find(q => q.land && q.v > 0); if (q0) SK.demo(g, c, 'hold', [q0.x, q0.y - OV_S / 2], null);
  },
  // the bot holds the lamp on each block of land ice in turn
  auto(g, dt, synth) {
    const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 0.9) return; const q = s.cubes.find(q => q.land && q.v > 0); if (!q) { if (B.on) { B.on = 0; synth('up', 0, 0); } return; }
    if (!B.on) { B.on = 1; synth('down', q.x, q.y - OV_S / 2); } else synth('move', q.x, q.y - OV_S / 2);
  },
});
