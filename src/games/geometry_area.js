// geometry_area.js — AREA! The area of a rectangle is length × width.
// A garden bed seen from above in a spring meadow, with its side lengths on tags around it (both lengths and both widths).
// The player drags a length onto a width (or a width onto a length): the length runs along the top edge in gold, the
// width down the left edge, and both numbers fly down to the sign: A = 6 × 4. Tapping 6 × 4 sprouts the bed row by
// row while a gold count beside the current row rolls up by 6 (6, 12, 18, 24), then flies into the sign: A = 24.
// Dropping a length onto the opposite length (the perimeter mix-up) only wobbles.
// Level 0: 6 by 4. Level 1: up to 7 by 4. Level 2: up to 9 by 6. Medium mode: the tray asks for the product once the first row has sprouted.
const M = MK, INK = '#3a2214', SIGN = '#fff4dc';
function pick(g) {
  const r = k => Math.floor(g.rand() * k);
  if (g.level === 0) return [6, 4];
  if (g.level === 1) return [4 + r(4), 2 + r(3)];
  const a = 5 + r(5), b = 3 + r(4); return [a === b ? a + 1 : a, b];
}
function tag(c, b, t, k) {
  if (!b) return; const w = Math.max(b.w + 18, 40), h = b.h + 14, y = b.y + Math.sin(t * 2 + k) * 1.2;
  c.save(); c.fillStyle = 'rgba(40,30,10,0.25)'; c.beginPath(); c.roundRect(b.x - w / 2 + 2, y - h / 2 + 4, w, h, 10); c.fill();
  c.fillStyle = '#fffaf0'; c.beginPath(); c.roundRect(b.x - w / 2, y - h / 2, w, h, 10); c.fill(); c.strokeStyle = '#c89a5a'; c.lineWidth = 2; c.stroke(); c.restore();
}

