// linalg_cross.js — CROSS PRODUCT! a × b for two 3D column vectors, by the cover-up method, on glass in deep space.
// Each component of a × b ignores its own row and cross-multiplies the other two rows. The player drags an entry of
// a onto an entry of b in a different row (or b onto a): that picks the component whose row is left over. The working
// then plays by itself: frosted glass covers that row, one diagonal draws itself and its two entries fly over into the
// answer row ("3·1"), then the other diagonal ("− 0·3"). Tapping a written row computes it: each product collapses into
// its value ("3 − 0"), then the difference becomes one number and the cover lifts. Components may come in any order.
// Wrong moves (they only wobble): dragging an entry onto the entry in its own row (that is the dot product),
// dragging within one vector, tapping × or =.
// Level 0: small vectors with zeros. Level 1: entries 1..6. Level 2: some negative entries.
// Medium mode: once both products are worked out, a tray asks for the difference (wrong tiles: a sum instead of a
// difference, the sign flipped).
const M = MK, INK = SCN.ink('glass'), COLS = ['#e0457a', '#2a8ad0', '#2fa060'];
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    let a, b;
    if (L === 0) { a = [r(1, 3), r(1, 3), r(1, 3)]; b = [r(1, 3), r(1, 3), r(1, 3)]; const za = r(0, 2); a[za] = 0; b[(za + r(1, 2)) % 3] = 0; }
    else if (L === 1) { a = [r(1, 6), r(1, 6), r(1, 6)]; b = [r(1, 6), r(1, 6), r(1, 6)]; }
    else { a = [r(-3, 5), r(-3, 5), r(1, 4)]; b = [r(1, 5), r(-4, 4), r(-3, 5)]; }
    const c = cross(a, b); if (c.every(v => v === 0)) continue; if (L > 0 && c.some(v => v === 0) && g.rand() < 0.7) continue;
    return { a, b, c };
  }
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
// component i is a[j]·b[k] − a[k]·b[j] with (i, j, k) in cyclic order
const jk = i => [(i + 1) % 3, (i + 2) % 3];
const fac = (v, o) => v < 0 ? M.paren(M.num(v, null, o)) : M.num(v, null, o);
let RX0 = 212, RX1 = 340, RC = 276; // the answer column (set in init, just right of the = sign)

