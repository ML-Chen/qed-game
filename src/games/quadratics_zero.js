// quadratics_zero.js — ZERO PRODUCT! Solve (x − p)(x − q) = 0 by setting each bracket equal to 0.
// A wooden sign at dusk shows the equation; under it the graph of y = (x − p)(x − q) glows like a trail of fireflies.
// Every move acts out its working (show your work):
//   1. Drag the 0 onto a bracket (either one first): the bracket is circled, its inside lifts out and drops onto the
//      board below it, a copy of the 0 follows it as "= 0", and "or" writes itself between the two small equations.
//   2. Tap a small equation: "+ 3" writes itself under both sides, the − 3 and + 3 are crossed out and fade, the 0 rolls
//      over to 3 and the line closes up to x = 3. A firefly carries the 3 down to the graph, where the curve crosses
//      the x-axis, and its bracket in the problem glows.
// Level 0: one positive and one negative root. Level 1: any small roots. Level 2: bigger roots.
// Medium mode: solving each small equation opens a tray to pick the root.
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), GLOW = '#e6ff8a', ZC = '#ffe08a', EY = 330, ES = 30;
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const a = L === 0 ? r(1, 5) : L === 1 ? r(-6, 6) : r(-8, 8), b = L === 0 ? -r(1, 5) : L === 1 ? r(-6, 6) : r(-8, 8);
    if (a && b && Math.abs(a - b) >= 3 && Math.abs(a - b) <= (L === 2 ? 12 : 10)) return g.rand() < 0.5 ? [a, b] : [b, a];
  }
}
const lin = (r, id) => { const n = M.row(M.vr('x'), M.op(r > 0 ? '-' : '+'), M.num(Math.abs(r))); return id ? M.paren(n, id) : n; };
const gx = x => 180 + x * 17, AY = 446; // the graph: 17 px per unit, x-axis at y = 446

