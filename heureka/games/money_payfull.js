// PAY IT ALL BEFORE IT'S DUE! (business PF-19) — pay the credit card in full. A calendar page counts the days of the
// month toward the due date, where the interest gremlin waits. The card bill is a box of red coins you owe; your bank
// account is a jar of gold coins. Each tap on Pay sends one coin from the bank to the card and cancels one red coin.
// Cancel them all before the day marker reaches the due date and the gremlin shrinks away (no interest). Leave some and
// it hops onto what is left, chews, and the red pile grows (interest on the unpaid part).
// Two months (three at level 2); next month's shopping lands on the card first. The days run faster at higher levels.
(() => {
  const CAL = { x: 36, y: 128, cw: 48, ch: 30, cols: 6 }, BANK = { x: 92, y0: 336, y1: 512, w: 104 }, CARD = { x: 268, y0: 336, y1: 512, w: 120 }, BTN = { x: 180, y: 572, w: 220, h: 60 };
  const LV = [{ owe: [4, 5], days: 6.5 }, { owe: [5, 6], days: 5.2 }, { owe: [5, 6, 6], days: 4.6 }];
  const SHOP = [['shirt', 'game', 'pizza'], ['shoes', 'book', 'pizza'], ['game', 'shoes', 'shirt'], ['book', 'shirt', 'game']];
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#a8d8a0', '#d8f0c8', '#fffbe0']);
    o.fillStyle = 'rgba(255,255,255,0.4)'; for (let x = 0; x < 360; x += 24) o.fillRect(x, 0, 12, 640);
    N6.vgrad(o, 0, 520, 360, 120, ['#c8a878', '#a88858']); o.fillStyle = '#e0c898'; o.fillRect(0, 518, 360, 5);
    // the calendar page
    o.fillStyle = 'rgba(30,20,40,0.2)'; o.beginPath(); o.roundRect(CAL.x - 6, CAL.y - 4, CAL.cw * CAL.cols + 16, CAL.ch * 5 + 26, 10); o.fill();
    o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(CAL.x - 10, CAL.y - 10, CAL.cw * CAL.cols + 20, CAL.ch * 5 + 24, 10); o.fill(); o.strokeStyle = '#8a6a4a'; o.lineWidth = 2; o.stroke();
    o.fillStyle = '#e8563a'; o.fillRect(CAL.x - 10, CAL.y - 10, CAL.cw * CAL.cols + 20, 8);
    for (let d = 0; d < 30; d++) { const cx = CAL.x + (d % CAL.cols) * CAL.cw, cy = CAL.y + Math.floor(d / CAL.cols) * CAL.ch; o.strokeStyle = '#d8c8b0'; o.lineWidth = 1; o.strokeRect(cx, cy, CAL.cw, CAL.ch); o.fillStyle = '#8a7a6a'; o.font = '800 11px Nunito, system-ui, sans-serif'; o.fillText('' + (d + 1), cx + 4, cy + 12); }
  }
  function cell(d) { return [CAL.x + (d % CAL.cols) * CAL.cw + CAL.cw / 2, CAL.y + Math.floor(d / CAL.cols) * CAL.ch + CAL.ch / 2]; }
  function gremlin(c, x, y, s, t, chew) { // a little green fuzzball with big teeth
    if (s <= 0.02) return; c.save(); c.translate(x, y); c.scale(s, s); const b = chew ? Math.sin(t * 20) * 2 : Math.sin(t * 4) * 1.5;
    c.fillStyle = '#5ab84a'; c.strokeStyle = '#2a5a20'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28, r = i % 2 ? 16 : 19; c.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.9 + b); } c.closePath(); c.fill(); c.stroke();
    for (const ex of [-6, 6]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(ex, -4 + b, 5, 0, 7); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(ex + 1, -3 + b, 2.4, 0, 7); c.fill(); }
    c.fillStyle = '#2a1424'; c.beginPath(); c.ellipse(0, 7 + b, 8, chew ? 5 + Math.abs(Math.sin(t * 20)) * 3 : 3, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; for (const tx of [-4, 1]) c.fillRect(tx, 4 + b, 3, 4);
    c.strokeStyle = '#2a5a20'; c.beginPath(); c.moveTo(-8, -16 + b); c.lineTo(-12, -24 + b); c.moveTo(8, -16 + b); c.lineTo(12, -24 + b); c.stroke(); c.restore();
  }
  function shopIcon(c, k, x, y) { c.save(); c.translate(x, y); c.strokeStyle = '#3a1640'; c.lineWidth = 2;
    if (k === 'shirt') { c.fillStyle = '#5aa8e8'; c.beginPath(); c.moveTo(-14, -10); c.lineTo(-6, -14); c.lineTo(6, -14); c.lineTo(14, -10); c.lineTo(10, -4); c.lineTo(8, -6); c.lineTo(8, 12); c.lineTo(-8, 12); c.lineTo(-8, -6); c.lineTo(-10, -4); c.closePath(); c.fill(); c.stroke(); }
    if (k === 'game') { c.fillStyle = '#9a5ad0'; c.beginPath(); c.roundRect(-16, -9, 32, 18, 8); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.fillRect(-10, -2, 8, 3); c.fillRect(-7.5, -5, 3, 9); c.beginPath(); c.arc(8, 0, 2.5, 0, 7); c.fill(); }
    if (k === 'pizza') { c.fillStyle = '#f5c23a'; c.beginPath(); c.moveTo(-14, -10); c.lineTo(14, -10); c.lineTo(0, 14); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#e8403a'; c.beginPath(); c.arc(-3, -4, 3, 0, 7); c.arc(4, 1, 2.5, 0, 7); c.fill(); }
    if (k === 'shoes') { c.fillStyle = '#e8563a'; c.beginPath(); c.moveTo(-14, 6); c.lineTo(-12, -8); c.lineTo(-4, -8); c.lineTo(0, -2); c.lineTo(14, 2); c.lineTo(14, 8); c.closePath(); c.fill(); c.stroke(); }
    if (k === 'book') { c.fillStyle = '#5ac87a'; c.beginPath(); c.roundRect(-11, -14, 22, 28, 3); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(-7, -8, 14, 3); }
    c.restore(); }
  function newMonth(g) { const s = g.s; s.owe = s.L.owe[s.m]; s.paid = 0; s.day = 0; s.phase = 'shop'; s.phaseT = g.t; s.shopN = 0; }
  MG.add({
    id: 'money_payfull', stage: 'money', cmd: 'PAY IT ALL BEFORE IT\'S DUE!', time: 6, mood: 'bright', winText: 'No interest!', failText: 'Interest chewed in!', hold: 1.7,
    card: { title: 'Pay the whole card bill', kind: 'Money', ref: 'Credit card interest',
      text: 'A credit card lets you buy now and pay later. Each month the card sends a bill, called a statement, with a due date.\n\nIf you pay the whole statement by the due date, most cards charge no interest at all on those purchases. If you pay only part, the card charges interest on what is left, often more than 20% a year, and the leftover grows month after month.\n\nSo spend only what you can pay off, and pay all of it on time.',
      note: 'Pay the whole credit card bill by the due date and you pay no interest.' },
    init(g) {
      const s = g.s; s.L = LV[Math.min(2, g.level)]; s.v = SK.variant(g, 4); s.shop = SHOP[s.v]; s.m = 0; s.bank = s.L.owe.reduce((a, b) => a + b, 0) + 2; s.fly = []; s.icons = [];
      s.offT = 0; s.chewT = 0; s.grow = 0; newMonth(g);
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'pay') return;
      if (Math.abs(x - BTN.x) < BTN.w / 2 + 16 && Math.abs(y - BTN.y) < BTN.h / 2 + 16 || x > CARD.x - CARD.w / 2 - 10 && y > CARD.y0 && y < CARD.y1) {
        if (s.paid + s.fly.length >= s.owe) return; s.fly.push({ t: g.t, i: s.bank - 1 }); s.bank--; g.sfx('coin');
      }
    },
    update(g, dt) {
      const s = g.s;
      for (const f of s.fly) if (!f.done && g.t - f.t > 0.28) { f.done = true; s.paid++; g.sfx('pop'); g.burst(CARD.x, CARD.y1 - 20 - (s.owe - s.paid) * 22, ['#8affb0', '#fff6ea'], 6, 90); }
      s.fly = s.fly.filter(f => !f.done);
      if (g.done) return;
      if (s.phase === 'shop') { // this month's shopping lands on the card, one thing at a time
        const k = g.t - s.phaseT; if (s.shopN < 3 && k > 0.15 + s.shopN * 0.22) { s.icons.push({ k: s.shop[(s.shopN + s.m) % 3], t: g.t }); s.shopN++; g.sfx('click'); }
        if (k > 0.95) { s.phase = 'pay'; s.phaseT = g.t; s.icons = []; }
      }
      if (s.phase === 'pay') {
        s.day = Math.min(29, (g.t - s.phaseT) / s.L.days * 29);
        if (s.paid >= s.owe && !s.fly.length) { s.offT = g.t; g.sfx('chime'); s.m++; if (s.m >= s.L.owe.length) { s.phase = 'won'; g.win(); g.sfx('cheer'); } else { s.phase = 'gone'; s.phaseT = g.t; } }
        else if (s.day >= 29) { s.phase = 'late'; s.chewT = g.t; g.sfx('munch'); g.sfx('laugh'); g.shake(4, 0.3); }
      }
      if (s.phase === 'gone' && g.t - s.phaseT > 0.55) newMonth(g);
      if (s.phase === 'late') { s.grow = Math.min(3, Math.floor((g.t - s.chewT) / 0.25)); if (g.t - s.chewT > 0.9) g.fail(); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('n6payfull_bg', paint), 0, 0, 360, 640);
      // the days so far are crossed off; the marker shows today; the gremlin waits on the due date
      const today = Math.floor(s.day);
      for (let d = 0; d < (s.phase === 'pay' || s.phase === 'late' ? today : 0); d++) { const [x, y] = cell(d); c.save(); c.strokeStyle = 'rgba(232,86,58,0.6)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 10, y - 8); c.lineTo(x + 10, y + 8); c.moveTo(x + 10, y - 8); c.lineTo(x - 10, y + 8); c.stroke(); c.restore(); }
      { const [x, y] = cell(29); c.save(); c.fillStyle = 'rgba(232,64,58,0.18)'; c.fillRect(x - CAL.cw / 2, y - CAL.ch / 2, CAL.cw, CAL.ch); c.restore(); SK.tag(c, 'Due', x - 2, y + 26, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); }
      if (s.phase === 'pay') { const [x, y] = cell(today); c.save(); c.strokeStyle = '#2a6ad8'; c.lineWidth = 4; c.beginPath(); c.roundRect(x - CAL.cw / 2 + 2, y - CAL.ch / 2 + 2, CAL.cw - 4, CAL.ch - 4, 6); c.stroke(); c.restore(); }
      SK.tag(c, 'Month ' + Math.min(s.m + 1, s.L.owe.length) + ' / ' + s.L.owe.length, 92, 310, 18);
      // the gremlin: on the due date, shrinking away when the bill is paid, or leaping onto the card when it isn't
      const [gx0, gy0] = cell(29); let gs = 0.9, gx = gx0 + 6, gy = gy0 - 2, chew = false;
      if (s.phase === 'gone' || s.phase === 'won') { const q = SK.clamp((t - s.offT) / 0.5, 0, 1); gs = 0.9 * (1 - q); gx += q * 30; }
      if (s.phase === 'late') { const q = SK.clamp((t - s.chewT) / 0.3, 0, 1); gx = SK.lerp(gx0, CARD.x, q); gy = SK.lerp(gy0, CARD.y1 - 26 - (s.owe - s.paid + s.grow) * 22, q) - Math.sin(q * Math.PI) * 60; gs = 0.9 + q * 0.9; chew = q >= 1; }
      if (s.phase === 'shop' && t - s.phaseT < 0.3) gs = 0.9 * SK.clamp((t - s.phaseT) / 0.3, 0, 1);
      // the bank jar
      N6.jarBack(c, BANK.x, BANK.y0, BANK.y1, BANK.w); for (let i = 0; i < s.bank; i++) N6.flat(c, BANK.x + (i % 2 ? 6 : -6), BANK.y1 - 12 - i * 9, 26); N6.jarFront(c, BANK.x, BANK.y0, BANK.y1, BANK.w, '#5aa8e8');
      SK.tag(c, 'Bank', BANK.x, BANK.y1 + 16, 18);
      // the card bill: red coins owed; paid ones turn green and pop
      c.save(); c.fillStyle = 'rgba(255,255,255,0.55)'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.roundRect(CARD.x - CARD.w / 2, CARD.y0, CARD.w, CARD.y1 - CARD.y0, 14); c.fill(); c.stroke();
      c.fillStyle = '#2a4a8a'; c.beginPath(); c.roundRect(CARD.x - 34, CARD.y0 - 22, 68, 42, 6); c.fill(); c.fillStyle = '#f5c23a'; c.fillRect(CARD.x - 24, CARD.y0 - 12, 14, 10); c.fillStyle = '#fff'; c.fillRect(CARD.x - 24, CARD.y0 + 6, 46, 4); c.restore();
      const left = s.owe - s.paid + (s.phase === 'late' ? s.grow : 0);
      if (s.phase !== 'won' && s.phase !== 'gone') for (let i = 0; i < left; i++) { const y = CARD.y1 - 20 - i * 22; c.save(); c.fillStyle = '#e8403a'; c.strokeStyle = '#7a1a14'; c.lineWidth = 2; c.beginPath(); c.ellipse(CARD.x, y, 30, 10, 0, 0, 7); c.fill(); c.stroke(); c.restore(); if (s.phase === 'late' && i >= s.owe - s.paid) N6.text(c, '+', CARD.x + 42, y, 20, '#e8403a'); }
      SK.tag(c, 'Card bill', CARD.x, CARD.y1 + 16, 18, '#fff6ea', 'rgba(190,40,40,0.88)');
      if (s.phase === 'pay' || s.phase === 'late') SK.tag(c, left + ' owed', CARD.x, CARD.y0 + 34, 18, '#fff6ea', 'rgba(30,14,36,0.75)');
      // shopping landing on the card
      for (const ic of s.icons) { const q = SK.clamp((t - ic.t) / 0.4, 0, 1); shopIcon(c, ic.k, SK.lerp(30, CARD.x, q), SK.lerp(320, CARD.y0 + 20, q) - Math.sin(q * Math.PI) * 50); }
      // coins flying from the bank to the card
      for (const f of s.fly) { const q = SK.clamp((t - f.t) / 0.28, 0, 1); N6.coin(c, SK.lerp(BANK.x, CARD.x, q), SK.lerp(BANK.y0 + 30, CARD.y1 - 30 - (s.owe - s.paid - 1) * 22, q) - Math.sin(q * Math.PI) * 70, 13); }
      gremlin(c, gx, gy, gs, t, chew);
      SK.animal(c, 'duck', 176, 514, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', noShadow: true });
      // the button
      const can = s.phase === 'pay' && s.paid + s.fly.length < s.owe && !g.done;
      N6.button(c, BTN.x, BTN.y, BTN.w, BTN.h, 'Pay', can ? '#3aa860' : '#6a8a7a', false, { size: 26 });
      if (can) { SK.glow(c, g, BTN.x, BTN.y, 40, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [BTN.x + 8, BTN.y + 4], null, { period: 0.6 }); }
    },
    auto(g, dt, synth) { const s = g.s, B = s._a = s._a || { n: 1.0 }; if (g.done || s.phase !== 'pay' || g.t < B.n || s.paid + s.fly.length >= s.owe) return; B.n = g.t + 0.16; synth('down', BTN.x, BTN.y); synth('up', BTN.x, BTN.y); },
  });
})();
