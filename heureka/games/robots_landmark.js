// SPOT LANDMARK! (hardware RO-08) — a dim warehouse seen from above. The robot drives a route to its charger by
// counting wheel turns, and its ghost (where it thinks it is) follows the route perfectly while the real robot slowly
// slides off it: tiny errors pile up. Three posters it knows hang along the way. Tap each poster while it is in the
// robot's camera view (it lights up): the ghost snaps onto the real robot, and the robot steers back onto its route.
// Never checking: it drifts so far that it bumps a shelf, or parks proudly in a plant pot. Level 2: it drifts faster
// and its camera sees less far.
const PATH = [[70, 572], [70, 410], [290, 410], [290, 230], [160, 230]], SPEED = 122;
const SHELVES = [[110, 452, 140, 150], [110, 276, 140, 92], [20, 262, 84, 108], [200, 120, 140, 70], [20, 120, 90, 70]];
const POSTERS = [{ x: 62, y: 372, col: '#5ac8ff', pic: 'fish' }, { x: 342, y: 410, col: '#ffcc3a', pic: 'star' }, { x: 290, y: 192, col: '#ff7a9a', pic: 'heart' }];
const CHG = { x: 160, y: 230 }, POT = { x: 150, y: 172 };
const CFG = [{ drift: 13, range: 150 }, { drift: 15, range: 135 }, { drift: 18, range: 118 }];
const SEGL = PATH.slice(1).map((p, i) => SK.dist(...PATH[i], ...p)), TOTAL = SEGL.reduce((a, b) => a + b, 0);
function at(d) { // the point and heading at distance d along the route
  let i = 0; while (i < SEGL.length - 1 && d > SEGL[i]) { d -= SEGL[i]; i++; }
  const k = SK.clamp(d / SEGL[i], 0, 1), [x0, y0] = PATH[i], [x1, y1] = PATH[i + 1]; return { x: SK.lerp(x0, x1, k), y: SK.lerp(y0, y1, k), h: Math.atan2(y1 - y0, x1 - x0) };
}
function paintWarehouse(o) {
  o.fillStyle = '#1e2230'; o.fillRect(0, 0, 360, 640);
  o.strokeStyle = 'rgba(255,255,255,0.04)'; o.lineWidth = 1; for (let x = 0; x < 360; x += 30) { o.beginPath(); o.moveTo(x, 110); o.lineTo(x, 640); o.stroke(); } for (let y = 110; y < 640; y += 30) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
  o.fillStyle = '#2a2e3e'; o.fillRect(0, 110, 360, 10); o.fillRect(0, 110, 16, 530); o.fillRect(344, 110, 16, 530);
  // the route painted faintly on the floor
  o.strokeStyle = 'rgba(255,220,120,0.16)'; o.lineWidth = 10; o.lineJoin = 'round'; o.lineCap = 'round'; o.beginPath(); PATH.forEach(([x, y], i) => i ? o.lineTo(x, y) : o.moveTo(x, y)); o.stroke();
  // shelves loaded with boxes
  const rnd = P.rng(17);
  for (const [x, y, w, h] of SHELVES) {
    SK.shadow(o, x + w / 2 + 4, y + h + 2, w / 2, 6, 0.4);
    o.fillStyle = '#4a4436'; o.fillRect(x, y, w, h); o.strokeStyle = '#6a604a'; o.lineWidth = 3; o.strokeRect(x, y, w, h);
    for (let bx = x + 6; bx < x + w - 18; bx += 26) for (let by = y + 6; by < y + h - 18; by += 24) { if (rnd() < 0.2) continue; o.fillStyle = ['#a8784a', '#c8945a', '#8a6038'][Math.floor(rnd() * 3)]; o.fillRect(bx, by, 20 + rnd() * 3, 18); o.strokeStyle = 'rgba(0,0,0,0.25)'; o.lineWidth = 1; o.strokeRect(bx, by, 20, 18); o.fillStyle = 'rgba(255,255,255,0.18)'; o.fillRect(bx + 8, by, 3, 18); }
  }
  // the charger pad
  o.fillStyle = '#2a3a2a'; o.beginPath(); o.roundRect(CHG.x - 30, CHG.y - 26, 60, 52, 10); o.fill(); o.strokeStyle = '#5aff7a'; o.lineWidth = 2.5; o.stroke();
  o.fillStyle = '#5aff7a'; o.beginPath(); o.moveTo(CHG.x + 4, CHG.y - 16); o.lineTo(CHG.x - 8, CHG.y + 2); o.lineTo(CHG.x, CHG.y + 2); o.lineTo(CHG.x - 4, CHG.y + 16); o.lineTo(CHG.x + 8, CHG.y - 2); o.lineTo(CHG.x, CHG.y - 2); o.closePath(); o.fill();
  // the plant pot
  o.fillStyle = '#b05a3a'; o.beginPath(); o.arc(POT.x, POT.y, 16, 0, 7); o.fill(); o.fillStyle = '#4a2a1a'; o.beginPath(); o.arc(POT.x, POT.y, 12, 0, 7); o.fill();
  for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; o.fillStyle = i % 2 ? '#3a9a4a' : '#5ac86a'; o.beginPath(); o.ellipse(POT.x + Math.cos(a) * 12, POT.y + Math.sin(a) * 12, 12, 5, a, 0, 7); o.fill(); }
}
function poster(c, p, lit, t) {
  c.save(); c.translate(p.x, p.y);
  if (lit) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,240,180,${0.25 + 0.15 * Math.sin(t * 12)})`; c.beginPath(); c.arc(0, 0, 34, 0, 7); c.fill(); c.restore(); }
  c.fillStyle = lit ? '#fff6ea' : '#6a6a70'; c.fillRect(-18, -16, 36, 32); c.fillStyle = lit ? p.col : P.shade(p.col, -0.6); c.fillRect(-15, -13, 30, 26);
  c.fillStyle = lit ? '#fff' : 'rgba(255,255,255,0.25)';
  if (p.pic === 'fish') { c.beginPath(); c.ellipse(-2, 0, 9, 6, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(6, 0); c.lineTo(12, -6); c.lineTo(12, 6); c.fill(); }
  else if (p.pic === 'star') { c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 4.5 : 10, a = i * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.fill(); }
  else { c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-14, -2, -6, -12, 0, -4); c.bezierCurveTo(6, -12, 14, -2, 0, 8); c.fill(); }
  c.restore();
}
function bot(c, x, y, h, ghost, t) {
  c.save(); c.translate(x, y); c.rotate(h); if (ghost) c.globalAlpha = 0.38;
  if (!ghost) SK.shadow(c, 3, 4, 22, 18, 0.35);
  c.fillStyle = ghost ? '#a8d8ff' : '#e8eef8'; c.beginPath(); c.roundRect(-20, -16, 40, 32, 9); c.fill(); c.strokeStyle = ghost ? '#a8d8ff' : '#4a5470'; c.lineWidth = 2.5; if (ghost) c.setLineDash([4, 4]); c.stroke(); c.setLineDash([]);
  if (!ghost) { c.fillStyle = '#26262e'; c.fillRect(-14, -20, 12, 5); c.fillRect(2, -20, 12, 5); c.fillRect(-14, 15, 12, 5); c.fillRect(2, 15, 12, 5); c.fillStyle = '#2a3a5a'; c.beginPath(); c.arc(14, 0, 5, 0, 7); c.fill(); c.fillStyle = '#7ad8ff'; c.beginPath(); c.arc(15, -1, 2, 0, 7); c.fill(); }
  c.restore();
}
function sees(s, i) { const p = POSTERS[i], r = real(s), d = SK.dist(r.x, r.y, p.x, p.y); if (d > s.C.range) return false; let da = Math.atan2(p.y - r.y, p.x - r.x) - r.h; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; return Math.abs(da) < 0.95; }
function real(s) { const q = at(s.d); return { x: q.x + s.dev.x + s.off.x, y: q.y + s.dev.y + s.off.y, h: q.h }; }
MG.add({
  id: 'landmark', stage: 'robots', cmd: 'TAP POSTERS THE ROBOT SEES!', time: 7, mood: 'night', winText: 'Parked on charger!', failText: 'Lost!',
  card: { title: 'Small errors add up', kind: 'Robotics', ref: 'Odometry drift and landmark correction (localisation)',
    text: 'A robot can keep track of where it is by counting how far its wheels have turned. This is called odometry. But wheels slip a little and are never exactly the size the robot thinks, so every metre adds a tiny error, and the errors pile up. The robot\'s guess slides further and further from the truth.\n\nThe fix is to look around. When the camera spots something whose place on the map it already knows, called a landmark, the robot can work out exactly where it is and reset its guess. Warehouse robots, robot vacuums and phones all mix counting with looking like this.',
    note: 'Counting wheel turns drifts as small errors add up; spotting a known landmark snaps the robot\'s guess back to the truth.' },
  init(g) { const s = g.s; s.C = CFG[Math.min(2, g.level)]; s.d = 0; s.off = { x: 0, y: 0 }; s.dev = { x: 0, y: 0 }; s.used = POSTERS.map(() => false); s.snap = 0; s.end = 0; s.crash = 0; s.miss = 0; },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const i = POSTERS.findIndex(p => SK.dist(x, y, p.x, p.y) < 42); if (i < 0) return;
    if (!s.used[i] && sees(s, i)) { s.used[i] = true; s.dev.x += s.off.x; s.dev.y += s.off.y; s.off = { x: 0, y: 0 }; s.snap = g.t; g.sfx('magic'); g.sfx('ding'); }
    else { s.miss = 0.5; g.sfx('wrong'); }
  },
  update(g, dt) {
    const s = g.s; s.miss = Math.max(0, s.miss - dt); if (g.t < 0.5 || g.done) return;
    if (s.d < TOTAL) {
      s.d = Math.min(TOTAL, s.d + SPEED * dt); const q = at(s.d);
      // the real robot slides off: a slight sideways creep from slipping wheels, plus a little too far forward
      const px = -Math.sin(q.h), py = Math.cos(q.h); s.off.x += (px * s.C.drift + Math.cos(q.h) * 3) * dt; s.off.y += (py * s.C.drift + Math.sin(q.h) * 3) * dt;
      const k = Math.exp(-4 * dt); s.dev.x *= k; s.dev.y *= k; // after a fix, it steers its believed spot back onto the route
      if (Math.hypot(s.off.x, s.off.y) > 54) { s.crash = g.t; g.sfx('thud'); g.sfx('crunch'); g.shake(5, 0.3); g.fail(); return; }
      if (s.d >= TOTAL) s.end = g.t;
    } else if (!g.done && g.t - s.end > 0.3) {
      const e = Math.hypot(s.off.x + s.dev.x, s.off.y + s.dev.y);
      if (e < 24) { g.win(); g.sfx('chime'); g.sfx('cheer'); g.burst(CHG.x, CHG.y, ['#5aff7a', '#ffe27a'], 20, 160); } else { s.potT = g.t; g.sfx('splash'); g.sfx('laugh'); g.fail(); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('landmark_wh', paintWarehouse), 0, 0, 360, 640);
    const q = at(s.d); let r = real(s);
    if (s.potT) { const k = Math.min(1, (t - s.potT) * 3); r = { x: SK.lerp(r.x, POT.x, k), y: SK.lerp(r.y, POT.y, k), h: r.h }; }
    // the camera's view cone from the real robot
    if (!g.done) { c.save(); c.fillStyle = 'rgba(140,220,255,0.10)'; c.beginPath(); c.moveTo(r.x, r.y); c.arc(r.x, r.y, s.C.range, r.h - 0.95, r.h + 0.95); c.closePath(); c.fill(); c.restore(); }
    // posters: lit while the camera can see them
    POSTERS.forEach((p, i) => { const vis = !g.done && !s.used[i] && sees(s, i); poster(c, p, vis || s.used[i], t); if (s.used[i]) { c.fillStyle = '#5aff7a'; c.beginPath(); c.arc(p.x + 16, p.y - 14, 6, 0, 7); c.fill(); } if (vis) SK.glow(c, g, p.x, p.y, 30); });
    // the ghost (where the robot thinks it is) and the real robot, joined by a thin line when they disagree
    const gx = q.x + s.dev.x, gy = q.y + s.dev.y, e = Math.hypot(r.x - gx, r.y - gy);
    if (e > 4 && !won) { c.save(); c.strokeStyle = `rgba(255,120,120,${Math.min(0.8, e / 40)})`; c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(gx, gy); c.lineTo(r.x, r.y); c.stroke(); c.restore(); }
    bot(c, gx, gy, q.h, true, t);
    bot(c, r.x, r.y, r.h, false, t);
    SK.tag(c, 'Charger', CHG.x, CHG.y + 44, 18);
    if (!g.done && e > 12) SK.tag(c, 'Its guess', gx, gy - 34, 18);
    if (!g.done && t < 3.5) SK.tag(c, 'Robot', r.x + 50, r.y + 4, 18);
    { const vi = s.used.findIndex((u, i) => !u && sees(s, i)); if (vi >= 0 && !g.done) { const p = POSTERS[vi]; SK.tag(c, 'Landmark', SK.clamp(p.x, 60, 300), p.y + 36, 18); } }
    // the snap: a ring flies from the ghost to the robot
    if (s.snap && t - s.snap < 0.4) { const k = (t - s.snap) / 0.4; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#ffe27a'; c.lineWidth = 3; c.beginPath(); c.arc(r.x, r.y, 10 + k * 40, 0, 7); c.stroke(); c.restore(); }
    if (s.crash) { for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(r.x + Math.cos(a) * 18, r.y - 22 + Math.sin(a) * 6, 4, 0, 7); c.fill(); } }
    // the fox supervising from the top corner
    SK.animal(c, 'fox', 300, 600, 0.75, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : e > 30 ? 'wow' : 'think', facing: -1 });
    // guidance: tap the poster the camera can see right now
    const nn = s.used.findIndex((u, i) => !u && sees(s, i));
    if (nn >= 0) SK.demo(g, c, 'tap', [POSTERS[nn].x, POSTERS[nn].y], null, { delay: 0.9 });
  },
  auto(g, dt, synth) { const s = g.s; POSTERS.forEach((p, i) => { if (!s.used[i] && sees(s, i)) { const B = s._bot = s._bot || {}; if (!B['p' + i]) B['p' + i] = g.t; if (g.t - B['p' + i] > 0.25) SK.bot.tap(g, synth, 'tap' + i, 0, p.x, p.y); } }); },
});
