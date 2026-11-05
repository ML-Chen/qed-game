// counting_arith.js — ARITHMETIC SEQ! Find the common difference of an arithmetic sequence and use it.
// A spring meadow; the sequence is painted on a wooden sign. Show your work:
//   1. Drag one term onto the next term: both light up, "7 − 3 = 4" writes itself above that gap (medium mode: the 4 is
//      picked from the tray), the note shrinks into a "+4" chip, and hop arcs labelled +4 draw themselves under every
//      gap one after another, showing the same step every time.
//   2. Drag the +4 onto the last term (or the empty slot): a copy of 15 and the +4 both fly into the slot, which reads
//      "15 + 4". Tap it: the + 4 slides into the 15, which rolls up to 19, and a last hop arc reaches the new term.
// Level 0: small terms, d = 2–5. Level 1: bigger terms, and the sequence may go down (d < 0).
// Level 2: the nth-term formula: drag the difference onto a₁₀; the slot writes a₁ + (n − 1) · d, and three taps in the
// order of operations work it out in place: (10 − 1) rolls to 9, 9 · 4 rolls to 36, 3 + 36 rolls to 39.
const M = MK, INK = SCN.ink('sign'), NOTE = '#ffe27a';
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return { a: 1 + r(6), d: 2 + r(4) };
  if (L === 1) return g.rand() < 0.45 ? { a: 22 + r(10), d: -(2 + r(4)) } : { a: 2 + r(9), d: 3 + r(7) };
  return { a: 2 + r(7), d: 2 + r(4), n: 8 + r(5) };
}
const sgn = d => (d < 0 ? '−' : '+') + Math.abs(d);
function host(g, c, kind, x, y, s, facing) {
  const S = g.s, mk = S.mk, t = g.t, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hopK * 24, s, { t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}

MG.add({
  id: 'counting_arith', stage: 'counting', cmd: 'ARITHMETIC SEQ!', hint: 'drag', time: 9, mood: 'bright', winText: 'Next term!', hold: 1.6,
  card: {
    title: 'Arithmetic sequences', ref: 'Grade 9 and up', kind: 'Sequences',
    text: 'A sequence is a list of numbers in order, and each number in it is called a term. In an arithmetic sequence, you get each term by adding the same number to the term before it. That number is called the common difference.\n\nTo find the common difference, subtract any term from the term right after it. In 3, 7, 11, 15, the difference is 7 − 3 = 4, so the next term is 15 + 4 = 19.\n\nTo jump straight to term number n, start at the first term and add the difference n − 1 times, because there are n − 1 steps from term 1 to term n. Term 10 of this sequence is 3 + 9 × 4 = 39.',
    note: 'Subtract a term from the next term to get the common difference d. Add d to get the next term. Term number n is the first term plus (n − 1) × d.',
    ask: 'What comes after 5, 9, 13, 17? What is term 20 of 2, 5, 8, 11, …?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, d } = S, T = M.pace(g);
    S.T = [0, 1, 2, 3].map(i => a + i * d); S.L2 = g.level === 2; S.next = S.L2 ? a + (S.n - 1) * d : a + 4 * d;
    S.found = -1; S.dShown = false; S.st = 0; S.arcs = []; // st: 0 = slot empty, then one step per rewrite of the slot
    g.dur *= (2.6 + 1.05 * (S.L2 ? 5 : 3)) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // the slot's working, built from node objects that live for the whole game, so the symbols glide as it shrinks
    const N = S.N = { q: M.slot('q'), last: M.num(S.T[3], 'w0'), op: M.op(d < 0 ? '-' : '+', 'w1'), dv: M.num(Math.abs(d), 'w2'),
      a: M.num(a, 'w0'), plus: M.op('+', 'w1'), nn: M.num(S.n || 0, 'w3'), mi: M.op('-', 'w4'), one: M.num(1, 'w5'), dot: M.op('·', 'w6'), dd: M.num(d, 'w7') };
    N.par = M.paren(M.row(N.nn, N.mi, N.one), 'nm');
    const fill = () => {
      if (!S.L2) return [null, Object.assign(M.row(N.last, N.op, N.dv), { id: 'sm' }), N.last][S.st];
      if (S.st === 1) return M.row(N.a, N.plus, N.par, N.dot, N.dd);
      if (S.st === 2) return M.row(N.a, N.plus, Object.assign(M.row(N.nn, N.dot, N.dd), { id: 'pr' }));
      if (S.st === 3) return Object.assign(M.row(N.a, N.plus, N.nn), { id: 'sm' });
      if (S.st === 4) return N.nn;
      return null;
    };
    S.terms = S.T.map((v, i) => M.num(v, 't' + i));
    const commas = [1, 2, 3, 4].map(i => [M.op(',', 'c' + i), M.gap(9)]), dots = M.txt('…', 'dots');
    S.size = S.L2 ? 38 : 40;
    S.build = () => {
      const items = [];
      S.terms.forEach((n, i) => { if (i) items.push(...commas[i - 1]); items.push(n); });
      N.q.fill = fill(); items.push(...commas[3], S.L2 ? dots : N.q);
      M.place(g, 'seq', M.row(...items), 180, S.L2 ? 250 : 300, S.size, { col: INK });
      if (S.L2) M.place(g, 'frm', M.row(S.an = S.an || M.sup(M.vr('a'), M.num(S.n, null, { dy: 14 }), 'an'), M.op('=', 'eq'), N.q), 180, 356, 32, { col: INK });
    };
    // one size for every step, chosen so the widest step (the slot reading "15 + 4") fits on the sign
    if (!S.L2) { S.st = 1; for (S.build(); M.lay(g.s.mk.ex.seq.node, S.size).w > 318 && S.size > 28; S.build()) S.size -= 2; S.st = 0; }
    S.build(); M.inert(g, ['c1', 'c2', 'c3', 'c4', 'dots', 'eq', 'dd', 'nt', 'w0', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7']);
    const sz = () => S.L2 ? 32 : S.size;
    // fold parts into one number: the parts slide into `keep` and fade, the line closes up, and keep rolls to its new value
    const fold = (g, keep, gone, v, st) => { M.show(g, 0.75 * T); const kb = M.box(g, keep.id);
      for (const q of gone) { const b = M.box(g, q.id); M.tween(g, q, { dx: kb && b ? (kb.x - b.x) * 0.7 : 0, alpha: 0 }, 0.22 * T); }
      M.at(g, [[0.24 * T, g => { for (const q of gone) { q.alpha = 0; q.dx = 0; } S.st = st; S.build(); M.roll(g, keep, v, { dur: 0.28 * T }); g.sfx('ding'); }],
        [0.55 * T, g => { for (const q of gone) q.alpha = 1; keep.pop = g.t; M.unlight(g, keep); M.sparkle(g, keep, { n: 8 }); g.sfx('coin'); hop(g); }],
        [0.75 * T, g => { S.point = false; }]]); };
    const lightAll = (g, list, id) => { S.point = true; hop(g, 'think'); M.circle(g, id, { dur: 0.4 * T, col: NOTE }); list.forEach((q, i) => M.light(g, q, { col: '#ff9a3a', delay: i * 0.05 * T })); };
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. the common difference: a term subtracted from the next one
        if (S.found < 0) {
          for (let i = 0; i < 3; i++) for (const [p, q] of [[i, i + 1], [i + 1, i]]) out.push({
            drag: 't' + p, to: 't' + q, busy: 0.1, askAt: 0.5 * T, after: 1.3 * T, ask: { v: d, wrong: [-d, d + 1, d - 1, S.T[i] + S.T[i + 1]] },
            then(g) { S.found = i; M.show(g, 0.5 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh');
              M.indicate(g, 't' + (i + 1), { col: NOTE, dur: 0.4 * T }); M.indicate(g, 't' + i, { col: NOTE, dur: 0.4 * T, delay: 0.1 * T });
              const b0 = M.box(g, 't' + i), b1 = M.box(g, 't' + (i + 1)); S.res = M.num(d, 'dn', { alpha: 0 });
              S.note = Object.assign(M.row(M.num(S.T[i + 1]), M.op('-'), M.num(S.T[i]), M.op('='), S.res), { id: 'nt' });
              const m = M.lay(S.note, 28), x = M.clamp((b0.x + b1.x) / 2, m.w / 2 + 24, 336 - m.w / 2);
              M.place(g, 'dif', S.note, x, b0.y - b0.h / 2 - 16, 28, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.35 * T, delay: 0.08 * T }); },
            resolve(g) { M.show(g, 1.3 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.18 * T }); g.sfx('ding');
              M.at(g, [[0.3 * T, g => { for (const it of S.note.items) if (it !== S.res) M.tween(g, it, { alpha: 0 }, 0.18 * T); }],
                [0.5 * T, g => { // the note shrinks into the chip "+4" over the gap
                  for (const it of S.note.items) if (it !== S.res) it.alpha = 0; S.res.v = String(Math.abs(d));
                  const chip = Object.assign(M.row(M.op(d < 0 ? '-' : '+', null, { _born: -1 }), S.res), { id: 'd', pop: g.t }); S.note = chip;
                  const e = g.s.mk.ex.dif; M.place(g, 'dif', chip, e.x + M.lay(e.node, 28).w / 2, e.y, 30, { col: NOTE });
                  S.dShown = true; S.dAt = g.t; g.sfx('coin'); hop(g); for (let k = 0; k < 3; k++) M.at(g, [[0.12 * T * k, g => g.sfx('tap')]]); }],
                [1.3 * T, g => { S.point = false; }]]); },
          });
          return out;
        }
        // 2. carry the difference to the end of the sequence (or into the nth-term formula)
        if (S.st === 0) return [{ drag: 'd', to: S.L2 ? ['an', 'q'] : ['t3', 'q'], busy: 0.1, then(g) {
          M.show(g, 0.85 * T); S.point = true; hop(g, 'think'); const db = { ...M.box(g, 'd') }; M.node(g, 'd').hide = true; g.sfx('whoosh');
          const parts = S.L2 ? [N.a, N.plus, N.nn, N.mi, N.one, N.dot, N.dd] : [N.last, N.op, N.dv]; for (const q of parts) q.alpha = 0;
          S.st = 1; S.build(); delete g.s.mk.ex.dif;
          if (!S.L2) M.fly(g, { node: M.num(S.T[3]), from: 't3', to: 'w0', dur: 0.4 * T, arc: -40, s0: S.size, s1: S.size, col: INK, then(g) { N.last.alpha = 1; N.last.pop = g.t; N.op.alpha = 1; } });
          else M.at(g, [[0.1 * T, g => { [N.a, N.plus, N.nn, N.mi, N.one, N.dot].forEach((q, k) => { q.alpha = 1; M.writeIn(g, q, { delay: k * 0.06 * T, dur: 0.12 * T }); }); N.par.pop = g.t; }]]);
          M.fly(g, { node: M.row(M.op(d < 0 ? '-' : '+'), M.num(Math.abs(d))), from: [db.x, db.y], to: S.L2 ? 'w7' : 'w2', dur: 0.45 * T, delay: 0.2 * T, arc: -50, s0: 30, s1: sz(), col: NOTE,
            then(g) { if (S.L2) N.dd.alpha = 1; else { N.dv.alpha = 1; N.op.alpha = 1; } M.sparkle(g, S.L2 ? 'w7' : 'w2', { n: 8 }); g.sfx('pop'); hop(g); } });
          M.at(g, [[0.85 * T, g => { S.point = false; }]]); } }];
        const fm = (o) => ({ busy: 0.1, askAt: 0.4 * T, after: 0.75 * T, ...o });
        if (!S.L2) return S.st === 1 ? [fm({ tap: ['sm', 'q'], ask: { v: S.next, wrong: [S.next + 1, S.next - 1, S.T[3] - d, S.T[3] + 2 * d] },
          then(g) { M.show(g, 0.4 * T); lightAll(g, [N.last, N.op, N.dv], 'sm'); },
          resolve(g) { fold(g, N.last, [N.op, N.dv], S.next, 2); M.at(g, [[0.4 * T, g => { S.arcs.push(g.t); }]]); } })] : [];
        const { n } = S;
        if (S.st === 1) return [fm({ tap: 'nm', ask: { v: n - 1, wrong: [n, n + 1, n - 2] }, then(g) { M.show(g, 0.4 * T); lightAll(g, [N.nn, N.mi, N.one], 'nm'); }, resolve(g) { fold(g, N.nn, [N.mi, N.one], n - 1, 2); } })];
        if (S.st === 2) return [fm({ tap: 'pr', ask: { v: (n - 1) * d, wrong: [n - 1 + d, n * d, (n - 1) * (d + 1)] }, then(g) { M.show(g, 0.4 * T); lightAll(g, [N.nn, N.dot, N.dd], 'pr'); }, resolve(g) { fold(g, N.nn, [N.dot, N.dd], (n - 1) * d, 3); } })];
        if (S.st === 3) return [fm({ tap: ['sm', 'q'], ask: { v: S.next, wrong: [(a + n - 1) * d, S.next + d, S.next - 1] }, then(g) { M.show(g, 0.4 * T); lightAll(g, [N.a, N.plus, N.nn], 'sm'); }, resolve(g) { fold(g, N.nn, [N.a, N.plus], S.next, 4); } })];
        return [];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || [m.drag, m.to]) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'meadow', panel: 'sign' });
    host(g, c, 'rabbit', 300, 600, 1.3, -1);
    // hop arcs under the terms, each labelled with the common difference, drawn one after another once it is known
    if (S.dShown) {
      const pairs = [[0, 1, S.dAt], [1, 2, S.dAt], [2, 3, S.dAt]]; for (const t0 of S.arcs) pairs.push([3, 'q', t0 - 0.36]);
      pairs.forEach(([i, j, t0], k) => {
        const a = M.box(g, 't' + i), b = M.box(g, typeof j === 'number' ? 't' + j : j); if (!a || !b) return;
        const kk = M.ease((t - t0 - (j === 'q' ? 0.36 : k * 0.18)) / 0.3); if (kk <= 0) return;
        const y0 = a.y + a.h / 2 + 6, x0 = a.x + 4, x1 = M.lerp(x0, b.x - 4, kk), hy = y0 + 30;
        c.save(); c.strokeStyle = NOTE; c.lineWidth = 3; c.setLineDash([6, 5]); c.lineCap = 'round';
        c.beginPath(); for (let u = 0; u <= kk + 1e-6; u += 0.05) { const x = M.lerp(x0, b.x - 4, u), y = y0 + Math.sin(u * Math.PI) * 26; u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.setLineDash([]);
        c.fillStyle = NOTE; c.font = M.NUMF(19); c.textAlign = 'center'; c.globalAlpha = kk; c.shadowColor = 'rgba(40,20,10,0.6)'; c.shadowBlur = 4;
        c.fillText(sgn(S.d), (x0 + b.x) / 2, hy + 16); c.restore();
      });
    }
    M.drawEx(g, c, 'seq'); if (S.L2) M.drawEx(g, c, 'frm'); M.drawEx(g, c, 'dif');
    M.drawUI(g, c);
  },
});
