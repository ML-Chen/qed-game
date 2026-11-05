// integrals_usub.js — U-SUBSTITUTION! Integrate m·x^(m−1)·(x^m + k)ⁿ by substituting u = x^m + k.
// A sheet of paper in a cosy library; an owl keeps watch and points while the work is shown. A yellow sticky note
// carries the letter u. Every move is acted out (show your work):
//   1. Drag u onto (x^m + k): the inside is circled, the key line "u = x^m + k" writes itself at the top, then
//      "du = m·x^(m−1) dx"; the matching m·x^(m−1) and dx light up blue and are crossed out, and the integral closes up
//      into ∫ uⁿ du as u flies down from the key line into the bracket's place (the ∫ and the power glide over).
//   2. Tap ∫ uⁿ du: a "+1" writes itself by the power and flies in, the power rolls over to n + 1, the ∫ and du fade,
//      the fraction bar draws itself with n + 1 dropping under it, and + C flies in from the owl.
//   3. Drag x^m + k from the key line onto u: a copy flies down into u's place and the answer swells. Level 0–1: u = x² + k. Level 2: u = x³ + k.
// Medium mode: the integration step opens a tray once the "+1" has landed (wrong tiles: forgetting to divide, dividing by n, differentiating).
const M = MK;
const gapId = (w, id) => ({ k: 'gap', w, id }); // MK.gap takes no id
function intSign(c, x, yT, yB, col) {
  const h = yB - yT, w = h * 0.3; c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(2, h * 0.075); c.beginPath();
  c.moveTo(x + w * 0.62, yT + h * 0.08); c.bezierCurveTo(x + w * 0.45, yT - h * 0.03, x + w * 0.08, yT - h * 0.02, x + w * 0.04, yT + h * 0.2);
  c.lineTo(x - w * 0.04, yB - h * 0.2); c.bezierCurveTo(x - w * 0.08, yB + h * 0.02, x - w * 0.45, yB + h * 0.03, x - w * 0.62, yB - h * 0.08); c.stroke(); c.restore();
}
// a tray tile is 74–86 px wide: shrink any answer that would not fit
function fitAsk(g) { const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; for (const ch of A.list) { const w = M.lay(ch.node, 34).w; ch.s = w > ch.w - 12 ? 34 * (ch.w - 12) / w : 34; M.lay(ch.node, ch.s); } }
// every symbol in a subtree: shown at once (it lands from a flying copy), or faded out (so it leaves no ghost when removed)
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])];
const bornAll = n => { if (!n) return n; n._born = -1; kids(n).forEach(bornAll); return n; };
const hideAll = n => { if (!n) return; n.alpha = 0; kids(n).forEach(hideAll); };
const pw = (v, e, id) => e === 1 ? M.vr(v, id) : M.sup(M.vr(v, id), M.num(e));
const Y0 = 226, Y1 = 322, SZ = 40;

