// FLICKER! (earth_eng SC-15) — dimming an LED by switching it on and off very fast (pulse-width modulation). Each lamp
// needs its own brightness: a dim night-light so the sleeping frog stays asleep, a reading lamp for the owl, a bright
// porch light for the fox coming home. Hold the button to switch the LED on and let go to switch it off, while a
// cursor sweeps once across the "One blink" bar: that draws one on-off pattern. The robot's chip then repeats your
// pattern hundreds of times a second, too fast to see the blinking, so the LED looks steadily lit, and the longer the
// on part, the brighter it looks. Too long and the night-light wakes the frog; too short and the owl can't read.
// Level 0: two lamps; level 1: three; level 2: three, narrower bands and a faster sweep.
(() => {
  const BAR = { x0: 40, x1: 320, y: 444 }, MET = { x0: 40, x1: 320, y: 352 }, BTN = { x: 180, y: 560 }, BULB = { x: 180, y: 222 };
  const LAMPS = { night: { a: 'frog', d: 0.22, who: 'Night-light', bg: ['#1a1a48', '#3a3a7a'] }, read: { a: 'owl', d: 0.52, who: 'Reading lamp', bg: ['#3a2a5a', '#6a4a7a'] }, porch: { a: 'fox', d: 0.82, who: 'Porch light', bg: ['#1a2a4a', '#2a4a6a'] } };
  const ORDERS = [['night', 'porch', 'read'], ['porch', 'night', 'read'], ['read', 'night', 'porch'], ['night', 'read', 'porch']];
  const PL = [{ n: 2, band: 0.11, T: 1.5 }, { n: 3, band: 0.09, T: 1.3 }, { n: 3, band: 0.07, T: 1.1 }];
  function paintRoom(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#22204a'); bg.addColorStop(0.5, '#3a3060'); bg.addColorStop(1, '#1a1830'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const r = P.rng(8); for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.5})`; o.beginPath(); o.arc(r() * 360, 120 + r() * 200, 0.6 + r() * 1.2, 0, 7); o.fill(); }
    // the workbench with the chip and wires
    o.fillStyle = '#5a3a2a'; o.fillRect(0, 300, 360, 18); o.fillStyle = '#2a6a4a'; o.beginPath(); o.roundRect(40, 296, 64, 18, 4); o.fill(); o.fillStyle = '#1a1a1a'; o.fillRect(56, 299, 32, 12); o.strokeStyle = '#c0c0c0'; o.lineWidth = 1.5; for (let i = 0; i < 5; i++) { o.beginPath(); o.moveTo(58 + i * 7, 299); o.lineTo(58 + i * 7, 294); o.stroke(); }
    o.strokeStyle = '#c84a3a'; o.lineWidth = 3; o.beginPath(); o.moveTo(104, 304); o.quadraticCurveTo(150, 300, BULB.x - 8, 278); o.stroke(); o.strokeStyle = '#2a2a2a'; o.beginPath(); o.moveTo(104, 310); o.quadraticCurveTo(160, 308, BULB.x + 8, 278); o.stroke();
  }
  function newLamp(g) { const s = g.s; s.lamp = LAMPS[s.order[s.i]]; s.ph = 'ready'; s.on0 = 0; s.on1 = 0; s.t0 = 0; s.res = ''; s.born = g.t; s.d = 0; }
  MG.add({
    id: 'flicker', stage: 'robots', cmd: 'GIVE EACH LAMP ITS BRIGHTNESS!', time: 7, mood: 'night', winText: 'Just right!', failText: 'Wrong brightness!',
    card: { title: 'Dimming by blinking fast', kind: 'Robots', ref: 'Pulse-width modulation (PWM)',
      text: 'A robot\'s chip can only switch an LED fully on or fully off. To make it look dimmer, the chip switches it on and off hundreds of times a second.\n\nThat is too fast for your eyes to see the blinks, so the light looks steady. How bright it looks depends on how long each "on" part lasts compared with the whole blink.\n\nShort on-times look dim and long ones look bright. The same trick sets the speed of a robot\'s motors.',
      note: 'Switching an LED on and off very fast dims it: the longer the on-time, the brighter it looks.' },
    init(g) { const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.pl = PL[s.L]; s.order = ORDERS[s.v]; s.i = 0; newLamp(g); },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ph !== 'ready' || g.t - s.born < 0.25 || y < 480) return; s.ph = 'draw'; s.t0 = g.t; s.on0 = 0; s.on1 = null; s.held = true; g.sfx('click'); },
    up(g) { const s = g.s; if (s.ph !== 'draw' || !s.held) return; s.held = false; s.on1 = SK.clamp((g.t - s.t0) / s.pl.T, 0, 1); g.sfx('click', { pitch: 0.8 }); },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.ph === 'draw') { const k = (g.t - s.t0) / s.pl.T; s.cur = SK.clamp(k, 0, 1); if (k >= 1) { if (s.on1 == null) s.on1 = 1; s.held = false; s.ph = 'fast'; s.ft = g.t; s.d = s.on1; g.sfx('buzz', { vol: 0.3 });
          const ok = Math.abs(s.d - s.lamp.d) <= s.pl.band; s.res = ok ? 'ok' : s.d > s.lamp.d ? 'bright' : 'dim'; } }
      if (s.ph === 'fast') { g.held += dt; if (g.t - s.ft > 1.0) { if (s.res === 'ok') { s.i++; g.sfx('chime'); if (s.i >= s.pl.n) { g.win(); g.sfx('cheer'); } else newLamp(g); } else { g.fail(); g.sfx('laugh'); } } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', Lp = s.lamp;
      c.drawImage(g.bake('flicker_room', paintRoom), 0, 0, 360, 640);
      // how bright the LED looks: while you draw the blink it is simply on or off; once the chip repeats it fast it
      // looks steady at the on-fraction
      const live = s.ph === 'draw' ? (s.held ? 1 : 0) : s.ph === 'fast' ? s.d : 0, glowR = 40 + 150 * live;
      if (live > 0) { const gl = c.createRadialGradient(BULB.x, BULB.y, 8, BULB.x, BULB.y, glowR); gl.addColorStop(0, `rgba(255,240,170,${0.25 + 0.6 * live})`); gl.addColorStop(1, 'rgba(255,240,170,0)'); c.fillStyle = gl; c.fillRect(0, 100, 360, 240); }
      // the LED bulb
      c.save(); c.translate(BULB.x, BULB.y + 50); c.scale(1.35, 1.35); c.translate(-BULB.x, -BULB.y - 50); c.fillStyle = '#9a9aaa'; c.fillRect(BULB.x - 12, BULB.y + 22, 24, 28); c.fillStyle = P.mix('#6a6050', '#fff8c0', live); c.beginPath(); c.arc(BULB.x, BULB.y, 26, Math.PI * 0.85, Math.PI * 2.15); c.lineTo(BULB.x + 12, BULB.y + 24); c.lineTo(BULB.x - 12, BULB.y + 24); c.closePath(); c.fill(); c.strokeStyle = '#3a3448'; c.lineWidth = 2.5; c.stroke(); c.restore();
      SK.tag(c, 'LED', BULB.x + 74, BULB.y - 48, 18);
      // who this lamp is for, and how they react
      const ax = 76, ay = 296, ex = s.res === 'bright' ? 'wow' : s.res === 'dim' ? 'think' : s.res === 'ok' ? 'laugh' : Lp.a === 'frog' ? 'happy' : 'happy';
      SK.animal(c, Lp.a, 300, ay, 0.85, { t, pose: s.res === 'ok' || won ? 'cheer' : s.res ? 'sad' : 'idle', expr: Lp.a === 'frog' && !s.res && s.ph !== 'fast' ? 'laugh' : ex, facing: -1 });
      if (Lp.a === 'frog' && s.res !== 'bright' && !lost) N5.text(c, 'z z', 318, 220 + Math.sin(t * 3) * 4, 20, '#c8d8ff');
      SK.tag(c, Lp.who, 76, 150, 18);
      if (s.res === 'bright' && s.ph === 'fast') SK.tag(c, 'Too bright!', 300, 196, 18, '#fff6ea', 'rgba(200,60,60,0.92)');
      if (s.res === 'dim' && s.ph === 'fast') SK.tag(c, 'Too dim!', 300, 196, 18, '#fff6ea', 'rgba(200,60,60,0.92)');
      // the brightness meter: the band this lamp needs, and where your blink puts it
      c.save(); c.fillStyle = 'rgba(16,8,30,0.75)'; c.beginPath(); c.roundRect(MET.x0 - 14, MET.y - 20, MET.x1 - MET.x0 + 28, 40, 20); c.fill();
      const bx = d => MET.x0 + d * (MET.x1 - MET.x0); c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(MET.x0, MET.y - 6, MET.x1 - MET.x0, 12);
      const gr = c.createLinearGradient(MET.x0, 0, MET.x1, 0); gr.addColorStop(0, '#3a3448'); gr.addColorStop(1, '#fff6c0'); c.fillStyle = gr; c.fillRect(MET.x0, MET.y - 6, MET.x1 - MET.x0, 12);
      c.strokeStyle = '#5ad07a'; c.lineWidth = 4; c.strokeRect(bx(Lp.d - s.pl.band), MET.y - 10, bx(Lp.d + s.pl.band) - bx(Lp.d - s.pl.band), 20); c.restore();
      const md = s.ph === 'draw' ? (s.on1 ?? s.cur) : s.ph === 'fast' ? s.d : 0, inB = Math.abs(md - Lp.d) <= s.pl.band;
      c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(bx(md), MET.y - 12); c.lineTo(bx(md) - 8, MET.y - 24); c.lineTo(bx(md) + 8, MET.y - 24); c.closePath(); c.fill();
      N5.text(c, 'Brightness', 180, MET.y - 34, 18);
      // the one-blink bar: the on part (yellow) and off part (dark) as the cursor sweeps; repeated fast afterwards
      c.save(); c.fillStyle = 'rgba(16,8,30,0.75)'; c.beginPath(); c.roundRect(BAR.x0 - 14, BAR.y - 30, BAR.x1 - BAR.x0 + 28, 60, 16); c.fill(); c.restore();
      const W = BAR.x1 - BAR.x0, H = 36, top = BAR.y - H / 2;
      if (s.ph === 'fast') { const reps = 12, w = W / reps, off = ((t - s.ft) * 60) % w; c.save(); c.beginPath(); c.rect(BAR.x0, top - 2, W, H + 4); c.clip(); c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath();
        for (let i = -1; i <= reps; i++) { const x = BAR.x0 + i * w - off; c.moveTo(x, top + H); c.lineTo(x, top); c.lineTo(x + w * s.d, top); c.lineTo(x + w * s.d, top + H); c.lineTo(x + w, top + H); } c.stroke(); c.restore();
        N5.text(c, 'Repeated very fast', 180, BAR.y + 40, 16, '#c8d8ff'); }
      else { const cur = s.ph === 'draw' ? s.cur : 0, on1 = s.on1 ?? cur; c.fillStyle = '#ffd45a'; c.fillRect(BAR.x0, top, W * Math.min(on1, cur), H); c.fillStyle = '#4a4468'; if (cur > on1) c.fillRect(BAR.x0 + W * on1, top + H - 6, W * (cur - on1), 6);
        c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 2; c.strokeRect(BAR.x0, top, W, H);
        c.strokeStyle = '#5ad07a'; c.setLineDash([4, 4]); c.lineWidth = 2; for (const d of [Lp.d - s.pl.band, Lp.d + s.pl.band]) { c.beginPath(); c.moveTo(BAR.x0 + W * d, top - 4); c.lineTo(BAR.x0 + W * d, top + H + 4); c.stroke(); } c.setLineDash([]);
        c.fillStyle = '#fff6ea'; c.fillRect(BAR.x0 + W * cur - 2, top - 6, 4, H + 12);
        N5.text(c, 'One blink', 180, BAR.y + 40, 16, '#c8d8ff'); }
      if (s.ph === 'draw' && s.held && g.level <= 1) { const k = s.cur; SK.tag(c, k < Lp.d - s.pl.band ? 'Keep holding...' : k <= Lp.d + s.pl.band ? 'Let go now!' : 'Too long!', 180, 510, 20, '#fff6ea', k < Lp.d - s.pl.band ? 'rgba(30,14,36,0.8)' : k <= Lp.d + s.pl.band ? 'rgba(40,150,70,0.95)' : 'rgba(190,40,40,0.92)'); }
      if (!g.done) N5.slots(c, s.i, s.pl.n, 290, 150);
      // the hold button
      N5.button(c, BTN.x, BTN.y, 250, 58, s.ph === 'draw' && s.held ? 'LED on...' : 'Hold for LED on', s.ph === 'ready' ? '#e8a030' : '#7a6a8a', s.held ? 1 : 0, 22);
      if (s.ph === 'ready' && !g.done && g.t - s.born > 0.25) { SK.glow(c, g, BTN.x, BTN.y + 2, 60, '#ffe27a', { level: 2 }); SK.demo(g, c, 'hold', [BTN.x + 30, BTN.y + 4], null, { period: Math.max(0.5, Lp.d * s.pl.T / 0.65) }); }
    },
    // the bot holds for the middle of each lamp's band
    auto(g, dt, synth) { const s = g.s; if (g.done || (s.ph !== 'ready' && s.ph !== 'draw') || g.t - s.born < 0.6) return; SK.bot.hold(g, synth, 'lamp' + s.i, s.born + 0.6, BTN.x, BTN.y, s.lamp.d * s.pl.T); },
  });
})();
