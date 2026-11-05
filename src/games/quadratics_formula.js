// quadratics_formula.js — QUAD FORMULA! Solve ax² + bx + c = 0 with x = (−b ± √(b² − 4ac)) / 2a.
// A chalkboard in a library. Under the equation a chalk key reads "a = 1  b = −5  c = 6", and under that the formula.
// Every move acts out its working (show your work):
//   1-3. Drag a number from the key onto its letter (any order): every copy of that letter is circled, a copy of the
//        number flies into each one (in brackets when negative) and the letter gives way to it.
//   4. Tap the square root: "(−5)² = 25" writes itself above b², then "4 · 1 · 6 = 24" above 4ac, each value drops
//      into place, 24 slides into 25, which rolls over to 1; then "√1 = 1" writes itself beside it, the root sign
//      folds away and the 1 flies into its place.
//   5. Tap ±: −(−5) merges into 5 and 2 · 1 into 2, the ± becomes + and a second copy of the fraction writes itself
//      with −, then each top adds up (the odometer rolls) and each fraction divides down to an answer: x = 3 or x = 2.
// Level 0: a = 1, two positive roots. Level 1: a = 1, roots of either sign. Level 2: a = 2.
// Medium mode: the value of b² − 4ac and the pair of answers are picked from the tray.
// The font has no √, so the radical sign is drawn over the radicand's box.
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), LET = '#ffc8a0', NEW = '#ffe68a', WK = '#9ad8ff', FY = 344;
// fresh(node): the copy of an expression that is actually placed. The kit glides every node whose box moved, wrappers
// too, and a wrapper's glide adds to its symbols' own glides, so rows get new wrappers (views) at every placement and
// only symbols glide. Brackets keep their identity; what is inside them rides along as views.
const STRUCT = ['items', 'base', 'exp', 'inner', 'n', 'd', 'fill', 'rows'], OWN = new Set([...STRUCT, 'k', '_pid', '_glide', '_gx', '_gy', '_m', '_born']);
const DELEG = ['id', 'v', 'col', 'hl', 'hlc', 'sc', 'alpha', 'pop', 'strike', 'write', 'bar', 'roll', 'mark', 'dx', 'dy', 'hide', 'small', 'br', 'w'];
const hid = (o, k, v) => Object.defineProperty(o, k, { value: v, writable: true, configurable: true, enumerable: false });
function view(n, deep, born) {
  if (!n || typeof n !== 'object') return n; const c = { k: n.k };
  for (const k of new Set([...Object.keys(n), ...DELEG])) if (!OWN.has(k)) Object.defineProperty(c, k, { get: () => n[k], set: v => { n[k] = v; }, enumerable: true, configurable: true });
  const sub = x => deep ? view(x, true, born) : fresh(x);
  if (n.items) c.items = n.items.map(sub); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) if (n[k]) c[k] = sub(n[k]); if (n.rows) c.rows = n.rows.map(r => r.map(sub));
  if (deep && born) c._born = -1; return c;
}
function walkAll(n, f) { if (!n || typeof n !== 'object') return; f(n); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) walkAll(n[k], f); (n.items || []).forEach(q => walkAll(q, f)); }
function fresh(n) {
  if (!n || typeof n !== 'object' || /^(num|var|txt|op|gap|mat)$/.test(n.k)) return n;
  if (n.k === 'paren' || n.k === 'slot') { const key = n.k === 'paren' ? 'inner' : 'fill';
    if (!n._vw || n[key] !== n._vw) hid(n, '_mdl', n[key]);
    if (n._vw) walkAll(n._vw, q => Object.defineProperty(q, 'alpha', { value: 0, writable: true, configurable: true }));
    const v = view(n._mdl, true, !!n._seen || n._born === -1); hid(n, '_vw', v); hid(n, '_seen', true); n[key] = v; return n; }
  return view(n, false);
}
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const p = L === 0 ? r(1, 6) : L === 1 ? r(-6, 6) : r(-4, 4), q = L === 0 ? r(1, 6) : L === 1 ? r(-6, 6) : r(-4, 4), a = L === 2 ? 2 : 1;
    if (!p || !q || p === q || p + q === 0) continue;
    const b = -a * (p + q), c = a * p * q, D = b * b - 4 * a * c;
    if (Math.abs(c) > 36 || D > 144) continue;
    return { a, b, c, D, rt: Math.sqrt(D), hi: Math.max(p, q), lo: Math.min(p, q) };
  }
}
function poly(a, b, c) { return M.row(a === 1 ? null : M.num(a), M.sup(M.vr('x'), M.num(2)), M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? null : M.num(Math.abs(b)), M.vr('x'), M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c)), M.op('='), M.num(0)); }
const sn = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
// inside the formula a negative number gets typed brackets, so every symbol glides on its own when the line changes
const snT = (v, o) => v < 0 ? M.row(M.txt('(', null, o), M.num(v, null, o), M.txt(')', null, o)) : M.num(v, null, o);
const gone = n => walkAll(n, q => { q.alpha = 0; if (q._mdl) walkAll(q._mdl, w => { w.alpha = 0; }); });
const born = n => { walkAll(n, q => { q._born = -1; }); return n; };
const R = (id, ...items) => { const r = M.row(...items); if (id) r.id = id; return r; };
// the radical sign over a box (x0 = left edge of the radicand)
function radical(c, b, col, lw, k = 1) { if (!b || k <= 0) return; const x0 = b.x - b.w / 2 - 2, top = b.y - b.h / 2 - 4, bot = b.y + b.h / 2 + 2, mid = (top + bot) / 2 + 4;
  c.save(); c.globalAlpha *= k; c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(x0 - 15, mid); c.lineTo(x0 - 11, mid - 2); c.lineTo(x0 - 6, bot); c.lineTo(x0 - 1, top); c.lineTo(x0 + b.w + 4, top); c.stroke(); c.restore(); }

