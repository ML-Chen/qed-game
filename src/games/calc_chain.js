// calc_chain.js — CHAIN RULE! Differentiate a function inside a function: d/dx f(g(x)) = f'(g(x)) · g'(x).
// A marsh at night. The function floats over the water as nested glowing bubbles: the outer function is the big
// bubble, and the inside glows amber in a small bubble within it. A firefly carries the d/dx.
// The player drags the firefly onto the OUTER bubble: the outside is differentiated and the inside is left alone, and a
// second firefly carries a copy of the d/dx to a copy of the inside:
//   (3x + 1)⁴  →  4(3x + 1)^(4 − 1) · d/dx(3x + 1)
// Then, in any valid order: tap "4 − 1" (→ 3); drag the new firefly onto the inside bubble, or tap it (→ 3); once the
// inside is done, drag the 3 onto the 4 or tap the "·" (→ 12). Every result appears at once; nothing waits on an animation.
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
    const S = g.s; M.setup(g); const Q = S.Q = pick(g), D = S.D = innerD(Q);
    S.f = {}; // progress: out (outside done), sub (n − 1 done), inn (inside done), prod (multiplied)
    S.fx = []; S.frog = { hopT: -9, sadAt: -9, tongue: null }; S.croakT = [-9, -9]; S.flash = -9; S.flare = -9;
    if (Q.fam !== 'pow') S.f.sub = true;
    const iRow = (p, o) => {
      const items = p === 'i' && S.wrongInner ? [coefX(D.gc, D.v, null, { mark: 'bad' })] : innerTokens(Q, p);
      const r = M.row(...items); r.id = p || undefined; return Object.assign(r, o);
    };
    S.jIds = walkIds(iRow('j'));
    // the outer layer around the inside (ids on every part, so a wrong target can be hit)
    const outer = (o = {}) => {
      if (Q.fam === 'pow') {
        if (!S.f.out) return M.sup(M.paren(iRow('i'), 'shell', { col: BRK }), M.num(Q.n, 'n'), 'outer');
        const n1 = Q.n - 1, E = !S.f.sub ? (() => { const r = M.row(M.num(Q.n, null, { col: BLUE }), M.op('-'), M.num(1)); r.id = 's'; return r; })() : n1 === 1 ? null : M.num(n1, 'n2');
        return E ? M.sup(M.paren(iRow('i'), 'shell', { col: BRK }), E, 'outer') : M.paren(iRow('i'), 'outer', { col: BRK });
      }
      if (Q.fam === 'sin') { const fn = !S.f.out ? M.txt('sin', 'fn') : S.fnPend ? M.slot('fn', { col: STAR }) : M.txt('cos', 'fn'); const r = M.row(fn, M.paren(iRow('i'), 'shell', { col: BRK })); r.id = 'outer'; return r; }
      return M.sup(M.vr('e', 'eb'), iRow('i'), 'outer');
    };
    // the whole working line, rebuilt from the progress flags
    S.build = () => {
      const f = S.f, L = [M.op('=', 'eq')], sp = n => [M.gap(16), n, M.gap(14)]; // room for the outer bubble's glow
      if (!f.out) return M.row(...L, sp(outer()));
      const tail = f.prod ? [] : [M.op('·', 'dot'), ...(f.inn ? [coefX(D.gc, D.v, 'g')] : [M.gap(4), ddxD('d1'), M.gap(4), M.paren(iRow('j'), 'jp', { col: BRK })])];
      if (Q.fam === 'pow') {
        const K = !f.prod ? M.num(Q.n, 'k') : S.prodPend ? M.paren(M.row(M.num(Q.n), M.op('·'), coefX(D.gc, D.v, null, { col: BLUE })), 'k') : coefX(Q.n * D.gc, D.v, 'k');
        return M.row(...L, K, sp(outer()), ...tail);
      }
      if (f.prod) return M.row(...L, coefX(D.gc, D.v, 'g'), Q.fam === 'sin' ? M.gap(5) : null, sp(outer()));
      return M.row(...L, sp(outer()), ...tail);
    };
    // one size for every form of the line: the size that fits the widest form across the screen
    const f0 = S.f; S.f = { ...f0, out: true }; const wide = M.lay(S.build(), 40).w / 40; S.f = f0;
    S.ws = Math.min(46, 324 / wide); S.wy = 322; S.x0 = Math.max(16, 180 - wide * S.ws / 2);
    const probN = M.row(M.ddx('x', 'ddx'), Q.fam === 'pow' ? M.sup(M.paren(M.row(...innerTokens(Q, null))), M.num(Q.n)) : Q.fam === 'sin' ? M.row(M.txt('sin'), M.paren(M.row(...innerTokens(Q, null)))) : M.sup(M.vr('e'), M.row(...innerTokens(Q, null))));
    M.place(g, 'prob', probN, 180, 222, 30, { col: STAR });
    // the firefly with the d/dx hovers by the frog
    S.ff = { x: 246, y: 446 }; M.place(g, 'fd', M.row(ddxD('d0')), S.ff.x, S.ff.y + 12, 38);
    // the line is left-aligned while it grows and shrinks; the finished answer is centred
    S.relay = () => { const n = S.build(), done = S.f.prod && S.f.sub; M.place(g, 'work', n, done ? 180 - M.lay(n, S.ws).w / 2 : S.x0, S.wy, S.ws, { left: true, col: INKL }); };
    S.relay();
    M.inert(g, ['eq', 'ddx']);
    const nMoves = Q.fam === 'pow' ? 4 : 3; g.dur *= (2.6 + 1.05 * nMoves) / 8;

    const pop = (...ids) => ids.forEach(id => { const n = M.node(g, id); if (n) n.pop = g.t; });
    const boxOf = id => { const b = M.box(g, id); return b ? { ...b } : null; };
    const burst = (id, cols) => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, cols || ['#ffd45a', '#d8ff7a', '#fff'], 12, 130); };
    // a copy of a node flies from an old box to its new place (cosmetic, ≤ 0.25 s; the target is hidden until it lands)
    const flyIn = (node, from, toId, dur = 0.22, col = INKL) => {
      const n = M.node(g, toId); if (!from || !n) return; n.alpha = 0;
      M.fly(g, { node, from: [from.x, from.y], to: toId, dur, arc: -40, s0: from.s, s1: S.ws, col, then(g) { const m = M.node(g, toId); if (m) { m.alpha = 1; m.pop = g.t; } } });
    };
    const ghost = (id, node, life = 0.5) => { const b = M.box(g, id); if (b) S.fx.push({ k: 'ghost', node, x: b.x, y: b.y, s: b.s, t0: g.t, life }); };
    const popFx = id => { const b = M.box(g, id); if (b) S.fx.push({ k: 'pop', x: b.x, y: b.y, w: b.w + 12, h: b.h + 10, t0: g.t, life: 0.35 }); };
    const tongue = id => { const b = M.box(g, id); if (b) S.frog.tongue = { x: b.x, y: b.y + b.h * 0.3, t0: g.t }; };
    const outT = Q.fam === 'pow' ? ['n', 'outer', 'shell'] : Q.fam === 'sin' ? ['fn', 'outer', 'shell'] : ['eb', 'outer'];

    // 1. the firefly's d/dx onto the outer bubble: the outside is differentiated, the inside is left alone
    const outerMove = {
      drag: 'd0', to: outT, busy: 0.1, askAt: 0, after: 0.1,
      then(g) {
        const nb = boxOf('n'), ib = boxOf('i'), ob = boxOf('outer');
        S.f.out = true; S.flash = g.t; S.frog.hopT = g.t; S.ffGone = g.t; M.node(g, 'd0').hide = true; g.sfx('splash'); g.sfx('ribbit');
        if (Q.fam === 'sin' && g.mode === 'medium') S.fnPend = true;
        S.relay(); pop('outer', 'dot', 'fn');
        if (Q.fam === 'pow') flyIn(M.num(Q.n), nb, 'k');
        flyIn(M.row(...innerTokens(Q, null)), ib, 'j', 0.24);
        flyIn(ddxD(), ob, 'd1', 0.2, INKD);
        if (Q.fam !== 'pow') burst('outer', ['#8ad8ff', '#fff', '#d8ff7a']);
      },
    };
    if (Q.fam === 'sin') Object.assign(outerMove, { ask: { v: 'cos', wrong: ['−cos', 'sin', '−sin'] }, resolve(g) { S.fnPend = false; S.relay(); pop('fn'); burst('fn'); g.sfx('coin'); } });
    // 2. n − 1 in the exponent; a frog on a far pad croaks it out
    const subMove = {
      tap: 's', busy: 0.1, askAt: 0, after: 0.1, ask: { v: Q.n - 1, wrong: [Q.n, Q.n + 1, Q.n - 2] },
      then(g) { }, resolve(g) { const sb = boxOf('s'); S.f.sub = true; S.relay(); pop('n2', 'outer'); if (sb) g.burst(sb.x, sb.y, ['#8ad8ff', '#fff', '#ffd45a'], 12, 120); S.croakT[0] = g.t; g.sfx('ribbit'); },
    };
    // 3. the second firefly onto the inside copy (or a tap on it): the frog's tongue pops the bubble, and the
    //    inside's derivative appears; the parts whose derivative is 0 drift away
    const innW = Q.inner === 'lin' ? [M.row(M.num(Q.a), M.vr('x')), Q.a + (Q.neg ? -Q.b : Q.b), Q.b] : Q.inner === 'quad' ? [M.vr('x'), 2, M.row(M.num(2), xp(2))]
      : Q.inner === 'cub' ? [M.row(M.num(Q.c + 3), xp(2)), M.row(M.num(3 * Q.c), xp(3)), M.row(M.num(Q.c), xp(2))]
      : Q.inner === 'mono' ? [xp(Q.m - 1), M.row(M.num(Q.m), xp(Q.m)), Q.m] : [M.row(M.num(Q.a), M.vr('x')), 1, 0];
    const innerProps = {
      busy: 0.1, askAt: 0, after: 0.1, ask: { v: coefX(D.gc, D.v), wrong: innW },
      then(g) { tongue('j'); S.frog.hopT = g.t; g.sfx('slurp'); },
      resolve(g) {
        popFx('j'); innerTokens(Q, 'j').forEach(n => { if (/[23]$/.test(n.id)) ghost(n.id, tint({ ...n, id: null }, '#9aa0c8'), 0.45); });
        if (Q.inner === 'lin' || Q.inner === 'linx') ghost('j1', M.vr('x', null, { col: '#9aa0c8' }), 0.4);
        S.f.inn = true; S.relay(); pop('g'); burst('g', ['#ffc85a', '#fff2c0', '#fff']); g.sfx('bubble');
      },
    };
    // 4. multiply the outside's derivative by the inside's derivative (for sin and e, the factor just moves to the front)
    const prodResolve = g => {
      const gb = S.prodFrom; S.prodPend = false; S.relay(); pop('k', 'g'); g.sfx('coin'); S.frog.hopT = g.t; S.flare = g.t;
      const tgt = Q.fam === 'pow' ? 'k' : 'g'; if (gb) M.fly(g, { node: coefX(D.gc, D.v), from: [gb.x, gb.y], to: tgt, dur: 0.18, arc: -50, s0: gb.s, s1: S.ws, col: '#ffe08a' });
      burst(tgt, ['#ffd45a', '#ff8a5a', '#fff', '#d8ff7a']);
    };
    const prodProps = Q.fam === 'pow'
      ? { busy: 0.1, askAt: 0, after: 0.1, ask: { v: coefX(Q.n * D.gc, D.v), wrong: [coefX(Q.n + D.gc, D.v), D.v ? Q.n * D.gc : Q.n * D.gc + 1, D.v ? coefX(Q.n, D.v) : D.gc, Q.n] },
          then(g) { S.prodFrom = boxOf('g'); S.f.prod = true; if (g.mode === 'medium') { S.prodPend = true; S.relay(); pop('k'); } }, resolve: prodResolve }
      : { busy: 0.1, then(g) { S.prodFrom = boxOf('g'); S.f.prod = true; prodResolve(g); } };
    const prodTo = Q.fam === 'pow' ? ['k'] : Q.fam === 'sin' ? ['fn', 'outer', 'shell'] : ['eb', 'outer'];
    M.play(g, {
      moves(g) {
        const f = S.f;
        if (!f.out) return [outerMove];
        const out = [];
        if (!f.sub) out.push(subMove);
        if (!f.inn) out.push({ drag: 'd1', to: S.jIds, ...innerProps }, { tap: 'd1', ...innerProps });
        else if (!f.prod) out.push({ drag: 'g', to: prodTo, ...prodProps }, { tap: 'dot', ...prodProps }, ...(Q.fam === 'pow' ? [{ drag: 'k', to: ['g'], ...prodProps }] : []));
        return out;
      },
      area(g) { const f = S.f; if (!f.out) return 'outer'; if (!f.sub) return 's'; if (!f.inn) return ['d1', 'jp']; return Q.fam === 'pow' ? ['k', 'g'] : ['g', 'dot']; },
      onMiss(g, info) {
        S.frog.sadAt = g.t;
        // the classic mistake, acted out: the d/dx on the inside first, while the outer power is forgotten
        if (info.drag === 'd0' && /^i\d?$/.test(info.to || '')) { S.wrongInner = true; S.relay(); M.node(g, 'd0').hide = true; S.ffGone = g.t; popFx('i'); g.sfx('splash');
          // then the firefly comes back, so the hint can show where its d/dx should have gone
          M.later(g, 0.6, () => { M.node(g, 'd0').hide = false; S.ffGone = null; }); }
        if (info.drag === 'd1' && /^i\d?$/.test(info.to || '')) S.badBubble = g.t;
      },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    // the firefly with the d/dx bobs (its token moves with it, unless it is being dragged)
    const pr = S.mk.press; if (!(pr && pr.dragging && pr.id === 'd0') && !S.ffGone) M.place(g, 'fd', S.mk.ex.fd.node, S.ff.x + Math.sin(g.t * 1.3) * 4, S.ff.y + 12 + Math.sin(g.t * 2.2) * 5, 38);
    S.fx = S.fx.filter(p => g.t - p.t0 < p.life);
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
    if (live('outer') && mk.box.outer) outerBubble(c, mk.box.outer, t, (t - S.flash) / 0.45, S.wrongInner);
    if (live('i') && mk.box.i) innerBubble(c, mk.box.i, t, { bad: S.wrongInner || (S.badBubble != null && t - S.badBubble < 2) });
    const jn = live('j'); if (jn && mk.box.j) innerBubble(c, mk.box.j, t, { alpha: jn.alpha ?? 1, ph: 1.3 });
    if (live('s') && mk.box.s && !g.done) pill(c, mk.box.s, t, '138,216,255');
    if (S.f.inn && !S.f.prod && live('dot') && mk.box.dot && !g.done) pill(c, mk.box.dot, t, '255,224,138');
    const d1 = live('d1'); if (d1 && mk.box.d1) { const b = mk.box.d1; carrier(c, b.x, b.y + 2, Math.max(b.w, b.h) * 0.44, t, d1.alpha ?? 1); }
    M.drawEx(g, c, 'work');
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
    frog(c, 150, fy, 1.25, { t, pose: won ? 'cheer' : hop > 0 ? 'hop' : !S.ffGone ? 'point' : 'idle', expr: won ? 'laugh' : sad ? 'sad' : hop > 0 || tg ? 'wow' : 'happy', facing: 1 });
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
