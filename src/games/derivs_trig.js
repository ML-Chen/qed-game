// derivs_trig.js — TRIG DERIV! The derivatives of sin and cos go around a cycle of four:
// sin x → cos x → −sin x → −cos x → sin x. A big dial at dusk carries the four functions; the one under the pointer is
// the current function. Each derivative is one turn of the dial: the player drags the function on the right up to the
// pointer and the dial turns a quarter. Turning the wrong way (the function on the left) is the classic mistake (that
// direction is the antiderivative); it wobbles. Pips under the problem count the derivatives still to take.
// Level 0: d/dx of sin x or cos x. Level 1: d²/dx². Level 2: d³/dx³ or d⁴/dx⁴.
// Medium mode: the dial's labels are hidden until they reach the pointer, and each turn opens the tray.
const M = MK, INK = SCN.ink('none'), DARK = '#2a1840', CX = 180, CY = 424, R = 86;
const NAMES = ['sin', 'cos', '-sin', '-cos'], WEDGE = ['#ffd27a', '#8ad0ff', '#ffa8c0', '#c0a8ff'];
function pick(g) { const r = k => Math.floor(g.rand() * k); return { n: [1, 2, 3 + r(2)][g.level], s0: r(2) }; }
const fn = (k, col, id) => Object.assign(M.row(M.num(NAMES[k], null, { col }), M.gap(5), M.vr('x', null, { col })), { id });
// dⁿ/dxⁿ as a node
const dn = n => n === 1 ? M.ddx('x', 'dn') : M.frac(M.sup(M.txt('d'), M.num(n)), M.row(M.txt('d'), M.sup(M.vr('x'), M.num(n))), 'dn', { small: true });

