// LATCH! (earth_eng EE-21) — you are the clock. The data streams past as a conveyor of beads, lit (1) or dark (0),
// sliding under the flip-flop chip's window. Each tap is one clock tick: at that instant the chip copies the bead in its
// window into its memory light, which then holds still while the beads keep moving, and the bit drops into the next
// memory cell. Fill the cells to match the lock's pattern, shown right above them. Tick at the wrong moment and the
// wrong bit is stored: that cell flashes red and stays empty. Level 2: the beads move faster, and the code has five bits.
const GX = 180, BELTY = 214, CHIP = { x: 180, y: 322 }, CODEY = 448, CELLY = 516, SEGW = 64;
const CFG = [{ dur: 0.62, n: 4 }, { dur: 0.5, n: 4 }, { dur: 0.4, n: 5 }];
function paintBoard(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#0e3a2a'); bg.addColorStop(1, '#0a2a20'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(21); o.strokeStyle = 'rgba(120,220,150,0.13)'; o.lineWidth = 3; o.lineCap = 'round'; // copper traces
  for (let i = 0; i < 26; i++) { let x = rnd() * 360, y = rnd() * 640; o.beginPath(); o.moveTo(x, y); for (let k = 0; k < 3; k++) { if (rnd() < 0.5) x += (rnd() - 0.5) * 160; else y += (rnd() - 0.5) * 160; o.lineTo(x, y); } o.stroke(); o.fillStyle = 'rgba(200,170,90,0.25)'; o.beginPath(); o.arc(x, y, 4, 0, 7); o.fill(); }
  // the conveyor belt the data beads ride on, with rollers at the ends
  o.fillStyle = 'rgba(0,0,0,0.35)'; o.beginPath(); o.roundRect(4, BELTY - 30, 352, 60, 30); o.fill();
  o.fillStyle = '#2a2a30'; o.beginPath(); o.roundRect(10, BELTY - 24, 340, 48, 24); o.fill();
  o.strokeStyle = 'rgba(255,255,255,0.08)'; o.lineWidth = 2; for (let x = 24; x < 340; x += 16) { o.beginPath(); o.moveTo(x, BELTY - 22); o.lineTo(x - 6, BELTY + 22); o.stroke(); }
  for (const x of [26, 334]) { o.fillStyle = '#5a5a66'; o.beginPath(); o.arc(x, BELTY, 18, 0, 7); o.fill(); o.fillStyle = '#3a3a44'; o.beginPath(); o.arc(x, BELTY, 6, 0, 7); o.fill(); }
  // the flip-flop chip with its legs, and its window over the belt
  o.fillStyle = '#c8c8d0'; for (let i = 0; i < 4; i++) { o.fillRect(CHIP.x - 40 + i * 24, CHIP.y + 34, 8, 12); }
  o.strokeStyle = '#c8a04a'; o.lineWidth = 5; o.beginPath(); o.moveTo(GX, BELTY + 34); o.lineTo(GX, CHIP.y - 36); o.stroke();
  o.fillStyle = '#16161c'; o.beginPath(); o.roundRect(CHIP.x - 64, CHIP.y - 36, 128, 72, 10); o.fill(); o.strokeStyle = '#3a3a48'; o.lineWidth = 2; o.stroke();
  o.fillStyle = '#2a2a34'; o.beginPath(); o.arc(CHIP.x - 50, CHIP.y - 22, 5, 0, 7); o.fill();
  // the wire from the chip's memory light down to the cells
  o.strokeStyle = '#c8a04a'; o.lineWidth = 4; o.beginPath(); o.moveTo(CHIP.x, CHIP.y + 46); o.lineTo(CHIP.x, CODEY - 34); o.stroke();
  // the lock: its pattern sits right above the memory cells
  o.fillStyle = '#2a2a34'; o.beginPath(); o.roundRect(24, CODEY - 30, 312, 110, 16); o.fill(); o.strokeStyle = '#c8a04a'; o.lineWidth = 4; o.stroke();
  o.fillStyle = '#c8a04a'; o.beginPath(); o.arc(318, CODEY + 25, 9, 0, 7); o.fill(); o.fillRect(314, CODEY + 25, 8, 18); // keyhole
}
function lamp(c, x, y, r, on, col = '#ffd24a', off = '#2a2a34') {
  c.fillStyle = '#0a0a10'; c.beginPath(); c.arc(x, y, r + 4, 0, 7); c.fill();
  if (on) { const gr = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r); gr.addColorStop(0, '#fffbe0'); gr.addColorStop(0.5, col); gr.addColorStop(1, P.shade(col, -0.4)); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.save(); c.globalAlpha = 0.25; c.fillStyle = col; c.beginPath(); c.arc(x, y, r * 1.8, 0, 7); c.fill(); c.restore(); }
  else { c.fillStyle = off; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
}
MG.add({
  id: 'latch', stage: 'circuits', cmd: 'TAP TO STORE THE CODE!', time: 7, mood: 'night', winText: 'Code stored!', failText: 'Not stored!',
  card: { title: 'Memory that copies on the tick', kind: 'Engineering', ref: 'The D flip-flop',
    text: 'A flip-flop is a tiny memory that holds one bit: a 1 (lit) or a 0 (dark). It has a data input and a clock input. Whatever the data says at the instant the clock ticks is copied into the memory. Between ticks, the data can wiggle all it likes and the memory stays the same.\n\nHere you are the clock: each tap is one tick. Chips are full of flip-flops, and a real clock ticks billions of times a second, so every bit moves along in step. A row of flip-flops filled one tick at a time, like this one, is called a shift register.',
    note: 'A flip-flop copies its input only at the tick of the clock and holds it until the next tick.' },
  init(g) {
    const s = g.s, C = CFG[Math.min(2, g.level)]; s.C = C;
    // the code: never all the same; the data stream: random bits, with every needed bit coming round often
    const CODES = C.n === 4 ? [[1, 0, 1, 1], [0, 1, 1, 0], [1, 1, 0, 1], [0, 0, 1, 1], [1, 0, 0, 1], [0, 1, 0, 1]] : [[1, 0, 1, 1, 0], [0, 1, 1, 0, 1], [1, 1, 0, 0, 1], [0, 1, 0, 1, 1], [1, 0, 0, 1, 0], [0, 0, 1, 1, 0]];
    s.v = SK.variant(g, CODES.length); s.code = CODES[s.v].slice(); // a different lock code from the last play
    s.bits = []; let last = 0; for (let i = 0; i < 80; i++) { let b = g.rand() < 0.5 ? 1 : 0; if (i > 1 && b === last && s.bits[i - 2] === last && g.rand() < 0.7) b = 1 - b; s.bits.push(b); last = b; }
    s.cells = []; s.q = 0; s.tick = 0; s.bad = 0; s.fly = null; s.taps = 0;
  },
  down(g) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const i = Math.floor(g.t / s.C.dur), d = s.bits[i % s.bits.length]; s.q = d; s.tick = g.t; s.taps++; g.sfx('click');
    const want = s.code[s.cells.length];
    if (d === want) { s.cells.push(d); s.fly = { b: d, t: g.t }; g.sfx(d ? 'ding' : 'tap'); if (s.cells.length >= s.C.n) { g.win(); g.sfx('cheer'); g.burst(180, 171, ['#ffd24a', '#7aff9a'], 24, 180); } }
    else { s.bad = g.t; g.sfx('wrong'); }
  },
  update() {},
  draw(g, c) {
    const s = g.s, t = g.t, C = s.C, v = SEGW / C.dur, won = g.result === 'win';
    c.drawImage(g.bake('latch_board', paintBoard), 0, 0, 360, 640);
    // the data: beads on the belt, sliding leftwards; the one in the chip's window is what a tick would store
    const beadX = i => GX + ((i + 0.5) * C.dur - t) * v, i0 = Math.floor(t / C.dur);
    for (let i = Math.max(0, i0 - 4); i < i0 + 5; i++) { const x = beadX(i); if (x < -20 || x > 380) continue; lamp(c, x, BELTY, 14, s.bits[i % s.bits.length], '#5ae0ff', '#1e2a34'); }
    const dNow = s.bits[i0 % s.bits.length];
    // the window turns green while the bead in it is the bit the lock wants next: that is the moment to tick
    const match = !g.done && dNow === s.code[s.cells.length];
    c.save(); c.strokeStyle = match ? '#5aff8a' : '#ffffff'; c.lineWidth = match ? 5 : 3; if (!match) c.setLineDash([6, 5]); c.beginPath(); c.roundRect(GX - 26, BELTY - 28, 52, 56, 10); c.stroke(); c.restore();
    // the clock: your tap is the tick; the chip flashes and its window snaps like a shutter
    const tk = s.tick ? Math.max(0, 1 - (t - s.tick) / 0.25) : 0;
    if (tk) { c.save(); c.globalAlpha = tk; c.fillStyle = '#fff6c0'; c.beginPath(); c.roundRect(GX - 26, BELTY - 28, 52, 56, 10); c.fill(); c.strokeStyle = '#ffe27a'; c.lineWidth = 3; c.beginPath(); c.roundRect(CHIP.x - 70, CHIP.y - 42, 140, 84, 12); c.stroke(); c.restore(); }
    c.save(); c.translate(CHIP.x - 40, CHIP.y + 4); c.strokeStyle = tk ? '#ffe27a' : '#8a8a96'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 14, 0, 7); c.stroke(); c.rotate(t * 3); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -10); c.stroke(); c.restore(); // a little clock face
    // the chip's memory light: changes only at a tick, then holds while the beads move on
    lamp(c, CHIP.x + 22, CHIP.y, 20, s.q, s.bad && t - s.bad < 0.5 ? '#ff5a5a' : '#5ae0ff', '#1e2a34');
    // the lock's pattern, with each memory cell right below its bead
    const cw = Math.min(56, 280 / C.n), cx = i => 170 + (i - (C.n - 1) / 2) * cw;
    for (let i = 0; i < C.n; i++) lamp(c, cx(i), CODEY, 13, s.code[i], won ? '#7aff9a' : '#5ae0ff', '#1e2a34');
    for (let i = 0; i < C.n; i++) { const x = cx(i), has = i < s.cells.length, next = i === s.cells.length && !g.done; c.fillStyle = '#16161c'; c.beginPath(); c.roundRect(x - 22, CELLY - 24, 44, 48, 8); c.fill(); c.strokeStyle = next ? '#ffe27a' : 'rgba(200,160,74,0.6)'; c.lineWidth = next ? 3 : 2; c.stroke(); if (has) lamp(c, x, CELLY, 14, s.cells[i], won ? '#7aff9a' : '#5ae0ff', '#1e2a34'); if (next && s.bad && t - s.bad < 0.5) { c.strokeStyle = '#ff5a5a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 10, CELLY - 10); c.lineTo(x + 10, CELLY + 10); c.moveTo(x + 10, CELLY - 10); c.lineTo(x - 10, CELLY + 10); c.stroke(); } }
    if (!g.done) { const i = s.cells.length; c.fillStyle = '#ffe27a'; c.beginPath(); c.moveTo(cx(i), CODEY + 20); c.lineTo(cx(i) - 6, CODEY + 30); c.lineTo(cx(i) + 6, CODEY + 30); c.fill(); }
    // the lock: its shackle springs open once every bit is stored
    { const op = won ? SK.easeOut((t - g.doneAt) / 0.4) : 0, lx = 318, ly = CODEY - 6; c.save(); c.strokeStyle = won ? '#7aff9a' : '#c8a04a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(lx - 12, ly - op * 16); c.lineTo(lx - 12, ly - 16 - op * 16); c.arc(lx, ly - 16 - op * 16, 12, Math.PI, 0); c.lineTo(lx + 12, ly - op * 6); c.stroke(); c.restore(); }
    // the stored bit flying from the memory light into its cell
    if (s.fly && t - s.fly.t < 0.3) { const k = SK.easeInOut((t - s.fly.t) / 0.3), i = s.cells.length - 1, x = SK.lerp(CHIP.x + 22, cx(i), k), y = SK.lerp(CHIP.y, CELLY, k); lamp(c, x, y, 10, s.fly.b, '#5ae0ff', '#1e2a34'); }
    SK.tag(c, 'Data', 46, BELTY - 44, 18); SK.tag(c, 'Flip-flop', CHIP.x + 112, CHIP.y, 18); SK.tag(c, 'Lock code', CHIP.x, CODEY - 52, 18); SK.tag(c, 'Memory', CHIP.x, CELLY + 44, 18);
    if (!g.done) SK.glow(c, g, GX, BELTY, 40);
    // the frog
    SK.animal(c, 'frog', 56, 612, 0.9, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : g.result === 'fail' ? 'sad' : s.bad && t - s.bad < 0.6 ? 'wow' : 'think' });
    // the ghost hand presses only while the wanted bit sits in the window (copy it and you store the right bit)
    { const ph = t / C.dur - i0; G2.tapAt(g, c, GX, BELTY + 8, match && ph > 0.3 && ph < 0.7 ? 1 : 0); }
  },
  auto(g, dt, synth) { // tick in the middle of a stretch where the data matches the next bit of the code
    const s = g.s; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {}; if (B.next && g.t < B.next) return;
    const i = Math.floor(g.t / s.C.dur), ph = g.t / s.C.dur - i; if (ph < 0.35 || ph > 0.7) return;
    if (s.bits[i % s.bits.length] === s.code[s.cells.length]) { synth('down', CHIP.x, CHIP.y); synth('up', CHIP.x, CHIP.y); B.next = g.t + s.C.dur * 0.6; }
  },
});
