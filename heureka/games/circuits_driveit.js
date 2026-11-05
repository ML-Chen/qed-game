// DRIVE IT! (hardware EB-11) — a workbench: a brain board's pin is wired straight to the motor of a little robot car,
// and a flag waits at the end of the bench. A pin can only give a trickle of current, far too little for a motor:
// press Run like this and the motor twitches, the pin glows red hot and puffs smoke. Drag the motor-driver chip into its
// socket (the wire now goes pin -> driver -> motor), then plug the big battery into the driver's power socket, then
// press Run: the pin's trickle of dots switches the driver, a river of dots flows from the battery through the motor,
// the wheels spin hard and the car drives to the flag.
// Level 0-1: one motor. Level 2: two motors (both wheels), so the second motor's wire goes into the driver's second
// output too; with one motor wired, the car only spins round on the spot.
const DV = (() => {
  const BOARD = { x: 14, y: 146, w: 112, h: 100 }, SOCK = { x: 200, y: 196, w: 68, h: 54 }, PWR = { x: 268, y: 204 }, OUTB = { x: 178, y: 262 };
  const BAT = { x: 234, y: 290, w: 112, h: 64 }, PLUG0 = { x: 316, y: 256 }, CHIP0 = { x: 84, y: 330 }, RUN = { x: 270, y: 452, w: 140, h: 56 }, CAR_Y = 560, FLAG = 320;
  const SETS = [{ pin: 9, wall: ['#20304a', '#304a6a'], car: '#e8563a' }, { pin: 5, wall: ['#2a2444', '#463a6a'], car: '#3aa8e8' }, { pin: 6, wall: ['#1e3a3a', '#2e5656'], car: '#e8b43a' }, { pin: 10, wall: ['#3a2a3a', '#5a3a52'], car: '#5ac06a' }];
  function paint(o, S) {
    N4.vgrad(o, 0, 0, 360, 640, [S.wall[0], S.wall[1], '#2a2a3a']);
    o.fillStyle = 'rgba(255,255,255,0.04)'; for (let y = 130; y < 500; y += 22) for (let x = 10; x < 360; x += 22) { o.beginPath(); o.arc(x, y, 1.8, 0, 7); o.fill(); }
    N4.vgrad(o, 0, 500, 360, 140, ['#8a6040', '#6a4628']); o.fillStyle = '#a07a50'; o.fillRect(0, 496, 360, 8);
    // the board
    const bg = o.createLinearGradient(0, BOARD.y, 0, BOARD.y + BOARD.h); bg.addColorStop(0, '#2a7ad0'); bg.addColorStop(1, '#1a5aa8'); o.fillStyle = bg; o.strokeStyle = '#0e3a70'; o.lineWidth = 3; o.beginPath(); o.roundRect(BOARD.x, BOARD.y, BOARD.w, BOARD.h, 10); o.fill(); o.stroke();
    o.fillStyle = '#1a1a22'; o.beginPath(); o.roundRect(BOARD.x + 30, BOARD.y + 34, 50, 40, 4); o.fill(); o.fillStyle = '#c8c8d0'; for (let i = 0; i < 4; i++) { o.fillRect(BOARD.x + 34 + i * 12, BOARD.y + 30, 5, 5); o.fillRect(BOARD.x + 34 + i * 12, BOARD.y + 73, 5, 5); }
    // the empty socket
    o.fillStyle = '#2a2a32'; o.strokeStyle = '#6a6a7a'; o.lineWidth = 2; o.beginPath(); o.roundRect(SOCK.x - SOCK.w / 2, SOCK.y - SOCK.h / 2, SOCK.w, SOCK.h, 6); o.fill(); o.stroke();
    o.fillStyle = '#0a0a10'; for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { o.beginPath(); o.arc(SOCK.x - 21 + i * 14, SOCK.y + s * 20, 3, 0, 7); o.fill(); }
    // the flag at the end of the bench
    o.fillStyle = '#c8c8d0'; o.fillRect(FLAG + 12, 470, 4, 64); o.fillStyle = '#ffd45a'; o.beginPath(); o.moveTo(FLAG + 16, 472); o.lineTo(FLAG + 44, 482); o.lineTo(FLAG + 16, 494); o.closePath(); o.fill();
    o.fillStyle = 'rgba(255,255,255,0.12)'; for (let x = 10; x < 360; x += 30) o.fillRect(x, 590, 16, 4);
    P.grain(o, 360, 640, 0.03);
  }
  function chip(c, x, y, lit) {
    c.fillStyle = '#c8c8d0'; for (let i = 0; i < 4; i++) for (const s of [-1, 1]) c.fillRect(x - 24 + i * 14, y + s * 20 - 4, 6, 8);
    c.fillStyle = lit ? '#3a3a52' : '#1e1e2a'; c.strokeStyle = '#0a0a10'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 32, y - 18, 64, 36, 5); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.beginPath(); c.arc(x - 24, y - 10, 3, 0, 7); c.fill();
    if (lit) { c.fillStyle = '#8affb0'; c.beginPath(); c.arc(x + 22, y - 9, 3, 0, 7); c.fill(); }
  }
  function battery(c) { const { x, y, w, h } = BAT;
    c.fillStyle = '#2a2a32'; c.strokeStyle = '#0a0a10'; c.lineWidth = 3; c.beginPath(); c.roundRect(x, y, w, h, 10); c.fill(); c.stroke();
    for (let i = 0; i < 4; i++) { const gx = x + 8 + i * 27; const gg = c.createLinearGradient(gx, 0, gx + 22, 0); gg.addColorStop(0, '#5ac06a'); gg.addColorStop(1, '#2a8a3a'); c.fillStyle = gg; c.beginPath(); c.roundRect(gx, y + 10, 22, h - 20, 6); c.fill(); c.fillStyle = '#c8c8d0'; c.fillRect(gx + 7, y + 6, 8, 5); }
  }
  function car(c, S, x, y, t, spin, rot) {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = S.car; c.strokeStyle = P.shade(S.car, -0.55); c.lineWidth = 3; c.beginPath(); c.roundRect(-46, -34, 92, 30, 10); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(-40, -30, 80, 5);
    // the motor on the back axle
    c.fillStyle = '#8a8a9a'; c.strokeStyle = '#2a2a3a'; c.beginPath(); c.roundRect(-30, -50, 34, 18, 6); c.fill(); c.stroke(); c.fillStyle = '#c87a3a'; c.fillRect(-26, -46, 26, 4);
    for (const wx of [-28, 28]) { c.save(); c.translate(wx, 0); c.rotate(spin); c.fillStyle = '#1e1e26'; c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fill(); c.strokeStyle = '#8a8a9a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-9, 0); c.lineTo(9, 0); c.moveTo(0, -9); c.lineTo(0, 9); c.stroke(); c.restore(); }
    c.restore();
  }
  return { BOARD, SOCK, PWR, OUTB, BAT, PLUG0, CHIP0, RUN, CAR_Y, FLAG, SETS, paint, chip, battery, car };
})();
MG.add({
  id: 'circuits_driveit', stage: 'circuits', cmd: 'ADD THE DRIVER, THEN RUN THE CAR!', time: 8, mood: 'night', winText: 'Full power!', failText: 'Pin overheated!',
  card: { title: 'A small signal switches a big current', kind: 'Hardware', ref: 'Motor driver (a transistor switch)',
    text: 'A microcontroller pin can only give a tiny current, enough for an LED. A motor needs far more. Wire a motor straight to a pin and the motor barely twitches, and the pin can overheat and break.\n\nA motor driver chip fixes this. The pin\'s small signal tells the driver when to switch on. The driver then lets a big current flow from a battery through the motor.\n\nIt works like a tap: your hand gives a little push, and the water comes from the pipe, not from your hand.',
    note: 'A pin is too weak to run a motor, so a motor driver uses the pin\'s small signal to switch a battery\'s big current.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.S = DV.SETS[s.v]; s.L = L; s.two = L >= 2;
    s.chip = { x: DV.CHIP0.x, y: DV.CHIP0.y, in: false }; s.plug = { x: DV.PLUG0.x, y: DV.PLUG0.y, in: false }; s.wireB = { x: 120, y: 440, in: !s.two };
    s.run = 0; s.heat = 0; s.carX = 70; s.rot = 0; s.spin = 0; s.phase = 'build'; s.smokeT = 0; s.drag = null;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.run) return;
    if (N4.inBox(DV.RUN, x, y, 10)) { s.run = g.t; g.sfx('click'); return; }
    const items = [s.chip, s.plug, s.wireB].filter(o => !o.in || o === s.plug || o === s.chip), k = SK.pick(items.filter(o => !(o === s.wireB && s.wireB.in)), x, y, 46);
    if (k) { if (k.in) k.in = false; s.drag = k; SK.dragStart(g, k, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const o = d.obj; s.drag = null;
    if (o === s.chip) { if (SK.dist(o.x, o.y, DV.SOCK.x, DV.SOCK.y) < 50) { o.in = true; o.x = DV.SOCK.x; o.y = DV.SOCK.y; g.sfx('click'); g.shake(1.5, 0.1); } else { o.x = DV.CHIP0.x; o.y = DV.CHIP0.y; g.sfx('boing', { vol: 0.4 }); } }
    if (o === s.plug) { if (s.chip.in && SK.dist(o.x, o.y, DV.PWR.x, DV.PWR.y) < 44) { o.in = true; o.x = DV.PWR.x; o.y = DV.PWR.y; g.sfx('click'); } else { o.x = DV.PLUG0.x; o.y = DV.PLUG0.y; g.sfx('boing', { vol: 0.4 }); } }
    if (o === s.wireB) { if (s.chip.in && SK.dist(o.x, o.y, DV.OUTB.x, DV.OUTB.y) < 40) { o.in = true; o.x = DV.OUTB.x; o.y = DV.OUTB.y; g.sfx('click'); } else { o.x = 120; o.y = 440; g.sfx('boing', { vol: 0.4 }); } }
  },
  update(g, dt) {
    const s = g.s; if (!s.run || g.done) return; const u = g.t - s.run;
    if (!s.chip.in) { // the motor hangs straight on the pin: it twitches and the pin overheats
      s.heat = Math.min(1, u / 1.1); s.spin += Math.sin(u * 40) * 0.05; if (u > 1.2) { s.smokeT = g.t; g.sfx('fire'); g.sfx('laugh'); g.fail(); } return; }
    if (!s.plug.in) { if (u > 1.0) { s.run = 0; g.sfx('wrong'); } return; } // the driver has no power: nothing turns, try again
    if (!s.wireB.in) { s.rot += dt * 6; s.spin += dt * 20; if (u > 1.2) { s.run = 0; s.rot = 0; g.sfx('boing'); } return; } // one wheel only: it spins on the spot
    const v = Math.min(320, u * 600); s.carX += v * dt; s.spin += v * dt / 15; if (g.rand() < 0.2) g.sfx('whoosh', { vol: 0.3 });
    if (s.carX >= DV.FLAG - 30) { s.carX = DV.FLAG - 30; g.sfx('cheer'); g.win(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, won = g.result === 'win', lost = g.result === 'fail', running = !!s.run && !g.done;
    c.drawImage(g.bake('driveit_bg' + s.v, o => DV.paint(o, S)), 0, 0, 360, 640);
    const pinX = DV.BOARD.x + DV.BOARD.w, pinY = DV.SOCK.y - 20, motor = [s.carX - 13, DV.CAR_Y - 50];
    // the pin: red hot when it is forced to run the motor by itself
    c.fillStyle = P.mix('#c8c8d0', '#ff3a2a', s.heat); c.beginPath(); c.roundRect(pinX - 4, pinY - 7, 12, 14, 3); c.fill();
    if (s.heat > 0.2) { const gr = c.createRadialGradient(pinX, pinY, 2, pinX, pinY, 30); gr.addColorStop(0, `rgba(255,90,40,${0.8 * s.heat})`); gr.addColorStop(1, 'rgba(255,90,40,0)'); c.fillStyle = gr; c.beginPath(); c.arc(pinX, pinY, 30, 0, 7); c.fill(); }
    if (lost) for (let i = 0; i < 4; i++) { const k = ((t - s.smokeT) * 0.8 + i / 4) % 1; c.fillStyle = `rgba(150,150,160,${0.6 * (1 - k)})`; c.beginPath(); c.arc(pinX + Math.sin(i * 2 + t) * 8, pinY - 10 - k * 70, 7 + k * 12, 0, 7); c.fill(); }
    SK.tag(c, 'Pin ' + S.pin, DV.BOARD.x + 62, DV.BOARD.y - 18, 18, '#fff6ea', 'rgba(140,90,10,0.92)');
    // wires: thin signal wire from the pin; thick power wires from the battery once the driver is in
    const wire = (pts, col, w) => { c.strokeStyle = '#0a0a10'; c.lineWidth = w + 3; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
    const dots = (pts, n, sp, col, r) => { let tot = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = SK.dist(...pts[i - 1], ...pts[i]); seg.push(l); tot += l; } c.fillStyle = col; for (let d = (t * sp) % (tot / n); d < tot; d += tot / n) { let r0 = d, i = 0; while (i < seg.length - 1 && r0 > seg[i]) { r0 -= seg[i]; i++; } const f = SK.clamp(r0 / seg[i], 0, 1); c.beginPath(); c.arc(SK.lerp(pts[i][0], pts[i + 1][0], f), SK.lerp(pts[i][1], pts[i + 1][1], f), r, 0, 7); c.fill(); } };
    const inA = [DV.SOCK.x - 21, DV.SOCK.y - 20], outA = [DV.SOCK.x + 21, DV.SOCK.y + 20];
    const sig = s.chip.in ? [[pinX + 4, pinY], [inA[0], pinY], inA] : [[pinX + 4, pinY], [150, pinY], [150, 420], [motor[0], 420], motor];
    wire(sig, '#e8c040', 3);
    if (s.chip.in) wire([outA, [outA[0], 420], [motor[0] + 6, 420], [motor[0] + 6, motor[1]]], '#e84040', 6);
    // the battery and its plug
    DV.battery(c); SK.tag(c, 'Battery', DV.BAT.x + DV.BAT.w / 2, DV.BAT.y + DV.BAT.h + 18, 18);
    wire([[DV.BAT.x + DV.BAT.w - 20, DV.BAT.y], [DV.BAT.x + DV.BAT.w - 20, DV.BAT.y - 10], [s.plug.x, s.plug.y]], '#e84040', 6);
    c.fillStyle = '#e84040'; c.strokeStyle = '#0a0a10'; c.lineWidth = 2; c.beginPath(); c.roundRect(s.plug.x - 11, s.plug.y - 9, 22, 18, 4); c.fill(); c.stroke();
    // the power socket on the driver
    if (s.chip.in && !s.plug.in) { c.fillStyle = '#0a0a10'; c.beginPath(); c.roundRect(DV.PWR.x - 12, DV.PWR.y - 10, 24, 20, 4); c.fill(); c.strokeStyle = '#e84040'; c.lineWidth = 2; c.stroke(); }
    if (s.chip.in) wire([[DV.SOCK.x + 30, DV.PWR.y], [DV.PWR.x - 12, DV.PWR.y]], '#e84040', 6);
    // level 2: the second motor's wire
    if (s.two) { const end = s.wireB.in ? [DV.OUTB.x, DV.OUTB.y] : [s.wireB.x, s.wireB.y]; wire([[s.carX + 20, DV.CAR_Y - 40], [s.carX + 30, 470], end], '#e84040', 5); c.fillStyle = '#c8c8d0'; c.beginPath(); c.arc(end[0], end[1], 7, 0, 7); c.fill();
      if (s.chip.in && !s.wireB.in) { c.strokeStyle = '#e84040'; c.lineWidth = 3; c.beginPath(); c.arc(DV.OUTB.x, DV.OUTB.y, 9, 0, 7); c.stroke(); } }
    // the chip (in its socket or waiting on the bench)
    DV.chip(c, s.chip.x, s.chip.y, s.chip.in && s.plug.in && running);
    SK.tag(c, 'Motor driver', s.chip.in ? DV.SOCK.x - 10 : s.chip.x, (s.chip.in ? DV.SOCK.y : s.chip.y) - 44, 18);
    // current: a trickle from the pin; a river from the battery through the motor once the driver switches
    if (running) { dots(sig, s.chip.in ? 4 : 5, 40, '#fff2a0', 2.5);
      if (s.chip.in && s.plug.in) { dots([[DV.BAT.x + DV.BAT.w - 20, DV.BAT.y], [DV.BAT.x + DV.BAT.w - 20, DV.BAT.y - 10], [s.plug.x, s.plug.y], [DV.SOCK.x + 30, DV.PWR.y], outA, [outA[0], 420], [motor[0] + 6, 420], [motor[0] + 6, motor[1]]], 30, 260, '#ffd45a', 4); } }
    // the car
    DV.car(c, S, s.carX, DV.CAR_Y, t, s.spin, s.rot * (s.two && !s.wireB.in ? 1 : 0) * 0.25);
    SK.tag(c, 'Motor', s.carX - 13, DV.CAR_Y - 72, 18);
    SK.animal(c, 'hedgehog', 26, 606, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // the run button
    N4.button(c, DV.RUN, running ? 'Running...' : 'Run', { pressed: running, col: '#3ac06a', size: 22 });
    // guidance: chip into the socket, battery into the driver, (level 2) second motor into the driver, then Run
    let h = null; if (!g.done && !s.run && !s.drag) {
      if (!s.chip.in) h = { k: 'drag', a: [s.chip.x, s.chip.y], b: [DV.SOCK.x, DV.SOCK.y] };
      else if (!s.plug.in) h = { k: 'drag', a: [s.plug.x, s.plug.y], b: [DV.PWR.x, DV.PWR.y] };
      else if (!s.wireB.in) h = { k: 'drag', a: [s.wireB.x, s.wireB.y], b: [DV.OUTB.x, DV.OUTB.y] };
      else h = { k: 'tap', a: [DV.RUN.x, DV.RUN.y] };
    }
    if (h && h.k === 'drag') { SK.grab(c, g, h.a[0], h.a[1], 24); SK.target(c, g, h.b[0], h.b[1], 18); SK.arrow(c, g, h.a[0], h.a[1], h.b[0], h.b[1]); }
    if (h && h.k === 'tap') SK.glow(c, g, DV.RUN.x, DV.RUN.y, 50, '#a8ffb8', { level: 2 });
    SK.demo(g, c, h ? h.k : 'tap', h ? h.a : [0, 0], h ? h.b : null, { never: !h });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || s.run || g.t < B.next) return;
    let a, b; if (!s.chip.in) { a = [s.chip.x, s.chip.y]; b = [DV.SOCK.x, DV.SOCK.y]; } else if (!s.plug.in) { a = [s.plug.x, s.plug.y]; b = [DV.PWR.x, DV.PWR.y]; } else if (!s.wireB.in) { a = [s.wireB.x, s.wireB.y]; b = [DV.OUTB.x, DV.OUTB.y]; }
    else { synth('down', DV.RUN.x, DV.RUN.y); synth('up', DV.RUN.x, DV.RUN.y); B.next = g.t + 0.5; return; }
    if (SK.bot.drag(g, synth, 'd' + B.n, B.next, a, b, 0.4)) { B.n++; B.next = g.t + 0.2; }
  },
});
