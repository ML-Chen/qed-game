// powers_sqrt.js — SQUARE ROOT! √49 = 7: 49 tiles make a square whose side is 7 tiles long.
// A sunny courtyard at noon. The problem is painted on a blue-and-white ceramic plaque ("√49 = ?"), and a heap of 49
// glazed tiles lies on the floor under a bare stretch of wall. The turtle is tiling a mosaic. Every move's working
// plays by itself (show your work; the fuse stands still meanwhile):
//   1. Drag the 49 onto the heap (or tap the 49 or the heap): the tiles hop up from the heap one row at a time and lay
//      themselves into a square on the wall, row after row, until all 49 are in: 7 rows of 7.
//   2. Tap the side of the square (or the ? slot): the tiles along the bottom light up one by one and are counted, 1, 2,
//      ... 7, and the left side lights up with them. The last count flies into the slot (√49 = 7), and the check
//      "7 × 7 = 49" writes itself over the square.
// The classic mistake, halving (49 ÷ 2), is acted out when the slot is tapped too early: a red "49 ÷ 2" writes itself
// and is crossed out. Tapping the inside of the square instead of its side is a miss too (that is the area, 49).
// Level 0: 9, 16 or 25 tiles. Level 1: 36, 49 or 64. Level 2: 81 to 144. Medium mode: the count is picked from the tray.
const M = MK;
const EY = 252, ES = 50, INK = '#1d3a8a', CX = 180, CY = 412, SIDE = 160, FLOOR = 498, HX = 306, HY = 618;
const GLAZE = ['#2a5ab8', '#2f68c8', '#2552a8'], LITC = '#ffd23a';

