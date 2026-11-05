// chance_z.js — Z-SCORE! z = (x − μ) / σ: how many standard deviations x is from the mean.
// The red outback at noon: a bell curve glows over a track painted on the earth, with ticks every σ. A blue flag marks
// the mean μ, a red flag marks the value x, and a bracket under the track shows one σ. A kangaroo waits at μ.
// The sign shows z = (x − μ) / σ with the numbers in.
// Moves: 1. Drag μ onto x (on the sign or the flags, either way): both are circled, a tape stretches along the track
//           from μ to x, and the top of the fraction collapses into the difference, which rides on the tape.
//        2. Drag σ onto the difference (or onto the tape): the kangaroo hops from μ toward x in hops exactly one σ long,
//           a counter over its head rolling up 1, 2, ... and the last hop only part of a σ; each hop leaves a dashed arc.
//           The fraction collapses into z. Dividing by σ² (the variance) is the classic mistake, offered in the tray.
// Level 0: z = 1 or 2. Level 1: z = 1.5 or 2.5. Level 2: z can be negative (x below the mean; the kangaroo hops left).
// Medium mode: x − μ and then z are picked from the tray.
const M = MK, AY = 492, PX = 48, SIGNY = 246, INK = '#fff4dc', MUC = '#4a9ae8', XC = '#e8504a', TAPE = '#ffd860';
function pick(g) {
  const L = g.level, r = a => a[Math.floor(g.rand() * a.length)];
  if (L === 0) { const s = r([5, 10]), z = r([1, 2]), mu = r([50, 60, 70]); return { s, z, mu, x: mu + z * s }; }
  if (L === 1) { const s = r([4, 6, 10, 20]), z = r([1.5, 2.5]), mu = r([60, 70, 80]); return { s, z, mu, x: mu + z * s }; }
  const s = r([4, 8, 12]), z = r([-1.5, -2, -2.5, 1.5]), mu = r([50, 70, 100]); return { s, z, mu, x: mu + z * s };
}
const fmt = v => String(Math.round(v * 100) / 100);
function outback(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 430); [[0, '#2a6ac8'], [0.55, '#7ab8e8'], [1, '#f2e2c0']].forEach(([k, col]) => sk.addColorStop(k, col)); c.fillStyle = sk; c.fillRect(0, 0, W, 430);
  const sun = c.createRadialGradient(300, 60, 4, 300, 60, 150); sun.addColorStop(0, 'rgba(255,255,240,1)'); sun.addColorStop(0.15, 'rgba(255,250,210,0.6)'); sun.addColorStop(1, 'rgba(255,250,210,0)'); c.fillStyle = sun; c.fillRect(0, 0, W, 260);
  // the rock on the horizon
  c.fillStyle = '#c0583a'; c.beginPath(); c.moveTo(196, 428); c.bezierCurveTo(204, 392, 214, 380, 246, 378); c.lineTo(318, 380); c.bezierCurveTo(340, 384, 350, 404, 356, 428); c.fill();
  c.strokeStyle = 'rgba(120,40,30,0.4)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(232 + i * 18, 384); c.quadraticCurveTo(236 + i * 18, 404, 230 + i * 18, 426); c.stroke(); }
  c.fillStyle = '#d8805a'; c.beginPath(); c.moveTo(0, 430); c.bezierCurveTo(60, 418, 140, 424, 200, 420); c.lineTo(W, 424); c.lineTo(W, 440); c.lineTo(0, 440); c.fill();
  // red earth
  const gr = c.createLinearGradient(0, 424, 0, H); gr.addColorStop(0, '#d8693a'); gr.addColorStop(0.5, '#b8522c'); gr.addColorStop(1, '#8a3a22'); c.fillStyle = gr; c.fillRect(0, 426, W, H - 426);
  for (let i = 0; i < 60; i++) { const x = (i * 59) % W, y = 440 + (i * 23) % 200; c.fillStyle = `rgba(${i % 2 ? '255,200,150' : '90,30,20'},0.18)`; c.beginPath(); c.ellipse(x, y, 3 + (i % 4), 1.5, 0, 0, 7); c.fill(); }
  // spinifex clumps
  for (const [x, y, s] of [[26, 560, 1], [70, 610, 0.8], [330, 590, 1.1], [290, 446, 0.6], [44, 446, 0.6]]) { c.strokeStyle = '#a8a048'; c.lineWidth = 2; for (let k = -4; k <= 4; k++) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + k * 3 * s, y - 10 * s, x + k * 6 * s, y - (16 - Math.abs(k)) * s); c.stroke(); } }
}
// a kangaroo with its feet at (x, y), facing dir (1 right, -1 left); crouch 0..1 bends it before a hop
function roo(c, x, y, s, o = {}) {
  const t = o.t || 0, d = o.dir || 1, cr = o.crouch || 0, fur = '#c87a48', dk = '#8a4a28', lt = '#f0d0a8';
  c.save(); c.translate(x, y); c.scale(d * s, s); c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = 'rgba(60,20,10,0.25)'; c.beginPath(); c.ellipse(0, 1, 20, 4, 0, 0, 7); c.fill();
  // tail
  c.fillStyle = fur; c.strokeStyle = dk; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-6, -14); c.quadraticCurveTo(-26, -8, -34, 0); c.quadraticCurveTo(-22, -2, -4, -8); c.closePath(); c.fill(); c.stroke();
  // big foot and haunch
  c.beginPath(); c.ellipse(5, -1.5, 13, 3.5, 0, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(-2, -14 + cr * 3, 12, 11 - cr * 2, -0.3, 0, 7); c.fill(); c.stroke();
  // body leaning forward
  c.save(); c.translate(0, cr * 4); c.rotate(0.25 + cr * 0.2);
  c.beginPath(); c.ellipse(4, -30, 10, 17, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = lt; c.beginPath(); c.ellipse(7, -28, 5, 12, 0, 0, 7); c.fill();
  // little arms
  c.strokeStyle = dk; c.lineWidth = 3; c.beginPath(); c.moveTo(10, -34); c.quadraticCurveTo(17, -30, o.cheer ? 20 : 16, o.cheer ? -44 + Math.sin(t * 14) * 3 : -25); c.stroke();
  // head
  c.fillStyle = fur; c.strokeStyle = dk; c.lineWidth = 1.6; c.beginPath(); c.ellipse(7, -50, 8, 7, 0.2, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(15, -47, 6, 4, 0.2, 0, 7); c.fill(); c.stroke();
  for (const [ex, a] of [[2, -0.35], [7, -0.1]]) { c.save(); c.translate(ex, -55); c.rotate(a + Math.sin(t * 2 + ex) * 0.05); c.beginPath(); c.ellipse(0, -6, 3, 7, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#f0a090'; c.beginPath(); c.ellipse(0, -6, 1.4, 4.5, 0, 0, 7); c.fill(); c.fillStyle = fur; c.restore(); }
  c.fillStyle = '#2a1410'; c.beginPath(); c.arc(10, -51, o.wow ? 2 : 1.5, 0, 7); c.fill(); c.beginPath(); c.arc(20.5, -48, 1.5, 0, 7); c.fill();
  if (o.wow) { c.beginPath(); c.arc(15, -44, 1.5, 0, 7); c.fill(); }
  c.restore(); c.restore();
}

MG.add({
  id: 'zscore', stage: 'chance', cmd: 'Z-SCORE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Standardized!', hold: 1.7,
  card: {
    title: 'The z-score', ref: 'High school statistics', kind: 'Statistics',
    text: 'A z-score says how unusual a value is: how many standard deviations it sits above or below the mean.\n\nSubtract the mean μ (mu) from the value x to get the distance. Then divide by the standard deviation σ (sigma), the typical spread, to measure that distance in σ-sized steps.\n\nIf test scores have mean 70 and σ = 10, a score of 85 has z = (85 − 70) ÷ 10 = 1.5: one and a half steps above the mean. A score of 55 has z = −1.5, the same distance below.\n\nz-scores let you compare things measured on different scales, like a test score and a race time.',
    note: 'z = (x − μ) ÷ σ: subtract the mean, then divide by the standard deviation.',
    ask: 'Heights have μ = 160 cm and σ = 8 cm. What is the z-score of 176 cm? Of 148 cm?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), diff = p.x - p.mu, dir = Math.sign(diff);
    S.ax = v => 180 + (v - p.mu) / p.s * PX; S.rx = S.ax(p.mu); S.dir = dir;
    S.fr = M.frac(M.row(M.num(p.x, 'xv', { col: '#ffb0a8' }), M.op('−', 'mi'), M.num(p.mu, 'mv', { col: '#a8d0ff' })), M.num(p.s, 'sv', { col: '#ffe9a0' }), 'fr');
    S.top = M.row(M.vr('z', 'zv'), M.op('=', 'zeq'), S.fr);
    const relay = () => M.place(g, 'top', S.top, 180, SIGNY + 12, 42, { col: INK }); S.relay = relay; relay();
    M.inert(g, ['zv', 'zeq', 'mi', 'fr', 'zr']);
    S.cnt = M.num(0); S.trail = []; S.face = (g, e) => { S.ex = e; S.faceT = g.t; };
    const zones = () => { M.zone(g, 'mp', { x: S.ax(p.mu), y: AY - 40, w: 34, h: 70, s: 26 }); M.zone(g, 'xp', { x: S.ax(p.x), y: AY - 40, w: 34, h: 70, s: 26 });
      if (S.sub) M.zone(g, 'gp', { x: (S.ax(p.mu) + S.ax(p.x)) / 2, y: AY - 14, w: Math.abs(S.ax(p.x) - S.ax(p.mu)) - 30, h: 30, s: 24 }); };
    zones(); S.zones = zones;
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const hops = Math.ceil(Math.abs(p.z) - 1e-9), hopLen = k => Math.min(1, Math.abs(p.z) - k), H = 0.5; // hop k (0-based) covers hopLen(k) σ
    const hop = (g, k) => { const a = p.mu + dir * k * p.s, b = a + dir * hopLen(k) * p.s; S.jump = { x0: S.ax(a), x1: S.ax(b), t0: g.t, dur: H * T * 0.85, h: 14 + 10 * hopLen(k) }; g.sfx('swoosh');
      M.at(g, [[H * T * 0.85, g => { S.trail.push({ x0: S.ax(a), x1: S.ax(b), h: S.jump.h, t0: g.t }); S.jump = null; S.landX = S.ax(b); S.landAt = g.t; M.roll(g, S.cnt, fmt(dir * (k + hopLen(k))), { dur: 0.22 * T }); g.sfx(k % 2 ? 'tap' : 'pop'); g.burst(S.ax(b), AY, ['#f0a070', '#d8804a', '#fff0d0'], 6, 60); }]]); };
    S.rooX = S.ax(p.mu);
    M.play(g, {
      moves(g) {
        // 1. x − μ: the distance from the mean
        if (!S.sub) { const go = { busy: 0.1, askAt: 0.75 * T, after: 0.8 * T, ask: { v: diff, wrong: [p.x + p.mu, -diff, diff + 10, p.x] },
          then(g) { S.sub = true; M.show(g, 0.75 * T); S.face(g, 'think'); g.sfx('swoosh'); zones();
            M.circle(g, ['xv', 'mv'], { dur: 0.55 * T, col: TAPE }); M.light(g, 'xv', { col: TAPE }); M.light(g, 'mv', { col: TAPE });
            S.tape = { t0: g.t + 0.2 * T, dur: 0.5 * T }; },
          resolve(g) { M.show(g, 0.8 * T); S.dv = M.num(diff, 'dv', { col: TAPE, pop: g.t }); S.fr.n = S.dv; relay(); g.sfx('ding'); S.face(g, 'wow');
            M.sparkle(g, 'dv', { n: 8 }); S.tapeLab = g.t; } };
          return [{ drag: 'mv', to: 'xv', ...go }, { drag: 'xv', to: 'mv', ...go }, { drag: 'mp', to: 'xp', ...go }, { drag: 'xp', to: 'mp', ...go }]; }
        // 2. ÷ σ: count σ-sized hops
        if (!S.div) { const go = { busy: 0.1, askAt: (0.3 + H) * T, after: ((hops - 1) * H + 0.85) * T, ask: { v: p.z, wrong: [Math.round(diff / (p.s * p.s) * 100) / 100, diff * p.s, p.z + (p.z > 0 ? 1 : -1), -p.z] },
          then(g) { S.div = true; M.show(g, (0.3 + H) * T); S.face(g, 'think'); M.circle(g, 'sv', { dur: 0.5 * T, col: TAPE }); M.indicate(g, 'sv', { dur: 0.4 * T, col: TAPE });
            S.stick = g.t; S.jump = { x0: S.ax(p.mu) - dir * 26, x1: S.ax(p.mu), t0: g.t, dur: 0.22 * T, h: 5 }; M.at(g, [[0.22 * T, g => { S.jump = null; S.landX = S.ax(p.mu); }], [0.3 * T, g => hop(g, 0)]]); },
          resolve(g) { M.show(g, ((hops - 1) * H + 0.85) * T);
            for (let k = 1; k < hops; k++) M.at(g, [[(k - 1) * H * T, g => hop(g, k)]]);
            M.at(g, [[((hops - 1) * H + 0.15) * T, g => { const zr = M.num(fmt(p.z), 'zr', { pop: g.t, col: '#fff4c0' }); S.top.items[2] = zr; relay(); g.sfx('coin'); M.sparkle(g, 'zr', { n: 14 }); S.face(g, 'laugh'); S.cheer = g.t; }]]); } };
          return [{ drag: 'sv', to: 'dv', ...go }, { drag: 'sv', to: 'gp', ...go }]; }
        return [];
      },
      area(g) { return !S.sub ? ['mv', 'xv'] : !S.div ? ['sv', 'dv'] : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, p = S.p, T = M.pace(g), E = M.easeIO, xm = S.ax(p.mu), xx = S.ax(p.x);
    c.drawImage(g.bake('chance_z_outback', outback), 0, 0, 360, 640);
    // heat shimmer and a soaring bird
    c.save(); c.globalAlpha = 0.12; c.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { const y = 432 + i * 4; c.fillRect(0, y + Math.sin(t * 3 + i) * 1.5, 360, 1); } c.restore();
    { const bx = (t * 22) % 420 - 30, by = 120 + Math.sin(t * 0.7) * 14; c.strokeStyle = '#3a2a3a'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 9, by - 3 + Math.sin(t * 4) * 2); c.quadraticCurveTo(bx - 4, by - 5, bx, by); c.quadraticCurveTo(bx + 4, by - 5, bx + 9, by - 3 + Math.sin(t * 4) * 2); c.stroke(); }
    SCN.panel(c, 'sign', 180, SIGNY, 260, 112, t);
    // the bell curve over the track
    c.save(); const bell = v => Math.exp(-0.5 * v * v); c.beginPath(); for (let i = 0; i <= 80; i++) { const z = -3.4 + i * 6.8 / 80, x = 180 + z * PX, y = AY - 8 - bell(z) * 104; i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.lineTo(180 + 3.4 * PX, AY - 8); c.lineTo(180 - 3.4 * PX, AY - 8); c.closePath(); c.fillStyle = 'rgba(255,240,200,0.16)'; c.fill();
    c.beginPath(); for (let i = 0; i <= 80; i++) { const z = -3.4 + i * 6.8 / 80, x = 180 + z * PX, y = AY - 8 - bell(z) * 104; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.strokeStyle = 'rgba(255,248,220,0.85)'; c.lineWidth = 2.5; c.shadowColor = '#fff6d0'; c.shadowBlur = 8; c.stroke(); c.restore();
    // the track: a painted line with a tick every σ, values under it
    c.save(); c.strokeStyle = 'rgba(60,20,10,0.35)'; c.lineWidth = 7; c.beginPath(); c.moveTo(20, AY + 3); c.lineTo(340, AY + 3); c.stroke();
    c.strokeStyle = '#fff0dc'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(20, AY); c.lineTo(340, AY); c.stroke();
    c.font = M.NUMF(16, 600); c.textAlign = 'center'; c.fillStyle = '#fff0dc'; c.lineWidth = 2.5;
    for (let k = -3; k <= 3; k++) { const x = 180 + k * PX, v = p.mu + k * p.s; c.beginPath(); c.moveTo(x, AY - 7); c.lineTo(x, AY + 7); c.stroke(); if (v >= 0) c.fillText(v, x, AY + 26); }
    // one σ, shown on the side away from x
    { const sx = -S.dir, a = xm, b = xm + sx * PX, y = AY + 42, hl = S.stick ? Math.max(0, 1 - (t - S.stick) / (0.8 * T)) : 0; c.strokeStyle = M.mix('#ffe9a0', '#ffffff', hl); c.lineWidth = 2 + hl * 2; if (hl) { c.shadowColor = TAPE; c.shadowBlur = 12 * hl; }
      c.beginPath(); c.moveTo(a, y - 6); c.lineTo(a, y); c.lineTo(b, y); c.lineTo(b, y - 6); c.stroke(); c.shadowBlur = 0;
      const nd = M.row(M.vr('σ'), M.op('='), M.num(p.s)), mm = M.lay(nd, 21); M.draw(c, nd, (a + b) / 2 - mm.w / 2, y + 24, 21, { t, col: '#ffe9a0' }); }
    c.restore();
    // the tape from μ to x, then hop trails
    if (S.tape && t > S.tape.t0) { const k = E((t - S.tape.t0) / S.tape.dur), y = AY - 12, a = xm, b = M.lerp(xm, xx, k); c.save(); c.fillStyle = TAPE; c.strokeStyle = '#a8701a'; c.lineWidth = 1.5;
      c.beginPath(); c.roundRect(Math.min(a, b), y - 5, Math.max(3, Math.abs(b - a)), 10, 3); c.fill(); c.stroke(); c.strokeStyle = '#7a5010'; for (let x = 6; x < Math.abs(b - a) - 2; x += 6) { const xx2 = a + Math.sign(b - a) * x; c.beginPath(); c.moveTo(xx2, y - 5); c.lineTo(xx2, y - (Math.round(x / 6) % 4 ? 1 : -2)); c.stroke(); }
      if (S.tapeLab && !S.div) { const kk = M.clamp((t - S.tapeLab) / 0.25, 0, 1), nd = M.num(p.x - p.mu), mm = M.lay(nd, 22); c.globalAlpha = kk; c.lineWidth = 4; c.strokeStyle = 'rgba(80,30,10,0.7)'; c.font = M.NUMF(22); c.textAlign = 'center'; c.strokeText(nd.v, (xm + xx) / 2, y - 12); c.fillStyle = TAPE; c.fillText(nd.v, (xm + xx) / 2, y - 12); }
      c.restore(); }
    for (const tr of S.trail) { c.save(); c.strokeStyle = 'rgba(255,248,220,0.8)'; c.lineWidth = 2; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(tr.x0, AY - 18); c.quadraticCurveTo((tr.x0 + tr.x1) / 2, AY - 18 - tr.h * 2, tr.x1, AY - 18); c.stroke(); c.restore(); }
    // the flags: μ (blue) and x (red)
    const miss = K.missInfo && t - K.missAt < 0.6 ? (K.missInfo.tap || K.missInfo.to || K.missInfo.drag) : null;
    for (const [id, x, col, sym, v] of [['mp', xm, MUC, 'μ', p.mu], ['xp', xx, XC, 'x', p.x]]) { const sh = miss === id ? Math.sin((t - K.missAt) * 50) * 3 : 0, wv = Math.sin(t * 5 + x) * 2, fx = x + sh, top = AY - 70;
      c.save(); c.strokeStyle = '#5a3a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(fx, AY); c.lineTo(fx, top); c.stroke();
      const fw = id === 'mp' ? -1 : 1, side = (id === 'mp' ? -S.dir : S.dir) || 1; c.fillStyle = col; c.beginPath(); c.moveTo(fx, top); c.quadraticCurveTo(fx + side * 16, top + 2 + wv, fx + side * 32, top + 4 + wv); c.lineTo(fx + side * 32, top + 22 + wv); c.quadraticCurveTo(fx + side * 16, top + 20, fx, top + 22); c.fill();
      const nd = M.vr(sym), mm = M.lay(nd, 18); M.draw(c, nd, fx + side * 16 - mm.w / 2, top + 18 + wv * 0.5, 18, { t, col: '#fff' }); c.restore(); }
    // the kangaroo
    const won = g.done && g.result === 'win'; let rx = S.landX ?? (xm - (S.dir || 1) * 26), ry = AY, cr = 0;
    if (S.jump) { const k = M.clamp((t - S.jump.t0) / S.jump.dur, 0, 1), e = E(k); rx = M.lerp(S.jump.x0, S.jump.x1, e); ry = AY - Math.sin(k * Math.PI) * S.jump.h * 2; }
    else if (S.landAt && t - S.landAt < 0.15) cr = 1 - (t - S.landAt) / 0.15;
    const cheer = won || (S.cheer && t - S.cheer < 1), bounce = cheer ? Math.abs(Math.sin(t * 9)) * 8 : 0;
    roo(c, rx, ry - bounce, 1.05, { t, dir: S.div ? S.dir : (S.dir || 1), crouch: cr, cheer, wow: S.faceT != null && t - S.faceT < 0.5 && S.ex === 'wow' });
    // the hop counter over its head
    if (S.div) { const nd = S.cnt, mm = M.lay(nd, 22), y = ry - bounce - 78; c.save(); c.fillStyle = 'rgba(60,20,10,0.45)'; c.beginPath(); c.roundRect(rx - mm.w / 2 - 9, y - 22, mm.w + 18, 30, 10); c.fill(); M.draw(c, nd, rx - mm.w / 2, y, 22, { t, col: '#fff4c0' }); c.restore(); }
    M.drawEx(g, c, 'top');
    // a dragged flag follows the finger
    const P0 = K.press; if (P0 && P0.dragging && (P0.id === 'mp' || P0.id === 'xp')) { c.save(); c.fillStyle = P0.id === 'mp' ? MUC : XC; c.beginPath(); c.arc(P0.x, P0.y - 20, 16, 0, 7); c.fill(); const nd = M.vr(P0.id === 'mp' ? 'μ' : 'x'), mm = M.lay(nd, 20); M.draw(c, nd, P0.x - mm.w / 2, P0.y - 14, 20, { t, col: '#fff' }); c.restore(); }
    M.drawUI(g, c);
  },
});
