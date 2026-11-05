// derivs_sum.js — SUM RULE! The derivative of a sum is the sum of the derivatives: d/dx (f + g) = f′ + g′.
// A wooden beach sign: d/dx (x³ + x²) on top, and under it "= □ + □", one slot per term. The player drags the d/dx onto
// each term (or its slot), in any order. Every drag is acted out (show your work):
//   the term is circled, a small copy of the d/dx splits off the big one and flies down into the term's slot, and a copy
//   of the term flies in after it, so the slot reads "d/dx x³". Then the d/dx goes to work: the power lifts off and drops
//   in front ("2 × 3 = 6" is written beside it when there is a coefficient), the power rolls down by one, and the small
//   d/dx fades away. A constant is crossed out and rolls to 0; a plain 4x loses its x and leaves 4.
// Level 0: x^n + x^m. Level 1: ax^n + bx^m. Level 2: three terms, the last a constant or a plain x.
// Medium mode: the tray opens once the term has landed in its slot (wrong tiles: power not lowered, not multiplied, added).
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), COLS = ['#ffd45a', '#9ae0ff', '#ffb0c8'], CHALK = '#fff2c8', HX = 86, HY = 600;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), n = 3 + r(2), m = 2;
  if (L === 0) return [{ c: 1, p: n }, { c: 1, p: m }];
  if (L === 1) return [{ c: 2 + r(3), p: n }, { c: 2 + r(4), p: m }];
  return [{ c: 2 + r(3), p: n }, { c: 2 + r(4), p: m }, g.rand() < 0.5 ? { c: 2 + r(8), p: 0 } : { c: 2 + r(6), p: 1 }];
}
const pw = (p, col) => p === 1 ? M.vr('x', null, { col }) : M.sup(M.vr('x', null, { col }), M.num(p, null, { col }));
const mono = (c, p, col) => p === 0 ? M.num(c, null, { col }) : M.row(c === 1 ? null : M.num(c, null, { col }), pw(p, col));
// MK.drawEx glides every node that moved, and a child's glide adds to its parent's (both are translations), so a symbol
// inside a moving row would start twice as far away. drawEx2 lets the kit work out the glides on a scratch canvas,
// removes each parent's share from its children's glides, then draws for real.
const NULLC = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; return cv.getContext('2d'); })();
function unnest(n, ax, ay, t0) {
  if (!n) return; let gx = ax, gy = ay;
  if (n._glide) { if (!n._glide.fixed && n._glide.t0 === t0) { n._glide.dx -= ax; n._glide.dy -= ay; } n._glide.fixed = true; gx = ax + n._glide.dx; gy = ay + n._glide.dy; }
  for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])]) unnest(ch, gx, gy, t0);
}
function drawEx2(g, c, key) { const e = g.s.mk.ex[key]; if (!e) return; M.drawEx(g, NULLC, key); unnest(e.node, 0, 0, g.t); M.drawEx(g, c, key); }
const hideAll = n => { if (!n) return; n.alpha = 0; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])]) hideAll(ch); };

