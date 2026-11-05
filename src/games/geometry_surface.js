// geometry_surface.js — SURFACE AREA! The surface area of a box is the total area of its six faces, which come in three
// matching pairs: 2 × (l × w) + 2 × (l × h) + 2 × (w × h).
// A carpenter's workshop at evening, with a beaver. A cardboard box sits on the walnut workbench with its three side
// lengths on tags, and a chalk tag below reads SA = 0. Every move acts its working out:
//   1. Tap the box: it turns to face us and unfolds flap by flap (top, bottom, sides, then the back) into a flat net,
//      while the three length tags glide to the net's edges.
//   2-4. Tap any face (each pair in any order): the face and its two edges light up with their lengths, "4 × 3 = 12"
//      writes itself on the face, 12 settles into it, an arrow carries 12 to the matching face on the other side, and
//      both 12s fly down into the chalk tag as terms of the sum (SA = 24 + 8 + 8), which then collapses: the terms slide
//      into the first and it rolls over to the new total. After the last pair the total is circled.
// Wrong moves: tapping a length tag, or a face whose pair is already done, wobbles. Level 0: small boxes such as
// 4 × 2 × 3. Level 1: sides up to 5. Level 2: up to 6 × 3 × 5. Medium mode: the tray asks for each face's area.
const M = MK, CY0 = 300, TOTY = 508, CARD = '#d9a866', CARD2 = '#b88648', EDGE = '#4a2a10', INSIDE = '#8a5a2a';
const PAIRS = [{ col: '#ffb070', ids: ['F', 'K'] }, { col: '#8fd0f0', ids: ['T', 'Bo'] }, { col: '#a8e080', ids: ['L', 'R'] }];
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return [[4, 2, 3], [5, 2, 3], [4, 3, 2], [3, 2, 4]][r(4)];
  if (L === 1) { let l = 3 + r(3), w = 2 + r(2), h = 2 + r(3); if (l === w && w === h) h++; return [l, w, h]; }
  return [5 + r(2), 2 + r(2), 3 + r(3)];
}
const ez = (k, a, b) => M.easeIO(M.clamp((k - a) / (b - a), 0, 1));
// the six faces in 3D for an unfold progress k (0 = closed box, 1 = flat net); x right, y up, z away from us.
// Corners go bottom-left, bottom-right, top-right, top-left as seen from outside in the flat net.
function faces3(l, w, h, k) {
  const fT = (1 - ez(k, 0.15, 0.5)) * Math.PI / 2, fB = (1 - ez(k, 0.25, 0.6)) * Math.PI / 2, fS = (1 - ez(k, 0.35, 0.72)) * Math.PI / 2, fK = (1 - ez(k, 0.62, 1)) * Math.PI / 2;
  const cs = Math.cos, sn = Math.sin, E = [l + w * cs(fS), w * sn(fS)], d = [cs(fS + fK), sn(fS + fK)];
  return [
    { id: 'F', p: 0, v: [[0, 0, 0], [l, 0, 0], [l, h, 0], [0, h, 0]] },
    { id: 'T', p: 1, v: [[0, h, 0], [l, h, 0], [l, h + w * cs(fT), w * sn(fT)], [0, h + w * cs(fT), w * sn(fT)]] },
    { id: 'Bo', p: 1, v: [[0, -w * cs(fB), w * sn(fB)], [l, -w * cs(fB), w * sn(fB)], [l, 0, 0], [0, 0, 0]] },
    { id: 'L', p: 2, v: [[-w * cs(fS), 0, w * sn(fS)], [0, 0, 0], [0, h, 0], [-w * cs(fS), h, w * sn(fS)]] },
    { id: 'R', p: 2, v: [[l, 0, 0], [E[0], 0, E[1]], [E[0], h, E[1]], [l, h, 0]] },
    { id: 'K', p: 0, v: [[E[0], 0, E[1]], [E[0] + l * d[0], 0, E[1] + l * d[1]], [E[0] + l * d[0], h, E[1] + l * d[1]], [E[0], h, E[1]]] },
  ];
}
function paintBg(c, W, H) {
  const wl = c.createLinearGradient(0, 0, 0, 200); wl.addColorStop(0, '#24443e'); wl.addColorStop(1, '#2e5248'); c.fillStyle = wl; c.fillRect(0, 0, W, 200);
  c.fillStyle = 'rgba(0,0,0,0.3)'; for (let y = 14; y < 190; y += 18) for (let x = 10 + ((y / 18) % 2) * 9; x < W; x += 18) { c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); }
  // tool silhouettes hanging on the pegboard
  c.fillStyle = 'rgba(10,24,22,0.55)'; c.fillRect(30, 30, 10, 60); c.fillRect(20, 26, 30, 12); c.beginPath(); c.arc(300, 60, 26, 0, 7); c.fill(); c.fillStyle = '#2e5248'; c.beginPath(); c.arc(300, 60, 15, 0, 7); c.fill();
  c.fillStyle = 'rgba(10,24,22,0.55)'; c.save(); c.translate(250, 120); c.rotate(0.5); c.fillRect(-4, -40, 8, 70); c.fillRect(-14, -48, 28, 14); c.restore(); c.fillRect(70, 110, 54, 8); for (let i = 0; i < 6; i++) c.fillRect(72 + i * 9, 118, 3, 16);
  // the workbench top: walnut planks
  const bt = c.createLinearGradient(0, 190, 0, 600); bt.addColorStop(0, '#6a4228'); bt.addColorStop(1, '#4e2e1a'); c.fillStyle = bt; c.fillRect(0, 190, W, 410);
  for (let y = 190; y < 600; y += 46) { c.fillStyle = 'rgba(20,8,0,0.35)'; c.fillRect(0, y, W, 2); c.strokeStyle = 'rgba(255,210,160,0.06)'; c.lineWidth = 1.5; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(0, y + 8 + k * 9); c.bezierCurveTo(100, y + 4 + k * 9, 220, y + 14 + k * 9, W, y + 6 + k * 9); c.stroke(); } }
  c.fillStyle = '#3a2010'; c.fillRect(0, 600, W, 40); c.fillStyle = 'rgba(255,220,170,0.12)'; c.fillRect(0, 600, W, 3);
  // shavings and a pencil on the bench
  c.strokeStyle = '#e8c088'; c.lineWidth = 2.5; for (const [x, y] of [[40, 556], [24, 570], [300, 236], [320, 222]]) { c.beginPath(); c.arc(x, y, 7, 0.3, 5); c.stroke(); }
  c.save(); c.translate(84, 586); c.rotate(-0.12); c.fillStyle = '#e8483a'; c.fillRect(-30, -4, 60, 8); c.fillStyle = '#f4d8a8'; c.beginPath(); c.moveTo(30, -4); c.lineTo(42, 0); c.lineTo(30, 4); c.fill(); c.restore();
}

