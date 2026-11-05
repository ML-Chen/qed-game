// integrals_ftc.js — FTC! Evaluate a definite integral with the Fundamental Theorem of Calculus.
// A chalkboard in a spring meadow shows ∫ₐᵇ p·x^(p−1) dx = [x^p]ₐᵇ = □ − □, and under the board the area under the
// graph is shaded between a and b. The player drags the bracket's top limit b into x^p (the first box fills with b^p)
// and the bottom limit a into x^p (the second box fills with a^p), in either order, then taps the subtraction.
// Level 0: 2x. Level 1: 2x or 3x². Level 2: 3x² or 4x³. Medium mode: each power and the subtraction open a tray.
const M = MK;
function pick(g) {
  const R = a => a[Math.floor(g.rand() * a.length)], L = g.level;
  const p = L === 0 ? 2 : L === 1 ? R([2, 3]) : R([3, 4]);
  const ab = p === 2 ? R([[1, 3], [0, 2], [1, 2], [2, 3], [0, 3], [1, 4]]) : p === 3 ? R([[0, 2], [1, 2], [1, 3], [0, 3]]) : R([[0, 2], [1, 2]]);
  return { p, a: ab[0], b: ab[1] };
}
// the fonts have no ∫, so it is drawn by hand: a tall thin S from yT to yB centred on x
function intSign(c, x, yT, yB, col) {
  const h = yB - yT, w = h * 0.3; c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(2, h * 0.075); c.beginPath();
  c.moveTo(x + w * 0.62, yT + h * 0.08); c.bezierCurveTo(x + w * 0.45, yT - h * 0.03, x + w * 0.08, yT - h * 0.02, x + w * 0.04, yT + h * 0.2);
  c.lineTo(x - w * 0.04, yB - h * 0.2); c.bezierCurveTo(x - w * 0.08, yB + h * 0.02, x - w * 0.45, yB + h * 0.03, x - w * 0.62, yB - h * 0.08); c.stroke(); c.restore();
}
const gapId = (w, id) => ({ k: 'gap', w, id }); // MK.gap takes no id
const xp = n => n === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(n));
const Y1 = 252, Y2 = 342, S1 = 42, S2 = 40;
// the area under y = f(x), shaded between a and b, on a sheet of graph paper pinned below the board
function drawGraph(g, c, S) {
  const x0 = 46, x1 = 262, yb = 540, yt = 420, xm = S.b + 0.6, f = x => S.p * Math.pow(x, S.p - 1), fm = f(xm);
  const X = x => x0 + (x1 - x0) * x / xm, Y = v => yb - (yb - yt) * v / fm, t = g.t;
  c.save(); c.fillStyle = 'rgba(40,60,30,0.25)'; c.beginPath(); c.roundRect(26, 408, 256, 156, 12); c.fill();
  c.fillStyle = 'rgba(255,252,238,0.92)'; c.beginPath(); c.roundRect(22, 402, 256, 156, 12); c.fill();
  c.strokeStyle = 'rgba(80,140,200,0.18)'; c.lineWidth = 1; for (let x = 30; x < 276; x += 14) { c.beginPath(); c.moveTo(x, 406); c.lineTo(x, 554); c.stroke(); } for (let y = 410; y < 556; y += 14) { c.beginPath(); c.moveTo(26, y); c.lineTo(274, y); c.stroke(); }
  const k = S.resAt != null ? M.ease((t - S.resAt) / 0.35) : 0;
  c.beginPath(); c.moveTo(X(S.a), yb); for (let i = 0; i <= 40; i++) { const x = S.a + (S.b - S.a) * i / 40; c.lineTo(X(x), Y(f(x))); } c.lineTo(X(S.b), yb); c.closePath();
  c.fillStyle = `rgba(255,${180 + 30 * Math.sin(t * 3) * (1 - k)},60,${0.45 + 0.4 * k})`; c.fill();
  // the edges at a and b light up when that limit has been put in
  for (const [v, at] of [[S.b, S.edgeB], [S.a, S.edgeA]]) if (at != null) { const pk = Math.max(0, 1 - (t - at) / 0.6); c.strokeStyle = `rgba(230,110,40,${0.7 + 0.3 * pk})`; c.lineWidth = 3 + pk * 4; c.beginPath(); c.moveTo(X(v), yb); c.lineTo(X(v), Y(f(v))); c.stroke(); }
  c.strokeStyle = '#3a3050'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, yt - 8); c.lineTo(x0, yb); c.lineTo(x1 + 6, yb); c.stroke();
  c.strokeStyle = '#2a7ab0'; c.lineWidth = 3.5; c.beginPath(); for (let i = 0; i <= 60; i++) { const x = xm * i / 60, y = Y(f(x)); if (y < yt - 8) break; i ? c.lineTo(X(x), y) : c.moveTo(X(x), y); } c.stroke();
  c.fillStyle = '#3a3050'; c.font = M.NUMF(15); c.textAlign = 'center';
  for (const v of new Set([0, S.a, S.b])) c.fillText(String(v), X(v), yb + 15);
  c.font = M.VARF(15); c.fillStyle = '#2a7ab0'; c.textAlign = 'right'; c.fillText(`y = ${S.p}x` + (S.p > 2 ? ['', '', '²', '³'][S.p - 1] : ''), x1 + 8, yt + 4);
  if (k > 0) { c.globalAlpha = k; c.fillStyle = '#5a2a10'; c.font = M.NUMF(18 + 8 * k); c.textAlign = 'center'; c.fillText(String(S.Fb - S.Fa), X((S.a + S.b) / 2) + (S.p > 2 ? 10 : 6), yb - 10); }
  c.restore();
}

