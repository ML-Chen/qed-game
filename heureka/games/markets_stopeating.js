// STOP EATING! (business MI-04) — pizza slices in a row on a long plate. Above each slice, a heart shows how much the
// rabbit would enjoy it, and the hearts shrink slice by slice; next to each heart sits the same coin, its price. Tap to
// buy and eat the next slice; a balance weighs the next slice's heart against its coin. Tap "I'm full" when the coin is heavier: the rabbit pats its
// tummy, happy. Eat a slice whose heart is smaller than its coin and the rabbit's tummy swells and it groans; stop too
// early and it is still hungry. Level 2: the price changes halfway through the meal.
const ROW = i => 126 + i * 44, HEARTY = 396, SLICEY = 440, N = 6, SC = { x: 196, y: 236, L: 82 }, FULL = { x: 58, y: 452 };
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
  // the table
  o.fillStyle = '#c88a50'; o.fillRect(0, 466, 360, 22); o.fillStyle = '#a86a38'; o.fillRect(0, 488, 360, 10);
  const fl = o.createLinearGradient(0, 498, 0, 640); fl.addColorStop(0, '#b8a0c0'); fl.addColorStop(1, '#9a80a8'); o.fillStyle = fl; o.fillRect(0, 498, 360, 142);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) { o.fillStyle = 'rgba(255,255,255,0.12)'; o.fillRect(i * 40, 500 + j * 36, 40, 36); }
  // the long plate
  o.fillStyle = 'rgba(40,20,40,0.15)'; o.beginPath(); o.ellipse(222, 470, 140, 12, 0, 0, 7); o.fill();
  o.fillStyle = '#f4f0f8'; o.beginPath(); o.roundRect(96, 444, 256, 26, 13); o.fill(); o.strokeStyle = '#b8b0c8'; o.lineWidth = 2; o.stroke();
}
MG.add({
  id: 'stopeating', stage: 'markets', cmd: 'EAT WHILE IT\'S WORTH THE COIN!', time: 6, mood: 'desert', winText: 'Stopped at the right slice!', failText: 'Too full!', hold: 1.7,
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
    s.eaten = 0; s.lastTap = 0; s.fly = null; s.end = 0; s.stopped = 0; fix();
  },
  price(g, i) { const s = g.s; return s.coin2 != null && i >= s.change ? s.coin2 : s.coin; }, // the price of slice i (level 2: changes after two)
  best(g) { let n = 0; while (n < N && g.s.h[n] > this.price(g, n)) n++; return n; },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (SK.dist(x, y, FULL.x, FULL.y) < 42) { // "I'm full": the meal ends here
      s.stopped = g.t; s.end = g.t; if (s.eaten === this.best(g)) { g.win(); g.sfx('cheer'); } else { g.fail(); g.sfx('wrong'); } return; }
    if (s.eaten >= N || (s.fly && g.t - s.fly.t < 0.25)) return;
    const i = s.eaten; s.eaten++; s.lastTap = g.t; s.fly = { i, t: g.t }; g.sfx('munch'); g.sfx('coin');
    if (s.coin2 != null && s.eaten === s.change) { s.changed = g.t + 0.3; }
    if (s.h[i] < this.price(g, i)) { s.end = g.t; g.fail(); g.sfx('fail'); }
  },
  update(g, dt) {
    const s = g.s; if (g.done || !s.eaten) return;
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', full = lost && s.eaten > this.best(g), hungry = lost && !full;
    c.drawImage(g.bake('b8eat_d', paintDiner), 0, 0, 360, 640);
    // the balance: the next slice's enjoyment (a heart) against its price (a coin); it tips toward the heavier one
    const nx = Math.min(s.eaten, N - 1), hN = s.h[nx], pN = this.price(g, nx), pop = s.changed ? 1 + 0.3 * Math.max(0, 1 - (t - s.changed) * 3) : 1;
    const ang = s.eaten < N ? SK.clamp((hN - pN) * 0.9, -0.38, 0.38) : 0, lx = SC.x - SC.L * Math.cos(ang), ly = SC.y + SC.L * Math.sin(ang), rx = SC.x + SC.L * Math.cos(ang), ry = SC.y - SC.L * Math.sin(ang);
    c.fillStyle = '#7a4a5a'; c.beginPath(); c.moveTo(SC.x - 26, SC.y + 120); c.lineTo(SC.x + 26, SC.y + 120); c.lineTo(SC.x + 6, SC.y); c.lineTo(SC.x - 6, SC.y); c.closePath(); c.fill();
    c.strokeStyle = '#7a4a5a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(lx, ly); c.lineTo(rx, ry); c.stroke(); c.fillStyle = '#f5c23a'; c.beginPath(); c.arc(SC.x, SC.y, 7, 0, 7); c.fill();
    for (const [px, py] of [[lx, ly], [rx, ry]]) { c.strokeStyle = '#7a4a5a'; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 26, py + 52); c.moveTo(px, py); c.lineTo(px + 26, py + 52); c.stroke(); c.fillStyle = '#c8a0b8'; c.beginPath(); c.ellipse(px, py + 54, 32, 7, 0, 0, 7); c.fill(); }
    if (s.eaten < N) { heart(c, lx, ly + 30, 19 * hN); B8.coin(c, rx, ry + 30, 22 * pN * pop); }
    SK.tag(c, 'Enjoyment', lx, ly + 82, 18); SK.tag(c, 'Price', rx, ry + 82, 18);
    // the slices left on the plate, each with a small heart showing how much it would be enjoyed
    for (let i = s.eaten; i < N; i++) { const x = ROW(i); heart(c, x, HEARTY, 7.5 * s.h[i]); slice(c, x, SLICEY, 0.95); }
    if (s.eaten < N && !g.done) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.roundRect(ROW(s.eaten) - 22, HEARTY - 22, 44, SLICEY - HEARTY + 44, 12); c.stroke(); c.restore(); }
    // the "I'm full" sign by the rabbit
    c.fillStyle = s.stopped ? '#f5c23a' : '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.arc(FULL.x, FULL.y, 30, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#3a1640'; c.beginPath(); c.roundRect(FULL.x - 12, FULL.y - 16, 24, 26, 6); c.fill(); c.fillRect(FULL.x - 16, FULL.y - 8, 6, 14); // a hand: stop
    SK.tag(c, "I'm full", FULL.x, FULL.y + 46, 18);
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
    if (s.eaten < this.best(g)) SK.demo(g, c, 'tap', [ROW(s.eaten), SLICEY - 6], null, { delay: 0.8 }); // the next slice still worth its price
    else SK.demo(g, c, 'tap', [FULL.x, FULL.y], null, { delay: 0.8 }); // the next one isn't worth it: stop
  },
  auto(g, dt, synth) { const s = g.s; const B = s._b8 = s._b8 || { next: 1.0 }; if (g.done || g.t < B.next) return; if (s.eaten >= this.best(g)) { synth('down', FULL.x, FULL.y); synth('up', FULL.x, FULL.y); B.next = 99; return; } { synth('down', ROW(s.eaten), SLICEY); synth('up', ROW(s.eaten), SLICEY); B.next = g.t + 0.35; } },
});