MG.add({
  id: 'geometry_surface', stage: 'geometry', cmd: 'SURFACE AREA!', hint: 'tap', time: 10, mood: 'bright', winText: 'Wrapped!', hold: 1.7,
  card: {
    title: 'Surface area of a box', ref: 'Grade 6', kind: 'Geometry',
    text: 'The surface area of a box is how much cardboard it takes to make it: the total area of all its faces.\n\nUnfold the box and lay it flat. This flat shape is called a net. A box has 6 faces, and they come in 3 matching pairs: top and bottom, front and back, left and right.\n\nFind the area of one face from each pair, then count each one twice. A box 4 long, 2 wide and 3 high has faces of 4 × 3 = 12, 4 × 2 = 8 and 2 × 3 = 6, so its surface area is 24 + 16 + 12 = 52 square units.\n\nDon\'t multiply all three lengths: 4 × 2 × 3 = 24 is the volume, the space inside.',
    note: 'Surface area = 2 × (l × w) + 2 × (l × h) + 2 × (w × h): add up the areas of all six faces.',
    ask: 'A cube has edges of 3. What is its surface area? How much cardboard makes a box 5 by 2 by 2?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g), [l, w, h] = pick(g); Object.assign(S, { l, w, h, sum: 0, uk: 0, done: {}, area: {}, lit: {} });
    S.U1 = Math.min(26, 290 / (2 * l + 2 * w + 1.2), 228 / (h + 2 * w + 0.9)); S.U0 = Math.min(36, 170 / (l + w)) * 1.0;
    S.dims = [l * h, l * w, w * h];
    // the view for unfold progress k: yaw and pitch go to 0, the scale and the centre move to the net's
    S.view = k => { const kv = ez(k, 0, 0.55); return { yaw: 32 * (1 - kv), pitch: 24 * (1 - kv), U: M.lerp(S.U0, S.U1, ez(k, 0, 0.6)), piv: [M.lerp(l / 2, l - 0.6, kv), M.lerp(h / 2, (h + 0.9) / 2, kv), M.lerp(w / 2, 0, kv)], cy: M.lerp(CY0 + 10, CY0, kv) }; };
    S.proj = (p, V) => { const yaw = V.yaw * Math.PI / 180, pit = V.pitch * Math.PI / 180, x = p[0] - V.piv[0], y = p[1] - V.piv[1], z = p[2] - V.piv[2];
      const x1 = x * Math.cos(yaw) + z * Math.sin(yaw), z1 = -x * Math.sin(yaw) + z * Math.cos(yaw), y2 = y * Math.cos(pit) + z1 * Math.sin(pit), z2 = -y * Math.sin(pit) + z1 * Math.cos(pit);
      return [180 + x1 * V.U, V.cy - y2 * V.U, z2]; };
    // the length tags ride on the closed box's edges, then slide out to the net's edges as it unfolds
    S.tagPos = k => { const V = S.view(k), P = q => S.proj(q, V), m = ez(k, 0.35, 0.85), L = (u, v) => [M.lerp(u[0], v[0], m), M.lerp(u[1], v[1], m)];
      const a = P([l / 2, 0, 0]), b = P([0, h / 2, 0]), c2 = P([l, 0, w / 2]), a1 = P([l / 2, h + w, 0]), b1 = P([-w, h / 2, 0]), c1 = P([0, h + w / 2, 0]);
      return { dl: L([a[0], a[1] + 22], [a1[0], a1[1] - 20]), dh: L([b[0] - 26, b[1]], [b1[0] - 22, b1[1]]), dw: L([c2[0] + 24, c2[1] + 16], [c1[0] - 22, c1[1]]) }; };
    S.tagV = { dl: l, dw: w, dh: h }; S.setTags = () => { const tp = S.tagPos(S.uk); for (const id in tp) M.zone(g, id, { x: tp[id][0], y: tp[id][1], w: 34, h: 32 }); };
    S.setTags();
    M.zone(g, 'box', { x: 180, y: CY0 - 4, w: (l + w) * S.U0 + 10, h: (h + w * 0.6) * S.U0 + 20 });
    S.sumN = M.num(0, 'sum'); S.tot = M.row(M.txt('SA', 'sa'), M.op('=', 'seq'), S.sumN);
    // the total line shrinks a little when it holds a long sum, so it stays on its chalk tag
    S.placeTot = () => { S.totS = Math.min(38, 300 / (M.lay(S.tot, 38).w / 38)); M.place(g, 'tot', S.tot, 180, TOTY + 13, S.totS, { col: '#fbf8ee' }); S.totW = M.lay(S.tot, S.totS).w; }; S.placeTot();
    M.inert(g, ['sa', 'seq', 'sum']);
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // the flat rectangles of the faces (object units) and their centres on screen once the net is flat
    const rect = { F: [0, 0, l, h], K: [l + w, 0, 2 * l + w, h], T: [0, h, l, h + w], Bo: [0, -w, l, 0], L: [-w, 0, 0, h], R: [l, 0, l + w, h] };
    S.scr = id => { const V = S.view(1), [x0, y0, x1, y1] = rect[id], a = S.proj([x0, y0, 0], V), b = S.proj([x1, y1, 0], V); return { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, w: Math.abs(b[0] - a[0]), h: Math.abs(b[1] - a[1]), x0: Math.min(a[0], b[0]), y1: Math.max(a[1], b[1]) }; };
    const unfoldLen = 1.7 * T;
    const unfold = { tap: 'box', busy: 0.1,
      then(g) { S.unfold = true; M.show(g, unfoldLen); S.u0 = g.t; g.sfx('swoosh'); hop(g, 'wow'); delete S.mk.box.box; delete S.mk.zones.box;
        M.at(g, [[0.3 * T, g => g.sfx('whoosh')], [0.65 * T, g => g.sfx('whoosh')], [0.95 * T, g => g.sfx('pop')], [1.25 * T, g => g.sfx('whoosh')],
          [unfoldLen - 0.05, g => { for (const f of ['F', 'K', 'T', 'Bo', 'L', 'R']) { const r = S.scr(f); M.zone(g, f, { x: r.x, y: r.y, w: r.w - 4, h: r.h - 4 }); } g.sfx('tap'); hop(g, 'happy'); }]]); } };
    // one pair of faces: light the face and its edges, compute its area, copy it to the twin, add both to the total
    const pairMove = p => { const [a, b] = PAIRS[p].ids, [ha, va] = p === 0 ? [l, h] : p === 1 ? [l, w] : [w, h], A = ha * va, rest = 3.2 * T;
      return { tap: [a, b], busy: 0.1, askAt: 0.75 * T, after: rest, ask: { v: A, wrong: [ha + va, 2 * A, 2 * (ha + va), A + ha].filter(v => v !== A) },
        then(g, id) { S.done[p] = true; const me = id, tw = me === a ? b : a; S.cur = { p, me, tw }; M.show(g, 0.75 * T); hop(g, 'think'); g.sfx('pop');
          S.lit[me] = g.t; S.edgeAt = { id: me, t0: g.t, ha, va };
          const r = S.scr(me); S.noteN = M.row(M.num(ha), M.op('×'), M.num(va), M.op('=')); S.noteR = r; S.noteKey = 'nt' + p; S.noteX = () => M.clamp(r.x, M.lay(S.noteN, 24).w / 2 + 22, 338 - M.lay(S.noteN, 24).w / 2); M.place(g, S.noteKey, S.noteN, S.noteX(), r.y + 8, 24, { col: '#ffffff' }); M.writeIn(g, S.noteN, { dur: 0.35 * T, delay: 0.25 * T }); S.noteAt = g.t; S.noteOut = null; },
        resolve(g) { M.show(g, rest); const { me, tw } = S.cur, r = S.scr(me); const an = M.num(A, null, { col: '#ffe9a0', _born: -1 }); S.noteN.items.push(an); M.place(g, S.noteKey, S.noteN, S.noteX(), r.y + 8, 24, { col: '#ffffff' }); M.writeIn(g, an, { dur: 0.2 * T }); g.sfx('ding');
          // the face's area stays readable on its note, then settles into the face; a copy goes to its twin
          M.at(g, [[0.85 * T, g => { S.noteOut = g.t; S.area[me] = { v: A, t0: g.t }; M.sparkle(g, [r.x, r.y], { n: 8 }); hop(g); }],
            [1.05 * T, g => { M.arrow(g, [r.x, r.y], [S.scr(tw).x, S.scr(tw).y], { dur: 0.35 * T, bend: -50, col: '#fff2a0', linger: 0.25 * T }); }],
            [1.35 * T, g => { S.lit[tw] = g.t; S.area[tw] = { v: A, t0: g.t }; M.sparkle(g, [S.scr(tw).x, S.scr(tw).y], { n: 8 }); g.sfx('pop'); delete g.s.mk.ex[S.noteKey]; }],
            // both areas fly down and join the total as terms of one sum: SA = 24 + 8 + 8
            [1.55 * T, g => { const o = { alpha: 0, _born: -1 }, n1 = M.num(A, 'pa' + p, { ...o }), n2 = M.num(A, 'pb' + p, { ...o }), p1 = M.op('+', 'pp' + p, { ...o }), p2 = M.op('+', 'pq' + p, { ...o });
              M.inert(g, ['pa' + p, 'pb' + p, 'pp' + p, 'pq' + p]); S.terms = S.sum ? [S.sumN, p1, n1, p2, n2] : [n1, p2, n2]; S.tot.items = [S.tot.items[0], S.tot.items[1], ...S.terms]; S.placeTot();
              for (const [f, d, n, pl] of [[me, 0, n1, S.sum ? p1 : null], [tw, 0.1 * T, n2, p2]]) { const q = S.scr(f); M.fly(g, { node: M.num(A, null), from: [q.x, q.y], to: n.id, delay: d, dur: 0.4 * T, arc: -40, s0: 24, s1: S.totS, col: '#fff2a0',
                then(g) { n.alpha = 1; n.pop = g.t; if (pl) { pl.alpha = 1; pl.pop = g.t; } M.sparkle(g, n, { n: 6 }); g.sfx('pop'); } }); } }],
            // the sum collapses into the new total: the terms slide into the first one and it rolls over
            [2.3 * T, g => { for (const q of S.terms) M.indicate(g, q, { dur: 0.3 * T, sc: 1.12 }); hop(g, 'think'); }],
            [2.65 * T, g => { const [keep, ...rest2] = S.terms, bk = M.box(g, keep.id); for (const q of rest2) { const b = M.box(g, q.id); if (b && bk) M.tween(g, q, { dx: bk.x - b.x, alpha: 0, sc: 0.5 }, 0.28 * T); }
              S.sum += 2 * A; M.roll(g, keep, S.sum, { delay: 0.12 * T, dur: 0.3 * T }); M.at(g, [[0.42 * T, g => { M.sparkle(g, keep, { n: 10 }); g.sfx('coin'); hop(g, 'happy'); }]]); }],
            [3.1 * T, g => { const keep = S.terms[0]; S.sumN = keep; S.tot.items = [S.tot.items[0], S.tot.items[1], keep]; S.placeTot();
              if (S.done[0] && S.done[1] && S.done[2]) { M.circle(g, keep, { delay: 0.1 * T, dur: 0.5 * T, col: '#ffd45a' }); M.sparkle(g, keep, { delay: 0.2 * T, n: 16 }); hop(g, 'laugh'); } }]]); } };
    };
    M.play(g, {
      moves(g) { if (!S.unfold) return [unfold]; const out = []; for (let p = 0; p < 3; p++) if (!S.done[p]) out.push(pairMove(p)); return out; },
      area(g) { return !S.unfold ? ['box'] : [0, 1, 2].filter(p => !S.done[p]).map(p => PAIRS[p].ids[0]); },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s; if (S.u0 != null && S.uk < 1) { S.uk = M.clamp((g.t - S.u0) / (1.6 * M.pace(g)), 0, 1); S.setTags(); } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), mk = S.mk, { l, w, h } = S;
    c.drawImage(g.bake('surface_bg', paintBg), 0, 0, 360, 640);
    const lg = c.createRadialGradient(200, 300, 20, 200, 300, 320); lg.addColorStop(0, 'rgba(255,220,160,0.16)'); lg.addColorStop(1, 'rgba(255,220,160,0)'); c.fillStyle = lg; c.fillRect(0, 0, 360, 640);
    // the box (or the net): faces sorted far to near; a face seen from inside shows the plain inner cardboard
    const V = S.view(S.uk), fs = faces3(l, w, h, S.uk).map(f => { const q = f.v.map(p => S.proj(p, V)); return { ...f, q, z: q.reduce((s, p) => s + p[2], 0) / 4 }; });
    const area2 = q => { let s = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
    const ref = Math.sign(area2(fs[0].q));
    c.save(); c.fillStyle = 'rgba(20,8,0,0.35)'; c.beginPath(); for (const f of fs) { c.moveTo(f.q[0][0] + 6, f.q[0][1] + 8); for (const p of f.q.slice(1)) c.lineTo(p[0] + 6, p[1] + 8); c.closePath(); } c.fill(); c.restore();
    fs.sort((a, b) => b.z - a.z);
    for (const f of fs) { const out = Math.sign(area2(f.q)) === ref, lt = S.lit[f.id], k = lt != null ? M.clamp((t - lt) / (0.3 * T), 0, 1) : 0;
      let col = out ? (f.id === 'F' || f.id === 'K' ? CARD : f.id === 'T' || f.id === 'Bo' ? '#e2b474' : CARD2) : INSIDE; if (k > 0) col = M.mix(col, PAIRS[f.p].col, k);
      c.save(); c.beginPath(); c.moveTo(f.q[0][0], f.q[0][1]); for (const p of f.q.slice(1)) c.lineTo(p[0], p[1]); c.closePath(); c.fillStyle = col; c.fill();
      if (lt != null && t - lt < 0.6) { c.shadowColor = '#fff2a0'; c.shadowBlur = 18 * (1 - (t - lt) / 0.6); }
      c.strokeStyle = EDGE; c.lineWidth = 2.5; c.lineJoin = 'round'; c.stroke(); c.restore();
      // the area, big in the middle of a solved face
      const ar = S.area[f.id]; if (ar && out) { const cx = f.q.reduce((s, p) => s + p[0], 0) / 4, cy = f.q.reduce((s, p) => s + p[1], 0) / 4, kk = M.clamp((t - ar.t0) / (0.3 * T), 0, 1), sz = Math.min(28, 0.62 * Math.min(S.scr(f.id).w, S.scr(f.id).h) + 6) * (1 + Math.sin(kk * Math.PI) * 0.3);
        c.save(); c.globalAlpha = kk; c.font = M.NUMF(sz, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineJoin = 'round'; c.strokeText(String(ar.v), cx, cy + 1); c.fillStyle = '#3a1a08'; c.fillText(String(ar.v), cx, cy + 1); c.restore(); } }
    // a face being worked on: its bottom and left edges glow, with their lengths written beside them
    if (S.edgeAt && t - S.edgeAt.t0 < 1.2 * T) { const E = S.edgeAt, r = S.scr(E.id), k = M.clamp((t - E.t0) / (0.3 * T), 0, 1), a = t - E.t0 > 0.9 * T ? 1 - (t - E.t0 - 0.9 * T) / (0.3 * T) : 1;
      const x0 = r.x - r.w / 2, x1 = r.x + r.w / 2, y0 = r.y - r.h / 2, y1 = r.y + r.h / 2;
      c.save(); c.globalAlpha = M.clamp(a, 0, 1); c.strokeStyle = '#ffd45a'; c.shadowColor = '#ffd45a'; c.shadowBlur = 12; c.lineWidth = 5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x0, y1); c.lineTo(M.lerp(x0, x1, M.easeIO(k)), y1); c.moveTo(x0, y1); c.lineTo(x0, M.lerp(y1, y0, M.easeIO(k))); c.stroke(); c.shadowBlur = 0;
      c.font = M.NUMF(20, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(30,10,0,0.9)'; c.lineJoin = 'round'; c.fillStyle = '#ffe46a';
      for (const [s2, x, y] of [[E.ha, (x0 + x1) / 2, y1 + 14], [E.va, x0 - 13, (y0 + y1) / 2]]) { c.strokeText(String(s2), x, y); c.fillText(String(s2), x, y); } c.restore(); }
    // the working note on the face, on a dark pill
    if (S.noteKey && mk.ex[S.noteKey]) { const a = S.noteOut ? 1 - M.clamp((t - S.noteOut) / (0.25 * T), 0, 1) : 1, b = M.unionBox(S.noteN.items.map(n => M.box(g, n.id || n._pid)).filter(Boolean));
      c.save(); c.globalAlpha = a; if (b) { c.fillStyle = 'rgba(30,14,4,0.82)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 9, b.y - b.h / 2 - 6, b.w + 18, b.h + 12, 12); c.fill(); } M.drawEx(g, c, S.noteKey); c.restore(); }
    // the length tags
    { const tp = S.tagPos(S.uk); for (const id of ['dl', 'dw', 'dh']) { const [x, y] = tp[id], bad = mk.missInfo && mk.missInfo.tap === id && t - mk.missAt < 0.4 ? Math.sin((t - mk.missAt) * 50) * 4 : 0;
      c.save(); c.translate(x + bad, y); c.fillStyle = 'rgba(20,8,0,0.35)'; c.beginPath(); c.roundRect(-15, -13, 34, 32, 9); c.fill(); c.fillStyle = '#c8402a'; c.beginPath(); c.roundRect(-17, -16, 34, 32, 9); c.fill();
      c.font = M.NUMF(26, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff4dc'; c.fillText(String(S.tagV[id]), 0, 1); c.restore(); } }
    // the running total on a chalk tag
    SCN.panel(c, 'chalk', 180, TOTY, Math.max(190, (S.totW || 0) + 44), 62, t); M.drawEx(g, c, 'tot');
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const expr = won ? 'laugh' : lost || t - mk.missAt < 0.5 ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'beaver', 316, 626 - hopK * 20, 1.15, { t, facing: -1, pose: won ? 'cheer' : hopK > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle', expr }); else SCN.host(g, c, 'beaver', 316, 626, 1.15);
    M.drawUI(g, c);
  },
});
