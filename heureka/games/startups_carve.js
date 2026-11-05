// CARVE A SLICE FOR NEW HIRES! (business SV-23, the option pool) — the company is a pie owned by the fox and the
// beaver (and, later, investors). Three future employees wait by an empty plate; an investor is walking over to buy
// a new slice. A dashed wedge marks the pool to set aside for the people you will hire. Swipe the knife from the
// middle out along each dashed edge to carve it: the wedge turns green, every slice already in the pie thins a little
// to make room, and the hires cheer. Then the investor arrives and adds their slice. Let the investor arrive first and
// the deal closes with no pool: the hires walk away. Two rounds (seed, then the next round). Level 1: a thinner
// wedge, a quicker investor. Level 2: in the second round the investor is already in, so their slice thins too.
(() => {
  const PC = { x: 180, y: 360, r: 104 }, HIRES = [[262, 560], [296, 566], [330, 560]];
  const TAU = Math.PI * 2, COL = { fox: '#f0a040', beaver: '#a8703a', inv: '#5a8ad8', inv2: '#7a6ad8', pool: '#5ad07a' };
  const ROT = [[-1.2, 0.9], [0.3, -2.4], [-2.0, 1.6], [1.0, -0.6], [-0.3, 2.2]];
  const LV = [{ pool: 0.14, tol: 0.2, walk: 10 }, { pool: 0.11, tol: 0.16, walk: 8 }, { pool: 0.11, tol: 0.14, walk: 7 }];
  function paintRoom(o) {
    const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#ffb0a0'); w.addColorStop(0.55, '#ffd8b8'); w.addColorStop(1, '#fff4e0'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.3)'; for (let i = 0; i < 9; i++) { o.beginPath(); o.arc(20 + i * 42, 150 + (i % 2) * 20, 10, 0, 7); o.fill(); }
    const tb = o.createLinearGradient(0, 470, 0, 640); tb.addColorStop(0, '#c88a5a'); tb.addColorStop(1, '#8a5430'); o.fillStyle = tb; o.fillRect(0, 486, 360, 154);
    o.fillStyle = '#e0a870'; o.fillRect(0, 480, 360, 10);
    // the cake board under the pie
    o.fillStyle = '#fff6ea'; o.beginPath(); o.ellipse(PC.x, PC.y + 14, PC.r + 18, PC.r + 8, 0, 0, 7); o.fill(); o.strokeStyle = '#e0c8b0'; o.lineWidth = 3; o.stroke();
    // the hires' plate
    o.fillStyle = '#fff6ea'; o.beginPath(); o.ellipse(296, 600, 56, 14, 0, 0, 7); o.fill(); o.strokeStyle = '#d0b8a0'; o.lineWidth = 2; o.stroke();
  }
  MG.add({
    id: 'carvepool', stage: 'startups', cmd: 'CARVE A SLICE FOR NEW HIRES!', time: 8, mood: 'party', winText: 'A slice saved for the team!', failText: 'No slice for the hires!', hold: 1.6,
    card: { title: 'Save a slice for the team', kind: 'Startups', ref: 'The option pool',
      text: 'Startups pay early employees partly in "options": the right to buy a small piece of the company later, cheaply. The company sets aside a slice of the pie for this, called the option pool.\n\nCarving the pool thins every slice already in the pie. Investors usually ask for the pool to be carved just before their money comes in. Then the pool comes out of the founders\' and earlier owners\' slices, and not out of the new investor\'s.\n\nCarve it after the investor joins, and their slice thins too.',
      note: 'An option pool sets aside part of the company for future employees, and it thins the slices of whoever owns the company when it is carved.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.lv = LV[L]; s.ri = 0; s.sl = [{ w: 'fox', f: 0.6 }, { w: 'beaver', f: 0.4 }]; s.trail = null; this.newRound(g);
    },
    newRound(g) {
      const s = g.s, L = s.L; s.rot = ROT[s.v][s.ri]; s.cut = [false, false]; s.phase = 'carve'; s.pt = g.t; s.miss = null;
      s.post = L === 2 && s.ri === 1; if (s.post) this.addInvestor(s, 'inv2', 0.2);
      s.ix = 420; s.from = s.sl.map(o => o.f); s.tw = 1;
    },
    addInvestor(s, w, f) { for (const o of s.sl) o.f *= 1 - f; s.sl.push({ w, f }); },
    // the layout: the pool first (from rot), then the rest; the wedge to carve sits right after the current pool
    edges(s) { const p = (s.sl.find(o => o.w === 'pool') || { f: 0 }).f; const a1 = s.rot + p * TAU, a2 = a1 + s.lv.pool * TAU; return [a1, a2]; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'carve') return; if (SK.dist(x, y, PC.x, PC.y) < 46) { s.trail = { x0: x, y0: y, x, y }; g.sfx('stretch', { vol: 0.3 }); } },
    move(g, x, y) { const s = g.s; if (s.trail) { s.trail.x = x; s.trail.y = y; } },
    up(g) {
      const s = g.s, tr = s.trail; s.trail = null; if (!tr || g.done || s.phase !== 'carve') return;
      if (SK.dist(tr.x, tr.y, PC.x, PC.y) < PC.r * 0.8) { g.sfx('swoosh', { vol: 0.4 }); return; }
      const a = Math.atan2(tr.y - PC.y, tr.x - PC.x), E = this.edges(s); let hit = -1;
      for (let i = 0; i < 2; i++) { let d = a - E[i]; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; if (!s.cut[i] && Math.abs(d) < s.lv.tol) hit = i; }
      if (hit < 0) { s.miss = { a, t: g.t }; g.sfx('wrong', { vol: 0.5 }); g.shake(3, 0.15); return; }
      s.cut[hit] = true; g.sfx('crunch'); g.sfx('swoosh', { pitch: 1.4, vol: 0.5 });
      if (s.cut[0] && s.cut[1]) { // carve: every slice in the pie now thins to make room for the pool
        s.from = s.sl.map(o => o.f); const P = s.lv.pool; for (const o of s.sl) if (o.w !== 'pool') o.f *= 1 - P; const pool = s.sl.find(o => o.w === 'pool'); if (pool) pool.f = pool.f * (1 - P) + P; else s.sl.unshift({ w: 'pool', f: P }); s.from = s.from.length < s.sl.length ? [0].concat(s.from) : s.from;
        s.tw = 0; s.phase = 'carved'; s.pt = g.t; g.sfx('magic'); g.sfx('cheer', { vol: 0.5 }); g.burst(PC.x, PC.y, ['#5ad07a', '#ffe27a', '#fff6ea'], 18, 180);
      }
    },
    update(g, dt) {
      const s = g.s, lv = s.lv; s.tw = Math.min(1, s.tw + dt / 0.5);
      if (g.done) return;
      const walking = !s.post && (s.phase === 'carve' || s.phase === 'carved');
      if (walking) { const goal = 300, sp = (420 - goal) / lv.walk * (s.phase === 'carved' ? 6 : 1); s.ix = Math.max(goal, s.ix - sp * dt);
        if (s.ix <= goal) { if (s.phase === 'carve') { s.phase = 'nopool'; s.pt = g.t; g.sfx('wrong'); g.fail(); return; }
          s.from = s.sl.map(o => o.f); this.addInvestor(s, s.ri ? 'inv2' : 'inv', 0.2); s.from.push(0); s.tw = 0; s.phase = 'joined'; s.pt = g.t; g.sfx('coin'); g.sfx('pop'); } }
      if (s.post && s.phase === 'carved' && g.t - s.pt > 0.3) { s.phase = 'joined'; s.pt = g.t; }
      if (s.phase === 'joined' && g.t - s.pt > 0.7) { s.ri++; if (s.ri >= 2) { g.win(); g.sfx('cheer'); } else this.newRound(g); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L;
      c.drawImage(g.bake('n7carve', paintRoom), 0, 0, 360, 640);
      // the pie
      const fr = s.sl.map((o, i) => SK.lerp(s.from[i] ?? o.f, o.f, SK.easeInOut(s.tw))), sum = fr.reduce((a, b) => a + b, 0); let a = s.rot;
      for (let i = 0; i < s.sl.length; i++) { const o = s.sl[i], da = fr[i] / sum * TAU; c.fillStyle = COL[o.w]; c.beginPath(); c.moveTo(PC.x, PC.y); c.arc(PC.x, PC.y, PC.r, a, a + da); c.closePath(); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.stroke();
        o._m = a + da / 2; o._da = da; a += da; }
      c.strokeStyle = '#7a4a20'; c.lineWidth = 3; c.beginPath(); c.arc(PC.x, PC.y, PC.r, 0, TAU); c.stroke();
      // the dashed wedge still to carve, and the cuts made
      const E = this.edges(s);
      if (s.phase === 'carve') {
        c.save(); c.fillStyle = 'rgba(90,208,122,0.25)'; c.beginPath(); c.moveTo(PC.x, PC.y); c.arc(PC.x, PC.y, PC.r, E[0], E[1]); c.closePath(); c.fill(); c.restore();
        for (let i = 0; i < 2; i++) { c.save(); c.strokeStyle = s.cut[i] ? '#3a1640' : '#fff6ea'; c.lineWidth = s.cut[i] ? 4 : 3; if (!s.cut[i]) { c.setLineDash([7, 6]); c.lineDashOffset = -t * 20; } c.beginPath(); c.moveTo(PC.x, PC.y); c.lineTo(PC.x + Math.cos(E[i]) * (PC.r + 14), PC.y + Math.sin(E[i]) * (PC.r + 14)); c.stroke(); c.restore(); }
      }
      if (s.miss && t - s.miss.t < 0.5) { c.save(); c.globalAlpha = 1 - (t - s.miss.t) * 2; c.strokeStyle = '#e8403a'; c.lineWidth = 4; c.beginPath(); c.moveTo(PC.x, PC.y); c.lineTo(PC.x + Math.cos(s.miss.a) * (PC.r + 10), PC.y + Math.sin(s.miss.a) * (PC.r + 10)); c.stroke(); c.restore(); }
      if (s.trail) { c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(s.trail.x0, s.trail.y0); c.lineTo(s.trail.x, s.trail.y); c.stroke(); c.lineCap = 'butt'; }
      // labels on the slices
      for (const o of s.sl) if (o._da > 0.4) { const lx = PC.x + Math.cos(o._m) * PC.r * 0.62, ly = PC.y + Math.sin(o._m) * PC.r * 0.62; SK.tag(c, { fox: 'Fox', beaver: 'Beaver', inv: 'Investor', inv2: 'Investor', pool: 'Pool' }[o.w], lx, ly, 18); }
      // the knife at the centre
      if (s.phase === 'carve' && !g.done) { const kx = s.trail ? s.trail.x : PC.x, ky = s.trail ? s.trail.y : PC.y; c.save(); c.translate(kx, ky); c.rotate(s.trail ? Math.atan2(s.trail.y - s.trail.y0, s.trail.x - s.trail.x0) : -0.6); c.fillStyle = '#d8dce4'; c.strokeStyle = '#5a5a68'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -5); c.lineTo(34, -2); c.lineTo(38, 2); c.lineTo(0, 5); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#6a3a1a'; c.beginPath(); c.roundRect(-22, -5, 22, 10, 4); c.fill(); c.restore(); }
      // the investor walking over (or already in), the founders, the hires
      if (!s.post || s.phase !== 'carve') SK.animal(c, 'owl', s.post ? 300 : s.ix, 470, 0.9, { t, facing: -1, pose: s.ix > 300 && !s.post ? 'walk' : 'carry', expr: 'happy', hold: s.ix > 300 && !s.post ? (h => { h.fillStyle = COL[s.ri ? 'inv2' : 'inv']; h.beginPath(); h.moveTo(0, 0); h.arc(0, 0, 22, -2.2, -1.0); h.closePath(); h.fill(); }) : null });
      if (s.post && s.phase === 'carve') SK.animal(c, 'owl', 300, 470, 0.9, { t, facing: -1, pose: 'idle', expr: 'think' });
      SK.animal(c, 'fox', 44, 470, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
      SK.animal(c, 'beaver', 70, 600, 0.8, { t, phase: 2, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
      const got = s.sl.some(o => o.w === 'pool');
      for (let i = 0; i < 3; i++) { const [hx, hy] = HIRES[i], leave = lost ? (t - g.doneAt) * 120 : 0; SK.animal(c, 'ant', hx + leave, hy, 0.75, { t, phase: i, facing: lost ? 1 : -1, pose: lost ? 'walk' : got && s.phase !== 'carve' || won ? 'cheer' : 'idle', expr: lost ? 'sad' : got ? 'laugh' : 'think' }); }
      if (got) { const pf = s.sl.find(o => o.w === 'pool').f; c.fillStyle = COL.pool; c.strokeStyle = '#2a8a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(296, 604); c.arc(296, 604, 40, -Math.PI / 2 - pf * Math.PI, -Math.PI / 2 + pf * Math.PI); c.closePath(); c.save(); c.translate(296, 604); c.scale(1, 0.35); c.translate(-296, -604); c.fill(); c.stroke(); c.restore(); }
      SK.tag(c, 'Future hires', 296, 520, 18);
      if (!g.done) SK.tag(c, 'Round ' + Math.min(s.ri + 1, 2) + ' / 2', 70, 200, 18);
      // guidance: swipe from the middle out along the next dashed edge
      if (s.phase === 'carve' && !g.done && !s.trail) { const i = s.cut[0] ? 1 : 0, ex = PC.x + Math.cos(E[i]) * (PC.r + 16), ey = PC.y + Math.sin(E[i]) * (PC.r + 16);
        SK.grab(c, g, PC.x, PC.y, 24); SK.target(c, g, ex, ey, 18); SK.arrow(c, g, PC.x, PC.y, ex, ey, { from: 30, to: 24 });
        SK.demo(g, c, 'drag', [PC.x, PC.y], [ex, ey], { delay: 0.6 }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'carve') return; const B = s._n7 = s._n7 || { n: 0 };
      if (!B.cur) { if (B.wait == null) { B.wait = g.t + 0.3; return; } if (g.t < B.wait) return; B.wait = null; const E = this.edges(s), i = s.cut[0] ? 1 : 0; B.n++; B.cur = { k: 'c' + B.n, b: [PC.x + Math.cos(E[i]) * (PC.r + 16), PC.y + Math.sin(E[i]) * (PC.r + 16)], at: g.t }; }
      if (SK.bot.drag(g, synth, B.cur.k, B.cur.at, [PC.x, PC.y], B.cur.b, 0.35)) B.cur = null;
    },
  });
})();
