// ROLL DICE! (earth EE HES-06) — 100 copies of the same house on a river floodplain where a flood has a 1-in-100 chance
// each year. Mash to roll the year's dice: each tap is one year, and every house rolls its own 100-sided die. Floods
// splash at random; a house that has flooded keeps a blue water line. After 30 years about a quarter of the houses have
// flooded at least once, and a few have flooded twice (their duck owners faint). Level 2: 60 years, two per tap.
const RD_COLS = 10, RD_X0 = 26, RD_Y0 = 226, RD_DX = 34, RD_DY = 30;
const RD_LV = [{ years: 30, per: 1 }, { years: 30, per: 1 }, { years: 60, per: 2 }];
function rdHouse(o, x, y, s, wall, roof) {
  o.fillStyle = 'rgba(30,14,36,0.2)'; o.beginPath(); o.ellipse(x + 1, y + 1, 12 * s, 3 * s, 0, 0, 7); o.fill();
  o.fillStyle = wall; o.strokeStyle = '#5a2e3a'; o.lineWidth = 1.4; o.beginPath(); o.rect(x - 9 * s, y - 13 * s, 18 * s, 13 * s); o.fill(); o.stroke();
  o.fillStyle = roof; o.beginPath(); o.moveTo(x - 12 * s, y - 12 * s); o.lineTo(x, y - 23 * s); o.lineTo(x + 12 * s, y - 12 * s); o.closePath(); o.fill(); o.stroke();
  o.fillStyle = '#4e8ac0'; o.fillRect(x - 3 * s, y - 7 * s, 6 * s, 7 * s);
}
function rdPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#8aa8c8', '#c8d8e0', '#e8e8d0']);
  o.fillStyle = '#9ab48a'; o.beginPath(); o.moveTo(0, 170); for (let x = 0; x <= 360; x += 8) o.lineTo(x, 150 - 16 * Math.sin(x / 50) - 6 * Math.sin(x / 13)); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  // the river along the top of the plain
  B5.vgrad(o, 0, 176, 360, 40, ['#5ab0d0', '#3a90b8', '#4aa0c8']);
  o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 2; for (let i = 0; i < 9; i++) { o.beginPath(); o.moveTo(i * 42 + 6, 192 + (i % 2) * 8); o.lineTo(i * 42 + 26, 192 + (i % 2) * 8); o.stroke(); }
  // the floodplain
  B5.vgrad(o, 0, 214, 360, 420, ['#9ccc6a', '#86b858', '#6a9a44']);
  P.grassTufts(o, 360, 220, 600, 60, '#7ab450', 12);
  const cols = ['#f6e0c0', '#f0d2a0', '#fbe6c4', '#ecc898'], roofs = ['#d8604e', '#c85048', '#b8584e', '#d07050'];
  for (let i = 0; i < 100; i++) { const cx = RD_X0 + (i % RD_COLS) * RD_DX, cy = RD_Y0 + Math.floor(i / RD_COLS) * RD_DY + 20; rdHouse(o, cx, cy, 1, cols[i % 4], roofs[(i * 7) % 4]); }
  P.grain(o, 360, 640, 0.03);
}
function rdDie(c, x, y, r, face, spin) {
  c.save(); c.translate(x, y); c.rotate(spin);
  c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.ellipse(4, r + 6, r, r * 0.25, 0, 0, 7); c.fill();
  c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.roundRect(-r, -r, 2 * r, 2 * r, r * 0.3); c.fill(); c.stroke();
  const pip = (px, py) => { c.fillStyle = '#e8403a'; c.beginPath(); c.arc(px * r * 0.5, py * r * 0.5, r * 0.16, 0, 7); c.fill(); };
  const F = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  (F[face] || F[1]).forEach(([a, b]) => pip(a, b)); c.restore();
}
MG.add({
  id: 'rolldice', stage: 'earth', cmd: 'ROLL DICE!', time: 6, mood: 'storm', winText: 'Risk adds up!', failText: 'Too slow!',
  card: { title: 'Rare risks add up', kind: 'Earth science', ref: 'Return periods ("100-year flood")',
    text: 'A "100-year flood" does not mean a flood once every hundred years. It means a 1 in 100 chance of that flood in any single year. Each year rolls fresh dice, so a house can flood two years in a row.\n\nSmall yearly chances add up over time. Over 30 years, about 26 of 100 such houses flood at least once, roughly 1 in 4. Even over 100 years, about a third of them never flood.\n\nThis is why buyers in flood zones are told to think about insurance.',
    note: 'A small chance each year becomes a big chance over many years: a 1-in-100 yearly flood hits about 1 in 4 houses in 30 years.' },
  init(g) {
    const s = g.s, L = RD_LV[Math.min(2, g.level)]; s.L = L; s.year = 0; s.hits = new Array(100).fill(0); s.splash = []; s.face = 6; s.rollT = -9; s.faint = -1; s.faintT = 0;
  },
  down(g, x, y) {
    const s = g.s, L = s.L; SK.touched(g); if (g.done || s.year >= L.years) return;
    for (let k = 0; k < L.per && s.year < L.years; k++) {
      s.year++;
      for (let i = 0; i < 100; i++) if (g.rand() < 0.01) { s.hits[i]++; s.splash.push({ i, t: g.t }); if (s.hits[i] === 2 && s.faint < 0) { s.faint = i; s.faintT = g.t; g.sfx('quack'); } }
    }
    s.face = 1 + Math.floor(g.rand() * 6); s.rollT = g.t; g.sfx('drum'); g.sfx('tap');
    if (s.splash.length && s.splash[s.splash.length - 1].t === g.t) g.sfx('splash');
    if (s.splash.length > 40) s.splash = s.splash.slice(-40);
    if (s.year >= L.years) { g.win(); g.sfx('cheer'); }
  },
  update(g, dt) {},
  draw(g, c) {
    const s = g.s, L = s.L, t = g.t;
    c.drawImage(g.bake('rolldice_bg', rdPaint), 0, 0, 360, 640);
    // the years so far: a strip of pips under the command, filling as you roll
    const n = L.years, w = Math.min(10, 300 / n), x0 = 180 - (n * w) / 2;
    for (let i = 0; i < n; i++) { c.fillStyle = i < s.year ? '#ffd45a' : 'rgba(40,30,60,0.35)'; c.beginPath(); c.roundRect(x0 + i * w + 1, 136, w - 2, 14, 3); c.fill(); }
    // houses that have flooded keep a blue water line; floods this moment splash
    for (let i = 0; i < 100; i++) { if (!s.hits[i]) continue; const cx = RD_X0 + (i % RD_COLS) * RD_DX, cy = RD_Y0 + Math.floor(i / RD_COLS) * RD_DY + 20;
      c.fillStyle = 'rgba(50,130,220,0.75)'; c.beginPath(); c.ellipse(cx, cy - 1, 16, 6.5, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(60,140,230,0.55)'; c.fillRect(cx - 10, cy - 14, 20, 14); c.fillStyle = 'rgba(60,140,230,0.55)'; c.beginPath(); c.moveTo(cx - 13, cy - 12); c.lineTo(cx, cy - 24); c.lineTo(cx + 13, cy - 12); c.fill();
      if (s.hits[i] > 1) { c.strokeStyle = '#2a6ac0'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(cx, cy - 1, 17, 8, 0, 0, 7); c.stroke(); } }
    for (const sp of s.splash) { const k = (t - sp.t) / 0.6; if (k < 0 || k > 1) continue; const cx = RD_X0 + (sp.i % RD_COLS) * RD_DX, cy = RD_Y0 + Math.floor(sp.i / RD_COLS) * RD_DY + 14;
      c.save(); c.globalAlpha = 1 - k; c.fillStyle = '#bfe8ff'; for (let j = 0; j < 6; j++) { const a = -Math.PI / 2 + (j - 2.5) * 0.45; c.beginPath(); c.arc(cx + Math.cos(a) * 20 * k, cy + Math.sin(a) * 22 * k + 30 * k * k, 3, 0, 7); c.fill(); }
      c.strokeStyle = '#7ac8f0'; c.lineWidth = 3; c.beginPath(); c.ellipse(cx, cy + 6, 8 + 14 * k, 3 + 4 * k, 0, 0, 7); c.stroke(); c.restore(); }
    // the duck whose house flooded twice faints on its doorstep
    if (s.faint >= 0) { const i = s.faint, cx = RD_X0 + (i % RD_COLS) * RD_DX, cy = RD_Y0 + Math.floor(i / RD_COLS) * RD_DY + 20, k = SK.easeOut((t - s.faintT) / 0.4);
      c.save(); c.translate(cx + 12, cy); c.rotate(-k * 1.4); SK.animal(c, 'duck', 0, 0, 0.6, { t, expr: 'wow', pose: 'sad', noShadow: true }); c.restore(); }
    // the big die: every tap rolls it
    const rk = SK.clamp((t - s.rollT) / 0.3, 0, 1), hop = Math.sin(rk * Math.PI) * 26;
    rdDie(c, 180, 574 - hop, 26, s.face, (1 - rk) * 2.4);
    if (!g.done) SK.glow(c, g, 180, 574, 40);
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'beaver', 318, 606, 0.7, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.faint >= 0 ? 'wow' : 'happy' });
    SK.demo(g, c, 'tap', [180, 574], null, { period: 0.5 });
  },
  auto(g, dt, synth) { const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 0.9) return; if (!B.last || g.t - B.last >= 0.12) { B.last = g.t; synth('down', 180, 574); synth('up', 180, 574); } },
});
