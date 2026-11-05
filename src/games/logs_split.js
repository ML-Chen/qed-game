// logs_split.js — LOG RULES! Split a logarithm with the product, quotient and power rules (log is base 10 here).
// Drag the log onto the factors inside: log(100x) becomes log 100 + log x (a quotient gives a difference). Tap log 100
// to compute it (2). If x has an exponent, drag the exponent in front of its log: log x³ becomes 3 log x.
// Level 0: log(Nx). Level 1: log(x/N) or log(N/x). Level 2: a product or quotient with x², x³ or x⁴.
// Medium mode: tapping log N opens the tray.
const M = MK, INK = SCN.ink('chalk'), LOGC = '#ffd27a', XC = '#9ad8ff';
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), N = [10, 100, 1000][r(L === 0 ? 2 : 3)];
  const form = L === 0 ? 'mul' : L === 1 ? 'div' : r(2) ? 'mul' : 'div';
  return { N, form, xTop: form === 'mul' || r(2) === 0, k: L === 2 ? 2 + r(3) : 1, v: L === 0 ? 'x' : ['x', 'y'][r(2)] };
}
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] }), lw = id => M.txt('log', id, { col: LOGC });
  const xn = () => S.k > 1 ? M.sup(M.vr(S.v, 'x', { col: XC }), M.num(S.k, 'k')) : M.vr(S.v, 'x', { col: XC });
  const mk = () => {
    if (!S.split) {
      const inner = S.form === 'mul' ? M.row(M.num(S.N, 'N'), xn()) : S.xTop ? M.frac(xn(), M.num(S.N, 'N')) : M.frac(M.num(S.N, 'N'), xn());
      return M.row(lw('log'), M.paren(inner, 'par'));
    }
    const LN = S.nv ? M.num(Math.round(Math.log10(S.N)), 'nv', pp('nv')) : Object.assign(M.row(lw(), M.gap(6), M.num(S.N)), { id: 'LN', ...pp('LN') });
    const LX = S.pw ? M.row(M.num(S.k, "kf", pp("kf")), M.gap(12), lw('lx'), M.gap(6), M.vr(S.v, 'x', { col: XC })) : M.row(lw('lx'), M.gap(6), xn());
    if (S.form === 'mul') return M.row(LN, M.op('+', 'opr'), LX);
    return S.xTop ? M.row(LX, M.op('-', 'opr'), LN) : M.row(LN, M.op('-', 'opr'), LX);
  };
  let s = 60; while (s > 34 && M.lay(mk(), s).w > 318) s -= 4;
  M.place(g, 'ex', mk(), 180, 306, s, { col: INK });
}

MG.add({
  id: 'split', stage: 'logs', cmd: 'LOG RULES!', hint: 'drag', time: 8, mood: 'night', winText: 'Split!', hold: 1.4,
  card: {
    title: 'Logarithm rules', ref: 'Algebra 2', kind: 'Logarithms',
    text: 'In this game, log means the logarithm with base 10. log 100 = 2, because 10² = 100.\n\nThree rules split a logarithm into simpler pieces. The log of a product is the sum of the logs: log(ab) = log a + log b. The log of a quotient is a difference: log(a/b) = log a − log b. An exponent inside the log comes out in front: log(a³) = 3 log a.\n\nFor example, log(100x) = log 100 + log x = 2 + log x.\n\nThe rules work because a logarithm is an exponent, and exponents add when powers of 10 are multiplied: 10ᵐ · 10ⁿ = 10ᵐ⁺ⁿ.',
    note: 'log(ab) = log a + log b, log(a/b) = log a − log b, and log(aⁿ) = n log a.',
    ask: 'Split log(1000y) into simple pieces. Write log(x⁴) using log x.',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.pops = {};
    build(g); M.inert(g, ['par', 'opr']);
    g.dur *= (2.6 + 1.05 * (S.k > 1 ? 3 : 2)) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffd27a', '#9ad8ff', '#fff'], 10, 120); };
    M.play(g, {
      moves(g) {
        const out = [], n = Math.round(Math.log10(S.N));
        // drag the log onto the factors inside the brackets: one log for each factor
        if (!S.split) out.push({ drag: 'log', to: ['N', 'x', 'k', 'par'], busy: 0.1, then(g) { S.split = true; S.pops.LN = g.t; g.sfx('pop'); build(g); burst('LN'); } });
        else {
          if (!S.nv) out.push({ tap: 'LN', busy: 0.1, askAt: 0, after: 0.1, ask: { v: n, wrong: [S.N / 10, S.N, n + 1, 10] },
            then() {}, resolve(g) { S.nv = true; S.pops.nv = g.t; g.sfx('coin'); build(g); burst('nv'); } });
          // the power rule: drag the exponent down in front of its log
          if (S.k > 1 && !S.pw) out.push({ drag: 'k', to: ['lx'], busy: 0.1, then(g) { S.pw = true; S.pops.kf = g.t; g.sfx('pop'); build(g); burst('kf'); } });
        }
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'library', panel: 'chalk', host: 'fox', hostX: 290, hostY: 592, hostS: 1.4 });
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
