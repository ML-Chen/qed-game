// limits_squeeze.js — SQUEEZE! The squeeze theorem: if g(x) ≤ f(x) ≤ h(x) and g and h both go to the same limit L,
// then f goes to L too. Here f(x) = x² sin(1/x), which wiggles faster and faster near 0 and has no limit by plugging in.
// A coral reef: the graph sits in a dark water window; two coral walls (the bounds) hem in a glowing eel (the curve).
// One expression, changed in place: −1 ≤ sin(1/x) ≤ 1. Moves (each acts its working out by itself):
//   1. Drag the x² shell onto the inequality: "x² ≥ 0" is noted (so the ≤ signs stay), then x² flies into each of the
//      three parts in turn: −1 becomes −x², sin(1/x) becomes x² sin(1/x), 1 becomes x²; on the graph the flat walls
//      bend into the parabolas ±x² and the eel's wiggle shrinks to fit between them.
//   2–3. Drag the "lim x→0" starfish onto each outer bound (either order): lim writes itself in front, a 0 flies from
//      x→0 into the x, "−0² = 0" is noted and the bound turns into 0; that wall's tip lights up at the origin.
//   4. Drag the starfish onto the middle (only once both bounds are 0: before that it is the classic mistake, since
//      sin(1/x) alone has no limit): lim writes itself, the two 0s close in on it, the graph zooms in toward 0 (the walls
//      keep pinching the eel, however close you look), and the line becomes lim x→0 x² sin(1/x) = 0.
// Level 0: x² sin(1/x). Level 1: x² cos(1/x) or x⁴ sin(1/x). Level 2: 2x² sin(1/x), 3x² cos(1/x), x⁴ cos(1/x).
// Medium mode: the final limit comes from the tray (wrong: does not exist, 1, −1).
const M = MK, INK = '#2a1a10', CORAL = '#ff7a5a', EEL = '#5ef0ff', GOLD = '#ffb21f';
const L1Y = 222, CY = 284, NY = 334, GX0 = 30, GX1 = 330, GT = 372, GB = 556, OX = 296, OY = 616;
const POOL = [[{ c: 1, p: 2, fn: 'sin' }], [{ c: 1, p: 2, fn: 'cos' }, { c: 1, p: 4, fn: 'sin' }], [{ c: 2, p: 2, fn: 'sin' }, { c: 3, p: 2, fn: 'cos' }, { c: 1, p: 4, fn: 'cos' }]];
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])].filter(Boolean);
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); kids(q).forEach(walk); })(n); return out; };
const born = n => { if (!n) return n; n._born = -1; kids(n).forEach(born); return n; };
function fitAsk(g) { // tray tiles grow to fit their text at a readable size
  const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; const gap = 8, ws = A.list.map(ch => M.lay(ch.node, 28).w + 22), tws = ws.map(w => Math.max(74, w));
  const tot = tws.reduce((p, q) => p + q, 0) + gap * (tws.length - 1), k = Math.min(1, 344 / tot); let x = 180 - tot * k / 2;
  A.list.forEach((ch, i) => { ch.w = tws[i] * k; ch.x = x + ch.w / 2; x += ch.w + gap * k; ch.s = Math.min(34, 34 * (ch.w - 14) / M.lay(ch.node, 34).w); M.lay(ch.node, ch.s); }); }
function lbl(c, s, x, y, size, col, out = 'rgba(10,20,40,0.85)') { c.save(); c.font = M.NUMF(size, 700); c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = 4; c.strokeStyle = out; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y); c.restore(); }

