// geometry_volume.js — VOLUME! The volume of a box is length × width × height: count one layer of unit cubes, then
// multiply by the number of layers.
// A glass ice box on a floe at polar dawn, with a penguin. The box is drawn in 3D (an oblique view) with its three side
// lengths on frosted tags along its edges, and under it an ice slab reads V = ?. Every move's working plays by itself:
//   1. Drag one side onto another (4 onto 3): both edges light up gold, the numbers fly down (V = 4 × 3), and the first
//      row of ice cubes drops in. Row after row follows while a counter beside the box rolls up by 4 (4, 8, 12); then
//      the counter flies down into the slab: V = 12. Any pair of sides works (a floor layer, a front wall or a side wall).
//   2. Drag the last side onto the 12 (or onto the box): its edge lights up, "× 2" flies in (V = 12 × 2), and whole
//      copies of the layer stack up one at a time, the counter rolling 12, 24; it flies down: V = 24.
// Each layer has its own tint, so the layers stay easy to count. The penguins hop when the cubes land.
// Level 0: small boxes (4 × 3 × 2). Level 1: up to 5 × 3 × 3. Level 2: up to 6 × 4 × 4.
// Medium mode: the tray asks for the layer (l × w) once the first row is in, and for the volume once × h is written.
const M = MK, INK = '#1c2c5a', GOLD = '#ffc83a', EDGE = '#24406e';
const LAYER = [['#d8f2ff', '#a6d8f4', '#78b4dc'], ['#efe2ff', '#cbb4f0', '#a28ad0'], ['#dcfff0', '#a8e8cc', '#78c4a6'], ['#fff0dc', '#f4cfa0', '#d8a670']];
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return [[4, 3, 2], [3, 2, 2], [4, 2, 3], [3, 3, 2]][r(4)];
  if (L === 1) return [3 + r(3), 2 + r(2), 2 + r(2)];
  return [4 + r(3), 3 + r(2), 3 + r(2)];
}
const NAMES = ['L', 'W', 'H'];

