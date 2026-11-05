// linalg_inverse.js — INVERSE MATRIX! The inverse of [a b; c d] is 1/(ad − bc) · [d −b; −c a], on a recipe page in a kitchen.
// The page shows A = [a b; c d], and under it the working line A⁻¹ = [slot] [a b; c d], a copy of A that the player
// rewrites in place. Beneath sit the "ingredients": two minus signs and the fraction 1/det A.
// Moves (any order), each acted out by itself (show your work):
//   drag a onto d (or d onto a): both are circled, then they spin half a turn round the middle and trade places;
//   drag a minus sign onto b or c: it flies over and the number rolls to its opposite (3 -> −3);
//   drag 1/det A into the slot: its bar draws itself and its parts write in;
//   then tap det A: "det A = a·d − b·c = ?" writes itself under A while the two diagonals of A are circled and struck
//   through in green and purple; the value flies into the fraction. 1/1 is crossed out, 1/−1 becomes −1, and a
//   negative det sends its minus out in front of the fraction.
// Wrong moves (they only wobble): swapping a with b or c, a minus sign dropped on a or d, tapping the entries of A.
// Level 0: det A = 1. Level 1: det A from 2 to 5. Level 2: negative entries, and det A may be negative.
// Medium mode: the det note stops at "= ?" and a tray opens (wrong tiles: ad + bc, bc − ad, ab − cd).
const M = MK, INK = SCN.ink('paper'), C1 = '#c8402a', C2 = '#2a7ab0', DG = '#2f9a5a', DP = '#9a4ab8', OY = 228, NY = 274, WY = 344, IY = 420, HX = 64, HY = 600;
const fac = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let n = 0; n < 500; n++) {
    const a = r(L === 2 ? -4 : 1, 5), b = r(L === 2 ? -3 : 1, 4), c = r(L === 2 ? -3 : 1, 4), d = r(L === 2 ? -4 : 1, 5), det = a * d - b * c;
    if ([a, b, c, d].includes(0) || new Set([a, b, c, d]).size < 3) continue;
    if (L === 0 ? det === 1 : L === 1 ? det >= 2 && det <= 5 : det !== 0 && Math.abs(det) <= 6 && det !== 1 && [a, b, c, d].some(v => v < 0)) return { a, b, c, d, det };
  }
  return { a: 3, b: 1, c: 5, d: 2, det: 1 };
}

