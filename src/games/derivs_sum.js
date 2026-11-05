// derivs_sum.js — SUM RULE! The derivative of a sum is the sum of the derivatives: d/dx (f + g) = f′ + g′.
// A wooden beach sign: d/dx (x³ + x²) on top, and under it "= □ + □", one slot per term. The player drags the d/dx onto
// each term (or its slot), in any order; that term's power rule happens in the one drag and its slot fills with the
// derivative. A constant term becomes 0.
// Level 0: x^n + x^m. Level 1: ax^n + bx^m. Level 2: three terms, the last a constant or a plain x.
// Medium mode: each drag opens the tray for that term's derivative (wrong tiles: power not lowered, not multiplied, added).
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), COLS = ['#ffd45a', '#9ae0ff', '#ffb0c8'];
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), n = 3 + r(2), m = 2;
  if (L === 0) return [{ c: 1, p: n }, { c: 1, p: m }];
  if (L === 1) return [{ c: 2 + r(3), p: n }, { c: 2 + r(4), p: m }];
  return [{ c: 2 + r(3), p: n }, { c: 2 + r(4), p: m }, g.rand() < 0.5 ? { c: 2 + r(8), p: 0 } : { c: 2 + r(6), p: 1 }];
}
const pw = (p, col) => p === 1 ? M.vr('x', null, { col }) : M.sup(M.vr('x', null, { col }), M.num(p, null, { col }));
const mono = (c, p, col) => p === 0 ? M.num(c, null, { col }) : M.row(c === 1 ? null : M.num(c, null, { col }), pw(p, col));

MG.add({
  id: 'derivs_sum', stage: 'derivs', cmd: 'SUM RULE!', hint: 'drag', time: 8, mood: 'sea', winText: 'Summed up!', hold: 1.4,
  card: {
    title: 'The sum rule', ref: 'Calculus', kind: 'Derivatives',
    text: 'The derivative of a formula tells you how fast its value changes as x changes. The sum rule says that the derivative of a sum is the sum of the derivatives: d/dx (f + g) = f′ + g′. The mark ′ (read "prime") means "the derivative of".\n\nSo you can take each term on its own. A term is one piece that is added on, such as x³. Use the power rule on each term: bring the power down in front and make the power one smaller.\n\nFor example, d/dx (x³ + x²) = 3x² + 2x. A number on its own never changes, so its derivative is 0.\n\nWhy it works: if one amount grows 3 cm per second and another grows 2 cm per second, together they grow 5 cm per second.',
    note: 'Differentiate a sum one term at a time, then add the results: d/dx (f + g) = f′ + g′.',
    ask: 'What is d/dx (x⁴ + x²)? What is d/dx (2x³ + 5x + 7)?',
  },

  init(g) {
    const S = g.s; M.setup(g); S.T = pick(g);
    S.slots = S.T.map((t, i) => M.slot('s' + i, { w: 52, col: COLS[i] }));
    const prob = M.row(M.ddx('x', 'ddx'), M.gap(4), M.paren(M.row(...S.T.flatMap((t, i) => [i ? M.op('+') : null, Object.assign(mono(t.c, t.p, COLS[i]), { id: 't' + i })]))));
    const work = M.row(M.op('='), M.gap(4), ...S.slots.flatMap((s, i) => [i ? M.op('+') : null, s]));
    const s = S.T.length > 2 ? 38 : 44;
    const place = () => { M.place(g, 'prob', prob, 180, 250, s, { col: INK }); M.place(g, 'work', work, 180, 340, s, { col: INK }); };
    place(); g.dur *= (2.6 + 1.05 * S.T.length) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        S.T.forEach((t, i) => {
          if (t.started) return; const v = t.p === 0 ? M.num(0) : mono(t.c * t.p, t.p - 1);
          const wrong = t.p === 0 ? [M.num(t.c), M.num(1), M.vr('x')] : [mono(t.c * t.p, t.p), mono(t.c, t.p - 1), mono(t.c + t.p, t.p - 1)];
          out.push({ drag: 'ddx', to: ['t' + i, 's' + i], busy: 0.1, ask: { v, wrong }, askAt: 0, after: 0.1,
            then(g) { t.started = true; S.hitT = g.t; g.sfx('pop'); },
            resolve(g) { const n = t.p === 0 ? M.num(0, null, { col: COLS[i] }) : mono(t.c * t.p, t.p - 1, COLS[i]); n.pop = g.t; S.slots[i].fill = n; t.done = true; place(); g.sfx(S.T.every(q => q.done) ? 'chime' : 'coin');
              const b = M.box(g, 's' + i); if (b) g.burst(b.x, b.y, [COLS[i], '#fff'], 10, 110); } });
        });
        return out;
      },
      area(g) { const i = S.T.findIndex(t => !t.started); return i < 0 ? null : ['ddx', 't' + i]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'beach', panel: PANEL, host: 'turtle', hostX: 86, hostY: 600, hostS: 1.3, panelY: 296, panelH: 190 });
    // a thin line from each finished term down to its result, in that term's colour
    S.T.forEach((t, i) => { if (!t.done) return; const a = M.box(g, 't' + i), b = M.box(g, 's' + i); if (!a || !b) return;
      c.save(); c.strokeStyle = COLS[i]; c.globalAlpha = 0.6; c.lineWidth = 2.5; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(a.x, a.y + a.h / 2 + 4); c.lineTo(b.x, b.y - b.h / 2 - 4); c.stroke(); c.restore(); });
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work');
    M.drawUI(g, c);
  },
});
