// derivs_zero.js — CONSTANT RULE! The derivative of a constant is 0, so the constants drop out of a derivative.
// A lantern festival on a pond at night: paper lanterns drift up into a plum sky and glow in the water. The problem,
// d/dx (4x³ + 7 − 2x + 9), is written in lantern light across the sky, and each of its terms floats below on its own
// lily pad. The player flicks away the terms whose derivative is 0, the constants (swipe them off the pad in any
// direction). A flicked constant spins away, turns into 0 and bursts into sparks that become a new star; a faint 0 stays
// on its pad. Flicking a term with x in it does not work: it stretches like rubber and boings back, and the frog laughs.
// Show your work: each flick writes "d/dx 7 = 0" by the pad while the constant spins away. When every constant is gone,
// the rest differentiate themselves one after another with the power rule (the term is circled, its power lifts off
// and drops in front, "3 × 4 = 12" writes itself by the pad, and 4x³ turns into 12x²; −2x → −2 the same way with the
// power 1), the empty pads sink, and the pads glide together into the answer: = 12x² − 2. No more input is needed.
// Level 0: three terms with one constant. Level 1: four terms with two constants.
// Level 2: five terms with constants in disguise: 5x⁰ (which is 5, because x⁰ = 1) and π.
// Medium mode: after the other terms are worked out, the linear term's pad shows "?", and the player picks its derivative from the tray.
//
// The flick is a continuous gesture, so this file handles down/move/up itself (like calc_tangent.js). It runs on
// MK.play: moves(g) returns one placeholder drag (the constants that are left) until the answer is shown, then an
// empty list, so MK.update awards the stars and wins through the kit's finish(). The tray is the kit's.
const M = MK;
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const WY = 268;                 // the far shore: the sky above, the pond below
const INKL = '#fff1e2';
const LANT = ['#ffb04a', '#ff8a5a', '#ffd46a', '#ff7a8a'];

// ---------------- the problem ----------------
// a term: { k: 'x' (a·xⁿ, n ≥ 1) | 'c' (a number) | 'x0' (a·x⁰) | 'pi', a: coefficient (signed), n: power }
function pick(g) {
  const R = arr => arr[Math.floor(g.rand() * arr.length)], sgn = () => (g.rand() < 0.4 ? -1 : 1);
  const L = g.level, out = [];
  const top = { k: 'x', a: R([2, 3, 4, 5]), n: L === 0 ? 2 : R([2, 3]) };
  const lin = { k: 'x', a: sgn() * R([2, 3, 4, 5, 6]), n: 1 };
  const cs = () => ({ k: 'c', a: sgn() * R([2, 3, 4, 5, 6, 7, 8, 9]), n: 0 });
  let rest;
  if (L === 0) rest = [lin, cs()];
  else if (L === 1) rest = [lin, cs(), cs()];
  else {
    const disguise = [{ k: 'x0', a: sgn() * R([2, 3, 5, 6, 8]), n: 0 }, { k: 'pi', a: 1, n: 0 }];
    rest = g.rand() < 0.5 ? [lin, ...disguise, cs()] : [lin, { k: 'x', a: sgn() * R([2, 3, 4]), n: top.n === 3 ? 2 : 3 }, R(disguise), cs()];
  }
  // the highest power leads; the other terms come in any order
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  out.push(top, ...rest);
  return out.map(q => ({ ...q, isC: q.k !== 'x' }));
}
// the term as an expression node; first = no leading "+"
function termNode(q, first) {
  const neg = q.a < 0, A = Math.abs(q.a), sign = first ? (neg ? [M.op('-')] : []) : [M.op(neg ? '-' : '+')];
  let body;
  if (q.k === 'c') body = [M.num(A)];
  else if (q.k === 'pi') body = [M.vr('π')];
  else if (q.k === 'x0') body = [M.num(A), M.sup(M.vr('x'), M.num(0))];
  else body = [A === 1 ? null : M.num(A), q.n === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(q.n))];
  return M.row(...sign, ...body);
}
// where a working note goes: above a pad, or below it for the lower row of two
const noteAt = (S, i) => { const p = S.pos[i], low = S.pos.some(q => q.y < p.y - 20); return [M.clamp(p.x, 70, 290), low ? p.y + 46 : p.y - 46]; };
// the derivative of a term (a·xⁿ → n·a·xⁿ⁻¹), as a term
const dTerm = q => q.isC ? { k: 'c', a: 0, n: 0 } : q.n === 1 ? { k: 'c', a: q.a, n: 0 } : { k: 'x', a: q.a * q.n, n: q.n - 1 };

