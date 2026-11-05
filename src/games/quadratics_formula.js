// quadratics_formula.js — QUAD FORMULA! Solve ax² + bx + c = 0 with x = (−b ± √(b² − 4ac)) / 2a.
// A chalkboard in a library. Under the equation a chalk key reads "a = 1  b = −5  c = 6", and under that the formula.
// The player drags each number from the key onto its letter in the formula (any order): every copy of that letter is
// replaced at once, in brackets when negative. Then a tap on the part under the square root works out b² − 4ac, and a
// tap on ± splits the formula into its two answers.
// Level 0: a = 1, two positive roots. Level 1: a = 1, roots of either sign. Level 2: a = 2.
// Medium mode: the value of b² − 4ac and the pair of answers are picked from the tray.
// The font has no √, so the radical sign is drawn over the radicand's box.
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), LET = '#ffc8a0', NEW = '#ffe68a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const p = L === 0 ? r(1, 6) : L === 1 ? r(-6, 6) : r(-4, 4), q = L === 0 ? r(1, 6) : L === 1 ? r(-6, 6) : r(-4, 4), a = L === 2 ? 2 : 1;
    if (!p || !q || p === q || p + q === 0) continue;
    const b = -a * (p + q), c = a * p * q, D = b * b - 4 * a * c;
    if (Math.abs(c) > 36 || D > 144) continue;
    return { a, b, c, D, rt: Math.sqrt(D), hi: Math.max(p, q), lo: Math.min(p, q) };
  }
}
function poly(a, b, c) { return M.row(a === 1 ? null : M.num(a), M.sup(M.vr('x'), M.num(2)), M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? null : M.num(Math.abs(b)), M.vr('x'), M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c)), M.op('='), M.num(0)); }
const sn = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
function swap(n, nn) { for (const k of Object.keys(n)) delete n[k]; Object.assign(n, nn); }

