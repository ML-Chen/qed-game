// lines_intercept.js — INTERCEPTS! Where does ax + by = c cross the axes? On a frosted pane in the snow.
// A snowball with a 0 on it sits at the origin of a small graph. Drag it onto the x-term: x = 0, so the equation
// becomes by = c. Tap it to divide: y = c/b, and the y-intercept lights on the y-axis. The equation comes back, and
// dragging the 0 onto the y-term gives ax = c and then x = c/a on the x-axis. Either intercept may come first. When
// both are found the line is drawn through them.
// Level 0: small coefficients. Level 1: bigger ones. Level 2: a minus sign, so one intercept is negative.
// Medium mode: each division opens a tray.
const M = MK, INK = SCN.ink('glass'), CX = '#2a72c0', CY = '#c0306a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), gcd = (a, b) => b ? gcd(b, a % b) : a;
  for (;;) {
    const a = L === 0 ? r(2, 4) : r(2, 6); let b = L === 0 ? r(2, 4) : r(2, 6); if (a === b) continue;
    const lcm = a * b / gcd(a, b), c = lcm * r(1, 3), xi = c / a, yi = c / b;
    if (xi > 9 || yi > 9 || c > 36) continue;
    if (L === 2) b = -b;
    return { a, b, c, xi, yi: c / b };
  }
}
const term = (k, v, id, col) => { const r = M.row(Math.abs(k) === 1 ? null : M.num(Math.abs(k), null, { col }), M.vr(v, null, { col })); r.id = id; return r; };

