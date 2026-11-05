// powers_powpow.js — POWER OF POWER! A power raised to a power: (xᵃ)ᵇ = xᵃ·ᵇ.
// The player drags the outer exponent onto the inner one. The working plays by itself (show your work): the brackets
// open into b copies of xᵃ side by side, each copy is counted (1, 2, 3 under them) and its exponent lights up, then the
// copies fold back into one power whose exponent reads a · b ("b groups of a"). Tapping a · b multiplies it: the
// note "2 · 3 = 6" writes itself under it and the 2 rolls over to 6 while the · 3 slides into it.
// Level 0: (x²)³. Level 1: bigger exponents and other letters. Level 2: (2x³)²: the outer exponent goes to every factor,
// so it is dragged onto the 2 (a copy of the exponent flies onto it: 2², tap to compute 2 · 2 = 4) and onto the x³
// (it opens into copies as above), in either order. Medium mode: the products are picked from the tray.
const M = MK, INK = SCN.ink('glass'), OUT = '#d0407a', NOTE = '#5a3a8a', HX = 76, HY = 590;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { v: 'x', a: 2 + r(3), b: 2 + r(2) };
  if (L === 1) return { v: ['x', 'y', 'a'][r(3)], a: 2 + r(4), b: 2 + r(3) };
  const c = 2 + r(2); return { v: 'x', a: 2 + r(3), b: c === 3 ? 2 : 2 + r(2), c };
}
// each factor is 'in' (still inside the brackets), 'open' (x only: written out as copies while the work is shown),
// 'mul' (the outer exponent has reached it, waiting to be computed) or 'done'. Leaf symbols are made once and reused,
// so they glide when the expression is rewritten; the wrappers around them are made fresh on every layout.
function build(g) {
  const S = g.s, out = [], inn = [];
  if (S.c) { const cn = S.cn; cn.id = S.cs === 'in' ? 'c' : S.cs === 'done' ? 'cv' : undefined;
    if (S.cs === 'in') inn.push(cn); else out.push(S.cs === 'mul' ? M.sup(cn, S.ce, 'cp') : cn); }
  S.xv.id = S.xs === 'in' ? 'x' : S.xs === 'done' ? 'x3' : 'x2'; S.an.id = S.xs === 'in' ? 'a' : S.xs === 'done' ? 'xe' : undefined;
  if (S.xs === 'in') inn.push(M.sup(S.xv, S.an));
  else if (S.xs === 'open') out.push(M.row(...S.copies.flatMap((q, i) => [i ? q.dot : null, M.sup(q.x, q.e, 'cy' + i)])));
  else if (S.xs === 'mul') out.push(M.sup(S.xv, Object.assign(M.row(S.an, S.mdot, S.bn), { id: 'xp' })));
  else out.push(M.sup(S.xv, S.an));
  const group = inn.length ? M.sup(M.paren(M.row(...inn), 'par'), S.o) : null;
  // keep the factors in their order: the number first, then the power of x
  const items = S.c && S.cs === 'in' ? [group, ...out] : [...out, group];
  const mk = () => M.row(...items.flatMap((n, i) => n ? [i && items[i - 1] ? M.gap(10) : null, n] : []));
  let sz = S.c ? 60 : 68; while (sz > 36 && M.lay(mk(), sz).w > 310) sz -= 4;
  M.place(g, 'ex', mk(), 180, 316, sz, { col: INK });
}
// the penguin hops on each beat and points at the board while the work is shown
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c) {
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && g.t - mk.missAt < 0.7;
  const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', HX, HY - hk * 24, 1.4, { t: g.t, pose, expr }); else SCN.host(g, c, 'penguin', HX, HY, 1.4);
}

