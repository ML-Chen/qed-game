// chance_complement.js — COMPLEMENT! P(not A) = 1 − P(A), on a glass pane in a moonlit night, with the outcomes drawn below.
// Moves: tap "not" (or "at least one"): the line "= 1 − P(A)" appears under the problem. Tap P(A): it becomes its
// fraction (the outcomes in A light up). Tap the subtraction: it becomes the answer (A's outcomes dim, the rest glow).
// Level 0: P(not k) for one die. Level 1: P(not even) or P(not odd). Level 2: P(at least one H) in 3 coin flips,
// where 1 − P(no H) = 1 − 1/8 (the 8 outcomes are drawn as columns of three coins).
// Medium mode: P(A) and the subtraction open a tray.
const M = MK, INK = SCN.ink('glass'), HOT = '#e0603a', OK = '#2f9a5a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  if (L === 0) { const k = r(1, 6); return { kind: 'die', word: 'not', ev: M.num(k), evTxt: String(k), inA: f => f === k, m: 1, n: 6 }; }
  if (L === 1) { const even = g.rand() < 0.5; return { kind: 'die', word: 'not', ev: M.txt(even ? 'even' : 'odd'), evTxt: even ? 'even' : 'odd', inA: f => (f % 2 === 0) === even, m: 3, n: 6 }; }
  return { kind: 'coins', word: 'at least one', ev: M.vr('H'), evTxt: 'no H', m: 1, n: 8 };
}
function face(c, x, y, s, f, o) { // a die face, centred at x, y, s wide
  c.save(); c.globalAlpha *= o.alpha; c.fillStyle = 'rgba(20,10,40,0.3)'; c.beginPath(); c.roundRect(x - s / 2 + 2, y - s / 2 + 3, s, s, s * 0.2); c.fill();
  c.fillStyle = o.fill || '#fffaf0'; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s, s * 0.2); c.fill();
  if (o.ring) { c.strokeStyle = o.ring; c.lineWidth = 3.5; c.stroke(); }
  const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[f];
  c.fillStyle = '#2a1840'; for (const [a, b] of P) { c.beginPath(); c.arc(x + a * s * 0.26, y + b * s * 0.26, s * 0.085, 0, 7); c.fill(); } c.restore();
}
function coin(c, x, y, r, heads, alpha) {
  c.save(); c.globalAlpha *= alpha; c.fillStyle = heads ? '#f2c040' : '#c8ccd8'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = heads ? '#a8741a' : '#7a7e90'; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = heads ? '#7a4a0a' : '#4a4e60'; c.font = `700 ${r * 1.2}px Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(heads ? 'H' : 'T', x, y + 0.5); c.restore();
}
MG.add({
  id: 'complement', stage: 'chance', cmd: 'COMPLEMENT!', hint: 'tap', time: 8, mood: 'night', winText: 'Not bad!', hold: 1.4,
  card: {
    title: 'The complement rule', ref: 'Grade 7 and up', kind: 'Statistics',
    text: 'A probability is a number from 0 to 1 that says how likely something is. P(6) means the probability of rolling a 6 on a die. The complement of an event is everything else that can happen: "not 6" means rolling 1, 2, 3, 4 or 5.\n\nAn event and its complement together cover every outcome, so their probabilities add up to 1. That gives the complement rule: P(not A) = 1 − P(A).\n\nFor example, P(not 6) = 1 − 1/6 = 5/6.\n\nThe rule helps when the opposite is easier to count. In 3 coin flips, only 1 of the 8 equally likely outcomes (tails, tails, tails) has no heads. So P(at least one head) = 1 − 1/8 = 7/8.',
    note: 'P(not A) = 1 − P(A). Find the chance of what you do not want, and subtract it from 1.',
    ask: 'A spinner lands on red with probability 2/5. What is P(not red)? What is the probability of at least one 6 in two rolls of a die?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    const ev = () => p.kind === 'coins' ? M.row(M.txt('no'), M.gap(8), M.vr('H')) : { ...p.ev, id: null };
    S.prob = M.row(M.vr('P', 'P'), M.paren(M.row(M.txt(p.word, 'not', { col: '#6a3aa8' }), M.gap(10), { ...p.ev, id: 'ev' }), 'pp'));
    S.work = M.row();
    const place = () => { M.place(g, 'prob', S.prob, 180, 240, p.kind === 'coins' ? 34 : 42); M.place(g, 'work', S.work, 180, 314, 38); };
    place(); M.inert(g, ['P', 'pp', 'eq']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const F = (a, b) => M.frac(M.num(a), M.num(b));
    M.play(g, {
      moves(g) {
        if (!S.s1) return [{ tap: 'not', busy: 0.1, then(g) {
          S.s1 = g.t; g.sfx('swoosh'); const pa = M.row(M.vr('P'), M.paren(ev())); pa.id = 'Pa';
          S.work.items.push(M.op('=', 'eq'), M.gap(6), M.num(1, 'one', { pop: g.t }), M.op('-', 'minus', { pop: g.t }), pa); place(); } }];
        if (!S.s2) return [{ tap: 'Pa', busy: 0.1, ask: { v: F(p.m, p.n), wrong: [F(p.n - p.m, p.n), F(p.n, p.m), F(1, p.n - 1)] },
          then() { S.s2 = 1; }, resolve(g) { S.lit = g.t; S.work.items[4] = M.frac(M.num(p.m), M.num(p.n), 'fa', { pop: g.t, col: HOT }); g.sfx('pop'); place(); } }];
        if (!S.s3) return [{ tap: ['minus', 'one', 'fa'], busy: 0.1, ask: { v: F(p.n - p.m, p.n), wrong: [F(p.m, p.n), F(p.n - p.m + 1, p.n), F(p.n - p.m, p.n - 1)] },
          then() { S.s3 = 1; }, resolve(g) { S.fin = g.t; S.work.items.splice(2); S.work.items.push(M.frac(M.num(p.n - p.m), M.num(p.n), 'ans', { pop: g.t, col: OK })); M.inert(g, ['ans']); g.sfx('chime'); place();
            const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#ffd45a', '#9ae07a', '#fff'], 16, 140); } }];
        return [];
      },
      area(g) { return !S.s1 ? ['not'] : !S.s2 ? ['Pa'] : ['minus']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p;
    SCN.std(g, c, { scene: 'night', panel: 'glass', host: 'owl', hostX: 290, hostY: 598, hostS: 1.3, panelY: 300, panelH: 240 });
    // the outcomes: those in A get a ring once P(A) is written as a fraction; at the end they dim and the rest glow
    const lit = S.lit != null, fin = S.fin != null, glow = fin ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
    if (p.kind === 'die') for (let f = 1; f <= 6; f++) {
      const x = 180 + (f - 3.5) * 48, inA = p.inA(f), bob = fin && !inA ? -3 * glow : 0;
      face(c, x, 382 + bob, 36, f, { alpha: fin && inA ? 0.28 : 1, ring: inA && lit ? HOT : fin ? OK : null, fill: fin && !inA ? '#e8ffe0' : null });
    }
    else for (let k = 0; k < 8; k++) {
      const x = 180 + (k - 3.5) * 38, none = k === 7; // column 7 is tails, tails, tails
      if (fin && !none) { c.fillStyle = `rgba(150,230,140,${0.25 + 0.2 * glow})`; c.beginPath(); c.roundRect(x - 15, 344, 30, 76, 10); c.fill(); }
      if (none && lit) { c.strokeStyle = HOT; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 15, 344, 30, 76, 10); c.stroke(); }
      for (let j = 0; j < 3; j++) coin(c, x, 358 + j * 24, 10, !((k >> (2 - j)) & 1) , fin && none ? 0.3 : 1);
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    M.drawUI(g, c);
  },
});
