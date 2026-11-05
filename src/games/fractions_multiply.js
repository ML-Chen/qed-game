// fractions_multiply.js — MULTIPLY FRACTIONS! 2/3 × 3/4 as an area model: a square garden plot seen from above.
// Golden hour on a farm. The plot is one whole. Every move's working plays by itself (show your work; the fuse stands
// still meanwhile):
//   1. Drag the first fraction onto the plot (or tap it): furrows plough down the plot one by one into 3 columns, then
//      2 of them are planted with sunflowers, sweeping down one column at a time. The fraction lights up in sunflower
//      gold, and so does its label over the planted columns.
//   2. Drag the second fraction onto the plot: furrows plough across into 4 rows and 3 of them are planted with
//      cornflowers, sweeping across. Where both are planted the patch turns green: that is 2/3 of 3/4.
//      (Moves 1 and 2 may come in either order.)
//   3. Tap the green patch: its pieces are counted, 1 to 6, and the answer is written as the rule says, top times top
//      over bottom times bottom: "2 × 3" and "3 × 4" fly down from the two fractions, then roll over to 6 and 12. The
//      plot has 3 × 4 = 12 pieces in all, and 6 of them are green, so 2/3 × 3/4 = 6/12.
// Mistakes: tapping a part of the plot that is not green (counting only one of the fractions), or tapping the answer
// before both fractions are planted. Level 0: halves and thirds. Level 1: up to fifths. Level 2: up to sixths.
// Medium mode: the answer is picked from the tray (wrong tiles: adding tops and bottoms, cross-multiplying).
const M = MK;
const EY = 228, ES = 44, INK = '#3a2410', PX = 96, PY = 300, PS = 200, HX = 316, HY = 616;
const SUN = '#ffcf2a', SUNI = '#a86a00', CORN = '#5a8ef0', CORNI = '#1e4aa8', BOTH = '#4cb84a';

function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), maxD = L === 0 ? 3 : L === 1 ? 5 : 6;
  for (let n = 0; n < 200; n++) {
    const b1 = ri(2, maxD), b2 = ri(2, maxD), a1 = ri(1, b1 - 1), a2 = ri(1, b2 - 1);
    if (L > 0 && a1 === 1 && a2 === 1) continue; if (L === 2 && b1 * b2 < 12) continue;
    return { a1, b1, a2, b2 };
  }
  return { a1: 2, b1: 3, a2: 3, b2: 4 };
}

