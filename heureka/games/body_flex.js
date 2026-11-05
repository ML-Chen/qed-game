// FLEX! (chem_bio AN-05, renamed from LIFT!) — a rabbit's arm with a see-through window: the upper arm bone, the
// forearm bones hinged at the elbow, and the red biceps joined to the forearm just below the elbow. A snack sits in the
// paw. Drag the biceps up (it tightens and bulges): it shortens only a little, yet the paw swings a long way up to the
// mouth: a lever. Let go and the arm drops back for the next snack from the hedgehog. Pushing the muscle down does
// nothing: muscles only pull. 2 / 3 / 3 snacks; heavier snacks lift more slowly (the muscle shakes), level 2 heaviest.
const SH = [96, 262], EL = [96, 448], FORE = 176, INS = 26, MOUTH = [150, 228];
const SNACKS = [{ k: 'acorn', w: 1 }, { k: 'berry', w: 1 }, { k: 'carrot', w: 1.6 }, { k: 'apple', w: 2.2 }, { k: 'pine', w: 2.6 }];
const ins = th => [EL[0] + Math.cos(th) * INS, EL[1] - Math.sin(th) * INS - 8];
const paw = th => [EL[0] + Math.cos(th) * FORE, EL[1] - Math.sin(th) * FORE];

function paintRoom(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#c8e8b0'); bg.addColorStop(1, '#f0f4c8'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(3); for (let i = 0; i < 16; i++) { o.fillStyle = 'rgba(255,255,255,0.35)'; o.beginPath(); o.arc(rnd() * 360, rnd() * 640, 20 + rnd() * 40, 0, 7); o.fill(); }
  // a picnic table and blanket
  o.fillStyle = '#e86a5a'; o.fillRect(0, 500, 360, 140); o.fillStyle = '#fff6ea'; for (let x = 0; x < 360; x += 40) for (let y = 500; y < 640; y += 40) if (((x + y) / 40) % 2) o.fillRect(x, y, 40, 40);
  o.fillStyle = 'rgba(0,0,0,0.08)'; o.fillRect(0, 500, 360, 8);
}
function snack(c, k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (k === 'acorn') { c.fillStyle = '#c88a4a'; c.beginPath(); c.ellipse(0, 4, 10, 12, 0, 0, 7); c.fill(); c.fillStyle = '#7a4a2a'; c.beginPath(); c.ellipse(0, -6, 12, 6, 0, 0, 7); c.fill(); }
  else if (k === 'berry') { SK.ball(c, 0, 0, 11, '#c83a6a'); c.fillStyle = '#4a9a3a'; c.beginPath(); c.ellipse(0, -12, 6, 3, 0, 0, 7); c.fill(); }
  else if (k === 'carrot') { c.fillStyle = '#ff8a2a'; c.strokeStyle = '#b8501a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, -14); c.lineTo(6, -14); c.lineTo(0, 22); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#4aa83a'; c.beginPath(); c.ellipse(-3, -20, 3, 8, -0.3, 0, 7); c.ellipse(3, -20, 3, 8, 0.3, 0, 7); c.fill(); }
  else if (k === 'apple') { SK.ball(c, 0, 2, 16, '#e83a3a'); c.strokeStyle = '#6a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -12); c.lineTo(2, -20); c.stroke(); }
  else { c.fillStyle = '#9a6a3a'; c.strokeStyle = '#5a3a1a'; c.lineWidth = 1.5; for (let r = 0; r < 4; r++) for (let i = -r; i <= r; i += 2) { c.beginPath(); c.ellipse(i * 4, -12 + r * 8, 5, 4, 0, 0, 7); c.fill(); c.stroke(); } }
  c.restore();
}

MG.add({
  id: 'body_flex', stage: 'body', cmd: 'PULL THE BICEPS TO EAT!', time: 7, mood: 'bright', winText: 'Small pull, big lift!', failText: 'Still hungry!',
  card: { title: 'Muscles pull on bones', kind: 'Biology', ref: 'Muscles, joints and levers',
    text: 'Muscles can only pull. When your biceps tightens, it gets shorter and fatter, and its tendon pulls on your forearm just below the elbow. The forearm swings up around the elbow joint, like a lever.\n\nBecause the biceps is attached so close to the elbow, a short pull moves your hand a long way, and fast. The cost is force: the biceps must pull many times harder than the weight in your hand.\n\nTo straighten the arm again, the biceps relaxes and the triceps, on the back of the upper arm, pulls the other way.',
    note: 'A muscle pulls on a bone close to a joint, so a short pull swings the hand a long way, but it takes a big force.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.v = SK.variant(g, 4); const pool = SK.shuffled(g, SNACKS.slice(0, 4 + (L ? 1 : 0))); pool.unshift(...pool.splice(s.v % pool.length, 1));
    s.list = pool.slice(0, L >= 2 ? 4 : 3).map((q, i) => ({ k: q.k, w: L === 0 ? Math.min(1.3, q.w) : L === 1 ? Math.min(2, q.w) : Math.max(1.6, q.w) })); s.i = 0; s.th = 0; s.tgt = 0; s.held = null; s.has = true; s.ate = -9; s.push = -9; s.trail = [];
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const m = [(SH[0] + ins(s.th)[0]) / 2 + 22, (SH[1] + ins(s.th)[1]) / 2]; if (SK.dist(x, y, m[0], m[1]) < 90 || (x < 180 && y > 230 && y < 470)) s.held = { y0: y, th0: s.th }; },
  move(g, x, y) {
    const s = g.s; if (!s.held || g.done) return; const dy = s.held.y0 - y;
    if (dy < -24) { if (g.t - s.push > 0.6) { s.push = g.t; g.sfx('boing'); } s.tgt = s.held.th0; return; } // pushing: a muscle can't push
    s.tgt = SK.clamp(s.held.th0 + dy / 70 * 1.6, 0, 1.6);
  },
  up(g) { g.s.held = null; },
  update(g, dt) {
    const s = g.s, sn = s.list[s.i];
    if (!s.held) s.tgt = 0; // let go: the arm relaxes and drops
    const w = s.has && sn ? sn.w : 1, rate = s.tgt > s.th ? 7 / w : 6;
    s.th += (s.tgt - s.th) * Math.min(1, dt * rate);
    const p = paw(s.th); s.trail.push([p[0], p[1]]); if (s.trail.length > 30) s.trail.shift();
    if (s.has && s.th > 1.32 && !g.done) { s.has = false; s.ate = g.t; s.i++; g.sfx('munch'); g.sfx('crunch'); if (s.i >= s.list.length) { g.win(); g.sfx('cheer'); } }
    if (!s.has && !g.done && s.th < 0.25 && g.t - s.ate > 0.3) { s.has = true; g.sfx('pop'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', th = s.th, sn = s.list[Math.min(s.i, s.list.length - 1)];
    c.drawImage(g.bake('body_flex_room', paintRoom), 0, 0, 360, 640);
    // the hedgehog helper with the next snacks on the blanket
    SK.animal(c, 'hedgehog', 300, 590, 1.0, { t, pose: s.has ? 'idle' : 'carry', expr: won ? 'laugh' : 'happy', facing: -1 });
    for (let j = s.i + 1; j < s.list.length; j++) snack(c, s.list[j].k, 230 + (j - s.i) * 28, 560, 0.9);
    // the rabbit: ears, head, body
    const chew = t - s.ate < 0.8 ? Math.abs(Math.sin((t - s.ate) * 18)) : 0;
    c.fillStyle = '#f6eee6'; c.strokeStyle = '#8a6a6a'; c.lineWidth = 3;
    for (const d of [-1, 1]) { c.save(); c.translate(176 + d * 22, 150); c.rotate(d * 0.25 + Math.sin(t * 2 + d) * 0.04); c.beginPath(); c.ellipse(0, -36, 13, 38, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#f7b4c4'; c.beginPath(); c.ellipse(0, -32, 6, 28, 0, 0, 7); c.fill(); c.fillStyle = '#f6eee6'; c.restore(); }
    c.beginPath(); c.roundRect(60, 250, 190, 270, 70); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(176, 196, 58, 50, 0, 0, 7); c.fill(); c.stroke();
    for (const d of [-1, 1]) { c.fillStyle = '#2a1424'; if (won) { c.strokeStyle = '#2a1424'; c.lineWidth = 3; c.beginPath(); c.arc(176 + d * 22, 190, 6, Math.PI + 0.3, -0.3); c.stroke(); } else { c.beginPath(); c.arc(176 + d * 22, 188, 6, 0, 7); c.fill(); } }
    c.fillStyle = 'rgba(247,150,170,0.5)'; for (const d of [-1, 1]) { c.beginPath(); c.ellipse(176 + d * 38, 210, 11, 7, 0, 0, 7); c.fill(); }
    c.fillStyle = '#e8708a'; c.beginPath(); c.moveTo(170, 204); c.lineTo(182, 204); c.lineTo(176, 211); c.fill();
    c.fillStyle = '#8a3a4a'; c.beginPath(); c.ellipse(MOUTH[0] + 8, MOUTH[1] - 6, 9, 3 + chew * 5 + (s.has && th > 0.9 ? 4 : 0), 0, 0, 7); c.fill();
    // the hand's path: a big arc, compared with the muscle's short pull
    c.strokeStyle = 'rgba(90,60,120,0.25)'; c.lineWidth = 3; c.setLineDash([6, 8]); c.beginPath(); c.arc(EL[0], EL[1], FORE, -1.4, 0); c.stroke(); c.setLineDash([]);
    // the arm: upper arm (skin with a window), bones, biceps, forearm and paw
    const pw = paw(th), ip = ins(th), shake = s.has && sn && sn.w > 1.3 && s.held && th < 1.3 ? Math.sin(t * 50) * sn.w * 0.8 : 0;
    c.lineCap = 'round';
    c.strokeStyle = '#8a6a6a'; c.lineWidth = 50; c.beginPath(); c.moveTo(SH[0], SH[1] - 10); c.lineTo(EL[0], EL[1]); c.lineTo(pw[0], pw[1]); c.stroke();
    c.strokeStyle = '#fbf2ea'; c.lineWidth = 44; c.stroke();
    c.strokeStyle = 'rgba(255,220,210,0.9)'; c.lineWidth = 34; c.beginPath(); c.moveTo(SH[0], SH[1] + 4); c.lineTo(EL[0], EL[1]); c.lineTo(EL[0] + (pw[0] - EL[0]) * 0.85, EL[1] + (pw[1] - EL[1]) * 0.85); c.stroke();
    // bones
    c.strokeStyle = '#fff8e8'; c.lineWidth = 10; c.beginPath(); c.moveTo(SH[0] - 6, SH[1] + 6); c.lineTo(EL[0] - 6, EL[1]); c.stroke();
    c.beginPath(); c.moveTo(EL[0], EL[1]); c.lineTo(EL[0] + (pw[0] - EL[0]) * 0.8, EL[1] + (pw[1] - EL[1]) * 0.8); c.stroke();
    c.strokeStyle = '#d8c8a8'; c.lineWidth = 2; c.beginPath(); c.arc(EL[0] - 2, EL[1], 9, 0, 7); c.stroke();
    // biceps: a fat red belly between the shoulder and the forearm, fatter as it shortens
    const short = th / 1.6, belly = 18 + short * 16 + (s.held ? 2 : 0), bx = (SH[0] + ip[0]) / 2 + 14 + short * 6 + shake, by = (SH[1] + ip[1]) / 2;
    const slack = t - s.push < 0.5 ? Math.sin((t - s.push) * 30) * 5 : 0;
    c.fillStyle = s.held ? '#e8384a' : '#d8505a'; c.strokeStyle = '#8a1a2a'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(SH[0] + 8, SH[1] + 10); c.quadraticCurveTo(bx + belly + slack, by, ip[0] + 4, ip[1]); c.quadraticCurveTo(bx - belly * 0.4, by, SH[0] + 8, SH[1] + 10); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255,200,200,0.6)'; c.lineWidth = 1.5; for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(SH[0] + 10, SH[1] + 14); c.quadraticCurveTo(bx + belly * (0.2 + i * 0.2), by, ip[0] + 4, ip[1] - 2); c.stroke(); }
    c.strokeStyle = '#f4e8d8'; c.lineWidth = 4; c.beginPath(); c.moveTo(ip[0] + 4, ip[1]); c.lineTo(ip[0], ip[1] + 6); c.stroke(); // tendon
    // paw and snack
    c.fillStyle = '#fbf2ea'; c.strokeStyle = '#8a6a6a'; c.lineWidth = 3; c.beginPath(); c.arc(pw[0], pw[1], 22, 0, 7); c.fill(); c.stroke();
    if (s.has && sn) snack(c, sn.k, pw[0] + 4, pw[1] - 20, 1.1);
    if (t - s.ate < 0.5) for (let i = 0; i < 5; i++) { const k = (t - s.ate) / 0.5; c.fillStyle = `rgba(200,140,80,${1 - k})`; c.beginPath(); c.arc(MOUTH[0] + 8 + Math.cos(i * 1.3) * k * 30, MOUTH[1] + Math.sin(i * 1.3) * k * 20, 3, 0, 7); c.fill(); }
    // labels
    SK.tag(c, 'Biceps', 196, 330, 18, '#fff6ea', 'rgba(140,30,50,0.85)'); SK.tag(c, 'Elbow', 46, EL[1] + 38, 18);
    if (s.has && !g.done) { SK.target(c, g, MOUTH[0] + 8, MOUTH[1] - 4, 24); SK.arrow(c, g, pw[0], pw[1], MOUTH[0] + 8, MOUTH[1] + 10, { from: 30, to: 30 }); SK.grab(c, g, bx, by, 32); }
    if (s.has && !g.done) SK.demo(g, c, 'drag', [bx + 4, by + 30], [bx + 4, by - 60]);
  },
  // the bot: pull up and hold until the snack is eaten, let go, repeat
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 0.6) return; const B = s._b = s._b || { ph: 0 };
    if (B.ph === 0 && s.has) { synth('down', 130, 380); B.y = 380; B.ph = 1; }
    else if (B.ph === 1) { B.y = Math.max(280, B.y - dt * 400); synth('move', 130, B.y); if (!s.has) { synth('up', 130, B.y); B.ph = 0; } }
  },
});
