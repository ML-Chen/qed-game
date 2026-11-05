// derivs_critical.js — CRITICAL POINT! Find where a function's slope is zero: solve f′(x) = 0.
// An alpine morning. The graph of f is a mountain ridge, and a goat ambles along it on a little plank that is always the
// tangent line: on the slopes the plank tilts, and at a peak or a valley floor it lies flat. A ruler of x values runs
// along the foot of the ridge. Moves (every one acts its working out by itself, show your work):
//   1. Drag the d/dx onto f(x): a copy of f's terms writes itself as f′(x) = ..., and each term is differentiated in
//      turn: a power hops down onto the coefficient and rolls down by one, a lone x melts away, a constant is crossed
//      out.
//   2. Tap f′(x): "= 0" writes itself, the f′(x) fades, the constant lifts and hops over the = (its sign flips), the
//      leading number is crossed out with "÷ k" and the other side rolls down, and (for a cubic) a √ turns x² = a² into
//      x = ±a, which splits into its two roots.
//   3. Drag each root onto the ridge (any order): it flies to its tick on the ruler, a dashed line rises to the curve,
//      and the goat trots there; its plank swings level (slope 0) and a flag is planted on the peak or in the valley.
// Level 0: x² − 2hx + c (one root, a valley). Level 1: x³ − 3a²x (a peak and a valley). Level 2: q·x³ − 3qa²x + c.
// Medium mode: f′(x) and the roots come from the tray.
const M = MK, INK = '#2a2440', GOLD = '#ffb21f', BLUE = '#2a7ab0', RED = '#d8454a';
const L1Y = 216, L2Y = 278, GX0 = 34, GX1 = 326, GT = 352, GB = 516, RUL = 540;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) { const h = 1 + r(4); return { kind: 'quad', terms: [[1, 2], [-2 * h, 1], ...(r(3) ? [[1 + r(8), 0]] : [])], roots: [h], K: 2, m: 1, R: h }; }
  const a = L === 1 ? 1 + r(2) : 2 + r(2), q = L === 1 ? 1 : 1 + r(2), c0 = L === 2 ? 1 + r(6) : 0;
  return { kind: 'cub', terms: [[q, 3], [-3 * q * a * a, 1], ...(c0 ? [[c0, 0]] : [])], roots: [-a, a], K: 3 * q, m: 2, R: a };
}
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])].filter(Boolean);
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); kids(q).forEach(walk); })(n); return out; };
const hideAll = n => { if (!n) return; n.alpha = 0; kids(n).forEach(hideAll); };
const tint = (n, col) => { if (!n) return n; n.col = col; kids(n).forEach(q => tint(q, col)); return n; };
const xp = (p, id) => p === 1 ? M.vr('x', id) : M.sup(M.vr('x'), M.num(p), id);
// a plain line of terms [c, p], with no ids
const plain = T => M.row(...T.map(([c, p], i) => M.row(i ? M.op(c < 0 ? '-' : '+') : (c < 0 ? M.op('-') : null), Math.abs(c) === 1 && p ? null : M.num(Math.abs(c)), p ? xp(p) : null)));
const fval = (T, x) => T.reduce((s, [c, p]) => s + c * Math.pow(x, p), 0);
const dval = (T, x) => T.reduce((s, [c, p]) => s + (p ? c * p * Math.pow(x, p - 1) : 0), 0);
function fitAsk(g) { const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; for (const ch of A.list) { const w = M.lay(ch.node, 34).w; ch.s = w > ch.w - 12 ? 34 * (ch.w - 12) / w : 34; M.lay(ch.node, ch.s); } }

