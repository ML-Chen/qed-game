// matrices_mult.js — MATRIX MULT! Multiply two 2×2 matrices and fill in all four entries of the product.
// A bakery in the morning: the first matrix is a tray of cookies, the second a tray of pink macarons, and the answer is
// an empty tray of cupcake liners (each showing ?). A duck in a baker's mood watches from the counter. Each entry of
// the product is a row of the first matrix times a column of the second. Every move's working plays by itself (show
// your work; the fuse stands still meanwhile):
//   Drag an entry of a row of A onto an entry of a column of B (or tap an empty cupcake): the row lights up gold and
//   the column lights up pink, both are circled, and they swing together: the row's two cookies fly down and stand one
//   above the other beside the column's two macarons, so the pairs line up as "2 · 5" and "3 · 7". The products write
//   themselves ("= 10", "= 21"), then the sum "10 + 21 = 31" writes itself under them, and 31 flies into its cupcake,
//   where the ? rolls over to 31 and sprinkles burst.
// All four entries, in any order. Level 0: entries 1 to 3. Level 1: 1 to 5. Level 2: −3 to 4 with negatives.
// Wrong moves: dragging a row of B onto A (the wrong way round), tapping an entry of B, or tapping a filled cupcake.
// Medium mode: each entry's sum is picked from the tray; the wrong tiles are real mistakes (row times row, adding the
// four numbers, the product of the two products).
const M = MK;
const INK = '#4a2418', ROWC = '#ffb02a', COLC = '#ff6aa0', NOTE = '#8a3a1a', AY = 236, CY = 452, AS = 38, CS = 40, W1 = 302, W2 = 340, WS = 376, HX = 304, HY = 612;

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const v = () => L === 0 ? 1 + r(3) : L === 1 ? 1 + r(5) : [-3, -2, -1, 1, 2, 3, 4][r(7)];
  for (let tries = 0; tries < 200; tries++) {
    const A = [[v(), v()], [v(), v()]], B = [[v(), v()], [v(), v()]];
    if (L === 2 && (!A.flat().some(x => x < 0) || !B.flat().some(x => x < 0))) continue;
    if (A[0][0] === A[0][1] && A[1][0] === A[1][1]) continue;
    const C = [0, 1].map(i => [0, 1].map(j => A[i][0] * B[0][j] + A[i][1] * B[1][j]));
    if (C.flat().some(x => Math.abs(x) > 40)) continue;
    return { A, B, C };
  }
  return { A: [[1, 2], [3, 1]], B: [[2, 1], [1, 3]], C: [[4, 7], [7, 6]] };
}
const fac = (v, paren) => v < 0 && paren ? M.paren(M.num(v)) : M.num(v);