MG.add({
  id: 'quadratics_formula', stage: 'quadratics', cmd: 'QUAD FORMULA!', hint: 'drag', time: 10, mood: 'night', winText: 'Solved!', hold: 1.4,
  card: {
    title: 'The quadratic formula', ref: 'Algebra 1–2', kind: 'Algebra',
    text: 'A quadratic equation has the form ax² + bx + c = 0. Here a is the number in front of x², b is the number in front of x, and c is the number on its own.\n\nThe quadratic formula solves every such equation: x = (−b ± √(b² − 4ac)) / 2a. The sign √ means square root, and ± means "plus or minus", so the formula gives two answers: one with + and one with −.\n\nFor example, x² − 5x + 6 = 0 has a = 1, b = −5 and c = 6. Then b² − 4ac = 25 − 24 = 1, and √1 = 1. So x = (5 + 1) / 2 = 3 or x = (5 − 1) / 2 = 2.\n\nThe formula comes from completing the square on ax² + bx + c = 0, so it works even when the quadratic will not factor.',
    note: 'x = (−b ± √(b² − 4ac)) / 2a. Put in a, b and c, work out b² − 4ac under the square root, then use + for one answer and − for the other.',
    ask: 'Solve x² − 7x + 10 = 0 with the formula. Solve x² + 2x − 8 = 0.',
  },
  init(g) {
    const S = g.s; M.setup(g); const Q = S.q = pick(g), T = S.T = M.pace(g), o = { col: NEW };
    M.place(g, 'prob', poly(Q.a, Q.b, Q.c), 180, 222, 32, { col: INK });
    const key = (L, v) => [M.vr(L, null, { col: LET }), M.op('='), M.num(v, 'k' + L, { col: NEW })];
    M.place(g, 'key', M.row(...key('a', Q.a), M.gap(22), ...key('b', Q.b), M.gap(22), ...key('c', Q.c)), 180, 266, 26, { col: INK });
    // the symbols of the formula, kept from step to step so they glide as it changes
    const lt = (L, id) => M.vr(L, id, { col: LET }), ac = 4 * Q.a * Q.c, nb = -Q.b, dn = 2 * Q.a;
    const X = S.X = { x: M.vr('x'), eq: M.op('='), mn: M.op('-'), b1: lt('b', 'sb1'), pm: M.op('±', 'pm'), b2: lt('b', 'sb2'), two: M.num(2), mn2: M.op('-'), four: M.num(4),
      a1: lt('a', 'sa1'), c: lt('c', 'sc'), d2: M.num(2), a2: lt('a', 'sa2'), dA1: M.op('·'), dC: M.op('·'), dA2: M.op('·'),
      B1: snT(Q.b, o), B2: snT(Q.b, o), A1: snT(Q.a, o), A2: snT(Q.a, o), C: snT(Q.c, o),
      V1: M.num(Q.b * Q.b, 'V1', { col: WK }), V2: M.num(ac, 'V2', { col: WK }), A5: M.num(Q.hi, 'A5', { col: NEW }), A6: M.num(Q.lo, 'A6', { col: NEW }), RT: M.num(Q.rt, 'RT', { col: NEW }), NT: M.num(nb, 'NT', { col: NEW }), DN: M.num(dn, 'DN', { col: NEW }),
      NT2: M.num(nb, 'NT2', { col: NEW }), mi: M.op('-', 'mi', { col: NEW }), RT2: M.num(Q.rt, null, { col: NEW }), DN2: M.num(dn, 'DN2', { col: NEW }), or: M.txt('or', 'orr'), x2: M.vr('x'), eq2: M.op('=') };
    S.f = {}; S.st = 'sub'; // 'sub', 'b2' (b² worked out), 'v' (both terms), 'D' (b² − 4ac worked out), 'rt' (the root taken)
    const rad = () => { if (S.st === 'rt') return X.RT; if (S.st === 'D') return R('rad', X.V1);
      const t1 = S.st === 'b2' || S.st === 'v' ? X.V1 : M.sup(S.f.b ? X.B2 : X.b2, X.two);
      const t2 = S.st === 'v' ? [X.V2] : [X.four, S.f.a ? [X.dA1, X.A1] : X.a1, S.f.c ? [X.dC, X.C] : X.c];
      return R('rad', R('t1', t1), X.mn2, R('t2', ...t2)); };
    const line = () => {
      if (S.ans) return M.row(X.x, X.eq, S.ans[0], M.gap(14), X.or, M.gap(14), X.x2, X.eq2, S.ans[1]);
      const top = S.summed ? X.NT : R('top', S.nt ? X.NT : [X.mn, S.f.b ? X.B1 : X.b1], X.pm, M.gap(4), rad()), den = S.nt ? X.DN : R('den', X.d2, S.f.a ? [X.dA2, X.A2] : X.a2);
      if (!S.split) return M.row(X.x, X.eq, M.frac(top, den, 'fr'));
      return M.row(X.x, X.eq, S.q1 || M.frac(top, den, 'f1'), M.gap(14), X.or, M.gap(14), X.x2, X.eq2, S.q2 || M.frac(S.summed ? X.NT2 : R('top2', X.NT2, X.mi, X.RT2), X.DN2, 'f2'));
    };
    // one font size for every form (sized for the widest, with every number put in), so it never rescales
    S.f = { a: true, b: true, c: true }; let z = 34; while (z > 18 && M.lay(line(), z).w > 300) z--;
    S.nt = S.split = true; S.st = 'rt'; while (z > 18 && M.lay(line(), z).w > 320) z--; S.nt = S.split = false; S.st = 'sub'; S.z = z; S.f = {};
    const fit = S.fit = () => M.place(g, 'form', fresh(line()), 180, FY, S.z, { col: INK });
    fit();
    M.place(g, 'keys', M.row(M.gap(14), M.txt('square root', 'k1'), M.gap(18), M.txt('± plus or minus', 'k2')), 180, 396, 13, { col: 'rgba(250,248,238,0.6)' });
    M.inert(g, ['k1', 'k2', 'A5', 'A6', 'V1', 'V2', 'RT', 'NT', 'DN', 'NT2', 'DN2', 'mi', 'orr', 't1', 't2', 'f2', 'top2']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    S.radA = 1;
    const TG = { a: ['sa1', 'sa2'], b: ['sb1', 'sb2'], c: ['sc'] };
    // a number from the key flies into every copy of its letter, and the letters give way to it
    const subst = (L) => ({ drag: 'k' + L, to: TG[L], busy: 0.1, then(g) {
      S.f[L] = 'go'; M.show(g, 0.85 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh'); M.inert(g, ['k' + L]);
      const from = { ...M.box(g, 'k' + L) }, lets = TG[L].map(id => M.node(g, id));
      M.circle(g, TG[L], { col: LET, dur: 0.45 * T }); lets.forEach(n => M.light(g, n, { col: LET })); M.tween(g, 'k' + L, { alpha: 0.35 }, 0.4 * T, { delay: 0.3 * T });
      TG[L].forEach((id, i) => { M.fly(g, { node: sn(Q[L], o), from: [from.x, from.y], to: id, delay: (0.12 + i * 0.1) * T, dur: 0.42 * T, arc: -30, s0: 26, s1: S.z, col: NEW });
        M.tween(g, lets[i], { alpha: 0, sc: 0.5 }, 0.15 * T, { delay: (0.42 + i * 0.1) * T }); });
      M.at(g, [[(0.56 + (TG[L].length - 1) * 0.1) * T, g => { const ns = L === 'a' ? [X.A1, X.A2] : L === 'b' ? [X.B1, X.B2] : [X.C]; ns.forEach(born); if (L !== 'b') { born(X.dA1); born(X.dA2); born(X.dC); }
        S.f[L] = true; fit(); ns.forEach(n => { n.pop = g.t; M.sparkle(g, n, { n: 6, cols: [NEW, '#fff'] }); }); g.sfx('pop'); hop(g); S.point = false; }]]); } });
    M.play(g, {
      moves(g) {
        const out = [];
        for (const L of ['a', 'b', 'c']) if (!S.f[L]) out.push(subst(L));
        if (out.length || ['a', 'b', 'c'].some(L => S.f[L] !== true)) return out;
        // 4. under the square root: b² and 4ac are worked out in notes, then subtracted, then the root is taken
        if (!S.dDone) return [{ tap: ['rad', 't1', 't2'], busy: 0.1, askAt: 1.2 * T, after: 1.55 * T, ask: { v: Q.D, wrong: [Q.b * Q.b + ac, ac - Q.b * Q.b, Q.b * Q.b - 2 * Q.a * Q.c, Q.D + 2] },
          then(g) { S.dDone = true; M.show(g, 1.2 * T); S.point = true; hop(g, 'think'); M.circle(g, 'rad', { col: WK, dur: 0.5 * T }); M.tween(g, g.s.mk.ex.key.node, { alpha: 0 }, 0.4 * T);
            const NS = 20, nt = (id, nd, v, d, land, olds) => { const note = M.row(nd, M.op('='), M.num(v)), w = M.lay(note, NS).w, wv = M.lay(M.num(v), NS).w, b = M.box(g, id), ox = b ? M.clamp(b.x, 14 + w / 2, 346 - w / 2) - b.x : 0;
              M.note(g, { node: note, at: id, off: [ox, -36], s: NS, col: WK, delay: d, write: 0.3 * T, hold: 0.2 * T, fade: 0.2 * T });
              M.at(g, [[d + 0.5 * T, g => { const bb = M.box(g, id); if (!bb) return; M.fly(g, { node: M.num(v), from: [bb.x + ox + w / 2 - wv / 2, bb.y - 36], to: id, dur: 0.26 * T, arc: 10, s0: NS, s1: S.z, col: WK, then: land }); olds.forEach(q => M.tween(g, q, { alpha: 0.15 }, 0.24 * T)); }]]); };
            nt('t1', M.sup(sn(Q.b), M.num(2)), Q.b * Q.b, 0.1 * T, g => { S.st = 'b2'; gone(X.B2); X.two.alpha = 0; fit(); X.V1._born = -1; X.V1.pop = g.t; g.sfx('pop'); hop(g); }, [X.B2, X.two]);
            nt('t2', M.row(M.num(4), M.op('·'), sn(Q.a), M.op('·'), sn(Q.c)), ac, 0.42 * T, g => { S.st = 'v'; for (const q of [X.four, X.dA1, X.A1, X.dC, X.C]) gone(q); fit(); born(X.V2); X.V2.pop = g.t; g.sfx('pop'); hop(g); }, [X.four, X.dA1, X.A1, X.dC, X.C]); },
          resolve(g) { M.show(g, 1.55 * T); M.indicate(g, X.V1, { dur: 0.3 * T, sc: 1.2 }); M.indicate(g, 'V2', { delay: 0.1 * T, dur: 0.3 * T, sc: 1.2 });
            M.at(g, [[0.3 * T, g => { const b0 = M.box(g, 'V1'); for (const n of [X.mn2, X.V2]) { const b = M.box(g, n.id || n); const bb = b || (n === X.mn2 ? null : null); if (bb && b0) M.tween(g, n, { dx: b0.x - bb.x, alpha: 0, sc: 0.5 }, 0.3 * T); else M.tween(g, n, { alpha: 0 }, 0.3 * T); }
                M.roll(g, X.V1, Q.D, { delay: 0.12 * T, dur: 0.32 * T }); g.sfx('ding'); }],
              [0.75 * T, g => { S.st = 'D'; X.V1.col = NEW; fit(); M.indicate(g, X.V1, { dur: 0.3 * T, col: NEW });
                // the square root: "√D = r" writes itself beside it, the root sign folds away and r takes D's place
                const b = M.box(g, 'rad'), w = M.lay(R(null, M.gap(18), M.num(Q.D), M.op('='), M.num(Q.rt)), 22).w;
                S.rn = R('rn', M.gap(18), M.num(Q.D, 'rnD'), M.op('='), M.num(Q.rt, 'rnR')); M.place(g, 'rn', S.rn, b ? M.clamp(b.x + 10, 14 + w / 2, 346 - w / 2) : 180, (b ? b.y : FY) - 38, 22, { col: NEW }); M.writeIn(g, S.rn, { dur: 0.3 * T }); g.sfx('swoosh'); }],
              [1.15 * T, g => { S.radOut = g.t; const f = M.box(g, 'rnR'); X.V1.alpha = 0; S.st = 'rt'; fit(); X.RT.alpha = 0; M.tween(g, S.rn, { alpha: 0 }, 0.2 * T, { delay: 0.1 * T });
                if (f) M.fly(g, { node: M.num(Q.rt), from: [f.x, f.y], to: 'RT', dur: 0.3 * T, arc: 10, s0: 22, s1: S.z, col: NEW, then(g) { X.RT.alpha = 1; X.RT.pop = g.t; M.sparkle(g, 'RT', { n: 8, cols: [NEW, '#fff'] }); g.sfx('coin'); hop(g); delete g.s.mk.ex.rn; S.point = false; } }); }]]); } }];
        // 5. ± splits the formula into its two answers
        if (!S.pmDone) { const pair = (u, v) => M.row(M.num(u), M.op(','), M.num(v));
          return [{ tap: ['pm', 'fr', 'top'], busy: 0.1, askAt: 1.0 * T, after: 1.65 * T, ask: { v: pair(Q.hi, Q.lo), wrong: [pair(-Q.hi, -Q.lo), pair(nb + Q.rt, nb - Q.rt), pair(Q.hi, -Q.lo)] },
            then(g) { S.pmDone = true; M.show(g, 1.0 * T); M.tween(g, g.s.mk.ex.keys.node, { alpha: 0 }, 0.3 * T); S.point = true; hop(g, 'think'); M.circle(g, 'pm', { col: NEW, dur: 0.4 * T }); M.indicate(g, 'pm', { dur: 0.4 * T, sc: 1.4, col: NEW });
              M.at(g, [[0.3 * T, g => { S.nt = true; for (const q of [X.mn, X.B1, X.d2, X.dA2, X.A2]) gone(q); fit(); X.NT.pop = g.t; X.DN.pop = g.t; g.sfx('tap'); }],
                [0.6 * T, g => { S.split = true; X.pm.v = '+'; X.pm.pop = g.t; fit(); const f1 = M.node(g, 'f1'), f2 = M.node(g, 'f2'); born(f2); M.writeIn(g, f2, { dur: 0.35 * T });
                  if (f1) f1.bar = { t0: g.t + 0.3 * T, dur: 0.15 * T }; if (f2) f2.bar = { t0: g.t, dur: 0.3 * T }; g.sfx('swoosh'); hop(g); }]]); },
            resolve(g) { M.show(g, 1.65 * T);
              // each top adds up: the root slides into the first number, which rolls over to the sum
              const sum = [[X.NT, X.pm, X.RT, nb + Q.rt], [X.NT2, X.mi, X.RT2, nb - Q.rt]];
              sum.forEach(([n0, sg, r, v], i) => M.at(g, [[i * 0.15 * T, g => { const b0 = M.box(g, n0.id); for (const q of [sg, r]) { const b = M.box(g, q.id || q._pid); if (b && b0) M.tween(g, q, { dx: b0.x - b.x, alpha: 0, sc: 0.5 }, 0.28 * T); else M.tween(g, q, { alpha: 0 }, 0.28 * T); }
                M.roll(g, n0, v, { delay: 0.1 * T, dur: 0.3 * T }); g.sfx('ding'); }]]));
              // then each fraction divides down to an answer
              // then each fraction divides: "10 ÷ 2 = 5" writes itself under it, and the fraction collapses into the answer
              M.at(g, [[0.5 * T, g => { for (const q of [X.pm, X.RT, X.mi, X.RT2]) q.alpha = 0; S.summed = true; fit(); for (const id of ['f1', 'f2']) { const f = M.node(g, id); if (f) f.bar = { t0: g.t + 0.28 * T, dur: 0.15 * T }; }
                  [['f1', nb + Q.rt, Q.hi], ['f2', nb - Q.rt, Q.lo]].forEach(([id, top, v], i) => M.note(g, { node: M.row(M.num(top), M.op('÷'), M.num(dn), M.op('='), M.num(v)), at: id, off: [0, S.z * 1.25], s: 20, col: NEW, delay: i * 0.1 * T, write: 0.3 * T, hold: 0.3 * T, fade: 0.2 * T })); g.sfx('swoosh'); }],
                [1.1 * T, g => { S.q1 = X.A5; S.q2 = X.A6; X.A5._born = g.t; X.A6._born = g.t; fit(); g.sfx('ding'); }],
                [1.45 * T, g => { M.sparkle(g, 'A5', { n: 10, cols: [NEW, '#fff'] }); M.sparkle(g, 'A6', { n: 10, cols: [NEW, '#fff'] }); g.sfx('chime'); hop(g, 'laugh'); S.point = false; const b = M.box(g, 'form'); if (b) g.burst(b.x, b.y, [NEW, '#fff', '#ffb0a0'], 16, 150); }]]); } }];
        }
        return [];
      },
      area(g) { const L = ['a', 'b', 'c'].find(L => !S.f[L]); return L ? ['k' + L, TG[L][0]] : !S.dDone ? ['rad'] : ['pm']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, T = S.T; SCN.std(g, c, { scene: 'library', panel: PANEL, panelY: 300, panelH: 210 }); host(g, c, 'owl', 296, 600, 1.15, -1);
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'key'); M.drawEx(g, c, 'form'); M.drawEx(g, c, 'keys');
    // the square root sign over the radicand; it folds away once the root is taken
    // (the sign eases to the radicand's new box when the radicand changes width, so it never jumps)
    if (S.st !== 'rt') { const b = M.box(g, 'rad'); if (b) { const r = S.rb; S.rb = r ? { x: M.lerp(r.x, b.x, 0.22), y: M.lerp(r.y, b.y, 0.22), w: M.lerp(r.w, b.w, 0.22), h: M.lerp(r.h, b.h, 0.22) } : { ...b }; radical(c, S.rb, INK, 2.6); } }
    else if (S.radOut != null) { const k = 1 - M.clamp((g.t - S.radOut) / (0.25 * T), 0, 1), b = M.box(g, 'RT'); if (b) radical(c, { ...b, w: b.w * k }, INK, 2.6, k); }
    if (g.s.mk.ex.rn) { M.drawEx(g, c, 'rn'); const n = S.rn; radical(c, M.box(g, 'rnD'), NEW, 2, n.alpha ?? 1); }
    const kb = M.box(g, 'k1'); if (kb) { const x0 = kb.x - kb.w / 2 - 3, top = kb.y - 8, bot = kb.y + 6; c.save(); c.globalAlpha = g.s.mk.ex.keys.node.alpha ?? 1; c.strokeStyle = 'rgba(250,248,238,0.6)'; c.lineWidth = 1.6; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(x0 - 11, kb.y); c.lineTo(x0 - 8, kb.y - 1); c.lineTo(x0 - 5, bot); c.lineTo(x0 - 1, top); c.lineTo(x0 + 4, top); c.stroke(); c.restore(); }
    M.drawUI(g, c);
  },
});
