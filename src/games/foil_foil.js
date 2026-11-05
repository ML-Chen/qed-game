// foil_foil.js — FOIL! Multiply two binomials: (x + a)(x + b) = x² + (a + b)x + ab.
// The player drags each term of the first bracket onto each term of the second (4 drags, any order, either direction),
// then drags the like terms bx and ax together; they add to (a + b)x.
// Show your work: on each product the two terms swell in that product's colour and a rainbow arc draws itself between
// them; copies of the two terms fly down and meet as a working note ("x · 3"), "= 3x" writes itself (the tray asks for
// x · x and the constant product in medium mode), and the product drops into its own place on the answer line. On the
// combine, the like terms are circled, the note "3x + 2x = 5x" writes itself above them, the two terms slide together
// and fade, and 5x drops into their place. The hedgehog points at the board while the work is shown and hops on beats.
// Level 0: small positive numbers. Level 1: bigger numbers. Level 2: one bracket has a minus sign.
// Medium mode: x · x, the constant product and the sum of the like terms are picked from the tray.
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), NY = 313, NS = 26, SUMC = '#fff4dc', HX = 292, HY = 586;
const COLS = ['#ffd27a', '#9ae0ff', '#ffb8d0', '#b8f0a0']; // one colour per product and its arc
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  for (;;) {
    let a = L === 0 ? 1 + r(4) : 2 + r(6), b = L === 0 ? 1 + r(4) : 2 + r(6);
    if (L === 2) { if (g.rand() < 0.5) a = -a; else b = -b; }
    if (a !== b && a + b !== 0) return [a, b];
  }
}
function tint(n, col) { if (!n) return n; n.col = col; for (const ch of [n.base, n.exp, n.inner, ...(n.items || [])]) tint(ch, col); return n; }
// a signed term c·x^p; the first term of a line has no leading "+"
function term(c, p, first, id, col) {
  const A = Math.abs(c), body = p === 0 ? [M.num(A)] : [A === 1 ? null : M.num(A), A === 1 ? null : M.gap(2), p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(p))];
  const r = M.row(first ? (c < 0 ? M.op('-') : null) : M.op(c < 0 ? '-' : '+'), ...body); r.id = id; return col ? tint(r, col) : r;
}
// a factor as it is written in a working note: x, a number, or a negative number in brackets when it comes second
const factor = (c, p, second) => p === 1 ? M.vr('x') : c < 0 && second ? M.paren(M.num(c)) : M.num(c);
function leaves(n, out = []) { if (!n) return out; if (!n.items && !n.inner && !n.base) out.push(n); for (const ch of [n.base, n.exp, n.inner, ...(n.items || [])]) leaves(ch, out); return out; }
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
// a working note on the line between the brackets and the answer, its left part centred over x (kept on the board)
function placeNote(g, key, nd, left, x, col) {
  const w = M.lay(nd, NS).w, wl = M.lay(left, NS).w, x0 = M.clamp(x - wl / 2, 26, 334 - w);
  M.place(g, key, nd, x0, NY, NS, { col, left: true });
}

