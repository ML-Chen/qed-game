// longway_areamodel.js — AREA MODEL! Multiply a big number by one digit by breaking it into hundreds, tens and ones:
// 7 × 346 = 7 × 300 + 7 × 40 + 7 × 6 = 2100 + 280 + 42 = 2422.
// A brick alley in the late afternoon, with a fox painter. On a hanging shop sign: 7 × 346 = ?. On the wall below, a
// primed mural frame (the rectangle). Every move's working plays by itself (show your work):
//   1. drag 346 onto the frame: it flies onto the top edge and breaks apart, digit by digit, into 300 | 40 | 6 (the zeros
//      write themselves in), dividers draw down the frame making one panel per part, and the 7 drops down the left edge.
//   2. drag the 7 onto any panel (or its label), in any order: the 7 and the part are circled, a 7 flies into the panel,
//      the fox's roller paints the panel, "7 × 300 = 2100" writes itself under it and 2100 appears on the paint.
//   3. drag one panel's product onto another: every product glows in turn, "2100 + 280 + 42 = 2422" writes itself under
//      the frame, the products slide together into 2422 in the middle of the mural, and 2422 flies up into the ?.
// Level 0: 3–6 × a two-digit number (two panels). Level 1: 3–5 × 1xx–3xx. Level 2: 6–9 × 2xx–4xx.
// Medium mode: the tray asks for each panel's product and for the total.
const M = MK, INK = '#2a1a2a', EY = 206, X0 = 48, X1 = 330, TOP = 300, BOT = 446, FX = 300, FY = 610;
const PAINT = ['#ff8a6a', '#ffd25a', '#7ac8f0'], PDARK = ['#a8402a', '#a87a10', '#2a6a98'];
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  if (L === 0) return { a: ri(3, 6), n: ri(2, 4) * 10 + ri(1, 9) };
  if (L === 1) return { a: ri(3, 5), n: ri(1, 3) * 100 + ri(1, 9) * 10 + ri(1, 9) };
  return { a: ri(6, 9), n: ri(2, 4) * 100 + ri(1, 9) * 10 + ri(1, 9) };
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the alley (baked) ----------------
function alley(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 260); sk.addColorStop(0, '#5a8ac8'); sk.addColorStop(0.55, '#f0b88a'); sk.addColorStop(1, '#ffd8a0'); c.fillStyle = sk; c.fillRect(0, 0, W, 260);
  // rooftops and a water tower against the sky
  c.fillStyle = '#7a5a6a'; c.fillRect(0, 150, 70, 110); c.fillRect(280, 170, 80, 90); c.fillStyle = '#6a4a5a'; c.beginPath(); c.moveTo(0, 150); c.lineTo(35, 128); c.lineTo(70, 150); c.fill();
  c.fillStyle = '#5a3a4a'; c.fillRect(300, 120, 34, 30); c.fillRect(304, 150, 3, 22); c.fillRect(327, 150, 3, 22); c.beginPath(); c.moveTo(296, 120); c.lineTo(317, 104); c.lineTo(338, 120); c.fill();
  c.fillStyle = 'rgba(255,230,160,0.8)'; for (const [x, y] of [[14, 170], [44, 196], [296, 186], [326, 214]]) c.fillRect(x, y, 10, 13);
  // the brick wall
  c.fillStyle = '#b8604a'; c.fillRect(0, 248, W, 300);
  for (let r = 0; r < 22; r++) { const y = 248 + r * 14; for (let x = (r % 2) * -16; x < W; x += 32) { const h = (Math.sin(x * 12.9 + r * 78.2) * 43758.5) % 1; c.fillStyle = ['#c86a50', '#b0563e', '#d0785a', '#a85040'][Math.floor(Math.abs(h) * 4)]; c.fillRect(x + 1, y + 1, 30, 12); } }
  const sh = c.createLinearGradient(0, 248, 0, 300); sh.addColorStop(0, 'rgba(40,10,20,0.35)'); sh.addColorStop(1, 'rgba(40,10,20,0)'); c.fillStyle = sh; c.fillRect(0, 248, W, 52);
  const sun = c.createLinearGradient(0, 0, W, 0); sun.addColorStop(0, 'rgba(255,210,140,0.25)'); sun.addColorStop(1, 'rgba(60,20,60,0.2)'); c.fillStyle = sun; c.fillRect(0, 248, W, 300);
  // the pavement
  const pv = c.createLinearGradient(0, 540, 0, H); pv.addColorStop(0, '#8a8090'); pv.addColorStop(1, '#5a5068'); c.fillStyle = pv; c.fillRect(0, 540, W, 100);
  c.strokeStyle = 'rgba(40,30,50,0.35)'; c.lineWidth = 2; for (let x = -20; x < W; x += 60) { c.beginPath(); c.moveTo(x, 640); c.lineTo(x + 30, 540); c.stroke(); } c.beginPath(); c.moveTo(0, 584); c.lineTo(W, 584); c.stroke();
  c.fillStyle = '#4a3a4a'; c.fillRect(0, 536, W, 6);
  // paint cans by the wall
  for (const [x, col] of [[34, PAINT[0]], [74, PAINT[1]], [112, PAINT[2]]]) { c.fillStyle = '#c8ccd8'; c.fillRect(x - 15, 560, 30, 34); c.fillStyle = '#8a90a0'; c.fillRect(x - 15, 560, 30, 4); c.fillStyle = col; c.beginPath(); c.ellipse(x, 560, 15, 5, 0, 0, 7); c.fill(); c.fillRect(x - 15, 563, 8, 14); c.strokeStyle = '#6a7080'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, 556, 13, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
}

