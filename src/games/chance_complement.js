// chance_complement.js — COMPLEMENT! P(not A) = 1 − P(A), on a glass pane in a moonlit night, with the outcomes drawn below.
// Moves: tap "not" (or "at least one"): "= 1 − P(A)" writes itself under the problem and every outcome shimmers
// (that is the 1). Tap P(A): it becomes a fraction over the number of outcomes, and A's outcomes light up one by one
// while its top counts them. Tap the subtraction: A's outcomes dim, the line collapses into the answer's fraction, and
// the leftover outcomes light up one by one while its top counts up to the answer.
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
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g);
    const ev = () => p.kind === 'coins' ? M.row(M.txt('no'), M.gap(8), M.vr('H')) : { ...p.ev, id: null };
    S.prob = M.row(M.vr('P', 'P'), M.paren(M.row(M.txt(p.word, 'not', { col: '#6a3aa8' }), M.gap(10), { ...p.ev, id: 'ev' }), 'pp'));
    S.work = M.row();
    const place = () => { M.place(g, 'prob', S.prob, 180, 240, p.kind === 'coins' ? 34 : 42); M.place(g, 'work', S.work, 180, 314, 38); };
    S.relay = place; place(); M.inert(g, ['P', 'pp', 'eq', 'cn', 'cd']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const F = (a, b) => M.frac(M.num(a), M.num(b));
    // every outcome, as a picture under the problem: A's outcomes, and the rest (its complement)
    S.out = p.kind === 'die' ? [1, 2, 3, 4, 5, 6].map(f => ({ f, inA: p.inA(f), x: 180 + (f - 3.5) * 48, y: 382 })) : [...Array(8)].map((_, k) => ({ k, inA: k === 7, x: 180 + (k - 3.5) * 38, y: 382 }));
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, ex) => { S.hopT = g.t; S.face = ex || 'wow'; S.faceT = g.t; };
    // count a set of outcomes one by one: each lights up in turn and the counter (a numerator) rolls up with it
    const count = (g, list, key, numNode, t0, step, col) => list.forEach((o, i) => M.at(g, [[t0 + i * step, g => { o[key] = g.t; if (numNode) { if (i) M.roll(g, numNode, i + 1, { dur: Math.min(0.18, step * 0.9) }); numNode.pop = g.t; }
      g.burst(o.x, o.y - 22, [col, '#fff'], 5, 70); g.sfx(i % 2 ? 'tap' : 'pop'); S.hopT = g.t; }]]));
    M.play(g, {
      moves(g) {
        // 1. the complement rule: "= 1 − P(A)" writes itself under the problem while "not" is circled
        if (!S.s1) return [{ tap: 'not', busy: 0.1, then(g) {
          S.s1 = g.t; M.show(g, 0.9 * T); g.sfx('swoosh'); hop(g, 'think'); S.point = true; const pa = M.row(M.vr('P'), M.paren(ev())); pa.id = 'Pa';
          M.circle(g, 'not', { dur: 0.5 * T, col: '#b48ae8' });
          S.work.items.push(M.op('=', 'eq'), M.gap(6), M.num(1, 'one'), M.op('-', 'minus'), pa); place();
          M.writeIn(g, S.work, { dur: 0.6 * T, delay: 0.2 * T });
          // "1" means every outcome: all of them shimmer once
          M.at(g, [[0.55 * T, g => { for (const o of S.out) o.all = g.t; M.indicate(g, 'one', { dur: 0.35 * T, col: '#ffe9a0' }); }], [0.85 * T, g => { S.point = false; }]]); } }];
        // 2. P(A) becomes its fraction: the bottom (all outcomes) writes itself, then A's outcomes light one by one
        //    while the top counts them
        if (!S.s2) return [{ tap: 'Pa', busy: 0.1, askAt: (0.35 + 0.22 * p.m) * T, after: 0.5 * T, ask: { v: F(p.m, p.n), wrong: [F(p.n - p.m, p.n), F(p.n, p.m), F(1, p.n - 1)] },
          then(g) { S.s2 = 1; const step = 0.22 * T; M.show(g, (0.35 + step * p.m) * T); hop(g, 'think'); S.point = true;
            S.num = M.num(1, 'cn', { col: HOT, alpha: 0 }); S.den = M.num(p.n, 'cd', { col: HOT });
            S.work.items[4] = M.frac(S.num, S.den, 'fa', { col: HOT, bar: { t0: g.t, dur: 0.3 * T } }); place(); M.writeIn(g, S.den, { dur: 0.3 * T }); g.sfx('swoosh');
            M.at(g, [[0.3 * T, g => { S.num.alpha = 1; }]]);
            count(g, S.out.filter(o => o.inA), 'litA', S.num, 0.3 * T, step, HOT); },
          resolve(g) { M.show(g, 0.5 * T); M.indicate(g, 'fa', { dur: 0.35 * T, col: HOT }); M.sparkle(g, 'fa', { n: 8, cols: [HOT, '#fff'] }); g.sfx('ding'); hop(g); S.point = false; } }];
        // 3. the subtraction: A's outcomes dim and the leftover outcomes light one by one, counting the answer's top
        if (!S.s3) return [{ tap: ['minus', 'one', 'fa'], busy: 0.1, askAt: 0.45 * T, after: (0.3 + 0.16 * (p.n - p.m) + 0.5) * T,
          ask: { v: F(p.n - p.m, p.n), wrong: [F(p.m, p.n), F(p.n - p.m + 1, p.n), F(p.n - p.m, p.n - 1)] },
          then(g) { S.s3 = 1; M.show(g, 0.45 * T); hop(g, 'think'); S.point = true; M.circle(g, ['one', 'minus', 'fa'], { dur: 0.5 * T, col: OK });
            M.at(g, [[0.2 * T, g => { S.dimA = g.t; g.sfx('whoosh'); }]]); },
          resolve(g) { const k = p.n - p.m, step = 0.16 * T; M.show(g, (0.3 + step * k + 0.5) * T);
            // the whole line collapses into the answer's fraction, whose top counts the leftover outcomes
            for (const n of S.work.items.slice(2)) M.tween(g, n, { alpha: 0, sc: 0.7 }, 0.25 * T);
            M.at(g, [[0.25 * T, g => { S.fin = g.t; S.ansN = M.num(1, 'an', { col: OK }); S.work.items.splice(2); S.work.items.push(M.frac(S.ansN, M.num(p.n), 'ans', { col: OK, bar: { t0: g.t, dur: 0.25 * T } })); M.inert(g, ['ans', 'an']); place(); g.sfx('chime'); }]]);
            count(g, S.out.filter(o => !o.inA), 'litC', null, 0.3 * T, step, OK);
            S.out.filter(o => !o.inA).forEach((o, i) => M.at(g, [[0.3 * T + i * step, g => { if (S.ansN) { if (i) M.roll(g, S.ansN, i + 1, { dur: Math.min(0.15, step * 0.9) }); S.ansN.pop = g.t; } }]]));
            M.at(g, [[(0.3 + step * k + 0.1) * T, g => { M.sparkle(g, 'ans', { n: 16, v: 140, cols: ['#ffd45a', '#9ae07a', '#fff'] }); hop(g, 'laugh'); S.point = false; }]]); } }];
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
    SCN.std(g, c, { scene: 'night', panel: 'glass', panelY: 300, panelH: 240 });
    // the outcomes: those in A light up one by one as they are counted; at the end they dim and the rest light up in turn
    const pk = v => v == null || t < v ? 0 : M.clamp((t - v) / 0.3, 0, 1), sw = v => v == null || t < v ? 0 : Math.sin(M.clamp((t - v) / 0.3, 0, 1) * Math.PI);
    const dim = S.dimA != null ? M.clamp((t - S.dimA) / 0.3, 0, 1) : 0, glow = 0.5 + 0.5 * Math.sin(t * 6);
    for (const o of S.out) {
      const la = pk(o.litA), lc = pk(o.litC), pop = 1 + 0.35 * (sw(o.litA) + sw(o.litC)) + 0.12 * sw(o.all), bob = lc > 0 ? -3 * glow * lc : 0;
      const alpha = o.inA ? 1 - 0.7 * dim : 1;
      c.save(); c.translate(o.x, o.y + bob); c.scale(pop, pop); c.translate(-o.x, -o.y - bob);
      if (p.kind === 'die') face(c, o.x, o.y + bob, 36, o.f, { alpha, ring: o.inA && la > 0 ? HOT : lc > 0 ? OK : null, fill: lc > 0 ? '#e8ffe0' : la > 0 && !dim ? '#ffe8dc' : null });
      else { const x = o.x;
        if (lc > 0) { c.fillStyle = `rgba(150,230,140,${(0.25 + 0.2 * glow) * lc})`; c.beginPath(); c.roundRect(x - 15, 344, 30, 76, 10); c.fill(); }
        if (o.inA && la > 0) { c.globalAlpha = 1 - 0.5 * dim; c.strokeStyle = HOT; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 15, 344, 30, 76, 10); c.stroke(); c.globalAlpha = 1; }
        for (let j = 0; j < 3; j++) coin(c, x, 358 + j * 24, 10, !((o.k >> (2 - j)) & 1), alpha); }
      c.restore();
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    // the owl points at the problem while the work is shown, and hops on every count
    const hk = t - S.hopT < 0.3 ? Math.sin((t - S.hopT) / 0.3 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : S.point && M.showing(g) ? 'point' : hk > 0 ? 'hop' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 290, 598 - hk * 16, 1.3, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', 290, 598, 1.3);
    M.drawUI(g, c);
  },
});
