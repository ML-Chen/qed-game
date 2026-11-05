// calc_chain.js — CHAIN RULE! Differentiate a function inside a function: d/dx f(g(x)) = f'(g(x)) · g'(x).
// A marsh at night. The function floats over the water as nested glowing bubbles: the outer function is the big
// bubble, and the inside glows amber in a small bubble within it. A firefly carries the d/dx.
// The player drags the firefly onto the OUTER bubble: the outside is differentiated and the inside is left alone, and a
// second firefly carries a copy of the d/dx to a copy of the inside:
//   (3x + 1)⁴  →  4(3x + 1)^(4 − 1) · d/dx(3x + 1)
// Then, in any valid order: tap "4 − 1" (→ 3); drag the new firefly onto the inside bubble, or tap it (→ 3); once the
// inside is done, drag the 3 onto the 4 or tap the "·" (→ 12). Every move acts out its working by itself (show your work):
//   1. The outside lights up while the inside stays wrapped and glows amber; the power drops down in front, a chalk
//      "− 1" writes itself beside it, and a copy of the d/dx and of the inside fly out to the end of the line.
//   2. The − 1 slides into the power, which rolls down by one like an odometer (a far frog croaks it out).
//   3. The frog's tongue pops the inside bubble: constants are crossed out, "2x²⁻¹ + 0 = 2x" writes itself under it,
//      and the inside's derivative flies up into its place.
//   4. "4 × 3 = 12" writes itself above the line and the product flies down in front (for sin and e it hops to the front).
// Dragging the d/dx onto the inside first is the classic mistake (forgetting the outer function): a miss from level 1.
// Level 0: (ax ± b)ⁿ. Level 1: (x² + b)ⁿ. Level 2: (cx³ − b)², sin(xᵐ) or e^(ax).
// Medium mode: each computing move opens a tray (sin → cos, n − 1, the inside's derivative, the final product).
const M = MK;
const BRK = 'rgba(255,246,224,0.5)'; // brackets drawn faint: the bubbles already show the grouping
const INKL = '#fff6e0', INKD = '#3a2410', STAR = '#c8d0ff', BLUE = '#8ad8ff';

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { fam: 'pow', inner: 'lin', a: 2 + r(3), b: 1 + r(6), neg: g.rand() < 0.3, n: 3 + r(3) };
  if (L === 1) return { fam: 'pow', inner: 'quad', b: 1 + r(6), n: 2 + r(3) };
  const f = r(3);
  if (f === 0) return { fam: 'pow', inner: 'cub', c: 2 + r(2), b: 1 + r(7), neg: true, n: 2 };
  if (f === 1) return { fam: 'sin', inner: 'mono', m: 2 + r(2) };
  return { fam: 'exp', inner: 'linx', a: 2 + r(4) };
}
const xp = (k, id, o) => k === 1 ? M.vr('x', id, o) : M.sup(M.vr('x'), M.num(k), id, o);
// the inside's tokens; p is the id prefix (null for the static problem line)
function innerTokens(Q, p) {
  const id = k => p ? p + k : undefined, sg = Q.neg ? '-' : '+';
  switch (Q.inner) {
    case 'lin': return [M.num(Q.a, id(0)), M.vr('x', id(1)), M.op(sg, id(2)), M.num(Q.b, id(3))];
    case 'quad': return [xp(2, id(0)), M.op('+', id(2)), M.num(Q.b, id(3))];
    case 'cub': return [M.num(Q.c, id(0)), xp(3, id(1)), M.op(sg, id(2)), M.num(Q.b, id(3))];
    case 'mono': return [xp(Q.m, id(0))];
    default: return [M.num(Q.a, id(0)), M.vr('x', id(1))];
  }
}
// the derivative of the inside: its number part (gc) and the power of x that goes with it (v)
function innerD(Q) {
  switch (Q.inner) {
    case 'lin': return { gc: Q.a, v: 0 };
    case 'quad': return { gc: 2, v: 1 };
    case 'cub': return { gc: 3 * Q.c, v: 2 };
    case 'mono': return { gc: Q.m, v: Q.m - 1 };
    default: return { gc: Q.a, v: 0 };
  }
}
const coefX = (c, v, id, o) => { const r = v ? M.row(M.num(c), xp(v)) : M.row(M.num(c)); r.id = id; return Object.assign(r, o); };
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])].filter(Boolean);
const walkIds = (n, out = []) => { if (!n) return out; if (n.id) out.push(n.id); kids(n).forEach(ch => walkIds(ch, out)); return out; };
const tint = (n, col) => { if (!n) return n; n.col = col; kids(n).forEach(ch => tint(ch, col)); return n; };
const ddxD = id => tint(M.ddx('x', id), INKD); // the d/dx in dark ink, to sit on a firefly's glow
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the scene: a marsh at night ----------------
function night(c, W, H) {
  P.sky(c, W, H, ['#070b26', '#111a46', '#232a62', '#3a3a78', '#4a4682'], { x: 300, y: 58, r: 17, color: '#dfe6ff', glow: 120 });
  // the moon's craters
  c.fillStyle = 'rgba(170,180,220,0.35)'; for (const [dx, dy, r] of [[-5, -4, 4], [5, 3, 3], [-2, 7, 2.2]]) { c.beginPath(); c.arc(300 + dx, 58 + dy, r, 0, 7); c.fill(); }
  P.stars(c, W, 400, 70, 12, 0);
  P.hills(c, W, 392, 22, '#22285a', '#161a40', { seed: 5, dabs: 16, bottom: 430 });
  // far reeds and trees as a dark shore line
  const r = P.rng(17); c.fillStyle = '#0d1230';
  for (let x = -10; x < W + 20; x += 7) { const h = 6 + r() * 14 + Math.sin(x * 0.04) * 5; c.beginPath(); c.ellipse(x, 414 - h * 0.5, 7 + r() * 5, h, 0, 0, 7); c.fill(); }
  for (let i = 0; i < 26; i++) { const x = r() * W, h = 14 + r() * 26; c.strokeStyle = '#0d1230'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, 418); c.quadraticCurveTo(x + 2, 418 - h * 0.6, x + (r() - 0.5) * 8, 418 - h); c.stroke(); }
  c.fillRect(0, 410, W, 12);
}
function front(c, W, H) {
  const pads = [[52, 470, 30, 0.3], [316, 462, 28, -0.4], [60, 606, 42, 0.9], [306, 614, 44, 2.2]];
  for (const [x, y, rad, rot] of pads) pad(c, x, y, rad, rot);
  P.vignette(c, W, H, 0.4, '#040616');
}
function pad(c, x, y, rad, rot) {
  c.save(); c.fillStyle = 'rgba(0,0,10,0.4)'; c.beginPath(); c.ellipse(x + 3, y + 5, rad, rad * 0.4, 0, 0, 7); c.fill();
  const gr = c.createLinearGradient(0, y - rad * 0.4, 0, y + rad * 0.4); gr.addColorStop(0, '#3e7a5a'); gr.addColorStop(1, '#1c3c36');
  c.fillStyle = gr; c.beginPath(); c.ellipse(x, y, rad, rad * 0.4, 0, rot + 0.22, rot + Math.PI * 2 - 0.05); c.lineTo(x, y); c.closePath(); c.fill();
  c.strokeStyle = '#12282a'; c.lineWidth = 1.8; c.stroke();
  c.strokeStyle = 'rgba(160,220,200,0.18)'; c.lineWidth = 1; c.beginPath();
  for (let k = 0; k < 6; k++) { const a = rot + 0.6 + k * 0.95; c.moveTo(x, y); c.lineTo(x + Math.cos(a) * rad * 0.8, y + Math.sin(a) * rad * 0.32); } c.stroke();
  c.strokeStyle = 'rgba(200,215,255,0.4)'; c.lineWidth = 1.4; c.beginPath(); c.ellipse(x, y, rad - 1, rad * 0.4 - 1, 0, Math.PI * 1.15, Math.PI * 1.8); c.stroke();
  c.restore();
}
// a soft glow sprite (white core, coloured halo), cached per colour
const GLOWS = {};
function glowSpr(rgb) {
  if (GLOWS[rgb]) return GLOWS[rgb]; const cv = document.createElement('canvas'); cv.width = cv.height = 64; const o = cv.getContext('2d'), gr = o.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(0.14, `rgba(${rgb},0.9)`); gr.addColorStop(0.42, `rgba(${rgb},0.25)`); gr.addColorStop(1, `rgba(${rgb},0)`); o.fillStyle = gr; o.fillRect(0, 0, 64, 64); return GLOWS[rgb] = cv;
}
function fireflies(c, t, set, boost) {
  const spr = glowSpr('210,255,110');
  for (const f of set) {
    const x = f.x + Math.sin(t * f.sp + f.ph) * f.ax + Math.sin(t * f.sp * 2.3 + f.ph * 2) * 6, y = f.y + Math.cos(t * f.sp * 0.8 + f.ph) * f.ay - (boost ? boost * 30 : 0);
    const b = Math.max(0, Math.sin(t * f.bl + f.ph * 3)), a = Math.min(1, 0.1 + b * b * 0.9 + boost), R = 8 + b * 7 + boost * 6;
    c.globalAlpha = a; c.drawImage(spr, x - R, y - R, R * 2, R * 2);
  }
  c.globalAlpha = 1;
}
// the firefly that carries a d/dx: a glowing orb with a little body and fluttering wings (x, y = orb centre)
function carrier(c, x, y, r, t, a = 1) {
  if (a <= 0) return; c.save(); c.globalAlpha *= a;
  const fl = Math.sin(t * 30) * 0.35;
  c.fillStyle = 'rgba(220,235,255,0.55)'; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1;
  for (const sx of [-1, 1]) { c.save(); c.translate(x + sx * r * 0.35, y - r * 0.8); c.rotate(sx * (0.6 + fl)); c.beginPath(); c.ellipse(sx * r * 0.32, -r * 0.18, r * 0.4, r * 0.2, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
  const sp = glowSpr('230,255,120'), R = r * 2.4 * (1 + Math.sin(t * 5) * 0.06); c.drawImage(sp, x - R, y - R, R * 2, R * 2);
  const gr = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r); gr.addColorStop(0, '#fffde0'); gr.addColorStop(0.7, '#f6f58a'); gr.addColorStop(1, '#d6e650');
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  // head and antennae on top
  c.fillStyle = '#2a2030'; c.beginPath(); c.ellipse(x, y - r * 0.95, r * 0.28, r * 0.22, 0, 0, 7); c.fill();
  c.strokeStyle = '#2a2030'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - 2, y - r * 1.1); c.quadraticCurveTo(x - 5, y - r * 1.45, x - 8, y - r * 1.4); c.moveTo(x + 2, y - r * 1.1); c.quadraticCurveTo(x + 5, y - r * 1.45, x + 8, y - r * 1.4); c.stroke();
  c.restore();
}
function cattails(c, t, side) {
  const stems = side < 0 ? [[6, 640, 430, 0], [22, 640, 470, 1.3], [-4, 640, 492, 2.1], [38, 640, 540, 0.7]] : [[352, 640, 436, 0.4], [336, 640, 478, 1.9], [364, 640, 498, 2.7], [322, 640, 548, 1.1]];
  for (const [x, y0, top, ph] of stems) {
    const sw = Math.sin(t * 1.1 + ph) * 5, tx = x + sw + side * -6;
    c.strokeStyle = '#0a1220'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y0); c.quadraticCurveTo(x, (y0 + top) / 2, tx, top); c.stroke();
    c.fillStyle = '#0e1a26'; c.beginPath(); c.moveTo(x - 3, y0); c.quadraticCurveTo(x + side * -14 + sw, top + 60, x + side * -22 + sw * 1.4, top + 26); c.quadraticCurveTo(x + side * -8 + sw, top + 70, x + 4, y0); c.fill();
    c.save(); c.translate(tx, top + 16); c.rotate(sw * 0.02); const gr = c.createLinearGradient(-4, 0, 4, 0); gr.addColorStop(0, '#22140e'); gr.addColorStop(1, '#5a4a6a');
    c.fillStyle = gr; rr(c, -4.5, -16, 9, 30, 4.5); c.fill(); c.strokeStyle = '#0a1220'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -16); c.lineTo(0, -26); c.stroke(); c.restore();
  }
}
// a frog of our own, used while the animal cast (ANI) is missing
function frogArt(c, x, y, s, o = {}) {
  const t = o.t || 0, pose = o.pose || 'idle', ex = o.expr || 'happy', br = Math.sin(t * 2.6) * 0.8;
  c.save(); c.translate(x, y); c.scale(s * (o.facing || 1), s);
  c.fillStyle = 'rgba(0,0,10,0.35)'; c.beginPath(); c.ellipse(0, 0, 26, 6, 0, 0, 7); c.fill();
  const G1 = o.col || '#78c060', G2 = '#2f6a3a';
  c.fillStyle = G2; for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(sx * 17, -8, 13, 9, sx * 0.3, 0, 7); c.fill(); c.beginPath(); c.ellipse(sx * 25, -1.5, 9, 3.5, 0, 0, 7); c.fill(); }
  let gr = c.createRadialGradient(-6, -30 + br, 3, 0, -20, 26); gr.addColorStop(0, P.shade(G1, 0.2)); gr.addColorStop(1, G2);
  c.fillStyle = gr; c.beginPath(); c.ellipse(0, -18 + br * 0.5, 20, 17 - br * 0.3, 0, 0, 7); c.fill();
  c.fillStyle = '#e8e4b0'; c.beginPath(); c.ellipse(0, -14 + br * 0.5, 12, 10, 0, 0, 7); c.fill();
  if (o.croak > 0) { c.fillStyle = 'rgba(250,240,200,0.95)'; c.beginPath(); c.ellipse(0, -24 + br, 9 * o.croak + 2, 7 * o.croak + 1, 0, 0, 7); c.fill(); }
  c.strokeStyle = G2; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath();
  if (pose === 'cheer') { c.moveTo(-14, -22); c.lineTo(-24, -44); c.moveTo(14, -22); c.lineTo(24, -44); } else if (pose === 'point') { c.moveTo(-14, -16); c.lineTo(-10, -4); c.moveTo(14, -22); c.lineTo(28, -32); } else { c.moveTo(-14, -16); c.lineTo(-10, -4); c.moveTo(14, -16); c.lineTo(10, -4); }
  c.stroke();
  gr = c.createRadialGradient(-6, -40 + br, 2, 0, -34 + br, 24); gr.addColorStop(0, P.shade(G1, 0.3)); gr.addColorStop(1, G1);
  c.fillStyle = gr; c.beginPath(); c.ellipse(0, -33 + br, 22, 13, 0, 0, 7); c.fill();
  const blink = (t * 0.7 + (o.ph || 0)) % 3.2 < 0.1;
  for (const sx of [-1, 1]) {
    c.fillStyle = G1; c.beginPath(); c.arc(sx * 11, -44 + br, 8, 0, 7); c.fill();
    if (blink || ex === 'laugh') { c.strokeStyle = '#1a1020'; c.lineWidth = 2; c.beginPath(); c.arc(sx * 11, -43 + br, 4, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
    else { c.fillStyle = '#fff'; c.beginPath(); c.arc(sx * 11, -44 + br, 6, 0, 7); c.fill(); const pr = ex === 'wow' ? 4 : 3.2; c.fillStyle = '#1a1020'; c.beginPath(); c.arc(sx * 11 + 0.8, -43.5 + br + (ex === 'sad' ? 1.5 : 0), pr, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(sx * 11 - 0.6, -45.5 + br, 1.2, 0, 7); c.fill(); }
    if (ex === 'sad') { c.strokeStyle = '#1a1020'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(sx * 6, -52 + br); c.lineTo(sx * 15, -50 + br); c.stroke(); }
  }
  c.fillStyle = 'rgba(240,110,120,0.35)'; c.beginPath(); c.ellipse(-14, -30 + br, 4, 2.4, 0, 0, 7); c.ellipse(14, -30 + br, 4, 2.4, 0, 0, 7); c.fill();
  c.strokeStyle = '#1a1020'; c.lineWidth = 1.8; c.beginPath();
  if (ex === 'sad') { c.moveTo(-7, -27 + br); c.quadraticCurveTo(0, -32 + br, 7, -27 + br); c.stroke(); }
  else if (ex === 'laugh' || ex === 'wow') { c.fillStyle = '#8a2a3a'; c.ellipse(0, -28 + br, ex === 'wow' ? 4 : 7, ex === 'wow' ? 4 : 4.5, 0, 0, 7); c.fill(); }
  else { c.moveTo(-9, -31 + br); c.quadraticCurveTo(0, -25 + br, 9, -31 + br); c.stroke(); }
  c.restore();
}
function frog(c, x, y, s, o) {
  try { if (typeof ANI !== 'undefined' && ANI.draw) { ANI.draw(c, 'frog', x, y, s, o); return; } } catch (e) { }
  frogArt(c, x, y, s, o);
}

// ---------------- the layers: a big glowing bubble (outer function) around an amber bubble (the inside) ----------------
function outerBubble(c, b, t, flash, bad) {
  const fk = flash >= 0 && flash < 1 ? Math.sin(flash * Math.PI) : 0, w = b.w + 26, h = b.h + 22, k = 1 + Math.sin(t * 2.1) * 0.014 + fk * 0.08;
  c.save(); c.translate(b.x, b.y); c.scale(k, k * (1 + Math.sin(t * 2.1 + 1.4) * 0.012));
  const rim = bad ? '255,110,110' : '120,220,255', rad = Math.min(30, h / 2);
  c.save(); c.shadowColor = `rgba(${rim},${0.7 + fk * 0.3})`; c.shadowBlur = 18 + fk * 20;
  const gr = c.createRadialGradient(-w * 0.15, -h * 0.25, 4, 0, 0, Math.max(w, h) * 0.62);
  gr.addColorStop(0, `rgba(${rim},0.05)`); gr.addColorStop(0.75, `rgba(${rim},0.14)`); gr.addColorStop(1, `rgba(${rim},0.32)`);
  c.fillStyle = gr; rr(c, -w / 2, -h / 2, w, h, rad); c.fill();
  c.strokeStyle = `rgba(${rim},${0.85})`; c.lineWidth = 2 + fk * 2; c.stroke(); c.restore();
  // a rainbow sheen and highlights, like a soap bubble
  c.strokeStyle = 'rgba(255,170,240,0.35)'; c.lineWidth = 2; rr(c, -w / 2 + 3, -h / 2 + 3, w - 6, h - 6, rad - 3); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-w / 2 + 8, -h * 0.05); c.quadraticCurveTo(-w / 2 + 8, -h / 2 + 7, -w / 2 + rad + 6, -h / 2 + 6); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(w / 2 - 12, h / 2 - 9, 2.2, 0, 7); c.fill();
  c.restore();
}
function innerBubble(c, b, t, o = {}) {
  const w = b.w + 8, h = b.h + 8, k = 1 + Math.sin(t * 3.1 + (o.ph || 0)) * 0.03;
  c.save(); c.translate(b.x, b.y); c.scale(k, k * (1 + Math.sin(t * 3.1 + 1.6 + (o.ph || 0)) * 0.025)); c.globalAlpha *= o.alpha ?? 1;
  const rim = o.bad ? '255,100,100' : '255,190,90';
  c.save(); c.shadowColor = `rgba(${rim},0.8)`; c.shadowBlur = 14;
  const gr = c.createRadialGradient(-w * 0.2, -h * 0.3, 2, 0, 0, Math.max(w, h) * 0.62);
  gr.addColorStop(0, `rgba(${rim},0.16)`); gr.addColorStop(0.8, `rgba(${rim},0.3)`); gr.addColorStop(1, `rgba(${rim},0.5)`);
  c.fillStyle = gr; rr(c, -w / 2, -h / 2, w, h, h / 2); c.fill(); c.strokeStyle = `rgba(${rim},0.95)`; c.lineWidth = 2; c.stroke(); c.restore();
  c.strokeStyle = 'rgba(255,255,240,0.9)'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(-w / 2 + h * 0.28, -h * 0.12); c.quadraticCurveTo(-w / 2 + h * 0.28, -h / 2 + 3, -w / 2 + h * 0.7, -h / 2 + 3); c.stroke();
  c.restore();
}
// a soft pill behind a part that can be tapped to compute ("4 − 1", the "·")
function pill(c, b, t, col) {
  const p = 0.5 + 0.5 * Math.sin(t * 4), w = b.w + 12, h = b.h + 8;
  c.save(); c.fillStyle = `rgba(${col},${0.14 + p * 0.08})`; rr(c, b.x - w / 2, b.y - h / 2, w, h, h / 2); c.fill();
  c.setLineDash([4, 4]); c.lineDashOffset = -t * 12; c.strokeStyle = `rgba(${col},0.75)`; c.lineWidth = 1.6; c.stroke(); c.restore();
}

MG.add({
  id: 'chain', stage: 'derivs', cmd: 'CHAIN RULE!', hint: 'drag', time: 8, mood: 'bright', winText: 'Chained!', hold: 1.4,
  card: {
    title: 'The chain rule', ref: 'Grade 12 and up', kind: 'Calculus',
    text: 'The derivative of a formula tells you how fast its value changes as x changes. The chain rule finds the derivative when one formula sits inside another. In (3x + 1)⁴, the inside is 3x + 1. The outside is the power 4 wrapped around it.\n\nTo use the rule, first take the derivative of the outside and leave the inside alone. The power rule turns (3x + 1)⁴ into 4(3x + 1)³. Then multiply by the derivative of the inside. The derivative of 3x + 1 is 3. So the derivative of (3x + 1)⁴ is 4(3x + 1)³ × 3, which is 12(3x + 1)³.\n\nHere is why you multiply. If the inside changed at the same speed as x, the derivative would be 4(3x + 1)³. But the inside, 3x + 1, changes 3 times as fast as x. So the whole formula changes 3 times as fast too.',
    note: 'Take the derivative of the outside and leave the inside alone. Then multiply by the derivative of the inside.',
    ask: 'What is the derivative of (2x + 5)³? What is the derivative of (x² + 4)²?',
  },
  init(g) {
    const S = g.s; M.setup(g); const Q = S.Q = pick(g), D = S.D = innerD(Q), T = M.pace(g), pow = Q.fam === 'pow';
    S.f = {}; // move flags: out (outside done), sub (n − 1 done), inn (inside done), prod (multiplied)
    S.st = { out: false, tail: 'none', front: false }; // what the working line shows right now (it changes on the beats)
    S.fx = []; S.frog = { hopT: -9, sadAt: -9, tongue: null }; S.croakT = [-9, -9]; S.flash = -9; S.flare = -9;
    if (!pow) S.f.sub = S.subLanded = true;
    // the working line's parts, made once and reused, so every symbol glides to its new place as the line is rewritten
    S.eq = M.op('=', 'eq'); S.iIn = M.row(...innerTokens(Q, 'i')); S.iIn.id = 'i';
    if (pow) { S.E = M.num(Q.n, 'n'); S.outer = M.sup(M.paren(S.iIn, 'shell', { col: BRK }), S.E, 'outer'); S.K = M.num(Q.n, 'k', { alpha: 0 }); }
    else if (Q.fam === 'sin') { S.fn = M.txt('sin', 'fn'); S.outer = M.row(S.fn, M.paren(S.iIn, 'shell', { col: BRK })); S.outer.id = 'outer'; }
    else { S.outer = M.sup(M.vr('e', 'eb'), S.iIn, 'outer'); }
    S.dot = M.op('·', 'dot', { alpha: 0 }); S.d1 = ddxD('d1'); S.d1.alpha = 0;
    S.jIn = M.row(...innerTokens(Q, 'j')); S.jIn.id = 'j'; S.jp = M.paren(S.jIn, 'jp', { col: BRK, alpha: 0 });
    S.jIds = walkIds(S.jIn);
    const sp = n => [M.gap(16), n, M.gap(14)]; // room for the outer bubble's glow
    const lineNode = () => { const st = S.st, tail = st.tail === 'dd' ? [S.dot, M.gap(4), S.d1, M.gap(4), S.jp] : st.tail === 'g' ? [S.dot, S.G] : [];
      if (pow) return M.row(S.eq, st.out ? S.K : null, sp(S.outer), tail);
      return M.row(S.eq, st.front ? [S.G, Q.fam === 'sin' ? M.gap(5) : null] : null, sp(S.outer), tail); };
    // one size for every form of the line: the size at which its widest form fits across the screen
    const inn = () => M.paren(M.row(...innerTokens(Q, null))), wideN = M.row(M.op('='), pow ? M.num(Q.n) : null, M.gap(16),
      pow ? M.sup(inn(), M.row(M.num(Q.n), M.op('-'), M.num(1))) : Q.fam === 'sin' ? M.row(M.txt('cos'), inn()) : M.sup(M.vr('e'), M.row(...innerTokens(Q, null))),
      M.gap(14), M.op('·'), M.gap(4), M.ddx(), M.gap(4), inn());
    const wide = M.lay(wideN, 40).w / 40; S.ws = Math.min(46, 324 / wide); S.wy = 322; S.x0 = Math.max(16, 180 - wide * S.ws / 2);
    const probN = M.row(M.ddx('x', 'ddx'), pow ? M.sup(inn(), M.num(Q.n)) : Q.fam === 'sin' ? M.row(M.txt('sin'), inn()) : M.sup(M.vr('e'), M.row(...innerTokens(Q, null))));
    M.place(g, 'prob', probN, 180, 222, 30, { col: STAR });
    // the firefly with the d/dx hovers by the frog
    S.ff = { x: 246, y: 446 }; M.place(g, 'fd', M.row(ddxD('d0')), S.ff.x, S.ff.y + 12, 38);
    // the line is left-aligned while it grows and shrinks; the finished answer is centred
    const isFinal = () => S.centre;
    S.relay = () => { const n = lineNode(); M.place(g, 'work', n, isFinal() ? 180 - M.lay(n, S.ws).w / 2 : S.x0, S.wy, S.ws, { left: true, col: INKL }); };
    S.relay(); S.mk.relay = S.relay;
    M.inert(g, ['eq', 'ddx', 'ne', 'sm', 'so', 'n2']);
    const nMoves = pow ? 4 : 3; g.dur *= (2.6 + 1.05 * nMoves) / 8;

    const boxOf = id => { const b = M.box(g, id); return b ? { ...b } : null; };
    const burst = (id, cols) => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, cols || ['#ffd45a', '#d8ff7a', '#fff'], 12, 130); };
    const popFx = id => { const b = M.box(g, id); if (b) S.fx.push({ k: 'pop', x: b.x, y: b.y, w: b.w + 12, h: b.h + 10, t0: g.t, life: 0.35 }); };
    const tongue = id => { const b = M.box(g, id); if (b) S.frog.tongue = { x: b.x, y: b.y + b.h * 0.3, t0: g.t }; };
    const hop = () => { S.frog.hopT = g.t; };
    const gone = n => { if (!n) return; n.alpha = 0; kids(n).forEach(gone); }; // faded parts leave no ghost
    // once the last move has landed, the finished answer slides to the middle
    const centreLater = () => M.at(g, [[0.2 * T, g => { if (S.st.tail === 'gone' && S.subLanded && !S.centre) { S.centre = true; S.relay(); } }]]);
    const born = n => { if (!n) return n; n._born = -1; kids(n).forEach(born); return n; };
    const AMB = '#ffc85a', NOTE = '#ffe2a0';
    // a working note on the water beside the line; it is part of the drawn expressions so its parts can be written in
    const note = (node, cx, y) => { const w = M.lay(node, 24).w; M.place(g, 'note', node, M.clamp(cx, w / 2 + 12, 348 - w / 2), y, 24, { col: NOTE }); };
    const outT = pow ? ['n', 'outer', 'shell'] : Q.fam === 'sin' ? ['fn', 'outer', 'shell'] : ['eb', 'outer'];

    // 1. the firefly's d/dx onto the outer bubble: the outside is differentiated while the inside stays wrapped and lit;
    //    then a second firefly carries a copy of the d/dx out to a copy of the inside, waiting to multiply
    const tailIn = at => M.at(g, [[at, g => { const ob = boxOf('outer'), ib = boxOf('i'); M.tween(g, S.dot, { alpha: 1 }, 0.15 * T); g.sfx('swoosh');
        if (ob) M.fly(g, { node: ddxD(), from: [ob.x, ob.y], to: 'd1', dur: 0.42 * T, arc: -50, s0: S.ws * 0.9, s1: S.ws, col: '#eaff8a', then(g) { S.d1.alpha = 1; S.d1.pop = g.t; burst('d1', ['#eaff8a', '#fff']); g.sfx('pop'); } });
        if (ib) M.fly(g, { node: tint(M.row(...innerTokens(Q, null)), AMB), from: [ib.x, ib.y], to: 'j', delay: 0.1 * T, dur: 0.45 * T, arc: -36, s0: ib.s, s1: S.ws, then(g) { S.jp.alpha = 1; S.jIn.pop = g.t; g.sfx('bubble'); hop(); } }); }],
      [at + 0.6 * T, g => { M.unlight(g, S.iIn, { dur: 0.3 * T }); S.point = false; }]]);
    const outerMove = {
      drag: 'd0', to: outT, busy: 0.1,
      then(g) {
        S.f.out = true; S.flash = g.t; hop(); S.ffGone = g.t; M.node(g, 'd0').hide = true; g.sfx('splash'); g.sfx('ribbit'); S.point = true;
        M.light(g, S.iIn, { col: AMB }); // the inside is left alone: it glows and stays wrapped
        S.st.out = true; S.st.tail = 'dd'; S.relay();
        if (pow) { M.show(g, 1.5 * T); const from = boxOf('n'); S.E.id = 'ne'; M.circle(g, S.E, { col: BLUE, dur: 0.45 * T, pad: 5 }); M.light(g, S.E, { col: BLUE });
          // the power comes down in front, then a "− 1" writes itself beside it
          M.at(g, [[0.12 * T, g => { if (from) M.fly(g, { node: M.num(Q.n, null, { col: BLUE }), from: [from.x, from.y], to: 'k', dur: 0.42 * T, arc: -50, s0: from.s, s1: S.ws, col: BLUE,
              then(g) { S.K.alpha = 1; S.K.pop = g.t; burst('k', ['#8ad8ff', '#fff']); g.sfx('pop'); hop(); } }); }],
            [0.55 * T, g => { M.note(g, { node: M.row(M.op('-'), M.num(1)), at: S.E, off: [30, -30], s: 22, col: '#fff3a8', write: 0.26 * T, hold: 0.08 * T, fly: 0.24 * T, to: S.E, toOff: [S.ws * 0.5, 0], s1: S.ws * 0.6, arc: 8,
              then(g) { S.mi = M.op('-', 'sm', { col: '#fff3a8', _born: -1 }); S.one = M.num(1, 'so', { col: '#fff3a8', _born: -1, pop: g.t }); S.sub = M.row(S.E, S.mi, S.one); S.sub.id = 's'; S.outer.exp = S.sub; S.relay(); M.sparkle(g, 's', { n: 7 }); g.sfx('tap'); } }); }],
            [1.2 * T, g => M.unlight(g, S.E)]]);
          tailIn(0.8 * T); return; }
        if (Q.fam === 'sin') { M.show(g, 0.5 * T); M.circle(g, 'fn', { col: BLUE, dur: 0.45 * T }); M.light(g, S.fn, { col: BLUE }); tailIn(0.5 * T); return; }
        // eᵘ is its own derivative: the outside glows, and stays just as it is
        M.show(g, 1.2 * T); M.circle(g, 'eb', { col: BLUE, dur: 0.45 * T }); M.indicate(g, 'eb', { col: BLUE, delay: 0.15 * T, dur: 0.4 * T, sc: 1.3 }); M.sparkle(g, 'eb', { delay: 0.35 * T, cols: ['#8ad8ff', '#fff'] }); tailIn(0.45 * T);
      },
    };
    // sin turns into cos: "cos" writes itself above and drops into its place
    if (Q.fam === 'sin') Object.assign(outerMove, { askAt: 0.5 * T, after: 0.75 * T, ask: { v: 'cos', wrong: ['−cos', 'sin', '−sin'] },
      resolve(g) { M.show(g, 0.75 * T);
        M.note(g, { node: M.txt('cos'), at: 'fn', off: [0, -38], s: 26, col: '#bfe8ff', write: 0.22 * T, hold: 0.08 * T, fly: 0.24 * T, to: 'fn', s1: S.ws,
          then(g) { gone(S.fn); const c2 = M.txt('cos', 'fn', { _born: -1, pop: g.t }); S.outer.items[0] = c2; S.fn = c2; S.relay(); burst('fn', ['#8ad8ff', '#fff']); g.sfx('coin'); hop(); } });
        M.tween(g, S.fn, { alpha: 0, sc: 0.6, hl: 0 }, 0.2 * T, { delay: 0.34 * T }); } });
    // 2. n − 1 in the exponent: the − 1 slides into the power and it rolls down by one; a far frog croaks it out
    const subMove = {
      tap: 's', busy: 0.1, askAt: 0.45 * T, after: 1.0 * T, ask: { v: Q.n - 1, wrong: [Q.n, Q.n + 1, Q.n - 2] },
      then(g) { S.f.sub = true; M.show(g, 0.45 * T); S.point = true; M.circle(g, 's', { col: BLUE, dur: 0.42 * T, pad: 5 }); M.tween(g, S.sub, { sc: 1.35, dy: -6 }, 0.22 * T);
        [S.E, S.mi, S.one].forEach((q, k) => M.indicate(g, q, { delay: 0.12 * T + k * 0.08 * T, dur: 0.26 * T, sc: 1.15 })); },
      resolve(g) { const n1 = Q.n - 1; M.show(g, 1.0 * T); const bo = boxOf('ne');
        for (const q of [S.mi, S.one]) { const b = boxOf(q.id); if (b && bo) M.tween(g, q, { dx: bo.x - b.x, alpha: 0, sc: 0.5 }, 0.26 * T); }
        M.light(g, S.E, { col: BLUE }); M.roll(g, S.E, n1, { delay: 0.12 * T, dur: 0.32 * T });
        M.at(g, [[0.42 * T, g => { burst('s', ['#8ad8ff', '#fff', '#ffd45a']); g.sfx('ribbit'); S.croakT[0] = g.t; hop(); M.tween(g, S.sub, { sc: 1, dy: 0 }, 0.18 * T); }],
          [0.62 * T, g => { S.E.id = 'n2'; S.outer.exp = S.E; S.relay(); M.unlight(g, S.E, { dur: 0.3 * T }); if (n1 === 1) M.tween(g, S.E, { alpha: 0, sc: 0.4 }, 0.24 * T, { delay: 0.1 * T }); }], // x¹: the 1 shrinks away
          [0.95 * T, g => { if (n1 === 1) S.outer.exp = null; S.subLanded = true; S.relay(); centreLater(); S.point = false; }]]); },
    };
    // 3. the second firefly onto the inside copy (or a tap on it): the frog's tongue pops the bubble, constants are
    //    crossed out (their derivative is 0), the working writes itself under it and the inside's derivative flies up
    const innW = Q.inner === 'lin' ? [M.row(M.num(Q.a), M.vr('x')), Q.a + (Q.neg ? -Q.b : Q.b), Q.b] : Q.inner === 'quad' ? [M.vr('x'), 2, M.row(M.num(2), xp(2))]
      : Q.inner === 'cub' ? [M.row(M.num(Q.c + 3), xp(2)), M.row(M.num(3 * Q.c), xp(3)), M.row(M.num(Q.c), xp(2))]
      : Q.inner === 'mono' ? [xp(Q.m - 1), M.row(M.num(Q.m), xp(Q.m)), Q.m] : [M.row(M.num(Q.a), M.vr('x')), 1, 0];
    const dn = k => M.num(k, null, { col: BLUE }), pw = k => M.sup(M.vr('x'), M.row(dn(k), M.op('-'), M.num(1)));
    const innBody = () => { const z = [M.op(Q.neg ? '-' : '+'), M.num(0)];
      switch (Q.inner) { case 'lin': return M.row(M.num(Q.a), ...z); case 'quad': return M.row(dn(2), pw(2), ...z);
        case 'cub': return M.row(dn(3), M.op('·'), M.num(Q.c), pw(3), ...z); case 'mono': return M.row(dn(Q.m), pw(Q.m)); default: return M.row(M.num(Q.a), M.op('·'), M.num(1)); } };
    let IN = null;
    const innerProps = {
      busy: 0.1, askAt: 0.65 * T, after: 1.0 * T, ask: { v: coefX(D.gc, D.v), wrong: innW },
      then(g) { S.f.inn = true; M.show(g, 0.65 * T); tongue('j'); hop(); g.sfx('slurp'); S.point = true;
        M.circle(g, 'jp', { col: AMB, dur: 0.5 * T }); M.light(g, S.jIn, { col: AMB });
        ['j2', 'j3'].forEach((id, k) => { if (M.node(g, id)) M.strike(g, id, { delay: 0.18 * T + k * 0.08 * T, dur: 0.2 * T }); });
        IN = { q: M.row(M.op('='), tint(coefX(D.gc, D.v, 'nr'), AMB)) }; IN.q.alpha = 0; IN.node = M.row(innBody(), IN.q);
        const jb = boxOf('jp') || { x: 240 }; note(IN.node, jb.x, S.wy + 46); M.writeIn(g, IN.node, { delay: 0.12 * T, dur: 0.42 * T }); },
      resolve(g) { M.show(g, 1.0 * T); IN.q.alpha = 1; M.writeIn(g, IN.q, { dur: 0.2 * T }); M.indicate(g, IN.q.items[1], { delay: 0.18 * T, dur: 0.3 * T, col: AMB }); g.sfx('ding');
        M.at(g, [[0.25 * T, g => { popFx('jp'); g.sfx('bubble'); M.tween(g, S.jp, { alpha: 0, sc: 0.6 }, 0.18 * T); M.tween(g, S.d1, { alpha: 0, sc: 0.6 }, 0.18 * T); }],
          [0.48 * T, g => { S.G = born(tint(coefX(D.gc, D.v, 'g'), AMB)); S.G.alpha = 0; gone(S.jp); gone(S.d1); S.st.tail = 'g'; S.relay(); M.tween(g, IN.node, { alpha: 0 }, 0.3 * T);
            const qb = boxOf('nr'); IN.q.items[1].alpha = 0;
            M.fly(g, { node: tint(coefX(D.gc, D.v), AMB), from: [qb ? qb.x : 180, qb ? qb.y : S.wy + 40], to: 'g', dur: 0.36 * T, arc: 34, s0: 24, s1: S.ws, col: AMB,
              then(g) { S.G.alpha = 1; S.G.pop = g.t; burst('g', ['#ffc85a', '#fff2c0', '#fff']); g.sfx('coin'); hop(); } }); }],
          [0.95 * T, g => { delete g.s.mk.ex.note; S.point = false; }]]); },
    };
    // 4. multiply: the outside's derivative times the inside's derivative ("4 × 3 = 12"); for sin and e the inside's
    //    derivative just hops to the front
    let PR = null;
    const prodProps = pow
      ? { busy: 0.1, askAt: 0.55 * T, after: 1.05 * T, ask: { v: coefX(Q.n * D.gc, D.v), wrong: [coefX(Q.n + D.gc, D.v), D.v ? Q.n * D.gc : Q.n * D.gc + 1, D.v ? coefX(Q.n, D.v) : D.gc, Q.n] },
          then(g) { S.f.prod = true; M.show(g, 0.55 * T); S.point = true; hop(); M.circle(g, 'k', { dur: 0.5 * T, pad: 5 }); M.circle(g, 'g', { dur: 0.5 * T, pad: 5, delay: 0.1 * T }); M.light(g, S.K); M.light(g, S.G);
            PR = { q: coefX(Q.n * D.gc, D.v, 'pq') }; PR.q.alpha = 0; PR.node = M.row(M.num(Q.n), M.op('×'), tint(coefX(D.gc, D.v), AMB), M.op('='), PR.q);
            const kb = boxOf('k') || { x: 100 }; note(PR.node, kb.x + 30, S.wy - 48); M.writeIn(g, PR.node, { delay: 0.08 * T, dur: 0.42 * T }); },
          resolve(g) { M.show(g, 1.05 * T); PR.q.alpha = 1; M.writeIn(g, PR.q, { dur: 0.2 * T }); M.indicate(g, PR.q, { delay: 0.16 * T, dur: 0.3 * T }); g.sfx('ding'); hop();
            M.at(g, [[0.42 * T, g => { // the two factors slide together and fade while the product flies down into their place
                for (const q of [S.dot, S.G]) M.tween(g, q, { alpha: 0, sc: 0.5, hl: 0 }, 0.28 * T);
                M.tween(g, S.K, { alpha: 0, hl: 0 }, 0.25 * T); M.tween(g, PR.node, { alpha: 0 }, 0.3 * T, { delay: 0.1 * T });
                const qb = boxOf('pq'); PR.q.alpha = 0; M.fly(g, { node: coefX(Q.n * D.gc, D.v), from: [qb ? qb.x : 180, qb ? qb.y : S.wy - 48], to: 'k', dur: 0.36 * T, arc: -30, s0: 24, s1: S.ws, col: '#ffe08a',
                  then(g) { gone(S.K); gone(S.G); gone(S.dot); S.K = born(coefX(Q.n * D.gc, D.v, 'k', { pop: g.t })); S.st.tail = 'gone'; S.relay(); centreLater(); M.inert(g, ['k']); burst('k', ['#ffd45a', '#ff8a5a', '#fff', '#d8ff7a']); g.sfx('coin'); hop(); S.flare = g.t; } }); }],
              [0.95 * T, g => { delete g.s.mk.ex.note; S.point = false; }]]); } }
      : { busy: 0.1, then(g) { S.f.prod = true; M.show(g, 1.1 * T); S.point = true; M.circle(g, 'g', { col: AMB, dur: 0.4 * T }); M.tween(g, S.dot, { alpha: 0 }, 0.2 * T);
          M.at(g, [[0.32 * T, g => { const from = boxOf('g'); gone(S.dot); S.st.tail = 'gone'; S.st.front = true; S.G.alpha = 0; S.relay(); g.sfx('swoosh');
              M.fly(g, { node: tint(coefX(D.gc, D.v), AMB), from: [from.x, from.y], to: 'g', dur: 0.5 * T, arc: -70, s0: S.ws, s1: S.ws, col: AMB,
                then(g) { S.G.alpha = 1; S.G.pop = g.t; burst('g', ['#ffd45a', '#ff8a5a', '#fff', '#d8ff7a']); g.sfx('coin'); hop(); S.flare = g.t; centreLater(); } }); }],
            [1.0 * T, g => { S.point = false; }]]); } };
    const prodTo = pow ? ['k'] : Q.fam === 'sin' ? ['fn', 'outer', 'shell'] : ['eb', 'outer'];
    M.play(g, {
      moves(g) {
        const f = S.f;
        if (!f.out) return [outerMove];
        const out = [];
        if (!f.sub) out.push(subMove);
        if (!f.inn) out.push({ drag: 'd1', to: S.jIds, ...innerProps }, { tap: 'd1', ...innerProps });
        else if (!f.prod) out.push({ drag: 'g', to: prodTo, ...prodProps }, { tap: 'dot', ...prodProps }, ...(pow ? [{ drag: 'k', to: ['g'], ...prodProps }] : []));
        return out;
      },
      area(g) { const f = S.f; if (!f.out) return 'outer'; if (!f.sub) return 's'; if (!f.inn) return ['d1', 'jp']; return pow ? ['k', 'g'] : ['g', 'dot']; },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    // the firefly with the d/dx bobs (its token moves with it, unless it is being dragged)
    const pr = K.press; if (!(pr && pr.dragging && pr.id === 'd0') && !S.ffGone) M.place(g, 'fd', K.ex.fd.node, S.ff.x + Math.sin(g.t * 1.3) * 4, S.ff.y + 12 + Math.sin(g.t * 2.2) * 5, 38);
    S.fx = S.fx.filter(p => g.t - p.t0 < p.life);
    // a wrong move, acted out: the frog frowns; the d/dx dropped on the inside first (forgetting the outer layer) turns the inside red
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; const info = K.missInfo || {}; S.frog.sadAt = g.t;
      if (/^i\d?$/.test(info.to || '')) S.badBubble = g.t; }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', mk = S.mk;
    c.drawImage(g.bake('calc_chain_night', night), 0, 0, W, H);
    // twinkling stars over the baked sky
    c.save(); c.globalAlpha = 0.8; P.stars(c, W, 300, 22, 29, t); c.restore();
    P.water(c, W, 420, H, '#060a20', '#2a3470', t, { sparkle: '#dfe6ff', waves: 6 });
    // the moon's broken reflection
    for (let i = 0; i < 10; i++) { const y = 426 + i * 10, w = (26 - i * 2) * (0.7 + 0.3 * Math.sin(t * 3 + i * 1.7)); c.fillStyle = `rgba(220,230,255,${0.5 - i * 0.04})`; c.fillRect(300 - w / 2 + Math.sin(t * 2 + i) * 3, y, w, 2); }
    c.drawImage(g.bake('calc_chain_front', front), 0, 0, W, H);
    fireflies(c, t, FLIES_BACK, won ? 0.4 : 0);
    // the far frogs croak in turn (and croak out each power they lower)
    const cr = (k, i) => Math.max(Math.max(0, Math.sin(t * 2.2 + k)) ** 3, t - S.croakT[i] < 0.5 ? Math.sin((t - S.croakT[i]) / 0.5 * Math.PI) * 1.3 : 0);
    frog(c, 52, 468, 0.55, { t, expr: won ? 'laugh' : 'happy', croak: cr(0, 0), ph: 1.1, facing: 1, pose: won ? 'cheer' : 'idle' });
    frog(c, 316, 460, 0.5, { t: t + 0.7, expr: won ? 'laugh' : 'happy', croak: cr(2.4, 1), ph: 2.3, facing: -1, pose: won ? 'cheer' : 'idle' });
    // the static problem, written in starlight
    M.drawEx(g, c, 'prob');
    // the layers behind the working line
    const live = id => { const n = M.node(g, id); return n && !n.hide ? n : null; };
    // a bubble follows its symbols while they glide to a new place (_ax/_ay: how far a node is drawn from its box right now)
    const at = (b, n) => n && (n._ax || n._ay) ? { ...b, x: b.x + (n._ax || 0), y: b.y + (n._ay || 0) } : b;
    if (live('outer') && mk.box.outer) outerBubble(c, at(mk.box.outer, S.outer), t, (t - S.flash) / 0.45, false);
    if (live('i') && mk.box.i) innerBubble(c, at(mk.box.i, S.iIn), t, { bad: S.badBubble != null && t - S.badBubble < 1.2 });
    const jn = live('jp'); if (jn && mk.box.j && S.st.tail === 'dd') innerBubble(c, at(mk.box.j, S.jIn), t, { alpha: jn.alpha ?? 1, ph: 1.3 });
    if (live('s') && mk.box.s && !g.done) pill(c, mk.box.s, t, '138,216,255');
    if (S.st.tail === 'g' && !S.f.prod && live('dot') && mk.box.dot && !g.done) pill(c, mk.box.dot, t, '255,224,138');
    const d1 = live('d1'); if (d1 && mk.box.d1) { const b = mk.box.d1; carrier(c, b.x, b.y + 2, Math.max(b.w, b.h) * 0.44, t, d1.alpha ?? 1); }
    M.drawEx(g, c, 'work');
    if (mk.ex.note) { c.save(); c.shadowColor = 'rgba(4,6,24,0.9)'; c.shadowBlur = 8; M.drawEx(g, c, 'note'); c.restore(); }
    for (const p of S.fx) {
      const k = (t - p.t0) / p.life; if (k < 0) continue;
      if (p.k === 'pop') { c.save(); c.strokeStyle = `rgba(255,200,110,${1 - k})`; c.lineWidth = 3 * (1 - k); c.beginPath(); c.ellipse(p.x, p.y, p.w / 2 * (1 + k * 0.6), p.h / 2 * (1 + k * 0.8), 0, 0, 7); c.stroke();
        c.fillStyle = `rgba(255,220,150,${1 - k})`; for (let i = 0; i < 8; i++) { const a = i * 0.785 + 0.3; c.beginPath(); c.arc(p.x + Math.cos(a) * p.w * 0.5 * (1 + k), p.y + Math.sin(a) * p.h * 0.6 * (1 + k) + k * k * 20, 3 * (1 - k) + 1, 0, 7); c.fill(); } c.restore(); }
      if (p.k === 'ghost') { const m = M.lay(p.node, p.s); c.save(); c.globalAlpha = 1 - k; M.draw(c, p.node, p.x - m.w / 2, p.y - k * 26 + (m.a - m.d) / 2, p.s, {}); c.restore(); }
    }
    // the main frog on its pad, with ripples; its tongue snaps out at the inside bubble
    for (let i = 0; i < 3; i++) { const k = (t * 0.45 + i / 3) % 1; c.strokeStyle = `rgba(200,215,255,${0.25 * (1 - k)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(150, 524, 40 + k * 70, (40 + k * 70) * 0.33, 0, 0, 7); c.stroke(); }
    const bob = Math.sin(t * 1.6) * 1.5; pad(c, 150, 522 + bob, 56, 1.2);
    const f = S.frog, hk = (t - f.hopT) / 0.4, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0, fy = 530 + bob - hop * 30;
    const tg = f.tongue && t - f.tongue.t0 < 0.22 ? f.tongue : null;
    if (tg) { const k = Math.sin((t - tg.t0) / 0.22 * Math.PI), mx = 150, my = fy - 42, ex = mx + (tg.x - mx) * k, ey = my + (tg.y - my) * k;
      c.save(); c.strokeStyle = '#e8607a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(mx, my); c.quadraticCurveTo((mx + ex) / 2 - 20, (my + ey) / 2, ex, ey); c.stroke(); c.fillStyle = '#ff8098'; c.beginPath(); c.arc(ex, ey, 6, 0, 7); c.fill(); c.restore(); }
    const sad = lost || t - f.sadAt < 1.2;
    frog(c, 150, fy, 1.25, { t, pose: won ? 'cheer' : hop > 0 ? 'hop' : (!S.ffGone || S.point && M.showing(g)) ? 'point' : 'idle', expr: won ? 'laugh' : sad ? 'sad' : hop > 0 || tg ? 'wow' : 'happy', facing: 1 });
    // the firefly carrying the d/dx (it shrinks away when its d/dx is used)
    const fg = S.ffGone != null ? Math.min(1, (t - S.ffGone) / 0.2) : 0, fb = mk.box.d0, dragging = mk.press && mk.press.dragging && mk.press.id === 'd0';
    if (fb && fg < 1 && !dragging) { carrier(c, fb.x, fb.y + 2, 24 * (1 - fg), t, 1 - fg); if (!fg) M.drawEx(g, c, 'fd'); }
    cattails(c, t, -1); cattails(c, t, 1);
    fireflies(c, t, FLIES_FRONT, won ? 0.5 : (t - S.flare < 0.6 ? 0.4 : 0));
    // while it is dragged, the d/dx rides on its firefly
    if (dragging) { const p = mk.press; carrier(c, p.x, p.y - 18, 24, t); }
    M.drawUI(g, c);
  },
});
const FL = (n, seed, y0, y1) => { const r = P.rng(seed); return [...Array(n)].map(() => ({ x: 20 + r() * 320, y: y0 + r() * (y1 - y0), ax: 10 + r() * 22, ay: 6 + r() * 14, sp: 0.4 + r() * 0.6, ph: r() * 7, bl: 1.2 + r() * 1.6 })); };
const FLIES_BACK = [...FL(10, 31, 380, 470), ...FL(5, 37, 250, 380)], FLIES_FRONT = [...FL(6, 47, 540, 630), ...FL(3, 53, 180, 200)];
