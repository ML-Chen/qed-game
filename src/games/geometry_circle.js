// geometry_circle.js — CIRCLE AREA! The area of a circle is π times the radius squared: A = πr².
// A chalkboard under the night sky, with an owl. A circle is chalked on it with its radius drawn and labelled r = 3, and
// under it the formula A = πr². Every move acts its working out (show your work):
//   1. Drag the 3 onto the r²: the radius glows gold from the centre to the edge, and the 3 flies down and takes the
//      r's place: A = π × 3².
//   2. Tap 3²: a square with side r grows on the radius, row by row, and "3 × 3 = 9" writes itself under the circle;
//      the 9 flies up into place: A = π × 9.
//   3. Drag the π onto the 9: the π glides round behind it (A = 9π), four radius squares are outlined around the circle
//      and the circle fills in a sweep, covering a bit more than 3 of them; "≈ 28.3" writes itself beside the answer.
// The fonts have no π, so the π is drawn by hand over a gap in the expression (it follows the gap when it glides).
// Level 0: r = 3. Level 1: r is 2, 4 or 5. Level 2: r from 4 to 9. Medium mode: tapping r² asks for its value.
const M = MK, INK = '#fbf8ee', CX = 180, CY = 282, R = 86, CH = '#ffe27a', NOTEY = 404;
function pi(c, x, y, s, col, rot = 0) { // a hand-drawn π standing on the baseline y, centred on x
  c.save(); c.translate(x, y - s * 0.3); c.rotate(rot); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.beginPath();
  c.moveTo(-s * 0.3, -s * 0.18); c.quadraticCurveTo(-s * 0.2, -s * 0.28, 0, -s * 0.26); c.lineTo(s * 0.32, -s * 0.27);
  c.moveTo(-s * 0.13, -s * 0.26); c.quadraticCurveTo(-s * 0.12, s * 0.1, -s * 0.22, s * 0.3);
  c.moveTo(s * 0.13, -s * 0.26); c.quadraticCurveTo(s * 0.1, s * 0.22, s * 0.18, s * 0.3); c.quadraticCurveTo(s * 0.24, s * 0.33, s * 0.3, s * 0.24); c.stroke(); c.restore();
}

