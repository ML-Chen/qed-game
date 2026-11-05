// algebra_solve.js — SOLVE FOR x! Two-step linear equations (2x + 5 = 13), acted out on a seesaw on the ice at blue hour.
// The equation lives on the seesaw: the left side's terms hang on ice tiles under the left pan, the right side's under
// the right pan, and the = sign is carved into the ice pivot. The pans hold the same equation in things: the left pan
// has 2 mystery crates (each one is x) and 5 fish, the right pan has 13 fish. Every move's working plays by itself
// (show your work; the fuse stands still meanwhile):
//   1. drag the "+ 5" across the pivot (onto the 13 or the right pan): it is circled, then hops over the = sign on a
//      high arc and its + flips into a − at the top of the arc, landing as "13 − 5". Where it was, "+ 5 − 5 = 0" writes
//      itself and is crossed out. 5 fish leave BOTH pans (the 5 from the right pan leave dashed outlines).
//   2. tap "13 − 5": both numbers are circled, the "− 5" slides into the 13 and it rolls down to 8; the outlines pop.
//   3. drag the 2 across: "÷ 2" writes itself under both sides; on the left it flies into the 2, which is crossed out,
//      on the right a fraction bar draws itself and the ÷ 2 drops under it (8 / 2). Both pans split into 2 groups.
//   4. tap "8 / 2": the 2 rises into the 8, which rolls over to 4, and the bar shrinks away: x = 4. Every group but one
//      leaves each pan, and the last crate opens to show 4. The penguins hop on every landing.
// Moves 2 and 3 may come in either order (x = (13 − 5) ÷ 2 is fine). Dragging the 2 before moving the + 5 is the
// classic mistake (it divides only part of the left side): a wrong move, acted out by the seesaw tipping for a moment.
// Drops are forgiving: moving a term across counts when it is dropped anywhere on the right side of the pivot (RSIDE).
// Subtraction (3x − 4 = 11) works the same way with balloons: a balloon pulls its pan up, so it counts as −1.
// Level 0: a 2..3, x 1..5. Level 1: a 2..5, larger x. Level 2: subtraction, and sometimes a negative answer.
// Medium mode: the taps on "13 − 5" and "8 ÷ 2" open a tray to pick the result.
const M = MK;
const NOTEY = 470, PX = 180, PY = 352, PAN = 104, PANW = 120, BASE = 422, TS = 42, LCX = 86, RCX = 274; // pivot (top of the plank), pans, token row
const RSIDE = [PX + 26, PY - 96, 360, BASE + 52]; // x0, y0, x1, y1: everything right of the = sign, from above the pan to below the tiles
const INK = '#f4fbff', MOVED = '#ffe08a', RIGHT = '#b4f5c4';
const FISH_COLS = ['#9cc4de', '#b4d2e6', '#f0a868', '#9cc4de', '#c4d8e4'];
const str = v => String(v).replace(/^-/, '−');
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

function pickProblem(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let i = 0; i < 300; i++) {
    let a, x, k;
    if (L === 0) { a = ri(2, 3); x = ri(1, 5); k = ri(1, 6); }
    else if (L === 1) { a = ri(2, 5); x = ri(2, 8); k = ri(2, 9); }
    else {
      const u = g.rand();
      if (u < 0.4) { a = ri(2, 5); x = ri(2, 7); k = -ri(2, 9); }                                              // 3x − 4 = 11
      else if (u < 0.65) { a = ri(2, 3); x = -ri(1, 4); const lo = a * -x + 1; k = ri(lo, Math.max(lo, 12)); } // 2x + 9 = 3 → x = −3
      else { a = ri(2, 5); x = ri(3, 8); k = ri(2, 9); }
    }
    const c = a * x + k;
    if (c < 1 || c > 30 || (k < 0 && c - k > 32)) continue;
    return { a, x, k, c };
  }
  return { a: 2, x: 4, k: 5, c: 13 };
}

