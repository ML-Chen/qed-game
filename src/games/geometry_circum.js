// geometry_circum.js — CIRCUMFERENCE! The distance around a circle is a little more than 3 diameters: exactly π of them.
// C = π × d. A cartwheel on a country lane at sunrise, with a rabbit. The wheel's rim is painted red; its diameter is drawn
// across it and labelled (d = 10). A signboard reads C = ?. Every move's working plays by itself (show your work):
//   0. (level 2, where the radius is given) tap the radius label (or drag it onto the wheel): a copy of the radius swings
//      round to the other side, "2 × 4 = 8" writes itself above, and the label rolls from r = 4 to d = 8.
//   1. drag the wheel along the lane (or tap it): it rolls exactly one full turn, and its red paint peels off the rim onto
//      the lane as it goes, so the rim is unrolled into a straight red line; a brace marks the line C.
//   2. drag the diameter label onto the red line: gold copies of the diameter fly down and lie end to end along it,
//      counted 1, 2, 3; a thin sliver is left over and glows, "π ≈ 3.14" writes itself beside it, and the sign becomes
//      C = π × 10 ≈ ?, the π flying up from the note and the 10 from the label.
//   3. tap the ? (or π × 10): "π × 10 ≈ 31.4" writes itself under the sign, 31.4 flies into the ?, and the brace under the
//      red line reads C ≈ 31.4.
// Level 0: d = 2, 4 or 10. Level 1: d = 6, 8, 12 or 20. Level 2: the radius 3, 4, 5 or 6 is given instead.
// Medium mode: the tray asks for 2r (level 2) and for the circumference (78.5, the area πr², is a wrong tile).
const M = MK, INK = '#2a3a1a', EY = 212, R = 40, GY = 446, CY = GY - R, XS = 52, HX = 62, HY = 618, RED = '#e84a3a', GOLD = '#ffc83a';
const fmt = v => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '');
function pick(g) {
  const L = g.level, R2 = a => a[Math.floor(g.rand() * a.length)];
  if (L === 0) return { d: R2([2, 4, 10]), r: 0 };
  if (L === 1) return { d: R2([6, 8, 12, 20]), r: 0 };
  const r = R2([3, 4, 5, 6]); return { d: 2 * r, r };
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function label(c, s, x, y, size, fill, stroke = 'rgba(30,40,10,0.9)') { c.save(); c.font = M.NUMF(size, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = Math.max(4, size * 0.22); c.strokeStyle = stroke; c.strokeText(s, x, y); c.fillStyle = fill; c.fillText(s, x, y); c.restore(); }

// ---------------- the lane at sunrise (baked) ----------------
function lane(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 400); sk.addColorStop(0, '#8ab0e0'); sk.addColorStop(0.5, '#e8c0d0'); sk.addColorStop(0.85, '#ffd8b0'); sk.addColorStop(1, '#fff0d0'); c.fillStyle = sk; c.fillRect(0, 0, W, 400);
  const sg = c.createRadialGradient(110, 300, 6, 110, 300, 130); sg.addColorStop(0, 'rgba(255,248,210,1)'); sg.addColorStop(0.2, 'rgba(255,236,190,0.6)'); sg.addColorStop(1, 'rgba(255,230,190,0)'); c.fillStyle = sg; c.fillRect(0, 170, 240, 200);
  c.fillStyle = '#fffbe8'; c.beginPath(); c.arc(110, 300, 20, 0, 7); c.fill();
  P.hills(c, W, 300, 40, '#a8c890', '#88b070', { seed: 5, dabs: 40 }); P.hills(c, W, 340, 30, '#8ac070', '#6aa050', { seed: 11, dabs: 60 });
  // a red barn and a few trees on the hill
  c.fillStyle = '#b84a3a'; c.fillRect(250, 296, 44, 30); c.fillStyle = '#8a3a2a'; c.beginPath(); c.moveTo(244, 298); c.lineTo(272, 278); c.lineTo(300, 298); c.fill(); c.fillStyle = '#fff4e0'; c.fillRect(266, 308, 12, 18);
  P.tree(c, 330, 334, 0.55); P.tree(c, 214, 330, 0.45);
  // the meadow and the lane
  const gr = c.createLinearGradient(0, 360, 0, H); gr.addColorStop(0, '#7ab85a'); gr.addColorStop(1, '#4a8a3a'); c.fillStyle = gr; c.fillRect(0, 358, W, H - 358);
  const ln = c.createLinearGradient(0, GY - 4, 0, GY + 40); ln.addColorStop(0, '#d8b888'); ln.addColorStop(1, '#b8946a'); c.fillStyle = ln; c.fillRect(0, GY, W, 40);
  c.fillStyle = 'rgba(120,90,50,0.3)'; for (let i = 0; i < 30; i++) { const r = P.rng(i + 3)(); c.beginPath(); c.ellipse(r * W, GY + 8 + ((i * 7) % 28), 3, 1.5, 0, 0, 7); c.fill(); }
  c.fillStyle = '#5a9a3a'; for (let x = 0; x < W; x += 6) { c.beginPath(); c.moveTo(x, GY + 1); c.lineTo(x + 3, GY - 5 - (x % 4)); c.lineTo(x + 6, GY + 1); c.fill(); }
  P.flowers(c, W, 520, 640, 24, undefined, 9);
}
// the cartwheel at centre x, turned by angle a; `peel` is how much of the red rim has peeled off (0 to 2π)
function wheel(c, x, a, peel) {
  c.save(); c.translate(x, CY);
  c.fillStyle = 'rgba(40,30,10,0.25)'; c.beginPath(); c.ellipse(0, R + 2, R * 0.8, 5, 0, 0, 7); c.fill();
  c.rotate(a);
  c.strokeStyle = '#8a5a2a'; c.lineWidth = 5; for (let i = 0; i < 8; i++) { const q = i * Math.PI / 4; c.beginPath(); c.moveTo(Math.cos(q) * 7, Math.sin(q) * 7); c.lineTo(Math.cos(q) * (R - 5), Math.sin(q) * (R - 5)); c.stroke(); }
  c.strokeStyle = '#a8763a'; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, R - 4, 0, 7); c.stroke();
  c.strokeStyle = '#6a4018'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, R - 8, 0, 7); c.stroke();
  // the red paint, still on the rim where it has not touched the lane yet (the start mark was at the bottom)
  if (peel < Math.PI * 2 - 0.001) { c.strokeStyle = RED; c.lineWidth = 6; c.lineCap = 'butt'; c.beginPath(); c.arc(0, 0, R - 1, Math.PI / 2, Math.PI / 2 + Math.PI * 2 - peel); c.stroke(); }
  c.fillStyle = '#6a4018'; c.beginPath(); c.arc(0, 0, 9, 0, 7); c.fill(); c.fillStyle = '#c8a060'; c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill();
  c.restore();
}

