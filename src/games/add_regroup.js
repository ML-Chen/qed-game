// add_regroup.js — REGROUP! Column addition, worked right to left, carrying a ten to the next column as a small 1.
// The scene is a close-up cross-section of a garden ant hill. Each column of the sum is an ant tunnel: the top number's
// digits sit on seeds, the bottom number's digits on leaf crumbs, a twig root is the line under the sum, and the answer
// digits drop into pockets in the chamber right under the columns. Everything happens on the sum itself.
// One move per column: the player swipes down the column (a tap on it counts too). The column adds up at once: its ones
// digit drops into the answer pocket, and when the total is 10 or more an ant hops the 1 up to the top of the next
// column by itself (0.3 s, never blocking). Right to left is the only valid order, because a column's total is not
// known until the carry from its right is known. A swipe on a column further left only wobbles: its digits slump and a
// red "?" marks where its carry should be, and the foreman ant scratches its head.
// Level 0: 2-digit + 2-digit, one regroup (ones). Level 1: 3-digit + 3-digit, one regroup. Level 2: 3-digit, two regroups.
// Medium mode: the swipe writes the column's sum ("1 + 4 + 3") in its pocket and opens the tray to pick the total.
const M = MK;
const SEED_INK = '#4a2408', LEAF_INK = '#183e1a', ANS_INK = '#fff2d0', EXP_INK = '#3a1c0c', CARC = '#ff7a3a';
const Y_CARRY = 224, Y_TOP = 294, Y_BOT = 356, Y_LINE = 384, Y_ANS = 502, CH_Y0 = 454, CH_Y1 = 540, SZ = 44, NS = 44, Y_NOTE = Y_LINE + 51; // NS: the working note's size, the same as the column digits so it reads on a phone
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;

// ---------------- the problem ----------------
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), n = L === 0 ? 2 : 3;
  const regroup = L === 0 ? [0] : L === 1 ? [g.rand() < 0.5 ? 0 : 1] : [0, 1];
  for (let tries = 0; tries < 300; tries++) {
    const A = [], B = []; let carry = 0, ok = true;
    for (let j = 0; j < n && ok; j++) {
      const lead = j === n - 1; let a, b;
      if (regroup.includes(j)) { a = 2 + r(8); b = 2 + r(8); if (a + b + carry < 10) ok = false; }
      else { const lo = lead ? 1 : 0; a = lo + r(9 - lo); b = lo + r(9 - lo); if (a + b + carry > 9 || a + b === 0) ok = false; }
      A.push(a); B.push(b); carry = a + b + carry >= 10 ? 1 : 0;
    }
    if (ok) return { n, A, B };
  }
  return L === 0 ? { n, A: [7, 4], B: [5, 3] } : L === 1 ? { n, A: [6, 2, 3], B: [7, 1, 4] } : { n, A: [8, 6, 2], B: [5, 7, 1] };
}
const colX = (n, j) => (n === 2 ? 234 : 264) - j * 74;
const plusX = n => colX(n, n - 1) - 58;
const colSum = (S, j) => S.A[j] + S.B[j] + S.cin[j];

