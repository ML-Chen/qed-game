// ROLL! (business PF-07) — a coin wrapped in a little snowball at the top of a long snowy hill, and a dashed ring at the
// bottom: the size you want to reach. Hold to keep it rolling: every stretch it picks up snow in proportion to its size,
// so the new snow picks up more snow and it swells faster and faster (compound interest). Let go and the rabbit scrapes
// the new snow off to spend it: the ball shrinks back to its first coin and the growth starts over from small.
// Level 2: a steeper hill (a higher rate) but a much bigger ring, so you must hold the whole way.
const HILL = { a: [26, 196], b: [150, 470], e: [252, 560] }; // a quadratic curve: steep at the top, flat at the bottom
const R0 = 11, LVR = [{ k: 1.75, goal: 46, v: 0.3 }, { k: 1.85, goal: 52, v: 0.34 }, { k: 2.05, goal: 66, v: 0.4 }]; // growth per hill, goal radius, hill per second
function hp(u) { const { a, b, e } = HILL, m = 1 - u; return [m * m * a[0] + 2 * m * u * b[0] + u * u * e[0], m * m * a[1] + 2 * m * u * b[1] + u * u * e[1]]; }
function hd(u) { const { a, b, e } = HILL; return [2 * (1 - u) * (b[0] - a[0]) + 2 * u * (e[0] - b[0]), 2 * (1 - u) * (b[1] - a[1]) + 2 * u * (e[1] - b[1])]; }
function ballAt(u, r) { const [x, y] = hp(u), [dx, dy] = hd(u), L = Math.hypot(dx, dy); return [x + dy / L * r, y - dx / L * r]; } // sits on the surface (normal points up-right)
function paintHill(o) {
  const sky = o.createLinearGradient(0, 0, 0, 420); sky.addColorStop(0, '#8ec8ee'); sky.addColorStop(0.7, '#cfeaf8'); sky.addColorStop(1, '#f4fbff'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  // far snowy mountains and a white valley floor
  o.fillStyle = '#c4dcee'; o.beginPath(); o.moveTo(0, 420); [[60, 300], [120, 360], [190, 270], [260, 350], [320, 290], [360, 330]].forEach(([x, y]) => o.lineTo(x, y)); o.lineTo(360, 420); o.closePath(); o.fill();
  o.fillStyle = '#ffffff'; o.beginPath(); o.moveTo(170, 292); o.lineTo(190, 270); o.lineTo(212, 296); o.lineTo(198, 290); o.lineTo(188, 300); o.closePath(); o.fill(); o.beginPath(); o.moveTo(304, 306); o.lineTo(320, 290); o.lineTo(338, 310); o.closePath(); o.fill();
  const vf = o.createLinearGradient(0, 400, 0, 560); vf.addColorStop(0, '#e6f2fa'); vf.addColorStop(1, '#f8fcff'); o.fillStyle = vf; o.fillRect(0, 400, 360, 240);
  // far pines
  const rnd = P.rng(4); for (let i = 0; i < 9; i++) { const x = 150 + rnd() * 210, y = 410 + rnd() * 30, h = 26 + rnd() * 20; o.fillStyle = '#5a8aa0'; o.beginPath(); o.moveTo(x, y - h); o.lineTo(x + h * 0.35, y); o.lineTo(x - h * 0.35, y); o.closePath(); o.fill(); }
  // the big hill: everything below the curve is snow
  o.beginPath(); o.moveTo(0, 640); o.lineTo(0, HILL.a[1]); for (let u = 0; u <= 1.0001; u += 0.02) { const [x, y] = hp(u); o.lineTo(x, y); } o.lineTo(360, HILL.e[1]); o.lineTo(360, 640); o.closePath();
  const sn = o.createLinearGradient(0, 200, 300, 640); sn.addColorStop(0, '#ffffff'); sn.addColorStop(1, '#d4e6f4'); o.fillStyle = sn; o.fill();
  o.strokeStyle = '#a8c8e0'; o.lineWidth = 3; o.beginPath(); for (let u = 0; u <= 1.0001; u += 0.02) { const [x, y] = hp(u); u ? o.lineTo(x, y) : o.moveTo(x, y); } o.lineTo(360, HILL.e[1]); o.stroke();
  // soft blue shadows and sparkles in the snow
  for (let i = 0; i < 26; i++) { o.fillStyle = 'rgba(150,190,225,0.22)'; o.beginPath(); o.ellipse(rnd() * 300, 420 + rnd() * 220, 20 + rnd() * 40, 5 + rnd() * 6, 0, 0, 7); o.fill(); }
  for (let i = 0; i < 4; i++) { const x = 20 + i * 34, y = 520 + (i % 2) * 40; o.fillStyle = '#3e7a5a'; for (let j = 0; j < 3; j++) { o.beginPath(); o.moveTo(x, y - 52 + j * 14); o.lineTo(x + 18 - j * 2, y - 22 + j * 14); o.lineTo(x - 18 + j * 2, y - 22 + j * 14); o.closePath(); o.fill(); } o.fillStyle = '#fff'; o.beginPath(); o.ellipse(x, y - 46, 6, 3, 0, 0, 7); o.fill(); o.fillStyle = '#6a4a2a'; o.fillRect(x - 3, y - 10, 6, 10); }
}
function snowball(c, x, y, r, rot, nCoins) {
  c.save(); SK.shadow(c, x + r * 0.15, y + r * 0.95, r * 0.9, r * 0.22, 0.2);
  const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#e4f0fa'); g.addColorStop(1, '#a8c4dc');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = '#7a9ab8'; c.lineWidth = 2; c.stroke();
  c.beginPath(); c.arc(x, y, r - 1, 0, 7); c.clip();
  // coins rolled up in the snow (more of them as it grows), turning with the ball
  for (let i = 0; i < nCoins; i++) { const a = rot + i * 2.399, d = r * Math.sqrt((i + 0.5) / Math.max(1, nCoins)) * 0.82; const cx = x + Math.cos(a) * d, cy = y + Math.sin(a) * d; B8.coin(c, cx, cy, Math.max(4, Math.min(8, r * 0.13)), a * 2); }
  c.fillStyle = 'rgba(160,190,220,0.35)'; for (let i = 0; i < 5; i++) { const a = rot * 1.0 + i * 1.3; c.beginPath(); c.arc(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.12, 0, 7); c.fill(); }
  c.restore();
}
MG.add({
  id: 'rollsnow', stage: 'money', cmd: 'ROLL!', time: 5, mood: 'bright', winText: 'Huge!', failText: 'Too small!', hold: 1.6,
  card: { title: 'Interest on interest', kind: 'Money', ref: 'Compound interest',
    text: 'Money in a savings account earns interest: the bank adds a little extra, a share of what is already there. If you leave that interest in, next time you earn interest on it too.\n\nSo the snowball grows faster as it gets bigger. A big ball picks up more snow with every roll than a small one. That is compound interest.\n\nTake the interest out to spend it each time, and the ball stays small the whole way down. A higher rate makes a steeper hill, and the ball grows even faster.',
    note: 'Leave the interest in and it earns interest too, so savings grow faster and faster.' },
  init(g) {
    const s = g.s, L = LVR[Math.min(2, g.level)];
    s.L = L; s.u = 0.02; s.base = 0.02; s.r = R0; s.rot = 0; s.rolling = false; s.end = 0; s.spends = [];
  },
  down(g) { const s = g.s; if (g.done || s.end) return; SK.holdStart(g); s.rolling = true; g.sfx('swoosh'); },
  up(g) {
    const s = g.s; SK.holdEnd(g); if (!s.rolling || g.done || s.end) return; s.rolling = false;
    if (s.r > R0 + 2) { // the rabbit scrapes the new snow off to spend it: the ball is back to its first coin
      const [x, y] = ballAt(s.u, s.r); s.spends.push({ t: g.t, x, y, r: s.r }); g.burst(x, y, ['#ffffff', '#dceefa', '#ffe27a'], 18, 220); g.sfx('crunch'); g.sfx('coin');
      s.r = R0; s.base = s.u;
    }
  },
  update(g, dt) {
    const s = g.s, L = s.L;
    if (s.rolling && !s.end) {
      const [dx, dy] = hd(s.u), sp = L.v * 560 / Math.hypot(dx, dy) * (0.75 + 0.5 * SK.clamp(dy / Math.hypot(dx, dy), 0, 1)); // a little faster where steep
      s.u = Math.min(1, s.u + sp * dt);
      s.r = R0 * Math.exp(L.k * (s.u - s.base) / 0.98); // each stretch adds snow in proportion to the size: exponential growth
      s.rot += sp * dt * 560 / Math.max(8, s.r);
      if (Math.floor(s.u * 12) !== Math.floor((s.u - sp * dt) * 12)) g.sfx('rustle');
      if (s.u >= 1) { s.end = g.t; s.rolling = false; const ok = s.r >= L.goal * 0.97; if (ok) { g.win(); g.sfx('cheer'); g.shake(4, 0.3); const [x, y] = ballAt(1, s.r); g.burst(x, y, ['#ffffff', '#ffe27a', '#bfe6ff'], 26, 260); } else { g.fail(); g.sfx('boing'); } }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L;
    c.drawImage(g.bake('b8roll_h', paintHill), 0, 0, 360, 640);
    // the year flags along the slope
    for (let i = 1; i < 6; i++) { const [x, y] = hp(i / 6); c.strokeStyle = '#6a4a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 6, y + 2); c.lineTo(x - 6, y - 26); c.stroke(); c.fillStyle = i % 2 ? '#e8566a' : '#f5c23a'; c.beginPath(); c.moveTo(x - 6, y - 26); c.lineTo(x + 8 + Math.sin(t * 6 + i) * 2, y - 21); c.lineTo(x - 6, y - 16); c.closePath(); c.fill(); }
    // the goal ring at the bottom
    const [gx, gy] = ballAt(1, L.goal);
    c.save(); c.strokeStyle = won ? '#5ad07a' : '#e8566a'; c.lineWidth = 4; c.setLineDash([10, 7]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(gx, gy, L.goal, 0, 7); c.stroke(); c.restore();
    // spent snow: chunks tumbling away, each with a coin the rabbit spent
    for (const sp of s.spends) { const q = (t - sp.t) / 0.9; if (q > 1) continue; for (let i = 0; i < 6; i++) { const a = i * 1.05, d = sp.r * (0.4 + q * 1.5); c.globalAlpha = 1 - q; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(sp.x + Math.cos(a) * d, sp.y + Math.sin(a) * d + q * q * 80, sp.r * 0.25 * (1 - q * 0.5), 0, 7); c.fill(); c.globalAlpha = 1; } }
    // the snowball
    const [bx, by] = ballAt(s.u, s.r);
    snowball(c, bx, by, s.r, s.rot, Math.min(12, Math.max(1, Math.round(Math.sqrt(s.r * s.r / (R0 * R0)) * 0.8))));
    if (!s.rolling && !s.end) SK.glow(c, g, bx, by, s.r + 16);
    // the rabbit at the bottom, with a shovel for scraping
    const scr = s.spends.length && t - s.spends[s.spends.length - 1].t < 0.6;
    SK.animal(c, 'rabbit', 176, 612, 0.95, { t, pose: won ? 'cheer' : scr ? 'wave' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : scr ? 'wow' : 'happy', facing: 1 });
    SK.demo(g, c, 'hold', [bx + 4, by + 6], null, { delay: 0.8, period: 2.4 });
  },
  auto(g, dt, synth) { SK.bot.hold(g, synth, 'roll', 0.9, 180, 330, 30); },
});