MG.add({
  id: 'powpow', stage: 'powers', cmd: 'POWER OF POWER!', hint: 'drag', time: 8, mood: 'bright', winText: 'Powered!', hold: 1.4,
  card: {
    title: 'Power of a power', ref: 'Grade 8', kind: 'Exponents',
    text: 'An exponent says how many copies of the base are multiplied together. So x² means x · x.\n\nWhen a power is raised to another power, multiply the two exponents. For example, (x²)³ = x²·³ = x⁶.\n\nThis works because (x²)³ means three copies of x² multiplied together: x² · x² · x². Each copy holds two x\'s, so there are 3 groups of 2, which is 6 copies of x in all.\n\nWhen the brackets hold a product, the outer exponent goes to every factor inside. For example, (2x³)² = 2² · x³·² = 4x⁶.',
    note: 'To raise a power to a power, keep the base and multiply the exponents: (xᵃ)ᵇ = xᵃ·ᵇ. An exponent outside brackets applies to every factor inside.',
    ask: 'What is (x⁴)²? What is (3x²)³?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.xs = 'in'; S.cs = S.c ? 'in' : null; if (S.c) S.cv = Math.pow(S.c, S.b);
    S.xv = M.vr(S.v); S.an = M.num(S.a); S.o = M.num(S.b, 'o', { col: OUT }); if (S.c) { S.cn = M.num(S.c); S.ce = M.num(S.b, 'cpe', { col: OUT }); }
    build(g); M.inert(g, ['par', 'cpe', 'md', 'bb', 'cy0', 'cy1', 'cy2', 'cy3', 'cy4']);
    const nMoves = S.c ? 4 : 2; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const last = () => !(S.c ? (S.cs === 'in') + (S.xs === 'in') > 1 : false); // is this the last factor to leave the brackets?
    // a working note under the part being worked on: "2 · 3 = ?"; the answer writes itself in on resolve
    const noteAt = (g, id, parts, ans, T) => { const b = M.box(g, id); S.q = M.num(ans, 'nq', { alpha: 0, col: OUT });
      S.note = M.row(...parts.flatMap((v, i) => [i ? M.op('·') : null, M.num(v)]), M.op('='), S.q);
      M.place(g, 'note', S.note, M.clamp(b ? b.x : 180, 110, 250), 374, 30, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.4 * T, delay: 0.1 * T }); };
    const answer = (g, T) => { S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.15 * T, dur: 0.3 * T, col: OUT }); g.sfx('ding'); };
    const dropNote = (g, T) => { M.tween(g, S.note, { alpha: 0 }, 0.25 * T); M.at(g, [[0.3 * T, g => { delete g.s.mk.ex.note; }]]); };
    // the result rolls over in place while the rest of the product slides into it and fades
    const collapse = (g, keep, gone, v, T) => { const k = M.box(g, keep.id || 'xe') || null;
      for (const n of gone) { const b = M.box(g, n.id), kb = M.box(g, keep.id); M.tween(g, n, { dx: b && kb ? kb.x - b.x : 0, alpha: 0, sc: 0.5 }, 0.28 * T); }
      M.roll(g, keep, v, { delay: 0.1 * T, dur: 0.3 * T }); };
    M.play(g, {
      moves(g) {
        const out = [], ab = S.a * S.b, T = M.pace(g);
        // drag the outer exponent onto the inner exponent (or onto x): the brackets open into b copies, which fold into x^(a · b)
        if (S.xs === 'in') out.push({ drag: 'o', to: ['a', 'x'], busy: 0.1, then(g) {
          const L = last(); M.show(g, 1.75 * T); hop(g, 'think'); M.circle(g, 'o', { col: OUT, dur: 0.4 * T }); M.indicate(g, 'o', { col: OUT, dur: 0.35 * T });
          if (L) M.tween(g, S.o, { alpha: 0 }, 0.2 * T, { delay: 0.12 * T });
          S.copies = [...Array(S.b)].map((_, i) => i ? { x: M.vr(S.v), e: M.num(S.a), dot: M.op('·') } : { x: S.xv, e: S.an });
          M.at(g, [
            [0.32 * T, g => { // x^a, b times, side by side; each copy gets counted
              S.copies.forEach((q, i) => { if (i) { const t = g.t + i * 0.13 * T; q.x._born = q.e._born = q.dot._born = t; } });
              S.xs = 'open'; build(g); g.sfx('swoosh'); hop(g);
              S.copies.forEach((q, i) => { M.anim(g, { delay: (0.1 + i * 0.13) * T, dur: (1.0 - i * 0.13) * T, draw(c, g, k, t) { const b = M.box(g, 'cy' + i); if (!b) return;
                const a = M.clamp(t / (0.15 * T), 0, 1) * (k > 0.8 ? (1 - k) / 0.2 : 1), n = M.num(i + 1), m = M.lay(n, 24); c.globalAlpha = a; M.draw(c, n, b.x - m.w / 2, b.y + b.h / 2 + 26, 24, { t: g.t, col: OUT }); } });
                M.indicate(g, q.e, { delay: (0.55 + i * 0.1) * T, dur: 0.3 * T, sc: 1.35, col: OUT }); if (i) M.at(g, [[(0.1 + i * 0.13) * T, g => g.sfx('tap')]]); }); }],
            [1.35 * T, g => { // the copies fold back into one power: b groups of a, x^(a · b)
              S.mdot = M.op('·', 'md'); S.bn = M.num(S.b, 'bb', { col: OUT }); S.xs = 'mul'; build(g); g.sfx('swoosh'); hop(g, 'happy'); M.sparkle(g, 'xp', { delay: 0.25 * T, n: 8 }); }],
          ]); } });
        // ... and onto the number in front, which gets the same exponent: a copy of it flies over
        if (S.cs === 'in') out.push({ drag: 'o', to: 'c', busy: 0.1, then(g) {
          const L = last(), from = { ...M.box(g, 'o') }; M.show(g, 0.8 * T); hop(g, 'think'); M.circle(g, 'o', { col: OUT, dur: 0.35 * T });
          if (L) S.o.alpha = 0; S.ce.alpha = 0; S.cs = 'mul'; build(g); g.sfx('swoosh');
          M.fly(g, { node: M.num(S.b, null, { col: OUT }), from: [from.x, from.y], to: 'cpe', delay: 0.1 * T, dur: 0.45 * T, arc: -50, s0: from.s, s1: (M.box(g, 'cpe') || {}).s,
            then(g) { S.ce.alpha = 1; S.ce.pop = g.t; M.sparkle(g, 'cp', { n: 8 }); g.sfx('pop'); hop(g); } }); } });
        if (S.xs === 'mul') out.push({ tap: 'xp', busy: 0.1, askAt: 0.55 * T, after: 1.05 * T, ask: { v: ab, wrong: [S.a + S.b, Math.pow(S.a, S.b), ab + 1, ab - 1] },
          then(g) { M.show(g, 0.55 * T); hop(g, 'think'); M.circle(g, 'xp', { col: OUT, dur: 0.45 * T }); noteAt(g, 'xp', [S.a, S.b], ab, T); },
          resolve(g) { M.show(g, 1.05 * T); answer(g, T);
            M.at(g, [[0.35 * T, g => collapse(g, S.an, [S.mdot, S.bn], ab, T)],
              [0.75 * T, g => { S.xs = 'done'; build(g); S.an.pop = g.t; M.sparkle(g, 'xe', { n: 12 }); g.sfx('coin'); hop(g, 'laugh'); dropNote(g, T); }]]); } });
        if (S.cs === 'mul') out.push({ tap: 'cp', busy: 0.1, askAt: 0.55 * T, after: 1.05 * T, ask: { v: S.cv, wrong: [S.c * S.b, S.c + S.b, S.c, S.cv + 1] },
          then(g) { M.show(g, 0.55 * T); hop(g, 'think'); M.circle(g, 'cp', { col: OUT, dur: 0.45 * T }); noteAt(g, 'cp', Array(S.b).fill(S.c), S.cv, T); },
          resolve(g) { M.show(g, 1.05 * T); answer(g, T); S.cn.id = 'cb';
            M.at(g, [[0.35 * T, g => collapse(g, S.cn, [S.ce], S.cv, T)],
              [0.75 * T, g => { S.cs = 'done'; build(g); S.cn.pop = g.t; M.sparkle(g, 'cv', { n: 12 }); g.sfx('coin'); hop(g, 'laugh'); dropNote(g, T); }]]); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'snow', panel: 'glass' }); host(g, c);
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'note'); M.drawUI(g, c);
  },
});
