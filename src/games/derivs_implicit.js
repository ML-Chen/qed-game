// derivs_implicit.js — IMPLICIT DIFF! Find dy/dx for a ring A·x² + B·y² = K without solving for y first.
// A rooftop observatory at twilight. The equation is written in starlight; under it a brass orrery ring is the curve
// itself, with a little moon running round it. A brass medallion carries the d/dx.
// Moves (every one acts its working out by itself, show your work):
//   1–3. Drag the d/dx onto each term, in any order. The d/dx flies down and sits in front of the term, the line making
//        room. For x²: the 2 hops down in front (and multiplies any number there), the power rolls 2 → 1 and melts away,
//        and the d/dx puffs out: 2x. For y²: the same power rule gives 2y, but y depends on x, so the d/dx stays: a copy
//        of y flies up into it, it turns into a pink dy/dx tag and slides behind the term (the chain rule).
//        For the constant: it rolls down to 0.
//   4.   Tap the dy/dx tag to get it alone: the 0 fades, the x term slides across the = and its + flips to −, then the
//        2y drops under it (divide both sides), the fraction bar draws itself, and the common 2 is crossed out and
//        rolls away: dy/dx = −Ax/(By). The orrery's moon grows a gold tangent line whose slope is that dy/dx.
// Level 0: x² + y² = r². Level 1: one squared term has a coefficient 2 or 3. Level 2: both do (4x² + 9y² = 36).
// Medium mode: the x term, the y term (the classic mistake: forgetting dy/dx) and the final answer come from the tray.
const M = MK, INK = '#fff6e0', PINK = '#ff62cc', GOLD = '#ffd45a', BRASS = '#e0b25a';
const LINEY = 312, TOKY = 228, ORX = 180, ORY = 468;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), R = a => a[r(a.length)];
  if (L === 0) { const k = R([3, 4, 5, 6, 10]); return { A: 1, B: 1, K: k * k }; }
  if (L === 1) { const [A, B] = R([[2, 1], [3, 1], [1, 2], [1, 3]]), a = 1 + r(3), b = 1 + r(3); return { A, B, K: A * a * a + B * b * b }; }
  const [A, B] = R([[4, 9], [9, 4], [2, 3], [3, 2], [4, 3], [3, 4], [9, 2]]); return { A, B, K: A * B };
}
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])].filter(Boolean);
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); kids(q).forEach(walk); })(n); return out; };
const tint = (n, col) => { if (!n) return n; n.col = col; kids(n).forEach(q => tint(q, col)); return n; };
const bornAll = n => { if (!n) return n; n._born = -1; kids(n).forEach(bornAll); return n; };
const hideAll = n => { if (!n) return; n.alpha = 0; kids(n).forEach(hideAll); };
const dydx = (id, col) => tint(M.frac(M.txt('d'), M.row(M.txt('d'), M.vr('x')), id, { small: true }), col);
const mono = (c, v) => M.row(c === 1 ? null : M.num(c), M.vr(v));
// a tray tile is 74–86 px wide: shrink any answer that would not fit
function fitAsk(g) { const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; for (const ch of A.list) { const w = M.lay(ch.node, 34).w; ch.s = w > ch.w - 12 ? 34 * (ch.w - 12) / w : 34; M.lay(ch.node, ch.s); } }

