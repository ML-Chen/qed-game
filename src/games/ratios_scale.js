// ratios_scale.js — SCALE FACTOR! Two similar shapes glow in space: the first has sides 3 and 5, the copy has the
// matching side 6 and a side marked ?. Every step is acted out (show your work):
//   1. Drag 3 onto 6 (or 6 onto 3): both swell, an arrow arcs from the first shape to the copy, and copies of 6 and 3
//      fly up into "6 ÷ 3" on it. Then the first shape's bottom side lifts off and is laid along the copy's bottom side,
//      again and again, with a count on each piece (1, 2): it fits twice, and "6 ÷ 3" collapses to "× 2".
//      For × 1/2 the side is first cut in half, and one half fits along the copy's side.
//   2. Drag × 2 onto the 5 (or onto the ?): a copy of 5 and the "× 2" fly into the ?, which reads "5 × 2"; the left
//      side is laid along the copy's left side the same way, and "5 × 2" rolls over to 10. A glowing copy of the first
//      shape then grows along the arrow into the copy.
// The rabbit points while the work is shown and hops on every landing.
// Level 0: rectangles, ×2. Level 1: right triangles, ×2 or ×3. Level 2: either shape, ×3 or ×1/2 (the copy shrinks).
// Medium mode: both computations open the tray.
const M = MK, LIGHT = '#f0f4ff', GOLD = '#ffd970', CA = '#6ad8ff', CB = '#ff8ad0';
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), two = (lo, n) => { const a = lo + r(n); let b = lo + r(n - 1); if (b >= a) b++; return [a, b]; };
  if (L === 0) { const [a1, a2] = two(2, 4); return { shape: 'rect', f: { n: 2, d: 1 }, a1, a2 }; }
  if (L === 1) { const f = g.rand() < 0.5 ? 2 : 3, [a1, a2] = two(2, f === 3 ? 3 : 4); return { shape: 'tri', f: { n: f, d: 1 }, a1, a2 }; }
  const shape = g.rand() < 0.5 ? 'rect' : 'tri';
  if (g.rand() < 0.5) { const [a1, a2] = two(2, 3); return { shape, f: { n: 3, d: 1 }, a1, a2 }; }
  const [a1, a2] = two(2, 4); return { shape, f: { n: 1, d: 2 }, a1: a1 * 2, a2: a2 * 2 };
}
const fval = f => f.d === 1 ? M.num(f.n) : M.frac(M.num(f.n), M.num(f.d));
const fnode = (f, o) => M.row(M.op('×'), fval(f));
const YB = 360, CXA = 100, CXB = 254, HX = 64, HY = 470;
function geo(S) {
  const fk = S.f.n / S.f.d, mx = Math.max(S.a1, S.a2) * Math.max(1, fk); S.u = Math.min(24, 124 / mx);
  S.A = { w: S.a1 * S.u, h: S.a2 * S.u }; S.A.x0 = CXA - S.A.w / 2; S.B = { w: S.A.w * fk, h: S.A.h * fk }; S.B.x0 = CXB - S.B.w / 2;
  S.b1 = S.a1 * fk; S.b2 = S.a2 * fk;
}
// side labels: under the bottom side, or right-aligned just left of the left side
function lab(g, key, node, sh, side) {
  if (side === 'b') return M.place(g, key, node, sh.x0 + sh.w / 2, YB + 30, 26, { col: LIGHT });
  const w = M.lay(node, 26).w; return M.place(g, key, node, sh.x0 - 10 - w / 2, YB - sh.h / 2 + 10, 26, { col: LIGHT });
}
// a shape seen as a glowing outline; bottom side and left side may be lit (the matched sides)
function shape(c, S, sh, col, t, litB, litL) {
  const x0 = sh.x0, x1 = x0 + sh.w, yt = YB - sh.h, pts = S.shape === 'rect' ? [[x0, YB], [x1, YB], [x1, yt], [x0, yt]] : [[x0, YB], [x1, YB], [x0, yt]];
  c.save(); c.fillStyle = P.rgba ? P.rgba(col, 0.14) : 'rgba(255,255,255,0.1)'; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill();
  c.shadowColor = col; c.shadowBlur = 12 + 4 * Math.sin(t * 3); c.strokeStyle = col; c.lineWidth = 3; c.lineJoin = 'round'; c.stroke();
  c.lineWidth = 5; c.strokeStyle = GOLD; c.shadowColor = GOLD;
  if (litB) { c.beginPath(); c.moveTo(x0, YB); c.lineTo(x1, YB); c.stroke(); }
  if (litL) { c.beginPath(); c.moveTo(x0, YB); c.lineTo(x0, yt); c.stroke(); }
  c.shadowBlur = 0; c.lineWidth = 1.5; c.strokeStyle = col; c.strokeRect(x0, YB - 9, 9, 9); c.restore();
}
// the working on the shapes: the first shape's side is cut into f.d equal pieces, and f.n copies of one piece fly over
// and lie end to end along the copy's matching side, each with a count: the copy's side is f.n of those pieces
function drawPieces(g, c, S, P0) {
  const t = g.t - P0.t0, T = S.T, A = S.A, B = S.B, bot = P0.side === 'b', len = (bot ? A.w : A.h) / S.f.d, n = S.f.n;
  const at = (sh, d) => bot ? [sh.x0 + d, YB] : [sh.x0, YB - d], dir = bot ? [1, 0] : [0, -1];
  c.save(); c.lineCap = 'round';
  if (S.f.d > 1) for (let j = 1; j < S.f.d; j++) { const k = M.clamp(t / (0.2 * T), 0, 1), [x, y] = at(A, j * len); c.strokeStyle = '#fff'; c.lineWidth = 3; c.globalAlpha = k; c.beginPath(); c.moveTo(x - dir[1] * 9, y - dir[0] * 9); c.lineTo(x + dir[1] * 9, y + dir[0] * 9); c.stroke(); }
  c.globalAlpha = 1;
  for (let j = 0; j < n; j++) {
    const t0 = (S.f.d > 1 ? 0.25 : 0.05) * T + j * 0.26 * T, k = M.easeIO((t - t0) / (0.34 * T)); if (k <= 0) continue;
    const [ax, ay] = at(A, 0), [bx, by] = at(B, j * len), x = M.lerp(ax, bx, k), y = M.lerp(ay, by, k) - Math.sin(k * Math.PI) * 46;
    c.strokeStyle = k < 1 ? '#fff6c0' : GOLD; c.shadowColor = GOLD; c.shadowBlur = 14; c.lineWidth = 7;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + dir[0] * len, y + dir[1] * len); c.stroke();
    if (k >= 1) { c.shadowBlur = 0; c.save(); c.globalAlpha = 1 - M.clamp((t - P0.end) / (0.3 * T), 0, 1); c.fillStyle = '#fff6c0'; c.strokeStyle = '#2a1450'; c.lineWidth = 3; c.font = M.NUMF(15, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
      const mx = bx + dir[0] * len / 2 + (bot ? 0 : 14), my = by + dir[1] * len / 2 - (bot ? 14 : 0), pop = M.clamp((t - t0 - 0.34 * T) / 0.2, 0, 1);
      c.save(); c.translate(mx, my); c.scale(0.6 + 0.4 * M.ease(pop), 0.6 + 0.4 * M.ease(pop)); c.strokeText(String(j + 1), 0, 0); c.fillText(String(j + 1), 0, 0); c.restore();
      c.strokeStyle = '#fff'; c.lineWidth = 2; for (const e of [0, len]) { const ex = bx + dir[0] * e, ey = by + dir[1] * e; c.beginPath(); c.moveTo(ex - dir[1] * 7, ey - dir[0] * 7); c.lineTo(ex + dir[1] * 7, ey + dir[0] * 7); c.stroke(); } c.restore(); }
  }
  c.restore();
}

