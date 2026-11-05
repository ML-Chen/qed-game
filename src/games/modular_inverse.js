// modular_inverse.js — MOD INVERSE! Find the ? in a · ? ≡ 1 (mod n): which number times a leaves remainder 1?
// One line, in large type, is the whole problem: "3 · ? ≡ 1 (mod 7)". At the start a short line under it says what it
// asks ("3 times what leaves remainder 1 after ÷ 7?"), and fades on the first try. A few paper lanterns hang below,
// each with a candidate number. Tapping one tries it, and the same line is worked out in place (one idea at a time):
//   1. the lantern's number flies into the ?: "3 · 4 ≡ 1";
//   2. 3 and 4 are circled and merge into their product: "12 ≡ 1";
//   3. a 7 flies down from "(mod 7)" in front of the 12, which rolls down by 7: "7 + 5 ≡ 1" (again while it is ≥ 7);
//   4. the note "7 ≡ 0" (a whole 7 leaves no remainder) writes itself under the 7, the 7 is crossed out and goes:
//      "5 ≡ 1";
//   5. the verdict: 5 is not 1, so the ≡ is struck through in red (≢), then the line rolls back to "3 · ? ≡ 1" and
//      the lantern goes dark; or 1 is 1: the line turns green, and it settles as "3 · 5 ≡ 1" with 5 in gold.
// A product smaller than n skips steps 3 and 4. Every try is a valid move; the fuse stands still while it plays.
// Level 0: 2 or 3 mod 5, three lanterns (at most two 5s to take out); the guidance shows one wrong try first, then the right one. Level 1: mod 7, three
// lanterns. Level 2: mod 11 or 13, four lanterns. Every product has at most three whole n's in it.
// Medium mode: when "3 · 4" is circled, the player picks the product from the tray.
// Wrong parts: the numbers of the problem (a tap wobbles them).
const M = MK, INK = '#fff4e6', GOLD = '#ffc85a', RED = '#ff6a6a', GREEN = '#b4ff9a', LY = 236, MY = 292, HY = 470;
// [n, a] with the inverse of a; candidates k (2 .. n − 1) are kept to k·a < 4n so the line never needs more than three n's
const POOL = [[[5, 2], [5, 3]], [[7, 2], [7, 3], [7, 4], [7, 5]], [[11, 2], [11, 3], [11, 4], [11, 6], [13, 2], [13, 3], [13, 4], [13, 5], [13, 7], [13, 9]]];
const inv = (a, n) => { for (let k = 1; k < n; k++) if (k * a % n === 1) return k; return 0; };
function lantern(c, x, y, lit, glow, t, k, dim) {
  c.save(); c.translate(x, y + Math.sin(t * 1.6 + k) * 1.5); if (dim) c.globalAlpha *= 0.45;
  if (lit) { const gr = c.createRadialGradient(0, 0, 4, 0, 0, 50); gr.addColorStop(0, `rgba(255,200,90,${0.55 * glow})`); gr.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = gr; c.fillRect(-50, -50, 100, 100); }
  const bg = c.createRadialGradient(-6, -8, 2, 0, 0, 28); bg.addColorStop(0, lit ? '#fff0b8' : '#c08aa0'); bg.addColorStop(1, lit ? '#f08a3a' : '#6a4272');
  c.fillStyle = bg; c.beginPath(); c.ellipse(0, 0, 25, 28, 0, 0, 7); c.fill();
  c.strokeStyle = lit ? 'rgba(160,70,20,0.5)' : 'rgba(30,15,40,0.45)'; c.lineWidth = 1.4; for (const ex of [-14, 0, 14]) { c.beginPath(); c.ellipse(0, 0, Math.abs(ex) * 1.5 + 2, 28, 0, 0, 7); c.stroke(); }
  c.fillStyle = '#3a2030'; c.fillRect(-9, -33, 18, 7); c.fillRect(-9, 26, 18, 7);
  c.restore();
}