// a slot's contents as separate nodes, so each part can roll, fly, be crossed out and glide: [d/dx] [c] [x^p]
function slotTerm(i, t) {
  const col = COLS[i], P = { i, c: t.c, p: t.p, col, row: M.row() };
  P.d = M.ddx('x', 'dd' + i); P.d.col = CHALK; for (const q of [P.d.n, P.d.d, ...P.d.d.items]) q.col = CHALK;
  if (t.p === 0) P.co = M.num(t.c, 'c' + i, { col });
  else { P.co = t.c === 1 ? null : M.num(t.c, 'c' + i, { col }); P.x = M.vr('x', 'x' + i, { col }); P.ex = t.p > 1 ? M.num(t.p, 'e' + i, { col }) : null; P.pw = P.ex ? M.sup(P.x, P.ex) : P.x; }
  P.sync = () => { P.row.items = [P.d, P.d ? M.gap(4) : null, P.co, P.pw].filter(Boolean); }; P.sync(); return P;
}
// the d/dx at work on one slot; returns { L: beats for MK.at, t: their length }
function powerRule(P, T, relay, react) {
  const L = [], col = P.col, i = P.i;
  const dropD = t => [[t, g => M.tween(g, P.d, { alpha: 0, sc: 0.6, dy: -10 }, 0.22 * T)],
    [t + 0.26 * T, g => { hideAll(P.d); P.d = null; P.sync(); relay(); }]];
  L.push([0, g => { M.indicate(g, P.d, { dur: 0.35 * T, sc: 1.25, col: '#fff' }); g.sfx('tap'); }]);
  if (P.p === 0) { // a constant never changes: its derivative is 0
    L.push([0.3 * T, g => { M.strike(g, P.co, { dur: 0.25 * T }); g.sfx('swoosh'); }],
      [0.62 * T, g => { P.co.strike = null; M.roll(g, P.co, 0, { dur: 0.32 * T }); M.sparkle(g, 'c' + i, { delay: 0.3 * T, n: 8, cols: [col, '#fff'] }); react(g); }],
      ...dropD(0.75 * T));
    return { L, t: 1.1 * T };
  }
  if (P.p === 1) { // c·x has slope c: the x drops away and the c stays
    L.push([0.3 * T, g => { M.circle(g, 'x' + i, { col: '#fff', dur: 0.4 * T }); M.tween(g, P.x, { alpha: 0, dy: 10, sc: 0.6 }, 0.25 * T, { delay: 0.3 * T }); }],
      [0.62 * T, g => { P.pw = P.x = null; P.sync(); relay(); M.indicate(g, P.co, { dur: 0.35 * T, col: '#fff' }); M.sparkle(g, 'c' + i, { n: 8, cols: [col, '#fff'] }); g.sfx('pop'); react(g); }],
      ...dropD(0.75 * T));
    return { L, t: 1.1 * T };
  }
  const p = P.p, c = P.c, land = 0.66 * T;
  L.push([0.26 * T, g => { // the power lifts off and drops in front, and the d/dx has done its job
    const e = M.box(g, P.ex.id), f = M.box(g, P.co ? P.co.id : P.x.id); if (!e || !f) return;
    M.indicate(g, P.ex, { dur: 0.32 * T, sc: 1.6, col: '#fff' });
    M.fly(g, { node: M.num(p, null, { col: CHALK }), from: [e.x, e.y], to: [f.x - f.w / 2 - f.s * 0.3, f.y], dur: 0.4 * T, arc: -46, s0: e.s, s1: f.s, col: CHALK }); g.sfx('whoosh'); }], ...dropD(0.3 * T));
  if (c === 1) L.push([land, g => { P.co = M.num(p, 'c' + i, { col, _born: -1, pop: g.t }); P.sync(); relay(); g.sfx('pop'); react(g); M.sparkle(g, 'c' + i, { n: 8, cols: [col, '#fff'] }); M.roll(g, P.ex, p - 1, { dur: 0.32 * T, delay: 0.12 * T }); }]);
  else L.push([land, g => { // p × c, worked out in a note right above the slot
    const k = M.num(p, 'k' + i, { col: CHALK, _born: -1, pop: g.t }), tm = M.op('×', null, { col: CHALK, _born: -1 }); P.k = [k, tm]; P.row.items.splice(P.row.items.indexOf(P.co), 0, k, tm); relay(); g.sfx('pop');
    M.note(g, { node: M.row(M.num(p), M.op('×'), M.num(c), M.op('='), M.num(p * c)), at: 'slot' + i, off: [0, -44], s: 24, col: CHALK, write: 0.28 * T, hold: 0.3 * T, fade: 0.2 * T });
    M.roll(g, P.ex, p - 1, { dur: 0.32 * T, delay: 0.12 * T }); }],
  [land + 0.52 * T, g => { for (const q of P.k) M.tween(g, q, { alpha: 0, dx: 14, sc: 0.6 }, 0.2 * T); M.roll(g, P.co, p * c, { dur: 0.3 * T, delay: 0.06 * T }); }],
  [land + 0.74 * T, g => { P.k = null; P.sync(); relay(); M.sparkle(g, 'c' + i, { n: 8, cols: [col, '#fff'] }); g.sfx('ding'); react(g); }]);
  const tail = c === 1 ? land + 0.4 * T : land + 0.8 * T;
  if (p - 1 === 1) { // x¹ is just x
    L.push([tail, g => M.tween(g, P.ex, { alpha: 0, sc: 0.5 }, 0.18 * T)], [tail + 0.2 * T, g => { P.pw = P.x; P.ex = null; P.sync(); relay(); }]);
    return { L, t: tail + 0.32 * T };
  }
  return { L, t: tail + 0.1 * T };
}

