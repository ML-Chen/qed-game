// ADD A DEPOSIT! (policy GP-05) — a park littered with bottles, and the shop's conveyor belt carrying new bottles past a
// deposit stamp. Tap as each bottle passes under the stamp: a deposit coin sticks to it. After the drink, a bottle that
// carries a deposit is worth something, so it gets carried back to the return bin for its coin; a bottle without one is
// tossed on the grass. Level 2: one small coin isn't worth the bother, so each bottle needs two stamps.
const TAU = Math.PI * 2, BELT = { y: 524, x0: 0, x1: 340 }, SX = 180, BIN = [44, 392];
const LV = [{ n: 4, v: 95, need: 3, stamps: 1 }, { n: 5, v: 120, need: 4, stamps: 1 }, { n: 5, v: 130, need: 4, stamps: 2 }];
function paintPark(o) {
  P.sky(o, 360, 640, ['#8ac8e8', '#c8e8f0', '#f4f8e4'], { x: 80, y: 60, r: 22, color: '#fff2c0' });
  P.hills(o, 360, 200, 26, '#9ad078', '#7ab060', { seed: 2 });
  const gr = o.createLinearGradient(0, 200, 0, 380); gr.addColorStop(0, '#8ac868'); gr.addColorStop(1, '#6aa850'); o.fillStyle = gr; o.fillRect(0, 196, 360, 190);
  o.fillStyle = '#e8d8b0'; o.beginPath(); o.moveTo(150, 200); o.quadraticCurveTo(120, 290, 60, 386); o.lineTo(130, 386); o.quadraticCurveTo(170, 290, 175, 200); o.closePath(); o.fill();
  P.tree(o, 300, 260, 1.0, '#5f8f4a', 3); P.tree(o, 40, 236, 0.8, '#6a9a50', 5);
  o.fillStyle = '#8a5a3a'; o.fillRect(212, 292, 60, 6); o.fillRect(216, 298, 4, 14); o.fillRect(264, 298, 4, 14); o.fillRect(212, 280, 60, 5);
  P.grassTufts(o, 360, 210, 380, 24, '#5a9a40', 3); P.flowers(o, 360, 220, 376, 10, undefined, 4);
  // the shop: a striped awning over the counter and its conveyor belt
  o.fillStyle = '#f0e0c8'; o.fillRect(0, 386, 360, 254);
  for (let i = 0; i < 9; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#4aa0d8'; o.beginPath(); o.moveTo(i * 40, 386); o.lineTo(i * 40 + 40, 386); o.lineTo(i * 40 + 40, 408); o.quadraticCurveTo(i * 40 + 20, 418, i * 40, 408); o.closePath(); o.fill(); }
  B9.wood(o, 0, 548, 360, 92, '#b07a48', 3);
  o.fillStyle = '#3a3440'; o.beginPath(); o.roundRect(-10, BELT.y - 8, BELT.x1 + 10, 26, 13); o.fill(); o.fillStyle = '#5a5464'; o.fillRect(0, BELT.y - 6, BELT.x1, 4);
  // the return bin (with a coin slot) at the left of the counter
  o.fillStyle = '#4ab070'; o.beginPath(); o.roundRect(BIN[0] - 28, BIN[1] - 6, 56, 64, 8); o.fill(); o.fillStyle = '#2a7a4a'; o.fillRect(BIN[0] - 20, BIN[1] + 4, 40, 8);
  o.strokeStyle = '#fff6ea'; o.lineWidth = 3; o.beginPath(); o.arc(BIN[0], BIN[1] + 34, 11, 0.3, TAU - 0.3); o.stroke(); o.beginPath(); o.moveTo(BIN[0] + 9, BIN[1] + 25); o.lineTo(BIN[0] + 12, BIN[1] + 32); o.lineTo(BIN[0] + 5, BIN[1] + 31); o.stroke();
  P.grain(o, 360, 640, 0.04);
}
// a drink container: a bottle, a can, a jar or a carton (each play starts with a different one and the belt mixes them)
const SHAPES = ['bottle', 'can', 'jar', 'carton'];
function bottle(c, x, y, rot, col, coin, sc = 1, kind = 'bottle') { // coin: 0 none, 1 small, 2 full deposit
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc); c.fillStyle = col;
  if (kind === 'can') { c.beginPath(); c.roundRect(-10, -34, 20, 34, 4); c.fill(); c.fillStyle = '#c8c8d0'; c.fillRect(-9, -37, 18, 4); c.fillRect(-9, -2, 18, 3); c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(-7, -30, 3, 24); }
  else if (kind === 'jar') { c.beginPath(); c.roundRect(-11, -32, 22, 32, 7); c.fill(); c.fillStyle = '#e8a040'; c.fillRect(-9, -38, 18, 7); c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(-8, -28, 3, 22); }
  else if (kind === 'carton') { c.beginPath(); c.moveTo(-10, 0); c.lineTo(-10, -30); c.lineTo(0, -40); c.lineTo(10, -30); c.lineTo(10, 0); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(-10, -26, 20, 4); c.fillStyle = '#4a8ae8'; c.fillRect(-3, -44, 6, 6); }
  else { c.beginPath(); c.moveTo(-9, 0); c.lineTo(-9, -28); c.quadraticCurveTo(-9, -36, -4, -40); c.lineTo(-4, -48); c.lineTo(4, -48); c.lineTo(4, -40); c.quadraticCurveTo(9, -36, 9, -28); c.lineTo(9, 0); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(-6, -30, 3, 24); c.fillStyle = '#e84a4a'; c.fillRect(-5, -52, 10, 5); }
  c.fillStyle = '#fff6ea'; c.fillRect(-9, -22, 18, 10);
  if (coin) B9.coin(c, 0, -17, coin > 1 ? 9 : 5);
  c.restore();
}
MG.add({
  id: 'adddeposit', stage: 'policy', cmd: 'STAMP A DEPOSIT ON EACH BOTTLE!', time: 6, mood: 'bright', winText: 'Bottles come back!', failText: 'Litter!',
  card: { title: 'A price on throwing away', kind: 'Policy', ref: 'Container deposits (bottle bills)',
    text: 'A deposit adds a small amount to the price of each bottle, and you get it back when you return the bottle. Nobody is forced to return it, but many people do, because the empty bottle is now worth a coin. The bottles without a deposit ended up as litter in the park.\n\nThe size matters: if the deposit is tiny, many people don\'t bother. Deposits have costs too, because shops and buyers have to handle the returns. Taxes and fees work the same way: a price on something makes people do less of it without banning it.',
    note: 'Putting a price on a behaviour, such as a deposit or a tax, makes people do less of it without banning it.' },
  init(g) {
    const s = g.s, L = LV[Math.min(2, g.level)]; s.L = L; s.v = L.v * (1 + ((g.speed || 1) - 1) * 0.35); s.b = []; let x = 10;
    const v = SK.variant(g, 4), cols = SK.shuffled(g, ['#8ad0a0', '#a8c8f0', '#f0b8c8', '#f6d880', '#c8a8f0']);
    for (let i = 0; i < L.n; i++) { s.b.push({ x, st: 'belt', coin: 0, col: cols[i % 5], kind: SHAPES[(v + i) % 4] }); x -= 105 + g.rand() * 60; }
    s.press = -1; s.litter = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || g.t - s.press < 0.16) return; s.press = g.t; g.sfx('click'); // a tap anywhere works the stamp
    const b = s.b.find(q => q.st === 'belt' && Math.abs(q.x - SX) < 28);
    if (b && b.coin < s.L.stamps) { b.coin++; g.sfx(b.coin >= s.L.stamps ? 'coin' : 'tap'); g.burst(SX, BELT.y - 30, ['#f6c445', '#fff6ea'], 8, 100); } else g.sfx('thud');
  },
  update(g, dt) {
    const s = g.s, L = s.L;
    for (const b of s.b) {
      if (b.st === 'belt') { b.x += s.v * dt; if (b.x > BELT.x1 + 6) { b.st = 'drink'; b.at = g.t; b.px = 70 + ((s.b.indexOf(b) * 71) % 220); b.py = 240 + ((s.b.indexOf(b) * 37) % 120); } }
      else if (b.st === 'drink' && g.t - b.at > 0.7) { if (b.coin >= L.stamps) { b.st = 'return'; b.at = g.t; } else { b.st = 'litter'; s.litter.push({ x: b.px, y: b.py, r: 1.3, col: b.col, coin: b.coin, kind: b.kind }); g.sfx('thud'); g.sfx('wrong'); } }
      else if (b.st === 'return' && g.t - b.at > 0.75) { b.st = 'back'; g.sfx('coin'); g.sfx('ding'); g.burst(BIN[0], BIN[1], ['#f6c445', '#fff6ea'], 10, 120); }
    }
    if (!g.done && s.b.every(b => b.st === 'back' || b.st === 'litter')) { const ok = s.b.filter(b => b.st === 'back').length; if (ok >= L.need) { g.win(); g.sfx('cheer'); } else { g.sfx('laugh'); g.fail(); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('adddeposit', paintPark), 0, 0, 360, 640);
    for (const l of s.litter) bottle(c, l.x, l.y, l.r, l.col || '#a8b8a0', l.coin || 0, 1, l.kind);
    // the belt's moving stripes
    c.strokeStyle = 'rgba(255,255,255,0.16)'; c.lineWidth = 3; for (let x = (t * s.v) % 24 - 24; x < BELT.x1; x += 24) { c.beginPath(); c.moveTo(x, BELT.y - 2); c.lineTo(x + 8, BELT.y + 14); c.stroke(); }
    for (const b of s.b) {
      if (b.st === 'belt') bottle(c, b.x, BELT.y - 6, 0, b.col, b.coin ? (b.coin >= s.L.stamps ? 2 : 1) : 0, 1.4, b.kind);
      else if (b.st === 'drink') { const k = SK.clamp((t - b.at) / 0.6, 0, 1); bottle(c, SK.lerp(BELT.x1, b.px, k), SK.lerp(BELT.y - 6, b.py, k) - Math.sin(k * Math.PI) * 90, k * 6, b.col, b.coin ? (b.coin >= s.L.stamps ? 2 : 1) : 0, SK.lerp(1.4, 1, k), b.kind); }
      else if (b.st === 'return') { const k = SK.clamp((t - b.at) / 0.75, 0, 1), x = SK.lerp(b.px, BIN[0] + 10, k), y = SK.lerp(b.py, BIN[1] - 6, k); SK.animal(c, 'rabbit', x, y + 6, 0.5, { t, pose: 'carry', phase: b.px, hold: c2 => bottle(c2, 0, 8, 0, b.col, 2, 1, b.kind) }); }
    }
    // the deposit stamp press above the belt
    const pk = SK.clamp(1 - (t - s.press) / 0.16, 0, 1), py = BELT.y - 120 + pk * 40;
    c.fillStyle = '#8a8a98'; c.fillRect(SX - 4, 400, 8, py - 400); c.fillStyle = '#6a6a78'; c.beginPath(); c.roundRect(SX - 22, py, 44, 18, 5); c.fill(); B9.coin(c, SX, py + 22, 10);
    c.save(); c.strokeStyle = 'rgba(255,240,170,0.5)'; c.lineWidth = 2; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(SX - 28, BELT.y - 80); c.lineTo(SX - 28, BELT.y + 18); c.moveTo(SX + 28, BELT.y - 80); c.lineTo(SX + 28, BELT.y + 18); c.stroke(); c.restore();
    SK.tag(c, 'Deposit stamp', SX + 98, BELT.y - 104, 18, '#ffe9a0'); SK.tag(c, 'Return bin', BIN[0] + 18, BIN[1] - 20, 18); SK.tag(c, 'Park', 300, 214, 18);
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'duck', 300, 618, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    const nb = s.b.find(b => b.st === 'belt' && b.coin < s.L.stamps && b.x < SX + 28);
    if (nb && !g.done) { SK.glow(c, g, SX, BELT.y - 34, 40); if (Math.abs(nb.x - SX) < 40) SK.demo(g, c, 'tap', [SX, BELT.y - 70], null, { delay: 0, period: 0.6 }); }
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t - s.press < 0.17) return;
    const b = s.b.find(q => q.st === 'belt' && q.coin < s.L.stamps && Math.abs(q.x - SX) < 18 + (s.L.stamps > 1 ? 4 : 0) && (q.coin === 0 ? q.x > SX - 22 : true));
    if (b) { synth('down', SX, BELT.y + 40); synth('up', SX, BELT.y + 40); }
  },
});
