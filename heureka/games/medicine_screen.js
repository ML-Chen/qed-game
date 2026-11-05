// SCREEN! (chem_bio MED-07) — a crowd of 100 animals at a meadow fair; one of them is sick. Rub the test scanner over the
// whole crowd. The sick animal lights up, and so do a handful of healthy ones, by mistake. Once everyone is scanned,
// the clinic treats every animal that lit up: the sick one perks up and the healthy ones grumble about medicine they
// didn't need, so most of the lit-up animals were false alarms. Run out of time with animals unscanned and the sick
// one (still unscanned) sneezes on its neighbours. Level 2: a common illness, and most of the lit-up animals are sick.
const COLS = 10, ROWS = 10, X0 = 30, DX = 33.3, Y0 = 176, DY = 38, SR = 50;
const KINDS = ['rabbit', 'duck', 'frog', 'penguin', 'hedgehog', 'fox', 'beaver', 'owl', 'turtle', 'bird'];

function paintFair(o) {
  const sky = o.createLinearGradient(0, 0, 0, 200); sky.addColorStop(0, '#9ad8f0'); sky.addColorStop(1, '#e8f6e0');
  o.fillStyle = sky; o.fillRect(0, 0, 360, 200);
  P.cloud(o, 70, 60, 0.6); P.cloud(o, 290, 44, 0.5);
  // a clinic tent on the hill and bunting
  o.fillStyle = '#8ac860'; o.beginPath(); o.moveTo(0, 150); o.quadraticCurveTo(180, 118, 360, 150); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  const gr = o.createLinearGradient(0, 140, 0, 640); gr.addColorStop(0, '#a8d878'); gr.addColorStop(1, '#6aa848'); o.fillStyle = gr; o.fillRect(0, 150, 360, 490);
  const rnd = P.rng(17); for (let i = 0; i < 200; i++) { o.strokeStyle = `rgba(60,120,40,${0.2 + rnd() * 0.3})`; o.lineWidth = 1.2; const x = rnd() * 360, y = 150 + rnd() * 490; o.beginPath(); o.moveTo(x, y); o.lineTo(x + 2, y - 6); o.stroke(); }
  // the clinic: a white tent with a green cross, bottom left
  o.fillStyle = '#fff6ea'; o.strokeStyle = '#8a7a6a'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(14, 616); o.lineTo(64, 548); o.lineTo(114, 616); o.closePath(); o.fill(); o.stroke();
  o.fillStyle = '#3aa860'; o.fillRect(58, 572, 12, 30); o.fillRect(49, 581, 30, 12);
  P.vignette(o, 360, 640, 0.25, '#2a4a2a');
}
const pos = i => [X0 + (i % COLS) * DX + (Math.floor(i / COLS) % 2 ? 6 : -6), Y0 + Math.floor(i / COLS) * DY];

