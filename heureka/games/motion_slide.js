// SLIDE! (physics PMS-01) — a top-down ice rink: flick the puck into the net. On ice it glides on at the same speed in
// a straight line; on the sand patch it scrapes to a stop at once and a crab pops out. Newton's first law, by doing it.
// Three pucks, each from a different spot, so it takes three good flicks (the owner: "slide three").
// Reference microgame for the fling mechanic (SK.dragStart / dragMove / dragEnd).
const RINK = { l: 18, r: 342, t: 78, b: 606 }, NET = { x0: 122, x1: 238, y: 78 }, PR = 15;
const LAYOUT = [ // per level: where the three pucks start and where the sand lies (rectangles, top-down)
  { pucks: [[180, 540], [286, 530], [226, 500]], sand: [[24, 200, 128, 220]] },
  { pucks: [[268, 540], [316, 470], [232, 548]], sand: [[24, 250, 176, 170]] },
  { pucks: [[180, 540], [118, 548], [236, 556]], sand: [[84, 280, 192, 100]] }, // straight shots are blocked: bank off a side wall
];
// the straight path from a to b keeps clear of the sand (sampled; r = the puck's margin)
function clear(L, a, b, r = PR) { for (let i = 0; i <= 40; i++) { const k = i / 40, x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k; for (const [dx, dy] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) if (inSand(L, x + dx, y + dy)) return false; } return true; }
// where the bot aims: straight at a clear spot in the net mouth, or at the net's mirror image beyond a side wall
function aimFor(L, a) {
  const ty = NET.y - 12;
  for (const tx of [180, 165, 195, 150, 210, 140, 220]) if (clear(L, a, [tx, ty])) return [tx, ty];
  for (const [wall, tx0] of [[RINK.r - PR, 180], [RINK.l + PR, 180]]) for (const tx of [tx0, 160, 200, 145, 215]) {
    const vx = 2 * wall - tx, k = (wall - a[0]) / (vx - a[0]), hy = a[1] + (ty - a[1]) * k;
    if (k > 0 && k < 1 && clear(L, a, [wall, hy]) && clear(L, [wall, hy], [tx, ty])) return [vx, ty];
  }
  return [180, ty];
}
const ICE_MU = 6, SAND_MU = 2600, VMAX = 950;
function inSand(L, x, y) { return L.sand.some(([sx, sy, w, h]) => x > sx && x < sx + w && y > sy && y < sy + h); }
function paintRink(o, L) {
  // the boards and the ice, seen from above
  o.fillStyle = '#c9385a'; o.fillRect(0, 0, 360, 640);
  o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(RINK.l - 8, RINK.t - 8, RINK.r - RINK.l + 16, RINK.b - RINK.t + 16, 34); o.fill();
  const ice = o.createLinearGradient(0, RINK.t, 0, RINK.b); ice.addColorStop(0, '#dff4fb'); ice.addColorStop(0.5, '#c4e8f6'); ice.addColorStop(1, '#e8f8fd');
  o.fillStyle = ice; o.beginPath(); o.roundRect(RINK.l, RINK.t, RINK.r - RINK.l, RINK.b - RINK.t, 28); o.fill();
  const rnd = P.rng(11); o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = 1.2; // skate scratches
  for (let i = 0; i < 40; i++) { const x = RINK.l + 20 + rnd() * 290, y = RINK.t + 20 + rnd() * 480, a = rnd() * 6.28, l = 20 + rnd() * 50; o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 8, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); o.stroke(); }
  o.strokeStyle = 'rgba(210,60,80,0.55)'; o.lineWidth = 4; o.beginPath(); o.moveTo(RINK.l, 342); o.lineTo(RINK.r, 342); o.stroke();
  o.strokeStyle = 'rgba(60,110,210,0.45)'; o.lineWidth = 3; o.beginPath(); o.arc(180, 342, 46, 0, 7); o.stroke();
  // the sand patches: warm grains with pebbles
  for (const [sx, sy, w, h] of L.sand) {
    o.save(); o.beginPath(); o.roundRect(sx, sy, w, h, 22); o.clip();
    const sg = o.createLinearGradient(sx, sy, sx, sy + h); sg.addColorStop(0, '#f2d79a'); sg.addColorStop(1, '#d9b46a'); o.fillStyle = sg; o.fillRect(sx, sy, w, h);
    for (let i = 0; i < w * h / 60; i++) { o.fillStyle = rnd() < 0.5 ? 'rgba(150,100,40,0.35)' : 'rgba(255,245,210,0.6)'; o.beginPath(); o.arc(sx + rnd() * w, sy + rnd() * h, 0.8 + rnd() * 1.6, 0, 7); o.fill(); }
    for (let i = 0; i < 4; i++) { o.fillStyle = '#b89a78'; o.beginPath(); o.ellipse(sx + 14 + rnd() * (w - 28), sy + 12 + rnd() * (h - 24), 5 + rnd() * 4, 3 + rnd() * 2, rnd() * 3, 0, 7); o.fill(); }
    o.restore(); o.strokeStyle = 'rgba(150,100,40,0.5)'; o.lineWidth = 2; o.beginPath(); o.roundRect(sx, sy, w, h, 22); o.stroke();
  }
  // the net at the top, seen from above: a mesh box behind the goal mouth
  o.fillStyle = 'rgba(60,40,60,0.18)'; o.fillRect(NET.x0, NET.y - 34, NET.x1 - NET.x0, 34);
  o.strokeStyle = 'rgba(255,255,255,0.85)'; o.lineWidth = 1; for (let x = NET.x0; x <= NET.x1; x += 9) { o.beginPath(); o.moveTo(x, NET.y - 34); o.lineTo(x, NET.y); o.stroke(); } for (let y = NET.y - 34; y <= NET.y; y += 8) { o.beginPath(); o.moveTo(NET.x0, y); o.lineTo(NET.x1, y); o.stroke(); }
  o.strokeStyle = '#e8403a'; o.lineWidth = 6; o.lineCap = 'round'; o.beginPath(); o.moveTo(NET.x0, NET.y + 2); o.lineTo(NET.x0, NET.y - 36); o.lineTo(NET.x1, NET.y - 36); o.lineTo(NET.x1, NET.y + 2); o.stroke();
  o.fillStyle = 'rgba(255,80,80,0.25)'; o.fillRect(NET.x0, NET.y, NET.x1 - NET.x0, 26);
}
function crab(c, x, y, k, t) { // pops up out of the sand, waving its claws
  if (k <= 0) return; c.save(); c.translate(x, y + (1 - k) * 18); c.globalAlpha = Math.min(1, k * 2);
  const wav = Math.sin(t * 10) * 0.3; c.fillStyle = '#e8563a'; c.strokeStyle = '#7a2414'; c.lineWidth = 2;
  for (const s of [-1, 1]) { c.save(); c.translate(s * 16, -8); c.rotate(s * (0.5 + wav)); c.beginPath(); c.ellipse(0, -10, 7, 9, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(-2, -18); c.lineTo(0, -10); c.lineTo(3, -18); c.fill(); c.fillStyle = '#e8563a'; c.restore(); }
  c.beginPath(); c.ellipse(0, 0, 18, 11, 0, 0, 7); c.fill(); c.stroke();
  for (const s of [-1, 1]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(s * 6, -12, 4.5, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(s * 6 + 1, -12, 2, 0, 7); c.fill(); }
  c.strokeStyle = '#7a2414'; c.beginPath(); c.arc(0, 1, 5, 0.2, Math.PI - 0.2); c.stroke(); c.restore();
}
function newPuck(g) { const s = g.s, [x, y] = s.L.pucks[s.n]; s.p = { x, y, vx: 0, vy: 0, r: PR }; s.moving = false; s.trail = []; s.born = g.t; s.flicked = false; }
MG.add({
  id: 'slide', stage: 'motion', cmd: 'SLIDE 3 PUCKS IN!', time: 6, mood: 'sea', winText: 'Inertia!', failText: 'Friction!',
  card: { title: 'Things keep moving', kind: 'Physics', ref: "Newton's first law",
    text: 'On ice, almost nothing rubs against the puck, so it keeps sliding at the same speed in a straight line. On sand, the grains rub against it and stop it almost at once. That rubbing is called friction.\n\nA moving thing keeps moving in a straight line, at the same speed, until a push, a pull or a rub changes that. A thing at rest stays at rest the same way. This is called inertia.',
    note: 'Things keep going until a force stops them. This is Newton\'s first law of motion.' },
  init(g) {
    const s = g.s, L = LAYOUT[Math.min(2, g.level)];
    s.L = L; s.n = 0; s.goals = []; s.stuck = 0; s.shots = 0; s.next = 0; newPuck(g);
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (s.moving || s.next || g.done) return; if (SK.dist(x, y, s.p.x, s.p.y) < 64) SK.dragStart(g, null, x, y); },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || s.moving || s.next || g.done) return;
    let { vx, vy } = d; const sp = Math.hypot(vx, vy); if (sp < 140) return; // a nudge, not a flick
    if (sp > VMAX) { vx *= VMAX / sp; vy *= VMAX / sp; }
    s.p.vx = vx; s.p.vy = vy; s.moving = true; s.shots++; s.flicked = true; g.sfx('swoosh'); g.sfx('tap');
  },
  update(g, dt) {
    const s = g.s; if (s.next && g.t >= s.next && !g.done) { s.next = 0; newPuck(g); }
    const p = s.p; if (!s.moving) return;
    for (let i = 0; i < 4; i++) { // small sub-steps so a fast puck never skips the net or the sand
      const h = dt / 4, sand = inSand(s.L, p.x, p.y), mu = sand ? SAND_MU : ICE_MU;
      const hit = SK.step(p, h, { gy: 0 });
      const sp = Math.hypot(p.vx, p.vy); if (sp > 0) { const k = Math.max(0, sp - mu * h) / sp; p.vx *= k; p.vy *= k; }
      if (p.x - PR < RINK.l) { p.x = RINK.l + PR; p.vx = Math.abs(p.vx) * 0.9; g.sfx('thud'); }
      if (p.x + PR > RINK.r) { p.x = RINK.r - PR; p.vx = -Math.abs(p.vx) * 0.9; g.sfx('thud'); }
      if (p.y + PR > RINK.b) { p.y = RINK.b - PR; p.vy = -Math.abs(p.vy) * 0.9; g.sfx('thud'); }
      if (p.y - PR < RINK.t) {
        if (p.x > NET.x0 + 4 && p.x < NET.x1 - 4) { // a goal: the puck rests in the net, and the next one comes out
          if (!g.done) { g.burst(p.x, NET.y - 10, ['#ff5a5a', '#fff6ea', '#ffd45a'], 18, 190); s.goals.push([SK.clamp(p.x, NET.x0 + 14, NET.x1 - 14), NET.y - 18 - (s.goals.length % 2) * 6]); s.n++;
            if (s.n >= s.L.pucks.length) { g.win(); g.sfx('cheer'); } else { g.sfx('chime'); s.next = g.t + 0.35; } }
          p.vx = p.vy = 0; s.moving = false; p.gone = true; break; }
        else { p.y = RINK.t + PR; p.vy = Math.abs(p.vy) * 0.9; g.sfx('thud'); }
      }
      if (sand && !g.done && Math.hypot(p.vx, p.vy) < 4) { p.vx = p.vy = 0; s.moving = false; s.stuck = g.t; g.sfx('crunch'); g.sfx('laugh'); g.fail(); break; }
      if (!sand && Math.hypot(p.vx, p.vy) < 8) { p.vx = p.vy = 0; s.moving = false; }
    }
    if (s.moving) { s.trail.push([p.x, p.y, inSand(s.L, p.x, p.y)]); if (s.trail.length > 40) s.trail.shift(); }
    if (inSand(s.L, p.x, p.y) && s.moving && g.rand() < 0.6) s.grit = (s.grit || 0) + 1;
  },
  draw(g, c) {
    const s = g.s, p = s.p, t = g.t;
    c.drawImage(g.bake('slide_rink' + Math.min(2, g.level), o => paintRink(o, s.L)), 0, 0, 360, 640);
    // the two surfaces, named (the owner: label what the idea needs)
    for (const [sx, sy, w, h] of s.L.sand) SK.tag(c, 'Sand', sx + w / 2, sy + h / 2, 18);
    SK.tag(c, 'Ice', g.level >= 2 ? 180 : 262, 452, 18, '#1e4a6a', 'rgba(255,255,255,0.75)');
    // pucks already in the net
    for (const [x, y] of s.goals) { c.fillStyle = '#2a2430'; c.beginPath(); c.arc(x, y, PR - 2, 0, 7); c.fill(); }
    // pucks still to come, waiting by the boards (the count to go)
    for (let i = s.n + 1; i < s.L.pucks.length; i++) { const x = 42 + (i - s.n - 1) * 30, y = 584; c.fillStyle = '#2a2430'; c.beginPath(); c.arc(x, y, 11, 0, 7); c.fill(); c.strokeStyle = '#5a5060'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 7, 0, 7); c.stroke(); }
    // the trail: a long straight streak on ice, a scuffed scrape on sand
    for (let i = 1; i < s.trail.length; i++) { const [x0, y0] = s.trail[i - 1], [x1, y1, sd] = s.trail[i]; c.strokeStyle = sd ? 'rgba(140,90,30,0.5)' : `rgba(255,255,255,${0.15 + 0.6 * i / s.trail.length})`; c.lineWidth = sd ? 8 : 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
    // the crab, when the puck sticks in the sand
    if (s.stuck) crab(c, p.x + (p.x < 180 ? 40 : -40), p.y + 8, Math.min(1, (t - s.stuck) * 3), t);
    // the aim line while dragging
    const d = g.s._drag; if (d && !s.moving) { const q = d.pts[d.pts.length - 1]; c.save(); c.strokeStyle = 'rgba(58,22,64,0.35)'; c.lineWidth = 3; c.setLineDash([5, 6]); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); c.restore(); }
    // the puck (it pops in when it arrives)
    if (p.gone && !s.next) return; const pop = Math.min(1, (t - s.born) * 6);
    c.save(); c.translate(p.x, p.y); c.scale(pop, pop); c.translate(-p.x, -p.y);
    SK.shadow(c, p.x + 3, p.y + 5, PR, PR * 0.7, 0.22);
    c.fillStyle = '#2a2430'; c.beginPath(); c.arc(p.x, p.y, PR, 0, 7); c.fill(); c.strokeStyle = '#5a5060'; c.lineWidth = 2.5; c.beginPath(); c.arc(p.x, p.y, PR - 4, 0, 7); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(p.x - 5, p.y - 6, 5, 2.5, -0.6, 0, 7); c.fill(); c.restore();
    if (!s.moving && !s.next && !g.done) SK.glow(c, g, p.x, p.y, 26);
    // the penguin on the boards, cheering when the puck goes in
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'penguin', 316, 632, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // guidance: the ghost hand flicks toward a clear line to the net
    if (!s.moving && !s.next) { const [ax, ay] = aimFor(s.L, [p.x, p.y]), L = Math.hypot(ax - p.x, ay - p.y); SK.demo(g, c, 'swipe', [p.x, p.y], [p.x + (ax - p.x) / L * 120, p.y + (ay - p.y) / L * 120]); }
  },
  // the bot: for each puck, flick along a clear straight line to the net, or bank it off a side wall
  auto(g, dt, synth) {
    const s = g.s, p = s.p; if (s.moving || s.next || s.flicked || g.done || g.t - s.born < 0.4) return;
    const [tx, ty] = aimFor(s.L, [p.x, p.y]), dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy), v = 760, dur = 0.16;
    s.botAt = s.botAt || {}; if (s.botAt[s.n] == null) s.botAt[s.n] = s.n ? g.t : 1.0;
    SK.bot.drag(g, synth, 'flick' + s.n, s.botAt[s.n], [p.x, p.y], [p.x + dx / L * v * dur, p.y + dy / L * v * dur], dur);
  },
});
