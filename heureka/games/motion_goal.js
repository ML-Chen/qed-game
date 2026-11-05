// GOAL! (physics PE-01) — a hedgehog with a spring paddle and a ball on the grass, a little goal far across the meadow.
// Hold to pull the paddle back (the spring stretches), let go: the paddle snaps forward and the ball rolls as far as the
// push was hard, slowing steadily as the grass rubs on it. A tiny push stops halfway and a snail zooms past it.
// Level 2: no back net and a pond behind the goal, so too hard a push rolls through and splashes in.
(() => {
  const GY = 476, BR = 19, MU = 210, VMIN = 110, VMAX = 520, WIND_T = 1.5, PIV = { x: 84, y: GY };
  function paintMeadow(o, L) {
    P.sky(o, 360, 640, ['#7ec8e8', '#bfe6f0', '#fff1c8']);
    P.cloud(o, 80, 150, 0.8); P.cloud(o, 270, 210, 0.6);
    P.hills(o, 360, 372, 60, '#a8d870', '#70a848', { seed: 4 });
    for (const [x, s] of [[30, 0.8], [320, 0.7], [210, 0.55]]) P.tree(o, x, 372, s);
    const gr = o.createLinearGradient(0, 390, 0, 640); gr.addColorStop(0, '#9ad060'); gr.addColorStop(1, '#5a9a3a'); o.fillStyle = gr; o.fillRect(0, 396, 360, 244);
    o.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < 6; i++) o.fillRect(i * 60, 396, 30, 244); // mowing stripes
    o.fillStyle = '#c8a870'; o.beginPath(); o.ellipse(PIV.x + 24, GY + 2, 40, 7, 0, 0, 7); o.fill(); // the tee spot
    if (L.pond) { // the pond behind the goal
      const pg = o.createLinearGradient(0, GY - 6, 0, 640); pg.addColorStop(0, '#5ab4d4'); pg.addColorStop(1, '#1f6f8a');
      o.fillStyle = pg; o.beginPath(); o.moveTo(L.back + 6, GY - 2); o.quadraticCurveTo(L.back + 20, GY + 40, L.back + 10, 640); o.lineTo(380, 640); o.lineTo(380, GY - 2); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 2; for (let i = 0; i < 5; i++) { o.beginPath(); o.moveTo(L.back + 30 + i * 6, GY + 20 + i * 24); o.lineTo(L.back + 60 + i * 6, GY + 20 + i * 24); o.stroke(); }
      for (let i = 0; i < 4; i++) { o.fillStyle = '#4a8a3a'; o.beginPath(); o.ellipse(L.back + 4, GY - 4 - i * 8, 3, 12, 0.2 * (i - 1.5), 0, 7); o.fill(); } // reeds
    }
    P.grassTufts(o, 360, 500, 610, 30, '#6aa34f', 8); P.flowers(o, 360, 510, 610, 18);
  }
  function goal(c, L, t, front) { // a little goal seen from the side: posts, crossbar and net
    const x0 = L.mouth, x1 = L.back, top = GY - 92;
    if (!front) { // net behind
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1;
      for (let x = x0; x <= x1; x += 8) { c.beginPath(); c.moveTo(x, top); c.lineTo(x + (L.pond ? 0 : 0), GY); c.stroke(); }
      for (let y = top; y <= GY; y += 8) { c.beginPath(); c.moveTo(x0, y); c.lineTo(L.pond ? x0 + 14 : x1, y + (L.pond ? 0 : 0)); c.stroke(); }
      if (!L.pond) { c.strokeStyle = '#e8e8f0'; c.lineWidth = 3; c.beginPath(); c.moveTo(x1, top + 6); c.lineTo(x1, GY); c.stroke(); }
      c.restore(); return;
    }
    c.strokeStyle = '#ffffff'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, GY); c.lineTo(x0, top); c.lineTo(x1, top + 6); c.stroke();
    c.strokeStyle = '#d84040'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, top + 12); c.lineTo(x0, top + 28); c.moveTo(x0, top + 44); c.lineTo(x0, top + 60); c.stroke();
  }
  function snail(c, x, y, t, fast) {
    c.save(); c.translate(x, y); c.scale(1.4, 1.4);
    if (fast) { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-26 - i * 4, -6 - i * 6); c.lineTo(-46 - i * 8, -6 - i * 6); c.stroke(); } }
    c.fillStyle = '#e8c890'; c.strokeStyle = '#8a6a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-14, 0); c.lineTo(16, 0); c.quadraticCurveTo(22, -2, 20, -10); c.lineTo(16, -10); c.lineTo(12, -2); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#8a6a3a'; c.beginPath(); c.moveTo(18, -9); c.lineTo(20, -20); c.moveTo(15, -9); c.lineTo(14, -19); c.stroke(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(20, -20, 1.8, 0, 7); c.arc(14, -19, 1.8, 0, 7); c.fill();
    const sg = c.createRadialGradient(-4, -14, 2, -2, -10, 12); sg.addColorStop(0, '#f0a0c0'); sg.addColorStop(1, '#b0507a'); c.fillStyle = sg; c.beginPath(); c.arc(-2, -10, 11, 0, 7); c.fill(); c.strokeStyle = '#6a2a4a'; c.stroke();
    c.beginPath(); c.arc(-2, -10, 6, 0, 5); c.stroke(); c.restore();
  }
  MG.add({
    id: 'goal', stage: 'motion', cmd: 'GOAL!', time: 5, mood: 'bright', winText: 'Goal!', failText: 'Missed!',
    card: { title: 'A harder push goes farther', kind: 'Physics', ref: 'Force and motion',
      text: 'The paddle pushes the ball. A harder push makes the ball start faster.\n\nAs the ball rolls, the grass rubs against it and slows it down a little every moment. A fast ball takes longer to slow to a stop, so it rolls farther.\n\nA gentle push gives a slow ball that stops soon. Too hard a push sends it right past the goal. The rub of the grass is called friction.',
      note: 'The harder you push a ball, the faster it starts and the farther it rolls before friction stops it.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      const mouth = L === 0 ? 246 : L === 1 ? 222 + Math.floor(g.rand() * 40) : 196 + Math.floor(g.rand() * 24);
      s.L = { mouth, back: L === 2 ? mouth + 64 : Math.min(334, mouth + 74), pond: L === 2 };
      s.b = { x: PIV.x + 44, v: 0, rot: 0 }; s.wind = 0; s.phase = 'ready'; s.hitT = 0; s.stopT = 0; s.snail = -40; s.splashT = 0;
    },
    down(g) { const s = g.s; if (g.done || s.phase !== 'ready') { SK.touched(g); return; } SK.holdStart(g); s.phase = 'wind'; g.sfx('stretch', { vol: 0.5 }); },
    up(g) { const s = g.s; if (s.phase !== 'wind') return; const h = SK.holdEnd(g); s.wind = SK.clamp(h / WIND_T, 0, 1); s.phase = 'swing'; s.hitT = g.t; },
    update(g, dt) {
      const s = g.s, b = s.b, L = s.L;
      if (s.phase === 'wind') { s.windNow = SK.clamp(SK.held(g) / WIND_T, 0, 1); }
      if (s.phase === 'swing' && g.t - s.hitT > 0.08) { b.v = VMIN + (VMAX - VMIN) * s.wind; s.phase = 'roll'; g.sfx('thud'); g.sfx('boing', { pitch: 0.8 + s.wind }); }
      if (s.phase === 'roll') {
        // rolling friction: the grass takes away the same bit of speed every moment
        b.v = Math.max(0, b.v - MU * dt); b.x += b.v * dt; b.rot += b.v * dt / BR;
        if (!L.pond && b.x + BR > L.back - 2 && b.v > 0) { b.x = L.back - 2 - BR; b.v = 0; g.sfx('rustle'); s.netT = g.t; }
        if (L.pond && b.x > L.back + 14 && !s.splashT) { s.splashT = g.t; s.phase = 'sunk'; g.sfx('splash'); g.sfx('laugh'); g.burst(b.x, GY - 4, ['#ffffff', '#9ad8f0', '#5ab4d4'], 22, 220); if (!g.done) g.fail(); }
        if (b.v <= 0 && s.phase === 'roll') {
          s.phase = 'stop'; s.stopT = g.t;
          if (b.x - BR * 0.5 > L.mouth && b.x < L.back) { g.sfx('cheer'); g.burst(b.x, GY - 30, ['#ffd45a', '#ff6a8a', '#ffffff'], 24, 200); g.win(); }
          else { g.sfx('wrong'); g.sfx('laugh'); s.snail = b.x - 60; if (!g.done) g.fail(); }
        }
      }
      if (s.phase === 'stop' && g.result === 'fail') s.snail += (s.snail < b.x + 60 ? 260 : 40) * dt; // the snail zooms past
    },
    draw(g, c) {
      const s = g.s, b = s.b, L = s.L, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('goal_meadow' + (L.pond ? 'p' + L.mouth : ''), o => paintMeadow(o, L)), 0, 0, 360, 640);
      goal(c, L, t, false);
      // the ball (sinks into the pond on a splash)
      if (!s.splashT || t - s.splashT < 0.3) { SK.shadow(c, b.x + 3, GY + 1, BR, 4, 0.25); c.save(); c.translate(b.x, GY - BR); c.rotate(b.rot);
        SK.ball(c, 0, 0, BR, '#fff6ea', { edge: '#3a1640' }); c.fillStyle = '#2a2430'; for (let i = 0; i < 5; i++) { const a = i * 1.2566; c.beginPath(); c.arc(Math.cos(a) * 12, Math.sin(a) * 12, 4.4, 0, 7); c.fill(); } c.beginPath(); c.arc(0, 0, 4.6, 0, 7); c.fill(); c.restore(); }
      else { const k = SK.clamp((t - s.splashT) * 1.5, 0, 1); c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.ellipse(b.x, GY + 10, 10 + k * 30, 3 + k * 8, 0, 0, 7); c.stroke(); }
      goal(c, L, t, true);
      // the spring paddle: pulled back while you hold, snapping forward on release
      const wind = s.phase === 'wind' ? s.windNow : s.phase === 'swing' ? s.wind * (1 - SK.clamp((t - s.hitT) / 0.08, 0, 1)) : 0;
      // the hedgehog pulling the paddle back
      const hx = PIV.x - 34 - wind * 14;
      SK.animal(c, 'hedgehog', hx, GY + 4, 1.3, { t, pose: won ? 'cheer' : lost ? 'sad' : wind > 0 ? 'carry' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : wind > 0.6 ? 'wow' : 'happy' });
      const ang = -0.15 - wind * 1.25;
      c.save(); c.translate(PIV.x, PIV.y); c.rotate(ang); c.scale(1.35, 1.35);
      c.strokeStyle = '#8a8a9a'; c.lineWidth = 3; c.beginPath(); const coils = 7; for (let i = 0; i <= coils * 8; i++) { const k = i / (coils * 8), y = -6 - k * 30, x = Math.sin(k * coils * Math.PI * 2) * (5 + wind * 2); i ? c.lineTo(x - 8, y) : c.moveTo(x - 8, y); } c.stroke();
      c.fillStyle = '#c8803a'; c.strokeStyle = '#6a3a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-3, -64, 9, 64, 4); c.fill(); c.stroke();
      c.fillStyle = P.mix('#e8a040', '#e84030', wind); c.beginPath(); c.roundRect(2, -64, 14, 34, 6); c.fill(); c.stroke();
      c.restore();
      c.fillStyle = '#5a5a6a'; c.beginPath(); c.arc(PIV.x, PIV.y, 6, 0, 7); c.fill();
      if (s.snail > -30) snail(c, s.snail, GY + 26, t, s.snail < b.x + 60);
      if (s.phase === 'ready' && !g.done) SK.glow(c, g, PIV.x + 10, GY - 54, 40);
      SK.demo(g, c, 'hold', [PIV.x + 14, GY - 46], null, { hold: 1.4, period: 2.2 });
    },
    auto(g, dt, synth) {
      const s = g.s, L = s.L; if (s._botDur == null) { const d = (L.pond ? (L.mouth + L.back) / 2 + 4 : L.back - 8) - s.b.x, v = Math.sqrt(2 * MU * Math.max(10, d)); s._botDur = SK.clamp((v - VMIN) / (VMAX - VMIN), 0, 1) * WIND_T + 1 / 60; }
      SK.bot.hold(g, synth, 'wind', 1.0, PIV.x, GY - 40, s._botDur);
    },
  });
})();
