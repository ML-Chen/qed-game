// stats_mean.js — MEAN! Find the mean of a few numbers by balancing them on a seesaw.
// A polar morning: a wooden plank painted as a number line rests on a triangle fulcrum on an ice floe. Penguins stand on
// the plank at their values (two penguins with the same value stand one on the other's head). The player slides the
// fulcrum along under the plank; the plank tilts in real time toward the heavier side (its tilt follows the mean minus
// the fulcrum's position, on a springy wobble) and is level only when the fulcrum sits at the mean.
// Released close to the mean, the fulcrum snaps to it, the plank settles level, the penguins cheer and the computation
// (2 + 3 + 3 + 8) ÷ 4 = 16 ÷ 4 = 4 is painted on the plank. Released anywhere else, the plank stays tilted and the
// penguins windmill their flippers; the player tries again. Only the timer ends the microgame.
// Level 0: three whole numbers on 0–10, a wide snap. Level 1: four numbers. Level 2: a mean ending in .5, or one value
// far out (an outlier) on a 0–12 line that drags the mean toward it; a tight snap and no glow when close.
// Medium mode: once the plank balances, the sum is a "?" on the plank and the player picks it from the tray.
//
// The kit's moves are discrete taps and drags, so this file runs the continuous fulcrum drag itself (like
// calc_tangent.js): moves(g) returns one placeholder drag move until the balance is found (and, in medium mode, the sum
// is picked), then nothing, so MK.update finishes the microgame with the kit's stars and confetti.
const M = MK;
const PL0 = 26, PL1 = 334;          // the plank's ends (screen x, level)
const LX0 = 42, LX1 = 318;          // where 0 and R sit on the number line
const PY = 330, PT = 30;            // the plank's top surface (penguins stand here) and its thickness
const PIV = PY + PT;                // the fulcrum's tip touches the plank's underside here
const GY = 434;                     // top of the ice floe (the fulcrum's base)
const TOL = [0.6, 0.4, 0.26];       // how close (in number-line units) a release must be to snap, by level
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const fmt = v => String(Math.round(v * 100) / 100);

function pickProblem(g) {
  const R = a => a[Math.floor(g.rand() * a.length)];
  const L0 = [[1, 2, 6], [2, 3, 7], [3, 4, 8], [1, 5, 6], [2, 2, 8], [1, 3, 8], [2, 6, 7], [1, 4, 7]];
  const L1 = [[2, 3, 3, 8], [1, 4, 5, 6], [2, 5, 6, 7], [1, 3, 4, 8], [3, 3, 6, 8], [1, 2, 6, 7], [2, 2, 4, 8], [1, 5, 5, 9]];
  const L2 = [[1, 2, 4, 7], [2, 3, 4, 5], [1, 3, 3, 7], [2, 2, 3, 7], [1, 2, 2, 3, 12], [2, 3, 4, 11], [1, 1, 2, 12], [1, 2, 3, 4, 10], [1, 2, 3, 10], [3, 4, 5, 12], [2, 3, 6, 7]];
  let vals = g.level === 0 ? R(L0) : g.level === 1 ? R(L1) : R(L2);
  vals = vals.slice().sort((a, b) => a - b);
  const sum = vals.reduce((a, b) => a + b, 0), mean = sum / vals.length;
  return { vals, sum, mean, R: Math.max(...vals) > 9 ? 12 : 10 };
}

