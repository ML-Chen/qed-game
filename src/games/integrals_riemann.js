// integrals_riemann.js — RIEMANN SUM! Estimate the area under a curve with rectangles.
// A desert at sunset: the curve y = f(x) is drawn over the sand, and the strip under it is cut into 3 equal widths Δx.
// The slate says which sum ("left" or "right"), the function and Δx, and "area ≈ ? + ? + ? = ?".
//   Tap a sample point on the x-axis (the left end of a strip for a left sum, the right end for a right sum), or the
//   strip itself, in any order. The working is acted out: the point is circled, a dashed line shoots up to the curve and
//   a dot lands on it, "f(2) = 2² = 4" writes itself beside the dot, a sandstone block rises out of the sand to exactly
//   that height, "4 × 1 = 4" (height × width) writes itself over it, and the 4 flies into its ? in the sum.
//   Tap the answer once every strip has its block: the terms merge into a running total and every block glows in turn.
// Level 0: left sums with Δx = 1. Level 1: left or right sums. Level 2: Δx = 2.
// Medium mode: each height f(x) and the final sum are picked from the tray.
// Wrong moves: the sample point at the wrong end (the right end in a left sum: the classic mix-up), the answer too early.
const M = MK, INK = '#3a1a30', L1Y = 208, L2Y = 258, OX = 46, OY = 548, GW = 248, GH = 214, HX = 338, HY = 620;
const BLK = ['#e8a050', '#d87a48', '#c8a060'], CURVE = '#7a1a50', PINK = '#fff4dc', PGOOD = '#c8f5a0';
const FN = {
  sq: { f: x => x * x, show: () => M.sup(M.vr('x'), M.num(2)), sub: a => [M.sup(M.num(a), M.num(2))] },
  sq1: { f: x => x * x + 1, show: () => M.row(M.sup(M.vr('x'), M.num(2)), M.op('+'), M.num(1)), sub: a => [M.sup(M.num(a), M.num(2)), M.op('+'), M.num(1)] },
  x2: { f: x => 2 * x, show: () => M.row(M.num(2), M.vr('x')), sub: a => [M.num(2), M.op('·'), M.num(a)] },
  x3: { f: x => 3 * x, show: () => M.row(M.num(3), M.vr('x')), sub: a => [M.num(3), M.op('·'), M.num(a)] },
  p1: { f: x => x + 1, show: () => M.row(M.vr('x'), M.op('+'), M.num(1)), sub: a => [M.num(a), M.op('+'), M.num(1)] },
};
const POOL = [
  [{ fn: 'sq', a: 1, dx: 1, side: 'left' }, { fn: 'x2', a: 1, dx: 1, side: 'left' }, { fn: 'p1', a: 1, dx: 1, side: 'left' }],
  [{ fn: 'sq', a: 0, dx: 1, side: 'right' }, { fn: 'sq1', a: 0, dx: 1, side: 'left' }, { fn: 'x3', a: 1, dx: 1, side: 'right' }, { fn: 'sq', a: 1, dx: 1, side: 'left' }],
  [{ fn: 'p1', a: 0, dx: 2, side: 'left' }, { fn: 'p1', a: 0, dx: 2, side: 'right' }, { fn: 'x2', a: 1, dx: 2, side: 'left' }],
];

