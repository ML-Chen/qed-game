// integers_addopp.js — ADD OPPOSITE! Subtracting a negative number is adding its opposite: 5 − (−3) = 5 + 3.
// The player drags the minus sign onto the negative sign (or the other way): the two signs merge into one + and the
// brackets fall away, so 5 − (−3) becomes 5 + 3 in place. Tapping the + (or the numbers) adds them: 8.
// Level 2 also has a + (−b): a plus and a minus merge into a minus, because adding a negative is subtracting.
// Underwater on a reef: every number floats in its own bubble, and an octopus bobs below.
// Level 0: a − (−b) with small positive a. Level 1: a may be negative. Level 2: a − (−b) or a + (−b).
// Wrong moves: dragging a sign onto a number, tapping the numbers before the signs are merged.
// Medium mode: the final tap opens a tray; wrong tiles are the answer with the signs not merged (5 − 3), the opposite, ±1.
const M = MK, INK = '#f2fbff';
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  const b = 2 + r(L === 0 ? 6 : 8); let a = 2 + r(L === 0 ? 7 : 9);
  if (L > 0 && g.rand() < 0.5) a = -a;
  const o = L === 2 && g.rand() < 0.5 ? '+' : '-';
  return { a, b, o, s: o === '-' ? '+' : '-', v: o === '-' ? a + b : a - b, naive: o === '-' ? a - b : a + b };
}
MG.add({
  id: 'integers_addopp', stage: 'integers', cmd: 'ADD OPPOSITE!', hint: 'drag', time: 8, mood: 'sea', winText: 'Opposite!', hold: 1.4,
  card: {
    title: 'Subtracting a negative', ref: 'Grades 6–7', kind: 'Negative numbers',
    text: 'The opposite of a number is the number the same distance from 0 on the other side. The opposite of 3 is −3, and the opposite of −3 is 3.\n\nSubtracting a number is the same as adding its opposite. So subtracting a negative number is the same as adding a positive number. Two minus signs next to each other become one plus sign.\n\nFor example, 5 − (−3) = 5 + 3 = 8.\n\nHere is why. Subtraction asks how far it is from one number to another. From −3 up to 5 is 8 steps, so 5 − (−3) = 8. Taking away a debt of 3 leaves you 3 richer.',
    note: 'Subtracting a negative is adding its opposite: a − (−b) = a + b. Adding a negative is subtracting: a + (−b) = a − b.',
    ask: 'What is 7 − (−2)? What is −4 − (−6)?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    S.slot = M.slot('ans', { col: '#bfeaff' });
    S.ex = M.row(M.num(S.a, 'a'), M.gap(12), M.op(S.o, 'o1'), M.gap(12), M.paren(M.row(M.op('-', 'neg'), M.gap(4), M.num(S.b, 'b')), 'par'), M.gap(12), M.op('=', 'eq'), M.gap(10), S.slot);
    const place = () => M.place(g, 'ex', S.ex, 180, 300, 44, { col: INK }); place();
    M.inert(g, ['eq', 'par', 'ans']);
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const merge = (g, from, to) => {
      S.merged = true; S.mergeAt = g.t; g.sfx('magic');
      M.fly(g, { node: M.op('-'), from, to, dur: 0.18, arc: -30, col: INK });
      S.ex.items.splice(2, 3, M.op(S.s, 'o2', { pop: g.t, col: '#ffe27a' }), M.gap(12), M.num(S.b, 'b2', { pop: g.t })); place();
      const b = M.box(g, 'o2'); if (b) g.burst(b.x, b.y, ['#bfeaff', '#ffe27a', '#ffffff'], 12, 130);
    };
    M.play(g, {
      moves(g) {
        if (!S.merged) return [{ drag: 'o1', to: 'neg', busy: 0.1, then: merge }, { drag: 'neg', to: 'o1', busy: 0.1, then: merge }];
        if (S.done) return [];
        return [{ tap: ['o2', 'a', 'b2'], busy: 0.1, ask: { v: S.v, wrong: [S.naive, -S.v, S.v + 1, S.v - 1] },
          then(g) { S.done = true; }, resolve(g) { S.slot.fill = M.num(S.v, null, { pop: g.t, col: '#ffe27a' }); g.sfx('coin'); place(); const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#ffe27a', '#7ad8ff'], 12, 140); } }];
      },
      area(g) { return S.merged ? 'o2' : ['o1', 'neg']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'reef', panel: 'none', host: 'octopus', hostX: 180, hostY: 560, hostS: 1.5 });
    // light rays and a school of little fish drifting past
    for (let i = 0; i < 7; i++) { const x = ((t * 22 + i * 52) % 440) - 40, y = 470 + Math.sin(t * 1.5 + i) * 8 + (i % 3) * 14; fish(c, x, y, i % 2 ? '#ffb04a' : '#ffe27a'); }
    // every number floats in its own bubble
    for (const id of ['a', 'b', 'b2', 'ans']) {
      const b = M.box(g, id), n = M.node(g, id); if (!b || !n || n.hide) continue;
      const r = Math.max(b.w, b.h) / 2 + (id === 'ans' ? 6 : 3), y = b.y + Math.sin(t * 1.8 + b.x * 0.03) * 2.5;
      const gr = c.createRadialGradient(b.x - r * 0.35, y - r * 0.4, 1, b.x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.35)'); gr.addColorStop(0.7, 'rgba(120,200,255,0.12)'); gr.addColorStop(1, 'rgba(200,240,255,0.45)');
      c.fillStyle = gr; c.beginPath(); c.arc(b.x, y, r, 0, 7); c.fill(); c.strokeStyle = 'rgba(220,250,255,0.7)'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(b.x - r * 0.45, y - r * 0.5, r * 0.18, r * 0.1, -0.6, 0, 7); c.fill();
    }
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
function fish(c, x, y, col) {
  c.save(); c.fillStyle = col; c.globalAlpha = 0.85; c.beginPath(); c.ellipse(x, y, 9, 4.5, 0, 0, 7); c.fill();
  c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x - 15, y - 5); c.lineTo(x - 15, y + 5); c.closePath(); c.fill();
  c.fillStyle = '#1a2a3a'; c.beginPath(); c.arc(x + 5, y - 1, 1.3, 0, 7); c.fill(); c.restore();
}
