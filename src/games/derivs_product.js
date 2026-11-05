// derivs_product.js — PRODUCT RULE! d/dx [f · g] = f′g + fg′, with f = A·xᵐ and g = xⁿ + c.
// The player drags the d/dx onto the first factor and onto the second factor, in either order; each drag builds one term
// of f′g + fg′ by itself: the chosen factor is circled, an arrow carries d/dx down to its copy, which lands with a prime,
// and the other factor is copied down unchanged. Then the player taps each primed factor: the power-rule working
// ("2x²⁻¹ = 2x", "3x³⁻¹ + 0 = 3x²") writes itself under it and the derivative flies up into its place.
// Level 0: f = x², g = xⁿ + c. Level 1: bigger powers. Level 2: f has a coefficient and c may be negative.
// Medium mode: each derivative is picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), FC = '#2a62b0', GC = '#c0502a', TOPY = 226, L1Y = 294, L2Y = 370;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { A: 1, m: 2, n: 3 + r(2), c: 1 + r(4) };
  if (L === 1) return { A: 1, m: 2 + r(2), n: 2 + r(3), c: 1 + r(6) };
  return { A: 2 + r(2), m: 2 + r(2), n: 2 + r(3), c: (1 + r(6)) * (g.rand() < 0.5 ? -1 : 1) };
}
const col = (n, cl) => { if (!n) return n; if (n.k !== 'op' || cl) n.col = cl; for (const ch of [n.base, n.exp, n.inner, ...(n.items || [])]) col(ch, cl); return n; };
// c·x^p as a node (p ≥ 0)
const mono = (c, p, cl) => col(M.row(c === 1 && p > 0 ? null : M.num(c), p === 0 ? null : p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(p))), cl);
const gNode = (n, c, cl) => col(M.row(mono(1, n), M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c))), cl);
const PRIME = () => M.txt('′');

