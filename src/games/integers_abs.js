// integers_abs.js — ABSOLUTE VALUE! |−7| + |3|: the absolute value of a number is its distance from 0.
// The player taps each absolute value: an ant walks from the number to 0 along the number line under the problem, a
// bracket shows the distance it walked, and |−7| turns into 7 in place. When both are done, tapping the + adds them.
// A wooden sign in the desert at sunset, with a fox watching.
// Level 0: one negative and one positive, added. Level 1: both may be negative. Level 2: added or subtracted.
// Wrong moves: tapping the + or − before both absolute values are found.
// Medium mode: each tap opens a tray; wrong tiles are the number itself (−7), one off, and for the last step the
// answer without absolute values.
const M = MK, INK = SCN.ink('sign'), CA = '#ffd27a', CB = '#9ae8ff', LY = 352;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  let a = -(2 + r(7)), b = 1 + r(8);
  if (L >= 1 && g.rand() < 0.6) b = -b;
  if (g.rand() < 0.5) [a, b] = [b, a];
  const o = L === 2 && g.rand() < 0.5 ? '-' : '+';
  return { a, b, o, v: o === '+' ? Math.abs(a) + Math.abs(b) : Math.abs(a) - Math.abs(b), raw: o === '+' ? a + b : a - b };
}
MG.add({
  id: 'integers_abs', stage: 'integers', cmd: 'ABSOLUTE VALUE!', hint: 'tap', time: 9, mood: 'bright', winText: 'Distance!', hold: 1.4,
  card: {
    title: 'Absolute value', ref: 'Grades 6–7', kind: 'Negative numbers',
    text: 'The absolute value of a number is its distance from 0 on the number line. We write it with two straight bars: |−7| means the absolute value of −7.\n\nA distance is never negative. −7 is 7 steps from 0, so |−7| = 7. 3 is 3 steps from 0, so |3| = 3. A number and its opposite have the same absolute value.\n\nTo work out an expression with absolute values, find each absolute value first, then do the rest. For example, |−7| + |3| = 7 + 3 = 10.',
    note: 'The absolute value is the distance from 0: drop the minus sign of a negative number, and leave a positive number as it is.',
    ask: 'What is |−12|? What is |−5| − |2|?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    S.parts = [{ v: S.a, id: 'A', col: CA }, { v: S.b, id: 'B', col: CB }];
    S.slot = M.slot('ans', { col: '#ffe9c0' });
    S.items = [M.row(M.txt('|'), M.num(S.a), M.txt('|')), M.op(S.o, 'op'), M.row(M.txt('|'), M.num(S.b), M.txt('|')), M.op('=', 'eq'), S.slot];
    S.items[0].id = 'A'; S.items[2].id = 'B';
    const place = () => M.place(g, 'ex', M.row(...S.items), 180, 268, 44, { col: INK }); place();
    M.inert(g, ['eq', 'ans']);
    S.Rg = Math.max(Math.abs(S.a), Math.abs(S.b)) + 1; S.u = 280 / (2 * S.Rg);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        S.parts.forEach((p, i) => { if (!p.done) out.push({ tap: p.id, busy: 0.1, ask: { v: Math.abs(p.v), wrong: [p.v === Math.abs(p.v) ? -p.v : p.v, Math.abs(p.v) + 1, Math.abs(p.v) - 1] },
          then(g) { p.done = true; p.walk = g.t; g.sfx('stomp'); },
          resolve(g) { S.items[i * 2] = M.num(Math.abs(p.v), p.id + 'v', { pop: g.t, col: p.col }); M.inert(g, [p.id + 'v']); place(); g.sfx('coin'); } }); });
        if (!out.length && !S.done) out.push({ tap: 'op', busy: 0.1, ask: { v: S.v, wrong: [S.raw, -S.v, S.v + 1, S.v - 1] },
          then(g) { S.done = true; }, resolve(g) { S.slot.fill = M.num(S.v, null, { pop: g.t, col: '#fff2b0' }); place(); g.sfx('coin'); const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#ffd27a', '#ffffff'], 14, 140); } });
        return out;
      },
      area(g) { const p = S.parts.find(q => !q.done); return p ? p.id : 'op'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'desert', panel: 'sign', panelY: 300, panelH: 190, host: 'fox', hostX: 290, hostY: 566, hostS: 1.35 });
    // sign posts
    c.fillStyle = '#6e4524'; c.fillRect(70, 395, 14, 110); c.fillRect(276, 395, 14, 110);
    M.drawEx(g, c, 'ex');
    // the number line
    const X = v => 180 + v * S.u;
    c.save(); c.strokeStyle = INK; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(-S.Rg) - 8, LY); c.lineTo(X(S.Rg) + 8, LY); c.stroke();
    c.fillStyle = INK; for (const d of [-1, 1]) { const x = X(d * S.Rg) + d * 14; c.beginPath(); c.moveTo(x, LY); c.lineTo(x - d * 9, LY - 5); c.lineTo(x - d * 9, LY + 5); c.fill(); }
    c.font = M.NUMF(12, 600); c.textAlign = 'center';
    for (let v = -S.Rg; v <= S.Rg; v++) { const x = X(v), big = v === 0; c.lineWidth = big ? 3 : 1.6; c.beginPath(); c.moveTo(x, LY - (big ? 8 : 5)); c.lineTo(x, LY + (big ? 8 : 5)); c.stroke();
      if (big || S.u >= 18 || v % 2 === 0) c.fillText(String(v).replace('-', '−'), x, LY + 22); }
    c.restore();
    // each number's spot, and once tapped, an ant walking it to 0 and the distance bracket
    S.parts.forEach((p, i) => {
      const k = p.walk != null ? M.clamp((t - p.walk) / 0.35, 0, 1) : 0, x0 = X(p.v), up = -1;
      c.fillStyle = p.col; c.strokeStyle = '#4a2a10'; c.lineWidth = 2; c.beginPath(); c.arc(x0, LY, 6, 0, 7); c.fill(); c.stroke();
      if (p.walk == null) return;
      const xe = M.lerp(x0, X(0), M.easeIO(k)), by = LY - 14 - i * 22;
      c.save(); c.strokeStyle = p.col; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, by - up * 6); c.lineTo(x0, by); c.lineTo(xe, by); if (k >= 1) c.lineTo(xe, by - up * 6); c.stroke();
      if (k >= 1) { c.fillStyle = p.col; c.font = M.NUMF(16, 700); c.textAlign = 'center'; c.fillText(String(Math.abs(p.v)), (x0 + xe) / 2, by - 6); }
      c.restore();
      if (k < 1 || t - p.walk < 0.8) { try { ANI.draw(c, 'ant', xe, LY - 4 - Math.abs(Math.sin(k * 18)) * 3, 0.5, { t, pose: k < 1 ? 'hop' : 'cheer', facing: p.v < 0 ? 1 : -1 }); } catch (e) { } }
    });
    M.drawUI(g, c);
  },
});
