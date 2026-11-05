// counting_comb.js — COMBINATION! Count the handshakes among 5 ducks: C(5, 2) = (5 × 4) ÷ 2!.
// A pond at dusk with fireflies; five ducks float in a ring under a frosted panel that reads C(5, 2) = (5 × 4) / □, with
// a 2! chip beside it. The player drags the 2! into the empty bottom of the fraction (each handshake was counted twice,
// once from each duck's side), and it becomes 2 × 1. Taps on 5 × 4 and on 2 × 1, in either order, multiply them
// (medium mode: picked from the tray), and a tap on 20/2 makes 10. On the win, the 10 handshake lines are drawn between
// the ducks one by one.
// Level 0: 4 ducks. Level 1: 5 ducks. Level 2: 6 or 7 ducks.
const M = MK, INK = SCN.ink('glass');

MG.add({
  id: 'counting_comb', stage: 'counting', cmd: 'COMBINATION!', hint: 'drag', time: 9, mood: 'night', winText: 'Quack quack!', hold: 1.6,
  card: {
    title: 'Combinations', ref: 'Grade 11 and up', kind: 'Counting',
    text: 'A combination is a choice of a group where order does not matter. C(5, 2), said "5 choose 2", is the number of ways to choose 2 things from 5. It is also the number of handshakes when 5 ducks each shake hands once with every other duck.\n\nFirst count as if order mattered: 5 choices for the first duck and 4 for the second makes 5 × 4 = 20. But that counts every pair twice, as "A then B" and as "B then A". The 2 ducks can be put in order in 2! = 2 × 1 = 2 ways, so divide by 2!: 20 ÷ 2 = 10.\n\nIn general, C(n, k) = n! ÷ (k! (n − k)!).',
    note: 'Count the ordered choices, then divide by k!, the number of orders the k chosen things can be in.',
    ask: 'How many handshakes do 6 people make? What is C(4, 2)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const L = g.level;
    S.n = L === 0 ? 4 : L === 1 ? 5 : 6 + Math.floor(g.rand() * 2); S.top = S.n * (S.n - 1); S.ans = S.top / 2;
    S.denIn = S.numDone = S.denDone = S.done = false; g.dur *= (2.6 + 1.05 * 4) / 8;
    S.build = () => {
      const p = { pop: g.t };
      let right;
      if (S.done) right = M.num(S.ans, null, p);
      else {
        const nm = S.numDone ? M.num(S.top, 'nv', p) : Object.assign(M.row(M.num(S.n), M.op('×'), M.num(S.n - 1)), { id: 'num' });
        const dn = !S.denIn ? M.slot('q') : S.denDone ? M.num(2, 'dv', p) : Object.assign(M.row(M.num(2), M.op('×'), M.num(1)), { id: 'den', pop: g.t });
        right = M.frac(nm, dn, S.numDone && S.denDone ? 'fr' : 'fb');
      }
      M.place(g, 'ex', M.row(M.vr('C'), M.paren(M.row(M.num(S.n), M.op(','), M.num(2)), 'nk'), M.op('=', 'eq'), right), S.denIn ? 180 : 154, 300, 40, { col: INK });
    };
    S.build(); M.inert(g, ['nk', 'eq', 'fb', 'nv', 'dv']);
    const chip = M.row(M.num(2), M.txt('!')); chip.id = 'k'; M.place(g, 'tok', chip, 296, 300, 40, { col: '#fff6e0' });
    const pt = (g, fn) => g => { fn(g); S.build(); g.sfx('coin'); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.denIn) out.push({ drag: 'k', to: 'q', reach: 110, busy: 0.12, then(g) { S.denIn = true; M.node(g, 'k').hide = true; S.build(); g.sfx('whoosh'); } });
        if (S.denIn && !S.denDone) out.push({ tap: 'den', busy: 0.1, ask: { v: 2, wrong: [1, 3, 4] }, then() {}, resolve: pt(g, () => { S.denDone = true; }) });
        if (!S.numDone) out.push({ tap: 'num', busy: 0.1, ask: { v: S.top, wrong: [2 * S.n - 1, S.n * S.n, S.top - S.n] }, then() {}, resolve: pt(g, () => { S.numDone = true; }) });
        if (S.numDone && S.denDone && !S.done) out.push({ tap: 'fr', busy: 0.1, ask: { v: S.ans, wrong: [S.top, S.ans + 1, S.top - 2, S.ans - 1] }, then() {}, resolve: pt(g, () => { S.done = true; S.doneAt = g.t; }) });
        return out;
      },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, won = g.done && g.result === 'win';
    SCN.std(g, c, { scene: 'dusk', panel: 'glass', panelH: 150, panelY: 300 });
    // the dark pond with a ring of ducks
    c.fillStyle = 'rgba(30,24,70,0.75)'; c.beginPath(); c.ellipse(180, 512, 170, 78, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(255,210,160,0.25)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const k = (t * 0.3 + i / 3) % 1; c.beginPath(); c.ellipse(180, 512, 40 + k * 120, 18 + k * 54, 0, 0, 7); c.globalAlpha = 1 - k; c.stroke(); } c.globalAlpha = 1;
    const P0 = [...Array(S.n)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / S.n; return { x: 180 + Math.cos(a) * 128, y: 516 + Math.sin(a) * 52 }; });
    // the handshakes: one line for every pair of ducks, drawn one by one once the count is known
    if (S.done) { let k = 0; for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++, k++) { const kk = M.ease((t - S.doneAt - k * 0.05) / 0.15); if (kk <= 0) continue;
      const a = P0[i], b = P0[j]; c.strokeStyle = `hsla(${(k * 37) % 360},90%,72%,0.9)`; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(a.x, a.y - 18); c.lineTo(M.lerp(a.x, b.x, kk), M.lerp(a.y, b.y, kk) - 18); c.stroke(); } }
    P0.slice().map((p, i) => ({ ...p, i })).sort((p, q) => p.y - q.y).forEach(p => {
      const bob = Math.sin(t * 2 + p.i) * 2;
      try { ANI.draw(c, 'duck', p.x, p.y + bob, 0.62, { t, phase: p.i, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : 'happy', facing: p.x > 180 ? -1 : 1, noShadow: true }); } catch (e) { P.sheep(c, p.x, p.y, 0.5, { t }); }
    });
    // the 2! chip floats on a lily pad beside the fraction
    const kb = M.box(g, 'k'), kn = M.node(g, 'k');
    if (kb && kn && !kn.hide) { c.fillStyle = '#5ab86a'; c.beginPath(); c.arc(kb.x, kb.y, 34 + Math.sin(t * 2) * 1.5, 0.3, Math.PI * 2 - 0.3); c.lineTo(kb.x, kb.y); c.fill(); c.strokeStyle = '#2e7a40'; c.lineWidth = 2; c.stroke(); }
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'tok');
    M.drawUI(g, c);
  },
});
