// linalg_eigen.js — EIGENVALUE! Find the eigenvalues of a triangular 2×2 matrix A from det(A − λI) = 0, and watch
// each eigenvector: A only stretches it by λ along its own line, while an ordinary arrow is turned off its line.
// A night pond: the matrix glows on a dark glass panel, a frog holds a lily pad marked −λ, and a small pool below is the
// plane where the arrows live. Moves:
//   1, 2. Drag −λ onto each diagonal entry (either order): it flies in and the entry becomes "2 − λ"; on the first one
//      the name A becomes A − λI.
//   3. Tap the matrix: the main diagonal lights and "(2 − λ)(3 − λ)" writes itself below, then the other diagonal
//      lights and "− 1 · 0" follows; that product is 0, so it is crossed out and the line closes up to (2 − λ)(3 − λ) = 0.
//   4, 5. Tap each factor (either order): "λ = 2" writes itself under it, and in the pool the eigenvector's line draws
//      itself and A acts: the eigenvector stretches to λ times itself along its line (a "×2" lands at its tip) while a
//      grey test arrow swings off its own line.
// Wrong moves (they only wobble): dropping −λ on an off-diagonal entry (subtracting λ from every entry is the classic
// slip), tapping the matrix before both −λ are in. Level 0: small positive entries. Level 1: bigger, upper or lower
// triangular. Level 2: negative entries. Medium mode: each λ is picked from the tray.
const M = MK, INK = '#f4f0ff', LAM = '#7ff0c0', C1 = '#ffd25a', C2 = '#ff8ac8', HX = 300, HY = 608, MATY = 268, DETY = 356, LY = 404;
const PX = 116, PY = 496, PU = 16, PW = 204, PH = 132; // the pool: centre, px per unit, size
const TKX = 296, TKY = 470; // the −λ lily pad
function pick(g) {
  const L = g.level, R = a => a[Math.floor(g.rand() * a.length)];
  for (;;) {
    const a = L === 2 ? R([-2, -1, 2, 3]) : L === 1 ? R([1, 2, 3, 4, 5]) : R([2, 3, 4]), d = L === 2 ? R([-1, 1, 2, 3, -2]) : L === 1 ? R([1, 2, 3, 4, 5]) : R([2, 3]);
    if (a === d || a === -d) continue;
    const off = L === 2 ? R([1, -1, 2]) : L === 1 ? R([1, 2]) : 1, upper = L === 1 ? g.rand() < 0.5 : L === 2 ? g.rand() < 0.6 : true;
    return { a, d, b: upper ? off : 0, c: upper ? 0 : off, upper };
  }
}
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
const fac = (v, o) => v < 0 ? M.paren(M.num(v, null, o)) : M.num(v, null, o);
const leaves = (n, out = []) => { if (!n) return out; if (/^(num|var|txt|op)$/.test(n.k)) out.push(n); for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || []), ...(n.rows ? n.rows.flat() : [])]) leaves(ch, out); return out; };

