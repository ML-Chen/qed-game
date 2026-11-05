// CENTER EACH FLAG IN ITS ANTS! (cs AI-13) — clustering (k-means). Ants are scattered over a picnic blanket with
// no labels. Two flags stand at random spots, and every ant wears the colour of the flag nearest to it. Drag a flag to the
// middle of its own colour of ants (a dashed ring marks that middle). When you drop it, every ant looks again and takes the
// colour of whichever flag is now nearest, so the middles move. Keep moving flags to their middles; after a few rounds the
// flags stop moving, each in the middle of one clear group, and the ants march to their flags. Drop a flag in the middle
// of everything and the other flag's group swallows all the ants: it stands alone and droops.
// Level 1: the groups are closer together; level 2: three groups and three flags.
(() => {
  const F = { x0: 20, x1: 340, y0: 150, y1: 548 }, COLS = ['#e8403a', '#3a7ad8', '#f5b820'], SNAP = 26, DONE = 14;
  const LAYOUTS = [ // group centres, then where the flags start (both inside one group, so it takes a few rounds)
    { c: [[96, 250], [262, 450]], f: [[78, 250], [126, 276]] }, { c: [[250, 240], [100, 430]], f: [[232, 236], [274, 266]] },
    { c: [[110, 300], [260, 330]], f: [[246, 320], [284, 356]] }, { c: [[180, 220], [170, 470]], f: [[150, 470], [200, 490]] },
  ];
  const THREE = [{ c: [[90, 240], [270, 260], [180, 470]], f: [[160, 450], [200, 480], [180, 520]] }, { c: [[180, 220], [80, 440], [280, 440]], f: [[150, 230], [200, 210], [180, 260]] },
    { c: [[90, 420], [270, 420], [180, 220]], f: [[250, 400], [290, 430], [260, 460]] }, { c: [[100, 220], [260, 230], [200, 460]], f: [[80, 230], [120, 210], [110, 260]] }];
  function paint(o) {
    P.sky(o, 360, 640, ['#2a2860', '#6a4a8a', '#c88a9a']);
    N6.vgrad(o, 0, 120, 360, 520, ['#7ab860', '#5a9a48']); P.grassTufts(o, 360, 130, 620, 40, '#4a8a3a', 3);
    // the picnic blanket
    o.save(); o.translate(180, 349); o.rotate(-0.02); o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(-166, -206, 332, 412, 10); o.fill();
    o.fillStyle = 'rgba(110,170,110,0.3)'; for (let i = -166; i < 166; i += 36) o.fillRect(i, -206, 18, 412); for (let j = -206; j < 206; j += 36) o.fillRect(-166, j, 332, 18); o.restore();
    N6.vgrad(o, 0, 560, 360, 80, ['#5a9a48', '#3a7a30']);
  }
  function ant(c, x, y, col, t, ph, walk) { c.save(); c.translate(x, y); c.scale(1.35, 1.35); const w = Math.sin(t * (walk ? 18 : 3) + ph) * (walk ? 2 : 0.6);
    c.strokeStyle = '#2a1424'; c.lineWidth = 1.5; for (const s of [-1, 1]) for (const k of [-4, 0, 4]) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k + s * w * 0.6, s * 7); c.stroke(); }
    c.fillStyle = col; c.strokeStyle = '#2a1424'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(-6, 0, 5, 4, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(1, 0, 3.5, 3, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(7, 0, 3.5, 0, 7); c.fill(); c.stroke();
    c.restore(); }
  function flag(c, x, y, col, t, droop, held) { c.save(); c.translate(x, y); SK.shadow(c, 0, 2, 12, 4, 0.3); c.strokeStyle = '#5a3a2a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -52); c.stroke();
    const wv = Math.sin(t * 5) * 3; c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2; c.beginPath();
    if (droop) { c.moveTo(0, -52); c.quadraticCurveTo(6, -36, 2, -22); c.lineTo(-2, -40); } else { c.moveTo(0, -52); c.quadraticCurveTo(16, -48 + wv, 30, -42 + wv); c.quadraticCurveTo(16, -36, 0, -30); }
    c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(0, 0, held ? 6 : 4, 0, 7); c.fill(); c.restore(); }
  function assign(s) { for (const a of s.ants) { let best = 0, bd = 1e9; s.flags.forEach((f, i) => { const d = (a.x - f.x) ** 2 + (a.y - f.y) ** 2; if (d < bd) { bd = d; best = i; } }); a.k = best; } }
  function middles(s) { return s.flags.map((f, i) => { const m = s.ants.filter(a => a.k === i); if (!m.length) return null; return [m.reduce((p, a) => p + a.x, 0) / m.length, m.reduce((p, a) => p + a.y, 0) / m.length, m.length]; }); }
  function targets(s) { const ms = middles(s), n = s.ants.length, still = ms.every((m, i) => m && SK.dist(m[0], m[1], s.flags[i].x, s.flags[i].y) < DONE);
    let weak = -1; if (still) ms.forEach((m, i) => { if (m[2] < n / (s.flags.length * 2.2) && (weak < 0 || m[2] < ms[weak][2])) weak = i; }); // stuck with a tiny group: that flag goes to the loneliest ant
    return ms.map((m, i) => { if (m && m[2] >= 2 && i !== weak) return m; let far = null, fd = -1; for (const a of s.ants) { const f = s.flags[a.k], d = SK.dist(a.x, a.y, f.x, f.y); if (d > fd) { fd = d; far = a; } } return far ? [far.x, far.y, 0, true] : null; }); }
  function settled(s) { const ms = middles(s), n = s.ants.length; return ms.every((m, i) => m && m[2] >= n / (s.flags.length * 2.2) && SK.dist(m[0], m[1], s.flags[i].x, s.flags[i].y) < DONE); }
  MG.add({
    id: 'ai_cluster', stage: 'ai', cmd: 'CENTER EACH FLAG IN ITS ANTS!', time: 7, mood: 'night', winText: 'Groups found!', failText: 'Still all mixed up!', hold: 1.6,
    card: { title: 'Finding groups with no labels', kind: 'AI', ref: 'Clustering (k-means)',
      text: 'Sometimes data comes with no labels at all, just points. A model can still find groups in it.\n\nOne simple way is called k-means. Put down a few markers anywhere. Give each point to its nearest marker. Move each marker to the middle of its points. Then give the points out again, and repeat.\n\nAfter a few rounds the markers stop moving, each in the middle of one group. Shops use this to find groups of customers, and apps use it to sort photos.',
      note: 'Clustering finds groups in unlabelled data by moving each centre to the middle of its nearby points, again and again.' },
    init(g) {
      const s = g.s, three = g.level >= 2; s.v = SK.variant(g, 4); const L = three ? THREE[s.v] : LAYOUTS[s.v], spread = g.level === 1 ? 46 : 38;
      s.ants = []; L.c.forEach(([cx, cy], gi) => { const n = three ? 7 : 9; for (let i = 0; i < n; i++) { const a = g.rand() * 6.283, r = Math.sqrt(g.rand()) * spread * 1.3; s.ants.push({ x: SK.clamp(cx + Math.cos(a) * r, F.x0 + 14, F.x1 - 14), y: SK.clamp(cy + Math.sin(a) * r * 0.9, F.y0 + 14, F.y1 - 10), ph: g.rand() * 6, gi }); } });
      if (g.level === 1) { const mx = (L.c[0][0] + L.c[1][0]) / 2, my = (L.c[0][1] + L.c[1][1]) / 2; for (const a of s.ants) { a.x = SK.lerp(a.x, mx, 0.18); a.y = SK.lerp(a.y, my, 0.18); } }
      s.flags = L.f.map(([x, y]) => ({ x, y })); s.drag = null; s.rounds = 0; s.recolT = -9; s.winT = 0; assign(s);
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || g.t - s.recolT < 0.35) return; let best = null, bd = 50; s.flags.forEach(f => { const d = Math.min(SK.dist(x, y, f.x, f.y), SK.dist(x, y, f.x + 10, f.y - 40)); if (d < bd) { bd = d; best = f; } }); if (best) { s.drag = best; s.dx = best.x - x; s.dy = best.y - y; SK.dragStart(g, null, x, y); g.sfx('pop'); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; s.drag.x = SK.clamp(x + s.dx, F.x0 + 10, F.x1 - 10); s.drag.y = SK.clamp(y + s.dy, F.y0 + 54, F.y1); },
    up(g) {
      const s = g.s, f = s.drag; if (!f) return; SK.dragEnd(g); s.drag = null; const i = s.flags.indexOf(f), m = targets(s)[i];
      if (m && SK.dist(f.x, f.y, m[0], m[1]) < SNAP) { f.x = m[0]; f.y = m[1]; g.sfx('click'); }
      const before = s.ants.map(a => a.k); assign(s); s.recolT = g.t; s.rounds++; g.sfx(s.ants.some((a, j) => a.k !== before[j]) ? 'sparkle' : 'tap');
      if (settled(s)) { s.winT = g.t; g.win(); g.sfx('cheer'); }
    },
    update(g, dt) { const s = g.s; if (s.winT) for (const a of s.ants) { const f = s.flags[a.k], d = SK.dist(a.x, a.y, f.x, f.y); if (d > 26) { a.x += (f.x - a.x) / d * 60 * dt; a.y += (f.y - a.y) / d * 60 * dt; } } },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', ms = targets(s), rq = SK.clamp((t - s.recolT) / 0.35, 0, 1);
      c.drawImage(g.bake('n6cluster_bg', paint), 0, 0, 360, 640);
      // the line where "nearest" switches between two flags
      if (s.flags.length === 2 && !won) { const [a, b] = s.flags, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; c.save(); c.strokeStyle = 'rgba(58,22,64,0.35)'; c.lineWidth = 2.5; c.setLineDash([8, 7]); c.beginPath(); c.moveTo(mx - dy / L * 500, my + dx / L * 500); c.lineTo(mx + dy / L * 500, my - dx / L * 500); c.stroke(); c.restore(); }
      // the ants, in their flag's colour (a ripple of recolouring after each drop)
      for (const a of s.ants) ant(c, a.x, a.y, rq < 1 && (SK.dist(a.x, a.y, 180, 350) / 300) > rq ? '#9a8a8a' : COLS[a.k], t, a.ph, !!s.winT);
      // the middle of each flag's ants
      if (!g.done) ms.forEach((m, i) => { if (!m) return; const f = s.flags[i]; if (SK.dist(m[0], m[1], f.x, f.y) < DONE) return; c.save(); c.strokeStyle = COLS[i]; c.lineWidth = 3; c.setLineDash([6, 5]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(m[0], m[1], 16, 0, 7); c.stroke(); c.fillStyle = COLS[i]; c.beginPath(); c.arc(m[0], m[1], 3.5, 0, 7); c.fill(); c.restore(); });
      s.flags.forEach((f, i) => flag(c, f.x, f.y, COLS[i], t, !ms[i] || ms[i][3], s.drag === f));
      SK.tag(c, 'Round ' + (s.rounds + 1), 70, 132, 18);
      SK.animal(c, 'ant', 316, 612, 1.1, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: -1 });
      // guidance: drag the flag that is farthest from its middle onto that middle
      let bi = -1, bd = DONE; ms.forEach((m, i) => { if (!m) return; const d = SK.dist(m[0], m[1], s.flags[i].x, s.flags[i].y); if (d > bd) { bd = d; bi = i; } });
      if (bi >= 0 && !g.done && !s.drag) { const f = s.flags[bi], m = ms[bi]; SK.grab(c, g, f.x, f.y - 26, 26); SK.target(c, g, m[0], m[1] - 26, 26); SK.arrow(c, g, f.x, f.y - 26, m[0], m[1] - 26, { from: 28, to: 30 });
        SK.demo(g, c, 'drag', [f.x, f.y - 6], [m[0], m[1] - 6]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const B = s._a = s._a || { k: 0, n: 1.0 };
      if (B.p) { if (SK.bot.drag(g, synth, 'f' + B.k, B.t, B.p[0], B.p[1], 0.3)) { B.k++; B.p = null; B.n = g.t + 0.45; } return; }
      if (g.t < B.n) return; const ms = targets(s); let bi = -1, bd = DONE - 2; ms.forEach((m, i) => { if (!m) return; const d = SK.dist(m[0], m[1], s.flags[i].x, s.flags[i].y); if (d > bd) { bd = d; bi = i; } });
      if (bi >= 0) { const f = s.flags[bi], m = ms[bi]; B.p = [[f.x, f.y - 6], [m[0], m[1] - 6]]; B.t = g.t; }
    },
  });
})();
