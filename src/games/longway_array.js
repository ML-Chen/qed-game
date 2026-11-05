// longway_array.js — ARRAY! Build a multiplication as a rectangle of equal rows: 4 × 6 is 4 rows of 6.
// A sunny ant yard seen from above, late in the afternoon. A wooden sign says 4 × 6, with a small key: rows × columns.
// Next to the anthill sits a 1 × 1 array: one ant holding a cookie crumb. The player drags the array's corner handle;
// the rectangle stretches cell by cell, ants pop out of the anthill to fill every new spot, the rows and the columns
// count themselves along the edges, and a bubble on the handle shows rows × columns = total as it changes.
// Released at 4 rows by 6 columns, the ants cheer, the sign reads 4 × 6 = 24, and the rows skip-count down the right
// edge (6, 12, 18, 24). Released at any other size, the array stays, the ants shrug and the player tries again.
// Level 0: small arrays (2 × 3 to 3 × 5). Level 1: up to 6 × 6. Level 2: bigger arrays, and then the player turns the
// array a quarter turn with a round handle: it becomes 6 × 4, and the total stays 24 (turning it around doesn't change
// the total: the commutative property).
// Medium mode: the handle's bubble shows only rows × columns, and once the size is right the player picks the total
// from the tray.
//
// The stretch and the turn are continuous gestures, so this file handles its own down/move/up (like calc_tangent.js).
// moves(g) returns one placeholder drag move until the array is done, then nothing, so MK.update finishes the
// microgame with the kit's stars and confetti. The tray is the kit's (MK.openAsk), and MK.auto answers it in tests.
const M = MK;
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const Y0 = 292;                                 // top edge of the array
const SIGN_Y = 206;

function pickTarget(g) {
  const R = a => a[Math.floor(g.rand() * a.length)];
  return g.level === 0 ? R([[2, 3], [3, 4], [2, 5], [3, 3], [2, 4], [3, 5], [2, 6]])
    : g.level === 1 ? R([[4, 6], [3, 7], [5, 4], [4, 5], [6, 3], [3, 6], [5, 5]])
      : R([[6, 7], [7, 4], [5, 8], [6, 4], [4, 7], [3, 8], [7, 5]]);
}

