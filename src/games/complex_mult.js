// complex_mult.js — COMPLEX MULT! (a + bi)(c + di) = ac + adi + bci + bdi² = (ac − bd) + (ad + bc)i.
// On a sheet of paper over a city at sunset. The player drags each term of the first bracket onto each term of the
// second (4 drags, any order, either direction): a coloured arc joins the two terms, they swell, a working note writes
// itself between the lines ("3 · i = 3i"), and the product lifts off the note and lands in its own place on the line
// underneath. Then: tap the i² term (the note reads "i² = −1" and the −1 lands in its place), drag the two i terms
// together (the second slides onto the first, "3i + i = 4i"), and drag the two real numbers together. Any valid order.
// Level 0: (a + i)(c + i). Level 1: (a + bi)(c + di). Level 2: the first bracket has a minus: (a − bi)(c + di).
// Medium mode: the real product ac, the i² term and both sums are picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL);
const COLS = ['#c8402a', '#2a74b0', '#8a3ab0', '#2a8a4a'];
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  for (;;) {
    const a = 1 + r(4), c = 1 + r(4); let b = L === 0 ? 1 : 2 + r(2), d = L === 0 ? 1 : 1 + r(3);
    if (L === 2) b = -b;
    if (a * c - b * d !== 0 && a * d + b * c !== 0 && !(a === c && b === d && L === 0 && g.rand() < 0.6)) return { a, b, c, d };
  }
}
function tint(n, col) { if (!n) return n; n.col = col; for (const ch of [n.base, n.exp, n.inner, ...(n.items || [])]) tint(ch, col); return n; }
// a signed term: kind 0 is a real number, 1 is a multiple of i, 2 a multiple of i²; the first term of a line has no "+"
function term(v, kind, first, id, col) {
  const A = Math.abs(v), I = () => M.vr('i');
  const body = kind === 0 ? [M.num(A)] : [A === 1 ? null : M.num(A), kind === 1 ? I() : M.sup(I(), M.num(2))];
  const r = M.row(first ? (v < 0 ? M.op('-') : null) : M.op(v < 0 ? '-' : '+'), ...body); r.id = id; return col ? tint(r, col) : r;
}
const cnum = (re, im) => M.row(term(re, 0, true), term(im, 1, false)); // re + im·i as a tray tile

