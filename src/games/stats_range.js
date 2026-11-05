// stats_range.js — IQR! The interquartile range of a sorted data set: IQR = Q3 − Q1, built as a box plot.
// A balloon meadow at dawn: the data floats in a row of balloons, smallest to largest, each tethered by its string to its
// own spot on a ruler painted on the grass. The box plot draws itself under the ruler. The sign reads "IQR = ?".
// Moves: 1. Tap the median balloon: a plumb line drops from it to the ruler, "Q2" is written under it, and the balloons
//           drift apart into a blue lower half and a pink upper half.
//        2. Tap Q1 (the middle of the lower half) and Q3 (the middle of the upper half), in either order: the half is
//           circled, its middle balloon lights, a pulse runs down its string and a box edge rises on the ruler with its
//           label. Once both are in, the box closes and the whiskers unroll out to the smallest and largest values.
//        3. Drag Q3 onto Q1 (or Q1 onto Q3): a measuring tape stretches across the box, "Q3 − Q1 = 18 − 7" writes itself
//           above it, then "= 11", and 11 flies into the sign. Dragging the smallest onto the largest (the range) is the
//           classic miss.
// Level 0: 7 values 1–20. Level 1: 7 values 10–60. Level 2: 11 values 1–40. Medium mode: Q3 − Q1 from the tray.
const M = MK, RY = 420, BY = 288, BOXY = 474, BOXH = 34, SIGNY = 212, LOWC = '#6aaef0', UPC = '#f07aa8', MEDC = '#ffd24a', TAPE = '#ffe9a0';
function pick(g) {
  const L = g.level, n = L === 2 ? 11 : 7, lo = L === 1 ? 10 : 1, hi = L === 0 ? 20 : L === 1 ? 60 : 40, h = (n - 1) / 2;
  const q1i = (h - 1) / 2, q3i = h + 1 + (h - 1) / 2;
  for (let tries = 0; tries < 300; tries++) {
    const pool = []; for (let v = lo; v <= hi; v++) pool.push(v);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const s = pool.slice(0, n).sort((a, b) => a - b), iqr = s[q3i] - s[q1i], range = s[n - 1] - s[0];
    if (range - iqr < 4 || iqr < 3) continue;
    return { s, n, h, q1i, q3i, iqr, range };
  }
  return { s: [2, 4, 5, 7, 9, 12, 15], n: 7, h: 3, q1i: 1, q3i: 5, iqr: 8, range: 13 };
}
function meadow(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 400); [[0, '#5a6ab0'], [0.35, '#c88ab8'], [0.7, '#ffc0a0'], [1, '#ffe6b8']].forEach(([k, col]) => sk.addColorStop(k, col)); c.fillStyle = sk; c.fillRect(0, 0, W, 400);
  const sun = c.createRadialGradient(70, 372, 4, 70, 372, 170); sun.addColorStop(0, 'rgba(255,246,200,0.95)'); sun.addColorStop(0.25, 'rgba(255,220,160,0.4)'); sun.addColorStop(1, 'rgba(255,200,160,0)'); c.fillStyle = sun; c.fillRect(0, 180, W, 240);
  c.fillStyle = '#fff6d0'; c.beginPath(); c.arc(70, 372, 22, 0, 7); c.fill();
  // far hills in morning mist
  c.fillStyle = '#b8a0c0'; c.beginPath(); c.moveTo(0, 372); c.bezierCurveTo(80, 340, 150, 366, 220, 350); c.bezierCurveTo(280, 338, 320, 356, W, 346); c.lineTo(W, 410); c.lineTo(0, 410); c.fill();
  c.fillStyle = '#8ab890'; c.beginPath(); c.moveTo(0, 392); c.bezierCurveTo(100, 374, 200, 396, W, 380); c.lineTo(W, 420); c.lineTo(0, 420); c.fill();
  const gr = c.createLinearGradient(0, 390, 0, H); gr.addColorStop(0, '#7ec070'); gr.addColorStop(0.4, '#5aa058'); gr.addColorStop(1, '#3a7a44'); c.fillStyle = gr;
  c.beginPath(); c.moveTo(0, 398); c.bezierCurveTo(120, 390, 240, 404, W, 394); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  for (let i = 0; i < 70; i++) { const x = (i * 53) % W, y = 520 + (i * 29) % 110; c.strokeStyle = `rgba(30,80,40,${0.25 + (i % 3) * 0.1})`; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 2, y - 6, x + (i % 2 ? 4 : -3), y - 11); c.stroke(); }
  for (const [x, y, col] of [[30, 560, '#fff4f0'], [96, 610, '#ffd0e0'], [250, 600, '#fff4f0'], [336, 548, '#ffe070'], [180, 626, '#ffd0e0']]) { c.fillStyle = col; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + Math.cos(k * 1.26) * 3.5, y + Math.sin(k * 1.26) * 3.5, 2.6, 0, 7); c.fill(); } c.fillStyle = '#ffb030'; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); }
}
// a little hot-air balloon far away (ambient)
function farBalloon(c, x, y, s, col) { c.save(); c.globalAlpha = 0.55; c.fillStyle = col; c.beginPath(); c.ellipse(x, y, 9 * s, 11 * s, 0, 0, 7); c.fill(); c.fillStyle = '#7a4a3a'; c.fillRect(x - 2.5 * s, y + 13 * s, 5 * s, 4 * s); c.strokeStyle = '#7a4a3a'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(x - 5 * s, y + 8 * s); c.lineTo(x - 2.5 * s, y + 13 * s); c.moveTo(x + 5 * s, y + 8 * s); c.lineTo(x + 2.5 * s, y + 13 * s); c.stroke(); c.restore(); }
const recolor = (b, col, t0) => { b.prev = b.col; b.col = col; b.tint = t0; };
function shade(hex, k) { const v = parseInt(hex.slice(1), 16), f = q => Math.max(0, Math.min(255, Math.round(k > 0 ? q + (255 - q) * k : q * (1 + k)))); return '#' + [v >> 16, (v >> 8) & 255, v & 255].map(q => f(q).toString(16).padStart(2, '0')).join(''); }

