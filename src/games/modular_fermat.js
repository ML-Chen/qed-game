// modular_fermat.js — FERMAT! Find 3¹⁰⁰ mod 7 with Fermat's little theorem.
// Like the algebra games, there is ONE expression, "3¹⁰⁰ mod 7", and every move rewrites it in place (symbols glide,
// numbers roll). Every new number either flies in from something already on screen or arrives with its one-line reason
// written beside it, and at most one note is on screen at a time. A pond at twilight seen from above; a frog sits on
// its lily pad in the corner. Every move's working plays by itself (the fuse stands still meanwhile):
//   1. Tap the 7: a ring of lily pads 0 … 6 fades in and the frog jumps onto pad 1. It hops "× 3" again and again
//      (pad k → pad 3k mod 7) while the ring's centre counts 3¹, 3², …; after six hops it is back on pad 1. The centre
//      becomes the fact chip "3⁶ ≡ 1" (the 1 flies in from pad 1) with its reason "7 is prime: 7 − 1 = 6", the ring
//      fades away and the chip stays pinned under the expression.
//   2. Tap the exponent 100 (or drag the chip onto it): the chip's 6 flies down to start the note
//      "6 · 16 = 96, and 96 + 4 = 100"; then 96 and 4 fly up and the exponent rewrites 100 → 96 + 4, and then 6 · 16
//      flies up and it rewrites 96 + 4 → 6 · 16 + 4.
//   3. Tap the exponent: "3ᵃ⁺ᵇ = 3ᵃ · 3ᵇ" writes itself and the line glides to 3^(6·16) · 3⁴; then
//      "3ᵃᵇ = (3ᵃ)ᵇ" and it glides to (3⁶)¹⁶ · 3⁴.
//   4. Drag the chip onto 3⁶ (or tap 3⁶): the chip's 1 flies onto 3⁶, which becomes 1: (1)¹⁶ · 3⁴; "1¹⁶ = 1" writes
//      itself and the line glides to 1 · 3⁴, then to 3⁴.
//   5. Tap 3⁴: "3⁴ = 3 · 3 · 3 · 3 = 81" writes itself and 81 flies up in place of 3⁴; then "81 = 77 + 4 = 7 · 11 + 4"
//      and 81 becomes (77 + 4); 77 is crossed out (a multiple of 7 leaves nothing), and the line ends 3¹⁰⁰ mod 7 = 4.
// Level 0: p = 5. Level 1: p = 7. Level 2: p = 11 or 13. The base is always a primitive root, so the frog is home
// exactly after p − 1 hops. Medium mode: where the frog lands (1), the remainder of the exponent, 1¹⁶, and the final
// residue are picked from the tray (wrong tiles: dividing by p instead of p − 1, 81 itself, 3 · 4 mod 7).
const M = MK;
const INK = '#f4fff4', GOLD = '#ffd86a', PAD = '#6ac46a', PADD = '#3a8a44', EY = 252, NY = 334, RC = 486, RR = 96, CHY = 408, HX = 54, HY = 596;
const pw = (a, k, p) => { let v = 1; for (let i = 0; i < k; i++) v = v * a % p; return v; };

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), one = a => a[r(a.length)];
  // the base is a primitive root of p, so the frog visits every pad once and is home exactly after p − 1 hops
  const p = L === 0 ? 5 : L === 1 ? 7 : one([11, 13]), a = L === 0 ? one([2, 3]) : L === 1 ? one([3, 5]) : 2;
  const q = L === 0 ? 3 + r(4) : L === 1 ? 5 + r(12) : 3 + r(6), rr = L === 0 ? 2 + r(2) : L === 1 ? (a === 5 ? 2 + r(2) : 2 + r(3)) : 2 + r(3);
  const N = (p - 1) * q + rr;
  return { p, a, q, r: rr, N, big: Math.pow(a, rr), ans: pw(a, rr, p) };
}
// the ring holds the pads 1, a, a², … (mod p) in the order the frog visits them, so every hop goes to the next pad round
const padXY = (j, n) => { const an = -Math.PI / 2 + 2 * Math.PI * j / n; return [180 + Math.cos(an) * RR, RC + Math.sin(an) * RR * 0.92]; };

