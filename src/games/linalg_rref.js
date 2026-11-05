// linalg_rref.js — RREF! Solve a 2×2 system by row reduction of its augmented matrix [1 a | p ; m b | q].
// Each row floats on the river as a birch log; the beaver herds them. Moves:
//   1. Drag row 1 onto row 2 (R₂ − mR₁): a copy of row 1 floats down between the logs, "−2R₁" writes itself beside
//      it, its numbers roll over to −2 times themselves, then column by column each one drops into row 2, whose entry
//      rolls over to the sum. The first entry becomes 0.
//   2. Tap row 2 to scale it: "÷ (−1)" writes itself beside it and its entries roll over: the pivot becomes 1.
//   3. Drag row 2 onto row 1 (R₁ − aR₂): the same copy-and-add, which clears the entry above the pivot.
// The matrix is then [1 0 | x ; 0 1 | y]: the last column is the solution (x and y head the columns).
// Wrong moves (they only wobble): tapping row 2 first (scaling it now makes fractions), dragging row 2 down first,
// tapping row 1. Level 0: m = 2, small positive answers. Level 1: m = 2 or 3. Level 2: negatives.
// Medium mode: the new pivot, the scaled last entry and x are picked from the tray.
const M = MK, INK = '#3a2210', WHITE = '#f4fbff', OPC = '#1d6fb8', HX = 70, HY = 604;
const CX = [116, 194, 284], BARX = 239, Y1 = 290, Y2 = 410, YC = 350, ES = 40, LX0 = 76, LX1 = 312;
function pick(g) {
  const L = g.level, R = a => a[Math.floor(g.rand() * a.length)], ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let i = 0; i < 400; i++) {
    const m = R(L === 0 ? [2] : L === 1 ? [2, 3] : [-2, 3, 4, -3]), a = R(L === 0 ? [1, 2] : L === 1 ? [1, 2, 3] : [-2, -1, 2, 3]), d = R(L === 0 ? [-1, 2] : L === 1 ? [-1, 2, -2, 3] : [-2, 3, -3, 2]);
    const x = L === 2 ? ri(-3, 5) : ri(1, 4), y = L === 2 ? ri(-3, 5) : ri(1, 4); if (!x || !y || x === y) continue;
    const b = d + m * a, p = x + a * y, q = m * x + b * y, lim = L === 2 ? 24 : 20;
    if (!b || !p || !q || [b, p, q].some(v => Math.abs(v) > lim)) continue;
    if (L < 2 && [b, p, q].some(v => v < 0)) continue;
    return { m, a, d, x, y, b, p, q };
  }
  return { m: 2, a: 1, d: -1, x: 3, y: 2, b: 1, p: 5, q: 8 };
}
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
const by = y => y - ES * 0.34; // the centre of a row's numbers
// a row-operation label like −2R₁, +R₂ (the coefficient c is what the copied row is multiplied by)
const opLabel = (c, r) => M.row(M.op(c < 0 ? '-' : '+'), Math.abs(c) === 1 ? null : M.num(Math.abs(c)), M.sup(M.vr('R'), M.num(r, null, { dy: 23 * 0.62 })));