MG.add({
  id: 'lines_intercept', stage: 'lines', cmd: 'INTERCEPTS!', hint: 'drag', time: 10, winText: 'Crossed!', hold: 1.4,
  card: {
    title: 'Intercepts', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'An intercept is a place where a line crosses an axis. At the x-intercept the line crosses the x-axis, so y = 0 there. At the y-intercept it crosses the y-axis, so x = 0 there.\n\nSo to find the y-intercept, put 0 in place of x and solve for y. To find the x-intercept, put 0 in place of y and solve for x.\n\nFor example, in 2x + 3y = 12, putting x = 0 leaves 3y = 12, so y = 4. Putting y = 0 leaves 2x = 12, so x = 6. The line crosses the axes at (0, 4) and (6, 0).\n\nTwo points are enough to draw a straight line, so the two intercepts are a quick way to graph it.',
    note: 'For the y-intercept, set x = 0 and solve for y. For the x-intercept, set y = 0 and solve for x.',
    ask: 'Where does 3x + 4y = 24 cross each axis? Where does x − 2y = 6 cross the y-axis?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g); S.got = {};
    S.full = () => M.row(term(p.a, 'x', 'tx', CX), M.op(p.b < 0 ? '-' : '+', 'pl'), term(p.b, 'y', 'ty', CY), M.op('=', 'eq'), M.num(p.c, 'c'));
    S.eq = S.full(); S.zero = M.num(0, 'z');
    // the small graph: both axes, fitted around the origin and both intercepts
    const xa = Math.min(0, p.xi) - 1, xb = Math.max(0, p.xi) + 1, ya = Math.min(0, p.yi) - 1, yb = Math.max(0, p.yi) + 1;
    const ux = 270 / (xb - xa), uy = 128 / (yb - ya); S.G = { xa, xb, ya, yb, PX: x => 45 + (x - xa) * ux, PY: y => 400 - (y - ya) * uy };
    const place = S.place = () => { M.place(g, 'eq', S.eq, 180, 230, 38, { col: INK }); M.place(g, 'z', S.zero, S.G.PX(0), S.G.PY(0) + 10, 26, { col: '#2a3a5a' }); };
    place(); M.inert(g, ['pl', 'eq']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const solve = (v) => {
      // v is the variable that is left once the other is 0
      const k = v === 'y' ? p.b : p.a, ans = p.c / k, col = v === 'y' ? CY : CX;
      return { tap: ['k', 'kv', 'c'], busy: 0.4, after: 0.4, ask: { v: ans, wrong: [p.c - k, p.c * k, v === 'y' ? p.xi : p.yi, -ans] }, then() { S.tapped = 1; },
        resolve(g) { S.eq = M.row(M.vr(v, null, { col }), M.op('=', 'eq'), M.num(ans, 'ans', { pop: g.t, col })); M.inert(g, ['ans']); S.got[v] = g.t; S.cur = null; S.tapped = 0; place(); g.sfx('coin');
          const b = M.box(g, 'ans'); if (b) M.fly(g, { node: M.num(ans, null, { col }), from: [b.x, b.y], to: v === 'y' ? [S.G.PX(0), S.G.PY(p.yi)] : [S.G.PX(p.xi), S.G.PY(0)], dur: 0.3, s0: 38, s1: 16 });
          if (!(S.got.x && S.got.y)) M.later(g, 0.4, g => { S.eq = S.full(); place(); }); else g.sfx('chime'); } };
    };
    M.play(g, {
      moves(g) {
        if (S.cur) return S.tapped ? [] : [solve(S.cur)];
        const out = [], zero = (to, v) => ({ drag: 'z', to, busy: 0.1, then(g) {
          const k = v === 'y' ? p.b : p.a, col = v === 'y' ? CY : CX, b0 = M.box(g, to); S.cur = v; S.zeroAt = g.t; g.sfx('crunch');
          S.eq = M.row(M.row(M.num(k, 'kv', { col }), M.vr(v, null, { col })), M.op('=', 'eq'), M.num(p.c, 'c')); S.eq.items[0].id = 'k'; place();
          if (b0) g.burst(b0.x, b0.y, ['#fff', '#cfe8ff'], 12, 120); } });
        if (!S.got.y) out.push(zero('tx', 'y'));
        if (!S.got.x) out.push(zero('ty', 'x'));
        return out;
      },
      area(g) { return S.cur ? ['k'] : ['z']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, p = S.p, G = S.G, t = g.t;
    SCN.std(g, c, { scene: 'snow', panel: 'glass', host: 'penguin', hostX: 70, hostY: 596, hostS: 1.3, panelY: 300, panelH: 236 });
    // the axes, with a tick at every whole number
    c.save(); c.strokeStyle = 'rgba(42,24,64,0.75)'; c.lineWidth = 2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(G.PX(G.xa), G.PY(0)); c.lineTo(G.PX(G.xb), G.PY(0)); c.moveTo(G.PX(0), G.PY(G.ya)); c.lineTo(G.PX(0), G.PY(G.yb)); c.stroke();
    c.lineWidth = 1.5; for (let x = G.xa + 1; x < G.xb; x++) { c.beginPath(); c.moveTo(G.PX(x), G.PY(0) - 4); c.lineTo(G.PX(x), G.PY(0) + 4); c.stroke(); }
    for (let y = G.ya + 1; y < G.yb; y++) { c.beginPath(); c.moveTo(G.PX(0) - 4, G.PY(y)); c.lineTo(G.PX(0) + 4, G.PY(y)); c.stroke(); }
    c.font = 'italic 700 15px Georgia, serif'; c.fillStyle = 'rgba(42,24,64,0.8)'; c.fillText('x', G.PX(G.xb) - 4, G.PY(0) - 8); c.fillText('y', G.PX(0) + 8, G.PY(G.yb) + 10);
    // the line through both intercepts, once both are found
    if (S.got.x && S.got.y) { const k = M.ease((t - Math.max(S.got.x, S.got.y)) / 0.35), sl = -p.a / p.b, f = x => p.yi + sl * x;
      c.save(); c.beginPath(); c.rect(G.PX(G.xa), G.PY(G.yb), G.PX(G.xb) - G.PX(G.xa), G.PY(G.ya) - G.PY(G.yb)); c.clip();
      const x0 = M.lerp(p.xi / 2, G.xa - 2, k), x1 = M.lerp(p.xi / 2, G.xb + 2, k); c.strokeStyle = '#7a4ad0'; c.lineWidth = 3; c.beginPath(); c.moveTo(G.PX(x0), G.PY(f(x0))); c.lineTo(G.PX(x1), G.PY(f(x1))); c.stroke(); c.restore(); }
    // an intercept lights up on its axis with its point written beside it
    c.font = '700 15px Fredoka, Nunito, sans-serif'; c.textBaseline = 'middle';
    for (const [v, x, y, col] of [['x', p.xi, 0, CX], ['y', 0, p.yi, CY]]) {
      const at = S.got[v]; if (!at) continue; const k = M.clamp((t - at - 0.25) / 0.2, 0, 1), X = G.PX(x), Y = G.PY(y);
      c.save(); c.globalAlpha = k; c.shadowColor = col; c.shadowBlur = 14 + Math.sin(t * 5) * 5; c.fillStyle = col; c.beginPath(); c.arc(X, Y, 7, 0, 7); c.fill(); c.shadowBlur = 0;
      c.fillStyle = '#fff'; c.beginPath(); c.arc(X, Y, 3, 0, 7); c.fill();
      const s = `(${x}, ${y})`.replace(/-/g, '−'); c.textAlign = v === 'x' ? 'center' : 'left'; c.fillStyle = col; c.fillText(s, v === 'x' ? X : X + 12, v === 'x' ? Y + (p.yi > 0 ? 16 : -16) : Y); c.restore();
    }
    // the 0 is a snowball resting at the origin
    const zb = M.box(g, 'z'); if (zb && !(S.got.x && S.got.y)) { const n = M.node(g, 'z'); c.save(); c.globalAlpha = n && n.alpha != null ? n.alpha : 1;
      const gr = c.createRadialGradient(zb.x - 5, zb.y - 6, 2, zb.x, zb.y, 19); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#c8dcf0'); c.fillStyle = gr; c.beginPath(); c.arc(zb.x, zb.y, 18, 0, 7); c.fill();
      c.strokeStyle = 'rgba(80,110,150,0.5)'; c.lineWidth = 1.5; c.stroke(); c.restore(); }
    if (!(S.got.x && S.got.y) || g.done) M.drawEx(g, c, 'z');
    M.drawEx(g, c, 'eq');
    M.drawUI(g, c);
  },
});