// ---------------- the scene: an alpine morning ----------------
function scene(c, W, H) {
  P.sky(c, W, H, ['#6a9ad8', '#a8c8ea', '#d8e8f4', '#fbeacc'], { x: 70, y: 120, r: 22, color: '#fff6d8', glow: 170 });
  // far snowy peaks
  const peaks = [[-20, 330, 70], [60, 300, 90], [150, 320, 80], [240, 290, 100], [330, 316, 80], [390, 330, 60]];
  for (const [x, y, w] of peaks) { c.fillStyle = '#8aa0c8'; c.beginPath(); c.moveTo(x - w, 420); c.lineTo(x, y); c.lineTo(x + w, 420); c.fill();
    c.fillStyle = '#f4f8fc'; c.beginPath(); c.moveTo(x - w * 0.28, y + 26); c.lineTo(x, y); c.lineTo(x + w * 0.28, y + 26); c.lineTo(x + w * 0.1, y + 20); c.lineTo(x, y + 28); c.lineTo(x - w * 0.12, y + 21); c.fill(); }
  P.hills(c, W, 470, 26, '#8ab878', '#5a8a50', { seed: 12, dabs: 40 });
  c.fillStyle = '#5a8448'; c.fillRect(0, 556, W, 84); P.grassTufts && P.grassTufts(c, W, 560, 640, 40, '#4a7a3a', 5);
  P.flowers(c, W, 580, 640, 18, ['#ffffff', '#f4d35e', '#b98ae0'], 3);
}

