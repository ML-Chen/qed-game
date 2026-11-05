// DON'T MIX! (law LW-19) — the beaver's bakery sits inside a shining bubble (its LLC: the company is a separate person,
// and its debts bounce off the bubble). Customers at the counter toss their coins; slide the Bakery bank left and right
// to catch every coin. A coin you miss falls out through the bottom of the bubble into the owner's own pocket: the
// company's money and the owner's money mix, and the bubble cracks where it passed. Too many cracks and the bubble
// bursts: debt letters swoop through and land on the owner's house. Level 2: home bills (an envelope with a house) fall
// too; don't catch those in the Bakery bank (paying a home bill from the company's bank cracks the bubble just the same).
const TAU = Math.PI * 2;
const BC = [180, 334], BR = 170, BANK_Y = 452, CUST = [62, 136, 224, 298], HOUSE = [62, 584], OWNER = [290, 604];
const bubbleBottom = x => BC[1] + Math.sqrt(Math.max(0, BR * BR - (x - BC[0]) ** 2));
function paintBakery(o) {
  P.sky(o, 360, 640, ['#d8a878', '#f0d0a8', '#fff0d8']);
  P.hills(o, 360, 500, 16, '#c8b070', '#9a8048', { seed: 12 });
  const gr = o.createLinearGradient(0, 500, 0, 640); gr.addColorStop(0, '#b89a60'); gr.addColorStop(1, '#8a6a3a'); o.fillStyle = gr; o.fillRect(0, 498, 360, 142);
  // the bakery shop front (inside where the bubble will be)
  o.fillStyle = '#f8e8d0'; o.beginPath(); o.roundRect(46, 196, 268, 120, 8); o.fill(); o.strokeStyle = '#a87a4a'; o.lineWidth = 2; o.stroke();
  for (let i = 0; i < 9; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#e8563a'; o.beginPath(); o.moveTo(40 + i * 31, 196); o.lineTo(71 + i * 31, 196); o.lineTo(68 + i * 31, 222); o.quadraticCurveTo(55 + i * 31, 232, 43 + i * 31, 222); o.closePath(); o.fill(); }
  o.fillStyle = '#7a4a2a'; o.fillRect(36, 186, 288, 12);
  o.fillStyle = '#b8e0f0'; o.fillRect(64, 236, 232, 48); o.fillStyle = 'rgba(255,255,255,0.5)'; o.fillRect(70, 240, 40, 6);
  for (let i = 0; i < 6; i++) P.loaf(o, 86 + i * 38, 272, 0.8);
  o.fillStyle = '#c88a50'; o.fillRect(46, 300, 268, 16); o.fillStyle = '#e8aa68'; o.fillRect(46, 298, 268, 5);
  o.fillStyle = 'rgba(120,80,40,0.25)'; o.fillRect(40, 316, 280, 8);
  // the floor inside the shop, where the bank slides
  o.fillStyle = 'rgba(255,240,220,0.35)'; o.beginPath(); o.ellipse(180, BANK_Y + 26, 150, 18, 0, 0, TAU); o.fill();
  // the owner's house outside the bubble
  P.house(o, HOUSE[0] - 44, HOUSE[1], 88, 58, '#e8c89a', { door: '#7a4b2e' }); o.fillStyle = '#a8483a'; o.beginPath(); o.moveTo(HOUSE[0] - 52, HOUSE[1] - 56); o.lineTo(HOUSE[0], HOUSE[1] - 92); o.lineTo(HOUSE[0] + 52, HOUSE[1] - 56); o.closePath(); o.fill();
  P.grassTufts(o, 360, 510, 630, 20, '#7a8a40', 6);
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.25);
}
function bubble(c, t, health, cracks) {
  const R = BR * (1 + Math.sin(t * 2.4) * 0.006), [x, y] = BC; c.save();
  const gr = c.createRadialGradient(x - R * 0.3, y - R * 0.35, R * 0.1, x, y, R); gr.addColorStop(0, 'rgba(255,255,255,0.03)'); gr.addColorStop(0.82, `rgba(190,230,255,${0.06 + 0.08 * health})`); gr.addColorStop(0.95, `rgba(255,190,240,${0.12 + 0.25 * health})`); gr.addColorStop(1, `rgba(255,255,255,${0.2 + 0.4 * health})`);
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill();
  c.lineWidth = 2 + 3 * health; for (let i = 0; i < 6; i++) { c.strokeStyle = ['rgba(255,140,200,0.6)', 'rgba(140,220,255,0.6)', 'rgba(255,240,140,0.55)'][i % 3]; c.beginPath(); c.arc(x, y, R - 2, t * 0.5 + i * TAU / 6, t * 0.5 + i * TAU / 6 + 0.7); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(x - R * 0.48, y - R * 0.52, R * 0.14, R * 0.06, -0.7, 0, TAU); c.fill();
  for (const k of cracks) { c.strokeStyle = 'rgba(60,30,60,0.85)'; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(k.x, k.y); c.lineTo(k.x - 14, k.y - 18); c.lineTo(k.x - 6, k.y - 30); c.moveTo(k.x, k.y); c.lineTo(k.x + 12, k.y - 20); c.lineTo(k.x + 22, k.y - 24); c.moveTo(k.x + 12, k.y - 20); c.lineTo(k.x + 8, k.y - 36); c.stroke(); }
  c.restore();
}
function piggy(c, x, y, t, gulp) {
  c.save(); c.translate(x, y); const sq = 1 + gulp * 0.12; c.scale(sq, 1 / sq);
  c.fillStyle = 'rgba(40,20,20,0.25)'; c.beginPath(); c.ellipse(0, 26, 34, 6, 0, 0, TAU); c.fill();
  c.fillStyle = '#f08aa8'; c.strokeStyle = '#8a3a5a'; c.lineWidth = 2.5; for (const lx of [-18, 14]) { c.beginPath(); c.roundRect(lx, 12, 9, 14, 3); c.fill(); c.stroke(); }
  const g2 = c.createRadialGradient(-10, -8, 4, 0, 0, 36); g2.addColorStop(0, '#ffc8d8'); g2.addColorStop(1, '#e8789a'); c.fillStyle = g2; c.beginPath(); c.ellipse(0, 2, 34, 24, 0, 0, TAU); c.fill(); c.stroke();
  c.fillStyle = '#f8a0b8'; c.beginPath(); c.ellipse(32, 4, 8, 10, 0, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#8a3a5a'; c.beginPath(); c.arc(31, 1, 1.8, 0, TAU); c.arc(31, 7, 1.8, 0, TAU); c.fill();
  c.beginPath(); c.moveTo(14, -18); c.lineTo(22, -30); c.lineTo(24, -14); c.closePath(); c.fillStyle = '#f08aa8'; c.fill(); c.stroke();
  c.fillStyle = '#2a1424'; c.beginPath(); c.arc(18, -6, 2.6, 0, TAU); c.fill();
  c.fillStyle = '#5a1a3a'; c.beginPath(); c.roundRect(-12, -24, 22, 5, 2); c.fill();
  c.restore();
}
function homeBill(c, x, y, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.rect(-17, -12, 34, 24); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-17, -12); c.lineTo(0, 2); c.lineTo(17, -12); c.stroke();
  c.fillStyle = '#e8563a'; c.beginPath(); c.moveTo(-6, 9); c.lineTo(-6, 3); c.lineTo(0, -2); c.lineTo(6, 3); c.lineTo(6, 9); c.closePath(); c.fill(); c.restore(); }
function debt(c, x, y, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = '#ffe0e0'; c.strokeStyle = '#8a1a2a'; c.lineWidth = 2; c.beginPath(); c.rect(-15, -10, 30, 20); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-15, -10); c.lineTo(0, 2); c.lineTo(15, -10); c.stroke(); c.fillStyle = '#c8203a'; c.beginPath(); c.arc(0, 3, 5, 0, TAU); c.fill(); c.restore(); }
MG.add({
  id: 'dontmix', stage: 'law', cmd: 'CATCH COINS IN THE BAKERY BANK!', cmdAt: [null, null, 'BANK THE COINS, DODGE HOME BILLS!'], time: 7, mood: 'desert', winText: 'Shield stays strong!', failText: 'You mixed the money!',
  card: { title: 'Keep company money separate', kind: 'Law', ref: 'Piercing the corporate veil',
    text: 'The bubble is the bakery\'s LLC, a company that the law treats as a separate person. Its debts usually stop at the bubble and can\'t reach the owner\'s house.\n\nThat shield holds only if the owner treats the company as separate. Coins the bakery earns belong in the bakery\'s bank. When they slipped into the owner\'s pocket, or the bakery\'s bank paid a home bill, the two piles of money mixed. A court can then decide the company isn\'t really separate and let the bakery\'s debts reach the owner\'s house. Lawyers call this piercing the veil.\n\nGeneral information about US law, not legal advice.',
    note: 'An LLC protects the owner only while the company\'s money is kept apart from the owner\'s own money.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), n = [6, 7, 8][L], gap = [1.45, 1.1, 0.95][L], v = SK.variant(g, 4);
    s.vy = [130, 175, 210][L]; s.maxCracks = L ? 2 : 3; s.items = []; let last = v;
    for (let i = 0; i < n; i++) { let ci = Math.floor(g.rand() * 4); if (ci === last) ci = (ci + 1 + Math.floor(g.rand() * 3)) % 4; last = ci; s.items.push({ kind: 'coin', ci, t0: 1.6 + i * gap, st: 'wait' }); }
    if (L >= 2) for (const j of [2, 5]) { const ci = (s.items[j].ci + 2) % 4; s.items.splice(j, 0, { kind: 'bill', ci, t0: 0, st: 'wait' }); }
    s.items.forEach((it, i) => { it.t0 = i * gap; it.x = CUST[it.ci]; it.y = 276; });
    s.bank = { x: 180 + (CUST[s.items[0].ci] < 180 ? 70 : -70) }; s.cracks = []; s.caught = 0; s.gulp = -9; s.need = s.items.filter(i => i.kind === 'coin').length;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (s.start == null) s.start = Math.max(1.4, g.t + 0.45); s.drag = { ox: s.bank.x - x }; SK.dragStart(g, null, x, y); },
  move(g, x, y) { const s = g.s; if (!s.drag || g.done) return; SK.dragMove(g, x, y); s.bank.x = SK.clamp(x + s.drag.ox, 44, 316); },
  up(g) { g.s.drag = null; SK.dragEnd(g); },
  update(g, dt) {
    const s = g.s;
    for (const it of s.items) {
      if (it.st === 'wait' && s.start != null && g.t >= s.start + it.t0) { it.st = 'fall'; g.sfx(it.kind === 'coin' ? 'pop' : 'rustle'); }
      if (it.st === 'fall') { const y0 = it.y; it.y += s.vy * dt;
        if (y0 < BANK_Y - 18 && it.y >= BANK_Y - 18 && Math.abs(it.x - s.bank.x) < 38) {
          it.st = 'in'; s.gulp = g.t; if (it.kind === 'coin') { s.caught++; g.sfx('coin'); } else { g.sfx('wrong'); s.cracks.push({ x: it.x, y: bubbleBottom(it.x) - 4, t: g.t }); g.shake(3, 0.15); }
        } else if (it.y >= bubbleBottom(it.x) - 2 && !it.out) { it.out = true; if (it.kind === 'coin') { s.cracks.push({ x: it.x, y: bubbleBottom(it.x) - 4, t: g.t }); g.sfx('snap'); g.shake(3, 0.15); } it.st = 'out'; it.ot = g.t; it.ox = it.x; it.oy = it.y; } }
    }
    if (!g.done && s.cracks.length >= s.maxCracks) { if (!s.burst) { s.burst = g.t; g.sfx('snap'); g.sfx('fail'); g.burst(BC[0], BC[1], ['#ffd0f0', '#c8f0ff', '#fff6ea'], 30, 260); } if (g.t - s.burst > 1.0) { g.sfx('laugh'); g.fail(); } }
    if (!g.done && !s.burst && s.items.every(it => it.st === 'in' || it.st === 'out') && s.items.every(it => it.st !== 'out' || g.t - it.ot > 0.35)) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', health = 1 - s.cracks.length / s.maxCracks, bt = s.burst ? t - s.burst : 0;
    c.drawImage(g.bake('dontmix', paintBakery), 0, 0, 360, 640);
    // the customers at the counter, each tossing a coin in turn (they start once you take hold of the bank)
    CUST.forEach((x, i) => { const next = s.items.find(it => it.ci === i && it.st === 'wait'), toss = s.items.some(it => it.ci === i && it.st === 'fall' && it.y < 320); SK.animal(c, ['rabbit', 'duck', 'frog', 'penguin'][i], x, 326, 0.74, { t, phase: i, pose: toss ? 'hop' : won ? 'cheer' : 'idle', expr: lost ? 'wow' : 'happy', facing: x < 180 ? 1 : -1 }); void next; });
    // the owner, pocket open; and the owner's house
    SK.animal(c, 'beaver', OWNER[0], OWNER[1], 0.95, { t, pose: lost ? 'sad' : won ? 'cheer' : 'idle', expr: lost ? 'wow' : s.cracks.length ? 'think' : 'happy', facing: -1 });
    SK.tag(c, 'Owner', OWNER[0] + 22, 530, 18); SK.tag(c, 'Your house', HOUSE[0], 496, 18);
    // falling coins and bills; ones you missed drop out of the bubble into the owner's pocket
    for (const it of s.items) {
      let x = it.x, y = it.y; if (it.st === 'wait' || it.st === 'in') continue;
      if (it.st === 'out') { const k = SK.clamp((t - it.ot) / 0.35, 0, 1); if (k >= 1) continue; const tx = it.kind === 'coin' ? OWNER[0] - 20 : HOUSE[0], ty = it.kind === 'coin' ? OWNER[1] - 40 : HOUSE[1] - 30; x = SK.lerp(it.ox, tx, k); y = SK.lerp(it.oy, ty, k); }
      if (it.kind === 'coin') B8.coin(c, x, y, 15, t * 8 + it.ci); else { c.save(); c.translate(x, y); c.scale(1.3, 1.3); homeBill(c, 0, 0, Math.sin(t * 5 + it.ci) * 0.3); c.restore(); }
    }
    // the bakery's bank, which you slide
    piggy(c, s.bank.x, BANK_Y + 4, t, Math.max(0, 1 - (t - s.gulp) / 0.2));
    if (!s.caught) SK.tag(c, 'Bakery bank', s.bank.x, BANK_Y + 44, 18);
    // the bubble (thinner with every crack), or its burst and the debt letters swooping onto the house
    if (!s.burst) bubble(c, t, Math.max(0, health), s.cracks);
    else { for (let i = 0; i < 4; i++) { const k = SK.clamp((bt - i * 0.12) / 0.7, 0, 1); if (k <= 0) continue; const x0 = 60 + i * 80, y0 = 120; debt(c, SK.lerp(x0, HOUSE[0] - 20 + i * 12, SK.easeInOut(k)), SK.lerp(y0, HOUSE[1] - 50 - i * 6, SK.easeInOut(k)) - Math.sin(k * Math.PI) * 40, Math.sin(t * 8 + i) * 0.3); } if (bt > 0.3) SK.tag(c, 'Debts', HOUSE[0] + 50, HOUSE[1] - 140, 18, '#ffd0d0'); }
    SK.tag(c, 'LLC', BC[0], BC[1] - BR + 18, 18, '#e8f8ff', 'rgba(40,60,120,0.6)');
    G2.count(c, 64, 44, s.caught, s.need);
    // guidance: slide the bank under the next coin (and away from a home bill)
    const next = !g.done && !s.burst ? s.items.find(it => (it.st === 'fall' || it.st === 'wait') && it.kind === 'coin') : null, bill = s.items.find(it => it.st === 'fall' && it.kind === 'bill');
    let tx = next ? next.x : s.bank.x; if (bill && Math.abs(tx - bill.x) < 50 && (!next || next.y < bill.y - 40 || next.st === 'wait')) tx = bill.x + (bill.x < 180 ? 110 : -110);
    if (next && Math.abs(tx - s.bank.x) > 20) { SK.grab(c, g, s.bank.x, BANK_Y, 40); SK.target(c, g, tx, BANK_Y, 34); SK.arrow(c, g, s.bank.x, BANK_Y, tx, BANK_Y); SK.demo(g, c, 'drag', [s.bank.x, BANK_Y], [tx, BANK_Y], { delay: 1.0 }); }
    else SK.demo(g, c, 'drag', [0, 0], [1, 1], { never: true });
  },
  // the bot keeps its finger down and slides the bank under each coin as it falls (away from home bills)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0) return; const next = s.items.find(it => (it.st === 'fall' || it.st === 'wait') && it.kind === 'coin'), bill = s.items.find(it => it.st === 'fall' && it.kind === 'bill' && it.y < BANK_Y);
    let tx = next ? next.x : s.bank.x; if (bill && Math.abs(tx - bill.x) < 50 && (!next || next.st === 'wait' || next.y < bill.y)) tx = bill.x + (bill.x < 180 ? 110 : -110);
    if (!s._bd) { s._bd = 1; synth('down', s.bank.x, BANK_Y); return; }
    const cur = s.bank.x, step = Math.sign(tx - cur) * Math.min(Math.abs(tx - cur), 520 * dt); synth('move', cur - (s.drag ? s.drag.ox : 0) + step, BANK_Y);
  },
});
