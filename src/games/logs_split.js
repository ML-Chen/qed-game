// logs_split.js — LOG RULES! Split a logarithm with the product, quotient and power rules (log is base 10 here).
// Drag the log onto the factors inside: log(100x) becomes log 100 + log x (a quotient gives a difference). Tap log 100
// to compute it (2). If x has an exponent, drag the exponent in front of its log: log x³ becomes 3 log x.
// Show your work: on the split, each factor inside the brackets is circled in turn, the brackets melt away, a second
// "log" peels off the first and flies to the other factor, and the + (or −, where the fraction bar was) writes itself
// between them. On log 100, the note "10^? = 100" writes itself under it, the 2 fills in (the tray asks for it in
// medium mode) and flies up as log 100 shrinks into it. On the power rule, the exponent hops down in front of its log.
// Level 0: log(Nx). Level 1: log(x/N) or log(N/x). Level 2: a product or quotient with x², x³ or x⁴.
const M = MK, INK = SCN.ink('chalk'), LOGC = '#ffd27a', XC = '#9ad8ff', NC = '#ffb0c8', HX = 290, HY = 592;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), N = [10, 100, 1000][r(L === 0 ? 2 : 3)];
  const form = L === 0 ? 'mul' : L === 1 ? 'div' : r(2) ? 'mul' : 'div';
  return { N, form, xTop: form === 'mul' || r(2) === 0, k: L === 2 ? 2 + r(3) : 1, v: L === 0 ? 'x' : ['x', 'y'][r(2)] };
}
// leaf symbols are made once and reused (so they glide when the line is rewritten); wrappers are made fresh each time
function build(g) {
  const S = g.s;
  const xn = () => S.k > 1 && !S.pw ? M.sup(S.xv, S.kn, 'xk') : S.xv;
  // the original log stays with the first factor; the copy that peels off goes to the second
  const nFirst = S.form === 'mul' || !S.xTop; S.lgN = S.split && !nFirst ? S.lg2 : S.lg; S.lgX = S.lgN === S.lg ? S.lg2 : S.lg;
  if (S.split) { S.lgN.id = 'ln'; S.lgX.id = 'lx'; } else { S.lg.id = 'log'; S.lg2.id = 'ln2'; }
  const mk = () => {
    if (!S.split) {
      const inner = S.form === 'mul' ? M.row(S.Nn, xn()) : S.xTop ? M.frac(xn(), S.Nn) : M.frac(S.Nn, xn());
      return M.row(S.lg, M.paren(inner, 'par'));
    }
    const LN = S.nv ? S.nvN : Object.assign(M.row(S.lgN, M.gap(6), S.Nn), { id: 'LN' });
    const LX = S.pw ? M.row(S.kn, M.gap(12), S.lgX, M.gap(6), S.xv) : M.row(S.lgX, M.gap(6), xn());
    if (S.form === 'mul') return M.row(LN, S.op, LX);
    return S.xTop ? M.row(LX, S.op, LN) : M.row(LN, S.op, LX);
  };
  let s = 60; while (s > 34 && M.lay(mk(), s).w > 318) s -= 4;
  M.place(g, 'ex', mk(), 180, 306, s, { col: INK });
}
// the fox hops on each beat and points at the board while the work is shown
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c) {
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && g.t - mk.missAt < 0.7;
  const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', HX, HY - hk * 24, 1.4, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', HX, HY, 1.4);
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
    const S = g.s; M.setup(g); Object.assign(S, gen(g));
    S.lg = M.txt('log', 'log', { col: LOGC }); S.lg2 = M.txt('log', 'ln', { col: LOGC }); S.Nn = M.num(S.N, 'N'); S.xv = M.vr(S.v, 'x', { col: XC });
    S.kn = M.num(S.k, 'k'); S.op = M.op(S.form === 'mul' ? '+' : '-', 'opr'); S.n = Math.round(Math.log10(S.N)); S.nvN = M.num(S.n, 'nv', { _born: -1 });
    build(g); M.inert(g, ['par', 'opr', 'ln', 'ln2', 'xk', 'nv']);
    g.dur *= (2.6 + 1.05 * (S.k > 1 ? 3 : 2)) / 8;
    M.play(g, {
      moves(g) {
        const out = [], n = S.n, T = M.pace(g);
        // drag the log onto the factors inside the brackets: one log for each factor
        if (!S.split) out.push({ drag: 'log', to: ['N', 'x', 'k', 'par'], busy: 0.1, then(g) {
          M.show(g, 1.35 * T); hop(g, 'think'); const facs = [S.Nn, S.k > 1 ? 'xk' : S.xv];
          M.circle(g, 'N', { col: NC, dur: 0.4 * T }); M.circle(g, S.k > 1 ? 'xk' : 'x', { col: XC, dur: 0.4 * T, delay: 0.18 * T });
          M.indicate(g, S.Nn, { col: NC, dur: 0.3 * T }); M.indicate(g, S.xv, { col: XC, dur: 0.3 * T, delay: 0.18 * T }); M.at(g, [[0.18 * T, g => g.sfx('tap')]]);
          M.at(g, [[0.55 * T, g => { // the brackets melt, the factors move apart and each gets its own log
              const from = { ...M.box(g, 'log') }; S.split = true; S.lg2.alpha = 0; S.op.alpha = 0; build(g); g.sfx('swoosh'); hop(g);
              const to = S.lg2.id; // the second log (on whichever factor comes second)
              M.fly(g, { node: M.txt('log', null, { col: LOGC }), from: [from.x, from.y], to, dur: 0.4 * T, arc: -46, s0: from.s, s1: (M.box(g, to) || {}).s,
                then(g) { S.lg2.alpha = 1; S.lg2.pop = g.t; M.sparkle(g, to, { cols: [LOGC, '#fff'], n: 8 }); g.sfx('pop'); } }); }],
            [1.0 * T, g => { S.op.alpha = 1; M.writeIn(g, S.op, { dur: 0.25 * T }); M.indicate(g, S.op, { delay: 0.1 * T, dur: 0.3 * T, sc: 1.4 }); g.sfx('tap'); hop(g, 'happy'); }]]); } });
        else {
          // log 10ⁿ = n, because 10ⁿ = N: the note asks "10^? = 100" and the answer flies up into the line
          if (!S.nv) out.push({ tap: 'LN', busy: 0.1, askAt: 0.6 * T, after: 1.0 * T, ask: { v: n, wrong: [S.N / 10, S.N, n + 1, 10] },
            then(g) { M.show(g, 0.6 * T); hop(g, 'think'); M.circle(g, 'LN', { col: LOGC, dur: 0.45 * T });
              const b = M.box(g, 'LN'); S.q = M.num('?', 'nq', { col: LOGC }); // the ? rolls over to the answer
              S.note = M.row(M.sup(M.num(10), S.q), M.op('='), M.num(S.N)); S.note.id = 'note';
              M.place(g, 'note', S.note, M.clamp(b.x, 100, 236), 386, 34, { col: INK }); M.writeIn(g, S.note, { dur: 0.4 * T, delay: 0.1 * T }); },
            resolve(g) { M.show(g, 1.0 * T); M.roll(g, S.q, n, { dur: 0.25 * T }); M.relayout(g, 'note'); M.indicate(g, S.q, { delay: 0.2 * T, dur: 0.3 * T, sc: 1.5 }); g.sfx('ding');
              M.at(g, [[0.4 * T, g => { const from = { ...M.box(g, 'nq') }, lb = M.box(g, 'LN');
                  M.tween(g, S.lgN, { alpha: 0, sc: 0.6 }, 0.25 * T); M.tween(g, S.Nn, { alpha: 0, sc: 0.6 }, 0.25 * T); S.q.alpha = 0; S.nvN.alpha = 0;
                  M.fly(g, { node: M.num(n, null, { col: LOGC }), from: [from.x, from.y], to: lb ? [lb.x, lb.y] : 'LN', dur: 0.35 * T, arc: 30, s0: from.s, s1: lb ? lb.s : 40,
                    then(g) { S.nv = true; S.nvN.alpha = 1; build(g); S.nvN.pop = g.t; M.sparkle(g, 'nv', { n: 12 }); g.sfx('coin'); hop(g, 'laugh'); } }); }],
                [0.6 * T, g => { M.tween(g, S.note, { alpha: 0 }, 0.25 * T); }], [0.9 * T, g => { delete g.s.mk.ex.note; }]]); } });
          // the power rule: drag the exponent down in front of its log
          if (S.k > 1 && !S.pw) out.push({ drag: 'k', to: ['lx'], busy: 0.1, then(g) {
            M.show(g, 0.95 * T); hop(g, 'think'); M.circle(g, 'k', { dur: 0.35 * T }); const from = { ...M.box(g, 'k') };
            M.at(g, [[0.3 * T, g => { S.pw = true; S.kn.alpha = 0; build(g); g.sfx('swoosh'); const to = { ...M.box(g, 'k') };
              M.fly(g, { node: M.num(S.k, null, { col: INK }), from: [from.x, from.y], to: [to.x, to.y], dur: 0.45 * T, arc: -70, s0: from.s, s1: to.s,
                then(g) { S.kn.alpha = 1; S.kn.pop = g.t; M.indicate(g, S.lgX, { delay: 0.05 * T, dur: 0.3 * T }); M.sparkle(g, 'k', { n: 10 }); g.sfx('pop'); hop(g, 'laugh'); } }); }]]); } });
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
    SCN.std(g, c, { scene: 'library', panel: 'chalk' }); host(g, c);
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'note'); M.drawUI(g, c);
  },
});
