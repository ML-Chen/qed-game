// MASS PRODUCE! (hardware SH-04) — a toy factory. A delivery truck waits for a big order of toy-car bodies. On the left a
// steel mould in a press, with the tall stack of coins it cost to make beside it; on the right a 3D printer, slowly
// printing one car at a time. Tap Stamp again and again: the press slams, two car bodies pop out of the mould and slide
// down a chute into the truck. Two coin piles compare what one car costs: the printer's stays the same (its plastic and
// hours per car), while the mould's shrinks as its big up-front cost is shared by more and more cars, until each costs
// a crumb. Meanwhile the printer finishes a car or two. Stop stamping and the truck honks and leaves half empty.
// Level 0: 20 cars. Level 1: 28. Level 2: 36 and a dearer mould.
const MP = (() => {
  const PRESS = { x: 88, y: 300 }, BTN = { x: 110, y: 566, w: 170, h: 62 }, TRUCK = { x: 262, y: 520 }, PRN = { x: 296, y: 250 };
  const SETS = [{ wall: ['#f4d8b0', '#fbead0'], car: '#e8403a', truck: '#3a7ad8' }, { wall: ['#d0e4f4', '#eaf4fb'], car: '#3ac06a', truck: '#e8803a' }, { wall: ['#e8d8f0', '#f6eefa'], car: '#e8b43a', truck: '#5a5ae0' }, { wall: ['#d8eed0', '#eef8ea'], car: '#3a8ae8', truck: '#d84a6a' }];
  function paint(o, S) {
    N4.vgrad(o, 0, 0, 360, 470, S.wall); o.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 0; x < 360; x += 60) o.fillRect(x, 0, 30, 470);
    N4.vgrad(o, 0, 466, 360, 174, ['#9a9aa8', '#7a7a88']); o.fillStyle = 'rgba(255,255,255,0.08)'; for (let x = 0; x < 360; x += 40) o.fillRect(x, 470, 2, 170);
    // the press frame
    o.fillStyle = '#4a5260'; o.fillRect(PRESS.x - 66, 150, 18, 300); o.fillRect(PRESS.x + 48, 150, 18, 300); o.fillRect(PRESS.x - 70, 140, 136, 22);
    o.fillStyle = '#2a2e36'; o.beginPath(); o.roundRect(PRESS.x - 56, 380, 112, 40, 6); o.fill(); // lower half of the mould
    o.fillStyle = '#5a6270'; o.beginPath(); o.roundRect(PRESS.x - 46, 386, 92, 14, 4); o.fill();
    // the chute to the truck
    o.fillStyle = '#b8b8c4'; o.beginPath(); o.moveTo(PRESS.x + 40, 418); o.lineTo(TRUCK.x - 40, 470); o.lineTo(TRUCK.x - 40, 482); o.lineTo(PRESS.x + 40, 432); o.closePath(); o.fill();
    // the printer's box
    o.fillStyle = '#1e2430'; o.beginPath(); o.roundRect(PRN.x - 48, PRN.y - 70, 100, 130, 10); o.fill(); o.fillStyle = '#3a4a5a'; o.fillRect(PRN.x - 40, PRN.y - 58, 84, 100); o.fillStyle = '#8a9aa8'; o.fillRect(PRN.x - 36, PRN.y + 34, 76, 8);
    P.grain(o, 360, 640, 0.025);
  }
  function carBody(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2; c.beginPath(); c.moveTo(-20, 4); c.lineTo(-20, -4); c.lineTo(-10, -6); c.lineTo(-5, -14); c.lineTo(9, -14); c.lineTo(14, -6); c.lineTo(20, -4); c.lineTo(20, 4); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#bfe6f8'; c.fillRect(-3, -12, 9, 6); c.fillStyle = '#2a2a32'; c.beginPath(); c.arc(-11, 5, 4, 0, 7); c.arc(11, 5, 4, 0, 7); c.fill(); c.restore(); }
  function coins(c, x, y, n, w = 22) { const k = Math.max(0, n); for (let i = 0; i < Math.floor(k); i++) { c.fillStyle = i % 2 ? '#ffd45a' : '#f0c040'; c.strokeStyle = '#8a6a10'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y - i * 5, w / 2, 4, 0, 0, 7); c.fill(); c.stroke(); }
    const f = k - Math.floor(k); if (f > 0.05) { c.fillStyle = '#ffd45a'; c.strokeStyle = '#8a6a10'; c.beginPath(); c.ellipse(x, y - Math.floor(k) * 5, w / 2 * Math.sqrt(f), 4 * Math.sqrt(f), 0, 0, 7); c.fill(); c.stroke(); } }
  return { PRESS, BTN, TRUCK, PRN, SETS, paint, carBody, coins };
})();
MG.add({
  id: 'build_massproduce', stage: 'build', cmd: 'STAMP CARS TO FILL THE TRUCK!', time: 7, mood: 'desert', winText: 'Each car costs a crumb!', failText: 'The truck left!',
  card: { title: 'Pay once, make thousands', kind: 'Engineering', ref: 'Injection moulding vs 3D printing (fixed and unit costs)',
    text: 'A steel mould costs a lot to make. But once you have it, a machine squirts plastic in and a part pops out every few seconds, for very little each.\n\nA 3D printer costs nothing extra to start, but each part takes a long time and more money.\n\nThe mould\'s big cost is shared by every part it makes. Make 10 and each one carries a big slice. Make 10,000 and each carries a crumb. That is why toys made by the million come from moulds, and one-off prototypes come from printers.',
    note: 'A mould costs a lot up front but makes each part cheap and fast, so it wins when you make many.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.S = MP.SETS[s.v]; s.L = L;
    s.need = [20, 28, 36][L]; s.mould = [40, 40, 56][L]; s.made = 0; s.flying = []; s.pressT = -9; s.printK = 0; s.printed = 0; s.doneT = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.doneT || !N4.inBox(MP.BTN, x, y, 16)) return; if (g.t - s.pressT < 0.12) return;
    s.pressT = g.t; g.sfx('thud', { vol: 0.6 }); g.sfx('click'); g.shake(1.5, 0.08);
    for (let i = 0; i < 2; i++) s.flying.push({ t0: g.t + i * 0.08, i: s.made + s.flying.length });
  },
  update(g, dt) {
    const s = g.s; if (!s.doneT) { s.printK += dt / 9; if (s.printK >= 1) { s.printK = 0; s.printed++; g.sfx('ding', { vol: 0.4 }); } }
    for (const f of s.flying) if (!f.in && g.t - f.t0 > 0.5) { f.in = true; s.made++; if (s.made % 4 === 0) g.sfx('coin', { vol: 0.4 }); }
    s.flying = s.flying.filter(f => !f.in);
    if (!g.done && !s.doneT && s.made >= s.need) { s.doneT = g.t; g.sfx('honk'); }
    if (s.doneT && !g.done && g.t - s.doneT > 0.45) { g.sfx('cheer'); g.win(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, won = g.result === 'win', lost = g.result === 'fail', PR = MP.PRESS;
    c.drawImage(g.bake('massprod_bg' + s.v, o => MP.paint(o, S)), 0, 0, 360, 640);
    // the press's upper half slams down on each stamp
    const k = SK.clamp((t - s.pressT) / 0.18, 0, 1), down = k < 0.4 ? k / 0.4 : 1 - (k - 0.4) / 0.6, py = 220 + down * 150;
    c.fillStyle = '#8a929e'; c.fillRect(PR.x - 8, 160, 16, py - 160); c.fillStyle = '#3a4250'; c.strokeStyle = '#1a1e26'; c.lineWidth = 3; c.beginPath(); c.roundRect(PR.x - 56, py, 112, 40, 6); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.2)'; c.fillRect(PR.x - 50, py + 4, 100, 5);
    SK.tag(c, 'Steel mould', PR.x, 444, 18);
    // the mould's cost: a tall stack of coins paid up front
    // the cars sliding down the chute
    for (const f of s.flying) { const u = SK.clamp((t - f.t0) / 0.5, 0, 1); if (t < f.t0) continue; MP.carBody(c, SK.lerp(PR.x + 30, MP.TRUCK.x - 30, u), SK.lerp(408, 452, u) - Math.sin(u * Math.PI) * 10, 0.9, S.car); }
    // the truck, its bed heaping up with car bodies; it drives off if you run out of time
    const leave = lost ? SK.clamp((t - g.doneAt) * 1.5, 0, 1) * 260 : 0, tx = MP.TRUCK.x + leave;
    c.fillStyle = S.truck; c.strokeStyle = P.shade(S.truck, -0.5); c.lineWidth = 3; c.beginPath(); c.roundRect(tx - 54, 470, 100, 54, 6); c.fill(); c.stroke();
    c.beginPath(); c.roundRect(tx + 46, 486, 44, 38, 8); c.fill(); c.stroke(); c.fillStyle = '#bfe6f8'; c.fillRect(tx + 58, 492, 22, 14);
    c.fillStyle = '#2a2a32'; for (const wx of [-30, 20, 70]) { c.beginPath(); c.arc(tx + wx, 528, 12, 0, 7); c.fill(); }
    const shown = Math.min(s.made, 40); for (let i = 0; i < shown; i++) { const row = Math.floor(i / 6), col = i % 6; MP.carBody(c, tx - 44 + col * 17 + (row % 2) * 8, 466 - row * 9, 0.5, P.shade(S.car, (i % 3) * 0.08)); }
    SK.tag(c, Math.min(s.made, s.need) + ' / ' + s.need, tx, 552, 18);
    // the 3D printer, slowly printing one car at a time
    c.save(); c.beginPath(); c.rect(MP.PRN.x - 30, MP.PRN.y + 34 - 30 * s.printK, 60, 30 * s.printK + 2); c.clip(); MP.carBody(c, MP.PRN.x, MP.PRN.y + 24, 1, '#9a6ad8'); c.restore();
    c.fillStyle = '#e8e8f0'; c.fillRect(MP.PRN.x - 10 + Math.sin(t * 10) * 18, MP.PRN.y + 4 - 30 * s.printK, 20, 10);
    SK.tag(c, '3D printer', MP.PRN.x, MP.PRN.y - 88, 18);
    for (let i = 0; i < s.printed; i++) MP.carBody(c, MP.PRN.x - 40 + i * 26, MP.PRN.y + 78, 0.6, '#9a6ad8');
    // the cost of one car, each way: two coin piles under a little car
    const perMould = s.mould / Math.max(1, s.made) + 0.3, perPrint = 3;
    c.fillStyle = 'rgba(30,14,36,0.12)'; c.beginPath(); c.roundRect(164, 140, 82, 156, 12); c.fill();
    MP.carBody(c, 186, 160, 0.6, S.car); MP.carBody(c, 226, 160, 0.6, '#9a6ad8');
    MP.coins(c, 186, 284, Math.min(18, perMould), 18); MP.coins(c, 226, 284, perPrint, 18);
    SK.tag(c, 'Per car', 206, 314, 18);
    SK.animal(c, 'beaver', 322, 600, 0.75, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // the stamp button
    const pressed = t - s.pressT < 0.12; N4.button(c, MP.BTN, 'Stamp!', { pressed, col: '#e8803a', size: 24 });
    const go = !g.done && !s.doneT; if (go) SK.glow(c, g, MP.BTN.x, MP.BTN.y, 56, '#e8563a', { level: 2 });
    SK.demo(g, c, 'tap', [MP.BTN.x + 30, MP.BTN.y + 4], null, { never: !go, period: 0.5 });
  },
  auto(g, dt, synth) { const s = g.s, B = s._b = s._b || { last: 0 }; if (g.done || s.doneT || g.t < 1.0 || g.t - B.last < 0.2) return; B.last = g.t; synth('down', MP.BTN.x, MP.BTN.y); synth('up', MP.BTN.x, MP.BTN.y); },
});
