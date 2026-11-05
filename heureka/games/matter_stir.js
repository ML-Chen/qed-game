// STIR! (chemistry CB EL-15) — a sunny kitchen: a tall glass of water with a heap of sugar at the bottom, and a fox
// waiting for a sweet drink. Circle a finger in the glass to stir. The water swirls, lifts the grains, and the sugar
// shrinks away to nothing. Then a magnifying glass slides over: the sugar is still there, as tiny bits spread among the
// water's bits. From level 1 some sand is mixed in: it swirls up and settles straight back, because sand doesn't
// dissolve. Level 2: the water starts icy cold, and the sugar only vanishes quickly once the warmer heats it.
(() => {
  const G = { cx: 180, l: 96, r: 264, top: 236, bot: 520 }, HW = (G.r - G.l) / 2 - 12, WTOP = 262, MID = [180, 400];
  function paintKitchen(o) {
    const wall = o.createLinearGradient(0, 0, 0, 500); wall.addColorStop(0, '#bfe8d8'); wall.addColorStop(1, '#e8f6e0'); o.fillStyle = wall; o.fillRect(0, 0, 360, 520);
    o.strokeStyle = 'rgba(80,150,130,0.18)'; o.lineWidth = 1.5; for (let y = 300; y < 520; y += 28) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); for (let x = (y / 28 % 2) * 18; x < 360; x += 36) { o.beginPath(); o.moveTo(x, y); o.lineTo(x, y + 28); o.stroke(); } }
    // the window with the sun and a pot plant
    o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(16, 124, 110, 130, 10); o.fill(); const sk = o.createLinearGradient(0, 132, 0, 246); sk.addColorStop(0, '#7ec8f0'); sk.addColorStop(1, '#d8f2ff'); o.fillStyle = sk; o.fillRect(24, 132, 94, 114);
    o.fillStyle = '#ffe27a'; o.beginPath(); o.arc(96, 156, 15, 0, 7); o.fill(); P.cloud(o, 50, 196, 0.35); o.fillStyle = '#fff6ea'; o.fillRect(68, 132, 5, 114); o.fillRect(24, 186, 94, 5);
    o.fillStyle = '#d8784a'; o.beginPath(); o.moveTo(300, 250); o.lineTo(340, 250); o.lineTo(334, 290); o.lineTo(306, 290); o.closePath(); o.fill();
    o.fillStyle = '#5aa84a'; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32; o.beginPath(); o.ellipse(320 + Math.cos(a) * 22, 246 + Math.sin(a) * 26, 7, 18, a + Math.PI / 2, 0, 7); o.fill(); }
    o.fillStyle = '#c8a070'; o.fillRect(282, 290, 78, 8);
    // the table with a checked cloth
    o.fillStyle = '#fff6ea'; o.fillRect(0, 520, 360, 120); o.fillStyle = 'rgba(220,70,80,0.75)';
    for (let y = 520; y < 640; y += 20) for (let x = 0; x < 360; x += 20) if (((x + y) / 20) % 2 < 1) o.fillRect(x, y, 20, 20);
    o.fillStyle = 'rgba(220,70,80,0.35)'; for (let y = 520; y < 640; y += 20) o.fillRect(0, y, 360, 10);
    o.fillStyle = 'rgba(40,20,30,0.12)'; o.fillRect(0, 520, 360, 6);
  }
  function makeGrain(g, kind) { return { kind, a: g.rand() * Math.PI * 2, r: Math.pow(g.rand(), 0.8), h: 0, lift: 0.15 + g.rand() * 0.75, size: 1, sp: 0.7 + g.rand() * 0.6, gone: false }; }
  MG.add({
    id: 'matter_stir', stage: 'matter', cmd: 'STIR THE SUGAR AWAY!', time: 7, mood: 'sea', winText: 'Dissolved!', failText: 'Gritty!', hold: 1.6,
    card: { title: 'Dissolving', kind: 'Chemistry', ref: 'Solutions',
      text: 'Stirring sugar into water makes it disappear, but the sugar is still there. Water knocks tiny bits off each grain, and the bits spread out between the bits of water. They are far too small to see, even with a magnifying glass, so the drink looks clear but tastes sweet. This mix is called a solution.\n\nSand does not dissolve in water. Stir it and it swirls round, then sinks back to the bottom. Sugar dissolves faster in warm water than in cold, because the bits move faster.',
      note: 'When sugar dissolves, it breaks into bits too small to see, and they spread through the water.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level);
      s.grains = []; for (let i = 0; i < 60; i++) s.grains.push(makeGrain(g, 'sugar')); if (lv >= 1) for (let i = 0; i < 22; i++) s.grains.push(makeGrain(g, 'sand'));
      s.cold = lv >= 2; s.temp = s.cold ? 0.4 : 1; s.heaps = [2, 2, 3][lv]; s.round = 0; s.pourT = -9; s.om = 0; s.dir = 1; s.spoon = null; s.lastA = null; s.doneT = 0; s.mag = 0;
      s.ice = s.cold ? [[150, 0.8], [204, 1], [178, 0.7]].map(([x, k]) => ({ x, k })) : [];
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (x > G.l - 20 && x < G.r + 20 && y > G.top - 30 && y < G.bot + 10) { s.spoon = [x, y]; s.lastA = Math.atan2(y - MID[1], x - MID[0]); } },
    move(g, x, y) {
      const s = g.s; if (!s.spoon) return; s.spoon = [SK.clamp(x, G.l + 16, G.r - 16), SK.clamp(y, WTOP + 10, G.bot - 16)];
      const a = Math.atan2(y - MID[1], x - MID[0]); let d = a - s.lastA; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; s.lastA = a;
      if (Math.abs(d) < 1.2) { s.om = Math.min(14, s.om + Math.abs(d) * 1.25); if (Math.abs(d) > 0.02) s.dir = Math.sign(d); }
      if (g.rand() < 0.08) g.sfx('drip');
    },
    up(g) { g.s.spoon = null; },
    update(g, dt) {
      const s = g.s; s.om *= Math.exp(-1.5 * dt); const W = SK.clamp(s.om / 8, 0, 1);
      if (s.cold) { s.temp = Math.min(1, s.temp + dt * 0.2); for (const ic of s.ice) ic.k = Math.max(0, ic.k - dt * 0.16); }
      let left = 0;
      for (const q of s.grains) {
        if (q.gone) continue;
        q.a += s.dir * (0.4 + q.r * 0.6) * s.om * 0.5 * dt * q.sp;
        const rest = (1 - q.r) * (q.kind === 'sand' ? 0.07 : 0.11), want = W > 0.25 ? Math.max(rest, q.lift * W) : rest; q.h += (want > q.h ? (want - q.h) * 3 : -(q.kind === 'sand' ? 0.9 : 0.6)) * dt; q.h = Math.max(rest, Math.min(1, q.h));
        if (q.kind === 'sugar') { q.size -= dt * (0.02 + 0.6 * W * s.temp * (q.h > 0.12 ? 1.3 : 0.6)) * q.sp; if (q.size <= 0.12) { q.gone = true; } else left++; }
      }
      if (!left && s.round + 1 < s.heaps && g.t - s.pourT > 0.8) { // the fox wants it sweeter: another spoonful pours in
        s.round++; s.pourT = g.t; g.sfx('sweep'); g.sfx('pop');
        for (let i = 0; i < 46; i++) { const q = makeGrain(g, 'sugar'); q.h = 0.85 + g.rand() * 0.15; q.r *= 0.5; q.size = 1.5; q.a = Math.PI / 2 + (g.rand() - 0.5) * 0.6; s.grains.push(q); }
      } else if (!left && !s.doneT && !g.done) { s.doneT = g.t; g.sfx('sparkle'); g.sfx('magic'); }
      if (s.doneT) s.mag = Math.min(1, (g.t - s.doneT) / 0.6);
      if (s.doneT && !g.done && g.t - s.doneT > 0.6) { g.win(); g.sfx('slurp'); }
      s.W = W;
    },
    draw(g, c) {
      const s = g.s, t = g.t, W = s.W || 0, warm = s.temp;
      c.drawImage(g.bake('stir_kitchen', paintKitchen), 0, 0, 360, 640);
      // the warmer under the glass (level 2)
      if (s.cold) { c.fillStyle = '#5a4a5a'; c.beginPath(); c.roundRect(G.l - 6, G.bot + 2, G.r - G.l + 12, 18, 6); c.fill(); for (let i = 0; i < 5; i++) { c.fillStyle = `rgba(255,${120 + 60 * Math.sin(t * 3 + i)},60,${0.5 + 0.4 * warm})`; c.beginPath(); c.arc(G.l + 20 + i * 32, G.bot + 11, 4, 0, 7); c.fill(); } }
      SK.shadow(c, G.cx, G.bot + (s.cold ? 20 : 2), 96, 12, 0.18);
      // the water: cold blue warming to clear, with a dip in the middle as it swirls
      const dip = W * 26, wc = P.mix('#6ab4e4', '#9ad0ee', warm), wtop = WTOP;
      c.save(); c.beginPath(); c.moveTo(G.l + 8, wtop); c.quadraticCurveTo(G.cx, wtop + dip * 2, G.r - 8, wtop); c.lineTo(G.r - 14, G.bot - 6); c.quadraticCurveTo(G.cx, G.bot + 4, G.l + 14, G.bot - 6); c.closePath();
      const wg = c.createLinearGradient(0, wtop, 0, G.bot); wg.addColorStop(0, P.rgba(wc, 0.55)); wg.addColorStop(1, P.rgba(P.shade(wc, -0.15), 0.75)); c.fillStyle = wg; c.fill(); c.clip();
      // swirl streaks
      if (W > 0.05) { c.strokeStyle = `rgba(255,255,255,${0.35 * W})`; c.lineWidth = 2; for (let i = 0; i < 6; i++) { const yy = wtop + 40 + i * 38, ph = t * s.om * 0.4 * s.dir + i; c.beginPath(); c.ellipse(G.cx + Math.sin(ph) * 6, yy, HW * (0.5 + 0.08 * i), 6, 0, 0, Math.PI); c.stroke(); } }
      // ice cubes (level 2)
      for (const ic of s.ice) if (ic.k > 0.05) { const z = 26 * ic.k; c.fillStyle = 'rgba(240,250,255,0.75)'; c.strokeStyle = 'rgba(140,190,230,0.9)'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(ic.x + Math.sin(t * 2 + ic.x) * 3 - z / 2, wtop + dip - 4, z, z * 0.85, 4); c.fill(); c.stroke(); }
      // the grains, back ones first
      const gr = s.grains.filter(q => !q.gone).sort((a, b) => Math.cos(a.a) - Math.cos(b.a));
      for (const q of gr) {
        const x = G.cx + Math.sin(q.a) * q.r * HW, depth = Math.cos(q.a) * q.r, y = G.bot - 14 - q.h * (G.bot - wtop - 50) + depth * 6 - (1 - q.h) * 0, rr = (q.kind === 'sand' ? 3.6 : 4) * (0.8 + 0.2 * depth) * (q.kind === 'sugar' ? Math.max(0.2, q.size) : 1);
        c.fillStyle = q.kind === 'sand' ? '#c8a060' : '#ffffff'; c.strokeStyle = q.kind === 'sand' ? '#8a6230' : '#6a8aa8'; c.lineWidth = 1;
        c.beginPath(); if (q.kind === 'sugar') c.rect(x - rr, y - rr, rr * 2, rr * 2); else c.arc(x, y, rr, 0, 7); c.fill(); c.stroke();
      }
      c.restore();
      // the glass itself
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 5; c.beginPath(); c.moveTo(G.l, G.top); c.lineTo(G.l + 8, G.bot - 4); c.quadraticCurveTo(G.cx, G.bot + 10, G.r - 8, G.bot - 4); c.lineTo(G.r, G.top); c.stroke();
      c.strokeStyle = 'rgba(90,140,170,0.5)'; c.lineWidth = 2; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.roundRect(G.l + 14, G.top + 16, 8, 200, 4); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.beginPath(); c.ellipse(G.cx, G.top, (G.r - G.l) / 2, 7, 0, 0, 7); c.stroke(); c.restore();
      // the spoon: in the finger while stirring, otherwise leaning in the glass
      const sp = s.spoon || [G.cx + 40 + Math.sin(t * 1.2) * 2, G.bot - 60]; const top = [sp[0] + 50, G.top - 70];
      c.strokeStyle = '#8a8aa0'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(sp[0], sp[1]); c.lineTo(top[0], top[1]); c.stroke(); c.strokeStyle = '#e0e0f0'; c.lineWidth = 4; c.stroke();
      c.fillStyle = '#d0d0e0'; c.strokeStyle = '#7a7a90'; c.lineWidth = 2; c.beginPath(); c.ellipse(sp[0], sp[1], 12, 8, Math.atan2(top[1] - sp[1], top[0] - sp[0]), 0, 7); c.fill(); c.stroke();
      // the magnifying glass: the sugar's tiny bits, spread among the water's bits
      if (s.mag > 0) {
        const k = SK.easeOut(s.mag), mx = SK.lerp(400, G.cx, k), my = SK.lerp(560, 400, k), R = 74;
        c.save(); c.beginPath(); c.arc(mx, my, R, 0, 7); c.fillStyle = '#e8f6fc'; c.fill(); c.clip();
        const rnd = P.rng(21); for (let i = 0; i < 46; i++) { const x = mx - R + rnd() * 2 * R + Math.sin(t * 3 + i) * 2, y = my - R + rnd() * 2 * R + Math.cos(t * 3.4 + i) * 2;
          if (i % 3 === 0) { c.fillStyle = '#fff'; c.strokeStyle = '#4a4a6a'; c.lineWidth = 2.5; c.beginPath(); for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3; c.lineTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10); } c.closePath(); c.fill(); c.stroke(); }
          else { const ra = i * 1.3 + Math.sin(t * 2 + i) * 0.3; for (const sd of [-1, 1]) { const ha = ra + sd * 0.95; SK.ball(c, x + Math.cos(ha) * 7, y + Math.sin(ha) * 7, 3.4, '#f4f4fa', { lw: 1 }); } SK.ball(c, x, y, 6, '#e05050', { lw: 1 }); } }
        c.restore(); c.strokeStyle = '#5a3a2a'; c.lineWidth = 9; c.beginPath(); c.arc(mx, my, R, 0, 7); c.stroke(); c.strokeStyle = '#c89a5a'; c.lineWidth = 4; c.stroke();
        c.strokeStyle = '#5a3a2a'; c.lineWidth = 14; c.beginPath(); c.moveTo(mx + R * 0.72, my + R * 0.72); c.lineTo(mx + R * 1.3, my + R * 1.3); c.stroke();
      }
      // a heaped spoon tips sugar into the glass for the next round
      const pk = (t - s.pourT) / 0.7; if (pk >= 0 && pk < 1) { const tip = Math.sin(Math.min(1, pk * 2) * Math.PI / 2) * 1.1; c.save(); c.translate(G.cx + 50, G.top - 26); c.rotate(-tip); c.strokeStyle = '#8a8aa0'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(70, -30); c.stroke(); c.fillStyle = '#d0d0e0'; c.beginPath(); c.ellipse(-8, 4, 20, 11, -0.4, 0, 7); c.fill(); if (pk < 0.4) { c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-8, -2, 16, 8, -0.4, Math.PI, 0); c.fill(); } c.restore(); }
      if (!s.doneT) SK.tag(c, 'Sugar', G.cx - 40, G.bot + 34, 18); if (!s.doneT && s.grains.some(q => q.kind === 'sand')) SK.tag(c, 'Sand', G.cx + 50, G.bot + 34, 18);
      if (s.mag >= 1) { SK.tag(c, 'Sugar', G.cx - 40, 300, 18); SK.tag(c, 'Water', G.cx + 44, 300, 18); }
      // the fox waits for its drink
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'fox', 312, 612, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : W > 0.4 ? 'wow' : 'happy', facing: -1 });
      if (!s.doneT && !s.touched) SK.glow(c, g, G.cx, MID[1] + 20, 56);
      // the ghost hand stirs in circles (level 0, until the first touch)
      SK.demo(g, c, 'drag', [G.cx - 50, 420], [G.cx + 50, 420], { arc: 60, period: 1.4, never: !!s.doneT });
    },
    // the bot: stir in circles until the sugar is gone
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1) return; const a = (g.t - 1) * 9, x = G.cx + Math.cos(a) * 50, y = MID[1] + Math.sin(a) * 50;
      if (!s.botDown) { s.botDown = true; synth('down', x, y); } else if (!s.doneT) synth('move', x, y); else if (!s.botUp) { s.botUp = true; synth('up', x, y); }
    },
  });
})();
