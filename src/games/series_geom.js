// series_geom.js — GEOMETRIC SERIES! Sum Σ a·rⁿ from n = 0 to ∞ with a / (1 − r), and watch a square quilt fill up.
// A snowy morning: the series is written on a slab of ice, the formula a / (1 − r) under it, and below lies an empty
// quilt frame that stands for the whole sum. The player drags the first term a onto the a of the formula and the
// ratio r onto its r, in either order, then taps the formula to work it out. Each move is acted out (show your work):
//   a: the 3 is circled, flies down into the formula, and the first patch (worth 3) is sewn into the quilt.
//   r: the (½) flies into 1 − r, a "× ½" note writes itself by the quilt and each next patch, r times the last, is sewn
//      into what is left (3/2, 3/4, ...), smaller and smaller; then 1 − ½ works itself out ("= ½") and rolls into place.
//   tap: "3 ÷ ½ = 6" writes itself under the formula, the 6 flies up into "= ?", and the full quilt glows with its total.
// Level 0: r = ½ (with small a and r tags under the parts). Level 1: r = ½ or ⅓. Level 2: r = ¼, ⅓ or ⅔.
// Medium mode: 1 − r and the final quotient are picked from the tray. Wrong moves: a dropped on r, r dropped on a.
const M = MK, TY = 222, FY = 302, SQ = { x: 92, y: 366, w: 170, h: 170 }, INK = '#1e3050', HX = 304, HY = 608, NOTE = '#2a62b0';
const PATCH = ['#e8604a', '#f2a03a', '#f2cc3a', '#7ac060', '#3aa8c8', '#8a70d0', '#e070a0', '#e8604a', '#f2a03a'];
const POOL = [[[2, 1, 2], [3, 1, 2], [4, 1, 2], [5, 1, 2]], [[3, 1, 2], [5, 1, 2], [2, 1, 3], [4, 1, 3], [6, 1, 3]], [[3, 1, 4], [6, 1, 4], [4, 1, 3], [2, 2, 3], [3, 2, 3]]];
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const fr = (p, q, id, o) => { const d = gcd(p, q); p /= d; q /= d; return q === 1 ? M.num(p, id, o) : M.frac(M.num(p), M.num(q), id, o); };
// the patches: each takes (1 − r) of the rectangle still empty, cut across its longer side
function patches(S, n) { const out = []; let R = { ...SQ }; for (let k = 0; k < n; k++) { const f = 1 - S.p / S.q, wide = R.w >= R.h;
  const P = wide ? { x: R.x, y: R.y, w: R.w * f, h: R.h } : { x: R.x, y: R.y, w: R.w, h: R.h * f }; out.push(P);
  R = wide ? { x: R.x + P.w, y: R.y, w: R.w - P.w, h: R.h } : { x: R.x, y: R.y + P.h, w: R.w, h: R.h - P.h }; } return out; }
// Σ and ∞ are painted (the fonts have neither)
function sigma(c, b, s, col) { const h = s * 1.05, w = s * 0.72, x0 = b.x - w / 2, y0 = b.y - h / 2 + 2; c.save(); c.strokeStyle = col; c.lineWidth = s * 0.09; c.lineJoin = c.lineCap = 'round';
  c.beginPath(); c.moveTo(x0 + w, y0 + h * 0.14); c.lineTo(x0 + w, y0); c.lineTo(x0, y0); c.lineTo(x0 + w * 0.55, y0 + h / 2); c.lineTo(x0, y0 + h); c.lineTo(x0 + w, y0 + h); c.lineTo(x0 + w, y0 + h * 0.86); c.stroke();
  c.lineWidth = 2.4; const iy = y0 - 12, r = 5.5; c.beginPath(); c.ellipse(b.x - r, iy, r, r * 0.75, 0, 0, 7); c.moveTo(b.x + 2 * r, iy); c.ellipse(b.x + r, iy, r, r * 0.75, 0, 0, 7); c.stroke();
  c.fillStyle = col; c.textAlign = 'center'; c.font = M.VARF(17); c.fillText('n', b.x - 13, y0 + h + 18); c.font = M.NUMF(17); c.fillText('= 0', b.x + 8, y0 + h + 18); c.restore(); }

