// PAY OUT! (business SV-35) — the company has been sold, and the sale money is a big bag of coins at the top. Two
// buckets wait to be paid: the investors' bucket hangs high (they have a liquidation preference: paid first) and the
// founders' bucket sits below it. Hold to pour and steer the stream with your finger into the swaying top bucket: it
// fills first, and only its overflow spills down a spout to the founders. Pour straight into the founders' bucket and
// the owl lawyer scoops it back up to the bag. Level 1: three buckets (later investors first). Level 2: a small sale,
// and the top bucket takes it all.
const BAGY = 168, FOUND = { x: 180, y0: 488, y1: 588, w: 230 }, RATE = 0.55;
const LVO = [
  { sale: 1.8, tops: [{ cap: 1.0, col: '#5aa8e8', who: 'fox' }], sway: 40, sp: 1.2 },
  { sale: 2.2, tops: [{ cap: 0.8, col: '#7ac870', who: 'duck' }, { cap: 0.8, col: '#5aa8e8', who: 'fox' }], sway: 50, sp: 1.5 },
  { sale: 0.8, tops: [{ cap: 1.2, col: '#5aa8e8', who: 'fox' }], sway: 64, sp: 2.0 },
];
function paintVault(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#ff9ac0'); w.addColorStop(0.55, '#ffc890'); w.addColorStop(1, '#fff2d0'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  for (let i = 0; i < 12; i++) { o.fillStyle = 'rgba(255,255,255,0.12)'; o.beginPath(); o.arc(30 + i * 30, 620 - (i % 3) * 8, 26, 0, 7); o.fill(); }
  o.fillStyle = '#c8a070'; o.fillRect(0, 596, 360, 44); o.fillStyle = 'rgba(0,0,0,0.08)'; o.fillRect(0, 596, 360, 5);
  // the rail the bag slides along
  o.fillStyle = '#7a5a8a'; o.fillRect(0, BAGY - 46, 360, 6);
}
MG.add({
  id: 'payout', stage: 'startups', cmd: 'PAY OUT!', time: 6, mood: 'party', winText: 'Preference!', failText: 'Unpaid!', hold: 1.8,
  card: { title: 'Who gets paid first', kind: 'Startups', ref: 'Liquidation preference',
    text: 'When a startup is sold, the money does not always split by slices of the pie. Investors usually buy shares with a liquidation preference: they get their money back first, before founders and staff see anything. A common deal is 1x: back what they put in.\n\nSo the sale money fills the investors\' bucket first, and only what overflows reaches the founders. In a big sale everyone is paid. In a small sale, the investors\' bucket can take it all.',
    note: 'Investors with a preference are paid back first; founders get only what is left.' },
  init(g) {
    const s = g.s, L = LVO[Math.min(2, g.level)];
    s.L = L; s.bag = L.sale; s.tops = L.tops.map(t => ({ ...t, fill: 0 })); s.found = 0; s.pour = false; s.px = 70; s.ph = g.rand() * 6.28; s.scoops = []; s.lastScoop = -9;
  },
  topX(g, i) { const s = g.s; return 180 + Math.sin(g.t * s.L.sp + s.ph + i * 1.7) * s.L.sway; }, // each top bucket sways
  topY(i, n) { return n === 1 ? 300 : 266 + i * 104; },
  down(g, x) { const s = g.s; SK.touched(g); if (g.done) return; s.pour = true; s.px = SK.clamp(x, 30, 330); g.sfx('coin'); },
  move(g, x) { const s = g.s; if (s.pour) s.px = SK.clamp(x, 30, 330); },
  up(g) { g.s.pour = false; },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    if (s.pour && s.bag > 0) {
      const d = Math.min(s.bag, RATE * dt); s.bag -= d;
      // where does the stream land? the top bucket (index 0) is paid first; overflow cascades down
      const n = s.tops.length, top = s.tops[0];
      if (Math.abs(s.px - this.topX(g, 0)) < 40) this.add(g, 0, d);
      else { // a miss: it falls past; the owl lawyer scoops it back up to the bag
        s.bag += d * 0.9; if (g.t - s.lastScoop > 0.5) { s.lastScoop = g.t; s.scoops.push({ t: g.t, x: s.px }); g.sfx('wrong'); }
      }
      if ((g.t * 10 | 0) !== ((g.t - dt) * 10 | 0)) g.sfx('coin');
    }
    if (s.bag <= 0.0001) { s.bag = 0; g.win(); g.sfx('cheer'); g.burst(FOUND.x, FOUND.y0, ['#ffe27a', '#fff6ea'], 20, 200); }
  },
  add(g, i, d) { const s = g.s; if (i >= s.tops.length) { s.found += d; return; } const b = s.tops[i], room = b.cap - b.fill; if (d <= room) b.fill += d; else { b.fill = b.cap; this.add(g, i + 1, d - room); } },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', n = s.tops.length;
    c.drawImage(g.bake('b8pay_v', paintVault), 0, 0, 360, 640);
    // the founders' bucket at the bottom, with the rabbit and beaver founders
    const fpaid = s.found > 0.02;
    SK.animal(c, 'rabbit', 40, 606, 0.85, { t, pose: fpaid && won ? 'cheer' : won ? 'sad' : 'idle', expr: fpaid ? 'laugh' : won ? 'sad' : 'happy' });
    SK.animal(c, 'beaver', 322, 606, 0.85, { t, phase: 1, pose: fpaid && won ? 'cheer' : won ? 'sad' : 'idle', expr: fpaid ? 'laugh' : won ? 'sad' : 'happy', facing: -1 });
    B8.bucketBack(c, FOUND.x, FOUND.y0, FOUND.y1, FOUND.w, '#d87a9a');
    const fl = SK.clamp(s.found / 1.2, 0, 1); if (fl > 0) { c.save(); c.beginPath(); c.rect(0, FOUND.y1 - fl * (FOUND.y1 - FOUND.y0 - 8), 360, 200); c.clip(); for (let i = 0; i < 40; i++) B8.flatCoin(c, FOUND.x - 84 + (i % 8) * 24, FOUND.y1 - 8 - Math.floor(i / 8) * 9, 12, 0); c.restore(); }
    B8.bucketFront(c, FOUND.x, FOUND.y0, FOUND.y1, FOUND.w, '#d87a9a', { open: true });
    // the investors' buckets, swaying; each one's overflow spout pours to the next below
    for (let i = n - 1; i >= 0; i--) {
      const b = s.tops[i], bx = this.topX(g, i), by = this.topY(i, n), w = 78, h = 64, full = b.fill >= b.cap - 0.001;
      c.strokeStyle = '#7a5a8a'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 30, by); c.lineTo(bx, by - 40); c.lineTo(bx + 30, by); c.stroke(); // the hanger
      B8.bucketBack(c, bx, by, by + h, w, b.col);
      const k = b.fill / b.cap; c.save(); c.beginPath(); c.rect(bx - 40, by + h - k * (h - 6), 80, 80); c.clip(); for (let j = 0; j < 15; j++) B8.flatCoin(c, bx - 22 + (j % 3) * 22, by + h - 6 - Math.floor(j / 3) * 11, 11, 0); c.restore();
      B8.bucketFront(c, bx, by, by + h, w, b.col, { open: true });
      SK.animal(c, b.who, bx + (i % 2 ? -58 : 58), by + h + 4, 0.6, { t, phase: i, pose: full ? 'cheer' : 'idle', expr: full ? 'laugh' : 'happy', facing: i % 2 ? 1 : -1, noShadow: true });
      // overflow: a stream of coins down to the next bucket (or the founders)
      if (full && s.pour && Math.abs(s.px - this.topX(g, 0)) < 40) { const ny = i + 1 < n ? this.topY(i + 1, n) : FOUND.y0, nx = i + 1 < n ? this.topX(g, i + 1) : FOUND.x; for (let j = 0; j < 4; j++) { const q = (t * 2.2 + j / 4) % 1; B8.coin(c, SK.lerp(bx + 34, nx, q), SK.lerp(by + 6, ny, q) - Math.sin(q * Math.PI) * 20, 6, q * 9); } }
    }
    // the stream from the bag
    if (s.pour && s.bag > 0) { const hit = Math.abs(s.px - this.topX(g, 0)) < 40, endY = hit ? this.topY(0, n) + 6 : FOUND.y0 + 10; for (let j = 0; j < 7; j++) { const q = (t * 3 + j / 7) % 1; B8.coin(c, s.px + Math.sin(j * 3) * 4, SK.lerp(BAGY + 20, endY, q), 7, q * 8 + j); } }
    // the owl lawyer scoops missed coins back up
    const sc = s.scoops[s.scoops.length - 1], sk = sc ? SK.clamp((t - sc.t) / 0.7, 0, 1) : 1;
    SK.animal(c, 'owl', sk < 1 ? SK.lerp(sc.x, 330, sk) : 330, sk < 1 ? 470 - Math.sin(sk * Math.PI) * 60 : 470, 0.75, { t, pose: sk < 1 ? 'carry' : 'idle', expr: sk < 1 ? 'think' : 'happy', facing: -1, hold: sk < 1 ? (h => B8.coin(h, 0, 0, 9)) : null });
    // the bag of sale money on its rail (it shrinks as it empties)
    const bs = 0.7 + 0.5 * SK.clamp(s.bag / 2, 0, 1);
    c.save(); c.translate(s.px, BAGY); c.rotate(s.pour ? 2.6 : 0); B8.cashBag(c, 0, 0, bs); c.restore();
    c.strokeStyle = '#7a5a8a'; c.lineWidth = 2; c.beginPath(); c.moveTo(s.px, BAGY - 40); c.lineTo(s.px, BAGY - 22 * bs); c.stroke();
    if (!s.pour) SK.glow(c, g, s.px, BAGY, 36);
    SK.demo(g, c, 'drag', [s.px, BAGY], [this.topX(g, 0), BAGY], { delay: 0.8 }); // press the bag and slide it over the top bucket
  },
  auto(g, dt, synth) { // hold, and keep the bag over the swaying top bucket
    const s = g.s; if (g.done) return; const x = this.topX(g, 0);
    if (!s._b8 && g.t > 0.9) { s._b8 = 1; synth('down', s.px, BAGY); } else if (s._b8 === 1) synth('move', SK.lerp(s.px, x, 0.4), BAGY);
  },
});
