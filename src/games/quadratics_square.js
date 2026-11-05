// quadratics_square.js — COMPLETE □! Complete the square: x² + bx = c becomes (x + h)² = c + h², with h = b / 2.
// A vegetable garden seen from above on a spring morning. The equation is chalked on a slate sign; under it the left side
// is laid out as garden tiles: an x-by-x lawn (x²) and a flower bed x long and b wide (bx). A rabbit tends the plot.
// Moves (show your work: each one plays its working by itself, the fuse stands still meanwhile):
//   1. Tap bx (or its flower bed): "b ÷ 2 = h" writes itself under the bed, a cut line draws down its middle, and one half
//      swings round under the lawn. Now the plot is a square with one h-by-h corner missing (a dashed hole with a "?").
//   2. Tap the hole: "h² = h²" writes itself beside it, h² paving stones drop in row by row, and a "+ h²" flies from the
//      corner to each side of the equation: x² + bx + h² = c + h².
//   3. (either order with 4) Tap c + h²: the + h² slides into c, which rolls over to the sum.
//   4. Tap the left side (or the plot): a glowing outline draws round the whole square, its sides read "x + h", and the
//      left side folds into (x + □)²: the h flies down from the plot's edge into the bracket.
// Level 0: h = 1..3, c > 0. Level 1: h = 2..5. Level 2: h = 3..6, c may be negative. c + h² is always a perfect square.
// Medium mode: b ÷ 2, h², the sum and the number in the bracket are picked from the tray.
const M = MK, INK = '#fdf6e3', CHALK = '#ffe08a', NOTE = '#fff3d6', EQY = 224, OY = 274, X = 100, HX = 296, HY = 604;
const LAWN = '#79c257', BED = '#e98aa8', STONE = '#f1dcae', SOIL = '#5a3a24';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const h = L === 0 ? r(1, 3) : L === 1 ? r(2, 5) : r(3, 6);
    const k = L < 2 ? h + r(1, 2) : (g.rand() < 0.5 ? r(1, h - 1) : h + 1);
    const c = k * k - h * h; if (c === 0 || Math.abs(c) > 40) continue;
    return { h, b: 2 * h, c, k, s: k * k };
  }
}
// a node drawn centred on (cx, cy)
function put(g, c, n, cx, cy, s, col, alpha = 1) { const m = M.lay(n, s); c.save(); c.globalAlpha *= alpha; M.draw(c, n, cx - m.w / 2, cy + (m.a - m.d) / 2, s, { t: g.t, col }); c.restore(); }
// a label with a dark outline, so it reads on soil and on tiles
function tag(g, c, n, cx, cy, s, col, alpha = 1) { c.save(); c.shadowColor = 'rgba(30,14,6,0.9)'; c.shadowBlur = 5; put(g, c, n, cx, cy, s, col, alpha); put(g, c, n, cx, cy, s, col, alpha); c.restore(); }
const coefX = v => v === 1 ? M.vr('x') : M.row(M.num(v), M.vr('x'));
const kk = (g, a) => a ? M.clamp((g.t - a.t0) / a.dur, 0, 1) : 0;

// the plot's geometry right now (the plot recentres as the bed swings); also records the tap zones
function geo(g) {
  const S = g.s, hu = S.hu, sw = M.easeIO(kk(g, S.swing)), w = M.lerp(X + 2 * hu, X + hu, sw), ox = 180 - w / 2 + 6;
  M.zone(g, 'bed', { x: ox + X + (S.swing ? hu / 2 : hu), y: OY + X / 2, w: S.swing ? hu : 2 * hu, h: X });
  M.zone(g, 'lawn', { x: ox + X / 2, y: OY + X / 2, w: X, h: X });
  if (S.hole) M.zone(g, 'corner', { x: ox + X + hu / 2, y: OY + X + hu / 2, w: Math.max(hu, 44), h: Math.max(hu, 44) });
  if (S.fill) M.zone(g, 'plot', { x: ox + (X + hu) / 2, y: OY + (X + hu) / 2, w: X + hu, h: X + hu });
  return { ox, hu };
}

