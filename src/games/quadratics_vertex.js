// quadratics_vertex.js — VERTEX! Find the vertex of y = ax² + bx + c: x = −b / 2a, then put that x back into y.
// A sheet of notebook paper on a meadow, with the parabola sketched on graph paper in the grass below.
// Every move acts out its working (show your work):
//   1-2. Drag b and a from the key onto their letters in x = −b / 2a (either order): the letter is circled, a copy of
//        the number flies down into its place and the letter gives way to it.
//   3. Tap the fraction: −(−b) and 2 · a merge into their values, "= h" writes itself after the fraction, and then
//      the fraction folds away, leaving x = h.
//   4. Drag that x up into the equation: both x's are circled and a copy of the number flies into each one.
//   5. Tap the right side: the value of each term writes itself under it and flies up into its place, then the whole
//      line adds up into one number, and both coordinates fly down to the vertex on the graph.
// Level 0: a = 1, vertex to the right of the y-axis and below the x-axis. Level 1: a = 1, any small vertex. Level 2: a = 2.
// Medium mode: x = −b / 2a and the value of y are picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), LET = '#c0483a', NEW = '#2a70c0', WK = '#e0702a', Y1 = 222, YK = 262, YX = 338;
// fresh(node): the copy of an expression that is actually placed. The kit glides every node whose box moved, wrappers
// too, and a wrapper's glide adds to its symbols' own glides, so rows get new wrappers (views) at every placement and
// only symbols glide. Brackets keep their identity; what is inside them rides along as views.
const STRUCT = ['items', 'base', 'exp', 'inner', 'n', 'd', 'fill', 'rows'], OWN = new Set([...STRUCT, 'k', '_pid', '_glide', '_gx', '_gy', '_m', '_born']);
const DELEG = ['id', 'v', 'col', 'hl', 'hlc', 'sc', 'alpha', 'pop', 'strike', 'write', 'bar', 'roll', 'mark', 'dx', 'dy', 'hide', 'small', 'br', 'w'];
const hid = (o, k, v) => Object.defineProperty(o, k, { value: v, writable: true, configurable: true, enumerable: false });
function view(n, deep, born) {
  if (!n || typeof n !== 'object') return n; const c = { k: n.k };
  for (const k of new Set([...Object.keys(n), ...DELEG])) if (!OWN.has(k)) Object.defineProperty(c, k, { get: () => n[k], set: v => { n[k] = v; }, enumerable: true, configurable: true });
  const sub = x => deep ? view(x, true, born) : fresh(x);
  if (n.items) c.items = n.items.map(sub); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) if (n[k]) c[k] = sub(n[k]); if (n.rows) c.rows = n.rows.map(r => r.map(sub));
  if (deep && born) c._born = -1; return c;
}
function walkAll(n, f) { if (!n || typeof n !== 'object') return; f(n); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) walkAll(n[k], f); (n.items || []).forEach(q => walkAll(q, f)); }
function fresh(n) {
  if (!n || typeof n !== 'object' || /^(num|var|txt|op|gap|mat)$/.test(n.k)) return n;
  if (n.k === 'paren' || n.k === 'slot') { const key = n.k === 'paren' ? 'inner' : 'fill';
    if (!n._vw || n[key] !== n._vw) hid(n, '_mdl', n[key]);
    if (n._vw) walkAll(n._vw, q => Object.defineProperty(q, 'alpha', { value: 0, writable: true, configurable: true }));
    const v = view(n._mdl, true, !!n._seen || n._born === -1); hid(n, '_vw', v); hid(n, '_seen', true); n[key] = v; return n; }
  return view(n, false);
}
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const a = L === 2 ? 2 : 1, h = L === 0 ? r(1, 4) : r(-4, 4), k = L === 0 ? r(-9, -1) : r(-9, 6);
    if (!h || !k) continue;
    const b = -2 * a * h, c = k + a * h * h; if (!c || Math.abs(c) > 20) continue;
    return { a, b, c, h, k, t1: a * h * h, t2: b * h };
  }
}
const sn = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
// symbols leaving the line for good: every one of them (inside brackets too) is made invisible, so none leaves a ghost
const gone = list => list.filter(Boolean).forEach(n => { const w = q => { if (!q || typeof q !== 'object') return; q.alpha = 0; if (q._mdl) w(q._mdl); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) w(q[k]); (q.items || []).forEach(w); }; w(n); });
const born = n => { walkAll(n, q => { q._born = -1; }); return n; };
const R = (id, ...items) => { const r = M.row(...items); r.id = id; return r; };

