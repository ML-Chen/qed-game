// modular_fermat.js — FERMAT! Find 2¹⁰ mod 5 the way you would on paper: build a table of powers and their
// remainders, see it come back to 1 and repeat, then use that to cut the big power down. Built from the owner's
// storyboard. Two rules for the whole game: nothing disappears on its own, and each tap adds exactly one thing.
// A dark slate in a candle-lit study (Fermat wrote his notes in the margins of a book); a hedgehog watches and reacts.
// Layout: the problem "2¹⁰ mod 5 = ?" and what it means at the top, the table of powers under it (remainders in one
// column), and the working lines under the table. Every row and every line stays on screen until the game ends.
//   Rows (tap the glowing 2, once per row): "2¹ = 2 → 2", "2² = 4 → 4", "2³ = 8 = 5 + 3 → 3" (the "5 +" is ringed with
//     "one 5 taken out" under it, and the 3 flies from "+ 3" into the remainder column), "2⁴ = 16 = 15 + 1 → 1" (the 1
//     turns gold: "back to 1!"). The row's base flies down from the problem. A row's label stays until the next tap.
//     Bigger powers (mod 7) use the row above: "3⁴ ≡ 6 · 3 = 18 = 14 + 4 → 4", the 6 flying down from row 3.
//   Why it repeats (tap the 2 again): "2⁵ = 2⁴ · 2 → 1 · 2 = 2"; 2⁴ is copied from its row, the gold 1 flies in, an
//     arrow joins this 2 to row 1's 2 and a brace over the rows reads "repeats every 4".
//   Tap the exponent 10: "2¹⁰ = 2⁴ · 2⁴ · 2²" with "4 + 4 + 2 = 10" beside it; dotted lines join each 2⁴ to the gold row.
//   Tap a 2⁴: a new line "≡ 1 · 1 · 2²", both 1s flying down the dotted lines from the gold row.
//   Tap 2²: "≡ 4", the 4 flying in from row 2; it flies on up into the answer box, and the theorem's card slides in.
// Level 0: 2 mod 5, exponent 9–11 (4 + 4 + r). Level 1: 3 or 5 mod 7 (seven rows), exponent 13–17 (6 + 6 + r).
// Level 2: 2 or 3 mod 5 with a big exponent: "2¹⁰² = 2^(4·25 + 2)" with "102 ÷ 4 = 25 R 2" and a brace "25 groups of 4";
// then "= (2⁴)²⁵ · 2²", "≡ 1²⁵ · 2²", "≡ 1 · 2²" with "1²⁵ = 1 · 1 · … · 1 = 1", and "≡ 4", one tap each.
// The base is always a primitive root, so the table first comes back to 1 exactly at the power p − 1 (as the theorem says).
// Medium mode: the tray asks for each row's remainder and for the final answer.
const M = MK;
const INK = '#f4f1ff', GOLD = '#ffd36a', SOFT = '#b9c4e6', REM = '#9ee6ff', CUT = '#ff9f80', HX = 66, HY = 604;
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
// a power whose exponent stays readable (at least 18 px) at small sizes: the exponent is drawn at a larger share of
// the base's size than MK.sup's 0.62 (scaled about its centre and raised), so table rows and working lines stay legible
function sp(base, exp, id, o, s) { const r = Math.min(1, Math.max(0.62, 18.5 / s)); if (r <= 0.62) return MK.sup(base, exp, id, o);
  const w = MK.lay(exp, s).w; Object.assign(exp, { sc: r, dy: -0.4 * s + 0.34 * s * (1 - r) });
  return { k: 'row', items: [base, MK.gap(0.04 * s - (1 - r) * w / 2), exp, MK.gap(-(1 - r) * w / 2)], id, ...o }; }
const pw = (a, k, p) => { let v = 1; for (let i = 0; i < k; i++) v = v * a % p; return v; };
// per level: where the table rows and the working lines go, and their sizes
const LAY = [
  { rowY: 292, step: 33, rs: 25, ls: 26, L: [474, 514] },
  { rowY: 282, step: 25, rs: 22, ls: 22, L: [484, 518] },
  { rowY: 284, step: 27, rs: 22, ls: 22, l1s: 26, L: [430, 486, 518] },
];
const X0 = 20, TOPY = 202, SUBY = 230, HEADY = 258;

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), one = q => q[r(q.length)];
  const p = L === 1 ? 7 : 5, a = L === 0 ? 2 : L === 1 ? one([3, 5]) : one([2, 3]);
  const rr = 1 + r(p === 5 ? 3 : 5), q = L === 2 ? 10 + r(21) : 2, N = (p - 1) * q + rr;
  return { p, a, r: rr, q, N, ans: pw(a, rr, p) };
}