MG.add({
  id: 'longway_areamodel', stage: 'longway', cmd: 'AREA MODEL!', hint: 'drag', time: 10, mood: 'bright', winText: 'Painted!', hold: 1.7,
  card: {
    title: 'The area model', ref: 'Grade 4', kind: 'Multiplication',
    text: 'To multiply a big number like 346 by 7, picture a rectangle 7 tall and 346 wide. Its area is 7 × 346.\n\nCut the width into hundreds, tens and ones: 346 = 300 + 40 + 6. Now there are three easy rectangles: 7 × 300 = 2100, 7 × 40 = 280 and 7 × 6 = 42. Watch the place value: 7 × 3 hundreds is 21 hundreds, which is 2100.\n\nThe three parts fill the whole rectangle, so add them: 2100 + 280 + 42 = 2422. So 7 × 346 = 2422.',
    note: 'Split the big number by place value, multiply each part, then add the parts.',
    ask: 'Use an area model: what is 4 × 213? What is 6 × 57?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, n } = S;
    const ds = String(n).split('').map(Number); S.parts = ds.map((d, i) => d * Math.pow(10, ds.length - 1 - i)); S.np = ds.length; S.ds = ds;
    const wts = S.np === 3 ? [0.46, 0.31, 0.23] : [0.6, 0.4]; S.edges = [X0]; let x = X0; for (const w of wts) { x += w * (X1 - X0); S.edges.push(x); }
    S.pc = i => (S.edges[i] + S.edges[i + 1]) / 2; S.pw = i => S.edges[i + 1] - S.edges[i];
    S.paint = []; S.prod = []; S.split = null; S.join = 0; S.face = 'happy';
    S.A = M.num(a, 'A'); S.N = M.num(n, 'N'); S.Q = M.slot('ans', { col: '#6a5a7a' });
    S.row = M.row(S.A, M.op('×', 'X'), S.N, M.op('=', 'eq'), S.Q); M.place(g, 'ex', S.row, 180, EY, 38, { col: '#fff4e0' }); M.inert(g, ['X', 'eq', 'res']);
    M.zone(g, 'box', { x: (X0 + X1) / 2, y: (TOP + BOT) / 2, w: X1 - X0, h: BOT - TOP });
    g.dur *= (2.6 + 1.05 * (S.np + 2)) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };

    // 1. break the number apart by place value
    const breakUp = g => {
      const T = M.pace(g); S.broken = true; M.show(g, 1.35 * T); hop(g, 'wow'); S.point = true; S.mk.zones.box = false; g.sfx('swoosh');
      const fb = { ...M.box(g, 'N') }; M.indicate(g, S.N, { dur: 0.4 * T, sc: 1.2 });
      M.fly(g, { node: M.num(n, null, { col: '#fff4e0' }), from: [fb.x, fb.y], to: [180, TOP - 22], dur: 0.4 * T, arc: -30, s0: 38, s1: 30,
        then(g) { g.sfx('crunch', { vol: 0.5 }); S.split = { t0: g.t, dur: 0.45 * T };
          S.hn = S.ds.map((d, i) => { const zs = S.np - 1 - i, nd = zs ? M.row(M.num(d), M.num('0'.repeat(zs), null, { alpha: 0 })) : M.row(M.num(d)); nd.id = 'h' + i; return nd; });
          S.hn.forEach((nd, i) => { if (nd.items[1]) { nd.items[1].alpha = 1; M.writeIn(g, nd.items[1], { delay: 0.25 * T, dur: 0.3 * T }); } });
          M.at(g, [[0.3 * T, g => { g.burst(180, TOP - 22, ['#fff4e0', '#ffd25a'], 8, 90); hop(g); }]]); } });
      // the multiplier slides down the left edge
      const fa = { ...M.box(g, 'A') };
      M.at(g, [[0.75 * T, g => { M.fly(g, { node: M.num(a, null, { col: '#fff4e0' }), from: [fa.x, fa.y], to: [X0 - 24, (TOP + BOT) / 2], dur: 0.4 * T, arc: 30, s0: 38, s1: 34,
        then(g) { S.side = M.num(a, 's7', { _born: -1, pop: g.t }); M.place(g, 'side', S.side, X0 - 24, (TOP + BOT) / 2 + 12, 34, { col: '#fff4e0' }); M.sparkle(g, 's7', { n: 6 }); g.sfx('pop'); } }); }],
        [1.3 * T, g => { S.point = false; for (let i = 0; i < S.np; i++) M.zone(g, 'z' + i, { x: S.pc(i), y: (TOP + BOT) / 2, w: S.pw(i), h: BOT - TOP }); }]]);
    };
    // 2. multiply one panel
    const mulMove = i => {
      const T = M.pace(g), p = S.parts[i], v = a * p, d = S.ds[i];
      const wrong = p >= 10 ? [a * d, v * 10, a + p, a * d * (p >= 100 ? 10 : 100)] : [a + p, v + a, a * (p - 1)];
      return { drag: 's7', to: ['z' + i, 'h' + i], busy: 0.1, askAt: 0.8 * T, after: 0.95 * T, ask: { v, wrong: wrong.filter(w => w > 0 && w !== v) },
        then(g) { S.paint[i] = 'go'; M.show(g, 0.8 * T); hop(g, 'think'); S.point = true;
          M.circle(g, 's7', { dur: 0.45 * T, col: PAINT[i] }); M.circle(g, 'h' + i, { dur: 0.45 * T, col: PAINT[i], delay: 0.1 * T });
          const fs = { ...M.box(g, 's7') };
          M.fly(g, { node: M.num(a, null, { col: '#fff4e0' }), from: [fs.x, fs.y], to: [S.pc(i), (TOP + BOT) / 2], dur: 0.32 * T, arc: -36, s0: 34, s1: 30,
            then(g) { S.paint[i] = { t0: g.t, dur: 0.45 * T }; g.sfx('rustle', { vol: 0.6 }); hop(g); } }); },
        resolve(g) { M.show(g, 0.95 * T);
          M.note(g, { node: M.row(M.num(a), M.op('×'), M.num(p), M.op('='), M.num(v)), at: [S.pc(i), BOT + 30], s: 26, col: '#fff8ec', pill: 'rgba(40,16,30,0.82)', write: 0.32 * T, hold: 0.42 * T, fade: 0.2 * T });
          M.at(g, [[0.36 * T, g => { const q = M.num(v, 'q' + i, { alpha: 0 }); S.prod[i] = q; M.place(g, 'q' + i, q, S.pc(i), (TOP + BOT) / 2 + 10, v >= 1000 ? 30 : 32, { col: INK });
            q.alpha = 1; M.writeIn(g, q, { dur: 0.3 * T }); M.sparkle(g, 'q' + i, { delay: 0.3 * T, n: 8, cols: [PAINT[i], '#fff'] }); g.sfx('ding', { pitch: 0.9 + i * 0.15 }); }],
            [0.9 * T, g => { S.point = false; }]]); } };
    };
    // 3. add the panels
    const addMove = () => {
      const T = M.pace(g), sum = a * n, vs = S.parts.map(p => a * p);
      return { busy: 0.1, askAt: 0.65 * T, after: 1.5 * T, ask: { v: sum, wrong: [sum + 100, sum - 10, sum + 10, vs.reduce((s, v) => s + v, 0) - vs[0] + a * S.ds[0]].filter(w => w > 0 && w !== sum) },
        then(g) { S.adding = true; M.show(g, 0.65 * T); hop(g, 'wow'); S.point = true; g.sfx('swoosh');
          S.prod.forEach((q, i) => { M.indicate(g, q, { delay: i * 0.15 * T, dur: 0.35 * T, sc: 1.3, col: '#fff6c0' }); M.circle(g, q, { delay: i * 0.15 * T, dur: 0.45 * T, col: '#fff6c0' }); }); },
        resolve(g) { M.show(g, 1.5 * T); const items = [];
          vs.forEach((v, i) => { if (i) items.push(M.op('+')); items.push(M.num(v, null, { col: PAINT[i] })); }); items.push(M.op('='), M.num(sum));
          M.note(g, { node: M.row(...items), at: [180, BOT + 30], s: S.np === 3 ? 24 : 27, col: '#fff8ec', pill: 'rgba(40,16,30,0.85)', write: 0.45 * T, hold: 0.55 * T, fade: 0.2 * T });
          M.at(g, [
            [0.5 * T, g => { M.tween(g, S, { join: 1 }, 0.35 * T); S.prod.forEach((q, i) => { M.tween(g, q, { dx: 180 - S.pc(i), sc: 0.6, alpha: 0 }, 0.32 * T); }); }],
            [0.8 * T, g => { S.total = { v: sum, t0: g.t }; g.sfx('coin'); hop(g); M.sparkle(g, [180, (TOP + BOT) / 2], { n: 12, cols: PAINT.concat('#fff') }); }],
            [1.05 * T, g => { M.fly(g, { node: M.num(sum, null, { col: '#fff4e0' }), from: [180, (TOP + BOT) / 2], to: 'ans', dur: 0.4 * T, arc: -50, s0: 46, s1: 38,
              then(g) { S.Q.fill = M.num(sum, 'res', { _born: -1, pop: g.t }); M.relayout(g, 'ex'); M.sparkle(g, 'ans', { n: 16, cols: PAINT.concat('#fff') }); g.sfx('sparkle'); hop(g, 'laugh'); S.point = false; } }); }],
          ]); } };
    };
    M.play(g, {
      moves(g) {
        if (!S.broken) return [{ drag: 'N', to: 'box', busy: 0.1, area: [X0 - 20, TOP - 50, X1 + 20, BOT + 20], then: breakUp }];
        if (!S.side) return [];
        const out = []; for (let i = 0; i < S.np; i++) if (!S.paint[i]) out.push(mulMove(i));
        if (out.length || S.adding || S.prod.filter(Boolean).length < S.np) return out;
        const am = addMove(), list = []; for (let i = S.np - 1; i >= 0; i--) for (let j = 0; j < S.np; j++) if (i !== j) list.push({ ...am, drag: 'q' + i, to: 'q' + j });
        return list;
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s, z = S.mk.zones || {}; for (let i = 0; i < S.np; i++) if (S.paint[i] && z['z' + i]) z['z' + i] = false; },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, T = M.pace(g), H = BOT - TOP;
    c.drawImage(g.bake('areamodel_alley', alley), 0, 0, 360, 640);
    // a few leaves drifting down the alley
    for (let i = 0; i < 6; i++) { const x = (i * 71 + t * 16 + Math.sin(t + i) * 20) % 380 - 10, y = (i * 113 + t * 26) % 640; c.save(); c.translate(x, y); c.rotate(t * 2 + i); c.fillStyle = ['#e8a040', '#c8603a', '#a8b040'][i % 3]; c.beginPath(); c.ellipse(0, 0, 5, 2.5, 0, 0, 7); c.fill(); c.restore(); }
    // the hanging shop sign with the problem
    c.save(); c.strokeStyle = '#3a2a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(70, 150); c.lineTo(70, EY - 36); c.moveTo(290, 150); c.lineTo(290, EY - 36); c.stroke();
    c.fillStyle = 'rgba(20,10,20,0.35)'; rr(c, 24, EY - 40 + 5, 312, 64, 12); c.fill(); c.fillStyle = '#2e3a5a'; rr(c, 22, EY - 40, 316, 64, 12); c.fill(); c.strokeStyle = '#d8b060'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(216,176,96,0.45)'; c.lineWidth = 1.5; rr(c, 29, EY - 33, 302, 50, 8); c.stroke(); c.restore();
    M.drawEx(g, c, 'ex');
    // the mural frame: primed white, with a shadow; painted panels fill as the roller passes
    c.save(); c.fillStyle = 'rgba(40,10,20,0.35)'; c.fillRect(X0 - 4, TOP + 4, X1 - X0 + 12, H + 10);
    c.fillStyle = '#f6f0e4'; c.fillRect(X0, TOP, X1 - X0, H);
    for (let i = 0; i < S.np; i++) { const P0 = S.paint[i]; if (!P0 || P0 === 'go') continue; const k = M.easeIO((t - P0.t0) / P0.dur), x0 = S.edges[i], w = S.pw(i) * k;
      c.fillStyle = PAINT[i]; c.fillRect(x0, TOP, w, H); c.fillStyle = 'rgba(255,255,255,0.16)'; for (let y = TOP + 8; y < BOT; y += 16) c.fillRect(x0, y, w, 5);
      if (k < 1) { const rx = x0 + w; c.fillStyle = PDARK[i]; c.fillRect(rx - 6, TOP - 6, 14, H + 12); c.fillStyle = PAINT[i]; c.fillRect(rx - 4, TOP - 4, 10, H + 8); c.strokeStyle = '#3a2a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(rx + 1, BOT + 6); c.lineTo(rx + 12, BOT + 30); c.lineTo(rx + 30, BOT + 70); c.stroke(); } }
    c.strokeStyle = '#6a4a3a'; c.lineWidth = 4; c.strokeRect(X0, TOP, X1 - X0, H);
    // the dividers draw themselves down the frame, and fade when the panels are added back together
    if (S.split) { const k = M.easeIO((t - S.split.t0 - 0.15 * T) / (0.35 * T)); c.strokeStyle = `rgba(90,60,50,${1 - S.join})`; c.lineWidth = 3; c.setLineDash([8, 5]);
      for (let i = 1; i < S.np; i++) { c.beginPath(); c.moveTo(S.edges[i], TOP); c.lineTo(S.edges[i], TOP + H * k); c.stroke(); } c.setLineDash([]); }
    c.restore();
    // the part labels above the panels: the digits of the number slide apart to their panels
    if (S.split && S.hn) { const k = M.easeIO((t - S.split.t0) / S.split.dur);
      S.hn.forEach((nd, i) => { const x0 = 180 + (i - (S.np - 1) / 2) * 18, x = M.lerp(x0, S.pc(i), k);
        M.place(g, 'h' + i, nd, x, TOP - 12, 28, { col: '#fff4e0', still: true });
        const b = M.box(g, 'h' + i); if (k > 0.6 && b) { c.save(); c.globalAlpha = (k - 0.6) / 0.4; c.fillStyle = 'rgba(40,16,30,0.6)'; rr(c, b.x - b.w / 2 - 8, b.y - b.h / 2 - 4, b.w + 16, b.h + 8, 9); c.fill(); c.restore(); }
        M.drawEx(g, c, 'h' + i); }); }
    // the multiplier down the left edge, with a bracket
    if (S.side) { c.save(); c.strokeStyle = '#fff4e0'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X0 - 8, TOP + 2); c.lineTo(X0 - 12, TOP + 2); c.lineTo(X0 - 12, BOT - 2); c.lineTo(X0 - 8, BOT - 2); c.stroke();
      const b = M.box(g, 's7'); if (b) { c.fillStyle = 'rgba(40,16,30,0.7)'; rr(c, b.x - b.w / 2 - 7, b.y - b.h / 2 - 5, b.w + 14, b.h + 10, 9); c.fill(); } c.restore(); M.drawEx(g, c, 'side'); }
    for (let i = 0; i < S.np; i++) M.drawEx(g, c, 'q' + i);
    if (S.total && !S.total.gone) { const k = M.clamp((t - S.total.t0) / 0.3, 0, 1); c.save(); c.globalAlpha = k; c.font = M.NUMF(46 * (1 + Math.sin(k * Math.PI) * 0.3), 700); c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 7; c.lineJoin = 'round'; c.strokeStyle = '#2a1a2a'; c.strokeText(String(S.total.v), 180, (TOP + BOT) / 2 + 2); c.fillStyle = '#fffdf4'; c.fillText(String(S.total.v), 180, (TOP + BOT) / 2 + 2); c.restore(); }
    // the fox painter: points at the wall while the work is shown, hops when a panel is painted
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missK = K.missAt >= 0 && t - K.missAt < 0.5;
    const expr = won ? 'laugh' : lost || missK ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', FX + (missK ? Math.sin((t - K.missAt) * 40) * 3 : 0), FY - hopK * 20, 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', FX, FY, 1.2);
    M.drawUI(g, c);
  },
});
