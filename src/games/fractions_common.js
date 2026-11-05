// fractions_common.js — COMMON DENOM! Add two fractions by first giving them a common denominator.
// 1/3 + 1/4: the player drags one denominator onto the other, and the common denominator appears over the sum
// ("3 × 4 = 12"). Then the player taps each fraction (either order) to rewrite it over 12, multiplying its top and
// bottom by the same number (×4/×4 and ×3/×3 are written beside it). Last, a tap on the + adds the numerators: 7/12.
// A pie under each fraction shows that the rewritten fraction is the same amount cut into smaller pieces.
// Level 0: one denominator divides the other (1/2 + 1/4). Level 1: coprime denominators, numerators 1.
// Level 2: coprime denominators with bigger numerators. Medium mode: the common denominator, each rewritten fraction
// and the sum are picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), TAGC = '#d0603a', Y_EX = 292, Y_TAG = 214, Y_PIE = 378, SZ = 54;
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
// a pie of `den` equal slices with `k` of them filled
function pie(c, x, y, r, den, k, col) {
  c.save(); c.fillStyle = 'rgba(60,30,20,0.18)'; c.beginPath(); c.ellipse(x + 2, y + 5, r + 4, r * 0.92 + 4, 0, 0, 7); c.fill();
  c.fillStyle = '#fff4e0'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  for (let i = 0; i < k; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / den; c.fillStyle = col; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r - 2, a0, a0 + 2 * Math.PI / den); c.closePath(); c.fill(); }
  c.strokeStyle = '#a0603a'; c.lineWidth = 1.6; for (let i = 0; i < den; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / den; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a0) * r, y + Math.sin(a0) * r); c.stroke(); }
  c.lineWidth = 3; c.strokeStyle = '#c8884a'; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); c.restore();
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
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, b, c, d, D } = S;
    S.F = [{ n: a, d: b, m: D / b }, { n: c, d, m: D / d }].map((f, i) => ({ ...f, done: f.m === 1 }));
    S.found = false; S.added = false;
    const build = () => {
      const fr = S.F.map((f, i) => { const done = f.done && S.found; const n = M.frac(M.num(done ? f.n * f.m : f.n, 'n' + i), M.num(done ? D : f.d, 'd' + i), 'f' + i); if (f.at) n.pop = f.at; return n; });
      S.ex = S.added ? M.frac(M.num(S.F[0].n * S.F[0].m + S.F[1].n * S.F[1].m, 'rn', { pop: g.t }), M.num(D, 'rd'), 'res') : M.row(fr[0], M.gap(4), M.op('+', 'plus'), M.gap(4), fr[1]);
      M.place(g, 'ex', S.ex, 180, Y_EX, SZ, { col: INK });
    };
    S.build = build; build();
    const small = S.F[0].d < S.F[1].d ? 0 : 1, k = D / S.F[small].d;
    const tagRow = v => M.row(M.num(S.b === D || S.d === D ? S.F[small].d : S.b), M.op('×'), M.num(S.b === D || S.d === D ? k : S.d), M.op('='), v);
    const showTag = v => { S.tag = tagRow(v); M.place(g, 'tag', S.tag, 180, Y_TAG, 28, { col: TAGC }); M.inert(g, ['tagv']); };
    const nMoves = 2 + S.F.filter(f => !f.done).length; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const fd = (n, den) => M.frac(M.num(n), M.num(den));
    M.play(g, {
      moves(g) {
        if (!S.found) {
          const mv = (from, to) => ({ drag: from, to, busy: 0.1, askAt: 0, after: 0.1, ask: { v: D, wrong: [S.b + S.d, D * 2, Math.max(S.b, S.d) + 1, S.b * S.d === D ? D + 1 : S.b * S.d] },
            then(g) { showTag(M.num('?', 'tagv')); g.sfx('whoosh'); }, resolve(g) { S.found = true; showTag(M.num(D, 'tagv', { pop: g.t })); S.foundAt = g.t; g.sfx('coin'); build(); } });
          return [mv('d0', 'd1'), mv('d1', 'd0')];
        }
        const out = [];
        S.F.forEach((f, i) => { if (f.done) return; out.push({ tap: ['f' + i, 'n' + i, 'd' + i], busy: 0.1, askAt: 0, after: 0.1, ask: { v: fd(f.n * f.m, D), wrong: [fd(f.n, D), fd(f.n + f.m, D), fd(f.n * f.m, f.d)] },
          then(g) { f.shown = true; f.at = g.t; const fr = M.node(g, 'f' + i); fr.n = M.row(M.num(f.n), M.op('·'), M.num(f.m, null, { col: TAGC })); fr.d = M.row(M.num(f.d), M.op('·'), M.num(f.m, null, { col: TAGC })); M.relayout(g, 'ex'); },
          resolve(g) { f.done = true; f.at = g.t; build(); g.sfx('coin'); const bx = M.box(g, 'f' + i); if (bx) g.burst(bx.x, bx.y, ['#ffb070', '#fff'], 10, 110); } }); });
        if (!out.length && !S.added) {
          const p = S.F[0].n * S.F[0].m, q = S.F[1].n * S.F[1].m;
          out.push({ tap: 'plus', busy: 0.1, askAt: 0, after: 0.1, ask: { v: fd(p + q, D), wrong: [fd(p + q, 2 * D), fd(S.a + S.c, S.b + S.d), fd(p * q, D)] },
            then(g) { S.ex = M.frac(M.row(M.num(p), M.op('+'), M.num(q)), M.num(D), 'res'); M.place(g, 'ex', S.ex, 180, Y_EX, SZ, { col: INK }); },
            resolve(g) { S.added = true; S.addAt = g.t; build(); g.sfx('ding'); g.burst(180, Y_EX - 16, ['#ffd45a', '#ff8a5a', '#fff'], 16, 150); } });
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
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'kitchen', panel: PANEL, panelY: 300, panelH: 250, host: 'rabbit', hostX: 292, hostY: 592, hostS: 1.35 });
    M.drawEx(g, c, 'tag'); M.drawEx(g, c, 'ex');
    // ×m beside the numerator and the denominator of each rewritten fraction
    S.F.forEach((f, i) => { if (!f.shown || S.added || f.m === 1) return; const b = M.box(g, 'f' + i); if (!b) return; const a = t - f.at < 1 ? 1 : 0.6;
      c.save(); c.globalAlpha = a; c.fillStyle = TAGC; c.font = M.NUMF(20); c.textAlign = 'left'; c.fillText('×' + f.m, b.x + b.w / 2 + 2, b.y - 16); c.fillText('×' + f.m, b.x + b.w / 2 + 2, b.y + 34); c.restore(); });
    // the pies: one per fraction, cut into its current number of pieces; one pie for the sum
    if (S.added) pie(c, 180, Y_PIE, 34, S.D, S.F[0].n * S.F[0].m + S.F[1].n * S.F[1].m, '#e8784a');
    else S.F.forEach((f, i) => { const b = M.box(g, 'f' + i); if (!b) return; const done = f.done && S.found; pie(c, b.x, Y_PIE + Math.sin(t * 2 + i) * 1.5, 30, done ? S.D : f.d, done ? f.n * f.m : f.n, i ? '#8ab84a' : '#e8784a'); });
    M.drawUI(g, c);
  },
});
