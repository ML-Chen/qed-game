// lines_slope.js — SLOPE! The slope through two points: m = (y₂ − y₁) / (x₂ − x₁), on a notebook page in the city.
// A small graph beside the formula shows the two points. Every move acts out its working (show your work):
//   1. Drag one y-value onto the other (or onto the top of the fraction): both y's are circled, copies fly down into
//      the numerator one after the other, y₂ − y₁, and the rise draws itself on the graph.
//   2. Drag one x-value onto the other: the same for the denominator, x₂ − x₁, and the run draws itself.
//   3. Tap a subtraction: it swells, the second number slides into the first and the first rolls over to the
//      difference like an odometer; a copy flies out to label the rise (or run) on the graph.
//   4. Tap the fraction: "rise ÷ run = m" writes itself under it, the slope staircase climbs the line on the graph one
//      step at a time (1 across, m up), and m flies up into place. Then the whole line draws itself.
// Level 0: small positive points, rising line. Level 1: the line may fall. Level 2: negative coordinates, and the
// points may be listed right to left (both differences come out negative).
// Medium mode: the rise, the run and the quotient open a tray when the working reaches them.
const M = MK, INK = SCN.ink('paper'), CA = '#d8642a', CB = '#2a72b0', RISE = '#b0307a', RUN = '#2f8a4a', GOLD = '#e09a1a', EY = 344, NY = 398;
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
    let m = L === 0 ? r(1, 3) : [-3, -2, -1, 2, 3][r(0, 4)], run = L === 0 ? r(1, 3) : r(2, 4);
    let x1 = L === 2 ? r(-4, 0) : r(0, 3), y1 = L === 2 ? r(-4, 2) : m < 0 ? -m * run + r(0, 2) : r(0, 3);
    if (L === 2 && g.rand() < 0.5) m = -m;
    let x2 = x1 + run, y2 = y1 + m * run;
    if (Math.abs(y2) > 12 || (L < 2 && y2 < 0)) continue;
    if (L === 2 && g.rand() < 0.5) [x1, y1, x2, y2] = [x2, y2, x1, y1]; // listed right to left
    if (L === 2 && Math.min(x1, x2, y1, y2) >= 0) continue;
    return { x1, y1, x2, y2, rise: y2 - y1, run: x2 - x1, m };
  }
}
const nm = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
const R = (id, ...items) => { const r = M.row(...items); r.id = id; return r; };
const show0 = n => { walkAll(n, q => { q.alpha = 1; }); if (n._mdl) walkAll(n._mdl, q => { q.alpha = 1; }); };

