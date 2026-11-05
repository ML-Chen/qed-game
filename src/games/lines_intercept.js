// lines_intercept.js — INTERCEPTS! Where does ax + by = c cross the axes? On a frosted pane in the snow.
// A snowball with a 0 on it sits at the origin of a small graph. Every move acts out its working (show your work):
//   1. Drag the 0 onto the x-term: the term is circled, the 0 lands in place of x ("4 · 0"), the · and the 0 slide into
//      the coefficient, which rolls over to 0; the 0 and the + are crossed out and fade, and "3y = 24" glides together.
//   2. Tap what is left to divide: "÷ 3" writes itself under both sides, the 3 shrinks away, 24 rolls over to 8, and
//      the 8 flies to the y-axis, where (0, 8) lights up. The whole equation writes itself back in.
// The same for the y-term (y = 0 gives ax = c and the x-intercept). Either intercept may come first. When both are
// found the line draws itself through them.
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
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
const R = (id, ...items) => { const r = M.row(...items); if (id) r.id = id; return r; };

MG.add({
  id: 'lines_intercept', stage: 'lines', cmd: 'INTERCEPTS!', hint: 'drag', time: 10, winText: 'Crossed!', hold: 1.4,
  card: {
    title: 'Intercepts', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'An intercept is a place where a line crosses an axis. At the x-intercept the line crosses the x-axis, so y = 0 there. At the y-intercept it crosses the y-axis, so x = 0 there.\n\nSo to find the y-intercept, put 0 in place of x and solve for y. To find the x-intercept, put 0 in place of y and solve for x.\n\nFor example, in 2x + 3y = 12, putting x = 0 leaves 3y = 12, so y = 4. Putting y = 0 leaves 2x = 12, so x = 6. The line crosses the axes at (0, 4) and (6, 0).\n\nTwo points are enough to draw a straight line, so the two intercepts are a quick way to graph it.',
    note: 'For the y-intercept, set x = 0 and solve for y. For the x-intercept, set y = 0 and solve for x.',
    ask: 'Where does 3x + 4y = 24 cross each axis? Where does x − 2y = 6 cross the y-axis?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = S.T = M.pace(g); S.got = {};
    // the equation is built from leaf symbols that are kept between rewrites (so they glide); wrappers are new each time
    const leaves = () => { S.L = { kx: M.num(p.a, 'kx', { col: CX }), xv: M.vr('x', 'xv', { col: CX }), pl: M.op(p.b < 0 ? '-' : '+', 'pl'), ky: M.num(Math.abs(p.b), 'ky', { col: CY }), yv: M.vr('y', 'yv', { col: CY }), eqs: M.op('=', 'eq'), cn: M.num(p.c, 'c') }; };
    S.build = () => { const L = S.L; if (S.form) return S.form();
      return M.row(R('tx', L.kx, S.cur === 'y' && S.sub ? (S.sub === 'zero' ? null : [L.dot, L.z0]) : L.xv), L.pl, R('ty', L.ky, S.cur === 'x' && S.sub ? (S.sub === 'zero' ? null : [L.dot, L.z0]) : L.yv), L.eqs, L.cn); };
    leaves(); S.leaves = leaves; S.zero = M.num(0, 'z');
    // the small graph: both axes, fitted around the origin and both intercepts
    const xa = Math.min(0, p.xi) - 1, xb = Math.max(0, p.xi) + 1, ya = Math.min(0, p.yi) - 1, yb = Math.max(0, p.yi) + 1;
    const ux = 270 / (xb - xa), uy = 128 / (yb - ya); S.G = { xa, xb, ya, yb, PX: x => 45 + (x - xa) * ux, PY: y => 400 - (y - ya) * uy };
    const place = S.place = () => { M.place(g, 'eq', S.build(), 180, 230, 38, { col: INK }); M.place(g, 'z', S.zero, S.G.PX(0), S.G.PY(0) + 10, 26, { col: '#2a3a5a' }); };
    place(); M.inert(g, ['pl', 'eq', 'dot', 'z0']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    // dropping the 0 on a term: that variable is 0, so its term is 0 and drops out
    const zero = (v) => ({ drag: 'z', to: v === 'y' ? ['tx', 'kx', 'xv'] : ['ty', 'ky', 'yv'], busy: 0.1, then(g) {
      const L = S.L, gone = v === 'y' ? 'x' : 'y', kn = v === 'y' ? L.kx : L.ky, col = v === 'y' ? CX : CY; S.cur = v; S.sub = true; S.point = true;
      M.show(g, 1.35 * T); hop(g, 'think'); g.sfx('crunch');
      L.dot = M.op('·', 'dot', { col }); L.z0 = M.num(0, 'z0', { col: '#5a8ac8', _born: -1, pop: g.t }); place();
      const b0 = M.box(g, 'z0'); if (b0) g.burst(b0.x, b0.y, ['#fff', '#cfe8ff'], 12, 120);
      M.circle(g, gone === 'x' ? 'tx' : 'ty', { col: '#7ab8ff', dur: 0.4 * T });
      M.at(g, [
        [0.4 * T, g => { const bk = M.box(g, kn.id); for (const q of [L.dot, L.z0]) { const b = M.box(g, q.id); M.tween(g, q, { dx: bk && b ? bk.x - b.x : -20, alpha: 0, sc: 0.5 }, 0.28 * T); }
          M.roll(g, kn, 0, { delay: 0.1 * T, dur: 0.3 * T }); g.sfx('tap'); }],
        [0.78 * T, g => { // the 0 term and its sign drop out
          S.sub = 'zero'; place(); M.strike(g, kn, { dur: 0.22 * T, col: '#ff6a5a' }); if (v === 'x' || p.b > 0) M.strike(g, L.pl, { dur: 0.2 * T, delay: 0.05 * T, col: '#ff6a5a' }); g.sfx('swoosh'); }],
        [1.02 * T, g => { M.tween(g, kn, { alpha: 0, sc: 0.6 }, 0.2 * T); M.tween(g, L.pl, { alpha: 0 }, 0.2 * T); }],
        [1.22 * T, g => { // what is left glides together: b·y = c or a·x = c (a minus sign joins the coefficient)
          const k = v === 'y' ? L.ky : L.kx; if (v === 'y' && p.b < 0) { k.v = '−' + k.v; k.pop = g.t; }
          S.form = () => M.row(R('lhs', k, v === 'y' ? L.yv : L.xv), L.eqs, L.cn); S.kc = k; place(); hop(g); g.sfx('pop'); S.point = false; }]]); } });
    // dividing both sides by the coefficient: the variable is alone, and its value flies to its axis
    const solve = (v) => {
      const k = v === 'y' ? p.b : p.a, ans = p.c / k, col = v === 'y' ? CY : CX;
      return { tap: ['lhs', 'c', v === 'y' ? 'ky' : 'kx', v === 'y' ? 'yv' : 'xv'], busy: 0.1, askAt: 0.65 * T, after: 1.5 * T, ask: { v: ans, wrong: [p.c - k, p.c * k, v === 'y' ? p.xi : p.yi, -ans] },
        then(g) { S.tapped = 1; M.show(g, 0.65 * T); S.point = true; hop(g, 'think'); M.circle(g, S.kc, { col, dur: 0.4 * T }); M.light(g, S.kc, { col: '#ffd45a' }); g.sfx('tap');
          const dv = () => M.row(M.op('÷'), k < 0 ? M.paren(M.num(k)) : M.num(k));
          M.note(g, { node: dv(), at: 'lhs', off: [k < 0 ? -14 : 0, 40], s: k < 0 ? 22 : 26, col: '#3a5aa0', delay: 0.1 * T, write: 0.25 * T, hold: 0.6 * T, fade: 0.2 * T });
          M.note(g, { node: dv(), at: 'c', off: [k < 0 ? 22 : 6, 40], s: k < 0 ? 22 : 26, col: '#3a5aa0', delay: 0.22 * T, write: 0.25 * T, hold: 0.5 * T, fade: 0.2 * T }); },
        resolve(g) { M.show(g, 1.5 * T); const L = S.L; M.tween(g, S.kc, { alpha: 0, sc: 0.4 }, 0.25 * T); M.roll(g, L.cn, ans, { dur: 0.35 * T }); L.cn.col = col; g.sfx('ding');
          M.at(g, [
            [0.3 * T, g => { const vv = v === 'y' ? L.yv : L.xv; S.form = () => M.row(vv, L.eqs, L.cn); place(); M.inert(g, ['c']); }],
            [0.45 * T, g => { const b = M.box(g, 'c'); M.sparkle(g, 'c', { n: 10, cols: [col, '#fff'] }); g.sfx('coin'); hop(g);
              if (b) M.fly(g, { node: M.num(ans), from: [b.x, b.y], to: v === 'y' ? [S.G.PX(0), S.G.PY(p.yi)] : [S.G.PX(p.xi), S.G.PY(0)], dur: 0.4 * T, arc: -40, s0: 38, s1: 16, col,
                then(g) { S.got[v] = g.t; g.sfx('chime'); const q = v === 'y' ? [S.G.PX(0), S.G.PY(p.yi)] : [S.G.PX(p.xi), S.G.PY(0)]; g.burst(q[0], q[1], [col, '#fff', '#cfe8ff'], 12, 120); } }); }],
            [1.1 * T, g => { S.cur = null; S.tapped = 0; S.sub = false; S.point = false; S.form = null;
              if (S.got.x && S.got.y) { hop(g, 'laugh'); return; }
              for (const q of Object.values(S.L)) q.alpha = 0; leaves(); place(); for (const q of Object.values(S.L)) q._born = -1; M.writeIn(g, g.s.mk.ex.eq.node, { dur: 0.35 * T }); }]]); } };
    };
    M.play(g, {
      moves(g) {
        if (S.cur) return S.form && !S.tapped ? [solve(S.cur)] : [];
        const out = [];
        if (!S.got.y) out.push(zero('y'));
        if (!S.got.x) out.push(zero('x'));
        return out;
      },
      area(g) { return S.cur ? ['lhs'] : ['z']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, p = S.p, G = S.G, t = g.t;
    SCN.std(g, c, { scene: 'snow', panel: 'glass', panelY: 300, panelH: 236 }); host(g, c, 'penguin', 70, 596, 1.3, 1);
    // the axes, with a tick at every whole number
    c.save(); c.strokeStyle = 'rgba(42,24,64,0.75)'; c.lineWidth = 2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(G.PX(G.xa), G.PY(0)); c.lineTo(G.PX(G.xb), G.PY(0)); c.moveTo(G.PX(0), G.PY(G.ya)); c.lineTo(G.PX(0), G.PY(G.yb)); c.stroke();
    c.lineWidth = 1.5; for (let x = G.xa + 1; x < G.xb; x++) { c.beginPath(); c.moveTo(G.PX(x), G.PY(0) - 4); c.lineTo(G.PX(x), G.PY(0) + 4); c.stroke(); }
    for (let y = G.ya + 1; y < G.yb; y++) { c.beginPath(); c.moveTo(G.PX(0) - 4, G.PY(y)); c.lineTo(G.PX(0) + 4, G.PY(y)); c.stroke(); }
    c.font = 'italic 700 15px Georgia, serif'; c.fillStyle = 'rgba(42,24,64,0.8)'; c.fillText('x', G.PX(G.xb) - 4, G.PY(0) - 8); c.fillText('y', G.PX(0) + 8, G.PY(G.yb) + 10);
    // the line through both intercepts, once both are found
    if (S.got.x && S.got.y) { const k = M.ease((t - Math.max(S.got.x, S.got.y) - 0.15 * S.T) / (0.5 * S.T)), sl = -p.a / p.b, f = x => p.yi + sl * x;
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
