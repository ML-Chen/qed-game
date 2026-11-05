// linalg_transform.js — TRANSFORM! A 2 × 2 matrix moves the whole plane: its first column is where î = (1, 0) lands and
// its second column is where ĵ = (0, 1) lands. The unit square becomes the parallelogram those two arrows span.
// An autumn park seen from above: the matrix is chalked on a picnic-table plank, and the plane is a gingham blanket with
// the unit square on it. The grid itself is drawn in light lines that bend as the matrix acts (3Blue1Brown style).
// A bird hops about on the blanket's edge.
// Moves (show your work: each one plays its working by itself while the fuse stands still):
//   1. (either order with 2) Drag the first column (either of its numbers) onto î: the column lights up, a copy of it flies
//      to its point on the blanket and pins it, then î's tip glides there while the whole grid shears along with it, and the
//      tip is labelled with its new coordinates.
//   2. Drag the second column onto ĵ: the same for ĵ.
//   3. Tap the square's far corner (a "?" pin): a copy of ĵ slides tip-to-tail onto the end of î, "(a, c) + (b, d) =" writes
//      itself beside the corner, then the sum fills in, the corner pin flies to it, and the image of the square fills in.
// Wrong moves (they only wobble): a column dropped on the other arrow (mixing up columns with rows).
// Level 0: a quarter turn, a stretch or a shear. Levels 1 and 2: entries from −1..2 and −2..2, never squashing the plane flat.
// Medium mode: the far corner's coordinates are picked from the tray.
const M = MK, INK = '#4a2a1a', XC = '#e8503a', YC = '#2f7fd8', SQ = '#f2b632', NOTE = '#fff4e2', MY = 236, HX = 64, HY = 606;
const PIC = { x0: 22, x1: 338, y0: 290, y1: 548 };
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  if (L === 0) { const list = [[0, -1, 1, 0], [2, 0, 0, 1], [1, 1, 0, 1], [1, 0, 1, 2], [0, 1, -1, 0]]; const [a, b, c, d] = list[r(0, list.length - 1)]; return { a, b, c, d }; }
  for (;;) {
    const lo = L === 1 ? -1 : -2, hi = 2, [a, b, c, d] = [r(lo, hi), r(lo, hi), r(lo, hi), r(lo, hi)];
    if (a * d - b * c === 0 || (b === 0 && c === 0) || Math.abs(a + b) > 3 || Math.abs(c + d) > 3) continue;
    if ([a, b, c, d].filter(v => v === 0).length > 1) continue;
    return { a, b, c, d };
  }
}
const kk = (g, a) => a ? M.clamp((g.t - a.t0) / a.dur, 0, 1) : 0;
function put(g, c, n, cx, cy, s, col, alpha = 1) { const m = M.lay(n, s); c.save(); c.globalAlpha *= alpha; M.draw(c, n, cx - m.w / 2, cy + (m.a - m.d) / 2, s, { t: g.t, col }); c.restore(); }
// a label on a small white tag so it reads on the gingham
function tag(g, c, n, cx, cy, s, col, alpha = 1, bg = 'rgba(255,250,240,0.92)') { if (alpha <= 0) return; const m = M.lay(n, s); cx = M.clamp(cx, PIC.x0 + m.w / 2 + 10, PIC.x1 - m.w / 2 - 10); cy = M.clamp(cy, PIC.y0 + s, PIC.y1 - s); c.save(); c.globalAlpha *= alpha; c.fillStyle = 'rgba(60,30,20,0.25)'; c.beginPath(); c.roundRect(cx - m.w / 2 - 6, cy - (m.a + m.d) / 2 - 3, m.w + 12, m.a + m.d + 8, 8); c.fill(); c.fillStyle = bg; c.beginPath(); c.roundRect(cx - m.w / 2 - 6, cy - (m.a + m.d) / 2 - 5, m.w + 12, m.a + m.d + 8, 8); c.fill(); c.restore(); put(g, c, n, cx, cy, s, col, alpha); }
const pt = (x, y) => M.row(M.txt('('), M.num(x), M.op(','), M.gap(3), M.num(y), M.txt(')'));
const hat = v => M.txt(v === 'i' ? 'î' : 'ĵ');

