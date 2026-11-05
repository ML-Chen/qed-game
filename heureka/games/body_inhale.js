// BLOW OUT THE CANDLES! (chem_bio AN-17) — a rabbit with a window into its chest: two floppy lungs and the dome of the
// diaphragm under them, and a birthday cake. Pull the diaphragm down: the chest gets roomier, air streams in through the
// nose and the lungs fill. Let go and it springs back up: the chest shrinks and the air blows out at the candles. Air
// moves only while the diaphragm moves (in while it goes down, out while it goes up, none while it is held still).
// Each full breath blows out two candles; a half breath blows out one. Levels: 4, 6, 8 candles.
const EDGE = 472, REST = 378, LOW = 538, UP_FAIL = 330; // diaphragm: edge height, apex at rest, apex fully pulled, apex pushed too far up
const MOUTH = [180, 252];
const candleXY = (i, n) => [250 + i * (84 / (n - 1)), 266 + (i % 2) * 6];
const apexOf = cy => 0.5 * EDGE + 0.5 * cy; // the curve's midpoint for control y cy
const ctrlOf = ay => 2 * ay - EDGE;

function paintRoom(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#ffd2c4'); bg.addColorStop(0.6, '#ffe6cf'); bg.addColorStop(1, '#ffd8b0');
  o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(5);
  // polka-dot wallpaper and bunting
  for (let y = 20; y < 640; y += 44) for (let x = (y / 44) % 2 ? 22 : 0; x < 380; x += 44) { o.fillStyle = 'rgba(255,255,255,0.45)'; o.beginPath(); o.arc(x, y, 5, 0, 7); o.fill(); }
  o.strokeStyle = '#c86a5a'; o.lineWidth = 2; o.beginPath(); o.moveTo(0, 132); o.quadraticCurveTo(180, 170, 360, 132); o.stroke();
  for (let i = 0; i < 9; i++) { const x = 20 + i * 40, y = 136 + Math.sin(i / 8 * Math.PI) * 18; o.fillStyle = ['#ff7a8a', '#ffd25a', '#7ad0ff', '#9ae07a'][i % 4]; o.beginPath(); o.moveTo(x - 12, y); o.lineTo(x + 12, y); o.lineTo(x, y + 20); o.fill(); }
  o.fillStyle = '#e8b890'; o.fillRect(0, 590, 360, 50);
  for (let i = 0; i < 40; i++) { o.fillStyle = 'rgba(160,100,60,0.18)'; o.fillRect(rnd() * 360, 592 + rnd() * 46, 20 + rnd() * 30, 2); }
}

