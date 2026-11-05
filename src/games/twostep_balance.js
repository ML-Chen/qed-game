// twostep_balance.js — SOLVE! Solve a two-step equation (3x + 2 = 14) by finding the x that balances a seesaw.
// A circus ring under the big top. A long seesaw rests on a star-spangled drum, and the equation is painted on its beam:
// "3x + 2" under the left half, "=" over the pivot, "14" under the right half. The left half carries 3 mystery crates
// (each one is x) with 2 iron weights on top, the right half 14 weights. Penguin acrobats ride both ends.
// The player drags the knob of a brass slider that sets x. Every crate shows the current value, both side totals are
// written above the seesaw (3·3 + 2 = 11  <  14), and the beam tilts toward the heavier side in real time on a spring,
// so it swings, overshoots a little and settles. Let go when the beam is level: it snaps, and x = 4 glows. Let go
// anywhere else and the seesaw just stays tilted (the penguin on the high end flaps); the player tries again.
// Level 0: ax + b = c with small whole numbers and x from 0 to 8; a ghost hand slides the knob to the answer.
// Level 1: bigger numbers, x from 0 to 10; only the knob glows (the ghost hand shows the right direction after a pause).
// Level 2: negative answers or negative constants (2x + 9 = 3, 3x − 4 = 8). Negative amounts are balloons: a balloon
// pulls up instead of pushing down, so −1 is one balloon, and a crate worth −3 hangs from a balloon.
// Medium mode: once it balances, the left total reads "3·4 + 2 = ?" and the player picks it from the tray.
// Wrong part: tapping the crates (they cannot be moved, only x can be changed) makes them jiggle.
//
// The slider is a continuous gesture, so this file handles down/move/up itself (like calc_tangent.js). It still runs
// on MK.play: moves(g) returns one placeholder drag until the seesaw balances, then an empty list, so MK.update awards
// the stars and wins through the kit's finish(). The medium-mode tray is the kit's (MK.openAsk, MK.drawAsk).
const M = MK;
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const PX = 180, PY = 372;              // the seesaw's pivot
const HALF = 170, BT = 34;             // half the beam's length, and its thickness
const SIDE = 80;                       // where each side's pile and writing are centred along the beam
const TR_Y = 522, TR_X0 = 50, TR_X1 = 316; // the slider track
const CS = 34, BALL = 15;              // crate size, weight-ball diameter
const INKL = '#fff4dc';

// ---------------- the problem ----------------
function pick(g) {
  const R = a => a[Math.floor(g.rand() * a.length)];
  for (let k = 0; k < 200; k++) {
    let a, x, b, lo, hi;
    if (g.level === 0) { a = R([2, 3]); x = R([2, 3, 4, 5]); b = R([1, 2, 3, 4]); lo = 0; hi = 8; }
    else if (g.level === 1) { a = R([2, 3]); x = R([3, 4, 5, 6, 7]); b = R([1, 2, 3, 5, 6]); lo = 0; hi = 10; }
    else if (g.rand() < 0.5) { a = 2; x = R([-1, -2, -3, -4]); b = R([3, 5, 7, 9]); lo = -6; hi = 6; }      // a negative answer
    else { a = R([2, 3]); x = R([2, 3, 4, 5]); b = -R([1, 3, 4, 5]); lo = -2; hi = 8; }                     // a negative constant
    const c = a * x + b;
    if (c === 0 || c > 22 || c < -6 || (g.level === 0 && c > 17)) continue;
    if (b > 0 && b > Math.floor((a * CS + (a - 1) * 3) / BALL) * 2) continue; // the weights must fit on the crates
    return { a, x, b, c, lo, hi };
  }
  return { a: 3, x: 4, b: 2, c: 14, lo: 0, hi: 8 };
}
const total = (S, v) => S.a * v + S.b;
const knobX = (S, v) => TR_X0 + (v - S.lo) / (S.hi - S.lo) * (TR_X1 - TR_X0);
const valAt = (S, x) => clamp(Math.round(S.lo + (x - TR_X0) / (TR_X1 - TR_X0) * (S.hi - S.lo)), S.lo, S.hi);
const tiltFor = d => -0.3 * Math.tanh(d / 6); // the angle the beam settles at for a difference d = left − right
// the equation's two sides as nodes
function leftNode(S) { return M.row(S.a === 1 ? null : M.num(S.a), M.vr('x'), M.op(S.b < 0 ? '-' : '+'), M.num(Math.abs(S.b))); }
// "3·4 + 2 = 14" (the left total), or "= ?" while it is being asked
function totalNode(S, v, ask) {
  const xv = v < 0 ? M.paren(M.num(v)) : M.num(v);
  return M.row(M.num(S.a), M.op('·'), xv, M.op(S.b < 0 ? '-' : '+'), M.num(Math.abs(S.b)), M.op('='), ask ? M.txt('?') : M.num(total(S, v)));
}

