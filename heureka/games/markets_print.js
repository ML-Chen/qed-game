// KEEP THE BREAD PRICE IN THE GREEN! (business MA-19, printing money and inflation) — a town square: the money press
// on the left with a big crank wheel and the town's pile of banknotes, the bakery shelf of loaves on the right with a
// price tag balloon, and a price gauge with a green band. The price is the town's money shared over its loaves. The
// beaver baker keeps bringing trays of new loaves: more bread and the same money, so the price sinks out of the band.
// Crank the press to print just enough new notes to bring it back. Print faster than the bread grows and the price
// balloons; crank wildly and a duck wheels in a barrow of cash for one loaf (fail). Three trays (four at level 2,
// with a narrower band). Each tray holds a different number of loaves, so each time the right amount differs.
(() => {
  const CR = { x: 92, y: 392, r: 44 }, PILE = { x: 92, y: 540 }, SH = { x: 270, y0: 318 }, GA = { x0: 64, x1: 318, y: 176 }, PMIN = 0.4, PMAX = 2.2, BURST = 2.2;
  const TRAYS = [[2, 3, 2, 3], [3, 2, 3, 2], [2, 2, 3, 3], [3, 3, 2, 2], [2, 3, 3, 2]];
  const STEP = 2.6; // radians of cranking per new banknote (about half a turn)
  function paintSquare(o) {
    const sky = o.createLinearGradient(0, 0, 0, 420); sky.addColorStop(0, '#e8a0c0'); sky.addColorStop(0.6, '#f8c8d8'); sky.addColorStop(1, '#fff0f0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 300, 236, 0.5); P.cloud(o, 40, 262, 0.4);
    P.house(o, 10, 300, 70, 60, '#e6c79a'); P.house(o, 286, 290, 64, 70, '#d8b0d8');
    const gr = o.createLinearGradient(0, 420, 0, 640); gr.addColorStop(0, '#d8b888'); gr.addColorStop(1, '#a88458'); o.fillStyle = gr; o.fillRect(0, 300, 360, 340);
    o.strokeStyle = 'rgba(90,60,30,0.2)'; o.lineWidth = 2; for (let y = 320; y < 640; y += 26) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); for (let x = (y / 26 % 2) * 20; x < 360; x += 40) { o.beginPath(); o.moveTo(x, y); o.lineTo(x, y + 26); o.stroke(); } }
    // the bakery shelf: three wooden tiers under an awning
    o.fillStyle = '#8a5a30'; o.fillRect(196, 300, 8, 216); o.fillRect(336, 300, 8, 216);
    for (const y of [376, 446, 516]) { o.fillStyle = '#a8703a'; o.fillRect(192, y, 156, 10); o.fillStyle = '#6a4020'; o.fillRect(192, y + 10, 156, 4); }
    for (let i = 0; i < 5; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#e8708a'; o.beginPath(); o.moveTo(188 + i * 33, 292); o.lineTo(221 + i * 33, 292); o.lineTo(221 + i * 33, 312); o.quadraticCurveTo(204 + i * 33, 324, 188 + i * 33, 312); o.closePath(); o.fill(); }
    o.fillStyle = '#a84060'; o.fillRect(184, 284, 168, 10);
    // the press body
    const pb = o.createLinearGradient(30, 0, 150, 0); pb.addColorStop(0, '#2a5a4a'); pb.addColorStop(0.5, '#4a8a6a'); pb.addColorStop(1, '#1e4a3a'); o.fillStyle = pb; o.strokeStyle = '#123028'; o.lineWidth = 3;
    o.beginPath(); o.roundRect(46, 330, 92, 150, 10); o.fill(); o.stroke(); o.fillStyle = '#123028'; o.fillRect(40, 474, 104, 14); o.fillStyle = '#c8a040'; o.fillRect(58, 448, 68, 6);
    o.fillStyle = '#0e2018'; o.beginPath(); o.roundRect(70, 460, 44, 8, 3); o.fill();
  }
  function bill(c, x, y, rot = 0, s = 1) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = '#7ac07a'; c.strokeStyle = '#2a6a3a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-16, -8, 32, 16, 2); c.fill(); c.stroke(); c.fillStyle = '#2a6a3a'; c.beginPath(); c.arc(0, 0, 4.5, 0, 7); c.fill(); c.fillStyle = '#a8e0a8'; c.fillRect(-13, -5, 4, 10); c.fillRect(9, -5, 4, 10); c.restore(); }
  function balloonTag(c, x, y, P0, t) { // the price tag swells with the price
    const sc = 0.6 + P0 * 0.55, hot = P0 > 1.3; c.save(); c.strokeStyle = '#6a4020'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, 292); c.quadraticCurveTo(x - 6, y + 30 * sc, x, y + 22 * sc); c.stroke();
    c.translate(x, y + Math.sin(t * 2) * 2); c.scale(sc, sc); c.rotate(Math.sin(t * 1.7) * 0.05);
    c.fillStyle = hot ? P.mix('#fff6ea', '#e84a3a', SK.clamp((P0 - 1.3) / 0.8, 0, 1)) : '#fff6ea'; c.strokeStyle = '#6a4020'; c.lineWidth = 2.5 / sc;
    c.beginPath(); c.moveTo(-26, -18); c.lineTo(18, -18); c.lineTo(32, 0); c.lineTo(18, 18); c.lineTo(-26, 18); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#6a4020'; c.beginPath(); c.arc(22, 0, 3.5, 0, 7); c.fill(); c.font = '900 24px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', -4, 1); c.restore();
  }
  const BAND = [[0.84, 1.2], [0.86, 1.17], [0.9, 1.13]];
  MG.add({
    id: 'printmoney', stage: 'markets', cmd: 'KEEP THE BREAD PRICE IN THE GREEN!', time: 8, mood: 'desert', winText: 'Prices stayed steady!', failText: 'A barrow of cash for one loaf!', hold: 1.6,
    card: { title: 'More money, same bread', kind: 'Economics', ref: 'Printing money and inflation',
      text: 'Prices depend on how much money is chasing how many goods. When the baker brought more bread and the money stayed the same, each loaf got cheaper. Printing a few new notes brought the price back.\n\nPrinting much faster than the bread grows does not make anyone richer. There is the same bread, so the extra money just bids the price up. That rise in prices is called inflation.\n\nWhen governments printed money far too fast, as in Germany in 1923 or Zimbabwe in 2008, people carried piles of cash to buy bread.',
      note: 'Printing money faster than the goods it can buy raises prices.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.trays = TRAYS[s.v].slice(0, L === 2 ? 4 : 3); s.ti = 0;
      s.G = 6; s.M = 6; s.ang = -Math.PI / 2; s.acc = 0; s.fly = []; s.inT = 0; s.hiT = 0; s.baker = null; s.band = BAND[L];
    },
    price(s) { return s.M / s.G; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (SK.dist(x, y, CR.x, CR.y) < CR.r + 34) { s.crank = Math.atan2(y - CR.y, x - CR.x); s.cdown = true; } },
    move(g, x, y) {
      const s = g.s; if (!s.cdown || g.done) return; if (SK.dist(x, y, CR.x, CR.y) < 6) return;
      const a = Math.atan2(y - CR.y, x - CR.x); let d = a - s.crank; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; s.crank = a;
      s.ang += Math.abs(d); s.acc += Math.abs(d);
      while (s.acc >= STEP) { s.acc -= STEP; s.M++; s.fly.push({ k: 0, n: s.M - 1 }); g.sfx('click'); g.sfx('swoosh', { vol: 0.35, pitch: 1.3 }); }
    },
    up(g) { g.s.cdown = false; },
    update(g, dt) {
      const s = g.s, L = s.L, P0 = this.price(s), [lo, hi] = s.band;
      for (const f of s.fly) f.k += dt / 0.4; s.fly = s.fly.filter(f => f.k < 1);
      if (g.done) return;
      if (P0 > BURST) { g.fail(); g.sfx('laugh'); g.shake(6, 0.3); return; }
      const inB = P0 >= lo && P0 <= hi;
      s.inT = inB ? s.inT + dt : 0; s.hiT = P0 > hi ? (s.hiT || 0) + dt : 0;
      if (s.baker) { const b = s.baker; b.x = Math.max(300, b.x - 300 * dt); if (b.x <= 300 && !b.put) { b.put = true; b.t = g.t; s.G += b.n; g.sfx('pop'); g.sfx('thud', { vol: 0.4 }); } if (b.put && g.t - b.t > 0.5) { if (b.counts) s.ti++; s.baker = null; s.inT = 0; s.hiT = 0; } return; }
      const more = s.ti < s.trays.length;
      if (!more && s.inT > 0.3) { g.win(); g.sfx('cheer'); g.burst(270, 400, ['#ffe27a', '#fff6ea', '#7ac07a'], 24, 200); return; }
      // the next tray of bread comes once the price is back in the green; if it went too high, more bread comes after a while
      if ((more && s.inT >= 0.55) || s.hiT >= 2.6) { s.baker = { x: 400, n: more ? s.trays[s.ti] : 2, put: false, counts: more }; g.sfx('bell', { vol: 0.5 }); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L, P0 = this.price(s), [lo, hi] = s.band, inB = P0 >= lo && P0 <= hi;
      c.drawImage(g.bake('n7print', paintSquare), 0, 0, 360, 640);
      // the price gauge
      const px = p => SK.lerp(GA.x0, GA.x1, SK.clamp((p - PMIN) / (PMAX - PMIN), 0, 1));
      c.fillStyle = 'rgba(30,14,36,0.65)'; c.beginPath(); c.roundRect(GA.x0 - 12, GA.y - 16, GA.x1 - GA.x0 + 24, 32, 16); c.fill();
      c.fillStyle = '#e87a5a'; c.fillRect(px(hi), GA.y - 8, GA.x1 - px(hi), 16); c.fillStyle = '#8ab0e0'; c.fillRect(GA.x0, GA.y - 8, px(lo) - GA.x0, 16);
      c.fillStyle = '#5ad07a'; c.fillRect(px(lo), GA.y - 8, px(hi) - px(lo), 16);
      const nx = px(P0); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(nx, GA.y + 4); c.lineTo(nx - 9, GA.y - 22); c.lineTo(nx + 9, GA.y - 22); c.closePath(); c.fill(); c.stroke();
      SK.tag(c, 'Bread price', 120, GA.y + 34, 18);
      if (!g.done && !inB) { const up = P0 < lo; c.save(); c.fillStyle = up ? '#5ad07a' : '#e84a3a'; c.translate(nx + (up ? 22 : -22), GA.y - 34); if (!up) c.scale(-1, 1); c.beginPath(); c.moveTo(-10, -7); c.lineTo(4, -7); c.lineTo(4, -13); c.lineTo(14, 0); c.lineTo(4, 13); c.lineTo(4, 7); c.lineTo(-10, 7); c.closePath(); c.fill(); c.restore(); }
      // the loaves on the shelf
      for (let i = 0; i < Math.min(15, s.G); i++) { const tier = Math.floor(i / 5), j = i % 5; P.loaf(c, 214 + j * 28, 366 + tier * 70, 1.0); }
      balloonTag(c, 222, 246, P0, t);
      // the baker bringing a tray
      if (s.baker) { const b = s.baker; SK.animal(c, 'beaver', b.x, 600, 0.9, { t, facing: -1, pose: b.put ? 'cheer' : 'carry', expr: 'happy', hold: b.put ? null : (h => { h.fillStyle = '#c8a070'; h.fillRect(-26, -4, 52, 6); for (let i = 0; i < b.n; i++) P.loaf(h, -16 + i * 16, -10, 0.7); }) }); }
      // the money pile and the press
      const nb = Math.min(24, s.M - s.fly.length); for (let i = 0; i < nb; i++) bill(c, PILE.x - 30 + (i % 3) * 30, PILE.y + 30 - Math.floor(i / 3) * 6, ((i * 37) % 10 - 5) * 0.02);
      for (const f of s.fly) { const m = SK.easeOut(f.k), i = Math.min(23, f.n); bill(c, SK.lerp(CR.x, PILE.x - 30 + (i % 3) * 30, m), SK.lerp(468, PILE.y + 30 - Math.floor(i / 3) * 6, m) - Math.sin(m * Math.PI) * 30, m * 6); }
      // the crank wheel
      c.save(); c.translate(CR.x, CR.y); c.strokeStyle = '#c8a040'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, CR.r - 6, 0, 7); c.stroke(); c.lineWidth = 4; for (let i = 0; i < 4; i++) { const a = s.ang + i * Math.PI / 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * (CR.r - 6), Math.sin(a) * (CR.r - 6)); c.stroke(); }
      c.fillStyle = '#8a6010'; c.beginPath(); c.arc(0, 0, 8, 0, 7); c.fill(); const hx = Math.cos(s.ang) * (CR.r - 6), hy = Math.sin(s.ang) * (CR.r - 6); SK.ball(c, hx, hy, 11, '#e8503a'); c.restore();
      SK.tag(c, 'Money press', CR.x, 316, 18); SK.tag(c, 'Bread', 270, 538, 18);
      // shoppers: happy when prices are steady, shocked when they balloon; the barrow of cash when they explode
      const shock = P0 > hi, big = lost;
      SK.animal(c, 'duck', 176, 604, 0.9, { t, phase: 1, pose: won ? 'cheer' : big ? 'carry' : shock ? 'idle' : 'idle', expr: won ? 'laugh' : shock || big ? 'wow' : 'happy',
        hold: big ? (h => { for (let i = 0; i < 9; i++) bill(h, -20 + (i % 3) * 20, -6 - Math.floor(i / 3) * 8, 0.1 * (i % 2), 0.8); }) : null });
      if (big) { c.fillStyle = '#7a4a2a'; c.beginPath(); c.moveTo(200, 590); c.lineTo(262, 590); c.lineTo(254, 612); c.lineTo(206, 612); c.closePath(); c.fill(); for (let i = 0; i < 12; i++) bill(c, 210 + (i % 4) * 14, 586 - Math.floor(i / 4) * 8, 0.2 * ((i % 3) - 1), 0.8); c.fillStyle = '#2a2430'; c.beginPath(); c.arc(230, 616, 7, 0, 7); c.fill(); }
      if (!g.done) SK.tag(c, 'Tray ' + Math.min(s.ti + 1, s.trays.length) + ' / ' + s.trays.length, 70, 600, 18);
      // guidance: crank while the price is below the green band
      const need = !g.done && !s.baker && P0 < lo;
      if (need) SK.glow(c, g, CR.x, CR.y, CR.r + 8);
      SK.demo(g, c, 'drag', [CR.x + 4, CR.y - CR.r + 6], [CR.x - 4, CR.y + CR.r - 6], { never: !need, delay: 0.6, period: 1.0 });
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._n7 = s._n7 || { n: 0 }; if (g.done) return;
      if (B.cur) { if (SK.bot.drag(g, synth, 'c' + B.n, B.cur, [CR.x + 4, CR.y - CR.r + 6], [CR.x - 4, CR.y + CR.r - 6], 0.25)) { B.n++; B.cur = null; } return; }
      if (!s.baker && this.price(s) < s.band[0]) B.cur = g.t + 0.15;
    },
  });
})();
