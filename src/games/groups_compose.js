// groups_compose.js — COMPOSE! Compose two or three symmetries of an equilateral triangle (the dihedral group D3).
// The six symmetries: e (do nothing), r (turn 120° counter-clockwise), r² (turn 240°), f (flip across the vertical
// line through the top corner), rf and r²f (the flips across the other two lines). "a ∘ b" means first b, then a:
// functions compose right to left, so rf = r ∘ f means "flip, then turn".
// The triangle is a turtle's shell with its corners marked 1, 2, 3 (red, gold, blue). The player drags the right-hand
// move (the one that happens first) onto the turtle: the shell lifts and acts it out (a smooth turn, or a 3D flip that
// shows the shell's pale underside). Then the next move to the left. Then a tap on "?" after the = sign rewrites the
// expression as the single equivalent move while a ghost shell does that one move and lands exactly on the real shell.
// Every result is computed by composing permutations of the corners (and the matching 2×2 matrices, checked against
// each other at load); the animations use those matrices, so what the shell does always matches the computed result.
// Applying the left move first is the classic mistake (the group is not commutative): from level 1 it is a miss, and
// the shell then plays the wrong order and lands somewhere else, next to a green ghost of where it should have been.
// Level 0: one rotation and one flip. Level 1: any two moves that do not commute. Level 2: three moves.
// Medium mode: at the "?" the player picks the single move from tiles that each show a tiny picture of its result.
const M = MK;

// ---------------- the group D3, computed ----------------
// Corner positions on screen (y points down): 0 = top, 1 = bottom left, 2 = bottom right (going counter-clockwise).
const S60 = Math.sin(Math.PI / 3), VTX = [[0, -1], [-S60, 0.5], [S60, 0.5]];
const mul = (A, B) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]];
const rotM = a => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)]; // screen coordinates: a negative angle turns counter-clockwise
const det = A => A[0] * A[3] - A[1] * A[2];
const app = (A, v) => [A[0] * v[0] + A[1] * v[1], A[2] * v[0] + A[3] * v[1]];
// an element: perm[p] = the position that the corner sitting at position p moves to; mat = the same motion as a matrix
const ID = { perm: [0, 1, 2], mat: [1, 0, 0, 1] };
const GEN = { r: { perm: [1, 2, 0], mat: rotM(-2 * Math.PI / 3) }, f: { perm: [0, 2, 1], mat: [-1, 0, 0, 1] } };
const comp = (a, b) => ({ perm: [0, 1, 2].map(p => a.perm[b.perm[p]]), mat: mul(a.mat, b.mat) }); // a ∘ b: first b, then a
const WORDS = { e: '', r: 'r', r2: 'rr', f: 'f', rf: 'rf', r2f: 'rrf' };
const EL = {};
for (const [key, w] of Object.entries(WORDS)) { const x = w.split('').reduce((acc, ch) => comp(acc, GEN[ch]), ID); EL[key] = { key, ...x, rot: det(x.mat) > 0 }; }
const KEYS = Object.keys(EL), BY_PERM = Object.fromEntries(KEYS.map(k => [EL[k].perm.join(''), k]));
function cmp(a, b) { const x = comp(EL[a], EL[b]), k = BY_PERM[x.perm.join('')]; if (!k || x.mat.some((v, i) => Math.abs(v - EL[k].mat[i]) > 1e-9)) console.error('groups_compose: composition mismatch', a, b); return k; }
const chain = keys => keys.reduce((acc, k) => cmp(acc, k), 'e'); // keys[0] ∘ keys[1] ∘ ...
// check once that every matrix moves each corner to the position its permutation says, and that the six are different
for (const k of KEYS) VTX.forEach((v, p) => { const q = app(EL[k].mat, v), t = VTX[EL[k].perm[p]]; if (Math.hypot(q[0] - t[0], q[1] - t[1]) > 1e-9) console.error('groups_compose: matrix and permutation disagree for', k); });
if (new Set(KEYS.map(k => EL[k].perm.join(''))).size !== 6) console.error('groups_compose: elements are not all different');
// the natural single motion of an element, as a matrix at progress k (0..1): a turn about the centre, or a flip
// across its mirror line (the coordinate across the line shrinks through 0 to −1, which looks like a 3D flip)
function motion(key, k) {
  const X = EL[key];
  if (X.rot) { const ang = { e: 0, r: -2 * Math.PI / 3, r2: -4 * Math.PI / 3 }[key]; return rotM(ang * k); }
  const psi = Math.atan2(X.mat[1], X.mat[0]) / 2, n = [-Math.sin(psi), Math.cos(psi)];
  return [1 - 2 * k * n[0] * n[0], -2 * k * n[0] * n[1], -2 * k * n[0] * n[1], 1 - 2 * k * n[1] * n[1]];
}
for (const k of KEYS) { const A = motion(k, 1); if (A.some((v, i) => Math.abs(v - EL[k].mat[i]) > 1e-9)) console.error('groups_compose: motion does not end on', k); }
const axisAngle = key => Math.atan2(EL[key].mat[1], EL[key].mat[0]) / 2; // mirror line direction (screen coordinates)

// ---------------- look ----------------
const ROTC = '#17507e', FLIPC = '#a42c1c', ECOL = '#6a4a5a';
const CORNER = ['#e8483e', '#f6b82a', '#2f86d8'];
// r = rotate 120°, f = flip: the key shown under the problem
let keyNode = null; const KEY = () => keyNode || (keyNode = MK.row(MK.vr('r'), MK.op('='), MK.txt('rotate 120°'), MK.gap(22), MK.vr('f'), MK.op('='), MK.txt('flip')));
const CX = 180, CY = 446, RR = 70, BASE = 322, HZ = 212; // turtle centre, baseline of the writing in the sand, horizon
function nameNode(key, id, o = {}) {
  const col = key === 'e' ? ECOL : EL[key].rot ? ROTC : FLIPC, v = x => M.vr(x, null, { col }), r2 = () => M.sup(M.vr('r', null, { col }), M.num(2, null, { col }));
  const parts = { e: [v('e')], r: [v('r')], r2: [r2()], f: [v('f')], rf: [v('r'), v('f')], r2f: [r2(), v('f')] }[key];
  const n = M.row(...parts); n.id = id; n.col = col; n.el = key; return Object.assign(n, o);
}
const leaves = n => !n ? [] : n.k === 'row' ? n.items.flatMap(leaves) : n.k === 'sup' ? [n.base, n.exp] : [n];

