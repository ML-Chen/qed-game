// geometry_tri.js — TRIANGLE AREA! A triangle is half of the rectangle around it: A = ½ × base × height.
// A sandstone pyramid face in the desert, drawn inside the dashed rectangle that has the same base and height. The base
// is written under it and the height beside the dashed altitude. Under it, a glass plate reads A = ½ × ?.
// Drag the base onto the height (or the height onto the base): A = ½ × 8 × 5. Tap 8 × 5: A = ½ × 40, and the whole
// rectangle lights up. Drag the ½ onto 40: A = 20, and the two corner pieces outside the triangle fade away, leaving
// the triangle, which is exactly half. Halving a factor first also works: drag the ½ onto an even 8 to make 4 × 5.
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
    const S = g.s; M.setup(g); const [b, h, f] = pick(g); Object.assign(S, { b, h, st: 0 });
    const u = Math.min(30, 270 / b, 180 / h); S.x0 = 180 - b * u / 2; S.x1 = 180 + b * u / 2; S.y1 = 396; S.y0 = S.y1 - h * u; S.ax = S.x0 + f * b * u;
    M.place(g, 'B', M.row(M.num(b, 'B')), 180, S.y1 + 34, 30, { col: INK });
    const hx = S.ax + (f < 0.5 ? 24 : -24); M.place(g, 'Hh', M.row(M.num(h, 'Hh')), hx, (S.y0 + S.y1) / 2 + 10, 30, { col: INK });
    S.rowY = 486; S.rectAt = null; S.halfAt = null;
    const half = () => M.frac(M.num(1), M.num(2), 'half');
    const setRow = (...rest) => { M.place(g, 'row', M.row(M.vr('A', 'Av'), M.op('=', 'eq'), ...rest), 180, S.rowY, 38, { col: INK }); M.inert(g, ['Av', 'eq']); };
    S.setRow = setRow; setRow(half(), M.op('×'), M.slot(null, { col: '#b08a5a' }));
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const mulRow = (p, q) => { const r = M.row(M.num(p, 'fp', { pop: g.t }), M.op('×'), M.num(q, 'fq', { pop: g.t })); r.id = 'mul'; return r; };
    const join = (g) => { S.st = 1; S.p = b; S.q = h; setRow(half(), M.op('×'), mulRow(b, h)); burst(g, 'mul'); };
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ drag: 'B', to: 'Hh', busy: 0.1, then: join }, { drag: 'Hh', to: 'B', busy: 0.1, then: join }];
        if (S.st === 1 || S.st === 4) {
          const out = [{ tap: 'mul', busy: 0.1, ask: { v: S.p * S.q, wrong: [S.p + S.q, S.p * S.q / 2, S.p * S.q + S.p, S.p * (S.q - 1)].filter(v => v !== S.p * S.q) },
            then() { }, resolve(g) {
              S.rectAt = S.rectAt ?? g.t; g.sfx('coin');
              if (S.st === 4) { S.st = 3; S.halfAt = g.t; setRow(M.num(S.p * S.q, 'res', { pop: g.t })); g.sfx('sparkle'); }
              else { S.st = 2; setRow(half(), M.op('×'), M.num(b * h, 'prod', { pop: g.t })); }
              burst(g, S.st === 3 ? 'res' : 'prod'); } }];
          // halving an even factor first is just as valid: ½ × 8 × 5 = 4 × 5
          if (S.st === 1) for (const [id, v] of [['fp', S.p], ['fq', S.q]]) if (v % 2 === 0) out.push({ drag: 'half', to: id, busy: 0.1, ask: { v: v / 2, wrong: [v * 2, v - 2, v + 1] }, then() { },
            resolve(g) { S.st = 4; if (id === 'fp') S.p = v / 2; else S.q = v / 2; setRow(mulRow(S.p, S.q)); g.sfx('pop'); burst(g, 'mul'); } });
          return out;
        }
        if (S.st === 2) return [{ drag: 'half', to: 'prod', busy: 0.1, area: [20, S.rowY - 50, 340, S.rowY + 20], ask: { v: b * h / 2, wrong: [b * h * 2, b * h - 2, b + h, b * h / 2 + 2] },
          then() { }, resolve(g) { S.st = 3; S.halfAt = g.t; setRow(M.num(b * h / 2, 'res', { pop: g.t })); g.sfx('sparkle'); burst(g, 'res'); } }];
        return [];
      },
      area(g) { return S.st === 0 ? ['B', 'Hh'] : S.st === 2 ? ['half', 'prod'] : 'mul'; },
    });
    M.inert(g, ['res']);
    function burst(g, id) { const bx = M.box(g, id); if (bx) g.burst(bx.x, bx.y, ['#ffd45a', '#ff9a4a', '#fff'], 10, 120); }
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, { x0, x1, y0, y1, ax } = S;
    SCN.bg(g, c, 'desert');
    // the rectangle around the triangle: dashed, and lit up once its area base × height is known
    const rk = S.rectAt == null ? 0 : M.clamp((t - S.rectAt) / 0.25, 0, 1), fade = S.halfAt == null ? 1 : 1 - M.clamp((t - S.halfAt) / 0.5, 0, 1);
    c.save(); c.fillStyle = `rgba(255,236,170,${(0.18 + rk * 0.42) * fade})`; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.setLineDash([8, 7]); c.strokeStyle = `rgba(110,60,20,${0.4 + 0.5 * fade})`; c.lineWidth = 2.5; c.strokeRect(x0, y0, x1 - x0, y1 - y0); c.restore();
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
    for (const id of ['B', 'Hh']) { const b = M.box(g, id); if (b) { c.fillStyle = 'rgba(255,248,230,0.85)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 8, b.y - b.h / 2 - 6, b.w + 16, b.h + 12, 9); c.fill(); } M.drawEx(g, c, id); }
    SCN.panel(c, 'glass', 180, S.rowY - 14, 236, 76, t); M.drawEx(g, c, 'row');
    SCN.host(g, c, 'fox', 300, 606, 1.2);
    M.drawUI(g, c);
  },
});
