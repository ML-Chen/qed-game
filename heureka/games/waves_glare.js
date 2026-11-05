// CUT GLARE! (physics UP3-01) — a sunny lake, and a big round sunglasses lens held up in front of it. Sunlight bouncing
// off the water makes a white glare that hides a fish under the surface. The light in the glare wiggles side to side
// (it is polarised flat, like the water), and the lens only lets through light that wiggles along its stripes. Drag the
// tab on the rim to turn the lens: with the stripes upright the glare inside the lens fades away and the fish appears;
// the bird dives and catches it. Turned the wrong way, the glare stays blinding and the bird squints. Then the bird looks
// somewhere new and the lens tilts with its head. Two fish at level 0, three at levels 1 and 2 (level 2: a tighter turn).
(() => {
  const C = [180, 404], R = 112, WY = 268, WB = 600, TAB = R + 12;
  const glareIn = a => Math.sin(a) * Math.sin(a); // a: how far the stripes are turned from upright; glare light wiggles flat, so cos²(stripes' angle from flat) = sin²(a) of it passes
  const wrapH = a => { a = ((a % Math.PI) + Math.PI) % Math.PI; return a; }; // the lens looks the same turned half a turn
  function paintLake(o) {
    P.sky(o, 360, WY + 20, ['#5ab0e8', '#9ad4f4', '#e8f6ff'], { x: 290, y: 150, r: 26, color: '#fff2b0' });
    P.cloud(o, 70, 170, 0.6); P.hills(o, 360, WY, 30, '#7ab868', '#4a8a48', { seed: 6 });
    for (const [x, s] of [[30, 0.5], [130, 0.4], [330, 0.45]]) P.tree(o, x, WY - 6, s);
    const wg = o.createLinearGradient(0, WY, 0, WB + 40); wg.addColorStop(0, '#2a7aa8'); wg.addColorStop(1, '#14486a'); o.fillStyle = wg; o.fillRect(0, WY, 360, 640 - WY);
    const r = P.rng(8); o.fillStyle = 'rgba(120,170,120,0.35)'; for (let i = 0; i < 14; i++) { o.beginPath(); o.ellipse(r() * 360, WY + 60 + r() * 300, 10 + r() * 14, 3, 0, 0, 7); o.fill(); } // weed under the water
    o.fillStyle = 'rgba(180,150,90,0.4)'; for (let i = 0; i < 20; i++) { o.beginPath(); o.ellipse(r() * 360, WY + 120 + r() * 260, 4 + r() * 6, 2.5, 0, 0, 7); o.fill(); } // pebbles
    // the dock in front
    o.fillStyle = '#8a5a30'; o.fillRect(0, 560, 360, 80); o.fillStyle = '#a8703c'; for (let x = 0; x < 360; x += 40) { o.fillRect(x + 1, 562, 37, 76); } o.fillStyle = 'rgba(60,30,10,0.4)'; for (let x = 0; x < 360; x += 40) o.fillRect(x + 38, 562, 3, 78);
  }
  function glare(c, t, a) { // the white sheen of sunlight off the water, a = how much of it gets through
    if (a <= 0.01) return; c.save(); c.globalAlpha = a;
    const gg = c.createLinearGradient(0, WY, 0, 560); gg.addColorStop(0, 'rgba(255,255,255,0.95)'); gg.addColorStop(0.5, 'rgba(250,252,255,0.9)'); gg.addColorStop(1, 'rgba(230,240,255,0.82)'); c.fillStyle = gg; c.fillRect(0, WY, 360, 560 - WY);
    c.fillStyle = '#ffffff'; for (let i = 0; i < 26; i++) { const y = WY + 10 + ((i * 37) % 290), x = (i * 83 + Math.sin(t * 2 + i) * 30) % 360, w = 20 + (i % 5) * 9; c.globalAlpha = a * (0.6 + 0.4 * Math.sin(t * 6 + i * 1.7)); c.fillRect(x, y, w, 2.5); }
    c.restore();
  }
  function fish(c, f, t, a) {
    if (a <= 0.02) return; c.save(); c.globalAlpha = a; c.translate(f.x, f.y); c.scale(f.d, 1); const w = Math.sin(t * 8) * 0.25;
    c.fillStyle = f.col; c.strokeStyle = P.shade(f.col, -0.5); c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 26, 11, 0, 0, 7); c.fill(); c.stroke();
    c.save(); c.translate(-24, 0); c.rotate(w); c.beginPath(); c.moveTo(0, 0); c.lineTo(-14, -10); c.lineTo(-14, 10); c.closePath(); c.fill(); c.stroke(); c.restore();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(14, -3, 3.5, 0, 7); c.fill(); c.fillStyle = '#1a1020'; c.beginPath(); c.arc(15, -3, 1.8, 0, 7); c.fill(); c.restore();
  }
  MG.add({
    id: 'glare', stage: 'waves', cmd: 'TURN THE SUNGLASSES TO SEE FISH!', time: 6, mood: 'party', winText: 'No more glare!', failText: 'Too much glare!',
    card: { title: 'Sunglasses that stop glare', kind: 'Physics', ref: 'Polarised light',
      text: 'Light is a wave. In ordinary sunlight the waves wiggle in every direction. When sunlight bounces off flat water, most of the bounced light wiggles side to side, flat like the water. That bright bounced light is the glare.\n\nPolarised sunglasses have a filter that only lets through light wiggling up and down. Held upright, they block the flat glare, and you can see under the water.\n\nTurn them sideways and they let the glare through again.',
      note: 'Glare off water wiggles side to side. Polarised sunglasses only let up-and-down light through, so they block it.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4); s.n = lv === 0 ? 2 : 3; s.tol = [0.16, 0.12, 0.07][lv]; s.v = v;
      const starts = [[1.5, 0.8, 2.3], [2.2, 1.1, 0.7], [0.9, 2.4, 1.6], [1.8, 0.7, 2.5]][v]; s.starts = starts.map(a => a + (g.rand() - 0.5) * 0.2);
      s.cols = SK.shuffled(g, ['#ff8a3a', '#c8d0d8', '#ffd43a', '#6ac0a0']);
      s.i = 0; s.a = s.starts[0]; s.seen = 0; s.caught = 0; s.dive = 0; s.turn = 0; s.drag = false; this_newFish(g);
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.dive || s.turn) return; const tx = C[0] + Math.cos(s.a - Math.PI / 2) * TAB, ty = C[1] + Math.sin(s.a - Math.PI / 2) * TAB, bx = C[0] - Math.cos(s.a - Math.PI / 2) * TAB, by = C[1] - Math.sin(s.a - Math.PI / 2) * TAB;
      const d = Math.hypot(x - C[0], y - C[1]); if (SK.dist(x, y, tx, ty) < 46 || SK.dist(x, y, bx, by) < 46 || (d > R - 40 && d < R + 50)) { s.drag = true; s.g0 = Math.atan2(y - C[1], x - C[0]) - s.a; SK.dragStart(g, null, x, y); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); s.a = wrapH(Math.atan2(y - C[1], x - C[0]) - s.g0); },
    up(g) { const s = g.s; if (s.drag) { s.drag = false; SK.dragEnd(g); } },
    update(g, dt) {
      const s = g.s, f = s.f;
      f.x += f.d * 14 * dt; if (Math.abs(f.x - C[0]) > 62) f.d = -Math.sign(f.x - C[0]); f.y += Math.sin(g.t * 1.3) * 4 * dt;
      if (g.done) return;
      if (s.turn) { const k = SK.clamp((g.t - s.turn) / 0.45, 0, 1); s.a = SK.lerp(s.aFrom, s.aTo, SK.easeInOut(k)); if (k >= 1) { s.turn = 0; s.a = wrapH(s.aTo); } return; }
      if (s.dive) { if (g.t - s.dive > 0.9) { s.dive = 0; s.caught++; if (s.caught >= s.n) { g.win(); g.sfx('cheer'); return; } s.i++; this_newFish(g); s.turn = g.t; s.aFrom = s.a; s.aTo = s.starts[s.i]; g.sfx('swoosh'); } return; }
      const gl = glareIn(s.a); s.seen = gl <= s.tol ? s.seen + dt : 0;
      if (s.seen > 0.4 && !s.drag) { s.dive = g.t; g.sfx('tweet'); g.sfx('whoosh'); }
      if (s.dive) { /* the splash comes as the bird reaches the water */ }
    },
    draw(g, c) {
      const s = g.s, t = g.t, f = s.f, won = g.result === 'win', lost = g.result === 'fail', gl = glareIn(s.a), dk = s.dive ? SK.clamp((t - s.dive) / 0.9, 0, 1) : 0;
      c.drawImage(g.bake('glare_lake', paintLake), 0, 0, 360, 640);
      glare(c, t, 0.96); // outside the lens: all the glare
      // inside the lens: the polarising filter passes only the part of the glare that wiggles along its stripes
      c.save(); c.beginPath(); c.arc(C[0], C[1], R, 0, 7); c.clip();
      c.drawImage(g.bake('glare_lake', paintLake), 0, 0, 360, 640);
      if (!(dk > 0.45) && !won) fish(c, f, t, 0.95);
      glare(c, t, 0.96 * gl);
      c.fillStyle = 'rgba(40,30,10,0.18)'; c.fillRect(C[0] - R, C[1] - R, R * 2, R * 2); // the lens is tinted
      c.save(); c.translate(C[0], C[1]); c.rotate(s.a); c.strokeStyle = 'rgba(30,20,10,0.22)'; c.lineWidth = 1.5; for (let x = -R; x <= R; x += 9) { c.beginPath(); c.moveTo(x, -R); c.lineTo(x, R); c.stroke(); } c.restore();
      c.restore();
      if (gl > 0.8 && !g.done) { c.save(); c.globalAlpha = (gl - 0.8) * 1.6; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(C[0], C[1], R, 0, 7); c.fill(); c.restore(); } // blinding
      // the frame, the stripes' direction and the turning tab
      c.save(); c.strokeStyle = '#2a1a2a'; c.lineWidth = 10; c.beginPath(); c.arc(C[0], C[1], R + 4, 0, 7); c.stroke(); c.strokeStyle = '#6a4a6a'; c.lineWidth = 3; c.beginPath(); c.arc(C[0], C[1], R + 2, 0, 7); c.stroke();
      c.fillStyle = '#2a1a2a'; c.fillRect(C[0] + R + 4, C[1] - 10, 30, 12); c.restore(); // the bridge to the other lens, off-screen
      for (const sg of [1, -1]) { const ax = C[0] + sg * Math.cos(s.a - Math.PI / 2) * TAB, ay = C[1] + sg * Math.sin(s.a - Math.PI / 2) * TAB; c.fillStyle = sg > 0 ? '#ffd45a' : '#c8a040'; c.strokeStyle = '#2a1a2a'; c.lineWidth = 2.5; c.beginPath(); c.arc(ax, ay, sg > 0 ? 12 : 8, 0, 7); c.fill(); c.stroke(); }
      SK.tag(c, 'Sunglasses', C[0] - 46, C[1] - R - 30, 18);
      if (gl > s.tol && !g.done && !s.dive) SK.tag(c, 'Glare', 66, 300, 18, '#1e4a6a', 'rgba(255,255,255,0.85)');
      if (gl <= s.tol && !s.dive && !won) SK.tag(c, 'Fish!', f.x, f.y + 34, 18);
      // the bird on the dock post: squints in the glare, dives for the fish, cheers
      let bx = 46, by = 586; if (s.dive) { const k = dk < 0.5 ? dk * 2 : (1 - dk) * 2; bx = SK.lerp(46, f.x, SK.easeInOut(k)); by = SK.lerp(586, f.y + 10, SK.easeInOut(k)); if (dk > 0.45 && !s.splash) { s.splash = 1; } }
      if (s.dive && dk > 0.42 && dk < 0.6) { c.strokeStyle = `rgba(255,255,255,${1 - (dk - 0.42) * 5})`; c.lineWidth = 3; c.beginPath(); c.ellipse(f.x, f.y + 8, 20 + (dk - 0.42) * 160, 6 + (dk - 0.42) * 30, 0, 0, 7); c.stroke(); }
      c.fillStyle = '#6a4020'; c.fillRect(30, 586, 32, 40);
      SK.animal(c, 'bird', bx, by, 1.3, { t, pose: won ? 'cheer' : lost ? 'sad' : s.dive ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : gl > 0.6 && !s.dive ? 'sad' : s.dive ? 'wow' : 'happy', noShadow: !!s.dive,
        hold: s.dive && dk > 0.5 ? (o => { o.save(); o.scale(0.5, 0.5); fish(o, { x: 0, y: 0, d: 1, col: f.col }, t, 1); o.restore(); }) : undefined });
      // caught fish in a bucket count
      if (!won) N1.pips(c, 180, 150, s.n, s.caught, { col: '#ff8a3a' });
      // which way to turn: the shorter way to upright stripes
      if (!g.done && !s.dive && !s.turn) {
        const aim = s.a < Math.PI / 2 ? 0 : Math.PI, d = aim - s.a; // s.a in [0, π): upright is 0 (or π, the same lens turned over)
        if (gl > s.tol) { const a0 = s.a - Math.PI / 2, a1 = a0 + SK.clamp(d, -1.2, 1.2); N1.turnArrow(c, C[0], C[1], R + 28, a0, a1, '#ffd45a', 6); }
        const tx = C[0] + Math.cos(s.a - Math.PI / 2) * TAB, ty = C[1] + Math.sin(s.a - Math.PI / 2) * TAB, ex = C[0] + Math.cos(aim - Math.PI / 2) * TAB, ey = C[1] + Math.sin(aim - Math.PI / 2) * TAB;
        if (gl > s.tol) { SK.grab(c, g, tx, ty, 18); SK.target(c, g, ex, ey, 14); }
        SK.demo(g, c, 'drag', [tx, ty], [ex, ey], { never: gl <= s.tol });
      }
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || s.dive || s.turn || g.t < 1.0) return;
      const tx = C[0] + Math.cos(s.a - Math.PI / 2) * TAB, ty = C[1] + Math.sin(s.a - Math.PI / 2) * TAB;
      if (!B.on) { if (glareIn(s.a) <= s.tol * 0.5) return; synth('down', tx, ty); B.on = 1; B.t0 = g.t; B.a0 = Math.atan2(ty - C[1], tx - C[0]); return; }
      const k = SK.clamp((g.t - B.t0) / 0.5, 0, 1), a = SK.lerp(B.a0, B.a0 < Math.PI / 2 && B.a0 > -Math.PI / 2 ? -Math.PI / 2 : B.a0 > 0 ? Math.PI / 2 : -Math.PI / 2, k), x = C[0] + Math.cos(a) * TAB, y = C[1] + Math.sin(a) * TAB; synth('move', x, y); if (k >= 1) { synth('up', x, y); B.on = 0; }
    },
  });
  function this_newFish(g) { const s = g.s, a = g.rand() * 6.28, r = 20 + g.rand() * 44; s.f = { x: C[0] + Math.cos(a) * r, y: C[1] + Math.sin(a) * r * 0.6, d: g.rand() < 0.5 ? 1 : -1, col: s.cols[s.i % 4] }; s.seen = 0; s.splash = 0; }
})();
