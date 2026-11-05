// integrals_reverse.js — REVERSE POWER! Integrate a power: ∫ a·xⁿ dx = a·xⁿ⁺¹/(n + 1) + C, with a = k(n + 1).
// The working line under the problem starts as a copy of the integrand, and every step is acted out (show your work):
//   1. Tap the exponent: a chalk "+1" writes itself and flies in, the exponent reads "n + 1", then merges into the new power.
//   2. Drag the new power under the term: the fraction bar draws itself and a copy of the power drops under it.
//   3. Tap the fraction: "a ÷ (n + 1) = k" writes itself underneath, a and n + 1 are crossed out, k flies up into place,
//      "+ C" flies in from the beaver, and a d/dx arrow loops back to the integrand to check the answer.
// The fuse stands still while the work is shown. Level 0: ∫ 2x dx or ∫ 3x² dx. Level 1: powers up to 3, a coefficient
// left over. Level 2: powers 3 and 4. Medium mode: the new power and the quotient are picked from the tray.
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), HX = 292, HY = 596, TOPY = 238, WORKY = 334, NOTEY = 404, CHALK = '#ffd27a', BIG = 1.75;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const n = L === 0 ? 1 + r(2) : L === 1 ? 2 + r(2) : 3 + r(2), k = L === 0 ? 1 : L === 1 ? 1 + r(2) : 2 + r(2);
  return { n, k, a: k * (n + 1) };
}
// an exponent grown so the work on it is easy to see: scaled about its centre, then nudged up and right off the x
const grow = b => b ? { sc: BIG, dx: (BIG - 1) * b.w / 2 + 2, dy: -(BIG - 1) * b.h * 0.35 } : { sc: BIG };
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
  id: 'reverse', stage: 'integrals', cmd: 'REVERSE POWER!', hint: 'tap', time: 9, winText: 'Integrated!', hold: 1.9,
  card: {
    title: 'Integrating powers', ref: 'Calculus', kind: 'Calculus',
    text: 'An integral undoes a derivative. The sign ∫ asks: which formula has this as its derivative? The dx says that x is the variable.\n\nTo integrate a power of x, run the power rule backwards. First make the power one bigger. Then divide by the new power.\n\nFor example, for ∫ 3x² dx the power 2 becomes 3, which gives 3x³ / 3 = x³. Check it: the derivative of x³ is 3x².\n\nAt the end, add + C. C stands for any constant number. A constant has derivative 0, so x³ + 5 and x³ − 1 also have the derivative 3x². The + C covers all of them.',
    note: 'Add one to the power, then divide by the new power, and add + C: ∫ xⁿ dx = xⁿ⁺¹ / (n + 1) + C.',
    ask: 'What is ∫ 4x³ dx? What is ∫ 6x dx?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { n, k, a } = S, T = M.pace(g);
    S.ig = mono(a, n); S.ig.id = 'ig'; S.top = M.row({ ...M.gap(30), id: 'int' }, S.ig, M.gap(10), M.txt('d'), M.vr('x'));
    S.co = M.num(a, 'co'); S.pw = M.sup(M.vr('x', 'xv'), M.num(n, 'ex')); S.term = M.row(S.co, S.pw);
    S.work = M.row(M.op('=', 'eq'), M.gap(6), S.term);
    const relay = () => M.place(g, 'work', S.work, 180, WORKY, 48, { col: INK }); S.relay = relay;
    M.place(g, 'top', S.top, 180, TOPY, 42, { col: INK }); relay();
    M.inert(g, ['ig', 'int', 'eq', 'xv', 'pc', 'cc', 'den', 'nexp', 'q']);
    const hop = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. add one to the power
        if (!S.up) out.push({ tap: 'ex', busy: 0.1, askAt: 0.8 * T, after: 1.35 * T, ask: { v: n + 1, wrong: [n, n - 1, 2 * n] },
          then(g) { S.up = true; M.show(g, 0.8 * T); S.point = true;
            // the small exponent grows so the work on it is easy to see, and shrinks back once the new power is in
            M.circle(g, 'ex', { dur: 0.5 * T }); M.tween(g, 'ex', { ...grow(M.box(g, 'ex')), hl: 1 }, 0.25 * T);
            M.note(g, { node: M.row(M.op('+'), M.num(1)), at: 'ex', off: [46, -36], s: 36, col: CHALK, write: 0.3 * T, hold: 0.12 * T, fly: 0.3 * T, to: 'ex', toOff: [40, 0], s1: 34, arc: 10,
              then(g) { const old = S.pw.exp; Object.assign(old, { sc: 1, dx: 0, dy: 0 }); S.pw.exp = M.row(old, M.op('+', 'eP', { col: CHALK, _born: -1 }), M.num(1, 'eB', { col: CHALK, _born: -1, pop: g.t })); S.pw.exp.id = 'erow'; relay(); Object.assign(S.pw.exp, grow(M.box(g, 'erow'))); relay(); M.sparkle(g, 'eB', { n: 6 }); g.sfx('tap'); hop(g, 'think'); } }); },
          resolve(g) { M.show(g, 1.35 * T); const row = S.pw.exp, [old, pl, one] = row.items; for (const q of row.items) M.indicate(g, q, { dur: 0.3 * T, sc: 1.15, delay: 0.2 * T });
            M.at(g, [
              [0.5 * T, g => { // the + 1 slides into the old power and the power rolls over to the new one, like an odometer
                const bo = M.box(g, 'ex'); for (const q of [pl, one]) { const b = M.box(g, q.id); M.tween(g, q, { dx: bo.x - b.x, alpha: 0, sc: 0.5 }, 0.28 * T); }
                M.roll(g, old, n + 1, { delay: 0.12 * T, dur: 0.3 * T }); M.at(g, [[0.3 * T, g => { M.sparkle(g, 'erow', { n: 10 }); g.sfx('ding'); hop(g); }]]); }],
              [0.95 * T, g => { M.tween(g, row, { sc: 1, dx: 0, dy: 0 }, 0.25 * T); M.unlight(g, old, { dur: 0.3 * T }); }],
              [1.25 * T, g => { old.id = 'e2'; S.pw.exp = old; relay(); }],
            ]); } });
        // 2. divide by the new power
        else if (!S.div) {
          const b = M.box(g, 'co'), e = M.box(g, 'e2'), x0 = b ? b.x - b.w / 2 - 40 : 60, x1 = e ? e.x + 50 : 300;
          out.push({ drag: 'e2', to: 'co', area: [x0, WORKY - 30, x1, WORKY + 90], busy: 0.1,
            then(g) { S.div = true; const from = { ...M.box(g, 'e2') }; M.show(g, 0.75 * T); S.point = false;
              S.den = M.num(n + 1, 'den', { col: CHALK, alpha: 0 }); S.pw.exp.id = 'nexp';
              S.term = M.frac(M.row(S.co, S.pw), S.den, 'fr', { bar: { t0: g.t, dur: 0.35 * T } }); S.work.items[2] = S.term; relay(); g.sfx('swoosh');
              M.indicate(g, S.pw.exp, { dur: 0.4 * T });
              M.fly(g, { node: M.num(n + 1, null, { col: CHALK }), from: [from.x, from.y], to: 'den', delay: 0.12 * T, dur: 0.45 * T, arc: -40, s0: 30, s1: 39,
                then(g) { S.den.alpha = 1; S.den.pop = g.t; M.sparkle(g, 'den', { n: 8 }); g.sfx('pop'); hop(g); } }); } });
        // 3. simplify a ÷ (n + 1), then + C
        } else if (!S.simp) out.push({ tap: 'fr', busy: 0.1, askAt: 0.75 * T, after: 1.3 * T, ask: { v: k, wrong: [a, k + 1, a * (n + 1)] },
          then(g) { S.simp = true; M.show(g, 0.75 * T); S.point = true; hop(g, 'think');
            M.circle(g, ['co', 'den'], { dur: 0.6 * T }); M.light(g, 'co'); M.light(g, 'den');
            S.q = M.num(k, 'q', { alpha: 0 });
            S.note = M.row(M.num(a, 'qa'), M.op('÷'), M.num(n + 1, 'qb'), M.op('='), S.q);
            M.place(g, 'note', S.note, 180, NOTEY, 32, { col: CHALK }); M.writeIn(g, S.note, { dur: 0.45 * T, delay: 0.15 * T }); },
          resolve(g) { M.show(g, 1.3 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.22 * T }); M.indicate(g, S.q, { delay: 0.18 * T, dur: 0.35 * T }); g.sfx('ding');
            M.strike(g, 'co', { delay: 0.3 * T }); M.strike(g, 'den', { delay: 0.4 * T });
            M.at(g, [
              [0.7 * T, g => { // the fraction collapses: a/(n + 1) becomes k, and k flies up from the working line
                const from = { ...M.box(g, 'q') }; S.co.hl = 0; S.den.hl = 0;
                const kc = M.num(k, 'rk', { alpha: 0 }); S.res = M.row(k === 1 ? null : kc, S.pw); S.res.id = 'res';
                S.cc = M.vr('C', 'cc', { alpha: 0 }); S.plus = M.op('+', 'pc', { alpha: 0 });
                S.work.items = [S.work.items[0], S.work.items[1], S.res, S.plus, S.cc]; relay(); M.inert(g, ['res', 'rk']); g.sfx('coin'); hop(g);
                M.tween(g, S.note, { alpha: 0 }, 0.35 * T);
                if (k !== 1) M.fly(g, { node: M.num(k, null, { col: CHALK }), from: [from.x, from.y], to: 'rk', dur: 0.32 * T, arc: 20, s0: 32, s1: 48, then(g) { kc.alpha = 1; kc.pop = g.t; M.sparkle(g, 'rk'); } });
                else M.indicate(g, S.pw, { delay: 0.1 * T }); }],
              [1.05 * T, g => { S.plus.alpha = 1; S.plus.pop = g.t; delete g.s.mk.ex.note; S.point = false;
                M.fly(g, { node: M.vr('C', null, { col: '#ffe9a0' }), from: [HX, HY - 80], to: 'cc', dur: 0.36 * T, arc: -90, s0: 30, s1: 48,
                  then(g) { S.cc.alpha = 1; S.cc.pop = g.t; g.sfx('sparkle'); hop(g, 'laugh'); const bx = M.box(g, 'cc'); if (bx) g.burst(bx.x, bx.y, ['#ffe9a0', '#fff', '#9ad0ff'], 14, 150); } }); }],
              // the check: differentiate the answer and get the integrand back
              [1.25 * T, g => { M.arrow(g, 'res', 'ig', { dur: 0.45 * T, bend: -70, col: '#9ad0ff', label: M.frac(M.txt('d'), M.row(M.txt('d'), M.vr('x'))), ls: 40, linger: 1.6 * T });
                M.indicate(g, S.res, { dur: 0.4 * T, col: '#9ad0ff', sc: 1.12 }); M.indicate(g, S.ig, { delay: 0.4 * T, dur: 0.5 * T, col: '#9ad0ff', sc: 1.2 }); M.sparkle(g, 'ig', { delay: 0.45 * T, cols: ['#9ad0ff', '#fff'] }); }],
            ]); } });
        return out;
      },
      area(g) { return !S.up ? 'ex' : !S.div ? ['e2', 'co'] : 'fr'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'library', panel: PANEL, panelY: 306, panelH: 232 });
    // the beaver points at the board while the work is shown, and reacts when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'beaver', HX, HY - hopK * 24, 1.35, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, 'beaver', HX, HY, 1.35);
    const b = M.box(g, 'int'); if (b) intSign(c, b.x - 12, TOPY - 42 * 1.12, TOPY + 42 * 0.38, 20, INK, 3.6);
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work'); M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
