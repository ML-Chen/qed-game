// _n1.js — small shared helpers for builder n1's microgames (motion_*, waves_*, energy_*, forces_* from round 2).
// One global: N1. Nothing here keeps state; everything a game needs to replay lives in its own g.s.
const N1 = (() => {
  const TAU = Math.PI * 2;
  // a vertical gradient fill of a rectangle
  function vgrad(o, x, y, w, h, stops) { const gr = o.createLinearGradient(0, y, 0, y + h); stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s)); o.fillStyle = gr; o.fillRect(x, y, w, h); }
  // a big chunky button: { x, y, w, h } centre and size; label; col; pressed (0..1); lit (pulses)
  function button(c, b, label, col, o = {}) {
    const pr = o.pressed ? 4 : 0, t = o.t || 0, p = 0.5 + 0.5 * Math.sin(t * 6);
    c.save(); c.translate(b.x, b.y);
    if (o.lit) { c.fillStyle = `rgba(255,240,160,${0.22 + 0.22 * p})`; c.beginPath(); c.roundRect(-b.w / 2 - 8, -b.h / 2 - 8, b.w + 16, b.h + 16, b.h / 2 + 8); c.fill(); }
    c.fillStyle = P.shade(col, -0.45); c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2 + 5, b.w, b.h, b.h / 2); c.fill();
    const gr = c.createLinearGradient(0, -b.h / 2, 0, b.h / 2); gr.addColorStop(0, P.shade(col, 0.25)); gr.addColorStop(1, P.shade(col, -0.15));
    c.fillStyle = gr; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2 + pr, b.w, b.h, b.h / 2); c.fill(); c.stroke();
    c.font = `900 ${o.size || 20}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = 4; c.strokeStyle = 'rgba(30,14,36,0.55)'; c.strokeText(label, 0, pr + 1); c.fillStyle = '#fff6ea'; c.fillText(label, 0, pr + 1);
    c.restore();
  }
  const inBox = (b, x, y, pad = 8) => Math.abs(x - b.x) <= b.w / 2 + pad && Math.abs(y - b.y) <= b.h / 2 + pad;
  // a solid force arrow from (ax, ay) to (bx, by)
  function farrow(c, ax, ay, bx, by, col, w = 6, o = {}) {
    const L = Math.hypot(bx - ax, by - ay); if (L < 2) return; const ux = (bx - ax) / L, uy = (by - ay) / L, hl = Math.min(L * 0.6, w * 2.6);
    c.save(); c.lineCap = 'round'; c.strokeStyle = o.edge || 'rgba(30,14,36,0.6)'; c.lineWidth = w + 4;
    c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx - ux * hl * 0.8, by - uy * hl * 0.8); c.stroke();
    c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx - ux * hl * 0.8, by - uy * hl * 0.8); c.stroke();
    c.translate(bx, by); c.rotate(Math.atan2(uy, ux)); c.fillStyle = col; c.strokeStyle = o.edge || 'rgba(30,14,36,0.6)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(2, 0); c.lineTo(-hl, -w * 1.5); c.lineTo(-hl, w * 1.5); c.closePath(); c.fill(); c.stroke(); c.restore();
  }
  // a curved "turn this way" arrow around (x, y) at radius r from angle a0 to a1
  function turnArrow(c, x, y, r, a0, a1, col = '#fff6ea', w = 5) {
    c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, r, Math.min(a0, a1), Math.max(a0, a1)); c.stroke();
    const d = a1 > a0 ? 1 : -1, hx = x + Math.cos(a1) * r, hy = y + Math.sin(a1) * r, th = a1 + d * Math.PI / 2;
    c.translate(hx, hy); c.rotate(th); c.fillStyle = col; c.beginPath(); c.moveTo(w * 1.6, 0); c.lineTo(-w, -w * 1.6); c.lineTo(-w, w * 1.6); c.closePath(); c.fill(); c.restore();
  }
  // progress pips: n slots, k filled, centred at (x, y)
  function pips(c, x, y, n, k, o = {}) {
    const gap = o.gap || 22, r = o.r || 8;
    c.save(); c.fillStyle = 'rgba(30,14,36,0.6)'; c.beginPath(); c.roundRect(x - n * gap / 2 - 6, y - r - 6, n * gap + 12, r * 2 + 12, r + 6); c.fill();
    for (let i = 0; i < n; i++) { const px = x + (i - (n - 1) / 2) * gap; c.fillStyle = i < k ? (o.col || '#ffd45a') : 'rgba(255,246,234,0.25)'; c.strokeStyle = '#fff6ea'; c.lineWidth = 1.5; c.beginPath(); c.arc(px, y, r, 0, TAU); c.fill(); if (i < k) c.stroke(); }
    c.restore();
  }
  // bold outlined text (for a big word that must read on any background)
  function word(c, text, x, y, size = 22, col = '#fff6ea', o = {}) {
    c.save(); c.font = `900 ${size}px Nunito, system-ui, sans-serif`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round'; c.lineWidth = o.lw || 5; c.strokeStyle = o.edge || 'rgba(30,14,36,0.75)'; c.strokeText(text, x, y); c.fillStyle = col; c.fillText(text, x, y); c.restore();
  }
  // a silhouette sprite of an animal (for shadows): returns a canvas of the animal filled with one colour
  const sil = {};
  function silhouette(kind, col = '#000') {
    const k = kind + col; if (sil[k]) return sil[k];
    const cv = document.createElement('canvas'); cv.width = 200; cv.height = 200; const o = cv.getContext('2d');
    o.save(); o.translate(100, 160); try { ANI.draw(o, kind, 0, 0, 1.8, { t: 0, noShadow: true, expr: 'happy' }); } catch (e) { o.fillStyle = col; o.beginPath(); o.arc(0, -60, 50, 0, TAU); o.fill(); } o.restore();
    o.globalCompositeOperation = 'source-in'; o.fillStyle = col; o.fillRect(0, 0, 200, 200);
    return (sil[k] = cv);
  }
  return { TAU, vgrad, button, inBox, farrow, turnArrow, pips, word, silhouette };
})();
