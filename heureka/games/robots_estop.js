// E-STOP! (hardware RO-14) — a birthday party. Robots whose software has frozen (their screens show a spinning wheel)
// come zig-zagging in from the edges toward the cake, one after another. Each carries a big red emergency-stop button:
// slam it and the power to its motors is cut, every light goes dark and it skids to a dead stop. Miss one and it rams
// the table and the cake splats over the hedgehog. Level 2: four robots, faster. (Simplified from the row's robot arm
// to moving robots, so stopping takes three aimed slams instead of one tap.)
const RS = 1.3, TABLE = { x0: 96, x1: 264, y: 250 }, CAKE = { x: 180, y: 214 }, BR = 30;
const WAVES = [ // per level: robot speed (px/s), and each robot's start time and where it rolls in
  { v: 62, bots: [[0.9, 30, 540], [2.3, 330, 470], [3.6, 180, 596]] },
  { v: 74, bots: [[0.8, 30, 540], [1.9, 330, 470], [3.0, 180, 596]] },
  { v: 92, bots: [[0.6, 30, 560], [1.3, 330, 460], [2.0, 110, 596], [2.6, 320, 590]] },
];
function paintParty(o) {
  // a party room seen from above at a slant: wooden floor, rug, balloons in the corners
  const fl = o.createLinearGradient(0, 0, 0, 640); fl.addColorStop(0, '#d89a64'); fl.addColorStop(1, '#a86a40'); o.fillStyle = fl; o.fillRect(0, 0, 360, 640);
  o.strokeStyle = 'rgba(90,50,20,0.22)'; o.lineWidth = 2; for (let y = 10; y < 640; y += 28) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); const off = (y / 28) % 2 ? 60 : 0; for (let x = off; x < 360; x += 120) { o.beginPath(); o.moveTo(x, y); o.lineTo(x, y + 28); o.stroke(); } }
  // the far wall with bunting
  const wl = o.createLinearGradient(0, 0, 0, 140); wl.addColorStop(0, '#ffc8dc'); wl.addColorStop(1, '#ffe0ea'); o.fillStyle = wl; o.fillRect(0, 0, 360, 140);
  o.fillStyle = 'rgba(255,255,255,0.4)'; for (let x = 0; x < 360; x += 30) o.fillRect(x, 0, 14, 140);
  o.fillStyle = 'rgba(90,40,40,0.25)'; o.fillRect(0, 136, 360, 6);
  const cols = ['#ff5a7a', '#ffc83a', '#5ac8ff', '#7ae07a', '#c87aff'];
  o.strokeStyle = '#8a5a6a'; o.lineWidth = 2; o.beginPath(); o.moveTo(0, 50); o.quadraticCurveTo(180, 84, 360, 50); o.stroke();
  // a round rug
  o.fillStyle = '#7a5aa8'; o.beginPath(); o.ellipse(180, 420, 150, 110, 0, 0, 7); o.fill(); o.strokeStyle = '#ffc83a'; o.lineWidth = 5; o.beginPath(); o.ellipse(180, 420, 132, 94, 0, 0, 7); o.stroke();
  o.strokeStyle = 'rgba(255,255,255,0.25)'; o.lineWidth = 3; o.beginPath(); o.ellipse(180, 420, 96, 66, 0, 0, 7); o.stroke();
  for (let i = 0; i < 12; i++) { const x = 10 + i * 30, y = 50 + Math.sin((x / 360) * Math.PI) * 22; o.fillStyle = cols[i % 5]; o.beginPath(); o.moveTo(x, y); o.lineTo(x + 22, y + 1); o.lineTo(x + 11, y + 24); o.closePath(); o.fill(); }
  // the cake table
  SK.shadow(o, 180, TABLE.y + 14, 96, 14, 0.3);
  o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(TABLE.x0, 166, TABLE.x1 - TABLE.x0, TABLE.y - 166, 14); o.fill();
  o.fillStyle = '#f2e2cc'; o.beginPath(); o.moveTo(TABLE.x0, TABLE.y - 10); o.lineTo(TABLE.x1, TABLE.y - 10); o.lineTo(TABLE.x1, TABLE.y + 4); for (let x = TABLE.x1; x > TABLE.x0; x -= 21) o.quadraticCurveTo(x - 10, TABLE.y + 16, x - 21, TABLE.y + 4); o.closePath(); o.fill();
  o.fillStyle = 'rgba(255,90,122,0.3)'; for (let x = TABLE.x0 + 10; x < TABLE.x1; x += 24) { o.beginPath(); o.arc(x, TABLE.y - 2, 4, 0, 7); o.fill(); }
}
function cake(c, splat, t) {
  const { x, y } = CAKE; c.save();
  if (splat <= 0) {
    c.fillStyle = '#f0a0c0'; c.beginPath(); c.roundRect(x - 46, y - 4, 92, 28, 6); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(x - 36, y - 30, 72, 28, 6); c.fill();
    for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(x - 38 + i * 15.5, y - 3, 6, 0, Math.PI); c.fill(); }
    c.fillStyle = '#ff5a7a'; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(x - 28 + i * 14, y - 26, 3.2, 0, 7); c.fill(); }
    for (let i = 0; i < 3; i++) { const cx = x - 18 + i * 18; c.fillStyle = ['#5ac8ff', '#ffc83a', '#7ae07a'][i]; c.fillRect(cx - 3, y - 50, 6, 20); const f = 1 + 0.15 * Math.sin(t * 20 + i * 2); c.fillStyle = '#ffb43a'; c.beginPath(); c.ellipse(cx, y - 56, 4 * f, 7 * f, 0, 0, 7); c.fill(); c.fillStyle = '#fff6a0'; c.beginPath(); c.ellipse(cx, y - 54, 2, 3.5, 0, 0, 7); c.fill(); }
  } else {
    c.fillStyle = '#f0a0c0'; c.beginPath(); c.ellipse(x, y + 14, 58, 12, 0, 0, 7); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(x - 4, y + 8, 52, 10, 0, 0, 7); c.fill();
    const k = Math.min(1, splat * 4); for (let i = 0; i < 11; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 10), r = 30 + k * (60 + (i * 37) % 50); c.beginPath(); c.arc(x + Math.cos(a) * r, y + 6 + Math.sin(a) * r * 0.7, 6 + (i % 3) * 3, 0, 7); c.fill(); }
  }
  c.restore();
}
function robot(c, b, t) { // a squat delivery robot: body, wheels, a face screen and the big red button on top
  const on = !b.stop, x = b.x, y = b.y, jig = on ? Math.sin(t * 30 + b.ph) * 1.5 : 0, pop = SK.easeOut((t - b.t0) / 0.25);
  SK.shadow(c, x, y + 26 * RS, 30 * pop * RS, 9, 0.32);
  c.save(); c.translate(x + jig, y); c.scale(pop * RS, pop * RS);
  for (const s of [-1, 1]) { c.fillStyle = '#26262e'; c.beginPath(); c.roundRect(s * 26 - 6, 8, 12, 20, 4); c.fill(); }
  const bg = c.createLinearGradient(-28, 0, 28, 0); bg.addColorStop(0, '#8ad0e0'); bg.addColorStop(0.5, '#d8f2f8'); bg.addColorStop(1, '#6ab0c4'); c.fillStyle = bg; c.beginPath(); c.roundRect(-28, -22, 56, 46, 14); c.fill(); c.strokeStyle = '#3a6a7a'; c.lineWidth = 2.5; c.stroke();
  // face screen: a spinning "stuck" wheel while powered, black once the power is cut
  c.fillStyle = '#1a1c24'; c.beginPath(); c.roundRect(-18, -12, 36, 24, 6); c.fill();
  if (on) for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + t * 9; c.fillStyle = `rgba(160,230,255,${0.2 + 0.8 * i / 8})`; c.beginPath(); c.arc(Math.cos(a) * 7, Math.sin(a) * 7, 1.8, 0, 7); c.fill(); }
  // yellow collar and the red mushroom (pressed in when stopped)
  const dn = b.stop ? 4 : 0;
  c.fillStyle = '#ffd23a'; c.beginPath(); c.ellipse(0, -24, 22, 8, 0, 0, 7); c.fill(); c.strokeStyle = '#8a6a10'; c.lineWidth = 2; c.stroke();
  c.fillStyle = '#7a0a14'; c.beginPath(); c.ellipse(0, -28 + dn, 17, 7, 0, 0, 7); c.fill();
  const rg = c.createRadialGradient(-5, -40 + dn, 2, 0, -34 + dn, 18); rg.addColorStop(0, '#ff9a9a'); rg.addColorStop(0.6, '#e01a2a'); rg.addColorStop(1, '#8a0a14'); c.fillStyle = rg; c.beginPath(); c.ellipse(0, -32 + dn, 17, 12 - dn * 0.5, 0, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-5, -38 + dn, 6, 2.5, -0.3, 0, 7); c.fill();
  // status light
  c.fillStyle = on ? '#5aff8a' : '#2a2e34'; c.beginPath(); c.arc(20, 16, 3, 0, 7); c.fill();
  c.restore();
  if (b.stop && t - b.stop < 0.5) { const k = (t - b.stop) / 0.5; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#ffe27a'; c.lineWidth = 3; c.beginPath(); c.arc(x, y - 32 * RS, 18 + k * 30, 0, 7); c.stroke(); c.restore(); }
}
const btnPos = b => [b.x, b.y - 32 * RS];
MG.add({
  id: 'estop', stage: 'robots', cmd: 'SLAM EVERY RED STOP BUTTON!', time: 6, mood: 'party', winText: 'Cake saved!', failText: 'Splat!',
  card: { title: 'The big red button', kind: 'Robotics', ref: 'Emergency stop (e-stop)',
    text: 'Every real robot has a big red emergency stop button. Pressing it cuts the power to the motors directly, through its own wires, so the robot stops whatever its software is doing.\n\nThese robots\' software has frozen: their screens show a spinning wheel. A pause button on that screen would be handled by the same stuck software, so it might do nothing. The emergency stop does not ask the software. That is why factory robots, many machines and even treadmills have one, and why people who work near robots learn where it is first.',
    note: "An emergency stop cuts the motors' power directly, so it works even when the robot's software is stuck." },
  init(g) {
    const s = g.s, W = WAVES[Math.min(2, g.level)];
    s.v = W.v; s.bots = W.bots.map(([t0, x, y]) => ({ t0, x, y, sx: x, sy: y, ph: g.rand() * 6.28, wob: 0.6 + g.rand() * 0.4, stop: 0, in: false }));
    s.splat = 0; s.whoosh = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    let best = null, bd = BR + 8; for (const b of s.bots) { if (b.stop || g.t < b.t0) continue; const [bx, by] = btnPos(b), d = SK.dist(x, y, bx, by); if (d < bd) { bd = d; best = b; } }
    if (!best) return;
    best.stop = g.t; g.sfx('thud'); g.sfx('snap'); g.shake(3, 0.12); g.burst(best.x, best.y - 30, ['#ffe27a', '#fff6ea'], 10, 140);
    if (s.bots.every(b => b.stop)) { g.win(); g.sfx('cheer'); }
  },
  update(g, dt) {
    const s = g.s; if (s.splat) s.splat += dt; if (g.done) { for (const b of s.bots) if (b.stop && b.skid) b.skid = 0; return; }
    for (const b of s.bots) {
      if (b.stop || g.t < b.t0) continue;
      const tt = g.t - b.t0, dx = CAKE.x - b.x, dy = (TABLE.y + 40) - b.y, base = Math.atan2(dy, dx), a = base + b.wob * Math.sin(tt * 4.5 + b.ph);
      b.x += Math.cos(a) * s.v * dt; b.y += Math.sin(a) * s.v * dt;
      if (b.y < TABLE.y + 44 && b.x > TABLE.x0 - 10 && b.x < TABLE.x1 + 10) { s.splat = 0.001; g.sfx('splash'); g.sfx('crunch'); g.shake(6, 0.3); g.burst(CAKE.x, CAKE.y, ['#fff6ea', '#f0a0c0', '#ff5a7a'], 30, 260); g.fail(); return; }
    }
    if (g.t - s.whoosh > 0.4 && s.bots.some(b => !b.stop && g.t >= b.t0)) { s.whoosh = g.t; g.sfx('buzz', { vol: 0.18, pitch: 1.4 }); }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('estop_room', paintParty), 0, 0, 360, 640);
    for (const [x, y, col, ph] of [[26, 168, '#ff5a7a', 0], [334, 176, '#5ac8ff', 1.4], [318, 150, '#ffc83a', 2.6]]) { const yy = y + Math.sin(t * 1.5 + ph) * 5; SK.ball(c, x, yy, 18, col); }
    cake(c, s.splat, t);
    SK.tag(c, 'Cake', CAKE.x, CAKE.y + 50, 18);
    // the hedgehog guarding the cake, in a party hat
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'hedgehog', 296, 250, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : s.bots.some(b => !b.stop && t >= b.t0) ? 'wow' : 'happy', facing: -1 });
    c.fillStyle = '#5ac8ff'; c.beginPath(); c.moveTo(285, 200); c.lineTo(303, 200); c.lineTo(293, 170); c.closePath(); c.fill(); c.fillStyle = '#ffc83a'; c.beginPath(); c.arc(293, 169, 4.5, 0, 7); c.fill();
    if (lost) { c.fillStyle = '#fff6ea'; for (const [dx, dy, r] of [[-8, -34, 8], [8, -26, 6], [-2, -48, 5]]) { c.beginPath(); c.arc(296 + dx, 250 + dy, r, 0, 7); c.fill(); } }
    // the robots, nearest the bottom drawn last
    const vis = s.bots.filter(b => t >= b.t0).sort((a, b) => a.y - b.y);
    for (const b of vis) if (!b.stop && !g.done) { c.save(); c.strokeStyle = 'rgba(255,80,80,0.55)'; c.lineWidth = 3; c.setLineDash([8, 7]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(CAKE.x + (b.x - CAKE.x) * 0.25, TABLE.y + 30); c.stroke(); c.restore(); } // where it is heading
    for (const b of vis) { robot(c, b, t); if (!b.stop) { const [bx, by] = btnPos(b); SK.glow(c, g, bx, by, 24); } }
    const first = vis.find(b => !b.stop); if (first && !g.done) { const [bx, by] = btnPos(first); SK.tag(c, 'Stop button', SK.clamp(bx, 70, 290), by - 40, 18); }
    if (first) { const [bx, by] = btnPos(first); SK.demo(g, c, 'tap', [bx, by], null, { delay: first.t0 + 0.3, period: 0.9 }); }
  },
  auto(g, dt, synth) { const s = g.s; s.bots.forEach((b, i) => { if (!b.stop && g.t >= b.t0 + 0.45) { const [bx, by] = btnPos(b); SK.bot.tap(g, synth, 'b' + i, b.t0 + 0.45, bx, by); } }); },
});