MG.add({
  id: 'fermat', stage: 'modular', cmd: 'FERMAT!', hint: 'tap', time: 10, winText: 'Fermat!', hold: 1.9,
  card: {
    title: "Fermat's little theorem", ref: 'Number theory', kind: 'Number theory',
    text: 'If p is a prime and a is not a multiple of p, then a to the power p − 1 leaves remainder 1 when divided by p.\n\nThat makes huge powers easy. For 2¹⁰ mod 5, list the powers of 2 and their remainders when divided by 5: 2 → 2, 4 → 4, 8 = 5 + 3 → 3, 16 = 15 + 1 → 1. Back to 1 at 2⁴, so the remainders repeat every 4. Write 2¹⁰ = 2⁴ · 2⁴ · 2². Each 2⁴ leaves remainder 1, so 2¹⁰ leaves the same remainder as 1 · 1 · 2² = 4. The answer is 4.',
    note: 'For a prime p, a^(p−1) leaves remainder 1, so the remainders of a, a², a³, … repeat every p − 1 steps. Divide the exponent by p − 1 and keep only the remainder.',
    ask: 'What is 2²³ mod 5? What is 3¹⁴ mod 7?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { p, a, r, q, N, ans } = S, T = M.pace(g), LV = LAY[g.level] || LAY[0];
    const big = g.level === 2, n1 = p - 1, inert = [], rs = LV.rs, ls = LV.ls;
    const H = o => ({ alpha: 0, hide: true, ...o }); // a symbol that is not there yet
    const id = (s, tap) => { if (!tap) { inert.push(s); if (S.ready) M.inert(g, [s]); } return s; };
    S.k = 0; S.ph = 0; S.marks = []; S.labs = []; S.nl = 0;
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // a symbol writes itself in (or several, one after another)
    const write = (n, d, dur) => M.at(g, [[d, g => { n.hide = false; n.alpha = 1; M.writeIn(g, n, { dur }); }]]);
    const writeAll = (list, d, each) => list.forEach((n, i) => write(n, d + i * each * 0.8, each));
    // a copy flies from a symbol already on screen into its new place, which appears when it lands
    const copy = (src, dst, mk, d, dur, o = {}) => M.at(g, [[d, g => { dst.hide = false; dst.alpha = 0;
      M.fly(g, { node: mk(), from: src, to: dst.id, dur, arc: o.arc ?? -30, col: o.col || INK, then(g) { dst.alpha = 1; dst.pop = g.t; g.sfx('pop', { pitch: o.pitch || 1 }); if (o.then) o.then(g); } }); }]]);
    // labels (the reason for one tap) stay until the next tap
    const label = (node, x, y, s, col, o = {}) => { const key = 'lab' + (++S.nl), m = M.lay(node, s), cx = M.clamp(x, m.w / 2 + 12, 348 - m.w / 2);
      M.place(g, key, node, o.left ? Math.min(x, 348 - m.w) : cx, y, s, { col, left: o.left }); node.alpha = 1; M.writeIn(g, node, { dur: o.dur || 0.35 * T, delay: o.delay || 0 }); if (!o.keep) S.labs.push(key); return key; };
    const clearLabels = () => { for (const key of S.labs) { const e = g.s.mk.ex[key]; if (e) M.tween(g, e.node, { alpha: 0 }, 0.22 * T); } const ks = S.labs; S.labs = [];
      for (const m of S.marks) if (m.temp && !m.fade) { m.fade = g.t; }
      M.at(g, [[0.25 * T, g => { for (const key of ks) delete g.s.mk.ex[key]; }]]); };

    // ---- the problem, what it means, and the table's header ----
    S.b = M.num(a, id('b', true)); S.e = M.num(N, id('e', true)); S.tp = M.sup(S.b, S.e, id('tp'));
    S.ansN = M.txt('?', id('ans', true)); S.top = M.row(S.tp, M.gap(12), M.txt('mod', id('mod', true)), M.gap(8), M.num(p, id('p', true)), M.op('=', id('teq')), M.gap(4), S.ansN);
    M.place(g, 'top', S.top, 180, TOPY, 38, { col: INK });
    const sub = M.num('the remainder after dividing by ' + p); // what "mod" asks, in words
    M.place(g, 'sub', sub, 180, SUBY, 19, { col: SOFT });
    M.place(g, 'head', M.row(M.num('powers of ' + a + '  →  remainder ÷ ' + p)), X0, HEADY, 18, { col: SOFT, left: true });

    // ---- the table rows (built now so the remainder column can line up; each row appears on its tap) ----
    S.rows = [];
    for (let k = 1; k <= p; k++) {
      const R = { k, y: LV.rowY + (k - 1) * LV.step, r: pw(a, k, p) }, I = s => id('r' + k + s);
      R.base = M.num(a, I('b'), H()); R.ex = M.num(k, I('x'), H()); R.pow = sp(R.base, R.ex, I('p'), {}, rs);
      const items = [R.pow]; let last;
      if (k === p) { // why it repeats: a^p = a^(p−1) · a, and a^(p−1) leaves 1
        R.eq = M.op('=', I('e'), H()); R.pp = sp(M.num(a), M.num(n1), I('pp'), H(), rs); R.d1 = M.op('·', I('d1'), H()); R.a1 = M.num(a, I('a1'), H());
        R.arr = M.op('→', I('ar'), H()); R.one = M.num(1, I('o'), H({ col: GOLD })); R.d2 = M.op('·', I('d2'), H()); R.a2 = M.num(a, I('a2'), H());
        items.push(R.eq, R.pp, R.d1, R.a1, R.arr, R.one, R.d2, R.a2); R.last = M.op('=', I('e2'), H()); R.rv = a;
      } else {
        const prev = k > 1 ? pw(a, k - 1, p) : null; R.direct = Math.pow(a, k) <= (p === 5 ? 100 : 30);
        R.V = R.direct ? Math.pow(a, k) : prev * a;
        if (!R.direct) { R.eq = M.op('≡', I('e'), H()); R.prev = M.num(prev, I('pr'), H({ col: REM })); R.d1 = M.op('·', I('d1'), H()); R.a1 = M.num(a, I('a1'), H()); items.push(R.eq, R.prev, R.d1, R.a1); }
        R.eqV = M.op('=', I('ev'), H()); R.Vn = M.num(R.V, I('v'), H()); items.push(R.eqV, R.Vn);
        if (R.V >= p) { R.eqM = M.op('=', I('em'), H()); R.mult = M.num(R.V - R.r, I('m'), H()); R.plus = M.op('+', I('pl'), H()); R.rr = M.num(R.r, I('rr'), H()); items.push(R.eqM, R.mult, R.plus, R.rr); }
        R.last = M.op('→', I('ar'), H()); R.rv = R.r;
      }
      R.rm = M.num(R.rv, id('rm' + k, true), H({ col: k === n1 ? GOLD : REM }));
      R.items = items; R.wA = M.lay(M.row(...items), rs).w; R.wL = M.lay(R.last, rs).w; R.wR = M.lay(R.rm, rs).w; S.rows[k] = R;
    }
    S.xr = Math.max(...S.rows.slice(1).map(R => X0 + R.wA + R.wL + R.wR / 2)) + 4; // the remainder column's centre
    for (let k = 1; k <= p; k++) { const R = S.rows[k]; R.node = M.row(...R.items, k === p ? null : M.gap(Math.max(0, S.xr - X0 - R.wA - R.wL - R.wR / 2)), R.last, R.rm); } // the repeat row reads on naturally
    const RW = k => S.rows[k];

    // ---- one row per tap ----
    const rowMove = k => {
      const R = RW(k), takes = R.V >= p && k < p;
      const flyBase = (d = 0) => { M.indicate(g, S.b, { dur: 0.4 * T, sc: 1.2, col: GOLD, delay: d });
        copy('b', R.base, () => M.num(a), d + 0.05 * T, 0.38 * T, { arc: -20 }); write(R.ex, d + 0.4 * T, 0.16 * T); };
      const start = g => { S.k = k; S.point = true; clearLabels(); hop('think'); g.sfx('swoosh');
        M.place(g, 'row' + k, R.node, X0, R.y, rs, { col: INK, left: true }); R.pow.alpha = 1; flyBase(); };
      if (k === p) return { busy: 0.1, then(g) { start(g); const R4 = RW(n1), L = 2.95 * T; M.show(g, L);
        write(R.eq, 0.5 * T, 0.14 * T);
        // a^(p−1) is copied from its own row; the gold 1 that it leaves flies in from that row's remainder
        M.at(g, [[0.6 * T, g => M.indicate(g, R4.pow, { dur: 0.45 * T, col: GOLD })]]);
        copy(R4.pow.id, R.pp, () => M.sup(M.num(a), M.num(n1)), 0.62 * T, 0.4 * T, { arc: 10 });
        writeAll([R.d1, R.a1], 1.05 * T, 0.14 * T); write(R.arr, 1.3 * T, 0.14 * T);
        M.at(g, [[1.38 * T, g => M.indicate(g, R4.rm, { dur: 0.4 * T, col: GOLD })]]);
        copy(R4.rm.id, R.one, () => M.num(1), 1.42 * T, 0.38 * T, { col: GOLD, arc: 14, pitch: 1.2 });
        writeAll([R.d2, R.a2], 1.85 * T, 0.14 * T); writeAll([R.last, R.rm], 2.1 * T, 0.14 * T);
        // this remainder is row 1's remainder again: an arrow joins them, and a brace over the rows says it repeats
        M.at(g, [[2.3 * T, g => { M.indicate(g, R.rm, { dur: 0.4 * T }); M.indicate(g, RW(1).rm, { dur: 0.4 * T, delay: 0.3 * T });
            S.marks.push({ kind: 'arrow', from: R.rm.id, to: RW(1).rm.id, t0: g.t, dur: 0.45 * T }); g.sfx('swoosh', { pitch: 1.2 }); hop('wow'); }],
          [2.62 * T, g => { const top = RW(1).y - rs * 0.9, bot = RW(n1).y + rs * 0.2, l1 = M.num('repeats'), l2 = M.row(M.num('every '), M.num(n1, 'cyc'));
            const lw = Math.max(M.lay(l1, 18).w, M.lay(l2, 18).w), lx = S.xr + 46;
            if (lx + lw <= 348) { // room beside the remainders: the brace and its two-line label sit there
              S.marks.push({ kind: 'vbrace', x: lx - 13, y0: top, y1: bot, t0: g.t, dur: 0.3 * T });
              label(l1, lx, (top + bot) / 2 - 3, 18, GOLD, { left: true, keep: true, delay: 0.15 * T }); label(l2, lx, (top + bot) / 2 + 18, 18, GOLD, { left: true, keep: true, delay: 0.3 * T }); }
            else { // no room (mod 7): the brace at the edge, and the label in one line under the last row
              S.marks.push({ kind: 'vbrace', x: 340, y0: top, y1: bot, t0: g.t, dur: 0.3 * T });
              const one = M.row(M.num('repeats every '), M.num(n1, 'cyc')), w1 = M.lay(one, 18).w; label(one, 348 - w1, R.y + 21, 18, GOLD, { left: true, keep: true, delay: 0.15 * T }); }
            g.sfx('ding'); }],
          [L - 0.03, g => { S.point = false; }]]); } };
      // the plan of a row: its working writes itself, then the remainder goes into the column
      let t = 0.5 * T;
      const pre = [];
      if (!R.direct) { pre.push([t, () => write(R.eq, 0, 0.14 * T)]); const t1 = t + 0.08 * T;
        pre.push([t1, () => { M.indicate(g, RW(k - 1).rm, { dur: 0.4 * T }); copy(RW(k - 1).rm.id, R.prev, () => M.num(R.prev.v), 0, 0.36 * T, { col: REM, arc: 12 }); }]);
        t += 0.5 * T; pre.push([t, () => writeAll([R.d1, R.a1], 0, 0.14 * T)]); t += 0.3 * T; }
      pre.push([t, () => writeAll([R.eqV, R.Vn], 0, 0.16 * T)]); t += 0.32 * T;
      if (takes) { pre.push([t, () => writeAll([R.eqM, R.mult, R.plus, R.rr], 0, 0.14 * T)]); t += 0.55 * T;
        // the multiple of p is ringed, with the reason under it ("one 5 taken out")
        const nn = (R.V - R.r) / p, txt = (WORDS[nn] || String(nn)) + ' ' + p + (nn > 1 ? 's' : '') + ' taken out';
        pre.push([t, () => { S.marks.push({ kind: 'ring', ids: [R.mult.id, R.plus.id], t0: g.t, dur: 0.3 * T, temp: true }); g.sfx('tap');
          const b = M.unionBox([M.box(g, R.mult.id), M.box(g, R.plus.id)]); label(M.num(txt), b ? b.x : 180, R.y + Math.round(LV.step * 0.78), 18, CUT, { delay: 0.12 * T }); }]); t += 0.5 * T; }
      pre.push([t, () => write(R.last, 0, 0.14 * T)]); t += 0.22 * T;
      const askAt = t, src = takes ? R.rr : R.Vn, isOne = R.r === 1, after = isOne ? 1.0 * T : 0.55 * T;
      const wrong = [R.V, R.V - R.r, p - R.r, R.r + 1, R.r - 1, 0].filter(v => v !== R.r && v >= 0);
      return { busy: 0.1, askAt, after, ask: { v: R.r, wrong },
        then(g) { start(g); M.show(g, askAt); M.at(g, pre.map(([tt, f]) => [tt, g => f()])); },
        resolve(g) { M.show(g, after); M.indicate(g, src, { dur: 0.35 * T, col: R.r === 1 ? GOLD : REM });
          copy(src.id, R.rm, () => M.num(R.r), 0.08 * T, 0.36 * T, { col: isOne ? GOLD : REM, arc: -24, pitch: 1 + k * 0.06, then(g) { hop(isOne ? 'laugh' : 'happy'); M.sparkle(g, R.rm, { n: isOne ? 14 : 6 });
            if (isOne) { S.marks.push({ kind: 'gold', k, t0: g.t }); g.sfx('coin'); const b = M.box(g, R.rm.id); label(M.num('back to 1!'), b.x + b.w / 2 + 12, R.y, 18, GOLD, { left: true }); } } });
          M.at(g, [[after - 0.03, g => { S.point = false; }]]); } };
    };

    // ---- the working lines ----
    const Ly = LV.L, mkPow = (e) => () => M.sup(M.num(a), M.num(e)), goldRm = () => RW(n1).rm;
    const eqUnder = (lineKey, eqId, node) => { const b = M.box(g, eqId), w0 = M.lay(node.items[0], ls).w; return b.x - w0 / 2; };
    S.lines = {};
    // the exponent splits into whole cycles: a^N = a^(p−1) · a^(p−1) · a^r (levels 0 and 1)
    const L1s = () => { const o = {};
      o.pw = sp(M.num(a), M.num(N), id('l1p'), H(), ls); o.eq = M.op('=', id('leq'), H());
      o.g1 = sp(M.num(a, id('g1b')), M.num(n1, id('g1x')), id('g1', true), H(), ls); o.d1 = M.op('·', id('ld1'), H());
      o.g2 = sp(M.num(a, id('g2b')), M.num(n1, id('g2x')), id('g2', true), H(), ls); o.d2 = M.op('·', id('ld2'), H());
      o.g3 = sp(M.num(a, id('g3b')), M.num(r, id('g3x')), id('g3', true), H(), ls);
      o.node = M.row(o.pw, o.eq, o.g1, o.d1, o.g2, o.d2, o.g3); return o; };
    const expSum = { busy: 0.1, then(g) { S.ph = 1; S.point = true; clearLabels(); hop('think'); g.sfx('swoosh'); const L = 2.3 * T; M.show(g, L);
      const o = S.lines.l1 = L1s(); M.place(g, 'L1', o.node, X0, Ly[0], ls, { col: INK, left: true });
      M.indicate(g, S.e, { dur: 0.45 * T, col: GOLD }); copy('tp', o.pw, mkPow(N), 0.1 * T, 0.42 * T, { arc: -10 });
      write(o.eq, 0.55 * T, 0.14 * T);
      // the reason first: whole cycles of p − 1 and what is left over, adding up to the exponent
      M.at(g, [[0.7 * T, g => { M.indicate(g, 'cyc', { dur: 0.45 * T, col: GOLD }); const why = M.row(M.num(n1), M.op('+'), M.num(n1), M.op('+'), M.num(r), M.op('='), M.num(N));
        const b = M.box(g, 'g3'); label(why, b.x + b.w / 2 + 16, Ly[0], 19, SOFT, { left: true, keep: true, dur: 0.5 * T }); }]]);
      writeAll([o.g1, o.d1, o.g2, o.d2, o.g3], 1.3 * T, 0.16 * T);
      // each a^(p−1) is joined to the gold row by a dotted line
      M.at(g, [[1.9 * T, g => { S.marks.push({ kind: 'dots', from: ['g1', 'g2'], to: goldRm().id, t0: g.t, dur: 0.35 * T, line: true }); M.indicate(g, goldRm(), { dur: 0.4 * T, col: GOLD, delay: 0.2 * T }); hop('wow'); }],
        [L - 0.03, g => { S.point = false; }]]); } };
    const lineOnes = { busy: 0.1, then(g) { S.ph = 2; S.point = true; hop('think'); g.sfx('swoosh'); const L = 1.5 * T; M.show(g, L); const l1 = S.lines.l1;
      // the new line lines up under the old one: ≡ under =, each 1 under its a^(p−1)
      const o = S.lines.l2 = {}; o.eq = M.op('≡', id('meq'), H()); o.o1 = M.num(1, id('m1'), H({ col: GOLD })); o.d1 = M.op('·', id('md1'), H()); o.o2 = M.num(1, id('m2'), H({ col: GOLD })); o.d2 = M.op('·', id('md2'), H());
      o.t3 = sp(M.num(a), M.num(r), id('h3', true), H(), ls); o.eq2 = M.op('≡', id('meq2'), H()); o.res = M.num(ans, id('mres'), H({ col: REM }));
      const x0 = eqUnder('L1', 'leq', { items: [o.eq] }); let cur = x0 + M.lay(o.eq, ls).w; const its = [o.eq];
      for (const [nd, tid] of [[o.o1, 'g1'], [o.d1, 'ld1'], [o.o2, 'g2'], [o.d2, 'ld2'], [o.t3, 'g3']]) { const b = M.box(g, tid), w = M.lay(nd, ls).w, gp = b ? b.x - w / 2 - cur : 0; if (gp > 0) its.push(M.gap(gp)); its.push(nd); cur += Math.max(0, gp) + w; }
      o.node = M.row(...its, o.eq2, o.res); M.place(g, 'L2', o.node, x0, Ly[1], ls, { col: INK, left: true });
      M.indicate(g, l1.g1, { dur: 0.4 * T, col: GOLD }); M.indicate(g, l1.g2, { dur: 0.4 * T, col: GOLD, delay: 0.1 * T });
      write(o.eq, 0.15 * T, 0.14 * T);
      M.at(g, [[0.3 * T, g => M.indicate(g, goldRm(), { dur: 0.4 * T, col: GOLD })]]);
      copy(goldRm().id, o.o1, () => M.num(1), 0.35 * T, 0.45 * T, { col: GOLD, arc: 0, pitch: 1.1 }); copy(goldRm().id, o.o2, () => M.num(1), 0.45 * T, 0.45 * T, { col: GOLD, arc: 0, pitch: 1.2 });
      M.at(g, [[0.95 * T, g => { for (const m of S.marks) if (m.kind === 'dots' && !m.fade) m.fade = g.t; hop('wow'); }]]);
      writeAll([o.d1, o.d2], 1.0 * T, 0.12 * T); copy('g3', o.t3, mkPow(r), 1.05 * T, 0.36 * T, { arc: 0 });
      M.at(g, [[L - 0.03, g => { S.point = false; }]]); } };
    // the end: a^r leaves the remainder in row r; it goes into the answer box, and the theorem's card slides in
    const finish = (o, srcId) => { const R = RW(r), wrong = [Math.pow(a, r), 1, r, p - ans, ans % n1 + 1, 0].filter(v => v !== ans), A = 0.4 * T, AF = 5.2 * T;
      return { busy: 0.1, askAt: A, after: AF, ask: { v: ans, wrong },
        then(g) { S.ph++; S.point = true; clearLabels(); hop('think'); g.sfx('swoosh'); M.show(g, A); M.indicate(g, srcId, { dur: 0.4 * T, col: GOLD }); write(o.eq2, 0.15 * T, 0.14 * T); },
        resolve(g) { M.show(g, AF); M.indicate(g, R.rm, { dur: 0.4 * T, col: REM });
          copy(R.rm.id, o.res, () => M.num(ans), 0.1 * T, 0.42 * T, { col: REM, arc: 20, then(g) { M.sparkle(g, o.res); hop('wow'); } });
          M.at(g, [[0.7 * T, g => { M.indicate(g, o.res, { dur: 0.4 * T, col: GOLD }); M.tween(g, S.ansN, { alpha: 0 }, 0.15 * T); }],
            [0.85 * T, g => { const nn = M.num(ans, id('ansv'), { alpha: 0, col: GOLD }); S.top.items[S.top.items.length - 1] = nn; S.ansN = nn; M.place(g, 'top', S.top, 180, TOPY, 38, { col: INK }); S.ansDone = g.t;
              M.fly(g, { node: M.num(ans), from: o.res.id, to: nn.id, dur: 0.5 * T, arc: -40, col: GOLD, then(g) { nn.alpha = 1; nn.pop = g.t; M.sparkle(g, nn, { n: 16 }); g.sfx('coin'); hop('laugh'); S.boxGold = g.t; } }); }],
            [1.6 * T, g => { S.cardT = g.t; g.sfx('swoosh', { pitch: 0.8 }); }],
            [AF - 0.03, g => { S.point = false; }]]); } };
    };
    const finSum = () => finish(S.lines.l2, 'h3');

    // level 2: a^N = a^((p−1)·q + r) = (a^(p−1))^q · a^r ≡ 1^q · a^r ≡ 1 · a^r ≡ answer
    const expGroups = { busy: 0.1, then(g) { S.ph = 1; S.point = true; clearLabels(); hop('think'); g.sfx('swoosh'); const L = 2.5 * T; M.show(g, L);
      const o = S.lines.l1 = {}; o.pw = sp(M.num(a), M.num(N), id('l1p'), H(), LV.l1s || ls); o.eq = M.op('=', id('leq'), H()); o.b = M.num(a, id('kb'), H());
      o.x4 = M.num(n1, id('k4'), H()); o.xd = M.op('·', id('kd'), H()); o.xq = M.num(q, id('kq'), H()); o.xp = M.op('+', id('kp'), H()); o.xr = M.num(r, id('kr'), H());
      o.ex = M.row(o.x4, o.xd, o.xq, o.xp, o.xr); o.ex.id = id('x1', true); o.sp = sp(o.b, o.ex, id('ksp'), {}, LV.l1s || ls);
      o.node = M.row(o.pw, o.eq, o.sp); M.place(g, 'L1', o.node, X0, Ly[0], LV.l1s || ls, { col: INK, left: true });
      M.indicate(g, S.e, { dur: 0.45 * T, col: GOLD }); copy('tp', o.pw, mkPow(N), 0.1 * T, 0.42 * T, { arc: -10 }); write(o.eq, 0.55 * T, 0.14 * T);
      // the reason: how many whole cycles of p − 1 fit in the exponent, and what is left over
      o.wq = M.num(q, id('wq')); o.wr = M.num(r, id('wr')); const why = M.row(M.num(N), M.op('÷'), M.num(n1, id('w4')), M.op('='), o.wq, M.num(' R '), o.wr);
      M.at(g, [[0.7 * T, g => { M.indicate(g, 'cyc', { dur: 0.45 * T, col: GOLD }); const bw = M.lay(o.node, LV.l1s || ls).w; label(why, X0 + bw + 18, Ly[0], 19, SOFT, { left: true, keep: true, dur: 0.55 * T }); }]]);
      write(o.b, 1.35 * T, 0.12 * T); copy('cyc', o.x4, () => M.num(n1), 1.4 * T, 0.36 * T, { col: GOLD, arc: 10 }); write(o.xd, 1.5 * T, 0.1 * T);
      copy('wq', o.xq, () => M.num(q), 1.55 * T, 0.36 * T, { arc: -20 }); write(o.xp, 1.75 * T, 0.1 * T); copy('wr', o.xr, () => M.num(r), 1.75 * T, 0.36 * T, { arc: -20 });
      // a brace under the whole cycles: q groups of p − 1
      M.at(g, [[2.15 * T, g => { S.marks.push({ kind: 'hbrace', ids: ['k4', 'kq'], y: Ly[0] + 6, t0: g.t, dur: 0.25 * T }); const b = M.unionBox([M.box(g, 'k4'), M.box(g, 'kq')]);
        label(M.row(M.num(q + ' groups of ' + n1)), b.x, Ly[0] + 27, 18, GOLD, { keep: true, delay: 0.1 * T }); hop('wow'); }], [L - 0.03, g => { S.point = false; }]]); } };
    const regroup = { busy: 0.1, then(g) { S.ph = 2; S.point = true; hop('think'); g.sfx('swoosh'); const L = 1.6 * T; M.show(g, L); const l1 = S.lines.l1;
      const o = S.lines.l2 = {}; o.eq = M.op('=', id('neq'), H()); o.in4 = M.num(n1, id('n4'), H()); o.inb = sp(M.num(a), o.in4, null, {}, ls); o.par = M.paren(o.inb, id('q4', true), H());
      o.oq = M.num(q, id('nq'), H()); o.grp = sp(o.par, o.oq, id('yq', true), {}, ls); o.d = M.op('·', id('nd'), H()); o.rr = M.num(r, id('nr'), H()); o.rb = M.num(a, id('nrb'), H()); o.t3 = sp(o.rb, o.rr, id('nt3'), {}, ls);
      o.eq2 = M.op('≡', id('neq2'), H()); o.one = M.num(1, id('z1'), H({ col: GOLD })); o.zq = M.num(q, id('zq'), H()); o.o25 = sp(o.one, o.zq, id('o25', true), {}, ls); o.d2 = M.op('·', id('nd2'), H()); o.z3 = sp(M.num(a), M.num(r), id('z3'), H(), ls);
      o.node = M.row(o.eq, o.grp, o.d, o.t3, o.eq2, o.o25, o.d2, o.z3); const x0 = eqUnder('L1', 'leq', o.node); M.place(g, 'L2', o.node, x0, Ly[1], ls, { col: INK, left: true });
      M.indicate(g, l1.ex, { dur: 0.4 * T, col: GOLD }); write(o.eq, 0.12 * T, 0.12 * T); write(o.par, 0.3 * T, 0.2 * T); M.at(g, [[0.3 * T, g => { o.in4.hide = true; }]]);
      copy('k4', o.in4, () => M.num(n1), 0.45 * T, 0.38 * T, { col: GOLD, arc: -10 }); copy('kq', o.oq, () => M.num(q), 0.6 * T, 0.38 * T, { arc: -10 });
      write(o.d, 0.95 * T, 0.1 * T); write(o.rb, 1.0 * T, 0.12 * T); M.at(g, [[1.0 * T, g => { o.rr.hide = true; }]]); copy('kr', o.rr, () => M.num(r), 1.05 * T, 0.36 * T, { arc: -10, then() { hop('wow'); } });
      M.at(g, [[L - 0.03, g => { S.point = false; }]]); } };
    const toOneQ = { busy: 0.1, then(g) { S.ph = 3; S.point = true; clearLabels(); hop('think'); g.sfx('swoosh'); const L = 1.75 * T; M.show(g, L); const o = S.lines.l2;
      M.indicate(g, o.par, { dur: 0.4 * T, col: GOLD });
      M.at(g, [[0.15 * T, g => { S.marks.push({ kind: 'dots', from: ['q4'], to: goldRm().id, t0: g.t, dur: 0.3 * T }); M.indicate(g, goldRm(), { dur: 0.4 * T, col: GOLD, delay: 0.2 * T }); }]]);
      write(o.eq2, 0.55 * T, 0.12 * T); M.at(g, [[0.6 * T, g => { o.o25.hide = false; o.o25.alpha = 1; o.one.hide = true; o.zq.hide = true; }]]);
      copy(goldRm().id, o.one, () => M.num(1), 0.65 * T, 0.45 * T, { col: GOLD, arc: 0, pitch: 1.2, then(g) { for (const m of S.marks) if (m.kind === 'dots' && !m.fade) m.fade = g.t; hop('wow'); } });
      copy('nq', o.zq, () => M.num(q), 1.1 * T, 0.32 * T, { arc: -14 }); write(o.d2, 1.2 * T, 0.1 * T); copy('nt3', o.z3, mkPow(r), 1.25 * T, 0.36 * T, { arc: -14 });
      M.at(g, [[L - 0.03, g => { S.point = false; }]]); } };
    const oneQ = { busy: 0.1, then(g) { S.ph = 4; S.point = true; hop('think'); g.sfx('swoosh'); const L = 1.75 * T; M.show(g, L); const l2 = S.lines.l2;
      const o = S.lines.l3 = {}; o.eq = M.op('≡', id('peq'), H()); o.one = M.num(1, id('p1'), H({ col: GOLD })); o.d = M.op('·', id('pd'), H()); o.t3 = sp(M.num(a), M.num(r), id('f2', true), H(), ls);
      o.eq2 = M.op('≡', id('peq2'), H()); o.res = M.num(ans, id('pres'), H({ col: REM }));
      o.node = M.row(o.eq, o.one, o.d, o.t3, o.eq2, o.res); const x0 = eqUnder('L1', 'leq', o.node); M.place(g, 'L3', o.node, x0, Ly[2], ls, { col: INK, left: true });
      M.indicate(g, l2.o25, { dur: 0.4 * T, col: GOLD });
      // the reason: 1 times itself any number of times is still 1
      o.w1 = M.num(1, id('w1')); const why = M.row(sp(M.num(1), M.num(q), null, {}, 22), M.op('='), o.w1);
      const ww = M.lay(why, 22).w, xw = Math.min(x0 + M.lay(o.node, ls).w + 18, 348 - ww);
      M.at(g, [[0.15 * T, g => label(why, xw, Ly[2], 22, SOFT, { left: true, keep: true, dur: 0.55 * T })]]);
      write(o.eq, 0.75 * T, 0.12 * T); copy('w1', o.one, () => M.num(1), 0.85 * T, 0.4 * T, { col: GOLD, arc: -24, pitch: 1.2, then() { hop('wow'); } });
      write(o.d, 1.2 * T, 0.1 * T); copy('z3', o.t3, mkPow(r), 1.25 * T, 0.36 * T, { arc: -14 });
      M.at(g, [[L - 0.03, g => { S.point = false; }]]); } };
    const finG = () => finish(S.lines.l3, 'f2');

    S.phases = big
      ? [() => [{ ...expGroups, tap: 'e' }], () => [{ ...regroup, tap: ['x1', 'k4', 'kq'] }], () => [{ ...toOneQ, tap: ['q4', 'yq'] }], () => [{ ...oneQ, tap: 'o25' }], () => [{ ...finG(), tap: 'f2' }]]
      : [() => [{ ...expSum, tap: 'e' }], () => [{ ...lineOnes, tap: ['g1', 'g2'] }], () => [{ ...finSum(), tap: ['h3', 'g3'] }]];
    S.taps = p + S.phases.length; g.dur *= Math.max(1, S.taps / 8);

    // the theorem's card, built now: a title and a few short lines
    const v = s => M.vr(s), t = s => M.txt(s);
    S.cardLines = [
      M.row(t('If '), v('p'), t(' is a prime and '), v('a'), t(' is not a multiple')),
      M.row(t('of '), v('p'), t(', then '), sp(v('a'), M.row(v('p'), M.op('−'), M.num(1)), null, {}, 18), t(' leaves remainder 1')),
      M.row(t('when divided by '), v('p'), t('.')),
      M.row(t('Here '), v('p'), t(' = ' + p + ' and '), v('a'), t(' = ' + a + ', so '), sp(M.num(a), M.num(n1), null, {}, 18), t(' = ' + Math.pow(a, n1) + ' leaves')),
      M.row(t('remainder 1 when divided by ' + p + '.')),
    ];
    M.inert(g, inert); S.ready = true;
    M.play(g, {
      moves(g) { if (S.k < p) { const mv = rowMove(S.k + 1), taps = ['b']; if (S.k >= 1) taps.push('rm' + S.k); return [{ ...mv, tap: taps }]; }
        const f = S.phases[S.ph]; return f ? f() : []; },
      area(g) { if (S.k < p) return ['b']; return [[], ['e'], big ? ['x1'] : ['g1', 'g2'], big ? ['q4'] : ['h3'], ['o25'], ['f2']][S.ph + 1] || null; },
    });
  },
  update(g, dt) { const S = g.s, K = S.mk; M.update(g, dt); if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), LV = LAY[g.level] || LAY[0];
    c.drawImage(g.bake('modular_fermat_study', study), 0, 0, W, H);
    // the candle flickers and its glow breathes
    const fl = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 5.3 + 1);
    c.save(); const cg = c.createRadialGradient(322, 566, 4, 322, 566, 120); cg.addColorStop(0, `rgba(255,200,120,${0.32 * fl})`); cg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = cg; c.fillRect(190, 440, 170, 200);
    c.translate(322, 572); c.scale(1, 0.9 + 0.12 * fl); c.fillStyle = '#ffb648'; c.beginPath(); c.moveTo(0, -24); c.quadraticCurveTo(9, -6, 0, 2); c.quadraticCurveTo(-9, -6, 0, -24); c.fill();
    c.fillStyle = '#fff2c0'; c.beginPath(); c.moveTo(0, -15); c.quadraticCurveTo(4, -4, 0, 0); c.quadraticCurveTo(-4, -4, 0, -15); c.fill(); c.restore();
    // the slate
    c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.roundRect(10, 170, 344, 380, 16); c.fill();
    c.fillStyle = '#6a4228'; c.beginPath(); c.roundRect(4, 162, 352, 384, 16); c.fill(); c.strokeStyle = '#8a5a36'; c.lineWidth = 2; c.stroke();
    const sg = c.createLinearGradient(0, 170, 0, 540); sg.addColorStop(0, '#1d2436'); sg.addColorStop(1, '#161c2c'); c.fillStyle = sg; c.beginPath(); c.roundRect(11, 169, 338, 370, 10); c.fill(); c.restore();
    // the answer box at the top
    const ab = M.box(g, S.ansN.id); if (ab) { const gold = S.boxGold != null ? Math.min(1, (t - S.boxGold) / 0.3) : 0, w = Math.max(ab.w, 24) + 18, h = 46;
      c.save(); c.lineWidth = 2.5; c.strokeStyle = gold ? GOLD : 'rgba(185,196,230,0.8)'; if (!gold) c.setLineDash([6, 5]); c.fillStyle = gold ? 'rgba(255,211,106,0.16)' : 'rgba(255,255,255,0.06)';
      c.beginPath(); c.roundRect(ab.x - w / 2, TOPY - 36, w, h, 10); c.fill(); c.stroke(); c.restore(); }
    // the gold row (the power that leaves 1) keeps a soft band behind it
    for (const m of S.marks) if (m.kind === 'gold') { const R = S.rows[m.k], k = Math.min(1, (t - m.t0) / (0.3 * T)); c.save(); c.globalAlpha = 0.2 * k; c.fillStyle = GOLD; c.beginPath(); c.roundRect(X0 - 7, R.y - LV.rs * 0.92, S.xr - X0 + 22, LV.rs * 1.18, 8); c.fill(); c.restore(); }
    // the host watches from the desk, points while work is shown, hops when something lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', HX, HY - hopK * 18, 0.95, { t, pose, expr }); else SCN.host(g, c, 'hedgehog', HX, HY, 0.95);
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'sub'); M.drawEx(g, c, 'head');
    for (let k = 1; k <= S.p; k++) M.drawEx(g, c, 'row' + k);
    for (const key of ['L1', 'L2', 'L3']) M.drawEx(g, c, key);
    for (const key of Object.keys(S.mk.ex)) if (/^lab/.test(key)) M.drawEx(g, c, key);
    drawMarks(g, c, S, T);
    // the theorem's card slides in last, over the table (the problem, its answer and the working stay in view)
    if (S.cardT != null) drawCard(g, c, S, Math.min(1, (t - S.cardT) / (0.45 * T)), LV);
    M.drawUI(g, c);
  },
});

