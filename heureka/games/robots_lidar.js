// SPIN LIDAR! (hardware EB-08) — a dark flat, seen from above. The robot must find the cat, who is hiding behind the
// sofa in the far room. Hold to spin the robot's lidar: a red laser sweeps round and every place it hits leaves a red
// dot, so walls, doorways and furniture appear out of the dark. Once the laser has gone all the way round, let go and
// the robot drives through the doorway it found to the next room. Three rooms, three scans; in the last one the dots
// outline the cat's tail sticking out. Out of time: the cat pounces on the robot in the dark. Level 2: four rooms
// and a slower turret.
const BOX = { x0: 22, x1: 338, y0: 128, y1: 604 };
const LAYOUTS = [
  { // three rooms stacked; doorways in the dividing walls; boxes are furniture (x, y, w, h)
    walls: [[22, 128, 338, 128], [22, 604, 338, 604], [22, 128, 22, 604], [338, 128, 338, 604],
      [22, 440, 226, 440], [292, 440, 338, 440], [22, 280, 70, 280], [136, 280, 338, 280]],
    boxes: [[40, 462, 56, 40], [250, 540, 70, 44], [200, 316, 110, 40], [40, 350, 40, 60], [196, 168, 104, 40]],
    stops: [[120, 540], [240, 396], [110, 170]], via: [[[259, 470], [259, 410]], [[103, 310], [103, 250]]],
    tail: [262, 150],
  },
  { walls: [[22, 128, 338, 128], [22, 604, 338, 604], [22, 128, 22, 604], [338, 128, 338, 604],
      [22, 486, 226, 486], [292, 486, 338, 486], [22, 370, 70, 370], [136, 370, 338, 370], [180, 250, 338, 250], [22, 250, 114, 250]],
    boxes: [[40, 516, 50, 40], [250, 550, 70, 36], [40, 430, 50, 40], [220, 290, 90, 34], [196, 168, 104, 38]],
    stops: [[120, 556], [250, 430], [110, 310], [130, 165]], via: [[[259, 516], [259, 456]], [[103, 400], [103, 340]], [[147, 280], [147, 222]]],
    tail: [262, 150],
  },
];
const TURN = Math.PI * 2;
function segsOf(L) {
  const S = L.walls.map(w => w.slice()); for (const [x, y, w, h] of L.boxes) S.push([x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]); return S;
}
function cast(S, tail, x, y, a) { // nearest hit of a ray from (x, y) at angle a: { x, y, kind }
  const dx = Math.cos(a), dy = Math.sin(a); let best = 1e9, kind = 'wall';
  for (const [x1, y1, x2, y2] of S) {
    const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - x) * ey - (y1 - y) * ex) / den, u = ((x1 - x) * dy - (y1 - y) * dx) / den;
    if (t > 0.5 && u >= 0 && u <= 1 && t < best) { best = t; kind = 'wall'; }
  }
  for (const [cx, cy, r] of tail) { const fx = x - cx, fy = y - cy, b = fx * dx + fy * dy, cc = fx * fx + fy * fy - r * r, disc = b * b - cc; if (disc >= 0) { const t = -b - Math.sqrt(disc); if (t > 0.5 && t < best) { best = t; kind = 'cat'; } } }
  return best < 1e8 ? { x: x + dx * best, y: y + dy * best, kind } : null;
}
function tailBalls(L) { const [x, y] = L.tail; return [[x, y + 12, 5.5], [x - 6, y + 4, 6], [x - 14, y, 6], [x - 22, y + 2, 5]]; }
MG.add({
  id: 'lidar', stage: 'robots', cmd: 'SPIN THE LIDAR, FIND THE CAT!', time: 7, mood: 'night', winText: 'Cat found!', failText: 'Pounce!',
  card: { title: 'Seeing with a spinning laser', kind: 'Robotics', ref: 'Lidar (light detection and ranging)',
    text: 'A lidar sends out a quick flash of laser light and times how long the light takes to bounce back. Light is so fast that the time is tiny, but it tells the robot exactly how far away the thing it hit is.\n\nSpin the laser all the way round and you get a ring of distances, one in every direction. Drawn as dots, they show the walls, the doorways and the furniture, even in the dark. Robot vacuums, warehouse robots and many self-driving cars build their maps this way. Glass and mirrors fool it, because the light passes through or bounces away.',
    note: 'Lidar measures the distance in every direction with a spinning laser, so a robot can map a room even in the dark.' },
  init(g) {
    const s = g.s, L0 = LAYOUTS[g.level >= 2 ? 1 : 0]; s.var = SK.variant(g, 4);
    const mx = s.var & 1, fy = s.var & 2, X = x => mx ? 360 - x : x, Y = y => fy ? 732 - y : y, Pt = ([x, y]) => [X(x), Y(y)]; // mirrored and/or flipped flats
    const L = { walls: L0.walls.map(([a, b, c2, d]) => [X(a), Y(b), X(c2), Y(d)]), boxes: L0.boxes.map(([x, y, w, h]) => [mx ? 360 - x - w : x, fy ? 732 - y - h : y, w, h]),
      stops: L0.stops.map(Pt), via: L0.via.map(v => v.map(Pt)), tail: Pt(L0.tail) };
    s.L = L; s.S = segsOf(L); s.tb = tailBalls(L0).map(([x, y, r]) => [X(x), Y(y), r]); s.eyeDx = mx ? -16 : 16; s.bot = { x: L.stops[0][0], y: L.stops[0][1] }; s.stop = 0; s.ang = -Math.PI / 2; s.swept = 0;
    s.dots = []; s.path = null; s.found = 0; s.w = g.level >= 2 ? TURN / 1.05 : g.level >= 1 ? TURN / 0.9 : TURN / 0.8; s.arrived = 0; s.huh = 0;
  },
  down(g) { if (g.done) return; SK.holdStart(g); g.sfx('click'); },
  up(g) {
    const s = g.s; if (s._hold == null) return; SK.holdEnd(g); if (g.done || s.path) return;
    if (s.swept < TURN) { s.huh = 0.6; g.sfx('wrong'); } // not mapped yet: the robot won't drive into the unknown
  },
  update(g, dt) {
    const s = g.s, b = s.bot; s.huh = Math.max(0, s.huh - dt);
    if (g.done) { if (g.result === 'fail') s.pounce = (s.pounce || 0) + dt; return; }
    if (s.path) { // drive along the planned path
      const [tx, ty] = s.path[0], d = SK.dist(b.x, b.y, tx, ty), st = 190 * dt;
      if (d <= st) { b.x = tx; b.y = ty; s.path.shift(); if (!s.path.length) { s.path = null; s.stop++; s.swept = 0; s.arrived = g.t; g.sfx('pop'); } }
      else { b.x += (tx - b.x) / d * st; b.y += (ty - b.y) / d * st; }
      return;
    }
    if (s._hold == null) return;
    // spinning: sweep the beam and drop a dot wherever it hits
    const da = s.w * dt, n = Math.max(1, Math.ceil(da / 0.028));
    for (let i = 1; i <= n; i++) {
      const a = s.ang + da * i / n, h = cast(s.S, s.tb, b.x, b.y, a);
      if (h) { s.dots.push([h.x, h.y, h.kind === 'cat' ? 1 : 0, g.t]); if (h.kind === 'cat' && !s.found) { s.found = g.t; } }
    }
    if (s.dots.length > 1400) s.dots.splice(0, s.dots.length - 1400);
    s.ang += da; s.swept += da;
    // a full turn: the robot plans through the doorway it saw and drives on by itself (hold again in the next room)
    if (s.swept >= TURN && s.stop < s.L.stops.length - 1) { const L = s.L, i = s.stop; s.path = [...L.via[i], L.stops[i + 1]]; g.sfx('ding'); SK.holdEnd(g); } if (Math.floor((s.ang - da) / 1.2) !== Math.floor(s.ang / 1.2)) g.sfx('tap', { vol: 0.3, pitch: 1.6 });
    if (s.stop === s.L.stops.length - 1 && s.swept >= TURN && s.found) { g.win(); g.sfx('meow'); g.sfx('cheer'); g.burst(s.L.tail[0] - 10, s.L.tail[1], ['#ff4a4a', '#ffe27a'], 18, 160); }
  },
  draw(g, c) {
    const s = g.s, b = s.bot, t = g.t, L = s.L, won = g.result === 'win', lost = g.result === 'fail';
    c.fillStyle = '#0a0c1c'; c.fillRect(0, 0, 360, 640);
    const vg = c.createRadialGradient(b.x, b.y, 10, b.x, b.y, 260); vg.addColorStop(0, 'rgba(60,70,130,0.35)'); vg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = vg; c.fillRect(0, 0, 360, 640);
    // the real room, barely visible in the dark (or lit up once the cat is found)
    const lit = won ? Math.min(1, (t - g.doneAt) * 2) : 0;
    c.save(); c.globalAlpha = 0.035 + 0.6 * lit; c.strokeStyle = '#b8c0ff'; c.lineWidth = 4; c.lineCap = 'round'; for (const w of L.walls) { c.beginPath(); c.moveTo(w[0], w[1]); c.lineTo(w[2], w[3]); c.stroke(); }
    c.fillStyle = '#6a5aa0'; for (const [x, y, w, h] of L.boxes) { c.beginPath(); c.roundRect(x, y, w, h, 6); c.fill(); } c.restore();
    // the map: red dots, newest brightest
    for (const [x, y, cat, t0] of s.dots) { const age = t - t0, a = Math.max(0.45, 1 - age * 0.4); c.fillStyle = cat ? `rgba(255,220,90,${a})` : `rgba(255,70,80,${a})`; c.fillRect(x - 1.8, y - 1.8, 3.6, 3.6); }
    // the cat: just its tail in the dots, until found, then it peeks out from behind the sofa
    if (s.found || lost) { const [tx, ty] = L.tail, k = won ? Math.min(1, (t - g.doneAt) * 3) : 0; if (k > 0) { P.cat(c, tx - 4, ty + 26 - k * 12, 1.4, { t, facing: -1 }); } }
    if (lost) { const k = Math.min(1, (s.pounce || 0) * 3); P.cat(c, SK.lerp(L.tail[0], b.x + 10, k), SK.lerp(L.tail[1], b.y - 6, k) - Math.sin(k * Math.PI) * 60, 1.6, { t, facing: -1 }); }
    // the beam while spinning
    if (s._hold != null && !s.path && !g.done) { const h = cast(s.S, s.tb, b.x, b.y, s.ang); if (h) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,60,70,0.85)'; c.lineWidth = 2; c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(h.x, h.y); c.stroke(); c.fillStyle = 'rgba(255,120,120,0.9)'; c.beginPath(); c.arc(h.x, h.y, 4, 0, 7); c.fill(); c.restore(); } }
    // the planned path
    if (s.path) { c.save(); c.strokeStyle = 'rgba(120,255,170,0.6)'; c.lineWidth = 3; c.setLineDash([6, 6]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(b.x, b.y); for (const [x, y] of s.path) c.lineTo(x, y); c.stroke(); c.restore(); }
    // the robot: a disc with the turret on top and a ring showing how much of the turn is done
    SK.shadow(c, b.x + 2, b.y + 6, 24, 18, 0.4);
    const bg = c.createRadialGradient(b.x - 7, b.y - 8, 3, b.x, b.y, 22); bg.addColorStop(0, '#f0f4ff'); bg.addColorStop(1, '#8a94b8'); c.fillStyle = bg; c.beginPath(); c.arc(b.x, b.y, 22, 0, 7); c.fill(); c.strokeStyle = '#3a4268'; c.lineWidth = 2.5; c.stroke();
    if (!s.path && !g.done) { c.strokeStyle = '#ff4a5a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(b.x, b.y, 28, -Math.PI / 2, -Math.PI / 2 + Math.min(1, s.swept / TURN) * TURN); c.stroke(); }
    c.save(); c.translate(b.x, b.y); c.rotate(s.ang); c.fillStyle = '#2a2e44'; c.beginPath(); c.arc(0, 0, 10, 0, 7); c.fill(); c.fillStyle = '#ff4a5a'; c.fillRect(6, -3, 8, 6); c.restore();
    if (s.huh) SK.tag(c, '?', b.x, b.y - 42, 22);
    // a circular arrow round the robot shows the spin; the cat's eyes glint in the far dark room
    if (!s.path && !g.done && s._hold == null) { c.save(); c.strokeStyle = 'rgba(255,120,130,0.8)'; c.lineWidth = 3; const a0 = t * 2; c.beginPath(); c.arc(b.x, b.y, 38, a0, a0 + 4.6); c.stroke(); const ax = b.x + Math.cos(a0 + 4.6) * 38, ay = b.y + Math.sin(a0 + 4.6) * 38, d = a0 + 4.6 + Math.PI / 2; c.fillStyle = 'rgba(255,120,130,0.9)'; c.beginPath(); c.moveTo(ax + Math.cos(d) * 8, ay + Math.sin(d) * 8); c.lineTo(ax + Math.cos(d + 2.3) * 7, ay + Math.sin(d + 2.3) * 7); c.lineTo(ax + Math.cos(d - 2.3) * 7, ay + Math.sin(d - 2.3) * 7); c.fill(); c.restore(); SK.tag(c, 'Hold to spin', b.x, b.y + 54, 18); }
    if (!s.found && !g.done) { const bl = Math.sin(t * 1.3) > 0.85 ? 0.2 : 1; c.fillStyle = `rgba(190,255,120,${0.75 * bl})`; for (const dx of [-5, 5]) { c.beginPath(); c.ellipse(L.tail[0] + s.eyeDx + dx, L.tail[1] + 8, 2.6, 3.6 * bl, 0, 0, 7); c.fill(); } }
    if (!s.path && !g.done && s._hold == null) SK.glow(c, g, b.x, b.y, 32);
    // which room of how many: little squares, the current one outlined, the cleared ones ticked
    { const n = L.stops.length; for (let i = 0; i < n; i++) { const x = 30 + i * 26, y = 112, done = i < s.stop; c.fillStyle = done ? '#5ad07a' : i === s.stop ? '#ff6a7a' : 'rgba(200,210,255,0.25)'; c.beginPath(); c.roundRect(x - 9, y - 9, 18, 18, 4); c.fill(); } }
    // the owl watches from the corner, wide-eyed in the dark
    SK.animal(c, 'owl', 306, 130, 0.6, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: -1 });
    if (!s.path) SK.demo(g, c, 'hold', [b.x, b.y], null, { period: 2.4 });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._bot = s._bot || {};
    if (s.path || g.done) return; const k = 'h' + s.stop, t0 = s.stop ? s.arrived + 0.15 : 1.0;
    SK.bot.hold(g, synth, k, t0, 180, 360, TURN / s.w + 0.08);
  },
});
