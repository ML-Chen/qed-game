// complex_mult.js — COMPLEX MULT! (a + bi)(c + di) = ac + adi + bci + bdi² = (ac − bd) + (ad + bc)i.
// On a sheet of paper over a city at sunset. The player drags each term of the first bracket onto each term of the
// second (4 drags, any order, either direction); each product appears in its own place on the line underneath, with a
// coloured arc between the two terms. Then: tap the i² term (i² = −1, so it becomes a real number), drag the two i terms
// together (they add), and drag the two real numbers together (they add). Any valid order works.
// Level 0: (a + i)(c + i). Level 1: (a + bi)(c + di). Level 2: the first bracket has a minus: (a − bi)(c + di).
// Medium mode: the real product ac, the i² term and both sums are picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL);
const COLS = ['#c8402a', '#2a74b0', '#8a3ab0', '#2a8a4a'];
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  for (;;) {
    const a = 1 + r(4), c = 1 + r(4); let b = L === 0 ? 1 : 2 + r(2), d = L === 0 ? 1 : 1 + r(3);
    if (L === 2) b = -b;
    if (a * c - b * d !== 0 && a * d + b * c !== 0 && !(a === c && b === d && L === 0 && g.rand() < 0.6)) return { a, b, c, d };
  }
}
function tint(n, col) { if (!n) return n; n.col = col; for (const ch of [n.base, n.exp, n.inner, ...(n.items || [])]) tint(ch, col); return n; }
// a signed term: kind 0 is a real number, 1 is a multiple of i, 2 a multiple of i²; the first term of a line has no "+"
function term(v, kind, first, id, col) {
  const A = Math.abs(v), I = () => M.vr('i');
  const body = kind === 0 ? [M.num(A)] : [A === 1 ? null : M.num(A), kind === 1 ? I() : M.sup(I(), M.num(2))];
  const r = M.row(first ? (v < 0 ? M.op('-') : null) : M.op(v < 0 ? '-' : '+'), ...body); r.id = id; return col ? tint(r, col) : r;
}
const cnum = (re, im) => M.row(term(re, 0, true), term(im, 1, false)); // re + im·i as a tray tile

