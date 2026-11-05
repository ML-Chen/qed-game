// complex_isq.js — I SQUARED! The imaginary unit: i · i = i² = −1.
// Level 0: i · i. The player drags one i onto the other: the two i's slide together and the second one shrinks into the
// exponent, so i · i becomes i². Then the player taps i²: below the glass panel a complex plane acts it out. The point 1
// turns a quarter turn ("× i") to i, then another quarter turn ("× i") to −1, and that −1 flies up from the plane and
// takes the place of i².
// Level 1: numbers in front (3i · 2i). Dragging an i onto the other also gathers the numbers into (3 · 2) (or the player
// drags one number onto the other first). A tap on (3 · 2) writes "= 6" under it and the 6 flies in; a tap on i² turns
// the plane; a tap on 6 · (−1) writes "= −6" and that lands as the answer. Level 2: one of the numbers is negative, so
// the sign flips twice. Medium mode: every tap opens the tray when the working reaches the computation.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), ICOL = '#6a2ac0', NOTE = '#7a3ad0', GOLD = '#ffe08a';
const OX = 180, OY = 452, U = 68, HX = 304, HY = 606; // the complex plane: origin and one unit in px; the owl
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return null;
  let a = 2 + r(4), b = 2 + r(4);
  if (L === 2) { if (g.rand() < 0.5) a = -a; else b = -b; }
  return [a, b];
}
// fade a node and every symbol inside it (so nothing ghosts back when it is replaced)
function fadeAll(g, n, dur, delay) { const all = []; (function walk(q) { if (!q) return; all.push(q); for (const ch of [q.base, q.exp, q.n, q.d, q.inner, ...(q.items || [])]) walk(ch); })(n);
  for (const q of all) M.tween(g, q, { alpha: 0 }, dur, { delay }); M.tween(g, n, { sc: 0.7 }, dur, { delay }); }
// The expression is laid out from the state, but always from the same node objects, so symbols glide to their new places.
function build(g) {
  const S = g.s, N = S.n; let items;
  if (S.ans != null) items = [N.ans];
  else if (S.co && S.cs === 'sep' && S.is === 'sep') items = [N.c0, N.i0, M.gap(10), N.dotI, M.gap(10), ...(S.co[1] < 0 ? [N.p1] : [N.c1, N.i1])];
  else {
    const C = !S.co ? null : S.cs === 'done' ? N.cv : N.cm;
    const Ip = S.is === 'sep' ? [N.i0, M.gap(10), N.dotI, M.gap(10), N.i1] : S.is === 'pair' ? [N.i0, N.i1] : S.is === 'sq' ? [N.isq] : [S.co ? N.negp : N.neg];
    items = [C, C ? (S.cs === 'done' && S.is === 'neg' ? N.mul : M.gap(6)) : null, ...Ip];
  }
  const r = M.row(...items); r._born = -1; if (S.co && S.cs === 'done' && S.is === 'neg' && S.ans == null) r.id = 'fin';
  M.place(g, 'ex', r, 180, 274, S.co ? 50 : 62, { col: INK });
}

