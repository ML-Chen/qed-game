// PUMP! (physics AP1-33) — a rabbit on a rope swing under a big tree, a golden bell high up at the far end of the swing.
// The fox stands behind. Tap to make the fox push. A push just as the swing comes back to the fox and turns round adds
// energy, so each swing goes a little higher; push in time with the swing's own rhythm and it climbs until the rabbit
// rings the bell. Push while it is still swinging toward the fox and the push fights the motion: the swing stops dead and
// the rabbit glares. The swing is a real pendulum (θ'' = -ω0² sin θ, with a little air drag).
// Level 2: no beat cue.
(() => {
  const PV = { x: 152, y: 192 }, LEN = 262, W0 = 4.1, A_WIN = 0.74, FOXX = 50, GND = 506, ZONE = -0.1;
  const seat = th => ({ x: PV.x + Math.sin(th) * LEN, y: PV.y + Math.cos(th) * LEN });
  const ampOf = (th, w) => Math.acos(SK.clamp(Math.cos(th) - w * w / (2 * W0 * W0), -1, 1));
  function paintPark(o) {
    P.sky(o, 360, 640, ['#ff9ac0', '#ffc890', '#fff2d0']);
    P.cloud(o, 70, 300, 0.6); P.cloud(o, 290, 360, 0.5);
    P.hills(o, 360, 450, 50, '#b8d870', '#80a848', { seed: 7 });
    const gr = o.createLinearGradient(0, 476, 0, 640); gr.addColorStop(0, '#a8d870'); gr.addColorStop(1, '#6a9a40'); o.fillStyle = gr; o.fillRect(0, 484, 360, 156);
    P.grassTufts(o, 360, 520, 610, 26, '#6aa34f', 3); P.flowers(o, 360, 530, 610, 14, undefined, 5);
    // the big tree: trunk at the left, a long branch reaching over the swing
    o.fillStyle = 'rgba(40,20,30,0.2)'; o.beginPath(); o.ellipse(14, GND + 4, 50, 10, 0, 0, 7); o.fill();
    const tg = o.createLinearGradient(-10, 0, 40, 0); tg.addColorStop(0, '#5a3020'); tg.addColorStop(1, '#8a5a3a'); o.fillStyle = tg;
    o.beginPath(); o.moveTo(-14, GND + 4); o.quadraticCurveTo(10, 360, 0, 190); o.lineTo(30, 170); o.quadraticCurveTo(36, 360, 42, GND + 4); o.closePath(); o.fill();
    o.beginPath(); o.moveTo(10, 200); o.quadraticCurveTo(160, 160, 360, 178); o.lineTo(360, 196); o.quadraticCurveTo(160, 182, 24, 226); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(40,20,10,0.35)'; o.lineWidth = 1.5; for (let i = 0; i < 6; i++) { o.beginPath(); o.moveTo(40 + i * 50, 186 + i * 0.5); o.lineTo(70 + i * 50, 184); o.stroke(); }
    // leafy canopy along the top
    const rnd = P.rng(9); for (let i = 0; i < 26; i++) { const x = -20 + rnd() * 400, y = 120 + rnd() * 60, r = 24 + rnd() * 26; const lg = o.createRadialGradient(x - r * 0.3, y - r * 0.4, 2, x, y, r); lg.addColorStop(0, '#9ad070'); lg.addColorStop(1, '#4a8a40'); o.fillStyle = lg; o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
    for (let i = 0; i < 10; i++) { o.fillStyle = '#ff8ab0'; o.beginPath(); o.arc(rnd() * 360, 110 + rnd() * 80, 3 + rnd() * 2, 0, 7); o.fill(); }
  }
  MG.add({
    id: 'pump', stage: 'waves', cmd: 'PUMP!', time: 6, mood: 'party', winText: 'Resonance!', failText: 'Too low!',
    card: { title: 'Push in time', kind: 'Physics', ref: 'Resonance',
      text: 'A swing goes back and forth at its own steady rhythm. That rhythm depends on the length of the rope, not on how hard you push.\n\nA push just as the swing turns round and starts to move away adds energy, so the next swing goes higher. Push at the same moment every time, matching the swing\'s own rhythm, and the swing climbs higher and higher. This is resonance.\n\nA push while the swing is still coming toward you works against it and takes energy away, so the swing slows down.',
      note: 'Small pushes at a thing\'s own rhythm add up to a big motion. This is resonance.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.th = 0.34; s.w = 0; s.gain = [0.15, 0.13, 0.12][L]; s.cue = L < 2; s.pushT = -9; s.badT = -9; s.lastTurn = -9; s.rang = 0; s.miss = -9; s.pushes = 0;
    },
    down(g) {
      const s = g.s; SK.touched(g); if (g.done || g.t - s.pushT < 0.35) return; s.pushT = g.t;
      if (s.th > ZONE) { s.miss = g.t; g.sfx('whoosh', { vol: 0.5 }); return; } // the fox shoves thin air
      if (s.w < -0.35) { s.w *= 0.1; s.badT = g.t; g.sfx('thud'); g.sfx('wrong'); return; } // the push fights the swing: it stops dead
      const A = ampOf(s.th, s.w), An = Math.min(1.35, A + s.gain); s.w = Math.sqrt(Math.max(0, 2 * W0 * W0 * (Math.cos(s.th) - Math.cos(An)))); s.pushes++;
      g.sfx('boing', { pitch: 0.9 + 0.1 * s.pushes, vol: 0.6 }); g.sfx('swoosh');
    },
    update(g, dt) {
      const s = g.s, n = 6, h = dt / n, w0 = s.w;
      for (let i = 0; i < n; i++) { s.w += (-W0 * W0 * Math.sin(s.th) - 0.06 * s.w) * h; s.th += s.w * h; }
      if (s.th < 0 && w0 < 0 && s.w >= 0) s.lastTurn = g.t; // the swing just turned round at the fox
      if (!g.done && s.th >= A_WIN - 0.01) { s.rang = g.t; g.sfx('bell'); g.sfx('cheer'); const b = seat(A_WIN); g.burst(b.x - 10, b.y - 70, ['#ffd45a', '#ffffff', '#ff8ab0'], 26, 220); g.win(); }
      if (s.rang) s.bellSw = Math.sin((g.t - s.rang) * 18) * Math.exp(-(g.t - s.rang) * 2) * 0.6;
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', p = seat(s.th), A = ampOf(s.th, s.w);
      c.drawImage(g.bake('pump_park', paintPark), 0, 0, 360, 640);
      // the golden bell up at the far end of the swing's path
      const bp = seat(A_WIN), bx = bp.x - 6, by = bp.y - 62;
      c.strokeStyle = '#5a3020'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, 184); c.lineTo(bx, by - 18); c.stroke();
      c.save(); c.translate(bx, by - 18); c.rotate(s.bellSw || Math.sin(t * 1.5) * 0.04);
      const bg = c.createLinearGradient(-16, 0, 16, 0); bg.addColorStop(0, '#f8d870'); bg.addColorStop(0.4, '#fff2b0'); bg.addColorStop(1, '#c89020'); c.fillStyle = bg; c.strokeStyle = '#7a5010'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(-14, 4, -15, 22); c.lineTo(-19, 30); c.lineTo(19, 30); c.lineTo(15, 22); c.quadraticCurveTo(14, 4, 4, 0); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#7a5010'; c.beginPath(); c.arc(0, 32, 4, 0, 7); c.fill(); c.restore();
      if (!g.done) SK.glow(c, g, bx, by + 2, 26, '#ffe27a', { level: 0 });
      // the highest point of this swing, as a faint arc
      if (!g.done && g.level < 2) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 3; c.setLineDash([4, 8]); c.beginPath(); c.arc(PV.x, PV.y, LEN + 8, Math.PI / 2 - Math.min(A, 1.3), Math.PI / 2 + Math.min(A, 1.3)); c.stroke(); c.restore(); }
      // the fox behind the swing, arms out to push
      const pushing = t - s.pushT < 0.3, lean = pushing ? 1 - (t - s.pushT) / 0.3 : 0;
      SK.animal(c, 'fox', FOXX + lean * 12, GND, 1.3, { t, pose: won ? 'cheer' : pushing ? 'point' : 'idle', expr: won ? 'laugh' : t - s.badT < 1.2 ? 'wow' : lost ? 'sad' : 'happy' });
      // the beat cue: a ring at the fox's paws that flashes as the swing turns round there
      if (s.cue && !g.done) { const k = SK.clamp(1 - (t - s.lastTurn) / 0.35, 0, 1); c.save(); c.strokeStyle = `rgba(255,240,150,${0.35 + 0.65 * k})`; c.lineWidth = 3 + k * 4; c.beginPath(); c.arc(FOXX + 36, GND - 56, 16 + k * 14, 0, 7); c.stroke(); c.restore(); }
      // the swing: two ropes and a plank with the rabbit
      c.save(); c.translate(PV.x, PV.y); c.rotate(-s.th);
      c.strokeStyle = '#c8a070'; c.lineWidth = 3; c.beginPath(); c.moveTo(-14, 0); c.lineTo(-22, LEN); c.moveTo(14, 0); c.lineTo(22, LEN); c.stroke();
      c.fillStyle = '#b8703a'; c.strokeStyle = '#6a3a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-30, LEN - 2, 60, 9, 3); c.fill(); c.stroke();
      SK.animal(c, 'rabbit', 2, LEN - 2, 1.05, { t, pose: won ? 'cheer' : 'balance', expr: won ? 'laugh' : t - s.badT < 1.4 ? 'sad' : A > 0.6 ? 'wow' : 'happy', noShadow: true, facing: s.w >= 0 ? 1 : -1 });
      c.restore();
      if (t - s.badT < 1.2) SK.tag(c, 'Hey!', p.x, p.y - 96, 20);
      SK.shadow(c, p.x, GND + 2, 26, 5, 0.18);
      const per = Math.PI * 2 / W0; let d0 = per / 2 - 0.45 * per; while (d0 < 0.7) d0 += per;
      SK.demo(g, c, 'tap', [FOXX + 40, GND - 50], null, { delay: d0, period: per });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done) return; if (s.lastTurn > 0 && g.t - s.lastTurn < 0.05 && g.t - s.pushT > 0.4) { synth('down', 180, 560); synth('up', 180, 560); } },
  });
})();
