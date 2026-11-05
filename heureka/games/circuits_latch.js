// LATCH! (earth_eng EE-21) — you are the clock. A data line wiggles high and low as it streams past a flip-flop chip;
// each tap is one clock tick, and at that instant the chip copies whatever the data says into its memory light, which
// then holds still while the data keeps wiggling. Store the four bits of the lock's code, one tick each, into the row of
// memory cells. Tick at the wrong moment and the wrong bit is stored: that cell flashes and empties. Level 2: the data
// changes faster, and the code is five bits long.
const GX = 180, WAVE = { y1: 280, y0: 344 }, CHIP = { x: 180, y: 432 }, CELLY = 528, SEGW = 64;
const CFG = [{ dur: 0.62, n: 4 }, { dur: 0.5, n: 4 }, { dur: 0.4, n: 5 }];
function paintBoard(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#0e3a2a'); bg.addColorStop(1, '#0a2a20'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(21); o.strokeStyle = 'rgba(120,220,150,0.13)'; o.lineWidth = 3; o.lineCap = 'round'; // copper traces
  for (let i = 0; i < 26; i++) { let x = rnd() * 360, y = rnd() * 640; o.beginPath(); o.moveTo(x, y); for (let k = 0; k < 3; k++) { if (rnd() < 0.5) x += (rnd() - 0.5) * 160; else y += (rnd() - 0.5) * 160; o.lineTo(x, y); } o.stroke(); o.fillStyle = 'rgba(200,170,90,0.25)'; o.beginPath(); o.arc(x, y, 4, 0, 7); o.fill(); }
  // the lock's code panel at the top
  o.fillStyle = '#2a2a34'; o.beginPath(); o.roundRect(54, 128, 252, 86, 16); o.fill(); o.strokeStyle = '#c8a04a'; o.lineWidth = 4; o.stroke();
  // the oscilloscope strip for the data line
  o.fillStyle = 'rgba(0,0,0,0.35)'; o.beginPath(); o.roundRect(8, 258, 344, 108, 12); o.fill();
  // the flip-flop chip with its legs
  o.fillStyle = '#c8c8d0'; for (let i = 0; i < 4; i++) { o.fillRect(CHIP.x - 40 + i * 24, CHIP.y - 46, 8, 12); o.fillRect(CHIP.x - 40 + i * 24, CHIP.y + 34, 8, 12); }
  o.fillStyle = '#16161c'; o.beginPath(); o.roundRect(CHIP.x - 52, CHIP.y - 36, 104, 72, 8); o.fill(); o.fillStyle = '#2a2a34'; o.beginPath(); o.arc(CHIP.x - 38, CHIP.y - 22, 5, 0, 7); o.fill();
  // the data wire from the gate down into the chip, and the memory light's wire out of it
  o.strokeStyle = '#c8a04a'; o.lineWidth = 4; o.beginPath(); o.moveTo(GX, WAVE.y0 + 22); o.lineTo(GX, CHIP.y - 46); o.stroke();
  o.beginPath(); o.moveTo(CHIP.x + 52, CHIP.y); o.lineTo(292, CHIP.y); o.stroke();
  o.beginPath(); o.moveTo(CHIP.x - 52, CHIP.y); o.lineTo(70, CHIP.y); o.stroke();
}
function lamp(c, x, y, r, on, col = '#ffd24a', off = '#2a2a34') {
  c.fillStyle = '#0a0a10'; c.beginPath(); c.arc(x, y, r + 4, 0, 7); c.fill();
  if (on) { const gr = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r); gr.addColorStop(0, '#fffbe0'); gr.addColorStop(0.5, col); gr.addColorStop(1, P.shade(col, -0.4)); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.save(); c.globalAlpha = 0.25; c.fillStyle = col; c.beginPath(); c.arc(x, y, r * 1.8, 0, 7); c.fill(); c.restore(); }
  else { c.fillStyle = off; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
}
MG.add({
  id: 'latch', stage: 'circuits', cmd: 'LATCH!', time: 7, mood: 'night', winText: 'Flip-flop!', failText: 'Not stored!',
  card: { title: 'Memory that copies on the tick', kind: 'Engineering', ref: 'The D flip-flop',
    text: 'A flip-flop is a tiny memory that holds one bit: a 1 or a 0. It has a data input and a clock input. Whatever the data says at the instant the clock ticks is copied into the memory. Between ticks, the data can wiggle all it likes and the memory stays the same.\n\nHere you are the clock: each tap is one tick. Chips are full of flip-flops, and a real clock ticks billions of times a second, so every bit moves along in step. A row of flip-flops filled one tick at a time, like this one, is called a shift register.',
    note: 'A flip-flop copies its input only at the tick of the clock and holds it until the next tick.' },
  init(g) {
    const s = g.s, C = CFG[Math.min(2, g.level)]; s.C = C;
    // the code: never all the same; the data stream: random bits, with every needed bit coming round often
    s.code = []; for (let i = 0; i < C.n; i++) s.code.push(g.rand() < 0.5 ? 1 : 0); if (s.code.every(b => b === s.code[0])) s.code[1] = 1 - s.code[0];
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
    // the code to store
    const cw = Math.min(52, 220 / C.n); for (let i = 0; i < C.n; i++) lamp(c, 180 + (i - (C.n - 1) / 2) * cw, 171, 16, s.code[i], won ? '#7aff9a' : '#ffd24a');
    // the data line: a square wave streaming leftwards past the gate (upcoming bits on the right)
    const bitAt = x => { const tt = t + (x - GX) / v; return tt < 0 ? 0 : s.bits[Math.floor(tt / C.dur) % s.bits.length]; };
    c.save(); c.beginPath(); c.roundRect(8, 258, 344, 108, 12); c.clip();
    for (let x = 8; x < 352; x += 2) { const b = bitAt(x); c.fillStyle = b ? 'rgba(90,220,255,0.16)' : 'rgba(0,0,0,0)'; c.fillRect(x, WAVE.y1, 2, WAVE.y0 - WAVE.y1); }
    for (const [w, a] of [[8, 0.25], [3.5, 1]]) { c.strokeStyle = `rgba(110,230,255,${a})`; c.lineWidth = w; c.lineJoin = 'miter'; c.beginPath(); let prev = null; for (let x = 8; x <= 352; x += 2) { const y = bitAt(x) ? WAVE.y1 : WAVE.y0; if (prev === null) c.moveTo(x, y); else if (y !== prev) { c.lineTo(x, prev); c.lineTo(x, y); } else c.lineTo(x, y); prev = y; } c.stroke(); }
    c.restore();
    // the gate where the chip reads the data
    const dNow = bitAt(GX); c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(GX, 262); c.lineTo(GX, 362); c.stroke(); c.setLineDash([]);
    c.fillStyle = dNow ? '#5ae0ff' : '#1a3a4a'; c.beginPath(); c.moveTo(GX - 9, 362); c.lineTo(GX + 9, 362); c.lineTo(GX, 374); c.closePath(); c.fill();
    // the clock pin: a tick flashes along it from your tap
    const tk = s.tick ? Math.max(0, 1 - (t - s.tick) / 0.25) : 0;
    c.strokeStyle = tk ? `rgba(255,230,120,${0.4 + 0.6 * tk})` : '#c8a04a'; c.lineWidth = 4 + tk * 4; c.beginPath(); c.moveTo(CHIP.x - 52, CHIP.y); c.lineTo(70, CHIP.y); c.stroke();
    c.save(); c.translate(56, CHIP.y); c.strokeStyle = tk ? '#ffe27a' : '#8a8a96'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 16, 0, 7); c.stroke(); c.rotate(t * 3); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -11); c.stroke(); c.restore(); // a little clock face
    // the chip's memory light: changes only at a tick, then holds
    lamp(c, 306, CHIP.y, 18, s.q, s.bad && t - s.bad < 0.5 ? '#ff5a5a' : '#ffd24a');
    if (tk) { c.save(); c.globalAlpha = tk; c.strokeStyle = '#ffe27a'; c.lineWidth = 3; c.beginPath(); c.roundRect(CHIP.x - 58, CHIP.y - 42, 116, 84, 10); c.stroke(); c.restore(); }
    // the memory row
    for (let i = 0; i < C.n; i++) { const x = 180 + (i - (C.n - 1) / 2) * cw, has = i < s.cells.length, next = i === s.cells.length && !g.done; c.fillStyle = '#16161c'; c.beginPath(); c.roundRect(x - 22, CELLY - 24, 44, 48, 8); c.fill(); c.strokeStyle = next ? '#ffe27a' : 'rgba(200,160,74,0.6)'; c.lineWidth = next ? 3 : 2; c.stroke(); if (has) lamp(c, x, CELLY, 14, s.cells[i], won ? '#7aff9a' : '#ffd24a'); if (next && s.bad && t - s.bad < 0.5) { c.strokeStyle = '#ff5a5a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 10, CELLY - 10); c.lineTo(x + 10, CELLY + 10); c.moveTo(x + 10, CELLY - 10); c.lineTo(x - 10, CELLY + 10); c.stroke(); } }
    // the stored bit flying from the memory light into its cell
    if (s.fly && t - s.fly.t < 0.3) { const k = SK.easeInOut((t - s.fly.t) / 0.3), i = s.cells.length - 1, x = SK.lerp(306, 180 + (i - (C.n - 1) / 2) * cw, k), y = SK.lerp(CHIP.y, CELLY, k); lamp(c, x, y, 10, s.fly.b); }
    if (!g.done) SK.glow(c, g, CHIP.x, CHIP.y, 58);
    // the frog
    SK.animal(c, 'frog', 56, 612, 0.9, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : g.result === 'fail' ? 'sad' : s.bad && t - s.bad < 0.6 ? 'wow' : 'think' });
    SK.demo(g, c, 'tap', [CHIP.x, CHIP.y], null, { period: C.dur * 2 });
  },
  auto(g, dt, synth) { // tick in the middle of a stretch where the data matches the next bit of the code
    const s = g.s; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {}; if (B.next && g.t < B.next) return;
    const i = Math.floor(g.t / s.C.dur), ph = g.t / s.C.dur - i; if (ph < 0.35 || ph > 0.7) return;
    if (s.bits[i % s.bits.length] === s.code[s.cells.length]) { synth('down', CHIP.x, CHIP.y); synth('up', CHIP.x, CHIP.y); B.next = g.t + s.C.dur * 0.6; }
  },
});
