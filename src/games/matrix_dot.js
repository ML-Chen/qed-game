// matrix_dot.js — DOT PRODUCT! Multiply two 2×2 matrices: [a b; c d] [e f; g h] = [□ □; □ □].
// Each answer cell is the dot product of a row of the first matrix with a column of the second.
// The scene is a deep, glowing reef at night: the first matrix is made of pink bubbles, the second of little cyan
// jellyfish, the answer cells are open scallop shells, and the brackets are strands of glowing kelp.
// Moves: drag a row of the first matrix (grab any entry; the whole row lifts as one strip, carried by the octopus's arm)
// onto a column of the second. The strip swings slowly round to lie along the column, the matching entries pair up
// (first pair, then second pair, each flashing in the matrices while its product lights in the working line), and the
// working line a·e + b·g writes itself under the matrices. Tap each product (either order): it is circled and its two
// entries flash in the matrices; then the first factor and the dot slide into the second, which rolls over to the
// product like an odometer. Tap the +: the second product slides into the first, which rolls over to the sum, and the
// sum lifts off and arcs up into the shell where that row and column meet, which pops. Cells may be started in any
// order; two can be in progress at once. The fuse stands still while the working plays.
// Level 0: the top-left cell (the others are filled in). Level 1: one cell anywhere. Level 2: two cells, with negatives.
// Wrong moves: dragging a row of the second matrix (pairing the wrong way: it lands on a column of the first and the
// octopus's arms get tangled), tapping the + before both products are worked out, or tapping the second matrix.
// Medium mode: each product tap and the + tap open a tray; the sum's wrong tiles are real mistakes
// (a·f + b·h from the wrong column, a·e + b·e, a + b + e + g).
const M = MK;
const INK = '#fff6e0', A_INK = '#ffb8cc', B_INK = '#94ecff', OCTO = '#ee7a92', OCTO_D = '#a8405e';
const lerp = M.lerp, clamp = M.clamp, ease = M.ease, easeIO = M.easeIO, GOLDN = '#ffe27a';
// every symbol inside a node (fading these, not just their wrapper, means they leave no ghosts when removed)
const leaves = (n, out = []) => { if (!n) return out; if (/^(num|var|txt|op)$/.test(n.k)) out.push(n); for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) leaves(ch, out); return out; };

// ---------------- numbers ----------------
function pickProblem(g) {
  const L = g.level, R = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  const lo = L === 2 ? -3 : 0, hi = L === 0 ? 4 : 5;
  const cellsAll = [[0, 0], [0, 1], [1, 0], [1, 1]];
  let need;
  if (L === 0) need = [[0, 0]];
  else if (L === 1) need = [cellsAll[R(0, 3)]];
  else { const k = R(0, 3); let k2 = R(0, 2); if (k2 >= k) k2++; need = [cellsAll[k], cellsAll[k2]]; }
  let best = null;
  for (let tries = 0; tries < 600; tries++) {
    const A = [[R(lo, hi), R(lo, hi)], [R(lo, hi), R(lo, hi)]], B = [[R(lo, hi), R(lo, hi)], [R(lo, hi), R(lo, hi)]];
    const C = [0, 1].map(i => [0, 1].map(j => A[i][0] * B[0][j] + A[i][1] * B[1][j]));
    const all = [...A.flat(), ...B.flat()], zeros = all.filter(v => v === 0).length;
    let ok = zeros <= 1 && C.flat().every(v => v >= -12 && v <= 40);
    for (const [i, j] of need) {
      const p1 = A[i][0] * B[0][j], p2 = A[i][1] * B[1][j], wrongCol = A[i][0] * B[0][1 - j] + A[i][1] * B[1][1 - j];
      if (p1 === 0 && p2 === 0) ok = false;
      if (wrongCol === C[i][j]) ok = false;           // the wrong column must give a different answer
      if (A[i][0] === A[i][1] && B[0][j] === B[1][j]) ok = false;
    }
    if (L === 2 && !need.some(([i, j]) => A[i][0] * B[0][j] < 0 || A[i][1] * B[1][j] < 0)) ok = false;
    best = { A, B, C, need };
    if (ok) break;
  }
  return best;
}

