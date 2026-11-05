// limits_factor.js — CANCEL! A limit that gives 0/0 when you substitute: factor the top, cancel the common factor,
// then substitute. lim x→r (x − r)(x + q)/(x − r) = r + q.
// Moves, each acted out (show your work): tap the top: it is circled and rewritten as (x − r)(x + q), one factor written
// after the other, and the factor it shares with the bottom lights up with the bottom. Drag that (x − r) onto the bottom
// (or the bottom onto it): both are circled and joined by an arrow, crossed out, and x + q closes up. Drag the r under
// "lim" into the x: a copy flies in and takes the x's place. Tap r + q: it adds up, and the line becomes the true
// statement lim (original) = r + q.
// Dragging the r into the unfactored fraction is the classic mistake: it wobbles and a red 0/0 flashes.
// Level 0: x² − r² over x − r. Level 1: x² + bx + c over x − r. Level 2: negative r or a factor with a minus.
// Medium mode: the final sum opens the tray once r + q has lit up.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), SUB = '#c0503a', CUT = '#e0503a';
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) { const a = 1 + r(4); return { r: a, q: a }; }
  if (L === 1) { const a = 1 + r(4); let q = 1 + r(5); if (q === a) q++; return { r: a, q }; }
  for (;;) { const a = [-4, -3, -2, -1, 2, 3, 4, 5][r(8)], q = [-3, -2, -1, 1, 2, 3, 4, 5][r(8)]; if (q !== -a && q !== a) return { r: a, q }; }
}
function glyph(c, b, col) {
  if (!b) return; const s = b.s, y = b.y - s * 0.3, x0 = b.x - b.w / 2 + s * 0.1, x1 = b.x + b.w / 2 - s * 0.1; c.save(); c.strokeStyle = col; c.lineWidth = Math.max(2, s * 0.08); c.lineCap = c.lineJoin = 'round';
  c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.moveTo(x1 - s * 0.2, y - s * 0.17); c.lineTo(x1, y); c.lineTo(x1 - s * 0.2, y + s * 0.17); c.stroke(); c.restore();
}
// x + k (or x − |k|) as a row
const lin = (k, id, xid) => Object.assign(M.row(M.vr('x', xid), M.op(k < 0 ? '-' : '+'), M.num(Math.abs(k))), { id });
// x² + bx + c with zero terms left out
function quad(b, c0, id) {
  const it = [M.sup(M.vr('x'), M.num(2))];
  if (b) it.push(M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? M.vr('x') : M.row(M.num(Math.abs(b)), M.vr('x')));
  if (c0) it.push(M.op(c0 < 0 ? '-' : '+'), M.num(Math.abs(c0)));
  return Object.assign(M.row(...it), { id });
}
const Anode = (a, o) => a < 0 ? M.paren(M.num(a, null, o)) : M.num(a, null, o);
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
  const S = g.s, s = S.size, cw = Math.max(M.lay(S.limN, s).w, M.lay(S.subN, s * 0.55).w), x0 = S.x0, y = 300;
  M.place(g, 'lim', S.limN, x0 + cw / 2, y, s, { col: INK }); M.place(g, 'sub', S.subN, x0 + cw / 2, y + s * 0.62, s * 0.55, { col: INK });
  M.place(g, 'main', S.main, x0 + cw + s * 0.25, y, s, { col: INK, left: true });
}

