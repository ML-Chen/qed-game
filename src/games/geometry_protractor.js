// geometry_protractor.js — PROTRACTOR! Measure an angle: put the protractor's centre on the vertex, line its baseline up
// with one ray, then count the degrees from the 0 that sits on that ray.
// A blueprint pinned to an architect's desk at night, lit by a lamp, with a fox. The angle is drawn in white on the blue
// paper; an amber protractor lies on the desk below it. Every move acts its working out:
//   1. Drag the protractor onto the vertex: it glides up and grows to full size, its centre mark lands on the vertex with
//      a click, then it turns until its baseline lies along the first ray (which glows) and the second ray lights up.
//   2. Tap the 0 that sits on the first ray (the inner, yellow scale when that ray points right; the outer, white scale
//      when it points left): the 0 is circled, a red needle sweeps from that 0 around to the second ray while a counter
//      at its tip rolls up 0, 1, 2, ... 65, the wedge between the rays fills, and "65°" flies into the angle.
// Wrong move: tapping the 0 at the other end (reading the wrong scale, the classic 115° for 65°) wobbles and flashes a
// red wedge from that side. Level 0: tens, first ray pointing right. Level 1: fives, the angle drawn tilted. Level 2:
// fives, tilted, and the first ray points left, so the reading comes from the outer scale. Medium: the tray asks for the
// reading once the 0 is chosen, then the needle sweeps to check it.
const M = MK, VX = 180, VY = 404, R = 132, RAY = 156, PAPER = '#1f4f8f', CHALK = '#f4f8ff', AMBER = '#ffb347', NEEDLE = '#ff4a3a';
const rad = d => d * Math.PI / 180;
const pt = (x, y, deg, r) => [x + r * Math.cos(rad(deg)), y - r * Math.sin(rad(deg))];
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return { th: [40, 50, 60, 70, 110, 120, 130, 140][r(8)], tilt: 0, left: false };
  let th = 35 + 5 * r(23); if (th === 90) th = 85; // 35..145 in fives
  const tilt = (6 + r(8)) * (r(2) ? 1 : -1);
  return { th, tilt: L === 1 ? tilt : Math.round(tilt * 0.8), left: L === 2 };
}
function paintBg(c, W, H) {
  // the desk
  const wd = c.createLinearGradient(0, 0, 0, H); wd.addColorStop(0, '#3a2418'); wd.addColorStop(1, '#2a160e'); c.fillStyle = wd; c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(255,200,140,0.06)'; c.lineWidth = 2; for (let y = 6; y < H; y += 13) { c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(120, y + 4, 240, y - 4, W, y + 2); c.stroke(); }
  // the blueprint sheet
  c.save(); c.translate(180, 384); c.rotate(-0.012);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(-170, -212, 344, 436);
  const pp = c.createLinearGradient(0, -216, 0, 216); pp.addColorStop(0, '#2a62a8'); pp.addColorStop(1, '#1a4684'); c.fillStyle = pp; c.fillRect(-172, -216, 344, 432);
  c.strokeStyle = 'rgba(220,235,255,0.10)'; c.lineWidth = 1; for (let x = -172; x <= 172; x += 16) { c.beginPath(); c.moveTo(x, -216); c.lineTo(x, 216); c.stroke(); } for (let y = -216; y <= 216; y += 16) { c.beginPath(); c.moveTo(-172, y); c.lineTo(172, y); c.stroke(); }
  c.strokeStyle = 'rgba(220,235,255,0.22)'; for (let x = -172; x <= 172; x += 80) { c.beginPath(); c.moveTo(x, -216); c.lineTo(x, 216); c.stroke(); }
  c.strokeStyle = 'rgba(230,240,255,0.45)'; c.lineWidth = 2; c.strokeRect(-162, -206, 324, 412);
  // a faint title block and a sketched floor plan in the corner, as on a real blueprint
  c.strokeStyle = 'rgba(230,240,255,0.25)'; c.strokeRect(70, 150, 86, 46); c.beginPath(); c.moveTo(70, 166); c.lineTo(156, 166); c.stroke();
  c.strokeRect(-150, 140, 70, 56); c.beginPath(); c.moveTo(-150, 168); c.lineTo(-110, 168); c.moveTo(-110, 140); c.lineTo(-110, 196); c.stroke();
  for (const [x, y] of [[-158, -202], [158, -202], [-158, 202], [158, 202]]) { c.fillStyle = '#c84a3a'; c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.arc(x - 1.5, y - 1.5, 1.6, 0, 7); c.fill(); }
  c.restore();
  // pencils on the desk
  c.save(); c.translate(56, 612); c.rotate(-0.15); c.fillStyle = '#f2c23a'; c.fillRect(-40, -5, 80, 10); c.fillStyle = '#f4d8a8'; c.beginPath(); c.moveTo(40, -5); c.lineTo(54, 0); c.lineTo(40, 5); c.fill(); c.fillStyle = '#3a2a2a'; c.beginPath(); c.moveTo(50, -1.5); c.lineTo(54, 0); c.lineTo(50, 1.5); c.fill(); c.fillStyle = '#e88a9a'; c.fillRect(-48, -5, 8, 10); c.restore();
}
// the protractor, drawn with its centre mark at (x, y), turned by rot degrees, scaled by sc
function protractor(c, x, y, rot, sc, o = {}) {
  c.save(); c.translate(x, y); c.rotate(-rad(rot)); c.scale(sc, sc);
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.arc(4, 8, R, Math.PI, 0); c.lineTo(R + 4, 18); c.lineTo(-R + 4, 18); c.closePath(); c.fill();
  const gr = c.createLinearGradient(0, -R, 0, 10); gr.addColorStop(0, 'rgba(255,190,90,0.48)'); gr.addColorStop(1, 'rgba(255,150,60,0.4)');
  c.fillStyle = gr; c.beginPath(); c.arc(0, 0, R, Math.PI, 0); c.lineTo(R, 12); c.lineTo(-R, 12); c.closePath(); c.fill();
  c.strokeStyle = '#c86a10'; c.lineWidth = 2.5; c.stroke();
  // the window in the middle
  c.fillStyle = 'rgba(31,79,143,0.55)'; c.beginPath(); c.arc(0, 0, R - 70, Math.PI, 0); c.closePath(); c.fill(); c.strokeStyle = 'rgba(200,106,16,0.8)'; c.lineWidth = 1.5; c.stroke();
  // ticks every 5 degrees, longer every 10 and 30
  c.strokeStyle = '#5a2a08'; for (let d = 0; d <= 180; d += 5) { const a = rad(d), L = d % 30 === 0 ? 18 : d % 10 === 0 ? 12 : 7; c.lineWidth = d % 10 ? 1.2 : 1.8;
    c.beginPath(); c.moveTo(Math.cos(a) * R, -Math.sin(a) * R); c.lineTo(Math.cos(a) * (R - L), -Math.sin(a) * (R - L)); c.stroke();
    if (d % 10 === 0) { c.beginPath(); c.moveTo(Math.cos(a) * (R - 64), -Math.sin(a) * (R - 64)); c.lineTo(Math.cos(a) * (R - 70), -Math.sin(a) * (R - 70)); c.stroke(); } }
  // the baseline and the centre mark
  c.strokeStyle = o.baseGlow ? '#fff2a0' : '#5a2a08'; c.lineWidth = o.baseGlow ? 3 : 1.5; if (o.baseGlow) { c.shadowColor = '#fff2a0'; c.shadowBlur = 12; } c.beginPath(); c.moveTo(-R + 6, 0); c.lineTo(R - 6, 0); c.stroke(); c.shadowBlur = 0;
  c.strokeStyle = '#5a2a08'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -10); c.lineTo(0, 8); c.moveTo(-8, 0); c.lineTo(8, 0); c.stroke(); c.beginPath(); c.arc(0, 0, 4, 0, 7); c.stroke();
  c.restore();
  // scale numbers stay upright: the outer (white) scale counts from the left end, the inner (yellow) one from the right
  if (sc > 0.9) for (let d = 0; d <= 180; d += 30) for (const [inner, r0] of [[false, R - 21], [true, R - 51]]) {
    const v = inner ? d : 180 - d, dd = d === 0 ? 8 : d === 180 ? 172 : d, [px, py] = pt(x, y, rot + dd, r0 * sc), big = v === 0, sz = big ? 22 : 18;
    if (big && o.hideZero) continue;
    c.save(); c.font = MK.NUMF(sz, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(40,16,4,0.85)'; c.lineJoin = 'round';
    if (big) { c.fillStyle = 'rgba(40,16,4,0.7)'; c.beginPath(); c.arc(px, py, 14, 0, 7); c.fill(); } c.strokeText(String(v), px, py); c.fillStyle = inner ? '#ffe46a' : '#ffffff'; c.fillText(String(v), px, py); c.restore(); }
}