MG.add({
  id: 'integrals_riemann', stage: 'integrals', cmd: 'RIEMANN SUM!', hint: 'tap', time: 10, mood: 'desert', winText: 'Estimated!', hold: 1.8,
  card: {
    title: 'Riemann sums', ref: 'Calculus', kind: 'Calculus',
    text: 'It is hard to measure the area under a curve directly, but rectangles are easy: area = height × width.\n\nSo cut the region into strips of the same width, Δx. Make each strip a rectangle whose height is the curve\'s height at one end of the strip. In a left sum you use the left end, in a right sum the right end. Add up the rectangles.\n\nFor y = x² from 1 to 4 with Δx = 1, the left ends are 1, 2 and 3, so the heights are 1, 4 and 9. The left sum is 1×1 + 4×1 + 9×1 = 14. The true area is 21, because the curve rises above each rectangle. Thinner strips give closer answers, and in the limit the sum becomes the integral.',
    note: 'Riemann sum = f(x₁)·Δx + f(x₂)·Δx + ... , where each xᵢ is the left (or right) end of a strip.',
    ask: 'Find the right sum for y = x² from 0 to 3 with Δx = 1. Find the left sum for y = 2x from 0 to 4 with Δx = 2.',
  },

  init(g) {
    const S = g.s; M.setup(g); const P = POOL[g.level][Math.floor(g.rand() * POOL[g.level].length)], T = M.pace(g), F = FN[P.fn];
    Object.assign(S, P, { F, n: 3 }); S.b = S.a + S.n * S.dx; S.left = S.side === 'left';
    S.xs = [...Array(S.n)].map((_, j) => S.a + (j + (S.left ? 0 : 1)) * S.dx); S.h = S.xs.map(F.f); S.area = S.h.map(h => h * S.dx); S.sum = S.area.reduce((p, q) => p + q, 0);
    S.ymax = Math.max(F.f(S.b), 1); S.ux = GW / S.b; S.uy = GH / S.ymax;
    S.blk = S.xs.map(() => ({ rise: null, dot: null, done: false })); S.order = [];
    // the slate: "left  y = x²  Δx = 1" and "area ≈ ? + ? + ? = ?"
    S.top = M.row(M.txt(S.side, 'side', { col: '#ffcf6a' }), M.gap(16), M.vr('y'), M.op('='), F.show(), M.gap(16), M.txt('Δ'), M.vr('x'), M.op('='), M.num(S.dx));
    S.slots = S.xs.map((_, j) => M.slot('s' + j, { w: 26, col: '#f0d8b0' })); S.ans = M.slot('ans', { w: 28, col: '#f0d8b0' });
    S.sumRow = M.row(S.slots.flatMap((q, j) => j ? [M.op('+', 'p' + j), q] : [q])); S.line = M.row(M.txt('area', 'lab'), M.op('≈', 'apx'), S.sumRow, M.op('=', 'eq'), S.ans);
    S.placeT = () => M.place(g, 'top', S.top, 180, L1Y, 28, { col: PINK }); S.placeL = () => M.place(g, 'line', S.line, 180, L2Y, 30, { col: PINK });
    S.placeT(); S.placeL();
    // the x-axis labels: every end of every strip (one of them is never a sample point)
    S.ticks = [...Array(S.n + 1)].map((_, j) => S.a + j * S.dx);
    S.ticks.forEach(x => M.place(g, 'xl' + x, M.num(x, 'x' + x), OX + x * S.ux, OY + 28, 26, { col: INK }));
    S.xs.forEach((x, j) => M.zone(g, 'st' + j, { x: OX + (S.a + (j + 0.5) * S.dx) * S.ux, y: OY - 50, w: S.dx * S.ux - 4, h: 96 }));
    M.inert(g, ['side', 'lab', 'apx', 'eq', 'p1', 'p2', ...S.slots.map(q => q.id), 'run', 'fq', 'aq']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const px = x => OX + x * S.ux, py = y => OY - y * S.uy;

    M.play(g, {
      moves(g) {
        const out = [], todo = S.xs.map((x, j) => j).filter(j => !S.blk[j].done);
        for (const j of todo) { const x = S.xs[j], h = S.h[j];
          out.push({ tap: ['x' + x, 'st' + j], busy: 0.1, askAt: 0.8 * T, after: 1.3 * T,
            ask: { v: h, wrong: [S.F.f(x + S.dx), h + 1, h - 1, 2 * h].filter(v => v >= 0 && v !== h) },
            then(g) { const B = S.blk[j]; B.done = true; S.cur = j; S.point = true; hop(g, 'wow'); M.inert(g, ['x' + x]); M.show(g, 0.8 * T);
              M.circle(g, 'x' + x, { dur: 0.45 * T, col: '#ffe08a', pad: 5 }); M.indicate(g, 'x' + x, { dur: 0.35 * T, sc: 1.35, col: '#ffb21f' });
              S.probe = { x, h, t0: g.t + 0.1 * T, dur: 0.3 * T }; g.sfx('swoosh');
              M.at(g, [[0.4 * T, g => { B.dot = g.t; g.sfx('pop'); g.burst(px(x), py(h), ['#fff', '#ffe08a', CURVE], 8, 90);
                // "f(2) = 2² = ?" writes itself beside the dot
                S.fq = M.num(h, 'fq', { alpha: 0, col: '#1a6a3a' });
                S.fn = M.row(M.vr('f'), M.txt('('), M.num(x), M.txt(')'), M.op('='), ...S.F.sub(x), M.op('='), S.fq);
                const w = M.lay(S.fn, 26).w, nx = M.clamp(px(x) + 14 + w > 348 ? px(x) - 14 - w : px(x) + 14, 14, 346 - w), ny = Math.max(py(h) - 12, 318);
                S.fk = 'fn' + j; M.place(g, S.fk, S.fn, nx, ny, 26, { col: INK, left: true }); M.writeIn(g, S.fn, { dur: 0.32 * T }); }]]); },
            resolve(g) { const B = S.blk[j]; S.fq.alpha = 1; M.writeIn(g, S.fq, { dur: 0.15 * T }); M.indicate(g, S.fq, { delay: 0.1 * T, dur: 0.3 * T, sc: 1.35 }); g.sfx('ding');
              M.at(g, [[0.2 * T, g => { B.rise = g.t; B.riseDur = 0.4 * T; g.sfx('whoosh'); hop(g); }],
                [0.35 * T, g => { if (S.fn) M.tween(g, S.fn, { alpha: 0 }, 0.2 * T); }],
                // height × width = area, written over the block
                [0.58 * T, g => { delete g.s.mk.ex[S.fk]; S.probe = null; S.aq = M.num(S.area[j], 'aq', { col: '#1a6a3a' });
                  S.an = M.row(M.num(h), M.op('×'), M.num(S.dx), M.op('='), S.aq); const cx = px(S.a + (j + 0.5) * S.dx);
                  const w = M.lay(S.an, 26).w, ax = M.clamp(cx, 18 + w / 2, 342 - w / 2), ay = Math.max(py(h) - 14, 330);
                  S.ak = 'an' + j; M.place(g, S.ak, S.an, ax, ay, 26, { col: INK }); M.writeIn(g, S.an, { dur: 0.3 * T }); }],
                [0.92 * T, g => { const slot = S.slots[j]; g.sfx('swoosh');
                  M.fly(g, { node: M.num(S.area[j], null, { col: '#1a6a3a' }), from: 'aq', to: slot.id, dur: 0.32 * T, arc: -20, s0: 26, s1: 32,
                    then(g) { slot.fill = M.num(S.area[j], 'v' + j, { col: PGOOD, _born: -1, pop: g.t }); S.placeL(); M.sparkle(g, slot.id, { n: 8 }); g.sfx('tap'); hop(g, 'happy'); } });
                  M.tween(g, S.an, { alpha: 0 }, 0.25 * T, { delay: 0.1 * T }); }],
                [1.26 * T, g => { delete g.s.mk.ex[S.ak]; S.point = false; }]]);
              M.show(g, 1.3 * T); } }); }
        // add the areas: a running total, then the total is the estimate
        if (!todo.length && !S.added) out.push({ tap: ['ans', 'eq'], busy: 0.1, askAt: 0.6 * T, get after() { return S.afterLen || 1.6 * T; },
          ask: { v: S.sum, wrong: [S.left ? S.sum - S.area[0] + S.F.f(S.b) * S.dx : S.sum - S.area[S.n - 1] + S.F.f(S.a) * S.dx, S.sum + S.dx, S.h.reduce((p, q) => p + q, 0) === S.sum ? S.sum - 1 : S.h.reduce((p, q) => p + q, 0)].filter(v => v !== S.sum) },
          then(g) { S.added = true; hop(g, 'think'); S.point = true; M.circle(g, S.slots.map(q => q.id), { dur: 0.5 * T });
            S.slots.forEach((q, k) => M.indicate(g, q.fill, { delay: 0.1 * T + k * 0.1 * T, dur: 0.3 * T, sc: 1.3, col: '#ffcf6a' })); M.show(g, 0.6 * T); },
          resolve(g) { const gs = S.slots.map(q => q.fill), it = S.sumRow.items, first = gs[0]; let run = S.area[0]; hop(g, 'happy');
            for (let k = 1; k < S.n; k++) { const tk = 0.1 * T + (k - 1) * 0.4 * T;
              M.at(g, [[tk, g => { const b0 = M.box(g, first.id); for (const q of [it[2 * k - 1], it[2 * k]]) { const b = M.box(g, q.id); if (b && b0) M.tween(g, q, { dx: b0.x - b.x, alpha: 0, sc: 0.6 }, 0.24 * T); }
                run += S.area[k]; M.roll(g, first, run, { delay: 0.16 * T, dur: 0.2 * T }); M.at(g, [[0.3 * T, g => { first.pop = g.t; g.sfx('pop', { p: 1 + k * 0.1 }); }]]); }]]); }
            const tb = 0.1 * T + (S.n - 1) * 0.4 * T + 0.05 * T;
            // the "= ?" goes, and the running total is the estimate
            M.at(g, [[tb, g => { gs.slice(1).forEach(q => q.alpha = 0); M.tween(g, 'eq', { alpha: 0 }, 0.15 * T); M.tween(g, S.ans, { alpha: 0 }, 0.15 * T); }],
              [tb + 0.18 * T, g => { first.id = 'res'; S.line.items = [S.line.items[0], S.line.items[1], first]; S.placeL(); first.pop = g.t; M.sparkle(g, 'res', { n: 16 }); g.sfx('coin'); hop(g, 'laugh'); }]]);
            S.blk.forEach((B, j) => M.at(g, [[tb + 0.25 * T + j * 0.16 * T, g => { B.glow = g.t; g.sfx('chime', { vol: 0.4, p: 1 + j * 0.1 }); }]]));
            S.afterLen = tb + 0.3 * T + S.n * 0.16 * T + 0.3 * T; M.at(g, [[S.afterLen - 0.1 * T, g => { S.point = false; }]]); M.show(g, S.afterLen); } });
        return out;
      },
      area(g) { const l = S.xs.map((x, j) => j).filter(j => !S.blk[j].done); return l.length ? l.flatMap(j => ['x' + S.xs[j], 'st' + j]) : ['ans']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, px = x => OX + x * S.ux, py = y => OY - y * S.uy;
    SCN.bg(g, c, 'desert');
    // smooth sand under the graph
    c.save(); const sg = c.createLinearGradient(0, OY, 0, 640); sg.addColorStop(0, '#e8c080'); sg.addColorStop(1, '#c89050'); c.fillStyle = sg; c.fillRect(0, OY, 360, 640 - OY); c.restore();
    SCN.panel(c, 'sign', 180, 234, 340, 108, t);
    // a pale sheet of smooth sand behind the graph keeps it readable over the dunes
    c.save(); c.fillStyle = 'rgba(255,244,222,0.62)'; c.beginPath(); c.roundRect(8, py(S.ymax) - 26, 344, OY - py(S.ymax) + 62, 14); c.fill(); c.restore();
    // the grid and axes
    c.save(); c.strokeStyle = 'rgba(122,60,40,0.16)'; c.lineWidth = 1;
    const ys = S.ymax <= 8 ? 1 : S.ymax <= 20 ? 2 : 5;
    for (let y = ys; y <= S.ymax; y += ys) { c.beginPath(); c.moveTo(OX, py(y)); c.lineTo(px(S.b) + 8, py(y)); c.stroke(); }
    for (let x = 1; x <= S.b; x++) { c.beginPath(); c.moveTo(px(x), OY); c.lineTo(px(x), py(S.ymax) - 6); c.stroke(); }
    c.strokeStyle = INK; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(OX, py(S.ymax) - 14); c.lineTo(OX, OY); c.lineTo(px(S.b) + 16, OY); c.stroke();
    c.fillStyle = INK; c.font = M.NUMF(19); c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let y = ys; y <= S.ymax; y += ys) if (y % (ys * (S.ymax > 10 ? 2 : 1)) === 0) c.fillText(String(y), OX - 6, py(y));
    if (S.a > 0) { c.textAlign = 'center'; c.font = M.NUMF(22); c.globalAlpha = 0.7; c.fillText('0', OX, OY + 20); }
    c.restore();
    // the strips: faint outlines until their block rises
    S.blk.forEach((B, j) => { const x0 = px(S.a + j * S.dx), x1 = px(S.a + (j + 1) * S.dx), h = S.h[j];
      const k = B.rise != null ? M.ease((t - B.rise) / B.riseDur) : 0, top = OY - h * S.uy * k, gl = B.glow != null ? Math.max(0, 1 - (t - B.glow) / 0.5) : 0;
      if (k <= 0) { c.save(); c.setLineDash([5, 5]); c.strokeStyle = 'rgba(122,60,40,0.45)'; c.lineWidth = 1.5; c.fillStyle = 'rgba(200,140,80,0.12)'; c.fillRect(x0 + 2, OY - 10, x1 - x0 - 4, 10);
        for (const xe of [S.a + j * S.dx, S.a + (j + 1) * S.dx]) { c.beginPath(); c.moveTo(px(xe), OY); c.lineTo(px(xe), py(Math.min(S.F.f(xe), S.ymax))); c.stroke(); } c.restore(); return; }
      c.save(); const gr = c.createLinearGradient(0, top, 0, OY); gr.addColorStop(0, M.mix(BLK[j], '#fff4c0', 0.3 + gl * 0.5)); gr.addColorStop(1, BLK[j]); c.fillStyle = gr;
      if (gl > 0) { c.shadowColor = '#ffe08a'; c.shadowBlur = 20 * gl; }
      c.fillRect(x0 + 1, top, x1 - x0 - 2, OY - top); c.shadowBlur = 0;
      // sandstone courses
      c.strokeStyle = 'rgba(110,50,30,0.35)'; c.lineWidth = 1; for (let y = OY - 14, r = 0; y > top + 2; y -= 14, r++) { c.beginPath(); c.moveTo(x0 + 1, y); c.lineTo(x1 - 1, y); c.stroke();
        const o = r % 2 ? 0.5 : 0; for (let u = o; u < 1; u += 0.5) { const xx = x0 + (x1 - x0) * u + 8; if (xx < x1 - 2) { c.beginPath(); c.moveTo(xx, y); c.lineTo(xx, y + 14); c.stroke(); } } }
      c.strokeStyle = '#6a3020'; c.lineWidth = 2; c.strokeRect(x0 + 1, top, x1 - x0 - 2, OY - top);
      // dust as it rises
      if (k < 1) { c.fillStyle = 'rgba(240,210,160,0.6)'; for (let i = 0; i < 6; i++) { const u = (i + 0.5) / 6; c.beginPath(); c.arc(x0 + (x1 - x0) * u, OY - 2 - Math.sin(k * Math.PI + i) * 5, 3 + 3 * (1 - k), 0, 7); c.fill(); } }
      c.restore(); });
    // the curve
    c.save(); c.strokeStyle = CURVE; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = 'rgba(255,240,200,0.8)'; c.shadowBlur = 6; c.beginPath();
    for (let i = 0; i <= 80; i++) { const x = S.b * i / 80, y = S.F.f(x); if (y > S.ymax * 1.06) break; i ? c.lineTo(px(x), py(y)) : c.moveTo(px(x), py(y)); } c.stroke(); c.restore();
    // the probe: a dashed line shoots up from the sample point to the curve
    if (S.probe && t >= S.probe.t0) { const k = M.ease((t - S.probe.t0) / S.probe.dur), x = px(S.probe.x), y = OY - (OY - py(S.probe.h)) * k;
      c.save(); c.setLineDash([6, 5]); c.lineDashOffset = -t * 30; c.strokeStyle = '#ffe08a'; c.shadowColor = '#ffb21f'; c.shadowBlur = 8; c.lineWidth = 3; c.beginPath(); c.moveTo(x, OY); c.lineTo(x, y); c.stroke(); c.restore(); }
    // dots where each height was read off the curve
    S.blk.forEach((B, j) => { if (B.dot == null) return; const k = M.clamp((t - B.dot) / 0.25, 0, 1), r = 6 * (1 + Math.sin(k * Math.PI) * 0.7);
      c.save(); c.fillStyle = '#fff6d0'; c.strokeStyle = CURVE; c.lineWidth = 2.5; c.beginPath(); c.arc(px(S.xs[j]), py(S.h[j]), r, 0, 7); c.fill(); c.stroke(); c.restore(); });
    // a wrong sample point: a ghost line rises to the curve in red and fades
    const miss = K.missInfo && K.missInfo.tap && /^x\d/.test(K.missInfo.tap) && t - K.missAt < 0.7 ? +K.missInfo.tap.slice(1) : null;
    if (miss != null) { const k = M.ease((t - K.missAt) / 0.3), x = px(miss); c.save(); c.globalAlpha = 1 - (t - K.missAt) / 0.7; c.setLineDash([6, 5]); c.strokeStyle = '#d8454a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, OY); c.lineTo(x, OY - (OY - py(Math.min(S.ymax, S.F.f(miss)))) * k); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'line'); S.ticks.forEach(x => M.drawEx(g, c, 'xl' + x));
    // the notes sit on a soft light patch so they read over the blocks and the curve
    for (const key of [S.fk, S.ak]) { if (!key) continue; const e = K.ex[key]; if (!e) continue; const m = e.node._m || M.lay(e.node, e.s), a = e.node.alpha ?? 1, wr = e.node.write ? M.clamp((t - e.node.write.t0) / e.node.write.dur, 0, 1) : 1;
      c.save(); c.globalAlpha = 0.85 * a; c.fillStyle = '#fff8e8'; c.beginPath(); c.roundRect(e.x - 6, e.y - m.a - 5, Math.max(14, (m.w + 12) * M.easeIO(wr)), m.a + m.d + 10, 9); c.fill(); c.restore(); M.drawEx(g, c, key); }
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', HX, HY - hopK * 18, 0.85, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', HX, HY, 0.85);
    M.drawUI(g, c);
  },
});