MG.add({
  id: 'complex_mult', stage: 'complex', cmd: 'COMPLEX MULT!', hint: 'drag', time: 7, mood: 'bright', winText: 'Multiplied!', hold: 1.4,
  card: {
    title: 'Multiplying complex numbers', ref: 'Algebra 2', kind: 'Complex numbers',
    text: 'A complex number has a real part and an imaginary part, such as 2 + i. Here i is the number whose square is −1.\n\nTo multiply two complex numbers, multiply each part of the first by each part of the second, the same way you multiply two binomials. That makes four products. Then replace i² with −1. Last, add the real numbers together and the multiples of i together.\n\nFor example, (2 + i)(3 + i) = 6 + 2i + 3i + i². Since i² = −1, this is 6 + 2i + 3i − 1, which is 5 + 5i.\n\nThis works because complex numbers follow the same rules as ordinary numbers, such as the distributive law. The only new rule is i² = −1.',
    note: '(a + bi)(c + di) = ac + adi + bci + bdi². Replace i² with −1 to get (ac − bd) + (ad + bc)i.',
    ask: 'What is (1 + i)(1 + i)? What is (3 + 2i)(1 − i)?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = pick(g); Object.assign(S, p);
    const F = [[p.a, 0], [p.b, 1]], G = [[p.c, 0], [p.d, 1]];
    const br = (T, k) => M.paren(M.row(M.num(T[0][0], k + '0'), M.gap(2), term(T[1][0], 1, false, k + '1', INK)), 'p' + k);
    S.top = M.row(br(F, 'f'), br(G, 's'));
    S.prod = [0, 1, 2, 3].map(k => { const i = k >> 1, j = k & 1, v = F[i][0] * G[j][0], kind = F[i][1] + G[j][1]; const n = term(v, kind, k === 0, 'q' + k, COLS[k]); n.hide = true; return { i, j, v, kind, n }; });
    const relay = () => { S.ans = M.row(M.op('=', 'eq'), M.gap(6), S.prod.flatMap((q, k) => q.gone ? [] : [k ? M.gap(4) : null, q.n])); M.place(g, 'ans', S.ans, 180, 352, 32, { col: INK }); };
    relay(); M.place(g, 'top', S.top, 180, 268, 44, { col: INK });
    M.inert(g, ['pf', 'ps', 'eq']);
    g.dur *= (2.6 + 1.05 * 7) / 8;
    const pop = (g, k, cols) => { const q = S.prod[k]; q.n.hide = false; q.n.pop = g.t; relay(); const bx = M.box(g, 'q' + k); if (bx) g.burst(bx.x, bx.y, cols || [COLS[k], '#fff'], 8, 110); };
    const set = (k, v, kind) => { const q = S.prod[k]; q.v = v; q.kind = kind; q.n = term(v, kind, k === 0, 'q' + k, COLS[k]); };
    M.play(g, {
      moves(g) {
        const out = [], rev = [], P = S.prod;
        // the four products, each term of the first bracket onto each term of the second (either direction)
        P.forEach((q, k) => {
          if (q.started) return;
          const ask = k === 0 ? { v: q.v, wrong: [S.a + S.c, q.v + 1, -q.v] } : null;
          const mk = (from, to) => ({ drag: from, to, busy: 0.1, then(g) { q.started = true; (S.arcT = S.arcT || {})[k] = g.t; g.sfx('pop'); if (!ask) { q.done = true; pop(g, k); } },
            ...(ask ? { ask, askAt: 0, after: 0.1, resolve(g) { q.done = true; pop(g, k); g.sfx('coin'); } } : {}) });
          out.push(mk('f' + q.i, 's' + q.j)); rev.push(mk('s' + q.j, 'f' + q.i));
        });
        out.push(...rev);
        // i² = −1: the i² term becomes a real number
        if (P[3].done && P[3].kind === 2) out.push({ tap: 'q3', busy: 0.1, askAt: 0, after: 0.1, ask: { v: term(-P[3].v, 0, true), wrong: [term(P[3].v, 0, true), term(-P[3].v, 1, true), term(P[3].v * 2, 0, true)] },
          then() {}, resolve(g) { set(3, -P[3].v, 0); g.sfx('sparkle'); pop(g, 3, ['#ffd970', '#fff']); } });
        // like terms: the two multiples of i add, and the two real numbers add
        if (P[1].done && P[2].done && !P[2].gone) {
          const sum = P[1].v + P[2].v, mk = (a, b) => ({ drag: a, to: b, busy: 0.1, askAt: 0, after: 0.1, ask: { v: term(sum, 1, true), wrong: [term(P[1].v * P[2].v, 1, true), term(sum, 2, true), term(P[1].v - P[2].v, 1, true)] },
            then() {}, resolve(g) { P[2].gone = true; set(1, sum, 1); g.sfx('coin'); pop(g, 1); } });
          out.push(mk('q1', 'q2'), mk('q2', 'q1'));
        }
        if (P[0].done && P[3].done && P[3].kind === 0 && !P[3].gone) {
          const sum = P[0].v + P[3].v, mk = (a, b) => ({ drag: a, to: b, busy: 0.1, askAt: 0, after: 0.1, ask: { v: term(sum, 0, true), wrong: [term(P[0].v - P[3].v, 0, true), term(P[0].v * P[3].v, 0, true), term(sum + 1, 0, true)] },
            then() {}, resolve(g) { P[3].gone = true; set(0, sum, 0); g.sfx('coin'); pop(g, 0); } });
          out.push(mk('q3', 'q0'), mk('q0', 'q3'));
        }
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || [m.drag, m.to]) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s; SCN.std(g, c, { scene: 'city', panel: PANEL, panelY: 300, panelH: 196, host: 'fox', hostX: 290, hostY: 600, hostS: 1.3 });
    // one coloured arc per product, from a term of the first bracket to a term of the second
    const HH = [30, 46, 16, 30];
    for (const [k, t0] of Object.entries(S.arcT || {})) {
      const q = S.prod[k], A = M.box(g, 'f' + q.i), B = M.box(g, 's' + q.j); if (!A || !B) continue;
      const e = M.ease((g.t - t0) / 0.25), y0 = Math.min(A.y - A.h / 2, B.y - B.h / 2) - 4, x0 = A.x + (q.j - 0.5) * 6, x1 = B.x + (q.i - 0.5) * 6;
      c.save(); c.strokeStyle = COLS[k]; c.globalAlpha = 0.8; c.lineWidth = 3.5; c.lineCap = 'round';
      c.beginPath(); for (let u = 0; u <= e + 1e-6; u += 0.05) { const x = M.lerp(x0, x1, u), y = y0 - Math.sin(u * Math.PI) * HH[k]; u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
    }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'ans');
    M.drawUI(g, c);
  },
});
