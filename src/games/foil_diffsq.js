// foil_diffsq.js — DIFF OF SQ! Factor a difference of two squares: x² − k² = (x + k)(x − k).
// The player taps x² to write it as x · x and taps k² to write it as k · k (either order). Then the player drags one
// square root (an x, then a k, in either order) onto the answer line: it drops into the matching place in both brackets.
// Show your work: tapping a square circles it and writes the note "? · ? = 9" under it; the two boxes fill with 3 and 3
// (the tray asks for the root in medium mode), and the two 3s fly up to replace the 9 as 3 · 3. Dragging a root sends
// two copies arcing into both brackets, one each. When both brackets are full, the check writes itself under them:
// = x² − 3x + 3x − 9; the −3x and +3x are crossed out (they cancel), and the original line glows: it matches.
// Level 0: x² − k² with k from 2 to 5. Level 1: k from 4 to 9. Level 2: a²x² − k², such as 4x² − 9 = (2x + 3)(2x − 3).
// Medium mode: each square root is picked from the tray.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), XC = '#2a64b0', KC = '#c03a5a', TOPY = 252, NOTEY = 297, ANSY = 344, CHKY = 380, HX = 76, HY = 588;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { a: 1, k: 2 + r(4) };
  if (L === 1) return { a: 1, k: 4 + r(6) };
  const a = 2 + r(2); let k; do k = 1 + r(6); while (k % a === 0); return { a, k }; // a and k share no factor, so the answer is fully factored
}
const root = (a, id, col) => { const n = a === 1 ? M.vr('x', id) : M.row(M.num(a), M.vr('x')); if (a !== 1) n.id = id; n.col = col; if (n.items) n.items.forEach(q => q.col = col); return n; };
const dots = (p, q) => M.row(p, M.op('·'), q);
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
// the square a²x² as a fresh node (for the check line)
const square = a => a === 1 ? M.sup(M.vr('x'), M.num(2)) : M.row(M.num(a * a), M.sup(M.vr('x'), M.num(2)));
// a·k·x as a fresh node, coloured
const kx = (v, col) => { const r = M.row(M.num(v), M.vr('x')); r.items.forEach(q => q.col = col); return r; };

