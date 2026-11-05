// PUSH OFF! (physics PMS-04) — a frozen pond seen from above: a little penguin and a big penguin stand together in the
// middle, and the little one's igloo door is somewhere on the snowy bank. Swipe on the pair to make the little penguin push
// the big one that way. The push works both ways at once: the big penguin is pushed the way you swiped and the little one
// is pushed back the opposite way, just as hard. Two equal arrows show the two pushes. On ice nothing slows them, and the
// little one, being lighter, zooms off much faster. So to send the little one home, push the big one AWAY from the igloo.
// Swipe toward the igloo and the little penguin slides the wrong way into the snow. Two igloos at level 0, three at levels
// 1 and 2 (smaller doors, and a heavier big penguin at level 2).
(() => {
  const RK = { l: 22, r: 338, t: 150, b: 600 }, C = { x: 180, y: 392 }, VS = 330;
  const DOORS = [[60, 190], [300, 214], [40, 520], [330, 480], [180, 150], [300, 590]];
  function paintPond(o) {
    o.fillStyle = '#f4f6ff'; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(41); o.fillStyle = 'rgba(170,180,220,0.35)'; for (let i = 0; i < 30; i++) { o.beginPath(); o.ellipse(rnd() * 360, rnd() * 640, 16 + rnd() * 30, 5 + rnd() * 6, 0, 0, 7); o.fill(); }
    const ice = o.createLinearGradient(0, RK.t, 0, RK.b); ice.addColorStop(0, '#cdeefa'); ice.addColorStop(0.5, '#a8dcf2'); ice.addColorStop(1, '#d4f2fb');
    o.fillStyle = ice; o.beginPath(); o.roundRect(RK.l, RK.t, RK.r - RK.l, RK.b - RK.t, 40); o.fill();
    o.save(); o.beginPath(); o.roundRect(RK.l, RK.t, RK.r - RK.l, RK.b - RK.t, 40); o.clip();
    o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = 1.3; for (let i = 0; i < 40; i++) { const x = RK.l + rnd() * 316, y = RK.t + rnd() * 450, a = rnd() * 6.28, l = 16 + rnd() * 40; o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 6, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); o.stroke(); }
    o.restore();
    o.strokeStyle = '#ffffff'; o.lineWidth = 8; o.beginPath(); o.roundRect(RK.l - 2, RK.t - 2, RK.r - RK.l + 4, RK.b - RK.t + 4, 42); o.stroke();
    // little fish shapes frozen in the ice
    for (let i = 0; i < 5; i++) { o.fillStyle = 'rgba(80,120,170,0.18)'; const x = 60 + rnd() * 240, y = 200 + rnd() * 360; o.beginPath(); o.ellipse(x, y, 9, 4, rnd() * 3, 0, 7); o.fill(); }
  }
  function igloo(c, x, y, r, glow, t, home) {
    const a = Math.atan2(C.y - y, C.x - x); // the door faces the middle of the pond
    c.save(); c.translate(x, y);
    if (glow) { c.save(); c.globalAlpha = 0.5 + 0.3 * Math.sin(t * 5); c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(Math.cos(a) * 6, Math.sin(a) * 6, r + 12, 0, 7); c.fill(); c.restore(); }
    const dg = c.createRadialGradient(-r * 0.3, -r * 0.4, 4, 0, 0, r * 1.5); dg.addColorStop(0, '#ffffff'); dg.addColorStop(1, '#bcc8e8'); c.fillStyle = dg; c.strokeStyle = '#8a96c0'; c.lineWidth = 2;
    c.beginPath(); c.arc(0, 0, r * 1.25, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(140,150,200,0.5)'; c.lineWidth = 1.5; for (const k of [0.5, 0.9]) { c.beginPath(); c.arc(0, 0, r * 1.25 * k, 0, 7); c.stroke(); }
    c.fillStyle = home ? '#ffd45a' : '#3a3a6a'; c.beginPath(); c.arc(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75, r * 0.6, 0, 7); c.fill();
    c.restore();
  }
  function arrow(c, x0, y0, dx, dy, L, col) {
    const a = Math.atan2(dy, dx); c.save(); c.translate(x0, y0); c.rotate(a); c.fillStyle = col; c.strokeStyle = 'rgba(30,20,50,0.7)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, -5); c.lineTo(L - 14, -5); c.lineTo(L - 14, -12); c.lineTo(L, 0); c.lineTo(L - 14, 12); c.lineTo(L - 14, 5); c.lineTo(0, 5); c.closePath(); c.fill(); c.stroke(); c.restore();
  }
  MG.add({
    id: 'pushoff', stage: 'forces', cmd: 'PUSH OFF TO REACH THE IGLOO!', time: 6, mood: 'sea', winText: 'Home safe!', failText: 'Wrong way!',
    card: { title: 'Every push pushes back', kind: 'Physics', ref: "Newton's third law",
      text: 'When the little penguin pushes the big one, the big one pushes back on the little one just as hard, at the same moment, the opposite way. You cannot push something without being pushed back.\n\nThe same push moves a light thing more than a heavy thing. So the little penguin zooms away fast while the big one drifts off slowly.\n\nOn ice nothing rubs on them, so both keep sliding. To go one way, push something the other way. Rockets work like this: they push gas out of the back and are pushed forward.',
      note: 'When you push on something, it pushes back on you just as hard in the opposite direction.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 4); const pick = [[[0, 3], [1, 2, 4], [3, 0, 5]], [[1, 2], [0, 5, 3], [2, 4, 1]], [[4, 5], [4, 0, 3], [1, 5, 0]], [[2, 1], [5, 1, 2], [4, 3, 2]]][s.v][L];
      s.doors = pick.map(i => ({ x: DOORS[i][0], y: DOORS[i][1] })); s.di = 0; s.dr = [36, 30, 26][L]; s.mb = L >= 2 ? 4 : 3;
      reset(s); s.next = 0; s.homeT = -9;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'ready' || g.t < s.next) return; if (SK.dist(x, y, C.x, C.y) < 110) { SK.dragStart(g, null, x, y); s.aim = { x0: x, y0: y, x, y }; } },
    move(g, x, y) { const s = g.s; SK.dragMove(g, x, y); if (s.aim) { s.aim.x = x; s.aim.y = y; } },
    up(g) {
      const s = g.s, d = SK.dragEnd(g), a = s.aim; s.aim = null; if (!d || !a || s.phase !== 'ready' || g.done) return;
      let dx = a.x - a.x0, dy = a.y - a.y0; const L = Math.hypot(dx, dy); if (L < 24) return; dx /= L; dy /= L;
      // the push: the big one is pushed the way you swiped; the little one is pushed back just as hard, the other way
      const J = VS; s.sm = { x: C.x - dx * 20, y: C.y - dy * 20, vx: -dx * J, vy: -dy * J }; s.bg = { x: C.x + dx * 26, y: C.y + dy * 26, vx: dx * J / s.mb, vy: dy * J / s.mb };
      s.dir = { dx, dy }; s.phase = 'slide'; s.pushT = g.t; g.sfx('thud'); g.sfx('swoosh');
    },
    update(g, dt) {
      const s = g.s; if (s.phase !== 'slide') return; const D = s.doors[s.di];
      for (const p of [s.sm, s.bg]) { if (p.stuck) continue; p.x += p.vx * dt; p.y += p.vy * dt; // ice: nothing slows them
        const hitWall = p.x < RK.l + 14 || p.x > RK.r - 14 || p.y < RK.t + 14 || p.y > RK.b - 14;
        if (p === s.sm && SK.dist(p.x, p.y, D.x, D.y) < s.dr + 14 && !s.homeT0) { s.homeT0 = g.t; p.stuck = 1; p.vx = p.vy = 0; s.homeT = g.t; g.sfx('ding'); g.sfx('cheer'); g.burst(D.x, D.y, ['#ffd45a', '#ffffff', '#8ad8ff'], 18, 180); }
        else if (hitWall) { p.x = SK.clamp(p.x, RK.l + 14, RK.r - 14); p.y = SK.clamp(p.y, RK.t + 14, RK.b - 14); p.stuck = 1; p.vx = p.vy = 0; g.sfx('crunch', { vol: 0.5 }); g.burst(p.x, p.y, ['#ffffff', '#dfe6ff'], 10, 120); if (p === s.sm) { s.missT = g.t; g.sfx('laugh'); } } }
      if (s.sm.stuck && !s.endT) s.endT = g.t;
      if (s.endT && g.t - s.endT > 0.55) {
        if (s.homeT0) { s.di++; if (s.di >= s.doors.length) { s.phase = 'won'; g.win(); return; } }
        reset(s); s.next = g.t + 0.15; g.sfx('pop');
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', D = s.doors[Math.min(s.di, s.doors.length - 1)];
      c.drawImage(g.bake('pushoff_pond', paintPond), 0, 0, 360, 640);
      for (let i = 0; i < s.doors.length; i++) { const d = s.doors[i]; if (i < s.di || i === s.di) igloo(c, d.x, d.y, i === s.di ? s.dr : 22, i === s.di && s.phase === 'ready' && !g.done, t, i < s.di || (i === s.di && s.homeT0)); }
      SK.tag(c, 'Home', SK.clamp(D.x, 50, 310), SK.clamp(D.y + (D.y < 300 ? 56 : -56), 170, 580), 18);
      // the two penguins (top view of standing birds), the big one twice the size
      const sm = s.sm, bg = s.bg, ready = s.phase === 'ready';
      const facing = s.dir ? (s.dir.dx >= 0 ? 1 : -1) : 1;
      SK.animal(c, 'penguin', bg.x, bg.y + 40, s.mb >= 4 ? 1.75 : 1.6, { t, facing: -facing, pose: won ? 'cheer' : s.phase === 'slide' && !bg.stuck ? 'balance' : 'idle', expr: 'happy' });
      SK.animal(c, 'penguin', sm.x, sm.y + 20, 0.66, { t, facing, pose: won || s.homeT0 ? 'cheer' : s.phase === 'slide' && !sm.stuck ? 'balance' : ready ? 'point' : 'idle', expr: s.missT && t - s.missT < 1 ? 'wow' : s.homeT0 ? 'laugh' : 'happy' });
      SK.tag(c, 'Light', SK.clamp(sm.x, 40, 320), sm.y + 40, 18); SK.tag(c, 'Heavy', SK.clamp(bg.x, 40, 320), bg.y - 86, 18);
      // the two equal pushes, for a moment after the push
      if (s.dir && t - s.pushT < 0.8) { const k = 1 - (t - s.pushT) / 0.8, mx = C.x, my = C.y; c.save(); c.globalAlpha = Math.min(1, k * 2); arrow(c, mx + s.dir.dx * 8, my + s.dir.dy * 8, s.dir.dx, s.dir.dy, 70, '#ff8a5a'); arrow(c, mx - s.dir.dx * 8, my - s.dir.dy * 8, -s.dir.dx, -s.dir.dy, 70, '#ff8a5a'); c.restore(); }
      // while aiming: where the big one will go (your swipe) and where the little one will go (the other way)
      if (s.aim) { const dx = s.aim.x - s.aim.x0, dy = s.aim.y - s.aim.y0, L = Math.hypot(dx, dy); if (L > 12) { c.save(); c.setLineDash([6, 7]); c.lineWidth = 3; c.strokeStyle = 'rgba(60,40,90,0.45)'; c.beginPath(); c.moveTo(C.x, C.y); c.lineTo(C.x + dx / L * 90, C.y + dy / L * 90); c.stroke(); c.strokeStyle = 'rgba(255,170,60,0.85)'; c.beginPath(); c.moveTo(C.x, C.y); c.lineTo(C.x - dx / L * 200, C.y - dy / L * 200); c.stroke(); c.restore(); } }
      if (ready && !g.done && g.t >= s.next) { const ax = C.x - D.x, ay = C.y - D.y, L = Math.hypot(ax, ay); SK.grab(c, g, C.x, C.y, 46); SK.target(c, g, C.x + ax / L * 120, C.y + ay / L * 120, 20); SK.arrow(c, g, C.x, C.y, C.x + ax / L * 120, C.y + ay / L * 120, { from: 48, to: 22 }); SK.demo(g, c, 'swipe', [C.x, C.y], [C.x + ax / L * 110, C.y + ay / L * 110]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'ready' || g.t < Math.max(1.0, s.next)) return; const D = s.doors[s.di], ax = C.x - D.x, ay = C.y - D.y, L = Math.hypot(ax, ay);
      if (!s._bb || s._bb.n !== s.tries) s._bb = { n: s.tries, t: g.t };
      SK.bot.drag(g, synth, 'push' + s.tries, s._bb.t, [C.x, C.y], [C.x + ax / L * 90, C.y + ay / L * 90], 0.2);
    },
  });
  function reset(s) { s.phase = 'ready'; s.sm = { x: C.x - 30, y: C.y + 6, vx: 0, vy: 0 }; s.bg = { x: C.x + 20, y: C.y, vx: 0, vy: 0 }; s.dir = null; s.aim = null; s.endT = 0; s.homeT0 = 0; s.missT = 0; s.tries = (s.tries || 0) + 1; }
})();
