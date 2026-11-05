// fractions_simplify.js — SIMPLIFY! Reduce a fraction to simplest form by dividing its top and bottom by a common factor.
// 12/18: the player drags the numerator onto the denominator (or the other way), and a common factor appears in both
// places: (12 ÷ 6)/(18 ÷ 6). Then the player taps each division (either order): 2/3. If a common factor is still left,
// the player drags again. A chocolate bar under the fraction shows the same amount: 12 of 18 squares, grouped in sixes,
// becomes 2 of 3 bigger pieces.
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
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.f = 0; S.qn = null; S.qd = null; S.n0 = S.n; S.d0 = S.d;
    // the factor of each step: level 2 splits the common factor into two steps
    const G = gcd(S.n, S.d), divs = []; for (let f = 2; f < G; f++) if (G % f === 0) divs.push(f);
    S.plan = g.level === 2 && divs.length ? [divs[Math.floor(g.rand() * divs.length)]] : [];
    const build = () => {
      const part = (v, q, id) => S.f ? (q != null ? M.num(q, id + 'q', { pop: g.t }) : M.row(M.num(v), M.op('÷'), M.num(S.f, null, { col: FAC }))) : M.num(v, id);
      const top = part(S.n, S.qn, 'n'), bot = part(S.d, S.qd, 'd'); if (S.f) { if (S.qn == null) top.id = 'tn'; if (S.qd == null) bot.id = 'td'; }
      M.place(g, 'ex', M.frac(top, bot, 'fr'), 180, Y_EX, SZ, { col: INK }); M.inert(g, ['fr']);
    };
    S.build = build; build();
    const nMoves = 3 * (S.plan.length + 1); g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const divTap = (which) => {
      const v = which === 'n' ? S.n : S.d, q = v / S.f;
      return { tap: 't' + which, busy: 0.1, askAt: 0, after: 0.1, ask: { v: q, wrong: [v - S.f, q + 1, v / 2 === q ? q * 2 : v / 2, q - 1].filter(w => w > 0 && Number.isInteger(w)) },
        then(g) { g.sfx('pop'); }, resolve(g) { if (which === 'n') S.qn = q; else S.qd = q; g.sfx('coin');
          if (S.qn != null && S.qd != null) { S.n = S.qn; S.d = S.qd; S.f = 0; S.qn = S.qd = null; S.stepAt = g.t; g.burst(180, Y_EX - 20, ['#ffd27a', '#fff4dc', '#ff9a5a'], 14, 140); g.sfx('ding'); }
          build(); } };
    };
    M.play(g, {
      moves(g) {
        if (!S.f) {
          if (gcd(S.n, S.d) === 1) return [];
          const mv = (from, to) => ({ drag: from, to, busy: 0.1, then(g) { S.f = S.plan.length ? S.plan.shift() : gcd(S.n, S.d); S.facAt = g.t; g.sfx('whoosh'); build(); } });
          return [mv('n', 'd'), mv('d', 'n')];
        }
        return [S.qn == null ? divTap('n') : null, S.qd == null ? divTap('d') : null].filter(Boolean);
      },
      area(g) { return !S.f ? ['n', 'd'] : [S.qn == null ? 'tn' : 'td']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'forest', panel: PANEL, panelY: 300, panelH: 250, host: 'beaver', hostX: 74, hostY: 594, hostS: 1.35 });
    // a chocolate bar of S.d squares, S.n of them still wrapped in gold; the factor's groups get a bold outline
    const n = S.d, w = 288, x0 = 180 - w / 2, cw = w / n, h = 30, y0 = Y_BAR - h / 2, pk = S.stepAt != null ? M.clamp((t - S.stepAt) / 0.3, 0, 1) : 1;
    c.save(); c.fillStyle = 'rgba(30,15,5,0.35)'; c.fillRect(x0 + 3, y0 + 5, w, h);
    for (let i = 0; i < n; i++) { const on = i < S.n; c.fillStyle = on ? (i % 2 ? '#e8b040' : '#f4c450') : (i % 2 ? '#6a3a1e' : '#7a4424'); c.fillRect(x0 + i * cw, y0, cw, h); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(x0 + i * cw + 1, y0 + 2, cw - 2, 4); }
    c.strokeStyle = 'rgba(40,20,5,0.6)'; c.lineWidth = 1; for (let i = 1; i < n; i++) { c.beginPath(); c.moveTo(x0 + i * cw, y0); c.lineTo(x0 + i * cw, y0 + h); c.stroke(); }
    if (S.f) { c.strokeStyle = FAC; c.lineWidth = 3; for (let i = 0; i < n; i += S.f) c.strokeRect(x0 + i * cw + 1.5, y0 + 1.5, cw * S.f - 3, h - 3); }
    c.strokeStyle = `rgba(255,240,200,${0.9 * (1 - pk) + 0.3})`; c.lineWidth = 2; c.strokeRect(x0, y0, w, h); c.restore();
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
