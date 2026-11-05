// animals.js — the animal cast of Q.E.D.! and the acorn lives icon, painted in the style of paint.js (soft light from the
// upper left, a cool core shadow, a warm rim light, plum outlines, blush and big glossy eyes).
//
// ANI.draw(c, kind, x, y, s = 1, o = {}) draws one animal standing with its feet at (x, y). At s = 1 a body is about
// 64 px tall (the ant about 40 with its antennae, the songbird about 50, the octopus about 70). Every animal faces right;
// o.facing = -1 mirrors it. Options:
//   t      seconds; drives the idle breathing, blinking, tail and ear sway, hops and waves
//   phase  offset in radians so a crowd does not move in step
//   expr   'happy' | 'laugh' | 'wow' | 'sad' | 'think'
//   pose   'idle' | 'cheer' (arms, wings or fins up, little hops) | 'wave' (front limb waving) | 'hop' (mid-jump, stretched)
//          | 'point' (front limb pointing the way the animal faces: right unless facing = -1) | 'carry' (holding something overhead)
//          | 'walk' (stepping bob, arms swinging) | 'balance' (arms out, wobbling) | 'sad' (drooping, arms down)
//   noShadow  true (or shadow: false) skips the ground shadow, e.g. for a flying or tilted animal
//   facing 1 | -1
//   tint   body colour override (hex)
//   hold   (c) => {} is called after the animal is drawn, with the context moved to the front hand (or, for 'carry', to the
//          spot just above the head where the load sits). The context keeps the animal's scale s but is never mirrored, so
//          text drawn there reads correctly; draw the held thing centred on (0, 0).
// It returns { hands: [{x, y}, {x, y}], hold: {x, y} } in the caller's coordinates (back hand, front hand, load point).
// ANI.acorn(c, x, y, s, gone) draws one life centred on (x, y); about 44 px tall at s = 2. gone draws a faint ghost.
// ANI.shell(c, x, y, R, o) draws the turtle's triangle shell alone, centred on its centroid, apex up, R = centre-to-corner.
// ANI.kinds lists the kind names.
//
// Speed: every static part (body, head, tail, ears) is painted once per kind, tint and pixel scale into an offscreen
// sprite and blitted after that; only eyes, mouths, limbs and tentacles are drawn live, with no gradients.
const ANI = (() => {
  const { shade, mix, rgba } = P;
  const TAU = Math.PI * 2, INK = '#3a1640', EYE = '#2a1424', MOUTH = '#8a2a44', TONGUE = '#f58a9c';
  const inkOf = col => mix(shade(col, -0.62), INK, 0.6);

  // ---------- sprite cache ----------
  const SPR = new Map();
  function scaleOf(c) { try { const m = c.getTransform(); return Math.max(Math.hypot(m.a, m.b), Math.hypot(m.c, m.d)); } catch (e) { return 2; } }
  // box = [x0, y0, w, h] in the part's own coordinates; the sprite is painted at the current pixel scale, rounded up to a
  // quarter octave, so it is never magnified by more than a few percent
  function sprite(c, key, box, paint) {
    const [x0, y0, w, h] = box, sc = scaleOf(c) || 1;
    const k = Math.min(12, Math.max(0.5, Math.pow(2, Math.ceil(Math.log2(sc) * 4 - 1e-6) / 4))), kk = key + '@' + k;
    let s = SPR.get(kk);
    if (s) { SPR.delete(kk); SPR.set(kk, s); }
    else {
      s = document.createElement('canvas'); s.width = Math.ceil(w * k) + 4; s.height = Math.ceil(h * k) + 4;
      const o = s.getContext('2d'); o.setTransform(k, 0, 0, k, 2 - x0 * k, 2 - y0 * k); o.lineJoin = 'round'; o.lineCap = 'round';
      paint(o); SPR.set(kk, s); if (SPR.size > 260) SPR.delete(SPR.keys().next().value);
    }
    c.drawImage(s, x0 - 2 / k, y0 - 2 / k, s.width / k, s.height / k);
  }

  // ---------- painting helpers (used inside sprites, so they may be generous) ----------
  const E = (x, y, rx, ry, r = 0) => o => { o.beginPath(); o.ellipse(x, y, rx, ry, r, 0, TAU); };
  const poly = pts => o => { o.beginPath(); pts.forEach(([x, y], i) => i ? o.lineTo(x, y) : o.moveTo(x, y)); o.closePath(); };
  // A painted part: plum outline (stroked behind, so only its outer half shows), a body gradient lit from the upper left,
  // a cool core shadow along the lower right, a warm rim of light along the upper left, and an optional gloss dab.
  function bl(o, path, col, x, y, r, opt = {}) {
    const lw = opt.lw ?? 1.9;
    if (lw > 0) { path(o); o.strokeStyle = opt.ink || inkOf(col); o.lineWidth = lw * 2; o.stroke(); }
    path(o);
    const g = o.createRadialGradient(x - r * 0.38, y - r * 0.5, r * 0.04, x - r * 0.1, y - r * 0.12, r * 1.25);
    g.addColorStop(0, shade(col, opt.hi ?? 0.3)); g.addColorStop(0.5, col); g.addColorStop(1, shade(col, -(opt.lo ?? 0.16)));
    o.fillStyle = g; o.fill();
    if (opt.rim !== false) {
      o.save(); path(o); o.clip();
      const cool = mix(shade(col, -0.45), '#4a2a7a', 0.35), sg = o.createLinearGradient(x + r * 0.95, y + r * 0.95, x - r * 0.2, y - r * 0.2);
      sg.addColorStop(0, rgba(cool, 0.42)); sg.addColorStop(1, rgba(cool, 0)); o.strokeStyle = sg; o.lineWidth = r * 0.5; path(o); o.stroke();
      const rim = mix(shade(col, 0.6), '#fff4d6', 0.45), lg = o.createLinearGradient(x - r, y - r, x + r * 0.15, y + r * 0.15);
      lg.addColorStop(0, rgba(rim, 0.95)); lg.addColorStop(1, rgba(rim, 0)); o.strokeStyle = lg; o.lineWidth = Math.min(4.4, r * 0.24); path(o); o.stroke();
      o.restore();
    }
    if (opt.gloss) { o.fillStyle = 'rgba(255,255,255,0.42)'; o.beginPath(); o.ellipse(x - r * 0.42, y - r * 0.56, r * 0.27, r * 0.13, -0.55, 0, TAU); o.fill(); }
  }
  // a softer patch painted on a part (belly, muzzle, bib): gradient, no rim, a faint edge
  function patch(o, path, col, x, y, r, edge = 0.22) {
    path(o); const g = o.createRadialGradient(x - r * 0.3, y - r * 0.45, r * 0.05, x, y, r * 1.15);
    g.addColorStop(0, shade(col, 0.35)); g.addColorStop(0.6, col); g.addColorStop(1, shade(col, -0.1)); o.fillStyle = g; o.fill();
    if (edge) { o.strokeStyle = rgba(inkOf(col), edge); o.lineWidth = 1.1; o.stroke(); }
  }
  function blush(o, x, y, r = 3) {
    const g = o.createRadialGradient(x, y, 0, x, y, r * 1.35); g.addColorStop(0, 'rgba(246,104,132,0.6)'); g.addColorStop(0.6, 'rgba(246,104,132,0.28)'); g.addColorStop(1, 'rgba(246,104,132,0)');
    o.fillStyle = g; o.beginPath(); o.ellipse(x, y, r * 1.35, r * 0.95, 0, 0, TAU); o.fill();
    o.fillStyle = 'rgba(255,255,255,0.55)'; o.beginPath(); o.arc(x - r * 0.35, y - r * 0.25, r * 0.16, 0, TAU); o.fill();
  }
  function star(o, x, y, R, r, n = 5, rot = -Math.PI / 2) { o.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r : R; i ? o.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) : o.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } o.closePath(); }
  // rounded polygon through the given corners
  function roundPoly(o, pts, rad) { const n = pts.length; o.beginPath(); const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; const s0 = m(pts[n - 1], pts[0]); o.moveTo(s0[0], s0[1]); for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; o.arcTo(p[0], p[1], q[0], q[1], rad); } o.closePath(); }

  // ---------- the turtle's triangle shell ----------
  // Equilateral, apex up, split into four by its medial triangle; the three corner triangles carry three different marks
  // (a coral dot at the apex, a blue diamond at the lower left, a gold star at the lower right) so any rotation or flip shows.
  function shellPaint(o, col, gx, gy, R) {
    const V = [0, 1, 2].map(i => { const a = -Math.PI / 2 + i * TAU / 3; return [gx + Math.cos(a) * R, gy + Math.sin(a) * R]; }); // apex, lower right, lower left
    const tri = o2 => roundPoly(o2, V, R * 0.2);
    bl(o, tri, col, gx, gy - R * 0.1, R * 1.05, { hi: 0.34, lw: 2 });
    o.save(); tri(o); o.clip();
    // a pale rim band just inside the edge
    o.strokeStyle = rgba(mix(shade(col, 0.55), '#fff2c0', 0.4), 0.55); o.lineWidth = R * 0.14; roundPoly(o, V.map(([x, y]) => [gx + (x - gx) * 0.93, gy + (y - gy) * 0.93]), R * 0.18); o.stroke();
    // the medial triangle: a slightly lighter centre scute with a grooved edge
    const Mi = [0, 1, 2].map(i => { const a = V[i], b = V[(i + 1) % 3]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; });
    o.fillStyle = rgba(shade(col, 0.2), 0.55); poly(Mi)(o); o.fill();
    o.strokeStyle = shade(col, -0.38); o.lineWidth = R * 0.07; poly(Mi)(o); o.stroke();
    o.strokeStyle = rgba(shade(col, 0.5), 0.6); o.lineWidth = R * 0.03; o.save(); o.translate(-R * 0.03, -R * 0.035); poly(Mi)(o); o.stroke(); o.restore();
    o.restore();
    // corner marks at the centroids of the three corner triangles
    const mk = V.map(([x, y]) => [x + (gx - x) * 0.5, y + (gy - y) * 0.5]), ink = INK, q = R * 0.17;
    const mark = (path, fill) => { path(o); o.strokeStyle = '#fff8e6'; o.lineWidth = R * 0.085; o.stroke(); o.fillStyle = fill; o.fill(); o.strokeStyle = ink; o.lineWidth = Math.max(1, R * 0.035); o.stroke(); };
    mark(E(mk[0][0], mk[0][1], q, q), '#ff6b5e');
    mark(o2 => star(o2, mk[1][0], mk[1][1] + q * 0.08, q * 1.3, q * 0.58), '#ffd23a');
    mark(poly([[mk[2][0], mk[2][1] - q * 1.15], [mk[2][0] + q * 0.95, mk[2][1]], [mk[2][0], mk[2][1] + q * 1.15], [mk[2][0] - q * 0.95, mk[2][1]]]), '#4aa6f0');
    o.fillStyle = 'rgba(255,255,255,0.75)'; for (const [x, y] of mk) { o.beginPath(); o.arc(x - q * 0.35, y - q * 0.38, q * 0.24, 0, TAU); o.fill(); }
  }

  // ---------- the cast ----------
  // Each kind: col (body colour), extra palette entries, sprite layers (static parts; layers marked head share the head's
  // tilt, rot layers swing about their pivot), the face spec, the limbs, and optional live hooks (back, headBack, front).
  const K = {};
  K.frog = {
    col: '#6cc24a', shadow: 24, cx: 0, top: -58, carryW: 21, pal: { belly: '#f0f6b4', throat: '#fbf3cc' },
    layers: [{ id: 'body', box: [-38, -64, 76, 70], paint(o, C) {
      bl(o, E(-22, -11, 10, 8, -0.35), C.b, -22, -11, 10);
      bl(o, E(22, -11, 10, 8, 0.35), C.b, 22, -11, 10);
      const body = q => { q.beginPath(); q.moveTo(-24, -5); q.bezierCurveTo(-31, -20, -30, -35, -21.2, -42.9); q.arc(-11, -47, 11, 2.76, 6.55); q.quadraticCurveTo(0, -43, 0.4, -44.1); q.arc(11, -47, 11, 2.87, 6.66); q.bezierCurveTo(30, -35, 31, -20, 24, -5); q.quadraticCurveTo(0, 2, -24, -5); q.closePath(); };
      bl(o, body, C.b, 0, -30, 30);
      o.save(); body(o); o.clip(); patch(o, E(0, -14, 17, 12), C.belly, 0, -14, 16); o.restore();
      o.fillStyle = rgba(shade(C.b, -0.3), 0.5); for (const [x, y, r] of [[-19, -28, 3.2], [19, -31, 2.6], [-14, -21, 2], [22, -22, 1.8], [-4, -36, 1.6]]) { o.beginPath(); o.ellipse(x, y, r, r * 0.8, 0.3, 0, TAU); o.fill(); }
      o.fillStyle = 'rgba(255,255,255,0.45)'; for (const sx of [-1, 1]) { o.beginPath(); o.ellipse(sx * 11 - 4, -54, 3.6, 1.8, -0.5, 0, TAU); o.fill(); }
      blush(o, -16, -37.5, 3.4); blush(o, 16, -37.5, 3.4);
      for (const sx of [-1, 1]) { const fx = sx * 14; for (let k = -1; k <= 1; k++) bl(o, E(fx + k * 4.4 + sx, 0.4, 2.4, 1.9), shade(C.b, 0.08), fx + k * 4.4, 0, 2.4, { rim: false, lw: 1.3 }); bl(o, E(fx, -1.6, 6.5, 3), C.b, fx, -1.6, 6, { rim: false, lw: 1.3 }); }
    } }],
    face: { l: [-11, -47.5], r: [11, -47.5], er: 5.3, mouth: [0, -37.5], mw: 7, style: 'smile' },
    arms: { type: 'arm', sh: [[-18, -24], [18, -24]], len: 13, w: 5.6, hand: 3.6 },
    chin: [7, -33],
    front(c, A, C) { // the throat sac puffs now and then
      if (A.expr === 'laugh' || A.expr === 'wow') return;
      const p = Math.pow(Math.max(0, Math.sin(A.t * 2.3 + A.ph)), 4) * 3; if (p < 0.15) return;
      c.globalAlpha = Math.min(1, p); c.fillStyle = C.throat; c.strokeStyle = rgba(inkOf(C.b), 0.55); c.lineWidth = 1; c.beginPath(); c.ellipse(0, -29 + p * 0.6, 3 + p * 1.6, 1.5 + p * 1.1, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(-1 - p * 0.4, -29.5, 1 + p * 0.4, 0.4 + p * 0.25, 0, 0, TAU); c.fill(); c.globalAlpha = 1;
    },
  };
  K.ant = {
    col: '#d4503e', shadow: 17, cx: 11.5, top: -33, carryW: 12, pivot: [5, -18], pal: { leg: '#5a2030' },
    layers: [
      { id: 'body', box: [-28, -28, 46, 32], paint(o, C) {
        o.strokeStyle = C.leg; o.lineWidth = 2; o.lineCap = 'round';
        for (const [a, b, d] of [[[-1, -12], [-7, -7], [-10, 0]], [[1, -12], [-1, -6], [-3, 0]], [[3, -12], [7, -6], [6, 0]], [[5, -12], [11, -7], [13, 0]]]) { o.beginPath(); o.moveTo(...a); o.quadraticCurveTo(...b, ...d); o.stroke(); }
        o.fillStyle = C.leg; for (const x of [-10, -3, 6, 13]) { o.beginPath(); o.ellipse(x + 0.8, 0, 2, 1.1, 0, 0, TAU); o.fill(); }
        bl(o, E(-14, -13, 11, 9, -0.35), C.b, -14, -14, 10.5, { gloss: true });
        o.save(); E(-14, -13, 11, 9, -0.35)(o); o.clip(); o.strokeStyle = rgba(shade(C.b, -0.35), 0.45); o.lineWidth = 1.4; for (const dx of [-5, 0]) { o.beginPath(); o.ellipse(-14 + dx - 6, -13 + dx * 0.2, 9, 12, -0.35, -0.55, 0.55); o.stroke(); } o.restore();
        bl(o, E(-3, -13, 3.2, 2.6), shade(C.b, -0.1), -3, -13, 3, { rim: false, lw: 1.4 });
        bl(o, E(3, -15, 5.2, 4.4, 0.3), C.b, 3, -15, 5);
      } },
      { id: 'head', head: true, box: [-4, -38, 32, 30], paint(o, C) {
        bl(o, E(11.5, -22.5, 10.6, 10), C.b, 11.5, -22.5, 10.5, { gloss: true });
        blush(o, 5.5, -19, 2.4); blush(o, 18.5, -19, 2.4);
      } }],
    headBack(c, A, C) { // antennae with a slow sway
      const s1 = Math.sin(A.t * 3 + A.ph) * 1.6, s2 = Math.sin(A.t * 3 + A.ph + 1.2) * 1.6, ink = inkOf(C.b);
      c.lineCap = 'round'; c.strokeStyle = ink; c.lineWidth = 1.9;
      c.beginPath(); c.moveTo(8, -30); c.quadraticCurveTo(5 + s1, -39, 0 + s1, -40); c.moveTo(15, -30); c.quadraticCurveTo(19 + s2, -39, 24 + s2, -39); c.stroke();
      for (const [x, y] of [[s1, -40], [24 + s2, -39]]) { c.fillStyle = ink; c.beginPath(); c.arc(x, y, 2.9, 0, TAU); c.fill(); c.fillStyle = C.b; c.beginPath(); c.arc(x, y, 2, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(x - 0.6, y - 0.7, 0.7, 0, TAU); c.fill(); }
    },
    face: { l: [7.5, -24], r: [16, -24], er: 3.5, mouth: [12, -17.6], mw: 2.8, style: 'smile' },
    arms: { type: 'stick', sh: [[3, -15.5], [18.5, -14]], len: 11, w: 2.1, hand: 2.3, col: C => C.leg },
    chin: [12, -15],
  };
  K.penguin = {
    col: '#34426e', shadow: 20, cx: 1, top: -59, carryW: 20, pal: { white: '#fbf8f2', orange: '#f6a23a' },
    layers: [{ id: 'body', box: [-30, -70, 60, 74], paint(o, C) {
      bl(o, q => { q.beginPath(); q.moveTo(-2, -58); q.quadraticCurveTo(-2, -67, 5, -67); q.quadraticCurveTo(1, -63, 3, -58); q.closePath(); }, C.b, 1, -62, 5, { rim: false, lw: 1.5 });
      const body = q => { q.beginPath(); q.moveTo(0, -60); q.bezierCurveTo(16, -60, 24, -42, 24, -24); q.bezierCurveTo(24, -7, 13, -1, 0, -1); q.bezierCurveTo(-13, -1, -24, -7, -24, -24); q.bezierCurveTo(-24, -42, -16, -60, 0, -60); q.closePath(); };
      bl(o, body, C.b, 0, -34, 30, { hi: 0.42 });
      const d = 1.5, white = q => { q.beginPath(); q.moveTo(d, -46); q.bezierCurveTo(d + 7, -55, d + 18, -51, d + 17, -42); q.bezierCurveTo(d + 16, -36, d + 15, -33, d + 16, -26); q.bezierCurveTo(d + 17, -12, d + 10, -4, d, -4); q.bezierCurveTo(d - 10, -4, d - 17, -12, d - 16, -26); q.bezierCurveTo(d - 15, -33, d - 16, -36, d - 17, -42); q.bezierCurveTo(d - 18, -51, d - 7, -55, d, -46); q.closePath(); };
      white(o); const g = o.createRadialGradient(-4, -40, 2, 2, -26, 26); g.addColorStop(0, '#ffffff'); g.addColorStop(0.6, C.white); g.addColorStop(1, '#d8dcec'); o.fillStyle = g; o.fill(); o.strokeStyle = rgba(INK, 0.25); o.lineWidth = 1; o.stroke();
      blush(o, -9.5, -35, 3); blush(o, 13, -35, 3);
      for (const fx of [-8, 9]) bl(o, E(fx, -1.5, 7, 3.2), C.orange, fx, -1.5, 6, { rim: false, lw: 1.5 });
    } }],
    face: { l: [-5.5, -41.5], r: [8.5, -41.5], er: 4.4, mouth: [1.5, -35.5], mw: 3.6, style: 'beak', beakCol: '#f6a23a' },
    arms: { type: 'wing', sh: [[-21, -33], [21, -33]], len: 17, w: 7.5, col: C => shade(C.b, -0.1) },
    chin: [6, -32],
  };
  K.duck = {
    col: '#ffd23f', shadow: 22, cx: 7, top: -54, carryW: 16, pivot: [6, -28], pal: { bill: '#ff9a2e' },
    layers: [
      { id: 'body', box: [-34, -40, 64, 44], paint(o, C) {
        for (const fx of [-6, 9]) bl(o, q => { q.beginPath(); q.moveTo(fx - 3, -3); q.lineTo(fx + 7, 0.5); q.quadraticCurveTo(fx + 4, 2.2, fx, 1.6); q.quadraticCurveTo(fx - 4, 1.2, fx - 3, -3); q.closePath(); }, C.bill, fx + 2, 0, 5, { rim: false, lw: 1.4 });
        const body = q => { q.beginPath(); q.moveTo(-24.5, -29); q.quadraticCurveTo(-21, -21, -19, -18); q.bezierCurveTo(-23, -6, -12, -1, 1, -1); q.bezierCurveTo(15, -1, 23, -8, 22, -18); q.bezierCurveTo(21, -27, 13, -31, 5, -30); q.bezierCurveTo(-3, -29, -11, -24, -16, -24.5); q.quadraticCurveTo(-21, -25, -24.5, -29); q.closePath(); };
        bl(o, body, C.b, 0, -18, 22);
        o.save(); body(o); o.clip(); o.strokeStyle = rgba(shade(C.b, -0.3), 0.35); o.lineWidth = 1.2; for (const k of [0, 1]) { o.beginPath(); o.moveTo(-24 + k * 3, -26 + k * 2); o.quadraticCurveTo(-19 + k * 3, -22, -15 + k * 3, -22 + k * 2); o.stroke(); } o.restore();
      } },
      { id: 'head', head: true, box: [-10, -64, 34, 40], paint(o, C) {
        bl(o, q => { q.beginPath(); q.moveTo(4, -53); q.quadraticCurveTo(3, -61, 10, -62); q.quadraticCurveTo(6, -58, 8.5, -53); q.closePath(); }, C.b, 6, -57, 5, { rim: false, lw: 1.5 });
        bl(o, E(7, -41, 13.2, 12.8), C.b, 7, -41, 13, { gloss: true });
        blush(o, -0.5, -37.5, 2.8); blush(o, 15, -36, 2.4);
      } }],
    face: { l: [2.5, -44], r: [12, -44], er: 3.8, mouth: [16, -38.5], mw: 6, style: 'bill', beakCol: '#ff9a2e' },
    arms: { type: 'wing', sh: [[-11, -19], [13, -19]], len: 14, w: 7, col: C => shade(C.b, -0.08) },
    chin: [16, -33],
  };
  K.turtle = {
    col: '#8fd06a', shadow: 30, cx: 0, top: -62, carryW: 14, pivot: [24, -14], pal: { shell: '#3f9a5c', plastron: '#f2e2a2' },
    carry: { hold: [0, -72] }, // the load balances on the shell's apex; the legs stay down
    layers: [
      { id: 'body', box: [-40, -70, 74, 74], paint(o, C) {
        // four identical stubby legs: the back pair a little darker and higher, half hidden behind the front pair
        const leg = (x, y, col) => bl(o, q => { q.beginPath(); q.roundRect ? q.roundRect(x - 5.5, y - 9, 11, 12, 5) : q.rect(x - 5.5, y - 9, 11, 12); }, col, x, y - 3, 6, { lw: 1.6 });
        leg(-20, -5, shade(C.b, -0.14)); leg(20, -5, shade(C.b, -0.14)); leg(-9, -1.5, C.b); leg(9, -1.5, C.b);
        bl(o, q => { q.beginPath(); q.roundRect ? q.roundRect(-28, -20, 56, 11, 5.5) : q.rect(-28, -20, 56, 11); }, C.plastron, 0, -15, 20, { rim: false, lw: 1.6 });
        o.strokeStyle = rgba(shade(C.plastron, -0.4), 0.5); o.lineWidth = 1; o.beginPath(); for (const x of [-14, 0, 14]) { o.moveTo(x, -19); o.lineTo(x, -10); } o.stroke();
        shellPaint(o, C.shell, 0, -30.4, 31.2);
      } },
      { id: 'head', head: true, box: [14, -38, 34, 32], paint(o, C) {
        bl(o, E(31, -23.5, 10.6, 10), C.b, 31, -23.5, 10.5, { gloss: true });
        blush(o, 25.5, -19.5, 2.3); blush(o, 37, -19.5, 2.1);
      } }],
    face: { l: [27.5, -25.5], r: [35, -25.5], er: 3.2, mouth: [31.5, -19.2], mw: 2.6, style: 'smile' },
    arms: { type: 'none', sh: [[-20, -14], [20, -14]], len: 4, w: 6 }, // no arms: a turtle has just its four legs
    chin: [30, -15],
  };
  K.octopus = {
    col: '#f27aa2', shadow: 28, cx: 0, top: -69, carryW: 24,
    layers: [{ id: 'body', box: [-30, -76, 60, 60], paint(o, C) {
      const mantle = q => { q.beginPath(); q.moveTo(-22, -30); q.bezierCurveTo(-25, -53, -13, -70, 0, -70); q.bezierCurveTo(13, -70, 25, -53, 22, -30); q.bezierCurveTo(20, -22, 12, -19, 0, -19); q.bezierCurveTo(-12, -19, -20, -22, -22, -30); q.closePath(); };
      bl(o, mantle, C.b, 0, -48, 26, { gloss: true, hi: 0.35 });
      o.fillStyle = rgba(shade(C.b, 0.42), 0.75); for (const [x, y, r] of [[-11, -58, 3], [8, -62, 2.3], [14, -52, 1.9], [-16, -47, 1.6], [3, -55, 1.4]]) { o.beginPath(); o.arc(x, y, r, 0, TAU); o.fill(); }
      blush(o, -14.5, -32, 3); blush(o, 16, -32, 3);
    } }],
    back(c, A, C) { // six arms resting on the ground, curling up at the tips; their slow sway is cached as 12 sprite frames
      const q = ((Math.round((A.t * 2.2 + A.ph) / TAU * 12) % 12) + 12) % 12, col = shade(C.b, -0.1), ink = inkOf(C.b);
      sprite(c, 'octopus.arms' + q + C.b, [-50, -32, 100, 38], o => { const th = q / 12 * TAU;
        for (let i = 0; i < 6; i++) { const side = i < 3 ? -1 : 1, k = side < 0 ? 2 - i : i - 3, bx = -12.5 + i * 5, sw = Math.sin(th + i * 1.3);
          tentacle(o, bx, -24, bx + side * (9 + k * 7) + sw * 1.5, -3 - k * 0.5, side * (k * 3 + 2), 5.6 - k * 0.3, -side * (0.62 + sw * 0.1), col, ink); } });
    },
    face: { l: [-7.5, -39.5], r: [9.5, -39.5], er: 5, mouth: [1, -29.6], mw: 3.8, style: 'smile' },
    arms: { type: 'tentacle', sh: [[-16, -27], [16, -27]], len: 22, w: 5.6 },
    chin: [6, -27],
  };
  K.owl = {
    col: '#a3714e', shadow: 22, cx: 0, top: -56, carryW: 26, pal: { disc: '#f6e6c8', belly: '#ecd2aa', beak: '#f2a03a', ring: '#ffc63a' },
    layers: [{ id: 'body', box: [-34, -70, 68, 74], paint(o, C) {
      for (const sx of [-1, 1]) bl(o, q => { q.beginPath(); q.moveTo(sx * 20, -47); q.quadraticCurveTo(sx * 21, -56, sx * 22.5, -62); q.quadraticCurveTo(sx * 18, -59.5, sx * 16.5, -57); q.quadraticCurveTo(sx * 15, -58.5, sx * 12, -59); q.quadraticCurveTo(sx * 11.5, -55, sx * 9, -53); q.closePath(); }, shade(C.b, -0.08), sx * 17, -55, 7, { rim: false, lw: 1.6 });
      o.fillStyle = C.beak; o.strokeStyle = inkOf(C.beak); o.lineWidth = 1.2; for (const fx of [-8, 8]) for (let k = -1; k <= 1; k++) { o.beginPath(); o.ellipse(fx + k * 2.8, 0, 1.6, 1.9, 0, 0, TAU); o.fill(); o.stroke(); }
      const body = q => { q.beginPath(); q.moveTo(0, -56); q.bezierCurveTo(18, -56, 25, -38, 25, -22); q.bezierCurveTo(25, -6, 14, -1.5, 0, -1.5); q.bezierCurveTo(-14, -1.5, -25, -6, -25, -22); q.bezierCurveTo(-25, -38, -18, -56, 0, -56); q.closePath(); };
      bl(o, body, C.b, 0, -32, 29);
      o.save(); body(o); o.clip();
      patch(o, E(0, -13, 15.5, 12.5), C.belly, 0, -13, 14);
      o.strokeStyle = rgba(shade(C.belly, -0.35), 0.75); o.lineWidth = 1.2; for (const [y, xs] of [[-19, [-6, 0, 6]], [-13, [-9, -3, 3, 9]], [-7, [-6, 0, 6]]]) for (const x of xs) { o.beginPath(); o.moveTo(x - 2, y - 1.2); o.lineTo(x, y + 0.6); o.lineTo(x + 2, y - 1.2); o.stroke(); }
      o.restore();
      const disc = q => { q.beginPath(); q.moveTo(0, -47); q.bezierCurveTo(6, -51.5, 21.5, -51, 21, -37); q.bezierCurveTo(20.5, -27, 9, -24.5, 0, -28); q.bezierCurveTo(-9, -24.5, -20.5, -27, -21, -37); q.bezierCurveTo(-21.5, -51, -6, -51.5, 0, -47); q.closePath(); };
      bl(o, disc, C.disc, 0, -38, 20, { rim: false, lw: 1.3, ink: rgba(shade(C.b, -0.45), 0.8), hi: 0.4, lo: 0.08 });
      blush(o, -14, -30, 2.8); blush(o, 14, -30, 2.8);
    } }],
    face: { l: [-9.5, -38.5], r: [9.5, -38.5], er: 5.4, mouth: [0, -31], mw: 3.4, style: 'beak', beakCol: '#f2a03a', ring: { r: 7.6, col: '#ffc63a' } },
    arms: { type: 'wing', sh: [[-22, -31], [22, -31]], len: 19, w: 9, col: C => shade(C.b, -0.14) },
    chin: [5, -27],
  };
  K.beaver = {
    col: '#b0703e', shadow: 26, cx: 2, top: -57, carryW: 20, pivot: [2, -34], pal: { belly: '#dca676', muzzle: '#f6e0c2', tail: '#6e5446', nose: '#4a2a30' },
    layers: [
      { id: 'tail', pivot: [-14, -6], rot: A => A.pose === 'cheer' ? Math.sin(A.t * 10 + A.ph) * 0.14 : A.sway * 0.04, box: [-52, -18, 42, 22], paint(o, C) {
        const tail = E(-31, -7, 17, 7, 0.1); bl(o, tail, C.tail, -31, -8, 15);
        o.save(); tail(o); o.clip(); o.strokeStyle = rgba(shade(C.tail, -0.4), 0.55); o.lineWidth = 1; o.beginPath(); for (let x = -50; x < -10; x += 4) { o.moveTo(x, -16); o.lineTo(x + 10, 2); o.moveTo(x + 10, -16); o.lineTo(x, 2); } o.stroke(); o.restore();
      } },
      { id: 'body', box: [-28, -48, 56, 52], paint(o, C) {
        for (const fx of [-9, 10]) bl(o, E(fx, -1.6, 7, 3.3), shade(C.b, -0.35), fx, -1.6, 6, { rim: false, lw: 1.4 });
        const body = q => { q.beginPath(); q.moveTo(0, -44); q.bezierCurveTo(16, -44, 23, -28, 23, -16); q.bezierCurveTo(23, -4, 12, -1, 0, -1); q.bezierCurveTo(-12, -1, -23, -4, -23, -16); q.bezierCurveTo(-23, -28, -16, -44, 0, -44); q.closePath(); };
        bl(o, body, C.b, 0, -24, 24);
        o.save(); body(o); o.clip(); patch(o, E(1.5, -16, 13, 12.5), C.belly, 1.5, -16, 12); o.restore();
      } },
      { id: 'head', head: true, box: [-20, -66, 44, 46], paint(o, C) {
        for (const ex of [-12.5, 16.5]) { bl(o, E(ex, -50.5, 4.2, 4), C.b, ex, -50.5, 4, { rim: false, lw: 1.5 }); o.fillStyle = rgba(shade(C.b, -0.4), 0.7); o.beginPath(); o.arc(ex, -50.2, 1.9, 0, TAU); o.fill(); }
        const head = q => { q.beginPath(); q.moveTo(2, -56.5); q.bezierCurveTo(11, -56.5, 16.5, -51.5, 17.5, -45.5); q.bezierCurveTo(21.5, -42, 21.5, -34, 14.5, -30.5); q.bezierCurveTo(9, -28.5, -5, -28.5, -10.5, -30.5); q.bezierCurveTo(-17.5, -34, -17.5, -42, -13.5, -45.5); q.bezierCurveTo(-12.5, -51.5, -7, -56.5, 2, -56.5); q.closePath(); };
        bl(o, head, C.b, 2, -44, 17, { gloss: true });
        bl(o, q => { q.beginPath(); q.ellipse(0, -37.6, 6.2, 4.9, 0, 0, TAU); q.moveTo(13.2, -37.6); q.ellipse(7, -37.6, 6.2, 4.9, 0, 0, TAU); }, C.muzzle, 3.5, -38, 8, { rim: false, lw: 1.1, ink: rgba(inkOf(C.b), 0.65) });
        o.fillStyle = rgba(shade(C.b, -0.3), 0.7); for (const [x, y] of [[-2.5, -37], [-0.5, -35.5], [-3, -34.6], [9.5, -37], [7.5, -35.5], [10, -34.6]]) { o.beginPath(); o.arc(x, y, 0.55, 0, TAU); o.fill(); }
        bl(o, q => { q.beginPath(); q.moveTo(-0.8, -42.6); q.quadraticCurveTo(3.5, -45, 7.8, -42.6); q.quadraticCurveTo(7.2, -39.2, 3.5, -38.6); q.quadraticCurveTo(-0.2, -39.2, -0.8, -42.6); q.closePath(); }, C.nose, 3.5, -41.5, 4, { rim: false, lw: 1, gloss: true });
        blush(o, -9.5, -39, 2.7); blush(o, 16.5, -39, 2.7);
      } }],
    face: { l: [-4, -47], r: [11, -47], er: 3.7, mouth: [3.5, -34.6], mw: 2.4, style: 'teeth' },
    arms: { type: 'arm', sh: [[-17, -27], [18, -27]], len: 12, w: 6.2, hand: 3.7, handCol: C => shade(C.b, -0.25) },
    chin: [8, -31],
  };
  K.bird = {
    col: '#5aa8e6', shadow: 15, cx: 1, top: -41, carryW: 20, pal: { breast: '#ffab70', beak: '#ffb43a' },
    layers: [
      { id: 'tail', pivot: [-13, -19], rot: A => Math.sin(A.t * 6 + A.ph) * 0.09 + (A.pose === 'cheer' ? 0.15 : 0), box: [-36, -42, 28, 30], paint(o, C) {
        for (const [a, l] of [[-0.95, 17], [-0.65, 19], [-0.35, 16]]) { const x = -13 + Math.cos(Math.PI + a) * l * 0.5, y = -19 + Math.sin(Math.PI + a) * l * 0.5; bl(o, E(x, y, l * 0.55, 3.6, a), shade(C.b, -0.15), x, y, 8, { rim: false, lw: 1.5 }); }
      } },
      { id: 'body', box: [-24, -54, 48, 58], paint(o, C) {
        o.strokeStyle = C.beak; o.lineWidth = 1.9; o.lineCap = 'round'; o.beginPath(); for (const x of [-4, 6]) { o.moveTo(x, -6); o.lineTo(x, -0.5); o.moveTo(x - 2.6, 0); o.lineTo(x + 2.6, 0); } o.stroke();
        bl(o, q => { q.beginPath(); q.moveTo(-1, -39); q.quadraticCurveTo(-3, -48, 3.5, -50); q.quadraticCurveTo(0.5, -45, 3, -40); q.moveTo(3, -40); q.quadraticCurveTo(5, -47, 10, -46); q.quadraticCurveTo(6.5, -43, 6.5, -39); q.closePath(); }, C.b, 3, -44, 6, { rim: false, lw: 1.5 });
        const body = E(1, -22, 18.5, 19);
        bl(o, body, C.b, 1, -24, 19, { gloss: true });
        o.save(); body(o); o.clip(); patch(o, E(4, -12, 13, 11), C.breast, 4, -12, 12, 0); o.restore();
        blush(o, -5.5, -21.5, 2.7); blush(o, 14, -21.5, 2.7);
      } }],
    face: { l: [-1.5, -27.5], r: [9.5, -27.5], er: 3.7, mouth: [4.2, -22.4], mw: 3.2, style: 'beak', beakCol: '#ffb43a' },
    arms: { type: 'wing', sh: [[-15, -21], [17, -21]], len: 12, w: 7, col: C => shade(C.b, -0.12) },
    chin: [6, -19],
  };
  K.rabbit = {
    col: '#f6efe8', shadow: 18, cx: 2.5, top: -48, carryW: 17, pivot: [2, -24], pal: { pink: '#f7a8bc', nose: '#f07c98' },
    layers: [
      { id: 'tail', box: [-24, -20, 16, 18], paint(o, C) { bl(o, q => { q.beginPath(); for (const [x, y, r] of [[-14, -11, 5.2], [-17, -8, 3.6], [-11, -7, 3.8], [-16, -14, 3.4]]) { q.moveTo(x + r, y); q.arc(x, y, r, 0, TAU); } }, C.b, -14, -11, 6, { rim: false, lw: 1.5 }); } },
      { id: 'body', box: [-20, -32, 42, 36], paint(o, C) {
        for (const fx of [-7, 9]) { bl(o, E(fx, -2, 6.6, 3.6), C.b, fx, -2, 6, { rim: false, lw: 1.5 }); o.fillStyle = rgba(C.pink, 0.8); o.beginPath(); o.ellipse(fx, -1.6, 2.4, 1.4, 0, 0, TAU); o.fill(); }
        bl(o, E(1, -14, 14, 13), C.b, 1, -15, 14);
        patch(o, E(2, -11, 8, 8), '#ffffff', 2, -11, 8, 0);
      } },
      { id: 'earL', head: true, pivot: [-2, -44], rot: A => (A.expr === 'sad' ? -0.7 : 0) + Math.sin(A.t * 1.7 + A.ph) * 0.05 + (A.pose === 'cheer' ? Math.sin(A.t * 10 + A.ph) * 0.12 : 0), box: [-16, -74, 24, 32], paint: (o, C) => ear(o, C, -4.5, -57, -0.18) },
      { id: 'earR', head: true, pivot: [7, -44], rot: A => (A.expr === 'sad' ? 0.7 : 0) + Math.sin(A.t * 1.9 + A.ph + 1) * 0.06 - (A.pose === 'cheer' ? Math.sin(A.t * 10 + A.ph) * 0.12 : 0), box: [-4, -74, 26, 32], paint: (o, C) => ear(o, C, 9, -57, 0.2) },
      { id: 'head', head: true, box: [-18, -52, 42, 34], paint(o, C) {
        bl(o, E(2.5, -35, 15.5, 13.6), C.b, 2.5, -36, 15, { gloss: true });
        for (const x of [0.4, 4.8]) bl(o, E(x, -29.6, 3.6, 2.8), '#ffffff', x, -29.6, 3, { rim: false, lw: 0.7, ink: rgba(INK, 0.35) });
        bl(o, q => { q.beginPath(); q.moveTo(0.6, -33.6); q.quadraticCurveTo(2.6, -34.6, 4.6, -33.6); q.quadraticCurveTo(3.8, -31.2, 2.6, -31); q.quadraticCurveTo(1.4, -31.2, 0.6, -33.6); q.closePath(); }, C.nose, 2.6, -32.6, 2.4, { rim: false, lw: 0.9 });
        blush(o, -8.5, -30.5, 2.9); blush(o, 14, -30.5, 2.9);
        o.strokeStyle = rgba(INK, 0.35); o.lineWidth = 0.8; o.beginPath(); for (const s of [-1, 1]) { const x = s < 0 ? -3.4 : 8.6; o.moveTo(x, -30.5); o.lineTo(x + s * 7, -31.8); o.moveTo(x, -29.3); o.lineTo(x + s * 7, -28.8); } o.stroke();
      } }],
    face: { l: [-4, -37.5], r: [9.5, -37.5], er: 3.9, mouth: [2.6, -29.2], mw: 2.2, style: 'w' },
    arms: { type: 'arm', sh: [[-11, -20], [13, -20]], len: 9, w: 5.2, hand: 3.1 },
    chin: [7, -26],
  };
  function ear(o, C, x, y, rot) { bl(o, E(x, y, 5, 12, rot), C.b, x, y, 9); o.save(); o.translate(x, y + 1.5); o.rotate(rot); patch(o, E(0, 0, 2.6, 8.6), C.pink, 0, 0, 6, 0); o.restore(); }
  K.hedgehog = {
    col: '#f2d6aa', shadow: 24, cx: 1.5, top: -52, carryW: 25, pal: { spine: '#8a5a3c', nose: '#3a2030' },
    layers: [{ id: 'body', box: [-34, -60, 70, 64], paint(o, C) {
      for (const fx of [-9, 11]) bl(o, E(fx, -1.6, 5.6, 3), shade(C.spine, -0.2), fx, -1.6, 5, { rim: false, lw: 1.3 });
      const cx = 0, cy = -25, spikes = (R1, R2, a0, a1, n) => q => { q.beginPath(); for (let i = 0; i <= n * 2; i++) { const a = a0 + (a1 - a0) * i / (n * 2), r = i % 2 ? R1 : R2; const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * 0.95; i ? q.lineTo(px, py) : q.moveTo(px, py); } q.lineTo(cx, cy + 6); q.closePath(); };
      bl(o, spikes(29, 22, Math.PI * 0.72, Math.PI * 2.28, 13), C.spine, 0, -32, 28, { hi: 0.28 });
      o.save(); spikes(29, 22, Math.PI * 0.72, Math.PI * 2.28, 13)(o); o.clip();
      o.fillStyle = rgba(shade(C.spine, -0.2), 0.7); spikes(23.5, 17, Math.PI * 0.76, Math.PI * 2.24, 12)(o); o.fill();
      o.strokeStyle = rgba(mix(shade(C.spine, 0.55), '#fff0d0', 0.3), 0.75); o.lineWidth = 1.1; o.beginPath(); for (let i = 0; i < 26; i++) { const a = Math.PI * (0.8 + i * 1.4 / 25); o.moveTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 15.5); o.lineTo(cx + Math.cos(a) * 25, cy + Math.sin(a) * 24); } o.stroke();
      o.restore();
      const front = E(1.5, -20.5, 18, 18.5); bl(o, front, C.b, 1.5, -23, 18, { hi: 0.35 });
      bl(o, q => { q.beginPath(); q.moveTo(-14, -31); for (let i = 0; i <= 8; i++) q.lineTo(-14 + i * 3.6, i % 2 ? -38 - (4 - Math.abs(i - 4)) * 0.35 : -34.5); q.lineTo(15, -31); q.quadraticCurveTo(1, -35, -14, -31); q.closePath(); }, C.spine, 1, -36, 10, { rim: false, lw: 1.5 });
      for (const ex of [-14, 17]) { bl(o, E(ex, -35, 4, 3.6), shade(C.b, -0.12), ex, -35, 3.6, { rim: false, lw: 1.4 }); o.fillStyle = rgba('#f29aa8', 0.6); o.beginPath(); o.arc(ex, -34.8, 1.8, 0, TAU); o.fill(); }
      bl(o, E(3, -22.5, 7.6, 5.4), shade(C.b, 0.12), 3, -22.5, 7, { rim: false, lw: 1.1, ink: rgba(inkOf(C.b), 0.55) });
      bl(o, E(3, -26, 3.3, 2.4), C.nose, 3, -26, 3, { rim: false, lw: 0.9, gloss: true });
      blush(o, -9.5, -25.5, 2.8); blush(o, 15, -25.5, 2.8);
    } }],
    face: { l: [-4.5, -31.5], r: [10, -31.5], er: 3.7, mouth: [3, -21.8], mw: 2.2, style: 'w' },
    arms: { type: 'arm', sh: [[-14, -15], [17, -15]], len: 8.5, w: 5, hand: 3, col: C => shade(C.b, -0.08) },
    chin: [8, -19],
  };
  K.fox = {
    col: '#f0883a', shadow: 22, cx: 3, top: -54, carryW: 22, pivot: [2, -30], pal: { white: '#fff6ea', dark: '#4a2a34' },
    layers: [
      { id: 'tail', pivot: [-12, -8], rot: A => A.sway * 0.1 + (A.pose === 'cheer' ? Math.sin(A.t * 8 + A.ph) * 0.14 : 0), box: [-46, -52, 40, 54], paint(o, C) {
        const tail = q => { q.beginPath(); q.moveTo(-11, -4); q.bezierCurveTo(-30, -2, -42, -20, -36, -38); q.bezierCurveTo(-33, -47, -21, -49, -19.5, -41); q.bezierCurveTo(-18.5, -34, -26, -28, -22, -20); q.bezierCurveTo(-19, -14, -15, -13, -10, -13); q.closePath(); };
        bl(o, tail, C.b, -26, -26, 18);
        o.save(); tail(o); o.clip(); patch(o, E(-28, -44, 10, 8, -0.4), C.white, -28, -44, 9, 0);
        o.strokeStyle = rgba(shade(C.b, -0.3), 0.4); o.lineWidth = 1.1; o.beginPath(); o.moveTo(-31, -8); o.quadraticCurveTo(-37, -18, -34, -28); o.moveTo(-26, -9); o.quadraticCurveTo(-31, -16, -30, -24); o.stroke(); o.restore();
      } },
      { id: 'body', box: [-24, -40, 48, 44], paint(o, C) {
        for (const fx of [-7, 10]) bl(o, E(fx, -2, 6, 3.5), C.dark, fx, -2, 5.5, { rim: false, lw: 1.4 });
        const body = q => { q.beginPath(); q.moveTo(1, -34); q.bezierCurveTo(14, -34, 19, -20, 19, -12); q.bezierCurveTo(19, -3, 11, -1, 1, -1); q.bezierCurveTo(-9, -1, -17, -3, -17, -12); q.bezierCurveTo(-17, -20, -12, -34, 1, -34); q.closePath(); };
        bl(o, body, C.b, 1, -18, 18);
        o.save(); body(o); o.clip(); patch(o, q => { q.beginPath(); q.moveTo(-6, -32); q.lineTo(-3, -27); q.lineTo(0, -32); q.lineTo(3, -27); q.lineTo(6, -32); q.lineTo(9, -27); q.lineTo(12, -31); q.bezierCurveTo(14, -18, 10, -6, 3, -6); q.bezierCurveTo(-4, -6, -8, -18, -6, -32); q.closePath(); }, C.white, 3, -18, 10, 0); o.restore();
      } },
      { id: 'head', head: true, box: [-24, -72, 52, 50], paint(o, C) {
        for (const [a, tip, b] of [[[-11.5, -45], [-12.5, -66], [-0.5, -53]], [[6.5, -53], [18.5, -66], [17.5, -45]]]) {
          const e = poly([a, tip, b]); bl(o, e, C.b, tip[0], -55, 9, { rim: false, lw: 1.6 });
          o.save(); e(o); o.clip(); o.fillStyle = C.dark; o.fillRect(tip[0] - 10, -70, 20, 9); o.fillStyle = rgba('#ffd8c8', 0.9); o.beginPath(); o.moveTo(a[0] * 0.75 + b[0] * 0.25, -50); o.lineTo(tip[0] * 0.9 + (a[0] + b[0]) * 0.05, -60); o.lineTo(a[0] * 0.25 + b[0] * 0.75, -50); o.closePath(); o.fill(); o.restore();
        }
        const head = q => { q.beginPath(); q.moveTo(3, -55); q.bezierCurveTo(13, -55, 19.5, -50, 19, -42); q.lineTo(24.5, -32); q.bezierCurveTo(16, -27, 9, -26, 3, -26); q.bezierCurveTo(-3, -26, -10, -27, -18.5, -32); q.lineTo(-13, -42); q.bezierCurveTo(-13.5, -50, -7, -55, 3, -55); q.closePath(); };
        bl(o, head, C.b, 3, -44, 19); o.fillStyle = 'rgba(255,255,255,0.4)'; o.beginPath(); o.ellipse(-4, -50, 4.5, 2, -0.45, 0, TAU); o.fill();
        o.save(); head(o); o.clip(); patch(o, q => { q.beginPath(); q.moveTo(-19, -32); q.bezierCurveTo(-11, -39.5, -3, -39.5, 3, -35.5); q.bezierCurveTo(9, -39.5, 17, -39.5, 25, -32); q.lineTo(25, -20); q.lineTo(-19, -20); q.closePath(); }, C.white, 3, -31, 12, 0); o.restore();
        bl(o, E(3.5, -35.2, 3.3, 2.4), C.dark, 3.5, -35.2, 3, { rim: false, lw: 0.9, gloss: true });
        blush(o, -9.5, -36, 2.7); blush(o, 16.5, -36, 2.7);
      } }],
    face: { l: [-4, -43], r: [10.5, -43], er: 3.8, mouth: [3.5, -31.8], mw: 2.3, style: 'w' },
    arms: { type: 'arm', sh: [[-13, -24], [15, -24]], len: 11, w: 5.6, hand: 3.4, handCol: C => C.dark },
    chin: [8, -28],
  };

  // ---------- live drawing: faces, limbs, tentacles ----------
  function eyeOpen(c, x, y, r, big) {
    const rx = r * 0.84 * big, ry = r * big;
    c.fillStyle = EYE; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
    c.fillStyle = '#7a4270'; c.beginPath(); c.ellipse(x + rx * 0.05, y + ry * 0.5, rx * 0.58, ry * 0.3, 0, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x - rx * 0.28, y - ry * 0.36, rx * 0.42, ry * 0.36, -0.35, 0, TAU); c.fill();
    c.beginPath(); c.arc(x + rx * 0.38, y + ry * 0.34, r * 0.16 * big, 0, TAU); c.fill();
  }
  function face(c, A, F, C) {
    const { expr, t } = A, er = F.er, closed = A.blink || expr === 'laugh';
    const big = expr === 'wow' ? 1.16 : expr === 'sad' ? 0.94 : 1, lw = Math.max(1.1, er * 0.34);
    const lx = expr === 'think' ? er * 0.26 : 0, ly = expr === 'think' ? -er * 0.26 : 0;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1, x0 = (i ? F.r : F.l)[0], y0 = (i ? F.r : F.l)[1], x = x0 + lx, y = y0 + ly;
      if (F.ring && !closed) { const R = F.ring.r * (expr === 'wow' ? 1.06 : 1); c.fillStyle = INK; c.beginPath(); c.arc(x0, y0, R + 1, 0, TAU); c.fill(); c.fillStyle = F.ring.col; c.beginPath(); c.arc(x0, y0, R, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,250,220,0.55)'; c.beginPath(); c.arc(x0 - R * 0.3, y0 - R * 0.35, R * 0.45, 0, TAU); c.fill(); }
      if (closed) {
        c.strokeStyle = EYE; c.lineWidth = lw; c.beginPath();
        if (expr === 'laugh') c.arc(x, y + er * 0.45, er * 0.78, 1.17 * Math.PI, 1.83 * Math.PI); else c.arc(x, y - er * 0.4, er * 0.78, 0.2 * Math.PI, 0.8 * Math.PI);
        c.stroke();
      } else eyeOpen(c, x, y, er, big);
      if (expr === 'sad' || expr === 'wow' || expr === 'think') {
        const by = y0 - (F.ring ? F.ring.r + er * 0.45 : er * 1.5); c.strokeStyle = EYE; c.lineWidth = lw * 0.75; c.beginPath();
        if (expr === 'wow' || (expr === 'think' && i)) c.arc(x0, by + er * 0.55 - (expr === 'wow' ? er * 0.25 : er * 0.15), er * 0.75, 1.25 * Math.PI, 1.75 * Math.PI);
        else if (expr === 'sad') { c.moveTo(x0 - side * er * 0.65, by - er * 0.38); c.lineTo(x0 + side * er * 0.7, by + er * 0.08); }
        else { c.moveTo(x0 - er * 0.6, by + er * 0.1); c.lineTo(x0 + er * 0.6, by + er * 0.05); }
        c.stroke();
      }
    }
    if (expr === 'sad') { const q = (t * 0.7 + A.ph * 0.3) % 1, [x0, y0] = F.l, ty = y0 + er * (1.1 + q * 2.2), r = er * 0.32; c.globalAlpha = Math.min(1, (1 - q) * 3); c.fillStyle = '#8cd0ff'; c.beginPath(); c.moveTo(x0 - er * 0.3, ty - r * 2); c.quadraticCurveTo(x0 - er * 0.3 + r * 1.2, ty, x0 - er * 0.3, ty + r); c.quadraticCurveTo(x0 - er * 0.3 - r * 1.2, ty, x0 - er * 0.3, ty - r * 2); c.fill(); c.globalAlpha = 1; }
    mouth(c, A, F, C);
  }
  function mouth(c, A, F) {
    const [mx, my] = F.mouth, w = F.mw, e = A.expr, lw = Math.max(1, F.er * 0.3), open = e === 'laugh' ? 1 : e === 'wow' ? 0.75 : 0;
    c.strokeStyle = EYE; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
    if (F.style === 'beak') return beak(c, mx, my, w, open, F.beakCol);
    if (F.style === 'bill') return bill(c, mx, my, w / 6, open, F.beakCol);
    if (open) {
      const ow = e === 'wow' ? w * 0.5 : w * 0.95, oh = e === 'wow' ? w * 0.9 : w * 1.15;
      const shape = () => { c.beginPath(); if (e === 'wow') c.ellipse(mx, my + w * 0.3, ow, oh * 0.62, 0, 0, TAU); else { c.moveTo(mx - ow, my - w * 0.15); c.quadraticCurveTo(mx, my - w * 0.05, mx + ow, my - w * 0.15); c.quadraticCurveTo(mx + ow * 0.95, my + oh, mx, my + oh); c.quadraticCurveTo(mx - ow * 0.95, my + oh, mx - ow, my - w * 0.15); c.closePath(); } };
      shape(); c.fillStyle = MOUTH; c.fill(); c.save(); c.clip(); c.fillStyle = TONGUE; c.beginPath(); c.ellipse(mx, my + oh * (e === 'wow' ? 0.85 : 1), ow * 0.62, oh * 0.45, 0, 0, TAU); c.fill(); c.restore(); shape(); c.lineWidth = lw * 0.8; c.stroke();
    } else if (e === 'sad') { c.beginPath(); c.arc(mx, my + w * 0.8, w * 0.72, 1.22 * Math.PI, 1.78 * Math.PI); c.stroke(); }
    else if (e === 'think') { c.beginPath(); c.moveTo(mx - w * 0.55, my + w * 0.15); c.quadraticCurveTo(mx, my - w * 0.05, mx + w * 0.7, my - w * 0.2); c.stroke(); }
    else if (F.style === 'smile') { c.beginPath(); c.arc(mx, my - w * 0.55, w, 0.22 * Math.PI, 0.78 * Math.PI); c.stroke(); }
    else { c.beginPath(); c.arc(mx - w * 0.5, my - w * 0.05, w * 0.5, 0.08 * Math.PI, 0.92 * Math.PI); c.moveTo(mx + w, my - w * 0.05); c.arc(mx + w * 0.5, my - w * 0.05, w * 0.5, 0.08 * Math.PI, 0.92 * Math.PI); c.stroke(); }
    if (F.style === 'teeth') { const ty = my + (open && e === 'laugh' ? -w * 0.1 : w * 0.3); c.fillStyle = '#fffaf0'; c.strokeStyle = INK; c.lineWidth = 1; for (const dx of [-w * 0.95, 0.05]) { c.beginPath(); c.moveTo(mx + dx, ty); c.lineTo(mx + dx + w * 0.9, ty); c.lineTo(mx + dx + w * 0.9, ty + w * 1.6); c.quadraticCurveTo(mx + dx + w * 0.45, ty + w * 2, mx + dx, ty + w * 1.6); c.closePath(); c.fill(); c.stroke(); } }
  }
  function beak(c, mx, my, w, open, col) {
    const d = open * w * 0.95, ink = inkOf(col); c.lineWidth = 1.2; c.strokeStyle = ink;
    if (d > 0) { c.fillStyle = MOUTH; c.beginPath(); c.ellipse(mx, my + w * 0.2 + d * 0.4, w * 0.62, d * 0.55 + w * 0.3, 0, 0, TAU); c.fill(); c.fillStyle = TONGUE; c.beginPath(); c.ellipse(mx, my + w * 0.3 + d * 0.7, w * 0.38, d * 0.25 + w * 0.12, 0, 0, TAU); c.fill(); }
    c.fillStyle = shade(col, -0.14); c.beginPath(); c.moveTo(mx - w * 0.62, my + w * 0.15 + d * 0.55); c.quadraticCurveTo(mx, my + w * 0.4 + d * 0.55, mx + w * 0.62, my + w * 0.15 + d * 0.55); c.lineTo(mx + w * 0.05, my + w * 0.85 + d); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = col; c.beginPath(); c.moveTo(mx - w, my - w * 0.35); c.quadraticCurveTo(mx, my - w * 0.95, mx + w, my - w * 0.35); c.quadraticCurveTo(mx + w * 0.55, my + w * 0.3, mx + w * 0.1, my + w * 0.78); c.quadraticCurveTo(mx - w * 0.5, my + w * 0.3, mx - w, my - w * 0.35); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); c.ellipse(mx - w * 0.3, my - w * 0.42, w * 0.32, w * 0.14, -0.25, 0, TAU); c.fill();
  }
  function bill(c, mx, my, k, open, col) { // a duck's flat bill pointing forward (+x); k scales it
    const d = open * 4.2 * k, ink = inkOf(col); c.save(); c.translate(mx, my); c.scale(k, k); c.lineWidth = 1.3; c.strokeStyle = ink;
    if (d > 0) { c.fillStyle = MOUTH; c.beginPath(); c.moveTo(-3.5, -0.5); c.lineTo(9.5, -1); c.lineTo(9.5, d / k + 1.5); c.lineTo(-3.5, 2.5); c.closePath(); c.fill(); }
    const dd = d / k;
    c.fillStyle = shade(col, -0.14); c.beginPath(); c.moveTo(-4, 0.5); c.bezierCurveTo(3, 1 + dd, 10, 0.5 + dd, 10.5, 2 + dd); c.bezierCurveTo(9, 5 + dd, 1, 5 + dd * 0.6, -4, 3); c.closePath(); c.fill(); c.stroke();
    if (dd > 0) { c.fillStyle = TONGUE; c.beginPath(); c.ellipse(3, 1.8 + dd * 0.7, 3.6, 1.3, 0.1, 0, TAU); c.fill(); }
    c.fillStyle = col; c.beginPath(); c.moveTo(-5, -4); c.bezierCurveTo(3, -6.5, 12, -5, 12.5, -1.2); c.bezierCurveTo(12.5, 1.4, 5, 1.6, -5, 1); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = rgba(ink, 0.6); c.beginPath(); c.ellipse(6, -3.2, 1, 0.55, 0.2, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(1.5, -3.6, 3.4, 0.9, -0.08, 0, TAU); c.fill();
    c.restore();
  }
  // a short rounded limb with a soft elbow bend, a lit edge and a round paw
  function limb(c, x0, y0, x1, y1, side, w, col, ink, handR, handCol) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1; let nx = dy / L, ny = -dx / L; if (nx * side < 0 || (Math.abs(nx) < 0.2 && ny < 0)) { nx = -nx; ny = -ny; }
    const mx = (x0 + x1) / 2 + nx * L * 0.14, my = (y0 + y1) / 2 + ny * L * 0.14;
    const path = () => { c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, x1, y1); };
    c.lineCap = 'round'; path(); c.strokeStyle = ink; c.lineWidth = w + 3.2; c.stroke(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
    c.save(); c.translate(-w * 0.16, -w * 0.18); path(); c.strokeStyle = rgba(mix(shade(col, 0.55), '#fff4d6', 0.4), 0.55); c.lineWidth = w * 0.28; c.stroke(); c.restore();
    if (handR) { c.fillStyle = ink; c.beginPath(); c.arc(x1, y1, handR + 1.6, 0, TAU); c.fill(); c.fillStyle = handCol || col; c.beginPath(); c.arc(x1, y1, handR, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.arc(x1 - handR * 0.35, y1 - handR * 0.35, handR * 0.38, 0, TAU); c.fill(); }
  }
  // a wing or flipper: a rounded teardrop from the shoulder to its tip, with two feather lines
  function wing(c, x0, y0, x1, y1, w, col, ink) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const path = () => { c.beginPath(); c.moveTo(x0 + nx * w * 0.45, y0 + ny * w * 0.45); c.quadraticCurveTo(x0 + ux * L * 0.5 + nx * w * 1.15, y0 + uy * L * 0.5 + ny * w * 1.15, x1, y1); c.quadraticCurveTo(x0 + ux * L * 0.5 - nx * w * 1.0, y0 + uy * L * 0.5 - ny * w * 1.0, x0 - nx * w * 0.45, y0 - ny * w * 0.45); c.closePath(); };
    c.lineJoin = 'round'; path(); c.strokeStyle = ink; c.lineWidth = 3.4; c.stroke(); c.fillStyle = col; c.fill();
    c.strokeStyle = rgba(shade(col, -0.35), 0.7); c.lineWidth = 1.1; c.beginPath();
    for (const k of [0.45, 0.7]) { const px = x0 + ux * L * k, py = y0 + uy * L * k; c.moveTo(px + nx * w * 0.45, py + ny * w * 0.45); c.quadraticCurveTo(px + ux * 2, py + uy * 2, px - nx * w * 0.35, py - ny * w * 0.35); }
    c.stroke();
    c.strokeStyle = rgba(mix(shade(col, 0.55), '#fff4d6', 0.4), 0.5); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x0 + nx * w * 0.2 + ux * 2, y0 + ny * w * 0.2 + uy * 2); c.quadraticCurveTo(x0 + ux * L * 0.45 + nx * w * 0.75, y0 + uy * L * 0.45 + ny * w * 0.75, x0 + ux * L * 0.8 + nx * w * 0.2, y0 + uy * L * 0.8 + ny * w * 0.2); c.stroke();
  }
  // an octopus arm: a bowed, tapering curve from (x0, y0) to (x1, y1), bent sideways by `bow`, ending in a curl
  // (curl > 0 turns clockwise on screen); suckers line the inside of the curl. Returns the tip of the straight part.
  const TP = []; for (let i = 0; i < 18; i++) TP.push([0, 0]);
  function tentacle(c, x0, y0, x1, y1, bow, w, curl, col, ink) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, cx = (x0 + x1) / 2 - dy / L * bow, cy = (y0 + y1) / 2 + dx / L * bow;
    const N = 11, M = 6; let n = 0;
    for (let i = 0; i <= N; i++) { const u = i / N, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, d = u * u; TP[n][0] = a * x0 + b * cx + d * x1; TP[n][1] = a * y0 + b * cy + d * y1; n++; }
    let ang = Math.atan2(y1 - cy, x1 - cx), step = L * 0.075, px = x1, py = y1;
    for (let k = 0; k < M; k++) { ang += curl * 0.62; step *= 0.8; px += Math.cos(ang) * step; py += Math.sin(ang) * step; TP[n][0] = px; TP[n][1] = py; n++; }
    const wid = i => w * (1 - (i / (n - 1)) * 0.82) * 0.5;
    // the body, filled twice (a wider plum copy first) instead of stroked: much cheaper to rasterize than a round-joined stroke
    const body = grow => { c.beginPath();
      for (let i = 0; i < n; i++) { const p = TP[Math.max(0, i - 1)], q = TP[Math.min(n - 1, i + 1)], tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1, r = wid(i) + grow; const X = TP[i][0] - ty / tl * r, Y = TP[i][1] + tx / tl * r; i ? c.lineTo(X, Y) : c.moveTo(X, Y); }
      if (grow) { const p = TP[n - 2], q = TP[n - 1], tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1; c.lineTo(q[0] + tx / tl * grow, q[1] + ty / tl * grow); }
      for (let i = n - 1; i >= 0; i--) { const p = TP[Math.max(0, i - 1)], q = TP[Math.min(n - 1, i + 1)], tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1, r = wid(i) + grow; c.lineTo(TP[i][0] + ty / tl * r, TP[i][1] - tx / tl * r); }
      c.closePath(); };
    body(1.7); c.fillStyle = ink; c.fill(); body(0); c.fillStyle = col; c.fill();
    // suckers on the inside of the curl
    const sg = curl > 0 ? 1 : -1; c.fillStyle = '#ffe2ea'; c.strokeStyle = rgba(ink, 0.45); c.lineWidth = 0.8;
    c.beginPath(); for (let i = 3; i < n - 2; i += 2) { const p = TP[i - 1], q = TP[i + 1], tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1, r = wid(i), sx = TP[i][0] - ty / tl * r * 0.55 * sg, sy = TP[i][1] + tx / tl * r * 0.55 * sg, sr = Math.max(0.6, r * 0.42); c.moveTo(sx + sr, sy); c.arc(sx, sy, sr, 0, TAU); } c.fill(); c.stroke();
    c.strokeStyle = rgba(mix(shade(col, 0.55), '#fff4d6', 0.4), 0.5); c.lineWidth = Math.max(0.8, w * 0.18); c.beginPath(); for (let i = 1; i < N; i++) { const p = TP[i - 1], q = TP[i + 1], tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1, r = wid(i) * 0.45; const X = TP[i][0] + ty / tl * r * sg, Y = TP[i][1] - tx / tl * r * sg; i > 1 ? c.lineTo(X, Y) : c.moveTo(X, Y); } c.stroke();
  }

  // ---------- poses ----------
  function handTargets(k, A) {
    const { pose, t, ph, expr } = A, a = k.arms, sw = Math.sin(t * 2 + ph) * 0.08;
    let ang = [0.42 + sw, 0.42 - sw], tgt = [null, null];
    if (pose === 'cheer') { const w = Math.sin(t * 10 + ph) * 0.2; ang = [2.5 + w, 2.5 - w]; }
    else if (pose === 'wave') ang = [0.42 + sw, 2.35 + Math.sin(t * 9 + ph) * 0.42];
    else if (pose === 'hop') { const fl = Math.sin(t * 7 + ph) * 0.18; ang = [1.75 + fl, 1.75 + fl]; }
    else if (pose === 'point') ang = [0.4 + sw, Math.PI / 2 + 0.1];
    else if (pose === 'walk') { const st = Math.sin(t * 8 + ph) * 0.5; ang = [0.35 + st, 0.35 - st]; }
    else if (pose === 'balance') { const b = Math.sin(t * 4 + ph) * 0.18; ang = [1.45 + b, 1.45 - b]; }
    else if (pose === 'sad') ang = [0.12, 0.12];
    else if (pose === 'carry' && (a.type === 'wing' || a.type === 'stick')) { const w = Math.sin(t * 4 + ph) * 0.06; ang = [2.25 + w, 2.25 - w]; }
    else if (pose === 'carry' && !k.carry) { const w = Math.sin(t * 4 + ph) * 0.8; tgt = [[k.cx - k.carryW, k.top + 1 + w], [k.cx + k.carryW, k.top + 1 - w]]; }
    if (expr === 'think' && pose === 'idle' && k.chin) tgt[1] = k.chin;
    return a.sh.map(([sx, sy], i) => { if (tgt[i]) return tgt[i]; const side = i ? 1 : -1, L = a.len * (pose === 'point' && i ? 1.2 : 1); return [sx + side * L * Math.sin(ang[i]), sy + L * Math.cos(ang[i])]; });
  }
  function drawArms(c, k, A, C, H) {
    const a = k.arms, col = a.col ? a.col(C) : C.b, ink = inkOf(C.b);
    for (let i = 0; i < 2; i++) {
      const [sx, sy] = a.sh[i], [hx, hy] = H[i], side = i ? 1 : -1;
      if (a.type === 'none') continue;
      if (a.type === 'wing') wing(c, sx, sy, hx, hy, a.w, col, ink);
      else if (a.type === 'tentacle') { const up = hy < sy - 4; tentacle(c, sx, sy, hx, hy, side * (up ? -3 : 4), a.w, (up ? 1 : -1) * side * 0.75, shade(C.b, -0.04), ink); }
      else limb(c, sx, sy, hx, hy, side, a.w, col, ink, a.hand, a.handCol ? a.handCol(C) : col);
    }
  }

  // ---------- palettes ----------
  const PAL = new Map();
  function palette(kind, k, tint) {
    const key = kind + (tint || ''); let C = PAL.get(key);
    if (!C) { const b = tint || k.col; C = Object.assign({ b }, k.pal || {}); PAL.set(key, C); }
    return C;
  }

  // ---------- the public draw ----------
  const POSES = new Set(['idle', 'cheer', 'wave', 'hop', 'point', 'carry', 'walk', 'balance', 'sad']), EXPRS = new Set(['happy', 'laugh', 'wow', 'sad', 'think']);
  function draw(c, kind, x, y, s = 1, o = {}) {
    const k = K[kind] || K.frog; kind = K[kind] ? kind : 'frog';
    const C = palette(kind, k, o.tint), t = +o.t || 0, ph = +o.phase || 0, f = o.facing === -1 ? -1 : 1;
    const pose = POSES.has(o.pose) ? o.pose : 'idle', expr = EXPRS.has(o.expr) ? o.expr : 'happy';
    const A = { t, ph, pose, expr, f, sway: Math.sin(t * 2.1 + ph), blink: t > 0 && ((t + ph * 1.37) % 3.9 + 3.9) % 3.9 < 0.13 };
    let lift = 0, sx = 1, sy = 1, rot = 0;
    const br = Math.sin(t * 2.4 + ph);
    if (pose === 'cheer') { const h = Math.abs(Math.sin(t * 5 + ph)); lift = h * 7; sy = 1 + (h - 0.35) * 0.08; sx = 2 - sy; }
    else if (pose === 'hop') { lift = 12 + Math.sin(t * 4 + ph) * 1.5; sy = 1.1; sx = 0.92; }
    else if (pose === 'carry') { sy = 0.97 + Math.sin(t * 4 + ph) * 0.012; sx = 1.025; }
    else if (pose === 'walk') { const st = Math.sin(t * 8 + ph); lift = Math.abs(st) * 2.4; rot = 0.05 + st * 0.03; }
    else if (pose === 'balance') { rot = Math.sin(t * 4 + ph) * 0.06; }
    else if (pose === 'sad') { sy = 0.96 + br * 0.01; sx = 1.02; }
    else { sy = 1 + br * 0.018; sx = 1 - br * 0.012; }
    if (pose === 'point') rot = 0.045; else if (pose === 'wave') rot = Math.sin(t * 3 + ph) * 0.025;
    let hr = expr === 'think' ? 0.11 : expr === 'wow' ? -0.07 : expr === 'sad' ? 0.08 : expr === 'laugh' ? Math.sin(t * 15 + ph) * 0.05 : Math.sin(t * 1.4 + ph) * 0.03;
    if (pose === 'cheer') hr += Math.sin(t * 5 + ph) * 0.05;
    const hasHead = !!k.pivot; if (!hasHead) rot += hr * 0.35;
    const M0 = c.getTransform ? c.getTransform() : null;
    c.save(); c.translate(x, y); c.scale(s * f, s);
    const shr = 1 - Math.min(0.45, lift / 32);
    if (!o.noShadow && o.shadow !== false) { c.fillStyle = 'rgba(40,20,48,0.2)'; c.beginPath(); c.ellipse(k.cx * 0.5, 0, k.shadow * shr, k.shadow * 0.22 * shr, 0, 0, TAU); c.fill(); }
    c.translate(0, -lift); c.scale(sx, sy); c.rotate(rot);
    if (k.back) k.back(c, A, C);
    const L = k.layers, H = handTargets(k, A); let inHead = false;
    for (let i = 0; i < L.length; i++) {
      const ly = L[i];
      if (ly.head && !inHead) { if (k.arms.behindHead) drawArms(c, k, A, C, H); inHead = true; c.save(); const [px, py] = k.pivot; c.translate(px, py + Math.sin(t * 2.4 + ph - 0.9) * 0.5); c.rotate(hr); c.translate(-px, -py); if (k.headBack) k.headBack(c, A, C); }
      if (ly.rot) { c.save(); c.translate(ly.pivot[0], ly.pivot[1]); c.rotate(ly.rot(A)); c.translate(-ly.pivot[0], -ly.pivot[1]); }
      sprite(c, kind + '.' + ly.id + (o.tint || ''), ly.box, q => ly.paint(q, C));
      if (ly.rot) c.restore();
      if (inHead && (i === L.length - 1 || !L[i + 1].head)) { face(c, A, k.face, C); if (k.front) k.front(c, A, C); c.restore(); inHead = false; }
    }
    if (!hasHead) { face(c, A, k.face, C); if (k.front) k.front(c, A, C); }
    if (!k.arms.behindHead) drawArms(c, k, A, C, H);
    const hp = pose === 'carry' ? (k.carry ? k.carry.hold : [k.cx, k.top - 11]) : H[1];
    let out = null;
    if (M0 && c.getTransform) {
      const inv = M0.inverse(), m = c.getTransform(), map = ([px, py]) => { const d = m.transformPoint(new DOMPoint(px, py)), q = inv.transformPoint(d); return { x: q.x, y: q.y }; };
      out = { hands: [map(H[0]), map(H[1])], hold: map(hp) };
    }
    if (typeof o.hold === 'function') { c.save(); c.translate(hp[0], hp[1]); c.rotate(-rot); c.scale(f / sx, 1 / sy); try { o.hold(c); } catch (e) { console.error('ANI hold', e); } c.restore(); }
    c.restore();
    return out;
  }

  // ---------- the acorn (one life) ----------
  function acornPaint(o, gone) {
    const nut = q => { q.beginPath(); q.moveTo(-7.6, -2); q.bezierCurveTo(-8.4, 5, -4, 10, 0, 12); q.bezierCurveTo(4, 10, 8.4, 5, 7.6, -2); q.closePath(); };
    const cap = q => { q.beginPath(); q.moveTo(-9.6, -1); q.bezierCurveTo(-10.5, -6.5, -6, -10, 0, -10); q.bezierCurveTo(6, -10, 10.5, -6.5, 9.6, -1); q.quadraticCurveTo(0, 1.6, -9.6, -1); q.closePath(); };
    const stem = q => { q.beginPath(); q.moveTo(-0.9, -9.6); q.quadraticCurveTo(-0.6, -13, 2.2, -13.6); q.lineTo(2.6, -12.2); q.quadraticCurveTo(1, -11.6, 1.1, -9.6); q.closePath(); };
    if (gone) {
      o.setLineDash([2.2, 1.8]); o.lineWidth = 1.3; o.strokeStyle = 'rgba(255,246,228,0.75)'; o.fillStyle = 'rgba(60,30,60,0.22)';
      for (const p of [nut, cap, stem]) { p(o); o.fill(); o.stroke(); } o.setLineDash([]); return;
    }
    bl(o, nut, '#d9944a', 0, 3, 9, { gloss: false, hi: 0.4, lw: 1.5 });
    o.fillStyle = 'rgba(255,255,255,0.5)'; o.beginPath(); o.ellipse(-3.6, 2.5, 1.5, 4, 0.2, 0, TAU); o.fill();
    o.fillStyle = shade('#d9944a', -0.35); o.beginPath(); o.arc(0, 11, 1, 0, TAU); o.fill();
    bl(o, stem, '#7a5034', 1, -11, 3, { rim: false, lw: 1.1 });
    bl(o, cap, '#9a6a44', 0, -5, 10, { lw: 1.5 });
    o.save(); cap(o); o.clip(); o.strokeStyle = rgba('#5a3a26', 0.6); o.lineWidth = 0.9;
    for (let r = 0; r < 3; r++) for (let i = -4; i <= 4; i++) { const x = i * 2.6 + (r % 2) * 1.3, y = -8 + r * 2.9; o.beginPath(); o.arc(x, y, 1.5, 0.15 * Math.PI, 0.85 * Math.PI); o.stroke(); }
    o.restore();
    o.strokeStyle = rgba('#fff2d6', 0.6); o.lineWidth = 1; o.beginPath(); o.moveTo(-7.8, -3.5); o.quadraticCurveTo(-6.8, -8.2, -2, -9.2); o.stroke();
  }
  function acorn(c, x, y, s = 1, gone = false) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (!gone) { c.fillStyle = 'rgba(40,20,48,0.16)'; c.beginPath(); c.ellipse(1, 12.5, 7, 1.6, 0, 0, TAU); c.fill(); }
    sprite(c, gone ? 'acorn.gone' : 'acorn', [-12, -15, 24, 29], o => acornPaint(o, gone));
    c.restore();
  }
  // the triangle shell alone, centred on its centroid with the apex up (R = centroid-to-corner distance)
  function shell(c, x, y, R = 30, o = {}) {
    const col = o.tint || K.turtle.pal.shell; c.save(); c.translate(x, y); c.scale(R / 30, R / 30);
    sprite(c, 'shell' + col, [-32, -34, 64, 54], q => shellPaint(q, col, 0, 0, 30)); c.restore();
  }

  return { draw, acorn, shell, kinds: Object.keys(K) };
})();
