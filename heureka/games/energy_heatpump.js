// MOVE HEAT! (earth_eng ME-39) — a frosty garden on the left, a chilly house on the right where the hedgehog shivers,
// and a heat pump between them: a loop of pipe with an outdoor coil, a valve, an indoor coil and a compressor. Pull the
// compressor's handle down, again and again. Each squeeze pushes the fluid round the loop and squeezes it hot (red); in
// the house it gives that heat to the room; through the valve it spreads out and turns icy, colder than the frosty
// garden (blue), so heat drifts out of the cold air into it; back at the compressor it is squeezed hot again. The house
// warms up although the garden is cold. Three pulls at level 0, four at level 1; level 2 is a freezing night (six).
(() => {
  // the loop, in flow order: compressor -> indoor coil (up) -> top pipe -> valve -> outdoor coil (down) -> bottom pipe -> compressor
  const LOOP = [[180, 520], [286, 520], [286, 470], [266, 456], [306, 440], [266, 424], [306, 408], [266, 392], [306, 376], [286, 362], [286, 300], [180, 300],
    [74, 300], [74, 362], [54, 376], [94, 392], [54, 408], [94, 424], [54, 440], [94, 456], [74, 470], [74, 520], [180, 520]];
  const SEG = []; let LEN = 0; for (let i = 1; i < LOOP.length; i++) { const l = Math.hypot(LOOP[i][0] - LOOP[i - 1][0], LOOP[i][1] - LOOP[i - 1][1]); SEG.push({ a: LOOP[i - 1], b: LOOP[i], s0: LEN, l }); LEN += l; }
  const at = s => { s = ((s % LEN) + LEN) % LEN; for (const g of SEG) if (s <= g.s0 + g.l) { const k = (s - g.s0) / g.l; return [SK.lerp(g.a[0], g.b[0], k), SK.lerp(g.a[1], g.b[1], k)]; } return LOOP[0]; };
  const S_IN = SEG[1].s0, S_INEND = SEG[9].s0, S_VALVE = SEG[11].s0, S_OUT = SEG[13].s0, S_OUTEND = SEG[20].s0;
  // the fluid's temperature at each place in the loop (it stays the same there while the pump runs): 0 icy .. 1 hot
  function tempAt(s) { s = ((s % LEN) + LEN) % LEN; if (s < S_IN) return 1; if (s < S_INEND) return 1 - 0.5 * (s - S_IN) / (S_INEND - S_IN); if (s < S_VALVE) return 0.5; if (s < S_OUT) return 0.02; if (s < S_OUTEND) return 0.02 + 0.16 * (s - S_OUT) / (S_OUTEND - S_OUT); return 0.18; }
  const tcol = k => k > 0.6 ? P.mix('#ff9a3a', '#ff3a2a', (k - 0.6) / 0.4) : k > 0.3 ? P.mix('#9ac0e0', '#ff9a3a', (k - 0.3) / 0.3) : P.mix('#3a8aff', '#9ac0e0', k / 0.3);
  const HT = 412, HB = 488, HX = 180; // the compressor handle's top and bottom
  function paintScene(o, snow) {
    // the garden: a cold sky and frosty grass (snow on the freezing night)
    N1.vgrad(o, 0, 0, 360, 640, snow ? ['#1a2048', '#3a4878', '#8a9ac0'] : ['#6a8ab8', '#a8c0dc', '#dce6f0']);
    N1.vgrad(o, 0, 540, 180, 100, snow ? ['#e8f0fa', '#c8d4e8'] : ['#a8c0a8', '#7a9a80']);
    o.strokeStyle = '#4a3a3a'; o.lineWidth = 6; o.beginPath(); o.moveTo(130, 540); o.lineTo(130, 200); o.stroke(); o.lineWidth = 3; for (const [y, d] of [[260, -1], [300, 1], [340, -1], [230, 1]]) { o.beginPath(); o.moveTo(130, y); o.lineTo(130 + d * 34, y - 30); o.stroke(); }
    if (snow) { const r = P.rng(4); o.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < 60; i++) { o.beginPath(); o.arc(r() * 176, 130 + r() * 400, 1 + r() * 1.6, 0, 7); o.fill(); } }
    else { o.fillStyle = 'rgba(255,255,255,0.7)'; const r = P.rng(7); for (let i = 0; i < 40; i++) o.fillRect(r() * 176, 544 + r() * 90, 3, 1.5); }
    // the house, cut open: warm wallpaper, a floor, an armchair
    o.fillStyle = '#c87a5a'; o.beginPath(); o.moveTo(176, 250); o.lineTo(270, 170); o.lineTo(364, 250); o.closePath(); o.fill();
    N1.vgrad(o, 184, 250, 176, 300, ['#f0d8b0', '#e0c090']); o.fillStyle = 'rgba(200,140,90,0.25)'; for (let x = 190; x < 360; x += 18) o.fillRect(x, 250, 8, 290);
    o.fillStyle = '#8a5a3a'; o.fillRect(184, 540, 176, 100); o.fillStyle = '#6a4228'; o.fillRect(176, 250, 8, 390);
    o.fillStyle = '#a84a5a'; o.beginPath(); o.roundRect(308, 494, 50, 46, 10); o.fill(); o.fillStyle = '#c85a6a'; o.beginPath(); o.roundRect(304, 480, 16, 60, 8); o.fill();
    // the outdoor unit box and the compressor base
    o.fillStyle = 'rgba(80,90,110,0.55)'; o.beginPath(); o.roundRect(36, 350, 76, 130, 10); o.fill(); o.fillStyle = '#5a5a6a'; o.beginPath(); o.roundRect(146, 506, 68, 34, 8); o.fill();
  }
  MG.add({
    id: 'heatpump', stage: 'energy', cmd: 'PUMP TO WARM THE HOUSE!', time: 7, mood: 'night', winText: 'Warm and cosy!', failText: 'Still chilly!',
    card: { title: 'Moving heat uphill', kind: 'Engineering', ref: 'Heat pumps',
      text: 'Heat flows by itself only from warmer things to colder things. A heat pump uses that trick twice.\n\nOutside, its fluid spreads out through a valve and gets colder than the cold air, so heat flows from the air into it. Even frosty air holds some heat. Then the compressor squeezes the fluid, which makes it hotter than the room, so the heat flows out into the house.\n\nThe squeezing takes some electricity, but the pump delivers about three times as much heat as that, because most of it comes from outside.',
      note: 'A heat pump does not make heat. It moves heat from the cold outdoors into the warm house.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4); s.n = [3, 4, 6][lv]; s.snow = lv >= 2; s.v = v;
      s.T0 = [8, 10, 6, 9][v]; s.T = s.T0; s.goal = 20; s.hy = HT; s.flow = 0; s.strokes = 0; s.drag = false; s.spring = 0; s.puffs = []; s.pull = 0; s.winT = 0; s.vel = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (Math.abs(x - HX) < 60 && y > s.hy - 44 && y < s.hy + 40) { s.drag = true; s.gy = s.hy - y; SK.dragStart(g, null, x, y); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); const ny = SK.clamp(y + s.gy, HT, HB), d = ny - s.hy;
      if (d > 0) { s.flow += d * 1.1; s.pull += d; if (s.pull >= (HB - HT) * 0.92 && !s.counted) { s.counted = 1; s.strokes++; s.T = Math.min(s.goal + 1, s.T + (s.goal - s.T0) / s.n); g.sfx('whoosh'); g.sfx('bubble', { vol: 0.5 }); } } s.hy = ny; },
    up(g) { const s = g.s; if (!s.drag) return; s.drag = false; SK.dragEnd(g); },
    update(g, dt) {
      const s = g.s;
      if (!s.drag && s.hy > HT) { s.hy = Math.max(HT, s.hy - 420 * dt); if (s.hy <= HT) { s.pull = 0; s.counted = 0; } } // the handle springs back up
      s.vel = SK.lerp(s.vel, s.drag ? 1 : 0, dt * 4);
      // heat puffs: out of the cold garden air into the icy coil, and out of the hot coil into the room, while the fluid moves
      const mv = s.flow - (s.flow0 ?? s.flow); s.flow0 = s.flow;
      if (mv > 0) for (let i = 0; i < 2; i++) if (g.rand() < Math.min(1, mv * 0.08)) {
        s.puffs.push({ x: 8 + g.rand() * 30, y: 360 + g.rand() * 110, tx: 60 + g.rand() * 30, ty: 380 + g.rand() * 80, k: 0, out: 0 });
        s.puffs.push({ x: 286 + (g.rand() - 0.5) * 30, y: 380 + g.rand() * 80, tx: 220 + g.rand() * 120, ty: 280 + g.rand() * 150, k: 0, out: 1 }); }
      for (const p of s.puffs) p.k += dt * 1.1; s.puffs = s.puffs.filter(p => p.k < 1); if (s.puffs.length > 90) s.puffs.splice(0, s.puffs.length - 90);
      if (g.done) return;
      if (s.T >= s.goal && !s.winT) s.winT = g.t; if (s.winT && g.t - s.winT > 0.35) { g.win(); g.sfx('cheer'); g.sfx('chime'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', warm = SK.clamp((s.T - s.T0) / (s.goal - s.T0), 0, 1);
      c.drawImage(g.bake('heatpump_' + (s.snow ? 's' : 'f'), o => paintScene(o, s.snow)), 0, 0, 360, 640);
      // the room glows warmer as heat arrives
      c.fillStyle = `rgba(255,150,60,${0.22 * warm})`; c.fillRect(184, 250, 176, 290); c.fillStyle = `rgba(120,170,255,${0.18 * (1 - warm)})`; c.fillRect(184, 250, 176, 290);
      // the pipe loop, coloured by how hot the fluid is in each part, with the fluid moving round it
      c.lineCap = 'round'; c.lineJoin = 'round';
      for (const sg of SEG) { const n = Math.max(1, Math.round(sg.l / 8)); for (let i = 0; i < n; i++) { const s0 = sg.s0 + sg.l * i / n, s1 = sg.s0 + sg.l * (i + 1) / n, p0 = at(s0), p1 = at(s1);
        c.strokeStyle = '#2a2a34'; c.lineWidth = 12; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); c.strokeStyle = tcol(tempAt((s0 + s1) / 2)); c.lineWidth = 7; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); } }
      for (let d = 0; d < LEN; d += 26) { const [x, y] = at(d + s.flow); c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); }
      // the heat puffs
      c.save(); c.globalCompositeOperation = 'lighter'; for (const p of s.puffs) { const x = SK.lerp(p.x, p.tx, p.k), y = SK.lerp(p.y, p.ty, p.k) - (p.out ? p.k * 20 : 0); c.globalAlpha = Math.sin(p.k * Math.PI) * 0.8; c.fillStyle = '#ff9a40'; c.beginPath(); c.arc(x, y, 4 + (p.out ? p.k * 4 : 0), 0, 7); c.fill(); } c.restore();
      // the valve (a narrow gap) and the compressor (a pump with its handle)
      c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(166, 288, 28, 24, 5); c.fill(); c.fillStyle = '#e8e4f0'; c.fillRect(178, 290, 4, 20);
      c.fillStyle = '#6a6a7a'; c.beginPath(); c.roundRect(156, 496, 48, 40, 8); c.fill(); c.strokeStyle = '#2a2a34'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = '#3a3a48'; c.lineWidth = 6; c.beginPath(); c.moveTo(HX, 500); c.lineTo(HX, s.hy); c.stroke();
      c.fillStyle = '#e8403a'; c.strokeStyle = '#5a1010'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(HX - 30, s.hy - 12, 60, 22, 9); c.fill(); c.stroke();
      SK.tag(c, 'Compressor', HX, 558, 18); SK.tag(c, 'Valve', HX, 330, 18);
      // thermometers: the garden (cold) and the house (rising to the Cosy line)
      const therm = (x, y, k, lab, goal) => { c.fillStyle = 'rgba(30,14,36,0.7)'; c.beginPath(); c.roundRect(x - 12, y - 92, 24, 104, 12); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x - 5, y - 84, 10, 84, 5); c.fill();
        c.fillStyle = k > 0.6 ? '#ff5a3a' : k > 0.3 ? '#ffb040' : '#4a9aff'; c.beginPath(); c.roundRect(x - 5, y - 84 * k, 10, 84 * k, 5); c.fill(); c.beginPath(); c.arc(x, y + 4, 9, 0, 7); c.fill();
        if (goal != null) { c.fillStyle = '#6ae07a'; c.fillRect(x - 16, y - 84 * goal - 2, 32, 4); N1.word(c, 'Cosy', x + 20, y - 84 * goal, 16, '#8affb0', { align: 'left', lw: 4 }); } N1.word(c, lab, x, y + 28, 18); };
      therm(28, 236, s.snow ? 0.05 : 0.14, 'Garden'); therm(236, 452, SK.clamp(s.T / 26, 0, 1), 'House', s.goal / 26);
      // the hedgehog in its armchair
      SK.animal(c, 'hedgehog', 330, 536, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : warm > 0.5 ? 'idle' : 'balance', expr: won ? 'laugh' : lost ? 'sad' : warm > 0.66 ? 'happy' : 'sad', facing: -1 });
      if (warm < 0.66 && !won) { c.strokeStyle = 'rgba(160,200,255,0.8)'; c.lineWidth = 2; for (let i = 0; i < 2; i++) { const x = 308 + i * 44 + Math.sin(t * 30) * 2; c.beginPath(); c.moveTo(x, 500); c.lineTo(x - 4, 494); c.stroke(); } } // shivers
      if (!g.done) N1.pips(c, 180, 150, s.n, Math.min(s.n, s.strokes), { col: '#ff9a40' });
      // guidance: pull the handle all the way down
      if (g.done) return; const ready = s.hy <= HT + 2 && !s.drag;
      if (ready) { SK.grab(c, g, HX, s.hy, 28); SK.target(c, g, HX, HB, 14); SK.arrow(c, g, HX + 46, s.hy, HX + 46, HB, { from: 0, to: 4 }); }
      SK.demo(g, c, 'drag', [HX, s.hy], [HX, HB + 4], { never: !ready });
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 1.0) return;
      if (!B.on) { if (s.hy > HT + 1 || (B.next && g.t < B.next)) return; synth('down', HX, s.hy); B.on = 1; B.t0 = g.t; return; }
      const k = SK.clamp((g.t - B.t0) / 0.35, 0, 1), y = SK.lerp(HT, HB + 4, k); synth('move', HX, y); if (k >= 1) { synth('up', HX, y); B.on = 0; B.next = g.t + 0.1; }
    },
  });
})();
