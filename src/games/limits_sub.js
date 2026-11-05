// limits_sub.js — LIMIT! A limit of a polynomial is found by substitution: lim x→a f(x) = f(a).
// The player drags the a under "lim" onto each x of the function (any order): the x is circled and a copy of a flies out
// of "x → a" and lands in its place (3x becomes 3 · 2). When no x is left, a tap on the bracket works it out: each term
// gets a note right above it ("2² = 4", "3 · 2 = 6") and collapses into its value, the sum collapses into the limit,
// and the line becomes the true statement lim x→a f(x) = L.
// A small graph under the problem shows a point sliding along the curve toward x = a from both sides; once solved it
// rests on (a, L) with guide lines to both axes.
// Level 0: x² + b. Level 1: x² + kx (two x's). Level 2: x² − kx + b with a negative a or a bigger a.
// Medium mode: the tray opens when the bracket reads a plain sum ("4 + 6") (wrong tiles: 2a for a², a sign slip, off by one).
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), SUB = '#2a7ab0';
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { a: 2 + r(2), T: [{ c: 1, p: 2 }, { c: 1 + r(6), p: 0 }] };
  if (L === 1) return { a: 2 + r(3), T: [{ c: 1, p: 2 }, { c: 1 + r(5), p: 1 }] };
  return { a: [-2, -1, 3, 4][r(4)], T: [{ c: 1, p: 2 }, { c: -(1 + r(4)), p: 1 }, { c: 1 + r(6), p: 0 }] };
}
const f = (T, x) => T.reduce((s, t) => s + t.c * Math.pow(x, t.p), 0);
// a symbol the fonts lack (→ or ∞), drawn in the box of a gap node
function glyph(c, kind, b, col) {
  if (!b) return; const s = b.s, y = b.y - s * 0.3; c.save(); c.strokeStyle = col; c.lineWidth = Math.max(2, s * 0.08); c.lineCap = c.lineJoin = 'round'; c.beginPath();
  if (kind === 'arr') { const x0 = b.x - b.w / 2 + s * 0.1, x1 = b.x + b.w / 2 - s * 0.1; c.moveTo(x0, y); c.lineTo(x1, y); c.moveTo(x1 - s * 0.2, y - s * 0.17); c.lineTo(x1, y); c.lineTo(x1 - s * 0.2, y + s * 0.17); }
  c.stroke(); c.restore();
}
// the function's terms as separate nodes, so a can fly into each x and each term can collapse into its value
function makeTerms(S) {
  return S.T.map((t, i) => { const C = Math.abs(t.c), Q = { t, i, v: t.c * Math.pow(S.a, t.p) };
    Q.sg = i === 0 ? (t.c < 0 ? M.op('-') : null) : M.op(t.c < 0 ? '-' : '+');
    if (t.p === 0) { Q.co = M.num(C); Q.sync = () => { Q.row.items = [Q.sg, Q.co].filter(Boolean); }; }
    else { Q.co = C !== 1 ? M.num(C) : null; Q.xv = M.vr('x', 'x' + i); Q.pw = t.p === 2 ? M.sup(Q.xv, M.num(2)) : Q.xv;
      Q.sync = () => { Q.row.items = Q.val ? [Q.sg, Q.val].filter(Boolean) : [Q.sg, Q.co, Q.dot, Q.pw].filter(Boolean); }; }
    Q.row = M.row(); Q.row.id = 'r' + i; Q.sync(); return Q; });
}
const Anode = (a, o) => a < 0 ? M.paren(M.num(a, null, o)) : M.num(a, null, o);
// a plain copy of f(x), for the final statement and for measuring
const plainBody = S => M.row(...S.T.flatMap((t, i) => { const C = Math.abs(t.c), sg = i === 0 ? (t.c < 0 ? M.op('-') : null) : M.op(t.c < 0 ? '-' : '+');
  return t.p === 0 ? [sg, M.num(C)] : [sg, C !== 1 ? M.num(C) : null, t.p === 2 ? M.sup(M.vr('x'), M.num(2)) : M.vr('x')]; }));