// ---------------- art: ants ----------------
// a little ant seen from the side, feet at (x, y), facing right unless facing = -1. Returns where its raised front
// feet are, for carrying something over its head.
function antArt(c, x, y, s, o = {}) {
  const t = o.t || 0, f = o.facing || 1, pose = o.pose || 'idle', expr = o.expr || 'happy', ph = t * 15 + (o.phase || 0);
  const walk = pose === 'walk' || pose === 'carry';
  c.save(); c.translate(x, y); c.scale(s * f, s);
  if (!o.noShadow) { c.fillStyle = 'rgba(40,20,10,0.22)'; c.beginPath(); c.ellipse(-2, 0, 24, 4, 0, 0, 7); c.fill(); }
  const bob = walk ? Math.abs(Math.sin(ph)) * 1.6 : Math.sin(t * 3 + (o.phase || 0)) * 0.7, hop = (o.hop || 0) * 14 + (pose === 'cheer' ? Math.abs(Math.sin(t * 8)) * 7 : 0);
  c.translate(0, -bob - hop);
  const body = o.col || '#6e2c20', lite = '#b45a40', dark = '#3a140e';
  c.lineCap = 'round'; c.lineJoin = 'round';
  const legs = [[-2, -14, -13], [2, -14, 1], [6, -14, 13]];
  for (let side = 0; side < 2; side++) {
    c.strokeStyle = side ? '#2a0e0a' : '#4a1a12'; c.lineWidth = 2.4;
    legs.forEach(([ax, ay, fx], i) => {
      const sw = walk ? Math.sin(ph + i * 2.1 + side * Math.PI) * 4.5 : 0, lift = walk ? Math.max(0, Math.cos(ph + i * 2.1 + side * Math.PI)) * 3 : 0;
      let kx = (ax + fx + sw) / 2 + (i - 1) * 1.5, ky = ay - 5, ex = fx + sw + (side ? 2 : -1), ey = -lift + hop;
      if (i === 2 && (pose === 'cheer' || pose === 'carry')) { const w = pose === 'cheer' ? Math.sin(t * 10 + side) * 3 : 0; kx = ax + 8; ky = ay - 10 + w; ex = ax + 5 + side * 4; ey = ay - 26 + w; }
      else if (i === 2 && pose === 'think' && side === 1) { const w = Math.sin(t * 16) * 2; kx = ax + 12; ky = ay - 4; ex = 13 + w; ey = -31; }
      else if (i === 2 && pose === 'point' && side === 1) { kx = ax + 10; ky = ay - 6; ex = ax + 24; ey = ay - 7; }
      c.beginPath(); c.moveTo(ax, ay); c.lineTo(kx, ky); c.lineTo(ex, ey); c.stroke();
    });
  }
  const soft = (cx, cy, r, col) => { const gr = c.createRadialGradient(cx - r * 0.35, cy - r * 0.45, 1, cx, cy, r * 1.15); gr.addColorStop(0, lite); gr.addColorStop(0.55, col); gr.addColorStop(1, dark); return gr; };
  c.save(); c.translate(-16, -16); c.rotate(-0.28); c.fillStyle = soft(0, 0, 12, body); c.beginPath(); c.ellipse(0, 0, 12.5, 9.5, 0, 0, 7); c.fill();
  c.strokeStyle = 'rgba(30,8,4,0.35)'; c.lineWidth = 1.4; for (const bx of [-4, 2]) { c.beginPath(); c.ellipse(bx, 0, 2.5, 9, 0, -1.2, 1.2); c.stroke(); }
  c.fillStyle = 'rgba(255,230,210,0.35)'; c.beginPath(); c.ellipse(-3, -5, 5, 2.4, -0.3, 0, 7); c.fill(); c.restore();
  c.fillStyle = body; c.beginPath(); c.arc(-3.5, -15, 2.6, 0, 7); c.fill();
  c.fillStyle = soft(3, -16, 7, body); c.beginPath(); c.ellipse(3, -16, 7, 5.4, -0.1, 0, 7); c.fill();
  const sw = Math.sin(t * 4 + (o.phase || 0)) * 2;
  c.strokeStyle = '#3a140e'; c.lineWidth = 1.8;
  for (const k of [0, 1]) { c.beginPath(); c.moveTo(15 + k * 3, -29); c.lineTo(17 + k * 4 + sw * 0.4, -39); c.lineTo(26 + k * 3 + sw, -41 + k * 2); c.stroke(); c.fillStyle = '#3a140e'; c.beginPath(); c.arc(26 + k * 3 + sw, -41 + k * 2, 1.9, 0, 7); c.fill(); }
  c.fillStyle = soft(15, -22, 9.5, body); c.beginPath(); c.arc(15, -22, 9.5, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,235,220,0.4)'; c.beginPath(); c.ellipse(12, -27, 3.6, 2, -0.4, 0, 7); c.fill();
  if (expr === 'laugh') { c.strokeStyle = '#1a0806'; c.lineWidth = 1.8; c.beginPath(); c.arc(19, -23, 2.8, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  else {
    c.fillStyle = '#fffaf2'; c.beginPath(); c.ellipse(19, -23.5, 3.8, 4.5, 0, 0, 7); c.fill();
    const py = expr === 'sad' ? -22.5 : expr === 'think' ? -25 : -23.5; c.fillStyle = '#1a0806'; c.beginPath(); c.arc(20.2, py, expr === 'wow' ? 2.9 : 2.5, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(19.4, py - 1.1, 0.95, 0, 7); c.fill();
    if (expr === 'sad' || expr === 'think') { c.strokeStyle = '#1a0806'; c.lineWidth = 1.4; c.beginPath(); if (expr === 'sad') { c.moveTo(16, -29); c.lineTo(21.5, -30.5); } else { c.moveTo(16, -30.5); c.quadraticCurveTo(19, -32.5, 22, -30); } c.stroke(); }
  }
  c.fillStyle = 'rgba(240,110,110,0.45)'; c.beginPath(); c.ellipse(20, -17.5, 2.8, 1.7, 0, 0, 7); c.fill();
  c.strokeStyle = '#1a0806'; c.lineWidth = 1.4; c.fillStyle = '#5a1010'; c.beginPath();
  if (expr === 'laugh') { c.moveTo(20.5, -18); c.quadraticCurveTo(23, -12.5, 25, -17.5); c.closePath(); c.fill(); c.stroke(); }
  else if (expr === 'sad') { c.arc(23, -15.5, 2.2, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  else if (expr === 'wow') { c.ellipse(23.3, -17, 1.6, 2, 0, 0, 7); c.fill(); }
  else if (expr === 'think') { c.moveTo(21, -17); c.lineTo(24.5, -17.8); c.stroke(); }
  else { c.arc(22.2, -19, 2.6, 0.35, Math.PI * 0.85); c.stroke(); }
  c.restore();
  return { hx: x + f * s * 9, hy: y - (bob + hop + 40) * s };
}
// the foreman ant: the cast's ant when src/animals.js is there, else the ant above
function heroAnt(c, x, y, s, o) {
  try { if (typeof ANI !== 'undefined' && ANI.draw) { ANI.draw(c, 'ant', x, y - (o.hop || 0) * 14 * s, s, { t: o.t, pose: o.pose === 'think' || o.pose === 'walk' ? 'idle' : o.hop > 0.1 ? 'hop' : o.pose, expr: o.expr, facing: o.facing }); return; } } catch (e) { }
  antArt(c, x, y, s * 0.92, o);
}
// an ant walking along a tunnel path (a list of points), u in [0, 1)
function pathAnt(c, pts, u, s, t, o = {}) {
  const segs = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); L += d; }
  let d = ((u % 1) + 1) % 1 * L, i = 0; while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; }
  const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], k = d / segs[i], x = lerp(x0, x1, k), y = lerp(y0, y1, k);
  let ang = Math.atan2(y1 - y0, x1 - x0), facing = 1; if (Math.cos(ang) < -0.01) { facing = -1; ang -= Math.PI; }
  c.save(); c.translate(x, y); c.rotate(ang); const h = antArt(c, 0, 6, s, { t, pose: o.load ? 'carry' : 'walk', facing, phase: o.phase || 0, noShadow: true });
  if (o.load) o.load(c, h.hx - x, h.hy - y);
  c.restore();
}

// ---------------- art: seeds, leaves, berries ----------------
function rr(c, x, y, w, h, r) { r = Math.max(0, Math.min(r, w / 2, h / 2)); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// a fat sunflower seed standing up (the top number's digits ride on these)
function seed(c, x, y, rx, ry, o = {}) {
  c.save(); c.translate(x, y); if (o.alpha != null) c.globalAlpha *= o.alpha;
  c.fillStyle = 'rgba(30,12,4,0.35)'; c.beginPath(); c.ellipse(2, 4, rx, ry, 0, 0, 7); c.fill();
  const path = () => { c.beginPath(); c.moveTo(0, -ry); c.bezierCurveTo(rx * 1.25, -ry * 0.75, rx * 1.05, ry * 0.65, 0, ry); c.bezierCurveTo(-rx * 1.05, ry * 0.65, -rx * 1.25, -ry * 0.75, 0, -ry); c.closePath(); };
  const gr = c.createRadialGradient(-rx * 0.35, -ry * 0.4, 2, 0, 0, ry * 1.1); gr.addColorStop(0, o.lite || '#fff0c0'); gr.addColorStop(0.6, o.col || '#f2c66a'); gr.addColorStop(1, o.dark || '#b8823a');
  path(); c.fillStyle = gr; c.fill(); c.strokeStyle = o.edge || '#6a3e14'; c.lineWidth = 2; c.stroke();
  c.save(); path(); c.clip(); c.strokeStyle = 'rgba(110,64,20,0.22)'; c.lineWidth = 3; for (const sx of [-0.55, 0.55]) { c.beginPath(); c.moveTo(sx * rx * 0.4, -ry); c.quadraticCurveTo(sx * rx * 1.1, 0, sx * rx * 0.3, ry); c.stroke(); } c.restore();
  if (o.ring) { c.strokeStyle = o.ring; c.lineWidth = 3; path(); c.stroke(); }
  c.restore();
}
// a leaf crumb lying flat (the bottom number's digits ride on these)
function leaf(c, x, y, rx, ry, rot, o = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); if (o.alpha != null) c.globalAlpha *= o.alpha;
  c.fillStyle = 'rgba(20,30,8,0.35)'; c.beginPath(); c.ellipse(2, 4, rx, ry, 0, 0, 7); c.fill();
  const path = () => { c.beginPath(); c.moveTo(-rx, 0); c.quadraticCurveTo(-rx * 0.2, -ry * 1.5, rx, -ry * 0.1); c.quadraticCurveTo(-rx * 0.1, ry * 1.5, -rx, 0); c.closePath(); };
  const gr = c.createLinearGradient(0, -ry, 0, ry); gr.addColorStop(0, '#c8f0a0'); gr.addColorStop(1, '#6aae4a'); path(); c.fillStyle = gr; c.fill(); c.strokeStyle = '#2e6a28'; c.lineWidth = 2; c.stroke();
  c.strokeStyle = 'rgba(46,106,40,0.4)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-rx * 0.85, 0); c.quadraticCurveTo(0, -ry * 0.12, rx * 0.9, -ry * 0.1); c.stroke();
  for (let k = -2; k <= 2; k++) { if (!k) continue; c.beginPath(); c.moveTo(k * rx * 0.3, -ry * 0.06); c.lineTo(k * rx * 0.3 + rx * 0.22, k > 0 ? -ry * 0.7 : ry * 0.6); c.stroke(); }
  c.restore();
}
function berry(c, x, y, r, glow) {
  c.save(); if (glow) { c.shadowColor = 'rgba(255,170,80,0.95)'; c.shadowBlur = 14 * glow; }
  const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r); gr.addColorStop(0, '#ffd0a0'); gr.addColorStop(0.5, CARC); gr.addColorStop(1, '#b8401a');
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.shadowBlur = 0; c.strokeStyle = '#8a2a10'; c.lineWidth = 1.6; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(x - r * 0.35, y - r * 0.4, r * 0.3, r * 0.18, -0.5, 0, 7); c.fill();
  c.strokeStyle = '#4a8a3a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x + 2, y - r - 5, x + 6, y - r - 6); c.stroke(); c.restore();
}

