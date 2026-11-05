// derivs_partial.js — PARTIAL DERIV! ∂/∂x (x²y + 3y) = 2xy: differentiate in x while y is held still.
// An arctic night under the northern lights. The problem is written in starlight over a frozen lake, and a snowy owl
// sits on an ice floe. Every move's working plays by itself (show your work; the fuse stands still meanwhile):
//   1. Drag ∂/∂x onto the brackets (or tap it): the operator pulses, two copies of it fly down and each term flies
//      down after it, so the working line reads = ∂/∂x(x²y) + ∂/∂x(3y) (a derivative of a sum is the sum of the
//      derivatives). Then the owl blows a gust of frost: every y freezes into a block of ice (it is treated as a number).
//   2. Power rule on the term that has x (drag its exponent onto the ∂ in front of it, or tap it): the exponent swells
//      and is circled, a copy of it drops in front of the term, "2 − 1 =" writes itself beside the power and the power
//      rolls 2 → 1 (a power of 1 then fades away). With a coefficient, "2 × 3 = 6" writes itself and the numbers merge.
//      The frozen y just shivers in its ice. The ∂ and the brackets fade and the term closes up: 2xy.
//   3. The other term (tap it): if it has only frozen letters it is a constant: it shivers, is crossed out and rolls
//      to 0, and "+ 0" fades away. If it is k·x, a power 1 writes itself on x and rolls to 0, "x⁰ = 1" writes itself and
//      x fades, leaving k.
// Moves 2 and 3 may come in either order. Wrong moves: differentiating the frozen letter (its ice block cracks and
// shakes), tapping a coefficient, or doing anything before ∂/∂x is applied. Level 0: x^m·y + k·y. Level 1: a
// coefficient, y powers, and a k·x term sometimes. Level 2: ∂/∂y, so x is the frozen letter.
// Medium mode: the new power, the constant's derivative (0) and k·x's derivative are picked from the tray.
const M = MK;
const INK = '#f2f8ff', ICE = '#9adcff', ICED = '#103a7a', GOLD = '#ffd77a', FROST = '#d8f4ff', HX = 292, HY = 604, Y1 = 228, Y2 = 340, S1 = 40, S2 = 32;

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), one = a => a[r(a.length)];
  const a = L === 2 ? 'y' : 'x', f = a === 'x' ? 'y' : 'x';
  const mix = L === 0 ? { c: 1, m: 2 + r(2), n: 1 } : L === 1 ? { c: one([1, 2, 3]), m: 2 + r(2), n: 1 + r(2) } : { c: one([1, 2, 3]), m: 2 + r(3), n: 1 + r(3) };
  const other = L === 0 || g.rand() < 0.55 ? { kind: 'const', k: 2 + r(5), j: L === 0 ? 1 : 1 + r(2) } : { kind: 'lin', k: 2 + r(6) };
  mix.kind = 'mix';
  const terms = L > 0 && g.rand() < 0.4 ? [other, mix] : [mix, other];
  return { a, f, terms };
}
// powers of x and y in a term, always written x first, then y
function factors(T, a, f) {
  if (T.kind === 'mix') return [['x', a === 'x' ? T.m : T.n], ['y', a === 'y' ? T.m : T.n]];
  if (T.kind === 'const') return [[f, T.j]];
  return [[a, 1]];
}
const fac = (v, e, id, eid) => e === 1 ? M.vr(v, id) : M.sup(M.vr(v), M.num(e, eid), id);

