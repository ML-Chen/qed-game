// fractions_simplify.js — SIMPLIFY! Reduce a fraction to simplest form by dividing its top and bottom by a common factor.
// 12/18, and every step is acted out (show your work):
//   1. Drag the numerator onto the denominator (or the other way): both are circled, a "÷ 6" writes itself beside the
//      top and beside the bottom, and the chocolate bar under the fraction is outlined in groups of 6 squares.
//   2. Tap each "÷ 6" (or its number; either order): the note slides into the number, which rolls down to 12 ÷ 6 = 2.
//      Once both are divided, the lines inside each group of the bar melt away: 12 of 18 squares become 2 of 3 bigger
//      pieces, the same amount.
// If a common factor is still left, the player drags again. The beaver points while the work is shown and hops on
// every landing.
// Level 0: small fractions, one step. Level 1: bigger fractions, one step. Level 2: two steps (24/36: ÷ 2, then ÷ 6);
// the first factor is any proper common factor, the second is whatever is left. Medium mode: each quotient is picked.
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), FAC = '#ffd27a', Y_EX = 298, Y_BAR = 392, SZ = 74;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), base = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5]];
  for (;;) {
    const [p, q] = base[r(base.length)], k = L === 0 ? [2, 3][r(2)] : L === 1 ? [4, 5, 6][r(3)] : [4, 6, 8, 9, 10, 12][r(6)];
    if (q * k > (L === 2 ? 48 : 30) || q * k < 6) continue;
    return { n: p * k, d: q * k, k };
  }
}

