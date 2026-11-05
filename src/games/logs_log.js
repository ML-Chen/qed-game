// logs_log.js — LOGARITHM! Find logₐ N by rewriting it as a power: log₂ 8 = ? means 2^? = 8.
// Moves: drag the base 2 onto the 8 (the problem becomes 2^? = 8), tap the 8 to split it into 2 · 2 · 2, tap 2 · 2 · 2
// to count the 2s (it becomes 2³), then drag the 3 into the ? (log₂ 8 = 3). The split and count may also come first.
// Level 0: log₂ 4, log₂ 8, log₃ 9. Level 1: answers 3 or 4. Level 2: answers 3 to 5, with base 10 too.
// Medium mode: the count opens the tray.
const M = MK, INK = SCN.ink('paper'), BASE = '#2a7ab0', ANS = '#c0402a';
function gen(g) {
  const L = g.level, pick = a => a[Math.floor(g.rand() * a.length)];
  const [a, k] = pick(L === 0 ? [[2, 2], [2, 3], [3, 2]] : L === 1 ? [[2, 4], [3, 3], [5, 2], [10, 2]] : [[2, 5], [3, 4], [10, 3], [4, 3]]);
  return { a, k, N: Math.pow(a, k) };
}
// log with a subscript base (the kit has no subscript, so the base is a superscript shifted down; its box is moved too)
const SUB = 0.62;
function fixSub(g) { const S = g.s, b = M.box(g, 'bs'); if (b && !S.rew) b.y = S.subY; }
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  const copies = () => Object.assign(M.row(...[...Array(S.k)].flatMap((_, i) => [i ? M.op('·') : null, M.num(S.a, null, { col: BASE })])), { id: 'fac', ...pp('fac') });
  const arg = S.sp === 0 ? M.num(S.N, 'N', pp('N')) : S.sp === 1 ? copies() : M.sup(M.num(S.a, null, { col: BASE }), M.num(S.k, 'k', { col: ANS }), 'pw', pp('pw'));
  const log = (A, s) => M.row(M.sup(M.txt('log', 'lg'), M.num(S.a, 'bs', { col: BASE, dy: s * SUB, ...pp('bs') })), M.gap(8), A);
  const mk = s => S.won ? M.row(log(M.num(S.N), s), M.op('=', 'eq'), M.num(S.k, 'ans', { col: ANS, ...pp('ans') }))
    : !S.rew ? M.row(log(S.sp === 1 ? M.paren(arg, 'par') : arg, s), M.op('=', 'eq'), M.slot('q'))
      : M.row(M.sup(M.num(S.a, 'B', { col: BASE, ...pp('B') }), M.slot('q2', { w: s * 0.8 })), M.op('=', 'eq'), arg);
  let s = 60; while (s > 34 && M.lay(mk(s), s).w > 318) s -= 4;
  const e = M.place(g, 'ex', mk(s), 180, 306, s, { col: INK });
  const b = M.box(g, 'bs'); if (b) S.subY = b.y + s * SUB; fixSub(g);
}

MG.add({
  id: 'log', stage: 'logs', cmd: 'LOGARITHM!', hint: 'drag', time: 9, mood: 'bright', winText: 'Logged!', hold: 1.4,
  card: {
    title: 'Logarithms', ref: 'Algebra 2', kind: 'Logarithms',
    text: 'A logarithm answers the question "what power do I need?". log₂ 8 asks: 2 raised to what power makes 8? The small 2 is called the base.\n\nTo find the answer, rewrite the question as a power. log₂ 8 = x means the same thing as 2ˣ = 8. Then write 8 as 2s multiplied together: 8 = 2 · 2 · 2 = 2³. There are three 2s, so x = 3 and log₂ 8 = 3.\n\nA logarithm undoes a power, the way subtraction undoes addition. Because 10³ = 1000, log₁₀ 1000 = 3.',
    note: 'logₐ N = k means aᵏ = N. To find k, write N as copies of a multiplied together and count the copies.',
    ask: 'What is log₃ 9? What is log₂ 32?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.pops = {}; S.sp = 0; S.rew = false;
    build(g); M.inert(g, ['eq', 'lg', 'par']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffd45a', '#7ad0ff', '#fff'], 10, 120); };
    M.play(g, {
      moves(g) {
        const out = [];
        // drag the base onto the number: logₐ N = ? becomes a^? = N
        if (!S.rew && !S.won) out.push({ drag: 'bs', to: [S.sp === 0 ? 'N' : S.sp === 1 ? 'fac' : 'pw', 'q'], busy: 0.1, then(g) { S.rew = true; S.pops.B = g.t; g.sfx('pop'); build(g); burst('B'); } });
        // tap the number to write it as copies of the base
        if (S.sp === 0) out.push({ tap: 'N', busy: 0.1, then(g) { S.sp = 1; S.pops.fac = g.t; g.sfx('pop'); build(g); burst('fac'); } });
        // tap the copies to count them: a · a · a = a³
        if (S.sp === 1) out.push({ tap: 'fac', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.k, wrong: [S.k + 1, S.k - 1, S.N / S.a, S.a] },
          then() {}, resolve(g) { S.sp = 2; S.pops.pw = g.t; g.sfx('coin'); build(g); burst('pw'); } });
        // the powers match, so the exponent is the answer: drag it into the ?
        if (S.sp === 2 && !S.won) out.push({ drag: 'k', to: S.rew ? ['q2', 'B'] : ['q'], busy: 0.1, then(g) { S.won = true; S.pops.ans = g.t; g.sfx('coin'); build(g); burst('ans'); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'forest', panel: 'paper', host: 'beaver', hostX: 74, hostY: 592, hostS: 1.4 });
    M.drawEx(g, c, 'ex'); fixSub(g); M.drawUI(g, c);
  },
});
