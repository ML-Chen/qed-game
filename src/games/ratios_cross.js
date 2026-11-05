// ratios_cross.js — CROSS MULTIPLY! Solve a proportion such as 3/4 = x/12. The player drags along each diagonal of the
// X, in either order and in either direction: 3 onto 12 fills the right side of the line below with 3 · 12 = 36, and
// 4 onto x fills the left side with 4x. Then a tap on 4x divides both sides by 4: x = 9 (and the x above becomes 9).
// Level 0: x is the top right number. Level 1: top or bottom right. Level 2: any of the four places.
// Medium mode: the 3 · 12 product and the division each open the tray.
const M = MK, INK = SCN.ink('glass'), XC = '#c0398a', NC = '#2a7ab0';
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const b = 2 + r(L === 0 ? 3 : 5), a = 1 + r(b - 1), m = 2 + r(L === 0 ? 2 : 3);
  return { vals: [a, b, a * m, b * m], pos: L === 0 ? 2 : L === 1 ? 2 + r(2) : r(4) }; // a/b = c/d; pos is where x is
}
// places 0..3 are a, b, c, d of a/b = c/d; the diagonals are (0, 3) and (1, 2), so a place's partner is 3 − place
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  const tok = i => i === S.pos ? (S.fin ? M.num(S.x, 't' + i, { col: M.GOOD, ...pp('t' + i) }) : M.vr('x', 't' + i, { col: XC })) : M.num(S.vals[i], 't' + i);
  M.place(g, 'eq', M.row(M.frac(tok(0), tok(1)), M.op('=', 'e1'), M.frac(tok(2), tok(3))), 180, 262, 58, { col: INK });
  let line;
  if (S.fin) line = M.row(M.vr('x', 'xf', { col: XC }), M.op('=', 'e2'), M.num(S.x, 'xv', { col: M.GOOD, ...pp('xv') }));
  else {
    const L = S.dx ? Object.assign(M.row(M.num(S.k, null, { col: NC }), M.vr('x', null, { col: XC })), { id: 'kx', ...pp('kx') }) : M.slot('L', { w: 62 });
    const R = S.dn === 'prod' ? Object.assign(M.row(M.num(S.o[0]), M.op('·'), M.num(S.o[1])), { id: 'pr', ...pp('pr') }) : S.dn ? M.num(S.P, 'P', pp('P')) : M.slot('R', { w: 62 });
    line = M.row(L, M.op('=', 'e2'), R);
  }
  M.place(g, 'work', line, 180, 360, 42, { col: INK });
}

MG.add({
  id: 'ratios_cross', stage: 'ratios', cmd: 'CROSS MULTIPLY!', hint: 'drag', time: 9, mood: 'bright', winText: 'Solved!', hold: 1.4,
  card: {
    title: 'Cross multiplying', ref: 'Grade 7', kind: 'Ratios and percents',
    text: 'A proportion says that two ratios are equal, such as 3/4 = x/12. Cross multiplying is a quick way to find the missing number.\n\nMultiply along each diagonal of the X: the top of each fraction times the bottom of the other. The two products are equal. For 3/4 = x/12 that gives 4 · x = 3 · 12, so 4x = 36. Divide both sides by 4 to get x = 9.\n\nThis works because you may multiply both sides of an equation by the same number. Multiplying both sides of 3/4 = x/12 by 4 and by 12 clears both fractions, and what is left is the two diagonal products.',
    note: 'If a/b = c/d, then a · d = b · c. Multiply along both diagonals, then divide to find the unknown.',
    ask: 'Solve 2/5 = x/15. Solve 3/x = 6/8.',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.pops = {};
    const q = 3 - S.pos, others = [0, 1, 2, 3].filter(i => i !== S.pos && i !== q);
    S.q = q; S.others = others; S.k = S.vals[q]; S.o = others.map(i => S.vals[i]); S.P = S.o[0] * S.o[1]; S.x = S.vals[S.pos];
    build(g); M.inert(g, ['e1', 'e2', 'xf']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffd45a', '#fff', '#f08ac0'], 10, 120); };
    M.play(g, {
      moves(g) {
        const out = [], t = i => 't' + i;
        // the diagonal through x: drag x onto its partner (or back): the left side becomes k·x
        if (!S.dx) out.push({ drag: [t(S.pos), t(S.q)], to: [t(S.q), t(S.pos)], busy: 0.1, then(g, a, b) { if (a === b) return; S.dx = g.t; S.pops.kx = g.t; g.sfx('whoosh'); build(g); burst('kx'); } });
        // the other diagonal: drag one number onto the other: the right side becomes their product
        if (!S.dn) out.push({ drag: [t(S.others[0]), t(S.others[1])], to: [t(S.others[1]), t(S.others[0])], busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: S.P, wrong: [S.o[0] + S.o[1], S.P + S.o[0], S.P - S.o[1], S.k * S.o[0]] },
          then(g) { S.dn = 'prod'; S.dnAt = g.t; S.pops.pr = g.t; g.sfx('whoosh'); build(g); },
          resolve(g) { S.dn = 'done'; S.pops.P = g.t; g.sfx('coin'); build(g); burst('P'); } });
        // both sides written: tap k·x to divide both sides by k
        if (S.dx && S.dn === 'done' && !S.fin) out.push({ tap: 'kx', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.x, wrong: [S.P - S.k, S.P * S.k, S.k, S.x + 1, S.x - 1] },
          then() {}, resolve(g) { S.fin = g.t; S.pops.xv = g.t; S.pops['t' + S.pos] = g.t; g.sfx('coin'); build(g); burst('xv'); burst('t' + S.pos); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'night', panel: 'glass', panelY: 300, panelH: 220, host: 'fox', hostX: 290, hostY: 600, hostS: 1.4 });
    // each diagonal that has been multiplied gets a glowing stroke of the X
    const diag = (i, j, col, at) => { const a = M.box(g, 't' + i), b = M.box(g, 't' + j); if (!a || !b || at == null) return; const k = M.ease((t - at) / 0.25);
      c.save(); c.strokeStyle = col; c.globalAlpha = 0.5; c.lineWidth = 7; c.lineCap = 'round'; c.shadowColor = col; c.shadowBlur = 10;
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(M.lerp(a.x, b.x, k), M.lerp(a.y, b.y, k)); c.stroke(); c.restore(); };
    diag(S.pos, S.q, XC, S.dx || null); diag(S.others[0], S.others[1], NC, S.dnAt ?? null);
    M.drawEx(g, c, 'eq'); M.drawEx(g, c, 'work'); M.drawUI(g, c);
  },
});