MG.add({
  id: 'derivs_trig', stage: 'derivs', cmd: 'TRIG DERIV!', hint: 'drag', time: 8, mood: 'night', winText: 'Round we go!', hold: 1.4,
  card: {
    title: 'Derivatives of sine and cosine', ref: 'Calculus', kind: 'Derivatives',
    text: 'The derivative of a function tells you how fast it changes. Sine and cosine are wave-shaped functions from trigonometry, written sin x and cos x.\n\nTheir derivatives go around a cycle of four: the derivative of sin x is cos x, the derivative of cos x is −sin x, the derivative of −sin x is −cos x, and the derivative of −cos x is sin x again.\n\nSo to take several derivatives, step around the cycle once for each. The second derivative d²/dx² means "take the derivative twice". For example, d²/dx² sin x: one step gives cos x, a second step gives −sin x.\n\nWhy: the sine wave is steepest going up where it crosses zero, at x = 0, and that is exactly where cos x is highest, at 1.',
    note: 'sin → cos → −sin → −cos → sin. Each derivative is one step around this cycle; four steps bring you back to the start.',
    ask: 'What is d/dx cos x? What is d³/dx³ sin x?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.steps = 0; S.rotFrom = 0; S.rotT = -9;
    S.shown = [0, 1, 2, 3].map(k => g.mode !== 'medium' || k === S.s0);
    S.ans = M.slot('ans', { w: 90, col: '#fff6e0' });
    M.place(g, 'prob', M.row(dn(S.n), M.gap(6), fn(S.s0, null, 'f0'), M.op('='), S.ans), 180, 222, 34, { col: INK });
    M.inert(g, ['dn', 'f0', 'ans']);
    g.dur *= (2.6 + 1.05 * S.n) / 8;
    this.lay(g);
    M.play(g, {
      moves(g) {
        if (S.steps >= S.n || S.turning) return [];
        const cur = (S.s0 + S.steps) % 4, nx = (cur + 1) % 4, last = S.steps + 1 === S.n;
        return [{ drag: 'L' + nx, to: 'L' + cur, reach: 80, area: [CX - 80, CY - R - 60, CX + 80, CY - R + 34], busy: 0.24,
          ask: { v: M.num(NAMES[nx]), wrong: [M.num(NAMES[(nx + 2) % 4]), M.num(NAMES[(cur + 3) % 4])] }, askAt: 0, after: 0.1,
          then(g) { S.rotFrom = S.steps; S.steps++; S.rotT = g.t; S.turning = true; g.sfx('sweep'); },
          resolve(g) { S.turning = false; S.shown[nx] = true; S.popK = nx; S.popT = g.t; g.sfx('coin');
            if (last) { S.ans.fill = fn(nx, null); S.ans.fill.pop = g.t; M.relayout(g, 'prob'); const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#ffd27a', '#8ad0ff', '#fff'], 16, 140); } } }];
      },
      area(g) { const cur = (S.s0 + S.steps) % 4; return ['L' + (cur + 1) % 4, 'L' + cur]; },
    });
  },
  // the dial's angle (in quarter turns) and the four labels placed around it
  lay(g) {
    const S = g.s, rot = M.lerp(S.rotFrom, S.steps, M.easeIO((g.t - S.rotT) / 0.24)); S.rot = rot;
    for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - S.s0 - rot) * Math.PI / 2, x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R;
      const node = S.shown[k] ? fn(k, DARK, 'L' + k) : Object.assign(M.row(M.txt('?', null, { col: DARK })), { id: 'L' + k });
      if (S.popK === k) node.pop = S.popT; M.place(g, 'L' + k, node, x, y + 10, 28); }
  },
  update(g, dt) { this.lay(g); M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'dusk', panel: 'none', host: 'fox', hostX: 318, hostY: 614, hostS: 0.95 });
    M.drawEx(g, c, 'prob');
    // pips: one per derivative to take, lit as each is taken
    for (let i = 0; i < S.n; i++) { const x = 180 + (i - (S.n - 1) / 2) * 22, on = i < S.steps; c.fillStyle = on ? '#ffd27a' : 'rgba(255,246,224,0.3)'; c.beginPath(); c.arc(x, 262, on ? 7 : 5.5, 0, 7); c.fill(); }
    // the dial: four coloured wedges that turn with the labels, a hub, and a fixed pointer at the top
    c.save(); c.fillStyle = 'rgba(10,6,30,0.35)'; c.beginPath(); c.arc(CX + 4, CY + 8, R + 46, 0, 7); c.fill();
    for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - S.s0 - S.rot) * Math.PI / 2; c.fillStyle = WEDGE[k]; c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, R + 44, a - Math.PI / 4, a + Math.PI / 4); c.closePath(); c.fill(); }
    c.strokeStyle = '#5a3a2a'; c.lineWidth = 6; c.beginPath(); c.arc(CX, CY, R + 44, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(90,58,42,0.5)'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - S.s0 - S.rot + 0.5) * Math.PI / 2; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + Math.cos(a) * (R + 44), CY + Math.sin(a) * (R + 44)); c.stroke(); }
    c.fillStyle = '#7a4a2a'; c.beginPath(); c.arc(CX, CY, 20, 0, 7); c.fill(); c.fillStyle = '#ffe8b0'; c.beginPath(); c.arc(CX - 4, CY - 4, 6, 0, 7); c.fill();
    // the turning direction: an arrow from the right label up to the pointer
    c.strokeStyle = 'rgba(255,246,224,0.8)'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.arc(CX, CY, R + 58, -0.25, -Math.PI / 2 + 0.45, true); c.stroke();
    const ea = -Math.PI / 2 + 0.45, ex = CX + Math.cos(ea) * (R + 58), ey = CY + Math.sin(ea) * (R + 58); c.beginPath(); c.moveTo(ex - 2, ey - 10); c.lineTo(ex - 10, ey + 1); c.lineTo(ex + 3, ey + 6); c.closePath(); c.fillStyle = 'rgba(255,246,224,0.8)'; c.fill();
    const py = CY - R - 50 + Math.sin(t * 4) * 2; c.fillStyle = '#ffd27a'; c.strokeStyle = '#5a3a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(CX - 13, py - 14); c.lineTo(CX + 13, py - 14); c.lineTo(CX, py + 4); c.closePath(); c.fill(); c.stroke();
    c.restore();
    for (let k = 0; k < 4; k++) M.drawEx(g, c, 'L' + k);
    M.drawUI(g, c);
  },
});