MG.add({
  id: 'iqr', stage: 'stats', cmd: 'IQR!', hint: 'tap', time: 9, mood: 'bright', winText: 'Boxed in!', hold: 1.7,
  card: {
    title: 'The interquartile range', ref: 'Grade 6 and up', kind: 'Statistics',
    text: 'The interquartile range (IQR) measures how spread out the middle half of the data is.\n\nPut the data in order and find the median. It splits the data into a lower half and an upper half. Q1, the first quartile, is the middle of the lower half. Q3 is the middle of the upper half. Then IQR = Q3 − Q1.\n\nFor 2, 4, 5, 7, 9, 12, 15 the median is 7. Q1 is 4, the middle of 2, 4, 5, and Q3 is 12, the middle of 9, 12, 15. So IQR = 12 − 4 = 8.\n\nA box plot draws a box from Q1 to Q3 with whiskers out to the smallest and largest values. Unlike the range, the IQR ignores extreme values.',
    note: 'Q1 is the median of the lower half and Q3 the median of the upper half. IQR = Q3 − Q1.',
    ask: 'What is the IQR of 1, 3, 4, 6, 8, 10, 13? Why is it smaller than the range?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), n = p.n;
    const sp = Math.min(46, 304 / (n - 1)); S.sp = sp;
    const lo5 = Math.floor(p.s[0] / 5) * 5, hi5 = Math.max(lo5 + 10, Math.ceil(p.s[n - 1] / 5) * 5); S.lo5 = lo5; S.hi5 = hi5;
    S.rx = v => 36 + (v - lo5) / (hi5 - lo5) * 288;
    S.bl = p.s.map((v, i) => ({ i, v, x0: 180 + (i - (n - 1) / 2) * sp, x: 0, node: M.num(v), phase: i * 1.9, side: i < p.h ? -1 : i > p.h ? 1 : 0, hop: -9, col: '#fff2e0', tint: 0 }));
    S.bs = n > 7 ? 16 : 20; // balloon radius
    S.ans = M.slot('ans', { w: 56 }); S.top = M.row(M.txt('IQR', 'itx'), M.op('=', 'ieq'), S.ans);
    M.place(g, 'top', S.top, 180, SIGNY + 13, 38, { col: '#fff4dc' }); M.inert(g, ['itx', 'ieq', 'na', 'nm', 'nb', 'ne', 'nq', 'n3', 'n1']);
    S.split = 0; S.q = {}; S.face = (g, e) => { S.ex = e; S.faceT = g.t; g.s.mk.lastMove = g.t; };
    const zones = () => { for (const b of S.bl) M.zone(g, 'b' + b.i, { x: b.x, y: b.y, w: Math.min(42, sp - 2), h: S.bs * 2 + 18, s: 26 }); };
    S.zones = zones; S.place = () => { for (const b of S.bl) { b.x = b.x0 + b.side * 10 * M.easeIO(S.split); b.y = BY + Math.sin(g.t * 1.6 + b.phase) * 3; } zones(); }; S.place();
    const ids = list => list.map(i => 'b' + i), lowIds = ids([...Array(p.h).keys()]), upIds = ids([...Array(p.h).keys()].map(k => k + p.h + 1));
    g.dur *= (2.6 + 1.05 * 4) / 8;
    M.play(g, {
      moves(g) {
        // 1. the median splits the data in two
        if (!S.medAt) return [{ tap: 'b' + p.h, busy: 0.1, then(g) {
          const len = 1.15 * T; M.show(g, len); S.medAt = g.t; S.face(g, 'wow'); g.sfx('pop'); const mb = S.bl[p.h];
          M.circle(g, 'b' + p.h, { dur: 0.5 * T, col: MEDC }); M.indicate(g, mb.node, { dur: 0.4 * T, col: MEDC }); recolor(mb, MEDC, g.t);
          S.drop = { t0: g.t + 0.25 * T, dur: 0.4 * T, x: S.rx(mb.v) };
          M.at(g, [[0.55 * T, g => { S.splitAt = g.t; g.sfx('whoosh'); M.tween(g, S, { split: 1 }, 0.45 * T); for (const b of S.bl) if (b.side) recolor(b, b.side < 0 ? LOWC : UPC, g.t + Math.abs(b.i - p.h) * 0.04 * T); }],
            [0.75 * T, g => { S.q2 = g.t; g.sfx('tap'); }]]);
        } }];
        const out = [];
        // 2. Q1 and Q3, in either order: the middle of each half
        for (const [key, qi, half, col] of [['q1', p.q1i, lowIds, LOWC], ['q3', p.q3i, upIds, UPC]]) {
          if (S.q[key]) continue;
          out.push({ tap: 'b' + qi, busy: 0.1, then(g) {
            const second = Object.keys(S.q).length === 1, len = (second ? 1.65 : 1.0) * T; M.show(g, len); S.face(g, 'think'); g.sfx('pop');
            S.q[key] = { t0: g.t }; const b = S.bl[qi];
            M.circle(g, half, { dur: 0.5 * T, col, pad: 4 }); M.indicate(g, b.node, { dur: 0.4 * T, delay: 0.2 * T, col: '#fff' });
            M.at(g, [[0.2 * T, g => { b.hop = g.t; recolor(b, shade(col, -0.25), g.t); S.q[key].pulse = g.t; g.sfx('tap'); }],
              [0.55 * T, g => { S.q[key].edge = g.t; g.sfx('ding'); g.burst(S.rx(b.v), BOXY - BOXH / 2, ['#fff', col], 6, 70); }]]);
            if (second) M.at(g, [[0.85 * T, g => { S.boxAt = g.t; g.sfx('swoosh'); }], [1.15 * T, g => { S.whiskAt = g.t; g.sfx('whoosh'); }],
              [1.45 * T, g => { for (const b2 of [S.bl[0], S.bl[n - 1]]) { b2.hop = g.t; M.indicate(g, b2.node, { dur: 0.3 * T }); } g.sfx('tap'); }]]);
          } });
        }
        if (out.length) return out;
        // 3. Q3 − Q1
        if (!S.subAt) {
          const go = { busy: 0.1, askAt: 0.95 * T, after: 1.35 * T, ask: { v: p.iqr, wrong: [p.range, p.s[p.q3i] + p.s[p.q1i], p.iqr + 1, p.s[p.q3i] - p.s[p.h]] },
            then(g) { S.subAt = g.t; M.show(g, 0.95 * T); S.face(g, 'think'); g.sfx('swoosh');
              M.circle(g, ['b' + p.q1i, 'b' + p.q3i], { dur: 0.5 * T, col: TAPE });
              S.tape = { t0: g.t + 0.15 * T, dur: 0.5 * T };
              S.res = M.num(p.iqr, 'nq', { alpha: 0 });
              S.note = M.row(M.num(p.s[p.q3i], 'na'), M.op('−', 'nm'), M.num(p.s[p.q1i], 'nb'), M.op('=', 'ne'), S.res);
              M.place(g, 'note', S.note, (S.rx(p.s[p.q1i]) + S.rx(p.s[p.q3i])) / 2, RY - 32, 28, { col: '#fffbe8' }); M.writeIn(g, S.note, { delay: 0.3 * T, dur: 0.45 * T }); },
            resolve(g) { M.show(g, 1.35 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.2 * T }); M.indicate(g, S.res, { delay: 0.15 * T, dur: 0.35 * T, col: TAPE }); g.sfx('ding'); S.face(g, 'wow');
              M.at(g, [[0.5 * T, g => { const bq = M.box(g, 'nq'); M.tween(g, S.note, { alpha: 0 }, 0.3 * T);
                M.fly(g, { node: M.num(p.iqr, null, { col: '#fff4c0' }), from: [bq.x, bq.y], to: 'ans', dur: 0.5 * T, arc: -50, s0: 26, s1: 38,
                  then(g) { S.ans.fill = M.num(p.iqr, null, { pop: g.t }); M.sparkle(g, 'ans', { n: 14 }); g.sfx('coin'); S.face(g, 'laugh'); for (const b of S.bl) b.hop = g.t + b.i * 0.03; } }); }],
                [1.3 * T, g => { delete g.s.mk.ex.note; }]]); } };
          return [{ drag: 'b' + p.q3i, to: 'b' + p.q1i, ...go }, { drag: 'b' + p.q1i, to: 'b' + p.q3i, ...go }];
        }
        return [];
      },
      area(g) { const m = M.current(g); return m.length ? [].concat(...m.map(q => q.tap || q.drag)) : null; },
    });
  },
  update(g, dt) { g.s.place(); M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, p = S.p, n = p.n, T = M.pace(g);
    c.drawImage(g.bake('stats_range_meadow', meadow), 0, 0, 360, 640);
    for (const [x0, y, s, col, v] of [[40, 150, 0.8, '#ff9a6a', 4], [300, 120, 0.6, '#7ab0f0', -3], [210, 360, 0.5, '#f0d060', 2]]) farBalloon(c, (x0 + t * v + 400) % 400 - 20, y + Math.sin(t * 0.8 + x0) * 4, s, col);
    SCN.panel(c, 'sign', 180, SIGNY, 220, 62, t);
    // the ruler on the grass: a painted line with ticks every unit step
    const step = S.hi5 - S.lo5 > 30 ? 5 : S.hi5 - S.lo5 > 12 ? 2 : 1;
    c.save(); c.strokeStyle = 'rgba(30,60,30,0.35)'; c.lineWidth = 6; c.beginPath(); c.moveTo(30, RY + 3); c.lineTo(330, RY + 3); c.stroke();
    c.strokeStyle = '#fbf6e4'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(30, RY); c.lineTo(330, RY); c.stroke();
    c.font = M.NUMF(12, 600); c.textAlign = 'center'; c.fillStyle = 'rgba(255,255,240,0.8)';
    for (let v = S.lo5; v <= S.hi5; v += step) { const x = S.rx(v), big = v % 5 === 0; c.lineWidth = big ? 2.5 : 1.5; c.beginPath(); c.moveTo(x, RY - (big ? 7 : 4)); c.lineTo(x, RY + (big ? 7 : 4)); c.stroke(); if (big && (S.hi5 - S.lo5 <= 30 || v % 10 === 0)) c.fillText(v, x, RY + 20); }
    c.restore();
    // the box plot, under the ruler
    const lab = (txt, x, k, col) => { if (k <= 0) return; c.save(); c.globalAlpha = Math.min(1, k); c.font = M.NUMF(17, 600); c.textAlign = 'center'; c.fillStyle = 'rgba(20,50,30,0.45)'; c.lineWidth = 4; c.lineJoin = 'round'; c.strokeStyle = 'rgba(20,50,30,0.75)'; c.strokeText(txt, x, BOXY + BOXH / 2 + 21); c.fillStyle = col; c.fillText(txt, x, BOXY + BOXH / 2 + 21); c.restore(); };
    const y0 = BOXY - BOXH / 2, y1 = BOXY + BOXH / 2, xq1 = S.rx(p.s[p.q1i]), xq3 = S.rx(p.s[p.q3i]), xm = S.rx(p.s[p.h]);
    c.save(); c.lineCap = 'round'; c.strokeStyle = '#fffbe8'; c.shadowColor = 'rgba(255,240,180,0.8)'; c.shadowBlur = 6; c.lineWidth = 3.5;
    if (S.boxAt) { const k = M.easeIO((t - S.boxAt) / (0.3 * T)); c.fillStyle = 'rgba(255,240,200,0.18)'; c.fillRect(xq1, y0, (xq3 - xq1) * k, BOXH);
      c.beginPath(); c.moveTo(xq1, y0); c.lineTo(M.lerp(xq1, xq3, k), y0); c.moveTo(xq1, y1); c.lineTo(M.lerp(xq1, xq3, k), y1); c.stroke(); }
    if (S.whiskAt) { const k = M.easeIO((t - S.whiskAt) / (0.35 * T)), a = S.rx(p.s[0]), b = S.rx(p.s[n - 1]);
      c.beginPath(); c.moveTo(xq1, BOXY); c.lineTo(M.lerp(xq1, a, k), BOXY); c.moveTo(xq3, BOXY); c.lineTo(M.lerp(xq3, b, k), BOXY); c.stroke();
      if (k >= 1) { c.beginPath(); c.moveTo(a, BOXY - 9); c.lineTo(a, BOXY + 9); c.moveTo(b, BOXY - 9); c.lineTo(b, BOXY + 9); c.stroke(); } }
    for (const [key, x, col, nm] of [['q1', xq1, LOWC, 'Q1'], ['q3', xq3, UPC, 'Q3']]) { const q = S.q[key]; if (!q || !q.edge) continue; const k = M.ease((t - q.edge) / (0.25 * T));
      c.strokeStyle = shade(col, 0.55); c.beginPath(); c.moveTo(x, y1); c.lineTo(x, M.lerp(y1, y0, k)); c.stroke(); c.restore(); lab(nm, x, k * 2, shade(col, 0.6)); c.save(); c.lineCap = 'round'; c.lineWidth = 3.5; }
    if (S.drop) { const k = M.easeIO((t - S.drop.t0) / S.drop.dur); if (k > 0) { c.strokeStyle = MEDC; c.shadowColor = MEDC; c.setLineDash([5, 5]);
      const top = BY + S.bs; c.beginPath(); c.moveTo(xm, top); c.lineTo(xm, M.lerp(top, y1, k)); c.stroke(); c.setLineDash([]); } }
    c.restore();
    if (S.q2) lab('Q2', xm, M.ease((t - S.q2) / (0.25 * T)) * 2, '#ffe9a0');
    // the measuring tape across the box
    if (S.tape && t > S.tape.t0) { const k = M.easeIO((t - S.tape.t0) / S.tape.dur), yy = y0 - 8; c.save(); c.fillStyle = '#ffd860'; c.strokeStyle = '#a8701a'; c.lineWidth = 1.5;
      c.beginPath(); c.roundRect(xq1, yy - 5, Math.max(4, (xq3 - xq1) * k), 10, 3); c.fill(); c.stroke(); c.strokeStyle = '#7a5010'; for (let x = xq1 + 6; x < xq1 + (xq3 - xq1) * k - 2; x += 6) { c.beginPath(); c.moveTo(x, yy - 5); c.lineTo(x, yy - (Math.round((x - xq1) / 6) % 5 ? 1 : -2)); c.stroke(); } c.restore(); }
    // strings, then balloons
    const P0 = K.press, dragId = P0 && P0.dragging ? P0.id : null, miss = K.missInfo && t - K.missAt < 0.6 ? (K.missInfo.tap || K.missInfo.to || K.missInfo.drag) : null;
    for (const b of S.bl) { const xr = S.rx(b.v), pulse = [['q1', p.q1i], ['q3', p.q3i]].find(([k, i]) => i === b.i && S.q[k] && S.q[k].pulse);
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(b.x, b.y + S.bs + 6); c.quadraticCurveTo(b.x + Math.sin(t * 1.3 + b.phase) * 8, (b.y + RY) / 2 + 20, xr, RY); c.stroke();
      c.fillStyle = '#fbf6e4'; c.beginPath(); c.arc(xr, RY, 3, 0, 7); c.fill();
      if (pulse) { const k = (t - S.q[pulse[0]].pulse) / (0.4 * T); if (k > 0 && k < 1) { const u = M.easeIO(k), y0q = b.y + S.bs + 6, mx = b.x, my = (b.y + RY) / 2 + 20, px = (1 - u) * (1 - u) * b.x + 2 * (1 - u) * u * mx + u * u * xr, py = (1 - u) * (1 - u) * y0q + 2 * (1 - u) * u * my + u * u * RY;
        c.fillStyle = '#fff'; c.shadowColor = '#fff'; c.shadowBlur = 12; c.beginPath(); c.arc(px, py, 4, 0, 7); c.fill(); } }
      c.restore(); }
    for (const b of S.bl) {
      const hk = t - b.hop, hop = hk > 0 && hk < 0.35 ? Math.sin(hk / 0.35 * Math.PI) * 12 : 0, sh = miss === 'b' + b.i ? Math.sin((t - K.missAt) * 50) * 4 : 0;
      const tk = M.clamp((t - b.tint) / 0.3, 0, 1), r = S.bs, x = b.x + sh, y = b.y - hop;
      const pv = b.prev || '#fff2e0', col = M.mix(pv, b.col, tk), dk = M.mix(shade(pv, -0.28), shade(b.col, -0.28), tk);
      c.save(); if (dragId === 'b' + b.i) c.globalAlpha = 0.35;
      const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 2, x, y, r * 1.2); gr.addColorStop(0, '#fff'); gr.addColorStop(0.35, col); gr.addColorStop(1, dk);
      c.fillStyle = miss === 'b' + b.i ? '#f08070' : gr; c.beginPath(); c.moveTo(x, y + r * 1.15); c.bezierCurveTo(x - r * 1.35, y + r * 0.4, x - r * 1.05, y - r * 1.15, x, y - r * 1.1); c.bezierCurveTo(x + r * 1.05, y - r * 1.15, x + r * 1.35, y + r * 0.4, x, y + r * 1.15); c.fill();
      c.strokeStyle = 'rgba(90,40,60,0.35)'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = dk; c.beginPath(); c.moveTo(x - 3, y + r * 1.25); c.lineTo(x + 3, y + r * 1.25); c.lineTo(x, y + r * 1.1); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(x - r * 0.45, y - r * 0.5, r * 0.18, r * 0.3, 0.5, 0, 7); c.fill();
      const fs = n > 7 ? 17 : 21, mm = M.lay(b.node, fs); M.draw(c, b.node, x - mm.w / 2, y + 2 + (mm.a - mm.d) / 2, fs, { t, col: '#3a1a3a' });
      c.restore();
    }
    if (dragId) { const b = S.bl.find(q => 'b' + q.i === dragId); if (b) { c.save(); c.fillStyle = b.col; c.beginPath(); c.arc(P0.x, P0.y - 20, S.bs, 0, 7); c.fill(); c.strokeStyle = 'rgba(90,40,60,0.4)'; c.lineWidth = 1.5; c.stroke(); const mm = M.lay(b.node, 20); M.draw(c, { ...b.node, sc: 1, hl: 0 }, P0.x - mm.w / 2, P0.y - 20 + (mm.a - mm.d) / 2, 20, { t, col: '#3a1a3a' }); c.restore(); } }
    // the rabbit host
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.ex : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', 316, 628 - hopK * 20, 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'rabbit', 316, 628, 1.15);
    M.drawEx(g, c, 'top');
    // the working note sits on a soft dark pill so it reads over the hills
    if (K.ex.note) { const nb = M.unionBox(['na', 'nq'].map(i => K.box[i])); if (nb) { c.save(); c.globalAlpha = S.note.alpha ?? 1; c.fillStyle = 'rgba(40,30,60,0.45)'; c.beginPath(); c.roundRect(nb.x - nb.w / 2 - 12, nb.y - nb.h / 2 - 7, nb.w + 24, nb.h + 14, 14); c.fill(); c.restore(); } }
    M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