// ---------------- the deep reef (baked) ----------------
function reef(c, W, H) {
  const gr = c.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#1d5f92'); gr.addColorStop(0.22, '#123e70'); gr.addColorStop(0.6, '#0a2652'); gr.addColorStop(1, '#06173a');
  c.fillStyle = gr; c.fillRect(0, 0, W, H);
  const sg = c.createRadialGradient(250, -60, 10, 250, -60, 330); sg.addColorStop(0, 'rgba(160,230,255,0.45)'); sg.addColorStop(1, 'rgba(160,230,255,0)'); c.fillStyle = sg; c.fillRect(0, 0, W, 360);
  // far reef ridges fading into the dark
  P.hills(c, W, 470, 50, '#123d68', '#0d2f56', { seed: 11, dabs: 20 });
  P.hills(c, W, 520, 30, '#0f3360', '#0a2850', { seed: 5, dabs: 30 });
  const rnd = P.rng(42);
  // the sea floor: dark sand with glowing specks
  P.hills(c, W, 572, 14, '#2e5470', '#1a3452', { seed: 7, dabs: 90, rim: '#5aa0c0' });
  for (let i = 0; i < 60; i++) { c.fillStyle = P.rgba(rnd() < 0.5 ? '#0e2440' : '#6ab8d8', 0.4); c.beginPath(); c.arc(rnd() * W, 576 + rnd() * 64, 0.8 + rnd() * 1.3, 0, 7); c.fill(); }
  // glowing coral on both sides
  seaFan(c, 44, 596, 1.1, '#b878ff', 3);
  branchCoral(c, 94, 604, 1.0, '#ff7a9a', 8);
  brainCoral(c, 20, 610, 1.0, '#e08a5a');
  tubes(c, 124, 616, 0.8, '#ffc84a');
  branchCoral(c, 298, 602, 1.15, '#ff8a5a', 21);
  seaFan(c, 336, 600, 0.85, '#ff6aa0', 6);
  brainCoral(c, 252, 618, 0.85, '#9a7ae0');
  tubes(c, 346, 624, 0.7, '#5ae0c8');
  starfish(c, 214, 622, 0.9, '#ff8a4a'); shell(c, 164, 630, 0.8); shell(c, 278, 634, 0.6);
  P.vignette(c, W, H, 0.5, '#020a1c');
}
function glowOn(c, col, blur) { c.shadowColor = col; c.shadowBlur = blur; }
function branchCoral(c, x, y, s, col, seed) {
  const pass = (w0, cl, tip) => { const r = P.rng(seed); const br = (x, y, a, len, w, d) => {
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, bend = (r() - 0.5) * len * 0.5;
      c.strokeStyle = cl; c.lineWidth = w + w0; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo((x + x2) / 2 + bend, (y + y2) / 2, x2, y2); c.stroke();
      if (d <= 0) { if (tip) { c.save(); glowOn(c, tip, 10); c.fillStyle = tip; c.beginPath(); c.arc(x2, y2, w * 0.7, 0, 7); c.fill(); c.restore(); } return; }
      br(x2, y2, a - 0.32 - r() * 0.3, len * (0.7 + r() * 0.12), w * 0.74, d - 1); br(x2, y2, a + 0.32 + r() * 0.3, len * (0.7 + r() * 0.12), w * 0.74, d - 1);
    }; br(x, y, -Math.PI / 2 + (r() - 0.5) * 0.3, 30 * s, 9 * s, 3); };
  pass(3, P.shade(col, -0.55), null); pass(0, P.shade(col, -0.2), P.shade(col, 0.55));
  c.save(); c.globalAlpha = 0.4; pass(-5, P.shade(col, 0.3), null); c.restore();
}
function seaFan(c, x, y, s, col, seed) {
  c.save(); c.lineCap = 'round'; glowOn(c, col, 8);
  for (let pass = 0; pass < 2; pass++) {
    c.strokeStyle = pass ? col : P.shade(col, -0.5); c.globalAlpha = pass ? 0.85 : 0.6;
    const rr = P.rng(seed + 1);
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.17 + (rr() - 0.5) * 0.08, len = (52 + rr() * 22) * s; c.lineWidth = (pass ? 1.8 : 3.4) * s;
      c.beginPath(); c.moveTo(x, y); const mx = x + Math.cos(a) * len * 0.5, my = y + Math.sin(a) * len * 0.5; c.quadraticCurveTo(mx + (rr() - 0.5) * 8, my, x + Math.cos(a) * len, y + Math.sin(a) * len); c.stroke(); }
    c.lineWidth = (pass ? 0.8 : 1.5) * s;
    for (let k = 1; k < 7; k++) { c.beginPath(); c.arc(x, y, k * 10 * s, -Math.PI / 2 - 0.72, -Math.PI / 2 + 0.72); c.stroke(); }
  }
  c.restore();
}
function brainCoral(c, x, y, s, col) {
  const g = c.createRadialGradient(x - 8 * s, y - 16 * s, 2, x, y - 8 * s, 30 * s); g.addColorStop(0, P.shade(col, 0.1)); g.addColorStop(1, P.shade(col, -0.55));
  c.fillStyle = g; c.beginPath(); c.ellipse(x, y, 28 * s, 22 * s, 0, Math.PI, 0); c.closePath(); c.fill();
  c.strokeStyle = P.shade(col, 0.35); c.globalAlpha = 0.7; c.lineWidth = 1.4 * s; c.save(); c.beginPath(); c.ellipse(x, y, 28 * s, 22 * s, 0, Math.PI, 0); c.clip();
  for (let k = 0; k < 6; k++) { c.beginPath(); for (let xx = -30; xx <= 30; xx += 3) { const yy = y - 4 * s - k * 4 * s + Math.sin(xx * 0.5 + k * 1.7) * 1.8 * s; xx === -30 ? c.moveTo(x + xx * s, yy) : c.lineTo(x + xx * s, yy); } c.stroke(); }
  c.restore(); c.globalAlpha = 1;
}
function tubes(c, x, y, s, col) {
  for (const [dx, h, w] of [[-10, 34, 7], [0, 46, 8], [11, 28, 6.5]]) {
    const bx = x + dx * s, top = y - h * s, g = c.createLinearGradient(bx - w * s, 0, bx + w * s, 0); g.addColorStop(0, P.shade(col, -0.1)); g.addColorStop(1, P.shade(col, -0.6));
    c.fillStyle = g; c.beginPath(); c.moveTo(bx - w * s * 0.8, y); c.lineTo(bx - w * s, top); c.lineTo(bx + w * s, top); c.lineTo(bx + w * s * 0.8, y); c.closePath(); c.fill();
    c.save(); glowOn(c, col, 10); c.strokeStyle = P.shade(col, 0.3); c.lineWidth = 2; c.beginPath(); c.ellipse(bx, top, w * s, w * s * 0.42, 0, 0, 7); c.stroke(); c.restore();
    c.fillStyle = '#081830'; c.beginPath(); c.ellipse(bx, top + 0.5, w * s * 0.72, w * s * 0.28, 0, 0, 7); c.fill();
  }
}
function starfish(c, x, y, s, col) {
  c.save(); c.translate(x, y); c.scale(s, s * 0.6); c.rotate(0.3); glowOn(c, col, 8); c.fillStyle = P.shade(col, -0.25); c.beginPath();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? 5 : 13, a = i * Math.PI / 5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill();
  c.shadowBlur = 0; c.fillStyle = 'rgba(255,240,210,0.7)'; for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; for (const q of [4, 8]) { c.beginPath(); c.arc(Math.cos(a) * q, Math.sin(a) * q, 1, 0, 7); c.fill(); } }
  c.restore();
}
function shell(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s); const g = c.createLinearGradient(0, -10, 0, 4); g.addColorStop(0, '#c8b8d8'); g.addColorStop(1, '#6a5a88'); c.fillStyle = g;
  c.beginPath(); c.moveTo(-10, 2); c.quadraticCurveTo(-10, -12, 0, -12); c.quadraticCurveTo(10, -12, 10, 2); c.closePath(); c.fill(); c.strokeStyle = '#4a3a68'; c.lineWidth = 1;
  for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(0, 3); c.lineTo(i * 4.2, -10); c.stroke(); } c.restore();
}

// ---------------- live scenery ----------------
function seaweed(c, x, y, h, t, col, ph) {
  c.save(); c.lineCap = 'round';
  for (let pass = 0; pass < 2; pass++) {
    c.strokeStyle = pass ? col : P.shade(col, -0.5); c.lineWidth = pass ? 4.5 : 8; c.beginPath(); c.moveTo(x, y);
    for (let k = 1; k <= 12; k++) { const q = k / 12, sway = Math.sin(t * 1.3 + ph + q * 2.6) * 10 * q; c.lineTo(x + sway + Math.sin(q * 9 + ph) * 3, y - q * h); }
    c.stroke();
  }
  c.restore();
}
function bubble(c, x, y, r, a = 0.7) {
  c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(190,240,255,0.85)'; c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  c.fillStyle = 'rgba(160,230,255,0.12)'; c.fill(); c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.arc(x - r * 0.35, y - r * 0.35, Math.max(0.7, r * 0.26), 0, 7); c.fill(); c.restore();
}
function scenery(g, c) {
  const t = g.t;
  P.rays(c, 250, -60, W, H, '#bfeeff', 0.09, 8, t);
  // drifting glowing plankton
  c.save(); c.globalCompositeOperation = 'screen';
  for (let i = 0; i < 26; i++) { const x = (i * 83.7 + t * (4 + (i % 5))) % W, y = 40 + ((i * 151.3) % 560) + Math.sin(t * 0.8 + i) * 8, tw = 0.5 + 0.5 * Math.sin(t * 2.4 + i * 1.9);
    c.fillStyle = i % 3 ? `rgba(120,240,255,${0.15 + tw * 0.35})` : `rgba(255,150,200,${0.15 + tw * 0.3})`; c.beginPath(); c.arc(x, y, 1 + tw * 1.2, 0, 7); c.fill(); }
  c.restore();
  seaweed(c, 8, 640, 124, t, '#2a9a7a', 0); seaweed(c, 24, 640, 90, t, '#3ab890', 1.7);
  seaweed(c, 352, 640, 136, t, '#2a9a7a', 2.4); seaweed(c, 336, 640, 94, t, '#3ab890', 4.1);
  // little glowing fish crossing behind the octopus
  const fish = [[0.035, 444, '#ffb040', 0.6, 0], [-0.05, 476, '#ff7a9a', 0.5, 0.4], [0.028, 418, '#7ae8ff', 0.42, 0.75]];
  for (const [sp, y, col, s, ph] of fish) { const k = ((t * Math.abs(sp) + ph) % 1), x = sp > 0 ? -30 + k * 420 : 390 - k * 420;
    c.save(); c.translate(x, y + Math.sin(t * 2 + ph * 9) * 4); if (sp > 0) c.scale(-1, 1); glowOn(c, col, 8); P.fishShape(c, 0, 0, s, col); c.restore(); }
  for (let i = 0; i < 10; i++) { const sp = 34 + (i % 4) * 9, k = ((t * sp / 640) + i * 0.137) % 1, x0 = [70, 96, 300, 320, 40][i % 5], y = 600 - k * 620, x = x0 + Math.sin(t * 2 + i) * 6 + k * (i % 2 ? 8 : -8);
    if (y > 190 && y < 400) continue; bubble(c, x, y, 2 + (i % 3) * 1.6, 0.75 * (1 - k * 0.4)); }
}

