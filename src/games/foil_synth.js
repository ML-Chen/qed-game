// foil_synth.js — SYNTHETIC DIV! Divide a polynomial by (x − r) with synthetic division:
// (x³ − 6x² + 11x − 6) ÷ (x − 1) = x² − 5x + 6, remainder 0.
// A playground at sunset: the division is drawn in coloured chalk on the blue-grey asphalt, its cells boxed like a
// hopscotch court, and a little bird hops along the court as the numbers move. Every move's working plays by itself
// (show your work; the fuse stands still meanwhile):
//   1. Drag the "− 1" of the divisor into the corner box: the divisor is circled, "x − 1 = 0" writes itself above the
//      box, then "x = 1", and the 1 drops into the box (the sign flips: the box holds the root, not the number in the bracket).
//   2. Drag the leading coefficient down under the line (or tap it): it slides down the column and lands.
//   3. For each next column, drag the last bottom number diagonally up into the column (or tap the column's top
//      number): the bottom number and the root are circled, a blue arrow arcs from the bottom number up into the
//      column labelled "× 1", "1 × 1 = 1" writes itself above the column and the product chalks itself into the middle
//      row; then the column lights up, "−6 + 1 = −5" writes itself under it and the sum drops into the bottom row.
//      After the last column the remainder 0 glows green in its own corner box, and the bottom row's numbers hop down
//      one by one into the quotient x² − 5x + 6, each landing as a term one power lower than the dividend's.
// Wrong moves: a later column before the earlier one, dragging into the wrong column, or bringing down before the root
// is in its box. Level 0: a quadratic over (x − r), r = 1..3. Level 1: a cubic over (x − r). Level 2: a cubic over
// (x + r), so the root is negative, sometimes with leading coefficient 2.
// Medium mode: the root (the classic mistake, the sign of the bracket's number, is a tile) and each column's sum.
const M = MK;
const INKC = '#f8f6f0', PINK = '#ff9ac8', YEL = '#ffe27a', BLUE = '#8ad8ff', GREEN = '#9ef0a0', HX = 318, HY = 612;
const PROBY = 208, DIVY = 248, R0 = 328, R1 = 376, LINEY = 400, R2 = 432, QY = 496, RX = 46;
const COLC = ['#ffd2e6', '#c8f0ff', '#fff0b8', '#d8ffd0'];

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), one = a => a[r(a.length)];
  for (let tries = 0; tries < 200; tries++) {
    const root = L === 2 ? -(1 + r(3)) : 1 + r(3);
    let q;
    if (L === 0) { const b = one([-4, -3, -2, -1, 1, 2, 3, 4, 5]); q = [1, b]; }
    else { const lead = L === 2 && g.rand() < 0.35 ? 2 : 1; q = [lead, one([-5, -4, -3, -2, -1, 1, 2, 3, 4]), one([-6, -4, -3, -2, 2, 3, 4, 5, 6])]; }
    // p(x) = (x − root) · q(x)
    const p = [...q, 0].map((v, i) => v - root * (i ? q[i - 1] : 0));
    if (p.some(v => Math.abs(v) > 20) || p.slice(1).every(v => v === 0) || p[p.length - 1] === 0) continue;
    return { root, q, p };
  }
  return { root: 1, q: [1, -5, 6], p: [1, -6, 11, -6] };
}
// a signed term c·x^k; the first term of a line has no leading "+"
function term(c, k, first, id) {
  const A = Math.abs(c), body = k === 0 ? [M.num(A)] : [A === 1 ? null : M.num(A), k === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(k))];
  const r = M.row(first ? (c < 0 ? M.op('-') : null) : M.op(c < 0 ? '-' : '+'), ...body); if (id) r.id = id; return r;
}
function poly(cs, idp) { const out = []; cs.forEach((c, i) => { if (c) out.push(term(c, cs.length - 1 - i, !out.length, idp ? idp + i : null)); }); return M.row(...out); }
const sgn = v => (v < 0 ? '−' : '') + Math.abs(v);
// a chalk stroke: a line drawn twice with a little jitter, so it looks rubbed onto the asphalt
function chalkLine(c, pts, col, w, seed = 1) {
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col;
  for (let k = 0; k < 2; k++) { c.globalAlpha = k ? 0.45 : 0.85; c.lineWidth = w * (k ? 1.5 : 1); c.beginPath();
    pts.forEach(([x, y], i) => { const j = Math.sin(seed * 13.1 + i * 7.3 + k * 3) * 1.2; i ? c.lineTo(x + j, y - j) : c.moveTo(x + j, y + j); }); c.stroke(); }
  c.restore();
}
function chalkBox(c, x, y, w, h, col, seed) { chalkLine(c, [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2], [x - w / 2, y - h / 2]], col, 2, seed); }

