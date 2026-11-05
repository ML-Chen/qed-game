// integrals_usub.js — U-SUBSTITUTION! Integrate m·x^(m−1)·(x^m + k)ⁿ by substituting u = x^m + k.
// A sheet of paper in a cosy library; an owl keeps watch. A yellow sticky note carries the letter u. The player drags
// u onto (x^m + k): the factor m·x^(m−1) and dx are swallowed into du, the integral becomes ∫ uⁿ du, and a key line
// "u = x^m + k   du = m·x^(m−1) dx" appears at the top. Tapping ∫ uⁿ du integrates it to u^(n+1)/(n+1) + C.
// Then the player drags x^m + k from the key line back onto u. Level 0–1: u = x² + k. Level 2: u = x³ + k.
// Medium mode: the integration step opens a tray (wrong tiles: forgetting to divide, dividing by n, differentiating).
const M = MK;
const gapId = (w, id) => ({ k: 'gap', w, id }); // MK.gap takes no id
function intSign(c, x, yT, yB, col) {
  const h = yB - yT, w = h * 0.3; c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(2, h * 0.075); c.beginPath();
  c.moveTo(x + w * 0.62, yT + h * 0.08); c.bezierCurveTo(x + w * 0.45, yT - h * 0.03, x + w * 0.08, yT - h * 0.02, x + w * 0.04, yT + h * 0.2);
  c.lineTo(x - w * 0.04, yB - h * 0.2); c.bezierCurveTo(x - w * 0.08, yB + h * 0.02, x - w * 0.45, yB + h * 0.03, x - w * 0.62, yB - h * 0.08); c.stroke(); c.restore();
}
// a tray tile is 74–86 px wide: shrink any answer that would not fit
function fitAsk(g) { const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; for (const ch of A.list) { const w = M.lay(ch.node, 34).w; ch.s = w > ch.w - 12 ? 34 * (ch.w - 12) / w : 34; M.lay(ch.node, ch.s); } }
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
    S.main = M.row(gapId(SZ * 0.45, 'int'), gx, M.sup(M.paren(inner(), 'in'), M.num(n, 'ne')), M.gap(8), dx);
    S.uN = M.vr('u', 'u');
    const relay = () => { M.place(g, 'main', S.main, 180, Y1, SZ, { col }); if (S.key) M.place(g, 'key', S.key, 180, Y0, 25, { col }); else M.place(g, 'chip', S.uN, 180, Y0, 46, { col: '#5a3a10' }); };
    relay(); M.inert(g, ['int', 'int2']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const uans = () => M.frac(pw('u', n + 1), M.num(n + 1));
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        if (!S.sub) return [{ drag: 'u', to: 'in', busy: 0.1, then(g) {
          S.sub = true; S.subAt = g.t; g.sfx('magic');
          const du = M.row(M.txt('d'), M.vr('u'));
          S.main = M.row(gapId(SZ * 0.45, 'int2'), M.sup(M.vr('u', 'u0', { pop: g.t }), M.num(n)), M.gap(8), du); S.main.id = 'iu';
          S.key = M.row(M.vr('u'), M.op('='), inner('ux'), M.gap(22), M.txt('d'), M.vr('u'), M.op('='), M.num(m), pw('x', m - 1), M.gap(5), M.txt('d'), M.vr('x'));
          relay(); } }];
        if (!S.integ) return [{ tap: ['iu', 'u0'], busy: 0.1,
          ask: { v: uans(), wrong: [pw('u', n + 1), M.frac(pw('u', n), M.num(n)), M.row(M.num(n), pw('u', n - 1))] },
          then(g) {}, resolve(g) { S.integ = true; g.sfx('coin');
            S.main = M.row(M.frac(pw('u', n + 1, 'uu'), M.num(n + 1, 'dn'), null, { pop: g.t }), M.op('+'), M.vr('C', 'cc')); relay(); } }];
        return [{ drag: 'ux', to: 'uu', busy: 0.1, then(g) {
          S.done = true; S.doneAt = g.t; g.sfx('chime');
          S.main = M.row(M.frac(M.sup(M.paren(inner(null)), M.num(n + 1)), M.num(n + 1), 'fin', { pop: g.t }), M.op('+'), M.vr('C')); relay();
          M.node(g, 'ux').alpha = 0.45; M.inert(g, ['ux', 'fin']);
          const b = M.box(g, 'fin'); if (b) g.burst(b.x, b.y, ['#ffd45a', '#c88a3a', '#fff'], 12, 140); } }];
      },
      area(g) { return !S.sub ? ['u', 'in'] : !S.integ ? ['iu'] : ['ux', 'uu']; },
    });
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, col = SCN.std(g, c, { scene: 'library', panel: 'paper', panelY: 284, panelH: 210, host: 'owl', hostX: 70, hostY: 596, hostS: 1.2 });
    // the sticky note that carries u (it peels away once used)
    if (!S.sub) { const b = M.box(g, 'chip'); if (b) { c.save(); c.translate(b.x, b.y + Math.sin(t * 2) * 1.5); c.rotate(-0.06); c.fillStyle = 'rgba(60,40,10,0.25)'; c.fillRect(-26, -24, 56, 54); c.fillStyle = '#ffe36a'; c.fillRect(-28, -28, 56, 54); c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(-28, -28, 56, 10); c.restore(); } }
    else if (t - S.subAt < 0.4) { const k = (t - S.subAt) / 0.4; c.save(); c.globalAlpha = 1 - k; c.translate(180 + k * 120, Y0 - k * 60); c.rotate(k * 2); c.fillStyle = '#ffe36a'; c.fillRect(-28, -28, 56, 54); c.restore(); }
    for (const id of ['int', 'int2']) { const n = M.node(g, id), b = M.box(g, id); if (n && b) intSign(c, b.x - b.w / 2 + b.s * 0.22, b.y - b.s * 0.98, b.y + b.s * 0.3, col); }
    if (S.key) { const b = M.box(g, 'ux'); if (b && !S.done) { c.save(); c.fillStyle = 'rgba(255,210,90,0.35)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 5, b.y - b.h / 2 - 3, b.w + 10, b.h + 6, 8); c.fill(); c.restore(); } M.drawEx(g, c, 'key'); }
    else M.drawEx(g, c, 'chip');
    M.drawEx(g, c, 'main');
    fitAsk(g); M.drawUI(g, c);
  },
});
