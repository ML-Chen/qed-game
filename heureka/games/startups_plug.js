// PLUG! (business SV-09) — the startup's customers are a big leaky bucket: new customers tumble in from a pipe at the
// top, and customers who quit (churn) spray out of holes in the sides and wander off. Tap each hole to cork it: the
// level climbs to the flag. Leave the holes open and the bucket never fills, however fast they pour in.
// Level 2: corks pop back out, so keep plugging.
const BK = { x: 180, y0: 214, y1: 566, w: 236 }, IN_RATE = 0.2, LEAK = 0.21, GOAL = 0.82;
const HOLES = [
  [{ f: 0.12, s: -1 }, { f: 0.3, s: 1 }, { f: 0.5, s: -1 }],
  [{ f: 0.1, s: 1 }, { f: 0.26, s: -1 }, { f: 0.44, s: 1 }, { f: 0.58, s: -1 }],
  [{ f: 0.1, s: -1 }, { f: 0.24, s: 1 }, { f: 0.4, s: -1 }, { f: 0.54, s: 1 }, { f: 0.66, s: -1 }],
];
const bw = f => BK.w * (0.78 + 0.22 * f), yOf = f => BK.y1 - f * (BK.y1 - BK.y0); // bucket width at height f (narrower at the bottom)
const holePos = h => [BK.x + h.s * (bw(h.f) / 2 - 6), yOf(h.f)];
const FACES = ['#f49ab8', '#f5c23a', '#7ac870', '#5aa8e8', '#c98a52', '#b88ae0'];
function paintYard(o) {
  const sky = o.createLinearGradient(0, 0, 0, 520); sky.addColorStop(0, '#ff9ac0'); sky.addColorStop(0.6, '#ffc890'); sky.addColorStop(1, '#fff2d0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  P.hills(o, 360, 470, 50, '#b8d870', '#80a848', { seed: 7 });
  const gr = o.createLinearGradient(0, 520, 0, 640); gr.addColorStop(0, '#9ac860'); gr.addColorStop(1, '#6a9a40'); o.fillStyle = gr; o.fillRect(0, 520, 360, 120);
  P.grassTufts(o, 360, 540, 630, 30, '#5a8a38', 5);
  // the pipe that brings new customers
  o.fillStyle = '#7a8a9a'; o.fillRect(0, 128, 150, 30); o.fillStyle = '#9aaaba'; o.fillRect(0, 128, 150, 8);
  o.fillStyle = '#6a7a8a'; o.beginPath(); o.roundRect(128, 122, 34, 46, 6); o.fill(); o.fillStyle = '#4a5a6a'; o.beginPath(); o.ellipse(145, 168, 15, 5, 0, 0, 7); o.fill();
}
function custBall(c, x, y, r, col, sad) {
  c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 1.5; c.stroke();
  c.fillStyle = '#2a1424'; c.beginPath(); c.arc(x - r * 0.32, y - r * 0.12, r * 0.16, 0, 7); c.arc(x + r * 0.32, y - r * 0.12, r * 0.16, 0, 7); c.fill();
  c.strokeStyle = '#2a1424'; c.lineWidth = 1.3; c.beginPath(); if (sad) c.arc(x, y + r * 0.55, r * 0.3, 1.15 * Math.PI, 1.85 * Math.PI); else c.arc(x, y + r * 0.15, r * 0.3, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke();
}
MG.add({
  id: 'plugchurn', stage: 'startups', cmd: 'PLUG THE LEAKS TO GROW!', time: 5, mood: 'party', winText: 'Retention!', failText: 'Churn!', hold: 1.5,
  card: { title: 'Plug the leaks first', kind: 'Startups', ref: 'Churn and retention',
    text: 'A company\'s customers are like water in a bucket. New customers pour in at the top. Customers who stop using the product leak out of the holes. Losing customers this way is called churn.\n\nIf the holes stay open, pouring faster barely helps: more water just sprays out. Plug the holes and every new customer stays, so the bucket fills.\n\nKeeping the customers you have is called retention. Startups watch it closely, because growth only adds up when customers stay.',
    note: 'Growth only adds up if customers stay: plug the leaks before pouring faster.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.holes = HOLES[L].map(h => ({ ...h, plug: 0, x: holePos(h)[0], y: holePos(h)[1], pops: 0, popAt: 0 }));
    s.h = 0.16; s.reopen = L >= 2; s.lost = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return; const h = SK.pick(s.holes.filter(o => !o.plug), x, y, 38);
    if (h) { h.plug = g.t; if (s.reopen) h.popAt = g.t + 1.6 + g.rand() * 1.0; g.sfx('pop'); g.burst(h.x, h.y, ['#c88a50', '#fff6ea'], 6, 90); }
  },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    let out = 0; for (const h of s.holes) {
      if (h.plug && s.reopen && g.t > h.popAt) { h.plug = 0; h.pops++; g.sfx('boing'); }
      if (!h.plug && s.h > h.f) out += LEAK * Math.sqrt(s.h - h.f);
    }
    s.lost += out * dt;
    s.h = SK.clamp(s.h + (IN_RATE - out) * dt, 0, 1);
    if (s.h >= GOAL) { g.win(); g.sfx('cheer'); g.burst(BK.x, yOf(GOAL), ['#ffe27a', '#ff8aa0', '#fff6ea', '#7ac870'], 26, 240); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('b8plug_y', paintYard), 0, 0, 360, 640);
    // new customers tumbling in from the pipe
    const surf = yOf(s.h);
    if (!won) for (let i = 0; i < 8; i++) { const q = (t * 1.6 + i / 8) % 1, y = 170 + q * (surf - 170); custBall(c, 145 + Math.sin(i * 2.3 + t) * 4, y, 8, FACES[i % 6], false); }
    // the bucket and the customers inside it (a crowd of little faces below the waterline)
    B8.bucketBack(c, BK.x, BK.y0, BK.y1, BK.w, '#a8683a');
    c.save(); c.beginPath(); const b = BK.w * 0.78; c.moveTo(BK.x - BK.w / 2 + 3, BK.y0); c.lineTo(BK.x + BK.w / 2 - 3, BK.y0); c.lineTo(BK.x + b / 2 - 3, BK.y1 - 3); c.lineTo(BK.x - b / 2 + 3, BK.y1 - 3); c.closePath(); c.clip();
    B8.waterFill(c, 0, 360, surf, BK.y1, t, '#7ab8e8');
    const rnd = P.rng(21); for (let row = 0; row < 22; row++) for (let j = 0; j < 9; j++) { const x = BK.x - 110 + j * 26 + (row % 2) * 13 + rnd() * 4, y = BK.y1 - 10 - row * 16 + Math.sin(t * 3 + j + row) * 1.5; if (y < surf + 8) continue; custBall(c, x, y, 8, FACES[(row * 3 + j) % 6], false); }
    c.restore();
    B8.bucketFront(c, BK.x, BK.y0, BK.y1, BK.w, '#a8683a', { open: true });
    // the goal flag on the rim
    const gy = yOf(GOAL); c.save(); c.strokeStyle = won ? '#5ad07a' : '#fff6ea'; c.lineWidth = 4; c.setLineDash([10, 7]); c.beginPath(); c.moveTo(BK.x - bw(GOAL) / 2, gy); c.lineTo(BK.x + bw(GOAL) / 2, gy); c.stroke(); c.restore();
    const fx = BK.x + bw(GOAL) / 2 + 4; c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(fx, gy + 6); c.lineTo(fx, gy - 40); c.stroke(); c.fillStyle = won ? '#5ad07a' : '#f5c23a'; c.beginPath(); c.moveTo(fx, gy - 40); c.lineTo(fx + 28 + Math.sin(t * 7) * 3, gy - 32); c.lineTo(fx, gy - 22); c.closePath(); c.fill();
    // the holes: corked, or spraying quitting customers who wander off
    for (const h of s.holes) {
      if (h.plug) { c.fillStyle = '#c88a50'; c.strokeStyle = '#6a3a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(h.x - 9 + h.s * 4, h.y - 8, 18, 16, 4); c.fill(); c.stroke(); continue; }
      c.fillStyle = '#2a1418'; c.beginPath(); c.ellipse(h.x, h.y, 8, 9, 0, 0, 7); c.fill();
      const flow = s.h > h.f && !won ? Math.sqrt(s.h - h.f) : 0;
      if (flow > 0) for (let i = 0; i < 6; i++) { const q = (t * 1.3 + i / 6) % 1, vx = h.s * (60 + 140 * flow), x = h.x + vx * q * 0.8, y = h.y + 420 * q * q * 0.8; if (y > 600) continue; custBall(c, x, y, 7, FACES[(i + h.s + 6) % 6], true); }
      SK.glow(c, g, h.x, h.y, 22);
    }
    // customers who left, walking away along the grass
    const nGone = Math.min(10, Math.floor(s.lost * 12));
    for (let i = 0; i < nGone; i++) { const side = i % 2 ? 1 : -1, x = BK.x + side * (150 + ((t * 30 + i * 37) % 60)), y = 590 + (i % 3) * 10; if (x < 4 || x > 356) continue; custBall(c, x, y, 7, FACES[i % 6], true); }
    // the beaver founder
    SK.animal(c, 'beaver', 52, 608, 0.95, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'wow' });
    const first = s.holes.find(h => !h.plug); if (first) SK.demo(g, c, 'tap', [first.x, first.y], null, { delay: 0.7 });
  },
  auto(g, dt, synth) {
    const s = g.s; const B = s._b8 = s._b8 || { next: 0.9 }; if (g.t < B.next) return;
    const h = s.holes.find(o => !o.plug); if (h) { synth('down', h.x, h.y); synth('up', h.x, h.y); B.next = g.t + 0.3; }
  },
});