MG.add({
  id: 'series_geom', stage: 'series', cmd: 'GEOMETRIC SERIES!', hint: 'drag', time: 9, mood: 'bright', winText: 'Summed!', hold: 1.8,
  card: {
    title: 'Geometric series', ref: 'Calculus', kind: 'Series',
    text: 'In a geometric series each term is the one before it times the same number r, called the ratio. The first term is called a. Σ means "add them all up", here forever: n = 0, 1, 2, 3, ...\n\nFor example, Σ 3(½)ⁿ = 3 + 3/2 + 3/4 + 3/8 + ... Each term is half of the one before.\n\nThe terms get smaller so fast that the sum never passes a certain number. When r is between −1 and 1, the sum is a / (1 − r). Here that is 3 / (1 − ½) = 3 ÷ ½ = 6.\n\nThe quilt shows why: the first patch, 3, fills half of a quilt of size 6. Each next patch fills half of what is left, so together they fill all of it and never spill over.',
    note: 'When −1 < r < 1, a + ar + ar² + ar³ + ... = a / (1 − r).',
    ask: 'What is Σ 4(½)ⁿ? What is Σ 2(⅓)ⁿ?',
  },

  init(g) {
    const S = g.s; M.setup(g); const pool = POOL[g.level], T = M.pace(g); const [a, p, q] = pool[Math.floor(g.rand() * pool.length)];
    Object.assign(S, { a, p, q, sum: a * q / (q - p), shown: 0, pieces: [] });
    S.ta = M.num(a, 'ta'); S.tr = M.sup(M.paren(fr(p, q), 'tr'), M.vr('n', 'tn')); S.ans = M.slot('ans', { w: 40, col: '#6a80a8' });
    S.top = M.row({ ...M.gap(40), id: 'sig' }, M.gap(6), S.ta, S.tr, M.op('=', 'teq'), S.ans);
    S.fa = M.vr('a', 'fa'); S.fr = M.vr('r', 'fr'); S.den = M.row(M.num(1, 'one'), M.op('-', 'mn'), S.fr); S.den.id = 'den';
    S.ff = M.frac(S.fa, S.den, 'ff'); S.form = M.row(M.op('=', 'feq'), S.ff);
    S.placeTop = () => M.place(g, 'top', S.top, 180, TY, 40, { col: INK }); S.fx = 180; S.placeForm = () => M.place(g, 'form', S.form, S.fx, FY, 42, { col: INK });
    S.placeTop(); S.placeForm();
    M.inert(g, ['sig', 'tn', 'teq', 'ans', 'feq', 'one', 'mn', 'den', 'q', 'res', 'na']);
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    g.dur *= (2.6 + 1.05 * 3) / 8;
    // sew patches k0 .. k1 - 1 into the quilt, one after another
    const sew = (g, k0, k1, t0, gap) => { for (let k = k0; k < k1; k++) M.at(g, [[t0 + (k - k0) * gap, g => { S.shown = k + 1; S.sewAt = S.sewAt || []; S.sewAt[k] = g.t; g.sfx('pop', { p: 1 + k * 0.1 }); hop(g);
      const P = patches(S, k + 1)[k]; if (P.w * P.h > 60) g.burst(P.x + P.w / 2, P.y + P.h / 2, [PATCH[k], '#fff'], 6, 70); }]]); return (k1 - k0) * gap; };
    const cascade = (g, t0) => { M.note(g, { node: M.row(M.op('×'), fr(p, q)), at: [SQ.x + SQ.w + 8, SQ.y + 30], off: [18, 0], s: 24, col: NOTE, delay: t0, write: 0.2 * T, hold: 0.7 * T, fade: 0.25 * T });
      return sew(g, 1, 7, t0 + 0.2 * T, 0.13 * T); };

    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.aIn) out.push({ drag: 'ta', to: 'fa', busy: 0.1,
          then(g) { S.aIn = true; const T1 = M.show(g, 1.0 * T); hop(g, 'wow'); S.point = true;
            M.circle(g, 'ta', { dur: 0.45 * T, col: '#f2a03a' }); const na = M.num(a, 'na', { _born: -1, alpha: 0 }); S.ff.n = na; S.placeForm();
            M.fly(g, { node: M.num(a), from: 'ta', to: 'na', delay: 0.15 * T, dur: 0.4 * T, arc: -30, s0: 40, s1: 42, col: INK, then(g) { na.alpha = 1; na.pop = g.t; M.sparkle(g, 'na', { n: 8 }); g.sfx('tap'); } });
            // the first patch is the first term
            let t = 0.6 * T; t += sew(g, 0, 1, t, 0.2 * T); if (S.rIn) t += cascade(g, t + 0.05 * T);
            M.show(g, Math.max(T1, t + 0.2 * T)); } });
        if (!S.rIn) out.push({ drag: 'tr', to: 'fr', busy: 0.1, get askAt() { return S.askT || 1.25 * T; }, after: 0.75 * T,
          ask: { v: fr(q - p, q), wrong: [fr(q + p, q), fr(p, q - p), fr(q, q - p), fr(1, q)] },
          then(g) { S.rIn = true; hop(g, 'think'); S.point = true;
            M.circle(g, 'tr', { dur: 0.45 * T, col: '#3aa8c8' }); const nr = fr(p, q, 'nr', { _born: -1, alpha: 0 }); S.den.items[2] = nr; S.placeForm();
            M.fly(g, { node: fr(p, q), from: 'tr', to: 'nr', delay: 0.15 * T, dur: 0.4 * T, arc: -30, s0: 40, s1: 34, col: INK, then(g) { nr.alpha = 1; nr.pop = g.t; M.sparkle(g, 'nr', { n: 8 }); g.sfx('tap'); } });
            let t = 0.55 * T; if (S.aIn) t += cascade(g, t);
            // then 1 − r: "= ½" writes itself beside the denominator
            M.at(g, [[Math.max(0.6 * T, t - 0.2 * T), g => { M.circle(g, 'den', { dur: 0.45 * T }); M.light(g, 'den', { col: '#e8802a' }); }]]);
            S.askT = Math.max(0.6 * T, t - 0.2 * T) + 0.4 * T; M.show(g, S.askT); },
          resolve(g) { M.show(g, 0.75 * T); const q1 = fr(q - p, q, 'q', { alpha: 0 });
              M.note(g, { node: M.row(M.op('='), fr(q - p, q)), at: 'den', off: [76, 4], s: 28, col: NOTE, write: 0.22 * T, hold: 0.15 * T, fly: 0.28 * T, to: 'den', s1: 28, arc: 20,
                then(g) { M.unlight(g, 'den'); S.ff.d = q1; q1.alpha = 1; q1.pop = g.t; q1.id = 'q'; S.placeForm(); M.sparkle(g, 'q', { n: 8 }); g.sfx('ding'); hop(g); } }); } });
        if (S.aIn && S.rIn && !S.done) out.push({ tap: ['ff', 'na', 'q'], busy: 0.1, askAt: 0.8 * T, after: 1.5 * T,
          ask: { v: S.sum, wrong: [fr(a * q, q + p), fr(a * (q - p), q), fr(a * p, q), S.sum + a] }, // a/(1 + r), a·(1 − r), a·r
          then(g) { S.done = true; M.show(g, 0.8 * T); hop(g, 'think'); S.point = true;
            S.fx = 116; S.placeForm(); M.circle(g, 'ff', { dur: 0.55 * T, delay: 0.2 * T }); S.res = M.num(S.sum, 'res', { alpha: 0, col: '#1a7a4a' });
            S.note = M.row(M.num(a), M.op('÷'), fr(q - p, q), M.op('='), S.res); M.place(g, 'note', S.note, 174, FY, 30, { col: NOTE, left: true }); M.writeIn(g, S.note, { dur: 0.45 * T, delay: 0.3 * T }); },
          resolve(g) { M.show(g, 1.5 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.2 * T }); M.indicate(g, S.res, { delay: 0.15 * T, dur: 0.3 * T, sc: 1.35 }); g.sfx('ding');
            M.at(g, [[0.4 * T, g => { const v = M.num(S.sum, 'sv', { alpha: 0, col: '#1a7a4a' }); S.ans.fill = v; S.placeTop(); g.sfx('swoosh');
                M.fly(g, { node: M.num(S.sum, null, { col: '#1a7a4a' }), from: 'res', to: 'sv', dur: 0.45 * T, arc: -40, s0: 30, s1: 40, then(g) { v.alpha = 1; v.pop = g.t; M.sparkle(g, 'sv', { n: 14 }); g.sfx('coin'); hop(g, 'laugh'); } });
                M.tween(g, S.note, { alpha: 0 }, 0.3 * T, { delay: 0.3 * T }); }],
              // the whole quilt glows: its total is the sum
              [0.9 * T, g => { S.glowAt = g.t; g.sfx('sparkle'); g.burst(SQ.x + SQ.w / 2, SQ.y + SQ.h / 2, ['#fff', '#ffe08a', '#9ad0ff'], 18, 160); }],
              [1.2 * T, g => { delete g.s.mk.ex.note; S.fx = 180; S.placeForm(); S.point = false; }]]); } });
        return out;
      },
      area(g) { return !S.aIn || !S.rIn ? ['ta', 'tr', 'ff'] : ['ff']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.bg(g, c, 'snow');
    // a slab of clear ice for the math
    c.save(); c.fillStyle = 'rgba(30,50,90,0.18)'; c.beginPath(); c.roundRect(22, 172, 316, 186, 18); c.fill();
    const ig = c.createLinearGradient(0, 166, 0, 352); ig.addColorStop(0, 'rgba(240,250,255,0.92)'); ig.addColorStop(1, 'rgba(200,225,245,0.88)'); c.fillStyle = ig;
    c.beginPath(); c.roundRect(18, 166, 324, 186, 18); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 2.5; c.stroke();
    c.strokeStyle = 'rgba(150,190,230,0.35)'; c.lineWidth = 1.5; for (const [x0, y0, x1, y1] of [[40, 190, 70, 210], [300, 300, 326, 318], [292, 182, 318, 196]]) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); } c.restore();
    // the quilt: a wooden frame in the snow, filling patch by patch
    const glow = S.glowAt != null ? M.clamp((t - S.glowAt) / 0.5, 0, 1) : 0;
    c.save(); c.fillStyle = 'rgba(40,60,100,0.25)'; c.fillRect(SQ.x - 6, SQ.y + 2, SQ.w + 14, SQ.h + 12);
    c.fillStyle = '#9a6a40'; c.fillRect(SQ.x - 8, SQ.y - 8, SQ.w + 16, SQ.h + 16); c.fillStyle = '#f4f8fc'; c.fillRect(SQ.x, SQ.y, SQ.w, SQ.h);
    c.save(); c.setLineDash([6, 5]); c.strokeStyle = 'rgba(90,120,170,0.45)'; c.lineWidth = 1.5; c.strokeRect(SQ.x + 3, SQ.y + 3, SQ.w - 6, SQ.h - 6); c.restore();
    const ps = patches(S, S.shown);
    ps.forEach((P, k) => { const k0 = S.sewAt && S.sewAt[k] != null ? M.clamp((t - S.sewAt[k]) / 0.22, 0, 1) : 1, e = M.ease(k0), cx = P.x + P.w / 2, cy = P.y + P.h / 2;
      c.save(); c.translate(cx, cy); c.scale(0.4 + 0.6 * e, 0.4 + 0.6 * e); c.globalAlpha = e; c.fillStyle = PATCH[k];
      c.fillRect(-P.w / 2 + 1, -P.h / 2 + 1, P.w - 2, P.h - 2);
      if (P.w > 8 && P.h > 8) { c.strokeStyle = 'rgba(255,255,255,0.75)'; c.setLineDash([3, 3]); c.lineWidth = 1.2; c.strokeRect(-P.w / 2 + 4, -P.h / 2 + 4, P.w - 8, P.h - 8); }
      c.restore();
      // the patch's value: a, ar, ar², ...
      if (P.w > 34 && P.h > 30 && k0 > 0.5) { const nd = fr(S.a * Math.pow(S.p, k), Math.pow(S.q, k)), s = Math.min(26, P.h * 0.3, P.w * 0.36), m = M.lay(nd, s);
        c.save(); c.globalAlpha = M.clamp((k0 - 0.5) * 2, 0, 1); M.draw(c, nd, cx - m.w / 2, cy + (m.a - m.d) / 2, s, { t, col: '#fffaf0' }); c.restore(); } });
    if (glow > 0) { c.strokeStyle = `rgba(255,230,120,${0.9 * glow})`; c.shadowColor = '#ffe08a'; c.shadowBlur = 18 * glow; c.lineWidth = 4; c.strokeRect(SQ.x - 2, SQ.y - 2, SQ.w + 4, SQ.h + 4);
      c.shadowBlur = 0; c.fillStyle = '#9a6a40'; c.beginPath(); c.roundRect(SQ.x + SQ.w / 2 - 28, SQ.y + SQ.h + 2, 56, 30, 8); c.fill();
      c.globalAlpha = glow; c.fillStyle = '#fff6dc'; c.font = M.NUMF(22); c.textAlign = 'center'; c.fillText(String(S.sum), SQ.x + SQ.w / 2, SQ.y + SQ.h + 25); }
    c.restore();
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'form'); M.drawEx(g, c, 'note');
    const sb = M.box(g, 'sig'); if (sb) sigma(c, sb, 40, INK);
    // level 0: tiny a and r tags under the parts of the series
    if (g.level === 0 && !(S.aIn && S.rIn)) { c.save(); c.font = M.VARF(16); c.textAlign = 'center'; c.fillStyle = '#6a80a8';
      const ba = M.box(g, 'ta'), br = M.box(g, 'tr'); if (ba && !S.aIn) c.fillText('a', ba.x, ba.y + ba.h / 2 + 16); if (br && !S.rIn) c.fillText('r', br.x, br.y + br.h / 2 + 16); c.restore(); }
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', HX, HY - hopK * 24, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'rabbit', HX, HY, 1.25);
    M.drawUI(g, c);
  },
});
