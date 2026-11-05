// geometry_circle.js — CIRCLE AREA! The area of a circle is π times the radius squared: A = πr².
// A chalkboard under the night sky, with an owl. A circle is chalked on it with its radius drawn and labelled r = 3, and
// under it the formula A = πr². Drag the 3 onto the r²: A = π × 3². Tap 3²: A = π × 9, and a square of side r appears
// on the radius, split into its 9 unit squares. Drag the π onto the 9: A = 9π, and the circle fills in (a bit more than
// 3 of those radius squares). The fonts have no π, so the π is drawn by hand over a gap in the expression.
// Level 0: r = 3. Level 1: r from 2 to 5. Level 2: r from 4 to 9. Medium mode: tapping r² asks for its value.
const M = MK, INK = '#fbf8ee', CX = 180, CY = 282, R = 86;
function pi(c, x, y, s, col, rot = 0) { // a hand-drawn π standing on the baseline y, centred on x
  c.save(); c.translate(x, y - s * 0.3); c.rotate(rot); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.beginPath();
  c.moveTo(-s * 0.3, -s * 0.18); c.quadraticCurveTo(-s * 0.2, -s * 0.28, 0, -s * 0.26); c.lineTo(s * 0.32, -s * 0.27);
  c.moveTo(-s * 0.13, -s * 0.26); c.quadraticCurveTo(-s * 0.12, s * 0.1, -s * 0.22, s * 0.3);
  c.moveTo(s * 0.13, -s * 0.26); c.quadraticCurveTo(s * 0.1, s * 0.22, s * 0.18, s * 0.3); c.quadraticCurveTo(s * 0.24, s * 0.33, s * 0.3, s * 0.24); c.stroke(); c.restore();
}

