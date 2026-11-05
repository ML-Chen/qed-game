// add_multiply.js — MULTIPLY! Long multiplication by a one-digit number, written vertically: 23 × 4, 47 × 6, 368 × 7.
// The scene is a picnic blanket seen from above. The digits sit on cookies, the line is a pretzel stick, and the carried
// digits are blueberries that ants carry. Everything happens on the multiplication itself.
// One move per digit of the top number, right to left (ones first): the player drags the bottom digit onto that top
// digit (or drags the top digit onto it, or taps the top digit). An ant runs the multiplier up to the digit, a small tag
// under that column shows the work at once ("4 × 3 = 12", or "4 × 2 + 1 = 9" when a carry is waiting), the ones digit
// drops into the answer, and an ant carries the tens digit up to the top of the next column by itself. On the last
// column the whole value is written. Nothing waits on an animation (busy 0.1; the ants take at most 0.28 s).
// The classic mistake, the tens digit before the ones, only wobbles: a red tag shows the product landing in the wrong
// place for a moment, and the right move keeps glowing.
// Level 0: 2-digit × 1-digit, one carry, a 2-digit answer. Level 1: bigger digits, often a 3-digit answer.
// Level 2: 3-digit × 1-digit. Medium mode: each move opens the tray for that column's value (digit × multiplier + carry).
const M = MK;
const HOT = '#d0401a', CARRYC = '#2a7ab0', CHOC = '#4a2410', ANS = '#5a2a3a';
const { clamp, lerp } = M;

// ---------------- the problem ----------------
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  for (let n = 0; n < 400; n++) {
    if (L === 0) { const a = 1 + r(3), b = 3 + r(7), q = 2 + r(3); if (b * q < 10 || a * q + Math.floor(b * q / 10) > 9) continue; return { top: [b, a], q }; }
    if (L === 1) { const a = 2 + r(7), b = 2 + r(8), q = 3 + r(7); if (b * q < 10) continue; return { top: [b, a], q }; }
    const a = 1 + r(3), b = 2 + r(8), c = 2 + r(8), q = 3 + r(5); if (c * q < 10) continue; return { top: [c, b, a], q };
  }
  return { top: [3, 2], q: 4 };
}
const digits = v => String(v).split('').reverse().map(Number); // ones first
const num10 = ds => ds.reduce((s, d, i) => s + d * Math.pow(10, i), 0);