// ---------------- the beach ----------------
function beach(c, W, H) {
  // a sunset: violet overhead, rose and orange low down, the sun sitting on the sea
  P.sky(c, W, H, ['#3a2868', '#9a4682', '#ee7c5a', '#ffc274'], { x: 236, y: HZ, r: 30, color: '#fff0b0', glow: 230 });
  P.cloud(c, 72, 150, 0.62, '#ffb4a0', '#8a4a7a', 0.9); P.cloud(c, 300, 56, 0.5, '#f8a0a8', '#6a3a7a', 0.8); P.cloud(c, 150, 186, 0.36, '#ffc8a0', '#a85a7a', 0.7);
  // a far island in silhouette
  c.fillStyle = '#5a3466'; c.beginPath(); c.moveTo(0, HZ); c.lineTo(0, HZ - 10); c.quadraticCurveTo(40, HZ - 24, 92, HZ - 6); c.lineTo(110, HZ); c.closePath(); c.fill();
  // sand, lit pink and gold by the low sun
  const sg = c.createLinearGradient(0, 262, 0, H); sg.addColorStop(0, '#c88a7a'); sg.addColorStop(0.16, '#e2a888'); sg.addColorStop(0.5, '#efc08e'); sg.addColorStop(1, '#d89868'); c.fillStyle = sg; c.fillRect(0, 258, W, H - 258);
  // the wet band where the waves reach: darker, glossy, reflecting the sky
  const wet = c.createLinearGradient(0, 258, 0, 352); wet.addColorStop(0, 'rgba(120,64,96,0.55)'); wet.addColorStop(0.7, 'rgba(150,80,90,0.32)'); wet.addColorStop(1, 'rgba(150,80,90,0)'); c.fillStyle = wet; c.fillRect(0, 258, W, 94);
  const glo = c.createRadialGradient(236, 300, 4, 236, 300, 120); glo.addColorStop(0, 'rgba(255,214,140,0.45)'); glo.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = glo; c.fillRect(100, 258, 260, 94);
  const rnd = P.rng(31); c.lineCap = 'round';
  for (let i = 0; i < 26; i++) { const y = 268 + rnd() * 70, x = rnd() * W, L = 12 + rnd() * 30; c.strokeStyle = `rgba(255,200,180,${0.12 + rnd() * 0.16})`; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - L, y); c.lineTo(x + L, y); c.stroke(); }
  // wind ripples in the dry sand
  for (let i = 0; i < 44; i++) {
    const y = 372 + rnd() * 268, x = rnd() * W, L = 20 + rnd() * 40, q = (y - 360) / 280;
    c.strokeStyle = `rgba(150,80,60,${0.16 + q * 0.12})`; c.lineWidth = 1.2 + q * 1.4; c.beginPath(); c.moveTo(x - L, y); c.quadraticCurveTo(x, y - 4 - q * 3, x + L, y); c.stroke();
    c.strokeStyle = `rgba(255,226,190,${0.3 + q * 0.2})`; c.lineWidth = 1 + q; c.beginPath(); c.moveTo(x - L, y - 2); c.quadraticCurveTo(x, y - 6 - q * 3, x + L, y - 2); c.stroke();
  }
  for (let i = 0; i < 160; i++) { const y = 352 + rnd() * 288, x = rnd() * W; c.fillStyle = rnd() < 0.5 ? 'rgba(140,70,50,0.25)' : 'rgba(255,236,210,0.45)'; c.fillRect(x, y, 1.6, 1.6); }
  // shells, a starfish, seaweed
  const shell = (x, y, s, col, a) => { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); c.fillStyle = 'rgba(110,50,40,0.28)'; c.beginPath(); c.ellipse(2, 3, 9, 4, 0, 0, 7); c.fill();
    c.fillStyle = col; c.beginPath(); c.moveTo(-9, 2); c.quadraticCurveTo(-9, -9, 0, -10); c.quadraticCurveTo(9, -9, 9, 2); c.quadraticCurveTo(0, 5, -9, 2); c.fill();
    c.strokeStyle = P.shade(col, -0.3); c.lineWidth = 1; for (let j = -2; j <= 2; j++) { c.beginPath(); c.moveTo(0, 3); c.lineTo(j * 3.6, -8 + Math.abs(j)); c.stroke(); } c.restore(); };
  shell(318, 628, 1.1, '#fbe0d0', 0.4); shell(120, 628, 0.8, '#f0b0a8', 0.2); shell(250, 380, 0.7, '#fff0e0', -0.5); shell(92, 382, 0.75, '#f8c8c0', 0.3);
  const star = (x, y, s, a) => { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); c.fillStyle = 'rgba(110,50,40,0.28)'; c.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? 5 : 13, b = j * Math.PI / 5; c.lineTo(Math.cos(b) * rr + 2, Math.sin(b) * rr + 2); } c.fill();
    c.fillStyle = '#ee6a4a'; c.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? 5 : 13, b = j * Math.PI / 5; c.lineTo(Math.cos(b) * rr, Math.sin(b) * rr); } c.closePath(); c.fill();
    c.fillStyle = '#ffd0a0'; for (let j = 0; j < 5; j++) { const b = j * Math.PI * 2 / 5; for (let q = 1; q <= 2; q++) { c.beginPath(); c.arc(Math.cos(b) * q * 4, Math.sin(b) * q * 4, 1.1, 0, 7); c.fill(); } } c.restore(); };
  star(196, 622, 1.1, 0.3); star(26, 372, 0.8, -0.2);
  c.strokeStyle = '#5a6a3a'; c.lineWidth = 2.4; for (const [x, y] of [[300, 352], [312, 356]]) { c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + 10, y - 4, x + 4, y + 6, x + 22, y + 2); c.stroke(); }
  // a little sandcastle on the right, its flag catching the last light
  c.save(); c.translate(328, 478); c.fillStyle = 'rgba(110,50,40,0.3)'; c.beginPath(); c.ellipse(-8, 4, 34, 7, 0, 0, 7); c.fill();
  const cg = c.createLinearGradient(-24, 0, 24, 0); cg.addColorStop(0, '#d8906e'); cg.addColorStop(1, '#f8c890'); c.fillStyle = cg;
  c.fillRect(-24, -26, 48, 28); c.fillRect(-12, -46, 24, 22); for (let j = 0; j < 4; j++) c.fillRect(-24 + j * 13, -32, 9, 7); for (let j = 0; j < 3; j++) c.fillRect(-12 + j * 9, -52, 6, 7);
  c.fillStyle = '#7a4434'; c.beginPath(); c.arc(0, 2, 6, Math.PI, 0); c.fill(); c.fillRect(-6, -2, 12, 4);
  c.strokeStyle = '#6a3a2a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -52); c.lineTo(0, -70); c.stroke(); c.fillStyle = '#ffcf5a'; c.beginPath(); c.moveTo(0, -70); c.lineTo(13, -66); c.lineTo(0, -62); c.fill(); c.restore();
}
// a piece of bleached driftwood to carry a move (b = the token's box)
function plank(c, b, t, o = {}) {
  const w = b.w + 16, h = b.h + 12, x = b.x - w / 2, y = b.y - h / 2 + 2, sc = o.sc || 1;
  c.save(); c.translate(b.x, b.y); c.scale(sc, sc); c.rotate(o.tilt || 0); c.translate(-b.x, -b.y); c.globalAlpha *= o.alpha ?? 1;
  c.fillStyle = 'rgba(80,30,40,0.32)'; c.beginPath(); c.ellipse(b.x + 4, y + h + 3, w * 0.52, 6, 0, 0, 7); c.fill();
  const path = () => { c.beginPath(); c.moveTo(x + 8, y); c.lineTo(x + w - 10, y + 1); c.quadraticCurveTo(x + w + 2, y + h * 0.3, x + w - 4, y + h - 2); c.lineTo(x + 6, y + h); c.quadraticCurveTo(x - 4, y + h * 0.55, x + 8, y); c.closePath(); };
  path(); const gr = c.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, o.lit ? '#fff2c8' : '#f2e2c8'); gr.addColorStop(1, o.lit ? '#f0c070' : '#c8a682'); c.fillStyle = gr; c.fill();
  c.strokeStyle = o.bad ? M.BAD : '#7a5440'; c.lineWidth = o.bad ? 3.5 : 2; c.stroke();
  c.save(); path(); c.clip(); c.strokeStyle = 'rgba(122,84,64,0.32)'; c.lineWidth = 1.2;
  for (let i = 1; i < 4; i++) { const yy = y + h * i / 4; c.beginPath(); c.moveTo(x, yy); c.bezierCurveTo(x + w * 0.3, yy - 3, x + w * 0.6, yy + 3, x + w, yy - 1); c.stroke(); }
  c.fillStyle = 'rgba(122,84,64,0.3)'; c.beginPath(); c.ellipse(x + w * 0.82, y + h * 0.68, 4, 2.4, 0.2, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(x, y + 2, w, 3); c.restore();
  c.restore();
}
// a groove drawn in wet sand: a light rim below, the dark trench on top
function groove(c, draw, wdt) {
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  c.translate(0, 1.6); c.strokeStyle = 'rgba(255,214,190,0.75)'; c.lineWidth = wdt; draw(); c.stroke();
  c.translate(0, -1.6); c.strokeStyle = '#5a2632'; c.lineWidth = wdt * 0.8; draw(); c.stroke(); c.restore();
}