// the playground: a sunset sky over a brick wall and trees, and a wide stretch of asphalt with chalk doodles
function playground(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 160); sk.addColorStop(0, '#3a2a70'); sk.addColorStop(0.55, '#b0507a'); sk.addColorStop(1, '#ffb070'); c.fillStyle = sk; c.fillRect(0, 0, W, 160);
  const sun = c.createRadialGradient(80, 150, 4, 80, 150, 90); sun.addColorStop(0, 'rgba(255,230,170,0.95)'); sun.addColorStop(0.3, 'rgba(255,200,140,0.4)'); sun.addColorStop(1, 'rgba(255,180,120,0)'); c.fillStyle = sun; c.fillRect(0, 50, 200, 110);
  c.fillStyle = '#ffe2a8'; c.beginPath(); c.arc(80, 150, 18, Math.PI, 0); c.fill();
  // tree silhouettes and a low brick wall
  c.fillStyle = '#2a1e48'; for (const [x, r] of [[20, 34], [60, 26], [250, 40], [300, 30], [345, 36]]) { c.beginPath(); c.arc(x, 150 - r * 0.4, r, 0, 7); c.fill(); c.fillRect(x - 3, 140, 6, 20); }
  c.fillStyle = '#7a3a3a'; c.fillRect(0, 148, W, 22); c.strokeStyle = 'rgba(40,10,20,0.4)'; c.lineWidth = 1;
  for (let y = 148; y < 170; y += 7) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); for (let x = ((y - 148) / 7) % 2 ? 0 : 9; x < W; x += 18) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 7); c.stroke(); } }
  c.fillStyle = '#9a5a4a'; c.fillRect(0, 146, W, 4);
  // asphalt with grain
  const ag = c.createLinearGradient(0, 170, 0, H); ag.addColorStop(0, '#5a6078'); ag.addColorStop(1, '#3a3e52'); c.fillStyle = ag; c.fillRect(0, 170, W, H - 170);
  const R = P.rng(31); for (let i = 0; i < 900; i++) { c.fillStyle = R() < 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)'; c.fillRect(R() * W, 170 + R() * (H - 170), 1.5, 1.5); }
  c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(0, 170, W, 6);
  // a crack and old chalk doodles: a sun, a flower, a star, a heart
  c.strokeStyle = 'rgba(20,20,30,0.4)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 520); c.lineTo(40, 530); c.lineTo(70, 522); c.lineTo(96, 540); c.stroke();
  c.save(); c.globalAlpha = 0.35; c.lineWidth = 2.5; c.lineCap = 'round';
  c.strokeStyle = '#ffe27a'; c.beginPath(); c.arc(40, 590, 12, 0, 7); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; c.moveTo(40 + Math.cos(a) * 17, 590 + Math.sin(a) * 17); c.lineTo(40 + Math.cos(a) * 24, 590 + Math.sin(a) * 24); } c.stroke();
  c.strokeStyle = '#ff9ac8'; for (let k = 0; k < 5; k++) { const a = k * Math.PI * 0.4; c.beginPath(); c.arc(150 + Math.cos(a) * 9, 600 + Math.sin(a) * 9, 7, 0, 7); c.stroke(); }
  c.strokeStyle = '#8ad8ff'; c.beginPath(); for (let k = 0; k <= 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 6 : 15; c.lineTo(222 + Math.cos(a) * rr, 596 + Math.sin(a) * rr); } c.stroke();
  c.restore();
}