// ---------------- painting ----------------
// blue hour on the ice: deep sky with stars (the aurora is drawn live), dark mountains with lit snow, a frozen sea
function blueHour(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 480); sk.addColorStop(0, '#0c1430'); sk.addColorStop(0.45, '#1c3262'); sk.addColorStop(0.8, '#3d6a9c'); sk.addColorStop(1, '#7aa6c8');
  c.fillStyle = sk; c.fillRect(0, 0, W, 480);
  P.stars(c, W, 300, 70, 21, 0);
  // the moon
  const mg = c.createRadialGradient(312, 188, 2, 312, 188, 60); mg.addColorStop(0, 'rgba(230,240,255,0.5)'); mg.addColorStop(1, 'rgba(230,240,255,0)'); c.fillStyle = mg; c.fillRect(250, 128, 124, 120);
  c.fillStyle = '#eef4ff'; c.beginPath(); c.arc(312, 188, 13, 0, 7); c.fill(); c.fillStyle = '#1c3262'; c.beginPath(); c.arc(318, 184, 11, 0, 7); c.fill();
  const range = (base, hmin, hmax, body, lit, seed) => {
    const r = P.rng(seed), pts = []; let x = -20;
    while (x < W + 40) { const h = hmin + r() * (hmax - hmin); pts.push([x, base - h]); x += 22 + r() * 30; pts.push([x, base - h * (0.2 + r() * 0.3)]); x += 16 + r() * 24; }
    c.fillStyle = body; c.beginPath(); c.moveTo(-20, base); for (const [px, py] of pts) c.lineTo(px, py); c.lineTo(W + 40, base); c.closePath(); c.fill();
    c.fillStyle = lit; for (let i = 0; i + 1 < pts.length; i += 2) { const [px, py] = pts[i], [qx, qy] = pts[i + 1], [ox, oy] = i ? pts[i - 1] : [px - 30, base], d = 0.3;
      c.beginPath(); c.moveTo(px, py); c.lineTo(px + (qx - px) * d, py + (qy - py) * d); c.lineTo(px + (qx - px) * d * 0.5, py + (qy - py) * d * 0.75); c.lineTo(px + (ox - px) * d * 0.4, py + (oy - py) * d * 0.9); c.lineTo(px + (ox - px) * d, py + (oy - py) * d); c.closePath(); c.fill(); }
  };
  range(468, 50, 120, '#2a4672', 'rgba(205,228,250,0.7)', 5);
  range(474, 24, 64, '#3a5c8a', 'rgba(225,238,252,0.75)', 11);
  // frozen sea and the snowfield (in the blue shadow of evening)
  const sea = c.createLinearGradient(0, 470, 0, 492); sea.addColorStop(0, '#5a86b4'); sea.addColorStop(1, '#8cb4d6'); c.fillStyle = sea; c.fillRect(0, 470, W, 24);
  c.strokeStyle = 'rgba(230,244,255,0.5)'; c.lineWidth = 1; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(i * 50 - 10, 476 + (i % 3) * 5); c.lineTo(i * 50 + 22, 476 + (i % 3) * 5); c.stroke(); }
  const sn = c.createLinearGradient(0, 488, 0, H); sn.addColorStop(0, '#c6dbee'); sn.addColorStop(0.5, '#a8c4e0'); sn.addColorStop(1, '#8aa8cc'); c.fillStyle = sn;
  c.beginPath(); c.moveTo(0, 494); c.quadraticCurveTo(100, 484, 180, 490); c.quadraticCurveTo(270, 498, W, 486); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
  for (const [x, y, rx, ry] of [[60, 590, 130, 30], [300, 580, 120, 24], [180, 640, 200, 34]]) {
    const dg = c.createLinearGradient(0, y - ry, 0, y); dg.addColorStop(0, 'rgba(226,238,250,0.9)'); dg.addColorStop(1, 'rgba(170,196,224,0)');
    c.fillStyle = dg; c.beginPath(); c.ellipse(x, y, rx, ry, 0, Math.PI, 0); c.fill();
  }
  // an igloo with a warm light inside
  const ix = 318, iy = 526, ir = 30;
  c.fillStyle = 'rgba(40,60,100,0.3)'; c.beginPath(); c.ellipse(ix + 4, iy + 2, ir + 6, 6, 0, 0, 7); c.fill();
  const ig = c.createRadialGradient(ix - 12, iy - 22, 4, ix, iy - 8, ir + 6); ig.addColorStop(0, '#e8f2fc'); ig.addColorStop(1, '#94b4d6');
  c.fillStyle = ig; c.beginPath(); c.arc(ix, iy, ir, Math.PI, 0); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(70,100,150,0.45)'; c.lineWidth = 1.3;
  for (let k = 1; k < 3; k++) { const yy = iy - k * 10, hw = Math.sqrt(ir * ir - (k * 10) ** 2); c.beginPath(); c.moveTo(ix - hw, yy); c.lineTo(ix + hw, yy); c.stroke(); }
  const dl = c.createRadialGradient(ix - 14, iy - 2, 1, ix - 14, iy - 2, 30); dl.addColorStop(0, 'rgba(255,200,110,0.55)'); dl.addColorStop(1, 'rgba(255,200,110,0)'); c.fillStyle = dl; c.fillRect(ix - 46, iy - 32, 64, 44);
  c.fillStyle = '#ffc870'; c.beginPath(); c.arc(ix - 14, iy, 9, Math.PI, 0); c.closePath(); c.fill();
  c.fillStyle = '#ffe6b0'; c.beginPath(); c.arc(ix - 14, iy, 5, Math.PI, 0); c.closePath(); c.fill();
  // the ice pivot; its = sign is drawn as a token
  c.fillStyle = 'rgba(30,50,90,0.3)'; c.beginPath(); c.ellipse(184, 498, 58, 8, 0, 0, 7); c.fill();
  const wg = c.createLinearGradient(130, 370, 230, 496); wg.addColorStop(0, '#d8f0ff'); wg.addColorStop(0.5, '#7ab8e4'); wg.addColorStop(1, '#3a76b0');
  c.fillStyle = wg; c.beginPath(); c.moveTo(166, PY + 12); c.lineTo(194, PY + 12); c.lineTo(228, 496); c.lineTo(132, 496); c.closePath(); c.fill();
  c.strokeStyle = '#dff2ff'; c.lineWidth = 2; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.moveTo(170, PY + 16); c.lineTo(150, 492); c.lineTo(142, 492); c.closePath(); c.fill();
  c.fillStyle = '#d4e6f6'; c.beginPath(); c.ellipse(180, 496, 54, 7, 0, Math.PI, 0); c.fill();
  const r = P.rng(9); c.fillStyle = '#ffffff'; for (let i = 0; i < 46; i++) { const x = r() * W, y = 500 + r() * 140; c.globalAlpha = 0.4 + r() * 0.6; c.fillRect(x, y, 1.5, 1.5); } c.globalAlpha = 1;
}
// aurora ribbons, drawn every frame (additive light)
function aurora(c, t) {
  c.save(); c.globalCompositeOperation = 'lighter';
  const bands = [['rgba(90,255,180,', 120, 0], ['rgba(110,220,255,', 160, 2.1], ['rgba(220,120,255,', 96, 4.2]];
  for (const [col, base, ph] of bands) {
    const top = x => base + Math.sin(x * 0.018 + t * 0.35 + ph) * 22 + Math.sin(x * 0.041 - t * 0.5 + ph) * 9;
    const gr = c.createLinearGradient(0, base - 40, 0, base + 90); gr.addColorStop(0, col + '0)'); gr.addColorStop(0.35, col + '0.24)'); gr.addColorStop(0.6, col + '0.1)'); gr.addColorStop(1, col + '0)');
    c.fillStyle = gr; c.beginPath(); c.moveTo(-10, top(-10) - 30);
    for (let x = -10; x <= 370; x += 12) c.lineTo(x, top(x) - 30);
    for (let x = 370; x >= -10; x -= 12) c.lineTo(x, top(x) + 70 + Math.sin(x * 0.03 + t) * 10);
    c.closePath(); c.fill();
    c.strokeStyle = col + '0.22)'; c.lineWidth = 2; c.beginPath(); for (let x = -10; x <= 370; x += 12) { const y = top(x) - 2; x < 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  }
  c.restore();
}

// a penguin with a scarf (used when the animal cast ANI has no penguin yet); y is the feet line
function penguin(c, x, y, s, o = {}) {
  const t = o.t || 0, ph = o.ph || 0, f = o.facing || 1, pose = o.pose || 'idle', expr = o.expr || 'happy';
  const hop = pose === 'cheer' ? Math.abs(Math.sin(t * 8 + ph)) * 7 : pose === 'hop' ? Math.abs(Math.sin(t * 11 + ph)) * 5 : 0;
  const bob = Math.sin(t * 2.6 + ph) * 1.1;
  c.save(); c.translate(x, y); c.scale(s, s);
  if (!o.noShadow) { c.fillStyle = 'rgba(30,50,90,0.3)'; c.beginPath(); c.ellipse(0, 0, 16 - hop * 0.6, 4, 0, 0, 7); c.fill(); }
  c.translate(0, -hop);
  c.fillStyle = '#f39a2a'; c.strokeStyle = '#a85a14'; c.lineWidth = 1;
  for (const d of [-1, 1]) { c.beginPath(); c.ellipse(d * 7 + f * 1.5, -1.6, 7, 3, 0, 0, 7); c.fill(); c.stroke(); }
  c.rotate(o.lean || 0); c.translate(0, bob * 0.5);
  for (const d of [-1, 1]) {
    const a = pose === 'balance' ? 1.35 + Math.sin(t * 4 + ph + d) * 0.18 : pose === 'cheer' ? 2.55 + Math.sin(t * 13 + ph + d) * 0.3
      : pose === 'sad' ? 0.1 : pose === 'hop' ? 0.7 + Math.sin(t * 14 + d) * 0.35 : pose === 'wow' ? 1.9 + Math.sin(t * 20 + d) * 0.25 : 0.32 + Math.sin(t * 3 + ph + d) * 0.08;
    c.save(); c.translate(d * 13, -31); c.rotate(-d * a); c.fillStyle = '#26304a'; c.beginPath(); c.ellipse(0, 9, 4.6, 10.5, 0, 0, 7); c.fill(); c.restore();
  }
  const bg = c.createRadialGradient(-6, -38, 2, 0, -24, 26); bg.addColorStop(0, '#4a5c7c'); bg.addColorStop(1, '#1c2338');
  c.fillStyle = bg; c.beginPath(); c.ellipse(0, -24, 16, 23, 0, 0, 7); c.fill();
  c.strokeStyle = 'rgba(200,225,255,0.35)'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(0, -24, 16, 23, 0, Math.PI * 1.1, Math.PI * 1.5); c.stroke();
  const wb = c.createLinearGradient(0, -36, 0, -4); wb.addColorStop(0, '#ffffff'); wb.addColorStop(1, '#d4e2f0');
  c.fillStyle = wb; c.beginPath(); c.ellipse(f * 1.2, -18, 11, 15, 0, 0, 7); c.fill();
  c.beginPath(); c.arc(-4.5 + f * 1.5, -35, 6.2, 0, 7); c.arc(4.5 + f * 1.5, -35, 6.2, 0, 7); c.fill();
  const sc = o.scarf || '#e0505a';
  c.fillStyle = sc; c.beginPath(); c.ellipse(0, -27.5, 15.5, 4, 0, 0, 7); c.fill();
  const sw = Math.sin(t * 4 + ph) * 0.15; c.save(); c.translate(-f * 7, -26); c.rotate(-f * 0.15 + sw); c.fillRect(-3, 0, 6, 12); c.restore();
  c.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = -12; i <= 12; i += 6) c.fillRect(i, -29.5, 2, 4);
  const ex = f * 1.5;
  if (expr === 'laugh') { c.strokeStyle = '#1a1420'; c.lineWidth = 1.8; c.lineCap = 'round'; for (const d of [-1, 1]) { c.beginPath(); c.arc(d * 4.5 + ex, -34, 2.4, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } }
  else {
    const er = expr === 'wow' ? 2.8 : 2.2;
    for (const d of [-1, 1]) { c.fillStyle = '#1a1420'; c.beginPath(); c.ellipse(d * 4.5 + ex + f * 0.6, -35, er * 0.85, er, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(d * 4.5 + ex + f * 0.6 - 0.7, -36, er * 0.38, 0, 7); c.fill(); }
    if (expr === 'sad') { c.strokeStyle = '#1a1420'; c.lineWidth = 1.4; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * 2 + ex, -40.5); c.lineTo(d * 7 + ex, -38.6); c.stroke(); } }
  }
  c.fillStyle = 'rgba(240,110,130,0.45)'; for (const d of [-1, 1]) { c.beginPath(); c.ellipse(d * 8.5 + ex, -30.5, 2.6, 1.6, 0, 0, 7); c.fill(); }
  const open = expr === 'laugh' || expr === 'wow' || pose === 'hop' ? 2.2 : 0;
  c.fillStyle = '#f39a2a'; c.beginPath(); c.moveTo(ex - 3.4, -31.5); c.lineTo(ex + 3.4, -31.5); c.lineTo(ex + f * 1.2, -28 - open * 0.2); c.closePath(); c.fill();
  if (open) { c.fillStyle = '#d0702a'; c.beginPath(); c.moveTo(ex - 2.6, -30.4 + open); c.lineTo(ex + 2.6, -30.4 + open); c.lineTo(ex + f, -27 + open); c.closePath(); c.fill(); }
  c.restore();
}
function drawPenguin(c, x, y, s, o) {
  try { if (typeof ANI !== 'undefined' && ANI.draw && (!ANI.kinds || ANI.kinds.includes('penguin'))) {
    const pose = o.pose === 'balance' ? 'idle' : o.pose === 'wow' ? 'hop' : o.pose === 'sad' ? 'idle' : o.pose;
    c.save(); if (o.lean) { c.translate(x, y); c.rotate(o.lean); c.translate(-x, -y); }
    ANI.draw(c, 'penguin', x, y, s * 0.76, { t: o.t, phase: o.ph || 0, pose, expr: o.expr, facing: o.facing }); c.restore(); return; } } catch (e) { }
  penguin(c, x, y, s, o);
}
function fishPath(c) { c.beginPath(); c.ellipse(0, 0, 14, 7, 0, 0, 7); c.moveTo(11, 0); c.lineTo(21, -7); c.lineTo(21, 7); c.closePath(); }
function fish(c, s, col, ghost) {
  c.save(); c.scale(s, s);
  if (ghost) { c.setLineDash([3.5, 3]); c.strokeStyle = 'rgba(230,244,255,0.8)'; c.lineWidth = 1.8; c.fillStyle = 'rgba(200,230,255,0.15)'; fishPath(c); c.fill(); c.stroke(); }
  else { P.fishShape(c, 0, 0, 1, col); c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-2, -3, 7, 1.6, 0, 0, 7); c.fill(); }
  c.restore();
}
function balloon(c, x, y, col, glow) {
  c.save(); c.translate(x, y);
  if (glow) { c.shadowColor = '#ffd45a'; c.shadowBlur = 12; }
  const gr = c.createRadialGradient(-3, -4, 1, 0, 0, 11); gr.addColorStop(0, P.shade(col, 0.45)); gr.addColorStop(1, P.shade(col, -0.15));
  c.fillStyle = gr; c.beginPath(); c.ellipse(0, 0, 8, 10, 0, 0, 7); c.fill(); c.shadowBlur = 0;
  c.fillStyle = P.shade(col, -0.2); c.beginPath(); c.moveTo(-2, 10); c.lineTo(2, 10); c.lineTo(0, 7.5); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(-3, -4, 2, 3.2, -0.4, 0, 7); c.fill();
  c.restore();
}
// a wooden crate marked x, centred at 0,0; open > 0 lifts the lid and shows the value on its front
function crate(c, s, open, val) {
  const h = s / 2;
  c.fillStyle = 'rgba(20,30,60,0.3)'; c.fillRect(-h + 2, -h + 3, s, s);
  const gr = c.createLinearGradient(0, -h, 0, h); gr.addColorStop(0, '#e8ae6c'); gr.addColorStop(1, '#b0743a'); c.fillStyle = gr; c.fillRect(-h, -h, s, s);
  c.strokeStyle = '#6a3a18'; c.lineWidth = 1.6; c.strokeRect(-h, -h, s, s);
  c.strokeStyle = 'rgba(106,58,24,0.45)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-h, -h / 3); c.lineTo(h, -h / 3); c.moveTo(-h, h / 3); c.lineTo(h, h / 3); c.stroke();
  c.fillStyle = 'rgba(255,248,230,0.94)'; c.beginPath(); c.arc(0, 1, h * 0.64, 0, 7); c.fill();
  if (open > 0 && val != null) {
    const v = str(val), fs = s * (v.length > 1 ? 0.5 : 0.62) * (1 + Math.sin(Math.min(1, open) * Math.PI) * 0.4);
    c.font = MK.NUMF(fs, 700); c.fillStyle = '#1f8a4a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(v, 0, 2);
  } else { c.font = MK.VARF(s * 0.62); c.fillStyle = '#3a1640'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('x', 0, 0); }
  c.save(); c.translate(-h, -h); c.rotate(-Math.min(1, open) * 1.1);
  c.fillStyle = '#c88a4a'; c.fillRect(-1, -4, s + 2, 4); c.strokeStyle = '#6a3a18'; c.lineWidth = 1.2; c.strokeRect(-1, -4, s + 2, 4); c.restore();
}
// an ice tile behind a token (b is its box, centre x, y), hanging from the plank on two cords
function iceTile(c, b, plankY, alpha, glow) {
  const x0 = b.x - b.w / 2 - 5, y0 = b.y - b.h / 2 - 7, w = b.w + 10, h = b.h + 14;
  c.save(); c.globalAlpha *= alpha;
  c.strokeStyle = 'rgba(210,230,250,0.7)'; c.lineWidth = 1.5;
  for (const cx of [x0 + 7, x0 + w - 7]) { c.beginPath(); c.moveTo(cx, plankY); c.lineTo(cx, y0 + 2); c.stroke(); }
  c.fillStyle = 'rgba(10,20,50,0.3)'; rr(c, x0 + 2, y0 + 4, w, h, 9); c.fill();
  const gr = c.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, glow ? '#7ab8ec' : '#5f9fd6'); gr.addColorStop(1, glow ? '#3d74b8' : '#2c5c98');
  c.fillStyle = gr; rr(c, x0, y0, w, h, 9); c.fill();
  c.strokeStyle = 'rgba(220,240,255,0.85)'; c.lineWidth = 1.8; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.22)'; rr(c, x0 + 4, y0 + 3, w - 8, 5, 3); c.fill();
  c.fillStyle = 'rgba(220,240,255,0.75)'; for (const fx of [0.25, 0.55, 0.8]) { const ix = x0 + w * fx; c.beginPath(); c.moveTo(ix - 3, y0 + h - 1); c.lineTo(ix + 3, y0 + h - 1); c.lineTo(ix, y0 + h + 5 + fx * 4); c.closePath(); c.fill(); }
  c.restore();
}