MG.add({
  id: 'derivs_sum', stage: 'derivs', cmd: 'SUM RULE!', hint: 'drag', time: 8, mood: 'sea', winText: 'Summed up!', hold: 1.5,
  card: {
    title: 'The sum rule', ref: 'Calculus', kind: 'Derivatives',
    text: 'The derivative of a formula tells you how fast its value changes as x changes. The sum rule says that the derivative of a sum is the sum of the derivatives: d/dx (f + g) = f′ + g′. The mark ′ (read "prime") means "the derivative of".\n\nSo you can take each term on its own. A term is one piece that is added on, such as x³. Use the power rule on each term: bring the power down in front and make the power one smaller.\n\nFor example, d/dx (x³ + x²) = 3x² + 2x. A number on its own never changes, so its derivative is 0.\n\nWhy it works: if one amount grows 3 cm per second and another grows 2 cm per second, together they grow 5 cm per second.',
    note: 'Differentiate a sum one term at a time, then add the results: d/dx (f + g) = f′ + g′.',
    ask: 'What is d/dx (x⁴ + x²)? What is d/dx (2x³ + 5x + 7)?',
  },

  init(g) {
    const S = g.s; M.setup(g); S.T = pick(g); const T = M.pace(g), nT = S.T.length;
    S.slots = S.T.map((t, i) => M.slot('slot' + i, { w: 52, col: COLS[i] }));
    S.prob = M.row(M.ddx('x', 'ddx'), M.gap(4), M.paren(M.row(...S.T.flatMap((t, i) => [i ? M.op('+') : null, Object.assign(mono(t.c, t.p, COLS[i]), { id: 't' + i })]))));
    S.work = M.row(M.op('=', 'eq'), M.gap(4), ...S.slots.flatMap((s, i) => [i ? M.op('+') : null, s]));
    const s = nT > 2 ? 38 : 44;
    // the working line's size: the widest moment is every result in place plus one d/dx still at work
    const widest = M.row(M.op('='), M.gap(4), ...S.T.flatMap((t, i) => [i ? M.op('+') : null, M.row(M.num(9), M.op('×'), mono(t.c, t.p, null))]));
    const ws = Math.min(s, s * 330 / M.lay(widest, s).w);
    const relay = () => M.place(g, 'work', S.work, 180, 340, ws, { col: INK });
    M.place(g, 'prob', S.prob, 180, 250, s, { col: INK }); relay();
    M.inert(g, ['eq']);
    g.dur *= (2.6 + 1.05 * nT) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const P = S.T.map((t, i) => slotTerm(i, t)), R = P.map(q => powerRule(q, T, relay, react));
    // once every term is done, a "+ 0" adds nothing: it fades and the answer closes up
    const dropZero = g => { const z = S.T.findIndex(q => q.p === 0); if (z < 0) return; const sl = S.slots[z], k = S.work.items.indexOf(sl), plus = S.work.items[k - 1];
      M.show(g, 0.6 * T); M.at(g, [[0.15 * T, g => { M.indicate(g, sl, { dur: 0.3 * T, col: '#fff' }); }], [0.4 * T, g => { M.tween(g, sl, { alpha: 0, sc: 0.6 }, 0.18 * T); M.tween(g, plus, { alpha: 0 }, 0.18 * T); }],
        [0.6 * T, g => { hideAll(sl); plus.alpha = 0; S.work.items = S.work.items.filter(q => q !== sl && q !== plus); S.dropped = z; relay(); M.sparkle(g, 'eq', { n: 6 }); react(g, 'laugh'); }]]); };
    M.play(g, {
      moves(g) {
        const out = [];
        S.T.forEach((t, i) => {
          if (t.started) return; const v = t.p === 0 ? M.num(0) : mono(t.c * t.p, t.p - 1);
          const wrong = t.p === 0 ? [M.num(t.c), M.num(1), M.vr('x')] : t.p === 1 ? [M.vr('x'), M.num(1), mono(t.c, 1), M.num(t.c + 1)] : [mono(t.c * t.p, t.p), mono(t.c, t.p - 1), mono(t.c + t.p, t.p - 1)];
          out.push({ drag: 'ddx', to: ['t' + i, 'slot' + i], busy: 0.1, ask: { v, wrong }, askAt: 0.72 * T, after: R[i].t,
            then(g) { t.started = true; M.show(g, 0.72 * T); react(g, 'think'); const col = COLS[i];
              // the term is circled, a small d/dx splits off the big one, and both fly down into the slot
              M.circle(g, 't' + i, { col, dur: 0.5 * T }); M.indicate(g, 't' + i, { dur: 0.4 * T, sc: 1.15, col: '#fff' }); M.indicate(g, 'ddx', { dur: 0.35 * T, col: CHALK });
              M.fly(g, { node: M.ddx('x'), from: 'ddx', to: 'slot' + i, dur: 0.42 * T, arc: -40, s0: s, s1: ws, col: CHALK, then(g) { g.sfx('tap'); } });
              M.fly(g, { node: mono(t.c, t.p, col), from: 't' + i, to: 'slot' + i, delay: 0.14 * T, dur: 0.42 * T, arc: -50, s0: s, s1: ws, col });
              M.at(g, [[0.05 * T, g => g.sfx('whoosh')], [0.6 * T, g => { S.slots[i].fill = P[i].row; S.slots[i].w = 8; const all = []; (function walk(q) { if (!q) return; all.push(q); for (const ch of [q.base, q.exp, q.n, q.d, ...(q.items || [])]) walk(ch); })(P[i].row); for (const q of all) q._born = -1; relay(); M.sparkle(g, 'slot' + i, { n: 8, cols: [col, '#fff'] }); react(g); }]]); },
            resolve(g) { M.show(g, R[i].t); M.at(g, [...R[i].L, [R[i].t - 0.04 * T, g => { t.done = true; const all = S.T.every(q => q.done); g.sfx(all ? 'chime' : 'coin'); if (all) dropZero(g); }]]); } });
        });
        return out;
      },
      area(g) { const i = S.T.findIndex(t => !t.started); return i < 0 ? null : ['ddx', 't' + i]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'beach', panel: PANEL, panelY: 296, panelH: 190 });
    // the turtle hops when a step lands and beams at the end
    const mk = S.mk, hopK = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'turtle', HX, HY - hopK * 22, 1.3, { t: g.t, pose: won ? 'cheer' : hopK > 0 ? 'hop' : 'idle', expr }); else SCN.host(g, c, 'turtle', HX, HY, 1.3);
    // a thin line from each finished term down to its result, in that term's colour
    S.T.forEach((t, i) => { if (!t.done || S.dropped === i) return; const a = M.box(g, 't' + i), b = M.box(g, 'slot' + i); if (!a || !b) return;
      c.save(); c.strokeStyle = COLS[i]; c.globalAlpha = 0.6; c.lineWidth = 2.5; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(a.x, a.y + a.h / 2 + 4); c.lineTo(b.x, b.y - b.h / 2 - 4); c.stroke(); c.restore(); });
    drawEx2(g, c, 'prob'); drawEx2(g, c, 'work');
    M.drawUI(g, c);
  },
});
