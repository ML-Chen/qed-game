// integrals_between.js — AREA BETWEEN! The area between two curves is ∫ (top − bottom) dx.
// A winter night under the northern lights: two curves are drawn on a dark glass board, and the region between them
// is where the aurora will pour in. The problem reads A = ∫₀ᵇ ( ? − ? ) dx. Moves (each acts out its working):
//   1–2. Drag the top curve's label into the first slot and the bottom curve's label into the second (either order).
//        The label's formula flies into its slot, its curve glows, and a gold (top) or blue (bottom) arrow rises from
//        the x-axis to the curve. Once both are in, a pink bracket spans the gap between them with "x − x²" beside it:
//        that height is what the integral adds up. Bottom-into-first (bottom minus top) is the classic wrong move.
//   3. Tap the ∫: thin strips of height top − bottom sweep across the region one by one and fill it with light; then
//      [ ... ]₀ᵇ writes itself and each term is integrated in turn: a "+ 1" writes itself and flies into the exponent,
//      which rolls up, then the new power drops under a fraction bar that draws itself (or divides the coefficient).
//   4. Tap the bracket: the upper limit flies into each x, the powers are worked out in notes ("2³ = 8"), each term
//      collapses to a number, "F(0) = 0" is noted, the bracket dissolves, the difference is put over a common
//      denominator in a note ("3/6 − 2/6 = 1/6") and the answer flies into the glowing region.
// Level 0: x − x², x − x³, 1 − x² on [0, 1]. Level 1: 2x − x², 4 − x² on [0, 2], x² − x³ on [0, 1]. Level 2: 4x − x²,
// 3x − x², 9 − x² on [0, b]. Medium mode: the antiderivative and the final area come from the tray.
const M = MK, INK = '#eef4ff', GOLD = '#ffc23a', BLUE = '#6ab8ff', PINK = '#ff7ac0', AUR = '#5cf2b0', NOTE = '#ffe7a0';
const L1Y = 222, L2Y = 292, NY = 366, GX0 = 34, GX1 = 302, GT = 414, GB = 560, PX = 330, PY = 630;
const POOL = [
  [{ t: [1, 1], u: [1, 2], b: 1 }, { t: [1, 1], u: [1, 3], b: 1 }, { t: [1, 0], u: [1, 2], b: 1 }],
  [{ t: [2, 1], u: [1, 2], b: 2 }, { t: [4, 0], u: [1, 2], b: 2 }, { t: [1, 2], u: [1, 3], b: 1 }],
  [{ t: [4, 1], u: [1, 2], b: 4 }, { t: [3, 1], u: [1, 2], b: 3 }, { t: [9, 0], u: [1, 2], b: 3 }],
];
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const red = (n, d) => { const k = gcd(n, d) || 1; return [n / k, d / k]; };
const fnode = ([n, d], id, o) => d === 1 ? M.num(n, id, o) : M.frac(M.num(n), M.num(d), id, o);
const xpow = (q, id) => q === 1 ? M.vr('x', id) : M.sup(M.vr('x'), M.num(q), id);
// c·xᵖ as a plain node (no ids): "x", "2x", "x²", "4"
const mono = ([c, p]) => M.row(c === 1 && p ? null : M.num(c), p ? xpow(p) : null);
// the antiderivative of c·xᵖ, simplified as on the board: x²/2, 2x², 3x²/2, 4x, x
const antiT = ([c, p]) => { const q = p + 1; if (c % q === 0) { const k = c / q; return M.row(k === 1 ? null : M.num(k), xpow(q)); } return M.frac(M.row(c === 1 ? null : M.num(c), xpow(q)), M.num(q)); };
const antiV = ([c, p], b) => red(c * Math.pow(b, p + 1), p + 1);
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])].filter(Boolean);
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); kids(q).forEach(walk); })(n); return out; };
const tint = (n, col) => { if (!n) return n; n.col = col; kids(n).forEach(q => tint(q, col)); return n; };
const hideAll = n => { if (!n) return; n.alpha = 0; kids(n).forEach(hideAll); };
function fitAsk(g) { // tray tiles grow to fit an expression at a readable size
  const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; const gap = 8, ws = A.list.map(ch => M.lay(ch.node, 28).w + 22), tws = ws.map(w => Math.max(74, w));
  const tot = tws.reduce((p, q) => p + q, 0) + gap * (tws.length - 1), k = Math.min(1, 344 / tot); let x = 180 - tot * k / 2;
  A.list.forEach((ch, i) => { ch.w = tws[i] * k; ch.x = x + ch.w / 2; x += ch.w + gap * k; ch.s = Math.min(34, 34 * (ch.w - 14) / M.lay(ch.node, 34).w); M.lay(ch.node, ch.s); }); }