MG.add({
  id: 'integrals_ftc', stage: 'integrals', cmd: 'FTC!', hint: 'drag', time: 9, mood: 'bright', winText: 'Integrated!', hold: 1.4,
  card: {
    title: 'The Fundamental Theorem of Calculus', ref: 'Grade 12 and up', kind: 'Calculus',
    text: 'An integral adds up the area under a graph. ∫₁³ 2x dx means the area under the line y = 2x, from x = 1 to x = 3.\n\nAn antiderivative of 2x is a function whose derivative is 2x. One is x², because the derivative of x² is 2x.\n\nThe Fundamental Theorem of Calculus says that the integral from a to b equals F(b) − F(a), where F is an antiderivative. The brackets [x²]₁³ are short for 3² − 1².\n\nFor example, ∫₁³ 2x dx = 3² − 1² = 9 − 1 = 8. The shaded shape is a trapezoid 2 wide with sides 2 and 6 tall, and its area is 8 too.\n\nWhy it works: the derivative of F is how fast F grows. Adding up that growth over every tiny step from a to b gives the total growth of F, which is F(b) − F(a).',
    note: 'Find an antiderivative F. Put in the top limit, put in the bottom limit, and subtract: F(b) − F(a).',
    ask: 'What is ∫₀² 2x dx? What is ∫₁² 3x² dx?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    const { p, a, b } = S, col = SCN.ink('chalk'); S.Fa = Math.pow(a, p); S.Fb = Math.pow(b, p);
    const ig = M.row(M.num(p), xp(p - 1)); ig.id = 'ig'; const dx = M.row(M.txt('d'), M.vr('x')); dx.id = 'dx';
    S.prob = M.row(gapId(S1 * 0.9, 'int'), ig, M.gap(8), dx);
    M.place(g, 'prob', S.prob, 180, Y1, S1, { col });
    const ib = M.box(g, 'int'), il = ib.x - ib.w / 2;
    M.place(g, 'phi', M.num(b, 'pb'), il + S1 * 0.44, Y1 - S1 * 0.74, S1 * 0.5, { left: true, col });
    M.place(g, 'plo', M.num(a, 'pa'), il + S1 * 0.3, Y1 + S1 * 0.4, S1 * 0.5, { left: true, col });
    S.s1 = M.slot('s1', { col: '#c8e0d0' }); S.s2 = M.slot('s2', { col: '#c8e0d0' }); S.diff = M.row(S.s1, M.op('-'), S.s2); S.diff.id = 'diff';
    S.work = M.row(M.op('=', 'eq1'), M.paren(M.sup(M.vr('x'), M.num(p), 'Fx'), 'brk', { br: '[]' }), M.gap(S2 * 0.46), M.op('=', 'eq2'), S.diff);
    S.hiN = M.num(b, 'hi'); S.loN = M.num(a, 'lo');
    const relay = () => { M.place(g, 'work', S.work, 180, Y2, S2, { col }); const br = M.box(g, 'brk'), xr = br.x + br.w / 2 + 2;
      M.place(g, 'hi', S.hiN, xr, Y2 - S2 * 0.72, S2 * 0.52, { left: true, col }); M.place(g, 'lo', S.loN, xr, Y2 + S2 * 0.36, S2 * 0.52, { left: true, col }); };
    relay();
    M.inert(g, ['int', 'pa', 'pb', 'eq1', 'eq2', 'brk']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const sq = v => M.sup(M.num(v), M.num(p));
    M.play(g, {
      moves(g) {
        const out = []; if (S.done) return out;
        if (!S.f1) out.push({ drag: 'hi', to: ['Fx', 's1'], busy: 0.1, ask: { v: S.Fb, wrong: [b * p, b + p, b, S.Fb + 1] },
          then(g) { S.f1 = true; S.s1.fill = sq(b); S.hiN.alpha = 0.4; M.inert(g, ['hi']); S.edgeB = g.t; g.sfx('chime'); relay(); },
          resolve(g) { S.r1 = true; S.s1.fill = M.num(S.Fb, null, { pop: g.t }); relay(); } });
        if (!S.f2) out.push({ drag: 'lo', to: ['Fx', 's2'], busy: 0.1, ask: { v: S.Fa, wrong: [a * p, a + p, a + 1, 2] },
          then(g) { S.f2 = true; S.s2.fill = sq(a); S.loN.alpha = 0.4; M.inert(g, ['lo']); S.edgeA = g.t; g.sfx('chime'); relay(); },
          resolve(g) { S.r2 = true; S.s2.fill = M.num(S.Fa, null, { pop: g.t }); relay(); } });
        if (S.r1 && S.r2) out.push({ tap: ['diff', 's1', 's2'], busy: 0.1, ask: { v: S.Fb - S.Fa, wrong: [S.Fb + S.Fa, S.Fa - S.Fb, b - a, S.Fb - S.Fa - 1] },
          then(g) {}, resolve(g) { S.done = true; S.resAt = g.t; S.diff.items = [M.num(S.Fb - S.Fa, 'res', { pop: g.t })]; M.inert(g, ['res']); relay(); g.sfx('coin');
            const r = M.box(g, 'res'); if (r) g.burst(r.x, r.y, ['#ffd45a', '#fff', '#9ae07a'], 12, 140); } });
        return out;
      },
      area(g) { return !S.f1 ? ['hi', 'Fx'] : !S.f2 ? ['lo', 'Fx'] : ['diff']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, col = SCN.std(g, c, { scene: 'meadow', panel: 'chalk', panelY: 292, panelH: 196, host: 'beaver', hostX: 316, hostY: 604, hostS: 1.1 });
    drawGraph(g, c, S);
    const ib = M.box(g, 'int'); if (ib) intSign(c, ib.x - ib.w / 2 + ib.s * 0.2, Y1 - ib.s * 0.98, Y1 + ib.s * 0.3, col);
    for (const k of ['prob', 'phi', 'plo', 'work', 'hi', 'lo']) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
