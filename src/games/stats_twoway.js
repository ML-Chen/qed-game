// stats_twoway.js — TWO-WAY TABLE! Relative frequencies by row: what percent of each grade plays a sport?
// A forest clubhouse at dusk, with string lights, fireflies and a duck. A survey table is pinned to the clubhouse
// board: two grades (rows) by "sport" and "no sport" (columns), with row totals, column totals and the grand total.
// Every move's working plays by itself:
//   1. Drag a row's total onto its cells (either row first): the row is circled, two copies of the total fly under the
//      cells, whose fraction bars draw themselves (12/20 and 8/20); "× 5" writes itself in the total's cell, every
//      number in the row rolls (12 → 60, 8 → 40, 20 → 100), and each "/100" turns into "%": 60% and 40%, total 100%.
//   2. The same for the other row, with its own total (10/25 → 40/100 = 40%).
// Dragging the grand total onto a row acts out the classic mistake: "12 ÷ 45?" appears in red and wobbles.
// Level 0: row totals of 10 or 20. Level 1: 20, 25 or 50. Level 2: 4, 20, 25 or 50 with any split.
// Medium mode: the tray asks for the first cell's percent once the fractions and "× 5" are written.
const M = MK, INK = '#2a2440', PAPER = '#fdf6e4', GREEN = '#1f8a52', CX = [53, 131, 217, 301], HEADY = 224, ROWY = [309, 403], TOTY = 476, LINEY = [248, 346, 436];
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  const pool = L === 0 ? [10, 20] : L === 1 ? [20, 25, 50] : [4, 20, 25, 50];
  const row = () => { const T = pool[r(pool.length)], m = 100 / T; let a; do { a = 1 + r(T - 1); } while (a * m === 50 || (L === 0 && (a * m) % 10)); return [a, T - a, T]; };
  let A = row(), B = row(); for (let i = 0; i < 20 && A[0] * 100 / A[2] === B[0] * 100 / B[2]; i++) B = row();
  return { rows: [A, B] };
}
// a clubhouse in the woods at dusk: a rose and violet sky, dark pines, the plank wall of the clubhouse
function woods(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 470); sk.addColorStop(0, '#2c2558'); sk.addColorStop(0.5, '#8a4a7a'); sk.addColorStop(0.85, '#e88a7a'); sk.addColorStop(1, '#f6b884'); c.fillStyle = sk; c.fillRect(0, 0, W, 470);
  const R = P.rng(5); for (let i = 0; i < 50; i++) { c.fillStyle = `rgba(255,250,230,${0.2 + R() * 0.6})`; c.beginPath(); c.arc(R() * W, R() * 170, R() * 1.2 + 0.3, 0, 7); c.fill(); }
  c.fillStyle = '#fff2d8'; c.beginPath(); c.arc(300, 64, 14, 0, 7); c.fill(); c.fillStyle = '#2c2558'; c.beginPath(); c.arc(294, 60, 13, 0, 7); c.fill();
  for (let i = 0; i < 9; i++) { const x = i * 46 - 10 + R() * 14, h = 150 + R() * 90, base = 470; c.fillStyle = i % 2 ? '#1e3a44' : '#24444e';
    for (let k = 0; k < 5; k++) { const y = base - h + k * h / 5, w = 14 + k * 9; c.beginPath(); c.moveTo(x, y - 16); c.lineTo(x - w, y + h / 5); c.lineTo(x + w, y + h / 5); c.fill(); } }
  // the clubhouse's plank wall and the grass
  const gr = c.createLinearGradient(0, 470, 0, H); gr.addColorStop(0, '#2e5a3a'); gr.addColorStop(1, '#1e3a28'); c.fillStyle = gr; c.fillRect(0, 466, W, H - 466);
  c.fillStyle = 'rgba(120,200,120,0.25)'; for (let i = 0; i < 60; i++) { const x = R() * W, y = 480 + R() * 160; c.fillRect(x, y, 2, 6 + R() * 6); }
}