// ---------------- the flick ----------------
function grab(g, x, y) {
  const S = g.s; let best = -1, bd = 1e9;
  S.terms.forEach((q, i) => { if (q.gone) return; const p = S.pos[i], dx = (x - p.x) / (p.w / 2 + 16), dy = (y - p.y + 6) / 40, d = dx * dx + dy * dy; if (d < 1 && d < bd) { bd = d; best = i; } });
  return best;
}
function fling(g, i, vx, vy) {
  const S = g.s, q = S.terms[i], p = S.pos[i];
  let sp = Math.hypot(vx, vy); if (sp < 900) { const k = 900 / Math.max(1, sp); vx *= k; vy *= k; if (!Number.isFinite(vx) || sp < 1) { vx = 0; vy = -900; } }
  q.gone = true; q.goneAt = g.t; q.fly = { x: p.x + q.dx, y: p.y + q.dy, vx, vy, spin: (vx >= 0 ? 1 : -1) * (5 + g.rand() * 4), t0: g.t };
  q.dx = 0; q.dy = 0; S.lastMoveT = g.t; S.frog.hopAt = g.t; S.frog.look = p.x;
  g.sfx('whoosh'); g.sfx('sparkle');
  // the working: "d/dx 7 = 0" writes itself by the pad while the constant spins away and turns into 0
  const T = M.pace(g), body = termNode({ ...q, a: Math.abs(q.a) }, true), arg = q.a < 0 ? M.paren(M.row(M.op('-'), body)) : body;
  if (!g.done) { M.show(g, 0.75 * T); S.point = true; M.later(g, 0.75 * T, g => { S.point = false; }); }
  M.note(g, { node: M.row(M.ddx('x'), M.gap(3), arg, M.op('='), M.num(0)), at: noteAt(S, i), s: 22, col: '#fff0b0', write: 0.3 * T, hold: 0.3 * T, fade: 0.2 * T });
  if (S.terms.every(r => !r.isC || r.gone)) M.later(g, 0.5 * T, flourish, true);
}
function boing(g, i) {
  const S = g.s, q = S.terms[i]; q.boingAt = g.t; q.bx = q.dx; q.by = q.dy; q.dx = 0; q.dy = 0;
  S.frog.laughAt = g.t; S.mk.wrong = (S.mk.wrong || 0) + 1; S.mk.missAt = g.t; g.sfx('boing'); g.sfx('stretch');
}
// every constant is gone: the rest differentiate themselves, the empty pads sink, and the answer gathers into a row
function flourish(g) {
  const S = g.s; if (S.flourishAt != null) return; S.flourishAt = g.t; g.sfx('magic');
  // the rest differentiate one after another, each acted out with the power rule: the term is circled, its power
  // lifts off and drops in front, "3 × 4 = 12" writes itself by the pad, and the term turns into its derivative
  const T = g.done ? 0.5 : M.pace(g), live = S.terms.map((q, i) => i).filter(i => !S.terms[i].isC), STEP = 0.78 * T;
  const work = live.filter(i => !(g.mode === 'medium' && S.terms[i].n === 1)), after = 0.1 * T + work.length * STEP;
  if (!g.done) { M.show(g, after + 0.4 * T); S.point = true; }
  work.forEach((i, k) => {
    const q = S.terms[i], p = S.pos[i], t0 = 0.1 * T + k * STEP, b = { x: p.x, y: p.y - 4, w: p.w - 18, h: 36 };
    M.circle(g, b, { delay: t0, dur: 0.4 * T, col: '#ffd46a' });
    M.later(g, t0 + 0.08 * T, g => { // the power lifts off the x and drops in front of the term
      const w = M.lay(q.node, S.sz).w; S.frog.hopAt = g.t; g.sfx('tap');
      M.fly(g, { node: M.num(q.n), from: [p.x + w / 2 - 4, p.y - 16], to: [p.x - w / 2 - 8, p.y - 2], dur: 0.3 * T, arc: -26, s0: S.sz * 0.62, s1: S.sz * 0.8, col: '#ffd46a' });
      const A = q.a < 0 ? M.paren(M.num(q.a)) : M.num(q.a), dv = q.a * q.n;
      M.note(g, { node: M.row(M.num(q.n), M.op('×'), A, M.op('='), M.num(dv)), at: noteAt(S, i), s: 22, col: '#fff0b0', delay: 0.2 * T, write: 0.25 * T, hold: 0.3 * T, fade: 0.18 * T });
    }, true);
    M.later(g, t0 + 0.5 * T, g => { q.d = true; q.dAt = g.t; g.sfx('pop'); S.frog.hopAt = g.t; g.burst(p.x, p.y - 8, ['#ffe8a0', '#ffb04a', '#fff'], 9, 110); }, true);
  });
  if (g.mode === 'medium') {
    const li = live.find(i => S.terms[i].n === 1), q = S.terms[li], b = q.a;
    M.later(g, after, g => {
      S.askI = li; S.askAt = g.t;
      M.openAsk(g, { ask: { v: b, wrong: [M.row(M.num(b), M.vr('x')), 0, -b, b + (b > 0 ? 1 : -1), 1] }, after: 0.05,
        resolve(g) { S.askI = null; q.d = true; q.dAt = g.t; g.sfx('coin'); M.show(g, 0.4 * T); gather(g); } });
      S.mk.busyT = 1e9;
    });
  } else M.later(g, after, gather);
}
function gather(g) {
  const S = g.s; S.gatherAt = g.t;
  // the answer row: "=" and then each derivative, centred under the problem
  // the answer row (pads included) is shrunk to fit the screen
  const live = S.terms.map((q, i) => i).filter(i => !S.terms[i].isC), nodes = live.map((i, k) => termNode(dTerm(S.terms[i]), k === 0)), eq = M.row(M.op('='));
  const width = z => M.lay(eq, z).w + nodes.reduce((p, n) => p + M.lay(n, z).w, 0) + z * 1.4 * live.length + 30;
  const sz = S.finSz = Math.min(32, 32 * 336 / width(32)), gap = sz * 1.4;
  const ws = nodes.map(n => M.lay(n, sz).w), we = M.lay(eq, sz).w, tot = we + ws.reduce((p, q) => p + q, 0) + gap * live.length;
  let x = 180 - tot / 2; S.eqPos = { x: x + we / 2 }; x += we + gap;
  live.forEach((i, k) => { S.terms[i].final = { x: x + ws[k] / 2, node: nodes[k] }; x += ws[k] + gap; });
  S.point = false; M.later(g, 0.34 * M.pace(g), g => { S.answered = true; }, true);
}