// ---------------- the scene: a sunlit coral reef ----------------
function scene(c, W, H) {
  const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#5ad0e0'); gr.addColorStop(0.45, '#1e8ab0'); gr.addColorStop(1, '#0c3a6a'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 30 + i * 62; const g2 = c.createLinearGradient(x, 0, x + 40, 520); g2.addColorStop(0, 'rgba(220,255,255,0.18)'); g2.addColorStop(1, 'rgba(220,255,255,0)'); c.fillStyle = g2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 18, 0); c.lineTo(x + 70, 520); c.lineTo(x + 34, 520); c.fill(); } c.restore();
  // the sandy floor with corals
  c.fillStyle = '#e8c890'; c.beginPath(); c.moveTo(0, 590); for (let x = 0; x <= W; x += 20) c.lineTo(x, 584 + Math.sin(x * 0.05) * 5); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  const coral = (x, y, s, col) => { c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 6 * s; const br = (x0, y0, a, l, d) => { if (d > 3) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); br(x1, y1, a - 0.45, l * 0.72, d + 1); br(x1, y1, a + 0.4, l * 0.7, d + 1); }; br(x, y, -Math.PI / 2, 26 * s, 0); };
  coral(30, 600, 1.1, '#ff6a8a'); coral(110, 606, 0.8, '#ffa04a'); coral(200, 602, 0.9, '#c86aff'); coral(250, 608, 0.7, '#ff6a8a');
  c.fillStyle = '#7a4a8a'; for (const [x, y] of [[70, 612], [160, 618], [236, 620]]) { c.beginPath(); c.ellipse(x, y, 14, 8, 0, 0, 7); c.fill(); }
}
// the eel and walls: f(x) between −h(x) and h(x), with h morphing from 1 (k = 0) to c·xᵖ (k = 1)
const H = (S, x, k) => M.lerp(1, S.c * Math.pow(Math.abs(x), S.p), k);

