// derivs_quotient.js — QUOTIENT RULE! d/dx [f/g] = (f′g − fg′)/g², on a chalkboard in the snow.
// The working line under the problem is the rule's template with two empty slots: (□ · g − f · □)/g².
// Every step is acted out (show your work):
//   1. Drag the d/dx onto the top f (or its slot): f is circled, a copy of it flies down into the first slot, and the
//      power rule plays there: the exponent lifts off and drops in front, and the exponent rolls down by one.
//   2. The same for the bottom g: its copy flies into the second slot, the constant is crossed out (its derivative is
//      0) and the power rule plays on the rest. Steps 1 and 2 may come in either order.
//   3. Tap the top of the working line: arrows hand f′ to each term of g and the product is written out, f · g′ is
//      multiplied out, the like terms light up, a note combines them ("2x² − x² = x²"), and the top settles.
// Level 0: x²/(x + b). Level 1: x³/(x + b). Level 2: x²/(x² + b), where the x³ terms cancel.
// Medium mode: each derivative opens the tray once the copy has landed in its slot.
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), CF = '#ffd45a', CG = '#ff9ab8', HX = 72, HY = 596;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), b = 1 + r(4);
  return [{ n: 2, m: 1, b }, { n: 3, m: 1, b }, { n: 2, m: 2, b: 1 + r(5) }][g.level];
}
const pw = (p, id, col) => p === 1 ? M.vr('x', id, { col }) : M.sup(M.vr('x', id, { col }), M.num(p, null, { col }));
// c·x^p as a node (c = 1 hides the coefficient, p = 0 is a plain number)
const mono = (c, p, col) => p === 0 ? M.num(c, null, { col }) : M.row(c === 1 ? null : M.num(c, null, { col }), pw(p, null, col));

// every id inside a node (so a tap anywhere on the top of the fraction counts)
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); for (const ch of [q.base, q.exp, q.n, q.d, q.inner, q.fill, ...(q.items || [])]) walk(ch); })(n); return out; };
// ---- the power rule, acted out on a slot's contents ----
// P holds c·xᵖ (+ b) as separate nodes, so each part can roll, fly, be crossed out and glide to its new place.
function term(pre, c, p, b, col) {
  const P = { pre, c, p, col, row: M.row() };
  if (p === 0) P.co = M.num(c, pre + 'c', { col });
  else { P.co = c === 1 ? null : M.num(c, pre + 'c', { col }); P.x = M.vr('x', pre + 'x', { col }); P.ex = p > 1 ? M.num(p, pre + 'e', { col }) : null; P.pw = P.ex ? M.sup(P.x, P.ex) : P.x; }
  if (b) { P.ko = M.op('+', pre + 'o', { col }); P.kn = M.num(b, pre + 'k', { col }); }
  P.sync = () => { P.row.items = [P.co, P.pw, P.ko, P.kn].filter(Boolean); }; P.sync(); return P;
}
// returns { L: beats for MK.at, t: their length }; relay() lays the expression out again after a change
function powerRule(P, T, relay, react) {
  const L = [], col = P.col; let t = 0;
  const gone = (g, list, d) => { for (const n of list) M.tween(g, n, { alpha: 0, dy: 8, sc: 0.7 }, d); };
  if (P.kn) { // a constant never changes, so its derivative is 0: it is crossed out and drops away
    L.push([0, g => { M.strike(g, P.ko, { dur: 0.22 * T }); M.strike(g, P.kn, { dur: 0.22 * T, delay: 0.06 * T }); g.sfx('swoosh'); }],
      [0.34 * T, g => gone(g, [P.ko, P.kn], 0.2 * T)],
      [0.56 * T, g => { P.ko = P.kn = null; P.sync(); relay(); }]);
    t = 0.62 * T;
  }
  if (P.p === 1) { // x has slope 1
    L.push([t, g => M.indicate(g, P.x, { dur: 0.3 * T, col: '#fff' })],
      [t + 0.3 * T, g => { P.co = M.num(1, P.pre + 'c', { col, pop: g.t }); P.x = P.pw = null; P.sync(); relay(); g.sfx('pop'); react(g); M.sparkle(g, P.pre + 'c', { n: 8 }); }]);
    return { L, t: t + 0.55 * T };
  }
  const p = P.p, land = t + 0.42 * T;
  L.push([t, g => { // the power lifts off and drops in front of the x
    const e = M.box(g, P.ex.id), f = M.box(g, P.x.id); if (!e || !f) return;
    M.indicate(g, P.ex, { dur: 0.3 * T, sc: 1.5, col: '#fff' });
    M.fly(g, { node: M.num(p, null, { col }), from: [e.x, e.y], to: [f.x - f.w / 2 - f.s * 0.26, f.y], dur: 0.42 * T, arc: -42, s0: e.s, s1: f.s, col }); g.sfx('whoosh'); }],
    [land, g => { P.co = M.num(p, P.pre + 'c', { col, _born: -1, pop: g.t }); P.sync(); relay(); g.sfx('pop'); react(g);
      M.roll(g, P.ex, p - 1, { dur: 0.3 * T, delay: 0.1 * T }); M.sparkle(g, P.pre + 'c', { n: 8 }); }]);
  if (p - 1 === 1) { // x¹ is just x
    L.push([land + 0.5 * T, g => gone(g, [P.ex], 0.18 * T)], [land + 0.7 * T, g => { P.pw = P.x; P.ex = null; P.sync(); relay(); }]);
    return { L, t: land + 0.8 * T };
  }
  return { L, t: land + 0.55 * T };
}

