// powers_sci.js — SCI NOTATION! Write 34,000 as 3.4 × 10⁴: the decimal point hops left one place at a time, and the
// power of ten counts the hops.
// The deep sea at twilight, with a whale gliding past far below. The number glows in blue-white light, and its decimal
// point is a pearl. The working line starts as "= 34000. × 10⁰", which is still the same number (10⁰ = 1). Every move's
// working plays by itself (show your work; the fuse stands still meanwhile):
//   1. Drag the pearl to just after the first digit (or tap that gap): the pearl hops over one digit at a time on a
//      little arc, every hop is numbered 1, 2, 3, 4 above it, and the exponent rolls up with each hop (0, 1, 2, 3, 4),
//      because each hop divides the front number by 10 and the power of ten makes up for it. Then the digits close up.
//   2. Tap the zeros at the end: they are circled and crossed out, turn into bubbles and float away: 3.4 × 10⁴.
// Small numbers (level 2) go the other way: 0.00052 = 5.2 × 10⁻⁴. The pearl hops right, the exponent rolls down to −4,
// and the zeros at the front float away.
// Mistakes: dropping the pearl in another gap (34 × 10³ or 0.34 × 10⁵ are not scientific notation: the front number must
// be at least 1 and less than 10), and tapping the zeros before the point has moved (34 is not 34,000).
// Level 0: 4- or 5-digit numbers. Level 1: 6 digits. Level 2: 6 digits, or a small decimal.
// Medium mode: the exponent is picked from the tray after the hops, and the front number after the zeros are crossed out.
const M = MK;
const TOPY = 246, WY = 340, INK = '#e8fbff', GLOWC = '#7ae0ff', PEARL = '#fff6f0', HX = 300, HY = 612;

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const sig = r(3) === 0 ? String(2 + r(8)) : String(1 + r(9)) + String(1 + r(9));
  const small = L === 2 && g.rand() < 0.5;
  if (small) { const lead = 2 + r(2); return { small, D: '0'.repeat(lead + 1) + sig, p: 1, f: lead + 1, sig }; } // 0.0052 / 0.00052
  const len = L === 0 ? 4 + r(2) : 6, D = sig + '0'.repeat(len - sig.length);
  return { small, D, p: D.length, f: 0, sig };
}
const commas = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// the deep sea: dark teal water going to ink, light from above, a sandy floor with coral and kelp far below
function deep(c, W, H) {
  const sg = c.createLinearGradient(0, 0, 0, H); sg.addColorStop(0, '#1f6f94'); sg.addColorStop(0.35, '#0f3f66'); sg.addColorStop(0.75, '#081c3c'); sg.addColorStop(1, '#050f26'); c.fillStyle = sg; c.fillRect(0, 0, W, H);
  c.save(); c.globalCompositeOperation = 'lighter'; const R = P.rng(5);
  for (let i = 0; i < 8; i++) { const x = -40 + i * 56 + R() * 30, gr = c.createLinearGradient(x, 0, x + 80, 460); gr.addColorStop(0, 'rgba(150,230,255,0.13)'); gr.addColorStop(1, 'rgba(150,230,255,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 22 + R() * 20, 0); c.lineTo(x + 120, 460); c.lineTo(x + 70, 460); c.fill(); }
  c.restore();
  // far floor
  c.fillStyle = '#0c2440'; c.beginPath(); c.moveTo(0, 580); for (let x = 0; x <= W; x += 24) c.lineTo(x, 576 + Math.sin(x * 0.04) * 8); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.fillStyle = '#162f4a'; c.beginPath(); c.moveTo(0, 610); for (let x = 0; x <= W; x += 20) c.lineTo(x, 606 + Math.sin(x * 0.07 + 1) * 5); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  // coral fans
  for (const [x, y, col, s] of [[30, 600, '#c84a7a', 1], [70, 606, '#e07a4a', 0.7], [222, 604, '#8a5ac8', 0.8]]) { c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 3 * s;
    const br = (x0, y0, a, l, d) => { if (d > 4) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); br(x1, y1, a - 0.4, l * 0.72, d + 1); br(x1, y1, a + 0.4, l * 0.72, d + 1); };
    br(x, y, -Math.PI / 2, 20 * s, 0); }
}
// a whale seen from the side, far below; x, y = the middle of its body, s = scale; ph = tail beat
function whale(c, x, y, s, ph) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = c.createLinearGradient(0, -30, 0, 30); body.addColorStop(0, '#2a4f7e'); body.addColorStop(1, '#1a3358'); c.fillStyle = body;
  c.beginPath(); c.moveTo(-110, -4); c.bezierCurveTo(-100, -40, 30, -44, 80, -18); c.bezierCurveTo(100, -8, 106, 6, 96, 12); c.lineTo(130, 4 + ph * 10); c.lineTo(150, -16 + ph * 14); c.lineTo(142, 10 + ph * 6); c.lineTo(152, 30 + ph * 8); c.lineTo(126, 18 + ph * 8); c.bezierCurveTo(60, 36, -60, 40, -100, 20); c.closePath(); c.fill();
  c.fillStyle = '#9ab8d8'; c.globalAlpha = 0.35; c.beginPath(); c.moveTo(-100, 14); c.bezierCurveTo(-60, 34, 10, 34, 60, 22); c.bezierCurveTo(0, 28, -60, 26, -100, 14); c.fill(); c.globalAlpha = 1;
  c.strokeStyle = 'rgba(150,190,230,0.3)'; c.lineWidth = 1.5; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-96 + i * 5, 18 + i); c.lineTo(-30 + i * 6, 28 + i); c.stroke(); }
  c.fillStyle = '#1a3358'; c.beginPath(); c.moveTo(-40, 18); c.quadraticCurveTo(-30, 46 + ph * 4, -6, 42); c.quadraticCurveTo(-24, 30, -24, 20); c.fill();
  c.fillStyle = '#e8f4ff'; c.beginPath(); c.arc(-78, 0, 3.4, 0, 7); c.fill(); c.fillStyle = '#0a1830'; c.beginPath(); c.arc(-77.4, 0.4, 2, 0, 7); c.fill();
  c.restore();
}