MG.add({
  id: 'integrals_usub', stage: 'integrals', cmd: 'U-SUBSTITUTION!', hint: 'drag', time: 9, mood: 'bright', winText: 'Substituted!', hold: 1.4,
  card: {
    title: 'Integration by substitution', ref: 'Grade 12 and up', kind: 'Calculus',
    text: 'Substitution undoes the chain rule. You look for a part of the integral whose derivative also appears in it.\n\nIn ∫ 2x(x² + 1)³ dx, let u = x² + 1. The derivative of u is 2x, so du = 2x dx. The 2x and the dx together become du, and the integral turns into ∫ u³ du.\n\nThat one is easy: ∫ u³ du = u⁴/4 + C. Then put x² + 1 back in place of u. The answer is (x² + 1)⁴/4 + C.\n\nThe C stands for any constant number. Adding a constant does not change the derivative, so every such answer works.\n\nYou can check the answer: by the chain rule, the derivative of (x² + 1)⁴/4 is (x² + 1)³ · 2x.',
    note: 'Choose u so that its derivative is also in the integral. Replace that part with du, integrate in u, then put the original expression back in place of u.',
    ask: 'What is ∫ 2x(x² + 5)² dx? What would you choose for u in ∫ 3x²(x³ − 1)⁴ dx?',
  },
  init(g) {
    const S = g.s, R = a => a[Math.floor(g.rand() * a.length)], L = g.level; M.setup(g);
    const m = L === 2 ? 3 : 2, n = L === 0 ? R([2, 3]) : R([2, 3, 4]), k = R([1, 2, 3, 4, 5]), col = SCN.ink('paper');
    Object.assign(S, { m, n, k, col });
    const inner = id => { const r = M.row(pw('x', m), M.op('+'), M.num(k)); r.id = id; return r; };
    const gx = M.row(M.num(m), pw('x', m - 1)); gx.id = 'gx';
    const dx = M.row(M.txt('d'), M.vr('x')); dx.id = 'dx';
    S.intG = gapId(SZ * 0.45, 'int');
    S.ne = M.num(n, 'ne'); S.par = M.paren(inner(), 'in');
    S.main = M.row(S.intG, gx, M.sup(S.par, S.ne), M.gap(8), dx);
    S.uN = M.vr('u', 'u');
    const relay = () => { M.place(g, 'main', S.main, 180, Y1, SZ, { col }); if (S.key) M.place(g, 'key', S.key, 180, Y0, 25, { col }); else M.place(g, 'chip', S.uN, 180, Y0, 46, { col: '#5a3a10' }); };
    relay(); M.inert(g, ['int', 'ku', 'k2', 'eP', 'e1']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const T = M.pace(g), GOLD = '#d88a10', BLUE = '#2a7ab0';
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const uans = () => M.frac(pw('u', n + 1), M.num(n + 1));
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        // 1. substitute: the inside is circled and named u in a key line that writes itself above; du = m·x^(m−1) dx
        //    writes itself next to it, the matching m·x^(m−1) and dx light up and are crossed out, and the integral
        //    closes up into ∫ uⁿ du as u flies down from the key line into the bracket's place
        if (!S.sub) return [{ drag: 'u', to: 'in', busy: 0.1, then(g) {
          S.sub = true; S.subAt = g.t; M.show(g, 2.0 * T); S.point = true; react(g, 'think'); g.sfx('magic');
          const inn = M.node(g, 'in'); M.circle(g, 'in', { col: GOLD, dur: 0.5 * T }); M.light(g, inn, { col: GOLD });
          S.k1 = M.row(M.vr('u', 'ku', { col: GOLD }), M.op('='), inner('ux')); S.k1.id = 'k1';
          S.k2 = M.row(M.txt('d'), M.vr('u'), M.op('='), M.num(m), pw('x', m - 1), M.gap(5), M.txt('d'), M.vr('x')); S.k2.id = 'k2';
          S.key = M.row(S.k1, M.gap(22), S.k2); relay();
          M.writeIn(g, S.k1, { delay: 0.12 * T, dur: 0.4 * T }); M.writeIn(g, S.k2, { delay: 0.6 * T, dur: 0.4 * T });
          M.at(g, [
            [0.55 * T, g => { S.keyOn = true; g.sfx('tap'); }],
            [1.0 * T, g => { for (const q of [gx, dx, S.k2]) M.light(g, q, { col: BLUE }); M.circle(g, 'gx', { col: BLUE, dur: 0.35 * T }); M.circle(g, 'dx', { col: BLUE, dur: 0.35 * T }); g.sfx('tap'); react(g); }],
            [1.2 * T, g => { M.strike(g, gx, { dur: 0.18 * T }); M.strike(g, dx, { delay: 0.06 * T, dur: 0.18 * T }); }],
            [1.38 * T, g => { // m·x^(m−1) and dx fade, the bracket fades as u flies down from the key line into its place
              M.tween(g, gx, { alpha: 0 }, 0.2 * T); M.tween(g, dx, { alpha: 0 }, 0.2 * T); M.tween(g, S.par, { alpha: 0 }, 0.25 * T); M.unlight(g, S.k2, { dur: 0.3 * T });
              M.fly(g, { node: M.vr('u', null, { col: GOLD }), from: 'ku', to: 'in', dur: 0.3 * T, arc: -30, s0: 25, s1: SZ, col: GOLD }); }],
            [1.68 * T, g => { // the integral closes up into ∫ uⁿ du: the ∫ and the power glide over, du writes itself
              hideAll(gx); hideAll(dx); hideAll(S.par); S.u0 = M.vr('u', 'u0', { col: GOLD, _born: -1, pop: g.t }); S.ue = S.ne; S.ue.id = 'ue';
              S.du = M.row(M.txt('d', null, { col: BLUE }), M.vr('u', null, { col: BLUE })); S.du.id = 'du';
              S.uS = M.sup(S.u0, S.ue); S.main = M.row(S.intG, S.uS, M.gap(8), S.du); S.main.id = 'iu'; relay(); M.writeIn(g, S.du, { delay: 0.1 * T, dur: 0.25 * T });
              M.sparkle(g, 'u0', { n: 8 }); g.sfx('pop'); react(g, 'wow'); }],
            [2.0 * T, g => { S.point = false; }],
          ]); } }];
        // 2. integrate in u: a "+1" writes itself by the power and flies in, the power rolls over, the fraction bar draws
        //    itself, the new power drops under it, the ∫ and du fade, and + C flies in from the owl
        if (!S.integ) return [{ tap: ['iu', 'u0', 'ue', 'du', 'e1', 'eP'], busy: 0.1, askAt: 0.75 * T, after: 1.3 * T,
          ask: { v: uans(), wrong: [pw('u', n + 1), M.frac(pw('u', n), M.num(n)), M.row(M.num(n), pw('u', n - 1))] },
          then(g) { M.show(g, 0.75 * T); S.point = true; react(g, 'think'); M.circle(g, 'ue', { dur: 0.45 * T }); M.light(g, S.ue);
            M.note(g, { node: M.row(M.op('+'), M.num(1)), at: 'ue', off: [30, -24], s: 26, col: GOLD, write: 0.28 * T, hold: 0.1 * T, fly: 0.28 * T, to: 'ue', s1: 22, arc: 10,
              then(g) { // the power reads "n + 1" while it is worked out
                S.eP = M.op('+', 'eP', { col: GOLD, _born: -1 }); S.e1 = M.num(1, 'e1', { col: GOLD, _born: -1, pop: g.t }); S.uS.exp = M.row(S.ue, S.eP, S.e1); relay();
                M.sparkle(g, 'e1', { n: 6 }); g.sfx('tap'); } }); },
          resolve(g) { S.integ = true; M.show(g, 1.3 * T); g.sfx('ding'); react(g);
            // the + 1 slides into the power, which rolls over like an odometer
            const bo = M.box(g, 'ue'); for (const id of ['eP', 'e1']) { const b = M.box(g, id); M.tween(g, S[id], { dx: bo && b ? bo.x - b.x : -12, alpha: 0, sc: 0.5 }, 0.22 * T); }
            M.roll(g, S.ue, n + 1, { delay: 0.08 * T, dur: 0.28 * T });
            M.at(g, [
              [0.3 * T, g => { S.eP.alpha = 0; S.e1.alpha = 0; S.uS.exp = S.ue; relay(); M.unlight(g, S.ue); M.tween(g, S.intG, { alpha: 0 }, 0.22 * T); for (const q of [S.du, ...S.du.items]) M.tween(g, q, { alpha: 0 }, 0.22 * T); }],
              [0.55 * T, g => { hideAll(S.du); const from = { ...M.box(g, 'ue') }; S.dn = M.num(n + 1, 'dn', { alpha: 0 }); S.plus = M.op('+', 'pc', { alpha: 0 }); S.cc = M.vr('C', 'cc', { alpha: 0 });
                S.fr = M.frac(M.row(S.uS), S.dn, 'fr', { bar: { t0: g.t, dur: 0.3 * T } }); S.main = M.row(S.fr, S.plus, S.cc); relay(); g.sfx('swoosh');
                M.fly(g, { node: M.num(n + 1, null, { col: GOLD }), from: [from.x, from.y], to: 'dn', delay: 0.08 * T, dur: 0.32 * T, arc: -30, s0: 22, s1: SZ * 0.82,
                  then(g) { S.dn.alpha = 1; S.dn.pop = g.t; M.sparkle(g, 'dn', { n: 8 }); g.sfx('pop'); react(g); } }); }],
              [1.0 * T, g => { S.plus.alpha = 1; S.plus.pop = g.t; S.point = false;
                M.fly(g, { node: M.vr('C', null, { col: GOLD }), from: [74, 520], to: 'cc', dur: 0.3 * T, arc: -80, s0: 26, s1: SZ,
                  then(g) { S.cc.alpha = 1; S.cc.pop = g.t; g.sfx('sparkle'); react(g, 'laugh'); } }); }],
            ]); } }];
        // 3. put x back: x^m + k is circled in the key line and a copy of it flies down into u's place
        return [{ drag: 'ux', to: ['u0', 'fr'], busy: 0.1, then(g) {
          S.done = true; S.doneAt = g.t; M.show(g, 1.05 * T); S.point = true; react(g, 'think'); g.sfx('whoosh'); M.inert(g, ['ux']);
          M.circle(g, 'ux', { col: GOLD, dur: 0.4 * T }); M.light(g, S.u0, { col: GOLD });
          M.fly(g, { node: M.paren(inner(null)), from: 'ux', to: 'u0', delay: 0.12 * T, dur: 0.42 * T, arc: -40, s0: 25, s1: SZ * 0.82, col: GOLD });
          M.tween(g, S.u0, { alpha: 0 }, 0.2 * T, { delay: 0.34 * T });
          M.at(g, [
            [0.56 * T, g => { const P = bornAll(M.paren(inner(null), 'pb', { pop: g.t })); hideAll(S.u0);
              S.uS.base = P; S.fr.id = 'fin'; relay(); M.inert(g, ['fin', 'pb']); g.sfx('chime'); react(g, 'wow');
              M.tween(g, S.key, { alpha: 0.45 }, 0.3 * T); const b = M.box(g, 'fin'); if (b) g.burst(b.x, b.y, ['#ffd45a', '#c88a3a', '#fff'], 12, 140); }],
            [0.85 * T, g => { M.indicate(g, S.fr, { dur: 0.35 * T, sc: 1.1 }); react(g, 'laugh'); }],
            [1.05 * T, g => { S.point = false; }],
          ]); } }];
      },
      area(g) { return !S.sub ? ['u', 'in'] : !S.integ ? ['iu'] : ['ux', 'u0']; },
    });
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, col = SCN.std(g, c, { scene: 'library', panel: 'paper', panelY: 284, panelH: 210 });
    // the owl points at the paper while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 70, 596 - hopK * 22, 1.2, { t, pose, expr }); else SCN.host(g, c, 'owl', 70, 596, 1.2);
    // the sticky note that carries u (it peels away once used)
    if (!S.sub) { const b = M.box(g, 'chip'); if (b) { c.save(); c.translate(b.x, b.y + Math.sin(t * 2) * 1.5); c.rotate(-0.06); c.fillStyle = 'rgba(60,40,10,0.25)'; c.fillRect(-26, -24, 56, 54); c.fillStyle = '#ffe36a'; c.fillRect(-28, -28, 56, 54); c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(-28, -28, 56, 10); c.restore(); } }
    else if (t - S.subAt < 0.4) { const k = (t - S.subAt) / 0.4; c.save(); c.globalAlpha = 1 - k; c.translate(180 + k * 120, Y0 - k * 60); c.rotate(k * 2); c.fillStyle = '#ffe36a'; c.fillRect(-28, -28, 56, 54); c.restore(); }
    if (S.key) { const b = M.box(g, 'ux'); if (b && S.keyOn && !S.done) { c.save(); c.fillStyle = 'rgba(255,210,90,0.35)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 5, b.y - b.h / 2 - 3, b.w + 10, b.h + 6, 8); c.fill(); c.restore(); } M.drawEx(g, c, 'key'); }
    else M.drawEx(g, c, 'chip');
    M.drawEx(g, c, 'main');
    // the ∫ sign follows its gap as it glides (drawn after the line, once the glide is known), and fades with it
    { const n = S.intG, b = M.box(g, 'int'); if (b && (n.alpha ?? 1) > 0.01 && M.node(g, 'int')) { c.save(); c.globalAlpha = n.alpha ?? 1; c.translate(n._ax || 0, n._ay || 0); intSign(c, b.x - b.w / 2 + b.s * 0.22, b.y - b.s * 0.98, b.y + b.s * 0.3, col); c.restore(); } }
    fitAsk(g); M.drawUI(g, c);
  },
});
