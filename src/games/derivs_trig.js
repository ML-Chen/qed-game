// derivs_trig.js — TRIG DERIV! The derivatives of sin and cos go around a cycle of four:
// sin x → cos x → −sin x → −cos x → sin x. A big dial at dusk carries the four functions; the one under the pointer is
// the current function. Each derivative is one turn of the dial: the player drags the function on the right up to the
// pointer, and the working plays by itself (show your work): the function at the pointer is circled, the turning arrow
// glows with "d/dx" writing itself beside it, and the dial turns slowly a quarter; the new function lands under the
// pointer with a sparkle, a pip lights, and a copy of it flies up into the answer, which always shows what is left to
// do: d⁴/dx⁴ sin x = d³/dx³ cos x = d²/dx² (−sin x) = ... = sin x. Turning the wrong way (the function on the left) is the classic mistake (that
// direction is the antiderivative); it wobbles. Pips under the problem count the derivatives still to take.
// Level 0: d/dx of sin x or cos x. Level 1: d²/dx². Level 2: d³/dx³ or d⁴/dx⁴.
// Medium mode: the dial's labels are hidden until they reach the pointer, and each turn opens the tray once the
// '?' sits under the pointer.
const M = MK, INK = SCN.ink('none'), DARK = '#2a1840', CX = 180, CY = 424, R = 86;
const NAMES = ['sin', 'cos', '-sin', '-cos'], WEDGE = ['#ffd27a', '#8ad0ff', '#ffa8c0', '#c0a8ff'];
function pick(g) { const r = k => Math.floor(g.rand() * k); return { n: [1, 2, 3 + r(2)][g.level], s0: r(2) }; }
const fn = (k, col, id) => Object.assign(M.row(M.num(NAMES[k], null, { col }), M.gap(5), M.vr('x', null, { col })), { id });
// dⁿ/dxⁿ as a node
const dn = (n, id = 'dn') => n === 1 ? M.ddx('x', id) : M.frac(M.sup(M.txt('d'), M.num(n)), M.row(M.txt('d'), M.sup(M.vr('x'), M.num(n))), id, { small: true });

