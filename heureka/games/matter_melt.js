// MELT IT! (chemistry CB MC-08) — a beaker of ice over a burner, a thermometer, and a penguin who wants a drink. Hold to
// light the burner. The ice's particles, packed in rows, jiggle faster as it warms; at 0 °C the thermometer stops
// rising while the particles break out of their rows one by one. Only when the last one is free does the temperature
// climb again. Let go while the thermometer has stalled and the penguin hops in and skates on the leftover ice.
// Level 2: boil it — a second stall at 100 °C, while particles escape as steam.
// Heat amounts keep the real ratios: warming ice 20 °C ≈ 10, melting ≈ 80, warming water 100 °C ≈ 100, boiling ≈ 540.
(() => {
  const B = { l: 96, r: 252, t: 262, b: 498 }, TH = { x: 300, t: 236, b: 492 }, BTN = [62, 584], PR = 9;
  const tY = T => SK.lerp(TH.b - 14, TH.t + 10, (T + 30) / 140);
  function paintLab(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#5a9ad0'); bg.addColorStop(0.6, '#a8d4ee'); bg.addColorStop(1, '#e8f4fa'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    // the bench
    o.fillStyle = '#c8a070'; o.fillRect(0, 556, 360, 84); o.fillStyle = '#a87a4a'; o.fillRect(0, 556, 360, 8); o.fillStyle = 'rgba(80,50,20,0.15)'; for (let x = 0; x < 360; x += 60) o.fillRect(x, 564, 2, 76);
    // the tripod and the burner
    o.strokeStyle = '#4a4a5a'; o.lineWidth = 5; o.beginPath(); o.moveTo(B.l + 4, 512); o.lineTo(B.l - 10, 558); o.moveTo(B.r - 4, 512); o.lineTo(B.r + 10, 558); o.stroke(); o.fillStyle = '#4a4a5a'; o.fillRect(B.l - 6, 506, B.r - B.l + 12, 8);
    o.fillStyle = '#6a6a7a'; o.beginPath(); o.roundRect(158, 534, 32, 22, 4); o.fill(); o.fillStyle = '#8a8a9a'; o.fillRect(166, 514, 16, 22);
    o.strokeStyle = '#3a3a4a'; o.lineWidth = 4; o.beginPath(); o.moveTo(158, 548); o.quadraticCurveTo(110, 560, 84, 584); o.stroke(); // hose to the button
    // the thermometer's glass tube
    o.fillStyle = 'rgba(255,255,255,0.85)'; o.strokeStyle = '#6a8aa8'; o.lineWidth = 2; o.beginPath(); o.roundRect(TH.x - 10, TH.t, 20, TH.b - TH.t, 10); o.fill(); o.stroke(); o.beginPath(); o.arc(TH.x, TH.b + 6, 16, 0, 7); o.fill(); o.stroke();
    for (let T = -20; T <= 100; T += 20) { const y = tY(T); o.strokeStyle = T === 0 || T === 100 ? '#2a5a8a' : '#8aa8c8'; o.lineWidth = T === 0 || T === 100 ? 3 : 1.5; o.beginPath(); o.moveTo(TH.x + 10, y); o.lineTo(TH.x + (T % 100 ? 18 : 24), y); o.stroke(); }
    o.fillStyle = '#5a7a9a'; o.fillRect(TH.x - 2, 210, 4, 28);
  }
  MG.add({
    id: 'matter_melt', stage: 'matter', cmd: 'MELT ALL THE ICE!', time: 7, mood: 'sea', winText: 'All the ice melted!', failText: 'Still icy!',
    card: { title: 'Melting takes heat', kind: 'Chemistry', ref: 'Latent heat and changes of state',
      text: 'In ice, the particles are held in neat rows. Heating makes them jiggle faster, so the ice gets warmer. At 0 °C the heat goes into breaking particles out of their rows instead, so the thermometer stops rising until all the ice has melted. Melting ice takes about as much heat as warming the water from 0 to 80 °C.\n\nBoiling works the same way. At 100 °C the heat goes into setting particles free as steam, and the temperature stays at 100 °C until the water has boiled away.',
      note: 'While ice melts or water boils, the heat breaks particles free, so the temperature stops rising.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.goals = [['melt', 'melt'], ['melt', 'melt'], ['melt', 'boil']][lv]; s.v = SK.variant(g, 4); s.starts = [[-20, -40], [-35, -15], [-25, -45], [-10, -30]][s.v]; s.round = 0;
      s.rate = lv >= 2 ? 75 : 40; s.heat = false; this.fill(g);
    },
    fill(g) { // a fresh beaker of ice for each round
      const s = g.s; s.boil = s.goals[s.round] === 'boil'; s.T0 = s.starts[s.round]; s.Q = 0; s.offT = -9; s.okT = 0; s.born = g.t;
      [s.cols, s.rows] = [[6, 5], [7, 4], [5, 6], [8, 3]][(s.v + s.round) % 4];
      s.cells = []; const x0 = (B.l + B.r) / 2 - (s.cols - 1) * PR, y0 = B.b - 14 - (s.rows - 1) * PR * 2;
      for (let r = 0; r < s.rows; r++) for (let c = 0; c < s.cols; c++) s.cells.push({ hx: x0 + c * PR * 2 + (r % 2 ? 4 : -4), hy: y0 + r * PR * 2, free: 0, gas: 0, ph: g.rand() * 6, vx: 0, vy: 0 });
      // the outside particles break free first
      const cx = (B.l + B.r) / 2, cy = y0 + (s.rows - 1) * PR; s.cells.forEach(q => { q.ord = -Math.hypot((q.hx - cx) * 0.8, q.hy - cy) + g.rand() * 8; }); const ord = s.cells.slice().sort((a, b) => a.ord - b.ord); ord.forEach((q, i) => { q.k = i / ord.length; });
      s.cells.forEach((q, i) => { q.x = q.hx; q.y = q.hy; q.gk = (i * 7 % 30) / 30; });
    },
    down(g) { const s = g.s; SK.holdStart(g); if (s.okT) return; s.heat = true; g.sfx('fire'); },
    up(g) { const s = g.s; SK.holdEnd(g); s.heat = false; s.offT = g.t; },
    update(g, dt) {
      const s = g.s; if (s.heat) s.Q += s.rate * dt;
      // where the heat has gone so far: warm the ice, melt it, warm the water, boil it
      const h1 = -s.T0 * 0.5, h2 = h1 + 80, h3 = h2 + 100; const Q = s.Q;
      s.T = Q < h1 ? s.T0 + Q / 0.5 : Q < h2 ? 0 : Q < h3 ? Q - h2 : 100; s.melt = SK.clamp((Q - h1) / 80, 0, 1); s.vap = SK.clamp((Q - h3) / 540, 0, 1);
      for (const q of s.cells) {
        if (!q.free && s.melt > q.k) { q.free = 1; q.vx = (g.rand() - 0.5) * 120; q.vy = -40 - g.rand() * 60; g.sfx('drip'); }
        if (q.free) { // a liquid particle wanders round the bottom of the beaker; a gas particle shoots up and out
          const sp = 80 + Math.max(0, s.T) * 2.2; q.vx += (g.rand() - 0.5) * sp * 6 * dt; q.vy += (g.rand() - 0.5) * sp * 6 * dt + 60 * dt;
          const m = Math.hypot(q.vx, q.vy); if (m > sp) { q.vx *= sp / m; q.vy *= sp / m; }
          if (!q.gas && s.vap > 0.05 + q.gk * 0.4) { q.gas = 1; q.vy = -260 - g.rand() * 120; g.sfx('bubble'); }
          q.x += q.vx * dt; q.y += q.vy * dt;
          if (!q.gas) { const top = B.b - 14 - (s.rows - 1) * PR * 2 - 6; if (q.x < B.l + 14) { q.x = B.l + 14; q.vx = Math.abs(q.vx); } if (q.x > B.r - 14) { q.x = B.r - 14; q.vx = -Math.abs(q.vx); } if (q.y > B.b - 12) { q.y = B.b - 12; q.vy = -Math.abs(q.vy); } if (q.y < top) { q.y = top; q.vy = Math.abs(q.vy); } }
          else q.vy -= 200 * dt;
        }
      }
      // the penguin wants ice-cold water: stop once the last ice has melted, before it warms up (level 2: stop while it boils)
      if (!g.done) {
        if (!s.okT && (s.boil ? s.vap >= 0.15 : s.melt >= 1)) { s.okT = g.t; s.heat = false; g.sfx('ding'); g.sfx('slurp'); } // done: the burner goes off until the next beaker
        if (s.okT && g.t - s.okT > 0.7) { if (s.round + 1 >= s.goals.length) { g.win(); g.sfx('cheer'); } else { s.round++; this.fill(g); g.sfx('pop'); } }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, T = s.T ?? s.T0, jig = 0.6 + Math.max(0, T + 30) * 0.06;
      c.drawImage(g.bake('melt_lab', paintLab), 0, 0, 360, 640);
      // the flame
      if (s.heat) { for (let i = 0; i < 3; i++) { const h = 38 - i * 10 + Math.sin(t * 20 + i) * 4; c.fillStyle = ['rgba(90,140,255,0.75)', 'rgba(140,200,255,0.8)', 'rgba(240,250,255,0.9)'][i]; c.beginPath(); c.moveTo(174 - 12 + i * 4, 514); c.quadraticCurveTo(174 - 10 + i * 3, 514 - h * 0.6, 174, 514 - h); c.quadraticCurveTo(174 + 10 - i * 3, 514 - h * 0.6, 174 + 12 - i * 4, 514); c.fill(); } }
      // the water level and the ice block around the particles still in rows
      const freeN = s.cells.filter(q => q.free && !q.gas).length, wy = B.b - 8 - freeN * 2.6;
      if (freeN) { c.fillStyle = `rgba(90,170,230,${0.25 + 0.2 * Math.min(1, freeN / 20)})`; c.beginPath(); c.roundRect(B.l + 4, wy, B.r - B.l - 8, B.b - wy - 2, [2, 2, 12, 12]); c.fill(); }
      const ice = s.cells.filter(q => !q.free);
      if (ice.length) { let x0 = 999, x1 = 0, y0 = 999, y1 = 0; for (const q of ice) { x0 = Math.min(x0, q.hx); x1 = Math.max(x1, q.hx); y0 = Math.min(y0, q.hy); y1 = Math.max(y1, q.hy); } c.fillStyle = 'rgba(220,240,255,0.7)'; c.strokeStyle = 'rgba(140,190,230,0.9)'; c.lineWidth = 2; c.beginPath(); c.roundRect(x0 - PR - 3, y0 - PR - 3, x1 - x0 + 2 * PR + 6, y1 - y0 + 2 * PR + 6, 8); c.fill(); c.stroke(); }
      // the particles: jiggling in their rows, then wandering, then (level 2) flying off as steam
      for (const q of s.cells) {
        let x = q.x, y = q.y; if (!q.free) { x = q.hx + Math.sin(t * 14 + q.ph) * jig; y = q.hy + Math.cos(t * 12 + q.ph * 1.3) * jig; }
        if (y < -20) continue; SK.ball(c, x, y, PR - 1, q.gas ? '#e8f4ff' : q.free ? '#4aa0e8' : '#8ad0f8', { lw: 1.2 });
      }
      if (s.vap > 0) { for (let i = 0; i < 8; i++) { const q = (t * 0.6 + i / 8) % 1; c.fillStyle = `rgba(255,255,255,${0.5 * (1 - q)})`; c.beginPath(); c.arc(B.l + 30 + i * 14 + Math.sin(q * 6 + i) * 8, B.t - q * 120, 10 + q * 16, 0, 7); c.fill(); } }
      // the beaker glass
      c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 4; c.beginPath(); c.moveTo(B.l - 6, B.t - 4); c.lineTo(B.l, B.t); c.lineTo(B.l, B.b - 10); c.quadraticCurveTo(B.l, B.b, B.l + 10, B.b); c.lineTo(B.r - 10, B.b); c.quadraticCurveTo(B.r, B.b, B.r, B.b - 10); c.lineTo(B.r, B.t); c.stroke();
      c.strokeStyle = 'rgba(80,120,160,0.45)'; c.lineWidth = 1.5; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(B.l + 8, B.t + 12, 6, 150);
      // the penguin's target on the thermometer: ice-cold (0 to 20 °C), or boiling (100 °C)
      // the thermometer's red column, and a tag while it is stuck at 0 °C (or 100 °C)
      const ty = tY(T); c.fillStyle = '#e8403a'; c.beginPath(); c.arc(TH.x, TH.b + 6, 11, 0, 7); c.fill(); c.fillRect(TH.x - 4, ty, 8, TH.b + 6 - ty);
      const stuck = (T === 0 && s.melt > 0 && s.melt < 1) || (T === 100 && s.vap > 0); if (stuck) { const pz = 1 + 0.12 * Math.sin(t * 10); c.save(); c.translate(TH.x - 8, ty - 28); c.scale(pz, pz); SK.tag(c, T === 0 ? 'still 0 °C' : 'still 100 °C', -34, 0, 18); c.restore(); c.strokeStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.sin(t * 10)})`; c.lineWidth = 3; c.beginPath(); c.arc(TH.x, ty, 9, 0, 7); c.stroke(); }
      for (let i = 0; i < s.goals.length; i++) { c.fillStyle = i < s.round || (i === s.round && s.okT) ? '#ffd45a' : 'rgba(255,255,255,0.5)'; c.beginPath(); c.arc(174 + (i - (s.goals.length - 1) / 2) * 22, 140, 7, 0, 7); c.fill(); }
      SK.tag(c, 'Hold to heat', BTN[0] + 14, BTN[1] - 46, 18); if (s.boil && !s.okT) { const by = tY(100); c.fillStyle = '#ffd45a'; c.beginPath(); c.moveTo(TH.x - 12, by); c.lineTo(TH.x - 24, by - 8); c.lineTo(TH.x - 24, by + 8); c.closePath(); c.fill(); SK.tag(c, 'Boil', TH.x - 50, by, 18, '#ffe9a0'); } if (s.melt < 1) SK.tag(c, 'Ice', (B.l + B.r) / 2, B.t - 22, 18);
      // the burner button
      const pr = s.heat ? 1 : 0; c.fillStyle = '#7a1a1a'; c.beginPath(); c.arc(BTN[0], BTN[1] + 4, 30, 0, 7); c.fill(); SK.ball(c, BTN[0], BTN[1] + pr * 3, 27, s.heat ? '#ff6a3a' : '#e8403a');
      // the penguin: waits with its cup, skates on the leftover ice if you stop, cheers with a drink
      const won = g.result === 'win', lost = g.result === 'fail', skate = !s.heat && s.melt > 0 && s.melt < 1 && t - s.offT > 0.5 || (lost && s.melt < 1);
      if (skate && ice.length) { let x0 = 999, x1 = 0, y0 = 999; for (const q of ice) { x0 = Math.min(x0, q.hx); x1 = Math.max(x1, q.hx); y0 = Math.min(y0, q.hy); } const k = 0.5 + 0.5 * Math.sin(t * 2.4); SK.animal(c, 'penguin', SK.lerp(x0, x1, k), y0 - PR - 2, 0.5, { t, pose: 'balance', expr: 'laugh', facing: Math.cos(t * 2.4) > 0 ? 1 : -1 }); }
      else SK.animal(c, 'penguin', 312, 614, 0.72, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : s.heat ? 'wow' : 'happy', facing: -1 });
      if (!s.heat) SK.glow(c, g, BTN[0], BTN[1], 32);
      SK.demo(g, c, 'hold', BTN, null, { never: s.heat, period: s.boil ? 5 : 3.4 }); // the hand holds long enough to melt (or boil) a whole beaker
    },
    // the bot: hold the burner on until it is done
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1) return; if (!s.heat && !s.okT && g.t - s.born > 0.4 && s._botR !== s.round) { s._botR = s.round; synth('down', BTN[0], BTN[1]); return; }
      if (s.okT && s._botUp !== s.round) { s._botUp = s.round; synth('up', BTN[0], BTN[1]); }
    },
  });
})();
