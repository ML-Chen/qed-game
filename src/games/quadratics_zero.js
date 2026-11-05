// quadratics_zero.js — ZERO PRODUCT! Solve (x − p)(x − q) = 0 by setting each bracket equal to 0.
// A wooden sign at dusk shows the equation; under it the graph of y = (x − p)(x − q) glows like a trail of fireflies.
// The player drags the 0 onto each bracket, in either order: that bracket's own equation "x − p = 0" appears under it.
// Tapping that equation solves it ("x = p"), and a firefly lights the point where the curve crosses the x-axis.
// Level 0: one positive and one negative root. Level 1: any small roots. Level 2: bigger roots.
// Medium mode: solving each small equation opens a tray to pick the root.
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), GLOW = '#e6ff8a';
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
    const S = g.s; M.setup(g); const R = S.r = pick(g);
    M.place(g, 'prob', M.row(lin(R[0], 'b1'), lin(R[1], 'b2'), M.op('=', 'eq'), M.num(0, 'z', { col: '#ffe08a' })), 180, 250, 42, { col: INK });
    S.eq = [1, 2].map(k => { const n = M.row(lin(R[k - 1]), M.op('='), M.num(0)); n.id = 'e' + k; n.hide = true; return n; });
    S.eq.forEach((n, i) => M.place(g, 'e' + (i + 1), n, i ? 268 : 92, 330, 32, { col: INK }));
    M.place(g, 'or', M.txt('or', 'or', { hide: true }), 180, 328, 24, { col: '#e8c890' });
    M.inert(g, ['eq', 'or']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    S.shown = [false, false]; S.solved = [false, false]; S.lit = [null, null];
    M.play(g, {
      moves(g) {
        const out = [];
        [0, 1].forEach(i => {
          const k = i + 1, root = R[i];
          if (!S.shown[i]) { const b = M.box(g, 'b' + k), area = b ? [i ? b.x - b.w / 2 : 0, 180, i ? b.x + b.w / 2 + 8 : b.x + b.w / 2 + 2, 290] : null;
            out.push({ drag: 'z', to: 'b' + k, area, busy: 0.1, then(g) { S.shown[i] = true; S.eq[i].hide = false; S.eq[i].pop = g.t; M.node(g, 'or').hide = false; g.sfx('snap');
              const bb = M.box(g, 'b' + k); if (bb) g.burst(bb.x, bb.y + 30, ['#ffe08a', '#fff'], 8, 100); } });
          } else if (!S.solved[i]) out.push({ tap: 'e' + k, busy: 0.1, askAt: 0, after: 0.1, ask: { v: root, wrong: [-root, 0, root + (root > 0 ? 1 : -1)] },
            then(g) { S.solved[i] = true; },
            resolve(g) { const n = M.row(M.vr('x'), M.op('='), M.num(root, null, { col: '#ffe08a', pop: g.t })); n.id = 'x' + k; M.place(g, 'e' + k, n, i ? 268 : 92, 330, 34, { col: INK }); M.inert(g, ['x' + k]);
              S.lit[i] = g.t; g.sfx('chime'); g.burst(gx(root), AY, [GLOW, '#fff'], 12, 110); } });
        });
        return out;
      },
      area(g) { const i = S.shown.findIndex((s, i) => !s || !S.solved[i]); return i < 0 ? null : S.shown[i] ? ['e' + (i + 1)] : ['z', 'b' + (i + 1)]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, [p, q] = S.r;
    SCN.std(g, c, { scene: 'dusk', panel: PANEL, panelY: 290, panelH: 170, host: 'frog', hostX: 52, hostY: 616, hostS: 1.0 });
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
      c.fillStyle = '#fff6dc'; c.font = M.NUMF(18); c.textAlign = 'center'; c.fillText(String(r).replace('-', '−'), x, AY - 16 - (1 - k) * 10); c.restore();
    });
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'e1'); M.drawEx(g, c, 'e2'); M.drawEx(g, c, 'or');
    M.drawUI(g, c);
  },
});
