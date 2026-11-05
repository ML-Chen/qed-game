// SCREEN! (chem_bio MED-07) — a crowd of 100 animals at a meadow fair; one of them is sick. Rub the test scanner over the
// whole crowd. The sick animal lights up, and so do a handful of healthy ones, by mistake. Once everyone is scanned,
// the owl doctor flies to each lit-up animal with a careful second test: the healthy ones get a green tick and hop for
// joy, and only the truly sick one stays lit, so most of the first test's alarms were false. Run out of time with animals unscanned and the sick
// one (still unscanned) sneezes on its neighbours. Level 2: a common illness, and most of the lit-up animals are sick.
const COLS = 5, ROWS = 8, X0 = 54, DX = 63, Y0 = 186, DY = 50, SR = 52, AS = 0.5;
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
const pos = i => [X0 + (i % COLS) * DX + (Math.floor(i / COLS) % 2 ? 10 : -10), Y0 + Math.floor(i / COLS) * DY];

MG.add({
  id: 'medicine_screen', stage: 'medicine', cmd: 'TEST ALL 40 ANIMALS!', time: 6, mood: 'party', winText: 'Only one was sick!', failText: 'Missed some!',
  card: { title: 'Most alarms can be false', kind: 'Medicine', ref: 'Screening tests and false positives',
    text: 'No test is perfect. A good test still lights up for a few healthy people by mistake. That is called a false positive.\n\nWhen an illness is rare, almost everyone tested is healthy, so a few mistakes among them add up to more lit-up people than there are sick ones. Here, one animal in 40 was sick, but five lit up. A second, more careful test showed that four of them were fine. When an illness is common, most of the lit-up people really are sick.\n\nThat is why doctors confirm a positive screening result with a second test before treating.',
    note: 'When an illness is rare, most positive results from a screening test are false alarms.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), n = COLS * ROWS;
    s.v = SK.variant(g, 4); const ks = [['rabbit', 'duck', 'frog', 'penguin', 'fox'], ['hedgehog', 'beaver', 'owl', 'turtle', 'bird'], ['penguin', 'fox', 'owl', 'frog', 'beaver'], ['duck', 'rabbit', 'turtle', 'hedgehog', 'bird']][s.v];
    s.an = []; for (let i = 0; i < n; i++) s.an.push({ kind: ks[Math.floor(g.rand() * ks.length)], ph: g.rand() * 6, sick: false, pos: false, scanned: -1 });
    const pickFree = (f) => { for (;;) { const i = Math.floor(g.rand() * n); if (f(s.an[i])) return i; } };
    const nSick = L >= 2 ? 14 : 1, nFalse = 4;
    for (let k = 0; k < nSick; k++) { const i = pickFree(a => !a.sick); s.an[i].sick = true; s.an[i].pos = k < nSick - (L >= 2 ? 1 : 0); }
    for (let k = 0; k < nFalse; k++) { const i = pickFree(a => !a.sick && !a.pos); s.an[i].pos = true; }
    s.wand = null; s.done = -1; s.left = n;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.wand = { x, y }; scan(g); },
  move(g, x, y) { const s = g.s; if (!s.wand || g.done) return; s.wand.x = x; s.wand.y = y; scan(g); },
  up(g) { g.s.wand = null; },
  update(g, dt) {
    const s = g.s;
    // everyone scanned: the owl doctor checks each lit-up animal again with a careful second test (the fuse waits)
    if (s.left === 0 && s.done < 0) { s.done = g.t; g.sfx('ding'); s.lit = s.an.map((a, i) => i).filter(i => s.an[i].pos); s.per = Math.min(0.42, 2.6 / s.lit.length); }
    if (s.done >= 0 && !g.done) {
      g.held += dt;
      const k = Math.floor((g.t - s.done - 0.3) / s.per);
      for (let j = 0; j <= Math.min(k, s.lit.length - 1); j++) { const a = s.an[s.lit[j]]; if (a.check == null) { a.check = g.t; g.sfx(a.sick ? 'wrong' : 'chime'); } }
      if (k >= s.lit.length + 1) { g.win(); g.sfx('cheer'); }
    }
    if (g.result === 'fail' && s.sneeze == null) { s.sneeze = g.t; g.sfx('wrong'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('medicine_screen_fair', paintFair), 0, 0, 360, 640);
    for (const [i, a] of s.an.entries()) {
      const [x, y] = pos(i), lit = a.scanned >= 0 && a.pos, ok = lit && a.check != null && !a.sick, conf = lit && a.check != null && a.sick;
      let expr = 'happy', pose = 'idle';
      if (ok) { expr = 'laugh'; pose = t - a.check < 0.8 ? 'cheer' : 'idle'; }
      if (conf || (lost && a.sick)) expr = 'sad';
      if (lit && !ok) { c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(x, y - 14, 2, x, y - 14, 32); gl.addColorStop(0, 'rgba(255,90,60,0.85)'); gl.addColorStop(1, 'rgba(255,90,60,0)'); c.fillStyle = gl; c.beginPath(); c.arc(x, y - 14, 32, 0, 7); c.fill(); c.restore(); }
      SK.animal(c, a.kind, x, y - (ok && t - a.check < 0.4 ? Math.sin((t - a.check) / 0.4 * Math.PI) * 14 : 0), AS, { t, phase: a.ph, expr, pose });
      if (conf || (lost && a.sick)) { c.fillStyle = '#6ab030'; for (const [dx, dy] of [[-6, -22], [5, -17], [-1, -28], [8, -27]]) { c.beginPath(); c.arc(x + dx, y + dy, 3, 0, 7); c.fill(); } }
      if (conf) { c.save(); c.translate(x + 10, y - 16); c.rotate(-0.5); c.fillStyle = '#fff'; c.strokeStyle = '#8a3a3a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(0, -3, 20, 6, 3); c.fill(); c.stroke(); c.fillStyle = '#ff3a3a'; c.fillRect(2, -1.5, 14, 3); c.restore(); }
      if (a.scanned >= 0 && !a.pos) { c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.arc(x + 13, y - 32, 3.5, 0, 7); c.fill(); }
      if (lit && !ok) { const fl = Math.sin(t * 10 + i) > 0; c.fillStyle = fl ? '#ff3a3a' : '#ff9a6a'; c.beginPath(); c.arc(x, y - 44, 6.5, 0, 7); c.fill(); }
      if (ok) { const k = Math.min(1, (t - a.check) / 0.2); c.save(); c.translate(x, y - 46); c.scale(k * 1.3, k * 1.3); c.fillStyle = '#3ac060'; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 8, 0, 7); c.fill(); c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-4, 0); c.lineTo(-1, 3.5); c.lineTo(4.5, -3.5); c.stroke(); c.restore(); }
      if (lost && a.sick && a.scanned < 0 && s.sneeze != null) { const k = ((t - s.sneeze) * 1.5) % 1; c.fillStyle = `rgba(150,220,90,${0.8 * (1 - k)})`; for (let j = 0; j < 6; j++) { const ang = j * 1.05; c.beginPath(); c.arc(x + Math.cos(ang) * (10 + k * 30), y - 14 + Math.sin(ang) * (10 + k * 20), 3, 0, 7); c.fill(); } }
    }
    // the test scanner: a glowing ring under the finger
    if (s.wand && !g.done) { const w = s.wand; c.save(); c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.globalAlpha = 0.95; c.beginPath(); c.arc(w.x, w.y, SR, 0, 7); c.stroke(); c.globalAlpha = 0.15; c.fillStyle = '#c0f0ff'; c.fill(); c.restore();
      c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; const sw = (t * 3) % 1; c.beginPath(); c.moveTo(w.x - SR * 0.8, w.y - SR * 0.6 + sw * SR * 1.2); c.lineTo(w.x + SR * 0.8, w.y - SR * 0.6 + sw * SR * 1.2); c.stroke();
      c.fillStyle = '#3a4a6a'; c.strokeStyle = '#1a2a3a'; c.lineWidth = 2; c.beginPath(); c.roundRect(w.x + SR * 0.62, w.y + SR * 0.62, 16, 48, 6); c.fill(); c.stroke(); c.fillStyle = Math.sin(t * 16) > 0 ? '#7affa0' : '#2a8a4a'; c.beginPath(); c.arc(w.x + SR * 0.62 + 8, w.y + SR * 0.62 + 10, 4, 0, 7); c.fill(); }
    // how much of the crowd is still unscanned: a counter strip of dots by the clinic is too much text; instead a shrinking bar
    const done = 1 - s.left / s.an.length; c.fillStyle = 'rgba(30,40,30,0.45)'; c.beginPath(); c.roundRect(130, 586, 160, 16, 8); c.fill(); c.fillStyle = '#c0f0ff'; c.beginPath(); c.roundRect(130, 586, Math.max(16, 160 * done), 16, 8); c.fill();
    let ox = 322, oy = 616, fly = false;
    if (s.done >= 0 && s.lit) { const f = (t - s.done - 0.3) / s.per, j = SK.clamp(Math.floor(f), 0, s.lit.length - 1), k = SK.clamp((f - j) * 3, 0, 1); const prev = j > 0 ? pos(s.lit[j - 1]) : [322, 616], cur = pos(s.lit[j]); if (f >= 0 && f < s.lit.length + 0.6) { ox = SK.lerp(prev[0], cur[0] + 16, SK.easeInOut(k)); oy = SK.lerp(prev[1], cur[1] + 2, SK.easeInOut(k)) - Math.sin(k * Math.PI) * 30; fly = true; } }
    SK.animal(c, 'owl', ox, oy, fly ? 0.45 : 0.6, { t, pose: won ? 'cheer' : fly ? 'point' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : fly ? 'think' : 'happy', facing: -1, noShadow: fly });
    if (fly) { c.strokeStyle = '#5a4a30'; c.lineWidth = 3; c.fillStyle = 'rgba(220,240,255,0.6)'; c.beginPath(); c.arc(ox - 22, oy - 26, 8, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(ox - 16, oy - 20); c.lineTo(ox - 10, oy - 14); c.stroke(); }
    // guidance: a ghost hand rubbing the scanner across the crowd
    const nx = s.an.findIndex(a => a.scanned < 0);
    if (s.wand && !g.done) SK.tag(c, 'Quick test', SK.clamp(s.wand.x, 70, 290), s.wand.y - SR - 22, 18);
    if (fly) SK.tag(c, 'Careful test', SK.clamp(ox, 80, 280), oy - 74, 18);
    if (nx >= 0 && !s.wand && !g.done) { const [, ry] = pos(nx); SK.arrow(c, g, 40, ry - 14, 320, ry - 14, { from: 0, to: 0 }); }
    if (nx >= 0) { const [, ry] = pos(nx); SK.demo(g, c, 'drag', [30, ry - 10], [330, ry - 10], { period: 1.6 }); }
  },
  // the bot: sweep the scanner back and forth over every row
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 0.5) return; const B = s._b = s._b || { k: 0, down: false };
    if (s.left === 0) { if (B.down) { synth('up', 0, 0); B.down = false; } return; }
    const passes = 4, per = 0.5, k = B.k, p = Math.floor(k / per), f = (k % per) / per;
    const y = Y0 - 12 + Math.min(passes - 1, p) * (DY * ROWS / passes) + DY * 0.4, x = p % 2 ? SK.lerp(345, 15, f) : SK.lerp(15, 345, f);
    if (!B.down) { synth('down', x, y); B.down = true; } else synth('move', x, y);
    B.k += dt; if (p >= passes) { B.k = 0; }
  },
});
function scan(g) {
  const s = g.s, w = s.wand;
  for (const [i, a] of s.an.entries()) { if (a.scanned >= 0) continue; const [x, y] = pos(i); if (SK.dist(x, y - 10, w.x, w.y) < SR) { a.scanned = g.t; s.left--; if (a.pos) { g.sfx('ding'); } else if (s.left % 6 === 0) g.sfx('tap'); } }
}