MG.add({
  id: 'scinot', stage: 'powers', cmd: 'SCI NOTATION!', hint: 'drag', time: 9, winText: 'Notated!', hold: 1.8,
  card: {
    title: 'Scientific notation', ref: 'Grade 8', kind: 'Exponents',
    text: 'Scientists write very big and very small numbers in a short form: a number from 1 to 10, times a power of ten. For example, 34,000 = 3.4 × 10⁴.\n\nTo get there, move the decimal point until just one digit (not 0) is in front of it. Each place it moves to the left divides the front number by 10, so the power of ten goes up by one to make up for it. From 34,000 the point moves 4 places, so the power is 10⁴, and 10⁴ = 10,000.\n\nFor a small number the point moves right instead, and the power goes down: 0.00052 = 5.2 × 10⁻⁴.',
    note: 'Move the point to just after the first digit that is not 0. Count the places it moved: that is the power of ten (negative if it moved right).',
    ask: 'Write 6,200,000 in scientific notation. Write 0.0071 in scientific notation.',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g);
    const n0 = S.D.length; S.target = S.small ? S.f + 1 : 1; S.e = S.small ? -S.f : n0 - 1; S.size = n0 >= 6 ? 40 : 44;
    S.digits = S.D.split('').map((ch, i) => M.num(ch, 'd' + i)); S.pp = S.p; S.arcs = []; S.gw = 14;
    S.exp = M.num(0, 'ex'); S.tenp = M.sup(M.num(10, 'ten'), S.exp); S.tenp.id = 'tenp';
    S.top = M.row(M.num(S.small ? '0.' + S.D.slice(1) : commas(S.D), 'top')); M.place(g, 'top', S.top, 180, TOPY, 46, { col: INK });
    const relay = () => {
      const items = [M.op('=', 'eq'), M.gap(4)]; S.gaps = [];
      for (let k = 0; k <= S.digits.length; k++) { const gp = M.gap(k === S.p && !S.noPoint ? 16 : S.gw); gp.id = 'g' + k; S.gaps.push(gp); items.push(gp); if (k < S.digits.length) items.push(S.digits[k]); }
      items.push(M.op('×', 'tm'), S.tenp); S.row = M.row(...items); M.place(g, 'work', S.row, 180, WY, S.size, { col: INK });
      // drop zones: one per gap between digits (the pearl's own gap has none), the pearl itself, and the zeros
      const K = g.s.mk; for (const id of Object.keys(K.zones || {})) { delete K.zones[id]; delete K.box[id]; }
      if (!S.moved) for (let k = 0; k <= S.digits.length; k++) { if (k === S.p) continue; const b = M.box(g, 'g' + k), l = M.box(g, 'd' + (k - 1)) || b, r = M.box(g, 'd' + k) || b;
        const x0 = k ? l.x : b.x - 22, x1 = k < S.digits.length ? r.x : b.x + 22; M.zone(g, 'z' + k, { x: (x0 + x1) / 2, y: WY - 10, w: Math.max(14, x1 - x0), h: 70 }); }
      const pb = M.box(g, 'g' + S.p); if (pb && !S.moved) M.zone(g, 'pt', { x: pb.x, y: WY - 6, w: 26, h: 34 });
      const zs = zeroIds().map(id => M.box(g, id)).filter(Boolean); if (zs.length && !S.cleaned) M.zone(g, 'zeros', { ...M.unionBox(zs), h: 54 });
    };
    // the zeros that go once the point has moved: at the end of a big number, at the front of a small one
    const zeroIds = () => S.digits.map((d, i) => ({ d, i })).filter(({ d, i }) => S.small ? i < S.f : i >= S.sig.length).map(({ d }) => d.id);
    S.relay = relay; relay(); g.s.mk.relay = relay;
    M.inert(g, ['top', 'eq', 'tm', 'ten', 'ex', 'tenp', ...S.digits.map(d => d.id)]);
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const N = Math.abs(S.e), dirn = S.small ? 1 : -1, hd = M.clamp(1.15 / N, 0.2, 0.34) * T, hopsEnd = 0.15 * T + N * hd;
    // 1. the point hops to just after the first digit that is not 0
    const moveMv = {
      busy: 0.1, askAt: hopsEnd + 0.05 * T, after: 0.55 * T, ask: { v: S.e, wrong: [S.e - 1, S.e + 1, -S.e, S.e + dirn * -2] },
      then(g) {
        S.moved = true; S.point = true; hop('wow'); M.show(g, hopsEnd + 0.05 * T); g.sfx('swoosh'); S.dropAt = null;
        const K = g.s.mk; for (const id of Object.keys(K.zones || {})) if (id !== 'zeros') { delete K.zones[id]; delete K.box[id]; }
        for (let i = 0; i < N; i++) M.at(g, [[0.15 * T + i * hd, g => {
          const from = S.p, to = S.p + dirn, dg = S.digits[Math.min(from, to)]; S.p = to;
          M.tween(g, S, { pp: to }, hd * 0.92); S.arcs.push({ a: from, b: to, n: i + 1, t0: g.t, dur: hd * 0.92 });
          M.at(g, [[hd * 0.5, g => { dg.pop = g.t; g.sfx('tap', { pitch: 1 + i * 0.08 }); }]]);
          if (g.mode !== 'medium') M.at(g, [[hd * 0.7, g => { M.roll(g, S.exp, dirn * -(i + 1), { dur: Math.min(0.22, hd * 0.6) }); S.relay(); M.indicate(g, S.exp, { dur: Math.min(0.3, hd), sc: 1.25, col: GLOWC }); }]]);
        }]]);
      },
      resolve(g) {
        M.show(g, 0.55 * T); hop('laugh');
        if (g.mode === 'medium') { M.roll(g, S.exp, S.e, { dur: 0.25 * T }); S.relay(); }
        M.indicate(g, S.exp, { delay: 0.05 * T, dur: 0.35 * T, sc: 1.4, col: GLOWC }); M.sparkle(g, 'ex', { delay: 0.1 * T, n: 10, cols: ['#7ae0ff', '#fff'] }); g.sfx('ding');
        // the digits close up around the point
        M.at(g, [[0.3 * T, g => { S.gw = 2; S.arcsOut = g.t; relay(); }]]);
      },
    };
    // 2. the zeros float away
    const coef = S.sig.length > 1 ? S.sig[0] + '.' + S.sig.slice(1) : S.sig, sg = S.sig;
    const cleanMv = {
      busy: 0.1, tap: 'zeros', askAt: 0.5 * T, after: 0.9 * T,
      ask: { v: coef, wrong: sg.length > 1 ? [sg, '0.' + sg, sg[0] + '.0' + sg.slice(1)] : [sg + '0', '0.' + sg, sg + '00'] },
      then(g) {
        S.cleaned = true; hop('think'); M.show(g, 0.5 * T); const zs = zeroIds();
        M.circle(g, zs, { dur: 0.45 * T, col: GLOWC, pad: 6 });
        zs.forEach((id, i) => M.strike(g, id, { delay: 0.18 * T + i * 0.05 * T, dur: 0.14 * T, col: '#ff8a9a' }));
      },
      resolve(g) {
        M.show(g, 0.9 * T); const zs = zeroIds(); hop('wow'); g.sfx('bubble');
        S.bubbles = zs.map((id, i) => { const b = M.box(g, id); return { x: b.x, y: b.y, v: M.node(g, id).v, t0: g.t + i * 0.04 * T, sway: i }; });
        for (const id of zs) M.tween(g, id, { alpha: 0 }, 0.12 * T);
        M.at(g, [[0.16 * T, g => {
          if (S.small) { S.digits = S.digits.slice(S.f); S.p -= S.f; S.pp = S.p; } else S.digits = S.digits.slice(0, S.sig.length);
          S.digits.forEach((d, i) => { d.id = 'd' + i; }); if (S.digits.length === 1) S.noPoint = true; S.gw = 2; relay(); }],
          [0.5 * T, g => { const ids = S.digits.map(d => d.id); M.circle(g, [...ids, 'tenp'], { dur: 0.4 * T, col: '#ffe08a', pad: 8 }); M.sparkle(g, ids, { n: 12, cols: ['#ffe08a', '#fff', '#7ae0ff'] }); g.sfx('coin'); hop('laugh'); S.point = false; }]]);
      },
    };
    M.play(g, {
      moves(g) {
        if (!S.moved) return [{ ...moveMv, drag: 'pt', to: 'z' + S.target }, { ...moveMv, tap: 'z' + S.target }];
        if (!S.cleaned && zeroIds().length) return [cleanMv];
        return [];
      },
      area(g) { return !S.moved ? ['pt', 'z' + S.target] : !S.cleaned ? 'zeros' : null; },
      onWin(g) { for (const d of S.digits) d.pop = g.t; S.exp.pop = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; const info = K.missInfo || {}, id = info.to || info.tap;
      // the pearl in the wrong gap: that front number is not from 1 to 10
      const m = /^z(\d+)$/.exec(id || '');
      if (m) { const k = +m[1], D = S.D, s = (D.slice(0, k).replace(/^0+(?=\d)/, '') || '0') + (k < D.length ? '.' + D.slice(k) : ''), v = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
        const nd = M.num(v); nd.strike = { t0: g.t + 0.3, dur: 0.2, col: '#ff5a6a' }; S.badGap = { k, t0: g.t };
        M.note(g, { node: nd, at: id, off: [0, 62], s: 26, col: '#ff8a9a', write: 0.25, hold: 0.4, fade: 0.25 }); }
      // the zeros before the point moved: 34 is not 34,000
      if (id === 'zeros' && !S.moved) { const nd = M.row(M.num(S.sig), M.op('≠'), M.num(S.small ? '0.' + S.D.slice(1) : S.D)); S.badZeros = g.t;
        M.note(g, { node: nd, at: 'zeros', off: [0, 62], s: 26, col: '#ff8a9a', write: 0.3, hold: 0.45, fade: 0.25 }); } }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('powers_sci_deep', deep), 0, 0, W, H);
    // the whale glides by, far below; plankton drifts
    whale(c, ((t * 9 + 120) % 560) - 100, 500 + Math.sin(t * 0.4) * 6, 0.9, Math.sin(t * 1.6));
    for (let i = 0; i < 26; i++) { const x = (i * 71 + Math.sin(t * 0.3 + i) * 14) % 360, y = (i * 113 - t * (6 + i % 5) * 2) % 640, yy = y < 0 ? y + 640 : y; c.fillStyle = `rgba(190,240,255,${0.15 + 0.25 * Math.abs(Math.sin(t + i))})`; c.beginPath(); c.arc(x, yy, 1.2 + (i % 3) * 0.5, 0, 7); c.fill(); }
    // a soft glow behind the number
    c.save(); c.globalCompositeOperation = 'lighter'; for (const [y, r] of [[TOPY - 14, 120], [WY - 14, 160]]) { c.save(); c.translate(180, y); c.scale(1, 0.45); const gr = c.createRadialGradient(0, 0, 4, 0, 0, r); gr.addColorStop(0, 'rgba(90,200,255,0.2)'); gr.addColorStop(1, 'rgba(90,200,255,0)'); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.restore(); } c.restore();
    // the hops, numbered above the digits
    const gx = k => { const b = M.box(g, 'g' + k); return b ? b.x : null; };
    const fadeA = S.arcsOut != null ? Math.max(0, 1 - (t - S.arcsOut) / 0.3) : 1;
    if (fadeA > 0) for (const A of S.arcs) { const x0 = gx(A.a), x1 = gx(A.b); if (x0 == null || x1 == null) continue; const k = M.clamp((t - A.t0) / A.dur, 0, 1), top = WY - S.size * 0.95;
      c.save(); c.globalAlpha = fadeA; c.strokeStyle = 'rgba(255,240,200,0.8)'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath();
      for (let i = 0; i <= 16 * k; i++) { const u = i / 16, x = M.lerp(x0, x1, u), y = WY - 4 - Math.sin(u * Math.PI) * (WY - 4 - top); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.setLineDash([]);
      if (k > 0.4) { c.font = M.NUMF(19, 700); c.textAlign = 'center'; c.fillStyle = '#ffe08a'; c.shadowColor = 'rgba(0,10,30,0.9)'; c.shadowBlur = 4; c.globalAlpha = fadeA * Math.min(1, (k - 0.4) * 3); c.fillText(String(A.n), (x0 + x1) / 2, top - 6); }
      c.restore(); }
    // the zeros that float away as bubbles
    if (S.bubbles) for (const B of S.bubbles) { const k = (t - B.t0) / 1.1; if (k < 0 || k > 1) continue; const x = B.x + Math.sin(k * 8 + B.sway) * 6, y = B.y - k * 120 + k * k * 10, xx0 = 0, r = S.size * 0.42 * (1 + k * 0.3);
      c.save(); c.globalAlpha = 1 - k; c.strokeStyle = 'rgba(200,245,255,0.9)'; c.lineWidth = 2; c.fillStyle = 'rgba(150,220,255,0.15)'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(x - r * 0.4, y - r * 0.4, r * 0.18, 0, 7); c.fill(); c.font = M.NUMF(S.size * 0.6 * (1 - k * 0.3), 600); c.textAlign = 'center'; c.fillStyle = `rgba(232,251,255,${0.8 - k * 0.6})`; c.fillText(B.v, x, y + S.size * 0.2); c.restore(); }
    // the zeros shiver red after the early tap
    const shiver = S.badZeros != null && t - S.badZeros < 0.5;
    for (const d of S.digits) { const isZ = shiver && d.v === '0'; d.dx = isZ ? Math.sin((t - S.badZeros) * 50) * 3 : 0; d.col = isZ ? '#ff8a9a' : undefined; }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work');
    // the pearl (the decimal point): between the gaps it is passing, on a little arc
    if (!S.noPoint || (S.digits.length > 1)) {
      const K = S.mk, dragging = K.press && K.press.dragging && K.press.id === 'pt';
      let x, y; const k0 = Math.floor(S.pp), fr = S.pp - k0, xa = gx(k0), xb = gx(Math.min(S.digits.length, k0 + 1));
      if (dragging) { x = K.press.x; y = K.press.y - 18; } else if (xa != null) { x = fr > 0.001 && xb != null ? M.lerp(xa, xb, fr) : xa; y = WY - 4 - Math.sin(fr * Math.PI) * 30; }
      const bad = S.badGap && t - S.badGap.t0 < 0.5;
      if (bad) { const bx = gx(S.badGap.k); if (bx != null) { c.save(); c.globalAlpha = 0.8 * (1 - (t - S.badGap.t0) / 0.5); c.fillStyle = '#ff6a7a'; c.beginPath(); c.arc(bx + Math.sin((t - S.badGap.t0) * 50) * 3, WY - 4, 7, 0, 7); c.fill(); c.restore(); } }
      if (x != null && !(S.noPoint && S.digits.length <= 1)) { const r = 6.5; c.save(); c.shadowColor = '#bff0ff'; c.shadowBlur = 14; const pg = c.createRadialGradient(x - r * 0.35, y - r * 0.35, 1, x, y, r); pg.addColorStop(0, '#ffffff'); pg.addColorStop(0.6, PEARL); pg.addColorStop(1, '#d8c8d8'); c.fillStyle = pg; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore(); }
    }
    // the octopus, host of the deep
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', HX, HY - hopK * 22 + Math.sin(t * 1.5) * 3, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'octopus', HX, HY, 1.25);
    M.drawUI(g, c);
  },
});