MG.add({
  id: 'array', stage: 'longway', cmd: 'ARRAY!', hint: 'drag', time: 8, mood: 'bright', winText: 'Array!', hold: 1.6,
  card: {
    title: 'Arrays', ref: 'Grade 3', kind: 'Multiplication',
    text: 'An array is a rectangle of things set out in equal rows. A row goes across, and a column goes up and down.\n\nTo find how many things are in an array, multiply the number of rows by the number of columns. An array with 4 rows of 6 ants has 4 × 6 = 24 ants. You can check by counting by sixes, one row at a time: 6, 12, 18, 24.\n\nTurn the array a quarter turn and it has 6 rows of 4 ants. Nothing was added or taken away, so 6 × 4 is also 24. This is why you can multiply two numbers in either order and get the same answer. It is called the commutative property.',
    note: 'Rows × columns = total. Turning the array around doesn\'t change the total, so 4 × 6 = 6 × 4.',
    ask: 'How many ants are in an array with 3 rows of 7? What other array has the same number?',
  },
  init(g) {
    const S = g.s, K = M.setup(g); [S.R, S.C] = pickTarget(g);
    S.turn = g.level === 2; // level 2 also turns the array
    g.dur *= (2.6 + 1.05 * (2.4 + (S.turn ? 1.6 : 0))) / 8;
    S.max = Math.min(9, Math.max(S.R, S.C) + (g.level === 0 ? 1 : 2));
    S.cs = Math.min(50, Math.floor(288 / S.max));
    S.x0 = Math.round(180 - S.max * S.cs / 2 + 12);
    S.rows = 1; S.cols = 1; S.born = {}; S.born['0,0'] = -9;
    S.phase = 'stretch'; S.ang = 0; S.drag = null; S.lastMoveT = 0;
    S.ant = { cheerAt: -9, shrugAt: -9 };
    M.zone(g, 'handle', handleBox(S));
    M.zone(g, 'sign', { x: 180, y: SIGN_Y, w: 200, h: 56 });
    M.play(g, {
      moves(g) { return S.phase === 'stretch' || S.phase === 'ask' ? [{ drag: 'handle', to: 'size' }] : S.phase === 'turn' ? [{ drag: 'turn', to: 'quarter' }] : []; },
      area(g) { return null; },
      onWin(g) { S.winAt = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    if (S.phase === 'stretch') M.zone(g, 'handle', handleBox(S));
    if (S.phase === 'turn') M.zone(g, 'turn', turnBox(S));
    if (S.spring) { const k = clamp((g.t - S.spring.t0) / 0.2, 0, 1); S.ang = lerp(S.spring.from, 0, ease(k)); if (k >= 1) S.spring = null; }
    // after a timeout the array stretches (and turns) to the right size by itself
    if (g.done && g.result === 'fail' && !S.shownAt && g.t - g.doneAt > 0.35) {
      S.shownAt = g.t;
      if (S.phase === 'stretch' || S.phase === 'ask') { setSize(g, S.R, S.C, true); S.skipAt = g.t + 0.1; S.signAt = g.t; S.phase = 'shown'; S.answerShown = true; }
      else if (S.phase === 'turn') turned(g, true);
    }
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (S.phase === 'stretch') {
      const h = handleXY(S), near = g.level === 0 ? 48 : 36;
      if (Math.hypot(x - h.x, y - h.y) < near) { S.drag = { kind: 'stretch', ox: x - h.x, oy: y - h.y }; g.sfx('tap'); return; }
      // anywhere else on the yard grid: the corner jumps to the cell under the finger
      if (x > S.x0 - 6 && x < S.x0 + S.max * S.cs + 10 && y > Y0 - 6 && y < Y0 + S.max * S.cs + 10) { S.drag = { kind: 'stretch', ox: -S.cs / 2, oy: -S.cs / 2 }; g.sfx('tap'); this.move(g, x, y); return; }
    }
    if (S.phase === 'turn') {
      const b = turnBox(S), c = center(S), d = Math.hypot(x - c.x, y - c.y), r = Math.hypot(b.x - c.x, b.y - c.y);
      if (Math.hypot(x - b.x, y - b.y) < (g.level === 0 ? 48 : 40) || (d > r * 0.55 && d < r + 30)) { S.drag = { kind: 'turn', a0: Math.atan2(y - c.y, x - c.x), ang0: S.ang }; S.spring = null; g.sfx('tap'); return; }
    }
    // the sign: it wobbles
    if (Math.abs(x - 180) < 100 && Math.abs(y - SIGN_Y) < 30) { S.signWobAt = g.t; g.sfx('thud'); }
  },
  move(g, x, y) {
    const S = g.s, D = S.drag; if (!D || g.done) return; D.moved = true;
    if (D.kind === 'stretch') {
      D.fx = x - D.ox; D.fy = y - D.oy;
      const cols = clamp(Math.round((D.fx - S.x0) / S.cs), 1, S.max), rows = clamp(Math.round((D.fy - Y0) / S.cs), 1, S.max);
      if (cols !== S.cols || rows !== S.rows) setSize(g, rows, cols, false);
    } else {
      const c = center(S); let a = Math.atan2(y - c.y, x - c.x) - D.a0; a = Math.atan2(Math.sin(a), Math.cos(a));
      S.ang = clamp(D.ang0 + a, -Math.PI / 2, Math.PI / 2);
      const q = Math.round(S.ang / 0.26); if (q !== S.angTick) { S.angTick = q; g.sfx('click'); }
    }
  },
  up(g, x, y) {
    const S = g.s, D = S.drag; S.drag = null; if (!D || g.done) return;
    S.lastMoveT = g.t;
    if (D.kind === 'stretch') {
      if (S.rows === S.R && S.cols === S.C) { success(g); return; }
      if (!D.moved && S.rows === 1 && S.cols === 1) return;
      S.ant.shrugAt = g.t; S.badAt = g.t; g.sfx('boing');
      if (g.level >= 1) { S.mk.wrong = (S.mk.wrong || 0) + 1; S.mk.missAt = g.t; }
    } else {
      if (Math.abs(S.ang) > 0.75) { turned(g, false); return; }
      S.spring = { t0: g.t, from: S.ang }; if (D.moved && Math.abs(S.ang) > 0.1) g.sfx('boing');
    }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.bot) { const b = S.bot, k = clamp((g.t - b.t0) / b.dur, 0, 1), p = b.at(easeIO(k)); synth('move', p.x, p.y); if (k >= 1) { synth('up', p.x, p.y); S.bot = null; S.botNext = g.t + 0.4; } return; }
    if (g.t < (S.botNext ?? 0.5) || K.busyT > 0) return;
    if (S.phase === 'stretch') { const h = handleXY(S), tx = S.x0 + S.C * S.cs, ty = Y0 + S.R * S.cs; synth('down', h.x, h.y); S.bot = { t0: g.t, dur: 0.45, at: k => ({ x: lerp(h.x, tx, k), y: lerp(h.y, ty, k) }) }; }
    else if (S.phase === 'turn') { const b = turnBox(S), c = center(S), r = Math.hypot(b.x - c.x, b.y - c.y), a0 = Math.atan2(b.y - c.y, b.x - c.x); synth('down', b.x, b.y); S.bot = { t0: g.t, dur: 0.45, at: k => ({ x: c.x + Math.cos(a0 + k * 1.6) * r, y: c.y + Math.sin(a0 + k * 1.6) * r }) }; }
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('longway_array_yard', yard), 0, 0, W, H);
    ambient(c, t);
    drawSign(g, c, S);
    drawGrid(g, c, S);
    drawGuide(g, c, S);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

// ---------------- geometry ----------------
const handleXY = S => ({ x: S.x0 + S.cols * S.cs, y: Y0 + S.rows * S.cs });
const handleBox = S => { const h = handleXY(S); return { x: h.x, y: h.y, w: 34, h: 34 }; };
function center(S) { return { x: S.x0 + S.cols * S.cs / 2, y: Y0 + S.rows * S.cs / 2 }; }
// the turn handle sits just outside the array's bottom-right corner, and turns with it
function turnOff(S) { if (S.phase !== 'turn' || !S.ang) return { x: 0, y: 0 }; const c = center(S), k = Math.abs(S.ang) / (Math.PI / 2); return { x: (S.x0 + S.rows * S.cs / 2 - c.x) * k, y: (Y0 + S.cols * S.cs / 2 - c.y) * k }; }
function turnBox(S) { const o = turnOff(S), c0 = center(S), c = { x: c0.x + o.x, y: c0.y + o.y }, hx = S.cols * S.cs / 2 + 16, hy = S.rows * S.cs / 2 + 16, a = S.ang, x = c.x + hx * Math.cos(a) - hy * Math.sin(a), y = c.y + hx * Math.sin(a) + hy * Math.cos(a); return { x, y, w: 40, h: 40 }; }
function setSize(g, rows, cols, quiet) {
  const S = g.s, grew = rows * cols > S.rows * S.cols;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (r >= S.rows || c >= S.cols) S.born[r + ',' + c] = g.t + (r + c) * 0.008; // new spots: an ant runs out of the anthill
  S.rows = rows; S.cols = cols; S.sizeAt = g.t;
  if (!quiet) g.sfx(grew ? 'pop' : 'tap');
}
function success(g) {
  const S = g.s; S.ant.cheerAt = g.t; g.sfx('cheer'); g.sfx('sparkle'); const c = center(S); g.burst(c.x, c.y, ['#ffd45a', '#ff8a5a', '#fff'], 18, 180);
  S.signAt = g.t;
  if (g.mode === 'medium') {
    const p = S.R * S.C;
    S.phase = 'ask'; S.mk.busyT = 1e9;
    M.openAsk(g, { ask: { v: p, wrong: [S.R + S.C, p - S.C, p + S.C, (S.R - 1) * (S.C + 1), p + 1] }, after: 0.05, resolve(g) { S.answerShown = true; S.skipAt = g.t; S.phase = S.turn ? 'turn' : 'done'; S.lastMoveT = g.t; g.sfx('coin'); } });
  } else { S.answerShown = true; S.skipAt = g.t + 0.05; S.phase = S.turn ? 'turn' : 'done'; }
}
function turned(g, quiet) {
  const S = g.s, c0 = center(S), sgn = S.ang < 0 ? -1 : 1;
  S.phase = 'done'; S.turnedAt = g.t;
  // the turned array: columns become rows. Keep its centre where it is for a moment, then slide it into place
  const o = turnOff(S); c0.x += o.x; c0.y += o.y; const R0 = S.rows, C0 = S.cols; S.rows = C0; S.cols = R0; S.ang = 0; S.born = {}; for (let r = 0; r < S.rows; r++) for (let c = 0; c < S.cols; c++) S.born[r + ',' + c] = -9;
  const c1 = center(S); S.slide = { t0: g.t, dx: c0.x - c1.x, dy: c0.y - c1.y };
  S.skipAt = g.t + 0.15; S.signAt2 = g.t; S.ant.cheerAt = g.t;
  if (!quiet) { g.sfx('swoosh'); g.sfx('magic'); g.burst(c0.x, c0.y, ['#9ae07a', '#ffd45a', '#fff'], 16, 160); }
}

// ---------------- the world ----------------
function yard(c, w, h) {
  const gr = c.createRadialGradient(150, 330, 40, 180, 360, 470); gr.addColorStop(0, '#f6dca2'); gr.addColorStop(0.6, '#e8c07a'); gr.addColorStop(1, '#c8965a');
  c.fillStyle = gr; c.fillRect(0, 0, w, h);
  let sd = 3; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  // sand grain
  for (let i = 0; i < 900; i++) { c.fillStyle = rnd() < 0.5 ? 'rgba(255,240,200,0.35)' : 'rgba(150,100,50,0.18)'; c.fillRect(rnd() * w, rnd() * h, 1.6, 1.6); }
  // wind ripples in the sand
  c.strokeStyle = 'rgba(170,120,60,0.18)'; c.lineWidth = 2; for (let i = 0; i < 16; i++) { const y = 30 + i * 40 + rnd() * 10, x = rnd() * 300; c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + 30, y - 6, x + 60, y + 6, x + 100, y); c.stroke(); }
  // pebbles with long evening shadows
  for (let i = 0; i < 26; i++) { const edge = i % 2, x = edge ? (rnd() < 0.5 ? rnd() * 34 : 326 + rnd() * 34) : rnd() * w, y = edge ? 160 + rnd() * 460 : (rnd() < 0.5 ? 140 + rnd() * 40 : 590 + rnd() * 50), r = 3 + rnd() * 7;
    c.fillStyle = 'rgba(110,60,30,0.25)'; c.beginPath(); c.ellipse(x + r * 0.9, y + r * 0.5, r * 1.3, r * 0.6, 0.3, 0, 7); c.fill();
    c.fillStyle = ['#b8a898', '#d0c4b4', '#a89080', '#e0d4c0'][i % 4]; c.beginPath(); c.ellipse(x, y, r, r * 0.8, rnd() * 3, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.25, 0, 0, 7); c.fill(); }
  // grass along the edges, seen from above
  const tuft = (x, y, s) => { for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.32; c.strokeStyle = ['#6aa040', '#88b850', '#4e8a34'][k % 3]; c.lineWidth = 3 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * 10 * s, y + Math.sin(a) * 6 * s, x + Math.cos(a) * 18 * s, y + Math.sin(a) * 14 * s); c.stroke(); } };
  for (const [x, y, s] of [[14, 150, 1.2], [348, 170, 1], [10, 620, 1.4], [350, 600, 1.3], [180, 636, 1], [80, 640, 1.1], [290, 640, 1.2], [352, 380, 0.9], [8, 400, 0.9]]) tuft(x, y, s);
  // a clover patch and a fallen leaf
  c.fillStyle = '#7ab84a'; for (const [x, y] of [[326, 470], [334, 482], [318, 484]]) { for (let k = 0; k < 3; k++) { const a = k * 2.1; c.beginPath(); c.arc(x + Math.cos(a) * 4, y + Math.sin(a) * 4, 4.5, 0, 7); c.fill(); } }
  c.save(); c.translate(36, 560); c.rotate(-0.6); c.fillStyle = '#d87a3a'; c.beginPath(); c.ellipse(0, 0, 16, 7, 0, 0, 7); c.fill(); c.strokeStyle = '#a8502a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-16, 0); c.lineTo(16, 0); c.stroke(); c.restore();
}
function ambient(c, t) {
  // warm light drifting across the sand
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 4; k++) { const x = 180 + Math.sin(t * 0.25 + k * 1.9) * 150, y = 380 + Math.cos(t * 0.2 + k * 2.6) * 220, r = 90; const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,220,150,0.08)'); gr.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); }
  c.restore();
  // a line of worker ants trekking along the bottom with crumbs
  for (let i = 0; i < 4; i++) { const x = ((t * 26 + i * 34) % 460) - 50; try { ANI.draw(c, 'ant', x, 618 + Math.sin(i) * 3, 0.42, { t: t + i, pose: 'carry', phase: i, hold: crumb(5) }); } catch (e) { } }
  // a butterfly
  const bx = 300 + Math.sin(t * 0.7) * 40, by = 150 + Math.sin(t * 1.3) * 16, f = Math.abs(Math.sin(t * 12));
  c.save(); c.translate(bx, by); c.fillStyle = '#ff9ac0'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 6 * f, -2, 7 * f + 1, 6, sd * 0.4, 0, 7); c.fill(); c.beginPath(); c.ellipse(sd * 4 * f, 5, 5 * f + 1, 4, sd * 0.6, 0, 7); c.fill(); } c.fillStyle = '#5a2a3a'; c.fillRect(-1, -6, 2, 13); c.restore();
}
// a cookie crumb held over an ant's head (drawn at the hold point)
const crumb = r => cc => { cc.fillStyle = '#c8803a'; cc.beginPath(); cc.arc(0, -r * 0.4, r, 0, 7); cc.fill(); cc.fillStyle = '#e8b06a'; cc.beginPath(); cc.arc(-r * 0.25, -r * 0.65, r * 0.6, 0, 7); cc.fill(); cc.fillStyle = '#5a2a14'; for (const [dx, dy] of [[0.3, -0.2], [-0.4, -0.1], [0.1, -0.8]]) { cc.beginPath(); cc.arc(dx * r, dy * r, r * 0.16, 0, 7); cc.fill(); } };
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the sign ----------------
function drawSign(g, c, S) {
  const t = g.t, wob = S.signWobAt != null && t - S.signWobAt < 0.4 ? Math.sin((t - S.signWobAt) * 30) * 0.04 * (1 - (t - S.signWobAt) / 0.4) : 0;
  const p = S.R * S.C, solved = S.answerShown, asking = S.phase === 'ask';
  const parts = [M.num(S.R), M.op('×'), M.num(S.C)];
  if (S.turnedAt != null) parts.push(M.op('='), M.num(S.C, null, { pop: S.signAt2 }), M.op('×'), M.num(S.R, null, { pop: S.signAt2 }));
  if (solved) parts.push(M.op('='), M.num(p, null, { pop: S.signAt, col: '#ffe27a' })); else if (asking) parts.push(M.op('='), M.slot(null, { col: '#ffe6b0' }));
  const node = M.row(...parts); let s = 34; const w0 = M.lay(node, s).w; if (w0 > 270) s *= 270 / w0;
  const m = M.lay(node, s), w = Math.max(170, m.w + 44), hh = 64;
  c.save(); c.translate(180, SIGN_Y + 30); c.rotate(wob); c.translate(-180, -SIGN_Y - 30);
  // the stake and its shadow on the sand
  c.fillStyle = 'rgba(110,60,30,0.3)'; c.beginPath(); c.ellipse(186, SIGN_Y + 48, 12, 4, 0, 0, 7); c.fill();
  c.fillStyle = '#6e4524'; c.fillRect(176, SIGN_Y + 20, 8, 28);
  c.fillStyle = 'rgba(60,30,10,0.3)'; rr(c, 180 - w / 2 + 4, SIGN_Y - hh / 2 + 6, w, hh, 12); c.fill();
  const gr = c.createLinearGradient(0, SIGN_Y - hh / 2, 0, SIGN_Y + hh / 2); gr.addColorStop(0, '#a8703f'); gr.addColorStop(1, '#6e4524'); c.fillStyle = gr; rr(c, 180 - w / 2, SIGN_Y - hh / 2, w, hh, 12); c.fill();
  c.strokeStyle = 'rgba(50,25,8,0.3)'; c.lineWidth = 1.5; for (let k = 1; k < 4; k++) { const yy = SIGN_Y - hh / 2 + k * hh / 4; c.beginPath(); c.moveTo(180 - w / 2 + 10, yy); c.bezierCurveTo(140, yy + 3, 220, yy - 3, 180 + w / 2 - 10, yy); c.stroke(); }
  c.fillStyle = '#d8c090'; for (const px of [180 - w / 2 + 10, 180 + w / 2 - 10]) { c.beginPath(); c.arc(px, SIGN_Y - hh / 2 + 10, 3, 0, 7); c.fill(); }
  M.draw(c, node, 180 - m.w / 2, SIGN_Y + 4, s, { t, col: '#fff4dc' });
  // a small key that names the two numbers
  c.font = '800 11px Nunito, system-ui, sans-serif'; c.fillStyle = 'rgba(255,236,200,0.85)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(S.turnedAt != null ? 'rows × columns, turned' : 'rows × columns', 180, SIGN_Y + hh / 2 - 8);
  c.restore();
}

