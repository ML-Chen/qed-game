// stats_sd.js — STANDARD DEV! The population standard deviation σ = √( mean of (x − μ)² ), with deviations turned into
// little squares. An autumn wood in golden afternoon light: acorns sit on a fallen log painted as a number line, the mean is
// a tag μ = 6 hanging under the log, and the sign reads "σ = ?". A hedgehog watches from the leaves.
// Moves: 1. Tap the μ tag: a dashed line rises from it, and a deviation bar grows from μ out to each acorn (blue to the
//           left, orange to the right), each with its tiny signed length (−3, +1, ...). Left and right cancel.
//        2. Tap any bar: one by one the bars lift into the air and fold up into squares of unit cells, and each tiny
//           number rolls over to its square ("(−3)² = 9" is written beside the biggest). Squaring makes every one positive.
//        3. Drag one square onto another: every unit cell flies out and the cells are shared out fairly into n equal
//           squares; "9 + 1 + 0 + 1 + 9 = 20" writes itself, then "20 ÷ 5 = 4" (the variance), written into each square.
//        4. Tap a fair square: its side is measured, "√4 = 2" writes itself, 2 flies into σ, and arrows mark μ ± σ on the log.
// Level 0: 5 values with deviations −3, −1, 0, 1, 3. Level 1: 5 values, one far from the rest. Level 2: 6 values. σ = 2. Medium mode: the variance and σ
// are picked from the tray.
let U = 20; const M = MK, LY = 440, GY = 350, LU = 24, SIGNY = 212, NEG = '#6ab4f0', POS = '#ff9a4a', GOLD = '#ffd860', CELL = '#ffb347', EDGE = '#5a2a0a', INK = '#fff4dc';
const SETS = [[[-3, -1, 0, 1, 3]], [[-4, 1, 1, 1, 1], [-1, -1, -1, -1, 4], [-3, -1, 0, 1, 3]], [[-3, -2, 0, 1, 1, 3], [-3, -1, -1, 0, 2, 3], [-2, -2, -2, 2, 2, 2]]];
function pick(g) {
  const L = Math.min(2, g.level), list = SETS[L], d0 = list[Math.floor(g.rand() * list.length)], flip = g.rand() < 0.5 ? -1 : 1;
  const d = d0.map(v => v * flip || 0).sort((a, b) => a - b), mu = 5 + Math.floor(g.rand() * 3), n = d.length, tot = d.reduce((s, v) => s + v * v, 0), vr = tot / n;
  return { d, mu, n, tot, vr, sd: Math.round(Math.sqrt(vr)), vals: d.map(v => mu + v) };
}
const sgn = v => v > 0 ? '+' + v : String(v);
function wood(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 470); [[0, '#3e7a8a'], [0.45, '#a8b880'], [0.8, '#f0c870'], [1, '#f8a850']].forEach(([k, col]) => sk.addColorStop(k, col)); c.fillStyle = sk; c.fillRect(0, 0, W, 470);
  const sun = c.createRadialGradient(250, 330, 6, 250, 330, 230); sun.addColorStop(0, 'rgba(255,240,190,0.85)'); sun.addColorStop(0.3, 'rgba(255,210,130,0.35)'); sun.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = sun; c.fillRect(0, 100, W, 400);
  // far trunks, then canopy blobs of amber and rust
  for (let i = 0; i < 9; i++) { const x = 12 + i * 42 + (i % 2) * 9, w = 10 + (i % 3) * 4; c.fillStyle = `rgba(110,70,60,${0.28 + (i % 3) * 0.08})`; c.fillRect(x, 150, w, 330); }
  const blob = (x, y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  for (let i = 0; i < 26; i++) blob((i * 61) % 400 - 20, 40 + (i * 37) % 120, 34 + (i % 4) * 10, ['#c8602a', '#e08a30', '#a84a2a', '#e8a840'][i % 4]);
  for (let i = 0; i < 18; i++) blob((i * 83 + 30) % 400 - 20, 10 + (i * 29) % 60, 30 + (i % 3) * 8, ['#f0b048', '#d8702e', '#b85430'][i % 3]);
  c.fillStyle = '#6a3a2a'; c.fillRect(0, 0, 26, 480); c.fillRect(334, 0, 26, 480); // near trunks frame the scene
  c.fillStyle = 'rgba(255,220,160,0.25)'; c.fillRect(20, 0, 4, 480); c.fillRect(352, 0, 3, 480);
  // forest floor of fallen leaves
  const gr = c.createLinearGradient(0, 440, 0, H); gr.addColorStop(0, '#b8682e'); gr.addColorStop(0.5, '#8a4a26'); gr.addColorStop(1, '#5a301c'); c.fillStyle = gr;
  c.beginPath(); c.moveTo(0, 452); c.bezierCurveTo(120, 444, 240, 458, W, 448); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  for (let i = 0; i < 90; i++) { const x = (i * 47) % W, y = 470 + (i * 31) % 170; c.save(); c.translate(x, y); c.rotate(i * 1.3); c.fillStyle = ['#e0802e', '#c85a28', '#f0b040', '#a84a24'][i % 4]; c.globalAlpha = 0.6; c.beginPath(); c.ellipse(0, 0, 6, 3, 0, 0, 7); c.fill(); c.restore(); }
}
function leaf(c, x, y, a, col) { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = col; c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(5, 0, 0, 6); c.quadraticCurveTo(-5, 0, 0, -6); c.fill(); c.restore(); }
function acorn(c, x, y, r, o = {}) {
  c.save(); c.translate(x, y); if (o.sc) c.scale(o.sc, o.sc);
  c.fillStyle = o.red ? '#e07a6a' : '#c8843a'; c.beginPath(); c.ellipse(0, 2, r * 0.82, r, 0, 0, 7); c.fill(); c.strokeStyle = '#6a3a1a'; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = 'rgba(255,230,180,0.45)'; c.beginPath(); c.ellipse(-r * 0.3, 0, r * 0.2, r * 0.45, 0.3, 0, 7); c.fill();
  c.fillStyle = '#7a5030'; c.beginPath(); c.ellipse(0, -r * 0.5, r * 0.95, r * 0.5, 0, Math.PI, 0); c.fill(); c.fillRect(-r * 0.95, -r * 0.55, r * 1.9, 3); c.strokeStyle = '#4a2a14'; c.stroke();
  c.strokeStyle = '#4a2a14'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -r * 0.95); c.lineTo(1.5, -r * 1.3); c.stroke(); c.restore();
}
// a square of unit cells, standing on (x0, yb), side w, risen to height h
function cells(c, x0, yb, w, h, col, a = 1) {
  if (w <= 0 || h <= 0) return; c.save(); c.globalAlpha *= a; c.fillStyle = col; c.fillRect(x0, yb - h, w, h);
  c.strokeStyle = 'rgba(110,50,10,0.6)'; c.lineWidth = 1.2; c.beginPath(); for (let x = x0 + U; x < x0 + w - 1; x += U) { c.moveTo(x, yb - h); c.lineTo(x, yb); } for (let y = yb - U; y > yb - h + 1; y -= U) { c.moveTo(x0, y); c.lineTo(x0 + w, y); } c.stroke();
  c.strokeStyle = EDGE; c.lineWidth = 2.5; c.strokeRect(x0, yb - h, w, h); c.restore();
}

