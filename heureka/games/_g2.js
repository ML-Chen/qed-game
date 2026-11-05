// _g2.js — small shared guidance helpers for agent g2's Heurēka! microgames (one global, G2). Draw-only: nothing here
// touches game state, so rewind stays deterministic.
// - G2.vis(g, o): how visible the ghost hand is right now (0..1), with the same rule as SK.demo: from o.delay (0.9 s)
//   until the first touch, then whenever the player has not touched for 1.4 s; 0 while the finger is down or once done.
// - G2.tapAt(g, c, x, y, press, o): the ghost hand over (x, y), pressing by `press` (0..1), for taps whose timing
//   matters (press only at the right instant), shown under G2.vis.
// - G2.dir(c, x, y, d, o): a big arrow badge, d = +1 (up, "more"), -1 (down, "less"), 0 (a green tick "just right").
// - G2.count(c, x, y, done, total, size): a "2 / 3" progress pill.
// - G2.path(g, c, pts, o): the ghost hand tracing a path (a list of [x, y]) under G2.vis, for traces and curved drags.
const G2 = (() => {
  const TAU = Math.PI * 2, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function vis(g, o = {}) {
    if (g.done || o.never || (g.ptr && g.ptr.down)) return 0;
    const idle = g.t - (g.lastIn ?? 0); let t0;
    if (!g.s.touched) t0 = o.delay ?? 0.9; else if (idle >= 1.4) t0 = (g.lastIn ?? 0) + 1.4; else return 0;
    return g.t < t0 ? 0 : clamp((g.t - t0) * 4, 0, 1);
  }
  function tapAt(g, c, x, y, press, o = {}) { const a = vis(g, o); if (a > 0) SK.hand(c, x, y + 10 * (1 - press), press, 0.9 * a); }
  function dir(c, x, y, d, o = {}) {
    const s = o.s ?? 1, col = d === 0 ? '#5ad87a' : (o.col || '#ffd45a');
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(30,14,36,0.78)'; c.beginPath(); c.arc(0, 0, 17, 0, TAU); c.fill();
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
    if (d === 0) { c.beginPath(); c.moveTo(-8, 0); c.lineTo(-2, 7); c.lineTo(9, -7); c.stroke(); }
    else { c.rotate(o.rot ?? (d > 0 ? 0 : Math.PI)); c.beginPath(); c.moveTo(0, -11); c.lineTo(10, 1); c.lineTo(4, 1); c.lineTo(4, 10); c.lineTo(-4, 10); c.lineTo(-4, 1); c.lineTo(-10, 1); c.closePath(); c.fill(); }
    c.restore();
  }
  function count(c, x, y, done, total, size = 20) { SK.tag(c, `${done} / ${total}`, x, y, size, done >= total ? '#9dffb0' : '#fff6ea'); }
  function along(pts, m) { let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let u = clamp(m, 0, 1) * L, i = 0; while (i < seg.length - 1 && u > seg[i]) { u -= seg[i]; i++; } const k = seg[i] ? u / seg[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; }
  function path(g, c, pts, o = {}) {
    const a = vis(g, o); if (a <= 0 || pts.length < 2) return; const idle = g.t - (g.lastIn ?? 0), t0 = !g.s.touched ? (o.delay ?? 0.9) : (g.lastIn ?? 0) + 1.4;
    const per = o.period ?? 2.2, k = ((g.t - t0) % per) / per, p = k < 0.1 ? k / 0.1 : k < 0.8 ? 1 : 1 - (k - 0.8) / 0.08, m = SK.easeInOut((k - 0.1) / 0.68), [x, y] = along(pts, m);
    if (p > 0.3 && k < 0.85) { c.save(); c.globalAlpha = 0.38 * a; c.strokeStyle = '#fff6ea'; c.lineWidth = 4; c.setLineDash([6, 8]); c.lineCap = 'round'; c.beginPath(); for (let i = 0; i <= 40; i++) { const q = along(pts, m * i / 40); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } c.stroke(); c.restore(); }
    SK.hand(c, x, y, clamp(p, 0, 1), 0.9 * a * (k > 0.88 ? 0 : 1)); void idle;
  }
  return { vis, tapAt, dir, count, path };
})();