MG.add({
  id: 'diffsq', stage: 'foil', cmd: 'DIFF OF SQ!', hint: 'tap', time: 9, winText: 'Factored!', hold: 1.4,
  card: {
    title: 'Difference of squares', ref: 'Algebra 1', kind: 'Algebra',
    text: 'A square is a number times itself: 9 is a square because 9 = 3 · 3, and x² = x · x. A difference is what you get when you subtract.\n\nWhen one square is subtracted from another, the expression factors into two brackets: one with a plus sign and one with a minus sign. The rule is a² − b² = (a + b)(a − b).\n\nFor example, x² − 9 = x · x − 3 · 3, so it factors as (x + 3)(x − 3).\n\nWhy does it work? Multiply the brackets back out: (x + 3)(x − 3) = x² − 3x + 3x − 9. The −3x and the +3x cancel, and only x² − 9 is left.',
    note: 'Write each square as something times itself. Put the two square roots in both brackets, once with + and once with −: a² − b² = (a + b)(a − b).',
    ask: 'Factor x² − 25. Factor 9x² − 4.',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, k } = S;
    S.sq = a === 1 ? M.sup(M.vr('x'), M.num(2), 'sq') : M.row(M.num(a * a), M.sup(M.vr('x'), M.num(2))); S.sq.id = 'sq';
    S.kk = M.num(k * k, 'kk');
    S.top = M.row(S.sq, M.op('-', 'mi'), S.kk); S.top.id = 'topx';
    S.slots = ['a1', 'b1', 'a2', 'b2'].map(id => M.slot(id));
    const [a1, b1, a2, b2] = S.slots;
    S.ans = M.row(M.op('=', 'eq'), M.gap(4), M.paren(M.row(a1, M.op('+'), b1), 'p1'), M.paren(M.row(a2, M.op('-'), b2), 'p2'));
    const place = () => { M.place(g, 'top', S.top, 180, TOPY, a > 1 ? 44 : 52, { col: INK }); M.place(g, 'ans', S.ans, 180, ANSY, 34, { col: INK }); };
    S.relay = place; place();
    M.inert(g, ['mi', 'eq', 'p1', 'p2', 'a1', 'a2', 'b1', 'b2', 'topx', 'ns1', 'ns2', 'cm1', 'cm2']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    // open a square: circle it, write "? · ? = 9" under it; resolve fills the boxes and the roots fly up as 3 · 3
    const open = (which) => { const isX = which === 'x', id = isX ? 'sq' : 'kk', col = isX ? XC : KC;
      const rootNode = (nid) => isX ? root(a, nid, col) : M.num(k, nid, { col });
      const mv = { tap: id, busy: 0.1, askAt: 0.5 * M.pace(g), after: 0.8 * M.pace(g),
        ...(isX ? (a > 1 ? { ask: { v: root(a), wrong: [M.row(M.num(a * a), M.vr('x')), M.vr('x'), M.row(M.num(a + 1), M.vr('x'))] } } : {}) : { ask: { v: k, wrong: [k + 1, k - 1, k * k, k * 2] } }),
        then(g) { const T = M.pace(g); S[isX ? 'xOpen' : 'kOpen'] = 1; M.show(g, 0.5 * T); hop(g, 'think'); g.sfx('tap');
          M.circle(g, id, { col, dur: 0.45 * T }); M.indicate(g, id, { col, dur: 0.35 * T, sc: 1.15 });
          const s1 = M.num('?', 'ns1'), s2 = M.num('?', 'ns2'); // the two unknown roots, as question marks
          const nd = M.row(s1, M.op('·'), s2, M.op('='), isX ? square(a) : M.num(k * k)); S.nt = { s1, s2, nd, key: 'note' + which };
          const b = M.box(g, id), w = M.lay(nd, 24).w; M.place(g, S.nt.key, nd, M.clamp(b.x, 24 + w / 2, 336 - w / 2), NOTEY, 24, { col });
          M.writeIn(g, nd, { delay: 0.1 * T, dur: 0.35 * T });
          if (!mv.ask) M.at(g, [[0.5 * T, g => mv.resolve(g)]]); },
        resolve(g) { const T = M.pace(g), N = S.nt; M.show(g, 0.8 * T); g.sfx('ding');
          // each ? turns into the root (a number rolls over like an odometer; a letter is written in)
          N.f = [0, 2].map((ix, i) => { if (!isX) { M.roll(g, N.nd.items[ix], k, { delay: i * 0.1 * T, dur: 0.22 * T }); return N.nd.items[ix]; }
            const r = rootNode(i ? 'ns2' : 'ns1'); r.col = col; r._born = -1; N.nd.items[ix] = r; M.writeIn(g, r, { delay: i * 0.1 * T, dur: 0.2 * T }); return r; });
          N.f.forEach((r, i) => M.indicate(g, r, { delay: 0.22 * T + i * 0.1 * T, dur: 0.25 * T, sc: 1.3 })); M.relayout(g, N.key);
          M.at(g, [[0.4 * T, g => { // the square on the top line turns into root · root: the two roots fly up from the note
              M.relayout(g, N.key); // where the two roots are in the note
              const p1 = { ...M.box(g, 'ns1') }, p2 = { ...M.box(g, 'ns2') };
              const r1 = rootNode(isX ? 'ra' : 'ka'), r2 = rootNode(isX ? 'rb' : 'kb'); r1.alpha = 0; r2.alpha = 0;
              S[isX ? 'xOpen' : 'kOpen'] = 2; S.top.items[isX ? 0 : 2] = dots(r1, r2); place(); g.sfx('swoosh');
              [[p1, r1], [p2, r2]].forEach(([p, r], i) => {
                M.fly(g, { node: rootNode(null), from: [p.x, p.y], to: r.id, delay: i * 0.08 * T, dur: 0.32 * T, arc: 26, s0: 24, col,
                  then(g) { r.alpha = 1; r.pop = g.t; M.sparkle(g, r, { n: 6 }); g.sfx('pop'); if (i) hop(g, 'happy'); } }); });
              N.f.forEach(r => { r.alpha = 0; }); M.tween(g, N.nd, { alpha: 0 }, 0.25 * T, { delay: 0.1 * T }); }],
            [0.8 * T, g => { delete g.s.mk.ex[N.key]; }]]); } };
      return mv; };
    // the check: multiply the brackets back out; the middle terms cancel and the original line is left
    const check = (g) => { const T = M.pace(g), ak = a * k; M.show(g, 1.25 * T); S.point = true;
      const mid1 = M.row(M.op('-'), kx(ak, KC)), mid2 = M.row(M.op('+'), kx(ak, KC)); mid1.id = 'cm1'; mid2.id = 'cm2';
      const nd = M.row(M.op('='), square(a), mid1, mid2, M.op('-'), M.num(k * k)); S.chk = nd;
      M.place(g, 'chk', nd, 180, CHKY, 26, { col: INK }); M.writeIn(g, nd, { dur: 0.45 * T }); g.sfx('swoosh');
      M.at(g, [[0.5 * T, g => { M.indicate(g, 'cm1', { col: KC, dur: 0.25 * T, sc: 1.15 }); M.indicate(g, 'cm2', { col: KC, dur: 0.25 * T, sc: 1.15, delay: 0.05 * T }); }],
        [0.62 * T, g => { M.strike(g, 'cm1', { dur: 0.15 * T }); M.strike(g, 'cm2', { dur: 0.15 * T, delay: 0.08 * T }); g.sfx('tap'); hop(g, 'wow'); }],
        [0.85 * T, g => { M.circle(g, 'topx', { col: '#ffd23a', dur: 0.4 * T }); M.indicate(g, S.top, { dur: 0.35 * T, sc: 1.08, col: '#ffd23a' }); M.sparkle(g, 'topx', { n: 12 }); g.sfx('ding'); hop(g, 'laugh'); }],
        [1.0 * T, g => { M.tween(g, nd, { alpha: 0 }, 0.25 * T); }], [1.25 * T, g => { delete g.s.mk.ex.chk; S.point = false; }]]); };
    // drag a root to the answer line: two copies arc into both brackets
    const drop = (isX) => ({ drag: isX ? ['ra', 'rb'] : ['ka', 'kb'], to: isX ? ['a1', 'a2'] : ['b1', 'b2'], area: [10, ANSY - 50, 350, ANSY + 40], busy: 0.1,
      then(g, from) { const T = M.pace(g), col = isX ? XC : KC, last = isX ? S.kIn : S.xIn; S[isX ? 'xIn' : 'kIn'] = true; M.show(g, 0.6 * T); g.sfx('swoosh'); hop(g, 'think');
        const srcs = isX ? ['ra', 'rb'] : ['ka', 'kb'], sl = isX ? [S.slots[0], S.slots[2]] : [S.slots[1], S.slots[3]];
        srcs.forEach(id => M.indicate(g, id, { col, dur: 0.3 * T, sc: 1.2 }));
        sl.forEach((s, i) => M.fly(g, { node: isX ? root(a, null, col) : M.num(k, null, { col }), from: srcs[i], to: s.id, delay: (0.1 + i * 0.14) * T, dur: 0.38 * T, arc: i ? -50 : -30,
          then(g) { s.fill = isX ? root(a, null, col) : M.num(k, null, { col }); s.fill._born = -1; s.fill.pop = g.t; place(); M.sparkle(g, s.id === 'a1' || s.id === 'b1' ? 'p1' : 'p2', { n: 6, cols: [col, '#fff'] }); g.sfx('pop'); } }));
        if (last) M.at(g, [[0.62 * T, check]]); } });
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.xOpen) out.push(open('x'));
        if (!S.kOpen) out.push(open('k'));
        if (S.xOpen === 2 && !S.xIn) out.push(drop(true));
        if (S.kOpen === 2 && !S.kIn) out.push(drop(false));
        return out;
      },
      area(g) { return S.xOpen !== 2 ? 'sq' : S.kOpen !== 2 ? 'kk' : !S.xIn ? ['ra', 'a1'] : ['ka', 'b1']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s; SCN.std(g, c, { scene: 'snow', panel: PANEL, panelY: 290, panelH: 214 });
    // the penguin points at the board while the work is shown, and hops when a step lands
    const mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && g.t - mk.missAt < 0.7;
    const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', HX, HY - hk * 24, 1.35, { t: g.t, pose, expr }); else SCN.host(g, c, 'penguin', HX, HY, 1.35);
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'ans'); M.drawEx(g, c, 'notex'); M.drawEx(g, c, 'notek'); M.drawEx(g, c, 'chk');
    M.drawUI(g, c);
  },
});
