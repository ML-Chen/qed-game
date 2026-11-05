// powers_powpow.js — POWER OF POWER! A power raised to a power: (xᵃ)ᵇ = xᵃ·ᵇ.
// The player drags the outer exponent onto the inner one: (x²)³ becomes x^(2 · 3), and tapping 2 · 3 multiplies it.
// Level 0: (x²)³. Level 1: bigger exponents and other letters. Level 2: (2x³)²: the outer exponent goes to every factor,
// so it is dragged onto the 2 (giving 2², tap to compute) and onto the 3 (giving x^(3 · 2)), in either order.
// Medium mode: each tap on a written-out product or power opens the tray.
const M = MK, INK = SCN.ink('glass'), OUT = '#d0407a';
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { v: 'x', a: 2 + r(3), b: 2 + r(2) };
  if (L === 1) return { v: ['x', 'y', 'a'][r(3)], a: 2 + r(4), b: 2 + r(3) };
  const c = 2 + r(2); return { v: 'x', a: 2 + r(3), b: c === 3 ? 2 : 2 + r(2), c };
}
// each factor is 'in' (still inside the brackets), 'mul' (the outer exponent has reached it, waiting to be computed) or 'done'
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] }), out = [], inn = [];
  if (S.c) {
    if (S.cs === 'in') inn.push(M.num(S.c, 'c'));
    else out.push(S.cs === 'mul' ? M.sup(M.num(S.c), M.num(S.b, null, { col: OUT }), 'cp', pp('cp')) : M.num(S.cv, 'cv', pp('cv')));
  }
  if (S.xs === 'in') inn.push(M.sup(M.vr(S.v, 'x'), M.num(S.a, 'a')));
  else out.push(S.xs === 'mul' ? M.sup(M.vr(S.v, 'x2'), Object.assign(M.row(M.num(S.a), M.op('·'), M.num(S.b, null, { col: OUT })), { id: 'xp', ...pp('xp') }))
    : M.sup(M.vr(S.v, 'x3'), M.num(S.a * S.b, 'xe', pp('xe'))));
  const group = inn.length ? M.sup(M.paren(M.row(...inn), 'par'), M.num(S.b, 'o', { col: OUT })) : null;
  // keep the factors in their order: the number first, then the power of x
  const items = S.c && S.cs === 'in' ? [group, ...out] : [...out, group];
  M.place(g, 'ex', M.row(...items.flatMap((n, i) => n ? [i && items[i - 1] ? M.gap(10) : null, n] : [])), 180, 316, S.c ? 60 : 68, { col: INK });
}

MG.add({
  id: 'powpow', stage: 'powers', cmd: 'POWER OF POWER!', hint: 'drag', time: 8, mood: 'bright', winText: 'Powered!', hold: 1.4,
  card: {
    title: 'Power of a power', ref: 'Grade 8', kind: 'Exponents',
    text: 'An exponent says how many copies of the base are multiplied together. So x² means x · x.\n\nWhen a power is raised to another power, multiply the two exponents. For example, (x²)³ = x²·³ = x⁶.\n\nThis works because (x²)³ means three copies of x² multiplied together: x² · x² · x². Each copy holds two x\'s, so there are 3 groups of 2, which is 6 copies of x in all.\n\nWhen the brackets hold a product, the outer exponent goes to every factor inside. For example, (2x³)² = 2² · x³·² = 4x⁶.',
    note: 'To raise a power to a power, keep the base and multiply the exponents: (xᵃ)ᵇ = xᵃ·ᵇ. An exponent outside brackets applies to every factor inside.',
    ask: 'What is (x⁴)²? What is (3x²)³?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.pops = {}; S.xs = 'in'; S.cs = S.c ? 'in' : null; if (S.c) S.cv = Math.pow(S.c, S.b);
    build(g); M.inert(g, ['par']);
    const nMoves = S.c ? 4 : 2; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#7ad0ff', '#fff', '#f0a0c8'], 10, 120); };
    M.play(g, {
      moves(g) {
        const out = [], ab = S.a * S.b;
        // drag the outer exponent onto the inner exponent (or onto x): it multiplies the inner exponent
        if (S.xs === 'in') out.push({ drag: 'o', to: ['a', 'x'], busy: 0.1, then(g) { S.xs = 'mul'; S.pops.xp = g.t; g.sfx('pop'); build(g); burst('xp'); } });
        // ... and onto the number in front, which gets the same exponent
        if (S.cs === 'in') out.push({ drag: 'o', to: 'c', busy: 0.1, then(g) { S.cs = 'mul'; S.pops.cp = g.t; g.sfx('pop'); build(g); burst('cp'); } });
        if (S.xs === 'mul') out.push({ tap: 'xp', busy: 0.1, askAt: 0, after: 0.1, ask: { v: ab, wrong: [S.a + S.b, Math.pow(S.a, S.b), ab + 1, ab - 1] },
          then() {}, resolve(g) { S.xs = 'done'; S.pops.xe = g.t; g.sfx('coin'); build(g); burst('xe'); } });
        if (S.cs === 'mul') out.push({ tap: 'cp', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.cv, wrong: [S.c * S.b, S.c + S.b, S.c, S.cv + 1] },
          then() {}, resolve(g) { S.cs = 'done'; S.pops.cv = g.t; g.sfx('coin'); build(g); burst('cv'); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'snow', panel: 'glass', host: 'penguin', hostX: 76, hostY: 590, hostS: 1.4 });
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
