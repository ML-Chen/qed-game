// TILT! (physics PP-11) — a solar panel on a pole in a hot garden, wired to a battery and a fan that cools the bird.
// Once you start, the sun crosses the sky from sunrise to sunset. Drag the panel's aiming knob to point the panel at the
// sun. Sunbeams are drawn as parallel lines: facing the sun squarely, the panel catches the most of them (the most power,
// the fan whirs and the battery fills fast); tilted away it catches few, edge-on none. Fill the battery before sunset.
// A panel left facing one way all day catches too little. Level 2: a shorter day and a fuller battery to fill.
(() => {
  const PV = [180, 452], HL = 66, SR = 180, KN = 58, SMAX = 1.45;
  const sunAt = sg => [PV[0] + SR * Math.sin(sg), PV[1] - SR * Math.cos(sg)];
  function paintGarden(o) {
    // ground, a fence and flowers (the sky is drawn live: it changes through the day)
    N1.vgrad(o, 0, 500, 360, 140, ['#8ac860', '#5a9a40']); P.grassTufts(o, 360, 506, 640, 30, '#4a8a30', 5); P.flowers(o, 360, 520, 630, 16);
    o.fillStyle = '#e8d8b8'; for (let x = 4; x < 360; x += 26) { o.beginPath(); o.moveTo(x, 500); o.lineTo(x, 470); o.lineTo(x + 8, 462); o.lineTo(x + 16, 470); o.lineTo(x + 16, 500); o.closePath(); o.fill(); } o.fillRect(0, 476, 360, 6);
    // the pole and the wires to the battery and the fan
    o.fillStyle = '#5a5a6a'; o.fillRect(PV[0] - 5, PV[1], 10, 120); o.strokeStyle = '#2a2a34'; o.lineWidth = 3; o.beginPath(); o.moveTo(PV[0], 560); o.quadraticCurveTo(250, 600, 296, 560); o.moveTo(PV[0], 560); o.quadraticCurveTo(110, 600, 70, 566); o.stroke();
  }
  function sky(c, sg, t) { // dawn and dusk orange, midday blue
    const k = Math.min(1, Math.abs(sg) / SMAX), noon = 1 - k * k, top = P.mix('#2a3a7a', '#3a8ad8', noon), mid = P.mix('#e8785a', '#8acaf0', noon), low = P.mix('#ffc070', '#e0f4ff', noon);
    const gr = c.createLinearGradient(0, 0, 0, 500); gr.addColorStop(0, top); gr.addColorStop(0.6, mid); gr.addColorStop(1, low); c.fillStyle = gr; c.fillRect(0, 0, 360, 500);
    const [sx, sy] = sunAt(sg); const hg = c.createRadialGradient(sx, sy, 6, sx, sy, 90); hg.addColorStop(0, 'rgba(255,240,180,0.9)'); hg.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = hg; c.fillRect(sx - 90, sy - 90, 180, 180);
    c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(sx, sy, 22, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,220,120,0.8)'; c.lineWidth = 3; for (let i = 0; i < 10; i++) { const a = i * 0.628 + t * 0.6; c.beginPath(); c.moveTo(sx + Math.cos(a) * 28, sy + Math.sin(a) * 28); c.lineTo(sx + Math.cos(a) * 38, sy + Math.sin(a) * 38); c.stroke(); }
    // the sun's path across the sky
    c.save(); c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; c.setLineDash([4, 8]); c.beginPath(); c.arc(PV[0], PV[1], SR, -Math.PI / 2 - SMAX, -Math.PI / 2 + SMAX); c.stroke(); c.restore();
  }
  function fan(c, x, y, ang, t) {
    c.fillStyle = '#5a5a6a'; c.fillRect(x - 4, y, 8, 46); c.fillRect(x - 18, y + 44, 36, 8);
    c.save(); c.translate(x, y); c.strokeStyle = '#3a3a48'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 30, 0, 7); c.stroke();
    c.rotate(ang); c.fillStyle = '#6ac0e8'; for (let i = 0; i < 3; i++) { c.rotate(Math.PI * 2 / 3); c.beginPath(); c.ellipse(0, -14, 8, 14, 0.3, 0, 7); c.fill(); } c.fillStyle = '#3a3a48'; c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill(); c.restore();
  }
  MG.add({
    id: 'tilt', stage: 'energy', cmd: 'AIM THE PANEL AT THE SUN!', time: 7, mood: 'bright', winText: 'Battery full!', failText: 'Sunset!',
    card: { title: 'Face the sun', kind: 'Physics', ref: 'Solar power and angle',
      text: 'A solar panel turns sunlight into electricity. The more sunlight lands on it, the more power it makes.\n\nFacing the sun squarely, the panel catches the widest band of sunbeams. Tilted away, the same panel catches a narrower band, so it makes less power. Edge-on to the sun it catches almost none.\n\nThe sun moves across the sky during the day, so some panels turn to follow it. Shade matters too: even a small shadow on a panel can cut its power a lot.',
      note: 'A solar panel makes the most power when it faces the sun squarely.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4); s.v = v;
      s.day = [11, 10, 8][lv]; s.needK = [0.8, 0.83, 0.86][lv]; s.ideal = s.day; s.need = s.ideal * s.needK; // energy if aimed perfectly all day
      s.phi = [0.9, -0.2, 1.1, 0.6][v]; s.mirror = v % 2 === 1; // the panel's starting tilt; some days the sun crosses the other way
      s.t0 = 0; s.sg = -SMAX; s.E = 0; s.fanA = 0; s.drag = false; s.pow = 0;
      if (s.mirror) { s.phi = -s.phi; s.sg = SMAX; }
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const kx = PV[0] + Math.sin(s.phi) * KN, ky = PV[1] - Math.cos(s.phi) * KN;
      if (SK.dist(x, y, kx, ky) < 56 || SK.dist(x, y, PV[0], PV[1]) < 80) { s.drag = true; SK.dragStart(g, null, x, y); if (!s.t0) s.t0 = g.t; this_aim(s, x, y); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); this_aim(s, x, y); },
    up(g) { const s = g.s; if (s.drag) { s.drag = false; SK.dragEnd(g); } },
    update(g, dt) {
      const s = g.s; if (!s.t0 || g.done) { s.fanA += s.pow * 14 * dt; return; } // the day starts when you first touch the panel
      const k = SK.clamp((g.t - s.t0) / s.day, 0, 1); s.sg = (s.mirror ? 1 : -1) * SMAX * (1 - 2 * k);
      s.pow = Math.max(0, Math.cos(s.sg - s.phi)); s.E += s.pow * dt; s.fanA += s.pow * 14 * dt;
      if (s.E >= s.need) { g.win(); g.sfx('cheer'); g.sfx('chime'); g.burst(300, 540, ['#8affb0', '#ffd45a', '#fff6ea'], 20, 160); return; }
      if (k >= 1) { g.fail(); g.sfx('wrong'); g.sfx('laugh'); }
      if (g.rand() < s.pow * 0.05) g.sfx('tap', { pitch: 1.6, vol: 0.15 });
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', sg = s.sg;
      sky(c, sg, t); c.drawImage(g.bake('tilt_garden', paintGarden), 0, 0, 360, 640);
      // the sunbeams: parallel lines from the sun's direction; those that meet the panel stop there and glow
      const ux = Math.sin(sg), uy = -Math.cos(sg), px = Math.cos(s.phi), py = Math.sin(s.phi), nx = -uy, ny = ux; // u: toward the sun; p: along the panel
      if (Math.abs(sg) < SMAX + 0.05) for (let i = -6; i <= 6; i++) { const ox = PV[0] + nx * i * 13, oy = PV[1] + ny * i * 13;
        // where this beam crosses the panel's line
        const den = ux * py - uy * px, tt = Math.abs(den) > 1e-4 ? ((ox - PV[0]) * py - (oy - PV[1]) * px) / den : 1e9, hx = ox - ux * tt, hy = oy - uy * tt, along = (hx - PV[0]) * px + (hy - PV[1]) * py;
        const hit = Math.abs(along) <= HL && s.pow > 0.02 && tt <= 1; const L0 = 260;
        c.save(); c.strokeStyle = hit ? 'rgba(255,230,110,0.85)' : 'rgba(255,240,180,0.25)'; c.lineWidth = hit ? 3 : 2;
        c.beginPath(); c.moveTo(ox + ux * L0, oy + uy * L0); if (hit) c.lineTo(hx, hy); else c.lineTo(ox - ux * 120, oy - uy * 120); c.stroke(); c.restore(); }
      // the panel: cells glow with the power it is making
      c.save(); c.translate(PV[0], PV[1]); c.rotate(s.phi); c.fillStyle = '#2a2a3a'; c.fillRect(-HL - 4, -2, HL * 2 + 8, 10);
      for (let i = 0; i < 8; i++) { const gl = s.pow; c.fillStyle = P.mix('#1a3a7a', '#7ac8ff', gl * 0.8); c.fillRect(-HL + i * HL / 4 + 1, -8, HL / 4 - 2, 8); }
      c.strokeStyle = '#c8d0e0'; c.lineWidth = 2; c.strokeRect(-HL, -8, HL * 2, 8); c.restore();
      const kx = PV[0] + Math.sin(s.phi) * KN, ky = PV[1] - Math.cos(s.phi) * KN; // the aiming knob on a stalk
      c.strokeStyle = '#3a3a48'; c.lineWidth = 3; c.beginPath(); c.moveTo(PV[0], PV[1]); c.lineTo(kx, ky); c.stroke(); c.fillStyle = '#ff8a3a'; c.strokeStyle = '#3a1a10'; c.beginPath(); c.arc(kx, ky, 10, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#5a5a6a'; c.beginPath(); c.arc(PV[0], PV[1], 7, 0, 7); c.fill();
      SK.tag(c, 'Solar panel', PV[0], 596, 18);
      // the battery and the fan
      const BX = 300, BY = 548, fill = SK.clamp(s.E / s.need, 0, 1);
      c.fillStyle = '#2a2a34'; c.beginPath(); c.roundRect(BX - 22, BY - 62, 44, 70, 6); c.fill(); c.fillRect(BX - 8, BY - 68, 16, 7);
      c.fillStyle = fill > 0.99 ? '#8affb0' : '#5ad07a'; c.fillRect(BX - 16, BY + 2 - 58 * fill, 32, 58 * fill); c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.strokeRect(BX - 16, BY - 56, 32, 58);
      SK.tag(c, 'Battery', BX, BY + 30, 18);
      fan(c, 70, 520, s.fanA, t); SK.tag(c, 'Fan', 70, 600, 18);
      // the bird, hot until the fan blows on it
      const cool = s.pow > 0.5 || won; SK.animal(c, 'bird', 128, 560, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : cool ? 'happy' : 'sad', facing: -1 });
      if (!cool && !g.done) { c.fillStyle = '#8cd0ff'; c.beginPath(); c.ellipse(144, 520 + (t * 30) % 14, 2.5, 4, 0, 0, 7); c.fill(); }
      if (s.pow > 0.3) { c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const x = 100 + ((t * 120 + i * 14) % 30); c.beginPath(); c.moveTo(x, 508 + i * 10); c.lineTo(x + 10, 508 + i * 10); c.stroke(); } }
      // the power: how squarely the panel faces the sun
      if (!g.done) { const pw = s.t0 ? s.pow : Math.max(0, Math.cos(sg - s.phi)); c.fillStyle = 'rgba(30,14,36,0.7)'; c.beginPath(); c.roundRect(110, 136, 140, 26, 13); c.fill(); c.fillStyle = pw > 0.85 ? '#8affb0' : pw > 0.5 ? '#ffd45a' : '#ff7a5a'; c.beginPath(); c.roundRect(116, 142, 128 * pw, 14, 7); c.fill(); N1.word(c, 'Power', 180, 178, 18); }
      // guidance: point the knob at (just ahead of) the sun
      if (g.done) return; const lead = s.t0 ? (s.mirror ? -1 : 1) * 0.5 : 0, aim = SK.clamp(sg + lead, -1.3, 1.3), ax = PV[0] + Math.sin(aim) * (KN + 50), ay = PV[1] - Math.cos(aim) * (KN + 50);
      const off = Math.abs(aim - s.phi) > 0.18;
      if (off) { SK.grab(c, g, kx, ky, 18); SK.target(c, g, ax, ay, 14); SK.arrow(c, g, kx, ky, ax, ay, { from: 20, to: 20 }); }
      SK.demo(g, c, 'drag', [kx, ky], [ax, ay], { never: !off });
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 1.0) return; const kx = PV[0] + Math.sin(s.phi) * KN, ky = PV[1] - Math.cos(s.phi) * KN;
      if (!B.on) { synth('down', kx, ky); B.on = 1; return; }
      const aim = s.sg, x = PV[0] + Math.sin(aim) * KN, y = PV[1] - Math.cos(aim) * KN; synth('move', x, y);
    },
  });
  function this_aim(s, x, y) { s.phi = SK.clamp(Math.atan2(x - PV[0], PV[1] - y), -1.35, 1.35); }
})();