// the farm from above at golden hour: warm grass with long shadows, a fence, hay bales, a path, a corner of a barn roof
function farm(c, W, H) {
  const gg = c.createLinearGradient(0, 0, W, H); gg.addColorStop(0, '#b8c860'); gg.addColorStop(0.5, '#8ab048'); gg.addColorStop(1, '#5a8a3a'); c.fillStyle = gg; c.fillRect(0, 0, W, H);
  const R = P.rng(44); for (let i = 0; i < 320; i++) { c.fillStyle = R() < 0.5 ? 'rgba(60,90,30,0.3)' : 'rgba(240,230,140,0.3)'; c.fillRect(R() * W, R() * H, 1.5, 3 + R() * 4); }
  // warm light from the upper left
  const lg = c.createRadialGradient(0, 0, 10, 0, 0, 520); lg.addColorStop(0, 'rgba(255,200,110,0.4)'); lg.addColorStop(1, 'rgba(255,200,110,0)'); c.fillStyle = lg; c.fillRect(0, 0, W, H);
  // a dirt path along the bottom
  c.fillStyle = '#d8b07a'; c.beginPath(); c.moveTo(0, 560); c.bezierCurveTo(120, 540, 220, 600, 360, 570); c.lineTo(360, 610); c.bezierCurveTo(220, 640, 120, 586, 0, 604); c.fill();
  c.fillStyle = 'rgba(120,80,40,0.25)'; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(R() * W, 560 + R() * 40, 1 + R() * 1.5, 0, 7); c.fill(); }
  // the barn roof in the top right corner, with its long shadow
  c.fillStyle = 'rgba(40,40,20,0.3)'; c.beginPath(); c.moveTo(260, 0); c.lineTo(360, 0); c.lineTo(360, 140); c.lineTo(300, 160); c.closePath(); c.fill();
  c.fillStyle = '#b8402e'; c.beginPath(); c.moveTo(250, 0); c.lineTo(360, 0); c.lineTo(360, 118); c.lineTo(286, 128); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(80,20,10,0.4)'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(256 + i * 14, 0); c.lineTo(290 + i * 10, 126); c.stroke(); }
  // hay bales
  for (const [x, y] of [[34, 520], [62, 534]]) { c.fillStyle = 'rgba(40,40,20,0.3)'; c.beginPath(); c.ellipse(x + 8, y + 10, 18, 12, 0.4, 0, 7); c.fill(); const hg = c.createRadialGradient(x - 4, y - 4, 2, x, y, 18); hg.addColorStop(0, '#f6dc8a'); hg.addColorStop(1, '#c8a048'); c.fillStyle = hg; c.beginPath(); c.arc(x, y, 16, 0, 7); c.fill(); c.strokeStyle = 'rgba(140,100,30,0.6)'; c.lineWidth = 1.2; for (const r of [5, 10, 14]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); } }
  // a fence around the plot
  c.strokeStyle = 'rgba(40,30,10,0.3)'; c.lineWidth = 4; c.strokeRect(PX - 18 + 4, PY - 18 + 6, PS + 36, PS + 36);
  c.strokeStyle = '#8a5a30'; c.lineWidth = 3; c.strokeRect(PX - 18, PY - 18, PS + 36, PS + 36);
  c.fillStyle = '#6a4020'; for (let k = 0; k <= 4; k++) for (const [x, y] of [[PX - 18 + k * (PS + 36) / 4, PY - 18], [PX - 18 + k * (PS + 36) / 4, PY + PS + 18], [PX - 18, PY - 18 + k * (PS + 36) / 4], [PX + PS + 18, PY - 18 + k * (PS + 36) / 4]]) { c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); }
  // the plot: tilled soil
  c.fillStyle = 'rgba(40,30,10,0.35)'; c.fillRect(PX + 4, PY + 6, PS, PS);
  const sg = c.createLinearGradient(PX, PY, PX + PS, PY + PS); sg.addColorStop(0, '#c89a64'); sg.addColorStop(1, '#a87848'); c.fillStyle = sg; c.fillRect(PX, PY, PS, PS);
  c.fillStyle = 'rgba(90,60,30,0.25)'; for (let i = 0; i < 160; i++) { c.beginPath(); c.arc(PX + R() * PS, PY + R() * PS, 0.8 + R() * 1.4, 0, 7); c.fill(); }
}

