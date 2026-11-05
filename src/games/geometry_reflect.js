// geometry_reflect.js — REFLECT! Reflect a triangle over a mirror line on the coordinate grid: every corner lands just as
// far beyond the mirror as it was in front of it, on the line straight across.
// A still pond at dawn seen from above, with a frog on a lily pad. The coordinate grid floats on the water, the mirror
// line is a bright ribbon of light, and a pink triangle of water lilies sits on one side with each corner's coordinates
// beside it. Every move acts its working out:
//   1-3. Drag a corner across the mirror (any corner first; a drop anywhere on the far side counts): the corner and its
//        coordinates are circled, a dotted path draws itself straight across the mirror, and the lily hops one grid step
//        at a time, counting 1, 2, 3 up to the mirror and 1, 2, 3 again beyond it. Where it lands, its coordinates are
//        copied and change in front of you: over the y-axis the x rolls to its opposite, (3, 1) → (−3, 1); over the
//        x-axis the y does; over the line y = x the two numbers swap places, (4, 2) → (2, 4).
//   After the third corner the new triangle's edges draw themselves and it fills with light.
// Wrong moves: tapping a coordinate label or a landed corner wobbles. Level 0: the y-axis.
// Level 1: the x-axis. Level 2: the line y = x. Medium mode: the tray asks for the coordinate that changes.
const M = MK, OX = 180, OY = 334, C = 31, N = 5, GOLD = '#ffd45a', CYAN = '#7ae8ff', LILY = '#ff8ab8';
const toS = (x, y) => [OX + x * C, OY - y * C];
function pick(g) {
  const r = k => Math.floor(g.rand() * k), mir = ['y', 'x', 'yx'][Math.min(2, g.level)];
  const ok = p => mir === 'y' ? p.x >= 1 && p.x <= 4 && Math.abs(p.y) <= 4 : mir === 'x' ? p.y >= 1 && p.y <= 4 && Math.abs(p.x) <= 4 : p.x > p.y && (p.x - p.y) % 2 === 0 && (p.x - p.y) <= 6 && Math.abs(p.x) <= 4 && Math.abs(p.y) <= 4;
  for (let tries = 0; tries < 400; tries++) {
    const V = []; while (V.length < 3) { const p = { x: r(9) - 4, y: r(9) - 4 }; if (ok(p)) V.push(p); }
    const a2 = Math.abs((V[1].x - V[0].x) * (V[2].y - V[0].y) - (V[2].x - V[0].x) * (V[1].y - V[0].y));
    const far = V.every((p, i) => V.every((q, j) => i === j || Math.hypot(p.x - q.x, p.y - q.y) >= 2.2));
    if (a2 >= 6 && far) return { mir, V };
  }
  return { mir, V: mir === 'y' ? [{ x: 1, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 4 }] : mir === 'x' ? [{ x: -3, y: 1 }, { x: 2, y: 2 }, { x: -1, y: 4 }] : [{ x: 2, y: -2 }, { x: 4, y: 0 }, { x: 1, y: -3 }] };
}
const refl = (mir, p) => mir === 'y' ? { x: -p.x, y: p.y } : mir === 'x' ? { x: p.x, y: -p.y } : { x: p.y, y: p.x };
const foot = (mir, p) => mir === 'y' ? { x: 0, y: p.y } : mir === 'x' ? { x: p.x, y: 0 } : { x: (p.x + p.y) / 2, y: (p.x + p.y) / 2 };
function paintBg(c, W, H) {
  const wt = c.createLinearGradient(0, 0, 0, H); wt.addColorStop(0, '#1e5a6a'); wt.addColorStop(0.5, '#2a7480'); wt.addColorStop(1, '#1a4a58'); c.fillStyle = wt; c.fillRect(0, 0, W, H);
  // dawn sky reflected in the water
  const rf = c.createRadialGradient(260, 120, 10, 260, 120, 300); rf.addColorStop(0, 'rgba(255,190,150,0.35)'); rf.addColorStop(1, 'rgba(255,190,150,0)'); c.fillStyle = rf; c.fillRect(0, 0, W, H);
  // reeds and lily pads around the edges
  const pad = (x, y, r, a) => { c.fillStyle = '#3a8a4a'; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a + 0.3, a + Math.PI * 2 - 0.3); c.closePath(); c.fill(); c.strokeStyle = 'rgba(200,255,200,0.25)'; c.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const b = a + 0.5 + k * 0.9; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(b) * r * 0.9, y + Math.sin(b) * r * 0.9); c.stroke(); } };
  for (const [x, y, r, a] of [[22, 200, 22, 0.4], [340, 250, 26, 2.6], [30, 500, 30, 5.2], [330, 470, 20, 1.2], [70, 600, 34, 0.2], [290, 618, 40, 3.4], [180, 560, 18, 4.0]]) pad(x, y, r, a);
  c.strokeStyle = '#2a5a2a'; c.lineWidth = 4; c.lineCap = 'round'; for (const [x, h] of [[8, 70], [20, 50], [350, 80], [338, 56]]) { c.beginPath(); c.moveTo(x, H); c.quadraticCurveTo(x + 6, H - h / 2, x - 2, H - h); c.stroke(); }
  // the grid floating on the water
  c.strokeStyle = 'rgba(220,250,255,0.18)'; c.lineWidth = 1; for (let k = -N; k <= N; k++) { const [x] = toS(k, 0), [, y] = toS(0, k); c.beginPath(); c.moveTo(x, OY - N * C); c.lineTo(x, OY + N * C); c.stroke(); c.beginPath(); c.moveTo(OX - N * C, y); c.lineTo(OX + N * C, y); c.stroke(); }
  c.strokeStyle = 'rgba(240,255,255,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(OX - N * C - 6, OY); c.lineTo(OX + N * C + 6, OY); c.moveTo(OX, OY + N * C + 6); c.lineTo(OX, OY - N * C - 6); c.stroke();
  c.fillStyle = 'rgba(240,255,255,0.7)'; for (const [x, y, a] of [[OX + N * C + 10, OY, 0], [OX, OY - N * C - 10, -Math.PI / 2]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(6, 0); c.lineTo(-5, -5); c.lineTo(-5, 5); c.fill(); c.restore(); }
  c.font = 'italic 700 20px Georgia, serif'; c.fillStyle = 'rgba(240,255,255,0.85)'; c.fillText('x', OX + N * C - 4, OY + 22); c.fillText('y', OX + 10, OY - N * C + 6);
}

