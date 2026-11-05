// FIRE ONE! (physics QP-05) — the double-slit experiment, one electron at a time. Tap to fire the electron gun. Each
// electron reaches the glowing screen as a single dot, at a random spot, but the dots slowly pile into bright and dark
// stripes: each electron spreads like a wave through both slits, and the two halves add up in some places and cancel in
// others. From level 1 the ant strolls along the wall with a leaf; while it covers one slit, electrons land in one plain
// blob instead, and those dots don't help. Level 2: more dots to build in the time, so fire faster.
(() => {
  const GUN = [180, 566], WALL = 410, SLITS = [160, 200], SCR = { t: 140, b: 282, l: 20, r: 340 }, FR = 36, ENV = 128;
  const sinc2 = v => v === 0 ? 1 : Math.pow(Math.sin(v) / v, 2);
  const two = u => Math.pow(Math.cos(Math.PI * u / FR), 2) * sinc2(Math.PI * u / ENV), one = (u, sx) => sinc2(Math.PI * (u - (sx - 180)) / (ENV * 0.9));
  function sample(g, f) { for (let i = 0; i < 200; i++) { const u = (g.rand() * 2 - 1) * 160; if (g.rand() < f(u)) return u; } return 0; }
  function antX(s, t) { if (!s.ant) return -99; const per = 5.2, q = ((t - 1.6) % per + per) % per; return t < 1.6 ? -60 : -40 + q * 85; } // walks left to right, again and again
  function paintLab(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#0c0e26'); bg.addColorStop(1, '#22264a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(9); for (let i = 0; i < 30; i++) { o.fillStyle = `rgba(160,200,255,${0.1 + rnd() * 0.2})`; o.beginPath(); o.arc(rnd() * 360, 250 + rnd() * 380, 0.8 + rnd(), 0, 7); o.fill(); }
    // the screen: a dark glass panel in a frame
    o.fillStyle = '#3a3a5a'; o.beginPath(); o.roundRect(SCR.l - 8, SCR.t - 8, SCR.r - SCR.l + 16, SCR.b - SCR.t + 16, 10); o.fill();
    const sg = o.createLinearGradient(0, SCR.t, 0, SCR.b); sg.addColorStop(0, '#0a1a14'); sg.addColorStop(1, '#10241c'); o.fillStyle = sg; o.fillRect(SCR.l, SCR.t, SCR.r - SCR.l, SCR.b - SCR.t);
    // the wall with two slits
    o.fillStyle = '#5a5a7a'; o.fillRect(0, WALL - 10, SLITS[0] - 5, 20); o.fillRect(SLITS[0] + 5, WALL - 10, SLITS[1] - SLITS[0] - 10, 20); o.fillRect(SLITS[1] + 5, WALL - 10, 360 - SLITS[1] - 5, 20);
    o.fillStyle = '#8a8aaa'; o.fillRect(0, WALL - 10, SLITS[0] - 5, 3); o.fillRect(SLITS[0] + 5, WALL - 10, SLITS[1] - SLITS[0] - 10, 3); o.fillRect(SLITS[1] + 5, WALL - 10, 360 - SLITS[1] - 5, 3);
    // the gun
    o.fillStyle = '#4a4a6a'; o.beginPath(); o.roundRect(GUN[0] - 34, GUN[1] - 10, 68, 50, 12); o.fill(); o.fillStyle = '#7a7a9a'; o.beginPath(); o.roundRect(GUN[0] - 12, GUN[1] - 44, 24, 40, 6); o.fill();
    o.strokeStyle = '#e8b83a'; o.lineWidth = 3; for (let y = GUN[1] - 38; y < GUN[1] - 8; y += 7) { o.beginPath(); o.moveTo(GUN[0] - 13, y); o.lineTo(GUN[0] + 13, y + 3); o.stroke(); }
  }
  MG.add({
    id: 'atoms_fire', stage: 'atoms', cmd: 'FIRE ONE!', time: 6, mood: 'night', winText: 'Interference!', failText: 'Blob!',
    card: { title: 'One electron, two slits', kind: 'Physics', ref: 'The double-slit experiment',
      text: 'Each electron lands on the screen as one tiny dot, like a particle. But where it lands is random, and after many electrons the dots form bright and dark stripes.\n\nStripes like these happen when waves pass through two slits: the waves add up in some places and cancel out in others. So each electron travels like a wave through both slits at once, then lands in one spot. Cover one slit and the stripes vanish: the dots pile into one plain blob. This is the heart of quantum physics.',
      note: 'Single electrons land as dots, but together they build stripes, as waves through both slits would.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.need = [24, 30, 40][lv]; s.ant = lv >= 1;
      s.dots = []; s.fly = []; s.good = 0; s.flashT = -9; s.lastFire = -9;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.fly.push({ t0: g.t }); s.lastFire = g.t; g.sfx('click'); },
    update(g, dt) {
      const s = g.s;
      for (const e of s.fly) {
        const age = g.t - e.t0;
        if (!e.through && age > 0.22) { // it reaches the wall: through both slits, or only the open one
          e.through = true; const ax = antX(s, g.t), cov = SLITS.findIndex(sx => Math.abs(ax - sx) < 16);
          e.cov = cov; e.u = cov < 0 ? sample(g, two) : sample(g, u => one(u, SLITS[1 - cov]));
        }
        if (!e.done && age > 0.46) { e.done = true; const d = { x: 180 + e.u, y: SCR.t + 8 + g.rand() * (SCR.b - SCR.t - 16), t: g.t, blob: e.cov >= 0 }; s.dots.push(d); if (!d.blob) s.good++; else g.sfx('wrong'); g.sfx('pop'); }
      }
      s.fly = s.fly.filter(e => !e.done);
      if (s.good >= s.need && !g.done) { g.win(); g.sfx('cheer'); g.sfx('sparkle'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('fire_lab', paintLab), 0, 0, 360, 640);
      // the stripes, appearing as the dots pile up
      const k = Math.min(1, s.good / s.need);
      if (k > 0.25) { c.save(); c.globalCompositeOperation = 'lighter'; for (let x = SCR.l; x < SCR.r; x += 2) { const v = two(x - 180); c.fillStyle = `rgba(90,255,160,${0.35 * v * (k - 0.25) / 0.75})`; c.fillRect(x, SCR.t, 2, SCR.b - SCR.t); } c.restore(); }
      // every dot that has landed
      for (const d of s.dots) { const age = t - d.t; c.fillStyle = d.blob ? '#ff9a6a' : '#9affc0'; c.beginPath(); c.arc(d.x, d.y, age < 0.25 ? 6 - age * 10 : 3.4, 0, 7); c.fill(); if (age < 0.3) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(160,255,200,${1 - age / 0.3})`; c.beginPath(); c.arc(d.x, d.y, 10, 0, 7); c.fill(); c.restore(); } }
      // electrons in flight: a dot up to the wall, then a wave spreading from the open slit(s)
      for (const e of s.fly) {
        const age = t - e.t0;
        if (age < 0.22) { const y = SK.lerp(GUN[1] - 44, WALL, age / 0.22); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(140,220,255,0.9)'; c.beginPath(); c.arc(GUN[0], y, 5, 0, 7); c.fill(); c.fillStyle = 'rgba(140,220,255,0.3)'; c.beginPath(); c.arc(GUN[0], y, 12, 0, 7); c.fill(); c.restore(); }
        else { const r = (age - 0.22) / 0.24 * (WALL - SCR.b); c.save(); c.strokeStyle = `rgba(140,220,255,${0.5 * (1 - (age - 0.22) / 0.24)})`; c.lineWidth = 2; for (const [i, sx] of SLITS.entries()) { if (e.cov === i) continue; for (const dr of [0, -12]) if (r + dr > 0) { c.beginPath(); c.arc(sx, WALL, r + dr, Math.PI * 1.08, Math.PI * 1.92); c.stroke(); } } c.restore(); }
      }
      // the progress bead along the bottom of the screen
      c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(SCR.l, SCR.b + 14, SCR.r - SCR.l, 6); c.fillStyle = '#9affc0'; c.fillRect(SCR.l, SCR.b + 14, (SCR.r - SCR.l) * k, 6);
      // the gun's muzzle flash
      if (t - s.lastFire < 0.12) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(180,230,255,0.7)'; c.beginPath(); c.arc(GUN[0], GUN[1] - 46, 14, 0, 7); c.fill(); c.restore(); }
      // the ant with its leaf (levels 1 and 2), walking along the top of the wall
      const won = g.result === 'win', lost = g.result === 'fail';
      if (s.ant) { const ax = antX(s, t); if (ax > -50 && ax < 410) { c.save(); c.fillStyle = '#5ab84a'; c.strokeStyle = '#2a6a2a'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(ax, WALL + 2, 18, 24, 0.15, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(ax, WALL - 20); c.lineTo(ax, WALL + 24); c.stroke(); c.restore(); SK.animal(c, 'ant', ax - 22, WALL - 8, 0.72, { t, pose: 'carry', expr: 'laugh' }); } }
      SK.animal(c, 'ant', 300, 616, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      SK.glow(c, g, GUN[0], GUN[1] + 10, 36, '#ffe27a', { level: 0 });
      SK.demo(g, c, 'tap', [GUN[0], GUN[1] + 12], null, { period: 0.5, never: s.ant && SLITS.some(sx => Math.abs(antX(s, t + 0.22) - sx) < 26) });
    },
    // the bot: fire steadily, holding fire while the ant's leaf will cover a slit
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1) return; const per = g.level >= 2 ? 0.13 : 0.16;
      const ax = antX(s, g.t + 0.22), blocked = SLITS.some(sx => Math.abs(ax - sx) < 26);
      if (!blocked && g.t - s.lastFire >= per) { synth('down', GUN[0], GUN[1] + 10); synth('up', GUN[0], GUN[1] + 10); }
    },
  });
})();