// MK.drawEx glides every node that moved, and a child's glide adds to its parent's, so a symbol inside a moving row would
// start twice as far away. drawEx2 lets the kit work out the glides on a scratch canvas, removes each parent's share
// from its children's glides, then draws for real.
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); for (const ch of [q.base, q.exp, q.n, q.d, q.inner, ...(q.items || [])]) walk(ch); })(n); return out; };
const hideAll = n => { if (!n) return; n.alpha = 0; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) hideAll(ch); };
const NULLC = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; return cv.getContext('2d'); })();
function unnest(n, ax, ay, t0) {
  if (!n) return; let gx = ax, gy = ay;
  if (n._glide) { if (!n._glide.fixed && n._glide.t0 === t0) { n._glide.dx -= ax; n._glide.dy -= ay; } n._glide.fixed = true; gx = ax + n._glide.dx; gy = ay + n._glide.dy; }
  for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])]) unnest(ch, gx, gy, t0);
}
function drawEx2(g, c, key) { const e = g.s.mk.ex[key]; if (!e) return; M.drawEx(g, NULLC, key); unnest(e.node, 0, 0, g.t); M.drawEx(g, c, key); }
function build(g) {
  // the left edge stays put (set from the widest moment), so "lim" never slides while the bracket changes
  const S = g.s, s = S.size, cw = Math.max(M.lay(S.limN, s).w, M.lay(S.subN, s * 0.55).w), x0 = S.x0, y = 285;
  M.place(g, 'lim', S.limN, x0 + cw / 2, y, s, { col: INK }); M.place(g, 'sub', S.subN, x0 + cw / 2, y + s * 0.62, s * 0.55, { col: INK });
  M.place(g, 'main', S.main, x0 + cw + s * 0.25, y, s, { col: INK, left: true });
}

