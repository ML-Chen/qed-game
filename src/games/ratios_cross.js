// ratios_cross.js — CROSS MULTIPLY! Solve a proportion such as 3/4 = x/12. The player drags along each diagonal of the
// X, in either order and in either direction. The working plays by itself (show your work):
//   - x onto 4 (or 4 onto x): a glowing arrow draws itself along that diagonal, both ends swell, a chalk "4 · x" writes
//     itself beside the X and flies into the left side of the line below, where it becomes 4x.
//   - 3 onto 12: the other diagonal's arrow draws itself, "3 · 12" writes itself and flies into the right side; then
//     the product merges into 36 (the tray asks for it in medium mode).
//   - tap 4x: both sides are divided by 4: fraction bars draw themselves under 4x and under 36 and a 4 drops under each;
//     the 4s on the left cancel (crossed out), 36/4 rolls over to 9, and the 9 flies up into the x of the proportion.
// Level 0: x is the top right number. Level 1: top or bottom right. Level 2: any of the four places.
// Medium mode: the product and the quotient are picked from the tray.
const M = MK, INK = SCN.ink('glass'), XC = '#c0398a', NC = '#2a7ab0', CHALK = '#6a3a8a', HX = 290, HY = 600, EQY = 262, WY = 372;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const b = 2 + r(L === 0 ? 3 : 5), a = 1 + r(b - 1), m = 2 + r(L === 0 ? 2 : 3);
  return { vals: [a, b, a * m, b * m], pos: L === 0 ? 2 : L === 1 ? 2 + r(2) : r(4) }; // a/b = c/d; pos is where x is
}
function host(g, c, kind, x, y, s) {
  const S = g.s, K = S.mk, hop = K.lastMove != null && g.t - K.lastMove < 0.35 ? Math.sin((g.t - K.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hop * 24, s, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, kind, x, y, s);
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
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); const T = M.pace(g);
    const q = 3 - S.pos, others = [0, 1, 2, 3].filter(i => i !== S.pos && i !== q);
    S.q = q; S.others = others; S.k = S.vals[q]; S.o = others.map(i => S.vals[i]); S.P = S.o[0] * S.o[1]; S.x = S.vals[S.pos];
    // the proportion: its tokens are kept, so the x can turn into its value at the end
    S.tok = [0, 1, 2, 3].map(i => i === S.pos ? M.vr('x', 't' + i, { col: XC }) : M.num(S.vals[i], 't' + i));
    S.eq = M.row(M.frac(S.tok[0], S.tok[1]), M.op('=', 'e1'), M.frac(S.tok[2], S.tok[3]));
    M.place(g, 'eq', S.eq, 180, EQY, 58, { col: INK });
    // the working line: two slots that fill as each diagonal is multiplied
    S.L = M.slot('L', { w: 62 }); S.R = M.slot('R', { w: 62 }); S.e2 = M.op('=', 'e2');
    S.line = M.row(S.L, S.e2, S.R);
    const relay = () => M.place(g, 'work', S.line, 180, WY, 42, { col: INK }); S.relay = relay; relay();
    M.inert(g, ['e1', 'e2', 'xf', 'den1', 'den2']);
    S.diags = [];
    const hop = (g, e) => { g.s.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const diag = (g, a, b, col) => S.diags.push({ a: 't' + a, b: 't' + b, col, t0: g.t, dur: 0.45 * T });
    const prodNote = (g, a, b, to, then) => M.note(g, { node: M.row(M.num(a), M.op('·'), b === 'x' ? M.vr('x', null, { col: XC }) : M.num(b)), at: [180, 312], s: 28, col: CHALK,
      delay: 0.4 * T, write: 0.3 * T, hold: 0.15 * T, fly: 0.3 * T, to, s1: 38, arc: 14, then });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        const out = [], t = i => 't' + i;
        // the diagonal through x: drag x onto its partner (or back): the left side becomes k·x
        if (!S.dx) out.push({ drag: [t(S.pos), t(S.q)], to: [t(S.q), t(S.pos)], busy: 0.1,
          then(g, a, b) { if (a === b) return; S.dx = g.t; M.show(g, 1.25 * T); S.point = true; hop(g, 'wow'); g.sfx('whoosh');
            diag(g, +a.slice(1), +b.slice(1), XC); M.indicate(g, t(S.pos), { delay: 0.1 * T, dur: 0.35 * T, col: XC }); M.indicate(g, t(S.q), { delay: 0.3 * T, dur: 0.35 * T, col: XC });
            prodNote(g, S.k, 'x', 'L', g => { S.kx = Object.assign(M.row(M.num(S.k, null, { col: NC, _born: -1 }), M.vr('x', null, { col: XC, _born: -1 })), { id: 'kx', pop: g.t, _born: -1 });
              S.line.items[0] = S.kx; relay(); M.sparkle(g, 'kx', { n: 8 }); g.sfx('pop'); hop(g); }); } });
        // the other diagonal: drag one number onto the other: the right side becomes their product
        if (!S.dn) out.push({ drag: [t(S.others[0]), t(S.others[1])], to: [t(S.others[1]), t(S.others[0])], busy: 0.1, askAt: 1.3 * T, after: 0.6 * T,
          ask: { v: S.P, wrong: [S.o[0] + S.o[1], S.P + S.o[0], S.P - S.o[1], S.k * S.o[0]] },
          then(g, a) { S.dn = 'prod'; M.show(g, 1.3 * T); S.point = true; hop(g, 'wow'); g.sfx('whoosh');
            const o = +a.slice(1), p = 3 - o; diag(g, o, p, NC); M.indicate(g, t(o), { delay: 0.1 * T, dur: 0.35 * T, col: '#7ac0ff' }); M.indicate(g, t(p), { delay: 0.3 * T, dur: 0.35 * T, col: '#7ac0ff' });
            prodNote(g, S.o[0], S.o[1], 'R', g => { S.pa = M.num(S.o[0], null, { _born: -1 }); S.pb = M.num(S.o[1], null, { _born: -1 });
              S.pr = Object.assign(M.row(S.pa, M.op('·', null, { _born: -1 }), S.pb), { id: 'pr', _born: -1 }); S.line.items[2] = S.pr; relay(); g.sfx('pop'); hop(g); M.circle(g, 'pr', { dur: 0.4 * T, delay: 0.05 * T }); }); },
          resolve(g) { M.show(g, 0.6 * T); // the product merges into one number
            S.dn = 'done'; S.PN = M.num(S.P, 'P'); S.line.items[2] = S.PN; relay(); M.indicate(g, S.PN, { dur: 0.35 * T, delay: 0.1 * T }); g.sfx('coin'); hop(g, 'happy'); M.sparkle(g, 'P', { delay: 0.1 * T }); } });
        // both sides written: tap k·x to divide both sides by k
        if (S.kx && S.dn === 'done' && !S.fin) out.push({ tap: 'kx', busy: 0.1, askAt: 0.95 * T, after: 1.3 * T, ask: { v: S.x, wrong: [S.P - S.k, S.P * S.k, S.k, S.x + 1, S.x - 1] },
          then(g) { S.fin = true; M.show(g, 0.95 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
            // ÷ k under both sides: the bars draw themselves and a k drops under each
            S.d1 = M.num(S.k, 'den1', { col: NC, alpha: 0 }); S.d2 = M.num(S.k, 'den2', { col: NC, alpha: 0 });
            S.kx.id = null; S.f1 = M.frac(S.kx, S.d1, 'kxf', { bar: { t0: g.t, dur: 0.3 * T } }); S.f2 = M.frac(S.PN, S.d2, 'pf', { bar: { t0: g.t + 0.1 * T, dur: 0.3 * T } });
            S.line.items = [S.f1, S.e2, S.f2]; relay(); M.inert(g, ['kxf', 'pf', 'P']);
            M.at(g, [[0.3 * T, g => { for (const d of [S.d1, S.d2]) { d.alpha = 1; d.pop = g.t; } M.sparkle(g, 'den1', { n: 6 }); M.sparkle(g, 'den2', { n: 6 }); g.sfx('pop'); hop(g); }],
              [0.6 * T, g => { const kn = S.kx.items[0]; M.circle(g, [kn, S.d1], { dur: 0.35 * T, col: '#ff9a8a' }); M.strike(g, kn, { delay: 0.15 * T }); M.strike(g, S.d1, { delay: 0.25 * T }); g.sfx('swoosh'); }]]); },
          resolve(g) { M.show(g, 1.3 * T);
            M.circle(g, 'pf', { dur: 0.35 * T }); M.tween(g, S.kx.items[0], { alpha: 0 }, 0.2 * T); M.tween(g, S.d1, { alpha: 0 }, 0.2 * T); M.tween(g, S.d2, { alpha: 0 }, 0.2 * T, { delay: 0.05 * T });
            M.at(g, [
              [0.25 * T, g => { // k/k cancels to x on the left; P/k rolls over to x's value on the right
                for (const q of [S.kx.items[0], S.d1, S.d2]) q.alpha = 0;
                S.xf = S.kx.items[1]; S.xf.id = 'xf'; S.xv = S.PN; S.xv.id = 'xv'; S.xv.col = M.GOOD; S.line.items = [S.xf, S.e2, S.xv]; relay();
                M.roll(g, S.xv, S.x, { dur: 0.4 * T }); relay(); g.sfx('ding'); hop(g); }],
              [0.65 * T, g => { M.sparkle(g, 'xv'); g.sfx('coin'); const b = M.box(g, 'xv');
                M.fly(g, { node: M.num(S.x, null, { col: M.GOOD }), from: [b.x, b.y], to: 't' + S.pos, dur: 0.4 * T, arc: -30, s0: 42, s1: 48,
                  then(g) { const n = M.num(S.x, 't' + S.pos, { col: M.GOOD, pop: g.t, _born: -1 }); const fr = S.pos < 2 ? S.eq.items[0] : S.eq.items[2];
                    if (S.pos % 2 === 0) fr.n = n; else fr.d = n; M.place(g, 'eq', S.eq, 180, EQY, 58, { col: INK }); hop(g, 'laugh'); g.sfx('sparkle');
                    const bb = M.box(g, 't' + S.pos); if (bb) g.burst(bb.x, bb.y, ['#ffd45a', '#fff', '#f08ac0'], 12, 130); } }); }],
              [1.15 * T, g => { S.point = false; }],
            ]); } });
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
    SCN.std(g, c, { scene: 'night', panel: 'glass', panelY: 306, panelH: 232 });
    host(g, c, 'fox', HX, HY, 1.4);
    // each diagonal that has been multiplied: an arrow draws itself from the dragged number to its partner and stays as
    // a glowing stroke of the X
    for (const d of S.diags) { const a = M.box(g, d.a), b = M.box(g, d.b); if (!a || !b) continue; const k = M.easeIO((t - d.t0) / d.dur);
      const L = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L, x0 = a.x + ux * 16, y0 = a.y + uy * 16, x1 = b.x - ux * 16, y1 = b.y - uy * 16, hx = M.lerp(x0, x1, k), hy = M.lerp(y0, y1, k);
      c.save(); c.strokeStyle = d.col; c.fillStyle = d.col; c.globalAlpha = k < 1 ? 0.85 : 0.5; c.lineWidth = 6; c.lineCap = 'round'; c.shadowColor = d.col; c.shadowBlur = 10;
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(hx, hy); c.stroke();
      c.beginPath(); c.moveTo(hx + ux * 10, hy + uy * 10); c.lineTo(hx - ux * 6 - uy * 9, hy - uy * 6 + ux * 9); c.lineTo(hx - ux * 6 + uy * 9, hy - uy * 6 - ux * 9); c.closePath(); c.fill(); c.restore(); }
    M.drawEx(g, c, 'eq'); M.drawEx(g, c, 'work'); M.drawUI(g, c);
  },
});