// ---------------- the scene: a rooftop observatory at twilight ----------------
function scene(c, W, H) {
  P.sky(c, W, H, ['#120a30', '#2a1650', '#5a2468', '#a8446e', '#f08a6a', '#f8be82']);
  P.stars(c, W, 360, 110, 21, 0);
  // far rooftops, then near ones with lit windows
  const r = P.rng(31);
  c.fillStyle = '#3a1c4a'; for (let x = -10; x < W; ) { const w = 30 + r() * 30, h = 40 + r() * 40; c.fillRect(x, 560 - h, w, h + 80); c.beginPath(); c.moveTo(x - 4, 560 - h); c.lineTo(x + w / 2, 560 - h - 16 - r() * 10); c.lineTo(x + w + 4, 560 - h); c.fill(); x += w + 2; }
  c.fillStyle = '#1e0e2a'; for (let x = -20; x < W; ) { const w = 50 + r() * 40, h = 20 + r() * 30; c.fillRect(x, 600 - h, w, h + 60);
    c.fillStyle = 'rgba(255,214,140,0.75)'; for (let k = 0; k < 3; k++) if (r() < 0.6) c.fillRect(x + 8 + k * 14, 610 - h, 7, 9); c.fillStyle = '#1e0e2a'; x += w + 4; }
  // the observatory dome on the left, its slit open, a telescope poking out
  c.fillStyle = '#2a1636'; c.fillRect(14, 560, 92, 80); c.beginPath(); c.arc(60, 562, 48, Math.PI, 0); c.fill();
  c.fillStyle = '#4a2a50'; c.beginPath(); c.arc(60, 562, 44, Math.PI, 0); c.fill();
  c.fillStyle = '#1a0c22'; c.beginPath(); c.moveTo(52, 520); c.lineTo(68, 520); c.lineTo(66, 562); c.lineTo(54, 562); c.fill();
  c.save(); c.translate(62, 530); c.rotate(-0.7); c.fillStyle = '#c89048'; c.fillRect(-6, -40, 12, 44); c.fillStyle = '#e8b868'; c.fillRect(-7, -44, 14, 8); c.restore();
  c.strokeStyle = 'rgba(255,220,180,0.25)'; c.lineWidth = 2; c.beginPath(); c.arc(60, 562, 44, Math.PI * 1.1, Math.PI * 1.4); c.stroke();
  P.vignette(c, W, H, 0.35, '#0a0418');
}