// the rabbit's body (painted live so the belly can bulge), with the chest window
function bunny(c, t, fill, ay, cheeks, won, lost) {
  const belly = SK.clamp((ay - REST) / (LOW - REST), -0.5, 1);
  // ears
  c.fillStyle = '#f6eee6'; c.strokeStyle = '#8a6a6a'; c.lineWidth = 3;
  for (const s of [-1, 1]) { c.save(); c.translate(180 + s * 26, 172); c.rotate(s * (0.28 + Math.sin(t * 2 + s) * 0.04) + (lost ? s * 0.5 : 0)); c.beginPath(); c.ellipse(0, -46, 15, 46, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#f7b4c4'; c.beginPath(); c.ellipse(0, -42, 7, 34, 0, 0, 7); c.fill(); c.fillStyle = '#f6eee6'; c.restore(); }
  // torso
  c.beginPath(); c.moveTo(108, 290); c.quadraticCurveTo(96, 420, 110 - belly * 14, 540); c.quadraticCurveTo(180, 612 + belly * 14, 250 + belly * 14, 540); c.quadraticCurveTo(264, 420, 252, 290); c.quadraticCurveTo(180, 262, 108, 290); c.closePath(); c.fill(); c.stroke();
  // head
  c.beginPath(); c.ellipse(180, 222, 64, 56, 0, 0, 7); c.fill(); c.stroke();
  // cheeks: puff out when the air is shoved out
  c.fillStyle = 'rgba(247,150,170,0.5)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(180 + s * (38 + cheeks * 10), 240, 12 + cheeks * 16, 8 + cheeks * 12, 0, 0, 7); c.fill(); }
  // eyes
  c.fillStyle = '#2a1424';
  for (const s of [-1, 1]) { if (won) { c.strokeStyle = '#2a1424'; c.lineWidth = 3; c.beginPath(); c.arc(180 + s * 24, 214, 7, Math.PI + 0.3, -0.3); c.stroke(); } else { c.beginPath(); c.ellipse(180 + s * 24, 212, 6, lost ? 8 : 7, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(180 + s * 24 - 2, 209, 2.2, 0, 7); c.fill(); c.fillStyle = '#2a1424'; } }
  // nose and mouth
  c.fillStyle = '#e8708a'; c.beginPath(); c.moveTo(172, 234); c.lineTo(188, 234); c.lineTo(180, 242); c.fill();
  c.strokeStyle = '#8a4a5a'; c.lineWidth = 2; c.beginPath();
  if (cheeks > 0.3) { c.ellipse(180, 252, 4, 3, 0, 0, 7); } else { c.moveTo(180, 242); c.lineTo(180, 248); c.moveTo(172, 250); c.quadraticCurveTo(180, 256, 188, 250); }
  c.stroke();
  // the chest window: a soft pink cavity
  c.save(); c.beginPath(); c.roundRect(118, 288, 124, 236, 40); c.clip();
  const cv = c.createLinearGradient(0, 288, 0, 524); cv.addColorStop(0, '#ffe2e0'); cv.addColorStop(1, '#f8c8c4'); c.fillStyle = cv; c.fillRect(110, 280, 140, 260);
  // windpipe
  c.strokeStyle = '#d88a9a'; c.lineWidth = 11; c.lineCap = 'round'; c.beginPath(); c.moveTo(180, 280); c.lineTo(180, 322); c.moveTo(180, 322); c.lineTo(156, 344); c.moveTo(180, 322); c.lineTo(204, 344); c.stroke();
  c.strokeStyle = '#f4c0c8'; c.lineWidth = 2; for (let y = 288; y < 322; y += 7) { c.beginPath(); c.moveTo(175, y); c.lineTo(185, y); c.stroke(); }
  // lungs
  const yb = 416 + (fill - 0.25) / 0.75 * 78;
  for (const s of [-1, 1]) {
    const w = 30 + 22 * fill, x = 180 + s * (12 + w), y0 = 338, wob = Math.sin(t * 3 + s) * (1 - fill) * 2;
    const lg = c.createRadialGradient(x - s * w * 0.3, y0 + 30, 4, x, (y0 + yb) / 2, yb - y0); lg.addColorStop(0, '#ffb0c0'); lg.addColorStop(1, '#e8607a');
    c.fillStyle = lg; c.strokeStyle = '#a83a5a'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(180 + s * 10, y0 + 6); c.quadraticCurveTo(x + s * w * 0.2, y0 - 22, x + s * (w + wob), y0 + (yb - y0) * 0.45); c.quadraticCurveTo(x + s * w * 1.05, yb, x + s * w * 0.2, yb); c.quadraticCurveTo(180 + s * 8, yb + 4, 180 + s * 8, y0 + (yb - y0) * 0.6); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.3)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(x + s * ((i % 3) * 9 - 8), y0 + 22 + i * (yb - y0 - 30) / 6, 3 + fill * 2.5, 0, 7); c.fill(); }
  }
  // ribs, faint over the lungs
  c.strokeStyle = 'rgba(255,250,240,0.4)'; c.lineWidth = 3; for (let i = 0; i < 4; i++) { const y = 312 + i * 34; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(180 + s * 8, y); c.quadraticCurveTo(180 + s * 70, y - 4 + fill * 4 * s * 0, 180 + s * 62, y + 26); c.stroke(); } }
  // the diaphragm (red muscle dome); below it, the belly
  const cy = ctrlOf(ay);
  c.fillStyle = '#f0d8b8'; c.beginPath(); c.moveTo(110, EDGE); c.quadraticCurveTo(180, cy, 250, EDGE); c.lineTo(250, 540); c.lineTo(110, 540); c.fill();
  c.strokeStyle = '#c0384a'; c.lineWidth = 9; c.beginPath(); c.moveTo(112, EDGE); c.quadraticCurveTo(180, cy, 248, EDGE); c.stroke();
  c.strokeStyle = '#ff8a8a'; c.lineWidth = 2; c.beginPath(); c.moveTo(118, EDGE - 3); c.quadraticCurveTo(180, cy - 3, 242, EDGE - 3); c.stroke();
  c.restore();
  c.strokeStyle = '#8a6a6a'; c.lineWidth = 3; c.beginPath(); c.roundRect(118, 288, 124, 236, 40); c.stroke();
  // paws resting on the belly
  c.fillStyle = '#f6eee6'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(180 + s * 82, 470, 16, 26, s * 0.3, 0, 7); c.fill(); c.stroke(); }
}

