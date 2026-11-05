// _b8.js — shared painting helpers for builder b8's money, startups and markets microgames: coins, glass jars,
// pies, buckets and water. Everything here only draws; no state, no randomness (callers pass seeds).
const B8 = (() => {
  const TAU = Math.PI * 2;
  // a gold coin seen face-on (spin 0) or turning (spin = angle, its width follows cos)
  function coin(c, x, y, r, spin = 0, o = {}) {
    const sx = Math.max(0.12, Math.abs(Math.cos(spin)));
    c.save(); c.translate(x, y); c.scale(sx, 1);
    const g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, o.light || '#fff3a8'); g.addColorStop(0.55, o.col || '#f5c23a'); g.addColorStop(1, o.dark || '#c07a14');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.strokeStyle = o.edge || '#8a4a10'; c.lineWidth = Math.max(1.5, r * 0.11); c.stroke();
    c.strokeStyle = 'rgba(138,74,16,0.55)'; c.lineWidth = Math.max(1, r * 0.08); c.beginPath(); c.arc(0, 0, r * 0.7, 0, TAU); c.stroke();
    if (sx > 0.4) { // an embossed star
      c.fillStyle = 'rgba(160,90,20,0.55)'; c.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.2 : r * 0.45; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      c.closePath(); c.fill();
    }
    c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(-r * 0.38, -r * 0.42, r * 0.26, r * 0.13, -0.6, 0, TAU); c.fill();
    c.restore();
  }
  // a coin lying flat (seen from the side, as in a pile)
  function flatCoin(c, x, y, r, tilt = 0) {
    c.save(); c.translate(x, y); c.rotate(tilt);
    c.fillStyle = '#b06a10'; c.beginPath(); c.ellipse(0, 3, r, r * 0.38, 0, 0, TAU); c.fill();
    c.fillStyle = '#c98418'; c.fillRect(-r, 0, r * 2, 3);
    const g = c.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, '#f8d860'); g.addColorStop(0.5, '#fff0a0'); g.addColorStop(1, '#e8a830');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, r, r * 0.38, 0, 0, TAU); c.fill(); c.strokeStyle = '#8a4a10'; c.lineWidth = 1.4; c.stroke();
    c.restore();
  }
  // a glass jar: back (call before the contents) and front (after). x = centre, y0 = rim, y1 = bottom, w = width.
  function jarBack(c, x, y0, y1, w) {
    c.save(); c.fillStyle = 'rgba(200,235,250,0.28)'; c.beginPath(); c.roundRect(x - w / 2, y0 + 8, w, y1 - y0 - 8, [10, 10, 22, 22]); c.fill(); c.restore();
  }
  function jarFront(c, x, y0, y1, w) {
    c.save();
    c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 3.5; c.beginPath(); c.roundRect(x - w / 2, y0 + 8, w, y1 - y0 - 8, [10, 10, 22, 22]); c.stroke();
    c.strokeStyle = 'rgba(70,110,140,0.55)'; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.roundRect(x - w / 2 + 8, y0 + 18, 9, y1 - y0 - 40, 5); c.fill();
    // the rim
    c.fillStyle = '#dff2fa'; c.strokeStyle = 'rgba(70,110,140,0.7)'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - w / 2 - 5, y0, w + 10, 12, 6); c.fill(); c.stroke();
    c.restore();
  }
  // a pie of slices: slices = [{ f: fraction, col, lab? }], drawn clockwise from the top. r = radius. o.pop = index of a
  // slice to lift out a little, o.crust: crust colour.
  function pie(c, x, y, r, slices, o = {}) {
    c.save();
    c.fillStyle = 'rgba(40,20,40,0.22)'; c.beginPath(); c.ellipse(x + 4, y + r * 0.95, r * 1.02, r * 0.24, 0, 0, TAU); c.fill();
    // the pie dish
    c.fillStyle = o.dish || '#e8e2f0'; c.beginPath(); c.arc(x, y + 4, r + 6, 0, TAU); c.fill(); c.strokeStyle = 'rgba(80,60,100,0.4)'; c.lineWidth = 2; c.stroke();
    let a = -Math.PI / 2;
    slices.forEach((s, i) => {
      const da = s.f * TAU; if (da <= 0.0005) return; const mid = a + da / 2, off = (o.pop === i ? r * 0.08 : 0) + (s.off || 0);
      const cx = x + Math.cos(mid) * off, cy = y + Math.sin(mid) * off;
      c.fillStyle = o.crust || '#d8954a'; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, a, a + da); c.closePath(); c.fill();
      const g = c.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r * 0.92);
      g.addColorStop(0, P.shade(s.col, 0.35)); g.addColorStop(1, s.col);
      c.fillStyle = g; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r * 0.86, a, a + da); c.closePath(); c.fill();
      c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, a, a + da); c.closePath(); c.stroke();
      if (s.draw) s.draw(c, cx + Math.cos(mid) * r * 0.55, cy + Math.sin(mid) * r * 0.55, mid, da);
      a += da;
    });
    c.restore();
  }
  // a wooden bucket: x = centre, y0 = rim, y1 = bottom, w = top width
  function bucketBack(c, x, y0, y1, w, col = '#a8683a') {
    const b = w * 0.78; c.save();
    const g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, P.shade(col, -0.55)); g.addColorStop(0.5, P.shade(col, -0.3)); g.addColorStop(1, P.shade(col, -0.6));
    c.fillStyle = g; c.beginPath(); c.moveTo(x - w / 2, y0); c.lineTo(x + w / 2, y0); c.lineTo(x + b / 2, y1); c.lineTo(x - b / 2, y1); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(30,14,10,0.35)'; c.lineWidth = 2; for (let i = 1; i < 8; i++) { const k = i / 8; c.beginPath(); c.moveTo(x - w / 2 + w * k, y0); c.lineTo(x - b / 2 + b * k, y1); c.stroke(); }
    c.restore();
  }
  function bucketFront(c, x, y0, y1, w, col = '#a8683a', o = {}) {
    const b = w * 0.78; c.save();
    const path = () => { c.beginPath(); c.moveTo(x - w / 2, y0); c.lineTo(x + w / 2, y0); c.lineTo(x + b / 2, y1); c.lineTo(x - b / 2, y1); c.closePath(); };
    if (!o.open) {
      const g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, P.shade(col, -0.2)); g.addColorStop(0.35, P.shade(col, 0.2)); g.addColorStop(1, P.shade(col, -0.35));
      c.fillStyle = g; path(); c.fill();
      c.strokeStyle = 'rgba(60,30,20,0.35)'; c.lineWidth = 1.5; for (let i = 1; i < 6; i++) { const k = i / 6, xt = x - w / 2 + w * k, xb = x - b / 2 + b * k; c.beginPath(); c.moveTo(xt, y0 + 4); c.lineTo(xb, y1 - 2); c.stroke(); }
    }
    c.strokeStyle = '#5a5a6a'; c.lineWidth = 5; for (const k of [0.18, 0.82]) { const yy = y0 + (y1 - y0) * k, ww = w + (b - w) * k; c.beginPath(); c.moveTo(x - ww / 2, yy); c.lineTo(x + ww / 2, yy); c.stroke(); }
    c.strokeStyle = P.shade(col, -0.6); c.lineWidth = 2.5; path(); c.stroke();
    c.restore();
  }
  // water inside a region (a clip path is set by the caller): a wavy surface at y = top
  function waterFill(c, x0, x1, top, bottom, t, col = '#4ab0e0') {
    c.save(); const g = c.createLinearGradient(0, top, 0, bottom); g.addColorStop(0, P.shade(col, 0.3)); g.addColorStop(1, P.shade(col, -0.25)); c.fillStyle = g;
    c.beginPath(); c.moveTo(x0, bottom); c.lineTo(x0, top);
    for (let x = x0; x <= x1 + 6; x += 6) c.lineTo(x, top + Math.sin(x * 0.08 + t * 4) * 2.2);
    c.lineTo(x1, bottom); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.beginPath(); for (let x = x0; x <= x1; x += 6) c.lineTo(x, top + Math.sin(x * 0.08 + t * 4) * 2.2); c.stroke();
    c.restore();
  }
  // a bag of cash with a coin sign
  function cashBag(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(40,20,40,0.2)'; c.beginPath(); c.ellipse(0, 24, 26, 6, 0, 0, TAU); c.fill();
    const g = c.createRadialGradient(-8, -4, 4, 0, 6, 30); g.addColorStop(0, '#f0dca0'); g.addColorStop(1, '#b8904a');
    c.fillStyle = g; c.strokeStyle = '#6a4a20'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(-8, -18); c.quadraticCurveTo(-30, 0, -24, 16); c.quadraticCurveTo(-18, 26, 0, 26); c.quadraticCurveTo(18, 26, 24, 16); c.quadraticCurveTo(30, 0, 8, -18); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#b8904a'; c.beginPath(); c.moveTo(-9, -18); c.lineTo(-14, -28); c.lineTo(0, -22); c.lineTo(14, -28); c.lineTo(9, -18); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#c84a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-10, -17); c.lineTo(10, -17); c.stroke();
    coin(c, 0, 6, 10);
    c.restore();
  }
  return { coin, flatCoin, jarBack, jarFront, pie, bucketBack, bucketFront, waterFill, cashBag };
})();