MG.add({
  id: 'quadratics_zero', stage: 'quadratics', cmd: 'ZERO PRODUCT!', hint: 'drag', time: 9, mood: 'night', winText: 'Solved!', hold: 1.4,
  card: {
    title: 'The zero product property', ref: 'Algebra 1', kind: 'Algebra',
    text: 'If two numbers multiply to make 0, at least one of them must be 0. This is called the zero product property.\n\nSo when a quadratic is written as two brackets multiplied together and set equal to 0, you can split it into two small equations: one bracket is 0, or the other one is.\n\nFor example, (x − 2)(x + 5) = 0 means x − 2 = 0 or x + 5 = 0. The first equation gives x = 2 and the second gives x = −5. These two values are the solutions, which are also called the roots.\n\nOn the graph of y = (x − 2)(x + 5), the roots are the places where the curve crosses the x-axis, because y is 0 there.',
    note: 'If A · B = 0, then A = 0 or B = 0. Set each bracket equal to 0 and solve each small equation.',
    ask: 'Solve (x − 4)(x + 1) = 0. Solve (x + 3)(x + 7) = 0.',
  },
  init(g) {
    const S = g.s; M.setup(g); const R = S.r = pick(g), T = S.T = M.pace(g);
    M.place(g, 'prob', M.row(lin(R[0], 'b1'), lin(R[1], 'b2'), M.op('=', 'eq'), M.num(0, 'z', { col: ZC })), 180, 250, 42, { col: INK });
    // each small equation keeps its symbols from "x − p = 0" to "x = p", so they glide as it closes up
    S.E = R.map((r, i) => ({ x: M.vr('x'), op: M.op(r > 0 ? '-' : '+', 'o' + (i + 1)), n: M.num(Math.abs(r), 'n' + (i + 1)), eq: M.op('='), z: M.num(0, 'z' + (i + 1), { col: ZC }) }));
    S.st = ['', ''];
    const cx = i => { const w = M.lay(M.row(lin(R[i]), M.op('='), M.num(0)), ES).w; return i ? Math.min(268, 346 - w / 2) : Math.max(92, 14 + w / 2); };
    const placeE = S.placeE = i => { const E = S.E[i], st = S.st[i]; if (!st) return; const n = st === 'x' ? M.row(E.x, E.eq, E.z) : M.row(E.x, E.op, E.n, E.eq, E.z); n.id = 'e' + (i + 1);
      M.place(g, 'e' + (i + 1), n, cx(i), EY, ES, { col: INK }); };
    S.or = M.txt('or', 'or', { alpha: 0 }); M.place(g, 'or', S.or, 180, EY - 2, 22, { col: '#e8c890' });
    M.inert(g, ['eq', 'or', 'o1', 'o2', 'n1', 'n2', 'z1', 'z2']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    S.lit = [null, null]; S.glowB = [null, null];
    M.play(g, {
      moves(g) {
        const out = [];
        [0, 1].forEach(i => {
          const k = i + 1, root = R[i], E = S.E[i];
          if (!S.st[i]) { const b = M.box(g, 'b' + k), area = b ? [i ? b.x - b.w / 2 : 0, 180, i ? b.x + b.w / 2 + 8 : b.x + b.w / 2 + 2, 290] : null;
            out.push({ drag: 'z', to: 'b' + k, area, busy: 0.1, then(g) {
              S.st[i] = 'go'; M.show(g, 0.95 * T); S.point = true; hop(g, 'think'); g.sfx('snap'); M.circle(g, 'b' + k, { col: ZC, dur: 0.45 * T }); M.light(g, 'b' + k, { col: ZC });
              const bb = { ...M.box(g, 'b' + k) }, zb = { ...M.box(g, 'z') };
              S.st[i] = 'eq'; placeE(i); for (const q of Object.values(E)) q.alpha = 0;
              // the inside of the bracket lifts out and drops onto the board, then the 0 follows as "= 0"
              M.fly(g, { node: lin(root), from: [bb.x, bb.y], to: [M.box(g, 'e' + k).x - (M.box(g, 'e' + k).w - M.lay(lin(root), ES).w) / 2, EY - 10], delay: 0.15 * T, dur: 0.42 * T, arc: -26, s0: 42, s1: ES, col: '#fff2d8',
                then(g) { for (const q of [E.x, E.op, E.n]) { q.alpha = 1; q._born = -1; } g.sfx('pop'); hop(g); M.unlight(g, 'b' + k); } });
              M.fly(g, { node: M.num(0), from: [zb.x, zb.y], to: 'z' + k, delay: 0.45 * T, dur: 0.38 * T, arc: -36, s0: 42, s1: ES, col: ZC,
                then(g) { E.eq.alpha = 1; M.writeIn(g, E.eq, { dur: 0.12 * T }); E.z.alpha = 1; E.z._born = -1; E.z.pop = g.t; M.sparkle(g, E.z, { n: 6, cols: [ZC, '#fff'] }); g.sfx('pop');
                  if (S.or.alpha < 1) { S.or.alpha = 1; M.writeIn(g, S.or, { dur: 0.2 * T }); } S.point = false; } }); } });
          } else if (S.st[i] === 'eq') {
            const add = M.row(M.op(root > 0 ? '+' : '-'), M.num(Math.abs(root)));
            out.push({ tap: 'e' + k, busy: 0.1, askAt: 0.6 * T, after: 1.2 * T, ask: { v: root, wrong: [-root, 0, root + (root > 0 ? 1 : -1)] },
              then(g) { S.st[i] = 'solve'; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); M.circle(g, 'e' + k, { col: GLOW, dur: 0.4 * T });
                // undo the − p on both sides: "+ p" is written under each side
                const left = M.unionBox([M.box(g, 'n' + k), M.box(g, 'o' + k)]);
                M.note(g, { node: add, at: left ? [left.x, left.y] : 'n' + k, off: [0, 30], s: 20, col: GLOW, delay: 0.1 * T, write: 0.25 * T, hold: 0.55 * T, fade: 0.2 * T });
                M.note(g, { node: add, at: 'z' + k, off: [4, 30], s: 20, col: GLOW, delay: 0.2 * T, write: 0.25 * T, hold: 0.45 * T, fade: 0.2 * T }); },
              resolve(g) { M.show(g, 1.2 * T);
                M.strike(g, E.op, { dur: 0.15 * T, col: '#ff8a7a' }); M.strike(g, E.n, { delay: 0.05 * T, dur: 0.18 * T, col: '#ff8a7a' }); M.roll(g, E.z, root, { delay: 0.1 * T, dur: 0.32 * T }); g.sfx('ding');
                M.at(g, [[0.32 * T, g => { M.tween(g, E.op, { alpha: 0, sc: 0.5 }, 0.15 * T); M.tween(g, E.n, { alpha: 0, sc: 0.5 }, 0.15 * T); }],
                  [0.5 * T, g => { S.st[i] = 'x'; placeE(i); M.inert(g, ['e' + k]); E.z.col = ZC; M.sparkle(g, E.z, { n: 8, cols: [ZC, '#fff'] }); hop(g); }],
                  // a firefly carries the root down to the place where the curve crosses the axis
                  [0.62 * T, g => { const b = M.box(g, 'z' + k); if (b) M.fly(g, { node: M.num(root), from: [b.x, b.y], to: [gx(root), AY - 16], dur: 0.42 * T, arc: -20, s0: ES, s1: 18, col: GLOW,
                    then(g) { S.lit[i] = g.t; S.glowB[i] = g.t; g.sfx('chime'); g.burst(gx(root), AY, [GLOW, '#fff'], 12, 110); M.indicate(g, 'b' + k, { col: GLOW, sc: 1.12, dur: 0.4 * T }); hop(g, S.lit.every(v => v != null) ? 'laugh' : 'wow'); S.point = false; } }); }]]); } });
          }
        });
        return out;
      },
      area(g) { const i = [0, 1].find(i => S.st[i] !== 'x'); return i == null ? null : S.st[i] ? ['e' + (i + 1)] : ['z', 'b' + (i + 1)]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, [p, q] = S.r;
    SCN.std(g, c, { scene: 'dusk', panel: PANEL, panelY: 290, panelH: 170 }); host(g, c, 'frog', 52, 616, 1.0, 1);
    // the graph of y = (x − p)(x − q), scaled so its lowest point sits about 90 px under the axis
    const low = ((p - q) / 2) ** 2, sy = 92 / low, f = x => (x - p) * (x - q);
    c.save(); c.strokeStyle = 'rgba(255,240,220,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(18, AY); c.lineTo(342, AY); c.stroke();
    for (let x = -9; x <= 9; x++) { c.beginPath(); c.moveTo(gx(x), AY - (x ? 3 : 7)); c.lineTo(gx(x), AY + (x ? 3 : 7)); c.stroke(); }
    c.fillStyle = 'rgba(255,240,220,0.7)'; c.font = M.NUMF(12); c.textAlign = 'center'; c.fillText('0', gx(0), AY + 18);
    c.beginPath(); c.rect(0, 392, 360, 172); c.clip();
    c.shadowColor = GLOW; c.shadowBlur = 10; c.strokeStyle = 'rgba(230,255,140,0.85)'; c.lineWidth = 3; c.setLineDash([2, 7]); c.lineDashOffset = -t * 14; c.lineCap = 'round';
    c.beginPath(); for (let x = -10.6; x <= 10.6; x += 0.1) { const y = AY - f(x) * sy; x > -10.6 ? c.lineTo(gx(x), y) : c.moveTo(gx(x), y); } c.stroke(); c.restore();
    // a firefly settles on each root once it is found
    [p, q].forEach((r, i) => {
      if (S.lit[i] == null) return; const k = M.clamp((t - S.lit[i]) / 0.3, 0, 1); if (k <= 0) return; const x = gx(r), pulse = 1 + 0.15 * Math.sin(t * 6 + i);
      c.save(); const gr = c.createRadialGradient(x, AY, 0, x, AY, 26 * pulse); gr.addColorStop(0, 'rgba(240,255,160,0.9)'); gr.addColorStop(1, 'rgba(240,255,160,0)'); c.fillStyle = gr; c.globalAlpha = k;
      c.beginPath(); c.arc(x, AY, 26 * pulse, 0, 7); c.fill(); c.fillStyle = '#fbffd8'; c.beginPath(); c.arc(x, AY, 6, 0, 7); c.fill();
      c.fillStyle = '#fff6dc'; c.font = M.NUMF(18); c.textAlign = 'center'; c.fillText(String(r).replace('-', '−'), x, AY - 10); c.restore();
    });
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'e1'); M.drawEx(g, c, 'e2'); M.drawEx(g, c, 'or');
    M.drawUI(g, c);
  },
});
