// counting_fact.js — FACTORIAL! Write n! out as a product and multiply it down.
// A sunny kitchen; the problem is written on a recipe card and a hedgehog bakes alongside. The player taps 5! and the
// right side becomes 5 × 4 × 3 × 2 × 1. Then the player drags any factor onto any other factor: the two multiply
// (medium mode: picked from the tray) and become one number, until only 120 is left. Any order works, because
// multiplication can be done in any order.
// Level 0: 4!. Level 1: 5!. Level 2: 7!/5! (or 6!/4!, 8!/6!): tapping 7! writes it as 7 × 6 × 5! over 5!; dragging one
// 5! onto the other cancels them, and 7 × 6 is left to multiply (in either order).
const M = MK, INK = SCN.ink('paper');
const factN = (m, id, o) => { const r = M.row(M.num(m), M.txt('!')); r.id = id; Object.assign(r, o || {}); return r; };

MG.add({
  id: 'counting_fact', stage: 'counting', cmd: 'FACTORIAL!', hint: 'drag', time: 9, mood: 'bright', winText: 'Cooked!', hold: 1.4,
  card: {
    title: 'Factorials', ref: 'Grade 11 and up', kind: 'Counting',
    text: 'The factorial of a whole number n, written n!, is n multiplied by every whole number below it, down to 1. For example, 5! = 5 × 4 × 3 × 2 × 1 = 120.\n\nFactorials count arrangements. Five books can stand on a shelf in 5! = 120 orders: there are 5 choices for the first spot, then 4 for the next, and so on.\n\nA fraction of two factorials is easy to work out, because most of the factors cancel. Since 7! = 7 × 6 × 5!, the fraction 7! ÷ 5! is just 7 × 6 = 42.\n\nBy agreement, 0! = 1, because there is exactly one way to arrange nothing.',
    note: 'Multiply n by every whole number below it, down to 1. To divide factorials, write the bigger one as a product that ends in the smaller one, and cancel.',
    ask: 'What is 4!? What is 6! ÷ 4!?',
  },
  init(g) {
    const S = g.s; M.setup(g); const L = g.level, r = k => Math.floor(g.rand() * k);
    S.L2 = L === 2; S.uid = 0; S.st = 0;
    if (S.L2) { [S.n, S.m] = [[7, 5], [6, 4], [8, 6]][r(3)]; S.ans = S.n * (S.n - 1); }
    else { S.n = L === 0 ? 4 : 5; S.ans = S.n === 4 ? 24 : 120; }
    g.dur *= (2.6 + 1.05 * (S.L2 ? 3 : S.n)) / 8;
    const fnode = f => f.fact ? factN(f.fact, f.id) : f.pend ? Object.assign(M.row(M.num(f.pend[0]), M.op('·'), M.num(f.pend[1])), { id: f.id, pop: g.t }) : M.num(f.v, f.id, f.pop ? { pop: f.pop } : null);
    S.build = () => {
      const left = S.L2 ? M.frac(factN(S.n, 'nf'), factN(S.m, 'df')) : factN(S.n, 'nf');
      let right = null;
      if (S.st) { const prod = M.row(...S.F.flatMap((f, i) => [i ? M.op('×', 'x' + f.id) : null, fnode(f)])); right = S.den ? M.frac(prod, factN(S.m, 'den')) : prod; }
      M.place(g, 'ex', M.row(left, M.op('=', 'eq'), right || M.slot('q')), 180, S.L2 ? 302 : 296, S.L2 ? 44 : S.n === 4 ? 46 : 42, { col: INK });
      M.inert(g, S.F ? S.F.map(f => 'x' + f.id) : []);
    };
    S.build(); M.inert(g, ['eq']);
    const fac = v => ({ v, id: 'f' + S.uid++ });
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ tap: 'nf', busy: 0.12, then(g) {
          S.st = 1; S.expAt = g.t; S.F = [];
          if (S.L2) { S.F = [fac(S.n), fac(S.n - 1), { fact: S.m, id: 'f' + S.uid++ }]; S.den = true; } else for (let k = S.n; k >= 1; k--) S.F.push(fac(k));
          S.F.forEach(f => f.pop = g.t); S.build(); g.sfx('whoosh');
        } }];
        const out = [], plain = S.F.filter(f => !f.fact);
        if (S.den) { const nf = S.F.find(f => f.fact); out.push({ drag: nf.id, to: 'den', busy: 0.12, then(g) { cancel(g); } }, { drag: 'den', to: nf.id, busy: 0.12, then(g) { cancel(g); } }); }
        for (const a of plain) for (const b of plain) if (a !== b) out.push({
          drag: a.id, to: b.id, busy: 0.1, ask: { v: a.v * b.v, wrong: [a.v + b.v, a.v * b.v + a.v, a.v * (b.v + 1), a.v * b.v - 1] },
          then(g) { S.F.splice(S.F.indexOf(a), 1); b.pend = [a.v, b.v]; b.id = 'f' + S.uid++; S.build(); g.sfx('pop'); },
          resolve(g) { b.v = a.v * b.v; b.pend = null; b.pop = g.t; S.build(); g.sfx('coin'); const bx = M.box(g, b.id); if (bx) g.burst(bx.x, bx.y, ['#ffd45a', '#ff9a6a', '#fff'], 8, 110); },
        });
        // put the move that pairs neighbours from the left first, so the guidance shows the most natural one
        if (S.den) return out;
        return out.sort((p, q) => (S.F.indexOf(S.F.find(f => f.id === p.drag)) * 10 + S.F.indexOf(S.F.find(f => f.id === p.to))) - (S.F.indexOf(S.F.find(f => f.id === q.drag)) * 10 + S.F.indexOf(S.F.find(f => f.id === q.to))));
      },
    });
    function cancel(g) { const nb = M.box(g, 'den'), nf = S.F.find(f => f.fact); S.cx = [nb && { ...nb }, nf && M.box(g, nf.id) && { ...M.box(g, nf.id) }]; S.F = S.F.filter(f => !f.fact); S.den = false; S.cancelAt = g.t; S.build(); g.sfx('swoosh'); if (nb) g.burst(nb.x, nb.y - 24, ['#d8454a', '#fff', '#ffd45a'], 12, 130); }
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', panelH: 190, host: 'hedgehog', hostX: 92, hostY: 456, hostS: 1.2 });
    // a pot on the counter, a timer bell, and a row of cookies that fills as the factors merge
    c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(222, 416, 92, 40, [0, 0, 16, 16]); c.fill(); c.fillStyle = '#7a7a8a'; c.fillRect(214, 410, 108, 10); c.fillRect(316, 420, 18, 6);
    const left = S.F ? S.F.length : S.n, done = S.st ? Math.max(0, (S.L2 ? 3 : S.n) - left) : 0;
    for (let i = 0; i < 4; i++) { const x = 40 + i * 44, y = 540 + Math.sin(t * 2 + i) * 1.5, on = i < done || g.done && g.result === 'win';
      c.fillStyle = on ? '#d89a4a' : 'rgba(255,255,255,0.25)'; c.beginPath(); c.arc(x, y, 15, 0, 7); c.fill(); if (on) { c.fillStyle = '#5a3218'; for (const [dx, dy] of [[-5, -4], [4, -2], [-1, 5]]) { c.beginPath(); c.arc(x + dx, y + dy, 2.2, 0, 7); c.fill(); } } }
    M.drawEx(g, c, 'ex');
    // the cancelled factorials: two red strokes that fade
    if (S.cancelAt != null && t - S.cancelAt < 0.6) { const k = (t - S.cancelAt) / 0.6; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#d8454a'; c.lineWidth = 4; c.lineCap = 'round';
      for (const b of S.cx) if (b) { c.beginPath(); c.moveTo(b.x - b.w / 2 - 4, b.y + b.h / 2 + 4 - k * 10); c.lineTo(b.x + b.w / 2 + 4, b.y - b.h / 2 - 4 - k * 10); c.stroke(); } c.restore(); }
    M.drawUI(g, c);
  },
});