MG.add({
  id: 'critical', stage: 'derivs', cmd: 'CRITICAL POINT!', hint: 'drag', time: 9, mood: 'bright', winText: 'Level ground!', hold: 1.7,
  card: {
    title: 'Critical points', ref: 'Grade 12 and up', kind: 'Calculus',
    text: 'The derivative f′(x) is the slope of the graph of f at x. At the top of a hill or the bottom of a valley the graph is flat for a moment, so the slope there is 0. Those places are called critical points.\n\nTo find them, work out f′(x), set it equal to 0 and solve for x.\n\nFor example, f(x) = x³ − 3x has f′(x) = 3x² − 3. Setting 3x² − 3 = 0 gives x² = 1, so x = −1 or x = 1. The graph has a peak at x = −1 and a valley at x = 1.\n\nA tangent line touching the graph at a critical point lies perfectly level.',
    note: 'Critical points are where f′(x) = 0: differentiate, set the derivative equal to 0, and solve for x.',
    ask: 'Where is the critical point of f(x) = x² − 8x + 1? What are the critical points of f(x) = x³ − 12x?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g), { K, m, R } = S;
    S.dT = S.terms.map(([c, p]) => [c * p, p - 1]).filter(([c]) => c);
    // the problem line, f(x) = ..., with an id on every term so a wrong tap is possible
    const fx = () => M.row(M.vr('f'), M.paren(M.vr('x')));
    S.fT = S.terms.map(([c, p], i) => { const r = M.row(i ? M.op(c < 0 ? '-' : '+') : null, Math.abs(c) === 1 && p ? null : M.num(Math.abs(c)), p ? xp(p) : null); r.id = 'f' + i; return r; });
    S.fRow = M.row(...S.fT); S.fRow.id = 'fx';
    S.top = M.row(fx(), M.op('=', 'eq1'), S.fRow);
    S.tok = M.ddx('x', 'tok');
    // the x range of the ridge, and its scale
    S.xr = S.kind === 'quad' ? [R - 3, R + 3] : [-R * 1.9, R * 1.9];
    { let lo = 1e9, hi = -1e9; for (let i = 0; i <= 80; i++) { const v = fval(S.terms, S.xr[0] + (S.xr[1] - S.xr[0]) * i / 80); lo = Math.min(lo, v); hi = Math.max(hi, v); } S.yr = [lo, hi]; }
    S.marks = []; S.walk = null;
    S.topS = Math.min(34, 34 * 244 / M.lay(S.top, 34).w);
    // the working line's size: its widest forms (the first copy, and f′(x) = ... = 0) fit the width
    { const fp = () => M.row(M.vr('f′'), M.paren(M.vr('x')), M.op('=')), w = Math.max(M.lay(M.row(fp(), plain(S.terms)), 40).w, M.lay(M.row(fp(), plain(S.dT), M.op('='), M.num(0)), 40).w); S.ws = Math.min(40, 40 * 316 / w); }
    const relay = () => { M.place(g, 'top', S.top, 206, L1Y, S.topS, { col: INK }); M.place(g, 'tok', S.tok, 44, L1Y - 8, 40, { col: '#4a2410' }); if (S.work) M.place(g, 'work', S.work, 180, L2Y, S.ws, { col: INK }); };
    S.relay = relay; relay(); M.inert(g, ['eq1', 'eq2', 'fp', 'zero', 'pm']);
    M.zone(g, 'ridge', { x: 180, y: (GT + RUL) / 2, w: GX1 - GX0, h: RUL - GT + 20 });
    g.dur *= (2.6 + 1.05 * (3 + S.roots.length)) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };

    // the working line's terms: { sg, cf, pw } per term, re-synced as the work goes on
    const wterm = ([c, p], i) => { const Q = { c, p, i, sg: i ? M.op(c < 0 ? '-' : '+', 'ws' + i) : null, cf: Math.abs(c) === 1 && p ? null : M.num(Math.abs(c), 'wc' + i), pw: p ? xp(p, 'wp' + i) : null };
      Q.row = M.row(); Q.row.id = 'w' + i; Q.sync = () => { Q.row.items = [Q.sg, Q.cf, Q.pw].filter(Boolean); }; Q.sync(); return Q; };
    // differentiate one term of the working line in place
    function dTerm(g, Q) {
      const { c, p } = Q;
      if (p === 0) { M.strike(g, Q.row, { dur: 0.2 * T }); M.tween(g, Q.row, { alpha: 0, sc: 0.6 }, 0.2 * T, { delay: 0.25 * T }); g.sfx('tap');
        M.at(g, [[0.5 * T, g => { hideAll(Q.row); S.WQ.splice(S.WQ.indexOf(Q), 1); S.syncW(); relay(); }]]); return; }
      if (p === 1) { M.circle(g, Q.pw, { dur: 0.3 * T, pad: 4 }); M.tween(g, Q.pw, { alpha: 0, sc: 0.4, dy: -10 }, 0.25 * T, { delay: 0.15 * T }); g.sfx('tap');
        M.at(g, [[0.42 * T, g => { hideAll(Q.pw); Q.pw = null; Q.sync(); relay(); }]]); return; }
      const ex = Q.pw.exp, from = { ...M.box(g, Q.pw.id) }, eb = M.box(g, ex.id || '') || from, c2 = Math.abs(c) * p;
      if (!Q.cf) { Q.cf = M.num(c2, 'wc' + Q.i, { alpha: 0 }); Q.sync(); relay(); Q.fresh = true; }
      M.light(g, ex, { col: GOLD });
      M.fly(g, { node: M.num(p, null, { col: GOLD }), from: [from.x + from.w * 0.3, from.y - from.h * 0.3], to: Q.cf.id, dur: 0.32 * T, arc: -40, s0: 26, s1: S.ws, col: GOLD,
        then(g) { if (Q.fresh) { Q.cf.alpha = 1; Q.cf.pop = g.t; } else { M.roll(g, Q.cf, c2, { dur: 0.26 * T }); M.note(g, { node: M.row(M.num(p), M.op('×'), M.num(Math.abs(c))), at: Q.cf.id, off: [0, -44], s: 22, col: GOLD, write: 0.2 * T, hold: 0.25 * T, fade: 0.15 * T }); }
          M.sparkle(g, Q.cf.id, { n: 6 }); g.sfx('ding'); } });
      M.roll(g, ex, p - 1, { delay: 0.35 * T, dur: 0.25 * T }); M.unlight(g, ex, { delay: 0.6 * T });
      if (p - 1 === 1) { M.tween(g, ex, { alpha: 0, sc: 0.4 }, 0.15 * T, { delay: 0.62 * T }); M.at(g, [[0.8 * T, g => { hideAll(ex); Q.pw = M.vr('x', 'wp' + Q.i); Q.pw.id = Q.pw.id; Q.sync(); relay(); }]]); }
    }
    S.syncW = () => { S.wR.items = S.WQ.map(q => q.row); };
    const dAsk = () => ({ v: plain(S.dT), wrong: [plain(S.dT.map(([c, p], i) => [i ? -c : c, p])),
      plain(S.terms.filter(([, p]) => p).map(([c, p]) => [c, p - 1])), plain(S.terms.filter(([, p]) => p).map(([c, p]) => [c * p, p]))] });
    // the roots as chips on the working line (one, or −a and a)
    const rootAsk = () => S.m === 1 ? { v: R, wrong: [K * R, -R, R * R + 1] } : { v: M.txt('±' + R), wrong: [M.num(R), M.txt('±' + 3 * R), M.txt('±' + R * R)] };
    M.play(g, {
      moves(g) {
        // 1. differentiate
        if (!S.work) return [{ drag: 'tok', to: ['fx', ...idsIn(S.top)], area: [GX0, L1Y - 40, GX1, L1Y + 30], busy: 0.1, askAt: 0.75 * T, after: 1.5 * T, ask: dAsk(),
          then(g) { M.show(g, 0.75 * T); S.point = true; react(g, 'think');
            S.WQ = S.terms.map(wterm); S.wR = M.row(); S.wR.id = 'fd'; S.syncW(); S.fp = M.row(M.vr('f′'), M.paren(M.vr('x'))); S.fp.id = 'fp'; S.eq2 = M.op('=', 'eq2');
            S.work = M.row(S.fp, S.eq2, S.wR); relay(); M.writeIn(g, S.work, { delay: 0.25 * T, dur: 0.45 * T }); S.work.alpha = 1;
            M.fly(g, { node: M.ddx(), from: 'tok', to: 'fp', dur: 0.32 * T, arc: -50, s0: 40, s1: 30, col: GOLD, then(g) { g.sfx('pop'); } });
            M.circle(g, 'fx', { dur: 0.5 * T, col: GOLD }); g.sfx('swoosh'); },
          resolve(g) { M.show(g, 1.5 * T); const list = S.WQ.slice(); list.forEach((Q, k) => M.at(g, [[k * 0.45 * T, g => { dTerm(g, Q); react(g, k % 2 ? 'happy' : 'wow'); }]]));
            M.at(g, [[1.4 * T, g => { M.indicate(g, S.wR, { dur: 0.3 * T, sc: 1.08 }); S.point = false; }]]); } }];
        // 2. set f′(x) = 0: "= 0" writes itself, the f′(x) fades, and the constant hops over the = (its sign flips)
        if (!S.zeroed) return [{ tap: ['fd', 'fp', ...idsIn(S.wR)], busy: 0.1,
          then(g) { S.zeroed = true; M.show(g, 1.55 * T); S.point = true; react(g, 'think'); const [Q0, Q1] = S.WQ;
            S.zero = M.num(0, 'zero', { _born: -1 }); S.eq3 = M.op('=', 'eq3', { _born: -1 }); S.rhs = M.row(S.zero);
            S.work.items = [S.fp, S.eq2, S.wR, S.eq3, S.rhs]; relay(); M.writeIn(g, M.node(g, 'eq3')); M.writeIn(g, S.zero, { delay: 0.12 * T, dur: 0.25 * T }); g.sfx('tap');
            M.at(g, [
              [0.45 * T, g => { M.tween(g, S.fp, { alpha: 0 }, 0.18 * T); M.tween(g, S.eq2, { alpha: 0 }, 0.18 * T); for (const q of kids(S.fp)) M.tween(g, q, { alpha: 0 }, 0.18 * T); }],
              [0.65 * T, g => { hideAll(S.fp); hideAll(S.eq2); S.work.items = [S.wR, S.eq3, S.rhs]; relay(); }],
              [0.95 * T, g => { M.tween(g, Q1.row, { dy: 30 }, 0.12 * T); M.circle(g, Q1.row, { dur: 0.25 * T }); }],
              [1.1 * T, g => { // the constant, lifted, hops over the = and its sign flips
                const b = { ...M.box(g, Q1.row.id) }, v = -Q1.c; hideAll(Q1.row); Q1.row.dy = 0; M.tween(g, S.zero, { alpha: 0 }, 0.1 * T);
                S.WQ = [Q0]; S.syncW(); S.cst = M.num(v, 'cst', { alpha: 0 }); S.rhs.items = [S.cst]; relay(); g.sfx('swoosh'); react(g, 'wow');
                M.fly(g, { node: M.row(M.op('-'), M.num(Math.abs(Q1.c))), from: [b.x, b.y + 30], to: 'cst', dur: 0.36 * T, arc: 26, s0: S.ws, s1: S.ws,
                  then(g) { S.cst.alpha = 1; S.cst.pop = g.t; S.cst.hl = 1; S.cst.hlc = GOLD; M.unlight(g, S.cst, { delay: 0.2 * T }); M.sparkle(g, 'cst', { n: 8 }); g.sfx('pop'); react(g, 'happy'); } }); }],
              [1.5 * T, g => { S.point = false; }],
            ]); } }];
        // 3. tap the leading number to divide both sides by it (and, for x², take the square root)
        if (!S.solved) return [{ tap: ['wc0', 'w0', 'fd', 'cst', ...idsIn(S.wR)], busy: 0.1, askAt: 0.5 * T, after: (S.m === 2 ? 1.3 : 0.75) * T, ask: rootAsk(),
          then(g) { S.solved = true; M.show(g, 0.5 * T); S.point = true; react(g, 'think'); const Q0 = S.WQ[0];
            M.circle(g, Q0.cf, { col: '#2a9ad8', dur: 0.3 * T }); M.note(g, { node: M.row(M.op('÷'), M.num(K)), at: 'work', off: [0, 40], s: 30, col: '#1a5a9a', write: 0.18 * T, hold: 0.5 * T, fade: 0.2 * T });
            M.strike(g, Q0.cf, { delay: 0.2 * T, dur: 0.15 * T, col: BLUE }); g.sfx('tap'); },
          resolve(g) { const Q0 = S.WQ[0], two = S.m === 2; M.show(g, (two ? 1.3 : 0.75) * T); react(g, 'happy');
            M.tween(g, Q0.cf, { alpha: 0, sc: 0.4 }, 0.15 * T); M.roll(g, S.cst, Math.pow(R, m), { dur: 0.28 * T }); g.sfx('ding');
            M.at(g, [[0.25 * T, g => { hideAll(Q0.cf); Q0.cf = null; Q0.sync(); relay(); M.sparkle(g, 'cst'); }]]);
            if (!two) { M.at(g, [[0.5 * T, g => { S.cst.id = 'r0'; S.chips = [S.cst]; M.indicate(g, S.cst, { dur: 0.3 * T, col: GOLD }); S.point = false; }]]); return; }
            // a √ of both sides: x² = a² becomes x = ±a, which splits into its two roots
            M.at(g, [
              [0.4 * T, g => { M.note(g, { node: M.txt('√'), at: 'work', off: [0, 40], s: 32, col: '#1a5a9a', write: 0.15 * T, hold: 0.3 * T, fade: 0.15 * T }); M.circle(g, [Q0.row.id, 'cst'], { col: '#2a9ad8', dur: 0.35 * T });
                const ex = Q0.pw.exp; M.tween(g, ex, { alpha: 0, sc: 0.4 }, 0.18 * T, { delay: 0.12 * T }); M.roll(g, S.cst, '±' + R, { delay: 0.12 * T, dur: 0.28 * T }); }],
              [0.68 * T, g => { Q0.pw = M.vr('x', 'wp0'); Q0.sync(); relay(); g.sfx('ding'); react(g, 'wow'); }],
              [0.9 * T, g => { // ±a splits into −a and a
                const b = { ...M.box(g, 'cst') }; hideAll(S.cst); S.chips = [M.num(-R, 'r0', { alpha: 0 }), M.num(R, 'r1', { alpha: 0 })];
                S.rhs.items = [S.chips[0], M.op(',', 'cm', { _born: -1 }), S.chips[1]]; relay(); M.inert(g, ['cm']); g.sfx('pop');
                for (const ch of S.chips) M.fly(g, { node: M.num(+ch.v.replace('−', '-')), from: [b.x, b.y], to: ch.id, dur: 0.25 * T, arc: -20, s0: S.ws, s1: S.ws, col: INK, then(g) { ch.alpha = 1; ch.pop = g.t; M.sparkle(g, ch.id, { n: 5 }); } }); }],
              [1.25 * T, g => { S.point = false; }],
            ]); } }];
        // 3. drop each root onto the ridge: the goat trots there and its plank lies level
        return S.chips.filter(ch => !ch.used).map(ch => ({ drag: ch.id, to: 'ridge', area: [GX0 - 10, GT - 20, GX1 + 10, RUL + 30], busy: 0.1,
          then(g) { ch.used = true; M.show(g, 1.35 * T); S.point = true; react(g, 'think'); M.inert(g, [ch.id]); const r = +ch.v.replace('−', '-');
            M.circle(g, ch, { dur: 0.3 * T, col: GOLD }); ch.col = '#8a4a10';
            const b = M.box(g, ch.id); g.sfx('swoosh');
            M.fly(g, { node: M.num(r), from: [b.x, b.y], to: [S.X(r), RUL + 16], dur: 0.4 * T, arc: -50, s0: S.ws, s1: 18, col: '#7a3a10',
              then(g) { const mk = { x: r, t0: g.t, max: dval(S.terms, r - 0.01) > 0 }; S.marks.push(mk); g.sfx('pop'); } });
            M.at(g, [
              [0.6 * T, g => { const from = S.goatX(g.t); S.walk = { from, to: r, t0: g.t, dur: 0.55 * T }; react(g, 'wow'); g.sfx('tweet'); }],
              [1.15 * T, g => { S.marks[S.marks.length - 1].flagAt = g.t; S.lastFlat = g.t; g.sfx('ding'); react(g, 'laugh'); g.burst(S.X(r), S.Y(fval(S.terms, r)), [GOLD, '#fff', '#9ae07a'], 14, 140); }],
              [1.3 * T, g => { S.point = false; }],
            ]); } }));
      },
      area(g) { return !S.work ? ['tok', 'fx'] : !S.zeroed ? ['fd'] : !S.solved ? ['wc0'] : S.chips.filter(ch => !ch.used).map(ch => ch.id).concat('ridge'); },
    });
    S.X = x => GX0 + 14 + (x - S.xr[0]) / (S.xr[1] - S.xr[0]) * (GX1 - GX0 - 28);
    S.Y = v => GB - (v - S.yr[0]) / (S.yr[1] - S.yr[0]) * (GB - GT);
    S.goatX = t => { if (S.walk) { const k = M.easeIO((t - S.walk.t0) / S.walk.dur); return M.lerp(S.walk.from, S.walk.to, k); } const mid = (S.xr[0] + S.xr[1]) / 2, half = (S.xr[1] - S.xr[0]) / 2; return mid + half * 0.78 * Math.sin(t * 0.45 - 0.6); };
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('critical_scene', scene), 0, 0, 360, 640);
    // the ridge: the graph of f, filled down to the ruler like a mountainside
    const N = 90, pts = []; for (let i = 0; i <= N; i++) { const x = S.xr[0] + (S.xr[1] - S.xr[0]) * i / N; pts.push([S.X(x), S.Y(fval(S.terms, x))]); }
    c.save(); const rg = c.createLinearGradient(0, GT, 0, RUL); rg.addColorStop(0, '#7ab060'); rg.addColorStop(1, '#4a7a40'); c.fillStyle = rg;
    c.beginPath(); c.moveTo(pts[0][0], RUL); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(pts[N][0], RUL); c.closePath(); c.fill();
    c.clip(); c.fillStyle = 'rgba(255,255,255,0.08)'; for (let i = 0; i < 12; i++) { c.beginPath(); c.ellipse(GX0 + i * 27, GB - 20 + (i % 3) * 14, 20, 6, 0.2, 0, 7); c.fill(); } c.restore();
    c.save(); c.strokeStyle = '#2e5a2e'; c.lineWidth = 3.5; c.lineJoin = 'round'; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
    c.strokeStyle = 'rgba(255,255,230,0.45)'; c.lineWidth = 1.2; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y - 2) : c.moveTo(x, y - 2)); c.stroke(); c.restore();
    // the ruler of x values along the foot of the ridge
    c.save(); c.fillStyle = '#c89858'; c.fillRect(GX0 - 6, RUL, GX1 - GX0 + 12, 12); c.fillStyle = '#e8c088'; c.fillRect(GX0 - 6, RUL, GX1 - GX0 + 12, 3);
    c.font = M.NUMF(12, 700); c.textAlign = 'center'; c.fillStyle = '#5a3a18'; c.strokeStyle = '#5a3a18'; c.lineWidth = 1.5;
    for (let x = Math.ceil(S.xr[0]); x <= S.xr[1]; x++) { const px = S.X(x); c.beginPath(); c.moveTo(px, RUL); c.lineTo(px, RUL + 5); c.stroke(); c.fillStyle = '#fff6e0'; c.fillText(String(x).replace('-', '−'), px, RUL + 24); }
    c.restore();
    // critical points: a dashed line rises from the ruler to the curve, then a flag is planted (red on a peak, blue in a valley)
    for (const mk of S.marks) { const px = S.X(mk.x), py = S.Y(fval(S.terms, mk.x)), k = M.ease((t - mk.t0) / 0.3);
      c.save(); c.setLineDash([6, 5]); c.strokeStyle = '#fff6d0'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(px, RUL); c.lineTo(px, M.lerp(RUL, py, k)); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(px, RUL + 2, 5, 0, 7); c.fill();
      if (mk.flagAt != null) { const f = M.ease((t - mk.flagAt) / 0.3), wv = Math.sin(t * 6) * 2, up = mk.max ? -1 : 1, top = py - 34 * f;
        c.strokeStyle = '#5a3a18'; c.lineWidth = 2; c.beginPath(); c.moveTo(px + 10, py - 2); c.lineTo(px + 10, top); c.stroke();
        c.fillStyle = mk.max ? RED : BLUE; c.beginPath(); c.moveTo(px + 10, top); c.lineTo(px + 26 + wv, top + 6); c.lineTo(px + 10, top + 12); c.fill();
        c.fillStyle = '#fff'; c.shadowColor = GOLD; c.shadowBlur = 10; c.beginPath(); c.arc(px, py, 5 * f, 0, 7); c.fill(); void up; }
      c.restore(); }
    // the goat on its tangent plank
    { const gx = S.goatX(t), px = S.X(gx), py = S.Y(fval(S.terms, gx)), sx = (GX1 - GX0 - 28) / (S.xr[1] - S.xr[0]), sy = (GB - GT) / (S.yr[1] - S.yr[0]);
      const ang = Math.atan(-dval(S.terms, gx) * sy / sx), flat = Math.abs(ang) < 0.03, moving = S.walk ? t - S.walk.t0 < S.walk.dur : true;
      const facing = S.walk ? (S.walk.to >= S.walk.from ? 1 : -1) : (Math.cos(t * 0.45 - 0.6) >= 0 ? 1 : -1), hop = S.lastFlat != null && t - S.lastFlat < 0.4 ? Math.sin((t - S.lastFlat) / 0.4 * Math.PI) * 12 : 0;
      c.save(); c.translate(px, py); c.rotate(ang);
      c.strokeStyle = flat ? GOLD : '#8a5a2a'; c.lineWidth = flat ? 5 : 4; c.lineCap = 'round'; if (flat) { c.shadowColor = GOLD; c.shadowBlur = 12; }
      c.beginPath(); c.moveTo(-50, -2); c.lineTo(50, -2); c.stroke(); c.shadowBlur = 0;
      P.goat(c, 0, -4 - hop - (moving ? Math.abs(Math.sin(t * 9)) * 2 : 0), 1.25, { facing }); c.restore(); }
    // the bird on its post watches, points while work is shown, and cheers
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    c.fillStyle = '#7a5030'; c.fillRect(318, 618, 12, 30); c.fillStyle = '#9a6a40'; c.fillRect(314, 614, 20, 6);
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', 324, 616 - hopK * 18, 0.95, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'bird', 324, 616, 0.95);
    // the d/dx on a wooden tag
    const tb = M.box(g, 'tok'); if (tb && !S.work) { const bob = Math.sin(t * 2.4) * 2; c.save(); c.translate(0, bob); c.fillStyle = 'rgba(40,20,10,0.3)'; c.beginPath(); c.roundRect(tb.x - 24, tb.y - 30, 52, 64, 10); c.fill();
      c.fillStyle = '#f4d9a0'; c.beginPath(); c.roundRect(tb.x - 26, tb.y - 33, 52, 64, 10); c.fill(); c.strokeStyle = '#8a5a2a'; c.lineWidth = 2.5; c.stroke(); c.restore(); c.save(); c.translate(0, bob); M.drawEx(g, c, 'tok'); c.restore(); }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work');
    fitAsk(g); M.drawUI(g, c);
  },
});
