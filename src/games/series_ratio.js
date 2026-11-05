// series_ratio.js — RATIO TEST! Decide whether Σ aₙ converges by finding L = lim |aₙ₊₁ / aₙ|.
// A starship cockpit: the series is on the glass, "aₙ₊₁ / aₙ = ?" under it, and below sits the ratio gauge, green below 1
// ("converges") and red above 1 ("diverges"). A chip "n → ∞" waits beside the gauge. Each move is acted out:
//   1. Drag the term aₙ into the ratio: a copy flies in as the bottom of a division, a second copy becomes aₙ₊₁ (a chalk
//      "+ 1" writes itself after every n), then "÷" turns into "·" and the divisor flips over (top and bottom swap places).
//   2. Tap a power of b: the two powers are circled, "2ⁿ ÷ 2ⁿ⁺¹ = ½" writes itself underneath, both are crossed out and the
//      ratio is rewritten as (n + 1)/n · ½.
//   3. Drag "n → ∞" onto the ratio: the chip becomes the "lim" under the ratio, the gauge needle swings as n runs
//      1, 10, 100, 1000 (n = 1 can even read above 1), "(n + 1)/n → 1" collapses to 1, the line becomes "= ½", the needle
//      settles at ½ and "½ < 1" lights up "converges" (or "2 > 1" lights up "diverges").
// Level 0: n/2ⁿ. Level 1: n/3ⁿ or n/4ⁿ. Level 2: n²/2ⁿ, n²/3ⁿ, or 2ⁿ/n and 3ⁿ/n, which diverge.
// Medium mode: the quotient of the powers and the limit L are picked from the tray.
const M = MK, INK = '#1a2048', TY = 206, WY = 290, GC = { x: 180, y: 532 }, GR = 104, VMAX = 3.5, CHALK = '#d0602a', HX = 332, HY = 622;
const POOL = [[{ p: 1, b: 2, top: 'P' }], [{ p: 1, b: 3, top: 'P' }, { p: 1, b: 4, top: 'P' }], [{ p: 2, b: 2, top: 'P' }, { p: 2, b: 3, top: 'P' }, { p: 1, b: 2, top: 'E' }, { p: 1, b: 3, top: 'E' }]];
const fmt = v => (Math.round(v * 1000) / 1000).toString();
// subscript: a sup whose exponent is pushed below the baseline
const sub = (base, s, size, id) => { const n = M.sup(base, s, id); s.dy = size * 0.62; return n; };
const aSub = (k, size) => sub(M.vr('a'), k ? M.row(M.vr('n'), M.op('+'), M.num(1)) : M.vr('n'), size);
function sigma(c, b, s, col) { const h = s * 1.05, w = s * 0.72, x0 = b.x - w / 2, y0 = b.y - h / 2 + 2; c.save(); c.strokeStyle = col; c.lineWidth = s * 0.09; c.lineJoin = c.lineCap = 'round';
  c.beginPath(); c.moveTo(x0 + w, y0 + h * 0.14); c.lineTo(x0 + w, y0); c.lineTo(x0, y0); c.lineTo(x0 + w * 0.55, y0 + h / 2); c.lineTo(x0, y0 + h); c.lineTo(x0 + w, y0 + h); c.lineTo(x0 + w, y0 + h * 0.86); c.stroke();
  c.lineWidth = 2.4; const iy = y0 - 12, r = 5.5; c.beginPath(); c.ellipse(b.x - r, iy, r, r * 0.75, 0, 0, 7); c.moveTo(b.x + 2 * r, iy); c.ellipse(b.x + r, iy, r, r * 0.75, 0, 0, 7); c.stroke();
  c.fillStyle = col; c.textAlign = 'center'; c.font = M.VARF(18); c.fillText('n', b.x - 14, y0 + h + 19); c.font = M.NUMF(18); c.fillText('= 1', b.x + 8, y0 + h + 19); c.restore(); }
const ang = v => Math.PI + Math.min(v, VMAX) / VMAX * Math.PI;

