// quadratics_vertex.js — VERTEX! Find the vertex of y = ax² + bx + c: x = −b / 2a, then put that x back into y.
// A sheet of notebook paper on a meadow, with the parabola sketched on graph paper in the grass below.
// The player drags b and a from the key onto their letters in x = −b / 2a (either order) and taps the fraction to work
// it out. Then the player drags that x up into the equation: every x becomes the number. A tap on the right side works
// out y, and the vertex lights up on the graph with its coordinates.
// Level 0: a = 1, vertex to the right of the y-axis and below the x-axis. Level 1: a = 1, any small vertex. Level 2: a = 2.
// Medium mode: x = −b / 2a and the value of y are picked from the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), LET = '#c0483a', NEW = '#2a70c0';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    const a = L === 2 ? 2 : 1, h = L === 0 ? r(1, 4) : r(-4, 4), k = L === 0 ? r(-9, -1) : r(-9, 6);
    if (!h || !k) continue;
    const b = -2 * a * h, c = k + a * h * h; if (!c || Math.abs(c) > 20) continue;
    return { a, b, c, h, k };
  }
}
const sn = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
function swap(n, nn) { for (const k of Object.keys(n)) delete n[k]; Object.assign(n, nn); }
// the right side of y = ax² + bx + c, with the x's given as nodes (letters at first, then the vertex's x)
function rhs(Q, x1, x2) { return M.row(Q.a === 1 ? null : M.num(Q.a), Q.a === 1 ? null : x1.k !== 'var' ? M.op('·') : null, M.sup(x1, M.num(2)), M.op(Q.b < 0 ? '-' : '+'), M.num(Math.abs(Q.b)), x2.k !== 'var' ? M.op('·') : null, x2, M.op(Q.c < 0 ? '-' : '+'), M.num(Math.abs(Q.c))); }

