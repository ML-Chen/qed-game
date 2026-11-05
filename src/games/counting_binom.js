// counting_binom.js — BINOMIAL THM! Expand (x + b)ⁿ with a row of Pascal's triangle:
// (x + b)ⁿ = Σ C(n, k) xⁿ⁻ᵏ bᵏ. The problem hangs in a sunny bee garden; the triangle is a honeycomb.
// The answer line starts as its skeleton, ?xⁿ + ?xⁿ⁻¹ + ... + ?, and the honeycomb holds only its top cell, 1.
// Moves:
//   1. Tap the power n (or the top cell): the honeycomb builds itself row by row down to row n. Each inner cell is the
//      sum of the two above it: those two flash, a V of light joins them to the new cell, and its number pops in.
//      Row n then glows in the power's colour.
//   2. Drag row n onto the answer line: its numbers lift out of the cells one by one and drop onto the terms.
//   3. (when b ≠ 1, either order with 2) Drag the b out of the bracket onto the answer line: "×bᵏ" writes itself over
//      each term and flies into its coefficient, which rolls over to the product (3 × 4 = 12).
//   Once every coefficient is in, the 1 in front of xⁿ crosses itself out (1xⁿ is just xⁿ).
// Wrong moves (they only wobble): tapping the answer line or the x, dragging the wrong row (row n − 1 is the classic slip).
// Level 0: (x + 1)² or (x + 1)³. Level 1: (x + 1)⁴ or (x + 2)². Level 2: (x + 2)³, (x + 3)², (x + 2)⁴.
// Medium mode: the middle number of row n is picked from the tray while the honeycomb builds it.
const M = MK, INK = '#4a2610', HONEY = '#f6b632', POW = '#d2541c', BEE = '#2a62b8', HX = 300, HY = 600;
const TOPY = 246, ANSY = 318, TRIY = 374, DX = 44, DY = 33, HR = 19;
const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
function pick(g) {
  const L = g.level, R = a => a[Math.floor(g.rand() * a.length)];
  const [n, b] = R(L === 0 ? [[2, 1], [3, 1], [3, 1]] : L === 1 ? [[4, 1], [2, 2], [4, 1]] : [[3, 2], [2, 3], [4, 2]]);
  return { n, b };
}
const xp = p => p === 0 ? null : p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(p));
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
const cellXY = (r, k) => [180 + (k - r / 2) * DX, TRIY + r * DY];