MG.add({
  id: 'product', stage: 'derivs', cmd: 'PRODUCT RULE!', hint: 'drag', time: 10, winText: 'Derived!', hold: 1.4,
  card: {
    title: 'The product rule', ref: 'Calculus', kind: 'Calculus',
    text: 'The derivative of a formula tells you how fast its value changes as x changes. The product rule finds the derivative of two formulas multiplied together. Call them f and g, and write f′ for the derivative of f.\n\nThe rule says: the derivative of f · g is f′ · g + f · g′. Take the derivative of one factor at a time, keep the other factor as it is, and add the two results.\n\nFor example, the derivative of x² · (x³ + 1) is 2x · (x³ + 1) + x² · 3x².\n\nWhy? Picture a rectangle with sides f and g, so its area is f · g. When both sides grow a little, the area gains a strip along each side: one strip is f′ times g, and the other is f times g′.',
    note: 'Differentiate the first factor and keep the second, then keep the first and differentiate the second. Add them: (fg)′ = f′g + fg′.',
    ask: 'What is the derivative of x · (x² + 4)? What is the derivative of x³ · (x + 2)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { A, m, n, c } = S, T = M.pace(g);
    const f = () => mono(A, m, FC), gg = () => gNode(n, c, GC);
    S.top = M.row(M.ddx('x', 'dd'), M.gap(4), M.paren(M.row(M.paren(f(), 'F'), M.paren(gg(), 'G')), 'all', { br: '[]' }));
    // line 1: (f)′ · g, and line 2: + f · (g)′; every part starts invisible and builds itself when its move is made
    S.pA = M.paren(f(), 'pA', { alpha: 0 }); S.prA = col(PRIME(), FC); S.prA.alpha = 0; S.dA = M.row(S.pA, S.prA); S.dA.id = 'dA';
    S.pB = M.paren(gg(), 'pB', { alpha: 0 }); S.prB = col(PRIME(), GC); S.prB.alpha = 0; S.dB = M.row(S.pB, S.prB); S.dB.id = 'dB';
    S.e1 = M.op('=', 'e1'); S.m1 = M.op('·', 'm1', { alpha: 0 }); S.g1 = M.paren(gg(), 'g1', { alpha: 0 });
    S.e2 = M.op('+', 'e2', { alpha: 0 }); S.f2 = f(); S.f2.id = 'f2'; S.f2.alpha = 0; S.m2 = M.op('·', 'm2', { alpha: 0 });
    S.l1 = M.row(S.e1, S.dA, S.m1, S.g1); S.l1.hide = true;
    S.l2 = M.row(S.e2, S.f2, S.m2, S.dB); S.l2.hide = true;
    const relay = () => { M.place(g, 'l1', S.l1, 50, L1Y, 31, { col: INK, left: true }); M.place(g, 'l2', S.l2, 50, L2Y, 31, { col: INK, left: true }); };
    M.place(g, 'top', S.top, 180, TOPY, 38, { col: INK }); relay();
    M.inert(g, ['all', 'e1', 'e2', 'm1', 'm2', 'g1', 'f2', 'pA', 'pB']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const fd = () => mono(A * m, m - 1, FC), gd = () => mono(n, n - 1, GC);
    const hop = (e = 'wow') => { S.hopT = g.t; S.face = e; S.faceT = g.t; };
    const think = () => { S.face = 'think'; S.faceT = g.t; };
    const land = (node, id) => { node.alpha = 1; node.pop = g.t; M.sparkle(g, id, { n: 7, cols: ['#fff6c0', '#ffd45a', '#fff'] }); g.sfx('pop'); };
    // a copy of a factor flies from the problem down into its place in a line, and appears there when it lands
    const send = (node, from, to, id, delay, arc) => M.at(g, [[delay, g => { const b = M.box(g, from); if (!b) { land(node, id); return; }
      M.fly(g, { node: { ...node, alpha: 1, id: undefined, pop: null }, from: [b.x, b.y], to: id, dur: 0.42 * T, arc, s0: 38, s1: 31, then(g) { land(node, id); } }); }]]);
    // build one term of f′g + fg′: the factor that gets differentiated is circled and an arrow carries d/dx down to it,
    // where it lands with a prime; the other factor is copied down unchanged
    const build = (k, g) => { const one = k === 1, line = one ? S.l1 : S.l2, src = one ? 'F' : 'G', keep = one ? 'G' : 'F', pp = one ? S.pA : S.pB, pr = one ? S.prA : S.prB, cl = one ? FC : GC;
      M.show(g, 1.25 * T); S.point = true; hop('wow'); line.hide = false; relay(); g.sfx('swoosh');
      M.circle(g, src, { col: cl, dur: 0.55 * T }); M.indicate(g, 'dd', { dur: 0.35 * T, col: cl });
      if (one) M.writeIn(g, S.e1, { dur: 0.2 * T }); else { S.e2.alpha = 1; M.writeIn(g, S.e2, { dur: 0.2 * T }); }
      M.arrow(g, src, one ? 'pA' : 'pB', { delay: 0.1 * T, dur: 0.4 * T, bend: one ? 46 : -46, col: cl, label: M.ddx(), ls: 26, linger: 0.75 * T });
      send(pp, src, one ? 'pA' : 'pB', one ? 'pA' : 'pB', 0.14 * T, -30);
      M.at(g, [[0.62 * T, g => { pr.alpha = 1; M.writeIn(g, pr, { dur: 0.16 * T }); pr.pop = g.t; M.indicate(g, one ? S.dA : S.dB, { delay: 0.1 * T, dur: 0.3 * T, col: cl, sc: 1.12 }); g.sfx('tap'); hop('happy'); }],
        [0.7 * T, g => { const mm = one ? S.m1 : S.m2; M.tween(g, mm, { alpha: 1 }, 0.15 * T); M.indicate(g, keep, { dur: 0.3 * T, sc: 1.08, col: '#b8b0a0' }); }],
        [1.15 * T, g => { S.point = false; }]]);
      send(one ? S.g1 : S.f2, keep, one ? 'g1' : 'f2', one ? 'g1' : 'f2', 0.72 * T, -24); };
    // differentiate a primed factor with the power rule: the working writes itself under it, then the result flies into place
    const noteFor = (k, node) => { const b = M.box(g, k === 1 ? 'dA' : 'dB') || { x: 120 }, w = M.lay(node, 24).w, x = M.clamp(b.x, 22 + w / 2, 338 - w / 2);
      M.place(g, 'note' + k, node, x, (k === 1 ? L1Y : L2Y) + 40, 24, { col: k === 1 ? FC : GC }); };
    const diff = k => { const one = k === 1, cl = one ? FC : GC, res = one ? fd() : gd();
      const rq = one ? fd() : gd(); rq.id = 'nr' + k; const q = M.row(M.op('='), rq); q.alpha = 0;
      // the working: the power comes down and the power goes down by one, m·A x^(m−1); a lone number's derivative is 0
      const body = one ? M.row(M.num(m, null, { col: '#d04a3a' }), A > 1 ? M.op('·') : null, A > 1 ? M.num(A) : null, M.sup(M.vr('x'), M.row(M.num(m, null, { col: '#d04a3a' }), M.op('-'), M.num(1))))
        : M.row(M.num(n, null, { col: '#d04a3a' }), M.sup(M.vr('x'), M.row(M.num(n, null, { col: '#d04a3a' }), M.op('-'), M.num(1))), M.op('+'), M.num(0));
      return { body, q, res, cl };
    };
    const tapMove = k => { const one = k === 1, W = diff(k), id = one ? 'dA' : 'dB';
      return { tap: id, busy: 0.1, askAt: 0.6 * T, after: 1.0 * T, ask: one ? { v: mono(A * m, m - 1), wrong: [mono(A, m - 1), mono(A * m, m), mono(A * m + 1, m - 1)] } : { v: mono(n, n - 1), wrong: [mono(1, n - 1), mono(n, n), mono(n - 1, n - 1)] },
        then(g) { if (one) S.aDone = true; else S.bDone = true; M.show(g, 0.6 * T); S.point = true; think();
          M.circle(g, id, { col: W.cl, dur: 0.5 * T }); M.light(g, one ? S.dA : S.dB, { col: W.cl });
          W.note = M.row(W.body, W.q); noteFor(k, W.note); M.writeIn(g, W.body, { dur: 0.42 * T, delay: 0.1 * T }); },
        resolve(g) { M.show(g, 1.0 * T); W.q.alpha = 1; M.writeIn(g, W.q, { dur: 0.22 * T }); M.indicate(g, W.q.items[1], { delay: 0.2 * T, dur: 0.3 * T, col: W.cl }); g.sfx('ding'); hop('wow');
          M.at(g, [[0.45 * T, g => { const from = M.box(g, 'nr' + k) || M.box(g, id);
              // the primed factor shrinks away while its derivative flies up from the working into its place
              const old = one ? S.dA : S.dB; M.tween(g, old, { alpha: 0, sc: 0.6, hl: 0 }, 0.25 * T);
              W.q.items[1].alpha = 0; M.tween(g, W.note, { alpha: 0 }, 0.3 * T, { delay: 0.1 * T });
              M.fly(g, { node: one ? fd() : gd(), from: [from.x, from.y], to: id, dur: 0.36 * T, arc: 30, s0: 24, s1: 31,
                then(g) { const gone = q => { if (q) { q.alpha = 0; for (const ch of [q.base, q.exp, q.inner, ...(q.items || [])]) gone(ch); } }; gone(old);
                  W.res.id = id; W.res.pop = g.t; W.res._born = -1; if (one) S.l1.items[1] = W.res; else S.l2.items[3] = W.res; relay(); M.inert(g, [id]);
                  M.sparkle(g, id, { n: 10, cols: [one ? '#7ab0ff' : '#ffb080', '#fff', '#ffe08a'] }); g.sfx('coin'); hop('happy'); } }); }],
            [0.95 * T, g => { delete g.s.mk.ex['note' + k]; S.point = false; }]]); } };
    };
    const tA = tapMove(1), tB = tapMove(2);
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.l1on) out.push({ drag: 'dd', to: 'F', busy: 0.1, then(g) { S.l1on = true; build(1, g); } });
        if (S.l1on && !S.aDone) out.push(tA);
        if (!S.l2on) out.push({ drag: 'dd', to: 'G', busy: 0.1, then(g) { S.l2on = true; build(2, g); } });
        if (S.l2on && !S.bDone) out.push(tB);
        return out;
      },
      area(g) { return !S.l1on ? ['dd', 'F'] : !S.aDone ? 'dA' : !S.l2on ? ['dd', 'G'] : 'dB'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'forest', panel: PANEL, panelY: 300, panelH: 252 });
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'l1'); M.drawEx(g, c, 'l2'); M.drawEx(g, c, 'note1'); M.drawEx(g, c, 'note2');
    // the frog points at the page while the work is shown, hops on each beat, and its face reacts
    const hk = S.hopT != null ? (t - S.hopT) / 0.38 : 9, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = S.mk.missAt >= 0 && t - S.mk.missAt < 0.8;
    const expr = won ? 'laugh' : lost || missed ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', 290, 596 - hop * 24, 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'frog', 290, 596, 1.35);
    M.drawUI(g, c);
  },
});
