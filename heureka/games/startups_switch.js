// SWITCH TO THE BIGGER BUCKET! (business SV-36, a non-participating liquidation preference) — the company is being
// sold at auction: the owl auctioneer takes bids and the sale bag swells (or shrinks when a buyer backs out). The
// investor hangs in a gondola on a rail between two glass jars: "Money back" (what they put in, always the same) and
// "Slice" (their share of the sale price, which grows and shrinks with the bag). Tap the big switch to roll the
// investor over. When the gavel falls ("Going once... going twice... Sold!") the investor drops into the jar below:
// the bigger jar pays out in a shower of coins; the smaller one gets a kick, and the sale is run again.
// Level 0: two sales that climb past the crossing. Level 1: one sale drops back after a buyer leaves. Level 2: quicker gavel.
(() => {
  const RAIL = 300, JX = [100, 260], JT = 392, JB = 540, SW = { x: 180, y: 470 }, CH = 8;
  const INV = [{ k: 'rabbit', M: 6, f: 0.25 }, { k: 'hedgehog', M: 5, f: 0.2 }, { k: 'beaver', M: 7, f: 0.35 }, { k: 'penguin', M: 6, f: 0.3 }, { k: 'duck', M: 5, f: 0.25 }];
  const PLANS = [['A', 'A'], ['A', 'B'], ['B', 'A']];
  function paintHall(o) {
    const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#5a2a5a'); w.addColorStop(0.45, '#a8506a'); w.addColorStop(1, '#f0a070'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
    // velvet curtains and hanging lamps
    for (const s of [-1, 1]) { const x0 = s < 0 ? 0 : 360; o.fillStyle = '#8a1a3a'; o.beginPath(); o.moveTo(x0, 120); o.quadraticCurveTo(x0 - s * 60, 260, x0 - s * 22, 600); o.lineTo(x0, 600); o.closePath(); o.fill(); o.strokeStyle = 'rgba(0,0,0,0.18)'; o.lineWidth = 3; for (let i = 1; i < 3; i++) { o.beginPath(); o.moveTo(x0 - s * i * 12, 128); o.quadraticCurveTo(x0 - s * (40 + i * 6), 300, x0 - s * 14, 590); o.stroke(); } }
    o.fillStyle = '#5a0a2a'; o.fillRect(0, 116, 360, 14); for (let i = 0; i < 12; i++) { o.fillStyle = '#ffd45a'; o.beginPath(); o.arc(15 + i * 30, 132, 4, 0, 7); o.fill(); }
    const fl = o.createLinearGradient(0, 548, 0, 640); fl.addColorStop(0, '#8a4a2a'); fl.addColorStop(1, '#5a2a18'); o.fillStyle = fl; o.fillRect(0, 548, 360, 92);
    o.strokeStyle = 'rgba(255,220,160,0.15)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 36) { o.beginPath(); o.moveTo(x, 548); o.lineTo(x - 20, 640); o.stroke(); }
    // the podium
    o.fillStyle = '#6a3a1a'; o.beginPath(); o.moveTo(18, 266); o.lineTo(96, 266); o.lineTo(88, 300); o.lineTo(26, 300); o.closePath(); o.fill(); o.fillStyle = '#ffd45a'; o.fillRect(18, 262, 78, 6);
    // the rail between the jars
    o.strokeStyle = '#3a2a3a'; o.lineWidth = 6; o.beginPath(); o.moveTo(70, RAIL); o.lineTo(290, RAIL); o.stroke(); o.fillStyle = '#3a2a3a'; for (const x of [70, 290]) { o.fillRect(x - 4, RAIL - 4, 8, 260); }
  }
  function coin(c, x, y, w = 40, a = 1) { c.save(); c.globalAlpha *= a; c.fillStyle = '#b8860b'; c.beginPath(); c.ellipse(x, y + 3, w / 2, 6, 0, 0, 7); c.fill(); c.fillStyle = '#f5c23a'; c.beginPath(); c.ellipse(x, y, w / 2, 6, 0, 0, 7); c.fill(); c.strokeStyle = '#8a6010'; c.lineWidth = 1.2; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(x - 6, y - 1, 7, 2, 0, 0, 7); c.fill(); c.restore(); }
  function stack(c, x, n) { const whole = Math.floor(n); for (let i = 0; i < whole; i++) coin(c, x, JB - 12 - i * CH); const fr = n - whole; if (fr > 0.05) coin(c, x, JB - 12 - whole * CH, 40, fr); }
  function jar(c, x, glow, red) {
    c.save(); c.fillStyle = 'rgba(220,240,255,0.22)'; c.strokeStyle = glow ? '#5ad07a' : red ? '#e8403a' : 'rgba(255,255,255,0.8)'; c.lineWidth = glow || red ? 5 : 3;
    c.beginPath(); c.moveTo(x - 46, JT); c.lineTo(x - 46, JB - 10); c.quadraticCurveTo(x - 46, JB, x - 36, JB); c.lineTo(x + 36, JB); c.quadraticCurveTo(x + 46, JB, x + 46, JB - 10); c.lineTo(x + 46, JT); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(x - 38, JT + 10, 6, JB - JT - 30); c.restore();
  }
  // the sale bag: size shows the sale price
  function bag(c, x, y, S, t) {
    const r = 14 + Math.sqrt(S) * 5.2; c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.ellipse(0, r * 0.95, r * 0.9, 6, 0, 0, 7); c.fill();
    const bg = c.createRadialGradient(-r * 0.3, -r * 0.2, 2, 0, 0, r * 1.2); bg.addColorStop(0, '#f0d8a0'); bg.addColorStop(1, '#b08848'); c.fillStyle = bg; c.strokeStyle = '#6a4a20'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(-r * 0.35, -r * 0.8); c.quadraticCurveTo(-r * 1.05, -r * 0.3, -r * 0.9, r * 0.5); c.quadraticCurveTo(-r * 0.8, r * 0.98, 0, r * 0.98); c.quadraticCurveTo(r * 0.8, r * 0.98, r * 0.9, r * 0.5); c.quadraticCurveTo(r * 1.05, -r * 0.3, r * 0.35, -r * 0.8); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#8a6a30'; c.beginPath(); c.ellipse(0, -r * 0.85, r * 0.42, r * 0.14, 0, 0, 7); c.fill(); c.strokeStyle = '#e8503a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-r * 0.36, -r * 0.7); c.lineTo(r * 0.36, -r * 0.7); c.stroke();
    for (let i = 0; i < 3; i++) coin(c, -r * 0.3 + i * r * 0.3, -r * 0.92 - (i % 2) * 5, 16);
    c.font = `900 ${Math.round(r * 0.8)}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#6a4a20'; c.fillText('$', 0, r * 0.18); c.restore();
  }
  const CALL = [3.0, 2.5, 1.8], BID = [0.9, 0.8, 0.65];
  MG.add({
    id: 'switchpref', stage: 'startups', cmd: 'SWITCH TO THE BIGGER BUCKET!', time: 8, mood: 'party', winText: 'The investor took the bigger one!', failText: 'Smaller bucket!', hold: 1.6,
    card: { title: 'Money back, or a slice', kind: 'Startups', ref: 'Non-participating liquidation preference',
      text: 'Many investors buy "preferred" shares. A common kind gives them a choice when the company is sold: take back the money they put in, or swap for ordinary shares and take their slice of the sale price. They get one or the other, never both.\n\nIf the company sells cheaply, the money back is bigger. If it sells for a lot, the slice is bigger. So the investor waits to see the price and takes whichever is larger.\n\nWhatever the investor doesn\'t take goes to the founders and the other shareholders.',
      note: 'An investor with this kind of preference takes their money back or their slice of the sale, whichever is bigger.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.inv = INV[s.v]; s.cross = s.inv.M / s.inv.f;
      s.plan = L === 0 ? PLANS[0] : PLANS[1 + (s.v % 2)]; s.si = 0; s.side = 0; s.gx = JX[0]; this.newSale(g);
    },
    newSale(g) {
      const s = g.s, X = s.cross, type = s.plan[s.si], L = s.L, r = () => g.rand();
      const k = [{ t: 0, S: X * (0.42 + r() * 0.12) }], hi = X * (1.4 + r() * 0.35);
      if (type === 'A') { k.push({ S: X * (0.75 + r() * 0.12) }, { S: X * (1.08 + r() * 0.1) }, { S: hi }); }
      else { k.push({ S: X * (0.85 + r() * 0.1) }, { S: hi }, { S: X * (0.62 + r() * 0.1) }); } // B: a buyer backs out after due diligence
      let t = 0.9; for (let i = 1; i < k.length; i++) { k[i].t = t; t += BID[L] + r() * 0.3 + (type === 'B' && i === 2 ? 1.4 : 0); }
      s.keys = k; s.t0 = g.t; s.callAt = k[k.length - 1].t + 0.5; s.phase = 'bid'; s.bidN = 0; s.side = 0; s.res = null;
    },
    price(g) { const s = g.s, k = s.keys, tt = g.t - s.t0; let i = 0; while (i < k.length - 1 && k[i + 1].t <= tt) i++; if (i >= k.length - 1) return k[k.length - 1].S; const a = k[i], b = k[i + 1], m = SK.easeInOut(SK.clamp((tt - b.t + 0.35) / 0.35, 0, 1)); return SK.lerp(a.S, b.S, m); },
    bigger(g) { const s = g.s; return s.inv.f * this.price(g) > s.inv.M ? 1 : 0; },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || (s.phase !== 'bid' && s.phase !== 'call')) return;
      if (SK.dist(x, y, SW.x, SW.y) < 50 || (y > RAIL + 10 && y < JT && x > 60 && x < 300)) { s.side = 1 - s.side; g.sfx('click'); g.sfx('swoosh', { vol: 0.5 }); }
    },
    update(g, dt) {
      const s = g.s, L = s.L, tt = g.t - s.t0;
      s.gx += (JX[s.side] - s.gx) * Math.min(1, dt * 10);
      if (g.done) return;
      if (s.phase === 'bid') { const n = s.keys.filter(k => k.t && k.t <= tt + 0.35).length; if (n > s.bidN) { s.bidN = n; g.sfx(s.keys[n].S < s.keys[n - 1].S ? 'wrong' : 'coin', { vol: 0.6 }); s.paddle = g.t; s.paddleUp = s.keys[n].S >= s.keys[n - 1].S; } if (tt >= s.callAt) { s.phase = 'call'; s.ct = g.t; g.sfx('bell'); } }
      else if (s.phase === 'call') { const q = (g.t - s.ct) / CALL[L], n = Math.floor(q * 3); if (n !== s.callN && n < 3) { s.callN = n; if (n) g.sfx('bell'); }
        if (q >= 1) { s.callN = -1; s.phase = 'sold'; s.pt = g.t; g.sfx('thud'); g.shake(4, 0.2); const ok = s.side === this.bigger(g); s.res = ok;
          if (ok) { g.sfx('coin'); g.burst(JX[s.side], JT + 20, ['#f5c23a', '#ffe27a', '#fff6ea'], 22, 200); } else { g.sfx('boing'); g.sfx('laugh', { vol: 0.5 }); } } }
      else if (s.phase === 'sold' && g.t - s.pt > (s.res ? 0.6 : 1.3)) {
        if (s.res) { s.si++; if (s.si >= s.plan.length) { g.win(); g.sfx('cheer'); return; } }
        this.newSale(g); g.sfx('pop');
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L, S = this.price(g), slice = s.inv.f * S, big = this.bigger(g), live = s.phase === 'bid' || s.phase === 'call';
      c.drawImage(g.bake('n7auction', paintHall), 0, 0, 360, 640);
      // the auctioneer and the sale bag
      const hammer = s.phase === 'sold' ? Math.max(0, 1 - (t - s.pt) * 4) : s.phase === 'call' ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
      SK.animal(c, 'owl', 56, 268, 0.9, { t, pose: s.phase === 'call' ? 'point' : 'idle', expr: s.phase === 'sold' ? 'laugh' : 'happy', noShadow: true,
        hold: h => { h.save(); h.rotate(-1.2 * hammer); h.fillStyle = '#6a3a1a'; h.fillRect(-2, -26, 5, 28); h.fillStyle = '#8a4a2a'; h.beginPath(); h.roundRect(-10, -34, 22, 12, 4); h.fill(); h.restore(); } });
      bag(c, 196, 212, S, t);
      SK.tag(c, 'Sale price', 196, 160, 18);
      if (s.paddle && t - s.paddle < 0.6) { const q = (t - s.paddle) / 0.6, px = 316, py = 250 - Math.sin(q * Math.PI) * 30; c.fillStyle = '#6a3a1a'; c.fillRect(px - 2, py, 4, 30); c.fillStyle = s.paddleUp ? '#5ad07a' : '#e8403a'; c.beginPath(); c.arc(px, py, 14, 0, 7); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#fff6ea'; c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s.paddleUp ? '+' : '−', px, py + 1); }
      if (s.phase === 'call' || (s.phase === 'sold' && t - s.pt < 0.6)) { const n = s.phase === 'sold' ? 2 : Math.min(2, Math.floor((t - s.ct) / CALL[L] * 3)), txt = s.phase === 'sold' ? 'Sold!' : ['Going once...', 'Going twice...', 'Going twice...'][n];
        c.save(); c.font = '900 19px Nunito, system-ui, sans-serif'; const w = c.measureText(txt).width + 24; c.fillStyle = s.phase === 'sold' ? '#ffd45a' : '#fff'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(20, 196, w, 34, 14); c.fill(); c.stroke(); c.fillStyle = '#3a1640'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(txt, 32, 214); c.restore(); }
      // the jars: money back (always the same) and the investor's slice of the sale price
      const hint = L <= 1 && live;
      jar(c, JX[0], hint && !big || (s.phase === 'sold' && s.res && s.side === 0), s.phase === 'sold' && !s.res && s.side === 0);
      jar(c, JX[1], hint && big || (s.phase === 'sold' && s.res && s.side === 1), s.phase === 'sold' && !s.res && s.side === 1);
      stack(c, JX[0], s.inv.M); stack(c, JX[1], slice);
      // a dashed line across the slice jar at the money-back height: above it, the slice is bigger
      const ly = JB - 12 - (s.inv.M - 0.5) * CH; c.save(); c.strokeStyle = 'rgba(255,246,234,0.85)'; c.lineWidth = 2.5; c.setLineDash([7, 6]); c.beginPath(); c.moveTo(JX[0] + 46, ly); c.lineTo(JX[1] + 50, ly); c.stroke(); c.restore();
      SK.tag(c, 'Money back', JX[0], JB + 24, 18); SK.tag(c, 'Slice', JX[1], JB + 24, 18);
      // the investor in the gondola (dropped into the jar once sold)
      const drop = s.phase === 'sold' ? SK.easeOut((t - s.pt) / 0.3) : 0, iy = SK.lerp(RAIL + 78, JT + 40, drop), ok = s.phase === 'sold' && s.res;
      c.strokeStyle = '#3a2a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(s.gx - 18, RAIL + 4); c.lineTo(s.gx - 26, RAIL + 40); c.moveTo(s.gx + 18, RAIL + 4); c.lineTo(s.gx + 26, RAIL + 40); c.stroke();
      c.fillStyle = '#3a2a3a'; c.beginPath(); c.arc(s.gx - 14, RAIL, 7, 0, 7); c.arc(s.gx + 14, RAIL, 7, 0, 7); c.fill();
      const kick = s.phase === 'sold' && !s.res && t - s.pt > 0.35;
      SK.animal(c, s.inv.k, s.gx + (kick ? 14 : 0), iy, 0.85, { t, pose: won || ok ? 'cheer' : kick ? 'sad' : 'idle', expr: won || ok ? 'laugh' : kick ? 'sad' : live && s.side !== big ? 'think' : 'happy', facing: kick ? -1 : 1 });
      if (!drop) { c.fillStyle = '#c8845a'; c.strokeStyle = '#6a3a1a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(s.gx - 30, RAIL + 52, 60, 28, 6); c.fill(); c.stroke(); }
      SK.tag(c, 'Investor', s.gx, RAIL - 22, 18);
      // the big switch
      const sa = s.side ? 0.5 : -0.5; c.fillStyle = '#3a2a3a'; c.beginPath(); c.roundRect(SW.x - 28, SW.y + 6, 56, 22, 8); c.fill();
      c.strokeStyle = '#c8c8d4'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(SW.x, SW.y + 14); c.lineTo(SW.x + Math.sin(sa) * 44, SW.y + 14 - Math.cos(sa) * 44); c.stroke(); c.lineCap = 'butt';
      SK.ball(c, SW.x + Math.sin(sa) * 44, SW.y + 14 - Math.cos(sa) * 44, 12, '#e8403a');
      if (!g.done) SK.tag(c, 'Sale ' + Math.min(s.si + 1, s.plan.length) + ' / ' + s.plan.length, 180, 598, 18);
      // guidance: tap the switch only while the investor hangs over the smaller jar
      const wrong = live && s.side !== big;
      if (wrong) SK.glow(c, g, SW.x, SW.y - 10, 40);
      SK.demo(g, c, 'tap', [SW.x + 4, SW.y - 4], null, { never: !wrong, delay: 0.3 });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || (s.phase !== 'bid' && s.phase !== 'call')) return; const B = s._n7 = s._n7 || {};
      if (s.side !== this.bigger(g)) { if (B.want == null) B.want = g.t + 0.3; if (g.t >= B.want) { B.want = null; synth('down', SW.x, SW.y); synth('up', SW.x, SW.y); } } else B.want = null;
    },
  });
})();