// ---------------- the items on the beam (beam coordinates: x along the beam from the pivot, y up is negative) ----------------
function pyramid(n, base, cx, y0) {
  const out = []; let row = 0, left = n, w = Math.min(base, n);
  while (left > 0) { const k = Math.min(w, left); for (let i = 0; i < k; i++) out.push([cx + (i - (k - 1) / 2) * BALL, y0 - BALL / 2 - row * (BALL - 2)]); left -= k; row++; w = Math.max(1, w - 1); }
  return out;
}
function layout(S) {
  const top = -BT / 2, a = S.a, wr = a * CS + (a - 1) * 3, cx = -SIDE;
  S.crates = [...Array(a)].map((_, i) => ({ x: cx - wr / 2 + CS / 2 + i * (CS + 3), y: top - CS / 2 }));
  S.ballsL = S.b > 0 ? pyramid(S.b, Math.floor(wr / BALL), cx, top - CS) : [];
  S.balloonsL = S.b < 0 ? [...Array(-S.b)].map((_, i) => ({ x: cx + (i - (-S.b - 1) / 2) * 17, y: top - CS - 40 - (i % 2) * 14, ax: cx + (i - (-S.b - 1) / 2) * 6, ay: top - CS, col: i })) : [];
  S.ballsR = S.c > 0 ? pyramid(S.c, 8, SIDE, top) : [];
  S.balloonsR = S.c < 0 ? [...Array(-S.c)].map((_, i) => ({ x: SIDE + (i - (-S.c - 1) / 2) * 17, y: top - 46 - (i % 2) * 14, ax: SIDE + (i - (-S.c - 1) / 2) * 8, ay: top, col: i + 2 })) : [];
}
// beam point -> screen point
function toScreen(S, x, y) { const c = Math.cos(S.th), s = Math.sin(S.th); return { x: PX + x * c - y * s, y: PY + x * s + y * c }; }

// ---------------- moves ----------------
function setVal(g, v) {
  const S = g.s; if (v === S.v) return;
  S.v = v; S.vAt = g.t; if (g.t - (S.tickAt || -1) > 0.04) { S.tickAt = g.t; g.sfx('click'); }
  if (v === S.x) g.sfx('ding');
}
function release(g) {
  const S = g.s, D = S.drag; S.drag = null; if (!D) return;
  S.glideFrom = S.kx; S.glideAt = g.t; S.lastMoveT = g.t;
  if (S.v === S.x) { snap(g); return; }
  // off balance: the seesaw just stays tilted; the penguin on the high end flaps, and the beam gets a little jolt
  S.offAt = g.t; S.om += (S.th > 0 ? 1 : -1) * 0.8; g.sfx('boing');
}
function snap(g) {
  const S = g.s; S.done = true; S.snapAt = g.t; S.om += 0.6 * (S.th >= 0 ? -1 : 1);
  g.sfx('snap'); g.sfx('cheer');
  const p = { x: PX, y: PY - 40 }; g.burst(p.x, p.y, ['#ffd45a', '#ff6a5a', '#7ad0ff', '#fff'], 18, 190);
  const kb = { x: knobX(S, S.x), y: TR_Y }; g.burst(kb.x, kb.y, ['#ffe27a', '#fff'], 10, 110);
  if (g.mode === 'medium') {
    const L = total(S, S.x), wrong = [S.a * S.x, S.a + S.x + S.b, S.a * (S.x + S.b), S.a * S.x - S.b, L + S.a].filter(w => w !== L);
    S.asking = true; M.openAsk(g, { ask: { v: L, wrong }, after: 0, resolve(g) { S.asking = false; S.answered = true; S.ansAt = g.t; g.sfx('coin'); } });
    S.mk.busyT = 1e9;
  } else S.answered = true;
}