// a simple side-view turtle (used until animals.js has one)
function miniTurtle(c, x, y, s, t, facing = 1, happy = true) {
  c.save(); c.translate(x, y); c.scale(s * facing, s);
  c.fillStyle = 'rgba(100,60,30,0.25)'; c.beginPath(); c.ellipse(0, 2, 26, 5, 0, 0, 7); c.fill();
  const step = Math.sin(t * 5) * 2;
  c.fillStyle = '#8ab868'; c.strokeStyle = '#3e6a30'; c.lineWidth = 1.6;
  for (const [lx, ph] of [[-14, 0], [12, 1]]) { c.beginPath(); c.ellipse(lx + (ph ? step : -step), -3, 6, 4, 0, 0, 7); c.fill(); c.stroke(); }
  c.beginPath(); c.ellipse(26, -12 + Math.sin(t * 2) * 1.5, 9, 8, 0, 0, 7); c.fill(); c.stroke();
  const sh = c.createLinearGradient(0, -30, 0, 0); sh.addColorStop(0, '#8aba5a'); sh.addColorStop(1, '#4a7a34'); c.fillStyle = sh;
  c.beginPath(); c.moveTo(-24, -4); c.quadraticCurveTo(-22, -30, 0, -30); c.quadraticCurveTo(22, -30, 24, -4); c.closePath(); c.fill(); c.strokeStyle = '#2e5020'; c.stroke();
  c.strokeStyle = 'rgba(40,70,30,0.6)'; c.beginPath(); c.moveTo(-8, -28); c.lineTo(-10, -6); c.moveTo(8, -28); c.lineTo(10, -6); c.moveTo(-20, -16); c.lineTo(20, -16); c.stroke();
  c.fillStyle = '#2a1820'; c.beginPath(); c.arc(29, -14 + Math.sin(t * 2) * 1.5, 1.8, 0, 7); c.fill();
  c.strokeStyle = '#2a1820'; c.lineWidth = 1.3; c.beginPath(); if (happy) c.arc(28, -10 + Math.sin(t * 2) * 1.5, 3, 0.3, 1.5); else c.arc(28, -6 + Math.sin(t * 2) * 1.5, 3, -1.4, -0.4); c.stroke();
  c.restore();
}
function sideTurtle(c, x, y, s, t, facing, pose, expr, hop = 0) {
  y -= hop * 16;
  try { if (typeof ANI !== 'undefined' && ANI.draw) { ANI.draw(c, 'turtle', x, y, s, { t, pose, expr, facing }); return; } } catch (e) { }
  miniTurtle(c, x, y + (pose === 'cheer' ? -Math.abs(Math.sin(t * 8)) * 8 : 0), s, t, facing, expr !== 'sad');
}
function crab(c, x, y, t, s = 1, hop = 0) {
  c.save(); c.translate(x, y - hop * 14); c.scale(s, s); c.fillStyle = 'rgba(100,60,30,0.25)'; c.beginPath(); c.ellipse(0, 4, 14, 3.5, 0, 0, 7); c.fill();
  c.strokeStyle = '#b8362a'; c.lineWidth = 2; c.lineCap = 'round';
  for (let i = 0; i < 3; i++) for (const d of [-1, 1]) { const w = Math.sin(t * 14 + i + d) * 2; c.beginPath(); c.moveTo(d * 6, 0); c.lineTo(d * (11 + i * 2), 2 + w); c.lineTo(d * (13 + i * 2), 5); c.stroke(); }
  c.fillStyle = '#e0503a'; c.beginPath(); c.ellipse(0, -2, 10, 7, 0, 0, 7); c.fill();
  for (const d of [-1, 1]) { const a = Math.sin(t * 3 + d) * 0.3 + hop * 0.9; c.save(); c.translate(d * 9, -7); c.rotate(d * (0.5 + a)); c.beginPath(); c.ellipse(0, -5, 4, 5, 0, 0, 7); c.fill(); c.strokeStyle = '#b8362a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -10); c.lineTo(0, -5); c.stroke(); c.restore(); }
  c.fillStyle = '#fff'; for (const d of [-1, 1]) { c.beginPath(); c.arc(d * 3.5, -10, 2.4, 0, 7); c.fill(); } c.fillStyle = '#2a1820'; for (const d of [-1, 1]) { c.beginPath(); c.arc(d * 3.5, -10, 1.2, 0, 7); c.fill(); }
  c.restore();
}
function gull(c, x, y, s, t) { const f = Math.sin(t * 6) * 4; c.save(); c.strokeStyle = 'rgba(58,30,70,0.8)'; c.lineWidth = 2.2 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 10 * s, y - f * s * 0.5); c.quadraticCurveTo(x - 4 * s, y - 6 * s - f * s * 0.3, x, y); c.quadraticCurveTo(x + 4 * s, y - 6 * s - f * s * 0.3, x + 10 * s, y - f * s * 0.5); c.stroke(); c.restore(); }

