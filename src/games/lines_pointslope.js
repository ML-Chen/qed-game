// lines_pointslope.js — POINT-SLOPE! The line with slope m through the point (x₁, y₁) is y − y₁ = m(x − x₁).
// An alpine trail board on a spring morning, with a hedgehog guide. The board shows a graph with one point marked and
// labelled (2, 5), and a tag m = 3. On the sign under it: y − y₁ = m(x − x₁), with the blanks y₁, m and x₁ in orange.
// Every move's working plays by itself (show your work):
//   1. Drag the point's label onto the equation: dashed lines drop from the point to both axes, then the 2 flies into x₁
//      and the 5 into y₁: y − 5 = m(x − 2).
//   2. Drag the 3 from the tag into m: on the graph a step staircase draws from the point (1 across, 3 up, with a "+3"
//      note beside the rise) and the line draws itself out through the point in both directions.
//   (1 and 2 may come in either order.)
//   3. Tap 3(x − 2) to distribute: arrows run from the 3 to the x and to the −2, "3 · (−2) = −6" writes itself, and
//      the bracket opens: y − 5 = 3x − 6.
//   4. Drag the − 5 across the = sign: it hops over on an arc and lands as + 5, while "−5 + 5 = 0" writes itself under
//      the left side and is crossed out: y = 3x − 6 + 5.
//   (3 and 4 may come in either order.) Whichever comes last ends with "−6 + 5 = −1": the + 5 slides into the −6, which
//   rolls over to − 1: y = 3x − 1, and the line's crossing of the y-axis lights up at (0, −1).
// Level 0: slopes 2 and 3, small points. Level 1: slopes up to 4. Level 2: negative slopes too.
// Medium mode: the tray asks for m · (−x₁) when distributing, and for b when the constants combine.
const M = MK, INK = '#2a2440', BLANK = '#d0601a', GOLD = '#ffb21f', LINE = '#2a7ad8', CHALKN = '#7a3ab0';
const EQY = 474, EQS = 36, GX0 = 36, GX1 = 268, GY0 = 198, GY1 = 392;
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let i = 0; i < 400; i++) {
    const m = L === 0 ? ri(2, 3) : L === 1 ? ri(2, 4) : [-3, -2, 2, 3, 4][ri(0, 4)], x1 = L === 0 ? ri(1, 3) : ri(1, 4), b = L === 0 ? ri(-3, 4) : ri(-4, 7);
    const y1 = m * x1 + b; if (!b || y1 < 1 || y1 > 8 || y1 === b) continue;
    const yspan = Math.max(y1, b, 0) - Math.min(0, b, y1) + 2; if (yspan > 11) continue;
    return { m, x1, y1, b };
  }
  return { m: 3, x1: 2, y1: 5, b: -1 };
}
const sg = v => (v < 0 ? '−' : '+');

// an alpine morning: blue sky, snowy peaks, a green slope, pines
function alpine(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#4a8ed8'); sk.addColorStop(0.6, '#a8d4f4'); sk.addColorStop(1, '#e8f6ff'); c.fillStyle = sk; c.fillRect(0, 0, W, 420);
  const peak = (pts, body, snow) => { c.fillStyle = body; c.beginPath(); c.moveTo(pts[0][0], 430); for (const p of pts) c.lineTo(p[0], p[1]); c.lineTo(pts[pts.length - 1][0], 430); c.closePath(); c.fill();
    c.fillStyle = snow; for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i]; if (y > 330) continue; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 26, y + 34); c.lineTo(x - 10, y + 28); c.lineTo(x + 2, y + 40); c.lineTo(x + 14, y + 26); c.lineTo(x + 28, y + 36); c.closePath(); c.fill(); } };
  peak([[-20, 400], [60, 250], [110, 310], [190, 210], [260, 300], [320, 240], [390, 380]], '#7a8ab8', '#f4f8ff');
  peak([[-20, 420], [40, 340], [130, 300], [220, 350], [300, 310], [380, 400]], '#5a7aa0', '#e8f0fa');
  P.hills(c, W, 470, 50, '#8ac860', '#5a9a40', { seed: 5, dabs: 60 });
  P.hills(c, W, 560, 30, '#7ab850', '#4a8a38', { seed: 11, dabs: 70 });
  P.flowers(c, W, 560, 636, 22, ['#ffffff', '#ffe066', '#c8a0ff', '#ff9ab8'], 4);
  for (const [x, y, s] of [[22, 470, 0.9], [342, 462, 0.8], [312, 478, 0.6]]) { c.fillStyle = '#3a6a40'; for (let k = 0; k < 4; k++) { const w = (26 - k * 5) * s, yy = y - k * 14 * s; c.beginPath(); c.moveTo(x - w, yy); c.lineTo(x, yy - 24 * s); c.lineTo(x + w, yy); c.closePath(); c.fill(); } c.fillStyle = '#5a3a24'; c.fillRect(x - 3 * s, y, 6 * s, 12 * s); }
}

