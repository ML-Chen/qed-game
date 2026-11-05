// integrals_parts.js — BY PARTS! Integration by parts: ∫ u dv = uv − ∫ v du.
// An autumn afternoon in the woods: the problem is carved on a walnut sign, a fox holds a "d" token and a hedgehog an
// "∫" token. Moves (each acts its working out by itself; the tags under the problem are labels on its two factors):
//   1. Tap the factor to call u (the one that gets simpler when differentiated: x beside eˣ or cos x, but ln x beside x).
//      It is circled and "u = x" writes itself in a tag that points at it; the rest is circled and tagged "dv = eˣ dx".
//      Tapping the other factor is the classic wrong choice.
//   2–3. Drag the ∫ onto the dv tag and the d onto the u tag (either order). The ∫ lands in front: "v = ∫ eˣ dx", which
//      collapses to "v = eˣ". The d lands in front: "du = 1 dx" tidies to "du = dx" (or "du = 1/x dx").
//   4. Tap the problem: "= u v − ∫ v du" writes itself under it in faint letters, and each letter is replaced by the
//      real piece flying in from where it is on screen: u from the problem, v from its tag (twice), du from its tag.
//   5. Tap the new ∫: it is worked out one step at a time with one reason note each ("(−cos x)′ = sin x",
//      "x²/2 · 1/x = x/2"), or, for eˣ, v itself flies in again; then "+ C" flies in from the hedgehog.
// Level 0: ∫ x eˣ dx. Level 1: ∫ x cos x dx or ∫ x eˣ dx. Level 2: ∫ x ln x dx (u = ln x) or ∫ x cos x dx.
// Medium mode: v is picked from the tray.
const M = MK, INK = '#fff3dc', GOLD = '#ffc23a', BLUE = '#8ad0ff', NOTEC = '#ffe7a0', FAINT = 'rgba(255,243,220,0.38)';
const L1Y = 226, TY = 290, L2Y = 360, NY = 408, FXX = 66, HGX = 296, AY = 610;
const ex = () => M.sup(M.vr('e'), M.vr('x'));
const fnx = (f, id) => { const r = M.row(M.txt(f), M.gap(5), M.vr('x')); if (id) r.id = id; return r; };
const dx = () => M.row(M.txt('d'), M.vr('x'));
const INTG = (id, w = 20) => ({ ...M.gap(w), id, isInt: true });
const half = (n, d) => M.frac(n, M.num(d));
const PROB = {
  ex: { A: () => M.vr('x', 'A'), B: () => { const n = ex(); n.id = 'B'; return n; }, u: 'A', uE: () => M.vr('x'), dvE: () => ex(), vE: () => ex(),
    du1: () => M.row(M.num(1), M.gap(6), dx()), du2: () => dx(), wrongV: () => [M.row(M.vr('x'), ex()), M.num(1), M.sup(M.vr('e'), M.row(M.vr('x'), M.op('+'), M.num(1)))],
    tail: [{ fromV: true, nodes: () => [M.op('-'), ex()] }] },
  cos: { A: () => M.vr('x', 'A'), B: () => fnx('cos', 'B'), u: 'A', uE: () => M.vr('x'), dvE: () => fnx('cos'), vE: () => fnx('sin'),
    du1: () => M.row(M.num(1), M.gap(6), dx()), du2: () => dx(), wrongV: () => [M.row(M.op('-'), fnx('sin')), M.row(M.op('-'), fnx('cos')), fnx('cos')],
    tail: [{ note: () => M.row(M.paren(M.row(M.op('-'), fnx('cos'))), M.txt('′'), M.op('='), fnx('sin')), nodes: () => [M.op('-'), M.paren(M.row(M.op('-'), fnx('cos')))] },
      { note: () => M.row(M.op('-'), M.paren(M.row(M.op('-'), fnx('cos'))), M.op('='), M.op('+'), fnx('cos')), nodes: () => [M.op('+'), fnx('cos')] }] },
  ln: { A: () => M.vr('x', 'A'), B: () => fnx('ln', 'B'), u: 'B', uE: () => fnx('ln'), dvE: () => M.vr('x'), vE: () => half(M.sup(M.vr('x'), M.num(2)), 2),
    du1: null, du2: () => M.row(M.frac(M.num(1), M.vr('x')), dx()), dot: true, wrongV: () => [M.sup(M.vr('x'), M.num(2)), M.num(1), M.row(M.num(2), M.vr('x'))],
    tail: [{ note: () => M.row(half(M.sup(M.vr('x'), M.num(2)), 2), M.op('·'), M.frac(M.num(1), M.vr('x')), M.op('='), half(M.vr('x'), 2)), nodes: () => [M.op('-'), INTG('iW2'), half(M.vr('x'), 2), dx()] },
      { note: () => M.row(M.paren(half(M.sup(M.vr('x'), M.num(2)), 4)), M.txt('′'), M.op('='), half(M.vr('x'), 2)), nodes: () => [M.op('-'), half(M.sup(M.vr('x'), M.num(2)), 4)] }] },
};
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])].filter(Boolean);
const idsIn = n => { const out = []; (function walk(q) { if (!q) return; if (q.id) out.push(q.id); kids(q).forEach(walk); })(n); return out; };
const tint = (n, col) => { if (!n) return n; n.col = col; kids(n).forEach(q => tint(q, col)); return n; };
const born = n => { if (!n) return n; n._born = -1; kids(n).forEach(born); return n; };
function fitAsk(g) { // tray tiles grow to fit an expression at a readable size
  const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; const gap = 8, ws = A.list.map(ch => M.lay(ch.node, 28).w + 22), tws = ws.map(w => Math.max(74, w));
  const tot = tws.reduce((p, q) => p + q, 0) + gap * (tws.length - 1), k = Math.min(1, 344 / tot); let x = 180 - tot * k / 2;
  A.list.forEach((ch, i) => { ch.w = tws[i] * k; ch.x = x + ch.w / 2; x += ch.w + gap * k; ch.s = Math.min(34, 34 * (ch.w - 14) / M.lay(ch.node, 34).w); M.lay(ch.node, ch.s); }); }