MG.add({
  id: 'quadratics_vertex', stage: 'quadratics', cmd: 'VERTEX!', hint: 'drag', time: 10, mood: 'bright', winText: 'Found it!', hold: 1.4,
  card: {
    title: 'The vertex of a parabola', ref: 'Algebra 1–2', kind: 'Algebra',
    text: 'The graph of y = ax² + bx + c is a U-shaped curve called a parabola. Its vertex is the turning point: the lowest point when a is positive, or the highest point when a is negative.\n\nThe vertex is at x = −b / 2a. To find its height, put that x back into the equation.\n\nFor example, y = x² − 6x + 5 has a = 1 and b = −6, so x = −(−6) / (2 · 1) = 3. Then y = 3² − 6 · 3 + 5 = 9 − 18 + 5 = −4, so the vertex is (3, −4).\n\nWhy: a parabola is symmetric. When it crosses the x-axis twice, the two crossings add up to −b / a, and the vertex sits halfway between them, at −b / 2a.',
    note: 'The vertex of y = ax² + bx + c is at x = −b / 2a. Put that x into the equation to find y.',
    ask: 'Find the vertex of y = x² − 4x + 1. Find the vertex of y = x² + 2x − 3.',
  },
  init(g) {
    const S = g.s; M.setup(g); const Q = S.q = pick(g), T = S.T = M.pace(g), o = { col: NEW };
    // the symbols of y = ax² + bx + c, kept all the way through so they glide as the line changes
    const L = S.L = { y: M.vr('y'), eq: M.op('='), a: Q.a === 1 ? null : M.num(Q.a), x1: M.vr('x', 'x1'), two: M.num(2), s1: M.op(Q.b < 0 ? '-' : '+'), b: M.num(Math.abs(Q.b)),
      x2: M.vr('x', 'x2'), s2: M.op(Q.c < 0 ? '-' : '+', 'ps2'), c: M.num(Math.abs(Q.c), 'cc'), d1: M.op('·'), d2: M.op('·'), H1: sn(Q.h, o), H2: sn(Q.h, o),
      T1: M.num(Q.t1, 'T1', { col: WK }), sT: M.op(Q.t2 < 0 ? '-' : '+', 'sT'), T2: M.num(Math.abs(Q.t2), 'T2', { col: WK }) };
    S.y = 'x'; // 'x' (letters), 'h' (the vertex's x put in), then t1 / t2 flags, then 'k' (the answer)
    const g1 = () => S.t1 ? R('g1', L.T1) : S.y === 'h' || S.h1 ? R('g1', L.a, L.a ? L.d1 : null, M.sup(L.H1, L.two)) : R('g1', L.a, M.sup(L.x1, L.two));
    const g2 = () => S.t2 ? R('g2', L.sT, L.T2) : S.y === 'h' || S.h2 ? R('g2', L.s1, L.b, L.d2, L.H2) : R('g2', L.s1, L.b, L.x2);
    const yLine = () => M.row(L.y, L.eq, S.y === 'k' ? L.T1 : R('yr', g1(), g2(), L.s2, L.c));
    // one font size for every form of the line (sized for the widest, with the numbers put in), so it never rescales
    S.y = 'h'; let z = 34; while (z > 18 && M.lay(yLine(), z).w > 280) z--; S.y = 'x'; S.z = z;
    // x = −b / 2a
    const X = S.X = { x: M.vr('x'), eq: M.op('='), mn: M.op('-', 'mn'), b: M.vr('b', 'sb', { col: LET }), two: M.num(2, 'd2'), a: M.vr('a', 'sa', { col: LET }),
      e2: M.op('=', 'e2'), hv: M.num(Q.h, 'hv', { col: NEW }) };
    S.xs = 'f'; // 'f' (the formula), 'v' (= h written after the simplified fraction), 'h' (x = h)
    const xLine = () => S.xs === 'h' ? M.row(X.x, X.eq, X.hv) : M.row(X.x, X.eq, M.frac(S.num || M.row(X.mn, X.b), S.den || M.row(X.two, X.a), 'fr'), S.xs === 'v' ? X.e2 : null, S.xs === 'v' ? X.hv : null);
    const place = S.place = () => { M.place(g, 'y', fresh(yLine()), 180, Y1, S.z, { col: INK }); M.place(g, 'x', fresh(xLine()), 180, YX, 36, { col: INK }); };
    const key = (Lt, v) => [M.vr(Lt, null, { col: LET }), M.op('='), M.num(v, 'k' + Lt, { col: NEW })];
    M.place(g, 'key', M.row(...key('a', Q.a), M.gap(26), ...key('b', Q.b)), 180, YK, 24, { col: INK });
    place(); M.inert(g, ['x1', 'x2', 'mn', 'd2', 'e2', 'T1', 'T2', 'sT', 'ps2', 'cc']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    S.f = {};
    // a number from the key flies down into its letter, and the letter gives way to it
    const subst = (Lt) => ({ drag: 'k' + Lt, to: 's' + Lt, busy: 0.1, then(g) {
      S.f[Lt] = true; M.show(g, 0.8 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh'); M.inert(g, ['k' + Lt]);
      const letter = X[Lt], from = { ...M.box(g, 'k' + Lt) }, v = Q[Lt];
      M.circle(g, letter, { col: LET, dur: 0.45 * T }); M.light(g, letter, { col: LET }); M.tween(g, 'k' + Lt, { alpha: 0.35 }, 0.4 * T, { delay: 0.3 * T });
      M.fly(g, { node: sn(v, o), from: [from.x, from.y], to: 's' + Lt, delay: 0.12 * T, dur: 0.42 * T, arc: -30, s0: 24, s1: 36, col: NEW });
      M.tween(g, letter, { alpha: 0, sc: 0.5 }, 0.15 * T, { delay: 0.42 * T });
      M.at(g, [[0.56 * T, g => { const n = born(sn(v, o)); if (Lt === 'b') S.num = M.row(X.mn, n); else S.den = M.row(X.two, born(M.op('·')), n); S[Lt + 'n'] = n; place();
        n.pop = g.t; M.sparkle(g, n, { n: 8, cols: [NEW, '#fff'] }); g.sfx('pop'); hop(g); }]]); } });
    M.play(g, {
      moves(g) {
        const out = [];
        for (const Lt of ['b', 'a']) if (!S.f[Lt]) out.push(subst(Lt));
        if (out.length) return out;
        // 3. work out the fraction: the top and the bottom merge into their values, then = h is written after it
        if (!S.xDone) return [{ tap: 'fr', busy: 0.1, askAt: 0.95 * T, after: 0.95 * T, ask: { v: Q.h, wrong: [-Q.h, 2 * Q.h, Q.h + 1] },
          then(g) { S.xDone = true; M.show(g, 0.95 * T); S.point = true; hop(g, 'think'); M.circle(g, 'fr', { dur: 0.5 * T }); M.tween(g, g.s.mk.ex.key.node, { alpha: 0 }, 0.4 * T);
            M.at(g, [[0.3 * T, g => { S.num = M.num(-Q.b, 'nv', { col: NEW }); S.den = M.num(2 * Q.a, 'dv', { col: NEW }); place(); g.sfx('tap'); M.inert(g, ['nv', 'dv']); }],
              [0.7 * T, g => { S.xs = 'v'; X.hv.alpha = 0; place(); M.writeIn(g, X.e2, { dur: 0.2 * T }); }]]); },
          resolve(g) { M.show(g, 0.95 * T); X.hv.alpha = 1; M.writeIn(g, X.hv, { dur: 0.25 * T }); M.indicate(g, X.hv, { delay: 0.2 * T, dur: 0.35 * T, col: NEW }); g.sfx('ding');
            M.at(g, [[0.6 * T, g => { S.xs = 'h'; place(); M.sparkle(g, 'hv', { n: 10, cols: [NEW, '#fff'] }); g.sfx('coin'); hop(g); }]]); } }];
        // 4. put that x into the equation: a copy of the number flies into each x
        if (S.y === 'x') return [{ drag: 'hv', to: ['x1', 'x2', 'yr', 'g1', 'g2'], area: [8, 180, 352, 244], busy: 0.1,
          then(g) { M.show(g, 0.95 * T); S.point = true; S.yGo = true; hop(g, 'think'); g.sfx('swoosh'); const from = { ...M.box(g, 'hv') };
            for (const [i, id] of [[0, 'x1'], [1, 'x2']]) { M.circle(g, id, { col: NEW, dur: 0.45 * T, delay: i * 0.1 * T }); M.light(g, id, { col: NEW });
              M.tween(g, id, { alpha: 0, sc: 0.5 }, 0.15 * T, { delay: (0.47 + i * 0.15) * T });
              M.fly(g, { node: sn(Q.h, o), from: [from.x, from.y], to: id, delay: (0.15 + i * 0.15) * T, dur: 0.45 * T, arc: -50, s0: 36, s1: S.z, col: NEW,
                then(g) { const H = i ? L.H2 : L.H1; S['h' + (i + 1)] = true; born(H); place(); H.pop = g.t; M.sparkle(g, H, { n: 8, cols: [NEW, '#fff'] }); g.sfx('pop'); hop(g); } }); }
            M.at(g, [[0.82 * T, g => { S.y = 'h'; place(); }]]); } }];
        // 5. work out y: each term's value is written under it and flies up into its place, then the line adds up
        if (S.y === 'h' && S.yGo && !S.yDone) return [{ tap: ['yr', 'g1', 'g2'], busy: 0.1, askAt: 1.3 * T, after: 1.2 * T, ask: { v: Q.k, wrong: [-Q.k, Q.k + 2 * Q.c, Q.a * Q.h * Q.h - Q.b * Q.h + Q.c] },
          then(g) { S.yDone = true; M.show(g, 1.3 * T); S.point = true; hop(g, 'think'); M.circle(g, 'yr', { col: WK, dur: 0.55 * T });
            // the symbols of each term fade as its value flies in over them
            const fade = (list, d) => list.filter(Boolean).forEach(n => M.tween(g, n, { alpha: 0 }, 0.15 * T, { delay: d }));
            fade([L.a, L.d1, L.H1, L.two], 0.78 * T); fade([L.s1, L.b, L.d2, L.H2], 1.08 * T);
            M.node(g, 'yr').pop = null;
            const nt = (id, v, d, flag) => M.note(g, { node: M.num(v), at: id, off: [0, 34], s: 24, col: WK, delay: d, write: 0.28 * T, hold: 0.22 * T, to: id, fly: 0.28 * T, s1: S.z, arc: 8,
              then(g) { gone(flag === 't1' ? [L.a, L.d1, L.H1, L.two] : [L.s1, L.b, L.d2, L.H2]); S[flag] = true; place(); const n = flag === 't1' ? L.T1 : L.T2; n.pop = g.t; g.sfx('pop'); hop(g); } });
            nt('g1', Q.t1, 0.15 * T, 't1'); nt('g2', Q.t2, 0.45 * T, 't2'); },
          resolve(g) { M.show(g, 1.2 * T); [L.T1, L.T2, L.c].forEach((n, i) => M.indicate(g, n, { delay: i * 0.1 * T, dur: 0.3 * T, sc: 1.2 }));
            M.at(g, [[0.4 * T, g => { // the other terms slide into the first one, and it rolls over to the answer
              const b0 = M.box(g, 'T1'); for (const n of [L.sT, L.T2, L.s2, L.c]) { const b = M.box(g, n.id); if (b && b0) M.tween(g, n, { dx: b0.x - b.x, alpha: 0, sc: 0.5 }, 0.3 * T); }
              M.roll(g, L.T1, Q.k, { delay: 0.12 * T, dur: 0.32 * T }); g.sfx('ding'); }],
              [0.85 * T, g => { S.y = 'k'; L.T1.id = 'kv'; place(); M.inert(g, ['kv']); M.sparkle(g, 'kv', { n: 10, cols: [WK, '#fff'] }); hop(g, 'laugh'); S.point = false;
                // both coordinates fly down to the vertex on the graph
                const G = S.G, to = [G.px(Q.h), G.py(Q.k) - 6];
                for (const [id, d] of [['hv', 0], ['kv', 0.08 * T]]) { const b = M.box(g, id); if (b) M.fly(g, { node: M.num(id === 'hv' ? Q.h : Q.k), from: [b.x, b.y], to, delay: d, dur: 0.38 * T, arc: -30, s0: 30, s1: 14, col: id === 'hv' ? NEW : WK }); }
                M.at(g, [[0.4 * T, g => { S.litAt = g.t; g.sfx('chime'); }]]); }]]); } }];
        return [];
      },
      area(g) { const Lt = ['b', 'a'].find(Lt => !S.f[Lt]); return Lt ? ['k' + Lt, 's' + Lt] : !S.xDone ? ['fr'] : S.y === 'x' ? ['hv', 'x1'] : ['yr']; },
    });
    // the graph: the vertex sits in the middle near the bottom of the graph paper
    S.G = { px: x => 160 + (x - Q.h) * 22, py: y => 538 - (y - Q.k) * (110 / (Q.a * 25)) };
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Q = S.q, t = g.t;
    SCN.std(g, c, { scene: 'meadow', panel: PANEL, panelY: 284, panelH: 196 });
    // graph paper in the grass, with the parabola drawn around its vertex
    const X0 = 40, X1 = 280, Y0 = 404, Y1 = 552, px = S.G.px, py = S.G.py;
    c.save(); c.translate(160, 478); c.rotate(-0.02); c.translate(-160, -478);
    c.fillStyle = 'rgba(40,60,20,0.25)'; c.fillRect(X0 + 4, Y0 + 6, X1 - X0, Y1 - Y0); c.fillStyle = '#f6fbff'; c.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
    c.beginPath(); c.rect(X0, Y0, X1 - X0, Y1 - Y0); c.clip();
    c.strokeStyle = 'rgba(80,140,200,0.22)'; c.lineWidth = 1; for (let x = Math.ceil(Q.h - 6); x <= Q.h + 6; x++) { c.beginPath(); c.moveTo(px(x), Y0); c.lineTo(px(x), Y1); c.stroke(); }
    c.strokeStyle = 'rgba(60,60,90,0.6)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X0, py(0)); c.lineTo(X1, py(0)); c.moveTo(px(0), Y0); c.lineTo(px(0), Y1); c.stroke();
    c.strokeStyle = '#3a6ab0'; c.lineWidth = 2.6; c.beginPath(); for (let x = Q.h - 6; x <= Q.h + 6; x += 0.05) { const y = py(Q.a * x * x + Q.b * x + Q.c); x > Q.h - 6 ? c.lineTo(px(x), y) : c.moveTo(px(x), y); } c.stroke();
    // once x is known, a dashed line marks it on the graph: the axis of symmetry
    if (S.xs === 'h') { c.save(); c.globalAlpha = 0.6; c.setLineDash([5, 5]); c.strokeStyle = NEW; c.lineWidth = 1.8; c.beginPath(); c.moveTo(px(Q.h), Y0); c.lineTo(px(Q.h), Y1); c.stroke(); c.restore(); }
    c.restore();
    if (S.litAt != null) { const k = M.clamp((t - S.litAt) / 0.3, 0, 1), x = px(Q.h), y = py(Q.k) - 6, p = 1 + 0.2 * Math.sin(t * 7);
      c.save(); c.globalAlpha = k; const gr = c.createRadialGradient(x, y, 0, x, y, 22 * p); gr.addColorStop(0, 'rgba(255,200,60,0.95)'); gr.addColorStop(1, 'rgba(255,200,60,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, 22 * p, 0, 7); c.fill();
      c.fillStyle = '#e8503a'; c.beginPath(); c.arc(x, y, 5.5, 0, 7); c.fill();
      c.font = M.NUMF(18); c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#fff'; const lab = `(${Q.h}, ${Q.k})`.replace(/-/g, '−'); c.strokeText(lab, x, y - 14 - (1 - k) * 8); c.fillStyle = '#2a2440'; c.fillText(lab, x, y - 14 - (1 - k) * 8); c.restore(); }
    host(g, c, 'hedgehog', 312, 612, 1.0, -1);
    M.drawEx(g, c, 'y'); M.drawEx(g, c, 'key'); M.drawEx(g, c, 'x');
    M.drawUI(g, c);
  },
});
