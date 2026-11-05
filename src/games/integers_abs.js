// integers_abs.js — ABSOLUTE VALUE! |−7| + |3|: the absolute value of a number is its distance from 0.
// A wooden sign in the desert at sunset, with a fox watching, and a number line under the problem. Every move acts its
// working out (show your work):
//   1. Tap an absolute value: it is circled, and an ant walks from that number to 0, hop by hop, while a bracket stretches
//      behind it and counts the steps (1, 2, ... 7). The distance flies up into the sign; the bars fade, −7 rolls over
//      to 7 and the gap closes: 7 + |3|. The other absolute value works the same way, in either order.
//   2. Tap the + (or −): both distance brackets slide over to start at 0 and lay end to end (for −, the second runs
//      back left from the end of the first), so the far end lands on the answer; it lights up and flies into the sign.
// Level 0: one negative and one positive, added. Level 1: both may be negative. Level 2: added or subtracted.
// Wrong moves: tapping the + or − before both absolute values are found.
// Medium mode: each tap opens a tray when the walk (or the joining) is done; wrong tiles are the number itself (−7),
// one off, and for the last step the answer without absolute values.
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
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g);
    S.parts = [{ v: S.a, id: 'A', col: CA }, { v: S.b, id: 'B', col: CB }];
    S.slot = M.slot('ans', { col: '#ffe9c0' });
    S.parts.forEach(p => { p.bars = [M.txt('|'), M.txt('|')]; p.n = M.num(p.v, p.id + 'v'); p.node = M.row(p.bars[0], p.n, p.bars[1]); p.node.id = p.id; });
    S.opN = M.op(S.o, 'op'); S.eqN = M.op('=', 'eq');
    S.items = [S.parts[0].node, S.opN, S.parts[1].node, S.eqN, S.slot];
    const place = () => M.place(g, 'ex', M.row(...S.items), 180, 268, 44, { col: INK }); place(); S.place = place;
    M.inert(g, ['eq', 'ans', 'Av', 'Bv']);
    // the line runs from just past the lowest to just past the highest of the numbers, 0 and the answer (so the joined bars fit)
    S.lo = Math.min(S.a, S.b, 0, S.v, -1) - 1; S.hi = Math.max(S.a, S.b, 0, S.v, 1) + 1; S.u = 290 / (S.hi - S.lo);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    M.play(g, {
      moves(g) {
        const out = [];
        S.parts.forEach((p, i) => { if (!p.done) { const d = Math.abs(p.v), wd = (0.25 + 0.06 * d) * T;
          out.push({ tap: p.id, busy: 0.1, askAt: wd + 0.25 * T, after: 0.9 * T, ask: { v: d, wrong: [p.v === d ? -p.v : p.v, d + 1, d - 1] },
          then(g) { p.done = true; M.show(g, wd + 0.25 * T); M.circle(g, p.id, { dur: 0.5 * T, col: p.col }); M.light(g, p.n, { col: p.col });
            p.walk = g.t + 0.15 * T; p.wdur = wd; S.point = true; g.sfx('stomp'); hop(g, 'think');
            M.at(g, [[0.15 * T + wd, g => { p.walked = g.t; g.sfx('ding'); }]]); },
          resolve(g) { M.show(g, 0.9 * T); p.lab = g.t; const X = v => 180 + (v - (S.lo + S.hi) / 2) * S.u, by = LY - 14 - i * 22;
            // the distance lifts off the bracket and flies into the sign; the bars fade and the number rolls over to its size
            M.fly(g, { node: M.num(d, null, { col: p.col }), from: [(X(p.v) + X(0)) / 2, by - 12], to: p.id + 'v', dur: 0.4 * T, arc: -30, s0: 18, s1: 44,
              then(g) { for (const q of p.bars) M.tween(g, q, { alpha: 0 }, 0.2 * T); if (p.v < 0) M.roll(g, p.n, d, { dur: 0.3 * T }); p.n.pop = g.t; p.n.col = p.col; M.unlight(g, p.n);
                M.sparkle(g, p.n, { n: 8, cols: [p.col, '#fff'] }); g.sfx('coin'); hop(g); } });
            M.at(g, [[0.7 * T, g => { S.items[i * 2] = p.n; place(); }]]); } }); } });
        if (!out.length && !S.done) out.push({ tap: 'op', busy: 0.1, askAt: 0.85 * T, after: 0.8 * T, ask: { v: S.v, wrong: [S.raw, -S.v, S.v + 1, S.v - 1] },
          then(g) { S.done = true; M.show(g, 0.85 * T); S.joinAt = g.t; S.point = true; hop(g, 'think'); g.sfx('swoosh');
            M.indicate(g, 'op', { dur: 0.4 * T }); M.circle(g, ['Av', 'Bv'], { delay: 0.1 * T, dur: 0.5 * T }); },
          resolve(g) { M.show(g, 0.8 * T); S.totAt = g.t; g.sfx('ding');
            M.at(g, [[0.35 * T, g => { const tp = S.totPos || { x: 180, y: LY - 60 }; S.totGone = g.t;
              M.fly(g, { node: M.num(S.v, null, { col: '#fff2b0' }), from: [tp.x, tp.y], to: 'ans', dur: 0.4 * T, arc: -20, s0: 20, s1: 44,
                then(g) { S.slot.fill = M.num(S.v, null, { pop: g.t, col: '#fff2b0', _born: -1 }); place(); S.point = false; g.sfx('coin'); hop(g, 'laugh');
                  const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#ffd27a', '#ffffff'], 14, 140); } }); }]]); } });
        return out;
      },
      area(g) { const p = S.parts.find(q => !q.done); return p ? p.id : 'op'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, T = M.pace(g);
    SCN.std(g, c, { scene: 'desert', panel: 'sign', panelY: 300, panelH: 190 });
    // sign posts
    c.fillStyle = '#6e4524'; c.fillRect(70, 395, 14, 110); c.fillRect(276, 395, 14, 110);
    M.drawEx(g, c, 'ex');
    // the number line
    const X = v => 180 + (v - (S.lo + S.hi) / 2) * S.u;
    c.save(); c.strokeStyle = INK; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(S.lo) - 8, LY); c.lineTo(X(S.hi) + 8, LY); c.stroke();
    c.fillStyle = INK; for (const d of [-1, 1]) { const x = X(d < 0 ? S.lo : S.hi) + d * 14; c.beginPath(); c.moveTo(x, LY); c.lineTo(x - d * 9, LY - 5); c.lineTo(x - d * 9, LY + 5); c.fill(); }
    c.font = M.NUMF(12, 600); c.textAlign = 'center';
    const every = S.u >= 18 ? 1 : S.u >= 11 ? 2 : 5;
    for (let v = S.lo; v <= S.hi; v++) { const x = X(v), big = v === 0; c.lineWidth = big ? 3 : 1.6; c.beginPath(); c.moveTo(x, LY - (big ? 8 : 5)); c.lineTo(x, LY + (big ? 8 : 5)); c.stroke();
      if (big || v % every === 0) c.fillText(String(v).replace('-', '−'), x, LY + 22); }
    c.restore();
    // move 2: both distance brackets slide over to start at 0 and lay end to end (for −, the second runs back from the first's end)
    const jk = S.joinAt == null ? 0 : M.ease(M.clamp((t - S.joinAt) / (0.6 * T), 0, 1)), da = Math.abs(S.a), db = Math.abs(S.b), JY = LY - 30;
    const L0 = X(0); // the joined bar starts at 0, so its far end lands on the answer on the number line itself
    const segJ = [[L0, L0 + da * S.u], S.o === '+' ? [L0 + da * S.u, L0 + (da + db) * S.u] : [L0 + da * S.u, L0 + (da - db) * S.u]];
    // each number's spot, and once tapped, an ant walking it to 0 hop by hop and the distance bracket counting the steps
    S.parts.forEach((p, i) => {
      const d = Math.abs(p.v), k = p.walk != null ? M.clamp((t - p.walk) / p.wdur, 0, 1) : 0, x0 = X(p.v);
      c.fillStyle = p.col; c.strokeStyle = '#4a2a10'; c.lineWidth = 2; c.beginPath(); c.arc(x0, LY, 6, 0, 7); c.fill(); c.stroke();
      if (p.walk == null || t < p.walk) return;
      const xe = M.lerp(x0, X(0), k), by0 = LY - 14 - i * 22, steps = Math.min(d, Math.floor(k * d + 0.001));
      // the bracket: on the line while walking, then (move 2) slid up into the joined bar
      const s0 = [Math.min(x0, xe), Math.max(x0, xe)], sj = segJ[i], ax = M.lerp(x0, sj[0], jk), bx = M.lerp(xe, sj[1], jk), by = M.lerp(by0, JY + (S.o === '-' && i ? 10 : 0), jk);
      c.save(); c.strokeStyle = p.col; c.lineWidth = 3.5; c.lineCap = 'round'; if (S.o === '-' && i && jk > 0) c.setLineDash([7, 5]);
      c.beginPath(); c.moveTo(ax, by + 6); c.lineTo(ax, by); c.lineTo(bx, by); if (k >= 1) c.lineTo(bx, by + 6); c.stroke(); c.setLineDash([]);
      // the step count rides at the head of the bracket while walking, then settles in its middle
      if (steps > 0 && !(S.totAt != null)) { const lx = k < 1 ? xe : (ax + bx) / 2, pk = p.lab != null ? M.clamp((t - p.lab) / 0.3, 0, 1) : 0;
        c.fillStyle = p.col; c.font = M.NUMF(16 * (1 + Math.sin(pk * Math.PI) * 0.4), 700); c.textAlign = 'center'; c.fillText(String(steps), lx, by - 6); }
      c.restore();
      if (k < 1 || t - p.walk - p.wdur < 0.7) { const hk = Math.abs(Math.sin(k * d * Math.PI)); try { ANI.draw(c, 'ant', xe, LY - 4 - hk * 7, 0.5, { t, pose: k < 1 ? 'walk' : 'cheer', facing: p.v < 0 ? 1 : -1 }); } catch (e) { } }
    });
    // the total over the joined bar
    if (S.totAt != null) { const tk = M.clamp((t - S.totAt) / (0.25 * T), 0, 1), x = X(S.v); S.totPos = { x, y: JY - 14 };
      if (tk > 0) { c.save(); c.globalAlpha = tk; c.fillStyle = '#fff2b0'; c.strokeStyle = '#4a2a10'; c.lineWidth = 2; c.beginPath(); c.arc(x, LY, 7 + 3 * Math.sin(tk * Math.PI), 0, 7); c.fill(); c.stroke(); c.restore(); }
      c.save(); c.globalAlpha = tk * (S.totGone == null ? 1 : Math.max(0, 1 - (t - S.totGone) / 0.08)); c.fillStyle = '#fff2b0'; c.strokeStyle = '#4a2a10'; c.lineWidth = 3; c.font = M.NUMF(22, 700); c.textAlign = 'center'; c.strokeText(String(S.v).replace('-', '−'), x, JY - 8); c.fillText(String(S.v).replace('-', '−'), x, JY - 8); c.restore(); }
    // the fox points at the sign while the work is shown, and hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 290, 566 - hopK * 24, 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', 290, 566, 1.35); } catch (e) { }
    M.drawUI(g, c);
  },
});
