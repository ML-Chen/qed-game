// TILE IT! (problems PS-17) — a floor with a mouse scurrying in the holes, and a tray of tiles of different shapes.
// Drag the tiles onto the floor so they cover it all with no overlaps and no gaps (a MECE split): the last tile drops
// in, the floor is flat and the mouse is trapped. Drop a tile across another one and it stacks and wobbles, leaving a
// gap somewhere, and the mouse (the cause you missed) runs out of that hole.
const TAU = Math.PI * 2, TS = 0.7, FY = 172; let C = 56; // C: the cell size, set per level by lay()
const LEVELS = [
  { cols: 3, rows: 3, pcs: [
    { cells: [[0, 0], [1, 0], [2, 0]], home: [0, 0], col: '#e8604a', tray: [34, 404] },
    { cells: [[0, 0], [0, 1], [1, 1]], home: [0, 1], col: '#4aa8d8', tray: [40, 482] },
    { cells: [[0, 0], [1, 0], [1, 1]], home: [1, 1], col: '#f0b030', tray: [180, 452] }] },
  { cols: 4, rows: 3, pcs: [
    { cells: [[0, 0], [1, 0], [2, 0], [0, 1]], home: [0, 0], col: '#e8604a', tray: [24, 396] },
    { cells: [[0, 0], [0, 1], [0, 2]], home: [3, 0], col: '#4aa8d8', tray: [172, 396] },
    { cells: [[0, 0], [1, 0]], home: [1, 1], col: '#f0b030', tray: [24, 500] },
    { cells: [[0, 0], [1, 0], [2, 0]], home: [0, 2], col: '#8ac850', tray: [128, 540] }] },
  { cols: 4, rows: 4, pcs: [
    { cells: [[0, 0], [1, 0], [2, 0], [0, 1]], home: [0, 0], col: '#e8604a', tray: [24, 398] },
    { cells: [[0, 0], [0, 1], [0, 2]], home: [3, 0], col: '#4aa8d8', tray: [150, 398] },
    { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], home: [1, 1], col: '#f0b030', tray: [206, 400] },
    { cells: [[0, 0], [0, 1]], home: [0, 2], col: '#b070d0', tray: [30, 498] },
    { cells: [[0, 0], [1, 0], [2, 0]], home: [1, 3], col: '#8ac850', tray: [96, 540] }] },
];
function lay(g) { const L = LEVELS[Math.min(2, g.level)]; C = [62, 56, 48][Math.min(2, g.level)]; return { L, fx: 180 - L.cols * C / 2, fy: FY }; }
function bbox(p) { let w = 0, h = 0; for (const [i, j] of p.cells) { w = Math.max(w, i + 1); h = Math.max(h, j + 1); } return [w, h]; }
function paintRoom(o, L, fx, fy) {
  // a sunny tiled-room seen from above: warm plank floor around a sunken pit (the floor still to be covered)
  o.fillStyle = '#5a3a5a'; o.fillRect(0, 0, 360, 640);
  B9.wood(o, 10, 140, 340, 230, '#c08a52', 2);
  B9.wood(o, 0, 372, 360, 268, '#8a5a3a', 6);
  o.fillStyle = 'rgba(40,20,30,0.35)'; o.fillRect(0, 368, 360, 8);
  // the wall at the top: wallpaper with a window
  const wp = o.createLinearGradient(0, 0, 0, 140); wp.addColorStop(0, '#f4d8e8'); wp.addColorStop(1, '#e8b8d0'); o.fillStyle = wp; o.fillRect(10, 0, 340, 140);
  o.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 24; x < 350; x += 36) for (let y = 14; y < 132; y += 36) { o.beginPath(); o.arc(x + ((y / 36) % 2) * 18, y, 4, 0, TAU); o.fill(); }
  o.fillStyle = '#9ad0f0'; o.beginPath(); o.roundRect(42, 24, 80, 64, 8); o.fill(); o.strokeStyle = '#fff6ea'; o.lineWidth = 6; o.stroke(); o.beginPath(); o.moveTo(82, 24); o.lineTo(82, 88); o.moveTo(42, 56); o.lineTo(122, 56); o.stroke();
  o.fillStyle = '#7a4a2a'; o.fillRect(10, 134, 340, 8);
  // the pit
  const w = L.cols * C, h = L.rows * C;
  o.fillStyle = 'rgba(40,20,30,0.3)'; o.beginPath(); o.roundRect(fx - 8, fy - 6, w + 16, h + 16, 10); o.fill();
  const pit = o.createLinearGradient(0, fy, 0, fy + h); pit.addColorStop(0, '#2a1824'); pit.addColorStop(1, '#4a2c3c'); o.fillStyle = pit; o.beginPath(); o.roundRect(fx - 4, fy - 4, w + 8, h + 8, 8); o.fill();
  o.strokeStyle = 'rgba(255,230,200,0.14)'; o.lineWidth = 1.5; o.setLineDash([4, 5]);
  for (let i = 1; i < L.cols; i++) { o.beginPath(); o.moveTo(fx + i * C, fy); o.lineTo(fx + i * C, fy + h); o.stroke(); }
  for (let j = 1; j < L.rows; j++) { o.beginPath(); o.moveTo(fx, fy + j * C); o.lineTo(fx + w, fy + j * C); o.stroke(); }
  o.setLineDash([]);
  // the tray
  o.fillStyle = 'rgba(30,14,30,0.25)'; o.beginPath(); o.roundRect(12, 384, 336, 216, 22); o.fill();
  P.grain(o, 360, 640, 0.05); P.vignette(o, 360, 640, 0.3);
}
function piece(c, p, x, y, sc, t, o = {}) { // draw a tile piece with its top-left at (x, y), cell size C * sc
  const k = C * sc, [bw, bh] = bbox(p);
  c.save(); c.translate(x + bw * k / 2, y + bh * k / 2); if (o.rot) c.rotate(o.rot); c.translate(-bw * k / 2, -bh * k / 2);
  if (o.lift) { c.fillStyle = 'rgba(20,10,20,0.3)'; for (const [i, j] of p.cells) { c.beginPath(); c.roundRect(i * k + 5, j * k + 8, k, k, 8 * sc); c.fill(); } }
  const has = (i, j) => p.cells.some(q => q[0] === i && q[1] === j), dark = P.shade(p.col, -0.35);
  c.fillStyle = dark; for (const [i, j] of p.cells) { c.beginPath(); c.roundRect(i * k + 1, j * k + 1, k - 2, k - 2, 9 * sc); c.fill(); if (has(i + 1, j)) c.fillRect(i * k + k / 2, j * k + 1, k, k - 2); if (has(i, j + 1)) c.fillRect(i * k + 1, j * k + k / 2, k - 2, k); }
  for (const [i, j] of p.cells) {
    const gx = i * k, gy = j * k, gr = c.createLinearGradient(gx, gy, gx + k, gy + k); gr.addColorStop(0, P.shade(p.col, 0.3)); gr.addColorStop(1, p.col);
    c.fillStyle = gr; c.beginPath(); c.roundRect(gx + 4 * sc, gy + 4 * sc, k - 8 * sc, k - 8 * sc, 7 * sc); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.moveTo(gx + k / 2, gy + k * 0.24); c.lineTo(gx + k * 0.76, gy + k / 2); c.lineTo(gx + k / 2, gy + k * 0.76); c.lineTo(gx + k * 0.24, gy + k / 2); c.closePath(); c.fill();
  }
  c.restore();
}
function mouse(c, x, y, t, o = {}) { // a grey mouse; o.peek draws only the head popping up
  c.save(); c.translate(x, y); c.scale((o.dir || 1) * 1.35, 1.35);
  if (!o.peek) { c.strokeStyle = '#e8a0b0'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-12, 2); c.quadraticCurveTo(-26, -6 + Math.sin(t * 12) * 5, -34, 4); c.stroke(); c.fillStyle = '#a8a0b0'; c.beginPath(); c.ellipse(-2, 0, 14, 9, 0, 0, TAU); c.fill(); }
  const hx = o.peek ? 0 : 10, hy = o.peek ? 0 : -2;
  c.fillStyle = '#e8a0b0'; for (const s of [-1, 1]) { c.beginPath(); c.arc(hx + s * 8, hy - 9, 6.5, 0, TAU); c.fill(); }
  c.fillStyle = '#b8b0c0'; c.beginPath(); c.ellipse(hx, hy, 11, 9.5, 0, 0, TAU); c.fill();
  c.fillStyle = '#1a1020'; for (const s of [-1, 1]) { c.beginPath(); c.arc(hx + s * 4, hy - 1, 1.9, 0, TAU); c.fill(); } c.fillStyle = '#f07090'; c.beginPath(); c.arc(hx, hy + 4, 2.2, 0, TAU); c.fill();
  c.restore();
}
MG.add({
  id: 'tileit', stage: 'problems', cmd: 'COVER THE FLOOR, NO OVERLAPS!', time: 6, mood: 'party', winText: 'No gaps, no overlaps!', failText: 'It got out!',
  card: { title: 'No gaps, no overlaps', kind: 'Problem solving', ref: 'MECE (mutually exclusive, collectively exhaustive)',
    text: 'The floor is the whole problem, and each tile is one part of it. The tiles worked because together they covered every bit of the floor, and no two tiles sat on the same spot.\n\nConsultants call a split like that MECE: mutually exclusive (no part overlaps another) and collectively exhaustive (the parts cover everything). Overlaps make you do the same work twice. A gap is worse: the cause you are looking for can hide in the part nobody checked, like the mouse.',
    note: 'When you split a problem into parts, make the parts cover everything without overlapping.' },
  init(g) {
    const s = g.s, { L } = lay(g); // (lay also sets the cell size C)
    // four variants: the same floor plan as drawn, mirrored left-right, upside down, or both (so the tile shapes change)
    const v = SK.variant(g, 4), fx = v & 1, fy = v & 2, cols = SK.shuffled(g, ['#e8604a', '#4aa8d8', '#f0b030', '#8ac850', '#b070d0']);
    const pcs = L.pcs.map((p, k) => { const abs = p.cells.map(([i, j]) => [p.home[0] + i, p.home[1] + j]).map(([i, j]) => [fx ? L.cols - 1 - i : i, fy ? L.rows - 1 - j : j]); const hi = Math.min(...abs.map(q => q[0])), hj = Math.min(...abs.map(q => q[1])); return { cells: abs.map(([i, j]) => [i - hi, j - hj]), home: [hi, hj], col: cols[k], tray: p.tray }; });
    s.pcs = pcs.map((p, i) => ({ i, p, x: p.tray[0], y: p.tray[1], sc: TS, placed: false, wob: 0 }));
    s.grid = Array.from({ length: L.rows }, () => Array(L.cols).fill(-1)); s.drag = null; s.mz = { i: 0, j: L.rows - 1, t: 0 };
  },
  down(g, x, y) {
    const s = g.s; lay(g); SK.touched(g); if (g.done) return;
    for (const pc of s.pcs.slice().reverse()) {
      if (pc.placed) continue; const k = C * pc.sc;
      if (pc.p.cells.some(([i, j]) => x > pc.x + i * k - 6 && x < pc.x + (i + 1) * k + 6 && y > pc.y + j * k - 6 && y < pc.y + (j + 1) * k + 6)) {
        pc.x = x - (x - pc.x) / pc.sc; pc.y = y - (y - pc.y) / pc.sc; pc.sc = 1; s.drag = { pc, ox: pc.x - x, oy: pc.y - y }; g.sfx('pop'); return;
      }
    }
  },
  move(g, x, y) { lay(g); const d = g.s.drag; if (!d) return; d.pc.x = x + d.ox; d.pc.y = y + d.oy; },
  up(g) {
    const s = g.s, d = s.drag; if (!d) return; s.drag = null; const pc = d.pc, { L, fx, fy } = lay(g);
    const ci = Math.round((pc.x - fx) / C), cj = Math.round((pc.y - fy) / C), off = Math.hypot(pc.x - (fx + ci * C), pc.y - (fy + cj * C));
    const fits = off < C * 0.6 && pc.p.cells.every(([i, j]) => ci + i >= 0 && ci + i < L.cols && cj + j >= 0 && cj + j < L.rows);
    if (!fits) { pc.x = pc.p.tray[0]; pc.y = pc.p.tray[1]; pc.sc = TS; g.sfx('boing'); return; }
    pc.x = fx + ci * C; pc.y = fy + cj * C; pc.placed = true;
    const clash = pc.p.cells.some(([i, j]) => s.grid[cj + j][ci + i] >= 0);
    if (clash) { pc.wob = g.t; g.sfx('thud'); g.sfx('wrong'); s.escape = g.t + 0.5; return; }
    for (const [i, j] of pc.p.cells) s.grid[cj + j][ci + i] = pc.i;
    g.sfx('click'); g.burst(pc.x + C, pc.y + C / 2, ['#fff6ea', pc.p.col], 8, 90);
    if (s.grid.every(r => r.every(v => v >= 0))) { s.trap = g.t; g.win(); g.sfx('cheer'); g.sfx('sparkle'); }
  },
  update(g, dt) {
    const s = g.s, { L } = lay(g), holes = [];
    for (let j = 0; j < L.rows; j++) for (let i = 0; i < L.cols; i++) if (s.grid[j][i] < 0) holes.push([i, j]);
    // the mouse hops between the holes that are still open
    if (holes.length && !s.run) { s.mz.t += dt; const here = s.grid[s.mz.j][s.mz.i] < 0; if (!here || s.mz.t > 0.7) { const h = holes[Math.floor(g.rand() * holes.length)]; s.mz = { i: h[0], j: h[1], t: 0 }; } }
    if (s.escape && g.t >= s.escape && !s.run) { s.run = { t: g.t }; g.sfx('laugh'); }
    if (s.run && !g.done && g.t - s.run.t > 0.7) g.fail();
  },
  draw(g, c) {
    const s = g.s, t = g.t, { L, fx, fy } = lay(g);
    c.drawImage(g.bake('tileit' + Math.min(2, g.level), o => paintRoom(o, L, fx, fy)), 0, 0, 360, 640);
    const holeOpen = s.grid[s.mz.j][s.mz.i] < 0, mx = fx + (s.mz.i + 0.5) * C, my = fy + (s.mz.j + 0.5) * C;
    // the mouse peeking up out of an open hole (or, on a fail, running off across the room)
    if (g.result === 'fail' || s.run) { const k = t - (s.run ? s.run.t : g.doneAt); mouse(c, mx + k * 260, my + Math.min(k, 0.3) * 300 + Math.abs(Math.sin(k * 20)) * -4, t, { dir: 1 }); }
    else if (holeOpen && !g.done) { const pop = Math.min(1, s.mz.t * 5) * Math.min(1, (0.7 - s.mz.t) * 6); c.save(); c.beginPath(); c.rect(mx - C / 2, my - C / 2, C, C); c.clip(); mouse(c, mx, my + 14 - pop * 10, t, { peek: true }); c.restore(); }
    // placed tiles first, then the tray, then the one in hand on top
    const order = s.pcs.filter(p => p !== (s.drag && s.drag.pc)).sort((a, b) => (a.wob ? 1 : 0) - (b.wob ? 1 : 0) || (b.placed ? 1 : 0) - (a.placed ? 1 : 0));
    for (const pc of order) {
      if (pc.wob) { const k = t - pc.wob; piece(c, pc.p, pc.x - 4, pc.y - 8, 1, t, { rot: Math.sin(k * 16) * 0.12 * Math.max(0.3, 1 - k), lift: true }); }
      else piece(c, pc.p, pc.x, pc.y, pc.sc, t, { lift: !pc.placed });
    }
    // a little bump on the finished floor: the trapped mouse
    // the trapped mouse: a wriggling bump under the finished floor, squeaking
    if (s.trap) { const k = t - s.trap, w = Math.sin(t * 18) * 3; c.save(); c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(mx + w, my, 18, 10 + Math.abs(w), 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(60,30,50,0.4)'; c.lineWidth = 2; c.stroke(); c.restore(); if (k < 1.5) B9.txt(c, '♪', mx + 14 + k * 20, my - 22 - k * 30, 22, '#fff6ea', { stroke: 'rgba(40,20,40,0.6)' }); }
    SK.tag(c, 'Floor to cover', 180, FY - 16, 18); if (s.pcs.some(p => !p.placed)) SK.tag(c, 'Tiles', 300, 398, 18); if (!g.done && s.grid[s.mz.j][s.mz.i] < 0) SK.tag(c, 'Mouse', mx, my + 34, 18, '#ffd0d0');
    if (s.drag) { const pc = s.drag.pc, ci = Math.round((pc.x - fx) / C), cj = Math.round((pc.y - fy) / C), off = Math.hypot(pc.x - (fx + ci * C), pc.y - (fy + cj * C));
      // where it would land: green if it fits with no overlap, red if it would sit on another tile or off the floor
      const inF = off < C * 0.6 && pc.p.cells.every(([i, j]) => ci + i >= 0 && ci + i < L.cols && cj + j >= 0 && cj + j < L.rows), ok = inF && pc.p.cells.every(([i, j]) => s.grid[cj + j][ci + i] < 0);
      c.save(); c.globalAlpha = inF ? 0.9 : 0.3; c.strokeStyle = !inF ? '#fff6ea' : ok ? '#6af08a' : '#ff5a5a'; c.lineWidth = inF ? 4 : 3; for (const [i, j] of pc.p.cells) { c.beginPath(); c.roundRect(fx + (ci + i) * C + 3, fy + (cj + j) * C + 3, C - 6, C - 6, 8); c.stroke(); } c.restore(); piece(c, pc.p, pc.x, pc.y - 6, 1, t, { lift: true }); }
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'octopus', 318, 606, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // guidance: the next tile, and where it goes
    const nx = s.pcs.find(p => !p.placed); if (nx && !s.drag && !g.done) {
      const [bw, bh] = bbox(nx.p), a = [nx.x + bw * C * TS / 2, nx.y + bh * C * TS / 2], b = [fx + (nx.p.home[0] + bw / 2) * C, fy + (nx.p.home[1] + bh / 2) * C];
      c.save(); c.strokeStyle = 'rgba(255,226,122,0.85)'; c.lineWidth = 3; c.setLineDash([6, 6]); c.lineDashOffset = -t * 24; for (const [i, j] of nx.p.cells) { c.beginPath(); c.roundRect(fx + (nx.p.home[0] + i) * C + 4, fy + (nx.p.home[1] + j) * C + 4, C - 8, C - 8, 8); c.stroke(); } c.restore(); // the exact cells it covers
      SK.grab(c, g, a[0], a[1], 34); SK.target(c, g, b[0], b[1], 30, { w: bw * C + 8, h: bh * C + 8 }); SK.arrow(c, g, a[0], a[1], b[0], b[1]);
      SK.demo(g, c, 'drag', a, b);
    }
  },
  auto(g, dt, synth) {
    const { fx, fy } = lay(g);
    g.s.pcs.forEach((pc, n) => { const [bw, bh] = bbox(pc.p), a = [pc.p.tray[0] + bw * C * TS / 2, pc.p.tray[1] + bh * C * TS / 2], b = [fx + (pc.p.home[0] + bw / 2) * C, fy + (pc.p.home[1] + bh / 2) * C]; SK.bot.drag(g, synth, 'p' + n, 1.0 + n * 0.6, a, b, 0.4); });
  },
});
