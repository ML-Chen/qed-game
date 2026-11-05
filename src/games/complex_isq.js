// complex_isq.js — I SQUARED! The imaginary unit: i · i = i² = −1.
// Level 0: i · i. The player drags one i onto the other: the two i's slide together and the second one shrinks into the
// exponent, so i · i becomes i². Then the player taps i²: below the glass panel a complex plane acts it out. The point 1
// turns a quarter turn ("× i") to i, then another quarter turn ("× i") to −1, and that −1 flies up from the plane and
// takes the place of i².
// Level 1: numbers in front (3i · 2i). Dragging an i onto the other also gathers the numbers into (3 · 2) (or the player
// drags one number onto the other first). A tap on (3 · 2) writes "= 6" under it and the 6 flies in; a tap on i² turns
// the plane; a tap on 6 · (−1) writes "= −6" and that lands as the answer. Level 2: one of the numbers is negative, so
// the sign flips twice. Medium mode: every tap opens the tray when the working reaches the computation.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), ICOL = '#6a2ac0', NOTE = '#7a3ad0', GOLD = '#ffe08a', HOT = '#f07a10'; // HOT: a highlight that reads on the light glass panel
const OX = 180, OY = 452, U = 68, HX = 304, HY = 606, NY = 316; // the complex plane: origin and one unit in px; the owl
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return null;
  let a = 2 + r(4), b = 2 + r(4);
  if (L === 2) { if (g.rand() < 0.5) a = -a; else b = -b; }
  return [a, b];
}
// a node and every symbol inside it
function nodesOf(n) { const all = []; (function walk(q) { if (!q) return; all.push(q); for (const ch of [q.base, q.exp, q.n, q.d, q.inner, ...(q.items || [])]) walk(ch); })(n); return all; }
// fade a node and every symbol inside it (so nothing ghosts back when it is replaced)
function fadeAll(g, n, dur, delay) { const all = nodesOf(n);
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
    N.neg = M.num(-1, 'neg', { _born: -1 }); N.negp = M.paren(N.neg, 'negp', { _born: -1 });
    if (S.co) { N.c0 = M.num(S.co[0], 'c0'); N.c1 = M.num(S.co[1], 'c1'); N.cv = M.num(S.cv, 'cv', { _born: -1 }); N.mul = M.op('·', 'mul'); N.ans = M.num(-S.cv, 'ans', { _born: -1 }); N.p1 = M.paren(M.row(N.c1, N.i1)); } // a negative second factor is written in brackets: 4i · (−5i)
    build(g); M.inert(g, ['dot', 'mul', 'two']);
    M.zone(g, 'pt', { x: OX + U, y: OY, w: 30, h: 30 }); // the point on the plane: it shows the answer, it is not part of the sum
    const nMoves = S.co ? 4 : 2; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const SZ = S.co ? 50 : 62;
    // the numbers in front gather into one product, (a · b)
    const gather = (g, dot) => { S.cs = 'prod'; S.n.dotC = dot || M.op('·', 'dotC'); S.n.cm = M.paren(M.row(N.c0, S.n.dotC, S.co[1] < 0 ? M.paren(N.c1) : N.c1), 'cm'); };
    // a working line writes itself under the expression ("4 · 5 =" now, the value once it is known)
    const startNote = (g, parts, val) => { S.q = M.num(val, 'q', { alpha: 0 }); S.nt = M.row(...parts, M.op('='), S.q);
      M.place(g, 'nt', S.nt, 180, NY, 28, { col: NOTE }); M.writeIn(g, S.nt, { dur: 0.45 * T }); g.sfx('tap'); };
    // the value appears, stays to be read, then lifts off the note and takes the place of the part it came from
    const finishNote = (g, tgt, fadeNodes, then) => {
      S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.25 * T }); M.indicate(g, S.q, { delay: 0.2 * T, dur: 0.4 * T, sc: 1.25, col: HOT }); g.sfx('ding');
      M.at(g, [[0.95 * T, g => { const from = { ...M.box(g, 'q') }, b0 = { ...M.box(g, tgt) }, all = nodesOf(S.nt);
        for (const q of all) M.tween(g, q, { alpha: 0 }, 0.25 * T); for (const q of fadeNodes) fadeAll(g, q, 0.3 * T);
        M.fly(g, { node: M.num(S.q.v, null, { col: NOTE }), from: [from.x, from.y], to: [b0.x, b0.y], dur: 0.42 * T, arc: 30, s0: 28, s1: SZ, then(g) { delete g.s.mk.ex.nt; then(g); } }); }]]);
    };
    M.play(g, {
      moves(g) {
        const out = [];
        // drag one i onto the other: a tag counts each i (1, 2), they slide together, and the second i shrinks into
        // the exponent while its tag "2" flies up to become the power: i · i = i² (the numbers in front gather too)
        if (S.is === 'sep') for (const [a, b] of [['i1', 'i0'], ['i0', 'i1']]) out.push({ drag: a, to: b, busy: 0.1, then(g) {
          M.show(g, 1.75 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
          M.circle(g, ['i0', 'i1'], { dur: 0.55 * T, col: '#c8a8ff' }); M.light(g, N.i0, { col: HOT }); M.light(g, N.i1, { col: HOT });
          const off = [0, S.co ? 44 : 50];
          M.note(g, { node: M.num(1), at: N.i0, off, s: 26, col: NOTE, delay: 0.15 * T, write: 0.25 * T, hold: 0.95 * T, fade: 0.25 * T });
          M.note(g, { node: M.num(2), at: N.i1, off, s: 26, col: NOTE, delay: 0.45 * T, write: 0.25 * T, hold: 0.7 * T, fade: 0.05 });
          M.at(g, [
            [0.85 * T, g => { S.is = 'pair'; if (S.co && S.cs === 'sep') gather(g, N.dotI); build(g); g.sfx('swoosh'); }],
            [1.45 * T, g => { const tb = { ...M.box(g, 'i1') }; S.is = 'sq'; N.two.alpha = 0; build(g); M.unlight(g, N.i0);
              M.fly(g, { node: M.num(2, null, { col: NOTE }), from: [tb.x, tb.y + off[1]], to: 'two', dur: 0.32 * T, arc: 24, s0: 26, s1: SZ * 0.62,
                then(g) { N.two.alpha = 1; N.two.pop = g.t; M.sparkle(g, 'isq', { n: 10, cols: ['#c8a8ff', '#fff', GOLD] }); g.sfx('pop'); hop(g); } }); }],
          ]); } });
        if (S.co && S.cs === 'sep') for (const [a, b] of [['c1', 'c0'], ['c0', 'c1']]) out.push({ drag: a, to: b, busy: 0.1, then(g) {
          M.show(g, 0.75 * T); M.circle(g, ['c0', 'c1'], { dur: 0.5 * T }); hop(g); g.sfx('swoosh');
          M.at(g, [[0.3 * T, g => { gather(g); build(g); }], [0.55 * T, g => M.sparkle(g, 'cm', { n: 8 })]]); } });
        // tap i²: on the plane the point 1 turns a quarter turn ("1 · i = i"); the tray asks what one more turn gives;
        // the point turns again to −1 ("i · i = −1"), and that −1 lifts off the plane and takes the place of i²
        if (S.is === 'sq') out.push({ tap: 'isq', busy: 0.1, askAt: 1.45 * T, after: 2.05 * T, ask: { v: -1, wrong: [1, 2, M.row(M.num(2), M.vr('i'))] },
          then(g) { M.show(g, 1.45 * T); S.point = true; hop(g, 'think'); M.circle(g, 'isq', { dur: 0.45 * T, col: '#c8a8ff' }); M.light(g, N.i0, { col: HOT });
            S.turns = [{ t0: g.t + 0.2 * T, d: 0.6 * T }]; M.at(g, [[0.2 * T, g => g.sfx('whoosh')], [0.8 * T, g => { g.sfx('tap'); hop(g); S.atI = g.t; }]]);
            M.note(g, { node: M.row(M.num(1), M.op('·'), M.vr('i'), M.op('='), M.vr('i')), at: [OX + 66, OY - U - 36], s: 26, col: GOLD, pill: true, delay: 0.8 * T, write: 0.3 * T, hold: 0.8 * T, fade: 0.25 * T }); },
          resolve(g) { M.show(g, 2.05 * T); S.turns.push({ t0: g.t, d: 0.6 * T }); g.sfx('whoosh'); M.unlight(g, N.i0); M.light(g, N.two, { col: HOT });
            M.at(g, [
              [0.6 * T, g => { g.sfx('ding'); hop(g, 'wow'); S.minusAt = g.t;
                M.note(g, { node: M.row(M.vr('i'), M.op('·'), M.vr('i'), M.op('='), M.num(-1)), at: [OX - U - 4, OY + 50], s: 26, col: GOLD, pill: true, write: 0.3 * T, hold: 0.85 * T, fade: 0.25 * T }); }],
              [1.15 * T, g => { // the −1 lifts off the plane and replaces i²
                fadeAll(g, N.isq, 0.3 * T); M.unlight(g, N.two);
                M.fly(g, { node: M.num(-1, null, { col: '#3a1640' }), from: [OX - U - 6, OY + 18], to: 'isq', dur: 0.45 * T, arc: -50, s0: 24, s1: SZ,
                  then(g) { S.is = 'neg'; S.flown = true; N.neg.pop = g.t; build(g); M.sparkle(g, S.co ? 'negp' : 'neg', { n: 12, cols: ['#c8a8ff', '#fff', GOLD] }); g.sfx('sparkle'); hop(g, 'laugh'); S.point = false; } }); }],
            ]); } });
        // tap (a · b): "a · b = ab" writes itself under the expression, and ab flies up into its place
        if (S.co && S.cs === 'prod') out.push({ tap: 'cm', busy: 0.1, askAt: 0.6 * T, after: 1.45 * T, ask: { v: S.cv, wrong: [S.co[0] + S.co[1], -S.cv, S.cv + 1] },
          then(g) { M.show(g, 0.6 * T); M.circle(g, 'cm', { dur: 0.45 * T }); M.light(g, N.c0); M.light(g, N.c1); hop(g, 'think');
            startNote(g, [M.num(S.co[0]), M.op('·'), S.co[1] < 0 ? M.paren(M.num(S.co[1])) : M.num(S.co[1])], S.cv); },
          resolve(g) { M.show(g, 1.45 * T); finishNote(g, 'cm', [S.n.cm], g => { S.cs = 'done'; N.cv.pop = g.t; build(g); M.sparkle(g, 'cv'); g.sfx('coin'); hop(g); }); } });
        // tap ab · (−1): "ab · (−1) = −ab" writes itself, the sign flips, and the answer lands
        if (S.co && S.cs === 'done' && S.is === 'neg' && S.ans == null) out.push({ tap: 'fin', busy: 0.1, askAt: 0.6 * T, after: 1.45 * T, ask: { v: -S.cv, wrong: [S.cv, -S.cv - 1, S.cv - 1] },
          then(g) { M.show(g, 0.6 * T); M.circle(g, 'fin', { dur: 0.45 * T }); M.light(g, N.cv); M.light(g, N.neg); hop(g, 'think');
            startNote(g, [M.num(S.cv), M.op('·'), M.paren(M.num(-1))], -S.cv); },
          resolve(g) { M.show(g, 1.45 * T); finishNote(g, 'fin', [N.cv, N.mul, N.negp], g => { S.ans = -S.cv; N.ans.pop = g.t; build(g); M.sparkle(g, 'ans', { n: 14 }); g.sfx('coin'); hop(g, 'laugh'); }); } });
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
    const tn = S.turns || [], es = [0, 1].map(i => tn[i] ? M.easeIO((t - tn[i].t0) / tn[i].d) : 0), [e1, e2] = es, turn = (e1 + e2) / 2, ang = Math.PI * turn;
    c.save(); c.strokeStyle = 'rgba(220,210,255,0.22)'; c.lineWidth = 1;
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(OX + k * U, OY - U * 1.25); c.lineTo(OX + k * U, OY + U * 1.25); c.stroke(); }
    c.strokeStyle = 'rgba(235,228,255,0.85)'; c.lineWidth = 2.5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(OX - U * 1.55, OY); c.lineTo(OX + U * 1.55, OY); c.moveTo(OX, OY + U * 1.3); c.lineTo(OX, OY - U * 1.3); c.stroke();
    c.fillStyle = 'rgba(235,228,255,0.85)';
    for (const [x, y, a] of [[OX + U * 1.62, OY, 0], [OX, OY - U * 1.37, -Math.PI / 2]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(6, 0); c.lineTo(-4, -5); c.lineTo(-4, 5); c.fill(); c.restore(); }
    // unit circle and the four stops 1, i, −1, −i; a stop swells gold while the point sits on it
    c.setLineDash([4, 6]); c.strokeStyle = 'rgba(200,190,255,0.35)'; c.lineWidth = 1.5; c.beginPath(); c.arc(OX, OY, U, 0, 7); c.stroke(); c.setLineDash([]);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = 'rgba(10,6,30,0.9)'; c.shadowBlur = 5;
    const atI = e1 >= 0.98 && e2 <= 0.05, atM = e2 >= 0.98, at1 = !tn.length || e1 < 0.02;
    const lab = (txt, x, y, on, varf) => { c.font = varf ? M.VARF(on ? 25 : 20) : M.NUMF(on ? 25 : 20, 700); c.fillStyle = on ? GOLD : '#efe8ff'; c.fillText(txt, x, y); };
    lab('1', OX + U + 8, OY + 18, at1 && tn.length > 0);
    if (!S.flown) lab('−1', OX - U - 10, OY + 19, atM); else { c.globalAlpha = 0.55; lab('−1', OX - U - 10, OY + 19, false); c.globalAlpha = 1; }
    lab('i', OX - 14, OY - U - 14, atI, true); lab('−i', OX + 18, OY + U + 10, false, true);
    c.shadowBlur = 0;
    // the trail of the turn, with a "× i" written on each quarter as it is turned
    if (tn.length) {
      c.strokeStyle = GOLD; c.lineWidth = 4; c.shadowColor = '#ffd04a'; c.shadowBlur = 10; c.beginPath(); c.arc(OX, OY, U, 0, -ang, true); c.stroke(); c.shadowBlur = 0;
      es.forEach((e, q) => { if (e <= 0.15) return; const a = -(q + 0.5) * Math.PI / 2, lb = M.row(M.op('×'), M.vr('i')), m = M.lay(lb, 22), x = OX + Math.cos(a) * (U + 26), y = OY + Math.sin(a) * (U + 22);
        c.save(); c.globalAlpha = M.clamp((e - 0.15) / 0.4, 0, 1); c.shadowColor = 'rgba(10,6,30,0.9)'; c.shadowBlur = 5; M.draw(c, lb, x - m.w / 2, y + 8, 22, { col: '#ffe9a8' }); c.restore(); });
    }
    const px = OX + Math.cos(-ang) * U, py = OY + Math.sin(-ang) * U, glow = 0.5 + 0.5 * Math.sin(t * 4);
    const gr = c.createRadialGradient(px, py, 0, px, py, 22); gr.addColorStop(0, `rgba(255,236,150,${0.5 + glow * 0.3})`); gr.addColorStop(1, 'rgba(255,236,150,0)'); c.fillStyle = gr; c.fillRect(px - 22, py - 22, 44, 44);
    c.fillStyle = '#fff3c0'; c.strokeStyle = '#a8641a'; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.stroke();
    for (const t0 of [S.atI, S.minusAt]) if (t0 != null && t - t0 < 0.5) { const k = (t - t0) / 0.5; c.strokeStyle = `rgba(255,224,138,${1 - k})`; c.lineWidth = 3; c.beginPath(); c.arc(px, py, 8 + k * 30, 0, 7); c.stroke(); }
    c.restore();
    // the owl points at the panel while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', HX, HY - hopK * 22, 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', HX, HY, 1.15);
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'nt'); M.drawUI(g, c);
  },
});
