// SEESAW! (physics AP1-23) — a playground seesaw. A heavy rider sits on the left; the little fox sits on the right.
// Slide the fox along the board until the seesaw hangs level and stays there. Each side's turning push is drawn as a
// curved arrow: weight times distance from the pivot. The light fox can match the heavy rider only by sitting farther
// out. Too close in, the seesaw slams down on the heavy side and the fox is tossed up. Two balances at level 0, three at
// level 1 (each with a new rider or seat); level 2 puts two riders on the left.
(() => {
  const PV = [180, 470], HALF = 150, TMAX = 0.28, WF = 1, FMIN = 18, FMAX = 146;
  const ROUNDS = [ // left riders: [kind, weight, distance from the pivot]; each balance needs the fox in a new seat
    [[['beaver', 2, 62]], [['penguin', 2.5, 36]], [['beaver', 2, 68]]],
    [[['penguin', 2.5, 44]], [['beaver', 2, 66]], [['rabbit', 1.5, 56]]],
    [[['rabbit', 1.5, 86]], [['penguin', 2.5, 36]], [['beaver', 2, 56]]],
    [[['beaver', 2, 48]], [['rabbit', 1.5, 92]], [['penguin', 2.5, 30]]] ];
  const PAIRS = [[['beaver', 2, 40], ['rabbit', 1.5, 20]], [['penguin', 2.5, 40], ['hedgehog', 1, 40]], [['rabbit', 1.5, 30], ['hedgehog', 1, 30]]];
  const tq = rs => rs.reduce((a, r) => a + r[1] * r[2], 0);
  function paintPark(o) {
    P.sky(o, 360, 640, ['#8ad0f0', '#c8ecf8', '#fff4d8'], { x: 60, y: 150, r: 24, color: '#fff2b0' });
    P.cloud(o, 250, 180, 0.7); P.cloud(o, 110, 250, 0.45); P.hills(o, 360, 420, 40, '#9ad070', '#6aa048', { seed: 3 });
    for (const [x, s] of [[30, 0.75], [330, 0.65]]) P.tree(o, x, 430, s);
    N1.vgrad(o, 0, 500, 360, 140, ['#e8d0a0', '#c8a870']); const r = P.rng(9); for (let i = 0; i < 120; i++) { o.fillStyle = r() < 0.5 ? 'rgba(150,110,60,0.3)' : 'rgba(255,245,220,0.5)'; o.fillRect(r() * 360, 500 + r() * 140, 2, 2); } // sand
    // the pivot stand
    o.fillStyle = '#c84a3a'; o.beginPath(); o.moveTo(PV[0] - 30, 512); o.lineTo(PV[0], PV[1] + 4); o.lineTo(PV[0] + 30, 512); o.closePath(); o.fill(); o.strokeStyle = '#6a2018'; o.lineWidth = 2.5; o.stroke();
  }
  MG.add({
    id: 'seesaw', stage: 'forces', cmd: 'SLIDE THE FOX TO LEVEL THE SEESAW!', time: 7, mood: 'night', winText: 'Balanced!', failText: 'Lopsided!',
    card: { title: 'Balancing a seesaw', kind: 'Physics', ref: 'Torque (turning force)',
      text: 'Each rider tries to turn the seesaw around its middle, the pivot. How hard they turn it depends on two things: how heavy they are, and how far from the pivot they sit.\n\nWeight times distance gives the turning push. A light rider far out can turn as hard as a heavy rider close in. When the two turning pushes are equal, the seesaw balances.\n\nThe same rule lets a long spanner undo a tight nut and a crane lift heavy loads.',
      note: 'Weight times distance from the pivot sets the turn. A light rider balances a heavy one by sitting farther out.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4);
      s.rounds = lv >= 2 ? SK.shuffled(g, PAIRS) : ROUNDS[v].slice(0, lv === 0 ? 2 : 3); s.n = s.rounds.length; s.tol = lv >= 2 ? 5 : 7;
      s.i = 0; s.fd = 30; s.th = -TMAX; s.om = 0; s.bal = 0; s.doneN = 0; s.lockT = 0; s.drag = false; s.toss = 0; s.prevTh = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.lockT) return; const fx = PV[0] + Math.cos(s.th) * s.fd, fy = PV[1] + Math.sin(s.th) * s.fd;
      if (SK.dist(x, y, fx, fy - 30) < 60) { s.drag = true; SK.dragStart(g, null, x, y); s.gx = s.fd - ((x - PV[0]) * Math.cos(s.th) + (y - PV[1]) * Math.sin(s.th)); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); s.fd = SK.clamp((x - PV[0]) * Math.cos(s.th) + (y - PV[1]) * Math.sin(s.th) + s.gx, FMIN, FMAX); },
    up(g) { const s = g.s; if (s.drag) { s.drag = false; SK.dragEnd(g); } },
    update(g, dt) {
      const s = g.s; if (g.done) return; const L = s.rounds[Math.min(s.i, s.n - 1)], net = WF * s.fd - tq(L); // > 0 turns the right side down
      // the board swings toward the heavier side (and rests on the ground), or hangs level when the turns are equal
      const want = Math.abs(net) <= s.tol * WF ? 0 : SK.clamp(net / 22, -1, 1) * TMAX; s.om += ((want - s.th) * 60 - s.om * 9) * dt; s.th = SK.clamp(s.th + s.om * dt, -TMAX, TMAX);
      if ((s.th <= -TMAX && s.prevTh > -TMAX + 0.02) || (s.th >= TMAX && s.prevTh < TMAX - 0.02)) { g.sfx('thud'); if (s.th < 0 && Math.abs(s.om) > 0.4) s.toss = g.t; s.om = 0; } s.prevTh = s.th;
      if (s.lockT) { if (g.t - s.lockT > 0.7) { s.lockT = 0; s.i++; s.bal = 0; if (s.doneN >= s.n) { g.win(); g.sfx('cheer'); } else { g.sfx('pop'); } } return; }
      s.bal = Math.abs(net) <= s.tol * WF && Math.abs(s.th) < 0.03 && !s.drag ? s.bal + dt : 0;
      if (s.bal > 0.45) { s.lockT = g.t; s.doneN++; g.sfx('chime'); g.sfx('ding'); g.burst(PV[0], PV[1] - 60, ['#ffd45a', '#fff6ea', '#8affb0'], 18, 160); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.rounds[Math.min(s.i, s.n - 1)], net = WF * s.fd - tq(L);
      c.drawImage(g.bake('seesaw_park', paintPark), 0, 0, 360, 640);
      const cs = Math.cos(s.th), sn = Math.sin(s.th), on = d => [PV[0] + cs * d, PV[1] + sn * d];
      // the board
      c.save(); c.translate(PV[0], PV[1]); c.rotate(s.th); c.fillStyle = '#e8a040'; c.strokeStyle = '#7a4a10'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-HALF, -8, HALF * 2, 12, 5); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(-HALF + 6, -6, HALF * 2 - 12, 3);
      for (const sx of [-HALF + 10, HALF - 10]) { c.fillStyle = '#5a5a6a'; c.fillRect(sx - 2, -26, 4, 20); c.fillRect(sx - 8, -28, 16, 4); } // handles
      c.restore(); c.fillStyle = '#6a2018'; c.beginPath(); c.arc(PV[0], PV[1], 6, 0, 7); c.fill();
      // the riders on the left
      const pose = won || s.lockT ? 'cheer' : lost ? 'sad' : 'idle';
      for (const [kind, w, d] of L) { const [x, y] = on(-d); SK.animal(c, kind, x, y - 6, 0.7 + w * 0.28, { t, pose, expr: won || s.lockT ? 'laugh' : s.th < -0.2 ? 'happy' : s.th > 0.2 ? 'wow' : 'happy', noShadow: true }); }
      // the fox (tossed up when the seesaw slams down on the heavy side)
      const [fx, fy] = on(s.fd), tk = s.toss && t - s.toss < 0.6 ? (t - s.toss) / 0.6 : 0, hop = tk ? Math.sin(tk * Math.PI) * 70 : 0;
      SK.animal(c, 'fox', fx, fy - 6 - hop, 1.0, { t, pose: tk ? 'hop' : pose, expr: tk ? 'wow' : won || s.lockT ? 'laugh' : 'happy', facing: -1, noShadow: true });
      // the two turning pushes: curved arrows, as big as weight times distance; green when they match
      if (!won) { const tl = tq(L), tr = WF * s.fd, eq = Math.abs(tr - tl) <= s.tol * WF, k = 1 / 1.6;
        const arc = (side, T) => { const r = 40 + T * 0.18 * k, a0 = side < 0 ? Math.PI * 1.05 : -Math.PI * 0.05, sw = Math.min(1.25, 0.3 + T * 0.006), x = PV[0] + side * 100, y = PV[1] - 56;
          N1.turnArrow(c, PV[0], PV[1], 62 + Math.min(40, T * 0.12), side < 0 ? Math.PI + 0.25 : -0.25, side < 0 ? Math.PI + 0.25 + sw * 0.0 - Math.min(1.1, 0.25 + T * 0.006) : -0.25 + Math.min(1.1, 0.25 + T * 0.006), eq ? '#6ae07a' : side < 0 ? '#ff8a5a' : '#ffd45a', 5 + Math.min(5, T * 0.025)); };
        arc(-1, tl); arc(1, tr); SK.tag(c, 'Pivot', PV[0], PV[1] + 62, 18); }
      if (!g.done) N1.pips(c, 180, 150, s.n, s.doneN);
      // guidance: slide the fox to where its turn matches the left side's
      if (g.done || s.lockT) return; const td = SK.clamp(tq(L) / WF, FMIN, FMAX), [tx, ty] = on(td), off = Math.abs(td - s.fd) > s.tol * 0.6;
      if (off) { SK.grab(c, g, fx, fy - 30, 30); SK.target(c, g, tx, ty - 6, 14); SK.arrow(c, g, fx, fy + 22, tx, ty + 22, { from: 0, to: 6 }); }
      SK.demo(g, c, 'drag', [fx, fy - 30], [tx, ty - 30], { never: !off });
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || s.lockT || g.t < 1.0) return; const L = s.rounds[s.i], td = tq(L) / WF;
      if (Math.abs(td - s.fd) <= s.tol * 0.4 && !B.on) return; const fx = PV[0] + Math.cos(s.th) * s.fd, fy = PV[1] + Math.sin(s.th) * s.fd;
      if (!B.on) { synth('down', fx, fy - 30); B.on = 1; B.t0 = g.t; B.f0 = s.fd; return; }
      const k = SK.clamp((g.t - B.t0) / 0.5, 0, 1), d = SK.lerp(B.f0, td, k), x = PV[0] + Math.cos(s.th) * d, y = PV[1] + Math.sin(s.th) * d - 30; synth('move', x, y); if (k >= 1) { synth('up', x, y); B.on = 0; }
    },
  });
})();
