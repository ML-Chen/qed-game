// linalg_transpose.js — TRANSPOSE! Flip a matrix over its main diagonal: row i becomes column i.
// A wooden sign in a sunset city shows a matrix with a small T beside it, and a glassy mirror line runs along its
// main diagonal. The player swipes along that diagonal (either way): the matrix flips over the mirror, every entry
// flies on an arc to its mirrored spot (row i, column j -> row j, column i), and the brackets reshape to the new size.
// A swipe across or up and down, or a tap on an entry, only wobbles the matrix (a wrong move).
// Level 0: a 2 × 3 matrix of small numbers. Level 1: a 3 × 2 matrix. Level 2: a 3 × 3 or 2 × 3 matrix with negatives.
// Medium mode: after the flip, the entry in row 1, column 2 shows "?" and the player picks it from the tray.
const M = MK, INK = SCN.ink('sign'), DIAG = '#ffe08a';
function pick(g) {
  const L = g.level, R = k => Math.floor(g.rand() * k);
  const [r, k] = L === 0 ? [2, 3] : L === 1 ? [3, 2] : g.rand() < 0.5 ? [3, 3] : [2, 3];
  const used = new Set(), A = [];
  for (let i = 0; i < r; i++) { A.push([]); for (let j = 0; j < k; j++) { let v; do { v = L === 0 ? 1 + R(9) : L === 1 ? 1 + R(19) : (R(13) - 6); } while (used.has(v)); used.add(v); A[i].push(v); } }
  return { r, k, A };
}
const CS = 64, X0 = 116, Y0 = 232; // cell size and the centre of cell (0, 0): the diagonal runs down-right from there
const cell = (i, j) => ({ x: X0 + j * CS, y: Y0 + i * CS });
function bracket(c, x, top, bot, dir) { const w = 10; c.beginPath(); c.moveTo(x - dir * w, top); c.lineTo(x, top); c.lineTo(x, bot); c.lineTo(x - dir * w, bot); c.stroke(); }

