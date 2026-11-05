// chance_multiply.js — MULTIPLY PROBS! For independent events, P(A and B) = P(A) · P(B). On a sheet of paper at dusk,
// with a small grid of every outcome under the working line.
// Moves (show your work): drag one event onto the other (either way), or tap "and": "and" is circled and
// "= P(A) · P(B)" writes itself under the problem while each event and its copy light up in turn.
// Tap P(A) and P(B), in either order: it becomes a fraction whose bottom is written as every outcome of that event
// (the coin sides, or the faces of that die) lights up in a sweep, and whose top counts A's outcomes one by one with a
// ring each; then A's band of the grid fills in, cell by cell.
// Tap the dot: the two fractions glide together into one, (top × top) / (bottom × bottom). Then the bottoms slide
// together and roll over to their product while the whole grid ripples (that many outcomes), and the tops roll over
// to theirs while every cell outside both bands fades and the cells in both turn gold (one cell of 12 for heads and a 6).
// Level 0: a coin and a die, P(heads and k). Level 1: P(heads and even) and the like. Level 2: two dice (red and blue), P(k and j).
// Medium mode: each fraction and the product open a tray.
const M = MK, INK = SCN.ink('paper'), RED = '#d84a4a', BLUE = '#3a6ad8', GOLD = '#f2b820', AND = '#8a5a9a', HX = 296, HY = 600;
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), heads = g.rand() < 0.5;
  if (L === 0) { const k = r(1, 6); return { dice: false, a: M.txt('heads'), b: M.num(k), inA: i => i === 0, inB: j => j === k - 1, mA: 1, nA: 2, mB: 1, nB: 6 }; }
  if (L === 1) { const even = g.rand() < 0.5; return { dice: false, a: M.txt(heads ? 'heads' : 'tails'), b: M.txt(even ? 'even' : 'odd'), inA: i => i === (heads ? 0 : 1), inB: j => ((j + 1) % 2 === 0) === even, mA: 1, nA: 2, mB: 3, nB: 6 }; }
  const k = r(1, 6), j = r(1, 6);
  return { dice: true, a: M.num(k, null, { col: RED }), b: M.num(j, null, { col: BLUE }), inA: i => i === k - 1, inB: q => q === j - 1, mA: 1, nA: 6, mB: 1, nB: 6 };
}
// every symbol inside a node (fading these, not just their row, means they leave no ghosts when removed)
const leaves = (n, out = []) => { if (!n) return out; if (/^(num|var|txt|op)$/.test(n.k)) out.push(n); for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) leaves(ch, out); return out; };
const pips = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
function face(c, x, y, s, f, col) {
  c.fillStyle = col || '#fffaf0'; c.strokeStyle = 'rgba(42,36,64,0.6)'; c.lineWidth = 1.2; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s, s * 0.22); c.fill(); c.stroke();
  c.fillStyle = col ? '#fff' : '#2a2440'; for (const [a, b] of pips[f]) { c.beginPath(); c.arc(x + a * s * 0.26, y + b * s * 0.26, s * 0.09, 0, 7); c.fill(); }
}
MG.add({
  id: 'indep', stage: 'chance', cmd: 'MULTIPLY PROBS!', hint: 'drag', time: 9, mood: 'night', winText: 'Both!', hold: 1.4,
  card: {
    title: 'Independent events', ref: 'Grade 7 and up', kind: 'Statistics',
    text: 'Two events are independent when one of them happening does not change the chance of the other. A coin flip and a die roll are independent: the coin does not care what the die shows.\n\nFor independent events, the probability that both happen is the product of their probabilities: P(A and B) = P(A) · P(B). To multiply two fractions, multiply the tops and multiply the bottoms.\n\nFor example, P(heads and 6) = 1/2 · 1/6 = 1/12.\n\nWhy it works: a coin and a die together have 2 × 6 = 12 equally likely outcomes, such as heads with a 3 or tails with a 6. Exactly one of those 12 is heads with a 6.',
    note: 'If A and B are independent, P(A and B) = P(A) · P(B).',
    ask: 'What is the probability of tails and an even number? What is the probability of rolling two 6s with two dice?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g);
    S.prob = M.row(M.vr('P', 'P'), M.paren(M.row({ ...p.a, id: 'A' }, M.gap(10), M.txt('and', 'and', { col: AND }), M.gap(10), { ...p.b, id: 'B' }), 'pp'));
    S.work = M.row();
    const top = p.dice ? 216 : 228;
    const place = () => { M.place(g, 'prob', S.prob, 180, top, 38, { col: INK }); M.place(g, 'work', S.work, 180, top + 68, 34, { col: INK }); };
    S.relay = place; place(); M.inert(g, ['P', 'pp', 'eq', 'nA', 'nB', 'dA', 'dB', 'xn', 'xd', 'ans']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const F = (a, b, id, o) => M.frac(M.num(a), M.num(b), id, o);
    // the grid of every outcome: rows are the first event's outcomes (coin sides, or the red die), columns the die faces
    const rows = p.dice ? 6 : 2, cs = p.dice ? 15 : 28, lab = p.dice ? 16 : 28, gw = 6 * cs + lab, x0 = 180 - gw / 2 + lab, y0 = p.dice ? 356 : 352;
    S.G = { rows, cs, lab, x0, y0, rowLab: i => [x0 - lab / 2 - 1, y0 + (i + 0.5) * cs], colLab: j => [x0 + (j + 0.5) * cs, y0 - lab / 2 - 1], cell: (i, j) => [x0 + (j + 0.5) * cs, y0 + (i + 0.5) * cs] };
    S.rowT = []; S.colT = []; S.rowRing = []; S.colRing = []; S.cellA = {}; S.cellB = {};
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, ex) => { S.hopT = g.t; S.face = ex || 'wow'; S.faceT = g.t; };
    // 1. split "and" into a product of two probabilities
    const split = { busy: 0.1, then(g) {
      S.split = g.t; M.show(g, 1.0 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
      const pa = M.row(M.vr('P'), M.paren({ ...p.a, id: null })), pb = M.row(M.vr('P'), M.paren({ ...p.b, id: null })); pa.id = 'PA'; pb.id = 'PB';
      S.dot = M.op('·', 'dot', { col: AND });
      S.work.items.push(M.op('=', 'eq'), M.gap(4), pa, S.dot, pb); place();
      M.circle(g, 'and', { dur: 0.55 * T, col: AND }); M.writeIn(g, S.work, { dur: 0.65 * T, delay: 0.15 * T });
      const ca = p.dice ? RED : '#d0901a', cb = p.dice ? BLUE : '#4a7ad8';
      M.indicate(g, 'A', { delay: 0.2 * T, dur: 0.35 * T, col: ca }); M.indicate(g, pa, { delay: 0.38 * T, dur: 0.35 * T, col: ca });
      M.indicate(g, 'and', { delay: 0.45 * T, dur: 0.35 * T, col: AND }); M.indicate(g, S.dot, { delay: 0.55 * T, dur: 0.4 * T, sc: 2, col: AND });
      M.indicate(g, 'B', { delay: 0.6 * T, dur: 0.35 * T, col: cb }); M.indicate(g, pb, { delay: 0.75 * T, dur: 0.35 * T, col: cb });
      M.at(g, [[0.8 * T, g => { g.sfx('pop'); hop(g); }], [0.95 * T, g => { S.point = false; }]]); } };
    // 2. a probability becomes a fraction: its bottom is every outcome of that event (they sweep), its top counts A's outcomes
    const prob = (k) => {
      const [m, n, m2, n2] = k === 'A' ? [p.mA, p.nA, p.mB, p.nB] : [p.mB, p.nB, p.mA, p.nA], col = p.dice ? (k === 'A' ? RED : BLUE) : null;
      const labs = k === 'A' ? [...Array(rows).keys()] : [0, 1, 2, 3, 4, 5], hits = labs.filter(i => k === 'A' ? p.inA(i) : p.inB(i));
      const sw = 0.07 * T, t1 = 0.2 * T + n * sw, st = 0.22 * T, t2 = t1 + m * st, band = 0.4 * T, len = 0.15 * T + t2 + band + 0.15 * T;
      return { tap: 'P' + k, busy: 0.1, askAt: 0.4 * T, after: len, ask: { v: F(m, n), wrong: [F(n, m), F(n - m, n), F(m, n2)] },
        then(g) { S['q' + k] = 1; M.show(g, 0.4 * T); S.point = true; hop(g, 'think'); M.circle(g, 'P' + k, { dur: 0.45 * T, col: col || GOLD }); },
        resolve(g) { M.show(g, len); const o = 0.15 * T;
          // P(A) fades out first, so its letters leave no ghosts, and the fraction takes its place
          leaves(M.node(g, 'P' + k)).forEach(q => M.tween(g, q, { alpha: 0 }, o));
          const nn = M.num(1, 'n' + k, { col, alpha: 0 }), dd = M.num(n, 'd' + k, { col }); S['N' + k] = nn;
          M.at(g, [[o, g => { S['D' + k] = dd; S.work.items[k === 'A' ? 2 : 4] = M.frac(nn, dd, 'f' + k, { col, bar: { t0: g.t, dur: 0.25 * T } }); place();
            M.writeIn(g, dd, { dur: Math.max(0.2 * T, n * sw) }); g.sfx('swoosh'); }]]);
          // the bottom: every outcome of this event lights in a sweep
          labs.forEach((i, q) => M.at(g, [[o + 0.05 * T + q * sw, g => { (k === 'A' ? S.rowT : S.colT)[i] = g.t; g.sfx('tap'); }]]));
          // the top: A's outcomes get a ring one by one while the top counts them
          hits.forEach((i, q) => M.at(g, [[o + t1 + q * st, g => { (k === 'A' ? S.rowRing : S.colRing)[i] = g.t; nn.alpha = 1; if (q) M.roll(g, nn, q + 1, { dur: Math.min(0.18, st * 0.8) }); nn.pop = g.t;
            const [x, y] = k === 'A' ? S.G.rowLab(i) : S.G.colLab(i); g.burst(x, y, [col || GOLD, '#fff'], 6, 70); g.sfx('pop'); S.hopT = g.t; }]]));
          // then the event's band of the grid fills in, cell by cell along it
          M.at(g, [[o + t2, g => { const tab = k === 'A' ? S.cellA : S.cellB, along = k === 'A' ? 6 : rows;
            for (const i of hits) for (let j = 0; j < along; j++) tab[k === 'A' ? i + ',' + j : j + ',' + i] = g.t + j * band / along * 0.8; g.sfx('sweep'); }],
            [0.15 * T + t2 + band, g => { M.sparkle(g, 'f' + k, { n: 8, cols: [col || GOLD, '#fff'] }); hop(g); if (S.qA && S.qB) S.point = false; }]]); } };
    };
    const mA = p.mA * p.mB, nA = p.nA * p.nB;
    // 3. multiply: the fractions glide into one, then the bottoms and the tops each roll over to their products
    const multiply = { tap: ['dot', 'fA', 'fB'], busy: 0.1, askAt: 0.8 * T, after: 1.3 * T, ask: { v: F(mA, nA), wrong: [F(p.mA + p.mB, p.nA + p.nB), F(mA, p.nA + p.nB), F(p.mA + p.mB, nA)] },
      then(g) { S.qP = 1; M.show(g, 0.8 * T); S.point = true; hop(g, 'think');
        M.circle(g, ['fA', 'dot', 'fB'], { dur: 0.5 * T, col: GOLD }); M.indicate(g, S.dot, { dur: 0.35 * T, sc: 2, col: AND });
        M.at(g, [[0.4 * T, g => { S.xn = M.op('×', 'xn', { col: GOLD }); S.xd = M.op('×', 'xd', { col: GOLD });
          S.prodF = M.frac(M.row(S.NA, S.xn, S.NB), M.row(S.DA, S.xd, S.DB), 'pf');
          M.tween(g, S.dot, { alpha: 0 }, 0.15 * T); S.work.items.splice(2); S.work.items.push(S.prodF); place(); g.sfx('swoosh'); }]]); },
      resolve(g) { M.show(g, 1.3 * T);
        // squeeze: the second factor and the × slide into the first, which rolls over to the product
        const squeeze = (a, x, b, v, d) => { const ba = M.box(g, a.id); for (const q of [x, b]) { const bq = M.box(g, q.id); M.tween(g, q, { dx: ba && bq ? ba.x - bq.x : -30, alpha: 0, sc: 0.5 }, 0.26 * T, { delay: d }); }
          M.roll(g, a, v, { delay: d + 0.12 * T, dur: 0.3 * T }); M.light(g, a, { col: GOLD, delay: d });
          M.at(g, [[d + 0.28 * T, g => { const f = S.prodF; if (f.n.items && f.n.items.includes(a)) f.n = a; else if (f.d.items && f.d.items.includes(a)) f.d = a; place(); }]]); };
        squeeze(S.DA, S.xd, S.DB, nA, 0);
        // the whole grid ripples: this many outcomes in all
        M.at(g, [[0.32 * T, g => { S.wave = g.t; g.sfx('sweep'); }],
          [0.5 * T, g => { M.unlight(g, S.DA); }]]);
        squeeze(S.NA, S.xn, S.NB, mA, 0.55 * T);
        // the outcomes in both bands: everything else fades and they turn gold
        M.at(g, [[0.85 * T, g => { S.fin = g.t; g.sfx('chime'); for (let i = 0; i < rows; i++) for (let j = 0; j < 6; j++) if (p.inA(i) && p.inB(j)) { const [x, y] = S.G.cell(i, j); g.burst(x, y, [GOLD, '#fff', '#ff8a5a'], 8, 90); } }],
          [1.05 * T, g => { M.unlight(g, S.NA); S.NA.col = S.DA.col = null; S.prodF = M.frac(S.NA, S.DA, 'ans'); S.work.items.splice(2); S.work.items.push(S.prodF); place();
            M.sparkle(g, 'ans', { n: 16, v: 140, cols: [GOLD, '#ff8a5a', '#fff'] }); M.tween(g, S.prodF, { sc: 1.2 }, 0.25 * T, { yoyo: true }); hop(g, 'laugh'); S.point = false; }]]); } };
    M.play(g, {
      moves(g) {
        if (!S.split) return [{ drag: 'A', to: 'B', ...split }, { drag: 'B', to: 'A', ...split }, { tap: 'and', ...split }];
        const out = [];
        if (!S.qA) out.push(prob('A'));
        if (!S.qB) out.push(prob('B'));
        if (S.NA && S.NB && !S.qP) out.push(multiply);
        return out;
      },
      area(g) { return !S.split ? ['A', 'B'] : !S.qA ? ['PA'] : !S.qB ? ['PB'] : ['dot']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, G = S.G, { rows, cs, lab, x0, y0 } = G;
    SCN.std(g, c, { scene: 'dusk', panel: 'paper', panelY: 300, panelH: p.dice ? 290 : 250 });
    const pk = v => v == null || t < v ? 0 : M.clamp((t - v) / 0.25, 0, 1), sw = v => v == null || t < v ? 0 : Math.sin(M.clamp((t - v) / 0.3, 0, 1) * Math.PI);
    const fin = pk(S.fin), wave = S.wave != null ? t - S.wave : -1;
    // the labels: the die faces across the top, and the coin sides (or the red die) down the side. They swell as they
    // sweep (counting the bottom) and get a ring when counted into the top.
    const ring = (x, y, r, col, k) => { if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineWidth = 2.5; c.globalAlpha = k; c.beginPath(); c.arc(x, y, r * (1.3 - 0.3 * k), 0, 7); c.stroke(); c.restore(); };
    for (let j = 0; j < 6; j++) { const [x, y] = G.colLab(j), z = 1 + 0.45 * sw(S.colT[j]) + 0.3 * sw(S.colRing[j]), s = Math.min(cs, lab) * 0.78 * z;
      face(c, x, y, s, j + 1, p.dice ? BLUE : null); ring(x, y, Math.min(cs, lab) * 0.62, p.dice ? BLUE : '#4a7ad8', pk(S.colRing[j])); }
    for (let i = 0; i < rows; i++) { const [x, y] = G.rowLab(i), z = 1 + 0.45 * sw(S.rowT[i]) + 0.3 * sw(S.rowRing[i]);
      if (p.dice) face(c, x, y, lab * 0.78 * z, i + 1, RED);
      else { const r = cs * 0.36 * z; c.fillStyle = i ? '#c8ccd8' : '#f2c040'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = i ? '#4a4e60' : '#7a4a0a'; c.font = `700 ${cs * 0.42 * z}px Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(i ? 'T' : 'H', x, y + 0.5); }
      ring(x, y, (p.dice ? lab : cs) * 0.62, p.dice ? RED : '#d0901a', pk(S.rowRing[i])); }
    // the cells: A's band fills red, B's blue, cell by cell; at the end the cells outside both fade and the overlap turns gold
    for (let i = 0; i < rows; i++) for (let j = 0; j < 6; j++) {
      const x = x0 + j * cs, y = y0 + i * cs, a = pk(S.cellA[i + ',' + j]), b = pk(S.cellB[i + ',' + j]), both = p.inA(i) && p.inB(j);
      const wk = wave >= 0 ? Math.max(0, Math.sin(M.clamp((wave - (i + j) * 0.035) / 0.25, 0, 1) * Math.PI)) : 0, out = both ? 0 : fin * 0.55;
      c.save(); if (wk > 0) { c.translate(x + cs / 2, y + cs / 2); c.scale(1 + 0.18 * wk, 1 + 0.18 * wk); c.translate(-x - cs / 2, -y - cs / 2); }
      c.globalAlpha = 1 - out; c.fillStyle = '#fffdf4'; c.fillRect(x, y, cs, cs);
      if (a) { c.fillStyle = `rgba(216,74,74,${0.3 * a})`; c.fillRect(x, y, cs, cs); }
      if (b) { c.fillStyle = `rgba(58,106,216,${0.3 * b})`; c.fillRect(x, y, cs, cs); }
      if (wk > 0) { c.fillStyle = `rgba(242,184,32,${0.35 * wk})`; c.fillRect(x, y, cs, cs); }
      if (both && fin) { const k = 0.6 + 0.4 * Math.sin(t * 6); c.fillStyle = `rgba(242,184,32,${(0.6 + 0.3 * k) * fin})`; c.fillRect(x + 1, y + 1, cs - 2, cs - 2); }
      c.strokeStyle = 'rgba(42,36,64,0.45)'; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, cs, cs); c.restore();
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    // the fox points at the paper while the work is shown, and hops on every count
    const hk = t - S.hopT < 0.3 ? Math.sin((t - S.hopT) / 0.3 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', HX, HY - hk * 18, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', HX, HY, 1.25);
    M.drawUI(g, c);
  },
});
