// calc_tangent.js — TANGENT! Find the slope of a curve at a few points by turning a reed until it is the tangent line.
// A twilight pond: the graph of f(x) hangs in the dusk sky as a glowing dragonfly flight path, and the axes are reeds.
// At each marked point a reed is pinned to the path with a dragonfly perched on its end. The player drags the
// dragonfly to turn the reed; while turning, a rise-over-run triangle shows the reed's slope (rise for a run of 1).
// Released close to the true slope f′(a), the reed eases onto the tangent and the working plays by itself: a
// rise-over-run staircase draws itself (run 1, then the rise counting up), "rise ÷ 1 = slope" writes itself and
// becomes the label f′(a) = slope, and a firefly drops from the pin onto the pond at (a, f′(a)): the pond is a second graph that collects the slopes. When every point is done, the derivative curve
// f′(x) is drawn across the water through the fireflies.
// Level 0: a parabola with 2 points, a generous tolerance and a ghost hand that turns the first reed.
// Level 1: a cubic with 3 points; only the next reed glows. Level 2: a cubic with 3 points, a tight tolerance, no help.
// Misses (level 1 up): releasing a reed far from the tangent shows it as a secant that cuts across the path, and
// pressing the path itself (the curve cannot be moved, only the reeds) makes it wobble red. At level 0 a reed that is
// far off springs back and the path only wobbles.
// Medium mode: after a reed snaps, the slope label shows "?" and the player picks f′(a) from a tray. The wrong tiles
// are f(a) (the height instead of the slope), −f′(a) (the wrong sign) and f′ at a neighbouring whole number.
//
// The kit's moves(g) system is for discrete taps and drags, so this file handles the continuous reed drag itself.
// It still runs on MK.play: moves(g) returns one placeholder drag move (the unfinished reeds) until every slope is
// collected, then an empty list, so MK.update awards the stars and wins through the kit's own finish(). The tray is
// the kit's: openAsk below fills g.s.mk.ask the same way the kit does, and MK.down, MK.drawAsk and MK.auto run it.
const M = MK;
const PX0 = 28, PX1 = 332, PY0 = 236, PY1 = 448;   // the sky graph (f)
const WY = 470, MY0 = 494, MY1 = 560;              // waterline, and the pond graph (f′)
const TOL = [0.21, 0.13, 0.085];                   // how close (radians, on screen) a reed must be to snap, by level
const DF_COLS = [['#5ae0d0', '#2a8a9a'], ['#ff86c0', '#a83a7a'], ['#ffc04a', '#b06a1a']];
const INKL = '#fff3dc';
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const near0 = v => Math.abs(v) < 1e-9;
const fmt = v => { const r = Math.round(v * 10) / 10; return (Math.abs(r) < 0.05 ? '0' : String(r)).replace(/^-/, '−'); };

// ---------------- the problem ----------------
// Level 0: f(x) = x² + bx + c, f′(x) = 2x + b, two whole-number points 2 or 3 apart.
// Level 1–2: f(x) = s·((x − h)³/3 + kx + h³/3) = s·(x³/3 − hx² + (h² + k)x), so f′(x) = s·((x − h)² + k).
// The points x = h + d with d from {0, ±1, ±2} have slopes s·k, s·(k + 1), s·(k + 4): three different whole numbers.
function pickProblem(g) {
  const R = arr => arr[Math.floor(g.rand() * arr.length)];
  if (g.level === 0) {
    const [b, c] = R([[-2, 0], [2, 0], [0, -2], [-4, 3], [-2, 0]]);
    const cand = []; for (let a = -6; a <= 6; a++) if (Math.abs(2 * a + b) <= 4) cand.push(a);
    let xs; do { xs = [R(cand), R(cand)]; } while (!(Math.abs(xs[0] - xs[1]) >= 2 && Math.abs(xs[0] - xs[1]) <= 3));
    xs.sort((p, q) => p - q);
    return { f: x => x * x + b * x + c, df: x => 2 * x + b, terms: [[1, 2], [b, 1], [c, 0]], dterms: [[2, 1], [b, 0]], xs };
  }
  const s = g.level === 2 && g.rand() < 0.5 ? -1 : 1, h = R([-1, 0, 1]), k = R([-4, -3, -2, -1, 0]);
  const D = R([[0, 1, 2], [-2, 0, 1], [-1, 0, 2], [-2, -1, 0]]);
  return {
    f: x => s * (Math.pow(x - h, 3) / 3 + k * x + Math.pow(h, 3) / 3), df: x => s * ((x - h) * (x - h) + k),
    terms: [[s / 3, 3], [-s * h, 2], [s * (h * h + k), 1]], dterms: [[s, 2], [-2 * s * h, 1], [s * (h * h + k), 0]], xs: D.map(d => h + d),
  };
}
// a polynomial as an expression node; coefficients are whole numbers or ±1/3
function polyNode(terms) {
  const out = []; let first = true;
  for (const [c, p] of terms) {
    if (near0(c)) continue; const neg = c < 0, a = Math.abs(c);
    if (first) { if (neg) out.push(M.op('-')); } else out.push(M.op(neg ? '-' : '+'));
    first = false;
    const whole = Math.abs(a - Math.round(a)) < 1e-9;
    if (!whole) out.push(M.frac(M.num(1), M.num(3), null, { small: true }));
    else if (!(Math.round(a) === 1 && p > 0)) out.push(M.num(Math.round(a)));
    if (p === 1) out.push(M.vr('x')); else if (p >= 2) out.push(M.sup(M.vr('x'), M.num(p)));
  }
  if (first) out.push(M.num(0));
  return out;
}
const fName = prime => [M.vr('f'), prime ? M.txt('′') : null, M.paren(M.vr('x'))];
// a value that is a whole number or a multiple of 1/3, as a tray tile
function valNode(v) {
  const n3 = Math.round(v * 3);
  if (n3 % 3 === 0) return n3 / 3;
  const fr = M.frac(M.num(Math.abs(n3)), M.num(3));
  return n3 < 0 ? M.row(M.op('-'), fr) : fr;
}

// ---------------- geometry ----------------
function setupView(S) {
  const xs = S.xs, lo = Math.min(...xs), hi = Math.max(...xs);
  let x0 = Math.min(lo - 1, -0.4), x1 = Math.max(hi + 1, 0.4);
  S.x0 = x0; S.x1 = x1; S.sx = (PX1 - PX0) / (x1 - x0);
  let ylo = 0, yhi = 0; for (let i = 0; i <= 60; i++) { const x = lo - 0.6 + (hi - lo + 1.2) * i / 60, y = S.f(x); ylo = Math.min(ylo, y); yhi = Math.max(yhi, y); }
  let y0 = ylo - 0.9, y1 = yhi + 1.4, sy = (PY1 - PY0) / (y1 - y0);
  if (sy > S.sx) { sy = S.sx; const c = (y0 + y1) / 2, half = (PY1 - PY0) / sy / 2; y0 = c - half; y1 = c + half; }
  S.y0 = y0; S.y1 = y1; S.sy = sy;
  const sl = S.pts.map(p => p.m), d0 = Math.min(0, ...sl) - 1, d1 = Math.max(0, ...sl) + 1;
  S.d0 = d0; S.d1 = d1; S.msy = (MY1 - MY0) / (d1 - d0);
}
const X = (S, x) => PX0 + (x - S.x0) * S.sx, Y = (S, y) => PY1 - (y - S.y0) * S.sy, MYv = (S, v) => MY1 - (v - S.d0) * S.msy;
const thOf = (S, m) => Math.atan2(-m * S.sy, S.sx);            // screen angle of a line with slope m (y down)
const slopeOf = (S, th) => -Math.tan(th) * S.sx / S.sy;
const pivot = (S, p) => ({ x: X(S, p.a), y: Y(S, p.fa) });
function handleAt(S, p, th) { const P0 = pivot(S, p); return { x: P0.x + Math.cos(th) * S.L, y: P0.y + Math.sin(th) * S.L }; }
function segDist(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1, k = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1); return Math.hypot(px - ax - dx * k, py - ay - dy * k); }
function stickDist(S, p, x, y) { const P0 = pivot(S, p), c = Math.cos(p.th) * S.L, s = Math.sin(p.th) * S.L; return Math.min(Math.hypot(x - P0.x - c, y - P0.y - s) - 4, segDist(x, y, P0.x - c, P0.y - s, P0.x + c, P0.y + s) + 6); }
function curveDist(S, x, y) { let d = 1e9; for (const q of S.curvePts) d = Math.min(d, Math.hypot(x - q[0], y - q[1])); return d; }
// where else the line through (a, f(a)) with slope mc crosses the curve, inside the window
function crossings(S, p, mc) {
  const gfn = x => S.f(x) - p.fa - mc * (x - p.a), out = []; let px = S.x0, pv = gfn(px);
  for (let i = 1; i <= 400; i++) { const x = S.x0 + (S.x1 - S.x0) * i / 400, v = gfn(x); if (pv * v < 0 && Math.abs(x - p.a) > 0.08) { const xr = px - pv * (x - px) / (v - pv), yr = S.f(xr); if (yr > S.y0 && yr < S.y1) out.push(xr); } px = x; pv = v; }
  return out;
}