// the integral sign, drawn by hand (the font has none)
function intSign(c, x, top, bot, w, col, lw) {
  const h = bot - top; c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x + w, top + h * 0.1);
  c.bezierCurveTo(x + w * 0.98, top - h * 0.03, x + w * 0.62, top - h * 0.03, x + w * 0.58, top + h * 0.16);
  c.lineTo(x + w * 0.42, bot - h * 0.16);
  c.bezierCurveTo(x + w * 0.38, bot + h * 0.03, x + w * 0.02, bot + h * 0.03, x, bot - h * 0.1); c.stroke();
  for (const [px, py] of [[x + w, top + h * 0.1], [x, bot - h * 0.1]]) { c.beginPath(); c.arc(px, py, lw * 0.9, 0, 7); c.fill(); }
  c.restore();
}
function label(c, s, x, y, size, col) { c.save(); c.font = M.NUMF(size, 700); c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = 4; c.strokeStyle = 'rgba(6,10,30,0.9)'; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y); c.restore(); }

// ---------------- the scene: a snowy night under the aurora ----------------
function scene(c, W, H) {
  P.sky(c, W, H, ['#050a24', '#0c1a44', '#1a2c5a', '#2a3c6a']);
  P.stars(c, W, 420, 90, 11);
  // far snowy hills and a row of dark pines
  P.hills(c, W, 560, 30, '#3a4c7a', '#22305a', { seed: 5, dabs: 30 });
  c.fillStyle = '#0e1838'; for (let i = 0; i < 16; i++) { const x = i * 24 + (i % 3) * 5, h = 34 + (i * 37 % 23); c.beginPath(); c.moveTo(x, 572); c.lineTo(x + 10, 572 - h); c.lineTo(x + 20, 572); c.fill(); }
  const sg = c.createLinearGradient(0, 568, 0, H); sg.addColorStop(0, '#c8d8f4'); sg.addColorStop(1, '#8aa0cc'); c.fillStyle = sg; c.fillRect(0, 568, W, H - 568);
  c.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 30; i++) { c.beginPath(); c.ellipse((i * 53) % W, 580 + (i * 29) % 56, 6 + i % 5, 2, 0, 0, 7); c.fill(); }
}