MG.add({
  id: 'linalg_rref', stage: 'linalg', cmd: 'RREF!', hint: 'drag', time: 10, mood: 'bright', winText: 'Reduced!', hold: 1.7,
  card: {
    title: 'Row reduction', ref: 'College', kind: 'Linear algebra',
    text: 'A system like x + y = 5 and 2x + 3y = 13 can be written as a grid of numbers, an augmented matrix. Each row is one equation; the columns hold the numbers of x, the numbers of y, and the right-hand sides.\n\nThree moves never change the solutions: add a multiple of one row to another, multiply a row by a number that is not 0, and swap two rows.\n\nUse them to make the left part look like 1 0 / 0 1. Here R₂ − 2R₁ gives 0 1 | 3, so y = 3. Then R₁ − R₂ gives 1 0 | 2, so x = 2. That finished form is called reduced row echelon form, RREF. The last column is the answer.',
    note: 'Clear the entry under the first pivot (R₂ − mR₁), scale row 2 so its pivot is 1, then clear the entry above it (R₁ − aR₂). The last column is then x and y.',
    ask: 'Row-reduce [1 2 | 4 ; 3 5 | 11]. What are x and y?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { m, a, d, x, y, b, p, q } = S, T = M.pace(g);
    S.rows = [[1, a, p], [m, b, q]];
    S.en = S.rows.map((r, i) => r.map((v, j) => { const n = M.num(v, 'e' + (i + 1) + j); M.place(g, 'e' + (i + 1) + j, n, CX[j], i ? Y2 : Y1, ES, { col: INK }); return n; }));
    const placeAll = () => S.en.forEach((r, i) => r.forEach((n, j) => M.place(g, 'e' + (i + 1) + j, n, CX[j], i ? Y2 : Y1, ES, { col: INK })));
    M.inert(g, S.en.flat().map(n => n.id));
    M.zone(g, 'R1', { x: (LX0 + LX1) / 2, y: by(Y1), w: LX1 - LX0, h: 58 }); M.zone(g, 'R2', { x: (LX0 + LX1) / 2, y: by(Y2), w: LX1 - LX0, h: 58 });
    g.dur *= (2.6 + 1.05 * 4) / 8;
    // add c × (row src) to row dst, shown with a floating copy of the source row
    const addRow = (src, dst, c, ask) => ({ drag: 'R' + (src + 1), to: 'R' + (dst + 1), area: [LX0 - 10, by(dst ? Y2 : Y1) - 44, LX1 + 10, by(dst ? Y2 : Y1) + 44], busy: 0.1, askAt: 0.8 * T, after: 1.05 * T, ask,
      then(g) { S.step++; S.point = true; hop(g, 'think'); g.sfx('swoosh'); M.show(g, 0.8 * T); S.glow = { r: src, t: g.t };
        const ys = src ? Y2 : Y1; S.cp = { y0: ys, y1: YC, t0: g.t, dur: 0.32 * T, alpha: 1, nums: S.rows[src].map(v => M.num(v)), lab: opLabel(c, src + 1), labT: g.t + 0.28 * T, src };
        M.at(g, [[0.4 * T, g => { S.cp.nums.forEach((n, j) => M.roll(g, n, c * S.rows[src][j], { delay: j * 0.08 * T, dur: 0.28 * T })); g.sfx('tap'); hop(g); }]]); },
      resolve(g) { M.show(g, 1.05 * T); S.point = true;
        const list = [];
        S.rows[dst].forEach((v, j) => list.push([j * 0.2 * T, g => { const cx = CX[j]; S.cp.gone = S.cp.gone || []; S.cp.gone[j] = true;
          M.fly(g, { node: M.num(c * S.rows[src][j]), from: [cx, by(YC)], to: 'e' + (dst + 1) + j, dur: 0.26 * T, arc: dst ? -10 : 10, s0: 32, s1: ES, col: OPC,
            then(g) { const nv = S.rows[dst][j] + c * S.rows[src][j]; S.rows[dst][j] = nv; const n = S.en[dst][j]; M.roll(g, n, nv, { dur: 0.26 * T }); n.pop = g.t; placeAll();
              M.sparkle(g, n.id, { n: nv === 0 ? 12 : 6, cols: nv === 0 ? ['#bff0ff', '#fff'] : ['#ffe7a0', '#fff'] }); g.sfx(nv === 0 ? 'ding' : 'pop', { p: 1 + j * 0.1 }); hop(g); } }); }]));
        list.push([0.85 * T, g => { S.cp.out = g.t; }], [1.05 * T, g => { S.cp = null; S.point = false; }]);
        M.at(g, list); } });
    // multiply a row by 1/k
    const scale = { tap: 'R2', busy: 0.1, askAt: 0.5 * T, after: 0.75 * T, ask: { v: y, wrong: [q - m * p - d, -y, (q - m * p) * d, y + 1].filter(w => w !== y) },
      then(g) { S.step++; S.point = true; hop(g, 'think'); M.show(g, 0.5 * T); S.glow = { r: 1, t: g.t };
        S.div = { node: M.row(M.op('÷'), d < 0 ? M.paren(M.num(d)) : M.num(d)), t0: g.t + 0.05 * T }; g.sfx('tap'); },
      resolve(g) { M.show(g, 0.75 * T); const list = [];
        S.rows[1].forEach((v, j) => list.push([j * 0.15 * T, g => { const nv = v / d; S.rows[1][j] = nv; const n = S.en[1][j];
          if (nv === v) M.indicate(g, n, { sc: 1.2, dur: 0.3 * T }); else { M.roll(g, n, nv, { dur: 0.28 * T }); n.pop = g.t; placeAll(); }
          M.sparkle(g, n.id, { n: 6 }); g.sfx('pop', { p: 1 + j * 0.1 }); hop(g); }]));
        list.push([0.5 * T, g => { S.div.out = g.t; }], [0.75 * T, g => { S.div = null; S.point = false; }]); M.at(g, list); } };
    S.step = 0;
    const moves = [
      addRow(0, 1, -m, { v: b - m * a, wrong: [b + m * a, b - a, m * a - b].filter(w => w !== b - m * a) }),
      scale,
      addRow(1, 0, -a, { v: x, wrong: [p + a * y, p - y, x + 1].filter(w => w !== x) }),
    ];
    M.play(g, { moves(g) { return S.step < 3 ? [moves[S.step]] : []; }, area(g) { return S.step === 0 ? ['R1', 'R2'] : S.step === 1 ? 'R2' : ['R2', 'R1']; },
      onWin(g) { S.wonAt = g.t; } });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, mk = S.mk, T = M.pace(g);
    c.drawImage(g.bake('rref_river', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    P.water(c, 360, 196, 560, '#1f5f86', '#5ab0cc', t, { waves: 7 });
    // brackets, the augmented bar and the column heads
    c.save(); c.strokeStyle = WHITE; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = 'rgba(0,30,60,0.5)'; c.shadowBlur = 4;
    for (const [xx, dd] of [[LX0 - 10, 1], [LX1 + 10, -1]]) { c.beginPath(); c.moveTo(xx + dd * 12, 244); c.lineTo(xx, 244); c.lineTo(xx, 442); c.lineTo(xx + dd * 12, 442); c.stroke(); }
    c.setLineDash([7, 7]); c.lineWidth = 3; c.beginPath(); c.moveTo(BARX, 248); c.lineTo(BARX, 438); c.stroke(); c.restore();
    const fin = S.wonAt != null ? M.clamp((t - S.wonAt) / 0.4, 0, 1) : 0;
    ['x', 'y'].forEach((v, j) => { const n = M.vr(v), s = 26 + fin * 6, mm = M.lay(n, s); c.save(); c.shadowColor = fin ? '#ffe27a' : 'rgba(0,20,50,0.8)'; c.shadowBlur = fin ? 14 * fin : 5; M.draw(c, n, CX[j] - mm.w / 2, 236, s, { col: fin ? M.mix(WHITE, '#ffe27a', fin) : WHITE }); c.restore(); });
    // the two logs (a dragged log rides under the finger; its place stays as a faint wet mark)
    const P0 = mk.press, dragR = P0 && P0.dragging && /^R[12]$/.test(P0.id) ? +P0.id[1] - 1 : -1;
    [Y1, Y2].forEach((yy, i) => { const gl = S.glow && S.glow.r === i ? Math.max(0, 1 - (t - S.glow.t) / (0.9 * T)) : 0; log(c, by(yy), t, i, dragR === i ? 0.35 : 1, gl); });
    if (S.wonAt != null) for (const yy of [Y1, Y2]) { const k = M.clamp((t - S.wonAt - 0.1) / 0.4, 0, 1); c.save(); c.globalAlpha = 0.5 * Math.sin(k * Math.PI); c.fillStyle = '#ffe27a'; c.beginPath(); c.roundRect(BARX + 8, by(yy) - 24, LX1 - BARX - 8, 48, 14); c.fill(); c.restore(); }
    for (const key of Object.keys(mk.ex)) M.drawEx(g, c, key);
    // the floating copy of a row, between the logs
    if (S.cp) { const cp = S.cp, k = M.easeIO((t - cp.t0) / cp.dur), yy = M.lerp(cp.y0, cp.y1, k), out = cp.out ? M.clamp(1 - (t - cp.out) / 0.2, 0, 1) : 1;
      c.save(); c.globalAlpha = out; log(c, by(yy), t, 2, 0.55, 0, 0.82);
      cp.nums.forEach((n, j) => { if (cp.gone && cp.gone[j]) return; const mm = M.lay(n, 32); M.draw(c, n, CX[j] - mm.w / 2, by(yy) + 12, 32, { t, col: OPC }); });
      if (t > cp.labT) { const kk = M.clamp((t - cp.labT) / 0.25, 0, 1), mm = M.lay(cp.lab, 23); c.save(); c.beginPath(); c.rect(2, by(yy) - 30, 62 * kk + 2, 60); c.clip(); c.shadowColor = 'rgba(0,20,50,0.8)'; c.shadowBlur = 5; M.draw(c, cp.lab, 34 - mm.w / 2, by(yy) + 4, 23, { t, col: WHITE }); c.restore(); }
      c.restore(); }
    if (S.div) { const dv = S.div, kk = M.clamp((t - dv.t0) / 0.25, 0, 1), out = dv.out ? M.clamp(1 - (t - dv.out) / 0.2, 0, 1) : 1, mm = M.lay(dv.node, 22);
      c.save(); c.globalAlpha = out; c.beginPath(); c.rect(0, by(Y2) - 30, 66 * kk + 2, 60); c.clip(); c.shadowColor = 'rgba(0,20,50,0.8)'; c.shadowBlur = 5; M.draw(c, dv.node, 34 - mm.w / 2, by(Y2) + 8, 22, { t, col: WHITE }); c.restore(); }
    if (dragR >= 0) { c.save(); c.translate(0, P0.y - 16 - by(dragR ? Y2 : Y1)); c.translate((P0.x - P0.x0) * 0.4, 0); log(c, by(dragR ? Y2 : Y1), t, dragR, 0.9, 0.6);
      S.en[dragR].forEach((n, j) => { const mm = M.lay(n, ES); M.draw(c, { ...n, pop: null, roll: null }, CX[j] - mm.w / 2, dragR ? Y2 : Y1, ES, { col: INK }); }); c.restore(); }
    // the beaver on the near bank points at the logs while the work is shown
    const hk = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && t - mk.missAt < 0.7;
    const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'beaver', HX, HY - hk * 22, 1.4, { t, pose, expr }); else SCN.host(g, c, 'beaver', HX, HY, 1.4);
    M.drawUI(g, c);
  },
});

// a pale birch log lying across the river, cut ends showing rings
function log(c, cy, t, i, alpha, glow, sc = 1) {
  const x0 = LX0, x1 = LX1, h = 52 * sc, bob = Math.sin(t * 1.6 + i * 2) * 1.5, y = cy + bob; c.save(); c.globalAlpha *= alpha;
  c.fillStyle = 'rgba(10,40,70,0.35)'; c.beginPath(); c.ellipse((x0 + x1) / 2, y + h * 0.48, (x1 - x0) / 2 + 6, 8, 0, 0, 7); c.fill();
  if (glow > 0) { c.shadowColor = '#ffe27a'; c.shadowBlur = 22 * glow; }
  const gr = c.createLinearGradient(0, y - h / 2, 0, y + h / 2); gr.addColorStop(0, '#fbf6ea'); gr.addColorStop(0.55, '#ece2cc'); gr.addColorStop(1, '#bfae8e');
  c.fillStyle = gr; c.beginPath(); c.roundRect(x0, y - h / 2, x1 - x0, h, h / 2); c.fill(); c.shadowBlur = 0;
  c.fillStyle = 'rgba(60,40,30,0.55)'; for (let k = 0; k < 9; k++) { const xx = x0 + 22 + k * 25 + (k % 3) * 4; c.fillRect(xx, y - h / 2 + 4 + (k % 2) * 3, 9 + (k % 3) * 3, 2.5); c.fillRect(xx + 6, y + h / 2 - 9 - (k % 2) * 2, 7, 2); }
  c.fillStyle = '#e6c890'; c.beginPath(); c.ellipse(x1 - 4, y, 9, h / 2 - 1, 0, 0, 7); c.fill(); c.strokeStyle = '#b08850'; c.lineWidth = 1.2; for (const r of [0.75, 0.45]) { c.beginPath(); c.ellipse(x1 - 4, y, 9 * r, (h / 2 - 1) * r, 0, 0, 7); c.stroke(); }
  // ripples around the ends
  c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1.5; const rk = (t * 0.6 + i * 0.3) % 1; c.globalAlpha *= 1 - rk;
  for (const xx of [x0 - 4, x1 + 6]) { c.beginPath(); c.ellipse(xx, y + h * 0.42, 8 + rk * 16, 3 + rk * 4, 0, 0, 7); c.stroke(); }
  c.restore();
}
function paintBg(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 200); sk.addColorStop(0, '#8cc8f0'); sk.addColorStop(1, '#fdf0d0'); c.fillStyle = sk; c.fillRect(0, 0, W, 200);
  const sg = c.createRadialGradient(290, 70, 4, 290, 70, 120); sg.addColorStop(0, 'rgba(255,248,214,1)'); sg.addColorStop(0.2, 'rgba(255,236,180,0.6)'); sg.addColorStop(1, 'rgba(255,236,180,0)'); c.fillStyle = sg; c.fillRect(150, 0, 210, 200);
  // the far bank: a row of round trees
  for (let i = 0; i < 12; i++) { const x = i * 33 + (i % 2) * 8, r = 26 + (i % 3) * 7; c.fillStyle = i % 2 ? '#4f8a4a' : '#5f9c50'; c.beginPath(); c.arc(x, 186 - r * 0.6, r, 0, 7); c.fill(); c.fillStyle = 'rgba(255,240,190,0.25)'; c.beginPath(); c.arc(x - r * 0.3, 186 - r, r * 0.45, 0, 7); c.fill(); }
  c.fillStyle = '#6a8a40'; c.fillRect(0, 184, W, 14);
  // the near bank, with reeds
  c.fillStyle = '#6aa848'; c.beginPath(); c.moveTo(0, 572); c.quadraticCurveTo(120, 548, 240, 566); c.quadraticCurveTo(310, 576, 360, 556); c.lineTo(360, H); c.lineTo(0, H); c.fill();
  c.fillStyle = '#5a9238'; c.beginPath(); c.moveTo(0, 600); c.quadraticCurveTo(180, 584, 360, 600); c.lineTo(360, H); c.lineTo(0, H); c.fill();
  P.flowers(c, W, 590, 640, 14, ['#ffffff', '#ffd23a', '#ff9ab8'], 7);
  for (let i = 0; i < 9; i++) { const x = 160 + i * 22, h = 40 + (i % 3) * 14; c.strokeStyle = '#3e7a30'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, 576); c.quadraticCurveTo(x + 4, 576 - h / 2, x + (i % 2 ? 6 : -4), 576 - h); c.stroke();
    if (i % 3 === 0) { c.fillStyle = '#7a4a22'; c.beginPath(); c.ellipse(x + (i % 2 ? 6 : -4), 570 - h, 3.5, 9, 0, 0, 7); c.fill(); } }
}