MG.add({
  id: 'complete_square', stage: 'quadratics', cmd: 'COMPLETE □!', hint: 'tap', time: 9, winText: 'Squared away!', hold: 1.8,
  card: {
    title: 'Completing the square', ref: 'Algebra 1–2', kind: 'Algebra',
    text: 'Some quadratics are almost a perfect square. Picture x² + 6x as tiles: an x-by-x square and a strip of area 6x.\n\nCut the strip in half, into two strips of 3x. Put one on the right of the square and one underneath. Now the shape is a square with a 3-by-3 corner missing, worth 3² = 9.\n\nAdd 9 to fill the corner, and add 9 to the other side too, so the equation stays balanced. So x² + 6x = 7 becomes x² + 6x + 9 = 16. The full square has side x + 3, so (x + 3)² = 16.',
    note: 'Halve the number in front of x and square it. Add that to both sides: x² + bx + (b/2)² = (x + b/2)².',
    ask: 'What number completes the square x² + 8x? Write x² + 4x = 5 as (x + ?)² = ?.',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), { h, b, c } = p, hh = h * h;
    S.u = Math.min(30, 72 / h); S.hu = h * S.u;
    // the equation, built from nodes that are reused so symbols glide when it is rewritten
    S.xv = M.vr('x', 'xv'); S.e2 = M.num(2, 'e2'); S.x2 = M.sup(S.xv, S.e2, 'x2');
    S.p1 = M.op('+', 'p1'); S.bx = M.row(M.num(b, 'bn'), M.vr('x', 'bxv')); S.bx.id = 'bx';
    S.eq = M.op('=', 'eq'); S.cN = M.num(c, 'c');
    S.lsItems = [S.x2, S.p1, S.bx]; S.rsItems = [S.cN];
    S.ls = M.row(S.lsItems); S.ls.id = 'ls'; S.rs = M.row(S.rsItems); S.rs.id = 'rs';
    // one font size that fits the widest line this problem will have
    const widest = M.row(M.sup(M.vr('x'), M.num(2)), M.op('+'), M.num(b), M.vr('x'), M.op('+'), M.num(hh), M.op('='), M.num(c), M.op('+'), M.num(hh));
    S.fs = Math.min(40, 40 * 318 / M.lay(widest, 40).w);
    S.relay = () => { S.ls.items = S.lsItems; S.rs.items = S.rsItems; M.place(g, 'eq', M.row(S.ls, S.eq, S.rs), 180, EQY, S.fs, { col: INK }); };
    S.relay(); M.inert(g, ['xv', 'e2', 'bn', 'bxv', 'p1', 'eq', 'p2', 'p3', 'k9', 'r9', 'pin', 'hin', 'sl']);
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, e) => { S.hopT = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    geo(g);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const noteAt = (g, node, x, y, s) => { M.place(g, 'note', node, x, y, s, { col: NOTE }); M.writeIn(g, node, { dur: 0.4 * T, delay: 0.1 * T }); };
    const noteOff = (g, d) => { const e = g.s.mk.ex.note; if (e) M.tween(g, e.node, { alpha: 0 }, 0.3 * T, { delay: d }); M.at(g, [[d + 0.35 * T, g => { if (g.s.mk.ex.note && g.s.mk.ex.note.node === (e && e.node)) { delete g.s.mk.ex.note; if (g.s.mk.prevNodes) delete g.s.mk.prevNodes.note; } }]]); }; // no ghosts of an old note
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. halve the x term: the flower bed is cut in two and half of it swings under the lawn
        if (!S.half) out.push({ tap: ['bx', 'bed'], busy: 0.1, askAt: 0.6 * T, after: 1.25 * T, ask: { v: h, wrong: [b, 2 * b, hh, h + 1] },
          then(g) { S.half = true; M.show(g, 0.6 * T); S.point = true; hop(g, 'think');
            M.circle(g, 'bx', { dur: 0.5 * T, col: BED }); S.bedGlow = { t0: g.t, dur: 0.6 * T };
            const G = geo(g); S.q = M.num(h, 'q', { alpha: 0 });
            noteAt(g, M.row(M.num(b), M.op('÷'), M.num(2), M.op('='), S.q), G.ox + X + G.hu, OY + X + 26, 26); },
          resolve(g) { M.show(g, 1.25 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.15 * T, dur: 0.35 * T }); g.sfx('ding');
            S.cut = { t0: g.t + 0.25 * T, dur: 0.3 * T }; M.at(g, [[0.3 * T, g => g.sfx('sweep')]]);
            noteOff(g, 0.55 * T);
            M.at(g, [
              [0.6 * T, g => { S.swing = { t0: g.t, dur: 0.55 * T }; g.sfx('whoosh'); hop(g); }],
              [1.15 * T, g => { S.hole = g.t; const G = geo(g); g.burst(G.ox + X + G.hu / 2, OY + X + G.hu / 2, ['#fff3d6', '#ffe08a', '#c8f0a0'], 10, 110); g.sfx('pop'); hop(g, 'think'); S.point = false; }],
            ]); } });
        // 2. fill the missing corner with h² stones, and add h² to both sides
        else if (!S.fill) { if (S.hole) out.push({ tap: 'corner', busy: 0.1, askAt: 0.5 * T, after: 1.3 * T, ask: { v: hh, wrong: [2 * h, hh + 1, 4 * h, h + 2, b * b] },
          then(g) { S.fill = true; M.show(g, 0.5 * T); S.point = true; hop(g, 'think');
            M.circle(g, 'corner', { dur: 0.45 * T, col: CHALK }); S.edgeGlow = { t0: g.t, dur: 0.7 * T };
            const G = geo(g); S.q = M.num(hh, 'q', { alpha: 0 });
            noteAt(g, M.row(M.sup(M.num(h), M.num(2)), M.op('='), S.q), G.ox + X + G.hu / 2, OY + X + G.hu + 26, 26); },
          resolve(g) { M.show(g, 1.3 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.15 * T, dur: 0.35 * T }); g.sfx('ding');
            S.tiles = { t0: g.t + 0.15 * T, dur: 0.55 * T }; for (let i = 0; i < Math.min(h, 4); i++) M.at(g, [[0.15 * T + 0.55 * T * (i + 0.7) / h, g => g.sfx('tap')]]);
            noteOff(g, 0.6 * T);
            M.at(g, [
              [0.75 * T, g => { // room opens on both sides, and a "+ h²" flies from the corner into each
                S.p2 = M.op('+', 'p2', { alpha: 0 }); S.k9 = M.num(hh, 'k9', { alpha: 0 }); S.p3 = M.op('+', 'p3', { alpha: 0 }); S.r9 = M.num(hh, 'r9', { alpha: 0 });
                S.lsItems = [S.x2, S.p1, S.bx, S.p2, S.k9]; S.rsItems = [S.cN, S.p3, S.r9]; S.relay(); M.inert(g, ['rs']);
                const G = geo(g), from = [G.ox + X + G.hu / 2, OY + X + G.hu / 2]; hop(g, 'laugh'); g.sfx('whoosh');
                for (const [pl, nn, arc] of [[S.p2, S.k9, -70], [S.p3, S.r9, -90]])
                  M.fly(g, { node: M.row(M.op('+'), M.num(hh)), from, to: nn.id, dur: 0.42 * T, arc, s0: 26, s1: S.fs, col: CHALK,
                    then(g) { pl.alpha = 1; nn.alpha = 1; nn.pop = g.t; M.sparkle(g, nn.id, { n: 8 }); g.sfx('pop'); } }); }],
              [1.2 * T, g => { g.s.mk.inert.delete('rs'); S.point = false; }],
            ]); } }); }
        else {
          // 3. add up the right side
          if (!S.sum) out.push({ tap: ['rs', 'r9', 'c'], busy: 0.1, askAt: 0.45 * T, after: 0.9 * T, ask: { v: p.s, wrong: [c * hh, c + h, hh - c, c + b] },
            then(g) { S.sum = true; M.show(g, 0.45 * T); hop(g, 'think'); M.circle(g, 'rs', { dur: 0.45 * T, col: CHALK }); M.indicate(g, S.cN, { delay: 0.08 * T, dur: 0.3 * T }); M.indicate(g, S.r9, { delay: 0.2 * T, dur: 0.3 * T }); },
            resolve(g) { M.show(g, 0.9 * T); const tb = M.box(g, 'c');
              for (const q of [S.p3, S.r9]) { const sb = M.box(g, q.id); M.tween(g, q, { dx: tb && sb ? tb.x - sb.x : -30, alpha: 0, sc: 0.5 }, 0.3 * T); }
              M.roll(g, S.cN, p.s, { delay: 0.12 * T, dur: 0.36 * T }); S.cN.col = CHALK; g.sfx('sweep');
              M.at(g, [[0.5 * T, g => { S.rsItems = [S.cN]; S.relay(); M.sparkle(g, 'c', { n: 10 }); g.sfx('ding'); hop(g); }]]); } });
          // 4. fold the left side into a perfect square
          if (!S.fold) out.push({ tap: ['ls', 'x2', 'bx', 'k9', 'plot'], busy: 0.1, askAt: 0.7 * T, after: 1.0 * T, ask: { v: h, wrong: [b, hh, h + 1, 2 * b] },
            then(g) { S.fold = { t0: g.t, dur: 0.5 * T }; M.show(g, 0.7 * T); S.point = true; hop(g, 'think');
              M.circle(g, 'ls', { dur: 0.45 * T, col: LAWN });
              M.at(g, [[0.3 * T, g => { S.plus = g.t; g.sfx('pop'); for (const q of [...S.bx.items, S.p2, S.k9]) M.tween(g, q, { alpha: 0, sc: 0.6 }, 0.2 * T); }],
                [0.5 * T, g => { // x² + bx + h² folds into (x + □)²: the x and the ² glide out to the bracket
                  S.sl = M.slot('sl', { w: S.fs * 0.8 }); S.pin = M.op('+', 'pin'); Object.assign(S.p1, { id: 'p1' });
                  S.sq = M.sup(M.paren(M.row(S.xv, S.p1, S.sl)), S.e2, 'sqr'); S.x2 = null;
                  S.lsItems = [S.sq]; S.relay(); g.sfx('swoosh'); }]]); },
            resolve(g) { M.show(g, 1.0 * T); const G = geo(g);
              S.hin = M.num(h, 'hin', { _born: -1 });
              M.fly(g, { node: M.num(h), from: [G.ox + X + G.hu / 2, OY - 13], to: 'sl', dur: 0.45 * T, arc: -50, s0: 18, s1: S.fs, col: CHALK,
                then(g) { S.hin.pop = g.t; S.sl.alpha = 0; S.sq.base.inner.items[2] = S.hin; S.relay(); M.sparkle(g, 'hin', { n: 12 }); g.sfx('ding'); hop(g, 'laugh'); } });
              M.at(g, [[0.6 * T, g => { S.glowAll = { t0: g.t, dur: 0.4 * T }; S.point = false; }]]); } });
        }
        return out;
      },
      area(g) { return !S.half ? ['bx'] : !S.fill ? ['corner'] : !S.sum ? ['rs'] : ['ls']; },
    });
  },
  // the plot's geometry: where the lawn, the beds and the corner are right now (also records their tap zones)
  update(g, dt) { M.update(g, dt); geo(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, G = geo(g), hu = G.hu, u = S.u, ox = G.ox, h = p.h;
    c.drawImage(g.bake('qsq_bg', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    ambient(c, t);
    // the plot: lawn, two halves of the flower bed, the corner
    const shadow = (x, y, w, hh) => { c.fillStyle = 'rgba(30,14,6,0.28)'; c.fillRect(x + 4, y + 5, w, hh); };
    shadow(ox, OY, X, X); drawLawn(c, ox, OY, X, X, t);
    const bedA = [ox + X, OY, hu, X];
    // half B: before the swing it sits right of half A; it rotates a quarter turn about its centre as it travels under the lawn
    const sw = M.easeIO(kk(g, S.swing)), b0 = [ox + X + 1.5 * hu, OY + X / 2], b1 = [ox + X / 2, OY + X + hu / 2];
    const bcx = M.lerp(b0[0], b1[0], sw) - Math.sin(sw * Math.PI) * 26, bcy = M.lerp(b0[1], b1[1], sw) + Math.sin(sw * Math.PI) * 30, ang = -sw * Math.PI / 2;
    const bedGlow = S.bedGlow ? Math.sin(kk(g, S.bedGlow) * Math.PI) : 0;
    shadow(...bedA); drawBed(c, ...bedA, bedGlow);
    c.save(); c.translate(bcx, bcy); c.rotate(ang); shadow(-hu / 2, -X / 2, hu, X); drawBed(c, -hu / 2, -X / 2, hu, X, bedGlow); c.restore();
    // the cut line draws down the middle of the bed
    const ck = kk(g, S.cut); if (S.cut && !S.swing) { c.save(); c.strokeStyle = '#fff6e0'; c.lineWidth = 3; c.setLineDash([7, 5]); c.shadowColor = CHALK; c.shadowBlur = 8; c.beginPath(); c.moveTo(ox + X + hu, OY - 4); c.lineTo(ox + X + hu, OY - 4 + (X + 8) * M.easeIO(ck)); c.stroke(); c.restore(); }
    // labels inside the tiles
    const halfLbl = S.cut && ck > 0.6;
    put(g, c, M.sup(M.vr('x'), M.num(2)), ox + X / 2, OY + X / 2, 28, '#24461a');
    if (!halfLbl) tag(g, c, coefX(p.b), ox + X + hu, OY + X / 2, Math.min(24, hu * 0.7), '#fff6ea');
    else { const s = Math.min(20, hu * 0.62); tag(g, c, coefX(h), ox + X + hu / 2, OY + X / 2, s, '#fff6ea'); tag(g, c, coefX(h), bcx, bcy, s, '#fff6ea'); }
    // the corner: a dashed hole once the bed has swung, then paving stones that drop in row by row
    const cx0 = ox + X, cy0 = OY + X;
    if (S.hole && !S.tiles) { const pk = 0.5 + 0.5 * Math.sin(t * 5); c.save(); c.fillStyle = 'rgba(40,22,10,0.45)'; c.fillRect(cx0, cy0, hu, hu); c.strokeStyle = `rgba(255,240,200,${0.6 + 0.4 * pk})`; c.lineWidth = 2.5; c.setLineDash([5, 4]); c.strokeRect(cx0 + 1.5, cy0 + 1.5, hu - 3, hu - 3); c.restore();
      tag(g, c, M.txt('?'), cx0 + hu / 2, cy0 + hu / 2, Math.min(26, hu * 0.7) * (1 + 0.08 * pk), '#fff3d6'); }
    if (S.tiles) { const n = h * h;
      for (let i = 0; i < n; i++) { const row = Math.floor(i / h), col = i % h, at = S.tiles.t0 + S.tiles.dur * (row / h + col / (h * h)), k = M.clamp((t - at) / 0.22, 0, 1); if (k <= 0) continue;
        const e = M.ease(k), x = cx0 + col * u, y = cy0 + row * u - (1 - e) * 46; c.save(); c.globalAlpha = Math.min(1, k * 2.5);
        c.fillStyle = 'rgba(30,14,6,0.3)'; c.fillRect(x + 1.5, y + 2.5, u - 1, u - 1); c.fillStyle = STONE; c.fillRect(x + 0.8, y + 0.8, u - 1.6, u - 1.6); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(x + 1.5, y + 1.5, u - 3, Math.max(1.5, u * 0.18)); c.restore(); }
      if (t > S.tiles.t0 + S.tiles.dur + 0.15) tag(g, c, M.num(h * h), cx0 + hu / 2, cy0 + hu / 2, Math.min(24, hu * 0.55), '#fff6e0', M.clamp((t - S.tiles.t0 - S.tiles.dur - 0.15) / 0.2, 0, 1)); }
    // edge lengths: x and the bed's width along the top, x along the left; after the swing the second half's width sits on the left
    const eg = S.edgeGlow ? Math.sin(kk(g, S.edgeGlow) * Math.PI) : 0, gl = S.glowAll ? Math.sin(kk(g, S.glowAll) * Math.PI) : 0, ec = M.mix('#fff3d6', CHALK, Math.max(eg, gl)), es = 18 * (1 + 0.25 * Math.max(eg, gl));
    tag(g, c, M.vr('x'), ox + X / 2, OY - 13, 18, ec); tag(g, c, M.vr('x'), ox - 13, OY + X / 2, 18, ec);
    if (!halfLbl) tag(g, c, M.num(p.b), ox + X + hu, OY - 13, 17, '#fff3d6');
    else { tag(g, c, M.num(h), ox + X + hu / 2, OY - 13, 17 * (es / 18), ec);
      // the second half's label rides with it: from above it to its left side
      const lx = bcx + Math.sin(ang) * (X / 2 + 13), ly = bcy - Math.cos(ang) * (X / 2 + 13);
      tag(g, c, M.num(h), lx, ly, 17 * (es / 18), ec); }
    // fold: a glowing outline round the whole square, and "+" signs make each side read x + h
    if (S.fold) { const fk = kk(g, S.fold), L = X + hu, per = 4 * L; c.save(); c.strokeStyle = CHALK; c.shadowColor = CHALK; c.shadowBlur = 14; c.lineWidth = 3.5; c.setLineDash([per * M.easeIO(fk), per * 2]); c.strokeRect(ox - 3, OY - 3, L + 6, L + 6); c.restore();
      if (S.plus) { const a = M.clamp((t - S.plus) / 0.25, 0, 1); tag(g, c, M.op('+'), ox + X, OY - 13, 18 * (1 + Math.sin(a * Math.PI) * 0.4), CHALK, a); tag(g, c, M.op('+'), ox - 13, OY + X, 18 * (1 + Math.sin(a * Math.PI) * 0.4), CHALK, a); } }
    M.drawEx(g, c, 'eq'); M.drawEx(g, c, 'note');
    // the rabbit points at the plot while the work is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', HX, HY - hk * 24, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'rabbit', HX, HY, 1.25);
    M.drawUI(g, c);
  },
});
function drawLawn(c, x, y, w, h, t) {
  c.save(); c.fillStyle = LAWN; c.fillRect(x, y, w, h); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = -1; i < w / 12 + 1; i += 2) c.fillRect(x + i * 12, y, 12, h); // mowing stripes
  c.fillStyle = 'rgba(30,80,20,0.25)'; for (let i = 0; i < 26; i++) { const px = x + ((i * 37) % w), py = y + ((i * 53) % h); c.fillRect(px, py, 2, 4); }
  c.restore(); c.strokeStyle = '#3e7a2a'; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2);
}
function drawBed(c, x, y, w, h, glow) {
  c.save(); c.fillStyle = '#6a4228'; c.fillRect(x, y, w, h); c.beginPath(); c.rect(x, y, w, h); c.clip();
  if (glow > 0) { c.shadowColor = '#ffd0e0'; c.shadowBlur = 16 * glow; }
  const cols = ['#ff9ab8', '#ffd45a', '#fff4f0', '#e86a9a'];
  for (let j = 0; j < h / 9; j++) for (let i = 0; i < w / 9; i++) { const px = x + 4.5 + i * 9 + (j % 2) * 2, py = y + 4.5 + j * 9; c.fillStyle = '#4a8a3a'; c.beginPath(); c.arc(px, py + 1, 3.2, 0, 7); c.fill(); c.fillStyle = cols[(i * 3 + j) % 4]; c.beginPath(); c.arc(px, py, 2.4, 0, 7); c.fill(); }
  c.restore(); c.save(); c.strokeStyle = glow > 0 ? M.mix('#8a3a5a', '#ffd0e0', glow) : '#8a3a5a'; c.lineWidth = 2 + glow * 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.restore();
}
function paintBg(c, W, H) {
  const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#8ab4d8'); gr.addColorStop(0.16, '#cfe6c0'); gr.addColorStop(0.2, '#5f9a44'); gr.addColorStop(1, '#4a8236'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  // a hedge across the top, seen from above, with the morning sky peeking over it
  for (let i = 0; i < 24; i++) { const x = i * 16 + (i % 3) * 3, y = 128 + (i % 2) * 6; c.fillStyle = i % 2 ? '#3e7a32' : '#4a8a3a'; c.beginPath(); c.arc(x, y, 20, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,220,0.18)'; c.beginPath(); c.arc(x - 6, y - 7, 8, 0, 7); c.fill(); }
  // the tilled bed the plot sits in, with wooden edging
  const bx = 22, by = 252, bw = 316, bh = 238;
  c.fillStyle = '#7a4e2e'; c.fillRect(bx - 8, by - 8, bw + 16, bh + 16); c.fillStyle = '#a0703e'; c.fillRect(bx - 8, by - 8, bw + 16, 5); c.fillRect(bx - 8, by + bh + 3, bw + 16, 5);
  const sg = c.createLinearGradient(0, by, 0, by + bh); sg.addColorStop(0, '#6e4a30'); sg.addColorStop(1, SOIL); c.fillStyle = sg; c.fillRect(bx, by, bw, bh);
  for (let i = 0; i < 260; i++) { const x = bx + ((i * 97) % bw), y = by + ((i * 61 + i * i) % bh); c.fillStyle = i % 3 ? 'rgba(30,16,8,0.25)' : 'rgba(200,150,100,0.18)'; c.beginPath(); c.arc(x, y, 1 + (i % 3) * 0.7, 0, 7); c.fill(); }
  for (let y = by + 12; y < by + bh; y += 22) { c.strokeStyle = 'rgba(30,16,8,0.18)'; c.lineWidth = 3; c.beginPath(); c.moveTo(bx + 4, y); c.lineTo(bx + bw - 4, y); c.stroke(); }
  // the slate sign for the equation
  c.fillStyle = 'rgba(20,10,5,0.35)'; c.beginPath(); c.roundRect(16, 186, 336, 62, 12); c.fill();
  c.fillStyle = '#9a6a3a'; c.beginPath(); c.roundRect(10, 178, 340, 64, 12); c.fill();
  const sl = c.createLinearGradient(0, 184, 0, 236); sl.addColorStop(0, '#3e4a52'); sl.addColorStop(1, '#2c363e'); c.fillStyle = sl; c.beginPath(); c.roundRect(16, 184, 328, 52, 8); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(60 + i * 80, 210, 36, 10, 0.3, 0, 7); c.fill(); }
  // grass below with flowers, stepping stones and a watering can
  P.flowers(c, W, 512, 640, 24, undefined, 5);
  for (const [x, y, r] of [[60, 560, 16], [110, 598, 14], [170, 620, 15]]) { c.fillStyle = 'rgba(20,40,10,0.3)'; c.beginPath(); c.ellipse(x + 2, y + 3, r, r * 0.7, 0, 0, 7); c.fill(); c.fillStyle = '#d8ccb0'; c.beginPath(); c.ellipse(x, y, r, r * 0.7, 0, 0, 7); c.fill(); }
  c.save(); c.translate(40, 520); c.fillStyle = '#5a9ac8'; c.beginPath(); c.roundRect(-14, -12, 28, 22, 5); c.fill(); c.strokeStyle = '#3a6a98'; c.lineWidth = 3; c.beginPath(); c.moveTo(12, -4); c.lineTo(28, -16); c.stroke(); c.beginPath(); c.arc(-14, -1, 7, Math.PI * 0.5, Math.PI * 1.5); c.stroke(); c.restore();
}
function ambient(c, t) {
  // two butterflies and drifting leaf shadows
  for (let i = 0; i < 2; i++) { const x = 60 + i * 220 + Math.sin(t * 0.7 + i * 2) * 50, y = 520 + i * 30 + Math.sin(t * 1.3 + i) * 18, f = Math.abs(Math.sin(t * 12 + i));
    c.save(); c.translate(x, y); c.fillStyle = i ? '#ffd45a' : '#ff9ad0'; c.beginPath(); c.ellipse(-4, 0, 5 * f + 1, 6, -0.4, 0, 7); c.fill(); c.beginPath(); c.ellipse(4, 0, 5 * f + 1, 6, 0.4, 0, 7); c.fill(); c.fillStyle = '#3a1640'; c.fillRect(-0.8, -4, 1.6, 8); c.restore(); }
  c.fillStyle = 'rgba(20,40,10,0.08)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse((i * 110 + t * 6) % 420 - 30, 470 + i * 40, 40, 16, 0.4, 0, 7); c.fill(); }
}
