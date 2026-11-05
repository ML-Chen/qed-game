// lines_elim.js — ELIMINATION! Solve a₁x + by = c₁, a₂x − by = c₂ by adding the equations, on a sign at the beach.
// Drag one equation onto the other (either way): they are added like a column sum, acted out column by column. A plus
// sign and a rule draw themselves, the +by and −by are circled and crossed out because they cancel, the two x terms drop
// into the sum line and merge into (a₁ + a₂)x, and the two right sides drop down as "c₁ + c₂", which then adds up.
// Tap the sum to divide: "÷ k" writes itself under both sides, k fades and the number rolls over to x.
// Level 0: x + y = s, x − y = d. Level 1: different x-coefficients. Level 2: ±2y, and a constant may be negative.
// Medium mode: adding the constants and the division open a tray.
const M = MK, INK = SCN.ink('sign'), HI = '#ffe08a', OUT = '#ff8a7a', Y1 = 236, Y2 = 290, Y3 = 352;
// the host reacts on every beat: hop() makes it jump with a face; it points at the sign while the work is shown
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) {
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const a1 = L === 0 ? 1 : r(1, 3), a2 = L === 0 ? 1 : r(1, 3), b = L === 2 ? 2 : 1, x = r(2, 7), y = L === 2 ? r(1, 6) : r(1, x - 1);
    if (L === 1 && a1 === 1 && a2 === 1) continue;
    const c1 = a1 * x + b * y, c2 = a2 * x - b * y;
    if (L < 2 && c2 <= 0) continue;
    return { a1, a2, b, x, y, c1, c2, k: a1 + a2, s: c1 + c2 };
  }
}
const xt = (a, id, o) => { const r = M.row(a === 1 ? null : M.num(a, null, o), M.vr('x', null, o)); r.id = id; return r; };
const yt = (sg, b, id) => { const r = M.row(M.op(sg), b === 1 ? null : M.num(b), M.vr('y')); r.id = id; return r; };
const nm = (v, id, o) => v < 0 ? M.paren(M.num(v, null, o), id, o) : M.num(v, id, o);

