// complex_isq.js — I SQUARED! The imaginary unit: i · i = i² = −1.
// Level 0: i · i. The player drags one i onto the other (i · i becomes i²), then taps i² (it becomes −1). Below the
// glass panel a complex plane shows the meaning: the point 1 turns a quarter turn for each factor of i and lands on −1.
// Level 1: numbers in front (3i · 2i): dragging gathers the numbers into (3 · 2), tapped to multiply; then 6 · (−1).
// Level 2: one of the numbers is negative, so the sign flips twice. Medium mode: every tap opens the tray.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), ICOL = '#6a2ac0';
const OX = 180, OY = 452, U = 68; // the complex plane: origin and one unit in px
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return null;
  let a = 2 + r(4), b = 2 + r(4);
  if (L === 2) { if (g.rand() < 0.5) a = -a; else b = -b; }
  return [a, b];
}
// the expression is rebuilt from the state after every move; S.pops[id] is when that part last changed (it pops)
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] }), I = id => M.vr('i', id, { col: ICOL, ...pp(id) });
  let items;
  if (S.ans != null) items = [M.num(S.ans, 'ans', pp('ans'))];
  else if (S.co && S.cs === 'sep' && S.is === 'sep') items = [M.num(S.co[0], 'c0'), I('i0'), M.gap(10), M.op('·', 'dot'), M.gap(10), M.num(S.co[1], 'c1'), I('i1')];
  else if (S.co && S.cs === 'done' && S.is === 'neg') items = [Object.assign(M.row(M.num(S.cv), M.op('·'), M.paren(M.num(-1))), { id: 'fin', pop: S.pops.fin })];
  else {
    const C = !S.co ? null : S.cs === 'done' ? M.num(S.cv, 'cv', pp('cv')) : M.paren(M.row(M.num(S.co[0]), M.op('·'), M.num(S.co[1])), 'cm', pp('cm'));
    const Ip = S.is === 'sep' ? [I('i0'), M.gap(10), M.op('·', 'dot'), M.gap(10), I('i1')]
      : S.is === 'sq' ? [M.sup(M.vr('i', null, { col: ICOL }), M.num(2), 'isq', pp('isq'))]
      : [S.co ? M.paren(M.num(-1), 'neg', pp('neg')) : M.num(-1, 'neg', pp('neg'))];
    items = [C, C ? (S.cs === 'done' && S.is === 'neg' ? M.op('·') : M.gap(6)) : null, ...Ip];
  }
  M.place(g, 'ex', M.row(...items), 180, 274, S.co ? 50 : 62, { col: INK });
}