// ---------------- the shell ----------------
function triPath(c, R, round) {
  const pts = VTX.map(v => [v[0] * R, v[1] * R]); c.beginPath();
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], m0 = mid(pts[2], pts[0]); c.moveTo(m0[0], m0[1]);
  for (let i = 0; i < 3; i++) { const a = pts[i], b = pts[(i + 1) % 3]; c.arcTo(a[0], a[1], b[0], b[1], round); }
  c.closePath();
}
// draw the shell at (x, y) moved by the matrix A; o: { ghost, tint, dim }
function drawShell(c, x, y, A, o = {}) {
  const d = det(A), face = d >= 0 ? 'top' : 'under', edge = Math.abs(d);
  c.save(); c.translate(x, y);
  if (o.ghost) {
    c.save(); c.transform(A[0], A[2], A[1], A[3], 0, 0); triPath(c, RR, 14); c.restore();
    c.fillStyle = o.ghost === 'bad' ? 'rgba(255,120,110,0.28)' : o.ghost === 'good' ? 'rgba(140,240,160,0.3)' : 'rgba(255,255,255,0.32)'; c.fill();
    c.setLineDash([7, 6]); c.lineDashOffset = -o.t * 20; c.lineWidth = 3.5; c.strokeStyle = o.ghost === 'bad' ? '#e8483e' : o.ghost === 'good' ? '#2f9a5a' : '#ffffff'; c.stroke(); c.setLineDash([]);
  } else {
    // the slab edge underneath (gives the shell some thickness)
    c.save(); c.translate(0, 7); c.transform(A[0], A[2], A[1], A[3], 0, 0); triPath(c, RR, 14); c.restore(); c.fillStyle = '#3e2a18'; c.fill();
    c.save(); c.transform(A[0], A[2], A[1], A[3], 0, 0);
    triPath(c, RR, 14);
    const gr = c.createRadialGradient(-14, -18, 4, 0, 0, RR * 1.1);
    if (face === 'top') { gr.addColorStop(0, '#b8d878'); gr.addColorStop(0.55, '#76a448'); gr.addColorStop(1, '#3e6a2c'); }
    else { gr.addColorStop(0, '#fff4cc'); gr.addColorStop(0.6, '#f0d898'); gr.addColorStop(1, '#c8a060'); }
    c.fillStyle = gr; c.fill(); c.lineWidth = 3; c.strokeStyle = face === 'top' ? '#2a4a1c' : '#8a6030'; c.stroke();
    c.save(); triPath(c, RR, 14); c.clip();
    if (face === 'top') {
      // scutes: a central hexagon with seams out to the rim, and a rim band
      const hx = [...Array(6)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 3 + Math.PI / 6; return [Math.cos(a) * RR * 0.3, Math.sin(a) * RR * 0.3]; });
      c.fillStyle = 'rgba(200,230,140,0.35)'; c.beginPath(); hx.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(40,70,26,0.75)'; c.lineWidth = 2.4; c.stroke();
      c.beginPath(); hx.forEach(p => { c.moveTo(p[0], p[1]); c.lineTo(p[0] * 2.4, p[1] * 2.4); }); c.stroke();
      c.save(); c.lineWidth = 2; c.strokeStyle = 'rgba(40,70,26,0.55)'; c.scale(0.8, 0.8); triPath(c, RR, 10); c.restore(); c.stroke();
      c.fillStyle = 'rgba(255,255,220,0.22)'; c.beginPath(); c.ellipse(-16, -22, 16, 9, -0.6, 0, 7); c.fill();
    } else {
      // the pale underside (plastron): seams in a grid
      c.strokeStyle = 'rgba(138,96,48,0.6)'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(0, -RR); c.lineTo(0, RR);
      for (const yy of [-24, 0, 22]) { c.moveTo(-RR, yy); c.lineTo(RR, yy); } c.stroke();
      c.save(); c.lineWidth = 2; c.strokeStyle = 'rgba(138,96,48,0.45)'; c.scale(0.8, 0.8); triPath(c, RR, 10); c.restore(); c.stroke();
    }
    c.restore();
    // a darker wash when the shell is edge-on (mid-flip)
    if (edge < 0.999) { triPath(c, RR, 14); c.fillStyle = `rgba(30,20,10,${(1 - edge) * 0.35})`; c.fill(); }
    if (o.tint) { triPath(c, RR, 14); c.fillStyle = o.tint; c.fill(); }
    c.restore();
  }
  // the corners: coloured dots with upright numbers, placed by the same matrix
  VTX.forEach((v, i) => {
    const p = app(A, [v[0] * RR * 0.64, v[1] * RR * 0.64]), r = (o.dot || 1) * 13 * (0.55 + 0.45 * Math.max(edge, 0.2));
    c.save(); c.globalAlpha *= o.ghost ? 0.75 : 1;
    c.fillStyle = 'rgba(30,20,10,0.3)'; c.beginPath(); c.arc(p[0] + 1, p[1] + 2.5, r + 2, 0, 7); c.fill();
    c.fillStyle = '#fffaf0'; c.beginPath(); c.arc(p[0], p[1], r + 2.6, 0, 7); c.fill();
    c.fillStyle = CORNER[i]; c.beginPath(); c.arc(p[0], p[1], r, 0, 7); c.fill();
    c.fillStyle = '#ffffff'; c.font = `700 ${Math.round(r * 1.25)}px Fredoka, Nunito, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(i + 1), p[0], p[1] + 1);
    c.restore();
  });
  c.restore();
}
// a tiny picture of the triangle in a given position (for the medium-mode tiles)
function miniTri(c, x, y, R, A) {
  c.save(); c.translate(x, y); c.save(); c.transform(A[0], A[2], A[1], A[3], 0, 0); triPath(c, R, 3); c.restore();
  c.fillStyle = det(A) > 0 ? '#86b456' : '#f0d898'; c.fill(); c.strokeStyle = det(A) > 0 ? '#2a4a1c' : '#8a6030'; c.lineWidth = 1.5; c.stroke();
  VTX.forEach((v, i) => { const p = app(A, [v[0] * R * 0.62, v[1] * R * 0.62]); c.fillStyle = CORNER[i]; c.beginPath(); c.arc(p[0], p[1], R * 0.24, 0, 7); c.fill(); });
  c.restore();
}
// the turtle under the shell (it stays put; the shell lifts off its back and moves)
function turtleBody(c, t, mood, look) {
  c.save(); c.translate(CX, CY);
  c.fillStyle = 'rgba(110,70,30,0.3)'; c.beginPath(); c.ellipse(0, 44, 92, 20, 0, 0, 7); c.fill();
  const sk = '#8cc070', skD = '#3e6a30', pad = Math.sin(t * 3) * 0.18;
  const flip = (x, y, a, w, h) => { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = sk; c.strokeStyle = skD; c.lineWidth = 2.2; c.beginPath(); c.ellipse(w * 0.5, 0, w, h, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(60,100,40,0.4)'; c.beginPath(); c.arc(w * 0.7, -2, 2.4, 0, 7); c.arc(w * 1.0, 3, 2, 0, 7); c.fill(); c.restore(); };
  flip(-40, 18, Math.PI * 0.86 + pad, 30, 11); flip(40, 18, Math.PI * 0.14 - pad, 30, 11);
  flip(-20, -30, Math.PI * 1.2 - pad * 0.6, 18, 8); flip(20, -30, -Math.PI * 0.2 + pad * 0.6, 18, 8);
  c.fillStyle = '#6a9a52'; c.beginPath(); c.ellipse(0, 0, 52, 40, 0, 0, 7); c.fill();
  // head and neck
  const bob = Math.sin(t * 2) * 2.5, shake = mood === 'sad' ? Math.sin(t * 14) * 4 * Math.max(0, 1 - (t - (look || 0)) * 0) : 0;
  c.fillStyle = sk; c.strokeStyle = skD; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-11, 26); c.lineTo(-12 + shake * 0.5, 50 + bob); c.lineTo(12 + shake * 0.5, 50 + bob); c.lineTo(11, 26); c.closePath(); c.fill();
  const hx = shake, hy = 64 + bob;
  c.beginPath(); c.ellipse(hx, hy, 20, 17, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = 'rgba(60,100,40,0.35)'; c.beginPath(); c.arc(hx - 9, hy - 9, 2.6, 0, 7); c.arc(hx + 10, hy - 8, 2, 0, 7); c.arc(hx + 2, hy - 13, 1.8, 0, 7); c.fill();
  const blink = (t % 3.3) < 0.12;
  for (const d of [-1, 1]) {
    const ex = hx + d * 8, ey = hy - 1;
    if (blink || mood === 'laugh') { c.strokeStyle = '#2a1820'; c.lineWidth = 2.2; c.beginPath(); c.arc(ex, ey + (mood === 'laugh' ? 2 : 0), 4, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
    else { c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, ey, 5.2, 6, 0, 0, 7); c.fill(); c.fillStyle = '#2a1820'; c.beginPath(); c.ellipse(ex + (mood === 'wow' ? 0 : 0.8), ey + 1, 3.2, mood === 'wow' ? 4.4 : 3.8, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - 0.6, ey - 1.2, 1.3, 0, 7); c.fill(); }
  }
  c.fillStyle = 'rgba(232,96,110,0.35)'; c.beginPath(); c.ellipse(hx - 13, hy + 6, 4, 2.4, 0, 0, 7); c.ellipse(hx + 13, hy + 6, 4, 2.4, 0, 0, 7); c.fill();
  c.strokeStyle = '#2a1820'; c.lineWidth = 2; c.beginPath();
  if (mood === 'sad') c.arc(hx, hy + 13, 5, Math.PI * 1.15, Math.PI * 1.85); else if (mood === 'laugh' || mood === 'wow') { c.fillStyle = '#7a2a30'; c.ellipse(hx, hy + 8, 5, mood === 'wow' ? 5 : 4, 0, 0, 7); c.fill(); }
  else c.arc(hx, hy + 5, 5.5, 0.25 * Math.PI, 0.75 * Math.PI);
  c.stroke();
  c.restore();
}
// an arc arrow (turns) or a dashed mirror line (flips) that shows the move being made
function drawAid(c, key, k, alpha, x = CX, y = CY) {
  if (key === 'e' || alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.lineCap = 'round';
  if (EL[key].rot) {
    const total = key === 'r' ? 2 * Math.PI / 3 : 4 * Math.PI / 3, a0 = -Math.PI / 2 - 0.15, a1 = a0 - total * Math.max(0.05, k), rad = RR + 22;
    c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 9; c.beginPath(); c.arc(x, y, rad, a0, a1, true); c.stroke();
    c.strokeStyle = ROTC; c.lineWidth = 5; c.beginPath(); c.arc(x, y, rad, a0, a1, true); c.stroke();
    const hx = x + Math.cos(a1) * rad, hy = y + Math.sin(a1) * rad, ta = a1 - Math.PI / 2;
    c.fillStyle = ROTC; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx + Math.cos(ta) * 12, hy + Math.sin(ta) * 12); c.lineTo(hx + Math.cos(ta + 2.4) * 10, hy + Math.sin(ta + 2.4) * 10); c.lineTo(hx + Math.cos(ta - 2.4) * 10, hy + Math.sin(ta - 2.4) * 10); c.closePath(); c.stroke(); c.fill();
  } else {
    const psi = axisAngle(key), L = RR + 30, dx = Math.cos(psi) * L, dy = Math.sin(psi) * L;
    c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 8; c.beginPath(); c.moveTo(x - dx, y - dy); c.lineTo(x + dx, y + dy); c.stroke();
    c.setLineDash([10, 7]); c.strokeStyle = FLIPC; c.lineWidth = 4; c.beginPath(); c.moveTo(x - dx, y - dy); c.lineTo(x + dx, y + dy); c.stroke();
  }
  c.restore();
}

MG.add({
  id: 'compose', stage: 'symmetry', cmd: 'COMPOSE!', hint: 'drag', time: 8, winText: 'Composed!', hold: 1.6,
  card: {
    title: 'Composing symmetries', ref: 'College', kind: 'Abstract algebra',
    text: 'Six moves leave an equilateral triangle looking the same: do nothing (e), turn it a third of a turn counter-clockwise (r), turn it two thirds (r²), or flip it over one of its three mirror lines (f, rf, r²f). These six moves form a group: doing one move and then another always gives one of the same six moves. We write f ∘ r for "first r, then f", read from right to left, like f(r(x)). Order matters: f ∘ r is r²f, but r ∘ f is rf. Check f ∘ r with corner 1: r turns it from the top to the bottom left, then f swaps the two bottom corners, so corner 1 ends at the bottom right, just where r²f puts it.',
    note: 'Do the right-hand move first. Two flips always make a turn, two turns make a turn, and a turn together with a flip makes a flip.',
    ask: 'Which single move is r ∘ f? Which single move is f ∘ f?',
  },
  init(g) {
    const S = g.s; M.setup(g);
    // pick the moves (left to right as written)
    const r = k => Math.floor(g.rand() * k), pick = a => a[r(a.length)], NON_E = ['r', 'r2', 'f', 'rf', 'r2f'];
    const commute = (a, b) => cmp(a, b) === cmp(b, a);
    let keys;
    if (g.level === 0) { const rot = pick(['r', 'r2']); keys = g.rand() < 0.5 ? ['f', rot] : [rot, 'f']; }
    else if (g.level === 1) { do keys = [pick(NON_E), pick(NON_E)]; while (commute(keys[0], keys[1])); }
    else { for (let n = 0; n < 200; n++) { keys = [pick(NON_E), pick(NON_E), pick(NON_E)]; if (!commute(keys[0], keys[1]) && !commute(keys[1], keys[2]) && chain(keys) !== chain(keys.slice().reverse())) break; } }
    S.keys = keys; S.res = chain(keys); S.wrongRes = chain(keys.slice().reverse()); S.done = keys.map(() => false);
    // the expression: tiles m0, m1, (m2) with ∘ rings between, then = ?
    S.tiles = keys.map((k, i) => nameNode(k, 'm' + i));
    const sz0 = keys.length > 2 ? 42 : 50, ring = (i, s) => ({ k: 'gap', w: s * 0.98, id: 'o' + i });
    const build = s => { S.slot = { k: 'gap', w: s * 1.15, id: 'ans' }; return M.row(...S.tiles.flatMap((t, i) => [i ? ring(i, s) : null, t]), { k: 'gap', w: s * 1.02, id: 'eq' }, S.slot); };
    let s = sz0; S.ex = build(s); while (M.lay(S.ex, s).w > 318 && s > 28) { s -= 2; S.ex = build(s); }
    S.sz = s; const relay = () => M.place(g, 'ex', S.ex, 180, BASE, S.sz, { col: '#5a2632' }); S.relay = relay; relay();
    M.inert(g, ['eq', 'o1', 'o2']);
    M.zone(g, 'turtle', { x: CX, y: CY + 6, w: 190, h: 170 });
    // the shell's state: an element of the group, and the animation queue
    S.cur = 'e'; S.shown = EL.e.mat.slice(); S.anim = null; S.queue = []; S.ghost = null; S.answered = false;
    S.crabX = 50 + g.rand() * 40; S.hopAt = -9; S.sad = -9; S.happyAt = -9;
    // time scales with the number of moves: one drag per symmetry, then the tap on ?
    const nMoves = keys.length + 1; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const ANIM = 0.28; // a quick turn or flip; it never blocks the next move (moves queue up behind it)
    const startMove = (g, key, dur, delay = 0) => { const a = { key, dur, delay }; if (!S.anim) { a.t0 = g.t + delay; a.from = S.shown.slice(); S.anim = a; } else S.queue.push(a); g.sfx(EL[key].rot ? 'swoosh' : 'whoosh'); };
    S.startMove = startMove;
    const apply = (g, i, tapped) => {
      S.done[i] = true; const tile = S.tiles[i]; tile.alpha = 0.5; S.hopAt = g.t; S.cur = cmp(S.keys[i], S.cur); S.lastKey = S.keys[i];
      if (tapped) M.fly(g, { node: { ...tile, id: null, alpha: 1, pop: null, mark: null }, from: 'm' + i, to: [CX, CY], dur: 0.16, arc: -30 });
      startMove(g, S.keys[i], ANIM, 0);
    };
    M.play(g, {
      moves(g) {
        const next = S.done.lastIndexOf(false);
        if (next >= 0) return [
          { drag: 'm' + next, to: 'turtle', busy: 0.1, then(g) { apply(g, next, false); } },
          { tap: 'm' + next, busy: 0.1, then(g) { apply(g, next, true); } },
        ];
        if (S.answered) return [];
        const wrong = [S.wrongRes, S.keys[0], S.keys[S.keys.length - 1], ...KEYS].filter((k, i, a) => k !== S.res && a.indexOf(k) === i).slice(0, 3);
        return [{
          tap: 'ans', busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: nameNode(S.res, null, { dy: 13 }), wrong: wrong.map(k => nameNode(k, null, { dy: 13 })) },
          then(g) { S.slot.pop = g.t; S.hopAt = g.t; g.sfx('magic'); S.tiles.forEach(t => { t.alpha = 1; t.pop = g.t; }); },
          resolve(g) {
            S.answered = true; const ix = S.ex.items.indexOf(S.slot); S.ansNode = nameNode(S.res, 'ansv', { pop: g.t }); S.ex.items[ix] = S.ansNode; relay(); M.inert(g, ['ansv']); g.sfx('coin');
            S.ghost = { key: S.res, t0: g.t, dur: 0.45, from: EL.e.mat.slice() }; const b = M.box(g, 'ansv'); if (b) g.burst(b.x, b.y, ['#ffd45a', '#7ad0ff', '#fff'], 12, 130);
          },
        }];
      },
      area(g) { const left = S.done.map((d, i) => d ? null : 'm' + i).filter(Boolean); return left.length ? left : 'ans'; },
      onMiss(g, info) {
        S.sad = g.t;
        const id = info.drag || info.tap;
        const i = id && /^m\d$/.test(id) ? +id.slice(1) : -1;
        if (i >= 0 && !S.done[i]) {
          // act out the wrong order: the tile that was moved first, then the others left to right
          const order = [i, ...S.done.map((d, j) => d || j === i ? -1 : j).filter(j => j >= 0)];
          let st = S.cur; for (const j of order) { st = cmp(S.keys[j], st); S.startMove(g, S.keys[j], 0.3, 0); }
          S.miss = { t0: g.t + order.length * 0.3, right: S.res, wrongEnd: st };
        } else if (info.ask) {
          const k = info.ask.el; if (k) S.ghost = { key: k, t0: g.t, dur: 0.45, from: EL.e.mat.slice(), bad: true };
          S.miss = { t0: g.t + 0.45, right: S.res, wrongEnd: null };
        }
      },
      onWin(g) { S.happyAt = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    // the shell's animation queue
    if (S.anim && g.t >= S.anim.t0 + S.anim.dur) {
      S.shown = mul(EL[S.anim.key].mat, S.anim.from); S.landAt = g.t; g.sfx('thud');
      const nx = S.queue.shift(); if (nx) { nx.t0 = g.t + (nx.delay > 0.1 ? 0 : 0.02); nx.from = S.shown.slice(); S.anim = nx; } else S.anim = null;
    }
    if (S.ghost && !S.ghost.landed && g.t >= S.ghost.t0 + S.ghost.dur) { S.ghost.landed = true; if (!S.ghost.bad) { g.sfx('sparkle'); g.burst(CX, CY - 10, ['#fff6c0', '#7ad0a0', '#ffd45a'], 18, 150); } }
    S.crabX = M.clamp(S.crabX + Math.sin(g.t * 0.5) * dt * 22, 30, 110);
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); },
  up(g, x, y) {
    // dropping a move on another move is not a move (and not a miss): it just snaps back
    const Mk = g.s.mk, pr = Mk.press;
    if (pr && pr.dragging) { const tb = Mk.box.turtle, inT = tb && Math.abs(x - tb.x) <= tb.w / 2 && Math.abs(y - tb.y) <= tb.h / 2;
      const onTile = !inT && g.s.tiles.some((t, i) => { const b = Mk.box['m' + i]; return 'm' + i !== pr.id && b && Math.abs(x - b.x) <= b.w / 2 + 10 && Math.abs(y - b.y) <= b.h / 2 + 12; });
      if (onTile) { const b = Mk.box[pr.id]; if (b) { x = b.x; y = b.y; } } }
    M.up(g, x, y);
  },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('groups_sunset', beach), 0, 0, W, H);
    // the sea with the sun's golden path, and the waves washing up the wet sand
    P.water(c, W, HZ, 264, '#5a3270', '#f0967e', t, { waves: 4, sparkle: '#ffe0a0' });
    c.save(); for (let i = 0; i < 12; i++) { const y = HZ + 3 + i * 4.2, w = (6 + i * 3.2) * (0.7 + 0.3 * Math.sin(t * 3 + i * 1.7)); c.globalAlpha = 0.75 - i * 0.04; c.fillStyle = '#ffe2a0'; c.fillRect(236 - w + Math.sin(t * 2 + i) * 3, y, w * 2, 1.8); } c.restore();
    const reach = (Math.sin(t * 1.1) * 0.5 + 0.5), fy = 262 + reach * 10;
    c.fillStyle = 'rgba(240,190,200,0.32)'; c.beginPath(); c.moveTo(0, 258); for (let x = 0; x <= W; x += 12) c.lineTo(x, fy + Math.sin(x * 0.05 + t * 2) * 2.5); c.lineTo(W, 258); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,246,240,0.85)'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= W; x += 12) { const yy = fy + Math.sin(x * 0.05 + t * 2) * 2.5; x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke();
    c.strokeStyle = 'rgba(255,246,240,0.35)'; c.lineWidth = 1.5; c.beginPath(); for (let x = 0; x <= W; x += 12) { const yy = fy - 6 + Math.sin(x * 0.08 - t * 1.6) * 2; x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke();
    for (let i = 0; i < 3; i++) { const gx = ((t * (14 + i * 5) + i * 140) % 440) - 40; gull(c, gx, 36 + i * 16 + Math.sin(t + i) * 4, 0.8 + i * 0.15, t + i); }
    // the animals: everyone hops when a move is made
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const hk = (t - S.hopAt) / 0.4, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : won ? Math.abs(Math.sin(t * 7)) * 0.6 : 0;
    crab(c, S.crabX, 392, t, 0.95, hop);
    sideTurtle(c, 62, 576, 0.95, t, 1, won ? 'cheer' : hop > 0 ? 'hop' : 'idle', won ? 'laugh' : lost ? 'sad' : 'happy', hop);
    sideTurtle(c, 304, 584, 0.85, t + 1.3, -1, won ? 'cheer' : hop > 0 ? 'hop' : 'idle', won ? 'laugh' : lost ? 'sad' : 'happy', hop * 0.8);
    try { P.palm(c, 6, 640, 1.15, 0.12, t, '#2f6a44'); } catch (e) { }
    // the expression written in the wet sand; each move rides on a piece of driftwood
    const mk = g.s.mk, pr = mk.press && mk.press.dragging ? mk.press : null;
    S.tiles.forEach((tl, i) => {
      const b = M.box(g, 'm' + i); if (!b) return;
      const pk = tl.pop != null ? M.clamp((t - tl.pop) / 0.35, 0, 1) : 1, sc = 1 + Math.sin(pk * Math.PI) * 0.2;
      plank(c, b, t, { sc, tilt: (i - 1) * 0.03 + Math.sin(t * 1.5 + i) * 0.01, alpha: pr && pr.id === 'm' + i ? 0.35 : S.done[i] && !S.answered ? 0.6 : 1, bad: tl.mark === 'bad', lit: S.answered && !lost });
    });
    for (const tl of S.tiles) for (const lf of leaves(tl)) lf.mark = tl.mark;
    const sz = S.sz, cy = BASE - sz * 0.3;
    for (const id of ['o1', 'o2']) { const b = M.box(g, id); if (b) groove(c, () => { c.beginPath(); c.arc(b.x, cy, sz * 0.14, 0, 7); }, sz * 0.085); }
    { const b = M.box(g, 'eq'); if (b) groove(c, () => { c.beginPath(); for (const d of [-1, 1]) { c.moveTo(b.x - sz * 0.22, cy + d * sz * 0.1); c.lineTo(b.x + sz * 0.22, cy + d * sz * 0.1); } }, sz * 0.085); }
    if (!S.answered) { // a ring of pebbles and shells around a smoothed hollow, with a question mark scratched in it
      const b = M.box(g, 'ans'); if (b) {
        const pk = S.slot.pop != null ? M.clamp((t - S.slot.pop) / 0.35, 0, 1) : 1, sc = 1 + Math.sin(pk * Math.PI) * 0.25, rx = b.w * 0.55 * sc, ry = sz * 0.62 * sc, bad = S.slot.mark === 'bad';
        c.fillStyle = 'rgba(90,40,60,0.28)'; c.beginPath(); c.ellipse(b.x, cy, rx, ry, 0, 0, 7); c.fill();
        for (let j = 0; j < 12; j++) { const a = j / 12 * Math.PI * 2 + 0.2, px = b.x + Math.cos(a) * (rx + 3), py = cy + Math.sin(a) * (ry + 3), col = bad ? M.BAD : ['#fbe6d6', '#e8b0a0', '#c8a0b0', '#fff4e8'][j % 4];
          c.fillStyle = 'rgba(80,30,40,0.3)'; c.beginPath(); c.ellipse(px + 1, py + 1.5, 4.2, 3.2, a, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.ellipse(px, py, 4, 3, a, 0, 7); c.fill(); }
        c.save(); c.font = `700 ${Math.round(sz * 0.8 * sc)}px Fredoka, Nunito, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillStyle = 'rgba(255,214,190,0.8)'; c.fillText('?', b.x, cy + 3.2); c.fillStyle = '#5a2632'; c.fillText('?', b.x, cy + 1.6); c.restore();
      }
    } else { const b = M.box(g, 'ansv'); if (b) plank(c, b, t, { lit: true, sc: 1 + Math.sin(M.clamp((t - S.ansNode.pop) / 0.35, 0, 1) * Math.PI) * 0.25 }); }
    M.drawEx(g, c, 'ex');
    // the turtle and its shell
    const mood = won ? 'laugh' : lost ? 'sad' : S.anim ? 'wow' : 'happy';
    turtleBody(c, t, mood);
    let A = S.shown, lift = 0, aid = null;
    if (S.anim && t >= S.anim.t0) { const k = M.easeIO((t - S.anim.t0) / S.anim.dur); A = mul(motion(S.anim.key, k), S.anim.from); lift = Math.sin(k * Math.PI) * 24; aid = { key: S.anim.key, k, a: Math.min(1, Math.sin(k * Math.PI) * 2.5) }; }
    const wob = mk.wobbleAt != null && t - mk.wobbleAt < 0.4 ? Math.sin((t - mk.wobbleAt) * 40) * 0.06 * (1 - (t - mk.wobbleAt) / 0.4) : 0;
    const land = S.landAt != null && t - S.landAt < 0.2 ? Math.sin((t - S.landAt) / 0.2 * Math.PI) * 3 : 0;
    if (wob) A = mul(rotM(wob), A);
    c.fillStyle = `rgba(40,30,20,${0.12 + lift * 0.006})`; c.beginPath(); c.ellipse(CX, CY + 10, 62 - lift * 0.3, 30 - lift * 0.2, 0, 0, 7); c.fill();
    const missTint = S.miss && t >= S.miss.t0 && S.miss.wrongEnd ? 'rgba(230,70,60,0.18)' : null;
    drawShell(c, CX, CY - lift + land, A, { tint: missTint });
    if (aid) drawAid(c, aid.key, aid.k, aid.a, CX, CY - lift);
    // after a wrong order: a small shell on the right, ringed in green, shows where it should have ended
    if (S.miss && t >= S.miss.t0) {
      const k = M.ease((t - S.miss.t0) / 0.3), x = 300, y = 396;
      c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(255,255,240,0.75)'; c.strokeStyle = M.GOOD; c.lineWidth = 4; c.beginPath(); c.arc(x, y, 50 * k, 0, 7); c.fill(); c.stroke();
      c.translate(x, y + 8); c.scale(0.56 * k, 0.56 * k); drawShell(c, 0, 0, EL[S.miss.right].mat, { dot: 1.45 }); c.restore();
      if (S.miss.wrongEnd) { c.save(); c.globalAlpha = k; c.strokeStyle = M.BAD; c.lineWidth = 6; c.lineCap = 'round'; const q = 9; c.translate(CX + 70, CY - 58); c.beginPath(); c.moveTo(-q, -q); c.lineTo(q, q); c.moveTo(q, -q); c.lineTo(-q, q); c.stroke(); c.restore(); }
    }
    // the ghost doing the single equivalent move, landing exactly on the real shell
    if (S.ghost && t >= S.ghost.t0) {
      const G = S.ghost, k = M.easeIO((t - G.t0) / G.dur), gA = mul(motion(G.key, k), G.from), hover = (1 - M.ease((t - G.t0) / G.dur)) * 46;
      c.save(); c.globalAlpha = G.landed && !G.bad ? Math.max(0.35, 1 - (t - G.t0 - G.dur) * 1.2) : 1;
      drawShell(c, CX, CY - hover, gA, { ghost: G.bad ? 'bad' : 'white', t });
      if (!G.landed) drawAid(c, G.key, k, Math.min(1, Math.sin(k * Math.PI) * 2.5), CX, CY - hover);
      c.restore();
      if (G.landed && !G.bad) { const q = (t - G.t0 - G.dur); if (q < 0.6) { c.save(); c.globalAlpha = 1 - q / 0.6; c.strokeStyle = '#fff6c0'; c.lineWidth = 5; c.translate(CX, CY); c.scale(1 + q * 0.5, 1 + q * 0.5); triPath(c, RR, 14); c.stroke(); c.restore(); } }
    }
    // the key to the notation, written small in the sand under the problem
    { const key = KEY(), m = M.lay(key, 16); c.save(); c.globalAlpha = 0.85; M.draw(c, key, 180 - m.w / 2, BASE + 40, 16, { col: '#6a3a3a' }); c.restore(); }
    if (pr && /^m\d$/.test(pr.id)) { const b = M.box(g, pr.id); if (b) plank(c, { ...b, x: pr.x, y: pr.y - 20 }, t, { sc: 1.12, tilt: -0.05 }); }
    M.drawUI(g, c);
    // medium mode: a tiny picture of each answer's position on its tile
    const A2 = mk.ask;
    if (A2) {
      const out = A2.closing ? M.clamp((t - A2.closing) / 0.25, 0, 1) : 0;
      A2.list.forEach((ch, i) => {
        const kk = M.ease((t - A2.t0 - i * 0.04) / 0.25) * (1 - out); if (kk <= 0 || !ch.node.el) return;
        const sh = ch.state === 'bad' && t - ch.at < 0.4 ? Math.sin((t - ch.at) * 60) * 5 : 0, pr = ch.at && t - ch.at < 0.12 ? 3 : 0;
        c.save(); c.globalAlpha *= kk; miniTri(c, ch.x + sh, ch.y + (1 - kk) * 40 + pr - 19, 13, EL[ch.node.el].mat); c.restore();
      });
    }
  },
});
