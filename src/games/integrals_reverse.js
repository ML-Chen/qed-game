// integrals_reverse.js — REVERSE POWER! Integrate a power: ∫ a·xⁿ dx = a·xⁿ⁺¹/(n + 1) + C, with a = k(n + 1).
// The working line under the problem starts as a copy of the integrand. The player taps the exponent to add one,
// drags the new exponent under the term to divide by it, and taps the fraction to simplify it. Then "+ C" flies in from
// the beaver. Level 0: ∫ 2x dx or ∫ 3x² dx. Level 1: powers up to 3, a coefficient left over. Level 2: powers 3 and 4.
// Medium mode: the new exponent and the simplified term are picked from the tray.
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), HX = 292, HY = 590;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const n = L === 0 ? 1 + r(2) : L === 1 ? 2 + r(2) : 3 + r(2), k = L === 0 ? 1 : L === 1 ? 1 + r(2) : 2 + r(2);
  return { n, k, a: k * (n + 1) };
}
const mono = (c, p) => M.row(c === 1 && p > 0 ? null : M.num(c), p === 0 ? null : p === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(p)));
// the integral sign, drawn by hand (the font has none): a tall slanted S with round ends
function intSign(c, x, top, bot, w, col, lw) {
  const h = bot - top; c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x + w, top + h * 0.1);
  c.bezierCurveTo(x + w * 0.98, top - h * 0.03, x + w * 0.62, top - h * 0.03, x + w * 0.58, top + h * 0.16);
  c.lineTo(x + w * 0.42, bot - h * 0.16);
  c.bezierCurveTo(x + w * 0.38, bot + h * 0.03, x + w * 0.02, bot + h * 0.03, x, bot - h * 0.1); c.stroke();
  for (const [px, py] of [[x + w, top + h * 0.1], [x, bot - h * 0.1]]) { c.beginPath(); c.arc(px, py, lw * 0.9, 0, 7); c.fill(); }
  c.restore();
}

MG.add({
  id: 'reverse', stage: 'integrals', cmd: 'REVERSE POWER!', hint: 'tap', time: 9, winText: 'Integrated!', hold: 1.4,
  card: {
    title: 'Integrating powers', ref: 'Calculus', kind: 'Calculus',
    text: 'An integral undoes a derivative. The sign ∫ asks: which formula has this as its derivative? The dx says that x is the variable.\n\nTo integrate a power of x, run the power rule backwards. First make the power one bigger. Then divide by the new power.\n\nFor example, for ∫ 3x² dx the power 2 becomes 3, which gives 3x³ / 3 = x³. Check it: the derivative of x³ is 3x².\n\nAt the end, add + C. C stands for any constant number. A constant has derivative 0, so x³ + 5 and x³ − 1 also have the derivative 3x². The + C covers all of them.',
    note: 'Add one to the power, then divide by the new power, and add + C: ∫ xⁿ dx = xⁿ⁺¹ / (n + 1) + C.',
    ask: 'What is ∫ 4x³ dx? What is ∫ 6x dx?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { n, k, a } = S;
    S.top = M.row({ ...M.gap(30), id: 'int' }, mono(a, n), M.gap(10), M.txt('d'), M.vr('x'));
    S.term = M.row(M.num(a, 'co'), M.sup(M.vr('x', 'xv'), M.num(n, 'ex')));
    S.work = M.row(M.op('=', 'eq'), M.gap(6), S.term);
    const relay = () => M.place(g, 'work', S.work, 180, 352, 48, { col: INK }); S.relay = relay;
    M.place(g, 'top', S.top, 180, 252, 42, { col: INK }); relay();
    M.inert(g, ['int', 'eq', 'xv', 'xn', 'pc', 'cc']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.up) out.push({ tap: 'ex', busy: 0.1, askAt: 0, after: 0.1, ask: { v: n + 1, wrong: [n, n - 1, 2 * n] },
          then(g) { S.up = true; S.term.items[1].exp = M.row(M.num(n), M.op('+'), M.num(1)); relay(); },
          resolve(g) { S.term.items[1].exp = M.num(n + 1, 'e2', { pop: g.t }); relay(); g.sfx('chime'); } });
        else if (!S.div) {
          const b = M.box(g, 'co'), e = M.box(g, 'e2'), x0 = b ? b.x - b.w / 2 - 40 : 60, x1 = e ? e.x + 50 : 300;
          out.push({ drag: 'e2', to: 'co', area: [x0, 330, x1, 440], busy: 0.1,
            then(g) { S.div = true; const den = M.num(n + 1, 'den', { col: '#ffd27a', alpha: 0 }); S.term = M.frac(M.row(M.num(a), M.sup(M.vr('x'), M.num(n + 1))), den, 'fr'); S.work.items[2] = S.term; relay(); g.sfx('swoosh');
              M.fly(g, { node: M.num(n + 1, null, { col: '#ffd27a' }), from: 'e2', to: 'den', dur: 0.35, arc: 30, then() { den.alpha = 1; den.pop = g.t; } }); } });
        } else if (!S.simp) out.push({ tap: 'fr', busy: 0.1, askAt: 0, after: 0.1, ask: { v: mono(k, n + 1), wrong: [mono(a, n + 1), mono(k, n), mono(k + 1, n + 1)] },
          then(g) { S.simp = true; },
          resolve(g) {
            const t = mono(k, n + 1); t.pop = g.t; t.id = 'res'; const C = M.vr('C', 'cc', { alpha: 0 });
            S.work.items = [M.op('=', 'eq'), M.gap(6), t, M.op('+', 'pc', { pop: g.t + 0.15 }), C]; relay(); M.inert(g, ['res']); g.sfx('coin');
            M.fly(g, { node: M.vr('C', null, { col: '#ffe9a0' }), from: [HX, HY - 70], to: 'cc', dur: 0.3, arc: -90, s0: 30, s1: 48,
              then(g) { C.alpha = 1; C.pop = g.t; g.sfx('sparkle'); const bx = M.box(g, 'cc'); if (bx) g.burst(bx.x, bx.y, ['#ffe9a0', '#fff', '#9ad0ff'], 14, 150); } });
          } });
        return out;
      },
      area(g) { return !S.up ? 'ex' : !S.div ? ['e2', 'co'] : 'fr'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'library', panel: PANEL, host: 'beaver', hostX: HX, hostY: HY, hostS: 1.35 });
    const b = M.box(g, 'int'); if (b) intSign(c, b.x - 12, 252 - 42 * 1.12, 252 + 42 * 0.38, 20, INK, 3.6);
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work');
    M.drawUI(g, c);
  },
});