MG.add({
  id: 'partial', stage: 'derivs', cmd: 'PARTIAL DERIV!', hint: 'drag', time: 9, winText: 'Partial!', hold: 1.8,
  card: {
    title: 'Partial derivatives', ref: 'Multivariable calculus', kind: 'Calculus',
    text: 'A formula like x²y depends on two letters. A partial derivative asks how fast it changes when only one letter moves. ∂/∂x means: let x change, and hold y still. While y is frozen it behaves just like a number.\n\nSo treat y as a number and use the rules you already know. For x²y, the power rule acts on x² only: it becomes 2x, and the frozen y comes along, giving 2xy. A term like 3y has no x at all, so it is a constant and its derivative is 0.\n\nThat makes ∂/∂x (x²y + 3y) = 2xy.',
    note: 'To find ∂/∂x, treat every other letter as a constant and differentiate in x as usual.',
    ask: 'What is ∂/∂x of x³y² + 5y? What is ∂/∂y of x²y + 4x?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, f, terms } = S, T = M.pace(g);
    const op = (id, o) => { const lv = [M.txt('∂', null, o), M.txt('∂', null, o), M.vr(a, null, o)]; const n = M.frac(lv[0], M.row(lv[1], lv[2]), id, { small: true, alpha: o && o.alpha }); n.leaves = lv; return n; };
    // line 1: ∂/∂a (term + term)
    const termNodes = (T, k, live) => M.row(T.kind === 'mix' ? (T.c > 1 ? M.num(T.c, live ? 'c' + k : null) : null) : M.num(T.k, live ? 'c' + k : null),
      ...factors(T, a, f).flatMap(([v, e], i) => [v === f && (i || T.kind === 'mix' && T.c > 1 || T.kind !== 'mix') ? M.gap(5) : null, fac(v, e, live ? (v === a ? 'a' + k : 'f' + k) : v === f ? 'g' + k : null, live && v === a ? 'e' + k : null)]));
    S.D = op('D'); S.u = terms.map((T, k) => { const n = termNodes(T, k, false); n.id = 'u' + k; return n; });
    S.line1 = M.row(S.D, M.paren(M.row(S.u[0], M.op('+'), S.u[1]), 'L1'));
    S.relay1 = () => M.place(g, 'l1', S.line1, 180, Y1, S1, { col: INK }); S.relay1();
    S.relay2 = () => { if (!S.line2) return; if (!S.s2) { const w = M.lay(S.line2, 36).w + 40; S.s2 = Math.min(36, 36 * 330 / w); } M.place(g, 'l2', S.line2, 180, Y2, S.s2, { col: INK }); };
    S.ice = {}; S.done = [false, false]; S.applied = false;
    M.inert(g, ['L1', 'u0', 'u1', 'g0', 'g1']);
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    // the pieces of line 2: = ∂/∂a(term) + ∂/∂a(term)
    const mkPiece = (T, k) => { const P = { T, k, d: op('d' + k, { alpha: 0 }), lp: M.txt('(', null, { alpha: 0 }), rp: M.txt(')', null, { alpha: 0 }), term: termNodes(T, k, true) };
      P.term.items.forEach(n => n.alpha = 0); P.coef = T.kind !== 'mix' || T.c > 1 ? P.term.items[0] : null;
      P.row = M.row(P.d, P.lp, P.term, P.rp); P.row.id = 'p' + k; return P; };
    const findIn = (n, id) => M.find(n, id);

    // ---- 1. apply ∂/∂a: split over the sum, then freeze the other letter ----
    const apply = {
      busy: 0.1,
      then(g) {
        S.applied = true; S.point = true; hop('wow'); M.show(g, 1.45 * T); g.sfx('swoosh');
        M.indicate(g, S.D, { col: GOLD, dur: 0.4 * T }); M.inert(g, ['D', 'u0', 'u1', 'g0', 'g1']);
        S.P = terms.map(mkPiece); S.eq = M.op('=', 'eq2', { alpha: 0 }); S.plus = M.op('+', 'pl2', { alpha: 0 });
        S.line2 = M.row(S.eq, S.P[0].row, S.plus, S.P[1].row); S.relay2(); M.inert(g, ['eq2', 'pl2']);
        M.tween(g, S.eq, { alpha: 1 }, 0.25 * T, { delay: 0.1 * T });
        S.P.forEach((P, k) => {
          M.fly(g, { node: op(null, { col: GOLD }), from: 'D', to: 'd' + k, delay: 0.12 * T + k * 0.1 * T, dur: 0.42 * T, arc: -30, s0: S1, s1: S.s2,
            then(g) { P.d.leaves.forEach(n => n.alpha = 1); P.d.alpha = 1; P.d.pop = g.t; g.sfx('tap', { pitch: 1 + k * 0.15 }); } });
          M.fly(g, { node: termNodes(P.T, k, false), from: 'u' + k, to: 'p' + k, delay: 0.22 * T + k * 0.1 * T, dur: 0.42 * T, arc: 20, s0: S1, s1: S.s2, col: INK,
            then(g) { P.term.items.forEach(n => n.alpha = 1); P.lp.alpha = P.rp.alpha = 1; } });
        });
        M.tween(g, S.plus, { alpha: 1 }, 0.25 * T, { delay: 0.5 * T });
        // the owl blows frost: every frozen letter turns to ice, in line 1 and line 2
        M.at(g, [[0.78 * T, g => { S.gust = g.t; g.sfx('swoosh'); hop('laugh'); }],
          ...S.P.map((P, k) => [0.92 * T + k * 0.16 * T, g => { const id = 'f' + k; if (M.node(g, 'g' + k)) S.ice['g' + k] = g.t; if (M.node(g, id)) { S.ice[id] = g.t; M.sparkle(g, id, { cols: [FROST, '#fff', ICE], n: 10 }); g.sfx('ding', { pitch: 1.4 + k * 0.1 }); } }]),
          [1.3 * T, g => { S.point = false; }]]);
      },
    };
    // the piece closes up: ∂ and brackets fade, the term's symbols glide together into the result
    const collapse = (g, P, nodes) => { [P.d, ...P.d.leaves, P.lp, P.rp].forEach(n => M.tween(g, n, { alpha: 0 }, 0.18 * T));
      M.at(g, [[0.2 * T, g => { const res = M.row(...nodes); res.id = 'r' + P.k; S.line2.items[S.line2.items.indexOf(P.row)] = res; P.res = res; S.relay2(); M.inert(g, ['r' + P.k]); }]]); };
    // ---- 2. the power rule on the term that has the moving letter ----
    const power = P => { const TT = P.T, k = P.k, m = TT.m;
      return {
        busy: 0.1, askAt: 0.78 * T, after: (TT.c > 1 ? 1.35 : 0.95) * T, ask: { v: m - 1, wrong: [m, m + 1, 0] },
        then(g) {
          S.done[k] = true; S.point = true; hop('think'); M.show(g, 0.78 * T); g.sfx('swoosh');
          P.act = findIn(P.term, 'a' + k); P.ex = P.act.exp;
          M.circle(g, P.ex, { col: GOLD, dur: 0.45 * T }); M.tween(g, P.ex, { sc: 1.5, hl: 1, dy: -4 }, 0.22 * T); P.ex.hlc = GOLD;
          if (S.ice['f' + k]) S.shiver = { id: 'f' + k, t: g.t };
          // a copy of the power drops in front of the term
          P.mN = M.num(m, 'm' + k, { alpha: 0, col: GOLD }); P.dot = TT.c > 1 ? M.op('·', null, { alpha: 0 }) : null;
          P.term.items.unshift(...[P.mN, P.dot].filter(Boolean)); S.relay2();
          M.fly(g, { node: M.num(m, null, { col: GOLD }), from: 'e' + k, to: 'm' + k, delay: 0.12 * T, dur: 0.36 * T, arc: -40, s0: S.s2 * 0.62 * 1.5, s1: S.s2,
            then(g) { P.mN.alpha = 1; P.mN.pop = g.t; if (P.dot) M.tween(g, P.dot, { alpha: 1 }, 0.15 * T); g.sfx('pop'); hop('wow'); } });
          P.q = M.num(m - 1, 'q' + k, { alpha: 0 }); P.note = M.row(M.num(m), M.op('-'), M.num(1), M.op('='), P.q);
          M.at(g, [[0.45 * T, g => { const b = M.box(g, 'e' + k); M.place(g, 'n' + k, P.note, b.x + 42, b.y - 30, 24, { col: GOLD }); M.writeIn(g, P.note, { dur: 0.28 * T }); }]]);
        },
        resolve(g) {
          M.show(g, (TT.c > 1 ? 1.35 : 0.95) * T); P.q.alpha = 1; M.writeIn(g, P.q, { dur: 0.16 * T }); g.sfx('ding');
          M.roll(g, P.ex, m - 1, { delay: 0.12 * T, dur: 0.3 * T });
          M.at(g, [[0.2 * T, g => M.tween(g, P.ex, { sc: 1, hl: 0, dy: 0 }, 0.25 * T)],
            [0.45 * T, g => { M.tween(g, P.note, { alpha: 0 }, 0.15 * T); if (m - 1 === 1) M.tween(g, P.ex, { alpha: 0 }, 0.18 * T); M.sparkle(g, 'a' + k, { n: 8 }); }]]);
          let t0 = 0.62 * T, coefN = P.mN;
          if (TT.c > 1) { // m × c = mc: the numbers merge
            const cN = P.term.items.find(n => n.id === 'c' + k), prod = m * TT.c; coefN = cN;
            M.at(g, [[0.55 * T, g => { const nn = M.row(M.num(m), M.op('×'), M.num(TT.c), M.op('='), M.num(prod)); const b = M.box(g, 'p' + k); M.place(g, 'k' + k, nn, M.clamp(b.x, 90, 270), Y2 + 52, 24, { col: GOLD }); M.writeIn(g, nn, { dur: 0.3 * T }); M.circle(g, ['m' + k, 'c' + k], { col: GOLD, dur: 0.4 * T }); }],
              [0.9 * T, g => { M.tween(g, P.mN, { alpha: 0 }, 0.15 * T); M.tween(g, P.dot, { alpha: 0 }, 0.15 * T); M.roll(g, cN, prod, { dur: 0.25 * T }); cN.col = GOLD; g.sfx('coin'); }],
              [1.12 * T, g => { M.tween(g, g.s.mk.ex['k' + k].node, { alpha: 0 }, 0.15 * T); }]]);
            t0 = 1.0 * T;
          }
          M.at(g, [[t0, g => { delete g.s.mk.ex['n' + k];
            const fz = findIn(P.term, 'f' + k), act = m - 1 === 1 ? P.act.base : P.act; if (m - 1 === 1) { act.id = 'a' + k; }
            collapse(g, P, P.term.items.filter(n => !((n === P.mN || n === P.dot) && TT.c > 1)).map(n => n === P.act ? act : n)); hop('laugh'); S.point = false; }]]);
        },
      }; };
    // ---- 3. the other term: a constant goes to 0; k·x goes to k ----
    const other = P => { const TT = P.T, k = P.k;
      if (TT.kind === 'const') return {
        busy: 0.1, askAt: 0.55 * T, after: 0.8 * T, ask: { v: 0, wrong: [TT.k, 1, TT.k * TT.j] },
        then(g) { S.done[k] = true; S.point = true; hop('think'); M.show(g, 0.55 * T);
          M.circle(g, 'p' + k, { col: ICE, dur: 0.45 * T }); S.shiver = { id: 'f' + k, t: g.t }; M.sparkle(g, 'f' + k, { cols: [FROST, '#fff'], n: 8 }); g.sfx('tap'); },
        resolve(g) { M.show(g, 0.8 * T); M.strike(g, P.term, { dur: 0.2 * T, col: ICE }); g.sfx('ding');
          M.at(g, [[0.22 * T, g => { [...P.d.leaves, P.lp, P.rp, ...P.term.items, ...P.term.items.flatMap(n => { const q = []; (function w(x) { if (!x) return; if (/^(num|var|txt|op)$/.test(x.k)) q.push(x); [x.base, x.exp, ...(x.items || [])].forEach(w); })(n); return q; })].forEach(n => M.tween(g, n, { alpha: 0 }, 0.15 * T)); }],
            [0.38 * T, g => { const z = M.num(0, 'z' + k, { _born: -1, pop: g.t, col: GOLD }); S.line2.items[S.line2.items.indexOf(P.row)] = z; P.res = z; S.relay2(); M.inert(g, ['z' + k]); M.sparkle(g, z, { n: 8 }); g.sfx('pop'); }],
            [0.58 * T, g => { M.tween(g, P.res, { alpha: 0 }, 0.16 * T); M.tween(g, S.plus, { alpha: 0 }, 0.16 * T); }],
            [0.76 * T, g => { S.line2.items = S.line2.items.filter(n => n !== P.res && n !== S.plus); S.plusGone = true; S.relay2(); hop('laugh'); S.point = false; }]]); },
      };
      return { // k·a: a¹ → a⁰ = 1
        busy: 0.1, askAt: 0.55 * T, after: 1.0 * T, ask: { v: TT.k, wrong: [0, TT.k + 1, 1] },
        then(g) { S.done[k] = true; S.point = true; hop('think'); M.show(g, 0.55 * T);
          const v = findIn(P.term, 'a' + k); v.id = null; P.e1 = M.num(1, 'e' + k, { col: GOLD }); P.sup = M.sup(v, P.e1, 'a' + k); P.term.items[P.term.items.indexOf(v)] = P.sup; S.relay2();
          M.circle(g, P.sup, { col: GOLD, dur: 0.4 * T }); M.writeIn(g, P.e1, { dur: 0.25 * T, delay: 0.12 * T }); g.sfx('tap'); },
        resolve(g) { M.show(g, 1.0 * T); M.roll(g, P.e1, 0, { dur: 0.28 * T }); g.sfx('ding');
          M.at(g, [[0.3 * T, g => { const b = M.box(g, 'a' + k); const nn = M.row(M.sup(M.vr(a), M.num(0)), M.op('='), M.num(1)); M.place(g, 'n' + k, nn, M.clamp(b.x + 30, 80, 290), Y2 + 52, 24, { col: GOLD }); M.writeIn(g, nn, { dur: 0.25 * T }); }],
            [0.55 * T, g => { M.tween(g, P.sup.base, { alpha: 0 }, 0.16 * T); M.tween(g, P.e1, { alpha: 0 }, 0.16 * T); M.tween(g, g.s.mk.ex['n' + k].node, { alpha: 0 }, 0.2 * T, { delay: 0.15 * T }); }],
            [0.72 * T, g => { const c = P.term.items[0]; c.pop = g.t; collapse(g, P, [c]); hop('laugh'); S.point = false; }]]); },
      }; };
    M.play(g, {
      moves(g) {
        if (!S.applied) return [{ ...apply, drag: 'D', to: 'L1', area: [60, Y1 - 50, 350, Y1 + 30] }, { ...apply, tap: 'D' }];
        const out = [];
        S.P.forEach((P, k) => { if (S.done[k]) return;
          if (P.T.kind === 'mix') { const mv = power(P); out.push({ ...mv, drag: 'e' + k, to: ['d' + k, ...(P.T.c > 1 ? ['c' + k] : [])] }, { ...mv, tap: ['e' + k, 'a' + k, 'p' + k] }); }
          else { const mv = other(P); out.push({ ...mv, tap: ['p' + k, P.T.kind === 'const' ? 'f' + k : 'a' + k, 'c' + k, 'd' + k] }); } });
        return out;
      },
      area(g) { if (!S.applied) return ['D', 'L1']; const k = S.done.indexOf(false); return k < 0 ? null : 'p' + k; },
      onWin(g) { if (S.line2) S.line2.pop = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; const I = K.missInfo || {}, id = I.tap || I.to || I.drag || '';
      if (/^f\d$/.test(id)) { S.crack = { id, t: g.t }; M.sparkle(g, id, { cols: [FROST, '#fff', '#ff8a8a'], n: 10 }); } }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('derivs_partial_arctic', arctic), 0, 0, W, H);
    // the aurora ripples, stars twinkle, and snow drifts
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let b = 0; b < 3; b++) { const col = ['rgba(90,255,170,', 'rgba(120,200,255,', 'rgba(200,120,255,'][b]; c.beginPath();
      for (let x = -10; x <= W + 10; x += 10) { const y = 70 + b * 26 + Math.sin(x * 0.018 + t * 0.6 + b) * 18 + Math.sin(x * 0.05 - t * 0.9 + b * 2) * 6; x < 0 ? c.moveTo(x, y) : c.lineTo(x, y); }
      for (let x = W + 10; x >= -10; x -= 10) { const y = 70 + b * 26 + Math.sin(x * 0.018 + t * 0.6 + b) * 18 + Math.sin(x * 0.05 - t * 0.9 + b * 2) * 6 + 60 + Math.sin(x * 0.03 + t) * 10; c.lineTo(x, y); }
      const gr = c.createLinearGradient(0, 40, 0, 200); gr.addColorStop(0, col + '0)'); gr.addColorStop(0.4, col + (0.16 + 0.05 * Math.sin(t + b)) + ')'); gr.addColorStop(1, col + '0)'); c.fillStyle = gr; c.fill(); }
    c.restore();
    c.save(); for (let i = 0; i < 26; i++) { const x = (i * 71 + Math.sin(t * 0.6 + i) * 14 + t * 6) % W, y = (i * 113 + t * (14 + i % 5 * 4)) % H; c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.arc(x, y, 1 + (i % 3) * 0.6, 0, 7); c.fill(); } c.restore();
    // ice blocks behind the frozen letters, where the letters were drawn last frame (so they follow every glide)
    S.iceAt = S.iceAt || {};
    for (const id of Object.keys(S.ice)) { const q = S.iceAt[id], n = M.node(g, id); if (!q || !n) continue; const k = M.clamp((t - S.ice[id]) / 0.3, 0, 1), al = (n.alpha ?? 1);
      let sx = 0; if (S.shiver && S.shiver.id === id && t - S.shiver.t < 0.6) sx = Math.sin((t - S.shiver.t) * 50) * 2.5 * (1 - (t - S.shiver.t) / 0.6);
      const cr = S.crack && S.crack.id === id && t - S.crack.t < 0.6; if (cr) sx = Math.sin((t - S.crack.t) * 60) * 4;
      iceBlock(c, q.x + sx, q.y, q.w + 8, q.h + 6, k * al, cr); n.col = ICED; if (n.base) n.base.col = ICED; if (n.exp) n.exp.col = ICED; n.dx = sx; }
    // the gust of frost from the owl
    if (S.gust != null && t - S.gust < 0.6) { const k = (t - S.gust) / 0.6; c.save(); for (let i = 0; i < 26; i++) { const u = M.clamp(k * 1.4 - i * 0.02, 0, 1); if (u <= 0 || u >= 1) continue; const x = M.lerp(HX - 20, 60 + (i * 47) % 240, u), y = M.lerp(HY - 70, Y2 - 10 + (i % 5) * 6, u) - Math.sin(u * Math.PI) * 60; c.globalAlpha = 1 - u; c.fillStyle = i % 2 ? '#fff' : FROST; c.beginPath(); c.arc(x, y, 2 + (i % 3), 0, 7); c.fill(); } c.restore(); }
    M.drawEx(g, c, 'l1'); M.drawEx(g, c, 'l2');
    for (const id of Object.keys(S.ice)) { const b = M.box(g, id), n = M.node(g, id); if (b && n) S.iceAt[id] = { x: b.x + (n._ax || 0), y: b.y + (n._ay || 0), w: b.w, h: b.h }; }
    for (const key of Object.keys(S.mk.ex)) if (/^[nk]\d$/.test(key)) M.drawEx(g, c, key);
    // the snowy owl on its floe
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : S.gust != null && t - S.gust < 0.5 ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', HX, HY - hopK * 22, 1.4, { t, pose, expr, facing: -1, tint: '#f4f2ee' }); else SCN.host(g, c, 'owl', HX, HY, 1.4);
    M.drawUI(g, c);
  },
});
// an ice block: translucent blue with a bright edge, a highlight and a few cracks; k grows it in
function iceBlock(c, x, y, w, h, k, cracked) {
  if (k <= 0.01) return; c.save(); c.globalAlpha *= Math.min(1, k * 1.2); const s = 0.6 + 0.4 * M.ease(k); c.translate(x, y); c.scale(s, s);
  const gr = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, 'rgba(225,248,255,0.92)'); gr.addColorStop(1, 'rgba(140,210,245,0.85)');
  c.fillStyle = gr; c.strokeStyle = cracked ? '#ff8a8a' : '#ffffff'; c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 6); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.roundRect(-w / 2 + 3, -h / 2 + 3, w * 0.4, 3, 1.5); c.fill();
  c.strokeStyle = cracked ? 'rgba(220,60,60,0.8)' : 'rgba(255,255,255,0.55)'; c.lineWidth = 1; c.beginPath(); c.moveTo(w / 2 - 6, -h / 2 + 4); c.lineTo(w / 2 - 12, -h / 2 + 12); c.lineTo(w / 2 - 9, -h / 2 + 18);
  if (cracked) { c.moveTo(-w / 2 + 4, h / 2 - 3); c.lineTo(0, 0); c.lineTo(w / 2 - 4, -h / 2 + 6); } c.stroke(); c.restore();
}
// the arctic: a deep night sky, far snowy hills, a frozen lake reflecting the sky, and the owl's ice floe
function arctic(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#060a24'); sk.addColorStop(0.6, '#0e2048'); sk.addColorStop(1, '#1e3a6a'); c.fillStyle = sk; c.fillRect(0, 0, W, 420);
  const R = P.rng(77); for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(255,255,240,${0.3 + R() * 0.6})`; c.beginPath(); c.arc(R() * W, R() * 380, R() * 1.3 + 0.3, 0, 7); c.fill(); }
  c.fillStyle = '#d8e8f8'; c.beginPath(); c.arc(64, 132, 16, 0, 7); c.fill(); c.fillStyle = 'rgba(216,232,248,0.15)'; c.beginPath(); c.arc(64, 132, 30, 0, 7); c.fill();
  // far hills of snow
  c.fillStyle = '#2a4a7a'; c.beginPath(); c.moveTo(0, 430); for (let x = 0; x <= W; x += 12) c.lineTo(x, 404 - Math.sin(x * 0.02 + 1) * 22 - Math.sin(x * 0.07) * 6); c.lineTo(W, 430); c.fill();
  c.fillStyle = '#4a6a9a'; c.beginPath(); c.moveTo(0, 440); for (let x = 0; x <= W; x += 12) c.lineTo(x, 424 - Math.sin(x * 0.03 + 3) * 12); c.lineTo(W, 440); c.fill();
  // the frozen lake
  const lk = c.createLinearGradient(0, 430, 0, H); lk.addColorStop(0, '#5a86b8'); lk.addColorStop(1, '#2a4a78'); c.fillStyle = lk; c.fillRect(0, 432, W, H - 432);
  c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 1.2; for (let i = 0; i < 9; i++) { const x = R() * W, y = 450 + R() * 180; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 20 + R() * 40, y + (R() - 0.5) * 12); c.lineTo(x + 50 + R() * 40, y + (R() - 0.5) * 20); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(R() * W, 460 + R() * 160, 30 + R() * 30, 3, 0, 0, 7); c.fill(); }
  // the owl's ice floe
  c.fillStyle = 'rgba(10,20,50,0.3)'; c.beginPath(); c.ellipse(HX, HY + 10, 70, 14, 0, 0, 7); c.fill();
  c.fillStyle = '#eaf6ff'; c.beginPath(); c.moveTo(HX - 66, HY + 2); c.lineTo(HX - 50, HY - 10); c.lineTo(HX + 40, HY - 12); c.lineTo(HX + 66, HY); c.lineTo(HX + 54, HY + 12); c.lineTo(HX - 56, HY + 12); c.closePath(); c.fill();
  c.fillStyle = '#b8daf2'; c.fillRect(HX - 56, HY + 4, 110, 8);
}
