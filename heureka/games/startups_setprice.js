// SET THE PRICE! (business EL-17) — the duck's lemonade stand, a price dial whose needle swings from cheap (left) to
// pricey (right), a coin jar with a line, and a crowd waiting down the street. Tap to stop the needle: that is today's
// price. The crowd decides: at a low price everyone buys but each cup brings one coin; at a high price each cup brings
// many coins but most walk past. The middle fills the jar most. Fill the jar to the line in two days (three at level 2).
// Level 2: lemons cost money too, so each cup's lemons are paid out of the jar first and the best price moves up.
const DIAL = { x: 180, y: 262, r: 96 }, JAR = { x: 300, y0: 318, y1: 480, w: 84 }, NK = 7;
const CROWDS = [[10, 9, 7, 6, 4, 2, 1], [10, 10, 9, 8, 5, 2, 1], [10, 9, 8, 6, 5, 4, 2], [10, 8, 5, 3, 2, 1, 0]]; // buyers at price 1..7 coins a cup: four different crowds, so the best price moves
const KINDS = ['frog', 'rabbit', 'penguin', 'bird', 'turtle', 'fox', 'beaver', 'hedgehog', 'owl', 'ant'];
const LVP = [{ days: 2, need: 42, per: 2.4, cost: 0 }, { days: 2, need: 44, per: 1.9, cost: 0 }, { days: 3, need: 30, per: 1.7, cost: 2 }];
const CROWD = i => [24 + (i % 5) * 70 + (i >= 5 ? 35 : 0) * 0, 548 + (i >= 5 ? 50 : 0)];
function paintStreet(o) {
  const sky = o.createLinearGradient(0, 0, 0, 420); sky.addColorStop(0, '#ff9ac0'); sky.addColorStop(0.6, '#ffc890'); sky.addColorStop(1, '#fff2d0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  P.hills(o, 360, 420, 40, '#b8d870', '#80a848', { seed: 9 }); P.tree(o, 340, 420, 0.9, '#6a9a4a', 2);
  const gr = o.createLinearGradient(0, 470, 0, 640); gr.addColorStop(0, '#e0c8a0'); gr.addColorStop(1, '#c8a878'); o.fillStyle = gr; o.fillRect(0, 470, 360, 170);
  o.fillStyle = 'rgba(255,255,255,0.25)'; for (let x = 0; x < 360; x += 48) o.fillRect(x, 520, 28, 4);
  // the stand: striped roof, posts and a counter with a lemon on it
  o.fillStyle = '#c8905a'; o.fillRect(36, 368, 8, 104); o.fillRect(216, 368, 8, 104);
  for (let i = 0; i < 6; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#f5c23a'; o.beginPath(); o.moveTo(28 + i * 34, 352); o.lineTo(62 + i * 34, 352); o.lineTo(62 + i * 34, 376); o.quadraticCurveTo(45 + i * 34, 388, 28 + i * 34, 376); o.closePath(); o.fill(); }
  o.fillStyle = '#e8a040'; o.fillRect(24, 344, 212, 10);
  o.fillStyle = '#f8e0a0'; o.fillRect(30, 420, 200, 56); o.fillStyle = '#e8c070'; o.fillRect(30, 420, 200, 8);
  o.fillStyle = '#f5d040'; o.beginPath(); o.ellipse(70, 452, 16, 12, 0.2, 0, 7); o.fill(); o.fillStyle = '#5ab050'; o.beginPath(); o.ellipse(80, 440, 6, 3, -0.5, 0, 7); o.fill();
  // the dial's face
  o.fillStyle = '#3a1640'; o.beginPath(); o.arc(DIAL.x, DIAL.y, DIAL.r + 10, Math.PI, 0); o.closePath(); o.fill();
  for (let k = 0; k < NK; k++) { const a0 = Math.PI + k * Math.PI / NK, a1 = a0 + Math.PI / NK; o.fillStyle = k % 2 ? '#f8e0b8' : '#f0c890'; /* neutral: no colour says cheap is good or bad */ o.beginPath(); o.moveTo(DIAL.x, DIAL.y); o.arc(DIAL.x, DIAL.y, DIAL.r, a0, a1); o.closePath(); o.fill(); o.strokeStyle = '#fff6ea'; o.lineWidth = 2; o.stroke(); }
  o.fillStyle = '#3a1640'; o.beginPath(); o.arc(DIAL.x, DIAL.y, 26, Math.PI, 0); o.closePath(); o.fill();
}
function cup(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(255,255,255,0.8)'; c.strokeStyle = '#8a6a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-8, -18); c.lineTo(8, -18); c.lineTo(6, 0); c.lineTo(-6, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#f8e050'; c.beginPath(); c.moveTo(-7, -13); c.lineTo(7, -13); c.lineTo(6, -1); c.lineTo(-6, -1); c.closePath(); c.fill(); c.restore(); }
MG.add({
  id: 'setprice', stage: 'startups', cmd: 'STOP THE DIAL AT A GOOD PRICE!', time: 6, mood: 'party', winText: 'Best price!', failText: 'Not enough sales!', hold: 1.6,
  card: { title: 'Not too high, not too low', kind: 'Business', ref: 'Pricing',
    text: 'A low price brings lots of buyers, but each cup earns only a little. A high price earns a lot per cup, but most people walk past. Somewhere in the middle, the money coming in is biggest.\n\nThe money from sales is called revenue. What matters in the end is profit: the money left after paying for the lemons and cups. When each cup costs more to make, the best price moves up, and selling too cheaply can even lose money.',
    note: 'The best price balances how many people buy against how much each one pays.' },
  init(g) {
    const s = g.s, L = LVP[Math.min(2, g.level)];
    s.buy = CROWDS[SK.variant(g, CROWDS.length)]; // a different crowd each play
    let best = 0; for (let k = 0; k < NK; k++) best = Math.max(best, s.buy[k] * (k + 1 - L.cost)); s.need = Math.round(L.days * best * [0.875, 0.917, 0.83][Math.min(2, g.level)]);
    s.L = L; s.day = 0; s.jar = 0; s.ph = g.rand() * 6.28; s.stop = null; s.hist = []; s.dayT = 0;
  },
  angle(g) { const s = g.s; return (0.5 - 0.5 * Math.cos((g.t - s.dayT) / s.L.per * Math.PI * 2 + s.ph)); }, // 0 = cheap .. 1 = pricey
  down(g) {
    const s = g.s; SK.touched(g); if (g.done || s.stop || g.t < 0.6) return;
    const a = this.angle(g), k = Math.min(NK - 1, Math.floor(a * NK)); s.stop = { t: g.t, a, k, buy: s.buy[k], earn: s.buy[k] * (k + 1 - s.L.cost) }; g.sfx('click'); g.sfx('ding');
  },
  update(g, dt) {
    const s = g.s, L = s.L, st = s.stop; if (!st || g.done) return;
    if (!st.paid && g.t > st.t + 0.9) { st.paid = true; s.jar = Math.max(0, s.jar + st.earn); s.hist.push(st.k); g.sfx(st.earn > 6 ? 'coin' : 'wrong');
      if (s.jar >= s.need) { g.win(); g.sfx('cheer'); g.burst(JAR.x, JAR.y0, ['#ffe27a', '#fff6ea', '#7ad070'], 22, 200); } else if (s.day + 1 >= L.days) { g.fail(); g.sfx('fail'); } }
    if (st.paid && !g.done && g.t > st.t + 1.6) { s.day++; s.stop = null; s.dayT = g.t; s.ph = g.rand() * 6.28; }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L, st = s.stop;
    c.drawImage(g.bake('b8price_s', paintStreet), 0, 0, 360, 640);
    // the prices that would keep the jar on track to reach its line in the days left: a green band round the dial
    const a = st ? st.a : this.angle(g), ang = Math.PI + a * Math.PI, k = st ? st.k : Math.min(NK - 1, Math.floor(a * NK));
    const perDay = (s.need - s.jar) / Math.max(1, L.days - s.day), good = kk => s.buy[kk] * (kk + 1 - L.cost) >= perDay - 0.01;
    if (!g.done) { c.save(); c.lineWidth = 9; c.lineCap = 'butt'; for (let kk = 0; kk < NK; kk++) if (good(kk)) { c.strokeStyle = '#5ad07a'; c.beginPath(); c.arc(DIAL.x, DIAL.y, DIAL.r + 5, Math.PI + kk * Math.PI / NK + 0.02, Math.PI + (kk + 1) * Math.PI / NK - 0.02); c.stroke(); } c.restore(); }
    c.save(); c.strokeStyle = !st && !g.done && good(k) ? '#9affb0' : '#fff6ea'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(DIAL.x, DIAL.y); c.lineTo(DIAL.x + Math.cos(ang) * (DIAL.r - 6), DIAL.y + Math.sin(ang) * (DIAL.r - 6)); c.stroke();
    c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.stroke(); c.restore();
    if (st) { c.save(); c.globalAlpha = 0.5 + 0.5 * Math.sin(t * 14); c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.arc(DIAL.x, DIAL.y, DIAL.r + 4, Math.PI + k * Math.PI / NK, Math.PI + (k + 1) * Math.PI / NK); c.stroke(); c.restore(); }
    B8.coin(c, DIAL.x - DIAL.r + 6, DIAL.y + 18, 9); for (let i = 0; i < 4; i++) B8.flatCoin(c, DIAL.x + DIAL.r - 8, DIAL.y + 24 - i * 5, 10, 0);
    // the duck behind the counter, and the price sign: today's price as a stack of coins
    SK.animal(c, 'duck', 150, 424, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : st && st.paid && st.earn > 15 ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : st && st.paid ? (st.earn > 15 ? 'laugh' : 'wow') : 'happy' });
    c.fillStyle = '#fff6ea'; c.strokeStyle = '#7a4a2a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(176, 384, 44, 74, 6); c.fill(); c.stroke();
    for (let i = 0; i <= k; i++) B8.flatCoin(c, 198, 448 - i * 8, 13, 0);
    for (let i = 0; i < 3; i++) cup(c, 118 + i * 18, 420, 0.9);
    // the jar and its line; level 2 shows the lemons' cost paid out of each day's takings
    const ly = JAR.y1 - 10 - s.need * 2.6, fill = JAR.y1 - 8 - s.jar * 2.6;
    const kNow = st ? st.k : k, earnNow = s.buy[kNow] * (kNow + 1 - L.cost); // what today would bring at this price, shown live
    B8.jarBack(c, JAR.x, JAR.y0, JAR.y1, JAR.w);
    for (let i = 0; i < Math.round(s.jar); i++) B8.flatCoin(c, JAR.x - 24 + (i % 4) * 16, JAR.y1 - 10 - Math.floor(i / 4) * 10.4, 10, ((i * 7) % 5 - 2) * 0.05);
    if (!st && !g.done) { const gy = Math.max(JAR.y0 + 10, JAR.y1 - 8 - (s.jar + Math.max(0, earnNow)) * 2.6); c.save(); c.fillStyle = 'rgba(245,194,58,0.35)'; c.fillRect(JAR.x - JAR.w / 2 + 4, gy, JAR.w - 8, fill - gy); c.strokeStyle = '#c08a14'; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(JAR.x - JAR.w / 2 + 4, gy); c.lineTo(JAR.x + JAR.w / 2 - 4, gy); c.stroke(); c.restore(); } // a ghost of today's takings at this price
    B8.jarFront(c, JAR.x, JAR.y0, JAR.y1, JAR.w);
    c.save(); c.strokeStyle = s.jar >= s.need ? '#5ad07a' : '#e8403a'; c.lineWidth = 4; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(JAR.x - JAR.w / 2 - 6, ly); c.lineTo(JAR.x + JAR.w / 2 + 6, ly); c.stroke(); c.restore();
    // the day markers (one sun per day)
    for (let d = 0; d < L.days; d++) { const x = JAR.x - (L.days - 1) * 14 + d * 28, y = JAR.y0 - 22; c.fillStyle = d < s.day || (d === s.day && st && st.paid) ? '#f5c23a' : 'rgba(255,255,255,0.5)'; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); c.strokeStyle = '#a8801a'; c.lineWidth = 2; c.stroke(); }
    // the crowd: buyers walk up for a cup and pay; the rest frown and turn away
    for (let i = 0; i < 10; i++) {
      const [x0, y0] = [26 + (i % 5) * 72 + (i >= 5 ? 36 : 0), 556 + (i >= 5 ? 48 : 0)], buys = st && i < st.buy, would = !st && i < s.buy[kNow], q = st ? SK.clamp((t - st.t) / 0.7, 0, 1) : 0;
      const x = buys ? SK.lerp(x0, 150 + (i % 4) * 12, q * 0.35) : x0, y = buys ? y0 - q * 30 : y0;
      SK.animal(c, KINDS[i], x, y, 0.62, { t, phase: i, pose: buys && q > 0.5 ? 'cheer' : st && !buys ? 'sad' : would ? 'wave' : 'idle', expr: buys || would ? 'happy' : st ? 'sad' : 'sad', facing: st && !buys ? 1 : -1, hold: buys && q > 0.7 ? (h => cup(h, 0, 4, 0.9)) : null });
      if (buys && q > 0.4 && q < 1) for (let j = 0; j <= Math.min(2, k); j++) { const qq = SK.clamp((q - 0.4) / 0.6 - j * 0.15, 0, 1); if (qq > 0 && qq < 1) B8.coin(c, SK.lerp(x, JAR.x, qq), SK.lerp(y - 40, JAR.y0, qq) - Math.sin(qq * Math.PI) * 60, 7, qq * 8); }
    }
    // level 2: lemons cost money too, paid out of the jar for every cup sold
    if (L.cost && st && t > st.t + 0.5 && t < st.t + 1.4) for (let j = 0; j < Math.min(6, st.buy); j++) { const qq = SK.clamp((t - st.t - 0.5) / 0.8 - j * 0.06, 0, 1); if (qq > 0 && qq < 1) { c.fillStyle = '#f5d040'; c.beginPath(); c.ellipse(SK.lerp(JAR.x, 70, qq), SK.lerp(JAR.y0 + 40, 452, qq) - Math.sin(qq * Math.PI) * 50, 8, 6, 0, 0, 7); c.fill(); } }
    if (!st && !g.done) SK.glow(c, g, DIAL.x, DIAL.y - 40, 60);
    SK.tag(c, 'Price', DIAL.x, DIAL.y + 20, 18); SK.tag(c, 'Money in', JAR.x, JAR.y1 + 20, 18); SK.tag(c, 'Buyers', 52, 506, 18); if (L.cost) SK.tag(c, 'Lemons cost', 70, 482, 18);
    if (!st) SK.demo(g, c, 'tap', [DIAL.x + 20, DIAL.y - 30], null, { delay: 0.8 });
  },
  auto(g, dt, synth) { // tap when the needle is in the best sector (the middle, or one to the right when lemons cost money)
    const s = g.s; if (s.stop || g.done || g.t < 0.8) return; let best = 0; for (let k = 1; k < NK; k++) if (s.buy[k] * (k + 1 - s.L.cost) > s.buy[best] * (best + 1 - s.L.cost)) best = k; const a = this.angle(g);
    if (Math.abs(a - (best + 0.5) / NK) < 0.03) { synth('down', 180, 300); synth('up', 180, 300); }
  },
});