// the bakery: a peach wall with white tiles, shelves of bread, a sunny window, copper pans and a wooden counter
function bakery(c, W, H) {
  const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#ffd8b0'); wg.addColorStop(1, '#f6c090'); c.fillStyle = wg; c.fillRect(0, 0, W, H);
  // the window with morning light
  c.fillStyle = '#a8e0ff'; c.fillRect(20, 26, 96, 120); const sl = c.createLinearGradient(20, 26, 116, 146); sl.addColorStop(0, 'rgba(255,255,230,0.9)'); sl.addColorStop(1, 'rgba(255,255,230,0)'); c.fillStyle = sl; c.fillRect(20, 26, 96, 120);
  c.strokeStyle = '#fff8ee'; c.lineWidth = 6; c.strokeRect(20, 26, 96, 120); c.beginPath(); c.moveTo(68, 26); c.lineTo(68, 146); c.moveTo(20, 86); c.lineTo(116, 86); c.stroke();
  c.save(); c.globalAlpha = 0.18; c.fillStyle = '#fffbe0'; c.beginPath(); c.moveTo(20, 146); c.lineTo(116, 146); c.lineTo(220, 520); c.lineTo(60, 520); c.fill(); c.restore();
  // shelves with loaves and jars
  for (const y of [112, 172]) { c.fillStyle = '#9a6038'; c.fillRect(150, y, 200, 8); c.fillStyle = '#7a4424'; c.fillRect(150, y + 8, 200, 3); }
  for (let i = 0; i < 5; i++) P.loaf(c, 172 + i * 38, 104, 1.1);
  for (let i = 0; i < 4; i++) { const x = 172 + i * 46; c.fillStyle = ['#e85a5a', '#f0c040', '#a060c0', '#60b060'][i]; c.fillRect(x - 10, 148, 20, 24); c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(x - 12, 144, 24, 8); c.fillStyle = '#c89060'; c.fillRect(x - 11, 142, 22, 5); }
  // tiles below the dado
  c.fillStyle = '#fff6ec'; c.fillRect(0, 486, W, H - 486); c.strokeStyle = 'rgba(200,150,120,0.35)'; c.lineWidth = 1;
  for (let y = 486; y < H; y += 22) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); for (let x = ((y - 486) / 22) % 2 ? 11 : 0; x < W; x += 22) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 22); c.stroke(); } }
  // the counter
  const cg = c.createLinearGradient(0, 560, 0, H); cg.addColorStop(0, '#c88850'); cg.addColorStop(1, '#8a5428'); c.fillStyle = cg; c.fillRect(0, 568, W, H - 568);
  c.fillStyle = '#e0a868'; c.fillRect(0, 560, W, 10); c.fillStyle = 'rgba(60,30,10,0.25)'; c.fillRect(0, 570, W, 4);
  // a basket of bread on the counter
  P.basket(c, 52, 566, 1.4, 'bread');
}
// a cookie (A), a macaron (B) or a cupcake liner (C) behind an entry centred at x, y
function cookie(c, x, y, r, lit) {
  c.save(); c.fillStyle = 'rgba(80,40,20,0.25)'; c.beginPath(); c.ellipse(x + 1, y + 3, r, r * 0.92, 0, 0, 7); c.fill();
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.35, 2, x, y, r); g.addColorStop(0, lit ? '#ffe9a0' : '#f6d49a'); g.addColorStop(1, lit ? '#f0b040' : '#d8a060'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.strokeStyle = lit ? ROWC : '#b8783a'; c.lineWidth = lit ? 3 : 1.5; c.stroke();
  c.fillStyle = '#7a4424'; for (const [dx, dy] of [[-0.62, -0.5], [0.7, -0.38], [-0.66, 0.5], [0.58, 0.62]]) { c.beginPath(); c.arc(x + dx * r, y + dy * r, r * 0.07, 0, 7); c.fill(); }
  c.restore();
}
function macaron(c, x, y, r, lit) {
  c.save(); c.fillStyle = 'rgba(80,40,20,0.25)'; c.beginPath(); c.ellipse(x + 1, y + 3, r, r * 0.86, 0, 0, 7); c.fill();
  const g = c.createLinearGradient(0, y - r, 0, y + r); g.addColorStop(0, lit ? '#ffd0e4' : '#ffc4d8'); g.addColorStop(1, lit ? '#ff8ab8' : '#f0a0c0'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r, r * 0.86, 0, 0, 7); c.fill();
  c.fillStyle = '#fff4f0'; c.fillRect(x - r * 0.95, y + r * 0.08, r * 1.9, r * 0.16);
  c.strokeStyle = lit ? COLC : '#d07a9a'; c.lineWidth = lit ? 3 : 1.5; c.beginPath(); c.ellipse(x, y, r, r * 0.86, 0, 0, 7); c.stroke(); c.restore();
}
function cupcake(c, x, y, w, filled, k) {
  c.save(); const h = w * 0.9;
  c.fillStyle = 'rgba(80,40,20,0.22)'; c.beginPath(); c.ellipse(x + 1, y + h * 0.5, w * 0.5, 5, 0, 0, 7); c.fill();
  if (filled) { const s = 0.6 + 0.4 * M.ease(k); c.save(); c.translate(x, y - 2); c.scale(s, s);
    const g = c.createRadialGradient(-w * 0.15, -h * 0.3, 2, 0, 0, w * 0.6); g.addColorStop(0, '#fffaf4'); g.addColorStop(1, '#f6d8e8'); c.fillStyle = g; c.beginPath(); c.ellipse(0, -h * 0.08, w * 0.52, h * 0.42, 0, 0, 7); c.fill(); c.strokeStyle = '#e0a0c0'; c.lineWidth = 1.5; c.stroke();
    for (let i = 0; i < 7; i++) { const a = i * 2.4, rr = w * 0.36; c.fillStyle = ['#ff6a8a', '#6ac0ff', '#ffd23a', '#7ad87a'][i % 4]; c.save(); c.translate(Math.cos(a) * rr, Math.sin(a) * rr * 0.6 - h * 0.08); c.rotate(a); c.fillRect(-3, -1, 6, 2.4); c.restore(); }
    c.restore(); }
  const lg = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); lg.addColorStop(0, '#7ab8e8'); lg.addColorStop(0.5, '#a8d8ff'); lg.addColorStop(1, '#6aa8d8'); c.fillStyle = lg;
  c.beginPath(); c.moveTo(x - w * 0.5, y + h * 0.08); c.lineTo(x + w * 0.5, y + h * 0.08); c.lineTo(x + w * 0.38, y + h * 0.5); c.lineTo(x - w * 0.38, y + h * 0.5); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(40,80,140,0.45)'; c.lineWidth = 1; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(x + i * w * 0.14, y + h * 0.08); c.lineTo(x + i * w * 0.11, y + h * 0.5); c.stroke(); }
  if (!filled) { c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.ellipse(x, y + h * 0.06, w * 0.5, h * 0.16, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(40,80,140,0.5)'; c.stroke(); }
  c.restore();
}

MG.add({
  id: 'mmult', stage: 'matrices', cmd: 'MATRIX MULT!', hint: 'drag', time: 10, winText: 'Baked!', hold: 1.8,
  card: {
    title: 'Multiplying matrices', ref: 'Precalculus', kind: 'Matrices',
    text: 'To multiply two matrices, each entry of the answer comes from one row of the first matrix and one column of the second.\n\nTake the row and the column, pair their numbers up first with first and second with second, multiply each pair, and add. That is called a dot product.\n\nFor the top-left entry of [2 3; 1 4] times [5 1; 7 2], use the top row (2, 3) and the left column (5, 7): 2 · 5 + 3 · 7 = 10 + 21 = 31. Row i with column j gives the entry in row i, column j.\n\nThe order matters: AB is usually not the same as BA.',
    note: 'Entry (i, j) of AB is row i of A times column j of B: multiply the pairs and add.',
    ask: 'What is the bottom-right entry of [1 2; 3 4] times [5 6; 7 8]? What is [1 0; 0 1] times [2 3; 4 5]?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { A, B, C } = S, T = M.pace(g);
    S.an = A.map((r, i) => r.map((v, j) => M.num(v, 'a' + i + j))); S.bn = B.map((r, i) => r.map((v, j) => M.num(v, 'b' + i + j)));
    S.cn = C.map((r, i) => r.map((v, j) => M.num('?', 'c' + i + j, { col: '#5a7ab0' })));
    S.top = M.row(M.mat(S.an, 'A'), M.gap(22), M.mat(S.bn, 'B'));
    S.bot = M.row(M.op('=', 'eq'), M.gap(6), M.mat(S.cn, 'C'));
    S.relay = () => { M.place(g, 'top', S.top, 180, AY, AS, { col: INK }); M.place(g, 'bot', S.bot, 172, CY, CS, { col: INK }); }; S.relay();
    M.inert(g, ['A', 'B', 'C', 'eq']);
    S.filled = {}; S.fillAt = {}; S.busyCell = null;
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    // the working for entry (i, j)
    const cell = (i, j) => { const p1 = A[i][0] * B[0][j], p2 = A[i][1] * B[1][j], v = C[i][j];
      return {
        busy: 0.1, askAt: 0.95 * T, after: 0.62 * T,
        ask: { v, wrong: [A[i][0] * B[j][0] + A[i][1] * B[j][1], A[i][0] + B[0][j] + A[i][1] + B[1][j], p1 * p2, A[i][0] * B[1][j] + A[i][1] * B[0][j]] },
        then(g) {
          S.filled[i + '' + j] = true; S.cur = { i, j, t: g.t }; S.point = true; hop('wow'); M.show(g, 0.95 * T); g.sfx('swoosh');
          M.circle(g, ['a' + i + '0', 'a' + i + '1'], { col: ROWC, dur: 0.45 * T }); M.circle(g, ['b0' + j, 'b1' + j], { col: COLC, dur: 0.45 * T, delay: 0.05 * T });
          M.indicate(g, S.cn[i][j], { col: '#ffd23a', dur: 0.4 * T });
          // the working: the row swings round to stand beside the column, pair by pair
          const mk = (a, b, p, k) => { const an = M.num(a, null, { alpha: 0, col: '#c06a10' }), bn = M.num(b, null, { alpha: 0, col: '#c03a6a' }), pn = M.num(p, null, { alpha: 0 }), eq = M.op('=', null, { alpha: 0 });
            const aw = a < 0 ? M.paren(an, null, { alpha: 0 }) : an, bw = b < 0 ? M.paren(bn, null, { alpha: 0 }) : bn; if (a < 0) an.alpha = 1; if (b < 0) bn.alpha = 1;
            const row = M.row(aw, M.op('·'), bw, eq, pn); row.items[1].alpha = 0; return { row, an: aw, bn: bw, pn, eq, dot: row.items[1] }; };
          S.w = [mk(A[i][0], B[0][j], p1, 0), mk(A[i][1], B[1][j], p2, 1)];
          S.w.forEach((w, k) => { w.an.id = 'wa' + k; w.bn.id = 'wb' + k; w.pn.id = 'wp' + k; M.place(g, 'w' + k, w.row, 180, k ? W2 : W1, 28, { col: NOTE }); });
          S.w.forEach((w, k) => {
            M.fly(g, { node: M.num(A[i][k], null, { col: '#c06a10' }), from: 'a' + i + k, to: 'wa' + k, delay: 0.12 * T + k * 0.08 * T, dur: 0.38 * T, arc: k ? 30 : -10, s0: AS, s1: 28, then(g) { w.an.alpha = 1; w.an.pop = g.t; g.sfx('tap', { pitch: 1 + k * 0.1 }); } });
            M.fly(g, { node: M.num(B[k][j], null, { col: '#c03a6a' }), from: 'b' + k + j, to: 'wb' + k, delay: 0.16 * T + k * 0.08 * T, dur: 0.38 * T, arc: -20, s0: AS, s1: 28, then(g) { w.bn.alpha = 1; w.bn.pop = g.t; M.tween(g, w.dot, { alpha: 1 }, 0.12 * T); } });
          });
          M.at(g, [
            [0.58 * T, g => { S.w.forEach((w, k) => { w.eq.alpha = 1; w.pn.alpha = 1; w.eq.write = { t0: g.t + k * 0.08 * T, dur: 0.2 * T }; w.pn.write = { t0: g.t + k * 0.08 * T + 0.06 * T, dur: 0.16 * T }; }); g.sfx('ding'); hop('think'); }],
            [0.8 * T, g => { S.sq = M.num(v, 'sq', { alpha: 0 }); const p2n = M.num(Math.abs(p2));
              S.sum = M.row(M.num(p1), M.op(p2 < 0 ? '-' : '+'), p2n, M.op('='), S.sq); M.place(g, 'sum', S.sum, 180, WS + 2, 28, { col: INK }); M.writeIn(g, S.sum, { dur: 0.22 * T }); }],
          ]);
        },
        resolve(g) {
          M.show(g, 0.62 * T); S.sq.alpha = 1; M.writeIn(g, S.sq, { dur: 0.15 * T }); M.indicate(g, S.sq, { delay: 0.1 * T, dur: 0.25 * T, col: '#ffd23a' }); g.sfx('ding');
          M.at(g, [[0.18 * T, g => { const b = { ...M.box(g, 'sq') }; S.sq.alpha = 0;
            M.fly(g, { node: M.num(v, null, { col: INK }), from: [b.x, b.y], to: 'c' + i + j, dur: 0.3 * T, arc: -30, s0: 28, s1: CS,
              then(g) { const n = S.cn[i][j]; M.roll(g, n, v, { dur: 0.2 * T }); n.col = INK; n.pop = g.t; S.fillAt[i + '' + j] = g.t; S.relay(); M.sparkle(g, n, { n: 12, cols: ['#ff6a8a', '#6ac0ff', '#ffd23a', '#fff'] }); g.sfx('coin'); hop('laugh'); } });
            for (const k of [0, 1]) M.tween(g, S.w[k].row, { alpha: 0 }, 0.2 * T); M.tween(g, S.sum, { alpha: 0 }, 0.2 * T, { delay: 0.05 * T });
            }],
            [0.55 * T, g => { for (const k of ['w0', 'w1', 'sum']) delete g.s.mk.ex[k]; S.cur = null; S.point = false; }]]);
        },
      }; };
    M.play(g, {
      moves(g) {
        const out = [];
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { if (S.filled[i + '' + j]) continue; const mv = cell(i, j);
          out.push({ ...mv, drag: ['a' + i + '0', 'a' + i + '1'], to: ['b0' + j, 'b1' + j] }, { ...mv, tap: 'c' + i + j }); }
        return out;
      },
      area(g) { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (!S.filled[i + '' + j]) return ['a' + i + '0', 'a' + i + '1', 'b0' + j, 'b1' + j, 'c' + i + j]; return null; },
      onWin(g) { for (const r of S.cn) for (const n of r) n.pop = g.t + Math.random() * 0.1; },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('matrices_mult_bakery', bakery), 0, 0, W, H);
    // dust motes in the window light and steam from the basket
    c.save(); for (let i = 0; i < 12; i++) { const x = 60 + (i * 37 + Math.sin(t * 0.5 + i) * 20) % 140, y = 160 + (i * 61 + t * 8) % 340; c.fillStyle = `rgba(255,250,220,${0.25 + 0.2 * Math.sin(t * 2 + i)})`; c.beginPath(); c.arc(x + y * 0.25, y, 1.6, 0, 7); c.fill(); }
    for (let i = 0; i < 4; i++) { const k = (t * 0.35 + i / 4) % 1; c.fillStyle = `rgba(255,255,255,${0.4 * (1 - k)})`; c.beginPath(); c.arc(52 + Math.sin(t * 1.3 + i) * 6, 540 - k * 70, 5 + k * 10, 0, 7); c.fill(); } c.restore();
    // the trays behind the matrices
    for (const [id, col] of [['A', '#c8c8d0'], ['B', '#c8c8d0'], ['C', '#d8c0a0']]) { const b = M.box(g, id); if (!b) continue; c.save(); c.fillStyle = 'rgba(80,40,20,0.22)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 4, b.y - b.h / 2 + 2, b.w + 8, b.h + 6, 12); c.fill();
      const tg = c.createLinearGradient(0, b.y - b.h / 2, 0, b.y + b.h / 2); tg.addColorStop(0, id === 'C' ? '#f4e2c8' : '#e8e8f0'); tg.addColorStop(1, id === 'C' ? '#d8bc98' : '#b8b8c8'); c.fillStyle = tg; c.beginPath(); c.roundRect(b.x - b.w / 2 - 4, b.y - b.h / 2 - 2, b.w + 8, b.h + 4, 12); c.fill(); c.strokeStyle = 'rgba(90,60,40,0.4)'; c.lineWidth = 1.5; c.stroke(); c.restore(); }
    // the lit row and column bands
    if (S.cur) { const { i, j } = S.cur, k = M.clamp((t - S.cur.t) / 0.25, 0, 1), ra = M.unionBox([M.box(g, 'a' + i + '0'), M.box(g, 'a' + i + '1')]), cb = M.unionBox([M.box(g, 'b0' + j), M.box(g, 'b1' + j)]);
      c.save(); c.globalAlpha = 0.35 * k; c.fillStyle = ROWC; if (ra) { c.beginPath(); c.roundRect(ra.x - ra.w / 2 - 22, ra.y - ra.h / 2 - 20, ra.w + 44, ra.h + 40, 22); c.fill(); }
      c.fillStyle = COLC; if (cb) { c.beginPath(); c.roundRect(cb.x - cb.w / 2 - 22, cb.y - cb.h / 2 - 20, cb.w + 44, cb.h + 40, 22); c.fill(); } c.restore(); }
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const a = M.box(g, 'a' + i + j), b = M.box(g, 'b' + i + j), q = M.box(g, 'c' + i + j);
      const cu = S.cur; if (a) cookie(c, a.x, a.y, 22, !!cu && cu.i === i); if (b) macaron(c, b.x, b.y, 22, !!cu && cu.j === j);
      if (q) { const f = S.fillAt[i + '' + j]; cupcake(c, q.x, q.y + 2, 50, f != null, f != null ? M.clamp((t - f) / 0.3, 0, 1) : 0); }
    }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'bot');
    // a soft panel behind the working, so it reads over the wall
    if (S.mk.ex.w0) { const al = S.w ? (S.w[0].row.alpha ?? 1) : 1; c.save(); c.globalAlpha = 0.55 * al; c.fillStyle = '#fff8ee'; c.beginPath(); c.roundRect(90, W1 - 30, 180, WS - W1 + 44, 16); c.fill(); c.restore(); }
    for (const k of ['w0', 'w1', 'sum']) M.drawEx(g, c, k);
    // the duck baker
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'duck', HX, HY - hopK * 22, 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'duck', HX, HY, 1.35);
    M.drawUI(g, c);
  },
});
