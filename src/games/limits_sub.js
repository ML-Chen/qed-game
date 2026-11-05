// limits_sub.js — LIMIT! A limit of a polynomial is found by substitution: lim x→a f(x) = f(a).
// The player drags the a under "lim" onto each x of the function (any order); the x becomes a, in place. When no x is
// left, a tap on the bracket computes the value, and the line becomes the true statement lim x→a f(x) = L.
// A small graph under the problem shows a point sliding along the curve toward x = a from both sides; once solved it
// rests on (a, L) with guide lines to both axes.
// Level 0: x² + b. Level 1: x² + kx (two x's). Level 2: x² − kx + b with a negative a or a bigger a.
// Medium mode: the final tap opens the tray (wrong tiles: 2a for a², a sign slip, off by one).
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
// the function's terms; sub[i] = the x of term i has been replaced by a
function body(S, g, plain) {
  const A = () => S.a < 0 ? M.paren(M.num(S.a)) : M.num(S.a);
  return S.T.flatMap((t, i) => {
    const sg = i === 0 ? (t.c < 0 ? M.op('-') : null) : M.op(t.c < 0 ? '-' : '+'), C = Math.abs(t.c);
    if (t.p === 0) return [sg, M.num(C)];
    const done = !plain && S.sub[i], pop = { pop: S.pops[i] };
    const xs = done ? (t.p === 2 ? M.sup(Object.assign(A(), pop), M.num(2)) : Object.assign(A(), pop)) : (t.p === 2 ? M.sup(M.vr('x', plain ? null : 'x' + i), M.num(2)) : M.vr('x', plain ? null : 'x' + i));
    return [sg, C !== 1 ? M.num(C) : null, C !== 1 && done ? M.op('·') : null, xs];
  });
}
function build(g) {
  const S = g.s, fin = S.val != null;
  const lim = M.txt('lim', 'lim'), sub = M.row(M.vr('x'), { k: 'gap', w: 22, id: 'arr' }, M.num(S.a, 'a', { col: SUB, pop: S.popA }));
  const main = fin ? M.row(M.paren(M.row(...body(S, g, true))), M.op('='), M.num(S.val, 'res', { pop: S.popV, col: M.GOOD })) : M.paren(M.row(...body(S, g)), 'body');
  let s = 44; const w = () => Math.max(M.lay(lim, s).w, M.lay(sub, s * 0.55).w) + s * 0.25 + M.lay(main, s).w;
  if (w() > 320) s *= 320 / w();
  const cw = Math.max(M.lay(lim, s).w, M.lay(sub, s * 0.55).w), x0 = 180 - w() / 2, y = 285;
  M.place(g, 'lim', lim, x0 + cw / 2, y, s, { col: INK }); M.place(g, 'sub', sub, x0 + cw / 2, y + s * 0.62, s * 0.55, { col: INK });
  M.place(g, 'main', main, x0 + cw + s * 0.25, y, s, { col: INK, left: true });
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
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.sub = S.T.map(t => t.p === 0); S.pops = {}; S.val = null;
    S.L = f(S.T, S.a); build(g); M.inert(g, ['arr', 'res']);
    const nx = S.T.filter(t => t.p).length; g.dur *= (2.6 + 1.05 * (nx + 1)) / 8;
    const sq = S.T.map(t => t.p === 2 ? { ...t, p: 1, c: 2 * t.c } : t), abs = S.T.map(t => ({ ...t }));
    const wrong = [f(sq, S.a), f(abs, Math.abs(S.a)), S.L + 1, S.L - 1, -S.L];
    M.play(g, {
      moves(g) {
        const out = [];
        S.T.forEach((t, i) => { if (!S.sub[i]) out.push({ drag: 'a', to: 'x' + i, busy: 0.1, then(g) { S.sub[i] = true; S.pops[i] = g.t; S.popA = g.t; g.sfx('pop'); build(g); const b = M.box(g, 'body'); if (b) g.burst(b.x, b.y, ['#7ad0ff', '#fff'], 6, 90); } }); });
        if (S.sub.every(Boolean) && S.val == null && !S.tapped) out.push({ tap: 'body', busy: 0.1, ask: { v: S.L, wrong }, askAt: 0, after: 0.1,
          then() { S.tapped = true; }, resolve(g) { S.val = S.L; S.popV = g.t; S.winT = g.t; g.sfx('coin'); build(g); const b = M.box(g, 'res'); if (b) g.burst(b.x, b.y, ['#ffd45a', '#9ae07a', '#fff'], 14, 130); } });
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
    SCN.std(g, c, { scene: 'meadow', panel: PANEL, host: 'frog', hostX: 318, hostY: 606, hostS: 1.1, panelY: 290, panelH: 170 });
    M.drawEx(g, c, 'lim'); M.drawEx(g, c, 'sub'); M.drawEx(g, c, 'main'); glyph(c, 'arr', M.box(g, 'arr'), INK);
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
