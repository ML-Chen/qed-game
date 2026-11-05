// logs_log.js — LOGARITHM! Find logₐ N by rewriting it as a power: log₂ 8 = ? means 2^? = 8.
// Moves: drag the base 2 onto the 8 (the problem becomes 2^? = 8), tap the 8 to split it into 2 · 2 · 2, tap 2 · 2 · 2
// to count the 2s (it becomes 2³), then drag the 3 into the ? (log₂ 8 = 3). The split and count may also come first.
// Show your work: on the rewrite, log₂ melts into the big base 2 while the 8 and the ? trade places. On the split, the
// 2s appear one at a time and a running product under them rolls 2, 4, 8 until it matches. On the count, the 2s are
// numbered 1, 2, 3 and the last count flies up to become the exponent while the copies fold into the base. On the last
// move the 3 drops into the ?, both exponents glow, and the line turns back into log₂ 8 = 3 (2³ folds back into 8).
// Level 0: log₂ 4, log₂ 8, log₃ 9. Level 1: answers 3 or 4. Level 2: answers 3 to 5, with base 10 too.
// Medium mode: the count opens the tray.
const M = MK, INK = SCN.ink('paper'), BASE = '#2a7ab0', ANS = '#c0402a', RUN = '#3a9a5a', HX = 74, HY = 592;
function gen(g) {
  const L = g.level, pick = a => a[Math.floor(g.rand() * a.length)];
  const [a, k] = pick(L === 0 ? [[2, 2], [2, 3], [3, 2]] : L === 1 ? [[2, 4], [3, 3], [5, 2], [10, 2]] : [[2, 5], [3, 4], [10, 3], [4, 3]]);
  return { a, k, N: Math.pow(a, k) };
}
// log with a subscript base (the kit has no subscript, so the base is a superscript shifted down; its box is moved too)
const SUB = 0.62;
function fixSub(g) { const S = g.s, b = M.box(g, 'bs'); if (b && (!S.rew || S.won)) b.y = S.subY; }
const logForm = S => !S.rew || S.won;
// leaf symbols are made once and reused (so they glide); the wrappers around them are made fresh on every layout.
// One node is both the small base of the log and the big base of the power, so it glides between the two places.
function build(g) {
  const S = g.s, L = logForm(S);
  const arg = () => S.sp === 0 ? S.Nd : S.sp === 1 ? Object.assign(M.row(...S.cp.flatMap((n, i) => [i ? S.dots[i - 1] : null, n])), { id: 'fac' }) : M.sup(S.cp[0], S.kn, 'pw');
  S.Nd.id = S.sp === 0 ? 'N' : undefined; S.kn.id = 'k'; S.q.id = S.rew ? 'q2' : 'q'; S.bn.id = L ? 'bs' : 'B';
  const mk = s => { S.q.w = S.rew ? s * 0.8 : undefined; const lg = M.row(M.sup(S.lg, S.bn), M.gap(8));
    if (S.won) return M.row(lg, S.cp[0], S.eq, S.ansN);
    if (!S.rew) { const A = arg(); return M.row(lg, S.sp === 1 ? M.paren(A, 'par') : A, S.eq, S.q); }
    return M.row(M.sup(S.bn, S.q), S.eq, arg()); };
  let s = 60; while (s > 28 && M.lay(mk(s), s).w > 312) s -= 2;
  if (S.bn.dy == null) S.bn.dy = s * SUB; S.sz = s; // the base's drop to a subscript is tweened when it moves
  M.place(g, 'ex', mk(s), 180, 306, s, { col: INK });
  const b = M.box(g, 'bs'); if (b) S.subY = b.y + s * SUB; fixSub(g);
}
// the beaver hops on each beat and points at the board while the work is shown
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c) {
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && g.t - mk.missAt < 0.7;
  const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, 'beaver', HX, HY - hk * 24, 1.4, { t: g.t, pose, expr }); else SCN.host(g, c, 'beaver', HX, HY, 1.4);
}
// the count under the copies: 1, 2, 3 appear one after another while S.cnt is set
function drawCount(g, c) {
  const S = g.s; if (!S.cnt) return; const out = S.cnt.out != null ? 1 - M.clamp((g.t - S.cnt.out) / 0.2, 0, 1) : 1;
    S.cp.forEach((n, i) => { const b = S.cnt.at ? S.cnt.at[i] : M.box(g, n.id), k = M.clamp((g.t - S.cnt.t0 - i * S.cnt.dt) / 0.15, 0, 1); if (!b || k <= 0 || (S.cnt.fly && i === S.cp.length - 1)) return;
    const lb = M.num(i + 1), sz = 26 * (1 + Math.sin(k * Math.PI) * 0.4), m = M.lay(lb, sz); c.save(); c.globalAlpha *= k * out;
    M.draw(c, lb, b.x - m.w / 2, b.y + b.h / 2 + 30, sz, { t: g.t, col: ANS }); c.restore(); });
}

