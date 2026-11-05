// fractions_common.js — COMMON DENOM! Add two fractions by first giving them a common denominator.
// 1/3 + 1/4, and every step is acted out (show your work):
//   1. Drag one denominator onto the other: both glow, and "3 × 4 = ?" writes itself above; the ? rolls over to 12.
//   2. Tap each fraction (either order): a "× 4" writes itself beside its top and beside its bottom, the notes fly into
//      the numbers, and both numbers roll over to their new values (1/3 → 4/12). The pie under it is re-cut into
//      smaller pieces while the coloured amount stays the same.
//   3. Tap the +: the numerators glide up over one shared denominator (4 + 3 over 12), the two pies slide together into
//      one, then the + 3 slides into the 4 and it rolls over to 7: 7/12.
// The rabbit points while the work is shown and hops when a step lands.
// Level 0: one denominator divides the other (1/2 + 1/4). Level 1: coprime denominators, numerators 1.
// Level 2: coprime denominators with bigger numerators. Medium mode: the common denominator, each rewritten fraction
// and the sum are picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), TAGC = '#d0603a', Y_EX = 292, Y_TAG = 214, Y_PIE = 378, SZ = 54, HX = 292, HY = 592;
const PIEC = ['#e8784a', '#8ab84a'];
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const pairs = L === 0 ? [[2, 4], [2, 6], [3, 6], [4, 8], [2, 8], [3, 9]] : [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [3, 2], [4, 3], [5, 2]];
  for (;;) {
    let [b, d] = pairs[r(pairs.length)]; if (L === 0 && g.rand() < 0.5) [b, d] = [d, b];
    const a = L < 2 ? 1 : 1 + r(b - 1), c = L < 2 ? 1 : 1 + r(d - 1), D = b * d / gcd(b, d), sum = a * D / b + c * D / d;
    if (L === 2 && a === 1 && c === 1) continue;
    if (sum < D && gcd(sum, D) === 1) return { a, b, c, d, D };
  }
}
// a pie of `den` equal slices; fills = [[start, count, colour]] (start may be fractional while slices slide round);
// o.bg is the plate's opacity, o.from + o.k re-cut it: the old cuts stay and the new ones grow out from the middle
function pie(c, x, y, r, den, fills, o = {}) {
  const bg = o.bg ?? 1, A = i => -Math.PI / 2 + i * 2 * Math.PI / den;
  c.save();
  if (bg > 0) { c.globalAlpha = bg; c.fillStyle = 'rgba(60,30,20,0.18)'; c.beginPath(); c.ellipse(x + 2, y + 5, r + 4, r * 0.92 + 4, 0, 0, 7); c.fill(); c.fillStyle = '#fff4e0'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.globalAlpha = 1; }
  for (const [s0, k, col] of fills) { if (k <= 0) continue; c.fillStyle = col; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r - 2, A(s0), A(s0 + k)); c.closePath(); c.fill(); }
  c.strokeStyle = '#a0603a'; c.lineWidth = 1.6;
  if (o.from && o.k < 1) {
    const B = i => -Math.PI / 2 + i * 2 * Math.PI / o.from;
    for (let i = 0; i < o.from; i++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(B(i)) * r, y + Math.sin(B(i)) * r); c.stroke(); }
    const kk = M.easeIO(o.k); c.save(); c.globalAlpha = kk; c.strokeStyle = TAGC; c.lineWidth = 2;
    for (let i = 0; i < den; i++) { if ((i * o.from) % den === 0) continue; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(A(i)) * r * kk, y + Math.sin(A(i)) * r * kk); c.stroke(); }
    c.restore();
  } else if (bg > 0) for (let i = 0; i < den; i++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(A(i)) * r, y + Math.sin(A(i)) * r); c.stroke(); }
  if (bg > 0) { c.globalAlpha = bg; c.lineWidth = 3; c.strokeStyle = '#c8884a'; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); }
  c.restore();
}

