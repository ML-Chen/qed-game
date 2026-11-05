// foil_foil.js — FOIL! Multiply two binomials: (x + a)(x + b) = x² + (a + b)x + ab.
// The player drags each term of the first bracket onto each term of the second (4 drags, any order, either direction).
// Each drag writes its product in its own place on the answer line under the brackets (x², bx, ax, ab) and draws a
// coloured arc between the two terms. Then the player drags the like terms bx and ax together; they add to (a + b)x.
// Level 0: small positive numbers. Level 1: bigger numbers. Level 2: one bracket has a minus sign.
// Medium mode: x · x, the constant product and the sum of the like terms are picked from the tray.
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL);
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
    const fill = (g, k) => { const q = S.prod[k]; q.done = true; q.at = g.t; q.n.hide = false; q.n.pop = g.t; const bx = M.box(g, 'q' + k); if (bx) g.burst(bx.x, bx.y, [COLS[k], '#fff'], 8, 110); };
    const asks = { 0: { v: M.sup(M.vr('x'), M.num(2)), wrong: [M.row(M.num(2), M.vr('x')), M.vr('x'), M.num(1)] },
      3: { v: term(a * b, 0, true), wrong: [term(a + b, 0, true), term(-a * b, 0, true), term(a * b + 1, 0, true)] } };
    M.play(g, {
      moves(g) {
        const out = [], rev = [];
        S.prod.forEach((q, k) => {
          if (q.done) return; const ask = asks[k];
          const mk = (from, to) => ({ drag: from, to, busy: 0.1, then(g) { q.started = true; S.arcT = S.arcT || {}; S.arcT[k] = g.t; g.sfx('pop'); if (!ask) fill(g, k); },
            ...(ask ? { ask, askAt: 0, after: 0.1, resolve(g) { fill(g, k); g.sfx('coin'); } } : {}) });
          if (q.started) return;
          out.push(mk('f' + q.i, 's' + q.j)); rev.push(mk('s' + q.j, 'f' + q.i));
        });
        out.push(...rev);
        if (!out.length && !S.combined && S.prod.every(q => q.done)) {
          const sum = a + b, cm = (from, to) => ({ drag: from, to, busy: 0.1, ask: { v: term(sum, 1, true), wrong: [term(Math.abs(a * b) < 10 ? a * b : sum + 1, 1, true), term(sum, 2, true), term(b - a, 1, true)] }, askAt: 0, after: 0.1,
            then(g) { S.combined = true; const n = S.prod[1].n; n.items = [M.op('+'), M.paren(M.row(M.num(b), M.op(a < 0 ? '-' : '+'), M.num(Math.abs(a)))), M.vr('x')]; tint(n, '#fff4dc'); S.prod[2].n.hide = true; n.pop = g.t; S.ans = M.row(M.op('=', 'eq'), M.gap(6), S.prod[0].n, M.gap(4), n, M.gap(4), S.prod[3].n); M.place(g, 'ans', S.ans, 180, 352, 34, { col: INK }); },
            resolve(g) { const n = term(sum, 1, false, 'q1', '#fff4dc'); n.pop = g.t; S.ans = M.row(M.op('=', 'eq'), M.gap(6), S.prod[0].n, M.gap(4), n, M.gap(4), S.prod[3].n); M.place(g, 'ans', S.ans, 180, 352, 38, { col: INK }); g.sfx('coin'); const bx = M.box(g, 'q1'); if (bx) g.burst(bx.x, bx.y, ['#fff4dc', '#ffd27a'], 12, 130); } });
          if (S.prod.every(q => q.done)) out.push(cm('q1', 'q2'), cm('q2', 'q1'));
        }
        return out;
      },
      area(g) { const q = S.prod.find(q => !q.started); return q ? ['f' + q.i, 's' + q.j] : ['q1', 'q2']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s; SCN.std(g, c, { scene: 'desert', panel: PANEL, host: 'hedgehog', hostX: 292, hostY: 586, hostS: 1.3 });
    // the FOIL arcs: one coloured rainbow per product, from a term of the first bracket to a term of the second
    const H = [30, 46, 16, 30];
    for (const [k, t0] of Object.entries(S.arcT || {})) {
      const q = S.prod[k], A = M.box(g, 'f' + q.i), B = M.box(g, 's' + q.j); if (!A || !B) continue;
      const e = M.ease((g.t - t0) / 0.25), y0 = Math.min(A.y - A.h / 2, B.y - B.h / 2) - 4, x0 = A.x + (q.j - 0.5) * 6, x1 = B.x + (q.i - 0.5) * 6, h = H[k];
      c.save(); c.strokeStyle = COLS[k]; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = 'rgba(40,20,0,0.4)'; c.shadowBlur = 4;
      c.beginPath(); for (let u = 0; u <= e + 1e-6; u += 0.05) { const x = M.lerp(x0, x1, u), y = y0 - Math.sin(u * Math.PI) * h; u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
    }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'ans');
    M.drawUI(g, c);
  },
});