MG.add({
  id: 'log', stage: 'logs', cmd: 'LOGARITHM!', hint: 'drag', time: 9, mood: 'bright', winText: 'Logged!', hold: 1.4,
  card: {
    title: 'Logarithms', ref: 'Algebra 2', kind: 'Logarithms',
    text: 'A logarithm answers the question "what power do I need?". log₂ 8 asks: 2 raised to what power makes 8? The small 2 is called the base.\n\nTo find the answer, rewrite the question as a power. log₂ 8 = x means the same thing as 2ˣ = 8. Then write 8 as 2s multiplied together: 8 = 2 · 2 · 2 = 2³. There are three 2s, so x = 3 and log₂ 8 = 3.\n\nA logarithm undoes a power, the way subtraction undoes addition. Because 10³ = 1000, log₁₀ 1000 = 3.',
    note: 'logₐ N = k means aᵏ = N. To find k, write N as copies of a multiplied together and count the copies.',
    ask: 'What is log₃ 9? What is log₂ 32?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.sp = 0; S.rew = false;
    S.lg = M.txt('log', 'lg'); S.bn = M.num(S.a, 'bs', { col: BASE }); S.Nd = M.num(S.N, 'N'); S.eq = M.op('=', 'eq'); S.q = M.slot('q');
    S.kn = M.num(S.k, 'k', { col: ANS }); S.ansN = M.num(S.k, 'ans', { col: ANS, _born: -1 });
    S.cp = [...Array(S.k)].map((_, i) => M.num(S.a, 'c' + i, { col: BASE })); S.dots = S.cp.slice(1).map(() => M.op('·'));
    build(g); M.inert(g, ['eq', 'lg', 'par', 'run', 'B', 'ans', ...S.cp.map(n => n.id)]);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    M.play(g, {
      moves(g) {
        const out = [], T = M.pace(g);
        // drag the base onto the number: logₐ N = ? becomes a^? = N (log₂ melts into the base; the 8 and the ? trade places)
        if (!S.rew && !S.won) out.push({ drag: 'bs', to: [S.sp === 0 ? 'N' : S.sp === 1 ? 'fac' : 'pw', 'q'], busy: 0.1, then(g) {
          M.show(g, 1.05 * T); hop(g, 'think'); M.circle(g, ['lg', 'bs'], { col: BASE, dur: 0.35 * T }); M.tween(g, S.lg, { alpha: 0, sc: 0.6 }, 0.25 * T, { delay: 0.12 * T });
          M.at(g, [[0.38 * T, g => { S.rew = true; build(g); M.tween(g, S.bn, { dy: 0 }, 0.3 * T); g.sfx('swoosh'); hop(g); }], // the small base glides out and becomes the big base
            [0.72 * T, g => { M.indicate(g, S.bn, { col: BASE, dur: 0.35 * T }); M.indicate(g, S.q, { dur: 0.35 * T, delay: 0.08 * T }); M.sparkle(g, 'B', { n: 8 }); g.sfx('pop'); }]]); } });
        // tap the number to write it as copies of the base: the copies appear one by one and a running product checks them
        if (S.sp === 0) out.push({ tap: 'N', busy: 0.1, then(g) {
          const dt = Math.min(0.24, 0.8 / S.k) * T, len = 0.3 * T + S.k * dt + 0.55 * T; M.show(g, len); hop(g, 'think'); M.circle(g, 'N', { dur: 0.35 * T });
          M.at(g, [[0.3 * T, g => {
            S.cp.forEach((n, i) => { n._born = g.t + i * dt; if (i) S.dots[i - 1]._born = g.t + i * dt - 0.05 * T; });
            S.sp = 1; build(g); g.sfx('swoosh');
            const fb = M.box(g, 'fac'); S.rv = M.num(S.a, null, { col: RUN }); S.run = M.row(M.op('='), S.rv); S.run.id = 'run';
            M.place(g, 'run', S.run, fb.x, fb.y + fb.h / 2 + 44, 34, { col: RUN }); M.writeIn(g, S.run, { dur: 0.2 * T });
            for (let i = 1; i < S.k; i++) M.at(g, [[i * dt, g => { M.roll(g, S.rv, Math.pow(S.a, i + 1), { dur: dt * 0.8 }); g.sfx('tap'); hop(g); }]]);
            M.at(g, [[(S.k - 1) * dt + 0.2 * T, g => { M.indicate(g, S.run, { col: RUN, sc: 1.3, dur: 0.35 * T }); M.sparkle(g, 'run', { cols: ['#9ae07a', '#fff'], n: 8 }); g.sfx('ding'); }],
              [S.k * dt + 0.3 * T, g => { M.tween(g, S.run, { alpha: 0 }, 0.2 * T); }],
              [S.k * dt + 0.52 * T, g => { delete g.s.mk.ex.run; }]]); }]]); } });
        // tap the copies to count them: a · a · a = a³ (the last count flies up to become the exponent)
        if (S.sp === 1) { const dt = Math.min(0.2, 0.75 / S.k) * T;
          out.push({ tap: 'fac', busy: 0.1, askAt: 0.15 * T + S.k * dt + 0.15 * T, after: 0.85 * T, ask: { v: S.k, wrong: [S.k + 1, S.k - 1, S.N / S.a, S.a] },
            then(g) { M.show(g, 0.3 * T + S.k * dt); hop(g, 'think'); S.cnt = { t0: g.t + 0.15 * T, dt };
              S.cp.forEach((n, i) => { M.indicate(g, n, { delay: 0.15 * T + i * dt, dur: 0.28 * T, sc: 1.35 }); M.at(g, [[0.15 * T + i * dt, g => g.sfx('tap')]]); }); },
            resolve(g) { M.show(g, 0.85 * T); const lb = M.box(g, S.cp[S.k - 1].id), from = lb ? [lb.x, lb.y + lb.h / 2 + 30] : [180, 360];
              S.cnt.at = S.cp.map(n => ({ ...M.box(g, n.id) })); S.cnt.fly = true; S.cnt.out = g.t; S.kn.alpha = 0; S.sp = 2; build(g); g.sfx('swoosh');
              M.fly(g, { node: M.num(S.k, null, { col: ANS }), from, to: 'k', dur: 0.45 * T, arc: -40, s0: 26,
                then(g) { S.kn.alpha = 1; S.kn.pop = g.t; S.cnt = null; M.sparkle(g, 'pw', { n: 10 }); g.sfx('coin'); hop(g, 'laugh'); } }); } }); }
        // the powers match, so the exponent is the answer: drag it into the ?
        if (S.sp === 2 && !S.won) out.push({ drag: 'k', to: S.rew ? ['q2', 'B'] : ['q'], busy: 0.1, then(g) {
          M.show(g, 1.5 * T); hop(g, 'think'); const from = { ...M.box(g, 'k') };
          M.fly(g, { node: M.num(S.k, null, { col: ANS }), from: [from.x, from.y], to: S.q.id, dur: 0.4 * T, arc: -50, s0: from.s,
            then(g) { S.q.fill = S.ansN; build(g); S.ansN.pop = g.t; g.sfx('pop'); M.indicate(g, S.ansN, { col: ANS, dur: 0.35 * T }); M.indicate(g, S.kn, { col: ANS, dur: 0.35 * T, delay: 0.06 * T }); hop(g, 'wow'); } });
          M.at(g, [[0.8 * T, g => { // a power is a number again: the exponent slides into the base and 2² rolls over to 4
              const kb = M.box(g, 'k'), cb = M.box(g, S.cp[0].id); M.tween(g, S.kn, { dx: kb && cb ? cb.x - kb.x : 0, dy: 10, alpha: 0, sc: 0.5 }, 0.25 * T);
              M.roll(g, S.cp[0], S.N, { delay: 0.1 * T, dur: 0.3 * T }); M.tween(g, S.cp[0], { hl: 0 }, 0.1); S.cp[0].col = INK; g.sfx('tap'); }],
            [1.15 * T, g => { S.won = true; S.q.fill = null; S.lg = M.txt('log', 'lg'); build(g); M.tween(g, S.bn, { dy: S.sz * SUB }, 0.3 * T); g.sfx('swoosh'); }], // back to the log: logₐ N = k
            [1.42 * T, g => { S.ansN.pop = g.t; M.sparkle(g, 'ans', { n: 12, cols: ['#ffd45a', '#7ad0ff', '#fff'] }); g.sfx('coin'); hop(g, 'laugh'); }]]); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'forest', panel: 'paper' }); host(g, c);
    M.drawEx(g, c, 'ex'); fixSub(g); M.drawEx(g, c, 'run'); drawCount(g, c); M.drawUI(g, c);
  },
});