// a glazed tile centred at (x, y), size s, turned by rot; lit (0..1) warms it to gold; bad tints it red
function tile(c, x, y, s, rot, col, lit, bad) {
  c.save(); c.translate(x, y); if (rot) c.rotate(rot); const h = s / 2 - 1;
  c.fillStyle = 'rgba(40,30,20,0.25)'; c.fillRect(-h + 1.5, -h + 2, h * 2, h * 2);
  let base = bad ? '#d84a4a' : col; if (lit > 0.01) base = P.mix(base, '#ffc21a', lit * 0.9);
  const gr = c.createLinearGradient(-h, -h, h, h); gr.addColorStop(0, P.shade(base, 0.25)); gr.addColorStop(1, P.shade(base, -0.15));
  c.fillStyle = gr; c.beginPath(); c.roundRect(-h, -h, h * 2, h * 2, Math.max(1.5, s * 0.12)); c.fill();
  // a white quatrefoil in the middle
  if (s > 10) { c.fillStyle = 'rgba(255,255,255,0.85)'; const r = s * 0.13; for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { c.beginPath(); c.arc(dx * r, dy * r, r, 0, 7); c.fill(); }
    c.fillStyle = bad ? '#ffd0c8' : '#ffd23a'; c.beginPath(); c.arc(0, 0, r * 0.7, 0, 7); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(-h + 2, -h + 2, h * 1.2, Math.max(1, s * 0.07));
  c.restore();
}
function pick(g) { const L = g.level, r = k => Math.floor(g.rand() * k); const n = L === 0 ? 3 + r(3) : L === 1 ? 6 + r(3) : 9 + r(4); return { n, a: n * n }; }

// the courtyard: blue sky over a white stucco wall with a tiled roof edge, bougainvillea, a lemon tree, terracotta floor
function courtyard(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 180); sk.addColorStop(0, '#3a98e8'); sk.addColorStop(1, '#a8dcff'); c.fillStyle = sk; c.fillRect(0, 0, W, 180);
  P.cloud(c, 60, 70, 0.55, '#ffffff', '#d8ecfa', 0.9); P.cloud(c, 250, 120, 0.4, '#ffffff', '#d8ecfa', 0.8);
  // the wall
  const wg = c.createLinearGradient(0, 160, 0, FLOOR); wg.addColorStop(0, '#fffaf0'); wg.addColorStop(1, '#f2e4cc'); c.fillStyle = wg; c.fillRect(0, 160, W, FLOOR - 160);
  const R = P.rng(21); c.fillStyle = 'rgba(200,170,130,0.12)'; for (let i = 0; i < 60; i++) { c.beginPath(); c.ellipse(R() * W, 170 + R() * 320, 6 + R() * 18, 3 + R() * 8, R() * 3, 0, 7); c.fill(); }
  // roof edge of curved terracotta tiles
  c.fillStyle = '#9a4a2a'; c.fillRect(0, 150, W, 14); for (let x = -6; x < W + 20; x += 20) { const gr = c.createLinearGradient(x, 0, x + 20, 0); gr.addColorStop(0, '#c8643a'); gr.addColorStop(0.5, '#e8865a'); gr.addColorStop(1, '#a8502e'); c.fillStyle = gr; c.beginPath(); c.roundRect(x, 140, 18, 26, 9); c.fill(); }
  c.fillStyle = 'rgba(80,40,20,0.18)'; c.fillRect(0, 166, W, 10);
  // the mosaic's frame: a faint mortar bed where the tiles will go
  c.fillStyle = 'rgba(190,170,140,0.25)'; c.fillRect(CX - SIDE / 2 - 8, CY - SIDE / 2 - 8, SIDE + 16, SIDE + 16);
  c.strokeStyle = 'rgba(160,130,100,0.35)'; c.lineWidth = 1.5; c.setLineDash([5, 5]); c.strokeRect(CX - SIDE / 2 - 8, CY - SIDE / 2 - 8, SIDE + 16, SIDE + 16); c.setLineDash([]);
  // bougainvillea spilling over the wall at the top left and right
  for (const [bx, by, n] of [[20, 180, 34], [342, 176, 22]]) { const r = P.rng(bx + 3); c.fillStyle = '#4a8a3a'; for (let i = 0; i < n * 0.6; i++) { c.beginPath(); c.ellipse(bx + (r() - 0.5) * 70, by + r() * r() * 130, 6, 3.5, r() * 3, 0, 7); c.fill(); }
    for (let i = 0; i < n; i++) { c.fillStyle = ['#e0287a', '#f0489a', '#c81e6a'][i % 3]; const x = bx + (r() - 0.5) * 66, y = by + r() * r() * 120; c.beginPath(); c.arc(x, y, 3 + r() * 3, 0, 7); c.fill(); } }
  // floor: terracotta tiles in perspective
  const fg = c.createLinearGradient(0, FLOOR, 0, H); fg.addColorStop(0, '#d8885a'); fg.addColorStop(1, '#b8663e'); c.fillStyle = fg; c.fillRect(0, FLOOR, W, H - FLOOR);
  c.strokeStyle = 'rgba(120,50,30,0.35)'; c.lineWidth = 1.2; for (let k = 0; k < 6; k++) { const y = FLOOR + 6 + k * k * 4.4 + k * 8; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  for (let i = -10; i <= 10; i++) { c.beginPath(); c.moveTo(CX + i * 30, FLOOR); c.lineTo(CX + i * 62, H); c.stroke(); }
  c.fillStyle = 'rgba(80,30,20,0.2)'; c.fillRect(0, FLOOR, W, 5);
  // a lemon tree in a pot at the left, a pot of geraniums at the right
  c.fillStyle = 'rgba(60,30,20,0.25)'; c.beginPath(); c.ellipse(34, 628, 30, 6, 0, 0, 7); c.fill();
  c.fillStyle = '#6a4a2a'; c.fillRect(31, 520, 5, 80); c.fillStyle = '#3e7a34'; for (let i = 0; i < 26; i++) { const r = P.rng(i + 40); c.beginPath(); c.ellipse(34 + (r() - 0.5) * 66, 520 + (r() - 0.5) * 52, 8, 4.5, r() * 3, 0, 7); c.fill(); }
  c.fillStyle = '#f6d23a'; for (const [x, y] of [[18, 508], [52, 520], [30, 540], [58, 500], [12, 532]]) { c.beginPath(); c.ellipse(x, y, 5, 4, 0.4, 0, 7); c.fill(); }
  const pot = (x, y, w, h) => { const pg = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); pg.addColorStop(0, '#a8502e'); pg.addColorStop(0.4, '#e0804e'); pg.addColorStop(1, '#8a3e22'); c.fillStyle = pg; c.beginPath(); c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.36, y); c.lineTo(x - w * 0.36, y); c.closePath(); c.fill(); c.fillStyle = '#c86a3e'; c.fillRect(x - w / 2 - 3, y - h - 6, w + 6, 8); };
  pot(34, 628, 44, 34);
}