MG.add({
  id: 'stdev', stage: 'stats', cmd: 'STANDARD DEV!', hint: 'tap', time: 10, mood: 'warm', winText: 'Spread found!', hold: 1.8,
  card: {
    title: 'Standard deviation', ref: 'High school', kind: 'Statistics',
    text: 'The standard deviation σ (sigma) measures how far the data usually is from the mean μ (mu).\n\nFirst find each value\'s distance from the mean: x − μ. Some are negative and some positive, and they always add up to 0, so square them: every square is positive. Average the squares to get the variance. Then take the square root to get back to the original units.\n\nFor 3, 5, 6, 7, 9 the mean is 6. The distances are −3, −1, 0, 1, 3. The squares are 9, 1, 0, 1, 9, which add up to 20. The variance is 20 ÷ 5 = 4, so σ = √4 = 2.\n\n(For a sample rather than a whole population, statisticians divide by n − 1 instead of n.)',
    note: 'σ = √( average of (x − μ)² ): subtract the mean, square, average, then take the square root.',
    ask: 'What is σ for 2, 4, 4, 4, 5, 5, 7, 9 (mean 5)? What is σ for 1, 1, 5, 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), n = p.n; U = Math.max(...p.d.map(Math.abs)) >= 4 ? 16 : 20;
    S.lx = v => 180 + (v - p.mu) * LU; S.xm = S.lx(p.mu);
    const cnt = {}; S.pt = p.d.map((d, i) => { const v = p.mu + d, k = cnt[v] = (cnt[v] ?? -1) + 1; return { i, d, v, k, x: S.lx(v), ay: LY - 11 - k * 21, lane: LY + 34 + i * 18, lab: M.num(sgn(d)), phase: i * 1.7, hop: -9 }; });
    // where each square sits in the air: in data order, side |d| cells
    { const ws = S.pt.map(q => Math.max(8, Math.abs(q.d) * U)), tot = ws.reduce((s, w) => s + w, 0) + 12 * (n - 1); let x = 180 - tot / 2; S.pt.forEach((q, i) => { q.gl = x; q.gw = ws[i]; x += ws[i] + 12; }); }
    S.ans = M.slot('ans', { w: 52 }); S.top = M.row(M.vr('σ', 'sg'), M.op('=', 'seq'), S.ans);
    M.place(g, 'top', S.top, 180, SIGNY + 13, 40, { col: INK }); M.inert(g, ['sg', 'seq', 'n0', 'n1', 'n2', 'n3', 'nr']);
    S.face = (g, e) => { S.ex = e; S.faceT = g.t; g.s.mk.lastMove = g.t; };
    S.gk = 0; S.fairA = 0; S.noteY = Math.max(268, GY - Math.max(...S.pt.map(q => q.gw)) - 26);
    const fairX = f => { const w = p.sd * U, tw = n * w + (n - 1) * 12 * S.gk; return 180 - tw / 2 + f * (w + 12 * S.gk); };
    S.fairX = fairX;
    const zones = () => { const Z = g.s.mk; for (const k of Object.keys(Z.box)) if (/^([adqf]\d|mu)$/.test(k)) { delete Z.box[k]; if (Z.zones) delete Z.zones[k]; }
      for (const q of S.pt) M.zone(g, 'a' + q.i, { x: q.x, y: q.ay, w: 20, h: 22, s: 20 });
      if (!S.muAt) M.zone(g, 'mu', { x: S.xm, y: 589, w: 70, h: 34, s: 24 });
      if (S.muAt && !S.sqAt) for (const q of S.pt) if (q.d) M.zone(g, 'd' + q.i, { x: (q.x + S.xm) / 2, y: q.lane, w: Math.max(18, Math.abs(q.d) * LU), h: 14, s: 20 });
      if (S.sqAt && !S.mergeAt) for (const q of S.pt) if (q.d) M.zone(g, 'q' + q.i, { x: q.gl + q.gw / 2, y: GY - q.gw / 2, w: Math.max(26, q.gw), h: Math.max(26, q.gw), s: 24 });
      if (S.fair && !S.rootAt) for (let f = 0; f < n; f++) M.zone(g, 'f' + f, { x: fairX(f) + p.sd * U / 2, y: GY - p.sd * U / 2, w: Math.max(28, p.sd * U), h: Math.max(28, p.sd * U), s: 24 }); };
    S.zones = zones; zones();
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const nz = S.pt.filter(q => q.d);
    M.play(g, {
      moves(g) {
        // 1. measure every value from the mean
        if (!S.muAt) return [{ tap: 'mu', busy: 0.1, then(g) {
          S.muAt = g.t; const len = (0.4 + 0.09 * n + 0.45 + 0.75) * T; M.show(g, len); S.face(g, 'wow'); g.sfx('pop');
          // the signed distances always cancel: that is why they get squared next
          const sum = M.row(M.num(S.pt[0].d), ...S.pt.slice(1).map(q => [M.op(q.d < 0 ? '-' : '+'), M.num(Math.abs(q.d))]).flat(), M.op('='), M.num(0, null, { col: GOLD }));
          M.at(g, [[(0.4 + 0.09 * n + 0.4) * T, g => { M.note(g, { node: sum, at: [180, 314], s: 26, col: '#fffbe8', write: 0.4 * T, hold: 0.55 * T, fade: 0.3 * T }); g.sfx('tap'); }]]);
          S.pt.forEach((q, j) => { q.grow = { t0: g.t + (0.35 + 0.09 * j) * T, dur: 0.35 * T }; M.at(g, [[(0.35 + 0.09 * j + 0.35) * T, g => { q.hop = g.t; q.labAt = g.t; g.sfx(j % 2 ? 'tap' : 'pop'); }]]); });
          zones(); } }];
        // 2. square every deviation
        if (!S.sqAt) return [{ tap: nz.map(q => 'd' + q.i), busy: 0.1, then(g) {
          S.sqAt = g.t; const st = 0.11 * T, len = (0.15 + st / T * (n - 1) + 0.45 + 0.4 + 0.3) * T; M.show(g, len); S.face(g, 'think'); g.sfx('whoosh');
          const big = nz.reduce((a, b) => Math.abs(b.d) > Math.abs(a.d) ? b : a);
          S.pt.forEach((q, j) => { const t0 = 0.15 * T + j * st; q.fly = { t0: g.t + t0, dur: 0.45 * T }; q.up = { t0: g.t + t0 + 0.45 * T, dur: 0.35 * T };
            M.at(g, [[t0 + 0.45 * T, g => { g.sfx('tap'); }], [t0 + 0.6 * T, g => { M.roll(g, q.lab, q.d * q.d, { dur: 0.3 * T }); q.labPop = g.t; }], [t0 + 0.8 * T, g => { if (q.d) g.burst(q.gl + q.gw / 2, GY - q.gw, ['#fff4c0', CELL], 5, 60); }]]); });
          const bt = 0.15 * T + big.i * st + 0.5 * T;
          M.at(g, [[bt, g => { M.note(g, { node: M.row(M.sup(big.d < 0 ? M.paren(M.num(big.d)) : M.num(big.d), M.num(2)), M.op('='), M.num(big.d * big.d)), at: [big.gl + big.gw / 2, GY - big.gw - 22], s: 26, col: '#fffbe8', write: 0.3 * T, hold: 0.5 * T, fade: 0.25 * T }); }],
            [len - 0.05, g => { zones(); }]]); } }];
        // 3. share the squares out fairly: their average
        if (!S.mergeAt) {
          const ids = nz.map(q => 'q' + q.i), to = ids.slice(1).concat(ids[0]);
          return [{ drag: ids, to, busy: 0.1, askAt: 1.55 * T, after: 1.0 * T, ask: { v: p.vr, wrong: [p.tot, 0, p.vr + 1, n] },
            then(g) { S.mergeAt = g.t; M.show(g, 1.55 * T); S.face(g, 'wow'); g.sfx('swoosh'); zones();
              // every unit cell flies from its square into the fair squares, one fair square at a time
              const list = []; for (const q of S.pt) { const s = Math.abs(q.d); for (let r = 0; r < s; r++) for (let cc = 0; cc < s; cc++) list.push({ q, x: q.gl + cc * U, y: GY - r * U }); }
              S.cells = list.map((cl, j) => { const f = Math.floor(j / p.vr), w = j % p.vr, r = Math.floor(w / p.sd), cc = w % p.sd; return { ...cl, f, r, cc, t0: g.t + (0.15 + 0.75 * j / list.length) * T, dur: 0.38 * T }; });
              for (const q of S.pt) q.fade = g.t;
              S.sum = M.num(p.tot, 'nr', { alpha: 0 });
              S.note = M.row(...S.pt.map((q, j) => [j ? M.op('+') : null, M.num(q.d * q.d)]).flat(), M.op('='), S.sum);
              M.place(g, 'note', S.note, 180, S.noteY, 22, { col: '#fffbe8' }); M.writeIn(g, S.note, { delay: 0.1 * T, dur: 0.7 * T });
              M.at(g, [[0.95 * T, g => { S.sum.alpha = 1; S.sum.pop = g.t; g.sfx('ding'); }],
                [1.2 * T, g => { S.fair = true; M.tween(g, S, { gk: 1 }, 0.3 * T); g.sfx('swoosh'); // the fair squares part, and the sum becomes a division
                  S.var = M.num(p.vr, 'n3', { alpha: 0 }); S.note.items = [M.num(p.tot, 'n0'), M.op('÷'), M.num(n, 'n1'), M.op('='), S.var]; M.relayout(g, 'note'); M.place(g, 'note', S.note, 180, S.noteY, 26, { col: '#fffbe8' }); M.writeIn(g, S.note, { dur: 0.3 * T }); }]]); },
            resolve(g) { M.show(g, 1.0 * T); S.var.alpha = 1; M.writeIn(g, S.var, { dur: 0.2 * T }); M.indicate(g, S.var, { delay: 0.15 * T, dur: 0.35 * T, col: GOLD }); g.sfx('ding'); S.face(g, 'laugh');
              M.at(g, [[0.35 * T, g => { S.fairA = g.t; for (let f = 0; f < n; f++) M.at(g, [[f * 0.05 * T, g => g.burst(fairX(f) + p.sd * U / 2, GY - p.sd * U / 2, ['#fff4c0', CELL], 4, 50)]]); g.sfx('sparkle'); }],
                [0.7 * T, g => { M.tween(g, S.note, { alpha: 0 }, 0.25 * T); }], [0.98 * T, g => { delete g.s.mk.ex.note; zones(); }]]); } }];
        }
        // 4. the square root: the side of a fair square
        if (!S.rootAt) return [{ tap: [...Array(n).keys()].map(f => 'f' + f), busy: 0.1, askAt: 0.75 * T, after: 1.25 * T, ask: { v: p.sd, wrong: [p.vr, p.vr * p.vr, p.sd + 1] },
          then(g, id) { S.rootAt = g.t; S.rootF = +id.slice(1); M.show(g, 0.75 * T); S.face(g, 'think'); g.sfx('pop'); zones();
            S.side = { t0: g.t + 0.1 * T, dur: 0.35 * T };
            const x = fairX(S.rootF) + p.sd * U / 2; S.rq = M.num(p.sd, 'n2', { alpha: 0 });
            S.note = M.row(M.txt('√'), M.num(p.vr), M.op('='), S.rq); M.place(g, 'root', S.note, M.clamp(x, 80, 280), GY - p.sd * U - 30, 26, { col: '#fffbe8' }); M.writeIn(g, S.note, { delay: 0.25 * T, dur: 0.4 * T }); },
          resolve(g) { M.show(g, 1.25 * T); S.rq.alpha = 1; M.writeIn(g, S.rq, { dur: 0.2 * T }); M.indicate(g, S.rq, { delay: 0.15 * T, dur: 0.35 * T, col: GOLD }); g.sfx('ding');
            M.at(g, [[0.45 * T, g => { const b = M.box(g, 'n2'); M.tween(g, S.note, { alpha: 0 }, 0.3 * T);
              M.fly(g, { node: M.num(p.sd, null, { col: '#fff4c0' }), from: [b.x, b.y], to: 'ans', dur: 0.45 * T, arc: -40, s0: 26, s1: 40,
                then(g) { S.ans.fill = M.num(p.sd, null, { pop: g.t }); M.sparkle(g, 'ans', { n: 14 }); g.sfx('coin'); S.face(g, 'laugh'); S.band = g.t; for (const q of S.pt) q.hop = g.t + q.i * 0.04; } }); }],
              [1.2 * T, g => { delete g.s.mk.ex.root; }]]); } }];
        return [];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, p = S.p, n = p.n, T = M.pace(g), E = M.easeIO, cl = M.clamp;
    c.drawImage(g.bake('stats_sd_wood', wood), 0, 0, 360, 640);
    for (let i = 0; i < 10; i++) { const y = ((t * (18 + i * 3) + i * 97) % 520) + 40, x = (i * 71 + Math.sin(t * 1.3 + i) * 26) % 360; leaf(c, x, y, t * (1 + i % 3) + i, ['#e0802e', '#f0b040', '#c85a28'][i % 3]); }
    SCN.panel(c, 'sign', 180, SIGNY, 190, 64, t);
    // the fallen log, painted as a number line
    c.save(); c.fillStyle = 'rgba(40,20,10,0.35)'; c.beginPath(); c.ellipse(180, LY + 30, 170, 8, 0, 0, 7); c.fill();
    const lg = c.createLinearGradient(0, LY, 0, LY + 26); lg.addColorStop(0, '#a0683a'); lg.addColorStop(1, '#5a3420'); c.fillStyle = lg; c.beginPath(); c.roundRect(20, LY, 320, 26, 11); c.fill();
    c.fillStyle = '#d8a870'; c.beginPath(); c.ellipse(334, LY + 13, 8, 13, 0, 0, 7); c.fill(); c.strokeStyle = '#8a5a30'; c.lineWidth = 1; c.beginPath(); c.ellipse(334, LY + 13, 3.5, 6, 0, 0, 7); c.stroke();
    c.fillStyle = '#fff0d0'; c.font = M.NUMF(15, 600); c.textAlign = 'center'; c.strokeStyle = '#fff0d0'; c.lineWidth = 1.5;
    for (let v = p.mu - 6; v <= p.mu + 6; v++) { const x = S.lx(v); if (v < 0) continue; c.beginPath(); c.moveTo(x, LY); c.lineTo(x, LY + 4); c.stroke(); c.fillText(v, x, LY + 21); }
    c.restore();
    // μ ± σ arrows on the log at the end
    if (S.band) { const k = E((t - S.band) / (0.4 * T)), w = p.sd * LU * k; c.save(); c.strokeStyle = GOLD; c.fillStyle = GOLD; c.lineWidth = 3; c.shadowColor = GOLD; c.shadowBlur = 8; const y = LY - 2;
      c.beginPath(); c.moveTo(S.xm - w, y); c.lineTo(S.xm + w, y); c.stroke(); for (const s of [-1, 1]) { c.beginPath(); c.moveTo(S.xm + s * w + s * 4, y); c.lineTo(S.xm + s * w - s * 4, y - 5); c.lineTo(S.xm + s * w - s * 4, y + 5); c.fill(); } c.restore(); }
    // the mean: a tag under the log; once tapped, a dashed line rises from it
    const muK = S.muAt ? E((t - S.muAt) / (0.35 * T)) : 0;
    if (S.muAt) { c.save(); c.strokeStyle = GOLD; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.shadowColor = GOLD; c.shadowBlur = 6; c.beginPath(); c.moveTo(S.xm, 574); c.lineTo(S.xm, M.lerp(574, LY + 28, muK)); c.stroke(); c.restore(); }
    { const miss = K.missInfo && K.missInfo.tap === 'mu' && t - K.missAt < 0.5 ? Math.sin((t - K.missAt) * 50) * 3 : 0, x = S.xm + miss; c.save();
      c.strokeStyle = '#6a3a1a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, LY + 26); c.lineTo(x, 574); c.stroke();
      c.fillStyle = 'rgba(40,20,10,0.3)'; c.beginPath(); c.roundRect(x - 34, 577, 68, 30, 9); c.fill(); c.fillStyle = '#fff2d6'; c.beginPath(); c.roundRect(x - 35, 574, 70, 30, 9); c.fill(); c.strokeStyle = GOLD; c.lineWidth = S.muAt ? 2.5 : 1.5; c.stroke();
      const nd = M.row(M.vr('μ'), M.op('='), M.num(p.mu)), mm = M.lay(nd, 20); M.draw(c, nd, x - mm.w / 2, 589 + (mm.a - mm.d) / 2, 20, { t, col: '#4a2418' }); c.restore(); }
    // a dark plate behind the squares so they stand out from the bright woods
    if (S.sqAt) { const k = cl((t - S.sqAt) / (0.4 * T), 0, 1), side = Math.max(...S.pt.map(q => q.gw), p.sd * U); c.save(); c.globalAlpha = 0.42 * k; c.fillStyle = '#3a1a0c'; c.beginPath(); c.roundRect(24, GY - side - 14, 312, side + 28, 16); c.fill(); c.restore(); }
    // deviation bars in lanes under the log, then in the air as squares
    for (const q of S.pt) {
      const col = q.d < 0 ? NEG : POS, x0 = Math.min(S.xm, q.x), w = Math.abs(q.d) * LU;
      const gk = q.grow ? E((t - q.grow.t0) / q.grow.dur) : 0; if (!q.grow || t < q.grow.t0) continue;
      const fk = q.fly ? cl((t - q.fly.t0) / q.fly.dur, 0, 1) : 0, uk = q.up ? E((t - q.up.t0) / q.up.dur) : 0, fa = q.fade != null ? 1 - cl((t - q.fade) / (0.2 * T), 0, 1) : 1;
      let bx, by, bw;
      if (fk <= 0) { bw = w * gk; bx = q.d < 0 ? S.xm - bw : S.xm; by = q.lane; }
      else { const e = E(fk); bx = M.lerp(x0, q.gl, e); bw = M.lerp(w, Math.abs(q.d) * U, e); by = M.lerp(q.lane, GY, e) - Math.sin(e * Math.PI) * 40; }
      c.save();
      if (fk <= 0 && q.d) { c.strokeStyle = 'rgba(255,240,210,0.45)'; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(q.x, q.ay + 10); c.lineTo(q.x, q.lane); c.stroke(); c.setLineDash([]); }
      if (q.fade == null || fa > 0) {
        if (uk > 0 && q.d) cells(c, bx, by, bw, bw * uk, CELL, fa);
        else if (q.d) { c.globalAlpha = fa; c.fillStyle = col; c.strokeStyle = 'rgba(40,20,10,0.4)'; c.lineWidth = 1.2; c.beginPath(); c.roundRect(bx, by - 4, Math.max(2, bw), 8, 3); c.fill(); c.stroke(); }
        else { c.globalAlpha = fa; c.fillStyle = '#fff4d0'; c.beginPath(); c.arc(fk > 0 ? bx + 4 : S.xm, by, 3, 0, 7); c.fill(); }
        // the tiny number: at the bar's end, then above its square
        if (q.labAt) { const s = fk > 0 ? (Math.abs(q.d) * U >= 40 ? 24 : 18) : 20, mm = M.lay(q.lab, s); let lx, ly;
          if (fk <= 0) { lx = q.d < 0 ? bx - mm.w / 2 - 6 : q.d > 0 ? bx + bw + mm.w / 2 + 6 : S.xm + 14; ly = q.lane; }
          else if (q.d) { lx = bx + bw / 2; ly = uk > 0.5 ? by - bw * uk / 2 : by - 14; } else { lx = bx + 4; ly = by - 14; }
          c.globalAlpha = fa * cl((t - q.labAt) / 0.2, 0, 1); const inSq = fk > 0 && q.d && uk > 0.5; c.shadowColor = inSq ? 'rgba(255,240,200,0.9)' : 'rgba(0,0,0,0.6)'; c.shadowBlur = 5; M.draw(c, q.lab, lx - mm.w / 2, ly + (mm.a - mm.d) / 2, s, { t, col: inSq ? EDGE : '#fffbe8' }); c.shadowBlur = 0; }
      }
      c.restore();
    }
    // the unit cells flying into the fair squares
    if (S.cells) { for (const cl0 of S.cells) { const k = cl((t - cl0.t0) / cl0.dur, 0, 1), e = E(k), tx = S.fairX(cl0.f) + cl0.cc * U, ty = GY - cl0.r * U;
      const x = M.lerp(cl0.x, tx, e), y = M.lerp(cl0.y, ty, e) - Math.sin(e * Math.PI) * 50;
      c.save(); c.fillStyle = CELL; c.fillRect(x + 0.5, y - U + 0.5, U - 1, U - 1); c.strokeStyle = EDGE; c.lineWidth = 1.5; c.strokeRect(x + 0.5, y - U + 0.5, U - 1, U - 1); c.restore(); }
      if (S.fair) for (let f = 0; f < n; f++) { const x = S.fairX(f), w = p.sd * U, glow = S.rootAt && f === S.rootF; c.save(); c.strokeStyle = glow ? GOLD : EDGE; c.lineWidth = glow ? 3 : 2; c.globalAlpha = S.gk; if (glow) { c.shadowColor = GOLD; c.shadowBlur = 10; } c.strokeRect(x, GY - w, w, w); c.restore();
        if (S.fairA) { const k = cl((t - S.fairA - f * 0.05) / 0.25, 0, 1), nd = M.num(p.vr), s = w >= 40 ? 24 : 18, mm = M.lay(nd, s); c.save(); c.globalAlpha = k; c.shadowColor = '#fff4d0'; c.shadowBlur = 6; M.draw(c, nd, x + w / 2 - mm.w / 2, GY - w / 2 + (mm.a - mm.d) / 2, s * (1 + 0.3 * Math.sin(k * Math.PI)), { t, col: EDGE }); c.restore(); } }
      // the side of the chosen square is measured
      if (S.side) { const k = E((t - S.side.t0) / S.side.dur), x = S.fairX(S.rootF), w = p.sd * U, y = GY + 9; c.save(); c.strokeStyle = GOLD; c.lineWidth = 2.5; c.shadowColor = GOLD; c.shadowBlur = 8; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x, y + 4); c.moveTo(x, y); c.lineTo(x + w * k, y); c.stroke(); if (k >= 1) { c.beginPath(); c.moveTo(x + w, y - 4); c.lineTo(x + w, y + 4); c.stroke(); } c.restore(); }
    }
    // acorns on the log
    for (const q of S.pt) { const hk = t - q.hop, hop = hk > 0 && hk < 0.3 ? Math.sin(hk / 0.3 * Math.PI) * 9 : 0, red = K.missInfo && K.missInfo.tap === 'a' + q.i && t - K.missAt < 0.5, sh = red ? Math.sin((t - K.missAt) * 50) * 3 : 0;
      acorn(c, q.x + sh, q.ay - hop + Math.sin(t * 2 + q.phase) * 0.6, 9, { red }); }
    // the hedgehog host
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.ex : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', 316, 632 - hopK * 18, 0.95, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'hedgehog', 316, 632, 0.95);
    M.drawEx(g, c, 'top');
    // working notes sit on a soft dark pill that grows with the pen
    for (const key of ['note', 'root']) { const e = K.ex[key]; if (!e) continue; const m = M.lay(e.node, e.s), wr = e.node.write, wk = wr ? M.easeIO((t - wr.t0) / wr.dur) : 1;
      if (wk > 0) { c.save(); c.globalAlpha = (e.node.alpha ?? 1) * 0.5; c.fillStyle = 'rgba(50,25,15,0.9)'; c.beginPath(); c.roundRect(e.x - 10, e.y - m.a - 6, (m.w + 20) * wk, m.a + m.d + 12, 12); c.fill(); c.restore(); }
      M.drawEx(g, c, key); }
    // a dragged square follows the finger
    const P0 = K.press; if (P0 && P0.dragging) { const q = S.pt.find(z => 'q' + z.i === P0.id); if (q) cells(c, P0.x - q.gw / 2, P0.y - 10 + q.gw / 2, q.gw, q.gw, CELL); }
    M.drawUI(g, c);
  },
});