// ---------------- the seesaw model ----------------
// Each pan holds items: { kind: 'box' | 'fish' | 'balloon', st: 'on' | 'ghost' | 'tag', grp, x, y (pan-local, up is
// negative; for balloons y is the height above the pan), tx, ty, leaveAt, ghostAt, popAt }. A fish weighs +1, a
// balloon −1, a box x. Items glide to their places; the timed fields stagger leaving and popping into a quick stream.
function mkItem(kind, st, extra) { return { kind, st, grp: 0, x: 0, y: 0, tx: 0, ty: 0, seed: Math.random(), col: kind === 'balloon' ? '#e85a6a' : FISH_COLS[Math.floor(Math.random() * FISH_COLS.length)], born: -9, ...extra }; }
function toWorld(S, side, lx, ly) { const th = S.th, cs = Math.cos(th), sn = Math.sin(th), px = (side === 'L' ? -PAN : PAN) + lx; return [PX + px * cs - ly * sn, PY + px * sn + ly * cs]; }
function layoutPan(S, side) {
  const pan = S.pans[side], live = pan.items.filter(it => it.leaveAt == null && it.popAt == null);
  const place = (list, x0, x1) => {
    const boxes = list.filter(i => i.kind === 'box'), wts = list.filter(i => i.kind === 'fish'), bals = list.filter(i => i.kind === 'balloon');
    const bs = S.boxS, cols = boxes.length <= 2 ? boxes.length : Math.ceil(boxes.length / 2), step = bs + 3;
    boxes.forEach((it, i) => { const row = Math.floor(i / cols), inRow = Math.min(cols, boxes.length - row * cols), col = i % cols;
      it.tx = x0 + 2 + (col + 0.5) * step + (cols - inRow) * step / 2; it.ty = -row * (bs + 1) - bs / 2 - 1; });
    const fx0 = boxes.length ? x0 + 4 + cols * step + 4 : x0 + 2, fw = Math.max(18, x1 - 2 - fx0), per = Math.max(1, Math.floor(fw / 22));
    wts.forEach((it, i) => { const row = Math.floor(i / per), col = i % per, inRow = Math.min(per, wts.length - row * per);
      it.tx = fx0 + fw / 2 + (col - (inRow - 1) / 2) * (fw / per) + (row % 2 ? 2.5 : -2.5); it.ty = -row * 8.5 - 6; });
    const bper = Math.max(1, Math.min(6, Math.floor(fw / 15)));
    bals.forEach((it, i) => { const row = Math.floor(i / bper), col = i % bper, inRow = Math.min(bper, bals.length - row * bper);
      it.tx = fx0 + fw / 2 + (col - (inRow - 1) / 2) * Math.min(18, fw / bper); it.ty = 50 + row * 17 + (col % 2) * 6; it.anchor = it.tx; });
  };
  if ((pan.groups || 1) === 1) place(live, -PANW / 2, PANW / 2);
  else { const n = pan.groups, gw = PANW / n; for (let k = 0; k < n; k++) place(live.filter(i => i.grp === k), -PANW / 2 + k * gw, -PANW / 2 + (k + 1) * gw); }
}
function groupPan(S, side, n) {
  const pan = S.pans[side], live = pan.items.filter(it => it.leaveAt == null && it.popAt == null);
  for (const kind of ['box', 'fish', 'balloon']) { const l = live.filter(i => i.kind === kind), q = Math.max(1, l.length / n); l.forEach((it, j) => { it.grp = Math.min(n - 1, Math.floor(j / q)); }); }
  pan.groups = n; pan.groupAt = S.g.t; layoutPan(S, side);
}
// an item leaves its pan: fish fly to a helper penguin's beak, crates to its flippers, balloons float up into the sky
function launch(S, side, it, g) {
  const h = S.helpers[side === 'L' ? 0 : 1];
  if (it.kind === 'balloon') { const [ax, ay] = toWorld(S, side, it.anchor ?? it.x, -2); S.fl.push({ kind: 'balloon', x0: ax, y0: ay - it.y, t0: g.t, float: true, col: it.col, seed: it.seed }); g.sfx('whoosh'); return; }
  const [wx, wy] = toWorld(S, side, it.x, it.y);
  S.fl.push({ kind: it.kind, x0: wx, y0: wy, x1: h.x + h.f * 4, y1: h.y - 34, t0: g.t, dur: 0.42, col: it.col, seed: it.seed, helper: h, rot: (it.seed - 0.5) * 8 });
}