MG.add({
  id: 'complex_isq', stage: 'complex', cmd: 'I SQUARED!', hint: 'drag', time: 8, mood: 'night', winText: 'i² = −1!', hold: 1.4,
  card: {
    title: 'The imaginary unit i', ref: 'Algebra 2', kind: 'Complex numbers',
    text: 'No real number has a negative square: 2² = 4, and (−2)² = 4 too. So mathematicians added a new number, called i, whose square is −1. That is, i · i = i² = −1. A number such as 3i is called an imaginary number.\n\nTo multiply two imaginary numbers, multiply the numbers in front, then replace i² with −1. For example, 3i · 2i = (3 · 2)i² = 6 · (−1) = −6.\n\nA picture shows why this makes sense. Put the real numbers on a line going left and right, and the imaginary numbers on a line going up and down. Multiplying by i turns a point a quarter turn around 0. Start at 1 and turn twice: you land on −1.',
    note: 'i² = −1. To multiply ai by bi, multiply a by b, then replace i² with −1: (ai)(bi) = −ab.',
    ask: 'What is 4i · 5i? What is (−3i)(2i)?',
  },

  init(g) {
    const S = g.s; M.setup(g); S.pops = {}; S.co = pick(g); S.cs = 'sep'; S.is = 'sep'; S.ans = null;
    if (S.co) S.cv = S.co[0] * S.co[1];
    S.ang = 0; S.turnAt = null;
    build(g); M.inert(g, ['dot']);
    M.zone(g, 'pt', { x: OX + U, y: OY, w: 30, h: 30 }); // the point on the plane: it shows the answer, it is not part of the sum
    const nMoves = S.co ? 4 : 2; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#c8a8ff', '#fff', '#ffe08a'], 12, 130); };
    const tryDone = g => { if (!S.co && S.is === 'neg') { S.ans = -1; } };
    M.play(g, {
      moves(g) {
        const out = [];
        // drag one i onto the other: i · i is i² (the numbers in front gather into a product)
        if (S.is === 'sep') for (const [a, b] of [['i0', 'i1'], ['i1', 'i0']]) out.push({ drag: a, to: b, busy: 0.1, then(g) {
          S.is = 'sq'; S.pops.isq = g.t; if (S.co && S.cs === 'sep') { S.cs = 'prod'; S.pops.cm = g.t; } g.sfx('pop'); build(g); burst('isq'); } });
        if (S.co && S.cs === 'sep') for (const [a, b] of [['c0', 'c1'], ['c1', 'c0']]) out.push({ drag: a, to: b, busy: 0.1, then(g) { S.cs = 'prod'; S.pops.cm = g.t; build(g); burst('cm'); } });
        // tap i²: it is −1, and the point on the plane turns twice by a quarter turn
        if (S.is === 'sq') out.push({ tap: 'isq', busy: 0.1, askAt: 0, after: 0.1, ask: { v: -1, wrong: [1, 2, M.row(M.num(2), M.vr('i'))] },
          then() {}, resolve(g) { S.is = 'neg'; S.pops.neg = S.pops.fin = g.t; S.turnAt = g.t; g.sfx('sparkle'); tryDone(g); if (S.ans != null) S.pops.ans = g.t; build(g); burst(S.ans != null ? 'ans' : S.cs === 'done' ? 'fin' : 'neg'); } });
        if (S.co && S.cs === 'prod') out.push({ tap: 'cm', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.cv, wrong: [S.co[0] + S.co[1], -S.cv, S.cv + 1] },
          then() {}, resolve(g) { S.cs = 'done'; S.pops.cv = S.pops.fin = g.t; g.sfx('coin'); build(g); burst(S.is === 'neg' ? 'fin' : 'cv'); } });
        if (S.co && S.cs === 'done' && S.is === 'neg' && S.ans == null) out.push({ tap: 'fin', busy: 0.1, askAt: 0, after: 0.1, ask: { v: -S.cv, wrong: [S.cv, -S.cv - 1, S.cv - 1] },
          then() {}, resolve(g) { S.ans = -S.cv; S.pops.ans = g.t; g.sfx('coin'); build(g); burst('ans'); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'night', panel: PANEL, panelY: 262, panelH: 132, host: 'owl', hostX: 304, hostY: 606, hostS: 1.15 });
    // the complex plane: real axis across, imaginary axis up
    const turn = S.turnAt == null ? 0 : M.easeIO((t - S.turnAt) / 0.5), ang = Math.PI * turn;
    c.save(); c.strokeStyle = 'rgba(220,210,255,0.22)'; c.lineWidth = 1;
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(OX + k * U, OY - U * 1.25); c.lineTo(OX + k * U, OY + U * 1.25); c.stroke(); }
    c.strokeStyle = 'rgba(235,228,255,0.85)'; c.lineWidth = 2.5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(OX - U * 1.55, OY); c.lineTo(OX + U * 1.55, OY); c.moveTo(OX, OY + U * 1.3); c.lineTo(OX, OY - U * 1.3); c.stroke();
    c.fillStyle = 'rgba(235,228,255,0.85)';
    for (const [x, y, a] of [[OX + U * 1.62, OY, 0], [OX, OY - U * 1.37, -Math.PI / 2]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(6, 0); c.lineTo(-4, -5); c.lineTo(-4, 5); c.fill(); c.restore(); }
    // unit circle and tick labels
    c.setLineDash([4, 6]); c.strokeStyle = 'rgba(200,190,255,0.35)'; c.lineWidth = 1.5; c.beginPath(); c.arc(OX, OY, U, 0, 7); c.stroke(); c.setLineDash([]);
    c.font = M.NUMF(16); c.fillStyle = '#e8e0ff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('1', OX + U + 4, OY + 16);
    if (turn >= 1) { c.font = M.NUMF(22, 700); c.fillStyle = '#ffe08a'; } c.fillText('−1', OX - U - 6, OY + 18); c.fillStyle = '#e8e0ff';
    c.font = M.VARF(17); c.fillText('i', OX + 13, OY - U - 4); c.fillText('−i', OX + 16, OY + U + 6);
    // the trail of the turn, with a "× i" on each quarter
    if (S.turnAt != null) {
      c.strokeStyle = '#ffe08a'; c.lineWidth = 4; c.shadowColor = '#ffd04a'; c.shadowBlur = 10; c.beginPath(); c.arc(OX, OY, U, 0, -ang, true); c.stroke(); c.shadowBlur = 0;
      c.font = M.VARF(15); c.fillStyle = '#ffe9a8';
      for (const q of [0, 1]) if (turn > q * 0.5 + 0.25) { const a = -(q + 0.5) * Math.PI / 2; c.fillText('× i', OX + Math.cos(a) * (U + 22), OY + Math.sin(a) * (U + 18)); }
    }
    const px = OX + Math.cos(-ang) * U, py = OY + Math.sin(-ang) * U, glow = 0.5 + 0.5 * Math.sin(t * 4);
    const gr = c.createRadialGradient(px, py, 0, px, py, 22); gr.addColorStop(0, `rgba(255,236,150,${0.5 + glow * 0.3})`); gr.addColorStop(1, 'rgba(255,236,150,0)'); c.fillStyle = gr; c.fillRect(px - 22, py - 22, 44, 44);
    c.fillStyle = '#fff3c0'; c.strokeStyle = '#a8641a'; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.stroke();
    c.restore();
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
