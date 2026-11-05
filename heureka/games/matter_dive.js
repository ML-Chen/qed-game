// STOP THE SUB AT EACH PEARL! (chemistry CB MC-05 RAFT!, reworked so the player acts instead of picking the floater)
// A duck pilots a little submarine in a lake. One control: the tank lever. Push it down and water floods the sub's tank,
// so the sub (the same size as before) is heavier than the water it pushes aside and it sinks; push it up and air blows
// the water out, so it is lighter for its size and rises. Set it at the line between and it hovers. Hover beside each
// oyster ledge on the cliff and the claw picks its pearl. Floating and sinking depend on weight for size: the huge log on
// the surface floats, the little pebbles lie on the bottom. Level 0 and 1: three pearls, a "Hover" notch on the lever;
// level 2: four pearls, no notch, a narrower band.
(() => {
  const SURF = 176, FLOOR = 584, SX = 170, LV = { x: 330, t: 232, b: 520 }, G = 900, DRAG = 3, BAND = [24, 24, 17];
  const DEPTHS = [[330, 470, 340, 500], [300, 450, 545, 420], [360, 520, 400, 290], [420, 300, 460, 545]];
  function paintLake(o) {
    const sky = o.createLinearGradient(0, 0, 0, SURF); sky.addColorStop(0, '#f7c6a0'); sky.addColorStop(1, '#ffe8c8'); o.fillStyle = sky; o.fillRect(0, 0, 360, SURF);
    P.cloud(o, 260, 140, 0.55); o.fillStyle = '#8aa870'; o.beginPath(); o.moveTo(0, SURF); o.quadraticCurveTo(70, SURF - 50, 150, SURF - 10); o.lineTo(150, SURF); o.closePath(); o.fill();
    const wa = o.createLinearGradient(0, SURF, 0, 640); wa.addColorStop(0, '#5ac0d8'); wa.addColorStop(0.45, '#2a7aa8'); wa.addColorStop(1, '#16385e'); o.fillStyle = wa; o.fillRect(0, SURF, 360, 640 - SURF);
    o.save(); o.globalAlpha = 0.12; o.fillStyle = '#ffffff'; for (let i = 0; i < 5; i++) { o.beginPath(); o.moveTo(60 + i * 70, SURF); o.lineTo(90 + i * 70, SURF); o.lineTo(40 + i * 80, 560); o.lineTo(10 + i * 80, 560); o.closePath(); o.fill(); } o.restore();
    // the lake bed: sand, pebbles (small but heavy for their size, so they sank) and weeds
    const sb = o.createLinearGradient(0, FLOOR - 10, 0, 640); sb.addColorStop(0, '#c8b078'); sb.addColorStop(1, '#8a7448'); o.fillStyle = sb; o.beginPath(); o.moveTo(0, FLOOR + 6); o.quadraticCurveTo(180, FLOOR - 12, 360, FLOOR + 4); o.lineTo(360, 640); o.lineTo(0, 640); o.closePath(); o.fill();
    const r = P.rng(12); for (let i = 0; i < 14; i++) { const x = 70 + r() * 210, y = FLOOR + 6 + r() * 10; o.fillStyle = ['#8a8a96', '#a09080', '#6a6a7a'][i % 3]; o.beginPath(); o.ellipse(x, y, 4 + r() * 4, 3 + r() * 2, r(), 0, 7); o.fill(); }
    for (let i = 0; i < 7; i++) { const x = 90 + i * 34 + r() * 10, h = 40 + r() * 50; o.strokeStyle = i % 2 ? '#3a8a5a' : '#2a6a4a'; o.lineWidth = 4; o.lineCap = 'round'; o.beginPath(); o.moveTo(x, FLOOR + 4); o.quadraticCurveTo(x + 10, FLOOR - h / 2, x - 4, FLOOR - h); o.stroke(); }
    // the cliff on the left
    const cg = o.createLinearGradient(0, 0, 80, 0); cg.addColorStop(0, '#3a3050'); cg.addColorStop(1, '#5a4a6a'); o.fillStyle = cg; o.beginPath(); o.moveTo(0, SURF - 20); o.lineTo(54, SURF + 10);
    for (let y = SURF + 30; y < 640; y += 40) o.lineTo(50 + Math.sin(y * 0.07) * 10, y); o.lineTo(0, 640); o.closePath(); o.fill();
    o.fillStyle = 'rgba(255,255,255,0.06)'; for (let i = 0; i < 20; i++) { o.beginPath(); o.ellipse(r() * 44, SURF + r() * 420, 6, 3, 0, 0, 7); o.fill(); }
  }
  function ledge(c, y, st, t) { // a rock shelf with an oyster; st: 0 waiting, 1 the one to reach, 2 taken
    c.fillStyle = '#4a3c5c'; c.beginPath(); c.moveTo(30, y - 6); c.lineTo(104, y + 8); c.quadraticCurveTo(108, y + 20, 96, y + 22); c.lineTo(30, y + 24); c.closePath(); c.fill();
    c.fillStyle = '#6a5a7a'; c.fillRect(30, y + 2, 72, 4);
    const ox = 84, oy = y + 4, open = st === 2 ? 0.9 : 0.35 + 0.15 * Math.sin(t * 3 + y);
    c.fillStyle = '#9a8aa0'; c.strokeStyle = '#4a3a50'; c.lineWidth = 2; c.beginPath(); c.ellipse(ox, oy, 16, 6, 0, 0, Math.PI); c.fill(); c.stroke();
    c.save(); c.translate(ox - 14, oy); c.rotate(-open); c.beginPath(); c.ellipse(14, 0, 16, 6, 0, Math.PI, 0); c.fillStyle = '#b8a8c0'; c.fill(); c.stroke(); c.restore();
    if (st !== 2) { SK.ball(c, ox, oy - 3, 5.5, '#fff6f0', { edge: '#c8b0c8', lw: 1 }); if (st === 1) { c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createRadialGradient(ox, oy - 3, 0, ox, oy - 3, 22); gr.addColorStop(0, 'rgba(255,250,220,0.6)'); gr.addColorStop(1, 'rgba(255,250,220,0)'); c.fillStyle = gr; c.beginPath(); c.arc(ox, oy - 3, 22, 0, 7); c.fill(); c.restore(); } }
  }
  function log(c, t) { const y = SURF - 4 + Math.sin(t * 1.6) * 2, x = 282; c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.2) * 0.03);
    c.fillStyle = '#8a5a34'; c.strokeStyle = '#4a2a14'; c.lineWidth = 2; c.beginPath(); c.roundRect(-58, -12, 116, 24, 12); c.fill(); c.stroke(); c.fillStyle = '#c89a64'; c.beginPath(); c.ellipse(58, 0, 7, 12, 0, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(60,30,10,0.4)'; for (let i = -40; i < 50; i += 22) { c.beginPath(); c.moveTo(i, -8); c.lineTo(i + 12, -6); c.stroke(); } c.restore(); }
  function sub(c, g, s, t) {
    const x = SX, y = s.y, tilt = SK.clamp(s.v / 900, -0.12, 0.12);
    c.save(); c.translate(x, y); c.rotate(-tilt);
    // propeller at the back (right), the claw at the front (left)
    const pr = Math.sin(t * 30); c.fillStyle = '#6a6a7a'; c.beginPath(); c.ellipse(70, 0, 4, 14 * Math.abs(pr) + 3, 0, 0, 7); c.fill();
    c.fillStyle = '#e8b030'; c.strokeStyle = '#5a3a14'; c.lineWidth = 3; c.beginPath(); c.moveTo(64, -8); c.lineTo(76, -16); c.lineTo(76, 16); c.lineTo(64, 8); c.closePath(); c.fill(); c.stroke();
    const ext = s.grabT ? Math.sin(SK.clamp((t - s.grabT) / 0.5, 0, 1) * Math.PI) : 0, cx = -62 - ext * (SX - 62 - 92);
    c.strokeStyle = '#7a7a8a'; c.lineWidth = 5; c.beginPath(); c.moveTo(-58, 8); c.lineTo(cx, 8); c.stroke(); c.lineWidth = 3; c.beginPath(); c.moveTo(cx, 8); c.lineTo(cx - 8, 0); c.moveTo(cx, 8); c.lineTo(cx - 8, 16); c.stroke();
    // the hull
    const hg = c.createLinearGradient(0, -32, 0, 32); hg.addColorStop(0, '#ffe070'); hg.addColorStop(0.6, '#f0b030'); hg.addColorStop(1, '#c07a18'); c.fillStyle = hg; c.strokeStyle = '#5a3a14'; c.lineWidth = 3;
    c.beginPath(); c.ellipse(0, 4, 66, 28, 0, 0, 7); c.fill(); c.stroke();
    // the tank window: you can see the water inside
    const TW = { x: -2, y: 6, w: 54, h: 22 }; c.fillStyle = '#e8f4ff'; c.beginPath(); c.roundRect(TW.x, TW.y - TW.h / 2, TW.w, TW.h, 7); c.fill();
    c.save(); c.beginPath(); c.roundRect(TW.x, TW.y - TW.h / 2, TW.w, TW.h, 7); c.clip(); const wl = TW.y + TW.h / 2 - TW.h * s.f; c.fillStyle = '#2a8ad8'; c.beginPath(); c.moveTo(TW.x, wl); for (let i = 0; i <= 10; i++) c.lineTo(TW.x + i * TW.w / 10, wl + Math.sin(t * 6 + i) * 1.5); c.lineTo(TW.x + TW.w, TW.y + TW.h); c.lineTo(TW.x, TW.y + TW.h); c.closePath(); c.fill(); c.restore();
    c.strokeStyle = '#5a3a14'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(TW.x, TW.y - TW.h / 2, TW.w, TW.h, 7); c.stroke();
    // the cockpit dome with the duck pilot
    c.fillStyle = 'rgba(200,240,255,0.35)'; c.beginPath(); c.arc(-26, -18, 22, Math.PI, 0); c.fill();
    c.restore();
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'duck', SX - 24, y - 6, 0.5, { t, facing: -1, noShadow: true, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : Math.abs(s.v) > 90 ? 'wow' : 'happy' });
    c.save(); c.translate(x, y); c.rotate(-tilt); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.beginPath(); c.arc(-26, -18, 22, Math.PI, 0); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(-34, -30, 6, 3, -0.5, 0, 7); c.fill();
    c.strokeStyle = '#5a3a14'; c.lineWidth = 4; c.beginPath(); c.moveTo(4, -22); c.lineTo(4, -44); c.lineTo(-8, -44); c.stroke(); c.restore();
  }
  const levY = f => LV.t + f * (LV.b - LV.t);
  function target(s) { return s.depths[s.round]; }
  function want(g, lim = 0.16) { // the lever setting that brings the sub to the next ledge and stops it there: the hand shows a gentle
    // setting (the sub drifts slowly enough to stop in the band even if you are late), the bot pushes harder
    const s = g.s, d = target(s) - s.y; return SK.clamp(s.f0 + SK.clamp(d * (lim > 0.2 ? 0.006 : 0.0042) - s.v * (lim > 0.2 ? 0.0022 : 0.0016), -lim, lim), 0, 1);
  }
  MG.add({
    id: 'matter_dive', stage: 'matter', cmd: 'STOP THE SUB AT EACH PEARL!', time: 8, mood: 'sea', winText: 'Got every pearl!', failText: 'Pearls left!',
    card: { title: 'Heavy for its size', kind: 'Science', ref: 'Density and floating',
      text: 'Whether something floats depends on how heavy it is for its size. Water pushes up on anything in it. If a thing is lighter than the same amount of water, it floats. If it is heavier, it sinks.\n\nA huge log floats because wood is light for its size. A tiny pebble sinks because stone is heavy for its size.\n\nA submarine stays the same size but changes its weight. Letting water into its tanks makes it heavier, so it sinks. Blowing the water out makes it lighter, so it rises. With just the right amount, it hovers.',
      note: 'A thing floats if it is lighter than the same amount of water, and sinks if it is heavier.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4);
      s.depths = DEPTHS[v].slice(0, L === 2 ? 4 : 3); s.f0 = [0.5, 0.44, 0.56, 0.48][v]; s.band = BAND[L]; s.notch = L < 2;
      s.y = SURF + 4; s.v = 0; s.f = 0.12; s.lev = 0.12; s.round = 0; s.inT = 0; s.grabT = 0; s.drag = false; s.bubbles = []; s.thudT = -9;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (x > 280 && y > LV.t - 50 && y < LV.b + 50) { s.drag = true; s.lev = SK.clamp((y - LV.t) / (LV.b - LV.t), 0, 1); g.sfx('click'); } },
    move(g, x, y) { const s = g.s; if (s.drag) s.lev = SK.clamp((y - LV.t) / (LV.b - LV.t), 0, 1); },
    up(g) { g.s.drag = false; },
    update(g, dt) {
      const s = g.s;
      // the tank follows the lever: pumps take a moment
      const df = SK.clamp(s.lev - s.f, -2 * dt, 2 * dt); s.f += df;
      if (Math.abs(df) > 0.002 && g.rand() < 0.7) s.bubbles.push({ x: SX + (df < 0 ? 52 : 30) + g.rand() * 10, y: s.y + (df < 0 ? -10 : 20), vy: -60 - g.rand() * 50, life: 1.2, r: 2 + g.rand() * 3 });
      // weight for size: more water in the tank than the hover amount and the sub sinks; less and it rises
      const a = G * (s.f - s.f0) - DRAG * s.v; s.v += a * dt; s.y += s.v * dt;
      if (s.y > FLOOR - 30) { if (s.v > 40) { s.thudT = g.t; g.sfx('thud'); g.burst(SX, FLOOR - 6, ['#c8b078', '#e8d8a8'], 10, 90); } s.y = FLOOR - 30; s.v = 0; }
      if (s.y < SURF + 4) { if (s.v < -60) { g.sfx('splash'); g.burst(SX, SURF, ['#ffffff', '#9ad8f0'], 10, 120); } s.y = SURF + 4; s.v = 0; }
      for (const b of s.bubbles) { b.y += b.vy * dt; b.x += Math.sin(b.y * 0.1) * 0.4; b.life -= dt; } s.bubbles = s.bubbles.filter(b => b.life > 0 && b.y > SURF);
      if (g.done || s.round >= s.depths.length) return;
      if (s.grabT) { if (g.t - s.grabT > 0.5) { s.grabT = 0; s.round++; s.inT = 0; g.sfx('coin'); if (s.round >= s.depths.length) { g.win(); g.sfx('cheer'); } } return; }
      const near = Math.abs(s.y - target(s)) < s.band && Math.abs(s.v) < 60;
      s.inT = near ? s.inT + dt : Math.max(0, s.inT - dt * 2);
      if (s.inT > 0.45) { s.grabT = g.t; g.sfx('snap'); g.sfx('sparkle'); g.burst(84, target(s), ['#fff6f0', '#ffd8f0', '#ffffff'], 12, 120); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win';
      c.drawImage(g.bake('dive_lake', paintLake), 0, 0, 360, 640);
      log(c, t); SK.tag(c, 'Log', 300, SURF - 34, 18);
      SK.tag(c, 'Pebbles', 236, FLOOR + 16, 18);
      // fish
      for (let i = 0; i < 3; i++) { const fx = ((t * (18 + i * 7) + i * 140) % 420) - 30, fy = 250 + i * 110 + Math.sin(t + i) * 8; P.fishShape(c, fx, fy, 0.5 + i * 0.1, ['#ff9a5a', '#ffd45a', '#ff7aa0'][i]); }
      s.depths.forEach((d, i) => ledge(c, d, i < s.round || (i === s.round && s.grabT && t - s.grabT > 0.25) ? 2 : i === s.round ? 1 : 0, t));
      // the band to stop in, beside the next ledge
      const done = s.round >= s.depths.length;
      if (!done && !g.done) { const ty = target(s), ok = Math.abs(s.y - ty) < s.band, k = SK.clamp(s.inT / 0.45, 0, 1);
        c.save(); c.fillStyle = ok ? 'rgba(120,255,160,0.22)' : 'rgba(255,240,170,0.14)'; c.fillRect(100, ty - s.band, 170, s.band * 2); c.strokeStyle = ok ? '#8affb0' : 'rgba(255,240,170,0.6)'; c.lineWidth = 2; c.setLineDash([8, 6]); c.lineDashOffset = -t * 20; c.strokeRect(100, ty - s.band, 170, s.band * 2); c.restore();
        if (k > 0) { c.strokeStyle = '#8affb0'; c.lineWidth = 5; c.beginPath(); c.arc(84, ty, 20, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); c.stroke(); } }
      for (const b of s.bubbles) { c.strokeStyle = `rgba(255,255,255,${Math.min(0.8, b.life)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(b.x, b.y, b.r, 0, 7); c.stroke(); }
      sub(c, g, s, t);
      // which way to go: an arrow beside the sub toward the band
      if (!done && !g.done && !s.grabT) { const dy = target(s) - s.y; if (Math.abs(dy) > s.band) { const d = Math.sign(dy), p = 0.5 + 0.5 * Math.sin(t * 6), ax = SX - 26, ay = s.y + d * (44 + 6 * p);
        c.save(); c.fillStyle = '#ffe27a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(ax, ay + d * 18); c.lineTo(ax - 13, ay); c.lineTo(ax - 5, ay); c.lineTo(ax - 5, ay - d * 14); c.lineTo(ax + 5, ay - d * 14); c.lineTo(ax + 5, ay); c.lineTo(ax + 13, ay); c.closePath(); c.fill(); c.stroke(); c.restore(); } }
      // the tank lever
      c.save(); c.fillStyle = 'rgba(20,30,50,0.72)'; c.beginPath(); c.roundRect(LV.x - 26, LV.t - 44, 52, LV.b - LV.t + 96, 18); c.fill();
      const lg = c.createLinearGradient(0, LV.t, 0, LV.b); lg.addColorStop(0, '#e8f4ff'); lg.addColorStop(1, '#2a8ad8'); c.fillStyle = lg; c.beginPath(); c.roundRect(LV.x - 7, LV.t, 14, LV.b - LV.t, 7); c.fill();
      if (s.notch) { const ny = levY(s.f0); c.fillStyle = '#5ad07a'; c.fillRect(LV.x - 18, ny - 3, 36, 6); }
      const hy = levY(s.lev); c.fillStyle = s.drag ? '#ffe27a' : '#f0b030'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.roundRect(LV.x - 22, hy - 13, 44, 26, 9); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(58,22,64,0.5)'; c.lineWidth = 2; for (const o of [-5, 0, 5]) { c.beginPath(); c.moveTo(LV.x - 12, hy + o); c.lineTo(LV.x + 12, hy + o); c.stroke(); }
      c.restore();
      SK.tag(c, 'Air', LV.x, LV.t - 24, 18); SK.tag(c, 'Water', LV.x, LV.b + 33, 18);
      if (s.notch) SK.tag(c, 'Hover', LV.x - 66, levY(s.f0), 18, '#eaffea', 'rgba(30,110,60,0.85)');
      SK.tag(c, 'Tank', SX + 30, s.y + 50, 18);
      if (!won) SK.tag(c, 'Pearl ' + Math.min(s.round + 1, s.depths.length) + ' / ' + s.depths.length, 80, 212, 18);
      // guidance: drag the lever to the setting that carries the sub to the band and stops it there
      if (!done && !g.done) { const w = want(g); SK.grab(c, g, LV.x, hy, 24); if (Math.abs(w - s.lev) > 0.06) SK.arrow(c, g, LV.x, hy, LV.x, levY(w), { from: 26, to: 0 });
        SK.demo(g, c, 'drag', [LV.x, hy], [LV.x, levY(w)]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.t < 1.0) return; const B = s._bot = s._bot || {};
      if (g.done || s.round >= s.depths.length) { if (B.down) { B.down = 0; synth('up', LV.x, levY(s.lev)); } return; }
      const y = levY(want(g, 0.5)); if (!B.down) { B.down = 1; synth('down', LV.x, levY(s.lev)); } else synth('move', LV.x, y);
    },
  });
})();