MG.add({
  id: 'lines_elim', stage: 'lines', cmd: 'ELIMINATION!', hint: 'drag', time: 8, winText: 'Eliminated!', hold: 1.4,
  card: {
    title: 'Solving by elimination', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'A system of equations is two equations that must both be true at the same time. Elimination solves it by adding the two equations so that one variable disappears.\n\nYou add equations by adding the left sides together and the right sides together. If one equation has +y and the other has −y, the y terms cancel, and only x is left.\n\nFor example, add x + y = 10 and x − y = 2. The left sides give x + x + y − y = 2x. The right sides give 10 + 2 = 12. So 2x = 12, and x = 6. Then y = 10 − 6 = 4.\n\nThis works because adding equal amounts to both sides of an equation keeps it true, and the second equation says its two sides are equal amounts.',
    note: 'Add the equations, left side to left side and right side to right side. When a variable has opposite signs, it cancels.',
    ask: 'Solve x + y = 8 and x − y = 2. Solve 2x + y = 11 and x − y = 1.',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = S.T = M.pace(g);
    S.e1 = M.row(xt(p.a1, 'x1'), yt('+', p.b, 'y1'), M.op('=', 'q1'), M.num(p.c1, 'c1')); S.e1.id = 'e1';
    S.e2 = M.row(xt(p.a2, 'x2'), yt('-', p.b, 'y2'), M.op('=', 'q2'), M.num(p.c2, 'c2')); S.e2.id = 'e2';
    // every line is placed so that its = sign sits under the one above, as in a column sum
    const at = (key, node, y, s) => { M.place(g, key, node, 180, y, s, { col: INK }); const q = M.box(g, 'q1'), m = M.box(g, key === 'e1' ? 'q1' : key === 'e2' ? 'q2' : 'q3'); if (q && m && key !== 'e1') M.place(g, key, node, 180 + q.x - m.x, y, s, { col: INK }); };
    const place = S.place = () => { at('e1', S.e1, Y1, 40); at('e2', S.e2, Y2, 40); if (S.e3) at('e3', S.e3, Y3, 40); };
    place(); M.inert(g, ['q1', 'q2', 'q3']);
    g.dur *= (2.6 + 1.05 * 2) / 8;
    // adding the equations, column by column: the y's cancel, the x's fly down and add, the numbers fly down and add
    const add = { busy: 0.1, askAt: 1.2 * T, after: 0.5 * T, ask: { v: p.s, wrong: [p.c1 - p.c2, p.c2 - p.c1, 2 * p.c1] }, then(g) {
      S.addAt = g.t; M.show(g, 1.2 * T); S.point = true; g.sfx('whoosh'); hop(g, 'think'); M.inert(g, ['x1', 'x2', 'y1', 'y2', 'c1', 'c2']);
      S.kn = M.num(p.k, null, { col: HI }); S.kx = M.vr('x', null, { col: HI }); S.kt = M.row(S.kn, S.kx); S.kt.id = 'k'; S.kt.alpha = 0;
      S.n1 = M.num(p.c1, 'n1', { alpha: 0 }); S.pl = M.op('+', null, { alpha: 0 }); S.n2 = nm(p.c2, 'n2', { alpha: 0 }); S.q3 = M.op('=', 'q3', { alpha: 0 });
      S.cs = M.row(S.n1, S.pl, S.n2); S.cs.id = 'cs'; S.e3 = M.row(S.kt, S.q3, S.cs); place();
      M.at(g, [
        // the y column: +by and −by are circled and crossed out, because they add up to 0
        [0.15 * T, g => { M.circle(g, ['y1', 'y2'], { col: OUT, dur: 0.4 * T }); g.sfx('tap'); }],
        [0.3 * T, g => { M.strike(g, 'y1', { dur: 0.18 * T, col: OUT }); M.strike(g, 'y2', { dur: 0.18 * T, delay: 0.08 * T, col: OUT }); g.sfx('sweep'); hop(g); }],
        // the x column: both x terms drop into the sum line and merge
        [0.5 * T, g => { M.indicate(g, 'x1', { dur: 0.3 * T, col: HI }); M.indicate(g, 'x2', { dur: 0.3 * T, delay: 0.04 * T, col: HI });
          for (const [id, a] of [['x1', p.a1], ['x2', p.a2]]) M.fly(g, { node: xt(a, null, { col: HI }), from: id, to: 'k', delay: 0.06 * T, dur: 0.3 * T, arc: -14, s0: 40, s1: 40 }); }],
        [0.86 * T, g => { S.kt.alpha = 1; S.kt.pop = g.t; M.sparkle(g, 'k', { n: 8 }); g.sfx('pop'); }],
        // the numbers: both right sides drop into the sum line, with a plus between them
        [0.72 * T, g => { M.indicate(g, 'c1', { dur: 0.3 * T, col: HI }); M.indicate(g, 'c2', { dur: 0.3 * T, delay: 0.04 * T, col: HI });
          M.fly(g, { node: M.num(p.c1), from: 'c1', to: 'n1', delay: 0.06 * T, dur: 0.3 * T, arc: -14, s0: 40, s1: 40, col: INK });
          M.fly(g, { node: nm(p.c2), from: 'c2', to: 'n2', delay: 0.1 * T, dur: 0.3 * T, arc: -14, s0: 40, s1: 40, col: INK }); }],
        [1.1 * T, g => { for (const n of [S.n1, S.pl, S.n2, S.q3]) { n.alpha = 1; n.pop = g.t; } g.sfx('tap'); }],
      ]); },
      resolve(g) { M.show(g, 0.5 * T); M.indicate(g, S.cs, { dur: 0.3 * T, sc: 1.1 });
        M.at(g, [[0.25 * T, g => { S.e3.items[2] = M.num(p.s, 'c3', { col: HI }); place(); M.sparkle(g, 'c3', { delay: 0.1 * T }); g.sfx('coin'); hop(g); }]]); } };
    M.play(g, {
      moves(g) {
        if (!S.addAt) return [{ drag: ['e1', 'x1', 'y1', 'c1'], to: ['e2', 'x2', 'y2', 'c2'], reach: 70, ...add }, { drag: ['e2', 'x2', 'y2', 'c2'], to: ['e1', 'x1', 'y1', 'c1'], reach: 70, ...add }];
        // dividing both sides by the x coefficient: "÷ k" writes itself under both sides, k fades and the number rolls to x
        if (!S.td) return [{ tap: ['k', 'c3'], busy: 0.1, askAt: 0.6 * T, after: 0.8 * T, ask: { v: p.x, wrong: [p.s - p.k, p.s * p.k, p.s] },
          then(g) { S.td = 1; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); M.circle(g, 'k', { dur: 0.45 * T, col: HI }); g.sfx('tap');
            const dv = () => M.row(M.op('÷'), M.num(p.k));
            M.note(g, { node: dv(), at: 'k', off: [0, 38], s: 28, col: HI, delay: 0.1 * T, write: 0.25 * T, hold: 0.55 * T, fade: 0.2 * T });
            M.note(g, { node: dv(), at: 'c3', off: [0, 38], s: 28, col: HI, delay: 0.2 * T, write: 0.25 * T, hold: 0.45 * T, fade: 0.2 * T }); },
          resolve(g) { M.show(g, 0.8 * T); M.tween(g, S.kn, { alpha: 0, sc: 0.4 }, 0.25 * T); M.roll(g, 'c3', p.x, { dur: 0.35 * T }); place(); g.sfx('ding');
            M.at(g, [[0.28 * T, g => { S.e3.items[0] = S.kx; place(); }],
              [0.4 * T, g => { M.inert(g, ['c3']); M.sparkle(g, 'c3', { n: 14, cols: [HI, '#fff', '#7ad0ff'] }); g.sfx('chime'); hop(g, 'laugh'); S.point = false; }]]); } }];
        return [];
      },
      area(g) { return !S.addAt ? ['e1', 'e2'] : ['k']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'beach', panel: 'sign', panelY: 300, panelH: 214 });
    host(g, c, 'turtle', 80, 600, 1.3, 1);
    M.drawEx(g, c, 'e1'); M.drawEx(g, c, 'e2');
    if (S.addAt) {
      // the plus sign and the rule of a column sum draw themselves
      const k = M.ease((t - S.addAt) / (0.3 * S.T)), e1 = M.box(g, 'e1'), e2 = M.box(g, 'e2');
      c.save(); c.strokeStyle = INK; c.lineCap = 'round';
      if (e1 && e2) { const x0 = Math.min(e1.x - e1.w / 2, e2.x - e2.w / 2) - 30, x1 = Math.max(e1.x + e1.w / 2, e2.x + e2.w / 2) + 8, y = Y2 + 22, py = Y2 - 13;
        c.lineWidth = 3.5; c.beginPath(); c.moveTo(x0, y); c.lineTo(M.lerp(x0, x1, k), y); c.stroke();
        c.lineWidth = 3; c.globalAlpha = k; c.beginPath(); c.moveTo(x0 + 2, py); c.lineTo(x0 + 16, py); c.moveTo(x0 + 9, py - 7); c.lineTo(x0 + 9, py + 7); c.stroke(); c.globalAlpha = 1; }
      c.restore();
      M.drawEx(g, c, 'e3');
    }
    M.drawUI(g, c);
  },
});