// ---------------- the problem's own backings ----------------
function orb(g, c, x, y, r, flash) { // a pink bubble (the first matrix)
  const t = g.t, rr = r * (1 + Math.sin(t * 3 + x * 0.1) * 0.03 + flash * 0.18);
  c.save(); glowOn(c, 'rgba(255,120,170,0.9)', 10 + flash * 16);
  const gr = c.createRadialGradient(x - rr * 0.3, y - rr * 0.35, 1, x, y, rr); gr.addColorStop(0, `rgba(255,190,215,${0.18 + flash * 0.3})`); gr.addColorStop(1, `rgba(220,70,130,${0.42 + flash * 0.2})`);
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill(); c.shadowBlur = 0;
  c.strokeStyle = 'rgba(255,200,222,0.9)'; c.lineWidth = 1.8; c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, rr * 0.74, Math.PI * 1.1, Math.PI * 1.45); c.stroke();
  c.restore();
}
function jelly(g, c, x, y, s, flash, ph) { // a little jellyfish (the second matrix); the number sits on its bell
  const t = g.t, pulse = Math.sin(t * 3.2 + ph) * 0.05 + flash * 0.16, w = s * 0.62 * (1 + pulse), top = y - s * 0.56 * (1 - pulse * 0.5), bot = y + s * 0.32;
  c.save(); glowOn(c, 'rgba(90,220,255,0.9)', 10 + flash * 16);
  c.strokeStyle = `rgba(150,235,255,${0.55 + flash * 0.4})`; c.lineWidth = 1.4; c.lineCap = 'round';
  for (let k = 0; k < 4; k++) { const tx = x - w * 0.6 + k * w * 0.4; c.beginPath(); c.moveTo(tx, bot); for (let q = 1; q <= 4; q++) c.lineTo(tx + Math.sin(t * 3 + k + q) * 2, bot + q * s * 0.07); c.stroke(); }
  const gr = c.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, `rgba(170,245,255,${0.35 + flash * 0.3})`); gr.addColorStop(1, `rgba(40,150,210,${0.5 + flash * 0.2})`);
  c.fillStyle = gr; c.beginPath(); c.moveTo(x - w, bot); c.bezierCurveTo(x - w, top - s * 0.05, x + w, top - s * 0.05, x + w, bot);
  for (let k = 0; k < 5; k++) { const x1 = x + w - (k + 1) * w * 0.4; c.quadraticCurveTo(x + w - (k + 0.5) * w * 0.4, bot - s * 0.08, x1, bot); }
  c.closePath(); c.fill(); c.shadowBlur = 0; c.strokeStyle = 'rgba(190,248,255,0.9)'; c.lineWidth = 1.6; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(x - w * 0.45, top + s * 0.22, s * 0.1, s * 0.05, -0.6, 0, 7); c.fill();
  c.restore();
}
function scallop(g, c, x, y, s, w, state, pulse) { // an open scallop shell (an answer cell)
  const r = Math.min(w * 0.42, s * 0.62), cy = y + s * 0.42;
  c.save();
  if (state === 'work') glowOn(c, `rgba(255,140,180,${0.6 + pulse * 0.4})`, 14 + pulse * 8);
  else if (state === 'done') glowOn(c, 'rgba(255,240,200,0.5)', 10);
  const gr = c.createLinearGradient(0, cy - r * 1.2, 0, cy); gr.addColorStop(0, state === 'work' ? '#9a4a8a' : '#6a4a96'); gr.addColorStop(1, '#3a2868');
  c.fillStyle = gr; c.beginPath(); c.moveTo(x, cy);
  for (let k = 0; k <= 8; k++) { const a = Math.PI + 0.25 + k * (Math.PI - 0.5) / 8, a2 = a + (Math.PI - 0.5) / 16; c.lineTo(x + Math.cos(a) * r * 1.22, cy + Math.sin(a) * r * 1.1); if (k < 8) c.quadraticCurveTo(x + Math.cos(a2) * r * 1.34, cy + Math.sin(a2) * r * 1.22, x + Math.cos(a2 + (Math.PI - 0.5) / 16) * r * 1.22, cy + Math.sin(a2 + (Math.PI - 0.5) / 16) * r * 1.1); }
  c.closePath(); c.fill(); c.shadowBlur = 0;
  c.strokeStyle = 'rgba(220,190,255,0.55)'; c.lineWidth = 1.2; for (let k = 1; k < 8; k++) { const a = Math.PI + 0.25 + k * (Math.PI - 0.5) / 8; c.beginPath(); c.moveTo(x, cy); c.lineTo(x + Math.cos(a) * r * 1.15, cy + Math.sin(a) * r * 1.03); c.stroke(); }
  c.fillStyle = '#4a3478'; c.beginPath(); c.moveTo(x - r * 0.3, cy + 2); c.lineTo(x + r * 0.3, cy + 2); c.lineTo(x + r * 0.16, cy - r * 0.14); c.lineTo(x - r * 0.16, cy - r * 0.14); c.closePath(); c.fill();
  if (state === 'done') { const pg = c.createRadialGradient(x, y, 1, x, y, s * 0.6); pg.addColorStop(0, 'rgba(255,250,230,0.35)'); pg.addColorStop(1, 'rgba(255,250,230,0)'); c.fillStyle = pg; c.beginPath(); c.arc(x, y, s * 0.6, 0, 7); c.fill(); }
  c.restore();
}
function kelp(g, c, x, top, bot, dir, s, ph) { // a glowing kelp strand as a matrix bracket; dir −1 = left bracket
  const t = g.t, sw = k => Math.sin(t * 1.4 + ph + k * 3) * 1.4, w = s * 0.2;
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; glowOn(c, 'rgba(90,230,150,0.8)', 8);
  c.strokeStyle = '#7af0a8'; c.lineWidth = s * 0.085;
  c.beginPath(); c.moveTo(x - dir * w + sw(0), top); c.quadraticCurveTo(x + sw(0.2), top, x + sw(0.3), top + s * 0.18);
  c.bezierCurveTo(x + sw(0.4) + dir * 2, (top * 2 + bot) / 3, x + sw(0.6) - dir * 2, (top + bot * 2) / 3, x + sw(0.8), bot - s * 0.18);
  c.quadraticCurveTo(x + sw(0.9), bot, x - dir * w + sw(1), bot); c.stroke();
  c.shadowBlur = 0; c.fillStyle = '#4ac884';
  for (const q of [0.33, 0.66]) { const yy = lerp(top, bot, q), xx = x + sw(q); c.beginPath(); c.ellipse(xx + dir * s * 0.12, yy, s * 0.13, s * 0.05, dir * 0.7, 0, 7); c.fill(); }
  c.restore();
}

