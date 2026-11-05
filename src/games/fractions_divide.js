// fractions_divide.js — DIVIDE FRACTIONS! 2 ÷ 1/3 asks: how many thirds fit in 2? Count them, then see the shortcut.
// A candy stall at a carnival at dusk, with a fox. Under the sign "2 ÷ 1/3 = ?" lie 2 whole taffy bars, and below them
// one candy piece the size of 1/3 of a bar. The work is acted out both ways, in either order:
//   • Drag the piece (or the 1/3 in the sign) onto the bars: cut marks draw across every bar at each third, then candy
//     pieces are laid along the bars one after another, each numbered as it lands (1, 2, 3, …). The last number flies
//     up into the answer: 2 ÷ 1/3 = 6.
//   • Tap the ÷ sign: keep, change, flip. "keep" writes itself under the 2, "change" under the ÷, which spins round into
//     a ×, and "flip" under the fraction, whose top and bottom swap places on crossing arcs: 2 × 3/1.
//     Then tap the × (or the flipped fraction): "2 × 3 = 6" writes itself under the sign and the 6 flies into the
//     answer. If the bars were already counted, it lands on the same 6 and both light up green: the shortcut agrees.
// Level 0: 2 or 3 wholes ÷ halves, thirds or quarters. Level 1: up to 4 wholes ÷ up to sixths.
// Level 2: a fraction ÷ a unit fraction (3/4 ÷ 1/8 = 6): one bar is shaded 3/4 and only the shaded part is counted.
// Medium mode: the tray asks for the count once the first bar is counted, and for the product.
const M = MK, INK = '#3a1640', SIGNI = '#fff4dc', GOOD = '#2f9a5a', NOTEC = '#ffe08a', W = 280, BX = 40, ROW = 50, BH = 34, BY0 = 330;
const CANDY = [['#ff9ab8', '#e05a88'], ['#9ae8c8', '#3ab08a'], ['#ffe27a', '#e0a82a'], ['#b8a8ff', '#7a5ae0']];
function pick(g) {
  const L = g.level, r = a => a[Math.floor(g.rand() * a.length)];
  if (L === 0) return r([[2, 1, 2], [2, 1, 3], [2, 1, 4], [3, 1, 2], [3, 1, 3]]).concat();
  if (L === 1) return r([[2, 1, 5], [2, 1, 6], [3, 1, 4], [3, 1, 5], [4, 1, 3], [4, 1, 4], [3, 1, 6], [4, 1, 2]]);
  return r([[3, 4, 8], [2, 3, 6], [1, 2, 6], [3, 5, 10], [5, 6, 12], [3, 4, 12], [2, 5, 10], [1, 2, 8], [2, 3, 9]]);
}
const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); };

// the carnival at dusk: a violet sky, a big wheel, strings of bulbs, a striped awning over the stall
function carnival(c, Wd, H) {
  const sk = c.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#2a1a5a'); sk.addColorStop(0.45, '#7a3a8a'); sk.addColorStop(0.75, '#e8789a'); sk.addColorStop(1, '#ffb88a'); c.fillStyle = sk; c.fillRect(0, 0, Wd, H);
  const r = P.rng(5); for (let i = 0; i < 50; i++) { c.fillStyle = `rgba(255,250,230,${0.3 + r() * 0.6})`; c.beginPath(); c.arc(r() * Wd, r() * 220, r() * 1.3 + 0.3, 0, 7); c.fill(); }
  // the big wheel, far away
  c.save(); c.translate(292, 300); c.strokeStyle = 'rgba(60,30,90,0.55)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 90, 0, 7); c.stroke(); c.lineWidth = 1.5;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 90, Math.sin(a) * 90); c.stroke(); }
  c.lineWidth = 4; c.beginPath(); c.moveTo(-40, 160); c.lineTo(0, 0); c.lineTo(40, 160); c.stroke(); c.restore();
  // tents on the horizon
  for (const [x, w, h, col] of [[40, 90, 80, '#c84a6a'], [150, 70, 60, '#4a6ac8']]) { c.fillStyle = col; c.beginPath(); c.moveTo(x - w / 2, 470); c.lineTo(x, 470 - h); c.lineTo(x + w / 2, 470); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.moveTo(x - w * 0.18, 470); c.lineTo(x, 470 - h); c.lineTo(x + w * 0.05, 470); c.closePath(); c.fill(); }
  // the stall's counter, wood with a striped skirt
  c.fillStyle = '#5a2a3a'; c.fillRect(0, 470, Wd, H - 470);
  c.fillStyle = '#c8783a'; c.fillRect(0, 300, Wd, 10);
  const wood = c.createLinearGradient(0, 296, 0, 580); wood.addColorStop(0, '#f2c890'); wood.addColorStop(1, '#d89a5a'); c.fillStyle = wood; c.fillRect(14, 300, Wd - 28, 276);
  c.strokeStyle = 'rgba(140,80,30,0.25)'; c.lineWidth = 1.5; for (let y = 320; y < 576; y += 26) { c.beginPath(); c.moveTo(14, y); c.lineTo(Wd - 14, y); c.stroke(); }
  for (let x = 0; x < Wd; x += 30) { c.fillStyle = (x / 30) % 2 ? '#fff4ea' : '#e0405a'; c.fillRect(x, 576, 30, 64); }
}

