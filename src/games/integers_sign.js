// integers_sign.js — SIGN RULE! Multiply signed numbers by dealing with the signs first: two signs combine into one
// (same signs make +, different signs make −). The player drags one factor's sign onto another's; they merge into
// their product sign. When one sign is left it moves to the front, and tapping the product multiplies the sizes.
// (−4) × (−3) → 4 × 3 → 12.   (−4) × (+3) → −(4 × 3) → −12.
// A chalkboard under the night sky with an owl teacher.
// Level 0: two negative factors. Level 1: mixed signs, written with an explicit + sign. Level 2: three factors.
// Wrong moves: dragging a sign onto a number, tapping the product before the signs are combined.
// Medium mode: the final tap opens a tray; wrong tiles are the opposite sign, the sum of the sizes, and ±1 off.
const M = MK, INK = SCN.ink('chalk');
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return [{ v: 2 + r(5), s: -1 }, { v: 2 + r(5), s: -1 }];
  if (L === 1) { const f = [{ v: 2 + r(6), s: -1 }, { v: 2 + r(6), s: 1 }]; return g.rand() < 0.5 ? f.reverse() : f; }
  const f = [1, 2, 3].map(() => ({ v: 1 + r(4), s: g.rand() < 0.6 ? -1 : 1 })); if (f.every(q => q.s > 0)) f[r(3)].s = -1; return f;
}
MG.add({
  id: 'integers_sign', stage: 'integers', cmd: 'SIGN RULE!', hint: 'drag', time: 8, mood: 'night', winText: 'Signed!', hold: 1.4,
  card: {
    title: 'Multiplying signed numbers', ref: 'Grades 6–7', kind: 'Negative numbers',
    text: 'A signed number has a sign in front: + for positive and − for negative. To multiply signed numbers, work out the sign and the size separately.\n\nThe sign rule: two numbers with the same sign multiply to a positive number. Two numbers with different signs multiply to a negative number. Then multiply the sizes as usual.\n\nFor example, (−4) × (−3) = +12, and (−4) × 3 = −12. With more factors, combine the signs two at a time: (−1) × (−2) × (−3) = −6.\n\nHere is why. 3 × (−4) is three debts of 4, which is −12. Multiplying by −1 flips a number to its opposite, so (−3) × (−4) flips −12 to 12.',
    note: 'Same signs give +, different signs give −. An even number of negative factors gives a positive product; an odd number gives a negative product.',
    ask: 'What is (−5) × (−2)? What is (−1) × 4 × (−3)?',
  },
  init(g) {
    const S = g.s; M.setup(g); S.f = pick(g); S.sign = S.f.reduce((p, q) => p * q.s, 1); S.v = S.sign * S.f.reduce((p, q) => p * q.v, 1);
    g.dur *= (2.6 + 1.05 * S.f.length) / 8;
    M.inert(g, ['front', 'pp', ...S.f.map((q, i) => 'p' + i)]);
    const signed = () => S.f.map((q, i) => i).filter(i => S.f[i].s);
    const build = () => {
      const left = signed(), fin = left.length <= 1;
      const factors = S.f.flatMap((q, i) => [i ? M.op('*', 'x' + i) : null,
        !fin && q.s ? M.paren(M.row(M.op(q.s < 0 ? '-' : '+', 'g' + i, { col: q.s < 0 ? '#ffb0b8' : '#b8ffc8', pop: q.pop }), M.num(q.v, 'n' + i)), 'p' + i) : M.num(q.v, 'n' + i)]);
      let ex = M.row(...factors); if (fin && S.sign < 0) ex = M.row(M.op('-', 'front', { col: '#ffb0b8', pop: S.finAt }), M.paren(ex, 'pp'));
      if (S.done) ex = M.num(S.v, 'res', { pop: g.t, col: '#ffe9a0' });
      M.place(g, 'ex', ex, 180, 304, S.f.length > 2 ? 38 : 48, { col: INK });
    };
    build();
    const merge = (g, from, to) => {
      const i = +from.slice(1), j = +to.slice(1), a = S.f[i], b = S.f[j];
      M.fly(g, { node: M.op(a.s < 0 ? '-' : '+'), from, to, dur: 0.18, arc: -40, col: INK });
      b.s *= a.s; a.s = 0; b.pop = g.t; g.sfx('snap'); g.sfx('coo');
      if (signed().length === 1) { S.f[signed()[0]].s = 0; S.finAt = g.t; }
      build(); const bx = M.box(g, signed().length ? to : (S.sign < 0 ? 'front' : 'x1')); if (bx) g.burst(bx.x, bx.y, ['#ffffff', '#ffe9a0', '#b8ffc8'], 10, 120);
    };
    M.play(g, {
      moves(g) {
        const left = signed();
        if (left.length > 1) return left.map(i => ({ drag: 'g' + i, to: left.filter(j => j !== i).map(j => 'g' + j), busy: 0.1, then: merge }));
        if (S.done) return [];
        const parts = S.f.flatMap((q, i) => [i ? 'x' + i : null, 'n' + i]).filter(Boolean);
        return [{ tap: parts, busy: 0.1, ask: { v: S.v, wrong: [-S.v, S.sign * S.f.reduce((p, q) => p + q.v, 0), S.v + 1, S.v - 1] },
          then(g) { S.done = true; }, resolve(g) { build(); g.sfx('coin'); g.burst(180, 290, ['#ffe9a0', '#ffffff'], 14, 150); } }];
      },
      area(g) { const left = signed(); return left.length > 1 ? left.map(i => 'g' + i) : 'x1'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'night', panel: 'chalk', panelY: 300, panelH: 170, host: 'owl', hostX: 296, hostY: 556, hostS: 1.4 });
    M.drawEx(g, c, 'ex');
    // a firefly or two drifting near the board
    for (let i = 0; i < 3; i++) { const x = 60 + i * 110 + Math.sin(t * 0.9 + i * 2) * 30, y = 450 + Math.cos(t * 1.2 + i) * 16, a = 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i)); c.fillStyle = `rgba(230,255,150,${a})`; c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); }
    M.drawUI(g, c);
  },
});
