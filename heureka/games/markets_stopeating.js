// STOP EATING! (business MI-04) — pizza slices in a row on a long plate. Above each slice, a heart shows how much the
// rabbit would enjoy it, and the hearts shrink slice by slice; next to each heart sits the same coin, its price. Tap to
// buy and eat the next slice. Stop while the next heart is still bigger than the coin, then wait: the rabbit pats its
// tummy, happy. Eat a slice whose heart is smaller than its coin and the rabbit's tummy swells and it groans; stop too
// early and it is still hungry. Level 2: the price changes halfway through the meal.
const ROW = i => 112 + i * 44, HEARTY = 318, COINY = 372, SLICEY = 440, N = 6, RC = 16;
function heart(c, x, y, r, col = '#ff5a8a') { c.save(); c.translate(x, y); const s = r / 10; c.scale(s, s); c.fillStyle = col; c.strokeStyle = '#a81a4a'; c.lineWidth = 2 / s; c.beginPath(); c.moveTo(0, 9); c.bezierCurveTo(-16, -2, -10, -15, 0, -6); c.bezierCurveTo(10, -15, 16, -2, 0, 9); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-5, -6, 3, 2, -0.6, 0, 7); c.fill(); c.restore(); }
function slice(c, x, y, s = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.fillStyle = '#d8954a'; c.beginPath(); c.moveTo(-17, -22); c.quadraticCurveTo(0, -30, 17, -22); c.lineTo(0, 18); c.closePath(); c.fill();
  c.fillStyle = '#f8d060'; c.beginPath(); c.moveTo(-14, -18); c.quadraticCurveTo(0, -24, 14, -18); c.lineTo(0, 14); c.closePath(); c.fill();
  c.fillStyle = '#d8402a'; for (const [px, py] of [[-5, -12], [5, -10], [0, -2]]) { c.beginPath(); c.arc(px, py, 3.6, 0, 7); c.fill(); }
  c.restore();
}
function paintDiner(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#e8a0c0'); w.addColorStop(0.5, '#f8c8d8'); w.addColorStop(1, '#fff0f0'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  for (let x = 0; x < 360; x += 40) { o.fillStyle = 'rgba(255,255,255,0.18)'; o.fillRect(x, 130, 20, 340); }
  // a round window with a moon, a menu board without words
  o.fillStyle = '#fff6ea'; o.beginPath(); o.arc(300, 196, 42, 0, 7); o.fill(); o.fillStyle = '#5a6aa8'; o.beginPath(); o.arc(300, 196, 34, 0, 7); o.fill(); o.fillStyle = '#fff2c0'; o.beginPath(); o.arc(312, 186, 11, 0, 7); o.fill();
  // the table
  o.fillStyle = '#c88a50'; o.fillRect(0, 466, 360, 22); o.fillStyle = '#a86a38'; o.fillRect(0, 488, 360, 10);
  const fl = o.createLinearGradient(0, 498, 0, 640); fl.addColorStop(0, '#b8a0c0'); fl.addColorStop(1, '#9a80a8'); o.fillStyle = fl; o.fillRect(0, 498, 360, 142);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) { o.fillStyle = 'rgba(255,255,255,0.12)'; o.fillRect(i * 40, 500 + j * 36, 40, 36); }
  // the long plate
  o.fillStyle = 'rgba(40,20,40,0.15)'; o.beginPath(); o.ellipse(222, 470, 140, 12, 0, 0, 7); o.fill();
  o.fillStyle = '#f4f0f8'; o.beginPath(); o.roundRect(96, 444, 256, 26, 13); o.fill(); o.strokeStyle = '#b8b0c8'; o.lineWidth = 2; o.stroke();
}
MG.add({
  id: 'stopeating', stage: 'markets', cmd: 'STOP EATING!', time: 6, mood: 'desert', winText: 'The margin!', failText: 'Too full!', hold: 1.7,
  card: { title: 'Stop when the next one isn\'t worth it', kind: 'Economics', ref: 'Marginal benefit',
    text: 'The first slice of pizza is wonderful. The second is still great. By the fifth, you hardly enjoy it. The extra enjoyment from one more slice is called its marginal benefit, and it usually shrinks as you have more.\n\nEach slice costs the same coin. So keep buying while the next slice is worth more to you than its price, and stop when it is worth less. When the price changes, the best place to stop changes too.',
    note: 'Keep going while the next one is worth more than it costs; stop when it isn\'t.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    // hearts shrink slice by slice; where they cross the coin varies (never too close to call)
    const start = 1.45 + g.rand() * 0.15, step = 0.17 + g.rand() * 0.07;
    s.h = Array.from({ length: N }, (_, i) => Math.max(0.25, start - i * step));
    s.coin = [1, 0.92, 1][L]; s.coin2 = L >= 2 ? (g.rand() < 0.5 ? 0.72 : 1.22) : null; s.change = 2; s.changed = 0;
    const fix = () => { for (let i = 0; i < N; i++) { const c0 = this.price(g, i); if (Math.abs(s.h[i] - c0) < 0.1) s.h[i] = s.h[i] > c0 ? c0 + 0.1 : c0 - 0.1; } };
    s.eaten = 0; s.lastTap = 0; s.idle = [2.2, 1.7, 1.4][L]; s.fly = null; s.end = 0; fix();
  },
  price(g, i) { const s = g.s; return s.coin2 != null && i >= s.change ? s.coin2 : s.coin; }, // the price of slice i (level 2: changes after two)
  best(g) { let n = 0; while (n < N && g.s.h[n] > this.price(g, n)) n++; return n; },
  down(g) {
    const s = g.s; SK.touched(g); if (g.done || s.eaten >= N || (s.fly && g.t - s.fly.t < 0.25)) return;
    const i = s.eaten; s.eaten++; s.lastTap = g.t; s.fly = { i, t: g.t }; g.sfx('munch'); g.sfx('coin');
    if (s.coin2 != null && s.eaten === s.change) { s.changed = g.t + 0.3; }
    if (s.h[i] < this.price(g, i)) { s.end = g.t; g.fail(); g.sfx('fail'); }
  },
  update(g, dt) {
    const s = g.s; if (g.done || !s.eaten) return;
    if (g.t - s.lastTap > s.idle) { s.end = g.t; if (s.eaten === this.best(g)) { g.win(); g.sfx('cheer'); } else { g.fail(); g.sfx('wrong'); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', full = lost && s.eaten > this.best(g), hungry = lost && !full;
    c.drawImage(g.bake('b8eat_d', paintDiner), 0, 0, 360, 640);
    // each slice's heart and its coin
    for (let i = s.eaten; i < N; i++) {
      const x = ROW(i), next = i === s.eaten, pr = this.price(g, i), pop = s.changed && i >= s.change ? 1 + 0.25 * Math.max(0, 1 - (t - s.changed) * 3) : 1;
      if (next && !g.done) { c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.roundRect(x - 22, HEARTY - 30, 44, COINY - HEARTY + 54, 14); c.fill(); }
      heart(c, x, HEARTY, RC * s.h[i] / 1.2); // a heart as wide as the coin is worth exactly the price
      if (s.changed || s.coin2 == null || i < s.change) B8.coin(c, x, COINY, RC * pr * pop); else B8.coin(c, x, COINY, RC * s.coin);
      slice(c, x, SLICEY, 0.95);
    }
    // the slice being eaten flies to the rabbit
    if (s.fly && t - s.fly.t < 0.35) { const q = (t - s.fly.t) / 0.35; slice(c, SK.lerp(ROW(s.fly.i), 64, q), SK.lerp(SLICEY, 470, q) - Math.sin(q * Math.PI) * 50, 0.95 - q * 0.4, q * 3); }
    // the rabbit: its tummy swells with each slice; past the best point it groans
    const k = SK.clamp(s.eaten / 5, 0, 1.4), groan = full && t - s.end > 0.1;
    SK.animal(c, 'rabbit', 60, 600, 1.25, { t, pose: won ? 'cheer' : hungry ? 'sad' : 'idle', expr: won ? 'laugh' : groan ? 'wow' : hungry ? 'sad' : s.fly && t - s.fly.t < 0.4 ? 'laugh' : 'happy' });
    c.save(); c.fillStyle = groan ? '#ffd8e0' : '#fff6f4'; c.strokeStyle = '#d8a0b0'; c.lineWidth = 2; const tr = 10 + k * 10 + (groan ? 10 + Math.sin(t * 9) * 2 : 0); c.beginPath(); c.ellipse(66, 572, tr, tr * 0.85, 0, 0, 7); c.fill(); c.stroke(); c.restore();
    if (groan) { c.save(); c.strokeStyle = '#6aa848'; c.lineWidth = 3; for (let i = 0; i < 3; i++) { const a = t * 3 + i * 2; c.beginPath(); c.arc(60 + Math.cos(a) * 34, 488 + Math.sin(a) * 10, 5, 0, 7); c.stroke(); } c.restore(); }
    // your purse of coins, getting lighter
    for (let i = 0; i < N - s.eaten; i++) B8.flatCoin(c, 40 + (i % 3) * 20, 636 - 26 - Math.floor(i / 3) * 6, 10, 0);
    if (!s.eaten && !g.done) SK.glow(c, g, ROW(0), SLICEY - 10, 30);
    SK.demo(g, c, 'tap', [ROW(Math.min(s.eaten, N - 1)), SLICEY - 6], null, { delay: 0.8 });
  },
  auto(g, dt, synth) { const s = g.s; const B = s._b8 = s._b8 || { next: 1.0 }; if (g.done || g.t < B.next) return; if (s.eaten < this.best(g)) { synth('down', ROW(s.eaten), SLICEY); synth('up', ROW(s.eaten), SLICEY); B.next = g.t + 0.35; } },
});