MG.add({
  id: 'geometry_circum', stage: 'geometry', cmd: 'CIRCUMFERENCE!', hint: 'drag', time: 10, mood: 'bright', winText: 'Rolled!', hold: 1.7,
  card: {
    title: 'Circumference', ref: 'Grade 7', kind: 'Geometry',
    text: 'The circumference C of a circle is the distance all the way around it. The diameter d is the distance straight across, through the centre.\n\nPaint the rim of a wheel and roll it one full turn: the paint makes a straight line exactly as long as the circumference. Lay diameters along that line and 3 of them fit, with a little left over. For every circle, the circumference is the same number of diameters: π (pi), about 3.14.\n\nSo C = π × d. A wheel with diameter 10 has C = 10π, about 31.4. If you know the radius r, the diameter is 2 × r.',
    note: 'C = π × d = 2 × π × r. π is about 3.14.',
    ask: 'A circle has diameter 4. What is its circumference? A circle has radius 5. What is its circumference?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { d, r } = S, C = Math.PI * d;
    S.th = 0; S.doubled = !r; S.copies = []; S.face = 'happy'; S.Cv = fmt(C);
    S.wx = () => XS + S.th * R;
    S.lc = M.vr(r ? 'r' : 'd', 'dl0'); S.ln = M.num(r || d, 'dn'); S.lab = M.row(S.lc, M.op('=', 'dl1'), S.ln); S.lab.id = 'dl';
    S.Q = M.slot('ans', { col: '#6a8a4a' }); S.EQ = M.op('=', 'eq');
    S.set = items => { S.row = M.row(...items); M.place(g, 'ex', S.row, 180, EY, 40, { col: INK }); };
    S.set([M.vr('C', 'Cv'), S.EQ, S.Q]); M.inert(g, ['Cv', 'eq', 'dl1', 'pi', 'x2', 'dv', 'ap', 'res']);
    S.placeLab = () => M.place(g, 'lab', S.lab, M.clamp(S.wx(), 52, 308), CY - R - 20, 26, { col: '#fffbe8', still: true });
    S.placeLab();
    g.dur *= (2.6 + 1.05 * (r ? 4 : 3)) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };

    // 0. radius to diameter (level 2)
    const doubleMove = () => { const T = M.pace(g);
      return { busy: 0.1, askAt: 0.55 * T, after: 0.7 * T, ask: { v: d, wrong: [r * r, r + 2, r] },
        then(g) { S.doubled = true; M.show(g, 0.55 * T); hop(g, 'think'); S.point = true; g.sfx('swoosh');
          M.circle(g, 'dl', { dur: 0.45 * T }); S.swing = { t0: g.t, dur: 0.5 * T };
          M.note(g, { node: M.row(M.num(2), M.op('×'), M.num(r), M.op('='), M.num(d)), at: 'dl', off: [40, -40], s: 26, col: '#fffbe8', pill: 'rgba(30,50,20,0.78)', write: 0.35 * T, hold: 0.55 * T, fade: 0.2 * T }); },
        resolve(g) { M.show(g, 0.7 * T); S.lc.v = 'd'; S.lc.pop = g.t; M.roll(g, S.ln, d, { dur: 0.3 * T }); M.sparkle(g, 'dl', { delay: 0.25 * T, n: 8 }); g.sfx('ding'); hop(g);
          M.at(g, [[0.6 * T, g => { S.point = false; }]]); } };
    };
    // 1. roll the wheel one full turn
    const roll = g => { const T = M.pace(g), dur = 1.25 * T; S.rolled = true; M.show(g, dur + 0.45 * T); hop(g, 'wow'); S.point = true; g.sfx('whoosh');
      M.tween(g, S, { th: Math.PI * 2 }, dur, { ease: k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2 });
      const st = []; for (let i = 1; i <= 4; i++) st.push([dur * i / 4.2, g => g.sfx('tap', { pitch: 0.8 + i * 0.1, vol: 0.4 })]);
      st.push([dur, g => { g.sfx('thud'); hop(g); S.brace = { t0: g.t, dur: 0.35 * T }; M.zone(g, 'line', { x: XS + C * R / d, y: GY + 6, w: 2 * Math.PI * R + 20, h: 40 }); }]);
      st.push([dur + 0.4 * T, g => { S.point = false; }]);
      M.at(g, st); };
    // 2. lay diameters along the line
    const measure = { busy: 0.1, then(g) {
      const T = M.pace(g), per = 0.3 * T; S.measured = true; M.show(g, 0.2 * T + 3 * per + 1.05 * T); hop(g, 'think'); S.point = true;
      M.circle(g, 'dl', { dur: 0.4 * T, col: GOLD });
      const st = []; for (let i = 0; i < 3; i++) st.push([0.2 * T + i * per, g => { S.copies.push({ i, t0: g.t, dur: per * 0.9, x0: S.wx() }); g.sfx('swoosh', { pitch: 1 + i * 0.1 }); M.later(g, per * 0.9, g => { g.sfx('tap', { pitch: 1.1 + i * 0.12 }); hop(g); }, true); }]);
      const e = 0.2 * T + 3 * per;
      st.push([e, g => { S.sliver = g.t; g.sfx('ding'); hop(g, 'wow');
        M.note(g, { node: M.row(M.vr('π'), M.op('≈'), M.num('3.14')), at: [XS + 2 * Math.PI * R - 20, GY + 50], s: 28, col: '#fffbe8', pill: 'rgba(30,50,20,0.8)', write: 0.35 * T, hold: 0.45 * T, fly: 0.35 * T, to: 'pi', s1: 40, arc: 40,
          then(g) { S.pi.alpha = 1; S.pi.pop = g.t; M.sparkle(g, 'pi', { n: 8 }); g.sfx('pop'); } }); }]);
      st.push([e + 0.25 * T, g => { // the sign becomes C = π × d ≈ ?, with d flying up from the label
        S.pi = M.vr('π', 'pi', { alpha: 0 }); S.dv = M.num(d, 'dv', { alpha: 0 }); S.ap = M.op('≈', 'ap');
        S.set([S.row.items[0], S.EQ, S.pi, M.op('×', 'x2'), S.dv, S.ap, S.Q]);
        const fl = { ...M.box(g, 'dn') }; M.fly(g, { node: M.num(d, null, { col: '#fffbe8' }), from: [fl.x, fl.y], to: 'dv', dur: 0.45 * T, arc: -40, s0: 26, s1: 40, then(g) { S.dv.alpha = 1; S.dv.pop = g.t; g.sfx('pop'); } }); }]);
      st.push([e + 1.0 * T, g => { S.point = false; }]);
      M.at(g, st); } };
    // 3. work out π × d
    const compute = () => { const T = M.pace(g), rr0 = d / 2;
      return { busy: 0.1, askAt: 0.6 * T, after: 1.0 * T, ask: { v: M.num(S.Cv), wrong: [M.num(fmt(Math.PI * rr0 * rr0)), M.num(fmt(Math.PI * rr0)), M.num(fmt(3.14 + d))] },
        then(g) { S.computed = true; M.show(g, 0.6 * T); hop(g, 'think'); S.point = true; M.circle(g, [S.pi, S.dv], { dur: 0.5 * T });
          M.note(g, { node: M.row(M.vr('π'), M.op('×'), M.num(d), M.op('≈'), M.num(S.Cv)), at: [180, EY + 54], s: 28, col: '#fffbe8', pill: 'rgba(30,50,20,0.8)', write: 0.45 * T, hold: 0.75 * T, fade: 0.2 * T, delay: 0.1 * T }); },
        resolve(g) { M.show(g, 1.0 * T); g.sfx('swoosh');
          M.fly(g, { node: M.num(S.Cv, null, { col: '#fffbe8' }), from: [215, EY + 54], to: 'ans', dur: 0.4 * T, arc: -40, s0: 28, s1: 40,
            then(g) { S.Q.fill = M.num(S.Cv, 'res', { _born: -1, pop: g.t }); M.relayout(g, 'ex'); M.sparkle(g, 'ans', { n: 16, cols: [RED, GOLD, '#fff'] }); g.sfx('coin'); g.sfx('sparkle'); hop(g, 'laugh'); S.cval = g.t; } });
          M.at(g, [[0.85 * T, g => { S.point = false; }]]); } };
    };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.doubled) { const dm = doubleMove(); out.push({ ...dm, tap: ['dl', 'dl0', 'dl1', 'dn'] }, { ...dm, drag: ['dl', 'dl0', 'dn'], to: 'wheel' }); }
        if (!S.rolled) { const T = M.pace(g); out.push({ drag: 'wheel', to: 'road', area: [S.wx() + 50, GY - 120, 360, GY + 60], busy: 0.1, then: roll }, { tap: 'wheel', busy: 0.1, then: roll }); }
        if (out.length || S.th < Math.PI * 2 - 0.01) return out;
        if (!S.measured) return [{ ...measure, drag: ['dl', 'dl0', 'dn'], to: 'line', area: [0, GY - 40, 360, GY + 50] }];
        if (!S.pi || S.pi.alpha < 1 || S.computed) return [];
        return [{ ...compute(), tap: ['ans', 'pi', 'dv', 'x2'] }];
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.tap || mv.drag).slice(0, 1) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s; S.placeLab(); if (!S.rolled || S.th < Math.PI * 2) M.zone(g, 'wheel', { x: S.wx(), y: CY, w: 2 * R + 8, h: 2 * R + 8 }); if (!S.rolled) M.zone(g, 'road', { x: 300, y: GY + 10, w: 110, h: 40 }); else if (S.mk.zones.road) S.mk.zones.road = false; },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, T = M.pace(g), D = 2 * R, Cpx = Math.PI * D;
    c.drawImage(g.bake('circum_lane', lane), 0, 0, 360, 640);
    // butterflies over the meadow
    for (let i = 0; i < 3; i++) { const x = (t * (14 + i * 5) + i * 130) % 400 - 20, y = 545 + Math.sin(t * 1.3 + i * 2) * 20 + i * 14, f = Math.abs(Math.sin(t * 10 + i)); c.fillStyle = ['#ffd84a', '#ffffff', '#ff9ac0'][i]; c.beginPath(); c.ellipse(x - 4, y, 4 * f + 1, 3, 0, 0, 7); c.ellipse(x + 4, y, 4 * f + 1, 3, 0, 0, 7); c.fill(); }
    // the signboard on two posts
    c.save(); c.fillStyle = '#7a5a3a'; c.fillRect(72, EY + 18, 8, 60); c.fillRect(280, EY + 18, 8, 60);
    c.fillStyle = 'rgba(30,30,10,0.25)'; rr(c, 30, EY - 40 + 5, 300, 64, 12); c.fill(); c.fillStyle = '#fbf6e8'; rr(c, 28, EY - 40, 304, 64, 12); c.fill(); c.strokeStyle = '#7a8a5a'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(122,138,90,0.4)'; c.lineWidth = 1.5; rr(c, 35, EY - 33, 290, 50, 8); c.stroke(); c.restore();
    M.drawEx(g, c, 'ex');
    // the red line the rim leaves on the lane, with tick marks every diameter once they are laid
    const len = S.th * R; c.save(); c.strokeStyle = RED; c.lineWidth = 6; c.lineCap = 'butt'; c.beginPath(); c.moveTo(XS, GY + 3); c.lineTo(XS + len, GY + 3); c.stroke();
    c.fillStyle = RED; c.fillRect(XS - 2, GY - 6, 4, 18); if (S.th >= Math.PI * 2 - 0.01) c.fillRect(XS + Cpx - 2, GY - 6, 4, 18); c.restore();
    // the brace under the line: C, and later C ≈ 31.4
    if (S.brace) { const k = M.easeIO((t - S.brace.t0) / S.brace.dur), y = GY + 18, x0 = XS, x1 = XS + Cpx, xm = (x0 + x1) / 2, w = (x1 - x0) / 2 * k;
      c.save(); c.strokeStyle = '#fffbe8'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(xm - w, y); c.quadraticCurveTo(xm - w, y + 8, xm - w + 10, y + 8); c.lineTo(xm - 8, y + 8); c.lineTo(xm, y + 15); c.lineTo(xm + 8, y + 8); c.lineTo(xm + w - 10, y + 8); c.quadraticCurveTo(xm + w, y + 8, xm + w, y); c.stroke(); c.restore();
      if (k > 0.5) { c.save(); c.globalAlpha = (k - 0.5) * 2; const s = S.cval ? 'C ≈ ' + S.Cv : 'C', kk = S.cval ? M.clamp((t - S.cval) / 0.3, 0, 1) : 1; label(c, s, xm, y + 34, 24 * (1 + Math.sin(kk * Math.PI) * 0.25), '#fffbe8'); c.restore(); } }
    // the gold diameters laid along the line, counted 1, 2, 3, and the sliver left over
    for (const cp of S.copies) { const k = M.easeIO((t - cp.t0) / cp.dur), x0 = M.lerp(cp.x0 - R, XS + cp.i * D, k), y = M.lerp(CY, GY - 8, k) - Math.sin(k * Math.PI) * 50;
      c.save(); c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 10; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0 + 3, y); c.lineTo(x0 + D - 3, y); c.stroke();
      c.lineWidth = 3; c.beginPath(); c.moveTo(x0 + 1, y - 7); c.lineTo(x0 + 1, y + 7); c.moveTo(x0 + D - 1, y - 7); c.lineTo(x0 + D - 1, y + 7); c.stroke(); c.restore();
      if (k >= 1) label(c, String(cp.i + 1), x0 + D / 2, y - 18, 22, '#fffbe8'); }
    if (S.sliver) { const p = 0.5 + 0.5 * Math.sin((t - S.sliver) * 8); c.save(); c.strokeStyle = '#ffffff'; c.shadowColor = '#fff'; c.shadowBlur = 8 + p * 10; c.lineWidth = 6; c.beginPath(); c.moveTo(XS + 3 * D + 1, GY - 8); c.lineTo(XS + Cpx, GY - 8); c.stroke(); c.restore(); }
    // the wheel (its diameter drawn across it once it stands still), and the radius swinging round on level 2
    const wx = S.wx(); wheel(c, wx, S.th, S.th);
    const moving = S.th > 0.001 && S.th < Math.PI * 2 - 0.001;
    if (!moving) { c.save(); c.strokeStyle = GOLD; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = 'rgba(40,30,0,0.6)'; c.shadowBlur = 4;
      c.beginPath(); c.moveTo(wx, CY); c.lineTo(wx + R - 4, CY); c.stroke();
      const sw = S.swing ? M.easeIO((t - S.swing.t0) / S.swing.dur) : (S.r ? 0 : 1); if (sw > 0) { const a = Math.PI * sw; c.beginPath(); c.moveTo(wx, CY); c.lineTo(wx + Math.cos(a) * (R - 4), CY + Math.sin(a) * (R - 4)); c.stroke(); }
      c.fillStyle = GOLD; c.beginPath(); c.arc(wx, CY, 4, 0, 7); c.fill(); c.restore(); }
    const lb = M.box(g, 'dl'); if (lb) { c.save(); c.fillStyle = 'rgba(30,50,20,0.72)'; rr(c, lb.x - lb.w / 2 - 8, lb.y - lb.h / 2 - 4, lb.w + 16, lb.h + 8, 9); c.fill(); c.restore(); }
    M.drawEx(g, c, 'lab');
    // the rabbit: points while the work is shown, hops on each beat
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missK = K.missAt >= 0 && t - K.missAt < 0.5;
    const expr = won ? 'laugh' : lost || missK ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', HX + (missK ? Math.sin((t - K.missAt) * 40) * 3 : 0), HY - hopK * 22, 1.3, { t, pose, expr }); else SCN.host(g, c, 'rabbit', HX, HY, 1.3);
    M.drawUI(g, c);
  },
});