MG.add({
  id: 'geometry_reflect', stage: 'geometry', cmd: 'REFLECT!', hint: 'drag', time: 10, mood: 'sea', winText: 'Mirrored!', hold: 1.7,
  card: {
    title: 'Reflections', ref: 'Grade 8', kind: 'Geometry',
    text: 'A reflection flips a shape over a mirror line. Every point moves straight across the line and lands just as far on the other side as it started.\n\nOn a grid this has a simple pattern. Over the y-axis, x becomes its opposite: (3, 1) lands on (−3, 1). Over the x-axis, y becomes its opposite: (3, 1) lands on (3, −1). Over the line y = x, the two numbers trade places: (4, 2) lands on (2, 4).\n\nReflect each corner of a shape and join the new corners. The new shape is the same size and shape, but flipped, like your left hand and your right hand.',
    note: 'Over the y-axis (x, y) → (−x, y). Over the x-axis (x, y) → (x, −y). Over y = x, (x, y) → (y, x).',
    ask: 'Reflect (2, 5) over the y-axis. Reflect (−1, 3) over the line y = x.',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g), { mir, V } = S;
    S.I = V.map(p => refl(mir, p)); S.F = V.map(p => foot(mir, p)); S.land = []; S.hops = []; S.done = []; S.cx = [];
    const cen = V.reduce((s, p) => ({ x: s.x + p.x / 3, y: s.y + p.y / 3 }), { x: 0, y: 0 }), icen = refl(mir, cen);
    // a coordinate label beside a corner, pushed out away from the triangle's middle and kept on screen
    // coordinate labels: each one goes where it overlaps no other label, no corner and not the mirror, preferring the side
    // away from the mirror and away from the triangle's middle
    const LW = p => M.lay(M.row(M.txt('('), M.num(p.x), M.txt(', '), M.num(p.y), M.txt(')')), 22).w + 14, placed = [], pts = [...V, ...S.I].map(p => toS(p.x, p.y));
    const side = (x, y) => mir === 'y' ? x - OX : mir === 'x' ? OY - y : ((x - OX) + (y - OY)) / Math.SQRT2;
    const okRect = r => { if (r.x - r.w / 2 < 10 || r.x + r.w / 2 > 350 || r.y - r.h / 2 < 176 || r.y + r.h / 2 > 504) return false;
      if (placed.some(q => Math.abs(q.x - r.x) < (q.w + r.w) / 2 + 4 && Math.abs(q.y - r.y) < (q.h + r.h) / 2 + 3)) return false;
      if (pts.some(([px, py]) => Math.abs(px - r.x) < r.w / 2 + 12 && Math.abs(py - r.y) < r.h / 2 + 12)) return false;
      const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => side(r.x + u * r.w / 2, r.y + v * r.h / 2)); return cs.every(v => v > 5) || cs.every(v => v < -5); };
    const labFor = (p, c0) => { const [x, y] = toS(p.x, p.y), w = LW(p), h = 27, [cx, cy] = toS(c0.x, c0.y), sd = Math.sign(side(x, y)) || 1;
      const away = mir === 'y' ? [sd, 0] : mir === 'x' ? [0, -sd] : [sd * 0.7071, sd * 0.7071], out = [x - cx, y - cy], L = Math.hypot(...out) || 1;
      let best = null, bs = -1e9;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, -1], [0, 1], [1, -1], [-1, -1], [1, 1], [-1, 1]]) for (const far of [0, 1]) {
        const r = { x: x + dx * (w / 2 + 14 + far * 14), y: y + dy * (h / 2 + 12 + far * 10), w, h }; if (!okRect(r)) continue;
        const sc = (dx * away[0] + dy * away[1]) * 1.2 + (dx * out[0] + dy * out[1]) / L - far * 0.8; if (sc > bs) { bs = sc; best = r; } }
      best = best || { x: M.clamp(x + 40 * Math.sign(out[0] || 1), 50, 310), y: M.clamp(y - 28, 190, 490), w, h }; placed.push(best); return [best.x, best.y]; };
    S.lab = V.map(p => labFor(p, cen)); S.ilab = S.I.map(p => labFor(p, icen));
    const labAt = (p, c0) => { const i = V.indexOf(p); if (i >= 0) return S.lab[i]; return S.ilab[S.I.indexOf(p)]; };
    S.labAt = labAt; S.cen = cen; S.icen = icen;
    const coord = (p, id, o = {}) => { const xs = M.num(p.x, null, o), ys = M.num(p.y, null, o); return { row: M.row(M.txt('('), xs, M.txt(', '), ys, M.txt(')')), xs, ys }; };
    S.coord = coord;
    V.forEach((p, i) => { const q = coord(p, 'c' + i), [lx, ly] = labAt(p, cen); q.row.id = 'c' + i; M.place(g, 'c' + i, q.row, lx, ly + 8, 22, { col: '#ffffff' });
      const [x, y] = toS(p.x, p.y); M.zone(g, 'v' + i, { x, y, w: 38, h: 38 }); const [fx, fy] = toS(S.F[i].x, S.F[i].y); M.zone(g, 'f' + i, { x: fx, y: fy, w: 16, h: 16 }); });
    M.inert(g, ['f0', 'f1', 'f2', 'mir']);
    // the far side of the mirror, as rectangles (a drop anywhere in it counts)
    const far = []; if (mir === 'y') far.push([OX - N * C - 20, OY - N * C - 20, OX - 4, OY + N * C + 20]); else if (mir === 'x') far.push([OX - N * C - 20, OY + 4, OX + N * C + 20, OY + N * C + 20]);
    else for (let x = OX - N * C - 20; x < OX + N * C + 20; x += 14) { const yb = OY - (x + 14 - OX) - 8; if (yb > OY - N * C - 20) far.push([x, OY - N * C - 20, x + 14, Math.min(yb, OY + N * C + 20)]); }
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const reflectMove = i => {
      const p = V[i], q = S.I[i], d = mir === 'yx' ? (p.x - p.y) / 2 : mir === 'y' ? Math.abs(p.x) : Math.abs(p.y), stepT = Math.min(0.22, 0.95 / (2 * d)) * T;
      const askAt = 0.6 * T + 2 * d * stepT + 0.1 * T, last = S.done.filter(Boolean).length === 2, rest = (last ? 1.5 : 0.85) * T;
      const ch = mir === 'x' ? 'y' : 'x', newV = q[ch], oldV = p[ch];
      return { busy: 0.1, askAt, after: rest, ask: { v: newV, wrong: mir === 'yx' ? [p.x, -p.y, -p.x, p.y + 1] : [oldV, mir === 'y' ? p.y : p.x, -(mir === 'y' ? p.y : p.x), newV - 1].filter(v => v !== newV) },
        then(g) { S.done[i] = true; M.show(g, askAt); hop(g, 'think'); g.sfx('swoosh'); delete S.mk.box['v' + i]; delete S.mk.zones['v' + i];
          M.circle(g, ['c' + i, { x: toS(p.x, p.y)[0], y: toS(p.x, p.y)[1], w: 26, h: 26 }], { dur: 0.45 * T, col: GOLD }); M.light(g, 'c' + i, { col: GOLD });
          S.path = { i, t0: g.t + 0.3 * T, dur: 0.3 * T }; S.hops[i] = { t0: g.t + 0.6 * T, stepT, n: 2 * d, d };
          const st = []; for (let j = 1; j <= 2 * d; j++) st.push([0.6 * T + j * stepT - 0.02, g => { g.sfx(j === d ? 'ding' : 'tap', { vol: 0.6 }); if (j === d) M.sparkle(g, toS(S.F[i].x, S.F[i].y), { n: 8, cols: [CYAN, '#fff'] }); }]);
          st.push([askAt - 0.08 * T, g => { S.land[i] = g.t; const [x, y] = toS(q.x, q.y); g.burst(x, y, [CYAN, '#fff', LILY], 12, 110); hop(g, 'wow'); M.zone(g, 'i' + i, { x, y, w: 28, h: 28 });
            const nq = coord(p, null, { _born: -1 }); nq.row.id = 'n' + i; S.cx[i] = nq; const [lx, ly] = labAt(q, icen); M.place(g, 'n' + i, nq.row, lx, ly + 8, 22, { col: '#ffffff' }); M.writeIn(g, nq.row, { dur: 0.2 * T }); }]);
          M.at(g, st); },
        resolve(g) { M.show(g, rest); const nq = S.cx[i], [lx, ly] = labAt(q, icen); M.unlight(g, 'c' + i);
          if (mir === 'yx') { // the two numbers trade places
            const it = nq.row.items; [it[1], it[3]] = [it[3], it[1]]; M.place(g, 'n' + i, nq.row, lx, ly + 8, 22, { col: '#ffffff' }); for (const z of [it[1], it[3]]) { z.col = CYAN; M.indicate(g, z, { dur: 0.4 * T, col: CYAN }); } }
          else { const z = ch === 'x' ? nq.xs : nq.ys; z.col = CYAN; M.roll(g, z, newV, { dur: 0.35 * T }); M.indicate(g, z, { delay: 0.3 * T, dur: 0.35 * T, col: CYAN }); }
          g.sfx('pop');
          M.at(g, [[0.4 * T, g => { M.relayout(g, 'n' + i); M.sparkle(g, 'n' + i, { n: 8, cols: [CYAN, '#fff'] }); hop(g); }]]);
          if (last) M.at(g, [[0.6 * T, g => { S.fillAt = g.t; g.sfx('sparkle'); hop(g, 'laugh'); }], [1.1 * T, g => { for (let k = 0; k < 3; k++) M.sparkle(g, toS(S.I[k].x, S.I[k].y), { n: 10, cols: [CYAN, '#fff', LILY] }); g.sfx('coin'); }]]); } };
    };
    M.play(g, {
      moves(g) { const out = []; V.forEach((p, i) => { if (S.done[i]) return; const mv = reflectMove(i); out.push({ ...mv, drag: 'v' + i, to: 'f' + i, reach: 70 }); for (const a of far) out.push({ ...mv, drag: 'v' + i, to: 'f' + i, area: a, reach: 0 }); }); return out; },
      area(g) { return V.map((p, i) => 'v' + i).filter((id, i) => !S.done[i]); },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); },
  // while a corner is being dragged, labels and other corners don't catch the drop (a drop on the far side always counts,
  // even where another corner sits on the path; a drop on the near side just slides back)
  up(g, x, y) { const K = g.s.mk, P0 = K.press; let tmp = []; if (P0 && P0.dragging && /^v/.test(P0.id)) { tmp = ['c0', 'c1', 'c2', 'n0', 'n1', 'n2', 'v0', 'v1', 'v2', 'i0', 'i1', 'i2'].filter(k => k !== P0.id).filter(k => !(K.inert && K.inert.has(k))); M.inert(g, tmp); }
    M.up(g, x, y); for (const k of tmp) K.inert.delete(k); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), mk = S.mk, { mir, V } = S;
    c.drawImage(g.bake('reflect_bg', paintBg), 0, 0, 360, 640);
    // ripples drifting on the water
    for (let i = 0; i < 6; i++) { const k = ((t * 0.25 + i / 6) % 1), x = (i * 97) % 300 + 30, y = (i * 151) % 380 + 180; c.strokeStyle = `rgba(220,250,255,${0.18 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 6 + k * 30, 3 + k * 12, 0, 0, 7); c.stroke(); }
    // the mirror line: a ribbon of light with a shimmer running along it
    const [m0x, m0y] = mir === 'y' ? toS(0, -N) : mir === 'x' ? toS(-N, 0) : toS(-N, -N), [m1x, m1y] = mir === 'y' ? toS(0, N) : mir === 'x' ? toS(N, 0) : toS(N, N);
    c.save(); c.strokeStyle = 'rgba(200,250,255,0.35)'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(m0x, m0y); c.lineTo(m1x, m1y); c.stroke();
    c.strokeStyle = '#e8feff'; c.shadowColor = CYAN; c.shadowBlur = 14; c.lineWidth = 3.5; c.stroke(); c.shadowBlur = 0;
    const sk = (t * 0.4) % 1; c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(M.lerp(m0x, m1x, sk), M.lerp(m0y, m1y, sk), 4, 0, 7); c.fill(); c.restore();
    if (mir === 'yx') { c.save(); c.font = 'italic 700 20px Georgia, serif'; c.fillStyle = '#e8feff'; c.shadowColor = 'rgba(0,30,40,0.9)'; c.shadowBlur = 5; const [lx, ly] = toS(N - 0.3, N - 1.1); c.fillText('y = x', lx - 26, ly); c.restore(); }
    // where each corner is now: still home, hopping across, or landed
    const posOf = i => { const p = V[i], q = S.I[i], H = S.hops[i]; if (!H || t < H.t0) return [...toS(p.x, p.y), 0]; const u = (t - H.t0) / H.stepT; if (u >= H.n) return [...toS(q.x, q.y), 0];
      const j = Math.floor(u), f = M.easeIO(u - j), a = j / H.n, b = (j + 1) / H.n, k = M.lerp(a, b, f); return [...toS(M.lerp(p.x, q.x, k), M.lerp(p.y, q.y, k)), Math.sin(f * Math.PI)]; };
    // the dotted path straight across the mirror
    if (S.path) { const i = S.path.i, k = M.clamp((t - S.path.t0) / S.path.dur, 0, 1), fade = S.land[i] != null ? 1 - M.clamp((t - S.land[i] - 0.6 * T) / (0.3 * T), 0, 1) : 1; const [ax, ay] = toS(V[i].x, V[i].y), [bx, by] = toS(S.I[i].x, S.I[i].y);
      if (fade > 0 && k > 0) { c.save(); c.globalAlpha = fade; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2.5; c.setLineDash([3, 6]); c.beginPath(); c.moveTo(ax, ay); c.lineTo(M.lerp(ax, bx, M.easeIO(k)), M.lerp(ay, by, M.easeIO(k))); c.stroke(); c.restore(); } }
    // the triangles: the original in pink, the image in cyan once all three corners have landed
    const tri = (pts, fill, stroke, a) => { c.save(); c.globalAlpha = a; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = 3.5; c.lineJoin = 'round'; c.stroke(); c.restore(); };
    tri(V.map(p => toS(p.x, p.y)), 'rgba(255,138,184,0.35)', LILY, 1);
    if (S.fillAt != null) { const k = M.clamp((t - S.fillAt) / (0.5 * T), 0, 1), P = S.I.map(p => toS(p.x, p.y)); c.save(); c.strokeStyle = CYAN; c.shadowColor = CYAN; c.shadowBlur = 10; c.lineWidth = 3.5; c.lineCap = 'round';
      for (let e = 0; e < 3; e++) { const ke = M.clamp(k * 3 - e, 0, 1); if (ke <= 0) continue; const a = P[e], b = P[(e + 1) % 3]; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(M.lerp(a[0], b[0], ke), M.lerp(a[1], b[1], ke)); c.stroke(); } c.restore();
      if (k >= 1) tri(P, 'rgba(122,232,255,0.3)', CYAN, M.clamp((t - S.fillAt - 0.5 * T) / (0.3 * T), 0, 1)); }
    // the step counts: 1, 2, 3 up to the mirror (gold), then 1, 2, 3 beyond it (cyan)
    S.hops.forEach((H, i) => { if (!H) return; const end = S.land[i] != null ? S.land[i] + 0.9 * T : 1e9, al = 1 - M.clamp((t - end) / (0.3 * T), 0, 1); if (al <= 0) return; const p = V[i], q = S.I[i];
      let nx = mir === 'y' ? 0 : mir === 'x' ? 1 : -0.7071, ny = mir === 'y' ? -1 : mir === 'x' ? 0 : -0.7071; { const [vx, vy] = toS(p.x, p.y), L0 = S.lab[i]; if (nx * (L0[0] - vx) + ny * (L0[1] - vy) > 0) { nx = -nx; ny = -ny; } } // the counts go on the side away from the label
      for (let j = 1; j <= H.n; j++) { const tj = H.t0 + j * H.stepT; if (t < tj) break; const k = j / H.n, [x, y] = toS(M.lerp(p.x, q.x, k), M.lerp(p.y, q.y, k)), pop = M.clamp((t - tj) / 0.15, 0, 1), sz = 23 * (1 + Math.sin(pop * Math.PI) * 0.4);
        c.save(); c.globalAlpha = al; c.font = M.NUMF(sz, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 5; c.strokeStyle = 'rgba(0,26,36,0.95)'; c.lineJoin = 'round'; c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 5; const s2 = String(j <= H.d ? j : j - H.d), lx = x + nx * 21, ly = y + ny * 21;
        c.strokeText(s2, lx, ly); c.fillStyle = j <= H.d ? GOLD : CYAN; c.fillText(s2, lx, ly); c.restore(); } });
    // the lilies at the corners (a corner being dragged follows the finger)
    const lily = (x, y, col, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,30,40,0.3)'; c.beginPath(); c.arc(2, 3, 11, 0, 7); c.fill(); for (let k = 0; k < 6; k++) { c.save(); c.rotate(k * Math.PI / 3 + 0.3); c.fillStyle = col; c.beginPath(); c.ellipse(0, -6, 4.5, 8, 0, 0, 7); c.fill(); c.restore(); } c.fillStyle = '#ffe46a'; c.beginPath(); c.arc(0, 0, 4, 0, 7); c.fill(); c.restore(); };
    const P0 = mk.press;
    V.forEach((p, i) => { const [x, y, hp] = posOf(i); if (S.done[i]) { const [hx, hy] = toS(p.x, p.y); lily(hx, hy, LILY, 1.0); }
      if (P0 && P0.dragging && P0.id === 'v' + i) { lily(P0.x, P0.y - 18, LILY, 1.45); return; }
      lily(x, y - hp * 9, S.done[i] ? (S.land[i] != null ? CYAN : '#ffd0e4') : LILY, 1.2 + hp * 0.25); });
    // coordinate labels on dark pills
    const pill = key => { const e = mk.ex[key]; if (!e) return; const it = e.node.items, b = M.unionBox(it.map(n => M.box(g, n.id || n._pid)).filter(Boolean)); if (b) { c.save(); c.fillStyle = 'rgba(8,36,46,0.8)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 6, b.y - b.h / 2 - 3, b.w + 12, b.h + 6, 9); c.fill(); c.restore(); } M.drawEx(g, c, key); };
    for (let i = 0; i < 3; i++) { pill('c' + i); pill('n' + i); }
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const expr = won ? 'laugh' : lost || t - mk.missAt < 0.5 ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', 292, 616 - hopK * 22, 1.15, { t, facing: -1, pose: won ? 'cheer' : hopK > 0 ? 'hop' : 'idle', expr }); else SCN.host(g, c, 'frog', 292, 616, 1.15);
    M.drawUI(g, c);
  },
});
