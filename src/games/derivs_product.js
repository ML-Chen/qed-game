// derivs_product.js — PRODUCT RULE! d/dx [f · g] = f′g + fg′, with f = A·xᵐ and g = xⁿ + c.
// The player drags the d/dx onto the first factor (the line "= (f)′ · g" appears) and onto the second factor (the line
// "+ f · (g)′" appears), in either order. Then the player taps each primed factor to differentiate it with the power rule.
// Level 0: f = x², g = xⁿ + c. Level 1: bigger powers. Level 2: f has a coefficient and c may be negative.
// Medium mode: each derivative is picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), FC = '#2a62b0', GC = '#c0502a';
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { A: 1, m: 2, n: 3 + r(2), c: 1 + r(4) };
  if (L === 1) return { A: 1, m: 2 + r(2), n: 2 + r(3), c: 1 + r(6) };
  return { A: 2 + r(2), m: 2 + r(2), n: 2 + r(3), c: (1 + r(6)) * (g.rand() < 0.5 ? -1 : 1) };
}
const col = (n, cl) => { if (!n) return n; if (n.k !== 'op' || cl) n.col = cl; for (const ch of [n.base, n.exp, n.inner, ...(n.items || [])]) col(ch, cl); return n; };
// c·x^p as a node (p ≥ 0)
const mono = (c, p, cl) => col(M.row(c === 1 && p > 0 ? null : M.num(c), p === 0 ? null : p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(p))), cl);
const gNode = (n, c, cl) => col(M.row(mono(1, n), M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c))), cl);
const PRIME = () => M.txt('′');

MG.add({
  id: 'product', stage: 'derivs', cmd: 'PRODUCT RULE!', hint: 'drag', time: 10, winText: 'Derived!', hold: 1.4,
  card: {
    title: 'The product rule', ref: 'Calculus', kind: 'Calculus',
    text: 'The derivative of a formula tells you how fast its value changes as x changes. The product rule finds the derivative of two formulas multiplied together. Call them f and g, and write f′ for the derivative of f.\n\nThe rule says: the derivative of f · g is f′ · g + f · g′. Take the derivative of one factor at a time, keep the other factor as it is, and add the two results.\n\nFor example, the derivative of x² · (x³ + 1) is 2x · (x³ + 1) + x² · 3x².\n\nWhy? Picture a rectangle with sides f and g, so its area is f · g. When both sides grow a little, the area gains a strip along each side: one strip is f′ times g, and the other is f times g′.',
    note: 'Differentiate the first factor and keep the second, then keep the first and differentiate the second. Add them: (fg)′ = f′g + fg′.',
    ask: 'What is the derivative of x · (x² + 4)? What is the derivative of x³ · (x + 2)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { A, m, n, c } = S;
    const f = () => mono(A, m, FC), gg = () => gNode(n, c, GC);
    S.top = M.row(M.ddx('x', 'dd'), M.gap(4), M.paren(M.row(M.paren(f(), 'F'), M.paren(gg(), 'G')), 'all', { br: '[]' }));
    S.dA = M.row(M.paren(f()), col(PRIME(), FC)); S.dA.id = 'dA';
    S.dB = M.row(M.paren(gg()), col(PRIME(), GC)); S.dB.id = 'dB';
    S.l1 = M.row(M.op('=', 'e1'), S.dA, M.op('·', 'm1'), M.paren(gg(), 'g1')); S.l1.hide = true;
    S.l2 = M.row(M.op('+', 'e2'), f(), M.op('·', 'm2'), S.dB); S.l2.hide = true;
    const relay = () => { M.place(g, 'l1', S.l1, 50, 322, 31, { col: INK, left: true }); M.place(g, 'l2', S.l2, 50, 370, 31, { col: INK, left: true }); };
    M.place(g, 'top', S.top, 180, 250, 38, { col: INK }); relay();
    M.inert(g, ['all', 'e1', 'e2', 'm1', 'm2', 'g1']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const fd = () => mono(A * m, m - 1, FC), gd = () => mono(n, n - 1, GC);
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.l1on) out.push({ drag: 'dd', to: 'F', busy: 0.1, then(g) { S.l1on = true; S.l1.hide = false; S.dA.pop = g.t; relay(); g.sfx('swoosh'); } });
        if (S.l1on && !S.aDone) out.push({ tap: 'dA', busy: 0.1, askAt: 0, after: 0.1, ask: { v: mono(A * m, m - 1), wrong: [mono(A, m - 1), mono(A * m, m), mono(A * m + 1, m - 1)] },
          then(g) { S.aDone = true; }, resolve(g) { const d = fd(); d.pop = g.t; S.l1.items[1] = d; relay(); g.sfx('coin'); const b = M.box(g, 'e1'); if (b) g.burst(b.x + 50, b.y, ['#7ab0ff', '#fff'], 8, 110); } });
        if (!S.l2on) out.push({ drag: 'dd', to: 'G', busy: 0.1, then(g) { S.l2on = true; S.l2.hide = false; S.dB.pop = g.t; relay(); g.sfx('swoosh'); } });
        if (S.l2on && !S.bDone) out.push({ tap: 'dB', busy: 0.1, askAt: 0, after: 0.1, ask: { v: mono(n, n - 1), wrong: [mono(1, n - 1), mono(n, n), mono(n - 1, n - 1)] },
          then(g) { S.bDone = true; }, resolve(g) { const d = gd(); d.pop = g.t; S.l2.items[3] = d; relay(); g.sfx('coin'); const b = M.box(g, 'm2'); if (b) g.burst(b.x + 40, b.y, ['#ffb080', '#fff'], 8, 110); } });
        return out;
      },
      area(g) { return !S.l1on ? ['dd', 'F'] : !S.aDone ? 'dA' : !S.l2on ? ['dd', 'G'] : 'dB'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'forest', panel: PANEL, panelY: 292, panelH: 216, host: 'frog', hostX: 286, hostY: 590, hostS: 1.35 });
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'l1'); M.drawEx(g, c, 'l2');
    M.drawUI(g, c);
  },
});
