// foil_diffsq.js — DIFF OF SQ! Factor a difference of two squares: x² − k² = (x + k)(x − k).
// The player taps x² to write it as x · x and taps k² to write it as k · k (either order). Then the player drags one
// square root (an x, then a k, in either order) onto the answer line: it drops into the matching place in both brackets.
// Level 0: x² − k² with k from 2 to 5. Level 1: k from 4 to 9. Level 2: a²x² − k², such as 4x² − 9 = (2x + 3)(2x − 3).
// Medium mode: each square root is picked from the tray.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), XC = '#2a64b0', KC = '#c03a5a';
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { a: 1, k: 2 + r(4) };
  if (L === 1) return { a: 1, k: 4 + r(6) };
  const a = 2 + r(2); let k; do k = 1 + r(6); while (k % a === 0); return { a, k }; // a and k share no factor, so the answer is fully factored
}
const root = (a, id, col) => { const n = a === 1 ? M.vr('x', id) : M.row(M.num(a), M.vr('x')); if (a !== 1) n.id = id; n.col = col; if (n.items) n.items.forEach(q => q.col = col); return n; };
const dots = (p, q) => M.row(p, M.op('·'), q);

MG.add({
  id: 'diffsq', stage: 'foil', cmd: 'DIFF OF SQ!', hint: 'tap', time: 9, winText: 'Factored!', hold: 1.4,
  card: {
    title: 'Difference of squares', ref: 'Algebra 1', kind: 'Algebra',
    text: 'A square is a number times itself: 9 is a square because 9 = 3 · 3, and x² = x · x. A difference is what you get when you subtract.\n\nWhen one square is subtracted from another, the expression factors into two brackets: one with a plus sign and one with a minus sign. The rule is a² − b² = (a + b)(a − b).\n\nFor example, x² − 9 = x · x − 3 · 3, so it factors as (x + 3)(x − 3).\n\nWhy does it work? Multiply the brackets back out: (x + 3)(x − 3) = x² − 3x + 3x − 9. The −3x and the +3x cancel, and only x² − 9 is left.',
    note: 'Write each square as something times itself. Put the two square roots in both brackets, once with + and once with −: a² − b² = (a + b)(a − b).',
    ask: 'Factor x² − 25. Factor 9x² − 4.',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, k } = S;
    S.sq = a === 1 ? M.sup(M.vr('x'), M.num(2), 'sq') : M.row(M.num(a * a), M.sup(M.vr('x'), M.num(2))); S.sq.id = 'sq';
    S.kk = M.num(k * k, 'kk');
    S.top = M.row(S.sq, M.op('-', 'mi'), S.kk);
    S.slots = ['a1', 'b1', 'a2', 'b2'].map(id => M.slot(id));
    const [a1, b1, a2, b2] = S.slots;
    S.ans = M.row(M.op('=', 'eq'), M.gap(4), M.paren(M.row(a1, M.op('+'), b1), 'p1'), M.paren(M.row(a2, M.op('-'), b2), 'p2'));
    const place = () => { M.place(g, 'top', S.top, 180, 262, a > 1 ? 44 : 52, { col: INK }); M.place(g, 'ans', S.ans, 180, 352, 34, { col: INK }); };
    S.relay = place; place();
    M.inert(g, ['mi', 'eq', 'p1', 'p2', 'a1', 'a2', 'b1', 'b2']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.xOpen) out.push({ tap: 'sq', busy: 0.1, ...(a > 1 ? { ask: { v: root(a), wrong: [M.row(M.num(a * a), M.vr('x')), M.vr('x'), M.row(M.num(a + 1), M.vr('x'))] }, askAt: 0, after: 0.1 } : {}),
          then(g) { S.xOpen = 1; if (a === 1) this.resolve(g); },
          resolve(g) { S.xOpen = 2; S.top.items[0] = dots(root(a, 'ra', XC), root(a, 'rb', XC)); S.top.items[0].items.forEach(n => n.pop = g.t); place(); g.sfx('chime'); } });
        if (!S.kOpen) out.push({ tap: 'kk', busy: 0.1, ask: { v: k, wrong: [k + 1, k - 1, k * k, k * 2] }, askAt: 0, after: 0.1,
          then(g) { S.kOpen = 1; },
          resolve(g) { S.kOpen = 2; S.top.items[2] = dots(M.num(k, 'ka', { col: KC, pop: g.t }), M.num(k, 'kb', { col: KC, pop: g.t })); place(); g.sfx('chime'); } });
        const Y = 352, area = [10, Y - 50, 350, Y + 40];
        if (S.xOpen === 2 && !S.xIn) out.push({ drag: ['ra', 'rb'], to: ['a1', 'a2'], area, busy: 0.1,
          then(g) { S.xIn = true; [S.slots[0], S.slots[2]].forEach(s => { s.fill = root(a, null, XC); s.fill.pop = g.t; }); place(); g.sfx('pop'); const b = M.box(g, 'p1'); if (b) g.burst(b.x, b.y, ['#9ad0ff', '#fff'], 8, 110); } });
        if (S.kOpen === 2 && !S.kIn) out.push({ drag: ['ka', 'kb'], to: ['b1', 'b2'], area, busy: 0.1,
          then(g) { S.kIn = true; [S.slots[1], S.slots[3]].forEach(s => { s.fill = M.num(k, null, { col: KC, pop: g.t }); }); place(); g.sfx('pop'); const b = M.box(g, 'p2'); if (b) g.burst(b.x, b.y, ['#ffb0c0', '#fff'], 8, 110); } });
        return out;
      },
      area(g) { return S.xOpen !== 2 ? 'sq' : S.kOpen !== 2 ? 'kk' : !S.xIn ? ['ra', 'a1'] : ['ka', 'b1']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'snow', panel: PANEL, host: 'penguin', hostX: 76, hostY: 588, hostS: 1.35 });
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'ans');
    M.drawUI(g, c);
  },
});
