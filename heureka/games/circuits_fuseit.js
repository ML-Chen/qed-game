// FUSE IT! (earth_eng EE-10) — a cutaway house wall at night: a fuse box on the left feeds a cable to each appliance (a
// lamp, a kettle, a TV), but its fuse holders are empty. Drag a fuse into each holder, then flip the main switch: current
// flows (dots along every cable) and everything comes on. Then the beaver hangs a picture and its nail goes straight
// through one cable: a short circuit. A huge surge of current rushes through; in that circuit the fuse's thin wire
// melts in a blink and the circuit stops, the cable stays cool, and the other rooms carry on. Switch on with a holder
// still empty and that cable glows orange, then red, smokes and scorches the wall.
// Level 0-1: two circuits (level 1 holders spread apart). Level 2: three.
const FU = (() => {
  const BOX = { x: 18, y: 146, w: 92, h: 300 }, HX = 64, SW = { x: 250, y: 566, w: 170, h: 60 }, TRAY = { x: 70, y: 566 };
  const APPS = ['Lamp', 'Kettle', 'TV'];
  const SETS = [{ wall: ['#3a3048', '#4a3e5a'], hit: 0 }, { wall: ['#2e3a48', '#3e4e5e'], hit: 1 }, { wall: ['#3a3a30', '#4e4e40'], hit: 0 }, { wall: ['#3a2e3a', '#523e50'], hit: 1 }];
  function paint(o, S) {
    N4.vgrad(o, 0, 0, 360, 640, [S.wall[0], S.wall[1], '#2a2430']);
    o.fillStyle = 'rgba(255,255,255,0.04)'; for (let y = 130; y < 500; y += 26) for (let x = (y / 26) % 2 * 26; x < 360; x += 52) o.fillRect(x, y, 48, 22); // bricks
    N4.vgrad(o, 0, 510, 360, 130, ['#6a5040', '#4a3626']);
    // the fuse box
    o.fillStyle = '#c8ccd4'; o.strokeStyle = '#5a5e68'; o.lineWidth = 3; o.beginPath(); o.roundRect(BOX.x, BOX.y, BOX.w, BOX.h, 10); o.fill(); o.stroke();
    o.fillStyle = '#e8eaf0'; o.fillRect(BOX.x + 8, BOX.y + 8, BOX.w - 16, 24); o.fillStyle = '#ffd43a'; o.beginPath(); o.moveTo(BOX.x + 46, BOX.y + 11); o.lineTo(BOX.x + 38, BOX.y + 22); o.lineTo(BOX.x + 46, BOX.y + 22); o.lineTo(BOX.x + 40, BOX.y + 30); o.lineTo(BOX.x + 54, BOX.y + 18); o.lineTo(BOX.x + 46, BOX.y + 18); o.lineTo(BOX.x + 50, BOX.y + 11); o.closePath(); o.fill();
    o.strokeStyle = '#2a2a32'; o.lineWidth = 5; o.beginPath(); o.moveTo(BOX.x + 46, 130); o.lineTo(BOX.x + 46, BOX.y); o.stroke(); // mains in from above
    P.grain(o, 360, 640, 0.03);
  }
  function fuse(c, x, y, blown, glow) {
    c.save(); c.translate(x, y); c.fillStyle = '#c8c8d0'; c.strokeStyle = '#4a4a54'; c.lineWidth = 2; c.beginPath(); c.roundRect(-24, -9, 12, 18, 3); c.fill(); c.stroke(); c.beginPath(); c.roundRect(12, -9, 12, 18, 3); c.fill(); c.stroke();
    c.fillStyle = 'rgba(220,240,255,0.7)'; c.beginPath(); c.roundRect(-13, -7, 26, 14, 4); c.fill(); c.stroke();
    if (blown) { c.fillStyle = 'rgba(40,30,30,0.6)'; c.beginPath(); c.ellipse(0, 0, 9, 5, 0, 0, 7); c.fill(); c.strokeStyle = '#6a6a72'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-13, 0); c.lineTo(-5, 2); c.moveTo(13, 0); c.lineTo(5, -2); c.stroke(); }
    else { c.strokeStyle = glow ? '#ffe080' : '#8a8a94'; c.lineWidth = glow ? 2.5 : 1.5; c.beginPath(); c.moveTo(-13, 0); c.quadraticCurveTo(0, glow ? -3 : 2, 13, 0); c.stroke(); }
    c.restore();
  }
  function app(c, kind, x, y, on, t) {
    if (kind === 'Lamp') { if (on) { const g = c.createRadialGradient(x, y, 4, x, y, 60); g.addColorStop(0, 'rgba(255,240,170,0.8)'); g.addColorStop(1, 'rgba(255,240,170,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 60, 0, 7); c.fill(); }
      c.fillStyle = on ? '#fff2a0' : '#6a6a72'; c.strokeStyle = '#2a2a32'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 13, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#e8803a'; c.beginPath(); c.moveTo(x - 24, y - 6); c.lineTo(x + 24, y - 6); c.lineTo(x + 14, y - 28); c.lineTo(x - 14, y - 28); c.closePath(); c.fill(); c.stroke(); }
    else if (kind === 'Kettle') { c.fillStyle = '#d8dce4'; c.strokeStyle = '#2a2a32'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 20, y - 22, 40, 40, 10); c.fill(); c.stroke(); c.beginPath(); c.moveTo(x + 20, y - 12); c.lineTo(x + 32, y - 18); c.stroke(); c.fillStyle = on ? '#5ad0ff' : '#5a5a62'; c.beginPath(); c.arc(x - 8, y + 8, 4, 0, 7); c.fill();
      if (on) for (let i = 0; i < 3; i++) { const k = (t * 0.9 + i / 3) % 1; c.fillStyle = `rgba(255,255,255,${0.5 * (1 - k)})`; c.beginPath(); c.arc(x + 30 + Math.sin(i + t * 3) * 4, y - 22 - k * 30, 5 + k * 6, 0, 7); c.fill(); } }
    else { c.fillStyle = '#1a1a22'; c.strokeStyle = '#4a4a54'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 30, y - 22, 60, 40, 5); c.fill(); c.stroke(); if (on) { const g = c.createLinearGradient(x - 26, 0, x + 26, 0); g.addColorStop(0, '#5ad0ff'); g.addColorStop(0.5, '#ff8ad8'); g.addColorStop(1, '#ffd45a'); c.fillStyle = g; c.fillRect(x - 25, y - 17, 50, 30); SK.animal(c, 'fox', x, y + 12, 0.32, { t, noShadow: true, expr: 'laugh' }); } }
  }
  return { BOX, HX, SW, TRAY, APPS, SETS, paint, fuse, app };
})();
MG.add({
  id: 'circuits_fuseit', stage: 'circuits', cmd: 'FIT THE FUSES, THEN SWITCH ON!', time: 8, mood: 'night', winText: 'The fuse saved the wire!', failText: 'The wire overheated!',
  card: { title: 'A weak link on purpose', kind: 'Electrical engineering', ref: 'Fuses and short circuits',
    text: 'A short circuit is when current finds a shortcut, like a nail joining two wires. With almost nothing in the way, a huge current rushes through, and the cable heats up until it can start a fire.\n\nA fuse is a deliberately thin wire in the line. A big current melts it in a blink, which breaks the circuit and stops the current before the cable gets hot.\n\nEach room has its own fuse, so a fault in one room leaves the others working. Many homes now use circuit breakers, switches that trip instead of melting.',
    note: 'A fuse melts first, so a short circuit is cut off before it can overheat the wires.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); const S = FU.SETS[s.v]; s.S = S; s.n = L >= 2 ? 3 : 2;
    const ys = s.n === 3 ? [214, 312, 410] : L === 1 ? [204, 404] : [236, 366];
    s.cir = ys.map((y, i) => ({ y, app: FU.APPS[(i + s.v) % 3], fuse: false, blown: false, heat: 0 }));
    s.hit = (S.hit + (L >= 2 ? 1 : 0)) % s.n; s.tray = ys.map((_, i) => ({ x: FU.TRAY.x + (i - (s.n - 1) / 2) * 0, y: FU.TRAY.y, i })).slice(0, 1); // one stack of fuses in the tray
    s.left = s.n; s.drag = null; s.onT = 0; s.shortT = 0; s.blowT = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (N4.inBox(FU.SW, x, y, 12) && !s.onT) { s.onT = g.t; g.sfx('click'); g.sfx('ding', { vol: 0.5 }); return; }
    if (s.left > 0 && SK.dist(x, y, FU.TRAY.x, FU.TRAY.y) < 48) { s.drag = { x: FU.TRAY.x, y: FU.TRAY.y }; SK.dragStart(g, s.drag, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const f = s.drag; s.drag = null;
    const c0 = s.cir.find(c => !c.fuse && SK.dist(f.x, f.y, FU.HX, c.y) < 44); if (c0) { c0.fuse = true; s.left--; g.sfx('click'); g.shake(1, 0.08); } else g.sfx('boing', { vol: 0.4 });
  },
  update(g, dt) {
    const s = g.s; if (g.done || !s.onT) return; const u = g.t - s.onT, C = s.cir[s.hit];
    if (!s.shortT && u > 1.1) { s.shortT = g.t; g.sfx('thud'); g.sfx('snap'); }
    if (s.shortT && !C.blown) {
      if (C.fuse) { if (g.t - s.shortT > 0.15) { C.blown = true; s.blowT = g.t; g.sfx('pop'); g.burst(FU.HX, C.y, ['#fff6c0', '#ffd45a', '#ffffff'], 14, 160); } }
      else { C.heat = Math.min(1, C.heat + dt / 1.3); if (C.heat >= 1) { g.sfx('fire'); g.sfx('laugh'); g.fail(); return; } }
    }
    if (s.blowT && g.t - s.blowT > 0.6) { g.sfx('cheer'); g.win(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', on = !!s.onT, NX = 222;
    c.drawImage(g.bake('fuseit_bg' + s.v, o => FU.paint(o, s.S)), 0, 0, 360, 640);
    SK.tag(c, 'Fuse box', FU.BOX.x + FU.BOX.w / 2, FU.BOX.y + FU.BOX.h + 20, 18);
    s.cir.forEach((C, i) => {
      const live = on && (C.fuse && !C.blown), shorted = s.shortT && i === s.hit && !C.blown, ax = 316;
      // scorch marks behind an overheating cable
      if (C.heat > 0.4) { c.fillStyle = `rgba(20,10,10,${0.5 * C.heat})`; c.beginPath(); c.ellipse(170, C.y, 90 * C.heat, 22 * C.heat, 0, 0, 7); c.fill(); }
      // the cable, glowing as it heats
      const col = C.heat > 0 ? P.mix('#e8e0d0', '#ff3a1a', C.heat) : '#e8e0d0';
      if (C.heat > 0.2) { c.save(); c.strokeStyle = `rgba(255,90,30,${0.5 * C.heat})`; c.lineWidth = 18; c.lineCap = 'round'; c.beginPath(); c.moveTo(FU.HX + 26, C.y); c.lineTo(ax - 34, C.y); c.stroke(); c.restore(); }
      c.strokeStyle = '#2a2a32'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(FU.HX + 24, C.y); c.lineTo(ax - 34, C.y); c.stroke(); c.strokeStyle = col; c.lineWidth = 5; c.stroke();
      // current: steady dots; a fast flood through the nail when it is shorted
      const flowing = (live || (on && !C.fuse)) && !C.blown;
      if (flowing) { const sp = shorted ? 420 : 60, gap = shorted ? 9 : 22, end = shorted ? NX : ax - 36; c.fillStyle = shorted ? '#fff0a0' : '#ffe27a'; for (let x = FU.HX + 26 + (t * sp) % gap; x < end; x += gap) { c.beginPath(); c.arc(x, C.y, shorted ? 3.5 : 2.5, 0, 7); c.fill(); } }
      // the holder, and the fuse in it
      c.fillStyle = '#2a2a32'; c.beginPath(); c.roundRect(FU.HX - 30, C.y - 13, 60, 26, 6); c.fill();
      if (C.fuse) FU.fuse(c, FU.HX, C.y, C.blown, shorted); else { c.strokeStyle = '#ffd45a'; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.roundRect(FU.HX - 26, C.y - 10, 52, 20, 5); c.stroke(); c.setLineDash([]); }
      FU.app(c, C.app, ax, C.y, (live && !(shorted)) || (on && !C.fuse && i !== s.hit), t);
      // the nail through the cable
      if (s.shortT && i === s.hit) { c.fillStyle = '#8a8a94'; c.strokeStyle = '#2a2a32'; c.lineWidth = 2; c.beginPath(); c.roundRect(NX - 3, C.y - 26, 6, 34, 2); c.fill(); c.stroke(); c.beginPath(); c.ellipse(NX, C.y - 26, 9, 3, 0, 0, 7); c.fill(); c.stroke();
        c.fillStyle = '#c8a070'; c.strokeStyle = '#6a4a2a'; c.lineWidth = 3; c.beginPath(); c.roundRect(NX - 30, C.y - 74, 60, 44, 3); c.fill(); c.stroke(); c.fillStyle = '#9ad0f0'; c.fillRect(NX - 24, C.y - 68, 48, 32);
        if (!C.blown && !won) SK.tag(c, 'Short circuit!', 190, C.y + 30, 18, '#fff6ea', 'rgba(200,40,40,0.95)');
        if (C.heat > 0.3) for (let k = 0; k < 4; k++) { const q = (t * 0.8 + k / 4) % 1; c.fillStyle = `rgba(140,140,150,${0.55 * (1 - q) * C.heat})`; c.beginPath(); c.arc(140 + k * 30, C.y - 14 - q * 60, 7 + q * 10, 0, 7); c.fill(); } }
    });
    // the beaver with its hammer, about to hang a picture on the wall
    const Ch = s.cir[s.hit], hamK = on ? SK.clamp((t - s.onT) / 1.1, 0, 1) : 0;
    SK.animal(c, 'beaver', 268, 508, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : hamK > 0 && hamK < 1 ? 'point' : 'idle', expr: won ? 'laugh' : lost || s.shortT ? 'wow' : 'happy', facing: -1 });
    // the tray of fuses
    if (s.left > 0) { for (let k = Math.min(3, s.left) - 1; k >= 0; k--) FU.fuse(c, FU.TRAY.x + k * 4, FU.TRAY.y - k * 6, false, false); SK.tag(c, 'Fuses', FU.TRAY.x, FU.TRAY.y + 32, 18); }
    if (s.drag) FU.fuse(c, s.drag.x, s.drag.y, false, false);
    N4.button(c, FU.SW, on ? 'On' : 'Switch on', { pressed: on, col: on ? '#3ac06a' : '#e8803a', size: 22 });
    // guidance: drag a fuse to the next empty holder; when every holder has one, switch on
    let h = null; if (!g.done && !on && !s.drag) { const e = s.cir.find(C => !C.fuse); h = e ? { k: 'drag', a: [FU.TRAY.x, FU.TRAY.y], b: [FU.HX, e.y] } : { k: 'tap', a: [FU.SW.x + 30, FU.SW.y + 4] }; }
    if (h && h.k === 'drag') { SK.grab(c, g, h.a[0], h.a[1], 28); SK.target(c, g, h.b[0], h.b[1], 0, { w: 60, h: 28 }); SK.arrow(c, g, h.a[0], h.a[1], h.b[0], h.b[1]); }
    if (h && h.k === 'tap') SK.glow(c, g, FU.SW.x, FU.SW.y, 54, '#a8ffb8', { level: 2 });
    SK.demo(g, c, h ? h.k : 'tap', h ? h.a : [0, 0], h ? h.b : null, { never: !h });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || s.onT || g.t < B.next) return; const e = s.cir.find(C => !C.fuse);
    if (!e) { synth('down', FU.SW.x, FU.SW.y); synth('up', FU.SW.x, FU.SW.y); return; }
    if (SK.bot.drag(g, synth, 'f' + B.n, B.next, [FU.TRAY.x, FU.TRAY.y], [FU.HX, e.y], 0.4)) { B.n++; B.next = g.t + 0.2; }
  },
});
