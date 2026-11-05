// ratios_proportion.js — PROPORTION! A table of x and y values that are proportional: y = kx. Find the constant of
// proportionality k = y ÷ x, check it on the other row, and write the equation.
// A railway platform on a spring morning: the table is a split-flap departures board hanging from the station canopy,
// with an enamel platform sign under it that reads "k = ?   y = ?x". A pigeon in a conductor's mood runs the show, a
// station clock ticks and a little train rolls by now and then. Every move's working plays by itself:
//   1. Drag a y value onto the x in its row (either row): the row lights up, copies of both numbers fly down into a
//      working note "7 ÷ 2 = ", the quotient writes itself in (k), flies into the sign's "k = ?", and an arrow labelled
//      "× 3.5" draws itself from x to y along that row.
//   2. Tap the other row to check it: its "× 3.5" arrow draws itself, the note "5 × 3.5 = 17.5" writes itself, and a
//      green tick lands beside the y value.
//   3. Drag k into y = ?x: it flies into the slot, both rows' arrows flash at once and the equation sparkles.
//   Moves 2 and 3 may come in either order. Dragging x onto y (k = x ÷ y, the classic mistake) wobbles and shows "2 ÷ 7?".
// Level 0: whole k from 2 to 5. Level 1: whole k up to 9. Level 2: k = 1.5, 2.5, 3.5 or 4.5.
// Medium mode: the tray asks for k once "7 ÷ 2 =" is written, and for the checked y once "5 × 3.5 =" is written.
const M = MK, BOARD = '#22303a', AMBER = '#ffd25e', CREAM = '#f6ecd2', NAVY = '#1f3a6a', GOOD = '#3cc46a';
const XC = 112, YC = 248, HEADY = 210, ROWY = [268, 326], NOTEY = 378, SIGNY = 440;
const fmt = v => String(Math.round(v * 100) / 100);
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) { const k = 2 + r(4), x0 = 1 + r(4), x1 = x0 + 1 + r(4); return { k, xs: [x0, x1] }; }
  if (L === 1) { const k = 3 + r(7), x0 = 2 + r(4), x1 = x0 + 2 + r(4); return { k, xs: [x0, x1] }; }
  const k = [1.5, 2.5, 3.5, 4.5][r(4)], x0 = [2, 4, 6][r(3)]; let x1 = 3 + 2 * r(4); if (x1 === x0) x1 += 2; return { k, xs: [x0, x1] };
}

