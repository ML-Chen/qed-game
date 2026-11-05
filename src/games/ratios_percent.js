// ratios_percent.js — PERCENT! "25% of 80": drag the 25% onto the 80. The working plays by itself (show your work):
//   1. The % turns into "/100" and "of" turns into "×" (each flies into its new symbol): 25/100 × 80. The bar of 100
//      squares (the whole 80) is circled, then 25 of its squares fill in column by column while a counter counts them.
//   2. Tap 25/100 × 80: the 80 glides up into the numerator, (25 × 80)/100; the product merges into 2000; the two
//      zeros of 2000 and of 100 are crossed out together (dividing by 100), the fraction collapses to 20, and 20 is
//      written at the end of the shaded part of the bar.
// Level 0: 10%, 25% or 50% of a small number. Level 1: 10–75%. Level 2: 5%, 15%, 35%, ... of numbers up to 400.
// Medium mode: the tap on the product opens the tray once 2000/100 is on the board.
const M = MK, INK = SCN.ink('chalk'), PC = '#ffd970', CHALK = '#ffe9b0', HX = 296, HY = 600;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const ps = L === 0 ? [10, 25, 50] : L === 1 ? [20, 25, 75, 10, 40] : [15, 30, 35, 60, 75, 5];
  const p = ps[r(ps.length)], unit = 100 / gcd(p, 100), ws = [];
  for (let w = unit; w <= (L === 0 ? 120 : 400); w += unit) { const v = p * w / 100; if (w >= 20 && w !== 100 && v >= 2 && v <= 60) ws.push(w); }
  const w = ws[r(ws.length)]; return { p, w, v: p * w / 100 };
}
// the bar: 100 squares in 5 rows of 20, shaded column by column, so p squares cover p% of its length
const BX = 30, BY = 290, SQ = 15, EXY = 246;
const barBox = () => ({ x: BX + 10 * SQ, y: BY + 2.5 * SQ, w: 20 * SQ, h: 5 * SQ });
function drawBar(g, c, S) {
  const t = g.t, n = S.shadeAt == null ? 0 : Math.round(S.p * M.clamp((t - S.shadeAt) / S.shadeDur, 0, 1)), lit = S.litAt != null, pk = lit ? M.clamp((t - S.litAt) / 0.4, 0, 1) : 1;
  for (let col = 0; col < 20; col++) for (let rw = 0; rw < 5; rw++) {
    const i = col * 5 + rw, x = BX + col * SQ, y = BY + rw * SQ, on = i < n, sw = on && lit ? 1 + Math.sin(pk * Math.PI) * 0.25 : 1, h = (SQ - 3) * sw;
    c.fillStyle = on ? (lit ? '#ffe680' : 'rgba(255,217,112,0.85)') : 'rgba(255,255,255,0.06)'; c.fillRect(x + SQ / 2 - h / 2, y + SQ / 2 - h / 2, h, h);
    c.strokeStyle = 'rgba(251,248,238,0.55)'; c.lineWidth = 1.2; c.strokeRect(x + 1.5, y + 1.5, SQ - 3, SQ - 3);
  }
  // the counter rides on the front of the shading while it fills: 1, 2, 3, ... 25
  if (S.shadeAt != null && t - S.shadeAt < S.shadeDur + 0.45 && n > 0) {
    const fx = BX + Math.ceil(n / 5) * SQ, a = M.clamp(1 - (t - S.shadeAt - S.shadeDur) / 0.45, 0, 1);
    c.save(); c.globalAlpha = a; c.font = M.NUMF(18, 700); c.textAlign = 'center'; c.fillStyle = PC; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 4;
    c.fillText(String(n), M.clamp(fx, BX + 10, BX + 20 * SQ - 10), BY - 6); c.restore();
  }
  // the whole bar stands for the number; the shaded part's end gets its value once it is computed
  c.font = M.NUMF(15); c.textAlign = 'center'; c.fillStyle = 'rgba(251,248,238,0.8)';
  c.fillText('0', BX, BY + 5 * SQ + 18); c.fillText(String(S.w), BX + 20 * SQ, BY + 5 * SQ + 18);
  const ex = BX + S.p / 5 * SQ;
  if (S.endAt != null) { const k = M.ease((t - S.endAt) / 0.3); c.save(); c.beginPath(); c.rect(ex - 30, BY + 5 * SQ, 60 * k, 30); c.clip(); c.fillStyle = PC; c.font = M.NUMF(17, 700); c.fillText(String(S.v), ex, BY + 5 * SQ + 19); c.restore(); }
  c.strokeStyle = 'rgba(251,248,238,0.7)'; c.lineWidth = 1.5; c.beginPath();
  for (const x of [BX, BX + 20 * SQ].concat(S.endAt != null ? [ex] : [])) { c.moveTo(x, BY + 5 * SQ + 1); c.lineTo(x, BY + 5 * SQ + 5); } c.stroke();
}
// the owl points at the board while the work is shown and hops when a step lands
function host(g, c, kind, x, y, s) {
  const S = g.s, K = S.mk, hop = K.lastMove != null && g.t - K.lastMove < 0.35 ? Math.sin((g.t - K.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hop * 24, s, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, kind, x, y, s);
}

MG.add({
  id: 'ratios_percent', stage: 'ratios', cmd: 'PERCENT!', hint: 'drag', time: 8, mood: 'bright', winText: 'Percent!', hold: 1.4,
  card: {
    title: 'Percent of a number', ref: 'Grade 6', kind: 'Ratios and percents',
    text: 'Percent means "out of 100". So 25% means 25 out of every 100, which is the fraction 25/100.\n\nTo find a percent of a number, write the percent as a fraction over 100 and multiply it by the number. Here the word "of" means multiply. For example, 25% of 80 is 25/100 × 80 = 2000/100 = 20.\n\nTo see why, picture a bar cut into 100 equal squares that stands for the whole 80. Shading 25 of the 100 squares shades one quarter of the bar, and one quarter of 80 is 20.',
    note: 'p% of a number is p/100 × the number. For example, 25% of 80 = 25/100 × 80 = 20.',
    ask: 'What is 10% of 70? What is 50% of 36?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.shadeAt = null; const T = M.pace(g);
    // the symbols are made once and reused, so they glide from one form of the problem to the next
    S.pN = M.num(S.p, null, { col: PC }); S.pct = M.txt('%', null, { col: PC }); S.wN = M.num(S.w, 'w');
    S.ex = M.row(Object.assign(M.row(S.pN, S.pct), { id: 'pc' }), M.txt(' of ', 'of'), S.wN);
    const relay = () => M.place(g, 'ex', S.ex, 180, EXY, 48, { col: INK }); S.relay = relay; relay();
    M.inert(g, ['of']);
    const hop = (g, e) => { g.s.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    g.dur *= (2.6 + 1.05 * 2) / 8;
    M.play(g, {
      moves(g) {
        // 1. drag the percent onto the number: p% of w is written as p/100 × w, and the bar shades p squares
        if (!S.st) return [{ drag: 'pc', to: 'w', busy: 0.1,
          then(g) { S.st = 1; M.show(g, 1.45 * T); S.point = true; g.sfx('swoosh'); hop(g, 'wow');
            // % becomes /100 and "of" becomes × (the old symbols fly into the new ones)
            S.one = M.num(1, null, { col: CHALK }); S.zd = M.num('00', null, { col: CHALK });
            S.fr = M.frac(S.pN, M.row(S.one, S.zd), null, { bar: { t0: g.t, dur: 0.35 * T } }); S.times = M.op('×');
            S.ex = Object.assign(M.row(S.fr, S.times, S.wN), { id: 'calc' }); relay();
            M.indicate(g, S.times, { delay: 0.25 * T, dur: 0.35 * T, sc: 1.4 });
            M.at(g, [
              [0.45 * T, g => { M.circle(g, barBox(), { dur: 0.5 * T, pad: 5, col: '#fff6c0' }); M.indicate(g, S.wN, { dur: 0.45 * T, sc: 1.2, col: '#fff6c0' }); }],
              [0.7 * T, g => { S.shadeAt = g.t; S.shadeDur = 0.6 * T; g.sfx('sweep'); hop(g); }],
              [1.3 * T, g => { M.indicate(g, S.pN, { dur: 0.35 * T, sc: 1.3 }); g.sfx('ding'); }],
            ]); } }];
        // 2. tap the product to compute it
        if (S.st === 1) return [{ tap: 'calc', busy: 0.1, askAt: 0.95 * T, after: 1.15 * T, ask: { v: S.v, wrong: [S.v * 10, S.w - S.p, S.v + 5, S.p, Math.round(S.w / 4)] },
          then(g) { S.st = 2; M.show(g, 0.95 * T); S.point = true; hop(g, 'think');
            // the number glides up into the numerator: (p × w) / 100
            S.times.id = null; S.fr.n = M.row(S.pN, S.times, S.wN); S.ex = Object.assign(M.row(S.fr), { id: 'calc' }); relay(); g.sfx('swoosh');
            M.at(g, [
              [0.4 * T, g => { M.circle(g, [S.pN, S.wN], { dur: 0.4 * T }); M.light(g, S.pN); M.light(g, S.wN); }],
              [0.75 * T, g => { // the product merges into p·w, written as the answer followed by two zeros
                S.vN = M.num(S.v, 'vN', { pop: g.t }); S.zn = M.num('00', null, { pop: g.t });
                S.fr.n = M.row(S.vN, S.zn); relay(); g.sfx('ding'); hop(g); M.sparkle(g, S.vN, { n: 8 }); }],
            ]); },
          resolve(g) { M.show(g, 1.15 * T); S.point = true;
            // dividing by 100 takes two zeros off: they are crossed out on top and below
            M.circle(g, [S.zn, S.zd], { dur: 0.35 * T, col: '#ff9a8a' });
            M.strike(g, S.zn, { delay: 0.15 * T, dur: 0.22 * T }); M.strike(g, S.zd, { delay: 0.3 * T, dur: 0.22 * T }); M.at(g, [[0.2 * T, g => g.sfx('swoosh')]]);
            M.tween(g, S.zn, { alpha: 0 }, 0.2 * T, { delay: 0.6 * T }); M.tween(g, S.zd, { alpha: 0 }, 0.2 * T, { delay: 0.6 * T });
            M.at(g, [
              [0.85 * T, g => { // over 1 is just the number: the fraction collapses to the answer
                S.one.alpha = 0; S.ex = M.row(Object.assign(S.vN, { col: PC })); S.ex.id = 'res'; relay(); M.tween(g, S.vN, { sc: 1.35 }, 0.25 * T);
                g.sfx('coin'); hop(g, 'laugh'); const b = M.box(g, 'vN'); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#9ae07a'], 12, 130);
                S.endAt = g.t; S.litAt = g.t + 0.1 * T; }],
              [1.1 * T, g => { S.point = false; }],
            ]); } }];
        return [];
      },
      area(g) { return !S.st ? ['pc', 'w'] : ['calc']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'library', panel: 'chalk', panelY: 286, panelH: 220 });
    host(g, c, 'owl', HX, HY, 1.4);
    drawBar(g, c, S); M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
