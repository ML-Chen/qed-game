// GOAL! (physics PE-01) — a hedgehog with a spring paddle and a ball on the grass, a little open-backed goal across the
// meadow. Hold to pull the paddle back (the spring stretches), let go: the paddle snaps forward and the ball rolls as far as
// the push was hard, slowing steadily as the grass rubs on it. It must come to rest inside the goal. Then the goal hops to a
// new distance: two goals at level 0, three at levels 1 and 2. A tiny push stops short and a snail zooms past it; too hard
// a push rolls into the bushes and a bird flies out. Level 2: narrower goals and a pond at the far end.
(() => {
  const GY = 476, BR = 19, MU = 420, VMIN = 120, VMAX = 640, WIND_T = 1.6, PIV = { x: 84, y: GY }, BX = PIV.x + 44, POND = 326;
  function paintMeadow(o, L) {
    P.sky(o, 360, 640, ['#7ec8e8', '#bfe6f0', '#fff1c8']);
    P.cloud(o, 80, 150, 0.8); P.cloud(o, 270, 210, 0.6);
    P.hills(o, 360, 372, 60, '#a8d870', '#70a848', { seed: 4 });
    for (const [x, s] of [[30, 0.8], [320, 0.7], [210, 0.55]]) P.tree(o, x, 372, s);
    const gr = o.createLinearGradient(0, 390, 0, 640); gr.addColorStop(0, '#9ad060'); gr.addColorStop(1, '#5a9a3a'); o.fillStyle = gr; o.fillRect(0, 396, 360, 244);
    o.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < 6; i++) o.fillRect(i * 60, 396, 30, 244); // mowing stripes
    o.fillStyle = '#c8a870'; o.beginPath(); o.ellipse(PIV.x + 24, GY + 2, 40, 7, 0, 0, 7); o.fill(); // the tee spot
    if (L.pond) { // the pond at the far end
      const pg = o.createLinearGradient(0, GY - 6, 0, 640); pg.addColorStop(0, '#5ab4d4'); pg.addColorStop(1, '#1f6f8a');
      o.fillStyle = pg; o.beginPath(); o.moveTo(POND, GY - 2); o.quadraticCurveTo(POND + 14, GY + 40, POND + 4, 640); o.lineTo(380, 640); o.lineTo(380, GY - 2); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 2; for (let i = 0; i < 5; i++) { o.beginPath(); o.moveTo(POND + 14 + i * 4, GY + 20 + i * 24); o.lineTo(POND + 30 + i * 4, GY + 20 + i * 24); o.stroke(); }
      for (let i = 0; i < 4; i++) { o.fillStyle = '#4a8a3a'; o.beginPath(); o.ellipse(POND + 2, GY - 4 - i * 8, 3, 12, 0.2 * (i - 1.5), 0, 7); o.fill(); } // reeds
    } else { // a hedge at the far end
      for (let i = 0; i < 7; i++) { const x = POND + 6 + (i % 3) * 14, y = GY - 4 - Math.floor(i / 3) * 18 + (i % 2) * 4, r = 20 - Math.floor(i / 3) * 3; const hg = o.createRadialGradient(x - 6, y - 8, 2, x, y, r); hg.addColorStop(0, '#7ac060'); hg.addColorStop(1, '#3a7a30'); o.fillStyle = hg; o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
    }
    P.grassTufts(o, 360, 500, 610, 30, '#6aa34f', 8); P.flowers(o, 360, 510, 610, 18);
  }
  function goal(c, G, t, front, glow) { // a little open-backed goal seen from the side: two posts, a roof net, a pale box on the grass
    const x0 = G.x0, x1 = G.x1, top = GY - 86 + (G.hop || 0);
    if (!front) {
      c.save(); c.fillStyle = glow ? 'rgba(255,230,120,0.35)' : 'rgba(255,255,255,0.22)'; c.beginPath(); c.ellipse((x0 + x1) / 2, GY + 2, (x1 - x0) / 2, 7, 0, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.65)'; c.lineWidth = 1; for (let x = x0; x <= x1; x += 8) { c.beginPath(); c.moveTo(x, top + 6 * (x - x0) / (x1 - x0)); c.lineTo(x, top + 20); c.stroke(); }
      for (let y = top; y <= top + 20; y += 6) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y + 6); c.stroke(); }
      c.strokeStyle = '#e8e8f0'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, top + 6); c.lineTo(x1, GY); c.stroke(); c.restore(); return;
    }
    c.strokeStyle = glow ? '#ffe27a' : '#ffffff'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, GY); c.lineTo(x0, top); c.lineTo(x1, top + 6); c.stroke();
    c.strokeStyle = '#d84040'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, top + 12); c.lineTo(x0, top + 28); c.moveTo(x0, top + 44); c.lineTo(x0, top + 60); c.stroke();
  }
  function bird(c, x, y, k, t) { // flies up out of the hedge
    c.save(); c.translate(x + k * 60, y - k * 120); c.globalAlpha = Math.min(1, (1 - k) * 3); const f = Math.sin(t * 30) * 0.6;
    c.fillStyle = '#5a8ad8'; c.beginPath(); c.ellipse(0, 0, 10, 7, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(-2, -2); c.lineTo(-14, -12 * f - 4); c.lineTo(6, -2); c.fill(); c.beginPath(); c.moveTo(-2, 0); c.lineTo(-12, 10 * f + 4); c.lineTo(6, 0); c.fill();
    c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(9, -1); c.lineTo(15, 1); c.lineTo(9, 3); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(5, -2, 1.5, 0, 7); c.fill(); c.restore();
  }
  function snail(c, x, y, t, fast) {
    c.save(); c.translate(x, y); c.scale(1.4, 1.4);
    if (fast) { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-26 - i * 4, -6 - i * 6); c.lineTo(-46 - i * 8, -6 - i * 6); c.stroke(); } }
    c.fillStyle = '#e8c890'; c.strokeStyle = '#8a6a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-14, 0); c.lineTo(16, 0); c.quadraticCurveTo(22, -2, 20, -10); c.lineTo(16, -10); c.lineTo(12, -2); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#8a6a3a'; c.beginPath(); c.moveTo(18, -9); c.lineTo(20, -20); c.moveTo(15, -9); c.lineTo(14, -19); c.stroke(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(20, -20, 1.8, 0, 7); c.arc(14, -19, 1.8, 0, 7); c.fill();
    const sg = c.createRadialGradient(-4, -14, 2, -2, -10, 12); sg.addColorStop(0, '#f0a0c0'); sg.addColorStop(1, '#b0507a'); c.fillStyle = sg; c.beginPath(); c.arc(-2, -10, 11, 0, 7); c.fill(); c.strokeStyle = '#6a2a4a'; c.stroke();
    c.beginPath(); c.arc(-2, -10, 6, 0, 5); c.stroke(); c.restore();
  }
  function newBall(s) { s.b = { x: BX, v: 0, rot: 0 }; s.phase = 'ready'; s.snail = -40; s.splashT = 0; s.bushT = 0; }
  MG.add({
    id: 'goal', stage: 'motion', cmd: 'GOAL!', time: 7, mood: 'bright', winText: 'Friction!', failText: 'Missed!',
    card: { title: 'A harder push goes farther', kind: 'Physics', ref: 'Force and friction',
      text: 'The paddle pushes the ball. A harder push makes the ball start faster.\n\nAs the ball rolls, the grass rubs against it and slows it down a little every moment. That rubbing is called friction. A fast ball takes longer to slow to a stop, so it rolls farther.\n\nA gentle push gives a slow ball that stops soon. Too hard a push sends it right past the goal. To stop the ball in the goal, you push just hard enough.',
      note: 'The harder you push a ball, the faster it starts and the farther it rolls before friction stops it.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), w = [86, 70, 56][L];
      let cs = L === 0 ? [200, 286] : [196, 248, 296];
      if (L) { cs = cs.map(x => x + Math.round((g.rand() - 0.5) * 16)); for (let i = 2; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [cs[i], cs[j]] = [cs[j], cs[i]]; } }
      s.goals = cs.map(cx => ({ x0: Math.round(cx - w / 2), x1: Math.min(POND - 6, Math.round(cx + w / 2)) }));
      s.gi = 0; s.L = { pond: L === 2 }; s.wind = 0; s.hitT = 0; s.scored = []; s.next = 0; s.hopT = 0; newBall(s);
    },
    down(g) { const s = g.s; if (g.done || s.phase !== 'ready' || g.t < s.next) { SK.touched(g); return; } SK.holdStart(g); s.phase = 'wind'; g.sfx('stretch', { vol: 0.5 }); },
    up(g) { const s = g.s; if (s.phase !== 'wind') return; const h = SK.holdEnd(g); s.wind = SK.clamp(h / WIND_T, 0, 1); s.phase = 'swing'; s.hitT = g.t; },
    update(g, dt) {
      const s = g.s, b = s.b, G = s.goals[s.gi];
      if (s.phase === 'wind') s.windNow = SK.clamp(SK.held(g) / WIND_T, 0, 1);
      if (s.phase === 'swing' && g.t - s.hitT > 0.08) { b.v = VMIN + (VMAX - VMIN) * s.wind; s.phase = 'roll'; g.sfx('thud'); g.sfx('boing', { pitch: 0.8 + s.wind }); }
      if (s.phase === 'roll') {
        // rolling friction: the grass takes away the same bit of speed every moment
        b.v = Math.max(0, b.v - MU * dt); b.x += b.v * dt; b.rot += b.v * dt / BR;
        if (b.x > POND + 10) {
          if (s.L.pond) { s.splashT = g.t; g.sfx('splash'); g.burst(b.x, GY - 4, ['#ffffff', '#9ad8f0', '#5ab4d4'], 22, 220); }
          else { s.bushT = g.t; g.sfx('rustle'); g.sfx('tweet'); g.burst(b.x, GY - 20, ['#7ac060', '#3a7a30'], 14, 160); }
          g.sfx('laugh'); s.phase = 'miss'; s.next = g.t + 0.9;
        } else if (b.v <= 0) {
          if (b.x > G.x0 + 4 && b.x < G.x1 - 2) { // it stopped in the goal
            s.scored.push(b.x); g.sfx('cheer'); g.burst(b.x, GY - 30, ['#ffd45a', '#ff6a8a', '#ffffff'], 20, 180); s.gi++;
            if (s.gi >= s.goals.length) { s.phase = 'done'; g.win(); } else { s.phase = 'scored'; s.next = g.t + 0.8; s.hopT = g.t + 0.4; }
          } else { s.phase = 'miss'; s.next = g.t + 1.0; g.sfx('wrong'); if (b.x < G.x0) { s.snail = b.x - 60; g.sfx('laugh'); } }
        }
      }
      if (s.phase === 'miss' && s.snail > -40) s.snail += (s.snail < b.x + 60 ? 260 : 40) * dt; // the snail zooms past the short ball
      if ((s.phase === 'miss' || s.phase === 'scored') && g.t >= s.next && !g.done) { newBall(s); g.sfx('pop'); }
    },
    draw(g, c) {
      const s = g.s, b = s.b, t = g.t, won = g.result === 'win', lost = g.result === 'fail', G = s.goals[Math.min(s.gi, s.goals.length - 1)];
      c.drawImage(g.bake('goal_meadow2' + (s.L.pond ? 'p' : ''), o => paintMeadow(o, s.L)), 0, 0, 360, 640);
      const hop = s.hopT && t > s.hopT && t < s.hopT + 0.4 ? -Math.sin((t - s.hopT) / 0.4 * Math.PI) * 30 : 0; G.hop = hop;
      goal(c, G, t, false, s.phase === 'scored' || won);
      // balls already scored stay in their goals (the goal moved on, so they sit on the grass)
      const drawBall = (x, rot, a = 1) => { c.save(); c.globalAlpha = a; SK.shadow(c, x + 3, GY + 1, BR, 4, 0.25); c.translate(x, GY - BR); c.rotate(rot);
        SK.ball(c, 0, 0, BR, '#fff6ea', { edge: '#3a1640' }); c.fillStyle = '#2a2430'; for (let i = 0; i < 5; i++) { const q = i * 1.2566; c.beginPath(); c.arc(Math.cos(q) * 12, Math.sin(q) * 12, 4.4, 0, 7); c.fill(); } c.beginPath(); c.arc(0, 0, 4.6, 0, 7); c.fill(); c.restore(); };
      for (let i = 0; i < s.scored.length - (s.phase === 'scored' || won ? 1 : 0); i++) drawBall(s.scored[i], 0, 0.55);
      if (s.splashT) { const k = SK.clamp((t - s.splashT) * 1.5, 0, 1); c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.ellipse(b.x, GY + 10, 10 + k * 30, 3 + k * 8, 0, 0, 7); c.stroke(); }
      else if (s.bushT) bird(c, POND + 20, GY - 30, SK.clamp((t - s.bushT) * 1.2, 0, 1), t);
      else drawBall(b.x, b.rot);
      goal(c, G, t, true, s.phase === 'scored' || won);
      // the spring paddle: pulled back while you hold, snapping forward on release
      const wind = s.phase === 'wind' ? s.windNow : s.phase === 'swing' ? s.wind * (1 - SK.clamp((t - s.hitT) / 0.08, 0, 1)) : 0;
      const hx = PIV.x - 34 - wind * 14;
      SK.animal(c, 'hedgehog', hx, GY + 4, 1.3, { t, pose: won ? 'cheer' : lost ? 'sad' : wind > 0 ? 'carry' : 'idle', expr: won ? 'laugh' : lost || s.phase === 'miss' ? 'wow' : wind > 0.6 ? 'wow' : 'happy' });
      const ang = -0.15 - wind * 1.25;
      c.save(); c.translate(PIV.x, PIV.y); c.rotate(ang); c.scale(1.35, 1.35);
      c.strokeStyle = '#8a8a9a'; c.lineWidth = 3; c.beginPath(); const coils = 7; for (let i = 0; i <= coils * 8; i++) { const k = i / (coils * 8), y = -6 - k * 30, x = Math.sin(k * coils * Math.PI * 2) * (5 + wind * 2); i ? c.lineTo(x - 8, y) : c.moveTo(x - 8, y); } c.stroke();
      c.fillStyle = '#c8803a'; c.strokeStyle = '#6a3a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-3, -64, 9, 64, 4); c.fill(); c.stroke();
      c.fillStyle = P.mix('#e8a040', '#e84030', wind); c.beginPath(); c.roundRect(2, -64, 14, 34, 6); c.fill(); c.stroke();
      c.restore();
      c.fillStyle = '#5a5a6a'; c.beginPath(); c.arc(PIV.x, PIV.y, 6, 0, 7); c.fill();
      if (s.snail > -30) snail(c, s.snail, GY + 26, t, s.snail < b.x + 60);
      // goals still to score: little flags along the bottom
      for (let i = 0; i < s.goals.length; i++) { const x = 180 + (i - (s.goals.length - 1) / 2) * 30, y = 596; c.fillStyle = i < s.gi ? '#ffd45a' : 'rgba(255,255,255,0.45)'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); c.stroke(); }
      if (s.phase === 'ready' && !g.done) SK.glow(c, g, PIV.x + 10, GY - 54, 40);
      if (s.gi === 0) SK.demo(g, c, 'hold', [PIV.x + 14, GY - 46], null, { hold: 0.5, period: 2.2 });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || (s.phase !== 'ready' && s.phase !== 'wind') || g.t < s.next) return;
      const G = s.goals[s.gi], d = (G.x0 + G.x1) / 2 - BX, v = Math.sqrt(2 * MU * d), dur = SK.clamp((v - VMIN) / (VMAX - VMIN), 0, 1) * WIND_T + 1 / 120;
      SK.bot.hold(g, synth, 'wind' + s.gi + '_' + Math.floor(s.next * 10), Math.max(1.0, s.next + 0.1), PIV.x, GY - 40, dur);
    },
  });
})();
