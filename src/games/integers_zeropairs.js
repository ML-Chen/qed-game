// integers_zeropairs.js — ZERO PAIRS! Add a negative and a positive number with counters: a yellow counter is +1 and a
// red counter is −1. An ice floe on a snowy shore: the problem is etched on a pane of ice, and a penguin points and hops.
// Every move acts its working out (show your work):
//   1. Drag a red counter onto a yellow one (or a yellow onto a red): both are circled, the dropped one settles beside
//      the other and they slide together, showing +1 and −1 on their faces; "+1 + (−1) = 0" writes itself just above
//      them (on the first pair; later pairs just say "0"), they squeeze into a 0 that puffs up and melts away.
//   2. When only one colour is left, tap a leftover counter: the leftovers are circled, then counted one by one, each
//      lighting up with its running total (−1, −2 or 1, 2), and the total flies into the answer.
// Level 0: −3 + 5 style, the positive part wins. Level 1: either order, either part wins. Level 2: more counters.
// Wrong moves: dragging a counter onto one of the same colour (two reds do not cancel), tapping the numbers.
// Medium mode: tapping the leftovers circles them and opens a tray for the sum; wrong tiles are the sum of the sizes,
// the wrong sign, ±1.
const M = MK, INK = SCN.ink('glass'), R = 17, NOTE = '#2a6aa8', HX = 290, HY = 560;
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
    const S = g.s; M.setup(g); [S.a, S.b] = pick(g); S.sum = S.a + S.b; const T = M.pace(g);
    const term = (v, id) => v < 0 && id === 'b' ? M.paren(M.num(v, 'bn'), id) : M.num(v, id);
    S.slot = M.slot('ans', { col: INK });
    S.exNode = M.row(term(S.a, 'a'), M.op('+', 'plus'), term(S.b, 'b'), M.op('=', 'eq'), S.slot); M.place(g, 'ex', S.exNode, 180, 236, 44, { col: INK });
    M.inert(g, ['eq', 'plus', 'ans', 'bn']);
    // counters: the first addend's on the top row, the second's below
    S.ctr = []; let k = 0;
    for (const [v, row] of [[S.a, 0], [S.b, 1]]) { const n = Math.abs(v), sp = Math.min(46, 300 / n);
      for (let i = 0; i < n; i++) S.ctr.push({ id: 'k' + k++, s: Math.sign(v), x: 180 + (i - (n - 1) / 2) * sp, y: 288 + row * 88, gone: false }); }
    S.ctr.forEach(q => M.zone(g, q.id, { x: q.x, y: q.y, w: R * 2 + 4, h: R * 2 + 4 }));
    const pairs = Math.min(Math.abs(S.a), Math.abs(S.b)); g.dur *= (2.6 + 1.05 * (pairs + 1)) / 8;
    const live = s => S.ctr.filter(q => !q.gone && (s == null || q.s === s)).map(q => q.id);
    const byId = id => S.ctr.find(q => q.id === id);
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // a pair cancels: the dropped counter settles beside the other, they slide together, the note says why, and they
    // squeeze into a 0 that puffs up and melts away
    const cancel = (g, from, to) => { const p = byId(from), q = byId(to); p.gone = q.gone = true; const first = !S.pairs; S.pairs = (S.pairs || 0) + 1;
      const D = (first ? 1.0 : 0.72) * T; M.show(g, D); S.point = true; hop(g, 'think'); g.sfx('swoosh');
      const start = { x: p.x, y: p.y }, mx = M.clamp((p.x + q.x) / 2, 60, 300), my = (p.y + q.y) / 2; // they meet in the open band between the rows
      const pr = { p, q, start, mx, my, t0: g.t, slide: 0.34 * T, squeeze: (first ? 0.62 : 0.4) * T, end: D }; (S.pr = S.pr || []).push(pr);
      M.circle(g, [[q.x, q.y, 30], [start.x, start.y, 30]].map(([x, y]) => ({ x, y, w: R * 2, h: R * 2 })), { dur: 0.4 * T, col: '#ffe27a', pad: 4 });
      M.at(g, [[0.3 * T, g => { g.sfx('tap'); }],
        [pr.squeeze, g => { g.sfx('pop'); g.sfx('splash'); hop(g); g.burst(mx, my, ['#fff27a', '#ff8a8a', '#ffffff'], 12, 120); }]]);
      if (first) M.note(g, { node: M.row(M.num('+1'), M.op('+'), M.paren(M.num(-1)), M.op('='), M.num(0)), at: [mx + (mx < 180 ? 96 : -96), my], s: 20, col: NOTE, delay: 0.22 * T, write: 0.32 * T, hold: 0.25 * T, fade: 0.2 * T }); };
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        const reds = live(-1), yel = live(1);
        if (reds.length && yel.length) return [{ drag: reds, to: yel, busy: 0.1, then: cancel }, { drag: yel, to: reds, busy: 0.1, then: cancel }];
        const left = S.ctr.filter(q => !q.gone), n = left.length, cd = 0.22 * T;
        return [{ tap: live(), busy: 0.1, askAt: 0.45 * T, after: 0.65 * T + cd * n, ask: { v: S.sum, wrong: [Math.abs(S.a) + Math.abs(S.b), -S.sum, S.sum + Math.sign(S.sum), S.sum - Math.sign(S.sum)] },
          then(g) { S.done = true; M.show(g, 0.45 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
            M.circle(g, left.map(q => ({ x: q.x, y: q.y, w: R * 2, h: R * 2 })), { dur: 0.45 * T, col: '#ffe27a', pad: 5 }); },
          resolve(g) { M.show(g, 0.15 * T + cd * n + 0.5 * T); S.count = { t0: g.t + 0.15 * T, cd, left };
            // count the leftovers one by one: each lights up with its running total
            M.at(g, [...left.map((q, i) => [0.15 * T + cd * i, g => { q.cnt = (i + 1) * q.s; q.cntAt = g.t; g.sfx('tap'); hop(g); }]),
              [0.15 * T + cd * n + 0.05 * T, g => { const q = left[n - 1]; S.count.gone = g.t;
                M.fly(g, { node: M.num(S.sum, null, { col: S.sum < 0 ? '#c8202a' : '#8a5a00' }), from: [q.x, q.y - 30], to: 'ans', dur: 0.4 * T, arc: -30, s0: 22, s1: 44,
                  then(g) { S.slot.fill = M.num(S.sum, null, { pop: g.t, col: S.sum < 0 ? '#c8202a' : '#8a5a00', _born: -1 }); M.place(g, 'ex', S.exNode, 180, 236, 44, { col: INK }); S.point = false;
                    g.sfx('coin'); hop(g, 'laugh'); M.sparkle(g, 'ans', { cols: ['#fff27a', '#fff', '#7ad0ff'] }); } }); }]]); } }];
      },
      area(g) { const reds = live(-1), yel = live(1); return reds.length && yel.length ? [reds[0], yel[0]] : live(); },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'snow', panel: 'glass', panelY: 298, panelH: 228 });
    // a second penguin slides back and forth on the snow
    try { ANI.draw(c, 'penguin', 70 + Math.sin(t * 0.8) * 30, 590, 1.0, { t, pose: g.done && g.result === 'win' ? 'cheer' : 'idle', facing: Math.cos(t * 0.8) > 0 ? 1 : -1 }); } catch (e) { }
    // the host penguin points at the counters while the work plays, and hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', HX, HY - hopK * 24, 1.4, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'penguin', HX, HY, 1.4); } catch (e) { }
    M.drawEx(g, c, 'ex');
    const P0 = K.press && K.press.dragging ? K.press : null;
    for (const q of S.ctr) {
      if (q.gone || (P0 && P0.id === q.id)) continue;
      const wob = K.missInfo && (K.missInfo.to === q.id || K.missInfo.drag === q.id) && t - K.missAt < 0.4 ? Math.sin((t - K.missAt) * 50) * 4 : 0;
      const bob = Math.sin(t * 2 + q.x * 0.05) * 1.2, ck = q.cntAt != null ? M.clamp((t - q.cntAt) / 0.3, 0, 1) : 0, lift = Math.sin(ck * Math.PI) * 8;
      if (q.cntAt != null) { c.save(); c.fillStyle = 'rgba(255,240,150,0.45)'; c.beginPath(); c.arc(q.x, q.y + bob - lift, R + 5, 0, 7); c.fill(); c.restore(); }
      counter(c, q.x + wob, q.y + bob - lift, R * (1 + Math.sin(ck * Math.PI) * 0.15), q.s);
      // the running count over a counted counter (only the latest one stays, until the total flies off)
      const cn = S.count, last = cn && cn.left.filter(w => w.cntAt != null).pop() === q;
      if (q.cntAt != null && last && !(cn.gone && t > cn.gone)) { c.save(); c.globalAlpha = M.clamp((t - q.cntAt) / 0.12, 0, 1); label(c, String(q.cnt).replace('-', '−'), q.x, q.y - R - 12, 20, q.s < 0 ? '#c8202a' : '#8a5a00'); c.restore(); }
      else if (q.cntAt != null && !last && !(cn.gone && t > cn.gone)) { c.save(); c.globalAlpha = 0.55; label(c, String(q.cnt).replace('-', '−'), q.x, q.y - R - 10, 13, q.s < 0 ? '#c8202a' : '#8a5a00'); c.restore(); }
    }
    // zero pairs: the two counters slide together showing +1 and −1, squeeze into a 0, and the 0 puffs up and melts
    for (const pr of S.pr || []) { const e = t - pr.t0; if (e > pr.end + 0.1) continue;
      const k = M.easeIO(M.clamp(e / pr.slide, 0, 1)), sq = M.clamp((e - pr.squeeze) / 0.16, 0, 1), side = pr.p.s, gap = R * 0.95, arcY = Math.sin(k * Math.PI) * 6;
      const px = M.lerp(pr.start.x, pr.mx - side * gap, k), qx = M.lerp(pr.q.x, pr.mx + side * gap, k), py = M.lerp(pr.start.y, pr.my, k) - arcY, qy = M.lerp(pr.q.y, pr.my, k) - arcY, y = pr.my;
      if (sq < 1) { const r = R * (1 - sq), xp = M.lerp(px, pr.mx, sq), xq = M.lerp(qx, pr.mx, sq);
        for (const [w, x, yy] of [[pr.p, xp, M.lerp(py, y, sq)], [pr.q, xq, M.lerp(qy, y, sq)]]) { counter(c, x, yy, r, w.s); if (k > 0.6 && r > 8) { c.save(); c.globalAlpha = M.clamp((k - 0.6) / 0.3, 0, 1) * (1 - sq); faceLabel(c, w.s > 0 ? '+1' : '−1', x, yy, r); c.restore(); } } }
      if (sq > 0) { const zk = M.clamp((e - pr.squeeze) / Math.max(0.2, pr.end - pr.squeeze), 0, 1), sz = 22 + 14 * Math.sin(Math.min(1, zk * 2) * Math.PI / 2);
        c.save(); c.globalAlpha = zk < 0.6 ? 1 : 1 - (zk - 0.6) / 0.4; label(c, '0', pr.mx, y - zk * 22, sz, NOTE); c.restore(); } }
    if (P0) counter(c, P0.x, P0.y - 20, R * 1.12, S.ctr.find(q => q.id === P0.id).s);
    M.drawUI(g, c);
  },
});
function label(c, s, x, y, sz, col) { c.save(); c.font = M.NUMF(sz, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineJoin = 'round'; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y); c.restore(); }
// a counter's value written on its face (replacing the drawn + or − while a pair cancels)
function faceLabel(c, s, x, y, r) { c.save(); c.font = M.NUMF(r * 0.95, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = s[0] === '+' ? '#fff27a' : '#ff8a8a'; c.beginPath(); c.arc(x, y, r * 0.72, 0, 7); c.fill(); c.fillStyle = s[0] === '+' ? '#6a4400' : '#5a0010'; c.fillText(s, x, y + 1); c.restore(); }
function counter(c, x, y, r, s) {
  const [hi, lo, edge] = COL[s];
  c.save(); c.fillStyle = 'rgba(30,40,80,0.25)'; c.beginPath(); c.ellipse(x + 2, y + r * 0.35 + 3, r, r * 0.8, 0, 0, 7); c.fill();
  const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r); gr.addColorStop(0, hi); gr.addColorStop(1, lo);
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = edge; c.lineWidth = 2; c.stroke();
  c.strokeStyle = edge; c.lineWidth = r * 0.16; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - r * 0.42, y); c.lineTo(x + r * 0.42, y);
  if (s > 0) { c.moveTo(x, y - r * 0.42); c.lineTo(x, y + r * 0.42); } c.stroke(); c.restore();
}