MG.add({
  id: 'ratios_scale', stage: 'ratios', cmd: 'SCALE FACTOR!', hint: 'drag', time: 9, mood: 'bright', winText: 'Scaled!', hold: 1.4,
  card: {
    title: 'Scale factors', ref: 'Grade 7', kind: 'Ratios and percents',
    text: 'Two shapes are similar when one is an exact enlargement or shrinking of the other: the same shape, maybe a different size. Sides that match up are called corresponding sides.\n\nThe scale factor is the number you multiply every side of the first shape by to get the copy. To find it, divide a side of the copy by the matching side of the first shape. If a side of 3 becomes 6, the scale factor is 6 ÷ 3 = 2.\n\nThen multiply any other side by the scale factor. A side of 5 becomes 5 × 2 = 10.\n\nA scale factor bigger than 1 makes the shape bigger. A scale factor between 0 and 1, such as 1/2, makes it smaller.',
    note: 'Scale factor = side of the copy ÷ matching side of the first shape. Multiply every side by it.',
    ask: 'A 4 by 7 rectangle is enlarged so that the 4 becomes 12. What does the 7 become? What is the scale factor from a side of 10 to a side of 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.kst = 0; S.b2st = 0; geo(S); const T = S.T = M.pace(g);
    S.na1 = M.num(S.a1, 'a1'); S.na2 = M.num(S.a2, 'a2'); S.nb1 = M.num(S.b1, 'b1'); S.slot = M.slot('b2', { w: 30, col: LIGHT }); S.pieces = [];
    const relabel = () => { lab(g, 'la1', S.na1, S.A, 'b'); lab(g, 'la2', S.na2, S.A, 'l'); lab(g, 'lb1', S.nb1, S.B, 'b'); lab(g, 'lb2', S.lb2 || S.slot, S.B, 'l'); if (S.kN) M.place(g, 'k', S.kN, 178, 222, 32, { col: LIGHT }); };
    S.relabel = relabel; S.mk.relay = relabel; relabel();
    const hop = (g, e) => { g.s.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, [GOLD, '#fff', CB], 12, 130); };
    // a copy of a number flies to its place in a working line and lands there
    const flyIn = (g, from, n, delay) => { n.alpha = 0; M.at(g, [[delay, g => { const b = M.box(g, from); M.fly(g, { node: M.num(n.v), col: LIGHT, from: [b.x, b.y], to: n.id, dur: 0.36 * T, arc: -40, s0: 26, s1: 32, then(g) { n.alpha = 1; n.pop = g.t; g.sfx('pop'); } }); }]]); };
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const grow = S.f.n > S.f.d, diff = Math.abs(S.b1 - S.a1), inv = { n: S.f.d, d: S.f.n }, nPieces = S.f.n;
    const stackT = ((S.f.d > 1 ? 0.25 : 0.05) + (nPieces - 1) * 0.26 + 0.5) * T;
    M.play(g, {
      moves(g) {
        const out = [];
        // drag a side onto its matching side: copy ÷ first is the scale factor
        if (!S.kst) out.push({ drag: ['a1', 'b1'], to: ['b1', 'a1'], busy: 0.1, askAt: 0.8 * T, after: stackT + 0.55 * T,
          ask: { v: fnode(S.f), wrong: [M.row(M.op(grow ? '+' : '-'), M.num(diff)), fnode(inv), fnode(S.f.d === 1 ? { n: S.f.n + 1, d: 1 } : { n: 1, d: 3 })] },
          then(g, a, b) { if (a === b) return; S.kst = 'calc'; S.kAt = g.t; M.show(g, 0.8 * T); S.point = true; hop(g, 'wow'); g.sfx('whoosh');
            M.indicate(g, 'a1', { dur: 0.35 * T, col: GOLD }); M.indicate(g, 'b1', { dur: 0.35 * T, delay: 0.15 * T, col: GOLD });
            S.kq = M.num(S.b1, 'kq'); S.kd = M.op('÷', 'kd', { alpha: 0 }); S.ka = M.num(S.a1, 'ka');
            S.kN = Object.assign(M.row(S.kq, S.kd, S.ka), { id: 'k', col: GOLD }); relabel();
            flyIn(g, 'b1', S.kq, 0.04 * T); flyIn(g, 'a1', S.ka, 0.14 * T); M.tween(g, S.kd, { alpha: 1 }, 0.2 * T, { delay: 0.3 * T }); },
          resolve(g) { M.show(g, stackT + 0.55 * T); S.point = true; // how many of the first side fit along the copy's side?
            S.pieces.push({ side: 'b', t0: g.t, end: stackT + 0.6 * T }); hop(g, 'think');
            for (let j = 0; j < nPieces; j++) M.at(g, [[((S.f.d > 1 ? 0.25 : 0.05) + j * 0.26 + 0.34) * T, g => { g.sfx('tap'); hop(g); }]]);
            M.at(g, [[stackT, g => { // the quotient: "10 ÷ 5" becomes "× 2"
                const bq = M.box(g, 'kq'); for (const q of [S.kd, S.ka]) { const b = M.box(g, q.id); if (b && bq) M.tween(g, q, { dx: bq.x - b.x, alpha: 0, sc: 0.5 }, 0.25 * T); }
                if (S.f.d === 1) M.roll(g, S.kq, S.f.n, { delay: 0.1 * T, dur: 0.3 * T }); }],
              [stackT + 0.38 * T, g => { S.kst = 'done'; S.kN.items = [M.op('×', null, { col: GOLD }), S.f.d === 1 ? S.kq : fval(S.f)]; S.kN.pop = g.t; relabel(); g.sfx('chime'); burst('k'); hop(g, 'happy'); }],
              [stackT + 0.5 * T, g => { S.point = false; }]]); } });
        // drag the scale factor onto the other side (or onto the ?): side × factor
        if (S.kst === 'done' && !S.b2st) out.push({ drag: 'k', to: ['a2', 'b2'], busy: 0.1, askAt: 0.75 * T, after: stackT + 0.75 * T,
          ask: { v: S.b2, wrong: [S.a2 + (S.b1 - S.a1), S.b2 + 1, S.b2 - 1, S.a2 * S.f.d / S.f.n] },
          then(g) { S.b2st = 'calc'; M.show(g, 0.75 * T); S.point = true; hop(g, 'wow'); g.sfx('whoosh');
            M.indicate(g, 'a2', { dur: 0.35 * T, col: GOLD });
            S.cv = M.num(S.a2, 'cv'); S.cx = M.op('×', 'cx', { alpha: 0 }); S.cf = fval(S.f); S.cf.alpha = 0; S.cf.id = 'cf';
            S.lb2 = Object.assign(M.row(S.cv, S.cx, S.cf), { id: 'b2' }); relabel(); M.inert(g, ['cf', 'cx', 'cv']);
            flyIn(g, 'a2', S.cv, 0.15 * T);
            M.at(g, [[0.3 * T, g => { const b = M.box(g, 'k'); M.fly(g, { node: fnode(S.f), col: GOLD, from: [b.x, b.y], to: 'b2', dur: 0.38 * T, arc: -30, s0: 32, s1: 26,
              then(g) { S.cx.alpha = 1; S.cf.alpha = 1; S.cf.pop = g.t; g.sfx('pop'); hop(g); } }); }]]); },
          resolve(g) { M.show(g, stackT + 0.75 * T); S.point = true; S.pieces.push({ side: 'l', t0: g.t, end: stackT + 0.9 * T }); hop(g, 'think');
            for (let j = 0; j < nPieces; j++) M.at(g, [[((S.f.d > 1 ? 0.25 : 0.05) + j * 0.26 + 0.34) * T, g => { g.sfx('tap'); hop(g); }]]);
            M.at(g, [[stackT, g => { const bv = M.box(g, 'cv'); for (const q of [S.cx, S.cf]) { const b = M.box(g, q.id); if (b && bv) M.tween(g, q, { dx: bv.x - b.x, alpha: 0, sc: 0.5 }, 0.25 * T); }
                M.roll(g, S.cv, S.b2, { delay: 0.1 * T, dur: 0.3 * T }); }],
              [stackT + 0.38 * T, g => { S.b2st = 'done'; S.cv.id = 'b2v'; S.cv.col = GOLD; S.lb2 = S.cv; relabel(); S.cv.pop = g.t; g.sfx('coin'); burst('b2v'); hop(g, 'laugh'); S.morphAt = g.t; }],
              [stackT + 0.7 * T, g => { S.point = false; }]]); } });
        return out;
      },
      area(g) { return !S.kst ? ['a1', 'b1'] : ['k', 'b2']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.bg(g, c, 'space');
    const litB = S.kst === 'done' || (S.kAt != null && t - S.kAt < 0.6), litL = S.b2st === 'done';
    shape(c, S, S.A, CA, t, litB, litL); shape(c, S, S.B, CB, t + 1, litB, litL);
    // at the end, a glowing copy of the first shape grows along the arrow into the copy: every side times the factor
    if (S.morphAt != null) { const k = M.easeIO((t - S.morphAt) / (0.5 * S.T)); if (k < 1) { const fk = M.lerp(1, S.f.n / S.f.d, k), sh = { w: S.A.w * fk, h: S.A.h * fk }; sh.x0 = M.lerp(CXA, CXB, k) - sh.w / 2;
      c.save(); c.globalAlpha = 0.85 * (1 - k * 0.6); shape(c, S, sh, '#fff6c0', t, false, false); c.restore(); } }
    for (const P0 of S.pieces) drawPieces(g, c, S, P0);
    // the arrow from the first shape to the copy, carrying the scale factor
    if (S.kAt != null) { const k = M.ease((t - S.kAt) / 0.3), ax = CXA, ay = YB - S.A.h - 12, bx = CXB, by = YB - S.B.h - 12;
      c.save(); c.strokeStyle = 'rgba(255,217,112,0.8)'; c.lineWidth = 3; c.setLineDash([7, 6]); c.lineDashOffset = -t * 20; c.globalAlpha = k;
      c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo(178, 190, bx, by); c.stroke(); c.setLineDash([]);
      const an = Math.atan2(by - 222, bx - 178); c.fillStyle = 'rgba(255,217,112,0.9)'; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx - Math.cos(an - 0.5) * 12, by - Math.sin(an - 0.5) * 12); c.lineTo(bx - Math.cos(an + 0.5) * 12, by - Math.sin(an + 0.5) * 12); c.fill(); c.restore();
      const kb = M.box(g, 'k'); if (kb) { c.fillStyle = 'rgba(20,12,50,0.85)'; c.beginPath(); c.roundRect(kb.x - kb.w / 2 - 10, kb.y - kb.h / 2 - 6, kb.w + 20, kb.h + 12, 14); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 2; c.stroke(); } }
    host(g, c, 'rabbit', HX, HY, 1.15);
    for (const k of ['la1', 'la2', 'lb1', 'lb2', 'k']) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
function host(g, c, kind, x, y, s) {
  const S = g.s, K = S.mk, hop = K.lastMove != null && g.t - K.lastMove < 0.35 ? Math.sin((g.t - K.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hop * 20, s, { t: g.t, pose, expr }); else SCN.host(g, c, kind, x, y, s);
}
