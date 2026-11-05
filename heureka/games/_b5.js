// _b5.js — small shared helpers for builder b5's microgames (earth_*, space_*, build_*). One global: B5.
const B5 = (() => {
  const TAU = Math.PI * 2;
  // true when the player turned the timer off: games that would otherwise start an event on their own clock wait instead
  function patient() { try { return typeof timerOn === 'function' && !timerOn(); } catch (e) { return false; } }
  // a vertical gradient fill of a rectangle
  function vgrad(o, x, y, w, h, stops) { const gr = o.createLinearGradient(0, y, 0, y + h); stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s)); o.fillStyle = gr; o.fillRect(x, y, w, h); }
  // a cosy cottage with a pitched roof, feet of the walls at y, centred on x; o.door: colour override of the door, o.mud 0..1 mud splat
  function cottage(c, x, y, s = 1, o = {}) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(30,14,36,0.22)'; c.beginPath(); c.ellipse(4, 2, 52, 8, 0, 0, TAU); c.fill();
    const wg = c.createLinearGradient(-40, 0, 40, 0); wg.addColorStop(0, '#fbe6c4'); wg.addColorStop(0.75, '#efcf9e'); wg.addColorStop(1, '#d6ad78');
    c.fillStyle = wg; c.strokeStyle = '#5a2e3a'; c.lineWidth = 2.5; c.lineJoin = 'round';
    c.beginPath(); c.rect(-40, -58, 80, 58); c.fill(); c.stroke();
    // chimney and roof
    c.fillStyle = '#a65a48'; c.fillRect(18, -96, 12, 26); c.strokeRect(18, -96, 12, 26);
    const rg = c.createLinearGradient(0, -100, 0, -56); rg.addColorStop(0, '#d8604e'); rg.addColorStop(1, '#a03c3a');
    c.fillStyle = rg; c.beginPath(); c.moveTo(-50, -54); c.lineTo(0, -98); c.lineTo(50, -54); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(90,30,40,0.35)'; c.lineWidth = 1.5; for (let i = 1; i < 4; i++) { const k = i / 4; c.beginPath(); c.moveTo(-50 + 50 * k * 0.98, -54 - 44 * k); c.lineTo(50 - 50 * k * 0.98, -54 - 44 * k); c.stroke(); }
    // window with a warm lamp
    c.fillStyle = '#ffd77a'; c.strokeStyle = '#5a2e3a'; c.lineWidth = 2.5; c.beginPath(); c.rect(12, -44, 20, 18); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(22, -44); c.lineTo(22, -26); c.moveTo(12, -35); c.lineTo(32, -35); c.stroke();
    // door
    c.fillStyle = o.door || '#4e8ac0'; c.beginPath(); c.moveTo(-26, 0); c.lineTo(-26, -32); c.quadraticCurveTo(-16, -42, -6, -32); c.lineTo(-6, 0); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(-10, -15, 2, 0, TAU); c.fill();
    if (o.mud > 0) { // a mud splat on the door and wall
      const m = o.mud; c.fillStyle = '#6a4424'; c.beginPath(); c.ellipse(-16, -12, 22 * m, 15 * m, 0, 0, TAU); c.fill();
      for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.3, d = 24 * m; c.beginPath(); c.arc(-16 + Math.cos(a) * d, -12 + Math.sin(a) * d * 0.7, 4 * m, 0, TAU); c.fill(); }
      c.fillStyle = '#8a5a30'; c.beginPath(); c.ellipse(-20, -16, 9 * m, 5 * m, -0.3, 0, TAU); c.fill();
    }
    c.restore();
  }
  // a round leafy bush (k 0..1 grows it), its base at (x, y)
  function bush(c, x, y, s = 1, k = 1, col = '#4f9a48') {
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(s * k, s * k);
    const blobs = [[-10, -10, 11], [10, -10, 11], [0, -18, 13], [-4, -6, 10], [6, -5, 10]];
    c.fillStyle = P.shade(col, -0.35); for (const [bx, by, r] of blobs) { c.beginPath(); c.arc(bx + 2, by + 2, r, 0, TAU); c.fill(); }
    for (const [bx, by, r] of blobs) { const gr = c.createRadialGradient(bx - r * 0.4, by - r * 0.5, 1, bx, by, r); gr.addColorStop(0, P.shade(col, 0.35)); gr.addColorStop(1, col); c.fillStyle = gr; c.beginPath(); c.arc(bx, by, r, 0, TAU); c.fill(); }
    c.restore();
  }
  // a few grass blades fanning from (x, y)
  function blades(c, x, y, h, col = '#6ab84f', sway = 0) {
    c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 2.4;
    for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(x + i * 2.5, y); c.quadraticCurveTo(x + i * 3.5, y - h * 0.6, x + i * 5 + sway, y - h * (1 - Math.abs(i) * 0.1)); c.stroke(); }
    c.restore();
  }
  // a five-point star or sparkle
  function star(c, x, y, r, col = '#fff6c0') { c.fillStyle = col; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
  // a drag hint: what moves (SK.grab at a), where it goes (SK.target at b) and the way between (SK.arrow)
  function hint(c, g, a, b, o = {}) { if (!a || !b) return; SK.arrow(c, g, a[0], a[1], b[0], b[1], { from: o.ra ?? 30, to: (o.rb ?? 30) + 8 }); SK.target(c, g, b[0], b[1], o.rb ?? 30, o.tw ? { w: o.tw, h: o.th } : {}); SK.grab(c, g, a[0], a[1], o.ra ?? 26); }
  return { TAU, patient, vgrad, cottage, bush, blades, star, hint };
})();