// ---------------- the scene: a garden ant hill in cross-section ----------------
const surf = x => 136 + Math.sin(x * 0.045 + 1) * 3 - 22 * Math.exp(-Math.pow((x - 318) / 34, 2));
function smooth(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } const l = pts[pts.length - 1]; c.lineTo(l[0], l[1]); }
function tunnel(c, pts, w) {
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  smooth(c, pts); c.strokeStyle = 'rgba(40,18,8,0.6)'; c.lineWidth = w + 6; c.stroke();
  smooth(c, pts); c.strokeStyle = '#a8703e'; c.lineWidth = w; c.stroke();
  c.translate(0, w * 0.12); smooth(c, pts); c.strokeStyle = '#be8a52'; c.lineWidth = w * 0.62; c.stroke();
  c.restore();
}
function tunnels(n) {
  return {
    top: [[-24, 178], [40, 172], [100, 180], [160, 172], [220, 174], [262, 180], [318, 156], [320, 128]],
    left: [[16, 182], [12, 260], [18, 360], [12, 460], [30, 520]],
    right: [[348, 190], [346, 300], [350, 400], [344, 470], [332, 520]],
    seeds: [[70, 556], [56, 584], [74, 604]],
    eggs: [[296, 556], [306, 588], [290, 606]],
  };
}
function antHill(c, W, H, n) {
  const T = tunnels(n);
  P.sky(c, W, 170, ['#ffb07a', '#ffd6a0', '#fff1c8'], { x: 66, y: 64, r: 22, color: '#fff2c0', glow: 170 });
  P.cloud(c, 230, 50, 0.5, '#fff6ea', '#f0c8b0', 0.9); P.cloud(c, 120, 30, 0.32, '#fff6ea', '#f0c8b0', 0.8);
  c.fillStyle = '#9cc874'; c.beginPath(); c.moveTo(0, 170); for (let x = 0; x <= W; x += 6) c.lineTo(x, 126 + Math.sin(x * 0.03) * 5); c.lineTo(W, 170); c.fill();
  // soil
  const soil = c.createLinearGradient(0, 110, 0, H); soil.addColorStop(0, '#9a6236'); soil.addColorStop(0.3, '#7a4a28'); soil.addColorStop(0.65, '#5e381e'); soil.addColorStop(1, '#3e2414');
  c.fillStyle = soil; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 3) c.lineTo(x, surf(x)); c.lineTo(W, H); c.closePath(); c.fill();
  c.save(); c.clip();
  [[220, 16, '#a06a40', 0.18], [300, 22, '#4a2814', 0.14], [480, 18, '#9a6440', 0.12], [585, 30, '#2a160a', 0.2]].forEach(([y, th, col, a], i) => {
    c.fillStyle = P.rgba(col, a); c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= W; x += 6) c.lineTo(x, y + Math.sin(x * 0.02 + i) * 6 + P.noise1(x * 0.05, i + 3) * 6);
    for (let x = W; x >= 0; x -= 6) c.lineTo(x, y + th + Math.sin(x * 0.025 + i * 2) * 5); c.closePath(); c.fill(); });
  const r = P.rng(31);
  for (let i = 0; i < 1200; i++) { const x = r() * W, y = 130 + r() * (H - 130); c.fillStyle = r() < 0.5 ? 'rgba(222,170,120,0.28)' : 'rgba(30,14,6,0.32)'; c.beginPath(); c.arc(x, y, 0.5 + r() * 1.3, 0, 7); c.fill(); }
  for (let i = 0; i < 10; i++) { const x0 = 10 + i * 37 + r() * 12; let x = x0, y = surf(x0), wdt = 2.6, ang = Math.PI / 2 + (r() - 0.5) * 0.6;
    c.strokeStyle = '#d8b48a'; c.lineCap = 'round';
    for (let k = 0; k < 5; k++) { const nx = x + Math.cos(ang) * 6, ny = y + Math.sin(ang) * 6; c.lineWidth = wdt; c.beginPath(); c.moveTo(x, y); c.lineTo(nx, ny); c.stroke(); x = nx; y = ny; wdt *= 0.8; ang += (r() - 0.5) * 0.8; } }
  for (let i = 0; i < 50; i++) { const x = r() * W, y = 150 + r() * (H - 150), rx = 2 + r() * 5, col = ['#b8a088', '#9a8a7a', '#c8b49a', '#8a7262', '#d0bca0'][i % 5];
    c.fillStyle = 'rgba(30,14,6,0.3)'; c.beginPath(); c.ellipse(x + 1, y + 1.5, rx, rx * 0.7, 0, 0, 7); c.fill();
    c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, rx * 0.7, r(), 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(x - rx * 0.3, y - rx * 0.25, rx * 0.4, rx * 0.22, 0, 0, 7); c.fill(); }
  // side tunnels, the gallery under the grass, and one shaft per column
  tunnel(c, T.left, 15); tunnel(c, T.right, 15); tunnel(c, T.seeds, 13); tunnel(c, T.eggs, 13); tunnel(c, T.top, 20);
  for (let j = 0; j < n; j++) { const x = colX(n, j); tunnel(c, [[x, 176], [x + 2, 270], [x - 2, 350], [x, CH_Y0 + 10]], 62); }
  tunnel(c, [[plusX(n), Y_BOT - 16], [plusX(n) + 30, Y_BOT - 12]], 44);
  // the answer chamber
  const blob = (x0, x1, y0, y1, pad) => { const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; c.beginPath(); c.moveTo(x0 - pad, cy); c.bezierCurveTo(x0 - pad, y0 - pad, x0 + 40, y0 - pad, cx, y0 - pad); c.bezierCurveTo(x1 - 40, y0 - pad, x1 + pad, y0 - pad, x1 + pad, cy); c.bezierCurveTo(x1 + pad, y1 + pad, x1 - 40, y1 + pad, cx, y1 + pad); c.bezierCurveTo(x0 + 40, y1 + pad, x0 - pad, y1 + pad, x0 - pad, cy); c.closePath(); };
  const ax0 = plusX(n) - 10, ax1 = colX(n, 0) + 74;
  blob(ax0, ax1, CH_Y0, CH_Y1, 4); c.fillStyle = 'rgba(40,18,8,0.65)'; c.fill();
  blob(ax0, ax1, CH_Y0, CH_Y1, 0); const rg = c.createRadialGradient(180, CH_Y0 + 36, 10, 180, CH_Y0 + 46, 190); rg.addColorStop(0, '#d8a466'); rg.addColorStop(1, '#9a6434'); c.fillStyle = rg; c.fill();
  // glowing mushrooms
  for (const [x, y, s] of [[ax0 + 16, CH_Y1 - 6, 0.9], [ax0 + 28, CH_Y1 - 4, 0.6], [ax1 - 4, CH_Y1 - 10, 0.7]]) { c.fillStyle = '#f4ead0'; rr(c, x - 2 * s, y - 13 * s, 4 * s, 13 * s, 2 * s); c.fill();
    c.fillStyle = '#9ae0d0'; c.beginPath(); c.ellipse(x, y - 13 * s, 9 * s, 6 * s, 0, Math.PI, 0); c.fill(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(x - 3 * s, y - 16 * s, 1.4 * s, 0, 7); c.fill(); }
  // seed store and nursery
  const room = (x, y, rx, ry) => { c.fillStyle = 'rgba(40,18,8,0.6)'; c.beginPath(); c.ellipse(x, y, rx + 4, ry + 4, 0, 0, 7); c.fill(); const g2 = c.createRadialGradient(x - 10, y - 8, 4, x, y, rx); g2.addColorStop(0, '#dcae74'); g2.addColorStop(1, '#a87240'); c.fillStyle = g2; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); };
  tunnel(c, [[70, 600], [80, 556], [ax0 + 30, CH_Y1 - 2]], 12); tunnel(c, [[290, 600], [300, 556], [ax1 - 40, CH_Y1]], 12); room(78, 612, 56, 22); room(286, 614, 58, 22);
  for (let i = 0; i < 14; i++) { const x = 48 + (i % 7) * 9 + (i > 6 ? 4 : 0), y = 624 - (i > 6 ? 7 : 0); c.fillStyle = '#e6c27a'; c.beginPath(); c.ellipse(x, y, 4.5, 3, 0.4, 0, 7); c.fill(); c.strokeStyle = '#a07a3a'; c.lineWidth = 1; c.stroke(); }
  for (let i = 0; i < 6; i++) { const x = 258 + i * 11, y = 624 - (i % 2) * 6; const g3 = c.createRadialGradient(x - 2, y - 3, 1, x, y, 7); g3.addColorStop(0, '#ffffff'); g3.addColorStop(1, '#e8e0d0'); c.fillStyle = g3; c.beginPath(); c.ellipse(x, y, 4.6, 6.4, 0.2, 0, 7); c.fill(); }
  // the twig root that is the line under the sum
  const lx0 = plusX(n) - 26, lx1 = colX(n, 0) + 36;
  c.lineCap = 'round'; c.strokeStyle = 'rgba(30,12,4,0.45)'; c.lineWidth = 9; c.beginPath(); c.moveTo(lx0 + 2, Y_LINE + 3); c.quadraticCurveTo(180, Y_LINE + 6, lx1 + 2, Y_LINE + 3); c.stroke();
  const tg = c.createLinearGradient(0, Y_LINE - 4, 0, Y_LINE + 4); tg.addColorStop(0, '#f2dcb0'); tg.addColorStop(1, '#b88a56'); c.strokeStyle = tg; c.lineWidth = 7; c.beginPath(); c.moveTo(lx0, Y_LINE); c.quadraticCurveTo(180, Y_LINE + 3, lx1, Y_LINE); c.stroke();
  c.strokeStyle = '#c89a62'; c.lineWidth = 2; c.beginPath(); c.moveTo(lx1 - 6, Y_LINE); c.quadraticCurveTo(lx1 + 8, Y_LINE - 4, lx1 + 14, Y_LINE + 8); c.moveTo(lx0 + 30, Y_LINE + 2); c.quadraticCurveTo(lx0 + 34, Y_LINE + 12, lx0 + 26, Y_LINE + 18); c.stroke();
  c.restore();
  // the mound and its door, grass and flowers along the surface
  c.fillStyle = 'rgba(255,220,170,0.28)'; for (let i = 0; i < 40; i++) { const x = 288 + r() * 60, y = surf(x) + r() * 10; c.beginPath(); c.arc(x, y, 0.8 + r() * 1.5, 0, 7); c.fill(); }
  c.fillStyle = '#2a140a'; c.beginPath(); c.ellipse(318, surf(318) + 6, 9, 5, 0, 0, 7); c.fill();
  for (let x = 0; x <= W; x += 2.4) { if (Math.abs(x - 318) < 28) continue; const h = 6 + P.noise1(x * 0.3, 5) * 10, y = surf(x) + 1; c.strokeStyle = P.mix('#4e8a3a', '#a8d070', P.noise1(x * 0.7, 2)); c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 1, y - h * 0.6, x + (P.noise1(x, 9) - 0.5) * 6, y - h); c.stroke(); }
  for (const [x, col] of [[30, '#ffffff'], [96, '#f4d35e'], [168, '#ee6c8a'], [228, '#ffffff'], [262, '#b98ae0']]) { const y = surf(x) - 12; c.strokeStyle = '#4e8a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y + 12); c.lineTo(x, y); c.stroke(); c.fillStyle = col; for (let k = 0; k < 6; k++) { c.beginPath(); c.ellipse(x + Math.cos(k) * 3.2, y + Math.sin(k) * 3.2, 2.6, 1.8, k, 0, 7); c.fill(); } c.fillStyle = '#f0a020'; c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); }
  P.grain(c, W, H, 0.05); P.vignette(c, W, H, 0.32, '#1e0e06');
}

