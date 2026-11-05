// PRICE IT JUST UNDER THE GOLD! (business SV-12, value-based pricing) — the owl sells a time-saving gadget. A big
// balance stands on the counter: on the left pan, the customer's gold (what the gadget is worth to them: the time it
// saves them); on the right pan, your price, a stack of coins with a tag on top that you drag up and down. The beam
// tips toward the heavier side. Let go to offer that price: at or under their gold, they buy and the price minus your
// cost drops into the profit jar; over it, the beam tips your way and they walk off. Price at your cost (the dashed
// line) and they buy happily but the jar hardly moves. Each customer values it differently, so each price differs.
// Fill the jar to the line. Level 2: a narrower sweet spot and a fuller jar.
(() => {
  const PIV = { x: 180, y: 262 }, ARM = 86, PAN = 150, CH = 10, JAR = { x: 296, y0: 506, y1: 600 }, HAND = 274;
  const VALS = [[9, 6, 11, 7], [7, 11, 6, 10], [10, 7, 9, 12], [6, 10, 8, 11], [11, 8, 6, 9]];
  const CUST = ['rabbit', 'frog', 'penguin', 'hedgehog', 'duck', 'fox', 'bird', 'beaver'];
  const COST = 2, LV = [{ band: 1.6, goal: 14 }, { band: 1.4, goal: 15 }, { band: 1.0, goal: 19 }];
  function paintShop(o) {
    const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#3a2a5a'); w.addColorStop(0.5, '#6a4a8a'); w.addColorStop(1, '#c88a9a'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
    for (let i = 0; i < 40; i++) { const x = (i * 97) % 360, y = 130 + (i * 53) % 150; o.fillStyle = `rgba(255,240,200,${0.2 + (i % 3) * 0.15})`; o.beginPath(); o.arc(x, y, 1.2 + (i % 2), 0, 7); o.fill(); }
    // shelves of gadgets behind
    for (const y of [190, 236]) { o.fillStyle = '#4a2a3a'; o.fillRect(0, y, 70, 6); o.fillRect(290, y, 70, 6); for (let i = 0; i < 3; i++) { o.fillStyle = ['#5ab8e8', '#f0c040', '#e8708a'][i]; o.beginPath(); o.roundRect(6 + i * 22, y - 18, 16, 18, 4); o.fill(); o.beginPath(); o.roundRect(296 + i * 22, y - 18, 16, 18, 4); o.fill(); } }
    // the counter
    const ct = o.createLinearGradient(0, 430, 0, 640); ct.addColorStop(0, '#a8703a'); ct.addColorStop(1, '#6a4020'); o.fillStyle = ct; o.fillRect(0, 440, 360, 200); o.fillStyle = '#d89a60'; o.fillRect(0, 432, 360, 12);
    // the balance's post
    o.fillStyle = '#c8a040'; o.beginPath(); o.moveTo(PIV.x - 30, 432); o.lineTo(PIV.x + 30, 432); o.lineTo(PIV.x + 8, PIV.y + 10); o.lineTo(PIV.x - 8, PIV.y + 10); o.closePath(); o.fill(); o.strokeStyle = '#8a6010'; o.lineWidth = 2; o.stroke();
  }
  function coin(c, x, y, gold, w = 44, a = 1) { c.save(); c.globalAlpha *= a; c.fillStyle = gold ? '#b8860b' : '#7a7a88'; c.beginPath(); c.ellipse(x, y + 3, w / 2, 5.5, 0, 0, 7); c.fill(); c.fillStyle = gold ? '#f5c23a' : '#c8c8d4'; c.beginPath(); c.ellipse(x, y, w / 2, 5.5, 0, 0, 7); c.fill(); c.strokeStyle = gold ? '#8a6010' : '#5a5a68'; c.lineWidth = 1.2; c.stroke(); c.restore(); }
  function stack(c, x, base, n, gold) { const whole = Math.floor(n); for (let i = 0; i < whole; i++) coin(c, x, base - 6 - i * CH, gold); const fr = n - whole; if (fr > 0.04) coin(c, x, base - 6 - whole * CH, gold, 44, fr); }
  MG.add({
    id: 'priceit', stage: 'startups', cmd: 'PRICE IT JUST UNDER THE GOLD!', time: 8, mood: 'party', winText: 'Fair price, full jar!', failText: 'The jar is short!', hold: 1.6,
    card: { title: 'Price by the value', kind: 'Startups', ref: 'Value-based pricing',
      text: 'The gadget cost you a little to make: the dashed line. But each customer would pay more, because it saves them time. Their gold shows what it is worth to them.\n\nIf you price at your cost, they buy happily, but you earn almost nothing and can\'t grow. If you price above their gold, it isn\'t worth it to them, and they walk away.\n\nA good price sits just under what the customer gets from it. Different customers get different value, so smart companies offer different plans.',
      note: 'Set your price by what your product is worth to the customer, not by what it costs you to make.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.lv = LV[L]; s.vals = VALS[s.v]; s.ci = 0; s.price = COST; s.jar = 0; s.phase = 'set'; s.pt = 0; s.tilt = 0; s.fly = []; s.walk = 0;
    },
    val(s) { return s.vals[s.ci % s.vals.length]; },
    tiltTo(s) { return SK.clamp((this.val(s) - s.price) * 0.05, -0.32, 0.32); }, // positive: the gold side is heavier
    panY(s, side) { return PIV.y + PAN + (side ? -1 : 1) * Math.sin(s.tilt) * ARM; },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'set') return;
      const top = this.panY(s, 1) - 6 - s.price * CH; if (Math.abs(x - (PIV.x + ARM)) < 60 && y > top - 50 && y < this.panY(s, 1) + 20) { s.drag = { y0: y, p0: s.price }; SK.touched(g); g.sfx('tap'); }
    },
    move(g, x, y) { const s = g.s; if (!s.drag) return; const p = SK.clamp(s.drag.p0 + (s.drag.y0 - y) / CH, COST, 14); if (Math.floor(p) !== Math.floor(s.price)) g.sfx('click', { vol: 0.3 }); s.price = p; },
    up(g) {
      const s = g.s; if (!s.drag) return; s.drag = null; if (g.done) return;
      const v = this.val(s); s.phase = s.price <= v + 0.05 ? 'buy' : 'no'; s.pt = g.t;
      if (s.phase === 'buy') { const gain = s.price - COST; s.gain = gain; for (let i = 0; i < Math.max(1, Math.round(gain)); i++) s.fly.push({ k: -i * 0.07, v: gain / Math.max(1, Math.round(gain)) }); g.sfx('coin'); g.sfx('ding', { vol: 0.5 }); }
      else { g.sfx('wrong'); g.sfx('laugh', { vol: 0.4 }); }
    },
    update(g, dt) {
      const s = g.s, lv = s.lv;
      s.tilt += (this.tiltTo(s) - s.tilt) * Math.min(1, dt * 8);
      for (const f of s.fly) { f.k += dt / 0.5; if (f.k >= 1 && !f.done) { f.done = true; s.jar += f.v; g.sfx('drip', { vol: 0.3 }); } }
      s.fly = s.fly.filter(f => !f.done);
      if (g.done) return;
      if (s.jar >= lv.goal - 1e-6 && !s.fly.length) { g.win(); g.sfx('cheer'); g.burst(JAR.x, JAR.y0, ['#ffe27a', '#fff6ea', '#5ad07a'], 24, 200); return; }
      if ((s.phase === 'buy' || s.phase === 'no') && g.t - s.pt > 0.8 && !s.fly.length) { s.ci++; s.phase = 'set'; s.price = COST; s.pt = g.t; g.sfx('pop'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, lv = s.lv, won = g.result === 'win', lost = g.result === 'fail', v = this.val(s);
      c.drawImage(g.bake('n7price', paintShop), 0, 0, 360, 640);
      // the customer (walking in, then buying or walking off)
      const kind = CUST[(s.ci + s.v) % CUST.length], since = t - s.pt, enter = s.phase === 'set' ? SK.easeOut(Math.min(1, since / 0.4)) : 1;
      const cx = s.phase === 'no' ? 24 - since * 160 : s.phase === 'buy' && since > 0.5 ? 24 - (since - 0.5) * 160 : SK.lerp(-40, 24, enter);
      SK.animal(c, kind, cx, 432, 0.85, { t, pose: s.phase === 'buy' ? 'cheer' : s.phase === 'no' ? 'walk' : 'idle', expr: s.phase === 'buy' ? 'laugh' : s.phase === 'no' ? 'sad' : 'think', facing: s.phase === 'no' || (s.phase === 'buy' && since > 0.5) ? -1 : 1 });
      // the balance: beam, chains, pans
      const ly = this.panY(s, 0), ry = this.panY(s, 1), lx = PIV.x - Math.cos(s.tilt) * ARM, rx = PIV.x + Math.cos(s.tilt) * ARM, bly = PIV.y + Math.sin(s.tilt) * ARM, bry = PIV.y - Math.sin(s.tilt) * ARM;
      c.strokeStyle = '#c8a040'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(lx, bly); c.lineTo(rx, bry); c.stroke(); c.lineCap = 'butt';
      c.fillStyle = '#8a6010'; c.beginPath(); c.arc(PIV.x, PIV.y, 9, 0, 7); c.fill();
      for (const [x0, y0, y1] of [[lx, bly, ly], [rx, bry, ry]]) { c.strokeStyle = '#8a8a98'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 - 40, y1 - 4); c.moveTo(x0, y0); c.lineTo(x0 + 40, y1 - 4); c.stroke();
        c.fillStyle = '#c8a040'; c.strokeStyle = '#8a6010'; c.lineWidth = 2; c.beginPath(); c.ellipse(x0, y1, 46, 9, 0, 0, Math.PI); c.closePath(); c.fill(); c.stroke(); }
      // the customer's gold (the value to them) and your price
      if (s.phase !== 'no' || since < 0.3) stack(c, lx, ly, v, true);
      stack(c, rx, ry, s.price, false);
      const cy = ry - 6 - COST * CH; c.save(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(rx - 56, cy + 4); c.lineTo(rx + 56, cy + 4); c.stroke(); c.restore();
      SK.tag(c, 'Cost', Math.min(328, rx + 56), cy + 4, 18);
      // the price tag on top of your stack
      const ty = ry - 6 - s.price * CH - 20, over = s.price > v + 0.05, good = !over && s.price >= v - lv.band;
      c.save(); c.translate(rx, ty); c.fillStyle = over ? '#e8503a' : good && g.level <= 1 ? '#5ad07a' : '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(-30, -14); c.lineTo(22, -14); c.lineTo(34, 0); c.lineTo(22, 14); c.lineTo(-30, 14); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#3a1640'; c.beginPath(); c.arc(24, 0, 3, 0, 7); c.fill();
      c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Price', -4, 1); c.restore();
      SK.tag(c, 'Their gold', lx, ly + 34, 18); SK.tag(c, 'Your price', rx, ry + 34, 18);
      // the profit jar
      const jf = SK.clamp(s.jar / lv.goal, 0, 1.15), jy = JAR.y1 - (JAR.y1 - JAR.y0 - 14) * jf * 0.85;
      c.save(); c.beginPath(); c.roundRect(JAR.x - 38, JAR.y0, 76, JAR.y1 - JAR.y0, 12); c.fillStyle = 'rgba(220,240,255,0.3)'; c.fill(); c.clip(); c.fillStyle = '#f5c23a'; c.fillRect(JAR.x - 40, jy, 80, JAR.y1 - jy); c.restore();
      c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.beginPath(); c.roundRect(JAR.x - 38, JAR.y0, 76, JAR.y1 - JAR.y0, 12); c.stroke();
      const gl = JAR.y1 - (JAR.y1 - JAR.y0 - 14) * 0.85; c.save(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(JAR.x - 48, gl); c.lineTo(JAR.x + 48, gl); c.stroke(); c.restore();
      SK.tag(c, 'Profit', JAR.x, JAR.y0 - 18, 18);
      for (const f of s.fly) { if (f.k < 0) continue; const m = SK.easeInOut(f.k); coin(c, SK.lerp(rx, JAR.x, m), SK.lerp(ry - 20, JAR.y0 + 10, m) - Math.sin(m * Math.PI) * 60, true, 26); }
      // the owl seller
      SK.animal(c, 'owl', 150, 600, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : s.phase === 'no' ? 'idle' : 'idle', expr: won ? 'laugh' : lost || s.phase === 'no' ? 'sad' : s.phase === 'buy' ? 'laugh' : 'happy' });
      if (s.phase === 'no' && since < 0.8) SK.tag(c, 'Too much!', 96, 330, 20, '#fff6ea', 'rgba(170,40,50,0.92)');
      if (s.phase === 'buy' && since < 0.8) SK.tag(c, s.gain < 2 ? 'Cheap!' : 'Deal!', 90, 330, 20, '#fff6ea', s.gain < 2 ? 'rgba(120,90,40,0.92)' : 'rgba(40,150,70,0.92)');
      // guidance: drag the tag up to just under the top of their gold
      if (s.phase === 'set' && !g.done && !s.drag) {
        const want = v - Math.min(0.5, lv.band * 0.4), wy = ry - 6 - want * CH - 20;
        SK.grab(c, g, rx, ty, 30); SK.target(c, g, rx, wy, 0, { w: 84, h: 34 }); SK.arrow(c, g, rx + 52, ty, rx + 52, wy, { from: 4, to: 14 });
        SK.demo(g, c, 'drag', [rx, ty], [rx, wy], { delay: 0.7 });
      }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'set' || g.t - s.pt < 0.45) return; const B = s._n7 = s._n7 || {};
      if (B.ci !== s.ci) { B.ci = s.ci; const ry = this.panY(s, 1), ty = ry - 6 - s.price * CH - 20, want = this.val(s) - 0.4; B.a = [PIV.x + ARM, ty]; B.b = [PIV.x + ARM, ty - (want - s.price) * CH]; B.at = g.t; }
      SK.bot.drag(g, synth, 'p' + s.ci, B.at, B.a, B.b, 0.45);
    },
  });
})();