MG.add({
  id: 'series_ratio', stage: 'series', cmd: 'RATIO TEST!', hint: 'drag', time: 10, mood: 'night', winText: 'Tested!', hold: 1.8,
  card: {
    title: 'The ratio test', ref: 'Calculus', kind: 'Series',
    text: 'Does an endless sum a₁ + a₂ + a₃ + ... add up to a finite number? The ratio test compares each term with the one before it.\n\nWork out the ratio aₙ₊₁ / aₙ and see what it approaches as n gets huge. Call that limit L. If L < 1, the terms eventually shrink by about the same factor each time, like a geometric series, so the sum converges. If L > 1, the terms grow, so the sum diverges. If L = 1, the test cannot tell.\n\nFor Σ n/2ⁿ the ratio is (n + 1)/n · ½. As n grows, (n + 1)/n gets close to 1, so L = ½ < 1, and the series converges.',
    note: 'L = lim |aₙ₊₁ / aₙ|. If L < 1 the series converges; if L > 1 it diverges; if L = 1 the test says nothing.',
    ask: 'Use the ratio test on Σ n/5ⁿ. What about Σ 4ⁿ/n?',
  },

  init(g) {
    const S = g.s; M.setup(g); const P = POOL[g.level][Math.floor(g.rand() * POOL[g.level].length)], T = M.pace(g), { p, b } = P, pt = P.top === 'P';
    Object.assign(S, P, { L: pt ? 1 / b : b }); S.needle = { v: 0, from: 0, to: 0, t0: 0, dur: 1 };
    const Pn = () => p === 1 ? M.vr('n') : M.sup(M.vr('n'), M.num(2)), En = () => M.sup(M.num(b), M.vr('n'));
    S.term = pt ? M.frac(Pn(), En(), 'term') : M.frac(En(), Pn(), 'term');
    S.top = M.row({ ...M.gap(40), id: 'sig' }, M.gap(10), S.term);
    S.lhs = M.frac(aSub(1, 30), aSub(0, 30), 'lhs'); S.rs = M.slot('rs', { w: 64, col: '#7080b0' });
    S.work = M.row(S.lhs, M.op('=', 'eq'), S.rs);
    S.placeT = () => M.place(g, 'top', S.top, 180, TY, 38, { col: INK }); S.wsz = 34; S.placeW = () => M.place(g, 'work', S.work, 180, WY, S.wsz, { col: INK });
    S.placeT(); S.placeW();
    S.chip = M.row(M.vr('n'), M.txt('→'), M.txt('∞')); S.chip.id = 'chip'; M.place(g, 'chip', S.chip, 296, 432, 28, { col: '#fff4d0' });
    M.inert(g, ['sig', 'lhs', 'eq', 'dv', 'mul', 'q', 'cst', 'lim', 'one', 'res']);
    g.dur *= (2.6 + 1.05 * 3.4) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const swing = (g, v, dur) => { const N = S.needle; N.from = N.v; N.to = v; N.t0 = g.t; N.dur = dur; };

    M.play(g, {
      moves(g) {
        const out = [];
        // 1. build the ratio aₙ₊₁ / aₙ from the term
        if (!S.built) out.push({ drag: 'term', to: 'rs', area: [20, WY - 50, 340, WY + 40], busy: 0.1,
          then(g) { S.built = true; S.point = true; hop(g, 'wow'); M.show(g, 1.55 * T); M.circle(g, 'term', { dur: 0.45 * T });
            // fresh nodes: polynomial and power, for aₙ₊₁ (k = 1) and aₙ (k = 0)
            const mk = k => { const nP = M.vr('n'), nE = M.vr('n'), Pk = p === 1 ? nP : M.sup(nP, M.num(2)), Ek = M.sup(M.num(b), nE, 'e' + k); return { nP, nE, Pk, Ek }; };
            const A = [mk(0), mk(1)]; S.A = A;
            S.f0 = pt ? M.frac(A[0].Pk, A[0].Ek, 'f0') : M.frac(A[0].Ek, A[0].Pk, 'f0'); S.f1 = pt ? M.frac(A[1].Pk, A[1].Ek, 'f1') : M.frac(A[1].Ek, A[1].Pk, 'f1');
            M.fly(g, { node: M.wrap({ ...S.term, id: undefined }), from: 'term', to: 'rs', dur: 0.4 * T, arc: -20, s0: 38, s1: 34, col: INK,
              then(g) { S.dv = M.op('÷', 'dv', { _born: -1 }); for (const f of [S.f0, S.f1]) f._born = -1;
                S.work.items = [S.lhs, S.work.items[1], S.f1, S.dv, S.f0]; S.placeW(); g.sfx('pop'); hop(g); } });
            // n becomes n + 1 in the first copy: a chalk "+ 1" writes itself after each n
            M.at(g, [[0.6 * T, g => { const a = A[1], plus = () => [M.op('+', null, { col: CHALK }), M.num(1, null, { col: CHALK })];
                const rP = M.row(a.nP, ...plus()); if (p === 1) { if (pt) S.f1.n = rP; else S.f1.d = rP; a.Pk = rP; } else a.Pk.base = M.paren(rP);
                a.Ek.exp = M.row(a.nE, ...plus()); S.placeW(); M.indicate(g, S.f1, { delay: 0.1 * T, dur: 0.35 * T, sc: 1.1 }); g.sfx('tap'); }],
              // dividing by a fraction is multiplying by its flip: ÷ becomes · and the divisor turns over
              [1.05 * T, g => { const mul = M.op('·', 'mul'); S.work.items[3] = mul; const f = S.f0, nn = f.n; f.n = f.d; f.d = nn; S.placeW(); g.sfx('swoosh'); hop(g, 'happy');
                M.indicate(g, f, { delay: 0.1 * T, dur: 0.35 * T, sc: 1.15 }); }],
              [1.5 * T, g => { S.point = false; }]]); } });
        // 2. cancel the powers of b
        else if (!S.cancel) out.push({ tap: ['e1', 'e0'], busy: 0.1, askAt: 0.75 * T, after: 1.0 * T,
          ask: { v: pt ? M.frac(M.num(1), M.num(b)) : b, wrong: pt ? [b, M.frac(M.num(1), M.num(b + 1)), M.frac(M.num(1), M.sup(M.num(b), M.vr('n')))] : [M.frac(M.num(1), M.num(b)), b + 1, M.sup(M.num(b), M.vr('n'))] },
          then(g) { S.cancel = true; S.point = true; hop(g, 'think'); M.show(g, 0.75 * T); M.circle(g, ['e1', 'e0'], { dur: 0.5 * T, col: '#ffb21f' }); M.light(g, 'e1'); M.light(g, 'e0');
            S.q = M.slot('q', { w: 30, col: '#7080b0' });
            const E = k => M.sup(M.num(b), k ? M.row(M.vr('n'), M.op('+'), M.num(1)) : M.vr('n'));
            S.qn = M.row(pt ? E(0) : E(1), M.op('÷'), pt ? E(1) : E(0), M.op('='), S.q); M.place(g, 'qn', S.qn, 180, WY + 58, 26, { col: CHALK }); M.writeIn(g, S.qn, { dur: 0.45 * T, delay: 0.1 * T }); },
          resolve(g) { const cv = () => pt ? M.frac(M.num(1), M.num(b)) : M.num(b); S.q.fill = cv(); S.q.fill.id = 'qv'; M.place(g, 'qn', S.qn, 180, WY + 58, 26, { col: CHALK }); M.writeIn(g, S.q.fill, { dur: 0.2 * T }); g.sfx('ding');
            M.strike(g, 'e1', { delay: 0.15 * T }); M.strike(g, 'e0', { delay: 0.25 * T });
            M.at(g, [[0.5 * T, g => { const A = S.A; S.cst = cv(); S.cst.id = 'cst'; S.cst.alpha = 0;
                S.pf = pt ? M.frac(A[1].Pk, A[0].Pk, 'pf') : M.frac(A[0].Pk, A[1].Pk, 'pf'); for (const q of [A[0].Ek, A[1].Ek]) { q.alpha = 0; q.hl = 0; }
                S.work.items = [S.lhs, S.work.items[1], S.pf, M.op('·', 'mul2'), S.cst]; S.placeW(); hop(g);
                M.fly(g, { node: cv(), from: 'qv', to: 'cst', dur: 0.32 * T, arc: 30, s0: 26, s1: 34, col: CHALK, then(g) { S.cst.alpha = 1; S.cst.pop = g.t; M.sparkle(g, 'cst', { n: 8 }); } });
                M.tween(g, S.qn, { alpha: 0 }, 0.25 * T, { delay: 0.1 * T }); }],
              [0.95 * T, g => { delete g.s.mk.ex.qn; S.point = false; }]]); M.show(g, 1.0 * T); } });
        // 3. let n run off to infinity
        else if (!S.lim) out.push({ drag: 'chip', to: 'pf', area: [20, WY - 60, 340, WY + 50], busy: 0.1, askAt: 2.3 * T, after: 1.1 * T,
          ask: { v: pt ? M.frac(M.num(1), M.num(b)) : b, wrong: [1, 0, pt ? b : M.frac(M.num(1), M.num(b)), pt ? M.frac(M.num(p + 1), M.num(b)) : b + 1] },
          then(g) { S.lim = true; S.point = true; hop(g, 'wow'); M.show(g, 2.3 * T); S.chipOn = true;
            // the chip becomes the "n → ∞" under lim
            const lw = M.frac(M.txt('lim', 'limt'), M.row(M.vr('n'), M.txt('→'), M.txt('∞')), 'lim', { bar: { t0: 1e9, dur: 1 }, alpha: 0, dy: 13 });
            S.work.items.unshift(lw); S.wsz = 31; S.placeW(); M.tween(g, S.chip, { alpha: 0 }, 0.15 * T);
            M.fly(g, { node: M.row(M.vr('n'), M.txt('→'), M.txt('∞')), from: 'chip', to: 'lim', dur: 0.36 * T, arc: -30, s0: 28, s1: 26, col: INK, then(g) { lw.alpha = 1; lw.pop = g.t; g.sfx('tap'); } });
            // the needle swings as n runs 1, 10, 100, 1000
            const r = n => pt ? Math.pow((n + 1) / n, p) / b : b * n / (n + 1), ns = [1, 10, 100, 1000];
            M.at(g, ns.map((n, k) => [0.45 * T + k * 0.3 * T, g => { S.samp = { n, r: r(n), t: g.t }; swing(g, r(n), 0.26 * T); g.sfx('tap', { p: 1 + k * 0.1 }); M.indicate(g, 'pf', { dur: 0.22 * T, sc: 1.08 }); }]));
            // (n + 1)/n → 1
            const t1 = 0.45 * T + 4 * 0.3 * T;
            M.at(g, [[t1, g => { M.note(g, { node: M.row(M.txt('→'), M.num(1)), at: 'pf', off: [0, 56], s: 26, col: CHALK, write: 0.18 * T, hold: 0.06 * T, fly: 0.24 * T, to: 'pf', arc: 10,
                then(g) { const one = M.num(1, 'one', { _born: -1, pop: g.t }); const it = S.work.items; it[it.indexOf(S.pf)] = one; S.placeW(); g.sfx('pop'); hop(g, 'happy'); } }); }]]);
            S.swing = swing; },
          resolve(g) { const it = S.work.items, one = M.node(g, 'one'), mul = it[it.indexOf(one) + 1], bc = M.box(g, 'cst');
            for (const q of [one, mul]) { const bq = M.box(g, q.id || ''); if (bq && bc) M.tween(g, q, { dx: bc.x - bq.x, alpha: 0, sc: 0.6 }, 0.22 * T); else M.tween(g, q, { alpha: 0 }, 0.22 * T); }
            M.at(g, [[0.25 * T, g => { S.work.items = it.filter(q => q !== one && q !== mul); S.cst.id = 'res'; S.cst.col = S.L < 1 ? '#1a8a4a' : '#c0302a'; S.placeW(); S.cst.pop = g.t; g.sfx('ding'); swing(g, S.L, 0.3 * T); S.samp = null; }],
              [0.55 * T, g => { S.verdict = g.t; g.sfx(S.L < 1 ? 'coin' : 'boing'); hop(g, 'laugh');
                M.note(g, { node: M.row(pt ? M.frac(M.num(1), M.num(b)) : M.num(b), M.op(S.L < 1 ? '<' : '>'), M.num(1)), at: [GC.x, GC.y - 52], s: 28, col: S.L < 1 ? '#8af0a0' : '#ff9a8a', write: 0.2 * T, hold: 0.9 * T, fade: 0.3 * T, pill: true });
                M.sparkle(g, [GC.x + (S.L < 1 ? -70 : 70), GC.y + 30], { n: 14, cols: S.L < 1 ? ['#8af0a0', '#fff'] : ['#ff9a8a', '#fff'] }); }],
              [1.05 * T, g => { S.point = false; }]]); M.show(g, 1.1 * T); } });
        return out;
      },
      area(g) { return !S.built ? ['term', 'rs'] : !S.cancel ? ['e1', 'e0'] : ['chip', 'pf']; },
    });
  },
  update(g, dt) { M.update(g, dt); const N = g.s.needle; if (N) { const k = M.easeIO((g.t - N.t0) / N.dur); N.v = M.lerp(N.from, N.to, k); } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.bg(g, c, 'space');
    SCN.panel(c, 'glass', 180, 262, 340, 204, t);
    // the cockpit console with the ratio gauge
    c.drawImage(g.bake('rt_console', (cc, W, H) => {
      cc.fillStyle = 'rgba(0,0,10,0.35)'; cc.beginPath(); cc.roundRect(16, 384, 328, 200, 26); cc.fill();
      const gr = cc.createLinearGradient(0, 378, 0, 580); gr.addColorStop(0, '#3a4470'); gr.addColorStop(1, '#1c2244'); cc.fillStyle = gr; cc.beginPath(); cc.roundRect(14, 378, 332, 200, 26); cc.fill();
      cc.strokeStyle = '#8a98c8'; cc.lineWidth = 3; cc.stroke();
      for (const [x, y, col] of [[36, 400, '#ff7a6a'], [54, 400, '#ffd45a'], [72, 400, '#7ae0a0']]) { cc.fillStyle = col; cc.beginPath(); cc.arc(x, y, 5, 0, 7); cc.fill(); }
    }), 0, 0, 360, 640);
    // the dial: green below 1, red above
    c.save(); c.lineWidth = 18; c.lineCap = 'butt';
    c.strokeStyle = '#2f9a5a'; c.beginPath(); c.arc(GC.x, GC.y, GR, ang(0), ang(1)); c.stroke();
    c.strokeStyle = '#c84a3a'; c.beginPath(); c.arc(GC.x, GC.y, GR, ang(1), ang(VMAX)); c.stroke();
    const vk = S.verdict != null ? Math.min(1, (t - S.verdict) / (0.3 * M.pace(g))) : 0;
    if (vk > 0) { c.strokeStyle = S.L < 1 ? '#8af0a0' : '#ff9a8a'; c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 6); c.shadowColor = c.strokeStyle; c.shadowBlur = 18; c.beginPath(); c.arc(GC.x, GC.y, GR, S.L < 1 ? ang(0) : ang(1), S.L < 1 ? ang(1) : ang(VMAX)); c.stroke(); c.globalAlpha = 1; c.shadowBlur = 0; }
    c.fillStyle = '#eef2ff'; c.font = M.NUMF(18); c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let v = 0; v <= 3; v++) { const a = ang(v); c.fillText(String(v), GC.x + Math.cos(a) * (GR - 26), GC.y + Math.sin(a) * (GR - 26) + 2);
      c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(GC.x + Math.cos(a) * (GR - 10), GC.y + Math.sin(a) * (GR - 10)); c.lineTo(GC.x + Math.cos(a) * (GR + 10), GC.y + Math.sin(a) * (GR + 10)); c.stroke(); }
    // the zone names
    c.font = M.NUMF(18, 700); for (const [L, x, col] of [[1, GC.x - 80, '#8af0a0'], [0, GC.x + 80, '#ff9a8a']]) { const on = vk > 0 && (S.L < 1) === !!L;
      c.save(); c.fillStyle = col; c.globalAlpha = on ? 1 : 0.75; if (on) { c.shadowColor = col; c.shadowBlur = 14; c.font = M.NUMF(20, 700); } c.fillText(L ? 'converges' : 'diverges', x, GC.y + 24); c.restore(); }
    // the needle
    const a = ang(S.needle.v) + (S.needle.to === 0 && !S.lim ? Math.sin(t * 2) * 0.02 : 0);
    c.strokeStyle = '#ffe08a'; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = '#ffe08a'; c.shadowBlur = 10; c.beginPath(); c.moveTo(GC.x, GC.y); c.lineTo(GC.x + Math.cos(a) * (GR - 6), GC.y + Math.sin(a) * (GR - 6)); c.stroke(); c.shadowBlur = 0;
    c.fillStyle = '#c8d0f0'; c.beginPath(); c.arc(GC.x, GC.y, 9, 0, 7); c.fill();
    // the readout while n runs
    if (S.samp) { c.fillStyle = '#fff4d0'; c.font = M.NUMF(20); c.textAlign = 'center'; c.textAlign = 'left'; c.fillText(`n = ${S.samp.n}`, 32, 418); c.fillStyle = '#ffe08a'; c.textAlign = 'right'; c.fillText(`ratio ≈ ${fmt(S.samp.r)}`, 330, 418); }
    c.restore();
    // the chip "n → ∞" in its socket
    if (!S.chipOn) { const bx = M.box(g, 'chip'); if (bx) { c.save(); c.fillStyle = '#4a3a8a'; c.strokeStyle = '#c8b8ff'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(bx.x - bx.w / 2 - 10, bx.y - bx.h / 2 - 7, bx.w + 20, bx.h + 14, 14); c.fill(); c.stroke(); c.restore(); } }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work'); M.drawEx(g, c, 'qn'); M.drawEx(g, c, 'chip');
    const sb = M.box(g, 'sig'); if (sb) sigma(c, sb, 40, INK);
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', HX, HY - hopK * 20, 0.85, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'penguin', HX, HY, 0.95);
    M.drawUI(g, c);
  },
});