MG.add({
  id: 'mean', stage: 'stats', cmd: 'MEAN!', hint: 'drag', time: 8, mood: 'sea', winText: 'Balanced!', hold: 1.5,
  card: {
    title: 'The mean', ref: 'Grade 6', kind: 'Statistics',
    text: 'The mean of a list of numbers is one fair middle value for the whole list. Some people call it the average.\n\nTo find the mean, add up all the values, then divide by how many values there are. For example, the mean of 2, 3, 3 and 8 is (2 + 3 + 3 + 8) ÷ 4 = 16 ÷ 4 = 4.\n\nThe mean is also the balance point of the data. Put a penguin on a number line at each value, and the line balances on the mean. That is why a single value far away from the others, called an outlier, pulls the mean toward itself: it sits far out on the seesaw and pushes its end down hard.',
    note: 'Mean = (sum of the values) ÷ (how many values there are). It is the point where the values balance.',
    ask: 'What is the mean of 1, 5 and 6? What happens to the mean of 2, 3 and 4 if you change the 4 to a 10?',
  },
  init(g) {
    const S = g.s, K = M.setup(g); Object.assign(S, pickProblem(g));
    g.dur *= (2.6 + 1.05 * 2.2) / 8;
    // the fulcrum starts clearly away from the mean
    const cand = []; for (let v = 1; v <= S.R - 1; v += 0.5) if (Math.abs(v - S.mean) >= 2.5) cand.push(v);
    S.f = cand[Math.floor(g.rand() * cand.length)] ?? 1; S.f0 = S.f;
    S.th = clamp((S.mean - S.f) * 0.08, -maxTh(S, S.f), maxTh(S, S.f)); S.thv = 0;
    // the penguins: duplicates stand on each other's heads
    const seen = {}; S.pg = S.vals.map((v, i) => { const k = seen[v] = (seen[v] ?? -1) + 1; return { v, k, i, ph: i * 1.7, flapAt: -9, squawkAt: -9 }; });
    S.drag = null; S.lastMoveT = 0; S.solved = false; S.answered = false; S.missAt = -9; S.hitAt = -9;
    M.zone(g, 'fulcrum', fulBox(S));
    S.pg.forEach((p, i) => M.zone(g, 'pg' + i, penBox(S, p)));
    M.inert(g, []);
    // the computation that gets painted on the plank
    S.addNode = M.paren(M.row(...S.vals.flatMap((v, i) => [i ? M.op('+') : null, M.num(v)])));
    S.sumSlot = g.mode === 'medium' ? M.slot('sum', { col: '#fff3d8' }) : null;
    M.play(g, {
      moves(g) { return S.answered ? [] : [{ drag: 'fulcrum', to: 'mean' }]; },
      area(g) { return 'fulcrum'; },
      onWin(g) { S.winAt = g.t; g.sfx('cheer'); },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    // after a timeout the fulcrum slides to the mean by itself, in gold
    if (g.done && g.result === 'fail' && !S.solved) { const k = clamp((g.t - g.doneAt - 0.35) / 0.5, 0, 1); if (k > 0) { if (S.fFail == null) S.fFail = S.f; S.f = lerp(S.fFail, S.mean, easeIO(k)); S.shown = k; } }
    if (S.snap) { const k = clamp((g.t - S.snap.t0) / 0.14, 0, 1); S.f = lerp(S.snap.from, S.mean, ease(k)); if (k >= 1) S.snap = null; }
    const mt = maxTh(S, S.f), target = (S.solved || S.shown) ? 0 : clamp((S.mean - S.f) * 0.08, -mt, mt);
    S.thv += ((target - S.th) * 110 - S.thv * 7.5) * dt; S.th += S.thv * dt;
    if (Math.abs(S.th) > mt) { const hard = Math.abs(S.thv) > 0.35; S.th = Math.sign(S.th) * mt; S.thv *= -0.35; if (hard && g.t - S.hitAt > 0.25) { S.hitAt = g.t; g.sfx('thud'); } }
    M.zone(g, 'fulcrum', fulBox(S));
    S.pg.forEach((p, i) => M.zone(g, 'pg' + i, penBox(S, p)));
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (S.solved) return;
    // a penguin: it squawks and flaps (not a miss: the penguins are the data, the fulcrum is what moves)
    for (let i = S.pg.length - 1; i >= 0; i--) { const b = K.box['pg' + i]; if (b && Math.abs(x - b.x) <= b.w / 2 && Math.abs(y - b.y) <= b.h / 2) { const p = S.pg[i]; p.squawkAt = g.t; g.sfx('honk'); S.pokeAt = g.t; return; } }
    // the fulcrum: grab it anywhere under the plank (forgiving), and it moves with the finger
    const fx = X(S, S.f), wide = g.level === 0 ? 1e9 : 90;
    if (y > PIV - 16 && y < GY + 56 && Math.abs(x - fx) < wide) { S.drag = { x0: x, f0: S.f, moved: false }; S.snap = null; g.sfx('tap'); return; }
    if (y > PY - 10 && y < PIV + 4) { S.drag = { x0: x, f0: S.f, moved: false }; g.sfx('tap'); } // the plank itself: also slides the fulcrum
  },
  move(g, x, y) {
    const S = g.s, D = S.drag; if (!D || g.done) return;
    if (Math.abs(x - D.x0) > 3) D.moved = true;
    const f = clamp(D.f0 + (x - D.x0) / ux(S), 0, S.R);
    const tick = Math.round(f * 2); if (tick !== Math.round(S.f * 2) && g.t - (S.tickAt || -1) > 0.06) { S.tickAt = g.t; g.sfx('click'); }
    S.f = f;
  },
  up(g, x, y) {
    const S = g.s, D = S.drag; S.drag = null; if (!D || g.done || S.solved) return;
    S.lastMoveT = g.t;
    if (!D.moved) { S.nudgeAt = g.t; return; } // a tap: the fulcrum wiggles to show it slides
    const err = Math.abs(S.f - S.mean);
    if (err <= TOL[g.level]) { balance(g); return; }
    // off balance: the plank stays tilted and the penguins windmill their flippers
    S.missAt = g.t; S.pg.forEach(p => p.flapAt = g.t + p.i * 0.04); g.sfx('boing');
    if (g.level >= 1) { S.mk.wrong = (S.mk.wrong || 0) + 1; S.mk.missAt = g.t; }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.solved) return;
    if (S.bot) { const b = S.bot, k = clamp((g.t - b.t0) / b.dur, 0, 1), x = lerp(b.x0, b.x1, easeIO(k)); synth('move', x, b.y); if (k >= 1) { synth('up', x, b.y); S.bot = null; S.botNext = g.t + 0.4; } return; }
    if (g.t < (S.botNext ?? 0.5)) return;
    const x0 = X(S, S.f), y = PIV + 34; synth('down', x0, y); S.bot = { t0: g.t, dur: 0.45, x0, x1: X(S, S.mean), y };
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('stats_mean_polar', polar), 0, 0, W, H);
    ambient(c, t);
    drawFulcrum(g, c, S);
    drawPlank(g, c, S);
    drawGuide(g, c, S);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

// ---------------- geometry ----------------
const ux = S => (LX1 - LX0) / S.R;             // pixels per unit
const X = (S, v) => LX0 + v * ux(S);
function maxTh(S, f) { const fx = X(S, f), d = Math.max(fx - PL0, PL1 - fx); return Math.asin(clamp((GY - PIV - 3) / d, 0, 1)); }
// a point given in level-plank coordinates, after the plank turns about the fulcrum's tip
function rot(S, x, y) { const fx = X(S, S.f), c = Math.cos(S.th), s = Math.sin(S.th); return { x: fx + (x - fx) * c - (y - PIV) * s, y: PIV + (x - fx) * s + (y - PIV) * c }; }
function fulBox(S) { return { x: X(S, S.f), y: (PIV + GY) / 2 + 6, w: 70, h: GY - PIV + 30 }; }
const PS = 0.74, STACK = 45;
function penBox(S, p) { const q = rot(S, X(S, p.v), PY - p.k * STACK - 24); return { x: q.x, y: q.y, w: 28, h: 44 }; }

function balance(g) {
  const S = g.s; S.solved = true; S.snap = { t0: g.t, from: S.f }; S.solveAt = g.t; S.thv += (S.th > 0 ? -1 : 1) * 0.6;
  g.sfx('snap'); g.sfx('sparkle'); S.pg.forEach(p => { p.cheerAt = g.t; });
  const tip = { x: X(S, S.mean), y: PIV }; g.burst(tip.x, tip.y, ['#fff6c0', '#8ae0ff', '#ffffff'], 16, 150);
  if (g.mode === 'medium') {
    const s = S.sum, n = S.vals.length;
    const wrong = [s + 1, s - 1, s - S.vals[0], S.mean, s + S.vals[n - 1], s - 2];
    S.mk.busyT = 1e9;
    M.openAsk(g, { ask: { v: s, wrong }, after: 0.05, resolve(g) { S.sumSlot.fill = M.num(s); S.answered = true; S.ansAt = g.t; g.sfx('coin'); } });
  } else { S.answered = true; S.ansAt = g.t; }
}

// ---------------- the world ----------------
function polar(c, w, h) {
  const HZ = 404;
  const sky = c.createLinearGradient(0, 0, 0, HZ); [[0, '#5d8fd0'], [0.45, '#9cc4ec'], [0.8, '#e6e2f2'], [1, '#ffd9cc']].forEach(([k, col]) => sky.addColorStop(k, col));
  c.fillStyle = sky; c.fillRect(0, 0, w, HZ + 2);
  const sun = c.createRadialGradient(270, HZ - 18, 4, 270, HZ - 18, 200); sun.addColorStop(0, 'rgba(255,240,210,0.95)'); sun.addColorStop(0.18, 'rgba(255,214,190,0.5)'); sun.addColorStop(1, 'rgba(255,200,190,0)');
  c.fillStyle = sun; c.fillRect(0, 160, w, HZ - 158);
  c.fillStyle = '#fff4dc'; c.beginPath(); c.arc(270, HZ - 14, 20, 0, 7); c.fill();
  // far icebergs on the horizon
  const berg = (pts, top, bot) => { const gr = c.createLinearGradient(0, HZ - 70, 0, HZ); gr.addColorStop(0, top); gr.addColorStop(1, bot); c.fillStyle = gr; c.beginPath(); c.moveTo(pts[0][0], HZ); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(pts[pts.length - 1][0], HZ); c.closePath(); c.fill(); };
  berg([[-10, 372], [20, 352], [44, 360], [70, 330], [96, 346], [118, 372], [140, 380]], '#f4f8ff', '#b8cfe8');
  c.fillStyle = 'rgba(140,170,215,0.45)'; c.beginPath(); c.moveTo(70, 330); c.lineTo(96, 346); c.lineTo(118, 372); c.lineTo(140, 380); c.lineTo(140, HZ); c.lineTo(84, HZ); c.closePath(); c.fill();
  berg([[300, 390], [318, 368], [340, 362], [372, 382]], '#eef4ff', '#b0c6e2');
  berg([[190, 402], [206, 392], [228, 396], [242, 404]], '#e8f0fc', '#bcd0e8');
  // the sea
  const sea = c.createLinearGradient(0, HZ, 0, h); sea.addColorStop(0, '#7aaed8'); sea.addColorStop(0.25, '#3f7fb8'); sea.addColorStop(1, '#173f72'); c.fillStyle = sea; c.fillRect(0, HZ, w, h - HZ);
  c.fillStyle = 'rgba(255,230,210,0.5)'; for (let i = 0; i < 9; i++) { const y = HZ + 3 + i * 4, ww = 46 - i * 4; c.fillRect(270 - ww / 2, y, ww, 1.5); }
  // the ice floe, with its blue face and a reflection
  const top = x => GY - 2 + Math.sin(x * 0.05) * 1.5 + Math.sin(x * 0.13 + 1) * 1;
  c.fillStyle = 'rgba(200,230,255,0.25)'; c.beginPath(); c.ellipse(180, 500, 190, 16, 0, 0, 7); c.fill();
  const face = c.createLinearGradient(0, GY, 0, GY + 44); face.addColorStop(0, '#bfe6f6'); face.addColorStop(1, '#5fa8d0');
  c.fillStyle = face; c.beginPath(); c.moveTo(4, GY + 4); for (let x = 4; x <= 356; x += 4) c.lineTo(x, GY + 40 + Math.sin(x * 0.09) * 3); c.lineTo(356, GY + 4); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 20; x < 350; x += 37) { c.beginPath(); c.moveTo(x, GY + 8); c.lineTo(x + 6, GY + 36); c.lineTo(x + 2, GY + 36); c.closePath(); c.fill(); }
  const ice = c.createLinearGradient(0, GY - 14, 0, GY + 8); ice.addColorStop(0, '#ffffff'); ice.addColorStop(1, '#dff0fa');
  c.fillStyle = ice; c.beginPath(); c.moveTo(0, GY + 6); for (let x = 0; x <= 360; x += 4) c.lineTo(x, top(x) - 6); c.lineTo(360, GY + 8); c.quadraticCurveTo(180, GY + 14, 0, GY + 6); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(120,170,210,0.5)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, GY + 6); c.quadraticCurveTo(180, GY + 14, 360, GY + 8); c.stroke();
  // little snow drifts on the floe
  c.fillStyle = 'rgba(255,255,255,0.9)'; for (const [x, r] of [[30, 16], [338, 20], [110, 9], [250, 11]]) { c.beginPath(); c.ellipse(x, GY - 4, r, r * 0.4, 0, Math.PI, 0); c.fill(); }
  // small floes drifting in the foreground
  for (const [x, y, r] of [[60, 590, 34], [300, 612, 26], [190, 628, 18]]) {
    c.fillStyle = 'rgba(10,30,60,0.3)'; c.beginPath(); c.ellipse(x + 3, y + 5, r, r * 0.3, 0, 0, 7); c.fill();
    c.fillStyle = '#7fc0e0'; c.beginPath(); c.ellipse(x, y + 3, r, r * 0.3, 0, 0, 7); c.fill();
    c.fillStyle = '#f2faff'; c.beginPath(); c.ellipse(x, y, r, r * 0.28, 0, 0, 7); c.fill();
  }
}
const flakes = (() => { let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; return [...Array(36)].map(() => [r() * 360, r() * 640, 0.8 + r() * 1.6, r() * 6, 12 + r() * 16]); })();
function ambient(c, t) {
  // slow clouds
  for (let i = 0; i < 2; i++) P.cloud(c, ((t * (5 + i * 3) + i * 190) % 470) - 60, 200 + i * 60, 0.45 + i * 0.1, '#ffffff', '#d8e2f4', 0.85);
  // shimmer on the sea
  c.save(); c.strokeStyle = 'rgba(220,240,255,0.22)'; c.lineWidth = 1.4;
  for (let i = 0; i < 10; i++) { const y = 494 + i * 15, off = (t * (8 + i * 2) + i * 70) % 440 - 60; c.beginPath(); c.moveTo(off, y); c.lineTo(off + 30 + i * 3, y); c.stroke(); }
  c.restore();
  // a fish leaps now and then
  const k = (t % 4.2) / 0.9; if (k < 1) { const x = 110 + k * 46, y = 520 - Math.sin(k * Math.PI) * 40; c.save(); c.translate(x, y); c.rotate(-Math.cos(k * Math.PI) * 0.9); c.fillStyle = '#b8c8e0'; c.beginPath(); c.ellipse(0, 0, 9, 3.6, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(-8, 0); c.lineTo(-14, -4); c.lineTo(-14, 4); c.closePath(); c.fill(); c.restore(); }
  if (k > 1 && k < 1.5) { const q = (k - 1) / 0.5; c.strokeStyle = `rgba(255,255,255,${0.6 * (1 - q)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(156, 522, 8 + q * 18, 3 + q * 5, 0, 0, 7); c.stroke(); }
  // light snow
  for (const [x, y, r, ph, v] of flakes) { const yy = (y + t * v) % 640, xx = (x + Math.sin(t * 0.8 + ph) * 10 + 360) % 360; c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(xx, yy, r, 0, 7); c.fill(); }
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the fulcrum ----------------
function drawFulcrum(g, c, S) {
  const t = g.t, fx = X(S, S.f), gold = S.shown > 0 || S.solved;
  const nud = S.nudgeAt != null && t - S.nudgeAt < 0.3 ? Math.sin((t - S.nudgeAt) * 40) * 5 * (1 - (t - S.nudgeAt) / 0.3) : 0;
  const x = fx + nud, hw = 30, lift = S.drag ? 2 : 0;
  c.save();
  c.fillStyle = 'rgba(40,80,130,0.25)'; c.beginPath(); c.ellipse(x, GY + 1, hw + 6, 5, 0, 0, 7); c.fill();
  const gr = c.createLinearGradient(x - hw, 0, x + hw, 0);
  if (gold) { gr.addColorStop(0, '#ffe58a'); gr.addColorStop(0.5, '#f2b84a'); gr.addColorStop(1, '#c0802a'); }
  else { gr.addColorStop(0, '#d8a066'); gr.addColorStop(0.5, '#b07440'); gr.addColorStop(1, '#7a4a26'); }
  c.fillStyle = gr; c.strokeStyle = '#4a2a18'; c.lineWidth = 2.5; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(x, PIV - lift); c.lineTo(x + hw, GY - lift); c.lineTo(x - hw, GY - lift); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 3, PIV + 10); c.lineTo(x - hw + 10, GY - 6); c.stroke();
  // grip marks: it is the thing that slides
  c.strokeStyle = gold ? 'rgba(120,70,10,0.5)' : 'rgba(60,30,10,0.45)'; c.lineWidth = 2; c.lineCap = 'round';
  for (const d of [-8, 0, 8]) { c.beginPath(); c.moveTo(x + d, GY - 22); c.lineTo(x + d, GY - 12); c.stroke(); }
  // arrows hint that it slides, while it is untouched
  if (!S.solved && !S.drag && !g.done) { const a = 0.5 + 0.3 * Math.sin(t * 5); c.fillStyle = `rgba(255,255,255,${a})`; for (const sd of [-1, 1]) { const ax = x + sd * (hw + 10) + sd * Math.sin(t * 5) * 2; c.beginPath(); c.moveTo(ax + sd * 8, GY - 14); c.lineTo(ax, GY - 21); c.lineTo(ax, GY - 7); c.closePath(); c.fill(); } }
  c.restore();
}

// ---------------- the plank and the penguins ----------------
function drawPlank(g, c, S) {
  const t = g.t, fx = X(S, S.f), close = S.drag && g.level < 2 && Math.abs(S.f - S.mean) <= TOL[g.level];
  const won = g.done && g.result === 'win', solvedK = S.solved ? clamp((t - S.solveAt) / 0.3, 0, 1) : 0;
  c.save(); c.translate(fx, PIV); c.rotate(S.th); c.translate(-fx, -PIV);
  // the plank
  c.fillStyle = 'rgba(30,50,80,0.25)'; rr(c, PL0 + 3, PY + 5, PL1 - PL0, PT, 7); c.fill();
  const gr = c.createLinearGradient(0, PY, 0, PY + PT); gr.addColorStop(0, '#c88a52'); gr.addColorStop(1, '#8a5530');
  c.fillStyle = gr; rr(c, PL0, PY, PL1 - PL0, PT, 7); c.fill();
  if (close || S.solved) { c.save(); c.shadowColor = S.solved ? '#9affb0' : '#ffe27a'; c.shadowBlur = 18; c.strokeStyle = S.solved ? '#9affc0' : '#ffe27a'; c.lineWidth = 3; rr(c, PL0, PY, PL1 - PL0, PT, 7); c.stroke(); c.restore(); }
  else { c.strokeStyle = '#4a2a18'; c.lineWidth = 2; rr(c, PL0, PY, PL1 - PL0, PT, 7); c.stroke(); }
  c.strokeStyle = 'rgba(70,35,15,0.3)'; c.lineWidth = 1.2; for (const yy of [PY + 9, PY + 21]) { c.beginPath(); c.moveTo(PL0 + 8, yy); c.bezierCurveTo(120, yy + 2, 240, yy - 2, PL1 - 8, yy); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,0.22)'; c.fillRect(PL0 + 6, PY + 2, PL1 - PL0 - 12, 2.5);
  // the number line painted on it: ticks for whole numbers (and halves at level 2), fading when the sum is painted on
  const fade = 1 - 0.75 * solvedK;
  c.save(); c.globalAlpha = fade; c.strokeStyle = '#fff4dc'; c.fillStyle = '#fff4dc'; c.lineCap = 'round';
  for (let v = 0; v <= S.R; v += 0.5) { const xx = X(S, v), whole = v === Math.floor(v); if (!whole && g.level < 2) continue; c.lineWidth = whole ? 2 : 1.4; c.beginPath(); c.moveTo(xx, PY); c.lineTo(xx, PY + (whole ? 7 : 4)); c.stroke(); }
  c.font = '800 13px Fredoka, Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let v = 0; v <= S.R; v++) c.fillText(String(v), X(S, v), PY + 20);
  c.restore();
  // the computation, painted on the plank once it balances
  if (S.solved || S.shown > 0.99) {
    const n = S.vals.length, done = S.answered || !S.sumSlot || S.shown;
    if (S.shown && S.sumSlot && !S.sumSlot.fill) S.sumSlot.fill = M.num(S.sum);
    const node = M.row(S.addNode, M.op('÷'), M.num(n), M.op('='), S.sumSlot || M.num(S.sum), ...(done ? [M.op('÷'), M.num(n), M.op('='), M.num(S.mean, null, { col: '#fff27a' })] : []));
    let s = 21; const w = M.lay(node, s).w; if (w > PL1 - PL0 - 16) s *= (PL1 - PL0 - 16) / w;
    const k = ease((t - (S.solveAt ?? g.doneAt)) / 0.25), m = M.lay(node, s);
    c.save(); c.globalAlpha = Math.min(1, k * 1.2); c.translate(180, PY + PT / 2); c.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k);
    c.fillStyle = 'rgba(60,25,10,0.55)'; rr(c, -m.w / 2 - 8, -PT / 2 + 2, m.w + 16, PT - 4, 6); c.fill();
    M.draw(c, node, -m.w / 2, (m.a - m.d) / 2, s, { t, col: '#fff6e4' }); c.restore();
  }
  // the penguins, standing on their values (stacked for repeated values), drawn bottom-up
  const tilted = Math.abs(S.th) > 0.05 && !S.solved;
  const order = S.pg.slice().sort((a, b) => a.k - b.k);
  for (const p of order) {
    const x = X(S, p.v), y = PY - p.k * STACK;
    const flap = t - p.flapAt < 0.8 && t >= p.flapAt, sq = t - p.squawkAt < 0.5, cheer = won || (S.solved && t - S.solveAt < 0.9);
    const low = (S.th > 0 && x > fx) || (S.th < 0 && x < fx);
    const pose = cheer ? 'cheer' : flap || sq ? 'balance' : tilted ? 'balance' : 'idle';
    const expr = cheer ? 'laugh' : sq ? 'wow' : flap ? 'wow' : tilted && low ? 'wow' : tilted ? 'think' : 'happy';
    const jig = sq ? Math.sin((t - p.squawkAt) * 40) * 2 : 0;
    try { ANI.draw(c, 'penguin', x + jig, y, PS, { t, phase: p.ph, pose, expr, facing: x > 180 ? -1 : 1, noShadow: p.k > 0 }); }
    catch (e) { P.sheep(c, x, y, 0.5, { t }); }
  }
  // a tag above each column of penguins with its value
  const tops = {}; for (const p of S.pg) tops[p.v] = Math.max(tops[p.v] ?? -1, p.k);
  let prevX = -99, prevUp = 0;
  for (const v of Object.keys(tops).map(Number).sort((p, q) => p - q)) {
    const up = X(S, v) - prevX < 28 && !prevUp ? 1 : 0; prevX = X(S, v); prevUp = up;
    const x = X(S, v), y = PY - tops[v] * STACK - 62 - up * 22, txt = fmt(v);
    c.font = '700 15px Fredoka, Nunito, system-ui, sans-serif'; const w = Math.max(22, c.measureText(txt).width + 12);
    c.fillStyle = 'rgba(255,255,255,0.92)'; rr(c, x - w / 2, y - 10, w, 20, 10); c.fill(); c.strokeStyle = 'rgba(40,70,120,0.5)'; c.lineWidth = 1.5; c.stroke();
    c.beginPath(); c.moveTo(x - 4, y + 10); c.lineTo(x, y + 15); c.lineTo(x + 4, y + 10); c.closePath(); c.fillStyle = 'rgba(255,255,255,0.92)'; c.fill();
    c.fillStyle = '#23305a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, y + 1);
  }
  c.restore();
  // the balance point mark under the plank's tip, with its value
  if (S.solved || S.shown > 0.99) {
    const k = ease((t - (S.solveAt ?? g.doneAt)) / 0.3), x = X(S, S.mean);
    c.save(); c.globalAlpha = k; c.font = '800 15px Fredoka, Nunito, system-ui, sans-serif'; const txt = 'mean = ' + fmt(S.mean), w = c.measureText(txt).width + 16;
    const bx = clamp(x, w / 2 + 6, 354 - w / 2), by = GY + 22;
    c.fillStyle = S.shown ? 'rgba(110,70,10,0.88)' : 'rgba(20,80,60,0.88)'; rr(c, bx - w / 2, by - 11, w, 22, 11); c.fill();
    c.fillStyle = S.shown ? '#ffe9a0' : '#d8ffe4'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, bx, by + 1); c.restore();
  }
}

// ---------------- guidance ----------------
// the fulcrum always glows until the plank balances; a ghost hand slides it to the balance point at level 0, or after
// a 2-second pause at the higher levels
function drawGuide(g, c, S) {
  const t = g.t, K = S.mk; if (g.done || S.solved || S.drag || (K.ask && !K.ask.closing)) return;
  const fx = X(S, S.f), b = { x: fx, y: (PIV + GY) / 2 + 8, w: 50, h: 50 };
  M.glowBox(c, b, t, 0.85, true);
  if ((g.level !== 0 && t - S.lastMoveT < 2) || t < 0.45) return;
  const per = 1.7, k = ((t - 0.45) % per) / per, e = easeIO(clamp((k - 0.14) / 0.55, 0, 1)), tx = X(S, S.mean), x = lerp(fx, tx, e), fade = k > 0.86 ? (1 - k) / 0.14 : 1;
  c.save(); c.globalAlpha = 0.45 * fade; c.fillStyle = '#ffe27a'; c.strokeStyle = '#fff6c0'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x, PIV + 4); c.lineTo(x + 26, GY - 2); c.lineTo(x - 26, GY - 2); c.closePath(); c.fill(); c.stroke();
  c.setLineDash([5, 7]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(fx, GY + 14); c.lineTo(tx, GY + 14); c.stroke(); c.restore();
  c.save(); c.globalAlpha = fade; M.hand(c, x + 2, GY - 18, 1, k < 0.14 || k > 0.7 ? 1 : 0); c.restore();
}