MG.add({
  id: 'fracmult', stage: 'fractions', cmd: 'MULTIPLY FRACS!', hint: 'drag', time: 10, winText: 'Planted!', hold: 1.9,
  card: {
    title: 'Multiplying fractions', ref: 'Grade 5', kind: 'Fractions',
    text: '2/3 × 3/4 means 2/3 of 3/4. You can see it as an area.\n\nTake a square that is one whole. Cut it into 3 columns and plant 2 of them: that is 2/3. Now cut it into 4 rows and plant 3 of them: that is 3/4. The part planted both ways is 2/3 of 3/4.\n\nCount the pieces. There are 3 × 4 = 12 pieces in the whole square, and the part planted both ways has 2 × 3 = 6 of them. So 2/3 × 3/4 = 6/12, which is the same as 1/2.\n\nThat is why the rule works: multiply the tops, and multiply the bottoms.',
    note: 'Multiply the numerators, and multiply the denominators: a/b × c/d = (a × c)/(b × d).',
    ask: 'What is 1/2 × 3/5? What is 2/3 × 4/5?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a1, b1, a2, b2 } = S, T = M.pace(g);
    S.f1 = M.frac(M.num(a1, 'a1'), M.num(b1, 'b1'), 'f1'); S.f2 = M.frac(M.num(a2, 'a2'), M.num(b2, 'b2'), 'f2');
    // the answer slot is as wide as its working (a × c over b × d), so nothing shifts when that is written
    S.slot = M.slot('ans', { w: M.lay(M.frac(M.row(M.num(a1), M.op('×'), M.num(a2)), M.row(M.num(b1), M.op('×'), M.num(b2))), ES).w }); S.ex = M.row(S.f1, M.op('×', 'tm'), S.f2, M.op('=', 'eq'), S.slot);
    S.relay = () => M.place(g, 'ex', S.ex, 180, EY, ES, { col: INK }); S.relay();
    M.zone(g, 'plot', { x: PX + PS / 2, y: PY + PS / 2, w: PS, h: PS });
    M.inert(g, ['tm', 'eq', 'pn', 'pd', 'labA', 'labB']);
    S.cols = 1; S.rows = 1; S.cutV = []; S.cutH = []; S.fillA = [...Array(b1)].map(() => 0); S.fillB = [...Array(b2)].map(() => 0); S.counts = [];
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const ld = (o, k, v, d, delay) => M.tween(g, o, { [k]: v }, d, { delay, ease: M.easeIO });
    // plant one fraction: plough the cuts, then plant its columns (first fraction) or rows (second)
    const plant = (which) => {
      const first = which === 1, a = first ? a1 : a2, b = first ? b1 : b2, cut = 0.13 * T, fill = Math.min(0.2, 0.7 / a) * T, ids = first ? ['a1', 'b1', 'f1'] : ['a2', 'b2', 'f2'];
      const cutsEnd = 0.2 * T + (b - 1) * cut + 0.15 * T, end = cutsEnd + 0.1 * T + a * fill + 0.25 * T;
      return {
        busy: 0.1,
        then(g) {
          S['p' + which] = true; S.point = true; hop('wow'); M.show(g, end + 0.05 * T); g.sfx('swoosh');
          M.circle(g, ids[2], { dur: 0.4 * T, col: first ? SUN : CORN });
          // the bottom number says how many equal strips: plough them
          M.indicate(g, ids[1], { dur: 0.35 * T, col: first ? SUN : CORN, sc: 1.3 });
          if (first) S.cols = b; else S.rows = b;
          const cuts = first ? S.cutV : S.cutH;
          for (let k = 1; k < b; k++) { const o = { k: 0 }; cuts.push(o); ld(o, 'k', 1, cut * 1.3, 0.2 * T + (k - 1) * cut); M.at(g, [[0.2 * T + (k - 1) * cut, g => g.sfx('crunch', { vol: 0.5 })]]); }
          // the top number says how many strips to plant
          M.at(g, [[cutsEnd, g => { M.indicate(g, ids[0], { dur: 0.35 * T, col: first ? SUN : CORN, sc: 1.35 }); hop('think'); }]]);
          const fills = first ? S.fillA : S.fillB, holder = { v: fills };
          for (let i = 0; i < a; i++) { const o = { k: 0 }; M.at(g, [[cutsEnd + 0.1 * T + i * fill, g => { const tw = { k: 0 }; S['tw' + which + i] = tw; M.tween(g, tw, { k: 1 }, fill * 1.2); fills[i] = tw; g.sfx('pop', { pitch: 1 + i * 0.1 }); }]]); }
          M.at(g, [[end - 0.1 * T, g => { const nd = first ? S.f1 : S.f2; nd.col = first ? SUNI : CORNI; nd.pop = g.t; S['lab' + which] = g.t; hop('laugh'); g.sfx('ding'); if (S.p1 && S.p2) { S.point = false; M.zone(g, 'over', { x: PX + PS * a1 / b1 / 2, y: PY + PS * a2 / b2 / 2, w: PS * a1 / b1, h: PS * a2 / b2 }); } }]]);
        },
      };
    };
    const P1 = plant(1), P2 = plant(2);
    // count the green patch and write the answer
    const step = Math.min(0.1, 0.55 / (a1 * a2)) * T, tc = 0.2 * T + a1 * a2 * step, askAt = tc + 0.55 * T, after = 0.85 * T;
    const fr = (n, d) => M.frac(M.num(n), M.num(d));
    const count = {
      busy: 0.1, askAt, after, ask: { v: fr(a1 * a2, b1 * b2), wrong: [fr(a1 + a2, b1 + b2), fr(a1 * b2, b1 * a2), fr(a1 * a2, b1 + b2)] },
      then(g) {
        S.counted = true; S.point = true; hop('wow'); M.show(g, askAt);
        S.countAt = g.t; M.light(g, 'a1', { col: BOTH }); M.light(g, 'a2', { col: BOTH });
        for (let n = 0; n < a1 * a2; n++) { const i = n % a1, j = Math.floor(n / a1); M.at(g, [[0.2 * T + n * step, g => { S.counts.push({ i, j, n: n + 1, t0: g.t }); g.sfx('tap', { pitch: 1 + n * 0.04 }); }]]); }
        // "a1 × a2" over "b1 × b2" flies down from the two fractions into the answer
        M.at(g, [[tc + 0.05 * T, g => { hop('think');
          const pn = M.row(M.num(a1, 'n1', { alpha: 0 }), M.op('×', 'nx', { alpha: 0 }), M.num(a2, 'n2', { alpha: 0 })), pd = M.row(M.num(b1, 'd1', { alpha: 0 }), M.op('×', 'dx', { alpha: 0 }), M.num(b2, 'd2', { alpha: 0 }));
          pn.id = 'pn'; pd.id = 'pd'; S.pn = pn; S.pd = pd; S.ansF = M.frac(pn, pd, 'af', { bar: { t0: g.t, dur: 0.25 * T } }); S.slot.fill = S.ansF; S.relay();
          for (const [src, dst] of [['a1', 'n1'], ['a2', 'n2'], ['b1', 'd1'], ['b2', 'd2']]) { const b = M.box(g, src), node = M.node(g, dst);
            M.fly(g, { node: M.num(M.node(g, src).v, null, { col: src[0] === 'a' ? '#2a7a2a' : INK }), from: [b.x, b.y], to: dst, dur: 0.35 * T, arc: -30, s0: b.s, s1: M.box(g, dst).s, then(g) { node.alpha = 1; node.pop = g.t; } }); }
          M.at(g, [[0.3 * T, g => { for (const id of ['nx', 'dx']) { M.node(g, id).alpha = 1; } M.unlight(g, 'a1'); M.unlight(g, 'a2'); g.sfx('pop'); }]]);
          S.whole = g.t; }]]);
        if (g.mode === 'medium') M.at(g, [[askAt - 0.02, g => { hop('think'); }]]);
      },
      resolve(g) {
        M.show(g, after); hop('wow');
        // top times top, bottom times bottom: each product slides together and rolls over to its value
        const squash = (row, v, delay) => M.at(g, [[delay, g => { const [x, o, y] = row.items, bx = M.box(g, row.items[0].id);
          for (const q of [o, y]) { const b = M.box(g, q.id); M.tween(g, q, { dx: bx.x - b.x, alpha: 0, sc: 0.5 }, 0.25 * T); }
          M.roll(g, x, v, { delay: 0.12 * T, dur: 0.25 * T }); }],
          [delay + 0.4 * T, g => { row.items = [row.items[0]]; S.relay(); M.indicate(g, row.items[0], { dur: 0.3 * T, col: '#ffd23a' }); g.sfx('coin'); }]]);
        squash(S.pn, a1 * a2, 0.05 * T); squash(S.pd, b1 * b2, 0.2 * T);
        M.at(g, [[0.65 * T, g => { M.sparkle(g, 'af', { n: 14, cols: ['#9ae07a', '#fff', '#ffd23a'] }); hop('laugh'); S.point = false; }]]);
      },
    };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.p1) out.push({ ...P1, drag: ['f1', 'a1', 'b1'], to: 'plot', area: [PX - 30, PY - 30, PX + PS + 30, PY + PS + 30] }, { ...P1, tap: ['f1', 'a1', 'b1'] });
        if (!S.p2) out.push({ ...P2, drag: ['f2', 'a2', 'b2'], to: 'plot', area: [PX - 30, PY - 30, PX + PS + 30, PY + PS + 30] }, { ...P2, tap: ['f2', 'a2', 'b2'] });
        if (S.p1 && S.p2 && !S.counted) out.push({ ...count, tap: ['over', 'ans'] });
        return out;
      },
      area(g) { return !S.p1 ? ['f1', 'plot'] : !S.p2 ? ['f2', 'plot'] : !S.counted ? 'over' : null; },
      onWin(g) { if (S.ansF) { S.ansF.pop = g.t; } },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; const id = K.missInfo && (K.missInfo.tap || K.missInfo.to);
      if (id === 'plot') S.badPlot = g.t; }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g);
    c.drawImage(g.bake('fractions_multiply_farm', farm), 0, 0, W, H);
    // drifting seed fluff in the low sun, and a swallow's shadow
    for (let i = 0; i < 12; i++) { const x = (i * 67 + t * (8 + i % 4 * 3)) % 380 - 10, y = 120 + (i * 97) % 440 + Math.sin(t + i) * 10; c.fillStyle = `rgba(255,245,210,${0.4 + 0.3 * Math.sin(t * 2 + i)})`; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
    { const sx = ((t * 40) % 600) - 120, sy = 150 + Math.sin(t * 0.8) * 20; c.fillStyle = 'rgba(30,40,10,0.25)'; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx - 10, sy - 8, sx - 22, sy - 4); c.lineTo(sx - 6, sy + 2); c.quadraticCurveTo(sx - 10, sy + 8, sx - 22, sy + 8); c.closePath(); c.fill(); }
    // ---- the plot: planted columns (sunflowers), planted rows (cornflowers), and green where both ----
    const cw = PS / S.b1, rh = PS / S.b2, bad = S.badPlot != null && t - S.badPlot < 0.5;
    const kA = i => { const f = S.fillA[i]; return typeof f === 'object' ? f.k : 0; }, kB = j => { const f = S.fillB[j]; return typeof f === 'object' ? f.k : 0; };
    const stripes = (x, y, w, h, col, vert) => { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); if (vert) for (let xx = x + 5; xx < x + w; xx += 9) { c.moveTo(xx, y); c.lineTo(xx, y + h); } else for (let yy = y + 5; yy < y + h; yy += 9) { c.moveTo(x, yy); c.lineTo(x + w, yy); } c.stroke(); c.restore(); };
    const blooms = (x, y, w, h, col, mid, seed) => { const r = P.rng(seed); c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); for (let k = 0; k < w * h / 260; k++) { const px = x + r() * w, py = y + r() * h; c.fillStyle = col; c.beginPath(); c.arc(px, py, 2.6, 0, 7); c.fill(); c.fillStyle = mid; c.beginPath(); c.arc(px, py, 1.1, 0, 7); c.fill(); } c.restore(); };
    for (let i = 0; i < S.a1; i++) { const k = kA(i); if (k <= 0) continue; const x = PX + i * cw, h = PS * k; c.fillStyle = bad ? '#e86a5a' : SUN; c.fillRect(x, PY, cw, h); stripes(x, PY, cw, h, 'rgba(160,100,0,0.35)', true); blooms(x, PY, cw, h, '#ffe680', '#7a4a10', 11 + i); }
    for (let j = 0; j < S.a2; j++) { const k = kB(j); if (k <= 0) continue; const y = PY + j * rh, w = PS * k; c.save(); c.globalAlpha = 0.92; c.fillStyle = bad ? '#e86a5a' : CORN; c.fillRect(PX, y, w, rh); c.restore(); stripes(PX, y, w, rh, 'rgba(20,40,120,0.35)', false); blooms(PX, y, w, rh, '#bcd4ff', '#2a3a8a', 31 + j); }
    // where both are planted: green
    for (let i = 0; i < S.a1; i++) for (let j = 0; j < S.a2; j++) { const x0 = PX + i * cw, y0 = PY + j * rh, x1 = Math.min(x0 + cw, PX + PS * kB(j)), y1 = Math.min(y0 + rh, PY + PS * kA(i)); if (x1 <= x0 || y1 <= y0) continue;
      c.fillStyle = BOTH; c.fillRect(x0, y0, x1 - x0, y1 - y0); stripes(x0, y0, x1 - x0, y1 - y0, 'rgba(20,80,20,0.35)', true); stripes(x0, y0, x1 - x0, y1 - y0, 'rgba(20,80,20,0.35)', false); }
    // the green patch glows while it is counted
    if (S.countAt != null && !g.done) { const k = Math.min(1, (t - S.countAt) / (0.2 * T)); c.save(); c.globalAlpha = k * (0.6 + 0.3 * Math.sin(t * 6)); c.strokeStyle = '#eaffb0'; c.shadowColor = '#eaffb0'; c.shadowBlur = 14; c.lineWidth = 4; c.strokeRect(PX, PY, S.a1 * cw, S.a2 * rh); c.restore(); }
    // furrows (cuts) plough across
    c.save(); c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.lineCap = 'round';
    S.cutV.forEach((o, k) => { if (o.k <= 0) return; const x = PX + (k + 1) * cw; c.beginPath(); c.moveTo(x, PY); c.lineTo(x, PY + PS * o.k); c.stroke(); });
    S.cutH.forEach((o, k) => { if (o.k <= 0) return; const y = PY + (k + 1) * rh; c.beginPath(); c.moveTo(PX, y); c.lineTo(PX + PS * o.k, y); c.stroke(); });
    c.strokeStyle = '#4a2a10'; c.lineWidth = 3; c.strokeRect(PX, PY, PS, PS); c.restore();
    // the whole plot is outlined when the answer's bottom is written (3 × 4 pieces in all)
    if (S.whole != null && t - S.whole < 0.9 * T) { const k = (t - S.whole) / (0.9 * T); c.save(); c.globalAlpha = Math.sin(k * Math.PI); c.strokeStyle = '#fff6c0'; c.shadowColor = '#ffd23a'; c.shadowBlur = 14; c.lineWidth = 4; c.strokeRect(PX - 4, PY - 4, PS + 8, PS + 8); c.restore(); }
    // the counts on the green pieces
    for (const q of S.counts) { const k = M.clamp((t - q.t0) / (0.2 * T), 0, 1), x = PX + (q.i + 0.5) * cw, y = PY + (q.j + 0.5) * rh, fs = Math.min(24, Math.min(cw, rh) * 0.6) * (1 + Math.sin(k * Math.PI) * 0.4);
      c.save(); c.globalAlpha = k; c.font = M.NUMF(fs, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 3.5; c.strokeStyle = '#1e5a1e'; c.strokeText(String(q.n), x, y + 1); c.fillStyle = '#ffffff'; c.fillText(String(q.n), x, y + 1); c.restore(); }
    // labels: the first fraction over its columns, the second beside its rows
    const lab = (key, node, x, y, col, t0) => { if (t0 == null) return; if (!g.s.mk.ex[key]) { M.place(g, key, node, x, y, 30, { col }); M.writeIn(g, node, { dur: 0.25 * T }); } const bb = M.box(g, key); if (bb) { c.save(); c.fillStyle = 'rgba(255,248,225,0.82)'; c.beginPath(); c.roundRect(bb.x - bb.w / 2 - 6, bb.y - bb.h / 2 - 4, bb.w + 12, bb.h + 8, 10); c.fill(); c.restore(); } M.drawEx(g, c, key); };
    if (S.lab1 != null) { const w = S.a1 * cw, by = PY + PS + 8; c.save(); c.strokeStyle = SUNI; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(PX + 2, by); c.lineTo(PX + 2, by + 6); c.lineTo(PX + w - 2, by + 6); c.lineTo(PX + w - 2, by); c.stroke(); c.restore();
      lab('labA', M.frac(M.num(S.a1), M.num(S.b1), 'labA'), PX + w / 2, by + 34, SUNI, S.lab1); }
    if (S.lab2 != null) { const h = S.a2 * rh; c.save(); c.strokeStyle = CORNI; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(PX - 6, PY + 2); c.lineTo(PX - 12, PY + 2); c.lineTo(PX - 12, PY + h - 2); c.lineTo(PX - 6, PY + h - 2); c.stroke(); c.restore();
      lab('labB', M.frac(M.num(S.a2), M.num(S.b2), 'labB'), PX - 50, PY + h / 2 + 8, CORNI, S.lab2); }
    // the expression on a wooden farm sign
    { const w = 300, h = 92, x = 180 - w / 2, y = EY - 58; c.fillStyle = 'rgba(40,30,10,0.3)'; c.beginPath(); c.roundRect(x + 4, y + 7, w, h, 12); c.fill();
      const wg = c.createLinearGradient(0, y, 0, y + h); wg.addColorStop(0, '#fff2d0'); wg.addColorStop(1, '#f0d8a8'); c.fillStyle = wg; c.beginPath(); c.roundRect(x, y, w, h, 12); c.fill();
      c.strokeStyle = '#8a5a30'; c.lineWidth = 4; c.stroke(); c.fillStyle = '#8a5a30'; for (const px of [x + 12, x + w - 12]) { c.beginPath(); c.arc(px, y + 12, 3, 0, 7); c.fill(); } }
    M.drawEx(g, c, 'ex');
    // the hedgehog farmer
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', HX, HY - hopK * 20, 1.3, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'hedgehog', HX, HY, 1.3);
    M.drawUI(g, c);
  },
});