MG.add({
  id: 'derivs_trig', stage: 'derivs', cmd: 'TRIG DERIV!', hint: 'drag', time: 8, mood: 'night', winText: 'Round we go!', hold: 1.4,
  card: {
    title: 'Derivatives of sine and cosine', ref: 'Calculus', kind: 'Derivatives',
    text: 'The derivative of a function tells you how fast it changes. Sine and cosine are wave-shaped functions from trigonometry, written sin x and cos x.\n\nTheir derivatives go around a cycle of four: the derivative of sin x is cos x, the derivative of cos x is −sin x, the derivative of −sin x is −cos x, and the derivative of −cos x is sin x again.\n\nSo to take several derivatives, step around the cycle once for each. The second derivative d²/dx² means "take the derivative twice". For example, d²/dx² sin x: one step gives cos x, a second step gives −sin x.\n\nWhy: the sine wave is steepest going up where it crosses zero, at x = 0, and that is exactly where cos x is highest, at 1.',
    note: 'sin → cos → −sin → −cos → sin. Each derivative is one step around this cycle; four steps bring you back to the start.',
    ask: 'What is d/dx cos x? What is d³/dx³ sin x?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.steps = 0; S.rotFrom = 0; S.rotT = -9; S.rotDur = 0.3; const T = M.pace(g);
    S.shown = [0, 1, 2, 3].map(k => g.mode !== 'medium' || k === S.s0);
    S.lab = [0, 1, 2, 3].map(k => fn(k, DARK, 'L' + k)); S.q = [0, 1, 2, 3].map(k => Object.assign(M.row(M.txt('?', null, { col: DARK })), { id: 'L' + k }));
    S.ans = M.slot('ans', { w: 90, col: '#fff6e0' });
    S.prob = M.row(dn(S.n), M.gap(6), fn(S.s0, null, 'f0'), M.op('='), S.ans);
    const relay = () => M.place(g, 'prob', S.prob, 180, 222, 34, { col: INK }); S.relay = relay; relay();
    M.inert(g, ['dn', 'f0', 'ans', 'rest', 'rf', 'rd']);
    g.dur *= (2.6 + 1.05 * S.n) / 8;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    this.lay(g);
    // the answer shows what is left to do: dᵏ/dxᵏ of the function under the pointer (d⁴/dx⁴ sin x = d³/dx³ cos x).
    // Its d, d and x are the same nodes every step, so the order rolls down (d³ → d²) instead of being rewritten.
    S.dT = M.txt('d'); S.dB = M.txt('d'); S.dX = M.vr('x'); S.kT = M.num(1); S.kB = M.num(1);
    const restD = k => k > 1 ? M.frac(M.sup(S.dT, S.kT), M.row(S.dB, M.sup(S.dX, S.kB)), 'rd', { small: true }) : M.frac(S.dT, M.row(S.dB, S.dX), 'rd', { small: true });
    const hideAll = n => { if (!n) return; n.alpha = 0; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) hideAll(ch); };
    const bornAll = n => { if (!n) return n; n._born = -1; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) bornAll(ch); return n; };
    const fillRest = (g, k, f) => { // called as the flying function lands
      if (S.restF) hideAll(S.restF); const F = bornAll(fn(f, null, 'rf')), neg = NAMES[f][0] === '-';
      S.restF = k && neg ? bornAll(M.paren(F)) : F; S.restF.pop = g.t;
      if (k) { const was = S.kT.v; S.kT.v = S.kB.v = String(k); if (S.restRow && k > 1 && was !== String(k)) { S.kT.roll = { from: was, t0: g.t, dur: 0.3 * T }; S.kB.roll = { from: was, t0: g.t, dur: 0.3 * T }; }
        if (k === 1) { S.kT.alpha = S.kB.alpha = 0; } S.restRow = M.row(restD(k), M.gap(4), S.restF); }
      else { for (const q of [S.dT, S.dB, S.dX, S.kT, S.kB]) q.alpha = 0; S.restRow = M.row(S.restF); }
      S.restRow.id = 'rest'; S.prob.items[4] = S.restRow; relay(); };
    M.play(g, {
      moves(g) {
        if (S.steps >= S.n || S.turning) return [];
        const cur = (S.s0 + S.steps) % 4, nx = (cur + 1) % 4, left = S.n - S.steps - 1, turn = 0.62 * T, land = 0.12 * T + turn;
        return [{ drag: 'L' + nx, to: 'L' + cur, reach: 80, area: [CX - 80, CY - R - 60, CX + 80, CY - R + 34], busy: 0.1, askAt: land, after: 0.75 * T,
          ask: { v: M.num(NAMES[nx]), wrong: [M.num(NAMES[(nx + 2) % 4]), M.num(NAMES[(cur + 3) % 4]), M.num(NAMES[cur])] },
          // one derivative = one quarter turn: the function at the pointer is circled, "d/dx" writes itself by the
          // turning arrow, and the dial turns slowly until the next function sits under the pointer
          then(g) { S.turning = true; M.show(g, land); S.point = true; react(g, 'think'); g.sfx('sweep');
            M.circle(g, 'L' + cur, { col: '#fff6e0', dur: 0.4 * T }); M.indicate(g, S.lab[cur], { dur: 0.35 * T, sc: 1.15 });
            S.arrT = g.t; S.arrDur = land + 0.2 * T;
            M.note(g, { node: M.ddx('x'), at: [306, 300], s: 30, col: '#fff6e0', write: 0.25 * T, hold: turn - 0.05 * T, fade: 0.2 * T });
            M.at(g, [[0.12 * T, g => { S.rotFrom = S.steps; S.steps++; S.rotT = g.t; S.rotDur = turn; g.sfx('whoosh'); }]]); },
          // the new function lands under the pointer, a pip lights, and a copy of it flies up into the answer:
          // one derivative fewer is left to take
          resolve(g) { M.show(g, 0.75 * T); S.shown[nx] = true; S.popK = nx; S.popT = g.t; g.sfx('coin'); react(g, 'wow');
            M.sparkle(g, 'L' + nx, { n: 10, cols: [WEDGE[nx], '#fff'] }); S.pipT = g.t;
            const from = { ...(M.box(g, 'L' + nx) || { x: CX, y: CY - R }) };
            M.fly(g, { node: fn(nx, null), from: [from.x, from.y], to: S.restF ? 'rf' : 'ans', delay: 0.1 * T, dur: 0.42 * T, arc: -50, s0: 28, s1: 30, col: '#fff6e0',
              then(g) { fillRest(g, left, nx); g.sfx('pop'); react(g);
                const b = M.box(g, 'rf'); if (b) g.burst(b.x, b.y, left ? ['#fff6e0', WEDGE[nx]] : ['#ffd27a', '#8ad0ff', '#fff'], left ? 8 : 16, left ? 90 : 140); } });
            M.at(g, [[0.7 * T, g => { S.turning = false; S.point = false; }]]); } }];
      },
      area(g) { const cur = (S.s0 + S.steps) % 4; return ['L' + (cur + 1) % 4, 'L' + cur]; },
    });
  },
  // the dial's angle (in quarter turns) and the four labels placed around it (the same node objects every frame;
  // they are drawn directly, so the kit's glides don't trail behind the turning dial)
  lay(g) {
    const S = g.s, rot = M.lerp(S.rotFrom, S.steps, M.easeIO((g.t - S.rotT) / S.rotDur)); S.rot = rot;
    for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - S.s0 - rot) * Math.PI / 2, x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R;
      const node = S.shown[k] ? S.lab[k] : S.q[k];
      if (S.popK === k && node.pop !== S.popT) node.pop = S.popT; M.place(g, 'L' + k, node, x, y + 10, 28); }
  },
  update(g, dt) { this.lay(g); M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'dusk', panel: 'none' });
    // the fox points at the dial while it turns, and hops when a function lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 318, 614 - hopK * 20, 0.95, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', 318, 614, 0.95);
    M.drawEx(g, c, 'prob');
    // pips: one per derivative to take, lit as each is taken
    for (let i = 0; i < S.n; i++) { const x = 180 + (i - (S.n - 1) / 2) * 22, on = i < S.steps && (i < S.steps - 1 || !S.turning), pk = on && i === S.steps - 1 && S.pipT != null ? Math.max(0, 1 - (t - S.pipT) / 0.35) : 0; c.fillStyle = on ? '#ffd27a' : 'rgba(255,246,224,0.3)'; c.beginPath(); c.arc(x, 262, (on ? 7 : 5.5) * (1 + 0.5 * Math.sin(pk * Math.PI)), 0, 7); c.fill(); }
    // the dial: four coloured wedges that turn with the labels, a hub, and a fixed pointer at the top
    c.save(); c.fillStyle = 'rgba(10,6,30,0.35)'; c.beginPath(); c.arc(CX + 4, CY + 8, R + 46, 0, 7); c.fill();
    for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - S.s0 - S.rot) * Math.PI / 2; c.fillStyle = WEDGE[k]; c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, R + 44, a - Math.PI / 4, a + Math.PI / 4); c.closePath(); c.fill(); }
    c.strokeStyle = '#5a3a2a'; c.lineWidth = 6; c.beginPath(); c.arc(CX, CY, R + 44, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(90,58,42,0.5)'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - S.s0 - S.rot + 0.5) * Math.PI / 2; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + Math.cos(a) * (R + 44), CY + Math.sin(a) * (R + 44)); c.stroke(); }
    c.fillStyle = '#7a4a2a'; c.beginPath(); c.arc(CX, CY, 20, 0, 7); c.fill(); c.fillStyle = '#ffe8b0'; c.beginPath(); c.arc(CX - 4, CY - 4, 6, 0, 7); c.fill();
    // the turning direction: an arrow from the right label up to the pointer
    const ak = S.arrT != null && t - S.arrT < S.arrDur ? Math.sin(Math.min(1, (t - S.arrT) / S.arrDur) * Math.PI) : 0; // the arrow glows while the dial turns
    if (ak > 0) { c.shadowColor = '#ffd27a'; c.shadowBlur = 14 * ak; }
    c.strokeStyle = 'rgba(255,246,224,0.8)'; c.lineWidth = 3.5 + 2 * ak; c.lineCap = 'round'; c.beginPath(); c.arc(CX, CY, R + 58, -0.25, -Math.PI / 2 + 0.45, true); c.stroke();
    const ea = -Math.PI / 2 + 0.45, ex = CX + Math.cos(ea) * (R + 58), ey = CY + Math.sin(ea) * (R + 58); c.beginPath(); c.moveTo(ex - 2, ey - 10); c.lineTo(ex - 10, ey + 1); c.lineTo(ex + 3, ey + 6); c.closePath(); c.fillStyle = 'rgba(255,246,224,0.8)'; c.fill();
    const py = CY - R - 50 + Math.sin(t * 4) * 2; c.fillStyle = '#ffd27a'; c.strokeStyle = '#5a3a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(CX - 13, py - 14); c.lineTo(CX + 13, py - 14); c.lineTo(CX, py + 4); c.closePath(); c.fill(); c.stroke();
    c.restore();
    for (let k = 0; k < 4; k++) { const e = S.mk.ex['L' + k]; if (e) M.draw(c, e.node, e.x, e.y, e.s, { t, col: DARK }); }
    M.drawUI(g, c);
  },
});