// persistent marks: the ring round a multiple (until the next tap), the arrow and brace of the repeat, the dotted
// lines to the gold row (until the 1s fly down them), the brace under the whole cycles
function drawMarks(g, c, S, T) {
  const t = g.t;
  for (const m of S.marks) {
    const k = M.easeIO(Math.min(1, (t - m.t0) / m.dur)), fa = m.fade != null ? 1 - Math.min(1, (t - m.fade) / (0.25 * T)) : 1; if (fa <= 0 || k <= 0) continue;
    c.save(); c.globalAlpha = fa; c.lineCap = 'round'; c.lineJoin = 'round';
    if (m.kind === 'ring') { const b = M.unionBox(m.ids.map(i => M.box(g, i))); if (b) { const w = b.w + 10, h = b.h + 10, per = 2 * (w + h); c.strokeStyle = CUT; c.lineWidth = 2.5; c.setLineDash([per * k, per * 2]); c.beginPath(); c.roundRect(b.x - w / 2, b.y - h / 2, w, h, h / 2); c.stroke(); } }
    else if (m.kind === 'arrow') { const a = M.box(g, m.from), b = M.box(g, m.to); if (a && b) { const x0 = a.x + a.w / 2 + 4, y0 = a.y, x1 = b.x + b.w / 2 + 4, y1 = b.y, xo = S.xr + 38; // out to the right of the remainder column, up, and back in
      const P = u => { const v = 1 - u; return [v * v * v * x0 + 3 * v * v * u * xo + 3 * v * u * u * xo + u * u * u * x1, v * v * v * y0 + 3 * v * v * u * y0 + 3 * v * u * u * y1 + u * u * u * y1]; };
      c.strokeStyle = GOLD; c.fillStyle = GOLD; c.lineWidth = 2.5; c.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = P(k * i / 30); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
      const [px, py] = P(k), [qx, qy] = P(Math.max(0, k - 0.04)), an = Math.atan2(py - qy, px - qx); c.beginPath(); c.moveTo(px + Math.cos(an) * 7, py + Math.sin(an) * 7); c.lineTo(px + Math.cos(an + 2.5) * 8, py + Math.sin(an + 2.5) * 8); c.lineTo(px + Math.cos(an - 2.5) * 8, py + Math.sin(an - 2.5) * 8); c.fill(); } }
    else if (m.kind === 'vbrace') { const x = m.x, y0 = m.y0, y1 = m.y1, mid = (y0 + y1) / 2, ym = mid + (y1 - mid) * 0; c.strokeStyle = GOLD; c.lineWidth = 2.5; const yk = y => mid + (y - mid) * k;
      c.beginPath(); c.moveTo(x - 8, yk(y0)); c.quadraticCurveTo(x, yk(y0), x, yk(y0) + 8 * k); c.lineTo(x, ym - 6 * k); c.quadraticCurveTo(x, ym, x + 7, ym); c.quadraticCurveTo(x, ym, x, ym + 6 * k); c.lineTo(x, yk(y1) - 8 * k); c.quadraticCurveTo(x, yk(y1), x - 8, yk(y1)); c.stroke(); }
    else if (m.kind === 'hbrace') { const b = M.unionBox(m.ids.map(i => M.box(g, i))); if (b) { const x0 = b.x - b.w / 2 - 2, x1 = b.x + b.w / 2 + 2, mx = (x0 + x1) / 2, y = m.y, xk = x => mx + (x - mx) * k; c.strokeStyle = GOLD; c.lineWidth = 2.2;
      c.beginPath(); c.moveTo(xk(x0), y - 5); c.quadraticCurveTo(xk(x0), y, xk(x0) + 5 * k, y); c.lineTo(mx - 5, y); c.quadraticCurveTo(mx, y, mx, y + 5); c.quadraticCurveTo(mx, y, mx + 5, y); c.lineTo(xk(x1) - 5 * k, y); c.quadraticCurveTo(xk(x1), y, xk(x1), y - 5); c.stroke(); } }
    else if (m.kind === 'dots') { const b = M.box(g, m.to); if (b) for (const f of m.from) { const a = M.box(g, f); if (!a) continue; const x0 = a.x, y0 = a.y - a.h / 2 - 2, x1 = b.x - b.w / 2 - 2, y1 = b.y + b.h / 2;
      c.strokeStyle = 'rgba(255,211,106,0.75)'; c.lineWidth = 2; c.setLineDash([3, 6]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(M.lerp(x0, x1, k), M.lerp(y0, y1, k)); c.stroke(); } }
    c.restore();
  }
}
function drawCard(g, c, S, k, LV) {
  const e = M.ease(k), ls = 18, bot = LV.L[0] - (LV.l1s || LV.ls) - 8, top = SUBY + 9, h = bot - top, lh = Math.min(24, (h - 50) / S.cardLines.length), x = 10 + (1 - e) * 360, w = 340;
  c.save(); c.globalAlpha = Math.min(1, k * 2); c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 14; c.fillStyle = '#2a2140'; c.beginPath(); c.roundRect(x, top, w, h, 14); c.fill(); c.shadowBlur = 0;
  c.strokeStyle = GOLD; c.lineWidth = 2.5; c.stroke();
  c.font = M.NUMF(20, 700); c.fillStyle = GOLD; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; const y0 = top + (h - 44 - lh * S.cardLines.length) / 2; c.fillText("Fermat's little theorem", x + 14, y0 + 26);
  S.cardLines.forEach((ln, i) => { const m = M.lay(ln, ls), sc = Math.min(1, (w - 24) / m.w); c.save(); c.translate(x + 13, y0 + 52 + i * lh); c.scale(sc, sc); M.draw(c, ln, 0, 0, ls, { t: g.t, col: INK }); c.restore(); });
  c.restore();
}

// a candle-lit study at night: plum walls, a moonlit window, a shelf of old books, a desk with a candle and an open book
function study(c, W, H) {
  const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#3a2440'); wg.addColorStop(0.6, '#2a1a30'); wg.addColorStop(1, '#1e1222'); c.fillStyle = wg; c.fillRect(0, 0, W, H);
  // the window with the moon
  c.fillStyle = '#16203e'; c.fillRect(250, 18, 86, 120); const mg = c.createRadialGradient(300, 60, 4, 300, 60, 60); mg.addColorStop(0, 'rgba(255,246,210,0.5)'); mg.addColorStop(1, 'rgba(255,246,210,0)'); c.fillStyle = mg; c.fillRect(250, 18, 86, 120);
  c.fillStyle = '#fff4d0'; c.beginPath(); c.arc(300, 58, 13, 0, 7); c.fill(); c.fillStyle = '#16203e'; c.beginPath(); c.arc(306, 53, 12, 0, 7); c.fill();
  c.strokeStyle = '#5a3a2a'; c.lineWidth = 6; c.strokeRect(250, 18, 86, 120); c.beginPath(); c.moveTo(293, 18); c.lineTo(293, 138); c.moveTo(250, 78); c.lineTo(336, 78); c.stroke();
  // a shelf of old books at the top left
  c.fillStyle = '#4a2a1c'; c.fillRect(0, 128, 220, 8); const R = P.rng(31); for (let x = 8; x < 210;) { const w = 9 + R() * 9, h = 30 + R() * 22; c.fillStyle = ['#7a2a2a', '#2a4a6a', '#8a6a2a', '#3a5a3a', '#5a2a5a'][Math.floor(R() * 5)]; c.fillRect(x, 128 - h, w, h); c.fillStyle = 'rgba(255,220,150,0.35)'; c.fillRect(x + 2, 128 - h + 6, w - 4, 2); x += w + 2; }
  // the desk
  const dg = c.createLinearGradient(0, 548, 0, H); dg.addColorStop(0, '#6a4026'); dg.addColorStop(1, '#3a2214'); c.fillStyle = dg; c.fillRect(0, 548, W, H - 548); c.fillStyle = 'rgba(255,220,160,0.12)'; c.fillRect(0, 548, W, 3);
  // an open book with scribbled margins, and the candle's stick
  c.fillStyle = '#e8dcc0'; c.beginPath(); c.moveTo(150, 600); c.lineTo(205, 590); c.lineTo(260, 600); c.lineTo(260, 628); c.lineTo(205, 620); c.lineTo(150, 628); c.closePath(); c.fill(); c.strokeStyle = '#8a7a5a'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(205, 590); c.lineTo(205, 620); c.stroke();
  c.strokeStyle = 'rgba(80,60,40,0.5)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(158, 604 + i * 5); c.lineTo(198, 597 + i * 5); c.moveTo(212, 597 + i * 5); c.lineTo(252, 604 + i * 5); c.stroke(); }
  c.fillStyle = '#efe6d0'; c.fillRect(315, 572, 14, 36); c.fillStyle = '#c8a050'; c.beginPath(); c.ellipse(322, 610, 20, 6, 0, 0, 7); c.fill(); c.strokeStyle = '#2a1a10'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(322, 572); c.lineTo(322, 566); c.stroke();
}