MG.add({
  id: 'foil', stage: 'foil', cmd: 'FOIL!', hint: 'drag', time: 10, winText: 'Multiplied!', hold: 1.4,
  card: {
    title: 'Multiplying binomials', ref: 'Algebra 1', kind: 'Algebra',
    text: 'A binomial is an expression with two terms, such as x + 2. A term is one piece of an expression that is added on, such as x or 2.\n\nTo multiply two binomials, multiply every term of the first by every term of the second. That makes four products. Then add up the like terms, which are terms with the same power of x.\n\nFor example, (x + 2)(x + 3) gives x · x = x², x · 3 = 3x, 2 · x = 2x and 2 · 3 = 6. The like terms 3x and 2x add up to 5x, so the answer is x² + 5x + 6.\n\nThis works because of the distributive law: each part of the first bracket must be multiplied by the whole second bracket. FOIL names the four products: First, Outer, Inner, Last.',
    note: 'Multiply each term of the first bracket by each term of the second: four products. Then combine the like terms: (x + a)(x + b) = x² + (a + b)x + ab.',
    ask: 'What is (x + 1)(x + 4)? What is (x − 2)(x + 5)?',
  },

  init(g) {
    const S = g.s; M.setup(g); const [a, b] = pick(g); S.a = a; S.b = b;
    const F = [{ c: 1, p: 1 }, { c: a, p: 0 }], G = [{ c: 1, p: 1 }, { c: b, p: 0 }]; S.F = F; S.G = G;
    const br = (T, k) => M.paren(M.row(M.vr('x', k + '0'), M.gap(2), tint(term(T[1].c, 0, false, k + '1'), INK)), 'p' + k);
    S.top = M.row(br(F, 'f'), br(G, 's'));
    S.prod = [0, 1, 2, 3].map(k => { const i = k >> 1, j = k & 1, c = F[i].c * G[j].c, p = F[i].p + G[j].p; const n = term(c, p, k === 0, 'q' + k, COLS[k]); n.hide = true; return { i, j, c, p, n, done: false }; });
    S.ans = M.row(M.op('=', 'eq'), M.gap(6), S.prod.flatMap((q, k) => [k ? M.gap(4) : null, q.n]));
    M.place(g, 'top', S.top, 180, 270, 46, { col: INK }); M.place(g, 'ans', S.ans, 180, 352, 34, { col: INK });
    M.inert(g, ['pf', 'ps', 'eq']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    const fill = (g, k) => { const q = S.prod[k]; q.done = true; q.at = g.t; q.n.hide = false; q.n.pop = g.t; const bx = M.box(g, 'q' + k); if (bx) g.burst(bx.x, bx.y, [COLS[k], '#fff'], 10, 120); };
    const asks = { 0: { v: M.sup(M.vr('x'), M.num(2)), wrong: [M.row(M.num(2), M.vr('x')), M.vr('x'), M.num(1)] },
      3: { v: term(a * b, 0, true), wrong: [term(a + b, 0, true), term(-a * b, 0, true), term(a * b + 1, 0, true)] } };
    S.arcT = {}; S.arcD = {};
    // one product: the two terms light up, an arc joins them, their copies fly into the note "x · 3", then "= 3x"
    const product = (k, from, to) => { const q = S.prod[k], ask = asks[k], key = 'note' + k;
      const mv = { drag: from, to, busy: 0.1, ...(ask ? { ask } : {}), askAt: 0.55 * M.pace(g), after: 0.75 * M.pace(g),
        then(g) { const T = M.pace(g); q.started = true; M.show(g, 0.55 * T); S.arcT[k] = g.t; S.arcD[k] = 0.45 * T; hop(g, 'think'); g.sfx('swoosh');
          const A = 'f' + q.i, B = 's' + q.j;
          M.indicate(g, A, { col: COLS[k], dur: 0.4 * T, sc: 1.2 }); M.indicate(g, B, { col: COLS[k], dur: 0.4 * T, sc: 1.2, delay: 0.1 * T });
          const fa = factor(F[q.i].c, F[q.i].p, false), fb = factor(G[q.j].c, G[q.j].p, true), dot = M.op('·', null, { alpha: 0 });
          const eqn = M.op('=', null, { alpha: 0 }), res = term(q.c, q.p, true, 'r' + k); res.alpha = 0;
          fa.id = 'na' + k; fb.id = 'nb' + k; fa.alpha = 0; fb.alpha = 0; S.nt = { fa, fb, dot, eqn, res, key };
          const left = M.row(fa, dot, fb), nd = M.row(left, eqn, res); placeNote(g, key, nd, left, M.box(g, 'q' + k).x, COLS[k]);
          [[A, fa, F[q.i], false, 0.05], [B, fb, G[q.j], true, 0.15]].forEach(([src, dst, f, second, d]) => {
            // a constant flies from its digits (the right end of "+ 3"), not from the middle of the signed term
            const sb = M.box(g, src), w = f.p ? 0 : M.lay(M.num(f.c), sb.s).w, from = f.p ? src : [sb.x + sb.w / 2 - w / 2, sb.y];
            M.fly(g, { node: factor(f.c, f.p, second), from, to: dst.id, s0: sb.s, delay: d * T, dur: 0.36 * T, arc: -18, s1: NS, col: COLS[k],
              then(g) { dst.alpha = 1; dst.pop = g.t; g.sfx('tap'); } }); });
          M.at(g, [[0.45 * T, g => { dot.alpha = 1; M.writeIn(g, dot, { dur: 0.1 * T }); }]]);
          if (!ask) M.at(g, [[0.55 * T, g => mv.resolve(g)]]); },
        resolve(g) { const T = M.pace(g), N = S.nt; M.show(g, 0.75 * T); N.eqn.alpha = 1; N.res.alpha = 1;
          M.writeIn(g, N.eqn, { dur: 0.1 * T }); M.writeIn(g, N.res, { delay: 0.08 * T, dur: 0.2 * T }); M.indicate(g, N.res, { delay: 0.28 * T, dur: 0.25 * T, sc: 1.25 }); g.sfx('ding');
          M.at(g, [[0.42 * T, g => { // the product drops into its own place on the answer line
              const nb = M.box(g, N.res.id); N.res.alpha = 0; M.tween(g, g.s.mk.ex[N.key].node, { alpha: 0 }, 0.2 * T);
              M.fly(g, { node: term(q.c, q.p, k === 0, null, COLS[k]), from: nb ? [nb.x, nb.y] : N.res.id, to: 'q' + k, dur: 0.3 * T, arc: -12, s0: NS, s1: 34,
                then(g) { fill(g, k); g.sfx('pop'); hop(g, k === 3 ? 'laugh' : 'happy'); } }); }],
            [0.75 * T, g => { delete g.s.mk.ex[N.key]; }]]); } };
      return mv; };
    // the like terms: "3x + 2x = 5x" above them, they slide together and 5x drops into their place
    const combine = (from, to) => { const sum = a + b;
      return { drag: from, to, busy: 0.1, askAt: 0.55 * M.pace(g), after: 0.85 * M.pace(g),
        ask: { v: term(sum, 1, true), wrong: [term(Math.abs(a * b) < 10 ? a * b : sum + 1, 1, true), term(sum, 2, true), term(b - a, 1, true)] },
        then(g) { const T = M.pace(g); S.combined = true; M.show(g, 0.55 * T); hop(g, 'think'); g.sfx('swoosh');
          M.circle(g, ['q1', 'q2'], { col: SUMC, dur: 0.5 * T }); M.light(g, 'q1', { col: SUMC }); M.light(g, 'q2', { col: SUMC });
          const t1 = term(S.prod[1].c, 1, true, null, COLS[1]), t2 = term(S.prod[2].c, 1, false, null, COLS[2]);
          const eqn = M.op('=', null, { alpha: 0 }), res = term(sum, 1, true, 'cr', SUMC); res.alpha = 0; S.cn = { eqn, res };
          const left = M.row(t1, M.gap(2), t2), nd = M.row(left, eqn, res), u = M.unionBox([M.box(g, 'q1'), M.box(g, 'q2')]);
          placeNote(g, 'noteC', nd, left, u.x, SUMC); M.writeIn(g, t1, { delay: 0.1 * T, dur: 0.2 * T }); M.writeIn(g, t2, { delay: 0.28 * T, dur: 0.22 * T }); },
        resolve(g) { const T = M.pace(g), N = S.cn; M.show(g, 0.85 * T); N.eqn.alpha = 1; N.res.alpha = 1;
          M.writeIn(g, N.eqn, { dur: 0.1 * T }); M.writeIn(g, N.res, { delay: 0.08 * T, dur: 0.2 * T }); M.indicate(g, N.res, { delay: 0.28 * T, dur: 0.25 * T, sc: 1.25 }); g.sfx('ding');
          M.at(g, [
            [0.35 * T, g => { // the two like terms slide together and fade
              const b1 = M.box(g, 'q1'), b2 = M.box(g, 'q2'), mid = (b1.x + b2.x) / 2;
              M.tween(g, S.prod[1].n, { dx: mid - b1.x, alpha: 0 }, 0.25 * T); M.tween(g, S.prod[2].n, { dx: mid - b2.x, alpha: 0 }, 0.25 * T); g.sfx('swoosh'); }],
            [0.6 * T, g => { // the line is rewritten with the sum in their place, and the sum drops in from the note
              for (const q of [S.prod[1], S.prod[2]]) for (const l of leaves(q.n)) l.alpha = 0;
              const nb = { ...M.box(g, 'cr') }; N.res.alpha = 0; M.tween(g, g.s.mk.ex.noteC.node, { alpha: 0 }, 0.2 * T);
              const nt = term(sum, 1, false, 'q1', SUMC); nt.alpha = 0;
              S.ans = M.row(S.ans.items[0], M.gap(6), S.prod[0].n, M.gap(4), nt, M.gap(4), S.prod[3].n); M.place(g, 'ans', S.ans, 180, 352, 34, { col: INK });
              M.fly(g, { node: term(sum, 1, false, null, SUMC), from: [nb.x, nb.y], to: 'q1', dur: 0.28 * T, arc: -12, s0: NS, s1: 34,
                then(g) { nt.alpha = 1; nt.pop = g.t; const bx = M.box(g, 'q1'); if (bx) g.burst(bx.x, bx.y, [SUMC, '#ffd27a', '#fff'], 14, 140); g.sfx('coin'); hop(g, 'laugh'); } }); }],
            [0.85 * T, g => { delete g.s.mk.ex.noteC; }]]); } }; };
    M.play(g, {
      moves(g) {
        const out = [], rev = [];
        S.prod.forEach((q, k) => { if (q.started) return; out.push(product(k, 'f' + q.i, 's' + q.j)); rev.push(product(k, 's' + q.j, 'f' + q.i)); });
        out.push(...rev);
        if (!out.length && !S.combined && S.prod.every(q => q.done)) out.push(combine('q1', 'q2'), combine('q2', 'q1'));
        return out;
      },
      area(g) { const q = S.prod.find(q => !q.started); return q ? ['f' + q.i, 's' + q.j] : ['q1', 'q2']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s; SCN.std(g, c, { scene: 'desert', panel: PANEL });
    // the hedgehog points at the board while the work is shown, and hops when a step lands
    const mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && g.t - mk.missAt < 0.7;
    const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', HX, HY - hk * 24, 1.3, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, 'hedgehog', HX, HY, 1.3);
    // the FOIL arcs: one coloured rainbow per product, from a term of the first bracket to a term of the second
    const H = [30, 46, 16, 30];
    for (const [k, t0] of Object.entries(S.arcT || {})) {
      const q = S.prod[k], A = M.box(g, 'f' + q.i), B = M.box(g, 's' + q.j); if (!A || !B) continue;
      const e = M.easeIO((g.t - t0) / (S.arcD[k] || 0.25)), y0 = Math.min(A.y - A.h / 2, B.y - B.h / 2) - 4, x0 = A.x + (q.j - 0.5) * 6, x1 = B.x + (q.i - 0.5) * 6, h = H[k];
      c.save(); c.strokeStyle = COLS[k]; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = 'rgba(40,20,0,0.4)'; c.shadowBlur = 4;
      c.beginPath(); for (let u = 0; u <= e + 1e-6; u += 0.05) { const x = M.lerp(x0, x1, u), y = y0 - Math.sin(u * Math.PI) * h; u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
    }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'ans'); for (const key of Object.keys(mk.ex)) if (key.startsWith('note')) M.drawEx(g, c, key);
    M.drawUI(g, c);
  },
});