MG.add({
  id: 'derivs_quotient', stage: 'derivs', cmd: 'QUOTIENT RULE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Derived!', hold: 1.6,
  card: {
    title: 'The quotient rule', ref: 'Calculus', kind: 'Derivatives',
    text: 'A quotient is one thing divided by another. The quotient rule finds the derivative of a fraction f/g, where f is the top and g is the bottom. The derivative is how fast a formula changes, and f′ (read "f prime") means the derivative of f.\n\nThe rule says: d/dx (f/g) = (f′g − fg′)/g². In words: the derivative of the top times the bottom, minus the top times the derivative of the bottom, all over the bottom squared.\n\nFor example, take x²/(x + 1). Here f = x², so f′ = 2x, and g = x + 1, so g′ = 1. The top becomes 2x(x + 1) − x² · 1 = 2x² + 2x − x² = x² + 2x. So the derivative is (x² + 2x)/(x + 1)².\n\nThe order matters: f′g comes first, because of the minus sign.',
    note: 'd/dx (f/g) = (f′g − fg′)/g². Differentiate the top and the bottom, put them in the pattern, then simplify the top.',
    ask: 'What is the derivative of x/(x + 2)? What is the derivative of x²/(x + 3)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { n, m, b } = S, T = M.pace(g), WS = g.level === 2 ? 31 : 34;
    S.s1 = M.slot('s1', { w: 46, col: CF }); S.s2 = M.slot('s2', { w: 46, col: CG });
    const G = (i1, i2) => M.row(pw(m, i1), M.op('+'), M.num(b, i2));
    S.f = Object.assign(pw(n), { id: 'f' }); S.g = Object.assign(G(), { id: 'g' });
    S.prob = M.row(M.ddx('x', 'ddx'), M.gap(4), M.paren(M.frac(S.f, S.g)));
    S.gp = M.paren(G('wg1', 'wg2'), 'gp'); S.fw = Object.assign(pw(n), { id: 'fw' });
    S.mn = M.op('-', 'mn'); S.d1 = M.op('·', 'dt1'); S.d2 = M.op('·', 'dt2');
    S.top = M.row(S.s1, S.d1, S.gp, S.mn, S.fw, S.d2, S.s2); S.top.id = 'num';
    S.work = M.row(M.op('=', 'eq'), M.frac(S.top, M.sup(M.paren(G()), M.num(2)), 'wf'));
    const relay = () => M.place(g, 'work', S.work, 180, 346, WS, { col: INK });
    M.place(g, 'prob', S.prob, 180, 236, 40, { col: INK }); relay();
    M.inert(g, ['res', 'eq', 'mn', 'dt1', 'dt2', 'wf']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // a derivative: the part is circled, its copy flies into the slot, then (after the tray in medium mode) the power rule
    const P1 = term('a', 1, n, 0, CF), P2 = term('b', 1, m, b, CG), R1 = powerRule(P1, T, relay, react), R2 = powerRule(P2, T, relay, react);
    const start = (g, src, slot, P, col) => { M.show(g, 0.62 * T); react(g, 'think'); S.point = true;
      M.circle(g, src, { col, dur: 0.5 * T }); M.indicate(g, src, { dur: 0.4 * T, sc: 1.15, col: '#fff' });
      M.fly(g, { node: src === 'f' ? pw(n, null, col) : M.row(pw(m, null, col), M.op('+', null, { col }), M.num(b, null, { col })), from: src, to: slot.id, delay: 0.12 * T, dur: 0.42 * T, arc: -50, col });
      M.at(g, [[0.12 * T, g => g.sfx('whoosh')], [0.55 * T, g => { slot.fill = P.row; for (const q of P.row.items) q._born = -1; relay(); M.sparkle(g, slot.id, { n: 8, cols: [col, '#fff'] }); g.sfx('tap'); }]]); };
    const finish = (g, R, done) => { M.show(g, R.t); M.at(g, [...R.L, [R.t - 0.05 * T, g => { S[done] = true; g.sfx('coin'); }]]); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.t1) out.push({ drag: 'ddx', to: ['f', 's1'], busy: 0.1, askAt: 0.62 * T, after: R1.t, ask: { v: mono(n, n - 1), wrong: [mono(1, n - 1), mono(n, n), mono(n - 1, n - 1), M.num(n)] },
          then(g) { S.t1 = true; start(g, 'f', S.s1, P1, CF); }, resolve(g) { finish(g, R1, 'r1'); } });
        if (!S.t2) out.push({ drag: 'ddx', to: ['g', 's2'], busy: 0.1, askAt: 0.62 * T, after: R2.t, ask: { v: mono(m, m - 1), wrong: m === 1 ? [M.num(0), M.vr('x'), M.num(b), M.num(b + 1)] : [M.row(M.num(2), M.vr('x'), M.op('+'), M.num(b)), M.vr('x'), M.num(2)] },
          then(g) { S.t2 = true; start(g, 'g', S.s2, P2, CG); }, resolve(g) { finish(g, R2, 'r2'); } });
        if (S.r1 && S.r2 && !S.done) out.push({ tap: ['num', ...idsIn(S.top)], busy: 0.1, then(g) { S.done = true; expand(g); } });
        return out;
      },
      area(g) { return !S.t1 ? ['ddx', 'f'] : !S.t2 ? ['ddx', 'g'] : ['num']; },
    });
    // 3. multiply out the top and combine like terms
    function expand(g) {
      const N = n + m - 1, t1 = mono(n, N), plus = M.op('+'), t2 = mono(n * b, n - 1), t3 = mono(m, N), len = 1.85 * T;
      M.show(g, len); react(g, 'think'); S.point = true;
      const top = id => { const q = M.box(g, id); return q ? [q.x, q.y - q.h / 2 - 2] : [180, 320]; };
      M.at(g, [
        [0, g => { M.circle(g, ['s1', 'gp'], { col: CF, dur: 0.5 * T }); // f′ times each term of g
          M.arrow(g, top('s1'), top('wg1'), { bend: 26, dur: 0.28 * T, col: CF, linger: 0.25 }); M.arrow(g, top('s1'), top('wg2'), { bend: 34, dur: 0.28 * T, delay: 0.14 * T, col: CF, linger: 0.2 }); g.sfx('swoosh'); }],
        [0.5 * T, g => { S.top.items = [t1, plus, t2, S.mn, S.fw, S.d2, S.s2]; relay(); g.sfx('pop'); react(g); M.sparkle(g, 'num', { n: 6, cols: [CF, '#fff'] }); }],
        [0.62 * T, g => { M.circle(g, ['fw', 's2'], { col: CG, dur: 0.45 * T }); M.arrow(g, top('fw'), top('s2'), { bend: 26, dur: 0.26 * T, col: CG, linger: 0.2 }); }],
        [0.95 * T, g => { S.top.items = [t1, plus, t2, S.mn, t3]; relay(); g.sfx('pop'); react(g); }],
        [1.08 * T, g => { // the like terms light up and a note combines them
          for (const q of [t1, t3]) M.light(g, q, { col: '#9ad8ff', dur: 0.2 * T });
          const sum = n === m ? M.num(0) : mono(n - m, N);
          M.note(g, { node: M.row(mono(n, N), M.op('-'), mono(m, N), M.op('='), sum), at: 'num', off: [0, -42], s: 24, col: '#9ad8ff', write: 0.3 * T, hold: 0.22 * T, fade: 0.2 * T });
          if (n === m) { M.strike(g, t1, { delay: 0.3 * T }); M.strike(g, t3, { delay: 0.36 * T }); for (const q of [t1, t3, S.mn, plus]) M.tween(g, q, { alpha: 0 }, 0.14 * T, { delay: 0.36 * T }); } }],
        [1.6 * T, g => { // the top settles: like terms combined (or cancelled), the rest glides into place
          if (n === m) { for (const q of [t1, t3, S.mn, plus]) q.alpha = 0; S.top.items = [t2]; }
          else { const r1 = mono(n - m, N); S.top.items = [r1, plus, t2]; }
          relay(); g.sfx('chime'); react(g, 'laugh'); S.point = false; M.sparkle(g, 'num', { n: 16, cols: [CF, CG, '#fff'] }); M.indicate(g, S.top, { dur: 0.3 * T, sc: 1.1, col: '#fff' }); }],
      ]);
    }
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'snow', panel: PANEL, panelY: 292, panelH: 220 });
    // the penguin points at the board while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', HX, HY - hopK * 24, 1.3, { t: g.t, pose, expr }); else SCN.host(g, c, 'penguin', HX, HY, 1.3);
    // colour the f and g of the problem like their slots, so the player sees which derivative goes where
    const tint = (n, col) => { if (!n) return; n.col = col; for (const ch of [n.base, n.exp, ...(n.items || [])]) tint(ch, col); }; tint(S.f, CF); tint(S.g, CG);
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    M.drawUI(g, c);
  },
});
