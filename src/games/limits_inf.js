// limits_inf.js — LIMIT AT INF! The limit of a rational function as x → ∞ when the top and bottom have the same
// degree: only the leading terms matter, so lim (3x² + 1)/(x² + 5) = lim 3x²/x² = 3.
// Moves, each acted out (show your work): tap the top (any of its terms) and the bottom, in either order: the highest
// power lights up gold, the smaller terms fade and drift off into space, and only the leading term stays. Then tap the
// fraction of leading terms: the two equal powers are circled, joined by an arrow and crossed out, the numbers divide in
// a note ("6 ÷ 2 = 3"), and the line becomes the true statement lim (original) = L.
// Under the problem, a comet flies along the graph to the right, settling toward the dashed line y = L.
// Level 0: (ax² + b)/(x² + d). Level 1: (ax² + bx)/(cx² + d), a a multiple of c. Level 2: cubes, and a/c may be a fraction.
// Medium mode: the tray opens once the powers have cancelled (wrong tiles: the ratio of the constants, c/a, 0, 1).
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
// a term c·x^p as separate nodes (sign, coefficient, power), so the leading term's parts can cancel on their own
function term([cf, p], first, id) {
  const Q = { cf, p, sg: first ? null : M.op('+'), co: p && cf === 1 ? null : M.num(cf, id + 'c'), pw: p === 0 ? null : p === 1 ? M.vr('x', id + 'x') : M.sup(M.vr('x', id + 'x'), M.num(p)) };
  if (Q.pw) Q.pw.id = id + 'p'; Q.row = M.row(); Q.row.id = id; Q.sync = () => { Q.row.items = [Q.sg, Q.co, Q.pw].filter(Boolean); }; Q.sync(); return Q;
}
// a plain copy of a line of terms, with no ids (for the final statement and for measuring)
const plainLine = T => M.row(...T.map(([cf, p], i) => M.row(i ? M.op('+') : null, p && cf === 1 ? null : M.num(cf), p === 0 ? null : p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(p)))));
const valNode = (a, c) => { const d = gcd(a, c); return c / d === 1 ? M.num(a / d) : M.frac(M.num(a / d), M.num(c / d)); };
const hideAll = n => { if (!n) return; n.alpha = 0; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) hideAll(ch); };
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); for (const ch of [q.base, q.exp, q.n, q.d, q.inner, ...(q.items || [])]) walk(ch); })(n); return out; };
// MK.drawEx glides every node that moved, and a child's glide adds to its parent's, so a symbol inside a moving row would
// start twice as far away. drawEx2 lets the kit work out the glides on a scratch canvas, removes each parent's share
// from its children's glides, then draws for real.
const NULLC = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; return cv.getContext('2d'); })();
function unnest(n, ax, ay, t0) {
  if (!n) return; let gx = ax, gy = ay;
  if (n._glide) { if (!n._glide.fixed && n._glide.t0 === t0) { n._glide.dx -= ax; n._glide.dy -= ay; } n._glide.fixed = true; gx = ax + n._glide.dx; gy = ay + n._glide.dy; }
  for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])]) unnest(ch, gx, gy, t0);
}
function drawEx2(g, c, key) { const e = g.s.mk.ex[key]; if (!e) return; M.drawEx(g, NULLC, key); unnest(e.node, 0, 0, g.t); M.drawEx(g, c, key); }
// the left edge stays put (set from the widest moment), so "lim" never slides while the fraction changes
function build(g) {
  const S = g.s, s = S.size, cw = Math.max(M.lay(S.limN, s).w, M.lay(S.subN, s * 0.55).w), y = 292;
  M.place(g, 'lim', S.limN, S.x0 + cw / 2, y, s, { col: INK }); M.place(g, 'sub', S.subN, S.x0 + cw / 2, y + s * 0.62, s * 0.55, { col: INK });
  M.place(g, 'main', S.main, S.x0 + cw + s * 0.25, y, s, { col: INK, left: true });
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
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.dt = S.db = false; const T = M.pace(g);
    const a = S.top[0][0], c = S.bot[0][0], cs = S.top[S.top.length - 1][0], ds = S.bot[S.bot.length - 1][0], n = S.n;
    S.limN = M.txt('lim', 'lim'); S.subN = M.row(M.vr('x'), { k: 'gap', w: 22, id: 'arr' }, { k: 'gap', w: 26, id: 'inf' });
    S.TQ = S.top.map((q, i) => term(q, i === 0, 't' + i)); S.BQ = S.bot.map((q, i) => term(q, i === 0, 'b' + i));
    S.topR = M.row(...S.TQ.map(q => q.row)); S.topR.id = 'top'; S.botR = M.row(...S.BQ.map(q => q.row)); S.botR.id = 'bot';
    S.fr = M.frac(S.topR, S.botR, 'fr'); S.main = M.row(S.fr);
    const full = () => M.frac(plainLine(S.top), plainLine(S.bot));
    const measure = sz => Math.max(M.lay(M.row(full(), M.op('='), valNode(a, c)), sz).w, M.lay(full(), sz).w) + Math.max(M.lay(S.limN, sz).w, M.lay(S.subN, sz * 0.55).w) + sz * 0.25;
    S.size = Math.min(46, 46 * 300 / measure(46)); S.x0 = 180 - measure(S.size) / 2; build(g); M.inert(g, ['arr', 'inf', 'res', 'eqv']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // one side: the highest power lights up gold, the smaller terms fade and drift off into space, the leading term stays
    const side = (k, Q, R, flag) => ({ tap: [k, ...idsIn(R)], busy: 0.1, then(g) { S[flag] = true; M.show(g, 1.0 * T); react(g, 'think'); S.point = true; const lead = Q[0];
      M.light(g, lead.pw, { col: GOLD, dur: 0.2 * T }); M.indicate(g, lead.row, { dur: 0.45 * T, sc: 1.2, col: GOLD }); M.sparkle(g, lead.pw.id, { n: 8, cols: [GOLD, '#fff'] }); g.sfx('ding');
      for (const q of Q.slice(1)) M.tween(g, q.row, { alpha: 0.35, sc: 0.8 }, 0.25 * T, { delay: 0.3 * T });
      M.at(g, [[0.6 * T, g => { Q.slice(1).forEach((q, i) => { const b = M.box(g, q.row.id); if (b) M.fly(g, { node: M.row(q.co ? M.num(q.cf) : null, q.p === 0 ? null : q.p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(q.p))), from: [b.x, b.y], to: [330 - i * 26, 60 + i * 16], dur: 0.6 * T, arc: -30, s0: b.s * 0.8, s1: 6, col: SUB });
          hideAll(q.row); }); R.items = [lead.row]; build(g); g.sfx('whoosh'); react(g); }],
        [0.95 * T, g => { S.point = false; }]]); } });
    const cancelT = 1.0 * T, tail = (gcd(a, c) === 1 ? 0.85 : 1.05) * T;
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.dt) out.push(side('top', S.TQ, S.topR, 'dt'));
        if (!S.db) out.push(side('bot', S.BQ, S.botR, 'db'));
        if (S.dt && S.db && !S.tapped) out.push({ tap: ['fr', ...idsIn(S.fr)], busy: 0.1, ask: { v: valNode(a, c), wrong: [valNode(cs, ds), valNode(c, a), M.num(0), M.num(1)] }, askAt: cancelT, after: tail,
          then(g) { S.tapped = true; M.show(g, cancelT); react(g, 'think'); S.point = true; const t0 = S.TQ[0], b0 = S.BQ[0];
            // the same power on top and bottom: circled together, crossed out, and they leave the bare numbers behind
            M.circle(g, [t0.pw.id, b0.pw.id], { col: GOLD, dur: 0.5 * T }); M.arrow(g, t0.pw.id, b0.pw.id, { col: GOLD, bend: -30, dur: 0.3 * T, linger: 0.5 * T });
            M.strike(g, t0.pw, { delay: 0.35 * T, dur: 0.2 * T }); M.strike(g, b0.pw, { delay: 0.45 * T, dur: 0.2 * T });
            M.at(g, [[0.38 * T, g => g.sfx('swoosh')], [0.72 * T, g => { M.tween(g, t0.pw, { alpha: 0, sc: 0.6 }, 0.14 * T); M.tween(g, b0.pw, { alpha: 0, sc: 0.6 }, 0.14 * T); }],
              [0.88 * T, g => { hideAll(t0.pw); hideAll(b0.pw); for (const q of [t0, b0]) { if (!q.co) q.co = M.num(1, q.row.id + 'c', { _born: g.t }); q.pw = null; q.sync(); } build(g); g.sfx('pop'); react(g); M.light(g, t0.co, { col: GOLD }); M.light(g, b0.co, { col: GOLD }); }]]); },
          resolve(g) { M.show(g, tail); S.point = false; const d = gcd(a, c), plain = d === 1;
            // the numbers divide ("6 ÷ 2 = 3") or the fraction simplifies ("4/6 = 2/3") in a note; a fraction that is already
            // simplest (3/2) just turns gold. Then the line becomes the true statement about the original limit.
            if (!plain) M.note(g, { node: d === c ? M.row(M.num(a), M.op('÷'), M.num(c), M.op('='), M.num(a / c)) : M.row(M.frac(M.num(a), M.num(c)), M.op('='), M.frac(M.num(a / d), M.num(c / d))), at: 'fr', off: [S.size * 2.4, -S.size * 0.2], s: Math.round(S.size * 0.62), col: GOLD, write: 0.28 * T, hold: 0.25 * T, fade: 0.2 * T });
            else M.indicate(g, S.fr, { dur: 0.4 * T, sc: 1.15, col: GOLD });
            const t1 = plain ? 0.3 * T : 0.5 * T;
            M.at(g, [[t1, g => { M.tween(g, S.fr, { alpha: 0, sc: 0.6 }, 0.12 * T); }],
              [t1 + 0.12 * T, g => { hideAll(S.fr); S.res = Object.assign(valNode(a, c), { col: GOLD, id: 'res', pop: g.t }); S.main.items = [S.res]; build(g); S.val = true; S.popV = g.t; g.sfx('coin'); react(g, 'wow'); M.sparkle(g, 'res', { n: 16, cols: [GOLD, '#9ad8ff', '#fff'] }); }],
              [t1 + 0.5 * T, g => { const f = full(); f._born = g.t; S.main.items = [f, M.op('=', 'eqv'), S.res]; build(g); g.sfx('chime'); react(g, 'laugh'); }]]); } });
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
    SCN.std(g, c, { scene: 'space', panel: 'none' });
    // the owl points at the problem while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 300, 604 - hopK * 22, 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', 300, 604, 1.15);
    M.drawEx(g, c, 'lim'); M.drawEx(g, c, 'sub'); drawEx2(g, c, 'main'); glyph(c, 'arr', M.box(g, 'arr'), INK); glyph(c, 'inf', M.box(g, 'inf'), INK);
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
