// geometry_pyth.js — PYTHAGOREAN! In a right triangle, the squares on the two legs together fill the square on the long side.
// A sunny stone courtyard seen from above: a grass right triangle with legs 3 and 4, and three square pools marked out
// with faint grid lines, one on each side. The turtle who keeps the garden watches.
//   1-2. Tap each leg, in either order. The leg glows, unit tiles of water pop in one by one along it and then sweep out
//        row by row until the square is full; the leg's number glides into the square and gains its ² (3²); a note
//        "3 × 3 = 9" writes itself beside the pool, and 9 flies into the square in place of 3².
//   3.   Drag either small pool onto the big pool. Every tile lifts out and pours across, one after another, filling the
//        big square row by row from the long side (the blue tiles from one pool, the green from the other), and they fit
//        exactly. Meanwhile the label "c" glides into the big pool, and 9 and 16 follow as their pools empty:
//        c² = 9 + 16, which then merges into c² = 25.
//   4.   Tap c² = 25. The long side glows and the tiles along it light up one by one with a count (1, 2, 3, 4, 5): the side
//        of a 25-tile square is 5 tiles long. "5 × 5 = 25" writes itself and the label becomes c = 5.
// Level 0: 3, 4, 5. Level 1: 6, 8, 10. Level 2: 5, 12, 13 or 9, 12, 15. Medium mode: the tray asks for each square, the
// sum, and the side. The classic slip, tapping c first (as if c = 3 + 4), wobbles with a crossed-out "3 + 4".
const M = MK, INK = '#1e3446', TILE = { a: '#78c8ee', b: '#86dcae' }, CY = 352, HX = 300, HY = 606, NOTE = '#b4441e';
function pick(g) {
  if (g.level === 0) return [3, 4];
  if (g.level === 1) return [6, 8];
  return g.rand() < 0.5 ? [5, 12] : [9, 12];
}
const mkPool = (P0, e1, e2, n) => ({ P0, e1, e2, n, pt: (i, j) => [P0[0] + (e1[0] * i + e2[0] * j) / n, P0[1] + (e1[1] * i + e2[1] * j) / n] });
const tileQ = (P, i, j) => [P.pt(i, j), P.pt(i + 1, j), P.pt(i + 1, j + 1), P.pt(i, j + 1)];
function quad(c, q, f) { const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2; c.beginPath(); q.forEach((p, n) => { const x = cx + (p[0] - cx) * f, y = cy + (p[1] - cy) * f; n ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath(); }

MG.add({
  id: 'geometry_pyth', stage: 'geometry', cmd: 'PYTHAGOREAN!', hint: 'tap', time: 10, mood: 'bright', winText: 'Right on!', hold: 1.8,
  card: {
    title: 'The Pythagorean theorem', ref: 'Grade 8', kind: 'Geometry',
    text: 'A right triangle has one square corner. The two sides that make that corner are the legs, and the long side across from it is the hypotenuse, called c.\n\nDraw a square on each side. The two squares on the legs, put together, have exactly the same area as the square on the long side: a² + b² = c².\n\nFor legs 3 and 4: 3² = 9 and 4² = 16, and 9 + 16 = 25. So c² = 25. Which number times itself is 25? 5 × 5 = 25, so the long side is 5. Adding the legs (3 + 4 = 7) is the classic slip: the long side is always shorter than the two legs together.',
    note: 'In a right triangle, a² + b² = c². Square the legs, add, then find the number whose square is the sum.',
    ask: 'The legs are 6 and 8. How long is the hypotenuse? The legs are 5 and 12?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const [a, b] = pick(g), c = Math.round(Math.hypot(a, b)); Object.assign(S, { a, b, c });
    const u = Math.min(30, 330 / (a + 2 * b), 336 / (2 * a + b)), ox = 180 - a * u / 2, oy = CY + b * u / 2; Object.assign(S, { u, ox, oy });
    S.pool = { a: mkPool([ox, oy], [a * u, 0], [0, a * u], a), b: mkPool([ox, oy], [0, -b * u], [-b * u, 0], b), c: mkPool([ox + a * u, oy], [-a * u, -b * u], [b * u, -a * u], c) };
    for (const k of ['a', 'b', 'c']) { const P = S.pool[k]; P.k = k; P.tiles = []; P.side = P.n * u; P.cen = P.pt(P.n / 2, P.n / 2); }
    S.pool.c.fill = [];
    const put = (key, node, x, y, s) => M.place(g, key, node, x, y + s * 0.34, s, { col: INK }); S.put = put;
    // the side labels: just outside each side, inside the pool marked out on it
    S.na = M.num(a, 'la'); S.nb = M.num(b, 'lb'); S.cv = M.vr('c', 'lc');
    put('la', M.row(S.na), ox + a * u / 2, oy + 17, 23); put('lb', M.row(S.nb), ox - 12 - M.lay(S.nb, 23).w / 2, oy - b * u / 2, 23);
    S.lcAt = [ox + a * u / 2 + b / c * 19, oy - b * u / 2 - a / c * 19]; put('lc', M.row(S.cv), ...S.lcAt, 24);
    M.zone(g, 'ea', { x: ox + a * u / 2, y: oy + 6, w: a * u, h: 36 }); M.zone(g, 'eb', { x: ox - 6, y: oy - b * u / 2, w: 36, h: b * u });
    const C = S.pool.c; M.zone(g, 'pc', { x: C.cen[0], y: C.cen[1], w: C.side * 0.8, h: C.side * 0.8 });
    M.inert(g, ['qa', 'qb', 'q2']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const gone = (g, id) => { delete g.s.mk.box[id]; if (g.s.mk.zones) delete g.s.mk.zones[id]; };
    // the big pool's label row, fitted to the width of the tilted square
    const tilt = Math.atan2(a, b), chord = C.side / Math.max(Math.cos(tilt), Math.sin(tilt));
    const relayC = items => { const row = M.row(...items); row.id = 'cl'; const s = Math.min(30, 30 * chord * 0.7 / Math.max(1, M.lay(row, 30).w)); S.cs = s; put('lc', row, C.cen[0], C.cen[1] - (S.root ? 12 : 0), s); return row; };
    // a note beside a leg's pool: to the right of the bottom pool, above the left pool
    const notePlace = (k, row) => { const P = S.pool[k], w0 = M.lay(row, 26).w;
      if (k === 'a') { const s = Math.max(22, Math.min(26, 26 * (350 - ox - a * u - 12) / w0)), x0 = Math.min(ox + a * u + 12, 350 - w0 * s / 26); M.place(g, 'nt' + k, row, x0, oy + a * u / 2 + s * 0.34, s, { col: NOTE, left: true }); }
      else { const s = Math.max(22, Math.min(26, 26 * (ox - 4) / w0)), w = w0 * s / 26, x = Math.max(10 + w / 2, Math.min(ox - b * u / 2, ox + 4 - w / 2)); M.place(g, 'nt' + k, row, x, oy - b * u - 20 + s * 0.34, s, { col: NOTE }); } };
    const legMove = k => { const P = S.pool[k], n = P.n, num = k === 'a' ? S.na : S.nb;
      return { tap: ['l' + k, 'e' + k], busy: 0.1, askAt: 0.85 * T, after: 0.7 * T, ask: { v: n * n, wrong: [2 * n, n * (n + 1), n + 2] },
        then(g) { P.built = true; gone(g, 'e' + k); num.id = 'q' + k; S.point = true; M.show(g, 0.85 * T); hop(g, 'think'); g.sfx('tap');
          S.edge = { k, t0: g.t }; M.indicate(g, num, { dur: 0.35 * T, sc: 1.3 });
          // tiles pop in one by one along the leg, then sweep out row by row until the square is full
          const d1 = 0.3 * T / n; for (let i = 0; i < n; i++) P.tiles.push({ i, j: 0, t0: g.t + 0.05 * T + i * d1 });
          for (let j = 1; j < n; j++) for (let i = 0; i < n; i++) P.tiles.push({ i, j, t0: g.t + 0.4 * T + (j - 1) * 0.3 * T / Math.max(1, n - 1) + i * 0.008 * T });
          M.at(g, [[0.4 * T, g => { // the side length glides into the square and gains its ²
              const s = Math.max(18, Math.min(30, P.side * 0.34)); P.ls = s; P.lab = M.row(M.sup(num, M.num(2, 'q2'))); put('l' + k, P.lab, ...P.cen, s); g.sfx('swoosh'); }],
            [0.7 * T, g => { P.blank = M.num(n * n, 'nv' + k, { alpha: 0 }); P.note = M.row(M.num(n), M.op('×'), M.num(n), M.op('='), P.blank); notePlace(k, P.note); M.writeIn(g, P.note, { dur: 0.3 * T }); M.indicate(g, P.lab, { dur: 0.3 * T, sc: 1.15 }); }]]); },
        resolve(g) { M.show(g, 0.7 * T); P.blank.alpha = 1; M.writeIn(g, P.blank, { dur: 0.15 * T }); M.indicate(g, P.blank, { delay: 0.12 * T, dur: 0.3 * T, col: '#ffcf3a' }); g.sfx('ding');
          M.at(g, [[0.25 * T, g => { P.blank.alpha = 0;
              M.fly(g, { node: M.num(n * n, null, { col: NOTE }), from: 'nv' + k, to: 'q' + k, dur: 0.3 * T, arc: -26, s0: 26, s1: P.ls,
                then(g) { P.sq = M.num(n * n, 'q' + k); P.lab = M.row(P.sq); put('l' + k, P.lab, ...P.cen, P.ls); P.sq.pop = g.t; P.glow = g.t; M.sparkle(g, P.cen.concat([30]), { n: 10, cols: [TILE[k], '#fff'] }); g.sfx('pop'); hop(g, 'wow');
                  M.zone(g, 'p' + k, { x: P.cen[0], y: P.cen[1], w: P.side, h: P.side }); } });
              M.tween(g, P.note, { alpha: 0 }, 0.25 * T, { delay: 0.15 * T }); }],
            [0.68 * T, g => { if (S.point && !(S.pool.a.sq && S.pool.b.sq)) S.point = false; }]]); } };
    };
    M.play(g, {
      moves(g) {
        const A = S.pool.a, B = S.pool.b;
        if (!A.built || !B.built) return [A, B].filter(P => !P.built).map(P => legMove(P.k));
        if (!S.poured) { const xs = [0, 1, 2, 3].map(i => C.pt(i % 2 ? C.n : 0, i > 1 ? C.n : 0));
          return [{ drag: ['pa', 'pb'], to: ['pc', 'cl', 'lc'], area: [Math.min(...xs.map(p => p[0])), Math.min(...xs.map(p => p[1])), Math.max(...xs.map(p => p[0])), Math.max(...xs.map(p => p[1]))], busy: 0.1,
            askAt: 1.05 * T, after: 0.6 * T, ask: { v: c * c, wrong: [a + b, (a + b) * (a + b), c * c + a] },
            then(g) { S.poured = true; gone(g, 'pa'); gone(g, 'pb'); M.show(g, 1.05 * T); S.point = true; hop(g, 'wow'); g.sfx('splash');
              // every tile lifts out and pours across, filling the big square row by row from the long side
              const N = c * c, st = 0.55 * T / N, fd = 0.32 * T; let q = 0; S.flyT = [];
              for (const k of ['a', 'b']) { const P = S.pool[k]; const list = P.tiles.slice().sort((x, y) => y.j - x.j || x.i - y.i);
                for (const tl of list) { const slot = { i: q % c, j: Math.floor(q / c) }, t0 = g.t + 0.1 * T + q * st; tl.gone = t0; S.flyT.push({ from: tileQ(P, tl.i, tl.j), to: tileQ(C, slot.i, slot.j), t0, dur: fd, col: TILE[k], slot }); q++; }
                P.doneAt = 0.1 * T + (q - 1) * st + fd; }
              C.pour = g.t; M.inert(g, ['lc', 'c2', 'ceq', 'cp', 'c25', 'cf']); S.items = [M.sup(S.cv, M.num(2, 'c2')), M.op('=', 'ceq')];
              M.at(g, [[0.12 * T, g => { relayC(S.items); g.sfx('swoosh'); }],
                [S.pool.a.doneAt, g => { S.items.push(S.pool.a.sq); delete g.s.mk.ex.la; relayC(S.items); S.pool.a.sq.pop = g.t; g.sfx('pop'); }],
                [S.pool.b.doneAt, g => { S.items.push(M.op('+', 'cp'), S.pool.b.sq); delete g.s.mk.ex.lb; relayC(S.items); S.pool.b.sq.pop = g.t; g.sfx('pop'); hop(g); }]]); },
            resolve(g) { M.show(g, 0.6 * T); S.c2 = M.num(c * c, 'c25'); S.items = [S.items[0], S.items[1], S.c2]; relayC(S.items); S.c2.pop = g.t; C.glow = g.t;
              M.sparkle(g, C.cen.concat([40]), { n: 14, cols: ['#78c8ee', '#86dcae', '#fff'] }); g.sfx('ding'); hop(g, 'laugh'); M.at(g, [[0.5 * T, g => { S.point = false; }]]); } }];
        }
        if (!S.root) { const st = Math.min(0.14 * T, 0.6 * T / c), ask = 0.2 * T + c * st + 0.1 * T;
          return [{ tap: ['cl', 'pc'], busy: 0.1, askAt: ask, after: 0.8 * T, ask: { v: c, wrong: [c * c / 2, a + b, c + 1, 2 * c] },
            then(g) { S.root = true; M.show(g, ask); S.point = true; hop(g, 'think'); M.circle(g, 'cl', { dur: 0.5 * T, col: '#ffcf3a' }); S.edge = { k: 'c', t0: g.t, long: true };
              S.count = { t0: g.t + 0.2 * T, st }; for (let i = 0; i < c; i++) M.at(g, [[0.2 * T + i * st, g => { g.sfx('tap'); }]]); },
            resolve(g) { M.show(g, 0.8 * T);
              S.note = M.row(M.num(c, 'r5'), M.op('×'), M.num(c), M.op('='), M.num(c * c)); const wn = M.lay(S.note, 26).w, sn = Math.max(22, Math.min(26, 26 * (338 - S.ox - S.a * u) / wn)), x0 = Math.min(S.ox + S.a * u + 12, 350 - wn * sn / 26); M.place(g, 'ntc', S.note, x0, S.oy + 30, sn, { col: NOTE, left: true }); M.writeIn(g, S.note, { dur: 0.3 * T }); g.sfx('ding');
              M.at(g, [[0.32 * T, g => { M.fly(g, { node: M.num(c, null, { col: NOTE }), from: 'r5', to: 'c25', dur: 0.2 * T, arc: -20, s0: M.box(g, 'r5') ? M.box(g, 'r5').s : 24, s1: S.cs }); }],
                [0.52 * T, g => { S.items = [S.cv, S.items[1], M.num(c, 'cf')]; relayC(S.items); M.indicate(g, 'cf', { dur: 0.35 * T, col: '#ffcf3a', sc: 1.4 }); M.sparkle(g, 'cf', { n: 14 }); g.sfx('coin'); hop(g, 'laugh'); S.count.fade = g.t; }],
                [0.6 * T, g => { M.tween(g, S.note, { alpha: 0 }, 0.2 * T); S.point = false; }]]); } }];
        }
        return [];
      },
      area(g) { const A = S.pool.a, B = S.pool.b; if (!A.built || !B.built) return [A, B].filter(P => !P.built).map(P => 'l' + P.k); return !S.poured ? ['pa', 'pb', 'pc'] : ['cl']; },
    });
  },
  update(g, dt) {
    M.update(g, dt); const S = g.s, Mk = S.mk, C = S.pool.c;
    if (S.flyT) S.flyT = S.flyT.filter(f => { if (g.t >= f.t0 + f.dur) { C.fill.push({ ...f.slot, col: f.col, t0: g.t }); return false; } return true; });
    // the classic slip, acted out: c tapped first, as if it were 3 + 4
    if (Mk.missAt > (S.lastMiss ?? -1)) { S.lastMiss = Mk.missAt; const id = Mk.missInfo && Mk.missInfo.tap;
      if ((id === 'lc' || id === 'pc') && !S.poured && M.box(g, 'lc')) { const nd = M.row(M.num(S.a), M.op('+'), M.num(S.b)); nd.strike = { t0: g.t + 0.3, dur: 0.2, col: '#ff6a5a' };
        M.note(g, { node: nd, at: 'lc', off: [26, -30], s: 22, col: '#c03a2a', write: 0.25, hold: 0.45, fade: 0.25 }); } }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, Mk = S.mk, T = M.pace(g), u = S.u;
    c.drawImage(g.bake('gpyth_court', (cc, W, H) => {
      cc.fillStyle = '#e6dcc6'; cc.fillRect(0, 0, W, H);
      const R = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(29);
      for (let y = -10, r = 0; y < H; y += 46, r++) for (let x = (r % 2) * -40; x < W; x += 80) { const sh = 0.94 + R() * 0.08; cc.fillStyle = `rgb(${Math.round(232 * sh)},${Math.round(222 * sh)},${Math.round(200 * sh)})`; cc.fillRect(x + 2, y + 2, 76, 42); cc.fillStyle = 'rgba(255,255,255,0.18)'; cc.fillRect(x + 2, y + 2, 76, 4); }
      for (let i = 0; i < 30; i++) { cc.fillStyle = 'rgba(120,100,70,0.08)'; cc.beginPath(); cc.arc(R() * W, R() * H, 2 + R() * 6, 0, 7); cc.fill(); }
      // hedges along the top and bottom, potted lemon trees in the corners
      for (const [y0, y1] of [[0, 54], [584, 640]]) { cc.fillStyle = '#3e7a46'; cc.fillRect(0, y0, W, y1 - y0); for (let x = -10; x < W + 20; x += 18) { cc.fillStyle = R() < 0.5 ? '#4a8a50' : '#2f6a3a'; cc.beginPath(); cc.arc(x, y0 === 0 ? y1 - 2 : y0 + 2, 14 + R() * 5, 0, 7); cc.fill(); } }
      for (const [x, y] of [[26, 92], [334, 92], [24, 556]]) { cc.fillStyle = 'rgba(60,40,20,0.2)'; cc.beginPath(); cc.arc(x + 4, y + 5, 20, 0, 7); cc.fill(); cc.fillStyle = '#c86a3a'; cc.beginPath(); cc.arc(x, y, 18, 0, 7); cc.fill(); cc.fillStyle = '#4a8a3a'; cc.beginPath(); cc.arc(x, y, 14, 0, 7); cc.fill(); cc.fillStyle = '#f2d24a'; for (let k = 0; k < 4; k++) { cc.beginPath(); cc.arc(x - 7 + R() * 14, y - 7 + R() * 14, 3, 0, 7); cc.fill(); } }
    }), 0, 0, 360, 640);
    // drifting cloud shadows
    for (let i = 0; i < 2; i++) { const x = ((t * 9 + i * 230) % 560) - 100, y = 200 + i * 220; c.fillStyle = 'rgba(60,70,90,0.06)'; c.beginPath(); c.ellipse(x, y, 110, 46, 0.2, 0, 7); c.fill(); }
    // the grass triangle with its square corner
    const { ox, oy, a, b } = S, A = [ox + a * u, oy], B = [ox, oy - b * u];
    c.save(); c.fillStyle = 'rgba(40,40,20,0.2)'; c.beginPath(); c.moveTo(ox + 3, oy + 4); c.lineTo(A[0] + 3, A[1] + 4); c.lineTo(B[0] + 3, B[1] + 4); c.fill();
    const gg = c.createLinearGradient(ox, B[1], ox, oy); gg.addColorStop(0, '#8ccb6a'); gg.addColorStop(1, '#6aae52'); c.fillStyle = gg; c.beginPath(); c.moveTo(ox, oy); c.lineTo(...A); c.lineTo(...B); c.closePath(); c.fill();
    c.strokeStyle = '#4a8a3c'; c.lineWidth = 2; c.stroke(); const rq = Math.min(14, a * u * 0.25); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.moveTo(ox + rq, oy); c.lineTo(ox + rq, oy - rq); c.lineTo(ox, oy - rq); c.stroke(); c.restore();
    // the pools: faint marked-out squares with their unit grid, then stone rims once in use
    for (const k of ['a', 'b', 'c']) { const P = S.pool[k], n = P.n, q = [P.pt(0, 0), P.pt(n, 0), P.pt(n, n), P.pt(0, n)], used = k === 'c' ? P.pour != null : P.built;
      c.save(); c.beginPath(); q.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath();
      c.fillStyle = used ? 'rgba(150,190,205,0.55)' : 'rgba(255,255,255,0.22)'; c.fill();
      c.strokeStyle = 'rgba(30,52,70,0.13)'; c.lineWidth = 1; c.beginPath(); for (let i = 1; i < n; i++) { c.moveTo(...P.pt(i, 0)); c.lineTo(...P.pt(i, n)); c.moveTo(...P.pt(0, i)); c.lineTo(...P.pt(n, i)); } c.stroke();
      c.beginPath(); q.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath();
      if (used) { c.strokeStyle = '#b8a888'; c.lineWidth = 4; c.stroke(); } else { c.setLineDash([6, 5]); c.strokeStyle = 'rgba(30,52,70,0.4)'; c.lineWidth = 2; c.stroke(); } c.restore(); }
    // the tiles: popping in, sitting in the leg pools, flying across, filling the big pool
    const shim = (i, j) => 0.08 + 0.08 * Math.sin(t * 2.2 + i * 0.9 + j * 1.3);
    for (const k of ['a', 'b']) { const P = S.pool[k], gl = P.glow != null ? Math.max(0, 1 - (t - P.glow) / 0.5) : 0;
      for (const tl of P.tiles) { if (t < tl.t0 || (tl.gone != null && t >= tl.gone)) continue; const e = M.clamp((t - tl.t0) / (0.14 * T), 0, 1), f = 0.88 * (e < 1 ? M.ease(e) * (1 + 0.25 * Math.sin(e * Math.PI)) : 1), q = tileQ(P, tl.i, tl.j);
        c.fillStyle = TILE[k]; quad(c, q, f); c.fill(); c.fillStyle = `rgba(255,255,255,${shim(tl.i, tl.j) + gl * 0.5})`; c.fill(); } }
    const C = S.pool.c, cg = C.glow != null ? Math.max(0, 1 - (t - C.glow) / 0.6) : 0;
    for (const tl of C.fill) { const e = M.clamp((t - tl.t0) / 0.15, 0, 1), q = tileQ(C, tl.i, tl.j); c.fillStyle = TILE[tl.col === TILE.a ? 'a' : 'b']; quad(c, q, 0.88 * (1 + 0.15 * Math.sin(e * Math.PI))); c.fill();
      let fl = cg * 0.5; if (S.count && tl.j === 0) { const k0 = t - (S.count.t0 + tl.i * S.count.st); if (k0 >= 0) fl = Math.max(fl, 0.55 * Math.max(0.35, 1 - k0 / 0.5) * (S.count.fade != null ? Math.max(0, 1 - (t - S.count.fade) / 0.4) : 1)); }
      c.fillStyle = fl > 0.3 && S.count && tl.j === 0 ? `rgba(255,236,150,${fl})` : `rgba(255,255,255,${shim(tl.i, tl.j) + fl})`; c.fill(); }
    if (S.flyT) for (const f of S.flyT) { if (t < f.t0) continue; const k = M.easeIO((t - f.t0) / f.dur), lift = Math.sin(k * Math.PI);
      const q = f.from.map((p, i) => [M.lerp(p[0], f.to[i][0], k), M.lerp(p[1], f.to[i][1], k) - lift * 34]);
      c.save(); c.fillStyle = 'rgba(30,50,70,0.18)'; quad(c, q.map(p => [p[0] + lift * 6, p[1] + lift * 12]), 0.88); c.fill(); c.fillStyle = f.col; c.shadowColor = '#fff'; c.shadowBlur = 6 * lift; quad(c, q, 0.88 * (1 + lift * 0.2)); c.fill(); c.restore();
      if (lift > 0.2 && lift < 0.95) { c.fillStyle = 'rgba(220,245,255,0.7)'; c.beginPath(); c.arc((q[0][0] + q[2][0]) / 2 - 6, (q[0][1] + q[2][1]) / 2 + 10, 1.8, 0, 7); c.fill(); } }
    // a small pool being dragged: a copy of its tiles follows the finger
    const pr = Mk.press; if (pr && pr.dragging && (pr.id === 'pa' || pr.id === 'pb')) { const P = S.pool[pr.id[1]], dx = pr.x - P.cen[0], dy = pr.y - 24 - P.cen[1];
      c.save(); c.globalAlpha = 0.6; c.translate(dx, dy); c.fillStyle = TILE[P.k]; for (const tl of P.tiles) { quad(c, tileQ(P, tl.i, tl.j), 0.88); c.fill(); } c.restore(); }
    // the side being worked on glows
    if (S.edge) { const k = (t - S.edge.t0) / ((S.edge.long ? 1.4 : 0.8) * T); if (k < 1) { const P = S.pool[S.edge.k]; c.save(); c.globalAlpha = Math.min(1, k * 5) * (1 - Math.max(0, (k - 0.75) / 0.25)); c.strokeStyle = '#ffd25a'; c.shadowColor = '#ffd25a'; c.shadowBlur = 14; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(...P.pt(0, 0)); c.lineTo(...P.pt(P.n, 0)); c.stroke(); c.restore(); } }
    // the count along the long side: 1, 2, 3, ... on the grass side of each tile
    if (S.count) { const fade = S.count.fade != null ? Math.max(0, 1 - (t - S.count.fade) / 0.4) : 1, nrm = [-S.b / S.c, S.a / S.c], all = S.c <= 10;
      for (let i = 0; i < S.c; i++) { const k0 = t - (S.count.t0 + i * S.count.st); if (k0 < 0 || (!all && k0 > S.count.st * 1.5 && i < S.c - 1)) continue; const p = C.pt(i + 0.5, 0), e = M.clamp(k0 / 0.15, 0, 1);
        c.save(); c.globalAlpha = fade * e; c.fillStyle = '#fff8d0'; c.strokeStyle = 'rgba(30,52,70,0.6)'; c.lineWidth = 3; c.font = M.NUMF(all ? 18 : 20, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
        const x = p[0] + nrm[0] * 13, y = p[1] + nrm[1] * 13 - (1 - e) * 6; c.strokeText(i + 1, x, y); c.fillText(i + 1, x, y); c.restore(); } }
    for (const k of ['la', 'lb', 'lc', 'nta', 'ntb', 'ntc']) M.drawEx(g, c, k);
    // the turtle keeps the garden: points at the work and hops when a step lands
    const hk = Mk.lastMove != null && t - Mk.lastMove < 0.35 ? Math.sin((t - Mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'turtle', HX, HY - hk * 18, 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'turtle', HX, HY, 1.35);
    M.drawUI(g, c);
  },
});