MG.add({
  id: 'synth', stage: 'foil', cmd: 'SYNTHETIC DIV!', hint: 'drag', time: 10, winText: 'Divided!', hold: 1.9,
  card: {
    title: 'Synthetic division', ref: 'Algebra 2', kind: 'Polynomials',
    text: 'Synthetic division is a quick way to divide a polynomial by (x − r). Write only the coefficients in a row, and put r in the corner box. For (x − 1) the box gets 1, because x − 1 = 0 when x = 1.\n\nBring the first coefficient down. Then repeat: multiply the number you just wrote by r, write the product under the next coefficient, and add that column.\n\nFor x³ − 6x² + 11x − 6: bring down 1; 1 × 1 = 1 and −6 + 1 = −5; −5 × 1 = −5 and 11 − 5 = 6; 6 × 1 = 6 and −6 + 6 = 0. The bottom row 1, −5, 6 is the answer x² − 5x + 6, and the last number 0 is the remainder.',
    note: 'Box r, bring down, then multiply by r and add, column after column. The bottom row is the quotient, one power lower; the last number is the remainder.',
    ask: 'Divide x² + 5x + 6 by (x + 2). Divide x³ − 1 by (x − 1).',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { root, p } = S, N = p.length, T = M.pace(g);
    const sp = N === 4 ? 66 : 76, x0 = N === 4 ? 116 : 136; S.cx = p.map((_, i) => x0 + i * sp); S.N = N;
    S.b = []; p.forEach((v, i) => S.b.push(i ? v + root * S.b[i - 1] : v)); S.prod = S.b.map((v, i) => i ? S.b[i - 1] * root : null);
    // the problem: (p) ÷ (x − r)
    S.dv = M.row(M.op(root > 0 ? '-' : '+'), M.num(Math.abs(root))); S.dv.id = 'dv';
    S.prob = M.paren(poly(p, 'pt')); S.div = M.row(M.op('÷'), M.paren(M.row(M.vr('x'), S.dv), 'dvp'));
    M.place(g, 'prob', S.prob, 180, PROBY, 30, { col: INKC }); M.place(g, 'div', S.div, 180, DIVY, 30, { col: INKC });
    p.forEach((v, i) => M.place(g, 'c' + i, M.num(v, 'c' + i), S.cx[i], R0 + 10, 30, { col: INKC }));
    M.zone(g, 'root', { x: RX, y: R0, w: 50, h: 46 });
    for (let i = 0; i < N; i++) { M.zone(g, 'b' + i, { x: S.cx[i], y: R2, w: sp - 10, h: 44 }); if (i) M.zone(g, 'p' + i, { x: S.cx[i], y: R1, w: sp - 10, h: 44 }); }
    M.inert(g, ['dvp', ...p.map((_, i) => 'pt' + i)]);
    S.st = 0; S.cells = {}; // placed numbers in the court: key -> node
    const hop = (e, to) => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; if (to != null) { S.birdFrom = S.birdX; S.birdTo = to; S.birdT = g.t; } };
    S.birdX = HX;
    const put = (key, v, x, y, o = {}) => { const n = M.num(v, key, { _born: -1, ...o }); S.cells[key] = n; M.place(g, key, n, x, y + 10, 30, { col: o.ink || INKC }); return n; };
    const note = (key, node, x, y, s, col) => { const m = M.lay(node, s), cx = M.clamp(x, m.w / 2 + 8, 352 - m.w / 2); M.place(g, key, node, cx, y, s, { col }); return node; };

    // ---- 1. the root into the corner box ----
    const rootMv = {
      busy: 0.1, askAt: 0.75 * T, after: 0.75 * T, ask: { v: root, wrong: [-root, root + (root > 0 ? 1 : -1), 0] },
      then(g) {
        S.st = 1; S.point = true; hop('think', 120); M.show(g, 0.75 * T); g.sfx('swoosh');
        M.circle(g, 'dvp', { col: YEL, dur: 0.5 * T }); M.light(g, S.dv, { col: YEL });
        S.rq = M.num(root, 'rq', { alpha: 0 });
        S.n1 = note('n1', M.row(M.vr('x'), M.op(root > 0 ? '-' : '+'), M.num(Math.abs(root)), M.op('='), M.num(0)), 120, R0 - 50, 24, YEL); M.writeIn(g, S.n1, { dur: 0.35 * T, delay: 0.12 * T });
        M.at(g, [[0.5 * T, g => { S.n2 = M.row(M.vr('x'), M.op('='), S.rq); note('n2', S.n2, 240, R0 - 50, 24, YEL); M.writeIn(g, S.n2, { dur: 0.22 * T }); }]]);
      },
      resolve(g) {
        M.show(g, 0.75 * T); S.rq.alpha = 1; M.writeIn(g, S.rq, { dur: 0.2 * T }); g.sfx('ding'); M.unlight(g, S.dv);
        M.at(g, [[0.2 * T, g => { const b = { ...M.box(g, 'rq') }; S.rq.alpha = 0;
            M.fly(g, { node: M.num(root, null, { col: YEL }), from: [b.x, b.y], to: [RX, R0], dur: 0.38 * T, arc: -50, s0: 22, s1: 30, then(g) { put('rv', root, RX, R0, { pop: g.t, ink: YEL }); M.sparkle(g, 'rv'); g.sfx('pop'); hop('laugh', 90); } }); }],
          [0.6 * T, g => { for (const k of ['n1', 'n2']) M.tween(g, g.s.mk.ex[k].node, { alpha: 0 }, 0.15 * T); }],
          [0.74 * T, g => { delete g.s.mk.ex.n1; delete g.s.mk.ex.n2; S.point = false; }]]);
      },
    };
    // ---- 2. bring the first coefficient down ----
    const downMv = {
      busy: 0.1,
      then(g) { S.st = 2; M.show(g, 0.62 * T); hop('wow', S.cx[0]); g.sfx('swoosh');
        M.indicate(g, 'c0', { col: YEL, dur: 0.35 * T });
        M.anim(g, { dur: 0.5 * T, draw(c, g, k) { const e = M.easeIO(Math.min(1, k / 0.7)); c.globalAlpha = k < 0.8 ? 1 : (1 - k) / 0.2; chalkLine(c, [[S.cx[0] + 26, R0 + 2], [S.cx[0] + 26, R0 + 2 + (R2 - R0) * e]], BLUE, 2.5, 3); } });
        M.fly(g, { node: M.num(p[0], null, { col: INKC }), from: 'c0', to: [S.cx[0], R2], delay: 0.1 * T, dur: 0.4 * T, arc: 0, s0: 30, s1: 30,
          then(g) { put('bv0', S.b[0], S.cx[0], R2, { pop: g.t }); M.sparkle(g, 'bv0', { n: 6 }); g.sfx('pop'); hop('happy'); } }); },
    };
    // ---- 3. multiply by the root, then add the column ----
    const colMv = k => ({
      busy: 0.1, askAt: 1.05 * T, after: (k === N - 1 ? 1.9 : 0.7) * T,
      ask: { v: S.b[k], wrong: [p[k] - S.prod[k], p[k] + S.b[k - 1], -(p[k] + S.prod[k]), S.prod[k]] },
      then(g) {
        S.st = k + 2; S.point = true; hop('think', S.cx[k]); M.show(g, 1.05 * T); g.sfx('swoosh');
        M.circle(g, ['bv' + (k - 1)], { col: BLUE, dur: 0.45 * T }); M.circle(g, ['rv'], { col: BLUE, dur: 0.45 * T, delay: 0.05 * T });
        M.light(g, S.cells['bv' + (k - 1)], { col: BLUE }); M.light(g, S.cells.rv, { col: BLUE });
        M.arrow(g, 'bv' + (k - 1), 'p' + k, { dur: 0.4 * T, delay: 0.08 * T, bend: 26, col: BLUE, label: M.row(M.op('×'), root < 0 ? M.paren(M.num(root)) : M.num(root)), ls: 20, linger: 0.5 * T });
        S.mn = note('mn' + k, M.row(M.num(S.b[k - 1]), M.op('×'), root < 0 ? M.paren(M.num(root)) : M.num(root), M.op('='), M.num(S.prod[k])), S.cx[k], R0 - 44, 24, BLUE); M.writeIn(g, S.mn, { dur: 0.3 * T, delay: 0.15 * T });
        M.at(g, [
          [0.45 * T, g => { put('pv' + k, S.prod[k], S.cx[k], R1, { ink: BLUE }); M.writeIn(g, S.cells['pv' + k], { dur: 0.2 * T }); g.sfx('tap'); hop('wow');
            M.unlight(g, S.cells['bv' + (k - 1)]); M.unlight(g, S.cells.rv); M.tween(g, S.mn, { alpha: 0 }, 0.2 * T, { delay: 0.2 * T }); }],
          [0.68 * T, g => { delete g.s.mk.ex['mn' + k]; M.light(g, 'c' + k, { col: YEL }); M.light(g, S.cells['pv' + k], { col: YEL }); S.addAt = g.t; S.addK = k;
            S.sq = M.num(S.b[k], 'sq', { alpha: 0 });
            S.an = note('an' + k, M.row(M.num(p[k]), M.op(S.prod[k] < 0 ? '-' : '+'), M.num(Math.abs(S.prod[k])), M.op('='), S.sq), S.cx[k], R2 + 48, 24, YEL); M.writeIn(g, S.an, { dur: 0.3 * T }); }],
        ]);
      },
      resolve(g) {
        M.show(g, (k === N - 1 ? 1.9 : 0.7) * T); S.sq.alpha = 1; M.writeIn(g, S.sq, { dur: 0.18 * T }); M.indicate(g, S.sq, { delay: 0.12 * T, dur: 0.25 * T, col: YEL }); g.sfx('ding');
        M.at(g, [
          [0.22 * T, g => { const b = { ...M.box(g, 'sq') }; S.sq.alpha = 0; M.unlight(g, 'c' + k); M.unlight(g, S.cells['pv' + k]);
            M.fly(g, { node: M.num(S.b[k], null, { col: YEL }), from: [b.x, b.y], to: [S.cx[k], R2], dur: 0.32 * T, arc: 30, s0: 22, s1: 30,
              then(g) { put('bv' + k, S.b[k], S.cx[k], R2, { pop: g.t, ink: k === N - 1 ? GREEN : INKC }); M.sparkle(g, 'bv' + k, { n: 6 }); g.sfx('pop'); hop('happy');
                if (k === N - 1) { S.remAt = g.t; g.sfx('ding'); M.sparkle(g, 'bv' + k, { n: 14, cols: [GREEN, '#fff'] }); } } }); }],
          [0.5 * T, g => { M.tween(g, S.an, { alpha: 0 }, 0.15 * T); }],
          [0.66 * T, g => { delete g.s.mk.ex['an' + k]; if (k < N - 1) S.point = false; }],
          ...(k === N - 1 ? [[0.7 * T, g => quotient(g)]] : []),
        ]);
      },
    });
    // the bottom row hops down into the quotient, one power lower than the dividend
    const quotient = g => {
      const q = S.b.slice(0, N - 1); S.qline = poly(q, 'qt'); M.place(g, 'q', S.qline, 180, QY, 32, { col: INKC });
      const terms = S.qline.items; terms.forEach(t => { t.alpha = 0; });
      let j = 0; q.forEach((v, i) => { if (!v) return; const tm = terms[j++], d = j * 0.22 * T;
        M.fly(g, { node: M.num(v, null, { col: INKC }), from: 'bv' + i, to: 'qt' + i, delay: d, dur: 0.34 * T, arc: -40, s0: 30, s1: 32,
          then(g) { tm.alpha = 1; tm.pop = g.t; g.sfx('tap', { pitch: 1 + i * 0.1 }); hop('wow', S.cx[i]); } }); });
      M.at(g, [[j * 0.22 * T + 0.4 * T, g => { M.indicate(g, S.qline, { dur: 0.35 * T, sc: 1.1, col: GREEN }); g.sfx('coin'); hop('laugh', HX); S.point = false; }]]);
    };
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ ...rootMv, drag: 'dv', to: 'root', area: [0, R0 - 40, 90, R0 + 40] }];
        if (S.st === 1) return [{ ...downMv, drag: 'c0', to: 'b0' }, { ...downMv, tap: 'c0' }];
        const k = S.st - 1; if (k >= N) return [];
        const mv = colMv(k);
        return [{ ...mv, drag: 'bv' + (k - 1), to: 'p' + k, area: [S.cx[k] - 34, R0 - 20, S.cx[k] + 34, R1 + 22] }, { ...mv, tap: 'c' + k }, { ...mv, tap: 'p' + k }];
      },
      area(g) { if (S.st === 0) return ['dv', 'root']; if (S.st === 1) return ['c0', 'b0']; const k = S.st - 1; return k < N ? ['bv' + (k - 1), 'c' + k] : null; },
      onWin(g) { if (S.qline) S.qline.pop = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; S.badAt = g.t; }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, N = S.N;
    c.drawImage(g.bake('foil_synth_playground', playground), 0, 0, W, H);
    // leaves skittering over the asphalt
    c.save(); for (let i = 0; i < 5; i++) { const x = (i * 83 + t * (12 + i * 3)) % 400 - 20, y = 520 + (i * 37) % 90 + Math.sin(t * 2 + i) * 4; c.translate(x, y); c.rotate(t * 1.5 + i); c.fillStyle = ['#e8a040', '#c8603a', '#d8b040'][i % 3]; c.beginPath(); c.ellipse(0, 0, 6, 3, 0, 0, 7); c.fill(); c.setTransform(c.getTransform().a, 0, 0, c.getTransform().d, 0, 0); } c.restore();
    // the court: hopscotch boxes in coloured chalk, the corner box, the line
    const sp = S.cx[1] - S.cx[0], bw = sp - 10, bh = 44;
    for (let i = 0; i < N; i++) { const col = COLC[i % 4], lit = S.addK === i && M.showing(g) ? 1 : 0;
      chalkBox(c, S.cx[i], R0, bw, bh, col, i * 3 + 1); if (i) chalkBox(c, S.cx[i], R1, bw, bh, col, i * 3 + 2); chalkBox(c, S.cx[i], R2, bw, bh, col, i * 3 + 3);
      if (lit) { c.save(); c.globalAlpha = 0.18 * (0.6 + 0.4 * Math.sin(t * 8)); c.fillStyle = YEL; c.fillRect(S.cx[i] - bw / 2, R0 - bh / 2, bw, R2 - R0 + bh); c.restore(); } }
    chalkBox(c, RX, R0, 46, 46, YEL, 11);
    chalkLine(c, [[RX + 30, R0 - 26], [RX + 30, R1 + 24]], PINK, 3, 5);
    chalkLine(c, [[RX + 30, LINEY], [S.cx[N - 1] + bw / 2 + 4, LINEY]], PINK, 3.5, 6);
    // the remainder's corner box, glowing green once it is known
    { const x = S.cx[N - 1], k = S.remAt != null ? M.clamp((t - S.remAt) / 0.4, 0, 1) : 0;
      chalkLine(c, [[x - bw / 2 - 2, R2 + bh / 2 + 4], [x - bw / 2 - 2, R2 - bh / 2 - 2], [x + bw / 2 + 4, R2 - bh / 2 - 2]], k ? GREEN : PINK, 2.5, 9);
      if (k) { c.save(); c.globalAlpha = 0.3 + 0.2 * Math.sin(t * 5); c.shadowColor = GREEN; c.shadowBlur = 16; c.strokeStyle = GREEN; c.lineWidth = 3; c.beginPath(); c.arc(x, R2, 22 + 4 * k, 0, 7); c.stroke(); c.restore(); } }
    const bad = S.badAt != null && t - S.badAt < 0.4;
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'div');
    for (const key of Object.keys(S.mk.ex)) if (/^(c\d|rv|pv\d|bv\d)$/.test(key)) M.drawEx(g, c, key);
    for (const key of Object.keys(S.mk.ex)) if (/^(n1|n2|mn\d|an\d|q)$/.test(key)) M.drawEx(g, c, key);
    // the bird hops along the court to the column being worked on
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    if (S.birdT != null) { const k = M.easeIO(M.clamp((t - S.birdT) / 0.35, 0, 1)); S.birdX = M.lerp(S.birdFrom, S.birdTo, k); }
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost || bad ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle', bx = M.clamp(S.birdX, 40, 320);
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', bx, HY - hopK * 26, 1.4, { t, pose, expr, facing: bx > 180 ? -1 : 1 }); else SCN.host(g, c, 'bird', bx, HY, 1.4);
    M.drawUI(g, c);
  },
});