MG.add({
  id: 'lines_slope', stage: 'lines', cmd: 'SLOPE!', hint: 'drag', time: 10, winText: 'Steep!', hold: 1.4,
  card: {
    title: 'Slope from two points', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'The slope of a line tells you how steep it is. It is the rise divided by the run. The rise is how far the line goes up, and the run is how far it goes to the right.\n\nTo find the slope through two points, subtract the y-values to get the rise. Subtract the x-values in the same order to get the run. Then divide.\n\nFor example, for (1, 2) and (4, 8), the rise is 8 − 2 = 6 and the run is 4 − 1 = 3. The slope is 6/3 = 2: the line goes up 2 for every 1 step to the right.\n\nA straight line climbs at the same rate everywhere, so any two of its points give the same slope. A negative slope means the line goes down.',
    note: 'm = (y₂ − y₁) / (x₂ − x₁). Subtract the y-values and the x-values in the same order, then divide.',
    ask: 'What is the slope through (2, 1) and (5, 10)? What is the slope through (0, 4) and (2, 0)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = S.T = M.pace(g);
    const pt = (x, y, k, col) => M.paren(M.row(M.num(x, 'x' + k, { col }), M.op(',', 'cm' + k, { col }), M.gap(6), M.num(y, 'y' + k, { col })), 'p' + k, { col });
    S.pa = pt(p.x1, p.y1, 1, CA); S.pb = pt(p.x2, p.y2, 2, CB);
    S.ns = M.slot('ns', { col: RISE }); S.ds = M.slot('ds', { col: RUN }); S.top = S.ns; S.bot = S.ds; S.mv = M.vr('m', 'mv'); S.eqs = M.op('=', 'eq');
    const eq = () => S.res ? M.row(S.mv, S.eqs, S.res) : M.row(S.mv, S.eqs, M.frac(S.top, S.bot, 'fr'));
    const place = S.place = () => { M.place(g, 'pa', S.pa, 112, 236, 30, { col: INK }); M.place(g, 'pb', S.pb, 264, 236, 30, { col: INK }); M.place(g, 'eq', fresh(eq()), S.EX, EY, 38, { col: INK, left: true }); };
    // m = keeps a fixed left edge (centred for its widest form, both differences written out), so it never slides
    S.EX = 112 - M.lay(M.row(M.vr('m'), M.op('='), M.frac(M.row(M.num(p.y2), M.op('-'), nm(p.y1)), M.row(M.num(p.x2), M.op('-'), nm(p.x1)))), 38).w / 2;
    place(); M.inert(g, ['p1', 'p2', 'cm1', 'cm2', 'mv', 'eq']);
    // the little graph: a square grid fitted around both points, with the axes when they are in view
    const X0 = 204, X1 = 338, Y0 = 262, Y1 = 396;
    const xa = Math.min(p.x1, p.x2) - 1, xb = Math.max(p.x1, p.x2) + 1, ya = Math.min(p.y1, p.y2) - 1, yb = Math.max(p.y1, p.y2) + 1;
    let ux = (X1 - X0) / (xb - xa), uy = (Y1 - Y0) / (yb - ya); ux = Math.min(ux, uy * 2.2); uy = Math.min(uy, ux * 2.2); // cells at most a little stretched
    const ox = (X0 + X1) / 2 - (xa + xb) / 2 * ux, oy = (Y0 + Y1) / 2 + (ya + yb) / 2 * uy;
    S.G = { xa, xb, ya, yb, ux, uy, PX: x => ox + x * ux, PY: y => oy - y * uy };
    // where the rise and run labels sit on the graph
    S.labRun = () => [S.G.PX(p.x1 + p.run / 2), S.G.PY(p.y1) + (p.rise > 0 ? 12 : -12)];
    S.labRise = () => [S.G.PX(p.x2) + (p.run > 0 ? 13 : -13), S.G.PY(p.y1 + p.rise / 2)];
    g.dur *= (2.6 + 1.05 * 5) / 8;
    // making a difference: both values are circled, then copies fly down into the fraction, first the one, then the other
    const diff = (which) => {
      const top = which === 'y', a = top ? p.y2 : p.x2, b = top ? p.y1 : p.x1, col = top ? RISE : RUN, ia = (top ? 'y' : 'x') + '2', ib = (top ? 'y' : 'x') + '1';
      return { busy: 0.1, then(g) {
        M.show(g, 1.0 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
        M.circle(g, [ia, ib], { col, dur: 0.45 * T }); M.light(g, ia, { col }); M.light(g, ib, { col });
        const A = M.num(a, null, { col, alpha: 0 }), mn = M.op('-', null, { col, alpha: 0 }), B = nm(b, { col }); walkAll(B, q => { q.alpha = 0; });
        const row = R(top ? 'nc' : 'dc', A, mn, B); S[top ? 'A1' : 'A2'] = A; S[top ? 'B1' : 'B2'] = B; S[top ? 'm1' : 'm2'] = mn;
        if (top) S.top = row; else S.bot = row;
        const drop = (id, node, to, d, land) => { const f = { ...M.box(g, id) }; M.fly(g, { node, from: [f.x, f.y], to, delay: d, dur: 0.4 * T, arc: -36, s0: 30, s1: 32, col, then: land }); };
        A.id = '_a' + which; B.id = '_b' + which; mn.id = '_m' + which; place(); M.inert(g, [A.id, B.id, mn.id]);
        drop(ia, M.num(a), '_a' + which, 0.2 * T, g => { A.alpha = 1; A.pop = g.t; g.sfx('pop'); });
        M.at(g, [[0.5 * T, g => { mn.alpha = 1; mn._born = g.t; }]]);
        drop(ib, nm(b), '_b' + which, 0.42 * T, g => { show0(B); B.pop = g.t; g.sfx('pop'); hop(g); M.unlight(g, ia); M.unlight(g, ib);
          S[top ? 'ny' : 'nx'] = g.t; g.sfx('sweep'); }); } };
    };
    // working a difference out: the second number slides into the first, which rolls over to the difference
    const work = (which) => {
      const top = which === 'y', v = top ? p.rise : p.run, col = top ? RISE : RUN, id = top ? 'nc' : 'dc';
      return { tap: id, busy: 0.1, askAt: 0.4 * T, after: 0.85 * T, ask: top ? { v: p.rise, wrong: [p.y2 + p.y1, -p.rise, p.run] } : { v: p.run, wrong: [p.x2 + p.x1, -p.run, p.rise] },
        then(g) { S[top ? 'ty' : 'tx'] = 1; M.show(g, 0.4 * T); S.point = true; hop(g, 'think'); M.circle(g, id, { col, dur: 0.4 * T }); M.indicate(g, id, { dur: 0.35 * T, sc: 1.12, col }); },
        resolve(g) { M.show(g, 0.85 * T); const A = S[top ? 'A1' : 'A2'], B = S[top ? 'B1' : 'B2'], mn = S[top ? 'm1' : 'm2'], ba = M.box(g, A.id);
          for (const n of [mn, B]) { const b = M.box(g, n.id); M.tween(g, n, { dx: ba && b ? ba.x - b.x : -20, alpha: 0, sc: 0.5 }, 0.28 * T); }
          walkAll(B, q => { if (q !== B) M.tween(g, q, { alpha: 0 }, 0.25 * T); });
          M.roll(g, A, v, { delay: 0.1 * T, dur: 0.32 * T }); g.sfx('ding');
          M.at(g, [[0.45 * T, g => { const V = M.num(v, top ? 'nv' : 'dv', { col }); A.alpha = 0; if (top) S.top = V; else S.bot = V; place(); M.inert(g, [top ? 'nv' : 'dv']);
            V.pop = g.t; M.sparkle(g, V, { n: 8, cols: [col, '#fff'] }); g.sfx('coin'); hop(g);
            const b = M.box(g, V.id); M.fly(g, { node: M.num(v), from: [b.x, b.y], to: top ? S.labRise() : S.labRun(), dur: 0.36 * T, arc: -30, s0: 30, s1: 14, col,
              then(g) { S[top ? 'vy' : 'vx'] = g.t; } }); }]]); } };
    };
    M.play(g, {
      moves(g) {
        const out = [];
        const dy = diff('y'), dx = diff('x');
        if (!S.dyAt) { const go = { ...dy, then(g) { S.dyAt = g.t; dy.then(g); } }; out.push({ drag: 'y1', to: ['y2', 'ns'], ...go }, { drag: 'y2', to: ['y1', 'ns'], ...go }); }
        if (!S.dxAt) { const go = { ...dx, then(g) { S.dxAt = g.t; dx.then(g); } }; out.push({ drag: 'x1', to: ['x2', 'ds'], ...go }, { drag: 'x2', to: ['x1', 'ds'], ...go }); }
        if (S.ny && !S.ty) out.push(work('y'));
        if (S.nx && !S.tx) out.push(work('x'));
        if (S.vy && S.vx && !S.tm) out.push({ tap: ['fr', 'nv', 'dv'], busy: 0.1, askAt: 0.55 * T, after: 1.4 * T, ask: { v: p.m, wrong: [p.rise === p.run ? null : M.frac(M.num(p.run), M.num(p.rise)), -p.m, p.rise - p.run, p.rise * p.run] },
          then(g) { S.tm = 1; M.show(g, 0.55 * T); S.point = true; hop(g, 'think'); M.circle(g, 'fr', { col: GOLD, dur: 0.45 * T });
            S.q = M.num(p.m, 'q', { col: GOLD, alpha: 0 }); const b = M.box(g, 'fr');
            S.note = M.row(M.num(p.rise, null, { col: RISE }), M.op('÷'), nm(p.run, { col: RUN }), M.op('='), S.q); M.place(g, 'note', S.note, b ? b.x : 112, NY, 24, { col: GOLD }); M.writeIn(g, S.note, { dur: 0.4 * T, delay: 0.1 * T }); },
          resolve(g) { M.show(g, 1.4 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.15 * T, dur: 0.3 * T, col: GOLD }); g.sfx('ding');
            // the staircase: 1 across and m up, once for every step of the run
            S.stairAt = g.t + 0.15 * T; S.stairDur = 0.75 * T; const n = Math.abs(p.run);
            M.at(g, [...[...Array(n)].map((_, i) => [0.15 * T + (i + 0.6) * 0.75 * T / n, g => { g.sfx('tap'); }]),
              [0.95 * T, g => { const from = { ...M.box(g, 'q') }; S.res = M.num(p.m, 'mres', { alpha: 0 }); M.inert(g, ['mres']); place(); M.tween(g, S.note, { alpha: 0 }, 0.25 * T);
                M.fly(g, { node: M.num(p.m), from: [from.x, from.y], to: 'mres', dur: 0.32 * T, arc: 28, s0: 24, s1: 38, col: GOLD,
                  then(g) { S.res.alpha = 1; S.res.pop = g.t; delete g.s.mk.ex.note; S.win = g.t; M.sparkle(g, 'mres', { n: 12, cols: [GOLD, '#fff'] }); g.sfx('chime'); hop(g, 'laugh'); S.point = false; } }); }]]); } });
        return out;
      },
      area(g) { return !S.dyAt ? ['y1', 'y2'] : !S.dxAt ? ['x1', 'x2'] : !S.vy ? ['nc'] : !S.vx ? ['dc'] : ['fr']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, p = S.p, t = g.t, { xa, xb, ya, yb, ux, uy, PX, PY } = S.G;
    SCN.std(g, c, { scene: 'city', panel: 'paper', panelY: 292, panelH: 228 });
    host(g, c, 'bird', 300, 590, 1.3, -1);
    c.save(); c.beginPath(); c.rect(PX(xa), PY(yb), (xb - xa) * ux, (yb - ya) * uy); c.clip();
    c.fillStyle = 'rgba(230,242,255,0.8)'; c.fillRect(PX(xa), PY(yb), (xb - xa) * ux, (yb - ya) * uy);
    c.strokeStyle = 'rgba(80,140,200,0.35)'; c.lineWidth = 1;
    for (let x = xa; x <= xb; x++) { c.beginPath(); c.moveTo(PX(x), PY(ya)); c.lineTo(PX(x), PY(yb)); c.stroke(); }
    for (let y = ya; y <= yb; y++) { c.beginPath(); c.moveTo(PX(xa), PY(y)); c.lineTo(PX(xb), PY(y)); c.stroke(); }
    c.strokeStyle = 'rgba(42,36,64,0.7)'; c.lineWidth = 2;
    if (xa <= 0 && xb >= 0) { c.beginPath(); c.moveTo(PX(0), PY(ya)); c.lineTo(PX(0), PY(yb)); c.stroke(); }
    if (ya <= 0 && yb >= 0) { c.beginPath(); c.moveTo(PX(xa), PY(0)); c.lineTo(PX(xb), PY(0)); c.stroke(); }
    // the whole line, once the slope is found
    if (S.win) { const k = M.ease((t - S.win) / 0.3), cx = (p.x1 + p.x2) / 2, cy = (p.y1 + p.y2) / 2, L = (xb - xa) * k;
      c.strokeStyle = '#ffb02a'; c.lineWidth = 3; c.beginPath(); c.moveTo(PX(cx - L), PY(cy - L * p.m)); c.lineTo(PX(cx + L), PY(cy + L * p.m)); c.stroke(); }
    c.restore();
    // run (along from the first point) and rise (up to the second point), drawn as they are written
    c.save(); c.lineCap = 'round'; c.lineWidth = 4;
    if (S.nx) { const k = M.ease((t - S.nx) / 0.3); c.strokeStyle = RUN; c.beginPath(); c.moveTo(PX(p.x1), PY(p.y1)); c.lineTo(PX(p.x1 + p.run * k), PY(p.y1)); c.stroke(); }
    if (S.ny) { const k = M.ease((t - S.ny) / 0.3); c.strokeStyle = RISE; c.beginPath(); c.moveTo(PX(p.x2), PY(p.y1)); c.lineTo(PX(p.x2), PY(p.y1 + p.rise * k)); c.stroke(); }
    // the slope staircase: from the first point, one step across and m up, again and again until the second point
    if (S.stairAt != null && t >= S.stairAt) { const n = Math.abs(p.run), sx = Math.sign(p.run), kk = M.clamp((t - S.stairAt) / S.stairDur, 0, 1) * n;
      c.lineWidth = 3; c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 6; c.beginPath(); c.moveTo(PX(p.x1), PY(p.y1));
      for (let i = 0; i < n; i++) { const f = M.clamp(kk - i, 0, 1); if (f <= 0) break; const x0 = p.x1 + i * sx, y0 = p.y1 + i * sx * p.m, a = M.clamp(f / 0.5, 0, 1), b = M.clamp((f - 0.5) / 0.5, 0, 1);
        c.lineTo(PX(x0 + sx * a), PY(y0)); if (b > 0) c.lineTo(PX(x0 + sx), PY(y0 + sx * p.m * b)); }
      c.stroke(); c.shadowBlur = 0;
      // the first riser is labelled m
      if (kk > 1) { const al = M.clamp(kk - 1, 0, 1); c.globalAlpha = al; c.font = '700 13px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        const lx = PX(p.x1 + sx) + (sx > 0 ? -10 : 10), ly = PY(p.y1 + sx * p.m / 2); c.fillStyle = 'rgba(255,253,244,0.9)'; c.beginPath(); c.arc(lx, ly, 9, 0, 7); c.fill(); c.fillStyle = GOLD; c.fillText(String(p.m).replace('-', '−'), lx, ly + 1); c.globalAlpha = 1; } }
    c.font = '700 14px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const lab = (s, [x, y], col) => { c.fillStyle = 'rgba(255,253,244,0.9)'; c.beginPath(); c.arc(x, y, 10, 0, 7); c.fill(); c.fillStyle = col; c.fillText(String(s).replace('-', '−'), x, y + 1); };
    if (S.vx) lab(p.run, S.labRun(), RUN);
    if (S.vy) lab(p.rise, S.labRise(), RISE);
    for (const [x, y, col] of [[p.x1, p.y1, CA], [p.x2, p.y2, CB]]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(PX(x), PY(y), 6.5, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(PX(x), PY(y), 4.5 + Math.sin(t * 4) * 0.6, 0, 7); c.fill(); }
    c.restore();
    M.drawEx(g, c, 'pa'); M.drawEx(g, c, 'pb'); M.drawEx(g, c, 'eq'); M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