// ---------------- the octopus ----------------
function tentacleSeg(c, pts, w0, w1, col, dark, suckers) {
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (let pass = 0; pass < 2; pass++) { c.strokeStyle = pass ? col : dark;
    for (let i = 1; i < pts.length; i++) { const q = i / (pts.length - 1); c.lineWidth = lerp(w0, w1, q) + (pass ? 0 : 2.6); c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke(); } }
  if (suckers) { c.fillStyle = 'rgba(255,226,232,0.95)'; for (let i = 2; i < pts.length - 1; i += 2) { const q = i / (pts.length - 1), [x, y] = pts[i], [x2, y2] = pts[i + 1], nx = -(y2 - y), ny = x2 - x, l = Math.hypot(nx, ny) || 1, ww = lerp(w0, w1, q);
    c.beginPath(); c.arc(x + nx / l * ww * 0.25, y + ny / l * ww * 0.25, Math.max(0.8, ww * 0.22), 0, 7); c.fill(); } }
}
function bez(p0, p1, p2, p3, n, wig = 0, t = 0) {
  const out = [];
  for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u, x = v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], y = v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1];
    out.push([x + Math.sin(u * 7 + t * 4) * wig * u, y + Math.cos(u * 6 + t * 3.4) * wig * u * 0.6]); }
  return out;
}
// an octopus of our own, used when animals.js is missing; anchor = the arm tips on the sand
function octoSelf(c, x, y, s, o) {
  const t = o.t || 0, bob = Math.sin(t * 2.2) * 2.5, cheer = o.pose === 'cheer', expr = o.expr || 'happy';
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(0,10,30,0.35)'; c.beginPath(); c.ellipse(0, 2, 50, 7, 0, 0, 7); c.fill();
  const arm = (k, back) => {
    const bx = -21 + k * 6, by = -30 + bob, side = bx < 0 ? -1 : 1, spread = Math.abs(bx) / 21;
    let tip = [bx * 2.3 + side * 8, -3 + Math.sin(t * 2.4 + k) * 2], c1 = [bx * 1.3, -14], c2 = [bx * 2.2 + side * 16, -14];
    if (cheer && (k === 0 || k === 7)) { tip = [side * 50, -74 + Math.sin(t * 9 + k) * 6 + bob]; c1 = [side * 30, -30]; c2 = [side * 52, -46]; }
    if (o.hold && k === 4) return;
    const pts = bez([bx, by], c1, c2, tip, 12, 3 + spread * 2, t + k);
    tentacleSeg(c, pts, 10.5, 3.2, back ? P.shade(OCTO, -0.15) : OCTO, OCTO_D, !back);
    const [ex, ey] = pts[pts.length - 1]; c.strokeStyle = back ? P.shade(OCTO, -0.15) : OCTO; c.lineWidth = 3; c.beginPath(); c.arc(ex + side * 3, ey - 2.5, 3, side > 0 ? Math.PI : 0, side > 0 ? Math.PI * 2.4 : -Math.PI * 1.4, side < 0); c.stroke();
  };
  for (const k of [1, 3, 4, 6]) arm(k, true);
  const hy = -58 + bob, hg = c.createRadialGradient(-10, hy - 14, 3, 0, hy, 40); hg.addColorStop(0, P.shade(OCTO, 0.35)); hg.addColorStop(0.7, OCTO); hg.addColorStop(1, P.shade(OCTO, -0.15));
  c.fillStyle = hg; c.strokeStyle = OCTO_D; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-26, -26 + bob); c.bezierCurveTo(-36, hy - 6, -24, hy - 36, 0, hy - 36); c.bezierCurveTo(24, hy - 36, 36, hy - 6, 26, -26 + bob); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-11, hy - 22, 7, 4, -0.5, 0, 7); c.fill();
  c.fillStyle = P.rgba(OCTO_D, 0.35); for (const [sx, sy, r] of [[14, hy - 22, 3], [19, hy - 13, 2], [-18, hy - 8, 2.2]]) { c.beginPath(); c.arc(sx, sy, r, 0, 7); c.fill(); }
  for (const k of [0, 2, 5, 7]) arm(k, false);
  const ey = hy + 4, blink = Math.sin(t * 1.3) > 0.985;
  for (const sx of [-11, 11]) {
    if (expr === 'laugh' || blink) { c.strokeStyle = '#3a1640'; c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath(); c.arc(sx, ey + 2, 5, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); continue; }
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(sx, ey, 7, 8, 0, 0, 7); c.fill(); c.strokeStyle = OCTO_D; c.lineWidth = 1.2; c.stroke();
    const pr = expr === 'wow' ? 2.6 : 4, lx = (o.look || 0) * 2, ly = (o.lookY || 0) * 2;
    c.fillStyle = '#2a1820'; c.beginPath(); c.arc(sx + lx, ey + 1 + ly, pr, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(sx + lx - 1.3, ey - 0.8 + ly, 1.4, 0, 7); c.fill();
    if (expr === 'sad') { c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(sx - 5, ey - 11 + (sx < 0 ? 2 : -1)); c.lineTo(sx + 5, ey - 11 + (sx < 0 ? -1 : 2)); c.stroke(); }
  }
  c.fillStyle = 'rgba(232,80,110,0.4)'; c.beginPath(); c.ellipse(-19, ey + 9, 4.5, 2.6, 0, 0, 7); c.ellipse(19, ey + 9, 4.5, 2.6, 0, 0, 7); c.fill();
  c.strokeStyle = '#3a1640'; c.fillStyle = '#7a1a3a'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath();
  if (expr === 'wow') { c.ellipse(0, ey + 13, 3.5, 4.5, 0, 0, 7); c.fill(); }
  else if (expr === 'sad') { c.arc(0, ey + 17, 5, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  else if (expr === 'laugh') { c.moveTo(-6, ey + 10); c.quadraticCurveTo(0, ey + 20, 6, ey + 10); c.closePath(); c.fill(); c.stroke(); }
  else { c.arc(0, ey + 9, 5, 0.25, Math.PI - 0.25); c.stroke(); }
  c.restore();
}
function octopus(g, c, x, y, s, o) {
  try { if (typeof ANI !== 'undefined' && ANI.draw) { ANI.draw(c, 'octopus', x, y, s * 1.2, o); return; } } catch (e) { }
  try { octoSelf(c, x, y, s, o); } catch (e) { P.bigFish(c, x, y - 40, 0.6, { t: o.t }); }
}
// one long arm reaching from the octopus up to (x1, y1)
function reach(g, c, x0, y0, x1, y1) {
  const side = x1 < x0 ? -1 : 1, pts = bez([x0, y0], [x0 + side * 34, y0 - 30], [x1 - side * 40, y1 + 60], [x1, y1], 16, 4, g.t);
  c.save(); tentacleSeg(c, pts, 12, 6, OCTO, OCTO_D, true); c.restore();
}
// knotted arms, after a mistake
function tangle(g, c, x, y, k) {
  if (k <= 0 || k >= 1) return; const a = Math.sin(Math.min(1, k * 5) * Math.PI / 2) * (k > 0.8 ? (1 - k) * 5 : 1), sc = 9 * a, rot = Math.sin(g.t * 9) * 0.25;
  c.save(); c.translate(x, y); c.rotate(rot);
  const pts = []; for (let i = 0; i <= 70; i++) { const u = i / 70 * Math.PI * 2; pts.push([(Math.sin(u) + 2 * Math.sin(2 * u)) * sc, (Math.cos(u) - 2 * Math.cos(2 * u)) * sc]); }
  tentacleSeg(c, pts, 8, 8, OCTO, OCTO_D, true);
  c.restore();
  for (let i = 0; i < 3; i++) { const an = g.t * 5 + i * 2.1; c.fillStyle = '#fff6a0'; c.save(); c.globalAlpha = a; c.translate(x + Math.cos(an) * 40, y - 30 + Math.sin(an) * 12); c.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 2.2 : 5.5, b = j * Math.PI / 5; c.lineTo(Math.cos(b) * r, Math.sin(b) * r); } c.fill(); c.restore(); }
}

// ---------------- strips and numbers ----------------
function drawNum(g, c, v, x, y, s, col, pop) {
  const n = M.num(v, null, { col, pop }), m = M.lay(n, s); M.draw(c, n, x - m.w / 2, y + (m.a - m.d) / 2, s, { t: g.t });
}
// a row lifted out as a strip: a piece of octopus arm holding two bubbles, along angle `ang`, `gap` px apart
function drawStrip(g, c, vals, cx, cy, ang, gap, s, o = {}) {
  const ux = Math.cos(ang), uy = Math.sin(ang), teal = o.teal, h = s * 1.22, L = gap + s * 1.25;
  c.save(); c.globalAlpha *= o.alpha ?? 1;
  c.save(); c.translate(cx, cy); c.rotate(ang);
  if (o.shadow) { c.shadowColor = teal ? 'rgba(90,220,255,0.8)' : 'rgba(255,120,170,0.8)'; c.shadowBlur = 16; }
  const gr = c.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, teal ? '#3a9ab8' : '#d0607e'); gr.addColorStop(1, teal ? '#1a5878' : '#7a2a4c');
  c.fillStyle = gr; c.beginPath(); rr(c, -L / 2, -h / 2, L, h, h / 2); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = o.red ? '#ff5a5a' : teal ? '#a8f0ff' : '#ffc0d4'; c.lineWidth = o.red ? 3.5 : 2; c.stroke();
  for (const q of [-1, 1]) { c.fillStyle = 'rgba(255,255,255,0.14)'; c.beginPath(); c.arc(q * gap / 2, 0, s * 0.5, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 1.5; c.stroke(); }
  c.restore();
  vals.forEach((v, i) => { const q = i ? 1 : -1; drawNum(g, c, v, cx + ux * q * gap / 2, cy + uy * q * gap / 2, s * 0.86, o.red ? '#ff8a8a' : INK); });
  c.restore();
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- geometry ----------------
const id = (m, i, j) => m + i + j, cix = (i, j) => i * 2 + j;
function geo(g) {
  const Mk = g.s.mk, b = k => Mk.box[k];
  const rowsY = [b('a00').y, b('a10').y], colsX = [b('b00').x, b('b01').x];
  const A = M.unionBox(['a00', 'a01', 'a10', 'a11'].map(b)), B = M.unionBox(['b00', 'b01', 'b10', 'b11'].map(b));
  return { rowsY, colsX, A, B, aX: [b('a00').x, b('a01').x], aGap: b('a01').x - b('a00').x, bRow: rowsY[1] - rowsY[0] };
}
function stripHome(g, st) { // centre of a row strip in its own matrix
  const Mk = g.s.mk, a = Mk.box[id(st.m, st.r, 0)], b = Mk.box[id(st.m, st.r, 1)]; return { x: (a.x + b.x) / 2, y: a.y, gap: b.x - a.x };
}
function stripVals(S, st) { const X = st.m === 'a' ? S.A : S.B; return X[st.r].slice(); }
function stripOf(pid) { return /^[ab][01][01]$/.test(pid || '') ? { m: pid[0], r: +pid[1] } : null; }
function inBox(b, x, y, px, py) { return b && Math.abs(x - b.x) <= b.w / 2 + px && Math.abs(y - b.y) <= b.h / 2 + py; }

MG.add({
  id: 'dot', stage: 'matrices', cmd: 'DOT PRODUCT!', hint: 'drag', time: 8, mood: 'sea', winText: 'Multiplied!', hold: 1.4, cardY: 310,
  card: {
    title: 'Matrix multiplication', ref: 'College', kind: 'Linear algebra',
    text: 'A matrix is a grid of numbers. A row goes across the grid, and a column goes down. To multiply two matrices, you fill in the answer grid one cell at a time.\n\nEach answer cell uses one row of the first matrix and one column of the second matrix. The cell in row 1, column 2 uses row 1 of the first matrix and column 2 of the second. Multiply the first number in the row by the first number in the column. Multiply the second number by the second number. Then add the two results. This sum is called a dot product.\n\nFor example, say the first matrix has rows (1, 2) and (3, 4), and the second matrix has columns (5, 7) and (6, 8). The top-left cell is 1 × 5 + 2 × 7 = 19. The top-right cell is 1 × 6 + 2 × 8 = 22.\n\nThe order of the two matrices matters. The first matrix times the second usually gives a different answer from the second times the first.',
    note: 'The answer in row 2, column 1 comes from row 2 of the first matrix and column 1 of the second. Multiply the matching numbers in pairs, then add the results.',
    ask: 'The first matrix has rows (2, 1) and (0, 3). The second matrix has rows (1, 4) and (2, 5). What is the top-left cell of the answer? What is the bottom-right cell?',
  },
  init(g) {
    const S = g.s, Mk = M.setup(g), PR = pickProblem(g);
    S.A = PR.A; S.B = PR.B; S.C = PR.C;
    S.cells = [0, 1].map(i => [0, 1].map(j => ({ i, j, v: PR.C[i][j], need: false, state: 'done', pre: true, p: [false, false], pop: -9 })));
    for (const [i, j] of PR.need) Object.assign(S.cells[i][j], { need: true, state: 'empty', pre: false });
    S.need = PR.need.map(([i, j]) => S.cells[i][j]); S.order = []; S.flash = {}; S.puffs = [];
    S.octo = { happyAt: -9, tangleAt: -9, bumpAt: -9 };
    // layout: the first two matrices typeset by the kit (their brackets are drawn as kelp here), the answer cells are zones
    let s = 34, ex, m;
    const resW = s => { const fs = s * 0.78; return Math.max(s * 1.15, ...S.C.flat().map(v => M.lay(M.num(v), fs).w + s * 0.34)); };
    const clear = 'rgba(0,0,0,0)';
    for (; s >= 24; s--) {
      S.matA = M.mat(S.A.map((r, i) => r.map((v, j) => M.num(v, id('a', i, j)))), null, { col: clear });
      S.matB = M.mat(S.B.map((r, i) => r.map((v, j) => M.num(v, id('b', i, j)))), null, { col: clear });
      S.cw = resW(s); S.cWidth = 2 * S.cw + s * 0.3 + s * 0.6 + s * 0.2;
      ex = M.row(S.matA, M.gap(s * 0.42), S.matB, M.op('=', 'eq'), M.gap(S.cWidth)); m = M.lay(ex, s);
      if (m.w <= 342) break;
    }
    S.s = s; S.base = 250 + s * 0.3;
    M.place(g, 'eq', ex, 180, S.base, s, { col: INK });
    const G = geo(g), eq = Mk.box.eq; S.cx0 = eq.x + eq.w / 2;
    S.cellPos = (i, j) => ({ x: S.cx0 + s * 0.4 + S.cw * (j + 0.5) + j * s * 0.3, y: G.rowsY[i] });
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const p = S.cellPos(i, j); M.zone(g, id('c', i, j), { x: p.x, y: p.y, w: S.cw, h: G.bRow * 0.9, s: s * 0.78 }); }
    const inertIds = ['eq']; for (let c = 0; c < 4; c++) for (const k of [0, 1]) inertIds.push('q' + c + k, 'x' + c + k, 'y' + c + k, 'd' + c + k);
    M.inert(g, inertIds);
    // time scales with the number of moves: four per cell (drag, two products, the sum)
    g.dur *= (2.6 + 1.05 * 4 * S.need.length) / 8;

    // the working lines under the matrices: one per cell in progress. Their nodes are kept (cell.L), so when a product
    // is worked out its symbols slide and roll in place instead of being replaced.
    const T = M.pace(g);
    S.face = 'happy'; S.faceT = -9; S.point = false;
    const mkLine = cell => { const c = cix(cell.i, cell.j), a = S.A[cell.i], e = [S.B[0][cell.j], S.B[1][cell.j]];
      cell.L = { k: [0, 1].map(k => { const fx = M.num(a[k], 'x' + c + k, { col: A_INK }), fy = M.num(e[k], 'y' + c + k, { col: B_INK }), dot = M.op('·', 'd' + c + k);
        const wx = k === 1 && a[k] < 0 ? M.paren(fx, null, { col: A_INK }) : fx, wy = e[k] < 0 ? M.paren(fy, null, { col: B_INK }) : fy;
        const r = M.row(wx, dot, wy); r.id = 'p' + c + k; return { fx, fy, dot, wx, wy, r, res: null }; }),
        plus: M.op('+', 'r' + c), g1: M.gap(9), g2: M.gap(9) }; };
    S.line = cell => { const L = cell.L, part = k => L.k[k].res || L.k[k].r; L.row = L.row || M.row(); L.row.items = cell.sumNode ? [cell.sumNode] : [part(0), L.g1, L.plus, L.g2, part(1)]; return L.row; };
    S.relay = () => {
      for (const k of Object.keys(Mk.ex)) if (k.startsWith('work')) delete Mk.ex[k];
      const live = S.order.filter(cell => cell.state === 'work'), ys = live.length > 1 ? [342, 388] : [362];
      live.forEach((cell, n) => { cell.ly = ys[n]; const e = M.place(g, 'work' + n, S.line(cell), 196, ys[n] + 10, 29, { col: INK }); cell.lx = e.x; });
    };
    const burst = (x, y, cols) => g.burst(x, y, cols || ['#ffd45a', '#7ae8ff', '#fff'], 10, 120);
    const act = () => { S.octo.bumpAt = g.t; S.puffs.push({ t0: g.t, x: 180 + (g.rand() - 0.5) * 30 }); };
    const think = g => { S.face = 'think'; S.faceT = g.t; };
    // a part slides into a neighbour and melts away (its symbols fade, so nothing is left behind)
    const slide = (g, n, dx, dur, delay) => { M.tween(g, n, { dx, alpha: 0, sc: 0.5 }, dur, { delay }); for (const q of leaves(n)) if (q !== n) M.tween(g, q, { alpha: 0 }, dur, { delay }); };
    const pairFlash = (g, cell, k) => { S.flash[id('a', cell.i, k)] = g.t; S.flash[id('b', k, cell.j)] = g.t; };
    // 1. a row onto a column: the strip swings round, the pairs light in turn, and the working line writes itself
    const startCell = (g, cell) => {
      cell.state = 'work'; cell.pp = [-9, -9]; cell.shown = [false, false]; mkLine(cell); S.order.push(cell); S.relay(); g.sfx('swoosh'); g.sfx('bubble'); act();
      M.show(g, 1.2 * T); S.point = true; think(g);
      const h = S.dropAt || stripHome(g, { m: 'a', r: cell.i }); S.dropAt = null;
      S.flourish = { i: cell.i, j: cell.j, t0: g.t, x: h.x, y: h.y, dur: 1.0 * T };
      const lineT = 0.45 * T; cell.lineT = g.t + lineT; M.writeIn(g, S.line(cell), { delay: lineT, dur: 0.5 * T });
      M.at(g, [
        [0.5 * T, g => { pairFlash(g, cell, 0); M.indicate(g, cell.L.k[0].r, { dur: 0.35 * T, col: GOLDN }); g.sfx('tap'); act(); }],
        [0.8 * T, g => { pairFlash(g, cell, 1); M.indicate(g, cell.L.k[1].r, { dur: 0.35 * T, col: GOLDN }); g.sfx('tap'); act(); }],
        [1.15 * T, g => { if (!S.order.some(q => q.state === 'work' && q !== cell && !q.adding)) S.point = false; }]]);
    };
    // 2. a product: circled, its entries flash; then the first factor and the dot slide into the second, which rolls over
    const compute = (cell, k) => { const c = cix(cell.i, cell.j), x = S.A[cell.i][k], y = S.B[k][cell.j], v = x * y;
      return { tap: 'p' + c + k, busy: 0.1, askAt: 0.45 * T, after: 0.8 * T,
        ask: { v, wrong: [x + y, v + x, v - 1, v + y, -v, v + 1] },
        then(g) { cell.p[k] = true; M.show(g, 0.45 * T); think(g); S.point = true; const P = cell.L.k[k];
          M.circle(g, 'p' + c + k, { dur: 0.45 * T, col: GOLDN }); pairFlash(g, cell, k);
          M.indicate(g, P.fx, { dur: 0.3 * T, col: A_INK }); M.indicate(g, P.fy, { delay: 0.15 * T, dur: 0.3 * T, col: B_INK }); g.sfx('tap'); },
        resolve(g) { M.show(g, 0.8 * T); const P = cell.L.k[k], by = M.box(g, P.fy.id), bx = M.box(g, P.fx.id), bd = M.box(g, P.dot.id);
          cell.sl = cell.sl || []; cell.sl[k] = g.t; slide(g, P.wx, by && bx ? by.x - bx.x : 30, 0.32 * T); slide(g, P.dot, by && bd ? by.x - bd.x : 15, 0.3 * T); g.sfx('whoosh');
          M.at(g, [[0.32 * T, g => { P.fy.id = 'q' + c + k; P.fy.col = GOLDN; P.res = k && v < 0 ? M.paren(P.fy) : P.fy; cell.shown[k] = true; cell.pp[k] = g.t; S.relay();
              M.roll(g, P.fy, v, { dur: 0.3 * T }); S.relay(); g.sfx('pop'); act(); }],
            [0.66 * T, g => { M.sparkle(g, P.fy, { n: 8, cols: [GOLDN, '#fff', '#7ae8ff'] }); P.fy.col = INK; M.indicate(g, P.fy, { dur: 0.2 * T, sc: 1.2, col: GOLDN }); if (!S.order.some(q => q.state === 'work' && q.p.some(z => !z))) S.point = false; }]]); } }; };
    // 3. the +: the second product slides into the first, which rolls over to the sum; the sum arcs up into its shell
    const addUp = cell => {
      const i = cell.i, j = cell.j, c = cix(i, j), a = S.A[i][0], b = S.A[i][1], e = S.B[0][j], gg = S.B[1][j], f = S.B[0][1 - j], h = S.B[1][1 - j];
      return {
        tap: 'r' + c, busy: 0.1, askAt: 0.45 * T, after: 1.3 * T,
        ask: { v: cell.v, wrong: [a * f + b * h, a * e + b * e, a + b + e + gg, a * gg + b * e, cell.v + 1, cell.v - 1] },
        then(g) { cell.adding = true; M.show(g, 0.45 * T); think(g); S.point = true;
          M.circle(g, ['q' + c + '0', 'r' + c, 'q' + c + '1'], { dur: 0.45 * T, col: GOLDN }); M.indicate(g, cell.L.plus, { delay: 0.1 * T, dur: 0.3 * T, sc: 1.5, col: GOLDN }); g.sfx('tap'); },
        resolve(g) { M.show(g, 1.3 * T); const L = cell.L, q0 = L.k[0].fy, b0 = M.box(g, q0.id), b1 = M.box(g, L.k[1].fy.id), bp = M.box(g, L.plus.id);
          slide(g, L.k[1].res, b0 && b1 ? b0.x - b1.x : -50, 0.36 * T); slide(g, L.plus, b0 && bp ? b0.x - bp.x : -25, 0.32 * T); g.sfx('whoosh');
          M.at(g, [
            [0.36 * T, g => { cell.sumNode = q0; q0.col = GOLDN; S.relay(); M.roll(g, q0, cell.v, { dur: 0.34 * T }); S.relay(); g.sfx('coin'); act(); }],
            // the sum lifts off the working line and arcs up into its shell
            [0.78 * T, g => { const from = M.box(g, q0.id), to = S.cellPos(i, j); q0.alpha = 0; g.sfx('swoosh');
              if (from) { M.fly(g, { node: M.num(cell.v, null, { col: GOLDN }), from: [from.x, from.y], to: [to.x, to.y], dur: 0.42 * T, arc: -50, s0: 29, s1: S.s * 0.78 }); S.trail = { x0: from.x, y0: from.y, x1: to.x, y1: to.y, t0: g.t, dur: 0.42 * T }; } }],
            [1.2 * T, g => { const to = S.cellPos(i, j); cell.state = 'done'; cell.pop = g.t; S.relay(); g.sfx('ding'); S.octo.happyAt = g.t; act();
              burst(to.x, to.y, ['#ffd45a', '#ff8ab4', '#fff', '#7ae8ff']); if (!S.order.some(q => q.state === 'work')) S.point = false; }]]);
        },
      };
    };
    M.play(g, {
      moves(g) {
        const out = [];
        // finish the dot products already written out first, then start new ones
        for (const cell of S.order) {
          if (cell.state !== 'work') continue;
          for (const k of [0, 1]) if (!cell.p[k]) out.push(compute(cell, k));
          if (cell.p[0] && cell.p[1] && !cell.adding) out.push(addUp(cell));
        }
        for (const cell of S.need) if (cell.state === 'empty') out.push({
          drag: [id('a', cell.i, 0), id('a', cell.i, 1)], to: [id('b', 0, cell.j), id('b', 1, cell.j)], busy: 0.1, cell,
          then(g) { startCell(g, cell); },
        });
        return out;
      },
      // level 1: only the shell where the answer goes, or the next part of a written-out dot product
      area(g) { const mv = M.current(g)[0]; if (!mv) return null; return mv.drag ? id('c', mv.cell.i, mv.cell.j) : mv.tap; },
      onMiss(g, info) { S.octo.tangleAt = g.t; g.sfx('stretch'); g.shake(4, 0.2); },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); },
  move(g, x, y) {
    const Mk = g.s.mk, was = Mk.press && Mk.press.dragging; M.move(g, x, y);
    const P0 = Mk.press; if (!P0 || !P0.dragging || was) return;
    // the whole row lifts: dim both entries of the row in the matrix
    const st = stripOf(P0.id); P0.strip = st;
    if (st) { for (const j of [0, 1]) { const n = M.node(g, id(st.m, st.r, j)); if (n) n.alpha = 0.25; } g.s.octo.bumpAt = g.t; }
  },
  up(g, x, y) {
    const S = g.s, Mk = g.s.mk, P0 = Mk.press;
    if (!P0 || !P0.dragging) { M.up(g, x, y); return; }
    const st = P0.strip, restore = () => { if (st) for (const j of [0, 1]) { const n = M.node(g, id(st.m, st.r, j)); if (n) n.alpha = undefined; } };
    if (!st) { // a drag that started on something that is not a matrix row: treat it as a tap where it started
      const n = M.node(g, P0.id); if (n) n.alpha = P0.prevAlpha; P0.dragging = false; M.up(g, P0.x0, P0.y0); return;
    }
    const G = geo(g), sx = x, sy = y - 26; // the strip is drawn above the finger
    const near = (v, arr) => Math.abs(v - arr[0]) < Math.abs(v - arr[1]) ? 0 : 1;
    const where = (px, py) => {
      if (inBox(G.B, px, py, 18, 30)) return { m: 'b', j: near(px, G.colsX), i: near(py, G.rowsY) };
      if (inBox(G.A, px, py, 18, 30)) return { m: 'a', j: near(px, G.aX), i: near(py, G.rowsY) };
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (inBox(Mk.box[id('c', i, j)], px, py, 8, 12)) return { m: 'c', i, j };
      return null;
    };
    const w = where(sx, sy) || where(x, y);
    const snap = () => { // nothing happens: the strip floats back home
      Mk.press = null; restore(); const n = M.node(g, P0.id); if (n) n.alpha = undefined;
      S.snap = { st, x0: sx, y0: sy, t0: g.t }; g.sfx('boing');
    };
    const routeTo = tid => { // let the kit judge the drop on that part (a valid move, or a miss)
      const b = Mk.box[tid], nf = Mk.flies.length; S.dropAt = { x: sx, y: sy };
      M.up(g, b.x, b.y); restore();
      if (Mk.flies.length > nf) { Mk.flies.length = nf; const n = M.node(g, P0.id); if (n) n.alpha = undefined; S.snap = { st, x0: sx, y0: sy, t0: g.t }; } // level 0 wobble: our own strip floats back
      else if (g.done && g.result === 'fail') S.wrong = { st, x0: sx, y0: sy, t0: g.t, onto: w };
    };
    if (!w) return snap();
    if (st.m === 'a') {
      if (w.m === 'b') { const cell = S.cells[st.r][w.j]; if (cell.need && cell.state === 'empty') return routeTo(id('b', 0, w.j)); }
      return snap();
    }
    // a row of the SECOND matrix: pairing the wrong way, a miss wherever it lands outside its own matrix
    if (w.m === 'b') return snap();
    return routeTo(w.m === 'a' ? id('a', w.i, w.j) : id('c', w.i, w.j));
  },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Mk = g.s.mk, t = g.t, s = S.s;
    c.drawImage(g.bake('matrix_reef', reef), 0, 0, W, H);
    scenery(g, c);
    const G = geo(g), fl = S.flourish, fk = fl ? (t - fl.t0) / (fl.dur || 0.42) : 2;
    const fla = k => { const f = S.flash[k]; return f == null ? 0 : Math.max(0, 1 - (t - f) / 0.35); };
    // a soft pool of light where the problem floats
    const pg = c.createRadialGradient(180, 300, 20, 180, 300, 200); pg.addColorStop(0, 'rgba(70,150,210,0.22)'); pg.addColorStop(1, 'rgba(70,150,210,0)'); c.fillStyle = pg; c.fillRect(0, 150, W, 320);
    // the bubbles and jellyfish under the numbers, and kelp for brackets
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const a = Mk.box[id('a', i, j)], b = Mk.box[id('b', i, j)], an = M.node(g, id('a', i, j)), bn = M.node(g, id('b', i, j));
      c.save(); if (an && an.alpha != null) c.globalAlpha = 0.35; orb(g, c, a.x, a.y, s * 0.56, fla(id('a', i, j))); c.restore();
      c.save(); if (bn && bn.alpha != null) c.globalAlpha = 0.35; jelly(g, c, b.x, b.y, s, fla(id('b', i, j)), i * 2 + j); c.restore();
    }
    const top = G.rowsY[0] - s * 0.64, bot = G.rowsY[1] + s * 0.64, edge = (x0, x1, ph) => { kelp(g, c, x0, top, bot, -1, s, ph); kelp(g, c, x1, top, bot, 1, s, ph + 1); };
    edge(G.aX[0] - s * 0.68, G.aX[1] + s * 0.68, 0); edge(G.colsX[0] - s * 0.68, G.colsX[1] + s * 0.68, 2);
    const c0 = S.cellPos(0, 0).x, c1 = S.cellPos(0, 1).x; edge(c0 - S.cw / 2 - s * 0.14, c1 + S.cw / 2 + s * 0.14, 4);
    // the column being paired lights up while the strip lies along it
    if (fl && fk < 1) { const x = G.colsX[fl.j]; c.save(); c.globalAlpha = Math.sin(clamp(fk, 0, 1) * Math.PI) * 0.9; c.fillStyle = 'rgba(120,220,255,0.18)'; c.strokeStyle = '#8ee8ff'; c.lineWidth = 2.5; c.beginPath(); rr(c, x - s * 0.62, top, s * 1.24, bot - top, s * 0.5); c.fill(); c.stroke(); c.restore(); }
    // answer shells
    for (const row of S.cells) for (const cell of row) {
      const p = S.cellPos(cell.i, cell.j), fs = s * 0.78, pulse = 0.5 + 0.5 * Math.sin(t * 6);
      c.save(); if (cell.pre) c.globalAlpha = 0.6; scallop(g, c, p.x, p.y, s, S.cw, cell.state, pulse); c.restore();
      if (cell.state === 'done') { c.save(); if (cell.pre) c.globalAlpha = 0.6; drawNum(g, c, cell.v, p.x, p.y, fs, INK, cell.pop); c.restore(); }
      else if (cell.state === 'empty') { c.save(); c.font = M.NUMF(fs * 0.8); c.fillStyle = 'rgba(230,210,255,0.55)'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', p.x, p.y + 1); c.restore(); }
      else { for (let q = 0; q < 3; q++) { c.fillStyle = `rgba(255,190,215,${0.4 + 0.5 * Math.max(0, Math.sin(t * 6 - q))})`; c.beginPath(); c.arc(p.x + (q - 1) * fs * 0.3, p.y + fs * 0.1, fs * 0.08, 0, 7); c.fill(); } }
    }
    M.drawEx(g, c, 'eq');
    // working lines: tappable parts sit in glowing bubbles; each line is tagged with a tiny map of its shell
    const live = S.order.filter(q => q.state === 'work');
    live.forEach((cell, n) => {
      const ci = cix(cell.i, cell.j), ready = cell.p[0] && cell.p[1];
      const la = clamp((t - (cell.lineT || 0) - 0.2) / 0.35, 0, 1); c.save(); c.globalAlpha = la; // the bubbles fade in once the line has written itself
      for (const k of [0, 1]) { const b = Mk.box['p' + ci + k]; if (cell.shown[k] || !b || (cell.sl && cell.sl[k] != null)) continue; const asking = cell.p[k]; c.save(); glowOn(c, asking ? 'rgba(255,220,120,0.9)' : 'rgba(140,230,255,0.7)', asking ? 14 : 10); c.fillStyle = asking ? 'rgba(255,220,130,0.22)' : 'rgba(160,230,255,0.13)'; c.strokeStyle = asking ? 'rgba(255,230,150,0.95)' : 'rgba(190,240,255,0.75)'; c.lineWidth = 1.8; c.beginPath(); rr(c, b.x - b.w / 2 - 7, b.y - b.h / 2 - 5, b.w + 14, b.h + 10, (b.h + 10) / 2); c.fill(); c.stroke(); c.restore(); }
      const pb = Mk.box['r' + ci]; if (pb && !cell.adding) { c.save(); glowOn(c, ready ? 'rgba(255,220,120,0.9)' : 'rgba(140,200,255,0.4)', ready ? 14 : 6); c.fillStyle = ready ? 'rgba(255,220,130,0.3)' : 'rgba(160,210,255,0.08)'; c.strokeStyle = ready ? 'rgba(255,230,150,0.9)' : 'rgba(170,210,255,0.35)'; c.lineWidth = 1.6; c.beginPath(); c.arc(pb.x, pb.y, pb.h * 0.5 + 3, 0, 7); c.fill(); c.stroke(); c.restore(); }
      c.restore(); M.drawEx(g, c, 'work' + n); c.save(); c.globalAlpha = la;
      const mx = (cell.lx || 40) - 26, my = cell.ly;
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const on = i === cell.i && j === cell.j; c.fillStyle = on ? '#ff8ab4' : 'rgba(200,230,255,0.3)'; c.beginPath(); rr(c, mx - 9 + j * 10, my - 9 + i * 10, 8, 8, 2); c.fill(); }
      c.restore();
    });
    // the sum's quick hop into its shell
    const tr = S.trail, tk = tr ? (t - tr.t0) / (tr.dur || 0.22) : 2;
    if (tr && tk < 1) for (let q = 0; q < 6; q++) { const kk = clamp(tk - q * 0.06, 0, 1), e = easeIO(kk); c.fillStyle = q ? 'rgba(255,230,140,0.7)' : '#fff6c0'; c.beginPath(); c.arc(lerp(tr.x0, tr.x1, e), lerp(tr.y0, tr.y1, e) - Math.sin(e * Math.PI) * 40, 6 - q, 0, 7); c.fill(); }

    // the octopus: it bounces on every move, carries the row with one long arm, and knots up after a mistake
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const tangleK = (t - S.octo.tangleAt) / 1.3, happy = t - S.octo.happyAt < 0.5, bk = (t - S.octo.bumpAt) / 0.3, bump = bk >= 0 && bk < 1 ? Math.sin(bk * Math.PI) : 0;
    const ox = 180, oy = 552 - bump * 12;
    const P0 = Mk.press, dragging = P0 && P0.dragging && P0.strip;
    for (const p of S.puffs) { const k = (t - p.t0) / 1.2; if (k < 0 || k > 1) continue; for (let q = 0; q < 3; q++) bubble(c, p.x + Math.sin(k * 9 + q * 2) * 6 + (q - 1) * 9, 480 - k * 90 - q * 10, 2.5 + q, 1 - k); }
    S.puffs = S.puffs.filter(p => t - p.t0 < 1.2);
    const pose = won || happy ? 'cheer' : bump > 0 ? 'hop' : S.point && M.showing(g) && !dragging ? 'point' : 'idle', expr0 = t - S.faceT < 0.6 ? S.face : 'happy';
    octopus(g, c, ox, oy, 1.05, { t, pose, expr: won ? 'laugh' : tangleK >= 0 && tangleK < 1 ? 'wow' : lost ? 'sad' : expr0, hold: !!dragging, look: dragging ? clamp((P0.x - ox) / 120, -1, 1) : 0, lookY: dragging ? -1 : 0 });
    if (dragging) reach(g, c, ox + 4, oy - 36, P0.x, P0.y - 14);
    else if (fl && fk < 0.5) { const k1 = easeIO(clamp(fk / 0.55, 0, 1)), x1 = G.colsX[fl.j] - s * 1.05, y1 = (G.rowsY[0] + G.rowsY[1]) / 2; reach(g, c, ox + 4, oy - 36, lerp(fl.x, x1, k1), lerp(fl.y, y1, k1) + 14); }
    if (tangleK >= 0 && tangleK < 1) tangle(g, c, ox, oy - 4, tangleK);

    // the strip swinging round to lie along the column, its entries pairing up with the column's
    if (fl && fk < 1) {
      const k1 = easeIO(clamp(fk / 0.55, 0, 1)), x1 = G.colsX[fl.j] - s * 1.05, y1 = (G.rowsY[0] + G.rowsY[1]) / 2;
      const cx = lerp(fl.x, x1, k1), cy = lerp(fl.y, y1, k1), gap = lerp(G.aGap, G.bRow, k1), al = fk < 0.7 ? 1 : 1 - (fk - 0.7) / 0.3;
      drawStrip(g, c, S.A[fl.i], cx, cy, k1 * Math.PI / 2, gap, s, { alpha: al, shadow: true });
      if (k1 >= 1) for (let r = 0; r < 2; r++) { c.save(); c.globalAlpha = al; c.strokeStyle = '#fff6c0'; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.beginPath(); c.ellipse(G.colsX[fl.j] - s * 0.52, G.rowsY[r], s * 1.18, s * 0.58, 0, 0, 7); c.stroke(); c.restore(); }
    }
    // a strip floating back home after a drop that did nothing
    const sn = S.snap, sk = sn ? (t - sn.t0) / 0.22 : 2;
    if (sn && sk < 1) { const h = stripHome(g, sn.st), e = ease(sk); drawStrip(g, c, stripVals(S, sn.st), lerp(sn.x0, h.x, e), lerp(sn.y0, h.y, e), 0, h.gap, s, { teal: sn.st.m === 'b', alpha: 1 - e * 0.6 }); }
    // the mistake: a row of the second matrix pairs with a column of the first (or sits on an answer shell), in red
    const wr = S.wrong, wk = wr ? (t - wr.t0) / 0.25 : -1;
    if (wr && wk >= 0) {
      let x1 = wr.x0, y1 = wr.y0, ang = 0, gap = G.aGap;
      if (wr.onto && wr.onto.m === 'a') { x1 = G.aX[wr.onto.j] + s * 1.0; y1 = (G.rowsY[0] + G.rowsY[1]) / 2; ang = Math.PI / 2; gap = G.bRow; }
      const e = easeIO(clamp(wk, 0, 1)), shake = wk > 1 ? Math.sin(t * 40) * 3 * Math.max(0, 1 - (wk - 1) / 3) : 0;
      drawStrip(g, c, stripVals(S, wr.st), lerp(wr.x0, x1, e) + shake, lerp(wr.y0, y1, e), ang * e, lerp(G.aGap, gap, e), s, { teal: true, red: wk > 0.6, alpha: 0.95 });
    }

    // guidance: dragging a whole row is shown with the whole strip; taps and level 1 use the kit's glow
    const mv = M.current(g)[0], failed = g.done && g.result === 'fail', lv = failed ? 0 : g.level;
    const quiet = Mk.ask || Mk.busyT > 0 || dragging || (g.done && !failed) || (failed && t - g.doneAt < 0.3);
    if (!quiet && mv && mv.drag) { // the next move always glows (owner's rule)
      const a = M.unionBox(mv.drag.map(k => Mk.box[k])), b = M.unionBox(mv.to.map(k => Mk.box[k])), cp = S.cellPos(mv.cell.i, mv.cell.j);
      M.glowBox(c, a, t); M.glowBox(c, b, t, 0.5); M.glowBox(c, { x: cp.x, y: cp.y, w: S.cw * 0.8, h: s * 0.9 }, t, 0.45);
      const k = ((t - Mk.moveT) * 0.7) % 1, e = easeIO(clamp((k - 0.12) / 0.7, 0, 1)), x1 = b.x - s * 1.0, y1 = b.y;
      const mx = lerp(a.x, x1, e), my = lerp(a.y, y1, e) - Math.sin(e * Math.PI) * 50;
      if (k > 0.08 && k < 0.92) drawStrip(g, c, S.A[mv.cell.i], mx, my, e * Math.PI / 2, lerp(G.aGap, G.bRow, e), s, { alpha: 0.6 });
      M.hand(c, mx + 6, my + 10, 1, k < 0.12 || k > 0.88 ? 1 : 0);
    } else M.drawGuide(g, c);
    M.drawAsk(g, c); M.drawFlies(g, c);
    // the strip being dragged
    if (dragging) {
      const st = P0.strip, h = stripHome(g, st), px = P0.x, py = P0.y - 26;
      let hover = null; if (st.m === 'a' && inBox(G.B, px, py, 18, 30)) { const j = Math.abs(px - G.colsX[0]) < Math.abs(px - G.colsX[1]) ? 0 : 1; const cell = S.cells[st.r][j]; if (cell.need && cell.state === 'empty') hover = j; }
      if (hover != null) { M.glowBox(c, { x: G.colsX[hover], y: (G.rowsY[0] + G.rowsY[1]) / 2, w: s * 0.9, h: G.bRow + s * 0.9 }, t, 0.6); const cp = S.cellPos(st.r, hover); M.glowBox(c, { x: cp.x, y: cp.y, w: S.cw * 0.8, h: s * 0.9 }, t, 0.5); }
      drawStrip(g, c, stripVals(S, st), px, py, hover != null ? 0.12 : 0, h.gap, s * 1.08, { teal: st.m === 'b', shadow: true });
    }
    M.drawFx(g, c);
  },
});
