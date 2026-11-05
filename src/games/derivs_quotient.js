// derivs_quotient.js — QUOTIENT RULE! d/dx [f/g] = (f′g − fg′)/g², on a chalkboard in the snow.
// The working line under the problem is the rule's template with two empty slots: (□ · g − f · □)/g².
// The player drags the d/dx onto the top f (or its slot) and onto the bottom g (or its slot), in either order: the
// slots fill with f′ and g′. Then a tap on the top of the working line multiplies out and combines it.
// Level 0: x²/(x + b). Level 1: x³/(x + b). Level 2: x²/(x² + b), where the x³ terms cancel.
// Medium mode: each derivative and nothing else opens the tray (the expansion is shown at once).
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), CF = '#ffd45a', CG = '#ff9ab8';
function pick(g) {
  const r = k => Math.floor(g.rand() * k), b = 1 + r(4);
  return [{ n: 2, m: 1, b }, { n: 3, m: 1, b }, { n: 2, m: 2, b: 1 + r(5) }][g.level];
}
const pw = (p, id, col) => p === 1 ? M.vr('x', id, { col }) : M.sup(M.vr('x', id, { col }), M.num(p, null, { col }));
// c·x^p as a node (c = 1 hides the coefficient, p = 0 is a plain number)
const mono = (c, p, col) => p === 0 ? M.num(c, null, { col }) : M.row(c === 1 ? null : M.num(c, null, { col }), pw(p, null, col));
function build(g) {
  const S = g.s, { n, m, b } = S, G = () => M.row(pw(m), M.op('+'), M.num(b));
  const prob = M.row(M.ddx('x', 'ddx'), M.gap(4), M.paren(M.frac(Object.assign(pw(n), { id: 'f' }), Object.assign(G(), { id: 'g' }))));
  let top;
  if (S.done) { const a = n - m, c = n * b, it = []; if (a) it.push(mono(a, n + m - 1)); it.push(it.length ? M.op('+') : null, mono(c, n - 1)); top = Object.assign(M.row(...it), { id: 'res', pop: S.popR, col: M.GOOD }); }
  else top = Object.assign(M.row(S.s1, M.op('·'), M.paren(G()), M.op('-'), pw(n), M.op('·'), S.s2), { id: 'num' });
  const work = M.row(M.op('='), M.frac(top, M.sup(M.paren(G()), M.num(2))));
  M.place(g, 'prob', prob, 180, 236, 40, { col: INK }); M.place(g, 'work', work, 180, 346, 34, { col: INK });
}

MG.add({
  id: 'derivs_quotient', stage: 'derivs', cmd: 'QUOTIENT RULE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Derived!', hold: 1.4,
  card: {
    title: 'The quotient rule', ref: 'Calculus', kind: 'Derivatives',
    text: 'A quotient is one thing divided by another. The quotient rule finds the derivative of a fraction f/g, where f is the top and g is the bottom. The derivative is how fast a formula changes, and f′ (read "f prime") means the derivative of f.\n\nThe rule says: d/dx (f/g) = (f′g − fg′)/g². In words: the derivative of the top times the bottom, minus the top times the derivative of the bottom, all over the bottom squared.\n\nFor example, take x²/(x + 1). Here f = x², so f′ = 2x, and g = x + 1, so g′ = 1. The top becomes 2x(x + 1) − x² · 1 = 2x² + 2x − x² = x² + 2x. So the derivative is (x² + 2x)/(x + 1)².\n\nThe order matters: f′g comes first, because of the minus sign.',
    note: 'd/dx (f/g) = (f′g − fg′)/g². Differentiate the top and the bottom, put them in the pattern, then simplify the top.',
    ask: 'What is the derivative of x/(x + 2)? What is the derivative of x²/(x + 3)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { n, m, b } = S;
    S.s1 = M.slot('s1', { w: 46, col: CF }); S.s2 = M.slot('s2', { w: 46, col: CG }); build(g); M.inert(g, ['res']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const fp = () => mono(n, n - 1, CF), gp = () => mono(m, m - 1, CG);
    const fill = (k, node) => { S[k].fill = node; node.pop = g.t; build(g); const bx = M.box(g, k); if (bx) g.burst(bx.x, bx.y, [k === 's1' ? CF : CG, '#fff'], 8, 100); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.d1) out.push({ drag: 'ddx', to: ['f', 's1'], busy: 0.1, ask: { v: mono(n, n - 1), wrong: [mono(1, n - 1), mono(n, n), mono(n - 1, n - 1), M.num(n)] }, askAt: 0, after: 0.1,
          then(g) { S.d1 = true; g.sfx('pop'); }, resolve(g) { fill('s1', fp()); g.sfx('coin'); } });
        if (!S.d2) out.push({ drag: 'ddx', to: ['g', 's2'], busy: 0.1, ask: { v: mono(m, m - 1), wrong: m === 1 ? [M.num(0), M.vr('x'), M.num(b), M.num(b + 1)] : [M.row(M.num(2), M.vr('x'), M.op('+'), M.num(b)), M.vr('x'), M.num(2)] }, askAt: 0, after: 0.1,
          then(g) { S.d2 = true; g.sfx('pop'); }, resolve(g) { fill('s2', gp()); g.sfx('coin'); } });
        if (S.s1.fill && S.s2.fill && !S.done) out.push({ tap: 'num', busy: 0.1, then(g) { S.done = true; S.popR = g.t; g.sfx('chime'); build(g); const bx = M.box(g, 'res'); if (bx) g.burst(bx.x, bx.y, [CF, CG, '#fff'], 16, 140); } });
        return out;
      },
      area(g) { return !S.d1 ? ['ddx', 'f'] : !S.d2 ? ['ddx', 'g'] : ['num']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'snow', panel: PANEL, host: 'penguin', hostX: 72, hostY: 596, hostS: 1.3, panelY: 292, panelH: 220 });
    // colour the f and g of the problem like their slots, so the player sees which derivative goes where
    const tint = (n, col) => { if (!n) return; n.col = col; for (const ch of [n.base, n.exp, ...(n.items || [])]) tint(ch, col); }; tint(M.node(g, 'f'), CF); tint(M.node(g, 'g'), CG);
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    M.drawUI(g, c);
  },
});