MG.add({
  id: 'balance', stage: 'twostep', cmd: 'SOLVE!', hint: 'drag', time: 8, mood: 'party', winText: 'Balanced!', hold: 1.4,
  card: {
    title: 'Solving by balancing', ref: 'Grade 7', kind: 'Algebra',
    text: 'An equation says that two amounts are equal, like the two sides of a balanced seesaw. In 3x + 2 = 14, the letter x stands for a number we do not know yet. The solution is the value of x that makes both sides weigh the same.\n\nTry values and watch the totals. If x = 3, the left side is 3 · 3 + 2 = 11, which is lighter than 14. If x = 5, it is 3 · 5 + 2 = 17, which is heavier. If x = 4, it is 3 · 4 + 2 = 14, so the seesaw is level and x = 4 is the solution.\n\nYou can always check a solution by substituting it: put the number in place of x and work out both sides. If they are equal, the solution is right.',
    note: 'The solution of an equation is the value of x that makes both sides equal. Check it by substituting it for x.',
    ask: 'Which value of x balances 2x + 5 = 11? Check your answer by substituting it.',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); layout(S);
    S.v = 0; // x starts at 0 (never the answer)
    S.kx = knobX(S, S.v); S.th = tiltFor(total(S, S.v) - S.c); S.om = 0;
    S.drag = null; S.poke = null; S.lastMoveT = 0;
    S.leftN = leftNode(S); S.rightN = M.row(M.num(S.c)); S.eqN = M.row(M.op('='));
    M.zone(g, 'knob', { x: S.kx, y: TR_Y, w: 52, h: 52 });
    M.zone(g, 'crates', { x: PX - SIDE, y: PY - 40, w: 110, h: 56 });
    M.play(g, {
      moves(g) { return S.answered ? [] : [{ drag: 'knob', to: 'level' }]; },
      area(g) { return 'knob'; },
      onWin(g) { S.winAt = g.t; g.sfx('magic'); },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    // after a timeout the knob slides to the answer by itself and the seesaw levels out
    if (g.done && g.result === 'fail' && !S.shown && g.t - g.doneAt > 0.35) { S.shown = true; S.drag = null; S.glideFrom = S.kx; S.glideAt = g.t; S.v = S.x; }
    if (!S.drag && S.glideAt != null) { const k = (g.t - S.glideAt) / 0.14; S.kx = lerp(S.glideFrom, knobX(S, S.v), ease(k)); if (k >= 1) S.glideAt = null; }
    // the beam: a damped spring toward the tilt the two totals call for
    const tgt = tiltFor(total(S, S.v) - S.c), n = 3, h = dt / n;
    for (let i = 0; i < n; i++) { const acc = -62 * (S.th - tgt) - 6.5 * S.om; S.om += acc * h; S.th += S.om * h; }
    M.zone(g, 'knob', { x: S.kx, y: TR_Y, w: 52, h: 52 });
    const pc = toScreen(S, -SIDE, -BT / 2 - 26); M.zone(g, 'crates', { x: pc.x, y: pc.y, w: 110, h: 60 });
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (S.done) return;
    // the slider is forgiving: a press anywhere along the track grabs the knob, and the knob jumps under the finger
    if (y > TR_Y - 44 && y < TR_Y + 44 && x > TR_X0 - 34 && x < TR_X1 + 34) {
      S.drag = { x0: x, y0: y, off: Math.abs(x - S.kx) < 26 ? S.kx - x : 0 }; S.glideAt = null; g.sfx('tap');
      S.kx = clamp(x + S.drag.off, TR_X0, TR_X1); setVal(g, valAt(S, S.kx)); return;
    }
    const b = K.box.crates; if (b && Math.abs(x - b.x) < b.w / 2 + 6 && Math.abs(y - b.y) < b.h / 2 + 10) S.poke = { x, y };
  },
  move(g, x, y) {
    const S = g.s, D = S.drag; if (!D || g.done) return;
    S.kx = clamp(x + D.off, TR_X0, TR_X1); setVal(g, valAt(S, S.kx));
  },
  up(g, x, y) {
    const S = g.s; if (g.done) return;
    if (S.drag) { release(g); return; }
    if (S.poke) { S.poke = null; S.crateWobAt = g.t; S.mk.wrong = (S.mk.wrong || 0) + 1; S.mk.missAt = g.t; S.offAt = g.t; g.sfx('boing'); }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.done) return;
    if (S.bot) {
      // slide past the answer, then back onto it, so the seesaw swings both ways
      const b = S.bot, k = clamp((g.t - b.t0) / b.dur, 0, 1), xa = knobX(S, S.x);
      const X = k < 0.62 ? lerp(b.from, b.over, easeIO(k / 0.62)) : lerp(b.over, xa, easeIO((k - 0.62) / 0.38));
      synth('move', X, TR_Y); if (k >= 1) { synth('up', X, TR_Y); S.bot = null; S.botNext = g.t + 0.4; } return;
    }
    if (g.t < (S.botNext ?? 0.45)) return;
    const over = knobX(S, clamp(S.x + (S.v < S.x ? 2 : -2), S.lo, S.hi));
    synth('down', S.kx, TR_Y); S.bot = { t0: g.t, dur: g.level === 2 ? 0.8 : 1.5, from: S.kx, over };
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('twostep_circus', bigTop), 0, 0, W, H);
    spotlights(c, t, S);
    drawPedestal(c, t);
    drawSeesaw(g, c, S);
    drawTotals(g, c, S);
    drawSlider(g, c, S);
    drawGuide(g, c, S);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

// ---------------- the big top ----------------
function bigTop(c, w, h) {
  // tent canvas: red and cream panels fanning out from the peak
  const apex = [180, -260];
  c.fillStyle = '#5a1a2a'; c.fillRect(0, 0, w, h);
  for (let i = -14; i <= 14; i++) {
    const a0 = Math.PI / 2 + i * 0.075, a1 = a0 + 0.075, r = 1200;
    c.fillStyle = i % 2 ? '#b3263a' : '#f1dcb8';
    c.beginPath(); c.moveTo(apex[0], apex[1]); c.lineTo(apex[0] + Math.cos(a0) * r, apex[1] + Math.sin(a0) * r); c.lineTo(apex[0] + Math.cos(a1) * r, apex[1] + Math.sin(a1) * r); c.closePath(); c.fill();
  }
  // the canvas hangs in soft folds: darker toward the top and the edges
  let gr = c.createLinearGradient(0, 0, 0, 470); gr.addColorStop(0, 'rgba(40,8,30,0.82)'); gr.addColorStop(0.45, 'rgba(60,14,40,0.3)'); gr.addColorStop(1, 'rgba(40,10,30,0.55)'); c.fillStyle = gr; c.fillRect(0, 0, w, 470);
  gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(30,6,24,0.55)'); gr.addColorStop(0.25, 'rgba(30,6,24,0)'); gr.addColorStop(0.75, 'rgba(30,6,24,0)'); gr.addColorStop(1, 'rgba(30,6,24,0.55)'); c.fillStyle = gr; c.fillRect(0, 0, w, 470);
  // strings of bulbs swooping across the top
  for (const [y0, sag, n] of [[34, 34, 13], [10, 26, 11]]) {
    c.strokeStyle = 'rgba(40,10,20,0.7)'; c.lineWidth = 1.5; c.beginPath(); for (let x = -10; x <= w + 10; x += 6) { const k = (x + 10) / (w + 20); c.lineTo(x, y0 + Math.sin(k * Math.PI) * sag); } c.stroke();
    for (let i = 0; i < n; i++) { const k = (i + 0.5) / n, x = -10 + k * (w + 20), y = y0 + Math.sin(k * Math.PI) * sag + 3;
      const gl = c.createRadialGradient(x, y, 0, x, y, 12); gl.addColorStop(0, 'rgba(255,230,150,0.75)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = gl; c.fillRect(x - 12, y - 12, 24, 24);
      c.fillStyle = '#fff2c0'; c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); }
  }
  // pennants along a lower garland
  for (let i = 0; i < 16; i++) { const k = i / 15, x = k * w, y = 150 + Math.sin(k * Math.PI) * 22, cols = ['#ffcf3a', '#2aa8b8', '#f4f0e0', '#e04a5a'];
    c.fillStyle = 'rgba(30,8,20,0.3)'; c.beginPath(); c.moveTo(x - 8, y + 1); c.lineTo(x + 8, y + 1); c.lineTo(x, y + 19); c.closePath(); c.fill();
    c.fillStyle = cols[i % 4]; c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x + 8, y); c.lineTo(x, y + 17); c.closePath(); c.fill(); }
  c.strokeStyle = 'rgba(60,20,30,0.6)'; c.lineWidth = 1.2; c.beginPath(); for (let x = 0; x <= w; x += 6) c.lineTo(x, 150 + Math.sin(x / w * Math.PI) * 22); c.stroke();
  // the stands: rows of audience in shadow behind the ring
  c.fillStyle = '#2a0e22'; c.fillRect(0, 430, w, 80);
  const R = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  for (let row = 0; row < 3; row++) for (let x = -6 + row * 7; x < w + 10; x += 15) {
    const y = 448 + row * 18 + R() * 3, col = ['#3e1832', '#4a1c3a', '#36142c'][Math.floor(R() * 3)];
    c.fillStyle = col; c.beginPath(); c.arc(x, y, 6.5, 0, 7); c.fill(); c.beginPath(); c.ellipse(x, y + 12, 9, 7, 0, Math.PI, 0); c.fill();
  }
  gr = c.createLinearGradient(0, 430, 0, 510); gr.addColorStop(0, 'rgba(20,4,16,0.6)'); gr.addColorStop(1, 'rgba(20,4,16,0.1)'); c.fillStyle = gr; c.fillRect(0, 430, w, 80);
  // the ring: sawdust inside a red curb studded with gold stars
  c.fillStyle = '#7a1a26'; c.fillRect(0, 498, w, h - 498);
  gr = c.createRadialGradient(180, 560, 20, 180, 560, 260); gr.addColorStop(0, '#f2c27a'); gr.addColorStop(0.6, '#d89a52'); gr.addColorStop(1, '#a8682e'); c.fillStyle = gr;
  c.beginPath(); c.ellipse(180, 572, 250, 82, 0, 0, 7); c.fill();
  for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(${R() < 0.5 ? '255,236,190' : '150,90,40'},${0.25 + R() * 0.3})`; const a = R() * 7, rr = Math.sqrt(R()); c.fillRect(180 + Math.cos(a) * 240 * rr, 572 + Math.sin(a) * 78 * rr, 2, 1.2); }
  c.lineWidth = 16; c.strokeStyle = '#c42a3c'; c.beginPath(); c.ellipse(180, 572, 252, 84, 0, Math.PI * 0.02, Math.PI * 0.98); c.stroke();
  c.lineWidth = 3; c.strokeStyle = '#ffd86a'; c.beginPath(); c.ellipse(180, 572, 244, 77, 0, Math.PI * 0.02, Math.PI * 0.98); c.stroke();
  for (let i = 1; i < 12; i++) { const a = Math.PI * i / 12, x = 180 + Math.cos(a) * 252, y = 572 + Math.sin(a) * 84; c.fillStyle = '#ffd86a'; star(c, x, y, 5); }
  // a soft vignette
  gr = c.createRadialGradient(180, 360, 120, 180, 360, 420); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(30,6,24,0.5)'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
}
function star(c, x, y, r) { c.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? r * 0.45 : r, a = j * Math.PI / 5 - Math.PI / 2; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
// two spotlights sweeping gently over the seesaw, and dust glittering in their beams
function spotlights(c, t, S) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (const [sx, ph] of [[-20, 0], [380, 2.1]]) {
    const tx = 180 + Math.sin(t * 0.55 + ph) * 60, ty = 400, ang = Math.atan2(ty + 20, tx - sx), len = Math.hypot(tx - sx, ty + 20) + 60;
    c.save(); c.translate(sx, -20); c.rotate(ang);
    const gr = c.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, 'rgba(255,240,200,0.0)'); gr.addColorStop(0.35, 'rgba(255,236,190,0.10)'); gr.addColorStop(1, 'rgba(255,230,180,0.16)');
    c.fillStyle = gr; c.beginPath(); c.moveTo(0, -6); c.lineTo(len, -72); c.lineTo(len, 72); c.lineTo(0, 6); c.closePath(); c.fill(); c.restore();
    const pool = c.createRadialGradient(tx, ty + 150, 4, tx, ty + 150, 120); pool.addColorStop(0, 'rgba(255,240,200,0.22)'); pool.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = pool; c.beginPath(); c.ellipse(tx, ty + 160, 130, 40, 0, 0, 7); c.fill();
  }
  for (let i = 0; i < 22; i++) { const x = (i * 53 + Math.sin(t * 0.4 + i) * 30 + 400) % 360, y = 180 + ((i * 97 + t * (8 + i % 5)) % 300), a = 0.25 + 0.35 * Math.abs(Math.sin(t * 1.7 + i)); c.fillStyle = `rgba(255,236,190,${a})`; c.beginPath(); c.arc(x, y, 1.2, 0, 7); c.fill(); }
  c.restore();
}
// the drum the seesaw rests on, with a brass fulcrum
function drawPedestal(c, t) {
  const top = PY + 40, bot = PY + 104, w = 96;
  c.fillStyle = 'rgba(40,8,20,0.35)'; c.beginPath(); c.ellipse(PX, bot + 4, w / 2 + 12, 12, 0, 0, 7); c.fill();
  // the drum's body
  const gr = c.createLinearGradient(PX - w / 2, 0, PX + w / 2, 0); gr.addColorStop(0, '#1d3f8a'); gr.addColorStop(0.45, '#3d6ad0'); gr.addColorStop(1, '#16306a');
  c.fillStyle = gr; c.beginPath(); c.moveTo(PX - w / 2, top); c.lineTo(PX - w / 2, bot); c.ellipse(PX, bot, w / 2, 10, 0, Math.PI, 0, true); c.lineTo(PX + w / 2, top); c.closePath(); c.fill();
  c.fillStyle = '#fff2c8'; for (const [dx, dy, r] of [[-28, 22, 6], [0, 36, 8], [28, 22, 6], [-14, 52, 4], [16, 54, 4]]) star(c, PX + dx, top + dy, r);
  // gold hoops
  c.strokeStyle = '#ffd25a'; c.lineWidth = 5; c.beginPath(); c.ellipse(PX, bot, w / 2, 10, 0, 0, Math.PI); c.stroke();
  c.strokeStyle = '#e8b23a'; c.beginPath(); c.ellipse(PX, top + 4, w / 2, 10, 0, 0, Math.PI); c.stroke();
  // the drum top
  c.fillStyle = '#f6ead0'; c.beginPath(); c.ellipse(PX, top, w / 2, 10, 0, 0, 7); c.fill(); c.strokeStyle = '#ffd25a'; c.lineWidth = 4; c.stroke();
  // the fulcrum: a brass wedge up to the pivot pin
  const fg = c.createLinearGradient(PX - 24, 0, PX + 24, 0); fg.addColorStop(0, '#a8742a'); fg.addColorStop(0.5, '#ffe08a'); fg.addColorStop(1, '#a06a22');
  c.fillStyle = fg; c.beginPath(); c.moveTo(PX - 26, top + 2); c.lineTo(PX, PY + 6); c.lineTo(PX + 26, top + 2); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(90,50,10,0.6)'; c.lineWidth = 1.5; c.stroke();
}

// ---------------- the seesaw ----------------
function drawSeesaw(g, c, S) {
  const t = g.t, v = S.v, won = S.done;
  c.save(); c.translate(PX, PY); c.rotate(S.th);
  // balloon strings go behind everything
  const balloons = [...S.balloonsL, ...S.balloonsR];
  const crateNeg = v < 0, cb = S.crates.map((q, i) => ({ x: q.x - 8 + (i % 2) * 16, y: q.y - CS / 2 - 50 - (i % 2) * 10, ax: q.x, ay: q.y - CS / 2 + 2, col: i + 4 }));
  const allB = [...balloons, ...(crateNeg ? cb : [])];
  for (const b of allB) { const sw = Math.sin(t * 1.8 + b.col) * 3; c.strokeStyle = 'rgba(255,250,235,0.75)'; c.lineWidth = 1; c.beginPath(); c.moveTo(b.ax, b.ay); c.quadraticCurveTo((b.ax + b.x) / 2 + sw, (b.ay + b.y) / 2, b.x + sw, b.y + 10); c.stroke(); }
  // the beam: a painted plank with gold studs
  c.fillStyle = 'rgba(40,8,20,0.3)'; rr(c, -HALF + 2, -BT / 2 + 5, HALF * 2, BT, 9); c.fill();
  const bg = c.createLinearGradient(0, -BT / 2, 0, BT / 2); bg.addColorStop(0, '#ffd890'); bg.addColorStop(0.5, '#e8a85a'); bg.addColorStop(1, '#b0682c');
  c.fillStyle = bg; rr(c, -HALF, -BT / 2, HALF * 2, BT, 9); c.fill();
  c.fillStyle = '#c42a3c'; c.fillRect(-HALF + 6, -BT / 2 + 3, HALF * 2 - 12, 3); c.fillRect(-HALF + 6, BT / 2 - 6, HALF * 2 - 12, 3);
  c.fillStyle = '#ffe9a8'; for (const x of [-HALF + 9, HALF - 9]) { c.beginPath(); c.arc(x, 0, 3.4, 0, 7); c.fill(); }
  // the equation, painted along the beam
  const balanced = Math.abs(total(S, v) - S.c) === 0, ink = '#5a1424';
  for (const [n, cx] of [[S.leftN, -SIDE], [S.eqN, 0], [S.rightN, SIDE]]) { const m = M.lay(n, 26); M.draw(c, n, cx - m.w / 2, 9, 26, { t, col: n === S.eqN && balanced ? '#1f7a44' : ink }); }
  // the pivot pin
  c.fillStyle = '#ffe08a'; c.strokeStyle = '#7a4a14'; c.lineWidth = 2; c.beginPath(); c.arc(0, BT / 2 + 1, 5, 0, 7); c.fill(); c.stroke();
  // weights on the right, crates and their weights on the left
  for (const [x, y] of S.ballsR) ball(c, x, y);
  const wob = S.crateWobAt != null && t - S.crateWobAt < 0.45 ? (1 - (t - S.crateWobAt) / 0.45) : 0;
  const lift = crateNeg ? -4 - Math.sin(t * 2.2) * 1.5 : 0;
  S.crates.forEach((q, i) => crate(c, q.x + Math.sin(t * 40 + i) * 3 * wob, q.y + lift, v, S.vAt != null && t - S.vAt < 0.2 ? 1 - (t - S.vAt) / 0.2 : 0, won ? (t - S.snapAt) : -1, wob > 0));
  for (const [x, y] of S.ballsL) ball(c, x + Math.sin(t * 40) * 3 * wob, y + lift);
  for (const b of allB) balloon(c, b.x + Math.sin(t * 1.8 + b.col) * 3, b.y + Math.sin(t * 2.3 + b.col) * 2, b.col);
  // penguins ride the ends: arms out while it tips, flapping on the high end after an off-balance try
  const tip = S.th, off = S.offAt != null && t - S.offAt < 0.7;
  for (const sd of [-1, 1]) {
    const high = sd * tip < -0.04, low = sd * tip > 0.04, x = sd * (HALF - 15);
    const pose = won ? 'cheer' : off && high ? 'hop' : Math.abs(tip) > 0.05 ? 'balance' : 'idle';
    const expr = won ? 'laugh' : g.done ? 'sad' : off && high ? 'wow' : high ? 'wow' : low ? 'think' : 'happy';
    const hop = off && high ? Math.sin((t - S.offAt) / 0.7 * Math.PI) * 10 : 0;
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', x, -BT / 2 - hop, 0.7, { t: t + (sd > 0 ? 1.3 : 0), pose, expr, facing: -sd, noShadow: true }); else P.sheep(c, x, -BT / 2, 0.5, { t }); } catch (e) { }
  }
  c.restore();
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function ball(c, x, y) {
  const r = BALL / 2 - 0.3, gr = c.createRadialGradient(x - r * 0.4, y - r * 0.4, 0.5, x, y, r);
  gr.addColorStop(0, '#8a8aa0'); gr.addColorStop(0.5, '#3a3a50'); gr.addColorStop(1, '#16141f'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); c.arc(x - r * 0.35, y - r * 0.4, r * 0.25, 0, 7); c.fill();
}
const BCOL = ['#ff5a6a', '#4ab0ff', '#ffd23a', '#7ae07a', '#c87aff', '#ff9a3a'];
function balloon(c, x, y, i) {
  const col = BCOL[i % BCOL.length];
  const gr = c.createRadialGradient(x - 3, y - 4, 1, x, y, 11); gr.addColorStop(0, P.shade(col, 0.45)); gr.addColorStop(1, col);
  c.fillStyle = gr; c.beginPath(); c.ellipse(x, y, 8.5, 10, 0, 0, 7); c.fill();
  c.fillStyle = P.shade(col, -0.2); c.beginPath(); c.moveTo(x - 2, y + 11); c.lineTo(x + 2, y + 11); c.lineTo(x, y + 8); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(x - 3, y - 4, 2, 3, -0.4, 0, 7); c.fill();
}
// a mystery crate: it shows the value x has right now; it pops when the value changes and glows once balanced
function crate(c, x, y, v, pop, wonK, bad) {
  const s = 1 + Math.sin(pop * Math.PI) * 0.12;
  c.save(); c.translate(x, y); c.scale(s, s);
  if (wonK >= 0) { c.shadowColor = '#ffe27a'; c.shadowBlur = 16 + 6 * Math.sin(wonK * 8); }
  const gr = c.createLinearGradient(0, -CS / 2, 0, CS / 2); gr.addColorStop(0, bad ? '#ff9a8a' : '#d89656'); gr.addColorStop(1, bad ? '#c8505a' : '#9a5a26');
  c.fillStyle = gr; rr(c, -CS / 2, -CS / 2, CS, CS, 4); c.fill(); c.shadowBlur = 0;
  c.strokeStyle = 'rgba(70,30,10,0.55)'; c.lineWidth = 1.5; c.stroke();
  c.strokeStyle = 'rgba(255,220,170,0.35)'; c.beginPath(); c.moveTo(-CS / 2 + 3, -CS / 2 + 3); c.lineTo(CS / 2 - 3, CS / 2 - 3); c.stroke();
  c.fillStyle = 'rgba(255,246,224,0.92)'; rr(c, -CS / 2 + 4, -CS / 2 + 7, CS - 8, CS - 11, 3); c.fill();
  c.font = M.VARF(11); c.fillStyle = '#8a4a24'; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText('x', -CS / 2 + 2, -CS / 2 + 8);
  const n = M.num(v), m = M.lay(n, 19), fs = m.w > CS - 10 ? 19 * (CS - 10) / m.w : 19; M.lay(n, fs); M.draw(c, n, -M.lay(n, fs).w / 2, 11, fs, { col: wonK >= 0 ? '#1f7a44' : '#3a1640' });
  c.restore();
}

// ---------------- the totals over the seesaw, and the sign between them ----------------
function drawTotals(g, c, S) {
  const t = g.t, v = S.v, L = total(S, v), d = L - S.c, y = 216;
  const asking = S.asking && !S.answered, lN = totalNode(S, v, asking), rN = M.row(M.num(S.c));
  const sz = 21, lm = M.lay(lN, sz), rm = M.lay(rN, sz);
  const lx = 92, rx = 268;
  for (const [n, m, cx, side] of [[lN, lm, lx, -1], [rN, rm, rx, 1]]) {
    const heavy = side < 0 ? d > 0 : d < 0, w = m.w + 22;
    c.fillStyle = 'rgba(40,8,24,0.72)'; rr(c, cx - w / 2, y - 20, w, 38, 19); c.fill();
    c.strokeStyle = S.done ? '#8af0a0' : heavy ? '#ffb46a' : 'rgba(255,230,190,0.5)'; c.lineWidth = 2; c.stroke();
    M.draw(c, n, cx - m.w / 2, y + 8, sz, { t, col: S.done ? '#c8ffd0' : INKL });
  }
  if (asking) { const b = { x: lx + lm.w / 2 - 6, y: y, w: 22, h: 26 }; M.glowBox(c, b, t, 0.8); }
  // the relation sign between the sides
  const sym = d === 0 ? '=' : d < 0 ? '<' : '>', pop = S.vAt != null && t - S.vAt < 0.25 ? Math.sin((t - S.vAt) / 0.25 * Math.PI) * 0.25 : 0;
  c.save(); c.translate(180, y - 1); c.scale(1 + pop, 1 + pop);
  c.fillStyle = d === 0 ? '#2f9a5a' : '#ffcf3a'; c.beginPath(); c.arc(0, 0, 17, 0, 7); c.fill(); c.strokeStyle = d === 0 ? '#c8ffd0' : '#8a4a10'; c.lineWidth = 2.5; c.stroke();
  c.strokeStyle = d === 0 ? '#fff' : '#5a2410'; c.lineWidth = 3.4; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  if (sym === '=') { c.moveTo(-7, -4); c.lineTo(7, -4); c.moveTo(-7, 4); c.lineTo(7, 4); }
  else { const k = sym === '<' ? 1 : -1; c.moveTo(6 * k, -7); c.lineTo(-6 * k, 0); c.lineTo(6 * k, 7); }
  c.stroke(); c.restore();
}

// ---------------- the slider ----------------
function drawSlider(g, c, S) {
  const t = g.t;
  // the rail
  c.fillStyle = 'rgba(40,8,20,0.45)'; rr(c, TR_X0 - 16, TR_Y - 6, TR_X1 - TR_X0 + 32, 16, 8); c.fill();
  const gr = c.createLinearGradient(0, TR_Y - 7, 0, TR_Y + 7); gr.addColorStop(0, '#fff0b0'); gr.addColorStop(0.5, '#e0a83a'); gr.addColorStop(1, '#8a5a1a');
  c.fillStyle = gr; rr(c, TR_X0 - 16, TR_Y - 7, TR_X1 - TR_X0 + 32, 13, 6.5); c.fill();
  // whole-number notches and their numbers
  c.font = '900 13px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let v = S.lo; v <= S.hi; v++) { const x = knobX(S, v); c.fillStyle = 'rgba(90,40,10,0.7)'; c.fillRect(x - 1, TR_Y - 5, 2, 9);
    c.fillStyle = v === S.v ? '#b8182c' : 'rgba(90,30,20,0.85)'; c.fillText(String(v).replace('-', '−'), x, TR_Y + 22); }
  c.font = M.VARF(24); c.fillStyle = INKL; c.textAlign = 'right'; c.fillText('x', TR_X0 - 22, TR_Y + 1);
  // the knob: a circus ball with the value of x on it, and a tag reading "x = 4"
  const won = S.done, x = S.kx, press = S.drag ? 1 : 0, gold = !!S.shown;
  c.fillStyle = 'rgba(40,8,20,0.35)'; c.beginPath(); c.ellipse(x + 2, TR_Y + 18, 18, 5, 0, 0, 7); c.fill();
  c.save(); if (won) { c.shadowColor = '#7aff9a'; c.shadowBlur = 18 + 8 * Math.sin(t * 7); }
  const kg = c.createRadialGradient(x - 6, TR_Y - 8, 2, x, TR_Y, 22); kg.addColorStop(0, won ? '#c8ffd8' : gold ? '#fffbe0' : '#fff4f0'); kg.addColorStop(0.5, won ? '#3ac06a' : gold ? '#f2b82a' : '#e83a4a'); kg.addColorStop(1, won ? '#1a7a3a' : gold ? '#9a6410' : '#9a1a2a');
  c.fillStyle = kg; c.beginPath(); c.arc(x, TR_Y, 20 + press * 2, 0, 7); c.fill(); c.restore();
  c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 3; c.beginPath(); c.arc(x, TR_Y, 14 + press * 2, -2.6, -1.2); c.stroke();
  const n = M.num(S.v), m = M.lay(n, 19); M.draw(c, n, x - m.w / 2, TR_Y + 7, 19, { col: '#fff' });
  const tag = M.row(M.vr('x'), M.op('='), M.num(S.v)), tm = M.lay(tag, 18), ty = TR_Y - 44, tw = tm.w + 18;
  c.fillStyle = won ? 'rgba(20,90,50,0.92)' : 'rgba(40,8,24,0.8)'; rr(c, x - tw / 2, ty - 15, tw, 28, 14); c.fill();
  c.beginPath(); c.moveTo(x - 6, ty + 12); c.lineTo(x + 6, ty + 12); c.lineTo(x, ty + 19); c.fill();
  c.strokeStyle = won ? '#8af0a0' : 'rgba(255,220,170,0.55)'; c.lineWidth = 1.5; rr(c, x - tw / 2, ty - 15, tw, 28, 14); c.stroke();
  M.draw(c, tag, x - tm.w / 2, ty + 6, 18, { t, col: won ? '#d8ffe0' : INKL });
  if (won && t - S.snapAt < 0.4) { const k = (t - S.snapAt) / 0.4; c.strokeStyle = `rgba(160,255,180,${1 - k})`; c.lineWidth = 3; c.beginPath(); c.arc(x, TR_Y, 20 + k * 30, 0, 7); c.stroke(); }
}

// ---------------- guidance ----------------
// The knob always glows. At level 0 a ghost hand slides it to the answer; from level 1 the hand appears only after a
// 2-second pause, and it only nudges the knob a little in the right direction (lighter side: more x).
function drawGuide(g, c, S) {
  const t = g.t; if (g.done || S.done || S.drag || (S.mk.ask && !S.mk.ask.closing)) return;
  M.glowBox(c, { x: S.kx, y: TR_Y, w: 40, h: 40 }, t, 0.9, true);
  const idle = t - (S.lastMoveT || 0);
  if (t < 0.45 || (g.level > 0 && idle < 2)) return;
  const dir = S.v < S.x ? 1 : -1, x0 = S.kx, x1 = g.level === 0 ? knobX(S, S.x) : clamp(x0 + dir * 46, TR_X0, TR_X1);
  const per = 1.7, k = ((t - 0.45) % per) / per, e = easeIO(clamp((k - 0.15) / 0.55, 0, 1)), fade = k > 0.86 ? (1 - k) / 0.14 : 1, hx = lerp(x0, x1, e);
  c.save(); c.globalAlpha = 0.7 * fade; c.setLineDash([6, 7]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x0, TR_Y - 26); c.lineTo(x1, TR_Y - 26); c.stroke(); c.setLineDash([]);
  c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.moveTo(x1 + dir * 8, TR_Y - 26); c.lineTo(x1 - dir * 2, TR_Y - 32); c.lineTo(x1 - dir * 2, TR_Y - 20); c.fill();
  c.globalAlpha = 0.45 * fade; c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(hx, TR_Y, 20, 0, 7); c.fill();
  c.restore();
  c.save(); c.globalAlpha = fade; M.hand(c, hx + 2, TR_Y + 4, 1, k < 0.15 || k > 0.72 ? 1 : 0); c.restore();
}