MG.add({
  id: 'linalg_cross', stage: 'linalg', cmd: 'CROSS PRODUCT!', hint: 'drag', time: 8, mood: 'night', winText: 'Crossed!', hold: 1.4,
  card: {
    title: 'The cross product', ref: 'College', kind: 'Linear algebra',
    text: 'The cross product a × b takes two arrows in 3D and makes a third arrow. The new arrow points straight out of the flat surface that a and b lie on, so it is perpendicular to both of them.\n\nEach part of the answer leaves out its own row. For the first part, cover the first row and multiply across the other two rows: a₂b₃ − a₃b₂. The second part is a₃b₁ − a₁b₃, and the third part is a₁b₂ − a₂b₁.\n\nFor example, (1, 2, 3) × (4, 5, 6) = (2·6 − 3·5, 3·4 − 1·6, 1·5 − 2·4) = (−3, 6, −3).\n\nYou can check the answer: its dot product with a is −3 + 12 − 9 = 0, so it really is perpendicular to a. Its length equals the area of the parallelogram that a and b make.',
    note: 'To find part i of a × b, cover row i and cross-multiply the other two rows. The three parts are a₂b₃ − a₃b₂, then a₃b₁ − a₁b₃, then a₁b₂ − a₂b₁. Watch the order in the middle part.',
    ask: 'What is (1, 0, 0) × (0, 1, 0)? What is (2, 1, 0) × (0, 3, 1)?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = S.T = M.pace(g);
    const col = (v, p) => M.mat(v.map((x, i) => [M.num(x, p + i)]), p);
    S.prob = M.row(col(S.a, 'a'), M.op('×', 'times'), col(S.b, 'b'), M.op('=', 'eq'));
    M.place(g, 'prob', S.prob, 28, 312, 38, { col: INK, left: true });
    const eq = M.box(g, 'eq'); RX0 = eq.x + eq.w / 2 + 12; RC = (RX0 + RX1) / 2;
    M.inert(g, ['a', 'b']);
    S.comp = [0, 1, 2].map(i => ({ i, started: false, done: false }));
    const placeRes = i => { const q = S.comp[i], b = M.box(g, 'a' + i); const sz = q.done ? 32 : q.sz || Math.min(21, 21 * (RX1 - RX0 - 10) / M.lay(q.node, 21).w); if (q.f && !q.sz) q.sz = sz; M.place(g, 'r' + i, q.node, RC, b.y + sz * 0.32, sz, { col: INK }); };
    S.comp.forEach((q, i) => { q.node = M.slot('w' + i, { w: 70, col: COLS[i] }); placeRes(i); });
    g.dur *= (2.6 + 1.05 * 6) / 8;
    const hop = e => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // the drag: frosted glass slides over the row this component leaves out, then the two diagonals light up one after
    // the other and their entries fly over into the answer row: a·b first, then − c·d
    const start = i => ({ busy: 0.1, reach: 40, then(g) {
      const q = S.comp[i], [j, k] = jk(i), o = { col: COLS[i], _born: -1 }; q.started = g.t || 1e-6; q.coverAt = g.t; for (const id of ['a' + i, 'b' + i]) M.tween(g, id, { alpha: 0.35 }, 0.25 * T); S.focus = i; S.point = true; hop('think');
      M.show(g, 1.3 * T); g.sfx('sweep');
      q.f = [fac(S.a[j], o), fac(S.b[k], o), fac(S.a[k], o), fac(S.b[j], o)]; q.f.forEach((n, m) => { n.id = 'f' + i + m; n.alpha = 0; n._born = -1; });
      q.dots = [M.op('·', null, { ...o, alpha: 0 }), M.op('-', null, { _born: -1, alpha: 0 }), M.op('·', null, { ...o, alpha: 0 })]; q.u = [null, null];
      rebuild(i); M.inert(g, q.f.map(n => n.id));
      const pair = (m, src, dst) => M.fly(g, { node: fac(src, { col: COLS[i] }), from: (m < 2 ? ['a' + j, 'b' + k] : ['a' + k, 'b' + j])[m % 2], to: q.f[m].id, dur: 0.36 * T, arc: -30, s1: M.box(g, q.f[m].id).s,
        then(g) { q.f[m].alpha = 1; q.f[m].pop = g.t; if (m % 2) { q.dots[m - 1].alpha = 1; M.sparkle(g, 'p' + i, { n: 6, cols: [COLS[i], '#fff'] }); g.sfx('pop', { p: 1 + m * 0.1 }); hop(); } } });
      M.at(g, [
        [0.22 * T, g => { q.d1 = g.t; for (const id of ['a' + j, 'b' + k]) M.indicate(g, id, { col: COLS[i], sc: 1.25, dur: 0.4 * T }); g.sfx('tap'); }],
        [0.45 * T, g => { pair(0, S.a[j]); pair(1, S.b[k]); }],
        [0.66 * T, g => { q.d2 = g.t; for (const id of ['a' + k, 'b' + j]) M.indicate(g, id, { col: COLS[i], sc: 1.25, dur: 0.4 * T }); g.sfx('tap', { p: 1.2 }); }],
        [0.88 * T, g => { q.dots[1].alpha = 1; q.dots[1].pop = g.t; pair(2, S.a[k]); pair(3, S.b[j]); }],
        [1.3 * T, g => { S.point = false; }],
      ]);
    } });
    // the answer row for component i: each product is either still a·b or already collapsed into its value
    const rebuild = i => { const q = S.comp[i], f = q.f, d = q.dots; q.node = M.row(q.u[0] || [f[0], d[0], f[1]], d[1], q.u[1] || [f[2], d[2], f[3]]); q.node.id = 'p' + i; placeRes(i); };
    // a product collapses in place: a·b merges into its value (the kit flies the factors into it). Only the second
    // product needs brackets when it is negative: 6 − (−4)
    const collapse = (i, m) => { const q = S.comp[i], [j, k] = jk(i), v = m ? S.a[k] * S.b[j] : S.a[j] * S.b[k];
      q.u[m] = (m ? fac : M.num)(v, m ? { col: COLS[i], pop: g.t } : null, { col: COLS[i], pop: g.t }); rebuild(i); M.sparkle(g, 'p' + i, { n: 6, cols: [COLS[i], '#fff'] }); g.sfx('pop', { p: 1.1 + m * 0.1 }); hop(); };
    M.play(g, {
      moves(g) {
        const out = [];
        for (const q of S.comp) {
          const i = q.i, [j, k] = jk(i);
          if (!q.started) for (const [x, y] of [[j, k], [k, j]]) out.push({ drag: 'a' + x, to: 'b' + y, ...start(i) }, { drag: 'b' + y, to: 'a' + x, ...start(i) });
          else if (!q.tapped) out.push({ tap: 'p' + i, busy: 0.1, askAt: 0.95 * T, after: 0.65 * T,
            ask: { v: S.c[i], wrong: [S.a[j] * S.b[k] + S.a[k] * S.b[j], -S.c[i], S.a[j] * S.b[j] - S.a[k] * S.b[k], S.c[i] + 1] },
            // the tap: the row is circled, then each product lights up and collapses into its value ("2·3" -> "6")
            then(g) { q.tapped = true; S.focus = i; q.focusAt = g.t; S.point = true; hop('think'); M.show(g, 0.95 * T);
              M.circle(g, 'p' + i, { col: COLS[i], dur: 0.5 * T });
              for (const n of q.f.slice(0, 2)) M.indicate(g, n, { col: COLS[i], sc: 1.3, dur: 0.32 * T, delay: 0.05 * T });
              for (const n of q.f.slice(2)) M.indicate(g, n, { col: COLS[i], sc: 1.3, dur: 0.32 * T, delay: 0.45 * T });
              M.at(g, [[0.3 * T, g => collapse(i, 0)], [0.72 * T, g => collapse(i, 1)]]); },
            // the difference: both values pulse, then the row becomes one number and the frosted cover lifts away
            resolve(g) { M.show(g, 0.65 * T); for (const n of q.u) M.indicate(g, n, { col: COLS[i], sc: 1.2, dur: 0.3 * T });
              M.at(g, [[0.26 * T, g => { q.done = true; q.doneAt = g.t; for (const id of ['a' + i, 'b' + i]) M.tween(g, id, { alpha: 1 }, 0.3 * T); q.node = M.num(S.c[i], 'v' + i, { pop: g.t, col: COLS[i] }); M.inert(g, ['v' + i]); placeRes(i); g.sfx('coin'); hop('laugh');
                const b = M.box(g, 'v' + i); if (b) g.burst(b.x, b.y, [COLS[i], '#fff', '#ffe08a'], 12, 120); }],
                [0.65 * T, g => { S.point = false; }]]); } });
        }
        // the first move shown is the first component's down diagonal
        return out;
      },
      area(g) { const q = S.comp.find(q => !q.done); if (!q) return null; const [j, k] = jk(q.i); return q.started ? ['p' + q.i] : ['a' + j, 'b' + k]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'space', panel: 'glass', panelY: 300, panelH: 196 });
    // the answer column's brackets
    const top = M.box(g, 'a0'), bot = M.box(g, 'a2');
    if (top && bot) { c.save(); c.strokeStyle = INK; c.lineWidth = 2.6; c.lineCap = 'round'; const y0 = top.y - 27, y1 = bot.y + 27;
      for (const [x, d] of [[RX0 - 4, -1], [RX1 + 4, 1]]) { c.beginPath(); c.moveTo(x - d * 5, y0); c.lineTo(x, y0); c.lineTo(x, y1); c.lineTo(x - d * 5, y1); c.stroke(); } c.restore(); }
    // cover-up: frosted glass slides over the row a component leaves out (before the first drag it only glimmers), and
    // the two diagonals of that component draw themselves across the other rows as their products are written
    const guide = S.comp.find(q => !q.started), T = S.T || 1;
    for (const q of S.comp) {
      const [j, k] = jk(q.i), A = M.box(g, 'a' + q.i), B = M.box(g, 'b' + q.i); if (!A || !B) continue;
      const out = q.doneAt != null ? M.clamp(1 - (t - q.doneAt) / (0.35 * T), 0, 1) : 1;
      if (q.started) { const k0 = M.easeIO((t - q.coverAt) / (0.25 * T)) * out; if (k0 <= 0) continue;
        const w = (B.x - A.x + 48) * (0.6 + 0.4 * k0);
        c.save(); c.globalAlpha = k0; c.fillStyle = 'rgba(40,24,70,0.42)'; c.beginPath(); c.roundRect((A.x + B.x) / 2 - w / 2, A.y - 20, w, 40, 12); c.fill(); c.restore();
        // the X: a·b down one diagonal, c·d down the other, each line drawing itself
        c.save(); c.strokeStyle = COLS[q.i]; c.shadowColor = COLS[q.i]; c.shadowBlur = 8; c.lineWidth = 3.5; c.lineCap = 'round'; c.globalAlpha = 0.75 * out;
        [[j, k, q.d1], [k, j, q.d2]].forEach(([x, y, t0]) => { if (t0 == null) return; const P = M.box(g, 'a' + x), Q = M.box(g, 'b' + y), e = M.easeIO((t - t0) / (0.25 * T));
          const ax = P.x + 12, ay = P.y + (y > x ? 6 : -6), bx = Q.x - 12, by = Q.y + (y > x ? -6 : 6); c.beginPath(); c.moveTo(ax, ay); c.lineTo(M.lerp(ax, bx, e), M.lerp(ay, by, e)); c.stroke(); });
        c.restore();
      } else if (q === guide && !g.done && !M.showing(g)) { c.save(); c.globalAlpha = 0.25 + 0.12 * Math.sin(t * 4); c.fillStyle = 'rgba(40,24,70,0.55)'; c.beginPath(); c.roundRect(A.x - 24, A.y - 20, B.x - A.x + 48, 40, 12); c.fill(); c.restore(); }
    }
    // the owl points at the glass while the work is shown and hops as each piece lands
    { const K = S.mk, hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
      const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
      if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 292, 598 - hopK * 22, 1.2, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', 292, 598, 1.2); }
    M.drawEx(g, c, 'prob'); for (let i = 0; i < 3; i++) M.drawEx(g, c, 'r' + i);
    M.drawUI(g, c);
  },
});
