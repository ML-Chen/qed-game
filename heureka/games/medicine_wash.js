// WASH HANDS! (chem_bio FB-06) — two paws covered in glowing germs over a sink; the next rabbit waits behind the door.
// Mash (tap or rub) on the paws to scrub with soap: the first rub pumps soap, every rub makes lather and the song bar
// fills; germs come loose into the bubbles. When the song is done the tap runs, the loose germs swirl down the drain and
// the door handle stays clean for the next rabbit. Run out of time and it is a quick splash without enough scrubbing:
// most germs stay put, hop onto the door handle and wave. Level 2: germs hide under the nails and need scrubbing there.
const PAWS = [{ x: 132, y: 432, a: 0.5 }, { x: 228, y: 432, a: -0.5 }];
const HANDLE = [318, 300], DRAIN = [180, 548], SPOUT = [180, 338], NEED = [13, 16, 18];
const inPaws = (x, y) => y > 340 && y < 540 && x > 70 && x < 290;

function paintBath(o) {
  // tiled wall
  o.fillStyle = '#d8f0ea'; o.fillRect(0, 0, 360, 640);
  for (let y = 0; y < 400; y += 40) for (let x = (y / 40) % 2 ? -20 : 0; x < 360; x += 40) { o.fillStyle = ((x + y) / 40) % 3 === 0 ? '#c6e8e0' : '#e2f6f0'; o.fillRect(x + 1.5, y + 1.5, 37, 37); }
  o.fillStyle = 'rgba(255,255,255,0.35)'; o.fillRect(0, 0, 360, 60);
  // a little window of light and a shelf with a plant
  o.fillStyle = '#fff6d8'; o.beginPath(); o.roundRect(110, 214, 70, 74, 30); o.fill(); o.strokeStyle = '#b8d8d0'; o.lineWidth = 5; o.stroke();
  o.strokeStyle = '#d8ecd8'; o.lineWidth = 3; o.beginPath(); o.moveTo(145, 214); o.lineTo(145, 288); o.moveTo(110, 251); o.lineTo(180, 251); o.stroke();
  // the door on the right, ajar
  o.fillStyle = '#e8a870'; o.fillRect(292, 130, 80, 300); o.fillStyle = '#d08a52'; o.fillRect(292, 130, 8, 300);
  o.strokeStyle = '#b8743e'; o.lineWidth = 2; o.strokeRect(306, 150, 46, 110); o.strokeRect(306, 280, 46, 130);
  // counter and basin
  const ct = o.createLinearGradient(0, 380, 0, 640); ct.addColorStop(0, '#f6efe4'); ct.addColorStop(1, '#d8cdbc');
  o.fillStyle = ct; o.fillRect(0, 380, 360, 260); o.fillStyle = '#c8b8a0'; o.fillRect(0, 380, 360, 6);
  const bs = o.createRadialGradient(180, 500, 20, 180, 520, 150); bs.addColorStop(0, '#e6f2f6'); bs.addColorStop(0.7, '#ffffff'); bs.addColorStop(1, '#c8d8e0');
  o.fillStyle = '#b8c8d0'; o.beginPath(); o.ellipse(180, 512, 150, 78, 0, 0, 7); o.fill();
  o.fillStyle = bs; o.beginPath(); o.ellipse(180, 508, 142, 70, 0, 0, 7); o.fill();
  o.fillStyle = '#8a9aa8'; o.beginPath(); o.ellipse(DRAIN[0], DRAIN[1], 16, 7, 0, 0, 7); o.fill(); o.strokeStyle = '#5a6a78'; o.lineWidth = 2; for (let i = -1; i <= 1; i++) { o.beginPath(); o.moveTo(DRAIN[0] - 9, DRAIN[1] + i * 3); o.lineTo(DRAIN[0] + 9, DRAIN[1] + i * 3); o.stroke(); }
  // the tap
  o.fillStyle = '#b8c4cc'; o.strokeStyle = '#6a7884'; o.lineWidth = 2.5;
  o.beginPath(); o.roundRect(166, 384, 28, 18, 5); o.fill(); o.stroke();
  o.lineWidth = 14; o.strokeStyle = '#6a7884'; o.lineCap = 'round'; o.beginPath(); o.moveTo(180, 390); o.lineTo(180, 324); o.quadraticCurveTo(180, 304, 160, 304); o.lineTo(150, 304); o.stroke();
  o.lineWidth = 9; o.strokeStyle = '#d8e2e8'; o.beginPath(); o.moveTo(180, 390); o.lineTo(180, 324); o.quadraticCurveTo(180, 304, 160, 304); o.lineTo(150, 304); o.stroke();
  // soap pump bottle on the counter
  o.fillStyle = '#ff9ab8'; o.strokeStyle = '#b04a72'; o.lineWidth = 2.5; o.beginPath(); o.roundRect(28, 330, 44, 66, 12); o.fill(); o.stroke();
  o.fillStyle = 'rgba(255,255,255,0.45)'; o.beginPath(); o.roundRect(34, 338, 9, 46, 5); o.fill();
  o.fillStyle = '#f4f4f8'; o.fillRect(44, 312, 12, 18); o.strokeRect(44, 312, 12, 18); o.beginPath(); o.roundRect(42, 306, 34, 8, 3); o.fill(); o.stroke();
  P.vignette(o, 360, 640, 0.22, '#2a4a48');
}