MG.add({
  id: 'quadratics_formula', stage: 'quadratics', cmd: 'QUAD FORMULA!', hint: 'drag', time: 10, mood: 'night', winText: 'Solved!', hold: 1.4,
  card: {
    title: 'The quadratic formula', ref: 'Algebra 1–2', kind: 'Algebra',
    text: 'A quadratic equation has the form ax² + bx + c = 0. Here a is the number in front of x², b is the number in front of x, and c is the number on its own.\n\nThe quadratic formula solves every such equation: x = (−b ± √(b² − 4ac)) / 2a. The sign √ means square root, and ± means "plus or minus", so the formula gives two answers: one with + and one with −.\n\nFor example, x² − 5x + 6 = 0 has a = 1, b = −5 and c = 6. Then b² − 4ac = 25 − 24 = 1, and √1 = 1. So x = (5 + 1) / 2 = 3 or x = (5 − 1) / 2 = 2.\n\nThe formula comes from completing the square on ax² + bx + c = 0, so it works even when the quadratic will not factor.',
    note: 'x = (−b ± √(b² − 4ac)) / 2a. Put in a, b and c, work out b² − 4ac under the square root, then use + for one answer and − for the other.',
    ask: 'Solve x² − 7x + 10 = 0 with the formula. Solve x² + 2x − 8 = 0.',
  },
  init(g) {
    const S = g.s; M.setup(g); const Q = S.q = pick(g);
    M.place(g, 'prob', poly(Q.a, Q.b, Q.c), 180, 222, 32, { col: INK });
    const key = (L, v) => [M.vr(L, null, { col: LET }), M.op('='), M.num(v, 'k' + L, { col: NEW })];
    M.place(g, 'key', M.row(...key('a', Q.a), M.gap(22), ...key('b', Q.b), M.gap(22), ...key('c', Q.c)), 180, 266, 26, { col: INK });
    const lt = (L, id) => M.vr(L, id, { col: LET });
    S.rad = M.row(M.sup(lt('b', 'sb2'), M.num(2)), M.op('-'), M.num(4), lt('a', 'sa1'), lt('c', 'sc')); S.rad.id = 'rad';
    S.form = M.row(M.vr('x'), M.op('='), M.frac(M.row(M.op('-'), lt('b', 'sb1'), M.op('±', 'pm'), M.gap(16), S.rad), M.row(M.num(2), lt('a', 'sa2'))));
    const fit = S.fit = () => { let z = 32; while (z > 16 && M.lay(S.form, z).w > 318) z -= 1; M.place(g, 'form', S.form, 180, 344, z, { col: INK }); };
    fit();
    M.place(g, 'keys', M.row(M.gap(14), M.txt('square root', 'k1'), M.gap(18), M.txt('± plus or minus', 'k2')), 180, 396, 13, { col: 'rgba(250,248,238,0.6)' });
    M.inert(g, ['k1', 'k2']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    S.f = {};
    const T = { a: ['sa1', 'sa2'], b: ['sb1', 'sb2'], c: ['sc'] }, o = { col: NEW };
    const sub = { // each letter becomes its number, written the way you would substitute by hand
      a(g) { swap(M.node(g, 'sa1'), M.row(M.op('·'), sn(Q.a, o))); swap(M.node(g, 'sa2'), M.row(M.op('·'), sn(Q.a, o))); },
      b(g) { swap(M.node(g, 'sb1'), sn(Q.b, o)); swap(M.node(g, 'sb2'), sn(Q.b, o)); },
      c(g) { swap(M.node(g, 'sc'), M.row(M.op('·'), sn(Q.c, o))); },
    };
    M.play(g, {
      moves(g) {
        const out = [];
        for (const L of ['a', 'b', 'c']) if (!S.f[L]) out.push({ drag: 'k' + L, to: T[L], busy: 0.1, then(g) { S.f[L] = true; sub[L](g); S.fit();
          const k = M.node(g, 'k' + L); k.alpha = 0.4; M.inert(g, ['k' + L]); g.sfx('snap'); const b = M.box(g, 'form'); g.burst(b ? b.x : 180, 330, [NEW, '#fff'], 8, 90); } });
        if (out.length) return out;
        if (!S.dDone) return [{ tap: 'rad', busy: 0.1, askAt: 0, after: 0.1, ask: { v: Q.D, wrong: [Q.b * Q.b + 4 * Q.a * Q.c, 4 * Q.a * Q.c - Q.b * Q.b, Q.b * Q.b - 2 * Q.a * Q.c, Q.D + 2] },
          then(g) { S.dDone = true; }, resolve(g) { S.rad.items = [M.num(Q.D, null, { col: NEW, pop: g.t })]; S.fit(); g.sfx('coin'); } }];
        if (!S.pmDone) { const pair = (u, v) => M.row(M.num(u), M.op(','), M.num(v));
          return [{ tap: 'pm', busy: 0.1, askAt: 0, after: 0.1, ask: { v: pair(Q.hi, Q.lo), wrong: [pair(-Q.hi, -Q.lo), pair(-Q.b + Q.rt, -Q.b - Q.rt), pair(Q.hi, -Q.lo)] },
            then(g) { S.pmDone = true; },
            resolve(g) { const x = (v, id) => M.row(M.vr('x'), M.op('='), M.num(v, id, { col: NEW, pop: g.t }));
              M.place(g, 'form', M.row(x(Q.hi, 'r1'), M.gap(14), M.txt('or', 'orr'), M.gap(14), x(Q.lo, 'r2')), 180, 348, 38, { col: INK }); M.inert(g, ['r1', 'r2', 'orr']);
              g.sfx('chime'); g.burst(180, 336, [NEW, '#fff', '#ffb0a0'], 16, 150); } }];
        }
        return [];
      },
      area(g) { const L = ['a', 'b', 'c'].find(L => !S.f[L]); return L ? ['k' + L, T[L][0]] : !S.dDone ? ['rad'] : ['pm']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s; SCN.std(g, c, { scene: 'library', panel: PANEL, panelY: 300, panelH: 210, host: 'owl', hostX: 296, hostY: 600, hostS: 1.15 });
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'key'); M.drawEx(g, c, 'form'); M.drawEx(g, c, 'keys');
    // the square root sign, drawn over the radicand
    const n = M.node(g, 'rad'), b = M.box(g, 'rad');
    if (n && b && !S.pmDone) { const x0 = b.x - b.w / 2 - 2, top = b.y - b.h / 2 - 4, bot = b.y + b.h / 2 + 2, mid = (top + bot) / 2 + 4;
      c.save(); c.strokeStyle = INK; c.lineWidth = 2.6; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(x0 - 15, mid); c.lineTo(x0 - 11, mid - 2); c.lineTo(x0 - 6, bot); c.lineTo(x0 - 1, top); c.lineTo(x0 + b.w + 4, top); c.stroke(); c.restore(); }
    const kb = M.box(g, 'k1'); if (kb) { const x0 = kb.x - kb.w / 2 - 3, top = kb.y - 8, bot = kb.y + 6; c.save(); c.strokeStyle = 'rgba(250,248,238,0.6)'; c.lineWidth = 1.6; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(x0 - 11, kb.y); c.lineTo(x0 - 8, kb.y - 1); c.lineTo(x0 - 5, bot); c.lineTo(x0 - 1, top); c.lineTo(x0 + 4, top); c.stroke(); c.restore(); }
    M.drawUI(g, c);
  },
});
