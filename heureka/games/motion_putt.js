// PUTT! (physics PE-01, reworked from GOAL!) — a mini-golf green: a hedgehog with a putter, a ball, and a hole with a
// flag. Hold to swing the putter back (farther the longer you hold), let go: it swings through and the ball rolls as fast
// as the push was hard, slowing steadily as the grass rubs on it (grass flicks and dust puffs show the rubbing). The ball
// drops in only if it reaches the hole and is slow enough there: too gentle stops short and a snail zooms past it; too
// hard hops right over the hole and rolls on into the hedge (a bird flies out) or, at level 2, the pond.
// Two holes at level 0, three at levels 1 and 2, each at a new distance; the hole is narrower to catch at higher levels.
(() => {
  const GY = 476, BR = 16, MU = 420, VMIN = 120, VMAX = 640, WIND_T = 2.0, GRIP = { x: 70, y: GY - 80 }, PL = 82, A0 = 0.33;
  const BX = GRIP.x + Math.sin(A0) * PL + BR + 6, END = 326, HR = 19;
  function paintGreen(o, L) {
    P.sky(o, 360, 640, ['#7ec8e8', '#bfe6f0', '#fff1c8']);
    P.cloud(o, 80, 150, 0.8); P.cloud(o, 270, 220, 0.6);
    P.hills(o, 360, 360, 60, '#a8d870', '#70a848', { seed: 4 });
    for (const [x, s] of [[30, 0.8], [320, 0.7], [210, 0.55]]) P.tree(o, x, 360, s);
    // the putting green: a raised strip of short bright grass with a border
    const gr = o.createLinearGradient(0, 380, 0, 640); gr.addColorStop(0, '#7ab84a'); gr.addColorStop(1, '#4a8a30'); o.fillStyle = gr; o.fillRect(0, 384, 360, 256);
    o.fillStyle = '#e8d8a8'; o.fillRect(0, GY + 8, 360, 14); o.fillStyle = '#c8b888'; o.fillRect(0, GY + 20, 360, 4);
    const gg = o.createLinearGradient(0, GY - 40, 0, GY + 8); gg.addColorStop(0, '#9ae070'); gg.addColorStop(1, '#6ac050'); o.fillStyle = gg; o.fillRect(0, GY - 14, 360, 22);
    o.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < 9; i++) o.fillRect(i * 40, GY - 14, 20, 22);
    if (L.pond) {
      const pg = o.createLinearGradient(0, GY - 6, 0, 640); pg.addColorStop(0, '#5ab4d4'); pg.addColorStop(1, '#1f6f8a');
      o.fillStyle = pg; o.beginPath(); o.moveTo(END, GY - 10); o.quadraticCurveTo(END + 10, GY + 60, END, 640); o.lineTo(380, 640); o.lineTo(380, GY - 10); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 2; for (let i = 0; i < 5; i++) { o.beginPath(); o.moveTo(END + 10 + i * 3, GY + 20 + i * 24); o.lineTo(END + 28 + i * 3, GY + 20 + i * 24); o.stroke(); }
      for (let i = 0; i < 4; i++) { o.fillStyle = '#4a8a3a'; o.beginPath(); o.ellipse(END + 2, GY - 18 - i * 8, 3, 12, 0.2 * (i - 1.5), 0, 7); o.fill(); }
    } else for (let i = 0; i < 7; i++) { const x = END + 8 + (i % 3) * 14, y = GY - 16 - Math.floor(i / 3) * 18 + (i % 2) * 4, r = 20 - Math.floor(i / 3) * 3; const hg = o.createRadialGradient(x - 6, y - 8, 2, x, y, r); hg.addColorStop(0, '#7ac060'); hg.addColorStop(1, '#3a7a30'); o.fillStyle = hg; o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
    P.grassTufts(o, 360, 520, 610, 30, '#3a7a28', 8); P.flowers(o, 360, 520, 610, 18);
  }
  function hole(c, x, t, glow, sunk) { // the cup in the grass and its flag
    c.fillStyle = '#1e2a14'; c.beginPath(); c.ellipse(x, GY + 1, HR, 6, 0, 0, 7); c.fill(); c.fillStyle = '#3a4a24'; c.beginPath(); c.ellipse(x, GY - 1, HR, 4, 0, Math.PI, 0); c.fill();
    if (glow) { c.save(); c.strokeStyle = `rgba(255,226,122,${0.5 + 0.4 * Math.sin(t * 6)})`; c.lineWidth = 3; c.beginPath(); c.ellipse(x, GY + 1, HR + 6, 9, 0, 0, 7); c.stroke(); c.restore(); }
    c.strokeStyle = '#f4f0e8'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 8, GY); c.lineTo(x + 8, GY - 110); c.stroke();
    const w = Math.sin(t * 4) * 4; c.fillStyle = sunk ? '#ffd45a' : '#e84a4a'; c.beginPath(); c.moveTo(x + 9, GY - 110); c.quadraticCurveTo(x + 30, GY - 104 + w, x + 46, GY - 98 + w); c.quadraticCurveTo(x + 30, GY - 92, x + 9, GY - 84); c.closePath(); c.fill();
  }
  function snail(c, x, y, fast) {
    c.save(); c.translate(x, y); c.scale(1.4, 1.4);
    if (fast) { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-26 - i * 4, -6 - i * 6); c.lineTo(-46 - i * 8, -6 - i * 6); c.stroke(); } }
    c.fillStyle = '#e8c890'; c.strokeStyle = '#8a6a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-14, 0); c.lineTo(16, 0); c.quadraticCurveTo(22, -2, 20, -10); c.lineTo(16, -10); c.lineTo(12, -2); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#8a6a3a'; c.beginPath(); c.moveTo(18, -9); c.lineTo(20, -20); c.moveTo(15, -9); c.lineTo(14, -19); c.stroke(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(20, -20, 1.8, 0, 7); c.arc(14, -19, 1.8, 0, 7); c.fill();
    const sg = c.createRadialGradient(-4, -14, 2, -2, -10, 12); sg.addColorStop(0, '#f0a0c0'); sg.addColorStop(1, '#b0507a'); c.fillStyle = sg; c.beginPath(); c.arc(-2, -10, 11, 0, 7); c.fill(); c.strokeStyle = '#6a2a4a'; c.stroke();
    c.beginPath(); c.arc(-2, -10, 6, 0, 5); c.stroke(); c.restore();
  }
  function bird(c, x, y, k, t) {
    c.save(); c.translate(x + k * 60, y - k * 120); c.globalAlpha = Math.min(1, (1 - k) * 3); const f = Math.sin(t * 30) * 0.6;
    c.fillStyle = '#5a8ad8'; c.beginPath(); c.ellipse(0, 0, 10, 7, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(-2, -2); c.lineTo(-14, -12 * f - 4); c.lineTo(6, -2); c.fill(); c.beginPath(); c.moveTo(-2, 0); c.lineTo(-12, 10 * f + 4); c.lineTo(6, 0); c.fill();
    c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(9, -1); c.lineTo(15, 1); c.lineTo(9, 3); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(5, -2, 1.5, 0, 7); c.fill(); c.restore();
  }
  function golfBall(c, x, y, rot) { SK.shadow(c, x + 3, GY + 1, BR, 4, 0.25); c.save(); c.translate(x, y); c.rotate(rot); SK.ball(c, 0, 0, BR, '#ffffff', { edge: '#6a6a7a' }); c.fillStyle = 'rgba(120,120,140,0.35)'; for (let i = 0; i < 7; i++) { const q = i * 0.9; c.beginPath(); c.arc(Math.cos(q) * 9, Math.sin(q) * 9, 1.8, 0, 7); c.fill(); } c.restore(); }
  const vWin = (s, H) => { const d = H - BX, lo = Math.sqrt(2 * MU * d); return [lo, Math.sqrt(lo * lo + s.cap * s.cap)]; }; // the starting speeds that sink it
  function newBall(s) { s.b = { x: BX, y: GY - BR, v: 0, vy: 0, rot: 0, hopped: false }; s.phase = 'ready'; s.snail = -40; s.splashT = 0; s.bushT = 0; s.sinkT = 0; }
  MG.add({
    id: 'putt', stage: 'motion', cmd: 'PUTT INTO THE HOLE!', time: 7, mood: 'bright', winText: 'Friction!', failText: 'Missed!',
    card: { title: 'A harder push goes farther', kind: 'Physics', ref: 'Force and friction',
      text: 'The putter pushes the ball. A harder push makes the ball start faster.\n\nAs the ball rolls, the grass rubs against it and slows it down a little every moment. That rubbing is called friction. A fast ball takes longer to slow to a stop, so it rolls farther.\n\nA gentle push stops short of the hole. A hard push is still fast when it reaches the hole, so it hops over. To sink it, push just hard enough to arrive slowly.',
      note: 'The harder you push a ball, the faster it starts and the farther it rolls before friction stops it.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      let hs = L === 0 ? [200, 286] : [196, 248, 300];
      if (L) { hs = hs.map(x => x + Math.round((g.rand() - 0.5) * 16)); for (let i = 2; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [hs[i], hs[j]] = [hs[j], hs[i]]; } }
      s.holes = hs; s.hi = 0; s.cap = [300, 255, 215][L]; s.L = { pond: L === 2 }; s.wind = 0; s.hitT = 0; s.next = 0; s.bits = []; newBall(s);
    },
    down(g) { const s = g.s; if (g.done || s.phase !== 'ready' || g.t < s.next) { SK.touched(g); return; } SK.holdStart(g); s.phase = 'wind'; g.sfx('stretch', { vol: 0.4 }); },
    up(g) { const s = g.s; if (s.phase !== 'wind') return; const h = SK.holdEnd(g); s.wind = SK.clamp(h / WIND_T, 0, 1); s.phase = 'swing'; s.hitT = g.t; },
    update(g, dt) {
      const s = g.s, b = s.b, H = s.holes[s.hi];
      if (s.phase === 'wind') s.windNow = SK.clamp(SK.held(g) / WIND_T, 0, 1);
      if (s.phase === 'swing' && g.t - s.hitT > 0.1) { b.v = VMIN + (VMAX - VMIN) * s.wind; s.phase = 'roll'; g.sfx('click'); g.sfx('tap', { pitch: 0.7 }); }
      if (s.phase === 'roll') {
        // rolling friction: the grass takes away the same bit of speed every moment
        const x0 = b.x; b.v = Math.max(0, b.v - MU * dt); b.x += b.v * dt; b.rot += b.v * dt / BR;
        if (b.vy || b.y < GY - BR) { b.vy += 1400 * dt; b.y += b.vy * dt; if (b.y >= GY - BR) { b.y = GY - BR; b.vy = 0; } }
        if (g.rand() < b.v / 500) s.bits.push({ x: b.x - BR * 0.6, y: GY - 2, vx: -40 - g.rand() * 60, vy: -60 - g.rand() * 80, life: 0.5, col: g.rand() < 0.5 ? '#c8a870' : '#5aa040' });
        if (x0 < H && b.x >= H) { // passing over the hole
          if (b.v < s.cap) { s.phase = 'sink'; s.sinkT = g.t; b.x = H; g.sfx('drip'); g.sfx('cheer'); g.burst(H, GY - 20, ['#ffd45a', '#ffffff', '#ff6a8a'], 20, 180); }
          else { b.vy = -Math.min(220, (b.v - s.cap) * 1.4 + 90); b.y = GY - BR - 1; b.v *= 0.88; s.hopT = g.t; g.sfx('boing', { pitch: 1.4, vol: 0.5 }); }
        }
        if (s.phase === 'roll' && b.x > END + 10) {
          if (s.L.pond) { s.splashT = g.t; g.sfx('splash'); g.burst(b.x, GY - 4, ['#ffffff', '#9ad8f0', '#5ab4d4'], 22, 220); }
          else { s.bushT = g.t; g.sfx('rustle'); g.sfx('tweet'); g.burst(b.x, GY - 20, ['#7ac060', '#3a7a30'], 14, 160); }
          g.sfx('laugh'); s.phase = 'miss'; s.next = g.t + 0.9;
        } else if (s.phase === 'roll' && b.v <= 0 && !b.vy) { s.phase = 'miss'; s.next = g.t + 1.0; g.sfx('wrong'); if (b.x < H) { s.snail = b.x - 60; g.sfx('laugh'); } }
      }
      if (s.phase === 'sink' && g.t - s.sinkT > 0.45) { s.hi++; if (s.hi >= s.holes.length) { s.phase = 'done'; g.win(); } else { s.phase = 'scored'; s.next = g.t + 0.3; } }
      for (const p of s.bits) { p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } s.bits = s.bits.filter(p => p.life > 0);
      if (s.phase === 'miss' && s.snail > -40) s.snail += (s.snail < b.x + 60 ? 260 : 40) * dt; // the snail zooms past the short ball
      if ((s.phase === 'miss' || s.phase === 'scored') && g.t >= s.next && !g.done) { newBall(s); g.sfx('pop'); }
    },
    draw(g, c) {
      const s = g.s, b = s.b, t = g.t, won = g.result === 'win', lost = g.result === 'fail', H = s.holes[Math.min(s.hi, s.holes.length - 1)];
      c.drawImage(g.bake('putt_green' + (s.L.pond ? 'p' : ''), o => paintGreen(o, s.L)), 0, 0, 360, 640);
      hole(c, H, t, s.phase === 'ready' && !g.done, s.phase === 'sink' || won);
      // dust and grass flicked up by the rubbing, and a speed trail that shrinks as the ball slows
      for (const p of s.bits) { c.globalAlpha = Math.min(1, p.life * 3); c.fillStyle = p.col; c.beginPath(); c.ellipse(p.x, p.y, 2.5, 1.5, 0, 0, 7); c.fill(); } c.globalAlpha = 1;
      if (s.phase === 'roll' && b.v > 20) { c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const L = b.v * 0.09 * (1 - i * 0.25); c.beginPath(); c.moveTo(b.x - BR - 4, b.y - 8 + i * 8); c.lineTo(b.x - BR - 4 - L, b.y - 8 + i * 8); c.stroke(); } }
      if (s.splashT) { const k = SK.clamp((t - s.splashT) * 1.5, 0, 1); c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.ellipse(b.x, GY + 10, 10 + k * 30, 3 + k * 8, 0, 0, 7); c.stroke(); }
      else if (s.bushT) bird(c, END + 20, GY - 30, SK.clamp((t - s.bushT) * 1.2, 0, 1), t);
      else if (s.phase === 'sink') { const k = SK.clamp((t - s.sinkT) / 0.3, 0, 1); c.save(); c.beginPath(); c.rect(0, 0, 360, GY + 1); c.clip(); golfBall(c, b.x, GY - BR + k * (BR * 2 + 4), b.rot); c.restore(); }
      else if (s.phase !== 'scored' && s.phase !== 'done') golfBall(c, b.x, b.y, b.rot);
      // the hedgehog and its putter: swung back while you hold, through on release
      const wind = s.phase === 'wind' ? s.windNow : s.phase === 'swing' ? s.wind * (1 - SK.clamp((t - s.hitT) / 0.1, 0, 1)) : 0;
      SK.animal(c, 'hedgehog', GRIP.x - 26, GY + 4, 1.45, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost || s.phase === 'miss' ? 'wow' : wind > 0.6 ? 'wow' : 'happy' });
      const a = A0 - wind * 1.3 + (s.phase === 'roll' && t - s.hitT < 0.3 ? -0.25 * Math.sin((t - s.hitT) / 0.3 * Math.PI) * -1 : 0), hx = GRIP.x + Math.sin(a) * PL, hy = GRIP.y + Math.cos(a) * PL;
      c.strokeStyle = '#8a8a9a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(GRIP.x, GRIP.y); c.lineTo(hx, hy); c.stroke();
      c.fillStyle = '#2a2a3a'; c.beginPath(); c.arc(GRIP.x, GRIP.y, 5, 0, 7); c.fill();
      c.save(); c.translate(hx, hy); c.rotate(-a); c.fillStyle = P.mix('#c8c8d8', '#e84030', wind); c.strokeStyle = '#3a3a4a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-6, -6, 20, 10, 3); c.fill(); c.stroke(); c.restore();
      if (s.snail > -30) snail(c, s.snail, GY + 26, s.snail < b.x + 60);
      for (let i = 0; i < s.holes.length; i++) { const x = 180 + (i - (s.holes.length - 1) / 2) * 30, y = 596; c.fillStyle = i < s.hi ? '#ffd45a' : 'rgba(255,255,255,0.45)'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); c.stroke(); }
      if (s.phase === 'ready' && !g.done) { SK.glow(c, g, GRIP.x + 14, GY - 40, 40, undefined, { level: 2 }); SK.demo(g, c, 'hold', [GRIP.x + 16, GY - 40], null, { period: 2.2 }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || (s.phase !== 'ready' && s.phase !== 'wind') || g.t < s.next) return;
      const [lo, hi] = vWin(s, s.holes[s.hi]), v = (lo + hi) / 2, dur = SK.clamp((v - VMIN) / (VMAX - VMIN), 0, 1) * WIND_T + 1 / 120;
      SK.bot.hold(g, synth, 'wind' + s.hi + '_' + Math.floor(s.next * 10), Math.max(1.0, s.next + 0.1), GRIP.x, GY - 40, dur);
    },
  });
})();