MG.add({
  id: 'stats_twoway', stage: 'stats', cmd: 'TWO-WAY TABLE!', hint: 'drag', time: 9, mood: 'party', winText: 'By row!', hold: 1.7,
  card: {
    title: 'Two-way tables', ref: 'Grade 8', kind: 'Statistics',
    text: 'A two-way table sorts a group in two ways at once, such as by grade and by whether each person plays a sport.\n\nTo compare the grades fairly, turn each row into percents of that row\'s own total. If 12 of the 20 seventh graders play a sport, that is 12/20. Multiply top and bottom by 5 to get 60/100, which is 60%.\n\nDo the same for the eighth graders, using their total. Now the rows are easy to compare, even though the grades have different sizes.\n\nDon\'t divide by the grand total: that answers a different question.',
    note: 'Row relative frequency = cell ÷ row total. Each row then adds up to 100%.',
    ask: '15 of 25 eighth graders play a sport. What percent is that? What percent do not?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g); S.face = 'happy'; S.done = [false, false];
    const [A, B] = S.rows; S.cols = [A[0] + B[0], A[1] + B[1], A[2] + B[2]];
    const keys = ['a', 'b', 't'];
    S.cell = S.rows.map((rw, j) => rw.map((v, k) => M.num(v, keys[k] + j)));
    S.place = (j, k, node) => M.place(g, 'c' + j + k, node || S.cell[j][k], CX[k + 1], ROWY[j], Math.max(26, Math.min(36, 36 * 70 / M.lay(node || S.cell[j][k], 36).w)), { col: k === 2 ? '#5a3a8a' : INK });
    for (let j = 0; j < 2; j++) for (let k = 0; k < 3; k++) S.place(j, k);
    ['sa', 'sb', 'gt'].forEach((id, k) => M.place(g, id, M.num(S.cols[k], id), CX[k + 1], TOTY, 30, { col: '#6a5a7a' }));
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    M.onMiss(g, (g, info) => { // the classic mistake: dividing a cell by the grand total
      if (info.drag !== 'gt' || !/^[ab][01]$/.test(info.to || '')) return; const j = +info.to[1], k = info.to[0] === 'a' ? 0 : 1;
      M.note(g, { node: M.row(M.num(S.rows[j][k]), M.op('÷'), M.num(S.cols[2]), M.txt('?')), at: info.to, off: [0, -36], s: 24, col: '#ff8a7a', pill: 'rgba(40,20,40,0.85)', write: 0.25, hold: 0.4, fade: 0.25 }); });
    g.dur *= (2.6 + 1.05 * 2) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        for (const j of [0, 1]) {
          if (S.done[j]) continue; const [a, b, tot] = S.rows[j], m = 100 / tot, pa = a * m, pb = b * m;
          out.push({ drag: 't' + j, to: ['a' + j, 'b' + j], area: [88, ROWY[j] - 58, 260, ROWY[j] + 30], busy: 0.1, askAt: 1.0 * T, after: 1.15 * T,
            ask: { v: pa, wrong: [a, pb, Math.round(a * 100 / S.cols[2]), pa + 10].filter(w => w !== pa && w > 0) },
            then(g) {
              S.done[j] = true; M.show(g, 1.0 * T); S.point = j + 1; hop(g, 'wow'); g.sfx('swoosh'); S.rowGlow = { j, t: g.t };
              M.circle(g, ['a' + j, 't' + j], { dur: 0.5 * T, pad: 12, col: '#ffb21f' }); M.indicate(g, 't' + j, { dur: 0.4 * T });
              // the total drops under each cell: a/tot and b/tot
              S.fr = S.fr || []; S.fr[j] = [0, 1].map(k => { const nu = S.cell[j][k], de = M.num(tot, null, { alpha: 0 }); nu.id = null; const f = M.frac(nu, de, (k ? 'b' : 'a') + j, { bar: { t0: g.t + 0.2 * T, dur: 0.25 * T } }); f.de = de; S.place(j, k, f); return f; });
              [0, 1].forEach(k => M.fly(g, { node: M.num(tot, null, { col: '#5a3a8a' }), from: 't' + j, to: [CX[k + 1], ROWY[j] + 9], delay: 0.15 * T + k * 0.12 * T, dur: 0.38 * T, arc: -36, s0: 36, s1: 30,
                then(g) { const de = S.fr[j][k].de; de.alpha = 1; de.pop = g.t; g.sfx('pop'); } }));
              M.at(g, [[0.6 * T, g => { M.tween(g, S.cell[j][2], { alpha: 0.25 }, 0.2 * T);
                M.note(g, { node: M.row(M.op('×'), M.num(m)), at: 't' + j, s: 28, col: '#fff4c8', pill: 'rgba(60,30,80,0.88)', write: 0.3 * T, hold: 0.5 * T, fade: 0.25 * T }); hop(g, 'think'); }]]);
            },
            resolve(g) {
              M.show(g, 1.15 * T); g.sfx('ding');
              const F = S.fr[j];
              [0, 1].forEach(k => { const f = F[k], v = S.rows[j][k] * m; M.roll(g, f.n, v, { delay: k * 0.08 * T, dur: 0.3 * T }); M.roll(g, f.de, 100, { delay: 0.1 * T + k * 0.08 * T, dur: 0.3 * T }); });
              M.at(g, [
                [0.5 * T, g => { [0, 1].forEach(k => { const f = F[k]; M.tween(g, f.de, { alpha: 0, dy: -10 }, 0.25 * T); M.tween(g, f, { hl: 0 }, 0.1); }); g.sfx('tap'); }],
                [0.72 * T, g => { [0, 1].forEach(k => { const f = F[k], nu = f.n; nu.id = (k ? 'b' : 'a') + j; nu.col = GREEN; const pc = M.row(nu, M.txt('%', null, { col: GREEN })); pc.id = 'p' + k + j; S.place(j, k, pc); M.sparkle(g, nu.id, { n: 8, cols: ['#9ae07a', '#fff', '#ffd86a'] }); });
                  const tn = S.cell[j][2]; tn.alpha = 1; M.roll(g, tn, 100, { dur: 0.25 * T }); const tp = M.row(tn, M.txt('%', null, { col: '#5a3a8a' })); tp.id = 'tp' + j; S.place(j, 2, tp); g.sfx('coin'); hop(g, 'laugh'); }],
                [1.0 * T, g => { S.point = false; }],
              ]);
            } });
        }
        return out;
      },
      area(g) { const j = S.done[0] ? 1 : 0; return ['t' + j, 'a' + j]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('twoway_woods', woods), 0, 0, 360, 640);
    // the clubhouse board with string lights along its top
    c.save(); c.fillStyle = 'rgba(10,10,30,0.35)'; c.beginPath(); c.roundRect(14, 180, 340, 334, 14); c.fill();
    c.fillStyle = '#7a4e2e'; c.beginPath(); c.roundRect(8, 172, 344, 334, 14); c.fill(); c.strokeStyle = '#4a2a14'; c.lineWidth = 3; c.stroke();
    c.fillStyle = PAPER; c.beginPath(); c.roundRect(18, 184, 324, 312, 6); c.fill();
    // the grid
    c.strokeStyle = 'rgba(42,36,64,0.35)'; c.lineWidth = 1.5; c.beginPath();
    for (const y of LINEY) { c.moveTo(22, y); c.lineTo(338, y); } for (const x of [88, 174, 260]) { c.moveTo(x, 190); c.lineTo(x, 490); } c.stroke();
    c.strokeStyle = 'rgba(42,36,64,0.7)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(22, LINEY[2]); c.lineTo(338, LINEY[2]); c.moveTo(260, 190); c.lineTo(260, 490); c.stroke();
    // the row being worked on glows softly
    if (S.rowGlow) { const k = M.clamp((t - S.rowGlow.t) / 0.25, 0, 1) * M.clamp(1 - (t - S.rowGlow.t - 1.9) / 0.4, 0, 1); if (k > 0) { c.fillStyle = `rgba(255,214,90,${0.22 * k})`; const y0 = LINEY[S.rowGlow.j]; c.fillRect(22, y0 + 1, 316, LINEY[S.rowGlow.j + 1] - y0 - 2); } }
    for (let i = 0; i < 12; i++) { const x = 20 + i * 29, y = 172 + Math.sin(i * 0.8) * 3, a = 0.6 + 0.4 * Math.sin(t * 2.5 + i * 1.7); c.fillStyle = '#3a2a1a'; c.fillRect(x - 1, y - 6, 2, 5); c.globalAlpha = a; c.fillStyle = ['#ffd84a', '#ff8a6a', '#8ae0ff', '#c8ff8a'][i % 4]; c.shadowColor = c.fillStyle; c.shadowBlur = 10; c.beginPath(); c.arc(x, y + 2, 4, 0, 7); c.fill(); c.globalAlpha = 1; c.shadowBlur = 0; }
    c.restore();
    // headings and row labels, bold
    c.save(); c.textAlign = 'center'; c.fillStyle = INK; [['sport', 1, 22], ['no sport', 2, 20], ['total', 3, 22]].forEach(([s, k, z]) => { c.font = M.NUMF(z, 700); c.fillText(s, CX[k], HEADY); });
    c.font = M.NUMF(28, 700); c.fillText('7th', CX[0], ROWY[0] - 2); c.fillText('8th', CX[0], ROWY[1] - 2); c.fillStyle = '#5a4a6a'; c.font = M.NUMF(22, 700); c.fillText('total', CX[0], TOTY - 3); c.restore();
    for (const k of ['sa', 'sb', 'gt']) M.drawEx(g, c, k);
    for (let j = 0; j < 2; j++) for (let k = 0; k < 3; k++) M.drawEx(g, c, 'c' + j + k);
    // fireflies drifting in the dusk
    c.save(); for (let i = 0; i < 14; i++) { const x = (i * 67 + Math.sin(t * 0.7 + i) * 20) % 360, y = 516 + (i * 37) % 110 + Math.cos(t * 0.6 + i * 2) * 10, a = 0.3 + 0.6 * Math.abs(Math.sin(t * 2 + i)); c.fillStyle = `rgba(230,255,140,${a})`; c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); } c.restore();
    // the duck takes the survey, with a friend
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') { ANI.draw(c, 'frog', 292, 602 - hopK * 10, 0.95, { t, phase: 1, facing: -1, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : 'happy' }); ANI.draw(c, 'duck', 86, 616 - hopK * 16, 1.3, { t, pose, expr }); }
      else SCN.host(g, c, 'duck', 86, 604, 1.4); } catch (e) { SCN.host(g, c, 'duck', 86, 604, 1.4); }
    M.drawUI(g, c);
  },
});
