// lines_eval.js — EVALUATE! Find f(v) for f(x) = ax ± b, written in light on the water of a reef.
// The question f(v) = ? floats under the definition. Drag the v onto the x of the definition: the question line
// becomes a · v ± b. Tap the product first (multiplication before subtraction), then tap the rest: f(v) is found.
// Tapping the "± b" before the product is the classic order-of-operations slip, so it only wobbles.
// Level 0: small numbers. Level 1: bigger ones. Level 2: a negative input, written in brackets.
// Medium mode: the product and the final sum open a tray.
const M = MK, INK = SCN.ink('none'), IN = '#ffd27a', GO = '#8af0d0';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  const a = L === 0 ? r(2, 4) : r(2, 6), b = L === 0 ? r(1, 5) : r(1, 9), s = g.rand() < 0.5 ? 1 : -1, v = L === 0 ? r(2, 5) : L === 1 ? r(3, 7) : -r(1, 4);
  return { a, b, s, v, pv: a * v, f: a * v + s * b };
}
const nm = (v, id, o) => v < 0 ? M.paren(M.num(v, null, o), id, o) : M.num(v, id, o);

MG.add({
  id: 'lines_eval', stage: 'lines', cmd: 'EVALUATE!', hint: 'drag', time: 9, winText: 'Evaluated!', hold: 1.4,
  card: {
    title: 'Evaluating a function', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'A function is a rule that turns an input into an output. f(x) = 3x − 1 is the rule "multiply the input by 3, then subtract 1". The letter x stands for the input.\n\nTo evaluate the function means to find its output for one input. Write f(4) for the output when the input is 4. Put the 4 in place of every x, then do the arithmetic: multiplication first, then addition and subtraction.\n\nFor example, f(4) = 3 · 4 − 1 = 12 − 1 = 11.\n\nIf the input is negative, keep it in brackets: f(−2) = 3 · (−2) − 1 = −6 − 1 = −7. The brackets stop the minus signs from getting mixed up.',
    note: 'To find f(a), replace every x with a, then multiply before you add or subtract.',
    ask: 'If f(x) = 2x + 5, what is f(3)? What is f(−1)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), sg = p.s < 0 ? '-' : '+';
    S.def = M.row(M.vr('f', 'fd'), M.paren(M.vr('x', 'xf'), 'pf'), M.op('=', 'q1'), M.num(p.a, 'ca'), M.vr('x', 'xt'), M.op(sg, 'pm'), M.num(p.b, 'cb'));
    S.q = M.row(M.vr('f', 'fq'), M.paren(M.num(p.v, 'in', { col: IN }), 'pq'), M.op('=', 'q2'), M.slot('ans', { col: GO }));
    const place = S.place = () => { M.place(g, 'def', S.def, 180, 246, 42, { col: INK }); M.place(g, 'q', S.q, 180, 344, 40, { col: INK }); };
    place(); M.inert(g, ['fd', 'xf', 'pf', 'q1', 'pm', 'fq', 'pq', 'q2']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const fx = (g, id, cols) => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, cols, 12, 120); };
    const sgn = () => M.op(sg, 'pm2'), tail = () => M.num(p.b, 'cb2');
    M.play(g, {
      moves(g) {
        if (!S.subAt) return [{ drag: 'in', to: ['xt', 'ans'], reach: 70, busy: 0.1, then(g) {
          S.subAt = g.t; g.sfx('bubble');
          const pr = M.row(M.num(p.a), M.op('·'), nm(p.v, null, { col: IN })); pr.id = 'pr';
          S.q.items[3] = M.row(pr, sgn(), tail()); place(); fx(g, 'pr', [IN, '#fff']); } }];
        if (!S.tp) return [{ tap: 'pr', busy: 0.1, ask: { v: p.pv, wrong: [p.a + p.v, -p.pv, p.pv + p.a] }, then() { S.tp = 1; },
          resolve(g) { const rs = M.row(nm(p.pv, 'pv', { pop: g.t, col: GO }), sgn(), tail()); rs.id = 'rs'; S.q.items[3] = rs; place(); g.sfx('coin'); fx(g, 'pv', [GO, '#fff']); } }];
        if (!S.tf) return [{ tap: ['rs', 'pv', 'pm2', 'cb2'], busy: 0.1, ask: { v: p.f, wrong: [p.pv - p.s * p.b, p.a * (p.v + p.s * p.b), -p.f] }, then() { S.tf = 1; },
          resolve(g) { S.q.items[3] = M.num(p.f, 'res', { pop: g.t, col: GO }); M.inert(g, ['res']); S.winAt = g.t; place(); g.sfx('chime'); fx(g, 'res', [GO, IN, '#fff']); } }];
        return [];
      },
      area(g) { return !S.subAt ? ['in', 'xt'] : !S.tp ? ['pr'] : ['rs']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'reef', panel: 'none', host: 'octopus', hostX: 286, hostY: 580, hostS: 1.35 });
    // each line rides on a long, dark ribbon of water with a glowing rim, bobbing gently
    for (const [key, y, col] of [['def', 232, 'rgba(120,220,255,0.55)'], ['q', 330, 'rgba(138,240,208,0.6)']]) {
      const e = S.mk.ex[key]; if (!e) continue; const w = e.node._m.w + 48, x = 180 - w / 2, h = 64, bob = Math.sin(t * 1.4 + y) * 2;
      c.save(); c.translate(0, bob); c.fillStyle = 'rgba(4,20,48,0.55)'; c.beginPath(); c.roundRect(x, y - h / 2, w, h, 32); c.fill(); c.strokeStyle = col; c.lineWidth = 2; c.stroke(); c.restore();
    }
    // a stream of bubbles from the x to the question line, right after the input is put in
    if (S.subAt && t - S.subAt < 0.7) { const a = M.box(g, 'xt'), b = M.box(g, 'pr') || M.box(g, 'rs'); if (a && b) for (let i = 0; i < 6; i++) { const k = M.clamp((t - S.subAt) / 0.5 - i * 0.08, 0, 1); if (k <= 0 || k >= 1) continue;
      c.strokeStyle = `rgba(220,250,255,${1 - k})`; c.lineWidth = 1.5; c.beginPath(); c.arc(M.lerp(a.x, b.x, k) + Math.sin(k * 9 + i) * 6, M.lerp(a.y, b.y, k), 3 + i % 3, 0, 7); c.stroke(); } }
    M.drawEx(g, c, 'def'); M.drawEx(g, c, 'q');
    M.drawUI(g, c);
  },
});
