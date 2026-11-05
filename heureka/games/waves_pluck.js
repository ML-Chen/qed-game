// PLUCK! (physics PE-12) — a fat rubber band stretched on a board beside a drum with rice on top, and a bird's bowl
// beyond the drum. Grab the band, pull it sideways and let go: it shakes (a blur and a twang), the shaking air shakes the
// drum skin, and the rice hops. A bigger pull makes a bigger shake, so the rice hops higher and farther. Land enough rice
// in the bowl to fill it a step: two steps at level 0, three at levels 1 and 2. Touching the band while it shakes stops it
// dead: no sound, and the rice sits still. Level 0 has a backboard behind the bowl; levels 1 and 2 do not, so too big a
// pull throws the rice right over it, and at level 2 the bowl moves after each step.
(() => {
  const BAND = { x: 74, y0: 200, y1: 520 }, DRUM = { x: 190, y: 430, r: 66 }, G = 1500, MAXP = 130;
  const pullFor = s => SK.clamp(110 * (s.B.x - (DRUM.x - 5)) / 125, 20, MAXP); // the pull that lands the rice mid-bowl
  function paintRoom(o) {
    const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#ff9ac0'); wall.addColorStop(0.5, '#ffc890'); wall.addColorStop(1, '#fff2d0'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(8); o.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = 0; i < 40; i++) { o.beginPath(); o.arc(rnd() * 360, rnd() * 520, 3 + rnd() * 4, 0, 7); o.fill(); } // polka dots
    // a window with a branch outside
    o.fillStyle = '#bfe6f0'; o.beginPath(); o.roundRect(196, 150, 130, 120, 10); o.fill(); o.strokeStyle = '#fff6ea'; o.lineWidth = 8; o.stroke(); o.lineWidth = 4; o.beginPath(); o.moveTo(261, 150); o.lineTo(261, 270); o.moveTo(196, 210); o.lineTo(326, 210); o.stroke();
    o.strokeStyle = '#7a5a3a'; o.lineWidth = 4; o.beginPath(); o.moveTo(326, 190); o.quadraticCurveTo(280, 200, 240, 236); o.stroke(); o.fillStyle = '#7ab060'; for (const [x, y] of [[300, 192], [270, 206], [246, 230]]) { o.beginPath(); o.ellipse(x, y, 9, 5, 0.5, 0, 7); o.fill(); }
    // the table
    const tg = o.createLinearGradient(0, 520, 0, 640); tg.addColorStop(0, '#c8844a'); tg.addColorStop(1, '#8a5430'); o.fillStyle = tg; o.fillRect(0, 524, 360, 116); o.fillStyle = '#e8a868'; o.fillRect(0, 520, 360, 8);
    // the board the band is stretched on, with two pegs
    o.fillStyle = 'rgba(60,30,20,0.25)'; o.beginPath(); o.roundRect(BAND.x - 38, BAND.y0 - 34, 82, BAND.y1 - BAND.y0 + 64, 12); o.fill();
    const bg = o.createLinearGradient(BAND.x - 34, 0, BAND.x + 34, 0); bg.addColorStop(0, '#b8783a'); bg.addColorStop(1, '#8a5428'); o.fillStyle = bg; o.beginPath(); o.roundRect(BAND.x - 34, BAND.y0 - 30, 68, BAND.y1 - BAND.y0 + 56, 10); o.fill();
    o.strokeStyle = 'rgba(70,40,20,0.3)'; o.lineWidth = 1.5; for (let i = 0; i < 6; i++) { o.beginPath(); o.moveTo(BAND.x - 30, BAND.y0 + i * 60); o.quadraticCurveTo(BAND.x, BAND.y0 + i * 60 + 10, BAND.x + 30, BAND.y0 + i * 60); o.stroke(); }
    for (const y of [BAND.y0, BAND.y1]) { o.fillStyle = '#5a5a6a'; o.beginPath(); o.arc(BAND.x, y, 7, 0, 7); o.fill(); o.fillStyle = '#c8c8d8'; o.beginPath(); o.arc(BAND.x - 2, y - 2, 3, 0, 7); o.fill(); }
    // the drum body
    const dg = o.createLinearGradient(DRUM.x - DRUM.r, 0, DRUM.x + DRUM.r, 0); dg.addColorStop(0, '#c83a4a'); dg.addColorStop(0.5, '#f06070'); dg.addColorStop(1, '#a02838'); o.fillStyle = dg; o.fillRect(DRUM.x - DRUM.r, DRUM.y, DRUM.r * 2, 90);
    o.fillStyle = '#ffd45a'; o.fillRect(DRUM.x - DRUM.r, DRUM.y + 4, DRUM.r * 2, 6); o.fillRect(DRUM.x - DRUM.r, DRUM.y + 80, DRUM.r * 2, 6);
    o.strokeStyle = '#fff6ea'; o.lineWidth = 2; for (let i = 0; i < 6; i++) { const x = DRUM.x - DRUM.r + 8 + i * 22; o.beginPath(); o.moveTo(x, DRUM.y + 10); o.lineTo(x + 12, DRUM.y + 80); o.stroke(); }
    o.fillStyle = 'rgba(60,30,20,0.25)'; o.beginPath(); o.ellipse(DRUM.x, 522, DRUM.r + 6, 6, 0, 0, 7); o.fill();
  }
  function bowl(c, B, fill, back) {
    const x = B.x, y = 520, w = B.w / 2;
    if (back) { c.fillStyle = '#8ab0d8'; c.strokeStyle = '#3a5a8a'; c.lineWidth = 2; c.beginPath(); c.roundRect(x + w - 2, y - 120, 10, 120, 3); c.fill(); c.stroke(); }
    c.fillStyle = '#f4f0ff'; c.strokeStyle = '#5a4a8a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - w, y - 34); c.quadraticCurveTo(x - w + 2, y, x, y); c.quadraticCurveTo(x + w - 2, y, x + w, y - 34); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#8a7ad8'; c.fillRect(x - w + 6, y - 24, w * 2 - 12, 4);
    if (fill > 0) { c.save(); c.beginPath(); c.moveTo(x - w, y - 34); c.quadraticCurveTo(x - w + 2, y, x, y); c.quadraticCurveTo(x + w - 2, y, x + w, y - 34); c.closePath(); c.clip(); c.fillStyle = '#fff8e0'; c.fillRect(x - w, y - 34 * fill, w * 2, 40); c.fillStyle = 'rgba(200,180,140,0.6)'; for (let i = 0; i < 14; i++) { c.beginPath(); c.ellipse(x - w + 6 + (i * 37 % (w * 2 - 10)), y - 34 * fill + 3 + (i % 3) * 3, 2.5, 1.3, i, 0, 7); c.fill(); } c.restore(); }
    c.beginPath(); c.ellipse(x, y - 34, w, 5, 0, 0, 7); c.strokeStyle = '#5a4a8a'; c.stroke();
  }
  MG.add({
    id: 'pluck', stage: 'waves', cmd: 'PLUCK TO BOUNCE RICE IN BOWL!', time: 7, mood: 'party', winText: 'Bowl full!', failText: 'Hungry!',
    card: { title: 'Sound is shaking', kind: 'Physics', ref: 'Vibration and sound',
      text: 'When you pluck the band, it shakes back and forth very fast. That shaking is called vibration. It pushes the air back and forth too, and the shaking air reaches your ears as a twang.\n\nThe shaking air also reaches the drum and makes its skin shake, so the rice on top hops. A bigger pluck makes a bigger shake, so the rice hops higher.\n\nTouch the band while it shakes and it stops. Then there is no sound, and the rice sits still.',
      note: 'Sound is made by something shaking, and the shaking can travel through the air and make other things shake.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.steps = L === 0 ? 2 : 3; s.step = 0; s.back = L === 0; s.w = [92, 62, 50][L];
      s.v = SK.variant(g, 4); s.bandCol = ['#e8503a', '#3a7ae8', '#3aa050', '#d88a1a'][s.v]; s.B = { x: [292, 272, 304, 282][s.v] + (L === 2 ? Math.round((g.rand() - 0.5) * 12) : 0), w: s.w }; s.need = 3;
      s.amp = 0; s.ph = 0; s.pull = null; s.grains = []; s.got = 0; s.skin = 0; s.mute = -9; s.lastP = -9; s.peck = -9;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (Math.abs(x - BAND.x) < 46 && y > BAND.y0 + 10 && y < BAND.y1 - 10) { if (s.amp > 0.08) { s.amp = 0; s.mute = g.t; g.sfx('thud', { vol: 0.4 }); } s.pull = { y, d: SK.clamp(x - BAND.x, -MAXP, MAXP), x0: x }; }
    },
    move(g, x, y) { const s = g.s; if (!s.pull) return; s.pull.d = SK.clamp(x - BAND.x, -MAXP, MAXP); s.pull.y = SK.clamp(y, BAND.y0 + 20, BAND.y1 - 20); },
    up(g) {
      const s = g.s, p = s.pull; s.pull = null; if (!p || g.done) return; const A = Math.abs(p.d) / 110; if (A < 0.12) return; // a touch, not a pluck
      s.amp = Math.min(1.2, A); s.lastP = g.t; s.hopped = false; s.lock = false; g.sfx('boing', { pitch: 1.6, vol: 0.4 + A * 0.6 }); g.sfx('stretch', { vol: 0.3 * A });
    },
    update(g, dt) {
      const s = g.s;
      s.ph += dt * 60; s.amp *= Math.exp(-dt * 1.6); if (s.amp < 0.02) s.amp = 0;
      // the shaking air reaches the drum a moment later and the skin shakes with it
      const tgt = g.t - s.lastP > 0.12 ? s.amp * 1.6 : 0; s.skin = SK.lerp(s.skin, tgt, Math.min(1, dt * 20));
      if (!s.hopped && s.amp > 0 && g.t - s.lastP > 0.3) { // the rice hops as high as the shake is big
        s.hopped = true; g.sfx('drum', { vol: 0.3 + s.amp * 0.5 }); const A = s.amp / Math.exp(-0.3 * 1.6); s.batch = { n: 0, ok: 0, step: s.step };
        for (let i = 0; i < 7; i++) { const d = 125 * A * (0.88 + g.rand() * 0.24), H = 40 + 150 * A * A * (0.85 + g.rand() * 0.3), vy = -Math.sqrt(2 * G * H), T = 2 * -vy / G * 1.05; s.grains.push({ x: DRUM.x - 30 + g.rand() * 50, y: DRUM.y - 4, vx: d / T, vy, live: 1, a: g.rand() * 3 }); }
      }
      for (const q of s.grains) { if (!q.live) continue; q.vy += G * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.a += dt * 8;
        const w = s.B.w / 2;
        if (s.back && q.x > s.B.x + w - 4 && q.y > 400) { q.x = s.B.x + w - 4; q.vx = -Math.abs(q.vx) * 0.2; }
        if (q.vy > 0 && q.y > 486 && Math.abs(q.x - s.B.x) < w - 4) { q.live = 0; if (!s.lock) s.got++; s.batchOk = (s.batchOk || 0) + 1; g.sfx('tap', { pitch: 1.4, vol: 0.4 }); s.peck = g.t; }
        else if (q.vy > 0 && q.y > DRUM.y - 4 && Math.abs(q.x - DRUM.x) < DRUM.r) { q.y = DRUM.y - 4; q.vy = 0; q.vx = 0; q.live = 2; }
        else if (q.y > 520) { q.y = 520; q.live = 0; q.dead = 1; } }
      s.grains = s.grains.filter(q => q.live || q.dead); if (s.grains.length > 60) s.grains.splice(0, s.grains.length - 60);
      if (s.got >= s.need) { s.got = 0; s.step++; s.lock = true; g.sfx('ding'); g.sfx('tweet'); g.burst(s.B.x, 470, ['#ffd45a', '#ffffff'], 14, 140);
        if (s.step >= s.steps) { g.sfx('cheer'); g.win(); } else if (g.level >= 2) s.B.x = 276 + Math.round(g.rand() * 26); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win';
      c.drawImage(g.bake('pluck_room', paintRoom), 0, 0, 360, 640);
      // the band: pulled into a V while you hold it, a shaking blur after you let go
      c.save(); c.lineCap = 'round';
      if (s.pull) { c.strokeStyle = s.bandCol; c.lineWidth = 7; c.beginPath(); c.moveTo(BAND.x, BAND.y0); c.lineTo(BAND.x + s.pull.d, s.pull.y); c.lineTo(BAND.x, BAND.y1); c.stroke(); }
      else if (s.amp > 0) { const a = s.amp * 46; for (let i = 0; i < 4; i++) { const k = Math.sin(s.ph + i * 1.6); c.strokeStyle = s.bandCol; c.globalAlpha = 0.35 + (i === 0 ? 0.5 : 0); c.lineWidth = 6; c.beginPath(); c.moveTo(BAND.x, BAND.y0); c.quadraticCurveTo(BAND.x + a * k * 2, (BAND.y0 + BAND.y1) / 2, BAND.x, BAND.y1); c.stroke(); } c.globalAlpha = 1; }
      else { c.strokeStyle = s.bandCol; c.lineWidth = 7; c.beginPath(); c.moveTo(BAND.x, BAND.y0); c.lineTo(BAND.x, BAND.y1); c.stroke(); }
      c.restore();
      // the shaking air between band and drum
      if (s.amp > 0.04) { c.save(); c.lineCap = 'round'; const a0 = Math.atan2(DRUM.y - 380, DRUM.x - BAND.x); for (let i = 0; i < 5; i++) { const q = (t * 2.2 + i / 5) % 1, r = 24 + q * 120; c.strokeStyle = `rgba(255,255,255,${(1 - q * 0.6) * Math.min(1, s.amp * 1.8)})`; c.lineWidth = 5; c.beginPath(); c.arc(BAND.x + 10, 380, r, a0 - 0.55, a0 + 0.55); c.stroke(); c.strokeStyle = `rgba(232,80,58,${(1 - q) * Math.min(0.6, s.amp)})`; c.lineWidth = 2; c.beginPath(); c.arc(BAND.x + 10, 380, r + 4, a0 - 0.45, a0 + 0.45); c.stroke(); } c.restore(); }
      // the drum skin, shaking
      const sk = s.skin * 8 * Math.sin(s.ph * 0.8); c.fillStyle = '#fff6ea'; c.strokeStyle = '#c8a878'; c.lineWidth = 2; c.beginPath(); c.ellipse(DRUM.x, DRUM.y + sk * 0.3, DRUM.r, 12 + sk, 0, 0, 7); c.fill(); c.stroke();
      // rice: a little pile on the drum plus the flying grains
      c.fillStyle = '#fff4d8'; c.strokeStyle = '#8a6a3a'; c.lineWidth = 1.2;
      for (let i = 0; i < 18; i++) { const x = DRUM.x - 32 + (i * 13 % 64), y = DRUM.y - 3 - (i % 3) * 2.5 + sk * 0.3; c.beginPath(); c.ellipse(x, y, 4.6, 2.3, i, 0, 7); c.fill(); c.stroke(); }
      for (const q of s.grains) { if (q.dead) continue; c.save(); c.translate(q.x, q.y); c.rotate(q.a); c.beginPath(); c.ellipse(0, 0, 5, 2.6, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
      for (const q of s.grains) if (q.dead) { c.fillStyle = 'rgba(255,244,216,0.9)'; c.beginPath(); c.ellipse(q.x, 521, 4.5, 2, 0, 0, 7); c.fill(); }
      SK.tag(c, 'Rubber band', BAND.x + 14, BAND.y1 + 40, 18); SK.tag(c, 'Drum', DRUM.x, DRUM.y + 54, 18);
      // the bowl and the bird on its rim
      bowl(c, s.B, s.step / s.steps + Math.min(s.got, s.need) / s.need / s.steps, s.back);
      const pk = t - s.peck < 0.3;
      SK.animal(c, 'bird', Math.min(340, s.B.x + s.B.w / 2 + 14), 520, 1.0, { t, facing: -1, pose: won ? 'cheer' : pk ? 'hop' : 'idle', expr: won ? 'laugh' : t - s.mute < 1 ? 'sad' : pk ? 'laugh' : 'happy', noShadow: true });
      // while pulling: a ring where to let go, green once the pull is about right, with "More" / "Less"
      if (s.pull && !g.done) { const want = pullFor(s), tol = Math.max(5, want * (s.B.w / 2 - 4) / (s.B.x - DRUM.x + 5) * 0.6), d = Math.abs(s.pull.d), ok = Math.abs(d - want) <= tol, ty = s.pull.y;
        c.save(); c.strokeStyle = ok ? '#6aff8a' : '#ffe27a'; c.lineWidth = 3.5; c.setLineDash([6, 5]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(BAND.x + Math.sign(s.pull.d || 1) * want, ty, 20, 0, 7); c.stroke(); c.restore();
        SK.tag(c, ok ? 'Let go!' : d < want ? 'More' : 'Less', SK.clamp(BAND.x + Math.sign(s.pull.d || 1) * want, 60, 300), ty - 38, 18, ok ? '#8affa8' : '#ffe27a'); }
      // guidance: the band glows; the hand grabs it and pulls it sideways the right amount
      if (!s.pull && s.amp < 0.1 && !g.done) { SK.grab(c, g, BAND.x, 360, 26); SK.target(c, g, BAND.x + pullFor(s), 360, 20); SK.arrow(c, g, BAND.x, 360, BAND.x + pullFor(s), 360, { from: 20, to: 24 }); SK.demo(g, c, 'drag', [BAND.x, 360], [BAND.x + pullFor(s), 360]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; if (!s._bb || (s._bb.done && !s.pull && g.t - s.lastP > 0.3 && !s.grains.some(q => q.live === 1))) s._bb = { t: Math.max(1.0, g.t + 0.2), n: (s._bb ? s._bb.n + 1 : 0) };
      const pull = pullFor(s);
      if (SK.bot.drag(g, synth, 'pl' + s._bb.n, s._bb.t, [BAND.x, 360], [BAND.x + pull, 360], 0.3)) s._bb.done = true;
    },
  });
})();
