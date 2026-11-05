// counting_arith.js — ARITHMETIC SEQ! Find the common difference of an arithmetic sequence and use it.
// A spring meadow; the sequence is painted on a wooden sign. The player drags one term onto the next term: the
// subtraction "7 − 3" appears above that gap and becomes the difference "+4" (medium mode: picked from the tray), and
// hop arcs labelled +4 appear under every gap. Then the player drags the +4 onto the last term (or the empty slot): the
// slot reads "15 + 4", and a tap on it makes 19.
// Level 0: small terms, d = 2–5. Level 1: bigger terms, and the sequence may go down (d < 0).
// Level 2: the nth-term formula: drag the difference onto a₁₀; the slot reads a₁ + (n − 1) · d, and three taps in the
// order of operations make the term.
const M = MK, INK = SCN.ink('sign');
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return { a: 1 + r(6), d: 2 + r(4) };
  if (L === 1) return g.rand() < 0.45 ? { a: 22 + r(10), d: -(2 + r(4)) } : { a: 2 + r(9), d: 3 + r(7) };
  return { a: 2 + r(7), d: 2 + r(4), n: 8 + r(5) };
}
const signed = d => M.row(M.op(d < 0 ? '-' : '+'), M.num(Math.abs(d)));

MG.add({
  id: 'counting_arith', stage: 'counting', cmd: 'ARITHMETIC SEQ!', hint: 'drag', time: 9, mood: 'bright', winText: 'Next term!', hold: 1.4,
  card: {
    title: 'Arithmetic sequences', ref: 'Grade 9 and up', kind: 'Sequences',
    text: 'A sequence is a list of numbers in order, and each number in it is called a term. In an arithmetic sequence, you get each term by adding the same number to the term before it. That number is called the common difference.\n\nTo find the common difference, subtract any term from the term right after it. In 3, 7, 11, 15, the difference is 7 − 3 = 4, so the next term is 15 + 4 = 19.\n\nTo jump straight to term number n, start at the first term and add the difference n − 1 times, because there are n − 1 steps from term 1 to term n. Term 10 of this sequence is 3 + 9 × 4 = 39.',
    note: 'Subtract a term from the next term to get the common difference d. Add d to get the next term. Term number n is the first term plus (n − 1) × d.',
    ask: 'What comes after 5, 9, 13, 17? What is term 20 of 2, 5, 8, 11, …?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, d } = S;
    S.T = [0, 1, 2, 3].map(i => a + i * d); S.L2 = g.level === 2; S.next = S.L2 ? a + (S.n - 1) * d : a + 4 * d;
    S.found = -1; S.dShown = false; S.st = 0; // st: 0 = slot empty, then one step per rewrite of the slot
    g.dur *= (2.6 + 1.05 * (S.L2 ? 5 : 3)) / 8;
    const fill = () => {
      const { n } = S, pop = { pop: g.t };
      if (!S.L2) return [null, M.row(M.num(S.T[3], null, pop), signed(d)), M.num(S.next, null, pop)][S.st];
      if (S.st === 1) return M.row(M.num(a), M.op('+'), M.paren(M.row(M.num(n), M.op('-'), M.num(1)), 'nm', pop), M.op('·'), M.num(d));
      if (S.st === 2) { const pr = M.row(M.num(n - 1, null, pop), M.op('·'), M.num(d)); pr.id = 'pr'; return M.row(M.num(a), M.op('+'), pr); }
      if (S.st === 3) { const sm = M.row(M.num(a), M.op('+'), M.num((n - 1) * d, null, pop)); sm.id = 'sm'; return sm; }
      if (S.st === 4) return M.num(S.next, null, pop);
      return null;
    };
    S.build = () => {
      const items = [];
      S.T.forEach((v, i) => { if (i) items.push(M.op(',', 'c' + i), M.gap(9)); items.push(M.num(v, 't' + i)); });
      items.push(M.op(',', 'c4'), M.gap(9), S.L2 ? M.txt('…', 'dots') : M.slot('q', { fill: fill() }));
      M.place(g, 'seq', M.row(...items), 180, S.L2 ? 252 : 296, S.L2 ? 38 : 40, { col: INK });
      if (S.L2) M.place(g, 'frm', M.row(M.sup(M.vr('a'), M.num(S.n, null, { dy: 14 }), 'an'), M.op('=', 'eq'), M.slot('q', { fill: fill() })), 180, 352, 32, { col: INK });
    };
    S.build(); M.inert(g, ['c1', 'c2', 'c3', 'c4', 'dots', 'eq', 'dd', 'nm1']);
    const showDiff = (g, node) => { const b0 = M.box(g, 't' + S.found), b1 = M.box(g, 't' + (S.found + 1)); M.place(g, 'dif', node, (b0.x + b1.x) / 2, b0.y - b0.h / 2 - 18, 30, { col: '#ffe9a8' }); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (S.found < 0) {
          for (let i = 0; i < 3; i++) for (const [p, q] of [[i, i + 1], [i + 1, i]]) out.push({
            drag: 't' + p, to: 't' + q, busy: 0.1, ask: { v: d, wrong: [-d, d + 1, d - 1, S.T[i] + S.T[i + 1]] },
            then(g) { S.found = i; const dd = M.row(M.num(S.T[i + 1]), M.op('-'), M.num(S.T[i])); dd.id = 'dd'; showDiff(g, dd); g.sfx('whoosh'); },
            resolve(g) { const s = signed(d); s.id = 'd'; s.pop = g.t; showDiff(g, s); S.dShown = true; S.dAt = g.t; g.sfx('coin'); },
          });
          return out;
        }
        if (S.st === 0) return [{ drag: 'd', to: S.L2 ? ['an', 'q'] : ['t3', 'q'], busy: 0.1, then(g) { S.st = 1; M.node(g, 'd').hide = true; S.build(); g.sfx('pop'); } }];
        if (!S.L2) return S.st === 1 ? [{ tap: 'q', busy: 0.1, ask: { v: S.next, wrong: [S.next + 1, S.next - 1, S.T[3] - d, S.T[3] + 2 * d] }, then() {}, resolve(g) { S.st = 2; S.build(); g.sfx('coin'); } }] : [];
        const { n, a } = S;
        if (S.st === 1) return [{ tap: 'nm', busy: 0.1, ask: { v: n - 1, wrong: [n, n + 1, n - 2] }, then() {}, resolve(g) { S.st = 2; S.build(); g.sfx('coin'); } }];
        if (S.st === 2) return [{ tap: 'pr', busy: 0.1, ask: { v: (n - 1) * d, wrong: [n - 1 + d, n * d, (n - 1) * (d + 1)] }, then() {}, resolve(g) { S.st = 3; S.build(); g.sfx('coin'); } }];
        if (S.st === 3) return [{ tap: ['sm', 'q'], busy: 0.1, ask: { v: S.next, wrong: [(a + n - 1) * d, S.next + d, S.next - 1] }, then() {}, resolve(g) { S.st = 4; S.build(); g.sfx('coin'); } }];
        return [];
      },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'meadow', panel: 'sign', host: 'rabbit', hostX: 300, hostY: 600, hostS: 1.3 });
    // hop arcs under the terms, each labelled with the common difference, once it is known
    if (S.dShown) {
      const pairs = [[0, 1], [1, 2], [2, 3]]; if (!S.L2 && S.st > 0) pairs.push([3, 'q']);
      pairs.forEach(([i, j], k) => {
        const a = M.box(g, 't' + i), b = M.box(g, typeof j === 'number' ? 't' + j : j); if (!a || !b) return;
        const kk = M.ease((t - S.dAt - k * 0.06) / 0.25); if (kk <= 0) return;
        const y0 = a.y + a.h / 2 + 6, x0 = a.x + 4, x1 = M.lerp(x0, b.x - 4, kk);
        c.save(); c.strokeStyle = '#ffe9a8'; c.lineWidth = 2.5; c.setLineDash([5, 5]); c.lineCap = 'round';
        c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, y0 + 34, x1, y0); c.stroke(); c.setLineDash([]);
        c.fillStyle = '#ffe9a8'; c.font = M.NUMF(16); c.textAlign = 'center'; c.globalAlpha = kk;
        c.fillText((S.d < 0 ? '−' : '+') + Math.abs(S.d), (x0 + b.x) / 2, y0 + 38); c.restore();
      });
    }
    M.drawEx(g, c, 'seq'); if (S.L2) M.drawEx(g, c, 'frm'); M.drawEx(g, c, 'dif');
    M.drawUI(g, c);
  },
});