MG.add({
  id: 'counting_binom', stage: 'counting', cmd: 'BINOMIAL THM!', hint: 'tap', time: 9, mood: 'bright', winText: 'Expanded!', hold: 1.6,
  card: {
    title: 'The binomial theorem', ref: 'Precalculus', kind: 'Algebra',
    text: 'To expand (x + 1)³ you could multiply (x + 1)(x + 1)(x + 1) out by hand. The binomial theorem is a shortcut.\n\nThe answer has one term for each power of x, from x³ down to 1. The numbers in front come from Pascal\'s triangle. Each row starts and ends with 1, and every other number is the sum of the two numbers above it. Row 3 is 1, 3, 3, 1, so (x + 1)³ = x³ + 3x² + 3x + 1.\n\nWhy? Each term picks x or 1 from each of the three brackets. There are 3 ways to pick x from two brackets, so 3x² appears.\n\nFor (x + 2)³, also multiply each term by a power of 2: x³ + 3·2x² + 3·4x + 8 = x³ + 6x² + 12x + 8.',
    note: '(x + b)ⁿ: take row n of Pascal\'s triangle as the numbers in front, multiply term k by bᵏ, and let the powers of x count down from n to 0.',
    ask: 'What is (x + 1)⁴? What is (x + 2)²?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { n, b } = S, T = M.pace(g);
    // the problem: (x + b)ⁿ
    S.nn = M.num(n, 'n', { col: POW }); S.bn = M.num(b, 'b', { col: b === 1 ? INK : BEE });
    S.top = M.row(M.sup(M.paren(M.row(M.vr('x', 'xv'), M.op('+', 'pl'), S.bn), 'par'), S.nn));
    M.place(g, 'top', S.top, 180, TOPY, 56, { col: INK });
    // the answer skeleton: one term per power of x, each with an empty coefficient
    S.terms = [...Array(n + 1)].map((_, k) => ({ k, slot: M.slot('s' + k, { col: POW, w: 22 }), x: xp(n - k), pas: false, pow: b === 1 }));
    S.ansS = n === 4 ? 28 : n === 3 ? 33 : 38;
    S.relay = () => { const items = [M.op('=', 'eq'), M.gap(6)]; S.terms.forEach((q, i) => { if (i) items.push(M.op('+', null)); if (!q.gone) items.push(q.coef || q.slot); if (q.x) items.push(q.x); });
      S.ans = M.row(...items); S.ans.id = 'ans'; M.place(g, 'ans', S.ans, 180, ANSY, S.ansS, { col: INK }); };
    S.relay();
    M.inert(g, ['eq', 'par', ...[...Array(n + 1)].map((_, k) => 'c' + k)]);
    // the honeycomb: only the top cell at first
    S.cells = [[{ v: 1, born: -1 }]]; S.built = 0;
    const zoneRows = () => { for (let r = 0; r <= S.built; r++) { const [x, y] = cellXY(r, r / 2); M.zone(g, 'row' + r, { x, y, w: r * DX + HR * 2 + 8, h: HR * 2 + 2 }); } };
    zoneRows(); S.zoneRows = zoneRows;
    g.dur *= (2.6 + 1.05 * (b === 1 ? 2 : 3)) / 8;
    const RT = 0.42; // seconds per row at level 0
    const buildRow = (g, r) => { const row = []; for (let k = 0; k <= r; k++) { const v = C(r, k); row.push({ v, born: g.t + (k === 0 || k === r ? 0 : 0.12 * T) }); if (k > 0 && k < r) { const up = S.cells[r - 1]; up[k - 1].flash = g.t; up[k].flash = g.t; row[k].vee = g.t; } }
      S.cells[r] = row; S.built = r; zoneRows(); g.sfx('pop', { p: 0.9 + r * 0.08 }); hop(g); };
    const lastAt = (n - 1) * RT * T;
    // 1. build the triangle
    const build = { tap: ['n', 'row0'], busy: 0.1, askAt: lastAt + 0.1 * T, after: 0.75 * T,
      ask: (() => { const h = Math.floor(n / 2), v = C(n, h); return { v, wrong: [v + 1, v - 1, C(n - 1, h), 2 * v].filter(w => w > 0 && w !== v) }; })(),
      then(g) { S.go = true; M.show(g, lastAt + 0.1 * T); S.point = true; hop(g, 'think'); M.indicate(g, S.nn, { col: POW, sc: 1.4, dur: 0.4 * T }); g.sfx('swoosh');
        const list = []; for (let r = 1; r < n; r++) list.push([(r - 1) * RT * T + 0.05 * T, g => buildRow(g, r)]); M.at(g, list); },
      resolve(g) { M.show(g, 0.75 * T); buildRow(g, n);
        M.at(g, [[0.32 * T, g => { S.rowLit = g.t; M.indicate(g, S.nn, { col: POW, sc: 1.5, dur: 0.4 * T }); M.circle(g, 'row' + n, { col: POW, dur: 0.5 * T }); g.sfx('ding'); }],
          [0.75 * T, g => { S.built = n; S.ready = true; S.point = false; }]]); } };
    // after the last coefficient lands: 1xⁿ is just xⁿ
    const finishUp = (g, at) => { if (!S.terms.every(q => q.pas && q.pow)) return 0;
      const q0 = S.terms[0]; M.at(g, [[at, g => { M.strike(g, q0.coef, { dur: 0.22 * T, col: POW }); g.sfx('tap'); }],
        [at + 0.3 * T, g => { M.tween(g, q0.coef, { alpha: 0 }, 0.18 * T); }],
        [at + 0.5 * T, g => { q0.gone = true; S.relay(); M.sparkle(g, 'ans', { n: 18, cols: [HONEY, '#fff', POW] }); g.sfx('coin'); hop(g, 'laugh'); }]]);
      return at + 0.6 * T; };
    // a coefficient gets a new factor: it appears (first factor) or rolls over to the product
    const apply = (g, q, f) => { const val = (q.pas ? C(n, q.k) : 1) * (q.pow ? Math.pow(b, q.k) : 1);
      if (!q.coef) { q.coef = M.num(val, 'c' + q.k, { pop: g.t }); S.relay(); } else { M.roll(g, q.coef, val, { dur: 0.3 * T }); q.coef.pop = g.t; S.relay(); }
      M.sparkle(g, 'c' + q.k, { n: 6, cols: [f, '#fff'] }); };
    // 2. drop row n onto the terms
    const drop = from => ({ drag: from, to: ['ans', ...S.terms.map(q => 's' + q.k)], area: [8, ANSY - 46, 352, ANSY + 22], busy: 0.1,
      then(g) { S.dropped = true; S.point = true; hop(g, 'think'); g.sfx('swoosh'); const st = 0.2 * T, fl = 0.36 * T;
        S.terms.forEach((q, k) => { const [x, y] = cellXY(n, k); S.cells[n][k].lift = g.t + k * st;
          M.fly(g, { node: M.num(C(n, k)), from: [x, y], to: q.coef ? 'c' + k : 's' + k, delay: k * st, dur: fl, arc: -40, s0: 23, s1: S.ansS, col: POW,
            then(g) { q.pas = true; apply(g, q, POW); g.sfx('pop', { p: 1 + k * 0.08 }); hop(g); } }); });
        const end = n * st + fl + 0.05 * T, fin = finishUp2(end); M.show(g, Math.max(end, fin) + 0.1 * T); M.at(g, [[Math.max(end, fin), g => { S.point = false; }]]); } });
    // finishing needs to know the state after this move, so it is checked when the last coefficient has landed
    const finishUp2 = end => { const other = b === 1 || S.powDone; if (!other) return 0; M.at(g, [[end, g => finishUp(g, 0)]]); return end + 0.6 * T; };
    // 3. multiply in the powers of b
    const powers = { drag: 'b', to: ['ans', ...S.terms.map(q => 's' + q.k)], area: [8, ANSY - 46, 352, ANSY + 22], busy: 0.1,
      then(g) { S.powDone = true; S.point = true; hop(g, 'think'); g.sfx('swoosh'); M.indicate(g, S.bn, { col: BEE, sc: 1.4, dur: 0.4 * T });
        const st = 0.26 * T; let last = 0;
        S.terms.forEach((q, k) => { if (k === 0) { q.pow = true; if (!q.coef) { q.coef = M.num(1, 'c0'); S.relay(); } return; }
          const d = 0.15 * T + (k - 1) * st; last = d;
          M.note(g, { node: M.row(M.op('×'), M.sup(M.num(b), M.num(k))), at: q.coef ? 'c' + k : 's' + k, off: [0, -38], s: 25, col: BEE, delay: d, write: 0.3 * T, hold: 0.3 * T, fly: 0.3 * T, to: q.coef ? 'c' + k : 's' + k, s1: 18, arc: 8,
            then(g) { q.pow = true; apply(g, q, BEE); g.sfx('tap', { p: 1 + k * 0.1 }); hop(g); } }); });
        const end = last + 1.0 * T, done = S.dropped ? end + 0.6 * T : end;
        if (S.dropped) M.at(g, [[end, g => finishUp(g, 0)]]); M.show(g, done + 0.05 * T); M.at(g, [[done, g => { S.point = false; }]]); } };
    M.play(g, {
      moves(g) { const out = [];
        if (!S.go) out.push(build); else if (S.ready && !S.dropped) out.push(drop('row' + n));
        if (b !== 1 && !S.powDone) out.push(powers);
        return out; },
      area(g) { return !S.go ? ['n', 'row0'] : !S.dropped ? ['row' + n, 'ans'] : ['b', 'ans']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g);
    c.drawImage(g.bake('binom_garden', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    bees(c, t);
    board(c);
    comb(g, c, t, T);
    const mk = S.mk, hk = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && t - mk.missAt < 0.7;
    const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', HX, HY - hk * 22, 1.6, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'bird', HX, HY, 1.6);
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'ans');
    // dragging a row: its numbers ride along under the finger
    const P = mk.press; if (P && P.dragging && /^row\d$/.test(P.id)) { const r = +P.id.slice(3), row = S.cells[r]; if (row) row.forEach((q, k) => { hexCell(c, P.x + (k - r / 2) * DX, P.y - 18, HR, 0.85, false); numAt(c, q.v, P.x + (k - r / 2) * DX, P.y - 18, 23, INK); }); }
    M.drawUI(g, c);
  },
});

// ---------------- drawing ----------------
function numAt(c, v, x, y, s, col) { const n = M.num(v), m = M.lay(n, s); M.draw(c, n, x - m.w / 2, y + (m.a - m.d) / 2, s, { col }); }
function hexPath(c, x, y, r) { c.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); }
function hexCell(c, x, y, r, a, lit) {
  c.save(); c.globalAlpha *= a; if (lit) { c.shadowColor = '#ffb020'; c.shadowBlur = 16; }
  const gr = c.createLinearGradient(x, y - r, x, y + r); gr.addColorStop(0, lit ? '#ffe680' : '#ffe9a8'); gr.addColorStop(1, lit ? '#ffb52a' : '#f2c25a');
  c.fillStyle = gr; hexPath(c, x, y, r); c.fill(); c.shadowBlur = 0; c.strokeStyle = '#b77a1a'; c.lineWidth = 2; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(x - r * 0.3, y - r * 0.45, r * 0.32, r * 0.14, -0.4, 0, 7); c.fill(); c.restore();
}
function comb(g, c, t, T) {
  const S = g.s, n = S.n;
  // the empty comb outline for rows not built yet, faint, so the triangle's shape is a promise
  for (let r = 0; r <= n; r++) for (let k = 0; k <= r; k++) { if (S.cells[r] && S.cells[r][k]) continue; const [x, y] = cellXY(r, k); c.save(); c.globalAlpha = 0.22; c.strokeStyle = '#b77a1a'; c.lineWidth = 1.5; hexPath(c, x, y, HR); c.stroke(); c.restore(); }
  S.cells.forEach((row, r) => row.forEach((q, k) => {
    const [x, y] = cellXY(r, k), k0 = q.born < 0 ? 1 : M.clamp((t - q.born) / (0.22 * T), 0, 1); if (k0 <= 0) return;
    // the V of light from the two cells above into this one
    if (q.vee != null) { const e = M.easeIO((t - q.vee) / (0.22 * T)), fade = M.clamp(1 - (t - q.vee - 0.5 * T) / (0.3 * T), 0, 1);
      if (fade > 0) { c.save(); c.globalAlpha = fade; c.strokeStyle = '#fff3b0'; c.shadowColor = '#ffb020'; c.shadowBlur = 8; c.lineWidth = 3; c.lineCap = 'round';
        for (const kk of [k - 1, k]) { const [px, py] = cellXY(r - 1, kk); c.beginPath(); c.moveTo(px, py + 6); c.lineTo(M.lerp(px, x, e), M.lerp(py + 6, y - 6, e)); c.stroke(); } c.restore(); } }
    const fl = q.flash != null ? Math.max(0, Math.sin(M.clamp((t - q.flash) / (0.4 * T), 0, 1) * Math.PI)) : 0;
    const lit = S.rowLit != null && r === n && !g.done, lifted = q.lift != null && t >= q.lift && t < q.lift + 0.9 * T;
    const sc = (0.4 + 0.6 * M.ease(k0)) * (1 + fl * 0.18);
    c.save(); c.translate(x, y); c.scale(sc, sc); hexCell(c, 0, 0, HR, 1, lit || fl > 0.3);
    if (!lifted) numAt(c, q.v, 0, 0, 23, fl > 0.3 ? '#a03a00' : INK); c.restore();
  }));
}
function board(c) {
  // a warm wooden board hung from a branch, with honey dripping off its top edge
  const x = 14, y = 186, w = 332, h = 346; c.save();
  c.fillStyle = 'rgba(70,40,10,0.28)'; c.beginPath(); c.roundRect(x + 4, y + 8, w, h, 20); c.fill();
  const gr = c.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#fff3d6'); gr.addColorStop(1, '#f7dca6'); c.fillStyle = gr; c.beginPath(); c.roundRect(x, y, w, h, 20); c.fill();
  c.strokeStyle = '#c88a3a'; c.lineWidth = 3; c.stroke();
  c.fillStyle = '#f2b02a'; c.beginPath(); c.moveTo(x + 20, y); for (let i = 0; i <= 12; i++) { const xx = x + 20 + i * (w - 40) / 12, d = [8, 16, 6, 22, 10, 5, 18, 7, 12, 20, 6, 14, 9][i]; c.lineTo(xx - 6, y); c.quadraticCurveTo(xx - 6, y + d, xx, y + d + 4); c.quadraticCurveTo(xx + 6, y + d, xx + 6, y); } c.lineTo(x + w - 20, y); c.lineTo(x + w - 20, y - 4); c.lineTo(x + 20, y - 4); c.fill();
  c.restore();
}
function paintBg(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#7ec4ec'); sk.addColorStop(0.45, '#cfeaf0'); sk.addColorStop(0.7, '#fff2c4'); sk.addColorStop(1, '#fde0a0'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  const sg = c.createRadialGradient(60, 60, 5, 60, 60, 160); sg.addColorStop(0, 'rgba(255,250,220,0.95)'); sg.addColorStop(1, 'rgba(255,250,220,0)'); c.fillStyle = sg; c.fillRect(0, 0, 260, 240);
  P.hills(c, W, 520, 26, '#a6cc6a', '#7aa848', { seed: 3, dabs: 30 });
  P.hills(c, W, 560, 18, '#8cbc58', '#5f8f3a', { seed: 9, dabs: 50 });
  P.flowers(c, W, 560, 640, 26, ['#ffffff', '#ffd23a', '#ff8ab0', '#b98ae0'], 4);
  P.grassTufts(c, W, 570, 640, 30, '#5f9a3e', 6);
  // the hive on a post at the left
  c.fillStyle = '#7a4a22'; c.fillRect(48, 590, 10, 60);
  for (let i = 0; i < 4; i++) { const yy = 552 + i * 13, w = 30 - Math.abs(i - 1.5) * 6; c.fillStyle = i % 2 ? '#e8a838' : '#f2bc4a'; c.beginPath(); c.ellipse(53, yy, w, 9, 0, 0, 7); c.fill(); c.strokeStyle = '#a8681a'; c.lineWidth = 1.5; c.stroke(); }
  c.fillStyle = '#4a2a10'; c.beginPath(); c.ellipse(53, 594, 6, 4, 0, 0, 7); c.fill();
}
function bees(c, t) {
  for (let i = 0; i < 4; i++) { const a = t * (0.7 + i * 0.15) + i * 1.7, x = 60 + i * 80 + Math.cos(a) * 40, y = 140 + (i % 2) * 430 + Math.sin(a * 1.6) * 18;
    if (y > 176 && y < 540) continue;
    c.save(); c.translate(x, y); c.fillStyle = 'rgba(255,255,255,0.75)'; const fl = Math.sin(t * 40 + i) * 2; c.beginPath(); c.ellipse(-2, -5 - fl, 4, 2.5, -0.5, 0, 7); c.ellipse(3, -5 + fl, 4, 2.5, 0.5, 0, 7); c.fill();
    c.fillStyle = '#ffc828'; c.beginPath(); c.ellipse(0, 0, 6, 4, 0, 0, 7); c.fill(); c.fillStyle = '#3a2410'; c.fillRect(-1.5, -4, 2, 8); c.fillRect(2.5, -3.5, 1.5, 7); c.restore(); }
}
