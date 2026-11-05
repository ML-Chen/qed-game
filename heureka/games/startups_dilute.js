// DILUTE! (business SV-20) — the company is a pie owned by its two founders, the rabbit and the beaver. Investors come
// one funding round at a time, each holding out a new slice and a bag of cash. Drag each slice into the pie: the old
// slices squeeze thinner to make room, the cash goes in, and the whole pie grows bigger in the oven. Say no (wait) and the pie stays small while the old oven
// sputters, smokes and breaks down. Level 0: two rounds; level 1: three; level 2: three plus the staff option pool.
const PIE = { x: 180, y: 330, r: 62 }, OVEN = { x: 300, y: 236 };
const COL = { rabbit: '#f49ab8', beaver: '#c98a52', fox: '#5aa8e8', owl: '#7ac870', duck: '#f5c23a', turtle: '#a88ae0' };
function paintKitchen(o) {
  const wall = o.createLinearGradient(0, 0, 0, 440); wall.addColorStop(0, '#ffd8c0'); wall.addColorStop(1, '#ffeedd'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
  o.strokeStyle = 'rgba(200,120,110,0.18)'; o.lineWidth = 2; for (let y = 130; y < 430; y += 30) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); } for (let x = 0; x < 360; x += 30) { o.beginPath(); o.moveTo(x, 130); o.lineTo(x, 430); o.stroke(); }
  // a window with a hill outside
  o.fillStyle = '#f8f0e8'; o.beginPath(); o.roundRect(18, 150, 92, 104, 10); o.fill(); const sk = o.createLinearGradient(0, 158, 0, 246); sk.addColorStop(0, '#8ad0f0'); sk.addColorStop(1, '#d8f2fa'); o.fillStyle = sk; o.fillRect(26, 158, 76, 88);
  o.fillStyle = '#8ac860'; o.beginPath(); o.moveTo(26, 246); o.quadraticCurveTo(60, 206, 102, 230); o.lineTo(102, 246); o.closePath(); o.fill(); o.fillStyle = '#f8f0e8'; o.fillRect(62, 158, 4, 88); o.fillRect(26, 200, 76, 4);
  // the brick oven
  o.fillStyle = '#b8584a'; o.beginPath(); o.moveTo(OVEN.x - 52, OVEN.y + 70); o.lineTo(OVEN.x - 52, OVEN.y); o.quadraticCurveTo(OVEN.x - 52, OVEN.y - 56, OVEN.x, OVEN.y - 58); o.quadraticCurveTo(OVEN.x + 52, OVEN.y - 56, OVEN.x + 52, OVEN.y); o.lineTo(OVEN.x + 52, OVEN.y + 70); o.closePath(); o.fill();
  o.strokeStyle = 'rgba(255,220,200,0.35)'; o.lineWidth = 1.5; for (let y = OVEN.y - 40; y < OVEN.y + 70; y += 12) { o.beginPath(); o.moveTo(OVEN.x - 50, y); o.lineTo(OVEN.x + 50, y); o.stroke(); }
  o.fillStyle = '#6a2a24'; o.fillRect(OVEN.x - 14, OVEN.y - 92, 28, 40);
  o.fillStyle = '#2a1418'; o.beginPath(); o.moveTo(OVEN.x - 28, OVEN.y + 40); o.lineTo(OVEN.x - 28, OVEN.y + 8); o.quadraticCurveTo(OVEN.x, OVEN.y - 22, OVEN.x + 28, OVEN.y + 8); o.lineTo(OVEN.x + 28, OVEN.y + 40); o.closePath(); o.fill();
  // the table
  o.fillStyle = '#c88a50'; o.fillRect(0, 400, 360, 26); o.fillStyle = '#a86a38'; o.fillRect(0, 426, 360, 12);
  const fl = o.createLinearGradient(0, 438, 0, 640); fl.addColorStop(0, '#b0784a'); fl.addColorStop(1, '#8a5a34'); o.fillStyle = fl; o.fillRect(0, 438, 360, 202);
  o.strokeStyle = 'rgba(60,30,10,0.2)'; o.lineWidth = 2; for (let y = 470; y < 640; y += 34) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
  o.fillStyle = 'rgba(255,255,255,0.18)'; o.fillRect(0, 400, 360, 4);
}
function wedge(c, x, y, r, a0, da, col) { // a loose slice of pie, apex at (x, y)
  c.fillStyle = '#d8954a'; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a0, a0 + da); c.closePath(); c.fill();
  const g = c.createRadialGradient(x, y, 2, x, y, r); g.addColorStop(0, P.shade(col, 0.35)); g.addColorStop(1, col);
  c.fillStyle = g; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.86, a0, a0 + da); c.closePath(); c.fill();
  c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a0, a0 + da); c.closePath(); c.stroke();
}
MG.add({
  id: 'dilute', stage: 'startups', cmd: "ADD EACH INVESTOR'S SLICE!", time: 5, mood: 'party', winText: 'Smaller slice, bigger pie!', failText: 'No cash, oven broke!', hold: 2.1,
  card: { title: 'A thinner slice of a bigger pie', kind: 'Startups', ref: 'Dilution',
    text: 'The pie is the company, and each slice is the share one owner holds. Each time an investor buys in, the company makes new shares for them. Every old slice becomes a smaller part of the whole. That is called dilution.\n\nThe investor\'s cash makes the company worth more, so the pie gets bigger. Right after a fair deal, a founder\'s thinner slice is worth about what the old slice was. The cash is meant to help the whole pie grow, and then the thinner slice can be worth much more.',
    note: 'Selling a slice to an investor makes your share smaller, but the cash can make the whole company bigger.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    // funding rounds, one investor at a time, each from a different spot (level 2 ends with the staff option pool)
    const R = [
      { who: 'fox', f: 0.25, hx: 296, hy: 470, ax: 302, ay: 606, face: -1 },
      { who: 'owl', f: 0.2, hx: 62, hy: 470, ax: 54, ay: 606, face: 1 },
      { who: 'duck', f: 0.15, hx: 316, hy: 296, ax: 320, ay: 400, face: -1 },
      { who: 'turtle', f: 0.1, hx: 46, hy: 296, ax: 42, ay: 400, face: 1 },
    ].slice(0, [2, 3, 4][L]);
    s.items = R.map((it, i) => ({ ...it, x: it.hx, y: it.hy, in: 0, show: i ? 0 : 0.01 }));
    s.r = PIE.r; s.dealT = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const it = SK.pick(s.items.filter(i => !i.in && i.show && g.t > i.show + 0.3), x, y, 56); if (it) { SK.dragStart(g, it, x, y); g.sfx('tap'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const it = d.obj;
    if (SK.dist(it.x, it.y, PIE.x, PIE.y) < s.r + 34) { it.in = g.t; g.sfx('whoosh'); g.sfx('coin'); g.burst(PIE.x, PIE.y - s.r, ['#ffe27a', '#fff6ea', COL[it.who]], 14, 160);
      const nx = s.items.find(i => !i.show); if (nx) nx.show = g.t + 0.35; if (s.items.every(i => i.in)) s.dealT = g.t; }
    else { it.back = g.t; g.sfx('boing'); }
  },
  update(g, dt) {
    const s = g.s;
    for (const it of s.items) if (!it.in && SK.dragging(g) !== it) { it.x += (it.hx - it.x) * Math.min(1, dt * 9); it.y += (it.hy - it.y) * Math.min(1, dt * 9); }
    // each slice that goes in adds cash: the pie grows in proportion (same area per share right after a fair deal) ...
    let target = PIE.r; for (const it of s.items) if (it.in) target = target / Math.sqrt(1 - it.f) * 1.0;
    // ... and once the deal is done, the cash is put to work: the oven roars and the pie keeps growing
    if (s.dealT) target *= 1 + 0.22 * SK.easeOut((g.t - s.dealT - 0.6) / 1.2);
    s.r += (target - s.r) * Math.min(1, dt * 5);
    if (s.dealT && !g.done && g.t > s.dealT + 0.55) { g.win(); g.sfx('cheer'); g.sfx('fire'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = Math.min(2, g.level);
    c.drawImage(g.bake('b8dilute_k', paintKitchen), 0, 0, 360, 640);
    // the oven's fire: weak and sputtering while you wait, roaring once the cash is in, out (and smoking) when it breaks
    const late = SK.clamp(g.fuse() / g.dur, 0, 1), roar = s.dealT ? SK.clamp((t - s.dealT) * 2, 0, 1) : 0;
    const fl = lost ? 0 : (roar ? 1 : 0.55 - 0.4 * late + 0.15 * Math.sin(t * 23) * Math.sin(t * 7));
    if (fl > 0) { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const fx = OVEN.x - 16 + i * 8, h = (14 + 18 * fl) * (0.7 + 0.3 * Math.sin(t * 13 + i * 2)); const gr = c.createRadialGradient(fx, OVEN.y + 36, 1, fx, OVEN.y + 36 - h * 0.5, h); gr.addColorStop(0, 'rgba(255,230,120,0.9)'); gr.addColorStop(1, 'rgba(255,90,30,0)'); c.fillStyle = gr; c.beginPath(); c.ellipse(fx, OVEN.y + 36 - h * 0.4, 7, h * 0.7, 0, 0, 7); c.fill(); } c.restore(); }
    // smoke from the chimney: grey and thick as the old oven fails
    const nP = lost ? 7 : roar ? 2 : 2 + Math.floor(late * 5);
    for (let i = 0; i < nP; i++) { const q = (t * 0.6 + i / nP) % 1; c.fillStyle = `rgba(${lost || !roar ? '90,80,90' : '255,250,240'},${0.45 * (1 - q)})`; c.beginPath(); c.arc(OVEN.x + Math.sin(q * 6 + i) * 10, OVEN.y - 96 - q * 90, 8 + q * 18, 0, 7); c.fill(); }
    if (lost) { const k = SK.clamp((t - g.doneAt) * 3, 0, 1); c.save(); c.translate(OVEN.x + 28, OVEN.y + 40); c.rotate(k * 1.3); c.fillStyle = '#5a5a66'; c.fillRect(-56, -4, 56, 8); c.restore();
      for (let i = 0; i < 4; i++) { const a = t * 2 + i * 1.6; c.fillStyle = 'rgba(70,60,70,0.5)'; c.beginPath(); c.arc(OVEN.x + Math.cos(a) * 30, OVEN.y + 10 + Math.sin(a) * 14, 14, 0, 7); c.fill(); } }
    // the pie: slices for the founders, plus each slice that has gone in (opening up as it squeezes the others)
    const fIn = s.items.map(it => it.in ? it.f * SK.easeOut((t - it.in) / 0.5) : 0), rest = 1 - fIn.reduce((a, b) => a + b, 0);
    const icon = who => (c2, x, y) => SK.animal(c2, who, x, y + 13, 0.46, { t, expr: won ? 'laugh' : 'happy', noShadow: true });
    const slices = [];
    s.items.forEach((it, i) => slices.push({ f: fIn[i], col: COL[it.who], draw: fIn[i] > 0.12 ? icon(it.who) : null }));
    slices.push({ f: rest / 2, col: COL.beaver, draw: icon('beaver') }, { f: rest / 2, col: COL.rabbit, draw: icon('rabbit') });
    B8.pie(c, PIE.x, PIE.y, s.r, slices);
    // a dashed ghost of the rabbit's old slice, on the old small pie: thinner now, but on a bigger pie
    const in0 = s.items[0].in; if (in0) { const a0 = Math.PI / 2; c.save(); c.globalAlpha = SK.clamp((t - in0) * 2, 0, 0.9); c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.setLineDash([7, 6]); c.beginPath(); c.moveTo(PIE.x, PIE.y); c.arc(PIE.x, PIE.y, PIE.r, a0, a0 + Math.PI); c.closePath(); c.stroke(); c.restore(); }
    // coins tumbling from the cash bag into the pie
    for (const it of s.items) if (it.in) for (let i = 0; i < 5; i++) { const q = (t - it.in) * 1.8 - i * 0.12; if (q > 0 && q < 1) B8.coin(c, SK.lerp(it.ax, PIE.x + (i - 2) * 12, q), SK.lerp(it.ay - 30, PIE.y, q) - Math.sin(q * Math.PI) * 90, 10, q * 9); }
    // the animals: the founders in front, the fox investor with its cash, the owl with the staff pool (level 2)
    SK.animal(c, 'rabbit', 132, 606, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
    SK.animal(c, 'beaver', 212, 606, 1.0, { t, phase: 1, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    for (const it of s.items) if (it.show && t > it.show) { const k = SK.easeOut((t - it.show) / 0.35), ox = (1 - k) * 90 * -it.face;
      SK.animal(c, it.who, it.ax + ox, it.ay, it.ay < 500 ? 0.8 : 0.95, { t, phase: it.ax, pose: won ? 'cheer' : k < 1 ? 'walk' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy', facing: it.face });
      if (!it.in) B8.cashBag(c, it.ax + ox + it.face * -26, it.ay - 28, it.ay < 500 ? 0.6 : 0.8); }
    // the loose slices (in the animals' paws, or in your hand)
    for (const it of s.items) if (!it.in && it.show && t > it.show + 0.2) {
      const da = it.f * Math.PI * 2, rr = PIE.r * 0.95, a0 = -Math.PI / 2 - da / 2; // pointing down, apex up
      wedge(c, it.x, it.y - rr * 0.55, rr, a0 + Math.PI, da, COL[it.who]);
      if (!SK.dragging(g)) SK.glow(c, g, it.x, it.y, 40);
    }
    const first = s.items.find(i => !i.in && i.show && t > i.show + 0.3);
    SK.tag(c, 'Company', PIE.x, PIE.y - s.r - 20, 18); SK.tag(c, 'Founders', 172, 512, 18);
    for (const it of s.items) if (!it.in && it.show && t > it.show + 0.2) SK.tag(c, it.who === 'turtle' ? 'Staff pool' : 'Investor', it.hx, it.hy - 66, 18);
    if (first) SK.demo(g, c, 'drag', [first.x, first.y], [PIE.x + 10, PIE.y], { delay: 0.7 });
  },
  auto(g, dt, synth) {
    const s = g.s; s.items.forEach((it, i) => { if (it.show && g.t > it.show + 0.32) SK.bot.drag(g, synth, 'd' + i, Math.max(1.0, it.show + 0.35), [it.hx, it.hy], [PIE.x, PIE.y], 0.4); });
  },
});