function paw(c, x, y, a, rub, clean) {
  // an arm reaching in from the side and a cartoon paw with four stubby fingers
  c.save(); c.translate(x, y); c.rotate(a + rub * 0.08);
  const fur = clean ? '#fffaf4' : '#f4ece2', ink = '#8a6a6a';
  c.fillStyle = fur; c.strokeStyle = ink; c.lineWidth = 2.5;
  c.beginPath(); c.roundRect(-26, 20, 52, 200, 24); c.fill(); c.stroke(); // forearm
  for (let i = 0; i < 4; i++) { const fx = -21 + i * 14; c.beginPath(); c.roundRect(fx - 7, -62 + Math.abs(i - 1.5) * 6, 14, 40, 7); c.fill(); c.stroke(); }
  c.beginPath(); c.ellipse(0, 0, 34, 40, 0, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(a > 0 ? 30 : -30, 4, 9, 18, a > 0 ? -0.5 : 0.5, 0, 7); c.fill(); c.stroke(); // thumb
  c.fillStyle = '#f7b4c4'; c.beginPath(); c.ellipse(0, 6, 15, 12, 0, 0, 7); c.fill();
  for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-21 + i * 14, -48 + Math.abs(i - 1.5) * 6, 4.5, 0, 7); c.fill(); }
  c.restore();
}
// a germ blob with a little face; k is how far it has come loose (0 stuck .. 1 floating in a bubble)
function germ(c, x, y, r, col, t, ph, mood) {
  c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(x, y, 1, x, y, r * 2.2); gl.addColorStop(0, P.rgba(col, 0.5)); gl.addColorStop(1, P.rgba(col, 0)); c.fillStyle = gl; c.beginPath(); c.arc(x, y, r * 2.2, 0, 7); c.fill(); c.restore();
  c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 1.5; c.beginPath();
  for (let i = 0; i <= 10; i++) { const a = i / 10 * 6.283, rr = r * (1 + 0.16 * Math.sin(a * 5 + t * 6 + ph)); i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#1a2a1a'; c.beginPath(); c.arc(x - r * 0.35, y - r * 0.15, r * 0.18, 0, 7); c.arc(x + r * 0.35, y - r * 0.15, r * 0.18, 0, 7); c.fill();
  c.strokeStyle = '#1a2a1a'; c.lineWidth = 1.4; c.beginPath(); if (mood === 'sad') c.arc(x, y + r * 0.5, r * 0.3, Math.PI + 0.4, -0.4); else c.arc(x, y + r * 0.15, r * 0.32, 0.3, Math.PI - 0.3); c.stroke();
}

function scrub(g, x, y) {
  const s = g.s;
  if (s.soap < 0) { s.soap = g.t; g.sfx('slurp'); }
  s.scrubs++; s.rub = 1; g.sfx(s.scrubs % 2 ? 'sweep' : 'rustle'); if (s.scrubs % 3 === 0) g.sfx('bubble');
  for (let i = 0; i < 3; i++) s.lather.push({ x: x + (g.rand() - 0.5) * 70, y: y + (g.rand() - 0.5) * 50, r: 5 + g.rand() * 9, vy: -10 - g.rand() * 20, life: 0 });
  if (s.lather.length > 60) s.lather.splice(0, s.lather.length - 60);
  for (const gm of s.germs) if (gm.nail) { const p = gpos(gm, 0); if (SK.dist(x, y, p[0], p[1]) < 46) gm.hits++; }
}
function gpos(gm, rub) { const P0 = PAWS[gm.pw], a = P0.a, ca = Math.cos(a), sa = Math.sin(a); return [P0.x + gm.dx * ca - gm.dy * sa + rub * (gm.pw ? -6 : 6), P0.y + gm.dx * sa + gm.dy * ca]; }
MG.add({
  id: 'medicine_wash', stage: 'medicine', cmd: 'SCRUB THE GERMS OFF WITH SOAP!', time: 5, mood: 'party', winText: 'Clean hands!', failText: 'Still germy!',
  card: { title: 'Soap lifts germs off', kind: 'Medicine', ref: 'Handwashing with soap',
    text: 'Germs stick to the oily layer on your skin, so a splash of water alone leaves most of them behind. Soap breaks up that oil. Rubbing your hands together with soap lifts the germs into the lather, and rinsing washes them down the drain.\n\nHealth agencies advise scrubbing for at least 20 seconds, about two rounds of "Happy Birthday", including between the fingers and under the nails. Clean hands stop germs from riding onto door handles and food, and on to the next person. This also stops germs that resist antibiotics from spreading.',
    note: 'Scrubbing with soap for at least 20 seconds lifts germs off your hands, so they cannot pass to the next person.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.need = NEED[L]; s.scrubs = 0; s.rub = 0; s.soap = -1; s.rinse = -1; s.hop = -1; s.lather = []; s.lastX = null;
    s.germs = [];
    const n = 14;
    for (let i = 0; i < n; i++) { const pw = i % 2, P0 = PAWS[pw], a = g.rand() * 6.28, d = 8 + g.rand() * 26; s.germs.push({ pw, dx: Math.cos(a) * d, dy: Math.sin(a) * d * 1.1 - 4, r: 6 + g.rand() * 3.5, th: 0.12 + g.rand() * 0.8, ph: g.rand() * 6, col: g.rand() < 0.5 ? '#7ef06a' : '#c6f04a', loose: 0, nail: false }); }
    if (L >= 2) for (let i = 0; i < 4; i++) { const pw = i % 2; s.germs.push({ pw, dx: -21 + (i < 2 ? 14 : 28) * 1 + (i % 2 ? 0 : 0), dy: -52, r: 6, th: 2, ph: g.rand() * 6, col: '#d07aff', loose: 0, nail: true, hits: 0 }); }
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.rinse >= 0) return; if (inPaws(x, y)) { s.lastX = x; s.lastY = y; scrub(g, x, y); } },
  move(g, x, y) { const s = g.s; if (s.lastX == null || g.done || s.rinse >= 0) return; if (SK.dist(x, y, s.lastX, s.lastY) > 46 && inPaws(x, y)) { s.lastX = x; s.lastY = y; scrub(g, x, y); } },
  up(g) { g.s.lastX = null; },
  update(g, dt) {
    const s = g.s, p = Math.min(1, s.scrubs / s.need);
    if (g.result === 'fail' && s.hop < 0) { s.hop = g.t; g.sfx('splash'); }
    s.rub = Math.max(0, s.rub - dt * 5);
    for (const gm of s.germs) { const go = gm.nail ? gm.hits >= 3 : p >= gm.th; if (go) gm.loose = Math.min(1, gm.loose + dt * 4); }
    for (const b of s.lather) { b.life += dt; b.y += b.vy * dt * 0.3; }
    const allLoose = s.germs.every(gm => gm.loose >= 1);
    if (s.rinse < 0 && p >= 1 && allLoose && !g.done) { s.rinse = g.t; g.sfx('splash'); g.sfx('rain'); }
    if (s.rinse >= 0 && !g.done && g.t - s.rinse > 0.7) { g.win(); g.sfx('cheer'); g.sfx('sparkle'); g.burst(180, 430, ['#ffffff', '#bff0ff', '#fff6a0'], 24, 200); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, p = Math.min(1, s.scrubs / s.need), won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('medicine_wash_bath', paintBath), 0, 0, 360, 640);
    // the next rabbit, peeking round the door
    const peek = won ? 1 : 0.6 + 0.1 * Math.sin(t * 2);
    SK.animal(c, 'rabbit', 338 - peek * 14, 436, 0.85, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    c.fillStyle = '#e8a870'; c.fillRect(352, 130, 8, 310);
    // the door handle
    SK.ball(c, HANDLE[0], HANDLE[1], 11, won ? '#ffe070' : '#d8b04a');
    if (won) { c.strokeStyle = '#fff6c0'; c.lineWidth = 2.5; for (let i = 0; i < 4; i++) { const a = t * 3 + i * 1.57; c.beginPath(); c.moveTo(HANDLE[0] + Math.cos(a) * 16, HANDLE[1] + Math.sin(a) * 16); c.lineTo(HANDLE[0] + Math.cos(a) * 24, HANDLE[1] + Math.sin(a) * 24); c.stroke(); } }
    // soap dollop from the pump
    if (s.soap >= 0 && t - s.soap < 0.5) { const k = (t - s.soap) / 0.5; c.fillStyle = '#ffc0d8'; c.beginPath(); c.arc(SK.lerp(70, 160, k), SK.lerp(310, 410, k) - Math.sin(k * Math.PI) * 60, 8, 0, 7); c.fill(); }
    // water from the tap while rinsing (or the quick splash on a fail)
    const wet = s.rinse >= 0 || lost;
    if (wet) { const w0 = s.rinse >= 0 ? s.rinse : s.hop; const k = Math.min(1, (t - w0) * 4); c.fillStyle = 'rgba(150,210,255,0.75)'; c.beginPath(); c.roundRect(SPOUT[0] - 32 - 5, 306, 10, (DRAIN[1] - 306) * k, 5); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { const yy = 310 + ((t * 300 + i * 60) % (DRAIN[1] - 310)) * k; c.beginPath(); c.moveTo(SPOUT[0] - 34, yy); c.lineTo(SPOUT[0] - 34, yy + 14); c.stroke(); } }
    // the paws, rubbing together as you scrub
    const rub = Math.sin(t * 30) * s.rub;
    for (const [i, P0] of PAWS.entries()) paw(c, P0.x + (i ? -1 : 1) * rub * 6, P0.y + (i ? 1 : -1) * rub * 4, P0.a, rub, won);
    // lather: white foam over the paws, thicker as the song goes on
    const foam = s.soap >= 0 ? Math.min(1, s.scrubs / 4) : 0;
    if (foam > 0 && !won) { c.fillStyle = `rgba(255,255,255,${0.35 * foam})`; for (const P0 of PAWS) { c.beginPath(); c.ellipse(P0.x, P0.y - 8, 44 * foam, 50 * foam, 0, 0, 7); c.fill(); } }
    for (const b of s.lather) { const a = Math.max(0, 1 - b.life / 1.6) * (s.rinse >= 0 ? Math.max(0, 1 - (t - s.rinse) * 3) : 1); if (a <= 0) continue; c.fillStyle = `rgba(255,255,255,${0.75 * a})`; c.strokeStyle = `rgba(180,210,240,${a})`; c.lineWidth = 1.2; c.beginPath(); c.arc(b.x, b.y, b.r, 0, 7); c.fill(); c.stroke(); c.fillStyle = `rgba(255,255,255,${a})`; c.beginPath(); c.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, 7); c.fill(); }
    // germs: stuck ones grin; loose ones float in a bubble, then swirl down the drain on the rinse; on a fail the stuck ones hop to the handle
    for (const [i, gm] of s.germs.entries()) {
      let [x, y] = gpos(gm, rub), mood = 'happy';
      if (gm.loose > 0) { y -= gm.loose * 10 + Math.sin(t * 3 + gm.ph) * 3 * gm.loose; mood = 'sad'; }
      if (s.rinse >= 0 && gm.loose >= 1) { const k = Math.min(1, (t - s.rinse) / 0.9), a = gm.ph + k * 9, rr = (1 - k) * 60 + 4; x = SK.lerp(x, DRAIN[0] + Math.cos(a) * rr, SK.easeInOut(k)); y = SK.lerp(y, DRAIN[1] + Math.sin(a) * rr * 0.35, SK.easeInOut(k)); if (k >= 1) continue; }
      if (lost && gm.loose < 1) { const k = Math.min(1, (t - s.hop - i * 0.03) / 0.6); if (k > 0) { const hx = HANDLE[0] - 20 + (i % 4) * 9, hy = HANDLE[1] - 8 - Math.floor(i / 4) % 3 * 9; x = SK.lerp(x, hx, k); y = SK.lerp(y, hy, k) - Math.sin(k * Math.PI) * 70; } }
      germ(c, x, y, gm.r * (gm.loose > 0 && s.rinse >= 0 ? 0.9 : 1), gm.col, t, gm.ph, mood);
      if (gm.loose > 0.3 && s.rinse < 0) { c.strokeStyle = `rgba(200,230,255,${0.8 * gm.loose})`; c.fillStyle = `rgba(255,255,255,${0.25 * gm.loose})`; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, gm.r * 1.8, 0, 7); c.fill(); c.stroke(); }
      if (lost && gm.loose < 1 && t - s.hop > 0.7 && i % 3 === 0) { c.strokeStyle = gm.col; c.lineWidth = 2; c.beginPath(); c.moveTo(x + gm.r, y); c.lineTo(x + gm.r + 6, y - 8 + Math.sin(t * 12 + i) * 4); c.stroke(); } // waving
    }
    // the song bar: notes fill it as you scrub
    const bx = 70, bw = 220, by = 174;
    c.fillStyle = 'rgba(30,40,60,0.55)'; c.beginPath(); c.roundRect(bx - 4, by - 15, bw + 8, 30, 15); c.fill();
    const fg = c.createLinearGradient(bx, 0, bx + bw, 0); fg.addColorStop(0, '#7ae0ff'); fg.addColorStop(1, '#b07aff');
    c.fillStyle = fg; c.beginPath(); c.roundRect(bx, by - 11, Math.max(22, bw * p), 22, 11); c.fill();
    c.fillStyle = '#fff6ea'; c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5;
    for (let i = 0; i < 6; i++) { const nx = bx + 22 + i * 36, on = p * bw > nx - bx, ny = by + (i % 2 ? -1 : 2) + (on ? Math.sin(t * 8 + i) * 2 : 0); c.globalAlpha = on ? 1 : 0.35; c.beginPath(); c.ellipse(nx, ny + 4, 4.5, 3.5, -0.4, 0, 7); c.fill(); c.beginPath(); c.moveTo(nx + 4, ny + 3); c.lineTo(nx + 4, ny - 10); c.stroke(); } c.globalAlpha = 1;
    // the duck host, bottom left
    SK.animal(c, 'duck', 40, 618, 0.62, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // guidance
    if (!s.touched && !g.done) SK.glow(c, g, 180, 420, 70);
    const nail = s.germs.find(gm => gm.nail && gm.hits < 3);
    if (nail && g.level <= 1) for (const gm of s.germs) if (gm.nail && gm.hits < 3) { const q = gpos(gm, 0); SK.glow(c, g, q[0], q[1], 18); }
    SK.tag(c, 'Soap', 50, 290, 18); if (!g.done && s.rinse < 0) SK.tag(c, 'Germs', 180, 330, 18);
    if (s.rinse < 0) { if (nail && s.scrubs > 4) { const q = gpos(nail, 0); SK.demo(g, c, 'tap', [q[0], q[1] + 6], null, { period: 0.5 }); } else SK.demo(g, c, 'drag', [130, 440], [230, 440], { period: 0.7 }); }
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.rinse >= 0 || g.t < 0.5) return;
    s.botK = (s.botK || 0) + dt; if (s.botK < 0.16) return; s.botK = 0; s.botI = (s.botI || 0) + 1;
    const nail = s.germs.find(gm => gm.nail && gm.hits < 3);
    if (nail) { const q = gpos(nail, 0); synth('down', q[0], q[1] + 8); synth('up', q[0], q[1] + 8); }
    else { const x = s.botI % 2 ? 150 : 210; synth('down', x, 440); synth('up', x, 440); }
  },
});