// the station on a spring morning: a mint sky, pale hills, a scalloped canopy valance, iron columns, rails, a stone platform
function station(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 500); sk.addColorStop(0, '#9ed8d4'); sk.addColorStop(0.55, '#d4eedc'); sk.addColorStop(1, '#fbeed2'); c.fillStyle = sk; c.fillRect(0, 0, W, 500);
  const sg = c.createRadialGradient(70, 120, 4, 70, 120, 120); sg.addColorStop(0, 'rgba(255,250,220,0.95)'); sg.addColorStop(0.25, 'rgba(255,246,210,0.5)'); sg.addColorStop(1, 'rgba(255,246,210,0)'); c.fillStyle = sg; c.fillRect(0, 0, 220, 260);
  c.fillStyle = '#fffbe6'; c.beginPath(); c.arc(70, 120, 20, 0, 7); c.fill();
  // far hills with a viaduct, and a town of pastel houses
  c.fillStyle = '#a6d0c4'; c.beginPath(); c.moveTo(0, 470); for (let x = 0; x <= W; x += 10) c.lineTo(x, 430 - Math.sin(x * 0.018) * 18 - Math.sin(x * 0.05 + 1) * 6); c.lineTo(W, 500); c.lineTo(0, 500); c.fill();
  const r = P.rng(41); for (let i = 0; i < 12; i++) { const x = i * 32 + r() * 8, h = 18 + r() * 22; c.fillStyle = ['#f4c8b0', '#f8e0a8', '#c8d8f0', '#f0b8c0'][i % 4]; c.fillRect(x, 470 - h, 26, h); c.fillStyle = '#c87a6a'; c.beginPath(); c.moveTo(x - 3, 470 - h); c.lineTo(x + 13, 470 - h - 12); c.lineTo(x + 29, 470 - h); c.fill(); c.fillStyle = 'rgba(80,90,120,0.45)'; c.fillRect(x + 8, 470 - h + 6, 6, 6); }
  // rails
  c.fillStyle = '#8a7a6a'; c.fillRect(0, 470, W, 30); for (let x = 0; x < W; x += 18) { c.fillStyle = '#6a4e3a'; c.fillRect(x, 486, 12, 10); }
  c.fillStyle = '#c8ccd4'; c.fillRect(0, 484, W, 3); c.fillRect(0, 494, W, 3);
  // the platform: stone slabs and a yellow safety line
  const pg = c.createLinearGradient(0, 504, 0, H); pg.addColorStop(0, '#e2d6c2'); pg.addColorStop(1, '#bcae98'); c.fillStyle = pg; c.fillRect(0, 504, W, H - 504);
  c.fillStyle = '#9a8a74'; c.fillRect(0, 500, W, 6); c.fillStyle = '#f2c43a'; c.fillRect(0, 512, W, 5);
  c.strokeStyle = 'rgba(110,90,70,0.3)'; c.lineWidth = 1.5; for (let y = 540; y < H; y += 34) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); for (let x = (y / 34) % 2 ? 0 : 40; x < W; x += 80) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 34); c.stroke(); } }
  // iron columns and the canopy valance (scalloped boards, green and cream)
  for (const x of [12, 348]) { c.fillStyle = '#2e5a4a'; c.fillRect(x - 5, 30, 10, 474); c.fillStyle = '#3e7a62'; c.fillRect(x - 2, 30, 3, 474); c.fillStyle = '#2e5a4a'; c.fillRect(x - 9, 494, 18, 10); }
  c.fillStyle = '#2e5a4a'; c.fillRect(0, 0, W, 26);
  for (let i = 0; i < 18; i++) { const x = i * 20; c.fillStyle = i % 2 ? '#f6ecd2' : '#3e7a62'; c.beginPath(); c.moveTo(x, 24); c.lineTo(x, 40); c.arc(x + 10, 40, 10, Math.PI, 0, true); c.lineTo(x + 20, 24); c.fill(); }
  c.strokeStyle = '#1e3e32'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 25); c.lineTo(W, 25); c.stroke();
}
// a split-flap tile behind each number
function tile(c, b, t, flapAt) {
  const w = Math.max(66, b.w + 22), h = 46, x = b.x - w / 2, y = b.y - h / 2;
  c.save(); c.fillStyle = '#0e1418'; c.beginPath(); c.roundRect(x, y, w, h, 6); c.fill();
  c.fillStyle = '#1c262e'; c.beginPath(); c.roundRect(x + 2, y + 2, w - 4, h / 2 - 2, 4); c.fill();
  c.fillStyle = '#000'; c.fillRect(x + 1, b.y - 1, w - 2, 2); c.fillStyle = '#4a5662'; c.fillRect(x - 2, b.y - 3, 3, 6); c.fillRect(x + w - 1, b.y - 3, 3, 6);
  c.restore();
}

