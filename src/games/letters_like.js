// letters_like.js — LIKE TERMS! Catch the like terms of an expression in a basket; they add up as they land.
// An apple orchard at sunset. The expression hangs on a wooden sign in the big tree (3x + 5 − 2x + x² + x). Its terms
// ripen one at a time, in order, on apples that drop from the branches. The fox's basket is labelled with a letter
// part ("x"); the player drags the basket left and right to catch only the like terms. Each like term that lands adds
// into the basket's total at once ("3x + (−2x) = x" pops above the basket, and the basket reads "x"). An unlike term
// that lands in the basket bounces out with a boing (it never ends the game); a like term that is missed bounces on
// the grass and grows back on the tree to fall again. Each running sum writes itself above the basket.
// When every like term is in, the combining is acted out on the sign (show your work): the like terms are circled, slide
// together to the front of the expression (the other terms glide out of the way), then squeeze into one spot while the
// basket's total (2x) flies up from the basket and lands there, so the sign reads 2x + 5 + x². The fuse stands still.
// Level 0: three positive x terms and two numbers. Level 1: four x (or y) terms, one negative, with a number and a
// square mixed in. Level 2: the basket collects x² or xy terms, with x, y and numbers mixed in.
// Medium mode: the running total shows "?"; at the end the player picks the combined coefficient from a tray.
// The kit's moves(g) is for taps and drags, so this file runs its own basket. moves(g) returns one placeholder move
// until every like term is in (and answered in medium mode), then nothing, so the kit's finish() awards the stars.
const M = MK;
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO, TAU = Math.PI * 2;
const SPAWN_Y = 268, RIM = 548, GROUND = 606, AR = 24;    // where apples ripen, the basket's rim, the grass, apple radius
const GAP = [0.95, 0.85, 0.75], FALL = [1.95, 1.75, 1.55], HANG = 0.4, CATCH = [56, 48, 42];
const SIGN = { x: 180, y: 212, w: 336, h: 54 };
const APPLES = [['#e8424a', '#a81e2a', '#fff6e4'], ['#f6c03a', '#c8861a', '#4a2410'], ['#9ad048', '#5a9a2a', '#2a3a10']];

// ---------------- terms ----------------
// a term is { c: coefficient, v: '' | 'x' | 'y' | 'x2' | 'y2' | 'xy' }
function letters(v) {
  if (v === 'x2' || v === 'y2') return M.sup(M.vr(v[0]), M.num(2));
  if (v === 'xy') return M.row(M.vr('x'), M.vr('y'));
  return M.vr(v);
}
function termNode(c, v, id, o) {
  if (!v) return M.num(c, id, o);
  const lp = letters(v), r = c === 1 ? M.row(lp) : c === -1 ? M.row(M.txt('−'), lp) : M.row(M.num(c), lp);
  if (id) r.id = id; if (o) Object.assign(r, o); return r;
}
// the terms of an expression in order, with + and − between them
function exprNode(terms, idp) {
  const out = [];
  terms.forEach((q, i) => {
    if (i === 0) out.push(termNode(q.c, q.v, idp ? idp + i : null));
    else { out.push(M.op(q.c < 0 ? '-' : '+', idp ? 'o' + i : null)); out.push(termNode(Math.abs(q.c), q.v, idp ? idp + i : null)); }
  });
  return M.row(...out);
}
function pickProblem(g) {
  const L = g.level, r = n => Math.floor(g.rand() * n), R = a => a[r(a.length)];
  const coefs = (n, lo, hi) => { const out = []; while (out.length < n) { const c = lo + r(hi - lo + 1); if (out.filter(q => q === c).length < 2) out.push(c); } return out; };
  let kind, like, unlike;
  if (L === 0) { kind = 'x'; like = coefs(3, 1, 5); unlike = [2 + r(8), 2 + r(8)].map(c => ({ c, v: '' })); }
  else if (L === 1) {
    kind = R(['x', 'x', 'y']);
    do { like = coefs(4, 1, 5); like[1 + r(3)] *= -1; } while (like.reduce((p, q) => p + q, 0) <= 0);
    unlike = [{ c: 2 + r(8), v: '' }, { c: 1 + r(4), v: kind + '2' }];
  } else {
    kind = R(['x2', 'xy']);
    do { like = coefs(4, 1, 6); like[1 + r(3)] *= -1; if (g.rand() < 0.5) like[0] *= -1; } while (like.reduce((p, q) => p + q, 0) === 0 || like.every(q => q < 0));
    unlike = kind === 'x2' ? [{ c: 2 + r(5), v: 'x' }, { c: 2 + r(8), v: '' }] : [{ c: 2 + r(5), v: 'x' }, { c: 2 + r(5), v: 'y' }];
  }
  like = like.map(c => ({ c, v: kind, like: true }));
  // shuffle, keeping a like term with a positive coefficient first
  const all = [...like, ...unlike.map(q => ({ ...q, like: false }))];
  for (let i = all.length - 1; i > 0; i--) { const j = r(i + 1); [all[i], all[j]] = [all[j], all[i]]; }
  const f = all.findIndex(q => q.like && q.c > 0); if (f > 0) [all[0], all[f]] = [all[f], all[0]];
  // no two unlike terms in a row at the start, so the first catch comes quickly
  return { kind, terms: all.map((q, i) => ({ ...q, i })) };
}