// ---------------- moves ----------------
// Each column not yet added is one tall zone ('col' + j) from its carry spot down to its answer pocket. Every digit is
// inert, so a press anywhere in the column lands on the zone: a swipe down the column (or a tap on it) adds it up.
const colBox = (n, j) => ({ x: colX(n, j), y: (Y_CARRY - 30 + Y_ANS + 18) / 2, w: 64, h: Y_ANS + 18 - (Y_CARRY - 30) });
// The working note: the column's sum writes itself on a parchment slip right under the column, one term at a time as
// each digit lights up ("1 + 4 + 2"), then "= 7" (or "= 15"). Every part is its own node so it can light, fly and fade.
function placeNote(g, j) {
  const S = g.s, cin = S.cin[j], sum = colSum(S, j), hid = { alpha: 0 }, P = id => M.op('+', id + j, { ...hid });
  const parts = {
    c: cin ? M.num(1, 'nc' + j, { col: '#d0501a', ...hid }) : null, pc: cin ? P('npc') : null,
    t: M.num(S.A[j], 'nt' + j, { col: '#8a4a10', ...hid }), pb: P('npb'), b: M.num(S.B[j], 'nb' + j, { col: '#2c6e2a', ...hid }),
    eq: M.op('=', 'neq' + j, { ...hid }), r1: sum >= 10 ? M.num(1, 'nr1' + j, { col: '#c0401a', ...hid }) : null, r0: M.num(sum % 10, 'nr0' + j, { col: '#6a2a8a', ...hid }),
  };
  const e = M.row(parts.c, parts.pc, parts.t, parts.pb, parts.b, parts.eq, parts.r1, parts.r0); e.id = 'e' + j;
  const w = M.lay(e, NS).w, cx = M.clamp(colX(S.n, j), 12 + w / 2, 348 - w / 2); // right under its column, kept on screen
  M.place(g, 'ee' + j, e, cx, Y_NOTE, NS, { col: EXP_INK });
  M.inert(g, ['e' + j, ...Object.values(parts).filter(Boolean).map(q => q.id)]);
  S.note = { j, parts, e }; return parts;
}
const reveal = (g, q, T) => { if (!q) return; q.alpha = 1; M.writeIn(g, q, { dur: 0.16 * T }); };
// a swipe down the column: the streak runs down it, then its digits light up one after another while their terms
// write themselves into the note (carry first, then the top digit, then the bottom digit)
function swipeCol(g, j) {
  const S = g.s, T = M.pace(g); S.miss = null; S.swipe = { j, t0: g.t };
  S.runs.push({ x: colX(S.n, j) + 24, t0: g.t }); S.heroHop = g.t; S.point = true; g.sfx('whoosh');
  M.show(g, 0.55 * T); const p = placeNote(g, j), lit = [];
  if (S.cin[j]) lit.push(['c' + j, [p.c]]);
  lit.push(['t' + j, S.cin[j] ? [p.pc, p.t] : [p.t]], ['b' + j, [p.pb, p.b]]);
  lit.forEach(([id, qs], i) => M.at(g, [[(0.04 + i * (S.cin[j] ? 0.15 : 0.2)) * T, g => {
    const nd = M.node(g, id); M.light(g, nd, { col: id[0] === 'c' ? '#ff5a1a' : id[0] === 't' ? '#e05a00' : '#d07a00', dur: 0.12 * T }); M.tween(g, nd, { sc: 1.28 }, 0.24 * T, { yoyo: true });
    qs.forEach(q => reveal(g, q, T)); S.heroHop = g.t; g.sfx('tap', { pitch: 1 + i * 0.15 }); }]]));
}
// the sum: "= 15" writes itself, the 5 drops into the answer pocket, and the 1 lifts off and arcs over to the top of
// the next column, where an ant catches it with a sparkle
function addCol(g, j) {
  const S = g.s, n = S.n, sum = colSum(S, j), K = g.s.mk, T = M.pace(g), p = S.note.parts, carry = sum >= 10 && j + 1 < n;
  M.show(g, (carry ? 1.08 : 0.82) * T);
  delete K.zones['col' + j]; delete K.box['col' + j]; S.next = j + 1; if (carry) S.cin[j + 1] = 1;
  for (const q of [p.eq, p.r1, p.r0]) reveal(g, q, T * 1.3);
  M.at(g, [[0.12 * T, g => { M.indicate(g, p.r0, { sc: 1.35, dur: 0.25 * T }); if (p.r1) M.indicate(g, p.r1, { sc: 1.35, dur: 0.25 * T }); g.sfx('ding'); S.heroHop = g.t; }],
    [0.34 * T, g => { // the ones digit drops into the answer pocket
      const b = M.box(g, 'nr0' + j); p.r0.alpha = 0; g.sfx('swoosh');
      M.fly(g, { node: M.num(sum % 10), from: [b.x, b.y], to: 'a' + j, dur: 0.28 * T, arc: 18, s0: NS, s1: SZ, col: '#ffe9a8',
        then(g) { const a = M.node(g, 'a' + j); a.v = String(sum % 10); a.hide = false; a.pop = g.t; M.relayout(g, 'aa' + j); M.sparkle(g, 'a' + j, { n: 12 });
          g.burst(colX(n, j), Y_ANS - 15, ['#ffd45a', '#fff2c0', '#ff9a5a'], 12, 130); g.sfx(carry ? 'pop' : 'coin'); S.cheerAt = g.t;
          for (const id of ['t' + j, 'b' + j, 'c' + j]) { const nd = M.node(g, id); if (nd) { M.unlight(g, nd, { dur: 0.2 * T }); M.tween(g, nd, { alpha: 0.62 }, 0.25 * T); } } } });
      if (carry) { M.tween(g, p.r1, { dy: -10, sc: 1.3, hl: 1 }, 0.14 * T); S.catcher = { j: j + 1, t0: g.t }; } }],
    [0.48 * T, g => { if (!carry) return; // the 1 lifts off and arcs over to the top of the next column
      const b = M.box(g, 'nr1' + j); p.r1.alpha = 0; g.sfx('whoosh', { pitch: 1.3 });
      S.carry = { j, t0: g.t, dur: 0.42 * T, x0: b.x + (p.r1.dx || 0), y0: b.y - 10, x1: colX(n, j + 1), y1: Y_CARRY - 9 }; }],
    [0.6 * T, g => { M.tween(g, S.note.e, { alpha: 0 }, 0.2 * T); }],
    [(carry ? 0.9 : 0.66) * T, g => { if (carry) { const c1 = M.node(g, 'c' + (j + 1)); c1.hide = false; c1.pop = g.t; M.sparkle(g, 'c' + (j + 1), { n: 14, cols: ['#ff9a5a', '#ffd45a', '#fff'] });
      g.sfx('sparkle'); g.burst(colX(n, j + 1), Y_CARRY - 9, ['#ff9a5a', '#ffd45a'], 10, 100); S.caughtAt = g.t; } S.point = false; }],
    [(carry ? 1.0 : 0.8) * T, g => { delete K.ex['ee' + j]; if (S.note && S.note.j === j) S.note = null; }],
  ]);
}
function columnMoves(g) {
  const S = g.s, j = S.next; if (j >= S.n) return [];
  const a = S.A[j], b = S.B[j], c = S.cin[j], sum = a + b + c, glued = +(String(a) + String(b)), T = M.pace(g);
  const wrong = c ? [sum - 1, sum + 1, sum >= 10 ? sum % 10 : glued] : [sum >= 10 ? sum % 10 : sum + 1, glued, sum - 1, sum + 1];
  return [{ tap: 'col' + j, busy: 0.1, askAt: 0.55 * T, after: (sum >= 10 && j + 1 < S.n ? 1.08 : 0.82) * T, ask: { v: sum, wrong: wrong.filter(v => v >= 0 && v !== sum) }, then(g) { swipeCol(g, j); }, resolve(g) { addCol(g, j); } }];
}
// the guide: the next column always glows; the ghost hand swipes down it at level 0, after a 2-second pause, or after a fail
function drawGuide(g, c) {
  const S = g.s, K = S.mk; if (K.ask || K.busyT > 0 || (K.press && /^col/.test(K.press.id))) return;
  const failed = g.done && g.result === 'fail'; if (g.done && !failed) return; if (failed && g.t - g.doneAt < 0.3) return;
  const j = S.next; if (j >= S.n) return; const b = colBox(S.n, j), x = b.x;
  M.glowBox(c, b, g.t, 0.85);
  if (!(failed || g.level === 0 || g.t - K.moveT > 2)) return;
  const k = ((g.t - K.moveT) * 0.8) % 1, e = easeIO(clamp((k - 0.12) / 0.6, 0, 1)), y0 = Y_TOP - 34, y = lerp(y0, Y_ANS - 12, e), fade = k > 0.85 ? (1 - k) / 0.15 : 1;
  c.save(); c.globalAlpha = fade; c.lineCap = 'round';
  const gr = c.createLinearGradient(0, y0, 0, y); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,246,200,0.9)');
  c.strokeStyle = gr; c.lineWidth = 7; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y); c.stroke();
  c.fillStyle = 'rgba(255,246,200,0.9)'; c.beginPath(); c.moveTo(x - 9, Y_ANS - 30); c.lineTo(x + 9, Y_ANS - 30); c.lineTo(x, Y_ANS - 18); c.closePath(); c.globalAlpha = fade * 0.5 * (0.6 + 0.4 * Math.sin(g.t * 8)); c.fill();
  c.globalAlpha = fade; M.hand(c, x + 4, y + 4, 1, k < 0.12 || k > 0.72 ? 1 : 0); c.restore();
}
// the player's own swipe leaves a bright streak down the column
function drawSwipe(g, c) {
  const S = g.s, K = S.mk, P0 = K.press;
  if (P0 && /^col/.test(P0.id)) { const x = colX(S.n, +P0.id.slice(3)); c.save(); c.lineCap = 'round'; c.strokeStyle = 'rgba(255,240,180,0.75)'; c.lineWidth = 8; c.beginPath(); c.moveTo(x, P0.y0); c.lineTo(x, Math.max(P0.y0, P0.y)); c.stroke(); c.restore(); }
  const q = S.swipe; if (q) { const k = (g.t - q.t0) / (0.25 * M.pace(g)); if (k >= 0 && k < 1) { const x = colX(S.n, q.j), y0 = Y_CARRY - 20, y1 = Y_ANS - 10, y = lerp(y0, y1, ease(k));
    c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createLinearGradient(0, y0, 0, y); gr.addColorStop(0, 'rgba(255,220,120,0)'); gr.addColorStop(1, `rgba(255,230,150,${0.7 * (1 - k)})`); c.fillStyle = gr; rr(c, x - 26, y0, 52, Math.max(1, y - y0), 26); c.fill(); c.restore(); } }
}