MG.add({
  id: 'body_inhale', stage: 'body', cmd: 'BLOW OUT THE CANDLES!', time: 8, mood: 'bright', winText: 'Deep breaths!', failText: 'Pfffft!',
  card: { title: 'Breathing in', kind: 'Biology', ref: 'The diaphragm and the lungs',
    text: 'Your lungs have no muscles of their own to pull in air. Under them sits the diaphragm, a dome-shaped sheet of muscle.\n\nWhen you breathe in, the diaphragm tightens and pulls down, and muscles between your ribs lift your chest outward. The space inside your chest gets bigger, so the air pressure in your lungs drops below the pressure of the air outside. Air rushes in through your nose and mouth to fill the space.\n\nWhen the diaphragm relaxes, it springs back up, the space shrinks, and air is pushed out.',
    note: 'Pulling the diaphragm down makes more room in your chest, so air flows into your lungs.' },
  init(g) {
    const s = g.s; s.v = SK.variant(g, 4); s.ay = apexOf(REST); s.ayRest = apexOf(REST); s.fill = 0.25; s.air = []; s.cheeks = 0; s.held = false; s.full = -1;
    s.candles = Array.from({ length: [4, 6, 8][Math.min(2, g.level)] }, () => ({ lit: 1 })); s.blow = 0; s.vol = 0; s.outThis = 0; s.pushed = -1; s.inAt = -9; s.outAt = -9;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (Math.abs(y - s.ay) < 70 && x > 90 && x < 270) { s.held = true; s.grabDy = s.ay - y; } },
  move(g, x, y) { const s = g.s; if (!s.held || g.done) return; s.ay = SK.clamp(y + s.grabDy, apexOf(UP_FAIL) - 10, apexOf(LOW)); },
  up(g) { g.s.held = false; },
  update(g, dt) {
    const s = g.s, rest = s.ayRest, lo = apexOf(LOW);
    if (!s.held && s.pushed < 0) { s.ay += (rest - s.ay) * Math.min(1, dt * 9); if (Math.abs(rest - s.ay) < 0.6) s.ay = rest; } // a relaxed diaphragm springs back up, quickly
    // the lungs follow the room in the chest exactly: air flows only while the chest is changing size (the owner: in
    // only while the diaphragm is lowering, out only while it rises, nothing while it is held still)
    const target = SK.clamp(0.25 + 0.75 * (s.ay - rest) / (lo - rest), 0, 1), flow = target - s.fill;
    s.fill = target;
    if (flow > 0.0005) s.inAt = g.t; else if (flow < -0.0005) s.outAt = g.t;
    const n = Math.abs(flow) < 0.0015 ? 0 : Math.floor(Math.abs(flow) * 120 + g.rand());
    for (let i = 0; i < n; i++) { const inward = flow > 0; s.air.push({ k: 0, inward, dx: (g.rand() - 0.5) * 30, side: g.rand() < 0.5 ? -1 : 1, sp: 3.6 + g.rand() }); }
    for (const a of s.air) a.k += dt * a.sp; s.air = s.air.filter(a => a.k < 1);
    // breathing out: the stream of air blows candles out (level 2)
    s.blow = Math.max(0, -flow / dt);
    // each breath out can blow out up to two candles, nearest first: a deep breath blows two, a shallow one fewer
    if (flow > 0.0005) { s.vol = 0; s.outThis = 0; } else if (flow < 0) s.vol += -flow;
    const want = (s.vol > 0.26 ? 1 : 0) + (s.vol > 0.58 ? 1 : 0);
    while (s.outThis < want) { const cd = s.candles.find(q => !q.out); if (!cd) break; cd.out = true; cd.outAt = g.t; s.outThis++; g.sfx('wind'); }
    for (const cd of s.candles) if (cd.out) cd.lit = Math.max(0, cd.lit - dt * 6);
    s.cheeks = Math.max(0, s.cheeks - dt * 1.5);
    if (g.done) return;
    // pushed up too far: the air is shoved out, cheeks puff
    if (s.ay < apexOf(UP_FAIL) + 4) { s.pushed = g.t; s.cheeks = 1; g.fail(); g.sfx('wind'); g.sfx('laugh'); return; }
    if (s.candles.length) { if (s.candles.every(cd => cd.out)) { g.win(); g.sfx('cheer'); g.burst(290, 250, ['#ffd25a', '#ff7a8a', '#7ad0ff'], 24, 200); } }
    else if (s.fill > 0.94) { g.win(); g.sfx('cheer'); g.sfx('wind'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('body_inhale_room', paintRoom), 0, 0, 360, 640);
    // the cake (level 2)
    if (s.candles.length) { const n = s.candles.length;
      const TH = [['#fff0f4', '#ff9ab8', '#c86a8a'], ['#f4e0c0', '#8a5a3a', '#6a4024'], ['#f0fff0', '#7ad08a', '#3a8a4a'], ['#f0f4ff', '#8aa8ff', '#4a5aa8']][s.v]; c.fillStyle = TH[0]; c.strokeStyle = TH[2]; c.lineWidth = 2.5; c.beginPath(); c.roundRect(240, 276, 100, 40, 8); c.fill(); c.stroke();
      c.fillStyle = TH[1]; c.beginPath(); c.roundRect(240, 276, 100, 12, 6); c.fill(); c.fillStyle = '#e8d0b0'; c.fillRect(230, 314, 120, 6);
      for (const [i, cd] of s.candles.entries()) { const [x, y] = candleXY(i, n); c.fillStyle = ['#7ad0ff', '#ffd25a', '#9ae07a', '#ff7a8a'][(i + s.v) % 4]; c.fillRect(x - 3, y - 4, 6, 280 - y + 4); if (cd.lit > 0.05) { const f = cd.lit, w = Math.sin(t * 20 + i) * 1.5 - s.blow * 6; c.fillStyle = '#ffb030'; c.beginPath(); c.ellipse(x + w, y - 12, 4.5 * f, 9 * f, w * 0.06, 0, 7); c.fill(); c.fillStyle = '#fff4a0'; c.beginPath(); c.ellipse(x + w, y - 10, 2.2 * f, 5 * f, 0, 0, 7); c.fill(); } else { c.strokeStyle = 'rgba(120,110,120,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - 6); c.quadraticCurveTo(x + 6, y - 18, x, y - 30 - (t % 1) * 6); c.stroke(); } }
    }
    bunny(c, t, s.fill, s.ay, s.cheeks, won, lost);
    // air: dots stream in through the nose, down the windpipe into the lungs (or back out)
    for (const a of s.air) {
      const k = a.inward ? a.k : 1 - a.k; let x, y;
      if (k < 0.3) { const q = k / 0.3; const ang = a.dx * 0.2 + (a.side > 0 ? 0 : Math.PI); x = SK.lerp(180 + Math.cos(ang) * 70, 180, q); y = SK.lerp(250 + Math.sin(ang) * 40, 240, q); if (!a.inward && s.candles.length) { x = SK.lerp(330, 186, q); y = SK.lerp(262 + a.dx * 0.5, 250, q); } }
      else if (k < 0.55) { const q = (k - 0.3) / 0.25; x = 180; y = SK.lerp(244, 322, q); }
      else { const q = (k - 0.55) / 0.45; x = 180 + a.side * SK.lerp(0, 40 + a.dx * 0.6, q); y = SK.lerp(322, 400 + a.dx, q); }
      c.fillStyle = a.inward ? 'rgba(120,200,255,0.85)' : 'rgba(200,220,255,0.75)'; c.beginPath(); c.arc(x, y, 3.2, 0, 7); c.fill();
    }
    if (s.cheeks > 0.2) { c.strokeStyle = `rgba(200,220,255,${s.cheeks})`; c.lineWidth = 3; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(180, 262 + i * 4, 20 + (1 - s.cheeks) * 60 + i * 10, 0.3, Math.PI - 0.3); c.stroke(); } }
    // the grip on the diaphragm
    if (!g.done) { c.fillStyle = 'rgba(255,255,255,0.85)'; c.strokeStyle = '#c0384a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(156, s.ay - 9, 48, 18, 9); c.fill(); c.stroke(); const bob = Math.sin(t * 5) * 3; c.fillStyle = '#c0384a'; c.beginPath(); c.moveTo(170, s.ay + 16 + bob); c.lineTo(190, s.ay + 16 + bob); c.lineTo(180, s.ay + 28 + bob); c.closePath(); c.fill(); }
    c.strokeStyle = 'rgba(58,22,64,0.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(108, 382); c.lineTo(132, 382); c.moveTo(118, EDGE); c.lineTo(132, EDGE - 4); c.stroke();
    SK.tag(c, 'Lungs', 60, 382, 18); SK.tag(c, 'Diaphragm', 62, EDGE, 18);
    // what the air is doing right now: in while the diaphragm goes down, out while it goes up, nothing while it is still
    if (!g.done || won) { if (t - s.inAt < 0.12) SK.tag(c, 'Breathing in', 72, 300, 18, '#bfe6ff'); else if (t - s.outAt < 0.12) SK.tag(c, 'Breathing out', 72, 300, 18, '#ffe2a0'); }
    if (s.candles.length && !won) { const left = s.candles.filter(cd => !cd.out).length; SK.tag(c, left + ' lit', 290, 342, 18); }
    if (!g.done) {
      if (s.held && s.fill > 0.9) { // full: now let go, and the diaphragm springs up
        const bob = Math.sin(t * 6) * 4; c.save(); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.translate(228, s.ay - 30 - bob); c.beginPath(); c.moveTo(0, -16); c.lineTo(12, 0); c.lineTo(5, 0); c.lineTo(5, 16); c.lineTo(-5, 16); c.lineTo(-5, 0); c.lineTo(-12, 0); c.closePath(); c.fill(); c.stroke(); c.restore();
        SK.tag(c, 'Let go', 290, s.ay - 30, 18);
      } else if (!s.held && s.fill < 0.85) { SK.target(c, g, 180, apexOf(LOW) + 6, 0, { w: 70, h: 26, col: '#e0405a' }); SK.arrow(c, g, 180, s.ay, 180, apexOf(LOW), { from: 34, to: 18 }); SK.grab(c, g, 180, s.ay, 28); }
    }
    SK.demo(g, c, 'drag', [180, s.ay], [180, apexOf(LOW)]);
  },
  // the bot: pull down and hold until the lungs are full; at level 2 then let go to blow
  auto(g, dt, synth) {
    const s = g.s; if (g.done) return; const B = s._b = s._b || { ph: 0 };
    if (B.ph === 0 && g.t > 0.8) { synth('down', 180, s.ay); B.y = s.ay; B.ph = 1; }
    else if (B.ph === 1) { B.y = Math.min(apexOf(LOW), B.y + dt * 260); synth('move', 180, B.y); if (s.candles.length && s.fill > 0.93) { B.ph = 2; synth('up', 180, B.y); } }
    else if (B.ph === 2 && s.candles.length && s.fill < 0.3 && s.candles.some(cd => !cd.out)) { B.ph = 0; }
  },
});