MG.add({
  id: 'complex_isq', stage: 'complex', cmd: 'I SQUARED!', hint: 'drag', time: 8, mood: 'night', winText: 'i² = −1!', hold: 1.6,
  card: {
    title: 'The imaginary unit i', ref: 'Algebra 2', kind: 'Complex numbers',
    text: 'No real number has a negative square: 2² = 4, and (−2)² = 4 too. So mathematicians added a new number, called i, whose square is −1. That is, i · i = i² = −1. A number such as 3i is called an imaginary number.\n\nTo multiply two imaginary numbers, multiply the numbers in front, then replace i² with −1. For example, 3i · 2i = (3 · 2)i² = 6 · (−1) = −6.\n\nA picture shows why this makes sense. Put the real numbers on a line going left and right, and the imaginary numbers on a line going up and down. Multiplying by i turns a point a quarter turn around 0. Start at 1 and turn twice: you land on −1.',
    note: 'i² = −1. To multiply ai by bi, multiply a by b, then replace i² with −1: (ai)(bi) = −ab.',
    ask: 'What is 4i · 5i? What is (−3i)(2i)?',
  },

  init(g) {
    const S = g.s; M.setup(g); S.co = pick(g); S.cs = 'sep'; S.is = 'sep'; S.ans = null; const T = M.pace(g);
    if (S.co) S.cv = S.co[0] * S.co[1];
    const I = id => M.vr('i', id, { col: ICOL });
    const N = S.n = { i0: I('i0'), i1: I('i1'), dotI: M.op('·', 'dot') };
    N.two = M.num(2, 'two', { col: ICOL }); N.isq = M.sup(N.i0, N.two, 'isq');
    N.neg = M.num(-1, 'neg', { _born: -1 }); N.negp = M.paren(N.neg, 'negp');
    if (S.co) { N.c0 = M.num(S.co[0], 'c0'); N.c1 = M.num(S.co[1], 'c1'); N.cv = M.num(S.cv, 'cv', { _born: -1 }); N.mul = M.op('·', 'mul'); N.ans = M.num(-S.cv, 'ans', { _born: -1 }); N.p1 = M.paren(M.row(N.c1, N.i1)); } // a negative second factor is written in brackets: 4i · (−5i)
    build(g); M.inert(g, ['dot', 'mul', 'two']);
    M.zone(g, 'pt', { x: OX + U, y: OY, w: 30, h: 30 }); // the point on the plane: it shows the answer, it is not part of the sum
    const nMoves = S.co ? 4 : 2; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // the numbers in front gather into one product, (a · b)
    const gather = (g, dot) => { S.cs = 'prod'; S.n.dotC = dot || M.op('·', 'dotC'); S.n.cm = M.paren(M.row(N.c0, S.n.dotC, S.co[1] < 0 ? M.paren(N.c1) : N.c1), 'cm'); };
    // a note writes itself under a part, then its value flies in and takes that part's place
    const land = (g, tgt, val, fadeIds, then) => {
      const nd = M.row(M.op('='), M.num(val)), b0 = { ...M.box(g, tgt) }, sz = S.co ? 50 : 62; g.sfx('tap');
      M.note(g, { node: nd, at: tgt, off: [0, 50], s: 34, col: NOTE, write: 0.3 * T, hold: 0.22 * T, fade: 0.2 * T });
      for (const q of fadeIds) fadeAll(g, q, 0.3 * T, 0.5 * T);
      M.at(g, [[0.52 * T, g => { const m = M.lay(nd, 34), vw = M.lay(M.num(val), 34).w; // only the value lifts off the note and lands
        M.fly(g, { node: M.num(val, null, { col: NOTE }), from: [b0.x + m.w / 2 - vw / 2, b0.y + 50], to: [b0.x, b0.y], dur: 0.32 * T, arc: -30, s0: 34, s1: sz }); }],
        [0.86 * T, then]]);
    };
    M.play(g, {
      moves(g) {
        const out = [];
        // drag one i onto the other: they slide together and i · i becomes i² (the numbers in front gather too)
        if (S.is === 'sep') for (const [a, b] of [['i1', 'i0'], ['i0', 'i1']]) out.push({ drag: a, to: b, busy: 0.1, then(g) {
          M.show(g, 0.95 * T); S.point = true; hop(g, 'think');
          M.circle(g, ['i0', 'i1'], { dur: 0.5 * T, col: '#c8a8ff' });
          S.is = 'pair'; if (S.co && S.cs === 'sep') gather(g, N.dotI); build(g); g.sfx('swoosh');
          M.at(g, [[0.5 * T, g => { S.is = 'sq'; N.two.pop = g.t; build(g); M.sparkle(g, 'isq', { n: 10, cols: ['#c8a8ff', '#fff', GOLD] }); g.sfx('pop'); hop(g); }]]); } });
        if (S.co && S.cs === 'sep') for (const [a, b] of [['c1', 'c0'], ['c0', 'c1']]) out.push({ drag: a, to: b, busy: 0.1, then(g) {
          M.show(g, 0.6 * T); M.circle(g, ['c0', 'c1'], { dur: 0.45 * T }); gather(g); build(g); g.sfx('swoosh'); hop(g);
          M.at(g, [[0.32 * T, g => M.sparkle(g, 'cm', { n: 8 })]]); } });
        // tap i²: the point on the plane turns a quarter turn for each factor of i, lands on −1, and −1 flies up
        if (S.is === 'sq') out.push({ tap: 'isq', busy: 0.1, askAt: 0.4 * T, after: 1.55 * T, ask: { v: -1, wrong: [1, 2, M.row(M.num(2), M.vr('i'))] },
          then(g) { M.show(g, 0.4 * T); S.point = true; hop(g, 'think'); M.circle(g, 'isq', { dur: 0.45 * T, col: '#c8a8ff' }); M.light(g, N.i0, { col: GOLD }); },
          resolve(g) { M.show(g, 1.55 * T); const q = 0.42 * T, p = 0.12 * T; S.turn = { t0: g.t, q, p }; g.sfx('whoosh');
            M.indicate(g, N.i0, { dur: q, sc: 1.15, col: GOLD }); M.indicate(g, N.two, { delay: q + p, dur: q, sc: 1.3, col: GOLD });
            M.at(g, [
              [q, g => { g.sfx('tap'); hop(g); }],
              [q * 2 + p, g => { g.sfx('ding'); hop(g, 'wow'); S.minusAt = g.t; }],
              [q * 2 + p + 0.12 * T, g => { // the −1 lifts off the plane and replaces i²
                fadeAll(g, N.isq, 0.3 * T); M.unlight(g, N.i0);
                M.fly(g, { node: M.num(-1, null, { col: '#3a1640' }), from: [OX - U - 6, OY + 18], to: 'isq', dur: 0.36 * T, arc: -50, s0: 24, s1: S.co ? 50 : 62,
                  then(g) { S.is = 'neg'; S.flown = true; N.neg.pop = g.t; build(g); M.sparkle(g, S.co ? 'negp' : 'neg', { n: 12, cols: ['#c8a8ff', '#fff', GOLD] }); g.sfx('sparkle'); hop(g, 'laugh'); S.point = false; } }); }],
            ]); } });
        // tap (a · b): "= ab" writes itself under it and flies in
        if (S.co && S.cs === 'prod') out.push({ tap: 'cm', busy: 0.1, askAt: 0.35 * T, after: 1.0 * T, ask: { v: S.cv, wrong: [S.co[0] + S.co[1], -S.cv, S.cv + 1] },
          then(g) { M.show(g, 0.35 * T); M.circle(g, 'cm', { dur: 0.4 * T }); M.light(g, N.c0); M.light(g, N.c1); hop(g, 'think'); },
          resolve(g) { M.show(g, 1.0 * T); land(g, 'cm', S.cv, [S.n.cm], g => { S.cs = 'done'; N.cv.pop = g.t; build(g); M.sparkle(g, 'cv'); g.sfx('coin'); hop(g); }); } });
        // tap ab · (−1): the sign flips, and the answer lands
        if (S.co && S.cs === 'done' && S.is === 'neg' && S.ans == null) out.push({ tap: 'fin', busy: 0.1, askAt: 0.35 * T, after: 1.0 * T, ask: { v: -S.cv, wrong: [S.cv, -S.cv - 1, S.cv - 1] },
          then(g) { M.show(g, 0.35 * T); M.circle(g, 'fin', { dur: 0.4 * T }); M.light(g, N.cv); M.light(g, N.neg); hop(g, 'think'); },
          resolve(g) { M.show(g, 1.0 * T); land(g, 'fin', -S.cv, [N.cv, N.mul, N.negp], g => { S.ans = -S.cv; N.ans.pop = g.t; build(g); M.sparkle(g, 'ans', { n: 14 }); g.sfx('coin'); hop(g, 'laugh'); }); } });
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
    SCN.std(g, c, { scene: 'night', panel: PANEL, panelY: 262, panelH: 132 });
    // the complex plane: real axis across, imaginary axis up
    const tr = S.turn, e1 = tr ? M.easeIO((t - tr.t0) / tr.q) : 0, e2 = tr ? M.easeIO((t - tr.t0 - tr.q - tr.p) / tr.q) : 0, turn = (e1 + e2) / 2, ang = Math.PI * turn;
    c.save(); c.strokeStyle = 'rgba(220,210,255,0.22)'; c.lineWidth = 1;
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(OX + k * U, OY - U * 1.25); c.lineTo(OX + k * U, OY + U * 1.25); c.stroke(); }
    c.strokeStyle = 'rgba(235,228,255,0.85)'; c.lineWidth = 2.5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(OX - U * 1.55, OY); c.lineTo(OX + U * 1.55, OY); c.moveTo(OX, OY + U * 1.3); c.lineTo(OX, OY - U * 1.3); c.stroke();
    c.fillStyle = 'rgba(235,228,255,0.85)';
    for (const [x, y, a] of [[OX + U * 1.62, OY, 0], [OX, OY - U * 1.37, -Math.PI / 2]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(6, 0); c.lineTo(-4, -5); c.lineTo(-4, 5); c.fill(); c.restore(); }
    // unit circle and tick labels; each stop lights up as the point reaches it
    c.setLineDash([4, 6]); c.strokeStyle = 'rgba(200,190,255,0.35)'; c.lineWidth = 1.5; c.beginPath(); c.arc(OX, OY, U, 0, 7); c.stroke(); c.setLineDash([]);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = M.NUMF(16); c.fillStyle = '#e8e0ff'; c.fillText('1', OX + U + 4, OY + 16);
    const atI = e1 >= 1 && e2 <= 0.05, atM = e2 >= 1;
    if (!S.flown || !atM) { c.font = M.NUMF(atM ? 22 : 16, atM ? 700 : 600); c.fillStyle = atM ? GOLD : '#e8e0ff'; c.fillText('−1', OX - U - 6, OY + 18); }
    else { c.font = M.NUMF(16); c.fillStyle = 'rgba(232,224,255,0.6)'; c.fillText('−1', OX - U - 6, OY + 18); }
    c.font = M.VARF(atI ? 22 : 17); c.fillStyle = atI ? GOLD : '#e8e0ff'; c.fillText('i', OX + 13, OY - U - 4);
    c.font = M.VARF(17); c.fillStyle = '#e8e0ff'; c.fillText('−i', OX + 16, OY + U + 6);
    // the trail of the turn, with a "× i" written on each quarter as it is turned
    if (tr) {
      c.strokeStyle = GOLD; c.lineWidth = 4; c.shadowColor = '#ffd04a'; c.shadowBlur = 10; c.beginPath(); c.arc(OX, OY, U, 0, -ang, true); c.stroke(); c.shadowBlur = 0;
      [e1, e2].forEach((e, q) => { if (e <= 0.15) return; const a = -(q + 0.5) * Math.PI / 2, lab = M.row(M.op('×'), M.vr('i')), m = M.lay(lab, 20), x = OX + Math.cos(a) * (U + 26), y = OY + Math.sin(a) * (U + 22);
        c.save(); c.globalAlpha = M.clamp((e - 0.15) / 0.4, 0, 1); M.draw(c, lab, x - m.w / 2, y + 7, 20, { col: '#ffe9a8' }); c.restore(); });
    }
    const px = OX + Math.cos(-ang) * U, py = OY + Math.sin(-ang) * U, glow = 0.5 + 0.5 * Math.sin(t * 4);
    const gr = c.createRadialGradient(px, py, 0, px, py, 22); gr.addColorStop(0, `rgba(255,236,150,${0.5 + glow * 0.3})`); gr.addColorStop(1, 'rgba(255,236,150,0)'); c.fillStyle = gr; c.fillRect(px - 22, py - 22, 44, 44);
    c.fillStyle = '#fff3c0'; c.strokeStyle = '#a8641a'; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.stroke();
    if (S.minusAt != null && t - S.minusAt < 0.5) { const k = (t - S.minusAt) / 0.5; c.strokeStyle = `rgba(255,224,138,${1 - k})`; c.lineWidth = 3; c.beginPath(); c.arc(px, py, 8 + k * 30, 0, 7); c.stroke(); }
    c.restore();
    // the owl points at the panel while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', HX, HY - hopK * 22, 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', HX, HY, 1.15);
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