MG.add({
  id: 'sqroot', stage: 'powers', cmd: 'SQUARE ROOT!', hint: 'drag', time: 9, winText: 'Rooted!', hold: 1.8,
  card: {
    title: 'Square roots', ref: 'Grade 8', kind: 'Exponents',
    text: 'Squaring a number multiplies it by itself: 7² = 7 × 7 = 49. The square root goes the other way. √49 asks: which number times itself makes 49?\n\nYou can see it with tiles. Lay 49 tiles out as a perfect square. Each side is 7 tiles long, because 7 rows of 7 tiles make 49. So √49 = 7.\n\nThat is where the name comes from: the root is the length of the side of the square.\n\nThe root is not half the number. Half of 49 is 24.5, and 24.5 × 24.5 is far more than 49.',
    note: '√n is the number that times itself makes n: the side of a square made of n tiles. √49 = 7 because 7 × 7 = 49.',
    ask: 'What is √64? What is √144?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { n, a } = S, T = M.pace(g);
    S.slot = M.slot('ans'); S.rad = M.gap(34); S.rad.id = 'rad'; S.num = M.num(a, 'sq');
    S.ex = M.row(S.rad, S.num, M.op('=', 'eq'), S.slot);
    S.relay = () => M.place(g, 'ex', S.ex, CX, EY, ES, { col: INK }); S.relay();
    M.inert(g, ['rad', 'eq', 'chk']);
    // the tiles: each one lies somewhere in the heap on the floor, and has its place in the square
    const ts = SIDE / n, R = P.rng(7 + a); S.ts = ts; S.hs = Math.min(ts, 22); S.tiles = [];
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
      const u = R(), v = R(), w = 210 * (1 - 0.5 * v);
      S.tiles.push({ r, q, hx: CX - 18 + (u - 0.5) * w, hy: FLOOR + 40 - v * 38 - ts * 0.3, hr: (R() - 0.5) * 1.4, gx: CX - SIDE / 2 + (q + 0.5) * ts, gy: CY - SIDE / 2 + (r + 0.5) * ts, col: GLAZE[(r + q) % 3], t0: null, dur: 0, lit: 0 });
    }
    S.tiles.sort((p, q) => q.hy - p.hy); // the heap is drawn back to front
    M.zone(g, 'pile', { x: CX - 18, y: FLOOR + 18, w: 230, h: 70 });
    S.labels = [];
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 2) / 8;
    // 1. lay the tiles into a square, bottom row first, row by row
    const build = {
      busy: 0.1,
      then(g) {
        S.built = true; S.pose = 'carry'; hop('wow'); g.sfx('swoosh');
        M.indicate(g, 'sq', { dur: 0.4 * T, col: '#ffb21f' });
        const rowGap = Math.min(0.13, 0.95 / n) * T, fly = 0.3 * T, rows = [...Array(n)].map((_, i) => n - 1 - i);
        rows.forEach((r, k) => { const start = 0.18 * T + k * rowGap;
          S.tiles.filter(t => t.r === r).forEach(t => { t.t0 = g.t + start + t.q * rowGap * 0.12; t.dur = fly; });
          M.at(g, [[start + fly, g => { g.sfx(k % 2 ? 'tap' : 'click'); }]]); });
        const end = 0.18 * T + (n - 1) * rowGap + rowGap * 0.12 * (n - 1) + fly;
        M.show(g, end + 0.12 * T);
        M.at(g, [[end, g => { S.pose = null; hop('laugh'); g.sfx('ding'); g.burst(CX, CY, ['#ffd23a', '#fff', '#7ab0ff'], 16, 160);
          M.zone(g, 'sideB', { x: CX, y: CY + SIDE / 2 + 12, w: SIDE + 14, h: 34 }); M.zone(g, 'sideL', { x: CX - SIDE / 2 - 12, y: CY, w: 34, h: SIDE + 14 });
          M.zone(g, 'pile', { x: CX, y: CY, w: SIDE - 20, h: SIDE - 20 }); }]]);
      },
    };
    // 2. count the side
    const step = Math.min(0.12, 0.85 / n) * T, askAt = 0.12 * T + n * step + 0.1 * T, after = 1.1 * T;
    const count = {
      busy: 0.1, askAt, after, ask: { v: n, wrong: [a / 2, n + 1, n - 1, 2 * n].filter(w => w > 0 && w !== n) },
      then(g) {
        S.counted = true; S.point = true; hop('think'); M.show(g, askAt);
        M.anim(g, { dur: 0.5 * T, draw(c, g, k) { c.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3; c.strokeStyle = LITC; c.shadowColor = LITC; c.shadowBlur = 12; c.lineWidth = 4; c.lineCap = 'round';
          const x0 = CX - SIDE / 2, y0 = CY + SIDE / 2 + 5, e = M.easeIO(Math.min(1, k / 0.6)); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + SIDE * e, y0); c.moveTo(x0 - 5, CY + SIDE / 2); c.lineTo(x0 - 5, CY + SIDE / 2 - SIDE * e); c.stroke(); } });
        for (let i = 0; i < n; i++) M.at(g, [[0.12 * T + i * step, g => {
          for (const t of S.tiles) if ((t.r === n - 1 && t.q === i) || (t.q === 0 && t.r === n - 1 - i)) { t.lit = 1; t.litAt = g.t; }
          S.labels.push({ v: i + 1, x: CX - SIDE / 2 + (i + 0.5) * ts, t0: g.t }); g.sfx('tap', { pitch: 1 + i * 0.05 }); }]]);
        if (g.mode === 'medium') M.at(g, [[askAt - 0.05, g => { hop('think'); }]]);
      },
      resolve(g) {
        M.show(g, after); hop('wow'); const last = S.labels[S.labels.length - 1];
        if (last) last.big = g.t;
        M.at(g, [
          // the last count flies up into the slot
          [0.2 * T, g => { const lx = CX - SIDE / 2 + (n - 0.5) * ts, ly = CY + SIDE / 2 + 22;             M.fly(g, { node: M.num(n, null, { col: '#c8641a' }), from: [lx, ly], to: 'ans', dur: 0.4 * T, arc: -70, s0: 22, s1: ES,
              then(g) { S.slot.fill = M.num(n, 'root', { col: INK }); S.relay(); S.slot.fill.pop = g.t; M.sparkle(g, 'root', { n: 12 }); g.sfx('coin'); hop('laugh'); } }); }],
          // the check: 7 × 7 = 49 writes itself over the square
          [0.62 * T, g => { S.chk = M.row(M.num(n), M.op('×'), M.num(n), M.op('='), M.num(a)); M.place(g, 'chk', S.chk, CX, CY - SIDE / 2 - 14, 27, { col: '#c8641a' }); M.writeIn(g, S.chk, { dur: 0.32 * T });
            M.indicate(g, 'sq', { delay: 0.3 * T, dur: 0.35 * T, col: '#ffb21f' }); S.point = false; }],
        ]);
      },
    };
    M.play(g, {
      moves(g) {
        if (!S.built) return [{ ...build, drag: 'sq', to: 'pile' }, { ...build, tap: 'sq' }, { ...build, tap: 'pile' }];
        if (!S.counted) return [{ ...count, tap: 'sideB' }, { ...count, tap: 'sideL' }, { ...count, tap: 'ans' }];
        return [];
      },
      area(g) { return !S.built ? ['sq', 'pile'] : !S.counted ? ['sideB', 'sideL'] : null; },
      onWin(g) { if (S.slot.fill) { S.slot.fill.mark = 'good'; S.slot.fill.pop = g.t; } },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; const id = K.missInfo && (K.missInfo.tap || K.missInfo.to);
      // halving instead of rooting, acted out in red and crossed out
      if (id === 'ans' || id === 'sq') { const nd = M.row(M.num(S.a), M.op('÷'), M.num(2)); nd.strike = { t0: g.t + 0.32, dur: 0.2, col: '#ff3a2a' };
        M.note(g, { node: nd, at: 'ans', off: [0, 52], s: 24, col: '#d8303a', write: 0.25, hold: 0.4, fade: 0.25 }); }
      if (id === 'pile' && S.built) S.badAt = g.t; }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, ts = S.ts;
    c.drawImage(g.bake('powers_sqrt_court', courtyard), 0, 0, W, H);
    // leaf shadows drifting over the wall, and a butterfly
    c.save(); c.fillStyle = 'rgba(90,110,60,0.08)'; for (let i = 0; i < 7; i++) { const x = (i * 61 + Math.sin(t * 0.4 + i) * 16) % 380 - 10, y = 190 + (i * 47) % 260 + Math.cos(t * 0.5 + i) * 8; c.beginPath(); c.ellipse(x, y, 22, 9, i + Math.sin(t * 0.3 + i) * 0.2, 0, 7); c.fill(); } c.restore();
    { const bx = 300 + Math.sin(t * 0.7) * 40, by = 330 + Math.sin(t * 1.3) * 30, f = Math.abs(Math.sin(t * 14)); c.save(); c.translate(bx, by); c.fillStyle = '#ff9a2a'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 5 * f, -2, 5 * f + 1, 6, s * 0.4, 0, 7); c.fill(); } c.fillStyle = '#3a2010'; c.fillRect(-1, -6, 2, 10); c.restore(); }
    // the plaque
    const pb = M.box(g, 'ex') || null;
    { const w = 268, h = 86, x = CX - w / 2, y = EY - 58; c.fillStyle = 'rgba(40,30,40,0.25)'; c.beginPath(); c.roundRect(x + 3, y + 6, w, h, 14); c.fill();
      c.fillStyle = '#fbfaf4'; c.beginPath(); c.roundRect(x, y, w, h, 14); c.fill(); c.strokeStyle = '#2a5ab8'; c.lineWidth = 5; c.beginPath(); c.roundRect(x + 5, y + 5, w - 10, h - 10, 10); c.stroke();
      c.fillStyle = '#2a5ab8'; for (const [px, py] of [[x + 14, y + 14], [x + w - 14, y + 14], [x + 14, y + h - 14], [x + w - 14, y + h - 14]]) { c.beginPath(); c.arc(px, py, 4, 0, 7); c.fill(); } }
    // the radical sign over the number
    const rb = M.box(g, 'rad'), nb = M.box(g, 'sq');
    if (rb && nb) { const top = nb.y - nb.h / 2 - 8, bot = nb.y + nb.h / 2 + 4, x0 = rb.x - rb.w / 2 + 2; c.save(); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(x0, nb.y + 2); c.lineTo(x0 + 8, nb.y - 4); c.lineTo(x0 + 18, bot); c.lineTo(rb.x + rb.w / 2 - 2, top); c.lineTo(nb.x + nb.w / 2 + 4, top); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'ex');
    // tiles: in the heap, on their way, or in the square
    const bad = S.badAt != null && t - S.badAt < 0.5, wob = bad ? Math.sin((t - S.badAt) * 50) * 2 : 0;
    const placed = [], moving = [];
    for (const q of S.tiles) { if (q.t0 == null || t < q.t0) { tile(c, q.hx, q.hy, S.hs, q.hr, q.col, 0, false); continue; } (t >= q.t0 + q.dur ? placed : moving).push(q); }
    for (const q of placed) { const lit = q.lit ? Math.max(0.7, 1 - (t - q.litAt) / 0.4 * 0.3) : 0, pk = q.litAt != null ? 1 + Math.sin(M.clamp((t - q.litAt) / 0.25, 0, 1) * Math.PI) * 0.18 : 1;
      tile(c, q.gx + wob, q.gy, ts * pk, 0, q.col, lit, bad);
      // a counted tile keeps a gold rim, so the counted side stays easy to see
      if (q.lit) { const h = ts * pk / 2 - 1; c.save(); c.strokeStyle = LITC; c.shadowColor = LITC; c.shadowBlur = 8; c.lineWidth = Math.max(2, ts * 0.09); c.beginPath(); c.roundRect(q.gx + wob - h, q.gy - h, h * 2, h * 2, ts * 0.12); c.stroke(); c.restore(); } }
    for (const q of moving) { const k = M.easeIO((t - q.t0) / q.dur), x = M.lerp(q.hx, q.gx, k), y = M.lerp(q.hy, q.gy, k) - Math.sin(k * Math.PI) * 40; tile(c, x, y, M.lerp(S.hs, ts, k) * (1 + Math.sin(k * Math.PI) * 0.25), q.hr * (1 - k), q.col, 0, false); }
    // the counts under the bottom row
    const fs = Math.min(22, ts * 0.85);
    for (const L of S.labels) { if (L.gone != null) continue; const k = M.clamp((t - L.t0) / 0.18, 0, 1), big = L.big != null ? 1 + Math.sin(M.clamp((t - L.big) / 0.3, 0, 1) * Math.PI) * 0.6 : 1;
      c.save(); c.globalAlpha = k; c.font = M.NUMF(fs * big, 700); c.textAlign = 'center'; c.fillStyle = '#7a2a10'; c.fillText(String(L.v), L.x, CY + SIDE / 2 + 12 + fs * 0.8 - (1 - k) * 6); c.restore(); }
    // the turtle, tiling
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : S.pose === 'carry' && M.showing(g) ? 'carry' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'turtle', HX, HY - hopK * 18, 1.25, { t, pose, expr, facing: -1, hold: pose === 'carry' ? cc => tile(cc, 0, -8, 22, Math.sin(t * 6) * 0.2, GLAZE[0], 0, false) : undefined });
    else SCN.host(g, c, 'turtle', HX, HY, 1.25);
    M.drawEx(g, c, 'chk');
    M.drawUI(g, c);
  },
});