MG.add({
  id: 'medicine_screen', stage: 'medicine', cmd: 'SCREEN!', time: 6, mood: 'party', winText: 'False alarms!', failText: 'Missed some!',
  card: { title: 'Most alarms can be false', kind: 'Medicine', ref: 'Screening tests and false positives',
    text: 'No test is perfect. A good test still lights up for a few healthy people by mistake. That is called a false positive.\n\nWhen an illness is rare, almost everyone tested is healthy, so even a few mistakes among them add up to more lit-up people than there are sick ones. Here, one animal in 100 was sick, but six lit up. When an illness is common, most of the lit-up people really are sick.\n\nThat is why doctors confirm a positive screening result with a second, different test before treating.',
    note: 'When an illness is rare, most positive results from a screening test are false alarms.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), n = COLS * ROWS;
    s.an = []; for (let i = 0; i < n; i++) s.an.push({ kind: KINDS[Math.floor(g.rand() * KINDS.length)], ph: g.rand() * 6, sick: false, pos: false, scanned: -1 });
    const pickFree = (f) => { for (;;) { const i = Math.floor(g.rand() * n); if (f(s.an[i])) return i; } };
    const nSick = L >= 2 ? 30 : 1, nFalse = 5;
    for (let k = 0; k < nSick; k++) { const i = pickFree(a => !a.sick); s.an[i].sick = true; s.an[i].pos = k < nSick - (L >= 2 ? 1 : 0); }
    for (let k = 0; k < nFalse; k++) { const i = pickFree(a => !a.sick && !a.pos); s.an[i].pos = true; }
    s.wand = null; s.done = -1; s.left = n;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.wand = { x, y }; scan(g); },
  move(g, x, y) { const s = g.s; if (!s.wand || g.done) return; s.wand.x = x; s.wand.y = y; scan(g); },
  up(g) { g.s.wand = null; },
  update(g, dt) {
    const s = g.s;
    if (s.left === 0 && s.done < 0) { s.done = g.t; g.sfx('ding'); }
    if (s.done >= 0 && !g.done && g.t - s.done > 0.9) { g.win(); g.sfx('cheer'); }
    if (g.result === 'fail' && s.sneeze == null) { s.sneeze = g.t; g.sfx('wrong'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('medicine_screen_fair', paintFair), 0, 0, 360, 640);
    const treat = s.done >= 0 ? t - s.done : -1; // seconds since the last animal was scanned: pills fly to every lit one
    for (const [i, a] of s.an.entries()) {
      const [x, y] = pos(i), lit = a.scanned >= 0 && a.pos;
      const got = treat > 0.2 + (i % 7) * 0.03;
      let expr = 'happy', pose = 'idle';
      if (a.sick && !(lit && got)) expr = 'sad';
      if (lit && got) { if (a.sick) { expr = 'laugh'; pose = 'cheer'; } else { expr = 'sad'; pose = 'sad'; } }
      if (lost && a.sick && a.scanned < 0) { expr = 'wow'; }
      if (lit) { c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(x, y - 10, 2, x, y - 10, 24); gl.addColorStop(0, 'rgba(255,90,60,0.85)'); gl.addColorStop(1, 'rgba(255,90,60,0)'); c.fillStyle = gl; c.beginPath(); c.arc(x, y - 10, 24, 0, 7); c.fill(); c.restore(); }
      SK.animal(c, a.kind, x, y, 0.34, { t, phase: a.ph, expr, pose, tint: a.sick && !(lit && got) ? undefined : undefined });
      // sick spots (seen only at the end, or on a fail)
      if (a.sick && (got || lost) && !(lit && got && treat > 0.8)) { c.fillStyle = '#7ac040'; for (const [dx, dy] of [[-4, -16], [3, -12], [-1, -20]]) { c.beginPath(); c.arc(x + dx, y + dy, 2, 0, 7); c.fill(); } }
      if (a.scanned >= 0 && !a.pos) { c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.arc(x + 9, y - 22, 3, 0, 7); c.fill(); }
      if (lit) { const fl = Math.sin(t * 10 + i) > 0; c.fillStyle = fl ? '#ff3a3a' : '#ff9a6a'; c.beginPath(); c.arc(x, y - 30, 4.5, 0, 7); c.fill(); }
      // the pill arriving, and a little storm cloud over the grumbling healthy ones
      if (lit && treat > 0) { const k = SK.clamp((treat - (i % 7) * 0.03) / 0.25, 0, 1); if (k < 1) { const px = SK.lerp(64, x, k), py = SK.lerp(570, y - 16, k) - Math.sin(k * Math.PI) * 60; c.fillStyle = '#fff'; c.strokeStyle = '#3aa860'; c.lineWidth = 2; c.beginPath(); c.roundRect(px - 6, py - 3, 12, 6, 3); c.fill(); c.stroke(); }
        else if (!a.sick) { c.fillStyle = '#8a8aa0'; c.beginPath(); c.arc(x - 5, y - 40, 6, 0, 7); c.arc(x + 4, y - 42, 7, 0, 7); c.arc(x + 10, y - 38, 5, 0, 7); c.fill(); c.strokeStyle = '#ffe050'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 2, y - 36); c.lineTo(x - 1, y - 30); c.lineTo(x + 3, y - 30); c.lineTo(x, y - 24); c.stroke(); } }
      if (lost && a.sick && a.scanned < 0 && s.sneeze != null) { const k = ((t - s.sneeze) * 1.5) % 1; c.fillStyle = `rgba(150,220,90,${0.8 * (1 - k)})`; for (let j = 0; j < 6; j++) { const ang = j * 1.05; c.beginPath(); c.arc(x + Math.cos(ang) * (10 + k * 30), y - 14 + Math.sin(ang) * (10 + k * 20), 3, 0, 7); c.fill(); } }
    }
    // the test scanner: a glowing ring under the finger
    if (s.wand && !g.done) { const w = s.wand; c.save(); c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.globalAlpha = 0.9; c.beginPath(); c.arc(w.x, w.y, SR, 0, 7); c.stroke(); c.globalAlpha = 0.18; c.fillStyle = '#c0f0ff'; c.fill(); c.restore();
      c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; const sw = (t * 3) % 1; c.beginPath(); c.moveTo(w.x - SR, w.y - SR + sw * SR * 2); c.lineTo(w.x + SR, w.y - SR + sw * SR * 2); c.stroke(); }
    // how much of the crowd is still unscanned: a counter strip of dots by the clinic is too much text; instead a shrinking bar
    const done = 1 - s.left / s.an.length; c.fillStyle = 'rgba(30,40,30,0.45)'; c.beginPath(); c.roundRect(130, 586, 160, 16, 8); c.fill(); c.fillStyle = '#c0f0ff'; c.beginPath(); c.roundRect(130, 586, Math.max(16, 160 * done), 16, 8); c.fill();
    SK.animal(c, 'owl', 322, 616, 0.6, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'think' : lost ? 'wow' : 'happy', facing: -1 });
    // guidance: a ghost hand rubbing the scanner across the crowd
    if (!g.done && s.left === s.an.length) SK.glow(c, g, 180, 350, 60);
    SK.demo(g, c, 'drag', [50, 200], [310, 200], { period: 1.6 });
  },
  // the bot: sweep the scanner back and forth over every row
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 0.5) return; const B = s._b = s._b || { k: 0, down: false };
    if (s.left === 0) { if (B.down) { synth('up', 0, 0); B.down = false; } return; }
    const passes = 5, per = 0.5, k = B.k, p = Math.floor(k / per), f = (k % per) / per;
    const y = Y0 - 12 + Math.min(passes - 1, p) * (DY * ROWS / passes) + DY * 0.4, x = p % 2 ? SK.lerp(345, 15, f) : SK.lerp(15, 345, f);
    if (!B.down) { synth('down', x, y); B.down = true; } else synth('move', x, y);
    B.k += dt; if (p >= passes) { B.k = 0; }
  },
});
function scan(g) {
  const s = g.s, w = s.wand;
  for (const [i, a] of s.an.entries()) { if (a.scanned >= 0) continue; const [x, y] = pos(i); if (SK.dist(x, y - 10, w.x, w.y) < SR) { a.scanned = g.t; s.left--; if (a.pos) { g.sfx('ding'); } else if (s.left % 6 === 0) g.sfx('tap'); } }
}