MG.add({
  id: 'limits_sub', stage: 'limits', cmd: 'LIMIT!', hint: 'drag', time: 8, mood: 'bright', winText: 'Limit found!', hold: 1.4,
  card: {
    title: 'Limits by substitution', ref: 'Calculus', kind: 'Limits',
    text: 'A limit asks what value a function gets close to as x gets close to some number. We write lim x→3 (x² + 1) and read it as "the limit of x² + 1 as x approaches 3".\n\nFor a polynomial, the answer is simple. A polynomial is built from powers of x, such as x² + 1. Its graph is one smooth, unbroken curve, so as x gets close to 3, the value gets close to the value at 3. So you can put 3 in place of every x and compute.\n\nFor example, lim x→3 (x² + 1) = 3² + 1 = 9 + 1 = 10.\n\nIf you try x = 2.9, 2.99 and 2.999, you get 9.41, 9.9401 and 9.994001. They get closer and closer to 10.',
    note: 'For a polynomial, the limit as x approaches a is the value at a: put a in place of every x and compute.',
    ask: 'What is lim x→2 (x² + 5)? What is lim x→−1 (x² − 3x)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g), a = S.a;
    S.L = f(S.T, a); S.Q = makeTerms(S); S.sub = S.Q.map(q => !q.xv);
    S.limN = M.txt('lim', 'lim'); S.aN = M.num(a, 'a', { col: SUB }); S.subN = M.row(M.vr('x'), { k: 'gap', w: 22, id: 'arr' }, S.aN);
    S.inner = M.row(...S.Q.map(q => q.row)); S.body = M.paren(S.inner, 'body'); S.main = M.row(S.body);
    // one size for the whole game: the widest moments are every x replaced by a, and the final statement
    const wide = M.row(...S.T.flatMap((t, i) => [M.op('+'), M.num(9), M.op('·'), t.p ? Anode(a) : null, t.p === 2 ? M.num(2) : null]), M.op('='), M.num(S.L));
    const measure = sz => Math.max(M.lay(M.row(M.paren(wide)), sz).w, M.lay(M.row(M.paren(plainBody(S)), M.op('='), M.num(S.L)), sz).w) + Math.max(M.lay(S.limN, sz).w, M.lay(S.subN, sz * 0.55).w) + sz * 0.25;
    S.size = Math.min(46, 46 * 316 / measure(46)); S.x0 = 180 - measure(S.size) / 2; build(g); M.inert(g, ['arr', 'res', 'eqv']);
    const nx = S.T.filter(t => t.p).length; g.dur *= (2.6 + 1.05 * (nx + 1)) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const sq = S.T.map(t => t.p === 2 ? { ...t, p: 1, c: 2 * t.c } : t), abs = S.T.map(t => ({ ...t }));
    const wrong = [f(sq, a), f(abs, Math.abs(a)), S.L + 1, S.L - 1, -S.L];
    // the terms that need working out (a constant is already a number), and when the tray opens
    const work = S.Q.filter(q => q.t.p && !(q.t.p === 1 && q.t.c === 1 && a > 0)), askAt = (0.2 + 0.72 * work.length + 0.05) * T, tail = 1.25 * T;
    M.play(g, {
      moves(g) {
        const out = [];
        S.Q.forEach((q, i) => { if (!S.sub[i]) out.push({ drag: 'a', to: 'x' + i, busy: 0.1,
          then(g) { S.sub[i] = true; M.show(g, 0.85 * T); react(g, 'think'); S.point = true; g.sfx('whoosh');
            // the x is circled, a copy of a flies out of "x → a" and lands in its place
            M.circle(g, 'x' + i, { col: SUB, dur: 0.45 * T }); M.indicate(g, S.aN, { dur: 0.35 * T, col: '#fff' }); M.tween(g, q.xv, { alpha: 0.25 }, 0.3 * T);
            M.fly(g, { node: M.num(a, null, { col: SUB }), from: 'a', to: 'x' + i, delay: 0.12 * T, dur: 0.42 * T, arc: -60, s1: S.size, col: SUB });
            M.at(g, [[0.56 * T, g => { q.av = Anode(a, { col: SUB }); q.av.id = 'av' + i; q.av._born = -1; q.av.pop = g.t; if (q.av.inner) q.av.inner._born = -1;
              if (q.t.p === 2) q.pw.base = q.av; else q.pw = q.av; q.xv.alpha = 0;
              if (q.co) q.dot = M.op('·', null, { col: SUB }); q.sync(); build(g); M.sparkle(g, 'av' + i, { n: 8, cols: [SUB, '#fff'] }); g.sfx('pop'); react(g); }],
              [0.85 * T, g => { if (S.sub.every(Boolean)) S.point = false; }]]); } }); });
        if (S.sub.every(Boolean) && !S.tapped) out.push({ tap: ['body', ...idsIn(S.body)], busy: 0.1, ask: { v: S.L, wrong }, askAt, after: tail,
          then(g) { S.tapped = true; M.show(g, askAt); react(g, 'think'); S.point = true; M.circle(g, 'body', { col: '#fff', dur: 0.4 * T });
            // each term is worked out in a note right above it, then collapses into its value
            M.at(g, work.flatMap((q, k) => { const t0 = (0.2 + 0.72 * k) * T, A = Anode(a), calc = q.t.p === 2 ? M.sup(A, M.num(2)) : M.row(M.num(q.t.c), M.op('·'), A);
              return [[t0, g => { M.light(g, q.row, { col: '#e07a1a', dur: 0.15 * T }); M.note(g, { node: M.row(calc, M.op('='), M.num(q.v)), at: 'r' + q.i, off: [0, -S.size * 1.15], s: Math.round(S.size * 0.72), col: '#c8501a', write: 0.25 * T, hold: 0.3 * T, fade: 0.14 * T }); g.sfx('tap'); }],
                [t0 + 0.5 * T, g => { q.row.hl = 0; const k0 = q.i === 0; q.val = M.num(k0 ? q.v : Math.abs(q.v), null, { _born: g.t, pop: g.t }); if (q.sg) q.sg.v = q.v < 0 ? '−' : '+'; q.dot = null; q.sync(); build(g); react(g); g.sfx('pop'); }]]; })); },
          resolve(g) { M.show(g, tail); S.point = false;
            M.at(g, [[0, g => { M.indicate(g, S.inner, { dur: 0.35 * T, sc: 1.1, col: '#e07a1a' }); }],
              [0.3 * T, g => { const b = M.box(g, 'body'); for (const q of S.Q) { const r = M.box(g, 'r' + q.i); if (r && b) M.tween(g, q.row, { alpha: 0, sc: 0.5, dx: (b.x - r.x) * 0.6 }, 0.16 * T); } }],
              [0.46 * T, g => { // the sum collapses into the limit
                S.Q.forEach(q => hideAll(q.row)); S.res = M.num(S.L, 'res', { col: M.GOOD, pop: g.t }); S.inner.items = [S.res]; build(g); g.sfx('coin'); react(g, 'wow'); M.sparkle(g, 'res', { n: 12, cols: ['#ffd45a', '#9ae07a', '#fff'] }); }],
              [0.86 * T, g => { // and the line becomes the true statement lim f(x) = L, while the point on the graph lands on (a, L)
                S.inner = Object.assign(plainBody(S), { _born: g.t }); S.body.inner = S.inner; S.main.items = [S.body, M.op('=', 'eqv'), S.res]; build(g); S.val = S.L; S.winT = g.t; g.sfx('chime'); react(g, 'laugh'); }]]); } });
        return out;
      },
      area(g) { const i = S.sub.indexOf(false); return i >= 0 ? ['a', 'x' + i] : ['body']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'meadow', panel: PANEL, panelY: 290, panelH: 170 });
    // the frog points at the problem while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', 318, 606 - hopK * 22, 1.1, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'frog', 318, 606, 1.1);
    M.drawEx(g, c, 'lim'); M.drawEx(g, c, 'sub'); drawEx2(g, c, 'main'); glyph(c, 'arr', M.box(g, 'arr'), INK);
    // the graph: the curve near x = a, and a point sliding toward x = a from either side
    const gx = 165, gy = 468, gw = 220, gh = 104; SCN.panel(c, 'glass', gx, gy, gw + 20, gh + 20, t);
    const xs = [S.a - 2.4, S.a + 2.4], vals = []; for (let k = 0; k <= 40; k++) vals.push(f(S.T, M.lerp(xs[0], xs[1], k / 40)));
    const y0 = Math.min(...vals, 0), y1 = Math.max(...vals), X = x => gx - gw / 2 + (x - xs[0]) / (xs[1] - xs[0]) * gw, Y = v => gy + gh / 2 - 20 - (v - y0) / (y1 - y0 || 1) * (gh - 26);
    c.save(); c.strokeStyle = 'rgba(42,24,64,0.35)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(gx - gw / 2, Y(0)); c.lineTo(gx + gw / 2, Y(0)); c.stroke();
    c.strokeStyle = '#3a8a4a'; c.lineWidth = 3; c.beginPath(); vals.forEach((v, k) => { const x = gx - gw / 2 + gw * k / 40; k ? c.lineTo(x, Y(v)) : c.moveTo(x, Y(v)); }); c.stroke();
    const solved = S.val != null, ax = X(S.a), ay = Y(S.L);
    c.setLineDash([4, 5]); c.strokeStyle = solved ? M.GOOD : SUB; c.lineWidth = 2; c.beginPath(); c.moveTo(ax, Y(0)); c.lineTo(ax, ay); if (solved) { c.moveTo(gx - gw / 2, ay); c.lineTo(ax, ay); } c.stroke(); c.setLineDash([]);
    const u = (t * 0.55) % 1, side = Math.floor(t * 0.55) % 2 ? 1 : -1, px = solved ? S.a : S.a + side * 2.2 * Math.pow(1 - u, 2);
    c.fillStyle = solved ? M.GOOD : '#ff8a3a'; c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.arc(X(px), Y(f(S.T, px)), solved ? 7 : 6, 0, 7); c.fill(); c.stroke();
    c.font = M.NUMF(15); c.fillStyle = SUB; c.textAlign = 'center'; c.fillText(String(S.a).replace('-', '−'), ax, Y(0) + 16);
    if (solved) { c.fillStyle = M.GOOD; c.textAlign = 'left'; c.fillText(String(S.L).replace('-', '−'), gx - gw / 2 + 4, ay - 6); }
    c.restore();
    M.drawUI(g, c);
  },
});
