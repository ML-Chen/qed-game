// limits_inf.js — LIMIT AT INF! The limit of a rational function as x → ∞ when the top and bottom have the same
// degree: only the leading terms matter, so lim (3x² + 1)/(x² + 5) = lim 3x²/x² = 3.
// Moves: tap the top (any of its terms) and the bottom, in either order: the smaller terms drift off into space and
// only the leading term stays. Then tap the fraction of leading terms: the powers cancel and the value appears.
// Under the problem, a comet flies along the graph to the right, settling toward the dashed line y = L.
// Level 0: (ax² + b)/(x² + d). Level 1: (ax² + bx)/(cx² + d), a a multiple of c. Level 2: cubes, and a/c may be a fraction.
// Medium mode: the last tap opens the tray (wrong tiles: the ratio of the constants, c/a, 0, 1).
const M = MK, INK = SCN.ink('none'), SUB = '#9ad8ff', GOLD = '#ffd45a';
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { n: 2, top: [[2 + r(4), 2], [1 + r(6), 0]], bot: [[1, 2], [1 + r(6), 0]] };
  if (L === 1) { const c = 2 + r(2), k = 2 + r(3); return { n: 2, top: [[c * k, 2], [1 + r(5), 1]], bot: [[c, 2], [1 + r(6), 0]] }; }
  for (;;) { const a = 2 + r(5), c = 2 + r(3); if (a !== c) return { n: 3, top: [[a, 3], [1 + r(5), 2]], bot: [[c, 3], [1 + r(4), 1], [1 + r(6), 0]] }; }
}
function glyph(c, kind, b, col) {
  if (!b) return; const s = b.s, y = b.y - s * 0.3; c.save(); c.strokeStyle = col; c.lineWidth = Math.max(2, s * 0.08); c.lineCap = c.lineJoin = 'round'; c.beginPath();
  if (kind === 'arr') { const x0 = b.x - b.w / 2 + s * 0.1, x1 = b.x + b.w / 2 - s * 0.1; c.moveTo(x0, y); c.lineTo(x1, y); c.moveTo(x1 - s * 0.2, y - s * 0.17); c.lineTo(x1, y); c.lineTo(x1 - s * 0.2, y + s * 0.17); }
  else { const a = b.w / 2 - s * 0.06; for (let i = 0; i <= 48; i++) { const u = i / 48 * Math.PI * 2, d = 1 + Math.sin(u) ** 2, x = b.x + a * Math.cos(u) / d, yy = y + a * 1.1 * Math.sin(u) * Math.cos(u) / d; i ? c.lineTo(x, yy) : c.moveTo(x, yy); } }
  c.stroke(); c.restore();
}
// a term c·x^p (the first term of a line has no sign)
function term([cf, p], first, id) {
  const it = [first ? null : M.op('+'), p && cf === 1 ? null : M.num(cf), p === 0 ? null : p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(p))];
  return Object.assign(M.row(...it), { id });
}
const line = (T, k, only) => M.row(...(only ? T.slice(0, 1) : T).map((q, i) => term(q, i === 0, k + i)));
const valNode = (a, c) => { const d = gcd(a, c); return c / d === 1 ? M.num(a / d) : M.frac(M.num(a / d), M.num(c / d)); };
function build(g) {
  const S = g.s;
  const lim = M.txt('lim', 'lim'), sub = M.row(M.vr('x'), { k: 'gap', w: 22, id: 'arr' }, { k: 'gap', w: 26, id: 'inf' });
  let main;
  if (S.val) main = M.row(M.frac(line(S.top, ''), line(S.bot, '')), M.op('='), Object.assign(valNode(S.top[0][0], S.bot[0][0]), { col: GOLD, pop: S.popV, id: 'res' }));
  else if (S.dt && S.db) main = Object.assign(M.frac(line(S.top, '', true), line(S.bot, '', true)), { id: 'fr', pop: S.popF });
  else main = M.frac(Object.assign(line(S.top, 't', S.dt), { id: 'top' }), Object.assign(line(S.bot, 'b', S.db), { id: 'bot' }));
  let s = 46; const w = () => Math.max(M.lay(lim, s).w, M.lay(sub, s * 0.55).w) + s * 0.25 + M.lay(main, s).w;
  if (w() > 300) s *= 300 / w();
  const cw = Math.max(M.lay(lim, s).w, M.lay(sub, s * 0.55).w), x0 = 180 - w() / 2, y = 292;
  M.place(g, 'lim', lim, x0 + cw / 2, y, s, { col: INK }); M.place(g, 'sub', sub, x0 + cw / 2, y + s * 0.62, s * 0.55, { col: INK });
  M.place(g, 'main', main, x0 + cw + s * 0.25, y, s, { col: INK, left: true });
}
const fx = (T, x) => T.reduce((s, [cf, p]) => s + cf * Math.pow(x, p), 0);

