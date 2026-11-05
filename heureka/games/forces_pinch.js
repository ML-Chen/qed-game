// PINCH! (physics AP1-39) — a garden: a hose from a tap ends in a big nozzle held on a post, and flower beds lie at
// different distances. Drag the squeeze lever: the narrower the nozzle's opening, the faster the water leaves it, because
// the same amount of water each second must squeeze through a smaller hole. A faster jet flies farther before it lands.
// Water every bed (each fills its flowers as the jet lands on it). Wide open, the water just dribbles onto the duck's
// feet. Two beds at level 0, three at level 1, four narrower beds at level 2.
(() => {
  const NZ = [96, 404], ANG = 0.3, GY = 520, Q = 2600, WMIN = 5, WMAX = 30, LV = [330, 392], G = 900;
  const speed = w => Q / w;
  function landX(w) { const v = speed(w), vc = v * Math.cos(ANG), vs = v * Math.sin(ANG), h = GY - NZ[1], T = (vs + Math.sqrt(vs * vs + 2 * G * h)) / G; return NZ[0] + 14 + vc * T; }
  function wFor(x) { let lo = WMIN, hi = WMAX; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (landX(m) > x) lo = m; else hi = m; } return (lo + hi) / 2; }
  const wAt = ly => SK.lerp(WMAX, WMIN, (ly - LV[0]) / (LV[1] - LV[0]));
  const lyFor = w => SK.lerp(LV[0], LV[1], (WMAX - w) / (WMAX - WMIN));
  function paintGarden(o) {
    P.sky(o, 360, 640, ['#8ad0f0', '#c8ecf8', '#fff4d8'], { x: 300, y: 140, r: 22, color: '#fff2b0' }); P.cloud(o, 120, 170, 0.6);
    P.hills(o, 360, 430, 40, '#9ad070', '#6aa048', { seed: 11 }); for (const [x, s] of [[250, 0.55], [340, 0.7]]) P.tree(o, x, 440, s);
    N1.vgrad(o, 0, GY - 10, 360, 640 - GY + 10, ['#7ab850', '#4a8a30']); P.grassTufts(o, 360, GY, 640, 26, '#3a7a28', 7); P.flowers(o, 360, 580, 630, 10);
    // the brick wall with the tap, and the hose to the nozzle post
    o.fillStyle = '#b8604a'; o.fillRect(0, 330, 34, GY - 320); o.strokeStyle = 'rgba(80,30,20,0.4)'; o.lineWidth = 1; for (let y = 336; y < GY; y += 12) { o.beginPath(); o.moveTo(0, y); o.lineTo(34, y); o.stroke(); }
    o.fillStyle = '#8a8a9a'; o.fillRect(26, 360, 16, 10); o.fillStyle = '#e8403a'; o.beginPath(); o.arc(34, 352, 8, 0, 7); o.fill();
    o.fillStyle = '#7a5030'; o.fillRect(NZ[0] - 34, NZ[1] + 10, 8, GY - NZ[1] - 6);
  }
  function bed(c, b, t) { // a bed of soil; flowers rise as it gets water
    c.fillStyle = '#6a4228'; c.beginPath(); c.ellipse(b.x, GY + 6, b.w / 2, 9, 0, 0, 7); c.fill(); c.fillStyle = '#8a5a38'; c.beginPath(); c.ellipse(b.x, GY + 3, b.w / 2 - 3, 6, 0, 0, 7); c.fill();
    const n = Math.max(2, Math.round(b.w / 16)), k = SK.easeOut(b.p);
    for (let i = 0; i < n; i++) { const x = b.x - b.w / 2 + 8 + i * (b.w - 16) / (n - 1), h = 6 + k * 30 + (i % 2) * 6 * k, sw = Math.sin(t * 2 + i) * 2 * k;
      c.strokeStyle = k > 0.2 ? '#3a8a30' : '#7a6a3a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, GY + 2); c.quadraticCurveTo(x + sw, GY - h / 2, x + sw, GY - h); c.stroke();
      if (k > 0.25) { c.fillStyle = b.col; for (let j = 0; j < 5; j++) { const a = j * 1.256 + t * 0.4; c.beginPath(); c.arc(x + sw + Math.cos(a) * 5 * k, GY - h + Math.sin(a) * 5 * k, 3.6 * k, 0, 7); c.fill(); } c.fillStyle = '#ffd43a'; c.beginPath(); c.arc(x + sw, GY - h, 2.6 * k, 0, 7); c.fill(); }
      else { c.fillStyle = '#9a8a4a'; c.beginPath(); c.ellipse(x + 2, GY - h, 3, 1.5, 0.5, 0, 7); c.fill(); } }
    if (b.p < 1) { c.fillStyle = 'rgba(30,14,36,0.55)'; c.beginPath(); c.roundRect(b.x - 20, GY + 18, 40, 8, 4); c.fill(); c.fillStyle = '#6ac0ff'; c.beginPath(); c.roundRect(b.x - 20, GY + 18, 40 * b.p, 8, 4); c.fill(); }
  }
  MG.add({
    id: 'pinch', stage: 'forces', cmd: 'SQUEEZE TO WATER EVERY BED!', time: 7, mood: 'bright', winText: 'All watered!', failText: 'Still dry!',
    card: { title: 'Squeeze it, speed it up', kind: 'Physics', ref: 'Continuity of flow',
      text: 'The tap pushes the same amount of water into the hose every second. All of it has to come out of the nozzle.\n\nWhen the opening is narrower, that same water can only get out by moving faster. A faster jet flies farther before gravity pulls it down to the ground.\n\nThat is why putting your thumb over the end of a hose makes it spray far. Rivers do the same: where the banks get narrow, the water rushes faster.',
      note: 'The same flow through a narrower opening has to move faster.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4), n = [2, 3, 4][lv], bw = lv >= 2 ? 40 : 52;
      const sets = [[206, 314, 258, 340], [320, 212, 270, 238], [250, 334, 204, 292], [292, 214, 338, 250]][v];
      const cols = SK.shuffled(g, ['#ff6a8a', '#b98ae0', '#ff9a3a', '#f4f0f8']);
      s.beds = sets.slice(0, n).map((x, i) => ({ x: x + Math.round((g.rand() - 0.5) * 10), w: bw, p: 0, col: cols[i] }));
      s.ly = LV[0]; s.drag = false; s.drops = []; s.wet = 0; s.doneT = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (SK.dist(x, y, NZ[0] - 4, s.ly) < 50 || (Math.abs(x - NZ[0]) < 60 && y > LV[0] - 40 && y < LV[1] + 30)) { s.drag = true; SK.dragStart(g, null, x, y); s.gy = s.ly - y; } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); s.ly = SK.clamp(y + s.gy, LV[0], LV[1]); },
    up(g) { const s = g.s; if (s.drag) { s.drag = false; SK.dragEnd(g); } },
    update(g, dt) {
      const s = g.s, w = wAt(s.ly), v = speed(w), lx = landX(w);
      // water drops leave the nozzle at the jet's speed and fall under gravity
      for (let i = 0; i < 3; i++) if (g.rand() < 0.9) s.drops.push({ x: NZ[0] + 14, y: NZ[1] + (g.rand() - 0.5) * w * 0.5, vx: v * Math.cos(ANG) * (0.97 + g.rand() * 0.06), vy: -v * Math.sin(ANG) * (0.95 + g.rand() * 0.1), r: 2 + w * 0.08 });
      for (const d of s.drops) { d.vy += G * dt; d.x += d.vx * dt; d.y += d.vy * dt; if (d.y > GY) d.dead = 1; } s.drops = s.drops.filter(d => !d.dead && d.x < 380); if (s.drops.length > 260) s.drops.splice(0, s.drops.length - 260);
      s.wet = lx < 168 ? Math.min(1, s.wet + dt * 2) : Math.max(0, s.wet - dt);
      if (g.done) return;
      for (const b of s.beds) if (b.p < 1 && Math.abs(lx - b.x) <= b.w / 2) { b.p = Math.min(1, b.p + dt / 0.9); if (b.p >= 1) { g.sfx('grow'); g.sfx('chime'); g.burst(b.x, GY - 30, [b.col, '#ffd43a', '#8affb0'], 16, 140); } else if (g.rand() < 0.1) g.sfx('drip', { vol: 0.4 }); }
      if (s.beds.every(b => b.p >= 1)) { if (!s.doneT) s.doneT = g.t; if (g.t - s.doneT > 0.3) { g.win(); g.sfx('cheer'); } }
      if (s.wet > 0.5 && g.rand() < 0.02) g.sfx('quack', { vol: 0.4 });
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', w = wAt(s.ly), lx = landX(w);
      c.drawImage(g.bake('pinch_garden', paintGarden), 0, 0, 360, 640);
      for (const b of s.beds) bed(c, b, t);
      // the hose: from the tap to the nozzle, with water inside moving at a steady pace
      c.strokeStyle = '#3a8a4a'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(34, 366); c.bezierCurveTo(50, 470, 40, 420, NZ[0] - 40, NZ[1]); c.stroke();
      c.save(); c.strokeStyle = 'rgba(150,220,255,0.7)'; c.lineWidth = 4; c.setLineDash([6, 10]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(34, 366); c.bezierCurveTo(50, 470, 40, 420, NZ[0] - 40, NZ[1]); c.stroke(); c.restore();
      // the nozzle: its opening narrows as the lever goes down
      c.save(); c.translate(NZ[0], NZ[1]); c.rotate(-ANG);
      c.fillStyle = '#f0b030'; c.strokeStyle = '#7a5010'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-44, -16); c.lineTo(-10, -16); c.lineTo(14, -w / 2); c.lineTo(14, w / 2); c.lineTo(-10, 16); c.lineTo(-44, 16); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#5ab4e8'; c.fillRect(12, -w / 2 + 1, 4, w - 2); c.restore();
      // the lever
      c.strokeStyle = '#3a3a48'; c.lineWidth = 5; c.beginPath(); c.moveTo(NZ[0] - 20, NZ[1] - 6); c.lineTo(NZ[0] - 6, s.ly); c.stroke();
      c.fillStyle = '#e8403a'; c.strokeStyle = '#5a1010'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(NZ[0] - 24, s.ly - 10, 36, 20, 8); c.fill(); c.stroke();
      SK.tag(c, 'Squeeze', NZ[0] - 2, LV[0] - 34, 18); SK.tag(c, 'Nozzle', NZ[0] - 18, NZ[1] + 44, 18);
      // the jet
      c.fillStyle = 'rgba(120,200,255,0.85)'; for (const d of s.drops) { c.beginPath(); c.arc(d.x, d.y, d.r, 0, 7); c.fill(); }
      c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { const a = t * 10 + i * 1.6; c.beginPath(); c.ellipse(lx, GY + 2, 6 + (a % 1) * 14, 3 + (a % 1) * 4, 0, 0, 7); c.stroke(); } // the splash where it lands
      // the duck under the nozzle, getting its feet wet when the water only dribbles
      SK.animal(c, 'duck', 138, GY + 54, 0.95, { t, pose: won ? 'cheer' : lost ? 'sad' : s.wet > 0.5 ? 'hop' : 'idle', expr: won ? 'laugh' : s.wet > 0.5 ? 'wow' : lost ? 'sad' : 'happy', facing: -1 });
      if (!g.done) N1.pips(c, 180, 150, s.beds.length, s.beds.filter(b => b.p >= 1).length, { col: '#6ac0ff' });
      // guidance: move the lever until the jet lands on the nearest dry bed
      if (g.done) return; const dry = s.beds.filter(b => b.p < 1); if (!dry.length) return;
      const nb = dry.reduce((a, b) => Math.abs(a.x - lx) < Math.abs(b.x - lx) ? a : b), ty = lyFor(wFor(nb.x)), off = Math.abs(lx - nb.x) > nb.w / 2 - 6;
      if (off) { SK.grab(c, g, NZ[0] - 6, s.ly, 22); SK.target(c, g, NZ[0] - 6, ty, 12); N1.word(c, nb.x > lx ? 'Narrower' : 'Wider', NZ[0] + 70, LV[0] - 6, 18, '#fff6ea'); N1.farrow(c, nb.x > lx ? lx + 10 : lx - 10, GY - 26, nb.x > lx ? lx + 46 : lx - 46, GY - 26, '#ffd45a', 5); }
      SK.demo(g, c, 'drag', [NZ[0] - 6, s.ly], [NZ[0] - 6, ty], { never: !off });
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 1.0) return; const lx = landX(wAt(s.ly)), dry = s.beds.filter(b => b.p < 1); if (!dry.length) return;
      const nb = dry.reduce((a, b) => Math.abs(a.x - lx) < Math.abs(b.x - lx) ? a : b); if (!B.on && Math.abs(lx - nb.x) <= nb.w / 2 - 8) return;
      if (!B.on) { synth('down', NZ[0] - 6, s.ly); B.on = 1; B.t0 = g.t; B.y0 = s.ly; B.ty = lyFor(wFor(nb.x)); return; }
      const k = SK.clamp((g.t - B.t0) / 0.4, 0, 1), y = SK.lerp(B.y0, B.ty, k); synth('move', NZ[0] - 6, y); if (k >= 1) { synth('up', NZ[0] - 6, y); B.on = 0; }
    },
  });
})();