MG.add({
  id: 'limits_factor', stage: 'limits', cmd: 'CANCEL!', hint: 'drag', time: 9, mood: 'bright', winText: 'Cancelled!', hold: 1.4,
  card: {
    title: 'Limits by factoring', ref: 'Calculus', kind: 'Limits',
    text: 'Sometimes putting the number in gives 0/0. For lim x→2 (x² − 4)/(x − 2), putting in 2 gives (4 − 4)/(2 − 2) = 0/0. The expression 0/0 has no value, so it tells you to simplify first. It does not mean the limit is 0.\n\nFactor the top: x² − 4 = (x − 2)(x + 2). Now the top and the bottom share the factor x − 2. While x is close to 2 but not equal to 2, x − 2 is not zero, so you may cancel it. What is left is x + 2.\n\nNow substitute: 2 + 2 = 4. So the limit is 4.\n\nThe graph of (x² − 4)/(x − 2) is the line y = x + 2 with one hole at x = 2. The limit is the height of the hole.',
    note: 'If substituting gives 0/0, factor, cancel the factor that made the zero, then substitute again.',
    ask: 'What is lim x→3 (x² − 9)/(x − 3)? What is lim x→1 (x² + x − 2)/(x − 1)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.st = 0; const R = S.r, Q = S.q, T = M.pace(g);
    S.limN = M.txt('lim', 'lim'); S.aN = M.num(R, 'a', { col: SUB }); S.subN = M.row(M.vr('x'), { k: 'gap', w: 22, id: 'arr' }, S.aN);
    // persistent nodes, so the parts that stay glide from step to step
    S.topQ = quad(Q - R, -R * Q, 'top'); S.den = lin(-R, 'den'); S.f1 = M.paren(lin(-R), 'f1'); S.xr = M.vr('x', 'xr'); S.rest = M.row(S.xr, M.op(Q < 0 ? '-' : '+'), M.num(Math.abs(Q))); S.rest.id = 'rest';
    S.f2 = M.paren(S.rest, 'f2'); S.main = M.row(M.frac(S.topQ, S.den, 'fr'));
    const orig = () => M.frac(quad(Q - R, -R * Q), lin(-R));
    const measure = sz => Math.max(M.lay(M.row(orig(), M.op('='), M.num(R + Q)), sz).w, M.lay(M.frac(M.row(M.paren(lin(-R)), M.paren(lin(Q))), lin(-R)), sz).w) + Math.max(M.lay(S.limN, sz).w, M.lay(S.subN, sz * 0.55).w) + sz * 0.25;
    S.size = Math.min(46, 46 * 312 / measure(46)); S.x0 = 180 - measure(S.size) / 2; build(g); M.inert(g, ['arr', 'res', 'fr']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const cancel = { busy: 0.15, then(g) { S.st = 2; M.show(g, 1.05 * T); react(g, 'think'); S.point = true; g.sfx('sweep');
      // the matching factors are circled and joined by an arrow, crossed out, and the rest closes up
      M.circle(g, 'f1', { col: CUT, dur: 0.45 * T }); M.circle(g, 'den', { col: CUT, dur: 0.45 * T });
      M.arrow(g, 'f1', 'den', { col: CUT, bend: 34, dur: 0.3 * T, linger: 0.2 });
      M.strike(g, S.f1, { delay: 0.3 * T, dur: 0.2 * T, col: CUT }); M.strike(g, S.den, { delay: 0.42 * T, dur: 0.2 * T, col: CUT });
      M.at(g, [[0.32 * T, g => g.sfx('swoosh')], [0.7 * T, g => { M.tween(g, S.f1, { alpha: 0, sc: 0.7 }, 0.16 * T); M.tween(g, S.den, { alpha: 0, sc: 0.7 }, 0.16 * T); }],
        [0.88 * T, g => { hideAll(S.f1); hideAll(S.den); S.main.items = [S.rest]; build(g); g.sfx('pop'); react(g); M.sparkle(g, 'rest', { n: 10, cols: ['#ffb070', '#fff'] }); }],
        [1.0 * T, g => { S.point = false; }]]); } };
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ tap: 'top', busy: 0.1, then(g) { S.st = 1; M.show(g, 1.2 * T); react(g, 'think'); S.point = true;
          // the top is circled and rewritten as two factors, one written after the other; then the factor it shares with
          // the bottom lights up in the bottom's colour
          M.circle(g, 'top', { col: SUB, dur: 0.45 * T }); M.indicate(g, 'top', { dur: 0.4 * T, sc: 1.05, col: SUB }); g.sfx('tap');
          M.at(g, [[0.36 * T, g => M.tween(g, S.topQ, { alpha: 0, sc: 0.8 }, 0.12 * T)],
            [0.46 * T, g => { hideAll(S.topQ); S.main.items[0].n = M.row(S.f1, S.f2); build(g); M.writeIn(g, S.f1, { dur: 0.22 * T }); M.writeIn(g, S.f2, { dur: 0.22 * T, delay: 0.18 * T }); g.sfx('pop'); }],
            [0.98 * T, g => { for (const q of [S.f1, S.den]) M.indicate(g, q, { dur: 0.4 * T, sc: 1.15, col: CUT }); g.sfx('ding'); react(g); }],
            [1.15 * T, g => { S.point = false; }]]); } }];
        if (S.st === 1) return [{ drag: 'f1', to: 'den', reach: 70, ...cancel }, { drag: 'den', to: 'f1', reach: 70, ...cancel }];
        if (S.st === 2) return [{ drag: 'a', to: 'xr', reach: 80, area: [0, 180, 360, 400], busy: 0.1, then(g) { S.st = 3; M.show(g, 0.8 * T); react(g, 'think'); S.point = true; g.sfx('whoosh');
          // now it is safe to substitute: a copy of r flies into the x
          M.circle(g, 'xr', { col: SUB, dur: 0.4 * T }); M.indicate(g, S.aN, { dur: 0.35 * T, col: '#fff' }); M.tween(g, S.xr, { alpha: 0.25 }, 0.3 * T);
          M.fly(g, { node: M.num(R, null, { col: SUB }), from: 'a', to: 'xr', delay: 0.12 * T, dur: 0.42 * T, arc: -60, s1: S.size, col: SUB });
          M.at(g, [[0.56 * T, g => { S.av = Anode(R, { col: SUB }); S.av.id = 'av'; S.av._born = -1; if (S.av.inner) S.av.inner._born = -1; S.av.pop = g.t; S.xr.alpha = 0; S.rest.items[0] = S.av; build(g); M.sparkle(g, 'av', { n: 8, cols: [SUB, '#fff'] }); g.sfx('pop'); react(g); }],
            [0.8 * T, g => { S.point = false; }]]); } }];
        if (S.st === 3 && !S.tapped) return [{ tap: ['rest', ...idsIn(S.rest)], busy: 0.1, ask: { v: R + Q, wrong: [R - Q, Q - R, R * Q, 0, -(R + Q)] }, askAt: 0.4 * T, after: 1.0 * T,
          then(g) { S.tapped = true; M.show(g, 0.4 * T); M.indicate(g, S.rest, { dur: 0.4 * T, sc: 1.1, col: '#e07a1a' }); g.sfx('tap'); },
          resolve(g) { M.show(g, 1.0 * T); S.st = 4;
            M.at(g, [[0, g => { const b = M.box(g, 'rest'); for (const q of S.rest.items) { const qb = q.id ? M.box(g, q.id) : null; M.tween(g, q, { alpha: 0, sc: 0.5, dx: qb && b ? (b.x - qb.x) * 0.6 : 0 }, 0.14 * T); } }],
              [0.12 * T, g => { hideAll(S.rest); S.res = M.num(R + Q, 'res', { col: M.GOOD, pop: g.t }); S.main.items = [S.res]; build(g); g.sfx('coin'); react(g); M.sparkle(g, 'res', { n: 12, cols: ['#ffd45a', '#9ae07a', '#fff'] }); }],
              [0.6 * T, g => { // and the line becomes the true statement about the original limit
                const o = orig(); o._born = g.t; S.main.items = [o, M.op('='), S.res]; build(g); g.sfx('chime'); react(g, 'laugh'); }]]); } }];
        return [];
      },
      area(g) { return [['top'], ['f1', 'den'], ['a', 'xr'], ['rest']][S.st] || null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = g.s.mk;
    SCN.std(g, c, { scene: 'kitchen', panel: PANEL, panelY: 300, panelH: 190 });
    // the beaver points at the problem while the work is shown, and hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'beaver', 80, 590 - hopK * 22, 1.3, { t, pose, expr }); else SCN.host(g, c, 'beaver', 80, 590, 1.3);
    M.drawEx(g, c, 'lim'); M.drawEx(g, c, 'sub'); drawEx2(g, c, 'main'); glyph(c, M.box(g, 'arr'), INK);
    // the classic mistake, acted out: substituting too early gives 0/0
    if (K.missInfo && (K.missInfo.drag === 'a' || K.missInfo.tap === 'a') && S.st < 2 && t - K.missAt < 0.9) {
      const n = M.frac(M.num(0), M.num(0)), m = M.lay(n, 40), a = Math.sin(Math.min(1, (t - K.missAt) / 0.9) * Math.PI);
      c.save(); c.globalAlpha = a; M.draw(c, n, 300 - m.w / 2, 230, 40, { col: M.BAD }); c.restore();
    }
    M.drawUI(g, c);
  },
});