MG.add({
  id: 'geometry_circle', stage: 'geometry', cmd: 'CIRCLE AREA!', hint: 'drag', time: 9, mood: 'night', winText: 'Full moon!', hold: 1.4,
  card: {
    title: 'Area of a circle', ref: 'Grade 7', kind: 'Geometry',
    text: 'The radius r of a circle is the distance from its centre to its edge. The number π (pi) is about 3.14. It is the same for every circle.\n\nThe area of a circle is π × r × r, written A = πr². The small 2 means "squared": multiply r by itself.\n\nFor example, a circle with radius 3 has r² = 3 × 3 = 9, so its area is 9π square units, which is about 28.3.\n\nWhy? Draw a square on the radius, with sides r long. Its area is r². The circle covers a little more than 3 of those squares: exactly π of them.',
    note: 'Area of a circle = πr². Square the radius first, then multiply by π.',
    ask: 'What is the area of a circle with radius 5? With radius 10?',
  },
  init(g) {
    const S = g.s; M.setup(g); const rr = k => Math.floor(g.rand() * k);
    const r = g.level === 0 ? 3 : g.level === 1 ? [2, 4, 5][rr(3)] : 4 + rr(6); Object.assign(S, { r, st: 0, sqAt: null, fullAt: null });
    M.place(g, 'lab', M.row(M.vr('r', 'rl'), M.op('=', 'req'), M.num(r, 'rad')), CX + R / 2, CY - 14, 28, { col: INK }); M.inert(g, ['rl', 'req']);
    S.rowY = 446;
    const setRow = (...rest) => {
      M.place(g, 'row', M.row(M.vr('A', 'Av'), M.op('=', 'eq'), ...rest), 180, S.rowY, 44, { col: INK }); M.inert(g, ['Av', 'eq', 'pig']);
      const b = M.box(g, 'pig'); if (b) M.zone(g, 'pi', { x: b.x, y: b.y - b.s * 0.3, w: b.s * 0.7, h: b.s * 0.85, s: b.s }); else delete S.mk.box.pi;
    };
    const piGap = (id = 'pig') => M.gap(44 * 0.66, id); // M.gap has no id: give it one by hand
    const gapN = id => ({ k: 'gap', w: 44 * 0.66, id });
    setRow(gapN('pig'), M.sup(M.vr('r', 'rv'), M.num(2, 'two'), 'r2'));
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ drag: 'rad', to: ['r2', 'rv', 'two'], busy: 0.1, then(g) {
          S.st = 1; setRow(gapN('pig'), M.op('×'), M.sup(M.num(r, null, { pop: g.t }), M.num(2), 'sq')); g.sfx('pop'); } }];
        if (S.st === 1) return [{ tap: 'sq', busy: 0.1, ask: { v: r * r, wrong: [2 * r, r + 2, r, r * r + r] }, then() { },
          resolve(g) { S.st = 2; S.sqAt = g.t; setRow(gapN('pig'), M.op('×'), M.num(r * r, 'nine', { pop: g.t })); g.sfx('coin'); } }];
        if (S.st === 2) return [{ drag: 'pi', to: 'nine', busy: 0.1, then(g) {
          S.st = 3; S.fullAt = g.t; setRow(M.num(r * r, 'res', { pop: g.t }), gapN('pi2')); M.inert(g, ['res', 'pi2']); g.sfx('sparkle'); g.burst(CX, CY, ['#fff6c0', '#ffd45a', '#a8d8ff'], 16, 160); } }];
        return [];
      },
      area(g) { return S.st === 0 ? ['rad', 'r2'] : S.st === 1 ? 'sq' : ['pi', 'nine']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.bg(g, c, 'night'); SCN.panel(c, 'chalk', 180, 326, 324, 316, t);
    // the circle fills in once its area is found
    const fk = S.fullAt == null ? 0 : M.clamp((t - S.fullAt) / 0.4, 0, 1);
    if (fk > 0) { c.save(); c.globalAlpha = 0.5 * M.ease(fk); c.fillStyle = '#f2e6a8'; c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, R, 0, Math.PI * 2 * M.ease(fk)); c.closePath(); c.fill(); c.restore(); }
    // the square on the radius, r by r, with its r² unit squares
    const sk = S.sqAt == null ? 0 : M.clamp((t - S.sqAt) / 0.25, 0, 1);
    if (sk > 0) { const n = S.r, cs = R / n; c.save(); c.globalAlpha = M.ease(sk); c.fillStyle = 'rgba(140,200,255,0.3)'; c.fillRect(CX, CY - R, R, R);
      c.strokeStyle = 'rgba(180,220,255,0.75)'; c.lineWidth = 1.2; c.beginPath(); for (let i = 1; i < n; i++) { c.moveTo(CX + i * cs, CY - R); c.lineTo(CX + i * cs, CY); c.moveTo(CX, CY - R + i * cs); c.lineTo(CX + R, CY - R + i * cs); } c.stroke();
      c.strokeStyle = '#bfe0ff'; c.lineWidth = 2.5; c.strokeRect(CX, CY - R, R, R); c.restore(); }
    // chalk circle, centre dot, radius
    c.save(); c.strokeStyle = INK; c.lineCap = 'round'; c.lineWidth = 3.5; c.globalAlpha = 0.92;
    c.beginPath(); for (let k = 0; k <= 64; k++) { const a = k / 64 * Math.PI * 2, rr = R + Math.sin(a * 5) * 0.8; k ? c.lineTo(CX + Math.cos(a) * rr, CY + Math.sin(a) * rr) : c.moveTo(CX + rr, CY); } c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(CX, CY, 3.5, 0, 7); c.fill(); c.lineWidth = 3; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + R, CY); c.stroke(); c.restore();
    M.drawEx(g, c, 'lab'); M.drawEx(g, c, 'row');
    // the hand-drawn π wherever the expression has one (it hides while the player drags it, and wobbles on a miss)
    const drag = K.press && K.press.dragging && K.press.id === 'pi', bad = K.missInfo && (K.missInfo.tap === 'pi' || K.missInfo.drag === 'pi') && t - K.missAt < 0.6;
    for (const id of ['pig', 'pi2']) { const b = M.box(g, id), nd = M.node(g, id); if (!b || !nd) continue; if (id === 'pig' && drag) { c.globalAlpha = 0.3; }
      pi(c, b.x, b.y, b.s, id === 'pig' && bad ? M.BAD : INK, id === 'pig' && bad ? Math.sin((t - K.missAt) * 40) * 0.15 : 0); c.globalAlpha = 1; }
    if (drag) { c.save(); c.shadowColor = 'rgba(0,0,0,0.4)'; c.shadowBlur = 10; pi(c, K.press.x, K.press.y - 6, 52, INK); c.restore(); }
    SCN.host(g, c, 'owl', 300, 604, 1.25);
    M.drawUI(g, c);
  },
});