MG.add({
  id: 'regroup', stage: 'carry', cmd: 'REGROUP!', hint: 'swipe', time: 9, mood: 'bright', winText: 'Regrouped!', hold: 1.4,
  card: {
    title: 'Regrouping', ref: 'Grade 3', kind: 'Addition',
    text: 'In column addition you write one number above the other, so that their digits line up in columns. The ones column is on the right. The tens column is to its left, and the hundreds column is to the left of that.\n\nAdd one column at a time, starting with the ones column. If a column adds up to 10 or more, write only the ones digit of that total under the column. Then carry the ten to the next column on the left: write a small 1 at the top of that column, and add it in with that column\'s digits. This is called regrouping.\n\nFor example, in 47 + 35 the ones column is 7 + 5 = 12. Write the 2 and carry the 1. The tens column is 1 + 4 + 3 = 8. So 47 + 35 = 82.\n\nHere is why it works. Ten ones make one ten, so 12 ones are 1 ten and 2 ones. The ten belongs in the tens column. In the same way, ten tens make one hundred.',
    note: 'Start with the ones column. When a column adds up to 10 or more, write its ones digit and carry a 1 to the top of the next column on the left.',
    ask: 'What is 58 + 26? What is 175 + 248?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    S.cin = Array(S.n + 1).fill(0); S.next = 0; S.miss = null; S.runs = []; S.carry = null; S.catcher = null; S.caughtAt = null; S.note = null; S.point = false; S.swipe = null; S.heroHop = -9; S.cheerAt = -9;
    const n = S.n, inert = ['plus'];
    M.place(g, 'plus', M.op('+', 'plus'), plusX(n), Y_BOT, SZ, { col: '#fff2d0' });
    for (let j = 0; j < n; j++) {
      const x = colX(n, j);
      M.place(g, 'tt' + j, M.num(S.A[j], 't' + j), x, Y_TOP, SZ, { col: SEED_INK });
      M.place(g, 'bb' + j, M.num(S.B[j], 'b' + j), x, Y_BOT, SZ, { col: LEAF_INK });
      if (j > 0) M.place(g, 'cc' + j, M.num(1, 'c' + j, { hide: true }), x, Y_CARRY, 26, { col: '#fff6ea' });
      M.place(g, 'aa' + j, M.num(0, 'a' + j, { hide: true }), x, Y_ANS, SZ, { col: ANS_INK });
      inert.push('t' + j, 'b' + j, 'c' + j, 'a' + j);
    }
    M.inert(g, inert);
    for (let j = 0; j < n; j++) M.zone(g, 'col' + j, colBox(n, j));
    g.dur *= (2.6 + 1.05 * n) / 8;
    S.flies = [0, 1, 2, 3, 4].map(i => ({ x: [36, 336, 110, 250, 180][i], y: [440, 300, 560, 540, 600][i], ph: i * 1.7 }));
    M.play(g, {
      moves: columnMoves,
      area(g) { return g.s.next < g.s.n ? 'col' + g.s.next : null; },
    });
  },
  update(g, dt) {
    M.update(g, dt);
    // the kit records a wrong move in missAt / missInfo (it only wobbles); act it out here. A swipe on a column further
    // left makes that column's digits slump, and a red "?" marks where its carry should be.
    const K = g.s.mk; if (K.missAt != null && K.missAt !== g.s.lastMiss) { g.s.lastMiss = K.missAt; const info = K.missInfo || {};
      if (K.ask || info.ask != null) g.s.miss = { t: g.t, ask: true }; else { const m = /^col(\d)$/.exec(info.tap || info.to || ''); if (m) g.s.miss = { t: g.t, kk: +m[1] }; } }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  // the bot swipes down the right column (and picks the right tile in medium mode)
  auto(g, dt, synth) {
    const K = g.s.mk; if (g.done) return;
    if (K.ask || K.busyT > 0 || g.t - K.moveT < 0.3) return M.auto(g, dt, synth);
    const j = g.s.next; if (j >= g.s.n) return; const x = colX(g.s.n, j);
    synth('down', x, Y_TOP - 20); for (let i = 1; i <= 4; i++) synth('move', x + 2, Y_TOP - 20 + i * (Y_ANS - Y_TOP) / 4); synth('up', x + 2, Y_ANS);
    K.moveT = g.t + 5;
  },
  draw(g, c) {
    const S = g.s, t = g.t, n = S.n, K = S.mk; c.drawImage(g.bake('add_anthill_v5_' + n, (o, w, h) => antHill(o, w, h, n)), 0, 0, W, H);
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missing = S.miss && !S.miss.ask && !won && t - S.miss.t < 1.2;
    // mushroom glow and fireflies
    c.save(); c.globalCompositeOperation = 'lighter';
    const glow = (x, y, r, col, a) => { const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, P.rgba(col, a)); gr.addColorStop(1, P.rgba(col, 0)); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); };
    glow(plusX(n) + 16, CH_Y1 - 14, 44, '#9ae0d0', 0.22 + Math.sin(t * 2) * 0.05); glow(colX(n, 0) + 70, CH_Y1 - 18, 36, '#9ae0d0', 0.2 + Math.sin(t * 2.3 + 1) * 0.05);
    for (const f of S.flies) { const x = f.x + Math.sin(t * 0.8 + f.ph) * 16, y = f.y + Math.cos(t * 1.1 + f.ph * 2) * 7, a = 0.5 + 0.4 * Math.sin(t * 3 + f.ph * 3); glow(x, y, 10, '#fff2a0', a * 0.7); c.fillStyle = `rgba(255,250,210,${a})`; c.beginPath(); c.arc(x, y, 1.5, 0, 7); c.fill(); }
    c.restore();
    // ants about their business in the tunnels around the sum
    const T = tunnels(n), sp = won ? 2.4 : 1;
    const crumb = (cc, x, y) => { cc.fillStyle = '#e6c27a'; cc.beginPath(); cc.ellipse(x, y, 4.5, 3, 0.4, 0, 7); cc.fill(); cc.strokeStyle = '#a07a3a'; cc.lineWidth = 1; cc.stroke(); };
    const leafBit = (cc, x, y) => { cc.fillStyle = '#7ac85a'; cc.beginPath(); cc.ellipse(x, y - 3, 8, 4, -0.4, 0, 7); cc.fill(); };
    pathAnt(c, T.top, t * 0.06 * sp, 0.4, t, { load: crumb });
    pathAnt(c, T.top.slice().reverse(), t * 0.05 * sp + 0.45, 0.4, t, { phase: 2 });
    pathAnt(c, T.right, t * 0.08 * sp + 0.2, 0.38, t, { load: leafBit, phase: 1 });
    pathAnt(c, T.left.slice().reverse(), t * 0.07 * sp + 0.6, 0.38, t, { phase: 3 });
    antArt(c, 290 + Math.sin(t * 0.9) * 16, 628, 0.38, { t, pose: 'walk', facing: Math.cos(t * 0.9) > 0 ? 1 : -1, phase: 5 });
    // the answer pockets
    for (let j = 0; j < n; j++) {
      const x = colX(n, j), y = Y_ANS - 15, filled = !M.node(g, 'a' + j).hide;
      c.save(); c.fillStyle = filled ? '#4a2614' : '#2e160a'; c.beginPath(); c.ellipse(x, y, 27, 27, 0, 0, 7); c.fill();
      c.strokeStyle = filled ? 'rgba(255,214,120,0.75)' : 'rgba(255,220,170,0.22)'; c.lineWidth = 2.5; c.setLineDash(filled ? [] : [5, 5]); c.beginPath(); c.ellipse(x, y, 27, 27, 0, 0, 7); c.stroke(); c.restore();
      if (filled) { c.save(); c.globalCompositeOperation = 'lighter'; glow(x, y, 34, '#ffb04a', 0.18); c.restore(); }
    }
    // a miss: the column's digits slump and wobble
    for (let j = 0; j < n; j++) for (const id of ['t' + j, 'b' + j]) { const nd = M.node(g, id); nd.dy = 0; nd.dx = 0; nd.mark = null; }
    if (missing) { const k = clamp((t - S.miss.t) / 0.5, 0, 1), d = Math.sin(k * Math.PI) * 12; for (const id of ['t' + S.miss.kk, 'b' + S.miss.kk]) { const nd = M.node(g, id); nd.dy = d; nd.dx = Math.sin(t * 40) * 3 * (1 - k); nd.mark = 'bad'; } }
    // token backings: seeds for the top number, leaf crumbs for the bottom number, berries for carried ones
    const pb = M.box(g, 'plus'); if (pb) { c.fillStyle = '#7a5a48'; c.beginPath(); c.ellipse(pb.x, pb.y + 2, 21, 18, 0, 0, 7); c.fill(); c.fillStyle = '#9a7a66'; c.beginPath(); c.ellipse(pb.x - 2, pb.y, 19, 16, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.ellipse(pb.x - 7, pb.y - 6, 7, 4, -0.4, 0, 7); c.fill(); }
    for (let j = 0; j < n; j++) {
      const tn = M.node(g, 't' + j), bn = M.node(g, 'b' + j), tb = M.box(g, 't' + j), bb = M.box(g, 'b' + j), used = tn.alpha != null && tn.alpha < 1;
      const ts = tn.sc ?? 1, bs = bn.sc ?? 1; // the backings swell with their digits when the working lights them up
      if (tn.hl > 0.01) { c.save(); c.globalCompositeOperation = 'lighter'; glow(tb.x, tb.y, 44 * ts, '#ffb04a', 0.45 * tn.hl); c.restore(); }
      seed(c, tb.x + (tn.dx || 0), tb.y + (tn.dy || 0), 23 * ts, 30 * ts, { alpha: tn.alpha ?? 1, ring: tn.mark === 'bad' ? M.BAD : tn.hl > 0.3 ? '#ffd45a' : null });
      if (bn.hl > 0.01) { c.save(); c.globalCompositeOperation = 'lighter'; glow(bb.x, bb.y, 46 * bs, '#ffd45a', 0.5 * bn.hl); c.restore(); }
      leaf(c, bb.x + (bn.dx || 0), bb.y + 2 + (bn.dy || 0), 33 * bs, 19 * bs, -0.12 + j * 0.1, { alpha: bn.alpha ?? 1 });
      if (bn.mark === 'bad') { c.save(); c.strokeStyle = M.BAD; c.lineWidth = 3; c.beginPath(); c.ellipse(bb.x + (bn.dx || 0), bb.y + 2 + (bn.dy || 0), 33, 21, 0, 0, 7); c.stroke(); c.restore(); }
      if (j > 0) { const cn = M.node(g, 'c' + j), cb = M.box(g, 'c' + j); if (!cn.hide) { c.save(); c.globalAlpha = cn.alpha ?? 1; berry(c, cb.x, cb.y, 15 * (cn.sc ?? 1), Math.max(cn.hl || 0, cn.pop != null ? Math.max(0, 1 - (t - cn.pop) / 0.6) : 0)); c.restore(); } }
    }
    // the working note's parchment slip grows as its terms write themselves
    if (S.note && K.ex['ee' + S.note.j]) { const q = S.note, bs = Object.values(q.parts).filter(p => p && p.alpha > 0.01).map(p => M.box(g, p.id)).filter(Boolean);
      if (bs.length) { const u = M.unionBox(bs), a = q.e.alpha ?? 1, x0 = u.x - u.w / 2 - 11, w = u.w + 22, h = NS * 1.22, y0 = u.y - h / 2;
        c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(30,12,4,0.35)'; rr(c, x0, y0 + 4, w, h, h / 2); c.fill(); const wg = c.createLinearGradient(0, y0, 0, y0 + h); wg.addColorStop(0, '#fbeccc'); wg.addColorStop(1, '#e2c48e'); c.fillStyle = wg; rr(c, x0, y0, w, h, h / 2); c.fill(); c.strokeStyle = '#8a5a2a'; c.lineWidth = 2; c.stroke(); c.restore(); } }
    if (missing && S.miss.kk >= 1 && !S.cin[S.miss.kk]) { const x = colX(n, S.miss.kk), y = Y_CARRY - 9, p = 1 + Math.sin(t * 8) * 0.07; c.save(); c.setLineDash([4, 4]); c.strokeStyle = '#ff5a5a'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 16 * p, 0, 7); c.stroke(); c.font = M.NUMF(24); c.fillStyle = '#ff6a6a'; c.textAlign = 'center'; c.fillText('?', x, y + 8); c.restore(); }
    drawGuide(g, c); drawSwipe(g, c);
    // the problem's digits
    M.drawEx(g, c, 'plus');
    for (let j = 0; j < n; j++) { M.drawEx(g, c, 'tt' + j); M.drawEx(g, c, 'bb' + j); if (j > 0) M.drawEx(g, c, 'cc' + j); M.drawEx(g, c, 'ee' + j); M.drawEx(g, c, 'aa' + j); }
    // an ant sprints down the swiped column; an ant hops the carried 1 up to the top of the next column
    for (const r of S.runs) { const k = (t - r.t0) / 0.28; if (k < 0 || k > 1.3) continue; c.save(); c.globalAlpha = clamp((1.3 - k) / 0.3, 0, 1); pathAnt(c, [[r.x, Y_TOP - 24], [r.x, Y_ANS - 32]], Math.min(0.999, k), 0.5, t, { phase: 1 }); c.restore(); }
    // a little ant waits at the top of the next column with its arms up; the carried 1 arcs up over the column, glowing,
    // trailing sparks, and lands in its arms with a sparkle; the ant cheers and scurries off
    if (S.catcher) { const q = S.catcher, x = colX(n, q.j) - 30, y = Y_CARRY + 14, caught = S.caughtAt != null && S.caughtAt >= q.t0, kk = caught ? (t - S.caughtAt) / 0.7 : 0, k0 = clamp((t - q.t0) / 0.15, 0, 1);
      if (kk < 1) { c.save(); c.globalAlpha = k0 * (caught ? clamp((1 - kk) / 0.4, 0, 1) : 1); antArt(c, x - (caught ? Math.max(0, kk - 0.5) * 60 : 0), y, 0.5, { t, pose: caught ? (kk < 0.5 ? 'cheer' : 'walk') : 'carry', expr: caught ? 'laugh' : 'wow', facing: caught && kk >= 0.5 ? -1 : 1, hop: caught && kk < 0.25 ? Math.sin(kk / 0.25 * Math.PI) : 0 }); c.restore(); } }
    if (S.carry) { const q = S.carry, k = (t - q.t0) / q.dur; if (k >= 0 && k < 1) {
      const e = easeIO(k), cx = (q.x0 + q.x1) / 2 - 6, cy = Y_CARRY - 96, bez = (a, b, m) => (1 - e) * (1 - e) * a + 2 * (1 - e) * e * m + e * e * b;
      const x = bez(q.x0, q.x1, cx), y = bez(q.y0, q.y1, cy), sc = 1 + Math.sin(e * Math.PI) * 0.35;
      for (let i = 1; i <= 6; i++) { const ee = Math.max(0, e - i * 0.03), tx = (1 - ee) * (1 - ee) * q.x0 + 2 * (1 - ee) * ee * cx + ee * ee * q.x1, ty = (1 - ee) * (1 - ee) * q.y0 + 2 * (1 - ee) * ee * cy + ee * ee * q.y1;
        c.save(); c.globalAlpha = 0.55 * (1 - i / 7); c.fillStyle = i % 2 ? '#ffd45a' : '#fff2c0'; c.beginPath(); c.arc(tx, ty, 5 - i * 0.6, 0, 7); c.fill(); c.restore(); }
      c.save(); c.translate(x, y); c.scale(sc, sc); berry(c, 0, 0, 15, 1); c.font = M.NUMF(22); c.textAlign = 'center'; c.fillStyle = '#fff6ea'; c.fillText('1', 0, 8); c.restore(); } }
    // the foreman ant watches from the end of the answer row
    let pose = 'idle', expr = 'happy';
    if (won) { pose = 'cheer'; expr = 'laugh'; } else if (missing) { pose = 'think'; expr = 'think'; } else if (lost) expr = 'sad'; else if (t - S.cheerAt < 0.5) { pose = 'cheer'; expr = 'wow'; } else if (S.point && M.showing(g)) { pose = 'point'; expr = 'happy'; }
    const hk = (t - S.heroHop) / 0.3, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0, hx = colX(n, 0) + 54, hy = CH_Y1 - 6;
    heroAnt(c, hx, hy, 0.85, { t, pose, expr, facing: -1, hop });
    if (missing) { const k = clamp((t - S.miss.t) / 0.2, 0, 1); c.save(); c.globalAlpha = k; c.fillStyle = '#fffaf0'; c.strokeStyle = '#7a4a3a'; c.lineWidth = 2;
      c.beginPath(); c.arc(hx - 14, hy - 62, 13 * k, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(hx - 8, hy - 44, 3.2, 0, 7); c.fill(); c.stroke(); c.font = M.NUMF(20); c.fillStyle = M.BAD; c.textAlign = 'center'; c.fillText('?', hx - 14, hy - 55); c.restore(); }
    M.drawAnims(g, c); M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