MG.add({
  id: 'linalg_eigen', stage: 'linalg', cmd: 'EIGENVALUE!', hint: 'drag', time: 10, mood: 'night', winText: 'Eigen!', hold: 1.8,
  card: {
    title: 'Eigenvalues', ref: 'College', kind: 'Linear algebra',
    text: 'A matrix moves every arrow in the plane. Most arrows get turned to point a new way. A few special arrows only get stretched along their own line. They are eigenvectors, and the stretch factor λ (the Greek letter lambda) is their eigenvalue: Av = λv.\n\nTo find λ, subtract λ from each entry on the diagonal and set the determinant to 0: det(A − λI) = 0. The determinant is the product down the main diagonal minus the product down the other diagonal.\n\nFor A = [2 1; 0 3]: (2 − λ)(3 − λ) − 1·0 = 0, so λ = 2 or λ = 3. When a matrix has 0s on one side of the diagonal, the eigenvalues are just the diagonal entries.',
    note: 'Eigenvalues solve det(A − λI) = 0: subtract λ from the diagonal entries only, take the determinant, and find where it is 0.',
    ask: 'What are the eigenvalues of [4 2; 0 1]? Of [3 0; 5 −1]?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, b, c, d } = S, T = M.pace(g);
    S.e = [[M.num(a, 'm00'), M.num(b, 'm01')], [M.num(c, 'm10'), M.num(d, 'm11')]];
    S.mat = M.mat(S.e, 'mat'); S.Al = M.vr('A', 'Al'); S.lbl = M.row(S.Al); S.lbl.id = 'lbl';
    S.top = M.row(S.lbl, M.op('=', 'eq'), S.mat);
    const relay = () => M.place(g, 'top', S.top, 180, MATY, 36, { col: INK }); relay();
    M.place(g, 'tok', M.row(M.op('-', 'tm', { col: LAM }), M.vr('λ', 'tl', { col: LAM })), TKX, TKY + 12, 34, { col: LAM });
    S.tokRow = g.s.mk.ex.tok.node; S.tokRow.id = 'lam'; M.place(g, 'tok', S.tokRow, TKX, TKY + 12, 34, { col: LAM });
    M.inert(g, ['eq', 'Al', 'lbl', 'tm', 'tl', 'dl', 'dlv', 'dI', 'dz', 'lv0', 'lv1']);
    S.sub = [false, false]; S.eig = [];
    g.dur *= (2.6 + 1.05 * 5) / 8;
    // the eigenvectors (for the pool) and a test arrow that is not one
    const ev = lam => S.upper ? (lam === a ? [1, 0] : [b, d - a]) : (lam === d ? [0, 1] : [a - d, c]);
    S.ev = ev; const A = ([x, y]) => [a * x + b * y, c * x + d * y];
    S.w = [[1, 1], [1, -1], [-1, 1], [1, 2]].find(w => { const [p, q] = A(w); return Math.abs(p * w[1] - q * w[0]) > 0.5; }); S.Aw = A(S.w);
    // 1, 2: −λ onto a diagonal entry
    const sub = i => ({ drag: 'lam', to: 'm' + i + i, busy: 0.1, reach: 36,
      then(g) { S.sub[i] = true; M.show(g, 0.85 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
        const old = S.e[i][i]; M.circle(g, old.id, { col: LAM, dur: 0.45 * T });
        M.fly(g, { node: M.row(M.op('-'), M.vr('λ')), from: 'lam', to: old.id, dur: 0.42 * T, arc: -60, s0: 34, s1: 36, col: LAM,
          then(g) { const ent = M.row(M.num(+old.v.replace('−', '-'), null), M.op('-', null, { col: LAM }), M.vr('λ', null, { col: LAM, pop: g.t })); ent.id = old.id; old.id = null; ent.items[0] = old;
            S.e[i][i] = ent; S.mat.rows[i][i] = ent;
            if (!S.lblDone) { S.lblDone = true; S.lbl.items.push(M.op('-', 'dl', { col: LAM }), M.vr('λ', 'dlv', { col: LAM }), M.vr('I', 'dI', { col: LAM })); }
            relay(); M.sparkle(g, ent.id, { n: 10, cols: [LAM, '#fff'] }); g.sfx('pop'); hop(g); } });
        M.at(g, [[0.85 * T, g => { S.point = false; }]]); } });
    // 3: the determinant, one diagonal at a time
    const det = { tap: ['m00', 'm11', 'm01', 'm10', 'mat'], busy: 0.1,
      then(g) { S.detGo = true; M.show(g, 1.55 * T); S.point = true; hop(g, 'think'); M.circle(g, 'mat', { col: INK, dur: 0.5 * T });
        const f1 = M.paren(M.row(M.num(a), M.op('-', null, { col: LAM }), M.vr('λ', null, { col: LAM })), 'f1', { col: C1 }), f2 = M.paren(M.row(M.num(d), M.op('-', null, { col: LAM }), M.vr('λ', null, { col: LAM })), 'f2', { col: C1 });
        const mi = M.op('-', null, { col: C2 }), pb = fac(b, { col: C2 }), dot = M.op('·', null, { col: C2 }), pc = fac(c, { col: C2 }), off = M.row(mi, pb, dot, pc); off.id = 'off';
        const eq = M.op('=', 'dq'), zero = M.num(0, 'dz'); S.f = [f1, f2];
        for (const n of [...leaves(f1), ...leaves(f2), ...leaves(off), eq, zero]) n.alpha = 0; f1.alpha = f2.alpha = 0;
        S.det = M.row(f1, f2, off, eq, zero); const relD = () => M.place(g, 'det', S.det, 180, DETY, 30, { col: INK }); relD(); S.relD = relD;
        M.inert(g, ['off', 'dq']);
        const show = (ns, d) => M.at(g, [[d, g => { for (const n of ns) { for (const l of leaves(n)) l.alpha = 1; n.alpha = 1; } for (const n of ns) M.writeIn(g, n, { dur: 0.3 * T }); g.sfx('tap'); hop(g); }]]);
        M.at(g, [[0.1 * T, g => { S.diag = { k: 1, t0: g.t }; M.indicate(g, S.e[0][0], { col: C1, sc: 1.2, dur: 0.4 * T }); M.indicate(g, S.e[1][1], { col: C1, sc: 1.2, dur: 0.4 * T, delay: 0.08 * T }); }],
          [0.6 * T, g => { S.diag2 = { t0: g.t }; M.indicate(g, S.e[0][1], { col: C2, sc: 1.25, dur: 0.4 * T }); M.indicate(g, S.e[1][0], { col: C2, sc: 1.25, dur: 0.4 * T, delay: 0.08 * T }); }]]);
        show([f1, f2], 0.32 * T); show([off], 0.82 * T); show([eq, zero], 1.0 * T);
        // the other diagonal's product is 0: crossed out, and the line closes up
        M.at(g, [[1.12 * T, g => { M.strike(g, off, { dur: 0.22 * T, col: C2 }); g.sfx('swoosh'); }],
          [1.32 * T, g => { for (const l of leaves(off)) M.tween(g, l, { alpha: 0 }, 0.16 * T); }],
          [1.5 * T, g => { S.det.items = [f1, f2, eq, zero]; relD(); S.diag = S.diag2 = null; S.point = false; M.sparkle(g, 'det', { n: 10, cols: [C1, '#fff'] }); g.sfx('ding'); }]]); } };
    // 4, 5: a factor is 0 → λ, and the pool shows the eigenvector being stretched by λ
    const solve = i => { const lam = i ? d : a, col = S.eig.length ? C2 : C1;
      return { tap: 'f' + (i + 1), busy: 0.1, askAt: 0.4 * T, after: 1.55 * T, ask: { v: lam, wrong: [-lam, i ? a : d, 0, lam + 1].filter(w => w !== lam) },
        then(g) { S['s' + i] = true; M.show(g, 0.4 * T); S.point = true; hop(g, 'think'); M.circle(g, 'f' + (i + 1), { col: LAM, dur: 0.45 * T }); M.light(g, S.f[i], { col: LAM }); },
        resolve(g) { M.show(g, 1.55 * T); const col = S.eig.length ? C2 : C1; M.unlight(g, S.f[i], { delay: 0.3 * T });
          const fb = M.box(g, 'f' + (i + 1)), lv = M.num(lam, 'lv' + i, { col }), nd = M.row(M.vr('λ'), M.op('='), lv); M.place(g, 'l' + i, nd, fb.x, LY, 28, { col: INK }); M.writeIn(g, nd, { dur: 0.35 * T }); g.sfx('ding');
          M.at(g, [[0.35 * T, g => { M.indicate(g, lv, { col, sc: 1.4, dur: 0.4 * T }); M.sparkle(g, 'lv' + i, { n: 8, cols: [col, '#fff'] }); }],
            [0.5 * T, g => { const v = ev(lam), L = Math.hypot(...v), sc = Math.min(1.6, 3.6 / Math.max(1, Math.abs(lam))) / L; S.eig.push({ lam, v: [v[0] * sc, v[1] * sc], t0: g.t, col }); S.wT = g.t; g.sfx('sweep'); hop(g); }],
            [1.45 * T, g => { g.sfx('pop'); hop(g, S.eig.length === 2 ? 'laugh' : 'happy'); }],
            [1.55 * T, g => { S.point = false; }]]); } }; };
    M.play(g, {
      moves(g) { const out = [];
        if (!S.sub[0]) out.push(sub(0)); if (!S.sub[1]) out.push(sub(1));
        if (S.sub[0] && S.sub[1] && !S.detGo) out.push(det);
        if (S.detGo) { if (!S.s0) out.push(solve(0)); if (!S.s1) out.push(solve(1)); }
        return out; },
      area(g) { return !(S.sub[0] && S.sub[1]) ? ['lam', 'm00', 'm11'] : !S.detGo ? 'mat' : ['f1', 'f2']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, mk = S.mk, T = M.pace(g);
    c.drawImage(g.bake('eig_pond', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    fireflies(c, t);
    // the glass panel
    c.save(); c.fillStyle = 'rgba(12,16,44,0.62)'; c.strokeStyle = 'rgba(160,220,255,0.55)'; c.lineWidth = 2; c.beginPath(); c.roundRect(14, 190, 332, 236, 18); c.fill(); c.stroke(); c.restore();
    // the diagonals of the determinant
    const dg = (p, q, t0, col) => { const A = M.box(g, p), B = M.box(g, q); if (!A || !B) return; const e = M.easeIO((t - t0) / (0.3 * T));
      c.save(); c.strokeStyle = col; c.shadowColor = col; c.shadowBlur = 10; c.lineWidth = 4; c.lineCap = 'round'; c.globalAlpha = 0.85; c.beginPath(); c.moveTo(A.x, A.y); c.lineTo(M.lerp(A.x, B.x, e), M.lerp(A.y, B.y, e)); c.stroke(); c.restore(); };
    if (S.diag) dg('m00', 'm11', S.diag.t0, C1); if (S.diag2) dg('m01', 'm10', S.diag2.t0, C2);
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'det'); M.drawEx(g, c, 'l0'); M.drawEx(g, c, 'l1');
    pool(g, c, t, T);
    // the −λ lily pad, and the frog below it
    const P0 = mk.press, lift = P0 && P0.id === 'lam' && P0.dragging ? 0.45 : 1;
    c.save(); c.globalAlpha = lift; c.fillStyle = '#3e8a4a'; c.beginPath(); c.ellipse(TKX, TKY, 44, 22, 0, 0.25, Math.PI * 2 - 0.05); c.lineTo(TKX, TKY); c.fill(); c.strokeStyle = '#2a6a34'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(160,240,200,0.25)'; c.beginPath(); c.ellipse(TKX - 10, TKY - 8, 22, 7, -0.2, 0, 7); c.fill(); c.restore();
    M.drawEx(g, c, 'tok');
    const hk = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && t - mk.missAt < 0.7;
    const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', HX, HY - hk * 22, 1.3, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'frog', HX, HY, 1.3);
    M.drawUI(g, c);
  },
});

// the pool: a little plane with a grid; eigenvectors stretch along their lines, the test arrow turns off its line
function arrowTo(c, x0, y0, x1, y1, col, w) {
  const an = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0); if (L < 2) return;
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - Math.cos(an) * 6, y1 - Math.sin(an) * 6); c.stroke();
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 + Math.cos(an + 2.6) * 11, y1 + Math.sin(an + 2.6) * 11); c.lineTo(x1 + Math.cos(an - 2.6) * 11, y1 + Math.sin(an - 2.6) * 11); c.closePath(); c.fill();
}
function pool(g, c, t, T) {
  const S = g.s, x0 = PX - PW / 2, y0 = PY - PH / 2; c.save();
  c.fillStyle = 'rgba(8,30,50,0.7)'; c.strokeStyle = 'rgba(140,220,255,0.6)'; c.lineWidth = 2; c.beginPath(); c.roundRect(x0, y0, PW, PH, 16); c.fill(); c.stroke(); c.clip();
  c.strokeStyle = 'rgba(140,220,255,0.14)'; c.lineWidth = 1; for (let k = -8; k <= 8; k++) { c.beginPath(); c.moveTo(PX + k * PU, y0); c.lineTo(PX + k * PU, y0 + PH); c.moveTo(x0, PY + k * PU); c.lineTo(x0 + PW, PY + k * PU); c.stroke(); }
  c.strokeStyle = 'rgba(180,235,255,0.5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, PY); c.lineTo(x0 + PW, PY); c.moveTo(PX, y0); c.lineTo(PX, y0 + PH); c.stroke();
  const P = ([x, y]) => [PX + x * PU, PY - y * PU];
  // the test arrow: it is turned off its own (dashed) line when A acts
  if (S.wT != null) { const k = M.easeIO((t - S.wT - 0.25 * T) / (0.7 * T)), w = S.w, L = Math.hypot(...w), s = 1.6 / L, v = [w[0] * s, w[1] * s], Av = [S.Aw[0] * s, S.Aw[1] * s];
    const cur = [M.lerp(v[0], Av[0], k), M.lerp(v[1], Av[1], k)], a0 = M.clamp((t - S.wT) / (0.2 * T), 0, 1) * (S.eig.length && t - S.wT > 1.4 * T ? M.clamp(1 - (t - S.wT - 1.4 * T) / (0.3 * T), 0, 1) : 1);
    c.globalAlpha = a0 * 0.55; c.setLineDash([4, 5]); c.strokeStyle = '#d8d8e8'; c.lineWidth = 1.5; const [ex, ey] = P([v[0] * 9, v[1] * 9]), [fx, fy] = P([-v[0] * 9, -v[1] * 9]); c.beginPath(); c.moveTo(fx, fy); c.lineTo(ex, ey); c.stroke(); c.setLineDash([]);
    c.globalAlpha = a0 * 0.85; const [tx, ty] = P(cur); arrowTo(c, PX, PY, tx, ty, '#c8c8dc', 3); c.globalAlpha = 1; }
  // the eigenvectors: their line draws itself, then the arrow stretches by λ and stays on it
  for (const E of S.eig) { const kl = M.easeIO((t - E.t0) / (0.3 * T)), k = M.easeIO((t - E.t0 - 0.25 * T) / (0.7 * T)), [vx, vy] = E.v;
    c.save(); c.setLineDash([7, 6]); c.strokeStyle = E.col; c.globalAlpha = 0.7; c.lineWidth = 2; const [ax, ay] = P([-vx * 9 * kl, -vy * 9 * kl]), [bx, by] = P([vx * 9 * kl, vy * 9 * kl]); c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.restore();
    const m = 1 + (E.lam - 1) * k, [tx, ty] = P([vx * m, vy * m]); c.save(); c.shadowColor = E.col; c.shadowBlur = 10; arrowTo(c, PX, PY, tx, ty, E.col, 4); c.restore();
    if (k > 0.6) { const lb = M.row(M.op('×'), M.num(E.lam)), mm = M.lay(lb, 22), al = M.clamp((k - 0.6) / 0.3, 0, 1), dx = vx * m >= 0 ? 16 : -16;
      c.save(); c.globalAlpha = al; c.shadowColor = 'rgba(0,0,0,0.8)'; c.shadowBlur = 4; M.draw(c, lb, M.clamp(tx + dx - mm.w / 2, x0 + 4, x0 + PW - mm.w - 4), M.clamp(ty - 8, y0 + 22, y0 + PH - 6), 22, { col: E.col }); c.restore(); } }
  c.restore();
}
function paintBg(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#0a0c2a'); sk.addColorStop(0.6, '#1c2058'); sk.addColorStop(1, '#2e3a6e'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  P.stars(c, W, 300, 70, 11, 0);
  c.fillStyle = '#fff6d8'; c.shadowColor = '#fff2c0'; c.shadowBlur = 30; c.beginPath(); c.arc(300, 64, 18, 0, 7); c.fill(); c.shadowBlur = 0; c.fillStyle = '#0e1236'; c.beginPath(); c.arc(308, 58, 16, 0, 7); c.fill();
  // far trees and the pond
  for (let i = 0; i < 10; i++) { const x = i * 40 + (i % 2) * 10, h = 60 + (i % 3) * 22; c.fillStyle = '#0e1a30'; c.beginPath(); c.moveTo(x - 22, 420); c.lineTo(x, 420 - h); c.lineTo(x + 22, 420); c.fill(); }
  const pd = c.createLinearGradient(0, 410, 0, H); pd.addColorStop(0, '#1a3a5e'); pd.addColorStop(1, '#0c1c34'); c.fillStyle = pd; c.fillRect(0, 410, W, H - 410);
  c.fillStyle = 'rgba(255,246,216,0.25)'; for (let i = 0; i < 6; i++) c.fillRect(270 + (i % 2) * 8, 430 + i * 14, 50 - i * 6, 2);
  for (const [x, y, r] of [[226, 560, 20], [40, 600, 26], [180, 620, 18], [340, 540, 16]]) { c.fillStyle = '#2f6e3c'; c.beginPath(); c.ellipse(x, y, r, r * 0.45, 0, 0.3, Math.PI * 2 - 0.1); c.lineTo(x, y); c.fill(); }
  c.fillStyle = '#ffb8d8'; for (const [x, y] of [[226, 554], [40, 592]]) { c.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.ellipse(x + Math.cos(a) * 4, y + Math.sin(a) * 2, 4, 2.5, a, 0, 7); } c.fill(); }
  for (let i = 0; i < 7; i++) { const x = 6 + i * 9, h = 50 + (i % 3) * 18; c.strokeStyle = '#1e4a30'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, 640); c.quadraticCurveTo(x + 3, 640 - h / 2, x + (i % 2 ? 6 : -3), 640 - h); c.stroke(); }
}
function fireflies(c, t) {
  for (let i = 0; i < 12; i++) { const x = (i * 71 + Math.sin(t * 0.5 + i) * 30 + 400) % 360, y = (i * 53) % 180 + 430 + Math.sin(t * 0.8 + i * 2) * 14 - (i % 3) * 150 * (i % 2), a = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.3);
    if (y > 186 && y < 430) continue; c.save(); c.globalAlpha = a; c.fillStyle = '#e8ff9a'; c.shadowColor = '#d8ff70'; c.shadowBlur = 10; c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); c.restore(); }
}