// ---------------- the tray (the kit's medium-mode answer tiles) ----------------
function openAsk(g, mv) {
  const K = g.s.mk, right = mv.ask.v, seen = new Set([JSON.stringify(right)]);
  const wrong = (mv.ask.wrong || []).filter(w => { if (w == null || (typeof w === 'number' && !Number.isFinite(w))) return false; const k = JSON.stringify(w); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
  const list = [{ v: right, ok: true }, ...wrong.map(v => ({ v }))];
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  const n = list.length, tw = n > 3 ? 74 : 86, gap = n > 3 ? 10 : 16, total = n * tw + (n - 1) * gap;
  list.forEach((ch, i) => { ch.node = M.wrap(typeof ch.v === 'number' ? M.num(ch.v) : ch.v); ch.x = 180 - total / 2 + tw / 2 + i * (tw + gap); ch.y = 566; ch.w = tw; ch.h = 74; ch.s = ch.node.k === 'num' ? 34 : 24; M.lay(ch.node, ch.s); });
  K.ask = { mv, list, t0: g.t }; K.busyT = 1e9; g.sfx('pop');
}

// ---------------- the moves ----------------
// The working, acted out once a reed snaps (show your work): the reed eases onto the tangent, then a rise-over-run
// staircase draws itself from the pin: one step right (run 1), then up or down by the slope while the rise counts up.
// "rise ÷ 1 = slope" writes itself beside the pin and turns into the label f′(a) = slope, and the dragonfly's firefly
// drops from the pin straight down onto the pond at height f′(a).
const RUN = 0.05, RISE = 0.34, STAIR = 0.72; // beat times (× pace): run starts, rise starts, staircase done
function snap(g, i) {
  const S = g.s, p = S.pts[i], P0 = pivot(S, p), T = S.T;
  p.snapFrom = p.th; p.done = true; p.snapAt = g.t; S.frog.hopT = g.t; S.frog.look = i; S.point = true;
  g.sfx('snap'); g.sfx('ribbit'); g.burst(P0.x, P0.y, ['#fff3b0', '#ffd45a', DF_COLS[i % 3][0]], 12, 130);
  M.show(g, STAIR * T);
  M.at(g, [[RUN * T, g => g.sfx('tap')], [RISE * T, g => g.sfx('swoosh')]]);
  const mv = { ask: { v: p.m, wrong: [] }, after: 0.95 * T, resolve(g) { work(g, i); } };
  if (g.mode === 'medium') {
    const nb = [S.df(p.a + 1), S.df(p.a - 1)].filter(v => v !== p.m);
    mv.ask.wrong = [valNode(p.fa), p.m ? -p.m : null, nb[0], nb[1], p.m + 1, p.m - 1];
    M.at(g, [[STAIR * T, g => openAsk(g, mv)]]);
  } else M.at(g, [[STAIR * T, g => mv.resolve(g)]]);
}
// the rest of the working, from the moment the slope is known
function work(g, i) {
  const S = g.s, p = S.pts[i], T = S.T, lp = pillPos(S, p); p.revealed = true; M.show(g, 0.95 * T); g.sfx('ding');
  M.note(g, { node: M.row(M.num(p.m), M.op('÷'), M.num(1), M.op('='), M.num(p.m)), at: [lp.x, lp.y], s: 16, col: '#ffe6f2', write: 0.3 * T, hold: 0.18 * T, fade: 0.12 * T });
  M.at(g, [[0.5 * T, g => { p.namedAt = g.t; g.sfx('pop'); S.frog.hopT = g.t; }],
    [0.55 * T, g => { p.dropAt = g.t; p.dropDur = 0.36 * T; g.sfx('swoosh'); }],
    [0.92 * T, g => { plot(g, i); g.burst(X(S, p.a), MYv(S, p.m), ['#eaff8a', '#fff', '#d8ff7a'], 10, 110); S.point = false; }]]);
}
function plot(g, i) { const S = g.s, p = S.pts[i]; p.answered = true; p.dotAt = g.t; g.sfx('sparkle'); S.frog.look = i; S.frog.hopT = g.t; }
// where the f′(a) label sits: beside the pin, on the side of the reed away from the curve (curves bend away from tangents)
function pillPos(S, p) {
  const P0 = pivot(S, p), bend = S.f(p.a + 0.4) + S.f(p.a - 0.4) - 2 * p.fa; let sd = bend > 0 ? 1 : -1; const nx = -Math.sin(p.thT), ny = Math.cos(p.thT);
  const D = 34; if (P0.y + ny * sd * D < PY0 + 6 || P0.y + ny * sd * D > PY1 + 6) sd = -sd;
  return { x: clamp(P0.x + nx * sd * D, 44, 316), y: P0.y + ny * sd * D };
}
function fail(g, info) {
  const S = g.s, K = S.mk; K.missAt = g.t; K.missInfo = info; S.frog.sadAt = g.t; g.sfx('wrong'); g.sfx('splash'); S.splashAt = g.t; g.fail();
}
function release(g) {
  const S = g.s, D = S.drag; S.drag = null; if (!D) return;
  const p = S.pts[D.i]; if (!D.moved || p.done) return;
  const err = Math.abs(p.th - p.thT), tol = TOL[g.level];
  if (err <= tol) { snap(g, D.i); return; }
  if (false && err > tol * 2 && g.level >= 1) { /* a far-off reed never fails the game any more (owner's rule); it springs back below */ const mc = slopeOf(S, p.th); p.miss = { at: g.t, mc, xs: crossings(S, p, mc) }; fail(g, { drag: 'st' + D.i, to: 'tangent' }); return; }
  if (err > tol * 2) { p.springAt = g.t; p.springFrom = p.th; g.sfx('boing'); S.frog.shrugAt = g.t; return; }
  p.nudgeAt = g.t; g.sfx('boing'); // close, but not close enough: it stays where it was let go
}

MG.add({
  id: 'tangent', stage: 'derivs', cmd: 'TANGENT!', hint: 'drag', time: 10, mood: 'bright', winText: 'Tangent!', hold: 1.4, cardY: 420,
  card: {
    title: 'Tangent lines', ref: 'Grade 11 and up', kind: 'Calculus',
    text: 'A tangent line is a straight line that meets a curve at one point and points the same way the curve is heading at that point. The slope of a line says how steep it is: how far the line goes up for every 1 step to the right. A slope of 2 means up 2 for each step right. A negative slope means the line goes down.\n\nThe derivative of f at a point a is the slope of the tangent line there. We write it f′(a). If you find the slope at every point, you get a new function, the derivative f′(x).\n\nFor example, take f(x) = x². At x = 1 the tangent line has slope 2. At x = 3 it has slope 6. At every point the slope is twice x, so f′(x) = 2x.\n\nHere is why the tangent shows the slope. Zoom in on a curve near a point, and the curve looks more and more like a straight line. That straight line is the tangent line.',
    note: 'The slope of the tangent line at x = a is f′(a). Put a dot at height f′(a) above each a, and the dots trace out the graph of f′(x).',
    ask: 'Where is the tangent line of f(x) = x² flat? What is its slope at x = −2?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pickProblem(g)); S.T = M.pace(g);
    S.pts = S.xs.map(a => ({ a, fa: S.f(a), m: S.df(a) }));
    setupView(S); S.L = S.pts.length > 2 ? 44 : 60;
    g.dur *= 0.5 + 0.5 * S.pts.length / 3; // the fuse scales with the number of reeds to turn
    // each reed starts clearly off: 0.6 rad away from the tangent, turned toward the flatter side when there is room
    S.pts.forEach((p, i) => { p.thT = thOf(S, p.m); const dir = Math.abs(p.thT) < 0.35 ? (g.rand() < 0.5 ? -1 : 1) : -Math.sign(p.thT); p.th0 = clamp(p.thT + dir * 0.62, -1.25, 1.25); p.th = p.th0; });
    S.curvePts = []; for (let i = 0; i <= 260; i++) { const x = S.x0 + (S.x1 - S.x0) * i / 260, y = Y(S, S.f(x)); if (y > PY0 - 14 && y < PY1 + 14) S.curvePts.push([X(S, x), y]); }
    // the curve's own zone (pressing the curve is the wrong part): a spot on the curve well away from every reed
    let best = null, bd = -1; for (const q of S.curvePts) { if (q[1] < PY0 + 6 || q[1] > PY1 - 6 || q[0] < PX0 + 8 || q[0] > PX1 - 8) continue; const d = Math.min(...S.pts.map(p => stickDist(S, p, q[0], q[1]))); if (d > bd) { bd = d; best = q; } }
    S.curveSpot = best || S.curvePts[0];
    M.zone(g, 'curve', { x: S.curveSpot[0], y: S.curveSpot[1], w: 26, h: 26 });
    S.pts.forEach((p, i) => { const h = handleAt(S, p, p.th); M.zone(g, 'st' + i, { x: h.x, y: h.y, w: 34, h: 34 }); });
    // f(x) written in light across the top of the sky; f′(x) on the pond
    M.place(g, 'fx', M.row(...fName(false), M.op('='), ...polyNode(S.terms)), 180, 204, 28, { col: INKL });
    S.fpNode = M.row(...fName(true), M.op('='), ...polyNode(S.dterms));
    // the pond label sits in the corner farthest from the fireflies
    // (not the bottom-left corner: the frog sits there); it must clear the fireflies and the f′ curve drawn at the end
    const corners = [[PX0 + 2, MY0 + 12, 1], [PX1 - 2, MY0 + 12, -1], [PX1 - 2, MY1 - 2, -1]], fpw = 130;
    const marks = [...S.pts.map(p => [X(S, p.a), MYv(S, p.m)])]; for (let i = 0; i <= 80; i++) { const x = S.x0 + (S.x1 - S.x0) * i / 80, yy = MYv(S, S.df(x)); if (yy > MY0 - 6 && yy < MY1 + 6) marks.push([X(S, x), yy]); }
    let cb = corners[0], cd = -1; for (const cn of corners) { const x0 = cn[2] > 0 ? cn[0] : cn[0] - fpw, x1 = x0 + fpw, ym = cn[1] - 7;
      const d = Math.min(...marks.map(([mx, my]) => Math.hypot(Math.max(0, x0 - mx, mx - x1), my - ym))); if (d > cd) { cd = d; cb = cn; } }
    S.lab = cb; placeLabel(g, false);
    // a key that names the new symbol in words, on the water between the frog and the far lily pad
    const key = M.row(M.vr('f'), M.txt('′'), M.paren(M.vr('a')), M.op('='), M.txt('slope of the tangent at'), M.gap(4), M.vr('x'), M.op('='), M.vr('a'));
    const kw = M.lay(key, 13).w; M.place(g, 'key', key, 186, 598, Math.min(13, 13 * 206 / kw), { col: '#d8d0ff' });
    S.frog = { hopT: -9, sadAt: -9, shrugAt: -9, look: -1 }; S.drag = null; S.press = null;
    M.play(g, {
      moves(g) { const left = S.pts.map((p, i) => p.answered ? null : 'st' + i).filter(Boolean); return left.length ? [{ drag: left, to: 'tangent' }] : []; },
      area(g) { const i = S.pts.findIndex(p => !p.done); return i < 0 ? null : 'st' + i; },
      onWin(g) { S.revealAt = g.t; placeLabel(g, true); g.sfx('magic'); },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    S.pts.forEach((p, i) => {
      if (p.springAt != null) { const k = (g.t - p.springAt) / 0.18; p.th = lerp(p.springFrom, p.th0, ease(k)); if (k >= 1) p.springAt = null; }
      if (p.snapFrom != null) { const k = (g.t - p.snapAt) / (0.16 * S.T); p.th = lerp(p.snapFrom, p.thT, ease(k)); if (k >= 1) { p.th = p.thT; p.snapFrom = null; } }
      const h = handleAt(S, p, p.th); M.zone(g, 'st' + i, { x: h.x, y: h.y, w: 34, h: 34 });
    });
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (K.ask || M.showing(g) || K.busyT > 0) return; // input waits while the working is shown
    let bi = -1, bd = 34; S.pts.forEach((p, i) => { if (p.done) return; const d = stickDist(S, p, x, y); if (d < bd) { bd = d; bi = i; } });
    if (bi >= 0) { const p = S.pts[bi]; p.springAt = null; S.drag = { i: bi, x0: x, y0: y, moved: false, lastInt: Math.round(slopeOf(S, p.th)) }; S.frog.look = bi; g.sfx('buzz'); return; }
    if (curveDist(S, x, y) < 16) S.press = { x, y };
  },
  move(g, x, y) {
    const S = g.s, D = S.drag; if (!D || g.done) return; const p = S.pts[D.i], P0 = pivot(S, p);
    if (Math.hypot(x - D.x0, y - D.y0) > 4) D.moved = true;
    const dx = x - P0.x, dy = y - P0.y; if (Math.hypot(dx, dy) < 16) return;
    p.th = clamp(dx >= 0 ? Math.atan2(dy, dx) : Math.atan2(-dy, -dx), -1.45, 1.45);
    const n = Math.round(slopeOf(S, p.th)); if (n !== D.lastInt && g.t - (S.tickAt || -1) > 0.07) { D.lastInt = n; S.tickAt = g.t; g.sfx('click'); }
  },
  up(g, x, y) {
    const S = g.s; if (g.done) return;
    if (S.drag) { release(g); return; }
    if (S.press) { S.press = null; S.wobAt = g.t;
      if (false) { S.curveBad = g.t; fail(g, { tap: 'curve' }); } else { S.mk.wrong = (S.mk.wrong || 0) + 1; S.mk.missAt = g.t; g.sfx('boing'); S.frog.shrugAt = g.t; } }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (!S.bot && (M.showing(g) || K.busyT > 0)) { S.botNext = g.t + 0.3; return; }
    if (S.bot) {
      const b = S.bot, p = S.pts[b.i], k = clamp((g.t - b.t0) / b.dur, 0, 1), h = handleAt(S, p, lerp(b.from, p.thT, easeIO(k)));
      synth('move', h.x, h.y); if (k >= 1) { synth('up', h.x, h.y); S.bot = null; S.botNext = g.t + 0.3; } return;
    }
    if (g.t < (S.botNext ?? 0.5)) return;
    const i = S.pts.findIndex(p => !p.done); if (i < 0) return;
    const p = S.pts[i], h = handleAt(S, p, p.th); synth('down', h.x, h.y); S.bot = { i, t0: g.t, dur: 0.4, from: p.th };
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('calc_tangent_dusk', dusk), 0, 0, W, H);
    ambient(c, t);
    drawSkyGraph(g, c, S);
    drawPond(g, c, S);
    S.pts.forEach((p, i) => drawReed(g, c, S, p, i));
    drawGuide(g, c, S);
    S.pts.forEach((p, i) => drawReadout(g, c, S, p, i));
    c.save(); c.shadowColor = 'rgba(255,200,120,0.85)'; c.shadowBlur = 12; M.drawEx(g, c, 'fx'); c.restore();
    c.save(); c.globalAlpha = 0.8; M.drawEx(g, c, 'key'); c.restore();
    drawFrog(g, c, S);
    M.drawAnims(g, c); M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

function placeLabel(g, full) {
  const S = g.s, [lx, ly, side] = S.lab, node = full ? S.fpNode : M.row(...fName(true));
  const m = M.lay(node, full ? 17 : 15); S.labW = m.w;
  M.place(g, 'fp', node, side > 0 ? lx + 6 : lx - 6 - m.w, ly, full ? 17 : 15, { left: true, col: full ? '#efffb0' : '#cfe8ff' });
  if (full) S.labPop = g.t;
}

// ---------------- the world ----------------
function dusk(c, w, h) {
  const sky = c.createLinearGradient(0, 0, 0, WY); [[0, '#120f33'], [0.32, '#2a2363'], [0.6, '#5f3784'], [0.84, '#c8678e'], [1, '#ffb07a']].forEach(([k, col]) => sky.addColorStop(k, col));
  c.fillStyle = sky; c.fillRect(0, 0, w, WY + 2);
  const sun = c.createRadialGradient(250, WY, 4, 250, WY, 190); sun.addColorStop(0, 'rgba(255,226,160,0.9)'); sun.addColorStop(0.15, 'rgba(255,190,130,0.45)'); sun.addColorStop(1, 'rgba(255,160,120,0)');
  c.fillStyle = sun; c.fillRect(0, 260, w, WY - 258);
  c.fillStyle = '#ffe6a8'; c.beginPath(); c.arc(250, WY + 2, 17, Math.PI, 0); c.fill();
  // thin dusk clouds lit from below
  for (const [x, y, s] of [[70, 300, 1], [300, 360, 0.8], [150, 404, 0.7]]) { c.save(); c.translate(x, y); c.scale(s, s); const gr = c.createLinearGradient(0, -6, 0, 6); gr.addColorStop(0, 'rgba(120,70,140,0.0)'); gr.addColorStop(1, 'rgba(255,170,150,0.35)'); c.fillStyle = gr; c.beginPath(); c.ellipse(0, 0, 70, 6, 0, 0, 7); c.ellipse(-24, -3, 34, 6, 0, 0, 7); c.fill(); c.restore(); }
  // the far bank: soft hills and trees in silhouette
  c.fillStyle = '#2a1d45'; c.beginPath(); c.moveTo(0, WY + 1);
  for (let x = 0; x <= w; x += 6) c.lineTo(x, WY - 10 - 7 * Math.sin(x * 0.021) - 4 * Math.sin(x * 0.067 + 1));
  c.lineTo(w, WY + 1); c.closePath(); c.fill();
  c.fillStyle = '#21173a';
  for (const [x, s] of [[24, 1], [58, 0.7], [120, 0.55], [326, 0.9], [350, 0.6]]) { c.beginPath(); c.ellipse(x, WY - 22 * s - 8, 13 * s, 22 * s, 0, 0, 7); c.fill(); c.fillRect(x - 1.5, WY - 12, 3, 12); }
  // the pond
  const wg = c.createLinearGradient(0, WY, 0, h); wg.addColorStop(0, '#5a3a72'); wg.addColorStop(0.25, '#33285a'); wg.addColorStop(1, '#161236'); c.fillStyle = wg; c.fillRect(0, WY, w, h - WY);
  const ref = c.createLinearGradient(0, WY, 0, WY + 120); ref.addColorStop(0, 'rgba(255,200,140,0.5)'); ref.addColorStop(1, 'rgba(255,200,140,0)'); c.fillStyle = ref;
  for (let i = 0; i < 14; i++) { const y = WY + 3 + i * 8, ww = 34 - i * 2 + (i % 3) * 6; c.fillRect(250 - ww / 2, y, ww, 2); }
  c.fillStyle = 'rgba(255,220,180,0.25)'; c.fillRect(0, WY, w, 1.5);
  // lily pads
  for (const [x, y, r] of [[46, 620, 34], [322, 612, 24], [200, 634, 18]]) {
    c.fillStyle = 'rgba(8,6,24,0.4)'; c.beginPath(); c.ellipse(x + 3, y + 4, r, r * 0.38, 0, 0, 7); c.fill();
    const gr = c.createLinearGradient(0, y - r * 0.4, 0, y + r * 0.4); gr.addColorStop(0, '#5c8a5a'); gr.addColorStop(1, '#2c4c3c'); c.fillStyle = gr;
    c.beginPath(); c.ellipse(x, y, r, r * 0.38, 0, 0.3, Math.PI * 2 - 0.05); c.lineTo(x, y); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,190,150,0.55)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, r, r * 0.38, 0, Math.PI * 1.05, Math.PI * 1.9); c.stroke();
  }
  c.fillStyle = '#ffd6e8'; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; c.beginPath(); c.ellipse(322 + Math.cos(a) * 5, 604 + Math.sin(a) * 2, 4, 2.2, a, 0, 7); c.fill(); } c.fillStyle = '#ffe680'; c.beginPath(); c.arc(322, 603, 2.2, 0, 7); c.fill();
}
const starField = (() => { let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; return [...Array(46)].map(() => [r() * 360, r() * r() * 230, 0.5 + r() * 1.3, r() * 6]); })();
function ambient(c, t) {
  // twinkling stars
  for (const [x, y, s, ph] of starField) { c.globalAlpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.2 + ph * 3)); c.fillStyle = '#fff6e0'; c.beginPath(); c.arc(x, y, s, 0, 7); c.fill(); }
  c.globalAlpha = 1;
  // shimmer on the water
  c.save(); c.strokeStyle = 'rgba(200,190,255,0.12)'; c.lineWidth = 1.2;
  for (let i = 0; i < 9; i++) { const y = WY + 12 + i * 17, off = (t * (10 + i * 2) + i * 50) % 420 - 60; c.beginPath(); c.moveTo(off, y); c.lineTo(off + 40 + i * 3, y); c.stroke(); }
  c.restore();
  // reeds and cattails swaying at both edges, in silhouette
  for (const [x, hgt, ph] of [[6, 120, 0], [16, 150, 1.3], [28, 96, 2.1], [338, 140, 0.6], [350, 104, 1.9]]) {
    const sw = Math.sin(t * 1.3 + ph) * 4, top = WY + 20 - hgt;
    c.strokeStyle = '#1c1430'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, WY + 24); c.quadraticCurveTo(x, top + hgt * 0.5, x + sw, top); c.stroke();
    c.fillStyle = '#3a2418'; c.beginPath(); c.ellipse(x + sw * 0.95, top + 14, 4, 11, sw * 0.02, 0, 7); c.fill();
  }
  // a few fireflies drifting over the bank
  for (let i = 0; i < 6; i++) { const x = (i * 71 + Math.sin(t * 0.7 + i) * 22 + 400) % 360, y = WY - 18 + Math.sin(t * 1.1 + i * 2) * 10, a = 0.4 + 0.6 * Math.max(0, Math.sin(t * 2.6 + i * 1.7)); glowDot(c, x, y, 1.8, a, '#eaff8a'); }
  // a dragonfly patrolling the top of the sky
  const dx = 180 + Math.sin(t * 0.45) * 150, dy = 136 + Math.sin(t * 1.6) * 10, ang = Math.cos(t * 0.45) >= 0 ? 0.05 : Math.PI - 0.05;
  dragonfly(c, dx, dy, ang, 0.62, t, ['#9ab8ff', '#4a5aa8'], 1);
}
function glowDot(c, x, y, r, a, col) {
  c.save(); c.globalAlpha = a; const gr = c.createRadialGradient(x, y, 0, x, y, r * 5); gr.addColorStop(0, col); gr.addColorStop(0.3, P.rgba(col, 0.45)); gr.addColorStop(1, P.rgba(col, 0)); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r * 5, 0, 7); c.fill();
  c.fillStyle = '#fffff0'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore();
}
// a dragonfly with its head pointing along ang; flap 0..1 is how fast the wings beat
function dragonfly(c, x, y, ang, s, t, cols, flap = 0.3) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  const beat = Math.sin(t * (14 + flap * 40)), w1 = 0.35 + 0.65 * Math.abs(beat);
  c.fillStyle = 'rgba(220,240,255,0.42)'; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 0.8;
  for (const [ox, a, len, wd] of [[3, 1.25, 20, 5], [-1, 1.85, 18, 4.5]]) for (const sd of [-1, 1]) {
    c.save(); c.translate(ox, 0); c.rotate(sd * a); c.scale(1, w1); c.beginPath(); c.ellipse(len / 2, 0, len / 2, wd, 0, 0, 7); c.fill(); c.stroke(); c.restore();
  }
  // tail
  const tg = c.createLinearGradient(-30, 0, 0, 0); tg.addColorStop(0, cols[1]); tg.addColorStop(1, cols[0]); c.strokeStyle = tg; c.lineCap = 'round'; c.lineWidth = 3.4;
  c.beginPath(); c.moveTo(-2, 0); c.lineTo(-30, Math.sin(t * 3) * 1.2); c.stroke();
  c.strokeStyle = 'rgba(20,10,40,0.45)'; c.lineWidth = 1; for (let k = 1; k < 6; k++) { c.beginPath(); c.moveTo(-4 - k * 4.6, -1.8); c.lineTo(-4 - k * 4.6, 1.8); c.stroke(); }
  c.fillStyle = cols[0]; c.beginPath(); c.ellipse(2, 0, 5.5, 3.6, 0, 0, 7); c.fill();
  c.fillStyle = cols[1]; c.beginPath(); c.arc(8.5, -2.6, 2.8, 0, 7); c.arc(8.5, 2.6, 2.8, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(9.3, -3.3, 0.9, 0, 7); c.arc(9.3, 1.9, 0.9, 0, 7); c.fill();
  c.restore();
}

