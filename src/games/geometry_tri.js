// geometry_tri.js — TRIANGLE AREA! A triangle is half of the rectangle around it: A = ½ × base × height.
// A sandstone pyramid face in the desert, drawn inside the dashed rectangle that has the same base and height. The base
// is written under it and the height beside the dashed altitude. Under it, a glass plate reads A = ½ × ?.
// Drag the base onto the height (or the height onto the base): the base edge and the altitude glow, the rectangle with
// the same base and height draws itself around the triangle, and 8 and 5 fly down: A = ½ × 8 × 5. Tap 8 × 5:
// "8 × 5 = 40" is written above the rectangle, which fills with light, and 40 flies down: A = ½ × 40. Drag the ½ onto 40:
// the two corner pieces outside the triangle flip over onto it and cover it exactly (so it is half), "40 ÷ 2 = 20" is
// written and 20 flies down: A = 20. Halving an even factor first also works: the ½ onto the 8 makes 4 × 5.
// Level 0: base 8, height 5. Level 1: even base. Level 2: any base and height with an even product.
// Medium mode: each computation (the product, the half) asks for its result.
const M = MK, INK = '#3a2214';
function pick(g) {
  const r = k => Math.floor(g.rand() * k);
  if (g.level === 0) return [8, 5, 0.32];
  if (g.level === 1) return [[6, 8, 10][r(3)], 3 + r(5), 0.2 + g.rand() * 0.5];
  for (;;) { const b = 4 + r(7), h = 3 + r(7); if ((b * h) % 2 === 0 && b !== h) return [b, h, 0.15 + g.rand() * 0.6]; }
}

