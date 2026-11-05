// _n4.js — small shared painting helpers for builder n4's Heurēka! microgames (medicine, build, circuits).
// One global, N4. Pure drawing helpers: no state, no randomness, safe for rewind.
const N4 = (() => {
  const TAU = Math.PI * 2;
  // a vertical gradient fill of a rectangle through a list of colours
  function vgrad(o, x, y, w, h, cols) { const g = o.createLinearGradient(0, y, 0, y + h); cols.forEach((c, i) => g.addColorStop(i / Math.max(1, cols.length - 1), c)); o.fillStyle = g; o.fillRect(x, y, w, h); }
  // bold outlined text (for button labels)
  function text(c, s, x, y, size = 20, col = '#fff6ea', stroke = 'rgba(30,14,36,0.75)', align = 'center') {
    c.save(); c.font = `900 ${size}px Nunito, system-ui, sans-serif`; c.textAlign = align; c.textBaseline = 'middle'; c.lineJoin = 'round';
    if (stroke) { c.lineWidth = Math.max(3, size * 0.22); c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = col; c.fillText(s, x, y); c.restore();
  }
  // a big chunky push button with a label; pressed sinks it; on lights it
  function button(c, b, label, o = {}) {
    const { pressed = false, on = true, col = '#e8803a', size = 20 } = o, d = pressed ? 4 : 0;
    c.save(); c.fillStyle = 'rgba(30,14,36,0.35)'; c.beginPath(); c.roundRect(b.x - b.w / 2, b.y - b.h / 2 + 6, b.w, b.h, b.h / 2.6); c.fill();
    c.fillStyle = P.shade(col, -0.45); c.beginPath(); c.roundRect(b.x - b.w / 2, b.y - b.h / 2 + 4, b.w, b.h, b.h / 2.6); c.fill();
    const g = c.createLinearGradient(0, b.y - b.h / 2, 0, b.y + b.h / 2); g.addColorStop(0, P.shade(col, on ? 0.3 : -0.1)); g.addColorStop(1, P.shade(col, on ? -0.15 : -0.4));
    c.fillStyle = g; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.roundRect(b.x - b.w / 2, b.y - b.h / 2 + d, b.w, b.h, b.h / 2.6); c.fill(); c.stroke();
    c.restore(); if (label) text(c, label, b.x, b.y + d - 1, size);
  }
  const inBox = (b, x, y, pad = 8) => Math.abs(x - b.x) <= b.w / 2 + pad && Math.abs(y - b.y) <= b.h / 2 + pad;
  // a fat up/down arrow (feedback: which way to go)
  function bigArrow(c, x, y, dir, col = '#ffd45a', s = 1, t = 0) {
    const bob = Math.sin(t * 6) * 4 * dir; c.save(); c.translate(x, y + bob); c.scale(s, s * dir);
    c.fillStyle = col; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(0, -18); c.lineTo(14, 0); c.lineTo(6, 0); c.lineTo(6, 16); c.lineTo(-6, 16); c.lineTo(-6, 0); c.lineTo(-14, 0); c.closePath(); c.fill(); c.stroke(); c.restore();
  }
  // spinning dizzy stars around (x, y)
  function dizzy(c, x, y, r, t, n = 4) {
    for (let i = 0; i < n; i++) { const a = t * 5 + i * TAU / n, sx = x + Math.cos(a) * r, sy = y + Math.sin(a) * r * 0.35; c.save(); c.translate(sx, sy); c.rotate(t * 4 + i);
      c.fillStyle = '#ffd45a'; c.strokeStyle = '#8a5a10'; c.lineWidth = 1.5; c.beginPath(); for (let k = 0; k < 10; k++) { const rr = k % 2 ? 4 : 9, aa = k * Math.PI / 5; c.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } c.closePath(); c.fill(); c.stroke(); c.restore(); }
  }
  // a wobbling ring of red ache marks around (x, y)
  function ache(c, x, y, r, t, a = 1) {
    if (a <= 0) return; const p = 0.5 + 0.5 * Math.sin(t * 8); c.save(); c.globalAlpha = a; c.strokeStyle = '#e83a3a'; c.lineWidth = 3.5; c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < 5; i++) { const ang = -Math.PI * 0.95 + i * Math.PI * 0.22, r0 = r + 2 * p, r1 = r + 14 + 6 * p; const ax = x + Math.cos(ang) * r0, ay = y + Math.sin(ang) * r0, bx = x + Math.cos(ang) * r1, by = y + Math.sin(ang) * r1, mx = (ax + bx) / 2 + Math.sin(ang) * 4, my = (ay + by) / 2 - Math.cos(ang) * 4;
      c.beginPath(); c.moveTo(ax, ay); c.lineTo(mx, my); c.lineTo(bx, by); c.stroke(); }
    c.restore();
  }
  return { vgrad, text, button, inBox, bigArrow, dizzy, ache };
})();
