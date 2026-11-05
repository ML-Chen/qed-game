// APPROACH! (earth_eng SC-01) — three robots in three lanes, each driving toward a wall with a distance sensor and
// parking on the yellow line. Each robot's speed is its gain knob times the distance still to go. Too little gain:
// it creeps and never arrives in time. Too much: it races in, overshoots, bonks the wall and bounces back and forth.
// Turn each lane's knob (colour-matched) until its robot slows smoothly and stops on the line. The robots differ: a
// light zippy one, a medium one and a heavy one that takes longer to speed up and slow down, so each needs its own
// gain. Level 2: a slippery floor makes every robot slower to respond.
const LANES = [190, 316, 442], X0 = 50, LINE = 284, WALL = 326, KY = 566, KX = [70, 180, 290];
const BOTS = [{ tau: 0.12, col: '#ff7a5a', w: 40, rider: 'rabbit' }, { tau: 0.2, col: '#5ab8ff', w: 48, rider: 'ant' }, { tau: 0.3, col: '#8ad06a', w: 58, rider: 'beaver' }];
const VMAX = 170, gainOf = k => 0.04 * Math.pow(150, k), kOf = K => Math.log(K / 0.04) / Math.log(150);
function paintLanes(o) {
  o.fillStyle = '#d8d0c0'; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(9); for (let i = 0; i < 400; i++) { o.fillStyle = `rgba(120,100,80,${0.05 + rnd() * 0.08})`; o.fillRect(rnd() * 360, rnd() * 640, 2, 2); }
  for (let i = 0; i < 3; i++) {
    const y = LANES[i];
    o.fillStyle = '#b8ae9a'; o.beginPath(); o.roundRect(14, y - 52, 332, 104, 14); o.fill();
    o.fillStyle = '#c8bea8'; o.beginPath(); o.roundRect(18, y - 48, 324, 96, 12); o.fill();
    o.strokeStyle = 'rgba(80,60,40,0.18)'; o.lineWidth = 2; o.setLineDash([12, 12]); o.beginPath(); o.moveTo(24, y); o.lineTo(WALL - 10, y); o.stroke(); o.setLineDash([]);
    // the parking line and the brick wall
    o.fillStyle = '#ffcc2a'; o.fillRect(LINE - 3, y - 46, 6, 92); o.fillStyle = 'rgba(0,0,0,0.15)'; for (let k = 0; k < 6; k++) o.fillRect(LINE - 3, y - 44 + k * 16, 6, 6);
    for (let r = 0; r < 6; r++) for (let cI = 0; cI < 2; cI++) { o.fillStyle = (r + cI) % 2 ? '#b04a3a' : '#c85a44'; o.fillRect(WALL + cI * 9 + (r % 2 ? 4 : 0), y - 48 + r * 16, 9, 15); }
    o.fillStyle = 'rgba(0,0,0,0.25)'; o.fillRect(WALL - 3, y - 48, 3, 96);
    // a cable from this lane down to its knob
    o.fillStyle = BOTS[i].col; o.beginPath(); o.roundRect(18, y - 48, 8, 96, [12, 0, 0, 12]); o.fill(); // the lane's colour, matching its knob
  }
  // the control panel
  o.fillStyle = '#3a3a48'; o.beginPath(); o.roundRect(12, KY - 46, 336, 92, 16); o.fill(); o.strokeStyle = '#5a5a6a'; o.lineWidth = 3; o.stroke();
  for (let i = 0; i < 3; i++) { o.fillStyle = BOTS[i].col; o.beginPath(); o.roundRect(KX[i] - 40, KY - 42, 80, 6, 3); o.fill(); }
}
function robot(c, b, B, y, t) {
  const x = b.x - B.w; c.save(); c.translate(x, y);
  SK.shadow(c, B.w / 2 + 3, 30, B.w * 0.55, 6, 0.3);
  c.fillStyle = '#26262e'; for (const yy of [-30, 22]) { c.beginPath(); c.roundRect(6, yy, 16, 8, 3); c.fill(); c.beginPath(); c.roundRect(B.w - 22, yy, 16, 8, 3); c.fill(); }
  const gr = c.createLinearGradient(0, -24, 0, 24); gr.addColorStop(0, P.shade(B.col, 0.35)); gr.addColorStop(1, P.shade(B.col, -0.25)); c.fillStyle = gr; c.beginPath(); c.roundRect(0, -24, B.w, 48, 10); c.fill(); c.strokeStyle = P.shade(B.col, -0.55); c.lineWidth = 2.5; c.stroke();
  c.fillStyle = '#1a1a22'; c.beginPath(); c.roundRect(B.w - 8, -10, 10, 20, 4); c.fill(); c.fillStyle = '#ff4a5a'; c.beginPath(); c.arc(B.w - 2, 0, 3, 0, 7); c.fill(); // the distance sensor
  c.restore();
}
MG.add({
  id: 'approach', stage: 'robots', cmd: 'PARK EACH ROBOT ON THE LINE!', time: 7, mood: 'bright', winText: 'Smooth stop!', failText: 'Missed!',
  card: { title: 'Correct by how far off you are', kind: 'Control', ref: 'Proportional control and gain',
    text: 'Each robot measures how far it still is from the line. That gap is called the error. Its rule is simple: speed equals gain times error. Far away, it drives fast; close up, it slows down; on the line, it stops.\n\nThe gain sets how strongly it reacts. Too little, and it creeps and takes ages. Too much, and it rushes in, cannot slow down in time, overshoots and bounces back and forth. A heavy robot takes longer to change speed, so it needs a gentler gain. Thermostats, cruise control, drones and robot arms all use this kind of feedback.',
    note: 'A feedback controller corrects in proportion to the error; the gain must be big enough to get there and small enough not to overshoot.' },
  init(g) {
    const s = g.s, slip = g.level >= 2 ? 1.5 : g.level >= 1 ? 1.2 : 1;
    s.b = BOTS.map((B, i) => ({ i, x: X0 + B.w, v: 0, tau: B.tau * slip, kn: B6.knob(KX[i], KY, 24, 0.06), settle: 0, done: false, bonk: 0 }));
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; for (const b of s.b) if (!b.done && B6.knobDown(g, b.kn, x, y, 1.9)) return; },
  move(g, x, y) { for (const b of g.s.b) if (b.kn.grab) B6.knobMove(g, b.kn, x, y); },
  up(g) { for (const b of g.s.b) B6.knobUp(b.kn); },
  update(g, dt) {
    const s = g.s; if (g.t < 0.6) return;
    for (const b of s.b) {
      b.bonk = Math.max(0, b.bonk - dt); if (b.done) { b.v *= Math.exp(-dt * 10); continue; }
      const K = gainOf(b.kn.k), vc = SK.clamp(K * (LINE - b.x), -VMAX, VMAX);
      for (let i = 0; i < 4; i++) { const h = dt / 4; b.v += (vc - b.v) * (1 - Math.exp(-h / b.tau)); b.x += b.v * h; if (b.x > WALL) { b.x = WALL; b.v = -Math.abs(b.v) * 0.5; b.bonk = 0.4; g.sfx('thud'); g.shake(2, 0.1); } }
      if (Math.abs(b.x - LINE) < 5 && Math.abs(b.v) < 14) b.settle += dt; else b.settle = 0;
      if (b.settle > 0.35 && !g.done) { b.done = true; b.x = LINE; g.sfx('ding'); g.burst(LINE, LANES[b.i], ['#ffcc2a', '#7aff9a'], 12, 120); }
    }
    if (!g.done && s.b.every(b => b.done)) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win';
    c.drawImage(g.bake('approach_lanes', paintLanes), 0, 0, 360, 640);
    for (const b of s.b) {
      const B = BOTS[b.i], y = LANES[b.i];
      // the sensor's beam to the wall: the error it measures
      if (!b.done) { c.save(); c.strokeStyle = 'rgba(255,60,80,0.5)'; c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(b.x + 2, y); c.lineTo(WALL, y); c.stroke(); c.restore(); }
      robot(c, b, B, y, t);
      if (!b.done) { const vc = SK.clamp(gainOf(b.kn.k) * (LINE - b.x), -VMAX, VMAX), L = vc * 0.32, ay = y - 34; if (Math.abs(L) > 2) { c.strokeStyle = '#fff6ea'; c.fillStyle = '#fff6ea'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(b.x - B.w / 2, ay); c.lineTo(b.x - B.w / 2 + L, ay); c.stroke(); const d = Math.sign(L); c.beginPath(); c.moveTo(b.x - B.w / 2 + L + d * 8, ay); c.lineTo(b.x - B.w / 2 + L - d * 2, ay - 7); c.lineTo(b.x - B.w / 2 + L - d * 2, ay + 7); c.fill(); } } // the speed it is asking for: gain times distance
      SK.animal(c, B.rider, b.x - B.w / 2, y + 8, B.rider === 'ant' ? 0.7 : 0.55, { t, pose: won || b.done ? 'cheer' : b.bonk ? 'hop' : 'idle', expr: b.done || won ? 'laugh' : b.bonk ? 'wow' : 'happy', noShadow: true });
      if (b.bonk) { for (let k = 0; k < 3; k++) { const a = t * 7 + k * 2.1; c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(WALL - 8 + Math.cos(a) * 12, y - 30 + Math.sin(a) * 6, 4, 0, 7); c.fill(); } }
      if (b.done) { c.fillStyle = '#5aff7a'; c.beginPath(); c.arc(KX[b.i] + 34, KY - 30, 6, 0, 7); c.fill(); }
      B6.drawKnob(c, b.kn, { col: P.shade(B.col, -0.45), cap: P.shade(B.col, 0.5), arc: B.col });
    }
    for (let i = 0; i < 3; i++) SK.tag(c, 'Gain', KX[i] - 2, KY + 40, 18);
    SK.tag(c, 'Wall', WALL + 4, LANES[0] - 64, 18); SK.tag(c, 'Sensor', 120, LANES[0] - 64, 18);
    { const nb = s.b.find(b => !b.done); if (nb && !g.done && !nb.kn.grab) SK.grab(c, g, nb.kn.x, nb.kn.y, 30); }
    // guidance: turn the first unsettled robot's knob toward a good gain (up from a creep, down from a bounce)
    const nx = s.b.find(b => !b.done); if (nx) { const want = kOf(0.9 / (4 * nx.tau)), up = want > nx.kn.k, R = 38, ca = k => -Math.PI / 2 + (k - 0.5) * B6.SWEEP, a0 = ca(nx.kn.k), a1 = ca(SK.clamp(nx.kn.k + (up ? 0.25 : -0.25), 0, 1)); SK.demo(g, c, 'drag', [nx.kn.x + Math.cos(a0) * R, nx.kn.y + Math.sin(a0) * R], [nx.kn.x + Math.cos(a1) * R, nx.kn.y + Math.sin(a1) * R], { arc: 14 }); }
  },
  auto(g, dt, synth) { // set each knob near critical damping (gain about 1 / (4 x response time))
    const s = g.s; s.b.forEach((b, i) => B6.botTurn(g, synth, b.kn, 'k' + i, 0.9 + i * 0.55, kOf(0.9 / (4 * b.tau)), 0.4));
  },
});