MG.add({
  id: 'constant', stage: 'derivs', cmd: 'CONSTANT RULE!', hint: 'swipe', time: 8, mood: 'night', winText: 'Zeroed!', hold: 1.4,
  card: {
    title: 'The constant rule', ref: 'Grade 11 and up', kind: 'Calculus',
    text: 'The derivative of a formula tells you how fast its value changes as x changes. A constant is a number on its own, with no x in it, such as 7. A constant never changes, so its derivative is 0.\n\nTo differentiate a sum, differentiate each term on its own, so the constants just drop out. For example, the derivative of 4x³ + 7 − 2x + 9 is 12x² + 0 − 2 + 0, which is 12x² − 2.\n\nHere is why. The graph of y = 7 is a flat line at height 7. A flat line has slope 0, and the derivative is the slope.\n\nSome constants are in disguise: π is a number, and 5x⁰ is just 5, because x⁰ = 1.',
    note: 'The derivative of any constant is 0. When you differentiate a sum, the constant terms disappear.',
    ask: 'What is the derivative of x² + 10? What is the derivative of 3x + π?',
  },
  init(g) {
    const S = g.s; M.setup(g); S.terms = pick(g);
    S.terms.forEach((q, i) => { q.node = termNode(q, i === 0); q.dx = 0; q.dy = 0; });
    // the problem across the sky
    const prob = M.row(M.ddx('x'), M.paren(M.row(...S.terms.map((q, i) => termNode(q, i === 0)))));
    const pw = M.lay(prob, 30).w; M.place(g, 'prob', prob, 180, 216, Math.min(30, 30 * 334 / pw), { col: '#ffe6c8' });
    // the pads: one row when it fits, otherwise two staggered rows read left to right
    const n = S.terms.length, sz = n > 4 ? 28 : 30; S.sz = sz;
    const ws = S.terms.map(q => M.lay(q.node, sz).w + 30), gap = 8, tot = ws.reduce((p, q) => p + q, 0) + gap * (n - 1);
    S.pos = [];
    if (tot <= 340) { let x = 180 - tot / 2; ws.forEach((w, i) => { S.pos.push({ x: x + w / 2, y: 370, w }); x += w + gap; }); }
    else { const step = (336 - ws[0] / 2 - ws[n - 1] / 2) / (n - 1); ws.forEach((w, i) => S.pos.push({ x: 12 + ws[0] / 2 + i * step, y: i % 2 ? 418 : 336, w })); }
    S.terms.forEach((q, i) => M.zone(g, 't' + i, { x: S.pos[i].x, y: S.pos[i].y - 6, w: S.pos[i].w, h: 60 }));
    S.sky = []; S.frog = { hopAt: -9, laughAt: -9, look: 180 }; S.lastMoveT = 0; S.grab = null;
    const nC = S.terms.filter(q => q.isC).length; g.dur *= (3.2 + 1.0 * nC) / 8;
    M.play(g, {
      moves(g) { if (S.answered) return []; const left = S.terms.map((q, i) => q.isC && !q.gone ? 't' + i : null).filter(Boolean); return [{ drag: left.length ? left : ['t0'], to: 'away' }]; },
      area(g) { const i = S.terms.findIndex(q => q.isC && !q.gone); return i < 0 ? null : 't' + i; },
      onWin(g) { S.winAt = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    for (const q of S.terms) {
      if (q.fly) { const f = q.fly; f.vy += 600 * dt; f.vx *= 0.985; f.x += f.vx * dt; f.y += f.vy * dt;
        if (!f.popped && g.t - f.t0 > 0.42) { f.popped = true; g.burst(f.x, f.y, ['#fff6c0', '#ffd46a', '#ff9ac0', '#fff'], 14, 150);
          S.sky.push({ x: clamp(f.x, 16, 344), y: clamp(f.y, 14, WY - 70), t0: g.t, ph: g.rand() * 6 }); } }
    }
    // after a timeout, every constant left flies off by itself so the answer can be shown
    if (g.done && g.result === 'fail' && !S.revealed && g.t - g.doneAt > 0.3) {
      S.revealed = true; S.terms.forEach((q, i) => { if (q.isC && !q.gone) fling(g, i, (S.pos[i].x - 180) * 4, -900); });
      if (S.flourishAt == null) M.later(g, 0.3, g => { flourish(g); });
    }
    S.terms.forEach((q, i) => { if (!q.gone) M.zone(g, 't' + i, { x: S.pos[i].x + q.dx, y: S.pos[i].y - 6 + q.dy, w: S.pos[i].w, h: 60 }); });
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (S.flourishAt != null || M.showing(g)) return;
    const i = grab(g, x, y); if (i < 0) return;
    const q = S.terms[i]; q.boingAt = null; S.grab = { i, x0: x, y0: y, hist: [[g.t, x, y]], moved: false }; S.frog.look = S.pos[i].x; g.sfx('tap');
  },
  move(g, x, y) {
    const S = g.s, G = S.grab; if (!G || g.done) return; const q = S.terms[G.i];
    G.hist.push([g.t, x, y]); if (G.hist.length > 8) G.hist.shift();
    const dx = x - G.x0, dy = y - G.y0; if (Math.hypot(dx, dy) > 6) G.moved = true;
    // a constant comes loose and follows the finger; a term with x is stuck to its pad and only stretches a little
    if (q.isC) { q.dx = dx; q.dy = dy; } else { const d = Math.hypot(dx, dy) || 1, k = 46 * Math.tanh(d / 90) / d; q.dx = dx * k; q.dy = dy * k; }
  },
  up(g, x, y) {
    const S = g.s, G = S.grab; S.grab = null; if (!G || g.done) return; const q = S.terms[G.i];
    G.hist.push([g.t, x, y]);
    const dx = x - G.x0, dy = y - G.y0, d = Math.hypot(dx, dy);
    // the finger's speed over the last tenth of a second
    let a = G.hist[0]; for (const h of G.hist) if (g.t - h[0] <= 0.1) { a = h; break; }
    const dtv = Math.max(1 / 60, g.t - a[0]), vx = (x - a[1]) / dtv, vy = (y - a[2]) / dtv, sp = Math.hypot(vx, vy);
    const flick = d > (g.level === 0 ? 44 : 56) || (sp > 420 && d > 16);
    if (q.isC) {
      if (flick) { fling(g, G.i, sp > 300 ? vx : dx * 12, sp > 300 ? vy : dy * 12); return; }
      q.bx = q.dx; q.by = q.dy; q.dx = 0; q.dy = 0; q.homeAt = g.t; if (!G.moved) { q.hopAt = g.t; S.hintAt = g.t; } return;
    }
    if (flick) { boing(g, G.i); return; }
    q.bx = q.dx; q.by = q.dy; q.dx = 0; q.dy = 0; q.homeAt = g.t; q.wobAt = g.t; g.sfx('boing'); S.frog.laughAt = g.t;
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.bot) { const b = S.bot, k = clamp((g.t - b.t0) / 0.14, 0, 1), x = b.x + b.dx * k, y = b.y + b.dy * k; synth('move', x, y); if (k >= 1) { synth('up', x, y); S.bot = null; S.botNext = g.t + 0.3; } return; }
    if (S.flourishAt != null || M.showing(g) || g.t < (S.botNext ?? 0.5)) return;
    const i = S.terms.findIndex(q => q.isC && !q.gone); if (i < 0) return;
    const p = S.pos[i]; synth('down', p.x, p.y - 6); S.bot = { t0: g.t, x: p.x, y: p.y - 6, dx: (p.x - 180) * 0.4, dy: -110 };
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('derivs_lanterns', lanternPond), 0, 0, W, H);
    ambient(c, t, S);
    // the problem, glowing in the sky
    c.save(); c.shadowColor = 'rgba(255,170,90,0.9)'; c.shadowBlur = 14; M.drawEx(g, c, 'prob'); c.restore();
    drawPads(g, c, S);
    drawGuide(g, c, S);
    drawFlying(g, c, S);
    drawFrog(g, c, S);
    M.drawAnims(g, c); M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

// ---------------- the world ----------------
function lanternPond(c, w, h) {
  const sky = c.createLinearGradient(0, 0, 0, WY); [[0, '#0e0824'], [0.35, '#24114a'], [0.7, '#5a1f62'], [0.92, '#b2486a'], [1, '#e2765e']].forEach(([k, col]) => sky.addColorStop(k, col));
  c.fillStyle = sky; c.fillRect(0, 0, w, WY + 2);
  const R = (() => { let s = 5; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,240,230,${0.2 + R() * 0.5})`; c.beginPath(); c.arc(R() * w, R() * R() * 200, R() * 1.1 + 0.3, 0, 7); c.fill(); }
  // a warm haze above the far shore
  const haze = c.createRadialGradient(180, WY, 10, 180, WY, 260); haze.addColorStop(0, 'rgba(255,170,110,0.5)'); haze.addColorStop(1, 'rgba(255,140,110,0)'); c.fillStyle = haze; c.fillRect(0, WY - 200, w, 200);
  // the far shore: hills, a little pavilion and willows in silhouette
  c.fillStyle = '#3a1640'; c.beginPath(); c.moveTo(0, WY); for (let x = 0; x <= w; x += 6) c.lineTo(x, WY - 18 - 10 * Math.sin(x * 0.018 + 1) - 5 * Math.sin(x * 0.06)); c.lineTo(w, WY); c.closePath(); c.fill();
  c.fillStyle = '#2a0f32';
  c.save(); c.translate(300, WY); c.scale(0.72, 0.72); c.translate(-268, -WY);
  c.fillRect(250, WY - 40, 4, 30); c.fillRect(282, WY - 40, 4, 30); c.beginPath(); c.moveTo(238, WY - 38); c.quadraticCurveTo(268, WY - 50, 298, WY - 38); c.lineTo(290, WY - 48); c.quadraticCurveTo(268, WY - 64, 246, WY - 48); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(254, WY - 56); c.quadraticCurveTo(268, WY - 66, 282, WY - 56); c.lineTo(268, WY - 74); c.closePath(); c.fill();
  c.fillStyle = '#ffcf7a'; c.fillRect(258, WY - 34, 7, 8); c.fillRect(271, WY - 34, 7, 8); c.restore();
  for (const [x, s] of [[34, 1], [92, 0.75], [346, 0.7]]) { c.beginPath(); c.ellipse(x, WY - 34 * s, 22 * s, 30 * s, 0, 0, 7); c.fill(); c.fillRect(x - 2, WY - 12, 4, 12);
    c.strokeStyle = '#2a0f32'; c.lineWidth = 1.4; for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(x + k * 6 * s, WY - 40 * s); c.quadraticCurveTo(x + k * 8 * s, WY - 20 * s, x + k * 9 * s, WY - 2); c.stroke(); } }
  // the pond
  const wg = c.createLinearGradient(0, WY, 0, h); wg.addColorStop(0, '#5a2a5e'); wg.addColorStop(0.15, '#2e1a4e'); wg.addColorStop(1, '#0c0a20'); c.fillStyle = wg; c.fillRect(0, WY, w, h - WY);
  c.fillStyle = 'rgba(255,200,170,0.35)'; c.fillRect(0, WY, w, 1.5);
  // the haze reflected
  for (let i = 0; i < 16; i++) { const y = WY + 4 + i * 7, ww = 160 - i * 9 + (i % 3) * 10; c.fillStyle = `rgba(255,170,120,${0.22 - i * 0.012})`; c.fillRect(180 - ww / 2, y, ww, 2); }
  // decorative pads and lotus flowers near the banks
  for (const [x, y, r] of [[30, 500, 30], [334, 488, 24], [300, 560, 34], [150, 600, 20], [20, 300, 16], [342, 300, 14]]) pad(c, x, y, r, false);
  for (const [x, y, s] of [[334, 480, 0.8], [20, 294, 0.6], [300, 548, 1]]) lotus(c, x, y, s);
}
function pad(c, x, y, r, lit) {
  c.fillStyle = 'rgba(6,4,20,0.45)'; c.beginPath(); c.ellipse(x + 3, y + 4, r, r * 0.4, 0, 0, 7); c.fill();
  const gr = c.createLinearGradient(0, y - r * 0.4, 0, y + r * 0.4); gr.addColorStop(0, lit ? '#6aa86a' : '#3e7a56'); gr.addColorStop(1, lit ? '#2c5a3e' : '#1e4234'); c.fillStyle = gr;
  c.beginPath(); c.ellipse(x, y, r, r * 0.4, 0, 0.35, Math.PI * 2 - 0.1); c.lineTo(x, y); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(20,50,30,0.6)'; c.lineWidth = 1; for (let k = 0; k < 6; k++) { const a = 0.8 + k * 0.9; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.34); c.stroke(); }
  c.strokeStyle = 'rgba(255,180,150,0.55)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, r, r * 0.4, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
}
function lotus(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const [a, l] of [[-1.1, 14], [-0.55, 17], [0, 19], [0.55, 17], [1.1, 14]]) { c.save(); c.rotate(a); const gr = c.createLinearGradient(0, -l, 0, 0); gr.addColorStop(0, '#ffd6e6'); gr.addColorStop(1, '#e86a9a'); c.fillStyle = gr; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-7, -l * 0.6, 0, -l); c.quadraticCurveTo(7, -l * 0.6, 0, 0); c.fill(); c.restore(); }
  c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(0, -3, 3, 0, 7); c.fill(); c.restore();
}
// a paper sky lantern with its flame
function lantern(c, x, y, s, col, t, ph) {
  const fl = 0.8 + 0.2 * Math.sin(t * 9 + ph);
  c.save(); c.translate(x, y); c.scale(s, s);
  const glow = c.createRadialGradient(0, 0, 2, 0, 0, 30); glow.addColorStop(0, P.rgba(col, 0.55 * fl)); glow.addColorStop(1, P.rgba(col, 0)); c.fillStyle = glow; c.fillRect(-30, -30, 60, 60);
  const gr = c.createLinearGradient(0, -12, 0, 12); gr.addColorStop(0, P.shade(col, 0.5)); gr.addColorStop(1, col); c.fillStyle = gr;
  c.beginPath(); c.moveTo(-8, -12); c.lineTo(8, -12); c.quadraticCurveTo(11, 0, 7, 11); c.lineTo(-7, 11); c.quadraticCurveTo(-11, 0, -8, -12); c.fill();
  c.fillStyle = `rgba(255,250,220,${0.6 * fl})`; c.beginPath(); c.ellipse(0, 6, 3, 4, 0, 0, 7); c.fill();
  c.strokeStyle = 'rgba(120,40,20,0.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -12); c.lineTo(0, 11); c.stroke();
  c.restore();
}
const LN = (() => { let s = 21; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; return [...Array(11)].map((_, i) => ({ x: r() * 360, sp: 6 + r() * 7, s: 0.45 + r() * 0.45, ph: r() * 6, off: r() * 300, col: LANT[i % 4] })); })();
function ambient(c, t, S) {
  // lanterns drift up the sky and wrap around; their light shimmers on the water
  for (const L of LN) {
    const y = WY - 30 - ((t * L.sp + L.off) % 300), x = L.x + Math.sin(t * 0.5 + L.ph) * 10;
    if (y > WY - 30) continue; const a = clamp((WY - 30 - y) / 40, 0, 1) * clamp((y + 20) / 60, 0, 1);
    c.save(); c.globalAlpha = a * 0.85; lantern(c, x, y, L.s, L.col, t, L.ph); c.restore();
    c.save(); c.globalAlpha = a * 0.22; c.fillStyle = L.col; for (let k = 0; k < 5; k++) { const yy = WY + 8 + (WY - y) * 0.35 + k * 6, ww = 10 * L.s * (1 - k * 0.15) + Math.sin(t * 3 + k + L.ph) * 2; c.fillRect(x - ww / 2, yy, ww, 1.5); } c.restore();
  }
  // the stars the flicked constants became
  for (const s of S.sky) { const k = clamp((t - s.t0) / 0.4, 0, 1), tw = 0.6 + 0.4 * Math.sin(t * 3 + s.ph); c.save(); c.globalAlpha = k * tw; c.fillStyle = '#fff2c0'; c.shadowColor = '#ffd46a'; c.shadowBlur = 10; star4(c, s.x, s.y, 2.2 + (1 - k) * 4); c.restore(); }
  // ripples drifting across the pond
  c.save(); c.strokeStyle = 'rgba(220,180,255,0.12)'; c.lineWidth = 1.2;
  for (let i = 0; i < 10; i++) { const y = WY + 20 + i * 34, off = (t * (8 + i * 2) + i * 70) % 440 - 60; c.beginPath(); c.moveTo(off, y); c.lineTo(off + 30 + i * 4, y); c.stroke(); }
  c.restore();
  // fireflies over the water
  for (let i = 0; i < 7; i++) { const x = (i * 59 + Math.sin(t * 0.6 + i) * 24 + 400) % 360, y = WY + 40 + (i * 53) % 260 + Math.sin(t * 1.3 + i) * 8, a = 0.3 + 0.6 * Math.max(0, Math.sin(t * 2.4 + i * 1.9));
    c.fillStyle = `rgba(255,236,150,${a})`; c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); }
}
function star4(c, x, y, r) { c.beginPath(); c.moveTo(x, y - r * 2); c.quadraticCurveTo(x, y, x + r * 2, y); c.quadraticCurveTo(x, y, x, y + r * 2); c.quadraticCurveTo(x, y, x - r * 2, y); c.quadraticCurveTo(x, y, x, y - r * 2); c.fill(); }

// ---------------- the pads and their terms ----------------
function termOffset(g, q) {
  const t = g.t;
  if (q.boingAt != null && t - q.boingAt < 0.7) { const k = (t - q.boingAt) / 0.7, e = Math.exp(-k * 5) * Math.cos(k * 26); return [q.bx * e, q.by * e, Math.min(1, Math.hypot(q.bx, q.by) / 60) * Math.exp(-k * 4)]; }
  if (q.homeAt != null && t - q.homeAt < 0.25) { const k = ease((t - q.homeAt) / 0.25); return [q.bx * (1 - k), q.by * (1 - k), 0]; }
  if (q.hopAt != null && t - q.hopAt < 0.35) { const k = (t - q.hopAt) / 0.35; return [0, -Math.sin(k * Math.PI) * 16, 0]; }
  return [q.dx, q.dy, 0];
}
function drawPads(g, c, S) {
  const t = g.t, T = M.pace(g), sink = S.gatherAt != null ? ease((t - S.gatherAt) / (0.35 * T)) : 0, fade = S.flourishAt != null ? ease((t - S.flourishAt) / (0.3 * T)) : 0;
  // the "=" that leads the answer
  if (S.eqPos) { c.save(); c.globalAlpha = sink; const n = M.row(M.op('=')), m = M.lay(n, S.finSz); c.shadowColor = 'rgba(255,200,120,0.9)'; c.shadowBlur = 12; M.draw(c, n, S.eqPos.x - m.w / 2, 392 + 12, S.finSz, { col: INKL }); c.restore(); }
  S.terms.forEach((q, i) => {
    const p = S.pos[i], bob = Math.sin(t * 1.4 + i * 1.3) * 1.5;
    const fin = q.final, gx = fin ? lerp(p.x, fin.x, easeIO(sink)) : p.x, gy = fin ? lerp(p.y, 392, easeIO(sink)) : p.y;
    const pw = fin ? lerp(p.w, M.lay(fin.node, S.finSz).w + S.finSz * 0.9, sink) : p.w;
    // the pad (an empty constant pad sinks away during the flourish)
    if (q.isC && sink > 0) { c.save(); c.globalAlpha = 1 - sink; c.translate(0, sink * 12); }
    // ripples ring the pad when its term leaves or changes
    const rip = q.goneAt != null ? t - q.goneAt : q.dAt != null ? t - q.dAt : 9;
    if (rip < 0.8) { const k = rip / 0.8; c.strokeStyle = `rgba(255,220,200,${0.5 * (1 - k)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(gx, gy + 12 + bob, pw / 2 + 6 + k * 30, (pw / 2 + 6 + k * 30) * 0.36, 0, 0, 7); c.stroke(); }
    pad(c, gx, gy + 12 + bob, pw / 2 + 4, !q.isC && q.d);
    if (q.isC && sink > 0) c.restore();
    if (q.gone) {
      // a faint 0 where the constant was
      const a = clamp((t - q.goneAt - 0.15) / 0.2, 0, 1) * (1 - fade * 0.4) * (1 - sink);
      if (a > 0) { const n = M.num(0), m = M.lay(n, S.sz * 0.8); c.save(); c.globalAlpha = 0.45 * a; M.draw(c, n, gx - m.w / 2, gy + 6 + bob, S.sz * 0.8, { col: '#ffd6c0' }); c.restore(); }
      return;
    }
    const [ox, oy, str] = termOffset(g, q), grabbed = S.grab && S.grab.i === i;
    // a term with x is stuck to its pad: pulled, it stretches out on a rubbery stalk
    if (!q.isC && Math.hypot(ox, oy) > 3) { const x0 = gx, y0 = gy + 10 + bob, x1 = gx + ox, y1 = gy + oy + bob, d = Math.hypot(ox, oy);
      c.strokeStyle = '#2c5a3e'; c.lineCap = 'round'; c.lineWidth = Math.max(3, 9 - d * 0.08); c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + oy * 0.2, (y0 + y1) / 2 - ox * 0.2, x1, y1 + 4); c.stroke();
      c.strokeStyle = 'rgba(160,230,150,0.5)'; c.lineWidth = 2; c.stroke(); }
    const asked = S.askI === i, dK = q.d ? clamp((t - q.dAt) / (0.22 * T), 0, 1) : 0;
    const sz = fin ? lerp(S.sz, S.finSz, sink) : S.sz;
    const bad = (q.boingAt != null && t - q.boingAt < 0.5) || (q.wobAt != null && t - q.wobAt < 0.3);
    const col = bad ? '#ff9aa0' : q.d ? '#fff0b0' : INKL;
    c.save(); c.translate(gx + ox, gy + oy + bob);
    if (str > 0) { const ang = Math.atan2(q.by, q.bx); c.rotate(ang); c.scale(1 + str * 0.35, 1 - str * 0.2); c.rotate(-ang); }
    if (grabbed && !q.isC) { const d = Math.hypot(q.dx, q.dy), ang = Math.atan2(q.dy, q.dx), k = Math.min(1, d / 46); c.rotate(ang); c.scale(1 + k * 0.3, 1 - k * 0.15); c.rotate(-ang); }
    if (q.wobAt != null && t - q.wobAt < 0.3) c.rotate(Math.sin((t - q.wobAt) * 40) * 0.08 * (1 - (t - q.wobAt) / 0.3));
    // a constant lifted off its pad casts a shadow on the pad
    if (grabbed && q.isC) { c.fillStyle = 'rgba(255,220,150,0.25)'; c.beginPath(); c.ellipse(-q.dx, -q.dy + 12, p.w / 2 - 6, 7, 0, 0, 7); c.fill(); }
    const show = (n, a, s) => { const m = M.lay(n, s); c.save(); c.globalAlpha *= a; c.shadowColor = q.d ? 'rgba(255,200,90,0.9)' : 'rgba(255,170,120,0.6)'; c.shadowBlur = q.d ? 14 : 8; M.draw(c, n, -m.w / 2, 6, s, { t, col }); c.restore(); };
    if (asked) { const n = M.row(M.txt('?')), m = M.lay(n, sz); show(n, 1, sz); M.glowBox(c, { x: 0, y: -4, w: m.w + 14, h: sz }, t, 0.8); }
    else if (q.d) {
      // the old term shrinks away and its derivative pops in
      if (dK < 1) show(q.node, 1 - dK, sz * (1 - dK * 0.4));
      const n = fin ? fin.node : (q.dn || (q.dn = termNode(dTerm(q), i === firstLive(S)))); show(n, dK, sz * (1 + Math.sin(dK * Math.PI) * 0.3));
    } else show(q.node, 1, sz);
    c.restore();
  });
}
const firstLive = S => S.terms.findIndex(q => !q.isC);
// constants in flight: they spin away, turn into 0 and burst into sparks
function drawFlying(g, c, S) {
  const t = g.t;
  for (const q of S.terms) {
    const f = q.fly; if (!f) continue; const k = t - f.t0; if (k > 0.5) continue;
    const zero = k > 0.14, n = zero ? M.num(0) : q.node, s = S.sz * (zero ? 1.1 + Math.sin(clamp((k - 0.14) / 0.2, 0, 1) * Math.PI) * 0.4 : 1), m = M.lay(n, s);
    c.save(); c.translate(f.x, f.y); c.rotate(f.spin * k); c.globalAlpha = 1 - clamp((k - 0.36) / 0.14, 0, 1);
    c.shadowColor = '#ffd46a'; c.shadowBlur = 16; M.draw(c, n, -m.w / 2, 8, s, { t, col: zero ? '#fff6c0' : INKL }); c.restore();
    // a short sparkle trail
    for (let j = 1; j <= 4; j++) { const tt = k - j * 0.03; if (tt < 0) break; c.fillStyle = `rgba(255,230,160,${0.5 - j * 0.1})`; star4(c, f.x - f.vx * j * 0.03, f.y - f.vy * j * 0.03, 2.4 - j * 0.4); }
  }
}

// ---------------- guidance ----------------
// The next constant always glows. At level 0 (or after a 2-second pause) a ghost hand flicks it off its pad.
function drawGuide(g, c, S) {
  const t = g.t; if (g.done || S.grab || S.flourishAt != null) return;
  const i = S.terms.findIndex(q => q.isC && !q.gone); if (i < 0) return; const p = S.pos[i];
  M.glowBox(c, { x: p.x, y: p.y - 4, w: p.w - 4, h: 40 }, t, 0.85);
  const idle = t - (S.lastMoveT || 0), hinted = S.hintAt != null && t - S.hintAt < 2;
  if (t < 0.45 || (g.level > 0 && idle < 2 && !hinted)) return;
  const per = 1.3, k = ((t - 0.45) % per) / per, dir = p.x > 180 ? 1 : -1;
  const e = easeIO(clamp((k - 0.2) / 0.35, 0, 1)), hx = p.x + dir * 50 * e, hy = p.y - 6 - 120 * e, fade = k > 0.8 ? (1 - k) / 0.2 : 1;
  if (e > 0 && e < 1) { c.save(); c.globalAlpha = 0.45 * fade; const m = M.lay(S.terms[i].node, S.sz); M.draw(c, S.terms[i].node, hx - m.w / 2, hy + 12, S.sz, { col: '#fff6c0' }); c.restore(); }
  c.save(); c.globalAlpha = 0.7 * fade; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.lineCap = 'round'; c.setLineDash([5, 7]); c.lineDashOffset = -t * 40;
  c.beginPath(); c.moveTo(p.x, p.y - 10); c.quadraticCurveTo(p.x + dir * 6, p.y - 80, p.x + dir * 54, p.y - 134); c.stroke(); c.restore();
  c.save(); c.globalAlpha = fade; M.hand(c, hx + 2, hy + 4, 1, k < 0.2 ? 1 : 0); c.restore();
}

// ---------------- the frog ----------------
function drawFrog(g, c, S) {
  const t = g.t, f = S.frog, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const hk = (t - f.hopAt) / 0.45, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0, laugh = t - f.laughAt < 0.8;
  const x = 64, y = 600;
  for (let i = 0; i < 2; i++) { const k = ((t * 0.45 + i / 2) % 1); c.strokeStyle = `rgba(255,210,190,${0.25 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y + 2, 40 + k * 50, (40 + k * 50) * 0.32, 0, 0, 7); c.stroke(); }
  pad(c, x, y + 2, 46, true);
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : laugh ? 'wave' : S.point && M.showing(g) ? 'point' : 'idle', expr = won || laugh ? 'laugh' : lost ? 'sad' : hop > 0 ? 'wow' : 'happy';
  try { if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', x, y - hop * 40, 1.25, { t, pose, expr, facing: 1 }); else P.sheep(c, x, y - hop * 40, 1, { t }); } catch (e) { }
}
