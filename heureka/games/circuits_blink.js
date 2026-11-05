// BLINK! (hardware EB-01) — a night workbench: a brain board (a microcontroller) runs its program, shown as a looping
// strip of pictures (bulb on, clock, bulb off, clock) with a glow stepping along it. Its Pin 13 lights up and goes dark
// in time with the program. An LED dangles above the board: one long leg, one short leg. Drag the long leg into
// Pin 13 and the short leg into Ground: the loop is complete, dots of current run from the pin through the LED and
// back, and the LED blinks with the program. Plug it in backwards and the pin still lights, but the dots stop at the
// LED and it stays dark: an LED lets current through only one way (long leg toward the pin).
// Level 0-1: one LED (level 1 with the holes further apart, in a different order). Level 2: two LEDs on two pins
// that blink in turn.
const BL = (() => {
  const HY = 404, STEP = 0.32, LEDC = ['#ff4a4a', '#4aff7a', '#4ab4ff', '#ffd23a'];
  const holeX = i => 64 + i * 29; // nine holes along the header
  // variants: which header holes are the pins and the ground, and which side the LED's long leg hangs on
  const SETS = [
    { one: { pin: 6, gnd: 3 }, two: { pins: [7, 2], gnd: 5 }, side: 1, col: 0 },
    { one: { pin: 2, gnd: 5 }, two: { pins: [1, 6], gnd: 3 }, side: -1, col: 1 },
    { one: { pin: 5, gnd: 1 }, two: { pins: [3, 8], gnd: 0 }, side: -1, col: 2 },
    { one: { pin: 3, gnd: 7 }, two: { pins: [0, 4], gnd: 8 }, side: 1, col: 3 },
  ];
  function paint(o, L) {
    N4.vgrad(o, 0, 0, 360, 640, ['#141a36', '#22305a', '#2a2a4a']);
    // a pegboard wall with tools, a desk lamp's pool of light on the bench
    o.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = 210; y < 360; y += 18) for (let x = 12; x < 360; x += 18) { o.beginPath(); o.arc(x, y, 2, 0, 7); o.fill(); }
    const lg = o.createRadialGradient(180, 470, 20, 180, 470, 260); lg.addColorStop(0, 'rgba(255,230,170,0.28)'); lg.addColorStop(1, 'rgba(255,230,170,0)'); o.fillStyle = lg; o.fillRect(0, 200, 360, 440);
    N4.vgrad(o, 0, 362, 360, 278, ['#7a5236', '#5a3a26']); o.fillStyle = 'rgba(255,255,255,0.06)'; for (let y = 380; y < 640; y += 22) o.fillRect(0, y, 360, 2);
    // the brain board: a blue circuit board with a chip, gold traces and a header of holes
    o.fillStyle = 'rgba(0,0,0,0.35)'; o.beginPath(); o.roundRect(34, 384, 300, 190, 14); o.fill();
    const bg = o.createLinearGradient(0, 378, 0, 566); bg.addColorStop(0, '#2a7ad0'); bg.addColorStop(1, '#1a5aa8'); o.fillStyle = bg; o.strokeStyle = '#0e3a70'; o.lineWidth = 3; o.beginPath(); o.roundRect(30, 378, 300, 188, 14); o.fill(); o.stroke();
    o.strokeStyle = 'rgba(255,215,120,0.45)'; o.lineWidth = 2.5; for (let i = 0; i < 9; i++) { o.beginPath(); o.moveTo(holeX(i), HY + 14); o.lineTo(holeX(i), 440); o.lineTo(SK.lerp(150, 210, i / 8), 456); o.stroke(); }
    o.fillStyle = '#1a1a22'; o.beginPath(); o.roundRect(130, 456, 100, 64, 6); o.fill(); o.fillStyle = '#c8c8d0'; for (let i = 0; i < 7; i++) { o.fillRect(136 + i * 13, 450, 6, 6); o.fillRect(136 + i * 13, 520, 6, 6); }
    o.fillStyle = 'rgba(255,255,255,0.18)'; o.beginPath(); o.arc(144, 470, 4, 0, 7); o.fill();
    o.fillStyle = '#c0c0c8'; o.beginPath(); o.roundRect(40, 520, 54, 34, 4); o.fill(); o.fillStyle = '#8a8a94'; o.fillRect(46, 526, 42, 22); // usb socket
    o.fillStyle = '#1a1a22'; o.beginPath(); o.roundRect(48, HY - 14, 272, 28, 4); o.fill();
    for (let i = 0; i < 9; i++) { o.fillStyle = '#3a3a44'; o.beginPath(); o.roundRect(holeX(i) - 9, HY - 9, 18, 18, 3); o.fill(); o.fillStyle = '#05050a'; o.beginPath(); o.arc(holeX(i), HY, 4.5, 0, 7); o.fill(); }
    P.grain(o, 360, 640, 0.03);
  }
  function bulbIcon(c, x, y, on, s = 1, col = '#ffd23a') {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (on) { const g = c.createRadialGradient(0, -4, 2, 0, -4, 20); g.addColorStop(0, 'rgba(255,240,150,0.9)'); g.addColorStop(1, 'rgba(255,240,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(0, -4, 20, 0, 7); c.fill(); }
    c.fillStyle = on ? col : '#5a5a6a'; c.strokeStyle = '#1a1a22'; c.lineWidth = 2; c.beginPath(); c.arc(0, -5, 9, Math.PI * 0.8, Math.PI * 2.2); c.lineTo(4, 8); c.lineTo(-4, 8); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#9a9aa8'; c.fillRect(-4, 8, 8, 5); c.restore();
  }
  function clockIcon(c, x, y, t) { c.fillStyle = '#fff6ea'; c.strokeStyle = '#1a1a22'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 11, 0, 7); c.fill(); c.stroke(); c.strokeStyle = '#1a1a22'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 7); c.moveTo(x, y); c.lineTo(x + 5, y + 2); c.stroke(); }
  // the dangling LED: a coloured dome on a rim, with its two legs drawn from the rim to their tips
  function led(c, L, t, lit, blocked) {
    const { x, y } = L, col = LEDC[L.col];
    for (const leg of [L.legs.short, L.legs.long]) { // legs: springy wire from the rim to the tip
      const [bx, by] = base(L, leg), tx = leg.x, ty = leg.y, mx = (bx + tx) / 2 + (leg.long ? 8 * L.side : -6 * L.side), my = Math.max(by, ty) - (ty - by) * 0.2;
      c.strokeStyle = '#2a2a30'; c.lineWidth = 6; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(bx, by);
      if (leg.long) { const kx = bx + L.side * 10, ky = by + 14; c.lineTo(kx, ky); c.quadraticCurveTo((kx + tx) / 2 + 6 * L.side, Math.max(ky, ty) - (ty - ky) * 0.2, tx, ty); } else c.quadraticCurveTo(mx, my, tx, ty);
      c.stroke(); c.strokeStyle = '#e0e0e8'; c.lineWidth = 3.5; c.stroke();
      if (!leg.hole) { c.fillStyle = '#e8e8f0'; c.beginPath(); c.arc(tx, ty, 3.5, 0, 7); c.fill(); }
    }
    if (lit) { const g = c.createRadialGradient(x, y - 6, 4, x, y - 6, 80); g.addColorStop(0, P.rgba ? 'rgba(255,255,255,0.7)' : '#fff'); g.addColorStop(0.25, col + 'aa'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.beginPath(); c.arc(x, y - 6, 80, 0, 7); c.fill(); }
    c.save(); c.translate(x, y); c.scale(K, K); c.translate(-x, -y); c.fillStyle = lit ? P.shade(col, 0.5) : P.shade(col, -0.35); c.strokeStyle = P.shade(col, -0.65); c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(x - 17, y + 14); c.lineTo(x - 17, y - 8); c.arc(x, y - 8, 17, Math.PI, 0); c.lineTo(x + 17, y + 14); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = P.shade(col, lit ? 0.2 : -0.5); c.beginPath(); c.roundRect(x - 21, y + 12, 42, 9, 3); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(x - 8, y - 12, 4, 9, 0.3, 0, 7); c.fill();
    c.restore();
    if (blocked) { c.save(); c.strokeStyle = '#ff4a4a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 10, y - 10); c.lineTo(x + 10, y + 10); c.moveTo(x + 10, y - 10); c.lineTo(x - 10, y + 10); c.stroke(); c.restore(); }
  }
  const K = 1.4, base = (L, leg) => [L.x + leg.base * K, L.y + 21 * K];
  function newLed(x, side, col, pin, gnd) {
    const L = { x, y: 246, side, col, pin, gnd, legs: {} };
    L.legs.long = { long: true, base: side * 9, rx: x + side * 34, ry: 362, hole: null };
    L.legs.short = { long: false, base: -side * 9, rx: x - side * 22, ry: 314, hole: null };
    for (const k of ['long', 'short']) { L.legs[k].x = L.legs[k].rx; L.legs[k].y = L.legs[k].ry; }
    return L;
  }
  return { HY, STEP, SETS, LEDC, holeX, base, paint, bulbIcon, clockIcon, led, newLed };
})();
MG.add({
  id: 'circuits_blink', stage: 'circuits', cmd: 'PLUG IN THE LED TO BLINK IT!', cmdAt: [null, null, 'PLUG IN BOTH LEDS TO BLINK!'], time: 7, mood: 'night', winText: 'It blinks!', failText: 'Wrong way round!',
  card: { title: 'A tiny computer switches a pin', kind: 'Hardware', ref: 'Microcontroller output pins (blinking an LED)',
    text: 'A microcontroller is a tiny computer on a board. Its pins are little metal sockets. The program can switch each pin on, which pushes current out of it, or off.\n\nThis program says: pin on, wait, pin off, wait, again and again. Put an LED between the pin and ground (the return path), and it blinks in time.\n\nAn LED lets current through only one way. Its long leg must face the pin. Turn it round and nothing lights.\n\nBlinking an LED is the first thing almost everyone builds. It is the "hello world" of hardware.',
    note: 'A program switches a microcontroller\'s pins on and off, and an LED on a pin shows it.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); const S = BL.SETS[s.v]; s.L = L;
    if (L < 2) { const one = L === 1 ? { pin: S.one.pin, gnd: S.one.gnd + (S.one.gnd < S.one.pin ? -1 : 1) } : S.one; const gnd = SK.clamp(one.gnd, 0, 8); s.leds = [BL.newLed(180, S.side, S.col, one.pin, gnd === one.pin ? 4 : gnd)]; s.pins = [one.pin]; s.gnd = s.leds[0].gnd; }
    else { s.pins = S.two.pins.slice(); s.gnd = S.two.gnd; s.leds = [BL.newLed(112, S.side, S.col, s.pins[0], s.gnd), BL.newLed(248, -S.side, (S.col + 1) % 4, s.pins[1], s.gnd)]; }
    s.gndUsed = []; s.litSeen = s.leds.map(() => 0); s.doneT = 0; s.badT = 0;
  },
  // the program: step k of the strip; pin i is on during its half of the loop
  pinOn(g, i) { const k = Math.floor(g.t / BL.STEP) % 4; return g.s.L < 2 ? k < 2 : (i === 0 ? k < 2 : k >= 2); },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return; let best = null, bd = 40;
    for (const L of s.leds) for (const k of ['long', 'short']) { const leg = L.legs[k], d = SK.dist(x, y, leg.x, leg.y); if (d < bd) { bd = d; best = leg; } }
    if (!best) return; best.hole = null; SK.dragStart(g, best, x, y); g.sfx('tap');
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const leg = d.obj;
    // into the nearest working hole (a pin or a ground hole) that is free
    const holes = [...s.pins, s.gnd], taken = h => s.leds.some(L => ['long', 'short'].some(k => L.legs[k] !== leg && L.legs[k].hole === h && (h !== s.gnd || false)));
    let best = null, bd = 34; for (const h of holes) { const dd = SK.dist(leg.x, leg.y, BL.holeX(h), BL.HY); if (dd < bd && !taken(h)) { bd = dd; best = h; } }
    if (best != null) { leg.hole = best; leg.x = BL.holeX(best); leg.y = BL.HY; g.sfx('click'); } else { leg.x = leg.rx; leg.y = leg.ry; g.sfx('boing', { vol: 0.4 }); }
  },
  update(g, dt) {
    const s = g.s; if (g.done) return; const def = g.def;
    let allOk = true;
    s.leds.forEach((L, i) => {
      const lo = L.legs.long.hole, sh = L.legs.short.hole, ok = lo === L.pin && sh === s.gnd, back = lo === s.gnd && sh === L.pin;
      L.ok = ok; L.back = back; L.lit = ok && def.pinOn(g, s.pins.indexOf(L.pin));
      if (L.lit && !s.litSeen[i]) { s.litSeen[i] = g.t; g.sfx('ding'); g.burst(L.x, L.y - 8, ['#fff6c0', '#ffd45a', '#ffffff'], 12, 120); }
      if (!ok) { allOk = false; s.litSeen[i] = 0; }
      if (back && def.pinOn(g, s.pins.indexOf(L.pin))) { if (!s.badT) s.badT = g.t; }
    });
    if (s.badT && g.t - s.badT > 0.7) { g.sfx('wrong'); g.sfx('laugh'); g.fail(); return; }
    if (!s.leds.some(L => L.back)) s.badT = 0;
    if (allOk && s.litSeen.every(v => v) && g.t - Math.max(...s.litSeen) > 0.35) { g.sfx('cheer'); g.win(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', def = g.def;
    c.drawImage(g.bake('blink_bg', o => BL.paint(o, s.L)), 0, 0, 360, 640);
    // the program strip, with a glow on the step it is running
    const k = Math.floor(t / BL.STEP) % 4, sx = [69, 141, 219, 291];
    c.fillStyle = 'rgba(10,12,30,0.7)'; c.beginPath(); c.roundRect(28, 134, 304, 64, 14); c.fill();
    for (let i = 0; i < 4; i++) {
      c.fillStyle = i === k ? '#ffe9a0' : '#3a4270'; c.strokeStyle = i === k ? '#fff6ea' : '#5a62a0'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(sx[i] - 30, 142, 60, 48, 10); c.fill(); c.stroke();
      if (i % 2) BL.clockIcon(c, sx[i], 166, t);
      else if (s.L < 2) BL.bulbIcon(c, sx[i], 168, i === 0, 1.15, BL.LEDC[s.leds[0].col]);
      else { BL.bulbIcon(c, sx[i] - 12, 168, i === 0, 0.95, BL.LEDC[s.leds[0].col]); BL.bulbIcon(c, sx[i] + 12, 168, i === 2, 0.95, BL.LEDC[s.leds[1].col]); }
      if (i < 3) { c.fillStyle = '#8a92d0'; c.beginPath(); c.moveTo(sx[i] + 33, 160); c.lineTo(sx[i] + 41, 166); c.lineTo(sx[i] + 33, 172); c.fill(); }
    }
    SK.tag(c, 'Program', 180, 212, 18);
    // pins glow while the program has them on
    s.pins.forEach((p, i) => { if (def.pinOn(g, i)) { const x = BL.holeX(p), gr = c.createRadialGradient(x, BL.HY, 2, x, BL.HY, 26); gr.addColorStop(0, 'rgba(255,230,120,0.95)'); gr.addColorStop(1, 'rgba(255,230,120,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, BL.HY, 26, 0, 7); c.fill(); } });
    s.pins.forEach((p, i) => SK.tag(c, 'Pin ' + (13 - i), SK.clamp(BL.holeX(p), 56, 304), BL.HY + 38 + (i % 2) * 0, 18, '#fff6ea', 'rgba(140,90,10,0.92)'));
    SK.tag(c, 'Ground', SK.clamp(BL.holeX(s.gnd), 56, 304), BL.HY + 38 + (s.L >= 2 ? 36 : 0), 18, '#fff6ea', 'rgba(30,30,40,0.9)');
    SK.tag(c, 'Brain board', 260, 540, 18);
    // current: dots run from the pin up the long leg, through the lit LED, down the short leg to ground
    for (const L of s.leds) {
      const pinOn = def.pinOn(g, s.pins.indexOf(L.pin)), lo = L.legs.long, sh = L.legs.short;
      if ((L.ok || L.back) && pinOn) {
        const run = L.ok ? [[lo.x, lo.y], BL.base(L, lo), BL.base(L, sh), [sh.x, sh.y]] : [[sh.x, sh.y], BL.base(L, sh)];
        const segs = []; let tot = 0; for (let i = 1; i < run.length; i++) { const l = SK.dist(...run[i - 1], ...run[i]); segs.push(l); tot += l; }
        c.fillStyle = '#fff2a0'; for (let d = (t * 120) % 16; d < tot; d += 16) { let r = d, i = 0; while (i < segs.length - 1 && r > segs[i]) { r -= segs[i]; i++; } const f = SK.clamp(r / segs[i], 0, 1), [ax, ay] = run[i], [bx, by] = run[i + 1]; c.beginPath(); c.arc(SK.lerp(ax, bx, f), SK.lerp(ay, by, f), 3, 0, 7); c.fill(); }
      }
      BL.led(c, L, t, L.lit, L.back && pinOn);
    }
    // labels for the legs while they still dangle
    const tl = s.leds.find(L => !L.legs.long.hole); if (tl && !g.done && !SK.dragging(g)) SK.tag(c, 'Long leg', SK.clamp(tl.x + tl.side * 74, 60, 300), tl.y + 70, 18);
    // the owl, by the lamp
    SK.animal(c, 'owl', 50, 612, 0.72, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: 1 });
    // guidance: the next leg and its hole
    const h = !g.done ? BLhint(s) : null;
    if (h) { SK.grab(c, g, h.leg.x, h.leg.y, 18); SK.target(c, g, BL.holeX(h.hole), BL.HY, 14); SK.arrow(c, g, h.leg.x, h.leg.y, BL.holeX(h.hole), BL.HY, { from: 20, to: 26 }); }
    SK.demo(g, c, 'drag', h ? [h.leg.x, h.leg.y] : [0, 0], h ? [BL.holeX(h.hole), BL.HY] : [0, 0], { never: !h });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || g.t < B.next) return;
    const h = BLhint(s); if (!h) return;
    if (SK.bot.drag(g, synth, 'l' + B.n, B.next, [h.leg.x, h.leg.y], [BL.holeX(h.hole), BL.HY], 0.4)) { B.n++; B.next = g.t + 0.2; }
  },
});
// the next step: for each LED in turn, the long leg into its pin, then the short leg into ground
function BLhint(s) {
  for (const L of s.leds) {
    if (L.legs.long.hole !== L.pin) return { leg: L.legs.long, hole: L.pin };
    if (L.legs.short.hole !== s.gnd) return { leg: L.legs.short, hole: s.gnd };
  }
  return null;
}
