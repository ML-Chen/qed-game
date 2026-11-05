// powers_addexp.js — ADD EXPONENTS! Multiplying powers with the same base: xᵃ · xᵇ = xᵃ⁺ᵇ.
// The player drags one exponent onto the other power. The working then plays by itself (show your work): both powers
// open up into their factors (x³ · x⁴ becomes x x x · x x x x), each exponent drops down under its group as a count,
// the groups slide together, the counts join into 3 + 4, and everything folds back into one power, x^(3 + 4).
// Tapping 3 + 4 adds it by counting on: the 3 rolls up 4, 5, 6, 7 while the 4 rolls down to 0, one unit at a time.
// Level 0: x³ · x⁴. Level 1: numbers in front too (2x³ · 5x⁴): drag 2 onto 5 to make (2 · 5), tap it to multiply.
// Level 2: three powers of x, or a number base (2³ · 2⁵). Medium mode: each tap on a sum or a product opens the tray.
const M = MK, INK = SCN.ink('chalk'), EXP = '#ffd970', CNT = '#9ae07a', HX = 292, HY = 588, LS = 30;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), ex = () => 2 + r(4);
  if (L === 0) return { base: 'x', exps: [ex(), ex()] };
  if (L === 1) return { base: 'x', exps: [ex(), ex()], coefs: [2 + r(4), 2 + r(4)] };
  if (g.rand() < 0.5) return { base: 'x', exps: [ex(), ex(), 2 + r(3)] };
  return { base: String(2 + r(2)), exps: [ex(), 2 + r(5)] };
}
const sum = a => a.reduce((p, q) => p + q, 0);
// the rabbit hops and pulls a face on each beat, points at the board while the work is shown
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c) {
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && g.t - mk.missAt < 0.7;
  const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', HX, HY - hk * 24, 1.4, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, 'rabbit', HX, HY, 1.4);
}
// nodes are made once and reused, so symbols glide when the expression is rewritten
const baseNode = (S, id) => S.base === 'x' ? M.vr('x', id) : M.num(S.base, id);
function expNode(f) {
  if (f.exps.length > 1) { const r = M.row(...f.exps.flatMap((e, i) => [i ? M.op('+', null, { col: EXP }) : null, M.num(e, null, { col: EXP })])); r.id = 's' + f.u; return r; }
  return M.num(f.exps[0], 'e' + f.u, { col: EXP });
}
const leaves = n => n.items ? n.items : [n];
function build(g) {
  const S = g.s, X = S.xp && !S.xp.done ? S.xp : null, unit = f => M.sup(f.bn, f.en);
  const units = X ? S.f.filter(f => f !== X.B).map(f => f === X.A ? M.row(...X.grp[0], M.gap(X.gap), X.dot, M.gap(X.gap), ...X.grp[1]) : unit(f)) : S.f.map(unit);
  const pw = units.flatMap((n, i) => i ? [S.dots[i - 1], n] : [n]);
  let items;
  if (S.coef === 'sep') items = [S.c0, pw[0], S.dots[0], S.c1, pw[2]];
  else { const cn = S.coef === 'prod' ? S.cm : S.coef === 'done' ? S.cv : null; items = [cn, cn ? M.gap(6) : null, ...pw]; }
  S.root.items = items.filter(Boolean);
  M.place(g, 'ex', S.root, 180, 312, S.size, { col: INK });
  return Math.min(1, 316 / M.lay(S.root, S.size).w); // the scale that fits the board
}
// a box as drawn, with the whole expression scaled about its centre (it shrinks while the factors are written out)
function tf(g, b) { const S = g.s, r = M.box(g, 'root'), k = S.root.sc ?? 1; if (!b || !r || k === 1) return b; return { x: 180 + (b.x - 180) * k, y: r.y + (b.y - r.y) * k, w: b.w * k, h: b.h * k, s: (b.s || 40) * k }; }
function brace(c, x0, x1, y, d) {
  const m = (x0 + x1) / 2, r = Math.min(d, (x1 - x0) / 4); c.beginPath(); c.moveTo(x0, y); c.quadraticCurveTo(x0, y + d, x0 + r, y + d); c.lineTo(m - r, y + d);
  c.quadraticCurveTo(m, y + d, m, y + d * 2); c.quadraticCurveTo(m, y + d, m + r, y + d); c.lineTo(x1 - r, y + d); c.quadraticCurveTo(x1, y + d, x1, y); c.stroke();
}
const drawAt = (g, c, n, x, y, s, col) => { const m = M.lay(n, s); M.draw(c, n, x - m.w / 2, y + (m.a - m.d) / 2, s, { t: g.t, col }); };
// the expanded working: braces under the groups of factors, the counts under them, joining into a + b
function drawWork(g, c) {
  const S = g.s, X = S.xp; if (!X) return;
  const gb = X.fac.map(list => tf(g, M.unionBox(list.map(n => M.box(g, n.id)))));
  if (!gb[0] || !gb[1]) return;
  const mk = X.mergeT != null ? M.easeIO((g.t - X.mergeT) / X.mergeD) : 0, U = M.unionBox(gb);
  const by = Math.max(gb[0].y + gb[0].h / 2, gb[1].y + gb[1].h / 2) + 6, ly = by + 16 + LS * 0.62;
  const ws = X.lab.map(l => M.lay(l.node, LS).w), wp = M.lay(X.plus, LS).w, tot = ws[0] + wp + ws[1], x0 = U.x - tot / 2;
  const merged = [x0 + ws[0] / 2, x0 + ws[0] + wp + ws[1] / 2];
  const ba = X.braceT != null ? M.clamp((g.t - X.braceT) / 0.25, 0, 1) * (X.outT != null ? 1 - M.clamp((g.t - X.outT) / 0.2, 0, 1) : 1) : 0;
  if (ba > 0) { c.save(); c.globalAlpha *= ba; c.strokeStyle = CNT; c.lineWidth = 3; c.lineCap = 'round'; c.shadowColor = CNT; c.shadowBlur = 6;
    if (mk < 1) for (const b of gb) { c.globalAlpha = ba * (1 - mk); brace(c, b.x - b.w / 2 + 2, b.x + b.w / 2 - 2, by, 7); }
    if (mk > 0) { c.globalAlpha = ba * mk; brace(c, U.x - U.w / 2 + 2, U.x + U.w / 2 - 2, by, 7); } c.restore(); }
  if (X.flyT != null) { // the joined count flies up into the new exponent
    const k = M.easeIO((g.t - X.flyT) / X.flyD), tb = M.box(g, 's' + X.A.u); if (!tb || k >= 1) return;
    const x = M.lerp(U.x, tb.x, k), y = M.lerp(ly, tb.y, k) - Math.sin(k * Math.PI) * 30, s = M.lerp(LS, tb.s || LS, k);
    c.save(); c.shadowColor = 'rgba(255,210,80,0.9)'; c.shadowBlur = 12; drawAt(g, c, X.mrow, x, y, s, EXP); c.restore(); return;
  }
  X.lab.forEach((l, i) => { // each exponent drops down under its group, then the two slide together
    const k = M.easeIO((g.t - l.t0) / l.dur); if (k <= 0) return; const tx = M.lerp(gb[i].x, merged[i], mk);
    const x = M.lerp(l.from.x, tx, k) + Math.sin(k * Math.PI) * (i ? 22 : -22), y = M.lerp(l.from.y, ly, k), s = M.lerp(l.from.s, LS, k);
    c.save(); if (k < 1) { c.shadowColor = 'rgba(255,210,80,0.9)'; c.shadowBlur = 12; } drawAt(g, c, l.node, x, y, s, EXP); c.restore();
  });
  if (mk > 0) { c.save(); c.globalAlpha *= mk; drawAt(g, c, X.plus, merged[0] + ws[0] / 2 + wp / 2, ly, LS, CNT); c.restore(); }
}