MG.add({
  id: 'geometry_area', stage: 'geometry', cmd: 'AREA!', hint: 'drag', time: 9, mood: 'bright', winText: 'Planted!', hold: 1.4,
  card: {
    title: 'Area of a rectangle', ref: 'Grade 3', kind: 'Geometry',
    text: 'Area is how much flat space a shape covers. We measure it in unit squares: squares that are 1 unit long on each side.\n\nA rectangle is a four-sided shape with square corners. Its length is how long it is, and its width is how wide it is. To find its area, multiply the length by the width.\n\nFor example, a rectangle 6 units long and 4 units wide has 4 rows of 6 squares. That is 6 × 4 = 24 unit squares, so its area is 24 square units.\n\nThis works because multiplying is a fast way to count rows that are all the same size.',
    note: 'Area of a rectangle = length × width. The answer is in square units.',
    ask: 'What is the area of a rectangle 7 long and 3 wide? A square has sides of 5. What is its area?',
  },
  init(g) {
    const S = g.s; M.setup(g); const [a, b] = pick(g); Object.assign(S, { a, b }); const T = M.pace(g);
    const cell = Math.min(36, 270 / a, 190 / b), cx = 180, cy = 306;
    S.cell = cell; S.x0 = cx - a * cell / 2; S.y0 = cy - b * cell / 2; S.x1 = S.x0 + a * cell; S.y1 = S.y0 + b * cell;
    const lab = (key, v, x, y) => M.place(g, key, M.row(M.num(v, key)), x, y + 10, 28, { col: INK });
    lab('Lt', a, cx, S.y0 - 24); lab('Lb', a, cx, S.y1 + 26); lab('Wl', b, S.x0 - 28, cy); lab('Wr', b, S.x1 + 28, cy);
    S.rowY = S.y1 + 98; S.rowAt = [];
    const Av = M.vr('A', 'A'), eq = M.op('=', 'eq'); // reused, so they stay put while the right-hand side changes
    const setRow = (rest) => { S.row = M.row(Av, eq, rest); M.place(g, 'row', S.row, 180, S.rowY, 40, { col: SIGN }); M.inert(g, ['A', 'eq']); };
    setRow(M.slot(null, { col: '#d8b080' }));
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const lens = ['Lt', 'Lb'], wids = ['Wl', 'Wr'], hop = g => { S.mk.lastMove = g.t; };
    // a gold line runs along one side of the bed: the length (top edge) or the width (left edge)
    const trace = (g, side, o = {}) => M.anim(g, { delay: o.delay, dur: 0.4 * T, linger: o.linger ?? 0.5 * T, draw(c, g, k, t) {
      const e = M.easeIO(k), al = t > 0.4 * T ? 1 - (t - 0.4 * T) / (o.linger ?? 0.5 * T) : 1; c.globalAlpha = M.clamp(al, 0, 1);
      c.strokeStyle = '#ffd45a'; c.shadowColor = '#ffd45a'; c.shadowBlur = 12; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath();
      if (side === 'L') { c.moveTo(S.x0, S.y0 - 6); c.lineTo(S.x0 + (S.x1 - S.x0) * e, S.y0 - 6); } else { c.moveTo(S.x0 - 6, S.y0); c.lineTo(S.x0 - 6, S.y0 + (S.y1 - S.y0) * e); } c.stroke(); } });
    // the running count rides down the right side of the bed, one row at a time
    const cntAt = j => { const y = S.y0 + (j + 0.5) * cell; S.cy0 = S.cnt ? cntY(g) : y; S.cy1 = y; S.cT = g.t; };
    const cntY = g => S.cT == null ? S.y0 : M.lerp(S.cy0, S.cy1, M.ease((g.t - S.cT) / (0.2 * T)));
    S.cntY = cntY;
    const fillRow = (g, j) => { S.rowAt[j] = g.t; g.sfx(j ? 'pop' : 'tap'); hop(g); };
    M.play(g, {
      moves(g) {
        if (!S.timesUp) {
          // a length goes onto a width, or a width onto a length; the opposite side of the same kind is the wrong pair
          const join = (g, from, to) => {
            S.timesUp = true; M.show(g, 1.1 * T); hop(g); g.sfx('swoosh');
            const L = lens.includes(from) ? from : to, Wd = wids.includes(from) ? from : to;
            M.circle(g, L, { dur: 0.45 * T, col: '#ffd45a' }); trace(g, 'L', { linger: 0.6 * T });
            M.circle(g, Wd, { delay: 0.3 * T, dur: 0.45 * T, col: '#ffd45a' }); trace(g, 'W', { delay: 0.3 * T, linger: 0.4 * T });
            M.at(g, [[0.45 * T, g => {
              const na = M.num(a, 'ma', { alpha: 0 }), nb = M.num(b, 'mb', { alpha: 0 }), mul = M.row(na, M.op('×'), nb); mul.id = 'mul'; setRow(mul);
              [[L, 'ma', na, 0], [Wd, 'mb', nb, 0.12 * T]].forEach(([src, dst, nd, d]) => M.fly(g, { node: M.num(nd.v, null, { col: SIGN }), from: src, to: dst, delay: d, dur: 0.42 * T, arc: -50, s0: 28, s1: 40,
                then(g) { nd.alpha = 1; nd.pop = g.t; M.sparkle(g, dst, { n: 6 }); g.sfx('pop'); hop(g); } })); }]]);
          };
          return [...lens.map(id => ({ drag: id, to: wids, busy: 0.1, then: join })), ...wids.map(id => ({ drag: id, to: lens, busy: 0.1, then: join }))];
        }
        // 6 × 4: the first row of 6 sprouts, then (after the tray in medium mode) the other rows, the count rolling up by 6 each time
        const rt = Math.min(0.26, 1.0 / Math.max(1, b - 1)) * T, rest = (b - 1) * rt + 0.9 * T;
        if (!S.areaDone) return [{ tap: 'mul', busy: 0.1, askAt: 0.8 * T, after: rest, ask: { v: a * b, wrong: [2 * (a + b), a + b, a * b + a, a * (b - 1)] },
          then(g) { S.areaDone = true; M.show(g, 0.8 * T); M.indicate(g, 'mul', { dur: 0.4 * T, sc: 1.08 }); trace(g, 'L', { linger: 0.3 * T });
            M.tween(g, 'Wr', { alpha: 0 }, 0.2 * T);
            M.at(g, [[0.25 * T, g => { fillRow(g, 0); cntAt(0); S.cnt = M.num(a, null, { alpha: 0 }); }],
              [0.25 * T + 0.03 * a * T, g => { S.cnt.alpha = 1; S.cnt.pop = g.t; }]]); },
          resolve(g) { M.show(g, rest);
            const steps = []; for (let j = 1; j < b; j++) steps.push([(j - 1) * rt + 0.02, g => { fillRow(g, j); cntAt(j); M.at(g, [[Math.min(0.035 * a * T, rt * 0.45), g => M.roll(g, S.cnt, a * (j + 1), { dur: Math.min(0.18 * T, rt * 0.5) })]]); }]);
            steps.push([(b - 1) * rt + 0.2 * T, g => { S.cnt.pop = g.t; M.sparkle(g, [S.x1 + 28, cntY(g)], { n: 8 }); g.sfx('ding'); }]);
            steps.push([(b - 1) * rt + 0.42 * T, g => { const from = { x: S.x1 + 28, y: cntY(g) }; S.cnt = null; M.tween(g, 'Wr', { alpha: 1 }, 0.25 * T);
              for (const q of S.row.items[2].items) M.tween(g, q, { alpha: 0 }, 0.2 * T);
              M.fly(g, { node: M.num(a * b, null, { col: SIGN }), from: [from.x, from.y], to: 'mul', dur: 0.34 * T, arc: -40, s0: 24, s1: 40,
                then(g) { setRow(M.num(a * b, 'res', { _born: -1, pop: g.t })); M.inert(g, ['res']); M.sparkle(g, 'res', { n: 12, cols: ['#ffd45a', '#9ae07a', '#fff'] }); g.sfx('coin'); g.sfx('sparkle'); hop(g); } }); }]);
            M.at(g, steps); } }];
        return [];
      },
      area(g) { return S.timesUp ? 'mul' : ['Lt', 'Wl']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); },
  up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, cs = S.cell;
    SCN.bg(g, c, 'meadow');
    // the garden bed: plank border, dark soil, string lines marking the unit squares
    c.save(); c.fillStyle = 'rgba(40,30,10,0.25)'; c.fillRect(S.x0 - 6, S.y0 + 2, S.x1 - S.x0 + 16, S.y1 - S.y0 + 14);
    c.fillStyle = '#a8703f'; c.fillRect(S.x0 - 9, S.y0 - 9, S.x1 - S.x0 + 18, S.y1 - S.y0 + 18);
    c.fillStyle = '#6e4524'; c.fillRect(S.x0 - 3, S.y0 - 3, S.x1 - S.x0 + 6, S.y1 - S.y0 + 6);
    c.fillStyle = '#5a3a24'; c.fillRect(S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0);
    let n = 0;
    for (let j = 0; j < S.b; j++) for (let i = 0; i < S.a; i++, n++) {
      const x = S.x0 + i * cs, y = S.y0 + j * cs, r0 = S.rowAt[j], k = r0 == null ? 0 : M.clamp((t - r0 - i * 0.03 * M.pace(g)) / 0.18, 0, 1);
      c.fillStyle = (i + j) % 2 ? '#62402a' : '#6a462e'; c.fillRect(x + 1, y + 1, cs - 2, cs - 2);
      if (k > 0) { const sc = M.ease(k) * (1 + Math.sin(k * Math.PI) * 0.25), w = (cs - 4) * sc;
        c.fillStyle = (i + j) % 2 ? '#7ac860' : '#8ad46a'; c.fillRect(x + cs / 2 - w / 2, y + cs / 2 - w / 2, w, w);
        c.fillStyle = 'rgba(40,90,30,0.55)'; c.beginPath(); c.ellipse(x + cs * 0.4, y + cs * 0.56, cs * 0.12 * sc, cs * 0.06 * sc, -0.6, 0, 7); c.ellipse(x + cs * 0.6, y + cs * 0.56, cs * 0.12 * sc, cs * 0.06 * sc, 0.6, 0, 7); c.fill();
        c.fillStyle = ['#ffd45a', '#ff8aa8', '#fff', '#c8a0ff'][n % 4]; c.beginPath(); c.arc(x + cs * 0.5, y + cs * 0.38, cs * 0.1 * sc, 0, 7); c.fill(); }
    }
    c.strokeStyle = 'rgba(255,240,210,0.45)'; c.lineWidth = 1.2; c.beginPath();
    for (let i = 1; i < S.a; i++) { c.moveTo(S.x0 + i * cs, S.y0); c.lineTo(S.x0 + i * cs, S.y1); }
    for (let j = 1; j < S.b; j++) { c.moveTo(S.x0, S.y0 + j * cs); c.lineTo(S.x1, S.y0 + j * cs); } c.stroke(); c.restore();
    ['Lt', 'Lb', 'Wl', 'Wr'].forEach((id, k) => { const nd = M.node(g, id), al = nd && nd.alpha != null ? nd.alpha : 1; if (al <= 0.01) return; c.save(); c.globalAlpha = al; tag(c, M.box(g, id), t, k); c.restore(); M.drawEx(g, c, id); });
    // the running count, on a gold seed packet riding beside the row that is sprouting
    if (S.cnt && S.cnt.alpha > 0) { const nd = S.cnt, x = S.x1 + 28, y = S.cntY(g), m = M.lay(nd, 24); c.save(); c.translate(x, y); c.fillStyle = 'rgba(40,30,10,0.25)'; c.beginPath(); c.arc(2, 4, 21, 0, 7); c.fill();
      c.fillStyle = '#ffd45a'; c.strokeStyle = '#8a5a14'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 21, 0, 7); c.fill(); c.stroke(); M.draw(c, nd, -m.w / 2, (m.a - m.d) / 2, 24, { t, col: '#3a2214' }); c.restore(); }
    // the sign under the bed, where the area is worked out
    SCN.panel(c, 'sign', 180, S.rowY - 14, 210, 64, t); M.drawEx(g, c, 'row');
    SCN.host(g, c, 'rabbit', 52, 600, 1.2);
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', 318 + Math.sin(t * 1.3) * 6, 596, 0.9, { t, facing: -1, pose: g.done && g.result === 'win' ? 'cheer' : 'idle' }); } catch (e) { }
    M.drawUI(g, c);
  },
});