MG.add({
  id: 'modular_inverse', stage: 'modular', cmd: 'MOD INVERSE!', hint: 'tap', time: 9, mood: 'night', winText: 'Inverted!', hold: 1.6,
  card: {
    title: 'Inverses mod n', ref: 'College', kind: 'Number theory',
    text: 'Two numbers are congruent mod n, written ≡, when they leave the same remainder after dividing by n. For example, 15 ≡ 1 (mod 7), because 15 = 14 + 1 and 14 is two whole 7s.\n\nThe inverse of a mod n is the number k with a · k ≡ 1 (mod n): a times k leaves remainder 1. It plays the part of 1/a when you only care about remainders.\n\nTo find it, try numbers. Is it 4? 3 · 4 = 12 = 7 + 5, which leaves 5, not 1. Is it 5? 3 · 5 = 15 = 7 + 7 + 1, which leaves 1. So the inverse of 3 mod 7 is 5.\n\nAn inverse exists only when a and n share no factor bigger than 1. Mod 6, the multiples of 2 are 2, 4, 0, 2, 4, 0 and never leave remainder 1.',
    note: 'The inverse of a mod n is the k with a · k ≡ 1 (mod n). Try a number: multiply, take away whole n\'s, and see whether 1 is left.',
    ask: 'What is the inverse of 2 mod 7? What is the inverse of 4 mod 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); const pool = POOL[g.level], [n, a] = pool[Math.floor(g.rand() * pool.length)], k0 = inv(a, n), T = S.T = M.pace(g);
    // the candidates: the inverse and some wrong numbers whose products stay under 4n, in order
    const others = []; for (let k = 2; k < n; k++) if (k !== k0 && k * a < 4 * n) others.push(k);
    for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
    const ks = [k0, ...others.slice(0, g.level === 2 ? 3 : 2)].sort((p, q) => p - q);
    S.cands = ks.map((k, i) => ({ k, i, x: 180 + (i - (ks.length - 1) / 2) * (ks.length > 3 ? 74 : 86), y: HY, used: false }));
    Object.assign(S, { n, a, k0, tries: 0 });
    // the line: [a · ?] ≡ 1 (mod n); the left side is rebuilt from the same nodes, so symbols glide
    S.three = M.num(a, 'a'); S.dot = M.op('·', 'dot'); S.slot = M.slot('ans', { col: GOLD }); S.eq = M.op('≡', 'eq'); S.one = M.num(1, 'one'); S.nn = M.num(n, 'nn');
    S.lhs = [S.three, S.dot, S.slot];
    S.tail = [S.eq, S.one, M.gap(12), M.txt('(mod', 'md0'), M.gap(7), S.nn, M.txt(')', 'md1')]; // the same nodes every time, so nothing in it flickers
    S.relay = () => { S.line = M.row(...S.lhs, ...S.tail); M.place(g, 'line', S.line, 180, LY, S.size, { col: INK }); };
    // one size for the whole game: wide enough for the longest form these candidates need, "n + n + r ≡ 1 (mod n)"
    const qmax = Math.max(...ks.map(k => Math.floor(k * a / n)));
    S.size = 48; const longest = () => M.row(...[...Array(qmax)].flatMap(() => [M.num(n), M.op('+')]), M.num(Math.max(n - 1, a * Math.max(...ks))), M.op('≡'), M.num(1), M.gap(12), M.txt('(mod'), M.gap(7), M.num(n), M.txt(')'));
    while (M.lay(longest(), S.size).w > 330 && S.size > 26) S.size -= 2;
    S.relay(); M.inert(g, ['dot', 'eq', 'md0', 'md1', 'ans']);
    // what the line asks, said once, until the first try
    S.mean = `${a} times what leaves remainder 1 after ÷ ${n}?`; S.meanA = 1; // drawn on a dark pill under the line
    for (const q of S.cands) M.zone(g, 'c' + q.i, { x: q.x, y: q.y, w: 56, h: 64 });
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const hop = e => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const QS = 0.6 * T;   // one whole n taken out
    // a working note on a dark pill under a part of the line: it writes itself, holds, then fades
    const pillNote = (g, node, at, dy, wr, hold, fade) => { const nd = node, sz = 26; hold = Math.max(hold, 0.6 * T); M.show(g, wr + hold + fade);
      M.anim(g, { dur: wr + hold + fade, draw(c, g, k, tt) { const b = M.box(g, at); if (!b) return; const m = M.lay(nd, sz), x = M.clamp(b.x, m.w / 2 + 26, 334 - m.w / 2), y = b.y + dy, al = tt < wr + hold ? 1 : 1 - (tt - wr - hold) / fade, wk = M.clamp(tt / wr, 0, 1);
        c.globalAlpha = M.clamp(al, 0, 1); c.fillStyle = 'rgba(30,14,44,0.72)'; c.beginPath(); c.roundRect(x - m.w / 2 - 14, y - sz * 0.75, m.w + 28, sz * 1.5, 14); c.fill();
        if (wk < 1) { c.beginPath(); c.rect(x - m.w / 2 - 4, y - sz, (m.w + 8) * M.easeIO(wk), sz * 2); c.clip(); }
        M.draw(c, nd, x - m.w / 2, y + (m.a - m.d) / 2, sz, { t: g.t, col: '#ffd8a8' }); } }); };
    const tryK = q => {
      const k = q.k, P = k * a, nq = Math.floor(P / n), r = P % n, right = k === k0;
      const tq = 0.45 * T + nq * QS, tc = nq ? tq + 1.35 * T : tq, end = tc + (right ? 1.4 : 1.75) * T;
      return { tap: 'c' + q.i, busy: 0.1, askAt: 1.0 * T, after: end, ask: { v: P, wrong: [P + a, P - a, k + a] },
        // the candidate flies into the ?, then 3 and 4 are circled, ready to multiply
        then(g) { q.used = true; q.tryAt = g.t; S.tries++; S.point = true; hop('think'); M.show(g, 1.0 * T); g.sfx('swoosh');
          if (S.meanOut == null) S.meanOut = g.t;
          M.fly(g, { node: M.num(k, null, { col: GOLD }), from: [q.x, q.y], to: 'ans', dur: 0.45 * T, arc: -40, s0: 26, s1: S.size,
            then(g) { S.kk = M.num(k, 'kk', { col: GOLD, _born: -1, pop: g.t }); S.slot.fill = S.kk; S.relay(); M.inert(g, ['kk']); M.sparkle(g, 'kk', { n: 6, cols: [GOLD, '#fff'] }); g.sfx('pop'); } });
          M.at(g, [[0.6 * T, g => { M.circle(g, ['a', 'kk'], { col: GOLD, dur: 0.45 * T }); }]]); },
        resolve(g) { M.show(g, end); const pr = S.pr = M.num(P, 'pr'); M.inert(g, ['pr']);
          // 3 · 4 merges into 12 (the kit flies the factors into it)
          S.lhs = [pr]; S.slot.fill = null; S.relay(); g.sfx('pop'); hop();
          // each whole n comes down from "(mod n)" in front, and the number rolls down by n
          S.sevens = [];
          for (let i = 1; i <= nq; i++) M.at(g, [[0.45 * T + (i - 1) * QS, g => {
            const sv = M.num(n, 's' + i, { alpha: 0, _born: -1, col: '#ffd8a8' }), pl = M.op('+', null, { alpha: 0, _born: -1 }); S.sevens.push(sv, pl);
            S.lhs = [...S.sevens, pr]; S.relay(); M.inert(g, ['s' + i]); M.indicate(g, S.nn, { col: '#ffd8a8', sc: 1.25, dur: 0.3 * T }); g.sfx('swoosh');
            M.fly(g, { node: M.num(n, null, { col: '#ffd8a8' }), from: 'nn', to: 's' + i, dur: 0.35 * T, arc: -50, s0: S.size, s1: S.size,
              then(g) { sv.alpha = 1; pl.alpha = 1; M.roll(g, pr, P - i * n, { dur: 0.3 * T }); g.sfx('tap', { p: 1 + i * 0.1 }); hop(); } }); }]]);
          // a whole n leaves no remainder: "7 ≡ 0" under it, then the n's are crossed out and leave
          if (nq) M.at(g, [[tq, g => { pillNote(g, M.row(M.num(n), M.op('≡'), M.num(0)), 's1', S.size * 1.05, 0.3 * T, 0.6 * T, 0.25 * T);
              S.sevens.forEach((nd, j) => M.strike(g, nd, { delay: (0.45 + j * 0.05) * T, dur: 0.18 * T, col: RED })); }],
            [tq + 0.85 * T, g => { for (const nd of S.sevens) M.tween(g, nd, { alpha: 0, dy: -18 }, 0.25 * T); }],
            [tq + 1.15 * T, g => { S.sevens = []; S.lhs = [pr]; S.relay(); }]]);
          // the verdict: is what is left 1?
          M.at(g, [[tc, g => { M.circle(g, ['pr', 'one'], { col: right ? GREEN : '#ffd8a8', dur: 0.4 * T }); }],
            [tc + 0.35 * T, g => {
              if (right) { pr.col = GREEN; S.one.col = GREEN; S.eq.col = GREEN; for (const nd of [pr, S.eq, S.one]) M.indicate(g, nd, { col: GREEN, sc: 1.25, dur: 0.35 * T }); g.sfx('ding'); hop('laugh'); const b = M.box(g, 'eq'); if (b) g.burst(b.x, b.y, [GREEN, '#fff', GOLD], 14, 130); }
              else { pr.col = RED; M.strike(g, S.eq, { dur: 0.2 * T, col: RED }); M.indicate(g, pr, { col: RED, sc: 1.2, dur: 0.35 * T }); g.sfx('boing'); S.face = 'sad'; S.faceT = g.t; } }],
            // a wrong try rolls back to the question; the right one settles as a · k ≡ 1 with k in gold
            [tc + (right ? 0.95 : 1.15) * T, g => { M.tween(g, pr, { alpha: 0 }, 0.2 * T); }],
            [tc + (right ? 1.15 : 1.35) * T, g => { S.eq.strike = null;
              for (const nd of [S.three, S.dot, S.slot]) nd._born = g.t; // they come back by fading in where they were
              S.lhs = [S.three, S.dot, S.slot]; if (right) { S.kk = M.num(k, 'kk', { col: GOLD, pop: g.t }); S.slot.fill = S.kk; S.solved = true; } else { q.dark = true; S.slot.fill = null; }
              S.relay(); if (right) M.sparkle(g, 'kk', { n: 12, cols: [GOLD, '#fff', GREEN] }); }],
            [end, g => { S.point = false; }]]); } };
    };
    M.play(g, {
      moves(g) {
        if (S.solved || S.cands.some(q => q.used && q.k === k0)) return [];
        const left = S.cands.filter(q => !q.used), right = left.find(q => q.k === k0), wrong = left.filter(q => q.k !== k0);
        // level 0 shows one wrong try first, so the player sees what "not 1" looks like
        const order = g.level === 0 && S.tries === 0 && wrong.length ? [wrong[0], right, ...wrong.slice(1)] : [right, ...wrong];
        return order.filter(Boolean).map(tryK); // while the right try plays out, nothing is left to try
      },
      area(g) { const m = M.current(g)[0]; return m ? [m.tap] : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, K = S.mk, t = g.t; SCN.bg(g, c, 'dusk');
    // the lanterns hang from a string; a tapped one swings and lights, a wrong one goes dark
    c.save(); c.strokeStyle = 'rgba(40,20,40,0.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(20, HY - 66); c.quadraticCurveTo(180, HY - 40, 340, HY - 66); c.stroke(); c.restore();
    for (const q of S.cands) {
      const sw = q.tryAt != null && t - q.tryAt < 0.8 ? Math.sin((t - q.tryAt) * 14) * 0.18 * (1 - (t - q.tryAt) / 0.8) : 0, lit = q.used && !q.dark;
      c.save(); c.translate(q.x, q.y - 52); c.rotate(sw); c.strokeStyle = 'rgba(40,20,40,0.6)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -8); c.lineTo(0, 18); c.stroke(); c.translate(0, 52);
      lantern(c, 0, 0, lit || (S.solved && q.k === S.k0), 0.7 + 0.3 * Math.sin(t * 3 + q.i), t, q.i, q.dark);
      c.font = M.NUMF(26); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = lit ? '#5a2010' : q.dark ? 'rgba(248,232,240,0.5)' : '#fbeef6'; c.fillText(String(q.k), 0, 2); c.restore();
    }
    M.drawEx(g, c, 'line');
    // what the line asks, on a dark pill, until the first try (wrapped onto two lines when it is too wide)
    const ma = S.meanOut == null ? 1 : 1 - M.clamp((t - S.meanOut) / (0.3 * (S.T || 1)), 0, 1);
    if (ma > 0) { c.save(); c.globalAlpha = ma; c.font = M.NUMF(22, 600); c.textAlign = 'center'; c.textBaseline = 'middle';
      let lines = [S.mean]; if (c.measureText(S.mean).width > 300) lines = [`${S.a} times what leaves`, `remainder 1 after ÷ ${S.n}?`];
      const bw = Math.max(...lines.map(l => c.measureText(l).width)) + 28, bh = lines.length * 28 + 12, top = MY - 18;
      c.fillStyle = 'rgba(30,14,44,0.72)'; c.beginPath(); c.roundRect(180 - bw / 2, top, bw, bh, 16); c.fill();
      c.fillStyle = '#ffe6c8'; lines.forEach((l, i) => c.fillText(l, 180, top + 20 + i * 28)); c.restore(); }
    // the fox points at the line while a try is worked out
    { const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
      const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
      if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 300, 618 - hopK * 14, 1.1, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', 300, 618, 1.1); }
    M.drawUI(g, c);
  },
});