// ---------------- the sky graph ----------------
function drawSkyGraph(g, c, S) {
  const t = g.t;
  c.save(); c.beginPath(); c.rect(PX0 - 10, PY0 - 10, PX1 - PX0 + 20, PY1 - PY0 + 20); c.clip();
  // a faint grid of light, one line per whole number
  const ystep = S.sy >= 16 ? 1 : 2;
  c.strokeStyle = 'rgba(190,200,255,0.13)'; c.lineWidth = 1; c.beginPath();
  for (let x = Math.ceil(S.x0); x <= S.x1; x++) { const xx = X(S, x); c.moveTo(xx, PY0 - 10); c.lineTo(xx, PY1 + 10); }
  for (let y = Math.ceil(S.y0 / ystep) * ystep; y <= S.y1; y += ystep) { const yy = Y(S, y); c.moveTo(PX0 - 10, yy); c.lineTo(PX1 + 10, yy); }
  c.stroke(); c.restore();
  // the axes are two reeds
  const ax = X(S, 0), ay = Y(S, 0), sway = Math.sin(t * 1.4) * 1.5;
  c.save(); c.lineCap = 'round';
  c.strokeStyle = 'rgba(16,10,30,0.5)'; c.lineWidth = 5; c.beginPath(); c.moveTo(PX0 - 8, ay + 1); c.lineTo(PX1 + 6, ay + 1); c.moveTo(ax + 1, PY1 + 8); c.lineTo(ax + 1, PY0 - 4); c.stroke();
  c.strokeStyle = '#b8c27a'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(PX0 - 8, ay); c.lineTo(PX1 + 6, ay); c.moveTo(ax, PY1 + 8); c.lineTo(ax, PY0 - 4); c.stroke();
  c.fillStyle = '#6a4228'; c.beginPath(); c.ellipse(ax + sway * 0.3, PY0 - 6, 3.4, 8, 0, 0, 7); c.fill();          // a cattail tops the y reed
  c.fillStyle = '#9aac5a'; c.beginPath(); c.moveTo(PX1 + 6, ay); c.quadraticCurveTo(PX1 + 2, ay - 9 + sway, PX1 + 16, ay - 12 + sway); c.quadraticCurveTo(PX1 + 6, ay - 4, PX1 + 6, ay); c.fill(); // a leaf ends the x reed
  c.font = M.VARF(15); c.fillStyle = 'rgba(255,240,220,0.8)'; c.textAlign = 'left'; c.fillText('x', PX1 - 4, ay + 16); c.fillText('y', ax + 8, PY0 + 8);
  // whole-number marks
  c.font = '800 10px Nunito, system-ui, sans-serif'; c.fillStyle = 'rgba(255,236,220,0.55)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let x = Math.ceil(S.x0); x <= S.x1; x++) if (x) { const xx = X(S, x); if (xx > PX0 - 4 && xx < PX1 - 8) c.fillText(String(x).replace('-', '−'), xx, ay + 10); }
  c.textAlign = 'right'; for (let y = Math.ceil(S.y0 / ystep) * ystep; y <= S.y1; y += ystep) if (y) { const yy = Y(S, y); if (yy > PY0 + 4 && yy < PY1 - 4) c.fillText(String(y).replace('-', '−'), ax - 5, yy); }
  c.restore();
  // the curve: a glowing flight path
  const wob = S.wobAt != null && t - S.wobAt < 0.45 ? (1 - (t - S.wobAt) / 0.45) : 0, bad = S.curveBad != null;
  const pts = S.curvePts.map(([x, y]) => [x, y + (wob ? Math.sin(x * 0.09 + t * 45) * 5 * wob : 0)]);
  c.save(); c.beginPath(); c.rect(PX0 - 12, PY0 - 14, PX1 - PX0 + 24, PY1 - PY0 + 28); c.clip(); c.lineJoin = 'round'; c.lineCap = 'round';
  const path = () => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); };
  c.shadowColor = bad ? '#ff4a5a' : '#ffd890'; c.shadowBlur = 16; c.strokeStyle = bad ? 'rgba(255,90,100,0.5)' : 'rgba(255,214,140,0.45)'; c.lineWidth = 9; path(); c.stroke();
  c.shadowBlur = 0; c.strokeStyle = bad ? '#ff9aa0' : '#fff2c8'; c.lineWidth = 3.4; path(); c.stroke();
  // motes of light flowing along the path
  for (let k = 0; k < 7; k++) { const u = ((t * 0.12 + k / 7) % 1), q = pts[Math.floor(u * (pts.length - 1))]; if (q) glowDot(c, q[0], q[1], 1.6, 0.8, '#fff0b0'); }
  c.restore();
}

