// arrows_magnitude.js — MAGNITUDE! The length of a vector: |(a, b)| = √(a² + b²), the Pythagorean theorem on its two legs.
// A frozen lake at twilight under an aurora. The problem is painted on a snowy wooden sign; under it the vector is an arrow
// scratched into the ice, with its two legs (across, then up) dashed beside it. A penguin skates about on the shore.
// Moves (show your work: each one plays its working by itself while the fuse stands still):
//   1. Tap the vector (or the arrow): the legs light up one after the other, a right-angle mark draws itself at the corner,
//      the "?" fades, and copies of a and b fly out of the vector into a square root that draws itself: = √(a² + b²).
//   2. (either order with 3) Tap a²: a square of a × a ice tiles grows off the across leg, row by row, while "a × a = a²"
//      writes itself under the term; the square's area pops up inside it and a² rolls over to its value.
//   3. Tap b²: the same for the up leg.
//   4. Tap the sum: "a² + b² = s" writes itself, the two areas fly out of their squares and meet beside the arrow as one
//      number, and the + b² slides into a², which rolls over to the sum.
//   5. Tap the root: "□ × □ = s" writes itself, the boxes fill with the root, the root sign melts away, the sum rolls over
//      to the length, and tick marks pop one by one along the arrow, measuring it.
// Level 0: (3, 4) or (4, 3). Level 1: (6, 8) or (8, 6). Level 2: (5, 12), (12, 5), (9, 12) or (12, 9).
// Medium mode: each square, the sum and the root are picked from the tray.
const M = MK, INK = '#1c2a52', XC = '#ff7a45', YC = '#7a5cff', AC = '#e0306a', NOTE = '#fff4e2', EQY = 222, HX = 292, HY = 606;
function pick(g) {
  const L = g.level, list = L === 0 ? [[3, 4]] : L === 1 ? [[6, 8]] : [[5, 12], [9, 12]], [p, q] = list[Math.floor(g.rand() * list.length)];
  const [a, b] = g.rand() < 0.5 ? [p, q] : [q, p];
  return { a, b, s: a * a + b * b, c: Math.round(Math.sqrt(a * a + b * b)) };
}
// MK draws an empty slot without starting a new path, so it re-strokes the symbol before it dashed; a zero-width op first
// starts a fresh path.
const fresh = (slot, s) => M.row(M.op(''), M.gap(-0.44 * s), slot);
const kk = (g, a) => a ? M.clamp((g.t - a.t0) / a.dur, 0, 1) : 0;
// a node drawn centred on (cx, cy)
function put(g, c, n, cx, cy, s, col, alpha = 1) { const m = M.lay(n, s); c.save(); c.globalAlpha *= alpha; M.draw(c, n, cx - m.w / 2, cy + (m.a - m.d) / 2, s, { t: g.t, col }); c.restore(); }
function pill(c, b, alpha, col = 'rgba(28,42,82,0.86)', wk = 1) { if (!b || alpha <= 0) return; c.save(); c.globalAlpha *= alpha * Math.min(1, wk * 4); c.fillStyle = col; c.beginPath(); c.roundRect(b.x - b.w / 2 - 10, b.y - b.h / 2 - 6, Math.max(24, (b.w + 20) * wk), b.h + 12, 12); c.fill(); c.restore(); }

