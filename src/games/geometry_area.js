// geometry_area.js — AREA! The area of a rectangle is length × width.
// A garden bed seen from above in a spring meadow, with its side lengths on tags around it (both lengths and both widths).
// The player drags a length onto a width (or a width onto a length): the sign below the bed reads A = 6 × 4. Tapping
// 6 × 4 makes 24 while the bed's unit squares sprout one after another, numbered, so the count is visible.
// Dropping a length onto the opposite length (the perimeter mix-up) only wobbles.
// Level 0: 6 by 4. Level 1: up to 7 by 4. Level 2: up to 9 by 6. Medium mode: the tap asks for the product.
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
    const S = g.s; M.setup(g); const [a, b] = pick(g); Object.assign(S, { a, b });
    const cell = Math.min(36, 270 / a, 190 / b), cx = 180, cy = 306;
    S.cell = cell; S.x0 = cx - a * cell / 2; S.y0 = cy - b * cell / 2; S.x1 = S.x0 + a * cell; S.y1 = S.y0 + b * cell;
    const lab = (key, v, x, y) => M.place(g, key, M.row(M.num(v, key)), x, y + 10, 28, { col: INK });
    lab('Lt', a, cx, S.y0 - 24); lab('Lb', a, cx, S.y1 + 26); lab('Wl', b, S.x0 - 28, cy); lab('Wr', b, S.x1 + 28, cy);
    S.rowY = S.y1 + 98; S.fillAt = null;
    const setRow = (rest) => { S.row = M.row(M.vr('A', 'A'), M.op('=', 'eq'), rest); M.place(g, 'row', S.row, 180, S.rowY, 40, { col: SIGN }); M.inert(g, ['A', 'eq']); };
    setRow(M.slot(null, { col: '#d8b080' }));
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const lens = ['Lt', 'Lb'], wids = ['Wl', 'Wr'];
    M.play(g, {
      moves(g) {
        if (!S.timesUp) {
          // a length goes onto a width, or a width onto a length; the opposite side of the same kind is the wrong pair
          const join = (g, from, to) => {
            S.timesUp = true; [from, to].forEach(id => { const n = M.node(g, id); if (n) n.pop = g.t; });
            const mul = M.row(M.num(a, null, { pop: g.t }), M.op('×'), M.num(b, null, { pop: g.t })); mul.id = 'mul'; setRow(mul);
            const bx = M.box(g, 'mul'); if (bx) g.burst(bx.x, bx.y, ['#ffd45a', '#9ae07a', '#fff'], 10, 120);
          };
          return [...lens.map(id => ({ drag: id, to: wids, busy: 0.1, then: join })), ...wids.map(id => ({ drag: id, to: lens, busy: 0.1, then: join }))];
        }
        if (!S.areaDone) return [{ tap: 'mul', busy: 0.1, ask: { v: a * b, wrong: [2 * (a + b), a + b, a * b + a, a * (b - 1)] },
          then() { S.areaDone = true; },
          resolve(g) { setRow(M.num(a * b, 'res', { pop: g.t })); M.inert(g, ['res']); S.fillAt = g.t; g.sfx('coin'); g.sfx('sparkle'); } }];
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
      const x = S.x0 + i * cs, y = S.y0 + j * cs, k = S.fillAt == null ? 0 : M.clamp((t - S.fillAt - n * 0.014) / 0.18, 0, 1);
      c.fillStyle = (i + j) % 2 ? '#62402a' : '#6a462e'; c.fillRect(x + 1, y + 1, cs - 2, cs - 2);
      if (k > 0) { const sc = M.ease(k) * (1 + Math.sin(k * Math.PI) * 0.25), w = (cs - 4) * sc;
        c.fillStyle = (i + j) % 2 ? '#7ac860' : '#8ad46a'; c.fillRect(x + cs / 2 - w / 2, y + cs / 2 - w / 2, w, w);
        c.fillStyle = ['#ffd45a', '#ff8aa8', '#fff', '#c8a0ff'][n % 4]; c.beginPath(); c.arc(x + cs * 0.28, y + cs * 0.28, cs * 0.09 * sc, 0, 7); c.fill();
        c.fillStyle = 'rgba(30,60,20,0.85)'; c.font = M.NUMF(Math.round(cs * 0.36)); c.textAlign = 'center'; c.textBaseline = 'middle'; c.globalAlpha = k; c.fillText(n + 1, x + cs * 0.56, y + cs * 0.6); c.globalAlpha = 1; }
    }
    c.strokeStyle = 'rgba(255,240,210,0.45)'; c.lineWidth = 1.2; c.beginPath();
    for (let i = 1; i < S.a; i++) { c.moveTo(S.x0 + i * cs, S.y0); c.lineTo(S.x0 + i * cs, S.y1); }
    for (let j = 1; j < S.b; j++) { c.moveTo(S.x0, S.y0 + j * cs); c.lineTo(S.x1, S.y0 + j * cs); } c.stroke(); c.restore();
    ['Lt', 'Lb', 'Wl', 'Wr'].forEach((id, k) => { tag(c, M.box(g, id), t, k); M.drawEx(g, c, id); });
    // the sign under the bed, where the area is worked out
    SCN.panel(c, 'sign', 180, S.rowY - 14, 210, 64, t); M.drawEx(g, c, 'row');
    SCN.host(g, c, 'rabbit', 52, 600, 1.2);
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', 318 + Math.sin(t * 1.3) * 6, 596, 0.9, { t, facing: -1, pose: g.done && g.result === 'win' ? 'cheer' : 'idle' }); } catch (e) { }
    M.drawUI(g, c);
  },
});