MG.add({
  id: 'fermat', stage: 'modular', cmd: 'FERMAT!', hint: 'tap', time: 10, winText: 'Fermat!', hold: 1.9,
  card: {
    title: "Fermat's little theorem", ref: 'Number theory', kind: 'Number theory',
    text: 'If p is a prime and a is not a multiple of p, then a to the power p − 1 leaves remainder 1 when divided by p. Mathematicians write a^(p−1) ≡ 1 (mod p).\n\nThat makes huge powers easy. For 3¹⁰⁰ mod 7: here p − 1 = 6, so 3⁶ ≡ 1. Write 100 = 6 · 16 + 4. Then 3¹⁰⁰ = (3⁶)¹⁶ · 3⁴, and every 3⁶ is worth 1, so only 3⁴ = 81 is left. 81 = 7 · 11 + 4, so the answer is 4.\n\nYou can watch it on a ring of 7 lily pads: hopping to "3 times the pad number, mod 7" brings the frog home after 6 hops.',
    note: 'For a prime p, a^(p−1) ≡ 1 (mod p). Divide the exponent by p − 1 and keep only the remainder.',
    ask: 'What is 2²³ mod 11? What is 3²² mod 5?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { p, a, q, r, N, big, ans } = S, T = M.pace(g);
    const ES = g.level === 2 ? 40 : 44;
    // the one expression: a^N mod p
    S.b = M.num(a, 'b'); S.e = M.num(N, 'e'); S.pw = M.sup(S.b, S.e, 'pw'); S.modT = M.txt('mod', 'mod'); S.pN = M.num(p, 'p');
    S.tail = [M.gap(12), S.modT, M.gap(8), S.pN];
    S.line = M.row(S.pw, ...S.tail);
    S.relay = () => M.place(g, 'L', S.line, 180, EY, ES, { col: INK }); S.relay();
    M.inert(g, ['mod', 'pw', 'why', 'n6', 'n16', 'n96', 'nr', 'n81', 'n7k', 'nrr', 'mul', 'ceq']);
    S.ring = { alpha: 0 }; S.lit = {}; S.frog = { x: HX, y: HY }; S.notes = 0;
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    // one working note at a time, written just under the expression; each note has its own key
    const note = (node, o = {}) => { S.notes++; const key = 'n' + S.notes; S.noteKey = key; const m = M.lay(node, 24);
      M.place(g, key, node, M.clamp(o.x ?? 180, m.w / 2 + 12, 348 - m.w / 2), NY, 24, { col: GOLD }); M.writeIn(g, node, { dur: o.dur ?? 0.6 * T, delay: o.delay || 0 }); return node; };
    const dropNote = (g, d = 0.25 * T) => { const key = S.noteKey; if (!key || !g.s.mk.ex[key]) return; M.tween(g, g.s.mk.ex[key].node, { alpha: 0 }, d); M.at(g, [[d + 0.02, g => { delete g.s.mk.ex[key]; }]]); };
    const fade = (nodes, d) => { for (const n of nodes) if (n) M.tween(g, n, { alpha: 0 }, d); };
    const leaves = n => { const q = []; (function w(x) { if (!x) return; if (/^(num|var|txt|op)$/.test(x.k)) q.push(x); [x.base, x.exp, x.inner, ...(x.items || [])].forEach(w); })(n); return q; };
    // a frog hop from (x0, y0) to (x1, y1), with an optional label over the arc
    const leap = (g, x0, y0, x1, y1, dur, label) => { S.hopA = { x0, y0, x1, y1, t0: g.t, dur, label }; S.frog = { x: x1, y: y1 }; };
    const HOP = (p > 7 ? 0.42 : 0.52) * T, AIR = (p > 7 ? 0.3 : 0.36) * T;

    // ---- 1. why a^(p−1) ≡ 1: the frog makes one lap of the ring, multiplying by a at every hop ----
    const n = p - 1; S.order = [...Array(n)].map((_, j) => pw(a, j, p));
    const HOPT = (p > 7 ? 0.6 : 0.82) * T, f = HOPT / (0.9 * T), t1 = 0.7 * T, ask1 = t1 + (n - 1) * HOPT + 0.61 * f * T + 0.3 * T, R1 = 2.15 * T;
    const ringTrip = {
      busy: 0.1, askAt: ask1, after: R1, ask: { v: 1, wrong: [a, p - 1, 0] },
      then(g) { S.st = 1; S.point = true; hop('wow'); M.show(g, ask1); g.sfx('swoosh');
        M.circle(g, 'p', { col: GOLD, dur: 0.6 * T }); M.tween(g, S.ring, { alpha: 1 }, 0.45 * T, { delay: 0.1 * T });
        M.at(g, [[0.3 * T, g => { const [x, y] = padXY(0, n); leap(g, S.frog.x, S.frog.y, x, y, 0.38 * T); g.sfx('swoosh', { pitch: 1.3 }); }]]);
        for (let k = 1; k <= n; k++) { const j0 = k - 1, j1 = k % n, v0 = S.order[j0], prod = v0 * a, res = prod % p, t0 = t1 + (k - 1) * HOPT;
          M.at(g, [
            // the hop's arithmetic writes itself first: "2 × 3 = 6", or "6 × 3 = 18 = 14 + 4 → 4"
            [t0, g => { dropNote(g, 0.12 * T); }],
            [t0 + 0.13 * f * T, g => { note(M.row(M.num(v0), M.op('×'), M.num(a), M.op('='), M.num(prod), ...(prod >= p ? [M.op('='), M.num(prod - res), M.op('+'), M.num(res), M.txt(' →  '), M.num(res)] : [])), { dur: 0.3 * f * T }); }],
            [t0 + 0.25 * f * T, g => { const [x0, y0] = padXY(j0, n), [x1, y1] = padXY(j1, n); leap(g, x0, y0, x1, y1, 0.36 * f * T, '× ' + a); }],
            [t0 + 0.61 * f * T, g => { S.lit[j1] = g.t; g.sfx('tap', { pitch: 0.9 + k * 0.06 });
              // the ring's centre counts the hops as a power: after k hops of × a the frog sits on a^k mod p
              if (!S.chip) { S.ck = M.num(1, 'c6'); S.csup = M.sup(M.num(a, 'ca'), S.ck); S.chip = M.row(S.csup); S.chip.id = 'chip'; M.place(g, 'chip', S.chip, 180, RC + 10, 34, { col: GOLD }); M.writeIn(g, S.chip, { dur: 0.25 * T }); }
              else { M.roll(g, S.ck, k, { dur: 0.22 * T }); M.place(g, 'chip', S.chip, 180, RC + 10, 34, { col: GOLD }); M.indicate(g, S.chip, { sc: 1.12, dur: 0.3 * T, col: '#fff' }); } }]]); }
      },
      resolve(g) { M.show(g, R1); const [hx, hy] = padXY(0, n);
        S.home = g.t; M.sparkle(g, [hx, hy], { n: 14 }); g.sfx('coin'); hop('laugh'); dropNote(g, 0.3 * T);
        M.at(g, [
          // one full lap: the centre becomes the fact chip a^(p−1) ≡ 1, the 1 flying in from pad 1
          [0.35 * T, g => { S.c1 = M.num(1, 'c1', { alpha: 0 }); S.chip.items.push(M.op('≡', 'ceq'), S.c1); M.place(g, 'chip', S.chip, 180, RC + 10, 34, { col: GOLD });
            M.fly(g, { node: M.num(1, null, { col: GOLD }), from: [hx, hy], to: 'c1', dur: 0.45 * T, arc: -30, s0: 22, s1: 34, then(g) { S.c1.alpha = 1; S.c1.pop = g.t; g.sfx('pop'); } }); }],
          // the ring fades away, the frog goes home to its corner pad, and the chip moves up under the expression
          [0.95 * T, g => { M.tween(g, S.ring, { alpha: 0 }, 0.4 * T); leap(g, hx, hy, HX, HY, 0.45 * T); M.place(g, 'chip', S.chip, 180, CHY, 34, { col: GOLD }); M.tween(g, S.card, { alpha: 1 }, 0.35 * T, { delay: 0.2 * T }); }],
          // the chip's reason, short
          [1.4 * T, g => { S.why = M.txt(p + ' is prime: ' + p + ' − 1 = ' + (p - 1), 'why'); M.place(g, 'why', S.why, 180, CHY + 40, 18, { col: '#e8ffe8' }); M.writeIn(g, S.why, { dur: 0.5 * T }); }],
          [R1 - 0.03, g => { S.point = false; }]]);
      },
    };
    // ---- 2. the exponent: N = (p − 1)·q + r, rewritten in place ----
    const ask2 = 1.35 * T, R2 = 2.4 * T;
    const split = {
      busy: 0.1, askAt: ask2, after: R2, ask: { v: r, wrong: [q, N % p, p - 1, r + 1] },
      then(g) { S.st = 2; S.point = true; hop('think'); M.show(g, ask2); g.sfx('swoosh');
        M.circle(g, 'e', { col: GOLD, dur: 0.6 * T }); M.indicate(g, 'c6', { col: '#fff', dur: 0.45 * T });
        S.n6 = M.num(p - 1, 'n6', { alpha: 0 }); S.nr = M.num(r, 'nr', { alpha: 0 });
        S.note2 = M.row(S.n6, M.op('·'), M.num(q, 'n16'), M.op('='), M.num((p - 1) * q), M.txt(','), M.gap(6), M.txt('and'), M.gap(6), M.num((p - 1) * q, 'n96'), M.op('+'), S.nr, M.op('='), M.num(N));
        note(S.note2, { delay: 0.52 * T, dur: 0.72 * T });
        // the 6 of the note comes from the chip
        M.fly(g, { node: M.num(p - 1, null, { col: GOLD }), from: 'c6', to: 'n6', delay: 0.15 * T, dur: 0.42 * T, arc: 40, s0: 22, s1: 24, then(g) { S.n6.alpha = 1; S.n6.pop = g.t; } });
      },
      resolve(g) { M.show(g, R2); S.nr.alpha = 1; M.writeIn(g, S.nr, { dur: 0.2 * T }); M.indicate(g, S.nr, { delay: 0.15 * T, dur: 0.4 * T, col: '#fff' }); g.sfx('ding');
        M.at(g, [
          // 100 → 96 + 4: both numbers fly up from the note
          [0.4 * T, g => fade([S.e], 0.18 * T)],
          [0.6 * T, g => { S.x96 = M.num((p - 1) * q, 'x96', { alpha: 0 }); S.xp = M.op('+', null, { alpha: 0 }); S.x4 = M.num(r, 'x4', { alpha: 0 });
            S.pw.exp = M.row(S.x96, S.xp, S.x4); S.pw.exp.id = 'ex'; S.relay(); M.tween(g, S.xp, { alpha: 1 }, 0.3 * T, { delay: 0.15 * T }); hop('wow');
            for (const [src, n] of [['n96', S.x96], ['nr', S.x4]]) M.fly(g, { node: M.num(n.v, null, { col: GOLD }), from: src, to: n.id, dur: 0.45 * T, arc: 30, s0: 24, s1: 27, then(g) { n.alpha = 1; n.pop = g.t; g.sfx('pop'); } }); }],
          // 96 → 6 · 16: both numbers fly up from the note
          [1.25 * T, g => fade([S.x96], 0.18 * T)],
          [1.45 * T, g => { S.x6 = M.num(p - 1, 'x6', { alpha: 0 }); S.xd = M.op('·', null, { alpha: 0 }); S.x16 = M.num(q, 'x16', { alpha: 0 });
            S.pw.exp = M.row(S.x6, S.xd, S.x16, S.xp, S.x4); S.pw.exp.id = 'ex'; S.relay(); M.tween(g, S.xd, { alpha: 1 }, 0.3 * T, { delay: 0.15 * T });
            for (const [src, n] of [['n6', S.x6], ['n16', S.x16]]) M.fly(g, { node: M.num(n.v, null, { col: GOLD }), from: src, to: n.id, dur: 0.45 * T, arc: 30, s0: 24, s1: 27, then(g) { n.alpha = 1; n.pop = g.t; g.sfx('pop'); } }); }],
          [2.15 * T, g => dropNote(g)],
          [R2 - 0.03, g => { S.point = false; }]]);
      },
    };
    // ---- 3. the power splits: a^(mn + r) = a^(mn) · a^r = (a^m)^n · a^r ----
    const R3 = 2.85 * T;
    const powers = {
      busy: 0.1,
      then(g) { S.st = 3; S.point = true; hop('think'); M.show(g, R3); g.sfx('swoosh');
        M.circle(g, 'ex', { col: GOLD, dur: 0.6 * T });
        note(M.row(M.sup(M.num(a), M.row(M.vr('m'), M.op('+'), M.vr('n'))), M.op('='), M.sup(M.num(a), M.vr('m')), M.op('·'), M.sup(M.num(a), M.vr('n'))), { delay: 0.1 * T, dur: 0.55 * T });
        M.at(g, [
          [0.75 * T, g => fade([S.xp], 0.18 * T)],
          [0.95 * T, g => { S.b2 = M.num(a, 'b2', { alpha: 0 }); S.mul = M.op('·', 'mul', { alpha: 0 }); S.big = M.sup(S.b, M.row(S.x6, S.xd, S.x16), 'big'); S.small = M.sup(S.b2, S.x4, 'small');
            S.line = M.row(S.big, S.mul, S.small, ...S.tail); S.relay(); M.inert(g, ['mul']); M.tween(g, S.mul, { alpha: 1 }, 0.25 * T, { delay: 0.15 * T }); hop('wow');
            M.fly(g, { node: M.num(a, null, { col: INK }), from: 'b', to: 'b2', dur: 0.4 * T, arc: -30, s0: S.ES, s1: S.ES, then(g) { S.b2.alpha = 1; S.b2.pop = g.t; g.sfx('pop'); } }); }],
          [1.6 * T, g => dropNote(g)],
          [1.8 * T, g => note(M.row(M.sup(M.num(a), M.row(M.vr('m'), M.vr('n'))), M.op('='), M.sup(M.paren(M.sup(M.num(a), M.vr('m'))), M.vr('n'))), { dur: 0.5 * T })],
          [2.3 * T, g => fade([S.xd], 0.15 * T)],
          [2.45 * T, g => { S.in6 = M.sup(S.b, S.x6, 'in6'); S.big = M.sup(M.paren(S.in6), S.x16, 'big'); S.line.items[0] = S.big; S.relay(); hop('laugh'); g.sfx('pop'); }],
          [2.65 * T, g => dropNote(g)],
          [R3 - 0.03, g => { S.point = false; }]]);
      },
    };
    // ---- 4. a^(p−1) becomes 1, and 1 to any power is 1 ----
    const ask4 = 1.5 * T, R4 = 1.85 * T;
    const toOne = {
      busy: 0.1, askAt: ask4, after: R4, ask: { v: 1, wrong: [q, 0, a] },
      then(g) { S.st = 4; S.point = true; hop('think'); M.show(g, ask4); g.sfx('swoosh');
        M.circle(g, 'in6', { col: GOLD, dur: 0.6 * T }); M.indicate(g, 'chip', { sc: 1.15, dur: 0.5 * T, col: '#fff' });
        M.at(g, [[0.35 * T, g => M.fly(g, { node: M.num(1, null, { col: GOLD }), from: 'c1', to: 'in6', dur: 0.5 * T, arc: 40, s0: 34, s1: S.ES })],
          [0.7 * T, g => fade([S.b, S.x6], 0.15 * T)],
          [0.86 * T, g => { S.one = M.num(1, 'one', { _born: -1, col: GOLD, pop: g.t }); S.lp = M.txt('('); S.rp = M.txt(')'); S.big.base = M.row(S.lp, S.one, S.rp); S.relay(); M.sparkle(g, 'one', { n: 8 }); g.sfx('pop'); hop('wow'); }],
          [1.05 * T, g => { S.n1v = M.num(1, null, { alpha: 0 }); note(M.row(M.sup(M.num(1), M.num(q)), M.op('='), S.n1v), { dur: 0.4 * T }); }]]);
      },
      resolve(g) { M.show(g, R4); S.n1v.alpha = 1; M.writeIn(g, S.n1v, { dur: 0.18 * T }); M.indicate(g, S.n1v, { delay: 0.12 * T, dur: 0.35 * T, col: '#fff' }); g.sfx('ding');
        M.at(g, [[0.55 * T, g => fade([S.lp, S.rp, S.x16], 0.22 * T)],
          [0.8 * T, g => { S.line = M.row(S.one, S.mul, S.small, ...S.tail); S.relay(); }],
          [1.1 * T, g => { fade([S.one, S.mul], 0.22 * T); dropNote(g); }],
          [1.35 * T, g => { S.line = M.row(S.small, ...S.tail); S.relay(); hop('laugh'); }],
          [R4 - 0.03, g => { S.point = false; }]]);
      },
    };
    // ---- 5. a^r = big, big = p·k + residue, and the line ends a^N mod p = residue ----
    const k5 = Math.floor(big / p), ask5 = 2.15 * T, R5 = big >= p ? 2.6 * T : 1.8 * T;
    const reduce = {
      busy: 0.1, askAt: ask5, after: R5, ask: { v: ans, wrong: [big, a * r % p, (ans + 1) % p] },
      then(g) { S.st = 5; S.point = true; hop('think'); M.show(g, ask5); g.sfx('swoosh');
        M.circle(g, 'small', { col: GOLD, dur: 0.6 * T });
        const fs = []; for (let i = 0; i < r; i++) fs.push(i ? M.op('·') : null, M.num(a));
        note(M.row(M.sup(M.num(a), M.num(r)), M.op('='), ...fs.filter(Boolean), M.op('='), M.num(big, 'n81')), { delay: 0.1 * T, dur: 0.6 * T });
        M.at(g, [[0.95 * T, g => fade([S.b2, S.x4], 0.18 * T)],
          [1.12 * T, g => { S.v81 = M.num(big, 'v81', { alpha: 0 }); S.line = M.row(S.v81, ...S.tail); S.relay();
            M.fly(g, { node: M.num(big, null, { col: GOLD }), from: 'n81', to: 'v81', dur: 0.4 * T, arc: 30, s0: 24, s1: S.ES, then(g) { S.v81.alpha = 1; S.v81.pop = g.t; g.sfx('pop'); hop('wow'); } }); }],
          [1.5 * T, g => dropNote(g)],
          [1.65 * T, g => { S.nrr = M.num(ans, 'nrr', { alpha: 0 });
            if (big >= p) { S.n7k = M.row(M.num(p), M.op('·'), M.num(k5)); S.n7k.id = 'n7k'; note(M.row(M.num(big), M.op('='), S.n7k, M.op('+'), S.nrr), { dur: 0.5 * T }); }
            else { S.nrr.alpha = 1; note(M.row(M.num(big), M.op('<'), M.num(p)), { dur: 0.4 * T }); } }]]);
      },
      resolve(g) { M.show(g, R5);
        if (S.nrr) { S.nrr.alpha = 1; M.writeIn(g, S.nrr, { dur: 0.18 * T }); M.indicate(g, S.nrr, { delay: 0.12 * T, dur: 0.35 * T, col: '#fff' }); } g.sfx('ding');
        // the recap: the original problem writes itself back to the left of the answer
        const recap = (g) => { const nb = M.sup(M.num(a), M.num(N)), nm = M.txt('mod'), np = M.num(p), eq = M.op('='); const fresh = [nb, nm, np, eq];
          S.line = M.row(nb, M.gap(12), nm, M.gap(8), np, eq, S.vr); S.relay(); for (const n of fresh) M.writeIn(g, n, { dur: 0.5 * T }); S.vr.col = GOLD; S.vr.pop = g.t + 0.5 * T; M.sparkle(g, S.vr, { n: 14, delay: 0.5 * T }); g.sfx('coin'); hop('laugh'); };
        if (big >= p) M.at(g, [
          // big → (p·k + residue): 77 flies up from "7 · 11", the residue from the note
          [0.45 * T, g => fade([S.v81], 0.18 * T)],
          [0.65 * T, g => { S.l77 = M.num(p * k5, 'v77', { alpha: 0 }); S.lplus = M.op('+', null, { alpha: 0 }); S.vr = M.num(ans, 'vr', { alpha: 0 }); S.lpL = M.txt('(', null, { alpha: 0 }); S.lpR = M.txt(')', null, { alpha: 0 });
            S.line = M.row(S.lpL, S.l77, S.lplus, S.vr, S.lpR, ...S.tail); S.relay(); for (const n of [S.lplus, S.lpL, S.lpR]) M.tween(g, n, { alpha: 1 }, 0.25 * T, { delay: 0.15 * T });
            M.fly(g, { node: M.num(p * k5, null, { col: GOLD }), from: 'n7k', to: 'v77', dur: 0.45 * T, arc: 30, s0: 24, s1: S.ES, then(g) { S.l77.alpha = 1; S.l77.pop = g.t; g.sfx('pop'); } });
            M.fly(g, { node: M.num(ans, null, { col: GOLD }), from: 'nrr', to: 'vr', dur: 0.45 * T, delay: 0.05 * T, arc: 30, s0: 24, s1: S.ES, then(g) { S.vr.alpha = 1; S.vr.pop = g.t; } }); }],
          // a multiple of p leaves nothing: it is crossed out
          [1.3 * T, g => { M.strike(g, S.l77, { dur: 0.3 * T, col: '#ff8a7a' }); g.sfx('tap'); }],
          [1.65 * T, g => { fade([S.lpL, S.l77, S.lplus, S.lpR, S.modT, S.pN], 0.25 * T); dropNote(g); }],
          [1.92 * T, g => { S.line = M.row(S.vr); S.relay(); }],
          [2.15 * T, g => recap(g)],
          [R5 - 0.03, g => { S.point = false; }]]);
        else M.at(g, [[0.5 * T, g => { S.vr = S.v81; fade([S.modT, S.pN], 0.25 * T); dropNote(g); }],
          [0.8 * T, g => { S.line = M.row(S.vr); S.relay(); }],
          [1.1 * T, g => recap(g)],
          [R5 - 0.03, g => { S.point = false; }]]);
      },
    };
    S.ES = ES; S.card = { alpha: 0 };
    const chipIds = ['chip', 'ca', 'c6', 'c1'];
    M.play(g, {
      moves(g) {
        switch (S.st || 0) {
          case 0: return [{ ...ringTrip, tap: 'p' }, { ...ringTrip, drag: 'p', to: 'b' }];
          case 1: return [{ ...split, tap: 'e' }, { ...split, drag: chipIds, to: 'e' }];
          case 2: return [{ ...powers, tap: ['ex', 'x6', 'x16', 'x4'] }];
          case 3: return [{ ...toOne, drag: chipIds, to: 'in6' }, { ...toOne, tap: ['in6', 'big'] }];
          case 4: return [{ ...reduce, tap: 'small' }];
          default: return [];
        }
      },
      area(g) { return [['p'], ['e', 'chip'], ['ex'], ['chip', 'in6'], ['small']][S.st || 0] || null; },
    });
  },
  update(g, dt) { const S = g.s, K = S.mk; M.update(g, dt); if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; S.splash = g.t; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p;
    c.drawImage(g.bake('modular_fermat_pond', pond), 0, 0, W, H);
    // only a slow ripple or two moves in the background
    c.save(); for (let i = 0; i < 2; i++) { const k = (t * 0.2 + i / 2) % 1, x = [300, 70][i], y = [600, 420][i]; c.strokeStyle = `rgba(200,255,230,${0.22 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 8 + k * 30, 3 + k * 10, 0, 0, 7); c.stroke(); } c.restore();
    // a soft dark band behind the expression and its note, so they read over the water
    c.save(); c.fillStyle = 'rgba(10,30,40,0.38)'; c.beginPath(); c.roundRect(14, EY - 56, 332, NY + 22 - (EY - 56), 18); c.fill(); c.restore();
    // the frog's home pad in the corner
    c.save(); c.fillStyle = 'rgba(0,30,30,0.35)'; c.beginPath(); c.ellipse(HX + 3, HY + 3, 34, 12, 0, 0, 7); c.fill(); c.fillStyle = PAD; c.beginPath(); c.ellipse(HX, HY, 34, 12, 0, 0.4, 2 * Math.PI); c.lineTo(HX, HY); c.closePath(); c.fill(); c.strokeStyle = PADD; c.lineWidth = 1.5; c.stroke(); c.restore();
    // the ring of lily pads, in the order the frog visits them (only during the first move)
    const ra = S.ring.alpha, nn = p - 1, pr = nn > 6 ? 19 : 24;
    if (ra > 0.01) { c.save(); c.globalAlpha = ra * 0.35; c.strokeStyle = '#d8ffd0'; c.setLineDash([3, 7]); c.lineWidth = 2; c.beginPath(); c.ellipse(180, RC, RR, RR * 0.92, 0, 0, 7); c.stroke(); c.restore(); }
    if (ra > 0.01) for (let j = 0; j < nn; j++) { const [x, y] = padXY(j, nn), lit = S.lit[j] != null ? Math.max(0, 1 - (t - S.lit[j]) / 1.2) : 0, home = j === 0 && S.home != null && t - S.home < 1.4 ? 0.6 + 0.4 * Math.sin((t - S.home) * 9) : 0, L = Math.max(lit, home);
      c.save(); c.globalAlpha = ra; c.fillStyle = 'rgba(0,30,30,0.35)'; c.beginPath(); c.ellipse(x + 2, y + 4, pr, pr * 0.8, 0, 0, 7); c.fill();
      const gr = c.createRadialGradient(x - pr * 0.3, y - pr * 0.3, 2, x, y, pr); gr.addColorStop(0, P.mix('#9ae08a', '#ffe680', L)); gr.addColorStop(1, P.mix(PAD, '#e8b830', L * 0.8)); c.fillStyle = gr;
      const a0 = 0.9 + j * 0.7; c.beginPath(); c.moveTo(x + Math.cos(a0 + 0.22) * pr * 0.55, y + Math.sin(a0 + 0.22) * pr * 0.55); c.arc(x, y, pr, a0 + 0.4, a0 + 2 * Math.PI); c.closePath(); c.fill(); c.strokeStyle = PADD; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, pr, a0 + 0.4, a0 + 2 * Math.PI); c.stroke();
      c.font = M.NUMF(pr > 20 ? 22 : 19, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#163a1a'; c.fillText(String(S.order[j]), x, y + 1); c.restore(); }
    // the fact chip's card
    const cb = M.unionBox([M.box(g, 'chip'), S.why ? M.box(g, 'why') : null]);
    if (S.chip && cb) { const q = S.cbS || (S.cbS = { ...cb }), kk = 0.25; for (const k of ['x', 'y', 'w', 'h']) q[k] += (cb[k] - q[k]) * kk; const al = S.card.alpha;
      if (al > 0.01) { c.save(); c.globalAlpha = al; c.fillStyle = 'rgba(14,40,40,0.85)'; c.strokeStyle = GOLD; c.lineWidth = 2; const w = Math.max(q.w, 150) + 28;
        c.beginPath(); c.roundRect(q.x - w / 2, q.y - q.h / 2 - 10, w, q.h + 20, 14); c.fill(); c.stroke(); c.restore(); } }
    if (S.chip) M.drawEx(g, c, 'chip'); if (S.why) M.drawEx(g, c, 'why');
    // the frog (on the ring, mid-hop, or home in its corner)
    let fx = S.frog.x, fy = S.frog.y, air = 0; const HA = S.hopA;
    if (HA && t < HA.t0 + HA.dur) { const k = M.easeIO(M.clamp((t - HA.t0) / HA.dur, 0, 1)); fx = M.lerp(HA.x0, HA.x1, k); fy = M.lerp(HA.y0, HA.y1, k) - Math.sin(k * Math.PI) * 34; air = Math.sin(k * Math.PI);
      c.save(); c.globalAlpha = Math.max(ra, 0.4); c.strokeStyle = 'rgba(255,240,170,0.6)'; c.setLineDash([4, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(HA.x0, HA.y0); c.quadraticCurveTo((HA.x0 + HA.x1) / 2, (HA.y0 + HA.y1) / 2 - 50, HA.x1, HA.y1); c.stroke(); c.restore();
      if (HA.label) { c.save(); c.globalAlpha = Math.min(1, k * 4) * Math.min(1, (1 - k) * 6 + 0.3); c.font = M.NUMF(20, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = 'rgba(0,0,0,0.8)'; c.shadowBlur = 5; c.fillStyle = GOLD; c.fillText(HA.label, (HA.x0 + HA.x1) / 2, (HA.y0 + HA.y1) / 2 - 38); c.restore(); } }
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', sad = S.splash != null && t - S.splash < 0.6;
    const expr = won ? 'laugh' : lost || sad ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won || (S.home != null && t - S.home < 0.9 && air === 0) ? 'cheer' : air > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', fx, fy + 8, 0.7, { t, pose, expr, noShadow: air > 0.1 }); else SCN.host(g, c, 'frog', fx, fy, 0.7);
    M.drawEx(g, c, 'L'); for (const key of Object.keys(S.mk.ex)) if (/^n\d+$/.test(key)) M.drawEx(g, c, key);
    M.drawUI(g, c);
  },
});

// the pond at twilight, seen from above: deep teal water with the sky's colours in it, reeds and stones at the edges
function pond(c, W, H) {
  const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#2a2a5a'); wg.addColorStop(0.35, '#1e4a6a'); wg.addColorStop(1, '#0e3a42'); c.fillStyle = wg; c.fillRect(0, 0, W, H);
  // reflected sunset glow and stars in the water
  const rg = c.createRadialGradient(260, 120, 10, 260, 120, 260); rg.addColorStop(0, 'rgba(255,150,170,0.35)'); rg.addColorStop(1, 'rgba(255,150,170,0)'); c.fillStyle = rg; c.fillRect(0, 0, W, H);
  const R = P.rng(19); for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(255,255,230,${0.15 + R() * 0.35})`; c.fillRect(R() * W, R() * 300, 1.5, 1.5); }
  c.strokeStyle = 'rgba(180,230,255,0.08)'; c.lineWidth = 2; for (let i = 0; i < 18; i++) { const y = 40 + i * 34 + R() * 10; c.beginPath(); c.moveTo(R() * 60, y); c.lineTo(80 + R() * 220, y + (R() - 0.5) * 4); c.stroke(); }
  // reeds and stones at the left and right edges
  for (const [x0, dir] of [[0, 1], [W, -1]]) { for (let i = 0; i < 9; i++) { const x = x0 + dir * (6 + R() * 26), y = 120 + i * 60 + R() * 30; c.fillStyle = '#2a4a30'; c.beginPath(); c.ellipse(x, y, 14 + R() * 10, 9 + R() * 6, R() * 3, 0, 7); c.fill(); c.strokeStyle = '#4a7a3a'; c.lineWidth = 3; c.lineCap = 'round'; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + dir * (8 + k * 6), y - 10 - k * 4); c.stroke(); } } }
  // the frog's home lily pad at the bottom left, and a lotus
  c.fillStyle = '#ffc0d8'; for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.beginPath(); c.ellipse(312 + Math.cos(a) * 8, 600 + Math.sin(a) * 6, 9, 5, a, 0, 7); c.fill(); } c.fillStyle = '#ffe680'; c.beginPath(); c.arc(312, 600, 4, 0, 7); c.fill();
}