MG.add({
  id: 'squeeze', stage: 'limits', cmd: 'SQUEEZE!', hint: 'drag', time: 10, mood: 'sea', winText: 'Squeezed!', hold: 1.8,
  card: {
    title: 'The squeeze theorem', ref: 'Calculus', kind: 'Calculus',
    text: 'Near 0, sin(1/x) wiggles up and down faster and faster, so it has no limit. But x² sin(1/x) does.\n\nThe trick: sin is always between −1 and 1. Multiply all three parts by x², which is never negative, so the ≤ signs stay the same: −x² ≤ x² sin(1/x) ≤ x².\n\nAs x goes to 0, both −x² and x² go to 0. The middle is trapped between them, so it is squeezed to 0 too: lim x→0 of x² sin(1/x) = 0.',
    note: 'If g(x) ≤ f(x) ≤ h(x) near a, and g and h both have limit L at a, then f has limit L there too.',
    ask: 'What is lim x→0 of x⁴ cos(1/x)? Why can\'t you just plug in x = 0?',
  },

  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g), list = POOL[g.level], P = list[Math.floor(g.rand() * list.length)]; Object.assign(S, P);
    const mono = (id, x) => { const r = M.row(S.c > 1 ? M.num(S.c) : null, M.sup(x || M.vr('x'), M.num(S.p))); if (id) r.id = id; return r; };
    S.mono = mono;
    // the one expression: −1 ≤ sin(1/x) ≤ 1, with each part in its own row so it can change in place
    S.fnT = M.txt(S.fn, 'fn'); S.arg = M.paren(M.frac(M.num(1), M.vr('x')), 'arg');
    S.pL = M.row(M.op('-', 'mL'), M.num(1, 'aL')); S.pL.id = 'pL';
    S.pM = M.row(S.fnT, S.arg); S.pM.id = 'pM';
    S.pR = M.row(M.num(1, 'aR')); S.pR.id = 'pR';
    S.le1 = M.op('≤', 'le1'); S.le2 = M.op('≤', 'le2');
    S.ex = M.row(S.pL, S.le1, S.pM, S.le2, S.pR);
    // its size: the widest moment is "lim (−x²) ≤ x² sin(1/x) ≤ x²"
    { const w = M.lay(M.row(M.txt('lim'), M.gap(8), M.paren(M.row(M.op('-'), mono())), M.op('≤'), mono(), M.txt(S.fn), M.paren(M.frac(M.num(1), M.vr('x'))), M.op('≤'), mono()), 34).w; S.ls = Math.min(34, 34 * 326 / w); }
    // the two chips on a coral ledge: the shell holding x², and the starfish holding lim x→0
    S.mx = mono('mx'); S.lc = M.txt('lim', 'lc');
    const relay = () => { M.place(g, 'ex', S.ex, 180, L1Y, S.ls, { col: INK }); if (!S.mult) M.place(g, 'mx', S.mx, 96, CY + 8, 30, { col: '#fff6e8' }); else delete g.s.mk.ex.mx; if (!S.solved) M.place(g, 'lc', S.lc, 262, CY + 2, 30, { col: '#fff6e8' }); else delete g.s.mk.ex.lc; };
    S.relay = relay; relay(); M.inert(g, ['le1', 'le2', 'eqF', 'mL']);
    S.k = 0; S.morph = null; S.zoom = { from: 1, to: 1, t0: 0, dur: 1 }; S.tips = []; S.face = 'happy'; S.faceT = -9;
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const allIds = () => idsIn(S.ex).filter(i => !/^(le1|le2|mL)$/.test(i));

    // a lim x→0 in front of a part: the word, with its x→0 drawn underneath (draw)
    const limNode = id => M.txt('lim', id, { _born: -1 });
    const bound = side => ({ drag: 'lc', to: side === 'L' ? idsIn(S.pL) : idsIn(S.pR), reach: 50, busy: 0.1,
      then(g) { const L0 = side === 'L', part = L0 ? S.pL : S.pR; S['lim' + side] = true; M.show(g, 2.2 * T); S.point = true; react(g, 'think');
        const lm = limNode('lm' + side), body = part.items.slice(); part.items = [lm, M.gap(6), ...body]; relay(); M.writeIn(g, lm, { dur: 0.4 * T }); S.subs = S.subs || {}; S.subs['lm' + side] = g.t;
        M.circle(g, part, { dur: 0.5 * T, col: GOLD, pad: 5 }); g.sfx('swoosh');
        // a 0 flies from x→0 into the x
        M.at(g, [[0.6 * T, g => { const lb = M.box(g, 'lm' + side); if (!lb) return;
          M.fly(g, { node: M.num(0, null, { col: GOLD }), from: [lb.x + 10, lb.y + lb.h / 2 + 12], to: 'x' + side, dur: 0.5 * T, arc: -30, s0: 18, s1: S.ls, col: GOLD,
            then(g) { const sp = part.items[part.items.length - 1].items.slice(-1)[0]; sp.base = M.num(0, 'z' + side, { col: GOLD, _born: -1, pop: g.t }); relay(); g.sfx('pop'); M.sparkle(g, 'z' + side, { n: 6 }); } }); }],
          [1.25 * T, g => { const nd = M.row(L0 ? M.op('-') : null, S.c > 1 ? [M.num(S.c), M.op('·')] : null, M.sup(M.num(0), M.num(S.p)), M.op('='), M.num(0)); const pb = M.box(g, part.id);
            M.note(g, { node: nd, at: [pb ? pb.x : 180, NY], s: 30, col: '#ffe9a0', write: 0.35 * T, hold: 0.6 * T, fade: 0.25 * T, pill: 'rgba(10,30,60,0.85)' }); }],
          [2.0 * T, g => { const z = M.num(0, 'b' + side, { pop: g.t }); part.items = [z]; relay(); g.sfx('ding'); react(g, 'happy'); S.tips.push({ side, t0: g.t }); M.sparkle(g, z, { n: 8 }); }],
          [2.2 * T, g => { S.point = false; }]]); } });

    M.play(g, {
      moves(g) {
        // 1. multiply every part by x² (x² ≥ 0, so the ≤ signs stay)
        if (!S.mult) return [{ drag: 'mx', to: ['pM', ...allIds()], area: [10, L1Y - 40, 350, L1Y + 30], busy: 0.1,
          then(g) { S.mult = true; M.show(g, 3.3 * T); S.point = true; react(g, 'think'); const from = { ...M.box(g, 'mx') }; relay(); g.sfx('swoosh');
            M.note(g, { node: M.row(mono(), M.op('≥'), M.num(0)), at: [from.x, NY], s: 30, col: '#ffe9a0', write: 0.35 * T, hold: 0.7 * T, fade: 0.25 * T, pill: 'rgba(10,30,60,0.85)' });
            const hop = (k, part, t, land) => M.at(g, [[t * T, g => { const tb = M.box(g, part.id); M.fly(g, { node: mono(), from: [from.x, from.y], to: [tb.x, tb.y], dur: 0.5 * T, arc: -50, s0: 30, s1: S.ls, col: GOLD,
              then(g) { land(g); relay(); g.sfx('pop'); M.sparkle(g, part, { n: 8 }); react(g, k ? 'happy' : 'wow'); S.morph = { which: k, t0: g.t, dur: 0.6 * T }; } }); }]]);
            hop(0, S.pL, 1.3, g => { S.pL.items = [S.pL.items[0], born(mono('aL2', M.vr('x', 'xL')))]; });
            hop(1, S.pM, 1.9, g => { S.pM.items = [born(mono('cM')), M.gap(4), S.fnT, S.arg]; });
            hop(2, S.pR, 2.5, g => { S.pR.items = [born(mono('aR2', M.vr('x', 'xR')))]; });
            M.at(g, [[3.2 * T, g => { S.point = false; }]]); } }];
        // 2–3. the limit of each outer bound
        if (!S.limL || !S.limR) { const out = []; if (!S.limL) out.push(bound('L')); if (!S.limR) out.push(bound('R')); return out; }
        // 4. the middle is squeezed between two 0s
        if (!S.solved) return [{ drag: 'lc', to: ['pM', ...idsIn(S.pM)], reach: 40, busy: 0.1, askAt: 2.6 * T, after: 1.4 * T, ask: { v: M.num(0), wrong: [M.txt('no limit'), M.num(1), M.num(-1)] },
          then(g) { S.solved = true; M.show(g, 2.6 * T); S.point = true; react(g, 'think'); relay();
            const lm = limNode('lmM'); S.pM.items = [lm, M.gap(6), ...S.pM.items]; relay(); M.writeIn(g, lm, { dur: 0.4 * T }); S.subs = S.subs || {}; S.subs.lmM = g.t; g.sfx('swoosh');
            M.circle(g, S.pM, { dur: 0.6 * T, col: EEL, pad: 5 });
            // the two 0s close in on the middle while the graph zooms in toward 0: the walls pinch the eel at every scale
            M.at(g, [[0.6 * T, g => { M.indicate(g, 'bL', { col: GOLD }); M.indicate(g, 'bR', { col: GOLD, delay: 0.2 * T }); M.light(g, S.le1, { col: GOLD }); M.light(g, S.le2, { col: GOLD }); }],
              [1.0 * T, g => { for (const [q, d] of [[S.pL, 1], [S.le1, 1], [S.pR, -1], [S.le2, -1]]) M.tween(g, q, { dx: d * 10 }, 0.5 * T, { yoyo: true }); S.zoom = { from: 1, to: 3, t0: g.t, dur: 1.4 * T }; g.sfx('sparkle'); react(g, 'wow'); }],
              [1.6 * T, g => { for (const [q, d] of [[S.pL, 1], [S.le1, 1], [S.pR, -1], [S.le2, -1]]) M.tween(g, q, { dx: d * 10 }, 0.5 * T, { yoyo: true }); }]]); },
          resolve(g) { M.show(g, 1.4 * T); M.unlight(g, S.le1); M.unlight(g, S.le2);
            // 0 ≤ lim … ≤ 0 becomes lim … = 0: the left 0 ≤ leaves, the right ≤ turns into =
            M.tween(g, S.pL, { alpha: 0 }, 0.3 * T); M.tween(g, S.le1, { alpha: 0 }, 0.3 * T); for (const q of kids(S.pL)) M.tween(g, q, { alpha: 0 }, 0.3 * T);
            M.at(g, [[0.4 * T, g => { S.eq = M.op('=', 'eqF', { _born: -1, pop: g.t }); S.ex.items = [S.pM, S.eq, S.pR]; relay(); g.sfx('coin'); react(g, 'laugh'); M.sparkle(g, 'bR', { n: 12 }); M.indicate(g, 'bR', { col: GOLD, dur: 0.5 * T }); }],
              [1.3 * T, g => { S.point = false; }]]); } }];
        return [];
      },
      area(g) { return !S.mult ? ['mx', 'pM'] : !S.limL || !S.limR ? ['lc', !S.limL ? 'pL' : 'pR'] : ['lc', 'pM']; },
    });
    M.onMiss(g, (g, info) => { if (info.drag === 'lc' && info.to && idsIn(S.pM).concat('pM').includes(info.to)) S.wild = g.t; }); // sin(1/x) alone has no limit: the eel thrashes
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('squeeze_scene', scene), 0, 0, 360, 640);
    // rising bubbles
    c.save(); c.strokeStyle = 'rgba(230,255,255,0.6)'; c.lineWidth = 1.5; for (let i = 0; i < 10; i++) { const x = (i * 47 + Math.sin(t + i) * 8) % 360, y = 640 - ((t * 30 + i * 67) % 660); c.beginPath(); c.arc(x, y, 2 + i % 3, 0, 7); c.stroke(); } c.restore();
    // the sand panel behind the expression, with the chips on a ledge below it
    c.save(); c.fillStyle = 'rgba(255,244,220,0.93)'; c.beginPath(); c.roundRect(10, 178, 340, 70, 18); c.fill(); c.strokeStyle = 'rgba(120,70,40,0.4)'; c.lineWidth = 2; c.stroke(); c.restore();
    const shell = (key, id, col) => { const b = S.mk.ex[key] && M.box(g, id); if (!b) return; c.save(); c.fillStyle = col; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(b.x - b.w / 2 - 14, b.y - b.h / 2 - 9, b.w + 28, b.h + 26, 14); c.fill(); c.stroke(); c.restore(); };
    shell('mx', 'mx', '#c8506a'); shell('lc', 'lc', '#d8702a');
    M.drawEx(g, c, 'mx'); M.drawEx(g, c, 'lc');
    { const b = S.mk.ex.lc && M.box(g, 'lc'); if (b) lbl(c, 'x→0', b.x, b.y + b.h / 2 + 15, 18, '#fff6e8'); }
    // the graph window
    const k = S.morph ? M.clamp((t - S.morph.t0) / S.morph.dur, 0, 1) : 0, stage = S.morph ? S.morph.which : -1;
    const kL = stage > 0 ? 1 : stage === 0 ? M.easeIO(k) : 0, kM = stage > 1 ? 1 : stage === 1 ? M.easeIO(k) : 0, kR = stage === 2 ? M.easeIO(k) : stage > 2 ? 1 : 0;
    const zk = M.easeIO((t - S.zoom.t0) / S.zoom.dur), Z = M.lerp(S.zoom.from, S.zoom.to, zk);
    const xr = 0.9 / Z, yr = Math.max(1.3, S.c * Math.pow(0.9, S.p) * 1.35) / Math.pow(Z, S.p);
    const X = x => (GX0 + GX1) / 2 + x / xr * (GX1 - GX0) / 2, Y = y => (GT + GB) / 2 - y / yr * (GB - GT) / 2;
    c.save(); c.fillStyle = 'rgba(6,24,52,0.85)'; c.beginPath(); c.roundRect(GX0 - 14, GT - 14, GX1 - GX0 + 28, GB - GT + 28, 18); c.fill(); c.strokeStyle = 'rgba(160,230,255,0.4)'; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.roundRect(GX0 - 12, GT - 12, GX1 - GX0 + 24, GB - GT + 24, 16); c.clip();
    c.strokeStyle = 'rgba(180,230,255,0.35)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(GX0 - 12, Y(0)); c.lineTo(GX1 + 12, Y(0)); c.moveTo(X(0), GT - 12); c.lineTo(X(0), GB + 12); c.stroke();
    // the coral walls: the top one fills above y = h(x), the bottom one below y = −h(x)
    const N = 160, xs = [...Array(N + 1)].map((_, i) => -xr * 1.1 + 2.2 * xr * i / N);
    for (const [sg, kk] of [[1, kR], [-1, kL]]) { // a coral ridge 18 px thick along y = ±h(x), with polyps on it
      const pts = xs.map(x => [X(x), Y(sg * H(S, x, kk))]); c.fillStyle = 'rgba(255,122,90,0.16)'; c.beginPath(); c.moveTo(pts[0][0], sg > 0 ? GT - 20 : GB + 20); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(pts[N][0], sg > 0 ? GT - 20 : GB + 20); c.closePath(); c.fill();
      const gr = c.createLinearGradient(0, GT, 0, GB); gr.addColorStop(0, sg > 0 ? '#ff8a6a' : '#c83a5a'); gr.addColorStop(1, sg > 0 ? '#c83a5a' : '#ff8a6a'); c.fillStyle = gr;
      c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); for (let i = N; i >= 0; i--) c.lineTo(pts[i][0], pts[i][1] - sg * 18); c.closePath(); c.fill();
      c.strokeStyle = '#ffe0c8'; c.lineWidth = 2.5; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
      c.fillStyle = '#ffd0e0'; for (let i = 4; i < N; i += 9) { c.beginPath(); c.arc(pts[i][0], pts[i][1] - sg * 10, 2.2, 0, 7); c.fill(); } }
    // the eel: (morphing) c·xᵖ·sin(1/x); after a wrong move it thrashes for a moment
    const wild = S.wild != null && t - S.wild < 0.8 ? Math.sin((t - S.wild) / 0.8 * Math.PI) : 0, f = x => (S.fn === 'sin' ? Math.sin(1 / x) : Math.cos(1 / x)) * H(S, x, kM) * (1 + wild * 0.6);
    c.strokeStyle = wild ? '#ff6a6a' : EEL; c.shadowColor = EEL; c.shadowBlur = 10; c.lineWidth = 2.5; c.lineJoin = 'round'; c.beginPath(); let on = false;
    for (let i = 0; i <= 1400; i++) { const x = -xr * 1.1 + 2.2 * xr * i / 1400; if (Math.abs(x) < 1e-4) { on = false; continue; } const y = Y(f(x)); on ? c.lineTo(X(x), y) : c.moveTo(X(x), y); on = true; } c.stroke(); c.shadowBlur = 0;
    // the walls' tips at the origin light up once their limit is 0
    for (const tp of S.tips) { const kk = M.ease((t - tp.t0) / 0.35); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 16; c.beginPath(); c.arc(X(0), Y(0), 7 * kk, 0, 7); c.fill(); c.shadowBlur = 0; }
    c.restore();
    lbl(c, '0', X(0) - 10, Math.min(GB + 6, Y(0) + 22), 18, '#ffffff');
    // the octopus watches, points while work is shown, and cheers
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', OX, OY - hopK * 16, 0.8, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'octopus', OX, OY, 0.8);
    M.drawEx(g, c, 'ex');
    // x→0 under each lim in the expression
    for (const id of ['lmL', 'lmR', 'lmM']) { const b = S.subs && S.subs[id] != null && M.box(g, id), n = M.node(g, id); if (!b || !n || n.alpha === 0) continue; const a = M.clamp((t - S.subs[id] - 0.2) / 0.3, 0, 1); c.save(); c.globalAlpha = a; lbl(c, 'x→0', b.x, b.y + b.h / 2 + 17, 18, INK, 'rgba(255,244,220,0.9)'); c.restore(); }
    fitAsk(g); M.drawUI(g, c);
  },
});