MG.add({
  id: 'quadratics_vertex', stage: 'quadratics', cmd: 'VERTEX!', hint: 'drag', time: 10, mood: 'bright', winText: 'Found it!', hold: 1.4,
  card: {
    title: 'The vertex of a parabola', ref: 'Algebra 1–2', kind: 'Algebra',
    text: 'The graph of y = ax² + bx + c is a U-shaped curve called a parabola. Its vertex is the turning point: the lowest point when a is positive, or the highest point when a is negative.\n\nThe vertex is at x = −b / 2a. To find its height, put that x back into the equation.\n\nFor example, y = x² − 6x + 5 has a = 1 and b = −6, so x = −(−6) / (2 · 1) = 3. Then y = 3² − 6 · 3 + 5 = 9 − 18 + 5 = −4, so the vertex is (3, −4).\n\nWhy: a parabola is symmetric. When it crosses the x-axis twice, the two crossings add up to −b / a, and the vertex sits halfway between them, at −b / 2a.',
    note: 'The vertex of y = ax² + bx + c is at x = −b / 2a. Put that x into the equation to find y.',
    ask: 'Find the vertex of y = x² − 4x + 1. Find the vertex of y = x² + 2x − 3.',
  },
  init(g) {
    const S = g.s; M.setup(g); const Q = S.q = pick(g);
    S.yr = rhs(Q, M.vr('x', 'x1'), M.vr('x', 'x2')); S.yr.id = 'yr';
    const line1 = () => { let z = 34; const n = M.row(M.vr('y'), M.op('='), S.yr); while (z > 18 && M.lay(n, z).w > 300) z--; M.place(g, 'y', n, 180, 222, z, { col: INK }); };
    line1(); S.line1 = line1;
    const key = (L, v) => [M.vr(L, null, { col: LET }), M.op('='), M.num(v, 'k' + L, { col: NEW })];
    M.place(g, 'key', M.row(...key('a', Q.a), M.gap(26), ...key('b', Q.b)), 180, 262, 24, { col: INK });
    S.fr = M.frac(M.row(M.op('-'), M.vr('b', 'sb', { col: LET })), M.row(M.num(2), M.vr('a', 'sa', { col: LET })), 'fr');
    S.xl = M.row(M.vr('x'), M.op('='), S.fr);
    M.place(g, 'x', S.xl, 180, 338, 36, { col: INK });
    M.inert(g, ['x1', 'x2']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    S.f = {};
    const o = { col: NEW };
    const sub = { a: g => swap(M.node(g, 'sa'), M.row(M.op('·'), sn(Q.a, o))), b: g => swap(M.node(g, 'sb'), sn(Q.b, o)) };
    M.play(g, {
      moves(g) {
        const out = [];
        for (const L of ['b', 'a']) if (!S.f[L]) out.push({ drag: 'k' + L, to: 's' + L, busy: 0.1, then(g) { S.f[L] = true; sub[L](g); M.relayout(g, 'x'); const k = M.node(g, 'k' + L); k.alpha = 0.4; M.inert(g, ['k' + L]); g.sfx('snap'); } });
        if (out.length) return out;
        if (!S.xDone) return [{ tap: 'fr', busy: 0.1, askAt: 0, after: 0.1, ask: { v: Q.h, wrong: [-Q.h, 2 * Q.h, Q.h + 1] },
          then(g) { S.xDone = true; }, resolve(g) { S.xl.items[2] = M.num(Q.h, 'hv', { col: NEW, pop: g.t }); M.relayout(g, 'x'); g.sfx('coin'); } }];
        if (!S.inY) return [{ drag: 'hv', to: ['x1', 'x2'], area: [8, 180, 352, 240], busy: 0.1,
          then(g) { S.inY = true; S.yr.id = null; const n = rhs(Q, sn(Q.h, o), sn(Q.h, o)); n.id = 'yr'; n.pop = g.t; S.yr = n; line1(); g.sfx('snap'); const b = M.box(g, 'yr'); if (b) g.burst(b.x, b.y, ['#7ab8ff', '#fff'], 10, 110); } }];
        if (!S.yDone) return [{ tap: 'yr', busy: 0.1, askAt: 0, after: 0.1, ask: { v: Q.k, wrong: [-Q.k, Q.k + 2 * Q.c, Q.a * Q.h * Q.h - Q.b * Q.h + Q.c] },
          then(g) { S.yDone = true; }, resolve(g) { S.yr = M.row(M.num(Q.k, 'kv', { col: NEW, pop: g.t })); M.inert(g, ['kv']); line1(); S.litAt = g.t; g.sfx('chime'); } }];
        return [];
      },
      area(g) { const L = ['b', 'a'].find(L => !S.f[L]); return L ? ['k' + L, 's' + L] : !S.xDone ? ['fr'] : !S.inY ? ['hv', 'x1'] : ['yr']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Q = S.q, t = g.t;
    SCN.std(g, c, { scene: 'meadow', panel: PANEL, panelY: 284, panelH: 196, host: 'hedgehog', hostX: 312, hostY: 612, hostS: 1.0 });
    // graph paper in the grass, with the parabola drawn around its vertex
    const X0 = 40, X1 = 280, Y0 = 404, Y1 = 552, px = x => 160 + (x - Q.h) * 22, sy = 110 / (Q.a * 25), py = y => 538 - (y - Q.k) * sy;
    c.save(); c.translate(160, 478); c.rotate(-0.02); c.translate(-160, -478);
    c.fillStyle = 'rgba(40,60,20,0.25)'; c.fillRect(X0 + 4, Y0 + 6, X1 - X0, Y1 - Y0); c.fillStyle = '#f6fbff'; c.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
    c.beginPath(); c.rect(X0, Y0, X1 - X0, Y1 - Y0); c.clip();
    c.strokeStyle = 'rgba(80,140,200,0.22)'; c.lineWidth = 1; for (let x = Math.ceil(Q.h - 6); x <= Q.h + 6; x++) { c.beginPath(); c.moveTo(px(x), Y0); c.lineTo(px(x), Y1); c.stroke(); }
    c.strokeStyle = 'rgba(60,60,90,0.6)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X0, py(0)); c.lineTo(X1, py(0)); c.moveTo(px(0), Y0); c.lineTo(px(0), Y1); c.stroke();
    c.strokeStyle = '#3a6ab0'; c.lineWidth = 2.6; c.beginPath(); for (let x = Q.h - 6; x <= Q.h + 6; x += 0.05) { const y = py(Q.a * x * x + Q.b * x + Q.c); x > Q.h - 6 ? c.lineTo(px(x), y) : c.moveTo(px(x), y); } c.stroke();
    c.restore();
    if (S.litAt != null) { const k = M.clamp((t - S.litAt) / 0.3, 0, 1), x = px(Q.h), y = py(Q.k) - 6, p = 1 + 0.2 * Math.sin(t * 7);
      c.save(); c.globalAlpha = k; const gr = c.createRadialGradient(x, y, 0, x, y, 22 * p); gr.addColorStop(0, 'rgba(255,200,60,0.95)'); gr.addColorStop(1, 'rgba(255,200,60,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, 22 * p, 0, 7); c.fill();
      c.fillStyle = '#e8503a'; c.beginPath(); c.arc(x, y, 5.5, 0, 7); c.fill();
      c.font = M.NUMF(18); c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#fff'; const lab = `(${Q.h}, ${Q.k})`.replace(/-/g, '−'); c.strokeText(lab, x, y - 14); c.fillStyle = '#2a2440'; c.fillText(lab, x, y - 14); c.restore(); }
    M.drawEx(g, c, 'y'); M.drawEx(g, c, 'key'); M.drawEx(g, c, 'x');
    M.drawUI(g, c);
  },
});