MG.add({
  id: 'solve', stage: 'twostep', cmd: 'SOLVE FOR x!', hint: 'drag', time: 8, mood: 'sea', winText: 'Solved!', hold: 1.4,
  card: {
    title: 'Solving equations', ref: 'Grade 7', kind: 'Algebra',
    text: 'An equation says that two amounts are equal, such as 2x + 5 = 13. The letter x stands for a number we do not know yet. Solving the equation means finding that number.\n\nPicture the equation as a level seesaw. Whatever you do to one side, you must also do to the other side, or the seesaw tips.\n\nFirst undo the adding. Take 5 away from both sides, so 2x = 13 − 5, which is 8. Moving the + 5 across the = sign and turning it into − 5 does the same thing.\n\nThen undo the multiplying. 2x means 2 times x, so split both sides into 2 equal parts: x = 8 ÷ 2, which is 4.\n\nTo check, put 4 back in: 2 × 4 + 5 = 13.',
    note: 'Move the added or subtracted number across the = sign, and change + to − or − to +. Then divide both sides by the number in front of x.',
    ask: 'Solve 3x + 4 = 19. Solve 2x − 6 = 10.',
  },
  init(g) {
    const S = g.s; M.setup(g); S.g = g; const p = S.p = pickProblem(g), { a, x, k, c } = p, ak = Math.abs(k), r = c - k;
    g.dur *= (2.6 + 1.05 * 4) / 8; // four moves: move the constant, compute, move the coefficient, divide
    // the two sides of the equation hang under their pans; the = sign is on the pivot
    S.nA = M.num(a, 'a'); S.nX = M.vr('x', 'x'); S.bterm = M.row(M.op(k > 0 ? '+' : '-'), M.num(ak)); S.bterm.id = 'bterm';
    S.nC = M.num(c, 'c'); S.right = S.nC; S.slides = [];
    S.relay = (slideIds = []) => {
      const old = {}; for (const id of slideIds) { const b = M.box(g, id); if (b) old[id] = { ...b }; }
      const left = S.lDiv ? [S.nX] : [S.nA, S.nX]; if (!S.bGone) left.push(M.gap(12), S.bterm);
      M.place(g, 'L', M.row(...left), LCX, BASE, TS, { col: INK }); M.place(g, 'R', M.row(S.right), RCX, BASE, TS, { col: INK });
      for (const id of slideIds) { const n = M.node(g, id), b = M.box(g, id); if (n && b && old[id]) { const dx = old[id].x - b.x, dy = old[id].y - b.y; if (Math.abs(dx) + Math.abs(dy) > 1) { n.dx = dx; n.dy = dy; S.slides.push({ n, dx, dy, t0: g.t }); } } }
    };
    S.relay(); M.place(g, 'EQ', M.op('=', 'eq'), PX, BASE, TS, { col: '#eaf6ff' }); M.inert(g, ['eq']);
    M.zone(g, 'rpan', { x: (RSIDE[0] + RSIDE[2]) / 2, y: (RSIDE[1] + RSIDE[3]) / 2, w: RSIDE[2] - RSIDE[0], h: RSIDE[3] - RSIDE[1] });
    // the seesaw
    S.boxS = a > 3 ? 23 : 29; S.th = 0; S.om = 0; S.thT = 0; S.fl = []; S.puffs = []; S.revealAt = -9; S.hopAt = -9;
    S.pans = { L: { items: [] }, R: { items: [] } };
    for (let i = 0; i < a; i++) S.pans.L.items.push(mkItem('box', 'on'));
    for (let i = 0; i < ak; i++) S.pans.L.items.push(mkItem(k > 0 ? 'fish' : 'balloon', 'on'));
    for (let i = 0; i < c; i++) S.pans.R.items.push(mkItem('fish', 'on'));
    for (const side of ['L', 'R']) { layoutPan(S, side); for (const it of S.pans[side].items) { it.x = it.tx; it.y = it.ty; } }
    S.helpers = [{ x: 40, y: 530, f: 1, ph: 0, scarf: '#e0505a', munchAt: -9, actAt: -9 }, { x: 320, y: 530, f: -1, ph: 1.7, scarf: '#3ab0a0', munchAt: -9, actAt: -9 }];
    S.flakes = [...Array(40)].map(() => ({ x: Math.random() * 360, y: Math.random() * 680, v: 10 + Math.random() * 20, r: 0.7 + Math.random() * 1.7, ph: Math.random() * 7 }));
    S.slideOff = Math.random() * 6;
    const burst = (g, id, n = 12) => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffe08a', '#9af0ff', '#ffffff'], n, 130); };
    const act = (g, who) => { S.hopAt = g.t; for (const i of who) S.helpers[i].actAt = g.t; };
    const T = M.pace(g), offL = () => -PAN * Math.sin(S.th), offR = () => PAN * Math.sin(S.th);
    g.s.mk.relay = () => S.relay(); // M.roll with a delay re-lays the expression when the digits change
    const sgnRow = (pos, v) => M.row(M.op(pos ? '+' : '-'), M.num(v));
    // the moved term hops over the = sign on a high arc; at the top of the arc its sign flips (+ turns into −)
    const hopTerm = (g, from, plusToMinus, dur) => M.anim(g, { dur, draw(c, g, kk) {
      const to = M.unionBox([M.box(g, 'dop'), M.box(g, 'dk')]); if (!to) return;
      const ax = from.x, ay = from.y + offL(), bx = to.x, by = to.y + offR(), H = 84, path = u => [M.lerp(ax, bx, u), M.lerp(ay, by, u) - Math.sin(u * Math.PI) * H];
      const e = M.easeIO(kk), [x, y] = path(e), s = TS * (1 + 0.2 * Math.sin(e * Math.PI)), f = M.clamp((e - 0.38) / 0.24, 0, 1), vert = plusToMinus ? 1 - f : f;
      c.save(); c.strokeStyle = 'rgba(255,224,138,0.55)'; c.lineWidth = 2.5; c.setLineDash([2, 7]); c.lineCap = 'round'; c.beginPath();
      for (let i = 0; i <= 20; i++) { const [px, py] = path(e * i / 20); i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); c.restore();
      const nn = M.num(ak), m = M.lay(nn, s), sw = s * 0.94, w = sw + m.w, x0 = x - w / 2, yb = y + (m.a - m.d) / 2, cx = x0 + sw / 2, cy = yb - s * 0.3, r = s * 0.2;
      c.save(); c.shadowColor = MOVED; c.shadowBlur = 16; c.strokeStyle = MOVED; c.lineWidth = s * 0.08; c.lineCap = 'round';
      c.translate(cx, cy); c.rotate(f * Math.PI); c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); if (vert > 0.02) { c.moveTo(0, -r * vert); c.lineTo(0, r * vert); } c.stroke(); c.restore();
      c.save(); c.shadowColor = MOVED; c.shadowBlur = 16; M.draw(c, nn, x0 + sw, yb, s, { t: g.t, col: MOVED }); c.restore();
    } });
    // the right side works out its value: the "− 5" slides into the 13 and it rolls over to 8
    const computeRight = g => {
      S.computed = true; M.show(g, 0.85 * T);
      const bc = M.box(g, 'c'); for (const q of [S.dOp, S.dK]) { const b = M.box(g, q.id); if (bc && b) M.tween(g, q, { dx: bc.x - b.x, alpha: 0, sc: 0.5 }, 0.3 * T); }
      M.roll(g, S.nC, r, { delay: 0.12 * T, dur: 0.36 * T }); M.indicate(g, S.nC, { delay: 0.3 * T, dur: 0.35 * T, sc: 1.25, col: MOVED });
      M.at(g, [[0.45 * T, g => {
        S.nC.id = 'r'; S.nR = S.nC; if (S.rDiv) S.quot.n = S.nR; else S.right = S.nR;
        S.relay(); burst(g, 'r', 14); g.sfx('coin'); act(g, [1]);
        // the dashed outlines (fish already taken away) pop; fish and balloons that were added settle in
        let i = 0; for (const it of S.pans.R.items) { if (it.st === 'ghost') { it.popAt = Math.max(g.t + 0.02 + i * 0.03, (it.ghostAt || 0) + 0.1); i++; } else if (it.st === 'tag') { it.st = 'on'; it.settle = g.t + i * 0.03; i++; } }
        if (S.divided) groupPan(S, 'R', a); else layoutPan(S, 'R');
        S.om += 0.2; }]]);
    };
    M.play(g, {
      moves(g) {
        if (S.solved) return [];
        const out = [];
        if (!S.moved) out.push({
          // move the constant across the = sign: it hops over on an arc and its sign flips, the left side shows
          // "+ 5 − 5 = 0" crossed out, and the same amount leaves both pans
          drag: 'bterm', to: ['c', 'rpan'], area: RSIDE, busy: 0.1,
          then(g) {
            S.moved = true; M.show(g, 1.45 * T); act(g, [0]); g.sfx('tap');
            M.circle(g, 'bterm', { dur: 0.45 * T, col: MOVED }); M.indicate(g, 'bterm', { dur: 0.35 * T, col: MOVED, sc: 1.18 });
            M.at(g, [
              [0.25 * T, g => {
                const from = { ...M.box(g, 'bterm') }; for (const q of S.bterm.items) q.alpha = 0.22; // a faint ghost stays where it was until the 0 is crossed out
                S.dOp = M.op(k > 0 ? '-' : '+', 'dop', { col: MOVED, alpha: 0 }); S.dK = M.num(ak, 'dk', { col: MOVED, alpha: 0 });
                S.diff = M.row(S.nC, S.dOp, S.dK); S.diff.id = 'diff'; S.right = S.diff; S.relay(); g.sfx('swoosh'); S.hopAt = g.t;
                hopTerm(g, from, k > 0, 0.62 * T);
                M.at(g, [[0.31 * T, g => { const be = M.box(g, 'eq'); if (be) g.burst(be.x, be.y - 70, ['#ffe08a', '#fff'], 8, 90); }],
                  [0.62 * T, g => { // the term lands on the right side
                    S.dOp.alpha = 1; S.dK.alpha = 1; S.dOp.pop = g.t; S.dK.pop = g.t; burst(g, 'dk', 14); g.sfx('snap'); act(g, [0, 1]);
                    const L = S.pans.L, R = S.pans.R, step = Math.min(0.05, 0.4 / ak);
                    L.items.filter(it => it.kind === (k > 0 ? 'fish' : 'balloon')).slice(-ak).forEach((it, i) => { it.leaveAt = g.t + 0.02 + i * step; });
                    if (k > 0) {
                      const on = R.items.filter(it => it.kind === 'fish' && it.st === 'on'), take = Math.min(ak, on.length);
                      on.slice(on.length - take).reverse().forEach((it, i) => { it.st = 'ghost'; it.ghostAt = g.t + 0.02 + i * step; });
                      for (let i = take; i < ak; i++) R.items.push(mkItem('balloon', 'tag', { born: g.t + 0.1 + (i - take) * 0.04 }));
                    } else for (let i = 0; i < ak; i++) R.items.push(mkItem('fish', 'tag', { born: g.t + 0.05 + i * 0.04 }));
                    layoutPan(S, 'L'); layoutPan(S, 'R');
                    for (const it of R.items) if (it.st === 'tag' && !it.placed) { it.placed = true; it.x = it.tx; it.y = it.kind === 'balloon' ? it.ty - 30 : it.ty - 90; }
                    S.om += 0.1; }]]);
                // what is left behind on the left: + 5 − 5 = 0, written under the left side and crossed out
                const lb = M.box(g, 'a'); S.zero = M.row(sgnRow(k > 0, ak), sgnRow(k < 0, ak), M.op('='), M.num(0));
                M.place(g, 'nL', S.zero, Math.max(70, Math.min(110, from.x - 10)), NOTEY, 24, { col: MOVED }); M.writeIn(g, S.zero, { dur: 0.4 * T, delay: 0.1 * T }); }],
              [1.0 * T, g => { M.strike(g, S.zero, { dur: 0.22 * T }); g.sfx('tap'); }],
              [1.2 * T, g => { M.tween(g, S.zero, { alpha: 0 }, 0.22 * T); for (const q of S.bterm.items) M.tween(g, q, { alpha: 0 }, 0.2 * T); }],
              [1.43 * T, g => { delete g.s.mk.ex.nL; S.bGone = true; S.relay(); }],
            ]);
          },
        });
        else {
          if (!S.computed) out.push({
            tap: ['diff', 'c', 'dop', 'dk'], busy: 0.1, askAt: 0.45 * T, after: 0.85 * T,
            ask: r < 0 ? { v: r, wrong: [c + k, -r, r + 1, r - 1] } : { v: r, wrong: [c + k, r - 1, r + 1, -r] },
            then(g) { M.show(g, 0.45 * T); act(g, [1]); M.circle(g, ['c', 'dk'], { dur: 0.45 * T, col: MOVED });
              M.indicate(g, S.nC, { dur: 0.3 * T, sc: 1.2, col: MOVED }); M.indicate(g, S.dK, { delay: 0.15 * T, dur: 0.3 * T, sc: 1.2, col: MOVED }); },
            resolve(g) { computeRight(g); },
          });
          if (!S.divided) out.push({
            // move the coefficient across: "÷ 2" writes itself under both sides, then each side collapses (2x ÷ 2 = x,
            // and the right side gets a fraction bar with the 2 under it), and both pans split into a equal groups
            drag: 'a', to: S.computed ? ['r', 'rpan'] : ['diff', 'c', 'dop', 'dk', 'rpan'], area: RSIDE, busy: 0.1,
            then(g) {
              S.divided = true; M.show(g, 1.4 * T); act(g, [0]); g.sfx('tap');
              M.circle(g, 'a', { dur: 0.4 * T, col: MOVED }); M.indicate(g, 'a', { dur: 0.35 * T, col: MOVED, sc: 1.25 });
              const lb = M.unionBox([M.box(g, 'a'), M.box(g, 'x')]), rb = M.box(g, S.right.id), dv = () => M.row(M.op('÷'), M.num(a));
              M.note(g, { node: dv(), at: [lb.x, NOTEY], s: 28, col: MOVED, delay: 0.05 * T, write: 0.28 * T, hold: 0.22 * T, to: 'a', fly: 0.25 * T, s1: 30, arc: 14,
                then(g) { M.strike(g, 'a', { dur: 0.16 * T }); M.tween(g, S.nA, { alpha: 0 }, 0.2 * T, { delay: 0.18 * T }); g.sfx('tap'); } });
              M.note(g, { node: dv(), at: [rb.x, NOTEY], s: 28, col: MOVED, delay: 0.15 * T, write: 0.28 * T, hold: 0.25 * T, to: 'den', fly: 0.3 * T, s1: TS * 0.82, arc: -8,
                then(g) { S.den.alpha = 1; S.den.pop = g.t; M.sparkle(g, 'den', { n: 8 }); g.sfx('snap'); act(g, [1]); } });
              M.at(g, [
                [0.6 * T, g => { S.den = M.num(a, 'den', { col: MOVED, alpha: 0 }); S.quot = M.frac(S.computed ? S.nR : S.diff, S.den, 'quot', { bar: { t0: g.t + 0.25, dur: 0.3 * T } }); // the bar draws once the top has glided up
                  S.rDiv = true; S.right = S.quot; S.relay(); groupPan(S, 'L', a); if (S.computed) groupPan(S, 'R', a); S.om -= 0.15; }],
                [1.15 * T, g => { S.lDiv = true; S.relay(); M.sparkle(g, 'x', { n: 8 }); S.hopAt = g.t; }],
              ]);
            },
          });
          if (S.divided && S.computed) out.push({
            tap: ['quot', 'den', 'r'], busy: 0.1, askAt: 0.45 * T, after: 1.0 * T,
            ask: { v: x, wrong: x < 0 ? [r * a, -x, r - a, x - 1] : [r * a, r - a, a, r + a, x + 1, x - 1] },
            then(g) { M.show(g, 0.45 * T); act(g, [1]); M.circle(g, 'quot', { dur: 0.45 * T, col: RIGHT });
              M.indicate(g, S.nR, { dur: 0.3 * T, sc: 1.15, col: RIGHT }); M.indicate(g, S.den, { delay: 0.15 * T, dur: 0.3 * T, sc: 1.2, col: RIGHT }); },
            resolve(g) {
              M.show(g, 1.0 * T); const bn = M.box(g, 'r'), bd = M.box(g, 'den'), bq = { ...M.box(g, 'quot') };
              // the 2 rises into the 8, the 8 rolls over to 4, and the fraction bar shrinks away
              if (bn && bd) M.tween(g, S.den, { dy: bn.y - bd.y, alpha: 0, sc: 0.5 }, 0.3 * T);
              M.roll(g, S.nR, x, { delay: 0.12 * T, dur: 0.36 * T }); g.sfx('swoosh');
              M.anim(g, { delay: 0.3 * T, dur: 0.2 * T, draw(c, g, kk) { const w = (bq.w - TS * 0.2) * (1 - M.easeIO(kk)); c.fillStyle = INK; c.fillRect(bq.x - w / 2, BASE - TS * 0.33 + offR(), w, TS * 0.07); } });
              M.at(g, [[0.3 * T, g => { S.nR.id = 'ans'; S.right = S.nR; S.relay(); }],
                [0.5 * T, g => {
                  S.solved = true; S.nR.col = RIGHT; S.nR.pop = g.t; burst(g, 'ans', 18); g.sfx('magic'); act(g, [0, 1]);
                  // every group but the first leaves each pan, then the kept group slides to the middle; the last crate opens
                  for (const side of ['L', 'R']) { let i = 0; for (const it of S.pans[side].items) if (it.grp > 0 && it.leaveAt == null && it.popAt == null) { it.leaveAt = g.t + 0.02 + i * 0.03; i++; } }
                  S.regroupAt = g.t + 0.3; S.revealAt = g.t + 0.05;
                  const b0 = S.pans.L.items.find(it => it.kind === 'box' && it.grp === 0); if (b0) { const [wx, wy] = toWorld(S, 'L', b0.x, b0.y); g.burst(wx, wy, ['#ffe08a', '#fff', '#9af0b0'], 16, 140); }
                  S.om += 0.2; }]]);
            },
          });
        }
        return out;
      },
      area(g) { if (!S.moved) return ['bterm', 'c']; if (!S.computed) return ['diff']; if (!S.divided) return ['a']; return ['quot']; },
      onMiss(g, info) {
        if (S.missSeen === g.s.mk.missAt) return; S.missSeen = g.s.mk.missAt; // called by the kit, or by update() when the kit does not
        S.missAt = g.t; S.om += 0.8;
        if (info.drag === 'a' && !S.moved) {
          // the classic mistake: dividing only part of the left side. For a moment the extra crates fade but every fish
          // on the left stays, the right side really is divided, and the seesaw tips. Then everything comes back.
          S.classic = g.t;
          S.fade = new Set([...S.pans.L.items.filter(i => i.kind === 'box').slice(1), ...S.pans.R.items.filter(i => i.kind === 'fish' && i.st === 'on').slice(Math.round(c / a))]);
          S.thT = x + k > c / a ? -0.16 : 0.16; S.om = 0;
          const bc = M.box(g, 'c'); if (bc) S.wrongDen = { v: a, x: bc.x, y: bc.y + bc.h / 2 + 22, t0: g.t };
          g.sfx('thud');
        }
      },
      onWin(g) {
        S.winAt = g.t; g.sfx('cheer');
        S.check = M.row(M.num(a), M.op('·'), x < 0 ? M.paren(M.num(x)) : M.num(x), M.op(k > 0 ? '+' : '-'), M.num(ak), M.op('='), M.num(c));
        M.place(g, 'CHK', S.check, 180, 232, 30, { col: RIGHT });
      },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    // the kit records every wrong move in missAt / missInfo; act it out here in case the kit does not call onMiss itself
    const MKs = g.s.mk; if (MKs.missAt > 0 && MKs.missAt !== S.missSeen && MKs.missInfo && MKs.opts && MKs.opts.onMiss) MKs.opts.onMiss(g, MKs.missInfo);
    for (const sl of S.slides) { const k = M.ease((g.t - sl.t0) / 0.2); sl.n.dx = sl.dx * (1 - k); sl.n.dy = sl.dy * (1 - k); if (k >= 1) sl.done = true; }
    S.slides = S.slides.filter(s => !s.done);
    if (S.classic && g.t - S.classic > 1.0) { S.classic = 0; S.thT = 0; S.fade = null; S.wrongDen = null; }
    S.om += (-70 * (S.th - S.thT) - 7 * S.om) * dt; S.th += S.om * dt; // the seesaw is a damped spring toward its target angle
    const kk = 1 - Math.exp(-dt * 16);
    for (const side of ['L', 'R']) {
      const pan = S.pans[side]; let changed = false;
      for (const it of pan.items) {
        if (it.st === 'ghost' && it.ghostAt != null && !it.flown && g.t >= it.ghostAt) { it.flown = true; if (!it.noFly) launch(S, side, it, g); }
        if (it.leaveAt != null && g.t >= it.leaveAt && !it.gone) { it.gone = true; changed = true; launch(S, side, it, g); }
        if (it.popAt != null && g.t >= it.popAt && !it.gone) { it.gone = true; changed = true; const [wx, wy] = toWorld(S, side, it.anchor ?? it.x, it.kind === 'balloon' ? 0 : it.y); S.puffs.push({ x: wx, y: it.kind === 'balloon' ? wy - it.y : wy, t0: g.t }); }
        if (g.t < it.born) continue;
        it.x += (it.tx - it.x) * kk; it.y += (it.ty - it.y) * kk;
      }
      if (changed) { pan.items = pan.items.filter(it => !it.gone); layoutPan(S, side); S.om += (Math.random() - 0.5) * 0.05; }
    }
    if (S.regroupAt && g.t >= S.regroupAt) { S.regroupAt = 0; for (const side of ['L', 'R']) { S.pans[side].groups = 1; layoutPan(S, side); } }
    for (const f of S.fl) if (!f.float && !f.landed && g.t - f.t0 >= f.dur) { f.landed = true; f.helper.munchAt = g.t; if (!S.munchT || g.t - S.munchT > 0.15) { S.munchT = g.t; g.sfx('munch'); } }
    S.fl = S.fl.filter(f => f.float ? g.t - f.t0 < 2.4 : !f.landed);
    S.puffs = S.puffs.filter(p => g.t - p.t0 < 0.4);
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', mk = g.s.mk;
    c.drawImage(g.bake('algebra_bluehour', blueHour), 0, 0, W, H);
    aurora(c, t);
    // a penguin belly-slides across the far ice now and then
    { const per = 5.2, u = ((t + S.slideOff) % per) / 2.4; if (u < 1) { const sx = -30 + u * 420, sy = 492;
      c.save(); c.strokeStyle = 'rgba(230,244,255,0.5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx - 60, sy + 1); c.lineTo(sx - 12, sy + 1); c.stroke();
      c.translate(sx, sy); c.rotate(1.35); drawPenguin(c, 0, 14, 0.5, { t, pose: 'balance', expr: 'laugh', noShadow: true, scarf: '#ffcf3a' }); c.restore(); } }
    // falling snow
    c.fillStyle = '#ffffff';
    for (const f of S.flakes) { const y = (f.y + t * f.v) % 680 - 20, x = f.x + Math.sin(t * 0.9 + f.ph) * 10; c.globalAlpha = 0.75; c.beginPath(); c.arc(x, y, f.r, 0, 7); c.fill(); }
    c.globalAlpha = 1;
    // ---- the seesaw ----
    const th = S.th, offL = -PAN * Math.sin(th), offR = PAN * Math.sin(th);
    c.save(); c.translate(PX, PY); c.rotate(th);
    const pg = c.createLinearGradient(0, 0, 0, 12); pg.addColorStop(0, '#c88a52'); pg.addColorStop(1, '#7a4620');
    c.fillStyle = 'rgba(10,20,50,0.25)'; c.fillRect(-172, 10, 344, 5);
    c.fillStyle = pg; c.beginPath(); c.moveTo(-174, 0); c.lineTo(174, 0); c.lineTo(170, 12); c.lineTo(-170, 12); c.closePath(); c.fill();
    c.strokeStyle = '#4a2a10'; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = '#eef6ff'; for (const ex of [-166, 158]) { c.beginPath(); c.ellipse(ex + 4, 0, 10, 3, 0, Math.PI, 0); c.fill(); } // snow on the plank ends
    for (const side of ['L', 'R']) {
      const cx = side === 'L' ? -PAN : PAN, pan = S.pans[side];
      const tg = c.createLinearGradient(0, -5, 0, 1); tg.addColorStop(0, '#e8f2fa'); tg.addColorStop(1, '#9ab8d4');
      c.fillStyle = tg; c.fillRect(cx - PANW / 2 - 3, -4, PANW + 6, 4); c.strokeStyle = '#4a6a90'; c.lineWidth = 1.2; c.strokeRect(cx - PANW / 2 - 3, -4, PANW + 6, 4);
      c.fillStyle = '#4a6a90'; c.fillRect(cx - PANW / 2 - 4, -11, 3, 9); c.fillRect(cx + PANW / 2 + 1, -11, 3, 9);
      if ((pan.groups || 1) > 1) {
        const n = pan.groups, gw = PANW / n, k = M.ease((t - pan.groupAt) / 0.2);
        for (let i = 0; i < n; i++) {
          const gx = cx - PANW / 2 + i * gw + 2, kept = i === 0, gr = c.createLinearGradient(0, -62, 0, -4);
          gr.addColorStop(0, kept ? `rgba(255,224,120,${0.05 * k})` : `rgba(180,220,255,${0.04 * k})`); gr.addColorStop(1, kept ? `rgba(255,214,90,${0.38 * k})` : `rgba(160,210,255,${0.26 * k})`);
          c.fillStyle = gr; rr(c, gx, -62, gw - 4, 58, 8); c.fill();
          c.strokeStyle = kept ? `rgba(255,224,120,${0.9 * k})` : `rgba(210,236,255,${0.6 * k})`; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.stroke(); c.setLineDash([]);
        }
      }
      const reveal = Math.max(0, (t - S.revealAt) / 0.3);
      for (const it of pan.items) {
        if (it.kind === 'balloon' || t < it.born) continue;
        const ghost = it.st === 'ghost' && it.flown, gk = it.popAt != null ? 1 - M.clamp((t - it.popAt + 0.05) / 0.05, 0, 1) : 1;
        c.save(); c.translate(cx + it.x, it.y); c.globalAlpha *= gk * M.clamp((t - it.born) / 0.1, 0, 1) * (S.fade && S.fade.has(it) ? 0.22 : 1);
        if (it.kind === 'box') { if (ghost) c.globalAlpha *= 0.25; const own = S.solved && it.grp === 0 && t >= S.revealAt; c.rotate(Math.sin(t * 2 + it.seed * 7) * 0.025); crate(c, S.boxS, own ? reveal : 0, own ? S.p.x : null); }
        else {
          if (it.settle != null && t > it.settle && t - it.settle < 0.25) c.translate(0, -Math.sin((t - it.settle) / 0.25 * Math.PI) * 5);
          if (it.st === 'tag') { c.shadowColor = '#ffd45a'; c.shadowBlur = 8; }
          c.rotate((it.seed - 0.5) * 0.3); if (it.seed > 0.5) c.scale(-1, 1); fish(c, 0.72, it.col, ghost);
        }
        c.restore();
      }
    }
    // the penguin balancing on the middle of the plank (it hops on every move)
    const hk = (t - S.hopAt) / 0.35, hop = hk >= 0 && hk < 1 ? Math.sin(hk * Math.PI) * 16 : 0;
    const cpose = won ? 'cheer' : S.classic ? 'wow' : lost ? 'sad' : hop > 0 ? 'hop' : 'balance', cexpr = won ? 'laugh' : S.classic ? 'wow' : lost ? 'sad' : hop > 0 ? 'laugh' : 'happy';
    drawPenguin(c, Math.sin(th) * -40, -hop, 0.9, { t, pose: cpose, expr: cexpr, lean: -th * 0.8, noShadow: true, scarf: '#f0b43a', ph: 0.6 });
    c.restore();
    // balloons: tied to their pan, floating straight up
    for (const side of ['L', 'R']) for (const it of S.pans[side].items) {
      if (it.kind !== 'balloon' || t < it.born) continue;
      const [ax, ay] = toWorld(S, side, it.anchor ?? it.x, -2), sway = Math.sin(t * 2 + it.seed * 6) * 2.5, bx = ax + sway, by = ay - it.y;
      const gk = it.popAt != null ? 1 - M.clamp((t - it.popAt + 0.05) / 0.05, 0, 1) : 1; if (gk <= 0) continue;
      c.save(); c.globalAlpha *= gk * M.clamp((t - it.born) / 0.12, 0, 1);
      c.strokeStyle = 'rgba(230,240,255,0.7)'; c.lineWidth = 1; c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo(ax + sway * 2, (ay + by) / 2, bx, by + 10); c.stroke();
      if (it.st === 'ghost' && it.flown) { c.setLineDash([3, 3]); c.strokeStyle = 'rgba(230,244,255,0.8)'; c.beginPath(); c.ellipse(bx, by, 8, 10, 0, 0, 7); c.stroke(); c.setLineDash([]); }
      else balloon(c, bx, by, it.col, it.st === 'tag');
      c.restore();
    }
    // the equation: ice tiles hanging under each pan, the = sign on the pivot
    const plank = PY + 12, tileFor = id => { const n = M.node(g, id), b = M.box(g, id); return n && b ? { x: b.x + (n.dx || 0) + (n._gx || 0), y: b.y + (n.dy || 0) + (n._gy || 0), w: b.w, h: b.h, a: n.alpha == null ? 1 : Math.max(0.35, n.alpha) } : null; };
    const leftTiles = (S.lDiv ? [['x']] : [['a', 'x']]).concat(S.bGone ? [] : [['bterm']]);
    const rightId = S.right.id;
    const tiles = (sets, off) => { for (const set of sets) { const bs = set.map(tileFor).filter(Boolean); if (!bs.length) continue; const u = M.unionBox(bs); iceTile(c, { ...u, y: u.y + off }, plank + off, Math.min(...bs.map(b => b.a)), false); } };
    tiles(leftTiles, offL); tiles([[rightId]], offR);
    const be = M.box(g, 'eq'); if (be) { c.save(); c.globalAlpha = 0.5 + 0.2 * Math.sin(t * 2); c.shadowColor = '#bfe6ff'; c.shadowBlur = 14; M.drawEx(g, c, 'EQ'); c.restore(); M.drawEx(g, c, 'EQ'); }
    c.save(); c.translate(0, offL); M.drawEx(g, c, 'L'); M.drawEx(g, c, 'nL'); c.restore();
    c.save(); c.translate(0, offR); M.drawEx(g, c, 'R'); c.restore();
    if (S.wrongDen) { const w = S.wrongDen, k = M.ease((t - w.t0) / 0.2); c.save(); c.globalAlpha = k * M.clamp((1.0 - (t - w.t0)) / 0.2, 0, 1); c.font = MK.NUMF(30); c.textAlign = 'center'; c.fillStyle = MK.BAD; c.strokeStyle = '#fff'; c.lineWidth = 4; c.strokeText('÷ ' + w.v, w.x, w.y + offR + (1 - k) * -20); c.fillText('÷ ' + w.v, w.x, w.y + offR + (1 - k) * -20); c.restore(); }
    if (S.check) { const k = M.ease((t - S.winAt) / 0.25); c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(10,20,50,0.45)'; const b = mk.ex.CHK; rr(c, 180 - 120, 204, 240, 42, 21); c.fill(); M.drawEx(g, c, 'CHK'); c.restore(); }
    // helper penguins on the snow: they catch the fish and cheer every move
    S.helpers.forEach(h => {
      const munch = t - h.munchAt >= 0 && t - h.munchAt < 0.3, cheer = t - h.actAt >= 0 && t - h.actAt < 0.45;
      drawPenguin(c, h.x, h.y, 1.12, { t, ph: h.ph, facing: h.f, scarf: h.scarf, pose: won || cheer ? 'cheer' : lost ? 'sad' : munch ? 'hop' : 'idle', expr: won || cheer ? 'laugh' : lost ? 'sad' : munch ? 'laugh' : 'happy' });
    });
    for (const f of S.fl) {
      const k = (t - f.t0) / (f.dur || 1); if (k < 0) continue;
      c.save();
      if (f.float) { const u = t - f.t0; balloon(c, f.x0 + Math.sin(u * 3 + f.seed * 6) * 6, f.y0 - u * 90 - u * u * 30, f.col); }
      else { const e = M.easeIO(k), x = M.lerp(f.x0, f.x1, e), y = M.lerp(f.y0, f.y1, e) - Math.sin(k * Math.PI) * 50; c.translate(x, y); c.rotate(f.rot * k); if (f.kind === 'box') crate(c, S.boxS * (1 - k * 0.3), 0, null); else fish(c, 0.72, f.col, false); }
      c.restore();
    }
    for (const p of S.puffs) { const k = (t - p.t0) / 0.4; c.strokeStyle = `rgba(255,255,255,${0.9 * (1 - k)})`; c.lineWidth = 2.5; c.beginPath(); c.arc(p.x, p.y, 4 + k * 12, 0, 7); c.stroke(); c.fillStyle = `rgba(255,236,150,${0.8 * (1 - k)})`; for (let j = 0; j < 4; j++) { const a = j * 1.57 + k; c.beginPath(); c.arc(p.x + Math.cos(a) * (6 + k * 12), p.y + Math.sin(a) * (6 + k * 12), 1.8, 0, 7); c.fill(); } }
    M.drawUI(g, c);
  },
});