MG.add({
  id: 'linalg_inverse', stage: 'linalg', cmd: 'INVERSE MATRIX!', hint: 'drag', time: 8, mood: 'bright', winText: 'Inverted!', hold: 1.4,
  card: {
    title: 'The inverse of a 2 × 2 matrix', ref: 'College', kind: 'Linear algebra',
    text: 'The inverse of a matrix A is written A⁻¹. It undoes what A does: A⁻¹ times A is the identity matrix, which has 1s on the diagonal and 0s elsewhere.\n\nFor a 2 × 2 matrix with rows a b and c d, there is a recipe. Swap a and d. Put a minus sign in front of b and c. Then multiply by 1 over the determinant, det A = ad − bc.\n\nFor example, with rows 3 1 and 5 2, det A = 3 · 2 − 1 · 5 = 1. So A⁻¹ has rows 2 −1 and −5 3. Check the top left of A⁻¹A: 2 · 3 + (−1) · 5 = 1.\n\nThe recipe works because the swapped matrix times A gives det A times the identity, and dividing by det A leaves the identity. If det A = 0, there is no inverse.',
    note: 'For rows a b and c d: swap a and d, change the signs of b and c, and divide everything by ad − bc.',
    ask: 'What is the inverse of the matrix with rows 2 1 and 1 1? Why does the matrix with rows 2 4 and 1 2 have no inverse?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g);
    S.orig = M.row(M.vr('A', 'nA'), M.op('=', 'eq0'), M.mat([[M.num(p.a, 'oa'), M.num(p.b, 'ob')], [M.num(p.c, 'oc'), M.num(p.d, 'od')]], 'om'));
    S.cells = { a: M.num(p.a, 'wa'), b: M.num(p.b, 'wb'), c: M.num(p.c, 'wc'), d: M.num(p.d, 'wd') };
    // the slot is as wide as 1/det A from the start, so the line never changes width when the fraction comes and goes
    S.slot = M.slot('front', { w: M.lay(M.frac(M.num(1), M.row(M.txt('det'), M.gap(5), M.vr('A'))), 38).w, col: C2 }); S.front = true;
    S.wl = [M.vr('A', 'nA2'), M.num(-1, 'inv1'), M.op('=', 'eq1')];
    // the kit glides every node that moves, containers included, so a symbol inside a moving matrix would travel twice
    // (or three times) as far. The line is rebuilt with fresh containers round the same symbols: only the symbols glide.
    S.build = () => { const [A, e, q] = S.wl; S.work = M.row(M.sup(A, e), q, S.front ? [S.slot, M.gap(4)] : null, M.mat([[S.cells.a, S.cells.b], [S.cells.c, S.cells.d]], 'wm')); };
    S.build();
    S.ing = M.row(M.op('-', 'm1', { col: C1 }), M.gap(26), M.op('-', 'm2', { col: C1 }), M.gap(34), M.frac(M.num(1), M.row(M.txt('det', 'dt'), M.gap(5), M.vr('A')), 'inv', { col: C2 }));
    S.relay = () => { S.build(); M.place(g, 'orig', S.orig, 180, OY, 26, { col: INK }); M.place(g, 'work', S.work, 180, WY, 38, { col: INK }); M.place(g, 'ing', S.ing, 180, IY, 30, { col: INK }); };
    S.relay(); M.inert(g, ['nA', 'eq0', 'om', 'nA2', 'inv1', 'eq1', 'wm', 'front']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    const hop = (e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // a minus sign flies from its dish onto b (or c), and the number rolls over to its opposite: 3 -> −3, −2 -> 2
    const neg = (k, src) => ({ drag: src, to: 'w' + k, busy: 0.1, then(g) {
      S['neg' + k] = 1; const n = S.cells[k], from = { ...M.box(g, src) }; M.node(g, src).hide = true; M.show(g, 0.75 * T); S.point = true; g.sfx('swoosh');
      M.light(g, n, { col: C1 }); M.circle(g, n, { col: C1, dur: 0.45 * T });
      M.fly(g, { node: M.op('-', null, { col: C1 }), from: [from.x, from.y], to: 'w' + k, dur: 0.3 * T, arc: -50, s0: 30, s1: 40,
        then(g) { M.roll(g, n, -p[k], { dur: 0.3 * T }); n.col = C1; S.relay(); M.sparkle(g, n, { n: 8, cols: [C1, '#fff', '#ffd45a'] }); g.sfx('pop'); hop();
          M.at(g, [[0.35 * T, g => { M.unlight(g, n); S.point = false; }]]); } }); } });
    // a and d spin round the middle of the matrix and trade places
    const swap = (from) => ({ drag: from, to: from === 'wa' ? 'wd' : 'wa', busy: 0.12, then(g) {
      S.swapped = 1; const A = S.cells.a, D = S.cells.d; M.show(g, 0.95 * T); S.point = true; hop('think');
      M.circle(g, ['wa', 'wd'], { col: '#e8a020', dur: 0.4 * T }); M.light(g, A, { col: '#e8a020' }); M.light(g, D, { col: '#e8a020' });
      M.at(g, [[0.25 * T, g => { const ba = { ...M.box(g, 'wa') }, bd = { ...M.box(g, 'wd') }, cx = (ba.x + bd.x) / 2, cy = (ba.y + bd.y) / 2, r = Math.hypot(ba.x - cx, ba.y - cy) * 1.08, a0 = Math.atan2(ba.y - cy, ba.x - cx);
          A.alpha = D.alpha = 0; g.sfx('whoosh');
          const na = M.num(p.a, null, { col: '#e8a020' }), nd = M.num(p.d, null, { col: '#e8a020' }), SP = 0.5 * T;
          M.anim(g, { dur: SP, draw(c, g, k) { const e = M.easeIO(k), th = a0 + e * Math.PI, sz = 38 * (1 + Math.sin(k * Math.PI) * 0.25);
            // a faint ring shows the spin
            c.globalAlpha = 0.35 * Math.sin(k * Math.PI); c.strokeStyle = '#e8a020'; c.lineWidth = 2.5; c.setLineDash([4, 6]); c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
            for (const [n, ang] of [[na, th], [nd, th + Math.PI]]) { const m = M.lay(n, sz), x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r; c.shadowColor = 'rgba(232,160,32,0.8)'; c.shadowBlur = 12; M.draw(c, n, x - m.w / 2, y + (m.a - m.d) / 2, sz, { t: g.t }); } } });
          M.at(g, [[SP, g => { [A.v, D.v] = [D.v, A.v]; A.alpha = D.alpha = 1; A.pop = D.pop = g.t; S.relay(); M.sparkle(g, 'wa', { n: 6 }); M.sparkle(g, 'wd', { n: 6 }); g.sfx('pop'); hop(); }],
            [SP + 0.15 * T, g => { M.unlight(g, A); M.unlight(g, D); S.point = false; }]]); }]]); } });
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.swapped) out.push(swap('wa'), swap('wd'));
        const free = ['m1', 'm2'].filter(id => !M.node(g, id).hide);
        for (const k of ['b', 'c']) if (!S['neg' + k]) for (const id of free) out.push(neg(k, id));
        // 1/det A drops into the slot: its bar draws itself and its parts write in
        if (!S.placed) out.push({ drag: 'inv', to: 'front', reach: 90, busy: 0.1, then(g) {
          S.placed = 1; M.node(g, 'inv').hide = true; M.show(g, 0.6 * T);
          const one = M.num(1, 'nume'), den = M.row(M.txt('det', 'den'), M.gap(5), M.vr('A', 'denA'));
          S.slot.fill = M.frac(one, den, 'invf', { col: C2, bar: { t0: g.t, dur: 0.3 * T } }); S.relay(); g.sfx('swoosh');
          M.writeIn(g, one, { delay: 0.15 * T, dur: 0.2 * T }); M.writeIn(g, den, { delay: 0.25 * T, dur: 0.3 * T }); M.sparkle(g, 'invf', { delay: 0.5 * T, n: 8, cols: [C2, '#fff'] }); M.at(g, [[0.5 * T, g => hop()]]); } });
        // det A = ad − bc is worked out right under A: the diagonal, then the other diagonal
        else if (!S.tapped) out.push({ tap: ['den', 'denA'], busy: 0.1, askAt: 1.15 * T, after: 1.25 * T,
          ask: { v: p.det, wrong: [p.a * p.d + p.b * p.c, p.b * p.c - p.a * p.d, p.a * p.b - p.c * p.d] },
          then(g) { S.tapped = 1; M.show(g, 1.15 * T); S.point = true; hop('think');
            const o1 = { col: DG }, o2 = { col: DP }; S.qv = M.slot('qv', { w: 30, col: C2 });
            const g1 = M.row(M.txt('det'), M.gap(4), M.vr('A'), M.op('=')), g2 = M.row(fac(p.a, o1), M.op('·', null, o1), fac(p.d, o1)), g3 = M.row(M.op('-'), fac(p.b, o2), M.op('·', null, o2), fac(p.c, o2)), g4 = M.row(M.op('='), M.op('', null), M.gap(-0.44 * 22), S.qv);
            S.note = M.row(g1, g2, g3, g4); let sz = 22; do { M.place(g, 'note', S.note, 180, NY, sz, { col: INK }); sz -= 1; } while (S.note._m.w > 316 && sz > 14);
            M.inert(g, ['qv']); M.indicate(g, 'invf', { col: C2, sc: 1.12, dur: 0.35 * T });
            M.writeIn(g, g1, { dur: 0.25 * T }); M.writeIn(g, g2, { delay: 0.3 * T, dur: 0.25 * T }); M.writeIn(g, g3, { delay: 0.65 * T, dur: 0.3 * T }); M.writeIn(g, g4, { delay: 0.95 * T, dur: 0.15 * T });
            M.at(g, [[0.25 * T, g => { M.circle(g, ['oa', 'od'], { col: DG, dur: 0.45 * T }); M.light(g, 'oa', { col: DG }); M.light(g, 'od', { col: DG }); S.diag = { t0: g.t, col: DG, ids: ['oa', 'od'] }; g.sfx('tap'); }],
              [0.6 * T, g => { M.circle(g, ['ob', 'oc'], { col: DP, dur: 0.45 * T }); M.light(g, 'ob', { col: DP }); M.light(g, 'oc', { col: DP }); S.diag2 = { t0: g.t, col: DP, ids: ['ob', 'oc'] }; g.sfx('tap', { p: 1.2 }); }]]); },
          resolve(g) { M.show(g, 1.25 * T); const v = M.num(p.det, 'qd', { col: C2 }); S.qv.fill = v; M.place(g, 'note', S.note, 180, NY, S.note._m && M.box(g, 'qv') ? M.box(g, 'qv').s : 22, { col: INK }); M.writeIn(g, v, { dur: 0.18 * T }); M.indicate(g, v, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding');
            M.at(g, [[0.3 * T, g => { const from = { ...M.box(g, 'qd') }; v.alpha = 0;
                for (const id of ['oa', 'ob', 'oc', 'od']) M.unlight(g, id); S.diag = S.diag2 = null;
                for (const id of ['den', 'denA']) M.tween(g, id, { alpha: 0 }, 0.2 * T); // det A makes room for its value (faded leaves leave no ghost)
                M.fly(g, { node: M.num(p.det, null, { col: C2 }), from: [from.x, from.y], to: 'den', dur: 0.35 * T, arc: -30, s0: from.s, s1: 31,
                  then(g) { // det A becomes the number: 1 / det
                    S.one = M.num(1, 'nume'); S.dn = M.num(p.det, 'dn', { col: C2, _born: -1, pop: g.t }); S.slot.fill = M.frac(S.one, S.dn, 'invf', { col: C2 }); S.relay(); M.sparkle(g, 'dn', { n: 8, cols: [C2, '#fff'] }); g.sfx('coin'); hop();
                    M.tween(g, S.note, { alpha: 0 }, 0.3 * T); } }); }],
              [0.95 * T, g => { // tidy up: 1/1 goes away, 1/−1 is −1, and 1/−3 sends its minus out in front
                delete g.s.mk.ex.note; S.point = false;
                if (p.det === 1) { M.strike(g, 'invf', { dur: 0.15 * T, col: C1 }); M.tween(g, 'invf', { alpha: 0 }, 0.15 * T, { delay: 0.12 * T }); M.at(g, [[0.28 * T, g => { S.front = false; S.relay(); }]]); }
                else if (p.det === -1) { M.strike(g, 'invf', { dur: 0.15 * T, col: C1 }); M.tween(g, 'invf', { alpha: 0 }, 0.15 * T, { delay: 0.12 * T });
                  M.at(g, [[0.28 * T, g => { S.slot.fill = M.num(-1, 'invf', { col: C2, _born: -1, pop: g.t }); S.relay(); M.sparkle(g, 'invf', { n: 6, cols: [C2, '#fff'] }); }]]); }
                else if (p.det < 0) { M.roll(g, S.dn, -p.det, { dur: 0.25 * T }); S.slot.fill = M.row(M.op('-', 'fm', { col: C2 }), M.frac(S.one, S.dn, 'invf', { col: C2 })); S.relay(); M.indicate(g, 'fm', { col: C1, dur: 0.35 * T, delay: 0.1 * T }); }
                const b = M.box(g, 'wm'); if (b) g.burst(b.x, b.y, [C1, C2, '#ffd45a'], 14, 140); hop('laugh'); }]]); } });
        return out;
      },
      area(g) { return !S.swapped ? ['wa', 'wd'] : !S.negb ? ['wb'] : !S.negc ? ['wc'] : !S.placed ? ['inv'] : ['den']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', panelY: 318, panelH: 250 });
    // the rabbit points at the recipe while the work is shown, and hops when a step lands
    const K = S.mk, t = g.t, hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', HX, HY - hopK * 24, 1.25, { t, pose, expr }); else SCN.host(g, c, 'rabbit', HX, HY, 1.25);
    // the diagonals of A being multiplied: a stroke draws itself through each pair
    for (const D of [S.diag, S.diag2]) { if (!D) continue; const a = M.box(g, D.ids[0]), b = M.box(g, D.ids[1]); if (!a || !b) continue; const k = M.easeIO((t - D.t0) / (0.3 * M.pace(g)));
      c.save(); c.strokeStyle = D.col; c.globalAlpha = 0.6; c.lineWidth = 3; c.lineCap = 'round'; const x0 = a.x + (a.x < b.x ? -9 : 9), y0 = a.y - 9; c.beginPath(); c.moveTo(x0, y0); c.lineTo(M.lerp(x0, b.x + (a.x < b.x ? 9 : -9), k), M.lerp(y0, b.y + 9, k)); c.stroke(); c.restore(); }
    // the ingredients sit in little dishes on the page
    for (const id of ['m1', 'm2', 'inv']) { const b = M.box(g, id), n = M.node(g, id); if (!b || !n || n.hide) continue; c.save(); c.fillStyle = id === 'inv' ? 'rgba(42,122,176,0.12)' : 'rgba(200,64,42,0.12)'; c.strokeStyle = id === 'inv' ? 'rgba(42,122,176,0.5)' : 'rgba(200,64,42,0.5)'; c.lineWidth = 2; c.beginPath(); c.ellipse(b.x, b.y + 2, Math.max(b.w, 30) / 2 + 10, b.h / 2 + 8, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'orig'); M.drawEx(g, c, 'note'); M.drawEx(g, c, 'work'); M.drawEx(g, c, 'ing');
    M.drawUI(g, c);
  },
});