// ---------------- the orchard ----------------
function orchard(c, w, h) {
  const sky = c.createLinearGradient(0, 0, 0, 560); [[0, '#5a3a7a'], [0.35, '#c8607a'], [0.7, '#f6a65a'], [1, '#ffe2a0']].forEach(([k, col]) => sky.addColorStop(k, col)); c.fillStyle = sky; c.fillRect(0, 0, w, 570);
  const sun = c.createRadialGradient(92, 500, 6, 92, 500, 210); sun.addColorStop(0, 'rgba(255,244,200,0.95)'); sun.addColorStop(0.18, 'rgba(255,214,150,0.5)'); sun.addColorStop(1, 'rgba(255,190,140,0)'); c.fillStyle = sun; c.fillRect(0, 280, w, 290);
  c.fillStyle = '#fff2c8'; c.beginPath(); c.arc(92, 506, 24, 0, TAU); c.fill();
  // far hills and rows of orchard trees, in soft purple
  c.fillStyle = '#b86a7a'; c.beginPath(); c.moveTo(0, 540); for (let x = 0; x <= w; x += 8) c.lineTo(x, 520 - 14 * Math.sin(x * 0.018 + 1) - 6 * Math.sin(x * 0.05)); c.lineTo(w, 570); c.lineTo(0, 570); c.fill();
  for (let i = 0; i < 9; i++) { const x = 18 + i * 42, y = 530 + (i % 2) * 6; c.fillStyle = '#8a4a6a'; c.fillRect(x - 2, y, 4, 14); c.beginPath(); c.arc(x, y - 4, 15, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,190,150,0.35)'; c.beginPath(); c.arc(x - 4, y - 9, 8, 0, TAU); c.fill(); }
  // the meadow
  const gr = c.createLinearGradient(0, 560, 0, h); gr.addColorStop(0, '#c8b048'); gr.addColorStop(1, '#8a8a30'); c.fillStyle = gr; c.beginPath(); c.moveTo(0, 566); for (let x = 0; x <= w; x += 10) c.lineTo(x, 562 + 4 * Math.sin(x * 0.07)); c.lineTo(w, h); c.lineTo(0, h); c.fill();
  let sd = 5; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  c.lineCap = 'round'; for (let i = 0; i < 140; i++) { const x = rnd() * w, y = 570 + rnd() * 70; c.strokeStyle = rnd() < 0.5 ? 'rgba(90,80,20,0.4)' : 'rgba(255,230,140,0.45)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - 0.5) * 6, y - 5 - rnd() * 8); c.stroke(); }
  // the big apple tree: a trunk on the right, branches across the top, and leafy clumps
  c.fillStyle = '#5a3424'; c.beginPath(); c.moveTo(326, 640); c.quadraticCurveTo(318, 420, 334, 250); c.lineTo(372, 250); c.lineTo(372, 640); c.fill();
  c.strokeStyle = '#5a3424'; c.lineWidth = 16; c.beginPath(); c.moveTo(350, 270); c.quadraticCurveTo(220, 150, 20, 176); c.stroke(); c.lineWidth = 9; c.beginPath(); c.moveTo(250, 196); c.quadraticCurveTo(210, 240, 140, 252); c.stroke();
  c.strokeStyle = 'rgba(255,190,140,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(340, 262); c.quadraticCurveTo(220, 146, 20, 170); c.stroke();
  const clumps = [[20, 120, 70], [100, 96, 66], [190, 110, 72], [276, 100, 70], [350, 140, 68], [60, 172, 46], [150, 168, 44], [240, 172, 48], [320, 210, 50], [8, 220, 40], [110, 240, 34], [200, 248, 30], [290, 252, 36]];
  for (const [x, y, r] of clumps) { c.fillStyle = '#2e4a2a'; c.beginPath(); c.arc(x + 4, y + 8, r, 0, TAU); c.fill(); }
  for (const [x, y, r] of clumps) { const lg = c.createRadialGradient(x - r * 0.4, y - r * 0.5, 4, x, y, r); lg.addColorStop(0, '#9ab84a'); lg.addColorStop(0.6, '#5a8a3a'); lg.addColorStop(1, '#3a6a30'); c.fillStyle = lg; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  for (let i = 0; i < 90; i++) { const [x, y, r] = clumps[i % clumps.length], a = rnd() * TAU, d = rnd() * r; c.fillStyle = ['rgba(240,170,60,0.55)', 'rgba(200,220,110,0.5)', 'rgba(220,90,50,0.45)'][i % 3]; c.beginPath(); c.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, 5, 3, a, 0, TAU); c.fill(); }
}
// an apple with a term on it; r is the radius
function apple(c, x, y, r, cols, rot) {
  c.save(); c.translate(x, y); c.rotate(rot);
  const g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.15, 0, 0, r * 1.1); g.addColorStop(0, P.shade(cols[0], 0.25)); g.addColorStop(0.7, cols[0]); g.addColorStop(1, cols[1]);
  c.fillStyle = g; c.beginPath(); c.moveTo(0, -r * 0.72); c.bezierCurveTo(r * 0.5, -r * 1.12, r * 1.18, -r * 0.6, r * 1.02, r * 0.2); c.bezierCurveTo(r * 0.9, r * 0.9, r * 0.35, r * 1.05, 0, r * 0.9); c.bezierCurveTo(-r * 0.35, r * 1.05, -r * 0.9, r * 0.9, -r * 1.02, r * 0.2); c.bezierCurveTo(-r * 1.18, -r * 0.6, -r * 0.5, -r * 1.12, 0, -r * 0.72); c.fill();
  c.strokeStyle = 'rgba(58,22,64,0.45)'; c.lineWidth = 1.6; c.stroke();
  c.strokeStyle = '#5a3424'; c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -r * 0.7); c.quadraticCurveTo(1, -r * 0.95, 3, -r * 1.12); c.stroke();
  c.fillStyle = '#5aa83a'; c.beginPath(); c.ellipse(r * 0.32, -r * 0.98, r * 0.3, r * 0.13, -0.5, 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-r * 0.5, -r * 0.35, r * 0.16, r * 0.26, 0.5, 0, TAU); c.fill();
  c.restore();
}
function drawTerm(g, c, node, x, y, maxW, s0, col) {
  let s = s0, m = M.lay(node, s); if (m.w > maxW) { s = s0 * maxW / m.w; m = M.lay(node, s); }
  M.draw(c, node, x - m.w / 2, y + (m.a - m.d) / 2, s, { t: g.t, col });
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

MG.add({
  id: 'like', stage: 'letters', cmd: 'LIKE TERMS!', hint: 'drag', time: 10, mood: 'bright', winText: 'Combined!', hold: 1.4, cardY: 420,
  card: {
    title: 'Like terms', ref: 'Grade 6', kind: 'Expressions',
    text: 'A term is one part of an expression that is added or subtracted, such as 3x, 5 or x². The number in front of the letters is called the coefficient. Like terms have exactly the same letter part: 3x and 5x are like terms, and so are 2y and 7y.\n\nTo add like terms, add their coefficients and keep the letter part. For example, 3x + 5x = 8x, and 3x − 2x + x = 2x.\n\nThis works because 3x means three x\'s and 5x means five x\'s, so together they make eight x\'s. But x and x² are not like terms. x² means x times x, which is a different amount, just as 3 apples and 5 pears do not make 8 apples.',
    note: 'Like terms have the same letters with the same powers. Add them by adding their coefficients: 3x + 5x = 8x.',
    ask: 'Combine the like terms in 4y + 3 + 2y. Are 2x and 2x² like terms?',
  },
  init(g) {
    const S = g.s, K = M.setup(g); Object.assign(S, pickProblem(g));
    const L = g.level, sf = 1 + (g.speed - 1) * 0.35;
    S.gap = GAP[L] / sf; S.fall = FALL[L] / sf; S.hang = HANG / sf; S.acc = 2 * (RIM - SPAWN_Y) / (S.fall * S.fall);
    S.T = M.pace(g); S.likes = S.terms.filter(q => q.like); S.sum = S.likes.reduce((p, q) => p + q.c, 0);
    S.queue = S.terms.slice(); S.nextSpawn = 0.75 / sf; S.apples = []; S.total = null; S.caught = []; S.bx = 180; S.tx = 180; S.lastMoveT = 0;
    S.fox = { x: 112, face: 1 }; S.bubble = null; S.done = null; S.answered = null; S.lastX = null; S.colI = Math.floor(g.rand() * 3);
    // the fuse: the drop schedule takes a fixed time, so the base time is set so that catching every term the first time
    // earns 3 stars. The level's generous time factor (g.tf) stretches only the slack beyond the schedule, not the
    // schedule itself, so the fuse stays reasonable at level 0 (about 33 s instead of 60 s); g.tf is set to match, so
    // the stars still compare the time taken with the base time.
    const need = 0.75 / sf + S.terms.length * S.gap + S.hang + S.fall + 0.4, base = need / 0.58;
    g.dur = need + (base - need) * (g.tf || 1); g.tf = g.dur / base;
    M.zone(g, 'basket', { x: 180, y: RIM + 20, w: 110, h: 60 });
    S.signNode = exprNode(S.terms, 't'); placeSign(g, S.signNode);
    M.inert(g, S.terms.map((q, i) => 'o' + i));
    M.play(g, {
      moves(g) { return S.answered ? [] : [{ drag: 'basket', to: 'basket' }]; },
      area(g) { return 'basket'; },
      onWin(g) { S.winAt = g.t; g.sfx('magic'); },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk, t = g.t; M.update(g, dt);
    S.bx = lerp(S.bx, S.tx, 1 - Math.exp(-dt * 26)); M.zone(g, 'basket', { x: S.bx, y: RIM + 20, w: 110, h: 60 });
    // the fox trots beside the basket, on the side with more room
    const side = S.bx > 150 ? -1 : 1, fx = S.bx + side * 70; S.fox.vx = (fx - S.fox.x) / Math.max(dt, 1e-3); S.fox.x = lerp(S.fox.x, fx, 1 - Math.exp(-dt * 10)); S.fox.face = -side;
    if (!S.done && !g.done) {
      if (S.queue.length && t >= S.nextSpawn && !S.apples.some(a => a.state === 'hang')) spawn(g);
    }
    for (const a of S.apples) stepApple(g, a, dt);
    S.apples = S.apples.filter(a => a.state !== 'gone');
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (Math.abs(x - SIGN.x) < SIGN.w / 2 && Math.abs(y - SIGN.y) < SIGN.h / 2 + 8) { S.signWig = g.t; g.sfx('tap'); return; } // the sign only sways
    S.drag = true; S.tx = clamp(x, 52, 308); S.lastMoveT = g.t;
  },
  move(g, x, y) { const S = g.s; if (!S.drag || g.done) return; S.tx = clamp(x, 52, 308); S.lastMoveT = g.t; },
  up(g, x, y) { g.s.drag = false; },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (S.botDown) { synth('up', S.botX, 560); S.botDown = false; } if (!K.ask.closing) M.auto(g, dt, synth); return; }
    const a = nextLike(S);
    if (!a || S.done) { if (S.botDown) { synth('up', S.botX, 560); S.botDown = false; } return; }
    const bx = S.botX ?? S.bx, nx = bx + clamp(a.x - bx, -650 * dt, 650 * dt); S.botX = nx;
    if (!S.botDown) { synth('down', nx, 570); S.botDown = true; } else synth('move', nx, 570);
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('letters_like_orchard', orchard), 0, 0, W, H);
    ambient(c, t);
    drawSign(g, c, S);
    drawGuide(g, c, S);
    for (const a of S.apples) if (a.state !== 'in') drawApple(g, c, S, a);
    drawFox(g, c, S);
    drawBasket(g, c, S);
    for (const a of S.apples) if (a.state === 'bounce') drawApple(g, c, S, a);
    drawBubble(g, c, S);
    M.drawAnims(g, c); M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

function placeSign(g, node) {
  let s = 27; const w = M.lay(node, s).w; if (w > SIGN.w - 36) s *= (SIGN.w - 36) / w;
  M.place(g, 'sign', node, SIGN.x, SIGN.y + s * 0.3, s, { col: '#fff4dc' });
}
// ---------------- apples ----------------
function spawn(g) {
  const S = g.s, q = S.queue.shift(); let x;
  // never right above the basket: the player always has to move it (and a basket left alone catches nothing)
  for (let k = 0; k < 40; k++) { x = 50 + g.rand() * 260; if (Math.abs(x - S.tx) > CATCH[g.level] + 34 && (S.lastX == null || Math.abs(x - S.lastX) > 95 || k > 25)) break; }
  S.lastX = x; S.nextSpawn = g.t + S.gap; S.colI = (S.colI + 1 + Math.floor(g.rand() * 2)) % 3;
  S.apples.push({ q, x, y: SPAWN_Y, vy: 0, state: 'hang', t0: g.t, rot: 0, spin: 0, cols: APPLES[S.colI] });
  const n = M.node(g, 't' + q.i); if (n) n.pop = g.t;
  g.sfx('rustle');
}
function stepApple(g, a, dt) {
  const S = g.s, t = g.t, K = S.mk;
  if (a.state === 'hang') { if (t - a.t0 >= S.hang) { a.state = 'fall'; a.t0 = t; } return; }
  if (a.state === 'fall') {
    const y0 = a.y; a.vy += S.acc * dt; a.y += a.vy * dt; a.rot = Math.sin(t * 3 + a.x) * 0.15;
    if (y0 < RIM && a.y >= RIM && Math.abs(a.x - S.bx) < CATCH[g.level] && !S.done) {
      if (a.q.like) catchLike(g, a);
      else { // an unlike term bounces out of the basket: boing!
        a.state = 'bounce'; a.vy = -420; a.vx = (a.x >= S.bx ? 1 : -1) * (150 + g.rand() * 60); a.spin = a.vx > 0 ? 9 : -9; a.y = RIM - 4; a.badAt = t;
        S.ohAt = t; S.wobAt = t; K.wrong = (K.wrong || 0) + 1; K.missAt = t; g.sfx('boing'); g.float('boing!', a.x, RIM - 50, '#fff6dc', 22);
      }
      return;
    }
    if (a.y >= GROUND - AR * 0.8) { // missed: it bounces on the grass
      a.y = GROUND - AR * 0.8; a.state = 'ground'; a.t0 = t; a.vy = -150; g.sfx('thud');
      if (a.q.like) { // a like term grows back on the tree and falls again
        S.queue.push(a.q); S.nextSpawn = Math.max(S.nextSpawn, t + 0.35); if (S.queue.length === 1) S.nextSpawn = t + 0.35;
      } else { const n = M.node(g, 't' + a.q.i); if (n) n.alpha = 0.45; }
    }
    return;
  }
  if (a.state === 'bounce') { a.vy += 1100 * dt; a.y += a.vy * dt; a.x += a.vx * dt; a.rot += a.spin * dt; if (a.y > H + 40 || a.x < -40 || a.x > W + 40) { a.state = 'gone'; const n = M.node(g, 't' + a.q.i); if (n) n.alpha = 0.45; } return; }
  if (a.state === 'ground') { a.vy += 900 * dt; a.y = Math.min(GROUND - AR * 0.8, a.y + a.vy * dt); if (t - a.t0 > 0.7) a.state = 'gone'; return; }
  if (a.state === 'drop') { const k = (t - a.t0) / 0.16; a.y = lerp(RIM, RIM + 12, ease(k)); if (k >= 1) a.state = 'in'; }
}
function catchLike(g, a) {
  const S = g.s, K = S.mk, t = g.t, q = a.q, prev = S.total;
  a.state = 'drop'; a.t0 = t; a.y = RIM; S.caught.push(q); S.total = (S.total || 0) + q.c; a.slot = S.caught.length - 1;
  S.hopAt = t; S.lastMoveT = t; K.lastMove = t; g.sfx('pop'); g.sfx('coin'); g.burst(S.bx, RIM, ['#ffd45a', '#fff6c0', '#9ae07a'], 10, 120);
  const n = M.node(g, 't' + q.i); if (n) { n.col = '#c8ffb0'; n.pop = t; }
  const med = g.mode === 'medium';
  // the running sum, right above the basket: 3x + (−2x) = x
  if (prev != null) {
    const add = q.c < 0 ? M.paren(termNode(q.c, q.v)) : termNode(q.c, q.v);
    S.bubble = { node: med ? M.row(M.op('+'), add) : M.row(termNode(prev, q.v), M.op('+'), add, M.op('='), totalNode(S.total, q.v)), t0: t }; S.bubble.node.write = { t0: t, dur: 0.3 * S.T };
  }
  S.totalPop = t;
  if (S.caught.length === S.likes.length) finishCatch(g);
}
const totalNode = (s, v) => s === 0 ? M.num(0) : termNode(s, v);
function sumNode(S, ans) { // 3x − 2x + x = 2x
  const r = exprNode(S.caught.map(q => ({ c: q.c, v: q.v })));
  return M.row(r, M.op('='), ans ? totalNode(S.sum, S.kind) : M.row(M.txt('?'), S.sum === 1 ? null : letters(S.kind)));
}
function finishCatch(g) {
  const S = g.s, K = S.mk, t = g.t, T = S.T; S.done = t;
  if (g.mode === 'medium') {
    K.busyT = 1e9; S.bubble = { node: sumNode(S, false), t0: t + 0.2 * T, final: true };
    const others = S.terms.filter(q => !q.like).map(q => q.c), abs = S.likes.reduce((p, q) => p + Math.abs(q.c), 0);
    M.later(g, 0.35 * T, g => M.openAsk(g, { ask: { v: S.sum, wrong: [abs, S.sum + others[others.length - 1], S.likes.length, -S.sum, S.sum + 1] }, after: combineLen(T),
      resolve(g) { S.answered = g.t; S.bubble = { node: sumNode(S, true), t0: g.t, final: true }; S.totalPop = g.t; g.sfx('sparkle'); combine(g); } }));
  } else { S.answered = t; S.bubble = { node: sumNode(S, true), t0: t + 0.2 * T, final: true }; S.bubble.node.write = { t0: t + 0.2 * T, dur: 0.35 * T }; M.show(g, 0.5 * T); M.at(g, [[0.5 * T, combine]]); }
}
// the combining, acted out on the sign: the like terms slide together, then become one term that flies up from the basket
const combineLen = T => 1.75 * T;
function combine(g) {
  const S = g.s, T = S.T, row = S.signNode, it = row.items; M.show(g, combineLen(T)); S.combAt = g.t;
  // the sign's nodes, term by term: term i is it[2i], and its sign is it[2i − 1]
  const term = i => it[2 * i], sign = i => i ? it[2 * i - 1] : null, likeI = S.terms.filter(q => q.like).map(q => q.i), restI = S.terms.filter(q => !q.like).map(q => q.i);
  const likeNodes = likeI.flatMap(i => [sign(i), term(i)]).filter(Boolean);
  M.at(g, [
    [0, g => { likeI.forEach((i, k) => M.circle(g, term(i), { delay: k * 0.08 * T, dur: 0.5 * T, col: '#c8ffb0' })); g.sfx('sparkle'); S.hopAt = g.t; }],
    // the like terms slide together to the front (the first term is always a like term with a positive coefficient)
    [0.42 * T, g => { row.items = [...likeI.flatMap(i => [sign(i), term(i)]).filter(Boolean), ...restI.flatMap(i => [sign(i), term(i)])]; placeSign(g, row); g.sfx('swoosh'); }],
    [0.85 * T, g => { // they squeeze into one spot, while the basket's total flies up to land there
      const bs = likeNodes.map(n => M.box(g, n.id)).filter(Boolean), mid = bs.length ? (Math.min(...bs.map(b => b.x - b.w / 2)) + Math.max(...bs.map(b => b.x + b.w / 2))) / 2 : SIGN.x;
      for (const n of likeNodes) { const b = M.box(g, n.id); if (b) M.tween(g, n, { dx: mid - b.x, sc: 0.4, alpha: 0 }, 0.35 * T); }
      if (S.bubble) S.bubble.out = g.t;
      M.fly(g, { node: totalNode(S.sum, S.kind), col: '#c8ffb0', from: [S.bx, RIM + 30], to: [mid, SIGN.y], dur: 0.48 * T, arc: 70, s0: 24, s1: 27,
        then(g) { const hide = n => { if (!n) return; n.alpha = 0; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) hide(ch); }; likeNodes.forEach(hide); // squeezed away: no ghosts
          const nn = termNode(S.sum, S.kind, 'sum', { col: '#c8ffb0', _born: -1, pop: g.t }); (function born(n) { if (!n) return; n._born = -1; for (const ch of [n.base, n.exp, ...(n.items || [])]) born(ch); })(nn); // it lands from the flight: no fade-in
          row.items = [nn, ...restI.flatMap(i => [sign(i), term(i)])]; placeSign(g, row); S.combined = g.t;
          M.sparkle(g, 'sum', { n: 14, cols: ['#c8ffb0', '#fff', '#ffe27a'] }); g.sfx('ding'); S.hopAt = g.t; } }); S.hopAt = g.t; }],
  ]);
}
function nextLike(S) { // the like apple that will land soonest
  let best = null, bt = 1e9;
  for (const a of S.apples) { if (!a.q.like || (a.state !== 'fall' && a.state !== 'hang')) continue; const eta = a.state === 'hang' ? 1e3 + a.t0 : (RIM - a.y); if (eta < bt) { bt = eta; best = a; } }
  return best;
}

// ---------------- drawing ----------------
function ambient(c, t) {
  // falling leaves
  for (let i = 0; i < 7; i++) { const x = (i * 59 + t * 18 + Math.sin(t * 1.3 + i) * 24) % 380 - 10, y = (i * 83 + t * 34) % 420 + 200; c.save(); c.translate(x, y); c.rotate(t * 2 + i); c.fillStyle = ['#e8903a', '#c8502a', '#d8b040'][i % 3]; c.beginPath(); c.ellipse(0, 0, 6, 3, 0, 0, TAU); c.fill(); c.restore(); }
  // two birds far away
  for (let i = 0; i < 2; i++) { const x = ((t * (16 + i * 6) + i * 170) % 420) - 30, y = 330 + i * 30 + Math.sin(t * 2 + i) * 5, f = Math.sin(t * 8 + i) * 4; c.strokeStyle = 'rgba(90,40,70,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 7, y - f); c.quadraticCurveTo(x - 3, y - 3, x, y); c.quadraticCurveTo(x + 3, y - 3, x + 7, y - f); c.stroke(); }
}
function drawSign(g, c, S) {
  const t = g.t, wig = S.signWig != null && t - S.signWig < 0.5 ? Math.sin((t - S.signWig) * 22) * 0.05 * (1 - (t - S.signWig) / 0.5) : 0, sway = Math.sin(t * 1.1) * 0.012 + wig;
  c.save(); c.translate(SIGN.x, SIGN.y - 44); c.rotate(sway); c.translate(-SIGN.x, -(SIGN.y - 44));
  const x0 = SIGN.x - SIGN.w / 2, y0 = SIGN.y - SIGN.h / 2;
  c.strokeStyle = '#d8c090'; c.lineWidth = 2.5; for (const px of [x0 + 34, x0 + SIGN.w - 34]) { c.beginPath(); c.moveTo(px, y0 - 26); c.lineTo(px, y0 + 4); c.stroke(); }
  c.fillStyle = 'rgba(40,20,10,0.35)'; rr(c, x0 + 3, y0 + 6, SIGN.w, SIGN.h, 10); c.fill();
  const wg = c.createLinearGradient(0, y0, 0, y0 + SIGN.h); wg.addColorStop(0, '#9a6438'); wg.addColorStop(1, '#6a3e20'); c.fillStyle = wg; rr(c, x0, y0, SIGN.w, SIGN.h, 10); c.fill();
  c.strokeStyle = 'rgba(40,20,8,0.35)'; c.lineWidth = 1.4; for (let k = 1; k < 3; k++) { c.beginPath(); c.moveTo(x0 + 10, y0 + k * SIGN.h / 3); c.bezierCurveTo(x0 + 110, y0 + k * SIGN.h / 3 + 3, x0 + 220, y0 + k * SIGN.h / 3 - 3, x0 + SIGN.w - 10, y0 + k * SIGN.h / 3); c.stroke(); }
  c.fillStyle = '#d8c090'; for (const px of [x0 + 34, x0 + SIGN.w - 34]) { c.beginPath(); c.arc(px, y0 + 6, 3.2, 0, TAU); c.fill(); }
  // a soft halo behind each like term that is already in the basket
  for (const q of S.caught) { const b = M.box(g, 't' + q.i); if (!b || S.combAt != null) continue; c.fillStyle = 'rgba(140,230,120,0.22)'; rr(c, b.x - b.w / 2 - 5, b.y - b.h / 2 - 4, b.w + 10, b.h + 8, 8); c.fill(); }
  M.drawEx(g, c, 'sign');
  c.restore();
}
function drawApple(g, c, S, a) {
  const t = g.t; let x = a.x, y = a.y, s = 1, alpha = 1;
  if (a.state === 'hang') { const k = clamp((t - a.t0) / 0.18, 0, 1); s = ease(k); a.rot = Math.sin(t * 18) * 0.12 * (1 - (t - a.t0) / S.hang); c.strokeStyle = '#5a3424'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 2, SPAWN_Y - 34); c.lineTo(x + 2, y - AR * 0.95); c.stroke(); }
  if (a.state === 'ground') alpha = clamp(1 - (t - a.t0 - 0.35) / 0.35, 0, 1);
  if (a.state === 'drop') { s = lerp(1, 0.62, ease((t - a.t0) / 0.16)); }
  c.save(); c.globalAlpha = alpha; c.translate(x, y); c.scale(s, s);
  if (a.state === 'fall' || a.state === 'hang') { c.fillStyle = 'rgba(40,20,30,0.18)'; c.beginPath(); c.ellipse(0, GROUND - y + 6, AR * 0.8 * clamp(1 - (GROUND - y) / 500, 0.3, 1), 4, 0, 0, TAU); c.fill(); }
  apple(c, 0, 0, AR, a.cols, a.rot);
  c.rotate(a.rot); const bad = a.state === 'bounce' && t - a.badAt < 0.5;
  drawTerm(g, c, termNode(a.q.c, a.q.v), 0, 2, AR * 1.6, 22, bad ? '#ffffff' : a.cols[2]);
  if (bad) { c.strokeStyle = `rgba(255,80,90,${1 - (t - a.badAt) / 0.5})`; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, AR + 5, 0, TAU); c.stroke(); }
  c.restore();
}
function drawBasket(g, c, S) {
  const t = g.t, bx = S.bx, wob = S.wobAt != null && t - S.wobAt < 0.4 ? Math.sin((t - S.wobAt) * 40) * 0.07 * (1 - (t - S.wobAt) / 0.4) : 0;
  const hk = S.hopAt != null ? (t - S.hopAt) / 0.25 : 1, squash = hk < 1 ? Math.sin(hk * Math.PI) * 0.08 : 0;
  c.save(); c.translate(bx, GROUND); c.rotate(wob); c.scale(1 + squash, 1 - squash); c.translate(-bx, -GROUND);
  const w = 104, top = RIM, bot = GROUND - 2;
  c.fillStyle = 'rgba(40,20,10,0.28)'; c.beginPath(); c.ellipse(bx, GROUND + 2, w * 0.5, 7, 0, 0, TAU); c.fill();
  // back of the rim, then the apples inside, then the body
  c.fillStyle = '#7a4a22'; c.beginPath(); c.ellipse(bx, top, w / 2, 11, 0, Math.PI, TAU); c.fill();
  const inside = S.apples.filter(a => a.state === 'in' || a.state === 'drop');
  inside.forEach((a, i) => { if (a.state === 'drop') return; const k = a.slot ?? i, px = bx + ((k % 4) - 1.5) * 22, py = top + 4 - Math.floor(k / 4) * 9 - (k % 2) * 3; apple(c, px, py, 14, a.cols, (k % 3 - 1) * 0.3); });
  for (const a of inside) if (a.state === 'drop') { c.save(); const s = lerp(1, 0.62, ease((t - a.t0) / 0.16)); c.translate(lerp(a.x, bx, ease((t - a.t0) / 0.16)), a.y); c.scale(s, s); apple(c, 0, 0, AR, a.cols, 0); c.restore(); }
  const bg = c.createLinearGradient(0, top, 0, bot); bg.addColorStop(0, '#d8a050'); bg.addColorStop(1, '#a86a2a'); c.fillStyle = bg;
  c.beginPath(); c.moveTo(bx - w / 2, top); c.lineTo(bx + w / 2, top); c.lineTo(bx + w / 2 - 12, bot); c.quadraticCurveTo(bx, bot + 6, bx - w / 2 + 12, bot); c.closePath(); c.fill();
  c.save(); c.clip(); c.strokeStyle = 'rgba(110,60,20,0.5)'; c.lineWidth = 2; for (let y = top + 7; y < bot; y += 9) { c.beginPath(); c.moveTo(bx - w / 2, y); c.lineTo(bx + w / 2, y); c.stroke(); }
  c.strokeStyle = 'rgba(255,230,170,0.35)'; for (let x = bx - w / 2 + 6; x < bx + w / 2; x += 12) { c.beginPath(); c.moveTo(x, top); c.lineTo(x + (bx - x) * 0.12, bot); c.stroke(); } c.restore();
  c.strokeStyle = '#6a3a18'; c.lineWidth = 6; c.beginPath(); c.ellipse(bx, top, w / 2, 11, 0, 0, Math.PI); c.stroke(); c.strokeStyle = '#e8b868'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(bx, top - 1, w / 2, 11, 0, 0.1, Math.PI - 0.1); c.stroke();
  // the front band shows the total so far; the tag on the left names the letter part this basket collects
  const by = top + 30; c.fillStyle = '#fff4dc'; rr(c, bx - 40, by - 16, 80, 32, 10); c.fill(); c.strokeStyle = '#8a5a2a'; c.lineWidth = 2; c.stroke();
  const pk = S.totalPop != null ? clamp((t - S.totalPop) / 0.3, 0, 1) : 1, pop = 1 + Math.sin(pk * Math.PI) * 0.25;
  c.save(); c.translate(bx, by); c.scale(pop, pop);
  const med = g.mode === 'medium' && !S.answered;
  if (S.total != null) drawTerm(g, c, med ? M.row(M.txt('?'), letters(S.kind)) : totalNode(S.answered ? S.sum : S.total, S.kind), 0, 1, 72, 24, '#3a1640');
  c.restore();
  const tx = bx - w / 2 - 6, ty = top + 8; c.strokeStyle = '#8a5a2a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx - w / 2 + 8, top + 2); c.lineTo(tx + 4, ty - 12); c.stroke();
  c.save(); c.translate(tx, ty); c.rotate(-0.18); c.fillStyle = '#ffe9a8'; c.beginPath(); c.moveTo(-18, -12); c.lineTo(14, -12); c.lineTo(20, 0); c.lineTo(14, 12); c.lineTo(-18, 12); c.closePath(); c.fill(); c.strokeStyle = '#a8742a'; c.lineWidth = 1.8; c.stroke();
  c.fillStyle = '#a8742a'; c.beginPath(); c.arc(13, 0, 2.2, 0, TAU); c.fill(); drawTerm(g, c, letters(S.kind), -3, 1, 28, 21, '#6a2a14'); c.restore();
  c.restore();
}
function drawBubble(g, c, S) {
  const B = S.bubble; if (!B) return; const t = g.t, k = (t - B.t0); if (k < 0) return;
  if (!B.final && k > 1.1) return;
  const node = B.node, s = B.final ? 26 : 22, m = M.lay(node, s), x = B.final ? 180 : clamp(S.bx, m.w / 2 + 20, W - m.w / 2 - 20), y = B.final ? 478 : RIM - 66;
  const a = (B.final ? clamp(k / 0.15, 0, 1) : clamp(k / 0.1, 0, 1) * clamp((1.1 - k) / 0.2, 0, 1)) * (B.out != null ? clamp(1 - (t - B.out) / 0.25, 0, 1) : 1), pop = 1 + Math.sin(clamp(k / 0.25, 0, 1) * Math.PI) * 0.15;
  c.save(); c.globalAlpha = a; c.translate(x, y - (B.final ? 0 : k * 10)); c.scale(pop, pop);
  if (B.final && (S.answered || g.done)) { c.shadowColor = '#ffe27a'; c.shadowBlur = 18; }
  c.fillStyle = 'rgba(255,250,236,0.95)'; rr(c, -m.w / 2 - 14, -m.a - 8, m.w + 28, m.a + m.d + 16, 16); c.fill(); c.shadowBlur = 0; c.strokeStyle = B.final ? '#d89a3a' : 'rgba(138,90,42,0.6)'; c.lineWidth = 2.5; c.stroke();
  if (!B.final) { c.fillStyle = 'rgba(255,250,236,0.95)'; c.beginPath(); c.moveTo(-8, m.d + 7); c.lineTo(0, m.d + 18); c.lineTo(8, m.d + 7); c.fill(); }
  M.draw(c, node, -m.w / 2, (m.a - m.d) / 2, s, { t, col: '#3a1640' });
  c.restore();
}
function drawFox(g, c, S) {
  const t = g.t, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', f = S.fox;
  const hop = S.hopAt != null && t - S.hopAt < 0.35 ? Math.sin((t - S.hopAt) / 0.35 * Math.PI) : 0, oh = S.ohAt != null && t - S.ohAt < 0.8, moving = Math.abs(f.vx || 0) > 40;
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : oh ? 'wave' : moving ? 'walk' : 'idle';
  const expr = won ? 'laugh' : lost ? 'sad' : oh ? (t - S.ohAt < 0.3 ? 'wow' : 'laugh') : hop > 0 ? 'happy' : 'happy';
  try { if (typeof ANI !== 'undefined') { ANI.draw(c, 'fox', f.x, GROUND + 2 - hop * 14, 1.05, { t, pose, expr, facing: f.face }); return; } } catch (e) { }
  P.sheep(c, f.x, GROUND, 0.9, { t });
}
function drawGuide(g, c, S) {
  const t = g.t, K = S.mk, failed = g.done && g.result === 'fail';
  if (failed) { // the like terms on the sign glow, and the sum they make shows above the basket
    if (t - g.doneAt < 0.3) return;
    for (const q of S.likes) { const b = M.box(g, 't' + q.i); if (b) M.glowBox(c, b, t, 0.8); }
    if (!S.bubble || !S.bubble.final) { const r = exprNode(S.likes.map(q => ({ c: q.c, v: q.v }))); S.bubble = { node: M.row(r, M.op('='), totalNode(S.sum, S.kind)), t0: t, final: true }; }
    return;
  }
  if (g.done || S.done || (K.ask && !K.ask.closing)) return;
  M.glowBox(c, { x: S.bx, y: RIM + 26, w: 96, h: 50 }, t, 0.55); // the basket always glows: it is the thing to move
  const a = nextLike(S); if (!a || a.state !== 'fall' && t - a.t0 < 0.1) return;
  if (g.level !== 0 && t - S.lastMoveT < 2) return; // the rest: level 0, or after a 2 s pause
  M.glowBox(c, { x: a.x, y: a.y, w: AR * 2, h: AR * 2 }, t, 0.9, true);
  c.save(); c.setLineDash([3, 7]); c.strokeStyle = 'rgba(255,246,200,0.7)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(a.x, a.y + AR + 4); c.lineTo(a.x, RIM - 6); c.stroke(); c.restore();
  if (Math.abs(a.x - S.bx) < 20) return;
  // a ghost hand slides the basket under the apple
  const per = 1.1, k = (t % per) / per, e = easeIO(clamp((k - 0.1) / 0.6, 0, 1)), hx = lerp(S.bx, a.x, e), fade = k > 0.85 ? (1 - k) / 0.15 : 1;
  c.save(); c.globalAlpha = 0.8 * fade; c.setLineDash([6, 8]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(S.bx, RIM + 30); c.lineTo(a.x, RIM + 30); c.stroke(); c.restore();
  c.save(); c.globalAlpha = fade; M.hand(c, hx + 2, RIM + 34, 1, k < 0.1 || k > 0.7 ? 1 : 0); c.restore();
}