// the integral sign, drawn by hand (the font has none); baseline y, font size s
function intSign(c, x, y, s, col) {
  const top = y - s * 1.08, bot = y + s * 0.36, w = s * 0.5, h = bot - top, lw = Math.max(2.2, s * 0.085); c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x + w, top + h * 0.1); c.bezierCurveTo(x + w * 0.98, top - h * 0.03, x + w * 0.62, top - h * 0.03, x + w * 0.58, top + h * 0.16);
  c.lineTo(x + w * 0.42, bot - h * 0.16); c.bezierCurveTo(x + w * 0.38, bot + h * 0.03, x + w * 0.02, bot + h * 0.03, x, bot - h * 0.1); c.stroke();
  for (const [px, py] of [[x + w, top + h * 0.1], [x, bot - h * 0.1]]) { c.beginPath(); c.arc(px, py, lw * 0.9, 0, 7); c.fill(); } c.restore();
}

// ---------------- the scene: a golden autumn afternoon in the woods ----------------
function scene(c, W, H) {
  P.sky(c, W, H, ['#f4b860', '#f8d090', '#fbe6b8', '#f6d8a0'], { x: 290, y: 120, r: 30, color: '#fff2c8', glow: 220 });
  for (let i = 0; i < 8; i++) { const x = i * 50 - 6; c.fillStyle = i % 2 ? '#b8582a' : '#d0782a'; c.beginPath(); c.ellipse(x, 150 + (i % 3) * 20, 54, 70, 0, 0, 7); c.fill(); }
  for (let i = 0; i < 6; i++) { const x = 20 + i * 66; c.fillStyle = '#5a3420'; c.fillRect(x, 160, 12, 460); }
  P.hills(c, W, 560, 20, '#c8903a', '#8a5a2a', { seed: 4, dabs: 30 });
  c.fillStyle = '#8a5a2a'; c.fillRect(0, 590, W, 50);
  c.fillStyle = '#d8682a'; for (let i = 0; i < 40; i++) { c.beginPath(); c.ellipse((i * 47) % W, 592 + (i * 23) % 44, 5, 3, i, 0, 7); c.fill(); }
}