MG.add({
  id: 'geometry_tri', stage: 'geometry', cmd: 'TRIANGLE AREA!', hint: 'drag', time: 10, mood: 'desert', winText: 'Half!', hold: 1.4,
  card: {
    title: 'Area of a triangle', ref: 'Grade 6', kind: 'Geometry',
    text: 'The base of a triangle is the side it sits on. The height is the straight-up distance from the base to the top corner, measured at a right angle to the base.\n\nDraw a rectangle around the triangle with the same base and the same height. The triangle covers exactly half of that rectangle, because the two pieces outside the triangle fit together to make another copy of the triangle. The rectangle\'s area is base × height, so the triangle\'s area is half of that.\n\nFor example, a triangle with base 8 and height 5 has area ½ × 8 × 5 = ½ × 40 = 20 square units.',
    note: 'Area of a triangle = ½ × base × height. Multiply the base by the height, then take half.',
    ask: 'What is the area of a triangle with base 6 and height 7? With base 10 and height 3?',
  },
  init(g) {
    const S = g.s; M.setup(g); const [b, h, f] = pick(g); Object.assign(S, { b, h, st: 0 }); const T = M.pace(g);
    const u = Math.min(30, 270 / b, 180 / h); S.x0 = 180 - b * u / 2; S.x1 = 180 + b * u / 2; S.y1 = 396; S.y0 = S.y1 - h * u; S.ax = S.x0 + f * b * u;
    M.place(g, 'B', M.row(M.num(b, 'B')), 180, S.y1 + 34, 30, { col: INK });
    const hx = S.ax + (f < 0.5 ? 24 : -24); M.place(g, 'Hh', M.row(M.num(h, 'Hh')), hx, (S.y0 + S.y1) / 2 + 10, 30, { col: INK });
    S.rowY = 486; S.rectAt = null; S.halfAt = null; S.drawRect = null;
    S.Av = M.vr('A', 'Av'); S.eq = M.op('=', 'eq'); S.hf = M.frac(M.num(1), M.num(2), 'half'); S.x = M.op('×');
    const setRow = (...rest) => { M.place(g, 'row', M.row(S.Av, S.eq, ...rest), 180, S.rowY, 38, { col: INK }); M.inert(g, ['Av', 'eq']); };
    S.setRow = setRow; setRow(S.hf, S.x, M.slot(null, { col: '#b08a5a' }));
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = g => { S.mk.lastMove = g.t; };
    const mulRow = (p, q, o = {}) => { const r = M.row(M.num(p, 'fp', o), M.op('×', null, o), M.num(q, 'fq', o)); r.id = 'mul'; return r; };
    // 1. base × height: the base edge and the altitude glow, the dashed rectangle draws itself around the triangle, and
    //    both numbers fly down into the plate
    const join = (g) => { S.st = 1; S.p = b; S.q = h; M.show(g, 1.1 * T); hop(g); g.sfx('swoosh');
      M.circle(g, 'B', { dur: 0.45 * T, col: '#ffb21f' }); M.circle(g, 'Hh', { delay: 0.15 * T, dur: 0.45 * T, col: '#ffb21f' });
      S.edgeAt = g.t; S.drawRect = { t0: g.t + 0.2 * T, dur: 0.55 * T };
      M.at(g, [[0.4 * T, g => { const r = mulRow(b, h, { alpha: 0 }); setRow(S.hf, S.x, r); const [np, , nq] = r.items;
        [['B', np, 'fp', 0], ['Hh', nq, 'fq', 0.12 * T]].forEach(([src, nd, dst, d]) => M.fly(g, { node: M.num(nd.v, null, { col: INK }), from: src, to: dst, delay: d, dur: 0.42 * T, arc: -40, s0: 30, s1: 38,
          then(g) { nd.alpha = 1; nd.pop = g.t; r.items[1].alpha = 1; M.sparkle(g, dst, { n: 6 }); g.sfx('pop'); hop(g); } })); }]]); };
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ drag: 'B', to: 'Hh', busy: 0.1, then: join }, { drag: 'Hh', to: 'B', busy: 0.1, then: join }];
        if (S.st === 1 || S.st === 4) {
          // 2. tap 8 × 5: "8 × 5 = 40" is written beside the rectangle, which fills with light, and 40 flies down into the plate
          const out = [{ tap: 'mul', busy: 0.1, askAt: 0.75 * T, after: 1.3 * T, ask: { v: S.p * S.q, wrong: [S.p + S.q, S.p * S.q / 2, S.p * S.q + S.p, S.p * (S.q - 1)].filter(v => v !== S.p * S.q) },
            then(g) { M.show(g, 0.75 * T); M.indicate(g, 'mul', { dur: 0.4 * T, sc: 1.1 }); hop(g);
              S.prodNote = M.row(M.num(S.p), M.op('×'), M.num(S.q), M.op('='), S.pq = M.num(S.p * S.q, 'pqv', { alpha: 0 }));
              M.place(g, 'pn', S.prodNote, 180, S.y0 - 18, 28, { col: '#5a2a10' }); M.writeIn(g, S.prodNote, { dur: 0.4 * T, delay: 0.1 * T });
              S.rectAt = S.rectAt ?? g.t + 0.3 * T; if (S.st === 4) S.cutAt = g.t; },
            resolve(g) { M.show(g, 1.3 * T); S.pq.alpha = 1; M.writeIn(g, S.pq, { dur: 0.2 * T }); M.indicate(g, S.pq, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding');
              const v = S.p * S.q, fin = S.st === 4;
              M.at(g, [[0.9 * T, g => { const from = { ...M.box(g, 'pqv') }; M.tween(g, S.prodNote, { alpha: 0 }, 0.25 * T); for (const q of M.node(g, 'mul').items) M.tween(g, q, { alpha: 0 }, 0.15 * T, { delay: 0.15 * T }); // 8 × 5 gives way as 40 lands
                const res = M.num(v, fin ? 'res' : 'prod', { alpha: 0, _born: -1 });
                M.fly(g, { node: M.num(v, null, { col: INK }), from: [from.x, from.y], to: 'mul', dur: 0.32 * T, arc: -30, s0: 28, s1: 38,
                  then(g) { S.st = fin ? 3 : 2; if (fin) { S.halfAt = g.t; setRow(res); g.sfx('sparkle'); } else setRow(S.hf, S.x, res); res.alpha = 1; res.pop = g.t; delete S.mk.ex.pn; g.sfx('coin'); M.sparkle(g, res, { n: 10 }); hop(g); } }); }]]); } }];
          // halving an even factor first is just as valid: ½ × 8 × 5 = 4 × 5 (the ½ lands on the 8 and a "÷ 2" note splits it)
          if (S.st === 1) for (const [id, v] of [['fp', S.p], ['fq', S.q]]) if (v % 2 === 0) out.push({ drag: 'half', to: id, busy: 0.1, askAt: 0.6 * T, after: 0.6 * T, ask: { v: v / 2, wrong: [v * 2, v - 2, v + 1] },
            then(g) { M.show(g, 0.6 * T); hop(g); M.light(g, S.hf); M.circle(g, id, { dur: 0.45 * T });
              M.note(g, { node: M.row(M.num(v), M.op('÷'), M.num(2)), at: id, off: [0, -44], s: 26, col: '#7a3a10', write: 0.35 * T, hold: 0.5 * T, fade: 0.2 * T }); },
            resolve(g) { const nd = M.node(g, id); M.roll(g, nd, v / 2, { dur: 0.3 * T }); M.tween(g, S.hf, { alpha: 0 }, 0.25 * T); M.sparkle(g, id, { delay: 0.25 * T }); g.sfx('pop'); M.show(g, 0.6 * T);
              M.at(g, [[0.45 * T, g => { S.st = 4; if (id === 'fp') S.p = v / 2; else S.q = v / 2; const r = M.node(g, 'mul'); setRow(r); hop(g); }]]); } });
          return out;
        }
        // 3. drag the ½ onto 40: the triangle's two outside corners are cut off and swing over onto the triangle, covering
        //    it exactly, so the triangle is half the rectangle; "40 ÷ 2 = 20" is written and 20 lands in the plate
        if (S.st === 2) return [{ drag: 'half', to: 'prod', busy: 0.1, area: [20, S.rowY - 50, 340, S.rowY + 20], askAt: 0.9 * T, after: 1.3 * T, ask: { v: b * h / 2, wrong: [b * h * 2, b * h - 2, b + h, b * h / 2 + 2] },
          then(g) { S.st = 5; M.show(g, 0.9 * T); hop(g); M.light(g, S.hf); M.circle(g, 'prod', { dur: 0.45 * T }); // the ½ stays in the line, lit, while the corners flip S.cutAt = g.t; g.sfx('swoosh');
            S.halfNote = M.row(M.num(b * h), M.op('÷'), M.num(2), M.op('='), S.hq = M.num(b * h / 2, 'hqv', { alpha: 0 }));
            M.place(g, 'pn', S.halfNote, 180, S.y0 - 18, 28, { col: '#5a2a10' }); M.writeIn(g, S.halfNote, { dur: 0.4 * T, delay: 0.4 * T }); },
          resolve(g) { M.show(g, 1.3 * T); S.hq.alpha = 1; M.writeIn(g, S.hq, { dur: 0.2 * T }); M.indicate(g, S.hq, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding');
            M.at(g, [[0.9 * T, g => { const from = { ...M.box(g, 'hqv') }; M.tween(g, S.halfNote, { alpha: 0 }, 0.25 * T); for (const q of [M.node(g, 'prod'), S.x, S.hf]) M.tween(g, q, { alpha: 0 }, 0.15 * T, { delay: 0.15 * T }); // ½ × 40 gives way as 20 lands
              const res = M.num(b * h / 2, 'res', { alpha: 0, _born: -1 });
              M.fly(g, { node: M.num(b * h / 2, null, { col: INK }), from: [from.x, from.y], to: 'prod', dur: 0.32 * T, arc: -30, s0: 28, s1: 38,
                then(g) { S.st = 3; S.halfAt = g.t; setRow(res); res.alpha = 1; res.pop = g.t; delete S.mk.ex.pn; g.sfx('coin'); g.sfx('sparkle'); M.sparkle(g, res, { n: 12 }); hop(g); } }); }]]); } }];
        return [];
      },
      area(g) { return S.st === 0 ? ['B', 'Hh'] : S.st === 2 ? ['half', 'prod'] : 'mul'; },
    });
    M.inert(g, ['res', 'pqv', 'hqv']);
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, { x0, x1, y0, y1, ax } = S;
    SCN.bg(g, c, 'desert');
    // the rectangle around the triangle: dashed, drawing itself on move 1, lit up once its area base × height is known
    const T = M.pace(g), rk = S.rectAt == null ? 0 : M.clamp((t - S.rectAt) / 0.3, 0, 1), fade = S.halfAt == null ? 1 : 1 - M.clamp((t - S.halfAt) / 0.5, 0, 1);
    const dk = S.drawRect ? M.clamp((t - S.drawRect.t0) / S.drawRect.dur, 0, 1) : 0, per = 2 * (x1 - x0 + y1 - y0);
    c.save(); c.fillStyle = `rgba(255,236,170,${(0.06 + 0.12 * dk + rk * 0.42) * fade})`; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.setLineDash([8, 7]); c.strokeStyle = `rgba(110,60,20,${0.25 + 0.65 * fade})`; c.lineWidth = 2.5;
    if (dk < 1) { c.strokeStyle = 'rgba(110,60,20,0.25)'; c.strokeRect(x0, y0, x1 - x0, y1 - y0); }
    if (dk > 0) { c.strokeStyle = `rgba(110,60,20,${0.4 + 0.5 * fade})`; c.setLineDash([]); c.save(); c.setLineDash([8, 7]);
      // trace from the bottom-left corner up, across the top and down the right side
      const pts = [[x0, y1], [x0, y0], [x1, y0], [x1, y1]], seg = [y1 - y0, x1 - x0, y1 - y0], tot = seg[0] + seg[1] + seg[2]; let left = tot * M.easeIO(dk);
      c.beginPath(); c.moveTo(x0, y1); for (let i = 0; i < 3 && left > 0; i++) { const k = Math.min(1, left / seg[i]); left -= seg[i]; c.lineTo(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k); }
      if (dk < 1) { c.shadowColor = '#ffb21f'; c.shadowBlur = 10; c.strokeStyle = '#c86a10'; } c.stroke(); c.restore(); }
    // base edge and altitude glow while base × height is picked up
    if (S.edgeAt != null && t - S.edgeAt < 0.9 * T) { const k = (t - S.edgeAt) / (0.9 * T), a = Math.sin(k * Math.PI); c.strokeStyle = `rgba(255,190,40,${a})`; c.shadowColor = '#ffb21f'; c.shadowBlur = 12; c.lineWidth = 6; c.lineCap = 'round'; c.setLineDash([]);
      c.beginPath(); c.moveTo(x0, y1 + 3); c.lineTo(x1, y1 + 3); c.moveTo(ax, y0); c.lineTo(ax, y1); c.stroke(); c.shadowBlur = 0; }
    c.restore();
    // the pyramid face: sandstone with courses of blocks, glowing when it is shown to be half
    c.save(); c.beginPath(); c.moveTo(x0, y1); c.lineTo(ax, y0); c.lineTo(x1, y1); c.closePath();
    const gr = c.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, '#f2cc84'); gr.addColorStop(1, '#c8904c'); c.fillStyle = gr; c.fill(); c.save(); c.clip();
    c.strokeStyle = 'rgba(120,70,30,0.35)'; c.lineWidth = 1.2; for (let y = y1 - 14, k = 0; y > y0; y -= 14, k++) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); for (let x = x0 + (k % 2) * 14; x < x1; x += 28) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 14); c.stroke(); } }
    c.restore();
    const hk = S.halfAt == null ? 0 : Math.abs(Math.sin((t - S.halfAt) * 5)) * Math.max(0, 1 - (t - S.halfAt) / 1.2);
    c.lineJoin = 'round'; c.strokeStyle = '#7a4a1a'; c.lineWidth = 3.5; c.stroke(); if (hk > 0) { c.strokeStyle = `rgba(255,240,150,${hk})`; c.lineWidth = 8; c.stroke(); }
    // the altitude, with its right-angle mark
    c.setLineDash([5, 5]); c.strokeStyle = '#5a2a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(ax, y0); c.lineTo(ax, y1); c.stroke(); c.setLineDash([]);
    const sgn = ax < 180 ? 1 : -1; c.strokeRect(Math.min(ax, ax + sgn * 11), y1 - 11, 11, 11); c.restore();
    // move 3: the two pieces of the rectangle outside the triangle are cut off and each flips over its slanted edge onto
    // the triangle (a half-turn about the middle of that edge), covering it exactly: the triangle is half the rectangle
    if (S.cutAt != null) { const k = M.clamp((t - S.cutAt - 0.1 * T) / (0.6 * T), 0, 1), e = M.easeIO(k), fadeOut = S.halfAt == null ? 1 : 1 - M.clamp((t - S.halfAt) / 0.4, 0, 1);
      for (const [cx, mx] of [[x0, (x0 + ax) / 2], [x1, (x1 + ax) / 2]]) { const my = (y0 + y1) / 2; c.save(); c.globalAlpha = 0.85 * fadeOut;
        c.translate(mx, my); c.rotate(Math.PI * e * (cx < ax ? 1 : -1)); c.translate(-mx, -my);
        c.beginPath(); c.moveTo(cx, y1); c.lineTo(cx, y0); c.lineTo(ax, y0); c.closePath(); c.fillStyle = 'rgba(255,214,120,0.75)'; c.fill(); c.strokeStyle = '#c86a10'; c.lineWidth = 2; c.setLineDash([5, 4]); c.stroke(); c.restore(); } }
    for (const id of ['B', 'Hh']) { const b = M.box(g, id); if (b) { c.fillStyle = 'rgba(255,248,230,0.85)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 8, b.y - b.h / 2 - 6, b.w + 16, b.h + 12, 9); c.fill(); } M.drawEx(g, c, id); }
    SCN.panel(c, 'glass', 180, S.rowY - 14, 236, 76, t); M.drawEx(g, c, 'row'); M.drawEx(g, c, 'pn');
    SCN.host(g, c, 'fox', 300, 606, 1.2);
    M.drawUI(g, c);
  },
});