MG.add({
  id: 'transform', stage: 'linalg', cmd: 'TRANSFORM!', hint: 'drag', time: 10, winText: 'Transformed!', hold: 1.8,
  card: {
    title: 'Matrices move the plane', ref: 'College', kind: 'Linear algebra',
    text: 'A 2 × 2 matrix is a recipe for moving every point of the plane at once. Lines stay straight, the grid stays evenly spaced, and the origin stays put.\n\nSo you only need to know where two arrows go: î = (1, 0), one step right, and ĵ = (0, 1), one step up. The first column of the matrix is where î lands, and the second column is where ĵ lands.\n\nFor example, the matrix with columns (0, 1) and (−1, 0) sends î up and ĵ left: a quarter turn. The corner (1, 1) of the unit square is î + ĵ, so it lands on (0, 1) + (−1, 0) = (−1, 1).',
    note: 'The columns of a matrix are where î and ĵ land. Every other point follows: (x, y) lands on x times column 1 plus y times column 2.',
    ask: 'Where does the matrix with columns (2, 0) and (1, 1) send î, ĵ, and the corner (1, 1)?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), { a, b, c, d } = p;
    // fit the unit square, both images and the far corner onto the blanket
    const xs = [0, 1, a, b, a + b], ys = [0, 1, c, d, c + d], x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    S.u = Math.min(72, (PIC.x1 - PIC.x0 - 60) / (x1 - x0), (PIC.y1 - PIC.y0 - 70) / (y1 - y0));
    S.ox = (PIC.x0 + PIC.x1) / 2 - (x0 + x1) / 2 * S.u; S.oy = (PIC.y0 + PIC.y1) / 2 + (y0 + y1) / 2 * S.u + 6;
    S.X = x => S.ox + x * S.u; S.Y = y => S.oy - y * S.u;
    // the matrix, with an id on every entry
    S.cells = { m11: M.num(a, 'm11'), m12: M.num(b, 'm12'), m21: M.num(c, 'm21'), m22: M.num(d, 'm22') };
    S.mat = M.mat([[S.cells.m11, S.cells.m12], [S.cells.m21, S.cells.m22]], 'mat');
    M.place(g, 'm', S.mat, 180, MY, 36, { col: INK }); M.inert(g, ['mat', 'nt', 'q']);
    S.col = { i: ['m11', 'm21'], j: ['m12', 'm22'] };
    // where î and ĵ are right now (they glide from (1, 0) and (0, 1) to the columns)
    S.mv = { i: null, j: null };
    S.cur = v => { const k = M.easeIO(kk(g, S.mv[v])), [fx, fy] = v === 'i' ? [1, 0] : [0, 1], [tx, ty] = v === 'i' ? [a, c] : [b, d]; return [M.lerp(fx, tx, k), M.lerp(fy, ty, k)]; };
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, e) => { S.hopT = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // an arrow that has landed is no longer a target (its tip may sit where the other arrow starts)
    S.zones = () => { for (const v of ['i', 'j']) { const [x, y] = S.cur(v); if (S['did' + v]) { if (g.s.mk.zones) delete g.s.mk.zones[v + 'hat']; delete g.s.mk.box[v + 'hat']; continue; } M.zone(g, v + 'hat', { x: S.X(x), y: S.Y(y), w: 54, h: 54 }); }
      const I = S.cur('i'), J = S.cur('j'); M.zone(g, 'corner', { x: S.X(I[0] + J[0]), y: S.Y(I[1] + J[1]), w: 54, h: 54 }); };
    S.zones();
    g.dur *= (2.6 + 1.05 * 3) / 8;
    // a column goes to its arrow: the column lights, a copy flies to its point and pins it, then the arrow's tip glides there
    const send = v => { const [tx, ty] = v === 'i' ? [a, c] : [b, d], col = v === 'i' ? XC : YC;
      return { drag: S.col[v], to: v + 'hat', reach: 70, busy: 0.1,
        then(g) { S['did' + v] = true; M.show(g, 1.5 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
          for (const id of S.col[v]) { S.cells[id].col = col; M.indicate(g, id, { col, dur: 0.4 * T, sc: 1.2 }); }
          M.circle(g, S.col[v], { col, dur: 0.55 * T, pad: 6 });
          const b0 = M.unionBox(S.col[v].map(id => M.box(g, id)));
          M.fly(g, { node: M.mat([[M.num(tx)], [M.num(ty)]]), from: [b0.x, b0.y], to: [S.X(tx), S.Y(ty)], delay: 0.2 * T, dur: 0.5 * T, arc: -50, s0: 36, s1: 20, col,
            then(g) { S['pin' + v] = g.t; g.sfx('pop'); g.burst(S.X(tx), S.Y(ty), [col, '#fff', SQ], 10, 110); } });
          M.at(g, [[0.75 * T, g => { S.mv[v] = { t0: g.t, dur: 0.6 * T }; g.sfx('sweep'); hop(g); }],
            [1.38 * T, g => { S['lab' + v] = g.t; M.sparkle(g, v + 'hat', { n: 10, cols: [col, '#fff', SQ] }); g.sfx('ding'); hop(g, 'laugh'); S.point = false; }]]); } }; };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.didi) out.push(send('i'));
        if (!S.didj) out.push(send('j'));
        // 3. the far corner is î + ĵ: tip to tail
        if (S.didi && S.didj && !S.corner) out.push({ tap: 'corner', busy: 0.1, askAt: 0.95 * T, after: 1.3 * T,
          ask: { v: pt(a + b, c + d), wrong: [pt(a + c, b + d), pt(a * b, c * d), pt(a + b + 1, c + d)] },
          then(g) { S.corner = true; M.show(g, 0.95 * T); S.point = true; hop(g, 'think');
            M.circle(g, 'corner', { col: SQ, dur: 0.5 * T }); S.tt = { t0: g.t + 0.1 * T, dur: 0.55 * T }; g.sfx('whoosh');
            S.q = M.row(M.txt('('), M.num(a + b), M.op(','), M.gap(3), M.num(c + d), M.txt(')')); S.q.alpha = 0;
            const nt = M.row(pt(a, c), M.op('+'), pt(b, d), M.op('='), S.q); nt.id = 'nt';
            const cx = S.X(a + b), cy = S.Y(c + d), ny = cy - 46 < PIC.y0 + 20 ? cy + 46 : cy - 46;
            M.place(g, 'note', nt, 180, ny, 22, { col: NOTE }); const w = M.lay(nt, 22).w; g.s.mk.ex.note.x = M.clamp(cx - w / 2, 12, 348 - w); M.relayout(g, 'note');
            M.writeIn(g, nt, { dur: 0.5 * T, delay: 0.35 * T }); },
          resolve(g) { M.show(g, 1.3 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.25 * T }); M.indicate(g, S.q, { delay: 0.2 * T, dur: 0.3 * T }); g.sfx('ding');
            M.at(g, [[0.45 * T, g => { S.fill = { t0: g.t, dur: 0.5 * T }; S.cornerT = g.t; g.sfx('magic'); hop(g);
                g.burst(S.X(a + b), S.Y(c + d), [SQ, '#fff', XC, YC], 16, 150); }],
              [0.9 * T, g => { const e = g.s.mk.ex.note; if (e) M.tween(g, e.node, { alpha: 0 }, 0.3 * T); hop(g, 'laugh'); S.point = false; }],
              [1.25 * T, g => { delete g.s.mk.ex.note; if (g.s.mk.prevNodes) delete g.s.mk.prevNodes.note; }]]); } });
        return out;
      },
      area(g) { return !S.didi ? ['m11', 'm21'] : !S.didj ? ['m12', 'm22'] : ['corner']; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s; S.zones();
    // while a column is dragged, its other number is carried along too
    const P0 = S.mk.press; for (const v of ['i', 'j']) for (const id of S.col[v]) { const n = S.cells[id]; const other = P0 && P0.dragging && S.col[v].includes(P0.id) && P0.id !== id; if (other) n.alpha = 0.28; else if (n.alpha === 0.28 && !(P0 && P0.id === id)) n.alpha = 1; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, { a, b } = p, X = S.X, Y = S.Y, u = S.u;
    c.drawImage(g.bake('tf_bg', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    ambient(c, t, 0);
    c.save(); c.beginPath(); c.roundRect(PIC.x0, PIC.y0, PIC.x1 - PIC.x0, PIC.y1 - PIC.y0, 10); c.clip();
    // the still grid: one square per unit, with the axes
    c.strokeStyle = 'rgba(120,60,40,0.22)'; c.lineWidth = 1;
    for (let i = Math.floor((PIC.x0 - S.ox) / u); i <= Math.ceil((PIC.x1 - S.ox) / u); i++) { c.beginPath(); c.moveTo(X(i), PIC.y0); c.lineTo(X(i), PIC.y1); c.stroke(); }
    for (let j = Math.floor((S.oy - PIC.y1) / u); j <= Math.ceil((S.oy - PIC.y0) / u); j++) { c.beginPath(); c.moveTo(PIC.x0, Y(j)); c.lineTo(PIC.x1, Y(j)); c.stroke(); }
    c.strokeStyle = 'rgba(90,40,30,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(PIC.x0, Y(0)); c.lineTo(PIC.x1, Y(0)); c.moveTo(X(0), PIC.y0); c.lineTo(X(0), PIC.y1); c.stroke();
    // the moving grid: every line i·î + s·ĵ and s·î + j·ĵ, following î and ĵ as they glide (only once something moves)
    const I = S.cur('i'), J = S.cur('j'), moved = S.mv.i || S.mv.j, P = (x, y) => [X(x * I[0] + y * J[0]), Y(x * I[1] + y * J[1])];
    if (moved) { c.save(); c.lineWidth = 1.6; const R = 8;
      for (let i = -R; i <= R; i++) for (const [col, f] of [['rgba(232,80,58,0.55)', s => P(i, s)], ['rgba(47,127,216,0.55)', s => P(s, i)]]) { c.strokeStyle = col; c.beginPath(); const A0 = f(-R), B0 = f(R); c.moveTo(A0[0], A0[1]); c.lineTo(B0[0], B0[1]); c.stroke(); }
      c.restore(); }
    // the unit square (stays as a dashed ghost), and its image filling in at the end
    c.save(); c.setLineDash([6, 5]); c.strokeStyle = 'rgba(160,100,20,0.85)'; c.lineWidth = 2; c.fillStyle = 'rgba(242,182,50,0.22)'; c.beginPath(); c.rect(X(0), Y(1), u, u); c.fill(); c.stroke(); c.restore();
    if (S.fill) { const k = M.easeIO(kk(g, S.fill)), q = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)]; c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(242,182,50,0.55)'; c.strokeStyle = '#b07810'; c.lineWidth = 2.5; c.beginPath(); q.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.stroke(); c.restore(); }
    // the column pins where î and ĵ will land
    for (const v of ['i', 'j']) { const pt0 = S['pin' + v]; if (pt0 == null) continue; const [tx, ty] = v === 'i' ? [p.a, p.c] : [p.b, p.d], k = M.clamp((t - pt0) / 0.25, 0, 1), col = v === 'i' ? XC : YC;
      c.save(); c.strokeStyle = col; c.lineWidth = 2.5; c.globalAlpha = 0.9; c.beginPath(); c.arc(X(tx), Y(ty), 9 * (1 + Math.sin(k * Math.PI) * 0.6), 0, 7); c.stroke(); c.restore(); }
    // tip to tail: a copy of ĵ slides from the origin onto the end of î, reaching the far corner
    const arrow = (x0, y0, x1, y1, col, w = 5, alpha = 1, dash) => { const L = Math.hypot(x1 - x0, y1 - y0); if (L < 3) return; const ux = (x1 - x0) / L, uy = (y1 - y0) / L, hw = Math.min(9, L * 0.3);
      c.save(); c.globalAlpha *= alpha; c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w; c.lineCap = 'round'; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - ux * hw, y1 - uy * hw); c.stroke(); c.setLineDash([]);
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - ux * hw * 1.9 - uy * hw, y1 - uy * hw * 1.9 + ux * hw); c.lineTo(x1 - ux * hw * 1.9 + uy * hw, y1 - uy * hw * 1.9 - ux * hw); c.closePath(); c.fill(); c.restore(); };
    if (S.tt) { const k = M.easeIO(kk(g, S.tt)), sx = M.lerp(0, I[0], k), sy = M.lerp(0, I[1], k); arrow(X(sx), Y(sy), X(sx + J[0]), Y(sy + J[1]), YC, 4, 0.75, [6, 5]); }
    // î and ĵ
    arrow(X(0), Y(0), X(I[0]), Y(I[1]), XC); arrow(X(0), Y(0), X(J[0]), Y(J[1]), YC);
    c.fillStyle = INK; c.beginPath(); c.arc(X(0), Y(0), 4, 0, 7); c.fill();
    // labels: the hat letters ride the tips; once landed, the tip also shows its coordinates
    for (const v of ['i', 'j']) { const [x, y] = S.cur(v), col = v === 'i' ? XC : YC, L = Math.hypot(x, y) || 1, nx = x / L, ny = y / L, lt = S['lab' + v];
      const lx = X(x) + nx * 20 + (v === 'i' ? 0 : -6), ly = Y(y) - ny * 20 - (v === 'i' ? 4 : 0);
      if (lt == null) tag(g, c, hat(v), lx, ly, 20, col);
      else { const k = M.clamp((t - lt) / 0.3, 0, 1), [tx, ty] = v === 'i' ? [p.a, p.c] : [p.b, p.d]; tag(g, c, M.row(hat(v), M.gap(4), pt(tx, ty)), lx + nx * 22, ly - ny * 6, 17 * (1 + Math.sin(k * Math.PI) * 0.3), col); } }
    // the far corner: a "?" pin until it is worked out, then a gold point with its coordinates
    const cx = X(I[0] + J[0]), cy = Y(I[1] + J[1]);
    if (!S.cornerT) { const pk = 0.5 + 0.5 * Math.sin(t * 5); c.save(); c.fillStyle = 'rgba(255,250,235,0.9)'; c.strokeStyle = SQ; c.lineWidth = 2.5; c.setLineDash([4, 3]); c.beginPath(); c.arc(cx, cy, 12 + pk * 1.5, 0, 7); c.fill(); c.stroke(); c.restore(); put(g, c, M.txt('?'), cx, cy, 16, '#a06a10'); }
    else { const k = M.clamp((t - S.cornerT) / 0.3, 0, 1); c.save(); c.fillStyle = SQ; c.strokeStyle = '#8a5a08'; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 7 * (1 + Math.sin(k * Math.PI) * 0.7), 0, 7); c.fill(); c.stroke(); c.restore();
      if (!S.mk.ex.note) tag(g, c, pt(a + b, p.c + p.d), cx + (a + b >= 0 ? 34 : -34), cy + (p.c + p.d >= 0 ? -16 : 16), 18, '#8a5a08', M.clamp((t - S.cornerT - 0.9) / 0.3, 0, 1)); }
    c.restore();
    M.drawEx(g, c, 'm');
    const ne = S.mk.ex.note; if (ne) { const b0 = M.box(g, 'nt'), w = ne.node.write, wk = w ? M.easeIO(M.clamp((t - w.t0) / w.dur, 0, 1)) : 1;
      if (b0 && (!w || t >= w.t0)) { c.save(); c.globalAlpha *= (ne.node.alpha ?? 1) * Math.min(1, wk * 4); c.fillStyle = 'rgba(74,42,26,0.88)'; c.beginPath(); c.roundRect(b0.x - b0.w / 2 - 8, b0.y - b0.h / 2 - 5, Math.max(20, (b0.w + 16) * wk), b0.h + 10, 10); c.fill(); c.restore(); }
      M.drawEx(g, c, 'note'); }
    // the bird points at the work while it is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', HX, HY - hk * 24, 1.2, { t, pose, expr }); else SCN.host(g, c, 'bird', HX, HY, 1.2);
    M.drawUI(g, c);
    // a dragged column carries both of its numbers, in brackets
    const P0 = S.mk.press; if (P0 && P0.dragging) for (const v of ['i', 'j']) { if (!S.col[v].includes(P0.id)) continue;
      const top = P0.id === S.col[v][0], other = S.cells[S.col[v][top ? 1 : 0]], b0 = M.box(g, P0.id), s = b0.s * 1.12, rh = s * 1.18, oy = P0.y - 20 + (top ? rh : -rh), m = M.lay(other, s);
      c.save(); c.shadowColor = 'rgba(58,22,64,0.35)'; c.shadowBlur = 12; c.shadowOffsetY = 6; M.draw(c, { ...other, alpha: 1, pop: null, dx: 0, dy: 0 }, P0.x - m.w / 2, oy + (m.a - m.d) / 2, s, { t, col: v === 'i' ? XC : YC }); c.restore();
      const y0 = Math.min(P0.y - 20, oy) - s * 0.6, y1 = Math.max(P0.y - 20, oy) + s * 0.6; c.save(); c.strokeStyle = INK; c.lineWidth = 3; for (const sd of [-1, 1]) { const x = P0.x + sd * s * 0.75; c.beginPath(); c.moveTo(x - sd * 6, y0); c.lineTo(x, y0); c.lineTo(x, y1); c.lineTo(x - sd * 6, y1); c.stroke(); } c.restore(); }
  },
});
function paintBg(c, W, H) {
  // autumn grass seen from above, with fallen leaves
  const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#d89a4a'); gr.addColorStop(0.2, '#b8a050'); gr.addColorStop(1, '#7a8a3a'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 300; i++) { const x = (i * 97) % W, y = (i * 61 + i * i * 3) % H; c.strokeStyle = i % 2 ? 'rgba(60,80,20,0.25)' : 'rgba(255,230,150,0.18)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 2, y - 5); c.stroke(); }
  // tree canopies at the top corners
  for (const [x, y, r, col] of [[20, 40, 90, '#c8562a'], [330, 20, 80, '#e0902a'], [180, -30, 70, '#b8442a']]) { c.fillStyle = 'rgba(40,20,10,0.25)'; c.beginPath(); c.arc(x + 8, y + 12, r, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    for (let i = 0; i < 14; i++) { const a = i * 0.9, rr = r * (0.3 + (i % 5) * 0.14); c.fillStyle = i % 2 ? 'rgba(255,220,120,0.25)' : 'rgba(120,30,10,0.2)'; c.beginPath(); c.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, r * 0.28, 0, 7); c.fill(); } }
  // the picnic-table plank for the matrix
  c.fillStyle = 'rgba(40,20,10,0.35)'; c.beginPath(); c.roundRect(76, 184, 220, 100, 12); c.fill();
  const pl = c.createLinearGradient(0, 176, 0, 276); pl.addColorStop(0, '#f6e2c0'); pl.addColorStop(1, '#e2c49a'); c.fillStyle = pl; c.beginPath(); c.roundRect(70, 176, 220, 98, 12); c.fill();
  c.strokeStyle = 'rgba(140,90,50,0.3)'; c.lineWidth = 1.5; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(82, 176 + k * 24); c.bezierCurveTo(140, 179 + k * 24, 220, 173 + k * 24, 278, 176 + k * 24); c.stroke(); }
  // the gingham blanket
  const { x0, x1, y0, y1 } = PIC; c.fillStyle = 'rgba(40,20,10,0.3)'; c.beginPath(); c.roundRect(x0 + 4, y0 + 7, x1 - x0, y1 - y0, 10); c.fill();
  c.fillStyle = '#fbf3e4'; c.beginPath(); c.roundRect(x0, y0, x1 - x0, y1 - y0, 10); c.fill();
  c.save(); c.beginPath(); c.roundRect(x0, y0, x1 - x0, y1 - y0, 10); c.clip(); c.fillStyle = 'rgba(220,120,90,0.12)';
  for (let x = x0; x < x1; x += 28) c.fillRect(x, y0, 14, y1 - y0); for (let y = y0; y < y1; y += 28) c.fillRect(x0, y, x1 - x0, 14); c.restore();
  c.strokeStyle = 'rgba(200,110,80,0.5)'; c.lineWidth = 3; c.setLineDash([8, 6]); c.beginPath(); c.roundRect(x0 + 5, y0 + 5, x1 - x0 - 10, y1 - y0 - 10, 7); c.stroke(); c.setLineDash([]);
  // a basket and an apple off the blanket
  c.save(); c.translate(300, 590); c.fillStyle = 'rgba(40,20,10,0.3)'; c.beginPath(); c.ellipse(4, 8, 34, 14, 0, 0, 7); c.fill(); c.fillStyle = '#b07a3a'; c.beginPath(); c.roundRect(-30, -16, 60, 30, 8); c.fill();
  c.strokeStyle = '#7a4e1e'; c.lineWidth = 2; for (let x = -24; x <= 24; x += 8) { c.beginPath(); c.moveTo(x, -14); c.lineTo(x, 12); c.stroke(); } c.strokeStyle = '#7a4e1e'; c.lineWidth = 4; c.beginPath(); c.arc(0, -16, 22, Math.PI, 0); c.stroke(); c.restore();
  c.fillStyle = '#d8342a'; c.beginPath(); c.arc(220, 606, 9, 0, 7); c.fill(); c.fillStyle = '#4a7a2a'; c.fillRect(219, 594, 2, 5);
}
function ambient(c, t) {
  // falling leaves drift across
  for (let i = 0; i < 7; i++) { const x = (i * 61 + t * (12 + i * 3) + Math.sin(t + i) * 20) % 400 - 20, y = (i * 113 + t * (22 + i * 4)) % 680 - 20, r = t * (1 + i * 0.3) + i;
    c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = ['#e8602a', '#f2a830', '#c8402a', '#e8c040'][i % 4]; c.beginPath(); c.ellipse(0, 0, 7, 3.5, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(80,30,10,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-7, 0); c.lineTo(7, 0); c.stroke(); c.restore(); }
}