MG.add({
  id: 'simplify', stage: 'fractions', cmd: 'SIMPLIFY!', hint: 'drag', time: 8, mood: 'bright', winText: 'Simplified!', hold: 1.4,
  card: {
    title: 'Simplifying fractions', ref: 'Grade 4', kind: 'Fractions',
    text: 'A fraction is in simplest form when its numerator (the top number) and its denominator (the bottom number) have no common factor except 1. A common factor is a number that divides both of them exactly.\n\nTo simplify a fraction, divide its top and its bottom by a common factor. For example, 6 divides both 12 and 18, so 12/18 = (12 ÷ 6)/(18 ÷ 6) = 2/3. You can also go in steps: dividing 24/36 by 2 gives 12/18, and dividing that by 6 gives 2/3. Stop when no common factor is left.\n\nThis works because dividing the top and the bottom by the same number joins the small pieces into bigger equal pieces. You get fewer, bigger pieces, but the same amount.',
    note: 'Divide the numerator and the denominator by the same common factor. Repeat until their only common factor is 1.',
    ask: 'Simplify 8/12. Simplify 15/25.',
  },
  init(g) {
    const S = g.s, MKs = M.setup(g), T = M.pace(g); Object.assign(S, pick(g)); S.f = 0; S.n0 = S.n; S.d0 = S.d;
    // the factor of each step: level 2 splits the common factor into two steps
    const G = gcd(S.n, S.d), divs = []; for (let f = 2; f < G; f++) if (G % f === 0) divs.push(f);
    S.plan = g.level === 2 && divs.length ? [divs[Math.floor(g.rand() * divs.length)]] : [];
    // the same number nodes are kept for the whole game, so they roll over instead of popping
    S.nn = M.num(S.n, 'n'); S.dd = M.num(S.d, 'd'); S.fr = M.frac(S.nn, S.dd, 'fr');
    const relay = () => M.place(g, 'ex', S.fr, 180, Y_EX, SZ, { col: INK }); MKs.relay = relay; relay(); M.inert(g, ['fr']);
    const hop = (g, e) => { MKs.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    S.left = {}; // which ÷ notes are still waiting: { n: true, d: true }
    const nMoves = 3 * (S.plan.length + 1); g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const divTap = (which) => {
      const v = which === 'n' ? S.n : S.d, q = v / S.f, num = which === 'n' ? S.nn : S.dd, key = 'x' + which;
      return { tap: ['t' + which, which], busy: 0.1, askAt: 0.35 * T, after: 0.75 * T, ask: { v: q, wrong: [v - S.f, q + 1, v / 2 === q ? q * 2 : v / 2, q - 1].filter(w => w > 0 && Number.isInteger(w)) },
        then(g) { S.left[which] = false; M.show(g, 0.35 * T); S.point = true; hop(g, 'think'); g.sfx('tap');
          M.indicate(g, 't' + which, { dur: 0.35 * T, sc: 1.25 }); M.indicate(g, num, { dur: 0.35 * T, sc: 1.15, col: FAC, delay: 0.05 * T }); },
        resolve(g) { M.show(g, 0.75 * T);
          // the ÷ f slides into the number, and the number rolls down to the quotient
          const bn = M.box(g, which), bx = M.box(g, 't' + which), nd = g.s.mk.ex[key] && g.s.mk.ex[key].node; if (bn && bx && nd) M.tween(g, nd, { dx: bn.x - bx.x, alpha: 0, sc: 0.6 }, 0.36 * T);
          M.roll(g, num, q, { delay: 0.2 * T, dur: 0.38 * T });
          M.at(g, [[0.4 * T, g => { delete g.s.mk.ex[key]; g.sfx('coin'); hop(g); M.sparkle(g, which, { n: 8, cols: ['#ffd27a', '#fff4dc'] }); if (which === 'n') S.n = q; else S.d = q; }],
            [0.5 * T, g => { if (S.left.n === false && S.left.d === false) { // both divided: the bar's small squares melt into bigger pieces
              S.merge = { from: S.d0x, f: S.f, t0: g.t, dur: 0.4 * T }; S.f = 0; S.left = {}; S.point = false;
              g.burst(180, Y_EX - 20, ['#ffd27a', '#fff4dc', '#ff9a5a'], 14, 140); g.sfx('ding'); hop(g, gcd(S.n, S.d) === 1 ? 'laugh' : 'wow'); } }]]); } };
    };
    M.play(g, {
      moves(g) {
        if (!S.f) {
          if (gcd(S.n, S.d) === 1) return [];
          const mv = (from, to) => ({ drag: from, to, busy: 0.1, then(g) {
            S.f = S.plan.length ? S.plan.shift() : gcd(S.n, S.d); S.facAt = g.t; S.facDur = 0.5 * T; S.d0x = S.d; S.left = { n: true, d: true };
            M.show(g, 0.75 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh');
            M.circle(g, ['n', 'd'], { dur: 0.55 * T, col: FAC });
            // a ÷ f note writes itself beside the top and beside the bottom
            ['n', 'd'].forEach((p, j) => { const b = M.box(g, p), key = 'x' + p, nd = M.row(M.op('÷'), M.num(S.f)); nd.id = 't' + p;
              M.place(g, key, nd, b.x + b.w / 2 + 40, b.y + (b.h * 0.3), 40, { col: FAC }); M.writeIn(g, nd, { dur: 0.3 * T, delay: (0.15 + j * 0.18) * T });
              M.at(g, [[(0.15 + j * 0.18) * T, g => g.sfx('tap')]]); });
            M.at(g, [[0.6 * T, g => hop(g)]]); } });
          return [mv('n', 'd'), mv('d', 'n')];
        }
        if (M.showing(g)) return [];
        return [S.left.n ? divTap('n') : null, S.left.d ? divTap('d') : null].filter(Boolean);
      },
      area(g) { return !S.f ? ['n', 'd'] : [S.left.n ? 'tn' : 'td']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, mk = S.mk;
    SCN.std(g, c, { scene: 'forest', panel: PANEL, panelY: 300, panelH: 250 });
    const hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'beaver', 74, 594 - hopK * 24, 1.35, { t, pose, expr }); else SCN.host(g, c, 'beaver', 74, 594, 1.35);
    // a chocolate bar, S.n of its pieces still wrapped in gold. While a factor is shown its groups get a bold outline
    // that draws itself in; when both divisions land, the lines inside each group melt away.
    const w = 288, x0 = 180 - w / 2, h = 30, y0 = Y_BAR - h / 2, mg = S.merge, mk2 = mg ? M.clamp((t - mg.t0) / mg.dur, 0, 1) : 1;
    const n = mg && mk2 < 1 ? mg.from : S.d0x && S.f ? S.d0x : S.d, gold = Math.round(n * S.n0 / S.d0), cw = w / n;
    c.save(); c.fillStyle = 'rgba(30,15,5,0.35)'; c.fillRect(x0 + 3, y0 + 5, w, h);
    for (let i = 0; i < n; i++) { const on = i < gold; c.fillStyle = on ? (i % 2 ? '#e8b040' : '#f4c450') : (i % 2 ? '#6a3a1e' : '#7a4424'); c.fillRect(x0 + i * cw, y0, cw, h); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(x0 + i * cw + 1, y0 + 2, cw - 2, 4); }
    c.strokeStyle = 'rgba(40,20,5,0.6)'; c.lineWidth = 1;
    for (let i = 1; i < n; i++) { const inner = mg && mk2 < 1 && i % mg.f !== 0; c.globalAlpha = inner ? 1 - mk2 : 1; c.beginPath(); c.moveTo(x0 + i * cw, y0); c.lineTo(x0 + i * cw, y0 + h); c.stroke(); }
    c.globalAlpha = 1;
    const fac = S.f || (mg && mk2 < 1 ? mg.f : 0);
    if (fac) { const dk = S.f ? M.easeIO((t - S.facAt) / S.facDur) : 1 - mk2; c.strokeStyle = FAC; c.lineWidth = 3; c.shadowColor = FAC; c.shadowBlur = 8;
      for (let i = 0; i < n; i += fac) { const k = M.clamp(dk * (n / fac) - i / fac, 0, 1); if (k <= 0) continue; c.globalAlpha = S.f ? 1 : dk; c.strokeRect(x0 + i * cw + 1.5, y0 + 1.5, (cw * fac - 3) * (S.f ? M.ease(k) : 1), h - 3); } }
    c.globalAlpha = 1; c.shadowBlur = 0;
    if (mg && mk2 < 1) { c.fillStyle = `rgba(255,240,200,${0.4 * Math.sin(mk2 * Math.PI)})`; c.fillRect(x0, y0, w, h); }
    c.strokeStyle = 'rgba(255,240,200,0.4)'; c.lineWidth = 2; c.strokeRect(x0, y0, w, h); c.restore();
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'xn'); M.drawEx(g, c, 'xd');
    M.drawUI(g, c);
  },
});
