// _n6.js — small shared drawing helpers for builder n6's ai_* and money_* microgames (one global, N6).
// Pure drawing: no state, no randomness (callers pass g.t for motion), so every game stays deterministic for rewind.
const N6 = (() => {
  const TAU = Math.PI * 2;
  // a vertical gradient fill of a rectangle
  function vgrad(o, x, y, w, h, cols) { const gr = o.createLinearGradient(0, y, 0, y + h); cols.forEach((c, i) => gr.addColorStop(i / (cols.length - 1), c)); o.fillStyle = gr; o.fillRect(x, y, w, h); }
  // bold outlined text (for words that are part of the scene, not labels)
  function text(c, s, x, y, size = 20, col = '#fff6ea', o = {}) {
    c.save(); c.font = `${o.weight || 900} ${size}px Nunito, system-ui, sans-serif`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
    if (o.stroke !== false) { c.lineJoin = 'round'; c.lineWidth = o.lw || Math.max(3, size * 0.22); c.strokeStyle = o.stroke || 'rgba(30,14,36,0.75)'; c.strokeText(s, x, y); }
    c.fillStyle = col; c.fillText(s, x, y); c.restore();
  }
  function width(c, s, size, weight = 900) { c.save(); c.font = `${weight} ${size}px Nunito, system-ui, sans-serif`; const w = c.measureText(s).width; c.restore(); return w; }
  // a big chunky button; pressed pushes it down; label in the middle
  function button(c, x, y, w, h, label, col, pressed = false, o = {}) {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(20,10,30,0.45)'; c.beginPath(); c.roundRect(-w / 2, -h / 2 + 7, w, h, h * 0.32); c.fill();
    const dy = pressed ? 5 : 0, gr = c.createLinearGradient(0, -h / 2 + dy, 0, h / 2 + dy); gr.addColorStop(0, P.shade(col, 0.28)); gr.addColorStop(1, P.shade(col, -0.25));
    c.fillStyle = gr; c.strokeStyle = o.edge || '#2a1430'; c.lineWidth = 3; c.beginPath(); c.roundRect(-w / 2, -h / 2 + dy, w, h, h * 0.32); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.beginPath(); c.roundRect(-w / 2 + 8, -h / 2 + dy + 5, w - 16, h * 0.28, h * 0.14); c.fill();
    c.restore();
    if (label) text(c, label, x + (o.dx || 0), y + dy + 1, o.size || 22, o.col || '#fff6ea', { stroke: 'rgba(30,14,36,0.6)' });
  }
  // a gold coin seen face-on (r = radius), optional mark
  function coin(c, x, y, r = 12, mark = '$') {
    c.save(); c.fillStyle = '#a8701a'; c.beginPath(); c.arc(x, y + r * 0.18, r, 0, TAU); c.fill();
    const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); gr.addColorStop(0, '#fff2a0'); gr.addColorStop(0.6, '#f5c23a'); gr.addColorStop(1, '#c88a1a');
    c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.strokeStyle = '#8a5a10'; c.lineWidth = Math.max(1, r * 0.14); c.stroke();
    c.strokeStyle = 'rgba(138,90,16,0.6)'; c.lineWidth = Math.max(1, r * 0.1); c.beginPath(); c.arc(x, y, r * 0.72, 0, TAU); c.stroke();
    if (mark && r >= 8) { c.fillStyle = '#8a5a10'; c.font = `900 ${Math.round(r * 1.1)}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(mark, x, y + r * 0.06); }
    c.restore();
  }
  // a flat coin seen from the side (for stacks)
  function flat(c, x, y, r = 14) {
    c.save(); c.fillStyle = '#b07a1a'; c.beginPath(); c.ellipse(x, y + 3, r, r * 0.35, 0, 0, TAU); c.fill(); c.fillRect(x - r, y, r * 2, 3);
    c.fillStyle = '#f5c23a'; c.beginPath(); c.ellipse(x, y, r, r * 0.35, 0, 0, TAU); c.fill(); c.strokeStyle = '#8a5a10'; c.lineWidth = 1.2; c.stroke(); c.restore();
  }
  // a dollar bill (w x h), slightly tilted by rot
  function bill(c, x, y, w = 46, h = 24, rot = 0, col = '#7ac87a') {
    c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 3); c.fill(); c.stroke();
    c.strokeStyle = P.shade(col, -0.25); c.lineWidth = 1.2; c.beginPath(); c.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 2); c.stroke();
    c.fillStyle = P.shade(col, -0.35); c.beginPath(); c.ellipse(0, 0, h * 0.3, h * 0.34, 0, 0, TAU); c.fill(); c.fillStyle = P.shade(col, 0.4); c.font = `900 ${Math.round(h * 0.5)}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', 0, 1); c.restore();
  }
  // a glass jar: back half (draw contents after), then front (rim and shine)
  function jarBack(c, x, y0, y1, w) { c.save(); c.fillStyle = 'rgba(210,235,255,0.22)'; c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - w / 2, y0 + 10, w, y1 - y0 - 10, [10, 10, 22, 22]); c.fill(); c.stroke(); c.restore(); }
  function jarFront(c, x, y0, y1, w, lid = '#c86a3a') {
    c.save(); c.fillStyle = 'rgba(255,255,255,0.28)'; c.beginPath(); c.roundRect(x - w / 2 + 7, y0 + 22, 9, y1 - y0 - 44, 5); c.fill();
    c.strokeStyle = 'rgba(60,40,80,0.55)'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(x - w / 2, y0 + 10, w, y1 - y0 - 10, [10, 10, 22, 22]); c.stroke();
    c.fillStyle = lid; c.strokeStyle = P.shade(lid, -0.5); c.lineWidth = 2; c.beginPath(); c.roundRect(x - w / 2 - 5, y0, w + 10, 14, 5); c.fill(); c.stroke(); c.restore();
  }
  // a little arrow (filled triangle) at (x, y) pointing at angle a
  function tri(c, x, y, a, s = 10, col = '#fff6ea') { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = col; c.beginPath(); c.moveTo(s, 0); c.lineTo(-s * 0.7, -s * 0.8); c.lineTo(-s * 0.7, s * 0.8); c.closePath(); c.fill(); c.strokeStyle = 'rgba(30,14,36,0.7)'; c.lineWidth = 1.5; c.stroke(); c.restore(); }
  // a soft round glow (additive)
  function halo(c, x, y, r, col = 'rgba(255,230,150,0.5)') { c.save(); const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.restore(); }
  return { TAU, vgrad, text, width, button, coin, flat, bill, jarBack, jarFront, tri, halo };
})();
