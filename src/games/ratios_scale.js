// ratios_scale.js — SCALE FACTOR! Two similar shapes glow in space: the first has sides 3 and 5, the copy has the
// matching side 6 and a side marked ?. Dragging 3 onto 6 (or 6 onto 3) divides them and the scale factor ×2 appears
// on the arrow from the first shape to the copy. Dragging ×2 onto the 5 (or onto the ?) multiplies: the ? becomes 10.
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
const YB = 360, CXA = 100, CXB = 254;
function geo(S) {
  const fk = S.f.n / S.f.d, mx = Math.max(S.a1, S.a2) * Math.max(1, fk); S.u = Math.min(24, 124 / mx);
  S.A = { w: S.a1 * S.u, h: S.a2 * S.u }; S.A.x0 = CXA - S.A.w / 2; S.B = { w: S.A.w * fk, h: S.A.h * fk }; S.B.x0 = CXB - S.B.w / 2;
  S.b1 = S.a1 * fk; S.b2 = S.a2 * fk;
}
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] }), lab = (key, node, sh, side) => M.place(g, key, node, side === 'b' ? sh.x0 + sh.w / 2 : sh.x0 - 18, side === 'b' ? YB + 30 : YB - sh.h / 2 + 10, 26, { col: LIGHT });
  lab('la1', M.num(S.a1, 'a1'), S.A, 'b'); lab('la2', M.num(S.a2, 'a2'), S.A, 'l'); lab('lb1', M.num(S.b1, 'b1'), S.B, 'b');
  lab('lb2', S.b2st === 'calc' ? Object.assign(M.row(M.num(S.a2), M.op('×'), fval(S.f)), { id: 'b2', ...pp('b2') }) : S.b2st ? M.num(S.b2, 'b2', { col: GOLD, ...pp('b2') }) : M.slot('b2', { w: 30, col: LIGHT }), S.B, 'l');
  if (S.kst) M.place(g, 'k', S.kst === 'calc' ? Object.assign(M.row(M.num(S.b1), M.op('÷'), M.num(S.a1)), { id: 'k', ...pp('k') }) : Object.assign(fnode(S.f), { id: 'k', col: GOLD, ...pp('k') }), 178, 222, 32, { col: LIGHT });
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

MG.add({
  id: 'ratios_scale', stage: 'ratios', cmd: 'SCALE FACTOR!', hint: 'drag', time: 9, mood: 'bright', winText: 'Scaled!', hold: 1.4,
  card: {
    title: 'Scale factors', ref: 'Grade 7', kind: 'Ratios and percents',
    text: 'Two shapes are similar when one is an exact enlargement or shrinking of the other: the same shape, maybe a different size. Sides that match up are called corresponding sides.\n\nThe scale factor is the number you multiply every side of the first shape by to get the copy. To find it, divide a side of the copy by the matching side of the first shape. If a side of 3 becomes 6, the scale factor is 6 ÷ 3 = 2.\n\nThen multiply any other side by the scale factor. A side of 5 becomes 5 × 2 = 10.\n\nA scale factor bigger than 1 makes the shape bigger. A scale factor between 0 and 1, such as 1/2, makes it smaller.',
    note: 'Scale factor = side of the copy ÷ matching side of the first shape. Multiply every side by it.',
    ask: 'A 4 by 7 rectangle is enlarged so that the 4 becomes 12. What does the 7 become? What is the scale factor from a side of 10 to a side of 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.pops = {}; S.kst = 0; S.b2st = 0; geo(S);
    build(g); g.dur *= (2.6 + 1.05 * 2) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, [GOLD, '#fff', CB], 12, 130); };
    const grow = S.f.n > S.f.d, diff = Math.abs(S.b1 - S.a1), inv = { n: S.f.d, d: S.f.n };
    M.play(g, {
      moves(g) {
        const out = [];
        // drag a side onto its matching side: copy ÷ first is the scale factor
        if (!S.kst) out.push({ drag: ['a1', 'b1'], to: ['b1', 'a1'], busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: fnode(S.f), wrong: [M.row(M.op(grow ? '+' : '-'), M.num(diff)), fnode(inv), fnode(S.f.d === 1 ? { n: S.f.n + 1, d: 1 } : { n: 1, d: 3 })] },
          then(g, a, b) { if (a === b) return; S.kst = 'calc'; S.pops.k = g.t; S.kAt = g.t; g.sfx('whoosh'); build(g); },
          resolve(g) { S.kst = 'done'; S.pops.k = g.t; g.sfx('chime'); build(g); burst('k'); } });
        // drag the scale factor onto the other side (or onto the ?): side × factor
        if (S.kst === 'done' && !S.b2st) out.push({ drag: 'k', to: ['a2', 'b2'], busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: S.b2, wrong: [S.a2 + (S.b1 - S.a1), S.b2 + 1, S.b2 - 1, S.a2 * S.f.d / S.f.n] },
          then(g) { S.b2st = 'calc'; S.pops.b2 = g.t; g.sfx('whoosh'); build(g); },
          resolve(g) { S.b2st = 'done'; S.pops.b2 = g.t; S.doneAt = g.t; g.sfx('coin'); build(g); burst('b2'); } });
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
    shape(c, S, S.A, CA, t, !!S.kst, S.b2st === 'done'); shape(c, S, S.B, CB, t + 1, !!S.kst, S.b2st === 'done');
    // the arrow from the first shape to the copy, carrying the scale factor
    if (S.kAt != null) { const k = M.ease((t - S.kAt) / 0.3), ax = CXA, ay = YB - S.A.h - 12, bx = CXB, by = YB - S.B.h - 12;
      c.save(); c.strokeStyle = 'rgba(255,217,112,0.8)'; c.lineWidth = 3; c.setLineDash([7, 6]); c.lineDashOffset = -t * 20; c.globalAlpha = k;
      c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo(178, 190, bx, by); c.stroke(); c.setLineDash([]);
      const an = Math.atan2(by - 222, bx - 178); c.fillStyle = 'rgba(255,217,112,0.9)'; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx - Math.cos(an - 0.5) * 12, by - Math.sin(an - 0.5) * 12); c.lineTo(bx - Math.cos(an + 0.5) * 12, by - Math.sin(an + 0.5) * 12); c.fill(); c.restore();
      const kb = M.box(g, 'k'); if (kb) { c.fillStyle = 'rgba(20,12,50,0.85)'; c.beginPath(); c.roundRect(kb.x - kb.w / 2 - 10, kb.y - kb.h / 2 - 6, kb.w + 20, kb.h + 12, 14); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 2; c.stroke(); } }
    SCN.host(g, c, 'rabbit', 64, 470, 1.15);
    for (const k of ['la1', 'la2', 'lb1', 'lb2', 'k']) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