MG.add({
  id: 'complex_mult', stage: 'complex', cmd: 'COMPLEX MULT!', hint: 'drag', time: 7, mood: 'bright', winText: 'Nailed it!', hold: 1.4,
  card: {
    title: 'Multiplying complex numbers', ref: 'Algebra 2', kind: 'Complex numbers',
    text: 'A complex number has a real part and an imaginary part, such as 2 + i. Here i is the number whose square is −1.\n\nTo multiply two complex numbers, multiply each part of the first by each part of the second, the same way you multiply two binomials. That makes four products. Then replace i² with −1. Last, add the real numbers together and the multiples of i together.\n\nFor example, (2 + i)(3 + i) = 6 + 2i + 3i + i². Since i² = −1, this is 6 + 2i + 3i − 1, which is 5 + 5i.\n\nThis works because complex numbers follow the same rules as ordinary numbers, such as the distributive law. The only new rule is i² = −1.',
    note: '(a + bi)(c + di) = ac + adi + bci + bdi². Replace i² with −1 to get (ac − bd) + (ad + bc)i.',
    ask: 'What is (1 + i)(1 + i)? What is (3 + 2i)(1 − i)?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = pick(g); Object.assign(S, p); const T = M.pace(g);
    const F = [[p.a, 0], [p.b, 1]], G = [[p.c, 0], [p.d, 1]]; S.F = F; S.G = G;
    const br = (T, k) => M.paren(M.row(M.num(T[0][0], k + '0'), M.gap(2), term(T[1][0], 1, false, k + '1', INK)), 'p' + k);
    S.top = M.row(br(F, 'f'), br(G, 's'));
    S.prod = [0, 1, 2, 3].map(k => { const i = k >> 1, j = k & 1, v = F[i][0] * G[j][0], kind = F[i][1] + G[j][1]; const n = term(v, kind, k === 0, 'q' + k, COLS[k]); n.hide = true; return { i, j, v, kind, n }; });
    const relay = () => { S.ans = M.row(M.op('=', 'eq'), M.gap(6), S.prod.flatMap((q, k) => q.gone ? [] : [k ? M.gap(4) : null, q.n])); S.ans._born = -1; M.place(g, 'ans', S.ans, 180, 352, 32, { col: INK }); };
    relay(); M.place(g, 'top', S.top, 180, 268, 44, { col: INK });
    M.inert(g, ['pf', 'ps', 'eq', 'nt']);
    g.dur *= (2.6 + 1.05 * 7) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const set = (k, v, kind) => { const q = S.prod[k]; q.v = v; q.kind = kind; q.n = term(v, kind, k === 0, 'q' + k, COLS[k]); q.n._born = -1; };
    // a factor as it is written in a working note: 3, i, 2i, (−2i)
    const fac = (v, kind) => kind === 0 ? M.num(v) : v < 0 ? M.paren(term(v, 1, true)) : term(v, 1, true);
    // The working of every computation, in two beats. work(): the parts light up and a note writes itself between the two
    // lines ("3 · i = "), its result still hidden. done(): the result writes itself, lifts off the note and lands in place.
    const work = (g, o) => { S.point = true; hop(g, 'think'); for (const id of o.lit || []) M.indicate(g, id, { dur: 0.4 * T, sc: 1.18, col: o.col });
      S.res = o.val; S.res.alpha = 0; S.note = M.row(o.lhs, M.op('='), S.res); tint(S.note, o.col);
      const m = M.lay(S.note, 26), x = M.clamp(o.x, m.w / 2 + 30, 330 - m.w / 2); M.place(g, 'nt', S.note, x, 316, 26, { col: o.col }); M.writeIn(g, S.note, { dur: 0.3 * T, delay: 0.05 * T }); g.sfx('tap'); };
    const done = (g, o) => { M.show(g, 0.8 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.18 * T }); g.sfx('ding');
      if (o.leave) for (const id of o.leave) M.tween(g, id, { alpha: 0, sc: 0.7 }, 0.25 * T, { delay: 0.3 * T });
      M.at(g, [[0.3 * T, g => { const b = { ...M.box(g, 'nt') }, m = M.lay(S.note, 26), rw = M.lay(S.res, 26).w, from = [b.x + m.w / 2 - rw / 2, b.y];
          M.fly(g, { node: o.fly, from, to: o.to, dur: 0.3 * T, arc: -14, s0: 26, s1: 32, col: o.col }); M.tween(g, S.note, { alpha: 0 }, 0.25 * T); }],
        [0.62 * T, g => { o.land(g); relay(); M.sparkle(g, o.to, { n: 9, cols: [o.col, '#fff', '#ffd970'] }); g.sfx('coin'); hop(g); }],
        [0.8 * T, g => { delete S.mk.ex.nt; S.point = false; }]]); };
    M.play(g, {
      moves(g) {
        const out = [], rev = [], P = S.prod;
        // the four products, each term of the first bracket onto each term of the second (either direction)
        P.forEach((q, k) => {
          if (q.started) return;
          const ask = k === 0 ? { v: q.v, wrong: [S.a + S.c, q.v + 1, -q.v] } : null;
          const o = () => ({ lit: ['f' + q.i, 's' + q.j], col: COLS[k], lhs: M.row(fac(F[q.i][0], q.i), M.op('·'), fac(G[q.j][0], q.j)), val: term(q.v, q.kind, true),
            fly: term(q.v, q.kind, k === 0, null, COLS[k]), to: 'q' + k, land(g) { q.done = true; q.n.hide = false; q.n._born = -1; q.n.pop = g.t; }, x: 0 });
          const mk = (from, to) => { const go = o(); return { drag: from, to, busy: 0.1, askAt: 0.42 * T, after: 0.8 * T,
            then(g) { q.started = true; (S.arcT = S.arcT || {})[k] = g.t; M.show(g, 0.42 * T); const A = M.box(g, 'f' + q.i), B = M.box(g, 's' + q.j); go.x = A && B ? (A.x + B.x) / 2 : 180;
              work(g, go); if (!ask) M.at(g, [[0.42 * T, g => done(g, go)]]); },
            ...(ask ? { ask, resolve(g) { done(g, go); } } : {}) }; };
          out.push(mk('f' + q.i, 's' + q.j)); rev.push(mk('s' + q.j, 'f' + q.i));
        });
        out.push(...rev);
        // i² = −1: the i² term becomes a real number
        if (P[3].done && P[3].kind === 2) { const v = P[3].v, go = { lit: ['q3'], col: COLS[3], lhs: term(v, 2, true), val: term(-v, 0, true), fly: term(-v, 0, false, null, COLS[3]), to: 'q3', leave: ['q3'],
            land(g) { set(3, -v, 0); S.prod[3].n.pop = g.t; } };
          out.push({ tap: 'q3', busy: 0.1, askAt: 0.42 * T, after: 0.8 * T, ask: { v: term(-v, 0, true), wrong: [term(v, 0, true), term(-v, 1, true), term(v * 2, 0, true)] },
            then(g) { M.show(g, 0.42 * T); go.x = M.box(g, 'q3').x; work(g, go); M.circle(g, 'q3', { dur: 0.4 * T, col: '#ffd970' }); },
            resolve(g) { done(g, go); } }); }
        // like terms: the two multiples of i add, and the two real numbers add
        const combine = (ka, kb, kind) => { const A = P[ka], B = P[kb], sum = A.v + B.v;
          const go = { lit: ['q' + ka, 'q' + kb], col: COLS[ka], lhs: M.row(term(A.v, kind, true), term(B.v, kind, false)), val: term(sum, kind, true), fly: term(sum, kind, ka === 0, null, COLS[ka]), to: 'q' + ka,
            leave: ['q' + ka], land(g) { B.gone = true; set(ka, sum, kind); S.prod[ka].n.pop = g.t; } };
          const wrong = kind ? [term(A.v * B.v, 1, true), term(sum, 2, true), term(A.v - B.v, 1, true)] : [term(A.v - B.v, 0, true), term(A.v * B.v, 0, true), term(sum + 1, 0, true)];
          const mk = (a, b) => ({ drag: a, to: b, busy: 0.1, askAt: 0.42 * T, after: 0.8 * T, ask: { v: term(sum, kind, true), wrong },
            then(g) { M.show(g, 0.42 * T); const ba = M.box(g, 'q' + ka), bb = M.box(g, 'q' + kb); go.x = (ba.x + bb.x) / 2; work(g, go); M.circle(g, ['q' + ka, 'q' + kb], { dur: 0.4 * T, col: COLS[ka] });
              // the second term slides over onto the first, the way like terms gather
              M.tween(g, B.n, { dx: ba.x - bb.x, alpha: 0.35 }, 0.35 * T, { delay: 0.05 * T }); },
            resolve(g) { M.tween(g, B.n, { alpha: 0 }, 0.2 * T); done(g, go); } });
          out.push(mk('q' + kb, 'q' + ka), mk('q' + ka, 'q' + kb)); };
        if (P[1].done && P[2].done && !P[2].gone) combine(1, 2, 1);
        if (P[0].done && P[3].done && P[3].kind === 0 && !P[3].gone) combine(0, 3, 0);
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || [m.drag, m.to]) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t; SCN.std(g, c, { scene: 'city', panel: PANEL, panelY: 300, panelH: 196 });
    // the fox points at the paper while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 290, 600 - hopK * 24, 1.3, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', 290, 600, 1.3);
    // one coloured arc per product, from a term of the first bracket to a term of the second
    const HH = [30, 46, 16, 30];
    for (const [k, t0] of Object.entries(S.arcT || {})) {
      const q = S.prod[k], A = M.box(g, 'f' + q.i), B = M.box(g, 's' + q.j); if (!A || !B) continue;
      const e = M.ease((g.t - t0) / (0.25 * M.pace(g))), y0 = Math.min(A.y - A.h / 2, B.y - B.h / 2) - 4, x0 = A.x + (q.j - 0.5) * 6, x1 = B.x + (q.i - 0.5) * 6;
      c.save(); c.strokeStyle = COLS[k]; c.globalAlpha = 0.8; c.lineWidth = 3.5; c.lineCap = 'round';
      c.beginPath(); for (let u = 0; u <= e + 1e-6; u += 0.05) { const x = M.lerp(x0, x1, u), y = y0 - Math.sin(u * Math.PI) * HH[k]; u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
    }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'ans'); M.drawEx(g, c, 'nt');
    M.drawUI(g, c);
  },
});
