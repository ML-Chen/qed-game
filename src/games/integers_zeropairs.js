// integers_zeropairs.js — ZERO PAIRS! Add a negative and a positive number with counters: a yellow counter is +1 and a
// red counter is −1. The player drags a red counter onto a yellow one (or a yellow onto a red): the pair is +1 + (−1) = 0,
// so both vanish. When no pairs are left, tapping the leftover counters counts them and writes the sum.
// An ice floe on a snowy shore: the problem is etched on a pane of ice, and a penguin cheers each pair.
// Level 0: −3 + 5 style, the positive part wins. Level 1: either order, either part wins. Level 2: more counters.
// Wrong moves: dragging a counter onto one of the same colour (two reds do not cancel), tapping the numbers.
// Medium mode: tapping the leftovers opens a tray for the sum; wrong tiles are the sum of the sizes, the wrong sign, ±1.
const M = MK, INK = SCN.ink('glass'), R = 17;
const COL = { 1: ['#fff27a', '#f2b81a', '#8a5a00'], '-1': ['#ff8a8a', '#d8323a', '#6a0a14'] };
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  let neg = L === 0 ? 2 + r(2) : L === 1 ? 2 + r(3) : 3 + r(3), pos = neg + 1 + r(L === 0 ? 2 : 3);
  if (L > 0 && g.rand() < 0.5) [neg, pos] = [pos, neg];          // the negative part may be the bigger one
  const a = -neg, b = pos;
  return L > 0 && g.rand() < 0.5 ? [b, a] : [a, b];             // either order: 5 + (−3) as well as −3 + 5
}
MG.add({
  id: 'integers_zeropairs', stage: 'integers', cmd: 'ZERO PAIRS!', hint: 'drag', time: 9, mood: 'sea', winText: 'Zero pairs!', hold: 1.4,
  card: {
    title: 'Zero pairs', ref: 'Grades 6–7', kind: 'Negative numbers',
    text: 'A negative number is less than zero. We can show numbers with counters. A yellow counter stands for +1, and a red counter stands for −1.\n\nOne yellow and one red make a zero pair, because +1 + (−1) = 0. A zero pair adds nothing, so you can take it away.\n\nTo add a negative and a positive number, lay out both sets of counters. Take away zero pairs until only one colour is left. The counters that are left are the answer.\n\nFor example, −3 + 5 is 3 red counters and 5 yellow counters. Take away 3 zero pairs. 2 yellow counters are left, so −3 + 5 = 2.',
    note: 'A number plus its opposite is zero. To add numbers with different signs, cancel the pairs: the answer has the sign of the bigger part, and its size is the difference.',
    ask: 'What is −6 + 2? What is 4 + (−4)?',
  },
  init(g) {
    const S = g.s; M.setup(g); [S.a, S.b] = pick(g); S.sum = S.a + S.b;
    const term = (v, id) => v < 0 && id === 'b' ? M.paren(M.num(v, 'bn'), id) : M.num(v, id);
    S.slot = M.slot('ans', { col: INK });
    S.exNode = M.row(term(S.a, 'a'), M.op('+', 'plus'), term(S.b, 'b'), M.op('=', 'eq'), S.slot); M.place(g, 'ex', S.exNode, 180, 236, 44, { col: INK });
    M.inert(g, ['eq', 'plus', 'ans', 'bn']);
    // counters: the first addend's on the top row, the second's below
    S.ctr = []; let k = 0;
    for (const [v, row] of [[S.a, 0], [S.b, 1]]) { const n = Math.abs(v), sp = Math.min(46, 300 / n);
      for (let i = 0; i < n; i++) S.ctr.push({ id: 'k' + k++, s: Math.sign(v), x: 180 + (i - (n - 1) / 2) * sp, y: 300 + row * 58, gone: false }); }
    S.ctr.forEach(q => M.zone(g, q.id, { x: q.x, y: q.y, w: R * 2 + 4, h: R * 2 + 4 }));
    const pairs = Math.min(Math.abs(S.a), Math.abs(S.b)); g.dur *= (2.6 + 1.05 * (pairs + 1)) / 8;
    const live = s => S.ctr.filter(q => !q.gone && (s == null || q.s === s)).map(q => q.id);
    const byId = id => S.ctr.find(q => q.id === id);
    const cancel = (g, from, to) => { const p = byId(from), q = byId(to); p.gone = q.gone = true; p.at = q.at = g.t; S.pop = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, t: g.t };
      g.sfx('pop'); g.sfx('splash'); g.burst(S.pop.x, S.pop.y, ['#fff27a', '#ff8a8a', '#ffffff'], 12, 140); };
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        const reds = live(-1), yel = live(1);
        if (reds.length && yel.length) return [{ drag: reds, to: yel, busy: 0.1, then: cancel }, { drag: yel, to: reds, busy: 0.1, then: cancel }];
        return [{ tap: live(), busy: 0.1, ask: { v: S.sum, wrong: [Math.abs(S.a) + Math.abs(S.b), -S.sum, S.sum + Math.sign(S.sum), S.sum - Math.sign(S.sum)] },
          then(g) { S.counting = g.t; }, resolve(g) { S.done = true; S.slot.fill = M.num(S.sum, null, { pop: g.t, col: S.sum < 0 ? '#c8202a' : '#8a5a00' }); g.sfx('coin'); M.place(g, 'ex', S.exNode, 180, 236, 44, { col: INK }); } }];
      },
      area(g) { const reds = live(-1), yel = live(1); return reds.length && yel.length ? [reds[0], yel[0]] : live(); },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'snow', panel: 'glass', panelY: 288, panelH: 196, host: 'penguin', hostX: 290, hostY: 560, hostS: 1.4 });
    // a second penguin slides back and forth on the snow
    try { ANI.draw(c, 'penguin', 70 + Math.sin(t * 0.8) * 30, 590, 1.0, { t, pose: g.done && g.result === 'win' ? 'cheer' : 'idle', facing: Math.cos(t * 0.8) > 0 ? 1 : -1 }); } catch (e) { }
    M.drawEx(g, c, 'ex');
    const P0 = K.press && K.press.dragging ? K.press : null;
    for (const q of S.ctr) {
      let k = 1; if (q.gone) { k = 1 - (t - q.at) / 0.22; if (k <= 0) continue; }
      if (P0 && P0.id === q.id) continue;
      const wob = K.missInfo && (K.missInfo.to === q.id || K.missInfo.drag === q.id) && t - K.missAt < 0.4 ? Math.sin((t - K.missAt) * 50) * 4 : 0;
      const bob = Math.sin(t * 2 + q.x * 0.05) * 1.2, cnt = S.counting != null && !q.gone ? Math.max(0, 1 - (t - S.counting) / 0.3) : 0;
      counter(c, q.x + wob + (q.gone ? (S.pop.x - q.x) * (1 - k) : 0), q.y + bob - cnt * 10, R * (q.gone ? k : 1), q.s);
    }
    if (S.pop && t - S.pop.t < 0.5) { const k = (t - S.pop.t) / 0.5; c.save(); c.globalAlpha = 1 - k; c.fillStyle = '#2a6aa8'; c.font = M.NUMF(26, 700); c.textAlign = 'center'; c.fillText('0', S.pop.x, S.pop.y - k * 30); c.restore(); }
    if (P0) counter(c, P0.x, P0.y - 20, R * 1.12, S.ctr.find(q => q.id === P0.id).s);
    M.drawUI(g, c);
  },
});
function counter(c, x, y, r, s) {
  const [hi, lo, edge] = COL[s];
  c.save(); c.fillStyle = 'rgba(30,40,80,0.25)'; c.beginPath(); c.ellipse(x + 2, y + r * 0.35 + 3, r, r * 0.8, 0, 0, 7); c.fill();
  const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r); gr.addColorStop(0, hi); gr.addColorStop(1, lo);
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = edge; c.lineWidth = 2; c.stroke();
  c.strokeStyle = edge; c.lineWidth = r * 0.16; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - r * 0.42, y); c.lineTo(x + r * 0.42, y);
  if (s > 0) { c.moveTo(x, y - r * 0.42); c.lineTo(x, y + r * 0.42); } c.stroke(); c.restore();
}