MG.add({
  id: 'limits_inf', stage: 'limits', cmd: 'LIMIT AT INF!', hint: 'tap', time: 8, mood: 'night', winText: 'To infinity!', hold: 1.4,
  card: {
    title: 'Limits at infinity', ref: 'Calculus', kind: 'Limits',
    text: 'The symbol ∞ means infinity. "x → ∞" means x grows bigger and bigger, without any end.\n\nIn a sum like 3x² + 1, the term with the highest power of x is called the leading term. When x is huge, the leading term is so much bigger than the rest that the rest hardly matters. At x = 1000, 3x² is 3,000,000, and the + 1 changes almost nothing.\n\nSo for a fraction whose top and bottom have the same highest power, keep only the leading terms. For example, lim x→∞ (3x² + 1)/(x² + 5) = lim 3x²/x² = 3. The x² on top and bottom cancel.\n\nCheck: at x = 1000 the fraction is 3,000,001/1,000,005, which is about 2.99999.',
    note: 'When the top and bottom have the same highest power, the limit as x → ∞ is the leading number on top divided by the leading number on the bottom.',
    ask: 'What is lim x→∞ (4x² + 7)/(2x² − 1)? What is lim x→∞ (5x³ + x)/(x³ + 2)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.dt = S.db = false; build(g); M.inert(g, ['arr', 'inf', 'res']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const a = S.top[0][0], c = S.bot[0][0], cs = S.top[S.top.length - 1][0], ds = S.bot[S.bot.length - 1][0];
    // the smaller terms drift off toward the top right, shrinking into the distance
    const drop = (g, k, T) => { T.slice(1).forEach((q, i) => { const b = M.box(g, k + (i + 1)); if (b) M.fly(g, { node: term(q, true), from: [b.x, b.y], to: [340 - i * 20, 40 + i * 10], dur: 0.6, arc: -30, s0: b.s, s1: 6 }); }); };
    const side = (k, T, flag) => ({ tap: [k, ...T.map((q, i) => k[0] + i)], busy: 0.1, then(g) { drop(g, k[0], T); S[flag] = true; S.popF = g.t; g.sfx('whoosh'); build(g); } });
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.dt) out.push(side('top', S.top, 'dt'));
        if (!S.db) out.push(side('bot', S.bot, 'db'));
        if (S.dt && S.db && !S.tapped) out.push({ tap: 'fr', busy: 0.1, ask: { v: valNode(a, c), wrong: [valNode(cs, ds), valNode(c, a), M.num(0), M.num(1)] }, askAt: 0, after: 0.1,
          then() { S.tapped = true; }, resolve(g) { S.val = true; S.popV = g.t; g.sfx('coin'); build(g); const b = M.box(g, 'res'); if (b) g.burst(b.x, b.y, [GOLD, '#9ad8ff', '#fff'], 16, 140); } });
        return out;
      },
      area(g) { return !S.dt ? ['top'] : !S.db ? ['bot'] : ['fr']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'space', panel: 'none', host: 'owl', hostX: 300, hostY: 604, hostS: 1.15 });
    M.drawEx(g, c, 'lim'); M.drawEx(g, c, 'sub'); M.drawEx(g, c, 'main'); glyph(c, 'arr', M.box(g, 'arr'), INK); glyph(c, 'inf', M.box(g, 'inf'), INK);
    // the graph: a comet flies right along y = f(x) and settles toward the dashed line y = L
    const L = S.top[0][0] / S.bot[0][0], x0 = 30, x1 = 330, yb = 520, yt = 410, X1 = 14, top = Math.max(L * 1.35, 1);
    const Y = v => yb - M.clamp(v / top, -0.1, 1.1) * (yb - yt), X = x => x0 + x / X1 * (x1 - x0), f = x => fx(S.top, x) / fx(S.bot, x);
    c.save(); c.strokeStyle = 'rgba(200,220,255,0.35)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.moveTo(x0, yb); c.lineTo(x0, yt - 6); c.stroke();
    c.setLineDash([6, 6]); c.strokeStyle = S.val ? GOLD : 'rgba(255,212,90,0.55)'; c.lineWidth = S.val ? 3 : 2; c.beginPath(); c.moveTo(x0, Y(L)); c.lineTo(x1, Y(L)); c.stroke(); c.setLineDash([]);
    c.strokeStyle = SUB; c.lineWidth = 3; c.beginPath(); for (let k = 0; k <= 60; k++) { const x = X1 * k / 60; k ? c.lineTo(X(x), Y(f(x))) : c.moveTo(X(x), Y(f(x))); } c.stroke();
    const u = (t * 0.35) % 1, cx = X1 * u, px = X(cx), py = Y(f(cx));
    for (let k = 1; k < 8; k++) { const xx = Math.max(0, cx - k * 0.18); c.fillStyle = `rgba(255,240,200,${0.5 - k * 0.06})`; c.beginPath(); c.arc(X(xx), Y(f(xx)), 5 - k * 0.5, 0, 7); c.fill(); }
    c.fillStyle = '#fff8e0'; c.shadowColor = GOLD; c.shadowBlur = 14; c.beginPath(); c.arc(px, py, 6, 0, 7); c.fill(); c.shadowBlur = 0;
    if (S.val) { c.font = M.NUMF(16); c.fillStyle = GOLD; c.textAlign = 'left'; c.fillText('y = ' + (Number.isInteger(L) ? L : S.top[0][0] / gcd(S.top[0][0], S.bot[0][0]) + '/' + S.bot[0][0] / gcd(S.top[0][0], S.bot[0][0])), x0 + 6, Y(L) - 8); }
    c.restore();
    M.drawUI(g, c);
  },
});