MG.add({
  id: 'lines_pointslope', stage: 'lines', cmd: 'POINT-SLOPE!', hint: 'drag', time: 10, mood: 'bright', winText: 'On the line!', hold: 1.6,
  card: {
    title: 'Point-slope form', ref: 'Algebra 1', kind: 'Lines',
    text: 'If you know one point on a line and its slope, you know the whole line. The slope m says how much y goes up for each step of 1 to the right.\n\nPoint-slope form writes this straight down: y − y₁ = m(x − x₁), where (x₁, y₁) is the point you know.\n\nFor example, the line with slope 3 through (2, 5) is y − 5 = 3(x − 2). To tidy it up, multiply out the bracket: y − 5 = 3x − 6. Then add 5 to both sides: y = 3x − 1. That is slope-intercept form: the line crosses the y-axis at −1.',
    note: 'Through (x₁, y₁) with slope m: y − y₁ = m(x − x₁). Multiply out and move y₁ across to get y = mx + b.',
    ask: 'Write the line with slope 2 through (1, 4) as y = mx + b. Write the line with slope −1 through (3, 2).',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); Object.assign(S, pick(g)); const { m, x1, y1, b } = S;
    // the graph: the point and the y-intercept always fit, with square units
    const xmin = -1, xmax = Math.max(x1, 2) + 1.4, ymin = Math.min(0, b, y1) - 1, ymax = Math.max(y1, b, 0) + 1;
    // the y unit fits the height; the x unit may be up to 1.8 times wider so a narrow range still fills the board
    const uy = Math.min((GY1 - GY0 - 16) / (ymax - ymin), (GX1 - GX0) / (xmax - xmin)), ux = Math.min((GX1 - GX0) / (xmax - xmin), uy * 1.8), u = uy; S.u = u;
    const ox = (GX0 + GX1) / 2 - (xmin + xmax) / 2 * ux, oy = (GY0 + GY1) / 2 + 4 + (ymin + ymax) / 2 * uy;
    S.G = (x, y) => [ox + x * ux, oy - y * uy]; S.ext = { xmin, xmax, ymin, ymax };
    S.face = 'happy'; S.lineAt = null; S.stairAt = null; S.dropAt = null; S.icptAt = null;
    // the point's label and the slope tag (the tag's number is the part that is dragged)
    const [px, py] = S.G(x1, y1), lx = Math.min(GX1 - 30, Math.max(GX0 + 40, px + (m > 0 ? -44 : 44))), ly = Math.max(GY0 + 14, py - 16);
    S.lab = M.row(M.txt('(', 'lp0'), M.num(x1, 'lx'), M.txt(',', 'lc'), M.gap(5), M.num(y1, 'ly'), M.txt(')', 'lp1')); S.lab.id = 'pt';
    M.place(g, 'lab', S.lab, lx, ly + 9, 26, { col: INK });
    S.tag = M.row(M.vr('m', 'tm'), M.op('=', 'teq'), M.num(m, 'mt')); M.place(g, 'tag', S.tag, 306, 246, 30, { col: INK });
    // the equation: y − y₁ = m(x − x₁), the blanks in orange
    S.Y = M.vr('y', 'Y'); S.lm = M.op('-', 'lm'); S.ys = M.vr('y₁', 'ys', { col: BLANK }); S.eq = M.op('=', 'eqs');
    S.ms = M.vr('m', 'ms', { col: BLANK }); S.X = M.vr('x', 'X'); S.xm = M.op('-', 'xm'); S.xs = M.vr('x₁', 'xs', { col: BLANK });
    S.inner = M.row(S.X, S.xm, S.xs); S.par = M.paren(S.inner, 'par'); S.L = [S.Y, S.lm, S.ys]; S.R = [S.ms, S.par];
    S.relay = () => { S.row = M.row(...S.L, S.eq, ...S.R); M.place(g, 'eq', S.row, 180, EQY, EQS, { col: INK }); };
    S.relay(); M.inert(g, ['eqs', 'lp0', 'lp1', 'lc', 'lx', 'ly', 'tm', 'teq', 'xm', 'pl']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    S.blank = new Set(['ys', 'ms', 'xs']);
    // the last of moves 3 and 4 ends by combining the constants: −6 + 5 = −1
    const combineLen = 1.0 * T;
    const combine = (g, t0) => M.at(g, [
      [t0, g => { const rb = M.unionBox([M.box(g, 'cs'), M.box(g, 'yv2')]); S.cnote = M.row(M.num(-m * x1), M.op('+'), M.num(y1), M.op('='), M.num(b)); S.cnote.id = 'cn';
        M.place(g, 'cn', S.cnote, Math.min(270, rb.x), EQY + 46, 24, { col: CHALKN }); M.writeIn(g, S.cnote, { dur: 0.35 * T }); S.cnote.alpha = 0; M.tween(g, S.cnote, { alpha: 1 }, 0.1 * T); M.circle(g, ['cs', 'cv', 'pl', 'yv2'], { dur: 0.45 * T, col: GOLD }); hop(g, 'think'); }],
      [t0 + 0.45 * T, g => { // the + 5 slides into the constant, which rolls over to b
        const bc = M.box(g, 'cv'); for (const q of [S.pl, S.yv]) { const bq = M.box(g, q.id); if (bq && bc) M.tween(g, q, { dx: bc.x - bq.x, alpha: 0, sc: 0.5 }, 0.25 * T); }
        M.roll(g, S.cv, Math.abs(b), { delay: 0.1 * T, dur: 0.3 * T }); if (sg(b) !== S.cs.v) M.at(g, [[0.25 * T, g => { S.cs.v = sg(b); S.cs.pop = g.t; }]]); g.sfx('swoosh'); }],
      [t0 + 0.8 * T, g => { S.R = [S.mx, S.cs, S.cv]; S.relay(); M.sparkle(g, 'cv', { n: 10 }); g.sfx('ding'); hop(g, 'laugh'); M.tween(g, S.cnote, { alpha: 0 }, 0.25 * T); S.icptAt = g.t; }],
    ]);
    S.inert2 = () => M.inert(g, ['cs', 'pl', 'cn', 'mxr']);
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.placed) out.push({ drag: 'pt', to: ['ys', 'xs', 'Y', 'X'], area: [0, EQY - 50, 360, EQY + 40], busy: 0.1,
          then(g) { S.placed = true; M.show(g, 1.15 * T); hop(g, 'wow'); g.sfx('swoosh'); S.point = true;
            M.circle(g, 'pt', { dur: 0.4 * T, col: GOLD }); S.dropAt = g.t + 0.1 * T;
            M.at(g, [[0.3 * T, g => { M.indicate(g, 'lx', { dur: 0.35 * T, col: GOLD }); M.indicate(g, 'ly', { delay: 0.1 * T, dur: 0.35 * T, col: GOLD }); }]]);
            S.xv = M.num(x1, 'xv', { alpha: 0 }); S.yv = M.num(y1, 'yv', { alpha: 0 });
            [['lx', 'xs', S.xv, 0.45 * T, 'xs'], ['ly', 'ys', S.yv, 0.6 * T, 'ys']].forEach(([src, dst, nd, d, key]) => M.fly(g, { node: M.num(nd.v, null, { col: INK }), from: src, to: dst, delay: d, dur: 0.4 * T, arc: -60, s0: 26, s1: EQS,
              then(g) { const sl = S[key]; if (key === 'xs') S.inner.items[2] = nd; else S.L[2] = nd; nd.alpha = 1; nd._born = -1; nd.pop = g.t; S.blank.delete(key); S.relay(); M.sparkle(g, nd.id, { n: 7 }); g.sfx('pop'); hop(g); } }));
            M.at(g, [[1.15 * T, g => { S.point = false; }]]); } });
        if (!S.sloped) out.push({ drag: 'mt', to: ['ms', 'par', 'X'], area: [100, EQY - 50, 360, EQY + 40], busy: 0.1,
          then(g) { S.sloped = true; M.show(g, 1.4 * T); hop(g, 'wow'); g.sfx('swoosh'); S.point = true;
            M.circle(g, 'mt', { dur: 0.4 * T, col: GOLD }); S.mv = M.num(m, 'mv', { alpha: 0 });
            M.fly(g, { node: M.num(m, null, { col: INK }), from: 'mt', to: 'ms', delay: 0.1 * T, dur: 0.4 * T, arc: -50, s0: 30, s1: EQS,
              then(g) { S.R[0] = S.mv; S.mv.alpha = 1; S.mv._born = -1; S.mv.pop = g.t; S.blank.delete('ms'); S.relay(); M.sparkle(g, 'mv', { n: 7 }); g.sfx('pop'); hop(g); } });
            // the slope acted out on the graph: one step across, m steps up, then the line runs through the point
            S.stairAt = g.t + 0.45 * T; S.lineAt = g.t + 0.95 * T;
            M.at(g, [[0.5 * T, g => g.sfx('tap')], [0.95 * T, g => { g.sfx('sweep'); hop(g, 'laugh'); }], [1.4 * T, g => { S.point = false; }]]); } });
        if (S.placed && S.sloped) {
          const both = () => S.dist && S.moved;
          if (!S.dist) out.push({ tap: ['mv', 'par', 'X', 'xv'], busy: 0.1, askAt: 0.85 * T, after: 0.75 * T + (S.moved ? combineLen + 0.2 * T : 0),
            ask: { v: -m * x1, wrong: [m * x1, -m - x1, m - x1, -x1] },
            then(g) { S.dist = true; M.show(g, 0.85 * T); hop(g, 'think'); S.point = true;
              M.circle(g, ['mv', 'par'], { dur: 0.45 * T, col: GOLD }); M.light(g, S.mv, { col: GOLD });
              M.arrow(g, 'mv', 'X', { delay: 0.15 * T, dur: 0.35 * T, bend: -26, col: GOLD, linger: 0.5 * T });
              M.arrow(g, 'mv', 'xv', { delay: 0.35 * T, dur: 0.4 * T, bend: -40, col: GOLD, linger: 0.4 * T });
              S.dq = M.num(-m * x1, 'dq', { alpha: 0 }); S.dnote = M.row(M.num(m), M.op('·'), M.paren(M.num(-x1)), M.op('='), S.dq); S.dnote.id = 'dn';
              const pb = M.box(g, 'par'); M.place(g, 'dn', S.dnote, Math.max(110, Math.min(250, pb.x)), EQY - 52, 26, { col: CHALKN }); M.writeIn(g, S.dnote, { delay: 0.35 * T, dur: 0.4 * T }); S.dnote.alpha = 0; M.tween(g, S.dnote, { alpha: 1 }, 0.12 * T, { delay: 0.3 * T }); M.inert(g, ['dn']); },
            resolve(g) { M.show(g, 0.75 * T + (S.moved ? combineLen + 0.2 * T : 0)); S.dq.alpha = 1; M.writeIn(g, S.dq, { dur: 0.2 * T }); M.indicate(g, S.dq, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding');
              M.at(g, [[0.4 * T, g => { // the bracket opens: m(x − x₁) becomes mx − m·x₁, the product flying down from the note
                const from = { ...M.box(g, 'dq') }; M.unlight(g, S.mv);
                S.mx = M.row(S.mv, S.X); S.mx.id = 'mxr'; S.cs = M.op(sg(-m * x1), 'cs'); S.cv = M.num(Math.abs(m * x1), 'cv', { alpha: 0 }); S.R = [S.mx, S.cs, S.cv, ...(S.moved ? [S.pl, S.yv] : [])]; S.relay(); S.inert2(); g.sfx('swoosh');
                M.fly(g, { node: M.num(Math.abs(m * x1), null, { col: CHALKN }), from: [from.x, from.y], to: 'cv', dur: 0.3 * T, arc: 20, s0: 26, s1: EQS, then(g) { S.cv.alpha = 1; S.cv.pop = g.t; M.sparkle(g, 'cv', { n: 6 }); hop(g); } });
                M.tween(g, S.dnote, { alpha: 0 }, 0.25 * T, { delay: 0.1 * T }); }],
                [0.75 * T, g => { if (!both()) S.point = false; }]]);
              if (S.moved) combine(g, 0.85 * T); } });
          if (!S.moved) out.push({ drag: ['yv', 'lm'], to: S.dist ? ['cv', 'mxr', 'cs'] : ['par', 'mv'], area: [192, EQY - 60, 360, EQY + 40], busy: 0.1,
            ...(S.dist ? { askAt: 0.95 * T, after: combineLen + 0.1 * T, ask: { v: b, wrong: [-m * x1 - y1, -b, b + 1, m * x1 + y1] }, resolve(g) { M.show(g, combineLen + 0.1 * T); combine(g, 0.02); } } : {}),
            then(g) { S.moved = true; M.show(g, 0.95 * T); hop(g, 'wow'); S.point = true;
              const from = M.unionBox([M.box(g, 'lm'), M.box(g, 'yv')]); M.circle(g, ['lm', 'yv'], { dur: 0.35 * T, col: GOLD });
              S.pl = M.op('+', 'pl', { alpha: 0 }); const yv = S.yv;
              M.at(g, [[0.25 * T, g => { // the − 5 hops over the = sign and lands as + 5
                S.L = [S.Y]; S.R = [...S.R, S.pl, yv]; yv.id = 'yv2'; S.relay(); S.inert2(); yv.alpha = 0; M.inert(g, ['yv2']);
                const to = M.unionBox([M.box(g, 'pl'), M.box(g, 'yv2')]), hop2 = M.row(M.op('-'), M.num(y1));
                M.anim(g, { dur: 0.45 * T, draw(c, g, k) { const e = M.easeIO(k), x = M.lerp(from.x, to.x, e), y = M.lerp(from.y, to.y, e) - Math.sin(e * Math.PI) * 70;
                  if (e > 0.5) hop2.items[0].v = '+'; const ms = M.lay(hop2, EQS); c.shadowColor = 'rgba(255,190,60,0.9)'; c.shadowBlur = 12; M.draw(c, hop2, x - ms.w / 2, y + (ms.a - ms.d) / 2, EQS, { t: g.t, col: INK }); } });
                g.sfx('swoosh');
                S.znote = M.row(M.op('-'), M.num(y1), M.op('+'), M.num(y1), M.op('='), M.num(0)); S.znote.id = 'zn'; M.place(g, 'zn', S.znote, Math.max(70, from.x - 30), EQY + 46, 22, { col: CHALKN }); M.writeIn(g, S.znote, { delay: 0.1 * T, dur: 0.35 * T }); S.znote.alpha = 0; M.tween(g, S.znote, { alpha: 1 }, 0.12 * T, { delay: 0.1 * T }); M.inert(g, ['zn']); }],
                [0.7 * T, g => { S.pl.alpha = 1; yv.alpha = 1; S.pl.pop = g.t; yv.pop = g.t; M.sparkle(g, 'yv2', { n: 7 }); g.sfx('pop'); hop(g); M.strike(g, S.znote, { dur: 0.2 * T }); }],
                [0.95 * T, g => { M.tween(g, S.znote, { alpha: 0 }, 0.2 * T); if (!S.dist) S.point = false; }]]);
              if (!S.dist) S.yv = yv; } });
        }
        return out;
      },
      area(g) { if (!S.placed) return ['pt']; if (!S.sloped) return ['mt']; if (!S.dist) return ['mv', 'par']; return ['yv', 'lm']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), { m, x1, y1, b } = S, G = S.G, u = S.u, E = S.ext;
    c.drawImage(g.bake('ps_alpine', alpine), 0, 0, 360, 640);
    // clouds drift past the peaks
    for (let i = 0; i < 2; i++) P.cloud(c, ((t * (5 + i * 3) + i * 190) % 480) - 60, 120 + i * 46, 0.45 + i * 0.1, '#ffffff', '#d8e8f6', 0.85);
    // the trail board: posts, a wooden frame, graph paper
    c.save(); c.fillStyle = '#6a4424'; c.fillRect(40, 400, 10, 40); c.fillRect(310, 400, 10, 40);
    c.fillStyle = 'rgba(30,40,20,0.25)'; c.beginPath(); c.roundRect(18, 186, 330, 224, 12); c.fill();
    c.fillStyle = '#a8703f'; c.beginPath(); c.roundRect(14, 180, 332, 222, 12); c.fill();
    c.fillStyle = '#fffcf2'; c.beginPath(); c.roundRect(24, 190, 312, 202, 6); c.fill();
    // the grid, axes and a few labels
    c.save(); c.beginPath(); c.rect(24, 190, 252, 202); c.clip();
    c.strokeStyle = 'rgba(80,140,200,0.25)'; c.lineWidth = 1;
    for (let x = Math.ceil(E.xmin - 1); x <= E.xmax + 1; x++) { const [px] = G(x, 0); c.beginPath(); c.moveTo(px, 190); c.lineTo(px, 392); c.stroke(); }
    for (let y = Math.ceil(E.ymin - 2); y <= E.ymax + 2; y++) { const [, py] = G(0, y); c.beginPath(); c.moveTo(24, py); c.lineTo(276, py); c.stroke(); }
    const [ax, ay] = G(0, 0); c.strokeStyle = '#4a4060'; c.lineWidth = 2; c.beginPath(); c.moveTo(24, ay); c.lineTo(276, ay); c.moveTo(ax, 190); c.lineTo(ax, 392); c.stroke();
    c.fillStyle = '#6a6080'; c.font = M.NUMF(12, 600); c.textAlign = 'center'; c.fillText('x', 268, ay - 6); c.fillText('y', ax + 10, 202);
    // dashed drop lines from the point to both axes when it is placed
    const [px, py] = G(x1, y1);
    if (S.dropAt != null && t > S.dropAt) { const k = M.easeIO((t - S.dropAt) / (0.35 * T)), fade = M.clamp(1.4 - (t - S.dropAt) / (1.2 * T), 0.35, 1);
      c.globalAlpha = fade; c.setLineDash([5, 5]); c.strokeStyle = BLANK; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(px, M.lerp(py, ay, k)); c.moveTo(px, py); c.lineTo(M.lerp(px, ax, k), py); c.stroke(); c.setLineDash([]);
      c.fillStyle = BLANK; c.font = M.NUMF(15, 700); if (k > 0.8) { c.fillText(x1, px, ay + 15); c.textAlign = 'right'; c.fillText(y1, ax - 5, py + 5); c.textAlign = 'center'; } c.globalAlpha = 1; }
    // the slope staircase: 1 across, m up (or down), then the line through the point
    if (S.stairAt != null && t > S.stairAt) { const k1 = M.easeIO((t - S.stairAt) / (0.22 * T)), k2 = M.easeIO((t - S.stairAt - 0.22 * T) / (0.25 * T)), [fx, fy] = G(x1 + 1, y1 + m), fwd = fy > GY0 + 8 && fy < GY1 - 8, sx = fwd ? x1 : x1 - 1, sy = fwd ? y1 : y1 - m, [px, py] = G(sx, sy), [qx, qy] = G(sx + 1, sy), [rx, ry] = G(sx + 1, sy + m);
      const fade = S.lineAt && t > S.lineAt + 0.6 * T ? M.clamp(1 - (t - S.lineAt - 0.6 * T) / (0.4 * T), 0.45, 1) : 1;
      c.globalAlpha = fade; c.strokeStyle = '#2f9a5a'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(px, py); c.lineTo(M.lerp(px, qx, k1), py); if (k2 > 0) c.lineTo(qx, M.lerp(qy, ry, k2)); c.stroke();
      c.fillStyle = '#2f9a5a'; c.font = M.NUMF(15, 700); if (k1 >= 1) c.fillText('1', (px + qx) / 2, py + (m > 0 ? 15 : -7)); if (k2 > 0.6) { c.textAlign = 'left'; c.fillText((m > 0 ? '+' : '−') + Math.abs(m), qx + 5, (qy + ry) / 2 + 5); c.textAlign = 'center'; } c.globalAlpha = 1; }
    if (S.lineAt != null && t > S.lineAt) { const k = M.easeIO((t - S.lineAt) / (0.45 * T)), d = 12 * k;
      const a = G(x1 - d, y1 - m * d), z = G(x1 + d, y1 + m * d); c.strokeStyle = LINE; c.lineWidth = 3.5; c.lineCap = 'round'; c.shadowColor = 'rgba(42,122,216,0.5)'; c.shadowBlur = 6; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(z[0], z[1]); c.stroke(); c.shadowBlur = 0; }
    // the y-intercept lights up at the end
    if (S.icptAt != null && t > S.icptAt) { const k = M.clamp((t - S.icptAt) / 0.3, 0, 1), [bx, by] = G(0, b), pulse = 1 + 0.25 * Math.sin((t - S.icptAt) * 6);
      c.fillStyle = 'rgba(255,178,31,0.35)'; c.beginPath(); c.arc(bx, by, 12 * k * pulse, 0, 7); c.fill(); c.fillStyle = GOLD; c.strokeStyle = '#8a4a10'; c.lineWidth = 2; c.beginPath(); c.arc(bx, by, 6 * M.ease(k), 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#8a4a10'; c.font = M.NUMF(16, 700); c.textAlign = 'right'; c.fillText(String(b).replace('-', '−'), bx - 9, by + (b > 0 ? -6 : 16)); }
    // the point
    const pk = 1 + 0.12 * Math.sin(t * 4); c.fillStyle = '#e0483a'; c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.arc(px, py, 6.5 * pk, 0, 7); c.fill(); c.stroke();
    c.restore();
    // a strip of the board for the slope tag
    c.fillStyle = 'rgba(122,74,40,0.15)'; c.fillRect(276, 190, 60, 202); c.restore();
    const pb = M.box(g, 'pt'); if (pb) { c.save(); c.fillStyle = 'rgba(255,252,242,0.92)'; c.strokeStyle = 'rgba(224,72,58,0.6)'; c.lineWidth = 2; c.beginPath(); c.roundRect(pb.x - pb.w / 2 - 6, pb.y - pb.h / 2 - 4, pb.w + 12, pb.h + 8, 8); c.fill(); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'lab');
    // the slope tag hangs on a string at the right of the board
    const tb = M.box(g, 'tm'), mb = M.box(g, 'mt'); if (tb && mb) { const x0 = tb.x - tb.w / 2 - 8, x1b = mb.x + mb.w / 2 + 8, sw = Math.sin(t * 1.6) * 1.5; c.save(); c.translate(0, sw);
      c.strokeStyle = '#7a5a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo((x0 + x1b) / 2, 196); c.lineTo((x0 + x1b) / 2, 222); c.stroke();
      c.fillStyle = 'rgba(40,30,10,0.25)'; c.beginPath(); c.roundRect(x0 + 2, 226, x1b - x0, 34, 8); c.fill(); c.fillStyle = '#fff2c8'; c.strokeStyle = '#c89a4a'; c.lineWidth = 2; c.beginPath(); c.roundRect(x0, 222, x1b - x0, 34, 8); c.fill(); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'tag');
    // the sign with the equation, and dashed lines under the blanks
    c.save(); c.fillStyle = '#6a4424'; c.fillRect(174, 500, 12, 40); c.fillStyle = 'rgba(30,20,10,0.3)'; c.beginPath(); c.roundRect(14, 436, 336, 68, 12); c.fill();
    const wg = c.createLinearGradient(0, 430, 0, 498); wg.addColorStop(0, '#fff6e2'); wg.addColorStop(1, '#efdcb6'); c.fillStyle = wg; c.beginPath(); c.roundRect(10, 430, 340, 68, 12); c.fill(); c.strokeStyle = '#8a6a3a'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = BLANK; c.lineWidth = 2; c.setLineDash([4, 4]); for (const id of S.blank) { const bb = M.box(g, id); if (bb) { c.beginPath(); c.moveTo(bb.x - bb.w / 2, bb.y + bb.h / 2 + 4); c.lineTo(bb.x + bb.w / 2, bb.y + bb.h / 2 + 4); c.stroke(); } } c.restore();
    M.drawEx(g, c, 'eq');
    for (const k of ['dn', 'zn', 'cn']) { const nd = { dn: S.dnote, zn: S.znote, cn: S.cnote }[k]; if (!nd || (nd.alpha ?? 1) < 0.02) continue; const bb = M.box(g, k);
      if (bb) { c.save(); c.globalAlpha = nd.alpha ?? 1; c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.roundRect(bb.x - bb.w / 2 - 8, bb.y - bb.h / 2 - 5, bb.w + 16, bb.h + 10, 9); c.fill(); c.restore(); } M.drawEx(g, c, k); }
    // the hedgehog guide points at the board while the work is shown; a goat watches from the meadow
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    P.goat(c, 300 + Math.sin(t * 0.7) * 3, 600, 1.5, { facing: -1 });
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', 66, 612 - hopK * 22, 1.3, { t, pose, expr }); else SCN.host(g, c, 'hedgehog', 66, 612, 1.3); } catch (e) { SCN.host(g, c, 'hedgehog', 66, 612, 1.3); }
    M.drawUI(g, c);
  },
});