MG.add({
  id: 'common', stage: 'fractions', cmd: 'COMMON DENOM!', hint: 'drag', time: 9, mood: 'bright', winText: 'Added!', hold: 1.4,
  card: {
    title: 'Adding fractions', ref: 'Grade 4–5', kind: 'Fractions',
    text: 'In a fraction such as 1/3, the bottom number is the denominator. It says how many equal pieces the whole is cut into. The top number is the numerator. It says how many of those pieces you have.\n\nYou can only add pieces of the same size. So to add 1/3 + 1/4, first find a common denominator, a number that both denominators divide into. 3 × 4 = 12 works. Then rewrite each fraction over 12 by multiplying its top and bottom by the same number: 1/3 = 4/12 and 1/4 = 3/12. Now add the numerators and keep the denominator: 4/12 + 3/12 = 7/12.\n\nMultiplying the top and bottom by the same number cuts each piece into smaller equal pieces, so the amount stays the same.',
    note: 'Rewrite both fractions over a common denominator by multiplying the top and bottom of each by the same number. Then add the numerators and keep the denominator.',
    ask: 'What is 1/2 + 1/3? What is 2/5 + 1/4?',
  },
  init(g) {
    const S = g.s, MKs = M.setup(g); Object.assign(S, pick(g)); const { a, b, c, d, D } = S, T = M.pace(g);
    S.F = [{ n: a, d: b, m: D / b }, { n: c, d, m: D / d }].map(f => ({ ...f, done: f.m === 1 }));
    S.found = false; S.adding = false; S.added = false;
    // the same node objects are kept through every rewrite, so numbers roll and glide instead of popping
    S.nn = S.F.map((f, i) => M.num(f.n, 'n' + i)); S.dd = S.F.map((f, i) => M.num(f.d, 'd' + i));
    S.fr = S.F.map((f, i) => M.frac(S.nn[i], S.dd[i], 'f' + i)); S.plus = M.op('+', 'plus');
    S.ex = M.row(S.fr[0], M.gap(4), S.plus, M.gap(4), S.fr[1]);
    const relay = () => M.place(g, 'ex', S.ex, 180, Y_EX, SZ, { col: INK }); MKs.relay = relay; relay();
    const small = S.F[0].d < S.F[1].d ? 0 : 1, k = D / S.F[small].d, nested = S.b === D || S.d === D;
    S.tagv = M.num('?', 'tagv');
    S.tag = M.row(M.num(nested ? S.F[small].d : S.b), M.op('×'), M.num(nested ? k : S.d), M.op('='), S.tagv);
    M.inert(g, ['tagv', 'res']);
    const hop = (g, e) => { MKs.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const nMoves = 2 + S.F.filter(f => !f.done).length; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const fd = (n, den) => M.frac(M.num(n), M.num(den));
    M.play(g, {
      moves(g) {
        // 1. find the common denominator
        if (!S.found) {
          if (S.tagOn) return [];
          const mv = (from, to) => ({ drag: from, to, busy: 0.1, askAt: 0.6 * T, after: 0.7 * T, ask: { v: D, wrong: [S.b + S.d, D * 2, Math.max(S.b, S.d) + 1, S.b * S.d === D ? D + 1 : S.b * S.d] },
            then(g) { S.tagOn = true; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh');
              M.place(g, 'tag', S.tag, 180, Y_TAG, 30, { col: TAGC }); M.writeIn(g, S.tag, { dur: 0.4 * T, delay: 0.12 * T });
              M.circle(g, ['d0', 'd1'], { dur: 0.55 * T, col: TAGC }); M.indicate(g, 'd0', { dur: 0.4 * T, col: TAGC, sc: 1.2 }); M.indicate(g, 'd1', { dur: 0.4 * T, col: TAGC, sc: 1.2, delay: 0.1 * T }); },
            resolve(g) { S.found = true; M.show(g, 0.7 * T); M.roll(g, S.tagv, D, { dur: 0.35 * T }); M.indicate(g, S.tagv, { delay: 0.25 * T, dur: 0.35 * T, col: TAGC }); M.sparkle(g, 'tagv', { delay: 0.3 * T, n: 8 });
              M.at(g, [[0.3 * T, g => { g.sfx('coin'); hop(g); }],
                // the denominators that must change light up: they are the ones that will become D
                [0.4 * T, g => { S.F.forEach((f, i) => { if (f.m > 1) M.indicate(g, S.dd[i], { dur: 0.3 * T, col: TAGC, sc: 1.2 }); }); }]]); } });
          return [mv('d0', 'd1'), mv('d1', 'd0')];
        }
        const out = [];
        // 2. rewrite each fraction over D: × m on top and bottom
        S.F.forEach((f, i) => { if (f.done || f.busy) return; out.push({ tap: ['f' + i, 'n' + i, 'd' + i], busy: 0.1, askAt: 0.6 * T, after: 0.9 * T, ask: { v: fd(f.n * f.m, D), wrong: [fd(f.n, D), fd(f.n + f.m, D), fd(f.n * f.m, f.d)] },
          then(g) { f.busy = true; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); g.sfx('tap');
            M.circle(g, 'f' + i, { dur: 0.5 * T, col: TAGC });
            const bf = M.box(g, 'f' + i), side = i === 0 ? -1 : 1, x = bf.x + side * (bf.w / 2 + 26);
            f.notes = ['n', 'd'].map((p, j) => { const key = 'x' + p + i, b = M.box(g, p + i), nd = M.row(M.op('×'), M.num(f.m)); nd.id = key; M.inert(g, [key]);
              M.place(g, key, nd, x, b.y + 8, 26, { col: TAGC }); M.writeIn(g, nd, { dur: 0.28 * T, delay: (0.1 + j * 0.16) * T });
              M.indicate(g, p === 'n' ? S.nn[i] : S.dd[i], { delay: (0.1 + j * 0.16) * T, dur: 0.35 * T, sc: 1.2, col: TAGC }); return { key, nd }; }); },
          resolve(g) { f.done = true; M.show(g, 0.9 * T);
            // the × m notes fly into the numbers, which roll over to their new values; the pie is re-cut
            f.notes.forEach(({ key, nd }, j) => { const bn = M.box(g, (j ? 'd' : 'n') + i), bx = M.box(g, key); if (bn && bx) M.tween(g, nd, { dx: bn.x - bx.x, alpha: 0, sc: 0.5 }, 0.3 * T, { delay: j * 0.08 * T }); });
            M.roll(g, S.nn[i], f.n * f.m, { delay: 0.2 * T, dur: 0.38 * T }); M.roll(g, S.dd[i], D, { delay: 0.28 * T, dur: 0.38 * T });
            f.cutAt = g.t + 0.25 * T; f.cutDur = 0.5 * T;
            M.at(g, [[0.4 * T, g => { g.sfx('coin'); hop(g); }], [0.62 * T, g => { for (const { key } of f.notes) delete g.s.mk.ex[key]; M.sparkle(g, 'f' + i, { n: 10, cols: ['#ffb070', '#fff', '#ffd45a'] }); relay(); }]]); } }); });
        // 3. add the numerators over the shared denominator
        if (!out.length && !S.adding && S.F.every(f => f.done)) {
          const p = S.F[0].n * S.F[0].m, q = S.F[1].n * S.F[1].m;
          out.push({ tap: 'plus', busy: 0.1, askAt: 0.65 * T, after: 0.85 * T, ask: { v: fd(p + q, D), wrong: [fd(p + q, 2 * D), fd(S.a + S.c, S.b + S.d), fd(p * q, D)] },
            then(g) { S.adding = true; M.show(g, 0.65 * T); S.point = true; hop(g, 'think');
              M.indicate(g, 'plus', { dur: 0.35 * T }); M.circle(g, ['n0', 'n1'], { dur: 0.45 * T, delay: 0.05 * T });
              M.at(g, [[0.3 * T, g => { // the numerators glide up over one denominator; the second denominator slides onto the first
                const from = { ...M.box(g, 'd1') }; S.pieX = S.F.map((f, i) => M.box(g, 'f' + i).x);
                S.dd[1].alpha = 0; S.ex = M.frac(M.row(S.nn[0], S.plus, S.nn[1]), S.dd[0], 'res'); relay(); S.mergeAt = g.t; g.sfx('swoosh'); hop(g);
                M.fly(g, { node: M.num(D, null, { col: INK }), from: [from.x, from.y], to: 'd0', dur: 0.3 * T, arc: -6, s0: from.s * 0.82, s1: SZ * 0.82 }); }]]); },
            resolve(g) { S.added = true; M.show(g, 0.85 * T);
              const b0 = M.box(g, 'n0'); for (const q2 of [S.plus, S.nn[1]]) { const bq = M.box(g, q2.id); if (b0 && bq) M.tween(g, q2, { dx: b0.x - bq.x, alpha: 0, sc: 0.6 }, 0.3 * T); }
              M.roll(g, S.nn[0], p + q, { delay: 0.12 * T, dur: 0.35 * T }); M.tween(g, S.tag, { alpha: 0 }, 0.4 * T, { delay: 0.2 * T });
              M.at(g, [[0.5 * T, g => { S.ex = M.frac(S.nn[0], S.dd[0], 'res'); relay(); S.point = false; g.sfx('ding'); hop(g, 'laugh'); g.burst(180, Y_EX - 16, ['#ffd45a', '#ff8a5a', '#fff'], 16, 150); M.sparkle(g, 'res', { delay: 0.1 * T, n: 12 }); }],
                [0.8 * T, g => { delete g.s.mk.ex.tag; }]]); } });
        }
        return out;
      },
      area(g) { return !S.found ? ['d0', 'd1'] : S.F.some(f => !f.done) ? S.F.map((f, i) => f.done ? null : 'f' + i).filter(Boolean) : ['plus']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, mk = S.mk, T = M.pace(g);
    SCN.std(g, c, { scene: 'kitchen', panel: PANEL, panelY: 300, panelH: 250 });
    // the rabbit points at the fractions while the work is shown and hops when a step lands
    const hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', HX, HY - hopK * 24, 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'rabbit', HX, HY, 1.35);
    M.drawEx(g, c, 'tag'); M.drawEx(g, c, 'ex'); for (const k of ['xn0', 'xd0', 'xn1', 'xd1']) M.drawEx(g, c, k);
    // the pies: one per fraction, cut into its current number of pieces; on the add they slide together into one
    const D = S.D, cnt = S.F.map(f => f.done ? f.n * f.m : f.n);
    if (S.mergeAt != null) {
      const k = M.easeIO((t - S.mergeAt) / (0.4 * T)), x0 = M.lerp(S.pieX[0], 180, k), x1 = M.lerp(S.pieX[1], 180, k);
      pie(c, x0, Y_PIE, 32, D, [[0, cnt[0], PIEC[0]]]);
      pie(c, x1, Y_PIE, 32, D, [[cnt[0] * k, cnt[1], PIEC[1]]], { bg: 1 - k });
      if (k >= 1 && !S.mergeLit) { S.mergeLit = true; g.burst(180, Y_PIE, ['#ffd45a', '#fff'], 8, 90); }
    } else S.F.forEach((f, i) => { const b = M.box(g, 'f' + i); if (!b) return; const y = Y_PIE + Math.sin(t * 2 + i) * 1.5, done = f.done && S.found && (f.cutAt == null || t >= f.cutAt);
      if (f.cutAt != null && t >= f.cutAt && t < f.cutAt + f.cutDur) pie(c, b.x, y, 30, D, [[0, f.n * f.m, PIEC[i]]], { from: f.d, k: (t - f.cutAt) / f.cutDur });
      else pie(c, b.x, y, 30, done ? D : f.d, [[0, done ? f.n * f.m : f.n, PIEC[i]]]); });
    M.drawUI(g, c);
  },
});
