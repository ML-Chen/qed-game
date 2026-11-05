// SELL UNTIL THE PROFIT JAR FILLS! (business AC-29, break-even) — the beaver's pie stand. A customer waits at the
// counter; tap the bell to sell them a pie. They pay the price in coins: a fixed bit goes to the ingredients sack
// (what the pie cost to make) and the rest drops into a big bucket for this month's rent and pay (the fixed costs).
// Only once that bucket brims does every further sale spill down the spout into the profit jar. The month runs from
// the first sale: fill the profit jar to the line before rent day. Stop short and the beaver turns out its own pockets.
// Level 1: a pricier rent. Level 2: a lower price, so each sale leaves a smaller coin and it takes many more sales.
(() => {
  const BK = { x: 266, y0: 252, y1: 384, w: 108 }, JAR = { x: 266, y0: 452, y1: 560 }, CT = { x: 112, y: 448 }, BELL = { x: 88, y: 420 }, SACK = { x: 182, y: 540 };
  const GOODS = [{ k: 'pie', col: '#e8a050', fill: '#c8403a' }, { k: 'pie', col: '#e8a050', fill: '#6a3a8a' }, { k: 'cake', col: '#fff0f4', fill: '#f07aa0' }, { k: 'cake', col: '#fff6d0', fill: '#8a5a30' }, { k: 'pie', col: '#e8a050', fill: '#e8c040' }];
  const LV = [{ need: 7, per: 1, goal: 3, month: 7 }, { need: 9, per: 1, goal: 3, month: 7 }, { need: 8, per: 0.5, goal: 2.5, month: 8 }];
  const CUST = ['rabbit', 'frog', 'duck', 'penguin', 'hedgehog', 'bird', 'fox', 'turtle'];
  function paintStand(o) {
    const sky = o.createLinearGradient(0, 0, 0, 470); sky.addColorStop(0, '#ff9ac0'); sky.addColorStop(0.6, '#ffc890'); sky.addColorStop(1, '#fff2d0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 70, 230, 0.55); P.hills(o, 360, 420, 46, '#b8d870', '#80a848', { seed: 9 }); P.tree(o, 34, 430, 0.7, '#6a9a4a', 3);
    const gr = o.createLinearGradient(0, 430, 0, 640); gr.addColorStop(0, '#e0c8a0'); gr.addColorStop(1, '#c0a070'); o.fillStyle = gr; o.fillRect(0, 432, 360, 208);
    P.grassTufts(o, 360, 600, 616, 12, '#8a9a48', 2);
    // the stand: striped awning, posts, counter
    o.fillStyle = '#7a4a8a'; o.fillRect(54, 300, 7, 170); o.fillRect(196, 300, 7, 170);
    for (let i = 0; i < 5; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#5ab8a8'; o.beginPath(); o.moveTo(46 + i * 33, 290); o.lineTo(79 + i * 33, 290); o.lineTo(79 + i * 33, 310); o.quadraticCurveTo(62 + i * 33, 322, 46 + i * 33, 310); o.closePath(); o.fill(); }
    o.fillStyle = '#3a8878'; o.fillRect(42, 282, 170, 10);
    o.fillStyle = '#f8e0c0'; o.fillRect(46, 448, 164, 50); o.fillStyle = '#e0b890'; o.fillRect(46, 448, 164, 7);
    // the bucket on a stand, and a spout from its rim down to the profit jar
    o.fillStyle = '#6a4a3a'; o.fillRect(BK.x - 40, BK.y1, 8, 70); o.fillRect(BK.x + 32, BK.y1, 8, 70);
    o.fillStyle = '#9a9aa8'; o.beginPath(); o.moveTo(BK.x + BK.w / 2 - 4, BK.y0 + 6); o.lineTo(BK.x + BK.w / 2 + 26, BK.y0 + 18); o.lineTo(BK.x + BK.w / 2 + 26, JAR.y0 - 10); o.lineTo(BK.x + BK.w / 2 + 14, JAR.y0 - 10); o.lineTo(BK.x + BK.w / 2 + 14, BK.y0 + 24); o.closePath(); o.fill();
  }
  function coin(c, x, y, r = 9) { c.fillStyle = '#b8860b'; c.beginPath(); c.arc(x, y + 1.5, r, 0, 7); c.fill(); c.fillStyle = '#f5c23a'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = '#8a6010'; c.lineWidth = 1.2; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, 7); c.fill(); }
  function pie(c, x, y, G, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (G.k === 'pie') { c.fillStyle = '#a86a2a'; c.beginPath(); c.ellipse(0, 4, 20, 7, 0, 0, 7); c.fill(); c.fillStyle = G.col; c.beginPath(); c.ellipse(0, 0, 20, 8, 0, 0, 7); c.fill(); c.fillStyle = G.fill; c.beginPath(); c.ellipse(0, -1, 14, 5, 0, 0, 7); c.fill(); c.strokeStyle = G.col; c.lineWidth = 2.5; for (const d of [-6, 0, 6]) { c.beginPath(); c.moveTo(d - 4, -5); c.lineTo(d + 4, 3); c.stroke(); } }
    else { c.fillStyle = G.col; c.strokeStyle = '#8a5a3a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-16, -14, 32, 18, 4); c.fill(); c.stroke(); c.fillStyle = G.fill; c.beginPath(); c.roundRect(-16, -18, 32, 8, 4); c.fill(); c.fillStyle = '#e8403a'; c.beginPath(); c.arc(0, -21, 4, 0, 7); c.fill(); }
    c.restore();
  }
  MG.add({
    id: 'breakeven', stage: 'startups', cmd: 'SELL UNTIL THE PROFIT JAR FILLS!', time: 7, mood: 'party', winText: 'Profit!', failText: 'Rent day came first!', hold: 1.5,
    card: { title: 'Cover the costs, then profit', kind: 'Startups', ref: 'Break-even point',
      text: 'Each pie costs a little to make: flour, fruit and butter. The rest of the price is what that sale adds toward the costs that stay the same however much you sell, like rent and pay. Those are called fixed costs.\n\nThe first sales of the month only fill that bucket. The moment it brims is the break-even point. From then on, every sale is profit.\n\nA lower price leaves less from each sale, so you need many more sales to break even.',
      note: 'A business breaks even when sales have paid all its fixed costs; only the sales after that make a profit.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.lv = LV[L]; s.G = GOODS[s.v]; s.bucket = 0; s.profit = 0; s.month = -1; s.sales = 0; s.fly = []; s.cust = { x: CT.x - 40, k: CUST[s.v], t: 0 }; s.served = []; s.ring = -9;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (!(SK.dist(x, y, BELL.x, BELL.y) < 64 || (x < 220 && y > 330 && y < 600))) return;
      if (s.cust.x < CT.x - 50) return; // the next customer is still stepping up
      if (s.month < 0) s.month = g.t;
      s.sales++; s.ring = g.t; g.sfx('bell', { vol: 0.5, pitch: 1.2 }); g.sfx('coin', { vol: 0.5 });
      const per = s.lv.per; s.fly.push({ k: 0, v: per, x: CT.x + 10, y: CT.y - 40, cost: true, t: g.t });
      s.served.push({ k: s.cust.k, x: s.cust.x, t: g.t }); s.cust = { x: -20, k: CUST[(s.sales + s.v) % CUST.length], t: g.t };
    },
    update(g, dt) {
      const s = g.s, lv = s.lv;
      s.cust.x = Math.min(CT.x - 40, s.cust.x + 520 * dt);
      for (const p of s.served) p.x -= 240 * dt; s.served = s.served.filter(p => p.x > -40);
      for (const f of s.fly) {
        f.k += dt / 0.4;
        if (f.k >= 1 && !f.done) { f.done = true; if (s.bucket < lv.need) { s.bucket = Math.min(lv.need, s.bucket + f.v); g.sfx('drip', { vol: 0.4 }); if (s.bucket >= lv.need) { g.sfx('chime'); g.burst(BK.x, BK.y0, ['#5ad07a', '#ffe27a', '#fff6ea'], 18, 180); } } else { s.profit += f.v; g.sfx('ding', { vol: 0.5 }); } }
      }
      s.fly = s.fly.filter(f => !f.done);
      if (g.done) return;
      if (s.profit >= lv.goal - 1e-6) { g.win(); g.sfx('cheer'); g.burst(JAR.x, JAR.y0 + 20, ['#ffe27a', '#fff6ea', '#5ad07a'], 26, 220); return; }
      if (s.month >= 0 && g.t - s.month > lv.month) { g.fail(); g.sfx('wrong'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, lv = s.lv, won = g.result === 'win', lost = g.result === 'fail', full = s.bucket >= lv.need;
      c.drawImage(g.bake('n7stand', paintStand), 0, 0, 360, 640);
      // the month: a calendar strip that runs from the first sale to rent day
      const mk = s.month < 0 ? 0 : SK.clamp((t - s.month) / lv.month, 0, 1);
      c.fillStyle = 'rgba(30,14,36,0.65)'; c.beginPath(); c.roundRect(28, 160, 304, 30, 15); c.fill();
      c.fillStyle = mk > 0.8 ? '#e8503a' : '#ffd45a'; c.beginPath(); c.roundRect(34, 166, Math.max(18, 292 * mk), 18, 9); c.fill();
      for (let i = 1; i < 4; i++) { c.fillStyle = 'rgba(255,246,234,0.4)'; c.fillRect(34 + 292 * i / 4, 166, 2, 18); }
      SK.tag(c, 'Month', 64, 210, 18); SK.tag(c, 'Rent day', 286, 210, 18, '#fff6ea', 'rgba(170,40,50,0.85)');
      // the bucket for rent and pay
      const bf = s.bucket / lv.need, by = BK.y1 - (BK.y1 - BK.y0 - 8) * bf;
      c.save(); c.beginPath(); c.moveTo(BK.x - BK.w / 2, BK.y0); c.lineTo(BK.x + BK.w / 2, BK.y0); c.lineTo(BK.x + BK.w / 2 - 12, BK.y1); c.lineTo(BK.x - BK.w / 2 + 12, BK.y1); c.closePath();
      c.fillStyle = 'rgba(60,40,50,0.35)'; c.fill(); c.clip(); const cg = c.createLinearGradient(0, by, 0, BK.y1); cg.addColorStop(0, '#ffe27a'); cg.addColorStop(1, '#c8901a'); c.fillStyle = cg; c.fillRect(BK.x - 70, by, 140, BK.y1 - by + 4);
      c.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(BK.x - 40 + i * 13, by + 4 + (i % 2) * 3, 5, 0, 7); c.fill(); } c.restore();
      c.strokeStyle = full ? '#5ad07a' : '#e8503a'; c.lineWidth = 5; c.beginPath(); c.moveTo(BK.x - BK.w / 2, BK.y0); c.lineTo(BK.x - BK.w / 2 + 12, BK.y1); c.lineTo(BK.x + BK.w / 2 - 12, BK.y1); c.lineTo(BK.x + BK.w / 2, BK.y0); c.stroke();
      c.strokeStyle = '#5a5a68'; c.lineWidth = 3; c.beginPath(); c.ellipse(BK.x, BK.y0, BK.w / 2, 7, 0, 0, 7); c.stroke();
      SK.tag(c, 'Rent & pay', BK.x, BK.y0 + 34, 18, '#fff6ea', full ? 'rgba(40,150,70,0.92)' : 'rgba(170,40,50,0.85)');
      // the profit jar with its goal line
      const jf = SK.clamp(s.profit / lv.goal, 0, 1.2), jy = JAR.y1 - (JAR.y1 - JAR.y0 - 14) * jf * 0.85;
      c.save(); c.beginPath(); c.roundRect(JAR.x - 40, JAR.y0, 80, JAR.y1 - JAR.y0, 12); c.fillStyle = 'rgba(220,240,255,0.35)'; c.fill(); c.clip(); c.fillStyle = '#f5c23a'; c.fillRect(JAR.x - 40, jy, 80, JAR.y1 - jy); c.restore();
      c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.beginPath(); c.roundRect(JAR.x - 40, JAR.y0, 80, JAR.y1 - JAR.y0, 12); c.stroke();
      const gl = JAR.y1 - (JAR.y1 - JAR.y0 - 14) * 0.85; c.save(); c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(JAR.x - 50, gl); c.lineTo(JAR.x + 50, gl); c.stroke(); c.restore();
      SK.tag(c, 'Profit', JAR.x, JAR.y1 + 22, 18);
      if (full && s.fly.length) { c.fillStyle = '#f5c23a'; c.fillRect(BK.x + BK.w / 2 + 17, BK.y0 + 22, 6, JAR.y0 - BK.y0 - 30); }
      // the ingredients sack: the part of each price that paid for making the pie
      c.fillStyle = '#e8d8b0'; c.strokeStyle = '#8a6a3a'; c.lineWidth = 2; c.beginPath(); c.moveTo(SACK.x - 20, SACK.y + 22); c.quadraticCurveTo(SACK.x - 26, SACK.y - 6, SACK.x - 10, SACK.y - 18); c.lineTo(SACK.x + 10, SACK.y - 18); c.quadraticCurveTo(SACK.x + 26, SACK.y - 6, SACK.x + 20, SACK.y + 22); c.closePath(); c.fill(); c.stroke();
      SK.tag(c, 'Ingredients', SACK.x - 8, 514, 18);
      // the beaver behind the counter, the customer in front
      SK.animal(c, 'beaver', 166, 446, 1.0, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : t - s.ring < 0.25 ? 'point' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy',
        hold: lost ? (h => { h.fillStyle = '#e8e0d0'; h.fillRect(-8, -4, 16, 12); coin(h, 0, 14, 5); }) : null });
      c.fillStyle = '#f8e0c0'; c.fillRect(46, 448, 164, 50); c.fillStyle = '#e0b890'; c.fillRect(46, 448, 164, 7);
      pie(c, 138, 440, s.G, 1.1);
      for (const p of s.served) SK.animal(c, p.k, p.x, 560, 0.8, { t, facing: -1, pose: 'walk', expr: 'laugh', hold: h => pie(h, 0, -6, s.G, 0.6) });
      SK.animal(c, s.cust.k, s.cust.x, 560, 0.85, { t, phase: 1, pose: s.cust.x < CT.x - 50 ? 'walk' : 'idle', expr: 'happy' });
      // the coins of each sale: the cost bit to the flour sack, the rest to the bucket (or, once it brims, the profit jar)
      for (const f of s.fly) { const m = SK.easeInOut(f.k), tx = full ? BK.x + BK.w / 2 + 20 : BK.x, ty = full ? BK.y0 + 10 : BK.y0 + 4, r = f.v >= 1 ? 9 : 6.5;
        coin(c, SK.lerp(f.x, tx, m), SK.lerp(f.y, ty, m) - Math.sin(m * Math.PI) * 80, r);
        const q = SK.clamp((t - f.t) / 0.35, 0, 1); if (q < 1) coin(c, SK.lerp(f.x, SACK.x, q), SK.lerp(f.y, SACK.y - 20, q) - Math.sin(q * Math.PI) * 30, 6); }
      // the bell
      const pr = t - s.ring < 0.12 ? 1 : 0; c.fillStyle = '#5a3a1a'; c.fillRect(BELL.x - 18, BELL.y + 14, 36, 6); c.save(); c.translate(BELL.x, BELL.y + pr * 3); c.rotate(Math.sin((t - s.ring) * 40) * 0.2 * Math.max(0, 1 - (t - s.ring) * 3));
      c.fillStyle = '#f0c040'; c.strokeStyle = '#8a6010'; c.lineWidth = 2; c.beginPath(); c.moveTo(-16, 12); c.quadraticCurveTo(-16, -14, 0, -14); c.quadraticCurveTo(16, -14, 16, 12); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#8a6010'; c.beginPath(); c.arc(0, -16, 4, 0, 7); c.fill(); c.restore();
      if (!g.done) SK.tag(c, 'Sell', BELL.x, BELL.y - 36, 18);
      if (lost) { c.save(); c.fillStyle = '#e8e0d0'; c.strokeStyle = '#8a7a6a'; c.lineWidth = 2; for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(166 + sx * 22, 420, 9, 13, 0, 0, 7); c.fill(); c.stroke(); } c.restore(); }
      // guidance: tap the bell, over and over
      SK.glow(c, g, BELL.x, BELL.y, 34, undefined, { level: 2 });
      SK.demo(g, c, 'tap', [BELL.x + 2, BELL.y], null, { delay: 0.6, period: 0.6 });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done) return; const B = s._n7 = s._n7 || { at: 0.4 }; if (g.t >= B.at && s.cust.x >= CT.x - 50) { synth('down', BELL.x, BELL.y); synth('up', BELL.x, BELL.y); B.at = g.t + 0.2; } },
  });
})();