// where a gliding node is drawn right now (the kit's glide: 0.32 s, ease-out), for art drawn under or over it
const glideOff = (n, t) => { const q = n && n._glide; if (!q) return { x: 0, y: 0 }; const k = 1 - MK.ease(MK.clamp((t - q.t0) / 0.32, 0, 1)); return { x: q.dx * k, y: q.dy * k }; };
MG.add({
  id: 'geometry_circle', stage: 'geometry', cmd: 'CIRCLE AREA!', hint: 'drag', time: 9, mood: 'night', winText: 'Full moon!', hold: 1.4,
  card: {
    title: 'Area of a circle', ref: 'Grade 7', kind: 'Geometry',
    text: 'The radius r of a circle is the distance from its centre to its edge. The number π (pi) is about 3.14. It is the same for every circle.\n\nThe area of a circle is π × r × r, written A = πr². The small 2 means "squared": multiply r by itself.\n\nFor example, a circle with radius 3 has r² = 3 × 3 = 9, so its area is 9π square units, which is about 28.3.\n\nWhy? Draw a square on the radius, with sides r long. Its area is r². The circle covers a little more than 3 of those squares: exactly π of them.',
    note: 'Area of a circle = πr². Square the radius first, then multiply by π.',
    ask: 'What is the area of a circle with radius 5? With radius 10?',
  },
  init(g) {
    const S = g.s; M.setup(g); const rr = k => Math.floor(g.rand() * k), T = M.pace(g);
    const r = g.level === 0 ? 3 : g.level === 1 ? [2, 4, 5][rr(3)] : 4 + rr(6); Object.assign(S, { r, st: 0, sqAt: null, fullAt: null, quadAt: null });
    M.place(g, 'lab', M.row(M.vr('r', 'rl'), M.op('=', 'req'), M.num(r, 'rad')), CX + R / 2, CY - 14, 28, { col: INK }); M.inert(g, ['rl', 'req']);
    S.rowY = 446;
    // the same node objects are reused from row to row, so the symbols that stay glide to their new places
    S.Av = M.vr('A', 'Av'); S.eq = M.op('=', 'eq'); S.pg = { k: 'gap', w: 44 * 0.66, id: 'pig' }; S.two = M.num(2, 'two'); S.rv = M.vr('r', 'rv');
    const setRow = (...rest) => {
      M.place(g, 'row', M.row(S.Av, S.eq, ...rest), 180, S.rowY, 44, { col: INK }); M.inert(g, ['Av', 'eq', 'pig', 'pi2', 'res']);
      const b = M.box(g, 'pig'); if (b) M.zone(g, 'pi', { x: b.x, y: b.y - b.s * 0.3, w: b.s * 0.7, h: b.s * 0.85, s: b.s }); else delete S.mk.box.pi;
    };
    setRow(S.pg, M.sup(S.rv, S.two, 'r2'));
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    M.play(g, {
      moves(g) {
        // 1. put the radius into the formula: the radius glows from the centre out, and its length drops into the r
        if (S.st === 0) return [{ drag: 'rad', to: ['r2', 'rv', 'two'], busy: 0.1, then(g) {
          S.st = 1; M.show(g, 1.0 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
          S.radAt = g.t; M.circle(g, 'rad', { dur: 0.45 * T, col: CH }); M.circle(g, 'rv', { delay: 0.3 * T, dur: 0.45 * T, col: CH });
          M.tween(g, S.rv, { alpha: 0 }, 0.2 * T, { delay: 0.55 * T });
          M.fly(g, { node: M.num(r, null, { col: CH }), from: 'rad', to: 'rv', delay: 0.3 * T, dur: 0.45 * T, arc: -50, s0: 28, s1: 44,
            then(g) { S.rn = M.num(r, 'rn', { _born: -1, pop: g.t, col: CH }); S.times = M.op('×', 'tm'); setRow(S.pg, S.times, M.sup(S.rn, S.two, 'sq'));
              M.tween(g, S.rn, { hl: 0 }, 0.1); M.sparkle(g, 'rn', { n: 8 }); g.sfx('pop'); hop(g); } }); } }];
        // 2. square the radius: a square of side r grows on the radius row by row while "r × r = r²" writes itself
        if (S.st === 1) return [{ tap: 'sq', busy: 0.1, askAt: 0.75 * T, after: 1.0 * T, ask: { v: r * r, wrong: [2 * r, r + 2, r, r * r + r] },
          then(g) { S.st = 2; M.show(g, 0.75 * T); hop(g, 'think'); M.indicate(g, 'sq', { dur: 0.4 * T, sc: 1.12, col: '#bfe0ff' });
            S.sqAt = g.t + 0.1 * T; S.sqDur = 0.6 * T; g.sfx('tap');
            S.q = M.num(r * r, 'q', { alpha: 0, col: CH });
            S.note = M.row(M.num(r), M.op('×'), M.num(r), M.op('='), S.q);
            M.place(g, 'note', S.note, CX, NOTEY, 30, { col: '#bfe0ff' }); M.writeIn(g, S.note, { dur: 0.45 * T, delay: 0.15 * T }); },
          resolve(g) { M.show(g, 1.0 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.22 * T }); M.indicate(g, S.q, { delay: 0.18 * T, dur: 0.35 * T }); g.sfx('ding'); S.sqLit = g.t;
            M.at(g, [[0.5 * T, g => { const from = { ...M.box(g, 'q') }; M.tween(g, S.note, { alpha: 0 }, 0.3 * T);
              for (const q of [S.rn, S.two]) M.tween(g, q, { alpha: 0 }, 0.15 * T);
              M.fly(g, { node: M.num(r * r, null, { col: CH }), from: [from.x, from.y], to: 'sq', dur: 0.36 * T, arc: 24, s0: 30, s1: 44,
                then(g) { delete S.mk.ex.note; S.nine = M.num(r * r, 'nine', { _born: -1, pop: g.t }); setRow(S.pg, S.times, S.nine); M.sparkle(g, 'nine', { n: 10, cols: ['#bfe0ff', '#fff', CH] }); g.sfx('coin'); hop(g); } }); }]]); } }];
        // 3. π times r²: the π glides round to the back (A = 9π), and the circle fills: a bit more than 3 of the 4 radius squares
        if (S.st === 2) return [{ drag: 'pi', to: 'nine', busy: 0.1, then(g) {
          S.st = 3; M.show(g, 1.6 * T); hop(g); g.sfx('swoosh');
          M.tween(g, S.times, { alpha: 0 }, 0.15 * T);
          M.at(g, [[0.15 * T, g => { S.pg.id = 'pi2'; S.nine.id = 'res'; setRow(S.nine, M.gap(4), S.pg); M.indicate(g, S.nine, { dur: 0.4 * T, sc: 1.15, col: CH }); }],
            [0.4 * T, g => { S.quadAt = g.t; g.sfx('tap'); }],
            [0.6 * T, g => { S.fullAt = g.t; S.fullDur = 0.6 * T; g.sfx('magic'); }],
            [1.2 * T, g => { g.sfx('sparkle'); hop(g, 'laugh'); S.point = false; g.burst(CX, CY, ['#fff6c0', '#ffd45a', '#a8d8ff'], 16, 160); M.sparkle(g, 'row', { n: 10 });
              M.note(g, { node: M.row(M.op('≈'), M.num((r * r * Math.PI).toFixed(1))), at: 'res', off: [22, -46], s: 24, col: '#bfe0ff', write: 0.35 * T, hold: 0.9 * T, fade: 0.3 * T }); }]]); } }];
        return [];
      },
      area(g) { return S.st === 0 ? ['rad', 'r2'] : S.st === 1 ? 'sq' : ['pi', 'nine']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, T = M.pace(g);
    SCN.bg(g, c, 'night'); SCN.panel(c, 'chalk', 180, 326, 324, 316, t);
    // move 3: the four radius squares around the circle are outlined, then the circle fills in a sweep (a bit over 3 of them)
    const qk = S.quadAt == null ? 0 : M.clamp((t - S.quadAt) / (0.3 * T), 0, 1);
    if (qk > 0) { c.save(); c.globalAlpha = M.ease(qk) * 0.8; c.strokeStyle = '#bfe0ff'; c.lineWidth = 2; c.setLineDash([6, 5]);
      for (const [dx, dy] of [[-1, -1], [-1, 0], [0, 0]]) c.strokeRect(CX + dx * R, CY + dy * R, R, R); c.restore(); }
    const fk = S.fullAt == null ? 0 : M.clamp((t - S.fullAt) / (S.fullDur || 0.4), 0, 1);
    if (fk > 0) { c.save(); c.globalAlpha = 0.5; c.fillStyle = '#f2e6a8'; c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, R, 0, Math.PI * 2 * M.easeIO(fk)); c.closePath(); c.fill(); c.restore(); }
    // move 2: the square on the radius, r by r, grows row by row into its r² unit squares
    if (S.sqAt != null && t > S.sqAt) { const n = S.r, cs = R / n, rk = M.clamp((t - S.sqAt) / S.sqDur, 0, 1) * n, lit = S.sqLit != null ? Math.max(0, 1 - (t - S.sqLit) / (0.6 * T)) : 0;
      c.save(); for (let j = 0; j < n; j++) { const k = M.clamp(rk - j, 0, 1); if (k <= 0) break; const y = CY - (j + 1) * cs;
        c.fillStyle = `rgba(140,200,255,${0.3 + 0.3 * lit})`; c.fillRect(CX, y + cs * (1 - M.ease(k)), R, cs * M.ease(k));
        c.strokeStyle = 'rgba(190,224,255,0.8)'; c.lineWidth = 1.2; c.beginPath(); for (let i = 1; i < n; i++) { c.moveTo(CX + i * cs, y + cs * (1 - M.ease(k))); c.lineTo(CX + i * cs, y + cs); } c.moveTo(CX, y + cs); c.lineTo(CX + R, y + cs); c.stroke(); }
      if (rk >= n) { c.strokeStyle = '#bfe0ff'; c.lineWidth = 2.5; c.strokeRect(CX, CY - R, R, R); } c.restore(); }
    // chalk circle, centre dot, radius (glowing from the centre out on move 1)
    c.save(); c.strokeStyle = INK; c.lineCap = 'round'; c.lineWidth = 3.5; c.globalAlpha = 0.92;
    c.beginPath(); for (let k = 0; k <= 64; k++) { const a = k / 64 * Math.PI * 2, rr = R + Math.sin(a * 5) * 0.8; k ? c.lineTo(CX + Math.cos(a) * rr, CY + Math.sin(a) * rr) : c.moveTo(CX + rr, CY); } c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(CX, CY, 3.5, 0, 7); c.fill(); c.lineWidth = 3; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + R, CY); c.stroke(); c.restore();
    if (S.radAt != null && t - S.radAt < 0.9 * T) { const k = (t - S.radAt) / (0.9 * T), e = M.easeIO(Math.min(1, k / 0.45)); c.save(); c.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3;
      c.strokeStyle = CH; c.shadowColor = CH; c.shadowBlur = 12; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + R * e, CY); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'lab'); M.drawEx(g, c, 'row'); M.drawEx(g, c, 'note');
    // the hand-drawn π wherever the expression has one (it follows its gap as it glides, hides while dragged, wobbles on a miss)
    const drag = K.press && K.press.dragging && K.press.id === 'pi', bad = K.missInfo && (K.missInfo.tap === 'pi' || K.missInfo.drag === 'pi') && t - K.missAt < 0.6;
    for (const id of ['pig', 'pi2']) { const b = M.box(g, id), nd = M.node(g, id); if (!b || !nd) continue; if (id === 'pig' && drag) { c.globalAlpha = 0.3; }
      const won = id === 'pi2' && S.fullAt != null ? M.clamp((t - S.fullAt) / 0.3, 0, 1) * Math.max(0, 1 - (t - S.fullAt - 0.3) / 0.6) : 0;
      const gk = id === 'pi2' && nd._glide && nd._glide.dx ? 1 - glideOff(nd, t).x / nd._glide.dx : 1; // the π hops over the 9 as it moves to the back
      const go = glideOff(nd, t); pi(c, b.x + go.x, b.y + go.y - Math.sin(won * Math.PI) * 6 - Math.sin(M.clamp(gk, 0, 1) * Math.PI) * 34, b.s, id === 'pig' && bad ? M.BAD : won > 0.05 ? CH : INK, id === 'pig' && bad ? Math.sin((t - K.missAt) * 40) * 0.15 : 0); c.globalAlpha = 1; }
    if (drag) { c.save(); c.shadowColor = 'rgba(0,0,0,0.4)'; c.shadowBlur = 10; pi(c, K.press.x, K.press.y - 6, 52, INK); c.restore(); }
    // the owl points at the board while the work is shown, and hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 300, 604 - hopK * 24, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', 300, 604, 1.25); } catch (e) { }
    M.drawUI(g, c);
  },
});