// polar dawn: a pink and peach sky, a low sun, icebergs, a calm sea and the floe in front
function polar(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 470); sk.addColorStop(0, '#34407e'); sk.addColorStop(0.38, '#9a6aa8'); sk.addColorStop(0.68, '#f2a28c'); sk.addColorStop(1, '#ffe2b8');
  c.fillStyle = sk; c.fillRect(0, 0, W, 470);
  const r = P.rng(17); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,250,240,${0.2 + r() * 0.5})`; c.beginPath(); c.arc(r() * W, r() * 150, r() * 1.2 + 0.3, 0, 7); c.fill(); }
  const sg = c.createRadialGradient(276, 446, 4, 276, 446, 160); sg.addColorStop(0, 'rgba(255,240,200,0.9)'); sg.addColorStop(0.2, 'rgba(255,214,170,0.5)'); sg.addColorStop(1, 'rgba(255,200,160,0)');
  c.fillStyle = sg; c.fillRect(100, 280, 260, 200); c.fillStyle = '#fff4d4'; c.beginPath(); c.arc(276, 452, 22, Math.PI, 0); c.fill();
  // icebergs on the horizon, lit pink on the sun side
  for (const [x, w, h] of [[30, 90, 46], [120, 60, 26], [330, 80, 38]]) {
    c.fillStyle = '#b8a8d8'; c.beginPath(); c.moveTo(x - w / 2, 458); c.lineTo(x - w * 0.3, 458 - h * 0.7); c.lineTo(x - w * 0.05, 458 - h); c.lineTo(x + w * 0.2, 458 - h * 0.8); c.lineTo(x + w / 2, 458); c.closePath(); c.fill();
    c.fillStyle = '#ffe4ec'; c.beginPath(); c.moveTo(x - w * 0.05, 458 - h); c.lineTo(x + w * 0.2, 458 - h * 0.8); c.lineTo(x + w / 2, 458); c.lineTo(x + w * 0.1, 458); c.closePath(); c.fill();
  }
  const sea = c.createLinearGradient(0, 456, 0, 530); sea.addColorStop(0, '#7a7ab8'); sea.addColorStop(1, '#4a5a98'); c.fillStyle = sea; c.fillRect(0, 456, W, 80);
  c.fillStyle = 'rgba(255,220,180,0.35)'; c.fillRect(230, 458, 92, 3); c.fillRect(244, 466, 64, 2); c.fillRect(256, 474, 40, 2);
  // the floe
  const fl = c.createLinearGradient(0, 512, 0, H); fl.addColorStop(0, '#fbf6ff'); fl.addColorStop(0.4, '#e2e2f6'); fl.addColorStop(1, '#bcc4e6'); c.fillStyle = fl;
  c.beginPath(); c.moveTo(0, 524); c.quadraticCurveTo(90, 508, 180, 516); c.quadraticCurveTo(280, 524, W, 510); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 524); c.quadraticCurveTo(90, 508, 180, 516); c.quadraticCurveTo(280, 524, W, 510); c.stroke();
  c.fillStyle = 'rgba(110,120,190,0.18)'; for (const [x, y, rx] of [[90, 570, 70], [270, 600, 90], [170, 630, 120]]) { c.beginPath(); c.ellipse(x, y, rx, 9, 0, 0, 7); c.fill(); }
}

MG.add({
  id: 'geometry_volume', stage: 'geometry', cmd: 'VOLUME!', hint: 'drag', time: 9, mood: 'bright', winText: 'Filled!', hold: 1.5,
  card: {
    title: 'Volume of a box', ref: 'Grade 5', kind: 'Geometry',
    text: 'Volume is how much space a solid takes up. We measure it in unit cubes: cubes that are 1 unit long on every edge.\n\nTo find the volume of a box, first count one layer. A box 4 long and 3 wide has a bottom layer of 4 × 3 = 12 cubes. Then count the layers. If the box is 2 high, there are 2 layers, so the box holds 12 × 2 = 24 cubes.\n\nIt does not matter which two sides you start with. Any order gives the same answer: 4 × 3 × 2 = 24.',
    note: 'Volume of a box = length × width × height. The answer is in cubic units.',
    ask: 'What is the volume of a box 5 long, 2 wide and 3 high? A cube has edges of 3. What is its volume?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const dims = pick(g); S.dims = dims; const [l, w, h] = dims;
    const u = Math.min(46, 236 / (l + 0.55 * w), 176 / (h + 0.45 * w)); S.u = u;
    const bw = (l + 0.55 * w) * u, bh = (h + 0.45 * w) * u; S.ox = 180 - bw / 2 - 8; S.oy = 306 + bh / 2;
    S.P = (x, y, z) => [S.ox + x * u + y * 0.55 * u, S.oy - z * u - y * 0.45 * u];
    S.at = {}; S.cnt = null; S.layerOf = () => 0; S.face = 'happy';
    // the side tags: length under the front edge, width up and left of the top-left depth edge, height left of the front edge
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], P = S.P;
    const spots = [[...mid(P(0, 0, 0), P(l, 0, 0))].map((v, i) => v + [0, 26][i]), [...mid(P(0, 0, h), P(0, w, h))].map((v, i) => v + [-24, -12][i]), [...mid(P(0, 0, 0), P(0, 0, h))].map((v, i) => v + [-26, 0][i])];
    NAMES.forEach((id, i) => M.place(g, id, M.row(M.num(dims[i], id)), spots[i][0], spots[i][1] + 10, 28, { col: INK }));
    S.right = P(l, w, 0)[0];
    const Vn = M.vr('V', 'V'), eq = M.op('=', 'eq');
    S.setRow = rest => { S.row = M.row(Vn, eq, rest); M.place(g, 'row', S.row, 180, 478, 40, { col: INK }); M.inert(g, ['V', 'eq', 'res']); };
    S.setRow(M.slot('slot', { col: '#7a8ab8' }));
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // a gold line runs along the edge that belongs to a side
    const trace = (g, ax, o = {}) => M.anim(g, { delay: o.delay, dur: 0.4 * T, linger: o.linger ?? 0.5 * T, draw(c, g, k, t) {
      const e = M.easeIO(k), al = t > 0.4 * T ? 1 - (t - 0.4 * T) / (o.linger ?? 0.5 * T) : 1, a = [0, 0, 0], b = [0, 0, 0]; if (ax === 1) { a[2] = b[2] = h; } b[ax] = dims[ax];
      const p0 = P(...a), p1 = P(...b); c.globalAlpha = M.clamp(al, 0, 1); c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 14; c.lineWidth = 7; c.lineCap = 'round';
      c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(M.lerp(p0[0], p1[0], e), M.lerp(p0[1], p1[1], e)); c.stroke(); } });
    // cubes: c = [i, j, k]; a cube appears at S.at[key] and drops into place
    const key = (i, j, k) => i + ',' + j + ',' + k;
    const each = fn => { for (let i = 0; i < l; i++) for (let j = 0; j < w; j++) for (let k = 0; k < h; k++) fn([i, j, k]); };
    const centre = cs => { let x = 0, y = 0; for (const q of cs) { const p = P(q[0] + 0.5, q[1] + 0.5, q[2] + 0.5); x += p[0]; y += p[1]; } return [x / cs.length, y / cs.length]; };
    const counterTo = (g, cs) => { const p = centre(cs); S.cy0 = S.cnt ? S.cntY(g) : p[1]; S.cy1 = p[1]; S.cT = g.t; };
    S.cntY = g => S.cT == null ? S.oy : M.lerp(S.cy0, S.cy1, M.ease((g.t - S.cT) / (0.2 * T)));
    // fill one line of the first layer (pos along axis p, line index m along q, layer 0 along r)
    const fillLine = (g, m) => { const [p, q, r] = S.axes, cs = []; each(c => { if (c[q] === m && c[r] === 0) { S.at[key(...c)] = g.t + c[p] * 0.04 * T; cs.push(c); } }); counterTo(g, cs); g.sfx(m ? 'pop' : 'tap'); hop(g); return cs; };
    const fillLayer = (g, s) => { const [p, q, r] = S.axes, cs = []; each(c => { if (c[r] === s) { S.at[key(...c)] = g.t + (c[p] + c[q]) * 0.018 * T; cs.push(c); } }); counterTo(g, cs); g.sfx('pop'); hop(g); return cs; };
    S.key = key;
    const tags = NAMES;
    M.play(g, {
      moves(g) {
        if (!S.axes) {
          // 1. one side onto another: count one layer (any pair of sides makes a layer)
          const out = [];
          for (const [a, b] of [['L', 'W'], ['W', 'L'], ['L', 'H'], ['H', 'L'], ['W', 'H'], ['H', 'W']]) {
            const p = tags.indexOf(a), q = tags.indexOf(b), dp = dims[p], dq = dims[q], rt = Math.min(0.26, 0.9 / Math.max(1, dq - 1)) * T, rest = (dq - 1) * rt + 0.85 * T;
            out.push({ drag: a, to: b, busy: 0.1, askAt: 0.95 * T, after: rest, ask: { v: dp * dq, wrong: [dp + dq, dp * dq + dp, dp * (dq + 1), dims[0] + dims[1] + dims[2]] },
              then(g) {
                S.axes = [p, q, 3 - p - q]; M.show(g, 0.95 * T); hop(g, 'wow'); g.sfx('swoosh'); S.point = true;
                M.circle(g, a, { dur: 0.45 * T, col: GOLD }); trace(g, p, { linger: 0.7 * T });
                M.circle(g, b, { delay: 0.25 * T, dur: 0.45 * T, col: GOLD }); trace(g, q, { delay: 0.25 * T, linger: 0.5 * T });
                M.at(g, [
                  [0.4 * T, g => { const na = M.num(dp, 'ma', { alpha: 0 }), nb = M.num(dq, 'mb', { alpha: 0 }), mul = M.row(na, M.op('×', 'x1'), nb); mul.id = 'mul'; S.setRow(mul); M.inert(g, ['x1']);
                    [[a, 'ma', na, 0], [b, 'mb', nb, 0.1 * T]].forEach(([src, dst, nd, d]) => M.fly(g, { node: M.num(nd.v, null, { col: INK }), from: src, to: dst, delay: d, dur: 0.38 * T, arc: -40, s0: 28, s1: 40,
                      then(g) { nd.alpha = 1; nd.pop = g.t; M.sparkle(g, dst, { n: 6 }); g.sfx('pop'); } })); }],
                  [0.62 * T, g => { fillLine(g, 0); S.cnt = M.num(dp, null, { alpha: 0 }); }],
                  [0.62 * T + Math.min(0.04 * dp * T, 0.3), g => { S.cnt.alpha = 1; S.cnt.pop = g.t; }],
                ]);
              },
              resolve(g) {
                M.show(g, rest); const steps = [];
                for (let m = 1; m < dq; m++) steps.push([(m - 1) * rt + 0.02, g => { fillLine(g, m); M.at(g, [[Math.min(0.04 * dp * T, rt * 0.5), g => M.roll(g, S.cnt, dp * (m + 1), { dur: Math.min(0.18 * T, rt * 0.5) })]]); }]);
                steps.push([(dq - 1) * rt + 0.2 * T, g => { S.cnt.pop = g.t; M.sparkle(g, [S.cx, S.cntY(g)], { n: 8 }); g.sfx('ding'); hop(g, 'laugh'); }]);
                steps.push([(dq - 1) * rt + 0.45 * T, g => { const from = [S.cx, S.cntY(g)]; S.cnt = null;
                  for (const q of S.row.items[2].items) M.tween(g, q, { alpha: 0 }, 0.2 * T);
                  M.fly(g, { node: M.num(dp * dq, null, { col: INK }), from, to: 'mul', dur: 0.34 * T, arc: -30, s0: 24, s1: 40,
                    then(g) { S.prod = M.num(dp * dq, 'prod', { _born: -1, pop: g.t }); S.setRow(S.prod); M.sparkle(g, 'prod', { n: 10 }); g.sfx('coin'); hop(g); S.point = false;
                      const b0 = P(0, 0, 0), b1 = P(l, w, h); M.zone(g, 'box', { x: (b0[0] + b1[0]) / 2, y: (b0[1] + b1[1]) / 2, w: b1[0] - b0[0], h: b0[1] - b1[1] }); } }); }]);
                M.at(g, steps);
              } });
          }
          return out;
        }
        if (!S.prod || S.stacked) return [];
        // 2. the last side onto the layer: stack copies of the layer
        const r = S.axes[2], rid = tags[r], dr = dims[r], base = S.prod.v * 1, rt = Math.min(0.32, 1.0 / Math.max(1, dr - 1)) * T, rest = (dr - 1) * rt + 0.8 * T;
        const then = g => {
          S.stacked = true; M.show(g, 0.6 * T); hop(g, 'wow'); g.sfx('swoosh'); S.point = true;
          M.circle(g, rid, { dur: 0.45 * T, col: GOLD }); trace(g, r, { linger: 0.5 * T }); M.indicate(g, S.prod, { dur: 0.4 * T, sc: 1.2 });
          M.at(g, [
            [0.3 * T, g => { const nh = M.num(dr, 'mh', { alpha: 0 }), mul = M.row(S.prod, M.op('×', 'x2'), nh); mul.id = 'mul2'; S.setRow(mul); M.inert(g, ['x2']);
              M.fly(g, { node: M.num(dr, null, { col: INK }), from: rid, to: 'mh', dur: 0.36 * T, arc: -40, s0: 28, s1: 40, then(g) { nh.alpha = 1; nh.pop = g.t; M.sparkle(g, 'mh', { n: 6 }); g.sfx('pop'); } });
              const cs = []; each(c => { if (c[r] === 0) cs.push(c); }); S.cnt = M.num(base, null, { alpha: 0 }); S.cT = null; counterTo(g, cs); }],
            [0.45 * T, g => { S.cnt.alpha = 1; S.cnt.pop = g.t; }],
          ]);
        };
        const mv = { busy: 0.1, askAt: 0.6 * T, after: rest, ask: { v: base * dr, wrong: [base + dr, base * (dr - 1), base * dr + base, dims[0] + dims[1] + dims[2]] }, then,
          resolve(g) {
            M.show(g, rest); const steps = [];
            for (let s = 1; s < dr; s++) steps.push([(s - 1) * rt + 0.02, g => { fillLayer(g, s); M.at(g, [[Math.min(0.2 * T, rt * 0.55), g => M.roll(g, S.cnt, base * (s + 1), { dur: Math.min(0.2 * T, rt * 0.5) })]]); }]);
            steps.push([(dr - 1) * rt + 0.2 * T, g => { S.cnt.pop = g.t; M.sparkle(g, [S.cx, S.cntY(g)], { n: 8 }); g.sfx('ding'); }]);
            steps.push([(dr - 1) * rt + 0.42 * T, g => { const from = [S.cx, S.cntY(g)]; S.cnt = null;
              for (const q of S.row.items[2].items) M.tween(g, q, { alpha: 0 }, 0.2 * T);
              M.fly(g, { node: M.num(base * dr, null, { col: INK }), from, to: 'mul2', dur: 0.34 * T, arc: -30, s0: 24, s1: 44,
                then(g) { S.setRow(M.num(base * dr, 'res', { _born: -1, pop: g.t })); M.sparkle(g, 'res', { n: 14, cols: [GOLD, '#fff', '#9ad8ff'] }); g.sfx('coin'); g.sfx('sparkle'); hop(g, 'laugh'); S.point = false; } }); }]);
            M.at(g, steps);
          } };
        return [{ ...mv, drag: rid, to: ['prod', 'box'] }, { ...mv, drag: 'prod', to: rid }];
      },
      area(g) { return !S.axes ? ['L', 'W'] : [tags[S.axes[2]], 'prod']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, [l, w, h] = S.dims, P = S.P, u = S.u;
    c.drawImage(g.bake('vol_polar', polar), 0, 0, 360, 640);
    // the sea glitters and snow sparkles drift
    c.save(); for (let i = 0; i < 14; i++) { const x = (i * 53 + t * 9) % 380 - 10, y = 462 + (i % 5) * 12, a = 0.25 + 0.25 * Math.sin(t * 2.5 + i * 1.7); c.fillStyle = `rgba(255,236,210,${a})`; c.fillRect(x, y, 10 + (i % 3) * 6, 1.6); }
    for (let i = 0; i < 16; i++) { const x = (i * 71 + Math.sin(t * 0.6 + i) * 18 + t * 6) % 370 - 5, y = (i * 113 + t * (12 + (i % 4) * 4)) % 640, a = 0.4 + 0.4 * Math.sin(t * 3 + i); c.fillStyle = `rgba(255,255,255,${a})`; c.beginPath(); c.arc(x, y, 1.2 + (i % 3) * 0.6, 0, 7); c.fill(); } c.restore();
    // the glass box: back edges, the cubes in painter's order (far to near, bottom to top, left to right), front edges
    const line = (pts, dash, col, lw) => { c.save(); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = 'round'; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
    c.save(); c.fillStyle = 'rgba(40,40,90,0.18)'; c.beginPath(); const s0 = P(0, 0, 0), s1 = P(l, 0, 0), s2 = P(l, w, 0), s3 = P(0, w, 0); c.moveTo(s0[0] + 6, s0[1] + 6); c.lineTo(s1[0] + 10, s1[1] + 6); c.lineTo(s2[0] + 10, s2[1] + 4); c.lineTo(s3[0], s3[1]); c.closePath(); c.fill(); c.restore();
    c.save(); c.fillStyle = 'rgba(220,240,255,0.18)'; c.beginPath(); for (const p of [P(0, w, 0), P(l, w, 0), P(l, w, h), P(0, w, h)]) c.lineTo(p[0], p[1]); c.closePath(); c.fill(); c.restore();
    line([P(0, w, 0), P(0, w, h)], [5, 5], 'rgba(255,255,255,0.55)', 2); line([P(0, w, 0), P(l, w, 0)], [5, 5], 'rgba(255,255,255,0.55)', 2); line([P(0, 0, 0), P(0, w, 0)], [5, 5], 'rgba(255,255,255,0.55)', 2);
    const quad = (pts, fill) => { c.fillStyle = fill; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); };
    c.save(); c.strokeStyle = 'rgba(30,50,100,0.55)'; c.lineWidth = 1.2; c.lineJoin = 'round';
    const r = S.axes ? S.axes[2] : 2;
    for (let j = w - 1; j >= 0; j--) for (let k = 0; k < h; k++) for (let i = 0; i < l; i++) {
      const at = S.at[S.key(i, j, k)]; if (at == null || t < at) continue; const kk = M.clamp((t - at) / (0.2 * M.pace(g)), 0, 1), e = M.ease(kk);
      const lay = [i, j, k][r], pal = LAYER[lay % LAYER.length];
      c.save(); c.globalAlpha = Math.min(1, kk * 2.5); c.translate(0, -(1 - e) * u * 0.9);
      const q = (x, y, z) => P(i + x, j + y, k + z);
      quad([q(0, 0, 1), q(1, 0, 1), q(1, 1, 1), q(0, 1, 1)], pal[0]); // top
      quad([q(1, 0, 0), q(1, 1, 0), q(1, 1, 1), q(1, 0, 1)], pal[2]); // right side
      quad([q(0, 0, 0), q(1, 0, 0), q(1, 0, 1), q(0, 0, 1)], pal[1]); // front
      const f = q(0, 0, 1); c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(f[0] + u * 0.14, f[1] + u * 0.14, u * 0.18, u * 0.08);
      c.restore();
    }
    c.restore();
    line([P(0, 0, 0), P(l, 0, 0), P(l, 0, h), P(0, 0, h), P(0, 0, 0)], null, 'rgba(255,255,255,0.95)', 2.5);
    line([P(l, 0, 0), P(l, w, 0), P(l, w, h), P(0, w, h), P(0, 0, h)], null, 'rgba(255,255,255,0.95)', 2.5); line([P(l, 0, h), P(l, w, h)], null, 'rgba(255,255,255,0.95)', 2.5);
    // the frosted side tags
    NAMES.forEach((id, i) => { const b = M.box(g, id); if (!b) return; const bw = Math.max(b.w + 18, 38), bh = b.h + 14, y = b.y + Math.sin(t * 2 + i) * 1.2;
      c.save(); c.fillStyle = 'rgba(30,30,80,0.22)'; c.beginPath(); c.roundRect(b.x - bw / 2 + 2, y - bh / 2 + 4, bw, bh, 10); c.fill();
      c.fillStyle = '#f6fbff'; c.beginPath(); c.roundRect(b.x - bw / 2, y - bh / 2, bw, bh, 10); c.fill(); c.strokeStyle = '#8ab4dc'; c.lineWidth = 2; c.stroke(); c.restore();
      M.drawEx(g, c, id); });
    // the running count, on a gold badge riding beside the line or layer that is filling
    S.cx = Math.min(334, S.right + 30);
    if (S.cnt && S.cnt.alpha > 0) { const nd = S.cnt, x = S.cx, y = S.cntY(g), m = M.lay(nd, 24), rad = Math.max(21, m.w / 2 + 9); c.save(); c.translate(x, y); c.globalAlpha = nd.alpha;
      c.fillStyle = 'rgba(30,30,80,0.25)'; c.beginPath(); c.arc(2, 4, rad, 0, 7); c.fill(); c.fillStyle = GOLD; c.strokeStyle = '#8a5a14'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, rad, 0, 7); c.fill(); c.stroke();
      M.draw(c, nd, -m.w / 2, (m.a - m.d) / 2, 24, { t, col: '#3a2214' }); c.restore(); }
    // the ice slab where the volume is worked out
    c.save(); c.fillStyle = 'rgba(30,30,80,0.25)'; c.beginPath(); c.roundRect(76, 446, 216, 60, 14); c.fill();
    const ig = c.createLinearGradient(0, 440, 0, 500); ig.addColorStop(0, '#f8fcff'); ig.addColorStop(1, '#cfe4f6'); c.fillStyle = ig; c.beginPath(); c.roundRect(72, 440, 216, 60, 14); c.fill();
    c.strokeStyle = '#ffffff'; c.lineWidth = 2.5; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(84, 446, 60, 4); c.restore();
    M.drawEx(g, c, 'row');
    // the penguins: the host points at the box while the work is shown and hops when cubes land
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') { ANI.draw(c, 'penguin', 58, 604 - hopK * 22, 1.3, { t, pose, expr });
      ANI.draw(c, 'penguin', 306, 596 - hopK * 12, 0.85, { t, phase: 2, facing: -1, pose: won ? 'cheer' : hopK > 0 ? 'hop' : 'wave', expr: won ? 'laugh' : 'happy', tint: '#3a4a6a' }); }
      else SCN.host(g, c, 'penguin', 58, 604, 1.3); } catch (e) { SCN.host(g, c, 'penguin', 58, 604, 1.3); }
    M.drawUI(g, c);
  },
});