MG.add({
  id: 'addexp', stage: 'powers', cmd: 'ADD EXPONENTS!', hint: 'drag', time: 8, mood: 'bright', winText: 'Added!', hold: 1.4,
  card: {
    title: 'Multiplying powers', ref: 'Grade 8', kind: 'Exponents',
    text: 'A power is a short way to write a repeated multiplication. In x³, x is the base and the small raised 3 is the exponent. The exponent says how many copies of the base are multiplied, so x³ means x · x · x.\n\nTo multiply two powers with the same base, keep the base and add the exponents. For example, x³ · x⁴ = x³⁺⁴ = x⁷.\n\nThis works because x³ · x⁴ is (x · x · x) · (x · x · x · x). That is 7 copies of x multiplied together, which is x⁷.\n\nNumbers in front are multiplied on their own: 2x³ · 5x⁴ = (2 · 5)x³⁺⁴ = 10x⁷.',
    note: 'To multiply powers with the same base, keep the base and add the exponents: xᵃ · xᵇ = xᵃ⁺ᵇ.',
    ask: 'What is x² · x⁵? What is 3x² · 4x³?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = gen(g);
    S.base = p.base; S.f = p.exps.map((e, i) => { const f = { u: i, exps: [e] }; f.bn = baseNode(S, 'b' + i); f.en = expNode(f); return f; });
    S.dots = S.f.slice(1).map((_, i) => M.op('·', 'dot' + (i + 1)));
    S.coefs = p.coefs || null; S.coef = p.coefs ? 'sep' : null; S.size = S.f.length > 2 || S.coefs ? 56 : 66;
    if (S.coefs) { S.coefV = S.coefs[0] * S.coefs[1]; S.c0 = M.num(S.coefs[0], 'c0'); S.c1 = M.num(S.coefs[1], 'c1'); S.cdot = M.op('·'); }
    S.root = M.row(); S.root.id = 'root';
    build(g); M.inert(g, ['dot1', 'dot2', 'root']);
    const nMoves = 2 * (S.f.length - 1) + (S.coefs ? 2 : 0); g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const eid = f => f.exps.length > 1 ? 's' + f.u : 'e' + f.u;
    const burst = (id, cols) => { const b = tf(g, M.box(g, id)); if (b) g.burst(b.x, b.y, cols || ['#ffd970', '#fff', '#9ae07a'], 10, 120); };
    // writing the powers together gathers the numbers in front into (2 · 5)
    const gather = g => { if (S.coef !== 'sep') return; S.coef = 'prod'; S.c0.id = S.c1.id = undefined; S.cm = M.paren(M.row(S.c0, S.cdot, S.c1), 'cm'); };
    M.play(g, {
      moves(g) {
        const out = [], T = M.pace(g);
        // drag one power's exponent onto another power (its exponent or its base): the powers open up and join, x^(a + b)
        for (const f of S.f) {
          const others = S.f.filter(q => q !== f); if (!others.length) break;
          out.push({ drag: eid(f), to: others.flatMap(q => [eid(q), 'b' + q.u]), busy: 0.1, then(g, a, b) {
            const q = S.f.find(o => o.u === +b.slice(1)), [A, B] = S.f.indexOf(f) < S.f.indexOf(q) ? [f, q] : [q, f];
            M.show(g, 1.8 * T); g.sfx('pop'); hop(g, 'think');
            M.indicate(g, A.en, { dur: 0.3 * T }); M.indicate(g, B.en, { dur: 0.3 * T, delay: 0.05 * T });
            if (S.coef === 'sep') { gather(g); build(g); }
            M.at(g, [
              [0.15 * T, g => { // each power opens up into its factors: x³ becomes x x x
                const from = [A, B].map(h => { const bx = M.box(g, h.en.id); return { x: bx.x, y: bx.y, s: bx.s }; });
                const X = S.xp = { A, B, gap: 16, dot: S.dots[S.dots.length - 1], fac: [], grp: [], plus: M.op('+'), braceT: g.t + 0.25 * T };
                let k = 0; [A, B].forEach((h, gi) => {
                  const n = sum(h.exps), fac = [h.bn], grp = [h.bn];
                  for (let i = 1; i < n; i++) { const born = g.t + (0.04 + 0.05 * k++) * T, x = baseNode(S, 'g' + gi + '_' + i); x._born = born;
                    grp.push(S.base === 'x' ? M.gap(4) : M.op('·', null, { _born: born })); grp.push(x); fac.push(x); }
                  X.fac.push(fac); X.grp.push(grp);
                  for (const l of leaves(h.en)) l.alpha = 0; // the exponent leaves the power and drops down as the count
                });
                X.lab = [A, B].map((h, i) => ({ node: M.row(...h.exps.flatMap((e, j) => [j ? M.op('+') : null, M.num(e)])), from: from[i], t0: g.t, dur: 0.4 * T }));
                X.mrow = M.row(...[...A.exps, ...B.exps].flatMap((e, j) => [j ? M.op('+') : null, M.num(e)]));
                const fit = build(g); M.tween(g, S.root, { sc: fit }, 0.3 * T); g.sfx('swoosh');
              }],
              [0.6 * T, g => { g.sfx('tap'); hop(g, 'wow'); }],
              [0.75 * T, g => { // the groups slide together and the counts join: 3 + 4
                const X = S.xp; X.gap = 2; X.mergeT = g.t; X.mergeD = 0.35 * T; const fit = build(g); M.tween(g, S.root, { sc: fit }, 0.32 * T); g.sfx('swoosh'); hop(g, 'happy'); }],
              [1.2 * T, g => { // everything folds back into one power
                const X = S.xp, home = M.box(g, A.bn.id); X.outT = g.t;
                for (const n of [...X.fac[0].slice(1), ...X.fac[1], ...X.grp.flat().filter(q => q.k === 'op'), X.dot]) { const b = M.box(g, n.id); M.tween(g, n, { dx: b && home ? home.x - b.x : 0, alpha: 0, sc: 0.6 }, 0.25 * T); }
                M.tween(g, S.root, { sc: 1 }, 0.3 * T);
              }],
              [1.45 * T, g => {
                const X = S.xp; X.done = true; A.exps = A.exps.concat(B.exps); S.f.splice(S.f.indexOf(B), 1); S.dots.pop();
                A.en = expNode(A); for (const l of leaves(A.en)) l.alpha = 0; build(g); X.flyT = g.t; X.flyD = 0.3 * T;
              }],
              [1.75 * T, g => { for (const l of leaves(A.en)) { l.alpha = 1; } A.en.pop = g.t; S.xp = null; burst(A.en.id); g.sfx('ding'); hop(g, 'laugh'); }],
            ]);
          } });
        }
        // the numbers in front: drag one onto the other to write (2 · 5)
        if (S.coef === 'sep') for (const [a, b] of [['c0', 'c1'], ['c1', 'c0']]) out.push({ drag: a, to: b, busy: 0.1, then(g) { M.show(g, 0.5 * T); gather(g); build(g); g.sfx('swoosh'); M.sparkle(g, 'cm', { delay: 0.3 * T, n: 8 }); M.at(g, [[0.3 * T, g => hop(g, 'happy')]]); } });
        // tap a written-out sum to add it by counting on: one unit at a time moves from the last number to the first
        for (const f of S.f) if (f.exps.length > 1) {
          const v = sum(f.exps), pr = f.exps.reduce((p, q) => p * q, 1), nt = v - f.exps[0], len = nt * M.clamp(1.0 / nt, 0.08, 0.17) * T + 0.62 * T;
          out.push({ tap: 's' + f.u, busy: 0.1, askAt: 0.45 * T, after: len, ask: { v, wrong: [pr, v + 1, v - 1, f.exps[0]] },
            then(g) { M.show(g, 0.45 * T); M.circle(g, 's' + f.u, { dur: 0.5 * T, col: CNT }); hop(g, 'think');
              f.en.items.filter(q => q.k === 'num').forEach((q, i) => M.indicate(g, q, { delay: i * 0.12 * T, dur: 0.3 * T, sc: 1.25 })); },
            resolve(g) {
              const row = f.en, nums = row.items.filter(q => q.k === 'num'), first = nums[0], ticks = v - +first.v, dt = M.clamp(1.0 / ticks, 0.08, 0.17) * T;
              const xOf = q => { const b = M.box(g, row.id), m = row._m; if (!b || !m) return null; let x = b.x - b.w / 2; for (let i = 0; i < row.items.length; i++) { if (row.items[i] === q) return { x: x + m.ms[i].w / 2, y: b.y, s: b.s }; x += m.ms[i].w; } return null; };
              let cur = +first.v, t = 0.05 * T; const beats = [];
              for (const q of nums.slice(1)) { let left = +q.v; while (left > 0) { left--; cur++; const lv = left, cv = cur;
                beats.push([t, g => { const a = xOf(q), b = xOf(first); M.roll(g, q, lv, { dur: dt * 0.85 }); M.roll(g, first, cv, { dur: dt * 0.85 }); g.sfx('tap');
                  if (a && b) M.anim(g, { dur: dt, draw(c, g, k) { const e = M.easeIO(k); c.fillStyle = CNT; c.shadowColor = CNT; c.shadowBlur = 8; c.beginPath(); c.arc(M.lerp(a.x, b.x, e), M.lerp(a.y, b.y, e) - Math.sin(e * Math.PI) * 18, 4, 0, 7); c.fill(); } });
                  if (lv === 0) M.indicate(g, first, { dur: 0.25 * T, sc: 1.2, col: CNT }); }]); t += dt; } }
              t += 0.12 * T;
              beats.push([t, g => { const b0 = xOf(first); for (const q of row.items) if (q !== first) { const b = xOf(q); M.tween(g, q, { alpha: 0, sc: 0.5, dx: b && b0 ? b0.x - b.x : 0 }, 0.22 * T); } }]);
              beats.push([t + 0.26 * T, g => { f.exps = [v]; first.id = 'e' + f.u; f.en = first; build(g); first.pop = g.t; burst('e' + f.u); g.sfx('coin'); hop(g, 'laugh'); }]);
              M.show(g, t + 0.5 * T); M.at(g, beats);
            } });
        }
        // tap (2 · 5) to multiply the numbers in front
        if (S.coef === 'prod') out.push({ tap: 'cm', busy: 0.1, askAt: 0.45 * T, after: 0.85 * T, ask: { v: S.coefV, wrong: [S.coefs[0] + S.coefs[1], S.coefV + S.coefs[0], S.coefV - 1] },
          then(g) { M.show(g, 0.45 * T); M.circle(g, 'cm', { dur: 0.5 * T, col: CNT }); M.indicate(g, S.c0, { dur: 0.3 * T }); M.indicate(g, S.c1, { dur: 0.3 * T, delay: 0.14 * T }); hop(g, 'think'); },
          resolve(g) { M.show(g, 0.85 * T);
            M.note(g, { node: M.row(M.num(S.coefs[0]), M.op('·'), M.num(S.coefs[1]), M.op('='), M.num(S.coefV)), at: 'cm', off: [10, -58], s: 28, col: CNT, write: 0.3 * T, hold: 0.3 * T, fade: 0.2 * T });
            M.at(g, [[0.4 * T, g => { S.coef = 'done'; S.cv = M.num(S.coefV, 'cv'); build(g); S.cv.pop = g.t; burst('cv'); g.sfx('coin'); hop(g, 'laugh'); }]]); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    SCN.std(g, c, { scene: 'meadow', panel: 'chalk' }); host(g, c);
    M.drawEx(g, c, 'ex'); drawWork(g, c); M.drawUI(g, c);
  },
});