MG.add({
  id: 'geometry_protractor', stage: 'geometry', cmd: 'PROTRACTOR!', hint: 'drag', time: 9, mood: 'night', winText: 'Measured!', hold: 1.7,
  card: {
    title: 'Measuring angles', ref: 'Grade 4', kind: 'Geometry',
    text: 'An angle is the amount of turn between two rays that start at the same point, the vertex. We measure it in degrees (°). A full turn is 360°, and a straight line is 180°.\n\nA protractor is a half circle marked from 0° to 180°. Put its centre mark on the vertex and line up its straight edge with one ray. Then start at the 0 that sits on that ray and count around to the other ray.\n\nA protractor has two scales, one counting from each end. Always read the scale that starts at 0 on your first ray. Reading the other one gives 180° minus the angle: 115° instead of 65°.',
    note: 'Centre on the vertex, baseline on one ray, and count up from the 0 on that ray.',
    ask: 'An angle is less than a right angle (90°). Should the reading be 40° or 140°? What is 180° − 65°?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g), { th, tilt, left } = S;
    S.rho = tilt;                                  // the protractor's final turn: its baseline lies along the first ray
    S.base = left ? 180 + tilt : tilt;             // the first ray's direction (degrees, counter-clockwise from east)
    S.other = left ? S.base - th : S.base + th;    // the second ray's direction
    S.pr = { x: 196, y: 560, rot: tilt + (left ? 14 : -14), sc: 0.56 }; S.prFrom = null;
    M.zone(g, 'pc', { x: S.pr.x, y: S.pr.y - 30, w: 150, h: 76 });
    M.zone(g, 'vx', { x: VX, y: VY, w: 36, h: 36 });
    const ends = [pt(VX, VY, S.base, RAY), pt(VX, VY, S.other, RAY)];
    M.zone(g, 'r1', { x: (VX + ends[0][0]) / 2, y: (VY + ends[0][1]) / 2, w: 50, h: 40 });
    M.zone(g, 'r2', { x: (VX + ends[1][0]) / 2, y: (VY + ends[1][1]) / 2, w: 50, h: 40 });
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // the two zeros: the right one starts the yellow inner scale, the left one the white outer scale
    const zeroAt = inner => pt(VX, VY, S.rho + (inner ? 8 : 172), (inner ? R - 51 : R - 21));
    const placeZeros = () => { const good = zeroAt(!left), bad = zeroAt(left); M.zone(g, 'z0', { x: good[0], y: good[1], w: 40, h: 34 }); M.zone(g, 'z1', { x: bad[0], y: bad[1], w: 40, h: 34 }); };
    S.zeroAt = zeroAt;
    const sweepLen = (0.55 + th / 180 * 0.7) * T, rest = sweepLen + 1.0 * T;
    M.play(g, {
      moves(g) {
        if (!S.placed) return [{ drag: 'pc', to: 'vx', area: [VX - 80, VY - 90, VX + 80, VY + 50], busy: 0.1,
          then(g) { S.placed = true; M.show(g, 1.15 * T); S.prFrom = { x: S.fx ?? S.pr.x, y: S.fy != null ? S.fy + 20 : S.pr.y, rot: S.pr.rot, sc: S.pr.sc, t0: g.t }; g.sfx('swoosh'); hop(g, 'think');
            delete S.mk.box.pc; delete S.mk.zones.pc;
            M.at(g, [[0.42 * T, g => { g.sfx('tap'); M.sparkle(g, [VX, VY], { n: 8 }); }],
              [0.8 * T, g => { S.baseAt = g.t; g.sfx('ding'); hop(g, 'wow'); placeZeros(); }],
              [0.95 * T, g => { S.otherAt = g.t; }]]); } }];
        if (!S.read) return [{ tap: 'z0', busy: 0.1, askAt: 0.45 * T, after: rest, ask: { v: th, wrong: [180 - th, th + 10, th - 10, 180 - th + 10].filter(v => v > 0 && v < 180 && v !== th) },
          then(g) { S.read = true; M.show(g, 0.45 * T); M.circle(g, 'z0', { dur: 0.45 * T, col: '#fff2a0' }); S.zeroLit = g.t; g.sfx('pop'); hop(g, 'think'); },
          resolve(g) { M.show(g, rest); S.sweep = { t0: g.t, dur: sweepLen }; S.point = true; g.sfx('sweep');
            const ticks = []; for (let v = 10; v < th; v += 10) ticks.push([sweepLen * M.clamp(v / th, 0, 1) * 0.98, g => g.sfx('tap', { vol: 0.4 })]); M.at(g, ticks);
            M.at(g, [[sweepLen + 0.05, g => { S.landed = g.t; g.sfx('ding'); hop(g, 'wow'); M.sparkle(g, [S.tipX, S.tipY], { n: 10 }); }],
              [sweepLen + 0.3 * T, g => { S.final = g.t; M.sparkle(g, [S.tipX, S.tipY], { n: 14, cols: ['#fff2a0', '#fff', AMBER] }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; }]]); } }];
        return [];
      },
      area(g) { return !S.placed ? ['pc', 'vx'] : ['z0']; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s, T = M.pace(g);
    // the protractor's glide: up to the vertex and full size, then a turn onto the first ray
    if (S.prFrom) { const k1 = M.easeIO((g.t - S.prFrom.t0) / (0.42 * T)), k2 = M.easeIO((g.t - S.prFrom.t0 - 0.45 * T) / (0.35 * T));
      S.pr.x = M.lerp(S.prFrom.x, VX, k1); S.pr.y = M.lerp(S.prFrom.y, VY, k1); S.pr.sc = M.lerp(S.prFrom.sc, 1, k1); S.pr.rot = M.lerp(S.prFrom.rot, S.rho, k2); }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); g.s.fx = x; g.s.fy = y; }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), mk = S.mk;
    c.drawImage(g.bake('protractor_bg', paintBg), 0, 0, 360, 640);
    // lamp light pooling on the sheet
    const lg = c.createRadialGradient(250, 250, 10, 250, 250, 300); lg.addColorStop(0, `rgba(255,236,190,${0.13 + 0.01 * Math.sin(t * 2)})`); lg.addColorStop(1, 'rgba(255,236,190,0)'); c.fillStyle = lg; c.fillRect(0, 0, 360, 640);
    // the wedge between the rays fills as the needle sweeps
    const sw = S.sweep ? M.clamp((t - S.sweep.t0) / S.sweep.dur, 0, 1) : 0, ang = S.base + (S.other - S.base) * M.easeIO(sw);
    if (S.sweep) { c.save(); c.fillStyle = 'rgba(255,90,70,0.28)'; c.beginPath(); c.moveTo(VX, VY); const a0 = -rad(S.base), a1 = -rad(ang); c.arc(VX, VY, R - 72, a0, a1, a1 < a0); c.closePath(); c.fill(); c.restore(); }
    // the angle in chalk: two rays from the vertex, with a small arc
    const lit1 = S.baseAt != null ? M.clamp((t - S.baseAt) / (0.3 * T), 0, 1) : 0, lit2 = S.otherAt != null ? M.clamp((t - S.otherAt) / (0.3 * T), 0, 1) : 0;
    for (const [d, lit] of [[S.base, lit1], [S.other, lit2]]) { const [ex, ey] = pt(VX, VY, d, RAY); c.save(); c.strokeStyle = lit ? M.mix(CHALK, '#fff2a0', lit) : CHALK; c.lineWidth = 4; c.lineCap = 'round'; if (lit) { c.shadowColor = '#fff2a0'; c.shadowBlur = 10 * lit; }
      c.beginPath(); c.moveTo(VX, VY); c.lineTo(ex, ey); c.stroke(); c.fillStyle = c.strokeStyle; c.beginPath(); const a = -rad(d); c.moveTo(ex + Math.cos(a) * 10, ey + Math.sin(a) * 10); c.lineTo(ex + Math.cos(a + 2.5) * 10, ey + Math.sin(a + 2.5) * 10); c.lineTo(ex + Math.cos(a - 2.5) * 10, ey + Math.sin(a - 2.5) * 10); c.fill(); c.restore(); }
    c.save(); c.strokeStyle = 'rgba(244,248,255,0.8)'; c.lineWidth = 2.5; c.beginPath(); { const a0 = -rad(S.base), a1 = -rad(S.other); c.arc(VX, VY, 26, a0, a1, a1 < a0); } c.stroke(); c.fillStyle = CHALK; c.beginPath(); c.arc(VX, VY, 5, 0, 7); c.fill(); c.restore();
    // a wrong zero acted out: a red wedge from the far end for a moment (the other scale counts from there)
    if (mk.missInfo && mk.missInfo.tap === 'z1' && t - mk.missAt < 0.8) { const a = 1 - (t - mk.missAt) / 0.8, far = S.left ? S.rho : S.rho + 180; c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(255,60,60,0.45)'; c.beginPath(); c.moveTo(VX, VY); const a0 = -rad(far), a1 = -rad(S.other); c.arc(VX, VY, R - 8, a0, a1, a1 < a0); c.closePath(); c.fill(); c.restore(); }
    // the protractor follows a finger that drags it
    const pr = { ...S.pr }, P0 = mk.press; if (P0 && P0.dragging && P0.id === 'pc') { pr.x = P0.x; pr.y = P0.y + 20; }
    protractor(c, pr.x, pr.y, pr.rot, pr.sc, { baseGlow: S.baseAt != null && t - S.baseAt < 0.8 * T });
    // the needle and its rolling counter
    if (S.sweep) { const [nx, ny] = pt(VX, VY, ang, R + 6); c.save(); c.strokeStyle = NEEDLE; c.lineWidth = 3; c.shadowColor = NEEDLE; c.shadowBlur = 8; c.beginPath(); c.moveTo(VX, VY); c.lineTo(nx, ny); c.stroke(); c.restore();
      let [tx, ty] = pt(VX, VY, ang, R + 30); tx = M.clamp(tx, 52, 308); ty = Math.max(196, ty); S.tipX = tx; S.tipY = ty; const v = Math.round(S.th * M.easeIO(sw)), str = String(v) + '°';
      const grow = S.final != null ? 1 + 0.3 * M.ease(M.clamp((t - S.final) / (0.3 * T), 0, 1)) : 1, fs = 24 * grow;
      c.save(); c.font = M.NUMF(fs, 700); const w = c.measureText(str).width + 18 * grow, h = 34 * grow; tx = M.clamp(tx, 10 + w / 2, 350 - w / 2);
      c.fillStyle = 'rgba(30,10,10,0.85)'; c.beginPath(); c.roundRect(tx - w / 2, ty - h / 2, w, h, 12); c.fill(); c.strokeStyle = S.final != null ? '#fff2a0' : NEEDLE; c.lineWidth = 2.5; if (S.final != null) { c.shadowColor = '#fff2a0'; c.shadowBlur = 14; } c.stroke(); c.shadowBlur = 0;
      c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(str, tx, ty + 1); c.restore(); }
    // the fox architect
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const expr = won ? 'laugh' : lost || t - mk.missAt < 0.5 ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 312, 630 - hopK * 20, 1.2, { t, facing: -1, pose: won ? 'cheer' : hopK > 0 ? 'hop' : S.point ? 'point' : 'idle', expr }); else SCN.host(g, c, 'fox', 312, 630, 1.2);
    M.drawUI(g, c);
  },
});
