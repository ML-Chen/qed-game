// PLUG EVERY FEE LEAK FAST! (business PF-30) — fees eat returns. Your savings are a tower of coins that grows 7% a year;
// a ghost twin beside it is the same savings left in a high-fee fund. Fee leaks open in your tower's side, each a stream
// of coins pouring into the fund fox's bucket, 1% of the tower every year. Drag a "Low fee" cork from the tray into each
// leak to switch to a cheaper fund. The years run from 0 to 30; a dashed crown shows where your tower will end, and a
// Goal line where it should reach. Plug fast and your tower ends far above the ghost; dawdle and the lost coins pile up
// in the fox's bucket and can't be won back.
// Level 1: three leaks; level 2: three leaks and one of them is a small, hidden drip.
(() => {
  const R = 0.07, YEARS = 30, BASE = 544, K = 4.0, V0 = 10, TW = 96, MINE = 104, GHOST = 268, TRAY = { x: 166, y: 596 };
  const LV = [{ leaks: [[0, 0.01], [10, 0.01]], yps: 3.0, goal: 0.86 }, { leaks: [[0, 0.01], [8, 0.01], [16, 0.01]], yps: 2.6, goal: 0.82 }, { leaks: [[0, 0.01], [6, 0.01], [12, 0.005, 1]], yps: 3.6, goal: 0.88 }];
  const SPOTS = [[0.32, 0.6, 0.82], [0.55, 0.3, 0.75], [0.7, 0.42, 0.22], [0.45, 0.78, 0.3]], SIDE = [[-1, 1, -1], [1, -1, 1], [-1, -1, 1], [1, 1, -1]];
  const H = v => Math.min(420, K * v);
  function paint(o) {
    P.sky(o, 360, 640, ['#f0b080', '#f8d0a8', '#fff4e0']); P.cloud(o, 70, 150, 0.6); P.cloud(o, 290, 190, 0.5);
    P.hills(o, 360, 500, 50, '#c8b070', '#9a8048', { seed: 5 });
    N6.vgrad(o, 0, BASE - 2, 360, 100, ['#b89a68', '#8a6a40']); o.fillStyle = '#d8c090'; o.fillRect(0, BASE - 4, 360, 5);
  }
  function tower(c, x, h, alpha, t) { // a stack of gold coins as tall as the savings
    c.save(); c.globalAlpha = alpha; const n = Math.max(1, Math.floor(h / 8));
    for (let i = 0; i < n; i++) N6.flat(c, x + Math.sin(i * 1.7) * 2, BASE - 6 - i * (h / n), TW / 2);
    c.restore();
  }
  function leakPos(s, i, h, x) { return [x + s.side[i] * (TW / 2 - 4), BASE - Math.max(30, h * s.spots[i])]; }
  MG.add({
    id: 'money_fees', stage: 'money', cmd: 'PLUG EVERY FEE LEAK FAST!', time: 7, mood: 'bright', winText: 'Fees plugged, savings grew!', failText: 'The fees ate it!', hold: 1.7,
    card: { title: 'Small fees, big losses', kind: 'Money', ref: 'Investment fees',
      text: 'Investment funds charge a yearly fee, a small share of all your money, every year. One or two percent sounds tiny.\n\nBut the fee is taken from the whole pile every year, and the money taken can no longer grow. Over 30 years, a 2% yearly fee can eat about 40% of what you would have had.\n\nLow-cost index funds charge far less, often under 0.1% a year. Switching early saves the most, because lost years of growth don\'t come back.',
      note: 'Small yearly fees add up to a big loss over decades, so choose low-fee funds early.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)]; s.L = L; s.v = SK.variant(g, 4); s.spots = SPOTS[s.v]; s.side = SIDE[s.v];
      s.leaks = L.leaks.map(([y, f, hid]) => ({ y, f, hid: !!hid, open: y === 0, plugged: false, at: 0 })); s.year = 0; s.t0 = 0;
      s.mine = V0; s.ghost = V0; s.bucket = 0; s.gbucket = 0; s.cork = null; s.drops = []; s.endT = 0;
      s.goal = V0 * Math.pow(1 + R, YEARS) * L.goal;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (!s.t0) s.t0 = g.t; if (SK.dist(x, y, TRAY.x, TRAY.y - 6) < 52) { s.cork = { x: TRAY.x, y: TRAY.y - 6 }; SK.dragStart(g, s.cork, x, y); g.sfx('pop'); } },
    move(g, x, y) { if (g.s.cork) SK.dragMove(g, x, y); },
    up(g, x, y) {
      const s = g.s, ck = s.cork; if (!ck) return; SK.dragEnd(g); s.cork = null; if (g.done) return;
      const h = H(s.mine); let best = null, bd = 54; s.leaks.forEach((l, i) => { if (!l.open || l.plugged) return; const [lx, ly] = leakPos(s, i, h, MINE), d = SK.dist(ck.x, ck.y, lx, ly); if (d < bd) { bd = d; best = l; } });
      if (best) { best.plugged = true; best.pt = g.t; g.sfx('click'); g.sfx('chime'); } else g.sfx('boing', { vol: 0.4 });
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (!s.t0 && g.t >= 3.5) s.t0 = g.t; if (!s.t0) return; // the years start when you first act (or soon anyway)
      const allIn = s.leaks.every(l => l.open || l.y > s.year), safe = allIn && s.leaks.every(l => l.plugged || l.y > s.year) && s.leaks.every(l => l.open);
      const dy = Math.min(YEARS - s.year, s.L.yps * dt * (safe ? 4 : 1)); // once every leak is plugged the years race to the end
      for (const l of s.leaks) if (!l.open && s.year + dy >= l.y) { l.open = true; l.at = g.t; g.sfx('drip'); }
      const fee = s.leaks.reduce((a, l) => a + (l.open && !l.plugged ? l.f : 0), 0), gfee = s.leaks.reduce((a, l) => a + (l.open ? l.f : 0), 0);
      const m0 = s.mine, g0 = s.ghost; s.mine *= Math.pow(1 + R, dy) * Math.pow(1 - fee, dy); s.ghost *= Math.pow(1 + R, dy) * Math.pow(1 - gfee, dy);
      s.bucket += m0 * fee * dy; s.gbucket += g0 * gfee * dy; s.year += dy;
      if (fee > 0 && g.rand() < 0.5) s.drops.push({ x: 0, y: 0, t: g.t, li: s.leaks.findIndex(l => l.open && !l.plugged) });
      s.drops = s.drops.filter(d => g.t - d.t < 0.5);
      if (s.year >= YEARS - 1e-6) { if (s.mine >= s.goal) { g.win(); g.sfx('cheer'); g.burst(MINE, BASE - H(s.mine), ['#ffd45a', '#fff6ea', '#8affb0'], 22, 200); } else { g.fail(); g.sfx('laugh'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', hm = H(s.mine), hg = H(s.ghost);
      c.drawImage(g.bake('n6fees_bg', paint), 0, 0, 360, 640);
      // the goal on your tower, and where it is heading at the current fees
      const fee = s.leaks.reduce((a, l) => a + (l.open && !l.plugged ? l.f : 0), 0), rest = YEARS - s.year, proj = s.mine * Math.pow((1 + R) * (1 - fee), rest), gy = BASE - H(s.goal);
      c.save(); c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(MINE - 70, gy); c.lineTo(MINE + 70, gy); c.stroke(); c.restore(); SK.tag(c, 'Goal', MINE - 62, gy - 16, 18);
      tower(c, GHOST, hg, 0.45, t); tower(c, MINE, hm, 1, t);
      if (!g.done && s.t0) { const py = BASE - H(proj); c.save(); c.strokeStyle = proj >= s.goal ? '#2aa84a' : '#e8563a'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.ellipse(MINE, py, TW / 2, 9, 0, 0, 7); c.stroke(); c.restore(); }
      // the fund fox and its buckets of fees, from your tower and from the ghost's
      const bk = (x, v, a) => { c.save(); c.globalAlpha = a; c.fillStyle = '#8a8a9a'; c.strokeStyle = '#3a3a4a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 24, BASE - 40); c.lineTo(x + 24, BASE - 40); c.lineTo(x + 18, BASE); c.lineTo(x - 18, BASE); c.closePath(); c.fill(); c.stroke(); const n = Math.min(9, Math.round(v / 2)); for (let i = 0; i < n; i++) N6.flat(c, x + (i % 2 ? 4 : -4), BASE - 44 - i * 6, 16); c.restore(); };
      bk(186, s.bucket, 1); bk(338, s.gbucket, 0.5);
      SK.animal(c, 'fox', 188, BASE - 40 - Math.min(9, Math.round(s.bucket / 2)) * 6 - 8, 0.7, { t, pose: s.bucket > 6 ? 'cheer' : 'idle', expr: s.bucket > 6 ? 'laugh' : 'happy', facing: -1 });
      SK.tag(c, 'Fees', 186, BASE + 18, 18, '#fff6ea', 'rgba(190,40,40,0.85)');
      // the leaks: coin streams arcing into the bucket; plugged ones wear a cork
      const hiddenK = g.level >= 2 ? 0.35 : 1;
      s.leaks.forEach((l, i) => { if (!l.open) return; const [lx, ly] = leakPos(s, i, hm, MINE);
        if (l.plugged) { c.save(); c.fillStyle = '#c8945a'; c.strokeStyle = '#6a4a2a'; c.lineWidth = 2; c.beginPath(); c.ellipse(lx, ly, 10, 12, 0, 0, 7); c.fill(); c.stroke(); c.restore(); return; }
        c.save(); c.globalAlpha = l.hid ? hiddenK : 1; c.fillStyle = '#3a1640'; c.beginPath(); c.ellipse(lx, ly, 7, 9, 0, 0, 7); c.fill();
        const tx = 186, n = l.hid ? 3 : 7; for (let j = 0; j < n; j++) { const q = ((t * 1.6 + j / n) % 1), x = SK.lerp(lx, tx, q) + s.side[i] * Math.sin(q * Math.PI) * 30 * (s.side[i] > 0 ? 1 : -0.4), y = SK.lerp(ly, BASE - 50, q) - Math.sin(q * Math.PI) * 30; N6.coin(c, x, y, l.hid ? 5 : 7, ''); } c.restore();
        if (!l.hid) SK.tag(c, (l.f * 100) + '% fee', SK.clamp(lx + s.side[i] * 52, 52, 300), ly - 18, 18, '#fff6ea', 'rgba(190,40,40,0.88)'); });
      // ghost leaks (it never switches)
      s.leaks.forEach((l, i) => { if (!l.open) return; const [lx, ly] = leakPos(s, i, hg, GHOST); c.save(); c.globalAlpha = 0.4; for (let j = 0; j < 4; j++) { const q = ((t * 1.6 + j / 4) % 1); N6.coin(c, SK.lerp(lx, 338, q), SK.lerp(ly, BASE - 50, q) - Math.sin(q * Math.PI) * 26, 6, ''); } c.restore(); });
      SK.tag(c, 'You', MINE, BASE + 18, 18); SK.tag(c, 'High-fee twin', GHOST, BASE - hg - 22, 18, '#fff6ea', 'rgba(90,60,120,0.85)');
      // the years
      SK.tag(c, 'Year ' + Math.floor(s.year) + ' / ' + YEARS, 280, 136, 20);
      // the tray of corks
      c.save(); c.fillStyle = 'rgba(30,14,36,0.55)'; c.beginPath(); c.roundRect(TRAY.x - 70, TRAY.y - 24, 140, 40, 14); c.fill(); c.restore();
      if (!s.cork) { c.save(); c.fillStyle = '#c8945a'; c.strokeStyle = '#6a4a2a'; c.lineWidth = 2; c.beginPath(); c.ellipse(TRAY.x - 40, TRAY.y - 4, 12, 14, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
      N6.text(c, 'Low fee', TRAY.x + 18, TRAY.y - 4, 18, '#fff6ea');
      if (s.cork) { c.save(); c.fillStyle = '#c8945a'; c.strokeStyle = '#6a4a2a'; c.lineWidth = 2; c.beginPath(); c.ellipse(s.cork.x, s.cork.y, 13, 15, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
      SK.animal(c, 'rabbit', 32, 606, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      // guidance: drag a cork into the nearest open leak
      const li = s.leaks.findIndex(l => l.open && !l.plugged);
      if (li >= 0 && !g.done && !s.cork) { const [lx, ly] = leakPos(s, li, hm, MINE); SK.grab(c, g, TRAY.x - 40, TRAY.y - 4, 22); SK.target(c, g, lx, ly, 18); SK.arrow(c, g, TRAY.x - 40, TRAY.y - 4, lx, ly, { from: 26, to: 28 }); SK.demo(g, c, 'drag', [TRAY.x - 40, TRAY.y - 4], [lx, ly]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const B = s._a = s._a || { k: 0, n: 1.0 };
      if (B.p) { if (SK.bot.drag(g, synth, 'k' + B.k, B.t, B.p[0], B.p[1], 0.3)) { B.k++; B.p = null; B.n = g.t + 0.2; } return; }
      if (g.t < B.n) return; const li = s.leaks.findIndex(l => l.open && !l.plugged); if (li < 0) { if (!s.t0) { synth('down', 20, 300); synth('up', 20, 300); } return; }
      const [lx, ly] = leakPos(s, li, H(s.mine), MINE); B.p = [[TRAY.x - 40, TRAY.y - 4], [lx, ly]]; B.t = g.t;
    },
  });
})();