MG.add({
  id: 'ratios_proportion', stage: 'ratios', cmd: 'PROPORTION!', hint: 'drag', time: 9, mood: 'bright', winText: 'y = kx!', hold: 1.7,
  card: {
    title: 'Proportional relationships', ref: 'Grade 7', kind: 'Ratios and percents',
    text: 'Two amounts are proportional when one is always the same number times the other. That number is called the constant of proportionality, k. We write y = kx.\n\nTo find k, divide a y value by its x value. If x = 2 goes with y = 7, then k = 7 ÷ 2 = 3.5.\n\nThen check another pair. For x = 5, 5 × 3.5 = 17.5, which matches the table, so the amounts really are proportional. The equation is y = 3.5x.\n\nBe careful to divide y by x, not x by y.',
    note: 'In a proportional table, y ÷ x is the same in every row. That number is k, and y = kx.',
    ask: 'A table has x = 3, y = 12 and x = 5, y = 20. What is k? What is the equation?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g), k = S.k;
    S.ys = S.xs.map(x => Math.round(x * k * 100) / 100); S.ticks = []; S.flash = []; S.face = 'happy';
    S.xN = S.xs.map((x, j) => M.num(x, 'x' + j)); S.yN = S.ys.map((y, j) => M.num(fmt(y), 'y' + j));
    M.place(g, 'hx', M.vr('x', 'hx'), XC, HEADY, 32, { col: CREAM }); M.place(g, 'hy', M.vr('y', 'hy'), YC, HEADY, 32, { col: CREAM });
    for (let j = 0; j < 2; j++) { M.place(g, 'cx' + j, S.xN[j], XC, ROWY[j], 32, { col: AMBER }); M.place(g, 'cy' + j, S.yN[j], YC, ROWY[j], 32, { col: AMBER }); }
    S.kSlot = M.slot('ks', { col: '#5a6a8a' }); S.kRow = M.row(M.vr('k', 'kk'), M.op('=', 'ke'), S.kSlot);
    S.eSlot = M.slot('es', { col: '#5a6a8a' }); S.eRow = M.row(M.vr('y', 'ey'), M.op('=', 'ee'), S.eSlot, M.vr('x', 'ex'));
    S.relayK = () => M.place(g, 'kr', S.kRow, 100, SIGNY, 32, { col: NAVY }); S.relayE = () => M.place(g, 'er', S.eRow, 246, SIGNY, 32, { col: NAVY }); S.relayK(); S.relayE();
    M.inert(g, ['hx', 'hy', 'kk', 'ke', 'ey', 'ee', 'ex', 'ef']);
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // the "× k" arrow along a row, from the x tile to the y tile
    const rowArrow = (g, j, o = {}) => { const a = M.box(g, 'x' + j), b = M.box(g, 'y' + j); const ax = XC + Math.max(66, a.w + 22) / 2 + 4, bx = YC - Math.max(66, b.w + 22) / 2 - 4, y = ROWY[j] - 12;
      return M.arrow(g, [ax, y], [bx, y], { label: M.row(M.op('×'), M.num(fmt(k))), ls: 24, bend: 16, col: o.col || AMBER, dur: o.dur || 0.4 * T, delay: o.delay, linger: o.linger ?? 0.8 * T }); };
    // the working note under the table: a dark pill with cream chalk; its parts are filled in as the work goes
    const work = (g, parts) => { S.wk = M.row(...parts); S.wk.alpha = 1; M.place(g, 'wk', S.wk, 180, NOTEY, 28, { col: CREAM }); S.wkAt = g.t; };
    const fadeWork = (g, d) => { const w = S.wk; M.tween(g, w, { alpha: 0 }, 0.3 * T, { delay: d }); M.at(g, [[d + 0.32 * T, g => { if (S.wk === w) { delete g.s.mk.ex.wk; S.wk = null; } }]]); };
    M.onMiss(g, (g, info) => { // the classic mistake: x ÷ y instead of y ÷ x
      const j = info.drag && /^x\d$/.test(info.drag) && info.to === 'y' + info.drag[1] ? +info.drag[1] : -1;
      if (j >= 0) M.note(g, { node: M.row(M.num(S.xs[j]), M.op('÷'), M.num(fmt(S.ys[j])), M.txt('?')), at: [180, NOTEY], s: 26, col: '#ff8a7a', pill: true, write: 0.25, hold: 0.35, fade: 0.25 }); });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.kRowJ && S.kRowJ !== 0) {
          // 1. a y value onto its x: k = y ÷ x
          for (const j of [0, 1]) {
            const x = S.xs[j], y = S.ys[j];
            out.push({ drag: 'y' + j, to: 'x' + j, busy: 0.1, askAt: 0.85 * T, after: 1.15 * T,
              ask: { v: k, wrong: [M.frac(M.num(x), M.num(fmt(y))), fmt(y - x), fmt(k + 1), fmt(y + x)] },
              then(g) {
                S.kRowJ = j; M.show(g, 0.85 * T); S.point = true; hop(g, 'wow'); g.sfx('swoosh');
                M.light(g, 'x' + j, { col: '#fff2b0' }); M.light(g, 'y' + j, { col: '#fff2b0' }); M.circle(g, ['x' + j, 'y' + j], { dur: 0.55 * T, pad: 14, col: AMBER });
                const yn = M.num(fmt(y), null, { alpha: 0 }), xn = M.num(x, null, { alpha: 0 }), dv = M.op('÷', null, { alpha: 0 }), eq = M.op('=', null, { alpha: 0 });
                S.q = M.num(fmt(k), 'wq', { alpha: 0, col: '#fff' }); work(g, [yn, dv, xn, eq, S.q]);
                // copies of y and x drop out of the board into the note, then ÷ and = write themselves
                const land = (nd, src, d) => M.at(g, [[d, g => { const all = S.wk.items, i = all.indexOf(nd); let x0 = 180 - M.lay(S.wk, 28).w / 2; for (let q = 0; q < i; q++) x0 += all[q]._m.w;
                  M.fly(g, { node: M.num(nd.v, null, { col: AMBER }), from: src, to: [x0 + nd._m.w / 2, NOTEY - 9], dur: 0.32 * T, arc: -26, s0: 32, s1: 28, then(g) { nd.alpha = 1; nd.pop = g.t; g.sfx('pop'); } }); }]]);
                land(yn, 'y' + j, 0.12 * T); land(xn, 'x' + j, 0.3 * T);
                M.at(g, [[0.3 * T, g => { dv.alpha = 1; M.writeIn(g, dv, { dur: 0.15 * T }); }], [0.62 * T, g => { eq.alpha = 1; M.writeIn(g, eq, { dur: 0.15 * T }); hop(g, 'think'); }]]);
              },
              resolve(g) {
                M.show(g, 1.15 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.22 * T }); M.indicate(g, S.q, { delay: 0.2 * T, dur: 0.3 * T, col: AMBER }); g.sfx('ding');
                M.at(g, [
                  [0.45 * T, g => { const from = { ...M.box(g, 'wq') }; S.q.alpha = 0;
                    M.fly(g, { node: M.num(fmt(k), null, { col: '#f0a020' }), from: [from.x, from.y], to: 'ks', dur: 0.36 * T, arc: -30, s0: 28, s1: 32,
                      then(g) { S.kv = M.num(fmt(k), 'kv', { _born: -1, pop: g.t }); S.kRow.items[2] = S.kv; S.relayK(); M.sparkle(g, 'kv', { n: 10 }); g.sfx('coin'); hop(g, 'laugh'); } });
                    fadeWork(g, 0.1 * T); M.unlight(g, 'x' + j); M.unlight(g, 'y' + j); }],
                  [0.6 * T, g => { rowArrow(g, j, { linger: 0.9 * T }); }],
                  [1.05 * T, g => { S.point = false; }],
                ]);
              } });
          }
          return out;
        }
        if (!S.kv) return out;
        const o = 1 - S.kRowJ, x = S.xs[o], y = S.ys[o];
        // 2. check the other row: x × k gives its y
        if (!S.chk) out.push({ tap: ['y' + o, 'x' + o], busy: 0.1, askAt: 0.8 * T, after: 0.95 * T, ask: { v: y, wrong: [fmt(x + k), fmt(y + k), fmt(x * (k + 1)), fmt(y - 1)] },
          then(g) {
            S.chk = true; M.show(g, 0.8 * T); S.point = true; hop(g, 'wow');
            M.circle(g, ['x' + o, 'y' + o], { dur: 0.5 * T, pad: 14, col: AMBER }); M.light(g, 'x' + o, { col: '#fff2b0' }); M.indicate(g, 'kv', { dur: 0.4 * T });
            rowArrow(g, o, { delay: 0.15 * T, linger: 1.3 * T });
            S.q2 = M.num(fmt(y), 'wq2', { alpha: 0, col: '#fff' }); M.at(g, [[0.2 * T, g => { work(g, [M.num(x), M.op('×'), M.num(fmt(k)), M.op('='), S.q2]); M.writeIn(g, S.wk, { dur: 0.45 * T }); }]]);
          },
          resolve(g) {
            M.show(g, 0.95 * T); S.q2.alpha = 1; M.writeIn(g, S.q2, { dur: 0.22 * T }); g.sfx('ding');
            M.at(g, [
              [0.3 * T, g => { const b = M.box(g, 'wq2'); M.fly(g, { node: M.txt('✓', null, { col: GOOD }), from: [b.x, b.y], to: [YC + 58, ROWY[o] - 12], dur: 0.32 * T, arc: -30, s0: 24, s1: 34,
                then(g) { S.ticks.push({ j: o, t: g.t }); M.indicate(g, 'y' + o, { col: GOOD, dur: 0.4 * T }); M.sparkle(g, [YC + 58, ROWY[o] - 12], { cols: [GOOD, '#fff', '#c8ffd8'] }); g.sfx('coin'); hop(g, 'laugh'); } }); }],
              [0.55 * T, g => { fadeWork(g, 0); M.unlight(g, 'x' + o); S.point = false; }],
            ]);
          } });
        // 3. k into y = ?x
        if (!S.eqd) out.push({ drag: 'kv', to: 'es', area: [180, SIGNY - 40, 340, SIGNY + 30], busy: 0.1,
          then(g) {
            S.eqd = true; M.show(g, 1.0 * T); hop(g, 'wow'); g.sfx('swoosh');
            M.fly(g, { node: M.num(fmt(k), null, { col: NAVY }), from: 'kv', to: 'es', dur: 0.36 * T, arc: -40, s0: 32, s1: 32,
              then(g) { S.ef = M.num(fmt(k), 'ef', { _born: -1, pop: g.t }); S.eRow.items[2] = S.ef; S.relayE(); M.sparkle(g, 'ef', { n: 10 }); g.sfx('pop'); } });
            M.at(g, [
              [0.45 * T, g => { M.circle(g, 'er', { dur: 0.5 * T, col: '#ffb21f' }); rowArrow(g, 0, { col: '#ffe9a0', linger: 0.4 * T }); rowArrow(g, 1, { col: '#ffe9a0', linger: 0.4 * T }); hop(g); }],
              [0.8 * T, g => { M.indicate(g, 'er', { sc: 1.12, dur: 0.35 * T }); M.sparkle(g, 'er', { n: 14, cols: [AMBER, '#fff', '#9ad8ff'] }); g.sfx('sparkle'); hop(g, 'laugh'); }],
            ]);
          } });
        return out;
      },
      area(g) { if (S.kRowJ == null) return ['y0', 'x0']; return !S.chk ? ['y' + (1 - S.kRowJ)] : ['kv', 'es']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('prop_station', station), 0, 0, 360, 640);
    // a little train rolls by on the rails every few seconds, puffing steam
    const tp = (t + 3) % 9; if (tp < 3.2) { const x = 420 - tp * 190; c.save();
      for (let i = 0; i < 3; i++) { const cx = x + i * 66; c.fillStyle = i ? ['#d8604a', '#e8a03a'][i - 1] : NAVY; c.beginPath(); c.roundRect(cx, 452, 60, 34, 6); c.fill(); c.fillStyle = '#fff6dc'; if (i) for (let w = 0; w < 3; w++) c.fillRect(cx + 7 + w * 17, 460, 11, 10); else { c.fillRect(cx + 8, 458, 14, 12); c.fillStyle = '#2a2a2a'; c.fillRect(cx + 34, 440, 10, 14); }
        c.fillStyle = '#2a2a30'; for (const wx of [cx + 14, cx + 46]) { c.beginPath(); c.arc(wx, 488, 7, 0, 7); c.fill(); } }
      for (let i = 0; i < 4; i++) { const k = ((t * 1.6 + i / 4) % 1); c.fillStyle = `rgba(255,255,255,${0.6 * (1 - k)})`; c.beginPath(); c.arc(x + 39 + k * 30, 432 - k * 40, 6 + k * 10, 0, 7); c.fill(); }
      c.restore(); }
    // the station clock, ticking
    c.save(); c.translate(318, 142); c.strokeStyle = '#2e5a4a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -112); c.lineTo(0, -22); c.stroke();
    c.fillStyle = '#2e5a4a'; c.beginPath(); c.arc(0, 0, 22, 0, 7); c.fill(); c.fillStyle = '#fffaf0'; c.beginPath(); c.arc(0, 0, 18, 0, 7); c.fill();
    c.strokeStyle = '#2a2a30'; c.lineWidth = 2; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.beginPath(); c.moveTo(Math.cos(a) * 14, Math.sin(a) * 14); c.lineTo(Math.cos(a) * 16.5, Math.sin(a) * 16.5); c.stroke(); }
    const sec = Math.floor(t) * Math.PI / 30 - Math.PI / 2; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(-1.2) * 9, Math.sin(-1.2) * 9); c.moveTo(0, 0); c.lineTo(Math.cos(0.6) * 13, Math.sin(0.6) * 13); c.stroke();
    c.strokeStyle = '#d8453a'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(sec) * 15, Math.sin(sec) * 15); c.stroke(); c.restore();
    // the departures board hanging from the canopy
    c.save(); c.strokeStyle = '#2e5a4a'; c.lineWidth = 3; for (const x of [80, 280]) { c.beginPath(); c.moveTo(x, 40); c.lineTo(x, 176); c.stroke(); }
    c.fillStyle = 'rgba(20,30,30,0.3)'; c.beginPath(); c.roundRect(44, 180, 276, 172, 12); c.fill();
    c.fillStyle = '#3e4a54'; c.beginPath(); c.roundRect(38, 172, 284, 174, 12); c.fill(); c.fillStyle = BOARD; c.beginPath(); c.roundRect(46, 180, 268, 158, 8); c.fill();
    c.strokeStyle = 'rgba(246,236,210,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(60, 224); c.lineTo(300, 224); c.moveTo(180, 190); c.lineTo(180, 330); c.stroke(); c.restore();
    for (let j = 0; j < 2; j++) for (const id of ['x' + j, 'y' + j]) { const b = M.box(g, id); if (b) tile(c, b, t); }
    for (const k of ['hx', 'hy', 'cx0', 'cy0', 'cx1', 'cy1']) M.drawEx(g, c, k);
    // green ticks for checked rows
    for (const tk of S.ticks) { const k = M.clamp((t - tk.t) / 0.2, 0, 1); c.save(); c.globalAlpha = k; c.font = M.NUMF(34, 700); c.textAlign = 'center'; c.fillStyle = GOOD; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 4; c.fillText('✓', YC + 58, ROWY[tk.j]); c.restore(); }
    // the working note, on a dark pill under the board
    if (S.wk && g.s.mk.ex.wk) { const m = M.lay(S.wk, 28), a = S.wk.alpha ?? 1; c.save(); c.globalAlpha = a * M.clamp((t - S.wkAt) / 0.15, 0, 1); c.fillStyle = 'rgba(22,32,40,0.82)'; c.beginPath(); c.roundRect(180 - m.w / 2 - 14, NOTEY - 30, m.w + 28, 42, 21); c.fill(); c.restore(); M.drawEx(g, c, 'wk'); }
    // the enamel platform sign
    c.save(); c.fillStyle = 'rgba(20,30,40,0.3)'; c.beginPath(); c.roundRect(28, 406, 308, 58, 12); c.fill();
    c.fillStyle = NAVY; c.beginPath(); c.roundRect(24, 400, 312, 58, 12); c.fill(); c.fillStyle = '#fbf6e8'; c.beginPath(); c.roundRect(29, 405, 302, 48, 8); c.fill();
    c.strokeStyle = 'rgba(31,58,106,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(176, 410); c.lineTo(176, 448); c.stroke(); c.restore();
    M.drawEx(g, c, 'kr'); M.drawEx(g, c, 'er');
    // the pigeon conductor
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', 296, 604 - hopK * 22, 1.45, { t, pose, expr, facing: -1, tint: '#8a94b8' }); else SCN.host(g, c, 'bird', 296, 604, 1.4); } catch (e) { SCN.host(g, c, 'bird', 296, 604, 1.4); }
    M.drawUI(g, c);
  },
});
