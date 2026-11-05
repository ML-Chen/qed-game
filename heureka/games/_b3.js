// _b3.js — shared drawing helpers for builder b3's microgames (reactions_*, fire_*, life_*): a cartoon flame, smoke
// puffs, a stable hash for draw-only sparkle, and a soft glow. Draw-only: nothing here touches game state.
const B3 = (() => {
  const TAU = Math.PI * 2;
  // a stable pseudo-random number in 0..1 from an integer (for draw-only scatter that must not flicker)
  const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  // a cartoon flame standing on (x, y), about 60 px tall at s = 1; k (0..1) is its strength, t the clock
  function flame(c, x, y, s, t, k = 1, ph = 0) {
    if (k <= 0.02) return; c.save(); c.translate(x, y); c.scale(s * (0.4 + 0.6 * k), s * (0.25 + 0.75 * k));
    const layers = [['#e8402a', 1], ['#ff8a2a', 0.74], ['#ffd45a', 0.5], ['#fff6c8', 0.26]];
    for (let i = 0; i < layers.length; i++) {
      const [col, w] = layers[i], h = 64 * w + 8, wob = Math.sin(t * 9 + ph + i) * 4 * w, wob2 = Math.sin(t * 13 + ph * 1.7 + i * 2) * 3;
      c.fillStyle = col; c.beginPath(); c.moveTo(0, 0);
      c.bezierCurveTo(-26 * w - 6, -4, -22 * w + wob2, -h * 0.55, wob, -h);
      c.bezierCurveTo(22 * w + wob2, -h * 0.55, 26 * w + 6, -4, 0, 0); c.fill();
    }
    c.restore();
  }
  // a warm glow disc (additive) under a fire or a hot thing
  function glow(c, x, y, r, col = '255,160,60', a = 0.5) {
    c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.restore();
  }
  // a rising column of smoke puffs from (x, y); k 0..1 its thickness
  function smoke(c, x, y, t, k = 1, col = '120,110,120', n = 6, rise = 110) {
    if (k <= 0.02) return; c.save();
    for (let i = 0; i < n; i++) { const q = ((t * 0.6 + i / n) % 1), px = x + Math.sin(q * 5 + i) * 10 * q + q * 14, py = y - q * rise, r = (8 + q * 22) * (0.6 + 0.4 * k);
      c.fillStyle = `rgba(${col},${(1 - q) * 0.55 * k})`; c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill(); }
    c.restore();
  }
  return { TAU, hash, flame, glow, smoke };
})();