MG.add({
  id: 'implicit', stage: 'derivs', cmd: 'IMPLICIT DIFF!', hint: 'drag', time: 9, mood: 'night', winText: 'Implicitly!', hold: 1.7,
  card: {
    title: 'Implicit differentiation', ref: 'Grade 12 and up', kind: 'Calculus',
    text: 'The equation x² + y² = 25 draws a circle. It does not say "y = ...", but y still depends on x: as you move along the circle, y changes when x changes. The derivative dy/dx is the slope of the circle at a point.\n\nTo find it, take d/dx of every term. The x² gives 2x as usual. The y² gives 2y too, but y is itself a function of x, so the chain rule adds a factor dy/dx: 2y · dy/dx. The number 25 never changes, so it gives 0.\n\nThat leaves 2x + 2y · dy/dx = 0. Get dy/dx alone: dy/dx = −2x / 2y = −x/y.\n\nCheck at the point (3, 4): the slope is −3/4, and that line touches the circle there.',
    note: 'Take d/dx of every term. Each time you differentiate something with y in it, multiply by dy/dx. Then solve for dy/dx.',
    ask: 'For x² + y² = 100, what is dy/dx? What is the slope at the point (6, 8)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { A, B, K } = S, T = M.pace(g), d = gcd(2 * A, 2 * B);
    // the two squared terms and the constant, each a row whose items are re-synced as the work goes on
    const term = (v, cf, p) => { const Q = { v, p, cf: cf === 1 ? null : M.num(cf, p + 'c'), base: M.vr(v, p + 'v'), ex: M.num(2, p + 'e'), dd: null, tag: null };
      Q.pw = M.sup(Q.base, Q.ex, p + 'w'); Q.row = M.row(); Q.row.id = p; Q.sync = () => { Q.row.items = [Q.dd, Q.cf, Q.pw, Q.tag].filter(Boolean); }; Q.sync(); return Q; };
    S.X = term('x', A, 'tx'); S.Y = term('y', B, 'ty'); S.k = M.num(K, 'k'); S.kRow = M.row(S.k); S.kRow.id = 'kr';
    S.plus = M.op('+', 'pl'); S.eq = M.op('=', 'eq');
    S.line = M.row(S.X.row, S.plus, S.Y.row, S.eq, S.kRow);
    // one size for every form of the line: the widest is "d/dx 2Ax + d/dx By² = K" or the fraction at the end
    const wide = M.row(M.ddx(), M.num(2 * A), M.vr('x'), M.op('+'), M.ddx(), M.num(B), M.sup(M.vr('y'), M.num(2)), M.op('='), M.num(K));
    S.size = Math.min(44, 44 * 318 / M.lay(wide, 44).w);
    S.tok = M.ddx('x', 'tok');
    const relay = () => { M.place(g, 'line', S.line, 180, LINEY, S.size, { col: INK }); if (S.tok) M.place(g, 'tok', S.tok, 180, TOKY, 44, { col: '#4a2410' }); }; S.relay = relay; relay();
    M.inert(g, ['eq', 'pl']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    S.react = react;
    const sz = () => S.size;

    // the d/dx flies down from the medallion and sits in front of the target, the line making room
    function landDD(g, Q) {
      Q.dd = M.ddx('x', Q.row.id + 'd', { alpha: 0 }); tint(Q.dd, GOLD); Q.dd.alpha = 0; Q.sync(); relay(); g.sfx('swoosh');
      M.circle(g, Q.row.id, { col: GOLD, dur: 0.4 * T, delay: 0.3 * T });
      M.fly(g, { node: tint(M.ddx(), GOLD), from: 'tok', to: Q.dd.id, dur: 0.4 * T, arc: -50, s0: 44, s1: sz(), col: GOLD,
        then(g) { Q.dd.alpha = 1; Q.dd.pop = g.t; M.sparkle(g, Q.dd.id, { n: 6, cols: [GOLD, '#fff'] }); g.sfx('pop'); react(g, 'think'); } });
    }
    // the power rule on a squared term: the 2 hops down in front (onto any coefficient), the power rolls 2 → 1 and melts
    function powerRule(g, Q) {
      const cf2 = 2 * (Q.v === 'x' ? A : B), from = { ...M.box(g, Q.ex.id) };
      M.circle(g, Q.ex, { dur: 0.35 * T, pad: 4 }); M.light(g, Q.ex);
      if (!Q.cf) { Q.cf = M.num(2, Q.row.id + 'c', { alpha: 0 }); Q.sync(); relay(); }
      const fresh = Q.cf.alpha === 0;
      M.fly(g, { node: M.num(2, null, { col: GOLD }), from: [from.x, from.y], to: Q.cf.id, delay: 0.1 * T, dur: 0.38 * T, arc: -46, s0: from.s, s1: sz(), col: GOLD,
        then(g) { if (fresh) { Q.cf.alpha = 1; Q.cf.pop = g.t; } else { M.roll(g, Q.cf, cf2, { dur: 0.3 * T }); M.indicate(g, Q.cf, { dur: 0.35 * T, col: GOLD }); }
          M.sparkle(g, Q.cf.id, { n: 8 }); g.sfx('ding'); react(g, 'happy'); } });
      if (!fresh) M.note(g, { node: M.row(M.num(2), M.op('×'), M.num(cf2 / 2)), at: Q.cf.id, off: [0, -sz() * 1.15], s: Math.round(sz() * 0.6), col: GOLD, delay: 0.1 * T, write: 0.25 * T, hold: 0.35 * T, fade: 0.2 * T });
      M.roll(g, Q.ex, 1, { delay: 0.5 * T, dur: 0.28 * T });
      M.tween(g, Q.ex, { alpha: 0, sc: 0.4 }, 0.15 * T, { delay: 0.8 * T });
      M.at(g, [[0.95 * T, g => { hideAll(Q.ex); Q.pw.exp = null; Q.row.items = Q.row.items.map(q => q === Q.pw ? Q.base : q); Q.pw = Q.base; Q.sync(); relay(); }]]);
    }
    const termAsk = Q => { const c = Q.v === 'x' ? A : B, r = M.row(M.num(2 * c), M.vr(Q.v)); if (Q.v === 'x') return { v: r, wrong: [mono(c, 'x'), M.row(M.num(2 * c), M.sup(M.vr('x'), M.num(2))), M.row(M.num(2 * c), M.vr('x'), dydx(null))] };
      return { v: M.row(M.num(2 * c), M.vr('y'), dydx(null)), wrong: [M.row(M.num(2 * c), M.vr('y')), M.row(M.num(2 * c), M.vr('x'), dydx(null)), M.row(mono(c, 'y'), dydx(null))] }; };
    const diff = Q => ({ drag: 'tok', to: idsIn(Q.row), busy: 0.1, askAt: 0.55 * T, after: (Q.v === 'x' ? 1.2 : 1.55) * T, ask: termAsk(Q),
      then(g) { Q.done = true; M.show(g, 0.55 * T); S.point = true; landDD(g, Q); },
      resolve(g) { M.show(g, (Q.v === 'x' ? 1.2 : 1.55) * T); powerRule(g, Q);
        if (Q.v === 'x') { // x is the variable itself: the d/dx has done its job and puffs away
          M.tween(g, Q.dd, { alpha: 0, sc: 0.5, dy: -10 }, 0.25 * T, { delay: 0.8 * T });
          M.at(g, [[1.08 * T, g => { hideAll(Q.dd); Q.dd = null; Q.sync(); relay(); S.point = false; }]]); return; }
        // y depends on x: the d/dx stays, a y flies up into it, and the pink dy/dx tag slides behind the term
        M.at(g, [
          [0.72 * T, g => { const b = M.box(g, Q.base.id); M.light(g, Q.base, { col: PINK }); react(g, 'wow');
            M.fly(g, { node: M.vr('y', null, { col: PINK }), from: [b.x, b.y], to: Q.dd.id, dur: 0.32 * T, arc: -40, s0: sz(), s1: sz() * 0.62, col: PINK }); }],
          [1.04 * T, g => { const y = M.vr('y', null, { col: PINK, _born: -1 }); Q.dd.n = M.row(M.txt('d', null, { col: PINK }), y); Q.dd.d = M.row(M.txt('d', null, { col: PINK }), M.vr('x', null, { col: PINK })); Q.dd.col = PINK; Q.dd.pop = g.t;
            M.unlight(g, Q.base); relay(); M.sparkle(g, Q.dd.id, { n: 10, cols: [PINK, '#fff'] }); g.sfx('magic'); }],
          [1.26 * T, g => { Q.tag = Q.dd; Q.tag.id = 'tag'; Q.dd = null; Q.sync(); relay(); g.sfx('swoosh'); react(g, 'laugh'); }],
          [1.5 * T, g => { S.point = false; }],
        ]); } });
    const konst = { drag: 'tok', to: idsIn(S.kRow), busy: 0.1,
      then(g) { S.kDone = true; M.show(g, 1.15 * T); S.point = true; S.K0 = { dd: null, row: S.kRow, sync() { S.kRow.items = [this.dd, S.k].filter(Boolean); } }; landDD(g, S.K0);
        M.at(g, [[0.5 * T, g => { M.circle(g, S.k, { dur: 0.35 * T, col: '#bfe8ff' }); M.roll(g, S.k, 0, { delay: 0.12 * T, dur: 0.35 * T }); }],
          [0.85 * T, g => { M.tween(g, S.K0.dd, { alpha: 0, sc: 0.5, dy: -10 }, 0.2 * T); M.sparkle(g, 'k', { cols: ['#bfe8ff', '#fff'] }); g.sfx('shrink'); react(g, 'happy'); }],
          [1.08 * T, g => { hideAll(S.K0.dd); S.K0.dd = null; S.K0.sync(); relay(); S.point = false; }]]); } };
    const fin = () => M.row(M.op('−'), M.frac(mono(A * 2 / d, 'x'), mono(B * 2 / d, 'y')));
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.X.done) out.push(diff(S.X));
        if (!S.Y.done) out.push(diff(S.Y));
        if (!S.kDone) out.push(konst);
        if (out.length || S.solved) return out;
        // get dy/dx alone: the x term crosses the = (its + turns to −), then 2y drops under it
        return [{ tap: 'tag', busy: 0.1, askAt: 1.5 * T, after: 1.15 * T, ask: { v: fin(), wrong: [M.frac(mono(A, 'x'), mono(B, 'y')), M.row(M.op('−'), M.frac(mono(B, 'y'), mono(A, 'x'))), M.row(M.op('−'), M.num(2 * A), M.vr('x'))] },
          then(g) { S.solved = true; M.show(g, 1.5 * T); S.point = true; react(g, 'think'); const X = S.X, Y = S.Y;
            M.circle(g, 'tag', { col: PINK, dur: 0.5 * T }); M.light(g, Y.tag, { col: PINK });
            M.tween(g, S.tok, { alpha: 0 }, 0.3 * T);
            M.at(g, [
              [0.25 * T, g => { M.tween(g, S.kRow, { alpha: 0, sc: 0.5 }, 0.2 * T); M.tween(g, S.k, { alpha: 0 }, 0.2 * T); M.circle(g, [S.plus.id, X.row.id], { dur: 0.3 * T }); }],
              [0.4 * T, g => { M.tween(g, X.row, { dy: -36 }, 0.12 * T); M.tween(g, S.plus, { dy: -36 }, 0.12 * T); }],
              [0.56 * T, g => { // the x term, lifted, hops over the = sign on an arc, and its + flips over to −
                const from = M.unionBox([M.box(g, 'pl'), M.box(g, 'tx')]); from.y -= 36; X.row.dy = 0; S.plus.dy = 0; hideAll(S.kRow); hideAll(X.row); S.plus.alpha = 0;
                S.line.items = [Y.row, S.eq, S.plus, X.row]; delete g.s.mk.ex.tok; S.tok = null; relay(); g.sfx('swoosh'); react(g, 'wow');
                const to = M.unionBox([M.box(g, 'pl'), M.box(g, 'tx')]);
                M.fly(g, { node: M.row(M.op('+'), M.num(2 * A), M.vr('x')), from: [from.x, from.y], to: [to.x, to.y], dur: 0.42 * T, arc: -40, s0: S.size, s1: S.size, col: INK,
                  then(g) { const un = n => { n.alpha = 1; kids(n).forEach(un); }; un(X.row); X.row.dy = 0; S.plus.dy = 0; S.plus.alpha = 1; S.plus.v = '−'; S.plus.pop = g.t; S.plus.hl = 1; S.plus.hlc = PINK; M.unlight(g, S.plus, { delay: 0.3 * T, dur: 0.3 * T }); M.sparkle(g, 'pl', { n: 8, cols: [PINK, '#fff'] }); g.sfx('pop'); } }); }],
              [0.95 * T, g => { M.circle(g, [Y.cf.id, Y.base.id], { col: '#9ad8ff', dur: 0.4 * T }); M.light(g, Y.cf, { col: '#9ad8ff' }); M.light(g, Y.base, { col: '#9ad8ff' });
                M.note(g, { node: M.row(M.op('÷'), M.num(2 * B), M.vr('y')), at: 'line', off: [0, S.size * 1.1], s: Math.round(S.size * 0.62), col: '#9ad8ff', write: 0.25 * T, hold: 0.3 * T, fade: 0.2 * T }); }],
              [1.25 * T, g => { // 2y drops under the other side: the fraction bar draws itself
                Y.row.items = [Y.tag]; S.den = M.row(Y.cf, Y.base); S.fr = M.frac(X.row, S.den, 'fr', { bar: { t0: g.t, dur: 0.3 * T } });
                S.line.items = [Y.tag, S.eq, S.plus, S.fr];
                // from here on the line is set larger: the answer is at least as big as the equation it came from
                S.size = Math.min(S.size * 1.5, S.size * 290 / M.lay(S.line, S.size).w); relay(); g.sfx('tap'); M.unlight(g, Y.cf); M.unlight(g, Y.base); }],
            ]); },
          resolve(g) { M.show(g, 1.15 * T); const X = S.X, Y = S.Y, a = 2 * A / d, b = 2 * B / d; react(g, 'think');
            // the common factor cancels: both numbers are crossed out and roll down (a 1 melts away)
            M.circle(g, [X.cf.id, Y.cf.id], { col: GOLD, dur: 0.4 * T });
            const fb = M.box(g, 'fr') || { w: 60 }; M.note(g, { node: M.row(M.op('÷'), M.num(d)), at: 'fr', off: [0, fb.h / 2 + 24], s: Math.round(S.size * 0.5), col: GOLD, write: 0.2 * T, hold: 0.35 * T, fade: 0.2 * T });
            M.strike(g, X.cf, { delay: 0.15 * T, dur: 0.18 * T, col: GOLD }); M.strike(g, Y.cf, { delay: 0.22 * T, dur: 0.18 * T, col: GOLD });
            M.at(g, [
              [0.45 * T, g => { g.sfx('ding'); react(g, 'happy'); // a number that divides down to 1 just shrinks away; any other rolls down
                for (const [q, v] of [[X.cf, a], [Y.cf, b]]) { if (v === 1) M.tween(g, q, { alpha: 0, sc: 0.4, dy: -8 }, 0.25 * T); else { q.strike = null; M.roll(g, q, v, { dur: 0.28 * T }); } } }],
              [0.82 * T, g => { if (a === 1) { hideAll(X.cf); X.cf = null; X.sync(); } if (b === 1) { S.den.items = [Y.base]; } relay();
                M.unlight(g, Y.tag); S.tanAt = g.t; g.sfx('chime'); react(g, 'laugh');
                const bx = M.box(g, 'fr'); if (bx) g.burst(bx.x, bx.y, [GOLD, PINK, '#fff'], 14, 140); }],
              [1.1 * T, g => { S.point = false; }],
            ]); } }];
      },
      area(g) { return !S.X.done || !S.Y.done || !S.kDone ? ['tok'] : ['tag']; },
    });
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('implicit_scene', scene), 0, 0, 360, 640);
    // a shooting star now and then
    { const k = (t * 0.22) % 1; if (k < 0.18) { const u = k / 0.18, x = 40 + u * 220, y = 60 + u * 70; c.save(); c.globalAlpha = Math.sin(u * Math.PI) * 0.8; c.strokeStyle = '#fff6e0'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 30, y - 10); c.stroke(); c.restore(); } }
    // the orrery: the curve A·x² + B·y² = K as a brass ring, a lamp at the origin, and a moon running round it
    const ax = Math.sqrt(S.K / S.A), ay = Math.sqrt(S.K / S.B), sc = Math.min(118 / ax, 58 / ay), rx = ax * sc, ry = ay * sc;
    c.save(); c.strokeStyle = 'rgba(255,230,200,0.18)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ORX - 150, ORY); c.lineTo(ORX + 150, ORY); c.moveTo(ORX, ORY - 76); c.lineTo(ORX, ORY + 76); c.stroke();
    c.strokeStyle = 'rgba(40,16,30,0.5)'; c.lineWidth = 7; c.beginPath(); c.ellipse(ORX, ORY + 3, rx, ry, 0, 0, 7); c.stroke();
    c.strokeStyle = BRASS; c.lineWidth = 5; c.beginPath(); c.ellipse(ORX, ORY, rx, ry, 0, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(255,240,200,0.6)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(ORX, ORY - 1.5, rx, ry, 0, Math.PI * 1.1, Math.PI * 1.7); c.stroke();
    const lg = c.createRadialGradient(ORX, ORY, 0, ORX, ORY, 22); lg.addColorStop(0, 'rgba(255,240,190,0.9)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = lg; c.beginPath(); c.arc(ORX, ORY, 22, 0, 7); c.fill();
    const th = t * 0.7 + 0.6, px = ORX + rx * Math.cos(th), py = ORY - ry * Math.sin(th);
    if (S.tanAt != null) { // the tangent line, slope dy/dx = −Ax/(By), rides along with the moon
      const k = M.ease((t - S.tanAt) / 0.5), dx = -rx * Math.sin(th), dy = -ry * Math.cos(th), L = Math.hypot(dx, dy) || 1, len = 64 * k;
      c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 10; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(px - dx / L * len, py - dy / L * len); c.lineTo(px + dx / L * len, py + dy / L * len); c.stroke(); c.shadowBlur = 0; }
    c.fillStyle = '#f4f0ff'; c.shadowColor = '#c8d8ff'; c.shadowBlur = 12; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.shadowBlur = 0;
    c.fillStyle = 'rgba(160,160,200,0.6)'; c.beginPath(); c.arc(px - 2, py - 1, 2, 0, 7); c.fill();
    c.restore();
    // the rabbit astronomer points at the work while it is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', 296, 606 - hopK * 22, 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'rabbit', 296, 606, 1.15);
    // the brass medallion that carries d/dx
    const tb = M.box(g, 'tok'), tn = S.tok; if (tb && tn && (tn.alpha ?? 1) > 0.01) { const a = tn.alpha ?? 1, bob = Math.sin(t * 2.4) * 2; c.save(); c.globalAlpha = a; c.translate(0, bob);
      c.fillStyle = 'rgba(20,8,20,0.35)'; c.beginPath(); c.arc(tb.x + 2, tb.y + 4, 30, 0, 7); c.fill();
      const mg = c.createRadialGradient(tb.x - 8, tb.y - 10, 4, tb.x, tb.y, 30); mg.addColorStop(0, '#fff0b8'); mg.addColorStop(0.5, '#f0c060'); mg.addColorStop(1, '#a8702a'); c.fillStyle = mg; c.beginPath(); c.arc(tb.x, tb.y, 30, 0, 7); c.fill();
      c.strokeStyle = '#7a4a1a'; c.lineWidth = 2.5; c.stroke(); c.strokeStyle = 'rgba(255,250,220,0.6)'; c.lineWidth = 1.5; c.beginPath(); c.arc(tb.x, tb.y, 25, Math.PI * 1.1, Math.PI * 1.7); c.stroke(); c.restore();
      c.save(); c.translate(0, bob); M.drawEx(g, c, 'tok'); c.restore(); }
    { const lb = M.box(g, 'line') || null, e = S.mk.ex.line; if (e) { const m = M.lay(e.node, e.s), w = m.w * (e.node.sc ?? 1) + 40, h = (m.a + m.d) * (e.node.sc ?? 1) + 26, cy = e.y - (m.a - m.d) / 2;
      c.save(); c.fillStyle = 'rgba(16,6,36,0.32)'; c.beginPath(); c.roundRect(180 - w / 2, cy - h / 2, w, h, 18); c.fill(); c.restore(); void lb; } }
    M.drawEx(g, c, 'line');
    fitAsk(g); M.drawUI(g, c);
  },
});