MG.add({
  id: 'between', stage: 'integrals', cmd: 'AREA BETWEEN!', hint: 'drag', time: 10, mood: 'night', winText: 'Filled!', hold: 1.8,
  card: {
    title: 'Area between curves', ref: 'Calculus', kind: 'Calculus',
    text: 'To find the area of a region between two curves, cut it into very thin upright strips. Each strip reaches from the bottom curve up to the top curve, so its height is top − bottom. An integral adds up all those strips.\n\nSo the area is ∫ (top − bottom) dx, taken from where the region starts to where it ends.\n\nFor example, between y = x and y = x² from 0 to 1, y = x is on top. The area is ∫ (x − x²) dx = [x²/2 − x³/3] from 0 to 1 = 1/2 − 1/3 = 1/6.',
    note: 'Area between curves = ∫ (top − bottom) dx over the interval. Put the higher curve first.',
    ask: 'What is the area between y = 2x and y = x² from 0 to 2? Between y = 1 and y = x² from 0 to 1?',
  },

  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g), list = POOL[g.level], P = list[Math.floor(g.rand() * list.length)];
    Object.assign(S, P); const { t, u, b } = S, fT = x => t[0] * Math.pow(x, t[1]), fU = x => u[0] * Math.pow(x, u[1]);
    S.fT = fT; S.fU = fU; S.terms = [[t[0], t[1]], [u[0], u[1]]]; // the integrand: t − u
    S.vals = S.terms.map(q => antiV(q, b)); { const [[a1, d1], [a2, d2]] = S.vals, L = d1 * d2 / gcd(d1, d2); S.L = L; S.ans = red(a1 * (L / d1) - a2 * (L / d2), L); }
    S.ymax = Math.max(fT(0), fT(b), fU(b)); S.xs = b * 0.5; // the sample strip for the arrows
    S.X = x => GX0 + (x + 0.12 * b) / (1.24 * b) * (GX1 - GX0); S.Y = y => GB - (y + 0.1 * S.ymax) / (1.24 * S.ymax) * (GB - GT);
    // the problem line: A = ∫ ( ? − ? ) dx, with the limits drawn beside the ∫
    S.s1 = M.slot('s1', { w: 46 }); S.s2 = M.slot('s2', { w: 46 });
    S.top = M.row(M.vr('A', 'A'), M.op('=', 'eqA'), { ...M.gap(36), id: 'int' }, M.paren(M.row(S.s1, M.op('-', 'mn'), S.s2), 'pr'), M.gap(6), M.txt('d', 'dd'), M.vr('x', 'dxx'));
    // the two curve labels, on the board near their curves
    const lab = ([c, p], id) => { const n = M.row(M.vr('y'), M.op('='), mono([c, p])); n.id = id; return n; };
    S.lt = lab(t, 'Lt'); S.lb = lab(u, 'Lb');
    { const xa = b * 0.25; S.ltP = [Math.max(80, S.X(xa)), Math.max(GT + 14, S.Y(fT(xa)) - 44)]; S.lbP = [GX1 - 46, S.Y(0) - 26]; }
    S.topS = 34; S.ws = 40;
    const relay = () => { M.place(g, 'top', S.top, 188, L1Y, S.topS, { col: INK }); if (!S.inT) M.place(g, 'lt', S.lt, S.ltP[0], S.ltP[1] + 8, 26, { col: GOLD }); if (!S.inU) M.place(g, 'lb', S.lb, S.lbP[0], S.lbP[1] + 8, 26, { col: BLUE }); if (S.work) M.place(g, 'work', S.work, 180, L2Y, S.ws, { col: INK }); };
    S.relay = relay; relay(); M.inert(g, ['eqA', 'mn', 'pr', 'dd', 'dxx', 'eqW', 'cm']);
    S.arrows = []; S.sweep = null; S.glow = null; S.face = 'happy'; S.faceT = -9;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 4) / 8;

    // 1–2. a curve's formula flies into its slot
    const fill = (which) => ({ drag: which === 'T' ? 'Lt' : 'Lb', to: which === 'T' ? 's1' : 's2', reach: 70, busy: 0.1,
      then(g) { const T0 = which === 'T', src = T0 ? S.lt : S.lb, sl = T0 ? S.s1 : S.s2, col = T0 ? GOLD : BLUE, q = T0 ? t : u; M.show(g, 1.7 * T); S.point = true; react(g, 'think');
        const from = { ...M.box(g, T0 ? 'Lt' : 'Lb') }; if (T0) S.inT = true; else S.inU = true; hideAll(src); delete g.s.mk.ex[T0 ? 'lt' : 'lb'];
        g.s.mk.box[T0 ? 'Lt' : 'Lb'] = { x: -99, y: -99, w: 0, h: 0 };
        S.glow = { which, t0: g.t }; g.sfx('swoosh');
        M.fly(g, { node: mono(q), from: [from.x + 20, from.y], to: T0 ? 's1' : 's2', dur: 0.5 * T, arc: -60, s0: 26, s1: S.topS, col,
          then(g) { const n = mono(q); n.id = T0 ? 'f1' : 'f2'; (function born(k) { k._born = -1; kids(k).forEach(born); })(n); tint(n, col); sl.fill = n; relay(); M.sparkle(g, T0 ? 's1' : 's2', { n: 8 }); g.sfx('pop'); react(g, 'happy'); } });
        // an arrow rises from the x-axis up to this curve at the sample strip
        M.at(g, [[0.6 * T, g => { S.arrows.push({ which, t0: g.t, dur: 0.5 * T }); g.sfx('tap'); }]]);
        if (S.inT && S.inU) M.at(g, [[1.15 * T, g => { // both in: the gap between the curves is the strip's height, top − bottom
          S.arrows.push({ which: 'gap', t0: g.t, dur: 0.4 * T }); g.sfx('ding'); react(g, 'wow');
          M.note(g, { node: M.row(mono(t), M.op('-'), mono(u)), at: [S.X(S.xs) - 58, Math.max(GT, S.Y(fT(S.xs)) - 34)], s: 28, col: PINK, write: 0.3 * T, hold: 0.9 * T, fade: 0.3 * T, pill: true }); }]]);
        M.at(g, [[1.6 * T, g => { S.point = false; }]]);
        if (S.inT && S.inU) M.show(g, 2.7 * T); } });

    // the working line's terms: { sg, cf, xv, ex, pw, den, node, row }
    const wterm = ([c, p], i) => { const Q = { c, p, i, sg: i ? M.op('-', 'ws' + i) : null, cf: p && c === 1 ? null : M.num(c, 'wc' + i), xv: p ? M.vr('x', 'wx' + i) : null };
      Q.ex = p ? M.num(p, 'we' + i, { alpha: p === 1 ? 0 : 1 }) : null; Q.pw = p ? M.sup(Q.xv, Q.ex, 'wp' + i) : null;
      Q.row = M.row(); Q.row.id = 'w' + i; Q.sync = () => { const core = M.row(Q.cf, Q.cf && Q.dot ? Q.dot : null, Q.pw); Q.node = Q.den ? M.frac(core, Q.den, 'wf' + i, Q.bar ? { bar: Q.bar } : {}) : core; Q.bar = null; Q.row.items = [Q.sg, Q.node].filter(Boolean); }; Q.sync(); return Q; };
    // integrate one term in place; returns its length (in units of T)
    function integ(g, Q) {
      const { c, p } = Q, q = p + 1;
      if (p === 0) { // a constant: ∫ 4 dx = 4x, an x writes itself in (a lone 1 becomes x)
        M.circle(g, Q.cf, { dur: 0.45 * T, col: GOLD, pad: 5 });
        M.at(g, [[0.35 * T, g => { Q.xv = M.vr('x', 'wx' + Q.i, { _born: -1 }); Q.pw = Q.xv; Q.sync(); relay(); M.writeIn(g, Q.xv, { dur: 0.35 * T }); M.sparkle(g, Q.xv, { n: 6, delay: 0.3 * T }); g.sfx('tap'); }]]);
        if (c === 1) M.at(g, [[0.9 * T, g => { M.tween(g, Q.cf, { alpha: 0, sc: 0.5 }, 0.25 * T); }], [1.2 * T, g => { Q.cf = null; Q.sync(); relay(); }]]);
        return 1.35;
      }
      // the exponent (a faint x¹ shows itself first) gets "+ 1", which flies in, and it rolls up
      if (p === 1) M.tween(g, Q.ex, { alpha: 1 }, 0.3 * T);
      M.light(g, Q.ex, { col: GOLD }); M.circle(g, Q.ex, { dur: 0.45 * T, col: GOLD, pad: 4, delay: 0.1 * T });
      M.note(g, { node: M.row(M.op('+'), M.num(1)), at: Q.ex, off: [26, -26], s: 26, col: NOTE, delay: 0.25 * T, write: 0.3 * T, hold: 0.45 * T, fly: 0.3 * T, to: Q.ex, s1: 18, arc: 10,
        then(g) { M.roll(g, Q.ex, q, { dur: 0.38 * T }); M.sparkle(g, Q.ex, { n: 8, delay: 0.3 * T }); g.sfx('ding'); } });
      M.unlight(g, Q.ex, { delay: 1.8 * T });
      // then divide by the new power: it drops under a fraction bar, or divides the coefficient
      if (c % q === 0) {
        const k = c / q;
        M.at(g, [[1.75 * T, g => { M.circle(g, Q.cf, { dur: 0.4 * T, col: PINK, pad: 4 });
          M.note(g, { node: M.row(M.num(c), M.op('÷'), M.num(q), M.op('='), M.num(k)), at: Q.cf, off: [0, 50], s: 26, col: NOTE, write: 0.3 * T, hold: 0.75 * T, fade: 0.25 * T, pill: true });
          M.roll(g, Q.cf, k, { delay: 0.45 * T, dur: 0.38 * T }); }]]);
        if (k === 1) M.at(g, [[2.65 * T, g => { M.tween(g, Q.cf, { alpha: 0, sc: 0.5 }, 0.25 * T); }], [2.95 * T, g => { Q.cf = null; Q.sync(); relay(); }]]);
        return k === 1 ? 3.0 : 2.75;
      }
      M.at(g, [[1.75 * T, g => { const from = { ...(M.box(g, 'we' + Q.i) || { x: 180, y: L2Y }) }; Q.den = M.num(q, 'wd' + Q.i, { alpha: 0 }); Q.bar = { t0: g.t, dur: 0.4 * T }; Q.sync(); relay(); g.sfx('swoosh');
        M.fly(g, { node: M.num(q, null, { col: NOTE }), from: [from.x, from.y], to: 'wd' + Q.i, dur: 0.5 * T, arc: -36, s0: 22, s1: S.ws * 0.82,
          then(g) { Q.den.alpha = 1; Q.den.pop = g.t; M.sparkle(g, 'wd' + Q.i, { n: 6 }); g.sfx('pop'); } }); }]]);
      return 2.55;
    }
    // the arithmetic of one term at x = b, as a note: "2 · 4² = 32", "2³/3 = 8/3", "3 · 3²/2 = 27/2" (none for a lone x)
    const subNote = ([c, p]) => { const q = p + 1, pw = q === 1 ? M.num(b) : M.sup(M.num(b), M.num(q)), v = fnode(antiV([c, p], b));
      if (c % q === 0) { const k = c / q; if (k === 1 && q === 1) return null; return M.row(k === 1 ? null : [M.num(k), M.op('·')], pw, M.op('='), v); }
      return M.row(M.frac(M.row(c === 1 ? null : [M.num(c), M.op('·')], pw), M.num(q)), M.op('='), v); };
    const antiRow = () => M.row(antiT(S.terms[0]), M.op('-'), antiT(S.terms[1]));
    const antiAsk = () => { const [a, d] = S.terms, wrongs = [
      M.row(mono([a[0], a[1] + 1]), M.op('-'), mono([d[0], d[1] + 1])), // forgot to divide
      M.row(antiT(a), M.op('+'), antiT(d)),                              // lost the minus
      M.row(a[1] ? mono([a[0] * a[1], a[1] - 1]) : M.num(0), M.op('-'), mono([d[0] * d[1], d[1] - 1])) ]; // differentiated
      return { v: antiRow(), wrong: wrongs }; };
    const valAsk = () => { const [n, d] = S.ans, [a1, d1] = S.vals[0], [a2, d2] = S.vals[1]; return { v: fnode(S.ans), wrong: [fnode(red(a1 * d2 + a2 * d1, d1 * d2)), fnode(red(a1 - a2 || 1, Math.abs(d1 - d2) || 1)), fnode(red(n * 2, d))] }; };

    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.inT || !S.inU) { if (!S.inT) out.push(fill('T')); if (!S.inU) out.push(fill('U')); return out; }
        // 3. integrate: strips of height top − bottom sweep across and fill the region, then each term is integrated
        if (!S.work) return [{ tap: ['int', 'pr', 'f1', 'f2'], busy: 0.1, askAt: 2.3 * T, ask: antiAsk(),
          then(g) { M.show(g, 2.3 * T); S.point = true; react(g, 'think');
            M.circle(g, 'int', { dur: 0.5 * T, col: AUR, pad: 4 }); S.sweep = { t0: g.t + 0.2 * T, dur: 1.5 * T, n: 10 }; g.sfx('swoosh');
            M.at(g, [[0.4 * T, g => { g.sfx('sparkle'); }], [1.0 * T, g => react(g, 'wow')],
              [1.6 * T, g => { S.WQ = S.terms.map(wterm); S.br = M.paren(M.row(...S.WQ.map(Q => Q.row)), 'br', { br: '[]' }); S.work = M.row(M.op('=', 'eqW'), S.br); relay(); S.limAt = g.t + 0.4 * T; M.writeIn(g, S.work, { dur: 0.6 * T }); g.sfx('tap'); }]]); },
          resolve(g) { let t0 = 0; for (const Q of S.WQ) { const k = t0; M.at(g, [[k * T, g => { react(g, k ? 'happy' : 'wow'); integ(g, Q); }]]); t0 += Q.p === 0 ? 1.35 : Q.c % (Q.p + 1) === 0 ? (Q.c / (Q.p + 1) === 1 ? 3.0 : 2.75) : 2.55; }
            M.show(g, (t0 + 0.4) * T); M.at(g, [[t0 * T, g => { M.indicate(g, S.br, { dur: 0.45 * T, sc: 1.06, col: AUR }); S.point = false; }]]); } }];
        // 4. evaluate from 0 to b: b flies into each x, each term becomes a number, then the difference
        if (!S.evald) return [{ tap: idsIn(S.br), busy: 0.1, askAt: (S.WQ.length * 1.5 + 1.6) * T, after: 2.6 * T, ask: valAsk(),
          then(g) { S.evald = true; const len = S.WQ.length * 1.5 + 1.6; M.show(g, len * T); S.point = true; react(g, 'think'); S.limHi = g.t;
            S.WQ.forEach((Q, k) => M.at(g, [[k * 1.5 * T, g => {
              const lb = S.limBox(), tgt = Q.xv; if (!lb || !tgt) return; react(g, 'wow');
              M.fly(g, { node: M.num(b, null, { col: GOLD }), from: [lb.hx, lb.hy], to: tgt.id, dur: 0.5 * T, arc: -40, s0: 20, s1: S.ws, col: GOLD,
                then(g) { const nb = M.num(b, 'wb' + Q.i, { col: GOLD, _born: -1, pop: g.t }); if (Q.cf) Q.dot = M.op('·', null, { _born: -1 }); if (Q.pw && Q.pw.k === 'sup') Q.pw.base = nb; else Q.pw = nb; Q.xv = nb; Q.sync(); relay(); g.sfx('pop'); M.sparkle(g, nb, { n: 5 });
                  const nd = subNote(S.terms[Q.i]); if (nd) M.note(g, { node: nd, at: [(M.box(g, Q.row.id) || { x: 180 }).x, NY], s: 32, col: NOTE, write: 0.35 * T, hold: 0.6 * T, fade: 0.2 * T, pill: true }); } });
              M.at(g, [[1.35 * T, g => { const v = S.vals[Q.i]; Q.node = fnode(v, 'wv' + Q.i); Q.row.items = [Q.sg, Q.node].filter(Boolean); relay(); M.sparkle(g, Q.node, { n: 6 }); g.sfx('ding'); }]]); }]]));
            const tz = S.WQ.length * 1.5 * T;
            M.at(g, [[tz, g => { const lb = S.limBox(); if (lb) M.note(g, { node: M.row(M.vr('F'), M.paren(M.num(0)), M.op('='), M.num(0)), at: [lb.lx - 30, NY], s: 30, col: NOTE, write: 0.3 * T, hold: 0.6 * T, fade: 0.25 * T, pill: true }); }],
              [tz + 1.1 * T, g => { S.noLim = true; S.work.items = [S.work.items[0], ...S.WQ.flatMap(Q => Q.row.items)]; relay(); g.sfx('swoosh'); }]]); },
          resolve(g) { M.show(g, 2.6 * T); react(g, 'happy'); const [[a1, d1], [a2, d2]] = S.vals, L = S.L, f = (a, d) => fnode([a * (L / d), L]);
            const nd = d1 === d2 ? M.row(fnode(S.vals[0]), M.op('-'), fnode(S.vals[1]), M.op('='), fnode(S.ans)) : M.row(f(a1, d1), M.op('-'), f(a2, d2), M.op('='), fnode(S.ans));
            M.note(g, { node: nd, at: [180, NY], s: 34, col: NOTE, write: 0.45 * T, hold: 0.9 * T, fade: 0.25 * T, pill: true });
            M.at(g, [[1.35 * T, g => { S.res = fnode(S.ans, 'res'); S.work.items = [S.work.items[0], S.res]; relay(); g.sfx('coin'); react(g, 'laugh'); M.sparkle(g, 'res', { n: 12 }); }],
              [1.75 * T, g => { const rb = M.box(g, 'res'); S.areaAt = g.t + 0.55 * T; M.fly(g, { node: fnode(S.ans), from: rb ? [rb.x, rb.y] : 'work', to: S.areaPos(), dur: 0.55 * T, arc: -30, s0: S.ws, s1: 30, col: '#ffffff' }); }],
              [2.4 * T, g => { S.point = false; }]]); } }];
        return [];
      },
      area(g) { return !S.inT || !S.inU ? [!S.inT ? 'Lt' : 'Lb', !S.inT ? 's1' : 's2'] : !S.work ? ['int'] : ['br']; },
    });
    // where the bracket's limits sit (upper b at the top right, lower 0 at the bottom right)
    S.limBox = () => { const bb = M.box(g, 'br'); if (!bb) return null; const x = bb.x + bb.w / 2 + 10; return { hx: x, hy: bb.y - bb.h / 2 + 4, lx: x, ly: bb.y + bb.h / 2 - 2 }; };
    // the middle of the region, for the answer
    S.areaPos = () => { let bx = b * 0.5, bh = -1; for (let i = 4; i <= 16; i++) { const x = b * i / 20, h = S.Y(fU(x)) - S.Y(fT(x)); if (h > bh) { bh = h; bx = x; } } return [S.X(bx), (S.Y(fU(bx)) + S.Y(fT(bx))) / 2]; };
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, { b } = S;
    c.drawImage(g.bake('between_scene', scene), 0, 0, 360, 640);
    // the aurora: soft green and violet ribbons that drift
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++) { const col = ['rgba(80,240,170,', 'rgba(140,120,255,', 'rgba(90,220,255,'][k]; c.beginPath();
      for (let i = 0; i <= 24; i++) { const x = i * 15, y = 120 + k * 34 + Math.sin(i * 0.45 + t * 0.6 + k) * 18 + Math.sin(i * 0.17 - t * 0.3) * 12; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      for (let i = 24; i >= 0; i--) { const x = i * 15, y = 190 + k * 30 + Math.sin(i * 0.4 + t * 0.5 + k * 2) * 22; c.lineTo(x, y); }
      const gr = c.createLinearGradient(0, 100, 0, 260); gr.addColorStop(0, col + '0)'); gr.addColorStop(0.5, col + '0.16)'); gr.addColorStop(1, col + '0)'); c.fillStyle = gr; c.fill(); }
    c.restore();
    // a dark glass panel behind the problem lines
    c.save(); c.fillStyle = 'rgba(4,8,28,0.55)'; c.beginPath(); c.roundRect(14, 178, 332, 164, 20); c.fill(); c.strokeStyle = 'rgba(160,200,255,0.25)'; c.lineWidth = 2; c.stroke(); c.restore();
    // the graph board
    c.save(); c.fillStyle = 'rgba(6,14,40,0.72)'; c.beginPath(); c.roundRect(GX0 - 18, GT - 18, GX1 - GX0 + 36, GB - GT + 44, 18); c.fill(); c.strokeStyle = 'rgba(170,210,255,0.35)'; c.lineWidth = 2; c.stroke(); c.restore();
    const ax = S.Y(0), ay = S.X(0);
    c.save(); c.strokeStyle = 'rgba(220,235,255,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(GX0 - 4, ax); c.lineTo(GX1 + 4, ax); c.moveTo(ay, GB + 6); c.lineTo(ay, GT - 6); c.stroke();
    c.beginPath(); c.moveTo(S.X(b), ax - 6); c.lineTo(S.X(b), ax + 6); c.stroke(); c.restore();
    label(c, '0', ay - 13, ax + 26, 22, '#ffffff'); label(c, String(b), S.X(b), ax + 26, 22, '#ffffff');
    // the region: strips sweep across, then the whole region glows
    const N = 60, seg = (x0, x1) => { c.beginPath(); for (let i = 0; i <= N; i++) { const x = x0 + (x1 - x0) * i / N; i ? c.lineTo(S.X(x), S.Y(S.fT(x))) : c.moveTo(S.X(x), S.Y(S.fT(x))); } for (let i = N; i >= 0; i--) { const x = x0 + (x1 - x0) * i / N; c.lineTo(S.X(x), S.Y(S.fU(x))); } c.closePath(); };
    if (S.sweep) { const sw = S.sweep, k = M.clamp((t - sw.t0) / sw.dur, 0, 1), done = k >= 1, wid = b / sw.n;
      c.save(); const fillK = done ? 1 : 0; const gr = c.createLinearGradient(0, GT, 0, GB); gr.addColorStop(0, 'rgba(92,242,176,0.75)'); gr.addColorStop(1, 'rgba(120,140,255,0.6)');
      if (fillK) { seg(0, b); c.fillStyle = gr; c.globalAlpha = 0.55 + (S.areaAt && t > S.areaAt ? 0.25 + 0.1 * Math.sin(t * 5) : 0); c.fill(); }
      const shown = Math.floor(k * sw.n + 1e-6);
      for (let i = 0; i < sw.n; i++) { const appear = sw.t0 + (i + 1) / sw.n * sw.dur, a = M.clamp((t - appear + sw.dur / sw.n) / (sw.dur / sw.n), 0, 1); if (a <= 0) continue;
        const fadeOut = done ? M.clamp(1 - (t - sw.t0 - sw.dur) / 0.6, 0, 1) : 1; if (fadeOut <= 0) continue; const xm = (i + 0.5) * wid, top = S.Y(S.fT(xm)), bot = S.Y(S.fU(xm)), x0 = S.X(i * wid), x1 = S.X((i + 1) * wid);
        c.globalAlpha = fadeOut; c.fillStyle = i % 2 ? 'rgba(92,242,176,0.85)' : 'rgba(110,200,255,0.85)'; const h = (bot - top) * M.ease(a); c.fillRect(x0 + 1, bot - h, x1 - x0 - 2, h);
        c.strokeStyle = 'rgba(230,255,245,0.9)'; c.lineWidth = 1.5; c.strokeRect(x0 + 1, bot - h, x1 - x0 - 2, h); }
      if (!done && shown < sw.n) { const xm = (shown + 0.5) * wid; c.globalAlpha = 1; c.fillStyle = 'rgba(255,255,255,0.9)'; c.shadowColor = AUR; c.shadowBlur = 14; c.fillRect(S.X(shown * wid) - 1, S.Y(S.fT(xm)) - 4, 3, S.Y(S.fU(xm)) - S.Y(S.fT(xm)) + 8); }
      c.restore(); }
    // the two curves (they glow when their formula lands in its slot)
    for (const [f, col, w] of [[S.fT, GOLD, 'T'], [S.fU, BLUE, 'U']]) { const lit = S.glow && S.glow.which === w && t - S.glow.t0 < 1.2 * M.pace(g) ? 1 : 0;
      c.save(); c.strokeStyle = col; c.lineWidth = lit ? 6 : 4; c.lineCap = 'round'; c.shadowColor = col; c.shadowBlur = lit ? 18 : 6; c.beginPath();
      for (let i = 0; i <= 80; i++) { const x = -0.08 * b + 1.16 * b * i / 80, y = S.Y(f(x)); if (y < GT - 10) { c.stroke(); c.beginPath(); continue; } i ? c.lineTo(S.X(x), y) : c.moveTo(S.X(x), y); } c.stroke(); c.restore(); }
    // the arrows at the sample strip: axis to top (gold), axis to bottom (blue), then the gap between them (pink)
    for (const a of S.arrows) { const k = M.ease((t - a.t0) / a.dur), x = S.X(S.xs) + (a.which === 'U' ? 8 : a.which === 'T' ? -8 : 0);
      const fa = S.sweep ? M.clamp(1 - (t - S.sweep.t0) / 0.5, 0, 1) : 1; if (fa <= 0) continue;
      const y0 = a.which === 'gap' ? S.Y(S.fU(S.xs)) : ax, y1 = a.which === 'U' ? S.Y(S.fU(S.xs)) : S.Y(S.fT(S.xs)), y = M.lerp(y0, y1, k), col = a.which === 'T' ? GOLD : a.which === 'U' ? BLUE : PINK;
      c.save(); c.globalAlpha = fa; c.strokeStyle = col; c.fillStyle = col; c.lineWidth = a.which === 'gap' ? 5 : 3; c.shadowColor = col; c.shadowBlur = 8; c.lineCap = 'round';
      if (a.which === 'gap') { c.beginPath(); c.moveTo(x - 8, y0); c.lineTo(x + 8, y0); c.moveTo(x, y0); c.lineTo(x, y); c.moveTo(x - 8, y); c.lineTo(x + 8, y); c.stroke(); }
      else { c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y); c.stroke(); c.setLineDash([]); c.beginPath(); c.moveTo(x, y - 2); c.lineTo(x - 6, y + 8); c.lineTo(x + 6, y + 8); c.fill(); }
      c.restore(); }
    // the curve labels on their little ice plates
    for (const [key, id, col] of [['lt', 'Lt', GOLD], ['lb', 'Lb', BLUE]]) { const bx = S.mk.ex[key] && M.box(g, id); if (!bx || (key === 'lt' ? S.inT : S.inU)) continue;
      c.save(); c.fillStyle = 'rgba(8,14,40,0.88)'; c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.roundRect(bx.x - bx.w / 2 - 10, bx.y - bx.h / 2 - 7, bx.w + 20, bx.h + 14, 12); c.fill(); c.stroke(); c.restore(); M.drawEx(g, c, key); }
    // the answer in the middle of the region
    if (S.areaAt && t > S.areaAt) { const [x, y] = S.areaPos(), k = M.ease((t - S.areaAt) / 0.3), n = fnode(S.ans), sz = 30, m = M.lay(n, sz);
      c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(6,14,40,0.7)'; c.beginPath(); c.roundRect(x - m.w / 2 - 8, y - (m.a + m.d) / 2 - 6, m.w + 16, m.a + m.d + 12, 10); c.fill();
      c.shadowColor = AUR; c.shadowBlur = 12; M.draw(c, n, x - m.w / 2, y + (m.a - m.d) / 2, sz, { t, col: '#ffffff' }); c.restore(); }
    // the penguin on the snow watches, points while work is shown, and cheers
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', PX, PY - hopK * 18, 0.72, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'penguin', PX, PY, 0.72);
    // the ∫ with its limits, and the bracket's limits once the antiderivative is written
    const ib = M.box(g, 'int'); if (ib) { intSign(c, ib.x - 12, L1Y - S.topS * 1.2, L1Y + S.topS * 0.42, 22, INK, 3.6); label(c, String(b), ib.x + 25, L1Y - S.topS * 1.1, 22, '#ffffff'); label(c, '0', ib.x - 9, L1Y + S.topS * 0.66, 22, '#ffffff'); }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work');
    const lb = S.work && !S.noLim && S.limBox(); if (lb && t > (S.limAt || 0)) { const lit = S.limHi && t - S.limHi < 2.5 * M.pace(g); label(c, String(b), lb.hx + 2, lb.hy + 2, 22, lit ? GOLD : '#ffffff'); label(c, '0', lb.lx + 2, lb.ly + 8, 22, '#ffffff'); }
    fitAsk(g); M.drawUI(g, c);
  },
});