MG.add({
  id: 'parts', stage: 'integrals', cmd: 'BY PARTS!', hint: 'tap', time: 10, mood: 'bright', winText: 'Parted!', hold: 1.9,
  card: {
    title: 'Integration by parts', ref: 'Calculus', kind: 'Calculus',
    text: 'The product rule says (uv)′ = u′v + uv′. Integrate both sides and rearrange, and you get ∫ u dv = uv − ∫ v du.\n\nSo split the integrand into two factors: u, which gets simpler when you differentiate it, and dv, which you can integrate. Work out du and v, then swap: the new integral ∫ v du should be easier than the old one.\n\nFor ∫ x eˣ dx, take u = x and dv = eˣ dx. Then du = dx and v = eˣ, so ∫ x eˣ dx = x eˣ − ∫ eˣ dx = x eˣ − eˣ + C.',
    note: '∫ u dv = uv − ∫ v du. Choose u to be the factor that gets simpler when differentiated (for example x, or ln x).',
    ask: 'What is ∫ x cos x dx? For ∫ x ln x dx, which factor should be u?',
  },

  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g), r = k => Math.floor(g.rand() * k);
    S.key = g.level === 0 ? 'ex' : g.level === 1 ? ['cos', 'ex'][r(2)] : ['ln', 'cos'][r(2)]; const P = PROB[S.key]; S.P = P;
    S.uId = P.u; S.dvId = P.u === 'A' ? 'B' : 'A';
    S.top = M.row(INTG('int', 24), M.gap(4), P.A(), M.gap(8), P.B(), M.gap(8), (() => { const d = dx(); d.id = 'dxp'; return d; })());
    S.tags = {}; S.stage = 0; S.face = 'happy'; S.faceT = -9;
    // the working line's size, from its widest moment (the full uv − ∫ v du)
    { const parts = [M.op('='), P.uE(), P.dot ? M.op('·') : null, P.vE(), M.op('-'), INTG(null), P.vE(), P.dot ? M.op('·') : null, P.du2()]; S.ws = Math.min(36, 36 * 320 / M.lay(M.row(...parts), 36).w); }
    const relay = () => { M.place(g, 'top', S.top, 180, L1Y, 40, { col: INK });
      for (const [k, x] of [['u', 92], ['v', 262]]) if (S.tags[k]) M.place(g, 'tag' + k, S.tags[k], x, TY, 26, { col: k === 'u' ? GOLD : BLUE });
      if (S.work) M.place(g, 'work', S.work, 180, L2Y, S.ws, { col: INK });
      if (!S.usedD) M.place(g, 'cD', S.cD, FXX + 34, AY - 92, 34, { col: '#3a1a08' }); else delete g.s.mk.ex.cD;
      if (!S.usedI) M.place(g, 'cI', S.cI, HGX - 34, AY - 88, 34, { col: '#3a1a08' }); else delete g.s.mk.ex.cI; };
    S.cD = M.txt('d', 'cD'); S.cI = INTG('cI', 22);
    S.relay = relay; relay(); M.inert(g, ['eqW', 'mW', 'tu=', 'tv=']);
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 5) / 8;
    const allTop = () => idsIn(S.top);

    // the dv tag gets its ∫: "v = ∫ eˣ dx", which collapses to "v = eˣ"
    const integrateDv = () => ({ drag: 'cI', to: ['tagV', ...(S.tags.v ? idsIn(S.tags.v) : [])], reach: 60, busy: 0.1, askAt: 1.2 * T, after: 1.0 * T, ask: { v: P.vE(), wrong: P.wrongV() },
      then(g) { S.usedI = true; M.show(g, 1.2 * T); S.point = true; react(g, 'think'); const from = { ...M.box(g, 'cI') }; relay(); M.circle(g, 'tagV', { dur: 0.5 * T, col: BLUE });
        M.fly(g, { node: M.txt('∫'), from: [from.x, from.y - 10], to: 'tvd', dur: 0.5 * T, arc: -50, s0: 34, s1: 26, col: '#ffffff',
          then(g) { S.tags.v = M.row(M.vr('v', 'tvv'), M.op('=', 'tv='), INTG('iT', 16), tint(P.dvE(), BLUE), tint(dx(), BLUE)); S.tags.v.id = 'tagV'; relay(); M.sparkle(g, 'iT', { n: 6 }); g.sfx('pop'); } }); },
      resolve(g) { M.show(g, 1.0 * T); M.at(g, [[0.1 * T, g => { S.tags.v = M.row(M.vr('v', 'tvv'), M.op('=', 'tv='), born(tint(P.vE(), BLUE))); S.tags.v.id = 'tagV'; S.vDone = true; relay(); g.sfx('ding'); M.sparkle(g, 'tagV', { n: 8 }); react(g, 'happy'); }],
        [0.9 * T, g => { S.point = false; }]]); } });
    // the u tag gets its d: "du = 1 dx", which tidies to "du = dx"
    const diffU = () => ({ drag: 'cD', to: ['tagU', ...(S.tags.u ? idsIn(S.tags.u) : [])], reach: 60, busy: 0.1,
      then(g) { S.usedD = true; const two = !!P.du1; M.show(g, (two ? 2.0 : 1.3) * T); S.point = true; react(g, 'think'); const from = { ...M.box(g, 'cD') }; relay(); M.circle(g, 'tagU', { dur: 0.5 * T, col: GOLD });
        M.fly(g, { node: M.txt('d'), from: [from.x, from.y], to: 'tuu', dur: 0.5 * T, arc: -50, s0: 34, s1: 26, col: '#ffffff',
          then(g) { S.tags.u = M.row(M.row(M.txt('d', null, { _born: -1 }), M.vr('u', 'tuu')), M.op('=', 'tu='), born(tint((P.du1 || P.du2)(), GOLD))); S.tags.u.id = 'tagU'; relay(); g.sfx('pop'); M.sparkle(g, 'tagU', { n: 6 }); } });
        if (two) M.at(g, [[1.3 * T, g => { const q = S.tags.u.items[2]; M.tween(g, q.items[0], { alpha: 0, sc: 0.5 }, 0.3 * T); }],
          [1.7 * T, g => { S.tags.u.items[2] = tint(P.du2(), GOLD); relay(); g.sfx('ding'); }]]);
        M.at(g, [[(two ? 1.85 : 1.1) * T, g => { S.duDone = true; S.point = false; react(g, 'happy'); }]]); } });

    M.play(g, {
      moves(g) {
        // 1. choose u (and so dv)
        if (!S.chosen) return [{ tap: S.uId, busy: 0.1,
          then(g) { S.chosen = true; M.show(g, 2.0 * T); S.point = true; react(g, 'think'); g.sfx('tap');
            const ue = M.node(g, S.uId), dvs = [S.dvId, 'dxp'];
            M.circle(g, S.uId, { dur: 0.6 * T, col: GOLD }); M.light(g, ue, { col: GOLD });
            M.at(g, [[0.4 * T, g => { S.tags.u = M.row(M.vr('u', 'tuu'), M.op('=', 'tu='), tint(P.uE(), GOLD)); S.tags.u.id = 'tagU'; relay(); M.writeIn(g, S.tags.u, { dur: 0.5 * T }); S.ptrU = g.t; }],
              [1.0 * T, g => { M.circle(g, dvs, { dur: 0.6 * T, col: BLUE }); M.light(g, S.dvId, { col: BLUE }); M.light(g, 'dxp', { col: BLUE }); react(g, 'wow'); }],
              [1.4 * T, g => { S.tags.v = M.row(M.row(M.txt('d'), M.vr('v', 'tvd')), M.op('=', 'tv='), tint(P.dvE(), BLUE), tint(dx(), BLUE)); S.tags.v.id = 'tagV'; relay(); M.writeIn(g, S.tags.v, { dur: 0.5 * T }); S.ptrV = g.t; }],
              [1.95 * T, g => { S.point = false; }]]); } }];
        // 2–3. work out v and du (either order)
        if (!S.usedI || !S.usedD) { const out = []; if (!S.usedI) out.push(integrateDv()); if (!S.usedD) out.push(diffU()); return out; }
        // 4. assemble uv − ∫ v du: the template writes itself, then each letter is replaced by its piece flying in
        if (!S.work) return [{ tap: allTop(), busy: 0.1,
          then(g) { M.show(g, 3.2 * T); S.point = true; react(g, 'think');
            const fl = (t, id) => M.txt(t, id, { col: FAINT });
            S.U = fl('u', 'wU'); S.V1 = fl('v', 'wV1'); S.V2 = fl('v', 'wV2'); S.DU = M.row(M.txt('d', null, { col: FAINT }), M.txt('u', null, { col: FAINT })); S.DU.id = 'wDU';
            S.head = [M.op('=', 'eqW'), S.U, P.dot ? M.op('·', 'dt1') : M.gap(7), S.V1]; S.tl = [M.op('-', 'mW'), INTG('iW', 20), S.V2, P.dot ? M.op('·', 'dt2') : null, S.DU];
            S.work = M.row(...S.head, ...S.tl); relay(); M.writeIn(g, S.work, { dur: 0.7 * T }); g.sfx('swoosh');
            const swap = (t, srcId, slot, mk, setter) => M.at(g, [[t * T, g => { const b = M.box(g, srcId), d = M.box(g, slot.id); M.circle(g, srcId, { dur: 0.4 * T, col: GOLD, pad: 4 });
              M.fly(g, { node: mk(), from: b ? [b.x, b.y] : [180, 300], to: d ? [d.x, d.y] : [180, L2Y], dur: 0.5 * T, arc: -40, s0: b ? b.s : 26, s1: S.ws, col: '#ffffff',
                then(g) { setter(born(mk())); relay(); g.sfx('pop'); M.sparkle(g, 'work', { n: 4 }); } }); }]]);
            const at = (arr, node, v) => { const i = arr.indexOf(node); if (i >= 0) arr[i] = v; S.work.items = [...S.head, ...S.tl].filter(Boolean); };
            swap(0.9, S.uId, S.U, P.uE, v => { at(S.head, S.U, v); S.U = v; });
            swap(1.45, 'tagV', S.V1, P.vE, v => { at(S.head, S.V1, v); S.V1 = v; });
            swap(2.0, 'tagV', S.V2, P.vE, v => { v.id = 'wV2'; at(S.tl, S.V2, v); S.V2 = v; });
            swap(2.55, 'tagU', S.DU, P.du2, v => { v.id = 'wDU'; at(S.tl, S.DU, v); S.DU = v; });
            M.at(g, [[3.1 * T, g => { S.point = false; react(g, 'happy'); M.unlight(g, S.uId); M.unlight(g, S.dvId); M.unlight(g, 'dxp'); }]]); } }];
        // 5. work out the new integral, one step at a time, then + C
        if (!S.fin) return [{ tap: ['wV2', 'wDU', 'iW'], busy: 0.1,
          then(g) { S.fin = true; react(g, 'think'); S.point = true; let t = 0;
            for (const st of P.tail) { const t0 = t; M.at(g, [[t0 * T, g => { M.circle(g, S.tl.filter(Boolean).map(q => q.id).filter(id => id && M.box(g, id)), { dur: 0.5 * T, col: GOLD, pad: 5 }); const wb = M.box(g, 'work');
              if (st.fromV) { const b = M.box(g, 'tagV'); M.circle(g, 'tagV', { dur: 0.5 * T, col: BLUE }); M.fly(g, { node: P.vE(), from: b ? [b.x + 20, b.y] : [262, TY], to: [wb ? wb.x + wb.w / 2 - 30 : 260, L2Y - 10], dur: 0.6 * T, arc: -30, s0: 26, s1: S.ws, col: BLUE }); }
              else M.note(g, { node: st.note(), at: [180, NY], s: 28, col: NOTEC, write: 0.4 * T, hold: 0.7 * T, fade: 0.25 * T, pill: 'rgba(30,14,6,0.6)' }); }],
              [(t0 + (st.fromV ? 0.75 : 1.1)) * T, g => { S.tl = st.nodes().map(born); S.tl.forEach((q, i) => { if (!q.id) q.id = 'tl' + S.tl.length + '_' + i + '_' + Math.round(g.t * 100); }); S.work.items = [...S.head, ...S.tl].filter(Boolean); relay(); g.sfx('ding'); M.sparkle(g, 'work', { n: 8 }); react(g, 'wow'); }]]);
              t += st.fromV ? 1.1 : 1.6; }
            // + C flies in from the hedgehog
            M.at(g, [[t * T, g => { S.cc = M.vr('C', 'cc', { alpha: 0 }); S.pc = M.op('+', 'pc', { _born: -1, pop: g.t }); S.tl = [...S.tl, S.pc, S.cc]; S.work.items = [...S.head, ...S.tl].filter(Boolean); relay();
              M.fly(g, { node: M.vr('C'), from: [HGX, AY - 60], to: 'cc', dur: 0.5 * T, arc: -80, s0: 26, s1: S.ws, col: '#ffe9a0', then(g) { S.cc.alpha = 1; S.cc.pop = g.t; g.sfx('sparkle'); react(g, 'laugh'); M.sparkle(g, 'cc', { n: 10 }); } }); }],
              [(t + 0.7) * T, g => { S.tags = {}; delete g.s.mk.ex.tagu; delete g.s.mk.ex.tagv; S.point = false; }]]);
            M.show(g, (t + 0.8) * T); } }];
        return [];
      },
      area(g) { return !S.chosen ? [S.uId] : !S.usedI ? ['cI', 'tagV'] : !S.usedD ? ['cD', 'tagU'] : !S.work ? allTop() : ['iW']; },
    });
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('parts_scene', scene), 0, 0, 360, 640);
    // falling leaves
    for (let i = 0; i < 9; i++) { const y = ((t * 24 + i * 83) % 700) - 40, x = (i * 53 + Math.sin(t * 0.8 + i) * 22) % 360; c.save(); c.translate(x, y); c.rotate(t * (0.6 + i % 3 * 0.3) + i); c.fillStyle = ['#e06a2a', '#f0a030', '#c84a20'][i % 3]; c.beginPath(); c.ellipse(0, 0, 7, 3.5, 0, 0, 7); c.fill(); c.restore(); }
    // the walnut sign
    c.save(); c.fillStyle = 'rgba(40,20,8,0.3)'; c.beginPath(); c.roundRect(14, 182, 332, 252, 18); c.fill();
    const wg = c.createLinearGradient(0, 176, 0, 430); wg.addColorStop(0, '#6a3e22'); wg.addColorStop(1, '#4a2812'); c.fillStyle = wg; c.beginPath(); c.roundRect(12, 176, 336, 252, 18); c.fill();
    c.strokeStyle = 'rgba(255,220,170,0.25)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(20, 196 + i * 40); c.bezierCurveTo(120, 190 + i * 40, 220, 204 + i * 40, 340, 194 + i * 40); c.stroke(); }
    c.strokeStyle = '#2a1408'; c.lineWidth = 3; c.beginPath(); c.roundRect(12, 176, 336, 252, 18); c.stroke(); c.restore();
    // the tags' pointers up to the factor each one names
    for (const [k, id, col, at] of [['u', 'tagU', GOLD, S.ptrU], ['v', 'tagV', BLUE, S.ptrV]]) { const tb = S.tags[k] && M.box(g, id), pid = k === 'u' ? S.uId : S.dvId, pb = M.box(g, pid); if (!tb || !pb || at == null) continue;
      const kk = M.ease((t - at) / 0.4), x0 = tb.x, y0 = tb.y - tb.h / 2 - 4, x1 = k === 'v' ? (pb.x + (M.box(g, 'dxp') || pb).x) / 2 : pb.x, y1 = pb.y + pb.h / 2 + 4;
      c.save(); c.strokeStyle = col; c.globalAlpha = 0.75; c.lineWidth = 2.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(M.lerp(x0, x1, kk), M.lerp(y0, y1, kk)); c.stroke(); c.restore(); }
    // the fox (d) and the hedgehog (∫) hold their tokens up
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') { ANI.draw(c, 'fox', FXX, AY - hopK * 14, 0.85, { t, pose, expr, facing: 1 }); ANI.draw(c, 'hedgehog', HGX, AY - hopK * 14, 0.85, { t: t + 0.4, pose, expr, facing: -1 }); }
    else { SCN.host(g, c, 'fox', FXX, AY, 0.85); SCN.host(g, c, 'hedgehog', HGX, AY, 0.85); }
    for (const key of ['cD', 'cI']) { const b = S.mk.ex[key] && M.box(g, key); if (!b) continue; const bob = Math.sin(t * 2.4 + (key === 'cD' ? 0 : 1)) * 2, w = 50, h = 56;
      c.save(); c.translate(0, bob); c.fillStyle = '#f4d9a0'; c.strokeStyle = '#8a5a2a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(b.x - w / 2, b.y - h / 2, w, h, 10); c.fill(); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'cD'); M.drawEx(g, c, 'cI');
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'tagu'); M.drawEx(g, c, 'tagv'); M.drawEx(g, c, 'work');
    // every ∫ is drawn by hand at its gap
    for (const [id, col] of [['int', INK], ['iT', BLUE], ['iW', INK], ['iW2', INK], ['cI', '#3a1a08']]) { const b = M.box(g, id), n = M.node(g, id); if (!b || !n || n.alpha === 0) continue; if ((id === 'cI' && !S.mk.ex.cI) || (id === 'iT' && !(S.tags.v && M.find(S.tags.v, 'iT')))) continue;
      if ((id === 'iW' || id === 'iW2') && !(S.work && M.find(S.work, id))) continue; const bob = id === 'cI' ? Math.sin(t * 2.4 + 1) * 2 : 0; intSign(c, b.x - b.s * 0.22, b.y + bob, b.s, col); }
    fitAsk(g); M.drawUI(g, c);
  },
});
