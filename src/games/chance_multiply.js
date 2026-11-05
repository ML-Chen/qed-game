// chance_multiply.js — MULTIPLY PROBS! For independent events, P(A and B) = P(A) · P(B). On a sheet of paper at dusk,
// with a small grid of every outcome under the working line.
// Moves: drag one event onto the other (either way), or tap "and": "= P(A) · P(B)" appears under the problem.
// Tap P(A) and P(B), in either order: each becomes its fraction, and its row or column of the grid lights up.
// Tap the dot: the fractions multiply, and the cells in both light up (one cell of 12 for heads and a 6).
// Level 0: a coin and a die, P(heads and k). Level 1: P(heads and even) and the like. Level 2: two dice (red and blue), P(k and j).
// Medium mode: each fraction and the product open a tray.
const M = MK, INK = SCN.ink('paper'), RED = '#d84a4a', BLUE = '#3a6ad8', GOLD = '#f2b820';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), heads = g.rand() < 0.5;
  if (L === 0) { const k = r(1, 6); return { dice: false, a: M.txt('heads'), b: M.num(k), inA: i => i === 0, inB: j => j === k - 1, mA: 1, nA: 2, mB: 1, nB: 6 }; }
  if (L === 1) { const even = g.rand() < 0.5; return { dice: false, a: M.txt(heads ? 'heads' : 'tails'), b: M.txt(even ? 'even' : 'odd'), inA: i => i === (heads ? 0 : 1), inB: j => ((j + 1) % 2 === 0) === even, mA: 1, nA: 2, mB: 3, nB: 6 }; }
  const k = r(1, 6), j = r(1, 6);
  return { dice: true, a: M.num(k, null, { col: RED }), b: M.num(j, null, { col: BLUE }), inA: i => i === k - 1, inB: q => q === j - 1, mA: 1, nA: 6, mB: 1, nB: 6 };
}
const pips = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
function face(c, x, y, s, f, col) {
  c.fillStyle = col || '#fffaf0'; c.strokeStyle = 'rgba(42,36,64,0.6)'; c.lineWidth = 1.2; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s, s * 0.22); c.fill(); c.stroke();
  c.fillStyle = col ? '#fff' : '#2a2440'; for (const [a, b] of pips[f]) { c.beginPath(); c.arc(x + a * s * 0.26, y + b * s * 0.26, s * 0.09, 0, 7); c.fill(); }
}
MG.add({
  id: 'indep', stage: 'chance', cmd: 'MULTIPLY PROBS!', hint: 'drag', time: 9, mood: 'night', winText: 'Both!', hold: 1.4,
  card: {
    title: 'Independent events', ref: 'Grade 7 and up', kind: 'Statistics',
    text: 'Two events are independent when one of them happening does not change the chance of the other. A coin flip and a die roll are independent: the coin does not care what the die shows.\n\nFor independent events, the probability that both happen is the product of their probabilities: P(A and B) = P(A) · P(B). To multiply two fractions, multiply the tops and multiply the bottoms.\n\nFor example, P(heads and 6) = 1/2 · 1/6 = 1/12.\n\nWhy it works: a coin and a die together have 2 × 6 = 12 equally likely outcomes, such as heads with a 3 or tails with a 6. Exactly one of those 12 is heads with a 6.',
    note: 'If A and B are independent, P(A and B) = P(A) · P(B).',
    ask: 'What is the probability of tails and an even number? What is the probability of rolling two 6s with two dice?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    S.prob = M.row(M.vr('P', 'P'), M.paren(M.row({ ...p.a, id: 'A' }, M.gap(10), M.txt('and', 'and', { col: '#8a5a9a' }), M.gap(10), { ...p.b, id: 'B' }), 'pp'));
    S.work = M.row();
    const top = p.dice ? 216 : 228;
    const place = () => { M.place(g, 'prob', S.prob, 180, top, 38, { col: INK }); M.place(g, 'work', S.work, 180, top + 68, 34, { col: INK }); };
    place(); M.inert(g, ['P', 'pp', 'eq']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const F = (a, b, id, o) => M.frac(M.num(a), M.num(b), id, o);
    const split = { busy: 0.1, then(g) {
      S.split = g.t; g.sfx('swoosh'); const pa = M.row(M.vr('P'), M.paren({ ...p.a, id: null })), pb = M.row(M.vr('P'), M.paren({ ...p.b, id: null })); pa.id = 'PA'; pb.id = 'PB';
      S.work.items.push(M.op('=', 'eq'), M.gap(4), pa, M.op('·', 'dot', { pop: g.t }), pb); place(); } };
    const prob = (k) => {
      const [m, n, m2, n2] = k === 'A' ? [p.mA, p.nA, p.mB, p.nB] : [p.mB, p.nB, p.mA, p.nA];
      return { tap: 'P' + k, busy: 0.1, ask: { v: F(m, n), wrong: [F(n, m), F(n - m, n), F(m, n2)] }, then() { S['q' + k] = 1; },
        resolve(g) { S['f' + k] = g.t; S.work.items[k === 'A' ? 2 : 4] = F(m, n, 'f' + k, { pop: g.t, col: p.dice ? (k === 'A' ? RED : BLUE) : null }); g.sfx('pop'); place(); } };
    };
    const mA = p.mA * p.mB, nA = p.nA * p.nB;
    M.play(g, {
      moves(g) {
        if (!S.split) return [{ drag: 'A', to: 'B', ...split }, { drag: 'B', to: 'A', ...split }, { tap: 'and', ...split }];
        const out = [];
        if (!S.qA) out.push(prob('A'));
        if (!S.qB) out.push(prob('B'));
        if (S.fA && S.fB && !S.qP) out.push({ tap: ['dot', 'fA', 'fB'], busy: 0.1, ask: { v: F(mA, nA), wrong: [F(p.mA + p.mB, p.nA + p.nB), F(mA, p.nA + p.nB), F(p.mA + p.mB, nA)] },
          then() { S.qP = 1; }, resolve(g) { S.fin = g.t; S.work.items.splice(2); S.work.items.push(F(mA, nA, 'ans', { pop: g.t })); M.inert(g, ['ans']); g.sfx('chime'); place();
            const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, [GOLD, '#ff8a5a', '#fff'], 16, 140); } });
        return out;
      },
      area(g) { return !S.split ? ['A', 'B'] : !S.qA ? ['PA'] : !S.qB ? ['PB'] : ['dot']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p;
    SCN.std(g, c, { scene: 'dusk', panel: 'paper', host: 'fox', hostX: 296, hostY: 600, hostS: 1.25, panelY: 300, panelH: p.dice ? 290 : 250 });
    // every outcome as a cell: rows are the first event's outcomes (coin sides, or the red die), columns the die faces
    const rows = p.dice ? 6 : 2, cs = p.dice ? 15 : 28, lab = p.dice ? 16 : 28, gw = 6 * cs + lab, x0 = 180 - gw / 2 + lab, y0 = p.dice ? 356 : 352;
    const lit = (on, k) => on ? M.ease((t - on) / 0.25) * k : 0;
    for (let j = 0; j < 6; j++) face(c, x0 + (j + 0.5) * cs, y0 - lab / 2 - 1, Math.min(cs, lab) * 0.78, j + 1, p.dice ? BLUE : null);
    for (let i = 0; i < rows; i++) {
      const y = y0 + (i + 0.5) * cs;
      if (p.dice) face(c, x0 - lab / 2 - 1, y, lab * 0.78, i + 1, RED);
      else { c.fillStyle = i ? '#c8ccd8' : '#f2c040'; c.beginPath(); c.arc(x0 - lab / 2 - 1, y, cs * 0.36, 0, 7); c.fill(); c.fillStyle = i ? '#4a4e60' : '#7a4a0a'; c.font = `700 ${cs * 0.42}px Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(i ? 'T' : 'H', x0 - lab / 2 - 1, y + 0.5); }
      for (let j = 0; j < 6; j++) {
        const x = x0 + j * cs, a = p.inA(i), b = p.inB(j), both = a && b && S.fin, k = both ? 0.6 + 0.4 * Math.sin(t * 6) : 0;
        c.fillStyle = '#fffdf4'; c.fillRect(x, y0 + i * cs, cs, cs);
        if (a && S.fA) { c.fillStyle = `rgba(216,74,74,${0.28 * lit(S.fA, 1)})`; c.fillRect(x, y0 + i * cs, cs, cs); }
        if (b && S.fB) { c.fillStyle = `rgba(58,106,216,${0.28 * lit(S.fB, 1)})`; c.fillRect(x, y0 + i * cs, cs, cs); }
        if (both) { c.fillStyle = `rgba(242,184,32,${0.6 + 0.3 * k})`; c.fillRect(x + 1, y0 + i * cs + 1, cs - 2, cs - 2); }
        c.strokeStyle = 'rgba(42,36,64,0.45)'; c.lineWidth = 1; c.strokeRect(x + 0.5, y0 + i * cs + 0.5, cs, cs);
      }
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    M.drawUI(g, c);
  },
});
