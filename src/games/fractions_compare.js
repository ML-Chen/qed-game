// fractions_compare.js — COMPARE! Which fraction is bigger? Show both as parts of the same-sized bar and look.
// A swamp at dusk. The two fractions are painted on a cypress-wood sign with a little alligator between them; below, on a
// wooden dock, two empty chocolate-bar wrappers of exactly the same length.
//   1-2. Drag each fraction onto a wrapper, in either order. The fraction flies to the wrapper's end. Its bottom number
//        lights up and the wrapper splits itself into that many equal pieces (the score lines draw one by one); then the
//        top number lights up and that many pieces fill with chocolate one after another, each counted 1, 2, 3 above it.
//   3.   Tap the bigger fraction (or its bar). A dashed line drops from the end of the shorter chocolate across both bars,
//        and the extra chocolate on the longer bar glows: that is how much bigger it is. The alligator turns to the
//        bigger one and opens its jaws wide (hungry alligators eat the bigger amount), and the jaws become the sign
//        > or <, which writes itself in.
// Level 0: the same top number (3/8 and 3/4: eighths are smaller pieces). Level 1: different tops and bottoms, a clear
// gap. Level 2: closer fractions with bottoms up to 10. Medium mode: the tray asks for the sign.
// Tapping the smaller fraction is the classic slip (8 is bigger than 4, so 3/8 must be bigger?): the alligator lunges at
// it, finds the shorter bar and shakes its head.
const M = MK, INK = '#fff1d8', BX = 80, BW = 250, BH = 34, BY = [394, 452], SY = 262, GX = 180, HX = 312, HY = 214;
const COLS = ['#ff9ec0', '#8fd0ff'], FOIL = ['#e86a98', '#4a9ae0'];
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level; let A, B;
  for (let i = 0; i < 400; i++) {
    if (L === 0) { const ds = [3, 4, 5, 6, 8], d1 = ds[r(5)], d2 = ds[r(5)], n = 1 + r(3); if (d1 === d2 || n >= Math.min(d1, d2)) continue; A = [n, d1]; B = [n, d2]; }
    else { const ds = L === 1 ? [2, 3, 4, 5, 6, 8] : [3, 4, 5, 6, 7, 8, 9, 10], d1 = ds[r(ds.length)], d2 = ds[r(ds.length)]; A = [1 + r(d1 - 1), d1]; B = [1 + r(d2 - 1), d2];
      if (d1 === d2 || A[0] === B[0]) continue; const df = Math.abs(A[0] / A[1] - B[0] / B[1]); if (df < (L === 1 ? 1 / 8 : 1 / 16) || (L === 2 && df > 0.3)) continue; }
    if (gcd(A[0], A[1]) !== 1 || gcd(B[0], B[1]) !== 1) continue;
    return g.rand() < 0.5 ? [A, B] : [B, A];
  }
  return [[3, 8], [3, 4]];
}
// the alligator head: hinge at (x, y), facing dir (1 = mouth to the right), jaws open by `open` (0..1)
function gator(c, x, y, dir, open, t, s = 1, look = 0) {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const a = open * 0.5, L = 50, skin = '#5aa046', dark = '#3a7a34', belly = '#c8e09a';
  c.fillStyle = 'rgba(10,20,10,0.3)'; c.beginPath(); c.ellipse(-4, 30, 34, 7, 0, 0, 7); c.fill();
  for (const sg of [1, -1]) { // lower jaw first, then the upper
    c.save(); c.rotate(-sg * a * (sg > 0 ? 1 : 0.85)); const top = sg > 0;
    c.fillStyle = top ? skin : belly; c.strokeStyle = dark; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(-20, top ? -16 : 14); c.quadraticCurveTo(L * 0.6, top ? -16 : 12, L, top ? -4 : 3); c.quadraticCurveTo(L + 6, 0, L - 2, top ? 2 : -2); c.lineTo(-6, 0); c.closePath(); c.fill(); c.stroke();
    if (open > 0.05) { c.fillStyle = '#fff'; for (let k = 0; k < 5; k++) { const tx = 4 + k * 9; c.beginPath(); c.moveTo(tx, 0); c.lineTo(tx + 3.5, top ? 6 : -6); c.lineTo(tx + 7, 0); c.fill(); } }
    if (top) { c.fillStyle = dark; for (const [bx, by] of [[10, -9], [22, -8], [34, -6]]) { c.beginPath(); c.arc(bx, by, 2.2, 0, 7); c.fill(); } c.beginPath(); c.arc(L - 6, -5, 1.6, 0, 7); c.fill(); }
    c.restore();
  }
  if (open > 0.05) { c.fillStyle = '#c84a5a'; c.beginPath(); c.moveTo(-6, 0); c.lineTo(Math.cos(a) * 28, -Math.sin(a) * 26); c.lineTo(Math.cos(a) * 28, Math.sin(a) * 22); c.closePath(); c.fill(); }
  // the back of the head with two eyes on bumps
  c.fillStyle = skin; c.strokeStyle = dark; c.lineWidth = 2.5; c.beginPath(); c.ellipse(-20, 0, 18, 20, 0, 0, 7); c.fill(); c.stroke();
  for (const ex of [-24, -10]) { c.fillStyle = skin; c.beginPath(); c.arc(ex, -18 - a * 10, 8, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#fff8d0'; c.beginPath(); c.arc(ex, -18 - a * 10, 5.5, 0, 7); c.fill();
    const blink = (t % 3.7) < 0.12; c.fillStyle = '#2a2a1a'; if (blink) c.fillRect(ex - 5, -18 - a * 10, 10, 2); else { c.beginPath(); c.ellipse(ex + 1.5 + look * 1.5, -18 - a * 10, 1.8, 4, 0, 0, 7); c.fill(); } }
  c.restore();
}

MG.add({
  id: 'fractions_compare', stage: 'fractions', cmd: 'COMPARE!', hint: 'drag', time: 10, mood: 'night', winText: 'Chomp!', hold: 1.7,
  card: {
    title: 'Comparing fractions', ref: 'Grade 3', kind: 'Fractions',
    text: 'To compare two fractions, show them as parts of wholes that are the same size, and look at which part is longer.\n\nThe bottom number says how many equal pieces the whole is cut into. The more pieces, the smaller each piece. The top number says how many pieces you take.\n\nSo 3/8 is less than 3/4: both take 3 pieces, but eighths are smaller than fourths. It is tempting to think 3/8 is bigger because 8 is bigger than 4, but it is the other way round.\n\nThe signs > and < open toward the bigger number, like a hungry alligator\'s mouth: 3/4 > 3/8.',
    note: 'Show both fractions on the same-sized whole and compare. With the same top number, the smaller bottom number gives the bigger fraction.',
    ask: 'Which is bigger, 2/5 or 2/3? Which is bigger, 3/4 or 5/8?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const P = pick(g);
    S.F = P.map(([n, d], i) => ({ i, n, d, v: n / d, col: COLS[i], node: M.frac(M.num(n, 'n' + i), M.num(d, 'd' + i), 'f' + i) }));
    S.big = S.F[0].v > S.F[1].v ? 0 : 1; S.sg = M.op(S.big === 0 ? '>' : '<', 'sg', { alpha: 0 });
    S.row = M.row(S.F[0].node, M.gap(52), S.sg, M.gap(52), S.F[1].node); M.place(g, 'row', S.row, 180, SY + 16, 56, { col: INK });
    S.bars = BY.map((y, j) => ({ j, y, F: null }));
    BY.forEach((y, j) => M.zone(g, 'bar' + j, { x: BX + BW / 2, y, w: BW + 20, h: BH + 14 }));
    M.zone(g, 'cmp', { x: GX, y: SY, w: 54, h: 60 });
    M.inert(g, ['bar0', 'bar1', 'sg', 'n0', 'n1', 'd0', 'd1']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    S.gz = { dir: g.rand() < 0.5 ? 1 : -1, open: 0, look: 0 };
    M.play(g, {
      moves(g) {
        const free = S.bars.filter(B => !B.F).map(B => 'bar' + B.j), left = S.F.filter(F => !F.bar);
        if (left.length) return left.map(F => ({ drag: 'f' + F.i, to: free, area: [BX - 40, BY[0] - 40, 350, BY[1] + 40], busy: 0.1,
          then(g, from, to) { let B = S.bars[+String(to).slice(3)]; if (!B || B.F) B = S.bars.find(q => !q.F); B.F = F; F.bar = B; S.point = true;
            const st = Math.min(0.08 * T, 0.4 * T / F.d), fl = Math.min(0.09 * T, 0.45 * T / F.n), t1 = 0.25 * T + (F.d - 1) * st + 0.12 * T, t2 = t1 + F.n * fl + 0.15 * T;
            B.t0 = g.t; B.cut = { t0: g.t + 0.25 * T, st }; B.fill = { t0: g.t + t1, st: fl }; M.show(g, t2 + 0.1 * T); hop(g, 'think'); g.sfx('swoosh');
            // a copy of the fraction flies to the end of its bar and stays there as its label
            B.lab = M.frac(M.num(F.n, 'bn' + B.j), M.num(F.d, 'bd' + B.j), 'bl' + B.j); B.lab.alpha = 0; M.place(g, 'bl' + B.j, B.lab, BX - 38, B.y + 10, 30, { col: F.col }); M.inert(g, ['bl' + B.j, 'bn' + B.j, 'bd' + B.j]);
            M.fly(g, { node: M.frac(M.num(F.n), M.num(F.d)), from: S.dropXY ? [S.dropXY[0], S.dropXY[1] - 20] : 'f' + F.i, to: 'bl' + B.j, dur: 0.25 * T, arc: -30, s0: 44, s1: 30, col: F.col, then(g) { B.lab.alpha = 1; B.lab.pop = g.t; } });
            M.at(g, [[0.22 * T, g => { M.light(g, 'd' + F.i, { col: '#ffd25a' }); M.light(g, 'bd' + B.j, { col: '#ffd25a' }); }],
              ...Array.from({ length: F.d - 1 }, (_, k) => [0.25 * T + (k + 1) * st, g => g.sfx('tap')]),
              [t1 - 0.05 * T, g => { M.unlight(g, 'd' + F.i); M.unlight(g, 'bd' + B.j); M.light(g, 'n' + F.i, { col: '#ffd25a' }); M.light(g, 'bn' + B.j, { col: '#ffd25a' }); }],
              ...Array.from({ length: F.n }, (_, k) => [t1 + k * fl, g => g.sfx('pop')]),
              [t2, g => { M.unlight(g, 'n' + F.i); M.unlight(g, 'bn' + B.j); M.sparkle(g, [BX + BW * F.v / 2, B.y], { n: 8, cols: ['#c8865a', '#fff', F.col] }); hop(g, 'wow'); g.sfx('ding'); B.done = g.t; S.point = false; }]]); } }));
        if (S.done) return [];
        const F = S.F[S.big], f = S.F[1 - S.big];
        return [{ tap: ['f' + F.i, 'bar' + F.bar.j], busy: 0.1, askAt: 0.75 * T, after: 0.75 * T, ask: { v: S.big === 0 ? '>' : '<', wrong: [S.big === 0 ? '<' : '>', '='] },
          then(g) { S.done = true; S.point = true; M.show(g, 0.75 * T); hop(g, 'think'); M.indicate(g, 'f' + F.i, { dur: 0.4 * T, col: '#ffd25a', sc: 1.15 });
            S.cmp = { t0: g.t, x: BX + BW * f.v, x1: BX + BW * F.v, j: F.bar.j }; g.sfx('swoosh');
            M.at(g, [[0.35 * T, g => { S.cmp.glow = g.t; g.sfx('chime'); }], [0.45 * T, g => { S.gz.turn = { t0: g.t, to: S.big === 0 ? -1 : 1 }; }]]); },
          resolve(g) { M.show(g, 0.75 * T); S.gz.openT = g.t; g.sfx('crunch');
            M.at(g, [[0.2 * T, g => { S.sg.alpha = 1; M.writeIn(g, S.sg, { dur: 0.22 * T }); M.indicate(g, S.sg, { delay: 0.2 * T, dur: 0.3 * T, col: '#ffd25a', sc: 1.3 }); g.sfx('ding'); }],
              [0.45 * T, g => { M.sparkle(g, 'f' + F.i, { n: 14, cols: ['#ffe9a0', '#fff', F.col] }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; }]]); } }];
      },
      area(g) { return S.F.some(F => !F.bar) ? S.F.filter(F => !F.bar).map(F => 'f' + F.i) : ['f0', 'f1']; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s, Mk = S.mk;
    if (Mk.missAt > (S.lastMiss ?? -1)) { S.lastMiss = Mk.missAt; const id = Mk.missInfo && Mk.missInfo.tap;
      const F = id && S.F.find(q => id === 'f' + q.i || (q.bar && id === 'bar' + q.bar.j));
      S.gz.lunge = { t0: g.t, dir: F ? (F.i === 0 ? -1 : 1) : 0 }; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { g.s.dropXY = [x, y]; M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, Mk = S.mk, T = M.pace(g);
    c.drawImage(g.bake('fcmp_swamp', (cc, W, H) => {
      const sk = cc.createLinearGradient(0, 0, 0, 340); sk.addColorStop(0, '#3a2a62'); sk.addColorStop(0.55, '#a8507a'); sk.addColorStop(1, '#f2a060'); cc.fillStyle = sk; cc.fillRect(0, 0, W, 340);
      const sun = cc.createRadialGradient(110, 318, 4, 110, 318, 110); sun.addColorStop(0, 'rgba(255,220,150,0.9)'); sun.addColorStop(0.25, 'rgba(255,190,120,0.5)'); sun.addColorStop(1, 'rgba(255,170,110,0)'); cc.fillStyle = sun; cc.fillRect(0, 200, W, 140);
      const R = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(41);
      // far cypress silhouettes and the water
      cc.fillStyle = '#4a2a52'; for (let i = 0; i < 9; i++) { const x = i * 44 + R() * 20, h = 60 + R() * 70; cc.beginPath(); cc.moveTo(x - 16, 340); cc.lineTo(x - 5, 340 - h); cc.lineTo(x + 5, 340 - h); cc.lineTo(x + 16, 340); cc.fill(); cc.beginPath(); cc.ellipse(x, 340 - h, 22, 12, 0, 0, 7); cc.fill(); }
      const wg = cc.createLinearGradient(0, 330, 0, H); wg.addColorStop(0, '#6a4a6a'); wg.addColorStop(0.3, '#2e4a50'); wg.addColorStop(1, '#16282e'); cc.fillStyle = wg; cc.fillRect(0, 330, W, H - 330);
      cc.fillStyle = 'rgba(255,200,140,0.18)'; for (let i = 0; i < 10; i++) cc.fillRect(110 - 40 + R() * 30, 340 + i * 10, 50 - i * 4, 2);
      // near cypress trunks with hanging moss at the sides
      for (const [x, w] of [[14, 30], [348, 26]]) { cc.fillStyle = '#2a1a22'; cc.beginPath(); cc.moveTo(x - w, H); cc.lineTo(x - w * 0.4, 100); cc.lineTo(x + w * 0.4, 100); cc.lineTo(x + w, H); cc.fill(); cc.fillStyle = '#3a2a3a'; cc.beginPath(); cc.ellipse(x, 90, 60, 36, 0, 0, 7); cc.fill();
        cc.strokeStyle = 'rgba(150,170,130,0.55)'; cc.lineWidth = 2; for (let k = 0; k < 8; k++) { const mx = x - 40 + k * 11; cc.beginPath(); cc.moveTo(mx, 100); cc.quadraticCurveTo(mx + 4, 140, mx - 2, 150 + R() * 50); cc.stroke(); } }
      // the dock under the bars
      cc.fillStyle = 'rgba(0,0,0,0.3)'; cc.fillRect(20, 368, 324, 118);
      for (let k = 0; k < 6; k++) { const y = 360 + k * 19; cc.fillStyle = k % 2 ? '#8a5a38' : '#9a6a42'; cc.fillRect(16, y, 328, 18); cc.fillStyle = 'rgba(40,20,10,0.35)'; cc.fillRect(16, y + 16, 328, 2); }
      cc.fillStyle = '#5a3a24'; for (const x of [26, 334]) cc.fillRect(x - 6, 470, 12, 60);
      // lily pads and reeds in front
      for (const [x, y, rx] of [[60, 560, 26], [250, 590, 32], [160, 540, 16]]) { cc.fillStyle = '#3a6a3a'; cc.beginPath(); cc.ellipse(x, y, rx, rx * 0.35, 0, 0.3, Math.PI * 2 - 0.1); cc.lineTo(x, y); cc.fill(); }
      cc.strokeStyle = '#1e3020'; cc.lineWidth = 4; cc.lineCap = 'round'; for (const [x, h] of [[100, 90], [112, 70], [300, 100], [288, 80]]) { cc.beginPath(); cc.moveTo(x, H); cc.quadraticCurveTo(x + 5, H - h / 2, x - 3, H - h); cc.stroke(); cc.fillStyle = '#5a3a24'; cc.beginPath(); cc.ellipse(x - 3, H - h + 10, 4, 11, 0, 0, 7); cc.fill(); }
      // the wooden sign
      cc.fillStyle = 'rgba(20,10,10,0.35)'; cc.beginPath(); cc.roundRect(24, 210, 320, 112, 14); cc.fill();
      const sg = cc.createLinearGradient(0, 204, 0, 316); sg.addColorStop(0, '#7a4a30'); sg.addColorStop(1, '#5a321e'); cc.fillStyle = sg; cc.beginPath(); cc.roundRect(20, 204, 320, 112, 14); cc.fill();
      cc.strokeStyle = 'rgba(30,15,5,0.35)'; cc.lineWidth = 1.5; for (let k = 1; k < 4; k++) { cc.beginPath(); cc.moveTo(30, 204 + k * 28); cc.bezierCurveTo(120, 208 + k * 28, 240, 200 + k * 28, 330, 204 + k * 28); cc.stroke(); }
      cc.fillStyle = '#c8a070'; for (const x of [34, 326]) { cc.beginPath(); cc.arc(x, 218, 3.5, 0, 7); cc.fill(); }
    }), 0, 0, 360, 640);
    // fireflies and ripples
    for (let i = 0; i < 10; i++) { const x = (i * 71 + Math.sin(t * 0.6 + i) * 22 + 400) % 360, y = 120 + (i * 53) % 220 + Math.cos(t * 0.7 + i * 2) * 10, a = 0.3 + 0.5 * Math.abs(Math.sin(t * 1.6 + i)); c.fillStyle = `rgba(230,255,150,${a})`; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); }
    for (let i = 0; i < 3; i++) { const k = (t * 0.3 + i / 3) % 1, x = [70, 230, 180][i], y = [520, 610, 570][i]; c.strokeStyle = `rgba(220,200,255,${0.25 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 8 + k * 30, (8 + k * 30) * 0.3, 0, 0, 7); c.stroke(); }
    // the bars: an empty wrapper, score lines that draw themselves, chocolate pieces that fill one by one
    for (const B of S.bars) { const y0 = B.y - BH / 2, F = B.F;
      c.save(); c.fillStyle = 'rgba(20,10,5,0.35)'; c.beginPath(); c.roundRect(BX + 3, y0 + 5, BW, BH, 6); c.fill();
      c.fillStyle = F ? '#e8dcc8' : 'rgba(240,230,210,0.55)'; c.beginPath(); c.roundRect(BX, y0, BW, BH, 6); c.fill();
      if (!F) { c.setLineDash([6, 5]); c.strokeStyle = 'rgba(255,240,220,0.8)'; c.lineWidth = 2; c.stroke(); c.restore(); continue; }
      const pw = BW / F.d;
      for (let k = 0; k < F.n; k++) { const kk = (t - B.fill.t0 - k * B.fill.st) / (0.12 * T); if (kk < 0) continue; const e = M.clamp(kk, 0, 1), x = BX + k * pw;
        c.save(); c.beginPath(); c.roundRect(BX, y0, BW, BH, 6); c.clip(); c.fillStyle = '#6a3a22'; c.fillRect(x + 1.5, y0 + BH * (1 - e) + 1.5, pw - 3, BH * e - 3);
        c.fillStyle = 'rgba(255,220,180,0.25)'; c.fillRect(x + 4, y0 + 4, pw - 8, 4); c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(x + 4, y0 + BH - 7, pw - 8, 3); c.restore();
        const ca = M.clamp(1 - (t - B.done) / 0.4, 0, 1); if (B.done == null || ca > 0) { c.fillStyle = INK; c.globalAlpha = (B.done == null ? 1 : ca) * e; c.font = M.NUMF(18, 700); c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,0,0.7)'; c.shadowBlur = 4; c.fillText(k + 1, x + pw / 2, y0 - 5 - (1 - e) * 6); c.shadowBlur = 0; c.globalAlpha = 1; } }
      c.strokeStyle = 'rgba(80,40,20,0.75)'; c.lineWidth = 2; for (let k = 1; k < F.d; k++) { const kk = (t - B.cut.t0 - (k - 1) * B.cut.st) / (0.1 * T); if (kk < 0) continue; const e = M.ease(kk); c.beginPath(); c.moveTo(BX + k * pw, y0 + 2); c.lineTo(BX + k * pw, y0 + 2 + (BH - 4) * e); c.stroke(); }
      c.beginPath(); c.roundRect(BX, y0, BW, BH, 6); c.strokeStyle = FOIL[F.i]; c.lineWidth = 3; c.stroke();
      c.fillStyle = FOIL[F.i]; c.fillRect(BX + BW - 3, y0 - 2, 6, BH + 4); c.restore();
      M.drawEx(g, c, 'bl' + B.j); }
    // the comparison: a dashed line from the end of the shorter chocolate, and the extra chocolate glowing
    if (S.cmp) { const k = M.easeIO((t - S.cmp.t0) / (0.3 * T)), ya = BY[0] - BH / 2 - 10, yb = BY[1] + BH / 2 + 10;
      c.save(); c.setLineDash([6, 5]); c.strokeStyle = '#ffe9a0'; c.lineWidth = 2.5; c.shadowColor = '#ffd25a'; c.shadowBlur = 8; c.beginPath(); c.moveTo(S.cmp.x, ya); c.lineTo(S.cmp.x, M.lerp(ya, yb, k)); c.stroke(); c.restore();
      if (S.cmp.glow != null) { const a = Math.min(1, (t - S.cmp.glow) / 0.2) * (0.45 + 0.2 * Math.sin(t * 6)), y = BY[S.cmp.j]; c.save(); c.fillStyle = `rgba(255,214,90,${a})`; c.shadowColor = '#ffd25a'; c.shadowBlur = 14; c.fillRect(S.cmp.x, y - BH / 2 + 1, S.cmp.x1 - S.cmp.x, BH - 2);
        c.strokeStyle = '#ffe9a0'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(S.cmp.x + 2, y - BH / 2 - 6); c.lineTo(S.cmp.x1 - 2, y - BH / 2 - 6); c.stroke(); c.restore(); } }
    // the alligator between the fractions: looks around, turns to the bigger one and opens its jaws into the sign
    const Gz = S.gz; let dir = Gz.dir, open = 0, lx = 0, sx = 1;
    if (Gz.turn) { const k = M.easeIO((t - Gz.turn.t0) / (0.2 * T)); sx = k < 0.5 ? 1 - 2 * k : 2 * k - 1; dir = k < 0.5 ? Gz.dir : Gz.turn.to; if (k >= 1) { Gz.dir = Gz.turn.to; Gz.turn = null; } }
    if (Gz.openT != null) { const k = (t - Gz.openT) / (0.25 * T); open = k < 1 ? M.ease(k) * 1.15 : 1 + 0.15 * Math.max(0, Math.sin(Math.min(1, (k - 1) * 2) * Math.PI)); if (g.done && g.result === 'win') open = 1 + 0.08 * Math.sin(t * 8); }
    if (Gz.lunge && t - Gz.lunge.t0 < 0.7) { const k = (t - Gz.lunge.t0) / 0.7; lx = Gz.lunge.dir * Math.sin(Math.min(1, k * 2.5) * Math.PI) * 14; if (k > 0.3) lx += Math.sin(k * 40) * 4 * (1 - k); if (Gz.lunge.dir && k < 0.4) { dir = Gz.lunge.dir; open = Math.sin(k / 0.4 * Math.PI) * 0.6; } }
    const look = Gz.openT == null && !Gz.turn ? Math.sin(t * 1.3) : 0, GS = 0.72, hx = GX - dir * (Gz.openT != null || Gz.turn ? 24 : 10) * sx;
    gator(c, hx + lx, SY + 8, dir, open, t, GS * Math.max(0.2, sx), look);
    M.drawEx(g, c, 'row');
    // the bird watches from a cypress branch, points at the work and hops when a step lands
    c.save(); c.strokeStyle = '#2a1a22'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(360, HY + 4); c.quadraticCurveTo(320, HY + 8, 278, HY + 2); c.stroke(); c.restore();
    const hk = Mk.lastMove != null && t - Mk.lastMove < 0.35 ? Math.sin((t - Mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', HX, HY - hk * 16, 1.0, { t, pose, expr, facing: -1, noShadow: true }); else SCN.host(g, c, 'bird', HX, HY, 1.0);
    M.drawUI(g, c);
  },
});