// ---------------- the array ----------------
function drawGrid(g, c, S) {
  const t = g.t, cs = S.cs, won = g.done && g.result === 'win', cheer = won || t - S.ant.cheerAt < 0.9, shrug = t - S.ant.shrugAt < 0.7;
  const right = S.rows === S.R && S.cols === S.C && S.phase === 'stretch' && S.drag && g.level < 2;
  // the anthill at the top-left corner, where the ants come from
  const ax = S.x0 - 16, ay = Y0 - 16;
  c.fillStyle = 'rgba(110,60,30,0.3)'; c.beginPath(); c.ellipse(ax + 4, ay + 5, 26, 18, 0, 0, 7); c.fill();
  const mg = c.createRadialGradient(ax - 6, ay - 6, 2, ax, ay, 26); mg.addColorStop(0, '#e8c48a'); mg.addColorStop(1, '#b0804a'); c.fillStyle = mg; c.beginPath(); c.ellipse(ax, ay, 24, 18, 0, 0, 7); c.fill();
  c.fillStyle = '#3a2010'; c.beginPath(); c.ellipse(ax + 1, ay, 6, 4.5, 0, 0, 7); c.fill();
  // empty spots where the array could grow: little dug dimples
  c.fillStyle = 'rgba(140,90,40,0.22)';
  if (S.phase === 'stretch' || S.phase === 'ask') for (let r = 0; r < S.max; r++) for (let q = 0; q < S.max; q++) { if (r < S.rows && q < S.cols) continue; c.beginPath(); c.arc(S.x0 + (q + 0.5) * cs, Y0 + (r + 0.5) * cs, 2.5, 0, 7); c.fill(); }
  // the array itself, turned by S.ang about its centre (and sliding into place after a turn)
  const ctr = center(S), to = turnOff(S); let ox = to.x, oy = to.y;
  if (S.slide) { const k = ease((t - S.slide.t0) / 0.3); ox = S.slide.dx * (1 - k); oy = S.slide.dy * (1 - k); }
  const ca = Math.cos(S.ang), sa = Math.sin(S.ang), P0 = (x, y) => ({ x: ctr.x + ox + (x - ctr.x) * ca - (y - ctr.y) * sa, y: ctr.y + oy + (x - ctr.x) * sa + (y - ctr.y) * ca });
  const w = S.cols * cs, h = S.rows * cs, bad = S.badAt != null && t - S.badAt < 0.5 ? 1 - (t - S.badAt) / 0.5 : 0;
  c.save(); c.translate(ctr.x + ox, ctr.y + oy); c.rotate(S.ang);
  c.fillStyle = 'rgba(110,60,30,0.25)'; rr(c, -w / 2 + 4, -h / 2 + 5, w, h, 8); c.fill();
  c.fillStyle = right || S.answerShown ? 'rgba(220,255,200,0.55)' : 'rgba(255,248,226,0.55)'; rr(c, -w / 2, -h / 2, w, h, 8); c.fill();
  c.strokeStyle = bad ? `rgba(216,69,74,${0.5 + bad * 0.5})` : right || S.answerShown ? '#5aa04a' : 'rgba(150,100,50,0.6)'; c.lineWidth = 2.5; c.setLineDash([6, 5]); rr(c, -w / 2, -h / 2, w, h, 8); c.stroke(); c.setLineDash([]);
  c.strokeStyle = 'rgba(150,100,50,0.25)'; c.lineWidth = 1; c.beginPath(); for (let q = 1; q < S.cols; q++) { c.moveTo(-w / 2 + q * cs, -h / 2 + 4); c.lineTo(-w / 2 + q * cs, h / 2 - 4); } for (let r = 1; r < S.rows; r++) { c.moveTo(-w / 2 + 4, -h / 2 + r * cs); c.lineTo(w / 2 - 4, -h / 2 + r * cs); } c.stroke();
  c.restore();
  // the ants, upright at their (turned) spots; new ones pop out of the anthill
  const as = cs / 66;
  for (let r = 0; r < S.rows; r++) for (let q = 0; q < S.cols; q++) {
    const b = S.born[r + ',' + q] ?? -9, k = clamp((t - b) / 0.18, 0, 1), p = P0(S.x0 + (q + 0.5) * cs, Y0 + (r + 0.5) * cs);
    const x = lerp(ax, p.x, ease(k)), y = lerp(ay, p.y, ease(k)) + cs * 0.32 - Math.sin(k * Math.PI) * 10;
    const ph = r * 1.3 + q * 0.7, sk = S.skipAt != null && t > S.skipAt + r * 0.13 && t < S.skipAt + r * 0.13 + 0.3;
    try { ANI.draw(c, 'ant', x, y, as * (0.7 + 0.3 * k), { t, phase: ph, pose: cheer || sk ? 'cheer' : 'carry', expr: cheer ? 'laugh' : shrug ? 'think' : 'happy', hold: cheer || sk ? null : crumb(4), noShadow: k < 1 }); } catch (e) { }
  }
  // live counts along the edges (hidden while turning)
  if (Math.abs(S.ang) < 0.02 && !S.slide || (S.slide && t - S.slide.t0 > 0.3)) {
    c.font = `800 ${Math.round(Math.min(15, cs * 0.45))}px Fredoka, Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let q = 0; q < S.cols; q++) { const last = q === S.cols - 1; c.fillStyle = last ? '#7a2a14' : 'rgba(110,60,30,0.65)'; c.fillText(String(q + 1), S.x0 + (q + 0.5) * cs, Y0 - 9); }
    for (let r = 0; r < S.rows; r++) { const last = r === S.rows - 1; c.fillStyle = last ? '#7a2a14' : 'rgba(110,60,30,0.65)'; c.fillText(String(r + 1), S.x0 - 10, Y0 + (r + 0.5) * cs); }
  }
  // the skip count down the right edge: one more row each beat
  if (S.skipAt != null && Math.abs(S.ang) < 0.02) {
    for (let r = 0; r < S.rows; r++) { const k = ease((t - S.skipAt - r * 0.13) / 0.2); if (k <= 0) continue; const x = S.x0 + S.cols * cs + 20 + ox, y = Y0 + (r + 0.5) * cs + oy, last = r === S.rows - 1;
      c.save(); c.globalAlpha = k; c.translate(x, y); c.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); c.font = `700 ${last ? 19 : 15}px Fredoka, Nunito, system-ui, sans-serif`; const txt = String((r + 1) * S.cols), tw = c.measureText(txt).width + 12;
      c.fillStyle = last ? '#3a8a3a' : 'rgba(255,250,236,0.92)'; rr(c, -tw / 2, -11, tw, 22, 11); c.fill(); c.fillStyle = last ? '#ffffff' : '#5a3a1a'; c.fillText(txt, 0, 1); c.restore(); }
  }
  // the corner handle with its live bubble
  if (S.phase === 'stretch' || S.phase === 'ask') {
    const hp = handleXY(S), D = S.drag && S.drag.kind === 'stretch' ? S.drag : null, fx = D && D.fx != null ? D.fx : hp.x, fy = D && D.fy != null ? D.fy : hp.y;
    if (D) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.setLineDash([4, 4]); c.lineWidth = 2; c.strokeRect(S.x0, Y0, fx - S.x0, fy - Y0); c.restore(); }
    if (S.phase === 'stretch') {
      const pr = D ? 1.15 : 1 + 0.05 * Math.sin(t * 5);
      c.save(); c.translate(hp.x, hp.y); c.scale(pr, pr);
      c.fillStyle = 'rgba(80,40,10,0.35)'; c.beginPath(); c.arc(2, 3, 14, 0, 7); c.fill();
      c.fillStyle = '#ff9a4a'; c.beginPath(); c.arc(0, 0, 14, 0, 7); c.fill(); c.strokeStyle = '#8a3a14'; c.lineWidth = 2.5; c.stroke();
      c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-5, 1); c.lineTo(5, 1); c.lineTo(5, -9); c.moveTo(1, 5); c.lineTo(5, 1); c.stroke();
      c.beginPath(); c.moveTo(-1, 6); c.lineTo(6, 6); c.lineTo(6, -1); c.stroke();
      c.restore();
    }
    // the bubble: rows × columns (= total in easy mode)
    const txt = `${S.rows} × ${S.cols}` + (g.mode === 'medium' ? '' : ` = ${S.rows * S.cols}`);
    c.font = '700 17px Fredoka, Nunito, system-ui, sans-serif'; const bw = c.measureText(txt).width + 18, sh = bad ? Math.sin(t * 50) * 4 * bad : 0;
    let bx = hp.x + 16, by = hp.y + 26; if (bx + bw > 352) bx = hp.x - 16 - bw; if (by > 600) by = hp.y - 34;
    c.save(); c.translate(sh, 0); c.fillStyle = bad ? 'rgba(160,30,40,0.9)' : right ? 'rgba(40,110,50,0.92)' : 'rgba(70,40,20,0.86)'; rr(c, bx, by - 13, bw, 26, 13); c.fill();
    c.fillStyle = '#fff6e4'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(txt, bx + 9, by + 1); c.restore();
  }
  // the turn handle
  if (S.phase === 'turn') {
    const b = turnBox(S), D = S.drag && S.drag.kind === 'turn';
    c.save(); c.translate(b.x, b.y); c.scale(D ? 1.15 : 1 + 0.05 * Math.sin(t * 5), D ? 1.15 : 1 + 0.05 * Math.sin(t * 5));
    c.fillStyle = 'rgba(80,40,10,0.35)'; c.beginPath(); c.arc(2, 3, 16, 0, 7); c.fill();
    c.fillStyle = '#5ab0e8'; c.beginPath(); c.arc(0, 0, 16, 0, 7); c.fill(); c.strokeStyle = '#1a4a7a'; c.lineWidth = 2.5; c.stroke();
    c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, 8, -2.6, 1.2); c.stroke();
    const ex = Math.cos(1.2) * 8, ey = Math.sin(1.2) * 8; c.fillStyle = '#fff'; c.beginPath(); c.moveTo(ex + 5, ey - 2); c.lineTo(ex - 4, ey + 5); c.lineTo(ex - 3, ey - 5); c.closePath(); c.fill();
    c.restore();
  }
}

// ---------------- guidance ----------------
// the handle always glows; a ghost hand drags it to the right size at level 0, or after a 2-second pause
function drawGuide(g, c, S) {
  const t = g.t, K = S.mk; if (g.done || S.drag || (K.ask && !K.ask.closing) || K.busyT > 0) return;
  const showHand = !((g.level !== 0 && t - S.lastMoveT < 2) || t < 0.45);
  const per = 1.7, k = ((t - 0.45) % per) / per, e = easeIO(clamp((k - 0.14) / 0.55, 0, 1)), fade = k > 0.86 ? (1 - k) / 0.14 : 1;
  if (S.phase === 'stretch') {
    const h = handleXY(S), tx = S.x0 + S.C * S.cs, ty = Y0 + S.R * S.cs;
    M.glowBox(c, { x: h.x, y: h.y, w: 30, h: 30 }, t, 0.9, true);
    if (!showHand) return;
    const x = lerp(h.x, tx, e), y = lerp(h.y, ty, e);
    c.save(); c.globalAlpha = 0.55 * fade; c.strokeStyle = '#fff6c0'; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.lineDashOffset = -t * 30; c.strokeRect(S.x0, Y0, x - S.x0, y - Y0); c.restore();
    c.save(); c.globalAlpha = fade; M.hand(c, x + 2, y + 4, 1, k < 0.14 || k > 0.7 ? 1 : 0); c.restore();
  } else if (S.phase === 'turn') {
    const b = turnBox(S), at = a => { const keep = S.ang; S.ang = a; const q = turnBox(S); S.ang = keep; return q; };
    M.glowBox(c, { x: b.x, y: b.y, w: 34, h: 34 }, t, 0.9, true);
    if (!showHand) return;
    c.save(); c.globalAlpha = 0.6 * fade; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.setLineDash([6, 7]); c.lineDashOffset = -t * 30; c.beginPath();
    for (let i = 0; i <= 16; i++) { const q = at(i / 16 * Math.PI / 2); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); } c.stroke(); c.restore();
    const q = at(e * Math.PI / 2); c.save(); c.globalAlpha = fade; M.hand(c, q.x + 2, q.y + 4, 1, k < 0.14 || k > 0.7 ? 1 : 0); c.restore();
  }
}