// ---------------- an ant (fallback painter, used when src/animals.js is missing, and for the little marchers) ----------------
// x, y = the point between its feet. walk: 0..1 (leg swing). facing 1 = right.
function antArt(c, x, y, s, o = {}) {
  const t = o.t || 0, f = o.facing || 1, walk = o.walk || 0, pose = o.pose || 'idle', expr = o.expr || 'happy';
  const OUT = '#2a0c12', ph = t * 18 * (o.speed || 1);
  c.save(); c.translate(x, y); c.scale(s * f, s);
  if (!o.noShadow) { c.fillStyle = 'rgba(40,20,30,0.22)'; c.beginPath(); c.ellipse(0, 1, 21, 4, 0, 0, 7); c.fill(); }
  const bob = walk ? Math.abs(Math.sin(ph)) * 1.4 : Math.sin(t * 2.6) * 0.7, hipY = -10 - bob;
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (let side = 1; side >= 0; side--) for (let k = 0; k < 3; k++) {
    const hx = -4 + k * 4, sw = walk ? Math.sin(ph + k * 2.1 + side * Math.PI) * 4.5 : Math.sin(t * 2 + k) * 0.4;
    const fx = -10 + k * 9.5 + sw + (side ? 2.5 : 0), lift = walk ? Math.max(0, Math.cos(ph + k * 2.1 + side * Math.PI)) * 2.2 : 0;
    const kx = (hx + fx) / 2 + (k === 2 ? 2 : k === 0 ? -2 : 0), ky = hipY - 5;
    c.strokeStyle = side ? '#4a1a1a' : OUT; c.lineWidth = 2.3; c.beginPath(); c.moveTo(hx, hipY); c.lineTo(kx, ky); c.lineTo(fx, -lift); c.stroke();
  }
  c.translate(0, -bob);
  const body = (cx, cy, rx, ry, rot) => { const gr = c.createRadialGradient(cx - rx * 0.35, cy - ry * 0.45, 1, cx, cy, Math.max(rx, ry) * 1.15); gr.addColorStop(0, '#c0503a'); gr.addColorStop(0.55, '#8a2c22'); gr.addColorStop(1, '#4a1410');
    c.fillStyle = gr; c.strokeStyle = OUT; c.lineWidth = 1.8; c.beginPath(); c.ellipse(cx, cy, rx, ry, rot, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,230,210,0.55)'; c.beginPath(); c.ellipse(cx - rx * 0.3, cy - ry * 0.5, rx * 0.32, ry * 0.18, rot - 0.3, 0, 7); c.fill(); };
  body(-14, -13, 10.5, 8.5, -0.2); // abdomen
  c.fillStyle = '#5a1a14'; c.beginPath(); c.arc(-4.5, -11.5, 2.4, 0, 7); c.fill(); // waist
  body(0, -12, 6.2, 5, 0.1); // thorax
  if (pose === 'cheer') { c.strokeStyle = OUT; c.lineWidth = 2.3; const wv = Math.sin(t * 12) * 3; c.beginPath(); c.moveTo(2, -14); c.lineTo(6, -26 + wv); c.moveTo(-1, -14); c.lineTo(-4, -27 - wv); c.stroke(); }
  // head
  const hy = -17 + (pose === 'sad' ? 2 : 0);
  body(11, hy, 8, 7.6, 0);
  // antennae
  const droop = pose === 'sad' ? 6 : 0, wig = Math.sin(t * 5) * 1.5;
  c.strokeStyle = OUT; c.lineWidth = 1.6; c.beginPath();
  c.moveTo(9, hy - 6); c.quadraticCurveTo(10, hy - 15 + droop, 17 + wig, hy - 17 + droop * 1.6);
  c.moveTo(13, hy - 6); c.quadraticCurveTo(17, hy - 13 + droop, 23 - wig, hy - 13 + droop * 1.6); c.stroke();
  c.fillStyle = '#5a1a14'; c.beginPath(); c.arc(17 + wig, hy - 17 + droop * 1.6, 1.8, 0, 7); c.arc(23 - wig, hy - 13 + droop * 1.6, 1.8, 0, 7); c.fill();
  // eye and mouth
  c.fillStyle = '#fff'; c.beginPath(); c.ellipse(14, hy - 1.5, 3.4, 3.9, 0, 0, 7); c.fill();
  const blink = (t % 3.7) < 0.12; c.fillStyle = '#1a0a10'; if (blink) c.fillRect(11.5, hy - 1.8, 5, 1.2); else { c.beginPath(); c.ellipse(15, hy - 1, 1.9, 2.3, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(14.4, hy - 2, 0.7, 0, 7); c.fill(); }
  c.strokeStyle = '#2a0c12'; c.lineWidth = 1.3; c.beginPath();
  if (expr === 'sad') { c.arc(15, hy + 6.5, 2.4, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  else if (expr === 'laugh' || expr === 'wow') { c.fillStyle = '#5a1020'; c.beginPath(); c.ellipse(15.5, hy + 4, 2.2, expr === 'wow' ? 2.4 : 1.8, 0, 0, 7); c.fill(); }
  else { c.arc(15, hy + 2.5, 2.6, 0.25, Math.PI - 0.6); c.stroke(); }
  c.fillStyle = 'rgba(255,120,130,0.4)'; c.beginPath(); c.ellipse(11.5, hy + 3, 2, 1.2, 0, 0, 7); c.fill();
  c.restore();
}
// the cast ant: ANI if it is there, otherwise the painter above
function ant(c, x, y, s, o) {
  try { if (typeof ANI !== 'undefined' && ANI && ANI.draw && !o.walk) { ANI.draw(c, 'ant', x, y, s, { t: o.t, pose: o.pose, expr: o.expr, facing: o.facing }); return; } } catch (e) { }
  antArt(c, x, y, s, o);
}

// ---------------- seen from above: an ant, cookies, a plate ----------------
// a little ant seen from above, heading `ang` (0 = right). crumb: colour of what it carries in its jaws.
function antTop(c, x, y, s, ang, t, o = {}) {
  const ph = t * 20 * (o.speed || 1), walk = o.walk ?? 1, OUT = '#2a0c12';
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  c.fillStyle = 'rgba(40,30,20,0.22)'; c.beginPath(); c.ellipse(-2, 3, 13, 5, 0, 0, 7); c.fill();
  c.strokeStyle = OUT; c.lineWidth = 1.5; c.lineCap = 'round';
  for (let k = 0; k < 3; k++) for (const sd of [-1, 1]) {
    const sw = walk ? Math.sin(ph + k * 2.1 + (sd > 0 ? Math.PI : 0)) * 2.6 : 0, hx = -1 + (k - 1) * 1.5;
    c.beginPath(); c.moveTo(hx, 0); c.lineTo(hx + (k - 1) * 3 + sw * 0.5, sd * 5); c.lineTo(hx + (k - 1) * 6 + sw, sd * 8.5); c.stroke();
  }
  const seg = (cx, rx, ry) => { const gr = c.createRadialGradient(cx - rx * 0.3, -ry * 0.4, 0.5, cx, 0, Math.max(rx, ry) * 1.2); gr.addColorStop(0, '#c45a40'); gr.addColorStop(0.6, '#7a2620'); gr.addColorStop(1, '#3a1010');
    c.fillStyle = gr; c.beginPath(); c.ellipse(cx, 0, rx, ry, 0, 0, 7); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); };
  seg(-8, 5.8, 4.4); seg(-1, 3.2, 2.6); seg(5, 3.6, 3.4);
  const wig = Math.sin(t * 6) * 0.25; c.strokeStyle = OUT; c.lineWidth = 1.1;
  c.beginPath(); c.moveTo(7.5, -1.5); c.quadraticCurveTo(10, -5 + wig, 13, -5.5); c.moveTo(7.5, 1.5); c.quadraticCurveTo(10, 5 - wig, 13, 5.5); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(6.2, -1.6, 0.9, 0, 7); c.arc(6.2, 1.6, 0.9, 0, 7); c.fill();
  if (o.crumb) { c.fillStyle = o.crumb; c.strokeStyle = 'rgba(40,20,30,0.5)'; c.lineWidth = 0.8; c.beginPath(); c.arc(11, 0, o.crumbR || 3.2, 0, 7); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(10.2, -1, (o.crumbR || 3.2) * 0.35, 0, 7); c.fill(); }
  c.restore();
}
// a round cookie (chocolate chip, sugar or frosted) under a digit's box
function cookie(c, b, kind, t, o = {}) {
  if (!b) return; const r = o.r || Math.max(b.w, b.h) * 0.62, x = b.x, y = b.y + (o.dy || 0), sc = o.sc || 1;
  c.save(); c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = 'rgba(60,20,30,0.22)'; c.beginPath(); c.ellipse(2, 4, r * 1.02, r * 0.98, 0, 0, 7); c.fill();
  const pal = { chip: ['#f6d08a', '#d89a48', '#a86a2a'], sugar: ['#fff4dc', '#f0dcb4', '#c8a878'], pink: ['#ffe0ec', '#f6a8c4', '#c0708a'], blue: ['#9ad0ff', '#3a8ad8', '#1a4a8a'], bad: ['#ffd8d4', '#f4a09a', '#c04848'] }[kind] || ['#f6d08a', '#d89a48', '#a86a2a'];
  const gr = c.createRadialGradient(-r * 0.3, -r * 0.35, 1, 0, 0, r * 1.05); gr.addColorStop(0, pal[0]); gr.addColorStop(0.75, pal[1]); gr.addColorStop(1, pal[2]);
  c.fillStyle = gr; c.beginPath(); for (let i = 0; i <= 18; i++) { const a = i / 18 * Math.PI * 2, rr = r * (1 + Math.sin(a * 5 + r) * 0.025); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill();
  c.strokeStyle = P.rgba(pal[2], 0.7); c.lineWidth = 1.5; c.stroke();
  if (kind === 'chip') { const rg = P.rng(Math.round(r * 7) + (o.seed || 0)); c.fillStyle = '#5a2e18'; for (let i = 0; i < 7; i++) { const a = rg() * 7, d = r * (0.62 + rg() * 0.25); c.beginPath(); c.ellipse(Math.cos(a) * d, Math.sin(a) * d, 2.2, 1.7, a, 0, 7); c.fill(); } }
  if (kind === 'pink') { c.fillStyle = '#fff'; const rg = P.rng(9); for (let i = 0; i < 9; i++) { const a = rg() * 7, d = r * (0.7 + rg() * 0.2); c.save(); c.translate(Math.cos(a) * d, Math.sin(a) * d); c.rotate(a * 3); c.fillStyle = ['#7ad0ff', '#ffd45a', '#fff', '#9ae07a'][i % 4]; c.fillRect(-2, -0.7, 4, 1.4); c.restore(); } }
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-r * 0.35, -r * 0.45, r * 0.35, r * 0.16, -0.5, 0, 7); c.fill();
  c.restore();
}
// a pretzel stick, for the line under a sum
function pretzel(c, x0, x1, y) {
  c.save(); c.fillStyle = 'rgba(60,20,30,0.2)'; c.beginPath(); c.roundRect(x0 + 2, y - 1, x1 - x0, 8, 4); c.fill();
  const gr = c.createLinearGradient(0, y - 4, 0, y + 4); gr.addColorStop(0, '#d8904a'); gr.addColorStop(0.5, '#a85a24'); gr.addColorStop(1, '#6a3410');
  c.fillStyle = gr; c.beginPath(); c.roundRect(x0, y - 4, x1 - x0, 8, 4); c.fill();
  c.fillStyle = '#fff'; const rg = P.rng(Math.round(x0)); for (let x = x0 + 6; x < x1 - 4; x += 7 + rg() * 5) { c.fillRect(x, y - 3 + rg() * 3, 2, 1.4); }
  c.restore();
}

// ---------------- the picnic, seen from above ----------------
const BL = { x0: 8, y0: 174, x1: 352, y1: 612 }; // the blanket
function picnic(c, W, H) {
  const gg = c.createLinearGradient(0, 0, W, H); gg.addColorStop(0, '#8ad25a'); gg.addColorStop(1, '#5aa83e'); c.fillStyle = gg; c.fillRect(0, 0, W, H);
  c.save(); c.globalAlpha = 0.12; c.fillStyle = '#ffffff'; for (let i = -10; i < 20; i++) { c.beginPath(); c.moveTo(i * 44, 0); c.lineTo(i * 44 + 22, 0); c.lineTo(i * 44 + 22 + 300, H); c.lineTo(i * 44 + 300, H); c.closePath(); c.fill(); } c.restore();
  const rg = P.rng(31); for (let i = 0; i < 260; i++) { const x = rg() * W, y = rg() * H; c.fillStyle = rg() < 0.5 ? 'rgba(40,110,30,0.35)' : 'rgba(200,240,140,0.35)'; c.fillRect(x, y, 1.5, 4 + rg() * 3); }
  // clover and daisies seen from above
  for (let i = 0; i < 14; i++) { const x = rg() * W, y = rg() < 0.7 ? rg() * 170 : 612 + rg() * 28; c.fillStyle = '#4a9a34'; for (let k = 0; k < 3; k++) { const a = k * 2.1 + i; c.beginPath(); c.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 3, 0, 7); c.fill(); } }
  P.flowers(c, W, 6, 168, 14, ['#ffffff', '#ffffff', '#f4d35e', '#ee6c8a'], 5);
  // the shadow of a tree in the top corner
  c.save(); c.fillStyle = 'rgba(20,60,20,0.22)'; const tr = P.rng(4); for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-20 + tr() * 120, -20 + tr() * 100, 30 + tr() * 30, 0, 7); c.fill(); } c.restore();
  // the gingham blanket, a little crooked
  c.save(); c.translate(180, 393); c.rotate(-0.02); c.translate(-180, -393);
  const { x0, y0, x1, y1 } = BL;
  c.fillStyle = 'rgba(30,50,20,0.3)'; c.beginPath(); c.roundRect(x0 + 5, y0 + 8, x1 - x0, y1 - y0, 6); c.fill();
  c.fillStyle = '#fff8f0'; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  const cs = 28; c.fillStyle = 'rgba(226,84,92,0.34)';
  for (let x = x0; x < x1; x += cs * 2) c.fillRect(x, y0, Math.min(cs, x1 - x), y1 - y0);
  for (let y = y0; y < y1; y += cs * 2) c.fillRect(x0, y, x1 - x0, Math.min(cs, y1 - y));
  c.globalAlpha = 0.06; c.strokeStyle = '#a03040'; c.lineWidth = 1; for (let x = x0; x < x1; x += 4) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); } c.globalAlpha = 1;
  c.strokeStyle = '#c84050'; c.lineWidth = 3; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
  c.fillStyle = '#c84050'; for (let x = x0 + 3; x < x1; x += 6) { c.fillRect(x, y0 - 4, 2, 4); c.fillRect(x, y1, 2, 4); }
  c.restore();
  // the picnic itself: a wicker basket with its lid open, a watermelon slice, a cup of lemonade (all around the edges)
  const bx = 146, by = 594; c.fillStyle = 'rgba(60,20,30,0.25)'; c.beginPath(); c.roundRect(bx - 38, by - 24, 80, 56, 12); c.fill();
  const wb = c.createLinearGradient(0, by - 26, 0, by + 26); wb.addColorStop(0, '#e0b06a'); wb.addColorStop(1, '#a8743a'); c.fillStyle = wb; c.beginPath(); c.roundRect(bx - 40, by - 28, 78, 54, 12); c.fill();
  c.strokeStyle = 'rgba(110,70,30,0.6)'; c.lineWidth = 1.4; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(bx - 38, by - 22 + i * 9); c.lineTo(bx + 36, by - 22 + i * 9); c.stroke(); }
  c.fillStyle = '#7a4a1e'; c.beginPath(); c.roundRect(bx - 30, by - 18, 58, 34, 8); c.fill();
  for (const [ox, oy, col] of [[-16, -6, '#f2c46a'], [0, 2, '#e0484a'], [14, -6, '#f2c46a'], [-6, 8, '#9ae07a']]) { c.fillStyle = col; c.beginPath(); c.ellipse(bx + ox, by + oy, 9, 6, ox * 0.05, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(bx + ox - 3, by + oy - 2, 3, 1.5, 0, 0, 7); c.fill(); }
  c.strokeStyle = '#8a5a2a'; c.lineWidth = 4; c.beginPath(); c.ellipse(bx, by - 2, 30, 20, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
  const wx = 236, wy = 600; c.save(); c.translate(wx, wy); c.rotate(0.3);
  c.fillStyle = 'rgba(60,20,30,0.22)'; c.beginPath(); c.moveTo(3, 4); c.arc(3, 4, 30, Math.PI * 1.15, Math.PI * 1.85); c.closePath(); c.fill();
  c.fillStyle = '#3e8a3a'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 30, Math.PI * 1.15, Math.PI * 1.85); c.closePath(); c.fill();
  c.fillStyle = '#d8f0b0'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 26, Math.PI * 1.15, Math.PI * 1.85); c.closePath(); c.fill();
  c.fillStyle = '#f04a5a'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 23, Math.PI * 1.15, Math.PI * 1.85); c.closePath(); c.fill();
  c.fillStyle = '#2a1018'; for (const [sx, sy] of [[-6, -14], [4, -15], [-1, -9], [7, -9], [-8, -8]]) { c.beginPath(); c.ellipse(sx, sy, 1.3, 2, 0, 0, 7); c.fill(); }
  c.restore();
  const cx = 34, cy = 590; c.fillStyle = 'rgba(60,20,30,0.25)'; c.beginPath(); c.arc(cx + 3, cy + 4, 17, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(cx, cy, 17, 0, 7); c.fill(); c.fillStyle = '#ffe680'; c.beginPath(); c.arc(cx, cy, 13, 0, 7); c.fill();
  c.fillStyle = '#fff6b0'; c.beginPath(); c.arc(cx - 4, cy - 4, 5, 0, 7); c.fill(); c.fillStyle = '#f4d040'; c.beginPath(); c.arc(cx + 4, cy + 2, 4, 0, 7); c.fill(); c.strokeStyle = '#e04a7a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx + 2, cy); c.lineTo(cx + 20, cy - 16); c.stroke();
  const cr = P.rng(8); for (let i = 0; i < 22; i++) { c.fillStyle = cr() < 0.5 ? '#d8a050' : '#f6d6a0'; c.beginPath(); c.arc(30 + cr() * 300, 410 + cr() * 190, 1 + cr() * 1.6, 0, 7); c.fill(); }
}
// the marchers' trail: in from the grass at the bottom right, to the watermelon, and back
const TRAIL = [[372, 520], [340, 572], [290, 598], [246, 590]];
function trailAt(u) { const [a, b, c2, d] = TRAIL, w = 1 - u, f = i => w * w * w * a[i] + 3 * w * w * u * b[i] + 3 * w * u * u * c2[i] + u * u * u * d[i]; return [f(0), f(1)]; }