MG.add({
  id: 'linalg_transpose', stage: 'linalg', cmd: 'TRANSPOSE!', hint: 'swipe', time: 9, mood: 'party', winText: 'Flipped!', hold: 1.4,
  card: {
    title: 'The transpose', ref: 'College', kind: 'Linear algebra',
    text: 'A matrix is a grid of numbers in square brackets. A matrix with 2 rows and 3 columns is called a 2 × 3 matrix. The transpose of a matrix A is written Aᵀ. It turns every row of A into a column.\n\nThe main diagonal runs from the top left corner down to the right. To transpose, flip the matrix over that diagonal as if it were a mirror. The number in row i, column j moves to row j, column i. Numbers on the diagonal stay where they are.\n\nFor example, if the rows of A are 1 2 3 and 4 5 6, then the rows of Aᵀ are 1 4, then 2 5, then 3 6. A 2 × 3 matrix becomes a 3 × 2 matrix.\n\nThe transpose is useful because it lets you switch between rows and columns. For example, the dot product of two columns u and v can be written uᵀv.',
    note: 'Flip the matrix over its main diagonal. Row 1 becomes column 1, row 2 becomes column 2, and so on. An m × n matrix becomes an n × m matrix.',
    ask: 'What is the transpose of the matrix with rows 2 7 and 0 5? What size is the transpose of a 4 × 1 matrix?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    S.ents = [];
    for (let i = 0; i < S.r; i++) for (let j = 0; j < S.k; j++) {
      const id = 'e' + i + j, n = M.num(S.A[i][j], id), p = cell(i, j);
      S.ents.push({ i, j, id, n, from: p, to: p }); M.place(g, id, n, p.x, p.y + 13, 38, { col: INK });
    }
    g.dur *= (2.6 + 1.05 * (g.mode === 'medium' ? 2 : 1)) / 8;
    S.swipe = null; S.flipAt = null; S.badAt = -9;
    M.play(g, { moves(g) { return S.flipAt == null ? [{ drag: 'swipe', to: 'swipe' }] : []; } });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    const k = S.flipAt == null ? 1 : M.easeIO((g.t - S.flipAt) / 0.28), wob = g.t - S.badAt < 0.4 ? Math.sin((g.t - S.badAt) * 50) * 6 * (1 - (g.t - S.badAt) / 0.4) : 0;
    // entries travel straight across the mirror (perpendicular to the diagonal), bulging out along it a little
    for (const e of S.ents) { const arc = e.i === e.j ? 0 : Math.sin(k * Math.PI) * 14; e.n.dx = (e.from.x - e.to.x) * (1 - k) + wob + arc; e.n.dy = (e.from.y - e.to.y) * (1 - k) + arc; }
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { M.down(g, x, y); return; }
    if (S.flipAt == null) S.swipe = { x0: x, y0: y, x, y, pts: [[x, y]] };
  },
  move(g, x, y) { const W = g.s.swipe; if (!W || g.done) return; W.x = x; W.y = y; W.pts.push([x, y]); if (W.pts.length > 14) W.pts.shift(); },
  up(g, x, y) {
    const S = g.s, W = S.swipe; S.swipe = null; if (!W || g.done || S.flipAt != null) return;
    const dx = x - W.x0, dy = y - W.y0, len = Math.hypot(dx, dy);
    if (len < 16) { // a tap on an entry is a wrong move: entries are flipped, not tapped
      const e = S.ents.find(e => { const b = M.box(g, e.id); return b && Math.abs(x - b.x) < 30 && Math.abs(y - b.y) < 30; });
      if (e) { M.miss(g, { tap: e.id }); S.badAt = g.t; } return;
    }
    if (len < 40) return;
    const a = Math.atan2(dy, dx), along = Math.abs(a - Math.PI / 4) < 0.5 || Math.abs(a + 3 * Math.PI / 4) < 0.5;
    if (!along) { const K = S.mk; K.wrong = (K.wrong || 0) + 1; K.missAt = g.t; K.missInfo = { tap: 'swipe' }; S.badAt = g.t; g.sfx('boing'); return; }
    // the flip: every entry flies to its mirrored cell
    S.flipAt = g.t; S.mk.lastMove = g.t; S.mk.busyT = 0.3; g.sfx('whoosh'); g.sfx('pop');
    for (const e of S.ents) { e.from = cell(e.i, e.j); e.to = cell(e.j, e.i); M.place(g, e.id, e.n, e.to.x, e.to.y + 13, 38, { col: INK }); }
    M.later(g, 0.28, g => { const c0 = cell(0, 0); g.burst(c0.x + CS, c0.y + CS, ['#ffe08a', '#fff', '#ff9a6a'], 14, 140); });
    if (g.mode === 'medium') {
      const q = S.ents.find(e => e.i === 1 && e.j === 0), v = q.n.v; q.n.v = '?'; S.mk.busyT = 1e9;
      const wrong = [S.A[0][1], S.A[1][1], S.A[0][2] ?? S.A[2][0]].filter(w => w !== S.A[1][0]);
      M.later(g, 0.3, g => M.openAsk(g, { ask: { v: S.A[1][0], wrong }, after: 0.05, resolve(g) { q.n.v = v; q.n.pop = g.t; g.sfx('coin'); } }));
    }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { M.auto(g, dt, synth); return; }
    if (S.flipAt != null || g.t < 0.4) return;
    const a = cell(0, 0); synth('down', a.x - 26, a.y - 26); for (let i = 1; i <= 5; i++) synth('move', a.x - 26 + i * 30, a.y - 26 + i * 30); synth('up', a.x + 124, a.y + 124);
  },
  draw(g, c) {
    const S = g.s, t = g.t, flipped = S.flipAt != null, k = flipped ? M.easeIO((t - S.flipAt) / 0.28) : 0;
    SCN.std(g, c, { scene: 'city', panel: 'sign', host: 'fox', hostX: 290, hostY: 596, hostS: 1.3, panelY: 300, panelH: 236 });
    // the mirror: a glassy line along the main diagonal
    const d0 = cell(-0.62, -0.62), d1 = cell(2.62, 2.62);
    c.save(); c.lineCap = 'round'; c.strokeStyle = 'rgba(255,240,200,0.18)'; c.lineWidth = 16; c.beginPath(); c.moveTo(d0.x, d0.y); c.lineTo(d1.x, d1.y); c.stroke();
    c.setLineDash([3, 9]); c.lineDashOffset = -t * 20; c.strokeStyle = DIAG; c.globalAlpha = 0.75; c.lineWidth = 3; c.stroke(); c.restore();
    // the brackets reshape from r × k to k × r during the flip
    const rows = M.lerp(S.r, S.k, k), cols = M.lerp(S.k, S.r, k), wob = t - S.badAt < 0.4 ? Math.sin((t - S.badAt) * 50) * 6 * (1 - (t - S.badAt) / 0.4) : 0;
    const L = X0 - CS / 2 + 2 + wob, R = X0 + (cols - 1) * CS + CS / 2 - 2 + wob, T = Y0 - CS / 2 + 4, B = Y0 + (rows - 1) * CS + CS / 2 - 4;
    c.save(); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; bracket(c, L, T, B, -1); bracket(c, R, T, B, 1); c.restore();
    if (k < 1) { c.save(); c.globalAlpha = 1 - k; c.fillStyle = INK; c.font = M.NUMF(24, 600); c.fillText('T', R + 6, T + 14); c.restore(); }
    for (const e of S.ents) M.drawEx(g, c, e.id);
    // guidance: the diagonal always glows before the flip; the ghost hand swipes it at level 0 or after a pause
    if (!flipped && !S.swipe && (!g.done || g.result === 'fail')) {
      const p = 0.5 + 0.5 * Math.sin(t * 7); c.save(); c.lineCap = 'round'; c.shadowColor = M.GLOW; c.shadowBlur = 16 + p * 8; c.strokeStyle = `rgba(255,214,80,${0.35 + p * 0.3})`; c.lineWidth = 6;
      c.beginPath(); c.moveTo(d0.x + 14, d0.y + 14); c.lineTo(d1.x - 30, d1.y - 30); c.stroke(); c.restore();
      if (g.done || g.level === 0 || t - S.mk.moveT > 2) { const q = ((t * 0.8) % 1), e = M.easeIO(M.clamp((q - 0.1) / 0.7, 0, 1)), hx = M.lerp(d0.x + 20, d1.x - 40, e), hy = M.lerp(d0.y + 20, d1.y - 40, e); M.hand(c, hx + 4, hy + 6, 1, q < 0.1 ? 1 : 0); }
    }
    // the swipe trail
    if (S.swipe && S.swipe.pts.length > 1) { c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = 'rgba(255,246,200,0.8)'; c.lineWidth = 7; c.shadowColor = '#ffd84a'; c.shadowBlur = 12; c.beginPath(); S.swipe.pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); }
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
