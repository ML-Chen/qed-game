// powers_addexp.js — ADD EXPONENTS! Multiplying powers with the same base: xᵃ · xᵇ = xᵃ⁺ᵇ.
// The player drags one exponent onto the other power: the two powers become one, x^(a + b), and tapping a + b adds it.
// Level 0: x³ · x⁴. Level 1: numbers in front too (2x³ · 5x⁴): drag 2 onto 5 to make (2 · 5), tap it to multiply.
// Level 2: three powers of x, or a number base (2³ · 2⁵). Medium mode: each tap on a sum or a product opens the tray.
const M = MK, INK = SCN.ink('chalk'), EXP = '#ffd970';
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), ex = () => 2 + r(4);
  if (L === 0) return { base: 'x', exps: [ex(), ex()] };
  if (L === 1) return { base: 'x', exps: [ex(), ex()], coefs: [2 + r(4), 2 + r(4)] };
  if (g.rand() < 0.5) return { base: 'x', exps: [ex(), ex(), 2 + r(3)] };
  return { base: String(2 + r(2)), exps: [ex(), 2 + r(5)] };
}
// the expression is rebuilt from the state after every move; S.pops[id] remembers when a part changed (it pops)
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  const pw = S.f.map(f => M.sup(S.base === 'x' ? M.vr('x', 'b' + f.u) : M.num(S.base, 'b' + f.u),
    f.exps.length > 1 ? Object.assign(M.row(...f.exps.flatMap((e, i) => [i ? M.op('+') : null, M.num(e)])), { id: 's' + f.u, col: EXP, ...pp('s' + f.u) })
      : M.num(f.exps[0], 'e' + f.u, { col: EXP, ...pp('e' + f.u) })));
  let items;
  if (S.coef === 'sep') items = [M.num(S.coefs[0], 'c0'), pw[0], M.op('·', 'dot'), M.num(S.coefs[1], 'c1'), pw[1]];
  else {
    const cn = S.coef === 'prod' ? M.paren(M.row(M.num(S.coefs[0]), M.op('·'), M.num(S.coefs[1])), 'cm', pp('cm')) : S.coef === 'done' ? M.num(S.coefV, 'cv', pp('cv')) : null;
    items = [cn, cn ? M.gap(6) : null, ...pw.flatMap((n, i) => [i ? M.op('·', 'dot' + i) : null, n])];
  }
  M.place(g, 'ex', M.row(...items), 180, 312, S.f.length > 2 || S.coefs ? 56 : 66, { col: INK });
}

MG.add({
  id: 'addexp', stage: 'powers', cmd: 'ADD EXPONENTS!', hint: 'drag', time: 8, mood: 'bright', winText: 'Added!', hold: 1.4,
  card: {
    title: 'Multiplying powers', ref: 'Grade 8', kind: 'Exponents',
    text: 'A power is a short way to write a repeated multiplication. In x³, x is the base and the small raised 3 is the exponent. The exponent says how many copies of the base are multiplied, so x³ means x · x · x.\n\nTo multiply two powers with the same base, keep the base and add the exponents. For example, x³ · x⁴ = x³⁺⁴ = x⁷.\n\nThis works because x³ · x⁴ is (x · x · x) · (x · x · x · x). That is 7 copies of x multiplied together, which is x⁷.\n\nNumbers in front are multiplied on their own: 2x³ · 5x⁴ = (2 · 5)x³⁺⁴ = 10x⁷.',
    note: 'To multiply powers with the same base, keep the base and add the exponents: xᵃ · xᵇ = xᵃ⁺ᵇ.',
    ask: 'What is x² · x⁵? What is 3x² · 4x³?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = gen(g); S.pops = {};
    S.base = p.base; S.f = p.exps.map((e, i) => ({ u: i, exps: [e] })); S.coefs = p.coefs || null; S.coef = p.coefs ? 'sep' : null;
    if (S.coefs) S.coefV = S.coefs[0] * S.coefs[1];
    build(g); M.inert(g, ['dot', 'dot1', 'dot2']);
    const nMoves = 2 * (S.f.length - 1) + (S.coefs ? 2 : 0); g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const eid = f => f.exps.length > 1 ? 's' + f.u : 'e' + f.u;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#9ae07a'], 10, 120); };
    M.play(g, {
      moves(g) {
        const out = [];
        // drag one power's exponent onto another power (its exponent or its base): the powers join, x^(a + b)
        for (const f of S.f) {
          const others = S.f.filter(q => q !== f); if (!others.length) break;
          out.push({ drag: eid(f), to: others.flatMap(q => [eid(q), 'b' + q.u]), busy: 0.1, then(g, a, b) {
            const q = S.f.find(o => o.u === +b.slice(1)), [A, B] = S.f.indexOf(f) < S.f.indexOf(q) ? [f, q] : [q, f];
            A.exps = A.exps.concat(B.exps); S.f.splice(S.f.indexOf(B), 1); S.pops['s' + A.u] = g.t;
            if (S.coef === 'sep') { S.coef = 'prod'; S.pops.cm = g.t; } // writing the powers together gathers the numbers in front
            g.sfx('pop'); build(g); burst('s' + A.u);
          } });
        }
        // the numbers in front: drag one onto the other to write (2 · 5)
        if (S.coef === 'sep') for (const [a, b] of [['c0', 'c1'], ['c1', 'c0']]) out.push({ drag: a, to: b, busy: 0.1, then(g) { S.coef = 'prod'; S.pops.cm = g.t; build(g); } });
        // tap a written-out sum or product to compute it
        for (const f of S.f) if (f.exps.length > 1) {
          const v = f.exps.reduce((p, q) => p + q, 0), pr = f.exps.reduce((p, q) => p * q, 1);
          out.push({ tap: 's' + f.u, busy: 0.1, askAt: 0, after: 0.1, ask: { v, wrong: [pr, v + 1, v - 1, f.exps[0]] },
            then() {}, resolve(g) { f.exps = [v]; S.pops['e' + f.u] = g.t; g.sfx('coin'); build(g); burst('e' + f.u); } });
        }
        if (S.coef === 'prod') out.push({ tap: 'cm', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.coefV, wrong: [S.coefs[0] + S.coefs[1], S.coefV + S.coefs[0], S.coefV - 1] },
          then() {}, resolve(g) { S.coef = 'done'; S.pops.cv = g.t; g.sfx('coin'); build(g); burst('cv'); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'meadow', panel: 'chalk', host: 'rabbit', hostX: 292, hostY: 588, hostS: 1.4 });
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
