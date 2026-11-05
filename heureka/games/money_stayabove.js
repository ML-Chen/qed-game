// STAY ABOVE! (business PF-11) — your bank account is a glass tank with a duck floating on the water; a red floor line
// sits near the bottom. A phone bill hangs off the drain tap and slowly drips money out. Groceries roll past on the
// checkout belt, each with its price as a stack of coins. Tap groceries into the cart until it is full, and keep the
// water above the floor after the bill has had its share: a dashed line shows where the water will be once the bill
// is paid. Dip below and the fee shark bites off a chunk and the duck sits in the mud (an overdraft fee).
// Level 2: a second bill appears behind the first.
const TANK = { x: 276, y0: 262, y1: 560, w: 116 }, FLOORY = 520, COINH = 26, BELT = 196, CART = { x: 124, y: 566 };
const GOODS = { bread: 1, milk: 1, carrots: 1, cake: 3, gift: 3, cheese: 2 };
const LVS = [
  { budget: 8.4, bills: [2], need: 4, speed: 90 },
  { budget: 7.4, bills: [2], need: 4, speed: 105 },
  { budget: 8.4, bills: [2, 2], need: 4, speed: 120 },
];
function paintShop(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#f0b080'); w.addColorStop(0.5, '#f8d0a8'); w.addColorStop(1, '#fff0dc'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  o.fillStyle = 'rgba(255,255,255,0.18)'; for (let y = 130; y < 640; y += 40) o.fillRect(0, y, 360, 2);
  // shelves in the back
  for (const sy of [150, 330, 430]) { o.fillStyle = '#c88a50'; o.fillRect(0, sy, 200, 8); const rnd = P.rng(sy); for (let i = 0; i < 9; i++) { o.fillStyle = ['#e8566a', '#5aa8e8', '#f5c23a', '#7ac870'][i % 4]; o.globalAlpha = 0.5; o.fillRect(6 + i * 21, sy - 22 - rnd() * 8, 16, 22 + rnd() * 8); o.globalAlpha = 1; } }
  // the checkout belt
  o.fillStyle = '#4a4a5a'; o.beginPath(); o.roundRect(-10, BELT + 4, 380, 26, 13); o.fill(); o.fillStyle = '#6a6a7a'; o.fillRect(0, BELT + 6, 360, 6);
  o.fillStyle = '#8a8a9a'; o.fillRect(0, BELT + 30, 360, 10);
  // the floor
  o.fillStyle = '#d8c0a8'; o.fillRect(0, 590, 360, 50);
}
function good(c, kind, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (kind === 'bread') P.loaf(c, 0, -8, 1.3);
  if (kind === 'milk') { c.fillStyle = '#fff'; c.strokeStyle = '#5a6a8a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-10, 0); c.lineTo(-10, -26); c.lineTo(0, -34); c.lineTo(10, -26); c.lineTo(10, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#5aa8e8'; c.fillRect(-10, -18, 20, 8); }
  if (kind === 'carrots') { for (let i = 0; i < 3; i++) { c.save(); c.translate(-8 + i * 8, -4); c.rotate(-0.3 + i * 0.3); c.fillStyle = '#f08a30'; c.beginPath(); c.moveTo(-4, -22); c.lineTo(4, -22); c.lineTo(0, 2); c.closePath(); c.fill(); c.fillStyle = '#5ab050'; c.beginPath(); c.ellipse(0, -26, 3, 6, 0, 0, 7); c.fill(); c.restore(); } }
  if (kind === 'cheese') { c.fillStyle = '#f8d040'; c.strokeStyle = '#a8801a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-16, 0); c.lineTo(16, 0); c.lineTo(16, -16); c.lineTo(-16, -26); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#e0b020'; c.beginPath(); c.arc(-4, -8, 3, 0, 7); c.arc(8, -6, 2.5, 0, 7); c.fill(); }
  if (kind === 'cake') { c.fillStyle = '#f8c8d8'; c.strokeStyle = '#a84a6a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-22, -20, 44, 20, 4); c.fill(); c.stroke(); c.fillStyle = '#fff0f4'; c.beginPath(); c.roundRect(-16, -38, 32, 18, 4); c.fill(); c.stroke(); c.fillStyle = '#e8403a'; c.beginPath(); c.arc(0, -42, 5, 0, 7); c.fill(); for (let i = 0; i < 3; i++) { c.fillStyle = '#f5c23a'; c.fillRect(-12 + i * 10, -50, 3, 10); } }
  if (kind === 'gift') { c.fillStyle = '#9a5ad0'; c.strokeStyle = '#4a1a70'; c.lineWidth = 2; c.beginPath(); c.roundRect(-22, -40, 44, 40, 4); c.fill(); c.stroke(); c.fillStyle = '#f5c23a'; c.fillRect(-4, -40, 8, 40); c.fillRect(-22, -24, 44, 8); c.beginPath(); c.ellipse(-8, -44, 9, 5, -0.4, 0, 7); c.ellipse(8, -44, 9, 5, 0.4, 0, 7); c.fill(); }
  c.restore();
}
const BILLS = ['Phone bill', 'Power bill', 'Water bill', 'Internet bill'];
function billIcon(c, k, x, y) {
  c.save(); c.translate(x, y); c.fillStyle = '#3a1640';
  if (k === 0) { c.beginPath(); c.roundRect(-5, -9, 10, 18, 3); c.fill(); c.fillStyle = '#8ad0ff'; c.fillRect(-3, -6, 6, 10); }
  if (k === 1) { c.fillStyle = '#f5c23a'; c.beginPath(); c.moveTo(2, -10); c.lineTo(-6, 2); c.lineTo(0, 2); c.lineTo(-2, 10); c.lineTo(6, -2); c.lineTo(0, -2); c.closePath(); c.fill(); c.strokeStyle = '#7a4a10'; c.lineWidth = 1; c.stroke(); }
  if (k === 2) { c.fillStyle = '#4ab0e0'; c.beginPath(); c.moveTo(0, -10); c.quadraticCurveTo(8, 2, 0, 8); c.quadraticCurveTo(-8, 2, 0, -10); c.fill(); }
  if (k === 3) { c.strokeStyle = '#3a1640'; c.lineWidth = 2; for (let r = 3; r <= 9; r += 3) { c.beginPath(); c.arc(0, 6, r, -2.4, -0.74); c.stroke(); } c.beginPath(); c.arc(0, 6, 1.6, 0, 7); c.fill(); }
  c.restore();
}
function coinStack(c, x, y, n) { c.fillStyle = 'rgba(255,246,234,0.85)'; c.beginPath(); c.roundRect(x - 19, y - n * 7 - 8, 38, n * 7 + 18, 9); c.fill(); for (let i = 0; i < n; i++) B8.flatCoin(c, x, y - i * 8, 15, 0); }
function cart(c, x, y, items, t) {
  c.save(); c.translate(x, y);
  c.strokeStyle = '#5a5a6a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(58, -64); c.lineTo(76, -84); c.stroke();
  c.fillStyle = 'rgba(200,210,230,0.5)'; c.strokeStyle = '#5a5a6a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-60, -70); c.lineTo(60, -70); c.lineTo(48, -10); c.lineTo(-48, -10); c.closePath(); c.fill(); c.stroke();
  for (let i = items.length; i < 4; i++) { c.save(); c.strokeStyle = 'rgba(90,90,106,0.7)'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.roundRect(-46 + i * 24, -50, 20, 34, 5); c.stroke(); c.restore(); } // empty spots to fill
  items.forEach((k, i) => good(c, k, -36 + (i % 4) * 24, -24 - Math.floor(i / 4) * 16, 1.0));
  c.strokeStyle = 'rgba(90,90,106,0.6)'; c.lineWidth = 2; for (let i = -40; i <= 40; i += 16) { c.beginPath(); c.moveTo(i, -68); c.lineTo(i * 0.8, -12); c.stroke(); }
  for (const wx of [-36, 36]) { c.fillStyle = '#2a2430'; c.beginPath(); c.arc(wx, 0, 9, 0, 7); c.fill(); }
  c.restore();
}
MG.add({
  id: 'stayabove', stage: 'money', cmd: 'BUY 4 THINGS, NO OVERDRAFT!', time: 6, mood: 'bright', winText: 'No fee!', failText: 'Overdraft fee!', hold: 1.7,
  card: { title: 'Don\'t spend money that\'s already promised', kind: 'Money', ref: 'Overdraft fees',
    text: 'Your bank account is the tank. Each thing you buy takes money out, and so does a bill that is still being paid. The phone bill drains slowly, but that money is already spoken for.\n\nIf you spend more than the account holds, it goes below zero. That is an overdraft. Many banks then charge a fee, often around 25 to 35 dollars in the United States, sometimes once for each payment.\n\nBefore you buy, check what is left after the bills you know are coming.',
    note: 'Count the bills still waiting before you spend, so your account never goes below zero.' },
  init(g) {
    const s = g.s, L = LVS[Math.min(2, g.level)];
    s.bill = SK.variant(g, BILLS.length); // which bill is still being paid (a new one each play)
    s.L = L; s.lev = FLOORY - L.budget * COINH; // the waterline (y; smaller = more money)
    s.bills = L.bills.map((b, i) => ({ left: b, rate: b / 5, show: i ? 2.2 : 0 })); // coins still to drain; level 2's second bill appears later
    s.belt = []; s.nextK = 0; s.spawn = 0.2; s.cart = []; s.flying = []; s.feeT = 0; s.okT = 0;
    // a shuffled stream of goods: cheap ones and pricey ones
    const base = ['bread', 'cake', 'milk', 'carrots', 'cheese', 'bread', 'gift', 'milk', 'carrots', 'bread'];
    s.seq = base.map(k => [k, g.rand()]).sort((a, b) => a[1] - b[1]).map(a => a[0]); if (GOODS[s.seq[0]] > 1) s.seq.push(s.seq.shift());
  },
  pending(g) { return g.s.bills.reduce((a, b) => a + (g.t >= b.show ? b.left : 0), 0); },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.cart.length + s.flying.length >= s.L.need) return;
    const it = SK.pick(s.belt.filter(b => !b.gone), x, y + 24, 44); if (!it) return;
    it.gone = true; s.flying.push({ k: it.k, x: it.x, y: it.y, t: g.t }); s.lev += GOODS[it.k] * COINH; g.sfx('coin'); g.sfx('pop');
    g.burst(TANK.x, s.lev, ['#ffe27a', '#fff6ea'], 6 * GOODS[it.k], 120);
  },
  update(g, dt) {
    const s = g.s, L = s.L;
    // the belt rolls on, bringing goods from the left
    if (g.t >= s.spawn) { s.belt.push({ k: s.seq[s.nextK++ % s.seq.length], x: -30, y: BELT, gone: false }); s.spawn = g.t + 84 / L.speed; }
    for (const b of s.belt) b.x += L.speed * dt; s.belt = s.belt.filter(b => b.x < 400);
    for (const f of s.flying) if (!f.done && g.t > f.t + 0.45) { f.done = true; s.cart.push(f.k); }
    s.flying = s.flying.filter(f => !f.done);
    if (g.done && g.result === 'win') return;
    // the bills drain
    for (const b of s.bills) if (g.t >= b.show && b.left > 0) { const d = Math.min(b.left, b.rate * dt); b.left -= d; s.lev += d * COINH; }
    if (!s.feeT && s.lev > FLOORY) { s.feeT = g.t; s.lev += COINH * 1.2; g.sfx('crunch'); g.sfx('splash'); g.shake(5, 0.3); g.fail(); }
    // the cart is full and the money left covers the bills: done
    if (!g.done && s.cart.length >= L.need && s.lev + this.pending(g) * COINH <= FLOORY && s.bills.every(b => g.t >= b.show || L.bills.length < 2)) { s.okT = g.t; g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L;
    c.drawImage(g.bake('b8stay_s', paintShop), 0, 0, 360, 640);
    // the belt's goods with their price tags
    for (const b of s.belt) if (!b.gone) { good(c, b.k, b.x, b.y + 2, 1.35); coinStack(c, b.x, b.y - 80, GOODS[b.k]); }
    // the bank tank
    B8.jarBack(c, TANK.x, TANK.y0, TANK.y1, TANK.w);
    const lev = Math.min(TANK.y1 - 4, s.lev);
    c.save(); c.beginPath(); c.roundRect(TANK.x - TANK.w / 2 + 2, TANK.y0 + 10, TANK.w - 4, TANK.y1 - TANK.y0 - 12, [8, 8, 20, 20]); c.clip();
    c.fillStyle = 'rgba(232,64,58,0.12)'; c.fillRect(TANK.x - 60, FLOORY, 120, TANK.y1 - FLOORY); // below zero: empty
    if (lev < FLOORY) { c.save(); c.beginPath(); c.rect(TANK.x - 60, 0, 120, FLOORY); c.clip(); B8.waterFill(c, TANK.x - 60, TANK.x + 60, lev, FLOORY + 10, t, '#e8b030'); for (let y = FLOORY - 8, r = 0; y > lev + 6; y -= 13, r++) for (let i = 0; i < 4; i++) B8.flatCoin(c, TANK.x - 39 + i * 26 + (r % 2) * 6, y, 12, 0); c.restore(); } // the money in the account, as coins
    else { c.fillStyle = 'rgba(200,40,40,0.55)'; c.fillRect(TANK.x - 60, FLOORY, 120, Math.min(TANK.y1, s.lev) - FLOORY); } // below zero: money owed
    c.restore();
    B8.jarFront(c, TANK.x, TANK.y0, TANK.y1, TANK.w);
    // the floor line, and the dashed line where the water will be once the bills are paid
    c.save(); c.strokeStyle = '#e8403a'; c.lineWidth = 4; c.beginPath(); c.moveTo(TANK.x - TANK.w / 2 - 8, FLOORY); c.lineTo(TANK.x + TANK.w / 2 + 8, FLOORY); c.stroke();
    const after = s.lev + this.pending(g) * COINH;
    if (!g.done && this.pending(g) > 0.05) { c.strokeStyle = after > FLOORY ? '#e8403a' : '#3a1640'; c.globalAlpha = 0.7 + 0.3 * Math.sin(t * 6); c.lineWidth = 3; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(TANK.x - TANK.w / 2 + 6, Math.min(TANK.y1 - 4, after)); c.lineTo(TANK.x + TANK.w / 2 - 6, Math.min(TANK.y1 - 4, after)); c.stroke(); }
    c.restore();
    // the fee shark bites a chunk out
    if (s.feeT) { const k = SK.clamp((t - s.feeT) * 3, 0, 1); c.save(); c.translate(TANK.x + TANK.w / 2 + 20 - k * 30, TANK.y1 - 50); c.fillStyle = '#6a7a8a'; c.strokeStyle = '#2a3a4a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 34, 18, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(4, -16); c.lineTo(16, -34); c.lineTo(20, -14); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-30 + i * 7, 4); c.lineTo(-27 + i * 7, 11); c.lineTo(-24 + i * 7, 4); c.fill(); } c.fillStyle = '#2a1424'; c.beginPath(); c.arc(-14, -5, 3, 0, 7); c.fill(); c.restore(); }
    // the bills hanging off the drain tap, dripping
    c.fillStyle = '#7a8a9a'; c.fillRect(TANK.x - 10, TANK.y1 - 2, 20, 14);
    s.bills.forEach((b, i) => { if (t < b.show) return; const k = SK.clamp((t - b.show) * 3, 0, 1), bx = TANK.x - 66 + i * 40, by = TANK.y1 + 34;
      c.save(); c.globalAlpha = k; c.translate(bx, by); c.scale(1.4, 1.4); c.translate(-bx, -by); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.roundRect(bx - 16, by - 12, 32, 24, 4); c.fill(); c.stroke();
      billIcon(c, s.bill, bx, by);
      if (b.left > 0.02 && !g.done) { const q = (t * 2.5 + i * 0.4) % 1; c.fillStyle = '#4ab0e0'; c.beginPath(); c.arc(TANK.x, TANK.y1 + 14 + q * 10, 3, 0, 7); c.fill(); } c.restore(); });
    // the cart, and goods hopping into it
    cart(c, CART.x, CART.y, s.cart, t);
    for (const f of s.flying) { const q = SK.clamp((t - f.t) / 0.45, 0, 1); good(c, f.k, SK.lerp(f.x, CART.x, q), SK.lerp(f.y, CART.y - 36, q) - Math.sin(q * Math.PI) * 70, 1 - q * 0.25); }
    // you: the rabbit pushing the cart
    SK.animal(c, 'rabbit', 40, 604, 0.95, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    SK.tag(c, 'Bank balance', TANK.x, TANK.y0 + 34, 18); if (!g.done && this.pending(g) > 0.05) SK.tag(c, 'After bills', TANK.x - 14, Math.min(TANK.y1 - 20, after) - 16, 18, '#fff6ea', after > FLOORY ? 'rgba(190,40,40,0.88)' : 'rgba(30,14,36,0.72)'); SK.tag(c, 'Zero', TANK.x + 26, FLOORY - 16, 18, '#fff6ea', 'rgba(190,40,40,0.85)');
    SK.tag(c, BILLS[s.bill], TANK.x - 122, TANK.y1 + 34, 18); if (s.feeT) SK.tag(c, 'Overdraft fee', TANK.x - 10, TANK.y1 - 96, 20, '#fff6ea', 'rgba(190,40,40,0.9)');
    // guidance: tap a cheap item as it rolls past
    const cheap = s.belt.find(b => !b.gone && GOODS[b.k] === 1 && b.x > 40 && b.x < 300);
    if (cheap && s.cart.length + s.flying.length < L.need && !g.done) { SK.glow(c, g, cheap.x, cheap.y - 22, 34); SK.demo(g, c, 'tap', [cheap.x, cheap.y - 20], null, { delay: 0.6 }); }
  },
  auto(g, dt, synth) { // tap cheap goods (1 coin) when they are mid-belt
    const s = g.s; const B = s._b8 = s._b8 || { next: 0.8 }; if (g.t < B.next || g.done) return;
    const it = s.belt.find(b => !b.gone && GOODS[b.k] === 1 && b.x > 30 && b.x < 330); if (it) { synth('down', it.x, it.y - 20); synth('up', it.x, it.y - 20); B.next = g.t + 0.15; }
  },
});
