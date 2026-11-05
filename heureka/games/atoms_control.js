// CONTROL! (physics PHS-38) — a reactor core in a pool: yellow fuel rods, and dark control rods that hang from a bar.
// Drag the bar up to pull the rods out, down to push them in. Every split frees 2 or 3 neutrons; the rods soak up the
// extras. With the rods just right, each split causes exactly one more and the neutron counter holds steady in the green
// band, which fills the ring. Pull them all out and the count runs away: alarms flash and the beaver dives under the
// desk. Level 2: the reaction answers the rods only after a delay, so you have to move early and gently.
(() => {
  const CORE = { l: 62, r: 258, t: 330, b: 556 }, ROD = 232, TIP_OUT = 346, TIP_IN = 548, BAR = { x: 300, t: 196, b: 520 };
  const NMIN = Math.log(0.02), NMAX = Math.log(20), BAND = [Math.log(0.7), Math.log(1.45)];
  const barY = ln => SK.lerp(BAR.b, BAR.t, (SK.clamp(ln, NMIN, NMAX) - NMIN) / (NMAX - NMIN));
  const FUEL = [86, 136, 184, 234], CTRL = [111, 160, 209];
  function paintHall(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#1a2440'); bg.addColorStop(1, '#2a3a58'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(160,190,230,0.08)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 45) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 640); o.stroke(); }
    o.fillStyle = 'rgba(255,210,90,0.15)'; for (let x = -20; x < 380; x += 40) { o.beginPath(); o.moveTo(x, 600); o.lineTo(x + 20, 600); o.lineTo(x + 40, 640); o.lineTo(x + 20, 640); o.fill(); }
    // the pool and the core vessel
    o.fillStyle = '#3a4a68'; o.beginPath(); o.roundRect(CORE.l - 22, CORE.t - 14, CORE.r - CORE.l + 44, CORE.b - CORE.t + 34, 16); o.fill();
    o.fillStyle = '#0a2a48'; o.beginPath(); o.roundRect(CORE.l - 10, CORE.t - 4, CORE.r - CORE.l + 20, CORE.b - CORE.t + 14, 10); o.fill();
    o.fillStyle = '#5a6a88'; o.fillRect(CORE.l - 26, CORE.t - 20, CORE.r - CORE.l + 52, 12); o.fillStyle = '#8a9ab8'; o.fillRect(CORE.l - 26, CORE.t - 20, CORE.r - CORE.l + 52, 3);
    // the counter's bar: dark track, green band
    o.fillStyle = '#121a2a'; o.beginPath(); o.roundRect(BAR.x - 20, BAR.t - 10, 40, BAR.b - BAR.t + 20, 12); o.fill();
    o.fillStyle = '#3aa85a'; o.fillRect(BAR.x - 16, barY(BAND[1]), 32, barY(BAND[0]) - barY(BAND[1]));
    o.fillStyle = 'rgba(232,74,58,0.45)'; o.fillRect(BAR.x - 16, BAR.t - 6, 32, barY(Math.log(6)) - BAR.t + 6);
    o.strokeStyle = 'rgba(255,255,255,0.2)'; o.lineWidth = 1; for (let y = BAR.t; y <= BAR.b; y += 20) { o.beginPath(); o.moveTo(BAR.x - 16, y); o.lineTo(BAR.x - 8, y); o.stroke(); }
    // the control desk the beaver works at
    o.fillStyle = '#4a5a7a'; o.fillRect(250, 566, 110, 74); o.fillStyle = '#6a7a9a'; o.fillRect(246, 560, 118, 10);
    for (let i = 0; i < 4; i++) { o.fillStyle = ['#ff6a5a', '#ffd45a', '#6ae07a', '#6ac8ff'][i]; o.beginPath(); o.arc(268 + i * 22, 584, 5, 0, 7); o.fill(); }
  }
  MG.add({
    id: 'atoms_control', stage: 'atoms', cmd: 'CONTROL!', time: 6, mood: 'night', winText: 'Critical!', failText: 'Runaway!',
    card: { title: 'A steady chain reaction', kind: 'Physics', ref: 'Nuclear reactor control',
      text: 'In a reactor, each uranium nucleus that splits frees two or three neutrons. If more than one of them goes on to split another nucleus, the count grows faster and faster. If fewer than one does, the reaction dies out.\n\nControl rods are made of a metal that soaks up neutrons. Pushing them in slows the reaction, and pulling them out speeds it up. Operators keep them where each split causes exactly one more, so the reactor gives steady heat. Engineers call this steady state critical. Some neutrons come out a few seconds late, which gives people time to adjust the rods.',
      note: 'A reactor runs steadily when each split causes exactly one more split.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level);
      s.d = 1; s.de = 1; s.ln = Math.log(0.05); s.steady = 0; s.need = lv ? 2.8 : 2.4; s.lag = lv >= 2 ? 0.9 : 0.12; s.amp = [0.08, 0.11, 0.11][lv];
      s.ph = g.rand() * 6; s.bar = { x: 160, y: TIP_IN - ROD }; s.boom = 0; s.splits = [];
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (y > 120 && y < 600 && x < 280) SK.dragStart(g, s.bar, x, y); },
    move(g, x, y) { const s = g.s, b = SK.dragMove(g, x, y); if (!b) return; b.x = 160; b.y = SK.clamp(b.y, TIP_OUT - ROD, TIP_IN - ROD); s.d = (b.y - (TIP_OUT - ROD)) / (TIP_IN - TIP_OUT); },
    up(g) { SK.dragEnd(g); },
    update(g, dt) {
      const s = g.s; if (s.boom) return;
      s.de += (s.d - s.de) * Math.min(1, dt / s.lag); // the reaction feels the rods (after a delay at level 2)
      const d0 = 0.5 + s.amp * Math.sin(g.t * 0.9 + s.ph), rho = 3 * (d0 - s.de); // how many more (or fewer) than one split each split causes
      s.ln += (rho + 0.04 * Math.exp(-s.ln)) * dt; s.ln = Math.max(NMIN, s.ln);
      const inBand = s.ln > BAND[0] && s.ln < BAND[1]; s.steady = SK.clamp(s.steady + (inBand ? dt : -dt * 0.5), 0, s.need); s.inBand = inBand;
      if (s.ln >= NMAX && !g.done) { s.boom = g.t; g.fail(); g.sfx('rumble'); g.sfx('fail'); g.shake(10, 0.6); }
      if (s.steady >= s.need && !g.done) { g.win(); g.sfx('cheer'); }
      // a few visible splits, more of them the higher the count
      if (g.rand() < Math.min(0.9, Math.exp(s.ln) * 0.25) * dt * 30) s.splits.push({ x: CORE.l + 10 + g.rand() * (CORE.r - CORE.l - 20), y: CORE.t + 20 + g.rand() * (CORE.b - CORE.t - 40), t: g.t });
      s.splits = s.splits.filter(p => g.t - p.t < 0.5);
    },
    draw(g, c) {
      const s = g.s, t = g.t, n = Math.exp(s.ln), glow = SK.clamp(n / 1.6, 0, 1.4);
      c.drawImage(g.bake('control_hall', paintHall), 0, 0, 360, 640);
      // the blue glow of the water (it brightens with the neutron count)
      c.save(); c.beginPath(); c.roundRect(CORE.l - 10, CORE.t - 4, CORE.r - CORE.l + 20, CORE.b - CORE.t + 14, 10); c.clip();
      const gg = c.createRadialGradient(160, 450, 10, 160, 450, 170); gg.addColorStop(0, `rgba(120,200,255,${0.15 + 0.6 * Math.min(1, glow)})`); gg.addColorStop(1, `rgba(40,120,255,${0.05 + 0.25 * Math.min(1, glow)})`); c.fillStyle = gg; c.fillRect(0, 0, 360, 640);
      for (const x of FUEL) { const fg = c.createLinearGradient(x - 9, 0, x + 9, 0); fg.addColorStop(0, '#8a8a3a'); fg.addColorStop(0.5, '#e8e07a'); fg.addColorStop(1, '#8a8a3a'); c.fillStyle = fg; c.beginPath(); c.roundRect(x - 9, CORE.t + 6, 18, CORE.b - CORE.t - 4, 6); c.fill(); }
      // neutrons zipping between the rods, and flashes where nuclei split
      const k = Math.round(SK.clamp(8 + 9 * s.ln, 0, 60));
      for (let i = 0; i < k; i++) { const a = i * 2.39996, sp = 120 + (i * 37) % 80, q = (t * sp / 200 + i * 0.137) % 1; const x0 = CORE.l + ((i * 71) % 180), y0 = CORE.t + 20 + ((i * 113) % 190); const x = CORE.l + ((x0 - CORE.l + Math.cos(a) * q * 200) % 190 + 190) % 190, y = CORE.t + ((y0 - CORE.t + Math.sin(a) * q * 200) % 220 + 220) % 220; c.fillStyle = 'rgba(220,240,255,0.9)'; c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); }
      for (const p of s.splits) { const q = (t - p.t) / 0.5; c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 1 - q; c.fillStyle = '#fff6c0'; c.beginPath(); c.arc(p.x, p.y, 3 + q * 12, 0, 7); c.fill(); c.restore(); }
      c.restore();
      // the control rods and the bar they hang from
      const by = s.bar.y; c.save(); c.beginPath(); c.rect(0, 0, 360, CORE.b + 6); c.clip();
      for (const x of CTRL) { const rg = c.createLinearGradient(x - 7, 0, x + 7, 0); rg.addColorStop(0, '#2a2a34'); rg.addColorStop(0.5, '#6a6a7a'); rg.addColorStop(1, '#2a2a34'); c.fillStyle = rg; c.fillRect(x - 7, by, 14, ROD); }
      c.restore();
      c.fillStyle = '#5a6a88'; c.fillRect(CORE.l - 26, CORE.t - 20, CORE.r - CORE.l + 52, 12); // the lid in front of the rods
      for (const x of CTRL) { c.fillStyle = '#2a3048'; c.fillRect(x - 9, CORE.t - 22, 18, 16); }
      c.fillStyle = '#e8b83a'; c.strokeStyle = '#7a5a1a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(82, by - 16, 156, 20, 8); c.fill(); c.stroke();
      c.fillStyle = '#f2d27a'; c.fillRect(90, by - 12, 140, 4); c.fillStyle = '#7a5a1a'; c.beginPath(); c.roundRect(146, by - 30, 28, 18, 6); c.fill();
      // the counter: a bead that rides up and down the bar, and the ring that fills while it holds in the green
      const cy = barY(s.ln); SK.ball(c, BAR.x, cy, 13, s.inBand ? '#7aff9a' : s.ln > BAND[1] ? '#ff7a5a' : '#9ab8e0');
      const rk = s.steady / s.need; c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 8; c.beginPath(); c.arc(BAR.x, 160, 18, 0, 7); c.stroke();
      c.strokeStyle = '#7aff9a'; c.lineCap = 'round'; c.beginPath(); c.arc(BAR.x, 160, 18, -Math.PI / 2, -Math.PI / 2 + rk * Math.PI * 2); c.stroke();
      // alarms when it runs away
      const hot = s.ln > Math.log(6); if (hot || s.boom) { const on = Math.sin(t * 18) > 0; c.fillStyle = on ? 'rgba(255,60,40,0.28)' : 'rgba(255,60,40,0.08)'; c.fillRect(0, 0, 360, 640); for (const x of [26, 334]) { c.fillStyle = on ? '#ff4a3a' : '#6a1a1a'; c.beginPath(); c.arc(x, 150, 12, Math.PI, 0); c.fill(); } }
      // the beaver at the desk, diving under it when things run away
      const won = g.result === 'win', hide = !!s.boom || hot;
      SK.animal(c, 'beaver', 306, hide ? 640 : 560, 0.72, { t, pose: won ? 'cheer' : hide ? 'sad' : 'idle', expr: won ? 'laugh' : hide ? 'wow' : 'happy', facing: -1 });
      c.fillStyle = '#4a5a7a'; c.fillRect(250, 572, 110, 68); c.fillStyle = '#6a7a9a'; c.fillRect(246, 566, 118, 8);
      for (let i = 0; i < 4; i++) { c.fillStyle = ['#ff6a5a', '#ffd45a', '#6ae07a', '#6ac8ff'][i]; c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 3 + i); c.beginPath(); c.arc(268 + i * 22, 592, 5, 0, 7); c.fill(); } c.globalAlpha = 1;
      if (!s.touched) SK.glow(c, g, 160, by - 12, 34);
      SK.demo(g, c, 'drag', [160, by - 10], [160, by - 110], { period: 2 });
    },
    // the bot: a gentle controller that steers the count toward the middle of the band
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1) return;
      if (!s.botOn) { s.botOn = true; s.botY = s.bar.y + 10; synth('down', 160, s.botY); return; }
      const d0 = 0.5 + s.amp * Math.sin(g.t * 0.9 + s.ph), err = s.ln - (BAND[0] + BAND[1]) / 2, slope = (s.d - s.de);
      const want = SK.clamp(d0 + 0.32 * err + (s.lag > 0.5 ? 0.6 * slope : 0), 0, 1);
      s.botY = (TIP_OUT - ROD) + want * (TIP_IN - TIP_OUT) + 10; synth('move', 160, s.botY);
    },
  });
})();