MG.add({
  id: 'multiply', stage: 'longway', cmd: 'MULTIPLY!', hint: 'drag', time: 9, mood: 'bright', winText: 'Multiplied!', hold: 1.4,
  card: {
    title: 'Long multiplication', ref: 'Grade 4', kind: 'Multiplication',
    text: 'Long multiplication is a way to multiply a big number one digit at a time. A digit is one of the single numbers 0 to 9 that make up a number. The number 23 has the digits 2 and 3.\n\nWrite the big number on top and the small number under it. Multiply the bottom number by each digit of the top number, starting with the ones digit on the right. Write the ones digit of each answer under that column. If an answer has a tens digit, carry it: write it small above the next column, and add it after you multiply that column.\n\nFor example, 23 × 4. First, 4 × 3 = 12. Write the 2 and carry the 1. Next, 4 × 2 = 8, and 8 plus the carried 1 is 9. So 23 × 4 = 92.\n\nHere is why carrying works. 4 × 3 = 12 ones, which is 1 ten and 2 ones. The 1 ten belongs in the tens column, so you carry it there.',
    note: 'Start at the right. Multiply the digit, add any carried digit, write the ones digit, and carry the tens digit to the next column.',
    ask: 'What is 34 × 6? What is 213 × 4?',
  },
  init(g) {
    const S = g.s; M.setup(g); const pr = pick(g); S.top = pr.top; S.q = pr.q;
    S.ans = num10(S.top) * S.q; const nTop = S.top.length, nAns = digits(S.ans).length, ncols = Math.max(nTop, nAns) + 1;
    const L2 = nTop > 2;
    S.G = { s: L2 ? 42 : 46, r: L2 ? 22 : 25, cs: 22, cw: L2 ? 50 : 54, ns: L2 ? 23 : 25, yC: 212, yT: 262, yB: 324, yL: 357, yR: 406, yTag: 450 };
    const G = S.G; G.x0 = 180 + (ncols - 1) * G.cw / 2; G.ncols = ncols;
    const colX = c => G.x0 - c * G.cw; S.colX = colX;
    // each token gets an ink that suits its cookie: chocolate on chip cookies, plum on sugar cookies, white on blueberries
    S.pos = {};
    const put = (id, node, x, y, s, col) => { S.pos[id] = [x, y, s, col]; M.place(g, id, node, x, y, s, { col }); };
    S.put = id => { const n = M.node(g, id), p = S.pos[id]; if (n && p) M.place(g, id, n, p[0], p[1], p[2], { col: p[3] }); };
    S.top.forEach((d, i) => put('t' + i, M.num(d, 't' + i), colX(i), G.yT, G.s, CHOC));
    put('b0', M.num(S.q, 'b0'), colX(0), G.yB, G.s, CHOC);
    put('times', M.op('×', 'times'), colX(ncols - 1), G.yB, G.s * 0.9, '#8a4a24');
    for (let c = 1; c < nTop; c++) put('c' + c, M.num(0, 'c' + c, { hide: true }), colX(c), G.yC, G.cs, '#ffffff');
    for (let c = 0; c < ncols - 1; c++) put('r' + c, M.num(0, 'r' + c, { hide: true }), colX(c), G.yR, G.s, ANS);
    M.inert(g, ['times', ...[...Array(ncols - 1)].map((_, c) => 'r' + c), ...[...Array(nTop)].map((_, c) => 'c' + c)]);
    // one move per digit of the top number
    g.dur *= (2.6 + 1.05 * nTop) / 8;
    S.i = 0; S.carry = 0; S.host = { hopAt: -9, sadAt: -9 }; S.carriers = []; S.tag = null; S.final = digits(S.ans).map((_, c) => 'r' + c);

    const node = id => M.node(g, id), mk = S.mk, NS = G.ns;
    M.inert(g, ['nv0', 'nv1', 'nc', 'nrow']);
    const burstAt = (id, cols = ['#ffd45a', '#7ad0ff', '#fff']) => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, cols, 10, 120); };
    const hot = (ids, on) => ids.forEach(id => { const n = node(id); if (n) { n.col = on ? HOT : undefined; if (on) n.pop = g.t; } });
    const reveal = (id, v) => { const n = node(id); if (!n) return; n.v = String(v); n.hide = false; n.alpha = 1; n.pop = g.t; S.put(id); burstAt(id, ['#ffd45a', '#fff']); };
    const host = (face, hop = true) => { S.host.face = face; S.host.faceT = g.t; if (hop) S.host.hopAt = g.t; };
    // an ant runs from a to b holding a digit over its head; then() runs when it arrives
    const runAnt = (v, col, a, b, dur, then) => S.carriers.push({ v, col, x0: a.x, y0: a.y, x1: b.x, y1: b.y, t0: g.t, dur, then });
    // the carried tens digit: lifted off the note, then carried up and over to sit small above the next column
    const liftCarry = (v, from, to, T, then) => {
      const up = 0.16 * T, over = 0.42 * T, lx = from.x, ly = from.y - 26;
      M.anim(g, { dur: up + over, draw(c, g, k, tt) {
        let x, y, r;
        if (tt < up) { const e = M.ease(tt / up); x = lx; y = M.lerp(from.y, ly, e); r = M.lerp(9, 13, e); }
        else { const u = M.easeIO((tt - up) / over), cxp = (lx + to.x) / 2 + 10, cyp = Math.min(ly, to.y) - 90; x = (1 - u) * (1 - u) * lx + 2 * (1 - u) * u * cxp + u * u * to.x; y = (1 - u) * (1 - u) * ly + 2 * (1 - u) * u * cyp + u * u * to.y; r = M.lerp(13, G.cs * 0.62, u) * (1 + Math.sin(u * Math.PI) * 0.35);
          // a dotted trail behind it
          c.save(); c.fillStyle = 'rgba(122,208,255,0.7)'; for (let j = 1; j <= 5; j++) { const w = Math.max(0, u - j * 0.05), q = (1 - w); const px = q * q * lx + 2 * q * w * cxp + w * w * to.x, py = q * q * ly + 2 * q * w * cyp + w * w * to.y; c.globalAlpha = 0.5 - j * 0.08; c.beginPath(); c.arc(px, py, 3.2 - j * 0.4, 0, 7); c.fill(); } c.restore(); }
        c.shadowColor = 'rgba(122,208,255,0.9)'; c.shadowBlur = 14; cookie(c, { x, y, w: 10, h: 10 }, 'blue', g.t, { r }); c.shadowBlur = 0;
        c.font = M.NUMF(r * 1.25, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(String(v), x, y + 1);
      } });
      M.at(g, [[up + over, then]]);
    };

    const colMove = (i) => {
      const d = S.top[i], c = S.carry, p = S.q * d, v = p + c, last = i === S.top.length - 1, T = M.pace(g), vd = String(v).split('');
      const askAt = (c ? 0.82 : 0.42) * T, after = (vd.length > 1 ? 1.08 : 0.78) * T;
      return {
        busy: 0.1, askAt, after,
        ask: { v, wrong: c ? [p, (d + c) * S.q, v + 10, v + 1] : [S.q + d, Number(`${S.q}${d}`), p + 1, p - 1] },
        then(g) {
          S.i = i + 1; host('wow'); S.point = true; g.sfx('swoosh'); M.show(g, askAt); S.colAt = g.t; S.colI = i;
          hot(['t' + i, 'b0'], true); M.circle(g, ['t' + i, 'b0'], { dur: 0.5 * T, col: '#ffb21f', pad: 4 });
          const a = M.box(g, 'b0'), b = M.box(g, 't' + i);
          if (a && b) runAnt(S.q, HOT, a, { x: b.x + 2, y: b.y + G.r * 0.9 }, 0.22 * T, () => {});
          // the working note under the column: "4 × 3 = 12", or "6 × 3 = 18, + 4 = 22" when a carry is waiting
          const A = M.row(M.num(S.q), M.op('×'), M.num(d), M.op('='), ...(c ? [M.num(p)] : [])), B = c ? M.row(M.op(','), M.gap(4), M.op('+'), M.num(c, 'nc'), M.op('=')) : null;
          const V = M.row(...vd.map((ch, j) => M.num(ch, 'nv' + (vd.length - 1 - j), { col: ANS })));
          for (const q of [B, V]) if (q) q.hide = true;
          S.note = M.row(A, B, V); S.noteA = A; S.noteB = B; S.noteV = V; S.noteI = i; S.noteKey = 'note' + i;
          const w = M.lay(S.note, NS).w; M.place(g, S.noteKey, S.note, clamp(colX(i) - w / 2, 18, 342 - w), G.yTag + NS * 0.36, NS, { col: M.INK, left: true });
          M.writeIn(g, A, { dur: (c ? 0.32 : 0.26) * T, delay: 0.08 * T });
          if (c) M.at(g, [
            // the carried digit lights up and is added in
            [0.36 * T, g => { const cn = node('c' + i); M.indicate(g, cn, { dur: 0.32 * T, sc: 1.5, col: '#ffffff' }); host('think'); g.sfx('tap'); }],
            [0.48 * T, g => { const cn = node('c' + i), cb = M.box(g, 'c' + i); B.hide = false; B.alpha = 0; M.relayout(g, S.noteKey); const nb = M.box(g, 'nc');
              M.fly(g, { node: M.num(c, null, { col: CARRYC }), from: [cb.x, cb.y], to: [nb.x, nb.y], dur: 0.26 * T, arc: 30, s0: G.cs, s1: NS,
                then(g) { B.alpha = 1; M.writeIn(g, B, { dur: 0.16 * T }); M.indicate(g, 'nc', { dur: 0.25 * T, col: '#7ad0ff' }); } });
              cn.used = g.t; }],
          ]);
          S.noteVItems = V.items; S.note.id = 'nrow';
          if (g.mode === 'medium') M.at(g, [[Math.max(0.01, askAt - 0.04), g => { V.items = [M.num('?', null, { col: M.MID })]; V.hide = false; M.relayout(g, S.noteKey); M.writeIn(g, V, { dur: 0.12 }); }]]);
        },
        resolve(g) {
          M.show(g, after); const V0 = S.noteV; V0.items = S.noteVItems; V0.hide = false; M.relayout(g, S.noteKey);
          M.writeIn(g, V0, { dur: 0.16 * T }); M.indicate(g, V0, { delay: 0.12 * T, dur: 0.26 * T, sc: 1.3 }); g.sfx('coin'); host('laugh', false);
          const nKey = S.noteKey, nRow = S.note;
          // the ones digit drops into the answer row
          M.at(g, [[0.2 * T, g => { const b = M.box(g, 'nv0'); M.tween(g, 'nv0', { alpha: 0.25 }, 0.12 * T);
            M.fly(g, { node: M.num(v % 10, null, { col: ANS }), from: [b.x, b.y], to: 'r' + i, dur: 0.26 * T, arc: -34, s0: NS, s1: G.s, then(g) { reveal('r' + i, v % 10); g.sfx('pop'); host('happy'); } }); }]]);
          if (vd.length > 1) M.at(g, [[0.42 * T, g => { const b = M.box(g, 'nv1'); M.tween(g, 'nv1', { alpha: 0.25 }, 0.12 * T); const tens = Math.floor(v / 10);
            if (last) M.fly(g, { node: M.num(tens, null, { col: ANS }), from: [b.x, b.y], to: 'r' + (i + 1), dur: 0.3 * T, arc: -34, s0: NS, s1: G.s, then(g) { reveal('r' + (i + 1), tens); g.sfx('pop'); host('laugh'); } });
            else { const id = 'c' + (i + 1), cn = node(id), to = { x: S.pos[id][0], y: S.pos[id][1] - G.cs * 0.3 };
              host('wow'); g.sfx('tweet');
              liftCarry(tens, b, to, T, g => { cn.v = String(tens); cn.hide = false; cn.alpha = 1; cn.pop = g.t; S.put(id); burstAt(id, ['#7ad0ff', '#fff', '#ffd45a']); M.sparkle(g, id, { n: 8, cols: ['#7ad0ff', '#fff'] }); g.sfx('pop'); host('laugh'); }); } }]]);
          if (!last) S.carry = Math.floor(v / 10); else S.carry = 0;
          M.at(g, [[after - 0.26 * T, g => { M.tween(g, nRow, { alpha: 0 }, 0.22 * T); hot(['t' + i, 'b0'], false); if (last) S.point = false; }],
            [after - 0.02, g => { if (mk.ex[nKey] && mk.ex[nKey].node === nRow) delete mk.ex[nKey]; }]]);
        },
      };
    };

    M.play(g, {
      moves(g) {
        const i = S.i; if (i >= S.top.length) return [];
        const band = [colX(i) - G.cw / 2, G.yC - 30, colX(i) + G.cw / 2, G.yTag + 20];
        return [{ ...colMove(i), drag: 'b0', to: 't' + i, area: band }, { ...colMove(i), tap: 't' + i }, { ...colMove(i), drag: 't' + i, to: 'b0' }];
      },
      area(g) { return S.i < S.top.length ? ['b0', 't' + S.i] : null; },
      onMiss: S.onMiss = (g, info) => {
        S.host.sadAt = g.t;
        const k = [info.tap, info.drag, info.to].filter(Boolean).map(id => /^t(\d)$/.exec(id)).find(Boolean);
        if (!k) return;
        // the tens digit before the ones: its product would land in the ones place, and the carry from the ones is lost
        const kk = +k[1], p = S.q * S.top[kk]; S.tag = { i: kk, d: S.top[kk], c: 0, v: p, t0: g.t, vAt: g.t, bad: true, slot: 'r' + S.i, digit: p % 10 };
      },
      onWin(g) { S.final.forEach(id => { const n = node(id); if (n && !n.hide) { n.mark = 'good'; n.pop = g.t; } }); },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    // the kit records wrong moves in missAt / missInfo (it no longer calls onMiss itself): act the mistake out here
    const K = S.mk; if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; if (K.missInfo && !K.missInfo.ask) S.onMiss(g, K.missInfo); }
    for (const a of S.carriers) if (!a.arrived && g.t >= a.t0 + a.dur) { a.arrived = true; try { a.then(g); } catch (e) { console.error(e); } }
    S.carriers = S.carriers.filter(a => g.t < a.t0 + a.dur + 0.5);
    if (S.tag && S.tag.bad && g.t - S.tag.t0 > 0.9) S.tag = null;
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, G = S.G, t = g.t, colX = S.colX, node = id => M.node(g, id), box = id => M.box(g, id);
    c.drawImage(g.bake('add_multiply_picnic', picnic), 0, 0, W, H);
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    // sunlight through the leaves, drifting over the blanket
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) { const x = 60 + i * 52 + Math.sin(t * 0.5 + i * 1.7) * 18, y = 200 + ((i * 97) % 380) + Math.cos(t * 0.4 + i) * 14, r = 22 + (i % 3) * 8;
      const gr = c.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, 'rgba(255,240,190,0.16)'); gr.addColorStop(1, 'rgba(255,240,190,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
    c.restore();
    // marching ants: in from the grass to the watermelon empty-handed, back out with a crumb
    for (let n = 0; n < 12; n++) {
      const back = n % 2, u0 = ((t * 0.07 + n / 12) % 1), u = back ? 1 - u0 : u0;
      const [x, y] = trailAt(u), [x2, y2] = trailAt(clamp(u + (back ? -0.01 : 0.01), 0, 1)), ang = Math.atan2(y2 - y, x2 - x);
      const side = back ? -7 : 7, nx = -Math.sin(ang) * side, ny = Math.cos(ang) * side, hop = won ? Math.abs(Math.sin(t * 10 + n)) * 0.15 : 0;
      antTop(c, x + nx, y + ny, 0.62 * (1 + hop), ang, t + n * 0.3, { crumb: back ? (n % 4 === 1 ? '#f04a5a' : '#f6d6a0') : null });
    }
    // the host ant at the corner of the blanket
    const H0 = S.host, hk = (t - H0.hopAt) / 0.3, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0, cheer = won ? Math.abs(Math.sin((t - g.doneAt) * 8)) : 0, sad = lost || t - H0.sadAt < 0.8;
    const face = won ? 'laugh' : sad ? 'sad' : H0.faceT != null && t - H0.faceT < 0.7 ? H0.face : hop > 0 ? 'wow' : 'happy';
    ant(c, 60, 560 - hop * 14 - cheer * 12, 1.5, { t, pose: won ? 'cheer' : sad ? 'sad' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle', expr: face, facing: 1 });

    // ---- the multiplication, on cookies ----
    const pk = n => { if (!n || n.pop == null) return 1; const k = clamp((t - n.pop) / 0.35, 0, 1); return 1 + Math.sin(k * Math.PI) * 0.22; };
    const R0 = G.r, press = g.s.mk.press;
    // dropped digits fall into place
    for (const id of Object.keys(g.s.mk.ex)) { const n = node(id); if (n && n.dropAt != null) n.dy = -22 * (1 - M.ease((t - n.dropAt) / 0.16)); }
    // a soft glow along the column being worked
    if (S.colAt != null && t - S.colAt < 0.9) { const x = colX(S.colI), a = Math.min(1, (t - S.colAt) / 0.15, (0.9 - (t - S.colAt)) / 0.3); c.save(); c.globalAlpha = a * 0.5; const gr = c.createLinearGradient(x - G.cw / 2, 0, x + G.cw / 2, 0); gr.addColorStop(0, 'rgba(255,230,150,0)'); gr.addColorStop(0.5, 'rgba(255,230,150,1)'); gr.addColorStop(1, 'rgba(255,230,150,0)'); c.fillStyle = gr; c.fillRect(x - G.cw / 2, G.yT - 40, G.cw, G.yR - G.yT + 70); c.restore(); }
    S.top.forEach((_, i) => { const n = node('t' + i); cookie(c, box('t' + i), n.mark === 'bad' ? 'bad' : 'chip', t, { r: R0, sc: pk(n) * (n.sc ?? 1), seed: i, dy: n.dy || 0 }); });
    { const n = node('b0'), b = box('b0'); if (press && press.dragging && press.id === 'b0') { c.save(); c.setLineDash([4, 4]); c.strokeStyle = 'rgba(120,70,40,0.6)'; c.lineWidth = 2; c.beginPath(); c.arc(b.x, b.y, R0, 0, 7); c.stroke(); c.restore(); } else cookie(c, b, n.mark === 'bad' ? 'bad' : 'chip', t, { r: R0, sc: pk(n), seed: 5 }); }
    for (let col = 0; col < G.ncols - 1; col++) { const id = 'r' + col, n = node(id), b = box(id); if (!b) continue;
      if (n.hide) { if (col <= S.top.length) { c.save(); c.setLineDash([3, 5]); c.strokeStyle = 'rgba(150,100,70,0.35)'; c.lineWidth = 2; c.beginPath(); c.arc(b.x, b.y, R0 * 0.8, 0, 7); c.stroke(); c.restore(); } }
      else cookie(c, b, n.mark === 'good' ? 'pink' : 'sugar', t, { r: R0 * 0.92, sc: pk(n), dy: n.dy || 0 }); }
    // carries: blueberries (dimmed once they have been added)
    for (let col = 1; col < S.top.length; col++) { const n = node('c' + col), b = box('c' + col); if (!n || !b) continue;
      if (n.hide) continue;
      // once it has been added in, the carried digit is used up: it fades away
      n.alpha = n.used != null ? Math.max(0, 1 - (t - n.used) / (0.4 * M.pace(g))) : 1; if (n.alpha <= 0) continue;
      c.save(); c.globalAlpha = n.alpha; if (n.hl > 0.01) { c.shadowColor = '#bfe8ff'; c.shadowBlur = 18 * n.hl; } cookie(c, b, 'blue', t, { r: G.cs * 0.62, sc: pk(n) * (n.sc ?? 1) }); c.restore(); }
    { const b = box('times'); c.save(); c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr = R0 * 0.7 * (1 + (i % 2) * 0.12); c.lineTo(b.x + Math.cos(a) * rr, b.y + Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
    pretzel(c, colX(G.ncols - 1) - G.cw * 0.5, colX(0) + G.cw * 0.55, G.yL);
    for (const id of Object.keys(g.s.mk.ex)) M.drawEx(g, c, id);

    // ---- the tag under the column being worked: "4 × 3 = 12", "4 × 2 + 1 = 9" ----
    const T = S.tag;
    if (T) {
      const age = t - T.t0, a = T.bad ? clamp((0.9 - age) / 0.2, 0, 1) : age < 1.3 ? 1 : clamp((1.6 - age) / 0.3, 0, 1);
      if (a > 0) {
        const segs = [[`${S.q} × ${T.d}`, T.bad ? M.BAD : HOT], ...(T.c ? [[` + ${T.c}`, CARRYC]] : []), [' = ', M.MID], [T.v == null ? '?' : String(T.v), T.bad ? M.BAD : M.INK]];
        c.save(); c.font = M.NUMF(21, 700); const ws = segs.map(s => c.measureText(s[0]).width), tw = ws.reduce((p, q) => p + q, 0), w = tw + 22, h = 34;
        const x = clamp(colX(T.i), 16 + w / 2, 344 - w / 2), y = T.bad ? G.yR + 50 : G.yTag, sh = T.bad && age < 0.4 ? Math.sin(age * 60) * 4 : 0;
        const k = M.ease(age / 0.12); c.globalAlpha = a; c.translate(x + sh, y); c.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k);
        c.fillStyle = 'rgba(60,20,30,0.2)'; c.beginPath(); c.roundRect(-w / 2 + 2, -h / 2 + 3, w, h, 12); c.fill();
        c.fillStyle = T.bad ? '#ffe4e0' : '#fffaf0'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 12); c.fill(); c.strokeStyle = T.bad ? M.BAD : '#c89a6a'; c.lineWidth = 2; c.stroke();
        // a little pointer up to the column
        c.fillStyle = T.bad ? '#ffe4e0' : '#fffaf0'; c.beginPath(); c.moveTo(colX(T.i) - x - 7, -h / 2 + 1); c.lineTo(colX(T.i) - x, -h / 2 - 8); c.lineTo(colX(T.i) - x + 7, -h / 2 + 1); c.closePath(); c.fill();
        let xx = -tw / 2; c.textBaseline = 'middle';
        segs.forEach((s, j) => { c.fillStyle = s[1]; const last = j === segs.length - 1, pop = last && T.vAt != null ? 1 + Math.sin(clamp((t - T.vAt) / 0.3, 0, 1) * Math.PI) * 0.4 : 1;
          c.save(); c.translate(xx + ws[j] / 2, 1); c.scale(pop, pop); c.textAlign = 'center'; c.fillText(s[0], 0, 0); c.restore(); xx += ws[j]; });
        c.restore();
        // the mistake acted out: the wrong ones digit shakes in red in the answer slot
        if (T.bad) { const b = box(T.slot); if (b) { const sh2 = age < 0.45 ? Math.sin(age * 60) * 4 * (1 - age / 0.45) : 0; c.save(); c.globalAlpha = a; cookie(c, { x: b.x + sh2, y: b.y, w: 10, h: 10 }, 'bad', t, { r: R0 * 0.92 }); c.font = M.NUMF(G.s, 600); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = M.BAD; c.fillText(String(T.digit), b.x + sh2, b.y + G.s * 0.36); c.restore(); } }
      }
    }
    // ants on the run: the multiplier up to its digit, the carried digit up to the next column
    for (const a of S.carriers) {
      const k = clamp((t - a.t0) / a.dur, 0, 1), e = M.easeIO(k), ang = Math.atan2(a.y1 - a.y0, a.x1 - a.x0);
      let x = lerp(a.x0, a.x1, e), y = lerp(a.y0, a.y1, e), al = 1, aa = ang;
      if (a.arrived) { const k2 = clamp((t - a.t0 - a.dur) / 0.45, 0, 1); aa = ang + Math.PI * 0.6; x = a.x1 + Math.cos(aa) * 50 * k2; y = a.y1 + Math.sin(aa) * 50 * k2; al = 1 - k2; }
      c.save(); c.globalAlpha = al; const bx = x - Math.cos(aa) * 20, by = y - Math.sin(aa) * 20;
      if (!a.arrived) for (let i = 1; i <= 3; i++) { c.strokeStyle = `rgba(255,255,255,${0.8 - i * 0.2})`; c.lineWidth = 2.5; c.beginPath(); const px = -Math.sin(ang) * (i - 2) * 6, py = Math.cos(ang) * (i - 2) * 6; c.moveTo(bx - Math.cos(ang) * 16 + px, by - Math.sin(ang) * 16 + py); c.lineTo(bx - Math.cos(ang) * 34 + px, by - Math.sin(ang) * 34 + py); c.stroke(); }
      antTop(c, bx, by, 1.15, aa, t, { speed: 1.8 });
      if (!a.arrived) { cookie(c, { x, y, w: 10, h: 10 }, a.col === CARRYC ? 'blue' : 'sugar', t, { r: 13 }); c.font = M.NUMF(20, 700); c.textAlign = 'center'; c.fillStyle = a.col === CARRYC ? '#fff' : a.col; c.fillText(String(a.v), x, y + 7); }
      c.restore();
    }
    M.drawUI(g, c);
  },
});