// ---------------- the reeds ----------------
function drawReed(g, c, S, p, i) {
  const t = g.t, P0 = pivot(S, p), L = S.L, cs = Math.cos(p.th), sn = Math.sin(p.th);
  const dragging = S.drag && S.drag.i === i, close = dragging && g.level < 2 && Math.abs(p.th - p.thT) <= TOL[g.level];
  const nudge = p.nudgeAt != null && t - p.nudgeAt < 0.25 ? Math.sin((t - p.nudgeAt) * 50) * 0.04 * (1 - (t - p.nudgeAt) / 0.25) : 0;
  const show = shown(g, p), th = lerp(p.th + nudge, p.thT, ease(show)), ex = Math.cos(th) * L, ey = Math.sin(th) * L;
  // a reed released far from the tangent becomes a secant: it stretches across the sky and cuts the path
  if (p.miss && show < 1) {
    const k = clamp((t - p.miss.at) / 0.2, 0, 1), ext = L + k * 420, ux = Math.cos(th), uy = Math.sin(th);
    c.save(); c.globalAlpha = 1 - show; c.beginPath(); c.rect(PX0 - 10, PY0 - 10, PX1 - PX0 + 20, PY1 - PY0 + 20); c.clip();
    c.setLineDash([9, 7]); c.strokeStyle = 'rgba(255,100,110,0.9)'; c.lineWidth = 3; c.beginPath(); c.moveTo(P0.x - ux * ext, P0.y - uy * ext); c.lineTo(P0.x + ux * ext, P0.y + uy * ext); c.stroke(); c.restore();
    if (k >= 1 && show <= 0) for (const xr of [p.a, ...p.miss.xs]) { const q = { x: X(S, xr), y: Y(S, S.f(xr)) }, pu = 0.5 + 0.5 * Math.sin(t * 12); c.strokeStyle = '#ff5a64'; c.lineWidth = 3; c.beginPath(); c.arc(q.x, q.y, 9 + pu * 3, 0, 7); c.stroke(); }
  }
  const col = show > 0 ? '#ffe27a' : p.miss ? '#ff6a70' : p.done ? '#8af0a0' : close ? '#ffe27a' : '#cbd879';
  c.save(); c.lineCap = 'round';
  if (p.done || close || show > 0) { c.shadowColor = p.done ? '#7aff9a' : '#ffd84a'; c.shadowBlur = p.done && t - p.snapAt < 0.3 ? 26 : 14; }
  c.strokeStyle = '#1c1430'; c.lineWidth = 7.5; c.beginPath(); c.moveTo(P0.x - ex, P0.y - ey); c.lineTo(P0.x + ex, P0.y + ey); c.stroke();
  c.shadowBlur = 0; c.strokeStyle = col; c.lineWidth = 4.2; c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(P0.x - ex - sn * 1.2, P0.y - ey + cs * 0.2 - 1); c.lineTo(P0.x + ex, P0.y + ey - 1); c.stroke();
  // nodes along the reed and a seed head on the free end
  c.fillStyle = '#1c1430'; for (const u of [-0.55, 0.45]) { c.beginPath(); c.arc(P0.x + ex * u, P0.y + ey * u, 2.6, 0, 7); c.fill(); }
  c.fillStyle = '#7a4a2a'; c.save(); c.translate(P0.x - ex, P0.y - ey); c.rotate(th); c.beginPath(); c.ellipse(-3, 0, 6, 3, 0, 0, 7); c.fill(); c.restore();
  c.restore();
  // the snap ring
  if (p.done && t - p.snapAt < 0.3) { const k = (t - p.snapAt) / 0.3; c.strokeStyle = `rgba(160,255,180,${1 - k})`; c.lineWidth = 3; c.beginPath(); c.arc(P0.x, P0.y, 8 + k * 36, 0, 7); c.stroke(); }
  // the pin at the point on the curve
  c.fillStyle = p.done ? '#c8ffd0' : '#fff6e0'; c.strokeStyle = '#2a1840'; c.lineWidth = 2.5; c.beginPath(); c.arc(P0.x, P0.y, 5.5, 0, 7); c.fill(); c.stroke();
  // the dragonfly on the handle end: it buzzes while carried and flutters when the reed snaps
  const hop = p.done && t - p.snapAt < 0.3 ? Math.sin((t - p.snapAt) / 0.3 * Math.PI) * 8 : 0;
  dragonfly(c, P0.x + ex - sn * hop, P0.y + ey - cs * hop - 3, th, 0.72, t + i * 1.7, DF_COLS[i % 3], dragging ? 1 : p.done && t - p.snapAt < 0.5 ? 0.8 : 0.05);
}
// the slope while turning: a rise-over-run triangle on the reed and the number
function drawReadout(g, c, S, p, i) {
  const t = g.t, T = S.T, dragging = S.drag && S.drag.i === i && S.drag.moved, hidden = g.mode === 'medium' && !p.revealed;
  let a = 0; if (dragging) a = 1; else if (p.done && !p.answered) a = 1; else if (p.done) a = 1 - clamp((t - (p.namedAt ?? 1e9) - 0.15) / 0.3, 0, 1); // the staircase fades once its slope is named
  if (p.miss) a = 1;
  const show = shown(g, p); if (show > 0) a = 0;
  const mc = p.done ? p.m : slopeOf(S, p.th), P0 = pivot(S, p);
  // once the reed has snapped, the staircase draws itself: the run first, then the rise, with the rise counting up
  const kr = p.done ? easeIO((t - p.snapAt - RUN * T) / (0.26 * T)) : 1, ku = p.done ? easeIO((t - p.snapAt - RISE * T) / (0.34 * T)) : 1;
  if (a > 0 && kr > 0) {
    const x1 = X(S, p.a + 1), y1 = Y(S, p.fa + mc), xr = lerp(P0.x, x1, kr), yr = lerp(P0.y, y1, ku);
    c.save(); c.globalAlpha = a; c.beginPath(); c.rect(PX0 - 10, PY0 - 16, PX1 - PX0 + 20, PY1 - PY0 + 32); c.clip();
    if (ku > 0) { c.fillStyle = p.done ? 'rgba(140,255,170,0.16)' : 'rgba(255,230,140,0.16)'; c.beginPath(); c.moveTo(P0.x, P0.y); c.lineTo(x1, P0.y); c.lineTo(x1, yr); c.closePath(); c.fill(); }
    c.lineCap = 'round'; c.lineWidth = 3; c.strokeStyle = '#7ad8ff'; c.shadowColor = '#7ad8ff'; c.shadowBlur = p.done && kr < 1 ? 10 : 0; c.beginPath(); c.moveTo(P0.x, P0.y); c.lineTo(xr, P0.y); c.stroke();
    if (kr < 1 && p.done) glowDot(c, xr, P0.y, 2, 1, '#bfefff');
    if (ku > 0) { c.strokeStyle = '#ff9ac8'; c.shadowColor = '#ff9ac8'; c.shadowBlur = p.done && ku < 1 ? 10 : 0; c.beginPath(); c.moveTo(x1, P0.y); c.lineTo(x1, yr); c.stroke(); c.shadowBlur = 0;
      if (ku < 1 && p.done) glowDot(c, x1, yr, 2, 1, '#ffd0e8'); }
    const up = y1 < P0.y; c.font = '900 13px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#9ae4ff'; c.globalAlpha = a * clamp(kr * 2, 0, 1); c.fillText('1', (P0.x + x1) / 2, P0.y + (up ? 10 : -10)); c.globalAlpha = a;
    if (ku > 0 && Math.abs(y1 - P0.y) > 6) { const right = x1 < PX1 - 26, v = p.done && ku < 1 ? Math.round(mc * ku) : mc; c.textAlign = right ? 'left' : 'right'; c.fillStyle = '#ffb4d8';
      c.font = `900 ${p.done && ku >= 1 && t - p.snapAt - RISE * T - 0.34 * T < 0.25 ? 16 : 13}px Nunito, system-ui, sans-serif`; c.fillText(hidden ? '?' : fmt(v), x1 + (right ? 6 : -6), (P0.y + yr) / 2); }
    c.restore();
  }
  // the slope label: the live slope while turning; once found it is named f′(a) = slope, in real notation
  const named = !dragging && (p.done || show > 0);
  if (dragging || p.miss || show > 0 || (p.done && p.namedAt != null)) {
    const gold = show > 0, h = handleAt(S, p, gold ? p.thT : p.th), above = h.y - 34 > PY0; let lx = clamp(h.x, 44, 316), ly = above ? h.y - 24 : h.y + 26;
    if (named) { const q = pillPos(S, p); lx = q.x; ly = q.y; }
    const pk = p.namedAt != null && !gold ? clamp((t - p.namedAt) / 0.3, 0, 1) : 1, sc = 1 + Math.sin(pk * Math.PI) * 0.3;
    const txt = named ? `f′(${fmt(p.a)}) = ${fmt(p.m)}` : 'slope ' + (g.mode === 'medium' ? '?' : fmt(mc)), size = named ? 13 : 15;
    c.save(); c.globalAlpha = gold ? show : pk; c.translate(lx, ly); c.scale(sc, sc); c.translate(-lx, -ly); c.font = `900 ${size}px Nunito, system-ui, sans-serif`; const w = c.measureText(txt).width + 16, hh = size + 9;
    c.fillStyle = gold ? 'rgba(80,56,10,0.88)' : p.miss ? 'rgba(120,20,40,0.85)' : p.done ? 'rgba(20,70,50,0.85)' : 'rgba(30,20,60,0.85)'; c.beginPath(); rr(c, lx - w / 2, ly - hh / 2, w, hh, hh / 2); c.fill();
    c.strokeStyle = gold ? '#ffd84a' : p.miss ? '#ff7a80' : p.done ? '#8af0a0' : 'rgba(255,230,180,0.6)'; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = gold ? '#ffe9a0' : p.miss ? '#ffd0d4' : p.done ? '#d8ffe0' : INKL; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, lx, ly + 1); c.restore();
  }
  // the dragonfly's firefly drops from the pin straight down to the pond, at height f′(a)
  if (p.dropAt != null && !p.answered) { const k = easeIO((t - p.dropAt) / p.dropDur), x = X(S, p.a), y = lerp(P0.y, MYv(S, p.m), k);
    const gr = c.createLinearGradient(0, P0.y, 0, y); gr.addColorStop(0, 'rgba(234,255,138,0)'); gr.addColorStop(1, 'rgba(234,255,138,0.6)'); c.strokeStyle = gr; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, P0.y); c.lineTo(x, y); c.stroke();
    glowDot(c, x, y, 3.4, 1, '#eaff8a'); }
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- guidance ----------------
// after a miss or a timeout: 0..1 as an unfinished reed swings to its true tangent, in gold
function shown(g, p) { return g.done && g.result === 'fail' && !p.done ? clamp((g.t - g.doneAt - 0.4) / 0.25, 0, 1) : 0; }
function drawGuide(g, c, S) {
  const t = g.t, K = S.mk;
  if (g.done) return; // after a miss or a timeout the unfinished reeds swing to their tangents themselves (see shown)
  if (K.ask || M.showing(g)) return; // the guide waits while the working is shown
  const i = S.pts.findIndex(p => !p.done); if (i < 0 || S.drag) return; const p = S.pts[i];
  const h0 = handleAt(S, p, p.th);
  M.glowBox(c, { x: h0.x, y: h0.y, w: 30, h: 30 }, t, 0.9, true); // the next reed always glows (owner's rule)
  if ((g.level !== 0 && t - (S.lastMoveT || 0) < 2) || t < 0.45) return; // the ghost hand: level 0, or after a 2 s pause
  // level 0: a ghost hand turns the reed to the tangent, again and again
  const per = 1.6, k = ((t - 0.45) % per) / per, e = easeIO(clamp((k - 0.14) / 0.55, 0, 1)), th = lerp(p.th, p.thT, e), fade = k > 0.86 ? (1 - k) / 0.14 : 1;
  M.glowBox(c, { x: h0.x, y: h0.y, w: 28, h: 28 }, t, 0.55, true);
  const P0 = pivot(S, p), ex = Math.cos(th) * S.L, ey = Math.sin(th) * S.L;
  c.save(); c.globalAlpha = 0.6 * fade; c.strokeStyle = '#ffe27a'; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = '#ffd84a'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(P0.x - ex, P0.y - ey); c.lineTo(P0.x + ex, P0.y + ey); c.stroke(); c.shadowBlur = 0;
  c.setLineDash([5, 6]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2.5; c.beginPath();
  c.arc(P0.x, P0.y, S.L, Math.min(p.th, p.thT), Math.max(p.th, p.thT)); c.stroke(); c.restore();
  c.save(); c.globalAlpha = fade; M.hand(c, P0.x + ex + 2, P0.y + ey + 4, 1, k < 0.14 || k > 0.7 ? 1 : 0); c.restore();
}

// ---------------- the pond graph: f′ ----------------
function drawPond(g, c, S) {
  const t = g.t;
  c.save(); c.beginPath(); c.rect(PX0 - 10, MY0 - 8, PX1 - PX0 + 20, MY1 - MY0 + 14); c.clip();
  // ripple lines for whole-number heights, and the same columns as the sky
  c.strokeStyle = 'rgba(170,190,255,0.12)'; c.lineWidth = 1; c.beginPath();
  for (let x = Math.ceil(S.x0); x <= S.x1; x++) { const xx = X(S, x); c.moveTo(xx, MY0 - 8); c.lineTo(xx, MY1 + 6); }
  const st = S.msy >= 9 ? 1 : 2; for (let v = Math.ceil(S.d0 / st) * st; v <= S.d1; v += st) { const yy = MYv(S, v); c.moveTo(PX0 - 10, yy); c.lineTo(PX1 + 10, yy); }
  c.stroke();
  const ax = X(S, 0), ay = MYv(S, 0);
  c.strokeStyle = 'rgba(190,200,140,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(PX0 - 8, ay); c.lineTo(PX1 + 6, ay); c.moveTo(ax, MY1 + 6); c.lineTo(ax, MY0 - 8); c.stroke();
  c.font = '800 9px Nunito, system-ui, sans-serif'; c.fillStyle = 'rgba(220,226,255,0.5)'; c.textAlign = 'right'; c.textBaseline = 'middle';
  for (let v = Math.ceil(S.d0 / st) * st; v <= S.d1; v += st) if (v) { const yy = MYv(S, v); if (yy > MY0 && yy < MY1 - 2) c.fillText(String(v).replace('-', '−'), ax - 4, yy); }
  // a dotted column under each point: where its firefly will land
  S.pts.forEach(p => { if (p.answered) return; const xx = X(S, p.a); c.strokeStyle = 'rgba(234,255,138,0.28)'; c.lineWidth = 1.5; c.setLineDash([2, 5]); c.beginPath(); c.moveTo(xx, MY0 - 6); c.lineTo(xx, MY1 + 4); c.stroke(); c.setLineDash([]); });
  // the reveal: the derivative curve drawn across the water through the fireflies
  if (S.revealAt != null) {
    const k = easeIO(clamp((t - S.revealAt) / 0.6, 0, 1)), xe = S.x0 + (S.x1 - S.x0) * k;
    c.lineJoin = 'round'; c.lineCap = 'round'; const path = () => { c.beginPath(); for (let i = 0; i <= 160; i++) { const x = S.x0 + (xe - S.x0) * i / 160, yy = MYv(S, S.df(x)); i ? c.lineTo(X(S, x), yy) : c.moveTo(X(S, x), yy); } };
    c.shadowColor = '#d8ff6a'; c.shadowBlur = 14; c.strokeStyle = 'rgba(220,255,120,0.45)'; c.lineWidth = 8; path(); c.stroke(); c.shadowBlur = 0; c.strokeStyle = '#f2ffb8'; c.lineWidth = 3; path(); c.stroke();
    if (k < 1) glowDot(c, X(S, xe), MYv(S, S.df(xe)), 2.4, 1, '#eaff8a');
  }
  c.restore();
  // fireflies: one for each slope found
  S.pts.forEach((p, i) => {
    if (!p.answered) return; const k = clamp((t - p.dotAt) / 0.25, 0, 1), x = X(S, p.a), y = MYv(S, p.m) + Math.sin(t * 3 + i) * 1.2, pop = 1 + Math.sin(k * Math.PI) * 0.8;
    if (t - p.dotAt < 0.35) { const P0 = pivot(S, p), q = 1 - (t - p.dotAt) / 0.35, gr = c.createLinearGradient(0, P0.y, 0, y); gr.addColorStop(0, 'rgba(234,255,138,0)'); gr.addColorStop(1, `rgba(234,255,138,${0.7 * q})`); c.strokeStyle = gr; c.lineWidth = 3; c.beginPath(); c.moveTo(x, P0.y + 8); c.lineTo(x, y); c.stroke(); }
    glowDot(c, x, y, 3.2 * pop, 0.75 + 0.25 * Math.sin(t * 5 + i), '#eaff8a');
    c.save(); c.translate(x, y); c.fillStyle = 'rgba(255,255,255,0.5)'; const fl = Math.abs(Math.sin(t * 30 + i)); c.beginPath(); c.ellipse(-3, -3, 3, 1.4 + fl, -0.6, 0, 7); c.ellipse(3, -3, 3, 1.4 + fl, 0.6, 0, 7); c.fill(); c.restore();
    c.font = '900 11px Nunito, system-ui, sans-serif'; c.fillStyle = '#efffc0'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(fmt(p.m), x + 8, y - 7);
  });
  // the label
  const e = g.s.mk.ex.fp; if (e) {
    const m = e.node._m || M.lay(e.node, e.s), pk = S.labPop != null ? clamp((t - S.labPop) / 0.25, 0, 1) : 1, sc = 1 + Math.sin(pk * Math.PI) * 0.25;
    c.save(); const cx = e.x + m.w / 2, cy = e.y - (m.a - m.d) / 2; c.translate(cx, cy); c.scale(sc, sc); c.translate(-cx, -cy);
    c.fillStyle = 'rgba(14,10,34,0.62)'; c.beginPath(); rr(c, e.x - 6, e.y - m.a - 4, m.w + 12, m.a + m.d + 8, 9); c.fill();
    M.drawEx(g, c, 'fp'); c.restore();
  }
}

// ---------------- the frog ----------------
function drawFrog(g, c, S) {
  const t = g.t, f = S.frog, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const hk = (t - f.hopT) / 0.45, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0, x = 46, y = 614 - hop * 14 - (won ? Math.abs(Math.sin(t * 8)) * 6 : 0);
  // ripples around the pad
  for (let i = 0; i < 2; i++) { const k = (t * 0.5 + i / 2) % 1; c.strokeStyle = `rgba(255,220,200,${0.25 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(46, 620, 38 + k * 40, (38 + k * 40) * 0.36, 0, 0, 7); c.stroke(); }
  if (S.splashAt != null && t - S.splashAt < 0.5) { const k = (t - S.splashAt) / 0.5; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.15 + 0.7 * i / 6); glowDot(c, 46 + Math.cos(a) * 30 * k, 614 + Math.sin(a) * 40 * k + 60 * k * k, 1.6, 1 - k, '#bfe0ff'); } }
  const expr = won ? 'laugh' : lost ? 'sad' : hop > 0 ? 'wow' : t - f.shrugAt < 0.5 ? 'think' : 'happy', pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  // where the frog looks: at the reed being turned, or the firefly that just landed
  let lx = 1, ly = -0.4; const tgt = S.drag ? S.pts[S.drag.i] : f.look >= 0 ? S.pts[f.look] : null;
  if (tgt) { const tx = X(S, tgt.a), ty = tgt.answered ? MYv(S, tgt.m) : Y(S, tgt.fa), d = Math.hypot(tx - x, ty - y + 40) || 1; lx = (tx - x) / d; ly = (ty - y + 40) / d; }
  try { if (typeof ANI !== 'undefined' && ANI.draw) { ANI.draw(c, 'frog', x, y, 0.85, { t, pose, expr, facing: 1 }); return; } } catch (e) { }
  frogArt(c, x, y, 0.85, { t, expr, pose, lx, ly });
}
// a frog in dusk light (used until the shared animal cast is available)
function frogArt(c, x, y, s, o) {
  const t = o.t, br = 1 + Math.sin(t * 3) * 0.025, blink = (t % 3.4) < 0.12;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(8,6,24,0.35)'; c.beginPath(); c.ellipse(2, 2, 26, 6, 0, 0, 7); c.fill();
  // back legs
  c.fillStyle = '#3e8a46'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 17, -6, 11, 7, sd * 0.3, 0, 7); c.fill(); }
  // body
  c.save(); c.scale(1, br); const bg = c.createRadialGradient(-6, -26, 4, 0, -16, 30); bg.addColorStop(0, '#9ade78'); bg.addColorStop(1, '#3f8a44'); c.fillStyle = bg;
  c.beginPath(); c.ellipse(0, -17, 23, 18, 0, 0, 7); c.fill();
  c.fillStyle = '#e4f4b0'; c.beginPath(); c.ellipse(0, -11, 14, 10, 0, 0, 7); c.fill();
  c.strokeStyle = 'rgba(255,190,150,0.65)'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -17, 23, 18, 0, Math.PI * 1.15, Math.PI * 1.7); c.stroke(); // warm rim light from the sunset
  c.restore();
  // front feet (raised when cheering)
  c.fillStyle = '#4f9a4a'; for (const sd of [-1, 1]) { if (o.pose === 'cheer') { c.save(); c.translate(sd * 18, -26); c.rotate(sd * -0.6); c.beginPath(); c.ellipse(0, -6, 4, 9, 0, 0, 7); c.fill(); c.restore(); } else { c.beginPath(); c.ellipse(sd * 10, -2, 6, 3.5, 0, 0, 7); c.fill(); } }
  // eyes on top
  for (const sd of [-1, 1]) {
    const ex = sd * 10, ey = -33; c.fillStyle = '#56a850'; c.beginPath(); c.arc(ex, ey, 8.5, 0, 7); c.fill();
    if (blink || o.expr === 'laugh') { c.strokeStyle = '#1c2a18'; c.lineWidth = 2; c.beginPath(); c.arc(ex, ey + 1, 4.5, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); continue; }
    c.fillStyle = '#fffbea'; c.beginPath(); c.arc(ex, ey, 6.2, 0, 7); c.fill();
    const big = o.expr === 'wow' ? 3.6 : 3; c.fillStyle = '#1c1420'; c.beginPath(); c.arc(ex + o.lx * 2.6, ey + o.ly * 2.6, big, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + o.lx * 2.6 - 1, ey + o.ly * 2.6 - 1.2, 1, 0, 7); c.fill();
    if (o.expr === 'sad') { c.strokeStyle = '#1c2a18'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(ex - 6, ey - 9 + sd * -2); c.lineTo(ex + 5, ey - 9 + sd * 2); c.stroke(); }
  }
  // mouth and cheeks
  c.strokeStyle = '#1c2a18'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath();
  if (o.expr === 'sad') c.arc(0, -13, 7, Math.PI * 1.2, Math.PI * 1.8);
  else if (o.expr === 'wow' || o.expr === 'laugh') { c.fillStyle = '#7a2a3a'; c.ellipse(0, -19, 5, o.expr === 'laugh' ? 4 : 3.4, 0, 0, 7); c.fill(); }
  else if (o.expr === 'think') { c.moveTo(-5, -20); c.lineTo(5, -21); }
  else c.arc(0, -24, 9, Math.PI * 0.2, Math.PI * 0.8);
  c.stroke();
  c.fillStyle = 'rgba(255,140,150,0.45)'; c.beginPath(); c.ellipse(-15, -21, 4, 2.4, 0, 0, 7); c.ellipse(15, -21, 4, 2.4, 0, 0, 7); c.fill();
  c.restore();
}