MG.add({
  id: 'magnitude', stage: 'arrows', cmd: 'MAGNITUDE!', hint: 'tap', time: 10, winText: 'Measured!', hold: 1.8,
  card: {
    title: 'The length of a vector', ref: 'Grade 11 and up', kind: 'Precalculus',
    text: 'The magnitude of a vector is how long its arrow is. We write it with bars: |(6, 8)|.\n\nThe arrow for (6, 8) goes 6 across and 8 up. Those two steps and the arrow make a right triangle, and the arrow is its longest side. So the Pythagorean theorem gives its length.\n\nSquare each step: 6² = 36 and 8² = 64. Add them: 36 + 64 = 100. Then take the square root: √100 = 10, because 10 × 10 = 100. So |(6, 8)| = 10. You can check it with a ruler: the arrow is exactly 10 steps long.',
    note: 'Square each component, add the squares, and take the square root: |(a, b)| = √(a² + b²).',
    ask: 'What is |(3, 4)|? What is |(5, 12)|?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), { a, b, s, c } = p;
    // the ice grid: the triangle plus the two leg squares (the across square hangs below the axis, the up square to the right)
    const W = a + b, Hh = a + b; S.u = Math.min(30, 300 / (W + 0.8), 236 / (Hh + 0.8));
    S.ox = 180 - W / 2 * S.u; S.oy = 410 + (b - a) / 2 * S.u;
    S.X = x => S.ox + x * S.u; S.Y = y => S.oy - y * S.u;
    // the expression, from nodes that are reused so symbols glide when it is rewritten
    S.va = M.num(a, 'va'); S.vb = M.num(b, 'vb'); S.vec = M.paren(M.row(S.va, M.op(','), M.gap(4), S.vb), 'vec');
    S.bl = M.txt('|', 'bl'); S.br = M.txt('|', 'br'); S.eqN = M.op('=', 'eq');
    S.ans = M.slot('ans', { w: 34 });
    S.lhs = M.row(S.bl, S.vec, S.br);
    const lhsW = M.lay(M.row(M.gap(20), M.paren(M.row(M.num(a), M.op(','), M.gap(4), M.num(b))), M.op('=')), 40).w;
    const r1 = M.lay(M.row(M.gap(26), M.sup(M.num(a), M.num(2)), M.op('+'), M.sup(M.num(b), M.num(2))), 40).w, r2 = M.lay(M.row(M.gap(26), M.num(a * a), M.op('+'), M.num(b * b)), 40).w;
    S.fs = Math.min(40, 40 * 318 / (lhsW + Math.max(r1, r2))); S.rhs = [fresh(S.ans, S.fs)];
    S.relay = () => M.place(g, 'eq', M.row(S.lhs, S.eqN, S.rhs), 180, EQY, S.fs, { col: INK });
    S.relay(); M.inert(g, ['eq', 'bl', 'br', 'rg', 'nt', 'q', 's1', 's2']);
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, e) => { S.hopT = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    S.zones = () => {
      const mx = (S.X(0) + S.X(a)) / 2, my = (S.Y(0) + S.Y(b)) / 2;
      M.zone(g, 'arrow', { x: mx, y: my, w: Math.max(50, Math.abs(S.X(a) - S.X(0)) * 0.6), h: Math.max(50, Math.abs(S.Y(b) - S.Y(0)) * 0.6) });
      if (S.pyth) { M.zone(g, 'boxA', { x: S.X(a / 2), y: S.Y(-a / 2), w: a * S.u, h: a * S.u }); M.zone(g, 'boxB', { x: S.X(a + b / 2), y: S.Y(b / 2), w: b * S.u, h: b * S.u }); }
    };
    S.zones();
    g.dur *= (2.6 + 1.05 * 5) / 8;
    // working notes write themselves under the term being worked on, on a dark pill so they read on the ice
    const noteAt = (g, node, at) => { const bx = M.box(g, at); node.id = 'nt'; M.place(g, 'note', node, bx ? M.clamp(bx.x, 110, 250) : 180, EQY + 50, 26, { col: NOTE }); S.noteA = 1; M.writeIn(g, node, { dur: 0.4 * T, delay: 0.08 * T }); };
    const noteOff = (g, d) => { const e = g.s.mk.ex.note; if (!e) return; M.tween(g, e.node, { alpha: 0 }, 0.3 * T, { delay: d });
      M.at(g, [[d + 0.35 * T, g => { if (g.s.mk.ex.note && g.s.mk.ex.note.node === e.node) { delete g.s.mk.ex.note; if (g.s.mk.prevNodes) delete g.s.mk.prevNodes.note; } }]]); };
    // squaring one component: its leg's square fills with tiles, and the term rolls over to the area
    const square = (key) => { const A = key === 'A', v = A ? a : b, col = A ? XC : YC;
      return { tap: ['sq' + key, 'n' + key, 'e' + key, 'box' + key], busy: 0.1, askAt: 0.75 * T, after: 1.0 * T, ask: { v: v * v, wrong: [2 * v, v + 2, v * v + v] },
        then(g) { S['did' + key] = 1; M.show(g, 0.75 * T); S.point = true; hop(g, 'think');
          M.circle(g, 'sq' + key, { dur: 0.5 * T, col }); S['fill' + key] = { t0: g.t + 0.1 * T, dur: 0.65 * T }; g.sfx('sweep');
          for (let i = 0; i < Math.min(v, 6); i++) M.at(g, [[0.1 * T + 0.65 * T * (i + 0.6) / Math.min(v, 6), g => g.sfx('tap')]]);
          S.q = M.num(v * v, 'q', { alpha: 0 }); noteAt(g, M.row(M.num(v), M.op('×'), M.num(v), M.op('='), S.q), 'sq' + key); },
        resolve(g) { M.show(g, 1.0 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.12 * T, dur: 0.3 * T }); g.sfx('ding');
          S['lab' + key] = g.t + 0.15 * T; const sq = S['sq' + key], n = sq.base;
          M.at(g, [[0.3 * T, g => { M.tween(g, sq.exp, { alpha: 0, sc: 0.5 }, 0.22 * T); M.roll(g, n, v * v, { dur: 0.35 * T }); n.col = col; g.sfx('pop'); hop(g); M.sparkle(g, 'box' + key, { n: 10, cols: [col, '#fff'] }); }],
            [0.75 * T, g => { const i = S.rin.items.indexOf(sq); if (i >= 0) S.rin.items[i] = n; S.relay(); }]]);
          noteOff(g, 0.55 * T); } }; };
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. the vector's length is the hypotenuse of the triangle its legs make
        if (!S.pyth) out.push({ tap: ['vec', 'va', 'vb', 'arrow'], busy: 0.1,
          then(g) { S.pyth = true; M.show(g, 1.35 * T); S.point = true; hop(g, 'think'); S.zones();
            M.circle(g, ['bl', 'vec', 'br'], { dur: 0.5 * T, col: AC }); S.legT = g.t; g.sfx('sweep');
            M.tween(g, S.ans, { alpha: 0 }, 0.25 * T, { delay: 0.3 * T });
            M.at(g, [[0.45 * T, g => { S.rightT = g.t; g.sfx('tap'); }],
              [0.6 * T, g => { // = √(a² + b²): the root draws itself and copies of a and b fly out of the vector into it
                S.nA = M.num(a, 'nA', { alpha: 0 }); S.nB = M.num(b, 'nB', { alpha: 0 });
                S.sqA = M.sup(S.nA, M.num(2, 'eA', { alpha: 0 }), 'sqA'); S.sqB = M.sup(S.nB, M.num(2, 'eB', { alpha: 0 }), 'sqB');
                S.pl = M.op('+', 'pl', { alpha: 0 }); S.rin = M.row(S.sqA, S.pl, S.sqB); S.rin.id = 'rin'; S.rg = { ...M.gap(S.fs * 0.62), id: 'rg' };
                S.rhs = [S.rg, S.rin]; S.relay(); S.rad = { t0: g.t, dur: 0.45 * T }; g.sfx('whoosh');
                for (const [from, to, n, arc] of [['va', 'nA', S.nA, -40], ['vb', 'nB', S.nB, -55]]) { const fb = M.box(g, from);
                  M.fly(g, { node: M.num(n === S.nA ? a : b), from: [fb.x, fb.y], to, dur: 0.4 * T, arc, s0: S.fs, s1: S.fs, col: n === S.nA ? XC : YC, then(g) { n.alpha = 1; n.pop = g.t; g.sfx('pop'); } }); } }],
              [1.05 * T, g => { for (const e of [S.sqA.exp, S.sqB.exp]) { e.alpha = 1; M.writeIn(g, e, { dur: 0.2 * T }); } S.pl.alpha = 1; S.pl.pop = g.t; hop(g); g.sfx('tap'); }],
              [1.3 * T, g => { S.point = false; }]]); } });
        else {
          // 2-3. square each component
          if (!S.didA) out.push(square('A'));
          if (!S.didB) out.push(square('B'));
          // 4. add the squares
          if (S.didA && S.didB && !S.sum) out.push({ tap: ['nA', 'pl', 'nB', 'rin'], busy: 0.1, askAt: 0.65 * T, after: 1.05 * T, ask: { v: s, wrong: [s - 10, s + 10, (a + b) * (a + b)] },
            then(g) { S.sum = true; M.show(g, 0.65 * T); S.point = true; hop(g, 'think'); M.circle(g, 'rin', { dur: 0.5 * T, col: '#ffb21f' }); S.pulse = { t0: g.t, dur: 0.6 * T };
              S.q = M.num(s, 'q', { alpha: 0 }); noteAt(g, M.row(M.num(a * a), M.op('+'), M.num(b * b), M.op('='), S.q), 'rin'); },
            resolve(g) { M.show(g, 1.05 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.12 * T, dur: 0.3 * T }); g.sfx('ding');
              S.merge = { t0: g.t + 0.15 * T, dur: 0.5 * T }; g.sfx('whoosh');
              M.at(g, [[0.3 * T, g => { const tb = M.box(g, 'nA'); for (const q of [S.pl, S.nB]) { const sb = M.box(g, q.id); M.tween(g, q, { dx: tb && sb ? tb.x - sb.x : -30, alpha: 0, sc: 0.5 }, 0.3 * T); }
                  M.roll(g, S.nA, s, { delay: 0.1 * T, dur: 0.36 * T }); S.nA.col = AC; g.sfx('sweep'); }],
                [0.68 * T, g => { S.hypT = g.t; M.sparkle(g, [S.hx, S.hy], { n: 12, cols: [AC, '#fff', '#ffd45a'] }); g.sfx('pop'); hop(g); }],
                [0.85 * T, g => { S.rin.items = [S.nA]; S.relay(); S.point = false; }]]);
              noteOff(g, 0.6 * T); } });
          // 5. take the square root: the length of the arrow
          if (S.sum && !S.root) out.push({ tap: ['nA', 'rin', 'rg'], busy: 0.1, askAt: 0.6 * T, after: 1.45 * T, ask: { v: c, wrong: [c + 1, c - 1, a + b] },
            then(g) { S.root = true; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); M.circle(g, ['rg', 'rin'], { dur: 0.5 * T, col: AC });
              S.s1 = M.slot('s1', { w: 26 }); S.s2 = M.slot('s2', { w: 26 }); noteAt(g, M.row(S.s1, M.op('×'), fresh(S.s2, 26), M.op('='), M.num(s)), 'rin'); },
            resolve(g) { M.show(g, 1.45 * T); for (const sl of [S.s1, S.s2]) { sl.fill = M.num(c, null, { col: '#ffd45a' }); sl.pop = g.t; } g.sfx('ding');
              M.at(g, [[0.25 * T, g => { S.radOut = { t0: g.t, dur: 0.3 * T }; M.roll(g, S.nA, c, { delay: 0.05 * T, dur: 0.35 * T }); g.sfx('sweep'); }],
                [0.55 * T, g => { S.rhs = [S.nA]; S.relay(); }],
                [0.35 * T, g => { S.ruler = { t0: g.t, dur: 0.85 * T }; for (let i = 1; i <= Math.min(c, 8); i++) M.at(g, [[0.85 * T * i / Math.min(c, 8), g => g.sfx('tap')]]); }],
                [1.25 * T, g => { S.lenT = g.t; M.sparkle(g, [S.X(a), S.Y(b)], { n: 14, cols: [AC, '#fff', '#ffd45a'] }); M.indicate(g, S.nA, { dur: 0.35 * T, col: AC }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; }]]);
              noteOff(g, 0.5 * T); } });
        }
        return out;
      },
      area(g) { return !S.pyth ? ['vec'] : !S.didA || !S.didB ? ['sqA', 'sqB'] : ['rin']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, { a, b, s } = p, u = S.u, X = S.X, Y = S.Y;
    c.drawImage(g.bake('mag_bg', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    ambient(c, t);
    // the grid scratched into the ice, over the whole figure
    c.save(); c.lineWidth = 1; c.strokeStyle = 'rgba(255,255,255,0.55)';
    for (let i = 0; i <= a + b; i++) { c.beginPath(); c.moveTo(X(i), Y(b + 0.4)); c.lineTo(X(i), Y(-a - 0.4)); c.stroke(); }
    for (let j = -a; j <= b; j++) { c.beginPath(); c.moveTo(X(-0.4), Y(j)); c.lineTo(X(a + b + 0.4), Y(j)); c.stroke(); }
    c.strokeStyle = 'rgba(40,70,120,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(X(-0.4), Y(0)); c.lineTo(X(a + b + 0.4), Y(0)); c.moveTo(X(0), Y(-a - 0.4)); c.lineTo(X(0), Y(b + 0.4)); c.stroke(); c.restore();
    // the two leg squares: tiles drop in row by row, outward from the leg
    const tiles = (key, n, cell, col, edge) => { const f = S['fill' + key]; if (!f) return; const pulse = S.pulse ? Math.sin(kk(g, S.pulse) * Math.PI) : 0;
      for (let i = 0; i < n * n; i++) { const r = Math.floor(i / n), q = i % n, at = f.t0 + f.dur * (r / n + q / (n * n)), k = M.clamp((t - at) / 0.2, 0, 1); if (k <= 0) continue;
        const [cx, cy] = cell(r, q), e = M.ease(k), sz = u * (0.55 + 0.45 * e) - 1.5; c.save(); c.globalAlpha = Math.min(1, k * 2);
        c.fillStyle = M.mix(col, '#ffffff', 0.25 - 0.2 * pulse); c.fillRect(cx - sz / 2, cy - sz / 2, sz, sz); c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(cx - sz / 2 + 1, cy - sz / 2 + 1, sz - 2, Math.max(1.5, sz * 0.2)); c.restore(); }
      if (t > f.t0 + f.dur) { c.save(); c.strokeStyle = edge; c.lineWidth = 2.5 + pulse * 2; if (pulse) { c.shadowColor = col; c.shadowBlur = 14 * pulse; } const [x0, y0, x1, y1] = key === 'A' ? [X(0), Y(0), X(a), Y(-a)] : [X(a), Y(0), X(a + b), Y(b)]; c.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0)); c.restore(); } };
    tiles('A', a, (r, q) => [X(q + 0.5), Y(-r - 0.5)], XC, '#c8501e');
    tiles('B', b, (r, q) => [X(a + r + 0.5), Y(q + 0.5)], YC, '#4a30c0');
    // each square's area, inside it; during the sum both fly to sit beside the arrow as one number
    const mk = S.merge ? M.easeIO(kk(g, S.merge)) : 0, mx = (X(0) + X(a)) / 2, my = (Y(0) + Y(b)) / 2, L = Math.hypot(X(a) - X(0), Y(b) - Y(0)), nx = (Y(b) - Y(0)) / L, ny = -(X(a) - X(0)) / L;
    S.hx = mx + nx * 30; S.hy = my + ny * 30; // the outer side of the arrow (up and to the left)
    for (const [key, v, cx, cy, col] of [['A', a, X(a / 2), Y(-a / 2), '#8a2e0a'], ['B', b, X(a + b / 2), Y(b / 2), '#2a1680']]) { const lt = S['lab' + key]; if (lt == null || t < lt || S.hypT != null) continue;
      const pk = M.clamp((t - lt) / 0.3, 0, 1), sz = Math.min(28, v * u * 0.42) * (1 + Math.sin(pk * Math.PI) * 0.35) * (1 - 0.3 * mk);
      put(g, c, M.num(v * v), M.lerp(cx, S.hx, mk), M.lerp(cy, S.hy, mk) - Math.sin(mk * Math.PI) * 30, M.lerp(sz, 24, mk), col, pk); }
    // the legs (across, then up), dashed, glowing when they are worked on
    const legK = (key) => { let gk = 0; if (S.legT != null) { const d = t - S.legT - (key === 'A' ? 0.05 : 0.3); gk = d > 0 && d < 0.7 ? Math.sin(d / 0.7 * Math.PI) : 0; }
      const f = S['fill' + key]; if (f && t < f.t0 + f.dur + 0.2) gk = Math.max(gk, 0.8); return gk; };
    const leg = (x0, y0, x1, y1, col, gk) => { c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = 3.5 + gk * 2.5; if (gk > 0) { c.shadowColor = col; c.shadowBlur = 14 * gk; } c.setLineDash([7, 5]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };
    leg(X(0), Y(0), X(a), Y(0), XC, legK('A')); leg(X(a), Y(0), X(a), Y(b), YC, legK('B'));
    if (S.rightT != null) { const k = M.clamp((t - S.rightT) / 0.25, 0, 1), r = Math.min(14, u * 0.6); c.save(); c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(X(a) - r, Y(0)); c.lineTo(X(a) - r, Y(0) - r * k); if (k > 0.5) c.lineTo(X(a) - r + r * (k - 0.5) * 2, Y(0) - r); c.stroke(); c.restore(); }
    // leg labels inside the triangle
    const lsz = Math.min(20, Math.max(14, u * 0.7));
    put(g, c, M.num(a), X(a / 2), Y(0) - lsz * 0.7, lsz, '#b8401a'); put(g, c, M.num(b), X(a) - lsz * 0.75 - (a >= 10 ? 4 : 0), Y(b / 2), lsz, '#4a30c0');
    // the arrow
    const ex = X(a), ey = Y(b), ux = (ex - X(0)) / L, uy = (ey - Y(0)) / L, lg = S.lenT != null ? Math.max(0, 1 - (t - S.lenT) / 0.6) : 0;
    c.save(); c.strokeStyle = AC; c.fillStyle = AC; c.lineWidth = 5; c.lineCap = 'round'; c.shadowColor = '#fff'; c.shadowBlur = 6 + lg * 16;
    c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(ex - ux * 10, ey - uy * 10); c.stroke();
    c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - ux * 17 - uy * 9, ey - uy * 17 + ux * 9); c.lineTo(ex - ux * 17 + uy * 9, ey - uy * 17 - ux * 9); c.closePath(); c.fill(); c.restore();
    c.fillStyle = INK; c.beginPath(); c.arc(X(0), Y(0), 4, 0, 7); c.fill();
    // the ruler: a tick pops at every whole step along the arrow
    if (S.ruler) { const n = p.c; for (let i = 1; i <= n; i++) { const at = S.ruler.t0 + S.ruler.dur * (i - 1) / Math.max(1, n - 1), k = M.clamp((t - at) / 0.18, 0, 1); if (k <= 0) continue;
      const px = X(0) + ux * L * i / n, py = Y(0) + uy * L * i / n, r = 6 * (1 + Math.sin(k * Math.PI) * 0.6); c.save(); c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(px - uy * r, py + ux * r); c.lineTo(px + uy * r, py - ux * r); c.stroke(); c.restore(); } }
    // the arrow's squared length (the sum), then its length, beside its middle
    if (S.hypT != null) { const pk = M.clamp((t - S.hypT) / 0.3, 0, 1), done = S.lenT != null && t >= S.lenT, lk = done ? M.clamp((t - S.lenT) / 0.3, 0, 1) : 0;
      const n = done ? M.num(p.c) : M.num(s), sz = 24 * (1 + Math.sin(Math.max(pk, lk) * Math.PI) * 0.35), m = M.lay(n, sz);
      pill(c, { x: S.hx, y: S.hy, w: m.w, h: sz * 0.8 }, 1, done ? 'rgba(224,48,106,0.92)' : 'rgba(28,42,82,0.8)'); put(g, c, n, S.hx, S.hy, sz, '#fff'); }
    // the square root sign (drawn by hand)
    const rg = M.box(g, 'rg'), ri = M.box(g, 'rin');
    if (S.rad && rg && ri && S.rhs[0] === S.rg) { const k = M.easeIO(kk(g, S.rad)), out = S.radOut ? kk(g, S.radOut) : 0; const x0 = rg.x - rg.w / 2 + 2, top = ri.y - ri.h / 2 - 4, bot = ri.y + ri.h / 2 + 3, mid = (top + bot) / 2 + 6, x1 = ri.x + ri.w / 2 + 3;
      const pts = [[x0, mid], [x0 + rg.w * 0.25, mid - 3], [x0 + rg.w * 0.55, bot], [x0 + rg.w * 0.9, top], [x1, top]]; let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      c.save(); c.globalAlpha *= 1 - out; c.strokeStyle = INK; c.lineWidth = S.fs * 0.07; c.lineCap = 'round'; c.lineJoin = 'round'; c.setLineDash([len * k, len * 2]); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'eq');
    const ne = S.mk.ex.note; if (ne) { const w = ne.node.write, wk = w ? M.easeIO(M.clamp((t - w.t0) / w.dur, 0, 1)) : 1; pill(c, M.box(g, 'nt'), ne.node.alpha ?? 1, undefined, wk); M.drawEx(g, c, 'note'); }
    // the penguin points at the work while it is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    const glide = Math.sin(t * 0.8) * 10;
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', HX + glide, HY - hk * 24, 1.2, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'penguin', HX, HY, 1.2);
    M.drawUI(g, c);
  },
});
function paintBg(c, W, H) {
  // twilight sky, violet to rose at the horizon
  const sk = c.createLinearGradient(0, 0, 0, 250); sk.addColorStop(0, '#1a1848'); sk.addColorStop(0.5, '#4a3a86'); sk.addColorStop(0.85, '#c07aa8'); sk.addColorStop(1, '#f2b0a8'); c.fillStyle = sk; c.fillRect(0, 0, W, 250);
  for (let i = 0; i < 40; i++) { const x = (i * 83) % W, y = (i * 47) % 150; c.fillStyle = `rgba(255,255,255,${0.3 + (i % 3) * 0.2})`; c.beginPath(); c.arc(x, y, 0.8 + (i % 2) * 0.6, 0, 7); c.fill(); }
  // snowy hills behind the lake
  for (const [base, col, amp, f] of [[236, '#a8a8d8', 18, 0.02], [252, '#d8e0f2', 12, 0.034]]) { c.fillStyle = col; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 6) c.lineTo(x, base - amp * (0.5 + 0.5 * Math.sin(x * f + base))); c.lineTo(W, H); c.closePath(); c.fill(); }
  // pine trees on the far shore
  for (let i = 0; i < 9; i++) { const x = 14 + i * 42 + (i % 2) * 9, y = 258, h = 22 + (i % 3) * 7; c.fillStyle = '#2e3a6a'; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + 8, y); c.lineTo(x - 8, y); c.closePath(); c.fill(); c.fillStyle = '#e8eefa'; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + 3, y - h + 7); c.lineTo(x - 3, y - h + 7); c.closePath(); c.fill(); }
  // the frozen lake
  const ice = c.createLinearGradient(0, 258, 0, 548); ice.addColorStop(0, '#b8d8ee'); ice.addColorStop(0.5, '#cfe6f4'); ice.addColorStop(1, '#a6cce6'); c.fillStyle = ice; c.fillRect(0, 258, W, 290);
  c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1.2; for (let i = 0; i < 14; i++) { const x = (i * 71) % W, y = 270 + (i * 37) % 270; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 30, y - 8, x + 60 + (i % 3) * 14, y + 4); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(40 + i * 70, 300 + (i % 2) * 140, 50, 9, -0.2, 0, 7); c.fill(); }
  // the snowy shore in front
  c.fillStyle = '#eef4fb'; c.beginPath(); c.moveTo(0, H); c.lineTo(0, 548); for (let x = 0; x <= W; x += 8) c.lineTo(x, 548 + Math.sin(x * 0.05) * 5 + Math.sin(x * 0.13) * 3); c.lineTo(W, H); c.closePath(); c.fill();
  c.fillStyle = 'rgba(150,170,210,0.35)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(30 + i * 64, 585 + (i % 2) * 26, 26, 6, 0, 0, 7); c.fill(); }
  // the snowy wooden sign for the problem
  c.fillStyle = 'rgba(20,20,50,0.35)'; c.beginPath(); c.roundRect(16, 188, 336, 62, 12); c.fill();
  c.fillStyle = '#7a4e34'; c.beginPath(); c.roundRect(10, 180, 340, 64, 12); c.fill();
  c.fillStyle = '#f6f9fd'; c.beginPath(); c.roundRect(16, 186, 328, 52, 9); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(12, 184); for (let x = 12; x <= 348; x += 12) c.quadraticCurveTo(x + 6, 172 + (x % 24 ? 2 : -2), x + 12, 184); c.lineTo(348, 188); c.lineTo(12, 188); c.closePath(); c.fill();
}
function ambient(c, t) {
  // aurora ribbons and falling snow
  c.save(); for (let i = 0; i < 2; i++) { c.globalAlpha = 0.22; c.strokeStyle = i ? '#7affc8' : '#8ad0ff'; c.lineWidth = 16 - i * 5; c.beginPath();
    for (let x = -10; x <= 370; x += 10) c.lineTo(x, 40 + i * 26 + Math.sin(x * 0.02 + t * 0.6 + i) * 14 + Math.sin(x * 0.05 - t * 0.4) * 6); c.stroke(); } c.restore();
  c.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < 26; i++) { const x = (i * 53 + Math.sin(t * 0.8 + i) * 12 + 400) % 360, y = (i * 97 + t * (18 + (i % 4) * 6)) % 640; c.beginPath(); c.arc(x, y, 1.2 + (i % 3) * 0.6, 0, 7); c.fill(); }
}