MG.add({
  id: 'fractions_divide', stage: 'fractions', cmd: 'DIVIDE FRACTIONS!', hint: 'drag', time: 10, mood: 'party', winText: 'Divided!', hold: 1.6,
  card: {
    title: 'Dividing by a fraction', ref: 'Grade 5–6', kind: 'Fractions',
    text: 'Dividing asks how many times one amount fits into another. 2 ÷ 1/3 asks: how many thirds fit in 2?\n\nCut each whole into 3 thirds and count them. 2 wholes hold 6 thirds, so 2 ÷ 1/3 = 6. The answer is bigger than 2 because thirds are small.\n\nThere is a shortcut: keep the first number, change ÷ into ×, and flip the second fraction upside down. 2 ÷ 1/3 becomes 2 × 3/1 = 6, the same answer. It works because each whole holds 3 thirds, so you multiply by 3.',
    note: 'Keep, change, flip: a ÷ b/c = a × c/b.',
    ask: 'How many quarters fit in 3? What is 2/3 ÷ 1/6?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const [p, q, d] = pick(g); const whole = g.level < 2;
    Object.assign(S, { p, q, d, whole, face: 'happy' }); const N = whole ? p * d : p * d / q; S.N = N;
    S.rows = whole ? p : 1; S.cutAt = null; S.laid = []; S.cutN = whole ? d : d;
    // the sign: p ÷ 1/d = ?
    S.A = whole ? M.num(p, 'A') : M.frac(M.num(p), M.num(q), 'A');
    S.op = M.op('÷', 'div'); S.nn = M.num(1, 'fn'); S.dd = M.num(d, 'fd'); S.fr = M.frac(S.nn, S.dd, 'dv'); S.eq = M.op('=', 'eqs'); S.ans = M.slot('ans', { col: '#c89a6a' });
    S.relay = () => { S.top = M.row(S.A, S.op, S.fr, S.eq, S.ans); M.place(g, 'top', S.top, 180, 236, 44, { col: SIGNI }); };
    S.relay(); M.inert(g, ['eqs', 'fn', 'fd', 'kn', 'cn', 'fl', 'wn']);
    // the candy piece the size of 1/d, with its label
    S.pcw = W / d; S.pcx = whole ? 104 : 104; S.pcy = BY0 + S.rows * ROW + 40;
    S.pc = M.frac(M.num(1), M.num(d), 'pc'); M.place(g, 'pc', M.row(S.pc), S.pcx + Math.max(S.pcw, 44) / 2 + 30, S.pcy + 9, 26, { col: INK });
    M.zone(g, 'bars', { x: BX + W / 2, y: BY0 + (S.rows * ROW - (ROW - BH)) / 2, w: W + 16, h: S.rows * ROW });
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    g.dur *= (2.6 + 1.05 * 3) / 8;
    // where piece k lies
    S.spot = k => { const r = Math.floor(k / d), i = k % d; return [BX + (i + 0.5) * W / d, BY0 + r * ROW + BH / 2]; };
    const landAns = (g, from, v, s0) => { const n = M.num(v, 'ansv', { alpha: 0 });
      M.fly(g, { node: M.num(v, null, { col: SIGNI }), from, to: 'ans', dur: 0.4 * T, arc: -50, s0, s1: 44, then(g) {
        if (S.ansN) { S.ansN.pop = g.t; S.ansN.col = '#9af0b0'; S.agree = g.t; M.sparkle(g, 'ansv', { n: 16, cols: ['#9af0b0', '#fff', '#ffe08a'] }); g.sfx('magic'); hop(g, 'laugh'); }
        else { S.ansN = n; n.alpha = 1; n._born = -1; n.pop = g.t; S.ans = n; S.relay(); M.inert(g, ['ansv']); M.sparkle(g, 'ansv', { n: 10 }); g.sfx('coin'); hop(g); } } }); };
    const perRow = whole ? d : N, gap = Math.min(0.16, 1.1 / N) * T, cut = 0.4 * T, askAt = cut + perRow * gap + 0.2 * T, rest = (N - perRow) * gap + 0.85 * T;
    const lay = (g, k0, k1) => { const st = []; for (let k = k0; k < k1; k++) st.push([(k - k0) * gap + 0.01, g => { S.laid.push({ k, t0: g.t }); g.sfx(k % 2 ? 'tap' : 'pop'); if (k % d === d - 1 || k === N - 1) hop(g); }]); M.at(g, st); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.counted) out.push({ drag: S.flipped ? 'pc' : ['pc', 'dv'], to: 'bars', area: [BX - 10, BY0 - 20, BX + W + 10, BY0 + S.rows * ROW], busy: 0.1, askAt, after: rest,
          ask: { v: N, wrong: whole ? [M.frac(p, d), p + d, N - 1, N + d] : [M.frac(p, q * d), M.frac(p * d, q * q), N + 1, N - 1] },
          then(g) { S.counted = true; M.show(g, askAt); hop(g, 'wow'); S.point = true; g.sfx('swoosh');
            M.circle(g, 'pc', { dur: 0.4 * T }); S.cutAt = g.t + 0.1 * T; M.at(g, [[0.15 * T, g => g.sfx('snap')]]);
            M.at(g, [[cut, g => lay(g, 0, perRow)]]); },
          resolve(g) { M.show(g, rest); lay(g, perRow, N);
            M.at(g, [[(N - perRow) * gap + 0.25 * T, g => { const [x, y] = S.spot(N - 1); S.tallyAt = g.t; landAns(g, [x, y], N, 22); g.sfx('swoosh'); S.point = false; }]]); } });
        if (!S.flipped) out.push({ tap: 'div', busy: 0.1,
          then(g) { S.flipped = true; M.show(g, 1.6 * T); hop(g, 'think'); S.point = true;
            const note = (txt, at, delay) => M.at(g, [[delay, g => { const b = M.box(g, at); (S.tags = S.tags || []).push({ txt, x: b.x, t0: g.t, dur: 0.4 * T }); g.sfx('tap'); }]]);
            M.indicate(g, S.A, { dur: 0.4 * T, sc: 1.15, col: NOTEC }); note('keep', 'A', 0);
            note('change', 'div', 0.4 * T); M.circle(g, 'div', { delay: 0.4 * T, dur: 0.4 * T, col: NOTEC });
            M.tween(g, S.op, { sc: 0.05 }, 0.14 * T, { delay: 0.5 * T });
            M.at(g, [[0.64 * T, g => { S.op.v = '×'; S.op.id = 'mul'; S.op.pop = g.t; M.tween(g, S.op, { sc: 1 }, 0.14 * T); g.sfx('pop'); S.relay(); }],
              [0.8 * T, g => { note('flip', 'dv', 0); M.circle(g, 'dv', { dur: 0.45 * T, col: NOTEC });
                const bn = { ...M.box(g, 'fn') }, bd = { ...M.box(g, 'fd') }; M.at(g, [[0.15 * T, g => { S.nn.alpha = 0; S.dd.alpha = 0; g.sfx('swoosh'); }]]);
                M.anim(g, { delay: 0.15 * T, dur: 0.42 * T, draw(c, g, k) { // top and bottom swing round past each other, like a coin flipping over
                  const e = M.easeIO(k), a = Math.PI * e, cx = (bn.x + bd.x) / 2, cy = (bn.y + bd.y) / 2, ry = (bd.y - bn.y) / 2, rx = 22;
                  for (const [v, dir] of [[1, -1], [d, 1]]) { const nd = M.num(v), m = M.lay(nd, bn.s), x = cx + dir * Math.sin(a) * rx, y = cy + dir * Math.cos(a) * ry;
                    c.shadowColor = 'rgba(255,210,80,0.9)'; c.shadowBlur = 10; M.draw(c, nd, x - m.w / 2, y + (m.a - m.d) / 2, bn.s, { t: g.t, col: SIGNI }); } } }); }],
              [0.8 * T + 0.58 * T, g => { S.dd = M.num(d, 'fd2', { _born: -1, pop: g.t }); S.nn = M.num(1, 'fn2', { _born: -1, pop: g.t }); S.fr = M.frac(S.dd, S.nn, 'dv', { _born: -1 }); M.inert(g, ['fd2', 'fn2']); S.relay(); M.sparkle(g, 'dv', { n: 8 }); g.sfx('pop'); hop(g); }],
              [1.6 * T, g => { S.point = false; }]]); } });
        if (S.flipped && !S.computed) {
          const prod = whole ? p * d : p * d, cAsk = { v: N, wrong: whole ? [M.frac(p, d), p + d, N + 1] : [prod, M.frac(p, q * d), N + 1] };
          out.push({ tap: ['mul', 'dv'], busy: 0.1, askAt: 0.6 * T, after: 0.75 * T, ask: cAsk,
            then(g) { S.computed = true; M.show(g, 0.6 * T); hop(g, 'think'); S.point = true;
              M.circle(g, ['A', 'mul', 'dv'], { dur: 0.45 * T, col: NOTEC });
              S.wq = M.num(N, 'wq', { alpha: 0 });
              S.work = whole ? M.row(M.num(p), M.op('×'), M.num(d), M.op('='), S.wq)
                : M.row(M.frac(M.num(p), M.num(q)), M.op('×'), M.num(d), M.op('='), M.frac(M.num(p * d), M.num(q)), M.op('='), S.wq);
              S.work.id = 'wn'; M.place(g, 'work', S.work, 180, 296, whole ? 28 : 24, { col: NOTEC }); M.writeIn(g, S.work, { delay: 0.1 * T, dur: 0.4 * T }); S.work.alpha = 0; M.tween(g, S.work, { alpha: 1 }, 0.1 * T, { delay: 0.08 * T }); },
            resolve(g) { M.show(g, 0.75 * T); S.wq.alpha = 1; M.writeIn(g, S.wq, { dur: 0.2 * T }); M.indicate(g, S.wq, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding');
              M.at(g, [[0.3 * T, g => { landAns(g, 'wq', N, 28); }], [0.45 * T, g => M.tween(g, S.work, { alpha: 0 }, 0.25 * T)], [0.75 * T, g => { delete g.s.mk.ex.work; S.point = false; }]]); } });
        }
        return out;
      },
      area(g) { return !S.counted ? ['pc', 'bars'] : !S.flipped ? ['div'] : ['mul', 'dv']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), { p, q, d, whole } = S;
    c.drawImage(g.bake('fd_carnival', carnival), 0, 0, 360, 640);
    // strings of bulbs swaying over the stall
    for (let s = 0; s < 2; s++) { const y0 = 176 + s * 108, sag = 18, sw = Math.sin(t * 1.2 + s) * 3;
      c.strokeStyle = 'rgba(40,20,40,0.7)'; c.lineWidth = 1.5; c.beginPath(); for (let x = -10; x <= 370; x += 10) { const y = y0 + sag * Math.sin(((x + 10) / 380) * Math.PI) + sw; x < 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
      for (let i = 0; i < 10; i++) { const x = 10 + i * 38 + s * 19, y = y0 + sag * Math.sin(((x + 10) / 380) * Math.PI) + sw + 5, on = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.3 + s);
        c.fillStyle = ['#ffd45a', '#ff8aa8', '#8ae8ff', '#b8ff8a'][(i + s) % 4]; c.globalAlpha = on; c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); c.globalAlpha = on * 0.25; c.beginPath(); c.arc(x, y, 10, 0, 7); c.fill(); c.globalAlpha = 1; } }
    // the sign
    const tb = M.box(g, 'top'), sw = 300;
    c.save(); c.fillStyle = 'rgba(20,10,30,0.35)'; rr(c, 180 - sw / 2 + 3, 194, sw, 80, 16); c.fill();
    const sg = c.createLinearGradient(0, 190, 0, 270); sg.addColorStop(0, '#7a2a6a'); sg.addColorStop(1, '#4a1a4a'); c.fillStyle = sg; rr(c, 180 - sw / 2, 190, sw, 80, 16); c.fill();
    c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.stroke();
    for (let i = 0; i < 16; i++) { const a = i / 16, x = 180 - sw / 2 + 8 + a * (sw - 16), on = 0.5 + 0.5 * Math.sin(t * 5 - i * 0.8); c.fillStyle = `rgba(255,226,120,${0.4 + on * 0.6})`; c.beginPath(); c.arc(x, 190, 2.6, 0, 7); c.arc(x, 270, 2.6, 0, 7); c.fill(); }
    c.restore();
    M.drawEx(g, c, 'top');
    // keep · change · flip: each word writes itself in a little tag hanging under its part of the sign, then fades
    for (const tg of S.tags || []) { const k = (t - tg.t0) / tg.dur; if (k < 0 || k > 1) continue; const al = k < 0.15 ? k / 0.15 : k > 0.75 ? (1 - k) / 0.25 : 1, wk = M.clamp(k / 0.3, 0, 1);
      c.save(); c.globalAlpha = al; c.font = M.NUMF(20, 700); const w = c.measureText(tg.txt).width + 18, y = 288 + (1 - M.ease(Math.min(1, k * 4))) * -10;
      c.fillStyle = '#ffd45a'; rr(c, tg.x - w / 2, y - 13, w, 26, 13); c.fill(); c.strokeStyle = '#8a4a10'; c.lineWidth = 2; c.stroke();
      c.beginPath(); c.rect(tg.x - w / 2, y - 14, w * M.easeIO(wk), 28); c.clip(); c.fillStyle = '#5a1a3a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tg.txt, tg.x, y + 1); c.restore(); }
    const wb = M.box(g, 'wn'); if (wb && S.work && (S.work.alpha ?? 1) > 0.02) { c.save(); c.globalAlpha = S.work.alpha ?? 1; c.fillStyle = 'rgba(40,16,50,0.75)'; rr(c, wb.x - wb.w / 2 - 10, wb.y - wb.h / 2 - 5, wb.w + 20, wb.h + 10, 10); c.fill(); c.restore(); }
    M.drawEx(g, c, 'work');
    // the taffy bars: whole bars (or one bar shaded p/q), cut marks, then candy pieces
    const shade = whole ? 1 : p / q;
    for (let r = 0; r < S.rows; r++) { const y = BY0 + r * ROW;
      c.save(); c.fillStyle = 'rgba(80,40,20,0.25)'; rr(c, BX + 3, y + 5, W, BH, 10); c.fill();
      c.fillStyle = '#fff2f4'; rr(c, BX, y, W, BH, 10); c.fill(); c.save(); rr(c, BX, y, W, BH, 10); c.clip();
      c.fillStyle = 'rgba(255,150,180,0.35)'; for (let x = BX - 40; x < BX + W; x += 22) { c.beginPath(); c.moveTo(x, y + BH); c.lineTo(x + 12, y + BH); c.lineTo(x + 32, y); c.lineTo(x + 20, y); c.closePath(); c.fill(); }
      if (!whole) { c.fillStyle = 'rgba(255,255,255,0.8)'; c.fillRect(BX + W * shade, y, W * (1 - shade), BH); c.strokeStyle = '#c84a6a'; c.lineWidth = 3; c.beginPath(); c.moveTo(BX + W * shade, y); c.lineTo(BX + W * shade, y + BH); c.stroke(); }
      c.restore(); c.strokeStyle = '#c84a6a'; c.lineWidth = 2.5; rr(c, BX, y, W, BH, 10); c.stroke();
      // cut marks draw down each bar, one after another
      if (S.cutAt != null && t > S.cutAt) for (let i = 1; i < d; i++) { const k = M.clamp((t - S.cutAt - (i - 1) * 0.03 * T - r * 0.05 * T) / (0.12 * T), 0, 1); if (k <= 0) continue;
        const x = BX + i * W / d; c.strokeStyle = '#7a2a4a'; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x, y - 3 + (BH + 6) * k); c.stroke(); c.setLineDash([]); }
      c.restore(); }
    if (!whole) { c.fillStyle = '#ffe9f0'; c.font = M.NUMF(16, 700); c.textAlign = 'center'; c.fillText(p + '/' + q, BX + W * shade / 2, BY0 - 8); }
    // candy pieces drop onto the bars; each gets its number
    const fs = Math.min(19, W / d * 0.55);
    for (const L of S.laid) { const k = M.clamp((t - L.t0) / (0.16 * T), 0, 1), e = M.ease(k), [x, y] = S.spot(L.k), w = W / d - 4, h = BH - 6, col = CANDY[(L.k % d) % CANDY.length];
      const agree = S.agree != null && t > S.agree; c.save(); c.translate(x, y - (1 - e) * 26); c.scale(1 + Math.sin(k * Math.PI) * 0.15, 1 + Math.sin(k * Math.PI) * 0.15); c.globalAlpha = Math.min(1, k * 3);
      const gr = c.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, col[0]); gr.addColorStop(1, col[1]); c.fillStyle = gr; rr(c, -w / 2, -h / 2, w, h, 7); c.fill();
      c.strokeStyle = agree ? GOOD : 'rgba(90,30,60,0.6)'; c.lineWidth = agree ? 3 : 1.5; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.55)'; rr(c, -w / 2 + 3, -h / 2 + 2, w - 6, 4, 2); c.fill();
      c.fillStyle = INK; c.font = M.NUMF(fs, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(L.k + 1, 0, 1); c.restore(); }
    // the candy piece the size of 1/d, with its label beside it
    const pb = M.box(g, 'pc'), pn = M.node(g, 'pc'); if (pb) { const w = S.pcw - 4, h = BH - 6, x = S.pcx, y = S.pcy, bob = Math.sin(t * 2.2) * 2, al = pn && pn.alpha != null ? pn.alpha : 1;
      if (!S.counted) { c.save(); c.globalAlpha = al; c.fillStyle = 'rgba(80,40,20,0.25)'; rr(c, x - w / 2 + 3, y - h / 2 + 5 + bob, w, h, 7); c.fill(); const gr = c.createLinearGradient(0, y - h / 2, 0, y + h / 2); gr.addColorStop(0, CANDY[0][0]); gr.addColorStop(1, CANDY[0][1]);
        c.fillStyle = gr; rr(c, x - w / 2, y - h / 2 + bob, w, h, 7); c.fill(); c.strokeStyle = 'rgba(90,30,60,0.6)'; c.lineWidth = 1.5; c.stroke(); c.restore(); }
      c.save(); c.fillStyle = 'rgba(255,248,236,0.92)'; rr(c, pb.x - pb.w / 2 - 8, pb.y - pb.h / 2 - 5, pb.w + 16, pb.h + 10, 9); c.fill(); c.strokeStyle = '#c84a6a'; c.lineWidth = 2; c.stroke(); c.restore(); }
    M.drawEx(g, c, 'pc');
    // the fox runs the stall: points at the bars while the work is shown
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 300, 622 - hopK * 22, 1.3, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', 300, 622, 1.3); } catch (e) { SCN.host(g, c, 'fox', 300, 622, 1.3); }
    M.drawUI(g, c);
  },
});
