// COLLECT THE CASH BEFORE PAYDAY! (business AC-03, profitable but out of cash) — the duck's office: a glass cash tank
// whose tap drains steadily to the staff's pay cups, a tall green "Profit" bar, and a desk where every new sale
// lands as a sealed envelope: an IOU, money the customer has promised but not yet paid. Each sale pushes Profit up at
// once, but adds no cash. An envelope turns gold when it is due: tap it to collect, and its coins pour into the tank.
// Keep the tank from running dry until the payday clock comes round. Ignore the envelopes and Profit towers while the
// tank empties and the staff's paychecks bounce like rubber balls. Level 2: customers pay later (envelopes ripen
// slower) and the drain is faster.
(() => {
  const TK = { x: 180, y0: 236, y1: 430, w: 116 }, PB = { x: 44, y0: 236, y1: 430 }, CLK = { x: 304, y: 252, r: 30 }, STAFF = [[262, 470], [298, 470], [334, 470]];
  const LV = [{ drain: 0.085, ripe: 0.6, every: 0.85, gain: 0.15, T: 9 }, { drain: 0.093, ripe: 0.9, every: 0.8, gain: 0.14, T: 9 }, { drain: 0.12, ripe: 1.3, every: 0.7, gain: 0.14, T: 9 }];
  const SPOTS = [[52, 512], [116, 548], [178, 506], [240, 548], [304, 516], [80, 586], [150, 588], [222, 590], [292, 584], [34, 560]];
  const WHO = ['rabbit', 'frog', 'penguin', 'hedgehog', 'bird'];
  function paintOffice(o) {
    const w = o.createLinearGradient(0, 0, 0, 470); w.addColorStop(0, '#f0b8a0'); w.addColorStop(1, '#f8e0c8'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 0; x < 360; x += 30) o.fillRect(x, 0, 14, 470);
    // window with a city
    o.fillStyle = '#8ac8e8'; o.beginPath(); o.roundRect(214, 140, 130, 70, 8); o.fill(); o.fillStyle = '#c8e4f4'; for (let i = 0; i < 6; i++) o.fillRect(220 + i * 20, 170 + (i % 3) * 10, 14, 40 - (i % 3) * 10); o.strokeStyle = '#fff6ea'; o.lineWidth = 5; o.strokeRect(214, 140, 130, 70);
    // the desk
    const d = o.createLinearGradient(0, 470, 0, 640); d.addColorStop(0, '#b87a48'); d.addColorStop(1, '#8a5430'); o.fillStyle = d; o.fillRect(0, 470, 360, 170);
    o.fillStyle = '#d89a60'; o.fillRect(0, 470, 360, 8); o.strokeStyle = 'rgba(60,30,10,0.18)'; o.lineWidth = 2; for (let y = 500; y < 640; y += 30) { o.beginPath(); o.moveTo(0, y); o.quadraticCurveTo(180, y + 8, 360, y); o.stroke(); }
    // the ledge where the staff wait, and the pipe from the tank's tap
    o.fillStyle = '#6a4a3a'; o.fillRect(236, 470, 124, 6);
    o.fillStyle = '#9a9aa8'; o.fillRect(TK.x + 20, TK.y1 + 4, 14, 22); o.fillRect(TK.x + 20, TK.y1 + 16, 80, 10);
  }
  function envelope(c, x, y, k, t, ph) { // k: 0 sealed (later) .. 1 due (gold)
    const due = k >= 1, wob = due ? Math.sin(t * 8 + ph) * 0.06 : 0; c.save(); c.translate(x, y); c.rotate(wob + Math.sin(ph) * 0.12);
    SK.shadow(c, 2, 16, 26, 5, 0.25);
    c.fillStyle = due ? '#ffd45a' : P.mix('#d8d0c8', '#f0e0a0', k * 0.6); c.strokeStyle = due ? '#a07010' : '#7a6a5a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-26, -16, 52, 32, 4); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-26, -16); c.lineTo(0, -2); c.lineTo(26, -16); c.stroke();
    c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = due ? '#7a4a00' : '#5a4a3a'; c.fillText('IOU', due ? 0 : -6, 7);
    if (!due) { c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(19, 7, 7, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(19, 7); c.lineTo(19, 2); c.moveTo(19, 7); c.lineTo(19 + Math.cos(k * 6.28 - 1.57) * 5, 7 + Math.sin(k * 6.28 - 1.57) * 5); c.stroke(); }
    c.restore();
  }
  function coin(c, x, y, r = 7) { c.fillStyle = '#b8860b'; c.beginPath(); c.arc(x, y + 1.2, r, 0, 7); c.fill(); c.fillStyle = '#f5c23a'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  MG.add({
    id: 'collectcash', stage: 'startups', cmd: 'COLLECT THE CASH BEFORE PAYDAY!', time: 7, mood: 'party', winText: 'Payday! Everyone got paid!', failText: 'Out of cash!', hold: 1.6,
    card: { title: 'Profit isn\'t cash', kind: 'Startups', ref: 'Cash flow',
      text: 'When you make a sale, it counts as profit straight away, even if the customer pays you weeks later. Until they pay, you only have a promise, called an IOU or an invoice.\n\nRent and pay leave the bank every week, in real money. A company can show a big profit and still run out of cash, if too much of its money is waiting in unpaid invoices.\n\nThat is why companies chase payments, and why "running out of cash" is how many profitable companies die.',
      note: 'A company can make a profit and still run out of cash if customers pay too slowly.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.lv = LV[L]; s.cash = 0.62; s.profit = 0.18; s.env = []; s.next = 0.6; s.n = 0; s.fly = []; s.order = SK.shuffled(g, SPOTS.map((p, i) => i)); s.started = 0; s.got = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      const e = SK.pick(s.env, x, y, 40); if (!e) return;
      if (e.k < 1) { e.shake = g.t; g.sfx('wrong', { vol: 0.4 }); return; }
      e.gone = true; s.got++; g.sfx('coin'); g.sfx('pop'); for (let i = 0; i < 5; i++) s.fly.push({ x: e.x, y: e.y, k: -i * 0.06, v: s.lv.gain / 5, ph: i });
      g.burst(e.x, e.y, ['#ffd45a', '#fff6ea'], 10, 140);
    },
    update(g, dt) {
      const s = g.s, lv = s.lv;
      for (const f of s.fly) { f.k += dt / 0.45; if (f.k >= 1 && !f.done) { f.done = true; s.cash = Math.min(1, s.cash + f.v); g.sfx('drip', { vol: 0.25 }); } }
      s.fly = s.fly.filter(f => !f.done);
      if (g.done) return;
      if (g.t > 0.4) s.cash -= lv.drain * dt; // rent and pay drain out every moment
      for (const e of s.env) if (!e.gone) e.k = Math.min(1, (g.t - e.t) / lv.ripe);
      s.env = s.env.filter(e => !e.gone);
      if (g.t >= s.next && s.env.length < 7) { // a new sale: profit now, cash later
        const used = s.env.map(e => e.i); let i = s.order[s.n % s.order.length]; let tries = 0; while (used.includes(i) && tries++ < 10) { s.n++; i = s.order[s.n % s.order.length]; }
        const [x, y] = SPOTS[i]; s.env.push({ i, x, y, t: g.t, k: 0, ph: s.n * 1.7 }); s.n++; s.next = g.t + lv.every; s.profit = Math.min(1, s.profit + 0.075); g.sfx('swoosh', { vol: 0.35 });
      }
      if (s.cash <= 0) { s.cash = 0; g.fail(); g.sfx('boing'); g.sfx('boing', { pitch: 1.3 }); return; }
      if (g.t >= lv.T) { g.win(); g.sfx('cheer'); g.burst(298, 440, ['#ffd45a', '#fff6ea', '#5ad07a'], 26, 200); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, lv = s.lv, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('n7office', paintOffice), 0, 0, 360, 640);
      // the payday clock
      const ck = SK.clamp(t / lv.T, 0, 1); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.arc(CLK.x, CLK.y, CLK.r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#ffd45a'; c.beginPath(); c.moveTo(CLK.x, CLK.y); c.arc(CLK.x, CLK.y, CLK.r - 4, -Math.PI / 2, -Math.PI / 2 + ck * Math.PI * 2); c.closePath(); c.fill();
      c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.moveTo(CLK.x, CLK.y); c.lineTo(CLK.x + Math.cos(-Math.PI / 2 + ck * 6.283) * (CLK.r - 6), CLK.y + Math.sin(-Math.PI / 2 + ck * 6.283) * (CLK.r - 6)); c.stroke();
      c.fillStyle = '#5ad07a'; c.beginPath(); c.arc(CLK.x, CLK.y - CLK.r + 5, 5, 0, 7); c.fill();
      SK.tag(c, 'Payday', CLK.x, CLK.y + CLK.r + 18, 18);
      // the profit bar: every sale counts at once
      const ph = (PB.y1 - PB.y0) * s.profit; c.fillStyle = 'rgba(30,14,36,0.35)'; c.beginPath(); c.roundRect(PB.x - 16, PB.y0, 32, PB.y1 - PB.y0, 10); c.fill(); c.fillStyle = '#5ad07a'; c.beginPath(); c.roundRect(PB.x - 12, PB.y1 - ph, 24, ph - 4, 8); c.fill();
      SK.tag(c, 'Profit', PB.x + 4, PB.y0 - 18, 18);
      // the cash tank, draining from its tap
      const cy = TK.y1 - (TK.y1 - TK.y0 - 6) * s.cash, low = s.cash < 0.25;
      c.save(); c.beginPath(); c.roundRect(TK.x - TK.w / 2, TK.y0, TK.w, TK.y1 - TK.y0, 16); c.fillStyle = 'rgba(220,240,255,0.4)'; c.fill(); c.clip();
      const cg = c.createLinearGradient(0, cy, 0, TK.y1); cg.addColorStop(0, '#ffe27a'); cg.addColorStop(1, '#c8901a'); c.fillStyle = cg; c.fillRect(TK.x - 70, cy + Math.sin(t * 3) * 2, 140, TK.y1 - cy + 10);
      c.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(TK.x - 42 + i * 17, cy + 5 + (i % 2) * 3, 5, 0, 7); c.fill(); } c.restore();
      c.strokeStyle = low && !won ? `rgba(232,64,58,${0.6 + 0.4 * Math.sin(t * 10)})` : 'rgba(255,255,255,0.95)'; c.lineWidth = low ? 5 : 3.5; c.beginPath(); c.roundRect(TK.x - TK.w / 2, TK.y0, TK.w, TK.y1 - TK.y0, 16); c.stroke();
      SK.tag(c, 'Cash', TK.x, TK.y0 - 18, 18);
      if (!g.done || won) { const q = (t * 3) % 1; for (let i = 0; i < 3; i++) coin(c, TK.x + 100, TK.y1 + 30 + ((q + i / 3) % 1) * 18, 4); } // the drip to the pay cups
      // the staff with their pay cups (and bouncing paychecks if the cash runs out)
      for (let i = 0; i < 3; i++) { const [sx, sy] = STAFF[i]; const bounce = lost ? Math.abs(Math.sin((t - g.doneAt) * 9 + i)) * 40 * Math.max(0, 1 - (t - g.doneAt) * 0.6) : 0;
        SK.animal(c, 'ant', sx, sy, 0.8, { t, phase: i, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : low ? 'wow' : 'happy', facing: -1 });
        if (lost) { c.save(); c.translate(sx - 4, sy - 70 - bounce); c.fillStyle = '#e8f0ff'; c.strokeStyle = '#3a5a9a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-14, -8, 28, 16, 3); c.fill(); c.stroke(); c.fillStyle = '#3a5a9a'; c.fillRect(-10, -2, 14, 3); c.restore(); } }
      // the duck, the boss
      SK.animal(c, 'duck', 108, 470, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : low ? 'wow' : 'happy', facing: 1 });
      // the IOU envelopes on the desk
      for (const e of s.env) { const sh = e.shake && t - e.shake < 0.3 ? Math.sin((t - e.shake) * 60) * 4 : 0; envelope(c, e.x + sh, e.y, e.k, t, e.ph); if (e.k >= 1) SK.glow(c, g, e.x, e.y, 30); }
      for (const f of s.fly) { if (f.k < 0) continue; const m = SK.easeInOut(f.k); coin(c, SK.lerp(f.x, TK.x - 20 + f.ph * 10, m), SK.lerp(f.y, TK.y0 + 10, m) - Math.sin(m * Math.PI) * 90, 8); }
      // guidance: tap the oldest envelope that is due
      const due = s.env.filter(e => e.k >= 1).sort((a, b) => a.t - b.t)[0];
      SK.demo(g, c, 'tap', due ? [due.x, due.y] : [0, 0], null, { never: !due, delay: 0.6 });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done) return; const B = s._n7 = s._n7 || { at: 0 }; if (g.t < B.at) return; const e = s.env.find(o => o.k >= 1); if (e) { synth('down', e.x, e.y); synth('up', e.x, e.y); B.at = g.t + 0.3; } },
  });
})();
